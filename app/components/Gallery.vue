<template>
  <section id="gallery-section" class="py-20 bg-surface-container-low">
    <div class="container mx-auto px-4">

      <!-- Cabeçalho -->
      <div class="text-center mb-12">
        <span class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium bg-secondary-container text-secondary mb-4">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
            <path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 16m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
          </svg>
          Trabalhos Realizados
        </span>
        <h2 class="text-4xl md:text-5xl font-bold font-headline text-on-surface mb-4">Nossos Projetos</h2>
        <p class="text-lg text-on-surface-variant max-w-2xl mx-auto">
          Confira alguns dos trabalhos que realizamos com excelência
        </p>
      </div>

      <!-- Filtros -->
      <div class="flex flex-wrap justify-center gap-3 mb-12">
        <button
          v-for="cat in categories"
          :key="cat.value"
          class="px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200"
          :class="selectedCategory === cat.value
            ? 'bg-primary text-on-primary shadow-lg shadow-primary/20'
            : 'border border-outline-variant text-on-surface-variant hover:border-primary hover:text-primary'"
          @click="selectedCategory = cat.value"
        >
          {{ cat.label }}
        </button>
      </div>

      <!-- Grid - Loading -->
      <div v-if="loading" class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="i in 6"
          :key="i"
          class="bg-surface-container rounded-lg h-64 animate-pulse"
        />
      </div>

      <!-- Grid - Com dados -->
      <div v-else-if="filteredDbItems.length > 0" class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="item in filteredDbItems"
          :key="item.id"
          class="bg-surface-container border border-outline-variant rounded-lg overflow-hidden group hover:border-primary/40 transition-colors duration-200"
        >
          <!-- Mídia — altura fixa, imagem preenche sem vácuo -->
          <div class="relative bg-surface-container-high overflow-hidden group/media" style="height: 220px;">
            <video
              v-if="isVideo(item.media_type)"
              :src="item.data_url"
              class="w-full h-full object-cover"
              controls
              playsinline
              preload="metadata"
            />
            <img
              v-else
              :src="item.data_url"
              :alt="item.title"
              class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              loading="lazy"
            />
            <!-- Botão tela cheia -->
            <button
              class="absolute bottom-2 right-2 w-8 h-8 rounded-lg flex items-center justify-center opacity-0 group-hover/media:opacity-100 transition-opacity"
              style="background:rgba(0,0,0,0.6); color:#fff;"
              @click.stop="openLightbox(item)"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"/>
              </svg>
            </button>
          </div>

          <!-- Info -->
          <div class="p-4">
            <div class="flex items-center justify-between mb-2">
              <span
                class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium"
                :class="getCategoryVariantClasses(item.category)"
              >
                {{ getCategoryLabel(item.category) }}
              </span>
              <span class="text-xs text-on-surface-variant">{{ item.location }}</span>
            </div>
            <h3 class="font-semibold text-on-surface text-sm">{{ item.title }}</h3>
          </div>
        </div>
      </div>

      <!-- Estado vazio -->
      <div v-else class="text-center py-16 text-on-surface-variant">
        <p class="text-lg">Nenhum trabalho publicado ainda</p>
      </div>

      <!-- CTA -->
      <div class="text-center mt-12">
        <NuxtLink
          to="/trabalhos"
          class="inline-flex items-center gap-2 px-6 py-3 rounded-lg border-2 border-primary text-primary font-medium hover:bg-primary hover:text-on-primary transition-all duration-200"
        >
          Ver Todos os Trabalhos
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
            <path d="M17 8l4 4m0 0l-4 4m4-4H3"/>
          </svg>
        </NuxtLink>
      </div>

    </div>
  </section>

  <MediaLightbox
    v-if="lightbox"
    :src="lightbox.src"
    :media-type="lightbox.mediaType"
    :title="lightbox.title"
    :description="lightbox.description"
    @close="lightbox = null"
  />
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import type { GalleryItem } from '~/../../shared/types/index'
import MediaLightbox from './MediaLightbox.vue'

const lightbox = ref<{ src: string; mediaType?: string; title?: string; description?: string } | null>(null)

function openLightbox(item: GalleryItem) {
  lightbox.value = { src: item.data_url ?? '', mediaType: item.media_type, title: item.title, description: item.description ?? undefined }
}

const categories = [
  { label: 'Todos', value: 'todos' },
  { label: 'Portões', value: 'portoes' },
  { label: 'Protetores de Rede', value: 'automacao' },
  { label: 'Travas', value: 'travas' },
  { label: 'Câmeras', value: 'cameras' },
  { label: 'Interfones', value: 'interfones' },
  { label: 'Manutenção', value: 'manutencao' }
]

const selectedCategory = ref('todos')
const loading = ref(false)
const dbItems = ref<GalleryItem[]>([])

function isVideo(mediaType?: string): boolean {
  return (mediaType ?? '').startsWith('video/')
}

function getCategoryVariantClasses(category: string): string {
  const map: Record<string, string> = {
    automacao: 'bg-primary/10 text-primary',
    portoes: 'bg-secondary-container text-secondary',
    travas: 'bg-on-primary-container/20 text-on-primary-container',
    cameras: 'bg-error-container/30 text-error',
    interfones: 'bg-surface-container-highest text-on-surface-variant',
    manutencao: 'bg-primary/10 text-primary'
  }
  return map[category] ?? 'bg-surface-container-highest text-on-surface-variant'
}

function getCategoryLabel(category: string): string {
  const map: Record<string, string> = {
    automacao: 'Protetores de Rede',
    portoes: 'Portões',
    travas: 'Travas',
    cameras: 'Câmeras',
    interfones: 'Interfones',
    manutencao: 'Manutenção'
  }
  return map[category] ?? category
}

const filteredDbItems = computed(() => {
  if (selectedCategory.value === 'todos') return dbItems.value
  return dbItems.value.filter(i => i.category === selectedCategory.value)
})

async function fetchHomeItems() {
  loading.value = true
  try {
    const res = await $fetch<{ data: GalleryItem[] }>('/api/portfolio/home')
    dbItems.value = res.data ?? []
  } catch {
    dbItems.value = []
  } finally {
    loading.value = false
  }
}

onMounted(() => fetchHomeItems())
</script>
