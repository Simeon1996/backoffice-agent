import type { RoutingKind, DocStatus, DocTypeId } from "./data/types";

export const ROUTING_META: Record<
  RoutingKind,
  { label: string; stamp: string; color: string; soft: string }
> = {
  auto_approve: { label: "Auto-filed", stamp: "AUTO-FILED", color: "var(--color-stamp-green)", soft: "var(--color-pass-soft)" },
  needs_review: { label: "Needs review", stamp: "NEEDS REVIEW", color: "var(--color-stamp-red)", soft: "var(--color-fail-soft)" },
  escalate: { label: "Routed up", stamp: "ROUTED", color: "var(--color-stamp-ink)", soft: "#e6ecf6" },
  reject: { label: "Rejected", stamp: "REJECTED", color: "var(--color-stamp-red)", soft: "var(--color-fail-soft)" },
};

export const STATUS_META: Record<DocStatus, { label: string; color: string; soft: string }> = {
  queued: { label: "Queued", color: "var(--color-muted)", soft: "var(--color-paper-deep)" },
  auto_filed: { label: "Auto-filed", color: "var(--color-stamp-green)", soft: "var(--color-pass-soft)" },
  needs_review: { label: "Needs review", color: "var(--color-stamp-red)", soft: "var(--color-fail-soft)" },
  approved: { label: "Approved", color: "var(--color-stamp-green)", soft: "var(--color-pass-soft)" },
  rejected: { label: "Rejected", color: "var(--color-stamp-red)", soft: "var(--color-fail-soft)" },
};

export const DOC_TYPE_TINT: Record<DocTypeId, string> = {
  invoice: "var(--color-t-invoice)",
  purchase_order: "var(--color-t-po)",
  contract: "var(--color-t-contract)",
  claim: "var(--color-t-claim)",
  hr_form: "var(--color-t-hr)",
};
