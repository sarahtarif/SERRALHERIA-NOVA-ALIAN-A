/**
 * API: Buscar orçamento por ID com itens
 * GET /api/admin/orcamentos/:id
 */

import { createClient } from '@supabase/supabase-js'

export default defineEventHandler(async (event) => {
  try {
    // Criar cliente Supabase
    const supabaseUrl = process.env.NUXT_PUBLIC_SUPABASE_URL!
    const supabaseKey = process.env.NUXT_PUBLIC_SUPABASE_ANON_KEY!
    const supabase = createClient(supabaseUrl, supabaseKey)
    
    // Extrair ID da rota
    const id = getRouterParam(event, 'id')
    
    if (!id) {
      throw createError({
        statusCode: 400,
        message: 'ID do orçamento é obrigatório'
      })
    }
    
    // Buscar orçamento
    const { data: orcamento, error: orcError } = await supabase
      .from('orcamentos')
      .select('*')
      .eq('id', id)
      .single()
    
    if (orcError || !orcamento) {
      console.error('[API] Erro ao buscar orçamento:', orcError)
      throw createError({
        statusCode: 404,
        message: 'Orçamento não encontrado'
      })
    }
    
    // Buscar itens do orçamento
    const { data: itens, error: itensError } = await supabase
      .from('orcamento_itens')
      .select('*')
      .eq('orcamento_id', id)
      .order('ordem', { ascending: true })
    
    if (itensError) {
      console.error('[API] Erro ao buscar itens:', itensError)
      throw createError({
        statusCode: 500,
        message: 'Erro ao buscar itens do orçamento'
      })
    }
    
    return {
      ...orcamento,
      itens: itens || []
    }
  } catch (error) {
    console.error('[API] Exceção ao buscar orçamento:', error)
    if (error.statusCode) {
      throw error
    }
    throw createError({
      statusCode: 500,
      message: 'Erro ao buscar orçamento'
    })
  }
})
