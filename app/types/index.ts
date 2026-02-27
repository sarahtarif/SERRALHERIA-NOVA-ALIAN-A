export interface Profile {
  id: string
  role: 'client' | 'admin'
  name: string
  whatsapp: string
  email: string
  created_at: string
}

export interface Client {
  id: string
  profile_id: string
  document?: string
  address?: string
  neighborhood?: string
  city: string
  created_at: string
}

export interface Lead {
  id: string
  name: string
  whatsapp: string
  service_type: string
  neighborhood?: string
  message?: string
  source: string
  created_at: string
  updated_at?: string
  status?: 'novo' | 'em_contato' | 'proposta' | 'fechado' | 'perdido'
  converted_to_client?: boolean
  client_id?: string
  notes?: string
}

export interface LeadFilters {
  search?: string
  service_type?: string
  source?: string
  status?: 'novo' | 'em_contato' | 'proposta' | 'fechado' | 'perdido'
  neighborhood?: string
  date_from?: string
  date_to?: string
  converted?: boolean
}

export interface LeadsPagination {
  page: number
  per_page: number
  total: number
  total_pages: number
}

export interface PaginatedLeads {
  data: Lead[]
  pagination: LeadsPagination
}

export interface LeadFormData {
  name: string
  whatsapp: string
  service_type: string
  neighborhood?: string
  message?: string
  source?: string
  status?: 'novo' | 'em_contato' | 'proposta' | 'fechado' | 'perdido'
}

export interface Request {
  id: string
  client_profile_id: string
  service_type: string
  description: string
  status: 'recebido' | 'em_analise' | 'agendado' | 'em_execucao' | 'concluido'
  scheduled_at?: string
  created_at: string
  images?: string[]
}

export interface Job {
  id: string
  request_id: string
  summary: string
  start_at: string
  end_at?: string
  warranty_until?: string
  created_at: string
}

export interface JobItem {
  id: string
  job_id: string
  item_type: 'motor' | 'trava' | 'fotocelula' | 'interfone' | 'camera' | 'protetor_rede' | 'outro'
  brand?: string
  model?: string
  notes?: string
}

export interface GalleryItem {
  id: string
  category: string
  title: string
  description: string
  before_after: boolean
  images: string[]
  created_at: string
}

export interface GalleryCardItem {
  title: string
  description: string
  category: string
  location: string
  video: string | null
  image?: string | null
  isNew?: boolean
  partnerLink?: string
  partnerName?: string
}

export interface Service {
  slug: string
  title: string
  description: string
  icon: string
  features: string[]
  benefits: string[]
}

// Dashboard Types
export interface DashboardStats {
  leadsDoMes: number
  taxaConversao: number
  servicosAgendados: number
  servicosHoje: number
  receitaMes: number
}

export interface RecentLead {
  id: string
  name: string
  service: string
  neighborhood: string
  time: string
  status: string
}

export interface DashboardKPI {
  label: string
  value: string | number
  change: string
  changeType: 'positive' | 'negative' | 'neutral'
  icon: string
  color: 'blue' | 'green' | 'orange' | 'red'
}

// Orçamentos Types
export interface Orcamento {
  id: string
  numero: string
  lead_id?: string
  client_id?: string
  status: 'rascunho' | 'enviado' | 'aprovado' | 'rejeitado' | 'expirado'
  valor_total: number
  valor_desconto?: number
  valor_final: number
  impostos?: number
  observacoes?: string
  validade_dias: number
  data_validade: string
  created_by: string
  created_at: string
  updated_at?: string
  pdf_url?: string
}

export interface OrcamentoItem {
  id: string
  orcamento_id: string
  descricao: string
  quantidade: number
  valor_unitario: number
  valor_total: number
  ordem: number
}

export interface OrcamentoFormData {
  lead_id?: string
  client_id?: string
  status?: 'rascunho' | 'enviado' | 'aprovado' | 'rejeitado' | 'expirado'
  valor_desconto?: number
  observacoes?: string
  validade_dias?: number
  itens: OrcamentoItemFormData[]
}

export interface OrcamentoItemFormData {
  descricao: string
  quantidade: number
  valor_unitario: number
}

export interface OrcamentoFilters {
  search?: string
  status?: 'rascunho' | 'enviado' | 'aprovado' | 'rejeitado' | 'expirado'
  client_id?: string
  lead_id?: string
  date_from?: string
  date_to?: string
  valor_min?: number
  valor_max?: number
}

export interface OrcamentosPagination {
  page: number
  per_page: number
  total: number
  total_pages: number
}

export interface PaginatedOrcamentos {
  data: Orcamento[]
  pagination: OrcamentosPagination
}

export interface OrcamentoWithItems extends Orcamento {
  itens: OrcamentoItem[]
}

export interface ImpostosConfig {
  aliquota_iss: number
  aliquota_pis: number
  aliquota_cofins: number
  aliquota_csll: number
}
