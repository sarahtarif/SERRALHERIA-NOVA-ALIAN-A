import { createClient } from '@supabase/supabase-js'
import type { SupabaseClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://lfznsbvruvjnugyzfyiw.supabase.co'
const SUPABASE_KEY = 'sb_publishable_Ii98PzbLuXnKz5tLgsUoTQ_K09D-nKO'

// Singleton — evita múltiplas instâncias do GoTrueClient
let client: SupabaseClient | null = null

export function useSupabase(): SupabaseClient {
  if (!client) {
    client = createClient(SUPABASE_URL, SUPABASE_KEY)
  }
  return client
}
