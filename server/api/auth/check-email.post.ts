import { createClient } from '@supabase/supabase-js'
import { defineEventHandler, readBody, createError } from 'h3'

const SUPABASE_URL = 'https://lfznsbvruvjnugyzfyiw.supabase.co'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const SUPABASE_SECRET_KEY = config.supabaseServiceRoleKey as string
  const { email } = await readBody<{ email: string }>(event)

  if (!email) {
    throw createError({ statusCode: 400, message: 'Email obrigatório' })
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_SECRET_KEY, {
    auth: { autoRefreshToken: false, persistSession: false },
  })

  const { data, error } = await supabase
    .from('users')
    .select('id')
    .eq('email', email.toLowerCase())
    .maybeSingle()

  if (error) {
    console.error('[check-email] Supabase error:', error.message)
    throw createError({ statusCode: 500, message: `Erro ao verificar email: ${error.message}` })
  }

  return { exists: data !== null }
})
