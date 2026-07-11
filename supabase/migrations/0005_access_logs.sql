-- Log de acessos — visibilidade contra compartilhamento
create table access_logs (
  id uuid primary key default gen_random_uuid(),
  patient_id uuid references patients(id) on delete cascade,
  ip text,
  user_agent text,
  criado_em timestamptz default now()
);

create index access_logs_patient_id_idx on access_logs(patient_id);

alter table access_logs enable row level security;

create policy "service_role_all_access_logs"
  on access_logs
  for all
  to service_role
  using (true)
  with check (true);
