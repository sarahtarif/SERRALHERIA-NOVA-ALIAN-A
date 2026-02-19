<template>
  <div>
    <Navbar />
    
    <!-- Hero -->
    <section class="bg-gradient-primary text-white py-16">
      <div class="container mx-auto px-4">
        <div class="max-w-3xl">
          <Badge variant="default" class="mb-4 bg-accent-500 text-white">
            Portfólio
          </Badge>
          <h1 class="text-4xl md:text-5xl font-bold mb-4">
            Trabalhos Realizados
          </h1>
          <p class="text-xl text-primary-100">
            Confira alguns dos projetos que realizamos com excelência e dedicação
          </p>
        </div>
      </div>
    </section>

    <!-- Filtros -->
    <section class="py-8 bg-white border-b border-border-light sticky top-20 z-40">
      <div class="container mx-auto px-4">
        <div class="flex flex-wrap gap-3">
          <Button
            v-for="category in categories"
            :key="category.value"
            @click="selectedCategory = category.value"
            :variant="selectedCategory === category.value ? 'default' : 'outline'"
            size="sm"
          >
            {{ category.label }}
          </Button>
        </div>
      </div>
    </section>

    <!-- Grid de Trabalhos -->
    <section class="py-20 bg-surface">
      <div class="container mx-auto px-4">
        <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <Card
            v-for="(item, index) in filteredItems"
            :key="index"
            class="group overflow-hidden"
          >
            <div class="relative aspect-video bg-secondary-100 overflow-hidden">
              <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div class="absolute bottom-0 left-0 right-0 p-6 text-white transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                  <h3 class="text-xl font-bold mb-2">{{ item.title }}</h3>
                  <p class="text-sm text-gray-200 mb-3">{{ item.description }}</p>
                  <div class="flex items-center gap-2 text-sm">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span>{{ item.location }}</span>
                  </div>
                </div>
              </div>
              <Skeleton class="w-full h-full" />
            </div>
            <CardContent class="p-6">
              <div class="flex items-center justify-between mb-3">
                <Badge :variant="getCategoryVariant(item.category)">
                  {{ getCategoryLabel(item.category) }}
                </Badge>
                <span class="text-sm text-text-tertiary">{{ item.date }}</span>
              </div>
              <h3 class="font-bold text-lg text-text-primary mb-2">{{ item.title }}</h3>
              <p class="text-text-secondary text-sm mb-4">{{ item.shortDescription }}</p>
              
              <div class="flex flex-wrap gap-2 mb-4">
                <Badge v-for="tag in item.tags" :key="tag" variant="default" class="text-xs">
                  {{ tag }}
                </Badge>
              </div>
              
              <Button
                @click="handleWhatsApp(item.title)"
                variant="outline"
                size="sm"
                class="w-full"
              >
                Solicitar Orçamento Similar
              </Button>
            </CardContent>
          </Card>
        </div>

        <!-- Mensagem quando não há resultados -->
        <div v-if="filteredItems.length === 0" class="text-center py-20">
          <div class="w-20 h-20 bg-secondary-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg class="w-10 h-10 text-secondary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <h3 class="text-xl font-bold text-text-primary mb-2">Nenhum trabalho encontrado</h3>
          <p class="text-text-secondary">Tente selecionar outra categoria</p>
        </div>
      </div>
    </section>

    <!-- CTA -->
    <section class="py-20 bg-white">
      <div class="container mx-auto px-4 text-center">
        <h2 class="text-4xl font-bold text-text-primary mb-4">
          Quer um Projeto Como Estes?
        </h2>
        <p class="text-xl text-text-secondary mb-8 max-w-2xl mx-auto">
          Entre em contato e transforme seu projeto em realidade
        </p>
        <Button
          @click="handleWhatsApp('Projeto Personalizado')"
          class="bg-accent-500 hover:bg-accent-600 text-white shadow-accent"
          size="lg"
        >
          Solicitar Orçamento
        </Button>
      </div>
    </section>

    <Footer />
  </div>
</template>

<script setup lang="ts">
const { sendMessage, createServiceMessage } = useWhatsApp()
const selectedCategory = ref('todos')

useHead({
  title: 'Trabalhos Realizados',
  meta: [
    { 
      name: 'description', 
      content: 'Confira nosso portfólio de trabalhos realizados em automação de portões, travas eletrônicas, câmeras e mais em São Paulo.' 
    }
  ]
})

const categories = [
  { label: 'Todos', value: 'todos' },
  { label: 'Portões', value: 'portoes' },
  { label: 'Automação', value: 'automacao' },
  { label: 'Travas', value: 'travas' },
  { label: 'Câmeras', value: 'cameras' },
  { label: 'Interfones', value: 'interfones' },
  { label: 'Manutenção', value: 'manutencao' }
]

const galleryItems = [
  {
    title: 'Automação Portão Basculante Residencial',
    shortDescription: 'Motor PPA Penta Predial com fotocélula',
    description: 'Instalação completa de motor PPA com fotocélula anti-esmagamento e controle remoto',
    category: 'automacao',
    location: 'Vila Mariana - SP',
    date: 'Jan 2026',
    tags: ['Motor PPA', 'Fotocélula', 'Controle Remoto']
  },
  {
    title: 'Portão Deslizante Industrial 6m',
    shortDescription: 'Portão de ferro com automação robusta',
    description: 'Fabricação e instalação de portão deslizante industrial com motor de alta potência',
    category: 'portoes',
    location: 'Santo Amaro - SP',
    date: 'Dez 2025',
    tags: ['Industrial', 'Deslizante', 'Motor Garen']
  },
  {
    title: 'Sistema de Travas Eletrônicas',
    shortDescription: 'Trava eletromagnética de segurança',
    description: 'Instalação de trava eletrônica com acionamento automático integrado ao motor',
    category: 'travas',
    location: 'Moema - SP',
    date: 'Jan 2026',
    tags: ['Trava', 'Segurança', 'Automação']
  },
  {
    title: 'CFTV com 8 Câmeras Full HD',
    shortDescription: 'Sistema completo de monitoramento',
    description: 'Instalação de 8 câmeras Full HD com gravação em nuvem e acesso via app',
    category: 'cameras',
    location: 'Pinheiros - SP',
    date: 'Dez 2025',
    tags: ['CFTV', 'Full HD', 'App Mobile']
  },
  {
    title: 'Vídeo Porteiro Intelbras',
    shortDescription: 'Interfone com câmera e tela 7"',
    description: 'Instalação de vídeo porteiro Intelbras com abertura remota do portão',
    category: 'interfones',
    location: 'Itaim Bibi - SP',
    date: 'Nov 2025',
    tags: ['Intelbras', 'Vídeo', 'Abertura Remota']
  },
  {
    title: 'Manutenção Preventiva Completa',
    shortDescription: 'Revisão de motor e sensores',
    description: 'Manutenção preventiva com lubrificação, ajustes e troca de peças desgastadas',
    category: 'manutencao',
    location: 'Jardins - SP',
    date: 'Jan 2026',
    tags: ['Manutenção', 'Preventiva', 'Revisão']
  },
  {
    title: 'Portão Pivotante com Automação',
    shortDescription: 'Motor específico para pivotante',
    description: 'Instalação de motor para portão pivotante com sistema de segurança completo',
    category: 'automacao',
    location: 'Brooklin - SP',
    date: 'Dez 2025',
    tags: ['Pivotante', 'Motor', 'Segurança']
  },
  {
    title: 'Grade de Proteção Residencial',
    shortDescription: 'Grade em ferro com pintura especial',
    description: 'Fabricação e instalação de grade de proteção para janelas',
    category: 'portoes',
    location: 'Campo Belo - SP',
    date: 'Nov 2025',
    tags: ['Grade', 'Proteção', 'Ferro']
  },
  {
    title: 'Fotocélula e Protetor de Rede',
    shortDescription: 'Segurança e proteção elétrica',
    description: 'Instalação de fotocélula anti-esmagamento e protetor de rede contra picos',
    category: 'automacao',
    location: 'Saúde - SP',
    date: 'Jan 2026',
    tags: ['Fotocélula', 'Protetor', 'Segurança']
  }
]

const filteredItems = computed(() => {
  if (selectedCategory.value === 'todos') {
    return galleryItems
  }
  return galleryItems.filter(item => item.category === selectedCategory.value)
})

const getCategoryVariant = (category: string) => {
  const variants: Record<string, any> = {
    automacao: 'default',
    portoes: 'info',
    travas: 'warning',
    cameras: 'danger',
    interfones: 'success',
    manutencao: 'default'
  }
  return variants[category] || 'default'
}

const getCategoryLabel = (category: string) => {
  const labels: Record<string, string> = {
    automacao: 'Automação',
    portoes: 'Portões',
    travas: 'Travas',
    cameras: 'Câmeras',
    interfones: 'Interfones',
    manutencao: 'Manutenção'
  }
  return labels[category] || category
}

const handleWhatsApp = (projectName: string) => {
  const message = createServiceMessage({
    service: `Projeto similar a: ${projectName}`
  })
  sendMessage(message)
}
</script>
