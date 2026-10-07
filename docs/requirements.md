# TrackerHeart requirements

What TrackerHeart does and how it should behave, for whoever builds any of its
apps: web (`web/`), iOS (`ios/`) or Android (`android/`). Two companion docs
cover the rest:

- `docs/monorepo-plan.md`: how the repo is laid out, how each app is set up, and
  which web files each native file ports.
- `docs/data-model.md`: the Firestore contract every app must follow exactly.

The web app is the reference implementation.

## Role

You're a senior developer on the platform you're working in:

| App     | Language and UI                 | Conventions                                                                               |
| ------- | ------------------------------- | ----------------------------------------------------------------------------------------- |
| Web     | TypeScript, React, Tailwind CSS | Functional components with hooks; TypeScript interfaces for all props; minimal custom CSS |
| iOS     | Swift, SwiftUI (iOS 17+)        | `@Observable` view models, `NavigationStack`, async/await, Swift concurrency              |
| Android | Kotlin, Jetpack Compose         | ViewModels with `StateFlow`, Navigation Compose, coroutines and `Flow`                    |

Write idiomatic code for that platform rather than translating the web app line
by line. Match the web app's behavior, not its structure.

## Background

TrackerHeart tracks resources for [Daggerheart](https://www.daggerheart.com), a
tabletop role-playing game. A table has one Game Master (GM) and several
players, each playing a Character. Everyone sees the same numbers, and saved
changes appear for everyone right away.

- The **GM** creates and edits Games. A Game has a resource called **Fear**, an
  integer from 0 to 12. A new Game starts at 0 Fear. In Daggerheart, the GM
  starts with Fear equal to the number of players, which isn't known when the
  Game is created, so the GM sets it once the table is ready.
- Each Game has a unique 6-character **Invite Code** (called the share code in
  code and data) that players use to join it.
- **Players** create and edit Characters. A Character has four resources:
  - **Hope**: 0 to 6.
  - **Hit Points**, **Stress** and **Armor Slots**: each has a Max (0 to 12) and
    a number of marked slots (0 to its Max).
- A Character plays in at most one Game at a time.
- **Changes are saved with a Save button.** Edits to a Game or Character,
  including tapping resource icons, stay on that screen until the user presses
  Save. Once saved, everyone viewing that Game or Character sees the change
  right away without refreshing.
- The same person can be a GM, a player, or both.

## All apps

- **Backend:** Google Cloud Firestore with real-time listeners, using the
  Firebase SDK for the platform. All three apps share one Firebase project
  (`trackerheart-ed2ae`) and must follow `docs/data-model.md` exactly.
- **No accounts:** every user is signed in silently with Firebase Anonymous
  Auth. What they create belongs to that browser or app install. There is no
  sign-up, login or account screen.
- **Layout:** works on phones and larger screens. Web is fully responsive;
  native apps support all device sizes and both light and dark system
  appearance, keeping the brand colors in both.
- **Accessibility:** every control has an accessible label. Read-only resource
  displays announce their value, for example "Fear: 5 of 12".

## Screens

Names below are the screen names used in the porting map in
`docs/monorepo-plan.md`.

### Home

- App title "Trackerheart" and subtitle "An app to track GM & Player resources
  in Daggerheart".
- **"As GM, Your Games:"**: the user's Games, each opening its Game screen, or
  "You do not have any Games." Then an "Add New Game" button.
- **"As a Player, Your Characters:"**: the user's Characters, each opening its
  Character screen, or "You do not have any Characters." Then an "Add New
  Character" button.
- A "License & Credits" link.

### New Game and Game

One form serves both creating and editing a Game.

- Fields: **Game name** (required) and **GM name**.
- **Invite Code** (existing Games only): read-only, shown with spaces between
  the characters (`A B C 1 2 3`), with a **Copy** button that copies the code
  without spaces. Confirm with "Invite Code copied." or report "Unable to copy,
  please try again."
- **Fear**: 12 tappable skull icons, 0 to 12, starting at 0 for a new Game, with
  a **Clear** button that sets it to 0.
- Buttons: **Home**, **Delete** (existing Games only), **Save**.
  - Save on a new Game creates it and opens its Game screen showing "Game
    saved." Save on an existing Game shows "Game saved." On failure show "Error
    saving, please try again."
  - Delete asks "Are you sure you want to delete <name>? This cannot be undone."
    It deletes the Game, frees its Invite Code, and removes every Character from
    it, then returns Home. On failure show "Error deleting, please try again."
- **"Characters in game: <count>"** (only when there are any): each joined
  Character's name and player name, with Hope, Hit Points, Stress and Armor
  Slots shown read-only and updating whenever the player saves. Each has a
  **Remove from Game** button that asks "Remove <character> from <game>?"

### New Character and Character

One form serves both creating and editing a Character.

- Fields: **Character name** (required) and **Player name**.
- **Hope**: 6 tappable heart icons, with **Clear**.
- **Hit Points** (cross icon), **Stress** (star icon) and **Armor Slots**
  (shield icon): each has a **Max** picker (0 to 12), 12 tappable icons where
  icons beyond Max are shown disabled, and **Clear**. Lowering Max below the
  marked count lowers the marked count to match.
- Buttons: **Home**, **Delete** (existing Characters only), **Save**, with the
  same behavior and messages as the Game form ("Character saved."). Delete also
  removes the Character from its Game.
- **When the Character is in a Game:** "This character is part of <game> by
  <GM name>", the GM's **Fear** shown read-only and updating whenever the GM
  saves, and a **Leave Game** button that asks "Leave <game>?"
- **When it isn't:** a **Join a Game** form with an **Invite Code** field and a
  **Join Game** button. Accept the code in any case and with or without spaces.
  Show "No Game found with that Share Code." or "Unable to join this Game.
  Please try again." The screen switches to the joined Game as soon as the join
  succeeds.
- Only saved Characters can join or leave Games.

### License & Credits

- The "Daggerheart Compatible" banner and Daggerheart logo, both in
  `web/public/`.
- This text, with working links: "This product includes material from the
  Daggerheart System Reference Document 1.0, © Critical Role, LLC, under the
  terms of the Darrington Press Community Gaming License
  (https://darringtonpress.com/license)." and "More information available at:
  https://www.daggerheart.com".
- The MIT License for the rest of the software, as in
  `web/src/pages/license.tsx` and the repo's `LICENSE` file.

## Resource icons

Every resource is a row of icons. Rows of 12 wrap after the sixth icon.

| Resource    | Icon   | Slots                 |
| ----------- | ------ | --------------------- |
| Fear        | skull  | 12                    |
| Hope        | heart  | 6                     |
| Hit Points  | cross  | 12, enabled up to Max |
| Stress      | star   | 12, enabled up to Max |
| Armor Slots | shield | 12, enabled up to Max |

Each icon has three states: **filled** (marked), **empty** (available) and
**disabled** (beyond Max). Tapping an icon sets the value to that icon's number.
The SVGs are in `web/public/icons/` (`<icon>.svg`, `<icon>-filled.svg`,
`<icon>-disabled.svg`). Native apps convert them to their platform's vector
format (an Xcode asset catalog, Android vector drawables) rather than redrawing
them.

## Visual design

| Token  | Hex       | Used for                                     |
| ------ | --------- | -------------------------------------------- |
| purple | `#6946a6` | screen background                            |
| gray   | `#f3f5f8` | body text                                    |
| gold   | `#e7c74b` | app title, section headings, Character names |
| teal   | `#83cdc2` | subtitles, dividers, links                   |
| blue   | `#467ff7` | text inside input fields                     |

Fonts: **TikTok Sans** for headings and **Geist** for body text, both from
Google Fonts.

### App icons

`docs/trackerheart_logo.webp` is the source for every app icon: a purple heart
with a dagger and a rising arrow, 1920×1920 with a transparent background. Copy
it into each app's project and resize it there; don't redraw it, and don't
reference the file in `docs/` from a build.

- **iOS:** a 1024×1024 PNG in the app icon set of the Xcode asset catalog. App
  Store icons can't be transparent, so flatten the logo onto a solid white
  background.
- **Android:** an adaptive icon. The logo is the foreground layer, scaled down
  so the whole heart fits inside the 66×66 dp safe zone of the 108×108 dp
  canvas; the background layer is a solid white color. Also provide a monochrome
  layer for themed icons.
- **Web:** replace `web/public/favicon.ico`, and add a 180×180 Apple touch icon
  and 192×192 and 512×512 PNG icons. The web icons can keep the transparent
  background.

Xcode asset catalogs and Android Studio's Image Asset tool don't accept WebP, so
convert to PNG first, for example `sips -s format png` on macOS.

## Data

`docs/data-model.md` defines every collection, field, range and write sequence,
and `firebase/firestore.rules` rejects anything else. In particular:

- **Deletes are permanent.** There is no soft delete and no `deleted_at` field.
- **There is no REST API.** Apps read and write Firestore directly through the
  Firebase SDK, and the security rules authorize every request.
- **Documents hold exactly the fields listed.** Adding a field, even an optional
  one, makes the write fail. Changing the schema means changing the rules, their
  tests, the data model doc and every app together.
- Timestamps (`createdAt`, `lastModifiedAt`) are always set by the server.
