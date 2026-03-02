<template>
  <div class="space-y-4">
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-4">
        <Button @click="goToPrevious" variant="outline" size="sm">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
        </Button>
        <Button @click="goToToday" variant="outline" size="sm">
          Hoje
        </Button>
        <Button @click="goToNext" variant="outline" size="sm">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </Button>
      </div>

      <div class="flex items-center gap-2">
        <Button
          @click="setView('day')"
          :variant="currentView === 'day' ? 'default' : 'outline'"
          size="sm"
        >
          Dia
        </Button>
        <Button
          @click="setView('week')"
          :variant="currentView === 'week' ? 'default' : 'outline'"
          size="sm"
        >
          Semana
        </Button>
        <Button
          @click="setView('month')"
          :variant="currentView === 'month' ? 'default' : 'outline'"
          size="sm"
        >
          Mês
        </Button>
      </div>
    </div>

    <AgendaDayView
      v-if="currentView === 'day'"
      :date="currentDate"
      :items="dayItems"
      :loading="loading"
      @item-click="$emit('item-click', $event)"
    />

    <AgendaWeekView
      v-else-if="currentView === 'week'"
      :start-date="weekStart"
      :end-date="weekEnd"
      :items="weekItems"
      :loading="loading"
      @item-click="$emit('item-click', $event)"
    />

    <AgendaMonthView
      v-else-if="currentView === 'month'"
      :month="currentMonth"
      :items="monthItems"
      :loading="loading"
      @day-click="handleDayClick"
      @item-click="$emit('item-click', $event)"
    />
  </div>
</template>

<script setup lang="ts">
import type { AgendaItemWithServico } from '~/types'

interface Props {
  items: AgendaItemWithServico[]
  loading?: boolean
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'item-click': [item: AgendaItemWithServico]
  'date-change': [date: string]
  'view-change': [view: 'day' | 'week' | 'month']
}>()

const currentView = ref<'day' | 'week' | 'month'>('week')
const currentDate = ref(new Date().toISOString().split('T')[0])

const currentMonth = computed(() => {
  const date = new Date(currentDate.value)
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
})

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

const dayItems = computed(() => {
  return props.items.filter(item => item.data === currentDate.value)
})

const weekItems = computed(() => {
  return props.items.filter(item => {
    return item.data >= weekStart.value && item.data <= weekEnd.value
  })
})

const monthItems = computed(() => {
  const [year, month] = currentMonth.value.split('-')
  return props.items.filter(item => {
    return item.data.startsWith(`${year}-${month}`)
  })
})

const setView = (view: 'day' | 'week' | 'month') => {
  currentView.value = view
  emit('view-change', view)
}

const goToToday = () => {
  currentDate.value = new Date().toISOString().split('T')[0]
  emit('date-change', currentDate.value)
}

const goToPrevious = () => {
  const date = new Date(currentDate.value)
  
  if (currentView.value === 'day') {
    date.setDate(date.getDate() - 1)
  } else if (currentView.value === 'week') {
    date.setDate(date.getDate() - 7)
  } else if (currentView.value === 'month') {
    date.setMonth(date.getMonth() - 1)
  }
  
  currentDate.value = date.toISOString().split('T')[0]
  emit('date-change', currentDate.value)
}

const goToNext = () => {
  const date = new Date(currentDate.value)
  
  if (currentView.value === 'day') {
    date.setDate(date.getDate() + 1)
  } else if (currentView.value === 'week') {
    date.setDate(date.getDate() + 7)
  } else if (currentView.value === 'month') {
    date.setMonth(date.getMonth() + 1)
  }
  
  currentDate.value = date.toISOString().split('T')[0]
  emit('date-change', currentDate.value)
}

const handleDayClick = (date: string) => {
  currentDate.value = date
  currentView.value = 'day'
  emit('date-change', date)
  emit('view-change', 'day')
}
</script>
