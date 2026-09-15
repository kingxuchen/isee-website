# Path inventory: Workspace root vs apps/isee-china

**Ticket:** `.scratch/monorepo-shell/issues/01-path-inventory.md`  
**Rules:** map residual + Independence (`CONTEXT.md`). Planning only — destinies apply at execution.

## Legend

| Fate | Meaning |
|------|---------|
| **stay** | Remains at Workspace root after execution (may be rewritten in place) |
| **move** | `git mv` (or equivalent) into `apps/isee-china/` (same relative name unless noted) |
| **delete** | Removed on execution; not kept at root or under the App |

Generated / install trees (`node_modules`, `.next`) are omitted; recreate via pnpm / build after the move.

## Top-level paths

| Path | Fate | Notes |
|------|------|-------|
| `.git` | stay | Repo metadata |
| `.gitignore` | stay | Root ignore; may gain App-local ignores later if needed |
| `.scratch` | stay | Wayfinder / planning scratch; not part of the App |
| `.dockerignore` | stay | Docker **context** root (see ticket 02); keep at Workspace root |
| `package.json` | stay | Becomes shell-only scripts (`*:isee-china`); App gets its own under `apps/isee-china/` |
| `pnpm-workspace.yaml` | stay | Retarget to `apps/*` on execution |
| `pnpm-lock.yaml` | stay | Single Workspace lockfile |
| `CONTEXT.md` | stay | Workspace glossary (root / App / Independence) |
| `README.md` | stay | Thin shell README (content contract: ticket 03) |
| `AGENTS.md` | stay | Thin shell agent rules (content contract: ticket 03) |
| `CLAUDE.md` | stay | Thin shell Claude rules; site clone notes move with App (ticket 03) |
| `package-lock.json` | **delete** | npm stray; pnpm is the only installer — do not keep or regenerate |
| `docs/wayfinder/` | **delete** | Abandoned Cloudflare Workers map (map Notes) |
| `Dockerfile` | move | → `apps/isee-china/Dockerfile` |
| `deploy/` | move | → `apps/isee-china/deploy/` (nginx, systemd) |
| `deploy-website.sh` | move | → `apps/isee-china/deploy-website.sh` (root may later wrap; ticket 04) |
| `scripts/` | move | → `apps/isee-china/scripts/` (`download-assets.mjs`, `rsync-to-vps.sh`) |
| `src/` | move | App source |
| `public/` | move | App assets |
| `components.json` | move | shadcn App config |
| `eslint.config.mjs` | move | App lint config |
| `next.config.ts` | move | Plus `outputFileTracingRoot` on execution (ticket 02) |
| `next-env.d.ts` | move | Generated typings; move with App (regenerate OK) |
| `postcss.config.mjs` | move | App PostCSS |
| `tsconfig.json` | move | App TS config |
| `docs/research/` | move | → `apps/isee-china/docs/research/` |
| `docs/design-references/` | move | → `apps/isee-china/docs/design-references/` |
| `docs/deploy/` | move | → `apps/isee-china/docs/deploy/` (if present) |

## `docs/` summary

- **move:** `research/`, `design-references/`, `deploy/` (site research & deploy docs)
- **delete:** `wayfinder/` only
- After execution, empty `docs/` at root should not remain; if only those children existed, remove the root `docs/` directory once children are moved/deleted.

## Independence check

- No `packages/` tree created or retained.
- Deploy + Dockerfile live under the App; Workspace root only supplies context (`.`, `.dockerignore`, lockfile, workspace file) for `docker build -f apps/isee-china/Dockerfile .`.
- Root does not keep Next/site tooling configs.

## Residual root (expected after execution)

```text
isee-website/
├── .git /
├── .gitignore
├── .scratch/
├── .dockerignore
├── package.json              # shell scripts only
├── pnpm-workspace.yaml       # apps/*
├── pnpm-lock.yaml
├── CONTEXT.md
├── README.md                 # thin
├── AGENTS.md                 # thin
├── CLAUDE.md                 # thin
└── apps/
    └── isee-china/           # moved site + Dockerfile + deploy
```
