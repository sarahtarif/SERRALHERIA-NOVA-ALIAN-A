<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted } from 'vue'

const props = defineProps<{
  src: string
  mediaType?: string
  title?: string
  description?: string
}>()

const emit = defineEmits<{ close: [] }>()

const videoRef = ref<HTMLVideoElement | null>(null)
const playbackRate = ref(1)
const rates = [0.5, 1, 1.25, 1.5, 2]

function isVideo(t?: string) { return (t ?? '').startsWith('video/') }

function setRate(r: number) {
  playbackRate.value = r
  if (videoRef.value) videoRef.value.playbackRate = r
}

function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape') emit('close')
}

onMounted(() => {
  document.addEventListener('keydown', onKeydown)
  document.body.style.overflow = 'hidden'
})

onUnmounted(() => {
  document.removeEventListener('keydown', onKeydown)
  document.body.style.overflow = ''
})

watch(videoRef, (el) => {
  if (el) el.playbackRate = playbackRate.value
})
</script>

<template>
  <Teleport to="body">
    <div
      id="media-lightbox"
      class="fixed inset-0 z-[9999] flex flex-col items-center justify-center"
      style="background:rgba(0,0,0,0.95); backdrop-filter:blur(8px);"
      @click.self="emit('close')"
    >
      <!-- Fechar -->
      <button
        class="absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center transition-colors z-10"
        style="background:rgba(255,255,255,0.1); color:#fff;"
        @click="emit('close')"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/>
        </svg>
      </button>

      <!-- Mídia -->
      <div class="flex-1 flex items-center justify-center w-full px-4 py-16 min-h-0">
        <video
          v-if="isVideo(mediaType)"
          ref="videoRef"
          :src="src"
          class="max-w-full max-h-full rounded-xl shadow-2xl"
          style="max-height: calc(100vh - 160px);"
          controls
          autoplay
          playsinline
        />
        <img
          v-else
          :src="src"
          :alt="title"
          class="max-w-full max-h-full rounded-xl shadow-2xl object-contain"
          style="max-height: calc(100vh - 160px);"
        />
      </div>

      <!-- Barra inferior -->
      <div
        class="w-full shrink-0 px-4 pb-4 flex flex-col gap-2"
        style="max-width: 720px;"
      >
        <!-- Info -->
        <div v-if="title" class="text-center">
          <p class="text-white font-semibold text-sm">{{ title }}</p>
          <p v-if="description" class="text-xs mt-0.5" style="color:#94a3b8;">{{ description }}</p>
        </div>

        <!-- Controles de velocidade (só vídeo) -->
        <div v-if="isVideo(mediaType)" class="flex items-center justify-center gap-2">
          <span class="text-xs" style="color:#64748b;">Velocidade:</span>
          <button
            v-for="r in rates"
            :key="r"
            class="px-2.5 py-1 rounded-lg text-xs font-semibold transition-all"
            :style="playbackRate === r
              ? 'background:rgba(99,102,241,0.3); color:#a5b4fc; border:1px solid rgba(99,102,241,0.5);'
              : 'background:rgba(255,255,255,0.06); color:#64748b; border:1px solid rgba(255,255,255,0.08);'"
            @click="setRate(r)"
          >
            {{ r === 1 ? '1x' : r + 'x' }}
          </button>
        </div>

        <!-- Dica fechar -->
        <p class="text-center text-xs" style="color:#334155;">Pressione Esc ou clique fora para fechar</p>
      </div>
    </div>
  </Teleport>
</template>
