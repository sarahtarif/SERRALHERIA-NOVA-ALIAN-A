<template>
  <div class="space-y-4">
    <div class="flex items-center justify-between mb-6">
      <h2 class="text-2xl font-bold text-gray-900">
        Semana de {{ formatWeekRange(startDate, endDate) }}
      </h2>
      <Badge>{{ totalItems }} {{ totalItems === 1 ? 'agendamento' : 'agendamentos' }}</Badge>
    </div>

    <div v-if="loading" class="grid grid-cols-1 md:grid-cols-7 gap-4">
      <Skeleton v-for="i in 7" :key="i" class="h-64" />
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-7 gap-4">
      <Card v-for="day in weekDays" :key="day.date" class="overflow-hidden">
        <CardHeader class="p-3 bg-gray-50 border-b">
          <h3 class="font-semibold text-sm text-gray-900">
            {{ formatDayName(day.date) }}
          </h3>
          <p class="text-xs text-gray-600">
            {{ formatDayNumber(day.date) }}
          </p>
        </CardHeader>
        <CardContent class="p-2 space-y-2">
          <div v-if="day.items.length === 0" class="text-center py-4 text-xs text-gray-400">
            Sem agendamentos
          </div>
          <div
            v-else
            v-for="item in day.items"
            :key="item.id"
            class="p-2 rounded border-l-2 cursor-pointer hover:bg-gray-50 transition-colors"
            :style="{ borderLeftColor: getStatusColor(item.status) }"
            @click="$emit('item-click', item)"
          >
            <p class="text-xs font-semibold text-gray-900 truncate">
              {{ item.hora_inicio }}
            </p>
            <p class="text-xs text-gray-600 truncate">
              {{ item.servico?.nome || 'Serviço' }}
            </p>
            <Badge :variant="getStatusVariant(item.status)" class="text-xs mt-1">
              {{ getStatusLabel(item.status) }}
            </Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { AgendaItemWithServico } from '~/types'

interface Props {
  startDate: string
  endDate: string
  items: AgendaItemWithServico[]
  loading?: boolean
}

const props = defineProps<Props>()

defineEmits<{
  'item-click': [item: AgendaItemWithServico]
}>()

interface WeekDay {
  date: string
  items: AgendaItemWithServico[]
}

const weekDays = computed<WeekDay[]>(() => {
  const days: WeekDay[] = []
  const start = new Date(props.startDate)
  const end = new Date(props.endDate)
  
  for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
    const dateStr = d.toISOString().split('T')[0]
    const dayItems = props.items.filter(item => item.data === dateStr)
    days.push({
      date: dateStr,
      items: dayItems.sort((a, b) => a.hora_inicio.localeCompare(b.hora_inicio))
    })
  }
  
  return days
})

const totalItems = computed(() => props.items.length)

const formatWeekRange = (start: string, end: string) => {
  const startDate = new Date(start)
  const endDate = new Date(end)
  return `${startDate.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })} - ${endDate.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })}`
}

const formatDayName = (date: string) => {
  return new Date(date).toLocaleDateString('pt-BR', { weekday: 'short' })
}

const formatDayNumber = (date: string) => {
  return new Date(date).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })
}

const getStatusColor = (status: string) => {
  const colors: Record<string, string> = {
    'agendado': '#3B82F6',
    'em_andamento': '#F59E0B',
    'concluido': '#10B981',
    'cancelado': '#EF4444'
  }
  return colors[status] || '#6B7280'
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
