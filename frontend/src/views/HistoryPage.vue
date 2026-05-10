<template>
  <div class="history-page">
    <div class="page-header">
      <h2>分析历史</h2>
      <el-button @click="fetchData" :loading="loading" text>
        刷新
      </el-button>
    </div>

    <el-table :data="historyList" v-loading="loading" stripe style="border-radius: var(--radius)">
      <el-table-column prop="id" label="ID" width="70" />
      <el-table-column label="项目" min-width="150">
        <template #default="{ row }">
          {{ row.project_name || `Project #${row.project_id}` }}
        </template>
      </el-table-column>
      <el-table-column label="分析类型" width="120">
        <template #default="{ row }">
          <el-tag size="small">{{ typeLabel(row.analysis_type) }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="状态" width="100">
        <template #default="{ row }">
          <el-tag :type="statusType(row.status)" size="small">
            {{ statusLabel(row.status) }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="AI模型" width="180">
        <template #default="{ row }">
          {{ row.ai_provider }}/{{ row.ai_model }}
        </template>
      </el-table-column>
      <el-table-column label="创建时间" width="180">
        <template #default="{ row }">
          {{ formatTime(row.created_at) }}
        </template>
      </el-table-column>
      <el-table-column label="操作" width="220" fixed="right">
        <template #default="{ row }">
          <el-button
            size="small"
            type="primary"
            link
            @click="$router.push(`/result/${row.id}`)"
          >
            查看结果
          </el-button>
          <el-button
            v-if="row.status === 'completed' || row.status === 'failed'"
            size="small"
            type="warning"
            link
            @click="handleReanalyze(row)"
          >
            重新分析
          </el-button>
          <el-popconfirm title="确认删除?" @confirm="handleDelete(row.id)">
            <template #reference>
              <el-button size="small" type="danger" link>删除</el-button>
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
    <el-dialog v-model="showReanalyze" title="重新分析" width="440px">
      <div class="reanalyze-info">
        <p><strong>项目:</strong> {{ reanalyzeTarget?.project_name || `Project #${reanalyzeTarget?.project_id}` }}</p>
        <p><strong>原分析类型:</strong> {{ typeLabel(reanalyzeTarget?.analysis_type) }}</p>
      </div>
      <el-form label-width="90px" style="margin-top: 16px">
        <el-form-item label="分析类型">
          <el-radio-group v-model="reanalyzeType">
            <el-radio-button value="overview">项目概览</el-radio-button>
            <el-radio-button value="function">功能分析</el-radio-button>
            <el-radio-button value="logic_flow">逻辑流程</el-radio-button>
            <el-radio-button value="full">全量分析</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="AI模型">
          <ModelSelector v-model="reanalyzeModel" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showReanalyze = false">取消</el-button>
        <el-button type="primary" :loading="reanalyzing" :disabled="!reanalyzeModel" @click="doReanalyze">
          开始分析
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
    })
    showReanalyze.value = false
    ElMessage.success('分析任务已创建')
    router.push(`/result/${result.task_id}`)
  } catch (err) {
    ElMessage.error('创建失败: ' + (err.response?.data?.detail || err.message))
  } finally {
    reanalyzing.value = false
  }
}

async function handleDelete(id) {
  await deleteHistory(id)
  ElMessage.success('已删除')
  fetchData()
}

function handlePageChange(page) {
  currentPage.value = page
  fetchData()
}

function formatTime(t) {
  if (!t) return '-'
  return new Date(t).toLocaleString('zh-CN')
}

function typeLabel(type) {
  const map = { overview: '项目概览', function: '功能分析', logic_flow: '逻辑流程', full: '全量分析' }
  return map[type] || type
}

function statusLabel(s) {
  const map = { pending: '等待中', parsing: '解析中', analyzing: '分析中', completed: '已完成', failed: '失败' }
  return map[s] || s
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
