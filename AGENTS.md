# isee-website (Workspace root)

This repo is a pnpm workspace. Apps live under `apps/` and do not share library packages (Independence — see `CONTEXT.md`).

- Prefer root scripts: `pnpm dev:isee-china`, `pnpm build:isee-china`, …
- Or work inside `apps/isee-china` with that package’s bare scripts.
- Next.js version notes and generated agent rules live in `apps/isee-china/AGENTS.md` (next to the App’s `node_modules`).
