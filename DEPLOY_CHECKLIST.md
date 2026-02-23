# Checklist de Deploy - Sistema de Segurança

## ✅ Status Atual

### Implementação Completa
- [x] Sistema de segurança (10 camadas)
- [x] Middlewares (auth, admin, rate-limiter)
- [x] APIs de segurança (3 endpoints)
- [x] Sistema de alertas por email
- [x] Páginas admin seguras
- [x] Documentação completa (4 arquivos)
- [x] Build concluído com sucesso
- [x] Tabela de audit log criada no Supabase
- [x] Credenciais de admin criadas

---

## 🚀 Próximos Passos (FAZER AGORA)

### 1. Criar Usuário Admin no Supabase ⏰ 5 minutos

1. Acesse: https://supabase.com/dashboard
2. Vá em: **Authentication > Users > Add User**
3. Preencha:
   - Email: `qualitecinstrumentosdemedicao@gmail.com`
   - Password: `NovaAlianca@2025!Secure#Admin`
   - ✅ Marque: "Auto Confirm User"
4. Clique em "Create User"
5. Copie o UUID do usuário criado
6. Vá em: **SQL Editor** e execute:

```sql
-- Atualizar perfil para admin (substitua USER_UUID pelo UUID copiado)
UPDATE profiles 
SET role = 'admin', name = 'Administrador'
WHERE id = 'USER_UUID_AQUI';

-- Verificar
SELECT id, email, role, name, created_at 
FROM profiles 
WHERE email = 'qualitecinstrumentosdemedicao@gmail.com';
```

---

### 2. Configurar Variáveis de Ambiente no Vercel ⏰ 3 minutos

1. Acesse: https://vercel.com/dashboard
2. Selecione o projeto: **nova-alianca**
3. Vá em: **Settings > Environment Variables**
4. Adicione as seguintes variáveis:

```bash
GMAIL_EMAIL=qualitecinstrumentosdemedicao@gmail.com
GMAIL_APP_PASSWORD=byeqpdyllakkwxkk
SECURITY_ALERT_EMAIL=qualitecinstrumentosdemedicao@gmail.com
```

5. Para cada variável:
   - Clique em "Add New"
   - Cole o nome e valor
   - Selecione: Production, Preview, Development
   - Clique em "Save"

---

### 3. Fazer Deploy ⏰ 2 minutos

Execute no terminal:

```bash
git add .
git commit -m "feat: sistema de segurança enterprise-grade com alertas por email"
git push origin main
```

O Vercel fará o deploy automaticamente (aguarde 2-3 minutos).

---

### 4. Testar o Sistema ⏰ 10 minutos

#### Teste 1: Login Admin ✅
```
URL: https://novalianca.vercel.app/auth/secure/admin-access
Email: qualitecinstrumentosdemedicao@gmail.com
Senha: NovaAlianca@2025!Secure#Admin

Esperado: Redirecionamento para /sys/mgmt/dashboard-v2
```

#### Teste 2: Painel Admin ✅
```
URL: https://novalianca.vercel.app/sys/mgmt/dashboard-v2

Esperado:
- Visualização do painel
- Status de segurança: "Protegido"
- Informações do usuário
- Métricas de sessão
```

#### Teste 3: Alerta de Tentativas Falhas 📧
```
1. Faça 3 tentativas de login com senha errada
2. Verifique email: qualitecinstrumentosdemedicao@gmail.com
3. Esperado: Email com severidade MEDIUM

4. Faça mais 2 tentativas (total 5)
5. Esperado: Email com severidade CRITICAL + bloqueio
```

#### Teste 4: Alerta de Acesso Não Autorizado 📧
```
1. Crie uma conta de cliente (ou use existente)
2. Faça login como cliente
3. Tente acessar: /sys/mgmt/dashboard-v2
4. Esperado: 
   - Redirecionamento para /cliente
   - Email de alerta (severidade HIGH)
```

#### Teste 5: Rate Limiting 📧
```
1. Faça 6 tentativas rápidas de login (senha errada)
2. Esperado:
   - Bloqueio após 5 tentativas
   - Mensagem: "Muitas tentativas..."
   - Email de alerta (severidade HIGH)
```

---

## 📧 Verificar Emails de Alerta

### Onde Verificar
- **Gmail**: qualitecinstrumentosdemedicao@gmail.com
- **Pasta**: Caixa de Entrada (ou Spam na primeira vez)

### O que Esperar
- **Assunto**: 🔴 [Crítica] Múltiplas Tentativas de Login Falhas
- **Remetente**: Nova Aliança Security
- **Conteúdo**: HTML formatado com informações detalhadas

### Se Não Receber
1. Verificar pasta de Spam
2. Verificar logs do servidor (Vercel)
3. Verificar variáveis de ambiente
4. Testar credenciais Gmail manualmente

---

## 🔍 Monitoramento Pós-Deploy

### Logs do Vercel
```
1. Acesse: Vercel Dashboard > Project > Deployments
2. Clique no deployment mais recente
3. Vá em: "Functions" > Selecione uma função
4. Verifique logs em tempo real
```

### Logs de Segurança
```
Procure por:
[EMAIL] Alerta de segurança enviado: <messageId>
[SECURITY ALERT] Tentativa de acesso não autorizado
[RATE_LIMIT] Limite excedido - IP bloqueado
[AUDIT] Acesso admin autorizado
```

### Métricas para Monitorar
- Total de acessos admin (esperado: baixo)
- Tentativas não autorizadas (esperado: 0-2/dia)
- IPs bloqueados (esperado: 0-1/dia)
- Emails enviados (esperado: 0-5/dia)

---

## 📊 Queries Úteis (Supabase SQL Editor)

### Acessos Admin Hoje
```sql
SELECT 
  user_email,
  route,
  ip_address,
  created_at
FROM security_audit_log
WHERE event_type = 'ADMIN_ACCESS'
  AND created_at > CURRENT_DATE
ORDER BY created_at DESC;
```

### Tentativas Não Autorizadas (Últimas 24h)
```sql
SELECT 
  user_email,
  user_role,
  route AS attempted_route,
  ip_address,
  created_at
FROM security_audit_log
WHERE event_type = 'UNAUTHORIZED_ACCESS_ATTEMPT'
  AND created_at > NOW() - INTERVAL '24 hours'
ORDER BY created_at DESC;
```

### IPs Suspeitos (Múltiplas Tentativas)
```sql
SELECT 
  ip_address,
  COUNT(*) as attempts,
  MAX(created_at) as last_attempt
FROM security_audit_log
WHERE event_type = 'UNAUTHORIZED_ACCESS_ATTEMPT'
  AND created_at > NOW() - INTERVAL '1 hour'
GROUP BY ip_address
HAVING COUNT(*) > 3
ORDER BY attempts DESC;
```

---

## 🎯 Critérios de Sucesso

### Deploy Bem-Sucedido ✅
- [ ] Build sem erros
- [ ] Deploy concluído no Vercel
- [ ] Site acessível
- [ ] Sem erros 500

### Autenticação Funcionando ✅
- [ ] Login admin funciona
- [ ] Redirecionamento correto
- [ ] Painel admin acessível
- [ ] Logout funciona

### Segurança Ativa ✅
- [ ] Rate limiting bloqueando após 5 tentativas
- [ ] CAPTCHA aparecendo após 2 tentativas
- [ ] Middleware admin bloqueando não-admins
- [ ] Rotas óbvias retornando 404

### Alertas Funcionando 📧
- [ ] Email de tentativas falhas recebido
- [ ] Email de acesso não autorizado recebido
- [ ] Email de rate limit recebido
- [ ] Templates HTML renderizando corretamente

---

## 🚨 Troubleshooting

### Problema: Login não funciona
**Solução**:
1. Verificar se usuário foi criado no Supabase
2. Verificar se role foi atualizado para 'admin'
3. Verificar credenciais (copiar/colar)
4. Limpar cache do navegador

### Problema: Emails não chegam
**Solução**:
1. Verificar variáveis de ambiente no Vercel
2. Verificar pasta de Spam
3. Verificar logs do servidor
4. Testar App Password do Gmail

### Problema: Painel não carrega
**Solução**:
1. Verificar se está autenticado
2. Verificar se role é 'admin'
3. Verificar console do navegador (F12)
4. Verificar logs do Vercel

### Problema: Rate limiting muito agressivo
**Solução**:
1. Ajustar limites em `server/middleware/rate-limiter.ts`
2. Fazer novo deploy
3. Aguardar reset automático (15 min)

---

## 📝 Documentação de Referência

1. **SECURITY_ARCHITECTURE.md** - Arquitetura completa
2. **SECURITY_IMPLEMENTATION_GUIDE.md** - Guia de implementação
3. **SECURITY_SUMMARY.md** - Resumo executivo
4. **EMAIL_ALERTS_SETUP.md** - Sistema de alertas
5. **ADMIN_CREDENTIALS.md** - Credenciais (NÃO COMMITAR)
6. **DEPLOY_CHECKLIST.md** - Este arquivo

---

## ⏱️ Tempo Estimado Total

- Criar usuário admin: 5 min
- Configurar Vercel: 3 min
- Deploy: 2 min
- Testes: 10 min
- **Total: ~20 minutos**

---

## ✅ Checklist Final

- [ ] Usuário admin criado no Supabase
- [ ] Role atualizado para 'admin'
- [ ] Variáveis de ambiente configuradas no Vercel
- [ ] Deploy realizado com sucesso
- [ ] Login admin testado e funcionando
- [ ] Painel admin acessível
- [ ] Alertas por email testados
- [ ] Emails recebidos corretamente
- [ ] Logs de segurança verificados
- [ ] Documentação revisada
- [ ] Credenciais armazenadas em local seguro

---

**Status**: 🟡 Pronto para deploy
**Próxima Ação**: Criar usuário admin no Supabase
**Tempo Estimado**: 20 minutos
**Última Atualização**: 20/02/2025 - 20:50
