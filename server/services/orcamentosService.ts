/**
 * Service para Orçamentos Admin
 * CRUD completo, cálculo de impostos e geração de PDF
 * 
 * @see docs/PADROES-ADMIN.md
 */

import type { 
  Orcamento, 
  OrcamentoItem, 
  OrcamentoFormData, 
  OrcamentoFilters, 
  OrcamentosPagination, 
  PaginatedOrcamentos,
  OrcamentoWithItems,
  ImpostosConfig
} from '~/types'

/**
 * Configuração padrão de impostos
 */
const IMPOSTOS_DEFAULT: ImpostosConfig = {
  aliquota_iss: 0.05,      // 5%
  aliquota_pis: 0.0165,    // 1.65%
  aliquota_cofins: 0.076,  // 7.6%
  aliquota_csll: 0.01      // 1%
}

/**
 * Gerar número único de orçamento
 */
function gerarNumeroOrcamento(): string {
  const ano = new Date().getFullYear()
  const timestamp = Date.now().toString().slice(-6)
  return `ORC-${ano}-${timestamp}`
}

/**
 * Calcular impostos sobre valor
 */
export function calcularImpostos(valor: number, config: ImpostosConfig = IMPOSTOS_DEFAULT): number {
  const totalAliquota = config.aliquota_iss + config.aliquota_pis + config.aliquota_cofins + config.aliquota_csll
  return valor * totalAliquota
}

/**
 * Buscar orçamentos com filtros e paginação
 */
export async function getOrcamentos(
  filters: OrcamentoFilters = {},
  pagination: OrcamentosPagination = { page: 1, per_page: 20, total: 0, total_pages: 0 }
): Promise<PaginatedOrcamentos> {
  const supabase = useSupabase()
  
  try {
    let query = supabase
      .from('orcamentos')
      .select('*', { count: 'exact' })
    
    if (filters.search) {
      query = query.or(`numero.ilike.%${filters.search}%,observacoes.ilike.%${filters.search}%`)
    }
    
    if (filters.status) {
      query = query.eq('status', filters.status)
    }
    
    if (filters.client_id) {
      query = query.eq('client_id', filters.client_id)
    }
    
    if (filters.lead_id) {
      query = query.eq('lead_id', filters.lead_id)
    }
    
    if (filters.date_from) {
      query = query.gte('created_at', filters.date_from)
    }
    
    if (filters.date_to) {
      query = query.lte('created_at', filters.date_to)
    }
    
    if (filters.valor_min !== undefined) {
      query = query.gte('valor_final', filters.valor_min)
    }
    
    if (filters.valor_max !== undefined) {
      query = query.lte('valor_final', filters.valor_max)
    }
    
    const from = (pagination.page - 1) * pagination.per_page
    const to = from + pagination.per_page - 1
    
    query = query
      .order('created_at', { ascending: false })
      .range(from, to)
    
    const { data, error, count } = await query
    
    if (error) {
      console.error('[orcamentosService] Erro ao buscar orçamentos:', error)
      throw new Error(`Erro ao buscar orçamentos: ${error.message}`)
    }
    
    return {
      data: data || [],
      pagination: {
        page: pagination.page,
        per_page: pagination.per_page,
        total: count || 0,
        total_pages: Math.ceil((count || 0) / pagination.per_page)
      }
    }
  } catch (error) {
    console.error('[orcamentosService] Exceção ao buscar orçamentos:', error)
    throw error
  }
}

/**
 * Buscar orçamento por ID com itens
 */
export async function getOrcamentoById(id: string): Promise<OrcamentoWithItems> {
  const supabase = useSupabase()
  
  try {
    const { data: orcamento, error: orcError } = await supabase
      .from('orcamentos')
      .select('*')
      .eq('id', id)
      .single()
    
    if (orcError) throw orcError
    if (!orcamento) throw new Error('Orçamento não encontrado')
    
    const { data: itens, error: itensError } = await supabase
      .from('orcamento_itens')
      .select('*')
      .eq('orcamento_id', id)
      .order('ordem', { ascending: true })
    
    if (itensError) throw itensError
    
    return {
      ...orcamento,
      itens: itens || []
    }
  } catch (error) {
    console.error('[orcamentosService] Erro ao buscar orçamento:', error)
    throw error
  }
}

/**
 * Criar novo orçamento com itens
 */
export async function createOrcamento(
  data: OrcamentoFormData,
  userId: string
): Promise<OrcamentoWithItems> {
  const supabase = useSupabase()
  
  try {
    // Calcular valores
    const valorTotal = data.itens.reduce((sum, item) => 
      sum + (item.quantidade * item.valor_unitario), 0
    )
    
    const valorDesconto = data.valor_desconto || 0
    const valorComDesconto = valorTotal - valorDesconto
    const impostos = calcularImpostos(valorComDesconto)
    const valorFinal = valorComDesconto
    
    const validadeDias = data.validade_dias || 30
    const dataValidade = new Date()
    dataValidade.setDate(dataValidade.getDate() + validadeDias)
    
    // Criar orçamento
    const orcamentoData = {
      numero: gerarNumeroOrcamento(),
      lead_id: data.lead_id || null,
      client_id: data.client_id || null,
      status: data.status || 'rascunho',
      valor_total: valorTotal,
      valor_desconto: valorDesconto,
      valor_final: valorFinal,
      impostos,
      observacoes: data.observacoes || null,
      validade_dias: validadeDias,
      data_validade: dataValidade.toISOString(),
      created_by: userId
    }
    
    const { data: novoOrcamento, error: orcError } = await supabase
      .from('orcamentos')
      .insert(orcamentoData)
      .select()
      .single()
    
    if (orcError) throw orcError
    
    // Criar itens
    const itensData = data.itens.map((item, index) => ({
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
    
    if (itensError) throw itensError
    
    return {
      ...novoOrcamento,
      itens: novosItens || []
    }
  } catch (error) {
    console.error('[orcamentosService] Erro ao criar orçamento:', error)
    throw error
  }
}

/**
 * Atualizar orçamento
 */
export async function updateOrcamento(
  id: string,
  data: Partial<Orcamento>
): Promise<Orcamento> {
  const supabase = useSupabase()
  
  try {
    const { data: updated, error } = await supabase
      .from('orcamentos')
      .update({
        ...data,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    
    return updated
  } catch (error) {
    console.error('[orcamentosService] Erro ao atualizar orçamento:', error)
    throw error
  }
}

/**
 * Deletar orçamento e seus itens
 */
export async function deleteOrcamento(id: string): Promise<void> {
  const supabase = useSupabase()
  
  try {
    // Deletar itens primeiro (cascade)
    const { error: itensError } = await supabase
      .from('orcamento_itens')
      .delete()
      .eq('orcamento_id', id)
    
    if (itensError) throw itensError
    
    // Deletar orçamento
    const { error } = await supabase
      .from('orcamentos')
      .delete()
      .eq('id', id)
    
    if (error) throw error
  } catch (error) {
    console.error('[orcamentosService] Erro ao deletar orçamento:', error)
    throw error
  }
}

/**
 * Gerar PDF do orçamento
 * Nota: Implementação básica - expandir com jsPDF quando necessário
 */
export async function gerarPdfOrcamento(orcamentoId: string): Promise<string> {
  try {
    const orcamento = await getOrcamentoById(orcamentoId)
    
    // TODO: Implementar geração real com jsPDF
    // Por enquanto, retorna URL mockada
    const pdfUrl = `/pdfs/orcamento-${orcamento.numero}.pdf`
    
    // Atualizar orçamento com URL do PDF
    await updateOrcamento(orcamentoId, { pdf_url: pdfUrl })
    
    return pdfUrl
  } catch (error) {
    console.error('[orcamentosService] Erro ao gerar PDF:', error)
    throw error
  }
}

/**
 * Buscar estatísticas de orçamentos
 */
export async function getOrcamentosStats(): Promise<{
  total: number
  rascunhos: number
  enviados: number
  aprovados: number
  rejeitados: number
  valor_total_aprovados: number
  taxa_aprovacao: number
}> {
  const supabase = useSupabase()
  
  try {
    const { count: total } = await supabase
      .from('orcamentos')
      .select('*', { count: 'exact', head: true })
    
    const { count: rascunhos } = await supabase
      .from('orcamentos')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'rascunho')
    
    const { count: enviados } = await supabase
      .from('orcamentos')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'enviado')
    
    const { count: aprovados } = await supabase
      .from('orcamentos')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'aprovado')
    
    const { count: rejeitados } = await supabase
      .from('orcamentos')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'rejeitado')
    
    const { data: aprovadosData } = await supabase
      .from('orcamentos')
      .select('valor_final')
      .eq('status', 'aprovado')
    
    const valor_total_aprovados = aprovadosData?.reduce((sum, orc) => sum + orc.valor_final, 0) || 0
    
    const taxa_aprovacao = total && total > 0 
      ? Math.round(((aprovados || 0) / total) * 100) 
      : 0
    
    return {
      total: total || 0,
      rascunhos: rascunhos || 0,
      enviados: enviados || 0,
      aprovados: aprovados || 0,
      rejeitados: rejeitados || 0,
      valor_total_aprovados,
      taxa_aprovacao
    }
  } catch (error) {
    console.error('[orcamentosService] Erro ao buscar estatísticas:', error)
    throw error
  }
}
