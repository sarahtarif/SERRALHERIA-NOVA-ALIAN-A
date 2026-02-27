import { defineEventHandler, readBody, createError } from 'h3'
import { createServico } from '../../../services/servicosService'
import type { ServicoFormData } from '~/types'

export default defineEventHandler(async (event) => {
  try {
    // Pegar usuário autenticado
    const user = event.context.user
    if (!user) {
      throw createError({
        statusCode: 401,
        message: 'Não autenticado'
      })
    }

    const body = await readBody<ServicoFormData>(event)

    // Validações básicas
    if (!body.nome || body.nome.length < 3) {
      throw createError({
        statusCode: 400,
        message: 'Nome do serviço deve ter no mínimo 3 caracteres'
      })
    }

    if (!body.categoria) {
      throw createError({
        statusCode: 400,
        message: 'Categoria é obrigatória'
      })
    }

    if (!body.tipo_servico) {
      throw createError({
        statusCode: 400,
        message: 'Tipo de serviço é obrigatório'
      })
    }

    const newServico = await createServico(body, user.id)

    return newServico
  } catch (error) {
    console.error('[API] Erro ao criar serviço:', error)
    
    if (error.statusCode) {
      throw error
    }

    throw createError({
      statusCode: 500,
      message: error instanceof Error ? error.message : 'Erro ao criar serviço'
    })
  }
})
