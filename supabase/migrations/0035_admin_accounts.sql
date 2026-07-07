-- ============================================================================
-- Admin account management + role-change hardening.
--
-- 1) SECURITY FIX: profiles_update allowed every user to update their OWN
--    row with no column restriction — including `role`, so any signed-in
--    member could promote themselves to admin through the REST API. Table
--    UPDATE is revoked and re-granted only for harmless columns; the role
--    column is now writable exclusively through admin_set_role().
--
-- 2) admin_set_role(): admins promote/demote accounts from the new
--    /admin → Admin Accounts screen, with guardrails (can't change your own
--    role; only a super_admin may touch super_admin roles).
-- ============================================================================

-- Column-level lockdown: users (and admins, via RLS) may edit profile info,
-- but never the role column directly.
revoke update on public.profiles from anon, authenticated;
grant update (full_name, avatar_url, locale) on public.profiles to authenticated;

create or replace function public.admin_set_role(target_id uuid, new_role text)
returns text
language plpgsql
security definer
set search_path = public
as $$
declare
  caller_role public.user_role;
  target_role public.user_role;
begin
  select role into caller_role from public.profiles where id = auth.uid();
  if caller_role is null or caller_role not in ('admin', 'super_admin') then
    raise exception 'Only admins can manage account roles.';
  end if;

  if target_id = auth.uid() then
    raise exception 'You cannot change your own role.';
  end if;

  if new_role not in ('member', 'author', 'admin', 'super_admin') then
    raise exception 'Invalid role: %', new_role;
  end if;

  select role into target_role from public.profiles where id = target_id;
  if target_role is null then
    raise exception 'Account not found.';
  end if;

  -- Only a super_admin may demote a super_admin or grant super_admin.
  if (target_role = 'super_admin' or new_role = 'super_admin')
     and caller_role <> 'super_admin' then
    raise exception 'Only a super admin can manage super admin roles.';
  end if;

  update public.profiles
  set role = new_role::public.user_role
  where id = target_id;

  return new_role;
end;
$$;

grant execute on function public.admin_set_role(uuid, text) to authenticated;
revoke execute on function public.admin_set_role(uuid, text) from anon;
