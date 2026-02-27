# Solução: Erro de Deploy Vercel
## "Git author must have access to the project"

---

## ❌ Erro

```
Git author samueltarif must have access to the project on Vercel to create deployments.
```

---

## 🔍 Causa do Problema

O usuário Git `samueltarif` que fez o commit não tem permissão no projeto Vercel. Isso acontece quando:

1. O projeto Vercel está vinculado a outra conta
2. O usuário Git não foi adicionado como colaborador
3. O repositório GitHub não está conectado corretamente

---

## ✅ Soluções (3 Opções)

### Opção 1: Adicionar Colaborador no Vercel (RECOMENDADO)

#### Passo 1: Acessar Vercel Dashboard
1. Acesse https://vercel.com/dashboard
2. Faça login com a conta que possui o projeto
3. Selecione o projeto "nova-alianca"

#### Passo 2: Adicionar Colaborador
1. Clique em **Settings** (Configurações)
2. Vá em **Members** ou **Team Members**
3. Clique em **Invite Member**
4. Digite o email ou username do GitHub: `samueltarif`
5. Selecione a role: **Developer** ou **Admin**
6. Clique em **Invite**

#### Passo 3: Aceitar Convite
1. `samueltarif` receberá um email
2. Aceitar o convite
3. Fazer novo push para testar

---

### Opção 2: Reconectar Repositório GitHub

#### Passo 1: Desconectar Repositório Atual
1. Acesse Vercel Dashboard
2. Vá em **Settings** → **Git**
3. Clique em **Disconnect** no repositório atual

#### Passo 2: Reconectar com Conta Correta
1. Clique em **Connect Git Repository**
2. Selecione **GitHub**
3. Faça login com a conta `samueltarif`
4. Autorize a Vercel
5. Selecione o repositório `nova-alianca`
6. Clique em **Import**

#### Passo 3: Configurar Projeto
1. **Framework Preset**: Nuxt.js
2. **Root Directory**: `./` (raiz)
3. **Build Command**: `npm run build`
4. **Output Directory**: `.output/public`
5. **Install Command**: `npm install`

#### Passo 4: Adicionar Variáveis de Ambiente
```env
NUXT_PUBLIC_SUPABASE_URL=https://lfznsbvruvjnugyzfyiw.supabase.co
NUXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
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

---

### Opção 3: Criar Novo Projeto Vercel

Se as opções anteriores não funcionarem, crie um novo projeto:

#### Passo 1: Criar Novo Projeto
1. Acesse https://vercel.com/new
2. Faça login com a conta `samueltarif`
3. Clique em **Import Git Repository**
4. Selecione `samueltarif/nova-alianca`

#### Passo 2: Configurar
```
Project Name: nova-alianca
Framework: Nuxt.js
Root Directory: ./
Build Command: npm run build
Output Directory: .output/public
Install Command: npm install
Node Version: 20.x
```

#### Passo 3: Variáveis de Ambiente
Adicione todas as variáveis listadas na Opção 2, Passo 4

#### Passo 4: Deploy
1. Clique em **Deploy**
2. Aguarde o build (2-3 minutos)
3. Projeto estará disponível em: `https://nova-alianca-xxx.vercel.app`

#### Passo 5: Configurar Domínio Customizado (Opcional)
1. Vá em **Settings** → **Domains**
2. Adicione seu domínio
3. Configure DNS conforme instruções

---

## 🔧 Verificar Configuração Atual

### Verificar Usuário Git Local
```bash
git config user.name
git config user.email
```

**Deve retornar**:
```
samueltarif
email@example.com
```

### Verificar Repositório Remoto
```bash
git remote -v
```

**Deve retornar**:
```
origin  https://github.com/samueltarif/nova-alianca.git (fetch)
origin  https://github.com/samueltarif/nova-alianca.git (push)
```

### Verificar Último Commit
```bash
git log -1 --pretty=format:"%an <%ae>"
```

**Deve retornar**:
```
samueltarif <email@example.com>
```

---

## 🚀 Após Resolver

### Testar Deploy
```bash
# Fazer pequena alteração
echo "# Test" >> README.md

# Commit
git add README.md
git commit -m "test: Testar deploy Vercel"

# Push
git push origin main
```

### Verificar Deploy
1. Acesse https://vercel.com/dashboard
2. Veja o projeto "nova-alianca"
3. Verifique se o deploy iniciou automaticamente
4. Aguarde conclusão (2-3 minutos)
5. Acesse a URL do projeto

---

## 📋 Checklist de Configuração Vercel

### Projeto
- [ ] Projeto criado ou importado
- [ ] Repositório GitHub conectado
- [ ] Branch principal configurada (main)
- [ ] Auto-deploy habilitado

### Build
- [ ] Framework: Nuxt.js
- [ ] Node Version: 20.x
- [ ] Build Command: `npm run build`
- [ ] Output Directory: `.output/public`
- [ ] Install Command: `npm install`

### Variáveis de Ambiente
- [ ] NUXT_PUBLIC_SUPABASE_URL
- [ ] NUXT_PUBLIC_SUPABASE_ANON_KEY
- [ ] NUXT_PUBLIC_WHATSAPP_NUMBER
- [ ] NUXT_PUBLIC_COMPANY_NAME
- [ ] NUXT_PUBLIC_COMPANY_ADDRESS
- [ ] NUXT_PUBLIC_COMPANY_EMAIL
- [ ] NUXT_PUBLIC_COMPANY_PHONE
- [ ] GMAIL_EMAIL
- [ ] GMAIL_APP_PASSWORD
- [ ] SECURITY_ALERT_EMAIL
- [ ] EMAIL_HOST
- [ ] EMAIL_PORT
- [ ] EMAIL_FROM
- [ ] EMAIL_USER
- [ ] EMAIL_PASS

### Permissões
- [ ] Usuário `samueltarif` tem acesso ao projeto
- [ ] GitHub App instalada e autorizada
- [ ] Webhooks configurados

### Domínio (Opcional)
- [ ] Domínio customizado adicionado
- [ ] DNS configurado
- [ ] SSL/HTTPS habilitado

---

## 🔍 Troubleshooting

### Deploy Falha com Erro de Build

**Problema**: Build falha no Vercel mas funciona localmente

**Solução**:
1. Verificar Node version (deve ser 20.x)
2. Verificar variáveis de ambiente
3. Verificar logs de build no Vercel
4. Testar build localmente: `npm run build`

### Deploy Não Inicia Automaticamente

**Problema**: Push para GitHub não dispara deploy

**Solução**:
1. Verificar se auto-deploy está habilitado
2. Verificar branch configurada (main)
3. Verificar webhooks do GitHub
4. Fazer deploy manual: Vercel Dashboard → Deploy

### Variáveis de Ambiente Não Funcionam

**Problema**: App não consegue acessar variáveis

**Solução**:
1. Verificar se variáveis foram adicionadas no Vercel
2. Verificar prefixo `NUXT_PUBLIC_` para variáveis client-side
3. Fazer redeploy após adicionar variáveis
4. Verificar logs de runtime

### Erro 404 em Rotas

**Problema**: Rotas dinâmicas retornam 404

**Solução**:
1. Verificar se `Output Directory` está correto: `.output/public`
2. Verificar se build gerou arquivos corretamente
3. Verificar configuração de rewrites no `vercel.json`

---

## 📝 Arquivo vercel.json (Opcional)

Se necessário, crie um arquivo `vercel.json` na raiz:

```json
{
  "version": 2,
  "builds": [
    {
      "src": "nuxt.config.ts",
      "use": "@nuxtjs/vercel-builder"
    }
  ],
  "routes": [
    {
      "src": "/api/.*",
      "dest": "/api"
    },
    {
      "src": "/(.*)",
      "dest": "/"
    }
  ],
  "env": {
    "NODE_VERSION": "20"
  }
}
```

---

## 🎯 Solução Rápida (Resumo)

### Se você é o dono do projeto Vercel:
1. Acesse Vercel Dashboard
2. Settings → Members
3. Adicione `samueltarif` como colaborador
4. Aguarde aceite do convite
5. Faça novo push

### Se você NÃO é o dono:
1. Peça ao dono para adicionar você como colaborador
2. OU crie um novo projeto Vercel com sua conta
3. Importe o repositório `samueltarif/nova-alianca`
4. Configure variáveis de ambiente
5. Deploy

---

## 📞 Suporte

Se o problema persistir:

1. **Vercel Support**: https://vercel.com/support
2. **Documentação**: https://vercel.com/docs
3. **GitHub Issues**: Verificar se há problemas conhecidos
4. **Community**: https://github.com/vercel/vercel/discussions

---

**Última atualização**: 26 de fevereiro de 2026  
**Status**: Aguardando resolução de permissões
