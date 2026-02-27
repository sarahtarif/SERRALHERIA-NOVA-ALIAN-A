/**
 * API: Atualizar orçamento existente
 * PATCH /api/admin/orcamentos/:id
 */

import { createClient } from '@supabase/supabase-js'

export default defineEventHandler(async (event) => {
  try {
    // Criar cliente Supabase com Service Role Key (bypass RLS)
    const supabaseUrl = process.env.NUXT_PUBLIC_SUPABASE_URL!
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
    const supabase = createClient(supabaseUrl, supabaseKey)
    
    // Extrair ID da rota
    const id = getRouterParam(event, 'id')
    
    if (!id) {
      throw createError({
        statusCode: 400,
        message: 'ID do orçamento é obrigatório'
      })
    }
    
    // Ler body
    const body = await readBody(event)
    
    // Atualizar orçamento
    const { data: updated, error } = await supabase
      .from('orcamentos')
      .update({
        ...body,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single()
    
    if (error) {
      console.error('[API] Erro ao atualizar orçamento:', error)
      throw createError({
        statusCode: 500,
        message: `Erro ao atualizar orçamento: ${error.message}`
      })
    }
    
    return updated
  } catch (error) {
    console.error('[API] Exceção ao atualizar orçamento:', error)
    if (error.statusCode) {
      throw error
    }
    throw createError({
      statusCode: 500,
      message: 'Erro ao atualizar orçamento'
    })
  }
})
