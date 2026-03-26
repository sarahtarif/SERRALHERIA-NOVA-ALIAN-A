import { createClient } from '@supabase/supabase-js'
import { defineEventHandler, getHeader, createError } from 'h3'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const supabaseUrl = config.public.supabaseUrl as string
  const serviceKey = config.supabaseServiceRoleKey as string
  const anonKey = config.public.supabaseAnonKey as string

  const token = getHeader(event, 'authorization')?.replace('Bearer ', '')
  if (!token) throw createError({ statusCode: 401, message: 'Não autorizado.' })

  const supabaseUser = createClient(supabaseUrl, anonKey, {
    auth: { autoRefreshToken: false, persistSession: false },
    global: { headers: { Authorization: 'Bearer ' + token } },
  })
  const { data: { user }, error: authErr } = await supabaseUser.auth.getUser()
  if (authErr || !user) throw createError({ statusCode: 401, message: 'Sessão inválida.' })

  const supabase = createClient(supabaseUrl, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  })

  const { data: adminRow } = await supabase.from('admins').select('role').eq('id', user.id).maybeSingle()
  if (!adminRow) throw createError({ statusCode: 403, message: 'Acesso negado.' })

  // super_admin vê todos, outros veem só as próprias
  let query = supabase
    .from('admin_sessions')
    .select('id, admin_id, admin_email, ip, device_type, browser, os, cidade, regiao, pais, logged_at')
    .order('logged_at', { ascending: false })
    .limit(100)

  if (adminRow.role !== 'super_admin') {
    query = query.eq('admin_id', user.id)
  }

  const { data, error } = await query
  if (error) throw createError({ statusCode: 500, message: error.message })

  return { sessoes: data ?? [] }
})
