<template>
  <div class="overflow-x-auto">
    <table class="min-w-full divide-y divide-gray-200">
      <thead class="bg-gray-50">
        <tr>
          <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            #
          </th>
          <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Descrição
          </th>
          <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
            Quantidade
          </th>
          <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
            Valor Unit.
          </th>
          <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
            Total
          </th>
        </tr>
      </thead>
      <tbody class="bg-white divide-y divide-gray-200">
        <tr v-for="(item, index) in itens" :key="item.id || index">
          <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
            {{ index + 1 }}
          </td>
          <td class="px-6 py-4 text-sm text-gray-900">
            {{ item.descricao }}
          </td>
          <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
            {{ formatNumber(item.quantidade) }}
          </td>
          <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
            R$ {{ formatCurrency(item.valor_unitario) }}
          </td>
          <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 text-right">
            R$ {{ formatCurrency(item.valor_total) }}
          </td>
        </tr>
      </tbody>
      <tfoot class="bg-gray-50">
        <tr>
          <td colspan="4" class="px-6 py-4 text-right text-sm font-medium text-gray-900">
            Total:
          </td>
          <td class="px-6 py-4 whitespace-nowrap text-sm font-bold text-primary-600 text-right">
            R$ {{ formatCurrency(total) }}
          </td>
        </tr>
      </tfoot>
    </table>
  </div>
</template>

<script setup lang="ts">
import type { OrcamentoItem } from '~/types'

interface Props {
  itens: OrcamentoItem[]
}

const props = defineProps<Props>()

const total = computed(() => {
  return props.itens.reduce((sum, item) => sum + item.valor_total, 0)
})

const formatCurrency = (value: number) => {
  return value.toFixed(2).replace('.', ',')
}

const formatNumber = (value: number) => {
  return value.toString().replace('.', ',')
}
</script>
