// API para registrar tentativas de acesso não autorizado
export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const ip = event.node.req.headers['x-forwarded-for']?.toString().split(',')[0].trim() ||
             event.node.req.headers['x-real-ip']?.toString() ||
             event.node.req.socket.remoteAddress ||
             'unknown'
  const userAgent = event.node.req.headers['user-agent'] || 'unknown'
  
  const logEntry = {
    event_type: 'UNAUTHORIZED_ACCESS_ATTEMPT',
    user_id: body.userId,
    user_email: body.userEmail,
    user_role: body.role,
    ip_address: ip,
    user_agent: userAgent,
    route: body.attemptedRoute,
    from_route: body.fromRoute,
    method: 'GET',
    status_code: 403,
    metadata: {
      timestamp: body.timestamp,
      severity: 'HIGH',
      alert: true
    },
    created_at: new Date().toISOString()
  }
  
  console.error('[SECURITY ALERT] Tentativa de acesso não autorizado:', logEntry)
  
  // Em produção:
  // 1. Salvar no banco de dados
  // const supabase = useSupabaseServer(event)
  // await supabase.from('security_audit_log').insert(logEntry)
  
  // 2. Enviar alerta por email
  try {
    await sendSecurityAlert({
      type: 'UNAUTHORIZED_ACCESS',
      severity: 'HIGH',
      userId: body.userId,
      userEmail: body.userEmail,
      userRole: body.role,
      ipAddress: ip,
      userAgent: userAgent,
      route: body.attemptedRoute,
      details: `Usuário com role "${body.role}" tentou acessar área administrativa restrita.`,
      timestamp: body.timestamp,
      metadata: {
        fromRoute: body.fromRoute,
        attemptedRoute: body.attemptedRoute
      }
    })
    console.log('[EMAIL] Alerta de acesso não autorizado enviado')
  } catch (emailError) {
    console.error('[EMAIL] Erro ao enviar alerta:', emailError)
  }
  
  // 3. Incrementar contador de tentativas suspeitas
  // Se > 3 tentativas em 1 hora, bloquear usuário temporariamente
  
  return { success: true, logged: true, alert: 'Security team notified' }
})
