import { createClient } from '@supabase/supabase-js'
import { defineEventHandler, getRouterParam, createError, setHeader, setResponseStatus, send } from 'h3'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const supabase = createClient(config.public.supabaseUrl as string, config.supabaseServiceRoleKey as string, {
    auth: { autoRefreshToken: false, persistSession: false },
  })

  const id = getRouterParam(event, 'id')
  if (!id) throw createError({ statusCode: 400, message: 'ID inválido.' })

  const { data, error } = await supabase.rpc('get_portfolio_media', { item_id: id })

  if (error || !data) throw createError({ statusCode: 404, message: 'Mídia não encontrada.' })

  const row = Array.isArray(data) ? data[0] : data
  if (!row?.media_b64) throw createError({ statusCode: 404, message: 'Mídia não encontrada.' })

  const buf = Buffer.from(row.media_b64 as string, 'base64')
  setHeader(event, 'Content-Type', row.media_type ?? 'application/octet-stream')
  setHeader(event, 'Content-Length', String(buf.length))
  setHeader(event, 'Cache-Control', 'public, max-age=86400')
  setResponseStatus(event, 200)
  return send(event, buf, row.media_type ?? 'application/octet-stream')
})
