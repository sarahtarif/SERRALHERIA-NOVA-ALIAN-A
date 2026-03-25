import { createClient } from '@supabase/supabase-js'
import { defineEventHandler, createError } from 'h3'

export default defineEventHandler(async () => {
  const config = useRuntimeConfig()
  const SUPABASE_URL = config.public.supabaseUrl as string
  const SUPABASE_SECRET_KEY = config.supabaseServiceRoleKey as string

  const supabase = createClient(SUPABASE_URL, SUPABASE_SECRET_KEY, {
    auth: { autoRefreshToken: false, persistSession: false },
  })

  const { data, error } = await supabase
    .from('portfolio')
    .select('id, title, description, category, location, media_type, media_name, show_on_home, aspect_ratio, created_at')
    .eq('show_on_home', true)
    .not('media_data', 'is', null)
    .order('created_at', { ascending: false })

  if (error) {
    throw createError({ statusCode: 500, message: error.message })
  }

  return { data: data ?? [] }
})
