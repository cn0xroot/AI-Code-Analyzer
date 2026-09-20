<template>
  <div class="analysis-config">
    <div class="page-header">
      <div>
        <h1>{{ t('config.title') }}</h1>
        <p class="page-subtitle">{{ t('config.subtitle') }}</p>
      </div>
    </div>

    <div v-if="runningTasks.length > 0" class="running-banner">
      <Icon name="loader" :size="18" class="spin" />
      <span>{{ t('config.runningTasks', { count: runningTasks.length }) }}</span>
      <div class="running-links">
        <router-link v-for="rt in runningTasks" :key="rt.id" :to="`/result/${rt.id}`">
          {{ t('config.task') }} #{{ rt.id }} →
        </router-link>
      </div>
    </div>

    <div class="segmented">
      <button type="button" :class="{ active: sourceTab === 'online' }" @click="sourceTab = 'online'">
        <Icon name="branch" :size="18" />{{ t('config.onlineRepo') }}
      </button>
      <button type="button" :class="{ active: sourceTab === 'upload' }" @click="sourceTab = 'upload'">
        <Icon name="upload" :size="18" />{{ t('config.localUpload') }}
      </button>
    </div>

    <div class="stack">
      <span class="section-label">{{ t('config.stepSource') }}</span>
      <div class="surface surface-pad">
        <RepoInput v-if="sourceTab === 'online'" :project="project" @cloned="onCodeReady" />
        <FileUploader v-else :project="project" @uploaded="onCodeReady" />
      </div>

      <span class="section-label">{{ t('config.stepConfig') }}</span>
      <div class="surface surface-pad config-card" :class="{ disabled: !project }">
        <div class="field-block">
          <span class="field-label">{{ t('common.analysisType') }}</span>
          <div class="type-grid">
            <button
              v-for="ty in analysisTypes"
              :key="ty.id"
              type="button"
              class="type-card"
              :class="{ selected: analysisType === ty.id }"
              @click="analysisType = ty.id"
            >
              <span class="type-head">
                <Icon :name="ty.icon" :size="18" />
                {{ t(`analysisType.${ty.id}`) }}
                <Icon v-if="analysisType === ty.id" name="check" :size="18" class="type-check" />
              </span>
              <span class="type-desc">{{ t(`config.typeDesc.${ty.id}`) }}</span>
            </button>
          </div>
        </div>

        <div class="config-row">
          <div class="field-block grow">
            <span class="field-label">{{ t('common.aiModel') }}</span>
            <ModelSelector v-model="selectedModel" />
          </div>
          <div class="field-block">
            <span class="field-label">{{ t('common.outputLanguage') }}</span>
            <div class="segmented small">
              <button type="button" :class="{ active: outputLanguage === 'zh' }" @click="outputLanguage = 'zh'">{{ t('lang.zh') }}</button>
              <button type="button" :class="{ active: outputLanguage === 'en' }" @click="outputLanguage = 'en'">{{ t('lang.en') }}</button>
            </div>
          </div>
        </div>

        <div class="config-footer">
          <span class="text-muted">
            <template v-if="project">
              <b>{{ project.name }}</b> · {{ t('config.estimate', { type: t(`analysisType.${analysisType}`), count: project.file_count }) }}
            </template>
            <template v-else>{{ t('config.needCodeAndModel') }}</template>
          </span>
          <el-button
            type="primary"
            size="large"
            :loading="analysisStore.loading"
            :disabled="!selectedModel || !project"
            @click="startAnalysis"
          >
            <Icon name="play" :size="16" />{{ t('common.startAnalysis') }}
          </el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import { useI18n } from 'vue-i18n'
import Icon from '../components/Icon.vue'
import RepoInput from '../components/RepoInput.vue'
import FileUploader from '../components/FileUploader.vue'
import ModelSelector from '../components/ModelSelector.vue'
import { useAnalysisStore } from '../stores/analysis'
import { aiLanguage } from '../i18n'

const PROJECT_KEY = 'current_project'

const { t } = useI18n()
const router = useRouter()
const route = useRoute()
const analysisStore = useAnalysisStore()

const sourceTab = ref(route.query.tab === 'upload' ? 'upload' : 'online')
const project = ref(null)
const selectedModel = ref(null)
const analysisType = ref('overview')
const outputLanguage = ref(aiLanguage())

const analysisTypes = [
  { id: 'overview', icon: 'layers' },
  { id: 'function', icon: 'code' },
  { id: 'logic_flow', icon: 'branch' },
  { id: 'full', icon: 'zap' },
]

const runningTasks = computed(() => analysisStore.getRunningTasks())

onMounted(() => {
  try {
    const saved = sessionStorage.getItem(PROJECT_KEY)
    if (saved) project.value = JSON.parse(saved)
  } catch { /* ignore */ }
})

function onCodeReady(data) {
  project.value = data
  sessionStorage.setItem(PROJECT_KEY, JSON.stringify(data))
}

async function startAnalysis() {
  if (!project.value || !selectedModel.value) {
    ElMessage.warning(t('config.needCodeAndModel'))
    return
  }
  try {
    const result = await analysisStore.startAnalysis({
      source_type: sourceTab.value === 'online' ? 'github' : 'upload',
      project_id: project.value.project_id,
      analysis_type: analysisType.value,
      ai_config_id: selectedModel.value,
      language: outputLanguage.value,
    })
    router.push(`/result/${result.task_id}`)
  } catch (err) {
    ElMessage.error(t('config.createFailed') + (err.response?.data?.detail || err.message))
  }
}
</script>

<style scoped>
.analysis-config {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.running-banner {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 14px 18px;
  background: rgba(242, 181, 68, 0.08);
  border: 1px solid rgba(242, 181, 68, 0.3);
  border-radius: 12px;
  color: var(--text-primary);
}

.running-banner .spin { color: var(--warning); }

.running-links {
  margin-left: auto;
  display: flex;
  gap: 16px;
}

.running-links a {
  color: var(--warning);
  font-weight: 600;
  font-size: 13px;
}

.segmented {
  display: inline-flex;
  gap: 4px;
  padding: 4px;
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  align-self: flex-start;
}

.segmented button {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  height: 40px;
  padding: 0 16px;
  border-radius: 9px;
  border: 0;
  background: transparent;
  color: var(--text-secondary);
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
}

.segmented button.active {
  background: var(--bg-secondary);
  color: var(--text-primary);
  font-weight: 600;
}

.segmented.small {
  background: var(--bg-primary);
  border-color: var(--border-strong);
  border-radius: 10px;
}

.segmented.small button {
  height: 36px;
  border-radius: 7px;
  font-size: 13px;
}

.config-card {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.config-card.disabled {
  opacity: 0.6;
}

.field-block {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.field-block.grow { flex: 1; min-width: 0; }

.field-label {
  font-size: 13px;
  font-weight: 500;
  color: var(--text-secondary);
}

.type-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 12px;
}

.type-card {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 16px;
  text-align: left;
  background: var(--bg-primary);
  border: 1px solid var(--border-strong);
  border-radius: 12px;
  color: var(--text-primary);
  cursor: pointer;
  transition: border-color 0.15s, background 0.15s;
}

.type-card:hover { border-color: var(--accent-line); }

.type-card.selected {
  background: var(--accent-light);
  border-color: var(--accent-line);
}

.type-head {
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  font-family: var(--font-display);
  font-size: 15px;
  font-weight: 600;
  color: var(--text-secondary);
}

.type-card.selected .type-head { color: var(--text-primary); }
.type-card.selected .type-head > svg:first-child { color: var(--accent); }
.type-check { margin-left: auto; color: var(--accent); }

.type-desc {
  font-size: 13px;
  line-height: 1.5;
  color: var(--text-secondary);
}

.config-row {
  display: flex;
  gap: 24px;
  align-items: flex-end;
}

.config-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding-top: 20px;
  border-top: 1px solid var(--border-color);
  font-size: 13px;
}

.config-footer b { color: var(--text-primary); font-weight: 600; }

@media (max-width: 1100px) {
  .type-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .config-row { flex-direction: column; align-items: stretch; }
}
</style>
