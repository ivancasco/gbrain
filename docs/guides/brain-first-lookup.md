## 4. The Brain-First Lookup Protocol

Before calling ANY external API to research a person, company, or topic:

```
1. gbrain search "name"     -- keyword match, fast, works day one
2. gbrain query "what do we know about name"  -- hybrid search, needs embeddings
3. gbrain get <slug>         -- direct page read when you know the slug
4. External APIs as FALLBACK only
```

The brain almost always has something. Even a timeline entry from three months ago
is better context than starting from scratch with a web search.

For each entity found: load compiled truth + recent timeline entries before responding.
The compiled truth section gives you the state of play in 30 seconds. The timeline
gives you what changed recently.

**This is mandatory.** An agent that calls Brave Search before checking the brain is
wasting money and giving worse answers. The brain has context that no external API
can provide: relationship history, the user's own assessments, meeting transcripts,
cross-references to other entities.

---

---

*Part of the [GBrain Skillpack](../GBRAIN_SKILLPACK.md).*
