# Configurar Variáveis de Ambiente no Vercel

## 🎯 Objetivo
Adicionar as variáveis de ambiente necessárias para o projeto funcionar em produção.

---

## 📋 Passo a Passo

### 1. Acessar Configurações do Projeto
1. Acesse: https://vercel.com/sarahtarif/novalianca/settings/environment-variables
2. Ou vá em: Dashboard → Projeto "novalianca" → Settings → Environment Variables

### 2. Adicionar Variáveis de Ambiente

Clique em "Add New" e adicione cada variável abaixo:

#### Supabase Configuration
```
Name: NUXT_PUBLIC_SUPABASE_URL
Value: https://lfznsbvruvjnugyzfyiw.supabase.co
Environment: Production, Preview, Development (marcar todos)
```

```
Name: NUXT_PUBLIC_SUPABASE_ANON_KEY
Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxmem5zYnZydXZqbnVneXpmeWl3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE0NDMyMTQsImV4cCI6MjA4NzAxOTIxNH0._yHEub7uQccC6LYe8RKVSHQAEbPB3uYAiX0rMHCwsYk
Environment: Production, Preview, Development (marcar todos)
```

#### WhatsApp Configuration
```
Name: NUXT_PUBLIC_WHATSAPP_NUMBER
Value: 5511987115613
Environment: Production, Preview, Development (marcar todos)
```

#### Company Information
```
Name: NUXT_PUBLIC_COMPANY_NAME
Value: Serralheria Nova Aliança
Environment: Production, Preview, Development (marcar todos)
```

```
Name: NUXT_PUBLIC_COMPANY_ADDRESS
Value: São Paulo - SP
Environment: Production, Preview, Development (marcar todos)
```

```
Name: NUXT_PUBLIC_COMPANY_EMAIL
Value: contato@novaalianca.com.br
Environment: Production, Preview, Development (marcar todos)
```

```
Name: NUXT_PUBLIC_COMPANY_PHONE
Value: (11) 98711-5613
Environment: Production, Preview, Development (marcar todos)
```

---

## 🔄 Após Adicionar as Variáveis

### Opção 1: Redeploy Automático
O Vercel pode fazer redeploy automaticamente após adicionar variáveis.

### Opção 2: Redeploy Manual
1. Vá em: Deployments
2. Clique nos 3 pontinhos do último deploy
3. Clique em "Redeploy"
4. Confirme

---

## ✅ Verificar se Funcionou

Após o redeploy:
1. Acesse: https://novalianca.vercel.app/cliente/cadastro
2. Tente criar uma conta
3. Verifique se não há mais erros de conexão

---

## 🔍 Troubleshooting

### Erro: "Failed to fetch"
- Verifique se as variáveis do Supabase estão corretas
- Verifique se marcou todos os ambientes (Production, Preview, Development)

### Erro: "Invalid API key"
- Verifique se copiou a ANON_KEY completa (é uma string longa)
- Não deve ter espaços no início ou fim

### Variáveis não aparecem
- Aguarde alguns segundos após salvar
- Faça um redeploy manual

---

**Status**: ⏳ Aguardando configuração das variáveis no Vercel
**Última atualização**: 27 de fevereiro de 2026
