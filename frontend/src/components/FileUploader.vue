<template>
  <div class="upload-form">
    <label class="field-block name">
      <span class="field-label">{{ t('upload.projectName') }}</span>
      <el-input v-model="projectName" :placeholder="t('upload.projectNamePlaceholder')" />
    </label>
    <div class="field-block">
      <span class="field-label">{{ t('upload.files') }}</span>
      <el-upload
        ref="uploadRef"
        :auto-upload="false"
        :on-change="handleChange"
        :on-remove="handleRemove"
        multiple
        drag
        accept=".py,.java,.js,.ts,.go,.php,.cs,.c,.cpp,.h,.hpp,.swift,.kt,.zip"
      >
        <div class="upload-area">
          <span class="upload-icon"><Icon name="upload" :size="24" /></span>
          <div class="el-upload__text">{{ t('upload.dragHint') }} <em>{{ t('upload.clickUpload') }}</em></div>
          <div class="el-upload__tip">{{ t('upload.tip') }}</div>
        </div>
      </el-upload>
    </div>
    <div class="actions">
      <el-button :loading="loading" :disabled="fileList.length === 0" @click="handleUpload">
        <Icon v-if="!loading" name="upload" :size="18" />{{ t('upload.upload') }}
      </el-button>
      <span v-if="!loading && project" class="cloned-note">
        <Icon name="check" :size="16" />
        <span>{{ t('upload.success', { name: project.name, count: project.file_count }) }}</span>
      </span>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import Icon from './Icon.vue'
import { uploadFiles } from '../api/repos'
import { ElMessage } from 'element-plus'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

defineProps({
  project: { type: Object, default: null },
})
const emit = defineEmits(['uploaded'])

const loading = ref(false)
const projectName = ref('uploaded_project')
const fileList = ref([])
const uploadRef = ref(null)

function handleChange(file) {
  fileList.value.push(file)
}

function handleRemove(file) {
  fileList.value = fileList.value.filter((f) => f.uid !== file.uid)
}

async function handleUpload() {
  if (fileList.value.length === 0) return

  loading.value = true
  try {
    const formData = new FormData()
    fileList.value.forEach((file) => {
      formData.append('files', file.raw)
    })
    const { data } = await uploadFiles(formData, projectName.value)
    ElMessage.success(t('upload.success', { name: data.name, count: data.file_count }))
    emit('uploaded', data)
    fileList.value = []
  } catch (err) {
    ElMessage.error(t('upload.failed') + (err.response?.data?.detail || err.message))
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.upload-form { display: flex; flex-direction: column; gap: 18px; }
.field-block { display: flex; flex-direction: column; gap: 8px; }
.field-block.name { width: 360px; max-width: 100%; }
.field-label { font-size: 13px; font-weight: 500; color: var(--text-secondary); }
.upload-area { padding: 28px 20px; display: flex; flex-direction: column; align-items: center; gap: 8px; }
.upload-icon {
  display: inline-flex; width: 44px; height: 44px; align-items: center; justify-content: center;
  border-radius: 12px; background: var(--accent-light); color: var(--accent); margin-bottom: 6px;
}
.actions { display: flex; align-items: center; gap: 16px; }
.cloned-note { display: inline-flex; align-items: center; gap: 8px; font-size: 13px; color: var(--accent); }
:deep(.el-upload), :deep(.el-upload-dragger) { width: 100%; }
</style>
