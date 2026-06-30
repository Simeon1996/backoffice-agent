import type { Document } from "@/lib/data/types";
import { displayField } from "@/lib/docFields";
import { Field } from "../Field";
import { Paper, PaperHeader, MetaRow } from "../Paper";

export function Claim({ doc, paperRef }: { doc: Document; paperRef?: React.Ref<HTMLDivElement> }) {
  const c = doc.content as { incident: string; adjuster: string; lossDescription: string };
  return (
    <Paper ref={paperRef}>
      <PaperHeader
        kicker="Claims"
        title="Insurance Claim"
        meta={
          <div className="space-y-0.5">
            <div>Claim <Field id="claim_no" className="font-mono">{displayField(doc, "claim_no")}</Field></div>
            <div>Loss <Field id="loss_date">{displayField(doc, "loss_date")}</Field></div>
          </div>
        }
      />

      <div className="grid grid-cols-2 gap-8">
        <div className="space-y-1">
          <MetaRow label="Claimant"><Field id="claimant">{displayField(doc, "claimant")}</Field></MetaRow>
          <MetaRow label="Policy #"><Field id="policy_no">{displayField(doc, "policy_no")}</Field></MetaRow>
          <MetaRow label="Adjuster">{c.adjuster}</MetaRow>
        </div>
        <div className="space-y-1">
          <MetaRow label="Claim amount"><Field id="claim_amount" className="font-semibold">{displayField(doc, "claim_amount")}</Field></MetaRow>
          <MetaRow label="Coverage limit"><Field id="coverage_limit">{displayField(doc, "coverage_limit")}</Field></MetaRow>
        </div>
      </div>

      <div className="mt-7 border-t border-[var(--color-sheet-line)] pt-4">
        <div className="text-[11px] uppercase tracking-wide text-[var(--color-faint)]">Incident</div>
        <p className="mt-1 font-serif text-base">{c.incident}</p>
        <p className="mt-2 text-[12.5px] leading-relaxed text-[var(--color-text-soft)]">{c.lossDescription}</p>
      </div>
    </Paper>
  );
}
