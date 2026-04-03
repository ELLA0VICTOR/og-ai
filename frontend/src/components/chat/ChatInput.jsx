import { useState, useRef, useEffect, useCallback } from 'react'
import { modeLabel } from '../../lib/utils'
import { Spinner } from '../ui/Button'

export default function ChatInput({ onSend, isStreaming, currentMode }) {
  const [value, setValue] = useState('')
  const textareaRef = useRef(null)

  useEffect(() => {
    const el = textareaRef.current
    if (!el) return
    el.style.height = 'auto'
    el.style.height = Math.min(el.scrollHeight, 144) + 'px'
  }, [value])

  const handleSubmit = useCallback(() => {
    const trimmed = value.trim()
    if (!trimmed || isStreaming) return
    onSend(trimmed)
    setValue('')
  }, [value, isStreaming, onSend])

  const handleKeyDown = (e) => {
    if (e.key !== 'Enter') return

    if (e.shiftKey) {
      return
    }

    e.preventDefault()
    handleSubmit()
  }

  const modeColors = {
    ask: 'var(--accent)',
    debug: '#f59e0b',
    plan: '#a78bfa',
    snippet: '#34d399',
  }
  const modeColor = modeColors[currentMode] || 'var(--accent)'

  return (
    <div className="chat-input-root">
      <div className="chat-input-meta">
        <span
          className="chat-input-mode-pill"
          style={{
            color: modeColor,
            background: `${modeColor}18`,
            border: `1px solid ${modeColor}44`,
          }}
        >
          {modeLabel(currentMode)}
        </span>
        <span className="chat-input-hint">
          Enter to send | Shift+Enter for new line
        </span>
      </div>

      <div className="chat-input-wrapper">
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder(currentMode)}
          disabled={isStreaming}
          rows={1}
          className="chat-input-textarea"
          style={{
            borderColor: value ? 'var(--accent-border)' : 'var(--border-default)',
          }}
          onFocus={(e) => {
            if (!value) e.target.style.borderColor = 'var(--accent-border)'
          }}
          onBlur={(e) => {
            if (!value) e.target.style.borderColor = 'var(--border-default)'
          }}
        />

        <button
          onClick={handleSubmit}
          disabled={!value.trim() || isStreaming}
          className="chat-input-send"
          style={{
            background: value.trim() && !isStreaming ? 'var(--accent-dim)' : 'transparent',
            border: `1px solid ${value.trim() && !isStreaming ? 'var(--accent-border)' : 'var(--border-subtle)'}`,
            color: value.trim() && !isStreaming ? 'var(--accent)' : 'var(--text-muted)',
            cursor: value.trim() && !isStreaming ? 'pointer' : 'not-allowed',
          }}
          onMouseEnter={(e) => {
            if (value.trim() && !isStreaming) {
              e.currentTarget.style.background = 'var(--accent-dim)'
              e.currentTarget.style.borderColor = 'var(--accent)'
            }
          }}
          onMouseLeave={(e) => {
            if (value.trim() && !isStreaming) {
              e.currentTarget.style.background = 'var(--accent-dim)'
              e.currentTarget.style.borderColor = 'var(--accent-border)'
            }
          }}
          aria-label="Send message"
        >
          {isStreaming ? (
            <Spinner size={14} />
          ) : (
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M7 12V2M2 7L7 2L12 7" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          )}
        </button>
      </div>
    </div>
  )
}

function placeholder(mode) {
  const map = {
    ask: 'Ask anything about the OpenGradient SDK...',
    debug: 'Paste your error or traceback here...',
    plan: 'Describe the app you want to build with OpenGradient...',
    snippet: 'Describe the code snippet you need...',
  }
  return map[mode] || 'Ask anything...'
}
