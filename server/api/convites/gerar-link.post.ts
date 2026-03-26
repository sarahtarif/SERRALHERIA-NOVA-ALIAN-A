import { createClient } from '@supabase/supabase-js'
import { defineEventHandler, readBody, createError, getHeader } from 'h3'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const supabaseUrl = config.public.supabaseUrl as string
  const serviceKey = config.supabaseServiceRoleKey as string
  const anonKey = config.public.supabaseAnonKey as string

  // Valida sessão admin
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

  const body = await readBody<{ nome: string; email: string }>(event)
  if (!body?.nome?.trim() || !body?.email?.trim()) {
    throw createError({ statusCode: 400, message: 'Nome e email são obrigatórios.' })
  }

  const emailNorm = body.email.toLowerCase().trim()

  // Verifica conflitos
  const { data: jaCliente } = await supabase.from('users').select('id').eq('email', emailNorm).maybeSingle()
  if (jaCliente) throw createError({ statusCode: 409, message: 'Este email já possui cadastro ativo.' })

  const { data: jaAdmin } = await supabase.from('admins').select('id').eq('email', emailNorm).maybeSingle()
  if (jaAdmin) throw createError({ statusCode: 409, message: 'Este email pertence a um administrador.' })

  // Cria ou reutiliza cliente avulso
  let clienteAvulsoId: string
  const { data: avulsoExistente } = await supabase
    .from('clientes_avulsos')
    .select('id')
    .eq('email', emailNorm)
    .is('user_id', null)
    .maybeSingle()

  if (avulsoExistente) {
    clienteAvulsoId = avulsoExistente.id
    await supabase.from('clientes_avulsos').update({ nome: body.nome.trim() }).eq('id', clienteAvulsoId)
  } else {
    const { data: novoAvulso, error: errAvulso } = await supabase
      .from('clientes_avulsos')
      .insert({ nome: body.nome.trim(), email: emailNorm })
      .select('id')
      .single()
    if (errAvulso || !novoAvulso) throw createError({ statusCode: 500, message: 'Erro ao criar cadastro.' })
    clienteAvulsoId = novoAvulso.id
  }

  // Invalida convites anteriores e gera novo
  await supabase.from('convites').update({ usado: true }).eq('cliente_avulso_id', clienteAvulsoId).eq('usado', false)

  const { data: convite, error: errConvite } = await supabase
    .from('convites')
    .insert({ cliente_avulso_id: clienteAvulsoId, created_by: user.id })
    .select('token')
    .single()

  if (errConvite || !convite) throw createError({ statusCode: 500, message: 'Erro ao gerar convite.' })

  const baseUrl = (config.public as Record<string, string>).siteUrl ?? 'https://novalianca.vercel.app'
  const link = baseUrl + '/convite?token=' + convite.token

  return { ok: true, link, token: convite.token }
})
