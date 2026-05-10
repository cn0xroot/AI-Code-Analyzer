import api from './index'

export const listModels = () => api.get('/models/')

export const createModel = (data) => api.post('/models/', data)

export const updateModel = (id, data) => api.put(`/models/${id}`, data)

export const deleteModel = (id) => api.delete(`/models/${id}`)
