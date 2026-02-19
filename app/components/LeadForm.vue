<template>
  <Card>
    <CardHeader>
      <h3 class="text-2xl font-bold text-text-primary">Solicite um Orçamento</h3>
      <p class="text-text-secondary mt-2">Preencha o formulário e entraremos em contato via WhatsApp</p>
    </CardHeader>
    
    <CardContent>
      <form @submit.prevent="handleSubmit" class="space-y-5">
        <div class="space-y-2">
          <Label for="name">Nome Completo</Label>
          <Input 
            id="name"
            v-model="form.name"
            type="text"
            required
            placeholder="Seu nome completo"
          />
        </div>

        <div class="space-y-2">
          <Label for="whatsapp">WhatsApp</Label>
          <Input 
            id="whatsapp"
            v-model="form.whatsapp"
            type="tel"
            required
            placeholder="(11) 99999-9999"
          />
        </div>

        <div class="space-y-2">
          <Label for="service">Serviço Desejado</Label>
          <Select 
            id="service"
            v-model="form.service"
            required
          >
            <option value="">Selecione um serviço</option>
            <option value="Automação de Portão">Automação de Portão</option>
            <option value="Trava Eletrônica">Trava Eletrônica</option>
            <option value="Fotocélula">Fotocélula</option>
            <option value="Interfone">Interfone</option>
            <option value="Câmeras">Câmeras de Segurança</option>
            <option value="Manutenção">Manutenção</option>
            <option value="Outro">Outro</option>
          </Select>
        </div>

        <div class="space-y-2">
          <Label for="neighborhood">Bairro</Label>
          <Input 
            id="neighborhood"
            v-model="form.neighborhood"
            type="text"
            required
            placeholder="Seu bairro em São Paulo"
          />
        </div>

        <div class="space-y-2">
          <Label for="gateType">Tipo de Portão (opcional)</Label>
          <Select 
            id="gateType"
            v-model="form.gateType"
          >
            <option value="">Selecione</option>
            <option value="Basculante">Basculante</option>
            <option value="Deslizante">Deslizante</option>
            <option value="Pivotante">Pivotante</option>
            <option value="Não sei">Não sei</option>
          </Select>
        </div>

        <div class="space-y-2">
          <Label for="preferredTime">Melhor Horário</Label>
          <Select 
            id="preferredTime"
            v-model="form.preferredTime"
          >
            <option value="">Selecione</option>
            <option value="Manhã (8h-12h)">Manhã (8h-12h)</option>
            <option value="Tarde (12h-18h)">Tarde (12h-18h)</option>
            <option value="Qualquer horário">Qualquer horário</option>
          </Select>
        </div>

        <Button 
          type="submit"
          :disabled="loading"
          class="w-full bg-accent-500 hover:bg-accent-600 disabled:bg-secondary-300 text-white shadow-accent"
          size="lg"
        >
          <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
          </svg>
          <span>{{ loading ? 'Enviando...' : 'Enviar para WhatsApp' }}</span>
        </Button>
      </form>
    </CardContent>
  </Card>
</template>

<script setup lang="ts">
const { sendMessage, createServiceMessage } = useWhatsApp()
const loading = ref(false)

const form = reactive({
  name: '',
  whatsapp: '',
  service: '',
  neighborhood: '',
  gateType: '',
  preferredTime: ''
})

const handleSubmit = async () => {
  loading.value = true
  
  try {
    // Salvar lead no banco (implementar depois)
    // await saveLead(form)
    
    // Enviar para WhatsApp
    const message = createServiceMessage({
      service: form.service,
      name: form.name,
      neighborhood: form.neighborhood,
      gateType: form.gateType,
      preferredTime: form.preferredTime
    })
    
    sendMessage(message)
    
    // Limpar formulário
    Object.keys(form).forEach(key => {
      form[key as keyof typeof form] = ''
    })
  } finally {
    loading.value = false
  }
}
</script>
