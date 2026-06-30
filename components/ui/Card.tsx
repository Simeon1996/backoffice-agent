import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

export function Card({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <div
      className={cn(
        "rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-sheet)] shadow-[var(--shadow-card)]",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function CardHeader({
  title,
  hint,
  right,
}: {
  title: ReactNode;
  hint?: ReactNode;
  right?: ReactNode;
}) {
  return (
    <div className="flex items-start justify-between gap-3 border-b border-[var(--color-border)] px-5 py-3.5">
      <div className="min-w-0">
        <div className="text-[13px] font-semibold text-[var(--color-text)]">{title}</div>
        {hint && <div className="mt-0.5 text-xs text-[var(--color-muted)]">{hint}</div>}
      </div>
      {right}
    </div>
  );
}
