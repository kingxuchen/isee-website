# Next.js 16 VPS Self-Hosting — Cited Fact Sheet

Research question: official way to self-host Next.js 16 (App Router) on a Linux VPS (port 8080, DB on same box), and how it differs from @opennextjs/cloudflare / Cloudflare Workers.

Source docs: bundled Next docs from the exact installed version `next@16.3.3` (paths below assume `node_modules/next/dist/docs/` once installed), plus `@opennextjs/cloudflare@1.20.4` package + this repo's `wrangler.jsonc` / `open-next.config.ts`.

## 1. Can Next 16 run on a VPS without Cloudflare? Official production command

Yes. Official doc `01-app/01-getting-started/17-deploying.md` ("Node.js server"): "Next.js can be deployed to any provider that supports Node.js." Production flow is the standard pair: `npm run build` then `npm run start` (`next start`). "This server supports all Next.js features." `output: 'standalone'` is an optional optimization producing a minimal `server.js` in `.next/standalone` run via `node .next/standalone/server.js` (`.../01-next-config-js/output.md`); the full `next start` (with node_modules) is still the documented default. `next start` requires a prior `next build` (`.../06-cli/next.md`: "The application should be compiled with `next build` first"). `Deploying to platforms` sums it up: "To run Next.js, your platform needs **a Node.js server**. That's it." Cloudflare is not a requirement; per `deploying.md`, Cloudflare is not yet a verified adapter ("Cloudflare and Netlify are working on verified adapters... In the meantime, they offer their own Next.js integrations").

## 2. Binding port 8080

- `next start`: `-p` / `--port <port>` (default 3000, env `PORT`); `-H` / `--hostname <hostname>` (default `0.0.0.0`). Source: `.../06-cli/next.md` (`next start` options table).
- Standalone server: `PORT=8080 HOSTNAME=0.0.0.0 node .next/standalone/server.js`. Source: `.../01-next-config-js/output.md` Good-to-know.
- Gotchas: (a) `next start` already binds 0.0.0.0 by default, so on a VPS only the port matters. (b) Custom servers exist (`01-app/02-guides/custom-server.md`) but are discouraged ("only be used when the integrated router of Next.js can't meet your app requirements") and "cannot be used together" with `output: 'standalone'` (standalone does not trace custom-server files). (c) Ports < 1024 need root/CAP_NET_BIND_SERVICE on Linux — 8080 needs nothing. (d) `next dev` is development-only, not production.

## 3. Cloudflare-only pieces that stop applying on Node

- Workers runtime: OpenNext bundles the app into `.open-next/worker.js` running on workerd (`wrangler.jsonc` `main`). On a VPS you run plain Node instead; `nodejs_compat` compatibility flag is moot because Node is the native runtime.
- Wrangler assets: `assets.binding = "ASSETS"` serving static files from `.open-next/assets` — on Node, `next start` serves `public/` and `.next/static` itself.
- IMAGES binding (`images.binding = "IMAGES"`, Cloudflare Image Resizing): on Node, `next/image` optimization works self-hosted with zero config via `next start` (needs `sharp`). Source: `01-app/02-guides/self-hosting.md` (Image Optimization section) and `01-app/02-guides/deploying-to-platforms.md` ("The only additional dependency is the `sharp` package").
- OpenNext cache adapters: `dist/api/overrides/incremental-cache/` (kv-incremental-cache.js, r2-incremental-cache.js, regional-cache.js) and `dist/api/overrides/tag-cache/kv-next-tag-cache.js` map Next's server cache onto Workers KV/R2. On Node the default cache is in-memory + local filesystem — no adapter needed. Source: `self-hosting.md` Caching section ("by default, this cache is stored on the local filesystem (on disk) of each Next.js server instance").
- Tooling: `opennextjs-cloudflare build/deploy`, `wrangler dev/preview`, `open-next.config.ts` (`defineCloudflareConfig`) all disappear; replaced by `next build` + `next start` (or standalone).

## 4. Database on the same VPS

Supported, no adapter. The default runtime for all routes is Node.js (`'nodejs'` default; Edge Runtime is deprecated — `.../02-route-segment-config/runtime.md`). Server Components run server-side, credentials stay out of the client bundle: "you can safely make database queries using an ORM or database client" (`01-app/01-getting-started/06-fetching-data.md`, "With an ORM or database"). Route Handlers treat "database queries" as runtime data that forces dynamic rendering (`01-app/01-getting-started/15-route-handlers.md`). Server Actions run in the same Node server. It is just Node + TCP: DB clients are automatically externalized to native `require` rather than bundled (`.../01-next-config-js/serverExternalPackages.md` auto-list includes `pg`, `better-sqlite3`, `libsql`, `@prisma/client`, `mongoose`, `mongodb`, `sqlite3`...). Set `DATABASE_URL` (e.g. `postgres://...@127.0.0.1:5432/db`) and query directly. The only Workers constraint (outbound TCP only via `connect()`/Hyperdrive, KV/D1 as the "database") simply doesn't exist on a VPS.

## 5. When would you actually have to abandon Next.js

Almost never for runtime reasons — the Node server covers everything. `deploying-to-platforms.md`: "A single `next start` process handles every Next.js feature correctly: Server Components, ISR, PPR, Cache Components, Server Actions, Proxy, and `after()`." Edge Runtime is deprecated in v16, so there is no Next runtime feature that requires non-Node compute. Real reasons to leave Next or its current hosting: (a) you need global zero-origin edge scale (millions of requests, edge latency) — that's Cloudflare's model and why OpenNext exists; (b) app code directly uses Cloudflare bindings (KV, R2, D1, Hyperdrive, Queues, IMAGES) — swap to Postgres/Redis/S3 equivalents; (c) multi-instance scale on one server is insufficient — that's infrastructure (shared cache handler + `deploymentId`), not abandoning Next; (d) native modules that fail to compile — a Workers/workerd constraint (e.g. `sharp` needs wasm there), not a Linux VPS problem.

## 6. Reverse proxy vs exposing 8080 directly

Official guidance: use a reverse proxy. `self-hosting.md` Reverse Proxy section: "When self-hosting, it's recommended to use a reverse proxy (like nginx) in front of your Next.js server rather than exposing it directly to the internet. A reverse proxy can handle malformed requests, slow connection attacks, payload size limits, rate limiting, and other security concerns, offloading these tasks from the Next.js server." Streaming gotcha: nginx buffers by default — set `X-Accel-Buffering: no` so streaming/PPR/Server Components work end-to-end.

## 7. Docker vs systemd/pm2

Next.js officially documents two self-hosting targets: Node.js server and Docker; both are "All" feature support in `deploying.md`. Docker best practice is `output: 'standalone'` → minimal image running `node server.js` (deploying.md Docker section links the `with-docker` example using standalone; `output.md` documents `.next/standalone`). systemd/pm2 are not Next.js-documented — they're generic supervisors for the same two commands (`next start` with node_modules, or `node .next/standalone/server.js` with none). Whatever supervisor you use, send SIGTERM/SIGINT and allow a 10–30s drain so `after()` callbacks finish (`self-hosting.md` `after` section).

## Node VPS vs Cloudflare Workers (OpenNext) contrast

| Aspect | Node VPS (`next start` / standalone) | Cloudflare Workers (OpenNext) |
|---|---|---|
| Production command | `next build` + `npm run start` (or `node .next/standalone/server.js`) | `opennextjs-cloudflare build && opennextjs-cloudflare deploy` |
| Runtime | Node.js (default and only non-deprecated runtime) | workerd + `nodejs_compat` compat flag |
| Binding port | `PORT=8080` / `-p 8080`; reverse proxy in front | none (edge fetch) |
| Static assets | served by Next (`public/`, `.next/static`) | wrangler `assets` binding (`ASSETS`) |
| Image optimization | `next/image` + `sharp` (self-hosted) | Cloudflare Image Resizing (`IMAGES` binding) |
| Server cache | in-memory + local disk, optional shared cache handler | Workers KV / R2 incremental-cache + regional cache |
| DB access | plain Node TCP: pg, better-sqlite3, Prisma, etc. | `connect()`/Hyperdrive; D1/KV/R2 as CF-native stores |
| Scale model | single long-lived process (or N + load balancer) | serverless, per-request isolation, edge locations |
| Native modules | compile/run normally on Linux | need wasm or nodejs_compat support; `sharp` needs wasm |

## Verdict: leaving Next.js vs swapping the adapter

- **Forces leaving Next.js**: nothing in Next 16 itself — the Node server is the reference implementation. Only if the business needs edge-scale/zero-origin hosting (i.e. you decide you need Workers) or if app code is coupled to Cloudflare-specific bindings (KV/R2/D1/Hyperdrive/Queues/IMAGES) would you restructure — and even then you'd swap those for Postgres/Redis/S3, not leave Next.
- **Just swapping the adapter**: the normal VPS move = remove `@opennextjs/cloudflare` + `open-next.config.ts` + wrangler pieces (nodejs_compat, ASSETS, IMAGES, KV/R2 cache adapters are all unused), change scripts to `next build`/`next start` (optionally `output: 'standalone'`), put nginx in front. App-Router code is unchanged.
