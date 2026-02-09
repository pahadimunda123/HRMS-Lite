import { api } from './client'

export async function getEmployees() {
  return api.get('/employees/')
}

export async function createEmployee(data) {
  return api.post('/employees/', data)
}

export async function deleteEmployee(id) {
  return api.delete(`/employees/${id}`)
}
