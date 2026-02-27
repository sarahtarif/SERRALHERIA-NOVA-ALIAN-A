/**
 * Service para Leads Admin
 * CRUD completo, filtros, busca e histórico de leads
 * 
 * @see docs/PADROES-ADMIN.md
 */

import type { Lead, LeadFilters, LeadsPagination, PaginatedLeads, LeadFormData } from '~/types'

/**
 * Buscar leads com filtros e paginação
 */
export async function getLeads(
  filters: LeadFilters = {},
  pagination: LeadsPagination = { page: 1, per_page: 20, total: 0, total_pages: 0 }
): Promise<PaginatedLeads> {
  const supabase = useSupabase()
  
  try {
    // Construir query base
    let query = supabase
      .from('leads')
      .select('*', { count: 'exact' })
    
    // Aplicar filtros
    if (filters.search) {
      query = query.or(`name.ilike.%${filters.search}%,whatsapp.ilike.%${filters.search}%,message.ilike.%${filters.search}%`)
    }
    
    if (filters.service_type) {
      query = query.eq('service_type', filters.service_type)
    }
    
    if (filters.source) {
      query = query.eq('source', filters.source)
    }
    
    if (filters.status) {
      query = query.eq('status', filters.status)
    }
    
    if (filters.neighborhood) {
      query = query.ilike('neighborhood', `%${filters.neighborhood}%`)
    }
    
    if (filters.date_from) {
      query = query.gte('created_at', filters.date_from)
    }
    
    if (filters.date_to) {
      query = query.lte('created_at', filters.date_to)
    }
    
    if (filters.converted !== undefined) {
      query = query.eq('converted_to_client', filters.converted)
    }
    
    // Aplicar paginação
    const from = (pagination.page - 1) * pagination.per_page
    const to = from + pagination.per_page - 1
    
    query = query
      .order('created_at', { ascending: false })
      .range(from, to)
    
    // Executar query
    const { data, error, count } = await query
    
    if (error) {
      console.error('[leadsService] Erro ao buscar leads:', error)
      throw new Error(`Erro ao buscar leads: ${error.message}`)
    }
    
    return {
      data: data || [],
      pagination: {
        page: pagination.page,
        per_page: pagination.per_page,
        total: count || 0,
        total_pages: Math.ceil((count || 0) / pagination.per_page)
      }
    }
  } catch (error) {
    console.error('[leadsService] Exceção ao buscar leads:', error)
    throw error
  }
}

/**
 * Buscar lead por ID
 */
export async function getLeadById(id: string): Promise<Lead> {
  const supabase = useSupabase()
  
  try {
    const { data, error } = await supabase
      .from('leads')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) {
      console.error('[leadsService] Erro ao buscar lead:', error)
      throw new Error(`Erro ao buscar lead: ${error.message}`)
    }
    
    if (!data) {
      throw new Error('Lead não encontrado')
    }
    
    return data
  } catch (error) {
    console.error('[leadsService] Exceção ao buscar lead:', error)
    throw error
  }
}

/**
 * Criar novo lead
 */
export async function createLead(data: LeadFormData): Promise<Lead> {
  const supabase = useSupabase()
  
  try {
    const leadData = {
      name: data.name,
      whatsapp: data.whatsapp,
      service_type: data.service_type,
      neighborhood: data.neighborhood || null,
      message: data.message || null,
      source: data.source || 'manual',
      status: data.status || 'novo',
      converted_to_client: false
    }
    
    const { data: newLead, error } = await supabase
      .from('leads')
      .insert(leadData)
      .select()
      .single()
    
    if (error) {
      console.error('[leadsService] Erro ao criar lead:', error)
      throw new Error(`Erro ao criar lead: ${error.message}`)
    }
    
    return newLead
  } catch (error) {
    console.error('[leadsService] Exceção ao criar lead:', error)
    throw error
  }
}

/**
 * Atualizar lead existente
 */
export async function updateLead(id: string, data: Partial<Lead>): Promise<Lead> {
  const supabase = useSupabase()
  
  try {
    const { data: updated, error } = await supabase
      .from('leads')
      .update({
        ...data,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single()
    
    if (error) {
      console.error('[leadsService] Erro ao atualizar lead:', error)
      throw new Error(`Erro ao atualizar lead: ${error.message}`)
    }
    
    return updated
  } catch (error) {
    console.error('[leadsService] Exceção ao atualizar lead:', error)
    throw error
  }
}

/**
 * Deletar lead
 */
export async function deleteLead(id: string): Promise<void> {
  const supabase = useSupabase()
  
  try {
    const { error } = await supabase
      .from('leads')
      .delete()
      .eq('id', id)
    
    if (error) {
      console.error('[leadsService] Erro ao deletar lead:', error)
      throw new Error(`Erro ao deletar lead: ${error.message}`)
    }
  } catch (error) {
    console.error('[leadsService] Exceção ao deletar lead:', error)
    throw error
  }
}

/**
 * Buscar histórico de leads (últimos 30 dias)
 */
export async function getLeadsHistory(days: number = 30): Promise<Lead[]> {
  const supabase = useSupabase()
  
  try {
    const dateFrom = new Date()
    dateFrom.setDate(dateFrom.getDate() - days)
    
    const { data, error } = await supabase
      .from('leads')
      .select('*')
      .gte('created_at', dateFrom.toISOString())
      .order('created_at', { ascending: false })
    
    if (error) {
      console.error('[leadsService] Erro ao buscar histórico:', error)
      throw new Error(`Erro ao buscar histórico: ${error.message}`)
    }
    
    return data || []
  } catch (error) {
    console.error('[leadsService] Exceção ao buscar histórico:', error)
    throw error
  }
}

/**
 * Converter lead em cliente
 */
export async function convertLeadToClient(leadId: string, clientId: string): Promise<Lead> {
  const supabase = useSupabase()
  
  try {
    const { data: updated, error } = await supabase
      .from('leads')
      .update({
        converted_to_client: true,
        client_id: clientId,
        status: 'fechado',
        updated_at: new Date().toISOString()
      })
      .eq('id', leadId)
      .select()
      .single()
    
    if (error) {
      console.error('[leadsService] Erro ao converter lead:', error)
      throw new Error(`Erro ao converter lead: ${error.message}`)
    }
    
    return updated
  } catch (error) {
    console.error('[leadsService] Exceção ao converter lead:', error)
    throw error
  }
}

/**
 * Buscar estatísticas de leads
 */
export async function getLeadsStats(): Promise<{
  total: number
  novos: number
  em_contato: number
  proposta: number
  fechados: number
  perdidos: number
  taxa_conversao: number
}> {
  const supabase = useSupabase()
  
  try {
    // Total de leads
    const { count: total } = await supabase
      .from('leads')
      .select('*', { count: 'exact', head: true })
    
    // Leads por status
    const { count: novos } = await supabase
      .from('leads')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'novo')
    
    const { count: em_contato } = await supabase
      .from('leads')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'em_contato')
    
    const { count: proposta } = await supabase
      .from('leads')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'proposta')
    
    const { count: fechados } = await supabase
      .from('leads')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'fechado')
    
    const { count: perdidos } = await supabase
      .from('leads')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'perdido')
    
    // Taxa de conversão
    const taxa_conversao = total && total > 0 
      ? Math.round(((fechados || 0) / total) * 100) 
      : 0
    
    return {
      total: total || 0,
      novos: novos || 0,
      em_contato: em_contato || 0,
      proposta: proposta || 0,
      fechados: fechados || 0,
      perdidos: perdidos || 0,
      taxa_conversao
    }
  } catch (error) {
    console.error('[leadsService] Erro ao buscar estatísticas:', error)
    throw new Error(`Erro ao buscar estatísticas: ${error instanceof Error ? error.message : 'Erro desconhecido'}`)
  }
}

/**
 * Buscar tipos de serviço únicos
 */
export async function getServiceTypes(): Promise<string[]> {
  const supabase = useSupabase()
  
  try {
    const { data, error } = await supabase
      .from('leads')
      .select('service_type')
    
    if (error) {
      console.error('[leadsService] Erro ao buscar tipos de serviço:', error)
      throw new Error(`Erro ao buscar tipos de serviço: ${error.message}`)
    }
    
    // Extrair valores únicos
    const uniqueTypes = [...new Set(data?.map(item => item.service_type) || [])]
    return uniqueTypes.filter(Boolean).sort()
  } catch (error) {
    console.error('[leadsService] Exceção ao buscar tipos de serviço:', error)
    throw error
  }
}
