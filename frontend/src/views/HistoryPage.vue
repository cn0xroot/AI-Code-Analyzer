<template>
  <div class="history-page">
    <div class="page-header">
      <div>
        <h1>{{ t('history.title') }}</h1>
        <p class="page-subtitle">{{ t('history.subtitle') }}</p>
      </div>
      <div class="page-actions">
        <label class="search-field">
          <Icon name="search" :size="16" />
          <input v-model="search" type="search" :placeholder="t('history.search')" />
        </label>
        <el-select v-model="statusFilter" class="filter-select" :placeholder="t('history.anyStatus')" clearable>
          <el-option v-for="s in statuses" :key="s" :label="statusLabel(s)" :value="s" />
        </el-select>
        <el-select v-model="typeFilter" class="filter-select" :placeholder="t('history.anyType')" clearable>
          <el-option v-for="ty in types" :key="ty" :label="typeLabel(ty)" :value="ty" />
        </el-select>
        <el-button :loading="loading" @click="fetchData">
          <Icon v-if="!loading" name="refresh" :size="16" />{{ t('common.refresh') }}
        </el-button>
      </div>
    </div>

    <el-table :data="filtered" v-loading="loading">
      <el-table-column prop="id" label="#" width="64">
        <template #default="{ row }"><span class="mono">{{ row.id }}</span></template>
      </el-table-column>
      <el-table-column :label="t('common.project')" min-width="160">
        <template #default="{ row }">
          <span class="project-name">{{ row.project_name || `Project #${row.project_id}` }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="t('common.analysisType')" width="130">
        <template #default="{ row }"><span class="status-chip">{{ typeLabel(row.analysis_type) }}</span></template>
      </el-table-column>
      <el-table-column :label="t('common.status')" width="130">
        <template #default="{ row }">
          <span class="status-chip" :class="statusClass(row.status)">{{ statusLabel(row.status) }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="t('common.aiModel')" min-width="170">
        <template #default="{ row }"><span class="mono">{{ row.ai_provider }} / {{ row.ai_model }}</span></template>
      </el-table-column>
      <el-table-column :label="t('common.createdAt')" width="160">
        <template #default="{ row }"><span class="text-secondary">{{ formatTime(row.created_at) }}</span></template>
      </el-table-column>
      <el-table-column :label="t('history.lang')" width="70">
        <template #default="{ row }"><span class="text-secondary">{{ row.language === 'en' ? 'EN' : '中文' }}</span></template>
      </el-table-column>
      <el-table-column :label="t('common.actions')" width="220">
        <template #default="{ row }">
          <div class="row-actions">
            <el-button size="small" type="primary" link @click="$router.push(`/result/${row.id}`)">
              {{ t('history.viewResult') }}
            </el-button>
            <el-button
              v-if="row.status === 'completed' || row.status === 'failed'"
              size="small"
              @click="handleReanalyze(row)"
            >
              {{ t('common.reanalyze') }}
            </el-button>
            <el-popconfirm :title="t('common.confirmDelete')" @confirm="handleDelete(row.id)">
              <template #reference>
                <el-button size="small" text class="icon-btn" :aria-label="t('common.delete')">
                  <Icon name="trash" :size="16" />
                </el-button>
              </template>
            </el-popconfirm>
          </div>
        </template>
      </el-table-column>
    </el-table>

    <div class="pager">
      <span class="text-muted">{{ t('history.showing', { from: total ? (currentPage - 1) * pageSize + 1 : 0, to: Math.min(currentPage * pageSize, total), total }) }}</span>
      <el-pagination
        v-if="total > pageSize"
        :current-page="currentPage"
        :page-size="pageSize"
        :total="total"
        layout="prev, pager, next"
        @current-change="handlePageChange"
      />
    </div>

    <el-dialog v-model="showReanalyze" :title="t('common.reanalyze')" width="480px">
      <div class="reanalyze-info">
        <p><span class="text-muted">{{ t('common.project') }}</span> <b>{{ reanalyzeTarget?.project_name || `Project #${reanalyzeTarget?.project_id}` }}</b></p>
        <p><span class="text-muted">{{ t('history.originalType') }}</span> {{ typeLabel(reanalyzeTarget?.analysis_type) }}</p>
      </div>
      <div class="dialog-form">
        <div class="field-block">
          <span class="field-label">{{ t('common.analysisType') }}</span>
          <el-radio-group v-model="reanalyzeType">
            <el-radio-button v-for="ty in types" :key="ty" :value="ty">{{ typeLabel(ty) }}</el-radio-button>
          </el-radio-group>
        </div>
        <div class="field-block">
          <span class="field-label">{{ t('common.outputLanguage') }}</span>
          <el-radio-group v-model="reanalyzeLanguage">
            <el-radio-button value="zh">{{ t('lang.zh') }}</el-radio-button>
            <el-radio-button value="en">{{ t('lang.en') }}</el-radio-button>
          </el-radio-group>
        </div>
        <div class="field-block">
          <span class="field-label">{{ t('common.aiModel') }}</span>
          <ModelSelector v-model="reanalyzeModel" />
        </div>
      </div>
      <template #footer>
        <el-button text @click="showReanalyze = false">{{ t('common.cancel') }}</el-button>
        <el-button type="primary" :loading="reanalyzing" :disabled="!reanalyzeModel" @click="doReanalyze">
          <Icon v-if="!reanalyzing" name="play" :size="16" />{{ t('common.startAnalysis') }}
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { useI18n } from 'vue-i18n'
import Icon from '../components/Icon.vue'
import ModelSelector from '../components/ModelSelector.vue'
import { listHistory, deleteHistory } from '../api/history'
import { useAnalysisStore } from '../stores/analysis'
import { aiLanguage } from '../i18n'
import { statusClass } from '../utils/status'

const { t, te, locale } = useI18n()
const router = useRouter()
const analysisStore = useAnalysisStore()

const historyList = ref([])
const loading = ref(false)
const total = ref(0)
const currentPage = ref(1)
const pageSize = 20

const search = ref('')
const statusFilter = ref('')
const typeFilter = ref('')
const statuses = ['pending', 'parsing', 'analyzing', 'completed', 'failed']
const types = ['overview', 'function', 'logic_flow', 'full']

const showReanalyze = ref(false)
const reanalyzeTarget = ref(null)
const reanalyzeType = ref('overview')
const reanalyzeModel = ref(null)
const reanalyzeLanguage = ref(aiLanguage())
const reanalyzing = ref(false)

const filtered = computed(() => {
  const q = search.value.trim().toLowerCase()
  return historyList.value.filter((row) => {
    if (statusFilter.value && row.status !== statusFilter.value) return false
    if (typeFilter.value && row.analysis_type !== typeFilter.value) return false
    if (q) {
      const hay = `${row.project_name || ''} ${row.ai_model || ''} ${row.ai_provider || ''}`.toLowerCase()
      if (!hay.includes(q)) return false
    }
    return true
  })
})

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
  return new Date(value).toLocaleString(locale.value, { dateStyle: 'medium', timeStyle: 'short' })
}

function typeLabel(type) {
  return type && te(`analysisType.${type}`) ? t(`analysisType.${type}`) : type
}

function statusLabel(s) {
  return s && te(`status.${s}`) ? t(`status.${s}`) : s
}

onMounted(fetchData)
</script>

<style scoped>
.history-page {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.history-page .page-header { margin-bottom: 8px; }

.search-field {
  display: flex;
  align-items: center;
  gap: 10px;
  width: 240px;
  height: 40px;
  padding: 0 12px;
  background: var(--bg-card);
  border: 1px solid var(--border-strong);
  border-radius: 10px;
  color: var(--text-muted);
}

.search-field:focus-within { border-color: var(--accent); }

.search-field input {
  flex: 1;
  min-width: 0;
  background: transparent;
  border: 0;
  outline: none;
  color: var(--text-primary);
  font-size: 13px;
}

.search-field input::placeholder { color: var(--text-muted); }

.filter-select { width: 150px; }
.filter-select :deep(.el-select__wrapper) { min-height: 40px; background: var(--bg-card) !important; }

.project-name { font-weight: 500; }

.row-actions {
  display: flex;
  align-items: center;
  gap: 4px;
}

.icon-btn { color: var(--text-muted); }
.icon-btn:hover { color: var(--danger); }

.pager {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 13px;
}

.reanalyze-info {
  display: flex;
  flex-direction: column;
  gap: 6px;
  font-size: 14px;
  padding-bottom: 16px;
  border-bottom: 1px solid var(--border-color);
}

.reanalyze-info b { color: var(--text-primary); font-weight: 600; margin-left: 6px; }
.reanalyze-info .text-muted { margin-right: 6px; }

.dialog-form {
  display: flex;
  flex-direction: column;
  gap: 18px;
  padding-top: 18px;
}

.field-block { display: flex; flex-direction: column; gap: 8px; }
.field-label { font-size: 13px; font-weight: 500; color: var(--text-secondary); }
</style>
