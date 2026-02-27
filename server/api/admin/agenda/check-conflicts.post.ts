import { defineEventHandler, readBody, createError } from 'h3'
import { checkAgendaConflicts } from '../../../services/agendaService'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)

    if (!body.data || !body.hora_inicio || !body.hora_fim) {
      throw createError({
        statusCode: 400,
        message: 'Data, hora_inicio e hora_fim são obrigatórios'
      })
    }

    const hasConflict = await checkAgendaConflicts(
      body.data,
      body.hora_inicio,
      body.hora_fim,
      body.tecnico_id,
      body.excludeId
    )

    return { hasConflict }
  } catch (error) {
    console.error('[API] Erro ao verificar conflitos:', error)
    
    if (error.statusCode) {
      throw error
    }

    throw createError({
      statusCode: 500,
      message: error instanceof Error ? error.message : 'Erro ao verificar conflitos'
    })
  }
})
