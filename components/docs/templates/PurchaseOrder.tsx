import type { Document } from "@/lib/data/types";
import { displayField } from "@/lib/docFields";
import { fmtMoney } from "@/lib/time";
import { Field } from "../Field";
import { Paper, PaperHeader, MetaRow } from "../Paper";

interface LineItem { desc: string; qty: number; unit: number; amount: number }

export function PurchaseOrder({ doc, paperRef }: { doc: Document; paperRef?: React.Ref<HTMLDivElement> }) {
  const c = doc.content as { shipTo: string; lineItems: LineItem[]; terms: string };
  return (
    <Paper ref={paperRef}>
      <PaperHeader
        kicker="Procurement"
        title="Purchase Order"
        meta={
          <div className="space-y-0.5">
            <div><Field id="po_number" className="font-mono">{displayField(doc, "po_number")}</Field></div>
            <div>Need by <Field id="need_by">{displayField(doc, "need_by")}</Field></div>
          </div>
        }
      />

      <div className="grid grid-cols-2 gap-8">
        <div className="space-y-1">
          <MetaRow label="Supplier"><Field id="vendor">{displayField(doc, "vendor")}</Field></MetaRow>
          <MetaRow label="Department"><Field id="department">{displayField(doc, "department")}</Field></MetaRow>
          <MetaRow label="Requested by"><Field id="requested_by">{displayField(doc, "requested_by")}</Field></MetaRow>
        </div>
        <div>
          <div className="text-[11px] uppercase tracking-wide text-[var(--color-faint)]">Ship to</div>
          <div className="mt-1 text-[12px] text-[var(--color-text-soft)]">{c.shipTo}</div>
        </div>
      </div>

      <table className="mt-7 w-full text-[12.5px]">
        <thead>
          <tr className="border-b border-[var(--color-sheet-line)] text-left text-[10px] uppercase tracking-wide text-[var(--color-faint)]">
            <th className="py-1.5 font-medium">Line</th>
            <th className="py-1.5 text-right font-medium">Qty</th>
            <th className="py-1.5 text-right font-medium">Amount</th>
          </tr>
        </thead>
        <tbody>
          {c.lineItems.map((li, i) => (
            <tr key={i} className="border-b border-[var(--color-sheet-line)]">
              <td className="py-2">{li.desc}</td>
              <td className="py-2 text-right font-mono">{li.qty}</td>
              <td className="py-2 text-right font-mono">{fmtMoney(li.amount)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="mt-5 ml-auto w-56">
        <div className="flex items-baseline justify-between border-t border-[var(--color-ink)] pt-2">
          <span className="text-[11px] font-semibold uppercase tracking-wide">Order total</span>
          <Field id="total" className="font-serif text-xl font-semibold">{displayField(doc, "total")}</Field>
        </div>
      </div>

      <p className="mt-8 text-[11px] italic text-[var(--color-faint)]">{c.terms}</p>
    </Paper>
  );
}
