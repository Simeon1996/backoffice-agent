"use client";

import { Command } from "cmdk";
import { useRouter } from "next/navigation";
import { Inbox, ClipboardCheck, BookOpen, Layers, BarChart3 } from "lucide-react";
import { useManila } from "@/lib/store";
import { DOCUMENTS } from "@/lib/data/documents";
import { docTypeById } from "@/lib/data/docTypes";

const NAV = [
  { href: "/", label: "Intake", icon: Inbox },
  { href: "/approvals", label: "Approvals", icon: ClipboardCheck },
  { href: "/rules", label: "Rulebook", icon: BookOpen },
  { href: "/types", label: "Doc Types", icon: Layers },
  { href: "/throughput", label: "Throughput", icon: BarChart3 },
];

export function CommandPalette() {
  const router = useRouter();
  const open = useManila((s) => s.paletteOpen);
  const setOpen = useManila((s) => s.setPaletteOpen);

  const go = (href: string) => {
    setOpen(false);
    router.push(href);
  };

  return (
    <Command.Dialog open={open} onOpenChange={setOpen} label="Command menu" className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-[rgba(28,26,23,0.34)] backdrop-blur-[2px]" onClick={() => setOpen(false)} />
      <div className="absolute left-1/2 top-[16vh] w-[min(560px,92vw)] -translate-x-1/2 overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-sheet)] shadow-[var(--shadow-pop)]">
        <Command.Input
          autoFocus
          placeholder="Search documents and surfaces…"
          className="w-full border-b border-[var(--color-border)] bg-transparent px-4 py-3.5 text-sm outline-none placeholder:text-[var(--color-faint)]"
        />
        <Command.List className="scrollbar-thin max-h-[54vh] overflow-y-auto p-2">
          <Command.Empty className="px-3 py-6 text-center text-sm text-[var(--color-muted)]">Nothing matches.</Command.Empty>

          <Command.Group heading="Go to" className="px-1 text-[11px] font-medium text-[var(--color-faint)]">
            {NAV.map(({ href, label, icon: Icon }) => (
              <Item key={href} onSelect={() => go(href)}>
                <Icon size={15} className="text-[var(--color-muted)]" />
                {label}
              </Item>
            ))}
          </Command.Group>

          <Command.Group heading="Documents" className="px-1 text-[11px] font-medium text-[var(--color-faint)]">
            {DOCUMENTS.map((d) => (
              <Item key={d.id} value={`${d.id} ${d.title} ${d.type}`} onSelect={() => go(`/doc/${d.id}`)}>
                <span className="font-mono text-[11px] text-[var(--color-faint)]">{d.id}</span>
                <span className="truncate">{d.title}</span>
                <span className="ml-auto text-[11px] text-[var(--color-faint)]">{docTypeById(d.type)?.label}</span>
              </Item>
            ))}
          </Command.Group>
        </Command.List>
      </div>
    </Command.Dialog>
  );
}

function Item({ children, onSelect, value }: { children: React.ReactNode; onSelect: () => void; value?: string }) {
  return (
    <Command.Item
      value={value}
      onSelect={onSelect}
      className="flex cursor-pointer items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-[var(--color-text-soft)] data-[selected=true]:bg-[var(--color-paper-deep)] data-[selected=true]:text-[var(--color-text)]"
    >
      {children}
    </Command.Item>
  );
}
