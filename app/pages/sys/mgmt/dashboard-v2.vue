<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
    <!-- Header Seguro -->
    <header class="bg-white border-b border-slate-200 shadow-sm sticky top-0 z-50">
      <div class="container mx-auto px-4 py-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-4">
            <div class="w-10 h-10 bg-gradient-to-br from-primary-600 to-primary-800 rounded-lg flex items-center justify-center">
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <div>
              <h1 class="text-xl font-bold text-slate-900">Painel Administrativo</h1>
              <p class="text-sm text-slate-500">Sistema de Gestão Seguro</p>
            </div>
          </div>
          
          <div class="flex items-center space-x-4">
            <!-- Info do Admin -->
            <div class="hidden md:block text-right">
              <p class="text-sm font-medium text-slate-900">{{ profile?.name }}</p>
              <p class="text-xs text-slate-500">{{ profile?.email }}</p>
            </div>
            
            <!-- Avatar -->
            <div class="w-10 h-10 bg-gradient-to-br from-accent-400 to-accent-600 rounded-full flex items-center justify-center">
              <span class="text-white font-bold text-sm">{{ initials }}</span>
            </div>
            
            <!-- Logout -->
            <Button
              @click="handleLogout"
              variant="outline"
              size="sm"
              class="text-slate-600 hover:text-slate-900"
            >
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Sair
            </Button>
          </div>
        </div>
      </div>
    </header>

    <!-- Conteúdo Principal -->
    <main class="container mx-auto px-4 py-8">
      <!-- Bem-vindo -->
      <div class="mb-8">
        <Card class="bg-gradient-to-r from-primary-600 to-primary-800 text-white border-0">
          <CardContent class="p-8">
            <div class="flex items-center justify-between">
              <div class="flex-1">
                <h2 class="text-3xl font-bold mb-2">Bem-vindo, {{ profile?.name }}!</h2>
                <p class="text-primary-100 text-lg">
                  Acesso autorizado ao painel administrativo
                </p>
                <p class="text-primary-200 text-sm mt-2">
                  Último acesso: {{ lastAccess }}
                </p>
                
                <!-- Botão de Acesso ao Painel -->
                <div class="mt-6">
                  <NuxtLink to="/admin">
                    <Button 
                      size="lg" 
                      class="bg-white text-primary-700 hover:bg-primary-50 font-semibold shadow-lg hover:shadow-xl transition-all"
                    >
                      <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                      </svg>
                      Acessar Painel de Gestão
                    </Button>
                  </NuxtLink>
                </div>
              </div>
              <div class="hidden lg:block">
                <div class="w-24 h-24 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm">
                  <svg class="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <!-- Status de Segurança -->
      <div class="grid md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardContent class="p-6">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm text-slate-500 mb-1">Status de Segurança</p>
                <p class="text-2xl font-bold text-green-600">Protegido</p>
              </div>
              <div class="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent class="p-6">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm text-slate-500 mb-1">Sessão Ativa</p>
                <p class="text-2xl font-bold text-blue-600">{{ sessionDuration }}</p>
              </div>
              <div class="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent class="p-6">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm text-slate-500 mb-1">Nível de Acesso</p>
                <p class="text-2xl font-bold text-purple-600">Admin</p>
              </div>
              <div class="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <!-- Informações de Segurança -->
      <Card>
        <CardHeader>
          <h3 class="text-lg font-semibold text-slate-900">Informações de Segurança</h3>
        </CardHeader>
        <CardContent class="p-6">
          <div class="space-y-4">
            <div class="flex items-start space-x-3">
              <div class="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <svg class="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <p class="font-medium text-slate-900">Autenticação Multi-Camada Ativa</p>
                <p class="text-sm text-slate-500">JWT + Session + RBAC verificados</p>
              </div>
            </div>

            <div class="flex items-start space-x-3">
              <div class="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <svg class="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <p class="font-medium text-slate-900">Rate Limiting Configurado</p>
                <p class="text-sm text-slate-500">Proteção contra brute force e scraping</p>
              </div>
            </div>

            <div class="flex items-start space-x-3">
              <div class="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <svg class="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <p class="font-medium text-slate-900">Audit Logging Ativo</p>
                <p class="text-sm text-slate-500">Todos os acessos são registrados e monitorados</p>
              </div>
            </div>

            <div class="flex items-start space-x-3">
              <div class="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <svg class="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <p class="font-medium text-slate-900">Headers de Segurança Aplicados</p>
                <p class="text-sm text-slate-500">CSP, HSTS, X-Frame-Options configurados</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <!-- Informações da Sessão -->
      <Card class="mt-6">
        <CardHeader>
          <h3 class="text-lg font-semibold text-slate-900">Detalhes da Sessão</h3>
        </CardHeader>
        <CardContent class="p-6">
          <div class="grid md:grid-cols-2 gap-4 text-sm">
            <div>
              <p class="text-slate-500">ID do Usuário</p>
              <p class="font-mono text-slate-900 mt-1">{{ user?.id }}</p>
            </div>
            <div>
              <p class="text-slate-500">Email</p>
              <p class="font-mono text-slate-900 mt-1">{{ profile?.email }}</p>
            </div>
            <div>
              <p class="text-slate-500">Role</p>
              <Badge variant="default" class="mt-1">{{ profile?.role }}</Badge>
            </div>
            <div>
              <p class="text-slate-500">Conta Criada</p>
              <p class="text-slate-900 mt-1">{{ accountCreated }}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </main>

    <!-- Footer -->
    <footer class="border-t border-slate-200 mt-12 py-6">
      <div class="container mx-auto px-4 text-center text-sm text-slate-500">
        <p>Sistema Administrativo Seguro - Nova Aliança</p>
        <p class="mt-1">Protegido por múltiplas camadas de segurança</p>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: ['auth', 'admin'],
  layout: false
})

const { user, profile, signOut } = useAuth()
const router = useRouter()

// Computed properties
const initials = computed(() => {
  if (!profile.value?.name) return 'AD'
  return profile.value.name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
})

const lastAccess = computed(() => {
  return new Date().toLocaleString('pt-BR', {
    dateStyle: 'long',
    timeStyle: 'short'
  })
})

const sessionDuration = ref('Ativa')
const accountCreated = computed(() => {
  if (!profile.value?.created_at) return 'N/A'
  return new Date(profile.value.created_at).toLocaleDateString('pt-BR', {
    dateStyle: 'long'
  })
})

// Atualizar duração da sessão
let sessionStart = Date.now()
setInterval(() => {
  const duration = Math.floor((Date.now() - sessionStart) / 1000 / 60)
  sessionDuration.value = `${duration} min`
}, 60000)

// Logout
const handleLogout = async () => {
  await signOut()
  router.push('/')
}

// SEO e Segurança
useHead({
  title: 'Painel Admin - Sistema Seguro',
  meta: [
    { name: 'robots', content: 'noindex, nofollow' },
    { name: 'googlebot', content: 'noindex, nofollow' }
  ]
})
</script>
