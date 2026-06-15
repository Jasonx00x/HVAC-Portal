import { NextResponse } from "next/server";
import { getCurrentAccess, hasPermission } from "@/lib/auth/permissions";

export const runtime = "nodejs";

type GoogleInvoicePayload = {
  id?: string;
  invoiceNumber?: string;
  customer?: string;
  propertyName?: string;
  date?: string;
  dueDate?: string;
  amount?: number;
  status?: string;
  poNumber?: string;
  source?: string;
  serviceDescription?: string;
};

const webhookUrl = process.env.GOOGLE_INVOICE_WEBHOOK_URL;
const syncSecret = process.env.GOOGLE_INVOICE_SYNC_SECRET;

export async function POST(request: Request) {
  const access = await getCurrentAccess();
  if (!access.isAuthenticated || !hasPermission(access, "manage_invoices")) {
    return NextResponse.json({ error: "Missing invoice permission." }, { status: 403 });
  }

  if (!webhookUrl || !syncSecret) {
    return NextResponse.json({
      error: "Google invoice sync is not configured.",
      missing: {
        webhookUrl: !webhookUrl,
        syncSecret: !syncSecret
      }
    }, { status: 503 });
  }

  const invoice = await request.json() as GoogleInvoicePayload;
  if (!invoice.id || !invoice.invoiceNumber) {
    return NextResponse.json({ error: "Invoice ID and invoice number are required." }, { status: 400 });
  }

  const response = await fetch(webhookUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      secret: syncSecret,
      id: invoice.id,
      invoiceNumber: invoice.invoiceNumber,
      customer: invoice.customer ?? invoice.propertyName ?? "",
      propertyName: invoice.propertyName ?? "",
      date: invoice.date ?? "",
      dueDate: invoice.dueDate ?? "",
      amount: Number(invoice.amount) || 0,
      status: invoice.status ?? "",
      poNumber: invoice.poNumber ?? "",
      source: invoice.source ?? "FieldCore",
      serviceDescription: invoice.serviceDescription ?? ""
    })
  });

  const text = await response.text();
  let result: unknown = text;
  try {
    result = JSON.parse(text);
  } catch {
    result = { raw: text };
  }

  if (!response.ok) {
    return NextResponse.json({ error: "Google invoice sync failed.", result }, { status: 502 });
  }

  return NextResponse.json({ ok: true, syncedAt: new Date().toISOString(), result });
}
