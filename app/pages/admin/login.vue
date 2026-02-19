<template>
  <div class="min-h-screen bg-gradient-primary flex items-center justify-center p-4">
    <Card class="w-full max-w-md">
      <CardHeader class="text-center pb-8">
        <div class="mb-6">
          <div class="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg class="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h1 class="text-2xl font-bold text-text-primary">Área Administrativa</h1>
          <p class="text-text-secondary mt-2">Acesso restrito a administradores</p>
        </div>
      </CardHeader>

      <CardContent class="px-6 pb-6">
        <Alert v-if="error" variant="destructive" class="mb-6">
          {{ error }}
        </Alert>

        <form @submit.prevent="handleLogin" class="space-y-4">
          <div>
            <Label for="email">Email</Label>
            <Input
              id="email"
              v-model="email"
              type="email"
              placeholder="admin@novaalianca.com.br"
              required
              autocomplete="email"
            />
          </div>

          <div>
            <Label for="password">Senha</Label>
            <Input
              id="password"
              v-model="password"
              type="password"
              placeholder="••••••••"
              required
              autocomplete="current-password"
            />
          </div>

          <Button
            type="submit"
            class="w-full"
            :disabled="loading"
          >
            <span v-if="loading">Entrando...</span>
            <span v-else>Entrar</span>
          </Button>
        </form>

        <div class="mt-6 text-center">
          <NuxtLink to="/" class="text-sm text-primary-500 hover:text-primary-600">
            ← Voltar para o site
          </NuxtLink>
        </div>
      </CardContent>
    </Card>
  </div>
</template>

<script setup lang="ts">
const email = ref('')
const password = ref('')
const loading = ref(false)
const error = ref('')

const { signIn } = useAuth()
const router = useRouter()

const handleLogin = async () => {
  error.value = ''
  loading.value = true

  try {
    const { data, error: signInError } = await signIn(email.value, password.value)
    
    if (signInError) {
      error.value = 'Email ou senha incorretos'
      return
    }

    // Verificar se é admin (implementar verificação de role)
    // Por enquanto, apenas redireciona
    router.push('/admin')
  } catch (e) {
    error.value = 'Erro ao fazer login. Tente novamente.'
  } finally {
    loading.value = false
  }
}

useHead({
  title: 'Login Admin',
  meta: [
    { name: 'robots', content: 'noindex, nofollow' }
  ]
})
</script>
