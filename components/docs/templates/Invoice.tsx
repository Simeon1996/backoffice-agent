import type { Document } from "@/lib/data/types";
import { displayField } from "@/lib/docFields";
import { fmtMoney } from "@/lib/time";
import { Field } from "../Field";
import { Paper, PaperHeader, MetaRow } from "../Paper";

interface LineItem { desc: string; qty: number; unit: number; amount: number }

export function Invoice({ doc, paperRef }: { doc: Document; paperRef?: React.Ref<HTMLDivElement> }) {
  const c = doc.content as { vendorAddress: string; billTo: string; lineItems: LineItem[]; terms: string };
  return (
    <Paper ref={paperRef}>
      <PaperHeader
        kicker="Accounts Payable"
        title="Invoice"
        meta={
          <div className="space-y-0.5">
            <div>Invoice <Field id="invoice_no" className="font-mono">{displayField(doc, "invoice_no")}</Field></div>
            <div>Dated <Field id="invoice_date">{displayField(doc, "invoice_date")}</Field></div>
          </div>
        }
      />

      <div className="grid grid-cols-2 gap-8">
        <div>
          <div className="text-[11px] uppercase tracking-wide text-[var(--color-faint)]">From</div>
          <div className="mt-1 font-serif text-lg"><Field id="vendor">{displayField(doc, "vendor")}</Field></div>
          <div className="text-[12px] text-[var(--color-muted)]">{c.vendorAddress}</div>
        </div>
        <div className="space-y-1">
          <MetaRow label="Bill to">{c.billTo}</MetaRow>
          <MetaRow label="PO #"><Field id="po_number">{displayField(doc, "po_number")}</Field></MetaRow>
          <MetaRow label="Due"><Field id="due_date">{displayField(doc, "due_date")}</Field></MetaRow>
        </div>
      </div>

      <table className="mt-7 w-full text-[12.5px]">
        <thead>
          <tr className="border-b border-[var(--color-sheet-line)] text-left text-[10px] uppercase tracking-wide text-[var(--color-faint)]">
            <th className="py-1.5 font-medium">Description</th>
            <th className="py-1.5 text-right font-medium">Qty</th>
            <th className="py-1.5 text-right font-medium">Unit</th>
            <th className="py-1.5 text-right font-medium">Amount</th>
          </tr>
        </thead>
        <tbody>
          {c.lineItems.map((li, i) => (
            <tr key={i} className="border-b border-[var(--color-sheet-line)]">
              <td className="py-2">{li.desc}</td>
              <td className="py-2 text-right font-mono">{li.qty}</td>
              <td className="py-2 text-right font-mono">{fmtMoney(li.unit)}</td>
              <td className="py-2 text-right font-mono">{fmtMoney(li.amount)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="mt-5 ml-auto w-56 space-y-1">
        <MetaRow label="Subtotal"><Field id="subtotal">{displayField(doc, "subtotal")}</Field></MetaRow>
        <MetaRow label="Tax"><Field id="tax">{displayField(doc, "tax")}</Field></MetaRow>
        <div className="flex items-baseline justify-between border-t border-[var(--color-ink)] pt-2">
          <span className="text-[11px] font-semibold uppercase tracking-wide">Total due</span>
          <Field id="total" className="font-serif text-xl font-semibold">{displayField(doc, "total")}</Field>
        </div>
      </div>

      <p className="mt-8 text-[11px] italic text-[var(--color-faint)]">{c.terms}</p>
    </Paper>
  );
}
