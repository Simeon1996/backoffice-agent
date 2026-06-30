import { RULES } from "./docTypes";

export interface RuleState {
  enabled: boolean;
  threshold?: number;
}

export type Rulebook = Record<string, RuleState>;

// The deployed rulebook: every rule at its default, thresholds copied in.
export const DEFAULT_RULEBOOK: Rulebook = RULES.reduce((acc, r) => {
  acc[r.id] = { enabled: r.defaultEnabled, threshold: r.threshold };
  return acc;
}, {} as Rulebook);

export const cloneRulebook = (rb: Rulebook): Rulebook =>
  Object.keys(rb).reduce((acc, id) => {
    acc[id] = { ...rb[id] };
    return acc;
  }, {} as Rulebook);
