import { Camera, CheckCircle2, Clock, FilePenLine, LogIn, LogOut, PackagePlus } from "lucide-react";
import { technicianJobs } from "@/lib/mock-data";
import { Badge, Card } from "@/components/ui";

const actions = [
  { label: "Stamp in", icon: LogIn },
  { label: "Stamp out", icon: LogOut },
  { label: "Diagnosis", icon: FilePenLine },
  { label: "Photo", icon: Camera },
  { label: "Material", icon: PackagePlus },
  { label: "Complete", icon: CheckCircle2 }
];

export function TechnicianMobile() {
  return (
    <Card className="overflow-hidden">
      <div className="border-b border-border bg-slate-900 px-4 py-4 text-white">
        <p className="text-xs font-bold uppercase tracking-wide text-cyan-200">Technician view</p>
        <h2 className="mt-1 text-lg font-semibold">Today&apos;s jobs</h2>
        <p className="mt-1 text-xs text-slate-300">Clock in, take photos, write the report, clock out.</p>
      </div>
      <div className="space-y-4 p-4">
        {technicianJobs.map((job) => (
          <article className="rounded-lg border border-border p-4" key={job.jobNumber}>
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-bold">{job.jobNumber}</p>
                <p className="mt-1 text-sm text-muted">{job.address}</p>
              </div>
              <Badge tone={job.status.includes("Waiting") ? "warning" : "info"}>{job.status}</Badge>
            </div>
            <div className="mt-4 space-y-2 text-sm">
              <p>
                <span className="font-semibold">Unit:</span> {job.unit}
              </p>
              <p>
                <span className="font-semibold">Issue:</span> {job.issue}
              </p>
              <p>
                <span className="font-semibold">Equipment:</span> {job.equipment}
              </p>
              <p className="rounded-md bg-slate-50 p-2 text-muted">{job.propertyNotes}</p>
            </div>
            <div className="mt-4 grid grid-cols-3 gap-2">
              {actions.map((action) => {
                const Icon = action.icon;
                return (
                  <button className="flex h-16 flex-col items-center justify-center gap-1 rounded-md border border-border text-xs font-semibold hover:bg-slate-50" key={action.label} type="button">
                    <Icon className="h-4 w-4" />
                    {action.label}
                  </button>
                );
              })}
            </div>
            <div className="mt-4 rounded-md border border-dashed border-border p-3 text-sm">
              <p className="font-semibold">Required before closing</p>
              <div className="mt-2 grid grid-cols-2 gap-2 text-xs text-muted">
                <span className="inline-flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> Time stamped</span>
                <span className="inline-flex items-center gap-1"><Camera className="h-3.5 w-3.5" /> Photos added</span>
                <span className="inline-flex items-center gap-1"><FilePenLine className="h-3.5 w-3.5" /> Diagnosis report</span>
                <span className="inline-flex items-center gap-1"><PackagePlus className="h-3.5 w-3.5" /> Materials logged</span>
              </div>
            </div>
          </article>
        ))}
      </div>
      <div className="grid grid-cols-5 border-t border-border bg-white text-xs font-semibold">
        {["Today", "Jobs", "Add", "Hours", "Profile"].map((item, index) => (
          <button className={`py-3 ${index === 0 ? "text-primary" : "text-muted"}`} key={item} type="button">
            {item}
          </button>
        ))}
      </div>
    </Card>
  );
}
