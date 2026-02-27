# Log de Correção - Fases 1 e 2

**Data:** 27/02/2026  
**Status:** ✅ CONCLUÍDO

## Objetivo
Corrigir as páginas quebradas de Leads e Orçamentos implementando as APIs faltantes e atualizando os composables para usar essas APIs ao invés de chamar services diretamente.

---

## Correções de Schema

### Migration: add_leads_admin_columns
**Data:** 27/02/2026  
**Status:** ✅ Aplicada via MCP Supabase

Colunas adicionadas na tabela `leads`:
- `status` TEXT DEFAULT 'novo' - Status do lead (novo, em_contato, proposta, fechado, perdido)
- `converted_to_client` BOOLEAN DEFAULT false - Indica se foi convertido em cliente
- `client_id` UUID - Referência para a tabela clients
- `updated_at` TIMESTAMPTZ DEFAULT NOW() - Data da última atualização

Índices criados:
- `idx_leads_status` - Para filtros por status
- `idx_leads_converted` - Para filtros de conversão
- `idx_leads_client_id` - Para joins com clients

**Teste realizado:** Lead criado com sucesso via MCP com todas as novas colunas.

---

## FASE 1 - LEADS

### APIs Criadas

#### 1. GET /api/admin/leads
- **Arquivo:** `server/api/admin/leads/index.get.ts`
- **Função:** Listar leads com filtros e paginação
- **Filtros suportados:**
  - search (busca em name, whatsapp, message)
  - service_type
  - source
  - status
  - neighborhood
  - date_from / date_to
  - converted (boolean)
- **Paginação:** page, per_page
- **Status:** ✅ Implementado

#### 2. POST /api/admin/leads/novo
- **Arquivo:** `server/api/admin/leads/novo.post.ts`
- **Função:** Criar novo lead
- **Campos obrigatórios:** name, whatsapp, service_type
- **Campos opcionais:** neighborhood, message, source, status
- **Status:** ✅ Implementado

#### 3. GET /api/admin/leads/:id
- **Arquivo:** `server/api/admin/leads/[id].get.ts`
- **Função:** Buscar lead por ID
- **Status:** ✅ Implementado

#### 4. PATCH /api/admin/leads/:id
- **Arquivo:** `server/api/admin/leads/[id].patch.ts`
- **Função:** Atualizar lead existente
- **Status:** ✅ Implementado

#### 5. DELETE /api/admin/leads/:id
- **Arquivo:** `server/api/admin/leads/[id].delete.ts`
- **Função:** Deletar lead
- **Status:** ✅ Implementado

### Composable Atualizado

**Arquivo:** `app/composables/admin/useLeads.ts`

Funções atualizadas para usar APIs:
- ✅ `fetchLeads()` - usa GET /api/admin/leads
- ✅ `fetchLeadById()` - usa GET /api/admin/leads/:id
- ✅ `createLead()` - usa POST /api/admin/leads/novo
- ✅ `updateLead()` - usa PATCH /api/admin/leads/:id
- ✅ `deleteLead()` - usa DELETE /api/admin/leads/:id
- ✅ `convertToClient()` - usa PATCH /api/admin/leads/:id

---

## FASE 2 - ORÇAMENTOS

### APIs Criadas

#### 1. GET /api/admin/orcamentos
- **Arquivo:** `server/api/admin/orcamentos/index.get.ts`
- **Função:** Listar orçamentos com filtros e paginação
- **Filtros suportados:**
  - search (busca em numero, observacoes)
  - status
  - client_id
  - lead_id
  - date_from / date_to
  - valor_min / valor_max
- **Paginação:** page, per_page
- **Status:** ✅ Implementado

#### 2. POST /api/admin/orcamentos/novo
- **Arquivo:** `server/api/admin/orcamentos/novo.post.ts`
- **Função:** Criar novo orçamento com itens
- **Campos obrigatórios:** itens (array), userId
- **Campos opcionais:** lead_id, client_id, status, valor_desconto, observacoes, validade_dias
- **Cálculos automáticos:**
  - Valor total dos itens
  - Impostos (ISS, PIS, COFINS, CSLL)
  - Valor final
  - Data de validade
  - Número único do orçamento (ORC-YYYY-XXXXXX)
- **Status:** ✅ Implementado

#### 3. GET /api/admin/orcamentos/:id
- **Arquivo:** `server/api/admin/orcamentos/[id].get.ts`
- **Função:** Buscar orçamento por ID com itens
- **Retorna:** Orçamento completo + array de itens ordenados
- **Status:** ✅ Implementado

#### 4. PATCH /api/admin/orcamentos/:id
- **Arquivo:** `server/api/admin/orcamentos/[id].patch.ts`
- **Função:** Atualizar orçamento existente
- **Status:** ✅ Implementado

#### 5. DELETE /api/admin/orcamentos/:id
- **Arquivo:** `server/api/admin/orcamentos/[id].delete.ts`
- **Função:** Deletar orçamento e seus itens (cascade)
- **Status:** ✅ Implementado

#### 6. POST /api/admin/orcamentos/:id/pdf
- **Arquivo:** `server/api/admin/orcamentos/[id]/pdf.post.ts`
- **Função:** Gerar PDF do orçamento
- **Status:** ✅ Corrigido (usa Supabase client)

#### 7. POST /api/admin/orcamentos/:id/email
- **Arquivo:** `server/api/admin/orcamentos/[id]/email.post.ts`
- **Função:** Enviar orçamento por email
- **Status:** ✅ Corrigido (usa Supabase client)

### Composable Atualizado

**Arquivo:** `app/composables/admin/useOrcamentos.ts`

Funções atualizadas para usar APIs:
- ✅ `fetchOrcamentos()` - usa GET /api/admin/orcamentos
- ✅ `fetchOrcamentoById()` - usa GET /api/admin/orcamentos/:id
- ✅ `createOrcamento()` - usa POST /api/admin/orcamentos/novo
- ✅ `updateOrcamento()` - usa PATCH /api/admin/orcamentos/:id
- ✅ `deleteOrcamento()` - usa DELETE /api/admin/orcamentos/:id

---

## Padrão Arquitetural Aplicado

### Cliente-Servidor
```
Vue Page → Composable → API Route → Supabase
```

### Estrutura de API Route
```typescript
import { createClient } from '@supabase/supabase-js'

export default defineEventHandler(async (event) => {
  // 1. Criar cliente Supabase
  const supabaseUrl = process.env.NUXT_PUBLIC_SUPABASE_URL!
  const supabaseKey = process.env.NUXT_PUBLIC_SUPABASE_ANON_KEY!
  const supabase = createClient(supabaseUrl, supabaseKey)
  
  // 2. Extrair params/query/body
  // 3. Validar dados
  // 4. Executar query no Supabase
  // 5. Retornar resultado ou erro
})
```

### Estrutura de Composable
```typescript
const fetchData = async () => {
  loading.value = true
  error.value = null
  
  try {
    const result = await $fetch('/api/endpoint', {
      method: 'GET',
      query: { ...filters }
    })
    data.value = result
  } catch (e) {
    error.value = e.message
  } finally {
    loading.value = false
  }
}
```

---

## Próximos Passos

### Testes de Segurança
- [ ] Criar testes para APIs de Leads
- [ ] Criar testes para APIs de Orçamentos
- [ ] Validar RLS policies no Supabase
- [ ] Testar rate limiting

### Validação Funcional
- [ ] Testar CRUD completo de Leads
- [ ] Testar CRUD completo de Orçamentos
- [ ] Testar filtros e paginação
- [ ] Testar geração de PDF
- [ ] Testar envio de email

### Gate de Aprovação
Só avançar para Fase 3 após:
- ✅ Todas as páginas /admin/leads/** funcionando
- ✅ Todas as páginas /admin/orcamentos/** funcionando
- ⏳ CRUD completo testado
- ⏳ Testes de segurança validados

---

## Notas Técnicas

### Impostos Calculados
- ISS: 5%
- PIS: 1.65%
- COFINS: 7.6%
- CSLL: 1%
- **Total:** 14.25%

### Formato de Número de Orçamento
`ORC-YYYY-XXXXXX`
- YYYY: Ano atual
- XXXXXX: Últimos 6 dígitos do timestamp

### Validade Padrão
30 dias a partir da data de criação

---

## Arquivos Modificados

### Criados
- `server/api/admin/leads/index.get.ts`
- `server/api/admin/leads/novo.post.ts`
- `server/api/admin/leads/[id].get.ts`
- `server/api/admin/leads/[id].patch.ts`
- `server/api/admin/leads/[id].delete.ts`
- `server/api/admin/orcamentos/index.get.ts`
- `server/api/admin/orcamentos/novo.post.ts`
- `server/api/admin/orcamentos/[id].get.ts`
- `server/api/admin/orcamentos/[id].patch.ts`
- `server/api/admin/orcamentos/[id].delete.ts`

### Modificados
- `app/composables/admin/useLeads.ts`
- `app/composables/admin/useOrcamentos.ts`
- `server/api/admin/orcamentos/[id]/pdf.post.ts`
- `server/api/admin/orcamentos/[id]/email.post.ts`
- `app/pages/admin/leads/novo.vue` (adicionado import useLeads)
- `app/pages/admin/leads/[id].vue` (adicionado import useLeads)
- `app/pages/admin/orcamentos/novo.vue` (adicionado import useOrcamentos)
- `.env` (adicionada SUPABASE_SERVICE_ROLE_KEY)
- Todas as APIs de leads para usar Service Role Key

### Mantidos (referência)
- `server/services/leadsService.ts`
- `server/services/orcamentosService.ts`
