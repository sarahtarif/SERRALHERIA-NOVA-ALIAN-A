import { createClient } from '@supabase/supabase-js'
import { defineEventHandler, readBody, createError, getHeader } from 'h3'
import nodemailer from 'nodemailer'

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

  const { adminRow } = await supabase.from('admins').select('role').eq('id', user.id).maybeSingle().then(r => ({ adminRow: r.data }))
  if (!adminRow || !['super_admin', 'editor'].includes(adminRow.role)) {
    throw createError({ statusCode: 403, message: 'Acesso negado.' })
  }

  const body = await readBody<{ nome: string; email: string }>(event)
  if (!body?.nome?.trim() || !body?.email?.trim()) {
    throw createError({ statusCode: 400, message: 'Nome e email são obrigatórios.' })
  }

  const emailNorm = body.email.toLowerCase().trim()

  // Verifica se já é cliente registrado
  const { data: jaCliente } = await supabase.from('users').select('id').eq('email', emailNorm).maybeSingle()
  if (jaCliente) throw createError({ statusCode: 409, message: 'Este email já possui cadastro ativo.' })

  // Verifica se já é admin
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
    // Atualiza nome se mudou
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
    .insert({ cliente_avulso_id: clienteAvulsoId })
    .select('token')
    .single()

  if (errConvite || !convite) throw createError({ statusCode: 500, message: 'Erro ao gerar convite.' })

  // Monta link
  const baseUrl = (config.public as Record<string, string>).siteUrl ?? 'https://novalianca.vercel.app'
  const link = baseUrl + '/convite?token=' + convite.token

  // Envia email
  const gmailUser = config.emailUser as string
  const gmailPass = config.emailPass as string

  if (!gmailUser || !gmailPass) {
    console.warn('[convites/enviar-email] Credenciais Gmail não configuradas — retornando link sem enviar email')
    return { ok: true, link, emailEnviado: false }
  }

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: { user: gmailUser, pass: gmailPass },
  })

  await transporter.sendMail({
    from: '"Nova Aliança Serralheria" <' + gmailUser + '>',
    to: emailNorm,
    subject: 'Seu acesso ao portal Nova Aliança',
    html: `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:24px;">
        <h2 style="color:#6366f1;">Olá, ${body.nome.trim()}!</h2>
        <p style="color:#374151;">Você foi cadastrado no portal de clientes da <strong>Nova Aliança Serralheria</strong>.</p>
        <p style="color:#374151;">Clique no botão abaixo para criar sua senha e acessar sua área exclusiva:</p>
        <div style="text-align:center;margin:32px 0;">
          <a href="${link}" style="background:#6366f1;color:#fff;padding:14px 32px;border-radius:8px;text-decoration:none;font-weight:600;font-size:16px;">
            Concluir meu cadastro
          </a>
        </div>
        <p style="color:#6b7280;font-size:13px;">Este link é válido por 7 dias. Se não solicitou este acesso, ignore este email.</p>
        <hr style="border:none;border-top:1px solid #e5e7eb;margin:24px 0;" />
        <p style="color:#9ca3af;font-size:12px;">Nova Aliança Serralheria — São Paulo, SP</p>
      </div>
    `,
  })

  console.info('[convites/enviar-email] Convite enviado para:', emailNorm, '| cliente_avulso_id:', clienteAvulsoId)
  return { ok: true, link, emailEnviado: true }
})
