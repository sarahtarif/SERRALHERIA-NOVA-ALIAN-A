// API para alertar sobre múltiplas tentativas de login falhas
export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const ip = event.node.req.headers['x-forwarded-for']?.toString().split(',')[0].trim() ||
             event.node.req.headers['x-real-ip']?.toString() ||
             event.node.req.socket.remoteAddress ||
             'unknown'
  const userAgent = event.node.req.headers['user-agent'] || 'unknown'
  
  const attempts = body.attempts || 0
  const email = body.email || 'unknown'
  
  // Determinar severidade baseado no número de tentativas
  let severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' = 'MEDIUM'
  if (attempts >= 5) severity = 'CRITICAL'
  else if (attempts >= 3) severity = 'HIGH'
  
  console.warn('[SECURITY] Múltiplas tentativas de login falhas:', {
    email,
    attempts,
    ip,
    timestamp: new Date().toISOString()
  })
  
  // Enviar alerta por email
  try {
    await sendSecurityAlert({
      type: 'MULTIPLE_FAILED_LOGINS',
      severity,
      userEmail: email,
      ipAddress: ip,
      userAgent: userAgent,
      route: '/auth/secure/admin-access',
      details: `${attempts} tentativas consecutivas de login falhas para o email "${email}". ${attempts >= 5 ? 'IP foi bloqueado.' : 'Monitoramento ativo.'}`,
      timestamp: new Date().toISOString(),
      metadata: {
        attempts,
        blocked: attempts >= 5,
        email
      }
    })
    console.log('[EMAIL] Alerta de tentativas falhas enviado')
  } catch (emailError) {
    console.error('[EMAIL] Erro ao enviar alerta:', emailError)
  }
  
  return { success: true, alerted: true }
})
