# TrackerHeart

TrackerHeart is a real-time resource tracker for
[Daggerheart](https://www.daggerheart.com), the tabletop role-playing game. The
Game Master (GM) and every player at the table see the same numbers, and the
numbers update for everyone as soon as anyone saves a change.

## What it does

The home page lists your Games and your Characters, depending on whether you GM,
play, or do both.

### For Game Masters

- Create a Game with a name and GM name. Fear starts at 0; set it to the number
  of players once the table is ready.
- Each Game gets a unique 6-character share code for players to join with. A
  button copies it.
- On the Game page, set and save the GM's **Fear** (0–12), and see every joined
  Character's Hit Points, Stress, Armor Slots, and Hope update as their players
  save them.
- Remove a Character from the Game.

### For Players

- Create a Character with a name, player name, and values and max values for:
  Hit Points, Stress, and Armor Slots.
- On the Character page, mark and clear **Hit Points**, **Stress**, and **Armor
  Slots**, and set **Hope** (0–6).
- Join a Game by entering the GM's share code, then see the GM's Fear amount on
  the Character page.
- Leave a Game at any time.

### Accounts

There is no sign-up or login. Games and Characters you create belong to your
browser. If you clear the site data or switch browsers or devices, you can no
longer get to them.

## Repository layout

| Folder      | What it is                                                   |
| ----------- | ------------------------------------------------------------ |
| `web/`      | Next.js web app                                              |
| `ios/`      | Native iOS app (Swift, SwiftUI) — not started yet            |
| `android/`  | Native Android app (Kotlin, Compose) — not started yet       |
| `firebase/` | Firestore security rules and their tests, shared by all apps |

### Web

```sh
cd web
npm install
npm run dev
```

### Firebase

The Firestore rules, and the tests every app relies on, live in `firebase/`. The
tests run against the Firestore emulator, which needs Java 21 or later.

```sh
cd firebase
npm install
npm test              # rules tests against the emulator
npm run deploy:rules  # deploy firestore.rules to production
```

`docs/data-model.md` describes the Firestore collections and write sequences
that every app must follow.

## License

The code is released under the [MIT License](LICENSE).

TrackerHeart is an independent product published under the Darrington Press
Community Gaming License. It includes material from the Daggerheart System
Reference Document 1.0, © Critical Role, LLC. See the in-app
[License & Credits](web/src/pages/license.tsx) page for details.
