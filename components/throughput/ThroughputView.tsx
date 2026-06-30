"use client";

import { useMemo } from "react";
import { Gauge, Banknote, AlertTriangle, Clock, type LucideIcon } from "lucide-react";
import { motion } from "motion/react";
import { useManila } from "@/lib/store";
import { DOCUMENTS } from "@/lib/data/documents";
import { throughput } from "@/lib/engine/metrics";
import { docTypeById } from "@/lib/data/docTypes";
import { PageHeader } from "@/components/shell/PageHeader";
import { Card, CardHeader } from "@/components/ui/Card";
import { DOC_TYPE_TINT, ROUTING_META } from "@/lib/display";
import { fmtMoney } from "@/lib/time";

export function ThroughputView() {
  const rulebook = useManila((s) => s.rulebook);
  const t = useMemo(() => throughput(DOCUMENTS, rulebook), [rulebook]);
  const maxType = Math.max(...t.byType.map((b) => b.count), 1);
  const hours = (t.minutesSaved / 60).toFixed(1);

  return (
    <div className="mx-auto max-w-[1100px] space-y-5 p-6 lg:p-8">
      <PageHeader
        title="Throughput"
        subtitle="What the desk handled today. These figures track the working rulebook — change a rule and watch them move."
      />

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Tile icon={Gauge} tint="var(--color-stamp-green)" value={`${Math.round(t.stpRate * 100)}%`} label="Straight-through" />
        <Tile icon={Banknote} tint="var(--color-accent)" value={fmtMoney(t.dollarsProcessed)} label="Value processed" />
        <Tile icon={AlertTriangle} tint="var(--color-stamp-red)" value={String(t.exceptions)} label="Exceptions" />
        <Tile icon={Clock} tint="var(--color-t-claim)" value={`${hours}h`} label="Handling saved" />
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <Card>
          <CardHeader title="By document type" hint={`${t.total} documents`} />
          <div className="space-y-2.5 px-5 py-4">
            {t.byType.map((b) => (
              <div key={b.type} className="flex items-center gap-3">
                <span className="w-28 shrink-0 text-[12px] text-[var(--color-text-soft)]">{docTypeById(b.type)?.label}</span>
                <span className="relative h-3 flex-1 overflow-hidden rounded-full bg-[var(--color-paper-deep)]">
                  <motion.span
                    className="absolute inset-y-0 left-0 rounded-full"
                    style={{ background: DOC_TYPE_TINT[b.type] }}
                    initial={{ width: 0 }}
                    animate={{ width: `${(b.count / maxType) * 100}%` }}
                    transition={{ type: "spring", stiffness: 120, damping: 20 }}
                  />
                </span>
                <span className="tabular w-5 text-right font-mono text-[12px] font-semibold text-[var(--color-text)]">{b.count}</span>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <CardHeader title="How they were routed" />
          <div className="space-y-2.5 px-5 py-4">
            {t.byOutcome.map((o) => {
              const meta = ROUTING_META[o.kind];
              return (
                <div key={o.kind} className="flex items-center gap-3">
                  <span className="w-28 shrink-0 text-[12px]" style={{ color: meta.color }}>{meta.label}</span>
                  <span className="relative h-3 flex-1 overflow-hidden rounded-full bg-[var(--color-paper-deep)]">
                    <motion.span
                      className="absolute inset-y-0 left-0 rounded-full"
                      style={{ background: meta.color }}
                      initial={{ width: 0 }}
                      animate={{ width: `${(o.count / t.total) * 100}%` }}
                      transition={{ type: "spring", stiffness: 120, damping: 20 }}
                    />
                  </span>
                  <span className="tabular w-5 text-right font-mono text-[12px] font-semibold text-[var(--color-text)]">{o.count}</span>
                </div>
              );
            })}
          </div>
        </Card>
      </div>

      <Card>
        <CardHeader title="Top exception reasons" hint="Why documents needed a human" />
        <div className="px-5 py-2">
          {t.topExceptions.length === 0 ? (
            <div className="py-6 text-center text-[12px] text-[var(--color-muted)]">No exceptions under the current rulebook.</div>
          ) : (
            t.topExceptions.map((e) => (
              <div key={e.reason} className="flex items-center justify-between border-b border-[var(--color-border)] py-2.5 last:border-0">
                <span className="text-[12.5px] text-[var(--color-text-soft)]">{e.reason}</span>
                <span className="tabular font-mono text-[12px] font-semibold text-[var(--color-fail)]">{e.count}×</span>
              </div>
            ))
          )}
        </div>
      </Card>
    </div>
  );
}

function Tile({ icon: Icon, tint, value, label }: { icon: LucideIcon; tint: string; value: string; label: string }) {
  return (
    <Card className="flex items-center gap-3 p-4">
      <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg" style={{ background: `color-mix(in srgb, ${tint} 12%, transparent)`, color: tint }}>
        <Icon size={18} />
      </span>
      <div className="min-w-0">
        <div className="tabular font-mono text-xl font-semibold leading-none text-[var(--color-text)]">{value}</div>
        <div className="mt-1 truncate text-[11px] text-[var(--color-muted)]">{label}</div>
      </div>
    </Card>
  );
}
