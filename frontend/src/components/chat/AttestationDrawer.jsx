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
      <div
        onClick={onClose}
        className="attestation-backdrop"
      />

      <div className="drawer-in attestation-drawer">
        <div className="attestation-drawer__header">
          <span className="attestation-drawer__title">Attestation</span>
          <button
            onClick={onClose}
            className="attestation-drawer__close"
            onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--text-primary)')}
            onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-muted)')}
            aria-label="Close attestation drawer"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M3 3L13 13M13 3L3 13" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

        <div className="attestation-drawer__content">
          <Row
            label="Status"
            value={
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
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
                <span className="attestation-drawer__hash">
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

          <div className="attestation-drawer__actions">
            {basescanUrl && (
              <a
                href={basescanUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="attestation-drawer__action attestation-drawer__action--primary"
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
              className="attestation-drawer__action"
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

          <div style={{ marginTop: '24px' }}>
            <button
              onClick={() => setTeeExpanded((v) => !v)}
              className="attestation-drawer__toggle"
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
              <p className="fade-in attestation-drawer__explain">
                A Trusted Execution Environment (TEE) is an isolated hardware enclave
                powered by Intel TDX. Your prompt runs inside this enclave - even the
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
    <div className="attestation-row">
      <span className="attestation-row__label">
        {label}
      </span>
      {typeof value === 'string' ? (
        <span
          style={{
            fontFamily: mono ? 'var(--font-mono)' : 'var(--font-ui)',
            fontSize: mono ? '12px' : '13px',
            color: 'var(--text-primary)',
            wordBreak: 'break-word',
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
