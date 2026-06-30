import { WorkspaceView } from "@/components/workspace/WorkspaceView";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <WorkspaceView docId={id} />;
}
