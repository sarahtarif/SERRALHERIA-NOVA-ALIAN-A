<template>
  <div class="min-h-screen bg-gray-50">
    <AdminLayout>
      <div class="p-8 max-w-4xl mx-auto">
        <div class="mb-8">
          <NuxtLink to="/admin/servicos" class="text-blue-600 hover:text-blue-700 flex items-center gap-2 mb-4">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
            Voltar para Serviços
          </NuxtLink>
          <h1 class="text-3xl font-bold text-gray-900">Novo Serviço</h1>
          <p class="text-gray-600 mt-2">Cadastre um novo serviço no sistema</p>
        </div>

        <Card>
          <CardContent class="p-6">
            <Alert v-if="error" variant="danger" class="mb-6">{{ error }}</Alert>
            <Alert v-if="success" variant="success" class="mb-6">Serviço criado com sucesso!</Alert>

            <ServicoForm
              :loading="loading"
              @submit="handleSubmit"
              @cancel="handleCancel"
            />
          </CardContent>
        </Card>
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
  title: 'Novo Serviço - Admin Nova Aliança',
  meta: [
    { name: 'robots', content: 'noindex, nofollow' },
    { name: 'googlebot', content: 'noindex, nofollow' }
  ]
})

const router = useRouter()
const { loading, error, success, createServico } = useServicos()

const handleSubmit = async (data: ServicoFormData) => {
  const result = await createServico(data)
  if (result) {
    setTimeout(() => {
      router.push(`/admin/servicos/${result.id}`)
    }, 1500)
  }
}

const handleCancel = () => {
  router.push('/admin/servicos')
}
</script>
