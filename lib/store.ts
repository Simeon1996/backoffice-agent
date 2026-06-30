import { create } from "zustand";
import { DEFAULT_RULEBOOK, cloneRulebook, type Rulebook } from "./data/rulebook";

export type Decision = "approved" | "rejected";

interface ManilaState {
  // workspace read playback
  selectedDocId: string | null;
  reading: boolean;
  revealCount: number; // number of read steps revealed (0 = nothing)

  // working rulebook (DEFAULT_RULEBOOK is the deployed record)
  rulebook: Rulebook;

  // human decisions in the approvals queue
  decisions: Record<string, Decision>;

  // command palette
  paletteOpen: boolean;

  // actions
  selectDoc: (id: string | null) => void;
  startRead: () => void;
  revealNext: () => void;
  revealAll: () => void;
  resetRead: () => void;

  toggleRule: (id: string) => void;
  setRuleThreshold: (id: string, threshold: number) => void;
  resetRulebook: () => void;

  decide: (id: string, decision: Decision) => void;

  setPaletteOpen: (open: boolean) => void;
}

const REVEAL_ALL = 999;

export const useManila = create<ManilaState>((set) => ({
  selectedDocId: null,
  reading: false,
  revealCount: 0,
  rulebook: cloneRulebook(DEFAULT_RULEBOOK),
  decisions: {},
  paletteOpen: false,

  selectDoc: (id) => set({ selectedDocId: id, reading: false, revealCount: 0 }),
  startRead: () => set({ reading: true, revealCount: 1 }),
  revealNext: () => set((s) => ({ revealCount: s.revealCount + 1 })),
  revealAll: () => set({ revealCount: REVEAL_ALL, reading: false }),
  resetRead: () => set({ reading: false, revealCount: 0 }),

  toggleRule: (id) =>
    set((s) => {
      const rulebook = cloneRulebook(s.rulebook);
      if (rulebook[id]) rulebook[id].enabled = !rulebook[id].enabled;
      return { rulebook };
    }),
  setRuleThreshold: (id, threshold) =>
    set((s) => {
      const rulebook = cloneRulebook(s.rulebook);
      if (rulebook[id]) rulebook[id].threshold = threshold;
      return { rulebook };
    }),
  resetRulebook: () => set({ rulebook: cloneRulebook(DEFAULT_RULEBOOK) }),

  decide: (id, decision) => set((s) => ({ decisions: { ...s.decisions, [id]: decision } })),

  setPaletteOpen: (open) => set({ paletteOpen: open }),
}));

export { REVEAL_ALL };
