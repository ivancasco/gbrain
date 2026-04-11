## 9. Reference Cron Schedule

A production agent runs 20+ recurring jobs that interact with the brain. Here is a
generalized reference schedule:

| Frequency | Job | Brain Interaction |
|-----------|-----|-------------------|
| Every 30 min | Email monitoring | `gbrain search` sender, update people pages |
| Every 30 min | Message monitoring | `gbrain search` sender, entity detection |
| Hourly | Social media ingestion | Create/update media pages, entity extraction |
| Hourly | Workspace scanning | Update project pages, flag mentions |
| 3x/day | Meeting processing | Full ingestion pipeline (Section 8) |
| Daily AM | Morning briefing | `gbrain search` for calendar attendees, deal status, active threads |
| Daily AM | Task preparation | Pull today's tasks, cross-reference brain for context |
| Weekly | Brain maintenance | `gbrain doctor`, `gbrain embed --stale`, orphan detection |
| Weekly | Contacts sync | New contacts -> brain pages, enrichment pipeline |

### Quiet Hours Gate

Before sending any notification, check if it's quiet hours (e.g., 11 PM - 8 AM,
configure to your schedule). During quiet hours:

- Hold non-urgent notifications
- Merge held messages into the next morning briefing
- Only break quiet hours for genuinely urgent items (time-sensitive, would cause real
  damage if delayed)

### Travel-Aware Timezone Handling

The agent reads your calendar for flights, hotels, and out-of-office blocks to infer
your current location and timezone. All times shown in YOUR local timezone -- "4:42 AM
HT" in Hawaii, not "14:42 UTC" or "7:42 AM PT".

When you travel, cron jobs that would fire during your home-timezone waking hours but
hit your sleeping hours at the destination get held and folded into the next morning
briefing. No config change needed. The agent figures it out from your calendar.

This means: fly to Tokyo, land, sleep... wake up to a morning briefing that includes
everything your crons would have sent you at 2 PM Pacific (which was 3 AM Tokyo). Zero
missed signals, zero 3 AM pings.

Every cron job includes: quiet hours check, location/timezone awareness, sub-agent
spawning for heavy work.

### The Dream Cycle

The most important cron job runs while you sleep. When quiet hours start, the dream
cycle kicks off:

1. **Entity sweep.** Scan today's conversations for every person, company, concept, or
   idea you mentioned. Check each against the brain.
2. **Enrich the thin spots.** Create pages for entities that don't exist yet. Update
   pages that are thin. Write your direct assessments verbatim... the exact words you
   used, not a cleaned-up paraphrase.
3. **Fix broken citations.** Tweet links without URLs, missing source attributions,
   timeline entries without dates. The citation hygiene problems that accumulate during
   fast daytime conversations get cleaned up in the background.
4. **Consolidate memory.** Signals that matter get promoted to MEMORY.md. Patterns the
   agent noticed across multiple conversations get surfaced. Ephemeral context becomes
   durable knowledge.

The dream cycle is why the brain compounds. During the day, you're moving fast and the
agent captures signal opportunistically. At night, the agent goes back through everything
methodically. You wake up and the brain is smarter than when you went to sleep.

This is the difference between an agent that forgets and one that remembers. The dream
cycle is not optional for a production brain. Without it, signal leaks out of every
conversation. With it, nothing is lost.

#### OpenClaw

Ships with DREAMS.md as a default skill. Three phases (light, deep, REM) run
automatically during quiet hours. Entity sweeps, memory promotion, and a narrative
dream diary are built in.

#### Hermes Agent

Hermes has all the pieces but doesn't bundle a dream cycle by default. Set one up
with the cron scheduler:

```
/cron add "0 2 * * *" "Dream cycle: search today's sessions for
  entities I mentioned. For each person, company, or idea: check
  if a brain page exists (gbrain search), create or update it if
  thin. Fix any broken citations. Then consolidate: read MEMORY.md,
  promote important signals, remove stale entries."
  --name "nightly-dream-cycle"
```

The scheduled job spawns an isolated agent session that can call `session_search()`
to scan recent conversations (FTS5 over SQLite), `gbrain search` / `gbrain get` to
check the brain, and `memory(action="replace")` to consolidate. Enable Honcho
(`plugins/memory/honcho`) for automatic dialectic reasoning on top.

Key Hermes files for reference: `tools/memory_tool.py` (MEMORY.md/USER.md ops),
`tools/session_search_tool.py` (past conversation retrieval),
`cron/scheduler.py` (gateway tick loop).

---

---

*Part of the [GBrain Skillpack](../GBRAIN_SKILLPACK.md).*
