export default function Loading() {
  return (
    <main className="min-h-screen bg-background p-6">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="h-10 w-72 animate-pulse rounded-md bg-slate-200" />
        <div className="grid gap-4 md:grid-cols-3">
          {[1, 2, 3].map((item) => (
            <div className="h-28 animate-pulse rounded-lg border border-border bg-white" key={item} />
          ))}
        </div>
        <div className="h-96 animate-pulse rounded-lg border border-border bg-white" />
      </div>
    </main>
  );
}
