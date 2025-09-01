create table public.dodo_pricing_plans (
  id uuid not null default extensions.uuid_generate_v4(),
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now(),
  name text not null,
  description text,
  price numeric(10, 2) not null,
  credits integer not null,
  currency text not null default 'USD',
  dodo_product_id text, -- dodopayments product ID
  is_active boolean not null default true,
  metadata jsonb default '{}',
  constraint dodo_pricing_plans_pkey primary key (id)
);

create index dodo_pricing_plans_active_idx on public.dodo_pricing_plans (is_active);
create index dodo_pricing_plans_dodo_product_id_idx on public.dodo_pricing_plans (dodo_product_id);