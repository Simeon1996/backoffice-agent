import { describe, it, expect, beforeEach } from "vitest";
import { useManila, REVEAL_ALL } from "../store";
import { DEFAULT_RULEBOOK } from "../data/rulebook";

const reset = () =>
  useManila.setState({
    selectedDocId: null,
    reading: false,
    revealCount: 0,
    rulebook: structuredClone(DEFAULT_RULEBOOK),
    decisions: {},
    paletteOpen: false,
  });

describe("read playback", () => {
  beforeEach(reset);

  it("selectDoc resets the read", () => {
    useManila.getState().startRead();
    useManila.getState().selectDoc("INV-4471");
    expect(useManila.getState().selectedDocId).toBe("INV-4471");
    expect(useManila.getState().revealCount).toBe(0);
    expect(useManila.getState().reading).toBe(false);
  });

  it("startRead then revealNext advances", () => {
    useManila.getState().startRead();
    expect(useManila.getState().revealCount).toBe(1);
    useManila.getState().revealNext();
    expect(useManila.getState().revealCount).toBe(2);
  });

  it("revealAll jumps to the end and stops reading", () => {
    useManila.getState().startRead();
    useManila.getState().revealAll();
    expect(useManila.getState().revealCount).toBe(REVEAL_ALL);
    expect(useManila.getState().reading).toBe(false);
  });
});

describe("rulebook", () => {
  beforeEach(reset);

  it("toggleRule flips enabled without mutating DEFAULT_RULEBOOK", () => {
    useManila.getState().toggleRule("inv_po_match");
    expect(useManila.getState().rulebook.inv_po_match.enabled).toBe(false);
    expect(DEFAULT_RULEBOOK.inv_po_match.enabled).toBe(true);
  });

  it("setRuleThreshold updates the threshold", () => {
    useManila.getState().setRuleThreshold("inv_threshold", 20000);
    expect(useManila.getState().rulebook.inv_threshold.threshold).toBe(20000);
  });

  it("resetRulebook restores the deployed rulebook", () => {
    useManila.getState().toggleRule("inv_po_match");
    useManila.getState().resetRulebook();
    expect(useManila.getState().rulebook.inv_po_match.enabled).toBe(true);
  });
});

describe("decisions", () => {
  beforeEach(reset);

  it("records an approval", () => {
    useManila.getState().decide("INV-4471", "approved");
    expect(useManila.getState().decisions["INV-4471"]).toBe("approved");
  });
});
