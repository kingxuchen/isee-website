# Download

`/download` lists every way to install the product — desktop builds per OS and architecture, mobile store links and APK, the web app, and the server/CLI command. Which desktop build the hero CTA advertises depends on the visitor's platform, which the server decides from the request `User-Agent` at SSR time.

## Sub-features

- `download-hero-cta` shows a platform-appropriate primary download button in the landing-page hero.
- `download-list` lists the macOS, Windows, Linux, mobile, web, and server options with direct asset links.
- `download-server-command` copies the daemon install command.
- `download-beta-channel` switches between stable and beta releases when a beta exists.
- `download-whats-new` links to the changelog entry for the shown version.

## How to get to it (user POV)

- Header link `Download` from any page, or directly `/download`.
- Landing-page hero CTA: `Download for Mac` / `Download for Windows` / `Download for Linux`, plus `App Store` and `Google Play` buttons.
- `/download?channel=beta` for the beta channel.
- `What's new` next to the version number.

## Driving it with agent-browser

Preconditions:

- `scripts/doctor.sh` passes.
- `S` is set to this run's session.
- The dev server can reach the release source. If it cannot, the version renders empty and version-specific assertions are meaningless — check for a `v<semver>` before asserting anything else.

- **Platform CTA per user agent.** This is SSR behavior, so drive it with the request's user agent. Run each of these and read the primary CTA's label:
  ```bash
  for ua in "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Chrome/133" \
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/133" \
            "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 Chrome/133"; do
    curl -s -A "$ua" http://127.0.0.1:8199/ | grep -oE 'Download for <!-- -->[A-Za-z]+' | head -1
  done
  ```
  The three results are `Mac`, `Windows`, and `Linux` respectively. A mobile user agent instead renders the `App Store` and `Google Play` buttons with no `Download for` CTA.
- **Hero CTA points at a real asset.** With the macOS user agent open in the browser: run `agent-browser --session "$S" --user-agent "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Chrome/133" open http://127.0.0.1:8199/`, then `agent-browser --session "$S" eval "(() => { const a = Array.from(document.querySelectorAll('a')).find(x => /Download for/.test(x.innerText)); return a.innerText + ' -> ' + a.getAttribute('href'); })()"`. The label is `Download for Mac` and the href is a `github.com/.../releases/download/v<version>/...dmg` URL.
- **Full download list.** Run `agent-browser --session "$S" open http://127.0.0.1:8199/download`, wait ~2s, then `agent-browser --session "$S" snapshot -i -c`. The sections `Desktop`, `Mobile`, `Web`, and `Server` are present, with links `Apple Silicon`, `Intel`, `Intel / x64`, `AppImage`, `DEB`, `RPM`, `APK`, `App Store`, `Play Store`, and `Open`.
- **Version and changelog link.** Run `agent-browser --session "$S" eval "(() => { const t = document.body.innerText; return JSON.stringify({v: (t.match(/v[0-9]+\.[0-9]+\.[0-9]+/) || [])[0], whatsNew: t.includes(\"What's new\")}); })()"`. `v` matches `v<semver>` and `whatsNew` is `true`.
- **Server command.** Run `agent-browser --session "$S" snapshot -i -c` and find the `Server` section's `Copy to clipboard` buttons; the adjacent code block shows the daemon install command. Choose one and confirm the label flips to a copied state, matching the docs `Copy as markdown` pattern.
- **Beta channel.** The channel switch only renders when a beta release exists. Run `agent-browser --session "$S" eval "(() => JSON.stringify({switch: !!document.querySelector('[aria-label=\"Release channel\"]'), betaLink: !!Array.from(document.querySelectorAll('a')).find(a => (a.getAttribute('href') || '').includes('channel=beta'))}))()"`. `{"switch":true,"betaLink":true}` means a beta exists and `/download?channel=beta` should be exercised; `{"switch":false,"betaLink":false}` means stable is the newest release and the switch is correctly absent. When a beta exists, `/download?channel=beta` shows the beta version and a beta notice, and drops the `Homebrew`, `Play Store`, and `App Store` rows.
- **Proof.** Capture the rendered page and the SSR transcripts. Run `agent-browser --session "$S" screenshot "$RUN_DIR/download.png"`, `agent-browser --session "$S" snapshot -i -c > "$RUN_DIR/download.snapshot.txt"`, and write the three-user-agent `curl` loop output to `$RUN_DIR/download-platform-ctas.txt`. The transcripts are the evidence for platform detection; the screenshot alone is not.

## Gotchas

- Platform detection is **SSR only**. Changing the viewport or emulating a device after load does not change the CTA; the user agent must be on the request. Use `--user-agent` on `open`, or `curl -A`.
- The rendered markup contains React comment markers: the CTA text is `Download for <!-- -->Mac`. A plain `grep 'Download for Mac'` finds nothing and looks like a failure.
- The channel switch is conditional on a beta release existing. Its absence is the correct state when stable is the newest release, not a bug.
- Beta hides the `Homebrew`, `Play Store`, and `App Store` rows. Assert the absence deliberately rather than assuming a rendering break.
- Asset URLs point at GitHub releases and are not fetched during verification. Verify the URL shape and version, not the asset's availability — a network fetch of a multi-hundred-MB installer is not part of this proof.
- `?channel=beta` is validated and normalized: any other `channel` value falls back to stable. Do not test `?channel=foo` expecting a beta page.
- `agent-browser eval` shares one context across calls in a session; wrap each body in an IIFE.
