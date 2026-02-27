import { defineEventHandler, getRouterParam, readBody, createError } from 'h3'
import { updateServicoStatus } from '../../../../services/servicosService'

export default defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, 'id')

    if (!id) {
      throw createError({
        statusCode: 400,
        message: 'ID do serviço é obrigatório'
      })
    }

    const body = await readBody<{ status: 'agendado' | 'em_execucao' | 'concluido' | 'cancelado' }>(event)

    if (!body.status) {
      throw createError({
        statusCode: 400,
        message: 'Status é obrigatório'
      })
    }

    const validStatuses = ['agendado', 'em_execucao', 'concluido', 'cancelado']
    if (!validStatuses.includes(body.status)) {
      throw createError({
        statusCode: 400,
        message: 'Status inválido'
      })
    }

    const updated = await updateServicoStatus(id, body.status)

    return updated
  } catch (error) {
    console.error('[API] Erro ao atualizar status do serviço:', error)
    
    if (error.statusCode) {
      throw error
    }

    throw createError({
      statusCode: 500,
      message: error instanceof Error ? error.message : 'Erro ao atualizar status'
    })
  }
})
