<template>
  <div class="space-y-6">
    <!-- Informações Básicas -->
    <Card>
      <CardHeader>
        <h3 class="text-lg font-semibold">Informações do Orçamento</h3>
      </CardHeader>
      <CardContent class="space-y-4">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label for="lead_id">Lead (opcional)</Label>
            <Select id="lead_id" v-model="localData.lead_id">
              <option value="">Selecione um lead</option>
              <option v-for="lead in leads" :key="lead.id" :value="lead.id">
                {{ lead.name }}
              </option>
            </Select>
          </div>

          <div>
            <Label for="client_id">Cliente (opcional)</Label>
            <Select id="client_id" v-model="localData.client_id">
              <option value="">Selecione um cliente</option>
              <option v-for="client in clients" :key="client.id" :value="client.id">
                {{ client.profile_id }}
              </option>
            </Select>
          </div>

          <div>
            <Label for="status">Status</Label>
            <Select id="status" v-model="localData.status">
              <option value="rascunho">Rascunho</option>
              <option value="enviado">Enviado</option>
              <option value="aprovado">Aprovado</option>
              <option value="rejeitado">Rejeitado</option>
            </Select>
          </div>

          <div>
            <Label for="validade_dias">Validade (dias)</Label>
            <Input 
              id="validade_dias" 
              v-model.number="localData.validade_dias" 
              type="number" 
              min="1"
              placeholder="30"
            />
          </div>
        </div>

        <div>
          <Label for="observacoes">Observações</Label>
          <Textarea 
            id="observacoes" 
            v-model="localData.observacoes" 
            rows="3"
            placeholder="Observações adicionais..."
          />
        </div>

        <div>
          <Label for="valor_desconto">Desconto (R$)</Label>
          <Input 
            id="valor_desconto" 
            v-model.number="localData.valor_desconto" 
            type="number" 
            min="0"
            step="0.01"
            placeholder="0.00"
          />
        </div>
      </CardContent>
    </Card>

    <!-- Itens do Orçamento -->
    <Card>
      <CardHeader>
        <div class="flex items-center justify-between">
          <h3 class="text-lg font-semibold">Itens do Orçamento</h3>
          <Button @click="addItem" size="sm">
            <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
            Adicionar Item
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div v-if="localData.itens.length === 0" class="text-center py-8 text-gray-500">
          Nenhum item adicionado. Clique em "Adicionar Item" para começar.
        </div>

        <div v-else class="space-y-4">
          <div 
            v-for="(item, index) in localData.itens" 
            :key="index"
            class="p-4 border rounded-lg space-y-3"
          >
            <div class="flex items-center justify-between mb-2">
              <span class="text-sm font-medium text-gray-700">Item {{ index + 1 }}</span>
              <Button 
                @click="removeItem(index)" 
                variant="outline" 
                size="sm"
                class="text-red-600 hover:text-red-700"
              >
                Remover
              </Button>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div class="md:col-span-2">
                <Label :for="`descricao-${index}`">Descrição *</Label>
                <Input 
                  :id="`descricao-${index}`"
                  v-model="item.descricao" 
                  placeholder="Descrição do item"
                  required
                />
              </div>

              <div>
                <Label :for="`quantidade-${index}`">Quantidade *</Label>
                <Input 
                  :id="`quantidade-${index}`"
                  v-model.number="item.quantidade" 
                  type="number" 
                  min="0.01"
                  step="0.01"
                  required
                />
              </div>

              <div>
                <Label :for="`valor-${index}`">Valor Unitário (R$) *</Label>
                <Input 
                  :id="`valor-${index}`"
                  v-model.number="item.valor_unitario" 
                  type="number" 
                  min="0"
                  step="0.01"
                  required
                />
              </div>

              <div class="md:col-span-2">
                <Label>Valor Total</Label>
                <div class="text-lg font-semibold text-gray-900 mt-2">
                  R$ {{ formatCurrency(item.quantidade * item.valor_unitario) }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>

    <!-- Resumo -->
    <Card>
      <CardHeader>
        <h3 class="text-lg font-semibold">Resumo do Orçamento</h3>
      </CardHeader>
      <CardContent class="space-y-2">
        <div class="flex justify-between text-sm">
          <span class="text-gray-600">Subtotal:</span>
          <span class="font-medium">R$ {{ formatCurrency(subtotal) }}</span>
        </div>
        <div v-if="localData.valor_desconto" class="flex justify-between text-sm text-red-600">
          <span>Desconto:</span>
          <span class="font-medium">- R$ {{ formatCurrency(localData.valor_desconto) }}</span>
        </div>
        <div class="flex justify-between text-sm">
          <span class="text-gray-600">Impostos (15.25%):</span>
          <span class="font-medium">R$ {{ formatCurrency(impostos) }}</span>
        </div>
        <div class="border-t pt-2 flex justify-between text-lg font-bold">
          <span>Total:</span>
          <span class="text-primary-600">R$ {{ formatCurrency(total) }}</span>
        </div>
      </CardContent>
    </Card>
  </div>
</template>

<script setup lang="ts">
import type { OrcamentoFormData, OrcamentoItemFormData } from '~/types'

interface Props {
  modelValue: OrcamentoFormData
  leads?: any[]
  clients?: any[]
}

const props = withDefaults(defineProps<Props>(), {
  leads: () => [],
  clients: () => []
})

const emit = defineEmits<{
  'update:modelValue': [value: OrcamentoFormData]
}>()

const localData = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

const addItem = () => {
  localData.value.itens.push({
    descricao: '',
    quantidade: 1,
    valor_unitario: 0
  })
}

const removeItem = (index: number) => {
  localData.value.itens.splice(index, 1)
}

const subtotal = computed(() => {
  return localData.value.itens.reduce((sum, item) => 
    sum + (item.quantidade * item.valor_unitario), 0
  )
})

const impostos = computed(() => {
  const valorComDesconto = subtotal.value - (localData.value.valor_desconto || 0)
  return valorComDesconto * 0.1525 // 15.25%
})

const total = computed(() => {
  return subtotal.value - (localData.value.valor_desconto || 0)
})

const formatCurrency = (value: number) => {
  return value.toFixed(2).replace('.', ',')
}
</script>
