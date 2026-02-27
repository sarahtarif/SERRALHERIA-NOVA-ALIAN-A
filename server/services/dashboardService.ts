/**
 * Service para Dashboard Admin
 * Queries de KPIs e métricas do dashboard
 * 
 * @see docs/PADROES-ADMIN.md
 */

import type { DashboardStats, RecentLead } from '~/types'

/**
 * Buscar estatísticas do dashboard
 * Retorna KPIs do mês atual
 */
export async function getDashboardStats(): Promise<DashboardStats> {
  const supabase = useSupabase()
  
  try {
    // Data de início do mês atual
    const now = new Date()
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString()
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString()
    const endOfWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString()
    
    // Leads do mês
    const { count: leadsCount, error: leadsError } = await supabase
      .from('leads')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', startOfMonth)
    
    if (leadsError) throw leadsError
    
    // Serviços agendados esta semana
    const { count: servicosCount, error: servicosError } = await supabase
      .from('requests')
      .select('*', { count: 'exact', head: true })
      .gte('scheduled_at', startOfToday)
      .lte('scheduled_at', endOfWeek)
      .in('status', ['agendado', 'em_execucao'])
    
    if (servicosError) throw servicosError
    
    // Serviços hoje
    const { count: servicosHojeCount, error: servicosHojeError } = await supabase
      .from('requests')
      .select('*', { count: 'exact', head: true })
      .gte('scheduled_at', startOfToday)
      .lt('scheduled_at', new Date(now.getTime() + 24 * 60 * 60 * 1000).toISOString())
      .in('status', ['agendado', 'em_execucao'])
    
    if (servicosHojeError) throw servicosHojeError
    
    // Taxa de conversão (mockado por enquanto - implementar quando houver orçamentos)
    const taxaConversao = leadsCount ? Math.round((servicosCount || 0) / leadsCount * 100) : 0
    
    // Receita do mês (mockado por enquanto - implementar quando houver financeiro)
    const receitaMes = 28500
    
    return {
      leadsDoMes: leadsCount || 0,
      taxaConversao,
      servicosAgendados: servicosCount || 0,
      servicosHoje: servicosHojeCount || 0,
      receitaMes
    }
  } catch (error) {
    console.error('[dashboardService] Erro ao buscar estatísticas:', error)
    throw new Error(`Erro ao buscar estatísticas: ${error instanceof Error ? error.message : 'Erro desconhecido'}`)
  }
}

/**
 * Buscar leads recentes
 * Retorna os últimos leads criados
 */
export async function getRecentLeads(limit: number = 5): Promise<RecentLead[]> {
  const supabase = useSupabase()
  
  try {
    const { data, error } = await supabase
      .from('leads')
      .select('id, name, service_type, neighborhood, created_at')
      .order('created_at', { ascending: false })
      .limit(limit)
    
    if (error) throw error
    
    // Transformar dados para formato do dashboard
    return (data || []).map(lead => ({
      id: lead.id,
      name: lead.name,
      service: lead.service_type,
      neighborhood: lead.neighborhood || 'Não informado',
      time: formatTimeAgo(lead.created_at),
      status: 'Novo' // Status padrão - implementar lógica de status quando houver
    }))
  } catch (error) {
    console.error('[dashboardService] Erro ao buscar leads recentes:', error)
    throw new Error(`Erro ao buscar leads recentes: ${error instanceof Error ? error.message : 'Erro desconhecido'}`)
  }
}

/**
 * Formatar tempo relativo (ex: "Há 15 minutos")
 */
function formatTimeAgo(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)
  
  if (diffMins < 1) return 'Agora'
  if (diffMins < 60) return `Há ${diffMins} minuto${diffMins > 1 ? 's' : ''}`
  if (diffHours < 24) return `Há ${diffHours} hora${diffHours > 1 ? 's' : ''}`
  return `Há ${diffDays} dia${diffDays > 1 ? 's' : ''}`
}
