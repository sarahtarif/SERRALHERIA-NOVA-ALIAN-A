<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useSupabase } from '~/composables/useSupabase'
import { useAdminAuth } from '~/composables/useAdminAuth'
import AdminInfoBox from '~/components/AdminInfoBox.vue'

interface ServicoCatalogo {
  id: string
  nome: string
  descricao: string | null
  ativo: boolean
}

interface ClienteAvulso {
  id: string
  nome: string
  telefone: string
  bairro: string
  email: string | null
  user_id: string | null
}

interface Agendamento {
  id: string
  titulo: string
  descricao: string | null
  servico_id: string | null
  cliente_avulso_id: string | null
  user_id: string | null
  data_servico: string
  horario: string
  status: 'agendado' | 'em_andamento' | 'concluido' | 'cancelado'
  servicos_catalogo?: { id: string; nome: string } | null
  clientes_avulsos?: ClienteAvulso | null
  users?: { full_name: string | null; email: string; phone: string | null } | null
}

const supabase = useSupabase()

const { adminRole: composableRole } = useAdminAuth()
const podeEditar = computed(() => composableRole.value === 'super_admin' || composableRole.value === 'editor')
const podeCriar = computed(() => composableRole.value === 'super_admin' || composableRole.value === 'editor')
const podeExcluir = computed(() => composableRole.value === 'super_admin')

const agendamentos = ref<Agendamento[]>([])
const servicos = ref<ServicoCatalogo[]>([])
const loading = ref(true)
const showForm = ref(false)
const saving = ref(false)
const erro = ref('')
const sucesso = ref('')

// Edição
const editando = ref<Agendamento | null>(null)
const showEditForm = ref(false)
const editForm = ref({ titulo: '', descricao: '', servico_id: '', data_servico: '', horario: '', status: 'agendado' as string })

// Exclusão
const confirmandoExclusao = ref<string | null>(null)
const excluindo = ref(false)

// Link de convite
const linkCopiado = ref<string | null>(null)
const gerandoLink = ref<string | null>(null)

const form = ref({
  titulo: '', descricao: '', servico_id: '', data_servico: '', horario: '',
  clienteTipo: 'avulso' as 'avulso' | 'registrado',
  clienteEmail: '',
  clienteEncontrado: null as { id: string; email: string; full_name: string | null } | null,
  nome: '', telefone: '', bairro: '', email: '',
})

const buscandoCliente = ref(false)

const filtroStatus = ref('todos')
const statusOpcoes = [
  { value: 'todos',        label: 'Todos' },
  { value: 'agendado',     label: 'Agendado' },
  { value: 'em_andamento', label: 'Em andamento' },
  { value: 'concluido',    label: 'Concluído' },
  { value: 'cancelado',    label: 'Cancelado' },
]

const agendamentosFiltrados = computed(() =>
  filtroStatus.value === 'todos'
    ? agendamentos.value
    : agendamentos.value.filter(a => a.status === filtroStatus.value)
)

const statusConfig: Record<string, { label: string; class: string }> = {
  agendado:     { label: 'Agendado',     class: 'bg-blue-500/15 text-blue-400 border-blue-500/30' },
  em_andamento: { label: 'Em andamento', class: 'bg-yellow-500/15 text-yellow-400 border-yellow-500/30' },
  concluido:    { label: 'Concluído',    class: 'bg-green-500/15 text-green-400 border-green-500/30' },
  cancelado:    { label: 'Cancelado',    class: 'bg-red-500/15 text-red-400 border-red-500/30' },
}

function formatDate(d: string) {
  return new Intl.DateTimeFormat('pt-BR').format(new Date(d + 'T00:00:00'))
}

function nomeCliente(a: Agendamento): string {
  if (a.clientes_avulsos) return a.clientes_avulsos.nome
  if (a.users) return a.users.full_name ?? a.users.email
  return '—'
}

function telefoneCliente(a: Agendamento): string {
  if (a.clientes_avulsos) return a.clientes_avulsos.telefone
  if (a.users) return a.users.phone ?? '—'
  return '—'
}

async function carregar() {
  loading.value = true
  const [{ data: ag }, { data: sv }] = await Promise.all([
    supabase
      .from('agendamentos')
      .select('*, servicos_catalogo(id,nome), clientes_avulsos(id,nome,telefone,bairro,email,user_id), users(full_name,email,phone)')
      .order('data_servico', { ascending: true }),
    supabase.from('servicos_catalogo').select('*').eq('ativo', true).order('nome'),
  ])
  agendamentos.value = (ag ?? []) as Agendamento[]
  servicos.value = (sv ?? []) as ServicoCatalogo[]
  loading.value = false
}

async function buscarClienteRegistrado() {
  if (!form.value.clienteEmail) return
  buscandoCliente.value = true
  form.value.clienteEncontrado = null
  const { data } = await supabase
    .from('users')
    .select('id, email, full_name')
    .eq('email', form.value.clienteEmail.trim().toLowerCase())
    .maybeSingle()
  form.value.clienteEncontrado = data ?? null
  buscandoCliente.value = false
}

async function salvar() {
  erro.value = ''
  sucesso.value = ''
  if (!form.value.titulo || !form.value.data_servico || !form.value.horario) {
    erro.value = 'Preencha título, data e horário.'
    return
  }
  if (form.value.clienteTipo === 'avulso') {
    if (!form.value.nome || !form.value.telefone || !form.value.bairro) {
      erro.value = 'Preencha nome, telefone e bairro do cliente.'
      return
    }
  } else {
    if (!form.value.clienteEncontrado) {
      erro.value = 'Busque e confirme o cliente registrado.'
      return
    }
  }
  saving.value = true
  let clienteAvulsoId: string | null = null
  let userId: string | null = null
  if (form.value.clienteTipo === 'avulso') {
    const { data: existente } = await supabase
      .from('clientes_avulsos').select('id').eq('telefone', form.value.telefone.trim()).maybeSingle()
    if (existente) {
      clienteAvulsoId = existente.id
    } else {
      const { data: novo, error: errCliente } = await supabase
        .from('clientes_avulsos')
        .insert({ nome: form.value.nome.trim(), telefone: form.value.telefone.trim(), bairro: form.value.bairro.trim(), email: form.value.email.trim() || null })
        .select('id').single()
      if (errCliente || !novo) { erro.value = 'Erro ao criar cliente.'; saving.value = false; return }
      clienteAvulsoId = novo.id
    }
  } else {
    userId = form.value.clienteEncontrado!.id
  }
  const { error: errAg } = await supabase.from('agendamentos').insert({
    titulo: form.value.titulo.trim(), descricao: form.value.descricao.trim() || null,
    servico_id: form.value.servico_id || null, data_servico: form.value.data_servico,
    horario: form.value.horario, cliente_avulso_id: clienteAvulsoId, user_id: userId,
  })
  saving.value = false
  if (errAg) { erro.value = 'Erro ao salvar agendamento.'; return }
  sucesso.value = 'Agendamento criado com sucesso!'
  showForm.value = false
  resetForm()
  await carregar()
}

async function atualizarStatus(id: string, status: string) {
  await supabase.from('agendamentos').update({ status, updated_at: new Date().toISOString() }).eq('id', id)
  await carregar()
}

// ── Edição ───────────────────────────────────────────────
function abrirEdicao(ag: Agendamento) {
  editando.value = ag
  editForm.value = {
    titulo: ag.titulo,
    descricao: ag.descricao ?? '',
    servico_id: ag.servico_id ?? '',
    data_servico: ag.data_servico,
    horario: ag.horario.slice(0, 5),
    status: ag.status,
  }
  showEditForm.value = true
}

async function salvarEdicao() {
  if (!editando.value) return
  if (!editForm.value.titulo || !editForm.value.data_servico || !editForm.value.horario) {
    erro.value = 'Preencha título, data e horário.'
    return
  }
  saving.value = true
  const { error: errAg } = await supabase.from('agendamentos').update({
    titulo: editForm.value.titulo.trim(),
    descricao: editForm.value.descricao.trim() || null,
    servico_id: editForm.value.servico_id || null,
    data_servico: editForm.value.data_servico,
    horario: editForm.value.horario,
    status: editForm.value.status,
    updated_at: new Date().toISOString(),
  }).eq('id', editando.value.id)
  saving.value = false
  if (errAg) { erro.value = 'Erro ao atualizar agendamento.'; return }
  sucesso.value = 'Agendamento atualizado!'
  showEditForm.value = false
  editando.value = null
  await carregar()
}

// ── Exclusão ─────────────────────────────────────────────
async function excluir(id: string) {
  excluindo.value = true
  await supabase.from('agendamentos').delete().eq('id', id)
  excluindo.value = false
  confirmandoExclusao.value = null
  sucesso.value = 'Agendamento excluído.'
  await carregar()
}

async function gerarLinkConvite(clienteAvulsoId: string) {
  gerandoLink.value = clienteAvulsoId
  try {
    const { token } = await $fetch<{ token: string }>('/api/convites/gerar', {
      method: 'POST', body: { clienteAvulsoId },
    })
    const link = `${window.location.origin}/convite?token=${token}`
    await navigator.clipboard.writeText(link)
    linkCopiado.value = clienteAvulsoId
    setTimeout(() => { linkCopiado.value = null }, 3000)
  } catch {
    erro.value = 'Erro ao gerar link de convite.'
  } finally {
    gerandoLink.value = null
  }
}

function resetForm() {
  form.value = {
    titulo: '', descricao: '', servico_id: '', data_servico: '', horario: '',
    clienteTipo: 'avulso', clienteEmail: '', clienteEncontrado: null,
    nome: '', telefone: '', bairro: '', email: '',
  }
  erro.value = ''
}

onMounted(carregar)
</script>

<template>
  <div class="flex-1 overflow-y-auto px-4 py-6">
    <div class="max-w-5xl mx-auto space-y-6">

            <!-- InfoBox Agendamentos -->
      <AdminInfoBox
        titulo="Como usar: Agendamentos"
        :itens="[
          'Clique em <strong style=&quot;color:#c7d2fe;&quot;>+ Novo Agendamento</strong> para criar um serviço agendado para um cliente.',
          'Preencha o título, data, horário, status e vincule a um cliente cadastrado ou avulso.',
          'Os status disponíveis são: <strong style=&quot;color:#c7d2fe;&quot;>agendado</strong>, <strong style=&quot;color:#c7d2fe;&quot;>em andamento</strong>, <strong style=&quot;color:#c7d2fe;&quot;>concluído</strong> e <strong style=&quot;color:#c7d2fe;&quot;>cancelado</strong>.',
          'Agendamentos com status <em>agendado</em> ou <em>em andamento</em> são incluídos automaticamente nas notificações de lembrete por email.',
          'Use os filtros de status e data para localizar agendamentos rapidamente.',
        ]"
      />

<!-- Header -->
      <div class="flex items-center justify-between">
        <div>
          <h2 class="text-xl font-bold text-white">Agendamentos</h2>
          <p class="text-sm mt-0.5" style="color:#475569;">Gerencie os serviços agendados</p>
        </div>
        <button
          v-if="podeCriar"
          class="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all hover:brightness-110"
          style="background:linear-gradient(135deg,#6366f1,#818cf8); color:#fff;"
          @click="showForm = true"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4"/>
          </svg>
          Novo Agendamento
        </button>
      </div>

      <!-- Feedback -->
      <div v-if="sucesso" class="px-4 py-3 rounded-xl text-sm font-medium" style="background:rgba(34,197,94,0.12); color:#4ade80; border:1px solid rgba(34,197,94,0.2);">
        {{ sucesso }}
      </div>
      <div v-if="erro" class="px-4 py-3 rounded-xl text-sm font-medium" style="background:rgba(239,68,68,0.12); color:#f87171; border:1px solid rgba(239,68,68,0.2);">
        {{ erro }}
      </div>

      <!-- Filtros -->
      <div class="flex gap-2 flex-wrap">
        <button
          v-for="op in statusOpcoes" :key="op.value"
          @click="filtroStatus = op.value"
          class="px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
          :style="filtroStatus === op.value
            ? 'background:rgba(99,102,241,0.2); color:#a5b4fc; border:1px solid rgba(99,102,241,0.4);'
            : 'background:rgba(255,255,255,0.04); color:#64748b; border:1px solid rgba(255,255,255,0.06);'"
        >{{ op.label }}</button>
      </div>

      <!-- Loading -->
      <div v-if="loading" class="space-y-3">
        <div v-for="i in 3" :key="i" class="h-24 rounded-2xl animate-pulse" style="background:#0d1526;"></div>
      </div>

      <!-- Lista -->
      <div v-else-if="agendamentosFiltrados.length" class="space-y-3">
        <div
          v-for="ag in agendamentosFiltrados" :key="ag.id"
          class="p-4 rounded-2xl"
          style="background:#0d1526; border:1px solid rgba(255,255,255,0.06);"
        >
          <div class="flex items-start justify-between gap-4">
            <div class="flex-1 min-w-0">
              <div class="flex items-center gap-2 flex-wrap">
                <span class="text-sm font-semibold text-white">{{ ag.titulo }}</span>
                <span :class="['px-2 py-0.5 rounded-full text-xs font-medium border', statusConfig[ag.status]?.class]">
                  {{ statusConfig[ag.status]?.label }}
                </span>
              </div>
              <p v-if="ag.descricao" class="text-xs mt-1 truncate" style="color:#64748b;">{{ ag.descricao }}</p>
              <div class="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-xs" style="color:#475569;">
                <span class="flex items-center gap-1">
                  <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                  {{ formatDate(ag.data_servico) }} às {{ ag.horario.slice(0,5) }}
                </span>
                <span class="flex items-center gap-1">
                  <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
                  {{ nomeCliente(ag) }} · {{ telefoneCliente(ag) }}
                </span>
                <span v-if="ag.servicos_catalogo" class="flex items-center gap-1">
                  <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/><circle cx="12" cy="12" r="3"/></svg>
                  {{ ag.servicos_catalogo.nome }}
                </span>
              </div>
            </div>

            <!-- Ações -->
            <div class="flex flex-col items-end gap-2 shrink-0">
              <select
                v-if="podeEditar"
                :value="ag.status"
                @change="atualizarStatus(ag.id, ($event.target as HTMLSelectElement).value)"
                class="text-xs px-2 py-1.5 rounded-lg outline-none cursor-pointer"
                style="background:#1e293b; color:#94a3b8; border:1px solid rgba(255,255,255,0.08);"
              >
                <option value="agendado">Agendado</option>
                <option value="em_andamento">Em andamento</option>
                <option value="concluido">Concluído</option>
                <option value="cancelado">Cancelado</option>
              </select>
              <span
                v-else
                :class="['px-2 py-0.5 rounded-full text-xs font-medium border', statusConfig[ag.status]?.class]"
              >{{ statusConfig[ag.status]?.label }}</span>

              <!-- Editar / Excluir -->
              <div v-if="podeEditar" class="flex items-center gap-1.5">
                <button
                  @click="abrirEdicao(ag)"
                  class="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all"
                  style="background:rgba(99,102,241,0.12); color:#a5b4fc; border:1px solid rgba(99,102,241,0.25);"
                  title="Editar agendamento"
                >
                  <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                  </svg>
                  Editar
                </button>
                <button
                  v-if="podeExcluir"
                  @click="confirmandoExclusao = ag.id"
                  class="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all"
                  style="background:rgba(239,68,68,0.1); color:#f87171; border:1px solid rgba(239,68,68,0.2);"
                  title="Excluir agendamento"
                >
                  <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                  </svg>
                  Excluir
                </button>
              </div>

              <!-- Link convite -->
              <button
                v-if="podeEditar && ag.clientes_avulsos && !ag.clientes_avulsos.user_id"
                @click="gerarLinkConvite(ag.clientes_avulsos.id)"
                :disabled="gerandoLink === ag.clientes_avulsos.id"
                class="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all disabled:opacity-50"
                :style="linkCopiado === ag.clientes_avulsos.id
                  ? 'background:rgba(34,197,94,0.15); color:#4ade80; border:1px solid rgba(34,197,94,0.3);'
                  : 'background:rgba(99,102,241,0.12); color:#a5b4fc; border:1px solid rgba(99,102,241,0.25);'"
              >
                <svg v-if="linkCopiado === ag.clientes_avulsos.id" class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/></svg>
                <svg v-else class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"/></svg>
                {{ linkCopiado === ag.clientes_avulsos.id ? 'Copiado!' : gerandoLink === ag.clientes_avulsos.id ? '...' : 'Gerar link' }}
              </button>
              <span
                v-else-if="ag.clientes_avulsos?.user_id || ag.user_id"
                class="text-xs px-2 py-1 rounded-lg"
                style="background:rgba(34,197,94,0.08); color:#4ade80; border:1px solid rgba(34,197,94,0.15);"
              >✓ tem conta</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty -->
      <div v-else class="text-center py-16">
        <svg class="w-12 h-12 mx-auto mb-3" style="color:#1e293b;" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
        </svg>
        <p class="text-sm" style="color:#475569;">Nenhum agendamento encontrado</p>
      </div>
    </div>
  </div>

  <!-- ===== MODAL CONFIRMAR EXCLUSÃO ===== -->
  <Teleport to="body">
    <Transition name="fade">
      <div
        v-if="confirmandoExclusao"
        class="fixed inset-0 z-50 flex items-center justify-center p-4"
        style="background:rgba(0,0,0,0.7); backdrop-filter:blur(4px);"
        @click.self="confirmandoExclusao = null"
      >
        <div class="w-full max-w-sm rounded-2xl p-6 space-y-4" style="background:#0d1526; border:1px solid rgba(239,68,68,0.3);">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style="background:rgba(239,68,68,0.15);">
              <svg class="w-5 h-5" style="color:#f87171;" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
              </svg>
            </div>
            <div>
              <p class="text-sm font-semibold text-white">Excluir agendamento?</p>
              <p class="text-xs mt-0.5" style="color:#64748b;">Esta ação não pode ser desfeita.</p>
            </div>
          </div>
          <div class="flex gap-3">
            <button
              @click="confirmandoExclusao = null"
              class="flex-1 py-2.5 rounded-xl text-sm font-medium"
              style="background:rgba(255,255,255,0.05); color:#64748b; border:1px solid rgba(255,255,255,0.06);"
            >Cancelar</button>
            <button
              @click="excluir(confirmandoExclusao!)"
              :disabled="excluindo"
              class="flex-1 py-2.5 rounded-xl text-sm font-semibold disabled:opacity-50"
              style="background:rgba(239,68,68,0.8); color:#fff;"
            >{{ excluindo ? 'Excluindo...' : 'Sim, excluir' }}</button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>

  <!-- ===== MODAL EDITAR AGENDAMENTO ===== -->
  <Teleport to="body">
    <Transition name="fade">
      <div
        v-if="showEditForm"
        class="fixed inset-0 z-50 flex items-center justify-center p-4"
        style="background:rgba(0,0,0,0.7); backdrop-filter:blur(4px);"
        @click.self="showEditForm = false"
      >
        <div class="w-full max-w-lg rounded-2xl overflow-hidden flex flex-col max-h-[90vh]" style="background:#0d1526; border:1px solid rgba(255,255,255,0.08);">
          <div class="flex items-center justify-between px-5 py-4" style="border-bottom:1px solid rgba(255,255,255,0.06);">
            <h3 class="text-base font-semibold text-white">Editar Agendamento</h3>
            <button @click="showEditForm = false" style="color:#64748b;" class="hover:text-white transition-colors">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
            </button>
          </div>
          <div class="overflow-y-auto px-5 py-4 space-y-4 flex-1">
            <div>
              <label class="block text-xs font-medium mb-1.5" style="color:#94a3b8;">Título *</label>
              <input v-model="editForm.titulo" type="text" class="w-full px-3 py-2.5 rounded-xl text-sm outline-none" style="background:#1e293b; color:#e2e8f0; border:1px solid rgba(255,255,255,0.08);" />
            </div>
            <div>
              <label class="block text-xs font-medium mb-1.5" style="color:#94a3b8;">Descrição</label>
              <textarea v-model="editForm.descricao" rows="2" class="w-full px-3 py-2.5 rounded-xl text-sm outline-none resize-none" style="background:#1e293b; color:#e2e8f0; border:1px solid rgba(255,255,255,0.08);" />
            </div>
            <div class="grid grid-cols-2 gap-3">
              <div class="col-span-2">
                <label class="block text-xs font-medium mb-1.5" style="color:#94a3b8;">Serviço</label>
                <select v-model="editForm.servico_id" class="w-full px-3 py-2.5 rounded-xl text-sm outline-none" style="background:#1e293b; color:#e2e8f0; border:1px solid rgba(255,255,255,0.08);">
                  <option value="">— Selecionar serviço —</option>
                  <option v-for="sv in servicos" :key="sv.id" :value="sv.id">{{ sv.nome }}</option>
                </select>
              </div>
              <div>
                <label class="block text-xs font-medium mb-1.5" style="color:#94a3b8;">Data *</label>
                <input v-model="editForm.data_servico" type="date" class="w-full px-3 py-2.5 rounded-xl text-sm outline-none" style="background:#1e293b; color:#e2e8f0; border:1px solid rgba(255,255,255,0.08);" />
              </div>
              <div>
                <label class="block text-xs font-medium mb-1.5" style="color:#94a3b8;">Horário *</label>
                <input v-model="editForm.horario" type="time" class="w-full px-3 py-2.5 rounded-xl text-sm outline-none" style="background:#1e293b; color:#e2e8f0; border:1px solid rgba(255,255,255,0.08);" />
              </div>
              <div class="col-span-2">
                <label class="block text-xs font-medium mb-1.5" style="color:#94a3b8;">Status</label>
                <select v-model="editForm.status" class="w-full px-3 py-2.5 rounded-xl text-sm outline-none" style="background:#1e293b; color:#e2e8f0; border:1px solid rgba(255,255,255,0.08);">
                  <option value="agendado">Agendado</option>
                  <option value="em_andamento">Em andamento</option>
                  <option value="concluido">Concluído</option>
                  <option value="cancelado">Cancelado</option>
                </select>
              </div>
            </div>
          </div>
          <div class="px-5 py-4 flex gap-3" style="border-top:1px solid rgba(255,255,255,0.06);">
            <button @click="showEditForm = false" class="flex-1 py-2.5 rounded-xl text-sm font-medium" style="background:rgba(255,255,255,0.05); color:#64748b; border:1px solid rgba(255,255,255,0.06);">Cancelar</button>
            <button @click="salvarEdicao" :disabled="saving" class="flex-1 py-2.5 rounded-xl text-sm font-semibold hover:brightness-110 disabled:opacity-50" style="background:linear-gradient(135deg,#6366f1,#818cf8); color:#fff;">
              {{ saving ? 'Salvando...' : 'Salvar alterações' }}
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>

  <!-- ===== MODAL NOVO AGENDAMENTO ===== -->
  <Teleport to="body">
    <Transition name="fade">
      <div
        v-if="showForm"
        class="fixed inset-0 z-50 flex items-center justify-center p-4"
        style="background:rgba(0,0,0,0.7); backdrop-filter:blur(4px);"
        @click.self="showForm = false"
      >
        <div class="w-full max-w-lg rounded-2xl overflow-hidden flex flex-col max-h-[90vh]" style="background:#0d1526; border:1px solid rgba(255,255,255,0.08);">
          <div class="flex items-center justify-between px-5 py-4" style="border-bottom:1px solid rgba(255,255,255,0.06);">
            <h3 class="text-base font-semibold text-white">Novo Agendamento</h3>
            <button @click="showForm = false; resetForm()" style="color:#64748b;" class="hover:text-white transition-colors">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
            </button>
          </div>
          <div class="overflow-y-auto px-5 py-4 space-y-4 flex-1">
            <div v-if="erro" class="px-3 py-2.5 rounded-xl text-xs" style="background:rgba(239,68,68,0.12); color:#f87171; border:1px solid rgba(239,68,68,0.2);">{{ erro }}</div>
            <div>
              <label class="block text-xs font-medium mb-1.5" style="color:#94a3b8;">Título *</label>
              <input v-model="form.titulo" type="text" placeholder="Ex: Instalação de motor de portão" class="w-full px-3 py-2.5 rounded-xl text-sm outline-none" style="background:#1e293b; color:#e2e8f0; border:1px solid rgba(255,255,255,0.08);" />
            </div>
            <div>
              <label class="block text-xs font-medium mb-1.5" style="color:#94a3b8;">Descrição</label>
              <textarea v-model="form.descricao" rows="2" placeholder="Detalhes do serviço..." class="w-full px-3 py-2.5 rounded-xl text-sm outline-none resize-none" style="background:#1e293b; color:#e2e8f0; border:1px solid rgba(255,255,255,0.08);" />
            </div>
            <div class="grid grid-cols-2 gap-3">
              <div class="col-span-2">
                <label class="block text-xs font-medium mb-1.5" style="color:#94a3b8;">Serviço</label>
                <select v-model="form.servico_id" class="w-full px-3 py-2.5 rounded-xl text-sm outline-none" style="background:#1e293b; color:#e2e8f0; border:1px solid rgba(255,255,255,0.08);">
                  <option value="">— Selecionar serviço —</option>
                  <option v-for="sv in servicos" :key="sv.id" :value="sv.id">{{ sv.nome }}</option>
                </select>
              </div>
              <div>
                <label class="block text-xs font-medium mb-1.5" style="color:#94a3b8;">Data *</label>
                <input v-model="form.data_servico" type="date" class="w-full px-3 py-2.5 rounded-xl text-sm outline-none" style="background:#1e293b; color:#e2e8f0; border:1px solid rgba(255,255,255,0.08);" />
              </div>
              <div>
                <label class="block text-xs font-medium mb-1.5" style="color:#94a3b8;">Horário *</label>
                <input v-model="form.horario" type="time" class="w-full px-3 py-2.5 rounded-xl text-sm outline-none" style="background:#1e293b; color:#e2e8f0; border:1px solid rgba(255,255,255,0.08);" />
              </div>
            </div>
            <div>
              <label class="block text-xs font-medium mb-2" style="color:#94a3b8;">Cliente</label>
              <div class="flex gap-2 mb-3">
                <button @click="form.clienteTipo = 'avulso'" class="flex-1 py-2 rounded-xl text-xs font-medium transition-all" :style="form.clienteTipo === 'avulso' ? 'background:rgba(99,102,241,0.2); color:#a5b4fc; border:1px solid rgba(99,102,241,0.4);' : 'background:rgba(255,255,255,0.04); color:#64748b; border:1px solid rgba(255,255,255,0.06);'">Novo / Avulso</button>
                <button @click="form.clienteTipo = 'registrado'" class="flex-1 py-2 rounded-xl text-xs font-medium transition-all" :style="form.clienteTipo === 'registrado' ? 'background:rgba(99,102,241,0.2); color:#a5b4fc; border:1px solid rgba(99,102,241,0.4);' : 'background:rgba(255,255,255,0.04); color:#64748b; border:1px solid rgba(255,255,255,0.06);'">Cliente Registrado</button>
              </div>
              <div v-if="form.clienteTipo === 'avulso'" class="space-y-3">
                <div class="grid grid-cols-2 gap-3">
                  <div class="col-span-2">
                    <label class="block text-xs font-medium mb-1.5" style="color:#94a3b8;">Nome *</label>
                    <input v-model="form.nome" type="text" placeholder="Nome completo" class="w-full px-3 py-2.5 rounded-xl text-sm outline-none" style="background:#1e293b; color:#e2e8f0; border:1px solid rgba(255,255,255,0.08);" />
                  </div>
                  <div>
                    <label class="block text-xs font-medium mb-1.5" style="color:#94a3b8;">Telefone *</label>
                    <input v-model="form.telefone" type="tel" placeholder="(11) 99999-9999" class="w-full px-3 py-2.5 rounded-xl text-sm outline-none" style="background:#1e293b; color:#e2e8f0; border:1px solid rgba(255,255,255,0.08);" />
                  </div>
                  <div>
                    <label class="block text-xs font-medium mb-1.5" style="color:#94a3b8;">Bairro *</label>
                    <input v-model="form.bairro" type="text" placeholder="Bairro" class="w-full px-3 py-2.5 rounded-xl text-sm outline-none" style="background:#1e293b; color:#e2e8f0; border:1px solid rgba(255,255,255,0.08);" />
                  </div>
                  <div class="col-span-2">
                    <label class="block text-xs font-medium mb-1.5" style="color:#94a3b8;">E-mail <span style="color:#475569;">(opcional)</span></label>
                    <input v-model="form.email" type="email" placeholder="email@exemplo.com" class="w-full px-3 py-2.5 rounded-xl text-sm outline-none" style="background:#1e293b; color:#e2e8f0; border:1px solid rgba(255,255,255,0.08);" />
                  </div>
                </div>
              </div>
              <div v-else class="space-y-3">
                <div class="flex gap-2">
                  <input v-model="form.clienteEmail" type="email" placeholder="E-mail do cliente cadastrado" class="flex-1 px-3 py-2.5 rounded-xl text-sm outline-none" style="background:#1e293b; color:#e2e8f0; border:1px solid rgba(255,255,255,0.08);" @keyup.enter="buscarClienteRegistrado" />
                  <button @click="buscarClienteRegistrado" :disabled="buscandoCliente" class="px-4 py-2.5 rounded-xl text-sm font-medium" style="background:rgba(99,102,241,0.2); color:#a5b4fc; border:1px solid rgba(99,102,241,0.3);">{{ buscandoCliente ? '...' : 'Buscar' }}</button>
                </div>
                <div v-if="form.clienteEncontrado" class="px-3 py-2.5 rounded-xl text-xs" style="background:rgba(34,197,94,0.1); color:#4ade80; border:1px solid rgba(34,197,94,0.2);">✓ {{ form.clienteEncontrado.full_name ?? form.clienteEncontrado.email }}</div>
                <div v-else-if="form.clienteEmail && !buscandoCliente && form.clienteEncontrado === null" class="text-xs" style="color:#f87171;">Cliente não encontrado com esse e-mail.</div>
              </div>
            </div>
          </div>
          <div class="px-5 py-4 flex gap-3" style="border-top:1px solid rgba(255,255,255,0.06);">
            <button @click="showForm = false; resetForm()" class="flex-1 py-2.5 rounded-xl text-sm font-medium" style="background:rgba(255,255,255,0.05); color:#64748b; border:1px solid rgba(255,255,255,0.06);">Cancelar</button>
            <button @click="salvar" :disabled="saving" class="flex-1 py-2.5 rounded-xl text-sm font-semibold hover:brightness-110 disabled:opacity-50" style="background:linear-gradient(135deg,#6366f1,#818cf8); color:#fff;">{{ saving ? 'Salvando...' : 'Criar Agendamento' }}</button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.2s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
