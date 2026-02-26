-- ============================================
-- RECRIAR POLÍTICAS RLS DO ZERO
-- ============================================

-- PASSO 1: Remover TODAS as políticas existentes
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON profiles;
DROP POLICY IF EXISTS "Enable read access for authenticated users" ON profiles;
DROP POLICY IF EXISTS "Enable update for users based on id" ON profiles;

-- PASSO 2: Criar políticas simples e funcionais

-- Política 1: Qualquer usuário autenticado pode ler qualquer perfil
CREATE POLICY "authenticated_read_all_profiles"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (true);

-- Política 2: Usuários podem atualizar apenas seu próprio perfil
CREATE POLICY "users_update_own_profile"
  ON profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Política 3: Permitir INSERT para novos usuários (trigger handle_new_user)
CREATE POLICY "service_role_insert_profiles"
  ON profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- PASSO 3: Verificar políticas criadas
SELECT 
  schemaname, 
  tablename, 
  policyname, 
  permissive, 
  cmd,
  qual
FROM pg_policies
WHERE tablename = 'profiles'
ORDER BY policyname;

-- PASSO 4: Testar leitura do perfil
SELECT id, email, role, name, created_at 
FROM profiles 
WHERE email = 'qualitecinstrumentosdemedicao@gmail.com';
