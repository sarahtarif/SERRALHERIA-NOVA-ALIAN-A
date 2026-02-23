// Rate Limiter Server-Side Middleware
// Proteção contra brute force e scraping agressivo

import { createError } from 'h3'

// Armazenamento em memória (para produção, usar Redis/Upstash)
const requestStore = new Map<string, { count: number; resetTime: number; blocked: boolean; blockUntil?: number }>()

// Configuração de rate limits por rota
const RATE_LIMITS = {
  '/api/auth/login': {
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 5, // 5 tentativas
    blockDuration: 60 * 60 * 1000, // 1 hora de bloqueio
    message: 'Muitas tentativas de login. Tente novamente em 1 hora.'
  },
  '/auth/secure/admin-access': {
    windowMs: 15 * 60 * 1000,
    max: 5,
    blockDuration: 60 * 60 * 1000,
    message: 'Muitas tentativas de acesso. Tente novamente em 1 hora.'
  },
  '/sys/mgmt': {
    windowMs: 60 * 1000, // 1 minuto
    max: 30, // 30 requests
    blockDuration: 5 * 60 * 1000, // 5 minutos
    message: 'Limite de requisições excedido. Tente novamente em 5 minutos.'
  },
  '/api/admin': {
    windowMs: 60 * 1000,
    max: 30,
    blockDuration: 5 * 60 * 1000,
    message: 'Limite de requisições excedido. Tente novamente em 5 minutos.'
  },
  default: {
    windowMs: 60 * 1000,
    max: 100,
    blockDuration: 60 * 1000,
    message: 'Limite de requisições excedido. Tente novamente em breve.'
  }
}

// Limpar entradas expiradas periodicamente
setInterval(() => {
  const now = Date.now()
  for (const [key, value] of requestStore.entries()) {
    if (value.resetTime < now && (!value.blocked || (value.blockUntil && value.blockUntil < now))) {
      requestStore.delete(key)
    }
  }
}, 60 * 1000) // Limpar a cada minuto

export default defineEventHandler(async (event) => {
  const path = event.path || event.node.req.url || ''
  
  // Ignorar assets estáticos
  if (path.startsWith('/_nuxt') || path.startsWith('/api/_') || path.includes('.')) {
    return
  }
  
  // Obter IP do cliente
  const ip = event.node.req.headers['x-forwarded-for']?.toString().split(',')[0].trim() ||
             event.node.req.headers['x-real-ip']?.toString() ||
             event.node.req.socket.remoteAddress ||
             'unknown'
  
  // Determinar configuração de rate limit
  let config = RATE_LIMITS.default
  for (const [route, limit] of Object.entries(RATE_LIMITS)) {
    if (route !== 'default' && path.startsWith(route)) {
      config = limit
      break
    }
  }
  
  // Chave única por IP e rota
  const key = `${ip}:${path.split('/')[1] || 'root'}`
  const now = Date.now()
  
  // Obter ou criar entrada
  let entry = requestStore.get(key)
  
  if (!entry) {
    entry = {
      count: 0,
      resetTime: now + config.windowMs,
      blocked: false
    }
    requestStore.set(key, entry)
  }
  
  // Verificar se está bloqueado
  if (entry.blocked && entry.blockUntil && entry.blockUntil > now) {
    const remainingTime = Math.ceil((entry.blockUntil - now) / 1000 / 60)
    
    console.warn('[RATE_LIMIT] IP bloqueado:', {
      ip,
      path,
      remainingMinutes: remainingTime,
      timestamp: new Date().toISOString()
    })
    
    throw createError({
      statusCode: 429,
      statusMessage: 'Too Many Requests',
      message: `${config.message} (${remainingTime} minutos restantes)`
    })
  }
  
  // Resetar contador se a janela expirou
  if (entry.resetTime < now) {
    entry.count = 0
    entry.resetTime = now + config.windowMs
    entry.blocked = false
    entry.blockUntil = undefined
  }
  
  // Incrementar contador
  entry.count++
  
  // Verificar se excedeu o limite
  if (entry.count > config.max) {
    entry.blocked = true
    entry.blockUntil = now + config.blockDuration
    
    console.error('[RATE_LIMIT] Limite excedido - IP bloqueado:', {
      ip,
      path,
      count: entry.count,
      max: config.max,
      blockDuration: config.blockDuration / 1000 / 60,
      timestamp: new Date().toISOString(),
      userAgent: event.node.req.headers['user-agent']
    })
    
    // Enviar alerta de segurança por email
    try {
      await sendSecurityAlert({
        type: 'RATE_LIMIT_EXCEEDED',
        severity: path.includes('login') || path.includes('admin') ? 'HIGH' : 'MEDIUM',
        ipAddress: ip,
        userAgent: event.node.req.headers['user-agent'] || 'unknown',
        route: path,
        details: `IP excedeu o limite de ${config.max} requisições em ${config.windowMs / 1000 / 60} minutos. Bloqueado por ${config.blockDuration / 1000 / 60} minutos.`,
        timestamp: new Date().toISOString(),
        metadata: {
          count: entry.count,
          max: config.max,
          windowMs: config.windowMs,
          blockDuration: config.blockDuration
        }
      })
      console.log('[EMAIL] Alerta de rate limit enviado')
    } catch (emailError) {
      console.error('[EMAIL] Erro ao enviar alerta:', emailError)
    }
    
    throw createError({
      statusCode: 429,
      statusMessage: 'Too Many Requests',
      message: config.message
    })
  }
  
  // Adicionar headers de rate limit
  event.node.res.setHeader('X-RateLimit-Limit', config.max.toString())
  event.node.res.setHeader('X-RateLimit-Remaining', (config.max - entry.count).toString())
  event.node.res.setHeader('X-RateLimit-Reset', new Date(entry.resetTime).toISOString())
})
