#!/usr/bin/env node
// Assembles the Cloudflare Pages output directory from the Cloudflare Vite build:
// static assets at the root, the Worker as `_worker.js/`, and the `_routes.json`
// that keeps asset requests off the Pages Functions quota.
//
// Run through `pnpm build:pages`, which builds with Vite first.

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const appRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const clientDir = path.join(appRoot, "dist", "client");
const serverDir = path.join(appRoot, "dist", "server");
const pagesDir = path.join(appRoot, "dist", "pages");
const workerDir = path.join(pagesDir, "_worker.js");

// Pages rejects a _routes.json with more than 100 rules.
const ROUTE_RULE_LIMIT = 100;

// Wrangler's Pages uploader skips these, and Pages reads some as deployment
// configuration, so none of them is an asset to route.
const CONTROL_ENTRIES = new Set([
  "_headers",
  "_redirects",
  "_worker.js",
  "_routes.json",
  ".assetsignore",
  "wrangler.json",
  ".dev.vars",
]);

function fail(message) {
  console.error(`build-pages: ${message}`);
  process.exit(1);
}

if (!fs.existsSync(clientDir) || !fs.existsSync(serverDir)) {
  fail("dist/client and dist/server are missing. Run `pnpm build` first.");
}

// Rebuilt from scratch so a stale file can never survive into a deployment.
fs.rmSync(pagesDir, { recursive: true, force: true });
fs.mkdirSync(workerDir, { recursive: true });

fs.cpSync(clientDir, pagesDir, { recursive: true });
for (const entry of fs.readdirSync(serverDir)) {
  if (entry === "wrangler.json") continue;
  fs.cpSync(path.join(serverDir, entry), path.join(workerDir, entry), { recursive: true });
}

const workerEntry = path.join(workerDir, "index.js");
if (!fs.existsSync(workerEntry)) {
  fail("dist/server has no index.js entry. _worker.js/index.js is what Pages runs.");
}

// Assets are served by the Pages asset layer, which is not billed as a Functions
// request. Everything left over reaches the Worker, including unknown paths, so
// the app still renders its own 404 page.
const excludes = fs
  .readdirSync(pagesDir, { withFileTypes: true })
  .filter((entry) => !CONTROL_ENTRIES.has(entry.name))
  .map((entry) => (entry.isDirectory() ? `/${entry.name}/*` : `/${entry.name}`))
  .sort();

if (excludes.length > ROUTE_RULE_LIMIT) {
  fail(
    `${excludes.length} asset routes exceed the ${ROUTE_RULE_LIMIT}-rule limit of _routes.json. ` +
      `Group root-level assets into a directory so each one costs a single rule.`,
  );
}

fs.writeFileSync(
  path.join(pagesDir, "_routes.json"),
  `${JSON.stringify({ version: 1, include: ["/*"], exclude: excludes }, null, 2)}\n`,
);

// The Cloudflare Vite plugin writes this redirect for `wrangler deploy` and
// `vite preview`. Wrangler also honours it for `pages dev` and `pages deploy`,
// where it shadows wrangler.toml and crashes the runtime, so the Pages output
// cannot coexist with it. Any later `vite build` writes it again.
fs.rmSync(path.join(appRoot, ".wrangler", "deploy", "config.json"), { force: true });

console.log(
  `build-pages: wrote ${path.relative(appRoot, pagesDir)} (${excludes.length} asset routes, ` +
    `worker entry ${path.relative(appRoot, workerEntry)})`,
);
console.log(
  "build-pages: cleared .wrangler/deploy/config.json so wrangler reads wrangler.toml. " +
    "`vite preview` needs a `pnpm build` to restore it.",
);
