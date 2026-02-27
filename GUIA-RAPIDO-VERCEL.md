# Guia Rápido: Resolver Erro Vercel Deploy
## Nova Aliança

---

## 🎯 Problema

```
Git author samueltarif must have access to the project on Vercel
```

---

## ⚡ Solução Mais Rápida (5 minutos)

### Opção A: Você TEM acesso ao Vercel Dashboard

1. **Acesse**: https://vercel.com/dashboard
2. **Selecione** o projeto "nova-alianca"
3. **Clique** em "Settings" (⚙️)
4. **Clique** em "Members" ou "Team"
5. **Clique** em "Invite Member"
6. **Digite**: `samueltarif` (username do GitHub)
7. **Selecione**: Role "Developer" ou "Admin"
8. **Clique** em "Send Invite"
9. **Aceite** o convite no email
10. **Faça** novo push para testar

✅ **Pronto!** Deploy deve funcionar agora.

---

### Opção B: Você NÃO tem acesso ao Vercel Dashboard

#### Criar Novo Projeto (10 minutos)

1. **Acesse**: https://vercel.com/new
2. **Login** com conta GitHub `samueltarif`
3. **Clique** em "Import Git Repository"
4. **Selecione**: `samueltarif/nova-alianca`
5. **Configure**:
   - Project Name: `nova-alianca`
   - Framework: `Nuxt.js`
   - Root Directory: `./`
   - Build Command: `npm run build`
   - Output Directory: `.output/public`

6. **Adicione Variáveis de Ambiente** (copie do `.env`):

```env
NUXT_PUBLIC_SUPABASE_URL=https://lfznsbvruvjnugyzfyiw.supabase.co
NUXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxmem5zYnZydXZqbnVneXpmeWl3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE0NDMyMTQsImV4cCI6MjA4NzAxOTIxNH0._yHEub7uQccC6LYe8RKVSHQAEbPB3uYAiX0rMHCwsYk
NUXT_PUBLIC_WHATSAPP_NUMBER=5511987115613
NUXT_PUBLIC_COMPANY_NAME=Serralheria Nova Aliança
NUXT_PUBLIC_COMPANY_ADDRESS=São Paulo - SP
NUXT_PUBLIC_COMPANY_EMAIL=contato@novaalianca.com.br
NUXT_PUBLIC_COMPANY_PHONE=(11) 98711-5613
GMAIL_EMAIL=qualitecinstrumentosdemedicao@gmail.com
GMAIL_APP_PASSWORD=byeqpdyllakkwxkk
SECURITY_ALERT_EMAIL=qualitecinstrumentosdemedicao@gmail.com
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_FROM=noreply@qualitec.com.br
EMAIL_USER=qualitecinstrumentosdemedicao@gmail.com
EMAIL_PASS=byeqpdyllakkwxkk
```

7. **Clique** em "Deploy"
8. **Aguarde** 2-3 minutos
9. ✅ **Pronto!** Projeto deployado

---

## 🔍 Como Saber Qual Opção Usar?

### Teste Rápido:

1. Acesse: https://vercel.com/dashboard
2. Você vê o projeto "nova-alianca"?
   - ✅ **SIM** → Use Opção A (adicionar colaborador)
   - ❌ **NÃO** → Use Opção B (criar novo projeto)

---

## 📋 Checklist Pós-Deploy

Após resolver o problema:

- [ ] Deploy automático funcionando
- [ ] Site acessível na URL Vercel
- [ ] Variáveis de ambiente configuradas
- [ ] Supabase conectado (teste login)
- [ ] Emails de alerta funcionando (teste)
- [ ] Todas as páginas carregando
- [ ] Área admin acessível
- [ ] Área cliente acessível

---

## 🧪 Testar Deploy

```bash
# 1. Fazer pequena alteração
echo "# Deploy test" >> README.md

# 2. Commit
git add README.md
git commit -m "test: Testar deploy automático"

# 3. Push
git push origin main

# 4. Verificar
# Acesse: https://vercel.com/dashboard
# Veja se deploy iniciou automaticamente
```

---

## ⚠️ Problemas Comuns

### 1. Deploy Falha com Erro de Build

**Causa**: Variáveis de ambiente faltando

**Solução**:
1. Vercel Dashboard → Settings → Environment Variables
2. Adicione TODAS as variáveis do `.env`
3. Clique em "Redeploy"

### 2. Site Carrega mas Supabase Não Funciona

**Causa**: Variáveis `NUXT_PUBLIC_*` incorretas

**Solução**:
1. Verifique se variáveis começam com `NUXT_PUBLIC_`
2. Verifique se valores estão corretos
3. Redeploy

### 3. Emails Não Enviam

**Causa**: Variáveis de email faltando

**Solução**:
1. Adicione: `GMAIL_EMAIL`, `GMAIL_APP_PASSWORD`
2. Adicione: `EMAIL_HOST`, `EMAIL_PORT`
3. Redeploy

---

## 🎯 URLs Importantes

- **Vercel Dashboard**: https://vercel.com/dashboard
- **Novo Projeto**: https://vercel.com/new
- **Documentação**: https://vercel.com/docs
- **Suporte**: https://vercel.com/support

---

## 📞 Precisa de Ajuda?

1. Verifique logs de deploy no Vercel
2. Teste build localmente: `npm run build`
3. Verifique variáveis de ambiente
4. Consulte documentação completa: `SOLUCAO-VERCEL-DEPLOY.md`

---

**Tempo estimado**: 5-10 minutos  
**Dificuldade**: Fácil  
**Status**: Aguardando ação do usuário
