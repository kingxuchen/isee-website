# Docs

Docs at `/docs` present the product documentation with a grouped sidebar, per-page breadcrumbs, an on-this-page outline, and per-page actions to copy the source markdown or open it raw. The same documents are also served as plain markdown for agents, and a site-wide index is published at `/llms.txt`.

## Sub-features

- `docs-nav` browses and expands the sidebar groups and reaches any document.
- `docs-outline` jumps within the current document via the "On this page" navigation.
- `docs-copy-markdown` copies the current document's markdown source to the clipboard.
- `docs-view-markdown` opens the raw markdown for the current document.
- `docs-markdown-route` serves the same document as `text/markdown` at `<doc href>.md`.
- `docs-llms-index` publishes the site-wide document index at `/llms.txt`.
- `docs-mobile-nav` opens the sidebar drawer below the `lg` breakpoint.

## How to get to it (user POV)

- Header link `Docs` from any page, or directly `/docs`.
- Sidebar links such as `Getting started`, `Connectivity`, `Security`, `Providers`, `CLI reference`, `Plugins`.
- Per-page buttons `Copy as markdown` and `View as markdown`.
- Direct URLs: `/docs`, `/docs/<slug>`, `<doc href>.md`, `/llms.txt`.

## Driving it with agent-browser

Preconditions:

- `scripts/doctor.sh` passes.
- `S` is set to this run's session; the page is open at `http://127.0.0.1:8199/docs`.
- The sidebar renders at the default viewport (it is visible from the `lg` breakpoint up; the default agent-browser viewport qualifies).

- **Sidebar reachability.** Read the sidebar. Run `agent-browser --session "$S" snapshot -i -c`. Links named `Getting started`, `Connectivity`, `Security`, `Providers`, `CLI reference`, and `Plugins` are present.
- **Landing document.** Read the default document. Run `agent-browser --session "$S" eval "(() => { return JSON.stringify({url: location.href, h1: document.querySelector('h1').innerText, crumb: document.querySelector('[aria-label=Breadcrumb]').innerText.replace(/\n/g, ' > ')}); })()"`. The URL is `http://127.0.0.1:8199/docs`, the H1 is `#\nGetting started` (the `#` is the heading's own anchor link, which is part of the H1), and the breadcrumb reads `Docs > Getting started`. `Getting started` is the `/docs` landing doc, so its sidebar `href` is `/docs`, not `/docs/getting-started`.
- **Navigate to another document.** Choose `CLI reference` or any leaf link. Run `agent-browser --session "$S" find role link click --name "<label>"`, then `agent-browser --session "$S" get url`. The URL matches the link's `href` and the breadcrumb names the new document.
- **Per-page actions exist.** Read the page. Run `agent-browser --session "$S" snapshot -i -c` and find `button "Copy as markdown"` and `link "View as markdown"`. Both are present on every rendered docs page.
- **Copy to clipboard.** Choose `Copy as markdown`. Run `agent-browser --session "$S" find role button click --name "Copy as markdown"`, then `agent-browser --session "$S" eval "(() => Array.from(document.querySelectorAll('button')).find(b => /Copy as markdown|Copied/.test(b.innerText)).innerText)()"`. The label reads `Copied`.
- **Outline navigation.** List the "On this page" entries. Run `agent-browser --session "$S" snapshot -i -c` and read the `navigation "On this page"` block. Click one entry by name; the URL gains a `#<slug>` fragment and the heading becomes the scroll target.
- **Markdown route — the independent second view.** Fetch the same document as markdown, using the `href` you read off the sidebar link. For the landing doc that is `curl -sD "$RUN_DIR/docs.md.headers" -o "$RUN_DIR/docs.md" http://127.0.0.1:8199/docs.md`; for a nested doc it is `.../docs/cli.md`. Status is `200`, `content-type: text/markdown; charset=utf-8`, and the body's H1 matches the HTML page's H1.
- **Site index.** Run `curl -sD "$RUN_DIR/llms.txt.headers" -o "$RUN_DIR/llms.txt" http://127.0.0.1:8199/llms.txt`. Status is `200`, `content-type: text/markdown; charset=utf-8`, and the body has `## Docs`, `## Alternatives`, `## Supported agents`, and `## Optional` sections, each a bullet list of markdown links.
- **Proof.** Capture the rendered document and its markdown twin. Run `agent-browser --session "$S" screenshot "$RUN_DIR/docs-page.png"`, `agent-browser --session "$S" snapshot -i -c > "$RUN_DIR/docs-page.snapshot.txt"`, and keep `$RUN_DIR/docs.md` with its headers file. The pair proves the HTML page and the markdown route agree.

## Gotchas

- The markdown route is `<doc href>.md`, derived from the source path under `site-docs/` — not from the sidebar label. `Getting started` lives at `/docs.md`; a guess of `/docs/getting-started.md` returns 404. Read the `href` off the sidebar link.
- `site-docs/index.md` and any `<dir>/index.md` collapse into their directory's slug, so the document's title never tells you its URL.
- Every docs heading carries a `Link to this section` anchor link, and its `#` glyph is inside the `<h1>`. `h1.innerText` is therefore `#\nGetting started`, not `Getting started`. Assert with a `contains` check or strip the leading `#`.
- The markdown route's body starts with a blank line before the H1, so `head -1` prints nothing. Use `grep -m1 '^# '` to read the title.
- `/llms.txt` embeds absolute URLs built from `VITE_SITE_URL`, whose default is `http://localhost:8082`. On a run pinned to 8199 the links point at 8082. That is expected — do not treat it as a broken link, and do not assert on the origin inside `llms.txt` unless you launched with `VITE_SITE_URL` set to match.
- `View as markdown` opens a new tab. Prefer `curl` when you only need the bytes — it avoids the tab and gives you the response headers.
- The docs sidebar groups are collapsible rows with `aria-expanded`. A group whose name matches a page label may need expanding before its children are reachable.
- The mobile drawer only appears below the `lg` breakpoint. At the default viewport there is no `Open menu` button, and looking for one is a false negative.
- `agent-browser eval` shares one context across calls in a session; wrap each body in an IIFE or the second call fails with `Identifier 'x' has already been declared`.
