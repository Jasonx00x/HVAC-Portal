import Link from "next/link";
import { Card } from "@/components/ui";

export function DetailPlaceholder({ module, backHref }: { module: string; backHref: string }) {
  return (
    <Card className="p-5">
      <h3 className="text-lg font-semibold">{module} detail page</h3>
      <p className="mt-2 text-sm text-muted">This route is ready for record-specific tabs, activity logs, documents, photos, invoices, materials, labor, and profit details.</p>
      <Link className="mt-5 inline-flex rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white" href={backHref}>Back to {module}</Link>
    </Card>
  );
}
