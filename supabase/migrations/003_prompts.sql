create table public.one_day_followup_emails (
  user_id uuid not null,
  sent_at timestamp with time zone null default now(),
  constraint one_day_followup_emails_pkey primary key (user_id),
  constraint one_day_followup_emails_user_id_fkey foreign KEY (user_id) references auth.users (id)
) TABLESPACE pg_default;