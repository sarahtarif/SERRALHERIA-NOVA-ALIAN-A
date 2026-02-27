import { createClient } from '@supabase/supabase-js'
import type {
  AgendaItem,
  AgendaItemFormData,
  AgendaFilters,
  AgendaDay,
  AgendaItemWithServico,
  AgendaCalendarEvent
} from '~/types'

/**
 * Buscar itens da agenda com filtros
 */
export async function getAgendaItems(
  filters: AgendaFilters = {}
): Promise<AgendaItemWithServico[]> {
  const supabaseUrl = process.env.NUXT_PUBLIC_SUPABASE_URL!
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
  const supabase = createClient(supabaseUrl, supabaseKey)

  console.log('[agendaService] Buscando itens da agenda com filtros:', filters)

  try {
    let query = supabase
      .from('agenda')
      .select(`
        *,
        servico:servicos!agenda_servico_id_fkey(
          id,
          nome,
          descricao,
          categoria,
          tipo_servico,
          status,
          client_id,
          lead_id,
          endereco,
          bairro,
          cidade,
          valor,
          client:clients!servicos_client_id_fkey(
            id,
            profile_id
          ),
          lead:leads!servicos_lead_id_fkey(
            id,
            name,
            whatsapp
          )
        ),
        tecnico:profiles!agenda_tecnico_id_fkey(
          id,
          name,
          email,
          whatsapp
        )
      `)

    // Aplicar filtros
    if (filters.date_from) {
      query = query.gte('data', filters.date_from)
    }

    if (filters.date_to) {
      query = query.lte('data', filters.date_to)
    }

    if (filters.tecnico_id) {
      query = query.eq('tecnico_id', filters.tecnico_id)
    }

    if (filters.status) {
      query = query.eq('status', filters.status)
    }

    query = query.order('data', { ascending: true }).order('hora_inicio', { ascending: true })

    const { data, error } = await query

    if (error) {
      console.error('[agendaService] Erro ao buscar agenda:', error)
      throw new Error(`Erro ao buscar agenda: ${error.message}`)
    }

    // Filtrar por tipo_servico se necessário (não é campo direto da agenda)
    let result = data || []
    if (filters.tipo_servico) {
      result = result.filter(item => item.servico?.tipo_servico === filters.tipo_servico)
    }

    return result
  } catch (error) {
    console.error('[agendaService] Exceção ao buscar agenda:', error)
    throw error
  }
}

/**
 * Buscar agenda agrupada por dia
 */
export async function getAgendaByDays(
  filters: AgendaFilters = {}
): Promise<AgendaDay[]> {
  const items = await getAgendaItems(filters)

  // Agrupar por data
  const grouped = items.reduce((acc, item) => {
    const date = item.data
    if (!acc[date]) {
      acc[date] = []
    }
    acc[date].push(item)
    return acc
  }, {} as Record<string, AgendaItemWithServico[]>)

  // Converter para array de AgendaDay
  const days: AgendaDay[] = Object.entries(grouped).map(([date, items]) => ({
    date,
    items,
    total: items.length
  }))

  // Ordenar por data
  days.sort((a, b) => a.date.localeCompare(b.date))

  return days
}

/**
 * Buscar agenda formatada para calendário
 */
export async function getAgendaCalendarEvents(
  filters: AgendaFilters = {}
): Promise<AgendaCalendarEvent[]> {
  const items = await getAgendaItems(filters)

  return items.map(item => {
    const startDate = new Date(`${item.data}T${item.hora_inicio}`)
    const endDate = item.hora_fim 
      ? new Date(`${item.data}T${item.hora_fim}`)
      : new Date(startDate.getTime() + 2 * 60 * 60 * 1000) // +2 horas padrão

    // Cores por tipo de serviço
    const colorMap: Record<string, string> = {
      redes: '#3B82F6', // blue
      portoes: '#10B981', // green
      cameras: '#F59E0B', // orange
      interfones: '#8B5CF6', // purple
      manutencao: '#EF4444', // red
      default: '#6B7280' // gray
    }

    const color = colorMap[item.servico?.tipo_servico || 'default'] || colorMap.default

    return {
      id: item.id,
      title: item.servico?.nome || 'Serviço',
      start: startDate,
      end: endDate,
      color,
      servico_id: item.servico_id,
      tecnico_id: item.tecnico_id,
      status: item.status,
      tipo_servico: item.servico?.tipo_servico || ''
    }
  })
}

/**
 * Buscar item da agenda por ID
 */
export async function getAgendaItemById(id: string): Promise<AgendaItemWithServico> {
  const supabaseUrl = process.env.NUXT_PUBLIC_SUPABASE_URL!
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
  const supabase = createClient(supabaseUrl, supabaseKey)

  console.log('[agendaService] Buscando item da agenda:', id)

  try {
    const { data, error } = await supabase
      .from('agenda')
      .select(`
        *,
        servico:servicos!agenda_servico_id_fkey(
          id,
          nome,
          descricao,
          categoria,
          tipo_servico,
          status,
          client_id,
          lead_id,
          endereco,
          bairro,
          cidade,
          valor
        ),
        tecnico:profiles!agenda_tecnico_id_fkey(
          id,
          name,
          email,
          whatsapp
        )
      `)
      .eq('id', id)
      .single()

    if (error) {
      console.error('[agendaService] Erro ao buscar item da agenda:', error)
      throw new Error(`Erro ao buscar item: ${error.message}`)
    }

    return data
  } catch (error) {
    console.error('[agendaService] Exceção ao buscar item da agenda:', error)
    throw error
  }
}

/**
 * Criar novo item na agenda
 */
export async function createAgendaItem(
  data: AgendaItemFormData
): Promise<AgendaItem> {
  const supabaseUrl = process.env.NUXT_PUBLIC_SUPABASE_URL!
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
  const supabase = createClient(supabaseUrl, supabaseKey)

  console.log('[agendaService] Criando item na agenda:', data)

  try {
    const agendaData = {
      ...data,
      status: data.status || 'agendado',
      created_at: new Date().toISOString()
    }

    const { data: newItem, error } = await supabase
      .from('agenda')
      .insert(agendaData)
      .select()
      .single()

    if (error) {
      console.error('[agendaService] Erro ao criar item na agenda:', error)
      throw new Error(`Erro ao criar item: ${error.message}`)
    }

    console.log('[agendaService] Item criado na agenda:', newItem.id)
    return newItem
  } catch (error) {
    console.error('[agendaService] Exceção ao criar item na agenda:', error)
    throw error
  }
}

/**
 * Atualizar item da agenda
 */
export async function updateAgendaItem(
  id: string,
  data: Partial<AgendaItemFormData>
): Promise<AgendaItem> {
  const supabaseUrl = process.env.NUXT_PUBLIC_SUPABASE_URL!
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
  const supabase = createClient(supabaseUrl, supabaseKey)

  console.log('[agendaService] Atualizando item da agenda:', id, data)

  try {
    const updateData = {
      ...data,
      updated_at: new Date().toISOString()
    }

    const { data: updated, error } = await supabase
      .from('agenda')
      .update(updateData)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('[agendaService] Erro ao atualizar item:', error)
      throw new Error(`Erro ao atualizar item: ${error.message}`)
    }

    console.log('[agendaService] Item atualizado:', id)
    return updated
  } catch (error) {
    console.error('[agendaService] Exceção ao atualizar item:', error)
    throw error
  }
}

/**
 * Deletar item da agenda
 */
export async function deleteAgendaItem(id: string): Promise<void> {
  const supabaseUrl = process.env.NUXT_PUBLIC_SUPABASE_URL!
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
  const supabase = createClient(supabaseUrl, supabaseKey)

  console.log('[agendaService] Deletando item da agenda:', id)

  try {
    const { error } = await supabase
      .from('agenda')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('[agendaService] Erro ao deletar item:', error)
      throw new Error(`Erro ao deletar item: ${error.message}`)
    }

    console.log('[agendaService] Item deletado:', id)
  } catch (error) {
    console.error('[agendaService] Exceção ao deletar item:', error)
    throw error
  }
}

/**
 * Verificar conflitos de agenda
 */
export async function checkAgendaConflicts(
  data: string,
  hora_inicio: string,
  hora_fim: string,
  tecnico_id?: string,
  excludeId?: string
): Promise<boolean> {
  const supabaseUrl = process.env.NUXT_PUBLIC_SUPABASE_URL!
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
  const supabase = createClient(supabaseUrl, supabaseKey)

  console.log('[agendaService] Verificando conflitos:', { data, hora_inicio, hora_fim, tecnico_id })

  try {
    let query = supabase
      .from('agenda')
      .select('id')
      .eq('data', data)
      .neq('status', 'cancelado')

    if (tecnico_id) {
      query = query.eq('tecnico_id', tecnico_id)
    }

    if (excludeId) {
      query = query.neq('id', excludeId)
    }

    // Verificar sobreposição de horários
    query = query.or(`and(hora_inicio.lte.${hora_fim},hora_fim.gte.${hora_inicio})`)

    const { data: conflicts, error } = await query

    if (error) {
      console.error('[agendaService] Erro ao verificar conflitos:', error)
      throw new Error(`Erro ao verificar conflitos: ${error.message}`)
    }

    const hasConflict = (conflicts?.length || 0) > 0
    console.log('[agendaService] Conflitos encontrados:', hasConflict)
    
    return hasConflict
  } catch (error) {
    console.error('[agendaService] Exceção ao verificar conflitos:', error)
    throw error
  }
}

/**
 * Buscar agenda do dia
 */
export async function getAgendaToday(tecnico_id?: string): Promise<AgendaItemWithServico[]> {
  const today = new Date().toISOString().split('T')[0]
  
  return getAgendaItems({
    date_from: today,
    date_to: today,
    tecnico_id
  })
}

/**
 * Buscar agenda da semana
 */
export async function getAgendaWeek(tecnico_id?: string): Promise<AgendaDay[]> {
  const today = new Date()
  const startOfWeek = new Date(today)
  startOfWeek.setDate(today.getDate() - today.getDay()) // Domingo
  
  const endOfWeek = new Date(startOfWeek)
  endOfWeek.setDate(startOfWeek.getDate() + 6) // Sábado

  return getAgendaByDays({
    date_from: startOfWeek.toISOString().split('T')[0],
    date_to: endOfWeek.toISOString().split('T')[0],
    tecnico_id
  })
}
