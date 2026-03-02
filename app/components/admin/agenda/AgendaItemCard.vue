<template>
  <Card 
    class="hover:shadow-md transition-shadow cursor-pointer border-l-4" 
    :style="{ borderLeftColor: statusColor }"
    @click="$emit('click', item)"
  >
    <CardContent class="p-4">
      <div class="flex items-start justify-between">
        <div class="flex-1">
          <div class="flex items-center gap-2 mb-2">
            <h3 class="font-semibold text-gray-900">{{ item.servico?.nome || 'Serviço' }}</h3>
            <Badge :variant="statusVariant">{{ statusLabel }}</Badge>
          </div>
          
          <div class="space-y-1 text-sm text-gray-600">
            <p class="flex items-center gap-1">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {{ item.hora_inicio }} {{ item.hora_fim ? `- ${item.hora_fim}` : '' }}
            </p>
            
            <p v-if="item.servico?.bairro" class="flex items-center gap-1">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {{ item.servico.bairro }}
            </p>

            <p v-if="item.tecnico" class="flex items-center gap-1">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              {{ item.tecnico.name }}
            </p>
          </div>
        </div>
        
        <div class="text-right text-xs text-gray-500">
          <p>{{ formatDate(item.data) }}</p>
        </div>
      </div>
      
      <p v-if="item.observacoes" class="mt-3 text-sm text-gray-600 line-clamp-2">
        {{ item.observacoes }}
      </p>
    </CardContent>
  </Card>
</template>

<script setup lang="ts">
import type { AgendaItemWithServico } from '~/types'

interface Props {
  item: AgendaItemWithServico
}

const props = defineProps<Props>()

defineEmits<{
  click: [item: AgendaItemWithServico]
}>()

const statusVariant = computed(() => {
  const variants: Record<string, 'default' | 'success' | 'warning' | 'danger' | 'info'> = {
    'agendado': 'info',
    'em_andamento': 'warning',
    'concluido': 'success',
    'cancelado': 'danger'
  }
  return variants[props.item.status] || 'default'
})

const statusLabel = computed(() => {
  const labels: Record<string, string> = {
    'agendado': 'Agendado',
    'em_andamento': 'Em Andamento',
    'concluido': 'Concluído',
    'cancelado': 'Cancelado'
  }
  return labels[props.item.status] || 'Agendado'
})

const statusColor = computed(() => {
  const colors: Record<string, string> = {
    'agendado': '#3B82F6',      // blue
    'em_andamento': '#F59E0B',  // orange
    'concluido': '#10B981',     // green
    'cancelado': '#EF4444'      // red
  }
  return colors[props.item.status] || '#6B7280'
})

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  })
}
</script>
