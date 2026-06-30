import { describe, it, expect } from "vitest";
import { DOCUMENTS } from "../documents";
import { DOC_TYPES, docTypeById, RULES } from "../docTypes";
import { personById } from "../people";
import { DEFAULT_RULEBOOK } from "../rulebook";

describe("corpus integrity", () => {
  it("every document has a real type and sender", () => {
    for (const d of DOCUMENTS) {
      expect(docTypeById(d.type), d.id).toBeTruthy();
      expect(personById(d.sender), d.id).toBeTruthy();
    }
  });

  it("every extracted field id exists in its type's schema", () => {
    for (const d of DOCUMENTS) {
      const ids = new Set(docTypeById(d.type)!.fields.map((f) => f.id));
      for (const f of d.fields) expect(ids.has(f.id), `${d.id}/${f.id}`).toBe(true);
    }
  });

  it("confidences are within 0..1", () => {
    for (const d of DOCUMENTS)
      for (const f of d.fields) {
        expect(f.confidence, `${d.id}/${f.id}`).toBeGreaterThanOrEqual(0);
        expect(f.confidence, `${d.id}/${f.id}`).toBeLessThanOrEqual(1);
      }
  });

  it("every document type is represented", () => {
    const present = new Set(DOCUMENTS.map((d) => d.type));
    for (const t of DOC_TYPES) expect(present.has(t.id), t.id).toBe(true);
  });

  it("rule ids are unique and the default rulebook covers them", () => {
    const ids = RULES.map((r) => r.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const r of RULES) expect(DEFAULT_RULEBOOK[r.id], r.id).toBeTruthy();
  });

  it("document ids are unique", () => {
    const ids = DOCUMENTS.map((d) => d.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});
