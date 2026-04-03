import { useNavigate } from 'react-router-dom'
import { modeName } from '../../lib/utils'

export default function TopBar({ currentMode, onMenuToggle }) {
  const navigate = useNavigate()

  const modeColors = {
    ask: 'var(--accent)',
    debug: '#f59e0b',
    plan: '#a78bfa',
    snippet: '#34d399',
  }

  return (
    <div className="topbar-root">
      <div className="topbar-left">
        <button
          onClick={onMenuToggle}
          className="topbar-menu-button"
          onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--text-primary)')}
          onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-secondary)')}
          aria-label="Toggle navigation"
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
            <path d="M2 4h14M2 9h14M2 14h14"/>
          </svg>
        </button>

        <button
          onClick={() => navigate('/')}
          className="topbar-home-button"
          onMouseEnter={(e) => {
            e.currentTarget.style.color = 'var(--text-primary)'
            e.currentTarget.style.borderColor = 'var(--accent-border)'
            e.currentTarget.style.background = 'rgba(36,179,189,0.08)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = 'var(--text-secondary)'
            e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'
            e.currentTarget.style.background = 'rgba(255,255,255,0.02)'
          }}
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M10 6H2M5 3L2 6L5 9" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Home
        </button>
      </div>

      <div className="topbar-center">
        <span className="topbar-brand">OG AI</span>
        <span
          className="topbar-mode-pill"
          style={{
            color: modeColors[currentMode] || 'var(--accent)',
            background: `${modeColors[currentMode] || 'var(--accent)'}18`,
            border: `1px solid ${modeColors[currentMode] || 'var(--accent)'}44`,
          }}
        >
          {modeName(currentMode)}
        </span>
      </div>

      <div className="topbar-right">
        <span
          className="pulse-dot"
          style={{
            width: '6px',
            height: '6px',
            borderRadius: '50%',
            background: '#22c55e',
            display: 'inline-block',
          }}
        />
        <span className="topbar-status-text">TEE</span>
      </div>
    </div>
  )
}
