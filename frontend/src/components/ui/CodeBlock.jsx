import { useState } from 'react'

export default function CodeBlock({ code, language = 'text' }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
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
    <div className="code-block-shell">
      <div className="code-block-header">
        <span className="code-block-language">
          {language}
        </span>

        <button
          onClick={handleCopy}
          className="code-block-copy"
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

      <pre className="code-block-pre">
        <code>{code}</code>
      </pre>
    </div>
  )
}
