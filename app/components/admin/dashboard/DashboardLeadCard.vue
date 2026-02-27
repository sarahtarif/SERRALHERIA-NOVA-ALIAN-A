<template>
  <div class="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
    <div class="flex-1">
      <p class="font-medium text-gray-900">{{ lead.name }}</p>
      <p class="text-sm text-gray-600">{{ lead.service }} • {{ lead.neighborhood }}</p>
      <p class="text-xs text-gray-500 mt-1">{{ lead.time }}</p>
    </div>
    <Badge :variant="statusVariant">
      {{ lead.status }}
    </Badge>
  </div>
</template>

<script setup lang="ts">
import type { RecentLead } from '~/types'

interface Props {
  lead: RecentLead
}

const props = defineProps<Props>()

const statusVariant = computed(() => {
  const variants: Record<string, 'default' | 'success' | 'warning' | 'danger' | 'info'> = {
    'Novo': 'default',
    'Em Contato': 'warning',
    'Proposta': 'info',
    'Fechado': 'success',
    'Perdido': 'danger'
  }
  return variants[props.lead.status] || 'default'
})
</script>
