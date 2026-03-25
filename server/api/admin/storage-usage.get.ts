import { createClient } from '@supabase/supabase-js'

// Limite do banco no plano Free do Supabase: 500 MB
const LIMIT_BYTES = 500 * 1024 * 1024

export default defineEventHandler(async () => {
  const config = useRuntimeConfig()

  const supabase = createClient(
    config.public.supabaseUrl as string,
    config.supabaseServiceRoleKey as string,
  )

  // Consulta tamanhos reais de cada fonte de mídia no banco
  const { data, error } = await supabase.rpc('get_media_usage_stats')

  if (error || !data) {
    // Fallback: query direta via SQL
    const { data: raw } = await supabase.from('solicitacoes').select('imagens, videos, audios')
    const bytesMedia = (raw ?? []).reduce((acc: number, row: { imagens?: string[]; videos?: string[]; audios?: string[] }) => {
      const imgs = (row.imagens ?? []).join('').length
      const vids = (row.videos ?? []).join('').length
      const auds = (row.audios ?? []).join('').length
      return acc + imgs + vids + auds
    }, 0)

    return buildResponse(bytesMedia, 0, 0, 0)
  }

  return buildResponse(
    Number(data.bytes_solicitacoes ?? 0),
    Number(data.bytes_portfolio ?? 0),
    Number(data.bytes_certs ?? 0),
    Number(data.bytes_banco_total ?? 0),
  )
})

function buildResponse(bytesMedia: number, bytesPortfolio: number, bytesCerts: number, bytesTotal: number) {
  const totalMidia = bytesMedia + bytesPortfolio + bytesCerts
  const percentMidia = Math.min((totalMidia / LIMIT_BYTES) * 100, 100)
  const percentBanco = bytesTotal > 0 ? Math.min((bytesTotal / LIMIT_BYTES) * 100, 100) : null

  return {
    limitBytes: LIMIT_BYTES,
    limitMB: LIMIT_BYTES / (1024 * 1024),
    // Mídias por fonte
    solicitacoes: { bytes: bytesMedia, mb: bytesMedia / (1024 * 1024) },
    portfolio: { bytes: bytesPortfolio, mb: bytesPortfolio / (1024 * 1024) },
    certs: { bytes: bytesCerts, mb: bytesCerts / (1024 * 1024) },
    // Totais
    totalMidiaBytes: totalMidia,
    totalMidiaMB: totalMidia / (1024 * 1024),
    percentMidia: Math.round(percentMidia * 10) / 10,
    // Banco completo (inclui índices, sistema, etc.)
    bancoTotalBytes: bytesTotal,
    bancoTotalMB: bytesTotal / (1024 * 1024),
    percentBanco: percentBanco !== null ? Math.round(percentBanco * 10) / 10 : null,
  }
}
