<template>
  <div class="settings-page">
    <h2>AI模型配置</h2>

    <el-button type="primary" @click="showDialog = true" style="margin-bottom: 16px">
      添加模型
    </el-button>

    <el-table :data="configStore.models" v-loading="configStore.loading" stripe>
      <el-table-column prop="name" label="名称" width="180" />
      <el-table-column label="提供商" width="140">
        <template #default="{ row }">
          <el-tag size="small">{{ providerLabel(row.provider) }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="model_id" label="模型ID" width="200" />
      <el-table-column prop="base_url" label="Base URL" min-width="200">
        <template #default="{ row }">
          {{ row.base_url || '默认' }}
        </template>
      </el-table-column>
      <el-table-column label="默认" width="80">
        <template #default="{ row }">
          <el-tag v-if="row.is_default" type="success" size="small">是</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="120" fixed="right">
        <template #default="{ row }">
          <el-popconfirm title="确认删除?" @confirm="handleDelete(row.id)">
            <template #reference>
              <el-button size="small" type="danger" link>删除</el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog v-model="showDialog" title="添加AI模型" width="500px">
      <el-form :model="form" label-width="100px">
        <el-form-item label="名称" required>
          <el-input v-model="form.name" placeholder="例如: My GPT-4o" />
        </el-form-item>
        <el-form-item label="提供商" required>
          <el-select v-model="form.provider" style="width: 100%">
            <el-option label="OpenAI" value="openai" />
            <el-option label="Anthropic (Claude)" value="anthropic" />
            <el-option label="通义千问" value="tongyi" />
            <el-option label="OpenAI兼容 (中转站)" value="openai_compat" />
          </el-select>
        </el-form-item>
        <el-form-item label="模型ID" required>
          <el-input v-model="form.model_id" placeholder="例如: gpt-4o, claude-sonnet-4-20250514" />
        </el-form-item>
        <el-form-item label="API Key" required>
          <el-input v-model="form.api_key" type="password" show-password placeholder="sk-..." />
        </el-form-item>
        <el-form-item label="Base URL">
          <el-input v-model="form.base_url" placeholder="中转站地址 (可选)" />
          <div class="form-tip">
            <el-text size="small" type="info">
              OpenAI兼容中转站或自定义endpoint时填写
            </el-text>
          </div>
        </el-form-item>
        <el-form-item label="设为默认">
          <el-switch v-model="form.is_default" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showDialog = false">取消</el-button>
        <el-button type="primary" :loading="saving" @click="handleSave">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useConfigStore } from '../stores/config'
import { ElMessage } from 'element-plus'

const configStore = useConfigStore()
const showDialog = ref(false)
const saving = ref(false)

const form = reactive({
  name: '',
  provider: 'openai',
  model_id: '',
  api_key: '',
  base_url: '',
  is_default: false,
})

function providerLabel(p) {
  const map = {
    openai: 'OpenAI',
    anthropic: 'Anthropic',
    tongyi: '通义千问',
    openai_compat: 'OpenAI兼容',
  }
  return map[p] || p
}

async function handleSave() {
  if (!form.name || !form.model_id || !form.api_key) {
    ElMessage.warning('请填写必要字段')
    return
  }
  saving.value = true
  try {
    await configStore.addModel({
      ...form,
      base_url: form.base_url || undefined,
    })
    ElMessage.success('添加成功')
    showDialog.value = false
    Object.assign(form, {
      name: '', provider: 'openai', model_id: '', api_key: '', base_url: '', is_default: false,
    })
  } catch (err) {
    ElMessage.error('添加失败: ' + (err.response?.data?.detail || err.message))
  } finally {
    saving.value = false
  }
}

async function handleDelete(id) {
  await configStore.removeModel(id)
  ElMessage.success('已删除')
}

onMounted(() => {
  configStore.fetchModels()
})
</script>

<style scoped>
.settings-page {
  max-width: 1000px;
  margin: 0 auto;
  padding: 24px;
}

.form-tip {
  margin-top: 4px;
}
</style>
