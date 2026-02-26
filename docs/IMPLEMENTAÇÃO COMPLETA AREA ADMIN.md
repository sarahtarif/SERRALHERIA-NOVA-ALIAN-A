# Plano de Execução da Área Admin com Boas Práticas (Nuxt 4 + Supabase)

## Visão geral do contexto

O PRD da Área Administrativa já define claramente módulos, fluxos e modelo de dados, e parte da infra está pronta: autenticação Supabase Auth, middleware `admin`, layout admin, dashboard mockado, schema Supabase com tabelas principais e RLS básico. Ainda faltam os módulos funcionais (Leads, Orçamentos, Serviços, Agenda, Clientes, Financeiro, Mídia, Documentos Fiscais) e a conexão real com o banco.[1]

Além do PRD, as melhores práticas atuais para Nuxt 3/4 e Vue 3 recomendam componentes de página finos, extraindo lógica para composables, services de API e stores, mantendo arquivos abaixo de ~300–400 linhas por legibilidade, mesmo que isso implique quebrar componentes usados uma única vez. No Supabase, a segurança deve ser centralizada via RLS por tabela, usando colunas de relacionamento (ex.: `created_by`, `organization_id`) e políticas testadas para cada operação.[2][3][4][5][6][7][8][9][10]

***

## Arquitetura de alto nível da Área Admin

### Camadas e responsabilidades

- **Camada de UI (pages + components)**: arquivos `pages/admin/...` e componentes visuais em `components/admin/...` só cuidam de template, layout e orquestração leve de estado (selecionar filtros, chamar actions, exibir loading/erro).[7][1]
- **Camada de lógica de tela (composables)**: `composables/admin/useLeads.ts`, `useOrcamentos.ts`, etc., concentram regras de negócio do front: montar queries para Supabase, normalizar dados, gerenciar paginação e filtros, lidar com loading/erro.[10][7]
- **Camada de serviços de dados (services)**: `server/services/leadsService.ts` ou `app/services/leads.ts` encapsulam chamadas ao Supabase (CRUD, filtros, joins), mantendo um ponto único para validações e logs; isso também facilita testes unitários.
- **Camada de dados (Supabase)**: tabelas já definidas (`profiles`, `clients`, `leads`, `requests`, `jobs`, `job_items`, `gallery_items`) + novas tabelas (`orcamentos`, `orcamento_itens`, `media_files`, `documentos`, `configuracoes_impostos`, `email_templates`, `email_log`) com RLS e índices adequados.[1]

Essa separação permite manter arquivos pequenos, testáveis e alinhados às boas práticas da Composition API (componentes finos, lógica em composables e services).[3][5][7]

### Estrutura de pastas sugerida (admin)

```text
app/
  pages/
    admin/
      index.vue              # Dashboard
      leads/
        index.vue            # Lista de leads
        novo.vue             # Criar lead
        [id].vue             # Detalhe do lead
      orcamentos/
        index.vue
        novo.vue
        [id].vue
      servicos/
        index.vue
        novo.vue
        [id].vue
      agenda/
        index.vue
      clientes/
        index.vue
        [id].vue
      financeiro/
        index.vue
      galeria/
        index.vue
      configuracoes/
        impostos.vue
        email.vue
        nfe.vue
  components/
    admin/
      layout/
        AdminLayout.vue
      leads/
        LeadList.vue
        LeadCard.vue
        LeadFilters.vue
      orcamentos/
        OrcamentoForm.vue
        OrcamentoItensTable.vue
      shared/
        AdminKpiCard.vue
        AdminStatusBadge.vue
        AdminDataTable.vue
        AdminModal.vue
        AdminToast.vue
  composables/
    admin/
      useLeads.ts
      useOrcamentos.ts
      useServicos.ts
      useAgenda.ts
      useClientes.ts
      useFinanceiro.ts
  middleware/
    admin.ts
  server/
    services/
      leadsService.ts
      orcamentosService.ts
      servicosService.ts
      agendaService.ts
      clientesService.ts
      financeiroService.ts
    api/
      admin/
        leads.get.ts
        leads.post.ts
        leads.[id].patch.ts
        leads.[id].delete.ts
        # idem para orçamentos, serviços...
```

Cada página deve delegar a maior parte da lógica para um composable e/ou service, garantindo que nenhum arquivo `.vue` ou `.ts` de funcionalidade ultrapasse os limites de 400/650 linhas que você definiu.

***

## Rotas e middleware da Área Admin

### Rotas principais

Conforme o PRD, as rotas admin já existem parcialmente e precisam ser completadas:[1]

- `/auth/secure/admin-access` – fluxo de login seguro (já implementado).
- `/admin` – dashboard principal (já implementado com dados mockados).
- `/admin/leads` – lista de leads.
- `/admin/leads/novo` – criação manual de lead.
- `/admin/leads/[id]` – detalhes e histórico do lead.
- `/admin/orcamentos`, `/admin/orcamentos/novo`, `/admin/orcamentos/[id]`.
- `/admin/servicos`, `/admin/agenda`, `/admin/clientes`, `/admin/clientes/[id]`.
- `/admin/financeiro`, `/admin/galeria`, `/admin/configuracoes/*`.

As páginas devem usar `definePageMeta({ middleware: ['admin'] })` para aplicar o middleware de autenticação/role apenas em rotas admin, de acordo com a documentação oficial do Nuxt para route middleware.[11][12]

### Middleware e regras de acesso

- **`middleware/admin.ts` (já existe):** deve verificar `useAuth()` e role (`ROLE_ADMIN`, `ROLE_COMERCIAL`, etc.), abortando navegação ou redirecionando para `/auth/secure/admin-access` caso não autenticado ou sem permissão.[12][11][1]
- **Middleware adicional por módulo (opcional):** por exemplo, `middleware/financeiro.global.ts` aplicando checagens extras em rotas `/admin/financeiro/**`.
- **RouteRules (opcional):** configurar em `nuxt.config` regras de `appMiddleware: 'admin'` para `/admin/**`, conforme práticas da comunidade Nuxt para proteger clusters de rotas administrativas.[13]

***

## Modelo de dados, relacionamentos e RLS no Supabase

### Tabelas e relacionamentos principais

O PRD já define uma boa base de schema, com tabelas para leads, orçamentos, serviços, mídias e documentos, além de colunas de autoria (`created_by`) e relacionamentos entre `leads`, `clients`, `orcamentos`, `requests` (serviços) e `documentos`.[1]

Boas práticas adicionais:

- Garantir que todas as tabelas relacionadas a dados de negócio tenham, no mínimo:
  - `created_by UUID REFERENCES profiles(id)`.
  - `organization_id UUID` (caso exista multi-tenant/filiais agora ou no futuro), seguindo padrões de multi-tenant RLS.[6][8][9][2]
- Declarar FKs consistentes entre:
  - `leads.client_id → clients.id` (quando convertido em cliente).
  - `orcamentos.lead_id`, `orcamentos.client_id`.
  - `requests.orcamento_id`, `requests.client_id`.
  - `documentos.orcamento_id`, `documentos.servico_id`, `documentos.client_id`.
- Indexar colunas usadas em filtros frequentes: `status`, `created_at`, `client_id`, `lead_id`, `servico_id`.

### RLS e políticas recomendadas

- **Princípio geral:** toda tabela com dados sensíveis deve ter RLS ativado e políticas específicas para `SELECT`, `INSERT`, `UPDATE`, `DELETE`.[4][8]
- **Acesso admin interno:** usar role de serviço (service key) nas rotas `server/api/admin/*` para operações administrativas completas, mantendo RLS ativo mas permitindo bypass controlado (role com `bypassrls`) apenas em APIs internas.[4]
- **Acesso por usuário logado (separação de papéis internos):** se diferentes papéis internos (comercial, operacional, financeiro) acessam o mesmo banco diretamente via Supabase client no front, as políticas podem usar `auth.jwt()` para ler claims de role e restringir operações.[8][4]
- **Multi-tenant futuro:** se houver mais de uma unidade/empresa, seguir o padrão de adicionar `organization_id` em todas as tabelas, com políticas limitando as linhas à organização do usuário (join com `profiles`), conforme guias de multi-tenant RLS.[9][2][6]

Além disso, para o seu requisito de rastreio e documentação de cada ação, é recomendável criar uma tabela de `audit_log` (ou reaproveitar `email_log` e similares) para registrar inclusões/atualizações relevantes por módulo.

***

## Boas práticas de componentização e limites de linhas

### Limites sugeridos e fontes

A comunidade Vue/Nuxt não define um limite rígido de linhas, mas vários desenvolvedores reportam que componentes acima de 300–500 linhas começam a prejudicar legibilidade e navegação no código, sugerindo dividir componentes grandes em menores e mover lógica para composables. Isso está alinhado ao seu limite de 400 linhas para arquivos de funcionalidade e 650 para qualquer arquivo.[5][3]

### Estratégia prática para respeitar 400/650 linhas

1. **Componentes de página (`pages/admin/...`):**
   - Responsáveis por layout da tela, wiring de composables, import de componentes e roteamento.
   - Devem delegar lógica de dados para `useXxx()` e serviços.
   - Tamanho alvo: 150–300 linhas, máximo 400.

2. **Componentes de UI reutilizáveis (`components/admin/*`):**
   - Implementam peças específicas: tabela, card de lead, formulário.
   - Evitar acumular muita lógica de negócio; utilizar props e emits claros.
   - Tamanho alvo: 100–250 linhas.

3. **Composables (`composables/admin/useXxx.ts`):**
   - Contêm estado reativo, chamadas a serviços, normalização de dados, regras de negócio do front.[7][10]
   - Podem ser divididos por preocupação (ex.: `useLeadFilters`, `useLeadCrud`) se estiverem chegando perto de 400 linhas.

4. **Services (`server/services/*.ts` ou `app/services/*.ts`):**
   - Funções puras para acesso a dados (Supabase) e transformação básica.
   - Reutilizados por composables e rotas `server/api/admin/*`.

Lista de sinais para dividir arquivos:

- Começa a usar nomes compostos demais (`handleLeadListAndModalAndFilters`).
- Muitas seções de lógica desconectadas (ex.: blocos grandes de form, filtros, tabela, exportação) no mesmo arquivo.[3][5]
- Dificuldade para navegar pelo arquivo sem scroll excessivo.

***
5.5 – Testes de segurança de rota e middleware para a(s) rota(s) criada(s).

Assim, para qualquer nova página ou módulo admin, voce kiro é obrigada a executar esses testes antes de “fechar” a história e avançar.

O que testar em cada nova rota /admin/*
Para toda nova rota de página (ex.: /admin/leads, /admin/orcamentos/[id]), a IA precisa rodar, no mínimo, estes cenários (manual + automatizado se possível):

Sem estar logado

Acessar diretamente a URL (/admin/...) deve:

Disparar o middleware/admin via defineNuxtRouteMiddleware.

Redirecionar para /auth/secure/admin-access (ou rota de login configurada).

Confirmar que nenhum conteúdo da página admin é renderizado enquanto não logar.

Logado com usuário válido, mas role errada

Simular (via Supabase Auth/claims) um usuário logado sem ROLE_ADMIN (ex.: ROLE_COMERCIAL acessando /admin/financeiro).
​

Verificar que o middleware bloqueia ou redireciona (ex.: para /admin com mensagem “sem permissão”), nunca mostrando dados sensíveis.

Logado com role correta

Usuário com role adequada (ROLE_ADMIN, ROLE_COMERCIAL etc.) acessa a página:

Middleware permite o acesso.

Dados carregam normalmente, sem erro de RLS no Supabase.

Proteção contra acesso direto a subrotas

Acessar URLs profundas (ex.: /admin/leads/123, /admin/orcamentos/novo) direto na barra do navegador, sem passar pela lista:

Deve passar pelo mesmo fluxo de middleware (não “fura” autenticação).

SEO e indexação

Conferir que o layout admin ou a própria página define meta robots como noindex, nofollow para rotas /admin/*.
​

Garantir que não há links públicos apontando para /admin a partir do site público.

API routes (server/api/admin/*)
Para cada nova rota de API interna ligada à página (ex.: GET /api/admin/leads, POST /api/admin/orcamentos):

Verificar que a rota checa autenticação (token/cookie Supabase) e role no server, não só no front.

Testar:

Request sem token → 401/403.

Token com role errada → 403.

Token com role certa → 200 com dados esperados.

Como forçar o Kiro a não avançar sem isso
No checklist final da tarefa, adicione explicitamente:

“✅ Rota(s) /admin/... protegida(s) pelo middleware/admin (testes: não logado, role errada, role correta).”

“✅ Rotas server/api/admin/* com verificação de auth/role no server (testes: sem token, role errada, role correta).”

“✅ Meta noindex, nofollow aplicada em todas as novas páginas admin.”
​

atenção!!! de maneira alguma não pode marcar a história como concluída nem iniciar a próxima enquanto esses itens não tiverem sido executados

## Pipeline de desenvolvimento com checagens por tarefa

A sua exigência principal: **cada tarefa precisa passar por verificação de Supabase, testes e documentação antes do agente seguir para a próxima**. Abaixo um fluxo padrão para qualquer tarefa de implementação de módulo/feature na Área Admin.

### Etapas padrão por tarefa

Para cada tarefa (ex.: "Criar `/admin/leads/index.vue` com listagem real"):

1. **Planejamento curto (refinar PRD/História):**
   - Confirmar no PRD-AREA-ADMIN o comportamento esperado da tela/módulo.[1]
   - Criar/atualizar uma história no épico correspondente (ex.: EPIC-AREA-ADMIN.md) com critérios de aceite claros.

2. **Modelagem de dados no Supabase:**
   - Verificar se as tabelas e colunas necessárias já existem (`supabase-schema.sql`).[1]
   - Se precisar de novas colunas/índices, escrever o SQL de migration e registrar no changelog (ex.: `docs/CHANGELOG-DB.md`).
   - Aplicar migration no Supabase e testar com queries simples.

3. **Implementação de service + testes:**
   - Criar ou atualizar `server/services/XService.ts` com funções para a tarefa (ex.: `listLeads`, `createLead`).
   - Adicionar testes unitários/integrados mínimos para o service (Vitest ou similar), especialmente para filtros e paginação.

4. **Implementação de composable:**
   - Criar/atualizar `composables/admin/useXxx.ts` usando o service.
   - Garantir tratamento de loading, erro, estados vazios.
   - Escrever testes unitários para o composable (lógica de filtros, paginação, transformação de dados).

5. **Implementação da UI (componentes + página):**
   - Criar/atualizar componentes em `components/admin/...` (ex.: `LeadList.vue`, `LeadCard.vue`).
   - Criar/atualizar a página em `pages/admin/...` que use o composable e componentes.
   - Verificar tamanho de arquivo: se `*.vue` ultrapassar 400–650 linhas, dividir em subcomponentes.

6. **Verificações no Supabase:**
   - Testar manualmente queries via Supabase SQL Editor ou CLI para os fluxos principais da tarefa (ex.: SELECT com filtros, INSERT, UPDATE, DELETE, RLS).[8][4]
   - Verificar se RLS não bloqueia indevidamente o acesso do papel esperado e não deixa dados vazarem para usuários errados.

7. **Testes end-to-end (prioritário para fluxos críticos):**
   - Se possível, rodar testes e2e (Playwright/Cypress) para o fluxo completo da funcionalidade (ex.: abrir `/admin/leads`, filtrar, visualizar detalhe).

8. **Documentação da inclusão/desenvolvimento:**
   - Registrar a tarefa em um log de implementação, ex.: `docs/IMPLEMENTACAO-AREA-ADMIN.md`, com:
     - ID da tarefa/épico.
     - Descrição curta.
     - Tabelas/colunas afetadas no Supabase.
     - Novos arquivos/rotas.
     - Testes implementados.
   - Atualizar PRD/EPIC se houve qualquer ajuste de escopo.

9. **Checklist de pronto (gate antes de seguir):**
   - Todos os critérios de aceite da história marcados.
   - Todos os testes relevantes passando (unit, integration, e2e). 
   - Verificações Supabase concluídas e anotadas.
   - Limite de linhas respeitado para cada arquivo.
   - Documentação atualizada.

Somente após esse checklist estar completo a IA (Kiro) pode avançar para a próxima tarefa.

***

## Plano de execução por fases/módulos (com gates)

### Fase 0 – Saneamento de infra e padrões (1 sprint)

**Objetivo:** garantir que a base (auth, middleware, estrutura de pastas, padrões de componentização e testes) está sólida antes de construir os módulos.

Tarefas:

1. Revisar `middleware/admin.ts` e `useAuth.ts` para garantir que roles e redirecionamentos seguem a documentação oficial de middleware do Nuxt (uso de `defineNuxtRouteMiddleware`, `navigateTo`, etc.).[11][12]
2. Padronizar estrutura de `composables/admin/*` e `server/services/*` (nomes, assinatura de funções, tratamento de erro).
3. Configurar ambiente de testes (Vitest, por exemplo) para services e composables.
4. Criar `docs/IMPLEMENTACAO-AREA-ADMIN.md` com o formato de log por tarefa.

**Gate da Fase 0:**

- Middleware de admin testado (não permite acesso a `/admin/**` sem login/role).
- Pelo menos 1 composable + 1 service com testes de exemplo.
- Documento de padrões de componentização/testes criado.

### Fase 1 – Dashboard + Leads (Sprints 1–2)

Baseado no Roadmap do PRD (Sprint 1–2).[1]

1. **Conectar Dashboard a dados reais**
   - Criar service `dashboardService.ts` para KPIs (leads do mês, taxa de conversão, serviços na semana, receita).[1]
   - Criar composable `useDashboard.ts` e conectar em `pages/admin/index.vue`.
   - Testar queries no Supabase (contagem, somas) e validar performance.

2. **Módulo de Leads completo**
   - Criar rotas/páginas `/admin/leads`, `/admin/leads/novo`, `/admin/leads/[id]` conforme especificações detalhadas.[1]
   - Implementar `leadsService.ts` (CRUD, filtros, busca, histórico) e `useLeads.ts`.
   - Componentes: `LeadList`, `LeadCard`, `LeadFilters`, `LeadDetail`.
   - Testar RLS das tabelas `leads` e relacionamentos com `clients`.

**Gate da Fase 1:**

- Dashboard exibindo dados reais com queries testadas no Supabase e cobertura de testes mínima nos services.
- CRUD de leads funcional, com filtros/busca e histórico.
- Documentação das estruturas de dados usadas (ex.: payload de lead, filtros) no log de implementação.

### Fase 2 – Orçamentos (Sprints 3–4)

1. **Modelagem e migrations `orcamentos` e `orcamento_itens`**
   - Confirmar ou aplicar DDL do PRD para essas tabelas.[1]
   - Criar índices em `orcamentos.numero`, `orcamentos.client_id`, `orcamentos.status`.
   - Configurar RLS adequada.

2. **Módulo de Orçamentos**
   - Pages: `/admin/orcamentos`, `/admin/orcamentos/novo`, `/admin/orcamentos/[id]`.
   - Components: `OrcamentoForm`, `OrcamentoItensTable`, componentes de cálculo de impostos.
   - Services: `orcamentosService`, com funções para CRUD, cálculo de impostos no back ou front.
   - Geração de PDF (jsPDF + autotable) encapsulada num service/util (`pdfService.ts`) com testes básicos.[1]

3. **Integração com email**
   - Usar `server/utils/email.ts` para envio de PDFs de orçamento, registrando em `email_log`.[1]

**Gate da Fase 2:**

- Orçamentos persistidos em Supabase com relacionamento correto a leads e clientes.
- PDFs gerados e enviados via email em ambiente de teste.
- Tabelas e policies testadas manualmente (SELECT/INSERT/UPDATE/DELETE).

### Fase 3 – Serviços + Agenda + Clientes (Sprints 5–7)

1. **Módulo de Serviços (`requests`/`jobs`)**
   - CRUD de serviços, upload de fotos (ligação com `media_files`).[1]
   - Atualização de status, registro de itens instalados (`job_items`).

2. **Módulo de Agenda**
   - Visualizações mensal/semanal/diária com filtros por técnico, tipo, região.
   - Service dedicado para consultas agregadas por data/bairro.

3. **Módulo de Clientes**
   - Perfil com abas (dados, serviços, orçamentos, fotos/vídeos, documentos).[1]
   - Integração forte com `media_files` e `documentos`.

**Gate da Fase 3:**

- Fluxo completo Lead → Orçamento → Serviço → Conclusão funcionando em ambiente de testes.
- Agenda exibindo serviços por dia/semana com dados reais.
- Perfis de cliente com histórico e mídias vinculadas.

### Fase 4 – Financeiro + Documentos Fiscais (Sprints 8–10)

1. **Módulo Financeiro**
   - Controle de pagamentos, status, relatórios de receita.[1]

2. **Documentos Fiscais**
   - `documentos` + integração com NF-e (via API externa configurável).[1]
   - Geração de CML (contrato) usando templates parametrizáveis armazenados em `email_templates` ou tabela própria.

**Gate da Fase 4:**

- Serviços concluídos geram documentos (contrato, NF-e) com log e rastreio.
- Financeiro consegue listar receitas, pendências e inadimplência.

### Fase 5 – Mídia, relatórios e polimento (Sprints 11–12)

- Gestão de mídia (galeria do site, mídias em perfil do cliente) via `media_files`.[1]
- Relatórios avançados (conversão, receita, serviços) com exportação CSV/Excel.
- Notificações in-app, empty states, UX refinado.

**Gate final:**

- Critérios técnicos, de negócio e de usuário do PRD atendidos (metas de performance, testes e adoção interna).[1]

***

## Como transformar este plano em prompt para a IA (resumo)

Para o agente Kiro seguir esse plano de forma segura e incremental, o prompt principal deve:

- Explicar que **cada tarefa** precisa seguir as 9 etapas padrão (planejamento, modelagem Supabase, services, composables, UI, verificação no Supabase, testes, documentação, checklist) e que **não é permitido avançar para a próxima tarefa sem marcar explicitamente todas as etapas como concluídas**.
- Referenciar este PRD e o arquivo de plano de execução (quando estiver no repositório) como fonte da ordem de fases (0 → 5).
- Reforçar os limites de linhas por arquivo e a exigência de componentes/composables/services finos.
- Solicitar que, ao final de cada tarefa, a IA escreva:
  - SQL executado no Supabase.
  - Assinaturas de funções novas/alteradas.
  - Arquivos criados/alterados com caminho.
  - Casos de teste criados.
  - Pequena nota para `docs/IMPLEMENTACAO-AREA-ADMIN.md`.

Com isso, o Kiro atuará como um dev disciplinado de squad Scrum, avançando módulo a módulo com segurança, rastreabilidade e alta qualidade de código.