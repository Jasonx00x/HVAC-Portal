"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Camera, CheckCircle2, Clock, FilePenLine, Home, PackagePlus, User } from "lucide-react";
import { Badge, Card } from "@/components/ui";

type TechJob = {
  id: string;
  jobNumber: string;
  jobType?: "commercial" | "residential";
  residentialClientId?: string;
  unit: string;
  serviceType: string;
  technician: string;
  status: string;
  diagnosis: string;
  materials: string;
  clockedIn?: boolean;
  photos: number;
  propertyId?: string;
};

type Workspace = {
  jobs?: TechJob[];
  properties?: Array<{ id: string; name: string; address: string; supplier?: string }>;
  [key: string]: unknown;
};

export function TechnicianMobileWorkspace() {
  const [workspace, setWorkspace] = useState<Workspace>({});
  const [notice, setNotice] = useState("Ready for field updates");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const response = await fetch("/api/workspace");
      if (response.ok) setWorkspace(await response.json());
      setLoading(false);
    }
    void load();
  }, []);

  const jobs = useMemo(() => workspace.jobs ?? [], [workspace.jobs]);

  async function updateJob(jobId: string, patch: Partial<TechJob>, message: string) {
    const next = {
      ...workspace,
      jobs: jobs.map((job) => job.id === jobId ? { ...job, ...patch } : job)
    };
    setWorkspace(next);
    const response = await fetch("/api/workspace", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(next)
    });
    setNotice(response.ok ? message : "This update was blocked by permissions.");
  }

  function propertyFor(job: TechJob) {
    return workspace.properties?.find((property) => property.id === job.propertyId);
  }

  return (
    <main className="min-h-screen bg-slate-100 pb-20">
      <header className="sticky top-0 z-20 bg-slate-950 px-4 py-4 text-white">
        <div className="mx-auto max-w-2xl">
          <p className="text-xs font-bold uppercase tracking-wide text-cyan-200">FieldCore HVAC</p>
          <h1 className="mt-1 text-xl font-bold">Today&apos;s Jobs</h1>
          <p className="mt-1 text-sm text-slate-300">Simple field workflow: arrive, start work, report, photo, materials, finish work.</p>
          <p className="mt-3 rounded-md bg-white/10 px-3 py-2 text-sm font-semibold">{notice}</p>
        </div>
      </header>

      <section className="mx-auto max-w-2xl space-y-4 px-4 py-5">
        {loading ? (
          <Card className="p-5">
            <div className="h-5 w-40 animate-pulse rounded bg-slate-200" />
            <div className="mt-4 h-24 animate-pulse rounded bg-slate-100" />
          </Card>
        ) : null}
        {!loading && jobs.length === 0 ? (
          <Card className="p-5">
            <h2 className="text-lg font-semibold">No assigned jobs yet</h2>
            <p className="mt-2 text-sm text-muted">Assigned jobs will show here when the office schedules work under your technician name.</p>
          </Card>
        ) : null}
        {jobs.map((job) => {
          const property = propertyFor(job);
          return (
            <Card className="overflow-hidden" key={job.id}>
              <div className="border-b border-border p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-bold">{job.jobNumber}</p>
                    <h2 className="mt-1 text-lg font-semibold">{job.jobType === "residential" ? "Residential Client" : property?.name ?? "Property TBD"} · {job.unit}</h2>
                    <p className="mt-1 text-sm text-muted">{job.jobType === "residential" ? "Residential field visit" : property?.address ?? "Address needed"}</p>
                  </div>
                  <Badge tone={job.status.includes("Completed") ? "success" : job.status.includes("Waiting") ? "warning" : "info"}>{job.status}</Badge>
                </div>
                <div className="mt-3 rounded-md bg-slate-50 p-3 text-sm text-muted">
                  <p><span className="font-semibold text-foreground">Service:</span> {job.serviceType}</p>
                  <p><span className="font-semibold text-foreground">Pickup:</span> {job.jobType === "residential" ? "Confirm parts before dispatch" : property?.supplier ?? "Supplier TBD"}</p>
                  <p><span className="font-semibold text-foreground">Time clock:</span> {job.clockedIn ? "Clocked in" : "Not clocked in"}</p>
                </div>
              </div>

              <div className="space-y-3 p-4">
                <textarea className="min-h-24 w-full rounded-md border border-border px-3 py-2 text-sm outline-none focus:border-primary" onChange={(event) => updateJob(job.id, { diagnosis: event.target.value }, "Diagnosis saved")} placeholder="Diagnosis / job report" value={job.diagnosis} />
                <input className="w-full rounded-md border border-border px-3 py-2 text-sm outline-none focus:border-primary" onChange={(event) => updateJob(job.id, { materials: event.target.value }, "Materials saved")} placeholder="Materials used" value={job.materials} />
                <div className="grid grid-cols-2 gap-2">
                  <button className="flex h-14 items-center justify-center gap-2 rounded-md border border-border bg-white text-sm font-semibold" onClick={() => updateJob(job.id, { status: "Arrived", clockedIn: false }, `${job.jobNumber} marked arrived`)} type="button">
                    <Home className="h-4 w-4" />
                    Arrived
                  </button>
                  <button className="flex h-14 items-center justify-center gap-2 rounded-md bg-primary text-sm font-semibold text-white" onClick={() => updateJob(job.id, { status: "In Progress", clockedIn: true }, `${job.jobNumber} started and clocked in`)} type="button">
                    <Clock className="h-4 w-4" />
                    Start Work
                  </button>
                  <button className="flex h-14 items-center justify-center gap-2 rounded-md border border-border bg-white text-sm font-semibold" onClick={() => updateJob(job.id, { photos: job.photos + 1 }, "Photo added")} type="button">
                    <Camera className="h-4 w-4" />
                    Photo ({job.photos})
                  </button>
                  <button className="flex h-14 items-center justify-center gap-2 rounded-md border border-border bg-white text-sm font-semibold" onClick={() => updateJob(job.id, { status: "Waiting On Parts" }, "Marked waiting on parts")} type="button">
                    <PackagePlus className="h-4 w-4" />
                    Parts
                  </button>
                  <button className="flex h-14 items-center justify-center gap-2 rounded-md border border-border bg-white text-sm font-semibold" onClick={() => updateJob(job.id, { status: "Waiting For Approval" }, "Marked waiting for approval")} type="button">
                    <FilePenLine className="h-4 w-4" />
                    Approval
                  </button>
                </div>
                <button className="flex h-14 w-full items-center justify-center gap-2 rounded-md bg-success text-sm font-semibold text-white" onClick={() => updateJob(job.id, { status: "Completed", clockedIn: false }, job.jobType === "residential" ? `${job.jobNumber} finished; client moved to Needs Invoice` : `${job.jobNumber} finished and clocked out`)} type="button">
                  <CheckCircle2 className="h-4 w-4" />
                  Finished Work / Clock Out
                </button>
              </div>
            </Card>
          );
        })}
      </section>

      <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-border bg-white">
        <div className="mx-auto grid max-w-2xl grid-cols-3 text-xs font-semibold text-muted">
          <Link className="flex flex-col items-center gap-1 px-2 py-3 text-primary" href="/technician/today"><Home className="h-4 w-4" /> Today</Link>
          <Link className="flex flex-col items-center gap-1 px-2 py-3" href="/technician/jobs"><Clock className="h-4 w-4" /> Jobs</Link>
          <span className="flex flex-col items-center gap-1 px-2 py-3"><User className="h-4 w-4" /> Profile</span>
        </div>
      </nav>
    </main>
  );
}
