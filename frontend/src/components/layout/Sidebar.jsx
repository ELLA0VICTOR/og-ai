import { useEffect, useState } from 'react'
import { useHistory } from '../../hooks/useHistory'
import { modeName } from '../../lib/utils'

const MODES = [
  {
    id: 'ask',
    label: 'Ask Docs',
    icon: (
      // Open book with text lines
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 14.5V4.5"/>
        <path d="M9 4.5C9 4.5 6.5 3 3 3.5V14.5C6.5 14 9 15.5 9 15.5"/>
        <path d="M9 4.5C9 4.5 11.5 3 15 3.5V14.5C11.5 14 9 15.5 9 15.5"/>
        <path d="M4.5 6.5H7.5M4.5 8.5H7.5M4.5 10.5H7.5"/>
        <path d="M10.5 6.5H13.5M10.5 8.5H13.5M10.5 10.5H13.5"/>
      </svg>
    ),
  },
  {
    id: 'debug',
    label: 'Debug Error',
    icon: (
      // Terminal with > prompt and error X
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="3" width="14" height="12" rx="1"/>
        <path d="M2 6h14"/>
        <path d="M5.5 9.5L7.5 11L5.5 12.5"/>
        <path d="M10 12.5h3"/>
      </svg>
    ),
  },
  {
    id: 'plan',
    label: 'Build Planner',
    icon: (
      // Three connected rectangles (system diagram)
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
        <rect x="1" y="7" width="4" height="4" rx="0.5"/>
        <rect x="7" y="3" width="4" height="4" rx="0.5"/>
        <rect x="7" y="11" width="4" height="4" rx="0.5"/>
        <rect x="13" y="7" width="4" height="4" rx="0.5"/>
        <path d="M5 9h2M11 5v1.5M11 9h2M11 13v-1.5M11 9V7.5"/>
      </svg>
    ),
  },
  {
    id: 'snippet',
    label: 'Snippet Mode',
    icon: (
      // </ > angle brackets with underscore
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 5L2 9L6 13"/>
        <path d="M12 5L16 9L12 13"/>
        <path d="M10 5L8 13"/>
      </svg>
    ),
  },
]

export default function Sidebar({ currentMode, onModeChange, onQuestionClick, onClear }) {
  const { getHistory } = useHistory()
  const [history, setHistory] = useState([])

  useEffect(() => {
    setHistory(getHistory())
    // Refresh history on storage events (when messages are sent)
    const handler = () => setHistory(getHistory())
    window.addEventListener('storage', handler)
    return () => window.removeEventListener('storage', handler)
  }, [getHistory])

  // Also refresh when currentMode changes (user just sent a message)
  useEffect(() => {
    setHistory(getHistory())
  }, [currentMode, getHistory])

  return (
    <div
      style={{
        width: 'var(--sidebar-width)',
        minWidth: 'var(--sidebar-width)',
        height: '100%',
        background: 'var(--bg-surface)',
        borderRight: '1px solid var(--border-subtle)',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        zIndex: 1,
        flexShrink: 0,
      }}
    >
      {/* Logo */}
      <div
        style={{
          padding: '20px 16px 16px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
        }}
      >
        {/* OG square icon */}
        <div
          style={{
            width: '22px',
            height: '22px',
            background: 'var(--accent)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '2px',
            flexShrink: 0,
          }}
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M1 2.5L1 9.5L5 9.5L5 8L2.5 8L2.5 4L5 4L5 2.5Z" fill="#000"/>
            <path d="M6.5 2.5L6.5 9.5L11 9.5L11 6L8.5 6L8.5 7.5L9.5 7.5L9.5 8L8 8L8 4L11 4L11 2.5Z" fill="#000"/>
          </svg>
        </div>
        <span
          style={{
            fontFamily: 'var(--font-ui)',
            fontWeight: 700,
            fontSize: '15px',
            color: 'var(--text-primary)',
            letterSpacing: '-0.02em',
          }}
        >
          OG AI
        </span>
      </div>

      {/* Divider */}
      <div style={{ height: '1px', background: 'var(--border-subtle)', margin: '0 0 8px' }} />

      {/* Mode selector */}
      <nav style={{ padding: '4px 8px' }}>
        {MODES.map((mode) => {
          const isActive = currentMode === mode.id
          return (
            <button
              key={mode.id}
              onClick={() => onModeChange(mode.id)}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '7px 8px',
                borderRadius: '2px',
                background: isActive ? 'var(--accent-dim)' : 'transparent',
                border: 'none',
                borderLeft: isActive ? '2px solid var(--accent)' : '2px solid transparent',
                cursor: 'pointer',
                color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
                fontFamily: 'var(--font-ui)',
                fontWeight: 500,
                fontSize: '13px',
                textAlign: 'left',
                transition: 'all 150ms ease',
                marginBottom: '2px',
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  e.currentTarget.style.color = 'var(--text-primary)'
                  e.currentTarget.style.background = 'var(--bg-card)'
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.currentTarget.style.color = 'var(--text-secondary)'
                  e.currentTarget.style.background = 'transparent'
                }
              }}
            >
              <span style={{ opacity: isActive ? 1 : 0.6, flexShrink: 0 }}>
                {mode.icon}
              </span>
              {mode.label}
            </button>
          )
        })}
      </nav>

      {/* Divider */}
      <div style={{ height: '1px', background: 'var(--border-subtle)', margin: '8px 0' }} />

      {/* Recent questions */}
      <div style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        <div
          style={{
            padding: '0 16px 6px',
            fontFamily: 'var(--font-mono)',
            fontSize: '10px',
            color: 'var(--text-muted)',
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
          }}
        >
          Recent
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: '0 8px' }}>
          {history.length === 0 ? (
            <p
              style={{
                padding: '4px 8px',
                fontFamily: 'var(--font-ui)',
                fontSize: '11px',
                color: 'var(--text-muted)',
                fontStyle: 'italic',
              }}
            >
              No recent questions
            </p>
          ) : (
            history.slice(0, 8).map((q, i) => (
              <button
                key={i}
                onClick={() => onQuestionClick(q)}
                title={q}
                style={{
                  width: '100%',
                  display: 'block',
                  padding: '5px 8px',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  fontFamily: 'var(--font-ui)',
                  fontSize: '12px',
                  color: 'var(--text-secondary)',
                  textAlign: 'left',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  borderRadius: '2px',
                  transition: 'all 150ms ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = 'var(--text-primary)'
                  e.currentTarget.style.background = 'var(--bg-card)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = 'var(--text-secondary)'
                  e.currentTarget.style.background = 'none'
                }}
              >
                {q}
              </button>
            ))
          )}
        </div>
      </div>

      {/* Bottom actions */}
      <div
        style={{
          borderTop: '1px solid var(--border-subtle)',
          padding: '12px 16px',
          display: 'flex',
          flexDirection: 'column',
          gap: '6px',
        }}
      >
        {/* Clear conversation */}
        <button
          onClick={onClear}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            fontFamily: 'var(--font-mono)',
            fontSize: '10px',
            color: 'var(--text-muted)',
            letterSpacing: '0.06em',
            textAlign: 'left',
            padding: '2px 0',
            transition: 'color 150ms ease',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--text-secondary)')}
          onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-muted)')}
        >
          CLEAR CONVERSATION
        </button>

        {/* Faucet link */}
        <a
          href="https://faucet.opengradient.ai/"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '10px',
            color: 'var(--text-muted)',
            textDecoration: 'none',
            letterSpacing: '0.06em',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            transition: 'color 150ms ease',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--accent)')}
          onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-muted)')}
        >
          GET $OPG TOKENS
          <svg width="9" height="9" viewBox="0 0 9 9" fill="none" stroke="currentColor" strokeWidth="1.2">
            <path d="M1.5 4.5H7.5M5 2L7.5 4.5L5 7" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </a>
      </div>
    </div>
  )
}
