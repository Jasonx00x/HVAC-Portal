create extension if not exists "pgcrypto";

create type public.user_role as enum ('super_admin', 'admin', 'office_staff', 'technician');
create type public.job_status as enum ('new', 'scheduled', 'arrived', 'in_progress', 'waiting_on_parts', 'waiting_for_approval', 'completed', 'invoiced', 'paid', 'cancelled');
create type public.invoice_status as enum ('draft', 'sent', 'approved', 'paid', 'partial', 'overdue', 'cancelled');
create type public.approval_status as enum ('needs_approval', 'estimate_sent', 'approved', 'denied', 'waiting_on_manager', 'waiting_on_parts');

create table public.tenants (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.permissions (
  key text primary key,
  description text not null
);

create table public.roles (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  name text not null,
  role public.user_role not null,
  created_at timestamptz not null default now(),
  unique (tenant_id, role)
);

create table public.role_permissions (
  role_id uuid not null references public.roles(id) on delete cascade,
  permission_key text not null references public.permissions(key) on delete cascade,
  enabled boolean not null default true,
  primary key (role_id, permission_key)
);

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  tenant_id uuid references public.tenants(id) on delete set null,
  full_name text,
  email text not null,
  phone text,
  role public.user_role not null default 'technician',
  hourly_rate numeric(10,2),
  status text not null default 'active',
  last_login_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.properties (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  name text not null,
  address text,
  city text,
  state text,
  zip text,
  property_manager text,
  property_manager_phone text,
  property_manager_email text,
  billing_contact text,
  billing_email text,
  access_instructions text,
  parking_instructions text,
  loading_dock_notes text,
  contract_notes text,
  po_requirements text,
  approval_rules text,
  preferred_supplier text,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.units (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  property_id uuid not null references public.properties(id) on delete cascade,
  unit_number text not null,
  floor text,
  building_section text,
  access_notes text,
  tenant_notes text,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (property_id, unit_number)
);

create table public.residential_clients (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  name text not null,
  address text,
  phone text,
  email text,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.equipment (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  property_id uuid references public.properties(id) on delete set null,
  unit_id uuid references public.units(id) on delete set null,
  residential_client_id uuid references public.residential_clients(id) on delete set null,
  type text not null,
  brand text,
  model text,
  serial text,
  refrigerant text,
  tonnage text,
  fuel_type text,
  install_date date,
  warranty_expiration date,
  data_plate_photo_path text,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.jobs (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  job_number text not null,
  property_id uuid references public.properties(id) on delete set null,
  unit_id uuid references public.units(id) on delete set null,
  equipment_id uuid references public.equipment(id) on delete set null,
  residential_client_id uuid references public.residential_clients(id) on delete set null,
  technician_id uuid references public.profiles(id) on delete set null,
  service_type text not null,
  priority text not null default 'normal',
  status public.job_status not null default 'new',
  scheduled_at timestamptz,
  completed_at timestamptz,
  problem_reported text,
  diagnosis text,
  work_performed text,
  internal_notes text,
  customer_notes text,
  po_number text,
  approval_status public.approval_status,
  callback_flag boolean not null default false,
  warranty_flag boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (tenant_id, job_number)
);

create table public.materials (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  job_id uuid not null references public.jobs(id) on delete cascade,
  name text not null,
  category text,
  quantity numeric(10,2) not null default 1,
  unit_cost numeric(10,2) not null default 0,
  total_cost numeric(10,2) generated always as (quantity * unit_cost) stored,
  supplier text,
  billable boolean not null default true,
  added_to_invoice boolean not null default false,
  notes text,
  created_at timestamptz not null default now()
);

create table public.inventory_items (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  name text not null,
  category text,
  quantity numeric(10,2) not null default 0,
  unit_cost numeric(10,2) not null default 0,
  supplier text,
  reorder_level numeric(10,2) not null default 0,
  last_purchased date,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.timesheets (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  employee_id uuid not null references public.profiles(id) on delete cascade,
  job_id uuid references public.jobs(id) on delete set null,
  work_date date not null default current_date,
  clock_in timestamptz not null,
  clock_out timestamptz,
  break_minutes integer not null default 0,
  total_hours numeric(10,2),
  notes text,
  approved boolean not null default false,
  created_at timestamptz not null default now()
);

create table public.invoices (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  invoice_number text not null,
  job_id uuid references public.jobs(id) on delete set null,
  property_id uuid references public.properties(id) on delete set null,
  unit_id uuid references public.units(id) on delete set null,
  residential_client_id uuid references public.residential_clients(id) on delete set null,
  billing_contact text,
  invoice_date date not null default current_date,
  due_date date,
  po_number text,
  status public.invoice_status not null default 'draft',
  labor_total numeric(10,2) not null default 0,
  material_total numeric(10,2) not null default 0,
  discount numeric(10,2) not null default 0,
  total numeric(10,2) not null default 0,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (tenant_id, invoice_number)
);

create table public.invoice_line_items (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  invoice_id uuid not null references public.invoices(id) on delete cascade,
  description text not null,
  quantity numeric(10,2) not null default 1,
  unit_price numeric(10,2) not null default 0,
  total numeric(10,2) generated always as (quantity * unit_price) stored
);

create table public.approvals (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  job_id uuid not null references public.jobs(id) on delete cascade,
  property_id uuid references public.properties(id) on delete set null,
  estimate_amount numeric(10,2) not null default 0,
  status public.approval_status not null default 'needs_approval',
  approved_by text,
  approval_date date,
  po_number text,
  notes text,
  created_at timestamptz not null default now()
);

create table public.documents (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  property_id uuid references public.properties(id) on delete cascade,
  unit_id uuid references public.units(id) on delete cascade,
  equipment_id uuid references public.equipment(id) on delete cascade,
  job_id uuid references public.jobs(id) on delete cascade,
  invoice_id uuid references public.invoices(id) on delete cascade,
  type text not null,
  storage_path text not null,
  notes text,
  created_at timestamptz not null default now()
);

create table public.alerts (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  type text not null,
  title text not null,
  detail text,
  severity text not null default 'medium',
  resolved_at timestamptz,
  created_at timestamptz not null default now()
);

create table public.app_workspaces (
  tenant_id uuid primary key references public.tenants(id) on delete cascade,
  data jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

insert into public.tenants (id, name, slug)
values ('00000000-0000-4000-8000-000000000001', 'Hot & Cool Services', 'hot-cool-services')
on conflict (slug) do nothing;

insert into public.permissions (key, description) values
('view_dashboard', 'View dashboard'),
('manage_properties', 'Manage properties'),
('manage_units', 'Manage units'),
('manage_equipment', 'Manage equipment'),
('manage_jobs', 'Manage jobs'),
('manage_calendar', 'Manage calendar'),
('manage_approvals', 'Manage approvals'),
('manage_materials', 'Manage materials'),
('manage_inventory', 'Manage inventory'),
('manage_invoices', 'Manage invoices'),
('view_revenue', 'View revenue'),
('view_profit', 'View profit'),
('manage_employees', 'Manage employees'),
('manage_residential', 'Manage residential clients'),
('manage_management_companies', 'Manage management companies'),
('view_reports', 'View reports'),
('manage_settings', 'Manage settings'),
('manage_staff', 'Manage staff')
on conflict (key) do nothing;

insert into public.roles (tenant_id, name, role)
select '00000000-0000-4000-8000-000000000001', initcap(replace(role_value::text, '_', ' ')), role_value
from unnest(enum_range(null::public.user_role)) as seeded_roles(role_value)
on conflict (tenant_id, role) do nothing;

insert into public.role_permissions (role_id, permission_key, enabled)
select r.id, p.key,
  case
    when r.role = 'super_admin' then true
    when r.role = 'admin' then p.key <> 'view_profit'
    when r.role = 'office_staff' then p.key in ('view_dashboard','manage_properties','manage_units','manage_equipment','manage_jobs','manage_calendar','manage_approvals','manage_materials','manage_inventory','manage_invoices','manage_residential','view_reports')
    when r.role = 'technician' then p.key in ('manage_jobs','manage_materials')
  end
from public.roles r cross join public.permissions p
on conflict (role_id, permission_key) do update set enabled = excluded.enabled;

insert into public.app_workspaces (tenant_id, data)
values ('00000000-0000-4000-8000-000000000001', '{}'::jsonb)
on conflict (tenant_id) do nothing;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, tenant_id, email, full_name, role)
  values (
    new.id,
    '00000000-0000-4000-8000-000000000001',
    coalesce(new.email, ''),
    coalesce(new.raw_user_meta_data ->> 'full_name', new.email),
    case when lower(coalesce(new.email, '')) = 'alfaroje26@gmail.com' then 'super_admin'::public.user_role else 'technician'::public.user_role end
  )
  on conflict (id) do update set email = excluded.email, updated_at = now();
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

create or replace function public.user_tenant_id()
returns uuid
language sql
stable
security definer
set search_path = public
as $$
  select tenant_id from public.profiles where id = auth.uid()
$$;

create or replace function public.user_has_permission(permission text)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles p
    join public.roles r on r.tenant_id = p.tenant_id and r.role = p.role
    join public.role_permissions rp on rp.role_id = r.id
    where p.id = auth.uid()
      and rp.permission_key = permission
      and rp.enabled
  )
$$;

alter table public.tenants enable row level security;
alter table public.profiles enable row level security;
alter table public.roles enable row level security;
alter table public.role_permissions enable row level security;
alter table public.properties enable row level security;
alter table public.units enable row level security;
alter table public.residential_clients enable row level security;
alter table public.equipment enable row level security;
alter table public.jobs enable row level security;
alter table public.materials enable row level security;
alter table public.inventory_items enable row level security;
alter table public.timesheets enable row level security;
alter table public.invoices enable row level security;
alter table public.invoice_line_items enable row level security;
alter table public.approvals enable row level security;
alter table public.documents enable row level security;
alter table public.alerts enable row level security;
alter table public.app_workspaces enable row level security;

create policy "tenant members read own tenant" on public.tenants for select using (id = public.user_tenant_id());
create policy "profiles read own tenant" on public.profiles for select using (tenant_id = public.user_tenant_id());
create policy "profiles update self or staff managers" on public.profiles for update using (id = auth.uid() or public.user_has_permission('manage_staff'));

create policy "roles read tenant" on public.roles for select using (tenant_id = public.user_tenant_id());
create policy "role permissions read tenant" on public.role_permissions for select using (exists (select 1 from public.roles r where r.id = role_id and r.tenant_id = public.user_tenant_id()));
create policy "role permissions manage staff" on public.role_permissions for all using (public.user_has_permission('manage_staff')) with check (public.user_has_permission('manage_staff'));

create policy "properties tenant access" on public.properties for all using (tenant_id = public.user_tenant_id()) with check (tenant_id = public.user_tenant_id());
create policy "units tenant access" on public.units for all using (tenant_id = public.user_tenant_id()) with check (tenant_id = public.user_tenant_id());
create policy "residential tenant access" on public.residential_clients for all using (tenant_id = public.user_tenant_id()) with check (tenant_id = public.user_tenant_id());
create policy "equipment tenant access" on public.equipment for all using (tenant_id = public.user_tenant_id()) with check (tenant_id = public.user_tenant_id());
create policy "jobs tenant access" on public.jobs for all using (tenant_id = public.user_tenant_id()) with check (tenant_id = public.user_tenant_id());
create policy "materials tenant access" on public.materials for all using (tenant_id = public.user_tenant_id()) with check (tenant_id = public.user_tenant_id());
create policy "inventory tenant access" on public.inventory_items for all using (tenant_id = public.user_tenant_id()) with check (tenant_id = public.user_tenant_id());
create policy "timesheets tenant access" on public.timesheets for all using (tenant_id = public.user_tenant_id()) with check (tenant_id = public.user_tenant_id());
create policy "invoices tenant access" on public.invoices for all using (tenant_id = public.user_tenant_id()) with check (tenant_id = public.user_tenant_id());
create policy "invoice line tenant access" on public.invoice_line_items for all using (tenant_id = public.user_tenant_id()) with check (tenant_id = public.user_tenant_id());
create policy "approvals tenant access" on public.approvals for all using (tenant_id = public.user_tenant_id()) with check (tenant_id = public.user_tenant_id());
create policy "documents tenant access" on public.documents for all using (tenant_id = public.user_tenant_id()) with check (tenant_id = public.user_tenant_id());
create policy "alerts tenant access" on public.alerts for all using (tenant_id = public.user_tenant_id()) with check (tenant_id = public.user_tenant_id());
create policy "workspace tenant access" on public.app_workspaces for all using (tenant_id = public.user_tenant_id()) with check (tenant_id = public.user_tenant_id());

insert into storage.buckets (id, name, public)
values ('job-photos', 'job-photos', false), ('documents', 'documents', false)
on conflict (id) do nothing;
