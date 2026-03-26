import { createClient } from '@supabase/supabase-js'
import { defineEventHandler, getHeader, createError } from 'h3'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const anonKey = config.public.supabaseAnonKey as string
  const serviceKey = config.supabaseServiceRoleKey as string
  const supabaseUrl = config.public.supabaseUrl as string

  const token = getHeader(event, 'authorization')?.replace('Bearer ', '')
  if (!token) throw createError({ statusCode: 401, message: 'Não autorizado.' })

  const supabaseUser = createClient(supabaseUrl, anonKey, {
    auth: { autoRefreshToken: false, persistSession: false },
    global: { headers: { Authorization: 'Bearer ' + token } },
  })
  const { data: { user }, error } = await supabaseUser.auth.getUser()
  if (error || !user) throw createError({ statusCode: 401, message: 'Sessão inválida.' })

  const supabase = createClient(supabaseUrl, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  })

  const { data } = await supabase
    .from('notification_config')
    .select('*')
    .eq('id', '00000000-0000-0000-0000-000000000001')
    .single()

  // Não expõe a senha do gmail
  if (data) {
    data.gmail_pass = data.gmail_pass ? '••••••••' : ''
  }

  return { data }
})
