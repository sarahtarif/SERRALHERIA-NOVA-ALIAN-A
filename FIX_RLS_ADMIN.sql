-- ============================================
-- CORRIGIR RLS PARA PERMITIR ADMIN LER SEU PRÓPRIO PERFIL
-- ============================================

-- O problema: As políticas RLS estão impedindo o admin de ler seu próprio perfil
-- Solução: Adicionar política que permite usuário ler seu próprio perfil

-- 1. Remover políticas antigas que podem estar conflitando
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON profiles;

-- 2. Criar política correta: Usuários podem ver seu próprio perfil
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

-- 3. Criar política: Admins podem ver todos os perfis
CREATE POLICY "Admins can view all profiles"
  ON profiles FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- 4. Verificar se as políticas foram criadas
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual
FROM pg_policies
WHERE tablename = 'profiles';

-- ============================================
-- TESTE: Verificar se consegue ler o perfil
-- ============================================

-- Este SELECT deve retornar o perfil do admin
SELECT id, email, role, name 
FROM profiles 
WHERE email = 'qualitecinstrumentosdemedicao@gmail.com';
