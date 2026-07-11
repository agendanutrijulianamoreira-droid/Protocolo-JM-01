-- Seed de exemplo para desenvolvimento local.
-- cpf_hash abaixo é o bcrypt de "12345678909" (CPF de teste, dígitos válidos).
-- Gere hashes reais de produção com lib/auth/cpf-hash.ts (hashCpf).
insert into patients (id, nome, email, cpf_hash, cpf_ultimos_digitos, telefone)
values (
  '11111111-1111-1111-1111-111111111111',
  'Paciente Exemplo',
  'paciente.exemplo@teste.com',
  '$2b$10$5CigZ9dGYqzM1oXbYQwqOu2gLQ9nQnGZ0m0m8v3S1Vc1o4S5m6f2K',
  '909',
  '11999999999'
);

insert into recipes (id, titulo, descricao, ingredientes, modo_preparo, imagem_url, tags)
values (
  '22222222-2222-2222-2222-222222222222',
  'Omelete de Claras com Espinafre',
  'Café da manhã leve e rico em proteína',
  '[{"item":"claras de ovo","quantidade":"4","unidade":"unid"},{"item":"espinafre","quantidade":"1","unidade":"xícara"}]',
  'Bata as claras, refogue o espinafre e misture. Cozinhe em fogo baixo por 5 minutos.',
  null,
  array['cafe_da_manha']
);

insert into protocols (patient_id, fase_reino, metas, video_url, cardapio, receita_ids, suplementacao)
values (
  '11111111-1111-1111-1111-111111111111',
  'Anti-inflamatória',
  '[{"id":"1","titulo":"Beber 2L de água por dia","descricao":"Distribua ao longo do dia","concluida":false},{"id":"2","titulo":"Evitar ultraprocessados","descricao":"Prefira alimentos in natura","concluida":false}]',
  null,
  '{"segunda":[{"refeicao":"Café da manhã","descricao":"Omelete de claras com espinafre"}],"terca":[{"refeicao":"Café da manhã","descricao":"Vitamina de frutas vermelhas"}]}',
  array['22222222-2222-2222-2222-222222222222']::uuid[],
  '[{"nome":"Ômega 3","dose":"1g","horario":"Após o almoço","observacao":"Tomar com alimento"}]'
);
