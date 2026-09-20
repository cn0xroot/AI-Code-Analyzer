<template>
  <div class="history-page">
    <div class="page-header">
      <h2>{{ t('history.title') }}</h2>
      <el-button @click="fetchData" :loading="loading" text>
        {{ t('common.refresh') }}
      </el-button>
    </div>

    <el-table :data="historyList" v-loading="loading" stripe style="border-radius: var(--radius)">
      <el-table-column prop="id" label="ID" width="70" />
      <el-table-column :label="t('common.project')" min-width="150">
        <template #default="{ row }">
          {{ row.project_name || `Project #${row.project_id}` }}
        </template>
      </el-table-column>
      <el-table-column :label="t('common.analysisType')" width="120">
        <template #default="{ row }">
          <el-tag size="small">{{ typeLabel(row.analysis_type) }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column :label="t('common.status')" width="100">
        <template #default="{ row }">
          <el-tag :type="statusType(row.status)" size="small">
            {{ statusLabel(row.status) }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column :label="t('common.aiModel')" width="180">
        <template #default="{ row }">
          {{ row.ai_provider }}/{{ row.ai_model }}
        </template>
      </el-table-column>
      <el-table-column :label="t('common.createdAt')" width="180">
        <template #default="{ row }">
          {{ formatTime(row.created_at) }}
        </template>
      </el-table-column>
      <el-table-column :label="t('common.actions')" width="260" fixed="right">
        <template #default="{ row }">
          <el-button
            size="small"
            type="primary"
            link
            @click="$router.push(`/result/${row.id}`)"
          >
            {{ t('history.viewResult') }}
          </el-button>
          <el-button
            v-if="row.status === 'completed' || row.status === 'failed'"
            size="small"
            type="warning"
            link
            @click="handleReanalyze(row)"
          >
            {{ t('common.reanalyze') }}
          </el-button>
          <el-popconfirm :title="t('common.confirmDelete')" @confirm="handleDelete(row.id)">
            <template #reference>
              <el-button size="small" type="danger" link>{{ t('common.delete') }}</el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      v-if="total > pageSize"
      :current-page="currentPage"
      :page-size="pageSize"
      :total="total"
      layout="prev, pager, next"
      style="margin-top: 16px; justify-content: center"
      @current-change="handlePageChange"
    />

    <!-- Re-analyze dialog -->
    <el-dialog v-model="showReanalyze" :title="t('common.reanalyze')" width="440px">
      <div class="reanalyze-info">
        <p><strong>{{ t('common.project') }}:</strong> {{ reanalyzeTarget?.project_name || `Project #${reanalyzeTarget?.project_id}` }}</p>
        <p><strong>{{ t('history.originalType') }}:</strong> {{ typeLabel(reanalyzeTarget?.analysis_type) }}</p>
      </div>
      <el-form label-width="90px" style="margin-top: 16px">
        <el-form-item :label="t('common.analysisType')">
          <el-radio-group v-model="reanalyzeType">
            <el-radio-button value="overview">{{ t('analysisType.overview') }}</el-radio-button>
            <el-radio-button value="function">{{ t('analysisType.function') }}</el-radio-button>
            <el-radio-button value="logic_flow">{{ t('analysisType.logic_flow') }}</el-radio-button>
            <el-radio-button value="full">{{ t('analysisType.full') }}</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item :label="t('common.outputLanguage')">
          <el-radio-group v-model="reanalyzeLanguage">
            <el-radio-button value="zh">{{ t('lang.zh') }}</el-radio-button>
            <el-radio-button value="en">{{ t('lang.en') }}</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item :label="t('common.aiModel')">
          <ModelSelector v-model="reanalyzeModel" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showReanalyze = false">{{ t('common.cancel') }}</el-button>
        <el-button type="primary" :loading="reanalyzing" :disabled="!reanalyzeModel" @click="doReanalyze">
          {{ t('common.startAnalysis') }}
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { listHistory, deleteHistory } from '../api/history'
import { useAnalysisStore } from '../stores/analysis'
import ModelSelector from '../components/ModelSelector.vue'
import { ElMessage } from 'element-plus'
import { useI18n } from 'vue-i18n'
import { aiLanguage } from '../i18n'

const { t, te, locale } = useI18n()

const router = useRouter()
const analysisStore = useAnalysisStore()

const historyList = ref([])
const loading = ref(false)
const total = ref(0)
const currentPage = ref(1)
const pageSize = 20

const showReanalyze = ref(false)
const reanalyzeTarget = ref(null)
const reanalyzeType = ref('overview')
const reanalyzeModel = ref(null)
const reanalyzeLanguage = ref(aiLanguage())
const reanalyzing = ref(false)

async function fetchData() {
  loading.value = true
  try {
    const skip = (currentPage.value - 1) * pageSize
    const { data } = await listHistory(skip, pageSize)
    historyList.value = data.items
    total.value = data.total
  } finally {
    loading.value = false
  }
}

function handleReanalyze(row) {
  reanalyzeTarget.value = row
  reanalyzeType.value = row.analysis_type || 'overview'
  reanalyzeLanguage.value = row.language || aiLanguage()
  showReanalyze.value = true
}

async function doReanalyze() {
  if (!reanalyzeTarget.value || !reanalyzeModel.value) return
  reanalyzing.value = true
  try {
    const result = await analysisStore.startAnalysis({
      source_type: 'reanalyze',
      project_id: reanalyzeTarget.value.project_id,
      analysis_type: reanalyzeType.value,
      ai_config_id: reanalyzeModel.value,
      language: reanalyzeLanguage.value,
    })
    showReanalyze.value = false
    ElMessage.success(t('history.taskCreated'))
    router.push(`/result/${result.task_id}`)
  } catch (err) {
    ElMessage.error(t('history.createFailed') + (err.response?.data?.detail || err.message))
  } finally {
    reanalyzing.value = false
  }
}

async function handleDelete(id) {
  await deleteHistory(id)
  ElMessage.success(t('common.deleted'))
  fetchData()
}

function handlePageChange(page) {
  currentPage.value = page
  fetchData()
}

function formatTime(value) {
  if (!value) return '-'
  return new Date(value).toLocaleString(locale.value)
}

function typeLabel(type) {
  return type && te(`analysisType.${type}`) ? t(`analysisType.${type}`) : type
}

function statusLabel(s) {
  return s && te(`status.${s}`) ? t(`status.${s}`) : s
}

function statusType(s) {
  const map = { completed: 'success', failed: 'danger', analyzing: 'warning', parsing: 'warning', pending: 'info' }
  return map[s] || 'info'
}

onMounted(fetchData)
</script>

<style scoped>
.history-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px;
}

.page-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
}

.page-header h2 {
  margin-bottom: 0;
}

.reanalyze-info p {
  margin-bottom: 8px;
  color: var(--text-secondary);
}
</style>
