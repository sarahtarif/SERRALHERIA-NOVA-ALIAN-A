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
          :key="`${selectedCategory}-${index}-${item.title}`"
          :item="item"
        />
      </div>

      <!-- CTA -->
      <div class="text-center mt-12">
        <NuxtLink to="/trabalhos">
          <Button
            size="lg"
            variant="outline"
          >
            Ver Todos os Trabalhos
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Button>
        </NuxtLink>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import type { GalleryCardItem } from '~/types'

const selectedCategory = ref('todos')

const categories = [
  { label: 'Todos', value: 'todos' },
  { label: 'Portões', value: 'portoes' },
  { label: 'Protetores de Rede', value: 'automacao' },
  { label: 'Travas', value: 'travas' },
  { label: 'Câmeras', value: 'cameras' },
  { label: 'Interfones', value: 'interfones' },
  { label: 'Manutenção', value: 'manutencao' }
]

const galleryItems: GalleryCardItem[] = [
  {
    title: 'Protetor de Rede para Motor de Portão (DPS Anti-Surto)',
    description: 'Proteção contra picos/surtos de energia que podem danificar a placa e o motor. Aumenta a vida útil do automatizador e reduz custos com manutenção.',
    category: 'automacao',
    location: 'Vila Mariana',
    video: null,
    image: '/protetor_rede.jpg',
    isNew: false
  },
  {
    title: 'Portão Deslizante Industrial',
    description: 'Portão de 6 metros com automação completa',
    category: 'portoes',
    location: 'Santo Amaro',
    video: '/portao_6metros.mp4',
    isNew: false
  },
  {
    title: 'Sistema de Travas Eletrônicas',
    description: 'Fechadura eletrônica com alta segurança, com abertura via Tag, botoeira com até 600 controles cadastrados e chave manual!',
    category: 'travas',
    location: 'Moema',
    video: '/Fechadura eletrônica com alta segurança, com abertura via Tag, botoeira com até 600 controles ca.mp4',
    isNew: false,
    partnerLink: 'https://www.instagram.com/sunsegdistribuidora/',
    partnerName: '@sunsegdistribuidora'
  },
  {
    title: 'Câmeras de Segurança',
    description: 'Novidade excelente! A câmera possui microfone e audio para ouvir o que está acontecendo no ambiente que ela for instalada.',
    category: 'cameras',
    location: 'Pinheiros',
    video: '/camera_seguranca.mp4',
    isNew: true
  },
  {
    title: 'Vídeo Porteiro Intelbras',
    description: 'Instalação completa com interfone',
    category: 'interfones',
    location: 'Itaim Bibi',
    video: '/interfones.mp4',
    isNew: false
  },
  {
    title: 'Manutenção Preventiva',
    description: 'Revisão completa de motor e sensores',
    category: 'manutencao',
    location: 'Jardins',
    video: '/manutancao_preventiva.mp4',
    isNew: false
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
</script>
