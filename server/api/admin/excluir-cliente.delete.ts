import { createClient } from '@supabase/supabase-js'
import { defineEventHandler, getQuery, getHeader, createError } from 'h3'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const SUPABASE_URL = config.public.supabaseUrl as string
  const SUPABASE_SECRET_KEY = config.supabaseServiceRoleKey as string

  const { id } = getQuery(event) as { id?: string }

  if (!id) {
    throw createError({ statusCode: 400, message: 'id do cliente é obrigatório.' })
  }

  // Verifica se o chamador é um super_admin
  const authHeader = getHeader(event, 'authorization')
  const token = authHeader?.replace('Bearer ', '')
  if (!token) throw createError({ statusCode: 401, message: 'Não autorizado.' })

  const supabase = createClient(SUPABASE_URL, SUPABASE_SECRET_KEY, {
    auth: { autoRefreshToken: false, persistSession: false },
  })

  const { data: { user } } = await supabase.auth.getUser(token)
  if (!user) throw createError({ statusCode: 401, message: 'Token inválido.' })

  const { data: adminRow } = await supabase
    .from('admins')
    .select('role')
    .eq('id', user.id)
    .maybeSingle()

  if (!adminRow || adminRow.role !== 'super_admin') {
    throw createError({ statusCode: 403, message: 'Apenas super_admin pode excluir clientes.' })
  }

  // Remove da tabela users (RLS não se aplica com service role)
  const { error: dbError } = await supabase.from('users').delete().eq('id', id)
  if (dbError) {
    throw createError({ statusCode: 500, message: `Erro ao remover cliente: ${dbError.message}` })
  }

  // Remove do Auth para impedir relogin
  const { error: authError } = await supabase.auth.admin.deleteUser(id)
  if (authError) {
    console.warn('[excluir-cliente] auth.admin.deleteUser error:', authError.message)
    // Não falha — o registro da tabela já foi removido
  }

  return { ok: true }
})
