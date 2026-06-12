"use client";

import { useEffect, useState } from "react";
import { Camera, CheckCircle2, Clock, FilePenLine, PackagePlus } from "lucide-react";
import { Badge, Card } from "@/components/ui";

type Job = {
  id: string;
  jobNumber: string;
  unit: string;
  serviceType: string;
  technician: string;
  status: string;
  diagnosis: string;
  materials: string;
  photos: number;
};

type Workspace = {
  jobs: Job[];
};

export function TechnicianWorkflow() {
  const [workspace, setWorkspace] = useState<Workspace>({ jobs: [] });
  const [notice, setNotice] = useState("Technician portal ready");

  useEffect(() => {
    async function load() {
      const response = await fetch("/api/workspace");
      setWorkspace(await response.json());
    }
    void load();
  }, []);

  async function updateJob(jobId: string, patch: Partial<Job>, message: string) {
    const next = { ...workspace, jobs: workspace.jobs.map((job) => job.id === jobId ? { ...job, ...patch } : job) };
    setWorkspace(next);
    await fetch("/api/workspace", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(next) });
    setNotice(message);
  }

  return (
    <div className="space-y-4">
      <p className="inline-flex rounded-md bg-cyan-50 px-3 py-2 text-sm font-semibold text-primary">{notice}</p>
      {workspace.jobs.map((job) => (
        <Card className="p-5" key={job.id}>
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h3 className="font-semibold">{job.jobNumber} · Unit {job.unit}</h3>
              <p className="mt-1 text-sm text-muted">{job.serviceType} · {job.technician}</p>
            </div>
            <Badge tone={job.status.includes("Completed") ? "success" : job.status.includes("Waiting") ? "warning" : "info"}>{job.status}</Badge>
          </div>
          <div className="mt-4 grid gap-2 md:grid-cols-2">
            <input className="rounded-md border border-border px-3 py-2 text-sm" onChange={(event) => updateJob(job.id, { diagnosis: event.target.value }, "Diagnosis saved")} placeholder="Add diagnosis" value={job.diagnosis} />
            <input className="rounded-md border border-border px-3 py-2 text-sm" onChange={(event) => updateJob(job.id, { materials: event.target.value }, "Materials saved")} placeholder="Add material" value={job.materials} />
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            <button className="inline-flex items-center gap-2 rounded-md border border-border px-3 py-2 text-sm font-semibold" onClick={() => updateJob(job.id, { status: "In Progress" }, "Job started")} type="button"><Clock className="h-4 w-4" /> Start Job</button>
            <button className="inline-flex items-center gap-2 rounded-md border border-border px-3 py-2 text-sm font-semibold" onClick={() => updateJob(job.id, { photos: job.photos + 1 }, "Photo added")} type="button"><Camera className="h-4 w-4" /> Add Photo ({job.photos})</button>
            <button className="inline-flex items-center gap-2 rounded-md border border-border px-3 py-2 text-sm font-semibold" onClick={() => updateJob(job.id, { status: "Waiting On Parts" }, "Marked waiting on parts")} type="button"><PackagePlus className="h-4 w-4" /> Waiting On Parts</button>
            <button className="inline-flex items-center gap-2 rounded-md border border-border px-3 py-2 text-sm font-semibold" onClick={() => updateJob(job.id, { status: "Waiting For Approval" }, "Marked waiting for approval")} type="button"><FilePenLine className="h-4 w-4" /> Waiting Approval</button>
            <button className="inline-flex items-center gap-2 rounded-md bg-success px-3 py-2 text-sm font-semibold text-white" onClick={() => updateJob(job.id, { status: "Completed" }, "Job completed")} type="button"><CheckCircle2 className="h-4 w-4" /> Complete Job</button>
          </div>
        </Card>
      ))}
    </div>
  );
}
