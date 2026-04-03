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
    <div
      style={{
        height: '48px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 16px',
        borderBottom: '1px solid var(--border-subtle)',
        background: 'var(--bg-surface)',
        position: 'relative',
        zIndex: 1,
        gap: '12px',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
        <button
          onClick={onMenuToggle}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: 'var(--text-secondary)',
            display: 'flex',
            alignItems: 'center',
            padding: '4px',
            transition: 'color 150ms ease',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--text-primary)')}
          onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-secondary)')}
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
            <path d="M2 4h14M2 9h14M2 14h14"/>
          </svg>
        </button>

        <button
          onClick={() => navigate('/')}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            height: '30px',
            padding: '0 10px',
            border: '1px solid rgba(255,255,255,0.08)',
            background: 'rgba(255,255,255,0.02)',
            color: 'var(--text-secondary)',
            fontFamily: 'var(--font-mono)',
            fontSize: '10px',
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            cursor: 'pointer',
            transition: 'all 150ms ease',
            whiteSpace: 'nowrap',
          }}
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

      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0 }}>
        <span
          style={{
            fontFamily: 'var(--font-ui)',
            fontWeight: 700,
            fontSize: '14px',
            color: 'var(--text-primary)',
            letterSpacing: '-0.02em',
            whiteSpace: 'nowrap',
          }}
        >
          OG AI
        </span>
        <span
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '10px',
            color: modeColors[currentMode] || 'var(--accent)',
            background: `${modeColors[currentMode] || 'var(--accent)'}18`,
            border: `1px solid ${modeColors[currentMode] || 'var(--accent)'}44`,
            borderRadius: '2px',
            padding: '1px 6px',
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            whiteSpace: 'nowrap',
          }}
        >
          {modeName(currentMode)}
        </span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '5px', flexShrink: 0 }}>
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
        <span
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '9px',
            color: 'var(--text-muted)',
            letterSpacing: '0.06em',
          }}
        >
          TEE
        </span>
      </div>
    </div>
  )
}
