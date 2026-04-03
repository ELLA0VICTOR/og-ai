import { useState } from 'react'

export default function CodeBlock({ code, language = 'text' }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // fallback for older browsers
      const el = document.createElement('textarea')
      el.value = code
      document.body.appendChild(el)
      el.select()
      document.execCommand('copy')
      document.body.removeChild(el)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <div
      style={{
        background: '#0a0a0a',
        border: '1px solid var(--border-subtle)',
        borderRadius: '2px',
        overflow: 'hidden',
        margin: '8px 0',
      }}
    >
      {/* Header bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '6px 12px',
          borderBottom: '1px solid var(--border-subtle)',
          background: '#0d0d0d',
        }}
      >
        {/* Language badge */}
        <span
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '10px',
            color: 'var(--accent)',
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
          }}
        >
          {language}
        </span>

        {/* Copy button */}
        <button
          onClick={handleCopy}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            fontFamily: 'var(--font-mono)',
            fontSize: '10px',
            color: copied ? 'var(--accent)' : 'var(--text-muted)',
            letterSpacing: '0.08em',
            padding: '2px 4px',
            transition: 'color 150ms ease',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
          }}
        >
          {copied ? (
            <>
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M1.5 5L4 7.5L8.5 2.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              COPIED
            </>
          ) : (
            'COPY'
          )}
        </button>
      </div>

      {/* Code area */}
      <pre
        style={{
          fontFamily: 'var(--font-code)',
          fontSize: '13px',
          lineHeight: '1.6',
          padding: '16px',
          overflowX: 'auto',
          color: 'var(--text-primary)',
          whiteSpace: 'pre',
          margin: 0,
        }}
      >
        <code>{code}</code>
      </pre>
    </div>
  )
}
