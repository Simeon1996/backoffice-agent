import type { Document } from "../data/types";

export type ReadStep =
  | { kind: "classify" }
  | { kind: "field"; fieldId: string }
  | { kind: "validate" }
  | { kind: "route" };

/**
 * The ordered "read" the Workspace replays: classify, then reveal each field,
 * then validate, then route. Total length = fields + 3.
 */
export function readSequence(doc: Document): ReadStep[] {
  return [
    { kind: "classify" },
    ...doc.fields.map((f) => ({ kind: "field" as const, fieldId: f.id })),
    { kind: "validate" },
    { kind: "route" },
  ];
}

/** How many leading steps are revealed once `revealCount = n`. */
export const fieldsRevealedAt = (doc: Document, revealCount: number): number =>
  Math.max(0, Math.min(doc.fields.length, revealCount - 1));
