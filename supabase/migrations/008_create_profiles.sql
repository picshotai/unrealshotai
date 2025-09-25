-- Create profiles table to store user profile information and onboarding status
create table public.profiles (
   id uuid not null primary key,
   user_id uuid not null references auth.users(id) on delete cascade,
   created_at timestamp with time zone not null default now(),
   updated_at timestamp with time zone not null default now(),
   has_completed_onboarding boolean not null default false,
   constraint profiles_user_id_unique unique (user_id)
);

-- Create index for faster queries
CREATE INDEX profiles_user_id_idx ON public.profiles (user_id);
CREATE INDEX profiles_onboarding_idx ON public.profiles (has_completed_onboarding);

-- Enable RLS
alter table public.profiles enable row level security;

-- Create policies
-- Users can view their own profile
create policy "Users can view own profile" 
    on public.profiles 
    for select 
    to authenticated 
    using (auth.uid() = user_id);

-- Users can update their own profile
create policy "Users can update own profile" 
    on public.profiles 
    for update 
    to authenticated 
    using (auth.uid() = user_id);

-- Create function to automatically create a profile when a user signs up
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, user_id)
  values (new.id, new.id);
  return new;
end;
$$ language plpgsql security definer;

-- Drop existing trigger if it exists
drop trigger if exists on_auth_user_created on auth.users;

-- Create trigger to automatically create profile on user signup
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();