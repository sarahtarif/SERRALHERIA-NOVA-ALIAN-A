/**
 * API: Listar leads com filtros e paginação
 * GET /api/admin/leads
 */

import { createClient } from '@supabase/supabase-js'
import type { LeadFilters, LeadsPagination } from '~/types'

export default defineEventHandler(async (event) => {
  try {
    // Criar cliente Supabase com Service Role Key
    const supabaseUrl = process.env.NUXT_PUBLIC_SUPABASE_URL!
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
    const supabase = createClient(supabaseUrl, supabaseKey)
    
    // Extrair query params
    const query = getQuery(event)
    
    // Filtros
    const filters: LeadFilters = {
      search: query.search as string | undefined,
      service_type: query.service_type as string | undefined,
      source: query.source as string | undefined,
      status: query.status as string | undefined,
      neighborhood: query.neighborhood as string | undefined,
      date_from: query.date_from as string | undefined,
      date_to: query.date_to as string | undefined,
      converted: query.converted === 'true' ? true : query.converted === 'false' ? false : undefined
    }
    
    // Paginação
    const page = parseInt(query.page as string) || 1
    const per_page = parseInt(query.per_page as string) || 20
    
    // Construir query base
    let dbQuery = supabase
      .from('leads')
      .select('*', { count: 'exact' })
    
    // Aplicar filtros
    if (filters.search) {
      dbQuery = dbQuery.or(`name.ilike.%${filters.search}%,whatsapp.ilike.%${filters.search}%,message.ilike.%${filters.search}%`)
    }
    
    if (filters.service_type) {
      dbQuery = dbQuery.eq('service_type', filters.service_type)
    }
    
    if (filters.source) {
      dbQuery = dbQuery.eq('source', filters.source)
    }
    
    if (filters.status) {
      dbQuery = dbQuery.eq('status', filters.status)
    }
    
    if (filters.neighborhood) {
      dbQuery = dbQuery.ilike('neighborhood', `%${filters.neighborhood}%`)
    }
    
    if (filters.date_from) {
      dbQuery = dbQuery.gte('created_at', filters.date_from)
    }
    
    if (filters.date_to) {
      dbQuery = dbQuery.lte('created_at', filters.date_to)
    }
    
    if (filters.converted !== undefined) {
      dbQuery = dbQuery.eq('converted_to_client', filters.converted)
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
      console.error('[API] Erro ao buscar leads:', error)
      throw createError({
        statusCode: 500,
        message: `Erro ao buscar leads: ${error.message}`
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
    console.error('[API] Exceção ao buscar leads:', error)
    throw createError({
      statusCode: 500,
      message: 'Erro ao buscar leads'
    })
  }
})
