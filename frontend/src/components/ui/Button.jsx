// Button.jsx
export function Button({
  children,
  onClick,
  disabled,
  variant = 'default',
  size = 'md',
  style: extraStyle = {},
  ...props
}) {
  const base = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    fontFamily: 'var(--font-ui)',
    fontWeight: 500,
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.4 : 1,
    transition: 'all 150ms ease',
    border: '1px solid',
    borderRadius: '2px',
    background: 'none',
    outline: 'none',
  }

  const sizes = {
    sm: { fontSize: '12px', padding: '4px 10px' },
    md: { fontSize: '13px', padding: '7px 14px' },
    lg: { fontSize: '14px', padding: '10px 20px' },
  }

  const variants = {
    default: {
      borderColor: 'var(--border-default)',
      color: 'var(--text-secondary)',
    },
    accent: {
      borderColor: 'var(--accent-border)',
      color: 'var(--accent)',
    },
    ghost: {
      borderColor: 'transparent',
      color: 'var(--text-muted)',
    },
  }

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{ ...base, ...sizes[size], ...variants[variant], ...extraStyle }}
      {...props}
    >
      {children}
    </button>
  )
}

// Badge.jsx
export function Badge({ children, variant = 'default', style: extraStyle = {} }) {
  const base = {
    display: 'inline-flex',
    alignItems: 'center',
    fontFamily: 'var(--font-mono)',
    fontSize: '10px',
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
    padding: '2px 6px',
    borderRadius: '2px',
    border: '1px solid',
    lineHeight: 1.4,
  }

  const variants = {
    default: {
      background: 'var(--bg-elevated)',
      borderColor: 'var(--border-subtle)',
      color: 'var(--text-muted)',
    },
    accent: {
      background: 'var(--accent-dim)',
      borderColor: 'var(--accent-border)',
      color: 'var(--accent)',
    },
    green: {
      background: 'rgba(34,197,94,0.08)',
      borderColor: 'rgba(34,197,94,0.2)',
      color: '#22c55e',
    },
  }

  return (
    <span style={{ ...base, ...variants[variant], ...extraStyle }}>
      {children}
    </span>
  )
}

// Spinner.jsx
export function Spinner({ size = 16, color = 'var(--accent)' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
      style={{ animation: 'spin 0.8s linear infinite' }}
    >
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      <circle
        cx="8"
        cy="8"
        r="6"
        stroke={color}
        strokeWidth="1.5"
        strokeOpacity="0.2"
      />
      <path
        d="M8 2A6 6 0 0 1 14 8"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  )
}
