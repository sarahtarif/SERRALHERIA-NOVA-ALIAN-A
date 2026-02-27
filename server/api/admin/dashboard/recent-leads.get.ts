/**
 * API: Buscar leads recentes
 * GET /api/admin/dashboard/recent-leads?limit=5
 */

import { createClient } from '@supabase/supabase-js'

export default defineEventHandler(async (event) => {
  try {
    // Criar cliente Supabase com Service Role Key (bypass RLS)
    const supabaseUrl = process.env.NUXT_PUBLIC_SUPABASE_URL!
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
    const supabase = createClient(supabaseUrl, supabaseKey)
    const query = getQuery(event)
    const limit = query.limit ? parseInt(query.limit as string) : 5
    
    const { data, error } = await supabase
      .from('leads')
      .select('id, name, service_type, neighborhood, created_at')
      .order('created_at', { ascending: false })
      .limit(limit)

    if (error) throw error

    // Formatar dados
    const leads = (data || []).map(lead => ({
      id: lead.id,
      name: lead.name,
      service: lead.service_type,
      neighborhood: lead.neighborhood || 'Não informado',
      time: formatTimeAgo(lead.created_at),
      status: 'novo'
    }))

    return leads
  } catch (error) {
    console.error('[API] Erro ao buscar leads recentes:', error)
    throw createError({
      statusCode: 500,
      message: 'Erro ao buscar leads recentes'
    })
  }
})

// Helper para formatar tempo relativo
function formatTimeAgo(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)

  if (diffMins < 1) return 'Agora'
  if (diffMins < 60) return `${diffMins}min atrás`
  if (diffHours < 24) return `${diffHours}h atrás`
  if (diffDays === 1) return 'Ontem'
  if (diffDays < 7) return `${diffDays} dias atrás`
  
  return date.toLocaleDateString('pt-BR')
}
