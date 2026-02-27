export default defineNuxtPlugin(async () => {
  const { initAuth } = useAuth()
  
  try {
    // Inicializar autenticação ao carregar a aplicação
    await initAuth()
  } catch (error) {
    console.error('[PLUGIN AUTH] Erro ao inicializar autenticação:', error)
    // Não propagar o erro para não quebrar a aplicação
  }
})
