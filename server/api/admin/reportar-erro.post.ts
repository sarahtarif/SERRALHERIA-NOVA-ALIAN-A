import { defineEventHandler, readBody, createError, getHeader } from 'h3'
import { createClient } from '@supabase/supabase-js'
import nodemailer from 'nodemailer'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()

  // Valida sessão admin
  const authHeader = getHeader(event, 'authorization') ?? ''
  const token = authHeader.replace('Bearer ', '')
  if (!token) throw createError({ statusCode: 401, message: 'Não autorizado.' })

  const supabaseUser = createClient(
    config.public.supabaseUrl as string,
    config.public.supabaseAnonKey as string,
    { auth: { autoRefreshToken: false, persistSession: false }, global: { headers: { Authorization: 'Bearer ' + token } } }
  )
  const { data: { user }, error } = await supabaseUser.auth.getUser()
  if (error || !user) throw createError({ statusCode: 401, message: 'Sessão inválida.' })

  const body = await readBody<{ aba: string; mensagem: string }>(event)
  if (!body?.mensagem?.trim()) throw createError({ statusCode: 400, message: 'Mensagem obrigatória.' })

  const gmailUser = config.emailUser as string
  const gmailPass = config.emailPass as string

  if (!gmailUser || !gmailPass) {
    console.warn('[reportar-erro] Credenciais Gmail não configuradas')
    throw createError({ statusCode: 500, message: 'Configuração de email ausente no servidor.' })
  }

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: { user: gmailUser, pass: gmailPass },
  })

  await transporter.sendMail({
    from: '"Painel Nova Aliança" <' + gmailUser + '>',
    to: 'samuel.tarif@gmail.com',
    subject: '[Erro no Painel] ' + (body.aba ?? 'desconhecida'),
    html: `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto;">
        <h2 style="color:#ef4444;">🚨 Erro reportado no painel</h2>
        <p><strong>Aba:</strong> ${body.aba ?? 'desconhecida'}</p>
        <p><strong>Reportado por:</strong> ${user.email}</p>
        <hr style="border:none;border-top:1px solid #e2e8f0;margin:16px 0;" />
        <p><strong>Descrição:</strong></p>
        <p style="background:#f8fafc;padding:12px;border-radius:8px;white-space:pre-wrap;">${body.mensagem.trim()}</p>
      </div>
    `,
  })

  console.info('[reportar-erro] Email enviado por:', user.email, '| Aba:', body.aba)
  return { ok: true }
})
