# The Northstar Sprint

Support ticket deflection MVP for **Northstar Retail Co.** — built over a 5-day sprint.

## Team

| Person | Primary Area | Backup Area |
|---|---|---|
| Brian Nyakundi | Flow map, storefront page, widget embed | Testing |
| Maina Kennedy | Logic embedding, E2E testing | Flow map |
| Netsanet Admasu | Widget shell (UI) | Dataset |
| Zaweria Wairimu | Button-menu component, Order Status logic | Frontend |
| Collins Lagat | Returns + Stock Availability + Order dataset | Dataset |

## Project Overview

This project deflects support tickets for at least two of the following categories:

- Order status
- Returns / refunds
- Stock availability

**Approach:** Chatbot with guided/button menus (no free-text NLU), backed by static mock data. Built as a web app (HTML/CSS/JS) widget, embedded on a mock storefront page. See [Team Charter](./docs/Team_Charter_Northstar_Sprint.docx) for the full comparison.

## Deliverables

1. **Working prototype** — demoable, covers 2+ ticket types
2. **Go-live note** (1 page) — what works, what's broken, what Northstar needs to run it independently
3. **Commit / edit audit trail** — this repo's history, proving real collaboration

## Repo Structure

```
.
├── README.md
├── index.html          # storefront page, hosts the widget
├── docs/
│   ├── Team_Charter_Northstar_Sprint.docx
│   └── demo-test-data.md
├── data/                # mock orders, returns, stock JSON
└── widgetUI/            # chatbot widget (HTML, CSS, JS)
```

## Getting Started

**Locally:**
```bash
git clone <repo-url>
cd <repo-name>
python3 -m http.server 8080
# open http://localhost:8080
```
Opening `index.html` directly (`file://`) breaks the widget — browsers block local `fetch()` requests under that protocol.

**Deployed:** hosted on [Vercel](https://vercel.com) as a static site, no build step or config needed. Widget data loads the same way as local — just make sure `data/` and `widgetUI/` stay alongside `index.html` in the deploy.

**Live demo:** _add Vercel URL here once deployed_

## Contribution Guidelines

This repo follows the rules set out in the [Team Charter](./docs/Team_Charter_Northstar_Sprint.docx):

- **Commit format:** `<type>: <what changed> - <why it matters>`
  Example: `feat: add order-status lookup endpoint - unblocks dashboard integration`
  ❌ Not acceptable: `wip`, `updates`, `fix stuff`
- **No task exceeds 4 hours of work.** If a task is bigger, it gets split further before being picked up.
- **Board status is updated the same day work happens** — not batched at week's end.
- **2+ days of zero visible activity** triggers the escalation path in the Charter.

## Task Board

Tracked on [GitHub Projects](../../projects) — every task is an issue with an owner, priority (High/Medium/Low), and a one-sentence Definition of Done. PRs link back to their issue, so merging moves the card automatically.

## Sprint Timeline

| Day | Milestone |
|---|---|
| Day 1 (AM) | Individual solo baseline diagnostic (30 min, no collaboration) |
| Day 1 (PM) | Team Charter signed + board populated (10+ tasks) |
| Day 2–3 | Core build |
| Day 4 | Mid-sprint checkpoint — audit snapshot, contribution review |
| Day 5 | Final delivery — prototype, go-live note, audit log, Peer Reliability Index |

## License

Internal project — for course/evaluation purposes only.
