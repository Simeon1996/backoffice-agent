import type { Document, DocTypeId, RoutingKind } from "../data/types";
import type { Rulebook } from "../data/rulebook";
import type { RuleResult } from "./validate";
import { fmtMoney } from "../time";

export interface RoutingDecision {
  kind: RoutingKind;
  queue: string;
  rationale: string;
  stamp: string;
}

// Fails that mean "send it back" rather than "have a human look".
const REJECT_RULES = new Set(["clm_coverage", "con_expiry"]);
// Clean documents at or above this move to senior sign-off.
const ESCALATE_AMOUNT = 25000;

const REVIEW_QUEUE: Record<DocTypeId, string> = {
  invoice: "AP Manager",
  purchase_order: "Procurement Lead",
  contract: "Legal",
  claim: "Claims Adjuster",
  hr_form: "People Ops",
};

const STAMP: Record<RoutingKind, string> = {
  auto_approve: "AUTO-FILED",
  needs_review: "NEEDS REVIEW",
  escalate: "ROUTED",
  reject: "REJECTED",
};

/** Decide where a validated document goes. Pure; deterministic. */
export function routeDoc(
  doc: Document,
  results: RuleResult[],
  _rulebook: Rulebook,
): RoutingDecision {
  const fails = results.filter((r) => r.status === "fail");
  const warns = results.filter((r) => r.status === "warn");

  if (fails.some((f) => REJECT_RULES.has(f.ruleId))) {
    const reason = fails.find((f) => REJECT_RULES.has(f.ruleId))!;
    return {
      kind: "reject",
      queue: "Returned to sender",
      rationale: reason.message,
      stamp: STAMP.reject,
    };
  }

  if (fails.length > 0) {
    return {
      kind: "needs_review",
      queue: REVIEW_QUEUE[doc.type],
      rationale: `${fails.length} check${fails.length === 1 ? "" : "s"} failed: ${fails.map((f) => f.name).join(", ")}.`,
      stamp: STAMP.needs_review,
    };
  }

  if (doc.amount != null && doc.amount >= ESCALATE_AMOUNT) {
    return {
      kind: "escalate",
      queue: "Finance Director",
      rationale: `Clean, but ${fmtMoney(doc.amount)} is above the ${fmtMoney(ESCALATE_AMOUNT)} senior sign-off bar.`,
      stamp: STAMP.escalate,
    };
  }

  return {
    kind: "auto_approve",
    queue: "Filed automatically",
    rationale: warns.length
      ? `All checks cleared (${warns.length} advisory note${warns.length === 1 ? "" : "s"}).`
      : "All checks cleared.",
    stamp: STAMP.auto_approve,
  };
}
