---
name: verify-isee-international
description: Drive the real isee-international web app (TanStack Start + Cloudflare SSR/Vite, localhost:8199) in a browser and prove a user-facing change works. Use when verifying, testing, dogfooding, or capturing evidence for a change in apps/isee-international — landing page, docs, blog, changelog, agent pages, download, or alternatives pages.
---

# Verify isee-international

`apps/isee-international` is an SSR marketing site (TanStack Start, Cloudflare Workers build, Vite 7). The user-facing surface is a **web UI**: server-rendered HTML hydrated by React, with a handful of click- and scroll-driven interactive regions.

Two things make verification here different from a normal SPA check:

1. **Most behavior is server-rendered.** Download CTAs, page titles, canonical URLs, release versions, and star counts are decided during SSR from the request's user agent and cached upstream data. A browser snapshot is the proof; a unit test is not.
2. **A lot of the page is a product mockup.** The hero mockup and the phone trio are pictures of an app that is not this app. They are `role="img"` regions with static content — their text does **not** change per state except through the tab panels. Never claim a mockup's inner copy proves a product behavior.

## Launch

Port `8199` is deliberate. The app's configured default is `8082` and Vite's `strictPort` is `false`, so a bare `pnpm dev` **silently drifts to 8083/8084** when another worktree already holds 8082 — and this repo's worktrees routinely do. Always pin the port and require it.

```bash
.agents/skills/verify-isee-international/scripts/launch.sh
export RUN_DIR="$PWD/.verify-isee-international/latest"
```

`launch.sh` starts `pnpm exec vite --port 8199 --strictPort` in `apps/isee-international`, writes `vite.log` and `vite.pid` into a fresh `.verify-isee-international/<timestamp>/`, points `.verify-isee-international/latest` at it, prints the path, and returns only once `http://127.0.0.1:8199/llms.txt` answers. `doctor.sh` and `cleanup.sh` default to `latest`, so they need no arguments.

Do **not** use `pnpm dev -- --port 8199`: pnpm swallows the extra args and the app still binds 8082. Use `pnpm exec vite` (the script does).

Ready looks like this in `$RUN_DIR/vite.log`:

```
  VITE v7.3.3  ready in 8384 ms

  ➜  Local:   http://localhost:8199/
```

Teardown (see [Cleanup](#cleanup)): `scripts/cleanup.sh` kills the recorded PID and verifies the port is free.

## Doctor

Run this first whenever anything looks off — a 200 from the wrong app on the same port is the classic failure here.

```bash
.agents/skills/verify-isee-international/scripts/doctor.sh
```

It checks, read-only:

- `$RUN_DIR/vite.pid` exists and that PID is alive
- `127.0.0.1:8199` is listening **and** the listener's cwd is `apps/isee-international` (so it is ours, not a sibling worktree)
- `GET /` is 200 and the HTML `<title>` starts with `Isee`
- `GET /llms.txt` is 200
- `agent-browser doctor --offline --quick` exits 0

Every check must pass before you drive anything. A failing check means the instance is not worth driving; fix the instance, don't work around it.

## Drive

The harness is **`agent-browser`** (installed globally; Chrome-for-Testing under `~/.agent-browser`). It speaks CDP directly and gives an accessibility snapshot with `@eN` refs.

Derive one stable session name and reuse it for the whole run:

```bash
S="$(agent-browser session id --scope worktree --prefix isee-int)"
export S

agent-browser --session "$S" open http://127.0.0.1:8199/
agent-browser --session "$S" snapshot -i -c      # interactive elements only, compact
agent-browser --session "$S" click @e3           # act on refs from the snapshot
```

Rules that matter on this site:

- **Refs go stale after every click.** The hero mockup and automation tabs re-render on click. Re-snapshot before the next ref interaction, or use `find role button click --name "Build"`, which needs no snapshot.
- **Prefer roles and accessible names.** The interactive handles below are stable and are what the feature map uses.
- **Assert on `document.body.innerText`, not on inner markup.** SSR output contains React comment markers, so `Download for <!-- -->Mac` will not match a naive grep for `Download for Mac`.
- **Platform-dependent SSR needs a user agent.** `agent-browser --session "$S" --user-agent "<ua>" open <url>` re-launches the page with that UA; the server then renders the matching download CTA. Plain `curl -A "<ua>"` works too and is faster when you only need the HTML.
- **Scroll-driven regions need a scroll.** The phone trio animates from `useScroll` progress; at `scrollY=0` both side phones have `opacity: 0`.

One evaluation gotcha: `agent-browser eval` runs in a shared context, so a bare `const t = ...` throws `Identifier 't' has already been declared` on the second call in a session. Always wrap in an IIFE:

```bash
agent-browser --session "$S" eval "(() => { const t = document.body.innerText; return JSON.stringify({x: t.includes('foo')}); })()"
```

## Evidence

Write every artifact under `$RUN_DIR` (exported above; it resolves to this run's `.verify-isee-international/<timestamp>/`). The whole `.verify-isee-international/` tree is gitignored and survives cleanup.

Capture, per verified behavior:

```bash
agent-browser --session "$S" screenshot "$RUN_DIR/<feature>-<state>.png"
agent-browser --session "$S" snapshot -i -c > "$RUN_DIR/<feature>-<state>.snapshot.txt"
curl -sD - -o /dev/null http://127.0.0.1:8199/<path> > "$RUN_DIR/<feature>-headers.txt"
```

Proof standards for this repo:

- **Exercise the real user path.** Click the button, follow the link, scroll the section. Do not call internal setters, and do not read a component's source as evidence that it renders.
- **Capture the action and the resulting state.** For the hero mockup: a snapshot with the clicked pill's `aria-pressed="true"` **and** the panel text that only that state renders. The final screen alone is not proof.
- **Prefer a second, independent view.** `/docs/<slug>` renders HTML; `/docs/<slug>.md` returns the same document as `text/markdown` with a 200 and `content-type: text/markdown`. That pairing is stronger evidence than two screenshots.
- **Distinguish SSR from client behavior.** A `curl` transcript proves SSR output (titles, meta, platform CTAs). Only a browser run proves hydration-dependent behavior (tab switching, `<details>` toggling, scroll animation, clipboard copy).
- **Do not dress a mockup up as product behavior.** The hero/phone mockups are `role="img"` illustrations. Their inner copy is static illustration content; only the tab panels swap.
- **Record what you did not reach.** If a mapped entry point was unreachable, report the attempted command and the unmet precondition. Never report a skipped path as verified through a different path.

## Cleanup

```bash
.agents/skills/verify-isee-international/scripts/cleanup.sh
agent-browser --session "$S" close
```

`cleanup.sh` kills the PID recorded by `launch.sh` and then confirms the port is free; if something still holds it, it kills the listener **only after confirming that process's cwd is `apps/isee-international`**. It never kills by process name and never touches another worktree's dev server.

Cleanup removes the instance and its `vite.pid`. It never removes the run directory: proof artifacts outlive the teardown. After cleanup, `ls "$RUN_DIR"` and confirm the screenshots and transcripts are still there before reporting the run.

## Helpers

All three are executable and take no arguments beyond optional env vars (`PORT`, `RUN_DIR`).

| Script | Invocation | Purpose |
| --- | --- | --- |
| `scripts/launch.sh` | `.agents/skills/verify-isee-international/scripts/launch.sh` | Start Vite on 8199, record PID, wait for readiness |
| `scripts/doctor.sh` | `.agents/skills/verify-isee-international/scripts/doctor.sh` | Read-only health check of the running instance |

`launch.sh` also refreshes a `.verify-isee-international/latest` symlink, which is what `doctor.sh` and `cleanup.sh` read when `RUN_DIR` is unset.
| `scripts/cleanup.sh` | `.agents/skills/verify-isee-international/scripts/cleanup.sh` | Kill only the instance this run started |

## Feature map

Read `features/README.md` before driving. It indexes the user-facing features, each with entry points, exact commands, observable end states, and gotchas.

- `features/landing-page.md` — hero mockup tabs, phone showcase, automation tabs, FAQ, remote-install dialog
- `features/docs.md` — docs navigation, markdown copy/download, `llms.txt` and `.md` routes
- `features/agents-directory.md` — `/agents` grid and per-agent landing pages
- `features/download.md` — `/download` platform detection, beta channel, store links
- `features/content-pages.md` — blog, changelog, Hub, alternatives, legal
