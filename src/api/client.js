const API_BASE = import.meta.env.VITE_API_URL || '/api'

async function handleResponse(res) {
  const text = await res.text()
  let data
  try {
    data = text ? JSON.parse(text) : null
  } catch {
    throw new Error('Invalid server response')
  }
  if (!res.ok) {
    const message = data?.detail || (Array.isArray(data?.detail) ? data.detail[0]?.msg : null) || res.statusText
    const err = new Error(typeof message === 'string' ? message : 'Request failed')
    err.status = res.status
    err.data = data
    throw err
  }
  return data
}

export const api = {
  async get(path) {
    const res = await fetch(`${API_BASE}${path}`)
    return handleResponse(res)
  },
  async post(path, body) {
    const res = await fetch(`${API_BASE}${path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
    return handleResponse(res)
  },
  async delete(path) {
    const res = await fetch(`${API_BASE}${path}`, { method: 'DELETE' })
    if (res.status === 204) return null
    return handleResponse(res)
  },
}
