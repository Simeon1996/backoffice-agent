"use client";

import { motion } from "motion/react";
import type { DocTypeDef } from "@/lib/data/types";
import { Card } from "@/components/ui/Card";
import { DocTypeIcon } from "@/components/ui/DocTypeIcon";
import { DOCUMENTS } from "@/lib/data/documents";
import { docTypeById } from "@/lib/data/docTypes";
import { classify } from "@/lib/engine/classify";
import { fmtConfidence } from "@/lib/time";
import { DOC_TYPE_TINT } from "@/lib/display";

export function TypeCard({ def }: { def: DocTypeDef }) {
  const sample = DOCUMENTS.find((d) => d.type === def.id);
  const klass = sample ? classify(sample) : null;
  const tint = DOC_TYPE_TINT[def.id];

  const bars = klass
    ? [{ type: klass.type, score: klass.confidence, win: true }, ...klass.alternatives.map((a) => ({ type: a.type, score: a.score, win: false }))]
    : [];

  return (
    <Card className="flex flex-col p-5">
      <div className="flex items-center gap-3">
        <DocTypeIcon type={def.id} size={38} />
        <div>
          <h2 className="font-serif text-lg font-semibold tracking-tight">{def.label}</h2>
          <span className="text-[11px] text-[var(--color-faint)]">{def.fields.length} fields extracted</span>
        </div>
      </div>
      <p className="mt-3 text-[12.5px] leading-relaxed text-[var(--color-muted)]">{def.blurb}</p>

      <div className="mt-4 flex flex-wrap gap-1.5">
        {def.fields.map((f) => (
          <span key={f.id} className="rounded-md bg-[var(--color-paper-deep)] px-2 py-0.5 font-mono text-[10px] text-[var(--color-text-soft)]">
            {f.label}
          </span>
        ))}
      </div>

      {klass && (
        <div className="mt-4 border-t border-[var(--color-border)] pt-3">
          <div className="mb-2 text-[10px] font-semibold uppercase tracking-wide text-[var(--color-faint)]">
            Classifier read · sample {sample!.id}
          </div>
          <div className="space-y-1.5">
            {bars.map((b) => (
              <div key={b.type} className="flex items-center gap-2">
                <span className="w-28 shrink-0 truncate text-[11px] text-[var(--color-text-soft)]">{docTypeById(b.type)?.label}</span>
                <span className="relative h-2 flex-1 overflow-hidden rounded-full bg-[var(--color-paper-deep)]">
                  <motion.span
                    className="absolute inset-y-0 left-0 rounded-full"
                    style={{ background: b.win ? tint : "var(--color-border-strong)" }}
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.round(b.score * 100)}%` }}
                    transition={{ type: "spring", stiffness: 120, damping: 20 }}
                  />
                </span>
                <span className="tabular w-9 text-right font-mono text-[10px] font-semibold" style={{ color: b.win ? tint : "var(--color-faint)" }}>
                  {fmtConfidence(b.score)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </Card>
  );
}
