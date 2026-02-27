# ⚠️ CONFIGURAR VARIÁVEIS DE AMBIENTE NA VERCEL - URGENTE

## Problema
APIs admin retornando erro 500 em produção porque falta a `SUPABASE_SERVICE_ROLE_KEY`.

## Solução: Adicionar Variáveis na Vercel

### 1. Acesse o Projeto na Vercel
1. Vá para https://vercel.com
2. Faça login
3. Selecione o projeto "nova-alianca" (ou nome do seu projeto)

### 2. Vá para Settings > Environment Variables
1. No menu lateral, clique em **Settings**
2. Clique em **Environment Variables**

### 3. Adicione as Variáveis Necessárias

Adicione TODAS estas variáveis (copie do seu arquivo `.env` local):

#### Variáveis Supabase (OBRIGATÓRIAS)
```
NUXT_PUBLIC_SUPABASE_URL=https://lfznsbvruvjnugyzfyiw.supabase.co
```

```
NUXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxmem5zYnZydXZqbnVneXpmeWl3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE0NDMyMTQsImV4cCI6MjA4NzAxOTIxNH0._yHEub7uQccC6LYe8RKVSHQAEbPB3uYAiX0rMHCwsYk
```

```
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxmem5zYnZydXZqbnVneXpmeWl3Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MTQ0MzIxNCwiZXhwIjoyMDg3MDE5MjE0fQ.-Iwq2Cc2RV1mvQM5bnXoG-gCW_EioUf_IFdQu5ibOUU
```

#### Variáveis WhatsApp
```
NUXT_PUBLIC_WHATSAPP_NUMBER=5511999999999
```

#### Variáveis da Empresa
```
NUXT_PUBLIC_COMPANY_NAME=Serralheria Nova Aliança
NUXT_PUBLIC_COMPANY_ADDRESS=São Paulo - SP
NUXT_PUBLIC_COMPANY_EMAIL=contato@novaalianca.com.br
NUXT_PUBLIC_COMPANY_PHONE=(11) 99999-9999
```

### 4. Configurar Ambientes

Para CADA variável, selecione os ambientes:
- ✅ Production
- ✅ Preview
- ✅ Development

### 5. Salvar e Redeploy

Após adicionar todas as variáveis:

1. Clique em **Save**
2. Vá para a aba **Deployments**
3. Encontre o último deployment
4. Clique nos 3 pontinhos (⋯)
5. Clique em **Redeploy**
6. Aguarde o build completar (2-3 minutos)

## ⚠️ IMPORTANTE

### Variável Crítica para Admin
A variável **SUPABASE_SERVICE_ROLE_KEY** é ESSENCIAL para:
- `/api/admin/leads` funcionar
- `/api/admin/orcamentos` funcionar
- `/api/admin/clients` funcionar
- `/api/admin/dashboard` funcionar

Sem ela, todas as APIs admin retornam erro 500.

### Segurança
- ❌ NUNCA use `NUXT_PUBLIC_` no Service Role Key
- ✅ Use apenas `SUPABASE_SERVICE_ROLE_KEY` (sem prefixo)
- Esta chave só é acessível no servidor, nunca no frontend

## Verificar se Funcionou

Após o redeploy:

1. Acesse: https://seu-dominio.vercel.app/admin/login
2. Faça login com: samuel.tarif@gmail.com
3. Vá para: https://seu-dominio.vercel.app/admin/leads
4. Se aparecer a lista de leads (ou "Nenhum lead encontrado"), funcionou! ✅
5. Se aparecer erro 500, verifique os logs da Vercel

## Ver Logs de Erro na Vercel

Se ainda houver erro:

1. Vá para a aba **Deployments**
2. Clique no deployment ativo
3. Clique em **Functions**
4. Procure por `/api/admin/leads`
5. Veja os logs de erro

## Checklist Rápido

- [ ] Adicionei `NUXT_PUBLIC_SUPABASE_URL`
- [ ] Adicionei `NUXT_PUBLIC_SUPABASE_ANON_KEY`
- [ ] Adicionei `SUPABASE_SERVICE_ROLE_KEY` (SEM prefixo NUXT_PUBLIC_)
- [ ] Selecionei Production, Preview e Development para todas
- [ ] Salvei as variáveis
- [ ] Fiz Redeploy
- [ ] Aguardei o build completar
- [ ] Testei /admin/leads em produção

## Comandos Úteis (Opcional)

Se preferir usar CLI da Vercel:

```bash
# Instalar CLI
npm i -g vercel

# Login
vercel login

# Adicionar variável
vercel env add SUPABASE_SERVICE_ROLE_KEY production

# Redeploy
vercel --prod
```

## Próximos Passos

Após configurar as variáveis:

1. ✅ Testar login admin em produção
2. ✅ Testar listagem de leads
3. ✅ Testar criação de lead
4. ✅ Testar dashboard com KPIs
5. ✅ Testar orçamentos

---

**Data**: 27/02/2026 11:15
**Status**: URGENTE - Produção quebrada sem estas variáveis
