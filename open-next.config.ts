import { defineCloudflareConfig } from "@opennextjs/cloudflare";

export default defineCloudflareConfig({
  // No KV/R2 incremental cache for now. See docs/wayfinder/tickets/001-install-adapter.md
});
