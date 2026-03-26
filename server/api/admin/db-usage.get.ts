import { createClient } from '@supabase/supabase-js'
import { defineEventHandler, createError, getHeader } from 'h3'

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

  // Total do banco
  const { data: dbTotal } = await supabase.rpc('get_db_total_size')

  // Tamanho por tabela
  const { data: tables } = await supabase.rpc('get_tables_size')

  return {
    dbTotalBytes: Number(dbTotal ?? 0),
    tables: (tables ?? []) as Array<{
      tablename: string
      total_bytes: number
      table_bytes: number
      index_bytes: number
      row_count: number
    }>,
  }
})
