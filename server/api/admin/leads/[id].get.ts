/**
 * API: Buscar lead por ID
 * GET /api/admin/leads/:id
 */

import { createClient } from '@supabase/supabase-js'

export default defineEventHandler(async (event) => {
  try {
    // Criar cliente Supabase com Service Role Key
    const supabaseUrl = process.env.NUXT_PUBLIC_SUPABASE_URL!
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
    const supabase = createClient(supabaseUrl, supabaseKey)
    
    // Extrair ID da rota
    const id = getRouterParam(event, 'id')
    
    if (!id) {
      throw createError({
        statusCode: 400,
        message: 'ID do lead é obrigatório'
      })
    }
    
    // Buscar lead
    const { data, error } = await supabase
      .from('leads')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) {
      console.error('[API] Erro ao buscar lead:', error)
      throw createError({
        statusCode: 404,
        message: 'Lead não encontrado'
      })
    }
    
    if (!data) {
      throw createError({
        statusCode: 404,
        message: 'Lead não encontrado'
      })
    }
    
    return data
  } catch (error) {
    console.error('[API] Exceção ao buscar lead:', error)
    if (error.statusCode) {
      throw error
    }
    throw createError({
      statusCode: 500,
      message: 'Erro ao buscar lead'
    })
  }
})
