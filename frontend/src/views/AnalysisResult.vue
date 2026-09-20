<template>
  <div class="analysis-result">
    <!-- In progress -->
    <template v-if="!task || (task.status !== 'completed' && task.status !== 'failed')">
      <div class="page-header">
        <div>
          <h1>{{ task?.project_name || t('progress.processing') }}</h1>
          <p class="page-subtitle">{{ t('result.analysisNo', { id: route.params.taskId }) }} · {{ analysisTypeLabel }}</p>
        </div>
        <div class="page-actions">
          <span class="status-chip" :class="statusClass(currentStatus)">{{ statusLabel(currentStatus) }}</span>
        </div>
      </div>

      <AnalysisProgress :status="currentStatus" :error-message="task?.error_message" />

      <div class="live-layout">
        <div class="surface live-panel">
          <div class="live-head">
            <span v-if="livePhase" class="status-chip is-accent">{{ phaseLabel(livePhase) }}</span>
            <span v-else class="status-chip">{{ t('result.live') }}</span>
            <span v-if="liveFile" class="mono">{{ liveFile }}</span>
            <span class="live-count mono">{{ liveText.length }} {{ t('result.chars') }} · {{ t('result.streaming') }}</span>
          </div>
          <div ref="liveRef" class="live-body md-body">
            <div v-if="liveText" v-html="renderedMarkdown"></div>
            <div v-else class="live-waiting">
              <Icon name="loader" :size="20" class="spin" />
              <span>{{ statusText }}</span>
            </div>
          </div>
        </div>

        <aside class="surface task-card">
          <span class="section-label">{{ t('result.task') }}</span>
          <dl class="task-meta">
            <div><dt>{{ t('common.project') }}</dt><dd>{{ task?.project_name || '-' }}</dd></div>
            <div><dt>{{ t('common.analysisType') }}</dt><dd>{{ analysisTypeLabel }}</dd></div>
            <div><dt>{{ t('common.aiModel') }}</dt><dd class="mono">{{ task ? `${task.ai_provider} / ${task.ai_model}` : '-' }}</dd></div>
            <div><dt>{{ t('common.outputLanguage') }}</dt><dd>{{ task?.language === 'en' ? t('lang.en') : t('lang.zh') }}</dd></div>
            <div><dt>{{ t('result.started') }}</dt><dd>{{ formatTime(task?.created_at) }}</dd></div>
            <div><dt>{{ t('result.elapsed') }}</dt><dd class="mono">{{ elapsed }}</dd></div>
          </dl>
          <p class="task-hint">{{ t('result.leaveHint') }}</p>
        </aside>
      </div>
    </template>

    <!-- Failed -->
    <template v-else-if="task.status === 'failed'">
      <div class="page-header">
        <div>
          <h1>{{ task.project_name || `Project #${task.project_id}` }}</h1>
          <p class="page-subtitle">{{ t('result.analysisNo', { id: task.id }) }} · {{ analysisTypeLabel }}</p>
        </div>
        <div class="page-actions">
          <span class="status-chip is-danger">{{ statusLabel('failed') }}</span>
        </div>
      </div>
      <AnalysisProgress status="failed" :error-message="task.error_message" />
    </template>

    <!-- Completed -->
    <template v-else>
      <div class="page-header">
        <div>
          <h1>{{ task.project_name || `Project #${task.project_id}` }}</h1>
          <p class="page-subtitle">{{ t('result.analysisNo', { id: task.id }) }}</p>
        </div>
        <div class="page-actions">
          <span class="status-chip is-accent">{{ statusLabel('completed') }}</span>
          <el-button @click="$router.push('/history')">
            <Icon name="refresh" :size="16" />{{ t('common.reanalyze') }}
          </el-button>
        </div>
      </div>

      <div class="surface meta-strip">
        <span><span class="meta-key">{{ t('common.project') }}</span><b>{{ task.project_name || `#${task.project_id}` }}</b></span>
        <span><span class="meta-key">{{ t('common.analysisType') }}</span><span class="status-chip">{{ analysisTypeLabel }}</span></span>
        <span><span class="meta-key">{{ t('common.aiModel') }}</span><span class="mono">{{ task.ai_provider }} / {{ task.ai_model }}</span></span>
        <span><span class="meta-key">{{ t('common.outputLanguage') }}</span>{{ task.language === 'en' ? t('lang.en') : t('lang.zh') }}</span>
        <span><span class="meta-key">{{ t('common.completedAt') }}</span>{{ formatTime(task.completed_at) }}</span>
      </div>

      <div class="result-layout">
        <ResultSections :results="task.results" />

        <aside class="surface chat-panel">
          <div class="chat-head">
            <Icon name="chat" :size="18" />
            <span>{{ t('result.chatTitle') }}</span>
          </div>
          <div ref="chatMessagesRef" class="chat-messages">
            <div v-if="chatMessages.length === 0 && !chatStreaming" class="chat-empty">
              <p>{{ t('result.chatEmpty') }}</p>
            </div>
            <div v-for="(msg, idx) in chatMessages" :key="idx" class="chat-msg" :class="msg.role">
              <span class="msg-role">{{ msg.role === 'user' ? t('result.you') : 'AI' }}</span>
              <div class="msg-body md-body" v-html="renderMd(msg.content)"></div>
            </div>
            <div v-if="chatStreaming" class="chat-msg assistant">
              <span class="msg-role">AI</span>
              <div class="msg-body md-body" v-html="renderMd(chatStreamText) || '…'"></div>
            </div>
          </div>
          <div v-if="chatMessages.length === 0" class="chat-suggestions">
            <button v-for="s in suggestions" :key="s" type="button" @click="sendMessage(s)">{{ s }}</button>
          </div>
          <form class="chat-input" @submit.prevent="sendMessage()">
            <el-input
              v-model="chatInput"
              :placeholder="t('result.inputPlaceholder')"
              :disabled="chatStreaming"
              @keydown.enter.prevent="sendMessage()"
            />
            <el-button
              type="primary"
              class="send-btn"
              :aria-label="t('result.send')"
              :loading="chatStreaming"
              :disabled="!chatInput.trim() || chatStreaming"
              native-type="submit"
            >
              <Icon v-if="!chatStreaming" name="send" :size="18" />
            </el-button>
          </form>
        </aside>
      </div>
    </template>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch, nextTick } from 'vue'
import { useRoute } from 'vue-router'
import { marked } from 'marked'
import mermaid from 'mermaid'
import { useI18n } from 'vue-i18n'
import { useAnalysisStore } from '../stores/analysis'
import { useConfigStore } from '../stores/config'
import { streamAnalysis, chatWithAnalysis } from '../api/analysis'
import { aiLanguage } from '../i18n'
import { statusClass } from '../utils/status'
import Icon from '../components/Icon.vue'
import AnalysisProgress from '../components/AnalysisProgress.vue'
import ResultSections from '../components/ResultSections.vue'

const route = useRoute()
const { t, te, tm, locale } = useI18n()
const analysisStore = useAnalysisStore()
const configStore = useConfigStore()
const task = ref(null)
const currentStatus = ref('pending')
const liveText = ref('')
const livePhase = ref('')
const liveFile = ref('')
const liveRef = ref(null)
let abortController = null
let mermaidRenderTimer = null

const chatMessages = ref([])
const chatInput = ref('')
const chatStreaming = ref(false)
const chatStreamText = ref('')
const chatMessagesRef = ref(null)
const suggestions = computed(() => tm('result.suggestions'))

const now = ref(Date.now())
let clock = null

mermaid.initialize({ startOnLoad: false, theme: 'dark', securityLevel: 'loose' })

const renderer = new marked.Renderer()
let mermaidCounter = 0
renderer.code = function ({ text, lang }) {
  if (lang === 'mermaid') {
    mermaidCounter++
    return `<div class="mermaid-placeholder" data-mermaid-id="live-m-${mermaidCounter}" data-mermaid-code="${encodeURIComponent(text)}"><pre class="mermaid-source-inline">${text}</pre></div>`
  }
  return `<pre><code class="language-${lang || ''}">${text}</code></pre>`
}
marked.setOptions({ renderer, breaks: true })

function renderMd(text) {
  if (!text) return ''
  try {
    return marked.parse(text)
  } catch {
    return `<pre>${text}</pre>`
  }
}

const renderedMarkdown = computed(() => {
  if (!liveText.value) return ''
  mermaidCounter = 0
  return renderMd(liveText.value)
})

let lastRenderedIds = new Set()
watch(renderedMarkdown, async () => {
  await nextTick()
  if (mermaidRenderTimer) clearTimeout(mermaidRenderTimer)
  mermaidRenderTimer = setTimeout(renderMermaidBlocks, 800)
})

async function renderMermaidBlocks() {
  if (!liveRef.value) return
  const placeholders = liveRef.value.querySelectorAll('.mermaid-placeholder')
  for (const el of placeholders) {
    const id = el.getAttribute('data-mermaid-id')
    if (lastRenderedIds.has(id)) continue
    const code = decodeURIComponent(el.getAttribute('data-mermaid-code') || '')
    if (!code || code.length < 10) continue
    try {
      const { svg } = await mermaid.render(id, code)
      el.innerHTML = svg
      lastRenderedIds.add(id)
    } catch { /* keep source */ }
  }
}

const analysisTypeLabel = computed(() => {
  const type = task.value?.analysis_type
  return type && te(`analysisType.${type}`) ? t(`analysisType.${type}`) : type || ''
})

const statusText = computed(() => {
  const map = { pending: t('progress.pending'), parsing: t('progress.parsingText'), analyzing: t('progress.analyzingText') }
  return map[currentStatus.value] || t('progress.processing')
})

const elapsed = computed(() => {
  if (!task.value?.created_at) return '--:--'
  const sec = Math.max(0, Math.floor((now.value - new Date(task.value.created_at).getTime()) / 1000))
  const m = String(Math.floor(sec / 60)).padStart(2, '0')
  const s = String(sec % 60).padStart(2, '0')
  return `${m}:${s}`
})

function statusLabel(s) {
  return s && te(`status.${s}`) ? t(`status.${s}`) : s
}

function formatTime(value) {
  if (!value) return '-'
  return new Date(value).toLocaleString(locale.value)
}

function phaseLabel(p) {
  return te(`phase.${p}`) ? t(`phase.${p}`) : p
}

async function sendMessage(text) {
  const msg = text || chatInput.value.trim()
  if (!msg) return
  chatInput.value = ''

  let aiConfigId = task.value?.ai_config_id
  if (!aiConfigId) {
    if (configStore.models.length === 0) await configStore.fetchModels()
    const defaultModel = configStore.models.find((m) => m.is_default) || configStore.models[0]
    if (!defaultModel) return
    aiConfigId = defaultModel.id
  }

  chatMessages.value.push({ role: 'user', content: msg })
  chatStreaming.value = true
  chatStreamText.value = ''
  await nextTick()
  scrollChat()

  try {
    const taskId = route.params.taskId
    const response = await chatWithAnalysis(taskId, msg, aiConfigId, aiLanguage())
    if (!response.ok) throw new Error(`HTTP ${response.status}`)

    const reader = response.body.getReader()
    const decoder = new TextDecoder()
    let buffer = ''

    while (true) {
      const { done, value } = await reader.read()
      if (done) break

      buffer += decoder.decode(value, { stream: true })
      const lines = buffer.split('\n')
      buffer = lines.pop() || ''

      for (const line of lines) {
        if (!line.startsWith('data: ')) continue
        try {
          const data = JSON.parse(line.slice(6))
          if (data.type === 'chunk') {
            chatStreamText.value += data.content
            await nextTick()
            scrollChat()
          } else if (data.type === 'done') {
            chatMessages.value.push({ role: 'assistant', content: chatStreamText.value })
            chatStreamText.value = ''
            chatStreaming.value = false
          } else if (data.type === 'error') {
            chatMessages.value.push({ role: 'assistant', content: t('result.error') + data.content })
            chatStreaming.value = false
          }
        } catch { /* ignore */ }
      }
    }

    if (chatStreaming.value && chatStreamText.value) {
      chatMessages.value.push({ role: 'assistant', content: chatStreamText.value })
      chatStreamText.value = ''
      chatStreaming.value = false
    }
  } catch (err) {
    chatMessages.value.push({ role: 'assistant', content: t('result.requestFailed') + err.message })
    chatStreaming.value = false
  }
}

function scrollChat() {
  if (chatMessagesRef.value) {
    chatMessagesRef.value.scrollTop = chatMessagesRef.value.scrollHeight
  }
}

async function startStreaming(taskId) {
  abortController = new AbortController()
  try {
    const response = await streamAnalysis(taskId)
    if (!response.ok) return

    const reader = response.body.getReader()
    const decoder = new TextDecoder()
    let buffer = ''
    let prevPhase = ''

    while (true) {
      const { done, value } = await reader.read()
      if (done) break

      buffer += decoder.decode(value, { stream: true })
      const lines = buffer.split('\n')
      buffer = lines.pop() || ''

      for (const line of lines) {
        if (!line.startsWith('data: ')) continue
        try {
          const data = JSON.parse(line.slice(6))
          currentStatus.value = data.status || currentStatus.value

          if (data.phase && data.phase !== prevPhase && data.phase !== 'done') {
            liveText.value = ''
            lastRenderedIds = new Set()
            prevPhase = data.phase
          }

          if (data.new_text) liveText.value += data.new_text
          if (data.phase) livePhase.value = data.phase
          if (data.current_file !== undefined) liveFile.value = data.current_file

          await nextTick()
          if (liveRef.value) liveRef.value.scrollTop = liveRef.value.scrollHeight

          if (data.status === 'completed' || data.status === 'failed') {
            const result = await analysisStore.fetchResult(taskId)
            task.value = result
            return
          }
        } catch { /* ignore */ }
      }
    }
  } catch {
    const result = await analysisStore.fetchResult(taskId)
    task.value = result
    currentStatus.value = result.status
  }
}

onMounted(async () => {
  const taskId = route.params.taskId
  clock = setInterval(() => { now.value = Date.now() }, 1000)
  if (configStore.models.length === 0) configStore.fetchModels()
  try {
    const data = await analysisStore.fetchResult(taskId)
    task.value = data
    currentStatus.value = data.status
    if (data.status !== 'completed' && data.status !== 'failed') startStreaming(taskId)
  } catch {
    currentStatus.value = 'pending'
    startStreaming(taskId)
  }
})

onUnmounted(() => {
  if (abortController) abortController.abort()
  if (mermaidRenderTimer) clearTimeout(mermaidRenderTimer)
  if (clock) clearInterval(clock)
  analysisStore.stopPolling()
})
</script>

<style scoped>
.analysis-result {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.analysis-result .page-header { margin-bottom: 0; }

/* Live */
.live-layout {
  display: flex;
  gap: 20px;
  align-items: stretch;
}

.live-panel {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  min-height: 520px;
}

.live-head {
  display: flex;
  align-items: center;
  gap: 12px;
  height: 48px;
  padding: 0 20px;
  background: var(--bg-secondary);
  border-bottom: 1px solid var(--border-color);
}

.live-count { margin-left: auto; font-size: 12px; color: var(--text-muted); }

.live-body {
  flex: 1;
  padding: 24px 28px;
  max-height: 640px;
  overflow-y: auto;
}

.live-waiting {
  display: flex;
  align-items: center;
  gap: 12px;
  color: var(--text-muted);
}

.live-waiting .spin { color: var(--accent); }

.live-body :deep(.mermaid-placeholder) {
  margin: 12px 0;
  padding: 16px;
  background: var(--bg-primary);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-sm);
  overflow-x: auto;
}

.live-body :deep(.mermaid-placeholder svg) { max-width: 100%; height: auto; }
.live-body :deep(.mermaid-source-inline) {
  font-family: var(--font-mono);
  font-size: 12px;
  color: var(--text-muted);
  white-space: pre-wrap;
}

.task-card {
  width: 300px;
  flex-shrink: 0;
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.task-meta {
  display: flex;
  flex-direction: column;
  gap: 12px;
  font-size: 14px;
}

.task-meta div { display: flex; justify-content: space-between; gap: 12px; }
.task-meta dt { color: var(--text-muted); }
.task-meta dd { color: var(--text-primary); text-align: right; }
.task-meta dd.mono { color: var(--text-primary); }

.task-hint {
  padding-top: 16px;
  border-top: 1px solid var(--border-color);
  font-size: 13px;
  line-height: 1.6;
  color: var(--text-muted);
}

/* Completed */
.meta-strip {
  display: flex;
  gap: 28px;
  padding: 14px 20px;
  flex-wrap: wrap;
  font-size: 13px;
  color: var(--text-secondary);
}

.meta-strip > span { display: inline-flex; align-items: center; gap: 8px; }
.meta-key { color: var(--text-muted); }
.meta-strip b { color: var(--text-primary); font-weight: 600; }

.result-layout {
  display: flex;
  gap: 20px;
  align-items: flex-start;
}

.chat-panel {
  width: 340px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  position: sticky;
  top: 24px;
  height: calc(100vh - 48px);
  max-height: 800px;
}

.chat-head {
  display: flex;
  align-items: center;
  gap: 10px;
  height: 52px;
  padding: 0 18px;
  border-bottom: 1px solid var(--border-color);
  font-family: var(--font-display);
  font-size: 15px;
  font-weight: 600;
}

.chat-head svg { color: var(--accent); }

.chat-messages {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 18px;
  overflow-y: auto;
}

.chat-empty { color: var(--text-muted); font-size: 13px; line-height: 1.6; }

.chat-msg { display: flex; flex-direction: column; gap: 6px; }
.chat-msg.user { align-items: flex-end; }
.msg-role { font-size: 11px; color: var(--text-muted); }

.msg-body {
  max-width: 92%;
  padding: 10px 14px;
  border-radius: 12px 12px 12px 4px;
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  font-size: 13px;
  line-height: 1.6;
}

.chat-msg.user .msg-body {
  border-radius: 12px 12px 4px 12px;
  background: var(--accent-light);
  border-color: var(--accent-line);
  color: var(--text-primary);
}

.msg-body :deep(p:last-child) { margin-bottom: 0; }

.chat-suggestions {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  padding: 0 18px 12px;
}

.chat-suggestions button {
  height: 32px;
  padding: 0 12px;
  border-radius: 999px;
  background: transparent;
  border: 1px solid var(--border-strong);
  color: var(--text-secondary);
  font-size: 12px;
  cursor: pointer;
}

.chat-suggestions button:hover { border-color: var(--accent-line); color: var(--accent); }

.chat-input {
  display: flex;
  gap: 8px;
  padding: 12px 18px 18px;
  border-top: 1px solid var(--border-color);
}

.send-btn {
  width: 44px;
  padding: 0;
  flex-shrink: 0;
}

@media (max-width: 1200px) {
  .live-layout, .result-layout { flex-direction: column; }
  .task-card, .chat-panel { width: 100%; position: static; height: auto; }
  .chat-messages { max-height: 360px; }
}
</style>
