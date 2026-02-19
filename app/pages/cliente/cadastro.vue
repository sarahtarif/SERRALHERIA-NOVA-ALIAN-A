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
        <h1 class="text-2xl font-bold text-text-primary text-center">Criar Conta</h1>
        <p class="text-text-secondary text-center mt-2">Cadastre-se para acompanhar seus serviços</p>
      </CardHeader>

      <CardContent>
        <form @submit.prevent="handleRegister" class="space-y-5">
          <div class="space-y-2">
            <Label for="name">Nome Completo</Label>
            <Input
              id="name"
              v-model="form.name"
              type="text"
              required
              placeholder="Seu nome completo"
            />
          </div>

          <div class="space-y-2">
            <Label for="whatsapp">WhatsApp</Label>
            <Input
              id="whatsapp"
              v-model="form.whatsapp"
              type="tel"
              required
              placeholder="(11) 99999-9999"
            />
          </div>

          <div class="space-y-2">
            <Label for="email">E-mail</Label>
            <Input
              id="email"
              v-model="form.email"
              type="email"
              required
              placeholder="seu@email.com"
            />
          </div>

          <div class="space-y-2">
            <Label for="password">Senha</Label>
            <Input
              id="password"
              v-model="form.password"
              type="password"
              required
              placeholder="Mínimo 6 caracteres"
            />
            <p class="text-xs text-text-tertiary">Mínimo de 6 caracteres</p>
          </div>

          <Alert v-if="error" variant="danger">
            <template #icon>
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </template>
            <p class="font-bold">Erro ao criar conta</p>
            <p class="text-sm">{{ error }}</p>
          </Alert>

          <Alert v-if="success" variant="success">
            <template #icon>
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </template>
            <p class="font-bold">Conta criada com sucesso!</p>
            <p class="text-sm">Verifique seu e-mail para confirmar o cadastro.</p>
          </Alert>

          <Button
            type="submit"
            :disabled="loading"
            class="w-full"
            size="lg"
          >
            {{ loading ? 'Criando conta...' : 'Criar Conta' }}
          </Button>
        </form>

        <div class="mt-6 text-center">
          <p class="text-text-secondary text-sm">
            Já tem uma conta?
            <NuxtLink to="/cliente/login" class="text-primary-500 hover:text-primary-600 font-semibold">
              Fazer login
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

const { signUp } = useAuth()

const form = reactive({
  name: '',
  whatsapp: '',
  email: '',
  password: ''
})

const loading = ref(false)
const error = ref('')
const success = ref(false)

const handleRegister = async () => {
  loading.value = true
  error.value = ''
  success.value = false

  try {
    const { error: signUpError } = await signUp(form.email, form.password, {
      name: form.name,
      whatsapp: form.whatsapp
    })
    
    if (signUpError) {
      error.value = signUpError
      return
    }

    success.value = true
    
    // Limpar formulário
    Object.keys(form).forEach(key => {
      form[key as keyof typeof form] = ''
    })
  } catch (e: any) {
    error.value = e.message || 'Erro ao criar conta'
  } finally {
    loading.value = false
  }
}

useHead({
  title: 'Cadastro - Área do Cliente'
})
</script>
