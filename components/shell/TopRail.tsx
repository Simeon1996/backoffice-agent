"use client";

import { Command, Stamp as StampIcon } from "lucide-react";
import { useManila } from "@/lib/store";
import { DOCUMENTS } from "@/lib/data/documents";
import { pendingApprovals } from "@/lib/derive";

export function TopRail() {
  const setPaletteOpen = useManila((s) => s.setPaletteOpen);
  const rulebook = useManila((s) => s.rulebook);
  const decisions = useManila((s) => s.decisions);
  const pending = pendingApprovals(DOCUMENTS, rulebook, decisions).length;

  return (
    <header className="sticky top-0 z-20 flex h-14 items-center gap-4 border-b border-[var(--color-border)] bg-[color-mix(in_srgb,var(--color-paper)_88%,transparent)] px-6 backdrop-blur-md">
      <span className="inline-flex items-center gap-2 text-[13px] text-[var(--color-text-soft)]">
        <StampIcon size={15} className="text-[var(--color-muted)]" />
        Northwind mailroom
      </span>

      <div className="ml-auto flex items-center gap-2.5">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--color-paper-deep)] px-2.5 py-1 text-[11px] text-[var(--color-text-soft)]">
          <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-stamp-red)]" />
          {pending} awaiting a human
        </span>
        <button
          onClick={() => setPaletteOpen(true)}
          className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-[var(--color-border-strong)] bg-[var(--color-sheet)] px-2.5 text-xs text-[var(--color-muted)] hover:bg-[var(--color-paper-deep)]"
        >
          <Command size={13} />K
        </button>
      </div>
    </header>
  );
}
