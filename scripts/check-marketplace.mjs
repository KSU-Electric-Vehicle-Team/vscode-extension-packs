import { readFile, readdir } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../", import.meta.url));
const packagesDirectory = join(root, "packages");
const extensionIds = new Set();

for (const packageName of await readdir(packagesDirectory)) {
  const manifest = JSON.parse(
    await readFile(join(packagesDirectory, packageName, "package.json"), "utf8"),
  );
  for (const extensionId of manifest.extensionPack) {
    extensionIds.add(extensionId);
  }
}

const missing = [];
for (const extensionId of [...extensionIds].sort()) {
  const response = await fetch(
    "https://marketplace.visualstudio.com/_apis/public/gallery/extensionquery",
    {
      method: "POST",
      headers: {
        Accept: "application/json;api-version=7.1-preview.1",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        filters: [
          {
            criteria: [{ filterType: 7, value: extensionId }],
          },
        ],
        flags: 914,
      }),
    },
  );

  if (!response.ok) {
    throw new Error(`Marketplace returned ${response.status} for ${extensionId}`);
  }

  const result = await response.json();
  const match = result.results?.[0]?.extensions?.[0];
  if (!match) {
    missing.push(extensionId);
  } else {
    console.log(`${extensionId}: ${match.versions[0].version}`);
  }
}

if (missing.length > 0) {
  console.error(`Missing from the VS Code Marketplace: ${missing.join(", ")}`);
  process.exitCode = 1;
}
