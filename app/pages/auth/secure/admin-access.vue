<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-900 via-primary-900 to-slate-900 flex items-center justify-center p-4">
    <!-- Partículas de fundo (opcional) -->
    <div class="absolute inset-0 overflow-hidden pointer-events-none">
      <div class="absolute w-96 h-96 bg-primary-500/10 rounded-full blur-3xl -top-48 -left-48"></div>
      <div class="absolute w-96 h-96 bg-accent-500/10 rounded-full blur-3xl -bottom-48 -right-48"></div>
    </div>

    <Card class="w-full max-w-md relative z-10 shadow-2xl border-slate-700">
      <CardHeader class="text-center pb-8 pt-8">
        <div class="mb-6">
          <!-- Ícone de Segurança -->
          <div class="w-20 h-20 bg-gradient-to-br from-primary-500 to-primary-700 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <svg class="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h1 class="text-2xl font-bold text-slate-900 mb-2">Acesso Administrativo</h1>
          <p class="text-slate-600">Sistema de Gestão Seguro</p>
          
          <!-- Badge de Segurança -->
          <div class="mt-4 inline-flex items-center space-x-2 px-3 py-1.5 bg-green-50 border border-green-200 rounded-full">
            <svg class="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            <span class="text-xs font-medium text-green-700">Conexão Segura</span>
          </div>
        </div>
      </CardHeader>

      <CardContent class="px-6 pb-6">
        <!-- Alertas -->
        <Alert v-if="error" variant="destructive" class="mb-6">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {{ error }}
        </Alert>

        <Alert v-if="rateLimitWarning" variant="warning" class="mb-6">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          Atenção: {{ failedAttempts }} tentativa(s) falha(s). Após 5 tentativas, o acesso será bloqueado.
        </Alert>

        <!-- Formulário de Login -->
        <form @submit.prevent="handleLogin" class="space-y-5">
          <!-- Honeypot (campo invisível para detectar bots) -->
          <input
            type="text"
            name="website"
            v-model="honeypot"
            style="position: absolute; left: -9999px; width: 1px; height: 1px;"
            tabindex="-1"
            autocomplete="off"
          />

          <div>
            <Label for="email" class="text-slate-700">Email Administrativo</Label>
            <Input
              id="email"
              v-model="email"
              type="email"
              placeholder="admin@novaalianca.com.br"
              required
              autocomplete="email"
              class="mt-1.5"
              :disabled="loading || blocked"
            />
          </div>

          <div>
            <Label for="password" class="text-slate-700">Senha</Label>
            <Input
              id="password"
              v-model="password"
              type="password"
              placeholder="••••••••"
              required
              autocomplete="current-password"
              class="mt-1.5"
              :disabled="loading || blocked"
            />
          </div>

          <!-- CAPTCHA (mostrar após 2 tentativas falhas) -->
          <div v-if="showCaptcha" class="bg-slate-50 border border-slate-200 rounded-lg p-4">
            <p class="text-sm text-slate-600 mb-3">Verificação de segurança necessária</p>
            <div class="flex items-center justify-center bg-white border border-slate-300 rounded p-4">
              <label class="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  v-model="captchaChecked"
                  class="w-5 h-5 text-primary-600 border-slate-300 rounded focus:ring-primary-500"
                />
                <span class="text-sm text-slate-700">Não sou um robô</span>
              </label>
            </div>
          </div>

          <Button
            type="submit"
            class="w-full h-12 text-base font-semibold"
            :disabled="loading || blocked || (showCaptcha && !captchaChecked)"
          >
            <svg v-if="loading" class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span v-if="loading">Autenticando...</span>
            <span v-else-if="blocked">Acesso Bloqueado</span>
            <span v-else>Acessar Painel</span>
          </Button>
        </form>

        <!-- Informações de Segurança -->
        <div class="mt-6 pt-6 border-t border-slate-200">
          <div class="flex items-start space-x-2 text-xs text-slate-500">
            <svg class="w-4 h-4 text-slate-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p>
              Este é um sistema protegido. Todas as tentativas de acesso são registradas e monitoradas.
              Acesso não autorizado é crime previsto em lei.
            </p>
          </div>
        </div>

        <div class="mt-6 text-center">
          <NuxtLink to="/" class="text-sm text-primary-600 hover:text-primary-700 font-medium">
            ← Voltar para o site
          </NuxtLink>
        </div>
      </CardContent>
    </Card>

    <!-- Informações de Segurança (rodapé) -->
    <div class="absolute bottom-4 left-0 right-0 text-center text-xs text-slate-400">
      <p>Protegido por autenticação multi-camada e rate limiting</p>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: false
})

const email = ref('')
const password = ref('')
const honeypot = ref('') // Campo honeypot para detectar bots
const loading = ref(false)
const error = ref('')
const failedAttempts = ref(0)
const showCaptcha = ref(false)
const captchaChecked = ref(false)
const blocked = ref(false)
const rateLimitWarning = ref(false)

const { signIn, loadProfile } = useAuth()
const router = useRouter()

// Detectar bot via honeypot
const isBotDetected = computed(() => honeypot.value !== '')

const handleLogin = async () => {
  // Verificar honeypot
  if (isBotDetected.value) {
    console.warn('[SECURITY] Bot detectado via honeypot')
    // Não mostrar erro, apenas ignorar silenciosamente
    await new Promise(resolve => setTimeout(resolve, 2000))
    return
  }

  // Verificar CAPTCHA se necessário
  if (showCaptcha.value && !captchaChecked.value) {
    error.value = 'Por favor, complete a verificação de segurança'
    return
  }

  error.value = ''
  loading.value = true

  try {
    const { data, error: signInError } = await signIn(email.value, password.value)
    
    if (signInError) {
      failedAttempts.value++
      
      // Enviar alerta após 3 tentativas falhas
      if (failedAttempts.value >= 3) {
        try {
          await $fetch('/api/security/alert-failed-login', {
            method: 'POST',
            body: {
              email: email.value,
              attempts: failedAttempts.value
            }
          })
        } catch (alertError) {
          console.error('[SECURITY] Erro ao enviar alerta:', alertError)
        }
      }
      
      // Mostrar CAPTCHA após 2 tentativas
      if (failedAttempts.value >= 2) {
        showCaptcha.value = true
        rateLimitWarning.value = true
      }
      
      // Bloquear após 5 tentativas
      if (failedAttempts.value >= 5) {
        blocked.value = true
        error.value = 'Acesso bloqueado por excesso de tentativas. Tente novamente em 1 hora.'
        
        // Log de segurança
        console.error('[SECURITY] Múltiplas tentativas de login falhas:', {
          email: email.value,
          attempts: failedAttempts.value,
          timestamp: new Date().toISOString()
        })
        
        return
      }
      
      error.value = 'Email ou senha incorretos'
      return
    }

    // Carregar perfil
    if (data.user) {
      await loadProfile(data.user.id)
    }

    // Verificar se é admin
    const { profile } = useAuth()
    
    if (profile.value?.role !== 'admin') {
      error.value = 'Acesso negado. Esta área é restrita a administradores.'
      
      // Log de tentativa não autorizada
      console.error('[SECURITY] Tentativa de acesso não-admin:', {
        userId: data.user?.id,
        email: email.value,
        role: profile.value?.role,
        timestamp: new Date().toISOString()
      })
      
      // Fazer logout
      const { signOut } = useAuth()
      await signOut()
      
      return
    }

    // Sucesso - redirecionar para painel admin
    router.push('/sys/mgmt/dashboard-v2')
    
  } catch (e: any) {
    console.error('[LOGIN] Erro:', e)
    
    // Verificar se é erro de rate limit
    if (e.statusCode === 429) {
      blocked.value = true
      error.value = 'Muitas tentativas de login. Acesso bloqueado temporariamente.'
    } else {
      error.value = 'Erro ao fazer login. Tente novamente.'
    }
  } finally {
    loading.value = false
    captchaChecked.value = false
  }
}

// SEO e Segurança
useHead({
  title: 'Acesso Administrativo - Sistema Seguro',
  meta: [
    { name: 'robots', content: 'noindex, nofollow' },
    { name: 'googlebot', content: 'noindex, nofollow' }
  ]
})
</script>
