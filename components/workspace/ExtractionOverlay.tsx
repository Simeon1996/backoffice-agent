"use client";

import { useLayoutEffect, useState, type RefObject } from "react";
import { AnimatePresence, motion } from "motion/react";
import type { Document } from "@/lib/data/types";
import { fmtConfidence } from "@/lib/time";
import { docTypeById } from "@/lib/data/docTypes";

interface Rect { x: number; y: number; w: number; h: number }

/**
 * Draws animated extraction boxes over the real positions of `[data-field]`
 * elements inside the paper. Measures element rects relative to the container,
 * so boxes track the actual rendered text (no hardcoded coordinates).
 */
export function ExtractionOverlay({
  containerRef,
  doc,
  revealedIds,
  activeId,
}: {
  containerRef: RefObject<HTMLDivElement | null>;
  doc: Document;
  revealedIds: string[];
  activeId: string | null;
}) {
  const [rects, setRects] = useState<Record<string, Rect>>({});

  useLayoutEffect(() => {
    const cont = containerRef.current;
    if (!cont) return;
    const measure = () => {
      const base = cont.getBoundingClientRect();
      const map: Record<string, Rect> = {};
      cont.querySelectorAll<HTMLElement>("[data-field]").forEach((el) => {
        const id = el.getAttribute("data-field");
        if (!id) return;
        const r = el.getBoundingClientRect();
        map[id] = { x: r.left - base.left, y: r.top - base.top, w: r.width, h: r.height };
      });
      setRects(map);
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(cont);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [containerRef, doc.id]);

  const fieldLabel = (id: string) => docTypeById(doc.type)?.fields.find((f) => f.id === id)?.label ?? id;
  const confOf = (id: string) => doc.fields.find((f) => f.id === id)?.confidence ?? 1;

  const PAD = 3;
  return (
    <div className="pointer-events-none absolute inset-0 z-10">
      <AnimatePresence>
        {revealedIds.map((id) => {
          const r = rects[id];
          if (!r) return null;
          const active = id === activeId;
          const low = confOf(id) < 0.85;
          const color = low ? "var(--color-warn)" : "var(--color-accent)";
          return (
            <motion.div
              key={id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
              className="absolute rounded-[3px]"
              style={{
                left: r.x - PAD,
                top: r.y - PAD,
                width: r.w + PAD * 2,
                height: r.h + PAD * 2,
                border: `1.5px solid ${color}`,
                background: active ? "color-mix(in srgb, var(--color-accent) 9%, transparent)" : "transparent",
                boxShadow: active ? `0 0 0 3px color-mix(in srgb, ${color} 16%, transparent)` : "none",
              }}
            >
              {active && (
                <motion.span
                  initial={{ opacity: 0, y: 3 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute -top-5 left-0 inline-flex items-center gap-1.5 whitespace-nowrap rounded-[3px] px-1.5 py-0.5 font-mono text-[9px] font-semibold uppercase tracking-wide text-white"
                  style={{ background: color }}
                >
                  {fieldLabel(id)} · {fmtConfidence(confOf(id))}
                </motion.span>
              )}
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
