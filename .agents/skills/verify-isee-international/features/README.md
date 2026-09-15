# isee-international verification map

This directory is the maintained source for verifying the user-facing behavior of the `isee-international` marketing site. Read this index before driving the app, then use the matching feature file as the recipe.

The harness and lifecycle live in [`../SKILL.md`](../SKILL.md). This file covers baseline state, conventions, and proof standards.

## Baseline preconditions

- Launch at `http://127.0.0.1:8199` with `scripts/launch.sh` (pinned port, `strictPort`).
- Put every artifact under `$RUN_DIR` (`.verify-isee-international/<timestamp>/`).
- One `agent-browser` session per run: `S="$(agent-browser session id --scope worktree --prefix isee-int)"`.
- The dev server reads release and star data over the network at SSR time. If those fetches fail, the page still renders but version strings fall back — check `/download` shows a `v<semver>` before asserting on version-specific copy.
- Never drive an instance this run did not start. `scripts/doctor.sh` proves ownership by cwd.

## Driving conventions

- Start every recipe from the baseline state unless its preconditions say otherwise.
- Prefer ARIA roles and accessible names over CSS selectors or DOM position.
- Refs (`@eN`) go stale after every page change. Re-snapshot, or use `find role button click --name "..."`.
- Wrap every `agent-browser eval` body in an IIFE — the eval context is shared and bare `const` declarations collide across calls.
- Assert on `document.body.innerText`. SSR markup carries React comment markers (`Download for <!-- -->Mac`).
- Platform-dependent rendering is driven by the request `User-Agent` at SSR time; pass `--user-agent "<ua>"` to `open`.
- Treat every command as literal. Keep quoted names and flags unchanged.

## Proof and skip reporting

- Capture the user action and the resulting state, not only the final screen.
- UI proof is a screenshot plus an accessibility snapshot with the app identity visible.
- SSR proof is a `curl` transcript including status and `content-type` headers.
- Prefer a second independent view: `/docs/<slug>` (HTML) alongside `/docs/<slug>.md` (`text/markdown`).
- Never present an illustration as product behavior — the hero mockup and phone trio are `role="img"` pictures of a different app.
- Report an unreachable path with the attempted command and the unmet precondition.
- Do not report a skipped entry point as verified through a different path.

## Feature entry contract

Each feature file starts with an H1 title and one paragraph describing the user-visible behavior. It then uses exactly four H2 sections in this order.

1. `Sub-features` lists short IDs with one line for each behavior.
2. `How to get to it (user POV)` lists every user entry point.
3. `Driving it with agent-browser` starts with `Preconditions:` and uses labeled bullets that pair each user action with an exact command and observable result.
4. `Gotchas` lists traps that can waste or invalidate a verification run.

Keep implementation details out of the map. Name only user paths, stable handles, required state, commands, and observable proof.

## Features

- [Landing page](./landing-page.md) — hero mockup tabs, phone showcase, automation tabs, FAQ, remote-install dialog.
- [Docs](./docs.md) — docs navigation, markdown copy and download, `llms.txt` and `.md` routes.
- [Agents directory](./agents-directory.md) — `/agents` grid and the per-agent landing pages.
- [Download](./download.md) — `/download` platform detection, beta channel, store links.
- [Content pages](./content-pages.md) — blog, changelog, Hub, alternatives, legal.
