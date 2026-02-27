import { defineEventHandler, getRouterParam, readBody, createError } from 'h3'
import { updateServico } from '../../../services/servicosService'
import type { ServicoFormData } from '~/types'

export default defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, 'id')

    if (!id) {
      throw createError({
        statusCode: 400,
        message: 'ID do serviço é obrigatório'
      })
    }

    const body = await readBody<Partial<ServicoFormData>>(event)

    // Validações
    if (body.nome && body.nome.length < 3) {
      throw createError({
        statusCode: 400,
        message: 'Nome do serviço deve ter no mínimo 3 caracteres'
      })
    }

    const updated = await updateServico(id, body)

    return updated
  } catch (error) {
    console.error('[API] Erro ao atualizar serviço:', error)
    
    if (error.statusCode) {
      throw error
    }

    throw createError({
      statusCode: 500,
      message: error instanceof Error ? error.message : 'Erro ao atualizar serviço'
    })
  }
})
