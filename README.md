# Serralheria Nova Aliança - Website

Site profissional completo para serralheria com foco em conversão via WhatsApp.

## 🚀 Tecnologias

- **Nuxt 4** - Framework Vue.js
- **Vue 3** - Framework JavaScript
- **TypeScript** - Tipagem estática
- **Tailwind CSS** - Framework CSS
- **Supabase** - Backend (Auth + Database)
- **@vueuse/core** - Utilitários Vue

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
- ✅ Página de login admin
- 🔄 Dashboard administrativo
- 🔄 CRUD de clientes
- 🔄 CRUD de solicitações
- 🔄 CRUD de serviços
- 🔄 CRUD de portfólio
- 🔄 Exportação de leads

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
│   │   ├── Navbar.vue
│   │   ├── Footer.vue
│   │   ├── Hero.vue
│   │   ├── ServicesGrid.vue
│   │   ├── Gallery.vue
│   │   ├── Differentials.vue
│   │   ├── LeadForm.vue
│   │   └── WhatsAppFloatingButton.vue
│   ├── composables/     # Composables Vue
│   │   ├── useAuth.ts
│   │   ├── useSupabase.ts
│   │   └── useWhatsApp.ts
│   ├── pages/           # Páginas (rotas)
│   │   ├── index.vue
│   │   ├── servicos/
│   │   │   ├── index.vue
│   │   │   └── [slug].vue
│   │   ├── trabalhos.vue
│   │   ├── sobre.vue
│   │   ├── contato.vue
│   │   ├── cliente/
│   │   │   ├── login.vue
│   │   │   ├── cadastro.vue
│   │   │   ├── index.vue (dashboard)
│   │   │   ├── solicitacoes.vue
│   │   │   ├── solicitacoes/nova.vue
│   │   │   └── historico.vue
│   │   └── admin/
│   │       └── login.vue
│   ├── types/           # Tipos TypeScript
│   └── app.vue          # App principal
├── components/          # Componentes globais
│   └── ui/             # Componentes UI (auto-import)
├── lib/
│   └── utils.ts         # Utilitários
├── public/              # Arquivos estáticos
├── tailwind.config.js   # Configuração Tailwind
├── nuxt.config.ts       # Configuração Nuxt
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

- Validação de formulários (client e server)
- RLS (Row Level Security) no Supabase
- Proteção de rotas com middleware
- Sanitização de inputs

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
