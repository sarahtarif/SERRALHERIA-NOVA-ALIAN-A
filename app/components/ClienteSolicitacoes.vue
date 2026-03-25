<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useSupabase } from '~/composables/useSupabase'
import { useAuth } from '~/composables/useAuth'
import type { RealtimeChannel } from '@supabase/supabase-js'

type SolicitacaoStatus = 'pendente' | 'aprovada' | 'recusada'

interface Solicitacao {
  id: string
  titulo: string
  descricao: string | null
  status: SolicitacaoStatus
  created_at: string
  imagens: string[]
  videos: string[]
  audios: string[]
}

interface RawSolicitacao {
  id: string
  titulo: string
  descricao: string | null
  status: SolicitacaoStatus
  created_at: string
  imagens: string[] | null
  videos: string[] | null
  audios: string[] | null
}

const supabase = useSupabase()
const { user } = useAuth()
const solicitacoes = ref<Solicitacao[]>([])
const loading = ref(true)
const selected = ref<Solicitacao | null>(null)
const lightbox = ref<string | null>(null)
let channel: RealtimeChannel | null = null

async function fetchSolicitacoes(): Promise<void> {
  if (!user.value?.id) { loading.value = false; return }
  const { data, error } = await supabase
    .from('solicitacoes')
    .select('id, titulo, descricao, status, created_at, imagens, videos, audios')
    .eq('user_id', user.value.id)
    .order('created_at', { ascending: false })
  if (error) console.error('[ClienteSolicitacoes] fetch error:', error.message)
  solicitacoes.value = ((data ?? []) as unknown as RawSolicitacao[]).map(s => ({
    ...s,
    status: s.status ?? 'pendente',
    imagens: s.imagens ?? [],
    videos: s.videos ?? [],
    audios: s.audios ?? [],
  }))
  loading.value = false
}

onMounted(async () => {
  await fetchSolicitacoes()

  // Realtime: atualiza status quando admin muda
  channel = supabase
    .channel('cliente-solicitacoes-status')
    .on(
      'postgres_changes',
      { event: 'UPDATE', schema: 'public', table: 'solicitacoes', filter: `user_id=eq.${user.value?.id}` },
      (payload) => {
        const updated = payload.new as RawSolicitacao
        const idx = solicitacoes.value.findIndex(s => s.id === updated.id)
        if (idx !== -1) {
          const sol = solicitacoes.value[idx]
          if (sol) sol.status = updated.status ?? 'pendente'
          if (selected.value?.id === updated.id && selected.value) {
            selected.value = { ...selected.value, status: updated.status ?? 'pendente' }
          }
        }
      }
    )
    .subscribe()
})

onUnmounted(() => {
  if (channel) supabase.removeChannel(channel)
})

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('pt-BR', {
    day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit',
  })
}

interface StatusConfig { label: string; dot: string; text: string; border: string; bg: string }

function statusConfig(s: SolicitacaoStatus): StatusConfig {
  if (s === 'aprovada') return { label: 'Aprovado', dot: '#4ade80', text: '#4ade80', border: 'rgba(74,222,128,0.3)', bg: 'rgba(74,222,128,0.08)' }
  if (s === 'recusada') return { label: 'Recusado', dot: '#f87171', text: '#f87171', border: 'rgba(248,113,113,0.3)', bg: 'rgba(248,113,113,0.08)' }
  return { label: 'Em análise', dot: '#ffba35', text: '#ffba35', border: 'rgba(255,186,53,0.3)', bg: 'rgba(255,186,53,0.08)' }
}

function hasMedia(s: Solicitacao): boolean {
  return s.imagens.length > 0 || s.videos.length > 0 || s.audios.length > 0
}
</script>

<template>
  <section id="cliente-solicitacoes" class="w-full max-w-2xl mx-auto pb-10">

    <div class="flex items-center justify-between mb-4">
      <h2 class="font-headline text-lg font-semibold tracking-tight" style="color:#0f172a;">Minhas solicitações</h2>
      <span v-if="!loading" class="text-xs px-2.5 py-1 rounded-full font-semibold font-label" style="background:rgba(126,87,0,0.1); color:#7e5700; border:1px solid rgba(126,87,0,0.2);">
        {{ solicitacoes.length }}
      </span>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="flex justify-center py-10">
      <svg class="w-6 h-6 animate-spin" style="color:#ffba35;" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"/>
      </svg>
    </div>

    <!-- Vazio -->
    <div v-else-if="!solicitacoes.length" class="flex flex-col items-center gap-3 py-12 text-center">
      <div class="w-12 h-12 rounded-2xl flex items-center justify-center" style="background:rgba(255,186,53,0.08); border:1px solid rgba(255,186,53,0.15);">
        <svg class="w-6 h-6" style="color:rgba(255,186,53,0.35);" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
        </svg>
      </div>
      <p class="text-sm font-body" style="color:#64748b;">Você ainda não enviou nenhuma solicitação.</p>
    </div>

    <!-- Lista -->
    <div v-else class="space-y-2">
      <button
        v-for="s in solicitacoes"
        :key="s.id"
        class="w-full text-left rounded-xl p-4 transition-all hover:brightness-110 active:scale-[0.99] focus:outline-none group"
        style="background:#f8fafc; border:1px solid rgba(126,87,0,0.15);"
        @click="selected = s"
      >
        <div class="flex items-start justify-between gap-3">
          <div class="flex-1 min-w-0">
            <p class="font-headline text-sm font-semibold truncate" style="color:#0f172a;">{{ s.titulo }}</p>
            <p v-if="s.descricao" class="font-body text-xs mt-1 line-clamp-1" style="color:#475569;">{{ s.descricao }}</p>
            <p class="font-label text-xs mt-2" style="color:#94a3b8;">{{ formatDate(s.created_at) }}</p>
          </div>
          <div class="flex flex-col items-end gap-2 shrink-0 pt-0.5">
            <span
              class="flex items-center gap-1.5 px-2.5 py-1 rounded-full font-label text-xs font-semibold"
              :style="`background:${statusConfig(s.status).bg}; color:${statusConfig(s.status).text}; border:1px solid ${statusConfig(s.status).border};`"
            >
              <span class="w-1.5 h-1.5 rounded-full shrink-0" :style="`background:${statusConfig(s.status).dot};`" />
              {{ statusConfig(s.status).label }}
            </span>
            <svg class="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" style="color:rgba(255,186,53,0.35);" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"/>
            </svg>
          </div>
        </div>
      </button>
    </div>
  </section>

  <!-- Modal de detalhe -->
  <Teleport to="body">
    <Transition name="modal-fade">
      <div
        v-if="selected"
        id="cliente-sol-modal-overlay"
        class="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4"
        style="background:rgba(6,20,35,0.88); backdrop-filter:blur(8px);"
        @click.self="selected = null"
      >
        <div
          class="w-full sm:max-w-lg max-h-[90vh] overflow-y-auto flex flex-col rounded-t-2xl sm:rounded-2xl"
          style="background:#0f1c2c; border:1px solid rgba(255,186,53,0.15);"
        >
          <!-- Header -->
          <div class="flex items-start gap-3 px-5 py-4 sticky top-0 z-10 rounded-t-2xl sm:rounded-t-2xl" style="background:#0f1c2c; border-bottom:1px solid rgba(255,186,53,0.08);">
            <div class="flex-1 min-w-0">
              <p class="font-headline text-base font-bold leading-snug" style="color:#d6e4f9;">{{ selected.titulo }}</p>
              <p class="font-label text-xs mt-1" style="color:rgba(214,228,249,0.3);">{{ formatDate(selected.created_at) }}</p>
            </div>
            <div class="flex items-center gap-2 shrink-0">
              <span
                class="flex items-center gap-1.5 px-2.5 py-1 rounded-full font-label text-xs font-semibold"
                :style="`background:${statusConfig(selected.status).bg}; color:${statusConfig(selected.status).text}; border:1px solid ${statusConfig(selected.status).border};`"
              >
                <span class="w-1.5 h-1.5 rounded-full" :style="`background:${statusConfig(selected.status).dot};`" />
                {{ statusConfig(selected.status).label }}
              </span>
              <button
                class="w-8 h-8 rounded-lg flex items-center justify-center transition-colors"
                style="background:rgba(255,255,255,0.05); color:#8e9196;"
                @click="selected = null"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/>
                </svg>
              </button>
            </div>
          </div>

          <div class="p-5 space-y-5">

            <div v-if="selected.descricao">
              <p class="font-label text-xs font-semibold uppercase tracking-widest mb-2" style="color:rgba(255,186,53,0.6);">Descrição</p>
              <p class="font-body text-sm leading-relaxed" style="color:#c4c6cc;">{{ selected.descricao }}</p>
            </div>

            <p v-if="!selected.descricao && !hasMedia(selected)" class="font-body text-sm text-center py-4" style="color:#8e9196;">
              Nenhum detalhe adicional.
            </p>

            <div v-if="selected.imagens.length">
              <p class="font-label text-xs font-semibold uppercase tracking-widest mb-2" style="color:rgba(255,186,53,0.6);">Imagens ({{ selected.imagens.length }})</p>
              <div class="grid grid-cols-3 gap-2">
                <button
                  v-for="(src, i) in selected.imagens"
                  :key="i"
                  class="aspect-square rounded-lg overflow-hidden focus:outline-none cursor-zoom-in"
                  style="background:#061423; border:1px solid rgba(255,186,53,0.1);"
                  @click="lightbox = src"
                >
                  <img :src="src" class="w-full h-full object-cover hover:opacity-90 transition-opacity" alt="imagem" />
                </button>
              </div>
            </div>

            <div v-if="selected.videos.length">
              <p class="font-label text-xs font-semibold uppercase tracking-widest mb-2" style="color:rgba(255,186,53,0.6);">Vídeos ({{ selected.videos.length }})</p>
              <video
                v-for="(src, i) in selected.videos"
                :key="i"
                :src="src"
                controls
                class="w-full rounded-lg mb-2"
                style="background:#061423; max-height:220px;"
              />
            </div>

            <div v-if="selected.audios.length">
              <p class="font-label text-xs font-semibold uppercase tracking-widest mb-2" style="color:rgba(255,186,53,0.6);">Áudios ({{ selected.audios.length }})</p>
              <audio
                v-for="(src, i) in selected.audios"
                :key="i"
                :src="src"
                controls
                class="w-full h-10 mb-1"
              />
            </div>

          </div>
        </div>
      </div>
    </Transition>
  </Teleport>

  <!-- Lightbox -->
  <Teleport to="body">
    <Transition name="lb-fade">
      <div
        v-if="lightbox"
        id="cliente-sol-lightbox"
        class="fixed inset-0 z-[60] flex items-center justify-center p-4"
        style="background:rgba(0,0,0,0.93);"
        @click.self="lightbox = null"
      >
        <button
          class="absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center"
          style="background:rgba(255,255,255,0.08); color:#d6e4f9;"
          @click="lightbox = null"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </button>
        <img :src="lightbox" class="max-w-full max-h-[90vh] rounded-xl object-contain shadow-2xl" alt="imagem ampliada" />
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.modal-fade-enter-active, .modal-fade-leave-active { transition: opacity 0.2s ease; }
.modal-fade-enter-from, .modal-fade-leave-to { opacity: 0; }
.lb-fade-enter-active, .lb-fade-leave-active { transition: opacity 0.15s ease; }
.lb-fade-enter-from, .lb-fade-leave-to { opacity: 0; }
</style>
