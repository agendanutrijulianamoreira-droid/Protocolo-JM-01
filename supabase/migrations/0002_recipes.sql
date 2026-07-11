-- Biblioteca de receitas reutilizável
-- (evita duplicar a mesma receita em cada protocolo)
create table recipes (
  id uuid primary key default gen_random_uuid(),
  titulo text not null,
  descricao text,
  ingredientes jsonb not null,         -- [{item, quantidade, unidade}]
  modo_preparo text not null,
  imagem_url text,
  tags text[],                         -- ex: {"cafe_da_manha","low_fodmap"}
  criado_em timestamptz default now()
);

alter table recipes enable row level security;

create policy "service_role_all_recipes"
  on recipes
  for all
  to service_role
  using (true)
  with check (true);
