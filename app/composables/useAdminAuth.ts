import { readonly, computed } from 'vue'
import { useState, useRouter, navigateTo } from '#app'
import type { User } from '@supabase/supabase-js'
import { useSupabase } from '~/composables/useSupabase'

export function useAdminAuth() {
  const supabase = useSupabase()
  const router = useRouter()

  // useState garante estado compartilhado entre SSR e cliente no Nuxt
  const adminUser = useState<User | null>('adminUser', () => null)
  const adminLoading = useState<boolean>('adminLoading', () => false)
  const adminError = useState<string | null>('adminError', () => null)
  const isAdmin = useState<boolean>('isAdmin', () => false)
  const adminRole = useState<'super_admin' | 'editor' | 'viewer' | null>('adminRole', () => null)

  async function initAdmin(): Promise<void> {
    const { data } = await supabase.auth.getSession()
    const sessionUser = data.session?.user ?? null

    if (sessionUser) {
      await verifyAdmin(sessionUser)
    }

    supabase.auth.onAuthStateChange(async (_event, session) => {
      const u = session?.user ?? null
      if (u) {
        await verifyAdmin(u)
      } else {
        adminUser.value = null
        isAdmin.value = false
        adminRole.value = null
      }
    })
  }

  async function verifyAdmin(u: User): Promise<boolean> {
    const { data } = await supabase
      .from('admins')
      .select('id, role')
      .eq('id', u.id)
      .maybeSingle()

    if (data) {
      adminUser.value = u
      isAdmin.value = true
      adminRole.value = data.role ?? 'viewer'
      return true
    }

    adminUser.value = null
    isAdmin.value = false
    adminRole.value = null
    return false
  }

  async function loginAdmin(email: string, password: string): Promise<boolean> {
    adminLoading.value = true
    adminError.value = null

    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password })

      if (error || !data.user) {
        adminError.value = 'Credenciais inválidas.'
        return false
      }

      const ok = await verifyAdmin(data.user)
      if (!ok) {
        await supabase.auth.signOut()
        adminError.value = 'Acesso negado. Você não tem permissão de administrador.'
        return false
      }

      await router.push('/gestao-na')
      return true
    } catch {
      adminError.value = 'Erro inesperado. Tente novamente.'
      return false
    } finally {
      adminLoading.value = false
    }
  }

  async function logoutAdmin(): Promise<void> {
    await supabase.auth.signOut()
    adminUser.value = null
    isAdmin.value = false
    adminRole.value = null
    await navigateTo('/gestao-na/login')
  }

  return {
    adminUser: readonly(adminUser),
    adminLoading: readonly(adminLoading),
    adminError: readonly(adminError),
    isAdmin: readonly(isAdmin),
    adminRole: readonly(adminRole),
    initAdmin,
    loginAdmin,
    logoutAdmin,
  }
}
