<template>
  <Card class="hover:shadow-md transition-shadow cursor-pointer" @click="$emit('click', lead)">
    <CardContent class="p-4">
      <div class="flex items-start justify-between">
        <div class="flex-1">
          <div class="flex items-center gap-2 mb-2">
            <h3 class="font-semibold text-gray-900">{{ lead.name }}</h3>
            <Badge :variant="statusVariant">{{ statusLabel }}</Badge>
          </div>
          
          <div class="space-y-1 text-sm text-gray-600">
            <p class="flex items-center gap-1">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              {{ lead.whatsapp }}
            </p>
            
            <p class="flex items-center gap-1">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              {{ lead.service_type }}
            </p>
            
            <p v-if="lead.neighborhood" class="flex items-center gap-1">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {{ lead.neighborhood }}
            </p>
          </div>
        </div>
        
        <div class="text-right text-xs text-gray-500">
          <p>{{ formatDate(lead.created_at) }}</p>
          <Badge v-if="lead.converted_to_client" variant="success" class="mt-1">Convertido</Badge>
        </div>
      </div>
      
      <p v-if="lead.message" class="mt-3 text-sm text-gray-600 line-clamp-2">
        {{ lead.message }}
      </p>
    </CardContent>
  </Card>
</template>

<script setup lang="ts">
import type { Lead } from '~/types'

interface Props {
  lead: Lead
}

const props = defineProps<Props>()

defineEmits<{
  click: [lead: Lead]
}>()

const statusVariant = computed(() => {
  const variants: Record<string, 'default' | 'success' | 'warning' | 'danger' | 'info'> = {
    'novo': 'default',
    'em_contato': 'warning',
    'proposta': 'info',
    'fechado': 'success',
    'perdido': 'danger'
  }
  return variants[props.lead.status || 'novo'] || 'default'
})

const statusLabel = computed(() => {
  const labels: Record<string, string> = {
    'novo': 'Novo',
    'em_contato': 'Em Contato',
    'proposta': 'Proposta',
    'fechado': 'Fechado',
    'perdido': 'Perdido'
  }
  return labels[props.lead.status || 'novo'] || 'Novo'
})

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  })
}
</script>
