import type { Document } from "@/lib/data/types";
import { Invoice } from "./templates/Invoice";
import { PurchaseOrder } from "./templates/PurchaseOrder";
import { Contract } from "./templates/Contract";
import { Claim } from "./templates/Claim";
import { HRForm } from "./templates/HRForm";

/** Renders a document as paper, forwarding a ref to the paper root so the
 *  Workspace overlay can measure `[data-field]` rects against it. */
export function DocumentRenderer({
  doc,
  paperRef,
}: {
  doc: Document;
  paperRef?: React.Ref<HTMLDivElement>;
}) {
  switch (doc.type) {
    case "invoice":
      return <Invoice doc={doc} paperRef={paperRef} />;
    case "purchase_order":
      return <PurchaseOrder doc={doc} paperRef={paperRef} />;
    case "contract":
      return <Contract doc={doc} paperRef={paperRef} />;
    case "claim":
      return <Claim doc={doc} paperRef={paperRef} />;
    case "hr_form":
      return <HRForm doc={doc} paperRef={paperRef} />;
  }
}
