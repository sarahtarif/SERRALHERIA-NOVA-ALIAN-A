-- ============================================
-- MIGRATION: Tabelas de Orçamentos
-- Data: 27/02/2026
-- ============================================

-- Tabela: orcamentos
CREATE TABLE IF NOT EXISTS orcamentos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  numero TEXT NOT NULL UNIQUE,
  lead_id UUID REFERENCES leads(id) ON DELETE SET NULL,
  client_id UUID REFERENCES clients(id) ON DELETE SET NULL,
  status TEXT NOT NULL CHECK (status IN ('rascunho', 'enviado', 'aprovado', 'rejeitado', 'expirado')) DEFAULT 'rascunho',
  valor_total DECIMAL(10,2) NOT NULL DEFAULT 0,
  valor_desconto DECIMAL(10,2) DEFAULT 0,
  valor_final DECIMAL(10,2) NOT NULL DEFAULT 0,
  impostos DECIMAL(10,2) DEFAULT 0,
  observacoes TEXT,
  validade_dias INTEGER NOT NULL DEFAULT 30,
  data_validade TIMESTAMPTZ NOT NULL,
  pdf_url TEXT,
  created_by UUID NOT NULL REFERENCES profiles(id) ON DELETE RESTRICT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabela: orcamento_itens
CREATE TABLE IF NOT EXISTS orcamento_itens (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  orcamento_id UUID NOT NULL REFERENCES orcamentos(id) ON DELETE CASCADE,
  descricao TEXT NOT NULL,
  quantidade DECIMAL(10,2) NOT NULL DEFAULT 1,
  valor_unitario DECIMAL(10,2) NOT NULL DEFAULT 0,
  valor_total DECIMAL(10,2) NOT NULL DEFAULT 0,
  ordem INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices para orcamentos
CREATE INDEX idx_orcamentos_numero ON orcamentos(numero);
CREATE INDEX idx_orcamentos_lead_id ON orcamentos(lead_id);
CREATE INDEX idx_orcamentos_client_id ON orcamentos(client_id);
CREATE INDEX idx_orcamentos_status ON orcamentos(status);
CREATE INDEX idx_orcamentos_created_by ON orcamentos(created_by);
CREATE INDEX idx_orcamentos_created_at ON orcamentos(created_at DESC);
CREATE INDEX idx_orcamentos_data_validade ON orcamentos(data_validade);

-- Índices para orcamento_itens
CREATE INDEX idx_orcamento_itens_orcamento_id ON orcamento_itens(orcamento_id);
CREATE INDEX idx_orcamento_itens_ordem ON orcamento_itens(orcamento_id, ordem);

-- Trigger para updated_at
CREATE TRIGGER update_orcamentos_updated_at BEFORE UPDATE ON orcamentos
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

ALTER TABLE orcamentos ENABLE ROW LEVEL SECURITY;
ALTER TABLE orcamento_itens ENABLE ROW LEVEL SECURITY;

-- Políticas para orcamentos
CREATE POLICY "Admins podem gerenciar todos os orçamentos"
  ON orcamentos FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Clientes podem ver seus próprios orçamentos"
  ON orcamentos FOR SELECT
  USING (
    client_id IN (
      SELECT id FROM clients WHERE profile_id = auth.uid()
    )
  );

-- Políticas para orcamento_itens
CREATE POLICY "Admins podem gerenciar todos os itens"
  ON orcamento_itens FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Clientes podem ver itens de seus orçamentos"
  ON orcamento_itens FOR SELECT
  USING (
    orcamento_id IN (
      SELECT id FROM orcamentos
      WHERE client_id IN (
        SELECT id FROM clients WHERE profile_id = auth.uid()
      )
    )
  );

-- ============================================
-- FIM DA MIGRATION
-- ============================================
