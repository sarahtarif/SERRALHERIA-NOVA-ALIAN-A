<template>
  <div class="min-h-screen bg-gray-50">
    <AdminLayout>
      <div class="p-8">
        <div class="mb-8">
          <NuxtLink to="/admin/agenda" class="text-blue-600 hover:text-blue-700 flex items-center gap-2 mb-4">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
            Voltar para Agenda
          </NuxtLink>
          <div class="flex items-center justify-between">
            <div>
              <h1 class="text-3xl font-bold text-gray-900">Agenda Semanal</h1>
              <p class="text-gray-600 mt-2">Visualização dos agendamentos da semana</p>
            </div>
            <div class="flex items-center gap-2">
              <Button @click="goToPreviousWeek" variant="outline" size="sm">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                </svg>
                Semana Anterior
              </Button>
              <Button @click="goToCurrentWeek" variant="outline" size="sm">
                Esta Semana
              </Button>
              <Button @click="goToNextWeek" variant="outline" size="sm">
                Próxima Semana
                <svg class="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                </svg>
              </Button>
            </div>
          </div>
        </div>

        <Alert v-if="error" variant="danger" class="mb-6">{{ error }}</Alert>

        <AgendaWeekView
          :start-date="weekStart"
          :end-date="weekEnd"
          :items="weekItems"
          :loading="loading"
          @item-click="handleItemClick"
        />

        <!-- Dialog para editar agendamento -->
        <div v-if="showEditDialog && selectedItem" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <Card class="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <div class="flex items-center justify-between">
                <h2 class="text-xl font-semibold">Detalhes do Agendamento</h2>
                <button @click="showEditDialog = false" class="text-gray-500 hover:text-gray-700">
                  <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </CardHeader>
            <CardContent class="p-6">
              <div class="space-y-4 mb-6">
                <div>
                  <h3 class="font-semibold text-lg">{{ selectedItem.servico?.nome }}</h3>
                  <p class="text-gray-600">{{ selectedItem.servico?.descricao }}</p>
                </div>
                <div class="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p class="text-gray-600">Data</p>
                    <p class="font-semibold">{{ formatDate(selectedItem.data) }}</p>
                  </div>
                  <div>
                    <p class="text-gray-600">Horário</p>
                    <p class="font-semibold">{{ selectedItem.hora_inicio }} - {{ selectedItem.hora_fim || 'Não definido' }}</p>
                  </div>
                  <div>
                    <p class="text-gray-600">Status</p>
                    <Badge :variant="getStatusVariant(selectedItem.status)">
                      {{ getStatusLabel(selectedItem.status) }}
                    </Badge>
                  </div>
                  <div v-if="selectedItem.servico?.bairro">
                    <p class="text-gray-600">Local</p>
                    <p class="font-semibold">{{ selectedItem.servico.bairro }}, {{ selectedItem.servico.cidade }}</p>
                  </div>
                  <div v-if="selectedItem.tecnico">
                    <p class="text-gray-600">Técnico</p>
                    <p class="font-semibold">{{ selectedItem.tecnico.name }}</p>
                  </div>
                  <div v-if="selectedItem.servico?.valor">
                    <p class="text-gray-600">Valor</p>
                    <p class="font-semibold">{{ formatCurrency(selectedItem.servico.valor) }}</p>
                  </div>
                </div>
                <div v-if="selectedItem.observacoes">
                  <p class="text-gray-600">Observações</p>
                  <p class="text-sm">{{ selectedItem.observacoes }}</p>
                </div>
              </div>
              <div class="flex gap-2">
                <Button @click="goToServico(selectedItem.servico_id)" variant="outline" class="flex-1">
                  Ver Serviço Completo
                </Button>
                <Button @click="showEditDialog = false" class="flex-1">
                  Fechar
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  </div>
</template>

<script setup lang="ts">
import type { AgendaItemWithServico } from '~/types'
import { useAgenda } from '~/composables/admin/useAgenda'

definePageMeta({
  middleware: ['auth', 'admin']
})

useHead({
  title: 'Agenda Semanal - Admin Nova Aliança',
  meta: [
    { name: 'robots', content: 'noindex, nofollow' },
    { name: 'googlebot', content: 'noindex, nofollow' }
  ]
})

const router = useRouter()
const { agendaItems, loading, error, fetchAgendaByDays } = useAgenda()

const currentDate = ref(new Date())
const showEditDialog = ref(false)
const selectedItem = ref<AgendaItemWithServico | null>(null)

const weekStart = computed(() => {
  const date = new Date(currentDate.value)
  const day = date.getDay()
  const diff = date.getDate() - day
  const start = new Date(date.setDate(diff))
  return start.toISOString().split('T')[0]
})

const weekEnd = computed(() => {
  const start = new Date(weekStart.value)
  const end = new Date(start)
  end.setDate(start.getDate() + 6)
  return end.toISOString().split('T')[0]
})

const weekItems = computed(() => {
  return agendaItems.value.filter(item => {
    return item.data >= weekStart.value && item.data <= weekEnd.value
  })
})

onMounted(() => {
  loadWeekData()
})

const loadWeekData = () => {
  fetchAgendaByDays(weekStart.value, weekEnd.value)
}

const goToCurrentWeek = () => {
  currentDate.value = new Date()
  loadWeekData()
}

const goToPreviousWeek = () => {
  const date = new Date(currentDate.value)
  date.setDate(date.getDate() - 7)
  currentDate.value = date
  loadWeekData()
}

const goToNextWeek = () => {
  const date = new Date(currentDate.value)
  date.setDate(date.getDate() + 7)
  currentDate.value = date
  loadWeekData()
}

const handleItemClick = (item: AgendaItemWithServico) => {
  selectedItem.value = item
  showEditDialog.value = true
}

const goToServico = (servicoId: string) => {
  router.push(`/admin/servicos/${servicoId}`)
}

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('pt-BR', {
    weekday: 'long',
    day: '2-digit',
    month: 'long'
  })
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value)
}

const getStatusVariant = (status: string) => {
  const variants: Record<string, 'default' | 'success' | 'warning' | 'danger' | 'info'> = {
    'agendado': 'info',
    'em_andamento': 'warning',
    'concluido': 'success',
    'cancelado': 'danger'
  }
  return variants[status] || 'default'
}

const getStatusLabel = (status: string) => {
  const labels: Record<string, string> = {
    'agendado': 'Agendado',
    'em_andamento': 'Em Andamento',
    'concluido': 'Concluído',
    'cancelado': 'Cancelado'
  }
  return labels[status] || status
}
</script>
