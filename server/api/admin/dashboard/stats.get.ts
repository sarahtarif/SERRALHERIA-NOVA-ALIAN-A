/**
 * API: Buscar estatísticas do dashboard
 * GET /api/admin/dashboard/stats
 */

import { createClient } from '@supabase/supabase-js'

export default defineEventHandler(async (event) => {
  try {
    // Criar cliente Supabase
    const supabaseUrl = process.env.NUXT_PUBLIC_SUPABASE_URL!
    const supabaseKey = process.env.NUXT_PUBLIC_SUPABASE_ANON_KEY!
    const supabase = createClient(supabaseUrl, supabaseKey)
    
    // Datas para filtros
    const now = new Date()
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const endOfToday = new Date(startOfToday)
    endOfToday.setDate(endOfToday.getDate() + 1)
    const endOfWeek = new Date(startOfToday)
    endOfWeek.setDate(endOfWeek.getDate() + 7)

    // 1. Leads do mês
    const { count: leadsCount } = await supabase
      .from('leads')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', startOfMonth.toISOString())

    // 2. Serviços agendados (próxima semana)
    const { count: servicosCount } = await supabase
      .from('requests')
      .select('*', { count: 'exact', head: true })
      .gte('scheduled_at', startOfToday.toISOString())
      .lte('scheduled_at', endOfWeek.toISOString())
      .in('status', ['agendado', 'em_execucao'])

    // 3. Serviços hoje
    const { count: servicosHojeCount } = await supabase
      .from('requests')
      .select('*', { count: 'exact', head: true })
      .gte('scheduled_at', startOfToday.toISOString())
      .lt('scheduled_at', endOfToday.toISOString())
      .in('status', ['agendado', 'em_execucao'])

    // 4. Taxa de conversão (simplificada)
    const taxaConversao = leadsCount && servicosCount 
      ? Math.round((servicosCount / leadsCount) * 100) 
      : 0

    return {
      leadsDoMes: leadsCount || 0,
      taxaConversao,
      servicosAgendados: servicosCount || 0,
      servicosHoje: servicosHojeCount || 0,
      receitaMes: 0 // TODO: implementar quando tiver tabela de pagamentos
    }
  } catch (error) {
    console.error('[API] Erro ao buscar stats do dashboard:', error)
    throw createError({
      statusCode: 500,
      message: 'Erro ao buscar estatísticas do dashboard'
    })
  }
})
