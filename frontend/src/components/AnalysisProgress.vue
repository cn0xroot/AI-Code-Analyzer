<template>
  <div class="progress-container">
    <el-result
      v-if="status === 'failed'"
      icon="error"
      title="分析失败"
      :sub-title="errorMessage || '未知错误'"
    >
      <template #extra>
        <el-button type="primary" @click="$router.push('/analyze')">
          重新分析
        </el-button>
      </template>
    </el-result>
    <div v-else class="analyzing">
      <el-icon :size="48" class="spin-icon"><Loading /></el-icon>
      <h3>{{ statusText }}</h3>
      <el-steps :active="stepIndex" align-center style="margin-top: 24px; max-width: 500px">
        <el-step title="排队中" />
        <el-step title="解析代码" />
        <el-step title="AI分析" />
        <el-step title="完成" />
      </el-steps>
      <el-progress
        :percentage="progressPercent"
        :stroke-width="6"
        style="width: 300px; margin-top: 20px"
        :status="progressPercent >= 100 ? 'success' : undefined"
      />
      <p class="tip">分析时间取决于项目大小和AI模型响应速度</p>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { Loading } from '@element-plus/icons-vue'

const props = defineProps({
  status: { type: String, default: 'pending' },
  errorMessage: { type: String, default: '' },
})

const statusText = computed(() => {
  const map = {
    pending: '等待分析...',
    parsing: '正在解析代码结构...',
    analyzing: '正在调用AI分析，请稍候...',
  }
  return map[props.status] || '处理中...'
})

const stepIndex = computed(() => {
  const map = { pending: 0, parsing: 1, analyzing: 2, completed: 3 }
  return map[props.status] ?? 0
})

const progressPercent = computed(() => {
  const map = { pending: 10, parsing: 40, analyzing: 70, completed: 100 }
  return map[props.status] || 10
})
</script>

<style scoped>
.progress-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
}

.analyzing {
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.spin-icon {
  animation: spin 1.5s linear infinite;
  color: #409eff;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.tip {
  color: #909399;
  font-size: 13px;
  margin-top: 16px;
}
</style>
