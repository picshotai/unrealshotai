create table public.dodo_subscriptions (
  id uuid not null default extensions.uuid_generate_v4(),
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now(),
  user_id uuid not null,
  dodo_subscription_id text unique, -- dodopayments subscription ID
  -- dodo_customer_id removed - not using customer management in DodoPayments
  pricing_plan_id uuid not null,
  status text not null default 'pending', -- pending, active, cancelled, expired
  metadata jsonb default '{}',
  constraint dodo_subscriptions_pkey primary key (id),
  constraint dodo_subscriptions_user_id_fkey foreign key (user_id) references auth.users (id),
  constraint dodo_subscriptions_pricing_plan_id_fkey foreign key (pricing_plan_id) references dodo_pricing_plans (id)
);

create index dodo_subscriptions_user_id_idx on public.dodo_subscriptions (user_id);
create index dodo_subscriptions_dodo_subscription_id_idx on public.dodo_subscriptions (dodo_subscription_id);
create index dodo_subscriptions_status_idx on public.dodo_subscriptions (status);