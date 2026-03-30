import { getHeader, createError } from 'h3'
import type { H3Event } from 'h3'

export async function requireCronAuth(event: H3Event): Promise<void> {
  const authHeader = getHeader(event, 'authorization')
  const cronSecret = process.env.CRON_SECRET

  if (cronSecret) {
    if (!authHeader || authHeader.replace('Bearer ', '') !== cronSecret) {
      throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
    }
    return
  }

  if (process.env.NODE_ENV === 'development') return

  throw createError({ statusCode: 403, statusMessage: 'Configure CRON_SECRET' })
}
