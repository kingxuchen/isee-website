# isee-website — Workspace root

pnpm workspace shell for independent Apps. No shared `packages/` tree.

- Domain: `CONTEXT.md` (Workspace root / App / Independence)
- App: `apps/isee-china` — site docs in `apps/isee-china/CLAUDE.md`
- Run: `pnpm dev:isee-china` / `pnpm build:isee-china` / `pnpm deploy:isee-china`
- Docker (from this root): `docker build -f apps/isee-china/Dockerfile -t isee-china:latest .`
