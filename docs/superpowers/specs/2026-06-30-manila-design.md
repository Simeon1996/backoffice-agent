# Manila — Back Office Document Agent (Design)

> **Status:** approved 2026-06-30 · **Type:** no-backend Next.js presentation demo

## 1. Concept

**Manila** is the agent in the mailroom of a fictional company (**Northwind** — the
same universe as Helix and Warden). It processes every document that lands on the
desk — **invoices, purchase orders, contracts/NDAs, insurance claims, HR forms,
expense reports** — running the four back-office verbs on each:

**classify → extract → validate → route for approval**

…and lands a decision as an inked **rubber stamp**. Everything is fabricated,
deterministic, in-memory, and offline: no OCR, no LLM, no uploads, no network, no
database. A hard refresh resets the demo.

### The technical ideas that make it unique

1. **Extraction overlay on real paper.** Documents render as real HTML/CSS
   "paper." Each extractable value is tagged `data-field="<id>"`. As the agent
   "reads," the overlay measures each tagged element's real bounding rect (via
   `getBoundingClientRect` relative to the page) and draws an animated box, while
   the field populates a side panel with a confidence score. No brittle
   hardcoded coordinates — highlights track the actual rendered text.
2. **Validation & routing are pure functions of `(document, rulebook)`.**
   `validateDoc(doc, rulebook)` and `routeDoc(doc, validation, rulebook)` are
   pure, so toggling a rule in the Rulebook re-validates and **re-stamps** the
   document live. (The counterfactual move from Warden, applied to documents.)

## 2. Visual identity — "the document desk"

Deliberately unlike Warden's cool light SaaS. A **two-tone** identity:

- **Dark ink** app chrome (sidebar + top rail): near-black warm ink `#1c1a17`.
- **Warm paper** workspace: `#f4efe4`, faint desk texture, ruled/ledger lines.
- Documents render as letterpress-ish paper with subtle shadow and a hairline
  rule system.
- Decisions are **rubber stamps**: they thud down rotated a few degrees with an
  ink-bleed. `APPROVED` in go-green `#2f7d52`, `NEEDS REVIEW` / `REJECTED` in
  stamp-red `#b23a2e`, `ROUTED` / `AUTO-FILED` in ink. **Stamp-red is reserved
  only for stamps** — colour carries meaning, not decoration.
- **Type:** an editorial **serif** for display (self-hosted via `next/font/local`
  with a system-serif fallback so it never depends on the network), **Geist
  Sans** for UI, **Geist Mono** for figures, IDs, and field coordinates (a ledger
  feel).
- **Signatures:** the rubber stamp, and the extraction box drawing over real
  paper. Motion is purposeful and respects `prefers-reduced-motion`.

## 3. Surfaces

Five primary nav destinations + the Workspace detail; `⌘K` command palette.

### 3.1 Intake (home, `/`)
The registry / inbox of inbound documents: sender, received time, **classified
type** with confidence, current status (queued / processing / auto-filed /
needs-review / approved / rejected), and a small paper thumbnail. The mailroom
front door — click any document to open the Workspace. A "process next" affordance
and per-type filters.

### 3.2 Document Workspace (hero, `/doc/[id]`)
The split view:
- **Left — the paper document**, rendered from structured data by a per-type
  template. During the "read," animated **extraction boxes** draw over the real
  field positions; the final routing decision lands as a **stamp** on the page.
- **Right — the agent's work**: a classify line (type + confidence), the
  **extracted fields** list (label · value · confidence, low-confidence flagged),
  the **validation checklist** (each rule pass/warn/fail with a plain message),
  and the **routing decision** with rationale + the stamp.
- A **Read / step** control replays the process: classify → fields reveal one by
  one (boxes draw) → validation fires → routing → stamp. A scrubbable progress.

### 3.3 Approvals (`/approvals`)
The human queue for documents whose routing needs a person (exceptions,
over-threshold amounts). Each item: document context, why it routed here, the
validation exceptions, and **Approve / Reject** → applies the corresponding stamp
and advances the document. Empty state when clear.

### 3.4 Rulebook (`/rules`)
Business rules grouped by doc type, each toggleable (and a couple with a numeric
threshold):
- **Invoice:** 3-way PO match, line items reconcile to total, vendor on
  allow-list, amount ≤ auto-approve threshold.
- **Purchase order:** within budget, approver authority.
- **Contract/NDA:** required clauses present, signature present, not expired.
- **Claim:** policy active, amount within coverage, required fields complete.
- **HR form / expense:** required fields, manager assigned, within per-diem.

Pick a document → **re-check under the working rulebook** → a before/after of the
validation flags and the routing/stamp. Reset to the deployed rulebook.

### 3.5 Doc Types (`/types`)
The classifier surface: each document type with its **field schema** (what Manila
extracts), the classification **confidence** and near-miss alternatives, and a
"classify this sample" that shows the type scores. Communicates the *classify*
verb.

### 3.6 Throughput (`/throughput`)
Ledger-style analytics: **straight-through-processing rate**, documents by type,
exception reasons (ranked), **$ processed**, and estimated handling time saved.
Sober, tabular, on-brand.

## 4. Architecture

Matches the family.

- **Stack:** Next.js 16 (App Router), React 19, Tailwind v4 tokens, Zustand,
  `motion`, `lucide-react`, `cmdk`, Geist + a self-hosted serif. Vitest.

- **`lib/data/`**
  - `types.ts` — shared types.
  - `docTypes.ts` — the document types, their field schemas, and rule
    definitions per type.
  - `people.ts` — senders + approvers.
  - `documents.ts` — the corpus: each document carries its **structured content**
    (for its template to render) and its **extracted fields** (id → value,
    confidence). Intake/approvals/metrics are *derived* from these.

- **`lib/engine/`** — pure, testable:
  - `classify.ts` — `classify(doc) → { type, confidence, alternatives }`.
  - `validate.ts` — `validateDoc(doc, rulebook) → RuleResult[]`
    (`pass | warn | fail` + message), pure.
  - `route.ts` — `routeDoc(doc, results, rulebook) → RoutingDecision`
    (`auto_approve | needs_review | escalate | reject` + queue + rationale +
    stamp), pure.
  - `read.ts` — orders the Workspace "read" into steps (classify, each field,
    validate, route) for playback.
  - `metrics.ts` — fleet/throughput aggregates from all documents.

- **`components/`**
  - `shell/` — AppShell, Sidebar, TopRail, Wordmark.
  - `ui/` — Paper, Stamp, FieldRow, ConfidenceBar, RuleResult, StatusTag, Card,
    DocTypeIcon.
  - `docs/templates/` — one template per doc type (Invoice, PurchaseOrder,
    Contract, Claim, HRForm), values tagged `data-field`.
  - `intake/`, `workspace/`, `approvals/`, `rules/`, `types/`, `throughput/`.

- **`lib/store.ts`** (Zustand) — `selectedDocId`, read-playback (`reading`,
  `revealedSteps`), working `rulebook`, human `decisions` (stamps), `paletteOpen`.

- **Determinism:** seeded; identical every run; in-memory; refresh resets; no env,
  no network.

## 5. Signature demo arc (≈3 min)

1. **Intake** → open the flagged **invoice #4471**.
2. **Workspace** → it classifies (INVOICE · 98%); extraction boxes draw over the
   paper and fields fill with confidence; validation fires a **3-way PO match
   failure** + amount over the auto-approve threshold → routing
   "Needs review → AP Manager" → **NEEDS REVIEW** stamp thuds on.
3. **Approvals** → the invoice waits with its exception → Approve → **APPROVED**.
4. **Rulebook** → toggle off "3-way PO match" → re-check #4471 → it now
   auto-approves; toggle back on → review returns.
5. **Doc Types** → classifier + field schemas; **Throughput** → STP rate,
   $ processed.

## 6. Testing

- Unit-test the pure engine: `classify`, `validateDoc` (each rule + toggles),
  `routeDoc` (each decision branch incl. counterfactual: same doc, two rulebooks
  → different stamp), `metrics`.
- `data/__tests__/corpus.test.ts`: every document references a real type; every
  extracted field id exists in its type's schema; documents render-template
  coverage; rule ids unique.
- Store reducer tests: read-playback advance, rulebook toggle, decisions.

## 7. Out of scope (YAGNI)

Real OCR/LLM, file upload, real integrations, auth, persistence, multi-user,
editable schemas. Manila is a presentation artifact, not a product.
