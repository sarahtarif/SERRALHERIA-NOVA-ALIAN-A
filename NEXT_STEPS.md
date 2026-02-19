# Próximos Passos - Serralheria Nova Aliança

## Fase 1: Backend e Autenticação (Prioridade Alta)

### 1.1 Configurar Supabase
- [ ] Criar projeto no Supabase
- [ ] Configurar variáveis de ambiente (.env)
- [ ] Testar conexão

### 1.2 Criar Schema do Banco
```sql
-- Criar tabelas conforme app/types/index.ts
- [ ] profiles (id, role, name, whatsapp, email)
- [ ] clients (profile_id, document, address, neighborhood, city)
- [ ] leads (name, whatsapp, service_type, neighborhood, message, source)
- [ ] requests (client_profile_id, service_type, description, status, scheduled_at, images)
- [ ] jobs (request_id, summary, start_at, end_at, warranty_until)
- [ ] job_items (job_id, item_type, brand, model, notes)
- [ ] gallery_items (category, title, description, before_after, images)
```

### 1.3 Configurar RLS (Row Level Security)
- [ ] Políticas para profiles
- [ ] Políticas para clients (cliente vê apenas seus dados)
- [ ] Políticas para requests (cliente vê apenas suas solicitações)
- [ ] Políticas para jobs (cliente vê apenas seus serviços)
- [ ] Políticas admin (admin vê tudo)

### 1.4 Implementar Autenticação
- [ ] Atualizar `useAuth.ts` com funções reais do Supabase
- [ ] Implementar signUp
- [ ] Implementar signIn
- [ ] Implementar signOut
- [ ] Implementar recuperação de senha
- [ ] Middleware de proteção de rotas

### 1.5 Storage para Imagens
- [ ] Configurar bucket no Supabase Storage
- [ ] Implementar upload de imagens
- [ ] Implementar listagem de imagens
- [ ] Implementar exclusão de imagens

## Fase 2: Área Admin (Prioridade Alta)

### 2.1 Dashboard Admin
- [ ] Criar `app/pages/admin/index.vue`
- [ ] Cards com estatísticas (total clientes, solicitações pendentes, etc.)
- [ ] Gráficos de desempenho
- [ ] Lista de solicitações recentes

### 2.2 CRUD de Clientes
- [ ] Criar `app/pages/admin/clientes.vue`
- [ ] Listar clientes com filtros e busca
- [ ] Ver detalhes do cliente
- [ ] Editar cliente
- [ ] Desativar cliente

### 2.3 CRUD de Solicitações
- [ ] Criar `app/pages/admin/solicitacoes.vue`
- [ ] Listar solicitações com filtros por status
- [ ] Ver detalhes da solicitação
- [ ] Atualizar status
- [ ] Agendar visita técnica
- [ ] Adicionar notas internas

### 2.4 CRUD de Portfólio
- [ ] Criar `app/pages/admin/portfolio.vue`
- [ ] Upload de imagens
- [ ] Categorização
- [ ] Antes/Depois
- [ ] Editar/Excluir itens

### 2.5 Exportação de Dados
- [ ] Exportar leads para CSV
- [ ] Exportar solicitações para CSV
- [ ] Gerar relatórios em PDF

## Fase 3: Funcionalidades Avançadas (Prioridade Média)

### 3.1 Sistema de Notificações
- [ ] Email de confirmação de cadastro
- [ ] Email de nova solicitação
- [ ] Email de mudança de status
- [ ] Notificações WhatsApp (via API)

### 3.2 Geração de Documentos
- [ ] Gerar PDF de orçamento
- [ ] Gerar PDF de garantia
- [ ] Gerar PDF de relatório de serviço

### 3.3 Galeria Avançada
- [ ] Filtros por categoria
- [ ] Lightbox para visualização
- [ ] Lazy loading de imagens
- [ ] Otimização automática de imagens

### 3.4 Blog/FAQ Dinâmico
- [ ] Criar tabela de posts
- [ ] CRUD de posts no admin
- [ ] Página de listagem de posts
- [ ] Página individual de post
- [ ] Sistema de categorias/tags

## Fase 4: SEO e Performance (Prioridade Média)

### 4.1 SEO
- [ ] Implementar Schema.org LocalBusiness
- [ ] Gerar sitemap.xml dinâmico
- [ ] Otimizar robots.txt
- [ ] Adicionar meta tags Open Graph
- [ ] Adicionar meta tags Twitter Card
- [ ] Implementar breadcrumbs estruturados

### 4.2 Performance
- [ ] Converter imagens para WebP/AVIF
- [ ] Implementar lazy loading
- [ ] Otimizar Core Web Vitals
- [ ] Implementar cache de API
- [ ] Minificar assets

### 4.3 Analytics
- [ ] Integrar Google Analytics
- [ ] Integrar Google Tag Manager
- [ ] Configurar eventos de conversão
- [ ] Configurar metas no Google Analytics

## Fase 5: Testes e Deploy (Prioridade Alta)

### 5.1 Testes
- [ ] Testes unitários dos composables
- [ ] Testes de componentes
- [ ] Testes E2E das principais jornadas
- [ ] Testes de acessibilidade

### 5.2 Deploy
- [ ] Configurar Vercel/Netlify
- [ ] Configurar variáveis de ambiente em produção
- [ ] Configurar domínio customizado
- [ ] Configurar SSL
- [ ] Testar em produção

### 5.3 Monitoramento
- [ ] Configurar Sentry para erros
- [ ] Configurar logs
- [ ] Configurar alertas
- [ ] Configurar backup do banco

## Comandos Úteis

```bash
# Desenvolvimento
npm run dev

# Build
npm run build

# Preview da build
npm run preview

# Gerar tipos do Supabase
npx supabase gen types typescript --project-id [PROJECT_ID] > app/types/supabase.ts

# Rodar migrations
npx supabase db push

# Reset do banco (desenvolvimento)
npx supabase db reset
```

## Recursos Necessários

- Conta Supabase (gratuita para começar)
- Domínio (opcional, pode usar subdomínio Vercel)
- Conta Vercel/Netlify (gratuita)
- Número WhatsApp Business (recomendado)
- Imagens reais do portfólio
- Conteúdo textual (sobre, serviços, etc.)

## Estimativa de Tempo

- Fase 1: 2-3 dias
- Fase 2: 3-4 dias
- Fase 3: 2-3 dias
- Fase 4: 1-2 dias
- Fase 5: 1-2 dias

**Total estimado**: 9-14 dias de desenvolvimento
