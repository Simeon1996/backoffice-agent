import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

/** An extractable value on the paper. The Workspace overlay finds these by
 *  `data-field` and measures their real rect to draw an extraction box. */
export function Field({
  id,
  children,
  className,
}: {
  id: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <span data-field={id} className={cn("rounded-[3px]", className)}>
      {children}
    </span>
  );
}
