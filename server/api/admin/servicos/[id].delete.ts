import { defineEventHandler, getRouterParam, createError } from 'h3'
import { deleteServico } from '../../../services/servicosService'

export default defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, 'id')

    if (!id) {
      throw createError({
        statusCode: 400,
        message: 'ID do serviço é obrigatório'
      })
    }

    await deleteServico(id)

    return { success: true, message: 'Serviço deletado com sucesso' }
  } catch (error) {
    console.error('[API] Erro ao deletar serviço:', error)
    
    if (error.statusCode) {
      throw error
    }

    throw createError({
      statusCode: 500,
      message: error instanceof Error ? error.message : 'Erro ao deletar serviço'
    })
  }
})
