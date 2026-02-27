import { defineEventHandler, getRouterParam, createError } from 'h3'
import { deleteAgendaItem } from '../../../services/agendaService'

export default defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, 'id')

    if (!id) {
      throw createError({
        statusCode: 400,
        message: 'ID do item é obrigatório'
      })
    }

    await deleteAgendaItem(id)

    return { success: true, message: 'Item deletado com sucesso' }
  } catch (error) {
    console.error('[API] Erro ao deletar item da agenda:', error)
    
    if (error.statusCode) {
      throw error
    }

    throw createError({
      statusCode: 500,
      message: error instanceof Error ? error.message : 'Erro ao deletar item'
    })
  }
})
