create extension if not exists "pgcrypto";

create type public.qms_user_role as enum (
  'admin',
  'quality_manager',
  'auditor',
  'supplier_manager',
  'training_manager',
  'viewer'
);

create type public.document_status as enum (
  'draft',
  'in_review',
  'approved',
  'archived'
);

create type public.non_conformance_severity as enum (
  'low',
  'medium',
  'high',
  'critical'
);

create type public.non_conformance_status as enum (
  'open',
  'investigating',
  'contained',
  'closed'
);

create type public.capa_status as enum (
  'open',
  'in_progress',
  'pending_verification',
  'closed'
);

create type public.audit_status as enum (
  'planned',
  'in_progress',
  'completed',
  'cancelled'
);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

create table public.users (
  id uuid primary key references auth.users (id) on delete cascade,
  email text not null unique,
  role public.qms_user_role not null default 'viewer',
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create or replace function public.current_user_role()
returns public.qms_user_role
language sql
stable
security definer
set search_path = public
as $$
  select role
  from public.users
  where id = auth.uid();
$$;

create or replace function public.has_role(allowed_roles public.qms_user_role[])
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(public.current_user_role() = any (allowed_roles), false);
$$;

create table public.documents (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  version integer not null default 1 check (version > 0),
  file_url text,
  status public.document_status not null default 'draft',
  created_by uuid not null references public.users (id) on delete restrict,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table public.non_conformances (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  severity public.non_conformance_severity not null default 'medium',
  status public.non_conformance_status not null default 'open',
  assigned_to uuid references public.users (id) on delete set null,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table public.capa_actions (
  id uuid primary key default gen_random_uuid(),
  issue_id uuid not null references public.non_conformances (id) on delete cascade,
  root_cause text,
  corrective_action text,
  preventive_action text,
  due_date date,
  status public.capa_status not null default 'open',
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table public.audits (
  id uuid primary key default gen_random_uuid(),
  audit_type text not null,
  audit_date date not null,
  findings jsonb not null default '[]'::jsonb,
  status public.audit_status not null default 'planned',
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table public.suppliers (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  rating numeric(4,2) check (rating between 0 and 5),
  contact_email text not null,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table public.training_records (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users (id) on delete cascade,
  course_name text not null,
  completed boolean not null default false,
  completion_date timestamptz,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  constraint training_records_completion_date_check check (
    (completed = false and completion_date is null)
    or (completed = true and completion_date is not null)
  )
);

create table public.risks (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  probability integer not null check (probability between 1 and 5),
  impact integer not null check (impact between 1 and 5),
  mitigation_plan text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create index users_role_idx on public.users (role);
create index documents_created_by_idx on public.documents (created_by);
create index documents_status_idx on public.documents (status);
create index documents_created_at_idx on public.documents (created_at desc);
create index non_conformances_assigned_to_idx on public.non_conformances (assigned_to);
create index non_conformances_status_idx on public.non_conformances (status);
create index non_conformances_created_at_idx on public.non_conformances (created_at desc);
create index capa_actions_issue_id_idx on public.capa_actions (issue_id);
create index capa_actions_status_idx on public.capa_actions (status);
create index capa_actions_due_date_idx on public.capa_actions (due_date);
create index audits_audit_date_idx on public.audits (audit_date desc);
create index audits_status_idx on public.audits (status);
create unique index suppliers_contact_email_idx on public.suppliers (lower(contact_email));
create index suppliers_rating_idx on public.suppliers (rating desc);
create index training_records_user_id_idx on public.training_records (user_id);
create index training_records_completed_idx on public.training_records (completed);
create index risks_probability_impact_idx on public.risks (probability desc, impact desc);

create trigger users_set_updated_at
before update on public.users
for each row
execute function public.set_updated_at();

create trigger documents_set_updated_at
before update on public.documents
for each row
execute function public.set_updated_at();

create trigger non_conformances_set_updated_at
before update on public.non_conformances
for each row
execute function public.set_updated_at();

create trigger capa_actions_set_updated_at
before update on public.capa_actions
for each row
execute function public.set_updated_at();

create trigger audits_set_updated_at
before update on public.audits
for each row
execute function public.set_updated_at();

create trigger suppliers_set_updated_at
before update on public.suppliers
for each row
execute function public.set_updated_at();

create trigger training_records_set_updated_at
before update on public.training_records
for each row
execute function public.set_updated_at();

create trigger risks_set_updated_at
before update on public.risks
for each row
execute function public.set_updated_at();

create or replace function public.handle_auth_user_created()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.users (id, email, role)
  values (
    new.id,
    coalesce(new.email, ''),
    coalesce((new.raw_user_meta_data ->> 'role')::public.qms_user_role, 'viewer')
  )
  on conflict (id) do update
    set email = excluded.email,
        role = excluded.role,
        updated_at = timezone('utc', now());

  return new;
exception
  when others then
    insert into public.users (id, email, role)
    values (new.id, coalesce(new.email, ''), 'viewer')
    on conflict (id) do update
      set email = excluded.email,
          updated_at = timezone('utc', now());
    return new;
end;
$$;

create trigger on_auth_user_created
after insert on auth.users
for each row
execute function public.handle_auth_user_created();

alter table public.users enable row level security;
alter table public.documents enable row level security;
alter table public.non_conformances enable row level security;
alter table public.capa_actions enable row level security;
alter table public.audits enable row level security;
alter table public.suppliers enable row level security;
alter table public.training_records enable row level security;
alter table public.risks enable row level security;

create policy "users_select_self_or_managers"
on public.users
for select
to authenticated
using (
  auth.uid() = id
  or public.has_role(array['admin', 'quality_manager']::public.qms_user_role[])
);

create policy "users_manage_managers"
on public.users
for all
to authenticated
using (
  public.has_role(array['admin', 'quality_manager']::public.qms_user_role[])
)
with check (
  public.has_role(array['admin', 'quality_manager']::public.qms_user_role[])
);

create policy "documents_select_authenticated"
on public.documents
for select
to authenticated
using (true);

create policy "documents_modify_quality_team"
on public.documents
for all
to authenticated
using (
  public.has_role(array['admin', 'quality_manager']::public.qms_user_role[])
)
with check (
  public.has_role(array['admin', 'quality_manager']::public.qms_user_role[])
);

create policy "non_conformances_select_authenticated"
on public.non_conformances
for select
to authenticated
using (true);

create policy "non_conformances_modify_quality_and_auditors"
on public.non_conformances
for all
to authenticated
using (
  public.has_role(array['admin', 'quality_manager', 'auditor']::public.qms_user_role[])
)
with check (
  public.has_role(array['admin', 'quality_manager', 'auditor']::public.qms_user_role[])
);

create policy "capa_select_authenticated"
on public.capa_actions
for select
to authenticated
using (true);

create policy "capa_modify_quality_team"
on public.capa_actions
for all
to authenticated
using (
  public.has_role(array['admin', 'quality_manager']::public.qms_user_role[])
)
with check (
  public.has_role(array['admin', 'quality_manager']::public.qms_user_role[])
);

create policy "audits_select_authenticated"
on public.audits
for select
to authenticated
using (true);

create policy "audits_modify_audit_team"
on public.audits
for all
to authenticated
using (
  public.has_role(array['admin', 'quality_manager', 'auditor']::public.qms_user_role[])
)
with check (
  public.has_role(array['admin', 'quality_manager', 'auditor']::public.qms_user_role[])
);

create policy "suppliers_select_authenticated"
on public.suppliers
for select
to authenticated
using (true);

create policy "suppliers_modify_supplier_team"
on public.suppliers
for all
to authenticated
using (
  public.has_role(array['admin', 'quality_manager', 'supplier_manager']::public.qms_user_role[])
)
with check (
  public.has_role(array['admin', 'quality_manager', 'supplier_manager']::public.qms_user_role[])
);

create policy "training_records_select_self_or_managers"
on public.training_records
for select
to authenticated
using (
  user_id = auth.uid()
  or public.has_role(array['admin', 'quality_manager', 'training_manager']::public.qms_user_role[])
);

create policy "training_records_modify_training_team"
on public.training_records
for all
to authenticated
using (
  public.has_role(array['admin', 'quality_manager', 'training_manager']::public.qms_user_role[])
)
with check (
  public.has_role(array['admin', 'quality_manager', 'training_manager']::public.qms_user_role[])
);

create policy "risks_select_authenticated"
on public.risks
for select
to authenticated
using (true);

create policy "risks_modify_quality_team"
on public.risks
for all
to authenticated
using (
  public.has_role(array['admin', 'quality_manager', 'auditor']::public.qms_user_role[])
)
with check (
  public.has_role(array['admin', 'quality_manager', 'auditor']::public.qms_user_role[])
);
