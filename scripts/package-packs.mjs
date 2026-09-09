import { readFile, readdir, rm, mkdir } from "node:fs/promises";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { join } from "node:path";

const root = fileURLToPath(new URL("../", import.meta.url));
const packagesDirectory = join(root, "packages");
const outputDirectory = join(root, "dist");
const vsce = join(root, "node_modules", ".bin", "vsce");

await rm(outputDirectory, { recursive: true, force: true });
await mkdir(outputDirectory, { recursive: true });

const packageNames = (await readdir(packagesDirectory)).sort();
for (const packageName of packageNames) {
  const packageDirectory = join(packagesDirectory, packageName);
  const manifest = JSON.parse(
    await readFile(join(packageDirectory, "package.json"), "utf8"),
  );
  const outputPath = join(
    outputDirectory,
    `${packageName}-${manifest.version}.vsix`,
  );
  execFileSync(vsce, ["package", "--out", outputPath], {
    cwd: packageDirectory,
    stdio: "inherit",
  });
}
