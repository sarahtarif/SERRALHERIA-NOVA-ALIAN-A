<script setup lang="ts">
import { ref } from 'vue'

const aberto = ref(false)
const enviando = ref(false)
const enviado = ref(false)
const mensagem = ref('')
const abaAtual = defineProps<{ aba?: string }>()

async function enviar() {
  if (!mensagem.value.trim()) return
  enviando.value = true
  const corpo = 'Aba: ' + (abaAtual.aba ?? 'desconhecida') + '\n\n' + mensagem.value.trim()
  const mailto = 'mailto:suporte@novaalianca.com.br?subject=' + encodeURIComponent('[Erro no Painel] ' + (abaAtual.aba ?? '')) + '&body=' + encodeURIComponent(corpo)
  window.open(mailto, '_blank')
  enviado.value = true
  enviando.value = false
  mensagem.value = ''
  setTimeout(() => { enviado.value = false; aberto.value = false }, 3000)
}
</script>

<template>
  <div id="admin-reportar-erro" class="mt-6">
    <!-- Botão trigger -->
    <button
      v-if="!aberto"
      class="flex items-center gap-2 text-xs px-3 py-2 rounded-xl transition-all"
      style="background:rgba(239,68,68,0.07); color:#f87171; border:1px solid rgba(239,68,68,0.15);"
      @click="aberto = true"
    >
      <svg class="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
        <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
      </svg>
      Reportar um problema nesta tela
    </button>

    <!-- Formulário expandido -->
    <div
      v-else
      class="rounded-2xl p-4 space-y-3"
      style="background:rgba(239,68,68,0.05); border:1px solid rgba(239,68,68,0.18);"
    >
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-2">
          <svg class="w-4 h-4 shrink-0" style="color:#f87171;" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
          </svg>
          <p class="text-sm font-semibold" style="color:#fca5a5;">Reportar problema</p>
          <span class="text-xs px-2 py-0.5 rounded-full" style="background:rgba(239,68,68,0.12); color:#f87171;">{{ aba ?? 'esta tela' }}</span>
        </div>
        <button class="text-xs" style="color:#64748b;" @click="aberto = false">✕</button>
      </div>

      <p class="text-xs" style="color:#94a3b8;">Descreva o que aconteceu. Isso abrirá seu cliente de email com as informações preenchidas.</p>

      <textarea
        v-model="mensagem"
        rows="3"
        placeholder="Ex: Ao clicar em salvar, apareceu erro 403. Estava tentando alterar o email do admin..."
        class="w-full px-3 py-2 rounded-xl text-sm outline-none resize-none"
        style="background:#0d1526; color:#e2e8f0; border:1px solid rgba(255,255,255,0.08);"
      />

      <div class="flex gap-2">
        <button
          :disabled="enviando || !mensagem.trim()"
          class="flex-1 py-2 rounded-xl text-xs font-semibold transition-all disabled:opacity-40"
          style="background:rgba(239,68,68,0.15); color:#fca5a5; border:1px solid rgba(239,68,68,0.25);"
          @click="enviar"
        >
          {{ enviado ? 'Email aberto!' : enviando ? 'Abrindo...' : 'Enviar por email' }}
        </button>
        <button
          class="px-4 py-2 rounded-xl text-xs transition-all"
          style="background:rgba(255,255,255,0.04); color:#64748b; border:1px solid rgba(255,255,255,0.07);"
          @click="aberto = false"
        >
          Cancelar
        </button>
      </div>
    </div>
  </div>
</template>
