<template>
  <div class="analysis-config">
    <h2>{{ t('config.title') }}</h2>

    <el-tabs v-model="sourceTab" type="card">
      <el-tab-pane :label="t('config.onlineRepo')" name="online">
        <RepoInput @cloned="onCodeReady" />
      </el-tab-pane>
      <el-tab-pane :label="t('config.localUpload')" name="upload">
        <FileUploader @uploaded="onCodeReady" />
      </el-tab-pane>
    </el-tabs>

    <!-- Running tasks banner -->
    <div v-if="runningTasks.length > 0" class="running-tasks">
      <el-alert type="info" :closable="false">
        <template #title>
          <span>{{ t('config.runningTasks', { count: runningTasks.length }) }}</span>
        </template>
        <div v-for="rt in runningTasks" :key="rt.id" class="running-task-item">
          <span>{{ t('config.task') }} #{{ rt.id }}</span>
          <el-button size="small" type="primary" link @click="$router.push(`/result/${rt.id}`)">
            {{ t('config.viewProgress') }}
          </el-button>
        </div>
      </el-alert>
    </div>

    <el-divider v-if="project" />

    <div v-if="project" class="config-section">
      <el-descriptions :title="t('config.projectInfo')" :column="2" border>
        <el-descriptions-item :label="t('config.projectName')">{{ project.name }}</el-descriptions-item>
        <el-descriptions-item :label="t('config.fileCount')">{{ project.file_count }}</el-descriptions-item>
      </el-descriptions>

      <el-form label-width="100px" style="margin-top: 24px">
        <el-form-item :label="t('common.aiModel')">
          <ModelSelector v-model="selectedModel" />
        </el-form-item>
        <el-form-item :label="t('common.analysisType')">
          <el-radio-group v-model="analysisType">
            <el-radio-button value="overview">{{ t('analysisType.overview') }}</el-radio-button>
            <el-radio-button value="function">{{ t('analysisType.function') }}</el-radio-button>
            <el-radio-button value="logic_flow">{{ t('analysisType.logic_flow') }}</el-radio-button>
            <el-radio-button value="full">{{ t('analysisType.full') }}</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item :label="t('common.outputLanguage')">
          <el-radio-group v-model="outputLanguage">
            <el-radio-button value="zh">{{ t('lang.zh') }}</el-radio-button>
            <el-radio-button value="en">{{ t('lang.en') }}</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            size="large"
            :loading="analysisStore.loading"
            :disabled="!selectedModel"
            @click="startAnalysis"
          >
            {{ t('common.startAnalysis') }}
          </el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import RepoInput from '../components/RepoInput.vue'
import FileUploader from '../components/FileUploader.vue'
import ModelSelector from '../components/ModelSelector.vue'
import { useAnalysisStore } from '../stores/analysis'
import { useI18n } from 'vue-i18n'
import { aiLanguage } from '../i18n'

const { t } = useI18n()

const PROJECT_KEY = 'current_project'

const router = useRouter()
const analysisStore = useAnalysisStore()

const sourceTab = ref('online')
const project = ref(null)
const selectedModel = ref(null)
const analysisType = ref('overview')
const outputLanguage = ref(aiLanguage())

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
  max-width: 800px;
  margin: 0 auto;
  padding: 24px;
}

.config-section {
  margin-top: 24px;
}

.running-tasks {
  margin-top: 16px;
}

.running-task-item {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: 4px;
}
</style>
