import type { Document } from "@/lib/data/types";
import { displayField, rawField } from "@/lib/docFields";
import { Field } from "../Field";
import { Paper, PaperHeader, MetaRow } from "../Paper";

export function HRForm({ doc, paperRef }: { doc: Document; paperRef?: React.Ref<HTMLDivElement> }) {
  const c = doc.content as { details: string[]; notes: string };
  const hasAmount = Number(rawField(doc, "amount") ?? 0) > 0;
  return (
    <Paper ref={paperRef}>
      <PaperHeader
        kicker="People Ops"
        title={String(displayField(doc, "form_type"))}
        meta={
          <div className="space-y-0.5">
            <div>Effective <Field id="effective_date">{displayField(doc, "effective_date")}</Field></div>
            <div>Dept <Field id="department">{displayField(doc, "department")}</Field></div>
          </div>
        }
      />

      <div className="grid grid-cols-2 gap-8">
        <div className="space-y-1">
          <MetaRow label="Employee"><Field id="employee">{displayField(doc, "employee")}</Field></MetaRow>
          <MetaRow label="Form"><Field id="form_type">{displayField(doc, "form_type")}</Field></MetaRow>
          <MetaRow label="Manager"><Field id="manager">{displayField(doc, "manager")}</Field></MetaRow>
        </div>
        {hasAmount && (
          <div>
            <div className="text-[11px] uppercase tracking-wide text-[var(--color-faint)]">Amount</div>
            <div className="mt-1 font-serif text-2xl font-semibold"><Field id="amount">{displayField(doc, "amount")}</Field></div>
          </div>
        )}
      </div>

      <div className="mt-7 border-t border-[var(--color-sheet-line)] pt-4">
        <ul className="space-y-1.5 text-[12.5px] text-[var(--color-text-soft)]">
          {c.details.map((d, i) => (
            <li key={i} className="flex gap-2">
              <span className="text-[var(--color-faint)]">·</span>
              <span>{d}</span>
            </li>
          ))}
        </ul>
        <p className="mt-4 text-[11px] italic text-[var(--color-faint)]">{c.notes}</p>
      </div>
    </Paper>
  );
}
