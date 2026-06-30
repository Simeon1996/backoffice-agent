# Manila — Back Office Document Agent (Live Demo)

Manila is the agent that works the mailroom of a fictional company, **Northwind**.
Every document that lands on the desk — **invoices, purchase orders, contracts,
insurance claims, HR forms, expense reports** — gets read and handled the same
way a back-office clerk would, only in seconds:

**classify → extract → validate → route for approval**

…and Manila lands the decision as an inked **rubber stamp**.

> **Everything here is fabricated.** No OCR, no LLM, no uploads, no integrations,
> no database, no network. The documents, the extracted fields, the confidence
> scores, the rules, and the stamps are all invented but internally consistent.
> It runs fully offline and produces the same result every time. A hard browser
> refresh resets the demo.

## Run it

```bash
npm install
npm run dev
```

Open <http://localhost:3000>. No environment variables, no setup.

## The 3-minute tour

1. **Intake** — the day's inbound mail, each document already classified and
   routed. Open the flagged **Acme Industrial — Invoice #4471**.
2. **Workspace** — press **Read document** and watch Manila work: it classifies
   the page, draws **extraction boxes over the real paper** as each field is
   pulled (note the PO number comes back at low confidence), runs the rulebook —
   the **3-way PO match fails** and the total is over the hands-off limit — and
   thuds a **NEEDS REVIEW** stamp onto the document.
3. **Approvals** — the invoice is waiting with its exceptions spelled out.
   Approve it and an **APPROVED** stamp lands.
4. **Rulebook** — turn off *3-way PO match* and *Within auto-approve limit*, then
   re-check #4471: the outcome flips from **NEEDS REVIEW** to **AUTO-FILED**,
   shown as two stamps side by side. Reset to deployed to put it back.
5. **Doc Types** shows what Manila extracts per type and how confidently it tells
   them apart; **Throughput** shows the straight-through-processing rate, value
   processed, and why documents needed a human.

**⌘K / Ctrl-K** opens the command palette to jump to any document or surface.

## How it works

The idea that makes the demo tick: **validation and routing are pure functions of
`(document, rulebook)`**. That's why the Rulebook can re-judge any recorded
document live and show exactly what would change.

- **Mock corpus** — typed data in `lib/data/`: the document types and their field
  schemas, the rulebook, and ~10 documents. Each document carries both the
  structured content its paper template renders and the extracted fields (with
  confidence). Intake, approvals, and throughput are all *derived* from these.
- **Engine** — `lib/engine/` is pure and unit-tested: `classify`,
  `validate` (`validateDoc(doc, rulebook)`), `route`
  (`routeDoc(doc, results, rulebook)` → decision + stamp), `read` (the
  step-by-step reveal), and `metrics`.
- **Paper + overlay** — documents render as real HTML/CSS "paper"; every
  extractable value is tagged `data-field`, and the Workspace overlay measures
  each element's real rect to draw the extraction box. No hardcoded coordinates.
- **State** — a Zustand store holds the read playback, the *working* rulebook you
  tune in the Rulebook, and your approval decisions. The deployed rulebook
  (`DEFAULT_RULEBOOK`) is the system of record behind every live surface.
- **UI** — Next.js App Router + React + Tailwind v4, `motion` for the read and
  the stamp, `cmdk` for the palette.

```bash
npm test        # the pure engine, data integrity, and the store
npm run build   # production build (fully static + one dynamic route)
```

## Design notes

A "document desk" identity, deliberately unlike a typical SaaS dashboard:
**dark ink** chrome wrapping a **warm paper** workspace, an editorial serif
(self-hosted Fraunces) for display paired with a monospace for figures, and the
signature **inked rubber stamp** that thuds down on each decision. Colour carries
meaning — stamp-red is reserved for `NEEDS REVIEW` / `REJECTED`, green for
`APPROVED` / `AUTO-FILED`. Motion respects `prefers-reduced-motion`.
