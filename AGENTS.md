# TrackerHeart monorepo

TrackerHeart has three clients that share one Firebase backend:

| Folder      | What it is                                      | Open with      |
| ----------- | ----------------------------------------------- | -------------- |
| `web/`      | Next.js web app (TypeScript, React, Tailwind)   | VS Code        |
| `ios/`      | Native iOS app (Swift, SwiftUI)                 | Xcode          |
| `android/`  | Native Android app (Kotlin, Jetpack Compose)    | Android Studio |
| `firebase/` | Firestore security rules and their tests        | VS Code        |
| `docs/`     | Shared docs, including the Firestore data model |                |

Each client folder has its own build tool and its own agent instructions; read
them before working in that folder (for example, `web/AGENTS.md`).

## Docs

Read these before building or changing any app:

- `docs/requirements.md`: what the apps do, screen by screen, and the
  conventions for each platform.
- `docs/monorepo-plan.md`: the repo layout, how to set up each app, the porting
  map from the web app, and current status.
- `docs/data-model.md`: the Firestore contract every app must follow.

@docs/requirements.md

@docs/monorepo-plan.md

## The backend is the shared contract

No code is shared between the clients, so they stay compatible only by following
the same Firestore contract: collection names, document fields and ranges, and
the batched write sequences. `firebase/firestore.rules` enforces it on the
server.

Any change to the schema or rules must update, together:

1. `firebase/firestore.rules` and its tests
2. `docs/data-model.md`
3. every client that reads or writes the affected documents
