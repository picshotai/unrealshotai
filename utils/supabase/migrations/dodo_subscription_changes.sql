-- Create subscription changes tracking table for audit trail and plan change management
create table public.dodo_subscription_changes (
  id uuid not null default extensions.uuid_generate_v4(),
  created_at timestamp with time zone not null default now(),
  user_id uuid not null references auth.users(id) on delete cascade,
  from_plan_id uuid references public.dodo_pricing_plans(id),
  to_plan_id uuid references public.dodo_pricing_plans(id),
  checkout_session_id text, -- DodoPayments checkout session ID
  status text not null check (status in ('pending', 'completed', 'failed', 'cancelled')),
  change_type text not null check (change_type in ('new', 'change', 'cancellation', 'reactivation')),
  reason text,
  completed_at timestamp with time zone,
  error_message text,
  metadata jsonb default '{}',
  constraint dodo_subscription_changes_pkey primary key (id)
);

-- Create indexes for efficient querying
create index dodo_subscription_changes_user_id_idx on public.dodo_subscription_changes (user_id);
create index dodo_subscription_changes_status_idx on public.dodo_subscription_changes (status);
create index dodo_subscription_changes_change_type_idx on public.dodo_subscription_changes (change_type);
create index dodo_subscription_changes_checkout_session_idx on public.dodo_subscription_changes (checkout_session_id);
create index dodo_subscription_changes_created_at_idx on public.dodo_subscription_changes (created_at desc);

-- Enable Row Level Security
alter table public.dodo_subscription_changes enable row level security;

-- RLS Policies
-- Users can view their own subscription changes
create policy "Users can view their own subscription changes"
  on public.dodo_subscription_changes
  for select
  to authenticated
  using (auth.uid() = user_id);

-- Service role can manage all subscription changes (for webhook processing)
create policy "Service role can manage subscription changes"
  on public.dodo_subscription_changes
  for all
  to service_role
  using (true)
  with check (true);

-- Users can insert their own subscription changes
create policy "Users can create their own subscription changes"
  on public.dodo_subscription_changes
  for insert
  to authenticated
  with check (auth.uid() = user_id);

-- Add helpful comments
comment on table public.dodo_subscription_changes is 'Tracks all subscription plan changes, cancellations, and reactivations for audit trail and business analytics';
comment on column public.dodo_subscription_changes.change_type is 'Type of change: new (first subscription), change (plan upgrade/downgrade), cancellation, reactivation';
comment on column public.dodo_subscription_changes.status is 'Status of the change: pending (awaiting payment), completed, failed, cancelled';
comment on column public.dodo_subscription_changes.checkout_session_id is 'DodoPayments checkout session ID for payment tracking';
comment on column public.dodo_subscription_changes.metadata is 'Additional metadata for the change (pricing details, promo codes, etc.)';