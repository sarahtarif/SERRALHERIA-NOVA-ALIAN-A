-- ============================================
-- SCRIPT: Criar Admin Marcela Abreu
-- Email: samuel.tarif@gmail.com
-- Data: 27/02/2026
-- ============================================

-- IMPORTANTE: Este script deve ser executado APÓS criar o usuário no Supabase Auth
-- 
-- PASSOS PARA CRIAR O ADMIN:
-- 
-- 1. Acesse o Supabase Dashboard: https://supabase.com/dashboard
-- 2. Vá em Authentication > Users
-- 3. Clique em "Add User" > "Create new user"
-- 4. Preencha:
--    - Email: samuel.tarif@gmail.com
--    - Password: [escolha uma senha forte]
--    - Auto Confirm User: SIM (marque esta opção)
-- 5. Clique em "Create user"
-- 6. Copie o UUID do usuário criado
-- 7. Execute este script substituindo 'UUID_DO_USUARIO' pelo UUID copiado

-- ============================================
-- OPÇÃO 1: Se você JÁ criou o usuário no Auth
-- ============================================

-- Substitua 'UUID_DO_USUARIO' pelo UUID real do usuário criado
DO $$
DECLARE
    user_uuid UUID := 'UUID_DO_USUARIO'; -- SUBSTITUA AQUI
BEGIN
    -- Verificar se o perfil já existe
    IF NOT EXISTS (SELECT 1 FROM profiles WHERE id = user_uuid) THEN
        -- Criar perfil admin
        INSERT INTO profiles (id, name, whatsapp, email, role)
        VALUES (
            user_uuid,
            'Marcela Abreu',
            '11999999999', -- Substitua pelo WhatsApp real se necessário
            'samuel.tarif@gmail.com',
            'admin'
        );
        
        RAISE NOTICE 'Perfil admin criado com sucesso para Marcela Abreu';
    ELSE
        -- Atualizar perfil existente para admin
        UPDATE profiles 
        SET 
            name = 'Marcela Abreu',
            email = 'samuel.tarif@gmail.com',
            role = 'admin'
        WHERE id = user_uuid;
        
        RAISE NOTICE 'Perfil atualizado para admin: Marcela Abreu';
    END IF;
END $$;

-- ============================================
-- OPÇÃO 2: Buscar por email e atualizar
-- ============================================

-- Se você não sabe o UUID, use este script para buscar por email
-- ATENÇÃO: Só funciona se o usuário já existir no auth.users

DO $$
DECLARE
    user_uuid UUID;
BEGIN
    -- Buscar UUID do usuário pelo email
    SELECT id INTO user_uuid
    FROM auth.users
    WHERE email = 'samuel.tarif@gmail.com'
    LIMIT 1;
    
    IF user_uuid IS NULL THEN
        RAISE EXCEPTION 'Usuário com email samuel.tarif@gmail.com não encontrado no auth.users. Crie o usuário primeiro no Supabase Dashboard.';
    END IF;
    
    -- Verificar se o perfil já existe
    IF NOT EXISTS (SELECT 1 FROM profiles WHERE id = user_uuid) THEN
        -- Criar perfil admin
        INSERT INTO profiles (id, name, whatsapp, email, role)
        VALUES (
            user_uuid,
            'Marcela Abreu',
            '11999999999', -- Substitua pelo WhatsApp real se necessário
            'samuel.tarif@gmail.com',
            'admin'
        );
        
        RAISE NOTICE 'Perfil admin criado com sucesso para Marcela Abreu (UUID: %)', user_uuid;
    ELSE
        -- Atualizar perfil existente para admin
        UPDATE profiles 
        SET 
            name = 'Marcela Abreu',
            email = 'samuel.tarif@gmail.com',
            role = 'admin'
        WHERE id = user_uuid;
        
        RAISE NOTICE 'Perfil atualizado para admin: Marcela Abreu (UUID: %)', user_uuid;
    END IF;
END $$;

-- ============================================
-- VERIFICAÇÃO: Confirmar que o admin foi criado
-- ============================================

SELECT 
    p.id,
    p.name,
    p.email,
    p.role,
    p.created_at,
    u.email_confirmed_at,
    u.last_sign_in_at
FROM profiles p
JOIN auth.users u ON u.id = p.id
WHERE p.email = 'samuel.tarif@gmail.com';

-- ============================================
-- INSTRUÇÕES DE USO
-- ============================================

/*
MÉTODO RECOMENDADO (mais seguro):

1. Acesse o Supabase Dashboard
2. Vá em Authentication > Users
3. Clique em "Add User"
4. Preencha:
   - Email: samuel.tarif@gmail.com
   - Password: [senha forte]
   - Auto Confirm User: ✓ (marque)
5. Clique em "Create user"
6. Execute a OPÇÃO 2 deste script no SQL Editor

RESULTADO ESPERADO:
- Usuário criado no auth.users
- Perfil criado na tabela profiles com role='admin'
- Email confirmado automaticamente
- Pronto para fazer login em /auth/secure/admin-access

CREDENCIAIS DE ACESSO:
- URL: https://novalianca.vercel.app/auth/secure/admin-access
- Email: samuel.tarif@gmail.com
- Senha: [a senha que você definiu no passo 4]
- Nome: Marcela Abreu
- Role: admin

TESTE DE ACESSO:
1. Acesse https://novalianca.vercel.app/auth/secure/admin-access
2. Faça login com as credenciais
3. Você deve ser redirecionado para /admin (dashboard)
4. Verifique se o nome "Marcela Abreu" aparece no canto superior direito
*/

-- ============================================
-- FIM DO SCRIPT
-- ============================================
