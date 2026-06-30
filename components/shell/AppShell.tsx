import type { ReactNode } from "react";
import { Sidebar } from "./Sidebar";
import { TopRail } from "./TopRail";

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-dvh overflow-hidden">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col bg-[var(--color-paper)]">
        <TopRail />
        <main className="paper-grain scrollbar-thin flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
