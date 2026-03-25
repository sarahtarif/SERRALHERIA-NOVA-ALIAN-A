<template>
  <div id="login-form" class="w-full max-w-md mx-auto">

    <!-- Abas -->
    <div class="flex border-b border-outline-variant mb-8">
      <button
        class="flex-1 py-3 text-sm font-medium transition-colors duration-200"
        :class="activeTab === 'login'
          ? 'text-primary border-b-2 border-primary'
          : 'text-on-surface-variant hover:text-on-surface'"
        @click="activeTab = 'login'"
      >
        Entrar
      </button>
      <button
        class="flex-1 py-3 text-sm font-medium transition-colors duration-200"
        :class="activeTab === 'register'
          ? 'text-primary border-b-2 border-primary'
          : 'text-on-surface-variant hover:text-on-surface'"
        @click="activeTab = 'register'"
      >
        Criar Conta
      </button>
    </div>

    <!-- Aba Login -->
    <form v-if="activeTab === 'login'" id="form-login" class="space-y-5" @submit.prevent="handleLogin">
      <div>
        <label class="block text-sm font-medium text-on-surface mb-1.5">E-mail</label>
        <input
          v-model="loginEmail"
          type="email"
          placeholder="seu@email.com"
          autocomplete="email"
          class="w-full px-4 py-3 rounded-lg bg-surface-container border border-outline-variant text-on-surface placeholder-on-surface-variant focus:outline-none focus:border-primary transition-colors"
        />
      </div>
      <div>
        <label class="block text-sm font-medium text-on-surface mb-1.5">Senha</label>
        <div class="relative">
          <input
            v-model="loginPassword"
            :type="showLoginPassword ? 'text' : 'password'"
            placeholder="••••••••"
            class="w-full px-4 py-3 pr-12 rounded-lg bg-surface-container border border-outline-variant text-on-surface placeholder-on-surface-variant focus:outline-none focus:border-primary transition-colors"
          />
          <button
            type="button"
            class="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface transition-colors"
            @click="showLoginPassword = !showLoginPassword"
          >
            <svg v-if="showLoginPassword" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
              <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/>
              <line x1="1" y1="1" x2="23" y2="23"/>
            </svg>
            <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
              <circle cx="12" cy="12" r="3"/>
            </svg>
          </button>
        </div>
      </div>
      <!-- Erro -->
      <div v-if="error" class="text-sm text-red-400 bg-red-400/10 border border-red-400/20 rounded-lg px-4 py-3">
        {{ error }}
      </div>

      <button
        type="submit"
        :disabled="loading"
        class="w-full py-3 rounded-lg bg-primary text-on-primary font-medium hover:bg-primary/90 transition-colors duration-200 mt-2 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        <svg v-if="loading" class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
        </svg>
        {{ loading ? 'Entrando...' : 'Entrar' }}
      </button>
    </form>

    <!-- Aba Cadastro -->
    <form v-else id="form-register" class="space-y-5" @submit.prevent="handleRegister">
      <div>
        <label class="block text-sm font-medium text-on-surface mb-1.5">E-mail</label>
        <input
          v-model="registerEmail"
          type="email"
          placeholder="seu@email.com"
          class="w-full px-4 py-3 rounded-lg bg-surface-container border border-outline-variant text-on-surface placeholder-on-surface-variant focus:outline-none focus:border-primary transition-colors"
        />
      </div>
      <div>
        <label class="block text-sm font-medium text-on-surface mb-1.5">Senha</label>
        <div class="relative">
          <input
            v-model="registerPassword"
            :type="showRegisterPassword ? 'text' : 'password'"
            placeholder="••••••••"
            class="w-full px-4 py-3 pr-12 rounded-lg bg-surface-container border border-outline-variant text-on-surface placeholder-on-surface-variant focus:outline-none focus:border-primary transition-colors"
          />
          <button
            type="button"
            class="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface transition-colors"
            @click="showRegisterPassword = !showRegisterPassword"
          >
            <svg v-if="showRegisterPassword" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
              <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/>
              <line x1="1" y1="1" x2="23" y2="23"/>
            </svg>
            <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
              <circle cx="12" cy="12" r="3"/>
            </svg>
          </button>
        </div>
      </div>
      <div>
        <label class="block text-sm font-medium text-on-surface mb-1.5">Confirmar Senha</label>
        <div class="relative">
          <input
            v-model="registerConfirm"
            :type="showRegisterConfirm ? 'text' : 'password'"
            placeholder="••••••••"
            class="w-full px-4 py-3 pr-12 rounded-lg bg-surface-container border border-outline-variant text-on-surface placeholder-on-surface-variant focus:outline-none focus:border-primary transition-colors"
          />
          <button
            type="button"
            class="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface transition-colors"
            @click="showRegisterConfirm = !showRegisterConfirm"
          >
            <svg v-if="showRegisterConfirm" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
              <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/>
              <line x1="1" y1="1" x2="23" y2="23"/>
            </svg>
            <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
              <circle cx="12" cy="12" r="3"/>
            </svg>
          </button>
        </div>
      </div>
      <!-- Sucesso -->
      <div v-if="registerSuccess" class="text-sm text-green-400 bg-green-400/10 border border-green-400/20 rounded-lg px-4 py-3">
        Conta criada com sucesso! Redirecionando para o login...
      </div>
      <!-- Erro -->
      <div v-if="registerError" class="text-sm text-red-400 bg-red-400/10 border border-red-400/20 rounded-lg px-4 py-3">
        {{ registerError }}
      </div>
      <button
        type="submit"
        :disabled="loading || registerSuccess"
        class="w-full py-3 rounded-lg bg-primary text-on-primary font-medium hover:bg-primary/90 transition-colors duration-200 mt-2 disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {{ loading ? 'Criando conta...' : 'Criar Conta' }}
      </button>
    </form>

  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useAuth } from '~/composables/useAuth'

const { login, register, loading, error } = useAuth()

const activeTab = ref<'login' | 'register'>('login')

const loginEmail = ref('')
const loginPassword = ref('')
const showLoginPassword = ref(false)

const registerEmail = ref('')
const registerPassword = ref('')
const registerConfirm = ref('')
const showRegisterPassword = ref(false)
const showRegisterConfirm = ref(false)
const registerError = ref<string | null>(null)
const registerSuccess = ref(false)

async function handleLogin(): Promise<void> {
  await login(loginEmail.value, loginPassword.value)
}

async function handleRegister(): Promise<void> {
  registerError.value = null

  if (!registerEmail.value || !registerPassword.value) {
    registerError.value = 'Preencha todos os campos.'
    return
  }

  if (registerPassword.value.length < 6) {
    registerError.value = 'A senha deve ter pelo menos 6 caracteres.'
    return
  }

  if (registerPassword.value !== registerConfirm.value) {
    registerError.value = 'As senhas não coincidem.'
    return
  }

  const ok = await register(registerEmail.value, registerPassword.value)
  if (error.value) {
    registerError.value = error.value
    return
  }

  if (ok) {
    registerSuccess.value = true
    // Após 2s, vai para aba de login com o email preenchido
    setTimeout(() => {
      loginEmail.value = registerEmail.value
      registerEmail.value = ''
      registerPassword.value = ''
      registerConfirm.value = ''
      registerSuccess.value = false
      activeTab.value = 'login'
    }, 2000)
  }
}
</script>
