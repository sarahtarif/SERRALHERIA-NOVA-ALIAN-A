import type {
  Servico,
  ServicoFormData,
  ServicoFilters,
  ServicosPagination,
  PaginatedServicos,
  ServicoWithRelations
} from '~/types'

export const useServicos = () => {
  // Estado reativo
  const servicos = ref<Servico[]>([])
  const selectedServico = ref<ServicoWithRelations | null>(null)
  const filters = ref<ServicoFilters>({})
  const pagination = ref<ServicosPagination>({
    page: 1,
    per_page: 20,
    total: 0,
    total_pages: 0
  })
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Funções CRUD
  const fetchServicos = async () => {
    loading.value = true
    error.value = null

    try {
      const result = await $fetch<PaginatedServicos>('/api/admin/servicos', {
        method: 'GET',
        params: {
          ...filters.value,
          page: pagination.value.page,
          per_page: pagination.value.per_page
        }
      })

      servicos.value = result.data
      pagination.value = result.pagination
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Erro ao buscar serviços'
      console.error('[useServicos] Erro ao buscar serviços:', e)
    } finally {
      loading.value = false
    }
  }

  const fetchServicoById = async (id: string) => {
    loading.value = true
    error.value = null

    try {
      const result = await $fetch<ServicoWithRelations>(`/api/admin/servicos/${id}`, {
        method: 'GET'
      })

      selectedServico.value = result
      return result
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Erro ao buscar serviço'
      console.error('[useServicos] Erro ao buscar serviço:', e)
      throw e
    } finally {
      loading.value = false
    }
  }

  const createServico = async (data: ServicoFormData) => {
    loading.value = true
    error.value = null

    try {
      const newServico = await $fetch<Servico>('/api/admin/servicos/novo', {
        method: 'POST',
        body: data
      })

      servicos.value.unshift(newServico)
      return newServico
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Erro ao criar serviço'
      console.error('[useServicos] Erro ao criar serviço:', e)
      throw e
    } finally {
      loading.value = false
    }
  }

  const updateServico = async (id: string, data: Partial<ServicoFormData>) => {
    loading.value = true
    error.value = null

    try {
      const updated = await $fetch<Servico>(`/api/admin/servicos/${id}`, {
        method: 'PATCH',
        body: data
      })

      const index = servicos.value.findIndex(s => s.id === id)
      if (index !== -1) {
        servicos.value[index] = updated
      }

      if (selectedServico.value?.id === id) {
        selectedServico.value = { ...selectedServico.value, ...updated }
      }

      return updated
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Erro ao atualizar serviço'
      console.error('[useServicos] Erro ao atualizar serviço:', e)
      throw e
    } finally {
      loading.value = false
    }
  }

  const deleteServico = async (id: string) => {
    loading.value = true
    error.value = null

    try {
      await $fetch(`/api/admin/servicos/${id}`, {
        method: 'DELETE'
      })

      servicos.value = servicos.value.filter(s => s.id !== id)

      if (selectedServico.value?.id === id) {
        selectedServico.value = null
      }
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Erro ao deletar serviço'
      console.error('[useServicos] Erro ao deletar serviço:', e)
      throw e
    } finally {
      loading.value = false
    }
  }

  const updateServicoStatus = async (
    id: string,
    status: 'agendado' | 'em_execucao' | 'concluido' | 'cancelado'
  ) => {
    loading.value = true
    error.value = null

    try {
      const updated = await $fetch<Servico>(`/api/admin/servicos/${id}/status`, {
        method: 'PATCH',
        body: { status }
      })

      const index = servicos.value.findIndex(s => s.id === id)
      if (index !== -1) {
        servicos.value[index] = updated
      }

      if (selectedServico.value?.id === id) {
        selectedServico.value = { ...selectedServico.value, ...updated }
      }

      return updated
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Erro ao atualizar status'
      console.error('[useServicos] Erro ao atualizar status:', e)
      throw e
    } finally {
      loading.value = false
    }
  }

  // Funções auxiliares
  const setFilters = (newFilters: Partial<ServicoFilters>) => {
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

  const setSelectedServico = (servico: ServicoWithRelations | null) => {
    selectedServico.value = servico
  }

  // Computed properties
  const hasServicos = computed(() => servicos.value.length > 0)
  const hasFilters = computed(() => Object.keys(filters.value).length > 0)
  const totalPages = computed(() => pagination.value.total_pages)
  const currentPage = computed(() => pagination.value.page)

  // Filtros por status
  const servicosAgendados = computed(() =>
    servicos.value.filter(s => s.status === 'agendado')
  )
  const servicosEmExecucao = computed(() =>
    servicos.value.filter(s => s.status === 'em_execucao')
  )
  const servicosConcluidos = computed(() =>
    servicos.value.filter(s => s.status === 'concluido')
  )

  return {
    // Estado
    servicos: readonly(servicos),
    selectedServico: readonly(selectedServico),
    filters: readonly(filters),
    pagination: readonly(pagination),
    loading: readonly(loading),
    error: readonly(error),

    // Computed
    hasServicos,
    hasFilters,
    totalPages,
    currentPage,
    servicosAgendados,
    servicosEmExecucao,
    servicosConcluidos,

    // Funções
    fetchServicos,
    fetchServicoById,
    createServico,
    updateServico,
    deleteServico,
    updateServicoStatus,
    setFilters,
    clearFilters,
    setPage,
    setSelectedServico
  }
}
