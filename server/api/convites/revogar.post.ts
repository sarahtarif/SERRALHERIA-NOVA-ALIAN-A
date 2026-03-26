import { createClient } from '@supabase/supabase-js'
import { defineEventHandler, readBody, createError, getHeader } from 'h3'

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
  if (!adminRow || !['super_admin', 'editor'].includes(adminRow.role)) {
    throw createError({ statusCode: 403, message: 'Acesso negado.' })
  }

  const body = await readBody<{ conviteId: string }>(event)
  if (!body?.conviteId) throw createError({ statusCode: 400, message: 'conviteId obrigatório.' })

  const { error } = await supabase
    .from('convites')
    .update({ usado: true })
    .eq('id', body.conviteId)
    .eq('usado', false)

  if (error) throw createError({ statusCode: 500, message: 'Erro ao revogar convite.' })

  return { ok: true }
})
