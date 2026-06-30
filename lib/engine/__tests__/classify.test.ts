import { describe, it, expect } from "vitest";
import { classify } from "../classify";
import { documentById } from "../../data/documents";

describe("classify", () => {
  it("returns the document's true type with high confidence", () => {
    const c = classify(documentById("INV-4471")!);
    expect(c.type).toBe("invoice");
    expect(c.confidence).toBeGreaterThan(0.8);
    expect(c.confidence).toBeLessThanOrEqual(1);
  });

  it("offers two lower-scored alternatives", () => {
    const c = classify(documentById("CLM-5567")!);
    expect(c.alternatives).toHaveLength(2);
    for (const a of c.alternatives) {
      expect(a.type).not.toBe(c.type);
      expect(a.score).toBeLessThan(c.confidence);
    }
  });

  it("is deterministic", () => {
    const a = classify(documentById("PO-7782")!);
    const b = classify(documentById("PO-7782")!);
    expect(a).toEqual(b);
  });
});
