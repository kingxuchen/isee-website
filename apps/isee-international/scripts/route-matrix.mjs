#!/usr/bin/env node
// Prints one stable row per request against a running instance, so two targets
// (the Workers preview and the Pages preview) can be diffed row by row.
//
//   node scripts/route-matrix.mjs http://127.0.0.1:8288 > pages.txt
//
// Dynamic values a target cannot control (GitHub release data) still compare
// equal when both targets are sampled within the same few minutes.

import { createHash } from "node:crypto";

const base = process.argv[2] ?? "http://127.0.0.1:8288";

const DESKTOP_UA =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36";
const ANDROID_UA =
  "Mozilla/5.0 (Linux; Android 15; Pixel 9) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Mobile Safari/537.36";

const CASES = [
  { path: "/" },
  { path: "/", ua: ANDROID_UA },
  { path: "/download" },
  { path: "/download", ua: ANDROID_UA },
  { path: "/agents" },
  { path: "/codex" },
  { path: "/alternatives" },
  { path: "/alternatives/claude-desktop" },
  { path: "/blog" },
  { path: "/blog/hello-world" },
  { path: "/changelog" },
  { path: "/hub" },
  { path: "/sponsor" },
  { path: "/privacy" },
  { path: "/terms" },
  { path: "/docs" },
  { path: "/docs/browser" },
  { path: "/docs/browser.md" },
  { path: "/docs/hub/api" },
  { path: "/docs.md" },
  { path: "/llms.txt" },
  { path: "/android-version.txt" },
  { path: "/cloud" },
  { path: "/cloud/" },
  { path: "/docs/alternatives/claude-desktop" },
  { path: "/docs/plugins/reference" },
  { path: "/docs/plugins/reference.md" },
  { path: "/nonexistent-route-for-matrix" },
  { path: "/logo.svg" },
  { path: "/favicon.ico" },
  { path: "/brand/logo.svg" },
  { path: "/schemas/paseo.config.v1.json" },
  { path: "/sitemap.xml" },
  { path: "/pages.json" },
  { path: "/phone-1-320.webp" },
  { path: "/assets/does-not-exist.js" },
  { path: "/_headers" },
  { path: "/_routes.json" },
  { path: "/_worker.js/index.js" },
];

function fingerprint(body) {
  return createHash("sha256").update(normalize(body)).digest("hex").slice(0, 16);
}

// TanStack Start stamps each SSR response with the request time in the
// dehydrated router state (`u:1789536115626`), which differs between any two
// requests. Everything else in the body is expected to match byte for byte.
function normalize(body) {
  return body.toString("utf8").replace(/u:\d{10,}/g, "u:<timestamp>");
}

function title(body) {
  const match = body.toString("utf8").match(/<title[^>]*>([^<]*)</);
  return match ? match[1].trim().replace(/\s+/g, " ") : "-";
}

function summarize(response, body) {
  const type = response.headers.get("content-type") ?? "-";
  const location = response.headers.get("location")?.replace(base, "<base>") ?? "-";
  return [
    String(response.status),
    type.split(";")[0],
    location,
    response.headers.get("cache-control") ?? "-",
    response.headers.get("vary") ?? "-",
    String(body.length),
    fingerprint(body),
    type.startsWith("text/html") ? title(body) : "-",
  ].join("\t");
}

async function request(path, ua) {
  const response = await fetch(new URL(path, base), {
    headers: { "user-agent": ua ?? DESKTOP_UA },
    redirect: "manual",
  });
  return summarize(response, Buffer.from(await response.arrayBuffer()));
}

async function referencedAsset() {
  const response = await fetch(new URL("/", base), { headers: { "user-agent": DESKTOP_UA } });
  const html = await response.text();
  return html.match(/\/assets\/[A-Za-z0-9_.-]+\.js/)?.[0] ?? null;
}

const columns = [
  "path",
  "ua",
  "status",
  "type",
  "location",
  "cache-control",
  "vary",
  "bytes",
  "sha256/16",
  "title",
];

const rows = [];
for (const { path, ua } of CASES) {
  const label = ua === ANDROID_UA ? "android" : "desktop";
  rows.push(`${path}\t${label}\t${await request(path, ua)}`);
}

// The asset a real page load fetches, so the row is never a stale build's name.
const assetPath = await referencedAsset();
rows.push(
  assetPath
    ? `${assetPath}\tdesktop\t${await request(assetPath)}`
    : "/assets/<none referenced>\tdesktop\tno asset URL found in /",
);

process.stdout.write(`# base ${base}\n`);
process.stdout.write(`${columns.join("\t")}\n`);
process.stdout.write(`${rows.join("\n")}\n`);
