create table public.dodo_webhook_events (
  id uuid not null default extensions.uuid_generate_v4(),
  created_at timestamp with time zone not null default now(),
  dodo_event_id text unique not null, -- dodopayments event ID
  event_type text not null, -- payment.completed, subscription.created, etc.
  processed boolean not null default false,
  processed_at timestamp with time zone,
  data jsonb not null, -- full webhook payload
  error_message text,
  retry_count integer not null default 0,
  constraint dodo_webhook_events_pkey primary key (id)
);

create index dodo_webhook_events_dodo_event_id_idx on public.dodo_webhook_events (dodo_event_id);
create index dodo_webhook_events_event_type_idx on public.dodo_webhook_events (event_type);
create index dodo_webhook_events_processed_idx on public.dodo_webhook_events (processed);