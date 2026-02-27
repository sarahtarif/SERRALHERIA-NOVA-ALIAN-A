/**
 * API: Listar orçamentos com filtros e paginação
 * GET /api/admin/orcamentos
 */

import { createClient } from '@supabase/supabase-js'
import type { OrcamentoFilters } from '~/types'

export default defineEventHandler(async (event) => {
  try {
    // Criar cliente Supabase com Service Role Key (bypass RLS)
    const supabaseUrl = process.env.NUXT_PUBLIC_SUPABASE_URL!
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
    const supabase = createClient(supabaseUrl, supabaseKey)
    
    // Extrair query params
    const query = getQuery(event)
    
    // Filtros
    const filters: OrcamentoFilters = {
      search: query.search as string | undefined,
      status: query.status as string | undefined,
      client_id: query.client_id as string | undefined,
      lead_id: query.lead_id as string | undefined,
      date_from: query.date_from as string | undefined,
      date_to: query.date_to as string | undefined,
      valor_min: query.valor_min ? parseFloat(query.valor_min as string) : undefined,
      valor_max: query.valor_max ? parseFloat(query.valor_max as string) : undefined
    }
    
    // Paginação
    const page = parseInt(query.page as string) || 1
    const per_page = parseInt(query.per_page as string) || 20
    
    // Construir query base
    let dbQuery = supabase
      .from('orcamentos')
      .select('*', { count: 'exact' })
    
    // Aplicar filtros
    if (filters.search) {
      dbQuery = dbQuery.or(`numero.ilike.%${filters.search}%,observacoes.ilike.%${filters.search}%`)
    }
    
    if (filters.status) {
      dbQuery = dbQuery.eq('status', filters.status)
    }
    
    if (filters.client_id) {
      dbQuery = dbQuery.eq('client_id', filters.client_id)
    }
    
    if (filters.lead_id) {
      dbQuery = dbQuery.eq('lead_id', filters.lead_id)
    }
    
    if (filters.date_from) {
      dbQuery = dbQuery.gte('created_at', filters.date_from)
    }
    
    if (filters.date_to) {
      dbQuery = dbQuery.lte('created_at', filters.date_to)
    }
    
    if (filters.valor_min !== undefined) {
      dbQuery = dbQuery.gte('valor_final', filters.valor_min)
    }
    
    if (filters.valor_max !== undefined) {
      dbQuery = dbQuery.lte('valor_final', filters.valor_max)
    }
    
    // Aplicar paginação
    const from = (page - 1) * per_page
    const to = from + per_page - 1
    
    dbQuery = dbQuery
      .order('created_at', { ascending: false })
      .range(from, to)
    
    // Executar query
    const { data, error, count } = await dbQuery
    
    if (error) {
      console.error('[API] Erro ao buscar orçamentos:', error)
      throw createError({
        statusCode: 500,
        message: `Erro ao buscar orçamentos: ${error.message}`
      })
    }
    
    return {
      data: data || [],
      pagination: {
        page,
        per_page,
        total: count || 0,
        total_pages: Math.ceil((count || 0) / per_page)
      }
    }
  } catch (error) {
    console.error('[API] Exceção ao buscar orçamentos:', error)
    throw createError({
      statusCode: 500,
      message: 'Erro ao buscar orçamentos'
    })
  }
})
