## 5. Enrichment Pipeline -- 7-Step Protocol

When to enrich: entity mentioned in conversation, meeting attendees, email threads,
social interactions, new contacts, whenever the brain page is thin or missing.

### Tier System

Scale API spend to importance. Don't blow 20 API calls on a passing mention.

| Tier | Who | Effort | API Calls |
|------|-----|--------|-----------|
| **Tier 1** | Key people and companies: inner circle, business partners, portfolio companies | Full pipeline, ALL data sources | 10-15 |
| **Tier 2** | Notable: people you interact with occasionally | Web search + social + brain cross-reference | 3-5 |
| **Tier 3** | Minor mentions: everyone else worth tracking | Brain cross-reference + social lookup if handle known | 1-2 |

### The 7 Steps

**Step 1: Identify entities.** From the incoming signal (meeting, email, tweet), extract
people names, company names, and what they're associated with.

**Step 2: Check brain state.** Does a page exist? If yes, read it -- you're on the
UPDATE path. If no, you're on the CREATE path. Check `gbrain search` first.

**Step 3: Extract signal from source.** Don't just pull facts -- pull texture:

- What opinion did they express? -> What They Believe
- What are they building or shipping? -> What They're Building
- Did they express emotion? -> What Makes Them Tick
- Who did they engage with? -> Network / Relationship
- Is this a recurring topic? -> Hobby Horses
- What did they commit to? -> Open Threads
- What was their energy? -> Trajectory

**Step 4: Data source lookups.** For CREATE or thin pages, run structured lookups.
The order matters -- stop when you have enough signal for the entity's tier.

Priority order:

1. **Brain cross-reference** (free, highest-value -- always first): `gbrain search "name"` to find mentions across meetings, other people pages, company pages.
2. **Web search** via [Brave](https://brave.com/search/api/) or [Exa](https://exa.ai): background, press, talks, funding.
3. **X/Twitter deep lookup** (enterprise API or scraping): beliefs, building, hobby horses, network, trajectory.
4. **People enrichment:** [Crustdata](https://crustdata.com) (LinkedIn data), [Happenstance](https://happenstance.com) (web research, career arcs).
5. **Company/funding data:** [Captain](https://captaindata.co) API (Pitchbook-grade funding, valuation, team data).
6. **Meeting history:** [Circleback](https://circleback.ai) (transcript search, attendee lookup).
7. **Contact data** (Google Contacts, CRM sync).

**X/Twitter lookup is underrated.** When you have someone's handle, their tweets are
the single best source for: what they believe (opinions expressed unprompted), what
they're building (shipping announcements), hobby horses (recurring topics), who they
engage with (reply patterns, amplification), and trajectory (posting frequency, tone
shifts). This goes into the brain page's "What They Believe" and "Hobby Horses" sections.

**Step 5: Save raw data.** Every API response gets saved to a `.raw/` sidecar alongside
the brain page. JSON with `sources.{provider}.fetched_at` and `.data`. Overwrite on
re-enrichment, don't append.

**Step 6: Write to brain.** CREATE path: use the page template from your brain's
schema, fill compiled truth from all data gathered, add first timeline entry. UPDATE
path: append timeline, update compiled truth if the new signal materially changes the
picture. Flag contradictions -- don't silently resolve them.

**Step 7: Cross-reference.** After updating a person page: update their company page,
update deal pages, add back-links. After updating a company page: update founder pages,
update deal pages. Every entity page should link to every other entity page that
references it.

### People Pages

A person page isn't a LinkedIn profile. It's a living portrait:

- **Executive Summary** -- How do you know them? Why do they matter?
- **State** -- Role, company, relationship, key context
- **What They Believe** -- Ideology, worldview, first principles
- **What They're Building** -- Current projects, features shipped
- **What Motivates Them** -- Ambition drivers, career arc
- **Assessment** -- Strengths, weaknesses, net read
- **Trajectory** -- Ascending, plateauing, pivoting, declining?
- **Relationship** -- History, temperature, open threads
- **Contact** -- Email, phone, X handle, LinkedIn
- **Timeline** -- Reverse chronological, append-only, never rewritten

Facts are table stakes. Texture is the value.

---

---

*Part of the [GBrain Skillpack](../GBRAIN_SKILLPACK.md).*
