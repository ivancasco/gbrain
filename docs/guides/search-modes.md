## 12. The Three Search Modes

GBrain provides three distinct search modes. Use the right one for the job.

| Mode | Command | Needs Embeddings | Speed | Best For |
|------|---------|-----------------|-------|----------|
| **Keyword** | `gbrain search "name"` | No | Fastest | Known names, exact matches, day-one queries |
| **Hybrid** | `gbrain query "what do we know"` | Yes | Fast | Semantic questions, fuzzy matching, conceptual search |
| **Direct** | `gbrain get <slug>` | No | Instant | Loading a specific page when you know the slug |

### Progression

- **Day one:** Use keyword search (`gbrain search`). It works without embeddings and
  catches exact name matches.
- **After first embed:** Use hybrid search (`gbrain query`) for semantic questions.
  "Who do I know at fintech companies?" works here.
- **When you know the slug:** Use direct get (`gbrain get pedro-franceschi`). Instant,
  no search overhead.

### Token Budget Awareness

Search returns chunks, not full pages. Read the search excerpts first. Only use
`gbrain get <slug>` for the full page when the chunk confirms relevance.

- "Tell me about Pedro" -> `gbrain get pedro-franceschi` (you want the full page)
- "Did anyone mention the Series A?" -> search results are enough (scan chunks)
- "What's the latest on Brex?" -> search first, then get the company page if needed

### Precedence for Conflicting Information

1. User's direct statements (always wins)
2. Compiled truth sections (synthesized from evidence)
3. Timeline entries (raw signal, reverse chronological)
4. External sources (web search, APIs)

---

---

*Part of the [GBrain Skillpack](../GBRAIN_SKILLPACK.md).*
