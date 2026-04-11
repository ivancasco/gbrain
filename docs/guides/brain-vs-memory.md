## 13. How GBrain Complements Agent Memory

A production agent has three layers of memory. All three should be consulted. They
serve different purposes.

| Layer | What It Stores | Examples | How to Access |
|-------|---------------|----------|---------------|
| **GBrain** | World knowledge -- facts about people, companies, deals, meetings, concepts, ideas | Pedro's company page, meeting transcripts, original theses, deal terms | `gbrain search`, `gbrain query`, `gbrain get` |
| **Agent memory** | Operational state -- preferences, architecture decisions, tool config, session continuity | "User prefers concise formatting", "Deploy to staging before prod" | OpenClaw: `memory_search`. Hermes: `memory(action="read")` + `session_search()` |
| **Session context** | Current conversation window -- what was just said, what the user just asked | The last 20 messages, current task, immediate context | Already in context |

### When to Use Each

- **"Who is Pedro?"** -> GBrain (world knowledge about a person)
- **"How do I format messages for this user?"** -> Agent memory (operational preference)
- **"What did I just ask you to do?"** -> Session context (immediate)
- **"What happened in Tuesday's meeting?"** -> GBrain (meeting transcript + entity pages)
- **"Which API key goes where?"** -> Agent memory (tool configuration)

GBrain is for facts about the world. Agent memory is for how the agent operates.
Session context is for right now. Don't store operational preferences in GBrain. Don't
store people dossiers in agent memory.

---

---

*Part of the [GBrain Skillpack](../GBRAIN_SKILLPACK.md).*
