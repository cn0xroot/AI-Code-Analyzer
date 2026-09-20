<template>
  <div class="progress-container">
    <el-result
      v-if="status === 'failed'"
      icon="error"
      :title="t('progress.failed')"
      :sub-title="errorMessage || t('common.unknownError')"
    >
      <template #extra>
        <el-button type="primary" @click="$router.push('/analyze')">
          {{ t('common.reanalyze') }}
        </el-button>
      </template>
    </el-result>
    <div v-else class="analyzing">
      <el-icon :size="48" class="spin-icon"><Loading /></el-icon>
      <h3>{{ statusText }}</h3>
      <el-steps :active="stepIndex" align-center style="margin-top: 24px; max-width: 500px">
        <el-step :title="t('progress.queued')" />
        <el-step :title="t('progress.parsing')" />
        <el-step :title="t('progress.analyzing')" />
        <el-step :title="t('progress.done')" />
      </el-steps>
      <el-progress
        :percentage="progressPercent"
        :stroke-width="6"
        style="width: 300px; margin-top: 20px"
        :status="progressPercent >= 100 ? 'success' : undefined"
      />
      <p class="tip">{{ t('progress.tip') }}</p>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { Loading } from '@element-plus/icons-vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const props = defineProps({
  status: { type: String, default: 'pending' },
  errorMessage: { type: String, default: '' },
})

const statusText = computed(() => {
  const map = {
    pending: t('progress.pending'),
    parsing: t('progress.parsingText'),
    analyzing: t('progress.analyzingText'),
  }
  return map[props.status] || t('progress.processing')
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
