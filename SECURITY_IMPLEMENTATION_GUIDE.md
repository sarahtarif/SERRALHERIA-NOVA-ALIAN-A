# Guia de Implementação - Sistema de Segurança Admin

## ✅ Arquivos Criados

### 1. Documentação
- `SECURITY_ARCHITECTURE.md` - Arquitetura completa de segurança
- `SECURITY_IMPLEMENTATION_GUIDE.md` - Este guia

### 2. Middlewares
- `app/middleware/auth.ts` - Autenticação básica
- `app/middleware/admin.ts` - Verificação de role admin (5 camadas)
- `server/middleware/rate-limiter.ts` - Rate limiting server-side

### 3. APIs de Segurança
- `server/api/security/log-access.post.ts` - Log de acessos autorizados
- `server/api/security/log-unauthorized.post.ts` - Log de tentativas não autorizadas

### 4. Páginas
- `app/pages/sys/mgmt/dashboard-v2.vue` - Painel admin seguro
- `app/pages/auth/secure/admin-access.vue` - Login admin com múltiplas proteções

### 5. Configuração
- `vercel.json` - Headers de segurança e rewrites

---

## 🚀 Passos para Implementação

### Passo 1: Criar Tabela de Audit Log (Supabase)

```sql
-- Executar no SQL Editor do Supabase

CREATE TABLE IF NOT EXISTS security_audit_log (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_type TEXT NOT NULL,
  user_id UUID REFERENCES profiles(id),
  user_email TEXT,
  user_role TEXT,
  ip_address INET,
  user_agent TEXT,
  route TEXT,
  from_route TEXT,
  method TEXT,
  status_code INTEGER,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices para performance
CREATE INDEX idx_audit_user ON security_audit_log(user_id);
CREATE INDEX idx_audit_ip ON security_audit_log(ip_address);
CREATE INDEX idx_audit_created ON security_audit_log(created_at DESC);
CREATE INDEX idx_audit_event_type ON security_audit_log(event_type);

-- RLS (Row Level Security)
ALTER TABLE security_audit_log ENABLE ROW LEVEL SECURITY;

-- Apenas admins podem ler logs
CREATE POLICY "Admins can read audit logs"
  ON security_audit_log
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Sistema pode inserir logs (via service role)
CREATE POLICY "System can insert audit logs"
  ON security_audit_log
  FOR INSERT
  TO authenticated
  WITH CHECK (true);
```

### Passo 2: Atualizar Composable useSupabase

Adicionar função para usar service role key (server-side):

```typescript
// server/utils/supabase.ts
import { createClient } from '@supabase/supabase-js'

export const useSupabaseServer = (event: any) => {
  const config = useRuntimeConfig()
  
  return createClient(
    config.public.supabaseUrl,
    config.supabaseServiceRoleKey, // Adicionar no .env
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    }
  )
}
```

### Passo 3: Configurar Variáveis de Ambiente

Adicionar no `.env`:

```bash
# Já existentes
NUXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NUXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxx...

# ADICIONAR:
SUPABASE_SERVICE_ROLE_KEY=eyJxxx...  # Pegar no Supabase Dashboard > Settings > API
```

Adicionar no `nuxt.config.ts`:

```typescript
export default defineNuxtConfig({
  runtimeConfig: {
    // Private (server-side only)
    supabaseServiceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY || '',
    
    public: {
      // ... existentes
    }
  }
})
```

### Passo 4: Atualizar APIs de Segurança

Modificar `server/api/security/log-access.post.ts`:

```typescript
export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const ip = event.node.req.headers['x-forwarded-for']?.toString().split(',')[0].trim() ||
             event.node.req.headers['x-real-ip']?.toString() ||
             event.node.req.socket.remoteAddress ||
             'unknown'
  const userAgent = event.node.req.headers['user-agent'] || 'unknown'
  
  const logEntry = {
    event_type: 'ADMIN_ACCESS',
    user_id: body.userId,
    user_email: body.userEmail,
    ip_address: ip,
    user_agent: userAgent,
    route: body.route,
    from_route: body.fromRoute,
    method: 'GET',
    status_code: 200,
    metadata: {
      timestamp: body.timestamp,
      sessionId: event.node.req.headers['x-session-id']
    }
  }
  
  console.log('[AUDIT] Acesso admin autorizado:', logEntry)
  
  // Salvar no banco de dados
  const supabase = useSupabaseServer(event)
  const { error } = await supabase
    .from('security_audit_log')
    .insert(logEntry)
  
  if (error) {
    console.error('[AUDIT] Erro ao salvar log:', error)
  }
  
  return { success: true, logged: !error }
})
```

Fazer o mesmo para `log-unauthorized.post.ts`.

### Passo 5: Testar o Sistema

#### Teste 1: Acesso Normal
1. Acessar: `https://novalianca.vercel.app/auth/secure/admin-access`
2. Fazer login com credenciais de admin
3. Verificar redirecionamento para `/sys/mgmt/dashboard-v2`
4. Verificar logs no Supabase

#### Teste 2: Tentativa Não Autorizada
1. Fazer login com conta de cliente
2. Tentar acessar `/sys/mgmt/dashboard-v2` diretamente
3. Verificar redirecionamento e log de tentativa não autorizada

#### Teste 3: Rate Limiting
1. Fazer 6 tentativas de login com senha errada
2. Verificar bloqueio após 5 tentativas
3. Verificar mensagem de erro apropriada

#### Teste 4: Bot Detection
1. Preencher campo honeypot (via DevTools)
2. Submeter formulário
3. Verificar que não há erro visível (bloqueio silencioso)

#### Teste 5: Rotas Bloqueadas
1. Tentar acessar `/admin` → deve retornar 404
2. Tentar acessar `/painel` → deve retornar 404
3. Tentar acessar `/dashboard` → deve retornar 404

---

## 🔒 Checklist de Segurança

### Implementação Básica (Crítico)
- [x] Rota não trivial criada (`/sys/mgmt/dashboard-v2`)
- [x] Login seguro criado (`/auth/secure/admin-access`)
- [x] Middleware de autenticação
- [x] Middleware de role admin (5 camadas)
- [x] Rate limiting server-side
- [x] Headers de segurança (vercel.json)
- [x] Honeypot para detectar bots
- [x] CAPTCHA adaptativo (após 2 tentativas)
- [ ] Tabela de audit log no Supabase
- [ ] APIs de log conectadas ao banco

### Configuração (Alta Prioridade)
- [ ] Variáveis de ambiente configuradas
- [ ] Service role key adicionada
- [ ] Vercel.json deployado
- [ ] Testes de segurança executados

### Melhorias Futuras (Médio Prazo)
- [ ] Integrar CAPTCHA real (hCaptcha/Turnstile)
- [ ] Implementar Redis para rate limiting distribuído
- [ ] Adicionar alertas por email/Slack
- [ ] Dashboard de métricas de segurança
- [ ] Análise comportamental avançada
- [ ] Integração com WAF (Cloudflare)

---

## 📊 Monitoramento

### Queries Úteis para Supabase

```sql
-- Acessos admin nas últimas 24h
SELECT 
  user_email,
  route,
  ip_address,
  created_at
FROM security_audit_log
WHERE event_type = 'ADMIN_ACCESS'
  AND created_at > NOW() - INTERVAL '24 hours'
ORDER BY created_at DESC;

-- Tentativas não autorizadas
SELECT 
  user_email,
  user_role,
  route AS attempted_route,
  ip_address,
  created_at
FROM security_audit_log
WHERE event_type = 'UNAUTHORIZED_ACCESS_ATTEMPT'
ORDER BY created_at DESC
LIMIT 50;

-- IPs suspeitos (múltiplas tentativas)
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

## 🚨 Resposta a Incidentes

### Se detectar atividade suspeita:

1. **Identificar**: Verificar logs no Supabase
2. **Bloquear**: Adicionar IP à blacklist (rate limiter)
3. **Investigar**: Analisar padrão de ataque
4. **Mitigar**: Ajustar regras de segurança
5. **Documentar**: Registrar incidente

### Contatos de Emergência:
- Admin Principal: [email]
- Suporte Técnico: [email]
- Supabase Support: support@supabase.io

---

## 📝 Notas Importantes

1. **Nunca** compartilhar a rota `/sys/mgmt/dashboard-v2` publicamente
2. **Sempre** usar HTTPS em produção
3. **Revisar** logs de segurança semanalmente
4. **Atualizar** senhas de admin mensalmente
5. **Testar** sistema de segurança após cada deploy

---

## 🎯 Próximos Passos

1. Executar SQL para criar tabela de audit log
2. Configurar variáveis de ambiente
3. Fazer deploy no Vercel
4. Executar testes de segurança
5. Configurar alertas de monitoramento
6. Documentar credenciais de admin (local seguro)

---

**Status**: ✅ Pronto para implementação
**Última Atualização**: 20/02/2025
**Versão**: 1.0
