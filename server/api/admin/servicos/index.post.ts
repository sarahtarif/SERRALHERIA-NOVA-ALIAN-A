import { createClient } from '@supabase/supabase-js'
import { defineEventHandler, getHeader, readBody, createError } from 'h3'

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

  const body = await readBody<{ nome: string; descricao?: string; ativo?: boolean }>(event)
  if (!body?.nome?.trim()) throw createError({ statusCode: 400, message: 'Nome é obrigatório.' })

  const { data, error } = await supabase
    .from('servicos_catalogo')
    .insert({ nome: body.nome.trim(), descricao: body.descricao?.trim() || null, ativo: body.ativo ?? true })
    .select()
    .single()

  if (error) throw createError({ statusCode: 500, message: error.message })
  return { servico: data }
})
