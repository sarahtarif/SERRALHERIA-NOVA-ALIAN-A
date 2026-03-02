<template>
  <Card>
    <CardContent class="p-4">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <Label for="search">Buscar</Label>
          <Input
            id="search"
            v-model="localFilters.search"
            placeholder="Nome do serviço..."
            @input="emitUpdate"
          />
        </div>

        <div>
          <Label for="categoria">Categoria</Label>
          <Select
            id="categoria"
            v-model="localFilters.categoria"
            @update:modelValue="emitUpdate"
          >
            <option value="">Todas</option>
            <option value="instalacao">Instalação</option>
            <option value="manutencao">Manutenção</option>
            <option value="reparo">Reparo</option>
            <option value="orcamento">Orçamento</option>
          </Select>
        </div>

        <div>
          <Label for="tipo_servico">Tipo de Serviço</Label>
          <Select
            id="tipo_servico"
            v-model="localFilters.tipo_servico"
            @update:modelValue="emitUpdate"
          >
            <option value="">Todos</option>
            <option value="redes">Redes de Proteção</option>
            <option value="portoes">Portões Automáticos</option>
            <option value="cameras">Câmeras</option>
            <option value="interfones">Interfones</option>
            <option value="manutencao">Manutenção Geral</option>
          </Select>
        </div>

        <div>
          <Label for="status">Status</Label>
          <Select
            id="status"
            v-model="localFilters.status"
            @update:modelValue="emitUpdate"
          >
            <option value="">Todos</option>
            <option value="agendado">Agendado</option>
            <option value="em_execucao">Em Execução</option>
            <option value="concluido">Concluído</option>
            <option value="cancelado">Cancelado</option>
          </Select>
        </div>

        <div>
          <Label for="bairro">Bairro</Label>
          <Input
            id="bairro"
            v-model="localFilters.bairro"
            placeholder="Bairro..."
            @input="emitUpdate"
          />
        </div>

        <div>
          <Label for="date_from">Data Início</Label>
          <Input
            id="date_from"
            v-model="localFilters.date_from"
            type="date"
            @input="emitUpdate"
          />
        </div>

        <div>
          <Label for="date_to">Data Fim</Label>
          <Input
            id="date_to"
            v-model="localFilters.date_to"
            type="date"
            @input="emitUpdate"
          />
        </div>

        <div class="flex items-end">
          <Button @click="handleClear" variant="outline" class="w-full">
            Limpar Filtros
          </Button>
        </div>
      </div>
    </CardContent>
  </Card>
</template>

<script setup lang="ts">
import type { ServicoFilters } from '~/types'

const emit = defineEmits<{
  update: [filters: ServicoFilters]
  clear: []
}>()

const localFilters = ref<ServicoFilters>({
  search: '',
  categoria: undefined,
  tipo_servico: undefined,
  status: undefined,
  bairro: '',
  date_from: '',
  date_to: ''
})

const emitUpdate = () => {
  const filters: ServicoFilters = {}
  
  if (localFilters.value.search) filters.search = localFilters.value.search
  if (localFilters.value.categoria) filters.categoria = localFilters.value.categoria
  if (localFilters.value.tipo_servico) filters.tipo_servico = localFilters.value.tipo_servico
  if (localFilters.value.status) filters.status = localFilters.value.status
  if (localFilters.value.bairro) filters.bairro = localFilters.value.bairro
  if (localFilters.value.date_from) filters.date_from = localFilters.value.date_from
  if (localFilters.value.date_to) filters.date_to = localFilters.value.date_to
  
  emit('update', filters)
}

const handleClear = () => {
  localFilters.value = {
    search: '',
    categoria: undefined,
    tipo_servico: undefined,
    status: undefined,
    bairro: '',
    date_from: '',
    date_to: ''
  }
  emit('clear')
}
</script>
