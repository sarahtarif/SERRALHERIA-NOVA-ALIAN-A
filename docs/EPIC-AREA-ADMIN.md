# ÉPICO: Painel Administrativo Nova Aliança

**Data de Criação:** 26/02/2026  
**Status:** 🚧 Em Planejamento  
**Prioridade:** Alta

---

## 📋 Visão Geral

Criar um painel administrativo interno para gestão de leads, orçamentos, serviços e pós-venda da Serralheria Nova Aliança, permitindo que o time comercial, operacional e financeiro tenha visibilidade completa do funil de vendas e operações.

## 🎯 Objetivos de Negócio

1. Centralizar gestão de leads vindos de múltiplas fontes (WhatsApp, telefone, formulários)
2. Aumentar taxa de conversão através de melhor acompanhamento
3. Otimizar agenda de instalações
4. Melhorar controle financeiro básico
5. Gerar insights através de métricas e relatórios

## 👥 Personas e Papéis

### 1. Admin (Donos/Gestores)
- Acesso total ao sistema
- Configura serviços, usuários, permissões
- Visualiza todos os módulos e relatórios

### 2. Comercial
- Gerencia leads e orçamentos
- Faz follow-ups
- Envia propostas
- Marca status de negociação

### 3. Operacional/Instalação
- Visualiza agenda de serviços
- Atualiza status de execução
- Registra materiais utilizados
- Marca conclusão de serviços

### 4. Financeiro
- Visualiza status de pagamento
- Marca serviços como pagos/pendentes
- Gera relatórios financeiros básicos

---

## 🏗️ Arquitetura do Sistema

### Módulos Principais

```
/admin
├── /dashboard          # Visão geral com KPIs
├── /leads             # Gestão de leads
├── /orcamentos        # Orçamentos e propostas
├── /servicos          # Serviços em execução
├── /agenda            # Calendário de instalações
├── /clientes          # Base de clientes
├── /financeiro        # Controle financeiro
├── /catalogo          # Catálogo de serviços/produtos
├── /usuarios          # Gestão de usuários (futuro)
└── /relatorios        # Relatórios e analytics (futuro)
```

### Stack Tecnológico

- **Frontend:** Nuxt 4 + Vue 3 + TypeScript
- **Styling:** Tailwind CSS + Design System existente
- **Backend:** Supabase (PostgreSQL + Auth + RLS)
- **State:** Composables Vue + useState
- **Validação:** Zod ou similar
- **Charts:** Chart.js ou similar (para dashboards)

---

## 📊 Histórias de Usuário

### Sprint 1: Dashboard e Leads (MVP)

#### US-1.1: Dashboard com KPIs Principais
**Como** gestor  
**Quero** ver um dashboard com métricas principais  
**Para** ter visão rápida do negócio

**Critérios de Aceite:**
- [ ] Exibe total de leads do mês
- [ ] Exibe taxa de conversão
- [ ] Exibe serviços agendados para hoje/semana
- [ ] Exibe receita do mês (básico)
- [ ] Cards com cores do design system
- [ ] Atualização em tempo real ou com botão refresh
- [ ] Loading states durante carregamento
- [ ] Tratamento de erro se API falhar

**DoD:**
- Componente testado em mobile e desktop
- Dados mockados funcionando
- Integração com API real (ou preparada para)
- Documentação de uso

---

#### US-1.2: Lista de Leads com Filtros
**Como** atendente comercial  
**Quero** ver lista de todos os leads com filtros  
**Para** priorizar atendimentos

**Critérios de Aceite:**
- [ ] Lista paginada (20 itens por página)
- [ ] Filtros: data, origem, status, bairro
- [ ] Busca por nome/telefone
- [ ] Ordenação por data (mais recente primeiro)
- [ ] Badge colorido por status
- [ ] Ações rápidas: ver detalhes, mudar status
- [ ] Indicador visual de leads não atendidos (> 2h)
- [ ] Export para CSV (futuro)

**Campos Exibidos:**
- Nome do lead
- Telefone/WhatsApp
- Origem (WhatsApp, Telefone, Formulário Site)
- Tipo de serviço
- Bairro
- Data/hora de entrada
- Status atual
- Última interação

**Status Possíveis:**
- 🆕 Novo (cinza)
- 📞 Em Contato (amarelo)
- 📋 Proposta Enviada (azul)
- ✅ Fechado (verde)
- ❌ Perdido (vermelho)

---

#### US-1.3: Detalhes e Edição de Lead
**Como** comercial  
**Quero** ver detalhes completos de um lead e editá-lo  
**Para** registrar interações e atualizar informações

**Critérios de Aceite:**
- [ ] Modal ou página com todos os dados do lead
- [ ] Histórico de interações (timeline)
- [ ] Adicionar nota/comentário
- [ ] Mudar status
- [ ] Editar informações básicas
- [ ] Vincular a orçamento
- [ ] Botão para abrir WhatsApp direto
- [ ] Botão para ligar (tel:)
- [ ] Salvar alterações com feedback visual

---

#### US-1.4: Criar Lead Manualmente
**Como** comercial  
**Quero** criar um lead manualmente  
**Para** registrar contatos que chegam por telefone

**Critérios de Aceite:**
- [ ] Formulário com campos obrigatórios
- [ ] Validação em tempo real
- [ ] Origem marcada como "Telefone" ou "Presencial"
- [ ] Criação com status "Novo"
- [ ] Feedback de sucesso/erro
- [ ] Redirecionamento para detalhes após criar

---

### Sprint 2: Orçamentos e Serviços

#### US-2.1: Criar Orçamento a partir de Lead
**Como** comercial  
**Quero** criar um orçamento vinculado a um lead  
**Para** formalizar proposta

**Critérios de Aceite:**
- [ ] Formulário com itens de serviço
- [ ] Adicionar múltiplos itens
- [ ] Calcular total automaticamente
- [ ] Adicionar desconto
- [ ] Adicionar observações
- [ ] Gerar PDF (futuro)
- [ ] Enviar por WhatsApp/Email (futuro)
- [ ] Salvar como rascunho

---

#### US-2.2: Lista de Serviços em Execução
**Como** operacional  
**Quero** ver lista de serviços agendados/em execução  
**Para** organizar equipe

**Critérios de Aceite:**
- [ ] Lista filtrada por data
- [ ] Agrupamento por status
- [ ] Informações: cliente, endereço, tipo, data
- [ ] Ações: marcar como iniciado, concluído
- [ ] Adicionar fotos do serviço
- [ ] Registrar materiais usados

---

### Sprint 3: Agenda e Calendário

#### US-3.1: Visualização de Agenda
**Como** gestor  
**Quero** ver calendário de serviços agendados  
**Para** planejar recursos

**Critérios de Aceite:**
- [ ] Visualização mensal/semanal/diária
- [ ] Cores por tipo de serviço
- [ ] Clique para ver detalhes
- [ ] Arrastar para reagendar (futuro)
- [ ] Filtro por equipe/técnico
- [ ] Export para Google Calendar (futuro)

---

### Sprint 4: Financeiro Básico

#### US-4.1: Controle de Pagamentos
**Como** financeiro  
**Quero** marcar status de pagamento dos serviços  
**Para** controlar recebíveis

**Critérios de Aceite:**
- [ ] Lista de serviços com status financeiro
- [ ] Status: Pago, Pendente, Parcial, Negociação
- [ ] Registrar forma de pagamento
- [ ] Registrar data de pagamento
- [ ] Calcular total recebido no período
- [ ] Alertas de pagamentos atrasados

---

## 🎨 Design e UX

### Layout Geral

```
┌─────────────────────────────────────────────────┐
│  [Logo] Nova Aliança Admin    [User] [Logout]   │
├──────────┬──────────────────────────────────────┤
│          │                                       │
│ Sidebar  │         Main Content                 │
│          │                                       │
│ • Dash   │  ┌─────────────────────────────┐    │
│ • Leads  │  │                             │    │
│ • Orçam  │  │      Page Content           │    │
│ • Serv   │  │                             │    │
│ • Agenda │  │                             │    │
│ • Client │  └─────────────────────────────┘    │
│ • Financ │                                       │
│          │                                       │
└──────────┴──────────────────────────────────────┘
```

### Cores e Status

```css
/* Status de Leads */
.status-novo { @apply bg-gray-100 text-gray-800; }
.status-contato { @apply bg-yellow-100 text-yellow-800; }
.status-proposta { @apply bg-blue-100 text-blue-800; }
.status-fechado { @apply bg-green-100 text-green-800; }
.status-perdido { @apply bg-red-100 text-red-800; }

/* Status de Serviços */
.status-agendado { @apply bg-blue-100 text-blue-800; }
.status-execucao { @apply bg-orange-100 text-orange-800; }
.status-concluido { @apply bg-green-100 text-green-800; }
.status-cancelado { @apply bg-red-100 text-red-800; }
```

---

## 📈 Métricas e KPIs

### Métricas de Leads
- Total de leads por período
- Taxa de conversão (%)
- Tempo médio de resposta
- Leads por origem
- Leads por bairro
- Taxa de perda e motivos

### Métricas de Serviços
- Serviços agendados vs concluídos
- Tempo médio de execução
- Serviços por tipo
- Satisfação do cliente (NPS - futuro)

### Métricas Financeiras
- Receita do mês
- Ticket médio
- Taxa de inadimplência
- Formas de pagamento mais usadas

---

## 🔐 Segurança e Permissões

### Níveis de Acesso

| Módulo | Admin | Comercial | Operacional | Financeiro |
|--------|-------|-----------|-------------|------------|
| Dashboard | ✅ | ✅ | ✅ | ✅ |
| Leads | ✅ | ✅ | 👁️ | ❌ |
| Orçamentos | ✅ | ✅ | 👁️ | ✅ |
| Serviços | ✅ | ✅ | ✅ | 👁️ |
| Agenda | ✅ | ✅ | ✅ | ❌ |
| Financeiro | ✅ | ❌ | ❌ | ✅ |
| Usuários | ✅ | ❌ | ❌ | ❌ |

✅ = Acesso total | 👁️ = Somente leitura | ❌ = Sem acesso

---

## 🗄️ Modelo de Dados

### Tabela: leads
```sql
- id (uuid)
- name (text)
- whatsapp (text)
- email (text, nullable)
- service_type (text)
- neighborhood (text)
- message (text, nullable)
- source (enum: 'whatsapp', 'phone', 'website', 'presencial')
- status (enum: 'novo', 'em_contato', 'proposta', 'fechado', 'perdido')
- assigned_to (uuid, nullable) -- usuário responsável
- created_at (timestamp)
- updated_at (timestamp)
- last_interaction_at (timestamp, nullable)
```

### Tabela: orcamentos
```sql
- id (uuid)
- lead_id (uuid, FK)
- client_profile_id (uuid, FK, nullable)
- items (jsonb) -- array de itens
- subtotal (decimal)
- discount (decimal)
- total (decimal)
- notes (text)
- status (enum: 'rascunho', 'enviado', 'aprovado', 'rejeitado')
- valid_until (date)
- created_by (uuid, FK)
- created_at (timestamp)
- updated_at (timestamp)
```

### Tabela: servicos (já existe como 'requests')
- Usar tabela existente `requests` com adaptações

---

## 🚀 Roadmap de Implementação

### Fase 1: MVP (2-3 semanas)
- ✅ Autenticação admin (já existe)
- 🚧 Layout admin base
- 🚧 Dashboard com KPIs básicos
- 🚧 CRUD de leads
- 🚧 Lista de serviços

### Fase 2: Orçamentos (1-2 semanas)
- Criar orçamento
- Vincular lead → orçamento → serviço
- PDF de orçamento

### Fase 3: Agenda (1 semana)
- Calendário de serviços
- Filtros e visualizações

### Fase 4: Financeiro (1 semana)
- Controle de pagamentos
- Relatórios básicos

### Fase 5: Melhorias (contínuo)
- Notificações
- Relatórios avançados
- Integrações (WhatsApp API, etc.)
- Mobile app (futuro)

---

## 📝 Definição de Pronto (DoD)

Para considerar o épico completo:

- [ ] Todos os módulos da Fase 1 implementados
- [ ] Testes manuais realizados
- [ ] Documentação de uso criada
- [ ] Deploy em produção
- [ ] Treinamento do time realizado
- [ ] Feedback inicial coletado
- [ ] Bugs críticos corrigidos
- [ ] Performance aceitável (< 2s carregamento)
- [ ] Mobile responsivo
- [ ] Segurança validada (RLS, permissões)

---

## 📚 Referências

- PRD do sistema: `docs/PRD.md`
- Design System: `DESIGN_SYSTEM.md`
- Schema do banco: `supabase-schema.sql`
- Área de clientes: `docs/EPIC-AREA-CLIENTES.md`

---

**Última Atualização:** 26/02/2026  
**Responsável:** Equipe de Desenvolvimento  
**Stakeholders:** Gestores, Comercial, Operacional, Financeiro
