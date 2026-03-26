<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useSupabase } from '~/composables/useSupabase'

const supabase = useSupabase()
const adminRole = ref<string | null>(null)
const podeEditar = computed(() => adminRole.value === 'super_admin' || adminRole.value === 'editor')
const podeExcluir = computed(() => adminRole.value === 'super_admin')

type SolicitacaoStatus = 'pendente' | 'aprovada' | 'recusada'
interface Cliente { id: string; full_name: string | null; email: string; phone: string | null; cep: string | null; street: string | null; number: string | null; complement: string | null; neighborhood: string | null; city: string | null; state: string | null; created_at: string }
interface Solicitacao { id: string; titulo: string; descricao: string | null; status: SolicitacaoStatus; created_at: string; imagens: string[]; videos: string[]; audios: string[] }
interface RawSolicitacao { id: string; titulo: string; descricao: string | null; status: SolicitacaoStatus; created_at: string; imagens: string[] | null; videos: string[] | null; audios: string[] | null }

const clientes = ref<Cliente[]>([])
const loading = ref(true)
const selected = ref<Cliente | null>(null)
const solicitacoes = ref<Solicitacao[]>([])
const loadingSols = ref(false)
const expandedSol = ref<string | null>(null)
const lightbox = ref<string | null>(null)
const editando = ref(false)
const saving = ref(false)
const erroEdit = ref('')
const editForm = ref({ full_name: '', phone: '', cep: '', street: '', number: '', complement: '', neighborhood: '', city: '', state: '' })
const confirmandoExclusao = ref<string | null>(null)
const excluindo = ref(false)
const erroExclusao = ref('')

function abrirEdicao() {
  if (!selected.value) return
  editForm.value = { full_name: selected.value.full_name ?? '', phone: selected.value.phone ?? '', cep: selected.value.cep ?? '', street: selected.value.street ?? '', number: selected.value.number ?? '', complement: selected.value.complement ?? '', neighborhood: selected.value.neighborhood ?? '', city: selected.value.city ?? '', state: selected.value.state ?? '' }
  editando.value = true
  erroEdit.value = ''
}

async function salvarEdicao() {
  if (!selected.value) return
  saving.value = true
  erroEdit.value = ''
  const { error } = await supabase.from('users').update({
    full_name: editForm.value.full_name.trim() || null,
    phone: editForm.value.phone.trim() || null,
    cep: editForm.value.cep.trim() || null,
    street: editForm.value.street.trim() || null,
    number: editForm.value.number.trim() || null,
    complement: editForm.value.complement.trim() || null,
    neighborhood: editForm.value.neighborhood.trim() || null,
    city: editForm.value.city.trim() || null,
    state: editForm.value.state.trim() || null,
    updated_at: new Date().toISOString(),
  }).eq('id', selected.value.id)
  saving.value = false
  if (error) { erroEdit.value = 'Erro ao salvar. Tente novamente.'; return }
  const atualizado: Cliente = { ...selected.value, ...editForm.value, full_name: editForm.value.full_name || null, phone: editForm.value.phone || null, cep: editForm.value.cep || null, street: editForm.value.street || null, number: editForm.value.number || null, complement: editForm.value.complement || null, neighborhood: editForm.value.neighborhood || null, city: editForm.value.city || null, state: editForm.value.state || null }
  const idx = clientes.value.findIndex(c => c.id === selected.value!.id)
  if (idx !== -1) clientes.value[idx] = atualizado
  selected.value = atualizado
  editando.value = false
}

async function excluirCliente(id: string) {
  excluindo.value = true
  erroExclusao.value = ''
  try {
    const { data: { session } } = await supabase.auth.getSession()
    const authHeader = session?.access_token ? { Authorization: 'Bearer ' + session.access_token } : {}
    await $fetch('/api/admin/excluir-cliente?id=' + id, { method: 'DELETE', headers: authHeader })
    clientes.value = clientes.value.filter(c => c.id !== id)
    selected.value = null
  } catch (e: unknown) {
    erroExclusao.value = (e as { data?: { message?: string } })?.data?.message ?? 'Erro ao excluir.'
  } finally {
    excluindo.value = false
    confirmandoExclusao.value = null
  }
}

onMounted(async () => {
  const { data: { user } } = await supabase.auth.getUser()
  if (user) {
    const { data: ar } = await supabase.from('admins').select('role').eq('id', user.id).maybeSingle()
    adminRole.value = ar?.role ?? null
  }
  const { data: adminRows } = await supabase.from('admins').select('id')
  const adminIds = (adminRows ?? []).map((a: { id: string }) => a.id)
  const query = supabase.from('users').select('id, full_name, email, phone, cep, street, number, complement, neighborhood, city, state, created_at').order('created_at', { ascending: false })
  if (adminIds.length > 0) query.not('id', 'in', `(${adminIds.join(',')})`)
  const { data, error } = await query
  if (error) console.error('[AdminClientes] fetch error:', error.message)
  clientes.value = (data ?? []) as Cliente[]
  loading.value = false
})

async function selectCliente(c: Cliente): Promise<void> {
  selected.value = c
  expandedSol.value = null
  solicitacoes.value = []
  loadingSols.value = true
  const { data, error } = await supabase.from('solicitacoes').select('id, titulo, descricao, status, created_at, imagens, videos, audios').eq('user_id', c.id).order('created_at', { ascending: false })
  if (error) console.error('[AdminClientes] solicitacoes error:', error.message)
  solicitacoes.value = ((data ?? []) as unknown as RawSolicitacao[]).map(s => ({ ...s, status: s.status ?? 'pendente', imagens: s.imagens ?? [], videos: s.videos ?? [], audios: s.audios ?? [] }))
  loadingSols.value = false
}

function formatDate(iso: string) { return new Date(iso).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' }) }
function formatDateTime(iso: string) { return new Date(iso).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }) }
function initials(name: string | null, email: string) { return name ? name.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase() : email.charAt(0).toUpperCase() }
function statusLabel(s: SolicitacaoStatus) { return s === 'pendente' ? 'Pendente' : s === 'aprovada' ? 'Aprovada' : 'Recusada' }
function statusStyle(s: SolicitacaoStatus) { if (s === 'aprovada') return 'background:rgba(34,197,94,0.15);color:#4ade80;border:1px solid rgba(34,197,94,0.3);'; if (s === 'recusada') return 'background:rgba(239,68,68,0.15);color:#f87171;border:1px solid rgba(239,68,68,0.3);'; return 'background:rgba(234,179,8,0.15);color:#facc15;border:1px solid rgba(234,179,8,0.3);' }
function whatsappLink(c: Cliente) { const p = (c.phone ?? '').replace(/\D/g, ''); if (!p) return ''; const msg = encodeURIComponent('Olá ' + (c.full_name?.split(' ')[0] ?? 'cliente') + ', tudo bem? Entrando em contato pela Nova Aliança.'); return 'https://wa.me/55' + p + '?text=' + msg }
function toggleSol(id: string) { expandedSol.value = expandedSol.value === id ? null : id }
function hasMedia(s: Solicitacao) { return s.imagens.length > 0 || s.videos.length > 0 || s.audios.length > 0 }
</script>
<template>
  <div id="admin-clientes" class="flex flex-col h-full">
    <div class="px-4 py-4 border-b border-white/5 flex items-center justify-between shrink-0">
      <h2 class="text-base font-semibold text-white">Clientes</h2>
      <span class="text-xs px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 font-medium">{{ clientes.length }}</span>
    </div>
    <div v-if="loading" class="flex-1 flex items-center justify-center">
      <svg class="w-6 h-6 text-indigo-400 animate-spin" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"/></svg>
    </div>
    <div v-else-if="!clientes.length" class="flex-1 flex items-center justify-center">
      <p class="text-sm text-slate-400">Nenhum cliente cadastrado ainda.</p>
    </div>
    <div v-else class="flex-1 flex overflow-hidden">
      <div class="overflow-y-auto" :class="selected ? 'hidden md:flex md:flex-col md:w-72 lg:w-80' : 'flex flex-col w-full'" style="border-right:1px solid rgba(255,255,255,0.05);">
        <button v-for="c in clientes" :key="c.id" class="w-full text-left px-4 py-3.5 transition-colors border-b flex items-center gap-3" :style="selected?.id === c.id ? 'background:rgba(99,102,241,0.12);border-color:rgba(255,255,255,0.04);' : 'background:transparent;border-color:rgba(255,255,255,0.04);'" @click="selectCliente(c)">
          <div class="w-9 h-9 rounded-full flex items-center justify-center shrink-0 text-sm font-bold text-white" style="background:linear-gradient(135deg,#6366f1,#818cf8);">{{ initials(c.full_name, c.email) }}</div>
          <div class="flex-1 min-w-0"><p class="text-sm font-medium text-white truncate">{{ c.full_name || '' }}</p><p class="text-xs truncate" style="color:#64748b">{{ c.email }}</p></div>
          <svg class="w-4 h-4 shrink-0" style="color:#334155;" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"/></svg>
        </button>
      </div>
      <div v-if="selected" class="flex-1 flex flex-col overflow-y-auto">
        <div class="flex items-center gap-3 px-4 py-3.5 sticky top-0 z-10 shrink-0" style="background:#0f172a;border-bottom:1px solid rgba(255,255,255,0.05);">
          <button class="md:hidden w-8 h-8 rounded-lg flex items-center justify-center" style="background:rgba(255,255,255,0.05);color:#94a3b8;" @click="selected = null"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7"/></svg></button>
          <div class="w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-sm font-bold text-white" style="background:linear-gradient(135deg,#6366f1,#818cf8);">{{ initials(selected.full_name, selected.email) }}</div>
          <div class="flex-1 min-w-0"><p class="text-sm font-semibold text-white truncate">{{ selected.full_name || selected.email }}</p><p class="text-xs" style="color:#475569;">Cliente desde {{ formatDate(selected.created_at) }}</p></div>
          <div class="flex items-center gap-1.5 shrink-0">
            <button v-if="podeEditar" @click="abrirEdicao" class="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium" style="background:rgba(99,102,241,0.12);color:#a5b4fc;border:1px solid rgba(99,102,241,0.25);">
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
              Editar
            </button>
            <button v-if="podeExcluir" @click="confirmandoExclusao = selected.id" class="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium" style="background:rgba(239,68,68,0.1);color:#f87171;border:1px solid rgba(239,68,68,0.2);">
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
              Excluir
            </button>
          </div>
        </div>
        <div class="p-4 space-y-4">
          <div class="rounded-xl p-4 space-y-3" style="background:#1e293b;border:1px solid rgba(255,255,255,0.06);">
            <p class="text-xs font-semibold uppercase tracking-wider" style="color:#6366f1">Dados pessoais</p>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
              <div><p class="text-xs" style="color:#64748b">Nome completo</p><p class="text-white font-medium mt-0.5">{{ selected.full_name || '' }}</p></div>
              <div><p class="text-xs" style="color:#64748b">E-mail</p><p class="text-white font-medium mt-0.5 break-all">{{ selected.email }}</p></div>
              <div><p class="text-xs" style="color:#64748b">Telefone</p><p class="text-white font-medium mt-0.5">{{ selected.phone || '' }}</p></div>
              <div><p class="text-xs" style="color:#64748b">Cidade / Estado</p><p class="text-white font-medium mt-0.5">{{ selected.city && selected.state ? `${selected.city} / ${selected.state}` : '' }}</p></div>
            </div>
            <div v-if="selected.street" class="pt-3 border-t space-y-0.5 text-sm" style="border-color:rgba(255,255,255,0.06);">
              <p class="text-xs" style="color:#64748b">Endereço</p>
              <p class="text-white font-medium">{{ selected.street }}{{ selected.number ? `, ${selected.number}` : '' }}{{ selected.complement ? `  ${selected.complement}` : '' }}</p>
              <p class="text-xs" style="color:#64748b">{{ [selected.neighborhood, selected.cep ? `CEP ${selected.cep}` : ''].filter(Boolean).join('  ') }}</p>
            </div>
            <a v-if="whatsappLink(selected)" :href="whatsappLink(selected)" target="_blank" rel="noopener noreferrer" class="mt-1 inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold" style="background:rgba(37,211,102,0.12);border:1px solid rgba(37,211,102,0.3);color:#25d366;">
              <svg class="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
              Chamar no WhatsApp
            </a>
          </div>
          <div class="rounded-xl overflow-hidden" style="background:#1e293b;border:1px solid rgba(255,255,255,0.06);">
            <div class="px-4 py-3 flex items-center justify-between" style="border-bottom:1px solid rgba(255,255,255,0.05);">
              <p class="text-xs font-semibold uppercase tracking-wider" style="color:#6366f1">Histórico de solicitações</p>
              <span v-if="!loadingSols" class="text-xs px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 font-medium">{{ solicitacoes.length }}</span>
            </div>
            <div v-if="loadingSols" class="flex items-center justify-center py-8"><svg class="w-5 h-5 text-indigo-400 animate-spin" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"/></svg></div>
            <div v-else-if="!solicitacoes.length" class="px-4 py-6 text-center"><p class="text-sm" style="color:#475569;">Nenhuma solicitação enviada ainda.</p></div>
            <div v-else class="divide-y divide-white/5">
              <div v-for="s in solicitacoes" :key="s.id">
                <button class="w-full text-left px-4 py-3 flex items-center gap-3 transition-colors" :style="expandedSol === s.id ? 'background:rgba(99,102,241,0.08);' : ''" @click="toggleSol(s.id)">
                  <div class="flex-1 min-w-0"><div class="flex items-center gap-2 flex-wrap"><p class="text-sm font-medium text-white truncate">{{ s.titulo }}</p><span class="text-xs px-1.5 py-0.5 rounded-full shrink-0" :style="statusStyle(s.status)">{{ statusLabel(s.status) }}</span></div><p class="text-xs mt-0.5" style="color:#475569;">{{ formatDateTime(s.created_at) }}</p></div>
                  <svg class="w-4 h-4 shrink-0 transition-transform duration-200" :style="expandedSol === s.id ? 'transform:rotate(90deg);color:#818cf8;' : 'color:#334155;'" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"/></svg>
                </button>
                <div v-if="expandedSol === s.id" class="px-4 pb-4 space-y-3" style="background:rgba(99,102,241,0.04);">
                  <p v-if="s.descricao" class="text-sm leading-relaxed pt-2" style="color:#cbd5e1;">{{ s.descricao }}</p>
                  <p v-else class="text-xs pt-2" style="color:#475569;">Sem descrição.</p>
                  <div v-if="s.imagens.length" class="space-y-1.5"><p class="text-xs" style="color:#64748b;">Imagens ({{ s.imagens.length }})</p><div class="grid grid-cols-3 gap-1.5"><button v-for="(src, i) in s.imagens" :key="i" class="aspect-square rounded-lg overflow-hidden cursor-zoom-in" style="background:#0f172a;border:1px solid rgba(255,255,255,0.06);" @click.stop="lightbox = src"><img :src="src" class="w-full h-full object-cover hover:opacity-90 transition-opacity" alt="imagem" /></button></div></div>
                  <div v-if="s.videos.length" class="space-y-1.5"><p class="text-xs" style="color:#64748b;">Vídeos ({{ s.videos.length }})</p><video v-for="(src, i) in s.videos" :key="i" :src="src" controls class="w-full rounded-lg" style="background:#0f172a;max-height:200px;" /></div>
                  <div v-if="s.audios.length" class="space-y-1.5"><p class="text-xs" style="color:#64748b;">Áudios ({{ s.audios.length }})</p><audio v-for="(src, i) in s.audios" :key="i" :src="src" controls class="w-full h-10" /></div>
                  <p v-if="!s.descricao && !hasMedia(s)" class="text-xs" style="color:#475569;">Sem anexos.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <Teleport to="body"><Transition name="lb-fade"><div v-if="confirmandoExclusao" class="fixed inset-0 z-50 flex items-center justify-center p-4" style="background:rgba(0,0,0,0.7);backdrop-filter:blur(4px);" @click.self="confirmandoExclusao = null"><div class="w-full max-w-sm rounded-2xl p-6 space-y-4" style="background:#0d1526;border:1px solid rgba(239,68,68,0.3);"><div class="flex items-center gap-3"><div class="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style="background:rgba(239,68,68,0.15);"><svg class="w-5 h-5" style="color:#f87171;" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg></div><div><p class="text-sm font-semibold text-white">Excluir cliente?</p><p class="text-xs mt-0.5" style="color:#64748b;">Esta ação não pode ser desfeita.</p></div></div><div v-if="erroExclusao" class="px-3 py-2.5 rounded-xl text-xs" style="background:rgba(239,68,68,0.12);color:#f87171;border:1px solid rgba(239,68,68,0.2);">{{ erroExclusao }}</div><div class="flex gap-3"><button @click="confirmandoExclusao = null; erroExclusao = ''" class="flex-1 py-2.5 rounded-xl text-sm font-medium" style="background:rgba(255,255,255,0.05);color:#64748b;border:1px solid rgba(255,255,255,0.06);">Cancelar</button><button @click="excluirCliente(confirmandoExclusao!)" :disabled="excluindo" class="flex-1 py-2.5 rounded-xl text-sm font-semibold disabled:opacity-50" style="background:rgba(239,68,68,0.8);color:#fff;">{{ excluindo ? 'Excluindo...' : 'Sim, excluir' }}</button></div></div></div></Transition></Teleport>
  <Teleport to="body"><Transition name="lb-fade"><div v-if="editando" class="fixed inset-0 z-50 flex items-center justify-center p-4" style="background:rgba(0,0,0,0.7);backdrop-filter:blur(4px);" @click.self="editando = false"><div class="w-full max-w-lg rounded-2xl overflow-hidden flex flex-col max-h-[90vh]" style="background:#0d1526;border:1px solid rgba(255,255,255,0.08);"><div class="flex items-center justify-between px-5 py-4" style="border-bottom:1px solid rgba(255,255,255,0.06);"><h3 class="text-base font-semibold text-white">Editar cliente</h3><button @click="editando = false" style="color:#64748b;"><svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/></svg></button></div><div class="overflow-y-auto px-5 py-4 space-y-3 flex-1"><div v-if="erroEdit" class="px-3 py-2.5 rounded-xl text-xs" style="background:rgba(239,68,68,0.12);color:#f87171;border:1px solid rgba(239,68,68,0.2);">{{ erroEdit }}</div><div class="grid grid-cols-2 gap-3"><div class="col-span-2"><label class="block text-xs font-medium mb-1.5" style="color:#94a3b8;">Nome completo</label><input v-model="editForm.full_name" type="text" class="w-full px-3 py-2.5 rounded-xl text-sm outline-none" style="background:#1e293b;color:#e2e8f0;border:1px solid rgba(255,255,255,0.08);" /></div><div class="col-span-2"><label class="block text-xs font-medium mb-1.5" style="color:#94a3b8;">Telefone</label><input v-model="editForm.phone" type="tel" class="w-full px-3 py-2.5 rounded-xl text-sm outline-none" style="background:#1e293b;color:#e2e8f0;border:1px solid rgba(255,255,255,0.08);" /></div><div><label class="block text-xs font-medium mb-1.5" style="color:#94a3b8;">CEP</label><input v-model="editForm.cep" type="text" class="w-full px-3 py-2.5 rounded-xl text-sm outline-none" style="background:#1e293b;color:#e2e8f0;border:1px solid rgba(255,255,255,0.08);" /></div><div><label class="block text-xs font-medium mb-1.5" style="color:#94a3b8;">Bairro</label><input v-model="editForm.neighborhood" type="text" class="w-full px-3 py-2.5 rounded-xl text-sm outline-none" style="background:#1e293b;color:#e2e8f0;border:1px solid rgba(255,255,255,0.08);" /></div><div class="col-span-2"><label class="block text-xs font-medium mb-1.5" style="color:#94a3b8;">Rua</label><input v-model="editForm.street" type="text" class="w-full px-3 py-2.5 rounded-xl text-sm outline-none" style="background:#1e293b;color:#e2e8f0;border:1px solid rgba(255,255,255,0.08);" /></div><div><label class="block text-xs font-medium mb-1.5" style="color:#94a3b8;">Número</label><input v-model="editForm.number" type="text" class="w-full px-3 py-2.5 rounded-xl text-sm outline-none" style="background:#1e293b;color:#e2e8f0;border:1px solid rgba(255,255,255,0.08);" /></div><div><label class="block text-xs font-medium mb-1.5" style="color:#94a3b8;">Complemento</label><input v-model="editForm.complement" type="text" class="w-full px-3 py-2.5 rounded-xl text-sm outline-none" style="background:#1e293b;color:#e2e8f0;border:1px solid rgba(255,255,255,0.08);" /></div><div><label class="block text-xs font-medium mb-1.5" style="color:#94a3b8;">Cidade</label><input v-model="editForm.city" type="text" class="w-full px-3 py-2.5 rounded-xl text-sm outline-none" style="background:#1e293b;color:#e2e8f0;border:1px solid rgba(255,255,255,0.08);" /></div><div><label class="block text-xs font-medium mb-1.5" style="color:#94a3b8;">Estado</label><input v-model="editForm.state" type="text" maxlength="2" placeholder="SP" class="w-full px-3 py-2.5 rounded-xl text-sm outline-none uppercase" style="background:#1e293b;color:#e2e8f0;border:1px solid rgba(255,255,255,0.08);" /></div></div></div><div class="px-5 py-4 flex gap-3" style="border-top:1px solid rgba(255,255,255,0.06);"><button @click="editando = false" class="flex-1 py-2.5 rounded-xl text-sm font-medium" style="background:rgba(255,255,255,0.05);color:#64748b;border:1px solid rgba(255,255,255,0.06);">Cancelar</button><button @click="salvarEdicao" :disabled="saving" class="flex-1 py-2.5 rounded-xl text-sm font-semibold disabled:opacity-50" style="background:linear-gradient(135deg,#6366f1,#818cf8);color:#fff;">{{ saving ? 'Salvando...' : 'Salvar alterações' }}</button></div></div></div></Transition></Teleport>
  <Teleport to="body"><Transition name="lb-fade"><div v-if="lightbox" id="admin-clientes-lightbox" class="fixed inset-0 z-50 flex items-center justify-center p-4" style="background:rgba(0,0,0,0.92);" @click.self="lightbox = null"><button class="absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center" style="background:rgba(255,255,255,0.1);color:#e2e8f0;" @click="lightbox = null"><svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/></svg></button><img :src="lightbox" class="max-w-full max-h-[90vh] rounded-xl object-contain shadow-2xl" alt="imagem ampliada" /></div></Transition></Teleport>

  <AdminReportarErro aba="Clientes" />
</template>

<style scoped>
.lb-fade-enter-active, .lb-fade-leave-active { transition: opacity 0.2s ease; }
.lb-fade-enter-from, .lb-fade-leave-to { opacity: 0; }
</style>