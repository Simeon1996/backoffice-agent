"use client";

import { useState } from "react";
import { RotateCcw } from "lucide-react";
import { useManila } from "@/lib/store";
import { DOC_TYPES, rulesForType } from "@/lib/data/docTypes";
import { DEFAULT_RULEBOOK } from "@/lib/data/rulebook";
import { RULES } from "@/lib/data/docTypes";
import { PageHeader } from "@/components/shell/PageHeader";
import { DocTypeIcon } from "@/components/ui/DocTypeIcon";
import { RuleCard } from "./RuleCard";
import { RecheckPanel } from "./RecheckPanel";

export function RulebookView() {
  const rulebook = useManila((s) => s.rulebook);
  const reset = useManila((s) => s.resetRulebook);
  const [docId, setDocId] = useState("INV-4471");

  const dirty = RULES.some(
    (r) =>
      rulebook[r.id].enabled !== DEFAULT_RULEBOOK[r.id].enabled ||
      rulebook[r.id].threshold !== DEFAULT_RULEBOOK[r.id].threshold,
  );

  return (
    <div className="mx-auto max-w-[1200px] space-y-5 p-6 lg:p-8">
      <PageHeader
        title="Rulebook"
        subtitle="The checks Manila runs before routing. Toggle a rule or change a limit, then re-check any document to see what changes."
        right={
          dirty ? (
            <button onClick={reset} className="inline-flex items-center gap-1.5 rounded-lg border border-[var(--color-border-strong)] px-3 py-1.5 text-[13px] font-medium text-[var(--color-text-soft)] hover:bg-[var(--color-paper-deep)]">
              <RotateCcw size={14} /> Reset to deployed
            </button>
          ) : (
            <span className="inline-flex items-center rounded-lg bg-[var(--color-pass-soft)] px-3 py-1.5 text-[12px] font-medium text-[var(--color-stamp-green)]">Matches deployed</span>
          )
        }
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_400px]">
        <div className="space-y-6">
          {DOC_TYPES.map((t) => (
            <section key={t.id} className="space-y-2.5">
              <div className="flex items-center gap-2 px-1">
                <DocTypeIcon type={t.id} size={24} />
                <h2 className="text-[13px] font-semibold text-[var(--color-text)]">{t.label}</h2>
              </div>
              <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                {rulesForType(t.id).map((r) => (
                  <RuleCard key={r.id} rule={r} />
                ))}
              </div>
            </section>
          ))}
        </div>
        <div className="lg:sticky lg:top-5 lg:self-start">
          <RecheckPanel docId={docId} onPick={setDocId} />
        </div>
      </div>
    </div>
  );
}
