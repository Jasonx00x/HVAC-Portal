do $$
begin
  alter type public.job_status add value if not exists 'arrived' after 'scheduled';
exception
  when duplicate_object then null;
end $$;

insert into public.permissions (key, description)
values ('manage_management_companies', 'Manage management companies')
on conflict (key) do nothing;

insert into public.role_permissions (role_id, permission_key, enabled)
select r.id, 'manage_management_companies', r.role in ('super_admin', 'admin', 'office_staff')
from public.roles r
on conflict (role_id, permission_key) do update set enabled = excluded.enabled;
