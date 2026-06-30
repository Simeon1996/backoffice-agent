import type { Document } from "./types";

const MIN = 60_000;

// One morning of inbound mail. Each document carries its extracted fields (with
// confidence) and the structured `content` its paper template renders, plus the
// ground-truth `facts` the rulebook reads.
export const DOCUMENTS: Document[] = [
  // ── INVOICE · the headline (PO mismatch + over limit → needs review) ──────
  {
    id: "INV-4471",
    type: "invoice",
    title: "Acme Industrial — Invoice #4471",
    sender: "acme",
    receivedAt: 18 * MIN,
    amount: 12400,
    fields: [
      { id: "vendor", value: "Acme Industrial Co.", confidence: 0.98 },
      { id: "invoice_no", value: "INV-4471", confidence: 0.99 },
      { id: "invoice_date", value: "2026-06-24", confidence: 0.96 },
      { id: "po_number", value: "PO-3389", confidence: 0.71 },
      { id: "subtotal", value: 11200, confidence: 0.97 },
      { id: "tax", value: 1200, confidence: 0.93 },
      { id: "total", value: 12400, confidence: 0.98 },
      { id: "due_date", value: "2026-07-24", confidence: 0.9 },
    ],
    content: {
      vendorAddress: "1100 Foundry Rd, Camden, NJ",
      billTo: "Northwind Inc. · Accounts Payable",
      lineItems: [
        { desc: "CNC spindle assembly", qty: 2, unit: 4200, amount: 8400 },
        { desc: "Calibration service", qty: 1, unit: 2800, amount: 2800 },
      ],
      terms: "Net 30. Remit to Acme Industrial Co.",
    },
    facts: { poMatch: false, lineItemsReconcile: true, vendorApproved: true },
  },

  // ── INVOICE · clean, small → auto-filed ──────────────────────────────────
  {
    id: "INV-4460",
    type: "invoice",
    title: "Lumen Logistics — Invoice #4460",
    sender: "lumen",
    receivedAt: 9 * MIN,
    amount: 880,
    fields: [
      { id: "vendor", value: "Lumen Logistics LLC", confidence: 0.99 },
      { id: "invoice_no", value: "INV-4460", confidence: 0.99 },
      { id: "invoice_date", value: "2026-06-23", confidence: 0.97 },
      { id: "po_number", value: "PO-3375", confidence: 0.95 },
      { id: "subtotal", value: 800, confidence: 0.98 },
      { id: "tax", value: 80, confidence: 0.97 },
      { id: "total", value: 880, confidence: 0.99 },
      { id: "due_date", value: "2026-07-23", confidence: 0.95 },
    ],
    content: {
      vendorAddress: "55 Wharf St, Oakland, CA",
      billTo: "Northwind Inc. · Accounts Payable",
      lineItems: [{ desc: "Freight — pallet x4", qty: 4, unit: 200, amount: 800 }],
      terms: "Net 30.",
    },
    facts: { poMatch: true, lineItemsReconcile: true, vendorApproved: true },
  },

  // ── PURCHASE ORDER · large but valid → escalate (senior sign-off) ─────────
  {
    id: "PO-7782",
    type: "purchase_order",
    title: "Engineering — PO #7782",
    sender: "marco",
    receivedAt: 31 * MIN,
    amount: 48000,
    fields: [
      { id: "vendor", value: "Acme Industrial Co.", confidence: 0.98 },
      { id: "po_number", value: "PO-7782", confidence: 0.99 },
      { id: "department", value: "Engineering", confidence: 0.97 },
      { id: "requested_by", value: "Marco Reyes", confidence: 0.96 },
      { id: "total", value: 48000, confidence: 0.98 },
      { id: "need_by", value: "2026-08-01", confidence: 0.92 },
    ],
    content: {
      shipTo: "Northwind Fabrication Lab, Building C",
      lineItems: [{ desc: "5-axis mill (capital)", qty: 1, unit: 48000, amount: 48000 }],
      terms: "Capital purchase. Budget line ENG-CAPEX.",
    },
    facts: { withinBudget: true, approverAuthority: true },
  },

  // ── PURCHASE ORDER · over budget → needs review ──────────────────────────
  {
    id: "PO-7790",
    type: "purchase_order",
    title: "Operations — PO #7790",
    sender: "dana",
    receivedAt: 44 * MIN,
    amount: 9200,
    fields: [
      { id: "vendor", value: "Lumen Logistics LLC", confidence: 0.97 },
      { id: "po_number", value: "PO-7790", confidence: 0.99 },
      { id: "department", value: "Operations", confidence: 0.95 },
      { id: "requested_by", value: "Dana Whitfield", confidence: 0.96 },
      { id: "total", value: 9200, confidence: 0.94 },
      { id: "need_by", value: "2026-07-10", confidence: 0.9 },
    ],
    content: {
      shipTo: "Northwind Distribution, Dock 2",
      lineItems: [{ desc: "Seasonal warehouse labor", qty: 1, unit: 9200, amount: 9200 }],
      terms: "Budget line OPS-Q3.",
    },
    facts: { withinBudget: false, approverAuthority: true },
  },

  // ── CONTRACT/NDA · missing signature → needs review ──────────────────────
  {
    id: "NDA-228",
    type: "contract",
    title: "Brightline LLP — Mutual NDA",
    sender: "brightline",
    receivedAt: 26 * MIN,
    fields: [
      { id: "counterparty", value: "Brightline LLP", confidence: 0.97 },
      { id: "agreement_type", value: "Mutual NDA", confidence: 0.95 },
      { id: "effective_date", value: "2026-06-20", confidence: 0.93 },
      { id: "term", value: "2 years", confidence: 0.9 },
      { id: "governing_law", value: "Delaware", confidence: 0.94 },
      { id: "signatory", value: "— unsigned —", confidence: 0.62 },
    ],
    content: {
      recitals: "Mutual non-disclosure between Northwind Inc. and Brightline LLP.",
      clauses: ["Confidentiality", "Term & termination", "Governing law"],
      signatureLine: null,
    },
    facts: { signaturePresent: false, clausesPresent: true, expired: false },
  },

  // ── CONTRACT · complete → auto-filed ─────────────────────────────────────
  {
    id: "SVC-204",
    type: "contract",
    title: "Lumen Logistics — Service Agreement",
    sender: "lumen",
    receivedAt: 52 * MIN,
    fields: [
      { id: "counterparty", value: "Lumen Logistics LLC", confidence: 0.98 },
      { id: "agreement_type", value: "Service agreement", confidence: 0.96 },
      { id: "effective_date", value: "2026-06-15", confidence: 0.95 },
      { id: "term", value: "12 months", confidence: 0.94 },
      { id: "governing_law", value: "California", confidence: 0.95 },
      { id: "signatory", value: "D. Whitfield", confidence: 0.96 },
    ],
    content: {
      recitals: "Freight services agreement between Northwind Inc. and Lumen Logistics LLC.",
      clauses: ["Confidentiality", "Liability", "Term & termination", "Governing law"],
      signatureLine: "Signed — D. Whitfield, 2026-06-16",
    },
    facts: { signaturePresent: true, clausesPresent: true, expired: false },
  },

  // ── CLAIM · over coverage → rejected ─────────────────────────────────────
  {
    id: "CLM-5567",
    type: "claim",
    title: "Claim #5567 — water damage",
    sender: "claimant-ortiz",
    receivedAt: 37 * MIN,
    amount: 60000,
    fields: [
      { id: "claimant", value: "L. Ortiz", confidence: 0.95 },
      { id: "policy_no", value: "NW-POL-22841", confidence: 0.97 },
      { id: "claim_no", value: "CLM-5567", confidence: 0.99 },
      { id: "loss_date", value: "2026-06-12", confidence: 0.9 },
      { id: "claim_amount", value: 60000, confidence: 0.93 },
      { id: "coverage_limit", value: 50000, confidence: 0.98 },
    ],
    content: {
      incident: "Burst pipe, ground floor.",
      adjuster: "Pending assignment",
      lossDescription: "Water damage to flooring and inventory.",
    },
    facts: { policyActive: true, withinCoverage: false, requiredComplete: true },
  },

  // ── CLAIM · within coverage → auto-filed ─────────────────────────────────
  {
    id: "CLM-5540",
    type: "claim",
    title: "Claim #5540 — windshield",
    sender: "claimant-ortiz",
    receivedAt: 14 * MIN,
    amount: 3200,
    fields: [
      { id: "claimant", value: "L. Ortiz", confidence: 0.96 },
      { id: "policy_no", value: "NW-POL-22841", confidence: 0.98 },
      { id: "claim_no", value: "CLM-5540", confidence: 0.99 },
      { id: "loss_date", value: "2026-06-09", confidence: 0.94 },
      { id: "claim_amount", value: 3200, confidence: 0.95 },
      { id: "coverage_limit", value: 50000, confidence: 0.98 },
    ],
    content: {
      incident: "Cracked windshield.",
      adjuster: "Auto-adjudicated",
      lossDescription: "Glass replacement, comprehensive coverage.",
    },
    facts: { policyActive: true, withinCoverage: true, requiredComplete: true },
  },

  // ── HR · expense over per-diem → needs review ────────────────────────────
  {
    id: "EXP-991",
    type: "hr_form",
    title: "Expense report — M. Reyes",
    sender: "marco",
    receivedAt: 41 * MIN,
    amount: 2300,
    fields: [
      { id: "employee", value: "Marco Reyes", confidence: 0.98 },
      { id: "form_type", value: "Expense report", confidence: 0.97 },
      { id: "department", value: "Engineering", confidence: 0.96 },
      { id: "effective_date", value: "2026-06-22", confidence: 0.92 },
      { id: "manager", value: "Dana Whitfield", confidence: 0.95 },
      { id: "amount", value: 2300, confidence: 0.9 },
    ],
    content: {
      details: ["Conference travel — airfare $1,100", "Hotel 3 nights — $900", "Meals — $300"],
      notes: "Trade show, Q2.",
    },
    facts: { requiredComplete: true, managerAssigned: true, withinPerDiem: false },
  },

  // ── HR · onboarding, complete → auto-filed ───────────────────────────────
  {
    id: "HR-336",
    type: "hr_form",
    title: "Onboarding — P. Anand",
    sender: "priya",
    receivedAt: 6 * MIN,
    fields: [
      { id: "employee", value: "Priya Anand", confidence: 0.98 },
      { id: "form_type", value: "Onboarding", confidence: 0.98 },
      { id: "department", value: "People Ops", confidence: 0.97 },
      { id: "effective_date", value: "2026-07-01", confidence: 0.96 },
      { id: "manager", value: "Dana Whitfield", confidence: 0.95 },
      { id: "amount", value: 0, confidence: 0.99 },
    ],
    content: {
      details: ["Role: People Ops Lead", "Equipment: laptop, badge", "Benefits enrollment: complete"],
      notes: "Start date confirmed.",
    },
    facts: { requiredComplete: true, managerAssigned: true, withinPerDiem: true },
  },
];

const D_MAP = new Map(DOCUMENTS.map((d) => [d.id, d]));
export const documentById = (id: string): Document | undefined => D_MAP.get(id);
