<template>
  <Card class="hover:shadow-md transition-shadow cursor-pointer" @click="$emit('click', servico)">
    <CardContent class="p-4">
      <div class="flex items-start justify-between">
        <div class="flex-1">
          <div class="flex items-center gap-2 mb-2">
            <h3 class="font-semibold text-gray-900">{{ servico.nome }}</h3>
            <Badge :variant="statusVariant" :style="{ backgroundColor: tipoColor }">
              {{ statusLabel }}
            </Badge>
          </div>
          
          <div class="space-y-1 text-sm text-gray-600">
            <p class="flex items-center gap-1">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
              {{ categoriaLabel }} - {{ tipoLabel }}
            </p>
            
            <p v-if="servico.bairro" class="flex items-center gap-1">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {{ servico.bairro }}, {{ servico.cidade }}
            </p>
            
            <p v-if="servico.data_agendada" class="flex items-center gap-1">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              {{ formatDate(servico.data_agendada) }}
            </p>

            <p v-if="servico.valor" class="flex items-center gap-1 font-semibold text-green-600">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {{ formatCurrency(servico.valor) }}
            </p>
          </div>
        </div>
        
        <div class="text-right text-xs text-gray-500">
          <p>{{ formatDate(servico.created_at) }}</p>
        </div>
      </div>
      
      <p v-if="servico.descricao" class="mt-3 text-sm text-gray-600 line-clamp-2">
        {{ servico.descricao }}
      </p>
    </CardContent>
  </Card>
</template>

<script setup lang="ts">
import type { Servico } from '~/types'

interface Props {
  servico: Servico
}

const props = defineProps<Props>()

defineEmits<{
  click: [servico: Servico]
}>()

const statusVariant = computed(() => {
  const variants: Record<string, 'default' | 'success' | 'warning' | 'danger' | 'info'> = {
    'agendado': 'info',
    'em_execucao': 'warning',
    'concluido': 'success',
    'cancelado': 'danger'
  }
  return variants[props.servico.status] || 'default'
})

const statusLabel = computed(() => {
  const labels: Record<string, string> = {
    'agendado': 'Agendado',
    'em_execucao': 'Em Execução',
    'concluido': 'Concluído',
    'cancelado': 'Cancelado'
  }
  return labels[props.servico.status] || 'Agendado'
})

const categoriaLabel = computed(() => {
  const labels: Record<string, string> = {
    'instalacao': 'Instalação',
    'manutencao': 'Manutenção',
    'reparo': 'Reparo',
    'orcamento': 'Orçamento'
  }
  return labels[props.servico.categoria] || props.servico.categoria
})

const tipoLabel = computed(() => {
  const labels: Record<string, string> = {
    'redes': 'Redes de Proteção',
    'portoes': 'Portões Automáticos',
    'cameras': 'Câmeras',
    'interfones': 'Interfones',
    'manutencao': 'Manutenção Geral'
  }
  return labels[props.servico.tipo_servico] || props.servico.tipo_servico
})

const tipoColor = computed(() => {
  const colors: Record<string, string> = {
    'redes': '#3B82F6',        // blue
    'portoes': '#10B981',      // green
    'cameras': '#F59E0B',      // orange
    'interfones': '#8B5CF6',   // purple
    'manutencao': '#EF4444'    // red
  }
  return colors[props.servico.tipo_servico] || '#6B7280'
})

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  })
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value)
}
</script>
