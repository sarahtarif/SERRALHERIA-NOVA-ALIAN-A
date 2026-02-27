import { defineEventHandler, getRouterParam, createError } from 'h3'
import { getServicoById } from '../../../services/servicosService'

export default defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, 'id')

    if (!id) {
      throw createError({
        statusCode: 400,
        message: 'ID do serviço é obrigatório'
      })
    }

    const servico = await getServicoById(id)

    return servico
  } catch (error) {
    console.error('[API] Erro ao buscar serviço:', error)
    
    if (error.statusCode) {
      throw error
    }

    throw createError({
      statusCode: 500,
      message: error instanceof Error ? error.message : 'Erro ao buscar serviço'
    })
  }
})
