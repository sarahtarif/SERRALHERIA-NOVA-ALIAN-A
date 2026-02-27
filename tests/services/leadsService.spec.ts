import { describe, it, expect, vi, beforeEach } from 'vitest'
import {
  getLeads,
  getLeadById,
  createLead,
  updateLead,
  deleteLead,
  getLeadsHistory,
  convertLeadToClient,
  getLeadsStats,
  getServiceTypes
} from '../../server/services/leadsService'

/**
 * Testes unitários do leadsService
 * Valida CRUD, filtros, busca e histórico
 */

describe('leadsService', () => {
  let mockSupabase: any

  beforeEach(() => {
    mockSupabase = {
      from: vi.fn().mockReturnThis(),
      select: vi.fn().mockReturnThis(),
      insert: vi.fn().mockReturnThis(),
      update: vi.fn().mockReturnThis(),
      delete: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      or: vi.fn().mockReturnThis(),
      ilike: vi.fn().mockReturnThis(),
      gte: vi.fn().mockReturnThis(),
      lte: vi.fn().mockReturnThis(),
      order: vi.fn().mockReturnThis(),
      range: vi.fn().mockReturnThis(),
      single: vi.fn().mockReturnThis()
    }

    global.useSupabase = vi.fn(() => mockSupabase)
    vi.clearAllMocks()
  })

  describe('getLeads', () => {
    it('deve buscar leads com sucesso', async () => {
      const mockLeads = [
        { id: '1', name: 'João', whatsapp: '11999999999', service_type: 'Rede', created_at: new Date().toISOString() }
      ]
      
      mockSupabase.range.mockResolvedValueOnce({
        data: mockLeads,
        count: 1,
        error: null
      })

      const result = await getLeads()

      expect(result.data).toEqual(mockLeads)
      expect(result.pagination.total).toBe(1)
    })

    it('deve aplicar filtro de busca', async () => {
      mockSupabase.range.mockResolvedValueOnce({ data: [], count: 0, error: null })

      await getLeads({ search: 'João' })

      expect(mockSupabase.or).toHaveBeenCalled()
    })

    it('deve aplicar filtro de service_type', async () => {
      mockSupabase.range.mockResolvedValueOnce({ data: [], count: 0, error: null })

      await getLeads({ service_type: 'Rede' })

      expect(mockSupabase.eq).toHaveBeenCalledWith('service_type', 'Rede')
    })

    it('deve aplicar filtro de status', async () => {
      mockSupabase.range.mockResolvedValueOnce({ data: [], count: 0, error: null })

      await getLeads({ status: 'novo' })

      expect(mockSupabase.eq).toHaveBeenCalledWith('status', 'novo')
    })

    it('deve aplicar filtro de data', async () => {
      mockSupabase.range.mockResolvedValueOnce({ data: [], count: 0, error: null })

      await getLeads({ date_from: '2026-01-01', date_to: '2026-12-31' })

      expect(mockSupabase.gte).toHaveBeenCalled()
      expect(mockSupabase.lte).toHaveBeenCalled()
    })

    it('deve aplicar paginação corretamente', async () => {
      mockSupabase.range.mockResolvedValueOnce({ data: [], count: 50, error: null })

      const result = await getLeads({}, { page: 2, per_page: 10, total: 0, total_pages: 0 })

      expect(mockSupabase.range).toHaveBeenCalledWith(10, 19)
      expect(result.pagination.total_pages).toBe(5)
    })

    it('deve lançar erro quando query falha', async () => {
      mockSupabase.range.mockResolvedValueOnce({
        data: null,
        error: { message: 'Database error' }
      })

      await expect(getLeads()).rejects.toThrow('Erro ao buscar leads')
    })
  })

  describe('getLeadById', () => {
    it('deve buscar lead por ID com sucesso', async () => {
      const mockLead = { id: '1', name: 'João', whatsapp: '11999999999' }
      
      mockSupabase.single.mockResolvedValueOnce({
        data: mockLead,
        error: null
      })

      const result = await getLeadById('1')

      expect(result).toEqual(mockLead)
      expect(mockSupabase.eq).toHaveBeenCalledWith('id', '1')
    })

    it('deve lançar erro quando lead não encontrado', async () => {
      mockSupabase.single.mockResolvedValueOnce({
        data: null,
        error: null
      })

      await expect(getLeadById('999')).rejects.toThrow('Lead não encontrado')
    })
  })

  describe('createLead', () => {
    it('deve criar lead com sucesso', async () => {
      const newLeadData = {
        name: 'João',
        whatsapp: '11999999999',
        service_type: 'Rede'
      }
      
      const mockCreated = { id: '1', ...newLeadData, created_at: new Date().toISOString() }
      
      mockSupabase.single.mockResolvedValueOnce({
        data: mockCreated,
        error: null
      })

      const result = await createLead(newLeadData)

      expect(result).toEqual(mockCreated)
      expect(mockSupabase.insert).toHaveBeenCalled()
    })

    it('deve usar valores padrão quando não fornecidos', async () => {
      const newLeadData = {
        name: 'João',
        whatsapp: '11999999999',
        service_type: 'Rede'
      }
      
      mockSupabase.single.mockResolvedValueOnce({
        data: { id: '1', ...newLeadData },
        error: null
      })

      await createLead(newLeadData)

      expect(mockSupabase.insert).toHaveBeenCalledWith(
        expect.objectContaining({
          source: 'manual',
          status: 'novo',
          converted_to_client: false
        })
      )
    })
  })

  describe('updateLead', () => {
    it('deve atualizar lead com sucesso', async () => {
      const updates = { status: 'em_contato' as const }
      const mockUpdated = { id: '1', name: 'João', ...updates }
      
      mockSupabase.single.mockResolvedValueOnce({
        data: mockUpdated,
        error: null
      })

      const result = await updateLead('1', updates)

      expect(result).toEqual(mockUpdated)
      expect(mockSupabase.update).toHaveBeenCalled()
      expect(mockSupabase.eq).toHaveBeenCalledWith('id', '1')
    })
  })

  describe('deleteLead', () => {
    it('deve deletar lead com sucesso', async () => {
      mockSupabase.eq.mockResolvedValueOnce({ error: null })

      await deleteLead('1')

      expect(mockSupabase.delete).toHaveBeenCalled()
      expect(mockSupabase.eq).toHaveBeenCalledWith('id', '1')
    })
  })

  describe('getLeadsHistory', () => {
    it('deve buscar histórico dos últimos 30 dias', async () => {
      const mockHistory = [
        { id: '1', name: 'João', created_at: new Date().toISOString() }
      ]
      
      mockSupabase.order.mockResolvedValueOnce({
        data: mockHistory,
        error: null
      })

      const result = await getLeadsHistory()

      expect(result).toEqual(mockHistory)
      expect(mockSupabase.gte).toHaveBeenCalled()
    })

    it('deve respeitar número de dias customizado', async () => {
      mockSupabase.order.mockResolvedValueOnce({ data: [], error: null })

      await getLeadsHistory(7)

      expect(mockSupabase.gte).toHaveBeenCalled()
    })
  })

  describe('convertLeadToClient', () => {
    it('deve converter lead em cliente', async () => {
      const mockConverted = {
        id: '1',
        converted_to_client: true,
        client_id: 'client-123',
        status: 'fechado'
      }
      
      mockSupabase.single.mockResolvedValueOnce({
        data: mockConverted,
        error: null
      })

      const result = await convertLeadToClient('1', 'client-123')

      expect(result.converted_to_client).toBe(true)
      expect(result.client_id).toBe('client-123')
      expect(result.status).toBe('fechado')
    })
  })

  describe('getLeadsStats', () => {
    it('deve retornar estatísticas completas', async () => {
      mockSupabase.select
        .mockResolvedValueOnce({ count: 100, error: null })
        .mockResolvedValueOnce({ count: 30, error: null })
        .mockResolvedValueOnce({ count: 20, error: null })
        .mockResolvedValueOnce({ count: 15, error: null })
        .mockResolvedValueOnce({ count: 25, error: null })
        .mockResolvedValueOnce({ count: 10, error: null })

      const result = await getLeadsStats()

      expect(result.total).toBe(100)
      expect(result.novos).toBe(30)
      expect(result.fechados).toBe(25)
      expect(result.taxa_conversao).toBe(25)
    })
  })

  describe('getServiceTypes', () => {
    it('deve retornar tipos de serviço únicos', async () => {
      const mockData = [
        { service_type: 'Rede' },
        { service_type: 'Portão' },
        { service_type: 'Rede' }
      ]
      
      mockSupabase.select.mockResolvedValueOnce({
        data: mockData,
        error: null
      })

      const result = await getServiceTypes()

      expect(result).toEqual(['Portão', 'Rede'])
      expect(result.length).toBe(2)
    })
  })
})
