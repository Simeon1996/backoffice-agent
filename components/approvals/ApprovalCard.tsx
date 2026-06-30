"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { Check, X, ArrowUpRight } from "lucide-react";
import type { Document } from "@/lib/data/types";
import type { Decision } from "@/lib/store";
import { DocTypeIcon } from "@/components/ui/DocTypeIcon";
import { RuleResultRow } from "@/components/ui/RuleResultRow";
import { Stamp } from "@/components/ui/Stamp";
import { Card } from "@/components/ui/Card";
import { docTypeById } from "@/lib/data/docTypes";
import { personById } from "@/lib/data/people";
import { routingFor } from "@/lib/derive";
import type { Rulebook } from "@/lib/data/rulebook";
import { ROUTING_META } from "@/lib/display";
import { fmtMoney } from "@/lib/time";

export function ApprovalCard({
  doc,
  rulebook,
  decision,
  onDecide,
}: {
  doc: Document;
  rulebook: Rulebook;
  decision?: Decision;
  onDecide: (d: Decision) => void;
}) {
  const { results, decision: routing } = routingFor(doc, rulebook);
  const meta = ROUTING_META[routing.kind];
  const flagged = results.filter((r) => r.status !== "pass");

  return (
    <Card className="overflow-hidden">
      <div className="flex items-start gap-3.5 p-5">
        <DocTypeIcon type={doc.type} size={40} />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-serif text-[17px] font-semibold tracking-tight text-[var(--color-text)]">{doc.title}</span>
            <Link href={`/doc/${doc.id}`} className="font-mono text-[11px] text-[var(--color-accent)] hover:underline">{doc.id}</Link>
            <span className="text-[11px] text-[var(--color-muted)]">· {docTypeById(doc.type)?.label} · {personById(doc.sender)?.name}</span>
            {doc.amount != null && doc.amount > 0 && (
              <span className="tabular ml-auto font-mono text-[15px] font-semibold text-[var(--color-text)]">{fmtMoney(doc.amount)}</span>
            )}
          </div>

          <div className="mt-2 rounded-lg px-3 py-2 text-[12px]" style={{ background: meta.soft, color: meta.color }}>
            Routed to <span className="font-semibold">{routing.queue}</span> — {routing.rationale}
          </div>

          {flagged.length > 0 && (
            <div className="mt-1.5 divide-y divide-[var(--color-border)]">
              {flagged.map((r) => (
                <RuleResultRow key={r.ruleId} result={r} />
              ))}
            </div>
          )}

          <div className="mt-4">
            {decision ? (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center justify-between">
                <Stamp
                  label={decision === "approved" ? "APPROVED" : "REJECTED"}
                  color={decision === "approved" ? "var(--color-stamp-green)" : "var(--color-stamp-red)"}
                  size="sm"
                  sub="by you"
                />
                <Link href={`/doc/${doc.id}`} className="inline-flex items-center gap-1 text-[12px] text-[var(--color-accent)] hover:underline">
                  Open document <ArrowUpRight size={13} />
                </Link>
              </motion.div>
            ) : (
              <div className="flex gap-2">
                <button
                  onClick={() => onDecide("approved")}
                  className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-[var(--color-stamp-green)] py-2 text-[13px] font-medium text-white transition-opacity hover:opacity-90"
                >
                  <Check size={15} /> Approve
                </button>
                <button
                  onClick={() => onDecide("rejected")}
                  className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-[var(--color-border-strong)] py-2 text-[13px] font-medium text-[var(--color-text-soft)] transition-colors hover:bg-[var(--color-paper-deep)]"
                >
                  <X size={15} /> Reject
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}
