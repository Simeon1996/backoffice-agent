"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Inbox, ClipboardCheck, BookOpen, Layers, BarChart3, type LucideIcon } from "lucide-react";
import { Wordmark } from "./Wordmark";
import { cn } from "@/lib/utils";
import { useManila } from "@/lib/store";
import { DOCUMENTS } from "@/lib/data/documents";
import { pendingApprovals } from "@/lib/derive";

interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
  match: (p: string) => boolean;
}

const NAV: NavItem[] = [
  { href: "/", label: "Intake", icon: Inbox, match: (p) => p === "/" || p.startsWith("/doc") },
  { href: "/approvals", label: "Approvals", icon: ClipboardCheck, match: (p) => p.startsWith("/approvals") },
  { href: "/rules", label: "Rulebook", icon: BookOpen, match: (p) => p.startsWith("/rules") },
  { href: "/types", label: "Doc Types", icon: Layers, match: (p) => p.startsWith("/types") },
  { href: "/throughput", label: "Throughput", icon: BarChart3, match: (p) => p.startsWith("/throughput") },
];

export function Sidebar() {
  const pathname = usePathname();
  const rulebook = useManila((s) => s.rulebook);
  const decisions = useManila((s) => s.decisions);
  const pending = pendingApprovals(DOCUMENTS, rulebook, decisions).length;

  return (
    <aside className="flex h-dvh w-[236px] shrink-0 flex-col bg-[var(--color-ink)] text-[var(--color-ink-on)]">
      <div className="px-5 pb-5 pt-5">
        <Link href="/" className="inline-flex">
          <Wordmark onInk />
        </Link>
        <p className="mt-3 text-xs leading-relaxed text-[var(--color-ink-on-faint)]">
          Back-office document desk for{" "}
          <span className="text-[var(--color-ink-on-soft)]">Northwind</span>
        </p>
      </div>

      <nav className="flex flex-col gap-0.5 px-3">
        {NAV.map(({ href, label, icon: Icon, match }) => {
          const active = match(pathname);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                active
                  ? "bg-[var(--color-ink-700)] font-medium text-[var(--color-ink-on)]"
                  : "text-[var(--color-ink-on-soft)] hover:bg-[var(--color-ink-700)]/60 hover:text-[var(--color-ink-on)]",
              )}
            >
              <Icon size={17} strokeWidth={active ? 2.4 : 2} />
              <span className="flex-1">{label}</span>
              {href === "/approvals" && pending > 0 && (
                <span className="tabular rounded-full bg-[var(--color-stamp-red)] px-1.5 py-px font-mono text-[10px] font-semibold text-white">
                  {pending}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto px-5 pb-5 pt-4">
        <div className="rounded-lg border border-dashed border-[var(--color-ink-600)] px-3 py-2.5 text-[11px] leading-relaxed text-[var(--color-ink-on-faint)]">
          Simulated mailroom. No OCR, no uploads, no network — every document,
          field, and stamp here is fabricated.
        </div>
      </div>
    </aside>
  );
}
