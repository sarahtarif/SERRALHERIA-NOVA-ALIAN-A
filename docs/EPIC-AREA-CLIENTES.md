# ÉPICO: Área de Clientes Orientada a Leads e Relacionamento

**Projeto:** Serralheria Nova Aliança  
**Data de Criação:** 26 de Fevereiro de 2026  
**Sprint:** Q1 2026  
**Prioridade:** Alta  
**Estimativa:** 21 Story Points

---

## 📋 Visão Geral do Épico

### Objetivo de Negócio
Redesenhar a Área de Clientes para maximizar a geração de leads qualificados via Google Ads e melhorar o relacionamento pós-venda, reduzindo a dependência de WhatsApp/telefone para acompanhamento de serviços.

### Problema Atual
- Visitantes de Google Ads não encontram caminho claro para solicitar orçamento
- Falta de segmentação por perfil de cliente (Família, Pets, Idosos, Empresas)
- Clientes existentes dependem 100% de WhatsApp/telefone para acompanhamento
- Ausência de self-service para solicitações pós-venda (2ª via, manutenção)

### Solução Proposta
Criar duas camadas integradas:
1. **Camada Pública:** Landing page otimizada para conversão com segmentação por perfil
2. **Camada Logada (MVP):** Dashboard simples para acompanhamento de orçamentos e serviços

### Métricas de Sucesso
- **Taxa de conversão:** Aumentar de 3% para 8% (visitante → lead)
- **Tempo até primeiro contato:** Reduzir de 4h para 1h
- **Redução de chamadas:** 30% das solicitações pós-venda via plataforma
- **Taxa de cliques WhatsApp:** > 15% dos visitantes da página
- **Taxa de envio de formulário:** > 10% dos visitantes
- **Adoção área logada:** 40% dos clientes em 3 meses

---

## 🎯 Histórias de Usuário

### US-01: Landing Page de Entrada para Leads Mobile
**Como** visitante vindo de Google Ads no celular  
**Quero** cair em uma tela clara de "Área do Cliente" com opções rápidas por perfil  
**Para** entender em poucos segundos que a Nova Aliança atende minha necessidade e chamar no WhatsApp com 1 clique

**Prioridade:** Alta  
**Story Points:** 5  
**Sprint:** Sprint 1

#### Critérios de Aceite
- [ ] Rota `/clientes` ou `/area-do-cliente` acessível via menu principal
- [ ] Hero section com título "Área do Cliente Nova Aliança" e subtítulo explicativo
- [ ] 4 cards de perfil visíveis: "Famílias", "Pets", "Idosos", "Condomínios/Empresas"
- [ ] Cada card tem ícone, título, descrição curta (max 15 palavras) e CTA
- [ ] Botão WhatsApp fixo aparece após 200px de scroll no mobile
- [ ] Mensagem WhatsApp pré-preenchida diferencia "NOVO ORÇAMENTO" vs "JÁ SOU CLIENTE"
- [ ] Página carrega em < 2s em conexão 4G (LCP < 2.5s)
- [ ] Layout 100% responsivo (mobile-first)
- [ ] Breadcrumb: Home > Área do Cliente

#### Tarefas Técnicas
- [ ] Criar componente `ClientesHero.vue`
- [ ] Criar componente `ClientesPerfis.vue`
- [ ] Criar página `app/pages/clientes/index.vue`
- [ ] Adicionar link no menu principal (Navbar)
- [ ] Configurar meta tags SEO (noindex para área logada, index para pública)
- [ ] Implementar tracking GA4 (pageview, cliques em perfis)

#### Definição de Pronto (DoD)
- [ ] Código revisado e aprovado
- [ ] Testes de responsividade em 3 dispositivos (iPhone, Android, Tablet)
- [ ] Performance validada (Lighthouse > 90)
- [ ] Tracking GA4 funcionando
- [ ] Deploy em staging e validado pelo PO
- [ ] Documentação atualizada

---

### US-02: Conteúdo Segmentado por Perfil com Provas Sociais
**Como** potencial cliente residencial  
**Quero** ver benefícios, avaliações e FAQ específicas do meu contexto  
**Para** confiar e enviar meus dados ou falar direto no WhatsApp

**Prioridade:** Alta  
**Story Points:** 5  
**Sprint:** Sprint 1

#### Critérios de Aceite
- [ ] Seção de benefícios com 4-6 itens (ícone + texto curto)
- [ ] Seção de avaliações Google com nota média e últimas 3 avaliações
- [ ] Selos de confiança: "15+ anos", "Garantia estendida", "Instalação 48h"
- [ ] FAQ accordion com 6-8 perguntas frequentes
- [ ] FAQ específica por perfil (ex: "É seguro para crianças?" para Famílias)
- [ ] Mapa de áreas atendidas em São Paulo
- [ ] Tempo de carregamento de imagens < 1s (lazy loading)
- [ ] Contraste WCAG AA em todos os textos

#### Tarefas Técnicas
- [ ] Criar componente `ClientesBeneficios.vue`
- [ ] Criar componente `ClientesAvaliacoes.vue`
- [ ] Criar componente `ClientesFAQ.vue`
- [ ] Criar componente `ClientesAreasAtendidas.vue`
- [ ] Integrar API Google Reviews (ou mock)
- [ ] Adicionar lazy loading em imagens
- [ ] Implementar accordion acessível (keyboard navigation)

#### Definição de Pronto (DoD)
- [ ] Código revisado e aprovado
- [ ] Conteúdo validado pelo time de marketing
- [ ] Acessibilidade testada (WCAG AA)
- [ ] Imagens otimizadas (WebP, < 100KB)
- [ ] Tracking de interações (cliques em FAQ, visualização de avaliações)
- [ ] Deploy em staging e validado pelo PO

---

### US-03: Formulário Ultra-Curto de Lead com LGPD
**Como** visitante interessado  
**Quero** enviar meus dados em um formulário muito curto  
**Para** receber contato rápido sem precisar preencher muitos campos

**Prioridade:** Alta  
**Story Points:** 3  
**Sprint:** Sprint 1

#### Critérios de Aceite
- [ ] Formulário com apenas 4 campos: Nome, WhatsApp, Bairro, Tipo de Serviço
- [ ] Checkbox de consentimento LGPD obrigatório
- [ ] Link para Política de Privacidade
- [ ] Validação em tempo real (formato telefone, campo obrigatório)
- [ ] Mensagem de erro clara e específica por campo
- [ ] Botão de envio desabilitado até consentimento LGPD
- [ ] Feedback visual de sucesso após envio
- [ ] Redirecionamento para página de confirmação ou modal
- [ ] Dados enviados para Supabase (tabela `leads`)
- [ ] Notificação automática para time comercial (email/Slack)
- [ ] Formulário não permite envio sem consentimento LGPD

#### Tarefas Técnicas
- [ ] Criar componente `ClientesFormLead.vue`
- [ ] Criar composable `useLeadForm.ts` (validação, envio)
- [ ] Criar API endpoint `/api/leads/create.post.ts`
- [ ] Integrar com Supabase (insert em `leads`)
- [ ] Configurar notificação email (Resend ou similar)
- [ ] Adicionar tracking GA4 (form_start, form_submit, form_error)
- [ ] Implementar rate limiting (max 3 envios/IP/hora)

#### Definição de Pronto (DoD)
- [ ] Código revisado e aprovado
- [ ] Validação testada (casos de sucesso e erro)
- [ ] LGPD compliance validado pelo jurídico
- [ ] Rate limiting testado
- [ ] Notificações funcionando
- [ ] Tracking GA4 funcionando
- [ ] Deploy em staging e validado pelo PO

---

### US-04: CTAs Unificados Mobile (WhatsApp + Telefone)
**Como** visitante mobile  
**Quero** ter acesso rápido a WhatsApp e telefone em qualquer parte da página  
**Para** entrar em contato imediatamente quando decidir

**Prioridade:** Alta  
**Story Points:** 2  
**Sprint:** Sprint 1

#### Critérios de Aceite
- [ ] Botão WhatsApp fixo no canto inferior direito (mobile)
- [ ] Botão telefone fixo no canto inferior esquerdo (mobile)
- [ ] Botões aparecem após 200px de scroll
- [ ] Animação suave de entrada (fade + slide)
- [ ] Ícones claros e reconhecíveis
- [ ] Cores: WhatsApp verde (#25D366), Telefone azul (#0056e0)
- [ ] Mensagem WhatsApp pré-preenchida com contexto da página
- [ ] Link telefone com `tel:` para discagem direta
- [ ] Botões não cobrem conteúdo importante
- [ ] Z-index adequado (acima de outros elementos)

#### Tarefas Técnicas
- [ ] Criar componente `ClientesCTAsMobile.vue`
- [ ] Reutilizar composable `useWhatsApp.ts` existente
- [ ] Adicionar lógica de scroll (show/hide)
- [ ] Implementar animações CSS/Tailwind
- [ ] Adicionar tracking de cliques (GA4)
- [ ] Testar em diferentes tamanhos de tela

#### Definição de Pronto (DoD)
- [ ] Código revisado e aprovado
- [ ] Testado em iOS e Android
- [ ] Animações suaves (60fps)
- [ ] Tracking funcionando
- [ ] Não interfere com usabilidade
- [ ] Deploy em staging e validado pelo PO

---

### US-05: Espaço Pós-Venda para Clientes Existentes
**Como** cliente que já fez serviço  
**Quero** ter um espaço onde consigo solicitar 2ª via, manutenção ou nova visita  
**Para** não depender apenas de ligação ou WhatsApp

**Prioridade:** Média  
**Story Points:** 3  
**Sprint:** Sprint 2

#### Critérios de Aceite
- [ ] Seção "Já é Cliente?" visível na página pública
- [ ] Card com 3 opções: "Solicitar 2ª Via", "Agendar Manutenção", "Nova Visita"
- [ ] Cada opção leva para formulário específico ou WhatsApp pré-preenchido
- [ ] Link para "Acessar Minha Área" (login)
- [ ] Formulários curtos (max 3 campos + descrição)
- [ ] Confirmação visual após envio
- [ ] Dados salvos em Supabase (tabela `requests`)
- [ ] Notificação para time de atendimento

#### Tarefas Técnicas
- [ ] Criar componente `ClientesPosVenda.vue`
- [ ] Criar formulários específicos (2ª via, manutenção, visita)
- [ ] Criar API endpoints para cada tipo de solicitação
- [ ] Integrar com Supabase
- [ ] Configurar notificações
- [ ] Adicionar tracking GA4

#### Definição de Pronto (DoD)
- [ ] Código revisado e aprovado
- [ ] Formulários testados (sucesso e erro)
- [ ] Notificações funcionando
- [ ] Tracking funcionando
- [ ] Deploy em staging e validado pelo PO

---

### US-06: Login Passwordless para Área Logada
**Como** cliente cadastrado  
**Quero** fazer login com email + código enviado  
**Para** acessar minha área sem precisar lembrar senha

**Prioridade:** Média  
**Story Points:** 3  
**Sprint:** Sprint 2

#### Critérios de Aceite
- [ ] Página de login em `/clientes/login`
- [ ] Campo de email com validação
- [ ] Botão "Enviar Código"
- [ ] Email enviado com código de 6 dígitos
- [ ] Campo para inserir código
- [ ] Código expira em 10 minutos
- [ ] Máximo 3 tentativas de código incorreto
- [ ] Opção "Reenviar código" após 60 segundos
- [ ] Redirecionamento para dashboard após login
- [ ] Sessão mantida por 7 dias (remember me)
- [ ] Logout em todos os dispositivos (opcional)

#### Tarefas Técnicas
- [ ] Criar página `app/pages/clientes/login.vue`
- [ ] Criar composable `usePasswordlessAuth.ts`
- [ ] Criar API endpoint `/api/auth/send-code.post.ts`
- [ ] Criar API endpoint `/api/auth/verify-code.post.ts`
- [ ] Integrar com Supabase Auth (magic link ou custom)
- [ ] Configurar envio de email (Resend)
- [ ] Implementar rate limiting
- [ ] Adicionar tracking GA4

#### Definição de Pronto (DoD)
- [ ] Código revisado e aprovado
- [ ] Fluxo completo testado
- [ ] Emails chegando corretamente
- [ ] Rate limiting testado
- [ ] Segurança validada
- [ ] Tracking funcionando
- [ ] Deploy em staging e validado pelo PO

---

### US-07: Dashboard de Solicitações (MVP)
**Como** cliente logado  
**Quero** ver o status dos meus orçamentos e serviços  
**Para** entender em que etapa estou sem precisar repetir tudo pelo WhatsApp

**Prioridade:** Média  
**Story Points:** 5  
**Sprint:** Sprint 2

#### Critérios de Aceite
- [ ] Página dashboard em `/clientes/dashboard`
- [ ] Lista de solicitações com: data, tipo, status, valor (quando disponível)
- [ ] Status possíveis: Recebido, Em Análise, Aprovado, Agendado, Concluído
- [ ] Badge colorido por status (verde, amarelo, azul, cinza)
- [ ] Filtro por status
- [ ] Ordenação por data (mais recente primeiro)
- [ ] Botão "Ver Detalhes" por solicitação
- [ ] Página de detalhes com histórico de atualizações
- [ ] Botão "Contatar via WhatsApp" com contexto da solicitação
- [ ] Empty state quando não há solicitações
- [ ] Loading state durante carregamento
- [ ] Paginação (10 itens por página)

#### Tarefas Técnicas
- [ ] Criar página `app/pages/clientes/dashboard.vue`
- [ ] Criar componente `ClientesDashboard.vue`
- [ ] Criar componente `ClientesSolicitacaoCard.vue`
- [ ] Criar componente `ClientesSolicitacaoDetalhes.vue`
- [ ] Criar composable `useSolicitacoes.ts`
- [ ] Criar API endpoint `/api/solicitacoes/list.get.ts`
- [ ] Criar API endpoint `/api/solicitacoes/[id].get.ts`
- [ ] Integrar com Supabase (query com RLS)
- [ ] Adicionar middleware de autenticação
- [ ] Adicionar tracking GA4

#### Definição de Pronto (DoD)
- [ ] Código revisado e aprovado
- [ ] RLS testado (cliente só vê suas solicitações)
- [ ] Performance testada (< 1s para carregar lista)
- [ ] Estados de loading e erro tratados
- [ ] Responsividade validada
- [ ] Tracking funcionando
- [ ] Deploy em staging e validado pelo PO

---

## 🏗️ Arquitetura de Componentes

### Estrutura de Pastas
```
app/
├── pages/
│   └── clientes/
│       ├── index.vue                 # Landing page pública
│       ├── login.vue                 # Login passwordless
│       ├── dashboard.vue             # Dashboard logado
│       └── solicitacoes/
│           └── [id].vue              # Detalhes da solicitação
├── components/
│   └── clientes/
│       ├── ClientesHero.vue          # Hero section
│       ├── ClientesPerfis.vue        # Cards de perfil
│       ├── ClientesBeneficios.vue    # Seção de benefícios
│       ├── ClientesAvaliacoes.vue    # Avaliações Google
│       ├── ClientesFAQ.vue           # FAQ accordion
│       ├── ClientesAreasAtendidas.vue # Mapa de áreas
│       ├── ClientesFormLead.vue      # Formulário de lead
│       ├── ClientesPosVenda.vue      # Seção pós-venda
│       ├── ClientesCTAsMobile.vue    # CTAs fixos mobile
│       ├── ClientesDashboard.vue     # Dashboard logado
│       ├── ClientesSolicitacaoCard.vue # Card de solicitação
│       └── ClientesSolicitacaoDetalhes.vue # Detalhes
├── composables/
│   ├── useLeadForm.ts                # Lógica formulário lead
│   ├── usePasswordlessAuth.ts        # Autenticação passwordless
│   └── useSolicitacoes.ts            # Gestão de solicitações
└── server/
    └── api/
        ├── leads/
        │   └── create.post.ts        # Criar lead
        ├── auth/
        │   ├── send-code.post.ts     # Enviar código
        │   └── verify-code.post.ts   # Verificar código
        └── solicitacoes/
            ├── list.get.ts           # Listar solicitações
            ├── [id].get.ts           # Detalhes
            └── create.post.ts        # Criar solicitação
```

### Fluxo de Dados
```
Visitante → Landing Page (/clientes)
    ↓
Escolhe Perfil → Vê Conteúdo Segmentado
    ↓
Preenche Formulário OU Clica WhatsApp
    ↓
Lead Criado → Notificação Time Comercial
    ↓
(Opcional) Cliente Cadastrado → Login Passwordless
    ↓
Dashboard → Lista de Solicitações
    ↓
Detalhes → Histórico + Ações
```

---

## 📊 Métricas e Eventos GA4

### Eventos de Conversão
```javascript
// Pageview
gtag('event', 'page_view', {
  page_title: 'Área do Cliente',
  page_location: '/clientes'
});

// Clique em Perfil
gtag('event', 'select_profile', {
  profile_type: 'familias' | 'pets' | 'idosos' | 'empresas'
});

// Clique WhatsApp
gtag('event', 'click_whatsapp', {
  source: 'area_clientes',
  message_type: 'novo_orcamento' | 'ja_sou_cliente'
});

// Início de Formulário
gtag('event', 'form_start', {
  form_name: 'lead_form'
});

// Envio de Formulário
gtag('event', 'form_submit', {
  form_name: 'lead_form',
  service_type: 'instalacao' | 'manutencao' | 'outro'
});

// Erro de Formulário
gtag('event', 'form_error', {
  form_name: 'lead_form',
  error_field: 'whatsapp' | 'nome' | 'lgpd'
});

// Login
gtag('event', 'login', {
  method: 'passwordless'
});

// Visualização de Solicitação
gtag('event', 'view_request', {
  request_id: '123',
  request_status: 'em_analise'
});
```

### Métricas Customizadas
- **Taxa de Conversão por Perfil:** % de cliques em cada perfil
- **Tempo até Conversão:** Tempo médio entre pageview e form_submit
- **Taxa de Abandono de Formulário:** % de form_start sem form_submit
- **Adoção de Área Logada:** % de clientes que fazem login
- **Frequência de Uso:** Média de logins por cliente/mês

---

## ✅ Definição de Pronto (DoD) do Épico

### Critérios Gerais
- [ ] Todas as histórias de usuário concluídas e aceitas pelo PO
- [ ] Código revisado e aprovado por 2+ desenvolvedores
- [ ] Testes de responsividade em 5+ dispositivos
- [ ] Performance validada (Lighthouse > 90 em todas as páginas)
- [ ] Acessibilidade WCAG AA validada
- [ ] Tracking GA4 implementado e testado
- [ ] Documentação técnica atualizada
- [ ] Deploy em produção realizado
- [ ] Monitoramento ativo (Sentry, Vercel Analytics)

### Critérios de Negócio
- [ ] Taxa de conversão aumentou > 5%
- [ ] Tempo até primeiro contato < 2h
- [ ] 100+ leads gerados via formulário no primeiro mês
- [ ] 50+ clientes cadastrados na área logada
- [ ] NPS > 8 (feedback de clientes)

### Critérios Técnicos
- [ ] Cobertura de testes > 80%
- [ ] Zero vulnerabilidades críticas (Snyk)
- [ ] Tempo de resposta API < 500ms (p95)
- [ ] Uptime > 99.9%
- [ ] Sem erros JavaScript no Sentry (últimos 7 dias)

---

## 🚀 Roadmap de Implementação

### Sprint 1 (2 semanas)
- US-01: Landing Page de Entrada
- US-02: Conteúdo Segmentado
- US-03: Formulário de Lead
- US-04: CTAs Mobile

**Entrega:** Camada pública completa e funcional

### Sprint 2 (2 semanas)
- US-05: Espaço Pós-Venda
- US-06: Login Passwordless
- US-07: Dashboard MVP

**Entrega:** Camada logada MVP funcional

### Sprint 3 (1 semana)
- Refinamentos baseados em feedback
- Otimizações de performance
- Ajustes de UX
- Testes A/B

**Entrega:** Versão otimizada em produção

---

## 📝 Notas Técnicas

### Integração com Sistema Existente
- Reutilizar componentes: `Navbar`, `Footer`, `WhatsAppFloatingButton`
- Reutilizar composables: `useWhatsApp`, `useAuth`, `useSupabase`
- Manter design system: cores, tipografia, espaçamentos
- Respeitar estrutura de rotas existente

### Considerações de Performance
- Lazy loading de componentes pesados
- Prefetch de rotas críticas
- Otimização de imagens (WebP, lazy loading)
- Code splitting por rota
- Cache de queries Supabase (5 minutos)

### Considerações de Segurança
- Rate limiting em todos os endpoints
- Validação server-side de todos os inputs
- RLS no Supabase para área logada
- CSRF protection
- XSS prevention (sanitização)
- HTTPS obrigatório

### Considerações de LGPD
- Consentimento explícito para coleta de dados
- Link para Política de Privacidade
- Opção de exclusão de dados (futuro)
- Logs de consentimento
- Criptografia de dados sensíveis

---

**Última Atualização:** 26 de Fevereiro de 2026  
**Próxima Revisão:** Sprint Review (a cada 2 semanas)
