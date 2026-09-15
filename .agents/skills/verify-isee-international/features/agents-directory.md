# Agents directory

`/agents` is the index of every coding agent the product can run: a card grid, one card per agent, each linking to that agent's own landing page at `/<slug>`. A visitor can scan the grid and land on any agent page. `/llms.txt` publishes the same set as machine-readable links.

## Sub-features

- `agents-grid` lists every supported agent as a linked card.
- `agents-card-nav` opens the linked agent landing page.
- `agents-page` renders an agent landing page with its own hero, mockup, and copy.
- `agents-llms` lists the same agents in `/llms.txt`.

## How to get to it (user POV)

- Header link `Docs` leads to the docs; `/agents` is reached by direct URL or from the `+34 more` link in the landing page's providers section.
- Each card in the grid is a link: `Claude Code`, `Codex`, `OpenCode`, `GitHub Copilot`, `OMP (Oh My Pi)`, and the rest.
- Individual agent pages: `/claude-code`, `/codex`, `/opencode`, `/pi`, and the other slugs.

## Driving it with agent-browser

Preconditions:

- `scripts/doctor.sh` passes.
- `S` is set to this run's session.

- **Grid renders.** Run `agent-browser --session "$S" open http://127.0.0.1:8199/agents`, wait ~2s, then `agent-browser --session "$S" eval "(() => { const t = document.body.innerText; return JSON.stringify({h1: document.querySelector('h1').innerText, links: document.querySelectorAll('main a').length}); })()"`. The H1 is `Every agent Isee supports` and `links` is `40` — 39 agent cards plus one `Configure any ACP-compatible agent` link to `/docs/custom-providers`. To count only cards, filter for `href` matching `^/[a-z0-9-]+$`.
- **Card carries a description.** Read the grid. Run `agent-browser --session "$S" snapshot -i -c`. The first card is a link whose accessible name includes the agent name and a one-line description, with the agent name also exposed as a level-2 heading inside it.
- **Follow a card.** Choose `Codex`. Run `agent-browser --session "$S" find role link click --name "Codex"` (the link name includes the description, so a text match on `Codex` may be ambiguous — if so, click the `heading "Codex"`'s ancestor link by ref from the snapshot). The URL becomes `http://127.0.0.1:8199/codex` and the H1 names that agent.
- **Agent page has the shared landing furniture.** On the agent page, run `agent-browser --session "$S" snapshot -i -c`. The header links, hero pill buttons, `Run agents on a remote machine` button, and `+34 more` link are present, matching the root landing page.
- **Agent page hero is interactive.** Choose `Ship`. Run `agent-browser --session "$S" find role button click --name "Ship"`, then `agent-browser --session "$S" eval "(() => document.body.innerText.includes('granular daemon permissions'))()"`. The result is `true`.
- **Machine-readable index.** Run `curl -sD "$RUN_DIR/llms.txt.headers" -o "$RUN_DIR/llms.txt" http://127.0.0.1:8199/llms.txt`, then `sed -n '/^## Agents/,/^## /p' "$RUN_DIR/llms.txt"`. Every grid card has a matching bullet whose link is `<origin>/<slug>`.
- **Proof.** Capture the grid and one agent page. Run `agent-browser --session "$S" screenshot "$RUN_DIR/agents-grid.png"` on `/agents`, then `agent-browser --session "$S" screenshot "$RUN_DIR/agents-codex.png"` on `/codex`, and keep `$RUN_DIR/llms.txt`. The grid screenshot plus the index prove the rendered set and the published set agree.

## Gotchas

- The grid card's accessible name concatenates the agent name and its description, so `find role link --name "Codex"` can match more than one card (for example an agent whose description mentions Codex). Use the ref from a fresh snapshot, or `--exact`.
- The agent pages share the landing page's component tree, so the hero mockup and phone trio are present and carry the same `role="img"` labels. All the landing-page mockup caveats apply: their inner copy is illustration content.
- The card count is derived from the data file, so it changes when agents are added. Assert the count as a signal, not as a contract; a mismatch means the grid changed, not that it broke.
- `main` contains one non-card link (`Configure any ACP-compatible agent` → `/docs/custom-providers`), so `main a` is one more than the number of agents. Count `AGENT_PAGES` entries or filter the hrefs.
- `+34 more` in the grid area links to `/agents` itself when you are already there — it is a same-page no-op, not a separate view.
- `agent-browser eval` shares one context across calls in a session; wrap each body in an IIFE.
