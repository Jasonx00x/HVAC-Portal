import { clsx } from "clsx";
import type { ReactNode } from "react";
import type { StatusTone } from "@/lib/types";

export function Card({
  children,
  className
}: {
  children: ReactNode;
  className?: string;
}) {
  return <section className={clsx("rounded-lg border border-border bg-panel shadow-soft", className)}>{children}</section>;
}

export function Badge({
  children,
  tone = "neutral"
}: {
  children: ReactNode;
  tone?: StatusTone | "danger";
}) {
  const styles = {
    neutral: "bg-slate-100 text-slate-700",
    success: "bg-emerald-50 text-emerald-700",
    warning: "bg-amber-50 text-amber-800",
    danger: "bg-rose-50 text-rose-700",
    info: "bg-cyan-50 text-cyan-700"
  };

  return <span className={clsx("inline-flex items-center rounded px-2 py-1 text-xs font-semibold", styles[tone])}>{children}</span>;
}

export function SectionTitle({
  title,
  subtitle
}: {
  title: string;
  subtitle?: string;
}) {
  return (
    <div>
      <h2 className="text-lg font-semibold text-foreground">{title}</h2>
      {subtitle ? <p className="mt-1 text-sm text-muted">{subtitle}</p> : null}
    </div>
  );
}
