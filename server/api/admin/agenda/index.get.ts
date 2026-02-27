import { defineEventHandler, getQuery, createError } from 'h3'
import { getAgendaItems } from '../../../services/agendaService'
import type { AgendaFilters } from '~/types'

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event)

    // Construir filtros
    const filters: AgendaFilters = {
      date_from: query.date_from as string | undefined,
      date_to: query.date_to as string | undefined,
      tecnico_id: query.tecnico_id as string | undefined,
      status: query.status as any,
      tipo_servico: query.tipo_servico as string | undefined
    }

    const result = await getAgendaItems(filters)

    return result
  } catch (error) {
    console.error('[API] Erro ao buscar agenda:', error)
    throw createError({
      statusCode: 500,
      message: error instanceof Error ? error.message : 'Erro ao buscar agenda'
    })
  }
})
