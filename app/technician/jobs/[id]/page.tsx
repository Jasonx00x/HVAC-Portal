import { TechnicianMobileWorkspace } from "@/components/technician-mobile-workspace";

export default async function TechnicianJobDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <TechnicianMobileWorkspace jobId={id} mode="detail" />;
}
