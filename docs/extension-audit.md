# Extension audit

This audit compares the old shared extension list with the active repositories
in the `KSU-Electric-Vehicle-Team` organization. It was last checked on
September 9, 2026.

## Repository evidence

### ROB-Teensy

The active firmware repository uses C++, PlatformIO, the Teensy 4.1 Arduino
framework, Doxygen, VS Code build tasks, and a serial-monitor task.

- `platformio.ini` defines the `teensy41` PlatformIO environment.
- `.vscode/tasks.json` runs PlatformIO builds and its serial monitor.
- `Doxyfile` and `generate_docs.py` provide the documentation workflow.
- `.vscode/extensions.json` recommends PlatformIO and GitHub Pull Requests.

### github-practice

The beginner practice repository uses Markdown, GitHub pull requests, and one
small Bash checker. Its existing recommendations are GitHub Pull Requests and
markdownlint.

### .github

The organization repository contains Markdown guides and contribution
templates. It does not add another language or build system.

### Archived repositories

The archived repositories contain older PlatformIO and ROS 2 work. Archived
code does not control the default setup for new members. If ROS development
becomes active again, it should get its own reviewed ROS pack instead of adding
Docker and ROS tools to every installation.

## Included extensions

Lite contains only the shared requirements:

- `DavidAnson.vscode-markdownlint`
- `GitHub.vscode-pull-request-github`
- `ms-python.python`
- `platformio.platformio-ide`

Full retains useful firmware and maintainer tools from the old list and adds
the broader Python workflow used by the team:

- `alexnesnes.teleplot`
- `batisteo.vscode-django`
- `cschlosser.doxdocgen`
- `eamodio.gitlens`
- `etmoffat.pip-packages`
- `jeff-hykin.better-shellscript-syntax`
- `marus25.cortex-debug`
- `ms-python.isort`
- `ms-toolsai.jupyter`
- `njpwerner.autodocstring`
- `samubarb.vscode-doxyfile`
- `wholroyd.jinja`
- `zixuanwang.linkerscript`

Windows Full also contains `ms-vscode.PowerShell` and
`ms-vscode-remote.remote-wsl`. WSL is not included on macOS or Linux.

## Removed duplicates and overlap

- `platformio.platformio-ide` declares `ms-vscode.cpptools` as a dependency.
  The packs do not list C/C++ twice.
- `marus25.cortex-debug` declares all four `mcu-debug.*` helpers as
  dependencies. The packs include Cortex-Debug once.
- `ms-python.python` bundles Pylance, debugpy, and Python Environments. The
  packs do not list those extensions separately.
- `ms-toolsai.jupyter` already bundles its keymap, renderers, cell tags, and
  slideshow extensions. The Full packs include Jupyter once.
- `ranch-hand-robotics.rde-pack` already bundles the RDE ROS 2, URDF, and
  creator extensions. None are included because the ROS repository is
  archived.
- `ms-vscode.cpptools-extension-pack` and
  `ms-vscode-remote.vscode-remote-extensionpack` are convenience packs around
  extensions that were also listed individually.
- The multiple C/C++ runners were removed. PlatformIO owns the current build,
  upload, monitor, and debugging workflow.
- The old Docker extension and the newer container extensions overlapped. No
  active repository has a Dockerfile or dev container, so neither belongs in
  the default packs.
- The third-party Python extension pack was removed because it overlaps the
  selected Python, Django, Jinja, and documentation tools.
- Both Live Server extensions were removed. No active repository is a static
  website project.
- CMake, Makefile, LLDB, spreadsheet viewers, PDF viewers, remote-host tools,
  icon themes, CodeSnap, and novelty extensions were removed because the
  current repositories do not require them.

## Maintenance rule

Add an extension when an active repository or documented team workflow needs
it. Project-specific tools should normally live in that repository's
`.vscode/extensions.json`. The shared packs should stay small enough that a new
member understands why each extension appeared.
