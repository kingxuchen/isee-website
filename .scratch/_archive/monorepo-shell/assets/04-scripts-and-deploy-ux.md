# Root scripts + deploy UX contract

**Ticket:** `.scratch/monorepo-shell/issues/04-scripts-and-deploy-ux.md`  
**Bases:** tickets 01–02; current `deploy-website.sh` / `scripts/rsync-to-vps.sh`  
**Cites:** `.scratch/monorepo-shell/research/01-docker-pnpm-filter-recipe.md`

## Workspace-root `package.json` scripts

Package name: `isee-website` (shell). **No** bare `dev` / `build` / `start` / `lint`.

| Script | Implementation (conceptual) |
|--------|------------------------------|
| `dev:isee-china` | `pnpm --filter isee-china dev` |
| `build:isee-china` | `pnpm --filter isee-china build` |
| `start:isee-china` | `pnpm --filter isee-china start` |
| `start:vps:isee-china` | `pnpm --filter isee-china start:vps` (preserve today’s loopback bind) |
| `lint:isee-china` | `pnpm --filter isee-china lint` |
| `deploy:isee-china` | invoke `apps/isee-china/deploy-website.sh` from Workspace root (script must `cd` to Workspace root itself) |

App `apps/isee-china/package.json` keeps the **bare** Next scripts (`dev`, `build`, `start`, `start:vps`, `lint`) for filter targets.

## Docker (operators)

Always from **Workspace root** (local or after sync to remote workspace checkout):

```bash
docker build -f apps/isee-china/Dockerfile -t isee-china:latest .
docker run …  # see deploy script defaults below
```

## `deploy-website.sh` (lives under App; run via root `deploy:isee-china`)

Defaults after monorepo (change only what Independence forces):

| Variable | Value | Rationale |
|----------|-------|-----------|
| `REMOTE_DIR` | `/data/isee-website` | unchanged remote workspace path |
| `IMAGE` | `isee-china:latest` | align with ticket 02 recipe |
| `CONTAINER` | `isee-website` | keep nginx upstream container **name** stable |
| `HOST_PORT` | `3001` | unchanged health-check bind |
| `DOCKER_NETWORK` | `isee_default` | unchanged |
| `NGINX_CONTAINER` | `isee-nginx` | unchanged |

### Sync

- Sync the **Workspace root** tree to `$REMOTE_DIR` (not a nested single-app dump that omits workspace manifests).
- Exclude at least: `.git`, `node_modules`, `.next`, `.scratch`, env files, plus today’s excludes as still relevant.
- Stop excluding `deploy` / `docs` if operators need them on the server; if still excluded, document that deploy configs are applied out-of-band. **Decision:** keep excluding `docs` (large design refs); **include** workspace manifests + `apps/` + root `.dockerignore`; `deploy/` under App may stay excluded if nginx/systemd are managed separately (today excludes `deploy`) — **keep exclude `deploy`** for parity with today’s script.

### Build on server

Replace `docker build -t $IMAGE .` with:

```bash
cd $REMOTE_DIR && docker build -f apps/isee-china/Dockerfile -t $IMAGE .
```

(`LOCAL_DIR` / script location: resolve Workspace root as parent of `apps/isee-china`, not `dirname` of the script alone if that would be the App dir — e.g. `ROOT="$(cd "$(dirname "$0")/../.." && pwd)"` when script is `apps/isee-china/deploy-website.sh`, **or** require invocation only via root `pnpm deploy:isee-china` with an explicit `WORKSPACE_ROOT`.)

**Decision:** script computes `WORKSPACE_ROOT` as two levels up from itself (`apps/isee-china` → root) and rsyncs/builds from there; root `deploy:isee-china` merely executes that script.

### Recreate / health / nginx

Unchanged flow; still `-p 127.0.0.1:$HOST_PORT:3000` and nginx verify. Image name change does not affect container name.

## `scripts/rsync-to-vps.sh` (App-local alternate)

- After move, `ROOT` must be **Workspace root** (not App) so tar includes lockfile + workspace + `apps/isee-china`.
- Post-sync instructions: `pnpm install --frozen-lockfile` then `pnpm build:isee-china` / `pnpm start:vps:isee-china` (or filter equivalents).
- Dest defaults may stay (`/var/www/isee-website`); call out as legacy alternate to Docker deploy.

## systemd / nginx unit files under `apps/isee-china/deploy/`

No path change beyond the move; unit bodies still refer to container `isee-website` / ports as today unless a file hard-codes repo-root `Dockerfile` paths — those strings update to `-f apps/isee-china/Dockerfile` only if present.

## Operator cheat sheet (no workspace internals required)

```bash
pnpm install
pnpm dev:isee-china          # local
pnpm build:isee-china
pnpm deploy:isee-china       # SSH sync + remote docker build -f apps/isee-china/Dockerfile
```
