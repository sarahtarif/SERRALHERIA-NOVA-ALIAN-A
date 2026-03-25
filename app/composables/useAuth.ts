import { ref, readonly } from 'vue'
import { useRouter } from 'vue-router'
import type { User } from '@supabase/supabase-js'
import { useSupabase } from './useSupabase'

const user = ref<User | null>(null)
const loading = ref(false)
const error = ref<string | null>(null)

export function useAuth() {
  const supabase = useSupabase()
  const router = useRouter()

  async function init(): Promise<void> {
    const { data } = await supabase.auth.getSession()
    user.value = data.session?.user ?? null

    supabase.auth.onAuthStateChange((_event, session) => {
      user.value = session?.user ?? null
    })
  }

  async function login(email: string, password: string): Promise<boolean> {
    loading.value = true
    error.value = null

    try {
      // Verifica se o email existe antes de tentar o login
      const { exists } = await $fetch<{ exists: boolean }>('/api/auth/check-email', {
        method: 'POST',
        body: { email },
      })

      if (!exists) {
        error.value = 'Nenhuma conta encontrada com este e-mail.'
        return false
      }

      const { data, error: authError } = await supabase.auth.signInWithPassword({ email, password })

      if (authError) {
        error.value = translateError(authError.message)
        return false
      }

      // Verifica se o usuário tem registro de cliente (não é admin)
      const { data: clientData } = await supabase
        .from('users')
        .select('id')
        .eq('id', data.user.id)
        .maybeSingle()

      if (!clientData) {
        await supabase.auth.signOut()
        error.value = 'Acesso negado. Use a área correta para entrar.'
        return false
      }

      user.value = data.user
      await router.push('/cliente')
      return true
    } catch {
      error.value = 'Erro inesperado. Tente novamente.'
      return false
    } finally {
      loading.value = false
    }
  }

  async function register(email: string, password: string): Promise<boolean> {
    loading.value = true
    error.value = null

    try {
      const { error: authError } = await supabase.auth.signUp({ email, password })

      if (authError) {
        error.value = translateError(authError.message)
        return false
      }

      return true
    } catch {
      error.value = 'Erro inesperado. Tente novamente.'
      return false
    } finally {
      loading.value = false
    }
  }

  async function logout(): Promise<void> {
    await supabase.auth.signOut()
    user.value = null
    await router.push('/login')
  }

  function translateError(message: string): string {
    if (message.includes('Invalid login credentials')) return 'Senha incorreta. Tente novamente.'
    if (message.includes('Email not confirmed')) return 'Confirme seu e-mail antes de entrar.'
    if (message.includes('Too many requests')) return 'Muitas tentativas. Aguarde alguns minutos.'
    if (message.includes('User not found')) return 'Nenhuma conta encontrada com este e-mail.'
    return `Erro ao fazer login: ${message}`
  }

  return {
    user: readonly(user),
    loading: readonly(loading),
    error: readonly(error),
    init,
    login,
    register,
    logout,
  }
}
