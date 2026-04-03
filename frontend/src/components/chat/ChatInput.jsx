import { useState, useRef, useEffect, useCallback } from 'react'
import { modeLabel } from '../../lib/utils'
import { Spinner } from '../ui/Button'

export default function ChatInput({ onSend, isStreaming, currentMode }) {
  const [value, setValue] = useState('')
  const textareaRef = useRef(null)

  // Auto-resize textarea
  useEffect(() => {
    const el = textareaRef.current
    if (!el) return
    el.style.height = 'auto'
    el.style.height = Math.min(el.scrollHeight, 144) + 'px' // max 6 rows ~144px
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
    <div
      style={{
        padding: '12px 20px 16px',
        borderTop: '1px solid var(--border-subtle)',
        background: 'var(--bg-primary)',
        position: 'relative',
      }}
    >
      {/* Mode badge above textarea */}
      <div style={{ marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
        <span
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '10px',
            letterSpacing: '0.1em',
            color: modeColor,
            background: `${modeColor}18`,
            border: `1px solid ${modeColor}44`,
            borderRadius: '2px',
            padding: '1px 6px',
          }}
        >
          {modeLabel(currentMode)}
        </span>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--text-muted)' }}>
          Enter to send | Shift+Enter for new line
        </span>
      </div>

      {/* Input wrapper */}
      <div style={{ position: 'relative' }}>
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder(currentMode)}
          disabled={isStreaming}
          rows={1}
          style={{
            width: '100%',
            background: 'var(--bg-card)',
            border: `1px solid ${value ? 'var(--accent-border)' : 'var(--border-default)'}`,
            borderRadius: '2px',
            padding: '12px 56px 12px 16px',
            fontFamily: 'var(--font-ui)',
            fontSize: '14px',
            color: 'var(--text-primary)',
            resize: 'none',
            outline: 'none',
            lineHeight: 1.6,
            transition: 'border-color 150ms ease',
            caretColor: 'var(--accent)',
          }}
          onFocus={(e) => {
            if (!value) e.target.style.borderColor = 'var(--accent-border)'
          }}
          onBlur={(e) => {
            if (!value) e.target.style.borderColor = 'var(--border-default)'
          }}
        />

        {/* Send button */}
        <button
          onClick={handleSubmit}
          disabled={!value.trim() || isStreaming}
          style={{
            position: 'absolute',
            right: '10px',
            bottom: '10px',
            width: '32px',
            height: '32px',
            background: value.trim() && !isStreaming ? 'var(--accent-dim)' : 'transparent',
            border: `1px solid ${value.trim() && !isStreaming ? 'var(--accent-border)' : 'var(--border-subtle)'}`,
            borderRadius: '2px',
            cursor: value.trim() && !isStreaming ? 'pointer' : 'not-allowed',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: value.trim() && !isStreaming ? 'var(--accent)' : 'var(--text-muted)',
            transition: 'all 150ms ease',
            flexShrink: 0,
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
