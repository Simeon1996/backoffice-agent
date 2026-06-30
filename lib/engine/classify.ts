import type { Document, DocTypeId } from "../data/types";
import { DOC_TYPES } from "../data/docTypes";

export interface Classification {
  type: DocTypeId;
  confidence: number;
  alternatives: { type: DocTypeId; score: number }[];
}

const clamp = (n: number) => Math.max(0, Math.min(1, n));

/**
 * Deterministic classifier. The winning type is the document's true type; its
 * confidence is the mean field confidence, and two near-miss alternatives are
 * derived stably from the document id so the demo is reproducible.
 */
export function classify(doc: Document): Classification {
  const mean =
    doc.fields.reduce((s, f) => s + f.confidence, 0) / Math.max(1, doc.fields.length);
  const confidence = clamp(0.9 + (mean - 0.9) * 0.8); // pull toward a confident read

  // pick two other types, ordered by a stable per-doc hash
  const others = DOC_TYPES.map((t) => t.id).filter((t) => t !== doc.type);
  let h = 0;
  for (let i = 0; i < doc.id.length; i++) h = (h * 31 + doc.id.charCodeAt(i)) >>> 0;
  const ordered = [...others].sort(
    (a, b) => ((h + a.length) % 7) - ((h + b.length) % 7) || a.localeCompare(b),
  );
  const alternatives = ordered.slice(0, 2).map((type, i) => ({
    type,
    score: clamp(confidence * (i === 0 ? 0.18 : 0.07)),
  }));

  return { type: doc.type, confidence, alternatives };
}
