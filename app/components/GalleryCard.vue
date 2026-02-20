<script setup lang="ts">
import type { GalleryCardItem } from '~/types'

const props = defineProps<{
  item: GalleryCardItem
}>()

const videoRef = ref<HTMLVideoElement | null>(null)
const imageRef = ref<HTMLImageElement | null>(null)
const isMuted = ref(true)
const isImageFullscreen = ref(false)

const { sendMessage } = useWhatsApp()

const toggleMute = () => {
  if (videoRef.value) {
    videoRef.value.muted = !videoRef.value.muted
    isMuted.value = videoRef.value.muted
  }
}

const toggleFullscreen = () => {
  if (videoRef.value) {
    if (document.fullscreenElement) {
      document.exitFullscreen()
    } else {
      videoRef.value.requestFullscreen().catch(err => {
        console.error('Erro ao entrar em tela cheia:', err)
      })
    }
  }
}

const toggleImageFullscreen = () => {
  isImageFullscreen.value = !isImageFullscreen.value
}

const getWhatsAppMessage = () => {
  // Mensagem específica para DPS
  if (props.item.title.includes('Protetor de Rede') || props.item.title.includes('DPS')) {
    return `Olá! Gostaria de solicitar um orçamento para Protetor de Rede / DPS Anti-Surto para motor de portão.

Por favor, informar:
- Bairro:
- Voltagem (127V ou 220V):`
  }
  
  // Mensagem genérica para outros serviços
  return `Olá! Gostaria de solicitar um orçamento para ${props.item.title}.

Bairro: ${props.item.location}

Aguardo retorno. Obrigado!`
}

const handleWhatsAppClick = () => {
  const message = getWhatsAppMessage()
  sendMessage(message)
}

const categoryVariant = computed(() => {
  const variants: Record<string, any> = {
    automacao: 'default',
    portoes: 'info',
    travas: 'warning',
    cameras: 'danger',
    interfones: 'success',
    manutencao: 'default'
  }
  return variants[props.item.category] || 'default'
})
</script>

<template>
  <CardContainer class="w-full">
    <CardBody class="w-full" style="height: auto;">
      <CardItem :translateZ="50" class="w-full">
        <Card class="group cursor-pointer overflow-hidden w-full">
          <CardItem :translateZ="100" class="w-full">
            <div class="relative aspect-video bg-secondary-100 overflow-hidden w-full">
              <!-- Imagem para itens com imagem -->
              <img
                v-if="item.image && !item.video"
                ref="imageRef"
                :src="item.image"
                :alt="item.title"
                class="w-full h-full object-cover md:object-contain cursor-pointer"
                @click="toggleImageFullscreen"
              />
              
              <!-- Vídeo para itens com vídeo -->
              <video
                v-else-if="item.video"
                ref="videoRef"
                class="w-full h-full object-cover md:object-contain bg-black"
                autoplay
                loop
                muted
                playsinline
              >
                <source :src="item.video" type="video/mp4">
              </video>
              
              <!-- Skeleton para outros itens -->
              <Skeleton v-else class="w-full h-full" />
              
              <!-- Botão de som para vídeos -->
              <button
                v-if="item.video"
                @click.stop="toggleMute"
                class="absolute top-4 right-4 z-10 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-all"
                title="Ativar/Desativar som"
              >
                <svg v-if="isMuted" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" clip-rule="evenodd" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
                </svg>
                <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                </svg>
              </button>
              
              <!-- Botão de tela cheia para vídeos -->
              <button
                v-if="item.video"
                @click.stop="toggleFullscreen"
                class="absolute bottom-4 right-4 z-10 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-all"
                title="Tela cheia"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                </svg>
              </button>
              
              <!-- Botão de tela cheia para imagens -->
              <button
                v-if="item.image && !item.video"
                @click.stop="toggleImageFullscreen"
                class="absolute bottom-4 right-4 z-10 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-all"
                title="Ver em tela cheia"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                </svg>
              </button>
              
              <div class="absolute inset-0 bg-gradient-primary opacity-0 group-hover:opacity-90 transition-opacity duration-300 flex items-center justify-center">
                <div class="text-white text-center p-6">
                  <h3 class="text-xl font-bold mb-2">{{ item.title }}</h3>
                  <p class="text-sm text-primary-100 mb-2">{{ item.description }}</p>
                  
                  <a 
                    v-if="item.partnerLink && item.partnerName"
                    :href="item.partnerLink"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="inline-flex items-center gap-1 text-sm text-white hover:text-primary-200 underline"
                    @click.stop
                  >
                    Parceiro: {{ item.partnerName }}
                    <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </CardItem>
          <CardContent class="pt-4">
            <CardItem :translateZ="60" class="w-full">
              <div class="flex items-center justify-between w-full">
                <div class="flex items-center gap-2">
                  <Badge :variant="categoryVariant">
                    {{ item.category }}
                  </Badge>
                  <Badge v-if="item.isNew" variant="danger" class="animate-pulse">
                    NOVIDADE
                  </Badge>
                  <button
                    @click.stop="handleWhatsAppClick"
                    class="flex items-center justify-center w-8 h-8 bg-accent-500 hover:bg-accent-600 text-white rounded-full transition-colors shadow-md hover:shadow-lg"
                    title="Solicitar orçamento via WhatsApp"
                  >
                    <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                    </svg>
                  </button>
                </div>
                <span class="text-sm text-text-tertiary">{{ item.location }}</span>
              </div>
            </CardItem>
          </CardContent>
        </Card>
      </CardItem>
    </CardBody>
  </CardContainer>
  
  <!-- Modal de tela cheia para imagens -->
  <Teleport to="body">
    <div
      v-if="isImageFullscreen && item.image"
      class="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4"
      @click="toggleImageFullscreen"
    >
      <button
        @click.stop="toggleImageFullscreen"
        class="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors"
        title="Fechar"
      >
        <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
      
      <img
        :src="item.image"
        :alt="item.title"
        class="max-w-full max-h-full object-contain"
        @click.stop
      />
      
      <div class="absolute bottom-4 left-4 right-4 text-white text-center">
        <h3 class="text-xl font-bold mb-1">{{ item.title }}</h3>
        <p class="text-sm text-gray-300">{{ item.description }}</p>
      </div>
    </div>
  </Teleport>
</template>
