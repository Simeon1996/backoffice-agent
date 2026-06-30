"use client";

import { useEffect, useMemo, useRef } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useManila, REVEAL_ALL } from "@/lib/store";
import { documentById } from "@/lib/data/documents";
import { docTypeById } from "@/lib/data/docTypes";
import { personById } from "@/lib/data/people";
import { classify } from "@/lib/engine/classify";
import { routingFor, effectiveStatus } from "@/lib/derive";
import { fmtClock, fmtConfidence } from "@/lib/time";
import { ROUTING_META } from "@/lib/display";
import { Card, CardHeader } from "@/components/ui/Card";
import { DocTypeIcon } from "@/components/ui/DocTypeIcon";
import { StatusTag } from "@/components/ui/StatusTag";
import { Stamp } from "@/components/ui/Stamp";
import { DocumentRenderer } from "@/components/docs/DocumentRenderer";
import { ExtractionOverlay } from "./ExtractionOverlay";
import { FieldsPanel } from "./FieldsPanel";
import { ValidationPanel } from "./ValidationPanel";
import { RoutingPanel } from "./RoutingPanel";
import { ReadControls } from "./ReadControls";

const STEP_MS = 520;

export function WorkspaceView({ docId }: { docId: string }) {
  const doc = documentById(docId);
  const rulebook = useManila((s) => s.rulebook);
  const decisions = useManila((s) => s.decisions);
  const reading = useManila((s) => s.reading);
  const revealCount = useManila((s) => s.revealCount);
  const selectDoc = useManila((s) => s.selectDoc);
  const startRead = useManila((s) => s.startRead);
  const revealNext = useManila((s) => s.revealNext);
  const revealAll = useManila((s) => s.revealAll);
  const resetRead = useManila((s) => s.resetRead);

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    selectDoc(docId);
  }, [docId, selectDoc]);

  const total = (doc?.fields.length ?? 0) + 3;

  // auto-advance the read while playing
  useEffect(() => {
    if (!reading) return;
    if (revealCount >= total) {
      useManila.setState({ reading: false });
      return;
    }
    const t = setTimeout(() => revealNext(), STEP_MS);
    return () => clearTimeout(t);
  }, [reading, revealCount, total, revealNext]);

  const view = useMemo(() => {
    if (!doc) return null;
    const fieldsShown = Math.max(0, Math.min(doc.fields.length, revealCount - 1));
    const revealedIds = doc.fields.slice(0, fieldsShown).map((f) => f.id);
    const validateShown = revealCount >= doc.fields.length + 2;
    const routeShown = revealCount >= doc.fields.length + 3;
    const activeId = fieldsShown > 0 && !validateShown ? revealedIds[revealedIds.length - 1] : null;
    return {
      classifyShown: revealCount >= 1,
      revealedIds,
      activeId,
      validateShown,
      routeShown,
      complete: revealCount >= total || revealCount >= REVEAL_ALL,
    };
  }, [doc, revealCount, total]);

  if (!doc || !view) {
    return (
      <div className="p-8 text-sm text-[var(--color-muted)]">
        No document <code className="font-mono">{docId}</code>.{" "}
        <Link href="/" className="text-[var(--color-accent)]">Back to intake</Link>
      </div>
    );
  }

  const type = docTypeById(doc.type);
  const sender = personById(doc.sender);
  const klass = classify(doc);
  const { results, decision } = routingFor(doc, rulebook);
  const status = effectiveStatus(doc, rulebook, decisions);
  const human = decisions[doc.id];

  const stampLabel = human ? (human === "approved" ? "APPROVED" : "REJECTED") : decision.stamp;
  const stampColor = human
    ? human === "approved"
      ? "var(--color-stamp-green)"
      : "var(--color-stamp-red)"
    : ROUTING_META[decision.kind].color;

  return (
    <div className="mx-auto max-w-[1180px] p-6 lg:p-8">
      {/* header */}
      <div className="mb-5">
        <Link href="/" className="inline-flex items-center gap-1.5 text-[13px] text-[var(--color-muted)] hover:text-[var(--color-text-soft)]">
          <ArrowLeft size={14} /> Intake
        </Link>
        <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <DocTypeIcon type={doc.type} size={40} />
            <div>
              <h1 className="font-serif text-[22px] font-semibold leading-tight tracking-tight">{doc.title}</h1>
              <div className="text-[12px] text-[var(--color-muted)]">
                {type?.label} · {sender?.name} · received {fmtClock(doc.receivedAt)} · <span className="font-mono">{doc.id}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <StatusTag status={status} />
            <ReadControls
              started={revealCount > 0}
              complete={view.complete}
              onRead={startRead}
              onStep={revealNext}
              onAll={revealAll}
              onReset={resetRead}
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_400px]">
        {/* paper + overlay + stamp */}
        <div className="lg:sticky lg:top-5 lg:self-start">
          <div ref={containerRef} className="relative">
            <DocumentRenderer doc={doc} />
            <ExtractionOverlay containerRef={containerRef} doc={doc} revealedIds={view.revealedIds} activeId={view.activeId} />
            {view.routeShown && (
              <div className="absolute right-8 top-20 z-20">
                <Stamp key={stampLabel} label={stampLabel} color={stampColor} size="lg" />
              </div>
            )}
          </div>
        </div>

        {/* the agent's work */}
        <div className="space-y-4">
          <Card>
            <CardHeader title="Classification" hint={view.classifyShown ? "Identified" : "Pending"} />
            <div className="px-5 py-4">
              {view.classifyShown ? (
                <>
                  <div className="flex items-baseline justify-between">
                    <span className="font-serif text-lg font-semibold">{type?.label}</span>
                    <span className="tabular font-mono text-[13px] font-semibold text-[var(--color-accent)]">{fmtConfidence(klass.confidence)}</span>
                  </div>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {klass.alternatives.map((a) => (
                      <span key={a.type} className="rounded-full bg-[var(--color-paper-deep)] px-2 py-0.5 font-mono text-[10px] text-[var(--color-muted)]">
                        {docTypeById(a.type)?.label} {fmtConfidence(a.score)}
                      </span>
                    ))}
                  </div>
                </>
              ) : (
                <div className="py-2 text-center text-[12px] text-[var(--color-muted)]">Press Read to classify this document.</div>
              )}
            </div>
          </Card>

          <FieldsPanel doc={doc} revealedIds={view.revealedIds} activeId={view.activeId} />
          <ValidationPanel results={results} shown={view.validateShown} />
          <RoutingPanel decision={decision} shown={view.routeShown} />
        </div>
      </div>
    </div>
  );
}
