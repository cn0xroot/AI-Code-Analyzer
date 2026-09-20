<template>
  <div class="result-sections">
    <nav class="toc surface">
      <div class="toc-head section-label">{{ t('result.sections') }} · {{ groups.length }}</div>
      <button
        v-for="g in groups"
        :key="g.label"
        type="button"
        class="toc-item"
        :class="{ active: activeLabel === g.label }"
        @click="activeLabel = g.label"
      >
        <Icon :name="g.hasDiagram ? 'chart' : 'file'" :size="16" />
        <span>{{ g.label }}</span>
        <span v-if="g.items.length > 1" class="toc-count">{{ g.items.length }}</span>
      </button>
    </nav>

    <div class="content">
      <template v-if="activeGroup">
        <div v-for="item in activeGroup.items" :key="item.id" class="stack">
          <div v-if="item.content_text" class="surface text-card">
            <div class="card-head">
              <h2>{{ activeGroup.label }}</h2>
              <span v-if="item.file_path" class="mono file-path">{{ item.file_path }}</span>
            </div>
            <div class="md-body" v-html="renderMarkdown(item.content_text)"></div>
          </div>
          <MermaidDiagram
            v-if="item.mermaid_code"
            :code="item.mermaid_code"
            :title="activeGroup.label"
            :file-path="item.content_text ? '' : item.file_path"
            :diagram-type="item.diagram_type || 'flowchart'"
          />
        </div>
      </template>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { marked } from 'marked'
import { useI18n } from 'vue-i18n'
import Icon from './Icon.vue'
import MermaidDiagram from './MermaidDiagram.vue'

const props = defineProps({
  results: { type: Array, default: () => [] },
})

const { t } = useI18n()
const activeLabel = ref('')

const groups = computed(() => {
  const map = {}
  for (const r of props.results) {
    const label = r.section || t('result.other')
    if (!map[label]) map[label] = { label, items: [], hasDiagram: false }
    map[label].items.push(r)
    if (r.mermaid_code) map[label].hasDiagram = true
  }
  return Object.values(map)
})

const activeGroup = computed(() => groups.value.find((g) => g.label === activeLabel.value) || groups.value[0])

watch(groups, (list) => {
  if (list.length && !list.some((g) => g.label === activeLabel.value)) activeLabel.value = list[0].label
}, { immediate: true })

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
.result-sections {
  display: flex;
  gap: 20px;
  align-items: flex-start;
  min-width: 0;
  flex: 1;
}

.toc {
  width: 220px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 12px;
  position: sticky;
  top: 24px;
  max-height: calc(100vh - 48px);
  overflow-y: auto;
}

.toc-head { padding: 6px 12px 10px; }

.toc-item {
  display: flex;
  align-items: center;
  gap: 10px;
  min-height: 40px;
  padding: 8px 12px;
  border-radius: 8px;
  border: 0;
  background: transparent;
  color: var(--text-secondary);
  font-size: 13px;
  font-weight: 500;
  text-align: left;
  cursor: pointer;
}

.toc-item span:nth-child(2) { flex: 1; }
.toc-item:hover { background: var(--bg-secondary); color: var(--text-primary); }
.toc-item.active { background: var(--accent-light); color: var(--accent); font-weight: 600; }

.toc-count {
  font-family: var(--font-mono);
  font-size: 11px;
  color: var(--text-muted);
}

.content {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.text-card {
  padding: 24px 28px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.card-head {
  display: flex;
  align-items: baseline;
  gap: 14px;
  flex-wrap: wrap;
}

.card-head h2 { font-size: 18px; font-weight: 600; }
.file-path { color: var(--text-muted); }
</style>
