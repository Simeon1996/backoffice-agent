"use client";

import { useEffect, type ReactNode } from "react";
import { useManila } from "@/lib/store";
import { CommandPalette } from "@/components/CommandPalette";

export function Providers({ children }: { children: ReactNode }) {
  const setPaletteOpen = useManila((s) => s.setPaletteOpen);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setPaletteOpen(!useManila.getState().paletteOpen);
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [setPaletteOpen]);

  return (
    <>
      {children}
      <CommandPalette />
    </>
  );
}
