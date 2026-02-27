<template>
  <div class="min-h-screen bg-gray-50">
    <AdminLayout>
      <div class="p-8">
        <div class="mb-8">
          <h1 class="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p class="text-gray-600 mt-2">Visão geral do negócio</p>
        </div>

        <!-- Loading State -->
        <div v-if="loading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Skeleton v-for="i in 4" :key="i" class="h-32" />
        </div>

        <!-- Error State -->
        <Alert v-if="error && !loading" variant="danger" class="mb-8">
          <p>{{ error }}</p>
          <button @click="refreshDashboard" class="mt-2 text-sm underline">
            Tentar novamente
          </button>
        </Alert>

        <!-- KPIs Grid -->
        <div v-if="!loading && !error" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <!-- Leads do Mês -->
          <AdminKpiCard
            label="Leads do Mês"
            :value="stats.leadsDoMes"
            change="+12% vs mês anterior"
            change-type="positive"
            color="blue"
            :icon="icons.leads"
          />

          <!-- Taxa de Conversão -->
          <AdminKpiCard
            label="Taxa de Conversão"
            :value="`${stats.taxaConversao}%`"
            change="+3% vs mês anterior"
            change-type="positive"
            color="green"
            :icon="icons.conversion"
          />

          <!-- Serviços Agendados -->
          <AdminKpiCard
            label="Serviços Esta Semana"
            :value="stats.servicosAgendados"
            :change="`${stats.servicosHoje} hoje`"
            change-type="neutral"
            color="orange"
            :icon="icons.calendar"
          />

          <!-- Receita do Mês -->
          <AdminKpiCard
            label="Receita do Mês"
            :value="`R$ ${formatCurrency(stats.receitaMes)}`"
            change="+18% vs mês anterior"
            change-type="positive"
            color="green"
            :icon="icons.revenue"
          />
        </div>

        <!-- Leads Recentes e Ações Rápidas -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <!-- Leads Recentes -->
          <Card class="lg:col-span-2">
            <CardHeader>
              <div class="flex items-center justify-between">
                <h2 class="text-xl font-bold text-gray-900">Leads Recentes</h2>
                <NuxtLink to="/admin/leads" class="text-sm text-primary-600 hover:text-primary-700 font-medium">
                  Ver todos →
                </NuxtLink>
              </div>
            </CardHeader>
            <CardContent>
              <!-- Loading State -->
              <div v-if="loading" class="space-y-4">
                <Skeleton v-for="i in 4" :key="i" class="h-20" />
              </div>

              <!-- Empty State -->
              <div v-else-if="!hasLeads" class="text-center py-8">
                <p class="text-gray-500">Nenhum lead recente</p>
              </div>

              <!-- Leads List -->
              <div v-else class="space-y-4">
                <DashboardLeadCard
                  v-for="lead in recentLeads"
                  :key="lead.id"
                  :lead="lead"
                />
              </div>
            </CardContent>
          </Card>

          <!-- Ações Rápidas -->
          <Card>
            <CardHeader>
              <h2 class="text-xl font-bold text-gray-900">Ações Rápidas</h2>
            </CardHeader>
            <CardContent>
              <div class="space-y-3">
                <NuxtLink to="/admin/leads/novo" class="block p-4 bg-primary-50 hover:bg-primary-100 rounded-lg transition-colors">
                  <div class="flex items-center space-x-3">
                    <div class="w-10 h-10 bg-primary-500 rounded-lg flex items-center justify-center">
                      <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                      </svg>
                    </div>
                    <div>
                      <p class="font-medium text-gray-900">Novo Lead</p>
                      <p class="text-sm text-gray-600">Registrar contato</p>
                    </div>
                  </div>
                </NuxtLink>

                <NuxtLink to="/admin/servicos/novo" class="block p-4 bg-green-50 hover:bg-green-100 rounded-lg transition-colors">
                  <div class="flex items-center space-x-3">
                    <div class="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                      <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                    </div>
                    <div>
                      <p class="font-medium text-gray-900">Novo Serviço</p>
                      <p class="text-sm text-gray-600">Agendar instalação</p>
                    </div>
                  </div>
                </NuxtLink>

                <NuxtLink to="/admin/agenda" class="block p-4 bg-orange-50 hover:bg-orange-100 rounded-lg transition-colors">
                  <div class="flex items-center space-x-3">
                    <div class="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center">
                      <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <p class="font-medium text-gray-900">Ver Agenda</p>
                      <p class="text-sm text-gray-600">Serviços agendados</p>
                    </div>
                  </div>
                </NuxtLink>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  </div>
</template>

<script setup lang="ts">
// Proteção SEO e middleware
definePageMeta({
  middleware: ['auth', 'admin']
})

useHead({
  title: 'Dashboard - Admin Nova Aliança',
  meta: [
    { name: 'robots', content: 'noindex, nofollow' },
    { name: 'googlebot', content: 'noindex, nofollow' }
  ]
})

// Import do composable
import { useDashboard } from '~/composables/admin/useDashboard'

// Composable do dashboard
const { 
  stats, 
  recentLeads, 
  loading, 
  error, 
  hasData,
  refreshDashboard 
} = useDashboard()

// Computed
const hasLeads = computed(() => recentLeads.value.length > 0)

// Carregar dados ao montar
onMounted(() => {
  refreshDashboard()
})

// Helpers
const formatCurrency = (value: number) => {
  return value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })
}

// Ícones SVG
const icons = {
  leads: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>',
  conversion: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>',
  calendar: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>',
  revenue: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>'
}
</script>
