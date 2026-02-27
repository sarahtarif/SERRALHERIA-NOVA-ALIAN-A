# Testes de Segurança - Middleware Admin
## Fase 0 - Tarefa 1

---

## ⚠️ OBRIGATÓRIO: Testes Antes de Avançar

Conforme o plano de execução, **NENHUMA tarefa pode ser marcada como concluída** sem executar todos os testes de segurança abaixo.

---

## 📋 Checklist de Testes

### 1. Teste: Sem Estar Logado

**Cenário**: Usuário não autenticado tenta acessar `/admin`

**Passos**:
1. Abrir navegador em modo anônimo
2. Acessar diretamente: `http://localhost:3000/admin`

**Resultado Esperado**:
- [ ] Middleware `admin.ts` é disparado
- [ ] Usuário é redirecionado para `/auth/secure/admin-access`
- [ ] Nenhum conteúdo da página admin é renderizado
- [ ] Console mostra: `[SECURITY] Tentativa de acesso não autenticado`

**Status**: ⏳ PENDENTE - Requer teste manual

---

### 2. Teste: Logado com Role Errada

**Cenário**: Usuário logado como 'client' tenta acessar `/admin`

**Passos**:
1. Fazer login como cliente em `/cliente/login`
2. Tentar acessar diretamente: `http://localhost:3000/admin`

**Resultado Esperado**:
- [ ] Middleware detecta role 'client'
- [ ] Usuário é redirecionado para `/cliente`
- [ ] Log de tentativa não autorizada é registrado
- [ ] Console mostra: `[SECURITY] Tentativa de escalação de privilégio`
- [ ] API `/api/security/log-unauthorized` é chamada

**Status**: ⏳ PENDENTE - Requer teste manual

---

### 3. Teste: Logado com Role Correta

**Cenário**: Usuário logado como 'admin' acessa `/admin`

**Passos**:
1. Fazer login como admin em `/auth/secure/admin-access`
   - Email: `qualitecinstrumentosdemedicao@gmail.com`
   - Senha: `NovaAlianca@2025!Secure#Admin`
2. Acessar: `http://localhost:3000/admin`

**Resultado Esperado**:
- [ ] Middleware permite acesso
- [ ] Página admin é renderizada
- [ ] Dados carregam normalmente
- [ ] API `/api/security/log-access` é chamada
- [ ] Sessão Supabase está ativa

**Status**: ⏳ PENDENTE - Requer teste manual

---

### 4. Teste: Acesso Direto a Subrotas

**Cenário**: Acessar URLs profundas sem passar pela lista

**Passos**:
1. Sem estar logado, acessar: `http://localhost:3000/admin/leads`
2. Sem estar logado, acessar: `http://localhost:3000/admin/orcamentos/novo`

**Resultado Esperado**:
- [ ] Middleware é aplicado em todas as subrotas `/admin/*`
- [ ] Redirecionamento para login ocorre
- [ ] Não há "furo" de autenticação

**Status**: ⏳ PENDENTE - Requer teste manual

---

### 5. Teste: SEO e Indexação

**Cenário**: Verificar meta tags de SEO em páginas admin

**Passos**:
1. Acessar `/admin` (logado)
2. Inspecionar HTML da página
3. Verificar meta tags

**Resultado Esperado**:
- [ ] Meta tag `robots` com `noindex, nofollow`
- [ ] Nenhum link público aponta para `/admin`
- [ ] Sitemap não inclui rotas `/admin/*`

**Status**: ⏳ PENDENTE - Requer teste manual

---

### 6. Teste: API Routes Protegidas

**Cenário**: Testar proteção de APIs `/api/admin/*`

**Passos**:
1. Sem token, fazer request: `GET /api/admin/leads`
2. Com token de cliente, fazer request: `GET /api/admin/leads`
3. Com token de admin, fazer request: `GET /api/admin/leads`

**Resultado Esperado**:
- [ ] Sem token → 401/403
- [ ] Token com role errada → 403
- [ ] Token com role correta → 200 com dados

**Status**: ⏳ PENDENTE - APIs ainda não implementadas

---

### 7. Teste: Sessão Expirada

**Cenário**: Sessão Supabase expira durante navegação

**Passos**:
1. Fazer login como admin
2. Invalidar sessão manualmente (Supabase Dashboard)
3. Tentar navegar para outra página admin

**Resultado Esperado**:
- [ ] CAMADA 5 detecta sessão expirada
- [ ] Usuário é redirecionado para login
- [ ] Console mostra: `[SECURITY] Sessão expirada detectada`

**Status**: ⏳ PENDENTE - Requer teste manual

---

### 8. Teste: Erro ao Carregar Perfil

**Cenário**: Erro no Supabase ao carregar perfil

**Passos**:
1. Simular erro de rede ou RLS bloqueando
2. Tentar acessar `/admin`

**Resultado Esperado**:
- [ ] CAMADA 2 captura erro
- [ ] Usuário é redirecionado para login
- [ ] Console mostra: `[AUTH] Erro ao carregar perfil`

**Status**: ⏳ PENDENTE - Requer teste manual

---

## 🔐 Testes de RLS no Supabase

### Teste: Políticas da Tabela Profiles

**SQL Executado**:
```sql
SELECT 
  policyname,
  cmd,
  roles,
  qual
FROM pg_policies 
WHERE tablename = 'profiles';
```

**Resultado**:
- ✅ `authenticated_read_all_profiles` - SELECT permitido para authenticated
- ✅ `service_role_insert_profiles` - INSERT apenas para próprio perfil
- ✅ `users_update_own_profile` - UPDATE apenas para próprio perfil

**Status**: ✅ VERIFICADO

---

### Teste: SELECT de Perfis Admin

**SQL Executado**:
```sql
SELECT id, email, name, role 
FROM profiles 
WHERE role = 'admin';
```

**Resultado**:
- ✅ Retornou 1 perfil admin
- ✅ UUID: `8647c4d5-582e-4354-8b15-79e87af12b37`
- ✅ Email: `qualitecinstrumentosdemedicao@gmail.com`

**Status**: ✅ VERIFICADO

---

## 📊 Resumo dos Testes

| Teste | Status | Bloqueante |
|-------|--------|------------|
| 1. Sem estar logado | ⏳ PENDENTE | ✅ SIM |
| 2. Role errada | ⏳ PENDENTE | ✅ SIM |
| 3. Role correta | ⏳ PENDENTE | ✅ SIM |
| 4. Subrotas | ⏳ PENDENTE | ✅ SIM |
| 5. SEO | ⏳ PENDENTE | ⚠️ NÃO |
| 6. API Routes | ⏳ PENDENTE | ⚠️ FUTURO |
| 7. Sessão expirada | ⏳ PENDENTE | ✅ SIM |
| 8. Erro perfil | ⏳ PENDENTE | ✅ SIM |
| RLS Policies | ✅ VERIFICADO | - |
| SELECT Admin | ✅ VERIFICADO | - |

---

## ⚠️ GATE: Não Avançar Sem Completar

**Critérios para marcar tarefa como concluída**:

- [ ] Todos os testes bloqueantes (SIM) executados e passando
- [ ] Documentação de resultados atualizada
- [ ] Screenshots ou logs de evidência salvos
- [ ] Nenhum teste crítico falhando

**Status Atual**: ⏳ AGUARDANDO TESTES MANUAIS

---

## 📝 Como Executar os Testes

### Pré-requisitos
1. Servidor dev rodando: `npm run dev`
2. Supabase configurado e conectado
3. Usuário admin criado no banco

### Executar Testes
1. Seguir cada cenário acima
2. Marcar checkbox ao completar
3. Anotar resultados e evidências
4. Atualizar status neste documento

### Reportar Falhas
Se algum teste falhar:
1. Documentar o erro
2. Criar issue ou task para correção
3. NÃO avançar para próxima tarefa
4. Corrigir e re-testar

---

**Data de Criação**: 26/02/2026  
**Responsável**: Kiro AI  
**Fase**: 0 - Saneamento de Infra  
**Tarefa**: 1 - Revisar Middleware Admin
