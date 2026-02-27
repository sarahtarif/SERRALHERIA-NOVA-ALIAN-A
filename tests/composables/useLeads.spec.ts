import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useLeads } from '../../app/composables/admin/useLeads'

vi.mock('../../server/services/leadsService', () => ({
  getLeads: vi.fn(),
  getLeadById: vi.fn(),
  createLead: vi.fn(),
  updateLead: vi.fn(),
  deleteLead: vi.fn(),
  convertLeadToClient: vi.fn()
}))

import { getLeads, getLeadById, createLead as createLeadService } from '../../server/services/leadsService'

describe('useLeads', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('deve inicializar com valores padrão', () => {
    const { leads, loading, error, pagination } = useLeads()

    expect(leads.value).toEqual([])
    expect(loading.value).toBe(false)
    expect(error.value).toBeNull()
    expect(pagination.value.page).toBe(1)
  })

  it('deve buscar leads com sucesso', async () => {
    const mockResult = {
      data: [{ id: '1', name: 'João' }],
      pagination: { page: 1, per_page: 20, total: 1, total_pages: 1 }
    }
    vi.mocked(getLeads).mockResolvedValueOnce(mockResult)

    const { leads, fetchLeads } = useLeads()
    await fetchLeads()

    expect(leads.value).toEqual(mockResult.data)
  })

  it('deve aplicar filtros e resetar página', () => {
    const { setFilters, filters, pagination } = useLeads()
    
    pagination.value.page = 3
    setFilters({ search: 'João' })

    expect(filters.value.search).toBe('João')
    expect(pagination.value.page).toBe(1)
  })

  it('deve criar lead e adicionar à lista', async () => {
    const newLead = { id: '1', name: 'João', whatsapp: '11999999999', service_type: 'Rede', created_at: '' }
    vi.mocked(createLeadService).mockResolvedValueOnce(newLead)

    const { leads, createLead } = useLeads()
    await createLead({ name: 'João', whatsapp: '11999999999', service_type: 'Rede' })

    expect(leads.value[0]).toEqual(newLead)
  })
})
