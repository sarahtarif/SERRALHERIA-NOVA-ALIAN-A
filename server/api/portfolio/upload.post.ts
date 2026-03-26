import { createClient } from '@supabase/supabase-js'
import { defineEventHandler, readMultipartFormData, getHeader, createError } from 'h3'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const supabaseUrl = config.public.supabaseUrl as string
  const serviceKey = config.supabaseServiceRoleKey as string
  const anonKey = config.public.supabaseAnonKey as string

  const authHeader = getHeader(event, 'authorization')
  const token = authHeader?.replace('Bearer ', '')
  if (!token) throw createError({ statusCode: 401, message: 'Não autorizado.' })

  // Valida o usuário
  const supabaseUser = createClient(supabaseUrl, anonKey, {
    auth: { autoRefreshToken: false, persistSession: false },
    global: { headers: { Authorization: 'Bearer ' + token } },
  })
  const { data: { user }, error: userErr } = await supabaseUser.auth.getUser()
  if (userErr || !user) throw createError({ statusCode: 401, message: 'Sessão inválida.' })

  // Verifica se é admin
  const supabase = createClient(supabaseUrl, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  })
  const { data: adminRow } = await supabase.from('admins').select('role').eq('id', user.id).maybeSingle()
  if (!adminRow) throw createError({ statusCode: 403, message: 'Acesso negado.' })

  const parts = await readMultipartFormData(event)
  if (!parts) throw createError({ statusCode: 400, message: 'Dados inválidos.' })

  const get = (name: string) => parts.find(p => p.name === name)?.data?.toString() ?? ''
  const filePart = parts.find(p => p.name === 'file')

  if (!filePart?.data) throw createError({ statusCode: 400, message: 'Arquivo obrigatório.' })

  const title = get('title')
  const description = get('description')
  const category = get('category') || 'portoes'
  const location = get('location')
  const showOnHome = get('show_on_home') === 'true'
  const aspectRatio = get('aspect_ratio') || '9/16'
  const mediaType = filePart.type ?? 'application/octet-stream'
  const mediaName = filePart.filename ?? 'upload'

  if (!title) throw createError({ statusCode: 400, message: 'Título obrigatório.' })

  // Converte buffer para base64 para armazenar como bytea via hex
  const hex = '\\x' + Buffer.from(filePart.data).toString('hex')

  const { data, error } = await supabase.from('portfolio').insert({
    title,
    description: description || null,
    category,
    location: location || null,
    media_type: mediaType,
    media_name: mediaName,
    media_data: hex,
    show_on_home: showOnHome,
    aspect_ratio: aspectRatio,
  }).select('id').single()

  if (error) throw createError({ statusCode: 500, message: error.message })

  return { ok: true, id: data.id }
})
