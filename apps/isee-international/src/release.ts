import { createServerFn } from "@tanstack/react-start";
import type { ReleaseChannels } from "./latest-release";

const STATIC_RELEASE: ReleaseChannels = {
  stable: {
    version: "0.8.0",
    linuxAppImageAsset: "Paseo-0.8.0-x86_64.AppImage",
    windowsX64Asset: "Paseo-Setup-0.8.0-x64.exe",
    windowsArm64Asset: "Paseo-Setup-0.8.0-arm64.exe",
  },
  beta: null,
};

export const getLatestRelease = createServerFn({ method: "GET" }).handler(async () => STATIC_RELEASE);
