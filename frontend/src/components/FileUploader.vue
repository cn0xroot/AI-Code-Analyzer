<template>
  <div>
    <el-form label-width="100px">
      <el-form-item :label="t('upload.projectName')">
        <el-input v-model="projectName" :placeholder="t('upload.projectNamePlaceholder')" />
      </el-form-item>
      <el-form-item :label="t('upload.files')">
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
            <el-icon :size="40"><UploadFilled /></el-icon>
            <div class="el-upload__text">
              {{ t('upload.dragHint') }} <em>{{ t('upload.clickUpload') }}</em>
            </div>
            <div class="el-upload__tip">
              {{ t('upload.tip') }}
            </div>
          </div>
        </el-upload>
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          :loading="loading"
          :disabled="fileList.length === 0"
          @click="handleUpload"
        >
          {{ t('upload.upload') }}
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { UploadFilled } from '@element-plus/icons-vue'
import { uploadFiles } from '../api/repos'
import { ElMessage } from 'element-plus'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

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
.upload-area {
  padding: 20px;
  text-align: center;
}
</style>
