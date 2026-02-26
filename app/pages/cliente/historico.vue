<template>
  <div class="min-h-screen bg-surface">
    <Navbar />
    
    <div class="py-12">
      <div class="container mx-auto px-4">
        <div class="flex items-center justify-between mb-8">
          <div>
            <h1 class="text-3xl md:text-4xl font-bold text-text-primary mb-2">
              Serviços Contratados
            </h1>
            <p class="text-text-secondary">Veja todos os serviços que você contratou</p>
          </div>
          <Button variant="outline" @click="router.push('/cliente')">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Voltar
          </Button>
        </div>

        <div v-if="jobs.length > 0" class="space-y-6">
          <Card v-for="job in jobs" :key="job.id">
            <CardContent class="p-6">
              <div class="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-6">
                <div class="flex-1">
                  <div class="flex items-center space-x-3 mb-3">
                    <Badge variant="success">Concluído</Badge>
                    <span class="text-sm text-text-secondary">
                      {{ formatDate(job.start_at) }}
                    </span>
                  </div>
                  <h3 class="text-xl font-bold text-text-primary mb-2">
                    {{ job.summary }}
                  </h3>
                  
                  <div class="flex flex-wrap gap-4 text-sm text-text-secondary">
                    <div class="flex items-center space-x-2">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span>Início: {{ formatDate(job.start_at) }}</span>
                    </div>
                    <div v-if="job.end_at" class="flex items-center space-x-2">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>Conclusão: {{ formatDate(job.end_at) }}</span>
                    </div>
                    <div v-if="job.warranty_until" class="flex items-center space-x-2">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                      <span>Garantia até: {{ formatDate(job.warranty_until) }}</span>
                    </div>
                  </div>
                </div>

                <div class="flex flex-col gap-2">
                  <Button variant="outline" size="sm">
                    Ver Detalhes
                  </Button>
                  <Button variant="ghost" size="sm">
                    Baixar Relatório
                  </Button>
                </div>
              </div>

              <!-- Itens do Serviço -->
              <div v-if="job.items && job.items.length > 0" class="border-t border-border pt-4">
                <h4 class="font-semibold text-text-primary mb-3">Itens Instalados:</h4>
                <div class="grid md:grid-cols-2 gap-3">
                  <div
                    v-for="item in job.items"
                    :key="item.id"
                    class="flex items-start space-x-3 bg-surface p-3 rounded-lg"
                  >
                    <div class="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <svg class="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div class="flex-1 min-w-0">
                      <p class="font-medium text-text-primary">{{ getItemTypeLabel(item.item_type) }}</p>
                      <p v-if="item.brand || item.model" class="text-sm text-text-secondary">
                        {{ item.brand }} {{ item.model }}
                      </p>
                      <p v-if="item.notes" class="text-sm text-text-secondary mt-1">{{ item.notes }}</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card v-else>
          <CardContent class="p-12 text-center">
            <div class="w-16 h-16 bg-surface rounded-full flex items-center justify-center mx-auto mb-4">
              <svg class="w-8 h-8 text-text-tertiary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 class="font-bold text-text-primary mb-2">Nenhum serviço contratado ainda</h3>
            <p class="text-text-secondary mb-6">Quando você contratar serviços, eles aparecerão aqui</p>
            <Button @click="router.push('/cliente/solicitacoes/nova')">
              Solicitar Serviço
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>

    <Footer />
  </div>
</template>

<script setup lang="ts">
import type { Job, JobItem } from '~/types'

const router = useRouter()

// Mock data - substituir por dados reais do Supabase
const jobs = ref<(Job & { items?: JobItem[] })[]>([])

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  })
}

const getItemTypeLabel = (type: JobItem['item_type']) => {
  const labels = {
    motor: 'Motor',
    trava: 'Trava Eletrônica',
    fotocelula: 'Fotocélula',
    interfone: 'Interfone',
    camera: 'Câmera',
    protetor_rede: 'Protetor de Rede',
    outro: 'Outro'
  }
  return labels[type] || type
}

useHead({
  title: 'Serviços Contratados - Área do Cliente',
  meta: [
    { name: 'robots', content: 'noindex, nofollow' }
  ]
})
</script>
