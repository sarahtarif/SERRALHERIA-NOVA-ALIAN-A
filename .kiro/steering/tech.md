---
inclusion: always
---

# Tech Stack

## Framework & Runtime
- **Nuxt 4** (Vue 3 + Nitro server) — `nuxt ^4.3.1`
- **TypeScript** obrigatório em todos os arquivos (`lang="ts"` nos SFCs)
- **Tailwind CSS** via `@nuxtjs/tailwindcss`

## Backend / Banco de dados
- **Supabase** — Postgres + Auth + Storage
- Client-side: `@supabase/supabase-js` via `app/composables/useSupabase.ts`
- Server-side: service role key em `server/` via `runtimeConfig.supabaseServiceRoleKey`
- **Nitro** (server Nuxt) para rotas API em `server/api/`
- Rate limiting via `server/middleware/rate-limiter.ts`

## Utilitários
- `@vueuse/core` — composables utilitários Vue
- `clsx` + `tailwind-merge` + `class-variance-authority` — utilitários de classes CSS
- `nodemailer` — envio de emails (Gmail SMTP)
- `@vercel/analytics` — analytics de produção

## Testes
- **Vitest** — framework de testes
- Testes em `tests/` (services, composables, security, middleware)

## Deploy
- **Vercel** — plataforma de deploy
- Variáveis de ambiente definidas no Vercel e localmente em `.env`

## Comandos comuns
```bash
# Desenvolvimento
npm run dev

# Build de produção
npm run build

# Rodar testes (single run)
npm run test
# ou
npx vitest run

# Testes em watch mode
npm run test:watch

# Gerar tipos Nuxt
npm run postinstall
```

## Variáveis de ambiente relevantes
```
NUXT_PUBLIC_SUPABASE_URL
NUXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
GMAIL_EMAIL
GMAIL_APP_PASSWORD
SECURITY_ALERT_EMAIL
NUXT_PUBLIC_WHATSAPP_NUMBER
NUXT_PUBLIC_COMPANY_NAME
```
