<template>
  <div class="min-h-screen bg-surface">
    <Navbar />
    
    <div class="py-12">
      <div class="container mx-auto px-4">
        <div class="flex items-center justify-between mb-8">
          <div>
            <h1 class="text-3xl md:text-4xl font-bold text-text-primary mb-2">
              Minhas Solicitações
            </h1>
            <p class="text-text-secondary">Acompanhe o status de todos os seus pedidos</p>
          </div>
          <Button @click="router.push('/cliente/solicitacoes/nova')">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
            Nova Solicitação
          </Button>
        </div>

        <!-- Filtros -->
        <div class="flex flex-wrap gap-3 mb-8">
          <Button
            v-for="status in statusFilters"
            :key="status.value"
            :variant="selectedStatus === status.value ? 'default' : 'outline'"
            size="sm"
            @click="selectedStatus = status.value"
          >
            {{ status.label }}
          </Button>
        </div>

        <!-- Lista de Solicitações -->
        <div v-if="filteredRequests.length > 0" class="space-y-4">
          <Card v-for="request in filteredRequests" :key="request.id" class="hover:shadow-metal transition-shadow">
            <CardContent class="p-6">
              <div class="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                <div class="flex-1">
                  <div class="flex flex-wrap items-center gap-3 mb-3">
                    <Badge :variant="getStatusVariant(request.status)">
                      {{ getStatusLabel(request.status) }}
                    </Badge>
                    <span class="text-sm text-text-secondary">
                      Criado em {{ formatDate(request.created_at) }}
                    </span>
                  </div>
                  
                  <h3 class="text-xl font-bold text-text-primary mb-2">
                    {{ request.service_type }}
                  </h3>
                  
                  <p class="text-text-secondary mb-4">
                    {{ request.description }}
                  </p>

                  <div v-if="request.scheduled_at" class="flex items-center space-x-2 text-sm text-text-secondary">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span>Agendado para {{ formatDate(request.scheduled_at) }}</span>
                  </div>
                </div>

                <div class="flex flex-col gap-2">
                  <Button variant="outline" size="sm">
                    Ver Detalhes
                  </Button>
                  <Button variant="ghost" size="sm" @click="contactWhatsApp(request)">
                    <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                    </svg>
                    WhatsApp
                  </Button>
                </div>
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
            <h3 class="font-bold text-text-primary mb-2">Nenhuma solicitação encontrada</h3>
            <p class="text-text-secondary mb-6">
              {{ selectedStatus === 'all' ? 'Você ainda não fez nenhuma solicitação' : 'Nenhuma solicitação com este status' }}
            </p>
            <Button @click="router.push('/cliente/solicitacoes/nova')">
              Nova Solicitação
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>

    <Footer />
  </div>
</template>

<script setup lang="ts">
import type { Request } from '~/types'

const router = useRouter()
const { sendMessage, createServiceMessage } = useWhatsApp()

const selectedStatus = ref<string>('all')

const statusFilters = [
  { value: 'all', label: 'Todas' },
  { value: 'recebido', label: 'Recebidas' },
  { value: 'em_analise', label: 'Em Análise' },
  { value: 'agendado', label: 'Agendadas' },
  { value: 'em_execucao', label: 'Em Execução' },
  { value: 'concluido', label: 'Concluídas' }
]

// Mock data - substituir por dados reais do Supabase
const requests = ref<Request[]>([])

const filteredRequests = computed(() => {
  if (selectedStatus.value === 'all') return requests.value
  return requests.value.filter(r => r.status === selectedStatus.value)
})

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
    month: 'long',
    year: 'numeric'
  })
}

const contactWhatsApp = (request: Request) => {
  const message = `Olá! Gostaria de falar sobre minha solicitação:\n\nServiço: ${request.service_type}\nStatus: ${getStatusLabel(request.status)}\n\nPoderia me dar mais informações?`
  sendMessage(message)
}

useHead({
  title: 'Minhas Solicitações - Área do Cliente',
  meta: [
    { name: 'robots', content: 'noindex, nofollow' }
  ]
})
</script>
