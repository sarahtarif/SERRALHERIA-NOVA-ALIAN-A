/**
 * API: Criar novo orçamento com itens
 * POST /api/admin/orcamentos/novo
 */

import { createClient } from '@supabase/supabase-js'
import type { OrcamentoFormData, ImpostosConfig } from '~/types'

// Configuração padrão de impostos
const IMPOSTOS_DEFAULT: ImpostosConfig = {
  aliquota_iss: 0.05,      // 5%
  aliquota_pis: 0.0165,    // 1.65%
  aliquota_cofins: 0.076,  // 7.6%
  aliquota_csll: 0.01      // 1%
}

// Gerar número único de orçamento
function gerarNumeroOrcamento(): string {
  const ano = new Date().getFullYear()
  const timestamp = Date.now().toString().slice(-6)
  return `ORC-${ano}-${timestamp}`
}

// Calcular impostos sobre valor
function calcularImpostos(valor: number, config: ImpostosConfig = IMPOSTOS_DEFAULT): number {
  const totalAliquota = config.aliquota_iss + config.aliquota_pis + config.aliquota_cofins + config.aliquota_csll
  return valor * totalAliquota
}

export default defineEventHandler(async (event) => {
  try {
    // Criar cliente Supabase
    const supabaseUrl = process.env.NUXT_PUBLIC_SUPABASE_URL!
    const supabaseKey = process.env.NUXT_PUBLIC_SUPABASE_ANON_KEY!
    const supabase = createClient(supabaseUrl, supabaseKey)
    
    // Ler body
    const body = await readBody(event)
    
    // Validar dados obrigatórios
    if (!body.itens || body.itens.length === 0) {
      throw createError({
        statusCode: 400,
        message: 'Orçamento deve ter pelo menos um item'
      })
    }
    
    if (!body.userId) {
      throw createError({
        statusCode: 400,
        message: 'userId é obrigatório'
      })
    }
    
    // Calcular valores
    const valorTotal = body.itens.reduce((sum: number, item: any) => 
      sum + (item.quantidade * item.valor_unitario), 0
    )
    
    const valorDesconto = body.valor_desconto || 0
    const valorComDesconto = valorTotal - valorDesconto
    const impostos = calcularImpostos(valorComDesconto)
    const valorFinal = valorComDesconto
    
    const validadeDias = body.validade_dias || 30
    const dataValidade = new Date()
    dataValidade.setDate(dataValidade.getDate() + validadeDias)
    
    // Criar orçamento
    const orcamentoData = {
      numero: gerarNumeroOrcamento(),
      lead_id: body.lead_id || null,
      client_id: body.client_id || null,
      status: body.status || 'rascunho',
      valor_total: valorTotal,
      valor_desconto: valorDesconto,
      valor_final: valorFinal,
      impostos,
      observacoes: body.observacoes || null,
      validade_dias: validadeDias,
      data_validade: dataValidade.toISOString(),
      created_by: body.userId
    }
    
    const { data: novoOrcamento, error: orcError } = await supabase
      .from('orcamentos')
      .insert(orcamentoData)
      .select()
      .single()
    
    if (orcError) {
      console.error('[API] Erro ao criar orçamento:', orcError)
      throw createError({
        statusCode: 500,
        message: `Erro ao criar orçamento: ${orcError.message}`
      })
    }
    
    // Criar itens
    const itensData = body.itens.map((item: any, index: number) => ({
      orcamento_id: novoOrcamento.id,
      descricao: item.descricao,
      quantidade: item.quantidade,
      valor_unitario: item.valor_unitario,
      valor_total: item.quantidade * item.valor_unitario,
      ordem: index + 1
    }))
    
    const { data: novosItens, error: itensError } = await supabase
      .from('orcamento_itens')
      .insert(itensData)
      .select()
    
    if (itensError) {
      console.error('[API] Erro ao criar itens do orçamento:', itensError)
      throw createError({
        statusCode: 500,
        message: `Erro ao criar itens: ${itensError.message}`
      })
    }
    
    return {
      ...novoOrcamento,
      itens: novosItens || []
    }
  } catch (error) {
    console.error('[API] Exceção ao criar orçamento:', error)
    if (error.statusCode) {
      throw error
    }
    throw createError({
      statusCode: 500,
      message: 'Erro ao criar orçamento'
    })
  }
})
