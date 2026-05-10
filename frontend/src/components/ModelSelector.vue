<template>
  <el-select
    v-model="selected"
    placeholder="选择AI模型"
    :loading="configStore.loading"
    @change="emit('update:modelValue', $event)"
    style="width: 100%"
  >
    <el-option
      v-for="m in configStore.models"
      :key="m.id"
      :label="`${m.name} (${m.provider}/${m.model_id})`"
      :value="m.id"
    />
  </el-select>
  <div v-if="configStore.models.length === 0" class="no-model-tip">
    <el-text type="warning" size="small">
      尚未配置AI模型，请先在
      <router-link to="/settings">模型配置</router-link>
      中添加
    </el-text>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useConfigStore } from '../stores/config'

const props = defineProps({
  modelValue: { type: Number, default: null },
})
const emit = defineEmits(['update:modelValue'])

const configStore = useConfigStore()
const selected = ref(props.modelValue)

onMounted(() => {
  if (configStore.models.length === 0) {
    configStore.fetchModels()
  }
})
</script>

<style scoped>
.no-model-tip {
  margin-top: 8px;
}
</style>
