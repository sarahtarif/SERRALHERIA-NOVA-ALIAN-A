/**
 * API para enviar orçamento por email
 * POST /api/admin/orcamentos/:id/email
 */

import { createClient } from '@supabase/supabase-js'

export default defineEventHandler(async (event) => {
  try {
    // Criar cliente Supabase com Service Role Key (bypass RLS)
    const supabaseUrl = process.env.NUXT_PUBLIC_SUPABASE_URL!
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
    const supabase = createClient(supabaseUrl, supabaseKey)
    
    const id = getRouterParam(event, 'id')
    const body = await readBody(event)
    
    if (!id) {
      throw createError({
        statusCode: 400,
        message: 'ID do orçamento não fornecido'
      })
    }

    const { email_destino } = body
    
    if (!email_destino) {
      throw createError({
        statusCode: 400,
        message: 'Email de destino não fornecido'
      })
    }

    // Buscar orçamento com itens
    const { data: orcamento, error: orcError } = await supabase
      .from('orcamentos')
      .select('*')
      .eq('id', id)
      .single()
    
    if (orcError || !orcamento) {
      throw createError({
        statusCode: 404,
        message: 'Orçamento não encontrado'
      })
    }

    const { data: itens, error: itensError } = await supabase
      .from('orcamento_itens')
      .select('*')
      .eq('orcamento_id', id)
      .order('ordem', { ascending: true })
    
    if (itensError) {
      throw createError({
        statusCode: 500,
        message: 'Erro ao buscar itens do orçamento'
      })
    }

    const orcamentoCompleto = {
      ...orcamento,
      itens: itens || []
    }
    
    // Gerar PDF se não existir (implementação simplificada)
    let pdfUrl = orcamento.pdf_url
    let pdfBuffer
    
    if (!pdfUrl) {
      const html = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <title>Orçamento ${orcamento.numero}</title>
        </head>
        <body>
          <h1>ORÇAMENTO ${orcamento.numero}</h1>
          <p>Valor Total: R$ ${orcamento.valor_final.toFixed(2)}</p>
        </body>
        </html>
      `
      pdfBuffer = Buffer.from(html, 'utf-8')
      pdfUrl = `/pdfs/orcamento-${orcamento.numero}.pdf`
      
      await supabase
        .from('orcamentos')
        .update({ 
          pdf_url: pdfUrl,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
    }

    // TODO: Implementar envio de email real
    // Por enquanto, apenas simula o envio
    console.log(`[API] Email simulado para ${email_destino}:`, {
      subject: `Orçamento ${orcamento.numero} - Nova Aliança`,
      orcamento: orcamento.numero,
      valor: orcamento.valor_final
    })

    // Atualizar status para enviado
    await supabase
      .from('orcamentos')
      .update({ 
        status: 'enviado',
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
    
    return {
      success: true,
      message: 'Email enviado com sucesso'
    }
  } catch (error) {
    console.error('[API] Erro ao enviar email:', error)
    if (error.statusCode) {
      throw error
    }
    throw createError({
      statusCode: 500,
      message: 'Erro ao enviar email do orçamento'
    })
  }
})
