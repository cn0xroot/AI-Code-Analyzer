import api from './index'

export const cloneRepo = (data) => api.post('/repos/clone', data)

export const cloneRepoStream = (data) => {
  const baseURL = api.defaults.baseURL || '/api/v1'
  return fetch(`${baseURL}/repos/clone/stream`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
}

export const uploadFiles = (formData, projectName) => {
  formData.append('project_name', projectName)
  return api.post('/repos/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
}
