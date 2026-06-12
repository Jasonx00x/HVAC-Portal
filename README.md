# FieldCore HVAC

FieldCore HVAC is the SaaS platform foundation for the **Hot & Cool Command Center**, an internal operations system for Hot & Cool Services.

The app is designed around the company workflow:

`Property -> Unit -> Equipment -> Job -> Materials + Hours -> Invoice -> Revenue`

Residential work is supported separately:

`Residential Client -> Equipment -> Job -> Materials + Hours -> Invoice`

## MVP Includes

- Owner dashboard with revenue, job, alert, inventory, approval, and invoice signals
- Apartment property, unit, equipment, job, material, labor, approval, and invoice data model
- Mobile-first technician view for assigned jobs
- Admin/staff data center for building contacts, addresses, billing rules, supplier pickup notes, and contracts
- Supplier pickup board for preferred suppliers, branch locations, stock notes, and pickup instructions
- Prisma schema for SQLite local development
- Seed data for Jose Alfaro, Angel Alfaro, Oscar Alfaro, apartment properties, jobs, materials, invoices, and alerts
- Role-aware navigation structure for owner, office/admin, and technician workflows

## Supabase Workflow

Schema changes must be committed as SQL migrations under `supabase/migrations`.

Do not make manual Supabase Dashboard schema edits unless there is no practical alternative. If a manual change is required, mirror it back into a migration immediately.

Current baseline migration:

```bash
supabase/migrations/20260611190000_initial_fieldcore_schema.sql
supabase/migrations/20260612103000_preview_hardening.sql
```

Expected environment variables:

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
SUPABASE_WORKSPACE_TENANT_ID=00000000-0000-4000-8000-000000000001
```

The local testing API at `/api/workspace` uses Supabase `app_workspaces` when those variables are present. If they are missing, it falls back to `data/local-workspace.json` for offline development only.

When the Supabase CLI is installed and linked to the GitHub-connected project:

```bash
supabase db push
```

## Netlify Preview

Netlify should use:

```bash
npm run build
```

Required Netlify environment variables:

```bash
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_WORKSPACE_TENANT_ID
```

Add `SUPABASE_SERVICE_ROLE_KEY` only for server-side staff invite/edit features. Never expose it as a `NEXT_PUBLIC_` variable.

Before testing the preview:

1. Run the Supabase migrations.
2. Create or confirm the owner account in Supabase Auth.
3. Promote the owner profile to `super_admin`.
4. Open `/setup` on the preview to verify env vars, auth, profile role, and workspace tables.

## Local Setup

```bash
npm install
cp .env.example .env
npm run prisma:migrate -- --name init
npm run prisma:seed
npm run dev
```

Open `http://localhost:3000`.

## Important MVP Flow

Create Property -> Add Unit -> Add Equipment -> Create Job -> Add Materials -> Add Employee Hours -> Mark Completed -> Create Invoice -> Mark Paid -> Dashboard Updates

## Building Information Checklist

- Property name, address, phone, loading dock, parking, and access instructions
- Property manager, assistant manager, maintenance supervisor, and emergency contacts
- Billing contact, billing email, PO rules, approval process, and invoice terms
- Refrigerant types, common HVAC brands, water heater models, filters, and warranty notes
- Preferred supplier, pickup branch, account notes, parts usually stocked, and backup supplier
- Source documents from email, Drive folders, invoices, POs, receipts, photos, and prior work orders
