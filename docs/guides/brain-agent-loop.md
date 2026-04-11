## 2. The Brain-Agent Loop

The core read-write cycle that makes the brain compound over time:

```
Signal arrives (message, meeting, email, tweet, link)
  |
  v
Detect entities (people, companies, concepts, original thinking)
  |
  v
READ: Check brain first (gbrain search, gbrain get)
  |
  v
Respond with context (brain makes every answer better)
  |
  v
WRITE: Update brain pages (new info compiled into existing pages)
  |
  v
Sync: gbrain indexes changes (available for next query)
  |
  v
(next signal arrives — agent is now smarter than last time)
```

Every signal that flows through your agent should touch the brain in both directions.
Read before responding. Write after learning something new. The next time that person,
company, or concept comes up, the agent already has context.

The brain almost always has something. External APIs fill gaps — they don't start
from scratch.

An agent without this loop answers from stale context every time. An agent with it gets
smarter with every conversation, every meeting, every email. Six months in, the
compounding is visible: the agent knows more about your world than you can hold in
working memory, because it never forgets and it never stops indexing.

The loop has two invariants:

1. **Every READ improves the response.** If you answered a question about a person
   without checking their brain page first, you gave a worse answer than you could have.
2. **Every WRITE improves future reads.** If a meeting transcript mentioned new
   information about a company and you didn't update the company page, you created a
   gap that will bite you later.


---

*Part of the [GBrain Skillpack](../GBRAIN_SKILLPACK.md).*
