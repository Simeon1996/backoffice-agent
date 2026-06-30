import { describe, it, expect } from "vitest";
import { routeDoc } from "../route";
import { validateDoc } from "../validate";
import { DEFAULT_RULEBOOK, cloneRulebook, type Rulebook } from "../../data/rulebook";
import { documentById } from "../../data/documents";

const decide = (id: string, rb: Rulebook = DEFAULT_RULEBOOK) => {
  const d = documentById(id)!;
  return routeDoc(d, validateDoc(d, rb), rb);
};

describe("routeDoc", () => {
  it("routes INV-4471 to review under the deployed rulebook", () => {
    const r = decide("INV-4471");
    expect(r.kind).toBe("needs_review");
    expect(r.queue).toBe("AP Manager");
    expect(r.stamp).toBe("NEEDS REVIEW");
  });

  it("auto-files INV-4471 once PO match and the limit are disabled (counterfactual)", () => {
    const rb = cloneRulebook(DEFAULT_RULEBOOK);
    rb["inv_po_match"].enabled = false;
    rb["inv_threshold"].enabled = false;
    expect(decide("INV-4471", rb).kind).toBe("auto_approve");
  });

  it("auto-files a clean invoice", () => {
    expect(decide("INV-4460").kind).toBe("auto_approve");
  });

  it("escalates a large but clean purchase order", () => {
    expect(decide("PO-7782").kind).toBe("escalate");
  });

  it("rejects a claim over its coverage limit", () => {
    const r = decide("CLM-5567");
    expect(r.kind).toBe("reject");
    expect(r.stamp).toBe("REJECTED");
  });

  it("sends an unsigned contract to Legal for review", () => {
    const r = decide("NDA-228");
    expect(r.kind).toBe("needs_review");
    expect(r.queue).toBe("Legal");
  });
});
