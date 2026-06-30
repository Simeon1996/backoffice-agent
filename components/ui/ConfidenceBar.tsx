"use client";

import { motion } from "motion/react";
import { fmtConfidence } from "@/lib/time";
import { cn } from "@/lib/utils";

const LOW = 0.85;

/** A small confidence read-out; low confidence (<85%) is flagged amber. */
export function ConfidenceBar({ value, className }: { value: number; className?: string }) {
  const low = value < LOW;
  const color = low ? "var(--color-warn)" : "var(--color-pass)";
  return (
    <span className={cn("inline-flex items-center gap-1.5", className)}>
      <span className="relative h-1.5 w-10 overflow-hidden rounded-full bg-[var(--color-paper-deep)]">
        <motion.span
          className="absolute inset-y-0 left-0 rounded-full"
          style={{ background: color }}
          initial={false}
          animate={{ width: `${Math.round(value * 100)}%` }}
          transition={{ type: "spring", stiffness: 160, damping: 22 }}
        />
      </span>
      <span className="tabular font-mono text-[10px] font-semibold" style={{ color: low ? "var(--color-warn)" : "var(--color-muted)" }}>
        {fmtConfidence(value)}
      </span>
    </span>
  );
}
