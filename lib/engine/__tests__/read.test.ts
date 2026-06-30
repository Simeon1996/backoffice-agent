import { describe, it, expect } from "vitest";
import { readSequence, fieldsRevealedAt } from "../read";
import { throughput } from "../metrics";
import { DOCUMENTS, documentById } from "../../data/documents";
import { DEFAULT_RULEBOOK } from "../../data/rulebook";

describe("readSequence", () => {
  it("is classify, each field, validate, route", () => {
    const doc = documentById("INV-4471")!;
    const seq = readSequence(doc);
    expect(seq).toHaveLength(doc.fields.length + 3);
    expect(seq[0].kind).toBe("classify");
    expect(seq[seq.length - 1].kind).toBe("route");
  });

  it("reveals fields progressively after classify", () => {
    const doc = documentById("INV-4471")!;
    expect(fieldsRevealedAt(doc, 0)).toBe(0);
    expect(fieldsRevealedAt(doc, 1)).toBe(0); // classify shown, no fields yet
    expect(fieldsRevealedAt(doc, 3)).toBe(2);
    expect(fieldsRevealedAt(doc, 99)).toBe(doc.fields.length);
  });
});

describe("throughput", () => {
  const t = throughput(DOCUMENTS, DEFAULT_RULEBOOK);

  it("counts every document", () => {
    expect(t.total).toBe(DOCUMENTS.length);
  });

  it("reports an STP rate in 0..1 and positive dollars", () => {
    expect(t.stpRate).toBeGreaterThan(0);
    expect(t.stpRate).toBeLessThanOrEqual(1);
    expect(t.dollarsProcessed).toBeGreaterThan(0);
  });

  it("ranks exception reasons with the PO match at the top set", () => {
    expect(t.topExceptions.length).toBeGreaterThan(0);
    expect(t.topExceptions.some((e) => e.reason === "3-way PO match")).toBe(true);
  });
});
