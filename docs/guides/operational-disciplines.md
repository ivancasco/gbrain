## 15. Five Operational Disciplines

These are the non-negotiable disciplines that separate a production agent from a demo.

### 1. Signal Detection on Every Message (MANDATORY)

Every inbound message triggers entity detection and original-thinking capture. No
exceptions. If the user thinks out loud and the brain doesn't capture it, the system
is broken. This is the #1 operational discipline.

### 2. Brain-First Lookup Before External APIs (MANDATORY)

`gbrain search` before Brave Search. `gbrain get` before Crustdata. The brain almost
always has something. External APIs fill gaps. An agent that reaches for the web before
checking its own brain is wasting money and giving worse answers.

### 3. Source Attribution on Every Brain Write (MANDATORY)

Every fact written to a brain page gets an inline `[Source: ...]` citation. No
exceptions. Compiled truth isn't exempt because it's a synthesis. Tweet URLs are
mandatory -- a tweet reference without a URL is a broken citation. The goal: six months
from now, every fact traces back to where it came from.

### 4. Iron Law Back-Linking (MANDATORY)

When a person or company with a brain page is mentioned in ANY brain file, that file
MUST be linked FROM the person or company's brain page. This is the connective tissue
of the brain. An unlinked mention is a broken brain. Every skill that writes to the
brain enforces this.

### 5. Durable Skills Over One-Off Work

If you do something twice, make it a skill + cron. The first time is discovery. The
second time is a system failure.

The development cycle:

1. **Concept** a process -- describe what needs to happen
2. **Run it manually for 3-10 items** -- see if the output is good
3. **Revise** -- iterate on quality, fix gaps, adjust the bar
4. **Codify into a skill** -- create a new skill or add to an existing one
5. **Add to cron** -- automate it so it runs without being asked

The skills should collectively cover every type of ingest event without overlap. If two
skills both try to create the same brain page, that's a coverage violation. Each entity
type and signal source should have exactly one owner skill.

---

---

*Part of the [GBrain Skillpack](../GBRAIN_SKILLPACK.md).*
