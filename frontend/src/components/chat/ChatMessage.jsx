import { useState } from 'react'
import CodeBlock from '../ui/CodeBlock'
import SourceChips from './SourceChips'
import { parseContent, parseInlineCode, truncateHash } from '../../lib/utils'

export default function ChatMessage({
  role,
  content,
  sources = [],
  paymentHash,
  isStreaming,
  onAttestationClick,
}) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    if (!content?.trim()) return

    try {
      await navigator.clipboard.writeText(content)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1800)
    } catch {
      setCopied(false)
    }
  }

  if (role === 'user') {
    return (
      <div className="fade-in chat-message-user-wrap">
        <div className="chat-message-user-bubble">
          {content}
        </div>
      </div>
    )
  }

  const segments = parseContent(content)

  return (
    <div className="fade-in chat-message-assistant-wrap">
      <div
        className={isStreaming && content ? 'cursor-blink chat-message-body' : 'chat-message-body'}
      >
        {segments.length === 0 && isStreaming ? (
          <span className="cursor-blink" style={{ color: 'var(--text-muted)' }}>&nbsp;</span>
        ) : (
          segments.map((seg, i) => {
            if (seg.type === 'code') {
              return <CodeBlock key={i} code={seg.content} language={seg.language} />
            }

            const inlineParts = parseInlineCode(seg.content)
            return (
              <span key={i}>
                {inlineParts.map((part, j) => {
                  if (part.type === 'inline_code') {
                    return (
                      <code
                        key={j}
                        className="chat-inline-code"
                      >
                        {part.content}
                      </code>
                    )
                  }

                  return part.content.split('\n').map((line, k, arr) => (
                    <span key={k}>
                      {line}
                      {k < arr.length - 1 && <br />}
                    </span>
                  ))
                })}
              </span>
            )
          })
        )}
      </div>

      {sources && sources.length > 0 && <SourceChips sources={sources} />}

      {(paymentHash || content?.trim()) && (
        <div className="chat-message-actions">
          <div className="chat-message-verify-slot">
            {paymentHash && (
              <button
                onClick={() => onAttestationClick && onAttestationClick(paymentHash)}
                className="chat-message-verify"
                onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--text-secondary)')}
                onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-muted)')}
              >
                <span
                  className="pulse-dot"
                  style={{
                    width: '6px',
                    height: '6px',
                    borderRadius: '50%',
                    background: '#22c55e',
                    display: 'inline-block',
                    flexShrink: 0,
                  }}
                />
                TEE Verified
                <span style={{ color: 'var(--border-active)', margin: '0 2px' }}>·</span>
                <span style={{ color: 'var(--accent)' }}>{truncateHash(paymentHash, 6, 4)}</span>
                <svg width="9" height="9" viewBox="0 0 9 9" fill="none" stroke="currentColor" strokeWidth="1.2">
                  <path d="M1.5 4.5H7.5M5 2L7.5 4.5L5 7" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            )}
          </div>

          <button
            onClick={handleCopy}
            disabled={!content?.trim()}
            className="chat-message-copy"
            style={{
              background: copied ? 'rgba(36,179,189,0.08)' : 'rgba(255,255,255,0.02)',
              color: copied ? 'var(--accent)' : 'var(--text-secondary)',
              cursor: content?.trim() ? 'pointer' : 'not-allowed',
            }}
            onMouseEnter={(e) => {
              if (content?.trim()) {
                e.currentTarget.style.borderColor = 'var(--accent-border)'
                e.currentTarget.style.color = 'var(--text-primary)'
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'
              e.currentTarget.style.color = copied ? 'var(--accent)' : 'var(--text-secondary)'
            }}
          >
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.3">
              <rect x="4" y="2" width="6" height="7" rx="1" />
              <path d="M2.5 8.5h-0.5a1 1 0 0 1-1-1V2.5a1 1 0 0 1 1-1H7a1 1 0 0 1 1 1V3" strokeLinecap="round" />
            </svg>
            {copied ? 'Copied' : 'Copy'}
          </button>
        </div>
      )}

      {isStreaming && !content && (
        <div className="chat-message-thinking">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              style={{
                width: '4px',
                height: '4px',
                borderRadius: '50%',
                background: 'var(--accent)',
                animation: `pulse-dot 1.2s ease-in-out ${i * 0.2}s infinite`,
                display: 'inline-block',
              }}
            />
          ))}
        </div>
      )}
    </div>
  )
}
