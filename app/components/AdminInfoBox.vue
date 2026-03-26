<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps<{
  titulo: string
  itens: string[]
  cor?: 'indigo' | 'green' | 'amber'
}>()

const visivel = ref(true)

const cores = {
  indigo: { bg: 'rgba(99,102,241,0.06)', border: 'rgba(99,102,241,0.15)', icon: '#818cf8', titulo: '#a5b4fc', texto: '#94a3b8', num: '#6366f1' },
  green:  { bg: 'rgba(52,211,153,0.06)', border: 'rgba(52,211,153,0.15)', icon: '#34d399', titulo: '#6ee7b7', texto: '#94a3b8', num: '#10b981' },
  amber:  { bg: 'rgba(245,166,35,0.06)', border: 'rgba(245,166,35,0.18)', icon: '#f5a623', titulo: '#fbbf24', texto: '#94a3b8', num: '#f59e0b' },
}

const c = props.cor ? cores[props.cor] : cores.indigo
</script>

<template>
  <Transition name="info-fade">
    <div
      v-if="visivel"
      class="rounded-2xl p-4 space-y-3 max-w-2xl"
      :style="'background:' + c.bg + '; border:1px solid ' + c.border + ';'"
    >
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-2">
          <svg class="w-4 h-4 shrink-0" :style="'color:' + c.icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
          <p class="text-sm font-semibold" :style="'color:' + c.titulo">{{ titulo }}</p>
        </div>
        <button
          class="text-xs px-2 py-0.5 rounded-lg transition-all"
          style="color:#475569; background:rgba(255,255,255,0.04);"
          @click="visivel = false"
        >
          ocultar
        </button>
      </div>
      <ul class="space-y-1.5">
        <li
          v-for="(item, i) in itens"
          :key="i"
          class="flex items-start gap-2 text-xs leading-relaxed"
          :style="'color:' + c.texto"
        >
          <span class="font-bold shrink-0 mt-0.5" :style="'color:' + c.num">{{ i + 1 }}.</span>
          <span v-html="item" />
        </li>
      </ul>
    </div>
  </Transition>
</template>

<style scoped>
.info-fade-enter-active, .info-fade-leave-active { transition: opacity 0.2s ease, transform 0.2s ease; }
.info-fade-enter-from, .info-fade-leave-to { opacity: 0; transform: translateY(-4px); }
</style>
