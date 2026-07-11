-- Códigos de verificação por e-mail (OTP)
create table otp_codes (
  id uuid primary key default gen_random_uuid(),
  patient_id uuid references patients(id) on delete cascade,
  code_hash text not null,
  expira_em timestamptz not null,
  usado boolean default false,
  criado_em timestamptz default now()
);

create index otp_codes_patient_id_idx on otp_codes(patient_id);

alter table otp_codes enable row level security;

create policy "service_role_all_otp_codes"
  on otp_codes
  for all
  to service_role
  using (true)
  with check (true);
