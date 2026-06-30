import { DocumentRenderer } from "@/components/docs/DocumentRenderer";
import { Stamp } from "@/components/ui/Stamp";
import { documentById } from "@/lib/data/documents";

export default function Page() {
  const doc = documentById("INV-4471")!;
  return (
    <div className="p-10">
      <div className="relative">
        <DocumentRenderer doc={doc} />
        <div className="absolute right-16 top-24">
          <Stamp label="NEEDS REVIEW" color="var(--color-stamp-red)" size="lg" />
        </div>
      </div>
    </div>
  );
}
