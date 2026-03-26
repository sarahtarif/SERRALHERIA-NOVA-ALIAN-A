import { createClient } from '@supabase/supabase-js'
import { defineEventHandler, getHeader, readBody, createError, getRequestIP } from 'h3'

interface GeoData {
  cidade: string | null
  regiao: string | null
  pais: string | null
  latitude: number | null
  longitude: number | null
}

function parseUserAgent(ua: string): { device_type: string; browser: string; os: string } {
  const uaLower = ua.toLowerCase()

  // Device type
  let device_type = 'desktop'
  if (/mobile|android.*mobile|iphone|ipod|blackberry|windows phone/i.test(ua)) {
    device_type = 'mobile'
  } else if (/ipad|android(?!.*mobile)|tablet/i.test(ua)) {
    device_type = 'tablet'
  }

  // Browser
  let browser = 'Desconhecido'
  if (uaLower.includes('edg/')) browser = 'Edge'
  else if (uaLower.includes('opr/') || uaLower.includes('opera')) browser = 'Opera'
  else if (uaLower.includes('chrome') && !uaLower.includes('chromium')) browser = 'Chrome'
  else if (uaLower.includes('firefox')) browser = 'Firefox'
  else if (uaLower.includes('safari') && !uaLower.includes('chrome')) browser = 'Safari'
  else if (uaLower.includes('msie') || uaLower.includes('trident')) browser = 'Internet Explorer'

  // OS
  let os = 'Desconhecido'
  if (uaLower.includes('windows nt 10')) os = 'Windows 10/11'
  else if (uaLower.includes('windows nt 6.3')) os = 'Windows 8.1'
  else if (uaLower.includes('windows')) os = 'Windows'
  else if (uaLower.includes('mac os x') || uaLower.includes('macos')) os = 'macOS'
  else if (uaLower.includes('iphone os')) os = 'iOS'
  else if (uaLower.includes('ipad')) os = 'iPadOS'
  else if (uaLower.includes('android')) os = 'Android'
  else if (uaLower.includes('linux')) os = 'Linux'

  return { device_type, browser, os }
}

async function getGeoFromIp(ip: string): Promise<GeoData> {
  // Ignora IPs locais
  if (!ip || ip === '::1' || ip.startsWith('127.') || ip.startsWith('192.168.') || ip.startsWith('10.')) {
    return { cidade: 'Local', regiao: null, pais: null, latitude: null, longitude: null }
  }

  try {
    const res = await fetch('http://ip-api.com/json/' + ip + '?fields=status,city,regionName,country,lat,lon&lang=pt-BR', {
      signal: AbortSignal.timeout(3000),
    })
    if (!res.ok) throw new Error('geo failed')
    const data = await res.json() as {
      status: string
      city?: string
      regionName?: string
      country?: string
      lat?: number
      lon?: number
    }
    if (data.status !== 'success') throw new Error('geo status fail')
    return {
      cidade: data.city ?? null,
      regiao: data.regionName ?? null,
      pais: data.country ?? null,
      latitude: data.lat ?? null,
      longitude: data.lon ?? null,
    }
  } catch {
    return { cidade: null, regiao: null, pais: null, latitude: null, longitude: null }
  }
}

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const supabaseUrl = config.public.supabaseUrl as string
  const serviceKey = config.supabaseServiceRoleKey as string
  const anonKey = config.public.supabaseAnonKey as string

  const token = getHeader(event, 'authorization')?.replace('Bearer ', '')
  if (!token) throw createError({ statusCode: 401, message: 'Não autorizado.' })

  // Valida sessão
  const supabaseUser = createClient(supabaseUrl, anonKey, {
    auth: { autoRefreshToken: false, persistSession: false },
    global: { headers: { Authorization: 'Bearer ' + token } },
  })
  const { data: { user }, error: authErr } = await supabaseUser.auth.getUser()
  if (authErr || !user) throw createError({ statusCode: 401, message: 'Sessão inválida.' })

  const supabase = createClient(supabaseUrl, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  })

  // Confirma que é admin
  const { data: adminRow } = await supabase.from('admins').select('role').eq('id', user.id).maybeSingle()
  if (!adminRow) throw createError({ statusCode: 403, message: 'Acesso negado.' })

  // Captura IP — tenta headers de proxy primeiro (Vercel passa x-forwarded-for)
  const forwarded = getHeader(event, 'x-forwarded-for')
  const ip = (forwarded ? forwarded.split(',')[0].trim() : null)
    ?? getRequestIP(event)
    ?? 'desconhecido'

  const ua = getHeader(event, 'user-agent') ?? ''
  const { device_type, browser, os } = parseUserAgent(ua)
  const geo = await getGeoFromIp(ip)

  const { error: insertErr } = await supabase.from('admin_sessions').insert({
    admin_id: user.id,
    admin_email: user.email ?? '',
    ip,
    user_agent: ua.slice(0, 500),
    device_type,
    browser,
    os,
    cidade: geo.cidade,
    regiao: geo.regiao,
    pais: geo.pais,
    latitude: geo.latitude,
    longitude: geo.longitude,
  })

  if (insertErr) {
    console.error('[registrar-sessao] Erro ao inserir:', insertErr.message)
  } else {
    console.info('[registrar-sessao] Sessão registrada:', user.email, '| IP:', ip, '| Local:', geo.cidade, geo.pais)
  }

  return { ok: true }
})
