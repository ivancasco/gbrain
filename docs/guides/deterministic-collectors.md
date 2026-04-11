## 16. Deterministic Collectors -- Code for Data, LLMs for Judgment

When your agent keeps failing at a mechanical task despite repeated prompt fixes, stop
fighting the LLM. Move the mechanical work to code.

### The Pattern That Broke

We built an email triage system. The agent swept Gmail, classified emails by urgency,
and posted a digest to the user. One rule: every email item must include a clickable
`[Open in Gmail]` link so the user can act on it with one tap.

We put the rule in the skill file. We put it in MEMORY.md. We put it in the cron
prompt. We wrote "NO EXCEPTIONS" in all caps. We wrote "ZERO TOLERANCE" after the
fourth failure. The agent still dropped links -- on carry-forward reminders, on FYI
items, on "still awaiting" sections. The user asked five times. Each time we added
stronger language to the prompt.

The failure mode is probabilistic. The LLM understands the rule. It follows it for the
first 10 items. Then it gets sloppy on item 11, especially on items that are
re-surfaced from state rather than freshly pulled from the API. No amount of prompt
engineering fixes a 90%-reliable formatting task, because 90% reliability over 20 items
per sweep means you fail visibly about twice per day. That's enough to destroy trust.

### The Fix: Separate Deterministic from Analytical

```
┌─────────────────────────────┐     ┌──────────────────────────────┐
│  Deterministic Collector    │────▶│       LLM Agent              │
│  (Node.js / Python script)  │     │                              │
│                             │     │  • Read the pre-formatted    │
│  • Pull data from API       │     │    digest                    │
│  • Store structured JSON    │     │  • Classify items            │
│  • Generate links/URLs      │     │  • Add commentary            │
│  • Detect patterns (regex)  │     │  • Run brain enrichment      │
│  • Track state (seen/new)   │     │  • Draft replies             │
│  • Output markdown digest   │     │  • Surface to user           │
│                             │     │                              │
│  CODE — deterministic,      │     │  AI — judgment, context,     │
│  never forgets              │     │  creativity                  │
└─────────────────────────────┘     └──────────────────────────────┘
```

The collector handles everything mechanical:

- Pulling emails from Gmail (via credential gateway)
- Generating `[Open in Gmail](URL)` from message IDs -- **by code, not by LLM**
- Detecting signature requests (DocuSign/Dropbox Sign regex patterns)
- Tracking which messages are new vs. already seen (state file)
- Storing structured JSON with full metadata
- Generating a pre-formatted markdown digest with every link already embedded

The LLM reads the pre-formatted digest and does what LLMs are good at:

- Classifying urgency (requires understanding relationships, deadlines, context)
- Writing commentary ("this is the $110M acquisition thread, 7 days dropped")
- Running brain enrichment on notable entities (`gbrain search` + page updates)
- Drafting replies
- Deciding what to surface vs. filter

**The links are in the source data. The LLM can't forget them because it doesn't
generate them.**

### Implementation

The email collector follows the same architecture as the X/Twitter collector (a
deterministic data pipeline for social media monitoring):

```
scripts/email-collector/
├── email-collector.mjs     # No LLM calls, no external deps
├── data/
│   ├── state.json          # Last pull timestamp, known IDs, pending signatures
│   ├── messages/           # Structured JSON per day
│   │   └── 2026-04-09.json
│   └── digests/            # Pre-formatted markdown
│       └── 2026-04-09.md
```

Every stored message includes:

```json
{
  "id": "19d74109a811b9e7",
  "account": "work",
  "authuser": "user@example.com",
  "from": "Alex Smith",
  "subject": "Re: Next Steps",
  "snippet": "Hey, wanted to follow up on...",
  "timestamp": "2026-04-09T08:56:09Z",
  "is_unread": true,
  "is_noise": false,
  "is_signature": false,
  "gmail_link": "https://mail.google.com/mail/u/?authuser=user@example.com#inbox/19d74109a811b9e7",
  "gmail_markdown": "[Open in Gmail](https://mail.google.com/mail/u/?authuser=user@example.com#inbox/19d74109a811b9e7)"
}
```

The `gmail_link` and `gmail_markdown` fields are computed from `id` + `authuser` at
collection time. Three lines of code. Never wrong.

### Cron Integration

The email monitoring cron runs the collector first, then invokes the LLM:

```
1. node email-collector.mjs collect     → deterministic API pull, store JSON
2. node email-collector.mjs digest      → generate markdown with links baked in
3. node email-collector.mjs signatures  → list pending e-signature items
4. LLM reads digest + signatures        → classifies, enriches, posts to user
```

The collector runs in under 10 seconds. The LLM analysis takes 30-60 seconds. Total:
under 90 seconds for a full inbox sweep with brain enrichment.

### Where Else This Pattern Applies

The deterministic-collector pattern works for any recurring data pull where the LLM
was previously responsible for both fetching AND formatting:

| Signal Source | Collector Generates | LLM Adds |
|--------------|-------------------|----------|
| **Email** | Gmail links, sender metadata, signature detection | Urgency classification, enrichment, reply drafts |
| **X/Twitter** | Tweet links, engagement metrics, deletion detection | Sentiment analysis, narrative detection, content ideas |
| **Calendar** | Event links, attendee lists, conflict detection | Prep briefings, meeting context from brain |
| **Slack** | Channel links, thread links, mention detection | Priority classification, action item extraction |
| **GitHub** | PR/issue links, diff stats, CI status | Code review context, priority assessment |

The principle: if a piece of output MUST be present and MUST be formatted correctly
every time, generate it in code. If a piece of output requires judgment, context, or
creativity, generate it with the LLM. Don't ask the LLM to do both in the same pass.

### The Lesson

When an LLM keeps failing at a mechanical task despite repeated prompt fixes:

1. **Stop adding more prompt language.** You've already written "NO EXCEPTIONS" and
   "ZERO TOLERANCE." The LLM read it. The failure is probabilistic, not comprehension.
2. **Identify what's mechanical vs. analytical.** URL generation is mechanical.
   Classification is analytical. State tracking is mechanical. Commentary is analytical.
3. **Move the mechanical work to a script.** Node.js, Python, bash -- anything
   deterministic. No LLM calls, no external dependencies if possible.
4. **Feed the LLM pre-formatted data.** The script's output becomes the LLM's input.
   Links are already there. Metadata is already structured. The LLM just adds judgment.
5. **Wire it into your cron.** Script runs first (fast, cheap, reliable), then LLM
   reads the output (slower, expensive, creative).

This is not about the LLM being bad. It's about using the right tool for the right
job. Code is 100% reliable at string concatenation. LLMs are 90% reliable at string
concatenation but 10x better at understanding what an email means. Use both.

---

---

*Part of the [GBrain Skillpack](../GBRAIN_SKILLPACK.md).*
