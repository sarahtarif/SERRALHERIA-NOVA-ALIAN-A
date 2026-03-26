import { createClient } from '@supabase/supabase-js'
import { defineEventHandler, getHeader, createError } from 'h3'
import nodemailer from 'nodemailer'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const serviceKey = config.supabaseServiceRoleKey as string
  const supabaseUrl = config.public.supabaseUrl as string

  // Aceita chamada autenticada (admin) ou token interno
  const authHeader = getHeader(event, 'authorization') ?? ''
  const expectedToken = 'Bearer internal-job-' + (config.supabaseServiceRoleKey as string).slice(-8)
  const isInternal = authHeader === expectedToken

  if (!authHeader) {
    console.warn('[notificacoes/disparar] Requisição sem header Authorization')
    throw createError({ statusCode: 401, message: 'Não autorizado.' })
  }

  if (!isInternal) {
    const anonKey = config.public.supabaseAnonKey as string
    const supabaseUser = createClient(supabaseUrl, anonKey, {
      auth: { autoRefreshToken: false, persistSession: false },
      global: { headers: { Authorization: authHeader } },
    })
    const { data: { user }, error } = await supabaseUser.auth.getUser()
    if (error || !user) {
      console.warn('[notificacoes/disparar] Token inválido ou expirado:', error?.message)
      throw createError({ statusCode: 401, message: 'Não autorizado.' })
    }
    console.info('[notificacoes/disparar] Disparo manual por usuário:', user.email)
  } else {
    console.info('[notificacoes/disparar] Disparo via cron job interno')
  }

  const supabase = createClient(supabaseUrl, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  })

  // Busca configuração
  const { data: cfg } = await supabase
    .from('notification_config')
    .select('*')
    .eq('id', '00000000-0000-0000-0000-000000000001')
    .single()

  if (!cfg || !cfg.ativo || !cfg.emails_admin?.length || !cfg.gmail_user || !cfg.gmail_pass) {
    const motivo = !cfg ? 'config não encontrada' : !cfg.ativo ? 'desativado' : !cfg.emails_admin?.length ? 'sem emails_admin' : 'sem credenciais gmail'
    console.warn('[notificacoes/disparar] Configuração incompleta:', motivo)
    return { ok: false, message: 'Configuração incompleta ou desativada.' }
  }

  // Verifica se o horário atual bate com algum horário configurado (tolerância de 10 min)
  const agora = new Date()
  const horaAtual = agora.getHours().toString().padStart(2, '0') + ':' + agora.getMinutes().toString().padStart(2, '0')
  const horariosBatendo = (cfg.horarios_envio as string[]).some(h => {
    const [hh, mm] = h.split(':').map(Number)
    const diffMin = Math.abs((agora.getHours() * 60 + agora.getMinutes()) - (hh * 60 + mm))
    return diffMin <= 10
  })

  // Se chamado internamente pelo cron, respeita os horários configurados
  // Se chamado manualmente pelo admin, ignora a verificação de horário
  if (isInternal && !horariosBatendo) {
    console.info('[notificacoes/disparar] Cron fora do horário configurado. Hora atual:', horaAtual, '| Horários:', (cfg.horarios_envio as string[]).join(', '))
    return { ok: false, message: 'Fora do horário configurado (' + horaAtual + '). Horários: ' + (cfg.horarios_envio as string[]).join(', ') }
  }

  const hoje = new Date()
  hoje.setHours(0, 0, 0, 0)

  // Busca agendamentos nos próximos N dias
  const maxDias = Math.max(...(cfg.dias_antes as number[]))
  const dataLimite = new Date(hoje)
  dataLimite.setDate(dataLimite.getDate() + maxDias)

  const { data: agendamentos } = await supabase
    .from('agendamentos')
    .select(`
      id, titulo, descricao, data_servico, horario, status,
      clientes_avulsos(nome, email, telefone),
      users(full_name, email),
      servicos_catalogo(nome)
    `)
    .in('status', ['agendado', 'em_andamento'])
    .gte('data_servico', hoje.toISOString().split('T')[0])
    .lte('data_servico', dataLimite.toISOString().split('T')[0])
    .order('data_servico', { ascending: true })

  if (!agendamentos?.length) {
    return { ok: true, enviados: 0, message: 'Nenhum agendamento próximo.' }
  }

  // Filtra apenas os que estão nos dias configurados
  const agendamentosFiltrados = agendamentos.filter(ag => {
    const dataAg = new Date(ag.data_servico + 'T00:00:00')
    const diffDias = Math.round((dataAg.getTime() - hoje.getTime()) / (1000 * 60 * 60 * 24))
    return (cfg.dias_antes as number[]).includes(diffDias)
  })

  if (!agendamentosFiltrados.length) {
    return { ok: true, enviados: 0, message: 'Nenhum agendamento nos dias configurados.' }
  }

  // Configura transporter
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: { user: cfg.gmail_user, pass: cfg.gmail_pass },
  })

  console.info('[notificacoes/disparar] Iniciando envio para', agendamentosFiltrados.length, 'agendamento(s)')

  const formatDate = (d: string) =>
    new Intl.DateTimeFormat('pt-BR').format(new Date(d + 'T00:00:00'))

  let enviados = 0

  for (const ag of agendamentosFiltrados) {
    const dataAg = new Date(ag.data_servico + 'T00:00:00')
    const diffDias = Math.round((dataAg.getTime() - hoje.getTime()) / (1000 * 60 * 60 * 24))
    const clienteNome = (ag.clientes_avulsos as { nome?: string } | null)?.nome
      ?? (ag.users as { full_name?: string | null } | null)?.full_name
      ?? 'Cliente'
    const clienteEmail = (ag.clientes_avulsos as { email?: string | null } | null)?.email
      ?? (ag.users as { email?: string } | null)?.email
      ?? null
    const servicoNome = (ag.servicos_catalogo as { nome?: string } | null)?.nome ?? ''

    const diasTexto = diffDias === 0 ? 'HOJE' : diffDias === 1 ? 'amanhã' : `em ${diffDias} dias`
    const assunto = `Lembrete: Agendamento ${diasTexto} — ${ag.titulo}`

    const htmlAdmin = `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto;">
        <h2 style="color:#f5a623;">🔔 Lembrete de Agendamento</h2>
        <p><strong>Serviço:</strong> ${ag.titulo}</p>
        ${servicoNome ? '<p><strong>Tipo:</strong> ' + servicoNome + '</p>' : ''}
        <p><strong>Data:</strong> ${formatDate(ag.data_servico)} às ${ag.horario.slice(0, 5)}</p>
        <p><strong>Cliente:</strong> ${clienteNome}</p>
        ${ag.descricao ? '<p><strong>Descrição:</strong> ' + ag.descricao + '</p>' : ''}
        <p style="color:#888;font-size:12px;">Este agendamento ocorre ${diasTexto}.</p>
      </div>
    `

    // Envia para admins
    try {
      await transporter.sendMail({
        from: '"Nova Aliança" <' + cfg.gmail_user + '>',
        to: (cfg.emails_admin as string[]).join(', '),
        subject: assunto,
        html: htmlAdmin,
      })
      enviados++
      console.info('[notificacoes/disparar] Email admin enviado para agendamento:', ag.id, '| Data:', ag.data_servico)
    } catch (mailErr) {
      console.error('[notificacoes/disparar] Falha ao enviar email admin para agendamento:', ag.id, mailErr)
    }

    // Envia para cliente se configurado e tiver email
    if (cfg.notificar_cliente && clienteEmail) {
      const htmlCliente = `
        <div style="font-family:sans-serif;max-width:600px;margin:0 auto;">
          <h2 style="color:#f5a623;">Lembrete do seu agendamento</h2>
          <p>Olá, ${clienteNome}!</p>
          <p>Seu serviço <strong>${ag.titulo}</strong> está agendado para <strong>${formatDate(ag.data_servico)} às ${ag.horario.slice(0, 5)}</strong>.</p>
          ${ag.descricao ? '<p>' + ag.descricao + '</p>' : ''}
          <p>Em caso de dúvidas, entre em contato conosco.</p>
          <p style="color:#888;font-size:12px;">Nova Aliança Serralheria</p>
        </div>
      `
      try {
        await transporter.sendMail({
          from: '"Nova Aliança" <' + cfg.gmail_user + '>',
          to: clienteEmail,
          subject: 'Lembrete: seu agendamento é ' + diasTexto,
          html: htmlCliente,
        })
        console.info('[notificacoes/disparar] Email cliente enviado:', clienteEmail)
      } catch (mailErr) {
        console.error('[notificacoes/disparar] Falha ao enviar email cliente:', clienteEmail, mailErr)
      }
    }
  }

  console.info('[notificacoes/disparar] Concluído. Enviados:', enviados, '/ Total filtrado:', agendamentosFiltrados.length)
  return { ok: true, enviados, agendamentos: agendamentosFiltrados.length }
})
