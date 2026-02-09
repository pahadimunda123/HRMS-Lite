import { api } from './client'

export async function getAttendanceSummary(date) {
  return api.get(`/attendance/summary?date=${date}`)
}

export async function getAttendance(employeeId, params = {}) {
  const q = new URLSearchParams(params).toString()
  return api.get(`/attendance/${employeeId}${q ? `?${q}` : ''}`)
}

export async function markAttendance(employeeId, data) {
  return api.post(`/attendance/${employeeId}`, data)
}
