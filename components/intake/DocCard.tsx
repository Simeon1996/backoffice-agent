"use client";

import Link from "next/link";
import type { Document, DocStatus } from "@/lib/data/types";
import { DocTypeIcon } from "@/components/ui/DocTypeIcon";
import { StatusTag } from "@/components/ui/StatusTag";
import { docTypeById } from "@/lib/data/docTypes";
import { personById } from "@/lib/data/people";
import { classify } from "@/lib/engine/classify";
import { fmtClock, fmtMoney, fmtConfidence } from "@/lib/time";

export function DocCard({ doc, status }: { doc: Document; status: DocStatus }) {
  const type = docTypeById(doc.type);
  const sender = personById(doc.sender);
  const klass = classify(doc);
  return (
    <Link
      href={`/doc/${doc.id}`}
      className="group block rounded-[6px] border border-[var(--color-border)] bg-[var(--color-sheet)] shadow-[var(--shadow-soft)] transition-shadow hover:shadow-[var(--shadow-card)]"
      style={{ borderTop: "3px solid var(--color-ink)" }}
    >
      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <DocTypeIcon type={doc.type} size={34} />
          <StatusTag status={status} />
        </div>
        <div className="mt-3 font-serif text-[17px] font-semibold leading-snug tracking-tight text-[var(--color-text)] line-clamp-2">
          {doc.title}
        </div>
        <div className="mt-1 text-[11.5px] text-[var(--color-muted)]">
          {sender?.name} · received {fmtClock(doc.receivedAt)}
        </div>
      </div>
      <div className="flex items-center justify-between border-t border-[var(--color-sheet-line)] px-4 py-2.5 text-[11px]">
        <span className="text-[var(--color-muted)]">
          Classified <span className="font-medium text-[var(--color-text-soft)]">{type?.label}</span> · {fmtConfidence(klass.confidence)}
        </span>
        {doc.amount != null && doc.amount > 0 && (
          <span className="tabular font-mono font-semibold text-[var(--color-text)]">{fmtMoney(doc.amount)}</span>
        )}
      </div>
    </Link>
  );
}
