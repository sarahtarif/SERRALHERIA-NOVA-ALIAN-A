/**
 * Gerador de PDF para Orçamentos
 * Nota: Implementação básica - expandir com jsPDF quando biblioteca estiver instalada
 */

import type { OrcamentoWithItems } from '~/types'

/**
 * Gerar PDF do orçamento
 * TODO: Implementar com jsPDF + autotable quando instalado
 */
export async function gerarPdfOrcamento(orcamento: OrcamentoWithItems): Promise<Buffer> {
  // Estrutura HTML do PDF
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>Orçamento ${orcamento.numero}</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 40px; }
        .header { text-align: center; margin-bottom: 30px; }
        .info { margin-bottom: 20px; }
        table { width: 100%; border-collapse: collapse; margin: 20px 0; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        th { background-color: #f2f2f2; }
        .total { text-align: right; font-weight: bold; }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>ORÇAMENTO</h1>
        <h2>${orcamento.numero}</h2>
      </div>
      
      <div class="info">
        <p><strong>Data:</strong> ${new Date().toLocaleDateString('pt-BR')}</p>
        <p><strong>Validade:</strong> ${orcamento.validade_dias} dias</p>
        <p><strong>Status:</strong> ${orcamento.status}</p>
      </div>

      <table>
        <thead>
          <tr>
            <th>#</th>
            <th>Descrição</th>
            <th>Qtd</th>
            <th>Valor Unit.</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          ${orcamento.itens.map((item, index) => `
            <tr>
              <td>${index + 1}</td>
              <td>${item.descricao}</td>
              <td>${item.quantidade}</td>
              <td>R$ ${item.valor_unitario.toFixed(2)}</td>
              <td>R$ ${item.valor_total.toFixed(2)}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>

      <div class="total">
        <p>Subtotal: R$ ${orcamento.valor_total.toFixed(2)}</p>
        ${orcamento.valor_desconto ? `<p>Desconto: R$ ${orcamento.valor_desconto.toFixed(2)}</p>` : ''}
        <p>Impostos: R$ ${(orcamento.impostos || 0).toFixed(2)}</p>
        <p><strong>TOTAL: R$ ${orcamento.valor_final.toFixed(2)}</strong></p>
      </div>

      ${orcamento.observacoes ? `
        <div style="margin-top: 30px;">
          <p><strong>Observações:</strong></p>
          <p>${orcamento.observacoes}</p>
        </div>
      ` : ''}
    </body>
    </html>
  `

  // TODO: Converter HTML para PDF com jsPDF ou puppeteer
  // Por enquanto, retorna HTML como buffer
  return Buffer.from(html, 'utf-8')
}

/**
 * Salvar PDF no sistema de arquivos ou storage
 */
export async function salvarPdf(orcamentoId: string, pdfBuffer: Buffer): Promise<string> {
  // TODO: Implementar upload para Supabase Storage ou filesystem
  const filename = `orcamento-${orcamentoId}.pdf`
  const url = `/pdfs/${filename}`
  
  // Simular salvamento
  console.log(`PDF salvo: ${filename}`)
  
  return url
}
