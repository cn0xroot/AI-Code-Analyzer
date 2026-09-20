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
          <Icon name="refresh" :size="16" />{{ t('common.reanalyze') }}
        </el-button>
      </template>
    </el-result>

    <div v-else class="stepper surface">
      <div v-for="(step, i) in steps" :key="step.key" class="step" :class="stepState(i)">
        <span class="step-dot">
          <Icon v-if="stepState(i) === 'done'" name="check" :size="16" :stroke-width="2.5" />
          <Icon v-else-if="stepState(i) === 'active'" name="loader" :size="16" class="spin" />
        </span>
        <span class="step-label">{{ t(step.label) }}</span>
        <span v-if="i < steps.length - 1" class="step-line"></span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n'
import Icon from './Icon.vue'

const props = defineProps({
  status: { type: String, default: 'pending' },
  errorMessage: { type: String, default: '' },
})

const { t } = useI18n()

const steps = [
  { key: 'pending', label: 'progress.queued' },
  { key: 'parsing', label: 'progress.parsing' },
  { key: 'analyzing', label: 'progress.analyzing' },
  { key: 'completed', label: 'progress.done' },
]

const order = { pending: 0, parsing: 1, analyzing: 2, completed: 3 }

function stepState(i) {
  const cur = order[props.status] ?? 0
  if (props.status === 'completed') return 'done'
  if (i < cur) return 'done'
  if (i === cur) return 'active'
  return 'todo'
}
</script>

<style scoped>
.stepper {
  display: flex;
  align-items: center;
  padding: 20px 24px;
}

.step {
  display: flex;
  align-items: center;
  gap: 10px;
}

.step:not(:last-child) { flex: 1; }

.step-dot {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  border: 2px solid var(--border-strong);
  flex-shrink: 0;
  color: var(--accent);
}

.step.done .step-dot {
  background: var(--accent);
  border-color: var(--accent);
  color: var(--accent-ink);
}

.step.active .step-dot { border-color: var(--accent); }

.step-label {
  font-size: 14px;
  font-weight: 500;
  color: var(--text-muted);
  white-space: nowrap;
}

.step.done .step-label, .step.active .step-label { color: var(--text-primary); }

.step-line {
  flex: 1;
  height: 2px;
  background: var(--border-strong);
  margin: 0 8px;
}

.step.done .step-line { background: var(--accent); }
</style>
