const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

export async function askStream(question, mode, history) {
  const response = await fetch(`${API_URL}/api/ask`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ question, mode, history, stream: true }),
  })
  if (!response.ok) throw new Error(`API error: ${response.status}`)
  return response.body.getReader()
}

export async function getAnswer(question, mode, history) {
  const response = await fetch(`${API_URL}/api/ask`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ question, mode, history, stream: false }),
  })
  if (!response.ok) throw new Error(`API error: ${response.status}`)
  return response.json()
}

export async function debugError(error, context = '') {
  const response = await fetch(`${API_URL}/api/debug`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ error, context }),
  })
  if (!response.ok) throw new Error(`API error: ${response.status}`)
  return response.json()
}

export async function planBuild(idea) {
  const response = await fetch(`${API_URL}/api/plan`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ idea }),
  })
  if (!response.ok) throw new Error(`API error: ${response.status}`)
  return response.json()
}

export async function getSources() {
  const response = await fetch(`${API_URL}/api/sources`)
  if (!response.ok) throw new Error(`API error: ${response.status}`)
  return response.json()
}

export async function checkHealth() {
  const response = await fetch(`${API_URL}/api/health`)
  if (!response.ok) throw new Error(`API error: ${response.status}`)
  return response.json()
}
