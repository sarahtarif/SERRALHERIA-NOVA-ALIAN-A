<script setup lang="ts">
import { ref, computed } from 'vue'

interface NotaFiscal {
  id: string
  numero: string
  descricao: string
  dataEmissao: string
  valor: number
  status: 'autorizada' | 'pendente' | 'cancelada'
  arquivos: { pdf: string; xml: string }
}

const notasFiscais = ref<NotaFiscal[]>([])

const searchQuery = ref('')
const statusFilter = ref<string>('todos')

const statusOptions = [
  { value: 'todos',      label: 'Todos os status' },
  { value: 'autorizada', label: 'Autorizadas' },
  { value: 'pendente',   label: 'Pendentes' },
  { value: 'cancelada',  label: 'Canceladas' },
]

const notasFiltradas = computed<NotaFiscal[]>(() => {
  let resultado: NotaFiscal[] = notasFiscais.value
  if (searchQuery.value) {
    resultado = resultado.filter((nf: NotaFiscal) =>
      nf.numero.includes(searchQuery.value) ||
      nf.descricao.toLowerCase().includes(searchQuery.value.toLowerCase())
    )
  }
  if (statusFilter.value !== 'todos') {
    resultado = resultado.filter((nf: NotaFiscal) => nf.status === statusFilter.value)
  }
  return resultado
})

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value)
}

function formatDate(date: string): string {
  return new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(new Date(date))
}

function getStatusConfig(status: string): { label: string; class: string } {
  const configs: Record<string, { label: string; class: string }> = {
    autorizada: { label: 'Autorizada', class: 'bg-green-100 text-green-700 border-green-200' },
    pendente:   { label: 'Pendente',   class: 'bg-yellow-100 text-yellow-700 border-yellow-200' },
    cancelada:  { label: 'Cancelada',  class: 'bg-red-100 text-red-700 border-red-200' },
  }
  return configs[status] ?? configs['pendente']!
}

function downloadFile(url: string, tipo: 'PDF' | 'XML') {
  console.log(`Baixando ${tipo}:`, url)
}
</script>

<template>
  <div class="w-full max-w-6xl mx-auto">

    <!-- Filtros — só aparecem quando houver notas -->
    <div v-if="notasFiscais.length" class="mb-6 flex flex-col sm:flex-row gap-4">
      <div class="flex-1 relative">
        <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
        </svg>
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Buscar por número ou descrição..."
          class="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
        />
      </div>
      <select
        v-model="statusFilter"
        class="px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-white"
      >
        <option v-for="opt in statusOptions" :key="opt.value" :value="opt.value">{{ opt.label }}</option>
      </select>
    </div>

    <!-- Lista -->
    <div v-if="notasFiltradas.length" class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div
        v-for="nf in notasFiltradas" :key="nf.id"
        class="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow border border-gray-100"
      >
        <div class="flex items-start justify-between mb-4">
          <div>
            <h3 class="text-lg font-semibold text-gray-900">NF-e #{{ nf.numero }}</h3>
            <p class="text-sm text-gray-600 mt-1">{{ nf.descricao }}</p>
          </div>
          <span :class="['px-3 py-1 rounded-full text-xs font-medium border', getStatusConfig(nf.status).class]">
            {{ getStatusConfig(nf.status).label }}
          </span>
        </div>
        <div class="flex items-center justify-between mb-6 pb-4 border-b border-gray-100">
          <div class="flex items-center gap-2 text-sm text-gray-600">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
            </svg>
            {{ formatDate(nf.dataEmissao) }}
          </div>
          <div class="text-lg font-bold text-primary">{{ formatCurrency(nf.valor) }}</div>
        </div>
        <div class="flex gap-2">
          <button
            @click="downloadFile(nf.arquivos.pdf, 'PDF')"
            class="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-primary text-white font-medium text-sm hover:brightness-110 transition-all"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
            </svg>
            PDF
          </button>
          <button
            @click="downloadFile(nf.arquivos.xml, 'XML')"
            class="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border-2 border-primary text-primary font-medium text-sm hover:bg-primary hover:text-white transition-all"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"/>
            </svg>
            XML
          </button>
        </div>
      </div>
    </div>

    <!-- Empty state -->
    <div v-else class="text-center py-16">
      <svg class="w-14 h-14 mx-auto text-gray-200 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5">
        <path stroke-linecap="round" stroke-linejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
      </svg>
      <p class="text-sm font-medium text-gray-500">Nenhuma nota fiscal disponível</p>
      <p class="text-xs text-gray-400 mt-1">Suas notas fiscais aparecerão aqui quando emitidas</p>
    </div>

  </div>
</template>
