# Guia de Implementação - Área de Clientes

## Status da Implementação

### ✅ Concluído
- Épico documentado (EPIC-AREA-CLIENTES.md)
- Página principal (/clientes/index.vue)
- ClientesHero.vue
- ClientesPerfis.vue
- ClientesBeneficios.vue

### 🔄 Próximos Passos

#### 1. Componentes Restantes (Sprint 1)

**ClientesAvaliacoes.vue**
- Integrar com Google Reviews API ou usar mock
- Exibir nota média e últimas 3 avaliações
- Design com estrelas e depoimentos

**ClientesFormLead.vue**
- Formulário com 4 campos: Nome, WhatsApp, Bairro, Tipo de Serviço
- Checkbox LGPD obrigatório
- Validação em tempo real
- Integração com Supabase

**ClientesPosVenda.vue**
- Cards: "Solicitar 2ª Via", "Agendar Manutenção", "Nova Visita"
- Link para área logada
- CTAs para WhatsApp

**ClientesFAQ.vue**
- Accordion com 6-8 perguntas
- FAQ específica por perfil
- Animações suaves

**ClientesAreasAtendidas.vue**
- Grid de bairros atendidos
- Mapa de São Paulo (opcional)

**ClientesCTAsMobile.vue**
- Botões fixos WhatsApp + Telefone
- Aparecem após 200px scroll
- Animações suaves

#### 2. Área Logada (Sprint 2)

**Páginas:**
- /clientes/login.vue
- /clientes/dashboard.vue
- /clientes/solicitacoes/[id].vue

**Componentes:**
- ClientesDashboard.vue
- ClientesSolicitacaoCard.vue
- ClientesSolicitacaoDetalhes.vue

#### 3. APIs e Composables

**Composables:**
- useLeadForm.ts
- usePasswordlessAuth.ts
- useSolicitacoes.ts

**APIs:**
- /api/leads/create.post.ts
- /api/auth/send-code.post.ts
- /api/auth/verify-code.post.ts
- /api/solicitacoes/list.get.ts
- /api/solicitacoes/[id].get.ts

## Comandos Úteis

```bash
# Criar componente
touch app/components/clientes/NomeComponente.vue

# Criar página
touch app/pages/clientes/nome-pagina.vue

# Criar composable
touch app/composables/useNome.ts

# Criar API
touch server/api/rota/arquivo.post.ts
```

## Checklist de Qualidade

- [ ] Responsividade testada (mobile, tablet, desktop)
- [ ] Performance > 90 (Lighthouse)
- [ ] Acessibilidade WCAG AA
- [ ] Tracking GA4 implementado
- [ ] SEO otimizado
- [ ] LGPD compliance
- [ ] Rate limiting em APIs
- [ ] Testes unitários
- [ ] Documentação atualizada

