## 18. Live Sync -- Keep the Index Current (MUST ADD)

The brain repo is the source of truth. The vector DB is a derived index. If sync
doesn't run, gbrain returns stale answers. This is not theoretical: a hallucination
was corrected in a brain page but the vector DB kept serving the old text because
nobody ran `gbrain sync`. This section is **mandatory** during agent install.

### The Contract

After setup, the vector DB must stay current with the brain repo automatically. No
human should need to run `gbrain sync` manually. The agent chooses HOW based on its
environment. The only hard requirement: verify it actually works (see
`docs/GBRAIN_VERIFY.md`).

### Prerequisite: Session Mode Pooler

Sync uses `engine.transaction()` on every import. If `DATABASE_URL` points to
Supabase's **Transaction mode** pooler, sync will throw `.begin() is not a function`
and **silently skip most pages**. This is the #1 cause of "sync ran but nothing
happened."

Fix: use the **Session mode** pooler string (port 6543, Session mode) or the direct
connection (port 5432, IPv6-only). Verify by running `gbrain sync` and checking that
the page count in `gbrain stats` matches the syncable file count in the repo. If
they diverge, your connection string is wrong.

### The Primitives

Always chain sync + embed:

```bash
gbrain sync --repo /path/to/brain && gbrain embed --stale
```

- `gbrain sync --repo <path>` -- one-shot incremental sync. Detects changes via
  `git diff`, imports only what changed. For small changesets (<= 100 files),
  embeddings are generated inline during import.
- `gbrain embed --stale` -- backfill embeddings for any chunks that don't have them.
  This is a safety net: it catches chunks from large syncs (>100 files, where
  embeddings are deferred) or prior `--no-embed` runs.
- `gbrain sync --watch --repo <path>` -- foreground polling loop, every 60s
  (configurable with `--interval N`). Embeds inline for small changesets. **Exits
  after 5 consecutive failures**, so run under a process manager (systemd
  `Restart=on-failure`, pm2) or pair with a cron fallback.

### Example Approaches (pick what fits your environment)

**Cron job** (recommended for agents): run every 5-30 minutes.

```bash
gbrain sync --repo /data/brain && gbrain embed --stale
```

Works with any cron scheduler: OpenClaw, Hermes, system crontab.

**Long-lived watcher**: for near-instant sync (60s polling).

```bash
gbrain sync --watch --repo /data/brain
```

Run under a process manager that auto-restarts on exit. Pair with a cron fallback
since `--watch` exits on repeated failures.

**GitHub webhook**: triggers sync on push events. Optional, for instant sync (<5s).
Set up the webhook to call `gbrain sync --repo /data/brain && gbrain embed --stale`.
If using webhooks, verify `X-Hub-Signature-256` against a shared secret.

**Git post-receive hook**: if the brain repo is on the same machine.

### What Gets Synced

Sync only indexes "syncable" markdown files. These are excluded by design:

- Hidden paths (`.git/`, `.raw/`, etc.)
- The `ops/` directory
- Meta files: `README.md`, `index.md`, `schema.md`, `log.md`

This is intentional. The brain is the `.md` files in the directory structure, not
every file in the repo.

### Sync is Idempotent

Concurrent runs are safe. Two syncs on the same commit no-op because content hashes
match. If both a cron and `--watch` fire simultaneously, no conflict.

### Silent Skip Warning

If a file fails to import (malformed frontmatter, binary content in a `.md` file,
connection error on a single page), sync logs a warning but still advances
`sync.last_commit`. That file is silently skipped until it changes again or someone
runs `gbrain sync --full`.

The verify step in `docs/GBRAIN_VERIFY.md` catches this by comparing page count in
the DB against syncable file count in the repo. If they diverge, `--full` reconciles.

### OpenClaw

```
Name: gbrain-auto-sync
Schedule: */15 * * * *
Prompt: "Run: gbrain sync --repo /data/brain && gbrain embed --stale
  Log the result. If sync fails with .begin() is not a function,
  the DATABASE_URL is using Transaction mode pooler. Switch to
  Session mode (see GBRAIN_SKILLPACK.md Section 18)."
```

Add to `/data/.openclaw/cron/jobs.json`.

### Hermes

```
/cron add "*/15 * * * *" "Run gbrain sync --repo /data/brain &&
  gbrain embed --stale. Log the result." --name "gbrain-auto-sync"
```

### What "Done" Looks Like

1. Edit a brain file, commit, push
2. Wait for the next sync cycle (cron interval or `--watch` poll)
3. `gbrain search "<text from the edit>"` returns the updated content
4. `gbrain stats` shows page count matching syncable file count
5. Embedded chunk count is close to total chunk count

If step 3 returns old content, sync failed silently. Run the full verification
from `docs/GBRAIN_VERIFY.md`.

---

*Part of the [GBrain Skillpack](../GBRAIN_SKILLPACK.md).*
