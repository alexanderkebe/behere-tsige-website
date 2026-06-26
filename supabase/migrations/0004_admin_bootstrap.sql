-- ============================================================================
-- Behere Tsige — Admin bootstrap
-- Auto-grants admin role to allow-listed emails on signup, and promotes any
-- matching account that already exists. Edit the allow-list as needed.
-- ============================================================================

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  admin_emails text[] := array['alexanderkebe@gmail.com'];
begin
  insert into public.profiles (id, full_name, email, avatar_url, role)
  values (
    new.id,
    new.raw_user_meta_data ->> 'full_name',
    new.email,
    new.raw_user_meta_data ->> 'avatar_url',
    case when new.email = any (admin_emails) then 'admin'::public.user_role
         else 'member'::public.user_role end
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

-- Promote already-registered allow-listed accounts.
update public.profiles
set role = 'admin'
where email = any (array['alexanderkebe@gmail.com'])
  and role not in ('admin', 'super_admin');
