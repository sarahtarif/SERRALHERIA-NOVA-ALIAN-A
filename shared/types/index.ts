// --- Gallery ---
export interface GalleryItem {
  id: string
  category: string
  title: string
  description: string | null
  location: string
  media_type: string
  media_name: string
  show_on_home: boolean
  aspect_ratio: string
  created_at: string
  data_url?: string
}

// --- User / Profile ---
export interface UserProfile {
  id: string
  email: string
  full_name: string | null
  phone: string | null
  cep: string | null
  street: string | null
  number: string | null
  complement: string | null
  neighborhood: string | null
  city: string | null
  state: string | null
  created_at: string
  updated_at: string
}

export type UserProfileUpdate = Omit<UserProfile, 'id' | 'email' | 'created_at' | 'updated_at'>

// --- Auth ---
export interface AuthUser {
  id: string
  email: string
}

// --- Services ---
export interface Service {
  slug: string
  title: string
  description: string
  heroImage: string
  features: string[]
  benefits: string[]
}

// --- ViaCEP ---
export interface ViaCepResponse {
  logradouro: string
  bairro: string
  localidade: string
  uf: string
  erro?: boolean
}

// --- Nota Fiscal ---
export interface NotaFiscal {
  id: string
  numero: string
  descricao: string
  dataEmissao: string
  valor: number
  status: 'autorizada' | 'pendente' | 'cancelada'
  arquivos: {
    pdf: string
    xml: string
  }
}

// --- Agendamentos ---
export interface ServicoCatalogo {
  id: string
  nome: string
  descricao: string | null
  ativo: boolean
  created_at: string
}

export interface ClienteAvulso {
  id: string
  nome: string
  telefone: string
  bairro: string
  email: string | null
  user_id: string | null
  created_at: string
}

export interface Agendamento {
  id: string
  titulo: string
  descricao: string | null
  servico_id: string | null
  cliente_avulso_id: string | null
  user_id: string | null
  data_servico: string
  horario: string
  status: 'agendado' | 'em_andamento' | 'concluido' | 'cancelado'
  created_at: string
  updated_at: string
  // joins
  servicos_catalogo?: ServicoCatalogo
  clientes_avulsos?: ClienteAvulso
  users?: { full_name: string | null; email: string; phone: string | null }
}
