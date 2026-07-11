# PRD — Página de Protocolos Interativos
Data: 10/07/2026
Projeto: Novo, standalone (independente do NutriClub IA)

## O que será implementado

Um portal web separado onde cada paciente acessa, via e-mail + CPF, uma página
individual e personalizada contendo: metas do protocolo, vídeo explicativo,
cardápio qualitativo, receitas e sugestões de suplementação. Todo o conteúdo é
cadastrado manualmente pela Juliana (sem geração por IA). Prioridades: baixa
fricção de acesso, experiência visual "uau" alinhada à marca Rainha/Reino, e
proteção contra compartilhamento/cópia do conteúdo.

## Contexto — por que projeto separado

O NutriClub IA (github.com/agendanutrijulianamoreira-droid/meu-club-nutri-ia)
já tem um sistema de protocolos e dashboard do paciente, mas é multi-tenant,
gamificado (XP, moedas, streaks) e com geração de cardápio via IA — muito mais
pesado do que essa entrega precisa ser. Reaproveitar aquele código puxaria
complexidade desnecessária (auth multi-tenant, lib/gamification.ts, etc.) para
um caso de uso que é fundamentalmente mais simples: uma vitrine de conteúdo
que a própria Juliana cadastra à mão. Por isso a recomendação é um projeto
novo e enxuto.

## Stack recomendada

- **Next.js 14 (App Router) + TypeScript** — mesma stack dos outros projetos
  dela, reaproveita os padrões que o Cursor/Claude Code já conhecem bem.
- **Supabase (Postgres + Storage)** — conta já existe, MCP já conectado neste
  chat.
- **Tailwind CSS + shadcn/ui** — padrão já usado no Sales Navigator AI e na
  plataforma de telemedicina.
- **Deploy: Vercel** — MCP já conectado neste chat.
- Sem Supabase Auth "de prateleira" para o paciente — o login é um fluxo
  customizado (ver seção de autenticação), porque o par e-mail+CPF não é o
  modelo padrão de usuário/senha que o Supabase Auth espera.

## Decisões de simplicidade (o que NÃO fazer nesta versão)

- Sem multi-tenant — Juliana é a única profissional usando o sistema.
- Sem gamificação pesada (XP, moedas, ranking) — só barra de progresso de
  metas e uma micro-animação de conquista. Suficiente para o "uau" sem
  reconstruir o NutriClub IA.
- Sem geração de conteúdo por IA — cadastro 100% manual. Para o MVP, pode
  até ser feito direto no Supabase Studio (tabela `protocols`), antes de
  investir num painel admin bonito.
- Sem app mobile nativo — só web responsivo (mobile-first, já que a maioria
  vai acessar pelo link no WhatsApp).

---

## Modelo de acesso (autenticação)

**Recomendação: identificação por e-mail + CPF, sem senha, com verificação
por código enviado por e-mail (OTP) a cada dispositivo novo.**

Por quê:
1. **Senha é mais fácil de compartilhar que acesso ao e-mail.** "Usa meu
   login" é uma frase comum entre amigas; dar acesso à própria caixa de
   entrada, não.
2. **Senha gera fricção e suporte** (reset, "esqueci minha senha") que
   atrapalha a experiência premium que você quer entregar.
3. **CPF sozinho não deveria nunca ser usado como segredo/senha** — é um dado
   público-ish, fácil de obter sobre alguém. Ele serve bem como
   *identificador* (localizar o registro certo), não como prova de posse.
4. O código por e-mail resolve o gap: prova que quem está entrando tem
   acesso à caixa de entrada cadastrada — que é o que realmente identifica
   a pessoa.

**Importante ser transparente com você:** nenhum mecanismo de login impede
print de tela, gravação de tela ou a paciente simplesmente descrevendo o
protocolo pra alguém. O que esse fluxo faz é elevar a fricção de
compartilhamento casual e criar rastreabilidade — não criar um cadeado
perfeito. A proteção real de conteúdo (abaixo) é o que faz esse trabalho.

### Fluxo passo a passo

1. Paciente acessa `/acesso` e digita e-mail + CPF.
2. API route normaliza o CPF (remove pontuação), valida o dígito
   verificador (evita erro de digitação/CPF inválido) e compara o hash
   contra `patients.cpf_hash` pelo e-mail informado.
3. Se bater: gera um código de 6 dígitos, salva o **hash** do código em
   `otp_codes` com expiração de 10 minutos, envia por e-mail (Resend ou
   provedor similar).
4. Paciente digita o código em `/acesso/verificar`.
5. Se válido: cria cookie de sessão `httpOnly`, assinado (JWT via `jose`),
   contendo `patient_id`, validade de 30 dias, `sameSite=lax`, `secure`.
6. `middleware.ts` protege qualquer rota `/protocolo/*`: sem cookie válido,
   redireciona para `/acesso`.
7. Cada acesso autenticado grava uma linha em `access_logs` (IP + user
   agent) — dá visibilidade pra Juliana perceber se um mesmo protocolo está
   sendo acessado de muitos dispositivos/IPs diferentes.
8. Limite de sessões simultâneas (ex: 2 dispositivos ativos por paciente).
   Um terceiro dispositivo força novo OTP e dispara e-mail de alerta:
   "Detectamos um novo acesso ao seu protocolo."

---

## Estratégia anti-compartilhamento / anti-cópia (camada de conteúdo)

Esta é a parte que realmente protege o material, mais do que o login:

- **Vídeo nunca com link público direto.** Usar Supabase Storage com signed
  URL de curta duração (renovada a cada carregamento de página) ou um
  serviço como Bunny Stream/Vimeo com domain-lock.
- **Marca d'água dinâmica**: sobrepor discretamente o nome da paciente + os
  3 últimos dígitos do CPF no canto do vídeo e em qualquer PDF exportável.
  Não impede print, mas rastreia a origem se algo vazar — e desestimula
  psicologicamente, porque ninguém quer espalhar um material com o próprio
  nome carimbado nele.
- **Desabilitar seleção de texto / clique direito** nas páginas de cardápio
  e receitas (CSS `user-select: none` + bloqueio de `contextmenu`). É um
  deterrent simples, não é proteção real, mas reduz a cópia casual de quem
  não tem intenção deliberada.
- **PDF de download (se oferecer) sempre gerado sob demanda**, já com a
  marca d'água, nunca um arquivo estático genérico.

---

## Elementos de experiência "uau"

- Tela de boas-vindas personalizada e animada: "Bem-vinda ao seu protocolo,
  [Nome]" no primeiro acesso do dia.
- Paleta e tipografia da marca aplicadas em todo o portal: creme `#F4EFE4`,
  marrom escuro `#2B1A10`, dourado `#C9A435`, tipografia Georgia serif —
  reforça a identidade Rainha/Reino que já é reconhecida pelas pacientes.
- Navegação em trilha/abas: **Metas → Vídeo → Cardápio → Receitas →
  Suplementação**, com indicador visual de progresso entre elas.
- Metas com checklist interativo (a paciente marca o que já cumpriu) e
  barra de progresso que se enche suavemente — sensação de conquista sem
  reconstruir todo o sistema de gamificação do NutriClub IA.
- Micro-animação dourada e discreta ao completar uma meta.
- Cardápio em abas por dia da semana, cards de refeição com foto das
  receitas.
- Botão "Baixar meu protocolo em PDF" (já com marca d'água).
- Mobile-first: layout pensado primeiro pro celular.

---

## Estrutura de pastas

```
protocolo-interativo/
├── app/
│   ├── layout.tsx                       # Layout raiz, fontes, providers
│   ├── page.tsx                         # Redireciona para /acesso
│   ├── globals.css
│   ├── acesso/
│   │   ├── page.tsx                     # Formulário e-mail + CPF
│   │   └── verificar/
│   │       └── page.tsx                 # Tela do código OTP
│   ├── protocolo/
│   │   ├── layout.tsx                   # Nav lateral/tabs, header da paciente
│   │   ├── page.tsx                     # Página principal (server component)
│   │   └── loading.tsx
│   └── api/
│       ├── auth/
│       │   ├── request-access/route.ts  # recebe e-mail+CPF, valida, dispara OTP
│       │   ├── verify-otp/route.ts      # valida OTP, cria cookie de sessão
│       │   └── logout/route.ts
│       └── protocolo/
│           └── pdf/route.ts             # gera PDF sob demanda com marca d'água
│
├── components/
│   ├── acesso/
│   │   ├── FormularioAcesso.tsx
│   │   └── FormularioOTP.tsx
│   ├── protocolo/
│   │   ├── HeaderProtocolo.tsx          # nome, foto, progresso geral
│   │   ├── MetasCard.tsx                # checklist + barra de progresso
│   │   ├── VideoExplicativo.tsx         # player com URL assinada
│   │   ├── CardapioQualitativo.tsx      # abas por dia
│   │   ├── ReceitasGrid.tsx
│   │   ├── ReceitaModal.tsx
│   │   └── SuplementacaoLista.tsx
│   └── ui/                              # componentes shadcn/ui
│
├── lib/
│   ├── supabase/
│   │   ├── server.ts                    # client server-side (service role)
│   │   └── client.ts                    # client browser-side (anon key)
│   ├── auth/
│   │   ├── session.ts                   # criar/validar cookie JWT (jose)
│   │   ├── cpf.ts                       # normalização + validação de dígito
│   │   └── otp.ts                       # geração/validação de código
│   ├── watermark.ts                     # marca d'água dinâmica em PDF/vídeo
│   └── utils.ts
│
├── types/
│   └── database.ts                      # tipos gerados do Supabase
│
├── middleware.ts                        # protege /protocolo/*
├── supabase/
│   ├── migrations/
│   │   ├── 0001_patients.sql
│   │   ├── 0002_recipes.sql
│   │   ├── 0003_protocols.sql
│   │   ├── 0004_otp_codes.sql
│   │   └── 0005_access_logs.sql
│   └── seed.sql
├── .env.local.example
├── next.config.js
├── tailwind.config.ts
└── package.json
```

---

## Modelo de dados (schema SQL)

```sql
-- Pacientes com acesso ao portal
create table patients (
  id uuid primary key default gen_random_uuid(),
  nome text not null,
  email text not null unique,
  cpf_hash text not null,              -- NUNCA texto puro (LGPD)
  telefone text,
  ativo boolean default true,
  criado_em timestamptz default now()
);

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

-- Protocolo individual de cada paciente
create table protocols (
  id uuid primary key default gen_random_uuid(),
  patient_id uuid references patients(id) on delete cascade,
  fase_reino text,                     -- ex: "Anti-inflamatória"
  metas jsonb not null,                -- [{titulo, descricao, concluida}]
  video_url text,
  cardapio jsonb not null,             -- {segunda: [...], terca: [...]}
  receita_ids uuid[],                  -- referencia recipes.id
  suplementacao jsonb not null,        -- [{nome, dose, horario, observacao}]
  ativo boolean default true,
  criado_em timestamptz default now(),
  atualizado_em timestamptz default now()
);

-- Códigos de verificação por e-mail (OTP)
create table otp_codes (
  id uuid primary key default gen_random_uuid(),
  patient_id uuid references patients(id) on delete cascade,
  code_hash text not null,
  expira_em timestamptz not null,
  usado boolean default false,
  criado_em timestamptz default now()
);

-- Log de acessos — visibilidade contra compartilhamento
create table access_logs (
  id uuid primary key default gen_random_uuid(),
  patient_id uuid references patients(id) on delete cascade,
  ip text,
  user_agent text,
  criado_em timestamptz default now()
);
```

**RLS**: habilitar Row Level Security em todas as tabelas e restringir acesso
apenas ao `service_role` (nunca `anon`/`public`). Toda leitura/escrita passa
pelas API routes do Next.js, que usam a service key no servidor — o paciente
nunca fala direto com o Supabase.

---

## Bibliotecas a usar

- `jose` — assinar/verificar o cookie de sessão (JWT)
- `resend` (ou provedor de e-mail equivalente) — envio do código OTP
- `zod` — validação de formulários e payloads de API
- `react-hook-form` — formulário de acesso
- `date-fns` — datas e expiração de sessão/OTP

---

## Próximo passo sugerido

Este PRD é o ponto de partida. Sugestão: levar este arquivo para uma sessão
no Claude Code, gerar o `Spec.md` (arquivo por arquivo, ação exata) e só
depois partir para a implementação — seguindo seu próprio método de 3
etapas com reset de contexto entre elas.
