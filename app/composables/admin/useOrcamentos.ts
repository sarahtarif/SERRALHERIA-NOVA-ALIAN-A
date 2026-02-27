/**
 * Composable para gestão de Orçamentos Admin
 * 
 * @see docs/PADROES-ADMIN.md
 */

import type { Orcamento, OrcamentoWithItems, OrcamentoFormData, OrcamentoFilters, OrcamentosPagination } from '~/types'

export const useOrcamentos = () => {
  const orcamentos = ref<Orcamento[]>([])
  const selectedOrcamento = ref<OrcamentoWithItems | null>(null)
  const filters = ref<OrcamentoFilters>({})
  const pagination = ref<OrcamentosPagination>({
    page: 1,
    per_page: 20,
    total: 0,
    total_pages: 0
  })
  const loading = ref(false)
  const error = ref<string | null>(null)

  const fetchOrcamentos = async () => {
    loading.value = true
    error.value = null
    
    try {
      const result = await $fetch('/api/admin/orcamentos', {
        method: 'GET',
        query: {
          ...filters.value,
          page: pagination.value.page,
          per_page: pagination.value.per_page
        }
      })
      orcamentos.value = result.data
      pagination.value = result.pagination
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Erro ao buscar orçamentos'
      console.error('[useOrcamentos] Erro:', e)
    } finally {
      loading.value = false
    }
  }

  const fetchOrcamentoById = async (id: string) => {
    loading.value = true
    error.value = null
    
    try {
      const orcamento = await $fetch(`/api/admin/orcamentos/${id}`, {
        method: 'GET'
      })
      selectedOrcamento.value = orcamento
      return orcamento
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Erro ao buscar orçamento'
      console.error('[useOrcamentos] Erro:', e)
      throw e
    } finally {
      loading.value = false
    }
  }

  const createOrcamento = async (data: OrcamentoFormData, userId: string) => {
    loading.value = true
    error.value = null
    
    try {
      const novo = await $fetch('/api/admin/orcamentos/novo', {
        method: 'POST',
        body: {
          ...data,
          userId
        }
      })
      orcamentos.value.unshift(novo)
      return novo
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Erro ao criar orçamento'
      console.error('[useOrcamentos] Erro:', e)
      throw e
    } finally {
      loading.value = false
    }
  }

  const updateOrcamento = async (id: string, data: Partial<Orcamento>) => {
    loading.value = true
    error.value = null
    
    try {
      const updated = await $fetch(`/api/admin/orcamentos/${id}`, {
        method: 'PATCH',
        body: data
      })
      const index = orcamentos.value.findIndex(o => o.id === id)
      if (index !== -1) {
        orcamentos.value[index] = updated
      }
      return updated
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Erro ao atualizar orçamento'
      console.error('[useOrcamentos] Erro:', e)
      throw e
    } finally {
      loading.value = false
    }
  }

  const deleteOrcamento = async (id: string) => {
    loading.value = true
    error.value = null
    
    try {
      await $fetch(`/api/admin/orcamentos/${id}`, {
        method: 'DELETE'
      })
      orcamentos.value = orcamentos.value.filter(o => o.id !== id)
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Erro ao deletar orçamento'
      console.error('[useOrcamentos] Erro:', e)
      throw e
    } finally {
      loading.value = false
    }
  }

  const setFilters = (newFilters: Partial<OrcamentoFilters>) => {
    filters.value = { ...filters.value, ...newFilters }
    pagination.value.page = 1
  }

  const clearFilters = () => {
    filters.value = {}
    pagination.value.page = 1
  }

  const setPage = (page: number) => {
    pagination.value.page = page
  }

  const hasOrcamentos = computed(() => orcamentos.value.length > 0)
  const hasFilters = computed(() => Object.keys(filters.value).length > 0)

  return {
    orcamentos: readonly(orcamentos),
    selectedOrcamento: readonly(selectedOrcamento),
    filters: readonly(filters),
    pagination: readonly(pagination),
    loading: readonly(loading),
    error: readonly(error),
    hasOrcamentos,
    hasFilters,
    fetchOrcamentos,
    fetchOrcamentoById,
    createOrcamento,
    updateOrcamento,
    deleteOrcamento,
    setFilters,
    clearFilters,
    setPage
  }
}
