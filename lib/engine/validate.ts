import type { Document, DocFacts, RuleStatus } from "../data/types";
import type { Rulebook } from "../data/rulebook";
import { rulesForType, ruleById } from "../data/docTypes";
import { fmtMoney } from "../time";

export interface RuleResult {
  ruleId: string;
  name: string;
  status: RuleStatus;
  message: string;
}

// Each fact-based rule maps to a predicate over the document's ground-truth facts.
const FACT_RULE: Record<string, (f: DocFacts) => boolean> = {
  inv_po_match: (f) => f.poMatch === true,
  inv_reconcile: (f) => f.lineItemsReconcile === true,
  inv_vendor: (f) => f.vendorApproved === true,
  po_budget: (f) => f.withinBudget === true,
  po_authority: (f) => f.approverAuthority === true,
  con_signature: (f) => f.signaturePresent === true,
  con_clauses: (f) => f.clausesPresent === true,
  con_expiry: (f) => f.expired === false,
  clm_policy: (f) => f.policyActive === true,
  clm_coverage: (f) => f.withinCoverage === true,
  clm_required: (f) => f.requiredComplete === true,
  hr_required: (f) => f.requiredComplete === true,
  hr_manager: (f) => f.managerAssigned === true,
};

// Plain messages: { ok } when passing, { bad } when not.
const MESSAGES: Record<string, { ok: string; bad: string }> = {
  inv_po_match: { ok: "Matched an approved purchase order.", bad: "No matching purchase order found." },
  inv_reconcile: { ok: "Subtotal and tax reconcile to total.", bad: "Line items do not sum to the stated total." },
  inv_vendor: { ok: "Vendor is on the approved list.", bad: "Vendor is not on the approved supplier list." },
  po_budget: { ok: "Within the department budget.", bad: "Order exceeds the department's remaining budget." },
  po_authority: { ok: "Requester is authorized.", bad: "Requester may lack authority for this spend." },
  con_signature: { ok: "An authorized signature is present.", bad: "No signature found on the agreement." },
  con_clauses: { ok: "All required clauses are present.", bad: "One or more required clauses are missing." },
  con_expiry: { ok: "Within a valid term.", bad: "Agreement is past its effective term." },
  clm_policy: { ok: "Policy was active on the loss date.", bad: "Policy was not active on the date of loss." },
  clm_coverage: { ok: "Within the coverage limit.", bad: "Claim exceeds the policy coverage limit." },
  clm_required: { ok: "All required fields complete.", bad: "Required claim fields are incomplete." },
  hr_required: { ok: "All required fields complete.", bad: "Required fields are incomplete." },
  hr_manager: { ok: "A managing approver is named.", bad: "No managing approver is named." },
  inv_threshold: { ok: "", bad: "" },
  hr_perdiem: { ok: "", bad: "" },
};

/**
 * Validate a document against the working rulebook. Pure: same inputs → same
 * results. Disabled rules are omitted entirely.
 */
export function validateDoc(doc: Document, rulebook: Rulebook): RuleResult[] {
  const results: RuleResult[] = [];

  for (const rule of rulesForType(doc.type)) {
    const state = rulebook[rule.id];
    if (!state?.enabled) continue;

    let pass: boolean;
    let message: string;

    if (rule.threshold != null) {
      const limit = state.threshold ?? rule.threshold;
      const amount = doc.amount ?? 0;
      pass = amount <= limit;
      message = pass
        ? `${fmtMoney(amount)} within the ${fmtMoney(limit)} limit.`
        : `${fmtMoney(amount)} exceeds the ${fmtMoney(limit)} limit.`;
    } else {
      const pred = FACT_RULE[rule.id];
      pass = pred ? pred(doc.facts) : true;
      const m = MESSAGES[rule.id];
      message = pass ? m.ok : m.bad;
    }

    results.push({
      ruleId: rule.id,
      name: rule.name,
      status: pass ? "pass" : rule.severity,
      message,
    });
  }

  return results;
}

export const ruleResultName = (ruleId: string): string => ruleById(ruleId)?.name ?? ruleId;
