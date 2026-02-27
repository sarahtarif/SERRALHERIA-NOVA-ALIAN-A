<template>
  <div class="min-h-screen bg-surface flex items-center justify-center">
    <div class="text-center">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
      <p class="text-text-secondary">Confirmando seu cadastro...</p>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: false
})

const router = useRouter()
const { initAuth } = useAuth()

onMounted(async () => {
  try {
    // Inicializar autenticação para processar o token
    await initAuth()
    
    // Aguardar um pouco para garantir que a sessão foi estabelecida
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Redirecionar para área do cliente
    router.push('/cliente')
  } catch (error) {
    console.error('Erro ao processar callback:', error)
    // Em caso de erro, redirecionar para login
    router.push('/cliente/login')
  }
})
</script>
