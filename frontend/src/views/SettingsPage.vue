<template>
  <div class="settings-page">
    <div class="page-header">
      <div>
        <h1>{{ t('settings.title') }}</h1>
        <p class="page-subtitle">{{ t('settings.subtitle') }}</p>
      </div>
      <div class="page-actions">
        <el-button type="primary" @click="showDialog = true">
          <Icon name="plus" :size="16" />{{ t('settings.addModel') }}
        </el-button>
      </div>
    </div>

    <div v-if="!configStore.loading && configStore.models.length === 0" class="surface empty-state">
      <span class="empty-icon"><Icon name="cpu" :size="24" /></span>
      <p>{{ t('settings.noModels') }}</p>
    </div>

    <div v-else class="model-grid" v-loading="configStore.loading">
      <div v-for="m in configStore.models" :key="m.id" class="surface model-card">
        <div class="model-head">
          <span class="model-icon"><Icon name="cpu" :size="20" /></span>
          <div class="model-title">
            <span class="model-name">{{ m.name }}</span>
            <span class="text-secondary">{{ providerLabel(m.provider) }}</span>
          </div>
          <span v-if="m.is_default" class="status-chip is-accent">{{ t('settings.isDefault') }}</span>
        </div>
        <dl class="model-meta">
          <div><dt>{{ t('settings.modelId') }}</dt><dd class="mono">{{ m.model_id }}</dd></div>
          <div><dt>{{ t('settings.endpoint') }}</dt><dd class="mono muted">{{ m.base_url || t('common.default') }}</dd></div>
          <div><dt>{{ t('settings.apiKey') }}</dt><dd class="mono muted">{{ maskKey(m.api_key) }}</dd></div>
        </dl>
        <div class="model-actions">
          <el-button size="small" @click="openEdit(m)"><Icon name="edit" :size="16" />{{ t('settings.edit') }}</el-button>
          <el-button v-if="!m.is_default" size="small" text @click="setDefault(m)">{{ t('settings.setDefault') }}</el-button>
          <span class="grow"></span>
          <el-popconfirm :title="t('common.confirmDelete')" @confirm="handleDelete(m.id)">
            <template #reference>
              <el-button size="small" text class="danger-btn"><Icon name="trash" :size="16" />{{ t('settings.remove') }}</el-button>
            </template>
          </el-popconfirm>
        </div>
      </div>
    </div>

    <el-dialog v-model="showDialog" :title="editingId ? t('settings.editTitle') : t('settings.dialogTitle')" width="520px" @closed="resetForm">
      <div class="dialog-form">
        <div class="field-block">
          <span class="field-label">{{ t('settings.provider') }}</span>
          <div class="provider-grid">
            <button
              v-for="p in providerIds"
              :key="p"
              type="button"
              class="provider-card"
              :class="{ selected: form.provider === p }"
              @click="form.provider = p"
            >
              <span class="provider-name">{{ t(`settings.providers.${p}`) }}</span>
              <span class="provider-desc">{{ t(`settings.providerDesc.${p}`) }}</span>
            </button>
          </div>
        </div>
        <label class="field-block">
          <span class="field-label">{{ t('settings.name') }} *</span>
          <el-input v-model="form.name" :placeholder="t('settings.namePlaceholder')" />
        </label>
        <label class="field-block">
          <span class="field-label">API Key {{ editingId ? '' : '*' }}</span>
          <el-input
            v-model="form.api_key"
            type="password"
            show-password
            :placeholder="editingId ? t('settings.keyUnchanged') : 'sk-...'"
            class="mono-input"
          />
        </label>
        <label class="field-block">
          <span class="field-label">Base URL</span>
          <el-input v-model="form.base_url" :placeholder="t('settings.baseUrlPlaceholder')" class="mono-input" />
          <span class="field-hint">{{ t('settings.baseUrlTip') }}</span>
        </label>
        <div class="field-block">
          <span class="field-label">{{ t('settings.modelId') }} *</span>
          <div class="model-id-row">
            <el-select
              v-model="form.model_id"
              filterable
              allow-create
              default-first-option
              :placeholder="t('settings.modelIdPlaceholder')"
              class="mono-input model-select"
              :no-data-text="t('settings.modelIdHint')"
            >
              <el-option v-for="id in availableModels" :key="id" :label="id" :value="id" />
            </el-select>
            <el-button :loading="fetching" :disabled="!canFetch" @click="fetchModels">
              <Icon v-if="!fetching" name="refresh" :size="16" />{{ fetching ? t('settings.fetching') : t('settings.fetchModels') }}
            </el-button>
          </div>
          <span class="field-hint" :class="{ 'is-error': fetchError, 'is-ok': !fetchError && availableModels.length }">
            {{ fetchError || (availableModels.length ? t('settings.fetched', { count: availableModels.length }) : t('settings.modelIdHint')) }}
          </span>
        </div>
        <label class="switch-row">
          <el-switch v-model="form.is_default" />
          <span>{{ t('settings.setDefault') }}</span>
        </label>
      </div>
      <template #footer>
        <el-button text @click="showDialog = false">{{ t('common.cancel') }}</el-button>
        <el-button type="primary" :loading="saving" @click="handleSave">
          <Icon v-if="!saving" name="check" :size="16" />{{ t('common.save') }}
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { useI18n } from 'vue-i18n'
import Icon from '../components/Icon.vue'
import { useConfigStore } from '../stores/config'
import { fetchAvailableModels } from '../api/config'

const { t, te } = useI18n()
const configStore = useConfigStore()
const showDialog = ref(false)
const saving = ref(false)
const editingId = ref(null)
const fetching = ref(false)
const fetchError = ref('')
const availableModels = ref([])

const providerIds = ['openai', 'anthropic', 'tongyi', 'openai_compat']

const form = reactive({
  name: '',
  provider: 'openai',
  model_id: '',
  api_key: '',
  base_url: '',
  is_default: false,
})

function providerLabel(p) {
  return te(`settings.providerShort.${p}`) ? t(`settings.providerShort.${p}`) : p
}

const canFetch = computed(() => Boolean(form.api_key || editingId.value) && (form.provider !== 'openai_compat' || Boolean(form.base_url)))

function resetForm() {
  editingId.value = null
  availableModels.value = []
  fetchError.value = ''
  Object.assign(form, {
    name: '', provider: 'openai', model_id: '', api_key: '', base_url: '', is_default: false,
  })
}

function openEdit(m) {
  editingId.value = m.id
  availableModels.value = []
  fetchError.value = ''
  Object.assign(form, {
    name: m.name,
    provider: m.provider,
    model_id: m.model_id,
    api_key: '',
    base_url: m.base_url || '',
    is_default: m.is_default,
  })
  showDialog.value = true
}

async function fetchModels() {
  if (!canFetch.value) {
    ElMessage.warning(t('settings.keyRequiredForFetch'))
    return
  }
  fetching.value = true
  fetchError.value = ''
  try {
    const { data } = await fetchAvailableModels({
      provider: form.provider,
      api_key: form.api_key || undefined,
      base_url: form.base_url || undefined,
      config_id: editingId.value || undefined,
    })
    availableModels.value = data.models
    if (form.model_id && !data.models.includes(form.model_id)) {
      availableModels.value = [form.model_id, ...data.models]
    }
  } catch (err) {
    fetchError.value = t('settings.fetchFailed') + (err.response?.data?.detail || err.message)
    availableModels.value = []
  } finally {
    fetching.value = false
  }
}

function maskKey(key) {
  return key ? `${key.slice(0, 3)}••••••••${key.slice(-4)}` : 'sk-••••••••'
}

async function handleSave() {
  if (!form.name || !form.model_id || (!editingId.value && !form.api_key)) {
    ElMessage.warning(t('settings.fillRequired'))
    return
  }
  saving.value = true
  try {
    if (editingId.value) {
      await configStore.editModel(editingId.value, {
        name: form.name,
        provider: form.provider,
        model_id: form.model_id,
        api_key: form.api_key || undefined,
        base_url: form.base_url || null,
        is_default: form.is_default,
      })
      if (form.is_default) await configStore.fetchModels()
      ElMessage.success(t('settings.updateSuccess'))
    } else {
      await configStore.addModel({
        ...form,
        base_url: form.base_url || undefined,
      })
      ElMessage.success(t('settings.addSuccess'))
    }
    showDialog.value = false
  } catch (err) {
    ElMessage.error(t(editingId.value ? 'settings.updateFailed' : 'settings.addFailed') + (err.response?.data?.detail || err.message))
  } finally {
    saving.value = false
  }
}

async function setDefault(m) {
  await configStore.editModel(m.id, { is_default: true })
  await configStore.fetchModels()
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
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.empty-state {
  padding: 48px 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 14px;
  text-align: center;
  color: var(--text-secondary);
  max-width: 560px;
}

.empty-icon {
  display: inline-flex;
  width: 48px;
  height: 48px;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
  background: var(--accent-light);
  color: var(--accent);
}

.model-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(360px, 1fr));
  gap: 20px;
}

.model-card {
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.model-head {
  display: flex;
  align-items: flex-start;
  gap: 12px;
}

.model-icon {
  display: inline-flex;
  width: 40px;
  height: 40px;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  background: var(--bg-secondary);
  color: var(--text-secondary);
  flex-shrink: 0;
}

.model-title {
  display: flex;
  flex-direction: column;
  gap: 4px;
  flex: 1;
  min-width: 0;
  font-size: 13px;
}

.model-name {
  font-family: var(--font-display);
  font-size: 16px;
  font-weight: 600;
  color: var(--text-primary);
}

.model-meta {
  display: flex;
  flex-direction: column;
  gap: 8px;
  font-size: 13px;
}

.model-meta div { display: flex; justify-content: space-between; gap: 12px; }
.model-meta dt { color: var(--text-muted); flex-shrink: 0; }
.model-meta dd { color: var(--text-primary); text-align: right; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.model-meta dd.muted { color: var(--text-secondary); }

.model-actions {
  display: flex;
  align-items: center;
  gap: 8px;
  padding-top: 12px;
  border-top: 1px solid var(--border-color);
}

.grow { flex: 1; }
.danger-btn { color: var(--danger) !important; }

.dialog-form {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.field-block { display: flex; flex-direction: column; gap: 8px; }
.field-label { font-size: 13px; font-weight: 500; color: var(--text-secondary); }
.field-hint { font-size: 12px; line-height: 1.5; color: var(--text-muted); }
.field-hint.is-error { color: var(--danger); }
.field-hint.is-ok { color: var(--accent); }
.model-id-row { display: flex; gap: 8px; }
.model-select { flex: 1; min-width: 0; }
.model-select :deep(.el-select__selected-item), .model-select :deep(.el-select__input) { font-family: var(--font-mono); font-size: 13px; }
.mono-input :deep(.el-input__inner) { font-family: var(--font-mono); font-size: 13px; }

.provider-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 8px;
}

.provider-card {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 12px;
  text-align: left;
  border-radius: 10px;
  cursor: pointer;
  background: var(--bg-primary);
  border: 1px solid var(--border-strong);
  color: var(--text-primary);
}

.provider-card:hover { border-color: var(--accent-line); }
.provider-card.selected { background: var(--accent-light); border-color: var(--accent-line); }
.provider-name { font-size: 13px; font-weight: 600; }
.provider-desc { font-size: 12px; color: var(--text-muted); }

.switch-row {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 14px;
  cursor: pointer;
}
</style>
