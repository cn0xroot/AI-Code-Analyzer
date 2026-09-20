<template>
  <form class="repo-form" @submit.prevent="handleClone">
    <div class="field-block">
      <span class="field-label">{{ t('repo.platform') }}</span>
      <div class="pills">
        <button
          v-for="p in platforms"
          :key="p.id"
          type="button"
          class="pill"
          :class="{ active: form.platform === p.id }"
          @click="form.platform = p.id"
        >{{ p.label }}</button>
      </div>
    </div>

    <div class="row">
      <label class="field-block grow">
        <span class="field-label">{{ t('repo.url') }}</span>
        <el-input v-model="form.url" placeholder="https://github.com/user/repo" clearable class="mono-input" />
      </label>
      <label class="field-block branch">
        <span class="field-label">{{ t('repo.branch') }}</span>
        <el-input v-model="form.branch" :placeholder="t('repo.branchPlaceholder')" clearable class="mono-input" />
      </label>
    </div>

    <div class="actions">
      <el-button native-type="submit" :loading="loading" :disabled="loading">
        <Icon v-if="!loading" name="download" :size="18" />
        {{ loading ? t('repo.cloning') : t('repo.clone') }}
      </el-button>
      <span v-if="!loading && project" class="cloned-note">
        <Icon name="check" :size="16" />
        <span>{{ t('repo.cloneSuccess', { name: project.name, count: project.file_count }) }}</span>
      </span>
    </div>

    <div v-if="loading" class="clone-progress">
      <div class="progress-header">
        <div class="progress-info">
          <Icon name="loader" :size="18" class="spin" />
          <span>{{ progressText }}</span>
        </div>
        <span v-if="speed > 0" class="speed-badge">{{ formatSpeed(speed) }}</span>
      </div>
      <el-progress
        :percentage="progressPercent"
        :stroke-width="8"
        :show-text="false"
        :status="progressPercent >= 100 ? 'success' : undefined"
      />
      <div class="progress-footer">
        <span v-if="curBytes > 0">{{ formatBytes(curBytes) }}</span>
        <span v-else-if="objects">{{ t('repo.objects') }}: {{ objects }}</span>
        <span>{{ t('repo.elapsed') }} {{ formatElapsed(elapsedTime) }}</span>
      </div>
    </div>
  </form>
</template>

<script setup>
import { reactive, ref, onUnmounted, onMounted, computed } from 'vue'
import Icon from './Icon.vue'
import { cloneRepoStream } from '../api/repos'
import { ElMessage } from 'element-plus'
import { useI18n } from 'vue-i18n'

const { t, te } = useI18n()

defineProps({
  project: { type: Object, default: null },
})
const emit = defineEmits(['cloned'])

const platforms = [
  { id: 'github', label: 'GitHub' },
  { id: 'gitlab', label: 'GitLab' },
  { id: 'gitee', label: 'Gitee' },
]

const loading = ref(false)
const progressPercent = ref(0)
const progressStage = ref('')
const speed = ref(0)
const curBytes = ref(0)
const totalBytes = ref(0)
const objects = ref('')
const elapsedTime = ref(0)
let timer = null

const form = reactive({
  platform: 'github',
  url: '',
  branch: '',
})

const progressText = computed(() => {
  const stage = progressStage.value
  const text = stage && te(`repo.stage.${stage}`) ? t(`repo.stage.${stage}`) : t('repo.stage.default')
  if (progressStage.value === 'receiving' && progressPercent.value > 0) {
    return `${text} ${progressPercent.value}%`
  }
  return text
})

function formatBytes(bytes) {
  if (bytes === 0) return '0 B'
  const units = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(1024))
  return (bytes / Math.pow(1024, i)).toFixed(i > 1 ? 2 : 0) + ' ' + units[i]
}

function formatSpeed(bps) {
  if (bps === 0) return ''
  if (bps < 1024) return bps + ' B/s'
  if (bps < 1024 * 1024) return (bps / 1024).toFixed(1) + ' KB/s'
  return (bps / 1024 / 1024).toFixed(2) + ' MB/s'
}

function formatElapsed(sec) {
  if (sec < 60) return `${sec}s`
  const m = Math.floor(sec / 60)
  const s = sec % 60
  return `${m}m ${s}s`
}

function startTimer() {
  elapsedTime.value = 0
  timer = setInterval(() => { elapsedTime.value++ }, 1000)
}

function stopTimer() {
  if (timer) { clearInterval(timer); timer = null }
}

function resetProgress() {
  progressPercent.value = 0
  progressStage.value = ''
  speed.value = 0
  curBytes.value = 0
  totalBytes.value = 0
  objects.value = ''
}

async function handleClone() {
  if (!form.url) {
    ElMessage.warning(t('repo.enterUrl'))
    return
  }
  loading.value = true
  resetProgress()
  progressStage.value = 'starting'
  startTimer()

  try {
    const response = await cloneRepoStream({
      url: form.url,
      branch: form.branch || undefined,
      platform: form.platform,
    })

    if (!response.ok) {
      const errText = await response.text()
      throw new Error(errText || `HTTP ${response.status}`)
    }

    const reader = response.body.getReader()
    const decoder = new TextDecoder()
    let buffer = ''
    let finalResult = null

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
          progressStage.value = data.stage || progressStage.value
          progressPercent.value = data.percent ?? progressPercent.value
          if (data.speed !== undefined) speed.value = data.speed
          if (data.cur_bytes !== undefined) curBytes.value = data.cur_bytes
          if (data.total_bytes !== undefined) totalBytes.value = data.total_bytes
          if (data.objects) objects.value = data.objects

          if (data.stage === 'error') {
            throw new Error(data.message || t('repo.stage.error'))
          }

          if (data.result) {
            finalResult = data.result
          }
        } catch (e) {
          if (e.message && !e.message.includes('JSON')) throw e
        }
      }
    }

    if (finalResult) {
      progressPercent.value = 100
      progressStage.value = 'done'
      ElMessage.success(t('repo.cloneSuccess', { name: finalResult.name, count: finalResult.file_count }))
      emit('cloned', finalResult)
    } else {
      throw new Error(t('repo.noResult'))
    }
  } catch (err) {
    ElMessage.error(t('repo.cloneFailed') + (err.message || err))
  } finally {
    stopTimer()
    setTimeout(() => {
      loading.value = false
      resetProgress()
    }, 2000)
  }
}

onMounted(() => {
  const prefill = sessionStorage.getItem('prefill_repo_url')
  if (prefill) {
    form.url = prefill
    sessionStorage.removeItem('prefill_repo_url')
    if (/gitlab\.com/.test(prefill)) form.platform = 'gitlab'
    else if (/gitee\.com/.test(prefill)) form.platform = 'gitee'
  }
})

onUnmounted(stopTimer)
</script>

<style scoped>
.repo-form {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.field-block {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.field-block.grow { flex: 1; min-width: 0; }
.field-block.branch { width: 260px; }

.field-label {
  font-size: 13px;
  font-weight: 500;
  color: var(--text-secondary);
}

.pills { display: flex; gap: 8px; }

.pill {
  height: 44px;
  padding: 0 16px;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  background: var(--bg-primary);
  color: var(--text-secondary);
  border: 1px solid var(--border-strong);
}

.pill.active {
  background: var(--accent-light);
  color: var(--accent);
  border-color: var(--accent-line);
}

.row { display: flex; gap: 16px; }

.mono-input :deep(.el-input__inner) { font-family: var(--font-mono); font-size: 13px; }

.actions {
  display: flex;
  align-items: center;
  gap: 16px;
}

.cloned-note {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: var(--accent);
}

.clone-progress {
  display: flex;
  flex-direction: column;
  gap: 10px;
  background: var(--bg-primary);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-sm);
  padding: 16px;
}

.progress-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.progress-info {
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--text-secondary);
  font-size: 14px;
}

.progress-info .spin { color: var(--accent); }

.speed-badge {
  background: var(--accent-light);
  color: var(--accent);
  padding: 2px 10px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 600;
  font-family: var(--font-mono);
}

.progress-footer {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: var(--text-muted);
  font-family: var(--font-mono);
}

@media (max-width: 900px) {
  .row { flex-direction: column; }
  .field-block.branch { width: 100%; }
}
</style>
