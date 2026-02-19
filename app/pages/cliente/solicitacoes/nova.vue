<template>
  <div class="min-h-screen bg-surface">
    <Navbar />
    
    <div class="py-12">
      <div class="container mx-auto px-4 max-w-3xl">
        <div class="mb-8">
          <NuxtLink to="/cliente/solicitacoes" class="text-primary-500 hover:text-primary-600 inline-flex items-center mb-4">
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
            Voltar
          </NuxtLink>
          <h1 class="text-3xl md:text-4xl font-bold text-text-primary mb-2">
            Nova Solicitação
          </h1>
          <p class="text-text-secondary">Preencha o formulário para solicitar um orçamento ou visita técnica</p>
        </div>

        <Card>
          <CardContent class="p-8">
            <Alert v-if="success" variant="success" class="mb-6">
              Solicitação enviada com sucesso! Em breve entraremos em contato via WhatsApp.
            </Alert>

            <Alert v-if="error" variant="destructive" class="mb-6">
              {{ error }}
            </Alert>

            <form @submit.prevent="handleSubmit" class="space-y-6">
              <div>
                <Label for="service_type">Tipo de Serviço *</Label>
                <Select id="service_type" v-model="form.service_type" required>
                  <option value="">Selecione um serviço</option>
                  <option value="Automação de Portões">Automação de Portões</option>
                  <option value="Travas Eletrônicas">Travas Eletrônicas</option>
                  <option value="Fotocélula">Fotocélula</option>
                  <option value="Interfone">Interfone</option>
                  <option value="Câmeras de Segurança">Câmeras de Segurança</option>
                  <option value="Protetor de Rede">Protetor de Rede</option>
                  <option value="Manutenção">Manutenção</option>
                  <option value="Outro">Outro</option>
                </Select>
              </div>

              <div>
                <Label for="description">Descrição do Serviço *</Label>
                <Textarea
                  id="description"
                  v-model="form.description"
                  placeholder="Descreva o que você precisa..."
                  rows="5"
                  required
                />
                <p class="text-sm text-text-secondary mt-1">
                  Inclua detalhes como tipo de portão, problema atual, etc.
                </p>
              </div>

              <div class="grid md:grid-cols-2 gap-6">
                <div>
                  <Label for="gate_type">Tipo de Portão</Label>
                  <Select id="gate_type" v-model="form.gate_type">
                    <option value="">Selecione</option>
                    <option value="Basculante">Basculante</option>
                    <option value="Deslizante">Deslizante</option>
                    <option value="Pivotante">Pivotante</option>
                    <option value="Outro">Outro</option>
                  </Select>
                </div>

                <div>
                  <Label for="preferred_time">Melhor Horário</Label>
                  <Select id="preferred_time" v-model="form.preferred_time">
                    <option value="">Selecione</option>
                    <option value="Manhã (8h-12h)">Manhã (8h-12h)</option>
                    <option value="Tarde (13h-17h)">Tarde (13h-17h)</option>
                    <option value="Qualquer horário">Qualquer horário</option>
                  </Select>
                </div>
              </div>

              <div>
                <Label for="images">Fotos (opcional)</Label>
                <Input
                  id="images"
                  type="file"
                  accept="image/*"
                  multiple
                  @change="handleFileChange"
                />
                <p class="text-sm text-text-secondary mt-1">
                  Envie fotos do portão ou local para uma avaliação mais precisa
                </p>
              </div>

              <div class="flex flex-col sm:flex-row gap-4">
                <Button type="submit" class="flex-1" :disabled="loading">
                  <span v-if="loading">Enviando...</span>
                  <span v-else>Enviar Solicitação</span>
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  class="flex-1"
                  @click="sendToWhatsApp"
                >
                  <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                  Enviar via WhatsApp
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>

    <Footer />
  </div>
</template>

<script setup lang="ts">
const router = useRouter()
const { sendMessage, createServiceMessage } = useWhatsApp()

const form = ref({
  service_type: '',
  description: '',
  gate_type: '',
  preferred_time: ''
})

const loading = ref(false)
const success = ref(false)
const error = ref('')
const files = ref<File[]>([])

const handleFileChange = (event: Event) => {
  const target = event.target as HTMLInputElement
  if (target.files) {
    files.value = Array.from(target.files)
  }
}

const handleSubmit = async () => {
  error.value = ''
  success.value = false
  loading.value = true

  try {
    // Aqui você implementaria o salvamento no Supabase
    // Por enquanto, apenas simula o envio
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    success.value = true
    
    // Limpar formulário
    form.value = {
      service_type: '',
      description: '',
      gate_type: '',
      preferred_time: ''
    }
    files.value = []
    
    // Redirecionar após 2 segundos
    setTimeout(() => {
      router.push('/cliente/solicitacoes')
    }, 2000)
  } catch (e) {
    error.value = 'Erro ao enviar solicitação. Tente novamente.'
  } finally {
    loading.value = false
  }
}

const sendToWhatsApp = () => {
  const message = createServiceMessage({
    service: form.value.service_type,
    gateType: form.value.gate_type,
    preferredTime: form.value.preferred_time,
    name: 'Cliente'
  })
  
  sendMessage(message + `\n\nDescrição: ${form.value.description}`)
}

useHead({
  title: 'Nova Solicitação - Área do Cliente',
  meta: [
    { name: 'robots', content: 'noindex, nofollow' }
  ]
})
</script>
