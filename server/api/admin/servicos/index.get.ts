import { defineEventHandler, getQuery, createError } from 'h3'
import { getServicos } from '../../../services/servicosService'
import type { ServicoFilters, ServicosPagination } from '~/types'

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event)

    // Construir filtros
    const filters: ServicoFilters = {
      search: query.search as string | undefined,
      categoria: query.categoria as any,
      tipo_servico: query.tipo_servico as string | undefined,
      status: query.status as any,
      tecnico_id: query.tecnico_id as string | undefined,
      client_id: query.client_id as string | undefined,
      bairro: query.bairro as string | undefined,
      date_from: query.date_from as string | undefined,
      date_to: query.date_to as string | undefined
    }

    // Construir paginação
    const pagination: ServicosPagination = {
      page: parseInt(query.page as string) || 1,
      per_page: parseInt(query.per_page as string) || 20,
      total: 0,
      total_pages: 0
    }

    const result = await getServicos(filters, pagination)

    return result
  } catch (error) {
    console.error('[API] Erro ao buscar serviços:', error)
    throw createError({
      statusCode: 500,
      message: error instanceof Error ? error.message : 'Erro ao buscar serviços'
    })
  }
})
