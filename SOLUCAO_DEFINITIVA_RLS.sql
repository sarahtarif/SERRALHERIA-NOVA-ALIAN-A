-- ============================================
-- SOLUÇÃO DEFINITIVA: DESABILITAR RLS TEMPORARIAMENTE
-- ============================================
-- Esta é uma solução temporária para você conseguir acessar o painel
-- Depois podemos reconfigurar o RLS corretamente

-- OPÇÃO 1: Desabilitar RLS completamente na tabela profiles (TEMPORÁRIO)
ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;

-- Verificar se funcionou
SELECT id, email, role, name 
FROM profiles 
WHERE email = 'qualitecinstrumentosdemedicao@gmail.com';

-- ============================================
-- DEPOIS QUE FUNCIONAR, VOCÊ PODE REABILITAR COM POLÍTICAS CORRETAS
-- ============================================

-- Para reabilitar depois (NÃO EXECUTE AGORA):
-- ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- E criar políticas mais simples:
-- DROP POLICY IF EXISTS "Enable read access for authenticated users" ON profiles;
-- CREATE POLICY "Enable read access for authenticated users"
--   ON profiles FOR SELECT
--   TO authenticated
--   USING (true);

-- DROP POLICY IF EXISTS "Enable update for users based on id" ON profiles;
-- CREATE POLICY "Enable update for users based on id"
--   ON profiles FOR UPDATE
--   TO authenticated
--   USING (auth.uid() = id);
