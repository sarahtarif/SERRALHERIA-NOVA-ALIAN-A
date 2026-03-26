<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useSupabase } from '~/composables/useSupabase'
import MediaLightbox from './MediaLightbox.vue'

const supabase = useSupabase()

interface PortfolioItem {
  id: string
  title: string
  description?: string
  category: string
  location?: string
  media_type?: string
  show_on_home: boolean
  aspect_ratio?: string
  created_at: string
  sort_order: number
  data_url?: string
}

const items = ref<PortfolioItem[]>([])
const loading = ref(true)
const uploading = ref(false)
const error = ref('')
const success = ref('')

// Drag and drop state
const dragIndex = ref<number | null>(null)
const dragOverIndex = ref<number | null>(null)
const touchStartY = ref(0)
const touchItemIndex = ref<number | null>(null)
const savingOrder = ref(false)

const lightbox = ref<{ src: string; mediaType?: string; title?: string } | null>(null)

// Edição
const editItem = ref<PortfolioItem | null>(null)
const editForm = ref({ title: '', description: '', category: '', location: '', aspect_ratio: '', show_on_home: true })
const editFile = ref<File | null>(null)
const editPreviewUrl = ref<string | null>(null)
const editFileInput = ref<HTMLInputElement | null>(null)
const editSaving = ref(false)
const editError = ref('')

function openEdit(item: PortfolioItem) {
  editItem.value = item
  editForm.value = {
    title: item.title,
    description: item.description ?? '',
    category: item.category,
    location: item.location ?? '',
    aspect_ratio: item.aspect_ratio ?? '16/9',
    show_on_home: item.show_on_home,
  }
  editFile.value = null
  editPreviewUrl.value = item.data_url ?? null
  editError.value = ''
}

function onEditFileChange(e: Event) {
  const f = (e.target as HTMLInputElement).files?.[0]
  if (!f) return
  editFile.value = f
  if (editPreviewUrl.value && editPreviewUrl.value.startsWith('blob:')) URL.revokeObjectURL(editPreviewUrl.value)
  editPreviewUrl.value = URL.createObjectURL(f)
}

async function saveEdit() {
  if (!editItem.value) return
  editSaving.value = true
  editError.value = ''
  try {
    const token = await getToken()
    const fd = new FormData()
    fd.append('title', editForm.value.title)
    fd.append('description', editForm.value.description)
    fd.append('category', editForm.value.category)
    fd.append('location', editForm.value.location)
    fd.append('aspect_ratio', editForm.value.aspect_ratio)
    fd.append('show_on_home', String(editForm.value.show_on_home))
    if (editFile.value) fd.append('file', editFile.value)

    await $fetch('/api/portfolio/' + editItem.value.id + '/update', {
      method: 'PATCH',
      headers: { Authorization: 'Bearer ' + token },
      body: fd,
    })

    // Atualiza localmente
    const idx = items.value.findIndex(i => i.id === editItem.value!.id)
    if (idx >= 0) {
      items.value[idx] = {
        ...items.value[idx],
        ...editForm.value,
        data_url: editPreviewUrl.value ?? items.value[idx].data_url,
      }
    }
    editItem.value = null
  } catch (e: unknown) {
    editError.value = (e as { data?: { message?: string } })?.data?.message ?? 'Erro ao salvar.'
  } finally {
    editSaving.value = false
  }
}

function onDragStart(index: number) {
  dragIndex.value = index
}

function onDragOver(e: DragEvent, index: number) {
  e.preventDefault()
  dragOverIndex.value = index
}

function onDrop(index: number) {
  if (dragIndex.value === null || dragIndex.value === index) {
    dragIndex.value = null
    dragOverIndex.value = null
    return
  }
  reorderItems(dragIndex.value, index)
  dragIndex.value = null
  dragOverIndex.value = null
}

function onDragEnd() {
  dragIndex.value = null
  dragOverIndex.value = null
}

// Touch support
function onTouchStart(e: TouchEvent, index: number) {
  touchStartY.value = e.touches[0].clientY
  touchItemIndex.value = index
}

function onTouchMove(e: TouchEvent) {
  e.preventDefault()
  if (touchItemIndex.value === null) return
  const touch = e.touches[0]
  const el = document.elementFromPoint(touch.clientX, touch.clientY)
  const card = el?.closest('[data-card-index]')
  if (card) {
    const idx = parseInt((card as HTMLElement).dataset.cardIndex ?? '-1')
    if (idx >= 0) dragOverIndex.value = idx
  }
}

function onTouchEnd() {
  if (touchItemIndex.value !== null && dragOverIndex.value !== null && touchItemIndex.value !== dragOverIndex.value) {
    reorderItems(touchItemIndex.value, dragOverIndex.value)
  }
  touchItemIndex.value = null
  dragOverIndex.value = null
}

async function reorderItems(fromIndex: number, toIndex: number) {
  const arr = [...items.value]
  const [moved] = arr.splice(fromIndex, 1)
  arr.splice(toIndex, 0, moved)

  // Reatribui sort_order sequencial
  arr.forEach((item, i) => { item.sort_order = i + 1 })
  items.value = arr

  // Persiste no banco
  savingOrder.value = true
  try {
    await Promise.all(arr.map(item =>
      supabase.from('portfolio').update({ sort_order: item.sort_order }).eq('id', item.id)
    ))
  } finally {
    savingOrder.value = false
  }
}

// Form
const form = ref({
  title: '',
  description: '',
  category: 'portoes',
  location: '',
  show_on_home: true,
  aspect_ratio: '9/16',
})
const fileInput = ref<HTMLInputElement | null>(null)
const selectedFile = ref<File | null>(null)
const previewUrl = ref<string | null>(null)

const MAX_MB = 30
const fileSizeMB = ref(0)
const fileSizeOver = ref(false)

function formatSize(bytes: number): string {
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
  return (bytes / (1024 * 1024)).toFixed(2) + ' MB'
}

const categories = [
  { value: 'portoes', label: 'Portões' },
  { value: 'automacao', label: 'Protetores de Rede' },
  { value: 'travas', label: 'Travas' },
  { value: 'cameras', label: 'Câmeras' },
  { value: 'interfones', label: 'Interfones' },
  { value: 'manutencao', label: 'Manutenção' },
]

const aspectRatioOptions = [
  { value: '16/9', label: '16:9 — paisagem (padrão)' },
  { value: '4/3', label: '4:3 — foto clássica' },
  { value: '1/1', label: '1:1 — quadrado' },
  { value: '3/4', label: '3:4 — retrato' },
  { value: '9/16', label: '9:16 — vertical (stories)' },
  { value: '21/9', label: '21:9 — panorâmica' },
  { value: '3/2', label: '3:2 — DSLR padrão' },
]

function onFileChange(e: Event) {
  const f = (e.target as HTMLInputElement).files?.[0]
  if (!f) return
  selectedFile.value = f
  fileSizeMB.value = f.size / (1024 * 1024)
  fileSizeOver.value = fileSizeMB.value > MAX_MB
  if (previewUrl.value) URL.revokeObjectURL(previewUrl.value)
  previewUrl.value = URL.createObjectURL(f)
  // Detecta aspect ratio automaticamente para imagens
  if (f.type.startsWith('image/')) {
    const img = new Image()
    const tempUrl = URL.createObjectURL(f)
    img.onload = () => {
      const ratio = img.naturalWidth / img.naturalHeight
      form.value.aspect_ratio = ratio < 1 ? '9/16' : ratio > 1.5 ? '16/9' : '1/1'
      URL.revokeObjectURL(tempUrl)
    }
    img.src = tempUrl
  }
}

function isVideo(mediaType?: string) {
  return (mediaType ?? '').startsWith('video/')
}

async function getToken(): Promise<string> {
  const { data } = await supabase.auth.getSession()
  return data.session?.access_token ?? ''
}

async function upload() {
  if (!selectedFile.value || !form.value.title.trim()) {
    error.value = 'Título e arquivo são obrigatórios.'
    return
  }
  uploading.value = true
  error.value = ''
  success.value = ''
  try {
    const token = await getToken()
    const fd = new FormData()
    fd.append('file', selectedFile.value)
    fd.append('title', form.value.title)
    fd.append('description', form.value.description)
    fd.append('category', form.value.category)
    fd.append('location', form.value.location)
    fd.append('show_on_home', String(form.value.show_on_home))
    fd.append('aspect_ratio', form.value.aspect_ratio)

    const res = await $fetch<{ ok: boolean }>('/api/portfolio/upload', {
      method: 'POST',
      headers: { Authorization: 'Bearer ' + token },
      body: fd,
    })
    if (res.ok) {
      success.value = 'Publicado com sucesso!'
      form.value = { title: '', description: '', category: 'portoes', location: '', show_on_home: true, aspect_ratio: '9/16' }
      selectedFile.value = null
      previewUrl.value = null
      if (fileInput.value) fileInput.value.value = ''
      await fetchItems()
    }
  } catch (e: unknown) {
    error.value = (e as { data?: { message?: string } })?.data?.message ?? 'Erro ao enviar.'
  } finally {
    uploading.value = false
  }
}

async function deleteItem(id: string) {
  if (!confirm('Remover este item do portfólio?')) return
  const token = await getToken()
  await $fetch('/api/portfolio/' + id + '/delete', {
    method: 'DELETE',
    headers: { Authorization: 'Bearer ' + token },
  })
  await fetchItems()
}

async function toggleHome(item: PortfolioItem) {
  await supabase.from('portfolio').update({ show_on_home: !item.show_on_home }).eq('id', item.id)
  item.show_on_home = !item.show_on_home
}

async function moveItem(index: number, direction: 'up' | 'down') {
  const targetIndex = direction === 'up' ? index - 1 : index + 1
  if (targetIndex < 0 || targetIndex >= items.value.length) return
  reorderItems(index, targetIndex)
}

async function fetchItems() {
  loading.value = true
  try {
    const { data } = await supabase.rpc('get_portfolio_all')
    items.value = (data ?? []) as PortfolioItem[]
  } finally {
    loading.value = false
  }
}

onMounted(() => fetchItems())
</script>

<template>
  <div id="admin-portfolio" class="flex-1 overflow-y-auto px-4 py-6 space-y-6">

    <!-- Header -->
    <div class="flex items-center gap-3">
      <div class="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style="background:rgba(99,102,241,0.12); border:1px solid rgba(99,102,241,0.2);">
        <svg class="w-5 h-5" style="color:#818cf8;" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 16m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
        </svg>
      </div>
      <div>
        <p class="text-sm font-semibold text-white">Portfólio</p>
        <p class="text-xs" style="color:#64748b;">Publique fotos e vídeos dos trabalhos realizados</p>
      </div>
    </div>

    <!-- Form de upload -->
    <div class="rounded-2xl p-5 space-y-4" style="background:#0d1526; border:1px solid rgba(255,255,255,0.07);">
      <p class="text-xs font-semibold uppercase tracking-wider" style="color:#475569;">Novo item</p>

      <!-- Preview com proporção dinâmica -->
      <div class="space-y-2">
        <div class="flex items-center justify-between">
          <span class="text-xs font-medium" style="color:#94a3b8;">Preview — como vai aparecer no site</span>
          <span v-if="previewUrl" class="text-xs px-2 py-0.5 rounded-full" style="background:rgba(99,102,241,0.15); color:#a5b4fc;">{{ form.aspect_ratio }}</span>
        </div>
        <div
          class="relative rounded-xl overflow-hidden flex items-center justify-center cursor-pointer transition-all mx-auto"
          :style="{
            aspectRatio: form.aspect_ratio,
            background: '#132030',
            border: '2px dashed rgba(255,255,255,0.1)',
            maxHeight: '360px',
            maxWidth: form.aspect_ratio === '9/16' ? '200px' : form.aspect_ratio === '1/1' ? '300px' : '100%',
            width: '100%',
          }"
          @click="fileInput?.click()"
        >
          <video v-if="previewUrl && selectedFile?.type.startsWith('video/')" :src="previewUrl" class="w-full h-full object-cover" controls />
          <img v-else-if="previewUrl" :src="previewUrl" class="w-full h-full object-cover" />
          <div v-else class="flex flex-col items-center gap-2 py-8" style="color:#475569;">
            <svg class="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"/>
            </svg>
            <span class="text-sm">Clique para selecionar foto ou vídeo</span>
            <span class="text-xs">JPG, PNG, MP4, MOV — máx. 30 MB</span>
          </div>
          <input ref="fileInput" type="file" accept="image/*,video/*" class="hidden" @change="onFileChange" />
        </div>
      </div>

      <!-- Indicador de tamanho -->
      <div v-if="selectedFile" class="space-y-1.5">
        <div class="flex items-center justify-between text-xs">
          <span style="color:#94a3b8;">
            {{ selectedFile.name }} — <span :style="fileSizeOver ? 'color:#ef4444; font-weight:600;' : 'color:#34d399;'">{{ formatSize(selectedFile.size) }}</span>
          </span>
          <span class="text-xs" style="color:#475569;">limite: {{ MAX_MB }} MB</span>
        </div>
        <!-- Barra de progresso -->
        <div class="w-full h-1.5 rounded-full overflow-hidden" style="background:rgba(255,255,255,0.07);">
          <div
            class="h-full rounded-full transition-all"
            :style="{
              width: Math.min((fileSizeMB / MAX_MB) * 100, 100) + '%',
              background: fileSizeOver ? '#ef4444' : fileSizeMB > MAX_MB * 0.7 ? '#f5a623' : '#34d399'
            }"
          />
        </div>
        <!-- Aviso + link de compressão -->
        <div v-if="fileSizeOver" class="flex items-start gap-2 px-3 py-2 rounded-lg" style="background:rgba(239,68,68,0.08); border:1px solid rgba(239,68,68,0.2);">
          <svg class="w-4 h-4 shrink-0 mt-0.5" style="color:#ef4444;" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
          </svg>
          <div class="text-xs leading-relaxed" style="color:#fca5a5;">
            Arquivo muito grande. Comprima antes de enviar:
            <div class="flex flex-wrap gap-2 mt-1.5">
              <a href="https://squoosh.app" target="_blank" rel="noopener" class="underline font-medium" style="color:#f87171;">squoosh.app</a>
              <span style="color:#475569;">·</span>
              <a href="https://www.iloveimg.com/pt/comprimir-imagem" target="_blank" rel="noopener" class="underline font-medium" style="color:#f87171;">iLoveIMG</a>
              <span style="color:#475569;">·</span>
              <a href="https://www.freeconvert.com/pt/video-compressor" target="_blank" rel="noopener" class="underline font-medium" style="color:#f87171;">FreeConvert (vídeo)</a>
            </div>
          </div>
        </div>
        <div v-else-if="fileSizeMB > MAX_MB * 0.7" class="text-xs px-3 py-1.5 rounded-lg" style="background:rgba(245,166,35,0.08); border:1px solid rgba(245,166,35,0.2); color:#fbbf24;">
          Arquivo grande — considere comprimir para melhor performance.
        </div>
      </div>

      <!-- Campos -->
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div class="sm:col-span-2">
          <label class="block text-xs text-gray-400 mb-1">Título *</label>
          <input v-model="form.title" type="text" placeholder="Ex: Portão deslizante instalado" class="w-full px-3 py-2 rounded-lg text-sm outline-none" style="background:#1e293b; color:#e2e8f0; border:1px solid rgba(255,255,255,0.08);" />
        </div>
        <div class="sm:col-span-2">
          <label class="block text-xs text-gray-400 mb-1">Descrição</label>
          <input v-model="form.description" type="text" placeholder="Descrição opcional" class="w-full px-3 py-2 rounded-lg text-sm outline-none" style="background:#1e293b; color:#e2e8f0; border:1px solid rgba(255,255,255,0.08);" />
        </div>
        <div>
          <label class="block text-xs text-gray-400 mb-1">Categoria</label>
          <select v-model="form.category" class="w-full px-3 py-2 rounded-lg text-sm outline-none" style="background:#1e293b; color:#e2e8f0; border:1px solid rgba(255,255,255,0.08);">
            <option v-for="c in categories" :key="c.value" :value="c.value">{{ c.label }}</option>
          </select>
        </div>
        <div>
          <label class="block text-xs text-gray-400 mb-1">Bairro / Localização</label>
          <input v-model="form.location" type="text" placeholder="Ex: Vila Mariana" class="w-full px-3 py-2 rounded-lg text-sm outline-none" style="background:#1e293b; color:#e2e8f0; border:1px solid rgba(255,255,255,0.08);" />
        </div>
        <div>
          <label class="block text-xs text-gray-400 mb-1">Proporção da mídia</label>
          <select v-model="form.aspect_ratio" class="w-full px-3 py-2 rounded-lg text-sm outline-none" style="background:#1e293b; color:#e2e8f0; border:1px solid rgba(255,255,255,0.08);">
            <option v-for="opt in aspectRatioOptions" :key="opt.value" :value="opt.value">{{ opt.label }}</option>
          </select>
          <p class="text-xs mt-1" style="color:#475569;">No site, todos os cards têm altura fixa — a proporção afeta apenas a prévia abaixo.</p>
        </div>
        <div class="flex items-center gap-3 pt-4">
          <button
            type="button"
            class="relative w-10 h-6 rounded-full transition-colors"
            :style="form.show_on_home ? 'background:#6366f1;' : 'background:#334155;'"
            @click="form.show_on_home = !form.show_on_home"
          >
            <span class="absolute top-1 w-4 h-4 rounded-full bg-white transition-all" :style="form.show_on_home ? 'left:22px;' : 'left:2px;'" />
          </button>
          <span class="text-xs" style="color:#94a3b8;">Exibir na página inicial</span>
        </div>
      </div>

      <!-- Feedback -->
      <p v-if="error" class="text-xs text-red-400">{{ error }}</p>
      <p v-if="success" class="text-xs text-green-400">{{ success }}</p>

      <!-- Prévia do card como o usuário vai ver -->
      <div v-if="previewUrl" class="space-y-2">
        <p class="text-xs font-semibold uppercase tracking-wider" style="color:#475569;">Como o usuário vai ver no site</p>
        <p class="text-xs" style="color:#334155;">Altura fixa de 220px — igual ao grid da galeria</p>
        <div class="rounded-xl overflow-hidden max-w-xs" style="background:#132030; border:1px solid rgba(255,255,255,0.08);">
          <!-- Mídia com altura fixa igual ao site -->
          <div class="relative overflow-hidden" style="height: 220px;">
            <video v-if="selectedFile?.type.startsWith('video/')" :src="previewUrl" class="w-full h-full object-cover" controls playsinline />
            <img v-else :src="previewUrl" class="w-full h-full object-cover" />
          </div>
          <!-- Info igual ao card da galeria -->
          <div class="p-3 space-y-1.5" style="background:#0d1526;">
            <div class="flex items-center justify-between">
              <span class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium" style="background:rgba(99,102,241,0.15); color:#a5b4fc;">
                {{ categories.find(c => c.value === form.category)?.label ?? form.category }}
              </span>
              <span v-if="form.location" class="text-xs" style="color:#64748b;">{{ form.location }}</span>
            </div>
            <p class="text-sm font-semibold text-white">{{ form.title || 'Título do trabalho' }}</p>
            <p v-if="form.description" class="text-xs leading-relaxed" style="color:#94a3b8;">{{ form.description }}</p>
          </div>
        </div>
      </div>

      <!-- Botão -->
      <button
        :disabled="uploading || !selectedFile || !form.title.trim() || fileSizeOver"
        class="w-full py-2.5 rounded-xl text-sm font-semibold transition-all disabled:opacity-40 disabled:cursor-not-allowed"
        style="background:rgba(99,102,241,0.2); color:#a5b4fc; border:1px solid rgba(99,102,241,0.3);"
        @click="upload"
      >
        {{ uploading ? 'Enviando...' : 'Publicar' }}
      </button>
    </div>

    <!-- Lista -->
    <div class="space-y-3">
      <div class="flex items-center justify-between">
        <p class="text-xs font-semibold uppercase tracking-wider" style="color:#475569;">Publicados ({{ items.length }})</p>
        <div v-if="savingOrder" class="flex items-center gap-1.5 text-xs" style="color:#64748b;">
          <svg class="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"/>
          </svg>
          Salvando ordem...
        </div>
        <p v-else class="text-xs" style="color:#334155;">Segure e arraste para reordenar</p>
      </div>

      <div v-if="loading" class="space-y-2">
        <div v-for="i in 3" :key="i" class="h-20 rounded-xl animate-pulse" style="background:#0d1526;" />
      </div>

      <div v-else-if="items.length === 0" class="text-center py-8 text-sm" style="color:#475569;">
        Nenhum item publicado ainda
      </div>

      <div v-else class="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div
          v-for="(item, index) in items"
          :key="item.id"
          :data-card-index="index"
          draggable="true"
          class="rounded-xl overflow-hidden transition-all select-none"
          :style="{
            background: '#0d1526',
            border: dragOverIndex === index && dragIndex !== index
              ? '2px solid rgba(99,102,241,0.6)'
              : '1px solid rgba(255,255,255,0.07)',
            opacity: dragIndex === index ? '0.5' : '1',
            cursor: 'grab',
          }"
          @dragstart="onDragStart(index)"
          @dragover="onDragOver($event, index)"
          @drop="onDrop(index)"
          @dragend="onDragEnd"
          @touchstart.passive="onTouchStart($event, index)"
          @touchmove.prevent="onTouchMove"
          @touchend="onTouchEnd"
        >
          <!-- Mídia preview -->
          <div class="relative bg-surface-container-high overflow-hidden group/media" style="aspect-ratio:16/9;">
            <video v-if="isVideo(item.media_type)" :src="item.data_url" class="w-full h-full object-cover" preload="metadata" />
            <img v-else :src="item.data_url" :alt="item.title" class="w-full h-full object-cover" loading="lazy" />
            <button
              class="absolute bottom-2 right-2 w-8 h-8 rounded-lg flex items-center justify-center opacity-0 group-hover/media:opacity-100 transition-opacity"
              style="background:rgba(0,0,0,0.6); color:#fff;"
              @click.stop="lightbox = { src: item.data_url ?? '', mediaType: item.media_type, title: item.title }"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"/>
              </svg>
            </button>
          </div>
          <!-- Info -->
          <div class="p-3 space-y-2">
            <p class="text-sm font-semibold text-white truncate">{{ item.title }}</p>
            <div class="flex items-center justify-between gap-2">
              <span class="text-xs px-2 py-0.5 rounded-full" style="background:rgba(99,102,241,0.15); color:#a5b4fc;">{{ item.category }}</span>
              <span v-if="item.location" class="text-xs" style="color:#475569;">{{ item.location }}</span>
            </div>
            <div class="flex items-center justify-between pt-1">
              <!-- Handle drag + botões mobile -->
              <div class="flex items-center gap-1">
                <div class="flex flex-col gap-0.5 px-1 cursor-grab" style="color:#334155;">
                  <div class="flex gap-0.5">
                    <span class="w-1 h-1 rounded-full" style="background:#475569;"/>
                    <span class="w-1 h-1 rounded-full" style="background:#475569;"/>
                  </div>
                  <div class="flex gap-0.5">
                    <span class="w-1 h-1 rounded-full" style="background:#475569;"/>
                    <span class="w-1 h-1 rounded-full" style="background:#475569;"/>
                  </div>
                  <div class="flex gap-0.5">
                    <span class="w-1 h-1 rounded-full" style="background:#475569;"/>
                    <span class="w-1 h-1 rounded-full" style="background:#475569;"/>
                  </div>
                </div>
                <button
                  class="w-7 h-7 rounded-lg flex items-center justify-center transition-colors disabled:opacity-30"
                  style="background:rgba(255,255,255,0.05); color:#64748b;"
                  :disabled="index === 0"
                  @click.stop="moveItem(index, 'up')"
                >
                  <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M5 15l7-7 7 7"/>
                  </svg>
                </button>
                <button
                  class="w-7 h-7 rounded-lg flex items-center justify-center transition-colors disabled:opacity-30"
                  style="background:rgba(255,255,255,0.05); color:#64748b;"
                  :disabled="index === items.length - 1"
                  @click.stop="moveItem(index, 'down')"
                >
                  <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"/>
                  </svg>
                </button>
              </div>
              <!-- Toggle home -->
              <button
                class="flex items-center gap-1.5 text-xs transition-colors"
                :style="item.show_on_home ? 'color:#34d399;' : 'color:#475569;'"
                @click="toggleHome(item)"
              >
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
                </svg>
                {{ item.show_on_home ? 'Na home' : 'Oculto' }}
              </button>
              <!-- Deletar -->
              <button
                class="text-xs px-2 py-1 rounded-lg transition-colors"
                style="color:#ef4444; background:rgba(239,68,68,0.08);"
                @click="deleteItem(item.id)"
              >
                Remover
              </button>
              <button
                class="text-xs px-2 py-1 rounded-lg transition-colors"
                style="color:#818cf8; background:rgba(99,102,241,0.08);"
                @click.stop="openEdit(item)"
              >
                Editar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

  </div>

  <MediaLightbox
    v-if="lightbox"
    :src="lightbox.src"
    :media-type="lightbox.mediaType"
    :title="lightbox.title"
    @close="lightbox = null"
  />

  <!-- Modal de edição -->
  <Teleport to="body">
    <div
      v-if="editItem"
      class="fixed inset-0 z-50 flex items-center justify-center p-4"
      style="background:rgba(0,0,0,0.7); backdrop-filter:blur(4px);"
      @click.self="editItem = null"
    >
      <div class="w-full max-w-md rounded-2xl overflow-hidden" style="background:#0d1526; border:1px solid rgba(255,255,255,0.08); max-height:90vh; overflow-y:auto;">
        <!-- Header -->
        <div class="flex items-center justify-between px-5 py-4" style="border-bottom:1px solid rgba(255,255,255,0.06);">
          <p class="text-sm font-semibold text-white">Editar item</p>
          <button class="w-7 h-7 rounded-lg flex items-center justify-center" style="color:#64748b;" @click="editItem = null">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>

        <div class="p-5 space-y-4">
          <!-- Preview / trocar mídia -->
          <div class="space-y-1.5">
            <div class="flex items-center justify-between">
              <span class="text-xs" style="color:#64748b;">Preview — clique para trocar mídia</span>
              <span class="text-xs px-2 py-0.5 rounded-full" style="background:rgba(99,102,241,0.15); color:#a5b4fc;">{{ editForm.aspect_ratio }}</span>
            </div>
            <div
              class="relative rounded-xl overflow-hidden cursor-pointer mx-auto"
              :style="{
                aspectRatio: editForm.aspect_ratio,
                background: '#132030',
                border: '2px dashed rgba(255,255,255,0.08)',
                maxHeight: '320px',
                maxWidth: editForm.aspect_ratio === '9/16' ? '180px' : editForm.aspect_ratio === '1/1' ? '260px' : '100%',
                width: '100%',
              }"
              @click="editFileInput?.click()"
            >
              <video v-if="editFile?.type.startsWith('video/') || (!editFile && editItem?.media_type?.startsWith('video/'))" :src="editPreviewUrl ?? ''" class="w-full h-full object-cover" preload="metadata" />
              <img v-else-if="editPreviewUrl" :src="editPreviewUrl" class="w-full h-full object-cover" />
              <div class="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity" style="background:rgba(0,0,0,0.5);">
                <span class="text-xs text-white px-3 py-1.5 rounded-lg" style="background:rgba(99,102,241,0.4);">Trocar mídia</span>
              </div>
              <input ref="editFileInput" type="file" accept="image/*,video/*" class="hidden" @change="onEditFileChange" />
            </div>
          </div>

          <!-- Campos -->
          <div class="space-y-3">
            <div>
              <label class="block text-xs text-gray-400 mb-1">Título *</label>
              <input v-model="editForm.title" type="text" class="w-full px-3 py-2 rounded-lg text-sm outline-none" style="background:#1e293b; color:#e2e8f0; border:1px solid rgba(255,255,255,0.08);" />
            </div>
            <div>
              <label class="block text-xs text-gray-400 mb-1">Descrição</label>
              <input v-model="editForm.description" type="text" class="w-full px-3 py-2 rounded-lg text-sm outline-none" style="background:#1e293b; color:#e2e8f0; border:1px solid rgba(255,255,255,0.08);" />
            </div>
            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="block text-xs text-gray-400 mb-1">Categoria</label>
                <select v-model="editForm.category" class="w-full px-3 py-2 rounded-lg text-sm outline-none" style="background:#1e293b; color:#e2e8f0; border:1px solid rgba(255,255,255,0.08);">
                  <option v-for="c in categories" :key="c.value" :value="c.value">{{ c.label }}</option>
                </select>
              </div>
              <div>
                <label class="block text-xs text-gray-400 mb-1">Localização</label>
                <input v-model="editForm.location" type="text" class="w-full px-3 py-2 rounded-lg text-sm outline-none" style="background:#1e293b; color:#e2e8f0; border:1px solid rgba(255,255,255,0.08);" />
              </div>
            </div>
            <div>
              <label class="block text-xs text-gray-400 mb-1">Proporção</label>
              <select v-model="editForm.aspect_ratio" class="w-full px-3 py-2 rounded-lg text-sm outline-none" style="background:#1e293b; color:#e2e8f0; border:1px solid rgba(255,255,255,0.08);">
                <option v-for="opt in aspectRatioOptions" :key="opt.value" :value="opt.value">{{ opt.label }}</option>
              </select>
            </div>
            <div class="flex items-center gap-3">
              <button
                type="button"
                class="relative w-10 h-6 rounded-full transition-colors"
                :style="editForm.show_on_home ? 'background:#6366f1;' : 'background:#334155;'"
                @click="editForm.show_on_home = !editForm.show_on_home"
              >
                <span class="absolute top-1 w-4 h-4 rounded-full bg-white transition-all" :style="editForm.show_on_home ? 'left:22px;' : 'left:2px;'" />
              </button>
              <span class="text-xs" style="color:#94a3b8;">Exibir na página inicial</span>
            </div>
          </div>

          <p v-if="editError" class="text-xs text-red-400">{{ editError }}</p>

          <div class="flex gap-2 pt-1">
            <button
              class="flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all"
              style="background:rgba(255,255,255,0.04); color:#64748b; border:1px solid rgba(255,255,255,0.07);"
              @click="editItem = null"
            >
              Cancelar
            </button>
            <button
              :disabled="editSaving || !editForm.title.trim()"
              class="flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all disabled:opacity-40"
              style="background:rgba(99,102,241,0.2); color:#a5b4fc; border:1px solid rgba(99,102,241,0.3);"
              @click="saveEdit"
            >
              {{ editSaving ? 'Salvando...' : 'Salvar' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>
