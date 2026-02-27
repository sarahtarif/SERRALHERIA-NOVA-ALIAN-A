/**
 * API para gerar PDF de orçamento
 * POST /api/admin/orcamentos/:id/pdf
 */

import { createClient } from '@supabase/supabase-js'

export default defineEventHandler(async (event) => {
  try {
    // Criar cliente Supabase com Service Role Key (bypass RLS)
    const supabaseUrl = process.env.NUXT_PUBLIC_SUPABASE_URL!
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
    const supabase = createClient(supabaseUrl, supabaseKey)
    
    const id = getRouterParam(event, 'id')
    
    if (!id) {
      throw createError({
        statusCode: 400,
        message: 'ID do orçamento não fornecido'
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
    
    // Gerar PDF (implementação simplificada)
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
    
    const pdfBuffer = Buffer.from(html, 'utf-8')
    
    // TODO: Salvar PDF em storage (Supabase Storage ou S3)
    // Por enquanto, retorna URL mockada
    const pdfUrl = `/pdfs/orcamento-${orcamento.numero}.pdf`
    
    // Atualizar orçamento com URL do PDF
    const { error: updateError } = await supabase
      .from('orcamentos')
      .update({ 
        pdf_url: pdfUrl,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
    
    if (updateError) {
      console.error('[API] Erro ao atualizar orçamento:', updateError)
    }
    
    return {
      success: true,
      pdf_url: pdfUrl,
      pdf_buffer: pdfBuffer.toString('base64')
    }
  } catch (error) {
    console.error('[API] Erro ao gerar PDF:', error)
    if (error.statusCode) {
      throw error
    }
    throw createError({
      statusCode: 500,
      message: 'Erro ao gerar PDF do orçamento'
    })
  }
})
