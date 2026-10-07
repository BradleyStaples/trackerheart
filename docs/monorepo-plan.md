# Monorepo plan: web, iOS and Android

TrackerHeart started as a Next.js web app. This plan adds native iOS and
Android apps in the same repository. Read it before starting work in `ios/` or
`android/`.

## Decisions

- **Native apps, not wrappers.** iOS uses **Swift + SwiftUI**; Android uses
  **Kotlin + Jetpack Compose**. No React Native, Capacitor, or Kotlin
  Multiplatform.
- **One folder per app, no JS workspaces.** The three apps share no package
  manager or build tool, so each folder opens directly in its own IDE: VS Code
  for `web/`, Xcode for `ios/`, Android Studio for `android/`.
- **The backend is the shared contract.** The apps can't share code, so they
  stay compatible by reading and writing Firestore the same way. The rules in
  `firebase/firestore.rules` enforce exact fields, value ranges and ownership.
  A client that drifts from the contract gets its writes rejected, so its data
  can't be silently corrupted.
- **Same Firebase project for all three:** `trackerheart-ed2ae`.

## Layout

```
trackerheart/
├─ web/          Next.js app (TypeScript, React, Tailwind, Flowbite)
├─ ios/          Xcode project in ios/TrackerHeart/, SwiftUI, Firebase via SPM
├─ android/      Gradle (Kotlin DSL, version catalog), Compose, Firebase BoM
├─ firebase/     firebase.json, .firebaserc, firestore.rules, rules tests
├─ shared/       logos and icon sources, design-tokens.json (copied by hand)
├─ docs/         this plan, data-model.md
└─ .github/      CI workflows, one per folder, filtered by path
```

## Steps and status

### 1. Move the web app into `web/` — done

The web app and its config files moved into `web/`, and the Firebase config
moved into `firebase/`. The root `AGENTS.md` describes the monorepo; the
Next.js agent instructions live in `web/AGENTS.md`. `ios/` and `android/` each
have an `AGENTS.md` that points agents in those IDEs back to this plan. If the
site's host (for example Vercel) builds from the repo, its root directory must
be `web/`.

### 2. Document and test the contract — done

- `docs/data-model.md`: every collection, field and range; server timestamps;
  the share-code format; and the exact multi-document write sequences. Native
  apps implement their repository from this.
- `firebase/tests/firestore.rules.test.mjs`: Firestore emulator tests covering
  every allow and deny path in the rules, plus the batched deletes the apps
  perform. Rules changes are tested once here instead of in each app. Run with
  `cd firebase && npm test` (needs Java 21+; the emulator listens on port 8080).

### 3. Android app (`android/`) — not started

1. In Android Studio, create a project from the **Empty Activity** (Compose)
   template, with the project location set to this repo's `android/` folder
   (it already holds `AGENTS.md`, so Android Studio warns that the folder isn't
   empty; that's fine) and the Kotlin DSL build configuration. Suggested
   package: `com.trackerheart`.
2. In the Firebase console, add an Android app with that package to
   `trackerheart-ed2ae` and download `google-services.json` into
   `android/app/`. Enable the same Anonymous Auth provider the web app uses
   (already on).
3. Add the `com.google.gms.google-services` plugin and the Firebase BoM with
   `firebase-auth` and `firebase-firestore` to the version catalog.
4. Build it in the layers below (see "Porting map").
   - `model/`: data classes
   - `data/`: `FirebaseRepository`, with listeners exposed as `Flow`s
   - `ui/`: one Compose screen per page, Navigation Compose, a ViewModel per
     screen

### 4. iOS app (`ios/`) — not started

1. In Xcode, create an **App** project named `TrackerHeart` (SwiftUI
   interface, Swift language) and save it in this repo's `ios/` folder, with
   "Create Git repository" unchecked. Xcode creates `ios/TrackerHeart/` holding
   the `.xcodeproj` and sources; `ios/AGENTS.md` stays where it is. Deployment
   target iOS 17 or later (for the Observation framework).
2. In the Firebase console, add an iOS app with the project's bundle ID to
   `trackerheart-ed2ae` and add `GoogleService-Info.plist` to the app target.
3. Add `https://github.com/firebase/firebase-ios-sdk` through Swift Package
   Manager with the `FirebaseAuth` and `FirebaseFirestore` products. Call
   `FirebaseApp.configure()` at launch.
4. Build it in the layers below (see "Porting map").
   - `Models/`: `Codable` structs
   - `Data/FirebaseRepository.swift`: async/await, listeners exposed as
     `AsyncStream`s
   - `Views/`: one SwiftUI view per page, `NavigationStack`, an `@Observable`
     view model per screen

### 5. CI — not started

GitHub Actions workflows filtered by path:

| Path          | Runs                                            |
| ------------- | ----------------------------------------------- |
| `web/**`      | `npm ci`, `npm run lint`, `npm run build`       |
| `ios/**`      | `xcodebuild test` on a macOS runner             |
| `android/**`  | `./gradlew lint test assembleDebug`             |
| `firebase/**` | rules tests against the Firestore emulator      |

## Porting map

The web app is the reference implementation. Its behavior, including the
comments that explain why, is the spec for the native apps.

| Web (`web/src/`)                    | iOS                                   | Android                              |
| ----------------------------------- | ------------------------------------- | ------------------------------------ |
| `utils/types.ts`                    | `Models/Game.swift`, `Character.swift` | `model/Game.kt`, `Character.kt`      |
| `utils/firestore.ts`                | `Data/FirebaseRepository.swift`       | `data/FirebaseRepository.kt`         |
| `utils/utils.ts` (`createShareCode`) | `Data/ShareCode.swift`                | `data/ShareCode.kt`                  |
| `hooks/use*.ts`                     | `@Observable` view models             | ViewModels with `StateFlow`          |
| `pages/index.tsx` (GM/Player toggle) | `Views/HomeView.swift`                | `ui/HomeScreen.kt`                   |
| `pages/games/new.tsx`, `[id].tsx`   | `NewGameView`, `GameView`             | `NewGameScreen`, `GameScreen`        |
| `pages/characters/new.tsx`, `[id].tsx` | `NewCharacterView`, `CharacterView` | `NewCharacterScreen`, `CharacterScreen` |
| `components/JoinGame.tsx`           | `JoinGameView`                        | `JoinGameScreen`                     |
| `pages/license.tsx`                 | `LicenseView`                         | `LicenseScreen`                      |

### Functions the repository must mirror

From `utils/firestore.ts`. Keep the same write sequences, since the rules
check them:

- `ensureSignedIn`: anonymous sign-in once, then reuse the uid. Every read and
  write waits for it.
- `getGamesForCurrentUser`, `getCharactersForCurrentUser`: queries filtered on
  `ownerUid == uid` (the rules require the filter).
- `createGame`: generate a share code, skip it if `ShareCodes/{code}` exists,
  then write `Games/{new id}` and `ShareCodes/{code}` in **one batch**. Retry
  with a new code up to 5 times on permission denied.
- `updateGame`, `updateCharacter`: only the editable fields, plus
  `lastModifiedAt` set to the server timestamp.
- `deleteGame`: one batch that deletes the Game, its ShareCodes entry, and
  every `GameCharacters` mapping where `gameId` and `gmUid` match.
- `createCharacter`: `createdAt` and `lastModifiedAt` are server timestamps.
- `deleteCharacter`: one batch that deletes the Character and its mapping
  (found by query, because deleting a missing mapping is rejected).
- `joinGame`: normalize the code (strip whitespace, uppercase, must match
  `^[0-9A-Z]{6}$`), read `ShareCodes/{code}`, then the Game, then set
  `GameCharacters/{characterId}`.
- `removeCharacterFromGame`: delete `GameCharacters/{characterId}`, used both
  by the player leaving and by the GM removing a Character.
- Live listeners: `subscribeToOwnedGame`, `subscribeToOwnedCharacter`,
  `subscribeToGameForCharacter` (follows the mapping, then the Game), and
  `subscribeToCharactersInGame`. The last one follows the mappings and opens
  **one listener per Character**, because the rules only let the GM read
  Characters one document at a time.

## Things to know

- **Identity is per device.** Anonymous Auth gives each browser and each app
  install its own uid, so someone's web Characters won't appear on their
  phone. Fixing that later means linking a sign-in provider (Sign in with
  Apple, Google), which touches all three apps and the rules.
- **Firebase config files are not secrets.** The web config is already
  committed; committing `GoogleService-Info.plist` and `google-services.json`
  is fine too. Consider Firebase App Check before the store launch.
- **Change the contract everywhere at once.** A schema or rules change must
  update `firebase/firestore.rules` and its tests, `docs/data-model.md`, and
  every app that touches the affected documents.
