// Middleware de autenticação básica
export default defineNuxtRouteMiddleware(async (to, from) => {
  const { user, initAuth } = useAuth()
  
  // Inicializar autenticação se necessário
  if (!user.value) {
    await initAuth()
  }
  
  // Se não estiver autenticado, redirecionar para login apropriado
  if (!user.value) {
    // Determinar página de login baseado na rota
    if (to.path.startsWith('/sys/mgmt') || to.path.startsWith('/auth/secure')) {
      return navigateTo('/auth/secure/admin-access')
    }
    
    if (to.path.startsWith('/cliente')) {
      return navigateTo('/cliente/login')
    }
  }
})
