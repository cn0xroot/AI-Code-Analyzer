import { defineStore } from 'pinia'
import { ref, watch } from 'vue'
import { getAnalysis, getAnalysisStatus, createAnalysis } from '../api/analysis'

const STORAGE_KEY = 'analysis_tasks'

function loadTasks() {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : {}
  } catch {
    return {}
  }
}

function saveTasks(tasks) {
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(tasks))
}

export const useAnalysisStore = defineStore('analysis', () => {
  const currentTask = ref(null)
  const taskMap = ref(loadTasks())
  const loading = ref(false)
  const polling = ref(false)
  let pollTimer = null
  let retryCount = 0
  const MAX_RETRIES = 5

  watch(taskMap, (val) => saveTasks(val), { deep: true })

  async function startAnalysis(params) {
    loading.value = true
    try {
      const { data } = await createAnalysis(params)
      const taskInfo = { id: data.task_id, status: data.status, params }
      currentTask.value = taskInfo
      taskMap.value[data.task_id] = taskInfo
      return data
    } finally {
      loading.value = false
    }
  }

  async function fetchResult(taskId) {
    loading.value = true
    try {
      const { data } = await getAnalysis(taskId)
      currentTask.value = data
      taskMap.value[taskId] = {
        id: data.id,
        status: data.status,
        project_name: data.project_name,
        analysis_type: data.analysis_type,
      }
      return data
    } finally {
      loading.value = false
    }
  }

  function startPolling(taskId, onStatusChange, onComplete) {
    stopPolling()
    polling.value = true
    retryCount = 0
    pollTimer = setInterval(async () => {
      try {
        const { data } = await getAnalysisStatus(taskId)
        retryCount = 0
        if (onStatusChange) onStatusChange(data.status)
        if (data.status === 'completed' || data.status === 'failed') {
          stopPolling()
          const result = await fetchResult(taskId)
          if (onComplete) onComplete(result)
        }
      } catch {
        retryCount++
        if (retryCount >= MAX_RETRIES) {
          stopPolling()
        }
      }
    }, 2000)
  }

  function stopPolling() {
    polling.value = false
    if (pollTimer) {
      clearInterval(pollTimer)
      pollTimer = null
    }
  }

  function getRunningTasks() {
    return Object.values(taskMap.value).filter(
      (t) => t.status && t.status !== 'completed' && t.status !== 'failed'
    )
  }

  return {
    currentTask,
    taskMap,
    loading,
    polling,
    startAnalysis,
    fetchResult,
    startPolling,
    stopPolling,
    getRunningTasks,
  }
})
