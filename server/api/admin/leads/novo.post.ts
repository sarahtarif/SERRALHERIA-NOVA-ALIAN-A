/**
 * API: Criar novo lead
 * POST /api/admin/leads/novo
 */

import { createClient } from '@supabase/supabase-js'
import type { LeadFormData } from '~/types'

export default defineEventHandler(async (event) => {
  try {
    // Criar cliente Supabase com Service Role Key (bypassa RLS)
    const supabaseUrl = process.env.NUXT_PUBLIC_SUPABASE_URL!
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
    const supabase = createClient(supabaseUrl, supabaseKey)
    
    // Ler body
    const body = await readBody(event)
    
    // Validar dados obrigatórios
    if (!body.name || !body.whatsapp || !body.service_type) {
      throw createError({
        statusCode: 400,
        message: 'Campos obrigatórios: name, whatsapp, service_type'
      })
    }
    
    // Preparar dados do lead
    const leadData = {
      name: body.name,
      whatsapp: body.whatsapp,
      service_type: body.service_type,
      neighborhood: body.neighborhood || null,
      message: body.message || null,
      source: body.source || 'manual',
      status: body.status || 'novo',
      converted_to_client: false
    }
    
    // Inserir no banco
    const { data: newLead, error } = await supabase
      .from('leads')
      .insert(leadData)
      .select()
      .single()
    
    if (error) {
      console.error('[API] Erro ao criar lead:', error)
      throw createError({
        statusCode: 500,
        message: `Erro ao criar lead: ${error.message}`
      })
    }
    
    return newLead
  } catch (error) {
    console.error('[API] Exceção ao criar lead:', error)
    if (error.statusCode) {
      throw error
    }
    throw createError({
      statusCode: 500,
      message: 'Erro ao criar lead'
    })
  }
})
