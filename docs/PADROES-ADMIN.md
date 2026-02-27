# Padrões de Desenvolvimento - Área Admin

## Visão Geral

Este documento define os padrões obrigatórios para desenvolvimento de funcionalidades na Área Admin, incluindo estrutura de pastas, nomenclatura, assinaturas de funções e boas práticas.

## Estrutura de Pastas

### Composables Admin (`app/composables/admin/`)

```
app/composables/admin/
├── useDashboard.ts       # KPIs e métricas do dashboard
├── useLeads.ts           # Gestão de leads
├── useOrcamentos.ts      # Gestão de orçamentos
├── useServicos.ts        # Gestão de serviços
├── useAgenda.ts          # Gestão de agenda
├── useClientes.ts        # Gestão de clientes
├── useFinanceiro.ts      # Gestão financeira
└── shared/
    ├── useAdminFilters.ts    # Filtros reutilizáveis
    ├── useAdminPagination.ts # Paginação reutilizável
    └── useAdminExport.ts     # Exportação de dados
```

### Services (`server/services/`)

```
server/services/
├── dashboardService.ts   # Queries de KPIs
├── leadsService.ts       # CRUD de leads
├── orcamentosService.ts  # CRUD de orçamentos
├── servicosService.ts    # CRUD de serviços
├── agendaService.ts      # Queries de agenda
├── clientesService.ts    # CRUD de clientes
├── financeiroService.ts  # Queries financeiras
└── shared/
    ├── supabaseClient.ts     # Cliente Supabase configurado
    └── queryBuilder.ts       # Helpers para queries
```

## Padrões de Nomenclatura

### Composables

- **Nome**: `use<Módulo>.ts` (ex: `useLeads.ts`)
- **Função exportada**: `use<Módulo>()` (ex: `useLeads()`)
- **Prefixo de funções**: verbo + substantivo (ex: `fetchLeads`, `createLead`, `updateLead`, `deleteLead`)

### Services

- **Nome**: `<módulo>Service.ts` (ex: `leadsService.ts`)
- **Funções exportadas**: verbo + substantivo (ex: `getLeads`, `createLead`, `updateLead`, `deleteLead`)
- **Sempre exportar funções nomeadas**, nunca default export

## Assinatura Padrão de Composables

Todos os composables admin devem seguir esta estrutura:

```typescript
import type { Ref } from 'vue'

// Tipos específicos do módulo
export interface Lead {
  id: string
  name: string
  whatsapp: string
  service_type: string
  neighborhood?: string
  message?: string
  source: string
  created_at: string
}

export interface LeadFilters {
  search?: string
  service_type?: string
  source?: string
  date_from?: string
  date_to?: string
}

export interface LeadsPagination {
  page: number
  per_page: number
  total: number
  total_pages: number
}

// Composable
export const useLeads = () => {
  // Estado reativo
  const leads = ref<Lead[]>([])
  const selectedLead = ref<Lead | null>(null)
  const filters = ref<LeadFilters>({})
  const pagination = ref<LeadsPagination>({
    page: 1,
    per_page: 20,
    total: 0,
    total_pages: 0
  })
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Funções CRUD
  const fetchLeads = async () => {
    loading.value = true
    error.value = null
    
    try {
      const result = await getLeads(filters.value, pagination.value)
      leads.value = result.data
      pagination.value = result.pagination
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Erro ao buscar leads'
      console.error('[useLeads] Erro ao buscar leads:', e)
    } finally {
      loading.value = false
    }
  }

  const createLead = async (data: Omit<Lead, 'id' | 'created_at'>) => {
    loading.value = true
    error.value = null
    
    try {
      const newLead = await createLeadService(data)
      leads.value.unshift(newLead)
      return newLead
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Erro ao criar lead'
      console.error('[useLeads] Erro ao criar lead:', e)
      throw e
    } finally {
      loading.value = false
    }
  }

  const updateLead = async (id: string, data: Partial<Lead>) => {
    loading.value = true
    error.value = null
    
    try {
      const updated = await updateLeadService(id, data)
      const index = leads.value.findIndex(l => l.id === id)
      if (index !== -1) {
        leads.value[index] = updated
      }
      return updated
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Erro ao atualizar lead'
      console.error('[useLeads] Erro ao atualizar lead:', e)
      throw e
    } finally {
      loading.value = false
    }
  }

  const deleteLead = async (id: string) => {
    loading.value = true
    error.value = null
    
    try {
      await deleteLeadService(id)
      leads.value = leads.value.filter(l => l.id !== id)
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Erro ao deletar lead'
      console.error('[useLeads] Erro ao deletar lead:', e)
      throw e
    } finally {
      loading.value = false
    }
  }

  // Funções auxiliares
  const setFilters = (newFilters: Partial<LeadFilters>) => {
    filters.value = { ...filters.value, ...newFilters }
    pagination.value.page = 1 // Reset para primeira página
  }

  const clearFilters = () => {
    filters.value = {}
    pagination.value.page = 1
  }

  const setPage = (page: number) => {
    pagination.value.page = page
  }

  // Computed properties
  const hasLeads = computed(() => leads.value.length > 0)
  const hasFilters = computed(() => Object.keys(filters.value).length > 0)

  return {
    // Estado
    leads: readonly(leads),
    selectedLead: readonly(selectedLead),
    filters: readonly(filters),
    pagination: readonly(pagination),
    loading: readonly(loading),
    error: readonly(error),
    
    // Computed
    hasLeads,
    hasFilters,
    
    // Funções
    fetchLeads,
    createLead,
    updateLead,
    deleteLead,
    setFilters,
    clearFilters,
    setPage
  }
}
```

## Assinatura Padrão de Services

Todos os services devem seguir esta estrutura:

```typescript
import type { SupabaseClient } from '@supabase/supabase-js'

// Tipos (podem ser importados de types/index.ts)
export interface Lead {
  id: string
  name: string
  whatsapp: string
  service_type: string
  neighborhood?: string
  message?: string
  source: string
  created_at: string
}

export interface LeadFilters {
  search?: string
  service_type?: string
  source?: string
  date_from?: string
  date_to?: string
}

export interface Pagination {
  page: number
  per_page: number
}

export interface PaginatedResult<T> {
  data: T[]
  pagination: {
    page: number
    per_page: number
    total: number
    total_pages: number
  }
}

/**
 * Buscar leads com filtros e paginação
 */
export async function getLeads(
  filters: LeadFilters = {},
  pagination: Pagination = { page: 1, per_page: 20 }
): Promise<PaginatedResult<Lead>> {
  const supabase = useSupabase()
  
  // Construir query base
  let query = supabase
    .from('leads')
    .select('*', { count: 'exact' })
  
  // Aplicar filtros
  if (filters.search) {
    query = query.or(`name.ilike.%${filters.search}%,whatsapp.ilike.%${filters.search}%`)
  }
  
  if (filters.service_type) {
    query = query.eq('service_type', filters.service_type)
  }
  
  if (filters.source) {
    query = query.eq('source', filters.source)
  }
  
  if (filters.date_from) {
    query = query.gte('created_at', filters.date_from)
  }
  
  if (filters.date_to) {
    query = query.lte('created_at', filters.date_to)
  }
  
  // Aplicar paginação
  const from = (pagination.page - 1) * pagination.per_page
  const to = from + pagination.per_page - 1
  
  query = query
    .order('created_at', { ascending: false })
    .range(from, to)
  
  // Executar query
  const { data, error, count } = await query
  
  if (error) {
    console.error('[leadsService] Erro ao buscar leads:', error)
    throw new Error(`Erro ao buscar leads: ${error.message}`)
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
}

/**
 * Criar novo lead
 */
export async function createLead(
  data: Omit<Lead, 'id' | 'created_at'>
): Promise<Lead> {
  const supabase = useSupabase()
  
  const { data: newLead, error } = await supabase
    .from('leads')
    .insert(data)
    .select()
    .single()
  
  if (error) {
    console.error('[leadsService] Erro ao criar lead:', error)
    throw new Error(`Erro ao criar lead: ${error.message}`)
  }
  
  return newLead
}

/**
 * Atualizar lead existente
 */
export async function updateLead(
  id: string,
  data: Partial<Lead>
): Promise<Lead> {
  const supabase = useSupabase()
  
  const { data: updated, error } = await supabase
    .from('leads')
    .update(data)
    .eq('id', id)
    .select()
    .single()
  
  if (error) {
    console.error('[leadsService] Erro ao atualizar lead:', error)
    throw new Error(`Erro ao atualizar lead: ${error.message}`)
  }
  
  return updated
}

/**
 * Deletar lead
 */
export async function deleteLead(id: string): Promise<void> {
  const supabase = useSupabase()
  
  const { error } = await supabase
    .from('leads')
    .delete()
    .eq('id', id)
  
  if (error) {
    console.error('[leadsService] Erro ao deletar lead:', error)
    throw new Error(`Erro ao deletar lead: ${error.message}`)
  }
}

/**
 * Buscar lead por ID
 */
export async function getLeadById(id: string): Promise<Lead> {
  const supabase = useSupabase()
  
  const { data, error } = await supabase
    .from('leads')
    .select('*')
    .eq('id', id)
    .single()
  
  if (error) {
    console.error('[leadsService] Erro ao buscar lead:', error)
    throw new Error(`Erro ao buscar lead: ${error.message}`)
  }
  
  return data
}
```

## Regras de Implementação

### 1. Tratamento de Erros

- Sempre usar try/catch em composables
- Sempre logar erros com console.error incluindo contexto
- Sempre definir `error.value` no composable
- Sempre fazer throw de erros em services para permitir tratamento no composable

### 2. Loading States

- Sempre definir `loading.value = true` antes de operações assíncronas
- Sempre definir `loading.value = false` no finally
- Nunca deixar loading travado em true

### 3. Estado Reativo

- Usar `ref()` para valores primitivos e objetos
- Usar `computed()` para valores derivados
- Retornar `readonly()` para estado que não deve ser modificado diretamente
- Nunca expor refs mutáveis diretamente

### 4. Paginação

- Sempre incluir paginação em listagens
- Padrão: 20 itens por página
- Sempre retornar total de itens e total de páginas
- Reset para página 1 ao aplicar filtros

### 5. Filtros

- Sempre permitir limpar filtros
- Sempre resetar paginação ao aplicar filtros
- Usar operadores Supabase adequados (ilike para busca, eq para igualdade)

### 6. Documentação

- Sempre incluir JSDoc em funções de service
- Sempre incluir comentários de seção em composables
- Sempre documentar tipos complexos

### 7. Limites de Linhas

- Composables: máximo 400 linhas
- Services: máximo 400 linhas
- Se ultrapassar, dividir em múltiplos arquivos (ex: `useLeadsCrud.ts`, `useLeadsFilters.ts`)

## Checklist de Implementação

Ao criar um novo módulo admin, seguir esta ordem:

- [ ] 1. Definir tipos em `app/types/index.ts`
- [ ] 2. Criar service em `server/services/<módulo>Service.ts`
- [ ] 3. Criar testes unitários do service
- [ ] 4. Criar composable em `app/composables/admin/use<Módulo>.ts`
- [ ] 5. Criar testes unitários do composable
- [ ] 6. Criar componentes de UI
- [ ] 7. Criar página admin
- [ ] 8. Executar 5 testes de segurança obrigatórios
- [ ] 9. Documentar em `docs/LOG-IMPLEMENTACAO-AREA-ADMIN.md`

## Exemplos de Uso

### Em uma página Vue

```vue
<script setup lang="ts">
const { 
  leads, 
  loading, 
  error, 
  fetchLeads, 
  setFilters 
} = useLeads()

// Carregar leads ao montar
onMounted(() => {
  fetchLeads()
})

// Aplicar filtro
const handleSearch = (search: string) => {
  setFilters({ search })
  fetchLeads()
}
</script>
```

### Em um teste

```typescript
import { describe, it, expect, vi } from 'vitest'
import { useLeads } from '~/composables/admin/useLeads'

describe('useLeads', () => {
  it('deve buscar leads com sucesso', async () => {
    const { leads, fetchLeads, loading } = useLeads()
    
    await fetchLeads()
    
    expect(loading.value).toBe(false)
    expect(leads.value).toBeInstanceOf(Array)
  })
})
```

## Próximos Passos

Após padronização estar completa:

1. Implementar módulo de Dashboard (Fase 1)
2. Implementar módulo de Leads (Fase 1)
3. Implementar módulo de Orçamentos (Fase 2)
4. Continuar conforme plano de execução

---

**Última atualização**: 27/02/2026  
**Responsável**: Kiro AI
