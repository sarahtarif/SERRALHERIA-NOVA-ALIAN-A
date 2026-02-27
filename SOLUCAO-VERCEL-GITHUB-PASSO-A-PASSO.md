# Solução: Conectar GitHub ao Vercel
## Passo a Passo com Imagens

---

## 🎯 Problema

```
Git author samueltarif must have access to the project on Vercel to create deployments.
```

**Causa**: O usuário GitHub `samueltarif` não tem permissão no projeto Vercel.

---

## ✅ Solução: Adicionar Colaborador no Vercel

### Passo 1: Acessar Vercel Dashboard

1. Acesse: https://vercel.com/dashboard
2. Faça login com a conta que possui o projeto
3. Você verá a lista de projetos

### Passo 2: Selecionar o Projeto

1. Procure o projeto **"nova-alianca"** na lista
2. Clique no projeto para abrir

### Passo 3: Ir para Settings

1. No menu do projeto, clique em **"Settings"** (⚙️)
2. Você verá várias opções no menu lateral

### Passo 4: Acessar Team Members

1. No menu lateral de Settings, procure por:
   - **"Members"** ou
   - **"Team"** ou
   - **"Team Members"**
2. Clique nessa opção

### Passo 5: Adicionar Membro

Você verá uma tela similar à primeira imagem que mostrou:

```
Members
Manage team members and invitations

[Invite Link]

Email Address                    Role
jane@example.com                 [Select Role ▼]
[⊕ Add more]
```

**Ações**:
1. No campo **"Email Address"**, digite: `tarifsarah0@gmail.com` (email do GitHub do samueltarif)
2. No campo **"Role"**, selecione: **"Developer"** ou **"Admin"**
3. Clique em **"Add more"** ou **"Invite"**

### Passo 6: Enviar Convite

1. Clique no botão **"Send Invite"** ou **"Invite"**
2. Um email será enviado para `tarifsarah0@gmail.com`

### Passo 7: Aceitar Convite

1. Abra o email em `tarifsarah0@gmail.com`
2. Clique no link de convite
3. Aceite o convite no Vercel

---

## 🔄 Alternativa: Reconectar GitHub App

Se você não conseguir adicionar o colaborador, reconecte o GitHub:

### Passo 1: Desconectar GitHub App Atual

1. Vercel Dashboard → Settings → **Git**
2. Procure a seção **"Connected Git Account"**
3. Clique em **"Disconnect"**

### Passo 2: Reconectar com Conta Correta

1. Clique em **"Connect Git Repository"**
2. Selecione **GitHub**
3. Faça login com a conta `samueltarif`
4. Autorize a Vercel App

### Passo 3: Configurar Permissões

Na tela que você mostrou (segunda imagem):

```
Repository access

○ All repositories
  This applies to all current and future repositories...

○ Only select repositories
  Select at least one repository...
```

**Selecione**:
- ✅ **"All repositories"** (recomendado)
- OU selecione apenas **"nova-alianca"**

### Passo 4: Salvar

1. Clique em **"Save"** (botão verde)
2. Aguarde a conexão ser estabelecida

---

## 🔍 Verificar Configuração Atual

### No GitHub (Settings → Applications)

Você deve ver:
- **Vercel** na lista de aplicações instaladas
- Status: **Active**
- Repository access: **All repositories** ou **nova-alianca**

### No Vercel (Project Settings → Git)

Você deve ver:
- **Connected Git Account**: samueltarif
- **Repository**: samueltarif/nova-alianca
- **Branch**: main

---

## 🧪 Testar Deploy

Após configurar:

```bash
# 1. Fazer pequena alteração
echo "# Test deploy" >> README.md

# 2. Commit
git add README.md
git commit -m "test: Testar deploy Vercel"

# 3. Push
git push origin main
```

### Verificar no Vercel

1. Acesse: https://vercel.com/dashboard
2. Veja o projeto "nova-alianca"
3. Deve aparecer um novo deploy iniciando
4. Status deve mudar para: **Building** → **Ready**

---

## ⚠️ Troubleshooting

### Erro Persiste Após Adicionar Colaborador

**Solução**:
1. Fazer logout do Vercel
2. Fazer login novamente
3. Tentar novo push

### GitHub App Não Aparece

**Solução**:
1. GitHub → Settings → Applications
2. Procurar "Vercel"
3. Se não existir, instalar: https://github.com/apps/vercel
4. Autorizar acesso ao repositório

### Deploy Não Inicia Automaticamente

**Solução**:
1. Vercel Dashboard → Project Settings
2. Git → **Auto-deploy**: Verificar se está **ON**
3. Branch: Verificar se está **main**

---

## 📋 Checklist Final

Antes de considerar resolvido:

- [ ] Usuário `samueltarif` adicionado como membro no Vercel
- [ ] Convite aceito
- [ ] GitHub App conectada à conta `samueltarif`
- [ ] Repository access configurado (All ou nova-alianca)
- [ ] Auto-deploy habilitado
- [ ] Branch principal configurada (main)
- [ ] Teste de push realizado
- [ ] Deploy iniciou automaticamente
- [ ] Deploy concluído com sucesso

---

## 🎯 Resumo Rápido

### Se você É o dono do projeto Vercel:

1. Vercel Dashboard → Project → Settings → Members
2. Adicionar: `tarifsarah0@gmail.com`
3. Role: **Developer** ou **Admin**
4. Enviar convite
5. Aceitar convite no email
6. Fazer novo push para testar

### Se você NÃO é o dono:

1. Pedir ao dono para adicionar você
2. OU criar novo projeto Vercel com sua conta
3. Importar repositório `samueltarif/nova-alianca`
4. Configurar variáveis de ambiente
5. Deploy

---

## 📞 Contatos Úteis

**Vercel Support**: https://vercel.com/support  
**GitHub Support**: https://support.github.com  
**Documentação Vercel**: https://vercel.com/docs

---

## 🔗 Links Importantes

- **Vercel Dashboard**: https://vercel.com/dashboard
- **GitHub Settings**: https://github.com/settings/installations
- **Vercel GitHub App**: https://github.com/apps/vercel
- **Novo Projeto Vercel**: https://vercel.com/new

---

**Última Atualização**: 26/02/2026  
**Status**: Aguardando configuração de permissões
