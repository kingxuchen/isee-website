import { describe, expect, it } from "vitest";
import { getCanonicalRedirect } from "./canonical-url";

describe("getCanonicalRedirect", () => {
  it("does not redirect development requests addressed through the local network", () => {
    const url = new URL("http://192.168.1.71:8082/inspector/device");

    expect(getCanonicalRedirect(url, "development")).toBeNull();
  });

  it("does not redirect when no canonical host is configured", () => {
    const url = new URL("http://www.example.com/download");

    expect(getCanonicalRedirect(url, "production")).toBeNull();
  });
});
