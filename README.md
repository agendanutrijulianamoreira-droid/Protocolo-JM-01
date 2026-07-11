# Protocolo Interativo

Portal onde cada paciente acessa, via e-mail + CPF, seu protocolo individual
(metas, vídeo, cardápio, receitas e suplementação). Ver `PRD.md` para o
documento de produto completo.

## Stack

Next.js 14 (App Router) + TypeScript, Tailwind CSS, Supabase (Postgres +
Storage), Vercel.

## Setup local

```bash
npm install
cp .env.local.example .env.local   # preencha as variáveis
npm run dev
```

### Variáveis de ambiente

Veja `.env.local.example`. Resumo:

- `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`,
  `SUPABASE_SERVICE_ROLE_KEY` — projeto Supabase.
- `SESSION_SECRET` — segredo usado para assinar o cookie de sessão (JWT).
  Gere um valor longo e aleatório, ex.: `openssl rand -base64 32`.
- `RESEND_API_KEY`, `EMAIL_FROM` — envio dos e-mails de código de acesso e
  alerta de novo dispositivo. Sem essa chave, os e-mails são apenas logados
  no console (útil em desenvolvimento).

### Banco de dados

As migrations estão em `supabase/migrations/`, aplicadas em ordem numérica.
Rode-as no seu projeto Supabase (SQL Editor ou `supabase db push`). Todas as
tabelas têm RLS habilitada e restrita ao `service_role` — o paciente nunca
acessa o Supabase diretamente, só pelas API routes do Next.js.

`supabase/seed.sql` contém um paciente e protocolo de exemplo para testes
locais (CPF de teste: `123.456.789-09`).

### Storage

Vídeos ficam num bucket **privado** do Supabase Storage chamado
`protocolos-videos` (ver `app/protocolo/page.tsx`). O player recebe uma
signed URL gerada a cada carregamento da página, nunca um link público.

### Cadastro de conteúdo

Para o MVP, o cadastro de pacientes, protocolos e receitas é manual, direto
no Supabase Studio (tabelas `patients`, `protocols`, `recipes`) — não há
painel administrativo nesta versão.
