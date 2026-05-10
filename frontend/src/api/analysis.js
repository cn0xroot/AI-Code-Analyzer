import api from './index'

export const createAnalysis = (data) => api.post('/analysis/', data)

export const getAnalysis = (taskId) => api.get(`/analysis/${taskId}`)

export const getAnalysisStatus = (taskId) => api.get(`/analysis/${taskId}/status`)

export const streamAnalysis = (taskId) => {
  const baseURL = api.defaults.baseURL || '/api/v1'
  return fetch(`${baseURL}/analysis/${taskId}/stream`)
}

export const chatWithAnalysis = (taskId, message, aiConfigId) => {
  const baseURL = api.defaults.baseURL || '/api/v1'
  return fetch(`${baseURL}/analysis/${taskId}/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message, ai_config_id: aiConfigId }),
  })
}
