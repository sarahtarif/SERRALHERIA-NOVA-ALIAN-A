<template>
  <div class="space-y-4">
    <div class="flex items-center justify-between mb-6">
      <h2 class="text-2xl font-bold text-gray-900">
        {{ formatMonth(month) }}
      </h2>
      <Badge>{{ totalItems }} {{ totalItems === 1 ? 'agendamento' : 'agendamentos' }}</Badge>
    </div>

    <div v-if="loading">
      <Skeleton class="h-96" />
    </div>

    <Card v-else>
      <CardContent class="p-4">
        <div class="grid grid-cols-7 gap-2 mb-2">
          <div v-for="day in weekDays" :key="day" class="text-center text-xs font-semibold text-gray-600 py-2">
            {{ day }}
          </div>
        </div>
        
        <div class="grid grid-cols-7 gap-2">
          <div
            v-for="day in calendarDays"
            :key="day.date"
            class="aspect-square border rounded p-1 hover:bg-gray-50 transition-colors cursor-pointer"
            :class="{
              'bg-gray-100': !day.isCurrentMonth,
              'border-blue-500 bg-blue-50': day.isToday
            }"
            @click="handleDayClick(day)"
          >
            <div class="text-xs font-semibold mb-1" :class="day.isCurrentMonth ? 'text-gray-900' : 'text-gray-400'">
              {{ day.dayNumber }}
            </div>
            <div v-if="day.items.length > 0" class="space-y-1">
              <div
                v-for="(item, idx) in day.items.slice(0, 2)"
                :key="item.id"
                class="text-xs px-1 py-0.5 rounded truncate"
                :style="{ backgroundColor: getStatusColor(item.status), color: 'white' }"
              >
                {{ item.hora_inicio }}
              </div>
              <div v-if="day.items.length > 2" class="text-xs text-gray-600 text-center">
                +{{ day.items.length - 2 }}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
</template>

<script setup lang="ts">
import type { AgendaItemWithServico } from '~/types'

interface Props {
  month: string // YYYY-MM
  items: AgendaItemWithServico[]
  loading?: boolean
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'day-click': [date: string]
  'item-click': [item: AgendaItemWithServico]
}>()

interface CalendarDay {
  date: string
  dayNumber: number
  isCurrentMonth: boolean
  isToday: boolean
  items: AgendaItemWithServico[]
}

const weekDays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']

const calendarDays = computed<CalendarDay[]>(() => {
  const [year, month] = props.month.split('-').map(Number)
  const firstDay = new Date(year, month - 1, 1)
  const lastDay = new Date(year, month, 0)
  const today = new Date().toISOString().split('T')[0]
  
  const days: CalendarDay[] = []
  
  // Dias do mês anterior
  const firstDayOfWeek = firstDay.getDay()
  for (let i = firstDayOfWeek - 1; i >= 0; i--) {
    const date = new Date(firstDay)
    date.setDate(date.getDate() - i - 1)
    const dateStr = date.toISOString().split('T')[0]
    days.push({
      date: dateStr,
      dayNumber: date.getDate(),
      isCurrentMonth: false,
      isToday: dateStr === today,
      items: props.items.filter(item => item.data === dateStr)
    })
  }
  
  // Dias do mês atual
  for (let day = 1; day <= lastDay.getDate(); day++) {
    const date = new Date(year, month - 1, day)
    const dateStr = date.toISOString().split('T')[0]
    days.push({
      date: dateStr,
      dayNumber: day,
      isCurrentMonth: true,
      isToday: dateStr === today,
      items: props.items.filter(item => item.data === dateStr)
    })
  }
  
  // Dias do próximo mês
  const remainingDays = 42 - days.length // 6 semanas
  for (let i = 1; i <= remainingDays; i++) {
    const date = new Date(year, month, i)
    const dateStr = date.toISOString().split('T')[0]
    days.push({
      date: dateStr,
      dayNumber: i,
      isCurrentMonth: false,
      isToday: dateStr === today,
      items: props.items.filter(item => item.data === dateStr)
    })
  }
  
  return days
})

const totalItems = computed(() => props.items.length)

const formatMonth = (month: string) => {
  const [year, monthNum] = month.split('-')
  const date = new Date(parseInt(year), parseInt(monthNum) - 1)
  return date.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })
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

const handleDayClick = (day: CalendarDay) => {
  emit('day-click', day.date)
}
</script>
