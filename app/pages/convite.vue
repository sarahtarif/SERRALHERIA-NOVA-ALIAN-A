<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useSupabase } from '~/composables/useSupabase'

definePageMeta({ layout: false })

const route = useRoute()
const router = useRouter()
const supabase = useSupabase()

const token = route.query.token as string

// Estados
type Step = 'validando' | 'formulario' | 'sucesso' | 'erro'
const step = ref<Step>('validando')
const erroMsg = ref('')
const loading = ref(false)

// Dados do cliente avulso (pré-preenchidos)
const clienteNome = ref('')

// Formulário
const form = ref({ nome: '', email: '', password: '', confirmPassword: '' })
const formErro = ref('')

// Valida token ao montar
onMounted(async () => {
  if (!token) {
    erroMsg.value = 'Link inválido. Solicite um novo ao atendimento.'
    step.value = 'erro'
    return
  }

  const { data, error } = await supabase
    .from('convites')
    .select('usado, expires_at, clientes_avulsos(nome, email)')
    .eq('token', token)
    .single()

  if (error || !data) {
    erroMsg.value = 'Link inválido ou não encontrado.'
    step.value = 'erro'
    return
  }
  if (data.usado) {
    erroMsg.value = 'Este link já foi utilizado. Faça login normalmente.'
    step.value = 'erro'
    return
  }
  if (new Date(data.expires_at) < new Date()) {
    erroMsg.value = 'Este link expirou. Solicite um novo ao atendimento.'
    step.value = 'erro'
    return
  }

  // Pré-preenche dados do cliente avulso
  const ca = (Array.isArray(data.clientes_avulsos) ? data.clientes_avulsos[0] : data.clientes_avulsos) as { nome: string; email: string | null } | null
  if (ca) {
    clienteNome.value = ca.nome
    form.value.nome = ca.nome
    form.value.email = ca.email ?? ''
  }

  step.value = 'formulario'
})

async function registrar() {
  formErro.value = ''

  if (!form.value.email || !form.value.password) {
    formErro.value = 'Preencha e-mail e senha.'
    return
  }
  if (form.value.password.length < 6) {
    formErro.value = 'A senha deve ter pelo menos 6 caracteres.'
    return
  }
  if (form.value.password !== form.value.confirmPassword) {
    formErro.value = 'As senhas não coincidem.'
    return
  }

  loading.value = true

  try {
    await $fetch('/api/convites/registrar', {
      method: 'POST',
      body: {
        token,
        email: form.value.email.trim().toLowerCase(),
        password: form.value.password,
        nome: form.value.nome.trim() || null,
      },
    })

    // Faz login automático após cadastro
    await supabase.auth.signInWithPassword({
      email: form.value.email.trim().toLowerCase(),
      password: form.value.password,
    })

    step.value = 'sucesso'
    setTimeout(() => router.push('/cliente'), 2500)
  } catch (err: unknown) {
    const msg = (err as { data?: { message?: string } })?.data?.message
    formErro.value = msg ?? 'Erro ao criar conta. Tente novamente.'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center px-4" style="background:#080e1a;">

    <!-- Validando -->
    <div v-if="step === 'validando'" class="text-center space-y-3">
      <div class="w-10 h-10 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin mx-auto"></div>
      <p class="text-sm" style="color:#64748b;">Validando link...</p>
    </div>

    <!-- Erro -->
    <div v-else-if="step === 'erro'" class="max-w-sm w-full text-center space-y-4">
      <div class="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto" style="background:rgba(239,68,68,0.12); border:1px solid rgba(239,68,68,0.2);">
        <svg class="w-7 h-7" style="color:#f87171;" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
        </svg>
      </div>
      <h2 class="text-lg font-bold text-white">Link inválido</h2>
      <p class="text-sm" style="color:#64748b;">{{ erroMsg }}</p>
      <a href="/login" class="inline-block text-sm font-medium" style="color:#818cf8;">Ir para o login →</a>
    </div>

    <!-- Sucesso -->
    <div v-else-if="step === 'sucesso'" class="max-w-sm w-full text-center space-y-4">
      <div class="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto" style="background:rgba(34,197,94,0.12); border:1px solid rgba(34,197,94,0.2);">
        <svg class="w-7 h-7" style="color:#4ade80;" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/>
        </svg>
      </div>
      <h2 class="text-lg font-bold text-white">Conta criada!</h2>
      <p class="text-sm" style="color:#64748b;">Redirecionando para a área do cliente...</p>
    </div>

    <!-- Formulário -->
    <div v-else class="w-full max-w-sm space-y-6">

      <!-- Logo + título -->
      <div class="text-center space-y-2">
        <img src="/images/logo.png" alt="Nova Aliança" class="h-12 w-auto mx-auto" />
        <h1 class="text-xl font-bold text-white">Criar sua conta</h1>
        <p class="text-sm" style="color:#64748b;">
          Olá, <span style="color:#e2e8f0;">{{ clienteNome }}</span>! Configure seu acesso à área do cliente.
        </p>
      </div>

      <!-- Card do formulário -->
      <div class="rounded-2xl p-6 space-y-4" style="background:#0d1526; border:1px solid rgba(255,255,255,0.07);">

        <!-- Erro -->
        <div v-if="formErro" class="px-3 py-2.5 rounded-xl text-xs" style="background:rgba(239,68,68,0.12); color:#f87171; border:1px solid rgba(239,68,68,0.2);">
          {{ formErro }}
        </div>

        <!-- Nome -->
        <div>
          <label class="block text-xs font-medium mb-1.5" style="color:#94a3b8;">Nome</label>
          <input
            v-model="form.nome"
            type="text"
            placeholder="Seu nome completo"
            class="w-full px-3 py-2.5 rounded-xl text-sm outline-none"
            style="background:#1e293b; color:#e2e8f0; border:1px solid rgba(255,255,255,0.08);"
          />
        </div>

        <!-- E-mail -->
        <div>
          <label class="block text-xs font-medium mb-1.5" style="color:#94a3b8;">E-mail *</label>
          <input
            v-model="form.email"
            type="email"
            placeholder="seu@email.com"
            class="w-full px-3 py-2.5 rounded-xl text-sm outline-none"
            style="background:#1e293b; color:#e2e8f0; border:1px solid rgba(255,255,255,0.08);"
          />
        </div>

        <!-- Senha -->
        <div>
          <label class="block text-xs font-medium mb-1.5" style="color:#94a3b8;">Senha *</label>
          <input
            v-model="form.password"
            type="password"
            placeholder="Mínimo 6 caracteres"
            class="w-full px-3 py-2.5 rounded-xl text-sm outline-none"
            style="background:#1e293b; color:#e2e8f0; border:1px solid rgba(255,255,255,0.08);"
          />
        </div>

        <!-- Confirmar senha -->
        <div>
          <label class="block text-xs font-medium mb-1.5" style="color:#94a3b8;">Confirmar senha *</label>
          <input
            v-model="form.confirmPassword"
            type="password"
            placeholder="Repita a senha"
            class="w-full px-3 py-2.5 rounded-xl text-sm outline-none"
            style="background:#1e293b; color:#e2e8f0; border:1px solid rgba(255,255,255,0.08);"
            @keyup.enter="registrar"
          />
        </div>

        <!-- Botão -->
        <button
          @click="registrar"
          :disabled="loading"
          class="w-full py-3 rounded-xl text-sm font-semibold transition-all hover:brightness-110 disabled:opacity-50 mt-2"
          style="background:linear-gradient(135deg,#6366f1,#818cf8); color:#fff;"
        >
          {{ loading ? 'Criando conta...' : 'Criar conta e acessar' }}
        </button>
      </div>

      <p class="text-center text-xs" style="color:#475569;">
        Já tem conta?
        <a href="/login" style="color:#818cf8;" class="font-medium">Fazer login</a>
      </p>
    </div>

  </div>
</template>
