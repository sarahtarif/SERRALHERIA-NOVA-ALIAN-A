<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useSupabase } from '~/composables/useSupabase'
import AdminInfoBox from '~/components/AdminInfoBox.vue'

interface Servico {
  id: string
  nome: string
  descricao: string | null
  ativo: boolean
  created_at: string
}

const supabase = useSupabase()
const servicos = ref<Servico[]>([])
const loading = ref(true)
const saving = ref(false)
const erro = ref('')
const sucesso = ref('')

// Permissão
const adminRole = ref<string | null>(null)
const podeEditar = computed(() => adminRole.value === 'super_admin' || adminRole.value === 'editor')

// Modal criar/editar
const showModal = ref(false)
const editando = ref<Servico | null>(null)
const form = ref({ nome: '', descricao: '' })
const formErro = ref('')

// Confirmação de toggle
const confirmandoToggle = ref<Servico | null>(null)

async function carregar(): Promise<void> {
  loading.value = true
  try {
    const { data: { session } } = await supabase.auth.getSession()
    const headers: Record<string, string> = session?.access_token
      ? { Authorization: 'Bearer ' + session.access_token }
      : {}
    const res = await $fetch<{ servicos: Servico[] }>('/api/admin/servicos', { headers })
    servicos.value = res.servicos
  } catch (e: unknown) {
    erro.value = (e as { data?: { message?: string } })?.data?.message ?? 'Erro ao carregar.'
  } finally {
    loading.value = false
  }
}

function abrirCriar(): void {
  editando.value = null
  form.value = { nome: '', descricao: '' }
  formErro.value = ''
  showModal.value = true
}

function abrirEditar(s: Servico): void {
  editando.value = s
  form.value = { nome: s.nome, descricao: s.descricao ?? '' }
  formErro.value = ''
  showModal.value = true
}

async function salvar(): Promise<void> {
  formErro.value = ''
  if (!form.value.nome.trim()) { formErro.value = 'Nome é obrigatório.'; return }
  saving.value = true
  try {
    const { data: { session } } = await supabase.auth.getSession()
    const headers: Record<string, string> = session?.access_token
      ? { Authorization: 'Bearer ' + session.access_token }
      : {}
    if (editando.value) {
      await $fetch('/api/admin/servicos/' + editando.value.id, {
        method: 'PATCH', headers,
        body: { nome: form.value.nome.trim(), descricao: form.value.descricao.trim() || null },
      })
      sucesso.value = 'Serviço atualizado!'
    } else {
      await $fetch('/api/admin/servicos', {
        method: 'POST', headers,
        body: { nome: form.value.nome.trim(), descricao: form.value.descricao.trim() || null, ativo: true },
      })
      sucesso.value = 'Serviço criado!'
    }
    showModal.value = false
    await carregar()
    setTimeout(() => { sucesso.value = '' }, 3000)
  } catch (e: unknown) {
    formErro.value = (e as { data?: { message?: string } })?.data?.message ?? 'Erro ao salvar.'
  } finally {
    saving.value = false
  }
}

async function toggleAtivo(s: Servico): Promise<void> {
  confirmandoToggle.value = null
  try {
    const { data: { session } } = await supabase.auth.getSession()
    const headers: Record<string, string> = session?.access_token
      ? { Authorization: 'Bearer ' + session.access_token }
      : {}
    await $fetch('/api/admin/servicos/' + s.id, {
      method: 'PATCH', headers,
      body: { ativo: !s.ativo },
    })
    sucesso.value = s.ativo ? 'Serviço desativado.' : 'Serviço ativado!'
    await carregar()
    setTimeout(() => { sucesso.value = '' }, 3000)
  } catch (e: unknown) {
    erro.value = (e as { data?: { message?: string } })?.data?.message ?? 'Erro ao atualizar.'
  }
}

onMounted(async () => {
  const { data: { user } } = await supabase.auth.getUser()
  if (user) {
    const { data: ar } = await supabase.from('admins').select('role').eq('id', user.id).maybeSingle()
    adminRole.value = ar?.role ?? null
  }
  await carregar()
})
</script>

<template>
  <div id="admin-servicos" class="flex-1 overflow-y-auto px-4 py-6">
    <div class="max-w-3xl mx-auto space-y-6">

      <AdminInfoBox
        titulo="Como usar: Catálogo de Serviços"
        :itens="[
          'Gerencie os serviços disponíveis para agendamento e seleção no sistema.',
          'Serviços <strong style=&quot;color:#4ade80;&quot;>ativos</strong> aparecem nos selects de agendamento e em todo o sistema.',
          'Serviços <strong style=&quot;color:#f87171;&quot;>inativos</strong> ficam ocultos para seleção mas preservam o histórico de agendamentos vinculados.',
          'Clique em <strong style=&quot;color:#c7d2fe;&quot;>+ Novo Serviço</strong> para adicionar um serviço ao catálogo.',
          'Use o botão de edição para alterar nome ou descrição de um serviço existente.',
        ]"
      />

      <div class="flex items-center justify-between">
        <div>
          <h2 class="text-xl font-bold text-white">Catálogo de Serviços</h2>
          <p class="text-sm mt-0.5" style="color:#475569;">Gerencie os serviços disponíveis no sistema</p>
        </div>
        <button
          v-if="podeEditar"
          class="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all hover:brightness-110"
          style="background:linear-gradient(135deg,#6366f1,#818cf8); color:#fff;"
          @click="abrirCriar"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4"/>
          </svg>
          Novo Serviço
        </button>
      </div>

      <div v-if="sucesso" class="px-4 py-3 rounded-xl text-sm font-medium" style="background:rgba(34,197,94,0.12); color:#4ade80; border:1px solid rgba(34,197,94,0.2);">
        {{ sucesso }}
      </div>
      <div v-if="erro" class="px-4 py-3 rounded-xl text-sm font-medium" style="background:rgba(239,68,68,0.12); color:#f87171; border:1px solid rgba(239,68,68,0.2);">
        {{ erro }}
      </div>

      <div v-if="loading" class="space-y-3">
        <div v-for="i in 4" :key="i" class="h-16 rounded-2xl animate-pulse" style="background:#0d1526;" />
      </div>

      <div v-else class="space-y-3">
        <div
          v-for="s in servicos"
          :key="s.id"
          class="flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all"
          :style="s.ativo
            ? 'background:#0d1526; border:1px solid rgba(255,255,255,0.06);'
            : 'background:rgba(13,21,38,0.5); border:1px solid rgba(255,255,255,0.03); opacity:0.65;'"
        >
          <!-- Status dot -->
          <div
            class="w-2.5 h-2.5 rounded-full shrink-0"
            :style="s.ativo ? 'background:#4ade80; box-shadow:0 0 6px #4ade8066;' : 'background:#475569;'"
          />

          <!-- Info -->
          <div class="flex-1 min-w-0">
            <p class="text-sm font-semibold text-white truncate">{{ s.nome }}</p>
            <p v-if="s.descricao" class="text-xs truncate mt-0.5" style="color:#64748b;">{{ s.descricao }}</p>
          </div>

          <!-- Badge status -->
          <span
            class="text-xs px-2 py-0.5 rounded-full font-medium shrink-0"
            :style="s.ativo
              ? 'background:rgba(34,197,94,0.12); color:#4ade80; border:1px solid rgba(34,197,94,0.2);'
              : 'background:rgba(71,85,105,0.2); color:#64748b; border:1px solid rgba(71,85,105,0.3);'"
          >{{ s.ativo ? 'Ativo' : 'Inativo' }}</span>

          <!-- Ações -->
          <div v-if="podeEditar" class="flex items-center gap-1.5 shrink-0">
            <button
              @click="abrirEditar(s)"
              class="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all"
              style="background:rgba(99,102,241,0.12); color:#a5b4fc; border:1px solid rgba(99,102,241,0.25);"
              title="Editar"
            >
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
              </svg>
              Editar
            </button>
            <button
              @click="confirmandoToggle = s"
              class="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all"
              :style="s.ativo
                ? 'background:rgba(239,68,68,0.1); color:#f87171; border:1px solid rgba(239,68,68,0.2);'
                : 'background:rgba(34,197,94,0.1); color:#4ade80; border:1px solid rgba(34,197,94,0.2);'"
              :title="s.ativo ? 'Desativar' : 'Ativar'"
            >
              <svg v-if="s.ativo" class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"/>
              </svg>
              <svg v-else class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/>
              </svg>
              {{ s.ativo ? 'Desativar' : 'Ativar' }}
            </button>
          </div>
        </div>

        <div v-if="!servicos.length" class="text-center py-12">
          <p class="text-sm" style="color:#475569;">Nenhum serviço cadastrado ainda.</p>
        </div>
      </div>

    </div>
  </div>

  <!-- Modal criar/editar -->
  <Teleport to="body">
    <Transition name="fade">
      <div
        v-if="showModal"
        class="fixed inset-0 z-50 flex items-center justify-center p-4"
        style="background:rgba(0,0,0,0.7); backdrop-filter:blur(4px);"
        @click.self="showModal = false"
      >
        <div class="w-full max-w-md rounded-2xl overflow-hidden" style="background:#0d1526; border:1px solid rgba(255,255,255,0.08);">
          <div class="flex items-center justify-between px-5 py-4" style="border-bottom:1px solid rgba(255,255,255,0.06);">
            <h3 class="text-base font-semibold text-white">{{ editando ? 'Editar Serviço' : 'Novo Serviço' }}</h3>
            <button @click="showModal = false" style="color:#64748b;">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
            </button>
          </div>
          <div class="px-5 py-4 space-y-4">
            <div v-if="formErro" class="px-3 py-2.5 rounded-xl text-xs" style="background:rgba(239,68,68,0.12); color:#f87171; border:1px solid rgba(239,68,68,0.2);">{{ formErro }}</div>
            <div>
              <label class="block text-xs font-medium mb-1.5" style="color:#94a3b8;">Nome *</label>
              <input v-model="form.nome" type="text" placeholder="Ex: Automação de Portões" class="w-full px-3 py-2.5 rounded-xl text-sm outline-none" style="background:#1e293b; color:#e2e8f0; border:1px solid rgba(255,255,255,0.08);" />
            </div>
            <div>
              <label class="block text-xs font-medium mb-1.5" style="color:#94a3b8;">Descrição</label>
              <textarea v-model="form.descricao" rows="3" placeholder="Descrição breve do serviço..." class="w-full px-3 py-2.5 rounded-xl text-sm outline-none resize-none" style="background:#1e293b; color:#e2e8f0; border:1px solid rgba(255,255,255,0.08);" />
            </div>
          </div>
          <div class="px-5 py-4 flex gap-3" style="border-top:1px solid rgba(255,255,255,0.06);">
            <button @click="showModal = false" class="flex-1 py-2.5 rounded-xl text-sm font-medium" style="background:rgba(255,255,255,0.05); color:#64748b; border:1px solid rgba(255,255,255,0.06);">Cancelar</button>
            <button @click="salvar" :disabled="saving" class="flex-1 py-2.5 rounded-xl text-sm font-semibold disabled:opacity-50 hover:brightness-110" style="background:linear-gradient(135deg,#6366f1,#818cf8); color:#fff;">
              {{ saving ? 'Salvando...' : editando ? 'Salvar alterações' : 'Criar serviço' }}
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>

  <!-- Confirmar toggle -->
  <Teleport to="body">
    <Transition name="fade">
      <div
        v-if="confirmandoToggle"
        class="fixed inset-0 z-50 flex items-center justify-center p-4"
        style="background:rgba(0,0,0,0.7); backdrop-filter:blur(4px);"
        @click.self="confirmandoToggle = null"
      >
        <div class="w-full max-w-sm rounded-2xl p-6 space-y-4" style="background:#0d1526; border:1px solid rgba(255,255,255,0.08);">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" :style="confirmandoToggle.ativo ? 'background:rgba(239,68,68,0.15);' : 'background:rgba(34,197,94,0.15);'">
              <svg class="w-5 h-5" :style="confirmandoToggle.ativo ? 'color:#f87171;' : 'color:#4ade80;'" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                <path v-if="confirmandoToggle.ativo" stroke-linecap="round" stroke-linejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"/>
                <path v-else stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/>
              </svg>
            </div>
            <div>
              <p class="text-sm font-semibold text-white">{{ confirmandoToggle.ativo ? 'Desativar serviço?' : 'Ativar serviço?' }}</p>
              <p class="text-xs mt-0.5" style="color:#64748b;">
                {{ confirmandoToggle.ativo
                  ? 'O serviço ficará oculto nos selects de agendamento.'
                  : 'O serviço voltará a aparecer nos selects de agendamento.' }}
              </p>
            </div>
          </div>
          <p class="text-sm font-medium" style="color:#94a3b8;">{{ confirmandoToggle.nome }}</p>
          <div class="flex gap-3">
            <button @click="confirmandoToggle = null" class="flex-1 py-2.5 rounded-xl text-sm font-medium" style="background:rgba(255,255,255,0.05); color:#64748b; border:1px solid rgba(255,255,255,0.06);">Cancelar</button>
            <button
              @click="toggleAtivo(confirmandoToggle)"
              class="flex-1 py-2.5 rounded-xl text-sm font-semibold"
              :style="confirmandoToggle.ativo ? 'background:rgba(239,68,68,0.8); color:#fff;' : 'background:rgba(34,197,94,0.8); color:#fff;'"
            >{{ confirmandoToggle.ativo ? 'Sim, desativar' : 'Sim, ativar' }}</button>
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
