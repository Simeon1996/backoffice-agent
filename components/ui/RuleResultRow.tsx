import { Check, AlertTriangle, X, type LucideIcon } from "lucide-react";
import type { RuleStatus } from "@/lib/data/types";
import type { RuleResult } from "@/lib/engine/validate";
import { cn } from "@/lib/utils";

const META: Record<RuleStatus, { icon: LucideIcon; color: string; soft: string }> = {
  pass: { icon: Check, color: "var(--color-pass)", soft: "var(--color-pass-soft)" },
  warn: { icon: AlertTriangle, color: "var(--color-warn)", soft: "var(--color-warn-soft)" },
  fail: { icon: X, color: "var(--color-fail)", soft: "var(--color-fail-soft)" },
};

export function RuleResultRow({ result, className }: { result: RuleResult; className?: string }) {
  const m = META[result.status];
  const Icon = m.icon;
  return (
    <div className={cn("flex items-start gap-2.5 py-2", className)}>
      <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full" style={{ background: m.soft, color: m.color }}>
        <Icon size={12} strokeWidth={3} />
      </span>
      <div className="min-w-0">
        <div className="text-[12.5px] font-medium text-[var(--color-text)]">{result.name}</div>
        {result.message && <div className="text-[11.5px] leading-snug text-[var(--color-muted)]">{result.message}</div>}
      </div>
    </div>
  );
}
