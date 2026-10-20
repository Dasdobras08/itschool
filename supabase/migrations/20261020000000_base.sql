-- Etapa 1: escolas, perfis e papéis, com isolamento por escola (RLS).
--
-- Regras:
-- - Cada pessoa tem um perfil (profiles), criado no primeiro login.
-- - Uma pessoa pode participar de várias escolas e ter mais de um papel
--   em cada uma (memberships). Ex.: professora que também é mãe de aluno.
-- - Ninguém vê dados de uma escola da qual não participa.
-- - Escolas e vínculos só são criados por funções do banco, nunca
--   direto pelo navegador.

create type public.member_role as enum ('admin', 'teacher', 'guardian');

-- ---------------------------------------------------------------------------
-- Tabelas
-- ---------------------------------------------------------------------------

create table public.schools (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(btrim(name)) between 2 and 120),
  legal_name text check (legal_name is null or char_length(legal_name) <= 200),
  cnpj text check (cnpj is null or cnpj ~ '^[0-9]{14}$'),
  timezone text not null default 'America/Sao_Paulo',
  created_by uuid references auth.users (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text not null default '' check (char_length(full_name) <= 120),
  phone text check (phone is null or char_length(phone) <= 20),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.memberships (
  id uuid primary key default gen_random_uuid(),
  school_id uuid not null references public.schools (id) on delete cascade,
  user_id uuid not null references auth.users (id) on delete cascade,
  role public.member_role not null,
  created_at timestamptz not null default now(),
  unique (school_id, user_id, role)
);

create index memberships_user_id_idx on public.memberships (user_id);

-- ---------------------------------------------------------------------------
-- updated_at automático
-- ---------------------------------------------------------------------------

create function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

create trigger schools_set_updated_at
  before update on public.schools
  for each row execute function public.set_updated_at();

create trigger profiles_set_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- Funções de apoio às regras de acesso
-- (security definer para poderem ler memberships sem cair na própria RLS)
-- ---------------------------------------------------------------------------

-- A pessoa logada participa da escola? Com _roles, exige um desses papéis.
create function public.is_school_member(
  _school_id uuid,
  _roles public.member_role[] default null
)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.memberships m
    where m.school_id = _school_id
      and m.user_id = (select auth.uid())
      and (_roles is null or m.role = any (_roles))
  );
$$;

-- A pessoa logada é admin ou professor em alguma escola da qual _user_id
-- também participa? Usado para a equipe ver o nome dos membros da escola.
create function public.is_staff_of_member(_user_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.memberships staff
    join public.memberships other on other.school_id = staff.school_id
    where staff.user_id = (select auth.uid())
      and staff.role in ('admin', 'teacher')
      and other.user_id = _user_id
  );
$$;

-- ---------------------------------------------------------------------------
-- Perfil criado no primeiro login
-- ---------------------------------------------------------------------------

create function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, full_name)
  values (
    new.id,
    left(coalesce(new.raw_user_meta_data ->> 'full_name', ''), 120)
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------------------------------------------------------------------------
-- Criar escola: quem cria vira admin dela
-- ---------------------------------------------------------------------------

create function public.create_school(_name text)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  _user_id uuid := (select auth.uid());
  _school_id uuid;
begin
  if _user_id is null then
    raise exception 'not authenticated' using errcode = '42501';
  end if;

  -- Limite simples contra abuso: até 5 escolas criadas por pessoa.
  if (select count(*) from public.schools where created_by = _user_id) >= 5 then
    raise exception 'school limit reached' using errcode = 'P0001';
  end if;

  insert into public.schools (name, created_by)
  values (btrim(_name), _user_id)
  returning id into _school_id;

  insert into public.memberships (school_id, user_id, role)
  values (_school_id, _user_id, 'admin');

  return _school_id;
end;
$$;

-- ---------------------------------------------------------------------------
-- Permissões e RLS
-- ---------------------------------------------------------------------------

alter table public.schools enable row level security;
alter table public.profiles enable row level security;
alter table public.memberships enable row level security;

-- Visitantes sem login não acessam nada.
revoke all on public.schools, public.profiles, public.memberships from anon;
revoke all on public.schools, public.profiles, public.memberships from authenticated;

grant select on public.schools to authenticated;
grant update (name, legal_name, cnpj, timezone) on public.schools to authenticated;
grant select on public.profiles to authenticated;
grant update (full_name, phone) on public.profiles to authenticated;
grant select on public.memberships to authenticated;

create policy "members read their schools"
  on public.schools for select to authenticated
  using (public.is_school_member(id));

create policy "admins update their schools"
  on public.schools for update to authenticated
  using (public.is_school_member(id, '{admin}'))
  with check (public.is_school_member(id, '{admin}'));

create policy "read own profile or as school staff"
  on public.profiles for select to authenticated
  using (id = (select auth.uid()) or public.is_staff_of_member(id));

create policy "update own profile"
  on public.profiles for update to authenticated
  using (id = (select auth.uid()))
  with check (id = (select auth.uid()));

create policy "read own memberships or as school admin"
  on public.memberships for select to authenticated
  using (
    user_id = (select auth.uid())
    or public.is_school_member(school_id, '{admin}')
  );

-- Funções: só quem está logado chama create_school; as demais são internas.
revoke execute on function public.create_school(text) from public, anon;
grant execute on function public.create_school(text) to authenticated;

revoke execute on function public.is_school_member(uuid, public.member_role[]) from public, anon;
grant execute on function public.is_school_member(uuid, public.member_role[]) to authenticated;

revoke execute on function public.is_staff_of_member(uuid) from public, anon;
grant execute on function public.is_staff_of_member(uuid) to authenticated;

revoke execute on function public.handle_new_user() from public, anon, authenticated;
revoke execute on function public.set_updated_at() from public, anon, authenticated;
