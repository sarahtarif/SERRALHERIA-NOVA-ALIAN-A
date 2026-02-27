/**
 * API: Listar clientes
 * GET /api/admin/clients
 */

import { createClient } from '@supabase/supabase-js'

export default defineEventHandler(async (event) => {
  try {
    // Criar cliente Supabase com Service Role Key
    const supabaseUrl = process.env.NUXT_PUBLIC_SUPABASE_URL!
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
    const supabase = createClient(supabaseUrl, supabaseKey)
    
    // Buscar clientes com seus perfis
    const { data, error } = await supabase
      .from('clients')
      .select(`
        id,
        profile_id,
        neighborhood,
        city,
        created_at,
        profiles:profile_id (
          name,
          email,
          whatsapp
        )
      `)
      .order('created_at', { ascending: false })
    
    if (error) {
      console.error('[API] Erro ao buscar clientes:', error)
      throw createError({
        statusCode: 500,
        message: `Erro ao buscar clientes: ${error.message}`
      })
    }
    
    // Transformar dados para formato mais simples
    const clients = data?.map(client => ({
      id: client.id,
      profile_id: client.profile_id,
      name: client.profiles?.name || 'Sem nome',
      email: client.profiles?.email || '',
      whatsapp: client.profiles?.whatsapp || '',
      neighborhood: client.neighborhood,
      city: client.city,
      created_at: client.created_at
    })) || []
    
    return clients
  } catch (error) {
    console.error('[API] Exceção ao buscar clientes:', error)
    throw createError({
      statusCode: 500,
      message: 'Erro ao buscar clientes'
    })
  }
})
