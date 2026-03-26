# PRD — Nova Aliança Service Management System

**Versão:** 1.0  
**Data:** Março 2026  
**Stack:** Nuxt 4 · Vue 3 · TypeScript · Supabase · Tailwind CSS · Vercel

---

## 1. Visão Geral

A Nova Aliança é uma plataforma B2B de gestão de serviços para uma empresa de automação e segurança eletrônica em São Paulo. O sistema gerencia o ciclo completo de atendimento — da solicitação do cliente até o agendamento, execução e faturamento — para seis serviços principais:

- Automação de portões
- Câmeras de segurança
- Interfones / videoporteiros
- Fotocélulas
- Travas elétricas
- Manutenção preventiva

A plataforma possui arquitetura de portal duplo: **Portal do Cliente** e **Painel Administrativo**, com controle de acesso baseado em papéis (RBAC).

---

## 2. Objetivos do Produto

| Objetivo | Métrica de sucesso |
|---|---|
| Digitalizar o fluxo de solicitações de serviço | 100% das solicitações registradas no sistema |
| Reduzir tempo de resposta ao cliente | Notificação automática em < 5 min após solicitação |
| Centralizar gestão de agendamentos | Zero conflitos de agenda por duplo agendamento |
| Profissionalizar comunicação com clientes | Emails transacionais com branding da empresa |
| Exibir portfólio de trabalhos realizados | Galeria pública atualizada pelo admin |

---

## 3. Usuários e Papéis

### 3.1 Clientes
Pessoas físicas ou jurídicas que contratam serviços. Acessam o portal via convite do admin.

**Capacidades:**
- Solicitar serviços
- Acompanhar status das solicitações
- Visualizar agendamentos
- Acessar notas fiscais
- Gerenciar perfil e preferências de notificação

### 3.2 Administradores
Funcionários da Nova Aliança. Três níveis de permissão:

| Papel | Permissões |
|---|---|
| `super_admin` | Acesso total, criação de admins, configurações do sistema |
| `editor` | Aprovar solicitações, gerenciar agenda, portfólio |
| `viewer` | Somente leitura |

---

## 4. Funcionalidades

### 4.1 Autenticação e Controle de Acesso

- Login separado para clientes (`/login`) e admins (`/gestao-na/login`)
- Sessões seguras via Supabase Auth
- Middleware de rota protegendo áreas restritas
- Bloqueio de conta após múltiplas tentativas falhas
- Logout automático por inatividade

### 4.2 Sistema de Convites

- Admin gera link único com prazo de expiração
- Email enviado via Gmail SMTP com branding da empresa
- Cliente acessa link e completa cadastro
- Vínculo automático entre convite e conta criada
- Admin pode revogar ou reenviar convites pendentes

### 4.3 Solicitação de Serviços (Cliente)

- Catálogo com os 6 serviços disponíveis
- Formulário contextual por tipo de serviço
- Validação de campos obrigatórios no frontend e backend
- Notificação automática ao admin após envio
- Acompanhamento de status em tempo real

**Estados de uma solicitação:**
```
pending → approved → in_progress → completed
         ↓
      requires_info
         ↓
      cancelled
```

### 4.4 Gestão de Solicitações (Admin)

- Listagem com filtros por status, tipo de serviço e data
- Aprovação, rejeição ou solicitação de informações adicionais
- Adição de notas internas
- Trilha de auditoria completa de todas as ações
- Notificação automática ao cliente em cada mudança de status

### 4.5 Agendamentos

- Admin cria agendamento vinculado a uma solicitação aprovada
- Validação de disponibilidade do técnico (sem duplo agendamento)
- Notificação de confirmação para cliente e técnico
- Lembrete automático 24h antes do agendamento
- Reagendamento com notificação a todas as partes

### 4.6 Portfólio

- Upload de fotos e vídeos de trabalhos realizados
- Categorização por tipo de serviço e tipo de cliente (residencial/comercial)
- Controle de visibilidade (público/privado)
- Galeria pública exibida no site institucional
- Limites de tamanho e formatos suportados

### 4.7 Notificações

- Notificações em tempo real via Supabase Realtime (sem refresh de página)
- Emails transacionais via Gmail SMTP (Nodemailer)
- Preferências configuráveis por usuário
- Histórico de notificações
- Retry automático em caso de falha de entrega

### 4.8 Painel Administrativo

- KPIs: solicitações pendentes, agendamentos do dia, uso de storage
- Gestão de clientes (busca, filtros, ações em lote)
- Configurações do site (nome da empresa, WhatsApp, horários)
- Relatório de erros com envio para email de suporte
- Monitoramento de uso de storage do Supabase

### 4.9 Portal do Cliente

- Dashboard com solicitações ativas e próximos agendamentos
- Histórico completo de serviços
- Acesso a notas fiscais
- Gerenciamento de perfil
- Configuração de preferências de notificação

### 4.10 Site Institucional Público

- Página inicial com hero, serviços e portfólio
- Páginas de detalhe por serviço (`/servicos/[slug]`)
- Página sobre a empresa
- Integração com WhatsApp (FAB flutuante)
- SEO otimizado

---

## 5. Arquitetura Técnica

### 5.1 Stack

| Camada | Tecnologia |
|---|---|
| Frontend | Nuxt 4, Vue 3, TypeScript, Tailwind CSS |
| Backend | Nitro (server Nuxt), rotas em `server/api/` |
| Banco de dados | Supabase (PostgreSQL) |
| Autenticação | Supabase Auth |
| Storage | Supabase Storage |
| Realtime | Supabase Realtime (WebSockets) |
| Email | Nodemailer + Gmail SMTP |
| Deploy | Vercel |
| Analytics | Vercel Analytics |
| Testes | Vitest |

### 5.2 Estrutura de Pastas

```
app/
├── components/     # UI components (PascalCase)
├── composables/    # useX() — lógica reativa
├── middleware/     # Guards de rota (auth, adminAuth)
├── pages/          # Rotas baseadas em arquivo
├── plugins/        # Inicialização client-side
└── utils/          # Funções puras

server/
└── api/
    ├── admin/      # Endpoints administrativos
    ├── auth/       # Verificação de email
    ├── convites/   # Geração e registro de convites
    ├── notificacoes/
    └── portfolio/

shared/
└── types/          # Tipos TypeScript compartilhados
```

### 5.3 Segurança

- Service Role Key do Supabase usada apenas no servidor (`server/`)
- Rate limiting via middleware Nitro
- RLS (Row Level Security) no Supabase
- Variáveis sensíveis apenas em `.env` / Vercel Environment Variables
- Validação de entrada em todas as rotas de API

---

## 6. Modelo de Dados (Principais Entidades)

| Tabela | Descrição |
|---|---|
| `clients` | Clientes cadastrados via convite |
| `admins` | Usuários administrativos com papel |
| `service_requests` | Solicitações de serviço dos clientes |
| `appointments` | Agendamentos vinculados a solicitações aprovadas |
| `service_catalog` | Catálogo dos 6 serviços disponíveis |
| `portfolio_items` | Mídia do portfólio de trabalhos |
| `technicians` | Técnicos de campo |
| `invitations` | Convites gerados para novos clientes |
| `notification_config` | Configuração de notificações por evento |

---

## 7. Integrações Externas

| Serviço | Uso |
|---|---|
| Gmail SMTP | Emails transacionais (convites, notificações, alertas) |
| WhatsApp Business | Canal de comunicação externo (link direto via FAB) |
| Vercel | Deploy contínuo a partir da branch `main` |
| Vercel Analytics | Monitoramento de tráfego em produção |

---

## 8. Variáveis de Ambiente

```
NUXT_PUBLIC_SUPABASE_URL
NUXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
GMAIL_EMAIL
GMAIL_APP_PASSWORD
SECURITY_ALERT_EMAIL
NUXT_PUBLIC_WHATSAPP_NUMBER
NUXT_PUBLIC_COMPANY_NAME
```

---

## 9. Fora do Escopo (v1)

- App mobile nativo
- Integração com sistemas de pagamento online
- Módulo de orçamentos automatizados
- Chat em tempo real entre cliente e técnico
- Assinatura digital de contratos
- Integração com ERP externo

---

## 10. Riscos e Mitigações

| Risco | Mitigação |
|---|---|
| Falha no envio de email | Retry automático + log de falhas + alerta ao admin |
| Conflito de agendamento | Validação server-side antes de confirmar |
| Expiração de sessão em operação crítica | Refresh automático de token + aviso ao usuário |
| Upload de arquivo corrompido | Validação de tipo e tamanho antes do upload |
| Push para branch errada no Git | Sempre usar `git push origin master:main` |
