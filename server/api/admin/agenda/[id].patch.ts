import { defineEventHandler, getRouterParam, readBody, createError } from 'h3'
import { updateAgendaItem } from '../../../services/agendaService'
import type { AgendaItemFormData } from '~/types'

export default defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, 'id')

    if (!id) {
      throw createError({
        statusCode: 400,
        message: 'ID do item é obrigatório'
      })
    }

    const body = await readBody<Partial<AgendaItemFormData>>(event)

    const updated = await updateAgendaItem(id, body)

    return updated
  } catch (error) {
    console.error('[API] Erro ao atualizar item da agenda:', error)
    
    if (error.statusCode) {
      throw error
    }

    throw createError({
      statusCode: 500,
      message: error instanceof Error ? error.message : 'Erro ao atualizar item'
    })
  }
})
