import { DOC_TYPES } from "@/lib/data/docTypes";
import { PageHeader } from "@/components/shell/PageHeader";
import { TypeCard } from "./TypeCard";

export function DocTypesView() {
  return (
    <div className="mx-auto max-w-[1100px] space-y-5 p-6 lg:p-8">
      <PageHeader
        title="Doc Types"
        subtitle="The document types Manila recognizes, the fields it extracts from each, and how confidently it tells them apart."
      />
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {DOC_TYPES.map((t) => (
          <TypeCard key={t.id} def={t} />
        ))}
      </div>
    </div>
  );
}
