create table if not exists public.management_companies (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  name text not null,
  phone text,
  email text,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (tenant_id, name)
);

alter table public.properties
  add column if not exists management_company_id uuid references public.management_companies(id) on delete set null;

create table if not exists public.service_types (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  name text not null,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  unique (tenant_id, name)
);

create table if not exists public.staff_invites (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  email text not null,
  full_name text,
  role public.user_role not null default 'technician',
  status text not null default 'invited',
  invited_by uuid references public.profiles(id) on delete set null,
  invited_at timestamptz not null default now(),
  accepted_at timestamptz,
  unique (tenant_id, email)
);

create table if not exists public.activity_logs (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  actor_id uuid references public.profiles(id) on delete set null,
  entity_type text not null,
  entity_id uuid,
  action text not null,
  detail text,
  created_at timestamptz not null default now()
);

insert into public.permissions (key, description) values
('manage_management_companies', 'Manage management companies')
on conflict (key) do nothing;

insert into public.management_companies (tenant_id, name, notes)
values ('00000000-0000-4000-8000-000000000001', 'Paradigm Companies', 'Management company from Hot & Cool invoice tracker.')
on conflict (tenant_id, name) do nothing;

insert into public.properties (tenant_id, management_company_id, name, address, property_manager, property_manager_phone, billing_email, po_requirements, preferred_supplier)
select
  '00000000-0000-4000-8000-000000000001',
  mc.id,
  property_name,
  'Address needed',
  'Manager needed',
  'Phone needed',
  'Billing email needed',
  'Confirm PO requirement',
  'Supplier pickup TBD'
from public.management_companies mc
cross join unnest(array['Meridian at Ballston Commons', 'Meridian at Gallery Place']) as seeded(property_name)
where mc.tenant_id = '00000000-0000-4000-8000-000000000001'
  and mc.name = 'Paradigm Companies'
  and not exists (
    select 1 from public.properties p
    where p.tenant_id = mc.tenant_id and p.name = seeded.property_name
  );

update public.properties
set management_company_id = (
  select id from public.management_companies
  where tenant_id = '00000000-0000-4000-8000-000000000001' and name = 'Paradigm Companies'
)
where tenant_id = '00000000-0000-4000-8000-000000000001'
  and name in ('Meridian at Ballston Commons', 'Meridian at Gallery Place');

insert into public.service_types (tenant_id, name)
select '00000000-0000-4000-8000-000000000001', service_name
from unnest(array[
  'Diagnostic',
  'AC Repair',
  'Heating Repair',
  'Compressor Replacement',
  'Condenser Replacement',
  'Refrigerant Charge',
  'Water Heater Replacement',
  'Preventive Maintenance',
  'Duct Cleaning'
]) as seeded(service_name)
on conflict (tenant_id, name) do nothing;

insert into public.role_permissions (role_id, permission_key, enabled)
select r.id, p.key,
  case
    when r.role = 'super_admin' then true
    when r.role = 'admin' then p.key <> 'view_profit'
    when r.role = 'office_staff' then p.key in ('view_dashboard','manage_properties','manage_units','manage_equipment','manage_jobs','manage_calendar','manage_approvals','manage_materials','manage_inventory','manage_invoices','manage_residential','view_reports','manage_management_companies')
    when r.role = 'technician' then p.key in ('manage_jobs','manage_materials')
  end
from public.roles r cross join public.permissions p
on conflict (role_id, permission_key) do update set enabled = excluded.enabled;

alter table public.management_companies enable row level security;
alter table public.service_types enable row level security;
alter table public.staff_invites enable row level security;
alter table public.activity_logs enable row level security;

drop policy if exists "management companies tenant access" on public.management_companies;
create policy "management companies tenant access" on public.management_companies
for all using (tenant_id = public.user_tenant_id()) with check (tenant_id = public.user_tenant_id());

drop policy if exists "service types tenant access" on public.service_types;
create policy "service types tenant access" on public.service_types
for all using (tenant_id = public.user_tenant_id()) with check (tenant_id = public.user_tenant_id());

drop policy if exists "staff invites tenant access" on public.staff_invites;
create policy "staff invites tenant access" on public.staff_invites
for all using (tenant_id = public.user_tenant_id() and public.user_has_permission('manage_staff'))
with check (tenant_id = public.user_tenant_id() and public.user_has_permission('manage_staff'));

drop policy if exists "activity logs tenant read" on public.activity_logs;
create policy "activity logs tenant read" on public.activity_logs
for select using (tenant_id = public.user_tenant_id());

drop policy if exists "activity logs tenant insert" on public.activity_logs;
create policy "activity logs tenant insert" on public.activity_logs
for insert with check (tenant_id = public.user_tenant_id());
