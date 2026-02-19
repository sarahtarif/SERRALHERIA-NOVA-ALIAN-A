<template>
  <div class="min-h-screen bg-surface flex items-center justify-center p-4">
    <Card class="w-full max-w-md">
      <CardHeader>
        <div class="text-center mb-6">
          <NuxtLink to="/" class="inline-flex items-center justify-center space-x-3 mb-6">
            <div class="w-12 h-12 bg-accent-500 rounded-lg flex items-center justify-center">
              <span class="text-white font-bold text-xl">NA</span>
            </div>
            <div>
              <div class="text-text-primary font-bold text-xl">Nova Aliança</div>
              <div class="text-text-tertiary text-xs">Área do Cliente</div>
            </div>
          </NuxtLink>
        </div>
        <h1 class="text-2xl font-bold text-text-primary text-center">Entrar na Conta</h1>
        <p class="text-text-secondary text-center mt-2">Acesse sua área do cliente</p>
      </CardHeader>

      <CardContent>
        <form @submit.prevent="handleLogin" class="space-y-5">
          <div class="space-y-2">
            <Label for="email">E-mail</Label>
            <Input
              id="email"
              v-model="form.email"
              type="email"
              required
              placeholder="seu@email.com"
              :error="!!error"
            />
          </div>

          <div class="space-y-2">
            <div class="flex items-center justify-between">
              <Label for="password">Senha</Label>
              <NuxtLink to="/cliente/recuperar-senha" class="text-sm text-primary-500 hover:text-primary-600">
                Esqueceu a senha?
              </NuxtLink>
            </div>
            <Input
              id="password"
              v-model="form.password"
              type="password"
              required
              placeholder="••••••••"
              :error="!!error"
            />
          </div>

          <Alert v-if="error" variant="danger">
            <template #icon>
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </template>
            <p class="font-bold">Erro ao fazer login</p>
            <p class="text-sm">{{ error }}</p>
          </Alert>

          <Button
            type="submit"
            :disabled="loading"
            class="w-full"
            size="lg"
          >
            {{ loading ? 'Entrando...' : 'Entrar' }}
          </Button>
        </form>

        <div class="mt-6 text-center">
          <p class="text-text-secondary text-sm">
            Não tem uma conta?
            <NuxtLink to="/cliente/cadastro" class="text-primary-500 hover:text-primary-600 font-semibold">
              Cadastre-se
            </NuxtLink>
          </p>
        </div>

        <div class="mt-6 pt-6 border-t border-border-light text-center">
          <NuxtLink to="/" class="text-text-secondary hover:text-text-primary text-sm flex items-center justify-center gap-2">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Voltar para o site
          </NuxtLink>
        </div>
      </CardContent>
    </Card>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: false
})

const { signIn } = useAuth()
const router = useRouter()

const form = reactive({
  email: '',
  password: ''
})

const loading = ref(false)
const error = ref('')

const handleLogin = async () => {
  loading.value = true
  error.value = ''

  try {
    const { error: loginError } = await signIn(form.email, form.password)
    
    if (loginError) {
      error.value = loginError
      return
    }

    router.push('/cliente')
  } catch (e: any) {
    error.value = e.message || 'Erro ao fazer login'
  } finally {
    loading.value = false
  }
}

useHead({
  title: 'Login - Área do Cliente'
})
</script>
