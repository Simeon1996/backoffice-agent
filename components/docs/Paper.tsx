import { forwardRef, type ReactNode } from "react";
import { cn } from "@/lib/utils";

/** A document sheet — warm paper, letterpress feel, soft drop shadow. */
export const Paper = forwardRef<HTMLDivElement, { children: ReactNode; className?: string }>(
  function Paper({ children, className }, ref) {
    return (
      <div
        ref={ref}
        className={cn(
          "relative mx-auto w-full max-w-[640px] rounded-[3px] bg-[var(--color-sheet)] px-10 py-9 text-[var(--color-text)] shadow-[var(--shadow-paper)]",
          className,
        )}
        style={{ borderTop: "3px solid var(--color-ink)" }}
      >
        {children}
      </div>
    );
  },
);

export function PaperHeader({ kicker, title, meta }: { kicker: string; title: string; meta?: ReactNode }) {
  return (
    <div className="mb-6 flex items-start justify-between gap-6 border-b border-[var(--color-sheet-line)] pb-5">
      <div>
        <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--color-muted)]">{kicker}</div>
        <h2 className="font-serif text-3xl font-semibold leading-tight tracking-tight">{title}</h2>
      </div>
      {meta && <div className="text-right text-[12px] leading-relaxed text-[var(--color-text-soft)]">{meta}</div>}
    </div>
  );
}

/** A label/value row used across templates. */
export function MetaRow({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex items-baseline justify-between gap-4 py-0.5">
      <span className="text-[11px] uppercase tracking-wide text-[var(--color-faint)]">{label}</span>
      <span className="font-mono text-[12px] text-[var(--color-text)]">{children}</span>
    </div>
  );
}
