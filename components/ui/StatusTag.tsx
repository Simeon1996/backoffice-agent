import type { DocStatus } from "@/lib/data/types";
import { STATUS_META } from "@/lib/display";
import { cn } from "@/lib/utils";

export function StatusTag({ status, className }: { status: DocStatus; className?: string }) {
  const m = STATUS_META[status];
  return (
    <span
      className={cn("inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[11px] font-medium", className)}
      style={{ color: m.color, background: m.soft }}
    >
      <span className="h-1.5 w-1.5 rounded-full" style={{ background: m.color }} />
      {m.label}
    </span>
  );
}
