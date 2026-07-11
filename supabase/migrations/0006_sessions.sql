-- Sessões ativas por paciente — necessário para aplicar o limite de
-- dispositivos simultâneos e disparar o alerta de novo acesso (PRD, item 8).
create table sessions (
  id uuid primary key default gen_random_uuid(),
  patient_id uuid references patients(id) on delete cascade,
  jti text not null unique,            -- identificador do JWT emitido
  ip text,
  user_agent text,
  criado_em timestamptz default now(),
  expira_em timestamptz not null,
  revogada_em timestamptz
);

create index sessions_patient_id_idx on sessions(patient_id);

alter table sessions enable row level security;

create policy "service_role_all_sessions"
  on sessions
  for all
  to service_role
  using (true)
  with check (true);
