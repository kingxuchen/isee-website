import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const read = (name: string) =>
  readFileSync(new URL(`../${name}`, import.meta.url), "utf8");

const readSetting = (config: string, key: string) => {
  const match = config.match(new RegExp(`^${key}\\s*=\\s*(.+)$`, "m"));
  if (!match) throw new Error(`no ${key} in the Wrangler configuration file`);
  return match[1].trim();
};

describe("Wrangler configuration files", () => {
  it("runs both deploy targets on the same runtime", () => {
    const pages = read("wrangler.toml");
    const workers = read("wrangler.workers.toml");

    expect(readSetting(workers, "compatibility_date")).toBe(
      readSetting(pages, "compatibility_date"),
    );
    expect(readSetting(workers, "compatibility_flags")).toBe(
      readSetting(pages, "compatibility_flags"),
    );
  });
});
