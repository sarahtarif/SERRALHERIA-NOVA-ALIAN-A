-- ============================================
-- MIGRATION: add_leads_admin_columns
-- Data: 27/02/2026
-- Descrição: Adicionar colunas para gestão admin de leads
-- ============================================

-- Adicionar coluna status
ALTER TABLE leads 
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'novo' 
CHECK (status IN ('novo', 'em_contato', 'proposta', 'fechado', 'perdido'));

-- Adicionar coluna converted_to_client
ALTER TABLE leads 
ADD COLUMN IF NOT EXISTS converted_to_client BOOLEAN DEFAULT false;

-- Adicionar coluna client_id (referência para clients)
ALTER TABLE leads 
ADD COLUMN IF NOT EXISTS client_id UUID REFERENCES clients(id) ON DELETE SET NULL;

-- Adicionar coluna updated_at
ALTER TABLE leads 
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

-- Criar índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_leads_status ON leads(status);
CREATE INDEX IF NOT EXISTS idx_leads_converted ON leads(converted_to_client);
CREATE INDEX IF NOT EXISTS idx_leads_client_id ON leads(client_id);

-- Comentários nas colunas
COMMENT ON COLUMN leads.status IS 'Status do lead: novo, em_contato, proposta, fechado, perdido';
COMMENT ON COLUMN leads.converted_to_client IS 'Indica se o lead foi convertido em cliente';
COMMENT ON COLUMN leads.client_id IS 'ID do cliente criado a partir deste lead';
COMMENT ON COLUMN leads.updated_at IS 'Data da última atualização do lead';

-- ============================================
-- TESTE DE VALIDAÇÃO
-- ============================================

-- Inserir lead de teste
INSERT INTO leads (name, whatsapp, service_type, neighborhood, message, source, status, converted_to_client)
VALUES ('TESTE', '11999999999', 'INSTALAÇÃO MOTOR', 'CENTRO', 'Teste de criação', 'manual', 'novo', false)
RETURNING *;

-- Verificar estrutura da tabela
SELECT column_name, data_type, column_default, is_nullable
FROM information_schema.columns
WHERE table_name = 'leads' AND table_schema = 'public'
ORDER BY ordinal_position;
