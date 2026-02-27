import type {
  AgendaItem,
  AgendaItemFormData,
  AgendaFilters,
  AgendaDay,
  AgendaItemWithServico,
  AgendaCalendarEvent
} from '~/types'

export const useAgenda = () => {
  // Estado reativo
  const agendaItems = ref<AgendaItemWithServico[]>([])
  const agendaDays = ref<AgendaDay[]>([])
  const calendarEvents = ref<AgendaCalendarEvent[]>([])
  const selectedItem = ref<AgendaItemWithServico | null>(null)
  const filters = ref<AgendaFilters>({})
  const loading = ref(false)
  const error = ref<string | null>(null)
  const viewMode = ref<'day' | 'week' | 'month'>('week')

  // Funções de busca
  const fetchAgendaItems = async () => {
    loading.value = true
    error.value = null

    try {
      const result = await $fetch<AgendaItemWithServico[]>('/api/admin/agenda', {
        method: 'GET',
        params: filters.value
      })

      agendaItems.value = result
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Erro ao buscar agenda'
      console.error('[useAgenda] Erro ao buscar agenda:', e)
    } finally {
      loading.value = false
    }
  }

  const fetchAgendaByDays = async () => {
    loading.value = true
    error.value = null

    try {
      const result = await $fetch<AgendaDay[]>('/api/admin/agenda/days', {
        method: 'GET',
        params: filters.value
      })

      agendaDays.value = result
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Erro ao buscar agenda por dias'
      console.error('[useAgenda] Erro ao buscar agenda por dias:', e)
    } finally {
      loading.value = false
    }
  }

  const fetchCalendarEvents = async () => {
    loading.value = true
    error.value = null

    try {
      const result = await $fetch<AgendaCalendarEvent[]>('/api/admin/agenda/calendar', {
        method: 'GET',
        params: filters.value
      })

      calendarEvents.value = result
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Erro ao buscar eventos do calendário'
      console.error('[useAgenda] Erro ao buscar eventos:', e)
    } finally {
      loading.value = false
    }
  }

  const fetchAgendaItemById = async (id: string) => {
    loading.value = true
    error.value = null

    try {
      const result = await $fetch<AgendaItemWithServico>(`/api/admin/agenda/${id}`, {
        method: 'GET'
      })

      selectedItem.value = result
      return result
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Erro ao buscar item da agenda'
      console.error('[useAgenda] Erro ao buscar item:', e)
      throw e
    } finally {
      loading.value = false
    }
  }

  // Funções CRUD
  const createAgendaItem = async (data: AgendaItemFormData) => {
    loading.value = true
    error.value = null

    try {
      const newItem = await $fetch<AgendaItem>('/api/admin/agenda/novo', {
        method: 'POST',
        body: data
      })

      // Recarregar agenda após criar
      await fetchAgendaItems()
      return newItem
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Erro ao criar item na agenda'
      console.error('[useAgenda] Erro ao criar item:', e)
      throw e
    } finally {
      loading.value = false
    }
  }

  const updateAgendaItem = async (id: string, data: Partial<AgendaItemFormData>) => {
    loading.value = true
    error.value = null

    try {
      const updated = await $fetch<AgendaItem>(`/api/admin/agenda/${id}`, {
        method: 'PATCH',
        body: data
      })

      // Atualizar na lista
      const index = agendaItems.value.findIndex(item => item.id === id)
      if (index !== -1) {
        agendaItems.value[index] = { ...agendaItems.value[index], ...updated }
      }

      if (selectedItem.value?.id === id) {
        selectedItem.value = { ...selectedItem.value, ...updated }
      }

      return updated
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Erro ao atualizar item'
      console.error('[useAgenda] Erro ao atualizar item:', e)
      throw e
    } finally {
      loading.value = false
    }
  }

  const deleteAgendaItem = async (id: string) => {
    loading.value = true
    error.value = null

    try {
      await $fetch(`/api/admin/agenda/${id}`, {
        method: 'DELETE'
      })

      agendaItems.value = agendaItems.value.filter(item => item.id !== id)

      if (selectedItem.value?.id === id) {
        selectedItem.value = null
      }
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Erro ao deletar item'
      console.error('[useAgenda] Erro ao deletar item:', e)
      throw e
    } finally {
      loading.value = false
    }
  }

  // Verificar conflitos
  const checkConflicts = async (
    data: string,
    hora_inicio: string,
    hora_fim: string,
    tecnico_id?: string,
    excludeId?: string
  ): Promise<boolean> => {
    try {
      const result = await $fetch<{ hasConflict: boolean }>('/api/admin/agenda/check-conflicts', {
        method: 'POST',
        body: {
          data,
          hora_inicio,
          hora_fim,
          tecnico_id,
          excludeId
        }
      })

      return result.hasConflict
    } catch (e) {
      console.error('[useAgenda] Erro ao verificar conflitos:', e)
      return false
    }
  }

  // Funções auxiliares
  const setFilters = (newFilters: Partial<AgendaFilters>) => {
    filters.value = { ...filters.value, ...newFilters }
  }

  const clearFilters = () => {
    filters.value = {}
  }

  const setViewMode = (mode: 'day' | 'week' | 'month') => {
    viewMode.value = mode
  }

  const setSelectedItem = (item: AgendaItemWithServico | null) => {
    selectedItem.value = item
  }

  // Funções de navegação de data
  const setDateRange = (start: string, end: string) => {
    filters.value = {
      ...filters.value,
      date_from: start,
      date_to: end
    }
  }

  const goToToday = () => {
    const today = new Date().toISOString().split('T')[0]
    setDateRange(today, today)
  }

  const goToWeek = (date?: Date) => {
    const targetDate = date || new Date()
    const startOfWeek = new Date(targetDate)
    startOfWeek.setDate(targetDate.getDate() - targetDate.getDay())

    const endOfWeek = new Date(startOfWeek)
    endOfWeek.setDate(startOfWeek.getDate() + 6)

    setDateRange(
      startOfWeek.toISOString().split('T')[0],
      endOfWeek.toISOString().split('T')[0]
    )
  }

  const goToMonth = (date?: Date) => {
    const targetDate = date || new Date()
    const startOfMonth = new Date(targetDate.getFullYear(), targetDate.getMonth(), 1)
    const endOfMonth = new Date(targetDate.getFullYear(), targetDate.getMonth() + 1, 0)

    setDateRange(
      startOfMonth.toISOString().split('T')[0],
      endOfMonth.toISOString().split('T')[0]
    )
  }

  // Computed properties
  const hasItems = computed(() => agendaItems.value.length > 0)
  const hasFilters = computed(() => Object.keys(filters.value).length > 0)

  // Filtros por status
  const itemsAgendados = computed(() =>
    agendaItems.value.filter(item => item.status === 'agendado')
  )
  const itemsEmAndamento = computed(() =>
    agendaItems.value.filter(item => item.status === 'em_andamento')
  )
  const itemsConcluidos = computed(() =>
    agendaItems.value.filter(item => item.status === 'concluido')
  )

  // Agenda de hoje
  const agendaToday = computed(() => {
    const today = new Date().toISOString().split('T')[0]
    return agendaItems.value.filter(item => item.data === today)
  })

  return {
    // Estado
    agendaItems: readonly(agendaItems),
    agendaDays: readonly(agendaDays),
    calendarEvents: readonly(calendarEvents),
    selectedItem: readonly(selectedItem),
    filters: readonly(filters),
    loading: readonly(loading),
    error: readonly(error),
    viewMode: readonly(viewMode),

    // Computed
    hasItems,
    hasFilters,
    itemsAgendados,
    itemsEmAndamento,
    itemsConcluidos,
    agendaToday,

    // Funções de busca
    fetchAgendaItems,
    fetchAgendaByDays,
    fetchCalendarEvents,
    fetchAgendaItemById,

    // Funções CRUD
    createAgendaItem,
    updateAgendaItem,
    deleteAgendaItem,

    // Funções auxiliares
    checkConflicts,
    setFilters,
    clearFilters,
    setViewMode,
    setSelectedItem,
    setDateRange,
    goToToday,
    goToWeek,
    goToMonth
  }
}
