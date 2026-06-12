"use client";

import { useEffect, useMemo, useState } from "react";
import { Plus, Save, Trash2 } from "lucide-react";
import { Badge, Card } from "@/components/ui";
import { moduleCopy, type FieldCoreModule } from "@/lib/fieldcore";

type GenericRecord = {
  id: string;
  module: FieldCoreModule;
  name: string;
  status: string;
  notes: string;
  createdAt: string;
};

type Workspace = {
  records?: GenericRecord[];
  [key: string]: unknown;
};

function id(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export function ModuleCrud({ module }: { module: FieldCoreModule }) {
  const copy = moduleCopy[module];
  const [workspace, setWorkspace] = useState<Workspace>({});
  const [name, setName] = useState("");
  const [status, setStatus] = useState("Active");
  const [notes, setNotes] = useState("");
  const [notice, setNotice] = useState("Ready");

  useEffect(() => {
    async function load() {
      const response = await fetch("/api/workspace");
      setWorkspace(await response.json());
    }
    void load();
  }, []);

  const records = useMemo(() => (workspace.records ?? []).filter((record) => record.module === module), [workspace.records, module]);

  async function save(next: Workspace, message: string) {
    setWorkspace(next);
    await fetch("/api/workspace", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(next)
    });
    setNotice(message);
  }

  async function addRecord() {
    if (!name.trim()) {
      setNotice(`${copy.primary} is required`);
      return;
    }
    const record: GenericRecord = {
      id: id(module),
      module,
      name,
      status,
      notes,
      createdAt: new Date().toISOString()
    };
    await save({ ...workspace, records: [record, ...(workspace.records ?? [])] }, `Saved ${name}`);
    setName("");
    setStatus("Active");
    setNotes("");
  }

  async function deleteRecord(recordId: string) {
    await save({ ...workspace, records: (workspace.records ?? []).filter((record) => record.id !== recordId) }, "Deleted record");
  }

  return (
    <div className="space-y-6">
      <Card className="p-5">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h3 className="text-lg font-semibold">Create {copy.title.slice(0, -1)}</h3>
            <p className="mt-1 text-sm text-muted">{copy.subtitle}</p>
          </div>
          <Badge tone="info">{notice}</Badge>
        </div>
        <div className="mt-5 grid gap-3 lg:grid-cols-[1fr_180px_1.2fr_auto]">
          <input className="rounded-md border border-border px-3 py-2 text-sm outline-none focus:border-primary" onChange={(event) => setName(event.target.value)} placeholder={copy.primary} value={name} />
          <select className="rounded-md border border-border px-3 py-2 text-sm outline-none focus:border-primary" onChange={(event) => setStatus(event.target.value)} value={status}>
            {["Active", "Scheduled", "Waiting", "Completed", "Draft", "Paid", "Inactive"].map((item) => <option key={item}>{item}</option>)}
          </select>
          <input className="rounded-md border border-border px-3 py-2 text-sm outline-none focus:border-primary" onChange={(event) => setNotes(event.target.value)} placeholder="Notes, contact info, supplier, PO rule, or job details" value={notes} />
          <button className="inline-flex items-center justify-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white" onClick={addRecord} type="button">
            <Plus className="h-4 w-4" />
            Save
          </button>
        </div>
      </Card>

      <Card className="overflow-hidden">
        <div className="border-b border-border p-5">
          <h3 className="font-semibold">{copy.title} records</h3>
          <p className="mt-1 text-sm text-muted">{records.length} saved local records</p>
        </div>
        <div className="divide-y divide-border">
          {records.length === 0 ? <p className="p-5 text-sm text-muted">No records yet. Add one above to test this module.</p> : null}
          {records.map((record) => (
            <article className="flex flex-col gap-3 p-5 lg:flex-row lg:items-center lg:justify-between" key={record.id}>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h4 className="font-semibold">{record.name}</h4>
                  <Badge tone={record.status === "Paid" || record.status === "Completed" || record.status === "Active" ? "success" : "warning"}>{record.status}</Badge>
                </div>
                <p className="mt-2 text-sm text-muted">{record.notes || "No notes yet"}</p>
              </div>
              <div className="flex gap-2">
                <button className="inline-flex items-center gap-2 rounded-md border border-border px-3 py-2 text-sm font-semibold hover:bg-slate-50" onClick={() => setNotice(`Opened ${record.name}`)} type="button">
                  <Save className="h-4 w-4" />
                  Open
                </button>
                <button className="inline-flex items-center gap-2 rounded-md border border-border px-3 py-2 text-sm font-semibold text-accent hover:bg-rose-50" onClick={() => deleteRecord(record.id)} type="button">
                  <Trash2 className="h-4 w-4" />
                  Delete
                </button>
              </div>
            </article>
          ))}
        </div>
      </Card>
    </div>
  );
}
