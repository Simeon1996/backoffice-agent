import type { Document, DocTypeId, RoutingKind } from "../data/types";
import type { Rulebook } from "../data/rulebook";
import { validateDoc } from "./validate";
import { routeDoc } from "./route";

export interface Throughput {
  total: number;
  byType: { type: DocTypeId; count: number }[];
  byOutcome: { kind: RoutingKind; count: number }[];
  stpRate: number; // share auto-filed
  exceptions: number; // review + escalate + reject
  dollarsProcessed: number;
  topExceptions: { reason: string; count: number }[];
  minutesSaved: number;
}

const MINUTES_PER_DOC = 9; // estimated manual handling time saved per document

/** Aggregate throughput across all documents under a rulebook. Pure. */
export function throughput(docs: Document[], rulebook: Rulebook): Throughput {
  const byTypeMap = new Map<DocTypeId, number>();
  const byOutcomeMap = new Map<RoutingKind, number>();
  const exceptionReasons = new Map<string, number>();
  let autoFiled = 0;
  let dollars = 0;

  for (const doc of docs) {
    const results = validateDoc(doc, rulebook);
    const decision = routeDoc(doc, results, rulebook);

    byTypeMap.set(doc.type, (byTypeMap.get(doc.type) ?? 0) + 1);
    byOutcomeMap.set(decision.kind, (byOutcomeMap.get(decision.kind) ?? 0) + 1);
    if (decision.kind === "auto_approve") autoFiled++;
    dollars += doc.amount ?? 0;

    for (const r of results)
      if (r.status === "fail") exceptionReasons.set(r.name, (exceptionReasons.get(r.name) ?? 0) + 1);
  }

  const total = docs.length;
  const exceptions = total - autoFiled;

  return {
    total,
    byType: [...byTypeMap.entries()].map(([type, count]) => ({ type, count })),
    byOutcome: [...byOutcomeMap.entries()].map(([kind, count]) => ({ kind, count })),
    stpRate: total ? autoFiled / total : 0,
    exceptions,
    dollarsProcessed: dollars,
    topExceptions: [...exceptionReasons.entries()]
      .map(([reason, count]) => ({ reason, count }))
      .sort((a, b) => b.count - a.count),
    minutesSaved: total * MINUTES_PER_DOC,
  };
}
