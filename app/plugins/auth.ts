export default defineNuxtPlugin(async () => {
  const { initAuth } = useAuth()
  
  // Inicializar autenticação ao carregar a aplicação
  await initAuth()
})
