-- Admin accounts are provisioned privately with a server-side credential.
-- Email addresses and user-editable metadata must never grant admin access.
-- This changes future provisioning only; it does not delete or demote users.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, email, avatar_url, role)
  values (
    new.id,
    new.raw_user_meta_data ->> 'full_name',
    new.email,
    new.raw_user_meta_data ->> 'avatar_url',
    'member'::public.user_role
  )
  on conflict (id) do nothing;
  return new;
end;
$$;
