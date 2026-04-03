import { useState, useCallback, useRef, useEffect } from 'react'
import { askStream } from '../lib/api'
import { useHistory } from './useHistory'

export function useChat() {
  const [messages, setMessages] = useState([])
  const [isStreaming, setIsStreaming] = useState(false)
  const [currentMode, setCurrentMode] = useState('ask')
  const [sources, setSources] = useState([])
  const [attestation, setAttestation] = useState(null)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const abortRef = useRef(null)
  const currentModeRef = useRef('ask')
  const messagesRef = useRef([])
  const { addQuestion } = useHistory()

  useEffect(() => {
    currentModeRef.current = currentMode
  }, [currentMode])

  useEffect(() => {
    messagesRef.current = messages
  }, [messages])

  const sendMessage = useCallback(async (text) => {
    if (!text.trim() || isStreaming) return

    const activeMode = currentModeRef.current

    addQuestion(text)

    const userMsg = {
      role: 'user',
      content: text,
      id: Date.now(),
    }
    setMessages((prev) => [...prev, userMsg])
    setIsStreaming(true)

    const aiMsgId = Date.now() + 1
    setMessages((prev) => [
      ...prev,
      {
        role: 'assistant',
        content: '',
        id: aiMsgId,
        isStreaming: true,
        sources: [],
        paymentHash: null,
      },
    ])

    try {
      const history = messagesRef.current.slice(-6).map((m) => ({
        role: m.role,
        content: m.content,
      }))

      const reader = await askStream(text, activeMode, history)
      const decoder = new TextDecoder()
      let buffer = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        buffer += decoder.decode(value, { stream: true })
        const lines = buffer.split('\n')
        buffer = lines.pop() || ''

        for (const line of lines) {
          if (!line.startsWith('data: ')) continue
          const raw = line.slice(6).trim()
          if (!raw) continue

          try {
            const event = JSON.parse(raw)

            if (event.type === 'sources') {
              setSources(event.sources)
              setMessages((prev) =>
                prev.map((m) =>
                  m.id === aiMsgId ? { ...m, sources: event.sources } : m
                )
              )
            } else if (event.type === 'chunk') {
              setMessages((prev) =>
                prev.map((m) =>
                  m.id === aiMsgId
                    ? { ...m, content: m.content + event.content }
                    : m
                )
              )
            } else if (event.type === 'error') {
              setMessages((prev) =>
                prev.map((m) =>
                  m.id === aiMsgId
                    ? {
                        ...m,
                        content: `Error: ${event.message}`,
                        isStreaming: false,
                      }
                    : m
                )
              )
            } else if (event.type === 'done') {
              setMessages((prev) =>
                prev.map((m) =>
                  m.id === aiMsgId ? { ...m, isStreaming: false } : m
                )
              )
            }
          } catch {
            // Skip malformed SSE payloads.
          }
        }
      }
    } catch {
      setMessages((prev) =>
        prev.map((m) =>
          m.id === aiMsgId
            ? {
                ...m,
                content:
                  'Connection error. Check that the backend is running at ' +
                  (import.meta.env.VITE_API_URL || 'http://localhost:8000'),
                isStreaming: false,
              }
            : m
        )
      )
    } finally {
      setIsStreaming(false)
    }
  }, [isStreaming, addQuestion])

  const clearHistory = useCallback(() => {
    messagesRef.current = []
    setMessages([])
    setSources([])
    setAttestation(null)
    setDrawerOpen(false)
  }, [])

  const changeMode = useCallback((mode) => {
    if (!mode || mode === currentModeRef.current) return

    currentModeRef.current = mode
    messagesRef.current = []
    setCurrentMode(mode)
    setMessages([])
    setSources([])
    setAttestation(null)
    setDrawerOpen(false)
  }, [])

  const openAttestationDrawer = useCallback((hash, model) => {
    setAttestation({ paymentHash: hash, model })
    setDrawerOpen(true)
  }, [])

  const closeDrawer = useCallback(() => {
    setDrawerOpen(false)
  }, [])

  return {
    messages,
    isStreaming,
    currentMode,
    changeMode,
    sources,
    attestation,
    drawerOpen,
    sendMessage,
    clearHistory,
    openAttestationDrawer,
    closeDrawer,
  }
}
