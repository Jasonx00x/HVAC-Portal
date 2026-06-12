"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  ArrowLeft,
  Camera,
  CheckCircle2,
  Clock,
  FilePenLine,
  Home,
  Loader2,
  MapPin,
  PackagePlus,
  User
} from "lucide-react";
import { uploadJobPhoto, type JobPhotoMetadata } from "@/lib/storage/job-photos";
import { Badge, Card } from "@/components/ui";

type GeoPoint = {
  latitude: number;
  longitude: number;
  accuracy?: number;
  capturedAt: string;
};

type LocationEvent = {
  id: string;
  technicianId?: string;
  jobId: string;
  actionType: "arrived" | "start_work" | "complete_job";
  latitude?: number;
  longitude?: number;
  accuracy?: number;
  timestamp: string;
  permissionStatus: "granted" | "denied" | "unavailable";
};

type TechJob = {
  id: string;
  jobNumber: string;
  jobType?: "commercial" | "residential";
  residentialClientId?: string;
  propertyId?: string;
  unit: string;
  serviceType: string;
  technician: string;
  status: string;
  priority?: string;
  problemReported?: string;
  scheduledDate?: string;
  scheduledTime?: string;
  equipment?: string;
  accessNotes?: string;
  diagnosis: string;
  workPerformed?: string;
  materials: string;
  laborNotes?: string;
  clockedIn?: boolean;
  photos: number;
  photoMetadata?: JobPhotoMetadata[];
  arrivedAt?: string;
  startedAt?: string;
  completedAt?: string;
  arrivedLocation?: GeoPoint;
  startLocation?: GeoPoint;
  completionLocation?: GeoPoint;
  locationEvents?: LocationEvent[];
  locationStatus?: string;
};

type WorkspaceProfile = {
  userId?: string;
  email?: string;
  fullName?: string;
  role?: string;
  status?: string;
  permissions?: string[];
};

type TechProperty = {
  id: string;
  name: string;
  address: string;
  supplier?: string;
  manager?: string;
  phone?: string;
  accessNotes?: string;
};

type Workspace = {
  jobs?: TechJob[];
  properties?: TechProperty[];
  currentUser?: WorkspaceProfile;
  [key: string]: unknown;
};

type TechnicianMode = "home" | "jobs" | "detail" | "profile";

function todayKey() {
  return new Date().toISOString().slice(0, 10);
}

function formatTime(value?: string) {
  if (!value) return "Not stamped";
  return new Intl.DateTimeFormat(undefined, { hour: "numeric", minute: "2-digit" }).format(new Date(value));
}

function weekStart(date = new Date()) {
  const next = new Date(date);
  const day = next.getDay();
  next.setHours(0, 0, 0, 0);
  next.setDate(next.getDate() - day);
  return next;
}

function hoursThisWeek(jobs: TechJob[]) {
  const start = weekStart();
  return jobs.reduce((sum, job) => {
    if (!job.startedAt || !job.completedAt) return sum;
    const started = new Date(job.startedAt);
    const completed = new Date(job.completedAt);
    if (Number.isNaN(started.getTime()) || Number.isNaN(completed.getTime()) || started < start || completed <= started) return sum;
    return sum + ((completed.getTime() - started.getTime()) / 3600000);
  }, 0);
}

function statusTone(status: string) {
  if (status.includes("Completed") || status.includes("Paid")) return "success";
  if (status.includes("Waiting")) return "warning";
  if (status.includes("Progress") || status.includes("Arrived")) return "info";
  return "neutral";
}

function eventId(actionType: LocationEvent["actionType"]) {
  return `loc-${actionType}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

async function captureLocation(actionType: LocationEvent["actionType"], jobId: string, technicianId?: string) {
  const timestamp = new Date().toISOString();
  if (!("geolocation" in navigator)) {
    return {
      event: { id: eventId(actionType), technicianId, jobId, actionType, timestamp, permissionStatus: "unavailable" as const },
      message: "Location is not available on this device. Action saved without location."
    };
  }

  try {
    const position = await new Promise<GeolocationPosition>((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject, {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000
      });
    });
    const capturedAt = new Date().toISOString();
    const point: GeoPoint = {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
      accuracy: position.coords.accuracy,
      capturedAt
    };
    return {
      point,
      event: {
        id: eventId(actionType),
        technicianId,
        jobId,
        actionType,
        latitude: point.latitude,
        longitude: point.longitude,
        accuracy: point.accuracy,
        timestamp: capturedAt,
        permissionStatus: "granted" as const
      },
      message: "Location captured."
    };
  } catch {
    return {
      event: { id: eventId(actionType), technicianId, jobId, actionType, timestamp, permissionStatus: "denied" as const },
      message: "Location permission was denied. Action saved without location."
    };
  }
}

export function TechnicianMobileWorkspace({
  mode,
  jobId
}: {
  mode: TechnicianMode;
  jobId?: string;
}) {
  const [workspace, setWorkspace] = useState<Workspace>({});
  const [notice, setNotice] = useState("Ready for field updates");
  const [loading, setLoading] = useState(true);
  const [savingAction, setSavingAction] = useState<string | null>(null);
  const [fieldDrafts, setFieldDrafts] = useState<Record<string, Partial<Pick<TechJob, "diagnosis" | "workPerformed" | "materials" | "laborNotes">>>>({});

  useEffect(() => {
    async function load() {
      const response = await fetch("/api/workspace", { cache: "no-store" });
      if (response.ok) setWorkspace(await response.json());
      setLoading(false);
    }
    void load();
  }, []);

  const jobs = useMemo(() => workspace.jobs ?? [], [workspace.jobs]);
  const todayJobs = useMemo(() => {
    const today = todayKey();
    return jobs.filter((job) => !job.scheduledDate || job.scheduledDate === today);
  }, [jobs]);
  const activeJob = jobs.find((job) => job.clockedIn || ["Arrived", "In Progress"].includes(job.status));
  const selectedJob = jobId ? jobs.find((job) => job.id === jobId) : undefined;
  const visibleJobs = mode === "home" ? todayJobs : jobs;
  const profile = workspace.currentUser;

  async function saveWorkspace(next: Workspace, successMessage: string) {
    setWorkspace(next);
    const response = await fetch("/api/workspace", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(next)
    });
    setNotice(response.ok ? successMessage : "This update was blocked by permissions.");
  }

  async function updateJob(job: TechJob, patch: Partial<TechJob>, message: string) {
    const next = {
      ...workspace,
      jobs: jobs.map((item) => item.id === job.id ? { ...item, ...patch } : item)
    };
    await saveWorkspace(next, message);
  }

  async function updateJobWithLocation(job: TechJob, actionType: LocationEvent["actionType"], patch: Partial<TechJob>, message: string) {
    setSavingAction(`${job.id}-${actionType}`);
    const location = await captureLocation(actionType, job.id, profile?.userId);
    const locationPatch: Partial<TechJob> = {
      ...patch,
      locationStatus: location.message,
      locationEvents: [...(job.locationEvents ?? []), location.event]
    };
    if (actionType === "arrived") {
      locationPatch.arrivedAt = location.event.timestamp;
      if (location.point) locationPatch.arrivedLocation = location.point;
    }
    if (actionType === "start_work") {
      locationPatch.startedAt = location.event.timestamp;
      if (location.point) locationPatch.startLocation = location.point;
    }
    if (actionType === "complete_job") {
      locationPatch.completedAt = location.event.timestamp;
      if (location.point) locationPatch.completionLocation = location.point;
    }
    await updateJob(job, locationPatch, `${message} ${location.message}`);
    setSavingAction(null);
  }

  async function addPhoto(job: TechJob) {
    setSavingAction(`${job.id}-photo`);
    const photo = await uploadJobPhoto({ jobId: job.id, technicianId: profile?.userId, caption: "Field photo placeholder" });
    await updateJob(job, {
      photos: (job.photos ?? 0) + 1,
      photoMetadata: [...(job.photoMetadata ?? []), photo]
    }, "Photo placeholder added.");
    setSavingAction(null);
  }

  function updateFieldDraft(jobId: string, patch: Partial<Pick<TechJob, "diagnosis" | "workPerformed" | "materials" | "laborNotes">>) {
    setFieldDrafts((current) => ({
      ...current,
      [jobId]: { ...(current[jobId] ?? {}), ...patch }
    }));
  }

  async function saveFieldReport(job: TechJob) {
    const draft = fieldDrafts[job.id] ?? {};
    setSavingAction(`${job.id}-field-report`);
    await updateJob(job, {
      diagnosis: draft.diagnosis ?? job.diagnosis,
      workPerformed: draft.workPerformed ?? job.workPerformed,
      materials: draft.materials ?? job.materials,
      laborNotes: draft.laborNotes ?? job.laborNotes
    }, "Field report saved.");
    setFieldDrafts((current) => {
      const next = { ...current };
      delete next[job.id];
      return next;
    });
    setSavingAction(null);
  }

  function propertyFor(job: TechJob) {
    return workspace.properties?.find((property) => property.id === job.propertyId);
  }

  if (loading) {
    return (
      <TechnicianFrame notice="Loading FieldCore..." mode={mode} showAdminReturn={false}>
        <Card className="p-5">
          <div className="h-5 w-44 animate-pulse rounded bg-slate-200" />
          <div className="mt-4 space-y-3">
            <div className="h-24 animate-pulse rounded bg-slate-100" />
            <div className="h-24 animate-pulse rounded bg-slate-100" />
          </div>
        </Card>
      </TechnicianFrame>
    );
  }

  if (mode === "profile") {
    const completedJobs = jobs.filter((job) => job.status === "Completed" || job.completedAt).length;
    return (
      <TechnicianFrame notice={notice} mode={mode} showAdminReturn={profile?.role !== "technician"}>
        <Card className="p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-950 text-sm font-bold text-white">FC</div>
            <div>
              <h2 className="text-lg font-bold">{profile?.fullName || profile?.email || "Technician Profile"}</h2>
              <p className="text-sm text-muted">{profile?.email ?? "Email not loaded"}</p>
            </div>
          </div>
          <div className="mt-5 grid gap-3 text-sm">
            <InfoRow label="Role" value={(profile?.role ?? "technician").replace("_", " ")} />
            <InfoRow label="Status" value={profile?.status ?? "Active"} />
            <InfoRow label="Assigned jobs" value={String(jobs.length)} />
            <InfoRow label="Completed jobs" value={String(completedJobs)} />
            <InfoRow label="Hours this week" value={`${hoursThisWeek(jobs).toFixed(2)} hours`} />
            <InfoRow label="Last login" value="Current session" />
          </div>
          <div className="mt-5 rounded-md bg-slate-50 p-3 text-sm text-muted">
            <p className="font-semibold text-foreground">Permissions summary</p>
            <p className="mt-1">Assigned job updates, diagnosis, work performed, material notes, labor notes, photos, and job completion. Admin finance and settings are blocked.</p>
          </div>
          <div className="mt-5 grid grid-cols-2 gap-2">
            <Link className="rounded-md border border-border px-3 py-3 text-center text-sm font-semibold" href="/technician/today">Back Home</Link>
            <Link className="rounded-md bg-slate-950 px-3 py-3 text-center text-sm font-semibold text-white" href="/logout">Logout</Link>
          </div>
        </Card>
      </TechnicianFrame>
    );
  }

  if (mode === "detail") {
    if (!selectedJob) {
      return (
        <TechnicianFrame notice={notice} mode={mode} showAdminReturn={profile?.role !== "technician"}>
          <Card className="p-5">
            <h2 className="text-lg font-bold">Job not found</h2>
            <p className="mt-2 text-sm text-muted">This job may not be assigned to your technician account.</p>
            <Link className="mt-4 inline-flex items-center gap-2 rounded-md bg-primary px-3 py-2 text-sm font-semibold text-white" href="/technician/jobs">
              <ArrowLeft className="h-4 w-4" /> Back to jobs
            </Link>
          </Card>
        </TechnicianFrame>
      );
    }
    return (
      <TechnicianFrame notice={notice} mode={mode} showAdminReturn={profile?.role !== "technician"}>
        <Link className="mb-3 inline-flex items-center gap-2 text-sm font-semibold text-primary" href="/technician/jobs">
          <ArrowLeft className="h-4 w-4" /> Jobs
        </Link>
        <JobCard
          addPhoto={addPhoto}
          detail
          job={selectedJob}
          property={propertyFor(selectedJob)}
          savingAction={savingAction}
          updateJob={updateJob}
          updateJobWithLocation={updateJobWithLocation}
          draft={fieldDrafts[selectedJob.id] ?? {}}
          updateFieldDraft={updateFieldDraft}
          saveFieldReport={saveFieldReport}
        />
      </TechnicianFrame>
    );
  }

  return (
    <TechnicianFrame notice={notice} mode={mode} showAdminReturn={profile?.role !== "technician"}>
      {mode === "home" ? (
        <div className="space-y-4">
          <Card className="p-5">
            <p className="text-sm font-semibold text-accent">Welcome back</p>
            <h2 className="mt-1 text-xl font-bold">{profile?.fullName || "Technician"}</h2>
            <p className="mt-2 text-sm text-muted">Use this screen to see today&apos;s work, stamp arrival, start work, add notes, and clock out.</p>
          </Card>
          {activeJob ? (
            <Card className="border-cyan-300 p-4">
              <p className="text-xs font-bold uppercase tracking-wide text-primary">Current active job</p>
              <p className="mt-1 font-semibold">{activeJob.jobNumber} · {activeJob.serviceType}</p>
              <Link className="mt-3 inline-flex rounded-md bg-primary px-3 py-2 text-sm font-semibold text-white" href={`/technician/jobs/${activeJob.id}`}>Open job</Link>
            </Card>
          ) : null}
          <SummaryGrid jobs={jobs} />
        </div>
      ) : null}

      {visibleJobs.length === 0 ? (
        <Card className="mt-4 p-5">
          <h2 className="text-lg font-semibold">No jobs assigned today.</h2>
          <p className="mt-2 text-sm text-muted">Assigned jobs will show here when the office schedules work under your technician account.</p>
        </Card>
      ) : (
        <div className="mt-4 space-y-4">
          {visibleJobs.map((job) => (
            <JobCard
              addPhoto={addPhoto}
              job={job}
              key={job.id}
              property={propertyFor(job)}
              savingAction={savingAction}
              updateJob={updateJob}
              updateJobWithLocation={updateJobWithLocation}
              draft={fieldDrafts[job.id] ?? {}}
              updateFieldDraft={updateFieldDraft}
              saveFieldReport={saveFieldReport}
            />
          ))}
        </div>
      )}
    </TechnicianFrame>
  );
}

function TechnicianFrame({
  children,
  notice,
  mode,
  showAdminReturn
}: {
  children: React.ReactNode;
  notice: string;
  mode: TechnicianMode;
  showAdminReturn: boolean;
}) {
  return (
    <main className="min-h-screen bg-slate-100 pb-24">
      <header className="sticky top-0 z-20 bg-slate-950 px-4 py-4 text-white">
        <div className="mx-auto max-w-2xl">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-cyan-200">FieldCore HVAC</p>
              <h1 className="mt-1 text-xl font-bold">{mode === "jobs" ? "Assigned Jobs" : mode === "profile" ? "Profile" : mode === "detail" ? "Job Detail" : "Technician Home"}</h1>
            </div>
            {showAdminReturn ? (
              <Link className="rounded-md border border-white/20 bg-white/10 px-3 py-2 text-xs font-bold text-white" href="/dashboard">
                Admin Portal
              </Link>
            ) : null}
          </div>
          <p className="mt-1 text-sm text-slate-300">Mobile field workflow for assigned Hot & Cool work only.</p>
          <p className="mt-3 rounded-md bg-white/10 px-3 py-2 text-sm font-semibold">{notice}</p>
        </div>
      </header>
      <section className="mx-auto max-w-2xl px-4 py-5">{children}</section>
      <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-border bg-white">
        <div className="mx-auto grid max-w-2xl grid-cols-3 text-xs font-semibold text-muted">
          <Tab href="/technician/today" icon={Home} label="Home" active={mode === "home"} />
          <Tab href="/technician/jobs" icon={Clock} label="Jobs" active={mode === "jobs" || mode === "detail"} />
          <Tab href="/technician/profile" icon={User} label="Profile" active={mode === "profile"} />
        </div>
      </nav>
    </main>
  );
}

function Tab({ href, icon: Icon, label, active }: { href: string; icon: React.ComponentType<{ className?: string }>; label: string; active: boolean }) {
  return (
    <Link className={`flex flex-col items-center gap-1 px-2 py-3 ${active ? "text-primary" : ""}`} href={href}>
      <Icon className="h-4 w-4" /> {label}
    </Link>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-border pb-2">
      <span className="text-muted">{label}</span>
      <span className="text-right font-semibold capitalize">{value}</span>
    </div>
  );
}

function SummaryGrid({ jobs }: { jobs: TechJob[] }) {
  const waitingParts = jobs.filter((job) => job.status === "Waiting On Parts").length;
  const waitingApproval = jobs.filter((job) => job.status === "Waiting For Approval").length;
  const completed = jobs.filter((job) => job.status === "Completed").length;
  return (
    <div className="grid grid-cols-3 gap-2">
      <Card className="p-3 text-center"><p className="text-lg font-bold">{waitingParts}</p><p className="text-xs text-muted">Parts</p></Card>
      <Card className="p-3 text-center"><p className="text-lg font-bold">{waitingApproval}</p><p className="text-xs text-muted">Approval</p></Card>
      <Card className="p-3 text-center"><p className="text-lg font-bold">{completed}</p><p className="text-xs text-muted">Complete</p></Card>
    </div>
  );
}

function JobCard({
  job,
  property,
  detail = false,
  savingAction,
  updateJob,
  updateJobWithLocation,
  addPhoto,
  draft,
  updateFieldDraft,
  saveFieldReport
}: {
  job: TechJob;
  property?: TechProperty;
  detail?: boolean;
  savingAction: string | null;
  updateJob: (job: TechJob, patch: Partial<TechJob>, message: string) => Promise<void>;
  updateJobWithLocation: (job: TechJob, actionType: LocationEvent["actionType"], patch: Partial<TechJob>, message: string) => Promise<void>;
  addPhoto: (job: TechJob) => Promise<void>;
  draft: Partial<Pick<TechJob, "diagnosis" | "workPerformed" | "materials" | "laborNotes">>;
  updateFieldDraft: (jobId: string, patch: Partial<Pick<TechJob, "diagnosis" | "workPerformed" | "materials" | "laborNotes">>) => void;
  saveFieldReport: (job: TechJob) => Promise<void>;
}) {
  const isSaving = (action: string) => savingAction === `${job.id}-${action}`;
  const locationEvents = job.locationEvents ?? [];

  return (
    <Card className="overflow-hidden">
      <div className="border-b border-border p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-sm font-bold">{job.jobNumber}</p>
            <h2 className="mt-1 text-lg font-semibold">{job.jobType === "residential" ? "Residential Client" : property?.name ?? "Property TBD"} · {job.unit || "Unit TBD"}</h2>
            <p className="mt-1 text-sm text-muted">{job.jobType === "residential" ? "Residential field visit" : property?.address ?? "Address needed"}</p>
          </div>
          <Badge tone={statusTone(job.status)}>{job.status}</Badge>
        </div>
        <div className="mt-3 grid gap-2 rounded-md bg-slate-50 p-3 text-sm text-muted">
          <p><span className="font-semibold text-foreground">Service:</span> {job.serviceType || "Service needed"}</p>
          <p><span className="font-semibold text-foreground">Priority:</span> {job.priority ?? "Normal"}</p>
          <p><span className="font-semibold text-foreground">Scheduled:</span> {job.scheduledDate ?? "Date TBD"} {job.scheduledTime ?? ""}</p>
          <p><span className="font-semibold text-foreground">Issue:</span> {job.problemReported || "No issue report entered yet."}</p>
          <p><span className="font-semibold text-foreground">Access:</span> {job.accessNotes || property?.accessNotes || "Access notes needed."}</p>
          <p><span className="font-semibold text-foreground">Pickup:</span> {job.jobType === "residential" ? "Confirm parts before dispatch" : property?.supplier ?? "Supplier TBD"}</p>
          <p><span className="font-semibold text-foreground">Time clock:</span> {job.clockedIn ? "Clocked in" : "Not clocked in"}</p>
        </div>
      </div>

      <div className="space-y-3 p-4">
        {detail ? (
          <>
            <textarea className="min-h-24 w-full rounded-md border border-border bg-white px-3 py-2 text-sm outline-none focus:border-primary" onChange={(event) => updateFieldDraft(job.id, { diagnosis: event.target.value })} placeholder="Add diagnosis" value={draft.diagnosis ?? job.diagnosis ?? ""} />
            <textarea className="min-h-24 w-full rounded-md border border-border bg-white px-3 py-2 text-sm outline-none focus:border-primary" onChange={(event) => updateFieldDraft(job.id, { workPerformed: event.target.value })} placeholder="Add work performed / job report" value={draft.workPerformed ?? job.workPerformed ?? ""} />
            <input className="w-full rounded-md border border-border bg-white px-3 py-2 text-sm outline-none focus:border-primary" onChange={(event) => updateFieldDraft(job.id, { materials: event.target.value })} placeholder="Materials used" value={draft.materials ?? job.materials ?? ""} />
            <input className="w-full rounded-md border border-border bg-white px-3 py-2 text-sm outline-none focus:border-primary" onChange={(event) => updateFieldDraft(job.id, { laborNotes: event.target.value })} placeholder="Labor notes or hours, example: 2.5 hours plus supplier pickup" value={draft.laborNotes ?? job.laborNotes ?? ""} />
            <button className="flex h-12 w-full items-center justify-center gap-2 rounded-md border border-primary bg-cyan-50 text-sm font-semibold text-primary disabled:opacity-70" disabled={isSaving("field-report")} onClick={() => saveFieldReport(job)} type="button">
              {isSaving("field-report") ? <Loader2 className="h-4 w-4 animate-spin" /> : <FilePenLine className="h-4 w-4" />}
              Save Field Report
            </button>
          </>
        ) : null}

        <div className="grid grid-cols-2 gap-2">
          <ActionButton loading={isSaving("arrived")} icon={Home} label={job.arrivedAt ? `Arrived ${formatTime(job.arrivedAt)}` : "Arrived"} onClick={() => updateJobWithLocation(job, "arrived", { status: "Arrived", clockedIn: false }, `${job.jobNumber} marked arrived.`)} />
          <ActionButton primary loading={isSaving("start_work")} icon={Clock} label={job.startedAt ? `Started ${formatTime(job.startedAt)}` : "Start Work"} onClick={() => updateJobWithLocation(job, "start_work", { status: "In Progress", clockedIn: true }, `${job.jobNumber} started and clocked in.`)} />
          <ActionButton loading={isSaving("photo")} icon={Camera} label={`Photo (${job.photos ?? 0})`} onClick={() => addPhoto(job)} />
          <ActionButton loading={false} icon={PackagePlus} label="Parts" onClick={() => updateJob(job, { status: "Waiting On Parts" }, "Marked waiting on parts.")} />
          <ActionButton loading={false} icon={FilePenLine} label="Approval" onClick={() => updateJob(job, { status: "Waiting For Approval" }, "Marked waiting for approval.")} />
          {!detail ? (
            <Link className="flex h-14 items-center justify-center gap-2 rounded-md border border-border bg-white text-sm font-semibold" href={`/technician/jobs/${job.id}`}>
              <FilePenLine className="h-4 w-4" /> Details
            </Link>
          ) : null}
        </div>
        <button className="flex h-14 w-full items-center justify-center gap-2 rounded-md bg-success text-sm font-semibold text-white disabled:opacity-70" disabled={isSaving("complete_job")} onClick={() => updateJobWithLocation(job, "complete_job", { status: "Completed", clockedIn: false }, job.jobType === "residential" ? `${job.jobNumber} finished; client moved to Needs Invoice.` : `${job.jobNumber} finished and clocked out.`)} type="button">
          {isSaving("complete_job") ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}
          {job.completedAt ? `Finished ${formatTime(job.completedAt)}` : "Finish Work / Complete Job"}
        </button>

        {job.locationStatus ? (
          <p className="flex items-start gap-2 rounded-md bg-slate-50 p-3 text-xs text-muted">
            {job.locationStatus.includes("denied") ? <AlertTriangle className="mt-0.5 h-4 w-4 text-amber-600" /> : <MapPin className="mt-0.5 h-4 w-4 text-primary" />}
            {job.locationStatus}
          </p>
        ) : null}
        {detail && locationEvents.length > 0 ? (
          <div className="rounded-md border border-border p-3 text-xs">
            <p className="font-bold">Location activity</p>
            <div className="mt-2 space-y-1 text-muted">
              {locationEvents.map((event) => (
                <p key={event.id}>{event.actionType.replace("_", " ")} · {formatTime(event.timestamp)} · {event.permissionStatus}{event.latitude ? ` · ${event.latitude.toFixed(5)}, ${event.longitude?.toFixed(5)}` : ""}</p>
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </Card>
  );
}

function ActionButton({
  icon: Icon,
  label,
  onClick,
  primary = false,
  loading
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  onClick: () => void;
  primary?: boolean;
  loading: boolean;
}) {
  return (
    <button className={`flex h-14 items-center justify-center gap-2 rounded-md text-sm font-semibold disabled:opacity-70 ${primary ? "bg-primary text-white" : "border border-border bg-white"}`} disabled={loading} onClick={onClick} type="button">
      {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Icon className="h-4 w-4" />}
      {label}
    </button>
  );
}
