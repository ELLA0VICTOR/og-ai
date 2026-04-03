import { useEffect, useState } from 'react'
import { useHistory } from '../../hooks/useHistory'

const MODES = [
  {
    id: 'ask',
    label: 'Ask Docs',
    icon: (
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
    const handler = () => setHistory(getHistory())
    window.addEventListener('storage', handler)
    return () => window.removeEventListener('storage', handler)
  }, [getHistory])

  useEffect(() => {
    setHistory(getHistory())
  }, [currentMode, getHistory])

  return (
    <div className="sidebar-root">
      <div className="sidebar-logo-row">
        <div className="sidebar-logo-mark">
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M1 2.5L1 9.5L5 9.5L5 8L2.5 8L2.5 4L5 4L5 2.5Z" fill="#000"/>
            <path d="M6.5 2.5L6.5 9.5L11 9.5L11 6L8.5 6L8.5 7.5L9.5 7.5L9.5 8L8 8L8 4L11 4L11 2.5Z" fill="#000"/>
          </svg>
        </div>
        <span className="sidebar-logo-text">OG AI</span>
      </div>

      <div className="sidebar-divider" />

      <nav className="sidebar-nav">
        {MODES.map((mode) => {
          const isActive = currentMode === mode.id
          return (
            <button
              key={mode.id}
              onClick={() => onModeChange(mode.id)}
              className={`sidebar-mode-button${isActive ? ' is-active' : ''}`}
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

      <div className="sidebar-divider sidebar-divider--spaced" />

      <div className="sidebar-history-shell">
        <div className="sidebar-section-label">Recent</div>

        <div className="sidebar-history-list">
          {history.length === 0 ? (
            <p className="sidebar-empty-history">No recent questions</p>
          ) : (
            history.slice(0, 8).map((q, i) => (
              <button
                key={i}
                onClick={() => onQuestionClick(q)}
                title={q}
                className="sidebar-history-button"
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

      <div className="sidebar-footer">
        <button
          onClick={onClear}
          className="sidebar-text-action"
          onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--text-secondary)')}
          onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-muted)')}
        >
          CLEAR CONVERSATION
        </button>

        <a
          href="https://faucet.opengradient.ai/"
          target="_blank"
          rel="noopener noreferrer"
          className="sidebar-text-action sidebar-text-link"
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
