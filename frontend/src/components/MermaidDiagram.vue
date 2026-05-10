<template>
  <div class="mermaid-container">
    <div class="mermaid-toolbar">
      <el-tag size="small" type="info">{{ diagramType }}</el-tag>
      <el-button size="small" @click="copyCode">复制代码</el-button>
      <el-button size="small" @click="downloadSvg">下载SVG</el-button>
    </div>
    <div ref="diagramRef" class="mermaid-render">
      <div v-if="renderFailed" class="mermaid-fallback">
        <p class="fallback-hint">图表渲染失败，显示源码：</p>
        <pre class="mermaid-source">{{ code }}</pre>
      </div>
    </div>
    <el-collapse v-if="!renderFailed">
      <el-collapse-item title="查看Mermaid源码">
        <pre class="mermaid-source">{{ code }}</pre>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>

<script setup>
import { ref, watch, onMounted, nextTick } from 'vue'
import mermaid from 'mermaid'
import { ElMessage } from 'element-plus'

const props = defineProps({
  code: { type: String, required: true },
  diagramType: { type: String, default: 'flowchart' },
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
    ElMessage.success('已复制到剪贴板')
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
.mermaid-container {
  border: 1px solid var(--border-color);
  border-radius: var(--radius-sm, 8px);
  padding: 16px;
  margin: 12px 0;
  background: var(--bg-secondary);
}

.mermaid-toolbar {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
}

.mermaid-render {
  overflow-x: auto;
  text-align: center;
}

.mermaid-render :deep(svg) {
  max-width: 100%;
  height: auto;
}

.mermaid-fallback {
  text-align: left;
}

.fallback-hint {
  color: var(--text-muted);
  font-size: 13px;
  margin-bottom: 8px;
}

.mermaid-source {
  background: var(--bg-card);
  color: var(--text-secondary);
  padding: 12px;
  border-radius: 4px;
  font-size: 13px;
  overflow-x: auto;
  white-space: pre-wrap;
}

.mermaid-error {
  color: var(--danger, #f56c6c);
  padding: 16px;
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 4px;
}

.mermaid-error pre {
  margin-top: 8px;
  font-size: 12px;
  color: var(--text-muted);
}
</style>
