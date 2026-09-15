# Content contract: Workspace-root docs vs apps/isee-china

**Ticket:** `.scratch/monorepo-shell/issues/03-root-vs-app-docs.md`  
**Cites:** `.scratch/monorepo-shell/assets/01-path-inventory.md`  
**Audience:** execution session rewriting docs (not final prose).

## Principles

1. Root docs are **shell-only**: Workspace purpose, Independence, how to run/filter the App, pointer to App docs.
2. App docs own **site** identity: WorkBuddy clone structure, assets, behaviors, research, design refs, App-local run (`pnpm --filter isee-china …` or cwd inside App).
3. No duplicated long site CLAUDE at root after execution.

## Workspace root (stay — thin)

| File | Audience | Topics (must include) | Must not include |
|------|----------|----------------------|------------------|
| `README.md` | humans / ops | Repo is `isee-website` Workspace; list Apps (`isee-china`); `pnpm install` at root; run via `pnpm dev:isee-china` / `build:isee-china` / …; deploy pointer (`pnpm deploy:isee-china` or App script); link `CONTEXT.md` | Section-by-section site architecture; PM2/nginx copy-paste for the clone; research artifact paths as if at root |
| `AGENTS.md` | coding agents | Workspace layout (`apps/*`); Independence (no `packages/`); prefer App cwd or filter scripts; Next docs live under App `node_modules` after install | Full Next.js agent-rules block as the only content without Workspace note — keep Next block **inside App** `AGENTS.md` where `next dev` regenerates it |
| `CLAUDE.md` | Claude / agents | One-screen Workspace summary; Independence; “site details → `apps/isee-china/CLAUDE.md`”; root scripts table | Pixel-perfect clone structure, asset trees, behavior inventory (those move) |
| `CONTEXT.md` | all | Glossary only (already correct) | Site how-to |

## App `apps/isee-china` (move / create)

| Path | Fate | Topics |
|------|------|--------|
| `CLAUDE.md` | **move** today’s root site CLAUDE body here; update Run to filter or App-local pnpm; fix doc paths to `docs/research/…` under App | Structure, assets, behaviors, research links, approximations |
| `AGENTS.md` | **create** (or let `next dev` regenerate) Next.js agent-rules block scoped to this App | Next 16 docs path under this package |
| `README.md` | **optional thin App README** or rely on CLAUDE — if present: App-only run/build/deploy from App or documented root scripts | Site overview + link back to Workspace README |
| `docs/research/` | move | PAGE_TOPOLOGY, BEHAVIORS, component specs, raw |
| `docs/design-references/` | move | screenshots |
| `docs/deploy/` | move | App deploy notes if any |

## Path inventory alignment

- Root `README` / `AGENTS` / `CLAUDE` **stay** (rewritten thin).
- Site CLAUDE content **relocates** into `apps/isee-china/CLAUDE.md`.
- Research/design docs **move** with App; `docs/wayfinder/` **deleted** (not documented further).

## Execution note

Final wording can be drafted at execution; this contract freezes **ownership and topics**. Do not invent a second shared docs package.
