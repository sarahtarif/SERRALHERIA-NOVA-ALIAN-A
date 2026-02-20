<template>
  <section class="py-20 bg-white">
    <div class="container mx-auto px-4">
      <div class="text-center mb-12">
        <Badge variant="info" class="mb-4">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          Trabalhos Realizados
        </Badge>
        <h2 class="text-4xl md:text-5xl font-bold text-text-primary mb-4">
          Nossos Projetos
        </h2>
        <p class="text-xl text-text-secondary max-w-2xl mx-auto">
          Confira alguns dos trabalhos que realizamos com excelência
        </p>
      </div>

      <!-- Filtros -->
      <div class="flex flex-wrap justify-center gap-3 mb-12">
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

      <!-- Grid de Imagens -->
      <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <GalleryCard
          v-for="(item, index) in filteredItems"
          :key="index"
          :item="item"
        />
      </div>

      <!-- CTA -->
      <div class="text-center mt-12">
        <Button
          as="NuxtLink"
          to="/trabalhos"
          size="lg"
          variant="outline"
        >
          Ver Todos os Trabalhos
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </Button>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const selectedCategory = ref('todos')

const categories = [
  { label: 'Todos', value: 'todos' },
  { label: 'Portões', value: 'portoes' },
  { label: 'Automação', value: 'automacao' },
  { label: 'Travas', value: 'travas' },
  { label: 'Câmeras', value: 'cameras' },
  { label: 'Interfones', value: 'interfones' }
]

const galleryItems = [
  {
    title: 'Automação Portão Basculante',
    description: 'Motor PPA com fotocélula e controle remoto',
    category: 'automacao',
    location: 'Vila Mariana',
    video: null
  },
  {
    title: 'Portão Deslizante Industrial',
    description: 'Portão de 6 metros com automação completa',
    category: 'portoes',
    location: 'Santo Amaro',
    video: '/portao_6metros.mp4'
  },
  {
    title: 'Sistema de Travas Eletrônicas',
    description: 'Instalação de travas de segurança',
    category: 'travas',
    location: 'Moema',
    video: null
  },
  {
    title: 'Câmeras de Segurança',
    description: 'Sistema com 8 câmeras e acesso via app',
    category: 'cameras',
    location: 'Pinheiros',
    video: null
  },
  {
    title: 'Vídeo Porteiro Intelbras',
    description: 'Instalação completa com interfone',
    category: 'interfones',
    location: 'Itaim Bibi',
    video: '/interfones.mp4'
  },
  {
    title: 'Manutenção Preventiva',
    description: 'Revisão completa de motor e sensores',
    category: 'automacao',
    location: 'Jardins',
    video: '/manutencao_preventiva.mp4'
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
    interfones: 'success'
  }
  return variants[category] || 'default'
}
</script>
