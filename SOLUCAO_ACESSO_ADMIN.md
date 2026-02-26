# 🔧 Solução: Acesso ao Painel Admin

## ❌ Problema Atual

O usuário admin existe no Supabase Auth com `role: "admin"` no banco ✅, mas está dando erro 500 ao tentar buscar o perfil.

**Causa:** As políticas RLS (Row Level Security) estão bloqueando a leitura do perfil.

**Erro:** `GET /rest/v1/profiles?select=*&id=eq.xxx 500 (Internal Server Error)`

---

## ✅ Solução Rápida (2 opções)

### 🚀 OPÇÃO 1: Solução Rápida (Recomendada para testar)

Execute este SQL para desabilitar temporariamente o RLS:

```sql
-- Desabilitar RLS temporariamente
ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;

-- Verificar
SELECT id, email, role, name 
FROM profiles 
WHERE email = 'qualitecinstrumentosdemedicao@gmail.com';
```

Depois faça logout, limpe o cache e tente fazer login novamente.

**⚠️ IMPORTANTE:** Esta solução desabilita a segurança RLS. Use apenas para testar localmente!

---

### 🔒 OPÇÃO 2: Solução Segura (Recriar políticas RLS)

Execute este SQL para recriar as políticas RLS corretamente:

```sql
-- Remover todas as políticas antigas
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON profiles;
DROP POLICY IF EXISTS "Enable read access for authenticated users" ON profiles;
DROP POLICY IF EXISTS "Enable update for users based on id" ON profiles;

-- Criar políticas simples e funcionais
CREATE POLICY "authenticated_read_all_profiles"
  ON profiles FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "users_update_own_profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "service_role_insert_profiles"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Verificar
SELECT id, email, role, name 
FROM profiles 
WHERE email = 'qualitecinstrumentosdemedicao@gmail.com';
```

---

## 🧪 Testar o Acesso

1. Se estiver logado, faça logout
2. Limpe o cache do navegador (Ctrl + Shift + Delete)
3. Acesse: http://localhost:3001/auth/secure/admin-access
4. Faça login com:
   - **Email:** qualitecinstrumentosdemedicao@gmail.com
   - **Senha:** NovaAlianca@2025!Secure#Admin

5. Você será redirecionado para: http://localhost:3001/admin

---

## 🔍 Verificação

Após fazer login, você deve ver:

✅ Dashboard com 4 KPIs (Leads, Taxa de Conversão, Serviços, Receita)  
✅ Sidebar com 7 módulos (Dashboard, Leads, Orçamentos, etc.)  
✅ Seu nome no canto superior direito  
✅ Badge "Administrador" abaixo do nome

---

## 🐛 Se Ainda Não Funcionar

### Verificar no Console do Navegador (F12)

Se aparecer erro, verifique:

```javascript
// Deve mostrar:
profile.value.role === 'admin' // true
isAdmin.value === true
```

### Verificar no Supabase

Execute no SQL Editor:

```sql
-- Ver dados do usuário
SELECT * FROM auth.users 
WHERE email = 'qualitecinstrumentosdemedicao@gmail.com';

-- Ver perfil
SELECT * FROM profiles 
WHERE email = 'qualitecinstrumentosdemedicao@gmail.com';
```

**Checklist:**
- [ ] `auth.users.email_confirmed_at` tem data (não NULL)
- [ ] `profiles.role` é exatamente `'admin'` (não NULL, não undefined)
- [ ] `profiles.id` é igual ao `auth.users.id`

---

## 📝 Próximos Passos (Após Acesso Funcionar)

Com o acesso funcionando, você poderá:

1. **Ver o Dashboard** - KPIs e métricas básicas (dados mockados por enquanto)
2. **Navegar pelos módulos** - Sidebar com 7 seções
3. **Implementar funcionalidades** - Começar a desenvolver os módulos

### Módulos Planejados (conforme EPIC-AREA-ADMIN.md)

- ✅ Dashboard (implementado com dados mock)
- 🔄 Leads (próximo a implementar)
- 🔄 Orçamentos
- 🔄 Serviços
- 🔄 Agenda
- 🔄 Clientes
- 🔄 Financeiro

---

## 💡 Dica

Se quiser testar rapidamente sem mexer no banco, você pode temporariamente comentar a verificação no middleware:

```typescript
// app/middleware/admin.ts
// Comentar temporariamente para testar:
// if (!isAdmin.value) {
//   return navigateTo('/')
// }
```

**⚠️ ATENÇÃO:** Isso é apenas para teste local! Não faça deploy com essa alteração!

---

**Última Atualização:** 26/02/2026  
**Status:** Aguardando execução do SQL no Supabase
