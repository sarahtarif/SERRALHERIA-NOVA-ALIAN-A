<template>
  <div class="min-h-screen bg-gray-50">
    <AdminLayout>
      <div class="p-8 max-w-2xl mx-auto">
        <h1 class="text-3xl font-bold text-gray-900 mb-8">Novo Lead</h1>

        <Card>
          <CardContent class="p-6">
            <form @submit.prevent="handleSubmit" class="space-y-4">
              <div>
                <Label for="name">Nome *</Label>
                <Input id="name" v-model="form.name" required />
              </div>

              <div>
                <Label for="whatsapp">WhatsApp *</Label>
                <Input id="whatsapp" v-model="form.whatsapp" required />
              </div>

              <div>
                <Label for="service_type">Tipo de Serviço *</Label>
                <Input id="service_type" v-model="form.service_type" required />
              </div>

              <div>
                <Label for="neighborhood">Bairro</Label>
                <Input id="neighborhood" v-model="form.neighborhood" />
              </div>

              <div>
                <Label for="message">Mensagem</Label>
                <Textarea id="message" v-model="form.message" rows="4" />
              </div>

              <Alert v-if="error" variant="danger">{{ error }}</Alert>

              <div class="flex gap-4">
                <Button type="submit" :disabled="loading">
                  {{ loading ? 'Salvando...' : 'Salvar Lead' }}
                </Button>
                <Button type="button" variant="outline" @click="router.back()">Cancelar</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  </div>
</template>

<script setup lang="ts">
import { useLeads } from '~/composables/admin/useLeads'

definePageMeta({
  middleware: ['auth', 'admin']
})

useHead({
  title: 'Novo Lead - Admin Nova Aliança',
  meta: [
    { name: 'robots', content: 'noindex, nofollow' }
  ]
})

const router = useRouter()
const { createLead, loading, error } = useLeads()

const form = ref({
  name: '',
  whatsapp: '',
  service_type: '',
  neighborhood: '',
  message: ''
})

const handleSubmit = async () => {
  try {
    await createLead(form.value)
    router.push('/admin/leads')
  } catch (e) {
    console.error('Erro ao criar lead:', e)
  }
}
</script>
