# KSU EVT VS Code extension packs

These packs replace the old `extensions.txt` installer with one VS Code
installation. Choose your operating system and tier, then install the matching
VSIX file from the latest GitHub release.

## Choose a pack

| Operating system | Lite | Full |
| --- | --- | --- |
| Windows | `ksu-evt-lite-windows` | `ksu-evt-full-windows` |
| macOS | `ksu-evt-lite-macos` | `ksu-evt-full-macos` |
| Linux | `ksu-evt-lite-linux` | `ksu-evt-full-linux` |

Lite installs the extensions needed by the active public repositories:

- GitHub Pull Requests and Issues
- markdownlint
- PlatformIO IDE

Full adds firmware documentation, Git history, telemetry viewing, linker-script
editing, shell-script syntax, and Cortex debugging. The Windows Full pack also
adds PowerShell and WSL support.

macOS and Linux currently use the same extension list. They remain separate
packages so students have one obvious download and the lists can diverge later
without changing the onboarding flow.

## Install a release

1. Download the VSIX file that matches your operating system and tier.
2. Open VS Code.
3. Open the Extensions view.
4. Select the `...` menu, then **Install from VSIX...**.
5. Select the downloaded file and allow VS Code to install the included
   extensions.

You can also install a downloaded pack from a terminal:

```sh
code --install-extension ./ksu-evt-lite-windows-0.1.0.vsix
```

## Why the old list was reduced

The original list installed extension packs and their members separately. It
also included several tools that compete for the same Run, Debug, Docker,
Python, and Git commands.

The current packs rely on declared extension dependencies:

- PlatformIO installs `ms-vscode.cpptools`.
- Cortex-Debug installs its `mcu-debug.*` helpers.

Python, Jupyter, Docker, Django, Live Server, ROS, CMake, LLDB, and remote-host
tools are not defaults because no active KSU EVT repository currently requires
them. A repository can recommend a project-specific extension in its own
`.vscode/extensions.json` when that changes.

## Maintain the packs

Edit each pack's `extensionPack` array under `packages/`. Keep the entries
alphabetized and run:

```sh
npm ci
npm run check
npm run package
```

`npm run package` writes the six VSIX files to `dist/`. Pushing a version tag
such as `v0.1.0` runs the release workflow and attaches those files to a GitHub
release.
