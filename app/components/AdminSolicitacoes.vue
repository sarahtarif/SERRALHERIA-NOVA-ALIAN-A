<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useSupabase } from '~/composables/useSupabase'
import { useAdminAuth } from '~/composables/useAdminAuth'

type StatusFilter = 'todas' | 'pendente' | 'aprovada' | 'recusada'
type SolicitacaoStatus = 'pendente' | 'aprovada' | 'recusada'

interface ClienteUser {
  full_name: string | null
  email: string
  phone: string | null
  cep: string | null
  street: string | null
  number: string | null
  complement: string | null
  neighborhood: string | null
  city: string | null
  state: string | null
}

interface Solicitacao {
  id: string
  titulo: string
  descricao: string | null
  status: SolicitacaoStatus
  created_at: string
  imagens: string[]
  videos: string[]
  audios: string[]
  user: ClienteUser | null
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
  user: ClienteUser[] | ClienteUser | null
}

const supabase = useSupabase()
const { adminRole: composableRole } = useAdminAuth()
const podeAlterar = computed(() => composableRole.value === 'super_admin' || composableRole.value === 'editor')
const solicitacoes = ref<Solicitacao[]>([])
const loading = ref(true)
const selected = ref<Solicitacao | null>(null)
const lightbox = ref<string | null>(null)
const activeFilter = ref<StatusFilter>('todas')
const updatingStatus = ref(false)

const filters: { key: StatusFilter; label: string }[] = [
  { key: 'todas', label: 'Todas' },
  { key: 'pendente', label: 'Pendentes' },
  { key: 'aprovada', label: 'Aprovadas' },
  { key: 'recusada', label: 'Recusadas' },
]

const filtered = computed(() =>
  activeFilter.value === 'todas'
    ? solicitacoes.value
    : solicitacoes.value.filter(s => s.status === activeFilter.value)
)

onMounted(async () => {
  await fetchSolicitacoes()
})

async function fetchSolicitacoes(): Promise<void> {
  loading.value = true
  const { data, error } = await supabase
    .from('solicitacoes')
    .select('id, titulo, descricao, status, created_at, imagens, videos, audios, user:user_id(full_name, email, phone, cep, street, number, complement, neighborhood, city, state)')
    .order('created_at', { ascending: false })

  if (error) console.error('[AdminSolicitacoes] fetch error:', error.message)

  solicitacoes.value = ((data ?? []) as unknown as RawSolicitacao[]).map(s => ({
    ...s,
    status: s.status ?? 'pendente',
    imagens: s.imagens ?? [],
    videos: s.videos ?? [],
    audios: s.audios ?? [],
    user: Array.isArray(s.user) ? (s.user[0] ?? null) : s.user,
  }))
  loading.value = false
}

watch(selected, (sol) => {
  if (sol) console.debug('[AdminSolicitacoes] selected:', sol.id)
})

async function setStatus(id: string, status: SolicitacaoStatus): Promise<void> {
  updatingStatus.value = true
  const { data, error } = await supabase
    .from('solicitacoes')
    .update({ status })
    .eq('id', id)
    .select('id, status')
    .single()

  if (error) {
    console.error('[AdminSolicitacoes] update status error:', error.message, error.code)
  } else if (data) {
    const idx = solicitacoes.value.findIndex(s => s.id === id)
    if (idx !== -1) {
      const sol = solicitacoes.value[idx]
      if (sol) sol.status = data.status
    }
    if (selected.value?.id === id) selected.value = { ...selected.value, status: data.status }
  }
  updatingStatus.value = false
}

function statusLabel(s: SolicitacaoStatus): string {
  return s === 'pendente' ? 'Pendente' : s === 'aprovada' ? 'Aprovada' : 'Recusada'
}

function statusStyle(s: SolicitacaoStatus): string {
  if (s === 'aprovada') return 'background:rgba(34,197,94,0.15); color:#4ade80; border:1px solid rgba(34,197,94,0.3);'
  if (s === 'recusada') return 'background:rgba(239,68,68,0.15); color:#f87171; border:1px solid rgba(239,68,68,0.3);'
  return 'background:rgba(234,179,8,0.15); color:#facc15; border:1px solid rgba(234,179,8,0.3);'
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('pt-BR', {
    day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit',
  })
}

function hasMedia(sol: Solicitacao): boolean {
  return sol.imagens.length > 0 || sol.videos.length > 0 || sol.audios.length > 0
}

function whatsappLink(sol: Solicitacao): string {
  const phone = (sol.user?.phone ?? '').replace(/\D/g, '')
  if (!phone) return ''
  const name = sol.user?.full_name?.split(' ')[0] ?? 'cliente'
  const msg = encodeURIComponent(`Oi ${name}, vi a sua solicitação "${sol.titulo}" e posso te ajudar. Quando podemos conversar?`)
  return `https://wa.me/55${phone}?text=${msg}`
}

function openLightbox(src: string): void {
  lightbox.value = src
}

function closeLightbox(): void {
  lightbox.value = null
}
</script>

<template>
  <div id="admin-solicitacoes" class="flex flex-col h-full">

    <!-- Título + contador -->
    <div class="px-4 py-4 border-b border-white/5 flex items-center justify-between shrink-0">
      <h2 class="text-base font-semibold text-white">Solicitações</h2>
      <span class="text-xs px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 font-medium">
        {{ filtered.length }}
      </span>
    </div>

    <!-- Filtros -->
    <div class="flex gap-1.5 px-4 py-3 border-b border-white/5 shrink-0 overflow-x-auto">
      <button
        v-for="f in filters"
        :key="f.key"
        class="px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all"
        :style="activeFilter === f.key
          ? 'background:rgba(99,102,241,0.2); color:#a5b4fc; border:1px solid rgba(99,102,241,0.4);'
          : 'background:rgba(255,255,255,0.04); color:#64748b; border:1px solid rgba(255,255,255,0.06);'"
        @click="activeFilter = f.key; selected = null"
      >
        {{ f.label }}
      </button>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="flex-1 flex items-center justify-center">
      <svg class="w-6 h-6 text-indigo-400 animate-spin" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"/>
      </svg>
    </div>

    <!-- Vazio -->
    <div v-else-if="!filtered.length" class="flex-1 flex flex-col items-center justify-center gap-3 px-6 text-center">
      <div class="w-12 h-12 rounded-2xl flex items-center justify-center" style="background:rgba(99,102,241,0.1); border:1px solid rgba(99,102,241,0.2);">
        <svg class="w-6 h-6 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
        </svg>
      </div>
      <p class="text-sm text-slate-400">Nenhuma solicitação encontrada.</p>
    </div>

    <!-- Split: lista + detalhe -->
    <div v-else class="flex-1 flex overflow-hidden">

      <!-- Lista -->
      <div
        class="overflow-y-auto"
        :class="selected ? 'hidden md:flex md:flex-col md:w-72 lg:w-80' : 'flex flex-col w-full'"
        style="border-right:1px solid rgba(255,255,255,0.05);"
      >
        <button
          v-for="s in filtered"
          :key="s.id"
          class="w-full text-left px-4 py-3.5 transition-colors border-b"
          :style="selected?.id === s.id
            ? 'background:rgba(99,102,241,0.12); border-color:rgba(255,255,255,0.04);'
            : 'background:transparent; border-color:rgba(255,255,255,0.04);'"
          @click="selected = s"
        >
          <div class="flex items-start justify-between gap-2">
            <p class="text-sm font-medium text-white truncate">{{ s.titulo }}</p>
            <span class="text-xs shrink-0 mt-0.5" style="color:#475569">{{ formatDate(s.created_at).split(',')[0] }}</span>
          </div>
          <div class="flex items-center gap-2 mt-1">
            <p class="text-xs truncate" style="color:#64748b">
              {{ s.user?.full_name || s.user?.email || 'Cliente' }}
            </p>
            <span class="text-xs px-1.5 py-0.5 rounded-full shrink-0" :style="statusStyle(s.status)">
              {{ statusLabel(s.status) }}
            </span>
          </div>
          <p v-if="s.descricao" class="text-xs mt-0.5 truncate" style="color:#475569">{{ s.descricao }}</p>
        </button>
      </div>

      <!-- Detalhe -->
      <div v-if="selected" class="flex-1 flex flex-col overflow-y-auto">

        <!-- Header -->
        <div class="flex items-center gap-3 px-4 py-3.5 sticky top-0 z-10" style="background:#0f172a; border-bottom:1px solid rgba(255,255,255,0.05);">
          <button
            class="md:hidden w-8 h-8 rounded-lg flex items-center justify-center"
            style="background:rgba(255,255,255,0.05); color:#94a3b8;"
            @click="selected = null"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7"/>
            </svg>
          </button>
          <h3 class="text-sm font-semibold text-white truncate flex-1">{{ selected.titulo }}</h3>
          <span class="text-xs px-2 py-1 rounded-full shrink-0" :style="statusStyle(selected.status)">
            {{ statusLabel(selected.status) }}
          </span>
          <span class="text-xs shrink-0" style="color:#475569">{{ formatDate(selected.created_at) }}</span>
        </div>

        <div class="p-4 space-y-4">

          <!-- Ações de status -->
          <div v-if="podeAlterar" class="flex gap-2 flex-wrap">
            <button
              v-if="selected.status !== 'aprovada'"
              :disabled="updatingStatus"
              class="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all disabled:opacity-50"
              style="background:rgba(34,197,94,0.12); border:1px solid rgba(34,197,94,0.3); color:#4ade80;"
              @click="setStatus(selected.id, 'aprovada')"
            >
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/>
              </svg>
              Aprovar
            </button>
            <button
              v-if="selected.status !== 'recusada'"
              :disabled="updatingStatus"
              class="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all disabled:opacity-50"
              style="background:rgba(239,68,68,0.12); border:1px solid rgba(239,68,68,0.3); color:#f87171;"
              @click="setStatus(selected.id, 'recusada')"
            >
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/>
              </svg>
              Recusar
            </button>
            <button
              v-if="selected.status !== 'pendente'"
              :disabled="updatingStatus"
              class="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all disabled:opacity-50"
              style="background:rgba(234,179,8,0.12); border:1px solid rgba(234,179,8,0.3); color:#facc15;"
              @click="setStatus(selected.id, 'pendente')"
            >
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
              Pendente
            </button>
          </div>

          <!-- Cliente -->
          <div class="rounded-xl p-4 space-y-3" style="background:#1e293b; border:1px solid rgba(255,255,255,0.06);">
            <p class="text-xs font-semibold uppercase tracking-wider" style="color:#6366f1">Cliente</p>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
              <div>
                <p class="text-xs" style="color:#64748b">Nome</p>
                <p class="text-white font-medium mt-0.5">{{ selected.user?.full_name || '—' }}</p>
              </div>
              <div>
                <p class="text-xs" style="color:#64748b">E-mail</p>
                <p class="text-white font-medium mt-0.5 break-all">{{ selected.user?.email || '—' }}</p>
              </div>
              <div>
                <p class="text-xs" style="color:#64748b">Telefone</p>
                <p class="text-white font-medium mt-0.5">{{ selected.user?.phone || '—' }}</p>
              </div>
              <div>
                <p class="text-xs" style="color:#64748b">Cidade / Estado</p>
                <p class="text-white font-medium mt-0.5">
                  {{ selected.user?.city && selected.user?.state ? `${selected.user.city} / ${selected.user.state}` : '—' }}
                </p>
              </div>
            </div>
            <div v-if="selected.user?.street" class="pt-3 border-t text-sm space-y-0.5" style="border-color:rgba(255,255,255,0.06);">
              <p class="text-xs" style="color:#64748b">Endereço</p>
              <p class="text-white font-medium">
                {{ selected.user.street }}{{ selected.user.number ? `, ${selected.user.number}` : '' }}{{ selected.user.complement ? ` — ${selected.user.complement}` : '' }}
              </p>
              <p class="text-xs" style="color:#64748b">
                {{ [selected.user.neighborhood, selected.user.cep ? `CEP ${selected.user.cep}` : ''].filter(Boolean).join(' — ') }}
              </p>
            </div>

            <!-- WhatsApp -->
            <a
              v-if="selected.user?.phone && whatsappLink(selected)"
              :href="whatsappLink(selected)"
              target="_blank"
              rel="noopener noreferrer"
              class="mt-1 inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all"
              style="background:rgba(37,211,102,0.12); border:1px solid rgba(37,211,102,0.3); color:#25d366;"
            >
              <svg class="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              Chamar no WhatsApp
            </a>
          </div>

          <!-- Descrição -->
          <div v-if="selected.descricao" class="rounded-xl p-4" style="background:#1e293b; border:1px solid rgba(255,255,255,0.06);">
            <p class="text-xs font-semibold uppercase tracking-wider mb-2" style="color:#6366f1">Descrição</p>
            <p class="text-sm leading-relaxed" style="color:#cbd5e1">{{ selected.descricao }}</p>
          </div>

          <!-- Mídia -->
          <div v-if="hasMedia(selected)" class="rounded-xl p-4 space-y-4" style="background:#1e293b; border:1px solid rgba(255,255,255,0.06);">
            <p class="text-xs font-semibold uppercase tracking-wider" style="color:#6366f1">Anexos & Áudio</p>

            <!-- Imagens -->
            <div v-if="selected.imagens.length" class="space-y-2">
              <p class="text-xs" style="color:#64748b">Imagens ({{ selected.imagens.length }})</p>
              <div class="grid grid-cols-2 sm:grid-cols-3 gap-2">
                <button
                  v-for="(src, i) in selected.imagens"
                  :key="i"
                  class="block rounded-lg overflow-hidden aspect-square focus:outline-none cursor-zoom-in"
                  style="background:#0f172a; border:1px solid rgba(255,255,255,0.06);"
                  @click="openLightbox(src)"
                >
                  <img :src="src" class="w-full h-full object-cover hover:opacity-90 transition-opacity" alt="imagem" />
                </button>
              </div>
            </div>

            <!-- Vídeos -->
            <div v-if="selected.videos.length" class="space-y-2">
              <p class="text-xs" style="color:#64748b">Vídeos ({{ selected.videos.length }})</p>
              <video
                v-for="(src, i) in selected.videos"
                :key="i"
                :src="src"
                controls
                class="w-full rounded-lg"
                style="background:#0f172a; max-height:240px;"
              />
            </div>

            <!-- Áudios -->
            <div v-if="selected.audios.length" class="space-y-2">
              <p class="text-xs" style="color:#64748b">Áudios ({{ selected.audios.length }})</p>
              <audio
                v-for="(src, i) in selected.audios"
                :key="i"
                :src="src"
                controls
                class="w-full h-10"
              />
            </div>
          </div>

        </div>
      </div>

    </div>
  </div>

  <!-- Lightbox -->
  <Teleport to="body">
    <Transition name="lb-fade">
      <div
        v-if="lightbox"
        id="admin-lightbox"
        class="fixed inset-0 z-50 flex items-center justify-center p-4"
        style="background:rgba(0,0,0,0.92);"
        @click.self="closeLightbox"
      >
        <button
          class="absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center"
          style="background:rgba(255,255,255,0.1); color:#e2e8f0;"
          @click="closeLightbox"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </button>
        <img
          :src="lightbox"
          class="max-w-full max-h-[90vh] rounded-xl object-contain shadow-2xl"
          alt="imagem ampliada"
        />
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.lb-fade-enter-active, .lb-fade-leave-active { transition: opacity 0.2s ease; }
.lb-fade-enter-from, .lb-fade-leave-to { opacity: 0; }
</style>
