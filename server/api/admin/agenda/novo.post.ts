import { defineEventHandler, readBody, createError } from 'h3'
import { createAgendaItem, checkAgendaConflicts } from '../../../services/agendaService'
import type { AgendaItemFormData } from '~/types'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody<AgendaItemFormData>(event)

    // Validações básicas
    if (!body.servico_id) {
      throw createError({
        statusCode: 400,
        message: 'ID do serviço é obrigatório'
      })
    }

    if (!body.data) {
      throw createError({
        statusCode: 400,
        message: 'Data é obrigatória'
      })
    }

    if (!body.hora_inicio) {
      throw createError({
        statusCode: 400,
        message: 'Hora de início é obrigatória'
      })
    }

    // Verificar conflitos se hora_fim foi fornecida
    if (body.hora_fim && body.tecnico_id) {
      const hasConflict = await checkAgendaConflicts(
        body.data,
        body.hora_inicio,
        body.hora_fim,
        body.tecnico_id
      )

      if (hasConflict) {
        throw createError({
          statusCode: 409,
          message: 'Conflito de horário detectado para este técnico'
        })
      }
    }

    const newItem = await createAgendaItem(body)

    return newItem
  } catch (error) {
    console.error('[API] Erro ao criar item na agenda:', error)
    
    if (error.statusCode) {
      throw error
    }

    throw createError({
      statusCode: 500,
      message: error instanceof Error ? error.message : 'Erro ao criar item na agenda'
    })
  }
})
