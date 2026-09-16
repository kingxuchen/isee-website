# isee-international

Independent international marketing site in the `isee-website` pnpm workspace.

## Commands

From the workspace root:

```bash
pnpm dev:isee-international
pnpm typecheck:isee-international
pnpm build:isee-international
pnpm test:isee-international
pnpm preview:isee-international
pnpm build:pages:isee-international
pnpm preview:pages:isee-international
pnpm deploy:pages:isee-international
```

Or run the bare scripts from this directory:

```bash
pnpm dev
pnpm typecheck
pnpm build
pnpm test
pnpm preview
pnpm build:pages
pnpm preview:pages
pnpm deploy:pages
```

## Deploy

Two Cloudflare targets build from this one source. `wrangler.toml` holds the settings both read: `main`, the Worker entry the Cloudflare Vite plugin builds, and `pages_build_output_dir`, where Pages reads its assets.

### Cloudflare Pages

```bash
pnpm preview:pages   # build, assemble, serve at http://localhost:8788
pnpm deploy:pages    # build, assemble, `wrangler pages deploy`
```

`pnpm build:pages` runs the Vite build, then `scripts/build-pages.mjs`, which assembles `dist/pages` the way Pages expects it:

- the client assets at the root, so Pages serves them from its asset layer rather than the Function
- `dist/server` as `_worker.js/`, the advanced-mode entry Pages runs as a Function
- `_routes.json`, generated from the asset tree, which routes asset requests to the asset layer and everything else to the Function

To deploy from Git instead, create a Pages project with build command `pnpm build:pages` and build output directory `apps/isee-international/dist/pages`.

The Worker reads an optional `WEBSITE_CACHE` KV namespace to cache GitHub release data. Bind it to the Pages project with a `[[kv_namespaces]]` block in `wrangler.toml` once the namespace exists. Without it each render fetches release data from GitHub, edge-cached for 60 seconds.

`scripts/build-pages.mjs` also deletes `.wrangler/deploy/config.json`, the redirect the Vite plugin writes for the Workers target. Wrangler honours that redirect for `pages dev` and `pages deploy` too, where it shadows `wrangler.toml` and the runtime fails to start. Any later `pnpm build` writes it back, so run `pnpm build` before `pnpm preview`.

### Cloudflare Workers

```bash
pnpm preview   # `vite preview` of the built Worker
pnpm deploy    # build and `wrangler deploy`
```

### What differs between the two targets

`scripts/route-matrix.mjs` prints one row per request against a running instance, so the two targets can be compared directly:

```bash
node scripts/route-matrix.mjs http://127.0.0.1:8788 > pages.txt
```

Both targets return identical status, content type, cache-control, and body for every route that covers, except:

- a missing file under `/assets/` returns the Pages asset-layer 404 instead of the app's 404 page, because `_routes.json` keeps `/assets/*` off the Function
- JavaScript assets arrive as `application/javascript` from Pages and `text/javascript` from Workers

## Configuration

Set `VITE_SITE_URL` when the deployed origin is known. The local default is `http://localhost:8082`.

The App owns its source, public assets, documentation content, and changelog. It does not import libraries from another App.
