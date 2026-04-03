import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const MODES = [
  {
    id: 'ask',
    label: 'Ask Docs',
    eyebrow: 'Grounded answers',
    description: 'Interrogate the OpenGradient docs with citations, examples, and retrieval-backed context.',
    example: 'How do I stream LLM responses with the OG SDK?',
    action: 'Open docs mode',
    icon: (
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
        <path d="M11 18V5.5" />
        <path d="M11 5.5C11 5.5 8 3.5 4 4.5V17.5C8 16.5 11 18.5 11 18.5" />
        <path d="M11 5.5C11 5.5 14 3.5 18 4.5V17.5C14 16.5 11 18.5 11 18.5" />
        <path d="M5.5 8H9.5M5.5 10.5H9.5M5.5 13H9.5" />
        <path d="M12.5 8H16.5M12.5 10.5H16.5M12.5 13H16.5" />
      </svg>
    ),
    color: '#24B3BD',
  },
  {
    id: 'debug',
    label: 'Debug Error',
    eyebrow: 'Fix integration issues',
    description: 'Paste stack traces, SDK failures, or CORS problems and get concrete next-step guidance.',
    example: 'Why is my ensure_opg_approval() failing?',
    action: 'Inspect an error',
    icon: (
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2.5" y="3.5" width="17" height="15" rx="1.5" />
        <path d="M2.5 7.5h17" />
        <path d="M6.5 11.5L9 13.5L6.5 15.5" />
        <path d="M12 15.5h4" />
      </svg>
    ),
    color: '#f59e0b',
  },
  {
    id: 'plan',
    label: 'Build Planner',
    eyebrow: 'Architect with intent',
    description: 'Map product ideas to the right OpenGradient primitives, deployment patterns, and env setup.',
    example: 'I want to build a DeFi risk analyzer on OG.',
    action: 'Plan a build',
    icon: (
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
        <rect x="1.5" y="9" width="5" height="4.5" rx="0.5" />
        <rect x="8.5" y="4" width="5" height="4.5" rx="0.5" />
        <rect x="8.5" y="13.5" width="5" height="4.5" rx="0.5" />
        <rect x="15.5" y="9" width="5" height="4.5" rx="0.5" />
        <path d="M6.5 11.25h2M13.5 6.25v2M13.5 11.25h2M13.5 15.75v-2M11 11.25V10" />
      </svg>
    ),
    color: '#a78bfa',
  },
  {
    id: 'snippet',
    label: 'Snippet Mode',
    eyebrow: 'Code that travels',
    description: 'Generate compact implementation examples for chat, x402, TEE inference, and workflows.',
    example: 'Show me tool calling with og.TEE_LLM.',
    action: 'Generate a snippet',
    icon: (
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
        <path d="M7 6L2 11L7 16" />
        <path d="M15 6L20 11L15 16" />
        <path d="M13 4L9 18" />
      </svg>
    ),
    color: '#34d399',
  },
]

const SIGNALS = [
  { label: 'Retrieval', value: 'Docs-indexed', detail: 'answers grounded in curated OpenGradient references' },
  { label: 'Inference', value: 'TEE-backed', detail: 'final responses routed through OpenGradient' },
  { label: 'Workflow', value: 'Builder-ready', detail: 'debugging, planning, and code generation in one shell' },
]

const SOURCE_CARDS = [
  'SDK Overview / Python SDK',
  'x402 Gateway / Payment Flow',
  'Model Hub / Deployment Constraints',
]

const TERMINAL_PROMPTS = [
  'Explain x402 settlement flow for a FastAPI backend.',
  'Why is llm.ensure_opg_approval() failing on Base Sepolia?',
  'Design a TEE-backed due diligence agent using OpenGradient.',
  'Show me a minimal og.LLM streaming example with citations.',
]

export default function Home() {
  const navigate = useNavigate()
  const animatedPrompt = useTypewriter(TERMINAL_PROMPTS)

  const handleModeSelect = (modeId) => {
    navigate(`/chat?mode=${modeId}`)
  }

  return (
    <div className="home-screen">
      <div className="home-shell">
        <div className="home-toprail slide-up">
          <div className="home-toprail__left">
            <span className="home-status-dot pulse-dot" />
            <span className="home-toprail__label">Powered by OpenGradient TEE</span>
          </div>

          <div className="home-toprail__right">
            <span className="home-chip">Base Sepolia / x402</span>
            <span className="home-chip">Docs-grounded retrieval</span>
          </div>
        </div>

        <div className="home-main-grid">
          <section className="home-hero slide-up">
            <div className="home-brand-row">
              <span className="home-brand-mark">OG AI</span>
              <span className="home-brand-copy">OpenGradient builder copilot</span>
            </div>

            <div className="home-copy-stack">
              <span className="home-eyebrow">Research terminal for serious builders</span>
              <h1 className="home-headline">Docs-grounded answers, cleaner debugging, better OpenGradient builds.</h1>
              <p className="home-subheadline">
                OG AI helps developers interrogate the docs, unblock SDK issues, and turn rough product ideas into
                production-grade OpenGradient architecture.
              </p>
            </div>

            <div className="home-proof-row">
              <span className="home-proof-pill">TEE verified</span>
              <span className="home-proof-pill">x402 settled</span>
              <span className="home-proof-pill">Citations surfaced</span>
            </div>

            <div className="home-terminal-strip fade-in">
              <span className="home-terminal-strip__prompt">$ ask og-ai</span>
              <span className="home-terminal-strip__text">&quot;{animatedPrompt}&quot;<span className="cursor-blink" /></span>
            </div>

            <div className="home-action-row">
              <button className="home-button home-button--primary" onClick={() => navigate('/chat?mode=ask')}>
                Start in ask docs
                <ArrowIcon />
              </button>
              <button className="home-button home-button--secondary" onClick={() => navigate('/chat?mode=debug')}>
                Debug an integration
              </button>
            </div>

            <div className="home-signal-grid stagger">
              {SIGNALS.map((signal) => (
                <article key={signal.label} className="home-signal-card slide-up">
                  <span className="home-signal-label">{signal.label}</span>
                  <strong className="home-signal-value">{signal.value}</strong>
                  <p className="home-signal-detail">{signal.detail}</p>
                </article>
              ))}
            </div>
          </section>

          <section className="home-modes-panel slide-up" style={{ animationDelay: '90ms' }}>
            <div className="home-panel-heading">
              <div>
                <span className="home-panel-kicker">Operator modes</span>
                <h2 className="home-panel-title">Four entry points into the same OpenGradient workflow.</h2>
              </div>
              <span className="home-panel-meta">04 modules</span>
            </div>

            <div className="home-mode-grid stagger">
              {MODES.map((mode) => (
                <ModeCard key={mode.id} mode={mode} onClick={() => handleModeSelect(mode.id)} />
              ))}
            </div>
          </section>
        </div>

        <div className="home-preview-grid">
          <section className="home-panel home-panel--conversation slide-up" style={{ animationDelay: '150ms' }}>
            <div className="home-panel-heading home-panel-heading--tight">
              <div>
                <span className="home-panel-kicker">Product preview</span>
                <h2 className="home-panel-title">What a grounded answer feels like.</h2>
              </div>
              <span className="home-panel-meta">Live shell</span>
            </div>

            <div className="home-conversation-frame">
              <div className="home-message home-message--user">
                <span className="home-message-role">User</span>
                <p>What is the safest way to stream chat completions with the OpenGradient Python SDK?</p>
              </div>

              <div className="home-message home-message--assistant">
                <span className="home-message-role">OG AI</span>
                <p>
                  Use the async `llm.chat(..., stream=True)` flow, then iterate over the returned stream generator while
                  surfacing citations and settlement metadata in the UI.<span className="cursor-blink" />
                </p>
              </div>
            </div>

            <div className="home-source-strip">
              {SOURCE_CARDS.map((source) => (
                <span key={source} className="home-source-chip">
                  {source}
                </span>
              ))}
            </div>

            <div className="home-attestation-row">
              <div>
                <span className="home-attestation-label">Inference path</span>
                <strong>OpenGradient TEE / chat</strong>
              </div>
              <div>
                <span className="home-attestation-label">Proof handling</span>
                <strong>x402 + surfaced metadata</strong>
              </div>
            </div>
          </section>

          <div className="home-aside-stack">
            <section className="home-panel slide-up" style={{ animationDelay: '220ms' }}>
              <div className="home-panel-heading home-panel-heading--tight">
                <div>
                  <span className="home-panel-kicker">Best use cases</span>
                  <h2 className="home-panel-title">Where teams use OG AI first.</h2>
                </div>
              </div>

              <div className="home-list">
                <div className="home-list-item">
                  <span className="home-list-index">01</span>
                  <div>
                    <strong>Unblock deployment issues</strong>
                    <p>Trace CORS, approval, DNS, and environment mistakes before they burn more time.</p>
                  </div>
                </div>
                <div className="home-list-item">
                  <span className="home-list-index">02</span>
                  <div>
                    <strong>Choose the right OG primitive</strong>
                    <p>Match your product to TEE chat, Model Hub, or workflow infrastructure with less guesswork.</p>
                  </div>
                </div>
                <div className="home-list-item">
                  <span className="home-list-index">03</span>
                  <div>
                    <strong>Ship cleaner examples</strong>
                    <p>Use snippet mode to move from doc fragments to minimal working code faster.</p>
                  </div>
                </div>
              </div>
            </section>

            <section className="home-panel home-panel--system slide-up" style={{ animationDelay: '290ms' }}>
              <div className="home-system-row">
                <span>Runtime</span>
                <strong>OpenGradient-native</strong>
              </div>
              <div className="home-system-row">
                <span>Primary model</span>
                <strong>TEE LLM routing</strong>
              </div>
              <div className="home-system-row">
                <span>Answer style</span>
                <strong>Citations + implementation guidance</strong>
              </div>
              <div className="home-system-row">
                <span>Builder focus</span>
                <strong>SDK, x402, Model Hub, deployment</strong>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}

function ModeCard({ mode, onClick }) {
  return (
    <button className="home-mode-card slide-up" onClick={onClick} style={{ '--mode-color': mode.color }}>
      <div className="home-mode-card__top">
        <span className="home-mode-card__icon">{mode.icon}</span>
        <ArrowIcon />
      </div>

      <div className="home-mode-card__copy">
        <span className="home-mode-card__eyebrow">{mode.eyebrow}</span>
        <strong className="home-mode-card__title">{mode.label}</strong>
        <p className="home-mode-card__description">{mode.description}</p>
      </div>

      <div className="home-mode-card__footer">
        <span className="home-mode-card__example">{mode.example}</span>
        <span className="home-mode-card__action">{mode.action}</span>
      </div>
    </button>
  )
}

function ArrowIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M2 7h10M8 3l4 4-4 4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function useTypewriter(phrases) {
  const [phraseIndex, setPhraseIndex] = useState(0)
  const [text, setText] = useState('')
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    const current = phrases[phraseIndex]

    const timeout = setTimeout(() => {
      if (!isDeleting) {
        const next = current.slice(0, text.length + 1)
        setText(next)

        if (next === current) {
          setIsDeleting(true)
        }
      } else {
        const next = current.slice(0, text.length - 1)
        setText(next)

        if (next === '') {
          setIsDeleting(false)
          setPhraseIndex((prev) => (prev + 1) % phrases.length)
        }
      }
    }, text === current && !isDeleting ? 1500 : text === '' && isDeleting ? 260 : isDeleting ? 18 : 34)

    return () => clearTimeout(timeout)
  }, [text, isDeleting, phraseIndex, phrases])

  return text
}
