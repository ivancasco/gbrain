## 17. Upgrades and Auto-Update Notifications

GBrain ships updates frequently. There are two ways an upgrade happens:

**User says "upgrade gbrain":** Run `gbrain check-update --json` to see what's new,
then run the Full Upgrade Flow below (Steps 1-6). Do NOT just run `gbrain upgrade`
and stop. The post-upgrade steps (re-read skills, run migrations, schema sync) are
where the value is. Without them, the agent has new code but old behavior.

**Cron finds an update:** The auto-update cron checks for new versions and messages
the user. The user decides whether to upgrade. If yes, run the same Full Upgrade
Flow (Steps 1-6).

The upgrade is always manual. Never install without the user's explicit permission.

### The Check (cron-initiated)

Run `gbrain check-update --json`. If `update_available` is false, stay completely
silent — do nothing. If true, message the user on their preferred channel.

### The Message

Sell the upgrade. The user should feel "hell yeah, I want that." Lead with what
they can DO now that they couldn't before, not what files changed. Frame as
capabilities and benefits, not implementation details. Make them excited that
GBrain keeps getting better. 2-3 punchy bullets, no raw markdown, no file names.

> **GBrain v0.5.0 is available** (you're on v0.4.0)
>
> What's new:
> - Your brain never falls behind. Live sync keeps the vector DB current
>   automatically, so edits show up in search within minutes, not "whenever
>   someone remembers to run sync"
> - New verification runbook catches silent failures: the pooler bug that
>   skips pages, missing embeddings, stale search results
> - New installs set up live sync automatically. No more manual setup step
>
> Want me to upgrade? I'll update everything and refresh my playbook.
>
> (Reply **yes** to upgrade, **not now** to skip, **weekly** to check
> less often, or **stop** to turn off update checks)

### Handling Responses

| User says | Action |
|-----------|--------|
| yes / y / sure / ok / do it / upgrade / go ahead | Run the **full upgrade flow** (see below) |
| not now / later / skip / snooze | Acknowledge, check again next cycle |
| weekly | Store preference in agent memory, switch cron to weekly |
| daily | Store preference, switch cron back to daily |
| stop / unsubscribe / no more | Store preference, disable the cron. Tell user: "Update checks disabled. Say 'resume gbrain updates' or run `gbrain check-update` anytime." |

Acceptable "yes": any clearly affirmative response. When in doubt, ask again.
**Never auto-upgrade.** Always wait for explicit confirmation.

### The Full Upgrade Flow (after user says yes)

**Step 1: Update the binary/package.**
Run `gbrain upgrade`. This updates the CLI and all shipped files (skills, docs, migrations).

**Step 2: Re-read all updated skills.**
Find the gbrain package directory (`bun pm ls 2>/dev/null | grep gbrain` or check
`node_modules/gbrain/`). Re-read every skill file in `skills/*/SKILL.md` to pick up
new patterns and workflows. Updated skills = better agent behavior. The user gets
this for free.

**Step 3: Re-read the production reference docs.**
Read `docs/GBRAIN_SKILLPACK.md` and `docs/GBRAIN_RECOMMENDED_SCHEMA.md` fresh from
the gbrain package directory. These contain the latest patterns, cron schedules,
and integration guides. This is how the agent learns about new capabilities like
live sync (Section 18).

**Step 4: Check for version-specific migration directives.**
Look for `skills/migrations/v[version].md` files between the old and new version.
If they exist, read and execute them **in order**. These are the post-upgrade
actions that make the new version actually work for existing users (e.g., v0.5.0
migration sets up live sync and runs the verification runbook). Do NOT skip this
step. Without migrations, the agent has new code but the user's environment hasn't
changed.

**Step 5: Schema sync — suggest new recommendations without undoing user choices.**
Read `~/.gbrain/update-state.json` to see what the user previously adopted, declined,
and customized. For each NEW recommendation in the updated schema:
- If the user never saw it before, suggest it
- If the user previously declined it, do NOT re-suggest
- Never modify or remove the user's custom directories

Update `~/.gbrain/update-state.json` with new choices and bump `schema_version_applied`.

**Step 6: Report what changed.**
Tell the user what was upgraded and what actions were taken.

### Frequency Preferences

Default: daily. Store in agent memory as `gbrain_update_frequency: daily|weekly|off`.
Also persist in `~/.gbrain/update-state.json` so it survives agent context resets.

### Quiet Hours

Standard quiet hours gate (Section 9). Update notifications are never urgent.
Hold for morning briefing.

### Cron Registration

Name: `gbrain-update-check`
Default schedule: `0 9 * * *` (daily 9 AM)
Weekly schedule: `0 9 * * 1` (Monday 9 AM)
Prompt: "Run `gbrain check-update --json`. If update_available is true, summarize
the changelog and message me asking if I'd like to upgrade. If false, stay silent."

### Standalone Skillpack Users (no gbrain CLI)

If you loaded this SKILLPACK directly (copied the file or read from GitHub) without
installing gbrain, you can still stay current. Both this file and
GBRAIN_RECOMMENDED_SCHEMA.md have version markers in their first lines:

```
<!-- skillpack-version: 0.5.0 -->
<!-- source: https://raw.githubusercontent.com/garrytan/gbrain/master/docs/GBRAIN_SKILLPACK.md -->
```

**Self-update check:** Periodically fetch the first 3 lines of the source URL and
compare the version marker against your local copy:

```bash
curl -s https://raw.githubusercontent.com/garrytan/gbrain/master/docs/GBRAIN_SKILLPACK.md | head -1
# Returns: <!-- skillpack-version: X.Y.Z -->
```

If the remote version is newer (minor or major bump, same rule as the CLI), fetch
the full file and replace your local copy. Do the same for GBRAIN_RECOMMENDED_SCHEMA.md.

**Cron for standalone users:**
Name: `gbrain-skillpack-update`
Schedule: `0 9 * * 1` (weekly Monday 9 AM)
Prompt: "Fetch the first line of https://raw.githubusercontent.com/garrytan/gbrain/master/docs/GBRAIN_SKILLPACK.md
and compare the skillpack-version against my local copy. If newer, fetch the full
file, re-read it, and tell the user what changed. Do the same for GBRAIN_RECOMMENDED_SCHEMA.md.
If both are current, stay silent."

This way standalone users get new patterns, workflows, and schema recommendations
without installing the gbrain CLI. The agent fetches, diffs, and updates its own playbook.

---

---

*Part of the [GBrain Skillpack](../GBRAIN_SKILLPACK.md).*
