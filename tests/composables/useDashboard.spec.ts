import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useDashboard } from '../../app/composables/admin/useDashboard'

/**
 * Testes unitários do useDashboard
 * Valida lógica de negócio do dashboard
 */

// Mock do service
vi.mock('../../server/services/dashboardService', () => ({
  getDashboardStats: vi.fn(),
  getRecentLeads: vi.fn()
}))

import { getDashboardStats, getRecentLeads } from '../../server/services/dashboardService'

describe('useDashboard', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Estado inicial', () => {
    it('deve inicializar com valores padrão', () => {
      const { stats, recentLeads, loading, error } = useDashboard()

      expect(stats.value.leadsDoMes).toBe(0)
      expect(stats.value.taxaConversao).toBe(0)
      expect(stats.value.servicosAgendados).toBe(0)
      expect(stats.value.servicosHoje).toBe(0)
      expect(stats.value.receitaMes).toBe(0)
      expect(recentLeads.value).toEqual([])
      expect(loading.value).toBe(false)
      expect(error.value).toBeNull()
    })
  })

  describe('fetchStats', () => {
    it('deve buscar estatísticas com sucesso', async () => {
      // Arrange
      const mockStats = {
        leadsDoMes: 47,
        taxaConversao: 32,
        servicosAgendados: 12,
        servicosHoje: 3,
        receitaMes: 28500
      }
      vi.mocked(getDashboardStats).mockResolvedValueOnce(mockStats)

      const { stats, loading, error, fetchStats } = useDashboard()

      // Act
      await fetchStats()

      // Assert
      expect(loading.value).toBe(false)
      expect(error.value).toBeNull()
      expect(stats.value).toEqual(mockStats)
      expect(getDashboardStats).toHaveBeenCalledTimes(1)
    })

    it('deve definir loading durante busca', async () => {
      // Arrange
      vi.mocked(getDashboardStats).mockImplementation(() => 
        new Promise(resolve => setTimeout(() => resolve({
          leadsDoMes: 0,
          taxaConversao: 0,
          servicosAgendados: 0,
          servicosHoje: 0,
          receitaMes: 0
        }), 100))
      )

      const { loading, fetchStats } = useDashboard()

      // Act
      const promise = fetchStats()
      
      // Assert: loading deve ser true durante a busca
      expect(loading.value).toBe(true)
      
      await promise
      expect(loading.value).toBe(false)
    })

    it('deve tratar erro ao buscar estatísticas', async () => {
      // Arrange
      const errorMessage = 'Erro ao buscar estatísticas'
      vi.mocked(getDashboardStats).mockRejectedValueOnce(new Error(errorMessage))

      const { error, loading, fetchStats } = useDashboard()

      // Act
      await fetchStats()

      // Assert
      expect(loading.value).toBe(false)
      expect(error.value).toBe(errorMessage)
    })

    it('deve limpar erro anterior ao buscar novamente', async () => {
      // Arrange
      vi.mocked(getDashboardStats)
        .mockRejectedValueOnce(new Error('Erro'))
        .mockResolvedValueOnce({
          leadsDoMes: 10,
          taxaConversao: 20,
          servicosAgendados: 5,
          servicosHoje: 1,
          receitaMes: 5000
        })

      const { error, fetchStats } = useDashboard()

      // Act
      await fetchStats() // Primeiro erro
      expect(error.value).toBe('Erro')
      
      await fetchStats() // Segunda tentativa com sucesso

      // Assert
      expect(error.value).toBeNull()
    })
  })

  describe('fetchRecentLeads', () => {
    it('deve buscar leads recentes com sucesso', async () => {
      // Arrange
      const mockLeads = [
        {
          id: '1',
          name: 'João Silva',
          service: 'Rede para Sacada',
          neighborhood: 'Moema',
          time: 'Há 15 minutos',
          status: 'Novo'
        }
      ]
      vi.mocked(getRecentLeads).mockResolvedValueOnce(mockLeads)

      const { recentLeads, loading, error, fetchRecentLeads } = useDashboard()

      // Act
      await fetchRecentLeads(5)

      // Assert
      expect(loading.value).toBe(false)
      expect(error.value).toBeNull()
      expect(recentLeads.value).toEqual(mockLeads)
      expect(getRecentLeads).toHaveBeenCalledWith(5)
    })

    it('deve usar limite padrão de 5', async () => {
      // Arrange
      vi.mocked(getRecentLeads).mockResolvedValueOnce([])

      const { fetchRecentLeads } = useDashboard()

      // Act
      await fetchRecentLeads()

      // Assert
      expect(getRecentLeads).toHaveBeenCalledWith(5)
    })

    it('deve tratar erro ao buscar leads', async () => {
      // Arrange
      const errorMessage = 'Erro ao buscar leads recentes'
      vi.mocked(getRecentLeads).mockRejectedValueOnce(new Error(errorMessage))

      const { error, loading, fetchRecentLeads } = useDashboard()

      // Act
      await fetchRecentLeads()

      // Assert
      expect(loading.value).toBe(false)
      expect(error.value).toBe(errorMessage)
    })
  })

  describe('refreshDashboard', () => {
    it('deve buscar stats e leads simultaneamente', async () => {
      // Arrange
      const mockStats = {
        leadsDoMes: 47,
        taxaConversao: 32,
        servicosAgendados: 12,
        servicosHoje: 3,
        receitaMes: 28500
      }
      const mockLeads = [
        {
          id: '1',
          name: 'João Silva',
          service: 'Rede para Sacada',
          neighborhood: 'Moema',
          time: 'Há 15 minutos',
          status: 'Novo'
        }
      ]

      vi.mocked(getDashboardStats).mockResolvedValueOnce(mockStats)
      vi.mocked(getRecentLeads).mockResolvedValueOnce(mockLeads)

      const { stats, recentLeads, refreshDashboard } = useDashboard()

      // Act
      await refreshDashboard()

      // Assert
      expect(stats.value).toEqual(mockStats)
      expect(recentLeads.value).toEqual(mockLeads)
      expect(getDashboardStats).toHaveBeenCalledTimes(1)
      expect(getRecentLeads).toHaveBeenCalledTimes(1)
    })

    it('deve continuar mesmo se uma das chamadas falhar', async () => {
      // Arrange
      vi.mocked(getDashboardStats).mockRejectedValueOnce(new Error('Erro stats'))
      vi.mocked(getRecentLeads).mockResolvedValueOnce([])

      const { refreshDashboard } = useDashboard()

      // Act & Assert: não deve lançar erro
      await expect(refreshDashboard()).resolves.not.toThrow()
    })
  })

  describe('Computed: hasData', () => {
    it('deve retornar false quando não há leads', async () => {
      // Arrange
      vi.mocked(getDashboardStats).mockResolvedValueOnce({
        leadsDoMes: 0,
        taxaConversao: 0,
        servicosAgendados: 0,
        servicosHoje: 0,
        receitaMes: 0
      })

      const { hasData, fetchStats } = useDashboard()

      // Act
      await fetchStats()

      // Assert
      expect(hasData.value).toBe(false)
    })

    it('deve retornar true quando há leads', async () => {
      // Arrange
      vi.mocked(getDashboardStats).mockResolvedValueOnce({
        leadsDoMes: 10,
        taxaConversao: 20,
        servicosAgendados: 5,
        servicosHoje: 1,
        receitaMes: 5000
      })

      const { hasData, fetchStats } = useDashboard()

      // Act
      await fetchStats()

      // Assert
      expect(hasData.value).toBe(true)
    })
  })

  describe('Estado readonly', () => {
    it('não deve permitir modificação direta do estado', () => {
      const { stats, recentLeads, loading, error } = useDashboard()

      // Assert: propriedades devem ser readonly
      expect(() => {
        // @ts-expect-error - testando que é readonly
        stats.value = {}
      }).toThrow()

      expect(() => {
        // @ts-expect-error - testando que é readonly
        recentLeads.value = []
      }).toThrow()

      expect(() => {
        // @ts-expect-error - testando que é readonly
        loading.value = true
      }).toThrow()

      expect(() => {
        // @ts-expect-error - testando que é readonly
        error.value = 'erro'
      }).toThrow()
    })
  })
})
