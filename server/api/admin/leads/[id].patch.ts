/**
 * API: Atualizar lead existente
 * PATCH /api/admin/leads/:id
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
    
    // Ler body
    const body = await readBody(event)
    
    // Atualizar lead
    const { data: updated, error } = await supabase
      .from('leads')
      .update({
        ...body,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single()
    
    if (error) {
      console.error('[API] Erro ao atualizar lead:', error)
      throw createError({
        statusCode: 500,
        message: `Erro ao atualizar lead: ${error.message}`
      })
    }
    
    return updated
  } catch (error) {
    console.error('[API] Exceção ao atualizar lead:', error)
    if (error.statusCode) {
      throw error
    }
    throw createError({
      statusCode: 500,
      message: 'Erro ao atualizar lead'
    })
  }
})
