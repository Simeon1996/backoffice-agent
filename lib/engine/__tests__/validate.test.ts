import { describe, it, expect } from "vitest";
import { validateDoc } from "../validate";
import { DEFAULT_RULEBOOK, cloneRulebook } from "../../data/rulebook";
import { documentById } from "../../data/documents";

describe("validateDoc", () => {
  it("fails the 3-way PO match and the limit on INV-4471", () => {
    const res = validateDoc(documentById("INV-4471")!, DEFAULT_RULEBOOK);
    expect(res.find((r) => r.ruleId === "inv_po_match")!.status).toBe("fail");
    expect(res.find((r) => r.ruleId === "inv_threshold")!.status).toBe("fail");
  });

  it("omits a disabled rule", () => {
    const rb = cloneRulebook(DEFAULT_RULEBOOK);
    rb["inv_po_match"].enabled = false;
    const res = validateDoc(documentById("INV-4471")!, rb);
    expect(res.find((r) => r.ruleId === "inv_po_match")).toBeUndefined();
  });

  it("passes every rule on a clean invoice", () => {
    const res = validateDoc(documentById("INV-4460")!, DEFAULT_RULEBOOK);
    expect(res.every((r) => r.status === "pass")).toBe(true);
  });

  it("respects an adjusted threshold", () => {
    const rb = cloneRulebook(DEFAULT_RULEBOOK);
    rb["inv_threshold"].threshold = 20000;
    const res = validateDoc(documentById("INV-4471")!, rb);
    expect(res.find((r) => r.ruleId === "inv_threshold")!.status).toBe("pass");
  });

  it("flags an over-per-diem expense", () => {
    const res = validateDoc(documentById("EXP-991")!, DEFAULT_RULEBOOK);
    expect(res.find((r) => r.ruleId === "hr_perdiem")!.status).toBe("fail");
  });
});
