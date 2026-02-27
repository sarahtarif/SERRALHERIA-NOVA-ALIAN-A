<template>
  <div class="min-h-screen bg-gray-50">
    <AdminLayout>
      <div class="p-8">
        <div class="flex items-center justify-between mb-8">
          <div>
            <h1 class="text-3xl font-bold text-gray-900">Orçamentos</h1>
            <p class="text-gray-600 mt-2">Gerencie seus orçamentos</p>
          </div>
          <NuxtLink to="/admin/orcamentos/novo">
            <Button>Novo Orçamento</Button>
          </NuxtLink>
        </div>

        <Alert v-if="error" variant="danger" class="mb-6">{{ error }}</Alert>

        <div v-if="loading" class="space-y-4">
          <Skeleton v-for="i in 5" :key="i" class="h-24" />
        </div>

        <div v-else-if="!hasOrcamentos" class="text-center py-12">
          <p class="text-gray-500">Nenhum orçamento encontrado</p>
        </div>

        <div v-else class="space-y-4">
          <Card v-for="orc in orcamentos" :key="orc.id" class="hover:shadow-md transition-shadow cursor-pointer" @click="$router.push(`/admin/orcamentos/${orc.id}`)">
            <CardContent class="p-4">
              <div class="flex items-center justify-between">
                <div>
                  <h3 class="font-semibold">{{ orc.numero }}</h3>
                  <p class="text-sm text-gray-600">R$ {{ orc.valor_final.toFixed(2) }}</p>
                </div>
                <Badge :variant="getStatusVariant(orc.status)">{{ orc.status }}</Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  </div>
</template>

<script setup lang="ts">
import { useOrcamentos } from '~/composables/admin/useOrcamentos'

definePageMeta({
  middleware: ['auth', 'admin']
})

useHead({
  title: 'Orçamentos - Admin',
  meta: [{ name: 'robots', content: 'noindex, nofollow' }]
})

const { orcamentos, loading, error, hasOrcamentos, fetchOrcamentos } = useOrcamentos()

onMounted(() => {
  fetchOrcamentos()
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
</script>
