# TrackerHeart monorepo

TrackerHeart has three clients that share one Firebase backend:

| Folder      | What it is                                         | Open with      |
| ----------- | -------------------------------------------------- | -------------- |
| `web/`      | Next.js web app (TypeScript, React, Tailwind)      | VS Code        |
| `ios/`      | Native iOS app (Swift, SwiftUI)                    | Xcode          |
| `android/`  | Native Android app (Kotlin, Jetpack Compose)       | Android Studio |
| `firebase/` | Firestore security rules, indexes, and rules tests | VS Code        |
| `docs/`     | Shared docs, including the Firestore data model    |                |

Each client folder has its own build tool and its own agent instructions; read
them before working in that folder (for example, `web/AGENTS.md`).

The plan for adding the native apps, including setup steps, the porting map
from the web app, and current status, is in `docs/monorepo-plan.md`:

@docs/monorepo-plan.md

## The backend is the shared contract

No code is shared between the clients, so they stay compatible only by
following the same Firestore contract: collection names, document fields and
ranges, and the batched write sequences. `firebase/firestore.rules` enforces
it on the server.

Any change to the schema or rules must update, together:

1. `firebase/firestore.rules` and its tests
2. `docs/data-model.md`
3. every client that reads or writes the affected documents
