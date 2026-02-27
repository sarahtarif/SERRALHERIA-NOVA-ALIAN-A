# 🚀 PASSO A PASSO: Configurar Variáveis na Vercel

## ⚠️ PROBLEMA ATUAL
Erro 500 nas APIs admin porque falta `SUPABASE_SERVICE_ROLE_KEY` na Vercel.

---

## 📋 PASSO 1: Acessar Vercel

1. Abra: https://vercel.com
2. Faça login
3. Você verá seus projetos

---

## 📋 PASSO 2: Selecionar o Projeto

1. Clique no projeto **nova-alianca** (ou nome similar)
2. Você verá a página do projeto

---

## 📋 PASSO 3: Ir para Environment Variables

1. No topo da página, clique em **Settings**
2. No menu lateral esquerdo, clique em **Environment Variables**
3. Você verá uma lista de variáveis (pode estar vazia)

---

## 📋 PASSO 4: Adicionar Cada Variável

Para CADA variável abaixo, faça:

### Como Adicionar:
1. Clique no botão **Add New**
2. Em **Key**, cole o nome da variável
3. Em **Value**, cole o valor
4. Em **Environments**, marque: ✅ Production ✅ Preview ✅ Development
5. Clique em **Save**

### Variáveis para Adicionar:

#### 1️⃣ NUXT_PUBLIC_SUPABASE_URL
```
Key: NUXT_PUBLIC_SUPABASE_URL
Value: https://lfznsbvruvjnugyzfyiw.supabase.co
Environments: ✅ Production ✅ Preview ✅ Development
```

#### 2️⃣ NUXT_PUBLIC_SUPABASE_ANON_KEY
```
Key: NUXT_PUBLIC_SUPABASE_ANON_KEY
Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxmem5zYnZydXZqbnVneXpmeWl3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE0NDMyMTQsImV4cCI6MjA4NzAxOTIxNH0._yHEub7uQccC6LYe8RKVSHQAEbPB3uYAiX0rMHCwsYk
Environments: ✅ Production ✅ Preview ✅ Development
```

#### 3️⃣ SUPABASE_SERVICE_ROLE_KEY ⚠️ MAIS IMPORTANTE
```
Key: SUPABASE_SERVICE_ROLE_KEY
Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxmem5zYnZydXZqbnVneXpmeWl3Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MTQ0MzIxNCwiZXhwIjoyMDg3MDE5MjE0fQ.-Iwq2Cc2RV1mvQM5bnXoG-gCW_EioUf_IFdQu5ibOUU
Environments: ✅ Production ✅ Preview ✅ Development
```

#### 4️⃣ NUXT_PUBLIC_WHATSAPP_NUMBER
```
Key: NUXT_PUBLIC_WHATSAPP_NUMBER
Value: 5511987115613
Environments: ✅ Production ✅ Preview ✅ Development
```

#### 5️⃣ NUXT_PUBLIC_COMPANY_NAME
```
Key: NUXT_PUBLIC_COMPANY_NAME
Value: Serralheria Nova Aliança
Environments: ✅ Production ✅ Preview ✅ Development
```

#### 6️⃣ NUXT_PUBLIC_COMPANY_ADDRESS
```
Key: NUXT_PUBLIC_COMPANY_ADDRESS
Value: São Paulo - SP
Environments: ✅ Production ✅ Preview ✅ Development
```

#### 7️⃣ NUXT_PUBLIC_COMPANY_EMAIL
```
Key: NUXT_PUBLIC_COMPANY_EMAIL
Value: contato@novaalianca.com.br
Environments: ✅ Production ✅ Preview ✅ Development
```

#### 8️⃣ NUXT_PUBLIC_COMPANY_PHONE
```
Key: NUXT_PUBLIC_COMPANY_PHONE
Value: (11) 98711-5613
Environments: ✅ Production ✅ Preview ✅ Development
```

---

## 📋 PASSO 5: Verificar Variáveis Adicionadas

Após adicionar todas, você deve ver 8 variáveis na lista:

- ✅ NUXT_PUBLIC_SUPABASE_URL
- ✅ NUXT_PUBLIC_SUPABASE_ANON_KEY
- ✅ SUPABASE_SERVICE_ROLE_KEY
- ✅ NUXT_PUBLIC_WHATSAPP_NUMBER
- ✅ NUXT_PUBLIC_COMPANY_NAME
- ✅ NUXT_PUBLIC_COMPANY_ADDRESS
- ✅ NUXT_PUBLIC_COMPANY_EMAIL
- ✅ NUXT_PUBLIC_COMPANY_PHONE

---

## 📋 PASSO 6: Fazer Redeploy

1. Clique em **Deployments** no topo
2. Você verá uma lista de deployments
3. Encontre o deployment mais recente (primeiro da lista)
4. Clique nos **3 pontinhos** (⋯) à direita
5. Clique em **Redeploy**
6. Confirme clicando em **Redeploy** novamente
7. Aguarde 2-3 minutos (você verá "Building...")
8. Quando aparecer "Ready", está pronto!

---

## 📋 PASSO 7: Testar em Produção

1. Abra seu site em produção (URL da Vercel)
2. Vá para: `https://seu-dominio.vercel.app/admin/login`
3. Faça login com:
   - Email: `samuel.tarif@gmail.com`
   - Senha: (sua senha)
4. Após login, vá para: `https://seu-dominio.vercel.app/admin/leads`
5. Se aparecer a lista de leads (ou "Nenhum lead encontrado"), **FUNCIONOU!** ✅
6. Se ainda aparecer erro 500, veja o Passo 8

---

## 📋 PASSO 8: Ver Logs de Erro (se necessário)

Se ainda houver erro:

1. Na Vercel, vá para **Deployments**
2. Clique no deployment ativo (primeiro da lista)
3. Role para baixo até **Function Logs**
4. Procure por erros relacionados a `/api/admin/leads`
5. Copie o erro e me envie

---

## ✅ CHECKLIST FINAL

Marque conforme for fazendo:

- [ ] Acessei Vercel
- [ ] Selecionei o projeto
- [ ] Fui para Settings > Environment Variables
- [ ] Adicionei NUXT_PUBLIC_SUPABASE_URL
- [ ] Adicionei NUXT_PUBLIC_SUPABASE_ANON_KEY
- [ ] Adicionei SUPABASE_SERVICE_ROLE_KEY (SEM NUXT_PUBLIC_)
- [ ] Adicionei NUXT_PUBLIC_WHATSAPP_NUMBER
- [ ] Adicionei NUXT_PUBLIC_COMPANY_NAME
- [ ] Adicionei NUXT_PUBLIC_COMPANY_ADDRESS
- [ ] Adicionei NUXT_PUBLIC_COMPANY_EMAIL
- [ ] Adicionei NUXT_PUBLIC_COMPANY_PHONE
- [ ] Marquei Production, Preview e Development em TODAS
- [ ] Fiz Redeploy
- [ ] Aguardei build completar
- [ ] Testei /admin/login em produção
- [ ] Testei /admin/leads em produção
- [ ] Funcionou! 🎉

---

## 🆘 AJUDA RÁPIDA

### Erro: "Variable already exists"
- A variável já existe, você pode editá-la clicando no ícone de lápis

### Erro: "Invalid value"
- Verifique se copiou o valor completo (sem espaços extras)

### Erro 500 persiste após redeploy
- Aguarde 5 minutos (cache do CDN)
- Limpe o cache do navegador (Ctrl+Shift+R)
- Verifique os Function Logs na Vercel

### Não encontro "Environment Variables"
- Certifique-se de estar em Settings (não Overview)
- Role o menu lateral para baixo

---

**Data**: 27/02/2026 11:20
**Prioridade**: 🔴 CRÍTICA
**Tempo estimado**: 10-15 minutos
