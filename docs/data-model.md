# Firestore data model

This is the contract every TrackerHeart app (web, iOS, Android) follows when
reading and writing Firestore. `firebase/firestore.rules` enforces it, and the
web app's `web/src/utils/firestore.ts` is the reference implementation.

Change this file, the rules and their tests, and every app together.

## Identity

Every user is signed in with Firebase **Anonymous Auth** before any read or
write. `request.auth.uid` identifies one browser or app install. Documents
record their owner's uid, and the rules check it.

## Collections

Field names are case-sensitive. Documents must contain **exactly** the listed
fields on create. Extra or missing fields are rejected.

`server` means the value must be `FieldValue.serverTimestamp()` (the rules
compare it to `request.time`). Integers must be stored as integers, not doubles.

### `Games/{gameId}`

`gameId` is an auto-generated document ID.

| Field            | Type      | Rule                                   | Editable |
| ---------------- | --------- | -------------------------------------- | -------- |
| `name`           | string    | at most 100 characters                 | yes      |
| `gameMasterName` | string    | at most 100 characters                 | yes      |
| `fear`           | int       | 0–12                                   | yes      |
| `shareCode`      | string    | `^[0-9A-Z]{6}$`, claimed in ShareCodes | no       |
| `ownerUid`       | string    | the GM's uid                           | no       |
| `createdAt`      | timestamp | server, on create                      | no       |
| `lastModifiedAt` | timestamp | server, on every write                 | yes      |

- **get:** any signed-in user. Players follow their Game's Fear by ID.
- **list:** only queries filtered on `ownerUid == uid`.
- **update:** owner only, and only the editable fields.
- **delete:** owner only.

### `ShareCodes/{code}`

The document ID is the share code. It maps a code to its Game.

| Field      | Type   | Rule                       |
| ---------- | ------ | -------------------------- |
| `gameId`   | string | the Game holding this code |
| `ownerUid` | string | the GM's uid               |

- **get:** any signed-in user. **list** and **update:** never, so codes can't be
  enumerated or taken over.
- **create:** only in the same batch as the Game it names (see "Creating a
  Game").
- **delete:** owner only.

### `Characters/{characterId}`

`characterId` is an auto-generated document ID.

| Field            | Type      | Rule                   | Editable |
| ---------------- | --------- | ---------------------- | -------- |
| `name`           | string    | at most 100 characters | yes      |
| `playerName`     | string    | at most 100 characters | yes      |
| `hope`           | int       | 0–6                    | yes      |
| `maxHitPoints`   | int       | 0–12                   | yes      |
| `hitPoints`      | int       | 0–`maxHitPoints`       | yes      |
| `maxStress`      | int       | 0–12                   | yes      |
| `stress`         | int       | 0–`maxStress`          | yes      |
| `maxArmorSlots`  | int       | 0–12                   | yes      |
| `armorSlots`     | int       | 0–`maxArmorSlots`      | yes      |
| `ownerUid`       | string    | the player's uid       | no       |
| `createdAt`      | timestamp | server, on create      | no       |
| `lastModifiedAt` | timestamp | server, on every write | yes      |

`hitPoints`, `stress` and `armorSlots` count **marked** slots out of their max.

- **get:** the owner, or the GM of the Game the Character has joined.
- **list:** only queries filtered on `ownerUid == uid`. The GM can't list a
  Game's Characters; they read each one by ID.
- **update:** owner only, and only the editable fields.
- **delete:** owner only.

### `GameCharacters/{characterId}`

Links a Character to the Game it has joined. The document ID is the
`characterId`, since a Character plays in one Game at a time.

| Field            | Type      | Rule                                         |
| ---------------- | --------- | -------------------------------------------- |
| `characterId`    | string    | equals the document ID; owned by `playerUid` |
| `gameId`         | string    | the Game named by `shareCode`                |
| `playerUid`      | string    | the caller's uid                             |
| `gmUid`          | string    | the `ownerUid` of `ShareCodes/{shareCode}`   |
| `shareCode`      | string    | proves the player was invited                |
| `createdAt`      | timestamp | server, on every create or update            |
| `lastModifiedAt` | timestamp | server, on every create or update            |

- **read:** the player or the GM. Queries must filter on `playerUid == uid` or
  `gmUid == uid`.
- **create / update:** the player, with every field valid as above. Updating
  switches the Character to another Game.
- **delete:** the player (leaving) or the GM (removing the Character).

## Share codes

- Six characters, each drawn **uniformly** from `0-9A-Z`. Use a
  cryptographically secure random source and discard random bytes ≥ 252 to avoid
  bias (see `web/src/utils/utils.ts`).
- Shown to players with spaces between characters.
- When a player enters a code, strip all whitespace and uppercase it before
  matching. If the result doesn't match `^[0-9A-Z]{6}$`, report "no such Game"
  without querying.

## Write sequences

The rules check several of these across documents, so the steps and batching
must match exactly.

### Creating a Game

1. Generate a share code. If `ShareCodes/{code}` already exists, generate
   another.
2. In **one batch**:
   - set `Games/{new id}` with all Game fields
   - set `ShareCodes/{code}` to `{gameId, ownerUid}`
3. If the batch fails with permission denied, another GM probably took the code
   at the same moment: start again from step 1, up to 5 attempts in all.

### Updating a Game or Character

Update only the editable fields, plus `lastModifiedAt` = server timestamp.

### Deleting a Game

1. Query `GameCharacters` where `gameId == gameId` and `gmUid == uid`.
2. In **one batch**, delete the Game, `ShareCodes/{its shareCode}`, and every
   mapping from step 1.

### Creating a Character

Set `Characters/{new id}` with all fields, `ownerUid` = uid, and both timestamps
= server timestamp.

### Deleting a Character

1. Query `GameCharacters` where `characterId == characterId` and
   `playerUid == uid`. (Query rather than delete by ID: deleting a mapping that
   doesn't exist is rejected.)
2. In **one batch**, delete the Character and any mapping from step 1.

### Joining a Game

1. Normalize the share code (see "Share codes").
2. Get `ShareCodes/{code}`. If it doesn't exist, there's no such Game.
3. Get `Games/{gameId}`. If it doesn't exist, there's no such Game.
4. Set `GameCharacters/{characterId}` with `gmUid` = the ShareCodes entry's
   `ownerUid` and both timestamps = server timestamp. This also replaces any
   earlier mapping, which switches Games.

### Leaving a Game, or the GM removing a Character

Delete `GameCharacters/{characterId}`.

## Live updates

Each detail screen follows its data with snapshot listeners:

- **GM's Game screen:** listen to `Games/{gameId}`; treat a Game whose
  `ownerUid` isn't the caller's as not found. To follow its Characters, listen
  to `GameCharacters` where `gameId == gameId` and `gmUid == uid`, then open
  **one listener per `Characters/{characterId}`**, adding and removing listeners
  as mappings come and go. A permission error on one Character means it just
  left the Game.
- **Player's Character screen:** listen to `Characters/{characterId}`, where
  permission denied means not found. To show the GM's Fear, listen to
  `GameCharacters` where `characterId == characterId` and `playerUid == uid`,
  then to the `Games/{gameId}` it names, switching when the mapping changes.

## Indexes

All queries use only equality filters, which Firestore serves from its automatic
single-field indexes. No composite indexes are needed.
