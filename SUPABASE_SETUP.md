# Guia de Configuração do Supabase

## Passo 1: Credenciais Configuradas

As credenciais do Supabase já foram configuradas no arquivo `.env`:

```
NUXT_PUBLIC_SUPABASE_URL=https://lfznsbvruvjnugyzfyiw.supabase.co
NUXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## Passo 2: Criar o Schema do Banco de Dados

1. Acesse o Supabase Dashboard: https://supabase.com/dashboard
2. Selecione seu projeto: `lfznsbvruvjnugyzfyiw`
3. Vá em **SQL Editor** no menu lateral
4. Clique em **New Query**
5. Copie todo o conteúdo do arquivo `supabase-schema.sql`
6. Cole no editor SQL
7. Clique em **Run** para executar

Isso criará:
- Todas as tabelas (profiles, clients, leads, requests, jobs, job_items, gallery_items)
- Índices para performance
- Triggers para updated_at
- Row Level Security (RLS) configurado
- Políticas de segurança
- Função para criar perfil automaticamente
- Dados iniciais (seed) da galeria

## Passo 3: Criar Usuário Admin

### Opção A: Via Supabase Dashboard (Recomendado)

1. No Supabase Dashboard, vá em **Authentication** > **Users**
2. Clique em **Add user** > **Create new user**
3. Preencha:
   - Email: `admin@novaalianca.com.br`
   - Password: (escolha uma senha forte)
   - Auto Confirm User: Sim (marque esta opção)
4. Clique em **Create user**
5. Copie o UUID do usuário criado
6. Vá em **SQL Editor** e execute:

```sql
-- Substitua 'UUID_DO_USUARIO' pelo UUID copiado
UPDATE profiles 
SET role = 'admin' 
WHERE id = 'UUID_DO_USUARIO';
```

### Opção B: Via SQL

```sql
-- Primeiro, crie o usuário via Dashboard (Authentication > Users)
-- Depois execute este SQL substituindo o UUID:

INSERT INTO profiles (id, name, whatsapp, email, role)
VALUES (
  'UUID_DO_USUARIO_CRIADO',
  'Administrador',
  '5511999999999',
  'admin@novaalianca.com.br',
  'admin'
)
ON CONFLICT (id) DO UPDATE
SET role = 'admin';
```

## Passo 4: Configurar Storage (Opcional)

Para upload de imagens:

1. No Supabase Dashboard, vá em **Storage**
2. Clique em **Create a new bucket**
3. Nome do bucket: `images`
4. Configurações:
   - Public bucket: Sim (marque para imagens públicas)
   - File size limit: 5MB
   - Allowed MIME types: `image/*`
5. Clique em **Create bucket**

### Políticas de Storage

Execute no SQL Editor:

```sql
-- Permitir leitura pública de imagens
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING (bucket_id = 'images');

-- Permitir upload para usuários autenticados
CREATE POLICY "Authenticated users can upload"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'images' 
  AND auth.role() = 'authenticated'
);

-- Permitir delete apenas para admins
CREATE POLICY "Admins can delete"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'images'
  AND EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid() AND role = 'admin'
  )
);
```

## Passo 5: Configurar Email (Opcional)

Para emails de confirmação e recuperação de senha:

1. Vá em **Authentication** > **Email Templates**
2. Personalize os templates:
   - Confirm signup
   - Reset password
   - Magic link

3. Configure SMTP (opcional):
   - Vá em **Project Settings** > **Auth**
   - Configure seu servidor SMTP
   - Ou use o SMTP padrão do Supabase

## Passo 6: Testar a Conexão

Reinicie o servidor de desenvolvimento:

```bash
# Parar o servidor atual (Ctrl+C)
npm run dev
```

Teste as funcionalidades:

1. **Cadastro**: Acesse `/cliente/cadastro` e crie uma conta
2. **Login**: Acesse `/cliente/login` e faça login
3. **Dashboard**: Verifique se o dashboard carrega
4. **Solicitação**: Tente criar uma nova solicitação

## Verificar Dados

No SQL Editor, execute:

```sql
-- Ver todos os perfis
SELECT * FROM profiles;

-- Ver todos os clientes
SELECT * FROM clients;

-- Ver solicitações
SELECT * FROM requests;

-- Ver galeria
SELECT * FROM gallery_items;
```

## Troubleshooting

### Erro: "relation does not exist"
- Execute o schema SQL novamente
- Verifique se todas as tabelas foram criadas

### Erro: "new row violates row-level security policy"
- Verifique se as políticas RLS foram criadas
- Confirme que o usuário está autenticado

### Erro: "JWT expired"
- Verifique se as credenciais no `.env` estão corretas
- Reinicie o servidor

### Usuário não consegue fazer login
- Verifique se o email foi confirmado
- No Dashboard: Authentication > Users > Confirme o usuário manualmente

## Próximos Passos

Após configurar o Supabase:

1. Testar cadastro e login
2. Criar algumas solicitações de teste
3. Verificar se RLS está funcionando
4. Testar área do cliente
5. Testar área admin
6. Implementar upload de imagens
7. Implementar geração de PDFs
8. Configurar notificações por email

## Suporte

Se encontrar problemas:

1. Verifique os logs do Supabase: Dashboard > Logs
2. Verifique o console do navegador (F12)
3. Verifique os logs do servidor Nuxt
4. Consulte a documentação: https://supabase.com/docs

## Links Úteis

- Dashboard: https://supabase.com/dashboard/project/lfznsbvruvjnugyzfyiw
- Documentação: https://supabase.com/docs
- API Docs: https://supabase.com/docs/reference/javascript
- RLS Guide: https://supabase.com/docs/guides/auth/row-level-security
