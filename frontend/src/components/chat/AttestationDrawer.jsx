import { useState } from 'react'
import { truncateHash } from '../../lib/utils'

export default function AttestationDrawer({ isOpen, onClose, paymentHash, model }) {
  const [teeExpanded, setTeeExpanded] = useState(false)

  if (!isOpen) return null

  const modelDisplay = model
    ? model.replace('og.TEE_LLM.', '').replace('TEE_LLM.', '')
    : 'GEMINI_2_5_FLASH'

  const basescanUrl = paymentHash
    ? `https://sepolia.basescan.org/tx/${paymentHash}`
    : null

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.5)',
          zIndex: 49,
        }}
      />

      {/* Drawer */}
      <div
        className="drawer-in"
        style={{
          position: 'fixed',
          right: 0,
          top: 0,
          height: '100%',
          width: '320px',
          background: 'var(--bg-surface)',
          borderLeft: '1px solid var(--border-default)',
          zIndex: 50,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
      >
        {/* Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '16px 20px',
            borderBottom: '1px solid var(--border-subtle)',
          }}
        >
          <span
            style={{
              fontFamily: 'var(--font-ui)',
              fontWeight: 600,
              fontSize: '14px',
              color: 'var(--text-primary)',
              letterSpacing: '-0.01em',
            }}
          >
            Attestation
          </span>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--text-muted)',
              padding: '4px',
              display: 'flex',
              alignItems: 'center',
              transition: 'color 150ms ease',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--text-primary)')}
            onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-muted)')}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M3 3L13 13M13 3L3 13" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

        {/* Content */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '20px' }}>
          {/* Status row */}
          <Row
            label="Status"
            value={
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span
                  className="pulse-dot"
                  style={{
                    width: '7px',
                    height: '7px',
                    borderRadius: '50%',
                    background: '#22c55e',
                    display: 'inline-block',
                    flexShrink: 0,
                  }}
                />
                <span style={{ color: '#22c55e', fontSize: '13px' }}>TEE Verified</span>
              </span>
            }
          />

          <Row label="Model" value={modelDisplay} mono />

          <Row
            label="Payment Hash"
            value={
              paymentHash ? (
                <span
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '11px',
                    color: 'var(--text-secondary)',
                    wordBreak: 'break-all',
                  }}
                >
                  {truncateHash(paymentHash, 10, 6)}
                </span>
              ) : (
                <span style={{ color: 'var(--text-muted)', fontSize: '12px' }}>
                  Not available (streaming mode)
                </span>
              )
            }
          />

          <Row label="Network" value="Base Sepolia" mono />
          <Row label="Settlement" value="SETTLE_METADATA" mono />
          <Row label="Chain ID" value="84532" mono />

          {/* Action buttons */}
          <div style={{ marginTop: '24px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {basescanUrl && (
              <a
                href={basescanUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  padding: '9px 14px',
                  border: '1px solid var(--accent-border)',
                  borderRadius: '2px',
                  color: 'var(--accent)',
                  fontFamily: 'var(--font-ui)',
                  fontSize: '13px',
                  fontWeight: 500,
                  textDecoration: 'none',
                  transition: 'all 150ms ease',
                  background: 'var(--accent-glow)',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--accent-dim)')}
                onMouseLeave={(e) => (e.currentTarget.style.background = 'var(--accent-glow)')}
              >
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M5 2H2v8h8V7M7 2h3v3M10 2L5.5 6.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                View on BaseScan
              </a>
            )}

            <a
              href="https://explorer.opengradient.ai/"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                padding: '9px 14px',
                border: '1px solid var(--border-default)',
                borderRadius: '2px',
                color: 'var(--text-secondary)',
                fontFamily: 'var(--font-ui)',
                fontSize: '13px',
                fontWeight: 500,
                textDecoration: 'none',
                transition: 'all 150ms ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'var(--border-active)'
                e.currentTarget.style.color = 'var(--text-primary)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'var(--border-default)'
                e.currentTarget.style.color = 'var(--text-secondary)'
              }}
            >
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M5 2H2v8h8V7M7 2h3v3M10 2L5.5 6.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              View on OG Explorer
            </a>
          </div>

          {/* TEE explainer */}
          <div style={{ marginTop: '24px' }}>
            <button
              onClick={() => setTeeExpanded((v) => !v)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                fontFamily: 'var(--font-ui)',
                fontSize: '12px',
                color: 'var(--text-muted)',
                padding: 0,
                transition: 'color 150ms ease',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--text-secondary)')}
              onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-muted)')}
            >
              <svg
                width="10"
                height="10"
                viewBox="0 0 10 10"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                style={{
                  transform: teeExpanded ? 'rotate(90deg)' : 'rotate(0deg)',
                  transition: 'transform 150ms ease',
                }}
              >
                <path d="M3 2L7 5L3 8" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              What is TEE?
            </button>

            {teeExpanded && (
              <p
                className="fade-in"
                style={{
                  marginTop: '10px',
                  fontFamily: 'var(--font-ui)',
                  fontSize: '12px',
                  color: 'var(--text-muted)',
                  lineHeight: 1.7,
                  borderLeft: '2px solid var(--border-default)',
                  paddingLeft: '10px',
                }}
              >
                A Trusted Execution Environment (TEE) is an isolated hardware enclave
                powered by Intel TDX. Your prompt runs inside this enclave — even the
                node operator cannot read the computation. Every inference produces a
                cryptographic attestation anchored on-chain, providing verifiable proof
                that a specific model processed your exact query.
              </p>
            )}
          </div>
        </div>
      </div>
    </>
  )
}

function Row({ label, value, mono = false }) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '3px',
        marginBottom: '16px',
      }}
    >
      <span
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '10px',
          color: 'var(--text-muted)',
          letterSpacing: '0.06em',
          textTransform: 'uppercase',
        }}
      >
        {label}
      </span>
      {typeof value === 'string' ? (
        <span
          style={{
            fontFamily: mono ? 'var(--font-mono)' : 'var(--font-ui)',
            fontSize: mono ? '12px' : '13px',
            color: 'var(--text-primary)',
          }}
        >
          {value}
        </span>
      ) : (
        value
      )}
    </div>
  )
}
