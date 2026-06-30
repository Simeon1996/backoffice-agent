import type { Document } from "./data/types";
import { docTypeById } from "./data/docTypes";
import { fmtMoney, fmtDate } from "./time";

export function rawField(doc: Document, id: string): string | number | undefined {
  return doc.fields.find((f) => f.id === id)?.value;
}

/** Formatted field value for display in a paper template, by its schema kind. */
export function displayField(doc: Document, id: string): string {
  const field = doc.fields.find((f) => f.id === id);
  if (!field) return "—";
  const kind = docTypeById(doc.type)?.fields.find((f) => f.id === id)?.kind;
  if (kind === "money") return fmtMoney(Number(field.value));
  if (kind === "date") return fmtDate(String(field.value));
  return String(field.value);
}
