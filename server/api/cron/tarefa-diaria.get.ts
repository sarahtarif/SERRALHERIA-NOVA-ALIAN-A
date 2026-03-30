import { defineEventHandler } from 'h3'
import { createClient } from '@supabase/supabase-js'
import { requireCronAuth } from '../../utils/cronMiddleware'

export default defineEventHandler(async (event) => {
  await requireCronAuth(event)

  const supabase = createClient(
    process.env.NUXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SECRET_KEY!
  )

  const { data, error } = await supabase.rpc('incrementar_keepalive')

  if (error) {
    throw createError({ statusCode: 500, statusMessage: error.message })
  }

  return {
    success: true,
    contador: data,
    executado_em: new Date().toISOString(),
  }
})
