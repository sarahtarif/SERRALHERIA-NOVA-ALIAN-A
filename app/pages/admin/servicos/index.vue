<template>
  <div class="min-h-screen bg-gray-50">
    <AdminLayout>
      <div class="p-8">
        <div class="flex items-center justify-between mb-8">
          <div>
            <h1 class="text-3xl font-bold text-gray-900">Serviços</h1>
            <p class="text-gray-600 mt-2">Gerencie todos os serviços prestados</p>
          </div>
          <NuxtLink to="/admin/servicos/novo">
            <Button>
              <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
              </svg>
              Novo Serviço
            </Button>
          </NuxtLink>
        </div>

        <ServicoFilters @update="handleFilterUpdate" @clear="handleFilterClear" class="mb-6" />

        <Alert v-if="error" variant="danger" class="mb-6">{{ error }}</Alert>

        <div v-if="loading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Skeleton v-for="i in 6" :key="i" class="h-48" />
        </div>

        <div v-else-if="!hasServicos" class="text-center py-12">
          <svg class="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          <p class="text-gray-500">Nenhum serviço encontrado</p>
        </div>

        <div v-else>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            <ServicoCard
              v-for="servico in servicos"
              :key="servico.id"
              :servico="servico"
              @click="goToServico"
            />
          </div>

          <div class="flex items-center justify-between">
            <p class="text-sm text-gray-600">
              Mostrando {{ servicos.length }} de {{ pagination.total }} serviços
            </p>
            <div class="flex gap-2">
              <Button @click="prevPage" :disabled="!hasPrevPage" variant="outline">Anterior</Button>
              <Button @click="nextPage" :disabled="!hasNextPage" variant="outline">Próxima</Button>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  </div>
</template>

<script setup lang="ts">
import type { Servico, ServicoFilters } from '~/types'
import { useServicos } from '~/composables/admin/useServicos'

definePageMeta({
  middleware: ['auth', 'admin']
})

useHead({
  title: 'Serviços - Admin Nova Aliança',
  meta: [
    { name: 'robots', content: 'noindex, nofollow' },
    { name: 'googlebot', content: 'noindex, nofollow' }
  ]
})

const router = useRouter()
const { servicos, loading, error, pagination, hasServicos, hasNextPage, hasPrevPage, fetchServicos, setFilters, clearFilters, setPage } = useServicos()

onMounted(() => {
  fetchServicos()
})

const handleFilterUpdate = (filters: ServicoFilters) => {
  setFilters(filters)
  fetchServicos()
}

const handleFilterClear = () => {
  clearFilters()
  fetchServicos()
}

const goToServico = (servico: Servico) => {
  router.push(`/admin/servicos/${servico.id}`)
}

const nextPage = () => {
  setPage(pagination.value.page + 1)
  fetchServicos()
}

const prevPage = () => {
  setPage(pagination.value.page - 1)
  fetchServicos()
}
</script>
