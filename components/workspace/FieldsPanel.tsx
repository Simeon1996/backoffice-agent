"use client";

import { motion } from "motion/react";
import type { Document } from "@/lib/data/types";
import { Card, CardHeader } from "@/components/ui/Card";
import { ConfidenceBar } from "@/components/ui/ConfidenceBar";
import { docTypeById } from "@/lib/data/docTypes";
import { displayField } from "@/lib/docFields";
import { cn } from "@/lib/utils";

export function FieldsPanel({
  doc,
  revealedIds,
  activeId,
}: {
  doc: Document;
  revealedIds: string[];
  activeId: string | null;
}) {
  const labelOf = (id: string) => docTypeById(doc.type)?.fields.find((f) => f.id === id)?.label ?? id;
  const confOf = (id: string) => doc.fields.find((f) => f.id === id)?.confidence ?? 1;

  return (
    <Card>
      <CardHeader title="Extracted fields" hint={`${revealedIds.length} of ${doc.fields.length}`} />
      <div className="divide-y divide-[var(--color-border)] px-2">
        {revealedIds.length === 0 ? (
          <div className="px-3 py-6 text-center text-[12px] text-[var(--color-muted)]">Press Read to extract fields.</div>
        ) : (
          revealedIds.map((id) => (
            <motion.div
              key={id}
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              className={cn("flex items-center justify-between gap-3 rounded-md px-3 py-2", id === activeId && "bg-[var(--color-accent-soft)]")}
            >
              <span className="text-[11px] uppercase tracking-wide text-[var(--color-faint)]">{labelOf(id)}</span>
              <span className="flex items-center gap-2.5">
                <span className="font-mono text-[12.5px] text-[var(--color-text)]">{displayField(doc, id)}</span>
                <ConfidenceBar value={confOf(id)} />
              </span>
            </motion.div>
          ))
        )}
      </div>
    </Card>
  );
}
