<template>
  <div class="min-h-screen bg-gray-50">
    <AdminLayout>
      <div class="p-8">
        <div class="mb-8">
          <h1 class="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p class="text-gray-600 mt-2">Visão geral do negócio</p>
        </div>

        <!-- KPIs Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <!-- Leads do Mês -->
          <Card class="hover:shadow-lg transition-shadow">
            <CardContent class="p-6">
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-sm font-medium text-gray-600">Leads do Mês</p>
                  <p class="text-3xl font-bold text-gray-900 mt-2">{{ stats.leadsDoMes }}</p>
                  <p class="text-sm text-green-600 mt-1">+12% vs mês anterior</p>
                </div>
                <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
              </div>
            </CardContent>
          </Card>

          <!-- Taxa de Conversão -->
          <Card class="hover:shadow-lg transition-shadow">
            <CardContent class="p-6">
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-sm font-medium text-gray-600">Taxa de Conversão</p>
                  <p class="text-3xl font-bold text-gray-900 mt-2">{{ stats.taxaConversao }}%</p>
                  <p class="text-sm text-green-600 mt-1">+3% vs mês anterior</p>
                </div>
                <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
            </CardContent>
          </Card>

          <!-- Serviços Agendados -->
          <Card class="hover:shadow-lg transition-shadow">
            <CardContent class="p-6">
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-sm font-medium text-gray-600">Serviços Esta Semana</p>
                  <p class="text-3xl font-bold text-gray-900 mt-2">{{ stats.servicosAgendados }}</p>
                  <p class="text-sm text-blue-600 mt-1">{{ stats.servicosHoje }} hoje</p>
                </div>
                <div class="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  <svg class="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              </div>
            </CardContent>
          </Card>

          <!-- Receita do Mês -->
          <Card class="hover:shadow-lg transition-shadow">
            <CardContent class="p-6">
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-sm font-medium text-gray-600">Receita do Mês</p>
                  <p class="text-3xl font-bold text-gray-900 mt-2">R$ {{ formatCurrency(stats.receitaMes) }}</p>
                  <p class="text-sm text-green-600 mt-1">+18% vs mês anterior</p>
                </div>
                <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
            </CardContent>
          </Card>
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
              <div class="space-y-4">
                <div v-for="lead in recentLeads" :key="lead.id" class="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div class="flex-1">
                    <p class="font-medium text-gray-900">{{ lead.name }}</p>
                    <p class="text-sm text-gray-600">{{ lead.service }} • {{ lead.neighborhood }}</p>
                    <p class="text-xs text-gray-500 mt-1">{{ lead.time }}</p>
                  </div>
                  <Badge :variant="getStatusVariant(lead.status)">
                    {{ lead.status }}
                  </Badge>
                </div>
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

// Dados mockados (substituir por API real)
const stats = ref({
  leadsDoMes: 47,
  taxaConversao: 32,
  servicosAgendados: 12,
  servicosHoje: 3,
  receitaMes: 28500
})

const recentLeads = ref([
  { id: 1, name: 'João Silva', service: 'Rede para Sacada', neighborhood: 'Moema', time: 'Há 15 minutos', status: 'Novo' },
  { id: 2, name: 'Maria Santos', service: 'Proteção para Pets', neighborhood: 'Pinheiros', time: 'Há 1 hora', status: 'Em Contato' },
  { id: 3, name: 'Pedro Costa', service: 'Rede para Varanda', neighborhood: 'Vila Mariana', time: 'Há 2 horas', status: 'Proposta' },
  { id: 4, name: 'Ana Oliveira', service: 'Proteção para Idosos', neighborhood: 'Itaim Bibi', time: 'Há 3 horas', status: 'Novo' }
])

const formatCurrency = (value: number) => {
  return value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })
}

const getStatusVariant = (status: string) => {
  const variants: Record<string, string> = {
    'Novo': 'default',
    'Em Contato': 'warning',
    'Proposta': 'info',
    'Fechado': 'success',
    'Perdido': 'danger'
  }
  return variants[status] || 'default'
}
</script>
