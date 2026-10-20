# Itschool

SaaS para escolas pequenas e médias: mensalidades no controle e comunicação sem ruído entre escola, professores e famílias.

Esta é a reconstrução do app feito no Lovable (`dasdobras08/facil-mensal-pago`), seguindo o plano de reconstrução do projeto.

## Stack

- [Next.js](https://nextjs.org) 16 (App Router) com TypeScript
- Tailwind CSS 4
- [Supabase](https://supabase.com): Postgres, login e regras de acesso por escola (RLS)
- Vitest para testes de unidade e um script SQL para testar as regras do banco

## Estrutura

| Caminho | O que tem |
| --- | --- |
| `src/app/entrar`, `src/app/auth` | Login por link mágico e saída |
| `src/app/inicio`, `src/app/escolher`, `src/app/nova-escola` | Para onde cada pessoa vai depois do login |
| `src/app/painel` | Área da equipe da escola (admin e professores) |
| `src/app/familia` | Área dos responsáveis, feita para o celular |
| `src/lib/navigation.ts` | Menu agrupado e quem vê cada item |
| `src/lib/session.ts` | Pessoa logada e escola ativa |
| `supabase/migrations` | Banco de dados |
| `db-tests` | Testes das regras de acesso do banco |

## Rodando localmente

1. Instale as dependências: `npm install`
2. Crie um projeto no Supabase (ou rode `npx supabase start` com Docker) e aplique as migrações: `npx supabase db push`
3. Copie `.env.example` para `.env.local` e preencha a URL e a chave pública do projeto
4. No painel do Supabase, em Authentication > URL Configuration, adicione `http://localhost:3000/auth/confirm` às URLs de redirecionamento
5. Rode `npm run dev` e abra http://localhost:3000

## Testes

- `npm test`: testes de unidade
- `npm run test:db`: aplica as migrações em um banco Postgres descartável e testa as regras de acesso. Precisa de um Postgres acessível pelo `psql` (variáveis `PGHOST`, `PGUSER`, `PGPASSWORD`)
- `npm run lint` e `npm run typecheck`

O GitHub Actions roda tudo isso em cada pull request.

## Perfis

| Perfil | Área | O que pode fazer hoje |
| --- | --- | --- |
| Admin | `/painel` | Tudo da escola, inclusive dados da escola |
| Professor | `/painel` | Alunos, turmas e comunicação (sem financeiro) |
| Responsável | `/familia` | Ver a escola dos filhos |

Uma pessoa pode ter vários perfis e várias escolas; ela escolhe onde entrar em `/escolher`.
