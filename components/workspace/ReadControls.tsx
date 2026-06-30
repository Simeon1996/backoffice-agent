"use client";

import { Play, StepForward, FastForward, RotateCcw } from "lucide-react";

export function ReadControls({
  started,
  complete,
  onRead,
  onStep,
  onAll,
  onReset,
}: {
  started: boolean;
  complete: boolean;
  onRead: () => void;
  onStep: () => void;
  onAll: () => void;
  onReset: () => void;
}) {
  if (!started) {
    return (
      <button
        onClick={onRead}
        className="inline-flex items-center gap-2 rounded-lg bg-[var(--color-accent)] px-4 py-2 text-[13px] font-medium text-white hover:bg-[var(--color-accent-ink)]"
      >
        <Play size={15} /> Read document
      </button>
    );
  }
  return (
    <div className="flex items-center gap-2">
      {!complete && (
        <>
          <button onClick={onStep} className="inline-flex items-center gap-1.5 rounded-lg border border-[var(--color-border-strong)] bg-[var(--color-sheet)] px-3 py-2 text-[13px] font-medium text-[var(--color-text-soft)] hover:bg-[var(--color-paper-deep)]">
            <StepForward size={14} /> Step
          </button>
          <button onClick={onAll} className="inline-flex items-center gap-1.5 rounded-lg border border-[var(--color-border-strong)] bg-[var(--color-sheet)] px-3 py-2 text-[13px] font-medium text-[var(--color-text-soft)] hover:bg-[var(--color-paper-deep)]">
            <FastForward size={14} /> Skip to end
          </button>
        </>
      )}
      <button onClick={onReset} className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-[13px] text-[var(--color-muted)] hover:bg-[var(--color-paper-deep)]">
        <RotateCcw size={14} /> Replay
      </button>
    </div>
  );
}
