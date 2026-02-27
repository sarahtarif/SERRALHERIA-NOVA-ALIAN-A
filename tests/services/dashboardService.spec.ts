import { describe, it, expect, vi, beforeEach } from 'vitest'
import { getDashboardStats, getRecentLeads } from '../../server/services/dashboardService'

/**
 * Testes unitários do dashboardService
 * Valida queries de KPIs e leads recentes
 */

describe('dashboardService', () => {
  let mockSupabase: any

  beforeEach(() => {
    // Mock do Supabase
    mockSupabase = {
      from: vi.fn().mockReturnThis(),
      select: vi.fn().mockReturnThis(),
      gte: vi.fn().mockReturnThis(),
      lte: vi.fn().mockReturnThis(),
      lt: vi.fn().mockReturnThis(),
      in: vi.fn().mockReturnThis(),
      order: vi.fn().mockReturnThis(),
      limit: vi.fn().mockReturnThis()
    }

    // Mock global useSupabase
    global.useSupabase = vi.fn(() => mockSupabase)

    vi.clearAllMocks()
  })

  describe('getDashboardStats', () => {
    it('deve retornar estatísticas do dashboard com sucesso', async () => {
      // Arrange: mock de respostas do Supabase
      mockSupabase.select.mockResolvedValueOnce({
        count: 47,
        error: null
      })
      mockSupabase.select.mockResolvedValueOnce({
        count: 12,
        error: null
      })
      mockSupabase.select.mockResolvedValueOnce({
        count: 3,
        error: null
      })

      // Act
      const result = await getDashboardStats()

      // Assert
      expect(result).toBeDefined()
      expect(result.leadsDoMes).toBe(47)
      expect(result.servicosAgendados).toBe(12)
      expect(result.servicosHoje).toBe(3)
      expect(result.taxaConversao).toBeGreaterThanOrEqual(0)
      expect(result.receitaMes).toBeGreaterThan(0)
    })

    it('deve calcular taxa de conversão corretamente', async () => {
      // Arrange: 50 leads, 10 serviços = 20% conversão
      mockSupabase.select
        .mockResolvedValueOnce({ count: 50, error: null })
        .mockResolvedValueOnce({ count: 10, error: null })
        .mockResolvedValueOnce({ count: 2, error: null })

      // Act
      const result = await getDashboardStats()

      // Assert
      expect(result.taxaConversao).toBe(20)
    })

    it('deve retornar 0 quando não há leads', async () => {
      // Arrange: sem leads
      mockSupabase.select
        .mockResolvedValueOnce({ count: 0, error: null })
        .mockResolvedValueOnce({ count: 0, error: null })
        .mockResolvedValueOnce({ count: 0, error: null })

      // Act
      const result = await getDashboardStats()

      // Assert
      expect(result.leadsDoMes).toBe(0)
      expect(result.taxaConversao).toBe(0)
      expect(result.servicosAgendados).toBe(0)
    })

    it('deve lançar erro quando query falha', async () => {
      // Arrange: erro no Supabase
      mockSupabase.select.mockResolvedValueOnce({
        count: null,
        error: { message: 'Database error' }
      })

      // Act & Assert
      await expect(getDashboardStats()).rejects.toThrow('Erro ao buscar estatísticas')
    })
  })

  describe('getRecentLeads', () => {
    it('deve retornar leads recentes com sucesso', async () => {
      // Arrange
      const mockLeads = [
        {
          id: '1',
          name: 'João Silva',
          service_type: 'Rede para Sacada',
          neighborhood: 'Moema',
          created_at: new Date().toISOString()
        },
        {
          id: '2',
          name: 'Maria Santos',
          service_type: 'Proteção para Pets',
          neighborhood: 'Pinheiros',
          created_at: new Date(Date.now() - 3600000).toISOString()
        }
      ]

      mockSupabase.limit.mockResolvedValueOnce({
        data: mockLeads,
        error: null
      })

      // Act
      const result = await getRecentLeads(5)

      // Assert
      expect(result).toHaveLength(2)
      expect(result[0].name).toBe('João Silva')
      expect(result[0].service).toBe('Rede para Sacada')
      expect(result[0].neighborhood).toBe('Moema')
      expect(result[0].status).toBe('Novo')
      expect(result[0].time).toContain('minuto')
    })

    it('deve respeitar o limite de leads', async () => {
      // Arrange
      mockSupabase.limit.mockResolvedValueOnce({
        data: [],
        error: null
      })

      // Act
      await getRecentLeads(3)

      // Assert
      expect(mockSupabase.limit).toHaveBeenCalledWith(3)
    })

    it('deve usar limite padrão de 5 quando não especificado', async () => {
      // Arrange
      mockSupabase.limit.mockResolvedValueOnce({
        data: [],
        error: null
      })

      // Act
      await getRecentLeads()

      // Assert
      expect(mockSupabase.limit).toHaveBeenCalledWith(5)
    })

    it('deve formatar tempo relativo corretamente', async () => {
      // Arrange: lead de 2 horas atrás
      const twoHoursAgo = new Date(Date.now() - 2 * 3600000).toISOString()
      mockSupabase.limit.mockResolvedValueOnce({
        data: [{
          id: '1',
          name: 'Test',
          service_type: 'Test Service',
          neighborhood: 'Test',
          created_at: twoHoursAgo
        }],
        error: null
      })

      // Act
      const result = await getRecentLeads()

      // Assert
      expect(result[0].time).toContain('hora')
    })

    it('deve tratar neighborhood ausente', async () => {
      // Arrange: lead sem neighborhood
      mockSupabase.limit.mockResolvedValueOnce({
        data: [{
          id: '1',
          name: 'Test',
          service_type: 'Test Service',
          neighborhood: null,
          created_at: new Date().toISOString()
        }],
        error: null
      })

      // Act
      const result = await getRecentLeads()

      // Assert
      expect(result[0].neighborhood).toBe('Não informado')
    })

    it('deve lançar erro quando query falha', async () => {
      // Arrange
      mockSupabase.limit.mockResolvedValueOnce({
        data: null,
        error: { message: 'Database error' }
      })

      // Act & Assert
      await expect(getRecentLeads()).rejects.toThrow('Erro ao buscar leads recentes')
    })
  })
})
