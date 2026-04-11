## 7. Source Attribution -- Every Fact Needs a Citation

This is not a suggestion. It is a hard requirement. Every fact written to a brain page
needs an inline `[Source: ...]` citation with full provenance.

### Format

`[Source: {who}, {channel/context}, {date} {time} {tz}]`

### Examples by Category

**Direct statements:**
`[Source: User, direct message, 2026-04-07 12:33 PM PT]`

**Meetings:**
`[Source: Meeting notes "Team Sync" #12345, 2026-04-03 12:11 PM PT]`

**API enrichment:**
`[Source: Crustdata LinkedIn enrichment, 2026-04-07 12:35 PM PT]`

**Social media (MUST include full URL):**
`[Source: X/@pedroh96 tweet, product launch, 2026-04-07](https://x.com/pedroh96/status/...)`

**Email:**
`[Source: email from Sarah Chen re Q2 board deck, 2026-04-05 2:30 PM PT]`

**Workspace:**
`[Source: Slack #engineering, Keith re deploy schedule, 2026-04-06 11:45 AM PT]`

**Web research:**
`[Source: Happenstance research, 2026-04-07 12:35 PM PT]`

**Published media:**
`[Source: [Wall Street Journal, 2026-04-05](https://wsj.com/...)]`

**Funding data:**
`[Source: Captain API funding data, 2026-04-07 2:00 PM PT]`

### Why This Matters

Six months from now, someone reads a brain page and can trace every single fact back to
where it came from. "User said it" isn't enough. WHERE, ABOUT WHAT, WHEN.

### The Rule Most Agents Miss

Source attribution applies to compiled truth AND timeline. The compiled truth section
(above the line) isn't exempt from citations just because it's a synthesis. Every claim
needs a source. "Pedro co-founded Brex" needs `[Source: ...]` just as much as a
timeline entry does.

### Tweet URLs Are Mandatory

A tweet reference without a URL is a broken citation. Format:
`[Source: X/@handle tweet, topic, date](https://x.com/handle/status/ID)`.
This is a real production problem: hundreds of brain pages end up with broken tweet
citations when the URL is omitted.

### Source Hierarchy for Conflicting Information

1. User's direct statements (highest authority)
2. Primary sources (meetings, emails, direct conversations)
3. Enrichment APIs (Crustdata, Happenstance, Captain)
4. Web search results
5. Social media posts

When sources conflict, note the contradiction in compiled truth with both citations.
Don't silently pick one.

---

---

*Part of the [GBrain Skillpack](../GBRAIN_SKILLPACK.md).*
