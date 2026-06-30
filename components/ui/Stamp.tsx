"use client";

import { motion } from "motion/react";
import { cn } from "@/lib/utils";

/**
 * An inked rubber stamp — Manila's signature. It thuds down rotated a few
 * degrees with a double-ruled, letterpress-ish border. Color carries meaning.
 */
export function Stamp({
  label,
  color,
  sub,
  size = "md",
  animate = true,
  className,
}: {
  label: string;
  color: string;
  sub?: string;
  size?: "sm" | "md" | "lg";
  animate?: boolean;
  className?: string;
}) {
  const pad = size === "sm" ? "px-2.5 py-1" : size === "lg" ? "px-6 py-3" : "px-4 py-2";
  const text = size === "sm" ? "text-[11px]" : size === "lg" ? "text-2xl" : "text-base";
  return (
    <motion.span
      initial={animate ? { scale: 1.55, opacity: 0, rotate: -1 } : false}
      animate={{ scale: 1, opacity: 0.92, rotate: -6 }}
      transition={{ type: "tween", ease: [0.2, 1.4, 0.4, 1], duration: 0.42 }}
      className={cn("inline-flex select-none flex-col items-center rounded-[5px] border-[3px] font-mono font-bold uppercase leading-none", pad, text, className)}
      style={{
        color,
        borderColor: color,
        boxShadow: `inset 0 0 0 1.5px ${color}`,
        letterSpacing: "0.08em",
        backgroundColor: "color-mix(in srgb, currentColor 6%, transparent)",
      }}
    >
      <span>{label}</span>
      {sub && <span className="mt-1 text-[9px] font-semibold tracking-wide opacity-80">{sub}</span>}
    </motion.span>
  );
}
