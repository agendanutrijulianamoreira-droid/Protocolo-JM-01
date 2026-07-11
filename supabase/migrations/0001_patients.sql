-- Pacientes com acesso ao portal
create table patients (
  id uuid primary key default gen_random_uuid(),
  nome text not null,
  email text not null unique,
  cpf_hash text not null,              -- NUNCA texto puro (LGPD)
  cpf_ultimos_digitos text not null,   -- 3 últimos dígitos, usados na marca d'água
  telefone text,
  ativo boolean default true,
  criado_em timestamptz default now()
);

alter table patients enable row level security;

create policy "service_role_all_patients"
  on patients
  for all
  to service_role
  using (true)
  with check (true);
