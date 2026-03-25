<script setup lang="ts">
import { ref, computed } from 'vue'
import { useAuth } from '~/composables/useAuth'
import { useClienteNotificacoes } from '~/composables/useClienteNotificacoes'
import ClienteHeader from '~/components/ClienteHeader.vue'
import SolicitarServico from '~/components/SolicitarServico.vue'
import ClienteSolicitacoes from '~/components/ClienteSolicitacoes.vue'
import ClienteNotasFiscais from '~/components/ClienteNotasFiscais.vue'
import ClienteAgendamentos from '~/components/ClienteAgendamentos.vue'

definePageMeta({ middleware: 'auth' })

const { user } = useAuth()
const userName = computed(() => user.value?.email ?? 'Cliente')
const showSolicitar = ref(false)
const activeTab = ref<'solicitacoes' | 'agendamentos' | 'notas'>('solicitacoes')

const { badgeSolicitacoes, badgeAgendamentos, badgeNotas, marcarVisto } = useClienteNotificacoes()

type TabId = 'solicitacoes' | 'agendamentos' | 'notas'

const tabs: { id: TabId; label: string; icon: string }[] = [
  { id: 'solicitacoes', label: 'Solicitações',  icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2' },
  { id: 'agendamentos', label: 'Agendamentos',  icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' },
  { id: 'notas',        label: 'Notas Fiscais', icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
]

const badges: Record<TabId, ReturnType<typeof ref<boolean>>> = {
  solicitacoes: badgeSolicitacoes,
  agendamentos: badgeAgendamentos,
  notas: badgeNotas,
}

function selectTab(id: TabId) {
  activeTab.value = id
  marcarVisto(id)
}
</script>

<template>
  <div id="cliente-page" class="min-h-screen bg-bg-primary flex flex-col">
    <ClienteHeader />

    <main class="flex-1 flex flex-col items-center gap-8 px-4 pt-10 pb-20">
      <div class="text-center">
        <h1 class="text-3xl font-bold text-text-primary mb-2">Seja bem-vindo</h1>
        <p class="text-text-secondary">{{ userName }}</p>
      </div>

      <button
        id="btn-abrir-solicitacao"
        class="flex items-center gap-3 px-8 py-4 rounded-xl bg-primary text-on-primary font-semibold text-base hover:brightness-110 transition-all shadow-lg shadow-primary/20"
        @click="showSolicitar = true"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4"/>
        </svg>
        Solicitar um Serviço
      </button>

      <!-- Tabs -->
      <div class="w-full max-w-6xl">
        <div class="flex border-b border-gray-200 mb-6 overflow-x-auto scrollbar-hide">
          <button
            v-for="tab in tabs"
            :key="tab.id"
            @click="selectTab(tab.id)"
            :class="[
              'flex items-center gap-2 px-4 py-3 font-medium text-sm transition-all relative whitespace-nowrap shrink-0',
              activeTab === tab.id ? 'text-primary' : 'text-gray-500 hover:text-gray-800'
            ]"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" :d="tab.icon"/>
            </svg>
            {{ tab.label }}
            <!-- Badge de notificação -->
            <span
              v-if="badges[tab.id].value"
              class="w-2 h-2 rounded-full bg-red-500 shrink-0"
            />
            <div
              v-if="activeTab === tab.id"
              class="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
            />
          </button>
        </div>

        <!-- Tab Content -->
        <div class="mt-6">
          <ClienteSolicitacoes v-if="activeTab === 'solicitacoes'" />
          <ClienteAgendamentos v-else-if="activeTab === 'agendamentos'" />
          <ClienteNotasFiscais v-else-if="activeTab === 'notas'" />
        </div>
      </div>
    </main>

    <SolicitarServico v-if="showSolicitar" @close="showSolicitar = false" />
  </div>
</template>
