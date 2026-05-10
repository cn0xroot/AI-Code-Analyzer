import { defineStore } from 'pinia'
import { ref } from 'vue'
import { listModels, createModel, updateModel, deleteModel } from '../api/config'

export const useConfigStore = defineStore('config', () => {
  const models = ref([])
  const loading = ref(false)

  async function fetchModels() {
    loading.value = true
    try {
      const { data } = await listModels()
      models.value = data
    } finally {
      loading.value = false
    }
  }

  async function addModel(config) {
    const { data } = await createModel(config)
    models.value.push(data)
    return data
  }

  async function editModel(id, updates) {
    const { data } = await updateModel(id, updates)
    const idx = models.value.findIndex((m) => m.id === id)
    if (idx !== -1) models.value[idx] = data
    return data
  }

  async function removeModel(id) {
    await deleteModel(id)
    models.value = models.value.filter((m) => m.id !== id)
  }

  return { models, loading, fetchModels, addModel, editModel, removeModel }
})
