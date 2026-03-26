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

  const { data, error } = await supabase
    .from('convites')
    .select('id, token, usado, expires_at, created_at, clientes_avulsos(id, nome, email, user_id)')
    .order('created_at', { ascending: false })
    .limit(100)

  if (error) throw createError({ statusCode: 500, message: 'Erro ao listar convites.' })

  // Calcula status derivado
  const now = new Date()
  const convites = (data ?? []).map((c: {
    id: string
    token: string
    usado: boolean
    expires_at: string
    created_at: string
    clientes_avulsos: { id: string; nome: string; email: string | null; user_id: string | null } | null
  }) => {
    let status: 'pendente' | 'aceito' | 'expirado'
    if (c.usado || c.clientes_avulsos?.user_id) {
      status = 'aceito'
    } else if (new Date(c.expires_at) < now) {
      status = 'expirado'
    } else {
      status = 'pendente'
    }
    return { ...c, status }
  })

  return { convites }
})
