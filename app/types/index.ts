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
  neighborhood: string
  message: string
  source: string
  created_at: string
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
