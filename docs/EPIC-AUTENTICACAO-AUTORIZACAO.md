# EPIC: Sistema de Autenticação e Autorização
## Nova Aliança - SCRUM Epic

---

## 📋 Informações do Epic

- **ID**: EPIC-AUTH-001
- **Título**: Sistema de Autenticação e Autorização Multi-Camadas
- **Status**: ✅ Implementado (Fase 1)
- **Prioridade**: 🔴 Crítica
- **Sprint**: 1-3
- **Data de Início**: Janeiro 2026
- **Data de Conclusão**: Fevereiro 2026

---

## 🎯 Objetivo do Epic

Implementar um sistema robusto de autenticação e autorização com múltiplas camadas de segurança para proteger áreas administrativas e de clientes, garantindo que apenas usuários autorizados possam acessar recursos específicos baseado em suas roles.

---

## 📊 Métricas de Sucesso

- ✅ 100% das áreas administrativas protegidas
- ✅ 0 acessos não autorizados bem-sucedidos
- ✅ Tempo de resposta de login < 2 segundos
- ✅ Taxa de bloqueio de bots > 95%
- ✅ Alertas de segurança enviados em < 5 segundos
- ✅ 100% dos acessos auditados

---

## 👥 Stakeholders

- **Product Owner**: Gestor Nova Aliança
- **Scrum Master**: Tech Lead
- **Dev Team**: Desenvolvedores Full Stack
- **Security Team**: Responsável por segurança
- **End Users**: Administradores, Equipe Comercial, Clientes

---

## 🗂️ User Stories

### FASE 1: Autenticação Básica ✅ CONCLUÍDO

#### US-001: Login de Usuário
**Como** usuário do sistema  
**Quero** fazer login com email e senha  
**Para** acessar áreas restritas do sistema

**Critérios de Aceitação**:
- [x] Página de login com campos email e senha
- [x] Validação de credenciais via Supabase Auth
- [x] Geração de JWT token após login bem-sucedido
- [x] Redirecionamento baseado em role do usuário
- [x] Mensagens de erro claras para credenciais inválidas
- [x] Loading state durante autenticação

**Pontos**: 5  
**Sprint**: 1

---

#### US-002: Cadastro de Usuário
**Como** novo usuário  
**Quero** criar uma conta no sistema  
**Para** acessar funcionalidades de cliente

**Critérios de Aceitação**:
- [x] Formulário de cadastro com nome, email, whatsapp, senha
- [x] Validação de email único
- [x] Criação de perfil automaticamente
- [x] Criação de registro na tabela clients (se role = client)
- [x] Email de confirmação (opcional)
- [x] Senha com requisitos mínimos de segurança

**Pontos**: 5  
**Sprint**: 1

---


#### US-003: Logout de Usuário
**Como** usuário autenticado  
**Quero** fazer logout do sistema  
**Para** encerrar minha sessão de forma segura

**Critérios de Aceitação**:
- [x] Botão de logout visível em todas as páginas autenticadas
- [x] Limpeza de sessão e tokens
- [x] Redirecionamento para página inicial
- [x] Estado de autenticação resetado
- [x] Confirmação visual de logout

**Pontos**: 2  
**Sprint**: 1

---

#### US-004: Recuperação de Senha
**Como** usuário que esqueceu a senha  
**Quero** recuperar minha senha via email  
**Para** voltar a acessar o sistema

**Critérios de Aceitação**:
- [x] Link "Esqueci minha senha" na página de login
- [x] Formulário para inserir email
- [x] Envio de email com link de recuperação
- [x] Página para definir nova senha
- [x] Validação de token de recuperação
- [x] Expiração de token após 1 hora

**Pontos**: 5  
**Sprint**: 1

---

### FASE 2: Autorização e Roles ✅ CONCLUÍDO

#### US-005: Sistema de Roles (RBAC)
**Como** administrador do sistema  
**Quero** que usuários tenham roles específicas  
**Para** controlar o acesso a diferentes áreas

**Critérios de Aceitação**:
- [x] Tipo Profile com campo role
- [x] Roles implementadas: admin, client
- [x] Verificação de role no middleware
- [x] Redirecionamento baseado em role
- [x] Computed property isAdmin no composable

**Pontos**: 8  
**Sprint**: 2

---

#### US-006: Middleware de Autorização Admin
**Como** sistema  
**Quero** verificar autorização em múltiplas camadas  
**Para** garantir que apenas admins acessem áreas administrativas

**Critérios de Aceitação**:
- [x] CAMADA 1: Verificação de autenticação
- [x] CAMADA 2: Carregamento de perfil
- [x] CAMADA 3: Verificação de role admin
- [x] CAMADA 4: Audit log de acesso
- [x] CAMADA 5: Verificação de sessão ativa
- [x] Redirecionamento apropriado em cada camada

**Pontos**: 13  
**Sprint**: 2

---

#### US-007: Proteção de Rotas
**Como** desenvolvedor  
**Quero** aplicar middleware de forma declarativa  
**Para** proteger rotas facilmente

**Critérios de Aceitação**:
- [x] Middleware auth para autenticação básica
- [x] Middleware admin para role admin
- [x] definePageMeta para aplicar middleware
- [x] Middleware aplicado em /admin/*
- [x] Middleware aplicado em /cliente/*

**Pontos**: 5  
**Sprint**: 2

---

### FASE 3: Segurança Avançada ✅ CONCLUÍDO

#### US-008: Rate Limiting
**Como** sistema  
**Quero** limitar requisições por IP  
**Para** proteger contra brute force e scraping

**Critérios de Aceitação**:
- [x] Rate limiting por IP e rota
- [x] Configuração diferente por tipo de rota
- [x] Bloqueio automático após exceder limite
- [x] Headers X-RateLimit-* nas respostas
- [x] Limpeza automática de entradas expiradas
- [x] Alerta de segurança em bloqueios

**Pontos**: 8  
**Sprint**: 2

---

#### US-009: Proteção contra Bots
**Como** sistema  
**Quero** detectar e bloquear bots  
**Para** prevenir ataques automatizados

**Critérios de Aceitação**:
- [x] Honeypot field na página de login
- [x] Detecção silenciosa de bots
- [x] CAPTCHA progressivo (após 2 tentativas)
- [x] Bloqueio após 5 tentativas falhas
- [x] User-Agent validation

**Pontos**: 8  
**Sprint**: 2

---

#### US-010: Página de Login Segura
**Como** administrador  
**Quero** uma página de login com múltiplas proteções  
**Para** garantir acesso seguro ao painel admin

**Critérios de Aceitação**:
- [x] Design profissional e seguro
- [x] Honeypot integrado
- [x] CAPTCHA progressivo
- [x] Contador de tentativas falhas
- [x] Mensagens de erro apropriadas
- [x] Loading states
- [x] SEO protection (noindex)
- [x] Badge de conexão segura

**Pontos**: 13  
**Sprint**: 3

---

### FASE 4: Auditoria e Monitoramento ✅ CONCLUÍDO

#### US-011: Logs de Auditoria
**Como** administrador de segurança  
**Quero** registrar todos os eventos de segurança  
**Para** auditar e investigar incidentes

**Critérios de Aceitação**:
- [x] API para log de acesso autorizado
- [x] API para log de tentativa não autorizada
- [x] API para alerta de login falho
- [x] Logs no console com prefixos
- [x] Metadata completa (IP, User-Agent, timestamp)
- [ ] Persistência em banco de dados (planejado)

**Pontos**: 8  
**Sprint**: 3

---

#### US-012: Alertas de Segurança por Email
**Como** administrador  
**Quero** receber alertas de eventos de segurança  
**Para** responder rapidamente a incidentes

**Critérios de Aceitação**:
- [x] Configuração SMTP com Gmail
- [x] Template HTML profissional
- [x] Tipos de alerta: UNAUTHORIZED_ACCESS, RATE_LIMIT_EXCEEDED, MULTIPLE_FAILED_LOGINS
- [x] Severidade: LOW, MEDIUM, HIGH, CRITICAL
- [x] Informações completas no email
- [x] Botão para acessar painel admin
- [x] Envio em < 5 segundos

**Pontos**: 13  
**Sprint**: 3

---

#### US-013: Composable useAuth
**Como** desenvolvedor  
**Quero** um composable completo de autenticação  
**Para** gerenciar auth facilmente em componentes

**Critérios de Aceitação**:
- [x] Estados reativos: user, profile, session
- [x] Computed: isAdmin, isAuthenticated
- [x] Métodos: signIn, signUp, signOut
- [x] Métodos: resetPassword, updatePassword
- [x] Métodos: updateProfile, loadProfile
- [x] Método: initAuth com listener
- [x] TypeScript types completos

**Pontos**: 8  
**Sprint**: 3

---


### FASE 5: Roles Adicionais 🔄 PLANEJADO

#### US-014: Role Comercial
**Como** membro da equipe comercial  
**Quero** ter acesso a funcionalidades comerciais  
**Para** gerenciar leads e orçamentos

**Critérios de Aceitação**:
- [ ] Adicionar role 'comercial' ao tipo Profile
- [ ] Criar middleware comercial
- [ ] Permitir acesso a: Dashboard, Leads, Orçamentos, Clientes
- [ ] Bloquear acesso a: Financeiro, Configurações
- [ ] Testes de autorização

**Pontos**: 8  
**Sprint**: 4

---

#### US-015: Role Operacional
**Como** membro da equipe técnica  
**Quero** ter acesso a funcionalidades operacionais  
**Para** gerenciar agenda e executar serviços

**Critérios de Aceitação**:
- [ ] Adicionar role 'operacional' ao tipo Profile
- [ ] Criar middleware operacional
- [ ] Permitir acesso a: Dashboard, Agenda, Serviços, Jobs
- [ ] Bloquear acesso a: Leads, Orçamentos, Financeiro
- [ ] Testes de autorização

**Pontos**: 8  
**Sprint**: 4

---

#### US-016: Role Financeiro
**Como** membro da equipe financeira  
**Quero** ter acesso a funcionalidades financeiras  
**Para** gerenciar pagamentos e emitir notas fiscais

**Critérios de Aceitação**:
- [ ] Adicionar role 'financeiro' ao tipo Profile
- [ ] Criar middleware financeiro
- [ ] Permitir acesso a: Dashboard, Financeiro, Relatórios, NF-e
- [ ] Bloquear acesso a: Leads, Agenda, Serviços
- [ ] Testes de autorização

**Pontos**: 8  
**Sprint**: 4

---

#### US-017: Matriz de Permissões
**Como** administrador  
**Quero** uma matriz clara de permissões por role  
**Para** entender o que cada role pode fazer

**Critérios de Aceitação**:
- [ ] Documentação da matriz de permissões
- [ ] Tabela visual de permissões
- [ ] Implementação de verificações por funcionalidade
- [ ] Testes automatizados de permissões
- [ ] UI mostrando permissões do usuário

**Pontos**: 5  
**Sprint**: 4

---

### FASE 6: Segurança Avançada 🔄 PLANEJADO

#### US-018: Tabela de Auditoria no Banco
**Como** administrador de segurança  
**Quero** persistir logs de auditoria no banco  
**Para** análise histórica e compliance

**Critérios de Aceitação**:
- [ ] Criar tabela security_audit_log
- [ ] Índices para performance
- [ ] RLS para acesso apenas por admins
- [ ] Migração de logs do console para banco
- [ ] Retenção de 1 ano
- [ ] API para consultar logs

**Pontos**: 13  
**Sprint**: 5

---

#### US-019: Dashboard de Segurança
**Como** administrador  
**Quero** visualizar métricas de segurança  
**Para** monitorar a saúde do sistema

**Critérios de Aceitação**:
- [ ] Página /sys/mgmt/security
- [ ] Gráfico de tentativas de login
- [ ] Lista de IPs bloqueados
- [ ] Últimos acessos admin
- [ ] Tentativas não autorizadas
- [ ] Estatísticas de rate limiting
- [ ] Logs em tempo real

**Pontos**: 13  
**Sprint**: 5

---

#### US-020: Two-Factor Authentication (2FA)
**Como** usuário admin  
**Quero** habilitar autenticação de dois fatores  
**Para** aumentar a segurança da minha conta

**Critérios de Aceitação**:
- [ ] Geração de QR code TOTP
- [ ] Verificação de código 2FA no login
- [ ] Códigos de backup
- [ ] Opção de habilitar/desabilitar 2FA
- [ ] Suporte a apps: Google Authenticator, Authy
- [ ] Recovery flow se perder acesso

**Pontos**: 21  
**Sprint**: 6

---

#### US-021: Gerenciamento de Sessões
**Como** usuário  
**Quero** ver e gerenciar minhas sessões ativas  
**Para** controlar onde estou logado

**Critérios de Aceitação**:
- [ ] Lista de sessões ativas
- [ ] Informações: dispositivo, IP, localização, última atividade
- [ ] Botão para encerrar sessão remota
- [ ] Notificação de novo login
- [ ] Limite de sessões simultâneas (configurável)
- [ ] Logout de todas as sessões

**Pontos**: 13  
**Sprint**: 6

---

#### US-022: IP Whitelist para Admin
**Como** administrador  
**Quero** restringir acesso admin a IPs específicos  
**Para** aumentar a segurança

**Critérios de Aceitação**:
- [ ] Configuração de IPs permitidos
- [ ] Suporte a ranges (CIDR)
- [ ] Bloqueio automático de IPs não permitidos
- [ ] Alerta de tentativa de IP não autorizado
- [ ] UI para gerenciar whitelist
- [ ] Bypass temporário (emergência)

**Pontos**: 13  
**Sprint**: 6

---

#### US-023: Headers de Segurança
**Como** sistema  
**Quero** aplicar headers de segurança  
**Para** proteger contra ataques comuns

**Critérios de Aceitação**:
- [ ] Content-Security-Policy (CSP)
- [ ] Strict-Transport-Security (HSTS)
- [ ] X-Frame-Options: DENY
- [ ] X-Content-Type-Options: nosniff
- [ ] X-XSS-Protection
- [ ] Referrer-Policy
- [ ] Permissions-Policy
- [ ] Testes de headers

**Pontos**: 8  
**Sprint**: 5

---

### FASE 7: Compliance e Testes 🔄 PLANEJADO

#### US-024: Compliance LGPD
**Como** empresa  
**Quero** estar em compliance com LGPD  
**Para** proteger dados dos usuários

**Critérios de Aceitação**:
- [ ] Política de privacidade
- [ ] Termos de uso
- [ ] Consentimento de cookies
- [ ] Direito ao esquecimento
- [ ] Exportação de dados do usuário
- [ ] Anonimização de dados
- [ ] Documentação de compliance

**Pontos**: 21  
**Sprint**: 7

---

#### US-025: Testes Automatizados de Segurança
**Como** desenvolvedor  
**Quero** testes automatizados de segurança  
**Para** garantir que proteções funcionam

**Critérios de Aceitação**:
- [ ] Testes de autenticação
- [ ] Testes de autorização por role
- [ ] Testes de rate limiting
- [ ] Testes de middleware
- [ ] Testes de APIs de segurança
- [ ] Testes de composable useAuth
- [ ] Coverage > 80%

**Pontos**: 13  
**Sprint**: 7

---

#### US-026: Penetration Testing
**Como** administrador de segurança  
**Quero** realizar testes de penetração  
**Para** identificar vulnerabilidades

**Critérios de Aceitação**:
- [ ] Contratação de empresa especializada
- [ ] Testes de SQL injection
- [ ] Testes de XSS
- [ ] Testes de CSRF
- [ ] Testes de brute force
- [ ] Relatório de vulnerabilidades
- [ ] Plano de correção

**Pontos**: 21  
**Sprint**: 8

---

## 📈 Roadmap

### Sprint 1 (Concluído ✅)
- US-001: Login de Usuário
- US-002: Cadastro de Usuário
- US-003: Logout de Usuário
- US-004: Recuperação de Senha

### Sprint 2 (Concluído ✅)
- US-005: Sistema de Roles (RBAC)
- US-006: Middleware de Autorização Admin
- US-007: Proteção de Rotas
- US-008: Rate Limiting
- US-009: Proteção contra Bots

### Sprint 3 (Concluído ✅)
- US-010: Página de Login Segura
- US-011: Logs de Auditoria
- US-012: Alertas de Segurança por Email
- US-013: Composable useAuth

### Sprint 4 (Planejado)
- US-014: Role Comercial
- US-015: Role Operacional
- US-016: Role Financeiro
- US-017: Matriz de Permissões

### Sprint 5 (Planejado)
- US-018: Tabela de Auditoria no Banco
- US-019: Dashboard de Segurança
- US-023: Headers de Segurança

### Sprint 6 (Planejado)
- US-020: Two-Factor Authentication (2FA)
- US-021: Gerenciamento de Sessões
- US-022: IP Whitelist para Admin

### Sprint 7 (Planejado)
- US-024: Compliance LGPD
- US-025: Testes Automatizados de Segurança

### Sprint 8 (Planejado)
- US-026: Penetration Testing

---

## 📊 Burndown

### Total de Story Points

- **Fase 1**: 17 pontos ✅
- **Fase 2**: 26 pontos ✅
- **Fase 3**: 29 pontos ✅
- **Fase 4**: 29 pontos ✅
- **Fase 5**: 29 pontos 🔄
- **Fase 6**: 68 pontos 🔄
- **Fase 7**: 55 pontos 🔄

**Total Implementado**: 101 pontos  
**Total Planejado**: 152 pontos  
**Total Geral**: 253 pontos

---

## 🎯 Definition of Done

Uma user story é considerada "Done" quando:

- [x] Código implementado e revisado
- [x] Testes unitários escritos e passando
- [x] Testes de integração passando
- [x] Documentação atualizada
- [x] Code review aprovado
- [x] Deploy em staging realizado
- [x] Testes de aceitação passando
- [x] Performance validada
- [x] Segurança validada
- [x] Deploy em produção realizado

---

## 🔗 Dependências

### Dependências Externas
- Supabase Auth configurado
- Gmail SMTP configurado
- PostgreSQL com RLS
- Nuxt 3 instalado

### Dependências Internas
- US-005 (Roles) depende de US-001 (Login)
- US-006 (Middleware) depende de US-005 (Roles)
- US-014-016 (Roles adicionais) dependem de US-005 (Roles)
- US-019 (Dashboard) depende de US-018 (Tabela de Auditoria)
- US-020 (2FA) depende de US-001 (Login)

---

## 🚨 Riscos e Mitigações

### Risco 1: Rate Limiting muito restritivo
**Impacto**: Médio  
**Probabilidade**: Baixa  
**Mitigação**: Monitorar métricas e ajustar limites conforme necessário

### Risco 2: Emails de alerta não chegando
**Impacto**: Alto  
**Probabilidade**: Baixa  
**Mitigação**: Logs de fallback, múltiplos canais de alerta

### Risco 3: Performance de middleware
**Impacto**: Médio  
**Probabilidade**: Baixa  
**Mitigação**: Caching de perfis, otimização de queries

### Risco 4: Complexidade de múltiplas roles
**Impacto**: Alto  
**Probabilidade**: Média  
**Mitigação**: Matriz de permissões clara, testes automatizados

---

## 📝 Notas

- Sistema implementado com foco em Defense in Depth
- Todas as camadas de segurança são independentes
- Falha em uma camada não compromete as outras
- Logs e alertas são não-bloqueantes
- Performance não foi comprometida pela segurança

---

**Última atualização**: 26 de fevereiro de 2026  
**Versão**: 1.0.0  
**Status**: Fase 1-4 Concluídas, Fase 5-7 Planejadas
