# Landing page

The landing page at `/` presents the product through an interactive hero mockup, a scroll-driven phone showcase, an automation tab set, an FAQ list, and a remote-install dialog. A visitor can switch the mockup state, reveal the phone trio by scrolling, read the MCP/CLI/SDK examples, open FAQ answers, and read the daemon install command.

## Sub-features

- `landing-hero-tabs` switches the hero mockup between `Build`, `Review`, `Ship`, and `Extend`.
- `landing-phone-reveal` scrolls the phone trio so the two side phones slide out and fade in.
- `landing-automation-tabs` switches the automation panel between `MCP`, `CLI`, and `SDK`.
- `landing-faq` opens and closes FAQ answers.
- `landing-install-dialog` opens the remote-machine install command and closes it.
- `landing-nav` reaches every top-level destination from the header and footer.

## How to get to it (user POV)

- Open `/` — this is the site root, linked from the logo in every header and footer.
- Header links: `Blog`, `Docs`, `Changelog`, `Download`, `Sponsor`, `Discord`, `GitHub`.
- Hero pills: `Build`, `Review`, `Ship`, `Extend` (default `Build`).
- Hero CTA: `Download for <platform>`, `App Store`, `Google Play`.
- `Run agents on a remote machine` button in the "Remote machines" card.
- `+34 more` links in the providers and "Run it anywhere" sections.
- Footer link grid.

## Driving it with agent-browser

Preconditions:

- `scripts/doctor.sh` passes.
- `S` is set to this run's session; the page is open at `http://127.0.0.1:8199/`.
- The window is tall enough that the hero is on screen (default viewport is fine).

- **Header reachability.** Confirm every top-level destination is linked. Run `agent-browser --session "$S" snapshot -i -c` and read the first ten lines. Links named `Blog`, `Docs`, `Changelog`, `Download`, `Sponsor`, `Discord`, and `GitHub, <n> stars` are present.
- **Hero tab switch.** Choose `Ship`. Run `agent-browser --session "$S" find role button click --name "Ship"`, then `agent-browser --session "$S" eval "(() => { const t = document.body.innerText; return JSON.stringify({ship: t.includes('granular daemon permissions')}); })()"`. The result is `{"ship":true}`, and `agent-browser --session "$S" eval "(() => Array.from(document.querySelectorAll('button[aria-pressed]')).map(b => b.innerText.trim() + '=' + b.getAttribute('aria-pressed')).join(', '))()"` returns `Build=false, Review=false, Ship=true, Extend=false`.
- **Hero tab state isolation.** Choose `Extend`. Run `agent-browser --session "$S" find role button click --name "Extend"` then the same eval with `live: t.includes('Release Radar is live')`. The result is `{"live":true}`, and `ship` is now `false`. This proves the panels swap rather than accumulate.
- **Phone reveal at rest.** Reload and stay at the top. Run `agent-browser --session "$S" open http://127.0.0.1:8199/`, then `agent-browser --session "$S" eval "(() => { const g = n => getComputedStyle(document.querySelector('[role=img][aria-label=\"' + n + '\"]')).opacity; return JSON.stringify({left: g('Isee workspace drawer'), right: g('Isee diff view')}); })()"`. Both are `"0"`.
- **Phone reveal on scroll.** Scroll the trio into the middle of the viewport. Run `agent-browser --session "$S" eval "(() => { const c = document.querySelector('[role=img][aria-label=\"Isee workspace drawer\"]').parentElement; scrollTo(0, c.getBoundingClientRect().top + scrollY + c.offsetHeight / 2 - innerHeight / 2); return 'scrolled'; })()"`, wait ~2s, then repeat the opacity eval. Both are `"1"`, and reading the transform's `matrix3d` tx shows `-260` and `260` respectively.
- **Automation tabs.** Scroll to "Built for automation" and choose `CLI`. Run `agent-browser --session "$S" find role tab click --name "CLI"`, then `agent-browser --session "$S" eval "(() => { const tabs = Array.from(document.querySelectorAll('[role=tab]')); const p = document.querySelector('[role=tabpanel]'); return JSON.stringify({tabs: tabs.map(t => t.innerText.split('\n')[0] + '=' + t.getAttribute('aria-selected')).join(','), panel: p.innerText.slice(0, 90)}); })()"`. The tabs read `MCP=false,CLI=true,SDK=false` and the panel text starts with a shell command (`$ isee run ...`) instead of the MCP transcript. Repeat for `SDK`.
- **FAQ open.** Toggle the first answer. Run `agent-browser --session "$S" click "details summary"`, then `agent-browser --session "$S" eval "(() => { const d = document.querySelector('details'); return JSON.stringify({open: d.open, text: d.innerText.slice(0, 60)}); })()"`. `open` is `true` and the summary marker renders as `−` instead of `+`.
- **Install dialog.** Choose `Run agents on a remote machine`. Run `agent-browser --session "$S" find role button click --name "Run agents on a remote machine"`, then `agent-browser --session "$S" eval "(() => { const t = document.body.innerText; return JSON.stringify({cmd: t.includes('npm install -g @isee/cli && isee')}); })()"`. The result is `{"cmd":true}`.
- **Install dialog close.** Press Escape. Run `agent-browser --session "$S" press Escape`, then repeat the eval. The result is `{"cmd":false}`.
- **Proof.** Capture the shipped hero state and the revealed phone trio. Run `agent-browser --session "$S" screenshot "$RUN_DIR/landing-hero-ship.png"`, `agent-browser --session "$S" snapshot -i -c > "$RUN_DIR/landing-hero-ship.snapshot.txt"`, and `agent-browser --session "$S" screenshot "$RUN_DIR/landing-phone-reveal.png"`. Keep the `aria-pressed` eval output alongside them — the accessibility snapshot lists the pill buttons but does **not** surface `aria-pressed`, so the eval output is the state evidence.

## Gotchas

- The hero mockup and phone trio are `role="img"` illustrations of a different application. Their inner copy is static; only the four tab panels swap. Do not cite mockup text as product behavior.
- `Ship` and `Extend` each render a state-exclusive string; `Build` and `Review` do not. All four share the sidebar, agent chat, and diff panes, so `document.body.innerText` cannot distinguish `Build` from `Review`. Read `aria-pressed` from the DOM for those, and use a state-exclusive string only where one exists.
- `aria-pressed` does not appear in `agent-browser snapshot` output. Read it with `eval` (see the hero tab switch step); a snapshot is not state evidence for the pills.
- The phone trio animates from `useScroll` progress. At `scrollY=0` both side phones are `opacity: 0` with `tx=0`; asserting before scrolling looks like a failure but is the correct resting state.
- The automation selectors are `role="tab"` elements named `MCP`, `CLI`, `SDK`. They are **not** `role="button"`, so `find role button click --name "CLI"` fails with `none match name "CLI"`. Use `find role tab click --name "CLI"`. `CLI` and `SDK` also appear as docs links in the same section, so a bare text search is ambiguous.
- The FAQ uses native `<details>`/`<summary>`. Clicking the summary's text node is unreliable through `find text`; click the `details summary` element directly, or run `document.querySelector('details summary').click()`.
- The install dialog closes on outside click and on Escape. A click meant for the page behind it will dismiss the dialog first.
- `agent-browser find role <role> click` accepts the implicit ARIA roles: `button`, `link`, `tab`, `heading`, `navigation`. Using the wrong role reports the names it did see, which is usually enough to correct the command.
- Marquee rows animate on a 46s/52s CSS loop and pause on hover. A screenshot of that section is not time-stable; assert on presence, not position.
