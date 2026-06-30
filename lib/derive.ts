import type { Document, DocStatus } from "./data/types";
import type { Rulebook } from "./data/rulebook";
import { validateDoc, type RuleResult } from "./engine/validate";
import { routeDoc, type RoutingDecision } from "./engine/route";
import type { Decision } from "./store";

export type Decisions = Record<string, Decision>;

/** Validate + route a document in one call. */
export function routingFor(doc: Document, rulebook: Rulebook): {
  results: RuleResult[];
  decision: RoutingDecision;
} {
  const results = validateDoc(doc, rulebook);
  return { results, decision: routeDoc(doc, results, rulebook) };
}

/** The document's status, honoring any human decision. */
export function effectiveStatus(
  doc: Document,
  rulebook: Rulebook,
  decisions: Decisions,
): DocStatus {
  const d = decisions[doc.id];
  if (d === "approved") return "approved";
  if (d === "rejected") return "rejected";
  const kind = routingFor(doc, rulebook).decision.kind;
  if (kind === "auto_approve") return "auto_filed";
  if (kind === "reject") return "rejected";
  return "needs_review"; // needs_review or escalate → awaiting a human
}

/** Documents whose routing needs a human and that haven't been decided yet. */
export function pendingApprovals(
  docs: Document[],
  rulebook: Rulebook,
  decisions: Decisions,
): Document[] {
  return docs.filter((doc) => {
    if (decisions[doc.id]) return false;
    const kind = routingFor(doc, rulebook).decision.kind;
    return kind === "needs_review" || kind === "escalate";
  });
}
