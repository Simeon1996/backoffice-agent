import { Receipt, ShoppingCart, FileSignature, ShieldQuestion, UserRound, type LucideIcon } from "lucide-react";
import type { DocTypeId } from "@/lib/data/types";
import { DOC_TYPE_TINT } from "@/lib/display";
import { cn } from "@/lib/utils";

const ICON: Record<DocTypeId, LucideIcon> = {
  invoice: Receipt,
  purchase_order: ShoppingCart,
  contract: FileSignature,
  claim: ShieldQuestion,
  hr_form: UserRound,
};

export function DocTypeIcon({
  type,
  size = 32,
  className,
}: {
  type: DocTypeId;
  size?: number;
  className?: string;
}) {
  const Icon = ICON[type];
  const tint = DOC_TYPE_TINT[type];
  return (
    <span
      className={cn("inline-flex shrink-0 items-center justify-center rounded-[8px]", className)}
      style={{ width: size, height: size, background: `color-mix(in srgb, ${tint} 12%, transparent)`, color: tint }}
    >
      <Icon size={size * 0.5} strokeWidth={2} />
    </span>
  );
}
