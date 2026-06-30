import type { DocTypeDef, DocTypeId, RuleDef } from "./types";

export const DOC_TYPES: DocTypeDef[] = [
  {
    id: "invoice",
    label: "Invoice",
    blurb: "Vendor bills payable by Accounts Payable. Matched against purchase orders and reconciled before payment.",
    fields: [
      { id: "vendor", label: "Vendor", kind: "text" },
      { id: "invoice_no", label: "Invoice #", kind: "id" },
      { id: "invoice_date", label: "Invoice date", kind: "date" },
      { id: "po_number", label: "PO #", kind: "id" },
      { id: "subtotal", label: "Subtotal", kind: "money" },
      { id: "tax", label: "Tax", kind: "money" },
      { id: "total", label: "Total due", kind: "money" },
      { id: "due_date", label: "Due date", kind: "date" },
    ],
  },
  {
    id: "purchase_order",
    label: "Purchase order",
    blurb: "Internal commitments to buy. Checked against department budget and requester authority.",
    fields: [
      { id: "vendor", label: "Supplier", kind: "text" },
      { id: "po_number", label: "PO #", kind: "id" },
      { id: "department", label: "Department", kind: "text" },
      { id: "requested_by", label: "Requested by", kind: "text" },
      { id: "total", label: "Order total", kind: "money" },
      { id: "need_by", label: "Need by", kind: "date" },
    ],
  },
  {
    id: "contract",
    label: "Contract / NDA",
    blurb: "Legal agreements. Checked for required clauses, a present signature, and a valid term.",
    fields: [
      { id: "counterparty", label: "Counterparty", kind: "text" },
      { id: "agreement_type", label: "Agreement", kind: "enum" },
      { id: "effective_date", label: "Effective", kind: "date" },
      { id: "term", label: "Term", kind: "text" },
      { id: "governing_law", label: "Governing law", kind: "text" },
      { id: "signatory", label: "Signatory", kind: "text" },
    ],
  },
  {
    id: "claim",
    label: "Insurance claim",
    blurb: "Policyholder claims. Verified against active coverage and policy limits.",
    fields: [
      { id: "claimant", label: "Claimant", kind: "text" },
      { id: "policy_no", label: "Policy #", kind: "id" },
      { id: "claim_no", label: "Claim #", kind: "id" },
      { id: "loss_date", label: "Date of loss", kind: "date" },
      { id: "claim_amount", label: "Claim amount", kind: "money" },
      { id: "coverage_limit", label: "Coverage limit", kind: "money" },
    ],
  },
  {
    id: "hr_form",
    label: "HR form",
    blurb: "People-ops paperwork — onboarding, PTO, and expense reports. Checked for completeness and approver.",
    fields: [
      { id: "employee", label: "Employee", kind: "text" },
      { id: "form_type", label: "Form", kind: "enum" },
      { id: "department", label: "Department", kind: "text" },
      { id: "effective_date", label: "Effective", kind: "date" },
      { id: "manager", label: "Manager", kind: "text" },
      { id: "amount", label: "Amount", kind: "money" },
    ],
  },
];

// Rules per doc type. `severity` is the status applied when the rule does NOT pass.
export const RULES: RuleDef[] = [
  // invoice
  { id: "inv_po_match", docType: "invoice", name: "3-way PO match", explain: "Invoice matches an approved purchase order and goods receipt.", severity: "fail", defaultEnabled: true },
  { id: "inv_reconcile", docType: "invoice", name: "Line items reconcile", explain: "Subtotal + tax equals the stated total.", severity: "fail", defaultEnabled: true },
  { id: "inv_vendor", docType: "invoice", name: "Vendor on allow-list", explain: "Vendor is an approved Northwind supplier.", severity: "warn", defaultEnabled: true },
  { id: "inv_threshold", docType: "invoice", name: "Within auto-approve limit", explain: "Total is at or below the hands-off payment limit.", severity: "fail", defaultEnabled: true, threshold: 5000 },

  // purchase order
  { id: "po_budget", docType: "purchase_order", name: "Within department budget", explain: "Order fits the requesting department's remaining budget.", severity: "fail", defaultEnabled: true },
  { id: "po_authority", docType: "purchase_order", name: "Requester has authority", explain: "Requester is authorized to commit this spend.", severity: "warn", defaultEnabled: true },

  // contract
  { id: "con_signature", docType: "contract", name: "Signature present", explain: "An authorized signatory has signed the agreement.", severity: "fail", defaultEnabled: true },
  { id: "con_clauses", docType: "contract", name: "Required clauses present", explain: "Confidentiality, liability, and termination clauses are present.", severity: "warn", defaultEnabled: true },
  { id: "con_expiry", docType: "contract", name: "Term is valid", explain: "The agreement is not past its effective term.", severity: "fail", defaultEnabled: true },

  // claim
  { id: "clm_policy", docType: "claim", name: "Policy active", explain: "The policy was in force on the date of loss.", severity: "fail", defaultEnabled: true },
  { id: "clm_coverage", docType: "claim", name: "Within coverage limit", explain: "Claim amount does not exceed the policy's coverage limit.", severity: "fail", defaultEnabled: true },
  { id: "clm_required", docType: "claim", name: "Required fields complete", explain: "Claimant, policy, loss date, and amount are all present.", severity: "warn", defaultEnabled: true },

  // hr form
  { id: "hr_required", docType: "hr_form", name: "Required fields complete", explain: "All mandatory fields on the form are filled in.", severity: "fail", defaultEnabled: true },
  { id: "hr_manager", docType: "hr_form", name: "Manager assigned", explain: "A managing approver is named on the form.", severity: "warn", defaultEnabled: true },
  { id: "hr_perdiem", docType: "hr_form", name: "Within per-diem", explain: "Expense amount is within the daily allowance.", severity: "fail", defaultEnabled: true, threshold: 1500 },
];

const TYPE_MAP = new Map(DOC_TYPES.map((t) => [t.id, t]));
export const docTypeById = (id: DocTypeId): DocTypeDef | undefined => TYPE_MAP.get(id);
export const rulesForType = (id: DocTypeId): RuleDef[] => RULES.filter((r) => r.docType === id);

const RULE_MAP = new Map(RULES.map((r) => [r.id, r]));
export const ruleById = (id: string): RuleDef | undefined => RULE_MAP.get(id);
