"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { RoutingDecision } from "@/lib/engine/route";
import { Card, CardHeader } from "@/components/ui/Card";
import { ROUTING_META } from "@/lib/display";

export function RoutingPanel({ decision, shown }: { decision: RoutingDecision; shown: boolean }) {
  const meta = ROUTING_META[decision.kind];
  const needsHuman = decision.kind === "needs_review" || decision.kind === "escalate";
  return (
    <Card>
      <CardHeader title="Routing decision" hint={shown ? meta.label : "Pending validation"} />
      <div className="px-4 py-3">
        {!shown ? (
          <div className="py-4 text-center text-[12px] text-[var(--color-muted)]">Manila routes once validation completes.</div>
        ) : (
          <div className="space-y-3">
            <div className="rounded-lg px-3 py-2.5" style={{ background: meta.soft }}>
              <div className="text-[11px] uppercase tracking-wide" style={{ color: meta.color }}>
                Routed to
              </div>
              <div className="text-[15px] font-semibold text-[var(--color-text)]">{decision.queue}</div>
              <p className="mt-1 text-[12px] leading-relaxed text-[var(--color-text-soft)]">{decision.rationale}</p>
            </div>
            {needsHuman && (
              <Link
                href="/approvals"
                className="inline-flex w-full items-center justify-center gap-1.5 rounded-lg bg-[var(--color-ink)] py-2 text-[13px] font-medium text-[var(--color-ink-on)] hover:bg-[var(--color-ink-700)]"
              >
                Open in Approvals <ArrowRight size={14} />
              </Link>
            )}
          </div>
        )}
      </div>
    </Card>
  );
}
