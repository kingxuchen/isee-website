# Execution handoff playbook — monorepo shell

**Ticket:** `.scratch/monorepo-shell/issues/05-execution-handoff-playbook.md`  
**Effort:** planning complete; **this file is what a later session runs**. Do not execute inside the map charting sessions.

## Acceptance (when done)

1. From Workspace root: `pnpm install` then `pnpm dev:isee-china` / `pnpm build:isee-china` / `pnpm lint:isee-china` / `pnpm start:isee-china` work.
2. From Workspace root: `docker build -f apps/isee-china/Dockerfile -t isee-china:latest .` succeeds.
3. No `packages/` tree; single `pnpm-lock.yaml`; App has no private lockfile.
4. `docs/wayfinder/` and root `package-lock.json` are gone.

## Ordered steps

### A. Layout

1. Create `apps/` (empty aside from the move target).
2. `git mv` every **move** path from `.scratch/monorepo-shell/assets/01-path-inventory.md` into `apps/isee-china/` (preserve names).
3. Delete **delete** paths: `package-lock.json`, `docs/wayfinder/` (and empty root `docs/` if nothing remains).
4. Ensure residual root matches inventory “Residual root” section; keep `.dockerignore` at Workspace root.

### B. Workspace + App packages

5. Root `package.json`: name `isee-website`; scripts only per `.scratch/monorepo-shell/assets/04-scripts-and-deploy-ux.md`; dependencies empty or minimal shell — App owns Next deps.
6. `apps/isee-china/package.json`: name `isee-china`; bare `dev`/`build`/`start`/`start:vps`/`lint`; move today’s dependency set here.
7. `pnpm-workspace.yaml`: `packages: ['apps/*']` (drop `"."` as an App); keep `minimumReleaseAge` / `allowBuilds` as needed.
8. From root: `pnpm install` to regenerate the single lockfile.

### C. Next + Docker

9. In App `next.config.ts`: keep `output: 'standalone'`; set `outputFileTracingRoot` to Workspace root (see ticket 02 research).
10. Rewrite `apps/isee-china/Dockerfile` per `.scratch/monorepo-shell/research/01-docker-pnpm-filter-recipe.md`.
11. Update root `.dockerignore`: `**/node_modules`, `**/.next`, `.scratch`, plus existing sensible excludes.

### D. Deploy helpers

12. Update `apps/isee-china/deploy-website.sh` per asset 04 (`WORKSPACE_ROOT`, `-f apps/isee-china/Dockerfile`, `IMAGE=isee-china:latest`, container name unchanged).
13. Update `apps/isee-china/scripts/rsync-to-vps.sh` so `ROOT` is Workspace root; post-sync commands use root `*:isee-china` scripts.
14. Skim `apps/isee-china/deploy/**` for hard-coded root Dockerfile paths; fix if any.

### E. Docs

15. Rewrite thin root `README.md` / `AGENTS.md` / `CLAUDE.md` per `.scratch/monorepo-shell/assets/03-docs-content-contract.md`.
16. Place full site CLAUDE under `apps/isee-china/CLAUDE.md`; App `AGENTS.md` for Next agent-rules; leave `CONTEXT.md` at root.

### F. Verify

17. `pnpm install && pnpm build:isee-china && pnpm lint:isee-china`
18. `docker build -f apps/isee-china/Dockerfile -t isee-china:latest .`
19. Optional smoke: `pnpm dev:isee-china` / `docker run` per research recipe.

## Pointers

| Topic | Asset |
|-------|--------|
| Path fates | `.scratch/monorepo-shell/assets/01-path-inventory.md` |
| Docker recipe | `.scratch/monorepo-shell/research/01-docker-pnpm-filter-recipe.md` |
| Docs split | `.scratch/monorepo-shell/assets/03-docs-content-contract.md` |
| Scripts / deploy | `.scratch/monorepo-shell/assets/04-scripts-and-deploy-ux.md` |
| Domain | `CONTEXT.md` |
