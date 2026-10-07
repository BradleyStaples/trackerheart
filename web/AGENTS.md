<!-- prettier-ignore-start -->
<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
<!-- prettier-ignore-end -->

# TrackerHeart web app

The Next.js web app, one of three TrackerHeart apps in this monorepo. It is the
reference implementation the iOS and Android apps port, so behavior changes here
must be reflected in the docs those apps follow.

Before changing app behavior or data access, read:

- `../AGENTS.md`
- `../docs/requirements.md`: what to build, screen by screen
- `../docs/data-model.md`: the Firestore contract

@../AGENTS.md
