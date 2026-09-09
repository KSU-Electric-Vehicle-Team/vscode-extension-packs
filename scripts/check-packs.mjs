import { readFile } from "node:fs/promises";
import { join } from "node:path";

const platforms = ["windows", "macos", "linux"];
const tiers = ["lite", "full"];
const packagesDirectory = new URL("../packages/", import.meta.url);

const bannedExtensions = new Map([
  ["ms-vscode.cpptools", "PlatformIO already installs it"],
  ["mcu-debug.debug-tracker-vscode", "Cortex-Debug already installs it"],
  ["mcu-debug.memory-view", "Cortex-Debug already installs it"],
  ["mcu-debug.peripheral-viewer", "Cortex-Debug already installs it"],
  ["mcu-debug.rtos-views", "Cortex-Debug already installs it"],
  ["ms-vscode-remote.vscode-remote-extensionpack", "use selected remote extensions"],
  ["ms-vscode.cpptools-extension-pack", "use selected C++ extensions"],
  ["donjayamanne.python-extension-pack", "use selected Python extensions"],
  ["ms-azuretools.vscode-docker", "the old Docker extension was replaced"],
]);

const manifests = new Map();
const errors = [];

for (const platform of platforms) {
  for (const tier of tiers) {
    const packageName = `ksu-evt-${tier}-${platform}`;
    const packageDirectory = new URL(`${packageName}/`, packagesDirectory);
    const manifestPath = new URL("package.json", packageDirectory);
    const readmePath = new URL("README.md", packageDirectory);

    let manifest;
    try {
      manifest = JSON.parse(await readFile(manifestPath, "utf8"));
      await readFile(readmePath, "utf8");
    } catch (error) {
      errors.push(`${packageName}: ${error.message}`);
      continue;
    }

    manifests.set(packageName, manifest);

    if (manifest.name !== packageName) {
      errors.push(`${packageName}: manifest name is ${manifest.name}`);
    }

    if (!Array.isArray(manifest.extensionPack) || manifest.extensionPack.length === 0) {
      errors.push(`${packageName}: extensionPack must be a non-empty array`);
      continue;
    }

    const normalized = manifest.extensionPack.map((id) => id.toLowerCase());
    const unique = new Set(normalized);
    if (unique.size !== normalized.length) {
      errors.push(`${packageName}: extensionPack contains a duplicate`);
    }

    const sorted = [...manifest.extensionPack].sort((left, right) =>
      left.localeCompare(right, "en", { sensitivity: "base" }),
    );
    if (JSON.stringify(sorted) !== JSON.stringify(manifest.extensionPack)) {
      errors.push(`${packageName}: extensionPack must be alphabetized`);
    }

    for (const extension of normalized) {
      if (!/^[a-z0-9][a-z0-9-]*\.[a-z0-9][a-z0-9-]*$/.test(extension)) {
        errors.push(`${packageName}: invalid extension ID ${extension}`);
      }
      if (bannedExtensions.has(extension)) {
        errors.push(
          `${packageName}: ${extension} is redundant because ${bannedExtensions.get(extension)}`,
        );
      }
      if (extension === "ms-vscode-remote.remote-wsl" && platform !== "windows") {
        errors.push(`${packageName}: WSL belongs only in a Windows pack`);
      }
    }
  }
}

for (const platform of platforms) {
  const lite = manifests.get(`ksu-evt-lite-${platform}`);
  const full = manifests.get(`ksu-evt-full-${platform}`);
  if (!lite || !full) continue;

  const fullExtensions = new Set(full.extensionPack.map((id) => id.toLowerCase()));
  for (const extension of lite.extensionPack) {
    if (!fullExtensions.has(extension.toLowerCase())) {
      errors.push(`ksu-evt-full-${platform}: missing Lite extension ${extension}`);
    }
  }
}

if (errors.length > 0) {
  console.error(errors.map((error) => `- ${error}`).join("\n"));
  process.exitCode = 1;
} else {
  console.log(`Validated ${platforms.length * tiers.length} extension packs.`);
}
