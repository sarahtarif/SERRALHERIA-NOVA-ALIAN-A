-- =====================================================
-- MIGRATION: Adicionar Tabelas de Serviços e Agenda
-- Data: 27/02/2026
-- Descrição: Criar tabelas servicos, agenda e servico_agenda
-- =====================================================

-- 1. CRIAR TABELA SERVICOS
-- =====================================================
CREATE TABLE IF NOT EXISTS public.servicos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome VARCHAR(255) NOT NULL,
  descricao TEXT,
  categoria VARCHAR(50) NOT NULL CHECK (categoria IN ('instalacao', 'manutencao', 'reparo', 'orcamento')),
  tipo_servico VARCHAR(100) NOT NULL,
  status VARCHAR(50) NOT NULL DEFAULT 'agendado' CHECK (status IN ('agendado', 'em_execucao', 'concluido', 'cancelado')),
  
  -- Relações
  client_id UUID REFERENCES public.clients(id) ON DELETE SET NULL,
  lead_id UUID REFERENCES public.leads(id) ON DELETE SET NULL,
  orcamento_id UUID REFERENCES public.orcamentos(id) ON DELETE SET NULL,
  tecnico_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  
  -- Datas
  data_agendada TIMESTAMPTZ,
  data_inicio TIMESTAMPTZ,
  data_conclusao TIMESTAMPTZ,
  
  -- Localização
  endereco TEXT,
  bairro VARCHAR(100),
  cidade VARCHAR(100) NOT NULL DEFAULT 'São Paulo',
  
  -- Informações adicionais
  observacoes TEXT,
  valor DECIMAL(10, 2),
  
  -- Auditoria
  created_by UUID NOT NULL REFERENCES public.profiles(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ,
  
  -- Índices para busca
  CONSTRAINT servicos_nome_check CHECK (char_length(nome) >= 3)
);

-- Comentários
COMMENT ON TABLE public.servicos IS 'Tabela de serviços (instalações, manutenções, reparos)';
COMMENT ON COLUMN public.servicos.categoria IS 'Categoria do serviço: instalacao, manutencao, reparo, orcamento';
COMMENT ON COLUMN public.servicos.tipo_servico IS 'Tipo específico: redes, portoes, cameras, interfones, etc.';
COMMENT ON COLUMN public.servicos.status IS 'Status: agendado, em_execucao, concluido, cancelado';

-- 2. CRIAR TABELA AGENDA
-- =====================================================
CREATE TABLE IF NOT EXISTS public.agenda (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  servico_id UUID NOT NULL REFERENCES public.servicos(id) ON DELETE CASCADE,
  
  -- Data e horário
  data DATE NOT NULL,
  hora_inicio TIME NOT NULL,
  hora_fim TIME,
  
  -- Técnico responsável
  tecnico_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  
  -- Status
  status VARCHAR(50) NOT NULL DEFAULT 'agendado' CHECK (status IN ('agendado', 'em_andamento', 'concluido', 'cancelado')),
  
  -- Observações
  observacoes TEXT,
  
  -- Auditoria
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ,
  
  -- Constraint: hora_fim deve ser maior que hora_inicio
  CONSTRAINT agenda_horario_valido CHECK (hora_fim IS NULL OR hora_fim > hora_inicio)
);

-- Comentários
COMMENT ON TABLE public.agenda IS 'Tabela de agendamentos de serviços';
COMMENT ON COLUMN public.agenda.data IS 'Data do agendamento (YYYY-MM-DD)';
COMMENT ON COLUMN public.agenda.hora_inicio IS 'Horário de início (HH:MM)';
COMMENT ON COLUMN public.agenda.hora_fim IS 'Horário de término (HH:MM)';

-- 3. CRIAR TABELA SERVICO_AGENDA (Relação N:N)
-- =====================================================
CREATE TABLE IF NOT EXISTS public.servico_agenda (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  servico_id UUID NOT NULL REFERENCES public.servicos(id) ON DELETE CASCADE,
  agenda_item_id UUID NOT NULL REFERENCES public.agenda(id) ON DELETE CASCADE,
  ordem INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  
  -- Constraint: combinação única
  CONSTRAINT servico_agenda_unique UNIQUE (servico_id, agenda_item_id)
);

-- Comentários
COMMENT ON TABLE public.servico_agenda IS 'Tabela de relação entre serviços e agenda (permite múltiplos agendamentos por serviço)';
COMMENT ON COLUMN public.servico_agenda.ordem IS 'Ordem do agendamento (1º, 2º, etc.)';

-- 4. CRIAR ÍNDICES
-- =====================================================

-- Índices para SERVICOS
CREATE INDEX IF NOT EXISTS idx_servicos_categoria ON public.servicos(categoria);
CREATE INDEX IF NOT EXISTS idx_servicos_tipo_servico ON public.servicos(tipo_servico);
CREATE INDEX IF NOT EXISTS idx_servicos_status ON public.servicos(status);
CREATE INDEX IF NOT EXISTS idx_servicos_client_id ON public.servicos(client_id);
CREATE INDEX IF NOT EXISTS idx_servicos_lead_id ON public.servicos(lead_id);
CREATE INDEX IF NOT EXISTS idx_servicos_orcamento_id ON public.servicos(orcamento_id);
CREATE INDEX IF NOT EXISTS idx_servicos_tecnico_id ON public.servicos(tecnico_id);
CREATE INDEX IF NOT EXISTS idx_servicos_data_agendada ON public.servicos(data_agendada);
CREATE INDEX IF NOT EXISTS idx_servicos_bairro ON public.servicos(bairro);
CREATE INDEX IF NOT EXISTS idx_servicos_created_at ON public.servicos(created_at DESC);

-- Índices para AGENDA
CREATE INDEX IF NOT EXISTS idx_agenda_servico_id ON public.agenda(servico_id);
CREATE INDEX IF NOT EXISTS idx_agenda_data ON public.agenda(data);
CREATE INDEX IF NOT EXISTS idx_agenda_tecnico_id ON public.agenda(tecnico_id);
CREATE INDEX IF NOT EXISTS idx_agenda_status ON public.agenda(status);
CREATE INDEX IF NOT EXISTS idx_agenda_data_tecnico ON public.agenda(data, tecnico_id);

-- Índices para SERVICO_AGENDA
CREATE INDEX IF NOT EXISTS idx_servico_agenda_servico_id ON public.servico_agenda(servico_id);
CREATE INDEX IF NOT EXISTS idx_servico_agenda_agenda_item_id ON public.servico_agenda(agenda_item_id);

-- 5. HABILITAR RLS (Row Level Security)
-- =====================================================

ALTER TABLE public.servicos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agenda ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.servico_agenda ENABLE ROW LEVEL SECURITY;

-- 6. CRIAR POLÍTICAS RLS
-- =====================================================

-- Políticas para SERVICOS
-- Admin: acesso total
CREATE POLICY "Admin pode fazer tudo em servicos"
  ON public.servicos
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Cliente: pode ver apenas seus próprios serviços
CREATE POLICY "Cliente pode ver seus servicos"
  ON public.servicos
  FOR SELECT
  TO authenticated
  USING (
    client_id IN (
      SELECT id FROM public.clients
      WHERE profile_id = auth.uid()
    )
  );

-- Políticas para AGENDA
-- Admin: acesso total
CREATE POLICY "Admin pode fazer tudo em agenda"
  ON public.agenda
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Técnico: pode ver sua própria agenda
CREATE POLICY "Tecnico pode ver sua agenda"
  ON public.agenda
  FOR SELECT
  TO authenticated
  USING (
    tecnico_id = auth.uid()
  );

-- Políticas para SERVICO_AGENDA
-- Admin: acesso total
CREATE POLICY "Admin pode fazer tudo em servico_agenda"
  ON public.servico_agenda
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- 7. CRIAR FUNÇÃO PARA ATUALIZAR updated_at
-- =====================================================

CREATE OR REPLACE FUNCTION update_servicos_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION update_agenda_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 8. CRIAR TRIGGERS
-- =====================================================

CREATE TRIGGER trigger_servicos_updated_at
  BEFORE UPDATE ON public.servicos
  FOR EACH ROW
  EXECUTE FUNCTION update_servicos_updated_at();

CREATE TRIGGER trigger_agenda_updated_at
  BEFORE UPDATE ON public.agenda
  FOR EACH ROW
  EXECUTE FUNCTION update_agenda_updated_at();

-- 9. INSERIR DADOS DE EXEMPLO (OPCIONAL)
-- =====================================================

-- Buscar ID do admin para usar como created_by
DO $$
DECLARE
  admin_id UUID;
BEGIN
  SELECT id INTO admin_id
  FROM public.profiles
  WHERE role = 'admin'
  LIMIT 1;

  IF admin_id IS NOT NULL THEN
    -- Inserir serviços de exemplo
    INSERT INTO public.servicos (nome, descricao, categoria, tipo_servico, status, bairro, cidade, valor, created_by)
    VALUES
      ('Instalação de Rede de Proteção 3x2m', 'Instalação de rede de proteção para sacada', 'instalacao', 'redes', 'agendado', 'Moema', 'São Paulo', 500.00, admin_id),
      ('Manutenção Preventiva Portão Automático', 'Revisão completa do sistema', 'manutencao', 'portoes', 'agendado', 'Pinheiros', 'São Paulo', 200.00, admin_id),
      ('Instalação de Câmera de Segurança', 'Instalação de 2 câmeras IP', 'instalacao', 'cameras', 'concluido', 'Vila Mariana', 'São Paulo', 800.00, admin_id)
    ON CONFLICT DO NOTHING;
  END IF;
END $$;

-- =====================================================
-- FIM DA MIGRATION
-- =====================================================

-- Verificar tabelas criadas
SELECT 
  table_name,
  (SELECT COUNT(*) FROM information_schema.columns WHERE table_name = t.table_name) as column_count
FROM information_schema.tables t
WHERE table_schema = 'public'
AND table_name IN ('servicos', 'agenda', 'servico_agenda')
ORDER BY table_name;

-- Verificar índices criados
SELECT 
  tablename,
  indexname
FROM pg_indexes
WHERE schemaname = 'public'
AND tablename IN ('servicos', 'agenda', 'servico_agenda')
ORDER BY tablename, indexname;
