/**
 * API TEST: Retorna dados mockados para testar
 * GET /api/admin/dashboard/stats-test
 */

export default defineEventHandler(async (event) => {
  return {
    leadsDoMes: 15,
    taxaConversao: 35,
    servicosAgendados: 8,
    servicosHoje: 2,
    receitaMes: 12500
  }
})
