/**
 * API: Deletar lead
 * DELETE /api/admin/leads/:id
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
    
    // Deletar lead
    const { error } = await supabase
      .from('leads')
      .delete()
      .eq('id', id)
    
    if (error) {
      console.error('[API] Erro ao deletar lead:', error)
      throw createError({
        statusCode: 500,
        message: `Erro ao deletar lead: ${error.message}`
      })
    }
    
    return { success: true }
  } catch (error) {
    console.error('[API] Exceção ao deletar lead:', error)
    if (error.statusCode) {
      throw error
    }
    throw createError({
      statusCode: 500,
      message: 'Erro ao deletar lead'
    })
  }
})
