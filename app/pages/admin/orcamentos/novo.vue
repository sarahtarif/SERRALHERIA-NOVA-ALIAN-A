<template>
  <div class="min-h-screen bg-gray-50">
    <AdminLayout>
      <div class="p-8 max-w-5xl mx-auto">
        <div class="mb-8">
          <h1 class="text-3xl font-bold text-gray-900">Novo Orçamento</h1>
          <p class="text-gray-600 mt-2">Crie um novo orçamento para cliente ou lead</p>
        </div>

        <Alert v-if="error" variant="danger" class="mb-6">{{ error }}</Alert>

        <form @submit.prevent="handleSubmit">
          <OrcamentoForm v-model="formData" :leads="leads" :clients="clients" />

          <div class="flex gap-4 mt-6">
            <Button type="submit" :disabled="loading || !canSubmit">
              {{ loading ? 'Salvando...' : 'Salvar Orçamento' }}
            </Button>
            <Button type="button" variant="outline" @click="router.back()">
              Cancelar
            </Button>
          </div>
        </form>
      </div>
    </AdminLayout>
  </div>
</template>

<script setup lang="ts">
import type { OrcamentoFormData } from '~/types'
import { useOrcamentos } from '~/composables/admin/useOrcamentos'
import { useLeads } from '~/composables/admin/useLeads'

definePageMeta({
  middleware: ['auth', 'admin']
})

useHead({
  title: 'Novo Orçamento - Admin',
  meta: [{ name: 'robots', content: 'noindex, nofollow' }]
})

const router = useRouter()
const { user } = useAuth()
const { createOrcamento, loading, error } = useOrcamentos()
const { leads, fetchLeads } = useLeads()

// Estado para clientes
const clients = ref([])
const loadingClients = ref(false)

// Buscar leads e clientes ao montar
onMounted(async () => {
  fetchLeads()
  
  // Buscar clientes
  loadingClients.value = true
  try {
    clients.value = await $fetch('/api/admin/clients')
  } catch (e) {
    console.error('Erro ao buscar clientes:', e)
  } finally {
    loadingClients.value = false
  }
})

const formData = ref<OrcamentoFormData>({
  status: 'rascunho',
  validade_dias: 30,
  valor_desconto: 0,
  itens: []
})

const canSubmit = computed(() => {
  return formData.value.itens.length > 0 && 
         formData.value.itens.every(item => 
           item.descricao && item.quantidade > 0 && item.valor_unitario >= 0
         )
})

const handleSubmit = async () => {
  if (!user.value?.id) {
    error.value = 'Usuário não autenticado'
    return
  }

  try {
    await createOrcamento(formData.value, user.value.id)
    router.push('/admin/orcamentos')
  } catch (e) {
    console.error('Erro ao criar orçamento:', e)
  }
}
</script>
