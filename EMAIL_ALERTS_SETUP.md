# Sistema de Alertas de Segurança por Email

## 📧 Configuração Implementada

### Credenciais Gmail
- **Email**: qualitecinstrumentosdemedicao@gmail.com
- **App Password**: byeqpdyllakkwxkk (senha de aplicativo do Gmail)
- **Destinatário dos Alertas**: qualitecinstrumentosdemedicao@gmail.com

### Variáveis de Ambiente (.env)
```bash
GMAIL_EMAIL=qualitecinstrumentosdemedicao@gmail.com
GMAIL_APP_PASSWORD=byeqpdyllakkwxkk
SECURITY_ALERT_EMAIL=qualitecinstrumentosdemedicao@gmail.com
```

---

## 🚨 Tipos de Alertas Implementados

### 1. Tentativa de Acesso Não Autorizado
**Trigger**: Usuário autenticado tenta acessar área admin sem permissão

**Severidade**: HIGH

**Informações Incluídas**:
- Email do usuário
- Role atual
- IP Address
- Rota tentada
- User-Agent
- Timestamp

**Exemplo de Cenário**:
- Cliente com role "client" tenta acessar `/sys/mgmt/dashboard-v2`
- Sistema bloqueia e envia alerta imediatamente

---

### 2. Limite de Requisições Excedido (Rate Limit)
**Trigger**: IP excede o limite de requisições configurado

**Severidade**: 
- HIGH (para rotas de login/admin)
- MEDIUM (para outras rotas)

**Limites Configurados**:
- Login: 5 tentativas / 15 minutos → Bloqueio de 1 hora
- Admin: 30 requests / minuto → Bloqueio de 5 minutos

**Informações Incluídas**:
- IP Address
- Rota acessada
- Número de tentativas
- Duração do bloqueio
- User-Agent
- Timestamp

**Exemplo de Cenário**:
- Atacante tenta brute force no login
- Após 5 tentativas, IP é bloqueado
- Email de alerta é enviado automaticamente

---

### 3. Múltiplas Tentativas de Login Falhas
**Trigger**: 3 ou mais tentativas de login falhas consecutivas

**Severidade**:
- MEDIUM (3-4 tentativas)
- HIGH (5 tentativas)
- CRITICAL (5+ tentativas com bloqueio)

**Informações Incluídas**:
- Email tentado
- Número de tentativas
- IP Address
- Status de bloqueio
- User-Agent
- Timestamp

**Exemplo de Cenário**:
- Alguém tenta adivinhar senha de admin
- Após 3 tentativas, alerta MEDIUM é enviado
- Após 5 tentativas, alerta CRITICAL é enviado e IP bloqueado

---

### 4. Atividade Suspeita (Futuro)
**Trigger**: Padrões anormais detectados

**Severidade**: Variável

**Exemplos**:
- Acesso de localização incomum
- Horário fora do padrão
- Múltiplos IPs para mesmo usuário
- Padrão de bot detectado

---

## 📊 Formato dos Emails

### Design Profissional
- Header com gradiente azul
- Badge de severidade colorido (🟢🟡🟠🔴)
- Grid de informações organizado
- Metadata em formato JSON
- Botão de ação para acessar painel
- Footer com informações da empresa

### Cores por Severidade
- **LOW** (🟢): Verde (#10b981)
- **MEDIUM** (🟡): Amarelo (#f59e0b)
- **HIGH** (🟠): Laranja (#f97316)
- **CRITICAL** (🔴): Vermelho (#ef4444)

### Exemplo de Email (HTML)
```
┌─────────────────────────────────────┐
│  🔴 Alerta de Segurança             │
│  Severidade: Crítica                │
└─────────────────────────────────────┘

Múltiplas Tentativas de Login Falhas

Detalhes: 5 tentativas consecutivas...

┌─────────────────────────────────────┐
│ Usuário: admin@example.com          │
│ IP: 192.168.1.100                   │
│ User-Agent: Mozilla/5.0...          │
│ Timestamp: 20/02/2025 20:30:45      │
└─────────────────────────────────────┘

⚠️ AÇÃO RECOMENDADA:
Este é um alerta de alta prioridade...

[Acessar Painel Admin]
```

---

## 🔧 Arquivos Criados/Modificados

### Novos Arquivos
1. **server/utils/email.ts**
   - Função `sendSecurityAlert()`
   - Função `sendDailySecuritySummary()`
   - Templates HTML profissionais
   - Integração com nodemailer

2. **server/api/security/alert-failed-login.post.ts**
   - Endpoint para alertar tentativas falhas
   - Determinação automática de severidade
   - Integração com sistema de email

3. **EMAIL_ALERTS_SETUP.md**
   - Este documento

### Arquivos Modificados
1. **.env**
   - Adicionadas credenciais Gmail
   - Configuração de email de alertas

2. **nuxt.config.ts**
   - Adicionadas variáveis de runtime config
   - Configuração server-side

3. **server/api/security/log-unauthorized.post.ts**
   - Integração com `sendSecurityAlert()`
   - Envio automático de emails

4. **server/middleware/rate-limiter.ts**
   - Integração com `sendSecurityAlert()`
   - Alertas de rate limit

5. **app/pages/auth/secure/admin-access.vue**
   - Chamada para endpoint de alerta
   - Após 3 tentativas falhas

---

## 🧪 Como Testar

### Teste 1: Alerta de Acesso Não Autorizado
```bash
1. Fazer login com conta de cliente
2. Tentar acessar: /sys/mgmt/dashboard-v2
3. Verificar email recebido
```

### Teste 2: Alerta de Rate Limit
```bash
1. Fazer 6 tentativas de login rápidas
2. Verificar bloqueio após 5 tentativas
3. Verificar email recebido
```

### Teste 3: Alerta de Tentativas Falhas
```bash
1. Fazer 3 tentativas de login com senha errada
2. Verificar email recebido (severidade MEDIUM)
3. Fazer mais 2 tentativas
4. Verificar segundo email (severidade CRITICAL)
```

---

## 📈 Monitoramento

### Logs no Console
Todos os alertas são logados no console do servidor:
```
[EMAIL] Alerta de segurança enviado: <messageId>
[SECURITY ALERT] Tentativa de acesso não autorizado: {...}
[RATE_LIMIT] Limite excedido - IP bloqueado: {...}
```

### Verificar Envio
- Checar pasta de Enviados do Gmail
- Verificar logs do servidor
- Monitorar caixa de entrada do destinatário

---

## 🔐 Segurança das Credenciais

### App Password do Gmail
- **Não é a senha normal da conta**
- É uma senha específica para aplicativos
- Pode ser revogada sem afetar a conta principal
- Gerada em: Google Account > Security > 2-Step Verification > App Passwords

### Boas Práticas
✅ Usar App Password (não senha normal)
✅ Manter credenciais no .env (não commitar)
✅ Usar variáveis de ambiente no Vercel
✅ Revogar e regenerar periodicamente

❌ Nunca commitar .env no Git
❌ Nunca expor credenciais no client-side
❌ Nunca usar senha normal da conta

---

## 🚀 Deploy no Vercel

### Configurar Variáveis de Ambiente
1. Acessar: Vercel Dashboard > Project > Settings > Environment Variables

2. Adicionar:
```
GMAIL_EMAIL=qualitecinstrumentosdemedicao@gmail.com
GMAIL_APP_PASSWORD=byeqpdyllakkwxkk
SECURITY_ALERT_EMAIL=qualitecinstrumentosdemedicao@gmail.com
```

3. Aplicar para: Production, Preview, Development

4. Fazer redeploy do projeto

---

## 📧 Resumo Diário (Futuro)

### Funcionalidade Planejada
Envio automático de resumo diário com estatísticas:
- Total de acessos admin
- Tentativas não autorizadas
- IPs bloqueados
- Logins falhos

### Implementação
```typescript
// Agendar com cron job ou Vercel Cron
await sendDailySecuritySummary({
  totalAccesses: 45,
  unauthorizedAttempts: 3,
  blockedIPs: 2,
  failedLogins: 8,
  date: '20/02/2025'
})
```

---

## 🎯 Próximos Passos

### Curto Prazo
- [ ] Testar todos os tipos de alertas
- [ ] Verificar recebimento de emails
- [ ] Ajustar templates se necessário
- [ ] Configurar no Vercel

### Médio Prazo
- [ ] Implementar resumo diário
- [ ] Adicionar alertas via SMS (Twilio)
- [ ] Integrar com Slack/Discord
- [ ] Dashboard de alertas no painel admin

### Longo Prazo
- [ ] Machine learning para detecção de anomalias
- [ ] Alertas preditivos
- [ ] Integração com SIEM
- [ ] Relatórios mensais automatizados

---

## 📞 Suporte

### Em Caso de Problemas

**Email não está sendo enviado:**
1. Verificar credenciais no .env
2. Verificar logs do servidor
3. Testar App Password do Gmail
4. Verificar firewall/bloqueios

**Emails indo para spam:**
1. Adicionar remetente aos contatos
2. Marcar como "Não é spam"
3. Configurar filtros no Gmail

**Muitos alertas:**
1. Ajustar thresholds de severidade
2. Implementar rate limiting de emails
3. Agrupar alertas similares

---

**Última Atualização**: 20/02/2025 - 20:30
**Status**: ✅ Implementado e pronto para testes
**Desenvolvido por**: Kiro AI
