<template>
  <div class="min-h-screen bg-surface">
    <Navbar />
    
    <div class="py-12">
      <div class="container mx-auto px-4">
        <!-- Header -->
        <div class="mb-8">
          <h1 class="text-3xl md:text-4xl font-bold text-text-primary mb-2">
            Olá, {{ profile?.name || 'Cliente' }}!
          </h1>
          <p class="text-text-secondary">Gerencie suas solicitações e acompanhe seus serviços</p>
        </div>

        <!-- Cards de Ação Rápida -->
        <div class="grid md:grid-cols-3 gap-6 mb-12">
          <Card class="hover:shadow-metal-lg transition-shadow cursor-pointer" @click="router.push('/cliente/solicitacoes/nova')">
            <CardContent class="p-6 text-center">
              <div class="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg class="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                </svg>
              </div>
              <h3 class="font-bold text-text-primary mb-2">Nova Solicitação</h3>
              <p class="text-sm text-text-secondary">Solicite um orçamento ou visita técnica</p>
            </CardContent>
          </Card>

          <Card class="hover:shadow-metal-lg transition-shadow cursor-pointer" @click="router.push('/cliente/solicitacoes')">
            <CardContent class="p-6 text-center">
              <div class="w-16 h-16 bg-accent-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg class="w-8 h-8 text-accent-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h3 class="font-bold text-text-primary mb-2">Minhas Solicitações</h3>
              <p class="text-sm text-text-secondary">Acompanhe o status dos seus pedidos</p>
            </CardContent>
          </Card>

          <Card class="hover:shadow-metal-lg transition-shadow cursor-pointer" @click="router.push('/cliente/historico')">
            <CardContent class="p-6 text-center">
              <div class="w-16 h-16 bg-success-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg class="w-8 h-8 text-success-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 class="font-bold text-text-primary mb-2">Histórico</h3>
              <p class="text-sm text-text-secondary">Veja seus serviços realizados</p>
            </CardContent>
          </Card>
        </div>

        <!-- Solicitações Recentes -->
        <div class="mb-12">
          <div class="flex items-center justify-between mb-6">
            <h2 class="text-2xl font-bold text-text-primary">Solicitações Recentes</h2>
            <Button variant="outline" size="sm" @click="router.push('/cliente/solicitacoes')">
              Ver todas
            </Button>
          </div>

          <div v-if="recentRequests.length > 0" class="space-y-4">
            <Card v-for="request in recentRequests" :key="request.id">
              <CardContent class="p-6">
                <div class="flex items-start justify-between">
                  <div class="flex-1">
                    <div class="flex items-center space-x-3 mb-2">
                      <Badge :variant="getStatusVariant(request.status)">
                        {{ getStatusLabel(request.status) }}
                      </Badge>
                      <span class="text-sm text-text-secondary">
                        {{ formatDate(request.created_at) }}
                      </span>
                    </div>
                    <h3 class="font-bold text-text-primary mb-1">{{ request.service_type }}</h3>
                    <p class="text-text-secondary text-sm">{{ request.description }}</p>
                  </div>
                  <Button variant="ghost" size="sm">
                    Ver detalhes
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card v-else>
            <CardContent class="p-12 text-center">
              <div class="w-16 h-16 bg-surface rounded-full flex items-center justify-center mx-auto mb-4">
                <svg class="w-8 h-8 text-text-tertiary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 class="font-bold text-text-primary mb-2">Nenhuma solicitação ainda</h3>
              <p class="text-text-secondary mb-6">Comece solicitando um orçamento ou visita técnica</p>
              <Button @click="router.push('/cliente/solicitacoes/nova')">
                Nova Solicitação
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>

    <Footer />
  </div>
</template>

<script setup lang="ts">
import type { Request } from '~/types'

const router = useRouter()
const { user, profile } = useAuth()

// Mock data - substituir por dados reais do Supabase
const recentRequests = ref<Request[]>([])

const getStatusVariant = (status: Request['status']): 'default' | 'success' | 'warning' | 'danger' | 'info' => {
  const variants: Record<Request['status'], 'default' | 'success' | 'warning' | 'danger' | 'info'> = {
    recebido: 'default',
    em_analise: 'warning',
    agendado: 'info',
    em_execucao: 'warning',
    concluido: 'success'
  }
  return variants[status]
}

const getStatusLabel = (status: Request['status']) => {
  const labels = {
    recebido: 'Recebido',
    em_analise: 'Em Análise',
    agendado: 'Agendado',
    em_execucao: 'Em Execução',
    concluido: 'Concluído'
  }
  return labels[status] || status
}

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  })
}

useHead({
  title: 'Dashboard - Área do Cliente',
  meta: [
    { name: 'robots', content: 'noindex, nofollow' }
  ]
})
</script>
