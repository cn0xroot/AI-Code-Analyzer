import api from './index'

export const listHistory = (skip = 0, limit = 20) =>
  api.get('/history/', { params: { skip, limit } })

export const deleteHistory = (taskId) => api.delete(`/history/${taskId}`)
