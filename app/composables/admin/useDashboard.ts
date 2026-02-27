/**
 * Composable para gestão do Dashboard Admin
 * Gerencia KPIs, métricas e dados do dashboard
 * 
 * @see docs/PADROES-ADMIN.md
 */

import type { DashboardStats, RecentLead } from '~/types'

export const useDashboard = () => {
  // Estado reativo
  const stats = ref<DashboardStats>({
    leadsDoMes: 0,
    taxaConversao: 0,
    servicosAgendados: 0,
    servicosHoje: 0,
    receitaMes: 0
  })
  
  const recentLeads = ref<RecentLead[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Funções
  const fetchStats = async () => {
    loading.value = true
    error.value = null
    
    try {
      const { data, error: fetchError } = await useFetch('/api/admin/dashboard/stats')
      
      if (fetchError.value) {
        throw new Error(fetchError.value.message)
      }
      
      if (data.value) {
        stats.value = data.value as DashboardStats
      }
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Erro ao buscar estatísticas'
      console.error('[useDashboard] Erro ao buscar estatísticas:', e)
    } finally {
      loading.value = false
    }
  }

  const fetchRecentLeads = async (limit: number = 5) => {
    loading.value = true
    error.value = null
    
    try {
      const { data, error: fetchError } = await useFetch(`/api/admin/dashboard/recent-leads?limit=${limit}`)
      
      if (fetchError.value) {
        throw new Error(fetchError.value.message)
      }
      
      if (data.value) {
        recentLeads.value = data.value as RecentLead[]
      }
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Erro ao buscar leads recentes'
      console.error('[useDashboard] Erro ao buscar leads recentes:', e)
    } finally {
      loading.value = false
    }
  }

  const refreshDashboard = async () => {
    await Promise.all([
      fetchStats(),
      fetchRecentLeads()
    ])
  }

  // Computed properties
  const hasData = computed(() => stats.value.leadsDoMes > 0)

  return {
    // Estado
    stats: readonly(stats),
    recentLeads: readonly(recentLeads),
    loading: readonly(loading),
    error: readonly(error),
    
    // Computed
    hasData,
    
    // Funções
    fetchStats,
    fetchRecentLeads,
    refreshDashboard
  }
}
