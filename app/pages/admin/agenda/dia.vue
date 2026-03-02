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
              <h1 class="text-3xl font-bold text-gray-900">Agenda do Dia</h1>
              <p class="text-gray-600 mt-2">Visualização detalhada dos agendamentos do dia</p>
            </div>
            <div class="flex items-center gap-2">
              <Button @click="goToPreviousDay" variant="outline" size="sm">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                </svg>
              </Button>
              <Input
                v-model="selectedDate"
                type="date"
                @change="handleDateChange"
                class="w-48"
              />
              <Button @click="goToToday" variant="outline" size="sm">
                Hoje
              </Button>
              <Button @click="goToNextDay" variant="outline" size="sm">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                </svg>
              </Button>
            </div>
          </div>
        </div>

        <Alert v-if="error" variant="danger" class="mb-6">{{ error }}</Alert>

        <AgendaDayView
          :date="selectedDate"
          :items="dayItems"
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
                </div>
                <div v-if="selectedItem.observacoes">
                  <p class="text-gray-600">Observações</p>
                  <p class="text-sm">{{ selectedItem.observacoes }}</p>
                </div>
              </div>
              <div class="flex gap-2">
                <Button @click="goToServico(selectedItem.servico_id)" variant="outline" class="flex-1">
                  Ver Serviço
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
  title: 'Agenda do Dia - Admin Nova Aliança',
  meta: [
    { name: 'robots', content: 'noindex, nofollow' },
    { name: 'googlebot', content: 'noindex, nofollow' }
  ]
})

const router = useRouter()
const { agendaItems, loading, error, fetchAgendaByDays } = useAgenda()

const selectedDate = ref(new Date().toISOString().split('T')[0])
const showEditDialog = ref(false)
const selectedItem = ref<AgendaItemWithServico | null>(null)

const dayItems = computed(() => {
  return agendaItems.value.filter(item => item.data === selectedDate.value)
})

onMounted(() => {
  loadDayData()
})

const loadDayData = () => {
  fetchAgendaByDays(selectedDate.value, selectedDate.value)
}

const handleDateChange = () => {
  loadDayData()
}

const goToToday = () => {
  selectedDate.value = new Date().toISOString().split('T')[0]
  loadDayData()
}

const goToPreviousDay = () => {
  const date = new Date(selectedDate.value)
  date.setDate(date.getDate() - 1)
  selectedDate.value = date.toISOString().split('T')[0]
  loadDayData()
}

const goToNextDay = () => {
  const date = new Date(selectedDate.value)
  date.setDate(date.getDate() + 1)
  selectedDate.value = date.toISOString().split('T')[0]
  loadDayData()
}

const handleItemClick = (item: AgendaItemWithServico) => {
  selectedItem.value = item
  showEditDialog.value = true
}

const goToServico = (servicoId: string) => {
  router.push(`/admin/servicos/${servicoId}`)
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
