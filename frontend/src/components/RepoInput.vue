<template>
  <el-form :model="form" label-width="100px">
    <el-form-item label="仓库平台">
      <el-select v-model="form.platform" placeholder="选择平台">
        <el-option label="GitHub" value="github" />
        <el-option label="GitLab" value="gitlab" />
        <el-option label="Gitee" value="gitee" />
      </el-select>
    </el-form-item>
    <el-form-item label="仓库地址">
      <el-input
        v-model="form.url"
        placeholder="https://github.com/user/repo"
        clearable
      />
    </el-form-item>
    <el-form-item label="分支">
      <el-input
        v-model="form.branch"
        placeholder="默认分支 (可选)"
        clearable
      />
    </el-form-item>
    <el-form-item>
      <el-button type="primary" :loading="loading" :disabled="loading" @click="handleClone">
        {{ loading ? '克隆中...' : '克隆仓库' }}
      </el-button>
    </el-form-item>

    <!-- Clone progress -->
    <div v-if="loading" class="clone-progress">
      <div class="progress-header">
        <div class="progress-info">
          <el-icon class="spin-icon"><Loading /></el-icon>
          <span>{{ progressText }}</span>
        </div>
        <span v-if="speed > 0" class="speed-badge">{{ formatSpeed(speed) }}</span>
      </div>
      <el-progress
        :percentage="progressPercent"
        :stroke-width="8"
        :status="progressPercent >= 100 ? 'success' : undefined"
        style="margin-top: 8px"
      />
      <div class="progress-footer">
        <span v-if="curBytes > 0" class="bytes-info">
          {{ formatBytes(curBytes) }}
        </span>
        <span v-else-if="objects" class="bytes-info">
          对象: {{ objects }}
        </span>
        <span class="elapsed">已用时 {{ formatElapsed(elapsedTime) }}</span>
      </div>
    </div>
  </el-form>
</template>

<script setup>
import { reactive, ref, onUnmounted, computed } from 'vue'
import { Loading } from '@element-plus/icons-vue'
import { cloneRepoStream } from '../api/repos'
import { ElMessage } from 'element-plus'

const emit = defineEmits(['cloned'])

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
  const stageMap = {
    starting: '正在连接仓库...',
    counting: '正在统计对象...',
    compressing: '正在压缩数据...',
    receiving: '正在接收数据...',
    resolving: '正在解析引用...',
    writing: '正在写入文件...',
    cloning: '正在克隆...',
    done_clone: '克隆完成，正在处理...',
    counting_files: '正在统计代码文件...',
    done: '克隆完成!',
    error: '克隆失败',
  }
  const text = stageMap[progressStage.value] || '正在克隆仓库...'
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
    ElMessage.warning('请输入仓库地址')
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
            throw new Error(data.message || '克隆失败')
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
      ElMessage.success(`克隆成功: ${finalResult.name} (${finalResult.file_count} 个代码文件)`)
      emit('cloned', finalResult)
    } else {
      throw new Error('未收到克隆结果')
    }
  } catch (err) {
    ElMessage.error('克隆失败: ' + (err.message || err))
  } finally {
    stopTimer()
    setTimeout(() => {
      loading.value = false
      resetProgress()
    }, 2000)
  }
}

onUnmounted(stopTimer)
</script>

<style scoped>
.clone-progress {
  background: var(--accent-light, rgba(99,102,241,0.1));
  border: 1px solid var(--border-color);
  border-radius: var(--radius-sm, 8px);
  padding: 16px;
  margin-top: 8px;
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

.speed-badge {
  background: var(--accent);
  color: #fff;
  padding: 2px 10px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
  font-family: monospace;
}

.spin-icon {
  animation: spin 1s linear infinite;
  color: var(--accent);
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.progress-footer {
  display: flex;
  justify-content: space-between;
  margin-top: 6px;
  font-size: 12px;
  color: var(--text-muted);
  font-family: monospace;
}

.bytes-info {
  color: var(--text-secondary);
}
</style>
