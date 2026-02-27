-- ============================================
-- CRIAR ADMIN: Marcela Abreu
-- Email: marcelababreu01@gmail.com
-- ============================================

-- IMPORTANTE: Execute este script DEPOIS de criar o usuário no Supabase Dashboard!

DO $$
DECLARE
  v_user_id UUID;
BEGIN
  -- Buscar o ID do usuário pelo email
  SELECT id INTO v_user_id
  FROM auth.users
  WHERE email = 'marcelababreu01@gmail.com';
  
  -- Verificar se o usuário existe
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Usuário não encontrado! Crie o usuário no Supabase Dashboard primeiro.';
  END IF;
  
  -- Criar ou atualizar o perfil como admin
  INSERT INTO profiles (id, role, name, whatsapp, email, created_at, updated_at)
  VALUES (
    v_user_id,
    'admin',
    'Marcela Abreu',
    '11999999999', -- Atualize com o WhatsApp correto
    'marcelababreu01@gmail.com',
    NOW(),
    NOW()
  )
  ON CONFLICT (id) 
  DO UPDATE SET
    role = 'admin',
    name = 'Marcela Abreu',
    email = 'marcelababreu01@gmail.com',
    updated_at = NOW();
  
  RAISE NOTICE 'Admin criado com sucesso! User ID: %', v_user_id;
END $$;

-- Verificar se foi criado corretamente
SELECT 
  p.id,
  p.name,
  p.email,
  p.role,
  p.whatsapp,
  u.email as auth_email,
  u.email_confirmed_at
FROM profiles p
JOIN auth.users u ON p.id = u.id
WHERE p.email = 'marcelababreu01@gmail.com';
