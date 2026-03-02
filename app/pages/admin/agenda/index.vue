<template>
  <div class="min-h-screen bg-gray-50">
    <AdminLayout>
      <div class="p-8">
        <div class="flex items-center justify-between mb-8">
          <div>
            <h1 class="text-3xl font-bold text-gray-900">Agenda</h1>
            <p class="text-gray-600 mt-2">Visualize e gerencie os agendamentos</p>
          </div>
          <Button @click="showCreateDialog = true">
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
            Novo Agendamento
          </Button>
        </div>

        <Alert v-if="error" variant="danger" class="mb-6">{{ error }}</Alert>

        <AgendaCalendar
          :items="agendaItems"
          :loading="loading"
          @item-click="handleItemClick"
          @date-change="handleDateChange"
          @view-change="handleViewChange"
        />

        <!-- Dialog para criar agendamento -->
        <div v-if="showCreateDialog" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <Card class="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <div class="flex items-center justify-between">
                <h2 class="text-xl font-semibold">Novo Agendamento</h2>
                <button @click="showCreateDialog = false" class="text-gray-500 hover:text-gray-700">
                  <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </CardHeader>
            <CardContent class="p-6">
              <AgendaForm
                :servicos="servicosDisponiveis"
                :loading="loadingCreate"
                :conflict-error="conflictError"
                @submit="handleCreate"
                @cancel="showCreateDialog = false"
              />
            </CardContent>
          </Card>
        </div>

        <!-- Dialog para editar agendamento -->
        <div v-if="showEditDialog && selectedItem" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <Card class="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <div class="flex items-center justify-between">
                <h2 class="text-xl font-semibold">Editar Agendamento</h2>
                <button @click="showEditDialog = false" class="text-gray-500 hover:text-gray-700">
                  <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </CardHeader>
            <CardContent class="p-6">
              <AgendaForm
                :agenda-item="selectedItem"
                :servicos="servicosDisponiveis"
                :loading="loadingUpdate"
                :conflict-error="conflictError"
                @submit="handleUpdate"
                @cancel="showEditDialog = false"
              />
              <div class="mt-4 pt-4 border-t">
                <Button @click="handleDeleteItem" variant="danger" :disabled="loadingDelete" class="w-full">
                  Deletar Agendamento
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  </div>
</template>

<script setup lang="ts">
import type { AgendaItemWithServico, AgendaItemFormData } from '~/types'
import { useAgenda } from '~/composables/admin/useAgenda'
import { useServicos } from '~/composables/admin/useServicos'

definePageMeta({
  middleware: ['auth', 'admin']
})

useHead({
  title: 'Agenda - Admin Nova Aliança',
  meta: [
    { name: 'robots', content: 'noindex, nofollow' },
    { name: 'googlebot', content: 'noindex, nofollow' }
  ]
})

const { agendaItems, loading, error, conflictError, loadingCreate, loadingUpdate, loadingDelete, fetchCalendarEvents, createAgendaItem, updateAgendaItem, deleteAgendaItem } = useAgenda()
const { servicos: servicosDisponiveis, fetchServicos } = useServicos()

const showCreateDialog = ref(false)
const showEditDialog = ref(false)
const selectedItem = ref<AgendaItemWithServico | null>(null)

onMounted(() => {
  fetchCalendarEvents()
  fetchServicos()
})

const handleItemClick = (item: AgendaItemWithServico) => {
  selectedItem.value = item
  showEditDialog.value = true
}

const handleDateChange = (date: string) => {
  fetchCalendarEvents()
}

const handleViewChange = (view: 'day' | 'week' | 'month') => {
  fetchCalendarEvents()
}

const handleCreate = async (data: AgendaItemFormData) => {
  const result = await createAgendaItem(data)
  if (result) {
    showCreateDialog.value = false
    await fetchCalendarEvents()
  }
}

const handleUpdate = async (data: AgendaItemFormData) => {
  if (selectedItem.value) {
    const result = await updateAgendaItem(selectedItem.value.id, data)
    if (result) {
      showEditDialog.value = false
      selectedItem.value = null
      await fetchCalendarEvents()
    }
  }
}

const handleDeleteItem = async () => {
  if (selectedItem.value && confirm('Tem certeza que deseja deletar este agendamento?')) {
    const result = await deleteAgendaItem(selectedItem.value.id)
    if (result) {
      showEditDialog.value = false
      selectedItem.value = null
      await fetchCalendarEvents()
    }
  }
}
</script>
