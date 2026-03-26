import { createClient } from '@supabase/supabase-js'
import type { SupabaseClient } from '@supabase/supabase-js'

// Singleton — evita múltiplas instâncias do GoTrueClient
let client: SupabaseClient | null = null
let clientUrl: string | null = null

export function useSupabase(): SupabaseClient {
  const config = useRuntimeConfig()
  const url = config.public.supabaseUrl as string
  const key = config.public.supabaseAnonKey as string

  // Recria o client se a URL mudou (ex: troca de projeto no .env)
  if (!client || clientUrl !== url) {
    client = createClient(url, key)
    clientUrl = url
  }
  return client
}
