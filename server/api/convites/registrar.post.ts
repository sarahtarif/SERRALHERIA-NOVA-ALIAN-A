import { createClient } from '@supabase/supabase-js'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const SUPABASE_URL = config.public.supabaseUrl as string
  const SUPABASE_SECRET_KEY = config.supabaseServiceRoleKey as string

  const { token, email, password, nome } = await readBody(event)

  if (!token || !email || !password) {
    throw createError({ statusCode: 400, message: 'token, email e password são obrigatórios' })
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_SECRET_KEY, {
    auth: { autoRefreshToken: false, persistSession: false },
  })

  // Valida o token
  const { data: convite, error: errConvite } = await supabase
    .from('convites')
    .select('id, cliente_avulso_id, usado, expires_at')
    .eq('token', token)
    .single()

  if (errConvite || !convite) {
    throw createError({ statusCode: 404, message: 'Link inválido ou expirado.' })
  }
  if (convite.usado) {
    throw createError({ statusCode: 410, message: 'Este link já foi utilizado.' })
  }
  if (new Date(convite.expires_at) < new Date()) {
    throw createError({ statusCode: 410, message: 'Este link expirou. Solicite um novo ao atendimento.' })
  }

  // Cria o usuário no Supabase Auth
  const { data: authData, error: errAuth } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true, // confirma automaticamente — sem precisar de e-mail de verificação
  })

  if (errAuth || !authData.user) {
    if (errAuth?.message?.includes('already registered')) {
      throw createError({ statusCode: 409, message: 'Este e-mail já possui cadastro. Faça login normalmente.' })
    }
    throw createError({ statusCode: 500, message: 'Erro ao criar conta.' })
  }

  const userId = authData.user.id

  // Cria o perfil na tabela users
  await supabase.from('users').insert({
    id: userId,
    email,
    full_name: nome || null,
  })

  // Vincula o cliente avulso ao novo user_id
  await supabase
    .from('clientes_avulsos')
    .update({ user_id: userId, email })
    .eq('id', convite.cliente_avulso_id)

  // Vincula agendamentos do cliente avulso ao user_id
  await supabase
    .from('agendamentos')
    .update({ user_id: userId })
    .eq('cliente_avulso_id', convite.cliente_avulso_id)
    .is('user_id', null)

  // Marca convite como usado
  await supabase
    .from('convites')
    .update({ usado: true })
    .eq('id', convite.id)

  return { ok: true }
})
