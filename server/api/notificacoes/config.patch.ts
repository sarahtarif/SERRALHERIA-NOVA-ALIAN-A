import { createClient } from '@supabase/supabase-js'
import { defineEventHandler, getHeader, readBody, createError } from 'h3'

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

  const { data: adminRow } = await supabase.from('admins').select('role').eq('id', user.id).maybeSingle()
  if (!adminRow || !['super_admin', 'editor'].includes(adminRow.role)) {
    console.warn('[notificacoes/config.patch] Acesso negado para user:', user.id, '| role:', adminRow?.role)
    throw createError({ statusCode: 403, message: 'Acesso negado.' })
  }

  const body = await readBody<{
    dias_antes: number[]
    horarios_envio: string[]
    emails_admin: string[]
    notificar_cliente: boolean
    ativo: boolean
    gmail_user: string
    gmail_pass?: string
  }>(event)

  if (!body.emails_admin?.length) {
    throw createError({ statusCode: 400, message: 'Pelo menos um email de admin é obrigatório.' })
  }

  const updates: Record<string, unknown> = {
    dias_antes: body.dias_antes,
    horarios_envio: body.horarios_envio,
    emails_admin: body.emails_admin,
    notificar_cliente: body.notificar_cliente,
    ativo: body.ativo,
    gmail_user: body.gmail_user,
    updated_at: new Date().toISOString(),
  }

  // Só atualiza a senha se foi fornecida (não é placeholder)
  if (body.gmail_pass && body.gmail_pass !== '••••••••') {
    updates.gmail_pass = body.gmail_pass
  }

  const { error: errUpdate } = await supabase
    .from('notification_config')
    .update(updates)
    .eq('id', '00000000-0000-0000-0000-000000000001')

  if (errUpdate) throw createError({ statusCode: 500, message: errUpdate.message })

  console.info('[notificacoes/config.patch] Config salva por:', user.email, '| gmail_user:', body.gmail_user, '| emails_admin:', body.emails_admin)
  return { ok: true }
})
