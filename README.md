# Serralheria Nova Aliança - Website

Site profissional completo para serralheria com foco em conversão via WhatsApp.

## 🚀 Tecnologias

- **Nuxt 4** - Framework Vue.js
- **Vue 3** - Framework JavaScript
- **TypeScript** - Tipagem estática
- **Tailwind CSS** - Framework CSS
- **Supabase** - Backend (Auth + Database + RLS)
- **@vueuse/core** - Utilitários Vue
- **@supabase/supabase-js** - Cliente Supabase

## 📋 Funcionalidades

### Site Público
- ✅ Home com hero, diferenciais, serviços e galeria
- ✅ Página de Serviços detalhada
- ✅ Portfólio de Trabalhos Realizados com filtros
- ✅ Página Sobre com história e valores
- ✅ Página de Contato com formulário
- ✅ Botão flutuante do WhatsApp em todas as páginas
- ✅ Formulários com integração WhatsApp
- ✅ Design responsivo mobile-first
- ✅ Sistema de cores profissional

### Área do Cliente
- ✅ Login e Cadastro
- ✅ Dashboard do cliente
- ✅ Solicitar orçamento/visita técnica
- ✅ Acompanhar solicitações
- ✅ Histórico de serviços
- 🔄 Documentos (garantias, relatórios) - Backend pendente
- 🔄 Integração completa com Supabase

### Área Admin
- ✅ Autenticação e autorização admin
- ✅ Dashboard com KPIs e estatísticas
- ✅ CRUD completo de Leads
  - Listagem com filtros e paginação
  - Criação, edição e exclusão
  - Conversão de lead para cliente
- ✅ CRUD completo de Orçamentos
  - Criação com cálculo automático de impostos
  - Geração de PDF
  - Envio por email
  - Vinculação com leads e clientes
- ✅ Listagem de Clientes
- ✅ Middleware de segurança
- ✅ Audit logs de acesso
- ✅ Rate limiting
- 🔄 CRUD de serviços
- 🔄 CRUD de portfólio
- 🔄 Agenda de serviços

## 🎨 Sistema de Cores

- **Primária**: Azul escuro (#0056e0) - Confiança e profissionalismo
- **Secundária**: Cinza técnico (#6c757d) - Modernidade
- **Destaque**: Amarelo industrial (#f59e0b) - CTAs e atenção
- **Semânticas**: Success, Danger, Warning, Info

## 📦 Instalação

```bash
# Instalar dependências
npm install

# Configurar variáveis de ambiente
cp .env.example .env
# Edite o arquivo .env com suas configurações

# Rodar em desenvolvimento
npm run dev

# Build para produção
npm run build

# Preview da build
npm run preview
```

## ⚙️ Configuração

### 1. Supabase

1. Crie uma conta em [supabase.com](https://supabase.com)
2. Crie um novo projeto
3. Copie a URL e a chave anônima
4. Cole no arquivo `.env`:
   ```
   NUXT_PUBLIC_SUPABASE_URL=sua_url_aqui
   NUXT_PUBLIC_SUPABASE_ANON_KEY=sua_chave_aqui
   ```

### 2. WhatsApp

Configure o número do WhatsApp no `.env`:
```
NUXT_PUBLIC_WHATSAPP_NUMBER=5511999999999
```

### 3. Informações da Empresa

Atualize as informações da empresa no `.env`:
```
NUXT_PUBLIC_COMPANY_NAME="Serralheria Nova Aliança"
NUXT_PUBLIC_COMPANY_ADDRESS="São Paulo - SP"
NUXT_PUBLIC_COMPANY_EMAIL=contato@novaalianca.com.br
NUXT_PUBLIC_COMPANY_PHONE=(11) 99999-9999
```

## 📁 Estrutura do Projeto

```
.
├── app/
│   ├── components/       # Componentes Vue
│   │   ├── ui/          # Componentes UI base
│   │   ├── admin/       # Componentes admin
│   │   │   ├── AdminLayout.vue
│   │   │   ├── dashboard/
│   │   │   ├── leads/
│   │   │   ├── orcamentos/
│   │   │   └── shared/
│   │   ├── clientes/    # Componentes área clientes
│   │   ├── Navbar.vue
│   │   ├── Footer.vue
│   │   ├── Hero.vue
│   │   ├── ServicesGrid.vue
│   │   ├── Gallery.vue
│   │   ├── Differentials.vue
│   │   ├── LeadForm.vue
│   │   └── WhatsAppFloatingButton.vue
│   ├── composables/     # Composables Vue
│   │   ├── admin/       # Composables admin
│   │   │   ├── useDashboard.ts
│   │   │   ├── useLeads.ts
│   │   │   └── useOrcamentos.ts
│   │   ├── useAuth.ts
│   │   ├── useSupabase.ts
│   │   └── useWhatsApp.ts
│   ├── middleware/      # Middleware de rotas
│   │   ├── auth.ts
│   │   └── admin.ts
│   ├── pages/           # Páginas (rotas)
│   │   ├── index.vue
│   │   ├── servicos/
│   │   ├── trabalhos.vue
│   │   ├── sobre.vue
│   │   ├── contato.vue
│   │   ├── cliente/     # Área do cliente
│   │   └── admin/       # Área admin
│   │       ├── index.vue (dashboard)
│   │       ├── login.vue
│   │       ├── leads/
│   │       │   ├── index.vue
│   │       │   ├── novo.vue
│   │       │   └── [id].vue
│   │       └── orcamentos/
│   │           ├── index.vue
│   │           ├── novo.vue
│   │           └── [id].vue
│   ├── types/           # Tipos TypeScript
│   └── app.vue          # App principal
├── server/              # Server-side
│   ├── api/            # API routes
│   │   ├── admin/
│   │   │   ├── dashboard/
│   │   │   ├── leads/
│   │   │   ├── orcamentos/
│   │   │   └── clients/
│   │   └── security/
│   ├── middleware/     # Server middleware
│   ├── services/       # Business logic
│   └── utils/          # Utilitários server
├── docs/               # Documentação
├── tests/              # Testes
├── public/             # Arquivos estáticos
├── tailwind.config.js  # Configuração Tailwind
├── nuxt.config.ts      # Configuração Nuxt
└── package.json
```

## 🎯 Conversão via WhatsApp

O site foi otimizado para conversão via WhatsApp:

- Botão flutuante em todas as páginas
- CTAs estratégicos em cada seção
- Mensagens pré-preenchidas com contexto
- Formulários que enviam para WhatsApp
- Integração em cards de serviços

## 📱 Responsividade

- Mobile-first design
- Breakpoints: sm (640px), md (768px), lg (1024px), xl (1280px)
- Testado em dispositivos móveis, tablets e desktop

## 🔒 Segurança

- ✅ Validação de formulários (client e server)
- ✅ RLS (Row Level Security) no Supabase
- ✅ Proteção de rotas com middleware (auth + admin)
- ✅ Sanitização de inputs
- ✅ Service Role Key para operações admin
- ✅ Audit logs de acesso
- ✅ Rate limiting (5 req/min)
- ✅ Meta tags noindex/nofollow em páginas admin

## 🚀 Deploy

### Vercel (Recomendado)

1. Conecte seu repositório no Vercel
2. Configure as variáveis de ambiente
3. Deploy automático

### Netlify

1. Conecte seu repositório no Netlify
2. Configure as variáveis de ambiente
3. Build command: `npm run build`
4. Publish directory: `.output/public`

## 📝 SEO

- Meta tags por página
- Schema.org LocalBusiness (a implementar)
- Sitemap.xml (a implementar)
- Robots.txt (a implementar)
- Otimização de imagens

## 🤝 Contribuindo

Este é um projeto privado para a Serralheria Nova Aliança.

## 📄 Licença

Todos os direitos reservados © 2026 Serralheria Nova Aliança

## 📞 Suporte

Para dúvidas ou suporte:
- WhatsApp: (11) 99999-9999
- Email: contato@novaalianca.com.br
