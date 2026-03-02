<template>
  <div class="space-y-4">
    <div class="flex items-center justify-between mb-6">
      <h2 class="text-2xl font-bold text-gray-900">
        {{ formatDateFull(date) }}
      </h2>
      <Badge>{{ items.length }} {{ items.length === 1 ? 'agendamento' : 'agendamentos' }}</Badge>
    </div>

    <div v-if="loading" class="space-y-3">
      <Skeleton v-for="i in 3" :key="i" class="h-32" />
    </div>

    <div v-else-if="items.length === 0" class="text-center py-12">
      <svg class="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
      <p class="text-gray-500">Nenhum agendamento para este dia</p>
    </div>

    <div v-else class="space-y-3">
      <AgendaItemCard
        v-for="item in sortedItems"
        :key="item.id"
        :item="item"
        @click="$emit('item-click', item)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { AgendaItemWithServico } from '~/types'

interface Props {
  date: string
  items: AgendaItemWithServico[]
  loading?: boolean
}

const props = defineProps<Props>()

defineEmits<{
  'item-click': [item: AgendaItemWithServico]
}>()

const sortedItems = computed(() => {
  return [...props.items].sort((a, b) => {
    return a.hora_inicio.localeCompare(b.hora_inicio)
  })
})

const formatDateFull = (date: string) => {
  return new Date(date).toLocaleDateString('pt-BR', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  })
}
</script>
