"use client";

import { useMemo } from "react";
import { CheckCircle2 } from "lucide-react";
import { useManila } from "@/lib/store";
import { DOCUMENTS } from "@/lib/data/documents";
import { pendingApprovals, routingFor } from "@/lib/derive";
import { PageHeader } from "@/components/shell/PageHeader";
import { Card } from "@/components/ui/Card";
import { ApprovalCard } from "./ApprovalCard";

export function ApprovalsView() {
  const rulebook = useManila((s) => s.rulebook);
  const decisions = useManila((s) => s.decisions);
  const decide = useManila((s) => s.decide);

  const { pending, decided } = useMemo(() => {
    const pending = pendingApprovals(DOCUMENTS, rulebook, decisions);
    // documents a human acted on, that were routed for review/escalation
    const decided = DOCUMENTS.filter((d) => {
      if (!decisions[d.id]) return false;
      const k = routingFor(d, rulebook).decision.kind;
      return k === "needs_review" || k === "escalate";
    });
    return { pending, decided };
  }, [rulebook, decisions]);

  return (
    <div className="mx-auto max-w-[760px] space-y-5 p-6 lg:p-8">
      <PageHeader
        title="Approvals"
        subtitle="Documents Manila routed to a human — exceptions and items above the hands-off limit. Approve or reject; the decision is stamped on the document."
      />

      {pending.length === 0 && decided.length === 0 ? (
        <Card className="flex flex-col items-center gap-3 px-6 py-14 text-center">
          <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-[var(--color-pass-soft)]">
            <CheckCircle2 size={20} className="text-[var(--color-stamp-green)]" />
          </span>
          <div>
            <p className="text-[14px] font-medium text-[var(--color-text)]">The desk is clear</p>
            <p className="mt-1 text-[13px] text-[var(--color-muted)]">Every document was handled without a human.</p>
          </div>
        </Card>
      ) : (
        <div className="space-y-6">
          {pending.length > 0 && (
            <Section title="Awaiting you" count={pending.length}>
              {pending.map((doc) => (
                <ApprovalCard key={doc.id} doc={doc} rulebook={rulebook} onDecide={(d) => decide(doc.id, d)} />
              ))}
            </Section>
          )}
          {decided.length > 0 && (
            <Section title="Decided" count={decided.length}>
              {decided.map((doc) => (
                <ApprovalCard key={doc.id} doc={doc} rulebook={rulebook} decision={decisions[doc.id]} onDecide={(d) => decide(doc.id, d)} />
              ))}
            </Section>
          )}
        </div>
      )}
    </div>
  );
}

function Section({ title, count, children }: { title: string; count: number; children: React.ReactNode }) {
  return (
    <section className="space-y-3">
      <div className="flex items-center gap-2 px-1">
        <h2 className="text-[13px] font-semibold text-[var(--color-text)]">{title}</h2>
        <span className="tabular font-mono text-[11px] text-[var(--color-faint)]">{count}</span>
      </div>
      {children}
    </section>
  );
}
