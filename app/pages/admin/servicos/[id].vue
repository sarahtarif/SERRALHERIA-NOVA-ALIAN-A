<template>
  <div class="min-h-screen bg-gray-50">
    <AdminLayout>
      <div class="p-8 max-w-6xl mx-auto">
        <div class="mb-8">
          <NuxtLink to="/admin/servicos" class="text-blue-600 hover:text-blue-700 flex items-center gap-2 mb-4">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
            Voltar para Serviços
          </NuxtLink>
          <div class="flex items-center justify-between">
            <div>
              <h1 class="text-3xl font-bold text-gray-900">Detalhes do Serviço</h1>
              <p class="text-gray-600 mt-2">Visualize e edite as informações do serviço</p>
            </div>
            <div class="flex gap-2">
              <Button @click="handleDelete" variant="danger" :disabled="loading">
                <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Deletar
              </Button>
            </div>
          </div>
        </div>

        <div v-if="loadingServico" class="space-y-6">
          <Skeleton class="h-96" />
        </div>

        <div v-else-if="!servico" class="text-center py-12">
          <p class="text-gray-500">Serviço não encontrado</p>
        </div>

        <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div class="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <h2 class="text-xl font-semibold">Informações do Serviço</h2>
              </CardHeader>
              <CardContent class="p-6">
                <Alert v-if="error" variant="danger" class="mb-6">{{ error }}</Alert>
                <Alert v-if="success" variant="success" class="mb-6">Serviço atualizado com sucesso!</Alert>

                <ServicoForm
                  :servico="servico"
                  :loading="loading"
                  @submit="handleUpdate"
                  @cancel="handleCancel"
                />
              </CardContent>
            </Card>
          </div>

          <div class="space-y-6">
            <Card>
              <CardHeader>
                <h2 class="text-xl font-semibold">Ações Rápidas</h2>
              </CardHeader>
              <CardContent class="p-6 space-y-3">
                <Button
                  @click="updateStatus('agendado')"
                  :disabled="servico.status === 'agendado' || loading"
                  variant="outline"
                  class="w-full"
                >
                  Marcar como Agendado
                </Button>
                <Button
                  @click="updateStatus('em_execucao')"
                  :disabled="servico.status === 'em_execucao' || loading"
                  variant="outline"
                  class="w-full"
                >
                  Iniciar Execução
                </Button>
                <Button
                  @click="updateStatus('concluido')"
                  :disabled="servico.status === 'concluido' || loading"
                  variant="outline"
                  class="w-full"
                >
                  Marcar como Concluído
                </Button>
                <Button
                  @click="updateStatus('cancelado')"
                  :disabled="servico.status === 'cancelado' || loading"
                  variant="outline"
                  class="w-full"
                >
                  Cancelar Serviço
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <h2 class="text-xl font-semibold">Informações</h2>
              </CardHeader>
              <CardContent class="p-6 space-y-3 text-sm">
                <div>
                  <p class="text-gray-600">Status</p>
                  <Badge :variant="getStatusVariant(servico.status)">
                    {{ getStatusLabel(servico.status) }}
                  </Badge>
                </div>
                <div>
                  <p class="text-gray-600">Criado em</p>
                  <p class="font-semibold">{{ formatDate(servico.created_at) }}</p>
                </div>
                <div v-if="servico.data_inicio">
                  <p class="text-gray-600">Iniciado em</p>
                  <p class="font-semibold">{{ formatDate(servico.data_inicio) }}</p>
                </div>
                <div v-if="servico.data_conclusao">
                  <p class="text-gray-600">Concluído em</p>
                  <p class="font-semibold">{{ formatDate(servico.data_conclusao) }}</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AdminLayout>
  </div>
</template>

<script setup lang="ts">
import type { ServicoFormData } from '~/types'
import { useServicos } from '~/composables/admin/useServicos'

definePageMeta({
  middleware: ['auth', 'admin']
})

useHead({
  title: 'Detalhes do Serviço - Admin Nova Aliança',
  meta: [
    { name: 'robots', content: 'noindex, nofollow' },
    { name: 'googlebot', content: 'noindex, nofollow' }
  ]
})

const route = useRoute()
const router = useRouter()
const servicoId = route.params.id as string

const { servico, loading, loadingServico, error, success, fetchServicoById, updateServico, updateServicoStatus, deleteServico } = useServicos()

onMounted(() => {
  fetchServicoById(servicoId)
})

const handleUpdate = async (data: ServicoFormData) => {
  await updateServico(servicoId, data)
}

const updateStatus = async (status: 'agendado' | 'em_execucao' | 'concluido' | 'cancelado') => {
  await updateServicoStatus(servicoId, status)
  await fetchServicoById(servicoId)
}

const handleDelete = async () => {
  if (confirm('Tem certeza que deseja deletar este serviço?')) {
    const result = await deleteServico(servicoId)
    if (result) {
      router.push('/admin/servicos')
    }
  }
}

const handleCancel = () => {
  router.push('/admin/servicos')
}

const getStatusVariant = (status: string) => {
  const variants: Record<string, 'default' | 'success' | 'warning' | 'danger' | 'info'> = {
    'agendado': 'info',
    'em_execucao': 'warning',
    'concluido': 'success',
    'cancelado': 'danger'
  }
  return variants[status] || 'default'
}

const getStatusLabel = (status: string) => {
  const labels: Record<string, string> = {
    'agendado': 'Agendado',
    'em_execucao': 'Em Execução',
    'concluido': 'Concluído',
    'cancelado': 'Cancelado'
  }
  return labels[status] || status
}

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}
</script>
