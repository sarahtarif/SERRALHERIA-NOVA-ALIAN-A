<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, computed } from 'vue'
import { useAuth } from '~/composables/useAuth'
import { useSupabase } from '~/composables/useSupabase'

const emit = defineEmits<{ close: [] }>()

const { user } = useAuth()
const supabase = useSupabase()

// --- dados do cliente ---
const profile = ref({
  full_name: '', phone: '', email: '',
  cep: '', street: '', number: '', complement: '', neighborhood: '', city: '', state: '',
})

onMounted(async () => {
  if (!user.value) return
  profile.value.email = user.value.email ?? ''
  const { data } = await supabase
    .from('users')
    .select('full_name, phone, cep, street, number, complement, neighborhood, city, state')
    .eq('id', user.value.id)
    .maybeSingle()
  if (data) Object.assign(profile.value, {
    full_name: data.full_name ?? '', phone: data.phone ?? '',
    cep: data.cep ?? '', street: data.street ?? '', number: data.number ?? '',
    complement: data.complement ?? '', neighborhood: data.neighborhood ?? '',
    city: data.city ?? '', state: data.state ?? '',
  })
})

// --- formulário ---
const title = ref('')
const description = ref('')

// --- arquivos ---
const MAX_FILE_SIZE = 20 * 1024 * 1024

interface AttachedFile { file: File; originalSize: number; compressed: boolean; compressing: boolean }
interface OversizedFile { file: File; compressing: boolean }

const attachments = ref<AttachedFile[]>([])
const oversized = ref<OversizedFile[]>([])
const videoOversized = ref<{ name: string; size: number }[]>([])
const fileErrors = ref<string[]>([])
const compressing = ref(false)

function formatSize(bytes: number): string {
  return bytes < 1024 * 1024
    ? `${(bytes / 1024).toFixed(0)} KB`
    : `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

async function compressImage(file: File, quality: number): Promise<File> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    const url = URL.createObjectURL(file)
    img.onload = () => {
      URL.revokeObjectURL(url)
      const canvas = document.createElement('canvas')
      canvas.width = img.naturalWidth
      canvas.height = img.naturalHeight
      const ctx = canvas.getContext('2d')
      if (!ctx) { resolve(file); return }
      ctx.drawImage(img, 0, 0)
      canvas.toBlob(
        (blob) => {
          if (!blob) { resolve(file); return }
          resolve(new File([blob], file.name.replace(/\.[^.]+$/, '.jpg'), { type: 'image/jpeg', lastModified: Date.now() }))
        },
        'image/jpeg', quality
      )
    }
    img.onerror = () => { URL.revokeObjectURL(url); reject(new Error('Falha ao carregar imagem')) }
    img.src = url
  })
}

async function onFileChange(e: Event): Promise<void> {
  const input = e.target as HTMLInputElement
  if (!input.files) return
  fileErrors.value = []
  compressing.value = true

  for (const f of Array.from(input.files)) {
    const isImage = f.type.startsWith('image/')
    if (f.size > MAX_FILE_SIZE) {
      if (isImage) {
        oversized.value.push({ file: f, compressing: false })
      } else {
        videoOversized.value.push({ name: f.name, size: f.size })
      }
      continue
    }
    if (isImage) {
      try {
        const compressed = await compressImage(f, 0.7)
        attachments.value.push({ file: compressed, originalSize: f.size, compressed: compressed.size < f.size, compressing: false })
      } catch {
        attachments.value.push({ file: f, originalSize: f.size, compressed: false, compressing: false })
      }
    } else {
      attachments.value.push({ file: f, originalSize: f.size, compressed: false, compressing: false })
    }
  }

  compressing.value = false
  input.value = ''
}

async function compressOversized(index: number): Promise<void> {
  const item = oversized.value[index]
  if (!item) return
  item.compressing = true
  try {
    let result = await compressImage(item.file, 0.6)
    if (result.size > MAX_FILE_SIZE) result = await compressImage(item.file, 0.4)
    if (result.size > MAX_FILE_SIZE) result = await compressImage(item.file, 0.2)
    if (result.size > MAX_FILE_SIZE) {
      fileErrors.value.push(`"${item.file.name}" ainda tem ${formatSize(result.size)} após compressão máxima. Não foi possível reduzir abaixo de 20 MB.`)
    } else {
      attachments.value.push({ file: result, originalSize: item.file.size, compressed: true, compressing: false })
      oversized.value.splice(index, 1)
    }
  } catch {
    fileErrors.value.push(`Erro ao comprimir "${item.file.name}".`)
  } finally {
    if (oversized.value[index]) oversized.value[index].compressing = false
  }
}

function dismissOversized(index: number): void { oversized.value.splice(index, 1) }
function removeFile(index: number): void { attachments.value.splice(index, 1) }

async function recompressFile(index: number): Promise<void> {
  const item = attachments.value[index]
  if (!item || !item.file.type.startsWith('image/')) return
  item.compressing = true
  try {
    // usa o arquivo original como base para recomprimir
    const sourceFile = item.compressed
      ? new File([item.file], item.file.name, { type: item.file.type })
      : item.file
    const quality = item.compressed ? 0.4 : 0.7
    const result = await compressImage(sourceFile, quality)
    attachments.value[index] = {
      file: result,
      originalSize: item.originalSize,
      compressed: result.size < item.originalSize,
      compressing: false,
    }
  } catch {
    item.compressing = false
    fileErrors.value.push(`Erro ao comprimir "${item.file.name}".`)
  }
}

// --- áudio ---
const MAX_AUDIO_MS = 2 * 60 * 1000
const isRecording = ref(false)
const audioBlob = ref<Blob | null>(null)
const audioUrl = ref('')
const recordingTime = ref(0)
const audioError = ref('')

let mediaRecorder: MediaRecorder | null = null
let recordingInterval: ReturnType<typeof setInterval> | null = null
let autoStopTimeout: ReturnType<typeof setTimeout> | null = null

const recordingLabel = computed(() => {
  const m = Math.floor(recordingTime.value / 60).toString().padStart(2, '0')
  const s = (recordingTime.value % 60).toString().padStart(2, '0')
  return `${m}:${s}`
})

// Detecta o mime type suportado pelo browser
function getSupportedAudioMime(): string {
  const types = ['audio/webm;codecs=opus', 'audio/webm', 'audio/ogg;codecs=opus', 'audio/ogg', 'audio/mp4']
  for (const type of types) {
    if (MediaRecorder.isTypeSupported(type)) return type
  }
  return '' // deixa o browser escolher
}

async function startRecording(): Promise<void> {
  audioError.value = ''
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
    const mimeType = getSupportedAudioMime()
    mediaRecorder = mimeType ? new MediaRecorder(stream, { mimeType }) : new MediaRecorder(stream)
    const chunks: BlobPart[] = []
    mediaRecorder.ondataavailable = (e) => chunks.push(e.data)
    mediaRecorder.onstop = () => {
      const type = mediaRecorder?.mimeType || 'audio/webm'
      audioBlob.value = new Blob(chunks, { type })
      audioUrl.value = URL.createObjectURL(audioBlob.value)
      stream.getTracks().forEach(t => t.stop())
    }
    mediaRecorder.start()
    isRecording.value = true
    recordingTime.value = 0
    recordingInterval = setInterval(() => { recordingTime.value++ }, 1000)
    autoStopTimeout = setTimeout(() => stopRecording(), MAX_AUDIO_MS)
  } catch {
    audioError.value = 'Permissão de microfone negada.'
  }
}

function stopRecording(): void {
  if (mediaRecorder && mediaRecorder.state !== 'inactive') mediaRecorder.stop()
  if (recordingInterval) clearInterval(recordingInterval)
  if (autoStopTimeout) clearTimeout(autoStopTimeout)
  isRecording.value = false
}

function removeAudio(): void {
  audioBlob.value = null
  audioUrl.value = ''
  recordingTime.value = 0
}

// --- envio ---
const submitting = ref(false)
const submitError = ref('')
const submitSuccess = ref(false)

function fileToBase64(file: File | Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string) // data:mime;base64,...
    reader.onerror = () => reject(new Error('Falha ao ler arquivo'))
    reader.readAsDataURL(file)
  })
}

async function submitSolicitacao(): Promise<void> {
  if (!title.value.trim()) { submitError.value = 'O título é obrigatório.'; return }
  if (!user.value) return

  submitting.value = true
  submitError.value = ''

  try {
    const imagensB64: string[] = []
    const videosB64: string[] = []

    for (const item of attachments.value) {
      const b64 = await fileToBase64(item.file)
      if (item.file.type.startsWith('image/')) imagensB64.push(b64)
      else videosB64.push(b64)
    }

    const audiosB64: string[] = []
    if (audioBlob.value) {
      audiosB64.push(await fileToBase64(audioBlob.value))
    }

    const { error } = await supabase.from('solicitacoes').insert({
      user_id: user.value.id,
      titulo: title.value.trim(),
      descricao: description.value.trim() || null,
      imagens: imagensB64,
      videos: videosB64,
      audios: audiosB64,
    })

    if (error) throw new Error(error.message)

    submitSuccess.value = true
    setTimeout(() => emit('close'), 2000)
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Erro ao enviar solicitação.'
    console.error('[SolicitarServico] submitSolicitacao error:', msg)
    submitError.value = 'Erro ao enviar. Tente novamente ou entre em contato.'
  } finally {
    submitting.value = false
  }
}

onBeforeUnmount(() => {
  if (isRecording.value) stopRecording()
  if (audioUrl.value) URL.revokeObjectURL(audioUrl.value)
})
</script>

<template>
  <div id="solicitar-servico-overlay" class="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4" @click.self="emit('close')">
    <div class="bg-surface-container-low rounded-2xl w-full max-w-2xl max-h-[92vh] overflow-y-auto border border-outline-variant shadow-2xl">

      <!-- Header -->
      <div class="flex items-center justify-between px-6 py-5 border-b border-outline-variant bg-surface-container rounded-t-2xl sticky top-0 z-10">
        <div class="flex items-center gap-3">
          <div class="w-9 h-9 rounded-full bg-primary flex items-center justify-center shrink-0">
            <svg class="w-5 h-5 text-on-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
            </svg>
          </div>
          <h2 class="text-on-surface font-semibold text-lg">Solicitar um Serviço</h2>
        </div>
        <button class="text-on-surface-variant hover:text-primary transition-colors p-1 rounded-lg hover:bg-surface-container-high" @click="emit('close')">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </button>
      </div>

      <div class="p-6 space-y-6">

        <!-- Dados do cliente -->
        <div class="rounded-xl bg-surface-container border border-outline-variant p-4 space-y-3">
          <h3 class="text-primary font-semibold text-sm uppercase tracking-wider">Seus Dados</h3>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
            <div>
              <span class="text-on-surface-variant">Nome</span>
              <p class="text-on-surface font-medium mt-0.5">{{ profile.full_name || '—' }}</p>
            </div>
            <div>
              <span class="text-on-surface-variant">E-mail</span>
              <p class="text-on-surface font-medium mt-0.5">{{ profile.email || '—' }}</p>
            </div>
            <div>
              <span class="text-on-surface-variant">Celular / WhatsApp</span>
              <p class="text-on-surface font-medium mt-0.5">{{ profile.phone || '—' }}</p>
            </div>
            <div>
              <span class="text-on-surface-variant">Cidade / Estado</span>
              <p class="text-on-surface font-medium mt-0.5">
                {{ profile.city && profile.state ? `${profile.city} / ${profile.state}` : '—' }}
              </p>
            </div>
          </div>
          <div v-if="profile.street" class="pt-2 border-t border-outline-variant text-sm">
            <span class="text-on-surface-variant">Endereço</span>
            <p class="text-on-surface font-medium mt-0.5">
              {{ profile.street }}{{ profile.number ? `, ${profile.number}` : '' }}{{ profile.complement ? ` — ${profile.complement}` : '' }}
              <span v-if="profile.neighborhood || profile.cep" class="block text-on-surface-variant font-normal">
                {{ [profile.neighborhood, profile.cep ? `CEP ${profile.cep}` : ''].filter(Boolean).join(' — ') }}
              </span>
            </p>
          </div>
          <p class="text-xs text-on-surface-variant">Para alterar seus dados, acesse o perfil.</p>
        </div>

        <!-- Título e descrição -->
        <div class="space-y-4">
          <h3 class="text-primary font-semibold text-sm uppercase tracking-wider">Detalhes da Solicitação</h3>
          <div>
            <label class="block text-sm text-on-surface-variant mb-1.5">Título <span class="text-error">*</span></label>
            <input
              v-model="title"
              type="text"
              placeholder="Ex: Manutenção de portão automático"
              class="w-full px-4 py-3 rounded-lg bg-surface-container border border-outline-variant text-on-surface placeholder-on-surface-variant focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 transition-colors"
            />
          </div>
          <div>
            <label class="block text-sm text-on-surface-variant mb-1.5">Descrição</label>
            <textarea
              v-model="description"
              rows="4"
              placeholder="Descreva o que precisa, o problema ou o serviço desejado..."
              class="w-full px-4 py-3 rounded-lg bg-surface-container border border-outline-variant text-on-surface placeholder-on-surface-variant focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 transition-colors resize-none"
            />
          </div>
        </div>

        <!-- Anexos -->
        <div class="space-y-3">
          <h3 class="text-primary font-semibold text-sm uppercase tracking-wider">Fotos / Vídeos</h3>
          <p class="text-xs text-on-surface-variant">Máximo 20 MB por arquivo. Imagens são comprimidas automaticamente.</p>

          <label
            id="file-upload-label"
            class="flex flex-col items-center justify-center gap-2 w-full py-6 rounded-xl border-2 border-dashed border-outline-variant hover:border-primary hover:bg-primary/5 transition-colors cursor-pointer"
            :class="{ 'opacity-60 pointer-events-none': compressing }"
          >
            <svg v-if="!compressing" class="w-8 h-8 text-on-surface-variant" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"/>
            </svg>
            <svg v-else class="w-8 h-8 text-primary animate-spin" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"/>
            </svg>
            <span class="text-sm text-on-surface-variant">{{ compressing ? 'Comprimindo...' : 'Clique para selecionar arquivos' }}</span>
            <input type="file" accept="image/*,video/*" multiple class="hidden" @change="onFileChange" />
          </label>

          <!-- Erros -->
          <ul v-if="fileErrors.length" class="space-y-1">
            <li
              v-for="(err, i) in fileErrors"
              :key="i"
              class="flex items-start gap-2 px-3 py-2 rounded-lg bg-error/10 border border-error/30 text-xs text-error"
            >
              <svg class="w-3.5 h-3.5 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
              </svg>
              {{ err }}
            </li>
          </ul>

          <!-- Vídeos acima de 20 MB -->
          <div v-if="videoOversized.length" class="rounded-xl border border-yellow-500/40 bg-yellow-500/8 p-4 space-y-3">
            <div class="flex items-start gap-2">
              <svg class="w-4 h-4 text-yellow-400 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
              </svg>
              <div class="space-y-1">
                <p class="text-sm font-medium text-yellow-300">
                  {{ videoOversized.length === 1 ? 'Vídeo excede' : 'Vídeos excedem' }} o limite de 20 MB
                </p>
                <ul class="space-y-0.5">
                  <li v-for="(v, i) in videoOversized" :key="i" class="text-xs text-yellow-200/80">
                    "{{ v.name }}" — {{ formatSize(v.size) }}
                  </li>
                </ul>
              </div>
            </div>
            <p class="text-xs text-yellow-200/70 leading-relaxed">
              Não é possível comprimir vídeos diretamente no navegador. Reduza o tamanho antes de enviar usando um compressor gratuito:
            </p>
            <a
              href="https://www.freeconvert.com/pt/video-compressor"
              target="_blank"
              rel="noopener noreferrer"
              class="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-yellow-500/20 border border-yellow-500/40 text-yellow-300 text-xs font-medium hover:bg-yellow-500/30 transition-colors"
            >
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/>
              </svg>
              Comprimir vídeo gratuitamente — freeconvert.com
            </a>
            <p class="text-xs text-yellow-200/50">Após comprimir, selecione o arquivo novamente aqui.</p>
          </div>

          <!-- Imagens acima de 20MB aguardando compressão agressiva -->
          <ul v-if="oversized.length" class="space-y-2">
            <li
              v-for="(item, i) in oversized"
              :key="i"
              class="flex items-center justify-between px-4 py-3 rounded-lg bg-yellow-500/10 border border-yellow-500/30 text-sm"
            >
              <div class="min-w-0">
                <p class="text-on-surface truncate font-medium">{{ item.file.name }}</p>
                <p class="text-xs text-on-surface-variant">{{ formatSize(item.file.size) }} — excede 20 MB, tente comprimir</p>
              </div>
              <div class="flex items-center gap-2 ml-3 shrink-0">
                <button
                  class="px-3 py-1.5 rounded-lg bg-primary text-on-primary text-xs font-medium hover:brightness-110 transition-all disabled:opacity-60"
                  :disabled="item.compressing"
                  @click="compressOversized(i)"
                >
                  {{ item.compressing ? 'Comprimindo...' : 'Comprimir' }}
                </button>
                <button class="text-on-surface-variant hover:text-error transition-colors" @click="dismissOversized(i)">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/>
                  </svg>
                </button>
              </div>
            </li>
          </ul>

          <!-- Lista de arquivos aceitos -->
          <ul v-if="attachments.length" class="space-y-2">
            <li
              v-for="(item, i) in attachments"
              :key="i"
              class="flex items-center justify-between px-4 py-2.5 rounded-lg bg-surface-container border border-outline-variant text-sm gap-2"
            >
              <div class="flex items-center gap-2 min-w-0 flex-1">
                <svg class="w-4 h-4 text-primary shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"/>
                </svg>
                <span class="text-on-surface truncate">{{ item.file.name }}</span>
                <span class="text-on-surface-variant shrink-0 text-xs">{{ formatSize(item.file.size) }}</span>
                <span
                  v-if="item.compressed"
                  class="shrink-0 px-1.5 py-0.5 rounded text-xs bg-primary/15 text-primary"
                  :title="`Original: ${formatSize(item.originalSize)}`"
                >↓ {{ Math.round((1 - item.file.size / item.originalSize) * 100) }}%</span>
              </div>

              <div class="flex items-center gap-2 shrink-0">
                <!-- Botão comprimir: só para imagens -->
                <button
                  v-if="item.file.type.startsWith('image/')"
                  class="px-2.5 py-1 rounded-lg border border-primary/40 text-primary text-xs font-medium hover:bg-primary/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  :disabled="item.compressing"
                  :title="item.compressed ? `Original: ${formatSize(item.originalSize)}` : 'Comprimir imagem'"
                  @click="recompressFile(i)"
                >
                  <span v-if="item.compressing">...</span>
                  <span v-else>{{ item.compressed ? 'Recomprimir' : 'Comprimir' }}</span>
                </button>
                <!-- Badge vídeo -->
                <span v-else class="px-2 py-0.5 rounded text-xs text-on-surface-variant border border-outline-variant">vídeo</span>

                <button class="text-on-surface-variant hover:text-error transition-colors" @click="removeFile(i)">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/>
                  </svg>
                </button>
              </div>
            </li>
          </ul>
        </div>

        <!-- Áudio -->
        <div class="space-y-3">
          <h3 class="text-primary font-semibold text-sm uppercase tracking-wider">Áudio (opcional)</h3>
          <p class="text-xs text-on-surface-variant">Grave até 2 minutos explicando o que precisa.</p>

          <p v-if="audioError" class="text-xs text-error">{{ audioError }}</p>

          <div v-if="!audioBlob" class="flex items-center gap-3">
            <button
              v-if="!isRecording"
              id="btn-start-recording"
              class="flex items-center gap-2 px-5 py-3 rounded-lg bg-primary text-on-primary font-medium hover:brightness-110 transition-all"
              @click="startRecording"
            >
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 1a4 4 0 014 4v6a4 4 0 01-8 0V5a4 4 0 014-4zm0 2a2 2 0 00-2 2v6a2 2 0 004 0V5a2 2 0 00-2-2zm-7 9a7 7 0 0014 0h2a9 9 0 01-8 8.94V23h-2v-2.06A9 9 0 013 12H5z"/>
              </svg>
              Gravar áudio
            </button>
            <button
              v-else
              id="btn-stop-recording"
              class="flex items-center gap-2 px-5 py-3 rounded-lg bg-error text-white font-medium hover:brightness-110 transition-all animate-pulse"
              @click="stopRecording"
            >
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <rect x="6" y="6" width="12" height="12" rx="1"/>
              </svg>
              Parar — {{ recordingLabel }}
            </button>
          </div>

          <div v-else class="flex flex-col gap-3 p-4 rounded-xl bg-surface-container border border-outline-variant">
            <div class="flex items-center justify-between">
              <span class="text-sm text-on-surface font-medium">Áudio gravado</span>
              <button class="text-on-surface-variant hover:text-error transition-colors text-xs flex items-center gap-1" @click="removeAudio">
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                </svg>
                Remover
              </button>
            </div>
            <audio :src="audioUrl" controls class="w-full h-10" />
          </div>
        </div>

        <!-- Enviar -->
        <div v-if="submitSuccess" class="flex items-center gap-3 px-4 py-3.5 rounded-xl bg-green-500/10 border border-green-500/30">
          <svg class="w-5 h-5 text-green-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/>
          </svg>
          <p class="text-sm text-green-300 font-medium">Solicitação enviada com sucesso!</p>
        </div>

        <p v-if="submitError" class="text-xs text-error text-center">{{ submitError }}</p>

        <button
          id="btn-enviar-solicitacao"
          :disabled="submitting || submitSuccess || !title.trim()"
          class="w-full py-3.5 rounded-lg bg-primary text-on-primary font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:brightness-110"
          @click="submitSolicitacao"
        >
          <span v-if="submitting" class="flex items-center justify-center gap-2">
            <svg class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"/>
            </svg>
            Enviando...
          </span>
          <span v-else>Enviar Solicitação</span>
        </button>

      </div>
    </div>
  </div>
</template>
