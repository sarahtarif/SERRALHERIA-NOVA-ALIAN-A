<template>
  <Card class="max-w-2xl mx-auto">
    <CardContent class="p-8">
      <form @submit.prevent="handleSubmit" class="space-y-6">
        <div class="grid md:grid-cols-2 gap-6">
          <div>
            <Label for="nome">Nome Completo *</Label>
            <Input
              id="nome"
              v-model="form.nome"
              type="text"
              placeholder="Seu nome"
              required
              :class="{ 'border-danger-500': errors.nome }"
            />
            <p v-if="errors.nome" class="text-danger-500 text-sm mt-1">{{ errors.nome }}</p>
          </div>
          
          <div>
            <Label for="whatsapp">WhatsApp *</Label>
            <Input
              id="whatsapp"
              v-model="form.whatsapp"
              type="tel"
              placeholder="(11) 99999-9999"
              required
              :class="{ 'border-danger-500': errors.whatsapp }"
            />
            <p v-if="errors.whatsapp" class="text-danger-500 text-sm mt-1">{{ errors.whatsapp }}</p>
          </div>
        </div>
        
        <div class="grid md:grid-cols-2 gap-6">
          <div>
            <Label for="bairro">Bairro *</Label>
            <Input
              id="bairro"
              v-model="form.bairro"
              type="text"
              placeholder="Seu bairro"
              required
              :class="{ 'border-danger-500': errors.bairro }"
            />
            <p v-if="errors.bairro" class="text-danger-500 text-sm mt-1">{{ errors.bairro }}</p>
          </div>
          
          <div>
            <Label for="servico">Tipo de Serviço *</Label>
            <select
              id="servico"
              v-model="form.servico"
              required
              class="w-full px-3 py-2 border border-border-light rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              :class="{ 'border-danger-500': errors.servico }"
            >
              <option value="">Selecione...</option>
              <option value="instalacao_motor">Instalação de Motor</option>
              <option value="manutencao">Manutenção</option>
              <option value="trava_eletronica">Trava Eletrônica</option>
              <option value="fotocelula">Fotocélula</option>
              <option value="interfone">Interfone</option>
              <option value="camera">Câmera de Segurança</option>
              <option value="outro">Outro</option>
            </select>
            <p v-if="errors.servico" class="text-danger-500 text-sm mt-1">{{ errors.servico }}</p>
          </div>
        </div>
        
        <div>
          <Label for="mensagem">Mensagem (Opcional)</Label>
          <Textarea
            id="mensagem"
            v-model="form.mensagem"
            placeholder="Conte-nos mais sobre sua necessidade..."
            rows="4"
          />
        </div>
        
        <div class="flex items-start space-x-3">
          <input
            id="lgpd"
            v-model="form.lgpd"
            type="checkbox"
            class="mt-1"
            required
          />
          <Label for="lgpd" class="text-sm text-text-secondary cursor-pointer">
            Concordo em compartilhar meus dados para receber contato da Nova Aliança. 
            <NuxtLink to="/politica-privacidade" class="text-primary-500 hover:underline">
              Ver Política de Privacidade
            </NuxtLink>
          </Label>
        </div>
        <p v-if="errors.lgpd" class="text-danger-500 text-sm">{{ errors.lgpd }}</p>
        
        <Button
          type="submit"
          size="lg"
          class="w-full bg-accent-500 hover:bg-accent-600 text-white"
          :disabled="loading || !form.lgpd"
        >
          <svg v-if="!loading" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
          </svg>
          <svg v-else class="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          {{ loading ? 'Enviando...' : 'Enviar Solicitação' }}
        </Button>
        
        <Alert v-if="success" variant="success" class="mt-4">
          <p class="font-bold">Solicitação enviada com sucesso!</p>
          <p class="text-sm">Entraremos em contato em até 2 horas.</p>
        </Alert>
        
        <Alert v-if="error" variant="danger" class="mt-4">
          <p class="font-bold">Erro ao enviar solicitação</p>
          <p class="text-sm">{{ error }}</p>
        </Alert>
      </form>
    </CardContent>
  </Card>
</template>

<script setup lang="ts">
const form = ref({
  nome: '',
  whatsapp: '',
  bairro: '',
  servico: '',
  mensagem: '',
  lgpd: false
})

const errors = ref<Record<string, string>>({})
const loading = ref(false)
const success = ref(false)
const error = ref('')

const validateForm = () => {
  errors.value = {}
  
  if (!form.value.nome || form.value.nome.length < 3) {
    errors.value.nome = 'Nome deve ter pelo menos 3 caracteres'
  }
  
  if (!form.value.whatsapp || !/^\(?[1-9]{2}\)?\s?9?\d{4}-?\d{4}$/.test(form.value.whatsapp.replace(/\s/g, ''))) {
    errors.value.whatsapp = 'WhatsApp inválido'
  }
  
  if (!form.value.bairro) {
    errors.value.bairro = 'Bairro é obrigatório'
  }
  
  if (!form.value.servico) {
    errors.value.servico = 'Selecione um tipo de serviço'
  }
  
  if (!form.value.lgpd) {
    errors.value.lgpd = 'Você precisa concordar com a política de privacidade'
  }
  
  return Object.keys(errors.value).length === 0
}

const handleSubmit = async () => {
  if (!validateForm()) {
    return
  }
  
  loading.value = true
  success.value = false
  error.value = ''
  
  // Track form start
  if (process.client) {
    // @ts-ignore
    if (typeof window !== 'undefined' && window.gtag) {
      // @ts-ignore
      window.gtag('event', 'form_submit', {
        form_name: 'lead_form',
        service_type: form.value.servico
      })
    }
  }
  
  try {
    // TODO: Integrar com API real
    // const response = await $fetch('/api/leads/create', {
    //   method: 'POST',
    //   body: form.value
    // })
    
    // Mock success
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    success.value = true
    
    // Reset form
    setTimeout(() => {
      form.value = {
        nome: '',
        whatsapp: '',
        bairro: '',
        servico: '',
        mensagem: '',
        lgpd: false
      }
      success.value = false
    }, 3000)
    
  } catch (e: any) {
    error.value = e.message || 'Erro ao enviar solicitação. Tente novamente.'
    
    // Track error
    if (process.client) {
      // @ts-ignore
      if (typeof window !== 'undefined' && window.gtag) {
        // @ts-ignore
        window.gtag('event', 'form_error', {
          form_name: 'lead_form',
          error_message: error.value
        })
      }
    }
  } finally {
    loading.value = false
  }
}

// Track form start on first interaction
const trackFormStart = () => {
  if (process.client) {
    // @ts-ignore
    if (typeof window !== 'undefined' && window.gtag) {
      // @ts-ignore
      window.gtag('event', 'form_start', {
        form_name: 'lead_form'
      })
    }
  }
}

onMounted(() => {
  const inputs = document.querySelectorAll('input, select, textarea')
  inputs.forEach(input => {
    input.addEventListener('focus', trackFormStart, { once: true })
  })
})
</script>
