-- ============================================
-- SCRIPT SIMPLES: Criar Admin Marcela Abreu
-- Email: samuel.tarif@gmail.com
-- ============================================

-- Este script busca automaticamente o usuário pelo email
-- e cria/atualiza o perfil como admin

DO $$
DECLARE
    user_uuid UUID;
BEGIN
    -- Buscar UUID do usuário pelo email
    SELECT id INTO user_uuid
    FROM auth.users
    WHERE email = 'samuel.tarif@gmail.com'
    LIMIT 1;
    
    -- Verificar se o usuário existe
    IF user_uuid IS NULL THEN
        RAISE EXCEPTION 'Usuário com email samuel.tarif@gmail.com não encontrado. 
        
CRIE O USUÁRIO PRIMEIRO:
1. Vá em Authentication > Users no Supabase Dashboard
2. Clique em "Add User"
3. Email: samuel.tarif@gmail.com
4. Password: [escolha uma senha]
5. Auto Confirm User: ✓ (marque)
6. Clique em "Create user"
7. Execute este script novamente';
    END IF;
    
    -- Verificar se o perfil já existe
    IF NOT EXISTS (SELECT 1 FROM profiles WHERE id = user_uuid) THEN
        -- Criar perfil admin
        INSERT INTO profiles (id, name, whatsapp, email, role)
        VALUES (
            user_uuid,
            'Marcela Abreu',
            '11999999999',
            'samuel.tarif@gmail.com',
            'admin'
        );
        
        RAISE NOTICE '✅ Perfil admin criado com sucesso!';
        RAISE NOTICE 'Nome: Marcela Abreu';
        RAISE NOTICE 'Email: samuel.tarif@gmail.com';
        RAISE NOTICE 'Role: admin';
        RAISE NOTICE 'UUID: %', user_uuid;
    ELSE
        -- Atualizar perfil existente para admin
        UPDATE profiles 
        SET 
            name = 'Marcela Abreu',
            email = 'samuel.tarif@gmail.com',
            role = 'admin'
        WHERE id = user_uuid;
        
        RAISE NOTICE '✅ Perfil atualizado para admin!';
        RAISE NOTICE 'Nome: Marcela Abreu';
        RAISE NOTICE 'Email: samuel.tarif@gmail.com';
        RAISE NOTICE 'Role: admin';
        RAISE NOTICE 'UUID: %', user_uuid;
    END IF;
END $$;

-- Verificar o resultado
SELECT 
    p.id as "UUID",
    p.name as "Nome",
    p.email as "Email",
    p.role as "Role",
    p.whatsapp as "WhatsApp",
    u.email_confirmed_at as "Email Confirmado",
    u.created_at as "Criado em"
FROM profiles p
JOIN auth.users u ON u.id = p.id
WHERE p.email = 'samuel.tarif@gmail.com';
