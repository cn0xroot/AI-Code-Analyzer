<template>
  <div class="analysis-result">
    <!-- In-progress: show live AI output with Markdown preview -->
    <template v-if="!task || (task.status !== 'completed' && task.status !== 'failed')">
      <div class="live-section">
        <div class="live-header">
          <AnalysisProgress
            :status="currentStatus"
            :error-message="task?.error_message"
          />
        </div>
        <div v-if="liveText" class="live-output">
          <div class="live-meta">
            <span v-if="livePhase" class="live-phase">{{ phaseLabel(livePhase) }}</span>
            <span v-if="liveFile" class="live-file">{{ liveFile }}</span>
            <span class="live-chars">{{ liveText.length }} 字符</span>
          </div>
          <div class="live-markdown" ref="liveRef" v-html="renderedMarkdown"></div>
        </div>
      </div>
    </template>

    <!-- Failed -->
    <template v-else-if="task.status === 'failed'">
      <AnalysisProgress status="failed" :error-message="task.error_message" />
    </template>

    <!-- Completed -->
    <template v-else-if="task.status === 'completed'">
      <div class="result-header">
        <h2>分析结果</h2>
        <el-descriptions :column="3" border size="small">
          <el-descriptions-item label="项目">{{ task.project_name || `Project #${task.project_id}` }}</el-descriptions-item>
          <el-descriptions-item label="分析类型">{{ analysisTypeLabel }}</el-descriptions-item>
          <el-descriptions-item label="AI模型">{{ task.ai_provider }} / {{ task.ai_model }}</el-descriptions-item>
          <el-descriptions-item label="创建时间">{{ formatTime(task.created_at) }}</el-descriptions-item>
          <el-descriptions-item label="完成时间">{{ formatTime(task.completed_at) }}</el-descriptions-item>
        </el-descriptions>
      </div>

      <DiagramTabs :results="task.results" />

      <!-- Chat Panel -->
      <div class="chat-section">
        <div class="chat-header">
          <h3>AI 对话</h3>
          <span class="chat-hint">基于分析结果向 AI 提问</span>
        </div>
        <div class="chat-messages" ref="chatMessagesRef">
          <div v-if="chatMessages.length === 0" class="chat-empty">
            <p>你可以针对分析结果提问，例如：</p>
            <div class="chat-suggestions">
              <el-button
                v-for="s in suggestions"
                :key="s"
                size="small"
                @click="sendMessage(s)"
              >{{ s }}</el-button>
            </div>
          </div>
          <div
            v-for="(msg, idx) in chatMessages"
            :key="idx"
            class="chat-msg"
            :class="msg.role"
          >
            <div class="msg-role">{{ msg.role === 'user' ? '你' : 'AI' }}</div>
            <div class="msg-body" v-html="renderMd(msg.content)"></div>
          </div>
          <div v-if="chatStreaming" class="chat-msg assistant">
            <div class="msg-role">AI</div>
            <div class="msg-body" v-html="renderMd(chatStreamText)"></div>
          </div>
        </div>
        <div class="chat-input-area">
          <el-input
            v-model="chatInput"
            placeholder="输入你的问题..."
            :disabled="chatStreaming"
            @keydown.enter.prevent="sendMessage()"
            autosize
            type="textarea"
            :rows="1"
          />
          <el-button
            type="primary"
            :loading="chatStreaming"
            :disabled="!chatInput.trim() || chatStreaming"
            @click="sendMessage()"
          >
            发送
          </el-button>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch, nextTick } from 'vue'
import { useRoute } from 'vue-router'
import { marked } from 'marked'
import mermaid from 'mermaid'
import { useAnalysisStore } from '../stores/analysis'
import { useConfigStore } from '../stores/config'
import { streamAnalysis, chatWithAnalysis } from '../api/analysis'
import AnalysisProgress from '../components/AnalysisProgress.vue'
import DiagramTabs from '../components/DiagramTabs.vue'

const route = useRoute()
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

// Chat state
const chatMessages = ref([])
const chatInput = ref('')
const chatStreaming = ref(false)
const chatStreamText = ref('')
const chatMessagesRef = ref(null)
const suggestions = [
  '这个项目的核心亮点是什么？',
  '代码中有什么潜在的安全问题？',
  '如何优化这个项目的性能？',
  '项目的扩展性如何？建议如何改进？',
]

mermaid.initialize({ startOnLoad: false, theme: 'dark', securityLevel: 'loose' })

// Configure marked for mermaid blocks
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

// Render mermaid diagrams
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
  const map = { overview: '项目概览', function: '功能分析', logic_flow: '逻辑流程', full: '全量分析' }
  return map[task.value?.analysis_type] || task.value?.analysis_type
})

function formatTime(t) {
  if (!t) return '-'
  return new Date(t).toLocaleString('zh-CN')
}

function phaseLabel(p) {
  const map = { overview: '项目概览分析', function: '功能分析', logic_flow: '逻辑流程分析' }
  return map[p] || p
}

// Chat functions
async function sendMessage(text) {
  const msg = text || chatInput.value.trim()
  if (!msg) return
  chatInput.value = ''

  // Find AI config to use
  let aiConfigId = task.value?.ai_config_id
  if (!aiConfigId) {
    if (configStore.models.length === 0) await configStore.fetchModels()
    const defaultModel = configStore.models.find(m => m.is_default) || configStore.models[0]
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
    const response = await chatWithAnalysis(taskId, msg, aiConfigId)
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
            chatMessages.value.push({ role: 'assistant', content: `错误: ${data.content}` })
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
    chatMessages.value.push({ role: 'assistant', content: `请求失败: ${err.message}` })
    chatStreaming.value = false
  }
}

function scrollChat() {
  if (chatMessagesRef.value) {
    chatMessagesRef.value.scrollTop = chatMessagesRef.value.scrollHeight
  }
}

// Analysis streaming
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
  analysisStore.stopPolling()
})
</script>

<style scoped>
.analysis-result {
  max-width: 1100px;
  margin: 0 auto;
  padding: 24px;
}

.result-header { margin-bottom: 24px; }
.result-header h2 { margin-bottom: 16px; }

.live-section { display: flex; flex-direction: column; gap: 20px; }

.live-output {
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-sm, 8px);
  overflow: hidden;
}

.live-meta {
  display: flex; align-items: center; gap: 12px;
  padding: 10px 16px; background: var(--bg-secondary);
  border-bottom: 1px solid var(--border-color); font-size: 13px;
}

.live-phase { color: var(--accent); font-weight: 600; }
.live-file { color: var(--text-muted); font-family: monospace; }
.live-chars { margin-left: auto; color: var(--text-muted); font-size: 12px; font-family: monospace; }

.live-markdown {
  padding: 20px 24px; max-height: 600px; overflow-y: auto;
  color: var(--text-primary); font-size: 14px; line-height: 1.8;
}

.live-markdown :deep(h1), .live-markdown :deep(h2), .live-markdown :deep(h3) {
  color: var(--accent); margin: 20px 0 12px 0; padding-bottom: 6px;
  border-bottom: 1px solid var(--border-color);
}
.live-markdown :deep(h1) { font-size: 20px; }
.live-markdown :deep(h2) { font-size: 18px; }
.live-markdown :deep(h3) { font-size: 16px; }
.live-markdown :deep(p) { margin-bottom: 12px; }
.live-markdown :deep(ul), .live-markdown :deep(ol) { margin: 8px 0 12px 20px; }
.live-markdown :deep(li) { margin-bottom: 4px; }
.live-markdown :deep(strong) { color: var(--text-primary); }
.live-markdown :deep(code) { background: var(--bg-secondary); padding: 2px 6px; border-radius: 4px; font-size: 13px; }
.live-markdown :deep(pre) { background: var(--bg-secondary); padding: 12px 16px; border-radius: 8px; overflow-x: auto; margin: 12px 0; }
.live-markdown :deep(pre code) { background: transparent; padding: 0; }
.live-markdown :deep(.mermaid-placeholder) { background: var(--bg-secondary); border: 1px solid var(--border-color); border-radius: 8px; padding: 16px; margin: 12px 0; text-align: center; overflow-x: auto; }
.live-markdown :deep(.mermaid-source-inline) { text-align: left; font-size: 12px; color: var(--text-muted); }
.live-markdown :deep(.mermaid-placeholder svg) { max-width: 100%; height: auto; }
.live-markdown :deep(table) { border-collapse: collapse; width: 100%; margin: 12px 0; }
.live-markdown :deep(th), .live-markdown :deep(td) { border: 1px solid var(--border-color); padding: 8px 12px; text-align: left; }
.live-markdown :deep(th) { background: var(--bg-secondary); font-weight: 600; }
.live-markdown :deep(blockquote) { border-left: 3px solid var(--accent); padding-left: 12px; margin: 12px 0; color: var(--text-secondary); }

/* ===== Chat Panel ===== */
.chat-section {
  margin-top: 32px;
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: var(--radius, 12px);
  overflow: hidden;
}

.chat-header {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 20px;
  background: var(--bg-secondary);
  border-bottom: 1px solid var(--border-color);
}

.chat-header h3 {
  margin: 0;
  font-size: 15px;
  color: var(--text-primary);
}

.chat-hint {
  color: var(--text-muted);
  font-size: 13px;
}

.chat-messages {
  min-height: 120px;
  max-height: 500px;
  overflow-y: auto;
  padding: 16px 20px;
}

.chat-empty {
  text-align: center;
  color: var(--text-muted);
  padding: 24px 0;
}

.chat-empty p {
  margin-bottom: 16px;
  font-size: 14px;
}

.chat-suggestions {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  justify-content: center;
}

.chat-msg {
  margin-bottom: 16px;
}

.chat-msg.user .msg-role {
  color: var(--accent);
  font-weight: 600;
}

.chat-msg.assistant .msg-role {
  color: var(--accent-secondary, var(--accent-hover));
  font-weight: 600;
}

.msg-role {
  font-size: 12px;
  margin-bottom: 4px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.msg-body {
  background: var(--bg-secondary);
  padding: 12px 16px;
  border-radius: var(--radius-sm, 8px);
  border: 1px solid var(--border-color);
  color: var(--text-primary);
  font-size: 14px;
  line-height: 1.7;
}

.chat-msg.user .msg-body {
  background: var(--accent-light);
  border-color: transparent;
}

.msg-body :deep(h1), .msg-body :deep(h2), .msg-body :deep(h3) {
  color: var(--accent); margin: 12px 0 8px 0; font-size: 15px;
}
.msg-body :deep(p) { margin-bottom: 8px; }
.msg-body :deep(code) { background: var(--bg-card); padding: 2px 5px; border-radius: 3px; font-size: 13px; }
.msg-body :deep(pre) { background: var(--bg-card); padding: 10px 14px; border-radius: 6px; overflow-x: auto; margin: 8px 0; }
.msg-body :deep(pre code) { background: transparent; }
.msg-body :deep(ul), .msg-body :deep(ol) { margin: 6px 0 8px 18px; }

.chat-input-area {
  display: flex;
  gap: 10px;
  padding: 14px 20px;
  border-top: 1px solid var(--border-color);
  background: var(--bg-secondary);
  align-items: flex-end;
}

.chat-input-area .el-input {
  flex: 1;
}
</style>
