<template>
  <div class="min-h-screen bg-gray-50">
    <AdminLayout>
      <div class="p-8">
        <div class="flex items-center justify-between mb-8">
          <div>
            <h1 class="text-3xl font-bold text-gray-900">Leads</h1>
            <p class="text-gray-600 mt-2">Gerencie seus leads e oportunidades</p>
          </div>
          <NuxtLink to="/admin/leads/novo">
            <Button>
              <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
              </svg>
              Novo Lead
            </Button>
          </NuxtLink>
        </div>

        <LeadFilters @update="handleFilterUpdate" @clear="handleFilterClear" class="mb-6" />

        <Alert v-if="error" variant="danger" class="mb-6">{{ error }}</Alert>

        <div v-if="loading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Skeleton v-for="i in 6" :key="i" class="h-40" />
        </div>

        <div v-else-if="!hasLeads" class="text-center py-12">
          <p class="text-gray-500">Nenhum lead encontrado</p>
        </div>

        <div v-else>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            <LeadCard v-for="lead in leads" :key="lead.id" :lead="lead" @click="goToLead" />
          </div>

          <div class="flex items-center justify-between">
            <p class="text-sm text-gray-600">
              Mostrando {{ leads.length }} de {{ pagination.total }} leads
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
import type { Lead, LeadFilters } from '~/types'
import { useLeads } from '~/composables/admin/useLeads'

definePageMeta({
  middleware: ['auth', 'admin']
})

useHead({
  title: 'Leads - Admin Nova Aliança',
  meta: [
    { name: 'robots', content: 'noindex, nofollow' },
    { name: 'googlebot', content: 'noindex, nofollow' }
  ]
})

const router = useRouter()
const { leads, loading, error, pagination, hasLeads, hasNextPage, hasPrevPage, fetchLeads, setFilters, clearFilters, setPage } = useLeads()

onMounted(() => {
  fetchLeads()
})

const handleFilterUpdate = (filters: LeadFilters) => {
  setFilters(filters)
  fetchLeads()
}

const handleFilterClear = () => {
  clearFilters()
  fetchLeads()
}

const goToLead = (lead: Lead) => {
  router.push(`/admin/leads/${lead.id}`)
}

const nextPage = () => {
  setPage(pagination.value.page + 1)
  fetchLeads()
}

const prevPage = () => {
  setPage(pagination.value.page - 1)
  fetchLeads()
}
</script>
