-- ============================================
-- SCHEMA DO BANCO DE DADOS - SERRALHERIA NOVA ALIANÇA
-- ============================================

-- Habilitar extensões necessárias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- TABELA: profiles
-- Perfis de usuários (clientes e admins)
-- ============================================
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('client', 'admin')) DEFAULT 'client',
  name TEXT NOT NULL,
  whatsapp TEXT NOT NULL,
  email TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices para profiles
CREATE INDEX idx_profiles_role ON profiles(role);
CREATE INDEX idx_profiles_email ON profiles(email);

-- ============================================
-- TABELA: clients
-- Informações adicionais de clientes
-- ============================================
CREATE TABLE IF NOT EXISTS clients (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  document TEXT,
  address TEXT,
  neighborhood TEXT,
  city TEXT NOT NULL DEFAULT 'São Paulo',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(profile_id)
);

-- Índices para clients
CREATE INDEX idx_clients_profile_id ON clients(profile_id);
CREATE INDEX idx_clients_city ON clients(city);

-- ============================================
-- TABELA: leads
-- Leads capturados via formulários
-- ============================================
CREATE TABLE IF NOT EXISTS leads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  whatsapp TEXT NOT NULL,
  service_type TEXT NOT NULL,
  neighborhood TEXT,
  message TEXT,
  source TEXT DEFAULT 'website',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices para leads
CREATE INDEX idx_leads_created_at ON leads(created_at DESC);
CREATE INDEX idx_leads_service_type ON leads(service_type);

-- ============================================
-- TABELA: requests
-- Solicitações de orçamento/serviço
-- ============================================
CREATE TABLE IF NOT EXISTS requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  service_type TEXT NOT NULL,
  description TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('recebido', 'em_analise', 'agendado', 'em_execucao', 'concluido')) DEFAULT 'recebido',
  scheduled_at TIMESTAMPTZ,
  images TEXT[],
  gate_type TEXT,
  preferred_time TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices para requests
CREATE INDEX idx_requests_client_profile_id ON requests(client_profile_id);
CREATE INDEX idx_requests_status ON requests(status);
CREATE INDEX idx_requests_created_at ON requests(created_at DESC);

-- ============================================
-- TABELA: jobs
-- Serviços realizados
-- ============================================
CREATE TABLE IF NOT EXISTS jobs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  request_id UUID NOT NULL REFERENCES requests(id) ON DELETE CASCADE,
  summary TEXT NOT NULL,
  start_at TIMESTAMPTZ NOT NULL,
  end_at TIMESTAMPTZ,
  warranty_until TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices para jobs
CREATE INDEX idx_jobs_request_id ON jobs(request_id);
CREATE INDEX idx_jobs_start_at ON jobs(start_at DESC);

-- ============================================
-- TABELA: job_items
-- Itens instalados em cada serviço
-- ============================================
CREATE TABLE IF NOT EXISTS job_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  job_id UUID NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
  item_type TEXT NOT NULL CHECK (item_type IN ('motor', 'trava', 'fotocelula', 'interfone', 'camera', 'protetor_rede', 'outro')),
  brand TEXT,
  model TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices para job_items
CREATE INDEX idx_job_items_job_id ON job_items(job_id);
CREATE INDEX idx_job_items_item_type ON job_items(item_type);

-- ============================================
-- TABELA: gallery_items
-- Portfólio de trabalhos realizados
-- ============================================
CREATE TABLE IF NOT EXISTS gallery_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  category TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  before_after BOOLEAN DEFAULT FALSE,
  images TEXT[] NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices para gallery_items
CREATE INDEX idx_gallery_items_category ON gallery_items(category);
CREATE INDEX idx_gallery_items_created_at ON gallery_items(created_at DESC);

-- ============================================
-- TRIGGERS PARA UPDATED_AT
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_clients_updated_at BEFORE UPDATE ON clients
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_requests_updated_at BEFORE UPDATE ON requests
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_jobs_updated_at BEFORE UPDATE ON jobs
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_gallery_items_updated_at BEFORE UPDATE ON gallery_items
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

-- Habilitar RLS em todas as tabelas
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE job_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery_items ENABLE ROW LEVEL SECURITY;

-- ============================================
-- POLÍTICAS RLS: profiles
-- ============================================

-- Usuários podem ver seu próprio perfil
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

-- Usuários podem atualizar seu próprio perfil
CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- Admins podem ver todos os perfis
CREATE POLICY "Admins can view all profiles"
  ON profiles FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- ============================================
-- POLÍTICAS RLS: clients
-- ============================================

-- Clientes podem ver seus próprios dados
CREATE POLICY "Clients can view own data"
  ON clients FOR SELECT
  USING (profile_id = auth.uid());

-- Clientes podem atualizar seus próprios dados
CREATE POLICY "Clients can update own data"
  ON clients FOR UPDATE
  USING (profile_id = auth.uid());

-- Admins podem ver todos os clientes
CREATE POLICY "Admins can view all clients"
  ON clients FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- ============================================
-- POLÍTICAS RLS: leads
-- ============================================

-- Apenas admins podem ver leads
CREATE POLICY "Admins can manage leads"
  ON leads FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Permitir inserção pública de leads (formulários)
CREATE POLICY "Anyone can create leads"
  ON leads FOR INSERT
  WITH CHECK (true);

-- ============================================
-- POLÍTICAS RLS: requests
-- ============================================

-- Clientes podem ver suas próprias solicitações
CREATE POLICY "Clients can view own requests"
  ON requests FOR SELECT
  USING (client_profile_id = auth.uid());

-- Clientes podem criar solicitações
CREATE POLICY "Clients can create requests"
  ON requests FOR INSERT
  WITH CHECK (client_profile_id = auth.uid());

-- Admins podem gerenciar todas as solicitações
CREATE POLICY "Admins can manage all requests"
  ON requests FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- ============================================
-- POLÍTICAS RLS: jobs
-- ============================================

-- Clientes podem ver seus próprios serviços
CREATE POLICY "Clients can view own jobs"
  ON jobs FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM requests
      WHERE requests.id = jobs.request_id
      AND requests.client_profile_id = auth.uid()
    )
  );

-- Admins podem gerenciar todos os serviços
CREATE POLICY "Admins can manage all jobs"
  ON jobs FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- ============================================
-- POLÍTICAS RLS: job_items
-- ============================================

-- Clientes podem ver itens de seus serviços
CREATE POLICY "Clients can view own job items"
  ON job_items FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM jobs
      JOIN requests ON requests.id = jobs.request_id
      WHERE jobs.id = job_items.job_id
      AND requests.client_profile_id = auth.uid()
    )
  );

-- Admins podem gerenciar todos os itens
CREATE POLICY "Admins can manage all job items"
  ON job_items FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- ============================================
-- POLÍTICAS RLS: gallery_items
-- ============================================

-- Todos podem ver a galeria (público)
CREATE POLICY "Anyone can view gallery"
  ON gallery_items FOR SELECT
  USING (true);

-- Apenas admins podem gerenciar a galeria
CREATE POLICY "Admins can manage gallery"
  ON gallery_items FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- ============================================
-- FUNÇÃO: Criar perfil automaticamente após signup
-- ============================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, name, whatsapp, email, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', 'Usuário'),
    COALESCE(NEW.raw_user_meta_data->>'whatsapp', ''),
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'role', 'client')
  );
  
  -- Se for cliente, criar registro na tabela clients
  IF COALESCE(NEW.raw_user_meta_data->>'role', 'client') = 'client' THEN
    INSERT INTO public.clients (profile_id, city)
    VALUES (NEW.id, 'São Paulo');
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger para criar perfil automaticamente
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================
-- DADOS INICIAIS (SEED)
-- ============================================

-- Criar usuário admin (você precisará criar este usuário via Supabase Auth primeiro)
-- Depois execute este comando substituindo o UUID pelo ID do usuário criado:
-- INSERT INTO profiles (id, name, whatsapp, email, role)
-- VALUES ('UUID_DO_USUARIO_ADMIN', 'Admin', '5511999999999', 'admin@novaalianca.com.br', 'admin');

-- Inserir itens de exemplo na galeria
INSERT INTO gallery_items (category, title, description, before_after, images) VALUES
  ('Portões', 'Portão Basculante Automatizado', 'Instalação completa de motor PPA com fotocélula e controle remoto', false, ARRAY['https://placehold.co/800x600/0056e0/ffffff?text=Portao+Basculante']),
  ('Automação', 'Motor Deslizante Industrial', 'Automação de portão deslizante para condomínio', false, ARRAY['https://placehold.co/800x600/0056e0/ffffff?text=Motor+Deslizante']),
  ('Travas', 'Trava Eletrônica de Segurança', 'Instalação de trava eletrônica com acionamento remoto', false, ARRAY['https://placehold.co/800x600/0056e0/ffffff?text=Trava+Eletronica']),
  ('Interfone', 'Vídeo Porteiro Intelbras', 'Instalação de vídeo porteiro com câmera HD', false, ARRAY['https://placehold.co/800x600/0056e0/ffffff?text=Video+Porteiro']),
  ('Câmeras', 'Sistema de Câmeras IP', 'Instalação de 4 câmeras IP com visão noturna', false, ARRAY['https://placehold.co/800x600/0056e0/ffffff?text=Cameras+IP']),
  ('Fotocélula', 'Fotocélula Anti-Esmagamento', 'Instalação de fotocélula de segurança', false, ARRAY['https://placehold.co/800x600/0056e0/ffffff?text=Fotocelula']),
  ('Manutenção', 'Manutenção Preventiva', 'Revisão completa de motor e componentes', false, ARRAY['https://placehold.co/800x600/0056e0/ffffff?text=Manutencao']),
  ('Grades', 'Grade de Proteção', 'Instalação de grade de segurança em janela', false, ARRAY['https://placehold.co/800x600/0056e0/ffffff?text=Grade+Protecao']),
  ('Portões', 'Portão Pivotante', 'Portão pivotante com acabamento premium', false, ARRAY['https://placehold.co/800x600/0056e0/ffffff?text=Portao+Pivotante']),
  ('Automação', 'Controle de Acesso', 'Sistema de controle de acesso com tag RFID', false, ARRAY['https://placehold.co/800x600/0056e0/ffffff?text=Controle+Acesso']);

-- ============================================
-- FIM DO SCHEMA
-- ============================================
