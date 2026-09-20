<template>
  <div class="mermaid-card surface">
    <div class="mermaid-toolbar">
      <h2 v-if="title" class="mermaid-title">{{ title }}</h2>
      <span v-if="filePath" class="mono file-path">{{ filePath }}</span>
      <span class="status-chip">{{ diagramType }}</span>
      <span class="toolbar-actions">
        <el-button size="small" text @click="copyCode"><Icon name="copy" :size="16" />{{ t('mermaid.copy') }}</el-button>
        <el-button size="small" @click="downloadSvg"><Icon name="download" :size="16" />SVG</el-button>
      </span>
    </div>
    <div ref="diagramRef" class="mermaid-render">
      <div v-if="renderFailed" class="mermaid-fallback">
        <p class="fallback-hint">{{ t('mermaid.renderFailed') }}</p>
        <pre class="mermaid-source">{{ code }}</pre>
      </div>
    </div>
    <el-collapse v-if="!renderFailed" class="source-collapse">
      <el-collapse-item :title="t('mermaid.viewSource')">
        <pre class="mermaid-source">{{ code }}</pre>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>

<script setup>
import { ref, watch, onMounted, nextTick } from 'vue'
import mermaid from 'mermaid'
import { ElMessage } from 'element-plus'
import { useI18n } from 'vue-i18n'
import Icon from './Icon.vue'

const { t } = useI18n()

const props = defineProps({
  code: { type: String, required: true },
  diagramType: { type: String, default: 'flowchart' },
  title: { type: String, default: '' },
  filePath: { type: String, default: '' },
})

const diagramRef = ref(null)
const renderFailed = ref(false)
let renderCount = 0

mermaid.initialize({
  startOnLoad: false,
  theme: 'dark',
  securityLevel: 'loose',
  flowchart: { useMaxWidth: true, htmlLabels: true },
})

function sanitizeMermaidCode(code) {
  let cleaned = code.trim()
  // Fix common issues with AI-generated mermaid
  // Remove BOM and zero-width chars
  cleaned = cleaned.replace(/[\uFEFF\u200B\u200C\u200D]/g, '')
  // Normalize line endings
  cleaned = cleaned.replace(/\r\n/g, '\n')
  // Fix unquoted Chinese labels in nodes - wrap bare text after [ or { with quotes
  // Replace <br/> with <br> for better compatibility
  cleaned = cleaned.replace(/<br\s*\/>/g, '<br>')
  return cleaned
}

async function renderDiagram() {
  if (!diagramRef.value || !props.code) return
  renderFailed.value = false

  const cleaned = sanitizeMermaidCode(props.code)

  // Try render with htmlLabels
  try {
    renderCount++
    const id = `mermaid-${Date.now()}-${renderCount}`
    const { svg } = await mermaid.render(id, cleaned)
    diagramRef.value.innerHTML = svg
    return
  } catch { /* try fallback */ }

  // Retry without htmlLabels and with stripped HTML tags
  try {
    renderCount++
    const id2 = `mermaid-fb-${Date.now()}-${renderCount}`
    const stripped = cleaned.replace(/<br\s*\/?>/g, ' ').replace(/<[^>]+>/g, '')
    mermaid.initialize({
      startOnLoad: false, theme: 'dark', securityLevel: 'loose',
      flowchart: { useMaxWidth: true, htmlLabels: false },
    })
    const { svg } = await mermaid.render(id2, stripped)
    diagramRef.value.innerHTML = svg
    // Restore default config
    mermaid.initialize({
      startOnLoad: false, theme: 'dark', securityLevel: 'loose',
      flowchart: { useMaxWidth: true, htmlLabels: true },
    })
    return
  } catch { /* final fallback */ }

  // Restore default config
  mermaid.initialize({
    startOnLoad: false, theme: 'dark', securityLevel: 'loose',
    flowchart: { useMaxWidth: true, htmlLabels: true },
  })
  renderFailed.value = true
}

function copyCode() {
  navigator.clipboard.writeText(props.code).then(() => {
    ElMessage.success(t('mermaid.copied'))
  })
}

function downloadSvg() {
  if (!diagramRef.value) return
  const svg = diagramRef.value.querySelector('svg')
  if (!svg) return
  const blob = new Blob([svg.outerHTML], { type: 'image/svg+xml' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `diagram-${props.diagramType}.svg`
  a.click()
  URL.revokeObjectURL(url)
}

onMounted(renderDiagram)
watch(() => props.code, () => nextTick(renderDiagram))
</script>

<style scoped>
.mermaid-card {
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.mermaid-toolbar {
  display: flex;
  align-items: center;
  gap: 10px;
  min-height: 52px;
  padding: 8px 20px;
  border-bottom: 1px solid var(--border-color);
  flex-wrap: wrap;
}

.mermaid-title { font-size: 18px; font-weight: 600; }
.file-path { color: var(--text-muted); }
.toolbar-actions { margin-left: auto; display: flex; gap: 6px; }

.mermaid-render {
  overflow-x: auto;
  text-align: center;
  padding: 24px;
  background: var(--bg-primary);
}

.mermaid-render :deep(svg) {
  max-width: 100%;
  height: auto;
}

.mermaid-fallback { text-align: left; }

.fallback-hint {
  color: var(--text-muted);
  font-size: 13px;
  margin-bottom: 8px;
}

.mermaid-source {
  background: var(--bg-primary);
  color: var(--text-secondary);
  padding: 14px 16px;
  border-radius: var(--radius-sm);
  font-size: 13px;
  overflow-x: auto;
  white-space: pre-wrap;
}

.source-collapse { padding: 0 20px; }
.source-collapse :deep(.el-collapse-item__header) { border-bottom: 0; }
.source-collapse :deep(.el-collapse-item__wrap) { border-bottom: 0; }
</style>
