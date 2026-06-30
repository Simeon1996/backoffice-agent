// ----------------------------------------------------------------------------
// Manila domain types. The corpus in this folder is the single source of truth;
// intake, approvals, and metrics are all derived from DOCUMENTS.
// ----------------------------------------------------------------------------

export type DocTypeId = "invoice" | "purchase_order" | "contract" | "claim" | "hr_form";

export type RuleStatus = "pass" | "warn" | "fail";

export type RoutingKind = "auto_approve" | "needs_review" | "escalate" | "reject";

export type DocStatus = "queued" | "auto_filed" | "needs_review" | "approved" | "rejected";

export type FieldKind = "text" | "money" | "date" | "id" | "enum";

export interface FieldSchema {
  id: string;
  label: string;
  kind: FieldKind;
}

export interface RuleDef {
  id: string;
  docType: DocTypeId;
  name: string;
  explain: string;
  /** Status applied when the rule does NOT pass. */
  severity: "fail" | "warn";
  defaultEnabled: boolean;
  /** For amount-style rules: pass when amount <= threshold (dollars). */
  threshold?: number;
}

export interface DocTypeDef {
  id: DocTypeId;
  label: string;
  blurb: string;
  fields: FieldSchema[];
}

export interface ExtractedField {
  id: string; // must exist in the doc type's field schema
  value: string | number;
  confidence: number; // 0..1
}

/** Ground-truth facts the rules read — kept separate from the displayed fields. */
export interface DocFacts {
  poMatch?: boolean;
  lineItemsReconcile?: boolean;
  vendorApproved?: boolean;
  withinBudget?: boolean;
  approverAuthority?: boolean;
  signaturePresent?: boolean;
  clausesPresent?: boolean;
  expired?: boolean;
  policyActive?: boolean;
  withinCoverage?: boolean;
  requiredComplete?: boolean;
  managerAssigned?: boolean;
  withinPerDiem?: boolean;
}

export interface Document {
  id: string; // e.g. "INV-4471"
  type: DocTypeId;
  title: string;
  sender: string; // Person id
  receivedAt: number; // virtual ms since DAY_START (09:00)
  amount?: number; // headline money, if any
  fields: ExtractedField[];
  content: Record<string, unknown>; // structured content for the template
  facts: DocFacts;
}

export interface Person {
  id: string;
  name: string;
  org: string;
  role: string;
}
