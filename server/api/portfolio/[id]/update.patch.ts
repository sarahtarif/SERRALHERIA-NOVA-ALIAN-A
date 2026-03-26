import { createClient } from '@supabase/supabase-js'
import { defineEventHandler, getRouterParam, getHeader, readMultipartFormData, readBody, createError } from 'h3'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const supabaseUrl = config.public.supabaseUrl as string
  const serviceKey = config.supabaseServiceRoleKey as string
  const anonKey = config.public.supabaseAnonKey as string

  const authHeader = getHeader(event, 'authorization')
  const token = authHeader?.replace('Bearer ', '')
  if (!token) throw createError({ statusCode: 401, message: 'Não autorizado.' })

  const supabaseUser = createClient(supabaseUrl, anonKey, {
    auth: { autoRefreshToken: false, persistSession: false },
    global: { headers: { Authorization: 'Bearer ' + token } },
  })
  const { data: { user }, error: userErr } = await supabaseUser.auth.getUser()
  if (userErr || !user) throw createError({ statusCode: 401, message: 'Sessão inválida.' })

  const supabase = createClient(supabaseUrl, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  })
  const { data: adminRow } = await supabase.from('admins').select('role').eq('id', user.id).maybeSingle()
  if (!adminRow || !['super_admin', 'editor'].includes(adminRow.role)) {
    throw createError({ statusCode: 403, message: 'Acesso negado.' })
  }

  const id = getRouterParam(event, 'id')
  const contentType = getHeader(event, 'content-type') ?? ''

  const updates: Record<string, unknown> = {}

  if (contentType.includes('multipart/form-data')) {
    const parts = await readMultipartFormData(event)
    if (!parts) throw createError({ statusCode: 400, message: 'Dados inválidos.' })

    const get = (name: string) => parts.find(p => p.name === name)?.data?.toString() ?? ''
    const filePart = parts.find(p => p.name === 'file')

    if (get('title')) updates.title = get('title')
    if (get('description') !== undefined) updates.description = get('description') || null
    if (get('category')) updates.category = get('category')
    if (get('location') !== undefined) updates.location = get('location') || null
    if (get('aspect_ratio')) updates.aspect_ratio = get('aspect_ratio')
    if (get('show_on_home') !== '') updates.show_on_home = get('show_on_home') === 'true'

    if (filePart?.data) {
      updates.media_data = '\\x' + Buffer.from(filePart.data).toString('hex')
      updates.media_type = filePart.type ?? 'application/octet-stream'
      updates.media_name = filePart.filename ?? 'upload'
    }
  } else {
    const body = await readBody<Record<string, unknown>>(event)
    Object.assign(updates, body)
  }

  const { error } = await supabase.from('portfolio').update(updates).eq('id', id)
  if (error) throw createError({ statusCode: 500, message: error.message })

  return { ok: true }
})
