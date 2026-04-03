import { useCallback } from 'react'

const STORAGE_KEY = 'og-ai-history'
const MAX_ENTRIES = 10

export function useHistory() {
  const getHistory = useCallback(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      return raw ? JSON.parse(raw) : []
    } catch {
      return []
    }
  }, [])

  const addQuestion = useCallback((question) => {
    if (!question || !question.trim()) return
    try {
      const existing = getHistory()
      // Deduplicate: remove if already present
      const filtered = existing.filter(
        (q) => q.toLowerCase() !== question.toLowerCase()
      )
      // Prepend new question, limit to MAX_ENTRIES
      const updated = [question.trim(), ...filtered].slice(0, MAX_ENTRIES)
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
    } catch {
      // localStorage might be unavailable — silently ignore
    }
  }, [getHistory])

  const clearHistory = useCallback(() => {
    try {
      localStorage.removeItem(STORAGE_KEY)
    } catch {
      // ignore
    }
  }, [])

  return { getHistory, addQuestion, clearHistory }
}
