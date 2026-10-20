-- RLS tests for the base migration. Each block raises an error on failure.
\set ON_ERROR_STOP on

-- Test helpers: act as a given user (or as a visitor without login).
create function pg_temp.act_as(_user uuid) returns void language plpgsql as $$
begin
  perform set_config('request.jwt.claim.sub', coalesce(_user::text, ''), false);
  if _user is null then
    execute 'set role anon';
  else
    execute 'set role authenticated';
  end if;
end $$;

create function pg_temp.act_as_superuser() returns void language plpgsql as $$
begin
  execute 'reset role';
  perform set_config('request.jwt.claim.sub', '', false);
end $$;

-- Users: Ana (admin of Escola A), Bruno (admin of Escola B), Carla (no school).
insert into auth.users (id, email, raw_user_meta_data) values
  ('00000000-0000-0000-0000-00000000000a', 'ana@example.com', '{"full_name":"Ana"}'),
  ('00000000-0000-0000-0000-00000000000b', 'bruno@example.com', '{"full_name":"Bruno"}'),
  ('00000000-0000-0000-0000-00000000000c', 'carla@example.com', '{}');

-- Profiles are created on sign-up.
do $$
begin
  assert (select count(*) from public.profiles) = 3, 'a profile is created for each new user';
  assert (select full_name from public.profiles where id = '00000000-0000-0000-0000-00000000000a') = 'Ana',
    'full_name comes from sign-up metadata';
end $$;

-- Ana and Bruno each create a school.
select pg_temp.act_as('00000000-0000-0000-0000-00000000000a');
select public.create_school('  Escola A  ') as school_a \gset
select pg_temp.act_as('00000000-0000-0000-0000-00000000000b');
select public.create_school('Escola B') as school_b \gset
select pg_temp.act_as_superuser();

do $$
begin
  assert (select name from public.schools where created_by = '00000000-0000-0000-0000-00000000000a') = 'Escola A',
    'school name is trimmed';
  assert (select role from public.memberships where user_id = '00000000-0000-0000-0000-00000000000a') = 'admin',
    'creator becomes admin';
end $$;

-- Ana sees only her school, her membership and her own profile.
select pg_temp.act_as('00000000-0000-0000-0000-00000000000a');
do $$
begin
  assert (select count(*) from public.schools) = 1, 'Ana sees exactly one school';
  assert (select name from public.schools) = 'Escola A', 'Ana sees Escola A';
  assert (select count(*) from public.memberships) = 1, 'Ana sees only memberships of her school';
  assert (select count(*) from public.profiles) = 1, 'Ana sees only her own profile';
end $$;

-- Ana can rename her school but cannot touch Escola B.
update public.schools set name = 'Escola A Renomeada' where id = :'school_a';
update public.schools set name = 'Hacked' where id = :'school_b';
select pg_temp.act_as_superuser();
do $$
begin
  assert (select name from public.schools where name like 'Escola A%') = 'Escola A Renomeada',
    'admin can rename own school';
  assert exists (select 1 from public.schools where name = 'Escola B'),
    'admin cannot rename another school';
end $$;

-- Carla has no school: she sees nothing and cannot add herself to one.
select pg_temp.act_as('00000000-0000-0000-0000-00000000000c');
do $$
begin
  assert (select count(*) from public.schools) = 0, 'user without membership sees no schools';
  assert (select count(*) from public.memberships) = 0, 'user without membership sees no memberships';
end $$;

do $$
begin
  begin
    insert into public.memberships (school_id, user_id, role)
    select id, '00000000-0000-0000-0000-00000000000c', 'admin' from public.schools limit 1;
    raise exception 'FAIL: client insert into memberships must be denied';
  exception when insufficient_privilege then
    null;
  end;

  begin
    insert into public.schools (name) values ('Escola Fantasma');
    raise exception 'FAIL: client insert into schools must be denied';
  exception when insufficient_privilege then
    null;
  end;

  begin
    update public.profiles set full_name = 'Outra pessoa'
    where id = '00000000-0000-0000-0000-00000000000a';
    -- RLS hides the row, so nothing changes; checked below.
  end;
end $$;

select pg_temp.act_as_superuser();
do $$
begin
  assert (select full_name from public.profiles where id = '00000000-0000-0000-0000-00000000000a') = 'Ana',
    'a user cannot edit someone else''s profile';
end $$;

-- Staff can see the profiles of people in their school.
insert into public.memberships (school_id, user_id, role)
values (:'school_a', '00000000-0000-0000-0000-00000000000c', 'guardian');

select pg_temp.act_as('00000000-0000-0000-0000-00000000000a');
do $$
begin
  assert (select count(*) from public.profiles) = 2, 'admin sees profiles of school members';
  assert (select count(*) from public.memberships) = 2, 'admin sees all memberships of the school';
end $$;

-- A guardian sees the school but not the other members.
select pg_temp.act_as('00000000-0000-0000-0000-00000000000c');
do $$
begin
  assert (select count(*) from public.schools) = 1, 'guardian sees the school';
  assert (select count(*) from public.memberships) = 1, 'guardian sees only own membership';
  assert (select count(*) from public.profiles) = 1, 'guardian sees only own profile';
end $$;

-- A guardian cannot rename the school.
update public.schools set name = 'Hacked' where id = :'school_a';
select pg_temp.act_as_superuser();
do $$
begin
  assert (select name from public.schools where id = (select school_id from public.memberships where role = 'guardian')) = 'Escola A Renomeada',
    'guardian cannot rename the school';
end $$;

-- Visitors without login can't read tables or create schools.
select pg_temp.act_as(null);
do $$
begin
  begin
    perform 1 from public.schools;
    raise exception 'FAIL: anon must not read schools';
  exception when insufficient_privilege then
    null;
  end;

  begin
    perform public.create_school('Escola Anônima');
    raise exception 'FAIL: anon must not create schools';
  exception when insufficient_privilege then
    null;
  end;
end $$;

-- School creation limit.
select pg_temp.act_as('00000000-0000-0000-0000-00000000000b');
select public.create_school('B2'), public.create_school('B3'), public.create_school('B4'), public.create_school('B5');
do $$
begin
  begin
    perform public.create_school('B6');
    raise exception 'FAIL: sixth school must be refused';
  exception when raise_exception then
    if sqlerrm <> 'school limit reached' then
      raise;
    end if;
  end;
end $$;

select pg_temp.act_as_superuser();
\echo 'RLS base: all checks passed'
