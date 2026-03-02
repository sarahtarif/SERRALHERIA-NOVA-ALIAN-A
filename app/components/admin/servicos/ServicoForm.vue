<template>
  <form @submit.prevent="handleSubmit" class="space-y-6">
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div class="md:col-span-2">
        <Label for="nome">Nome do Serviço *</Label>
        <Input
          id="nome"
          v-model="formData.nome"
          placeholder="Ex: Instalação de Rede de Proteção"
          required
        />
      </div>

      <div>
        <Label for="categoria">Categoria *</Label>
        <Select id="categoria" v-model="formData.categoria" required>
          <option value="">Selecione...</option>
          <option value="instalacao">Instalação</option>
          <option value="manutencao">Manutenção</option>
          <option value="reparo">Reparo</option>
          <option value="orcamento">Orçamento</option>
        </Select>
      </div>

      <div>
        <Label for="tipo_servico">Tipo de Serviço *</Label>
        <Select id="tipo_servico" v-model="formData.tipo_servico" required>
          <option value="">Selecione...</option>
          <option value="redes">Redes de Proteção</option>
          <option value="portoes">Portões Automáticos</option>
          <option value="cameras">Câmeras</option>
          <option value="interfones">Interfones</option>
          <option value="manutencao">Manutenção Geral</option>
        </Select>
      </div>

      <div>
        <Label for="status">Status</Label>
        <Select id="status" v-model="formData.status">
          <option value="agendado">Agendado</option>
          <option value="em_execucao">Em Execução</option>
          <option value="concluido">Concluído</option>
          <option value="cancelado">Cancelado</option>
        </Select>
      </div>

      <div>
        <Label for="data_agendada">Data Agendada</Label>
        <Input
          id="data_agendada"
          v-model="formData.data_agendada"
          type="datetime-local"
        />
      </div>

      <div>
        <Label for="valor">Valor (R$)</Label>
        <Input
          id="valor"
          v-model.number="formData.valor"
          type="number"
          step="0.01"
          placeholder="0.00"
        />
      </div>

      <div>
        <Label for="bairro">Bairro</Label>
        <Input
          id="bairro"
          v-model="formData.bairro"
          placeholder="Ex: Centro"
        />
      </div>

      <div class="md:col-span-2">
        <Label for="endereco">Endereço Completo</Label>
        <Input
          id="endereco"
          v-model="formData.endereco"
          placeholder="Rua, número, complemento"
        />
      </div>

      <div>
        <Label for="cidade">Cidade</Label>
        <Input
          id="cidade"
          v-model="formData.cidade"
          placeholder="Ex: São Paulo"
        />
      </div>

      <div class="md:col-span-2">
        <Label for="descricao">Descrição</Label>
        <Textarea
          id="descricao"
          v-model="formData.descricao"
          placeholder="Detalhes do serviço..."
          rows="3"
        />
      </div>

      <div class="md:col-span-2">
        <Label for="observacoes">Observações</Label>
        <Textarea
          id="observacoes"
          v-model="formData.observacoes"
          placeholder="Observações adicionais..."
          rows="2"
        />
      </div>
    </div>

    <div class="flex gap-3 justify-end">
      <Button type="button" variant="outline" @click="$emit('cancel')">
        Cancelar
      </Button>
      <Button type="submit" :disabled="loading">
        {{ loading ? 'Salvando...' : (isEdit ? 'Atualizar' : 'Criar Serviço') }}
      </Button>
    </div>
  </form>
</template>

<script setup lang="ts">
import type { Servico, ServicoFormData } from '~/types'

interface Props {
  servico?: Servico
  loading?: boolean
}

const props = defineProps<Props>()

const emit = defineEmits<{
  submit: [data: ServicoFormData]
  cancel: []
}>()

const isEdit = computed(() => !!props.servico)

const formData = ref<ServicoFormData>({
  nome: props.servico?.nome || '',
  descricao: props.servico?.descricao || '',
  categoria: props.servico?.categoria || 'instalacao',
  tipo_servico: props.servico?.tipo_servico || '',
  status: props.servico?.status || 'agendado',
  data_agendada: props.servico?.data_agendada || '',
  endereco: props.servico?.endereco || '',
  bairro: props.servico?.bairro || '',
  cidade: props.servico?.cidade || 'São Paulo',
  observacoes: props.servico?.observacoes || '',
  valor: props.servico?.valor || undefined
})

const handleSubmit = () => {
  emit('submit', formData.value)
}

watch(() => props.servico, (newServico) => {
  if (newServico) {
    formData.value = {
      nome: newServico.nome,
      descricao: newServico.descricao || '',
      categoria: newServico.categoria,
      tipo_servico: newServico.tipo_servico,
      status: newServico.status,
      data_agendada: newServico.data_agendada || '',
      endereco: newServico.endereco || '',
      bairro: newServico.bairro || '',
      cidade: newServico.cidade,
      observacoes: newServico.observacoes || '',
      valor: newServico.valor || undefined
    }
  }
})
</script>
