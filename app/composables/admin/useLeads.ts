/**
 * Composable para gestão de Leads Admin
 * Gerencia CRUD, filtros, paginação e estados de leads
 * 
 * @see docs/PADROES-ADMIN.md
 */

import type { Lead, LeadFilters, LeadsPagination, LeadFormData } from '~/types'

export const useLeads = () => {
  // Estado reativo
  const leads = ref<Lead[]>([])
  const selectedLead = ref<Lead | null>(null)
  const filters = ref<LeadFilters>({})
  const pagination = ref<LeadsPagination>({
    page: 1,
    per_page: 20,
    total: 0,
    total_pages: 0
  })
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Funções CRUD
  const fetchLeads = async () => {
    loading.value = true
    error.value = null
    
    try {
      const result = await $fetch('/api/admin/leads', {
        method: 'GET',
        query: {
          ...filters.value,
          page: pagination.value.page,
          per_page: pagination.value.per_page
        }
      })
      leads.value = result.data
      pagination.value = result.pagination
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Erro ao buscar leads'
      console.error('[useLeads] Erro ao buscar leads:', e)
    } finally {
      loading.value = false
    }
  }

  const fetchLeadById = async (id: string) => {
    loading.value = true
    error.value = null
    
    try {
      const lead = await $fetch(`/api/admin/leads/${id}`, {
        method: 'GET'
      })
      selectedLead.value = lead
      return lead
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Erro ao buscar lead'
      console.error('[useLeads] Erro ao buscar lead:', e)
      throw e
    } finally {
      loading.value = false
    }
  }

  const createLead = async (data: LeadFormData) => {
    loading.value = true
    error.value = null
    
    try {
      const newLead = await $fetch('/api/admin/leads/novo', {
        method: 'POST',
        body: data
      })
      leads.value.unshift(newLead)
      pagination.value.total += 1
      return newLead
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Erro ao criar lead'
      console.error('[useLeads] Erro ao criar lead:', e)
      throw e
    } finally {
      loading.value = false
    }
  }

  const updateLead = async (id: string, data: Partial<Lead>) => {
    loading.value = true
    error.value = null
    
    try {
      const updated = await $fetch(`/api/admin/leads/${id}`, {
        method: 'PATCH',
        body: data
      })
      const index = leads.value.findIndex(l => l.id === id)
      if (index !== -1) {
        leads.value[index] = updated
      }
      if (selectedLead.value?.id === id) {
        selectedLead.value = updated
      }
      return updated
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Erro ao atualizar lead'
      console.error('[useLeads] Erro ao atualizar lead:', e)
      throw e
    } finally {
      loading.value = false
    }
  }

  const deleteLead = async (id: string) => {
    loading.value = true
    error.value = null
    
    try {
      await $fetch(`/api/admin/leads/${id}`, {
        method: 'DELETE'
      })
      leads.value = leads.value.filter(l => l.id !== id)
      pagination.value.total -= 1
      if (selectedLead.value?.id === id) {
        selectedLead.value = null
      }
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Erro ao deletar lead'
      console.error('[useLeads] Erro ao deletar lead:', e)
      throw e
    } finally {
      loading.value = false
    }
  }

  const convertToClient = async (leadId: string, clientId: string) => {
    loading.value = true
    error.value = null
    
    try {
      const converted = await $fetch(`/api/admin/leads/${leadId}`, {
        method: 'PATCH',
        body: {
          converted_to_client: true,
          client_id: clientId,
          status: 'fechado'
        }
      })
      const index = leads.value.findIndex(l => l.id === leadId)
      if (index !== -1) {
        leads.value[index] = converted
      }
      if (selectedLead.value?.id === leadId) {
        selectedLead.value = converted
      }
      return converted
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Erro ao converter lead'
      console.error('[useLeads] Erro ao converter lead:', e)
      throw e
    } finally {
      loading.value = false
    }
  }

  // Funções auxiliares
  const setFilters = (newFilters: Partial<LeadFilters>) => {
    filters.value = { ...filters.value, ...newFilters }
    pagination.value.page = 1 // Reset para primeira página
  }

  const clearFilters = () => {
    filters.value = {}
    pagination.value.page = 1
  }

  const setPage = (page: number) => {
    pagination.value.page = page
  }

  const setPerPage = (perPage: number) => {
    pagination.value.per_page = perPage
    pagination.value.page = 1 // Reset para primeira página
  }

  const refreshLeads = async () => {
    await fetchLeads()
  }

  // Computed properties
  const hasLeads = computed(() => leads.value.length > 0)
  const hasFilters = computed(() => Object.keys(filters.value).length > 0)
  const hasNextPage = computed(() => pagination.value.page < pagination.value.total_pages)
  const hasPrevPage = computed(() => pagination.value.page > 1)
  const totalPages = computed(() => pagination.value.total_pages)
  const currentPage = computed(() => pagination.value.page)

  return {
    // Estado
    leads: readonly(leads),
    selectedLead: readonly(selectedLead),
    filters: readonly(filters),
    pagination: readonly(pagination),
    loading: readonly(loading),
    error: readonly(error),
    
    // Computed
    hasLeads,
    hasFilters,
    hasNextPage,
    hasPrevPage,
    totalPages,
    currentPage,
    
    // Funções
    fetchLeads,
    fetchLeadById,
    createLead,
    updateLead,
    deleteLead,
    convertToClient,
    setFilters,
    clearFilters,
    setPage,
    setPerPage,
    refreshLeads
  }
}
