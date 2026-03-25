import { createClient } from '@supabase/supabase-js'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const SUPABASE_URL = config.public.supabaseUrl as string
  const SUPABASE_SECRET_KEY = config.supabaseServiceRoleKey as string

  const { clienteAvulsoId } = await readBody(event)

  if (!clienteAvulsoId) {
    throw createError({ statusCode: 400, message: 'clienteAvulsoId obrigatório' })
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_SECRET_KEY, {
    auth: { autoRefreshToken: false, persistSession: false },
  })

  // Invalida convites anteriores não usados para o mesmo cliente
  await supabase
    .from('convites')
    .update({ usado: true })
    .eq('cliente_avulso_id', clienteAvulsoId)
    .eq('usado', false)

  // Cria novo convite
  const { data, error } = await supabase
    .from('convites')
    .insert({ cliente_avulso_id: clienteAvulsoId })
    .select('token')
    .single()

  if (error || !data) {
    throw createError({ statusCode: 500, message: 'Erro ao gerar convite' })
  }

  return { token: data.token }
})
