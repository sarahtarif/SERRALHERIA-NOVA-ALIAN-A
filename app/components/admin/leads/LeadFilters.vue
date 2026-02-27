<template>
  <Card>
    <CardContent class="p-4">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Input v-model="localFilters.search" placeholder="Buscar por nome, telefone..." @input="emitFilters" />
        
        <Select v-model="localFilters.status" @change="emitFilters">
          <option value="">Todos os status</option>
          <option value="novo">Novo</option>
          <option value="em_contato">Em Contato</option>
          <option value="proposta">Proposta</option>
          <option value="fechado">Fechado</option>
          <option value="perdido">Perdido</option>
        </Select>
        
        <Input v-model="localFilters.service_type" placeholder="Tipo de serviço" @input="emitFilters" />
        
        <Button @click="clearAll" variant="outline">Limpar Filtros</Button>
      </div>
    </CardContent>
  </Card>
</template>

<script setup lang="ts">
import type { LeadFilters } from '~/types'

const emit = defineEmits<{
  update: [filters: LeadFilters]
  clear: []
}>()

const localFilters = ref<LeadFilters>({})

const emitFilters = () => {
  emit('update', localFilters.value)
}

const clearAll = () => {
  localFilters.value = {}
  emit('clear')
}
</script>
