-- Protocolo individual de cada paciente
create table protocols (
  id uuid primary key default gen_random_uuid(),
  patient_id uuid references patients(id) on delete cascade,
  fase_reino text,                     -- ex: "Anti-inflamatória"
  metas jsonb not null,                -- [{id, titulo, descricao, concluida}]
  video_url text,                      -- caminho no Supabase Storage (bucket privado)
  cardapio jsonb not null,             -- {segunda: [...], terca: [...]}
  receita_ids uuid[],                  -- referencia recipes.id
  suplementacao jsonb not null,        -- [{nome, dose, horario, observacao}]
  ativo boolean default true,
  criado_em timestamptz default now(),
  atualizado_em timestamptz default now()
);

create index protocols_patient_id_idx on protocols(patient_id);

alter table protocols enable row level security;

create policy "service_role_all_protocols"
  on protocols
  for all
  to service_role
  using (true)
  with check (true);
