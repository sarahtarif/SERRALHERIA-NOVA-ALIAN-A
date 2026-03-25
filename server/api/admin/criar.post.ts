import { createClient } from '@supabase/supabase-js'
import { defineEventHandler, readBody, createError } from 'h3'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const SUPABASE_URL = config.public.supabaseUrl as string
  const SUPABASE_SECRET_KEY = config.supabaseServiceRoleKey as string

  const { email, password, role } = await readBody<{
    email: string
    password: string
    role: string
  }>(event)

  if (!email || !password || !role) {
    throw createError({ statusCode: 400, message: 'email, password e role são obrigatórios.' })
  }

  const rolesValidos = ['super_admin', 'editor', 'viewer']
  if (!rolesValidos.includes(role)) {
    throw createError({ statusCode: 400, message: 'Role inválido.' })
  }

  if (password.length < 8) {
    throw createError({ statusCode: 400, message: 'A senha deve ter pelo menos 8 caracteres.' })
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_SECRET_KEY, {
    auth: { autoRefreshToken: false, persistSession: false },
  })

  const emailNorm = email.toLowerCase().trim()

  // Verifica se já existe na tabela users (cliente) — não pode virar admin
  const { data: clienteExistente } = await supabase
    .from('users')
    .select('id')
    .eq('email', emailNorm)
    .maybeSingle()

  if (clienteExistente) {
    throw createError({ statusCode: 409, message: 'Este e-mail já está cadastrado como cliente e não pode ser usado como admin.' })
  }

  // Verifica se já existe na tabela admins
  const { data: adminExistente } = await supabase
    .from('admins')
    .select('id')
    .eq('email', emailNorm)
    .maybeSingle()

  if (adminExistente) {
    throw createError({ statusCode: 409, message: 'Este e-mail já está cadastrado como administrador.' })
  }

  // Tenta buscar usuário órfão no Auth (criado em tentativa anterior com falha)
  const { data: listaUsers, error: listError } = await supabase.auth.admin.listUsers()
  console.log('[criar-admin] listUsers error:', listError)
  console.log('[criar-admin] total users:', listaUsers?.users?.length)
  const usuarioOrfao = listaUsers?.users?.find(u => u.email === emailNorm)
  console.log('[criar-admin] usuarioOrfao:', usuarioOrfao?.id ?? 'nenhum')

  let userId: string

  if (usuarioOrfao) {
    // Reusa o usuário Auth já existente — apenas atualiza a senha
    const { error: updateErr } = await supabase.auth.admin.updateUserById(usuarioOrfao.id, { password })
    console.log('[criar-admin] updateUserById error:', updateErr)
    userId = usuarioOrfao.id
  } else {
    // Cria novo usuário no Auth
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: emailNorm,
      password,
      email_confirm: true,
    })
    console.log('[criar-admin] createUser error:', authError)

    if (authError || !authData.user) {
      throw createError({ statusCode: 500, message: authError?.message ?? 'Erro ao criar usuário.' })
    }

    userId = authData.user.id
  }

  console.log('[criar-admin] userId:', userId)

  // Insere na tabela admins
  const { error: dbError } = await supabase
    .from('admins')
    .insert({ id: userId, role, email: emailNorm })

  console.log('[criar-admin] insert admins error:', dbError)

  if (dbError) {
    // Se o usuário foi criado agora (não era órfão), faz rollback completo
    if (!usuarioOrfao) {
      await supabase.auth.admin.deleteUser(userId)
      // Remove também da tabela users caso o trigger on_auth_user_created tenha inserido
      await supabase.from('users').delete().eq('id', userId)
    }
    const msg = dbError.code === 'P0001'
      ? dbError.message
      : `Erro ao salvar admin: ${dbError.message}`
    throw createError({ statusCode: 409, message: msg })
  }

  return { id: userId, email: emailNorm, role }
})
