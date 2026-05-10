<template>
  <el-tabs v-model="activeTab" type="border-card">
    <el-tab-pane
      v-for="group in groupedResults"
      :key="group.label"
      :label="group.label"
      :name="group.label"
    >
      <div v-for="item in group.items" :key="item.id" class="result-item">
        <h4 v-if="item.file_path" class="file-label">{{ item.file_path }}</h4>
        <div v-if="item.content_text" class="analysis-text">
          <div v-html="renderMarkdown(item.content_text)"></div>
        </div>
        <MermaidDiagram
          v-if="item.mermaid_code"
          :code="item.mermaid_code"
          :diagram-type="item.diagram_type || 'flowchart'"
        />
      </div>
    </el-tab-pane>
  </el-tabs>
</template>

<script setup>
import { ref, computed } from 'vue'
import { marked } from 'marked'
import MermaidDiagram from './MermaidDiagram.vue'

const props = defineProps({
  results: { type: Array, default: () => [] },
})

const activeTab = ref('')

const groupedResults = computed(() => {
  const groups = {}
  for (const r of props.results) {
    const label = r.section || '其他'
    if (!groups[label]) {
      groups[label] = { label, items: [] }
    }
    groups[label].items.push(r)
  }
  const list = Object.values(groups)
  if (list.length > 0 && !activeTab.value) {
    activeTab.value = list[0].label
  }
  return list
})

function renderMarkdown(text) {
  if (!text) return ''
  try {
    return marked.parse(text)
  } catch {
    return `<p>${text}</p>`
  }
}
</script>

<style scoped>
.result-item {
  margin-bottom: 24px;
}

.file-label {
  color: var(--accent);
  font-family: monospace;
  margin-bottom: 8px;
}

.analysis-text {
  background: var(--bg-secondary);
  padding: 20px 24px;
  border-radius: var(--radius-sm, 8px);
  border: 1px solid var(--border-color);
  margin-bottom: 12px;
  line-height: 1.8;
  color: var(--text-primary);
}

.analysis-text :deep(h1),
.analysis-text :deep(h2),
.analysis-text :deep(h3) {
  color: var(--accent);
  margin: 16px 0 8px 0;
  padding-bottom: 4px;
  border-bottom: 1px solid var(--border-color);
}

.analysis-text :deep(h1) { font-size: 18px; }
.analysis-text :deep(h2) { font-size: 16px; }
.analysis-text :deep(h3) { font-size: 15px; }

.analysis-text :deep(p) {
  margin-bottom: 10px;
  color: var(--text-primary);
}

.analysis-text :deep(ul),
.analysis-text :deep(ol) {
  margin: 6px 0 10px 20px;
  color: var(--text-primary);
}

.analysis-text :deep(li) {
  margin-bottom: 4px;
}

.analysis-text :deep(strong) {
  color: var(--text-primary);
}

.analysis-text :deep(code) {
  background: var(--bg-card);
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 13px;
  color: var(--accent);
}

.analysis-text :deep(pre) {
  background: var(--bg-card);
  padding: 12px;
  border-radius: 6px;
  overflow-x: auto;
  margin: 8px 0;
}

.analysis-text :deep(pre code) {
  background: transparent;
  color: var(--text-primary);
}

.analysis-text :deep(table) {
  border-collapse: collapse;
  width: 100%;
  margin: 8px 0;
}

.analysis-text :deep(th),
.analysis-text :deep(td) {
  border: 1px solid var(--border-color);
  padding: 6px 10px;
  text-align: left;
  color: var(--text-primary);
}

.analysis-text :deep(th) {
  background: var(--bg-card);
}

.analysis-text :deep(blockquote) {
  border-left: 3px solid var(--accent);
  padding-left: 12px;
  margin: 8px 0;
  color: var(--text-secondary);
}
</style>
