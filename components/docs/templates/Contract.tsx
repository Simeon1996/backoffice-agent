import type { Document } from "@/lib/data/types";
import { displayField } from "@/lib/docFields";
import { Field } from "../Field";
import { Paper, PaperHeader, MetaRow } from "../Paper";

export function Contract({ doc, paperRef }: { doc: Document; paperRef?: React.Ref<HTMLDivElement> }) {
  const c = doc.content as { recitals: string; clauses: string[]; signatureLine: string | null };
  return (
    <Paper ref={paperRef}>
      <PaperHeader
        kicker="Legal"
        title={String(displayField(doc, "agreement_type"))}
        meta={
          <div className="space-y-0.5">
            <div>Effective <Field id="effective_date">{displayField(doc, "effective_date")}</Field></div>
            <div>Term <Field id="term">{displayField(doc, "term")}</Field></div>
          </div>
        }
      />

      <div className="space-y-1">
        <MetaRow label="Counterparty"><Field id="counterparty">{displayField(doc, "counterparty")}</Field></MetaRow>
        <MetaRow label="Agreement"><Field id="agreement_type">{displayField(doc, "agreement_type")}</Field></MetaRow>
        <MetaRow label="Governing law"><Field id="governing_law">{displayField(doc, "governing_law")}</Field></MetaRow>
      </div>

      <p className="mt-6 text-[12.5px] leading-relaxed text-[var(--color-text-soft)]">{c.recitals}</p>

      <ol className="mt-4 space-y-1.5 text-[12.5px] text-[var(--color-text-soft)]">
        {c.clauses.map((cl, i) => (
          <li key={i} className="flex gap-2">
            <span className="font-mono text-[var(--color-faint)]">{i + 1}.</span>
            <span>{cl}</span>
          </li>
        ))}
      </ol>

      <div className="mt-9 border-t border-[var(--color-sheet-line)] pt-4">
        <div className="text-[11px] uppercase tracking-wide text-[var(--color-faint)]">Signatory</div>
        {c.signatureLine ? (
          <div className="mt-1 font-serif text-lg italic"><Field id="signatory">{displayField(doc, "signatory")}</Field></div>
        ) : (
          <div className="mt-2 flex items-center gap-3">
            <span className="inline-block h-px w-48 bg-[var(--color-border-strong)]" />
            <Field id="signatory" className="text-[12px] font-medium text-[var(--color-fail)]">{displayField(doc, "signatory")}</Field>
          </div>
        )}
      </div>
    </Paper>
  );
}
