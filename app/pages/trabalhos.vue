<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import NavTop from '~/components/NavTop.vue'
import NavDesktop from '~/components/NavDesktop.vue'
import NavBottom from '~/components/NavBottom.vue'
import PageFooter from '~/components/PageFooter.vue'
import FooterDesktop from '~/components/FooterDesktop.vue'
import WhatsAppFab from '~/components/WhatsAppFab.vue'
import MediaLightbox from '~/components/MediaLightbox.vue'
import type { GalleryItem } from '~/../../shared/types/index'

const loading = ref(true)
const allItems = ref<GalleryItem[]>([])
const selectedCategory = ref('todos')
const lightbox = ref<{ src: string; mediaType?: string; title?: string; description?: string } | null>(null)

const categories = [
  { label: 'Todos', value: 'todos' },
  { label: 'Portões', value: 'portoes' },
  { label: 'Protetores de Rede', value: 'automacao' },
  { label: 'Travas', value: 'travas' },
  { label: 'Câmeras', value: 'cameras' },
  { label: 'Interfones', value: 'interfones' },
  { label: 'Manutenção', value: 'manutencao' },
]

const filtered = computed(() => {
  if (selectedCategory.value === 'todos') return allItems.value
  return allItems.value.filter(i => i.category === selectedCategory.value)
})

const countByCategory = computed(() => {
  const counts: Record<string, number> = {}
  for (const item of allItems.value) {
    counts[item.category] = (counts[item.category] ?? 0) + 1
  }
  return counts
})

function isVideo(mediaType?: string): boolean {
  return (mediaType ?? '').startsWith('video/')
}

function getCategoryLabel(category: string): string {
  const map: Record<string, string> = {
    automacao: 'Protetores de Rede',
    portoes: 'Portões',
    travas: 'Travas',
    cameras: 'Câmeras',
    interfones: 'Interfones',
    manutencao: 'Manutenção',
  }
  return map[category] ?? category
}

function getCategoryClasses(category: string): string {
  const map: Record<string, string> = {
    automacao: 'bg-primary/10 text-primary',
    portoes: 'bg-secondary-container text-secondary',
    travas: 'bg-on-primary-container/20 text-on-primary-container',
    cameras: 'bg-error-container/30 text-error',
    interfones: 'bg-surface-container-highest text-on-surface-variant',
    manutencao: 'bg-primary/10 text-primary',
  }
  return map[category] ?? 'bg-surface-container-highest text-on-surface-variant'
}

function openLightbox(item: GalleryItem) {
  lightbox.value = {
    src: item.data_url ?? '',
    mediaType: item.media_type,
    title: item.title,
    description: item.description ?? undefined,
  }
}

async function fetchAll() {
  loading.value = true
  try {
    const res = await $fetch<{ data: GalleryItem[] }>('/api/portfolio/list')
    allItems.value = res.data ?? []
  } catch {
    allItems.value = []
  } finally {
    loading.value = false
  }
}

onMounted(() => fetchAll())
</script>

<template>
  <div class="bg-surface text-on-surface font-body antialiased min-h-screen">
    <div class="lg:hidden"><NavTop /></div>
    <div class="hidden lg:block"><NavDesktop /></div>

    <main class="pt-20 pb-24 lg:pb-16">

      <!-- Hero -->
      <section class="py-12 px-4 bg-surface-container-low">
        <div class="max-w-4xl mx-auto text-center">
          <span class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium bg-secondary-container text-secondary mb-4">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
              <path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 16m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
            </svg>
            Portfólio Completo
          </span>
          <h1 class="text-3xl md:text-5xl font-bold font-headline text-on-surface mb-4">
            Todos os Nossos Trabalhos
          </h1>
          <p class="text-on-surface-variant max-w-xl mx-auto">
            Confira todos os projetos realizados pela Nova Aliança em automação, segurança e serralheria.
          </p>
          <!-- Contador total -->
          <div v-if="!loading" class="mt-6 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-surface-container border border-outline-variant text-sm text-on-surface-variant">
            <svg class="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/>
            </svg>
            <span><strong class="text-on-surface">{{ allItems.length }}</strong> trabalho{{ allItems.length !== 1 ? 's' : '' }} publicado{{ allItems.length !== 1 ? 's' : '' }}</span>
          </div>
        </div>
      </section>

      <div class="max-w-7xl mx-auto px-4 mt-8">

        <!-- Filtros com contagem -->
        <div class="flex flex-wrap justify-center gap-2 mb-8">
          <button
            v-for="cat in categories"
            :key="cat.value"
            class="px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 flex items-center gap-1.5"
            :class="selectedCategory === cat.value
              ? 'bg-primary text-on-primary shadow-lg shadow-primary/20'
              : 'border border-outline-variant text-on-surface-variant hover:border-primary hover:text-primary'"
            @click="selectedCategory = cat.value"
          >
            {{ cat.label }}
            <span
              v-if="cat.value !== 'todos' && countByCategory[cat.value]"
              class="text-[10px] px-1.5 py-0.5 rounded-full"
              :class="selectedCategory === cat.value ? 'bg-white/20' : 'bg-outline-variant/30'"
            >{{ countByCategory[cat.value] }}</span>
          </button>
        </div>

        <!-- Loading skeleton -->
        <div v-if="loading" class="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          <div v-for="i in 8" :key="i" class="bg-surface-container rounded-xl h-64 animate-pulse" />
        </div>

        <!-- Grid de itens -->
        <div v-else-if="filtered.length > 0" class="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          <div
            v-for="item in filtered"
            :key="item.id"
            class="bg-surface-container border border-outline-variant rounded-xl overflow-hidden group hover:border-primary/40 transition-all duration-200 hover:shadow-lg hover:shadow-primary/5 cursor-pointer"
            @click="openLightbox(item)"
          >
            <!-- Mídia -->
            <div class="relative overflow-hidden" style="height:200px;">
              <video
                v-if="isVideo(item.media_type)"
                :src="item.data_url"
                class="w-full h-full object-cover"
                playsinline
                preload="metadata"
                muted
              />
              <img
                v-else
                :src="item.data_url"
                :alt="item.title"
                class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                loading="lazy"
              />
              <!-- Overlay ao hover -->
              <div class="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-200 flex items-center justify-center">
                <div class="w-10 h-10 rounded-full bg-white/90 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 scale-75 group-hover:scale-100">
                  <svg class="w-5 h-5 text-surface" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"/>
                  </svg>
                </div>
              </div>
            </div>

            <!-- Info -->
            <div class="p-3">
              <div class="flex items-center justify-between mb-1.5">
                <span class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium" :class="getCategoryClasses(item.category)">
                  {{ getCategoryLabel(item.category) }}
                </span>
                <span class="text-xs text-on-surface-variant truncate ml-2">{{ item.location }}</span>
              </div>
              <h3 class="font-semibold text-on-surface text-sm leading-snug line-clamp-2">{{ item.title }}</h3>
            </div>
          </div>
        </div>

        <!-- Vazio -->
        <div v-else class="text-center py-20">
          <div class="w-16 h-16 rounded-2xl bg-surface-container flex items-center justify-center mx-auto mb-4">
            <svg class="w-8 h-8 text-on-surface-variant" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5">
              <path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 16m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
            </svg>
          </div>
          <p class="text-on-surface-variant text-lg mb-2">
            {{ selectedCategory === 'todos' ? 'Nenhum trabalho publicado ainda' : 'Nenhum trabalho nesta categoria' }}
          </p>
          <button v-if="selectedCategory !== 'todos'" class="text-primary text-sm hover:underline" @click="selectedCategory = 'todos'">
            Ver todos
          </button>
        </div>

      </div>
    </main>

    <div class="lg:hidden"><PageFooter /></div>
    <div class="hidden lg:block"><FooterDesktop /></div>
    <div class="lg:hidden"><NavBottom /></div>
    <WhatsAppFab />

    <MediaLightbox
      v-if="lightbox"
      :src="lightbox.src"
      :media-type="lightbox.mediaType"
      :title="lightbox.title"
      :description="lightbox.description"
      @close="lightbox = null"
    />
  </div>
</template>
