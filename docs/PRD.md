# PRD - Product Requirements Document
# Sistema de Gestão Serralheria Nova Aliança

**Versão:** 1.0  
**Data:** 26 de Fevereiro de 2026  
**Autor:** Equipe de Desenvolvimento  
**Status:** Ativo

---

## 📋 Índice

1. [Visão Geral](#visão-geral)
2. [Objetivos do Produto](#objetivos-do-produto)
3. [Personas e Usuários](#personas-e-usuários)
4. [Arquitetura do Sistema](#arquitetura-do-sistema)
5. [Funcionalidades Detalhadas](#funcionalidades-detalhadas)
6. [Experiência do Usuário](#experiência-do-usuário)
7. [Fluxos de Navegação](#fluxos-de-navegação)
8. [Rotas e Páginas](#rotas-e-páginas)
9. [Integrações](#integrações)
10. [Segurança e Privacidade](#segurança-e-privacidade)
11. [Performance e Escalabilidade](#performance-e-escalabilidade)
12. [Métricas de Sucesso](#métricas-de-sucesso)

---

## 1. Visão Geral

### 1.1 Descrição do Produto

O Sistema de Gestão Serralheria Nova Aliança é uma plataforma web completa que integra:
- **Site institucional** com foco em conversão via WhatsApp
- **Área do cliente** para gestão de solicitações e histórico
- **Painel administrativo** para gestão de leads, clientes e serviços

### 1.2 Problema que Resolve

- Dificuldade de clientes em solicitar orçamentos e acompanhar serviços
- Falta de organização na gestão de leads e solicitações
- Ausência de histórico digital de serviços realizados
- Comunicação fragmentada entre empresa e clientes

### 1.3 Proposta de Valor

- Conversão otimizada via WhatsApp
- Gestão centralizada de solicitações
- Transparência no acompanhamento de serviços
- Histórico completo de trabalhos realizados
- Experiência mobile-first

---

## 2. Objetivos do Produto

### 2.1 Objetivos de Negócio


- Aumentar conversão de visitantes em leads qualificados
- Reduzir tempo de resposta a solicitações de orçamento
- Melhorar satisfação do cliente com transparência
- Automatizar processos de gestão de leads
- Construir base de dados de clientes e serviços

### 2.2 Objetivos do Usuário

**Cliente:**
- Solicitar orçamentos de forma rápida e fácil
- Acompanhar status de solicitações em tempo real
- Acessar histórico de serviços contratados
- Comunicar-se facilmente com a empresa

**Administrador:**
- Gerenciar leads e solicitações centralizadamente
- Acompanhar pipeline de vendas
- Registrar serviços realizados
- Gerar relatórios de performance

---

## 3. Personas e Usuários

### 3.1 Persona 1: Cliente Residencial

**Nome:** Maria Silva  
**Idade:** 42 anos  
**Ocupação:** Empresária  
**Localização:** Moema, São Paulo

**Características:**
- Proprietária de casa com portão automático
- Usa smartphone para tudo
- Valoriza praticidade e rapidez
- Prefere WhatsApp para comunicação

**Necessidades:**
- Solicitar manutenção do portão rapidamente
- Acompanhar quando o técnico virá
- Ter histórico de manutenções anteriores
- Contato direto via WhatsApp

**Dores:**
- Não sabe quando foi a última manutenção
- Dificuldade em lembrar detalhes de serviços anteriores
- Falta de transparência no status do serviço

### 3.2 Persona 2: Cliente Empresarial

**Nome:** João Santos  
**Idade:** 55 anos  
**Ocupação:** Síndico de Condomínio  
**Localização:** Vila Mariana, São Paulo

**Características:**
- Responsável por manutenção de 3 portões
- Precisa de documentação formal
- Valoriza garantias e relatórios
- Necessita de planejamento de manutenções

**Necessidades:**
- Agendar manutenções preventivas
- Documentação de serviços realizados
- Histórico completo para prestação de contas
- Garantias documentadas

**Dores:**
- Dificuldade em organizar documentos
- Falta de histórico centralizado
- Necessidade de justificar gastos

### 3.3 Persona 3: Administrador

**Nome:** Carlos Oliveira  
**Idade:** 35 anos  
**Ocupação:** Gerente Operacional  
**Localização:** São Paulo

**Características:**
- Gerencia equipe de técnicos
- Precisa de visão geral de solicitações
- Responsável por conversão de leads
- Usa desktop e mobile

**Necessidades:**
- Dashboard com visão geral
- Gestão de pipeline de vendas
- Registro de serviços realizados
- Relatórios de performance

**Dores:**
- Leads perdidos por falta de follow-up
- Dificuldade em priorizar atendimentos
- Falta de histórico de interações

---

## 4. Arquitetura do Sistema

### 4.1 Stack Tecnológico

**Frontend:**
- Nuxt 4 (Vue 3 + TypeScript)
- Tailwind CSS
- @vueuse/core

**Backend:**
- Supabase (PostgreSQL + Auth + Storage)
- Edge Functions (Deno)

**Infraestrutura:**
- Vercel (Hosting)
- Supabase Cloud (Database)

### 4.2 Estrutura de Dados

**Entidades Principais:**
- `profiles` - Perfis de usuários (clientes e admins)
- `clients` - Informações adicionais de clientes
- `leads` - Leads capturados via formulários
- `requests` - Solicitações de orçamento/serviço
- `jobs` - Serviços realizados
- `job_items` - Itens instalados em cada serviço
- `gallery_items` - Portfólio de trabalhos

### 4.3 Segurança

- Row Level Security (RLS) no Supabase
- Autenticação JWT via Supabase Auth
- Rate limiting em APIs
- Validação de inputs client e server-side
- HTTPS obrigatório

---

## 5. Funcionalidades Detalhadas

### 5.1 Site Público

#### 5.1.1 Home Page
**Objetivo:** Converter visitantes em leads via WhatsApp

**Elementos:**
- Hero section com CTA principal
- Diferenciais da empresa
- Grid de serviços
- Galeria de trabalhos
- Formulário de orçamento
- FAQ
- Áreas de atendimento

**CTAs:**
- "Solicitar Orçamento" (WhatsApp)
- "Falar com Especialista" (WhatsApp)
- Botão flutuante WhatsApp

#### 5.1.2 Página de Serviços
**Objetivo:** Detalhar serviços e gerar conversão

**Elementos:**
- Lista completa de serviços
- Cards com descrição e features
- CTAs por serviço
- Link para página detalhada

**Serviços:**
1. Automação de Portões
2. Travas Eletrônicas
3. Fotocélula Anti-Esmagamento
4. Interfones e Vídeo Porteiro
5. Câmeras de Segurança
6. Manutenção Preventiva e Corretiva

#### 5.1.3 Página de Trabalhos
**Objetivo:** Demonstrar expertise e qualidade

**Elementos:**
- Galeria filtrada por categoria
- Cards com antes/depois
- Vídeos de trabalhos
- Depoimentos (futuro)

**Categorias:**
- Portões
- Automação
- Travas
- Interfones
- Câmeras
- Fotocélulas
- Manutenção
- Grades

#### 5.1.4 Página Sobre
**Objetivo:** Construir confiança e credibilidade

**Elementos:**
- História da empresa
- Missão, visão e valores
- Equipe
- Certificações
- Diferenciais

#### 5.1.5 Página de Contato
**Objetivo:** Facilitar comunicação

**Elementos:**
- Formulário de contato
- Informações de contato
- Mapa de localização
- Horário de atendimento
- Links para redes sociais

### 5.2 Área do Cliente

#### 5.2.1 Autenticação

**Login:**
- Email e senha
- Link "Esqueci minha senha"
- Link para cadastro
- Validação de campos

**Cadastro:**
- Nome completo
- Email
- WhatsApp
- Senha (mínimo 6 caracteres)
- Confirmação de senha
- Cidade (padrão: São Paulo)

**Recuperação de Senha:**
- Email de recuperação
- Link temporário
- Redefinição de senha

#### 5.2.2 Dashboard do Cliente
**Objetivo:** Visão geral e acesso rápido

**Elementos:**
- Saudação personalizada
- Cards de ação rápida:
  - Nova Solicitação
  - Minhas Solicitações
  - Histórico
- Solicitações recentes (últimas 3)
- Botão "Ver todas"

**Navegação:**
- Navbar com logo e menu
- Link para logout
- Link para perfil (futuro)

#### 5.2.3 Nova Solicitação
**Objetivo:** Facilitar pedido de orçamento/visita

**Formulário:**
- Tipo de serviço (select)
- Descrição detalhada (textarea)
- Tipo de portão (opcional)
- Horário preferencial (opcional)
- Upload de fotos (futuro)
- Endereço (pré-preenchido do perfil)

**Tipos de Serviço:**
- Instalação de Motor
- Manutenção
- Trava Eletrônica
- Fotocélula
- Interfone
- Câmera
- Outro

**Fluxo:**
1. Preencher formulário
2. Revisar informações
3. Enviar solicitação
4. Confirmação com número de protocolo
5. Notificação via WhatsApp (futuro)

#### 5.2.4 Minhas Solicitações
**Objetivo:** Acompanhar status de pedidos

**Elementos:**
- Filtros por status:
  - Todas
  - Enviadas
  - Em Análise
  - Agendadas
  - Em Execução
  - Concluídas
- Lista de solicitações
- Badge de status
- Data de criação
- Botões:
  - Ver Detalhes
  - Contatar via WhatsApp

**Status:**
- `recebido` - Enviadas (azul)
- `em_analise` - Em Análise (amarelo)
- `agendado` - Agendadas (azul claro)
- `em_execucao` - Em Execução (amarelo)
- `concluido` - Concluídas (verde)

#### 5.2.5 Serviços Contratados (Histórico)
**Objetivo:** Visualizar serviços realizados

**Elementos:**
- Lista de serviços concluídos
- Badge "Concluído"
- Informações:
  - Resumo do serviço
  - Data de início
  - Data de conclusão
  - Garantia até
- Itens instalados:
  - Tipo de item
  - Marca e modelo
  - Observações
- Botões:
  - Ver Detalhes
  - Baixar Relatório (futuro)

**Tipos de Itens:**
- Motor
- Trava Eletrônica
- Fotocélula
- Interfone
- Câmera
- Protetor de Rede
- Outro

### 5.3 Área Administrativa

#### 5.3.1 Login Admin
**Objetivo:** Acesso seguro ao painel

**Elementos:**
- Email e senha
- Validação de role admin
- Redirecionamento para dashboard

**Segurança:**
- Rate limiting
- Log de tentativas
- Alerta de falhas (email)

#### 5.3.2 Dashboard Admin (Futuro)
**Objetivo:** Visão geral do negócio

**Elementos:**
- KPIs principais:
  - Leads do mês
  - Solicitações pendentes
  - Serviços em andamento
  - Taxa de conversão
- Gráficos:
  - Leads por fonte
  - Serviços por tipo
  - Faturamento mensal
- Ações rápidas:
  - Novo lead
  - Nova solicitação
  - Registrar serviço

#### 5.3.3 Gestão de Leads (Futuro)
**Objetivo:** Converter leads em clientes

**Elementos:**
- Lista de leads
- Filtros:
  - Por data
  - Por serviço
  - Por fonte
  - Por status
- Ações:
  - Contatar via WhatsApp
  - Marcar como contatado
  - Converter em cliente
  - Arquivar

#### 5.3.4 Gestão de Solicitações (Futuro)
**Objetivo:** Gerenciar pipeline de vendas

**Elementos:**
- Kanban board por status
- Filtros e busca
- Detalhes da solicitação
- Histórico de interações
- Ações:
  - Atualizar status
  - Agendar visita
  - Enviar orçamento
  - Registrar serviço

#### 5.3.5 Gestão de Serviços (Futuro)
**Objetivo:** Registrar trabalhos realizados

**Elementos:**
- Formulário de registro:
  - Solicitação vinculada
  - Resumo do serviço
  - Data de início
  - Data de conclusão
  - Garantia até
  - Itens instalados
  - Fotos (antes/depois)
  - Observações
- Lista de serviços
- Filtros e busca

#### 5.3.6 Gestão de Portfólio (Futuro)
**Objetivo:** Gerenciar galeria pública

**Elementos:**
- Upload de imagens/vídeos
- Categorização
- Título e descrição
- Antes/depois
- Publicar/despublicar

---

## 6. Experiência do Usuário

### 6.1 Princípios de UX

1. **Mobile-First:** Design otimizado para smartphones
2. **Conversão:** CTAs claros e estratégicos
3. **Simplicidade:** Fluxos diretos e intuitivos
4. **Feedback:** Confirmações e estados de loading
5. **Acessibilidade:** Contraste adequado e navegação por teclado

### 6.2 Design System

**Cores:**
- Primária: Azul (#0056e0) - Confiança
- Secundária: Cinza (#6c757d) - Neutralidade
- Destaque: Amarelo (#f59e0b) - Atenção
- Sucesso: Verde (#22c55e)
- Erro: Vermelho (#ef4444)
- Aviso: Amarelo (#f59e0b)
- Info: Azul (#3b82f6)

**Tipografia:**
- Font: System fonts (sans-serif)
- Tamanhos: 12px, 14px, 16px, 18px, 20px, 24px, 32px, 40px, 48px

**Espaçamento:**
- Base: 4px
- Escala: 4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80, 96

**Componentes:**
- Button (variants: default, outline, ghost)
- Card
- Badge
- Input
- Textarea
- Select
- Alert
- Skeleton (loading)

### 6.3 Responsividade

**Breakpoints:**
- Mobile: < 640px
- Tablet: 640px - 1024px
- Desktop: > 1024px

**Adaptações:**
- Menu mobile: Hamburger
- Grid: 1 coluna (mobile) → 2-3 colunas (desktop)
- Formulários: Stack vertical (mobile) → Grid (desktop)

### 6.4 Estados e Feedback

**Loading:**
- Skeleton screens
- Spinners
- Progress bars

**Sucesso:**
- Mensagens de confirmação
- Toasts verdes
- Redirecionamentos

**Erro:**
- Mensagens de erro claras
- Toasts vermelhos
- Validação inline

**Vazio:**
- Empty states com ilustração
- CTA para ação principal
- Mensagem explicativa

---

## 7. Fluxos de Navegação

### 7.1 Fluxo: Visitante → Lead

```
1. Visitante acessa site
2. Navega por serviços/trabalhos
3. Clica em "Solicitar Orçamento"
4. Preenche formulário
5. Envia via WhatsApp
6. Lead registrado no sistema
```

### 7.2 Fluxo: Visitante → Cliente Cadastrado

```
1. Visitante acessa site
2. Clica em "Área do Cliente"
3. Clica em "Cadastre-se"
4. Preenche formulário de cadastro
5. Confirma email (futuro)
6. Acessa dashboard
```

### 7.3 Fluxo: Cliente → Nova Solicitação

```
1. Cliente faz login
2. Acessa dashboard
3. Clica em "Nova Solicitação"
4. Preenche formulário
5. Envia solicitação
6. Recebe confirmação
7. Acompanha status em "Minhas Solicitações"
```

### 7.4 Fluxo: Cliente → Visualizar Histórico

```
1. Cliente faz login
2. Acessa dashboard
3. Clica em "Histórico"
4. Visualiza serviços contratados
5. Clica em "Ver Detalhes"
6. Visualiza itens instalados e garantia
```

### 7.5 Fluxo: Admin → Gerenciar Solicitação

```
1. Admin faz login
2. Acessa dashboard
3. Visualiza solicitações pendentes
4. Clica em solicitação
5. Atualiza status
6. Agenda visita técnica
7. Registra serviço realizado
```

---

## 8. Rotas e Páginas

### 8.1 Rotas Públicas

| Rota | Página | Descrição |
|------|--------|-----------|
| `/` | Home | Página inicial com hero, serviços, galeria |
| `/servicos` | Serviços | Lista completa de serviços |
| `/servicos/[slug]` | Serviço Detalhado | Página individual de serviço |
| `/trabalhos` | Portfólio | Galeria de trabalhos realizados |
| `/sobre` | Sobre | História e valores da empresa |
| `/contato` | Contato | Formulário e informações de contato |

### 8.2 Rotas de Autenticação

| Rota | Página | Descrição |
|------|--------|-----------|
| `/cliente/login` | Login Cliente | Autenticação de clientes |
| `/cliente/cadastro` | Cadastro Cliente | Registro de novos clientes |
| `/admin/login` | Login Admin | Autenticação de administradores |
| `/auth/secure/admin-access` | Admin Access | Acesso seguro admin |

### 8.3 Rotas Protegidas - Cliente

| Rota | Página | Descrição | Middleware |
|------|--------|-----------|------------|
| `/cliente` | Dashboard | Visão geral do cliente | `auth` |
| `/cliente/solicitacoes` | Solicitações | Lista de solicitações | `auth` |
| `/cliente/solicitacoes/nova` | Nova Solicitação | Formulário de solicitação | `auth` |
| `/cliente/historico` | Histórico | Serviços contratados | `auth` |

### 8.4 Rotas Protegidas - Admin

| Rota | Página | Descrição | Middleware |
|------|--------|-----------|------------|
| `/sys/mgmt/dashboard-v2` | Dashboard Admin | Painel administrativo | `admin` |

### 8.5 Middlewares

**auth.ts:**
- Verifica se usuário está autenticado
- Redireciona para login se não autenticado
- Permite acesso a rotas protegidas

**admin.ts:**
- Verifica se usuário é admin
- Redireciona para home se não for admin
- Permite acesso a rotas administrativas

---

## 9. Integrações

### 9.1 WhatsApp Business

**Objetivo:** Canal principal de conversão e comunicação

**Implementação:**
- Links diretos via `wa.me`
- Mensagens pré-formatadas com contexto
- Botão flutuante em todas as páginas

**Mensagens:**
- Solicitação de orçamento
- Dúvidas sobre serviços
- Acompanhamento de solicitação
- Suporte técnico

**Formato:**
```
Olá! Gostaria de solicitar um orçamento para:

Serviço: [Nome do Serviço]
Bairro: [Bairro do Cliente]

[Mensagem adicional]
```

### 9.2 Supabase

**Auth:**
- Autenticação JWT
- Gestão de sessões
- Recuperação de senha
- Roles (client/admin)

**Database:**
- PostgreSQL
- Row Level Security
- Triggers automáticos
- Índices otimizados

**Storage (Futuro):**
- Upload de imagens
- Armazenamento de documentos
- CDN integrado

### 9.3 Email (Futuro)

**Transacional:**
- Confirmação de cadastro
- Recuperação de senha
- Notificações de status
- Relatórios

**Marketing (Futuro):**
- Newsletter
- Promoções
- Dicas de manutenção

### 9.4 Analytics

**Vercel Analytics:**
- Pageviews
- Performance
- Web Vitals

**Google Analytics (Futuro):**
- Eventos personalizados
- Conversões
- Funil de vendas

---

## 10. Segurança e Privacidade

### 10.1 Autenticação

- JWT tokens via Supabase Auth
- Sessões com expiração
- Refresh tokens automáticos
- Logout em todos os dispositivos

### 10.2 Autorização

- Row Level Security (RLS)
- Políticas por role
- Validação server-side
- Middleware de proteção

### 10.3 Proteção de Dados

- HTTPS obrigatório
- Sanitização de inputs
- Validação de tipos
- Escape de SQL injection

### 10.4 Rate Limiting

- Limite de requisições por IP
- Proteção contra brute force
- Throttling em APIs sensíveis

### 10.5 Logs e Auditoria

- Log de acessos admin
- Log de tentativas de login
- Alertas de segurança
- Backup automático

### 10.6 LGPD

- Consentimento de dados
- Política de privacidade
- Direito ao esquecimento
- Portabilidade de dados

---

## 11. Performance e Escalabilidade

### 11.1 Performance

**Frontend:**
- Code splitting automático (Nuxt)
- Lazy loading de imagens
- Prefetch de rotas
- Compressão de assets

**Backend:**
- Índices em queries frequentes
- Cache de queries (futuro)
- CDN para assets estáticos
- Edge functions

**Métricas:**
- LCP < 2.5s
- FID < 100ms
- CLS < 0.1
- TTI < 3.5s

### 11.2 Escalabilidade

**Horizontal:**
- Serverless (Vercel)
- Auto-scaling
- Load balancing automático

**Vertical:**
- Database scaling (Supabase)
- Connection pooling
- Read replicas (futuro)

### 11.3 Monitoramento

- Vercel Analytics
- Supabase Dashboard
- Error tracking (futuro)
- Uptime monitoring (futuro)

---

## 12. Métricas de Sucesso

### 12.1 KPIs de Negócio

**Conversão:**
- Taxa de conversão visitante → lead: > 5%
- Taxa de conversão lead → cliente: > 20%
- Tempo médio de resposta: < 2 horas

**Engajamento:**
- Bounce rate: < 50%
- Tempo médio na página: > 2 minutos
- Páginas por sessão: > 3

**Satisfação:**
- NPS (futuro): > 8
- Taxa de retorno: > 30%
- Avaliações positivas: > 90%

### 12.2 KPIs Técnicos

**Performance:**
- Uptime: > 99.9%
- Tempo de carregamento: < 3s
- Core Web Vitals: Todos "Good"

**Segurança:**
- Tentativas de invasão bloqueadas: 100%
- Vulnerabilidades críticas: 0
- Tempo de resposta a incidentes: < 1 hora

### 12.3 KPIs de Produto

**Adoção:**
- Clientes cadastrados: +50/mês
- Solicitações via plataforma: > 70%
- Uso de área do cliente: > 60%

**Retenção:**
- Taxa de churn: < 5%
- Frequência de uso: > 2x/mês
- Lifetime value: Crescente

---

## 13. Roadmap

### 13.1 Fase 1 - MVP (Concluído)

- ✅ Site institucional
- ✅ Área do cliente básica
- ✅ Autenticação
- ✅ Solicitações
- ✅ Histórico
- ✅ Integração WhatsApp

### 13.2 Fase 2 - Gestão Admin (Em Desenvolvimento)

- 🔄 Dashboard administrativo
- 🔄 Gestão de leads
- 🔄 Gestão de solicitações
- 🔄 Registro de serviços
- 🔄 Relatórios básicos

### 13.3 Fase 3 - Melhorias (Planejado)

- 📋 Upload de imagens
- 📋 Notificações push
- 📋 Chat integrado
- 📋 Agendamento online
- 📋 Pagamento online

### 13.4 Fase 4 - Expansão (Futuro)

- 📋 App mobile nativo
- 📋 Sistema de avaliações
- 📋 Programa de fidelidade
- 📋 Marketplace de parceiros
- 📋 API pública

---

## 14. Anexos

### 14.1 Glossário

- **Lead:** Potencial cliente que demonstrou interesse
- **Solicitação:** Pedido de orçamento ou visita técnica
- **Job:** Serviço realizado e concluído
- **RLS:** Row Level Security (segurança em nível de linha)
- **JWT:** JSON Web Token (token de autenticação)
- **CTA:** Call to Action (chamada para ação)

### 14.2 Referências

- [Nuxt 4 Documentation](https://nuxt.com)
- [Supabase Documentation](https://supabase.com/docs)
- [Tailwind CSS](https://tailwindcss.com)
- [Vue 3 Documentation](https://vuejs.org)

### 14.3 Contatos

- **Desenvolvimento:** dev@novaalianca.com.br
- **Produto:** produto@novaalianca.com.br
- **Suporte:** suporte@novaalianca.com.br

---

**Última Atualização:** 26 de Fevereiro de 2026  
**Próxima Revisão:** 26 de Março de 2026
