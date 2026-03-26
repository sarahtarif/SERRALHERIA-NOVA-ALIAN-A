import { createClient } from "@supabase/supabase-js"

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const { chave, valor } = await readBody(event)

  if (!chave || valor === undefined) {
    throw createError({ statusCode: 400, message: "chave e valor sao obrigatorios" })
  }

  const authHeader = getHeader(event, "authorization")
  const token = authHeader?.replace("Bearer ", "")
  if (!token) throw createError({ statusCode: 401, message: "Nao autorizado." })

  const supabaseUrl = config.public.supabaseUrl
  const serviceKey = config.supabaseServiceRoleKey

  if (!serviceKey) throw createError({ statusCode: 500, message: "Configuracao do servidor incompleta." })

  const supabase = createClient(supabaseUrl, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  })

  // Decodifica o JWT para pegar o user_id sem chamar getUser
  let userId
  try {
    const parts = token.split(".")
    const padded = parts[1].replace(/-/g, "+").replace(/_/g, "/")
    const payload = JSON.parse(Buffer.from(padded, "base64").toString("utf8"))
    userId = payload.sub
    if (!userId) throw new Error("sub ausente")
    console.log("[site-config] userId:", userId)
  } catch {
    throw createError({ statusCode: 401, message: "Token malformado." })
  }

  // Verifica se e super_admin
  const { data: adminRow, error: adminErr } = await supabase
    .from("admins")
    .select("role")
    .eq("id", userId)
    .maybeSingle()

  console.log("[site-config] adminRow:", JSON.stringify(adminRow), "err:", adminErr?.message)

  if (!adminRow || adminRow.role !== "super_admin") {
    throw createError({ statusCode: 403, message: "Apenas super_admin pode editar configuracoes do site." })
  }

  const { error } = await supabase
    .from("site_config")
    .update({ valor, updated_at: new Date().toISOString() })
    .eq("chave", chave)

  if (error) throw createError({ statusCode: 500, message: error.message })

  return { ok: true, chave, valor }
})