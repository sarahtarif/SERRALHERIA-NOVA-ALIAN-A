/**
 * API: Deletar orçamento e seus itens
 * DELETE /api/admin/orcamentos/:id
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
    
    // Deletar itens primeiro (cascade)
    const { error: itensError } = await supabase
      .from('orcamento_itens')
      .delete()
      .eq('orcamento_id', id)
    
    if (itensError) {
      console.error('[API] Erro ao deletar itens:', itensError)
      throw createError({
        statusCode: 500,
        message: `Erro ao deletar itens: ${itensError.message}`
      })
    }
    
    // Deletar orçamento
    const { error } = await supabase
      .from('orcamentos')
      .delete()
      .eq('id', id)
    
    if (error) {
      console.error('[API] Erro ao deletar orçamento:', error)
      throw createError({
        statusCode: 500,
        message: `Erro ao deletar orçamento: ${error.message}`
      })
    }
    
    return { success: true }
  } catch (error) {
    console.error('[API] Exceção ao deletar orçamento:', error)
    if (error.statusCode) {
      throw error
    }
    throw createError({
      statusCode: 500,
      message: 'Erro ao deletar orçamento'
    })
  }
})
