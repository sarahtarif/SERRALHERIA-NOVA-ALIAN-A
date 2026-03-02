<template>
  <form @submit.prevent="handleSubmit" class="space-y-6">
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div class="md:col-span-2">
        <Label for="servico_id">Serviço *</Label>
        <Select id="servico_id" v-model="formData.servico_id" required>
          <option value="">Selecione um serviço...</option>
          <option v-for="servico in servicos" :key="servico.id" :value="servico.id">
            {{ servico.nome }}
          </option>
        </Select>
      </div>

      <div>
        <Label for="data">Data *</Label>
        <Input
          id="data"
          v-model="formData.data"
          type="date"
          required
        />
      </div>

      <div>
        <Label for="status">Status</Label>
        <Select id="status" v-model="formData.status">
          <option value="agendado">Agendado</option>
          <option value="em_andamento">Em Andamento</option>
          <option value="concluido">Concluído</option>
          <option value="cancelado">Cancelado</option>
        </Select>
      </div>

      <div>
        <Label for="hora_inicio">Hora Início *</Label>
        <Input
          id="hora_inicio"
          v-model="formData.hora_inicio"
          type="time"
          required
        />
      </div>

      <div>
        <Label for="hora_fim">Hora Fim</Label>
        <Input
          id="hora_fim"
          v-model="formData.hora_fim"
          type="time"
        />
      </div>

      <div class="md:col-span-2">
        <Label for="observacoes">Observações</Label>
        <Textarea
          id="observacoes"
          v-model="formData.observacoes"
          placeholder="Observações sobre o agendamento..."
          rows="3"
        />
      </div>
    </div>

    <Alert v-if="conflictError" variant="danger" class="mt-4">
      {{ conflictError }}
    </Alert>

    <div class="flex gap-3 justify-end">
      <Button type="button" variant="outline" @click="$emit('cancel')">
        Cancelar
      </Button>
      <Button type="submit" :disabled="loading">
        {{ loading ? 'Salvando...' : (isEdit ? 'Atualizar' : 'Criar Agendamento') }}
      </Button>
    </div>
  </form>
</template>

<script setup lang="ts">
import type { AgendaItem, AgendaItemFormData, Servico } from '~/types'

interface Props {
  agendaItem?: AgendaItem
  servicos?: Servico[]
  loading?: boolean
  conflictError?: string
}

const props = defineProps<Props>()

const emit = defineEmits<{
  submit: [data: AgendaItemFormData]
  cancel: []
}>()

const isEdit = computed(() => !!props.agendaItem)

const formData = ref<AgendaItemFormData>({
  servico_id: props.agendaItem?.servico_id || '',
  data: props.agendaItem?.data || '',
  hora_inicio: props.agendaItem?.hora_inicio || '',
  hora_fim: props.agendaItem?.hora_fim || '',
  status: props.agendaItem?.status || 'agendado',
  observacoes: props.agendaItem?.observacoes || ''
})

const handleSubmit = () => {
  emit('submit', formData.value)
}

watch(() => props.agendaItem, (newItem) => {
  if (newItem) {
    formData.value = {
      servico_id: newItem.servico_id,
      data: newItem.data,
      hora_inicio: newItem.hora_inicio,
      hora_fim: newItem.hora_fim || '',
      status: newItem.status,
      observacoes: newItem.observacoes || ''
    }
  }
})
</script>
