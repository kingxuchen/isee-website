# Research: Docker + pnpm filter recipe for `apps/isee-china`

**Ticket:** `.scratch/monorepo-shell/issues/02-docker-pnpm-filter-recipe.md` (map id `02`; research filename kept `01-…` from the original charting ask)  
**Question:** Given Independence, a single root lockfile, and Docker context = Workspace root with `-f apps/isee-china/Dockerfile`, what is the concrete multi-stage Dockerfile and build/run recipe for this repo’s current Next.js standalone image?

**Scope:** Plan/research only — no production Dockerfile rewrite.

## Verdict

Adapt today’s root three-stage Dockerfile to:

1. **deps** — COPY workspace manifests + `apps/isee-china/package.json`, then `pnpm install --frozen-lockfile` (optionally `--filter isee-china`).
2. **builder** — COPY source, then `pnpm --filter isee-china build`.
3. **runner** — COPY nested standalone layout and run `node apps/isee-china/server.js`.

Build/run from the Workspace root:

```bash
docker build -f apps/isee-china/Dockerfile -t isee-china:latest .
docker run -d -p 3001:3000 isee-china:latest
```

**Required companion config (not in today’s `next.config.ts`):** set `outputFileTracingRoot` to the Workspace root so monorepo/pnpm traces and the nested `standalone` layout match the runner COPY paths below.

---

## Sources (primary)

| Claim area | Source |
|---|---|
| Current image shape | Repo root `Dockerfile` (deps → builder → runner, `output: "standalone"`) |
| Independence / App layout | `CONTEXT.md`, `.scratch/monorepo-shell/map.md` |
| `pnpm install --frozen-lockfile` | https://pnpm.io/cli/install |
| Manifests to COPY for monorepo install | https://pnpm.io/cli/fetch (Dockerfile examples) |
| `--filter` / package name | https://pnpm.io/filtering |
| pnpm Docker multi-stage / cache | https://pnpm.io/docker |
| Standalone + `public` / `.next/static` | https://nextjs.org/docs/app/api-reference/config/next-config-js/output |
| Monorepo `outputFileTracingRoot` | Same Next.js `output` doc; Turborepo `with-docker` `next.config.js` |
| Nested runner COPY / `CMD` | https://github.com/vercel/turborepo/blob/main/examples/with-docker/apps/web/Dockerfile |
| Official single-app Docker standalone | https://github.com/vercel/next.js/blob/canary/examples/with-docker/Dockerfile |
| `.dockerignore` at context root | https://docs.docker.com/build/building/best-practices/ (`Exclude with .dockerignore`) |
| Multi-stage / small final image | Same Docker best-practices doc |

Secondary confirmation (layout rationale, not the recipe authority): Next.js maintainers on [#78446](https://github.com/vercel/next.js/issues/78446) — with `outputFileTracingRoot`, `standalone` mirrors the monorepo tree so root-level traced `node_modules` resolve next to `apps/.../server.js`.

---

## 1. What today already does

Root `Dockerfile` (Workspace path today = App path):

| Stage | Behavior |
|---|---|
| `deps` | `node:24-alpine`, pnpm `10.28.2`, COPY `package.json` + `pnpm-lock.yaml` + `pnpm-workspace.yaml`, `pnpm install --frozen-lockfile` |
| `builder` | COPY `node_modules` from deps, `COPY . .`, `pnpm build` |
| `runner` | non-root `nextjs`, COPY `.next/standalone` → `/app/`, `.next/static` → `/app/.next/static`, `public` → `/app/public`, `CMD ["node", "server.js"]` |

`next.config.ts` has `output: "standalone"` only — **no** `outputFileTracingRoot` (correct for a root-level app; insufficient after the move).

`.dockerignore` excludes `.git`, `.next`, `node_modules`, env files, `docs`, `scripts`, `deploy`, root `Dockerfile` / `.dockerignore`, and agent docs. Context is `.` (repo root).

---

## 2. Target layout (Independence)

After the planned move:

```text
isee-website/                    # Workspace root (lockfile owner)
├── package.json                 # shell scripts only; not the Next app
├── pnpm-workspace.yaml          # packages: ["apps/*"]
├── pnpm-lock.yaml               # single lockfile
├── .dockerignore                # stays at context root
└── apps/isee-china/             # App package name: "isee-china"
    ├── package.json
    ├── next.config.ts
    ├── public/
    ├── src/
    └── Dockerfile               # -f path; build context still .
```

Independence means no `packages/` shared libs; Docker still builds from the Workspace root because the lockfile and workspace membership live there (`CONTEXT.md`, map).

---

## 3. Files to COPY before `pnpm install --frozen-lockfile`

pnpm’s fetch doc states that a monorepo Dockerfile must copy root manifests **and each workspace package’s `package.json` into the correct path**, because Docker cannot glob “only package.json” in one instruction:

```dockerfile
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
# Optional if present: COPY .npmrc .pnpmfile.mjs ./
# Optional if present: COPY patches patches
COPY apps/isee-china/package.json apps/isee-china/
RUN pnpm config set registry https://registry.npmmirror.com && \
    pnpm install --frozen-lockfile
```

**Why each file:**

| File | Role |
|---|---|
| `pnpm-lock.yaml` | Frozen install input (`--frozen-lockfile` fails if missing/out of sync) |
| `pnpm-workspace.yaml` | Workspace membership + this repo’s `allowBuilds` / `minimumReleaseAge` |
| Root `package.json` | Workspace shell package |
| `apps/isee-china/package.json` | App deps/scripts; without it, the App is not a workspace project and install cannot link it |

**Filter on install (optional but aligned with Independence):**

```dockerfile
RUN pnpm --filter isee-china... install --frozen-lockfile
```

- `--filter <name>` selects by package name ([filtering](https://pnpm.io/filtering)).
- Trailing `...` includes workspace dependencies; under Independence that is just the App itself — still the right habit if a second App appears later.
- With a single App, unfiltered `pnpm install --frozen-lockfile` is equivalent and matches today’s Dockerfile.

**`pnpm fetch` alternative** (lockfile-only first layer): copy only `pnpm-lock.yaml` + `pnpm-workspace.yaml`, `pnpm fetch`, then `COPY . .` and `pnpm install -r --offline` ([pnpm fetch](https://pnpm.io/cli/fetch), [pnpm docker Example 3](https://pnpm.io/docker)). Prefer the explicit package.json COPY above to stay close to today’s Dockerfile unless CI cache invalidation from App `package.json` churn becomes a problem.

**Do not use `pnpm deploy` for the final image** here. That path is for shipping a filtered `node_modules` tree ([pnpm docker Example 2](https://pnpm.io/docker)). This App uses Next `output: "standalone"`, which already traces a minimal runtime — follow the Next/Turborepo runner pattern instead.

---

## 4. Build command: `pnpm --filter isee-china build`

```dockerfile
ENV NEXT_TELEMETRY_DISABLED=1
RUN pnpm --filter isee-china build
```

Requires App `package.json`:

```json
{
  "name": "isee-china",
  "scripts": { "build": "next build" }
}
```

`--filter isee-china` runs the App’s `build` script only ([filtering](https://pnpm.io/filtering)). Root may expose `build:isee-china` → the same filter for humans; the Dockerfile should call the filter directly so it does not depend on root script names.

---

## 5. Where standalone / `public` / `.next/static` land

### Build outputs (on the builder filesystem)

| Artifact | Path after move |
|---|---|
| Standalone tree | `apps/isee-china/.next/standalone/` |
| Static chunks | `apps/isee-china/.next/static/` |
| Public assets | `apps/isee-china/public/` |

Next docs: enable `output: 'standalone'` → folder at `.next/standalone`; **`public` and `.next/static` are not copied into standalone automatically** — copy them next to the standalone tree so `server.js` can serve them ([output](https://nextjs.org/docs/app/api-reference/config/next-config-js/output)).

### Nested layout when `outputFileTracingRoot` is the Workspace root

Set in `apps/isee-china/next.config.ts` (Turborepo `with-docker` + Next `output` caveats):

```ts
import type { NextConfig } from "next";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const nextConfig: NextConfig = {
  output: "standalone",
  // Trace from Workspace root (two levels up from apps/isee-china)
  outputFileTracingRoot: path.join(__dirname, "../../"),
};

export default nextConfig;
```

With that setting, standalone **preserves paths relative to the tracing root**. Typical layout:

```text
apps/isee-china/.next/standalone/
├── apps/isee-china/
│   ├── server.js
│   └── …app-local traced files…
└── node_modules/          # workspace-root traced deps (pnpm/Next)
```

So after `COPY …/standalone ./` into the runner’s `WORKDIR /app`:

- Server entry: `/app/apps/isee-china/server.js`
- Static must be copied to: `/app/apps/isee-china/.next/static`
- Public must be copied to: `/app/apps/isee-china/public`

This matches the official Turborepo Docker example (`apps/web` → `apps/isee-china`):

```dockerfile
COPY --from=builder --chown=nextjs:nodejs /app/apps/isee-china/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/apps/isee-china/.next/static ./apps/isee-china/.next/static
COPY --from=builder --chown=nextjs:nodejs /app/apps/isee-china/public ./apps/isee-china/public

USER nextjs
EXPOSE 3000
CMD ["node", "apps/isee-china/server.js"]
```

**Without** `outputFileTracingRoot`, Next traces only the App directory; pnpm’s Workspace-root store / hoisted modules outside `apps/isee-china` may be omitted ([output caveats](https://nextjs.org/docs/app/api-reference/config/next-config-js/output)). Independence does not remove that need — the lockfile/store still live at the Workspace root.

Flat single-app runner (`CMD ["node", "server.js"]` with static at `./.next/static`) is what **today’s** root Dockerfile and `with-docker` example use; it is wrong once the App is nested under `apps/` with tracing rooted at the monorepo.

---

## 6. Concrete multi-stage Dockerfile (recipe)

Target path: `apps/isee-china/Dockerfile`. Preserve today’s Node 24 Alpine, pnpm pin, registry, non-root user, and env unless execution deliberately changes them.

```dockerfile
# ============================================================
# isee-china — Next.js standalone (pnpm workspace App)
#
# Context = Workspace root:
#   docker build -f apps/isee-china/Dockerfile -t isee-china:latest .
#   docker run -d -p 3001:3000 isee-china:latest
# ============================================================

# ---------- stage 1: deps ----------
FROM node:24-alpine AS deps
RUN apk add --no-cache libc6-compat
RUN npm install -g pnpm@10.28.2 --registry=https://registry.npmmirror.com
WORKDIR /app

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/isee-china/package.json ./apps/isee-china/
# If added later: COPY .npmrc .pnpmfile.mjs ./  and/or COPY patches ./patches

RUN pnpm config set registry https://registry.npmmirror.com && \
    pnpm install --frozen-lockfile
# Equivalent under Independence:
#   pnpm --filter isee-china... install --frozen-lockfile

# ---------- stage 2: builder ----------
FROM node:24-alpine AS builder
RUN npm install -g pnpm@10.28.2 --registry=https://registry.npmmirror.com
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
# pnpm may also place App links under apps/isee-china/node_modules — copy if present:
COPY --from=deps /app/apps ./apps
COPY --from=deps /app/package.json /app/pnpm-lock.yaml /app/pnpm-workspace.yaml ./

COPY . .

ENV NEXT_TELEMETRY_DISABLED=1
RUN pnpm --filter isee-china build

# ---------- stage 3: runner ----------
FROM node:24-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    PORT=3000 \
    HOSTNAME=0.0.0.0

RUN addgroup -S nodejs -g 1001 && adduser -S nextjs -u 1001 -G nodejs

COPY --from=builder --chown=nextjs:nodejs /app/apps/isee-china/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/apps/isee-china/.next/static ./apps/isee-china/.next/static
COPY --from=builder --chown=nextjs:nodejs /app/apps/isee-china/public ./apps/isee-china/public

USER nextjs
EXPOSE 3000
CMD ["node", "apps/isee-china/server.js"]
```

**deps → builder `node_modules` note:** today’s Dockerfile only copies `/app/node_modules`. With pnpm workspaces, App-local `node_modules` often contains symlinks into the virtual store. Copying `/app/apps` from deps (after install) plus root `node_modules`, then `COPY . .` (source over manifests), matches how pnpm layouts work better than a single root `node_modules` copy. If execution finds broken links, fall back to a single-stage install+build (pnpm docker Example 1 style) or BuildKit cache mount `pnpm install` in builder — still using `--frozen-lockfile`.

Optional cache mount (pnpm docker):  
`RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile` when using Corepack/`PNPM_HOME`; today’s global `npm i -g pnpm` store path differs — keep the simple frozen install unless execution standardizes on Corepack.

---

## 7. `.dockerignore` changes (context = Workspace root)

Docker reads `.dockerignore` from the **build context root**, not from the `-f` Dockerfile directory ([best practices](https://docs.docker.com/build/building/best-practices/)). Keep the file at the Workspace root.

**Recommended root `.dockerignore` after the move:**

```gitignore
.git
**/.next
**/node_modules
**/out
.pi
.tmp*
.scratch
.env
.env.*
*.tsbuildinfo
.DS_Store
Thumbs.db

# Not needed for next build
deploy
docs
scripts
*.md
AGENTS.md
CLAUDE.md

# Dockerfile itself need not be in the context
Dockerfile
**/Dockerfile
.dockerignore
```

**Deltas vs today:**

| Change | Why |
|---|---|
| `**/.next` / `**/node_modules` | App lives under `apps/isee-china`; must ignore nested artifacts |
| `.scratch` | Wayfinder notes must not inflate context |
| Keep excluding `docs` / `scripts` | Same as today; Next build does not need them (verify if App later imports from `docs/`) |
| Do **not** ignore `apps/isee-china/**` source, `public/`, or config | Required for build |
| Ignoring `**/Dockerfile` | Safe; `-f` reads the file from the client filesystem, not necessarily from context |

Do **not** ignore `pnpm-lock.yaml`, `pnpm-workspace.yaml`, or `apps/isee-china/package.json`.

---

## 8. Build / run command recipe

```bash
# From Workspace root (isee-website)
docker build -f apps/isee-china/Dockerfile -t isee-china:latest .

# Same host port mapping as today’s comment
docker run -d -p 3001:3000 \
  -e PORT=3000 \
  -e HOSTNAME=0.0.0.0 \
  isee-china:latest
```

Smoke check: `curl -sI http://127.0.0.1:3001` should return HTML; `/_next/static/...` must not 404 (wrong static COPY path is the usual monorepo failure mode).

---

## 9. Checklist for the later execution session

- [ ] `git mv` App into `apps/isee-china`; package `"name": "isee-china"`.
- [ ] Root `pnpm-workspace.yaml`: `packages: ["apps/*"]` (drop `"."` as App).
- [ ] Move Dockerfile → `apps/isee-china/Dockerfile`; apply recipe above.
- [ ] Add `outputFileTracingRoot` → Workspace root in App `next.config.ts`.
- [ ] Update root `.dockerignore` with `**/` patterns + `.scratch`.
- [ ] Root scripts: `build:isee-china` → `pnpm --filter isee-china build` (human ergonomics; Docker uses filter directly).
- [ ] Confirm runner paths: `apps/isee-china/server.js` + nested `public` / `.next/static`.
- [ ] Update `deploy-website.sh` / VPS docs image tag and `-f` path once deploy ticket runs.

---

## 10. What this research does *not* change

- Does not rewrite the production root `Dockerfile` or move the App (charting / research only).
- Does not choose between npmmirror vs default registry, or Alpine vs slim — keep today’s pins until an execution ticket says otherwise.
- Does not adopt `pnpm deploy` or Turborepo `turbo prune` (map: pnpm workspaces only, Independence).
