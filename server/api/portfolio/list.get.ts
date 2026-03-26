import { createClient } from '@supabase/supabase-js'
import { defineEventHandler, createError } from 'h3'

export default defineEventHandler(async () => {
  const config = useRuntimeConfig()
  const supabase = createClient(config.public.supabaseUrl as string, config.supabaseServiceRoleKey as string, {
    auth: { autoRefreshToken: false, persistSession: false },
  })

  const { data, error } = await supabase.rpc('get_portfolio_all')
  if (error) throw createError({ statusCode: 500, message: error.message })

  return { data: data ?? [] }
})
