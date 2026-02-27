import { describe, it, expect, vi, beforeEach } from 'vitest'
import {
  getOrcamentos,
  getOrcamentoById,
  createOrcamento,
  updateOrcamento,
  deleteOrcamento,
  calcularImpostos,
  getOrcamentosStats
} from '../../server/services/orcamentosService'

describe('orcamentosService', () => {
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
      gte: vi.fn().mockReturnThis(),
      lte: vi.fn().mockReturnThis(),
      order: vi.fn().mockReturnThis(),
      range: vi.fn().mockReturnThis(),
      single: vi.fn().mockReturnThis()
    }

    global.useSupabase = vi.fn(() => mockSupabase)
    vi.clearAllMocks()
  })

  describe('calcularImpostos', () => {
    it('deve calcular impostos corretamente', () => {
      const valor = 1000
      const impostos = calcularImpostos(valor)
      
      // 5% + 1.65% + 7.6% + 1% = 15.25%
      expect(impostos).toBe(152.5)
    })

    it('deve aceitar configuração customizada', () => {
      const valor = 1000
      const config = {
        aliquota_iss: 0.05,
        aliquota_pis: 0.02,
        aliquota_cofins: 0.08,
        aliquota_csll: 0.01
      }
      const impostos = calcularImpostos(valor, config)
      
      expect(impostos).toBe(160)
    })
  })

  describe('getOrcamentos', () => {
    it('deve buscar orçamentos com sucesso', async () => {
      const mockData = [{ id: '1', numero: 'ORC-2026-001' }]
      mockSupabase.range.mockResolvedValueOnce({
        data: mockData,
        count: 1,
        error: null
      })

      const result = await getOrcamentos()

      expect(result.data).toEqual(mockData)
      expect(result.pagination.total).toBe(1)
    })

    it('deve aplicar filtros', async () => {
      mockSupabase.range.mockResolvedValueOnce({ data: [], count: 0, error: null })

      await getOrcamentos({ status: 'aprovado', valor_min: 1000 })

      expect(mockSupabase.eq).toHaveBeenCalledWith('status', 'aprovado')
      expect(mockSupabase.gte).toHaveBeenCalledWith('valor_final', 1000)
    })
  })

  describe('getOrcamentoById', () => {
    it('deve buscar orçamento com itens', async () => {
      const mockOrcamento = { id: '1', numero: 'ORC-001' }
      const mockItens = [{ id: '1', descricao: 'Item 1' }]
      
      mockSupabase.single
        .mockResolvedValueOnce({ data: mockOrcamento, error: null })
      
      mockSupabase.order
        .mockResolvedValueOnce({ data: mockItens, error: null })

      const result = await getOrcamentoById('1')

      expect(result.id).toBe('1')
      expect(result.itens).toEqual(mockItens)
    })
  })

  describe('createOrcamento', () => {
    it('deve criar orçamento com itens', async () => {
      const formData = {
        itens: [
          { descricao: 'Item 1', quantidade: 2, valor_unitario: 100 },
          { descricao: 'Item 2', quantidade: 1, valor_unitario: 50 }
        ]
      }
      
      mockSupabase.single.mockResolvedValueOnce({
        data: { id: '1', numero: 'ORC-001' },
        error: null
      })
      
      mockSupabase.select.mockResolvedValueOnce({
        data: [{ id: '1' }, { id: '2' }],
        error: null
      })

      const result = await createOrcamento(formData, 'user-123')

      expect(result.id).toBe('1')
      expect(result.itens).toHaveLength(2)
    })

    it('deve calcular valores corretamente', async () => {
      const formData = {
        itens: [
          { descricao: 'Item', quantidade: 2, valor_unitario: 100 }
        ],
        valor_desconto: 20
      }
      
      mockSupabase.single.mockResolvedValueOnce({
        data: { id: '1', valor_total: 200, valor_final: 180 },
        error: null
      })
      
      mockSupabase.select.mockResolvedValueOnce({
        data: [],
        error: null
      })

      await createOrcamento(formData, 'user-123')

      expect(mockSupabase.insert).toHaveBeenCalledWith(
        expect.objectContaining({
          valor_total: 200,
          valor_desconto: 20,
          valor_final: 180
        })
      )
    })
  })

  describe('updateOrcamento', () => {
    it('deve atualizar orçamento', async () => {
      mockSupabase.single.mockResolvedValueOnce({
        data: { id: '1', status: 'aprovado' },
        error: null
      })

      const result = await updateOrcamento('1', { status: 'aprovado' })

      expect(result.status).toBe('aprovado')
    })
  })

  describe('deleteOrcamento', () => {
    it('deve deletar orçamento e itens', async () => {
      mockSupabase.eq
        .mockResolvedValueOnce({ error: null })
        .mockResolvedValueOnce({ error: null })

      await deleteOrcamento('1')

      expect(mockSupabase.delete).toHaveBeenCalledTimes(2)
    })
  })

  describe('getOrcamentosStats', () => {
    it('deve retornar estatísticas', async () => {
      mockSupabase.select
        .mockResolvedValueOnce({ count: 100, error: null })
        .mockResolvedValueOnce({ count: 20, error: null })
        .mockResolvedValueOnce({ count: 30, error: null })
        .mockResolvedValueOnce({ count: 40, error: null })
        .mockResolvedValueOnce({ count: 10, error: null })
        .mockResolvedValueOnce({ data: [{ valor_final: 1000 }, { valor_final: 2000 }], error: null })

      const result = await getOrcamentosStats()

      expect(result.total).toBe(100)
      expect(result.aprovados).toBe(40)
      expect(result.valor_total_aprovados).toBe(3000)
      expect(result.taxa_aprovacao).toBe(40)
    })
  })
})
