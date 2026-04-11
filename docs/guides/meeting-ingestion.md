## 8. Meeting Ingestion

Meetings are the richest signal source in the entire system. Every meeting produces
entity updates across multiple brain pages.

### Transcript Source

[Circleback](https://circleback.ai) or any meeting recording service with API access.
The key requirement: speaker diarization (who said what) and webhook support.

### Schedule

Run as a cron job. A reasonable cadence: 3x/day (10 AM, 4 PM, 9 PM) to catch new
meetings throughout the day.

### After Every Meeting

**1. Pull the full transcript.** Always pull the complete transcript, not just the AI
summary. AI-generated summaries hallucinate framing -- they editorialize what was "agreed"
or "decided" when no such agreement happened. The transcript is ground truth.

**2. Create the meeting page.** Write to `brain/meetings/YYYY-MM-DD-short-description.md`
with the agent's OWN analysis:

- **Above the bar:** Agent's summary reframed through the user's priorities. What matters
  to YOU, not a generic meeting recap. Flag surprises, contradictions, and implications.
  Name real decisions and commitments (not performative ones). Call out what was left
  unsaid or unresolved.
- **Below the bar:** Full diarized transcript (append-only evidence base). Format:
  `**Speaker** (HH:MM:SS): Words.`

**3. Propagate to entity pages (MANDATORY).** This is the step most agents skip. A
meeting is NOT fully ingested until every entity page has been updated:

- **People pages:** Update State, append Timeline with meeting-specific insights
- **Company pages:** Update State with new metrics, status, decisions, feedback
- **Deal pages:** Update State with new terms, status, deadlines

**4. Extract action items** into your task list.

**5. Commit and sync.** `gbrain sync` so the new pages are immediately searchable.

### Back-Linking

Meeting page links to attendee pages. Attendee pages link back to meeting with context.
The graph is bidirectional. Always.

---

---

*Part of the [GBrain Skillpack](../GBRAIN_SKILLPACK.md).*
