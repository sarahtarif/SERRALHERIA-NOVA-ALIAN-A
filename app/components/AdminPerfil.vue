<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useAdminAuth } from '~/composables/useAdminAuth'
import { useSupabase } from '~/composables/useSupabase'

const emit = defineEmits<{ close: [] }>()

const { adminUser } = useAdminAuth()
const supabase = useSupabase()

const saving = ref(false)
const savingPassword = ref(false)
const successMsg = ref('')
const errorMsg = ref('')
const role = ref('editor')
const currentRole = ref('editor')
const isSuperAdmin = ref(false)
const passwordForm = ref({ newPassword: '', confirmPassword: '' })
const showPassword = ref(false)

// Gerenciar admins
const admins = ref<{ id: string; email: string; role: string }[]>([])
const showNovoAdmin = ref(false)
const savingAdmin = ref(false)
const novoAdmin = ref({ email: '', password: '', role: 'editor' })

const ROLE_LABELS: Record<string, string> = {
  super_admin: 'Super Admin',
  editor: 'Editor',
  viewer: 'Visualizador',
}

onMounted(async () => {
  if (!adminUser.value) return
  const { data } = await supabase
    .from('admins')
    .select('role')
    .eq('id', adminUser.value.id)
    .maybeSingle()
  if (data) {
    role.value = data.role
    currentRole.value = data.role
    isSuperAdmin.value = data.role === 'super_admin'
    if (data.role === 'super_admin') await carregarAdmins()
  }
})

async function carregarAdmins() {
  // Busca todos os admins com email via join na view auth.users (não disponível client-side)
  // Usamos a tabela admins + buscamos emails via users públicos se existirem
  const { data } = await supabase.from('admins').select('id, role')
  if (!data) return
  // Para cada admin, tenta buscar o email na tabela users (perfil público)
  const comEmail = await Promise.all(
    data.map(async (a) => {
      const { data: u } = await supabase.from('users').select('email').eq('id', a.id).maybeSingle()
      return { id: a.id, email: u?.email ?? '(sem email)', role: a.role }
    })
  )
  admins.value = comEmail
}

async function criarAdmin() {
  if (!novoAdmin.value.email || !novoAdmin.value.password) {
    showToast('Preencha e-mail e senha.', true)
    return
  }
  savingAdmin.value = true
  try {
    await $fetch('/api/admin/criar', {
      method: 'POST',
      body: {
        email: novoAdmin.value.email,
        password: novoAdmin.value.password,
        role: novoAdmin.value.role,
      },
    })
    showToast('Admin criado com sucesso!')
    showNovoAdmin.value = false
    novoAdmin.value = { email: '', password: '', role: 'editor' }
    await carregarAdmins()
  } catch (e: unknown) {
    const msg = (e as { data?: { message?: string } })?.data?.message ?? 'Erro ao criar admin.'
    showToast(msg, true)
  } finally {
    savingAdmin.value = false
  }
}

async function removerAdmin(id: string) {
  if (id === adminUser.value?.id) { showToast('Você não pode remover a si mesmo.', true); return }
  await supabase.from('admins').delete().eq('id', id)
  await carregarAdmins()
  showToast('Admin removido.')
}

async function atualizarRoleAdmin(id: string, novoRole: string) {
  await supabase.from('admins').update({ role: novoRole }).eq('id', id)
  await carregarAdmins()
  showToast('Nível de acesso atualizado.')
}

function showToast(msg: string, isError = false): void {
  if (isError) { errorMsg.value = msg; setTimeout(() => { errorMsg.value = '' }, 3500) }
  else { successMsg.value = msg; setTimeout(() => { successMsg.value = '' }, 3500) }
}

async function saveRole(): Promise<void> {
  if (!adminUser.value) return
  saving.value = true
  const { error } = await supabase.from('admins').update({ role: role.value }).eq('id', adminUser.value.id)
  saving.value = false
  if (error) showToast('Erro ao salvar nível de acesso.', true)
  else { currentRole.value = role.value; showToast('Nível de acesso atualizado!') }
}

async function savePassword(): Promise<void> {
  if (passwordForm.value.newPassword.length < 8) { showToast('A senha deve ter pelo menos 8 caracteres.', true); return }
  if (passwordForm.value.newPassword !== passwordForm.value.confirmPassword) { showToast('As senhas não coincidem.', true); return }
  savingPassword.value = true
  const { error } = await supabase.auth.updateUser({ password: passwordForm.value.newPassword })
  savingPassword.value = false
  if (error) showToast('Erro ao alterar senha.', true)
  else { showToast('Senha alterada com sucesso!'); passwordForm.value = { newPassword: '', confirmPassword: '' } }
}
</script>

<template>
  <!-- Overlay centralizado -->
  <Teleport to="body">
    <div
      id="admin-perfil-overlay"
      class="fixed inset-0 z-50 flex items-center justify-center p-4"
      style="background: rgba(0,0,0,0.75); backdrop-filter: blur(4px);"
      @click.self="emit('close')"
    >
      <!-- Toasts -->
      <Transition name="toast">
        <div v-if="successMsg" class="fixed bottom-6 right-6 z-[60] flex items-center gap-3 px-5 py-3.5 rounded-xl shadow-2xl pointer-events-none"
          style="background: #1a2235; border: 1px solid rgba(99,179,237,0.3);">
          <div class="w-7 h-7 rounded-full flex items-center justify-center shrink-0" style="background: rgba(72,187,120,0.15);">
            <svg class="w-4 h-4" style="color:#68d391" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/>
            </svg>
          </div>
          <span class="text-sm font-medium" style="color:#e2e8f0">{{ successMsg }}</span>
        </div>
      </Transition>
      <Transition name="toast">
        <div v-if="errorMsg" class="fixed bottom-6 right-6 z-[60] flex items-center gap-3 px-5 py-3.5 rounded-xl shadow-2xl pointer-events-none"
          style="background: #1a2235; border: 1px solid rgba(252,129,129,0.3);">
          <div class="w-7 h-7 rounded-full flex items-center justify-center shrink-0" style="background: rgba(252,129,129,0.15);">
            <svg class="w-4 h-4" style="color:#fc8181" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </div>
          <span class="text-sm font-medium" style="color:#e2e8f0">{{ errorMsg }}</span>
        </div>
      </Transition>

      <!-- Modal -->
      <div
        class="relative w-full max-w-md rounded-2xl overflow-hidden shadow-2xl"
        style="background: #0f172a; border: 1px solid rgba(99,179,237,0.12);"
      >
        <!-- Faixa decorativa topo -->
        <div class="h-1 w-full" style="background: linear-gradient(90deg, #6366f1, #818cf8, #a5b4fc);"/>

        <!-- Header -->
        <div class="flex items-center justify-between px-6 py-5" style="border-bottom: 1px solid rgba(255,255,255,0.06);">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl flex items-center justify-center" style="background: linear-gradient(135deg,#6366f1,#818cf8);">
              <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
              </svg>
            </div>
            <div>
              <h2 class="font-semibold text-base" style="color:#f1f5f9">Meu Perfil</h2>
              <p class="text-xs truncate max-w-[220px]" style="color:#64748b">{{ adminUser?.email }}</p>
            </div>
          </div>
          <button
            class="w-8 h-8 rounded-lg flex items-center justify-center transition-colors"
            style="color:#64748b"
            @mouseenter="($event.target as HTMLElement).style.background='rgba(255,255,255,0.06)'"
            @mouseleave="($event.target as HTMLElement).style.background='transparent'"
            @click="emit('close')"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>

        <!-- Corpo com scroll -->
        <div class="px-6 py-5 space-y-6 overflow-y-auto" style="max-height: calc(90vh - 120px);">

          <!-- Nível de acesso -->
          <div class="space-y-3">
            <p class="text-xs font-semibold uppercase tracking-widest" style="color:#6366f1">Nível de Acesso</p>

            <!-- Não é super_admin -->
            <div v-if="!isSuperAdmin" class="flex items-center gap-3 p-3.5 rounded-xl" style="background:#1e293b; border:1px solid rgba(255,255,255,0.06);">
              <svg class="w-4 h-4 shrink-0" style="color:#475569" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
              </svg>
              <div>
                <p class="text-sm font-medium" style="color:#cbd5e1">{{ ROLE_LABELS[currentRole] }}</p>
                <p class="text-xs mt-0.5" style="color:#475569">Apenas Super Admins podem alterar o nível de acesso.</p>
              </div>
            </div>

            <!-- É super_admin -->
            <template v-else>
              <div class="space-y-2">
                <label
                  v-for="(label, value) in ROLE_LABELS"
                  :key="value"
                  class="flex items-center gap-3 p-3.5 rounded-xl cursor-pointer transition-all"
                  :style="role === value
                    ? 'background:#1e1b4b; border:1px solid rgba(99,102,241,0.5);'
                    : 'background:#1e293b; border:1px solid rgba(255,255,255,0.06);'"
                >
                  <input v-model="role" type="radio" :value="value" class="accent-indigo-500 w-4 h-4" />
                  <div>
                    <p class="text-sm font-medium" style="color:#e2e8f0">{{ label }}</p>
                    <p class="text-xs mt-0.5" style="color:#64748b">
                      <span v-if="value === 'super_admin'">Acesso total ao sistema</span>
                      <span v-else-if="value === 'editor'">Pode criar e editar conteúdo</span>
                      <span v-else>Apenas visualização</span>
                    </p>
                  </div>
                </label>
              </div>

              <button
                :disabled="saving || role === currentRole"
                class="w-full py-2.5 rounded-xl text-sm font-semibold transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                style="background: linear-gradient(135deg,#6366f1,#818cf8); color:white;"
                @click="saveRole"
              >
                {{ saving ? 'Salvando...' : 'Salvar Nível de Acesso' }}
              </button>
            </template>
          </div>

          <!-- Divisor -->
          <div style="border-top: 1px solid rgba(255,255,255,0.06);" />

          <!-- Gerenciar Admins — só super_admin -->
          <div v-if="isSuperAdmin" class="space-y-3">
            <div class="flex items-center justify-between">
              <p class="text-xs font-semibold uppercase tracking-widest" style="color:#6366f1">Administradores</p>
              <button
                @click="showNovoAdmin = !showNovoAdmin"
                class="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
                style="background:rgba(99,102,241,0.15); color:#a5b4fc; border:1px solid rgba(99,102,241,0.3);"
              >
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4"/>
                </svg>
                Novo admin
              </button>
            </div>

            <!-- Formulário novo admin -->
            <div v-if="showNovoAdmin" class="rounded-xl p-4 space-y-3" style="background:#1e293b; border:1px solid rgba(99,102,241,0.2);">
              <div>
                <label class="block text-xs mb-1" style="color:#94a3b8;">E-mail</label>
                <input
                  v-model="novoAdmin.email"
                  type="email"
                  placeholder="admin@empresa.com"
                  class="w-full px-3 py-2.5 rounded-lg text-sm outline-none"
                  style="background:#0f172a; color:#e2e8f0; border:1px solid rgba(255,255,255,0.08);"
                />
              </div>
              <div>
                <label class="block text-xs mb-1" style="color:#94a3b8;">Senha inicial</label>
                <input
                  v-model="novoAdmin.password"
                  type="password"
                  placeholder="Mínimo 8 caracteres"
                  class="w-full px-3 py-2.5 rounded-lg text-sm outline-none"
                  style="background:#0f172a; color:#e2e8f0; border:1px solid rgba(255,255,255,0.08);"
                />
              </div>
              <div>
                <label class="block text-xs mb-1" style="color:#94a3b8;">Nível de acesso</label>
                <select
                  v-model="novoAdmin.role"
                  class="w-full px-3 py-2.5 rounded-lg text-sm outline-none"
                  style="background:#0f172a; color:#e2e8f0; border:1px solid rgba(255,255,255,0.08);"
                >
                  <option v-for="(label, val) in ROLE_LABELS" :key="val" :value="val">{{ label }}</option>
                </select>
              </div>
              <div class="flex gap-2 pt-1">
                <button
                  @click="showNovoAdmin = false; novoAdmin = { email: '', password: '', role: 'editor' }"
                  class="flex-1 py-2 rounded-lg text-xs font-medium"
                  style="background:rgba(255,255,255,0.04); color:#64748b; border:1px solid rgba(255,255,255,0.06);"
                >Cancelar</button>
                <button
                  @click="criarAdmin"
                  :disabled="savingAdmin"
                  class="flex-1 py-2 rounded-lg text-xs font-semibold disabled:opacity-50"
                  style="background:linear-gradient(135deg,#6366f1,#818cf8); color:#fff;"
                >{{ savingAdmin ? 'Criando...' : 'Criar admin' }}</button>
              </div>
            </div>

            <!-- Lista de admins existentes -->
            <div class="space-y-2">
              <div
                v-for="a in admins"
                :key="a.id"
                class="flex items-center gap-3 px-3 py-2.5 rounded-xl"
                style="background:#1e293b; border:1px solid rgba(255,255,255,0.05);"
              >
                <div class="w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-xs font-bold text-white" style="background:linear-gradient(135deg,#6366f1,#818cf8);">
                  {{ a.email.charAt(0).toUpperCase() }}
                </div>
                <div class="flex-1 min-w-0">
                  <p class="text-xs font-medium truncate" style="color:#e2e8f0;">{{ a.email }}</p>
                  <p class="text-[10px] mt-0.5" style="color:#475569;">
                    {{ a.id === adminUser?.id ? 'Você · ' : '' }}{{ ROLE_LABELS[a.role] ?? a.role }}
                  </p>
                </div>
                <!-- Alterar role inline -->
                <select
                  v-if="a.id !== adminUser?.id"
                  :value="a.role"
                  @change="atualizarRoleAdmin(a.id, ($event.target as HTMLSelectElement).value)"
                  class="text-xs px-2 py-1 rounded-lg outline-none cursor-pointer"
                  style="background:#0f172a; color:#94a3b8; border:1px solid rgba(255,255,255,0.08);"
                >
                  <option v-for="(label, val) in ROLE_LABELS" :key="val" :value="val">{{ label }}</option>
                </select>
                <!-- Remover -->
                <button
                  v-if="a.id !== adminUser?.id"
                  @click="removerAdmin(a.id)"
                  class="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition-colors"
                  style="color:#475569;"
                  title="Remover admin"
                >
                  <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                  </svg>
                </button>
              </div>
            </div>
          </div>

          <!-- Divisor -->
          <div style="border-top: 1px solid rgba(255,255,255,0.06);" />

          <!-- Alterar senha -->
          <div class="space-y-3">
            <p class="text-xs font-semibold uppercase tracking-widest" style="color:#6366f1">Alterar Senha</p>

            <div>
              <label class="block text-xs mb-1.5" style="color:#94a3b8">Nova senha</label>
              <div class="relative">
                <input
                  v-model="passwordForm.newPassword"
                  :type="showPassword ? 'text' : 'password'"
                  placeholder="Mínimo 8 caracteres"
                  class="w-full px-4 py-3 pr-11 rounded-xl text-sm outline-none transition-all"
                  style="background:#1e293b; border:1px solid rgba(255,255,255,0.08); color:#e2e8f0;"
                  @focus="($event.target as HTMLElement).style.borderColor='rgba(99,102,241,0.6)'"
                  @blur="($event.target as HTMLElement).style.borderColor='rgba(255,255,255,0.08)'"
                />
                <button type="button" class="absolute right-3 top-1/2 -translate-y-1/2 transition-colors" style="color:#475569" @click="showPassword = !showPassword">
                  <svg v-if="!showPassword" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                    <path stroke-linecap="round" stroke-linejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                  </svg>
                  <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"/>
                  </svg>
                </button>
              </div>
            </div>

            <div>
              <label class="block text-xs mb-1.5" style="color:#94a3b8">Confirmar nova senha</label>
              <input
                v-model="passwordForm.confirmPassword"
                :type="showPassword ? 'text' : 'password'"
                placeholder="••••••••"
                class="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all"
                style="background:#1e293b; border:1px solid rgba(255,255,255,0.08); color:#e2e8f0;"
                @focus="($event.target as HTMLElement).style.borderColor='rgba(99,102,241,0.6)'"
                @blur="($event.target as HTMLElement).style.borderColor='rgba(255,255,255,0.08)'"
              />
            </div>

            <button
              :disabled="savingPassword"
              class="w-full py-2.5 rounded-xl text-sm font-semibold transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              style="background:transparent; border:1px solid rgba(99,102,241,0.5); color:#818cf8;"
              @mouseenter="($event.target as HTMLElement).style.background='rgba(99,102,241,0.12)'"
              @mouseleave="($event.target as HTMLElement).style.background='transparent'"
              @click="savePassword"
            >
              {{ savingPassword ? 'Alterando...' : 'Alterar Senha' }}
            </button>
          </div>

        </div>
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
.toast-enter-active { transition: all 0.3s cubic-bezier(0.34,1.56,0.64,1); }
.toast-leave-active { transition: all 0.25s ease; }
.toast-enter-from { opacity: 0; transform: translateY(12px) scale(0.95); }
.toast-leave-to { opacity: 0; transform: translateY(8px); }
</style>
