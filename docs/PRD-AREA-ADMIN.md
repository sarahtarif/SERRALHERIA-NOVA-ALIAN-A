# PRD - Área Administrativa Nova Aliança

**Versão:** 1.0  
**Data:** 26 de fevereiro de 2026  
**Autor:** Equipe de Produto  
**Status:** 🚧 Em Desenvolvimento

---

## 📋 Índice

1. [Visão Geral](#1-visão-geral)
2. [Estado Atual (O que já existe)](#2-estado-atual-o-que-já-existe)
3. [Objetivos de Negócio](#3-objetivos-de-negócio)
4. [Personas e Usuários](#4-personas-e-usuários)
5. [Funcionalidades a Desenvolver](#5-funcionalidades-a-desenvolver)
6. [Especificações Detalhadas por Módulo](#6-especificações-detalhadas-por-módulo)
7. [Fluxos de Usuário](#7-fluxos-de-usuário)
8. [Design e Interface](#8-design-e-interface)
9. [Modelo de Dados](#9-modelo-de-dados)
10. [Roadmap e Fases](#10-roadmap-e-fases)
11. [Critérios de Sucesso](#11-critérios-de-sucesso)

---

## 1. Visão Geral

### 1.1 Contexto

A Serralheria Nova Aliança precisa de um sistema interno de gestão para centralizar e otimizar
o gerenciamento de leads, orçamentos, serviços e relacionamento com clientes.

### 1.2 Proposta de Solução

Desenvolver uma área administrativa web completa que permita ao time interno gerenciar
todo o ciclo de vendas e operações, desde a captação do lead até o pós-venda.

### 1.3 Escopo do Projeto

**Incluído:**
- Dashboard com KPIs e métricas
- Gestão completa de leads
- Sistema de orçamentos
- Controle de serviços e instalações
- Agenda visual de serviços
- Base de dados de clientes
- Controle financeiro básico
- Relatórios e exportações

**Fora do Escopo (Futuro):**
- App mobile nativo
- Integração com WhatsApp Business API
- Sistema de comissões
- Gestão de estoque
- CRM avançado com automações



---

## 2. Estado Atual (O que já existe)

### 2.1 ✅ Implementado

#### Autenticação e Segurança
- ✅ Sistema de login seguro em `/auth/secure/admin-access`
- ✅ Autenticação via Supabase Auth
- ✅ Middleware de verificação de role admin
- ✅ Rate limiting (proteção contra brute force)
- ✅ Sessão segura com JWT
- ✅ Página de boas-vindas com informações de segurança

#### Layout e Navegação
- ✅ Layout administrativo (`AdminLayout.vue`)
- ✅ Sidebar com navegação para 7 módulos
- ✅ Header com informações do usuário
- ✅ Menu dropdown do usuário
- ✅ Botão de logout
- ✅ Design responsivo (mobile e desktop)

#### Dashboard Básico
- ✅ Página principal em `/admin`
- ✅ 4 KPI cards (Leads, Taxa de Conversão, Serviços, Receita)
- ✅ Lista de leads recentes (dados mockados)
- ✅ Card de ações rápidas
- ✅ Badges de status coloridos

#### Infraestrutura
- ✅ Banco de dados Supabase configurado
- ✅ Tabelas criadas: profiles, clients, leads, requests, jobs, job_items
- ✅ RLS (Row Level Security) configurado
- ✅ Composable `useAuth` para autenticação
- ✅ Tipos TypeScript definidos

### 2.2 ⚠️ Parcialmente Implementado

- ⚠️ Dashboard com dados mockados (precisa conectar com API real)
- ⚠️ Rotas definidas na sidebar mas páginas não criadas

### 2.3 ❌ Não Implementado (A Desenvolver)

- ❌ Módulo de Leads (CRUD completo)
- ❌ Módulo de Orçamentos
- ❌ Módulo de Serviços
- ❌ Módulo de Agenda
- ❌ Módulo de Clientes
- ❌ Módulo de Financeiro
- ❌ Relatórios e exportações
- ❌ Sistema de notificações
- ❌ Busca global
- ❌ Filtros avançados



---

## 3. Objetivos de Negócio

### 3.1 Objetivos Primários

1. **Aumentar Taxa de Conversão de Leads**
   - Situação Atual: ~20% dos leads viram clientes
   - Meta: 35% em 6 meses
   - Como: Melhor acompanhamento, follow-up sistemático, histórico de interações

2. **Reduzir Tempo de Resposta**
   - Situação Atual: Média de 4 horas para primeira resposta
   - Meta: 100% dos leads respondidos em até 1 hora
   - Como: Alertas, priorização automática, notificações

3. **Otimizar Agenda de Instalações**
   - Situação Atual: 60% de utilização, muito tempo ocioso
   - Meta: 85% de utilização
   - Como: Visualização clara, agrupamento por região, otimização de rotas

4. **Melhorar Controle Financeiro**
   - Situação Atual: 15% de inadimplência
   - Meta: Reduzir para 9%
   - Como: Acompanhamento de pagamentos, alertas de atraso

### 3.2 Métricas de Sucesso

| Métrica | Baseline | Meta 3 meses | Meta 6 meses |
|---------|----------|--------------|--------------|
| Taxa de Conversão | 20% | 28% | 35% |
| Tempo Médio de Resposta | 4h | 2h | 1h |
| Leads Perdidos | 30% | 15% | 5% |
| Utilização da Agenda | 60% | 75% | 85% |
| Inadimplência | 15% | 10% | 9% |
| Satisfação do Time | - | 7/10 | 8/10 |

### 3.3 ROI Esperado

**Investimento:**
- Desenvolvimento: ~80 horas
- Treinamento: 4 horas
- Manutenção mensal: 4 horas

**Retorno Esperado (6 meses):**
- Aumento de 15% na conversão = +18 clientes/mês
- Ticket médio: R$ 1.500
- Receita adicional: R$ 27.000/mês
- ROI: 300% em 6 meses



---

## 4. Personas e Usuários

### 4.1 Persona 1: Gestor/Proprietário

**Perfil:**
- Nome: Carlos Silva
- Idade: 45 anos
- Cargo: Proprietário
- Tech Savvy: Médio

**Objetivos:**
- Ter visão completa do negócio
- Identificar gargalos e oportunidades
- Tomar decisões baseadas em dados
- Controlar rentabilidade

**Dores:**
- Não sabe quantos leads são perdidos
- Dificuldade em prever receita
- Falta de visibilidade da equipe
- Relatórios manuais demorados

**Uso do Sistema:**
- Acessa dashboard diariamente
- Revisa relatórios semanalmente
- Configura usuários e permissões
- Exporta dados para análise

**Permissões:** Acesso total a todos os módulos

---

### 4.2 Persona 2: Atendente Comercial

**Perfil:**
- Nome: Juliana Santos
- Idade: 28 anos
- Cargo: Atendente Comercial
- Tech Savvy: Alto

**Objetivos:**
- Responder leads rapidamente
- Acompanhar negociações
- Criar orçamentos profissionais
- Bater metas de conversão

**Dores:**
- Leads chegam por múltiplos canais
- Difícil lembrar de follow-up
- Orçamentos manuais no Excel
- Não sabe quais leads priorizar

**Uso do Sistema:**
- Acessa várias vezes ao dia
- Gerencia leads e orçamentos
- Atualiza status constantemente
- Usa filtros e busca

**Permissões:** Leads (total), Orçamentos (total), Serviços (leitura), Clientes (leitura)

---

### 4.3 Persona 3: Técnico/Instalador

**Perfil:**
- Nome: Roberto Oliveira
- Idade: 35 anos
- Cargo: Técnico
- Tech Savvy: Baixo

**Objetivos:**
- Ver agenda do dia
- Saber detalhes dos serviços
- Registrar conclusão
- Tirar fotos do trabalho

**Dores:**
- Agenda passada por WhatsApp
- Falta de informações
- Não sabe se tem material
- Difícil comprovar trabalho

**Uso do Sistema:**
- Acessa pela manhã (agenda do dia)
- Marca serviços como concluídos
- Faz upload de fotos
- Interface simples e direta

**Permissões:** Agenda (leitura), Serviços (atualizar status e fotos)

---

### 4.4 Persona 4: Financeiro

**Perfil:**
- Nome: Ana Paula Costa
- Idade: 32 anos
- Cargo: Assistente Financeiro
- Tech Savvy: Médio

**Objetivos:**
- Controlar recebimentos
- Identificar atrasos
- Gerar relatórios
- Conciliar valores

**Dores:**
- Controle manual em planilhas
- Difícil rastrear parciais
- Sem aviso de atrasos
- Relatórios demorados

**Uso do Sistema:**
- Acessa diariamente
- Marca pagamentos recebidos
- Gera relatórios semanais
- Monitora inadimplência

**Permissões:** Financeiro (total), Serviços (leitura), Clientes (leitura)



---

## 5. Funcionalidades a Desenvolver

### 5.1 Prioridade ALTA (Sprint 1-2)

#### 📊 Dashboard com Dados Reais
**Status:** Parcial (existe com dados mock)  
**A Fazer:**
- Conectar KPIs com queries Supabase
- Calcular métricas reais (conversão, crescimento)
- Atualizar leads recentes com dados do banco
- Adicionar gráficos (Chart.js)
- Implementar refresh automático

#### 👥 Módulo de Leads Completo
**Status:** Não existe  
**A Fazer:**
- Página de listagem (`/admin/leads`)
- Filtros (status, origem, serviço, período)
- Busca por nome/telefone
- Criar lead manualmente
- Visualizar detalhes (modal ou página)
- Editar lead
- Mudar status
- Adicionar notas/comentários
- Histórico de interações
- Botões de ação (WhatsApp, telefone, email)
- Indicador visual de leads não respondidos
- Paginação

#### 📋 Módulo de Orçamentos Básico
**Status:** Não existe  
**A Fazer:**
- Página de listagem (`/admin/orcamentos`)
- Criar orçamento
- Adicionar itens de serviço
- Calcular total automaticamente
- Aplicar desconto
- Visualizar orçamento
- Editar orçamento (rascunho)
- Mudar status (Rascunho, Enviado, Aprovado, Rejeitado)



### 5.2 Prioridade MÉDIA (Sprint 3-4)

#### 🔧 Módulo de Serviços
**Status:** Não existe  
**A Fazer:**
- Página de listagem (`/admin/servicos`)
- Criar serviço (manual ou de orçamento)
- Visualizar detalhes
- Atualizar status (Agendado, Em Execução, Concluído, Cancelado)
- Registrar itens instalados
- Upload de fotos
- Reagendar serviço
- Filtros e busca

#### 📅 Módulo de Agenda
**Status:** Não existe  
**A Fazer:**
- Visualização mensal (calendário)
- Visualização semanal
- Visualização diária
- Filtros (técnico, tipo, região, status)
- Cores por tipo de serviço
- Clicar para ver detalhes
- Indicador de conflitos

#### 👤 Módulo de Clientes
**Status:** Não existe  
**A Fazer:**
- Página de listagem (`/admin/clientes`)
- Visualizar perfil do cliente
- Histórico de serviços
- Histórico de orçamentos
- Editar informações
- Busca e filtros

### 5.3 Prioridade BAIXA (Sprint 5-6)

#### 💰 Módulo Financeiro
**Status:** Não existe  
**A Fazer:**
- Página de controle (`/admin/financeiro`)
- Lista de serviços com status de pagamento
- Marcar como pago/pendente
- Registrar forma de pagamento
- Registrar data de pagamento
- Alertas de atraso
- Relatório de receita

#### 📊 Relatórios e Exportações
**Status:** Não existe  
**A Fazer:**
- Relatório de conversão
- Relatório de receita
- Relatório de serviços
- Exportar para CSV/Excel
- Filtros por período

#### 🔔 Sistema de Notificações
**Status:** Não existe  
**A Fazer:**
- Notificações in-app
- Badge de contador
- Tipos: novo lead, follow-up, pagamento atrasado
- Marcar como lida



---

## 6. Especificações Detalhadas por Módulo

### 6.1 📊 Dashboard

#### Objetivo
Fornecer visão rápida e consolidada do negócio com métricas principais.

#### Componentes

**KPI Cards (4 cards no topo):**

1. **Leads do Mês**
   - Valor: Total de leads recebidos no mês atual
   - Comparação: % vs mês anterior
   - Cor: Azul (#0056E0)
   - Ícone: Grupo de pessoas
   - Query: `COUNT(*) FROM leads WHERE created_at >= início_do_mês`

2. **Taxa de Conversão**
   - Valor: % de leads que viraram clientes
   - Comparação: % vs mês anterior
   - Cor: Verde (#10B981)
   - Ícone: Check circle
   - Cálculo: `(leads_fechados / total_leads) * 100`

3. **Serviços Esta Semana**
   - Valor: Total de serviços agendados na semana
   - Detalhe: Quantos são hoje
   - Cor: Laranja (#F97316)
   - Ícone: Calendário
   - Query: `COUNT(*) FROM requests WHERE scheduled_at BETWEEN início_semana AND fim_semana`

4. **Receita do Mês**
   - Valor: Soma de serviços pagos no mês
   - Comparação: % vs mês anterior
   - Cor: Verde (#10B981)
   - Ícone: Cifrão
   - Query: `SUM(valor) FROM payments WHERE paid_at >= início_do_mês`

**Leads Recentes (Card grande):**
- Lista dos 5 leads mais recentes
- Mostrar: nome, serviço, bairro, tempo decorrido, status
- Badge colorido por status
- Link "Ver todos →" para `/admin/leads`
- Atualizar a cada 5 minutos

**Ações Rápidas (Card lateral):**
- Botão: Novo Lead → `/admin/leads/novo`
- Botão: Novo Serviço → `/admin/servicos/novo`
- Botão: Ver Agenda → `/admin/agenda`
- Cada botão com ícone e cor diferente

**Gráficos (Futuro - Sprint 3):**
- Gráfico de pizza: Leads por origem
- Gráfico de linha: Conversão por semana
- Gráfico de barras: Serviços por tipo



### 6.2 👥 Módulo de Leads

#### Objetivo
Gerenciar todos os leads desde a captação até a conversão em cliente.

#### Página de Listagem (`/admin/leads`)

**Layout:**
```
┌─────────────────────────────────────────────────────────┐
│ [Buscar...] [Filtros ▼] [+ Novo Lead]                  │
├─────────────────────────────────────────────────────────┤
│ ┌─────────────────────────────────────────────────────┐ │
│ │ João Silva                    [Novo]                │ │
│ │ Rede para Sacada • Moema                            │ │
│ │ (11) 98765-4321 • Há 15 minutos                     │ │
│ │ [WhatsApp] [Ligar] [Ver Detalhes]                   │ │
│ └─────────────────────────────────────────────────────┘ │
│ ┌─────────────────────────────────────────────────────┐ │
│ │ Maria Santos                  [Em Contato]          │ │
│ │ Proteção para Pets • Pinheiros                      │ │
│ │ (11) 91234-5678 • Há 2 horas                        │ │
│ │ [WhatsApp] [Ligar] [Ver Detalhes]                   │ │
│ └─────────────────────────────────────────────────────┘ │
│                                                         │
│ [← Anterior] Página 1 de 5 [Próxima →]                 │
└─────────────────────────────────────────────────────────┘
```

**Campos Exibidos:**
- Nome do lead
- Tipo de serviço
- Bairro
- Telefone/WhatsApp
- Tempo desde criação
- Status (badge colorido)
- Botões de ação

**Filtros:**
- Status: Todos, Novo, Em Contato, Proposta, Fechado, Perdido
- Origem: Todos, WhatsApp, Telefone, Site, Presencial
- Serviço: Todos, Redes, Portões, Câmeras, etc.
- Período: Hoje, Últimos 7 dias, Últimos 30 dias, Personalizado
- Responsável: Todos, Juliana, Carlos, etc.

**Busca:**
- Por nome (mínimo 3 caracteres)
- Por telefone (busca parcial)
- Busca em tempo real (debounce 300ms)

**Ordenação:**
- Padrão: Mais recente primeiro
- Opções: Data (asc/desc), Nome (A-Z), Status

**Paginação:**
- 20 itens por página
- Botões: Anterior, Próxima
- Indicador: "Página X de Y"

**Indicadores Visuais:**
- 🔴 Leads não respondidos (> 2 horas): borda vermelha
- ⏰ Leads aguardando follow-up: ícone de relógio
- ⭐ Leads prioritários: estrela amarela



#### Criar Lead (`/admin/leads/novo`)

**Formulário:**

```
Nome Completo *
[_____________________________]

Telefone/WhatsApp *
[_____________________________]
Formato: (11) 98765-4321

Email (opcional)
[_____________________________]

Tipo de Serviço *
[Selecione ▼]
- Redes para Sacadas
- Redes para Varandas
- Proteção para Pets
- Proteção para Idosos
- Portões Automáticos
- Câmeras de Segurança
- Interfones
- Outro

Bairro/Região *
[_____________________________]

Origem *
( ) Telefone
( ) Presencial
( ) Indicação

Mensagem/Observações
[_____________________________]
[_____________________________]
[_____________________________]

[Cancelar] [Salvar Lead]
```

**Validações:**
- Nome: obrigatório, mínimo 3 caracteres
- Telefone: obrigatório, formato brasileiro (11) 9XXXX-XXXX
- Email: formato válido se preenchido
- Serviço: obrigatório
- Bairro: obrigatório

**Comportamento:**
- Ao salvar: criar lead com status "Novo"
- Redirecionar para detalhes do lead criado
- Mostrar toast de sucesso
- Se erro: mostrar mensagem e manter dados preenchidos



#### Detalhes do Lead (`/admin/leads/[id]`)

**Layout:**

```
┌─────────────────────────────────────────────────────────┐
│ ← Voltar                                    [Editar]    │
├─────────────────────────────────────────────────────────┤
│ João Silva                                              │
│ [Novo ▼] Mudar Status                                   │
│                                                         │
│ 📞 (11) 98765-4321  [WhatsApp] [Ligar]                 │
│ 📧 joao@email.com   [Enviar Email]                      │
│ 📍 Moema, São Paulo                                     │
│ 🏠 Rede para Sacada                                     │
│ 📱 Origem: Site                                         │
│ 📅 Criado: 26/02/2026 às 14:30                         │
│                                                         │
├─────────────────────────────────────────────────────────┤
│ HISTÓRICO DE INTERAÇÕES                                │
├─────────────────────────────────────────────────────────┤
│ ● 26/02 14:45 - Juliana Santos                         │
│   Primeiro contato via WhatsApp. Cliente interessado.  │
│                                                         │
│ ● 26/02 14:30 - Sistema                                │
│   Lead criado via formulário do site                   │
├─────────────────────────────────────────────────────────┤
│ ADICIONAR NOTA                                          │
│ [_____________________________________________]          │
│ [_____________________________________________]          │
│ [Adicionar Nota]                                        │
└─────────────────────────────────────────────────────────┘
```

**Informações Exibidas:**
- Nome completo
- Status atual (dropdown para mudar)
- Telefone com botões de ação
- Email com botão de ação
- Endereço/bairro
- Tipo de serviço
- Origem
- Data/hora de criação
- Responsável (se atribuído)
- Última interação

**Ações Disponíveis:**
- Editar informações
- Mudar status
- Adicionar nota
- Atribuir responsável
- Criar orçamento
- Converter em cliente
- Excluir lead (com confirmação)

**Histórico:**
- Timeline reversa (mais recente no topo)
- Cada entrada mostra: data/hora, usuário, ação/nota
- Tipos de entrada:
  - Criação do lead
  - Mudança de status
  - Notas adicionadas
  - Orçamento criado
  - Email enviado
  - Ligação registrada

**Mudar Status:**
- Dropdown com opções: Novo, Em Contato, Proposta Enviada, Fechado, Perdido
- Se "Perdido": modal para selecionar motivo
  - Preço alto
  - Não respondeu
  - Contratou concorrente
  - Desistiu do serviço
  - Outro (campo texto)
- Se "Fechado": opção para criar serviço automaticamente



### 6.3 📋 Módulo de Orçamentos

#### Objetivo
Criar orçamentos profissionais com cálculo automático de impostos e geração de PDF.

#### Criar/Editar Orçamento (`/admin/orcamentos/novo`)

**Seção 1: Informações do Cliente**
```
Cliente *
[Buscar cliente existente ▼] ou [+ Novo Cliente]

Nome: João Silva
Telefone: (11) 98765-4321
Email: joao@email.com
CPF/CNPJ: 123.456.789-00
Endereço: Rua das Flores, 123 - Moema, SP
```

**Seção 2: Itens do Orçamento**
```
┌─────────────────────────────────────────────────────────────────┐
│ Item | Descrição | Qtd | Valor Unit. | Subtotal | [Ações]      │
├─────────────────────────────────────────────────────────────────┤
│ 1    | Rede de Proteção 3x2m | 2 | R$ 250,00 | R$ 500,00 | [✏️][🗑️] │
│ 2    | Instalação           | 1 | R$ 200,00 | R$ 200,00 | [✏️][🗑️] │
└─────────────────────────────────────────────────────────────────┘
[+ Adicionar Item]
```

**Seção 3: Cálculo de Impostos (Configurável)**
```
Subtotal:                           R$ 700,00

┌─ IMPOSTOS (Configurável) ─────────────────────┐
│ ☑ ISS (5%)                    R$ 35,00        │
│ ☑ PIS (0,65%)                 R$ 4,55         │
│ ☑ COFINS (3%)                 R$ 21,00        │
│ ☑ IRPJ (1,2%)                 R$ 8,40         │
│ ☑ CSLL (1,08%)                R$ 7,56         │
│ ☐ ICMS (Não aplicável)        R$ 0,00         │
│                                                │
│ [⚙️ Configurar Impostos]                       │
└────────────────────────────────────────────────┘

Total de Impostos:                  R$ 76,51

Desconto:
( ) Percentual [___]%  ( ) Valor Fixo R$ [_____]
                                    - R$ 0,00

VALOR TOTAL:                        R$ 776,51
```

**Seção 4: Condições e Observações**
```
Forma de Pagamento *
[Selecione ▼]
- À vista (Pix/Dinheiro) - 5% desconto
- Cartão de crédito (até 3x sem juros)
- Cartão de débito
- Boleto bancário
- Transferência bancária

Validade do Orçamento *
[15] dias (padrão: 15 dias)

Prazo de Execução
[5] dias úteis após aprovação

Garantia
[12] meses

Observações
[_____________________________________________]
[_____________________________________________]
[_____________________________________________]

Termos e Condições
☑ Incluir termos padrão da empresa
[Editar Termos]
```

**Ações:**
```
[Salvar Rascunho] [Gerar PDF] [Enviar por Email] [Enviar por WhatsApp]
```



#### Configuração de Impostos (`/admin/configuracoes/impostos`)

**Objetivo:** Permitir configurar alíquotas de impostos personalizadas.

```
┌─ CONFIGURAÇÃO DE IMPOSTOS ────────────────────────────────┐
│                                                            │
│ Regime Tributário                                          │
│ ( ) Simples Nacional                                       │
│ ( ) Lucro Presumido                                        │
│ ( ) Lucro Real                                             │
│ (•) Personalizado                                          │
│                                                            │
│ ┌─ Impostos Federais ─────────────────────────────────┐   │
│ │ ☑ PIS                                               │   │
│ │   Alíquota: [0.65] %                                │   │
│ │   Aplicar sobre: (•) Subtotal ( ) Total             │   │
│ │                                                     │   │
│ │ ☑ COFINS                                            │   │
│ │   Alíquota: [3.00] %                                │   │
│ │   Aplicar sobre: (•) Subtotal ( ) Total             │   │
│ │                                                     │   │
│ │ ☑ IRPJ                                              │   │
│ │   Alíquota: [1.20] %                                │   │
│ │   Aplicar sobre: (•) Subtotal ( ) Total             │   │
│ │                                                     │   │
│ │ ☑ CSLL                                              │   │
│ │   Alíquota: [1.08] %                                │   │
│ │   Aplicar sobre: (•) Subtotal ( ) Total             │   │
│ └─────────────────────────────────────────────────────┘   │
│                                                            │
│ ┌─ Impostos Municipais ───────────────────────────────┐   │
│ │ ☑ ISS (Imposto Sobre Serviços)                      │   │
│ │   Alíquota: [5.00] %                                │   │
│ │   Aplicar sobre: (•) Subtotal ( ) Total             │   │
│ │   Município: São Paulo                              │   │
│ └─────────────────────────────────────────────────────┘   │
│                                                            │
│ ┌─ Impostos Estaduais ────────────────────────────────┐   │
│ │ ☐ ICMS (Imposto sobre Circulação de Mercadorias)   │   │
│ │   Alíquota: [18.00] %                               │   │
│ │   Aplicar sobre: ( ) Subtotal ( ) Total             │   │
│ └─────────────────────────────────────────────────────┘   │
│                                                            │
│ ┌─ Previsualização ───────────────────────────────────┐   │
│ │ Exemplo com R$ 1.000,00:                            │   │
│ │                                                     │   │
│ │ Subtotal:              R$ 1.000,00                  │   │
│ │ PIS (0,65%):           R$ 6,50                      │   │
│ │ COFINS (3%):           R$ 30,00                     │   │
│ │ IRPJ (1,2%):           R$ 12,00                     │   │
│ │ CSLL (1,08%):          R$ 10,80                     │   │
│ │ ISS (5%):              R$ 50,00                     │   │
│ │ ─────────────────────────────────                   │   │
│ │ Total Impostos:        R$ 109,30 (10,93%)           │   │
│ │ TOTAL:                 R$ 1.109,30                  │   │
│ └─────────────────────────────────────────────────────┘   │
│                                                            │
│ [Restaurar Padrão] [Salvar Configuração]                  │
└────────────────────────────────────────────────────────────┘
```

**Funcionalidades:**
- Ativar/desativar cada imposto individualmente
- Configurar alíquota personalizada
- Escolher base de cálculo (subtotal ou total)
- Previsualização em tempo real
- Salvar múltiplos perfis de impostos
- Aplicar perfil específico por tipo de serviço



#### Geração de PDF do Orçamento

**Especificações do PDF:**

**Layout:**
```
┌────────────────────────────────────────────────────────┐
│ [LOGO NOVA ALIANÇA]          ORÇAMENTO Nº 2026-001     │
│                              Data: 26/02/2026          │
├────────────────────────────────────────────────────────┤
│ DADOS DA EMPRESA                                       │
│ Serralheria Nova Aliança                               │
│ CNPJ: XX.XXX.XXX/XXXX-XX                              │
│ Endereço: Rua XXXXX, São Paulo - SP                   │
│ Telefone: (11) 98711-5613                             │
│ Email: contato@novaalianca.com.br                     │
├────────────────────────────────────────────────────────┤
│ DADOS DO CLIENTE                                       │
│ Nome: João Silva                                       │
│ CPF/CNPJ: 123.456.789-00                              │
│ Telefone: (11) 98765-4321                             │
│ Email: joao@email.com                                 │
│ Endereço: Rua das Flores, 123 - Moema, SP            │
├────────────────────────────────────────────────────────┤
│ ITENS DO ORÇAMENTO                                     │
│                                                        │
│ Item | Descrição          | Qtd | Valor Unit | Total  │
│ ─────┼────────────────────┼─────┼────────────┼────────│
│  1   | Rede Proteção 3x2m |  2  | R$ 250,00  | R$ 500 │
│  2   | Instalação         |  1  | R$ 200,00  | R$ 200 │
│                                                        │
│                              Subtotal: R$ 700,00       │
│                                                        │
│ IMPOSTOS                                               │
│ ISS (5%):                              R$ 35,00        │
│ PIS (0,65%):                           R$ 4,55         │
│ COFINS (3%):                           R$ 21,00        │
│ IRPJ (1,2%):                           R$ 8,40         │
│ CSLL (1,08%):                          R$ 7,56         │
│                         Total Impostos: R$ 76,51       │
│                                                        │
│                              Desconto: R$ 0,00         │
│                                                        │
│                         VALOR TOTAL: R$ 776,51         │
├────────────────────────────────────────────────────────┤
│ CONDIÇÕES                                              │
│ Forma de Pagamento: Pix/Dinheiro (5% desconto)        │
│ Validade: 15 dias                                      │
│ Prazo de Execução: 5 dias úteis                       │
│ Garantia: 12 meses                                     │
├────────────────────────────────────────────────────────┤
│ OBSERVAÇÕES                                            │
│ - Materiais de primeira qualidade                     │
│ - Mão de obra especializada                           │
│                                                        │
├────────────────────────────────────────────────────────┤
│ TERMOS E CONDIÇÕES                                     │
│ 1. Este orçamento é válido por 15 dias                │
│ 2. Valores sujeitos a alteração após validade         │
│ 3. Garantia de 12 meses para serviços                 │
│ 4. Pagamento à vista com 5% de desconto               │
│                                                        │
│ ___________________    ___________________             │
│ Serralheria Nova       Assinatura Cliente             │
│ Aliança                                                │
└────────────────────────────────────────────────────────┘
```

**Características Técnicas:**
- Formato: A4 (210x297mm)
- Biblioteca: jsPDF ou PDFKit
- Logo: PNG/SVG em alta resolução
- Fontes: Roboto ou similar
- Cores: Azul (#0056E0) e cinza (#64748B)
- Numeração automática: AAAA-NNN (2026-001)
- QR Code com link para visualização online (futuro)
- Marca d'água "ORÇAMENTO" em background
- Rodapé com dados de contato

**Ações com PDF:**
- Download direto
- Enviar por email
- Enviar por WhatsApp (link)
- Imprimir
- Salvar no perfil do cliente



### 6.4 📧 Sistema de Envio de Documentos por Email

#### Objetivo
Enviar automaticamente orçamentos, CML (Contrato de Mão de Obra e Locação) e NF-e para clientes.

#### Enviar Orçamento por Email

**Modal de Envio:**
```
┌─ ENVIAR ORÇAMENTO POR EMAIL ──────────────────────────┐
│                                                        │
│ Para: joao@email.com                                   │
│ [Editar]                                               │
│                                                        │
│ Assunto:                                               │
│ [Orçamento Nova Aliança - Nº 2026-001]                │
│                                                        │
│ Mensagem:                                              │
│ ┌────────────────────────────────────────────────┐    │
│ │ Olá João Silva,                                │    │
│ │                                                │    │
│ │ Segue em anexo o orçamento solicitado para    │    │
│ │ instalação de Rede de Proteção.               │    │
│ │                                                │    │
│ │ Valor Total: R$ 776,51                        │    │
│ │ Validade: 15 dias                             │    │
│ │                                                │    │
│ │ Estamos à disposição para esclarecer          │    │
│ │ dúvidas.                                       │    │
│ │                                                │    │
│ │ Atenciosamente,                                │    │
│ │ Equipe Nova Aliança                            │    │
│ │ (11) 98711-5613                                │    │
│ └────────────────────────────────────────────────┘    │
│                                                        │
│ Anexos:                                                │
│ ☑ Orçamento_2026-001.pdf (125 KB)                     │
│ ☐ Catálogo de Produtos (opcional)                     │
│ ☐ Portfólio de Trabalhos (opcional)                   │
│                                                        │
│ ☑ Enviar cópia para mim                               │
│ ☑ Marcar orçamento como "Enviado"                     │
│                                                        │
│ [Cancelar] [Enviar Email]                             │
└────────────────────────────────────────────────────────┘
```

**Templates de Email:**

1. **Template: Orçamento**
   - Assunto: "Orçamento Nova Aliança - Nº {numero}"
   - Corpo: Mensagem personalizada + dados do orçamento
   - Anexo: PDF do orçamento

2. **Template: CML (Contrato)**
   - Assunto: "Contrato de Serviço - Nova Aliança"
   - Corpo: Instruções para assinatura
   - Anexo: PDF do contrato
   - Link para assinatura digital (futuro)

3. **Template: NF-e**
   - Assunto: "Nota Fiscal Eletrônica - Serviço Nº {numero}"
   - Corpo: Agradecimento + informações fiscais
   - Anexos: XML da NF-e + PDF (DANFE)

4. **Template: Lembrete de Pagamento**
   - Assunto: "Lembrete: Pagamento Pendente"
   - Corpo: Dados do serviço + formas de pagamento
   - Anexo: Boleto (se aplicável)

**Configurações de Email:**
```
┌─ CONFIGURAÇÕES DE EMAIL ──────────────────────────────┐
│                                                        │
│ Servidor SMTP                                          │
│ Host: [smtp.gmail.com]                                 │
│ Porta: [587]                                           │
│ Segurança: (•) TLS ( ) SSL                            │
│                                                        │
│ Autenticação                                           │
│ Email: [contato@novaalianca.com.br]                   │
│ Senha: [••••••••••••]                                  │
│                                                        │
│ Remetente Padrão                                       │
│ Nome: [Serralheria Nova Aliança]                      │
│ Email: [contato@novaalianca.com.br]                   │
│ Email de Resposta: [contato@novaalianca.com.br]      │
│                                                        │
│ Assinatura de Email                                    │
│ ┌────────────────────────────────────────────────┐    │
│ │ Atenciosamente,                                │    │
│ │ Equipe Nova Aliança                            │    │
│ │ (11) 98711-5613                                │    │
│ │ www.novaalianca.com.br                         │    │
│ └────────────────────────────────────────────────┘    │
│                                                        │
│ [Testar Conexão] [Salvar]                             │
└────────────────────────────────────────────────────────┘
```



### 6.5 📸 Gestão de Mídia (Fotos e Vídeos)

#### Objetivo
Gerenciar fotos e vídeos do site e dos perfis de clientes através da área admin.

#### 6.5.1 Galeria do Site (`/admin/galeria`)

**Layout:**
```
┌─────────────────────────────────────────────────────────┐
│ GALERIA DO SITE                                         │
│ [+ Upload Fotos/Vídeos] [Filtros ▼] [Buscar...]       │
├─────────────────────────────────────────────────────────┤
│ ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐       │
│ │ [IMG]   │ │ [IMG]   │ │ [▶️ VID]│ │ [IMG]   │       │
│ │ Portão  │ │ Rede    │ │ Motor   │ │ Câmera  │       │
│ │ Moema   │ │ Sacada  │ │ Portão  │ │ Segur.  │       │
│ │ [✏️][🗑️] │ │ [✏️][🗑️] │ │ [✏️][🗑️] │ │ [✏️][🗑️] │       │
│ └─────────┘ └─────────┘ └─────────┘ └─────────┘       │
│                                                         │
│ [Carregar Mais]                                         │
└─────────────────────────────────────────────────────────┘
```

**Upload de Mídia:**
```
┌─ UPLOAD DE FOTOS/VÍDEOS ──────────────────────────────┐
│                                                        │
│ Arraste arquivos aqui ou clique para selecionar       │
│ ┌────────────────────────────────────────────────┐    │
│ │                                                │    │
│ │         📁 Clique ou arraste arquivos          │    │
│ │                                                │    │
│ │    Formatos aceitos:                           │    │
│ │    Fotos: JPG, PNG, WEBP (máx 5MB cada)       │    │
│ │    Vídeos: MP4, WEBM (máx 50MB cada)          │    │
│ │                                                │    │
│ └────────────────────────────────────────────────┘    │
│                                                        │
│ Arquivos Selecionados:                                 │
│ ✓ portao_automatico.jpg (2.3 MB)                      │
│ ✓ instalacao_rede.mp4 (15.8 MB)                       │
│ ✓ camera_seguranca.jpg (1.8 MB)                       │
│                                                        │
│ Categoria *                                            │
│ [Selecione ▼]                                          │
│ - Portões                                              │
│ - Redes de Proteção                                    │
│ - Câmeras                                              │
│ - Interfones                                           │
│ - Automação                                            │
│ - Antes e Depois                                       │
│                                                        │
│ Título/Descrição                                       │
│ [_____________________________________________]         │
│                                                        │
│ Tags (separadas por vírgula)                           │
│ [portão, automático, moema]                            │
│                                                        │
│ ☑ Publicar no site imediatamente                      │
│ ☑ Otimizar imagens automaticamente                    │
│ ☑ Gerar thumbnail para vídeos                         │
│                                                        │
│ [Cancelar] [Upload (3 arquivos)]                      │
└────────────────────────────────────────────────────────┘
```

**Editar Mídia:**
```
┌─ EDITAR MÍDIA ────────────────────────────────────────┐
│                                                        │
│ [Prévia da Imagem/Vídeo]                              │
│                                                        │
│ Título                                                 │
│ [Portão Automático - Moema]                           │
│                                                        │
│ Descrição                                              │
│ [Instalação de portão automático com motor PPA]       │
│                                                        │
│ Categoria                                              │
│ [Portões ▼]                                           │
│                                                        │
│ Tags                                                   │
│ [portão, automático, moema, ppa]                      │
│                                                        │
│ Cliente Relacionado (opcional)                         │
│ [Buscar cliente ▼]                                    │
│                                                        │
│ Serviço Relacionado (opcional)                         │
│ [Buscar serviço ▼]                                    │
│                                                        │
│ Status                                                 │
│ (•) Publicado no site                                 │
│ ( ) Rascunho (não visível)                            │
│ ( ) Arquivado                                          │
│                                                        │
│ Informações do Arquivo                                 │
│ Tamanho: 2.3 MB                                        │
│ Dimensões: 1920x1080                                   │
│ Formato: JPG                                           │
│ Upload: 26/02/2026 às 14:30                           │
│ URL: /uploads/portao-automatico-moema.jpg             │
│                                                        │
│ [Excluir Mídia] [Cancelar] [Salvar]                  │
└────────────────────────────────────────────────────────┘
```



#### 6.5.2 Mídia no Perfil do Cliente

**Visualizar Perfil do Cliente com Mídia:**
```
┌─────────────────────────────────────────────────────────┐
│ PERFIL DO CLIENTE: João Silva                           │
├─────────────────────────────────────────────────────────┤
│ [Dados] [Serviços] [Orçamentos] [Fotos/Vídeos] [Docs]  │
├─────────────────────────────────────────────────────────┤
│                                                         │
│ FOTOS E VÍDEOS DO CLIENTE                               │
│ [+ Upload] [Organizar por ▼]                           │
│                                                         │
│ ┌─ Serviço #2026-045 (26/01/2026) ─────────────────┐   │
│ │ Instalação de Rede de Proteção                   │   │
│ │                                                  │   │
│ │ ANTES                                            │   │
│ │ ┌────┐ ┌────┐                                   │   │
│ │ │IMG │ │IMG │                                   │   │
│ │ └────┘ └────┘                                   │   │
│ │                                                  │   │
│ │ DURANTE                                          │   │
│ │ ┌────┐ ┌────┐ ┌────┐                           │   │
│ │ │IMG │ │▶️VID│ │IMG │                           │   │
│ │ └────┘ └────┘ └────┘                           │   │
│ │                                                  │   │
│ │ DEPOIS                                           │   │
│ │ ┌────┐ ┌────┐ ┌────┐ ┌────┐                   │   │
│ │ │IMG │ │IMG │ │IMG │ │▶️VID│                   │   │
│ │ └────┘ └────┘ └────┘ └────┘                   │   │
│ │                                                  │   │
│ │ [Baixar Todas] [Enviar ao Cliente]              │   │
│ └──────────────────────────────────────────────────┘   │
│                                                         │
│ ┌─ Serviço #2025-312 (15/12/2025) ─────────────────┐   │
│ │ Instalação de Portão Automático                  │   │
│ │ [Ver Fotos (8)] [Ver Vídeos (2)]                │   │
│ └──────────────────────────────────────────────────┘   │
│                                                         │
│ ┌─ Documentos ──────────────────────────────────────┐   │
│ │ 📄 Orçamento_2026-001.pdf (125 KB)               │   │
│ │ 📄 Contrato_Assinado.pdf (230 KB)                │   │
│ │ 📄 NF-e_12345.pdf (180 KB)                       │   │
│ │ 📄 Termo_Garantia.pdf (95 KB)                    │   │
│ └──────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
```

**Upload de Mídia no Perfil do Cliente:**
```
┌─ ADICIONAR FOTOS/VÍDEOS AO CLIENTE ───────────────────┐
│                                                        │
│ Cliente: João Silva                                    │
│ Serviço: #2026-045 - Rede de Proteção                │
│                                                        │
│ [Selecionar Arquivos] ou Arraste aqui                 │
│                                                        │
│ Arquivos Selecionados: (5)                            │
│ ✓ antes_1.jpg (2.1 MB)                                │
│ ✓ antes_2.jpg (1.8 MB)                                │
│ ✓ durante_instalacao.mp4 (12.5 MB)                   │
│ ✓ depois_1.jpg (2.3 MB)                               │
│ ✓ depois_2.jpg (1.9 MB)                               │
│                                                        │
│ Categoria *                                            │
│ (•) Antes  ( ) Durante  ( ) Depois                    │
│                                                        │
│ ☑ Enviar fotos para o cliente por email              │
│ ☑ Disponibilizar na área do cliente                  │
│ ☐ Publicar na galeria do site (com autorização)      │
│                                                        │
│ Observações                                            │
│ [_____________________________________________]         │
│                                                        │
│ [Cancelar] [Upload]                                   │
└────────────────────────────────────────────────────────┘
```

**Funcionalidades de Mídia:**
- Upload múltiplo (drag & drop)
- Organização por serviço
- Categorização (Antes/Durante/Depois)
- Compressão automática de imagens
- Geração de thumbnails
- Visualização em galeria (lightbox)
- Download individual ou em lote (ZIP)
- Envio automático ao cliente
- Integração com área do cliente
- Controle de privacidade
- Marca d'água opcional (logo da empresa)



### 6.6 📄 Gestão de Documentos Fiscais

#### Objetivo
Gerenciar e enviar automaticamente CML (Contrato) e NF-e (Nota Fiscal Eletrônica).

#### 6.6.1 Geração de CML (Contrato de Mão de Obra e Locação)

**Template de Contrato:**
```
┌─ GERAR CONTRATO (CML) ────────────────────────────────┐
│                                                        │
│ Serviço: #2026-045                                     │
│ Cliente: João Silva                                    │
│ Valor: R$ 776,51                                       │
│                                                        │
│ Template de Contrato                                   │
│ [Selecione ▼]                                          │
│ - Contrato Padrão de Serviços                         │
│ - Contrato de Instalação de Redes                     │
│ - Contrato de Instalação de Portões                   │
│ - Contrato de Manutenção                              │
│ - [+ Criar Novo Template]                             │
│                                                        │
│ ┌─ PRÉVIA DO CONTRATO ──────────────────────────┐     │
│ │                                                │     │
│ │ CONTRATO DE PRESTAÇÃO DE SERVIÇOS             │     │
│ │                                                │     │
│ │ CONTRATANTE:                                   │     │
│ │ Nome: João Silva                               │     │
│ │ CPF: 123.456.789-00                           │     │
│ │ Endereço: Rua das Flores, 123 - Moema, SP    │     │
│ │                                                │     │
│ │ CONTRATADA:                                    │     │
│ │ Razão Social: Serralheria Nova Aliança Ltda   │     │
│ │ CNPJ: XX.XXX.XXX/XXXX-XX                      │     │
│ │ Endereço: [Endereço da Empresa]               │     │
│ │                                                │     │
│ │ OBJETO DO CONTRATO:                            │     │
│ │ Instalação de Rede de Proteção conforme       │     │
│ │ especificações do orçamento nº 2026-001       │     │
│ │                                                │     │
│ │ VALOR E FORMA DE PAGAMENTO:                    │     │
│ │ Valor Total: R$ 776,51                        │     │
│ │ Forma: Pix/Dinheiro                           │     │
│ │                                                │     │
│ │ PRAZO DE EXECUÇÃO:                             │     │
│ │ 5 dias úteis após assinatura                  │     │
│ │                                                │     │
│ │ GARANTIA:                                      │     │
│ │ 12 meses para serviços e materiais            │     │
│ │                                                │     │
│ │ [... cláusulas do contrato ...]               │     │
│ │                                                │     │
│ │ São Paulo, 26 de fevereiro de 2026            │     │
│ │                                                │     │
│ │ _____________________  _____________________   │     │
│ │ Contratante            Contratada              │     │
│ └────────────────────────────────────────────────┘     │
│                                                        │
│ [Editar Template] [Gerar PDF] [Enviar por Email]     │
└────────────────────────────────────────────────────────┘
```

**Editor de Templates de Contrato:**
```
┌─ EDITOR DE TEMPLATE DE CONTRATO ──────────────────────┐
│                                                        │
│ Nome do Template                                       │
│ [Contrato Padrão de Serviços]                         │
│                                                        │
│ Conteúdo do Contrato                                   │
│ ┌────────────────────────────────────────────────┐    │
│ │ [Editor de Texto Rico]                         │    │
│ │                                                │    │
│ │ Variáveis disponíveis:                         │    │
│ │ {{cliente_nome}}                               │    │
│ │ {{cliente_cpf_cnpj}}                          │    │
│ │ {{cliente_endereco}}                           │    │
│ │ {{cliente_telefone}}                           │    │
│ │ {{empresa_razao_social}}                       │    │
│ │ {{empresa_cnpj}}                               │    │
│ │ {{empresa_endereco}}                           │    │
│ │ {{servico_descricao}}                          │    │
│ │ {{servico_valor}}                              │    │
│ │ {{servico_prazo}}                              │    │
│ │ {{servico_garantia}}                           │    │
│ │ {{data_atual}}                                 │    │
│ │ {{orcamento_numero}}                           │    │
│ └────────────────────────────────────────────────┘    │
│                                                        │
│ [Salvar Template] [Prévia]                            │
└────────────────────────────────────────────────────────┘
```



#### 6.6.2 Emissão de NF-e (Nota Fiscal Eletrônica)

**Integração com Sistema de NF-e:**

```
┌─ EMITIR NOTA FISCAL ELETRÔNICA ───────────────────────┐
│                                                        │
│ Serviço: #2026-045                                     │
│ Cliente: João Silva                                    │
│ Valor: R$ 776,51                                       │
│                                                        │
│ ┌─ DADOS DO TOMADOR ────────────────────────────┐     │
│ │ Nome/Razão Social: João Silva                 │     │
│ │ CPF/CNPJ: [123.456.789-00]                   │     │
│ │ Endereço: [Rua das Flores, 123]              │     │
│ │ Bairro: [Moema]                               │     │
│ │ Cidade: [São Paulo] UF: [SP]                  │     │
│ │ CEP: [04567-890]                              │     │
│ │ Email: [joao@email.com]                       │     │
│ └───────────────────────────────────────────────┘     │
│                                                        │
│ ┌─ DADOS DO SERVIÇO ────────────────────────────┐     │
│ │ Descrição:                                     │     │
│ │ [Instalação de Rede de Proteção 3x2m]        │     │
│ │                                                │     │
│ │ Código de Serviço (LC 116/2003):              │     │
│ │ [7.02] Execução de obras de construção civil │     │
│ │                                                │     │
│ │ Alíquota ISS: [5.00]%                         │     │
│ │ Município de Incidência: [São Paulo]          │     │
│ └───────────────────────────────────────────────┘     │
│                                                        │
│ ┌─ VALORES ─────────────────────────────────────┐     │
│ │ Valor dos Serviços:        R$ 700,00          │     │
│ │ (-) Descontos:             R$ 0,00            │     │
│ │ Base de Cálculo:           R$ 700,00          │     │
│ │                                                │     │
│ │ ISS (5%):                  R$ 35,00           │     │
│ │ PIS (0,65%):               R$ 4,55            │     │
│ │ COFINS (3%):               R$ 21,00           │     │
│ │ IRPJ (1,2%):               R$ 8,40            │     │
│ │ CSLL (1,08%):              R$ 7,56            │     │
│ │                                                │     │
│ │ Valor Total da Nota:       R$ 776,51          │     │
│ │ Valor Líquido:             R$ 700,00          │     │
│ └───────────────────────────────────────────────┘     │
│                                                        │
│ Observações                                            │
│ [Serviço realizado conforme orçamento 2026-001]       │
│                                                        │
│ ☑ Enviar NF-e por email automaticamente               │
│ ☑ Disponibilizar na área do cliente                   │
│ ☑ Registrar pagamento após emissão                    │
│                                                        │
│ [Cancelar] [Emitir NF-e]                              │
└────────────────────────────────────────────────────────┘
```

**Configuração de Integração NF-e:**

```
┌─ CONFIGURAÇÃO NF-E ───────────────────────────────────┐
│                                                        │
│ Provedor de NF-e                                       │
│ [Selecione ▼]                                          │
│ - NFe.io                                               │
│ - Enotas                                               │
│ - Focus NFe                                            │
│ - Bling                                                │
│ - Outro (API personalizada)                            │
│                                                        │
│ Credenciais da API                                     │
│ API Key: [••••••••••••••••••••••]                     │
│ API Secret: [••••••••••••••••••••••]                  │
│                                                        │
│ Dados da Empresa (Prestador)                           │
│ Razão Social: [Serralheria Nova Aliança Ltda]        │
│ CNPJ: [XX.XXX.XXX/XXXX-XX]                            │
│ Inscrição Municipal: [XXXXXXXX]                       │
│ Regime Tributário: [Simples Nacional ▼]              │
│ CNAE: [2512-8/00 - Serralheria]                      │
│                                                        │
│ Certificado Digital                                    │
│ [Fazer Upload do Certificado .pfx]                    │
│ Senha do Certificado: [••••••••]                      │
│ Validade: 15/12/2026                                   │
│                                                        │
│ Configurações de Emissão                               │
│ ☑ Emissão automática ao concluir serviço             │
│ ☑ Enviar email automaticamente                        │
│ ☑ Reter ISS na fonte                                  │
│ Série da NF-e: [1]                                    │
│ Próximo Número: [00001234]                            │
│                                                        │
│ [Testar Conexão] [Salvar Configuração]               │
└────────────────────────────────────────────────────────┘
```

**Histórico de NF-e Emitidas:**

```
┌─ NOTAS FISCAIS EMITIDAS ──────────────────────────────┐
│ [Filtros ▼] [Buscar...] [Exportar]                   │
├────────────────────────────────────────────────────────┤
│ NF-e | Cliente | Valor | Data | Status | Ações        │
├────────────────────────────────────────────────────────┤
│ 1234 | João Silva | R$ 776,51 | 26/02 | ✓ | [👁️][📧][📄] │
│ 1233 | Maria Santos | R$ 1.200 | 25/02 | ✓ | [👁️][📧][📄] │
│ 1232 | Pedro Costa | R$ 850,00 | 24/02 | ❌ | [👁️][🔄]    │
└────────────────────────────────────────────────────────┘

Status:
✓ Autorizada
⏳ Processando
❌ Rejeitada
🚫 Cancelada
```

**Funcionalidades:**
- Emissão automática ao concluir serviço
- Integração com provedores de NF-e
- Cálculo automático de impostos
- Envio automático por email (XML + PDF)
- Download de XML e DANFE (PDF)
- Cancelamento de NF-e
- Carta de Correção
- Consulta de status na SEFAZ
- Relatórios fiscais
- Backup automático de XMLs



---

## 7. Fluxos de Usuário

### 7.1 Fluxo: Lead → Cliente → Serviço Concluído

```
1. CAPTAÇÃO DO LEAD
   ↓
   Lead chega via site/WhatsApp/telefone
   ↓
   Sistema cria registro automático (site) ou
   Comercial cria manualmente (telefone)
   ↓
   Status: "Novo"

2. PRIMEIRO CONTATO
   ↓
   Comercial visualiza lead na lista
   ↓
   Clica em "WhatsApp" ou "Ligar"
   ↓
   Adiciona nota: "Cliente interessado, solicitou orçamento"
   ↓
   Muda status para: "Em Contato"

3. CRIAÇÃO DO ORÇAMENTO
   ↓
   Comercial clica em "Criar Orçamento"
   ↓
   Preenche itens, valores, impostos
   ↓
   Sistema calcula total automaticamente
   ↓
   Gera PDF com logo da empresa
   ↓
   Envia por email/WhatsApp
   ↓
   Status do lead: "Proposta Enviada"

4. APROVAÇÃO DO ORÇAMENTO
   ↓
   Cliente aprova orçamento
   ↓
   Comercial marca orçamento como "Aprovado"
   ↓
   Sistema gera CML (Contrato) automaticamente
   ↓
   Envia contrato por email
   ↓
   Status do lead: "Fechado"
   ↓
   Sistema cria registro de Cliente
   ↓
   Sistema cria Serviço com status "Agendado"

5. AGENDAMENTO
   ↓
   Operacional visualiza agenda
   ↓
   Define data/hora e técnico responsável
   ↓
   Cliente recebe confirmação por WhatsApp (futuro)

6. EXECUÇÃO DO SERVIÇO
   ↓
   Técnico acessa agenda do dia
   ↓
   Marca serviço como "Em Execução"
   ↓
   Realiza instalação
   ↓
   Tira fotos (antes/durante/depois)
   ↓
   Faz upload das fotos no sistema
   ↓
   Registra itens instalados
   ↓
   Marca serviço como "Concluído"

7. PÓS-VENDA E FATURAMENTO
   ↓
   Sistema envia fotos para cliente por email
   ↓
   Financeiro emite NF-e automaticamente
   ↓
   Sistema envia NF-e por email
   ↓
   Financeiro marca pagamento como "Recebido"
   ↓
   Cliente recebe termo de garantia
   ↓
   FIM
```



---

## 8. Design e Interface

### 8.1 Princípios de Design

1. **Simplicidade**: Interface limpa e intuitiva
2. **Eficiência**: Máximo 3 cliques para qualquer ação
3. **Consistência**: Mesmos padrões em todos os módulos
4. **Feedback Visual**: Sempre confirmar ações do usuário
5. **Responsividade**: Funcionar em desktop, tablet e mobile

### 8.2 Paleta de Cores

```
Primária (Azul):    #0056E0
Secundária (Cinza): #64748B
Sucesso (Verde):    #10B981
Aviso (Amarelo):    #F59E0B
Erro (Vermelho):    #EF4444
Info (Azul Claro):  #3B82F6

Backgrounds:
- Branco:           #FFFFFF
- Cinza Claro:      #F8FAFC
- Cinza Médio:      #E2E8F0
```

### 8.3 Status e Badges

**Leads:**
- 🔵 Novo: `bg-gray-100 text-gray-800`
- 🟡 Em Contato: `bg-yellow-100 text-yellow-800`
- 🔵 Proposta: `bg-blue-100 text-blue-800`
- 🟢 Fechado: `bg-green-100 text-green-800`
- 🔴 Perdido: `bg-red-100 text-red-800`

**Orçamentos:**
- 📝 Rascunho: `bg-gray-100 text-gray-800`
- 📤 Enviado: `bg-blue-100 text-blue-800`
- ✅ Aprovado: `bg-green-100 text-green-800`
- ❌ Rejeitado: `bg-red-100 text-red-800`

**Serviços:**
- 📅 Agendado: `bg-blue-100 text-blue-800`
- 🔧 Em Execução: `bg-orange-100 text-orange-800`
- ✅ Concluído: `bg-green-100 text-green-800`
- 🚫 Cancelado: `bg-red-100 text-red-800`

**Pagamentos:**
- 💰 Pago: `bg-green-100 text-green-800`
- ⏳ Pendente: `bg-yellow-100 text-yellow-800`
- ⚠️ Atrasado: `bg-red-100 text-red-800`

### 8.4 Componentes Reutilizáveis

- **KPI Card**: Card com ícone, valor, comparação
- **Status Badge**: Badge colorido por status
- **Action Button**: Botão com ícone (WhatsApp, telefone, etc)
- **Data Table**: Tabela com paginação e filtros
- **Modal**: Modal para formulários e detalhes
- **Toast**: Notificação de sucesso/erro
- **Loading State**: Skeleton ou spinner
- **Empty State**: Mensagem quando não há dados
- **File Upload**: Drag & drop com preview
- **Date Picker**: Seletor de data/período

---

## 9. Modelo de Dados

### 9.1 Tabelas Existentes (Supabase)

Já implementadas:
- `profiles` - Perfis de usuários
- `clients` - Dados de clientes
- `leads` - Leads capturados
- `requests` - Solicitações/Serviços
- `jobs` - Serviços realizados
- `job_items` - Itens instalados
- `gallery_items` - Galeria do site

### 9.2 Novas Tabelas Necessárias

#### `orcamentos` (Orçamentos)
```sql
CREATE TABLE orcamentos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  numero TEXT UNIQUE NOT NULL, -- 2026-001
  lead_id UUID REFERENCES leads(id),
  client_id UUID REFERENCES clients(id),
  status TEXT CHECK (status IN ('rascunho', 'enviado', 'aprovado', 'rejeitado')),
  subtotal DECIMAL(10,2) NOT NULL,
  desconto DECIMAL(10,2) DEFAULT 0,
  impostos JSONB, -- {iss: 35.00, pis: 4.55, ...}
  total DECIMAL(10,2) NOT NULL,
  validade_dias INTEGER DEFAULT 15,
  prazo_execucao TEXT,
  garantia TEXT,
  forma_pagamento TEXT,
  observacoes TEXT,
  termos TEXT,
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  sent_at TIMESTAMPTZ,
  approved_at TIMESTAMPTZ
);
```

#### `orcamento_itens` (Itens do Orçamento)
```sql
CREATE TABLE orcamento_itens (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  orcamento_id UUID REFERENCES orcamentos(id) ON DELETE CASCADE,
  descricao TEXT NOT NULL,
  quantidade DECIMAL(10,2) NOT NULL,
  valor_unitario DECIMAL(10,2) NOT NULL,
  subtotal DECIMAL(10,2) NOT NULL,
  ordem INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```



#### `media_files` (Arquivos de Mídia)
```sql
CREATE TABLE media_files (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tipo TEXT CHECK (tipo IN ('foto', 'video')),
  categoria TEXT, -- portoes, redes, cameras, etc
  titulo TEXT,
  descricao TEXT,
  tags TEXT[],
  url TEXT NOT NULL,
  thumbnail_url TEXT,
  tamanho_bytes INTEGER,
  largura INTEGER,
  altura INTEGER,
  formato TEXT, -- jpg, png, mp4, etc
  duracao_segundos INTEGER, -- para vídeos
  client_id UUID REFERENCES clients(id),
  servico_id UUID REFERENCES requests(id),
  fase TEXT CHECK (fase IN ('antes', 'durante', 'depois')),
  publicado BOOLEAN DEFAULT false,
  uploaded_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### `documentos` (Documentos Fiscais)
```sql
CREATE TABLE documentos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tipo TEXT CHECK (tipo IN ('orcamento', 'contrato', 'nfe', 'boleto', 'recibo')),
  numero TEXT,
  client_id UUID REFERENCES clients(id),
  servico_id UUID REFERENCES requests(id),
  orcamento_id UUID REFERENCES orcamentos(id),
  url_pdf TEXT,
  url_xml TEXT, -- para NF-e
  valor DECIMAL(10,2),
  status TEXT,
  chave_acesso TEXT, -- para NF-e
  data_emissao TIMESTAMPTZ,
  enviado_email BOOLEAN DEFAULT false,
  enviado_em TIMESTAMPTZ,
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### `configuracoes_impostos` (Configuração de Impostos)
```sql
CREATE TABLE configuracoes_impostos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nome TEXT NOT NULL, -- "Simples Nacional", "Personalizado", etc
  iss_aliquota DECIMAL(5,2),
  iss_ativo BOOLEAN DEFAULT true,
  pis_aliquota DECIMAL(5,2),
  pis_ativo BOOLEAN DEFAULT true,
  cofins_aliquota DECIMAL(5,2),
  cofins_ativo BOOLEAN DEFAULT true,
  irpj_aliquota DECIMAL(5,2),
  irpj_ativo BOOLEAN DEFAULT true,
  csll_aliquota DECIMAL(5,2),
  csll_ativo BOOLEAN DEFAULT true,
  icms_aliquota DECIMAL(5,2),
  icms_ativo BOOLEAN DEFAULT false,
  padrao BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### `email_templates` (Templates de Email)
```sql
CREATE TABLE email_templates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nome TEXT NOT NULL,
  tipo TEXT CHECK (tipo IN ('orcamento', 'contrato', 'nfe', 'lembrete', 'fotos')),
  assunto TEXT NOT NULL,
  corpo TEXT NOT NULL, -- HTML com variáveis {{nome}}, {{valor}}, etc
  ativo BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### `email_log` (Log de Emails Enviados)
```sql
CREATE TABLE email_log (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  destinatario TEXT NOT NULL,
  assunto TEXT NOT NULL,
  template_id UUID REFERENCES email_templates(id),
  client_id UUID REFERENCES clients(id),
  servico_id UUID REFERENCES requests(id),
  orcamento_id UUID REFERENCES orcamentos(id),
  status TEXT CHECK (status IN ('enviado', 'erro', 'pendente')),
  erro_mensagem TEXT,
  enviado_em TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

## 10. Roadmap e Fases

### Fase 1: MVP (4-6 semanas)

**Sprint 1-2: Dashboard e Leads**
- ✅ Autenticação e layout (já feito)
- Dashboard com dados reais
- CRUD completo de leads
- Filtros e busca
- Histórico de interações

**Sprint 3-4: Orçamentos**
- CRUD de orçamentos
- Cálculo de impostos
- Geração de PDF
- Envio por email

### Fase 2: Operacional (3-4 semanas)

**Sprint 5-6: Serviços e Agenda**
- CRUD de serviços
- Agenda visual (mensal/semanal/diária)
- Upload de fotos
- Registro de itens instalados

**Sprint 7: Clientes**
- Perfil completo do cliente
- Histórico de serviços
- Galeria de fotos por cliente

### Fase 3: Financeiro e Documentos (3-4 semanas)

**Sprint 8: Financeiro**
- Controle de pagamentos
- Relatórios de receita
- Alertas de inadimplência

**Sprint 9-10: Documentos Fiscais**
- Geração de CML (Contrato)
- Integração com NF-e
- Envio automático de documentos
- Gestão de templates

### Fase 4: Mídia e Melhorias (2-3 semanas)

**Sprint 11: Gestão de Mídia**
- Upload de fotos/vídeos para site
- Galeria do site gerenciável
- Otimização automática de imagens
- Marca d'água

**Sprint 12: Polimento**
- Notificações in-app
- Relatórios avançados
- Exportações
- Melhorias de UX

---

## 11. Critérios de Sucesso

### 11.1 Critérios Técnicos

- [ ] 100% das funcionalidades implementadas
- [ ] Tempo de carregamento < 2 segundos
- [ ] Responsivo em mobile, tablet e desktop
- [ ] Zero erros críticos em produção
- [ ] Cobertura de testes > 70%
- [ ] Documentação completa

### 11.2 Critérios de Negócio

- [ ] Taxa de conversão aumentou 15%
- [ ] Tempo de resposta < 1 hora
- [ ] 100% dos leads registrados no sistema
- [ ] 90% de satisfação do time
- [ ] ROI positivo em 6 meses

### 11.3 Critérios de Usuário

- [ ] Onboarding completo em < 2 horas
- [ ] 80% das tarefas feitas sem ajuda
- [ ] NPS do time > 8
- [ ] Redução de 50% em erros manuais

---

## 12. Anexos

### 12.1 Glossário

- **Lead**: Potencial cliente que demonstrou interesse
- **CML**: Contrato de Mão de Obra e Locação
- **NF-e**: Nota Fiscal Eletrônica
- **DANFE**: Documento Auxiliar da Nota Fiscal Eletrônica
- **RLS**: Row Level Security (Supabase)
- **KPI**: Key Performance Indicator

### 12.2 Referências

- Épico da Área Admin: `docs/EPIC-AREA-ADMIN.md`
- PRD Geral do Sistema: `docs/PRD.md`
- Schema do Banco: `supabase-schema.sql`
- Design System: `DESIGN_SYSTEM.md`

---

**Última Atualização:** 26/02/2026  
**Próxima Revisão:** Após Sprint 1  
**Responsável:** Equipe de Produto



---

## 13. Infraestrutura e Configurações

### 13.1 Configuração de Email (Já Implementado)

O sistema já possui infraestrutura de email configurada usando Gmail SMTP.

**Variáveis de Ambiente (.env):**

```bash
# ============================================
# EMAIL CONFIGURATION
# ============================================
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
GMAIL_EMAIL=qualitecinstrumentosdemedicao@gmail.com
GMAIL_APP_PASSWORD=byeqpdyllakkwxkk
EMAIL_USER=qualitecinstrumentosdemedicao@gmail.com
EMAIL_PASS=byeqpdyllakkwxkk
EMAIL_FROM=noreply@qualitec.com.br
EMAIL_JOBS_TOKEN=sk_live_qualitec_email_jobs_2024
```

**Características:**
- Servidor SMTP: Gmail (smtp.gmail.com)
- Porta: 587 (TLS)
- Autenticação: App Password do Gmail
- Remetente: noreply@qualitec.com.br
- Token de Jobs: Para processamento assíncrono de emails

**Uso no Sistema:**

```typescript
// server/utils/email.ts (já existe)
import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: parseInt(process.env.EMAIL_PORT || '587'),
  secure: false, // TLS
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
})

export async function sendEmail({
  to,
  subject,
  html,
  attachments = []
}: {
  to: string
  subject: string
  html: string
  attachments?: any[]
}) {
  return await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to,
    subject,
    html,
    attachments
  })
}
```

**Tipos de Email Suportados:**
1. Alertas de segurança (já implementado)
2. Orçamentos (a implementar)
3. Contratos (a implementar)
4. NF-e (a implementar)
5. Fotos de serviços (a implementar)
6. Lembretes de pagamento (a implementar)



### 13.2 Estado Atual Detalhado da Implementação

#### ✅ Completamente Implementado

**1. Sistema de Autenticação**
- Localização: `app/pages/auth/secure/admin-access.vue`
- Login com email e senha
- Rate limiting (5 tentativas)
- Honeypot para detectar bots
- CAPTCHA após 2 tentativas falhas
- Sessão segura com JWT
- Middleware de verificação: `app/middleware/admin.ts`
- Composable de auth: `app/composables/useAuth.ts`

**2. Layout Administrativo**
- Localização: `app/components/admin/AdminLayout.vue`
- Sidebar com 7 módulos:
  - Dashboard
  - Leads (badge: 5)
  - Orçamentos
  - Serviços
  - Agenda
  - Clientes
  - Financeiro
- Header com:
  - Logo e nome da empresa
  - Notificações (ícone com badge)
  - Menu do usuário (nome, email, avatar)
  - Botão de logout
- Responsivo (mobile, tablet, desktop)
- Cores do design system aplicadas

**3. Dashboard Básico**
- Localização: `app/pages/admin/index.vue`
- 4 KPI Cards:
  - Leads do Mês: 47 (+12%)
  - Taxa de Conversão: 32% (+3%)
  - Serviços Esta Semana: 12 (3 hoje)
  - Receita do Mês: R$ 28.500 (+18%)
- Lista de Leads Recentes (4 leads mockados)
- Card de Ações Rápidas (3 botões)
- Status: Dados mockados, precisa conectar com API

**4. Banco de Dados**
- Localização: `supabase-schema.sql`
- Tabelas criadas:
  - `profiles` - Perfis de usuários (admin/client)
  - `clients` - Dados adicionais de clientes
  - `leads` - Leads capturados
  - `requests` - Solicitações/Serviços
  - `jobs` - Serviços realizados
  - `job_items` - Itens instalados
  - `gallery_items` - Galeria do site
- RLS configurado (atualmente desabilitado em profiles)
- Triggers e funções criadas

**5. Sistema de Email**
- Localização: `server/utils/email.ts`
- Configuração SMTP Gmail
- Função `sendEmail()` implementada
- Suporte a anexos
- Templates HTML
- Usado para alertas de segurança

**6. Segurança**
- Rate limiting: `server/middleware/rate-limiter.ts`
- Alertas de segurança por email
- Audit log de acessos
- Headers de segurança (CSP, HSTS)
- Proteção contra brute force



#### ⚠️ Parcialmente Implementado

**1. Dashboard**
- Status: Interface pronta, dados mockados
- Falta: Conectar com queries Supabase reais
- Falta: Gráficos (Chart.js)
- Falta: Refresh automático

**2. Rotas Definidas**
- Sidebar tem links para 7 módulos
- Páginas não existem ainda:
  - `/admin/leads` ❌
  - `/admin/orcamentos` ❌
  - `/admin/servicos` ❌
  - `/admin/agenda` ❌
  - `/admin/clientes` ❌
  - `/admin/financeiro` ❌

#### ❌ Não Implementado (Prioridade Alta)

**1. Módulo de Leads**
- Página de listagem
- Filtros e busca
- CRUD completo
- Histórico de interações
- Botões de ação (WhatsApp, telefone)

**2. Módulo de Orçamentos**
- CRUD de orçamentos
- Cálculo de impostos
- Geração de PDF
- Envio por email

**3. Módulo de Serviços**
- CRUD de serviços
- Upload de fotos
- Registro de itens instalados
- Atualização de status

**4. Módulo de Agenda**
- Calendário visual
- Visualizações (mensal/semanal/diária)
- Filtros por técnico/tipo

**5. Módulo de Clientes**
- Perfil completo
- Histórico de serviços
- Galeria de fotos

**6. Módulo Financeiro**
- Controle de pagamentos
- Relatórios de receita
- Alertas de inadimplência

**7. Gestão de Mídia**
- Upload para galeria do site
- Upload no perfil do cliente
- Otimização de imagens

**8. Documentos Fiscais**
- Geração de CML (Contrato)
- Integração com NF-e
- Templates editáveis

**9. Configurações**
- Configuração de impostos
- Templates de email
- Configuração de NF-e
- Gestão de usuários



### 13.3 Arquitetura de Pastas Atual

```
serralheria-nova-alianca/
├── app/
│   ├── components/
│   │   ├── admin/
│   │   │   └── AdminLayout.vue ✅ (implementado)
│   │   ├── clientes/ ✅ (área pública implementada)
│   │   └── ui/ ✅ (componentes base)
│   ├── composables/
│   │   ├── useAuth.ts ✅
│   │   ├── useSupabase.ts ✅
│   │   └── useWhatsApp.ts ✅
│   ├── middleware/
│   │   ├── admin.ts ✅
│   │   └── auth.ts ✅
│   ├── pages/
│   │   ├── admin/
│   │   │   ├── index.vue ✅ (dashboard)
│   │   │   ├── login.vue ✅
│   │   │   ├── leads/ ❌ (a criar)
│   │   │   ├── orcamentos/ ❌ (a criar)
│   │   │   ├── servicos/ ❌ (a criar)
│   │   │   ├── agenda/ ❌ (a criar)
│   │   │   ├── clientes/ ❌ (a criar)
│   │   │   ├── financeiro/ ❌ (a criar)
│   │   │   ├── galeria/ ❌ (a criar)
│   │   │   └── configuracoes/ ❌ (a criar)
│   │   ├── auth/
│   │   │   └── secure/
│   │   │       └── admin-access.vue ✅
│   │   ├── cliente/ ✅ (área logada do cliente)
│   │   └── clientes/ ✅ (área pública)
│   └── types/
│       └── index.ts ✅
├── server/
│   ├── api/
│   │   └── security/ ✅ (alertas de segurança)
│   ├── middleware/
│   │   └── rate-limiter.ts ✅
│   └── utils/
│       └── email.ts ✅
├── docs/
│   ├── PRD.md ✅
│   ├── PRD-AREA-ADMIN.md ✅ (este documento)
│   ├── EPIC-AREA-ADMIN.md ✅
│   ├── EPIC-AREA-CLIENTES.md ✅
│   └── IMPLEMENTACAO-AREA-CLIENTES.md ✅
└── supabase-schema.sql ✅
```

### 13.4 Dependências Necessárias

**Já Instaladas:**
```json
{
  "@supabase/supabase-js": "^2.x",
  "nuxt": "^4.x",
  "vue": "^3.x",
  "tailwindcss": "^3.x",
  "nodemailer": "^6.x"
}
```

**A Instalar (conforme necessidade):**
```json
{
  "jspdf": "^2.x",           // Geração de PDF
  "jspdf-autotable": "^3.x", // Tabelas em PDF
  "chart.js": "^4.x",        // Gráficos
  "vue-chartjs": "^5.x",     // Chart.js para Vue
  "date-fns": "^3.x",        // Manipulação de datas
  "zod": "^3.x",             // Validação de schemas
  "sharp": "^0.33.x",        // Otimização de imagens
  "axios": "^1.x"            // Integração com APIs de NF-e
}
```

### 13.5 Variáveis de Ambiente Completas

```bash
# ============================================
# SUPABASE
# ============================================
NUXT_PUBLIC_SUPABASE_URL=https://lfznsbvruvjnugyzfyiw.supabase.co
NUXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# ============================================
# EMAIL
# ============================================
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
GMAIL_EMAIL=qualitecinstrumentosdemedicao@gmail.com
GMAIL_APP_PASSWORD=byeqpdyllakkwxkk
EMAIL_USER=qualitecinstrumentosdemedicao@gmail.com
EMAIL_PASS=byeqpdyllakkwxkk
EMAIL_FROM=noreply@qualitec.com.br
EMAIL_JOBS_TOKEN=sk_live_qualitec_email_jobs_2024

# ============================================
# WHATSAPP
# ============================================
NUXT_PUBLIC_WHATSAPP_NUMBER=5511987115613

# ============================================
# NF-E (A configurar)
# ============================================
NFE_PROVIDER=nfeio
NFE_API_KEY=
NFE_API_SECRET=
NFE_COMPANY_ID=

# ============================================
# STORAGE (Supabase Storage)
# ============================================
NUXT_PUBLIC_STORAGE_URL=https://lfznsbvruvjnugyzfyiw.supabase.co/storage/v1

# ============================================
# SECURITY
# ============================================
SECURITY_ALERT_EMAIL=qualitecinstrumentosdemedicao@gmail.com
```

---

## 14. Próximos Passos Imediatos

### Sprint 1 (Semana 1-2): Dashboard e Leads

**Tarefas:**

1. **Conectar Dashboard com Dados Reais**
   - [ ] Criar queries Supabase para KPIs
   - [ ] Calcular taxa de conversão real
   - [ ] Buscar leads recentes do banco
   - [ ] Implementar refresh automático (5 min)

2. **Criar Página de Leads**
   - [ ] Criar `/admin/leads/index.vue`
   - [ ] Implementar listagem com paginação
   - [ ] Adicionar filtros (status, origem, serviço)
   - [ ] Implementar busca por nome/telefone
   - [ ] Criar componente de card de lead

3. **Criar Lead Manualmente**
   - [ ] Criar `/admin/leads/novo.vue`
   - [ ] Formulário com validação
   - [ ] Salvar no Supabase
   - [ ] Redirecionar para detalhes

4. **Detalhes do Lead**
   - [ ] Criar `/admin/leads/[id].vue`
   - [ ] Exibir todas as informações
   - [ ] Histórico de interações
   - [ ] Botões de ação (WhatsApp, telefone)
   - [ ] Adicionar notas
   - [ ] Mudar status

**Entregáveis:**
- Dashboard funcional com dados reais
- CRUD completo de leads
- Filtros e busca funcionando
- Histórico de interações

**Estimativa:** 40-50 horas

---

**FIM DO PRD**

---

**Documento Vivo:** Este PRD será atualizado conforme o desenvolvimento avança e novos requisitos surgem.

**Contato:** Para dúvidas ou sugestões, consulte a equipe de produto.

