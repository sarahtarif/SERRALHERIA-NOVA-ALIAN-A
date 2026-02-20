<script setup lang="ts">
interface GalleryItem {
  title: string
  description: string
  category: string
  location: string
  video: string | null
}

const props = defineProps<{
  item: GalleryItem
}>()

const videoRef = ref<HTMLVideoElement | null>(null)
const isMuted = ref(true)

const toggleMute = () => {
  if (videoRef.value) {
    videoRef.value.muted = !videoRef.value.muted
    isMuted.value = videoRef.value.muted
  }
}

const categoryVariant = computed(() => {
  const variants: Record<string, any> = {
    automacao: 'default',
    portoes: 'info',
    travas: 'warning',
    cameras: 'danger',
    interfones: 'success'
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
              <!-- Vídeo para itens com vídeo -->
              <video
                v-if="item.video"
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
              
              <div class="absolute inset-0 bg-gradient-primary opacity-0 group-hover:opacity-90 transition-opacity duration-300 flex items-center justify-center">
                <div class="text-white text-center p-6">
                  <h3 class="text-xl font-bold mb-2">{{ item.title }}</h3>
                  <p class="text-sm text-primary-100">{{ item.description }}</p>
                </div>
              </div>
            </div>
          </CardItem>
          <CardContent class="pt-4">
            <CardItem :translateZ="60" class="w-full">
              <div class="flex items-center justify-between w-full">
                <Badge :variant="categoryVariant">
                  {{ item.category }}
                </Badge>
                <span class="text-sm text-text-tertiary">{{ item.location }}</span>
              </div>
            </CardItem>
          </CardContent>
        </Card>
      </CardItem>
    </CardBody>
  </CardContainer>
</template>
