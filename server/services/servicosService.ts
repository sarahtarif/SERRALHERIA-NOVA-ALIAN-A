import { createClient } from '@supabase/supabase-js'
import type {
  Servico,
  ServicoFormData,
  ServicoFilters,
  ServicosPagination,
  PaginatedServicos,
  ServicoWithRelations
} from '~/types'

/**
 * Buscar serviços com filtros e paginação
 */
export async function getServicos(
  filters: ServicoFilters = {},
  pagination: ServicosPagination = { page: 1, per_page: 20, total: 0, total_pages: 0 }
): Promise<PaginatedServicos> {
  const supabaseUrl = process.env.NUXT_PUBLIC_SUPABASE_URL!
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
  const supabase = createClient(supabaseUrl, supabaseKey)

  console.log('[servicosService] Buscando serviços com filtros:', filters)

  try {
    // Query base
    let query = supabase
      .from('servicos')
      .select('*', { count: 'exact' })

    // Aplicar filtros
    if (filters.search) {
      query = query.or(`nome.ilike.%${filters.search}%,endereco.ilike.%${filters.search}%,bairro.ilike.%${filters.search}%`)
    }

    if (filters.categoria) {
      query = query.eq('categoria', filters.categoria)
    }

    if (filters.tipo_servico) {
      query = query.eq('tipo_servico', filters.tipo_servico)
    }

    if (filters.status) {
      query = query.eq('status', filters.status)
    }

    if (filters.tecnico_id) {
      query = query.eq('tecnico_id', filters.tecnico_id)
    }

    if (filters.client_id) {
      query = query.eq('client_id', filters.client_id)
    }

    if (filters.bairro) {
      query = query.ilike('bairro', `%${filters.bairro}%`)
    }

    if (filters.date_from) {
      query = query.gte('data_agendada', filters.date_from)
    }

    if (filters.date_to) {
      query = query.lte('data_agendada', filters.date_to)
    }

    // Paginação
    const from = (pagination.page - 1) * pagination.per_page
    const to = from + pagination.per_page - 1

    query = query
      .order('data_agendada', { ascending: false, nullsFirst: false })
      .order('created_at', { ascending: false })
      .range(from, to)

    const { data, error, count } = await query

    if (error) {
      console.error('[servicosService] Erro ao buscar serviços:', error)
      throw new Error(`Erro ao buscar serviços: ${error.message}`)
    }

    return {
      data: data || [],
      pagination: {
        page: pagination.page,
        per_page: pagination.per_page,
        total: count || 0,
        total_pages: Math.ceil((count || 0) / pagination.per_page)
      }
    }
  } catch (error) {
    console.error('[servicosService] Exceção ao buscar serviços:', error)
    throw error
  }
}

/**
 * Buscar serviço por ID com relações
 */
export async function getServicoById(id: string): Promise<ServicoWithRelations> {
  const supabaseUrl = process.env.NUXT_PUBLIC_SUPABASE_URL!
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
  const supabase = createClient(supabaseUrl, supabaseKey)

  console.log('[servicosService] Buscando serviço:', id)

  try {
    const { data, error } = await supabase
      .from('servicos')
      .select(`
        *,
        client:clients!servicos_client_id_fkey(
          id,
          profile_id,
          document,
          address,
          neighborhood,
          city,
          created_at
        ),
        lead:leads!servicos_lead_id_fkey(
          id,
          name,
          whatsapp,
          service_type,
          neighborhood,
          message,
          source,
          status,
          created_at
        ),
        orcamento:orcamentos!servicos_orcamento_id_fkey(
          id,
          numero,
          status,
          valor_total,
          valor_final,
          created_at
        ),
        tecnico:profiles!servicos_tecnico_id_fkey(
          id,
          name,
          email,
          whatsapp
        ),
        agenda_items:agenda(
          id,
          data,
          hora_inicio,
          hora_fim,
          status,
          observacoes
        )
      `)
      .eq('id', id)
      .single()

    if (error) {
      console.error('[servicosService] Erro ao buscar serviço:', error)
      throw new Error(`Erro ao buscar serviço: ${error.message}`)
    }

    return data
  } catch (error) {
    console.error('[servicosService] Exceção ao buscar serviço:', error)
    throw error
  }
}

/**
 * Criar novo serviço
 */
export async function createServico(
  data: ServicoFormData,
  userId: string
): Promise<Servico> {
  const supabaseUrl = process.env.NUXT_PUBLIC_SUPABASE_URL!
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
  const supabase = createClient(supabaseUrl, supabaseKey)

  console.log('[servicosService] Criando serviço:', data)

  try {
    const servicoData = {
      ...data,
      status: data.status || 'agendado',
      cidade: data.cidade || 'São Paulo',
      created_by: userId,
      created_at: new Date().toISOString()
    }

    const { data: newServico, error } = await supabase
      .from('servicos')
      .insert(servicoData)
      .select()
      .single()

    if (error) {
      console.error('[servicosService] Erro ao criar serviço:', error)
      throw new Error(`Erro ao criar serviço: ${error.message}`)
    }

    console.log('[servicosService] Serviço criado:', newServico.id)
    return newServico
  } catch (error) {
    console.error('[servicosService] Exceção ao criar serviço:', error)
    throw error
  }
}

/**
 * Atualizar serviço existente
 */
export async function updateServico(
  id: string,
  data: Partial<ServicoFormData>
): Promise<Servico> {
  const supabaseUrl = process.env.NUXT_PUBLIC_SUPABASE_URL!
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
  const supabase = createClient(supabaseUrl, supabaseKey)

  console.log('[servicosService] Atualizando serviço:', id, data)

  try {
    const updateData = {
      ...data,
      updated_at: new Date().toISOString()
    }

    const { data: updated, error } = await supabase
      .from('servicos')
      .update(updateData)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('[servicosService] Erro ao atualizar serviço:', error)
      throw new Error(`Erro ao atualizar serviço: ${error.message}`)
    }

    console.log('[servicosService] Serviço atualizado:', id)
    return updated
  } catch (error) {
    console.error('[servicosService] Exceção ao atualizar serviço:', error)
    throw error
  }
}

/**
 * Deletar serviço
 */
export async function deleteServico(id: string): Promise<void> {
  const supabaseUrl = process.env.NUXT_PUBLIC_SUPABASE_URL!
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
  const supabase = createClient(supabaseUrl, supabaseKey)

  console.log('[servicosService] Deletando serviço:', id)

  try {
    // Primeiro deletar itens da agenda relacionados
    const { error: agendaError } = await supabase
      .from('agenda')
      .delete()
      .eq('servico_id', id)

    if (agendaError) {
      console.error('[servicosService] Erro ao deletar agenda:', agendaError)
      throw new Error(`Erro ao deletar agenda: ${agendaError.message}`)
    }

    // Depois deletar o serviço
    const { error } = await supabase
      .from('servicos')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('[servicosService] Erro ao deletar serviço:', error)
      throw new Error(`Erro ao deletar serviço: ${error.message}`)
    }

    console.log('[servicosService] Serviço deletado:', id)
  } catch (error) {
    console.error('[servicosService] Exceção ao deletar serviço:', error)
    throw error
  }
}

/**
 * Atualizar status do serviço
 */
export async function updateServicoStatus(
  id: string,
  status: 'agendado' | 'em_execucao' | 'concluido' | 'cancelado'
): Promise<Servico> {
  const supabaseUrl = process.env.NUXT_PUBLIC_SUPABASE_URL!
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
  const supabase = createClient(supabaseUrl, supabaseKey)

  console.log('[servicosService] Atualizando status do serviço:', id, status)

  try {
    const updateData: any = {
      status,
      updated_at: new Date().toISOString()
    }

    // Se status for 'em_execucao' e não tiver data_inicio, adicionar
    if (status === 'em_execucao') {
      const { data: servico } = await supabase
        .from('servicos')
        .select('data_inicio')
        .eq('id', id)
        .single()

      if (!servico?.data_inicio) {
        updateData.data_inicio = new Date().toISOString()
      }
    }

    // Se status for 'concluido', adicionar data_conclusao
    if (status === 'concluido') {
      updateData.data_conclusao = new Date().toISOString()
    }

    const { data: updated, error } = await supabase
      .from('servicos')
      .update(updateData)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('[servicosService] Erro ao atualizar status:', error)
      throw new Error(`Erro ao atualizar status: ${error.message}`)
    }

    console.log('[servicosService] Status atualizado:', id, status)
    return updated
  } catch (error) {
    console.error('[servicosService] Exceção ao atualizar status:', error)
    throw error
  }
}

/**
 * Buscar serviços por cliente
 */
export async function getServicosByClient(clientId: string): Promise<Servico[]> {
  const supabaseUrl = process.env.NUXT_PUBLIC_SUPABASE_URL!
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
  const supabase = createClient(supabaseUrl, supabaseKey)

  console.log('[servicosService] Buscando serviços do cliente:', clientId)

  try {
    const { data, error } = await supabase
      .from('servicos')
      .select('*')
      .eq('client_id', clientId)
      .order('data_agendada', { ascending: false })

    if (error) {
      console.error('[servicosService] Erro ao buscar serviços do cliente:', error)
      throw new Error(`Erro ao buscar serviços: ${error.message}`)
    }

    return data || []
  } catch (error) {
    console.error('[servicosService] Exceção ao buscar serviços do cliente:', error)
    throw error
  }
}
