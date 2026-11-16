# claude-cli-usage

An [OpenChamber](https://github.com/openchamber/openchamber) extension that
adds a **Claude** usage provider backed by a CLI instead of a local OAuth
credential.

The built-in `claude` quota provider reads `~/.claude/.credentials.json` and
calls `api.anthropic.com/api/oauth/usage`. That does not work when the Claude
Code binary on your PATH is a relay stub whose OAuth token lives on a remote
host. This provider instead runs a Claude Code CLI with `-p "/usage"` — a
local command (`local_command=true`) that costs no quota and works over a
stdio relay — and parses the report.

## What it does

- Registers a quota provider `ext-claude-cli-usage`, shown as a **Claude CLI**
  card on the Usage page, in the header and in Work Status.
- Draws two aligned rows inside Work Status through
  `contributes.statusSection.entry`. A shared five-column CSS Grid shows
  window (`5h` / `7d`), local reset time (`MM-DD HH:mm`), countdown, progress
  bar, and percentage. Text columns have fixed widths; the bar fills the
  remaining space. Per-model rows are omitted.
- Uses the official SDK's `connectHost` and `applyHostReady` for communication,
  theme, fonts, and sizing. Refresh sits in the section header (no extra row):
  `↻` shows when data is under a minute old, `↻ 6m` after that, and the glyph
  cycles while the CLI is reading. There is no independent rail panel.
- On each read the host spawns `service/main.js` and posts `usage.read`; the
  service runs `<cli> -p "/usage" --output-format json` and maps the report
  onto the built-in window names so the card looks like a built-in's:
  - `Current session` → `5h` window
  - `Current week (all models)` → `7d` window
  - `Current week (<Model>)` → per-model `7d` window
  - `Extra usage` → `extra_usage` window (`$used / $limit`)
- `resetAt` accepts both whole-hour and minute formats, such as `11am` and
  `11:59am`, with the optional `(America/Los_Angeles)` zone; the year is
  inferred. Incomplete timestamps stay unknown instead of becoming midnight.
- Invalid calendar dates, malformed zones, ambiguous or nonexistent DST
  times, and implausible year rollovers stay unknown. An expired reset shows
  `—` until refreshed; it does not claim the data has just reset.
- Host `usage.read` has a 20 s deadline but a CLI behind a relay can take
  ~30 s, so reads answer from the last good result
  (`~/.config/claude-cli-usage/last-usage.json`, fresh for 60 s) and the CLI
  refresh runs in the background. Only a cold start ever waits — up to 17 s —
  and reports "still answering" rather than missing the deadline.

## Choosing the CLI

Resolution order:

1. `CLAUDE_USAGE_CLI` env var. Service environments inherit only PATH, HOME,
   temp and locale from the host, so this mainly helps manual testing.
2. `~/.config/claude-cli-usage/cli-path` — one line, the absolute path.
   HOME is inherited, so this is the reliable in-app override:

   ```bash
   mkdir -p ~/.config/claude-cli-usage
   echo "/absolute/path/to/your-claude-cli" > ~/.config/claude-cli-usage/cli-path
   ```

3. `claude` on PATH.

The service spawns with stdin closed, which relay stubs typically require
(they wait for stdin EOF before answering). If your CLI has a different name,
add it to `permissions.exec` in `package.json` so the approval text stays
honest — the list is grant UI, not a sandbox.

## Install

Settings → Extensions → install from this repository's URL, or:

```bash
# the persisted form the installer writes, applied by hand
# ~/.config/openchamber/extensions.json
"paths": ["<host copies dir>/claude-cli-usage"],
"sources": { "<path>": "git" },
"gitOrigins": { "<path>": { "url": "https://github.com/c-w-xiaohei/openchamber-claude-cli-usage" } },
"capabilityGrants": { "claude-cli-usage": ["service"] },
"capabilityScopes": { "claude-cli-usage": { "service": { "exec": [...], "sockets": [], "quota": { "providers": [] } } } }
```

If the card does not appear within ~a minute, restart OpenChamber.

## Manual test

```bash
OPENCHAMBER_SERVICE_PORT=17789 OPENCHAMBER_SERVICE_TOKEN=t \
  CLAUDE_USAGE_CLI=/path/to/cli node service/main.js &
xh -I -b POST :17789/quota "Authorization:Bearer t" \
  'v:'=1 requestId=x method=usage.read 'input:={"credentials":{}}'
```
