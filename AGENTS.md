# isee-website (Workspace root)

This repo is a pnpm workspace. Apps live under `apps/` and do not share library packages (Independence — see `CONTEXT.md`).

- Prefer root scripts: `pnpm dev:isee-china`, `pnpm build:isee-china`, `pnpm dev:isee-international`, `pnpm build:isee-international`, `pnpm test:isee-international`, …
- Or work inside an App directory with that package’s bare scripts.
- Next.js version notes and generated agent rules live in `apps/isee-china/AGENTS.md` (next to the App’s `node_modules`).
