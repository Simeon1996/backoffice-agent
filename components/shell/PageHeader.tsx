import type { ReactNode } from "react";

export function PageHeader({
  title,
  subtitle,
  right,
}: {
  title: string;
  subtitle?: ReactNode;
  right?: ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-3">
      <div>
        <h1 className="font-serif text-[26px] font-semibold tracking-tight text-[var(--color-text)]">{title}</h1>
        {subtitle && <p className="mt-1 max-w-2xl text-[13px] text-[var(--color-muted)]">{subtitle}</p>}
      </div>
      {right}
    </div>
  );
}
