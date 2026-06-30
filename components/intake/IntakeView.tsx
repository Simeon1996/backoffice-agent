"use client";

import { useMemo, useState } from "react";
import { useManila } from "@/lib/store";
import { DOCUMENTS } from "@/lib/data/documents";
import { DOC_TYPES } from "@/lib/data/docTypes";
import type { DocTypeId } from "@/lib/data/types";
import { effectiveStatus } from "@/lib/derive";
import { PageHeader } from "@/components/shell/PageHeader";
import { DocCard } from "./DocCard";
import { cn } from "@/lib/utils";

type Filter = DocTypeId | "all";

export function IntakeView() {
  const rulebook = useManila((s) => s.rulebook);
  const decisions = useManila((s) => s.decisions);
  const [filter, setFilter] = useState<Filter>("all");

  const rows = useMemo(
    () =>
      [...DOCUMENTS]
        .sort((a, b) => a.receivedAt - b.receivedAt)
        .map((doc) => ({ doc, status: effectiveStatus(doc, rulebook, decisions) })),
    [rulebook, decisions],
  );

  const shown = filter === "all" ? rows : rows.filter((r) => r.doc.type === filter);

  const chips: { id: Filter; label: string }[] = [
    { id: "all", label: "All" },
    ...DOC_TYPES.map((t) => ({ id: t.id as Filter, label: t.label })),
  ];

  return (
    <div className="mx-auto max-w-[1100px] space-y-5 p-6 lg:p-8">
      <PageHeader
        title="Intake"
        subtitle="Everything that landed in the mailroom today. Manila has read and routed each one — open any document to watch it work."
      />

      <div className="flex flex-wrap items-center gap-1.5">
        {chips.map((c) => {
          const count = c.id === "all" ? rows.length : rows.filter((r) => r.doc.type === c.id).length;
          return (
            <button
              key={c.id}
              onClick={() => setFilter(c.id)}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[12.5px] font-medium transition-colors",
                filter === c.id
                  ? "bg-[var(--color-ink)] text-[var(--color-ink-on)]"
                  : "border border-[var(--color-border-strong)] text-[var(--color-text-soft)] hover:bg-[var(--color-paper-deep)]",
              )}
            >
              {c.label}
              <span className={cn("tabular font-mono text-[10px]", filter === c.id ? "text-[var(--color-ink-on-soft)]" : "text-[var(--color-faint)]")}>{count}</span>
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {shown.map(({ doc, status }) => (
          <DocCard key={doc.id} doc={doc} status={status} />
        ))}
      </div>
    </div>
  );
}
