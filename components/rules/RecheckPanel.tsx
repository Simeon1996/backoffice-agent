"use client";

import { useMemo } from "react";
import { ArrowRight } from "lucide-react";
import { useManila } from "@/lib/store";
import { DOCUMENTS, documentById } from "@/lib/data/documents";
import { DEFAULT_RULEBOOK } from "@/lib/data/rulebook";
import { routingFor } from "@/lib/derive";
import { Card } from "@/components/ui/Card";
import { Stamp } from "@/components/ui/Stamp";
import { ROUTING_META } from "@/lib/display";

export function RecheckPanel({ docId, onPick }: { docId: string; onPick: (id: string) => void }) {
  const working = useManila((s) => s.rulebook);
  const doc = documentById(docId) ?? DOCUMENTS[0];

  const { before, after, changed } = useMemo(() => {
    const before = routingFor(doc, DEFAULT_RULEBOOK).decision;
    const after = routingFor(doc, working).decision;
    return { before, after, changed: before.kind !== after.kind };
  }, [doc, working]);

  return (
    <Card className="overflow-hidden">
      <div className="flex items-center justify-between gap-3 border-b border-[var(--color-border)] px-5 py-3.5">
        <div>
          <div className="text-[13px] font-semibold text-[var(--color-text)]">Re-check a document</div>
          <div className="text-[11px] text-[var(--color-muted)]">Same document, judged by deployed vs working rules</div>
        </div>
        <select
          value={doc.id}
          onChange={(e) => onPick(e.target.value)}
          className="max-w-[170px] truncate rounded-lg border border-[var(--color-border-strong)] bg-[var(--color-sheet)] px-2.5 py-1.5 text-[12px] text-[var(--color-text-soft)] outline-none"
        >
          {DOCUMENTS.map((d) => (
            <option key={d.id} value={d.id}>{d.id} · {d.title.slice(0, 26)}</option>
          ))}
        </select>
      </div>

      <div className="p-5">
        {changed && (
          <div className="mb-4 rounded-lg bg-[var(--color-paper-deep)] px-3 py-2 text-[12px] font-medium text-[var(--color-text)]">
            Outcome changes: <span style={{ color: ROUTING_META[before.kind].color }}>{ROUTING_META[before.kind].label}</span>
            {" → "}
            <span style={{ color: ROUTING_META[after.kind].color }}>{ROUTING_META[after.kind].label}</span>
          </div>
        )}
        <div className="grid grid-cols-2 items-stretch gap-3">
          <Outcome title="Deployed rules" stamp={before.stamp} kind={before.kind} queue={before.queue} />
          <Outcome title="Working rules" stamp={after.stamp} kind={after.kind} queue={after.queue} />
        </div>
        {!changed && (
          <p className="mt-3 text-center text-[12px] text-[var(--color-muted)]">No change — this document routes the same under both.</p>
        )}
      </div>
    </Card>
  );
}

function Outcome({ title, stamp, kind, queue }: { title: string; stamp: string; kind: keyof typeof ROUTING_META; queue: string }) {
  const meta = ROUTING_META[kind];
  return (
    <div className="flex flex-col items-center gap-3 rounded-xl border border-[var(--color-border)] px-3 py-4 text-center" style={{ background: meta.soft }}>
      <span className="text-[10px] font-semibold uppercase tracking-wide text-[var(--color-muted)]">{title}</span>
      <Stamp label={stamp} color={meta.color} size="sm" animate={false} />
      <span className="text-[11px] text-[var(--color-text-soft)]">{queue}</span>
    </div>
  );
}
