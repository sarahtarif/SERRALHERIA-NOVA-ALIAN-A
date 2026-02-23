// API para registrar acessos autorizados ao painel admin
export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const ip = event.node.req.headers['x-forwarded-for']?.toString().split(',')[0].trim() ||
             event.node.req.headers['x-real-ip']?.toString() ||
             event.node.req.socket.remoteAddress ||
             'unknown'
  const userAgent = event.node.req.headers['user-agent'] || 'unknown'
  
  const logEntry = {
    event_type: 'ADMIN_ACCESS',
    user_id: body.userId,
    user_email: body.userEmail,
    ip_address: ip,
    user_agent: userAgent,
    route: body.route,
    from_route: body.fromRoute,
    method: 'GET',
    status_code: 200,
    metadata: {
      timestamp: body.timestamp,
      sessionId: event.node.req.headers['x-session-id']
    },
    created_at: new Date().toISOString()
  }
  
  console.log('[AUDIT] Acesso admin autorizado:', logEntry)
  
  // Em produção, salvar no banco de dados
  // const supabase = useSupabaseServer(event)
  // await supabase.from('security_audit_log').insert(logEntry)
  
  return { success: true, logged: true }
})
