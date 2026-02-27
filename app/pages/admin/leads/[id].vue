<template>
  <div class="min-h-screen bg-gray-50">
    <AdminLayout>
      <div class="p-8 max-w-4xl mx-auto">
        <div v-if="loading" class="space-y-4">
          <Skeleton class="h-8 w-64" />
          <Skeleton class="h-64" />
        </div>

        <div v-else-if="selectedLead">
          <div class="flex items-center justify-between mb-8">
            <h1 class="text-3xl font-bold text-gray-900">{{ selectedLead.name }}</h1>
            <Badge :variant="statusVariant">{{ statusLabel }}</Badge>
          </div>

          <Card class="mb-6">
            <CardHeader>
              <h2 class="text-xl font-bold">Informações do Lead</h2>
            </CardHeader>
            <CardContent class="space-y-4">
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <p class="text-sm text-gray-600">WhatsApp</p>
                  <p class="font-medium">{{ selectedLead.whatsapp }}</p>
                </div>
                <div>
                  <p class="text-sm text-gray-600">Serviço</p>
                  <p class="font-medium">{{ selectedLead.service_type }}</p>
                </div>
                <div>
                  <p class="text-sm text-gray-600">Bairro</p>
                  <p class="font-medium">{{ selectedLead.neighborhood || 'Não informado' }}</p>
                </div>
                <div>
                  <p class="text-sm text-gray-600">Origem</p>
                  <p class="font-medium">{{ selectedLead.source }}</p>
                </div>
              </div>
              
              <div v-if="selectedLead.message">
                <p class="text-sm text-gray-600">Mensagem</p>
                <p class="mt-1">{{ selectedLead.message }}</p>
              </div>
            </CardContent>
          </Card>

          <div class="flex gap-4">
            <Button @click="router.back()" variant="outline">Voltar</Button>
          </div>
        </div>

        <Alert v-else-if="error" variant="danger">{{ error }}</Alert>
      </div>
    </AdminLayout>
  </div>
</template>

<script setup lang="ts">
import { useLeads } from '~/composables/admin/useLeads'

definePageMeta({
  middleware: ['auth', 'admin']
})

const route = useRoute()
const router = useRouter()
const { selectedLead, loading, error, fetchLeadById } = useLeads()

const leadId = computed(() => route.params.id as string)

onMounted(() => {
  fetchLeadById(leadId.value)
})

useHead({
  title: computed(() => selectedLead.value ? `${selectedLead.value.name} - Leads` : 'Lead - Admin'),
  meta: [
    { name: 'robots', content: 'noindex, nofollow' }
  ]
})

const statusVariant = computed(() => {
  const variants: Record<string, 'default' | 'success' | 'warning' | 'danger' | 'info'> = {
    'novo': 'default',
    'em_contato': 'warning',
    'proposta': 'info',
    'fechado': 'success',
    'perdido': 'danger'
  }
  return variants[selectedLead.value?.status || 'novo'] || 'default'
})

const statusLabel = computed(() => {
  const labels: Record<string, string> = {
    'novo': 'Novo',
    'em_contato': 'Em Contato',
    'proposta': 'Proposta',
    'fechado': 'Fechado',
    'perdido': 'Perdido'
  }
  return labels[selectedLead.value?.status || 'novo'] || 'Novo'
})
</script>
