<script setup lang="ts">
import { ref } from 'vue'
import { useAdminAuth } from '~/composables/useAdminAuth'

definePageMeta({ layout: false, middleware: [] })

const { loginAdmin, adminLoading, adminError } = useAdminAuth()

const email = ref('')
const password = ref('')
const showPassword = ref(false)

async function handleLogin(): Promise<void> {
  if (!email.value || !password.value) return
  await loginAdmin(email.value, password.value)
}
</script>

<template>
  <div id="admin-login-page" class="min-h-screen bg-gray-950 flex items-center justify-center p-4">
    <div class="w-full max-w-sm">

      <!-- Ícone + título -->
      <div class="text-center mb-8">
        <div class="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-indigo-600 mb-4">
          <svg class="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
          </svg>
        </div>
        <h1 class="text-2xl font-bold text-white">Painel Administrativo</h1>
        <p class="text-gray-500 text-sm mt-1">Acesso restrito a administradores</p>
      </div>

      <!-- Card -->
      <div class="bg-gray-900 rounded-2xl border border-gray-800 shadow-2xl p-6 space-y-4">

        <!-- Erro -->
        <div v-if="adminError" class="flex items-center gap-2 px-4 py-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
          <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/>
          </svg>
          {{ adminError }}
        </div>

        <!-- E-mail -->
        <div>
          <label class="block text-sm text-gray-400 mb-1.5">E-mail</label>
          <input
            v-model="email"
            type="email"
            placeholder="admin@empresa.com"
            autocomplete="email"
            class="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/30 transition-colors"
            @keyup.enter="handleLogin"
          />
        </div>

        <!-- Senha -->
        <div>
          <label class="block text-sm text-gray-400 mb-1.5">Senha</label>
          <div class="relative">
            <input
              v-model="password"
              :type="showPassword ? 'text' : 'password'"
              placeholder="••••••••"
              autocomplete="current-password"
              class="w-full px-4 py-3 pr-11 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/30 transition-colors"
              @keyup.enter="handleLogin"
            />
            <button
              type="button"
              class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
              @click="showPassword = !showPassword"
            >
              <svg v-if="!showPassword" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                <path stroke-linecap="round" stroke-linejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
              </svg>
              <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"/>
              </svg>
            </button>
          </div>
        </div>

        <!-- Botão -->
        <button
          :disabled="adminLoading || !email || !password"
          class="w-full py-3 rounded-lg bg-indigo-600 text-white font-semibold hover:bg-indigo-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-2"
          @click="handleLogin"
        >
          <span v-if="adminLoading" class="flex items-center justify-center gap-2">
            <svg class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"/>
            </svg>
            Verificando...
          </span>
          <span v-else>Entrar</span>
        </button>

      </div>

      <p class="text-center text-xs text-gray-700 mt-6">Nova Aliança © {{ new Date().getFullYear() }}</p>
    </div>
  </div>
</template>
