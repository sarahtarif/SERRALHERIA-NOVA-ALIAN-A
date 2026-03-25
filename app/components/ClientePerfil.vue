<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useAuth } from '~/composables/useAuth'
import { useSupabase } from '~/composables/useSupabase'

const emit = defineEmits<{ close: [] }>()

const { user } = useAuth()
const supabase = useSupabase()

const saving = ref(false)
const savingPassword = ref(false)
const successMsg = ref('')
const errorMsg = ref('')

const form = ref({
  full_name: '',
  phone: '',
  cep: '',
  street: '',
  number: '',
  complement: '',
  neighborhood: '',
  city: '',
  state: '',
})

const passwordForm = ref({
  newPassword: '',
  confirmPassword: '',
})

const loadingCep = ref(false)

onMounted(async () => {
  if (!user.value) return
  const { data } = await supabase
    .from('users')
    .select('full_name, phone, cep, street, number, complement, neighborhood, city, state')
    .eq('id', user.value.id)
    .maybeSingle()

  if (data) {
    form.value = {
      full_name: data.full_name ?? '',
      phone: data.phone ?? '',
      cep: data.cep ?? '',
      street: data.street ?? '',
      number: data.number ?? '',
      complement: data.complement ?? '',
      neighborhood: data.neighborhood ?? '',
      city: data.city ?? '',
      state: data.state ?? '',
    }
  }
})

async function fetchCep(): Promise<void> {
  const cep = form.value.cep.replace(/\D/g, '')
  if (cep.length !== 8) return

  loadingCep.value = true
  errorMsg.value = ''
  try {
    const res = await $fetch<{ logradouro: string; bairro: string; localidade: string; uf: string; erro?: boolean }>(
      `https://viacep.com.br/ws/${cep}/json/`
    )
    if (res.erro) { errorMsg.value = 'CEP não encontrado.'; return }
    form.value.street = res.logradouro
    form.value.neighborhood = res.bairro
    form.value.city = res.localidade
    form.value.state = res.uf
  } catch {
    errorMsg.value = 'Erro ao buscar CEP.'
  } finally {
    loadingCep.value = false
  }
}

function showToast(msg: string, isError = false): void {
  if (isError) {
    errorMsg.value = msg
    setTimeout(() => { errorMsg.value = '' }, 3500)
  } else {
    successMsg.value = msg
    setTimeout(() => { successMsg.value = '' }, 3500)
  }
}

async function saveProfile(): Promise<void> {
  if (!user.value) return
  saving.value = true

  const { error } = await supabase.from('users').update(form.value).eq('id', user.value.id)
  saving.value = false
  if (error) showToast('Erro ao salvar perfil.', true)
  else showToast('Perfil atualizado com sucesso!')
}

async function savePassword(): Promise<void> {
  if (passwordForm.value.newPassword.length < 6) { showToast('A senha deve ter pelo menos 6 caracteres.', true); return }
  if (passwordForm.value.newPassword !== passwordForm.value.confirmPassword) { showToast('As senhas não coincidem.', true); return }

  savingPassword.value = true
  const { error } = await supabase.auth.updateUser({ password: passwordForm.value.newPassword })
  savingPassword.value = false

  if (error) showToast('Erro ao alterar senha.', true)
  else {
    showToast('Senha alterada com sucesso!')
    passwordForm.value = { newPassword: '', confirmPassword: '' }
  }
}
</script>

<template>
  <div id="cliente-perfil-overlay" class="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4" @click.self="emit('close')">

    <!-- Toast sucesso — fixo no canto, fora do scroll -->
    <Transition name="toast">
      <div
        v-if="successMsg"
        class="fixed bottom-6 right-6 z-[60] flex items-center gap-3 px-5 py-4 rounded-xl bg-surface-container-highest border border-primary/40 shadow-2xl pointer-events-none"
      >
        <div class="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
          <svg class="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/>
          </svg>
        </div>
        <span class="text-on-surface text-sm font-medium">{{ successMsg }}</span>
      </div>
    </Transition>

    <!-- Toast erro -->
    <Transition name="toast">
      <div
        v-if="errorMsg"
        class="fixed bottom-6 right-6 z-[60] flex items-center gap-3 px-5 py-4 rounded-xl bg-surface-container-highest border border-error/40 shadow-2xl pointer-events-none"
      >
        <div class="w-8 h-8 rounded-full bg-error/20 flex items-center justify-center shrink-0">
          <svg class="w-4 h-4 text-error" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </div>
        <span class="text-on-surface text-sm font-medium">{{ errorMsg }}</span>
      </div>
    </Transition>

    <div class="bg-surface-container-low rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto border border-outline-variant shadow-2xl">

      <!-- Header -->
      <div class="flex items-center justify-between px-6 py-5 border-b border-outline-variant bg-surface-container rounded-t-2xl">
        <div class="flex items-center gap-3">
          <div class="w-9 h-9 rounded-full bg-primary flex items-center justify-center">
            <svg class="w-5 h-5 text-on-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
            </svg>
          </div>
          <h2 class="text-on-surface font-semibold text-lg">Meu Perfil</h2>
        </div>
        <button class="text-on-surface-variant hover:text-primary transition-colors p-1 rounded-lg hover:bg-surface-container-high" @click="emit('close')">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </button>
      </div>

      <div class="p-6 space-y-6">

        <!-- Dados pessoais -->
        <div class="space-y-4">
          <h3 class="text-primary font-semibold text-sm uppercase tracking-wider">Dados Pessoais</h3>

          <div>
            <label class="block text-sm text-on-surface-variant mb-1.5">Nome completo</label>
            <input
              v-model="form.full_name"
              type="text"
              placeholder="Seu nome"
              class="w-full px-4 py-3 rounded-lg bg-surface-container border border-outline-variant text-on-surface placeholder-on-surface-variant focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 transition-colors"
            />
          </div>

          <div>
            <label class="block text-sm text-on-surface-variant mb-1.5">Celular / WhatsApp</label>
            <input
              v-model="form.phone"
              type="tel"
              placeholder="(11) 99999-9999"
              class="w-full px-4 py-3 rounded-lg bg-surface-container border border-outline-variant text-on-surface placeholder-on-surface-variant focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 transition-colors"
            />
          </div>

          <div class="flex gap-3">
            <div class="flex-1">
              <label class="block text-sm text-on-surface-variant mb-1.5">CEP</label>
              <div class="relative">
                <input
                  v-model="form.cep"
                  type="text"
                  placeholder="00000-000"
                  maxlength="9"
                  class="w-full px-4 py-3 rounded-lg bg-surface-container border border-outline-variant text-on-surface placeholder-on-surface-variant focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 transition-colors"
                  @blur="fetchCep"
                />
                <span v-if="loadingCep" class="absolute right-3 top-1/2 -translate-y-1/2 text-primary text-xs">buscando...</span>
              </div>
            </div>
            <div class="w-24">
              <label class="block text-sm text-on-surface-variant mb-1.5">Estado</label>
              <input
                v-model="form.state"
                type="text"
                placeholder="SP"
                maxlength="2"
                class="w-full px-4 py-3 rounded-lg bg-surface-container border border-outline-variant text-on-surface placeholder-on-surface-variant focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 transition-colors"
              />
            </div>
          </div>

          <div>
            <label class="block text-sm text-on-surface-variant mb-1.5">Rua / Logradouro</label>
            <input
              v-model="form.street"
              type="text"
              placeholder="Rua..."
              class="w-full px-4 py-3 rounded-lg bg-surface-container border border-outline-variant text-on-surface placeholder-on-surface-variant focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 transition-colors"
            />
          </div>

          <div class="flex gap-3">
            <div class="w-28">
              <label class="block text-sm text-on-surface-variant mb-1.5">Número</label>
              <input
                v-model="form.number"
                type="text"
                placeholder="123"
                class="w-full px-4 py-3 rounded-lg bg-surface-container border border-outline-variant text-on-surface placeholder-on-surface-variant focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 transition-colors"
              />
            </div>
            <div class="flex-1">
              <label class="block text-sm text-on-surface-variant mb-1.5">Complemento</label>
              <input
                v-model="form.complement"
                type="text"
                placeholder="Apto, bloco..."
                class="w-full px-4 py-3 rounded-lg bg-surface-container border border-outline-variant text-on-surface placeholder-on-surface-variant focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 transition-colors"
              />
            </div>
          </div>

          <div class="flex gap-3">
            <div class="flex-1">
              <label class="block text-sm text-on-surface-variant mb-1.5">Bairro</label>
              <input
                v-model="form.neighborhood"
                type="text"
                placeholder="Bairro"
                class="w-full px-4 py-3 rounded-lg bg-surface-container border border-outline-variant text-on-surface placeholder-on-surface-variant focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 transition-colors"
              />
            </div>
            <div class="flex-1">
              <label class="block text-sm text-on-surface-variant mb-1.5">Cidade</label>
              <input
                v-model="form.city"
                type="text"
                placeholder="Cidade"
                class="w-full px-4 py-3 rounded-lg bg-surface-container border border-outline-variant text-on-surface placeholder-on-surface-variant focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 transition-colors"
              />
            </div>
          </div>

          <button
            :disabled="saving"
            class="w-full py-3 rounded-lg bg-primary text-on-primary font-semibold hover:brightness-110 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
            @click="saveProfile"
          >
            {{ saving ? 'Salvando...' : 'Salvar Perfil' }}
          </button>
        </div>

        <div class="border-t border-outline-variant" />

        <!-- Alterar senha -->
        <div class="space-y-4">
          <h3 class="text-primary font-semibold text-sm uppercase tracking-wider">Alterar Senha</h3>

          <div>
            <label class="block text-sm text-on-surface-variant mb-1.5">Nova senha</label>
            <input
              v-model="passwordForm.newPassword"
              type="password"
              placeholder="••••••••"
              class="w-full px-4 py-3 rounded-lg bg-surface-container border border-outline-variant text-on-surface placeholder-on-surface-variant focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 transition-colors"
            />
          </div>
          <div>
            <label class="block text-sm text-on-surface-variant mb-1.5">Confirmar nova senha</label>
            <input
              v-model="passwordForm.confirmPassword"
              type="password"
              placeholder="••••••••"
              class="w-full px-4 py-3 rounded-lg bg-surface-container border border-outline-variant text-on-surface placeholder-on-surface-variant focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 transition-colors"
            />
          </div>

          <button
            :disabled="savingPassword"
            class="w-full py-3 rounded-lg border-2 border-primary text-primary font-semibold hover:bg-primary hover:text-on-primary transition-all disabled:opacity-60 disabled:cursor-not-allowed"
            @click="savePassword"
          >
            {{ savingPassword ? 'Alterando...' : 'Alterar Senha' }}
          </button>
        </div>

      </div>
    </div>
  </div>
</template>

<style scoped>
.toast-enter-active {
  transition: all 0.3s ease;
}
.toast-leave-active {
  transition: all 0.4s ease;
}
.toast-enter-from {
  opacity: 0;
  transform: translateY(1rem);
}
.toast-leave-to {
  opacity: 0;
  transform: translateY(1rem);
}
</style>
