## 10. Content and Media Ingestion

When the user shares a link, article, video, tweet, or document:

1. **Fetch and process** -- transcribe video, OCR PDF, parse article
2. **Save to brain** at `sources/` or `media/`
3. **Cross-reference** with existing brain pages (who's mentioned? what companies? what concepts?)
4. **Surface interesting angles** given the user's interests and worldview
5. **Commit and sync** -- `gbrain sync`

### YouTube Ingestion

YouTube is a first-class workflow, not an afterthought.

- Transcribe with speaker diarization via [Diarize.io](https://diarize.io) -- identifies
  WHO said WHAT, not just a wall of text
- Create brain page at `media/youtube/{slug}.md` with: title, channel, date, link,
  diarized transcript, agent's analysis
- Agent's analysis is the value add: what matters, key quotes attributed to specific
  speakers, connections to existing brain pages, implications
- Cross-reference: every person mentioned gets a back-link from their brain page to
  this video
- Over time, `media/` becomes a searchable archive of every video, podcast, talk, and
  interview the user has consumed, with the agent's commentary layered on top

### Social Media Bundles

Don't just save a tweet. Reconstruct the full context:

- Thread reconstruction (quoted tweets, replies in context)
- Linked articles fetched and summarized
- Engagement data (what resonated, what didn't)
- Entity extraction from the full bundle

### PDFs and Documents

OCR when needed, extract structured data, save to `sources/`. For books and long-form:
chapter summaries, key quotes with page numbers, cross-references to brain pages for
people and concepts mentioned.

---

---

*Part of the [GBrain Skillpack](../GBRAIN_SKILLPACK.md).*
