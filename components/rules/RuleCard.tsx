"use client";

import { useManila } from "@/lib/store";
import type { RuleDef } from "@/lib/data/types";
import { Switch } from "@/components/ui/Switch";
import { fmtMoney } from "@/lib/time";
import { cn } from "@/lib/utils";

export function RuleCard({ rule }: { rule: RuleDef }) {
  const state = useManila((s) => s.rulebook[rule.id]);
  const toggle = useManila((s) => s.toggleRule);
  const setThreshold = useManila((s) => s.setRuleThreshold);

  return (
    <div className={cn("rounded-[10px] border border-[var(--color-border)] bg-[var(--color-sheet)] p-4 transition-opacity", !state.enabled && "opacity-55")}>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-[13px] font-semibold text-[var(--color-text)]">{rule.name}</span>
            <span
              className="rounded-full px-1.5 py-px text-[9px] font-semibold uppercase tracking-wide"
              style={
                rule.severity === "fail"
                  ? { color: "var(--color-fail)", background: "var(--color-fail-soft)" }
                  : { color: "var(--color-warn)", background: "var(--color-warn-soft)" }
              }
            >
              {rule.severity === "fail" ? "Blocks" : "Advisory"}
            </span>
          </div>
          <p className="mt-1 text-[12px] leading-relaxed text-[var(--color-muted)]">{rule.explain}</p>
        </div>
        <Switch checked={state.enabled} onChange={() => toggle(rule.id)} label={rule.name} />
      </div>

      {rule.threshold != null && state.enabled && (
        <div className="mt-3 border-t border-[var(--color-border)] pt-3">
          <div className="mb-1.5 flex items-center justify-between text-[11px]">
            <span className="text-[var(--color-muted)]">Limit</span>
            <span className="tabular font-mono font-semibold text-[var(--color-text)]">{fmtMoney(state.threshold ?? rule.threshold)}</span>
          </div>
          <input
            type="range"
            min={rule.id === "hr_perdiem" ? 200 : 500}
            max={rule.id === "hr_perdiem" ? 3000 : 20000}
            step={rule.id === "hr_perdiem" ? 100 : 500}
            value={state.threshold ?? rule.threshold}
            onChange={(e) => setThreshold(rule.id, Number(e.target.value))}
            className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-[var(--color-paper-deep)] outline-none [&::-webkit-slider-thumb]:h-3.5 [&::-webkit-slider-thumb]:w-3.5 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[var(--color-accent)]"
          />
        </div>
      )}
    </div>
  );
}
