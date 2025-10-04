-- Enable Row Level Security on models table
alter table public.models enable row level security;

-- Allow users to SELECT their own models
create policy "Users can view their own models"
  on public.models
  for select
  using (auth.uid() = user_id);

-- Allow users to INSERT models for themselves
create policy "Users can create their own models"
  on public.models
  for insert
  with check (auth.uid() = user_id);

-- Allow users to UPDATE their own models
create policy "Users can update their own models"
  on public.models
  for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Allow users to DELETE their own models
create policy "Users can delete their own models"
  on public.models
  for delete
  using (auth.uid() = user_id);