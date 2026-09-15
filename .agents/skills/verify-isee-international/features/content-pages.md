# Content pages

Beyond the landing page and docs, the site publishes a blog, a changelog, a Hub product page, a set of "alternatives" comparison pages, and the legal pages. A visitor reaches them from the header, the footer, or a direct URL, and each renders as a server-rendered document with the shared header and footer.

## Sub-features

- `blog-index` lists posts at `/blog`.
- `blog-post` renders a post at `/blog/<slug>`.
- `changelog` renders the release history at `/changelog`.
- `hub` renders the Hub product page at `/hub`.
- `alternatives` renders each comparison page at `/alternatives/<slug>`, linked from the footer's `Alternatives` column.
- `legal` renders `/privacy` and `/terms`.

## How to get to it (user POV)

- Header links: `Blog`, `Changelog`.
- Footer links: `Blog`, `Docs`, `Changelog`, `Hub`, `CLI`, `Privacy`, `Terms`, `Sponsor`, and the `Alternatives` column (`Conductor`, `Superset`, `OpenChamber`, `Happy Coder`, `Codex App`, `Claude Desktop`, `OpenCode Desktop`).
- Direct URLs: `/blog`, `/blog/<slug>`, `/changelog`, `/hub`, `/alternatives/<slug>`, `/privacy`, `/terms`.

## Driving it with agent-browser

Preconditions:

- `scripts/doctor.sh` passes.
- `S` is set to this run's session.

- **Every page renders.** Run the status loop and require `200` for each:
  ```bash
  for p in /blog /changelog /hub /privacy /terms /alternatives/conductor; do
    printf '%-24s %s\n' "$p" "$(curl -s -o /dev/null -w '%{http_code}' "http://127.0.0.1:8199$p")"
  done
  ```
- **`/alternatives` index is a known 404.** `curl -s -o /dev/null -w '%{http_code}' http://127.0.0.1:8199/alternatives` returns `404`: there is no `src/routes/alternatives/index.tsx`, even though `vite.config.ts` lists `/alternatives` in the sitemap. Comparison pages are reachable only by direct URL and from the footer column. Do not treat this as a regression introduced by your change, and do not "fix" it as part of an unrelated verification.
- **Blog index and post.** Open `/blog`. Run `agent-browser --session "$S" open http://127.0.0.1:8199/blog`, wait ~2s, then `agent-browser --session "$S" snapshot -i -c`. Post links such as `Hello World` and `I was wrong about Electron` are present. Choose `Hello World`; the URL becomes `http://127.0.0.1:8199/blog/hello-world` and the H1 reads `Hello World`.
- **Changelog.** Open `/changelog`. Run `agent-browser --session "$S" open http://127.0.0.1:8199/changelog` and then `agent-browser --session "$S" eval "(() => { const t = document.body.innerText; return JSON.stringify({h1: document.querySelector('h1').innerText, hasVersionHeading: /Isee 0\.[0-9]/.test(t)}); })()"`. The H1 is `Changelog` and a version heading is present.
- **Hub.** Open `/hub`. Run `agent-browser --session "$S" open http://127.0.0.1:8199/hub`, then `agent-browser --session "$S" snapshot -i` and read the `region "Choose how to run Hub"` block. The H1 is `Isee Hub`, and the region contains a `Self-hosted` heading with a `Self-host Hub` link and a `Hosted` heading.
- **Alternatives.** Open `/alternatives/claude-desktop`. Run `agent-browser --session "$S" open http://127.0.0.1:8199/alternatives/claude-desktop` and read the snapshot. The H1 names the comparison (`Isee vs Claude Desktop`) and the page has `The main difference`, `Architecture`, and `Providers` sections.
- **Alternatives are reachable from the footer.** On any page, read the footer column. Run `agent-browser --session "$S" open http://127.0.0.1:8199/privacy`, then `agent-browser --session "$S" eval "(() => Array.from(document.querySelectorAll('a[href^=\"/alternatives\"]')).map(a => a.innerText))()"`. All seven comparison names are listed.
- **Legal.** Open `/privacy` and `/terms`. Run `agent-browser --session "$S" open http://127.0.0.1:8199/privacy` then `agent-browser --session "$S" get title`. The title names Privacy; repeat for `/terms`.
- **Proof.** Capture one screenshot per page family. Run `agent-browser --session "$S" screenshot "$RUN_DIR/content-<name>.png"` for blog, changelog, hub, one alternative, and one legal page, plus `snapshot -i -c > "$RUN_DIR/content-<name>.snapshot.txt"` for each. Keep the status loop output as `$RUN_DIR/content-status.txt`.

## Gotchas

- The blog post list is derived from `posts/*.md`. Adding a post changes the index, so assert on a known post rather than on the list length.
- `posts/drafts/` is not published. A post that exists on disk under `drafts/` will 404 at `/blog/<slug>` — that is correct, not a routing bug.
- The changelog content comes from a source file and changes with every release. Assert on the H1 and the presence of a version heading, not on a specific version.
- `/alternatives` itself 404s (no index route), so there is no index page to read links off. Get the slugs from the footer's `Alternatives` column or from `src/data/alternative-pages.ts`.
- The comparison slugs are not always the competitor's product name lowercased: `claude-desktop`, `codex-app`, `opencode-desktop`, `happy-coder`, `openchamber`, `conductor`, `superset`.
- These pages reuse the shared header and footer, so a header link check here duplicates the landing page's check. Do not report the same nav assertion twice as two verified features.
- The Hub region has an **implicit** `region` role (a named `<section>`), so `document.querySelector('[role=region]')` returns nothing. Read it from the accessibility snapshot, which resolves implicit roles.
- `agent-browser eval` shares one context across calls in a session; wrap each body in an IIFE.
