<template>
  <div class="analysis-config">
    <h2>代码分析</h2>

    <el-tabs v-model="sourceTab" type="card">
      <el-tab-pane label="在线仓库" name="online">
        <RepoInput @cloned="onCodeReady" />
      </el-tab-pane>
      <el-tab-pane label="本地上传" name="upload">
        <FileUploader @uploaded="onCodeReady" />
      </el-tab-pane>
    </el-tabs>

    <!-- Running tasks banner -->
    <div v-if="runningTasks.length > 0" class="running-tasks">
      <el-alert type="info" :closable="false">
        <template #title>
          <span>有 {{ runningTasks.length }} 个分析任务进行中</span>
        </template>
        <div v-for="t in runningTasks" :key="t.id" class="running-task-item">
          <span>任务 #{{ t.id }}</span>
          <el-button size="small" type="primary" link @click="$router.push(`/result/${t.id}`)">
            查看进度
          </el-button>
        </div>
      </el-alert>
    </div>

    <el-divider v-if="project" />

    <div v-if="project" class="config-section">
      <el-descriptions title="项目信息" :column="2" border>
        <el-descriptions-item label="项目名称">{{ project.name }}</el-descriptions-item>
        <el-descriptions-item label="代码文件数">{{ project.file_count }}</el-descriptions-item>
      </el-descriptions>

      <el-form label-width="100px" style="margin-top: 24px">
        <el-form-item label="AI模型">
          <ModelSelector v-model="selectedModel" />
        </el-form-item>
        <el-form-item label="分析类型">
          <el-radio-group v-model="analysisType">
            <el-radio-button value="overview">项目概览</el-radio-button>
            <el-radio-button value="function">功能分析</el-radio-button>
            <el-radio-button value="logic_flow">逻辑流程</el-radio-button>
            <el-radio-button value="full">全量分析</el-radio-button>
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
            开始分析
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

const PROJECT_KEY = 'current_project'

const router = useRouter()
const analysisStore = useAnalysisStore()

const sourceTab = ref('online')
const project = ref(null)
const selectedModel = ref(null)
const analysisType = ref('overview')

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
    ElMessage.warning('请先获取代码并选择AI模型')
    return
  }
  try {
    const result = await analysisStore.startAnalysis({
      source_type: sourceTab.value === 'online' ? 'github' : 'upload',
      project_id: project.value.project_id,
      analysis_type: analysisType.value,
      ai_config_id: selectedModel.value,
    })
    router.push(`/result/${result.task_id}`)
  } catch (err) {
    ElMessage.error('创建分析任务失败: ' + (err.response?.data?.detail || err.message))
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
