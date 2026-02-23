// Middleware de verificação de role admin
// Aplica defesa em profundidade com múltiplas verificações

export default defineNuxtRouteMiddleware(async (to, from) => {
  const { user, profile, isAdmin, loadProfile } = useAuth()
  
  // CAMADA 1: Verificar autenticação
  if (!user.value) {
    console.warn('[SECURITY] Tentativa de acesso não autenticado:', {
      route: to.path,
      timestamp: new Date().toISOString(),
      ip: 'client-side' // IP será logado no server-side
    })
    
    return navigateTo('/auth/secure/admin-access')
  }
  
  // CAMADA 2: Carregar perfil se não estiver carregado
  if (!profile.value) {
    await loadProfile(user.value.id)
  }
  
  // CAMADA 3: Verificar role admin
  if (!isAdmin.value) {
    console.error('[SECURITY] Tentativa de escalação de privilégio:', {
      userId: user.value.id,
      userEmail: user.value.email,
      currentRole: profile.value?.role || 'unknown',
      attemptedRoute: to.path,
      timestamp: new Date().toISOString()
    })
    
    // Log de auditoria (server-side)
    try {
      await $fetch('/api/security/log-unauthorized', {
        method: 'POST',
        body: {
          userId: user.value.id,
          userEmail: user.value.email,
          role: profile.value?.role,
          attemptedRoute: to.path,
          fromRoute: from.path,
          timestamp: new Date().toISOString()
        }
      })
    } catch (error) {
      console.error('[SECURITY] Erro ao registrar tentativa não autorizada:', error)
    }
    
    // Redirecionar para área apropriada
    if (profile.value?.role === 'client') {
      return navigateTo('/cliente')
    }
    
    return navigateTo('/')
  }
  
  // CAMADA 4: Audit log de acesso autorizado
  try {
    await $fetch('/api/security/log-access', {
      method: 'POST',
      body: {
        userId: user.value.id,
        userEmail: user.value.email,
        route: to.path,
        fromRoute: from.path,
        timestamp: new Date().toISOString()
      }
    })
  } catch (error) {
    console.error('[SECURITY] Erro ao registrar acesso:', error)
  }
  
  // CAMADA 5: Verificação de sessão ativa
  const supabase = useSupabase()
  const { data: { session } } = await supabase.auth.getSession()
  
  if (!session) {
    console.warn('[SECURITY] Sessão expirada detectada:', {
      userId: user.value.id,
      route: to.path
    })
    
    return navigateTo('/auth/secure/admin-access')
  }
})
