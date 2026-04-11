## 3. Entity Detection -- Run It on Every Message

Spawn a lightweight sub-agent on EVERY inbound message. Use a cheap, fast model
(e.g. Claude Sonnet). The sub-agent captures two things with equal priority:

### Original Thinking (PRIMARY)

The user's ideas, observations, theses, frameworks, and philosophical riffs. This is the
highest-value signal in the entire system. Original thinking becomes essays, talks,
leadership philosophy, strategic insight. It compounds.

**Capture the user's EXACT phrasing.** The language IS the insight. "The
ambition-to-lifespan ratio has never been more broken" captures something that
"tension between ambition and mortality" doesn't. Don't clean it up. Don't paraphrase.

Route by authorship:

| Signal | Destination |
|--------|-------------|
| User generated the idea | `brain/originals/{slug}.md` |
| World concept they reference | `brain/concepts/{slug}.md` |
| Product or business idea | `brain/ideas/{slug}.md` |
| Personal reflection or pattern | `brain/personal/reflections/` |

**What counts:** Original observations about how the world works, novel connections
between disparate things, frameworks and mental models, pattern recognition moments,
hot takes with reasoning, metaphors that reveal new angles.

**What doesn't count:** Routine operational messages ("ok", "do it"), pure questions
without embedded observations, echoing back something the agent said.

### Entity Mentions (SECONDARY)

People, companies, media references. For each:

1. Check if brain page exists (`gbrain search "name"`)
2. If no page and entity is notable: create it, enrich it
3. If thin page: spawn background enrichment
4. If rich page: load it silently for context
5. For new facts about existing entities: append to timeline

### Rules

- Fire on EVERY message. No exceptions unless purely operational.
- Don't block the conversation. Spawn and forget.
- User's direct statements are the HIGHEST-authority signal.
- **Iron law: back-link FROM entity pages TO the source that mentions them.** An
  unlinked mention is a broken brain. Format: append to their Timeline or See Also:
  `- **YYYY-MM-DD** | Referenced in [page title](path/to/page.md) -- context`


---

*Part of the [GBrain Skillpack](../GBRAIN_SKILLPACK.md).*
