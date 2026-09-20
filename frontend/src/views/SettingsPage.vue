<template>
  <div class="settings-page">
    <h2>{{ t('settings.title') }}</h2>

    <el-button type="primary" @click="showDialog = true" style="margin-bottom: 16px">
      {{ t('settings.addModel') }}
    </el-button>

    <el-table :data="configStore.models" v-loading="configStore.loading" stripe>
      <el-table-column prop="name" :label="t('settings.name')" width="180" />
      <el-table-column :label="t('settings.provider')" width="140">
        <template #default="{ row }">
          <el-tag size="small">{{ providerLabel(row.provider) }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="model_id" :label="t('settings.modelId')" width="200" />
      <el-table-column prop="base_url" label="Base URL" min-width="200">
        <template #default="{ row }">
          {{ row.base_url || t('common.default') }}
        </template>
      </el-table-column>
      <el-table-column :label="t('settings.isDefault')" width="80">
        <template #default="{ row }">
          <el-tag v-if="row.is_default" type="success" size="small">{{ t('common.yes') }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column :label="t('common.actions')" width="120" fixed="right">
        <template #default="{ row }">
          <el-popconfirm :title="t('common.confirmDelete')" @confirm="handleDelete(row.id)">
            <template #reference>
              <el-button size="small" type="danger" link>{{ t('common.delete') }}</el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog v-model="showDialog" :title="t('settings.dialogTitle')" width="500px">
      <el-form :model="form" label-width="100px">
        <el-form-item :label="t('settings.name')" required>
          <el-input v-model="form.name" :placeholder="t('settings.namePlaceholder')" />
        </el-form-item>
        <el-form-item :label="t('settings.provider')" required>
          <el-select v-model="form.provider" style="width: 100%">
            <el-option v-for="p in providerIds" :key="p" :label="t(`settings.providers.${p}`)" :value="p" />
          </el-select>
        </el-form-item>
        <el-form-item :label="t('settings.modelId')" required>
          <el-input v-model="form.model_id" :placeholder="t('settings.modelIdPlaceholder')" />
        </el-form-item>
        <el-form-item label="API Key" required>
          <el-input v-model="form.api_key" type="password" show-password placeholder="sk-..." />
        </el-form-item>
        <el-form-item label="Base URL">
          <el-input v-model="form.base_url" :placeholder="t('settings.baseUrlPlaceholder')" />
          <div class="form-tip">
            <el-text size="small" type="info">
              {{ t('settings.baseUrlTip') }}
            </el-text>
          </div>
        </el-form-item>
        <el-form-item :label="t('settings.setDefault')">
          <el-switch v-model="form.is_default" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showDialog = false">{{ t('common.cancel') }}</el-button>
        <el-button type="primary" :loading="saving" @click="handleSave">{{ t('common.save') }}</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useConfigStore } from '../stores/config'
import { ElMessage } from 'element-plus'
import { useI18n } from 'vue-i18n'

const { t, te } = useI18n()

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

const providerIds = ['openai', 'anthropic', 'tongyi', 'openai_compat']

function providerLabel(p) {
  return te(`settings.providerShort.${p}`) ? t(`settings.providerShort.${p}`) : p
}

async function handleSave() {
  if (!form.name || !form.model_id || !form.api_key) {
    ElMessage.warning(t('settings.fillRequired'))
    return
  }
  saving.value = true
  try {
    await configStore.addModel({
      ...form,
      base_url: form.base_url || undefined,
    })
    ElMessage.success(t('settings.addSuccess'))
    showDialog.value = false
    Object.assign(form, {
      name: '', provider: 'openai', model_id: '', api_key: '', base_url: '', is_default: false,
    })
  } catch (err) {
    ElMessage.error(t('settings.addFailed') + (err.response?.data?.detail || err.message))
  } finally {
    saving.value = false
  }
}

async function handleDelete(id) {
  await configStore.removeModel(id)
  ElMessage.success(t('common.deleted'))
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
