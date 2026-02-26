-- ============================================
-- CONFIGURAR USUÁRIO ADMIN - PASSO A PASSO
-- ============================================

-- PASSO 1: Verificar se o usuário existe e pegar informações
SELECT 
  id, 
  email, 
  email_confirmed_at,
  created_at,
  raw_user_meta_data
FROM auth.users 
WHERE email = 'qualitecinstrumentosdemedicao@gmail.com';

-- ============================================
-- PASSO 2: CONFIRMAR O EMAIL DO USUÁRIO
-- (Necessário para fazer login)
-- NOTA: confirmed_at é gerado automaticamente, não pode ser atualizado
-- ============================================

UPDATE auth.users
SET 
  email_confirmed_at = NOW()
WHERE email = 'qualitecinstrumentosdemedicao@gmail.com';

-- ============================================
-- PASSO 3: CRIAR/ATUALIZAR PERFIL COMO ADMIN
-- ============================================

-- ============================================
-- SOLUÇÃO DEFINITIVA: Atualizar perfil existente
-- ============================================

-- Este comando vai funcionar independente do estado atual
UPDATE profiles 
SET 
  role = 'admin',
  name = 'Administrador Nova Aliança',
  whatsapp = '5511987115613',
  email = 'qualitecinstrumentosdemedicao@gmail.com'
WHERE id = '8647c4d5-582e-4354-8b15-79e87af12b37';

-- OU se preferir usar o email como referência:
UPDATE profiles 
SET 
  role = 'admin',
  name = 'Administrador Nova Aliança',
  whatsapp = '5511987115613'
WHERE email = 'qualitecinstrumentosdemedicao@gmail.com';

-- ============================================
-- PASSO 4: VERIFICAR SE ESTÁ TUDO CORRETO
-- ============================================

-- Verificar usuário no auth
SELECT 
  id, 
  email, 
  email_confirmed_at,
  confirmed_at
FROM auth.users 
WHERE email = 'qualitecinstrumentosdemedicao@gmail.com';

-- Verificar perfil
SELECT 
  id, 
  name, 
  email, 
  role, 
  created_at 
FROM profiles 
WHERE email = 'qualitecinstrumentosdemedicao@gmail.com';

-- ============================================
-- RESULTADO ESPERADO:
-- ============================================
-- auth.users:
--   - email_confirmed_at: deve ter uma data (não NULL)
--   - confirmed_at: deve ter uma data (não NULL)
--
-- profiles:
--   - role: deve ser 'admin'
--   - name: 'Administrador Nova Aliança'
--   - email: 'qualitecinstrumentosdemedicao@gmail.com'
-- ============================================
