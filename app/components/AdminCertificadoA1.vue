<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useSupabase } from '~/composables/useSupabase'
import { useAdminAuth } from '~/composables/useAdminAuth'

const supabase = useSupabase()
const { adminUser } = useAdminAuth()

const saving = ref(false)
const loading = ref(true)
const erro = ref('')
const sucesso = ref('')

// Estado atual do certificado salvo
const certSalvo = ref<{ nome: string; validade_informada: string | null } | null>(null)

// Formulário
const arquivo = ref<File | null>(null)
const senha = ref('')
const validadeInformada = ref('')
const inputRef = ref<HTMLInputElement | null>(null)

function onFileChange(e: Event) {
  const target = e.target as HTMLInputElement
  arquivo.value = target.files?.[0] ?? null
}

function formatarTamanho(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`
}

async function carregar() {
  if (!adminUser.value) return
  const { data } = await supabase
    .from('admins')
    .select('cert_a1_nome, cert_a1_validade')
    .eq('id', adminUser.value.id)
    .maybeSingle()
  if (data?.cert_a1_nome) {
    certSalvo.value = { nome: data.cert_a1_nome, validade_informada: data.cert_a1_validade ?? null }
  }
  loading.value = false
}

async function salvar() {
  erro.value = ''
  sucesso.value = ''

  if (!arquivo.value) { erro.value = 'Selecione o arquivo do certificado (.pfx ou .p12).'; return }
  if (!senha.value) { erro.value = 'Informe a senha do certificado.'; return }

  const ext = arquivo.value.name.split('.').pop()?.toLowerCase()
  if (!['pfx', 'p12'].includes(ext ?? '')) {
    erro.value = 'Formato inválido. Use um arquivo .pfx ou .p12.'
    return
  }

  saving.value = true

  // Lê o arquivo como base64
  const base64 = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      const result = reader.result as string
      // Remove o prefixo "data:...;base64,"
      resolve(result.split(',')[1] ?? '')
    }
    reader.onerror = reject
    reader.readAsDataURL(arquivo.value!)
  })

  const { error } = await supabase
    .from('admins')
    .update({
      cert_a1_data: base64,
      cert_a1_nome: arquivo.value.name,
      cert_a1_senha: senha.value,
      cert_a1_validade: validadeInformada.value || null,
      cert_a1_atualizado_em: new Date().toISOString(),
    })
    .eq('id', adminUser.value!.id)

  saving.value = false

  if (error) {
    erro.value = 'Erro ao salvar certificado. Verifique se as colunas existem na tabela admins.'
    return
  }

  certSalvo.value = { nome: arquivo.value.name, validade_informada: validadeInformada.value || null }
  sucesso.value = 'Certificado salvo com sucesso!'
  arquivo.value = null
  senha.value = ''
  validadeInformada.value = ''
  if (inputRef.value) inputRef.value.value = ''
}

async function remover() {
  if (!adminUser.value) return
  saving.value = true
  await supabase.from('admins').update({
    cert_a1_data: null,
    cert_a1_nome: null,
    cert_a1_senha: null,
    cert_a1_validade: null,
    cert_a1_atualizado_em: null,
  }).eq('id', adminUser.value.id)
  saving.value = false
  certSalvo.value = null
  sucesso.value = 'Certificado removido.'
}

onMounted(carregar)
</script>

<template>
  <div class="space-y-5">

    <!-- Certificado já salvo -->
    <div v-if="!loading && certSalvo" class="rounded-2xl p-4 flex items-center gap-4" style="background:rgba(34,197,94,0.08); border:1px solid rgba(34,197,94,0.2);">
      <div class="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style="background:rgba(34,197,94,0.12);">
        <svg class="w-5 h-5" style="color:#4ade80;" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
        </svg>
      </div>
      <div class="flex-1 min-w-0">
        <p class="text-sm font-semibold" style="color:#4ade80;">Certificado configurado</p>
        <p class="text-xs mt-0.5 truncate" style="color:#64748b;">{{ certSalvo.nome }}</p>
        <p v-if="certSalvo.validade_informada" class="text-xs mt-0.5" style="color:#64748b;">
          Validade: {{ certSalvo.validade_informada }}
        </p>
      </div>
      <button
        @click="remover"
        :disabled="saving"
        class="text-xs px-3 py-1.5 rounded-lg transition-all disabled:opacity-50"
        style="background:rgba(239,68,68,0.1); color:#f87171; border:1px solid rgba(239,68,68,0.2);"
      >
        Remover
      </button>
    </div>

    <!-- Feedback -->
    <div v-if="sucesso" class="px-4 py-3 rounded-xl text-sm" style="background:rgba(34,197,94,0.1); color:#4ade80; border:1px solid rgba(34,197,94,0.2);">
      {{ sucesso }}
    </div>
    <div v-if="erro" class="px-4 py-3 rounded-xl text-sm" style="background:rgba(239,68,68,0.1); color:#f87171; border:1px solid rgba(239,68,68,0.2);">
      {{ erro }}
    </div>

    <!-- Formulário de upload -->
    <div class="rounded-2xl p-5 space-y-4" style="background:#0d1526; border:1px solid rgba(255,255,255,0.06);">
      <p class="text-sm font-semibold text-white">{{ certSalvo ? 'Substituir certificado' : 'Anexar certificado A1' }}</p>

      <!-- Drop zone / file input -->
      <div
        class="relative rounded-xl border-2 border-dashed flex flex-col items-center justify-center gap-2 py-8 cursor-pointer transition-all"
        :style="arquivo ? 'border-color:rgba(99,102,241,0.5); background:rgba(99,102,241,0.06);' : 'border-color:rgba(255,255,255,0.1); background:rgba(255,255,255,0.02);'"
        @click="inputRef?.click()"
      >
        <input
          ref="inputRef"
          type="file"
          accept=".pfx,.p12"
          class="hidden"
          @change="onFileChange"
        />
        <svg class="w-8 h-8" :style="arquivo ? 'color:#818cf8' : 'color:#334155'" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z"/>
        </svg>
        <div class="text-center">
          <p v-if="arquivo" class="text-sm font-medium" style="color:#a5b4fc;">
            {{ arquivo.name }}
            <span class="text-xs ml-1" style="color:#64748b;">({{ formatarTamanho(arquivo.size) }})</span>
          </p>
          <template v-else>
            <p class="text-sm" style="color:#64748b;">Clique para selecionar o arquivo</p>
            <p class="text-xs mt-1" style="color:#334155;">Aceita .pfx ou .p12</p>
          </template>
        </div>
      </div>

      <!-- Senha -->
      <div>
        <label class="block text-xs font-medium mb-1.5" style="color:#94a3b8;">Senha do certificado *</label>
        <input
          v-model="senha"
          type="password"
          placeholder="••••••••"
          class="w-full px-3 py-2.5 rounded-xl text-sm outline-none"
          style="background:#1e293b; color:#e2e8f0; border:1px solid rgba(255,255,255,0.08);"
        />
      </div>

      <!-- Validade (informativa) -->
      <div>
        <label class="block text-xs font-medium mb-1.5" style="color:#94a3b8;">
          Validade do certificado
          <span style="color:#475569;">(opcional — apenas para controle)</span>
        </label>
        <input
          v-model="validadeInformada"
          type="date"
          class="w-full px-3 py-2.5 rounded-xl text-sm outline-none"
          style="background:#1e293b; color:#e2e8f0; border:1px solid rgba(255,255,255,0.08);"
        />
      </div>

      <button
        @click="salvar"
        :disabled="saving || !arquivo"
        class="w-full py-3 rounded-xl text-sm font-semibold transition-all hover:brightness-110 disabled:opacity-40 disabled:cursor-not-allowed"
        style="background:linear-gradient(135deg,#6366f1,#818cf8); color:#fff;"
      >
        {{ saving ? 'Salvando...' : 'Salvar certificado' }}
      </button>

      <p class="text-xs text-center" style="color:#334155;">
        O certificado é armazenado de forma segura e utilizado apenas para emissão de NF-e.
      </p>
    </div>

  </div>
</template>
