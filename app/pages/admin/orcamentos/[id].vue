<template>
  <div class="min-h-screen bg-gray-50">
    <AdminLayout>
      <div class="p-8 max-w-5xl mx-auto">
        <div v-if="loading" class="space-y-4">
          <Skeleton class="h-8 w-64" />
          <Skeleton class="h-96" />
        </div>

        <div v-else-if="selectedOrcamento">
          <div class="flex items-center justify-between mb-8">
            <div>
              <h1 class="text-3xl font-bold text-gray-900">{{ selectedOrcamento.numero }}</h1>
              <p class="text-gray-600 mt-2">Detalhes do orçamento</p>
            </div>
            <div class="flex gap-2">
              <Badge :variant="getStatusVariant(selectedOrcamento.status)">
                {{ getStatusLabel(selectedOrcamento.status) }}
              </Badge>
            </div>
          </div>

          <!-- Informações do Orçamento -->
          <Card class="mb-6">
            <CardHeader>
              <h2 class="text-xl font-bold">Informações</h2>
            </CardHeader>
            <CardContent class="space-y-4">
              <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p class="text-sm text-gray-600">Número</p>
                  <p class="font-medium">{{ selectedOrcamento.numero }}</p>
                </div>
                <div>
                  <p class="text-sm text-gray-600">Status</p>
                  <p class="font-medium">{{ getStatusLabel(selectedOrcamento.status) }}</p>
                </div>
                <div>
                  <p class="text-sm text-gray-600">Validade</p>
                  <p class="font-medium">{{ selectedOrcamento.validade_dias }} dias</p>
                </div>
                <div>
                  <p class="text-sm text-gray-600">Data Validade</p>
                  <p class="font-medium">{{ formatDate(selectedOrcamento.data_validade) }}</p>
                </div>
              </div>

              <div v-if="selectedOrcamento.observacoes">
                <p class="text-sm text-gray-600">Observações</p>
                <p class="mt-1">{{ selectedOrcamento.observacoes }}</p>
              </div>
            </CardContent>
          </Card>

          <!-- Itens do Orçamento -->
          <Card class="mb-6">
            <CardHeader>
              <h2 class="text-xl font-bold">Itens</h2>
            </CardHeader>
            <CardContent>
              <OrcamentoItensTable :itens="selectedOrcamento.itens" />
            </CardContent>
          </Card>

          <!-- Resumo Financeiro -->
          <Card class="mb-6">
            <CardHeader>
              <h2 class="text-xl font-bold">Resumo Financeiro</h2>
            </CardHeader>
            <CardContent class="space-y-2">
              <div class="flex justify-between">
                <span class="text-gray-600">Valor Total:</span>
                <span class="font-medium">R$ {{ formatCurrency(selectedOrcamento.valor_total) }}</span>
              </div>
              <div v-if="selectedOrcamento.valor_desconto" class="flex justify-between text-red-600">
                <span>Desconto:</span>
                <span class="font-medium">- R$ {{ formatCurrency(selectedOrcamento.valor_desconto) }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">Impostos:</span>
                <span class="font-medium">R$ {{ formatCurrency(selectedOrcamento.impostos || 0) }}</span>
              </div>
              <div class="border-t pt-2 flex justify-between text-lg font-bold">
                <span>Valor Final:</span>
                <span class="text-primary-600">R$ {{ formatCurrency(selectedOrcamento.valor_final) }}</span>
              </div>
            </CardContent>
          </Card>

          <!-- Ações -->
          <div class="flex gap-4">
            <Button @click="handleGerarPdf" :disabled="loadingPdf">
              {{ loadingPdf ? 'Gerando PDF...' : 'Gerar PDF' }}
            </Button>
            <Button @click="handleEnviarEmail" :disabled="loadingEmail" variant="outline">
              {{ loadingEmail ? 'Enviando...' : 'Enviar por Email' }}
            </Button>
            <Button @click="router.back()" variant="outline">Voltar</Button>
          </div>
        </div>

        <Alert v-else-if="error" variant="danger">{{ error }}</Alert>
      </div>
    </AdminLayout>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: ['auth', 'admin']
})

const route = useRoute()
const router = useRouter()
const { selectedOrcamento, loading, error, fetchOrcamentoById } = useOrcamentos()

const loadingPdf = ref(false)
const loadingEmail = ref(false)

const orcamentoId = computed(() => route.params.id as string)

onMounted(() => {
  fetchOrcamentoById(orcamentoId.value)
})

useHead({
  title: computed(() => selectedOrcamento.value ? `${selectedOrcamento.value.numero} - Orçamentos` : 'Orçamento'),
  meta: [{ name: 'robots', content: 'noindex, nofollow' }]
})

const getStatusVariant = (status: string) => {
  const variants: Record<string, 'default' | 'success' | 'warning' | 'danger' | 'info'> = {
    'rascunho': 'default',
    'enviado': 'info',
    'aprovado': 'success',
    'rejeitado': 'danger',
    'expirado': 'warning'
  }
  return variants[status] || 'default'
}

const getStatusLabel = (status: string) => {
  const labels: Record<string, string> = {
    'rascunho': 'Rascunho',
    'enviado': 'Enviado',
    'aprovado': 'Aprovado',
    'rejeitado': 'Rejeitado',
    'expirado': 'Expirado'
  }
  return labels[status] || status
}

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('pt-BR')
}

const formatCurrency = (value: number) => {
  return value.toFixed(2).replace('.', ',')
}

const handleGerarPdf = async () => {
  loadingPdf.value = true
  try {
    // TODO: Implementar geração de PDF
    console.log('Gerar PDF para:', orcamentoId.value)
    alert('Funcionalidade de PDF será implementada')
  } catch (e) {
    console.error('Erro ao gerar PDF:', e)
  } finally {
    loadingPdf.value = false
  }
}

const handleEnviarEmail = async () => {
  loadingEmail.value = true
  try {
    // TODO: Implementar envio de email
    console.log('Enviar email para:', orcamentoId.value)
    alert('Funcionalidade de email será implementada')
  } catch (e) {
    console.error('Erro ao enviar email:', e)
  } finally {
    loadingEmail.value = false
  }
}
</script>
