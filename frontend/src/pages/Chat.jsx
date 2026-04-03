import { useEffect, useRef, useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'
import Layout from '../components/layout/Layout'
import ChatMessage from '../components/chat/ChatMessage'
import ChatInput from '../components/chat/ChatInput'
import AttestationDrawer from '../components/chat/AttestationDrawer'
import { useChat } from '../hooks/useChat'

const SUGGESTIONS = {
  ask: [
    'How do I stream LLM responses with the OG SDK?',
    'What is ensure_opg_approval() and when do I call it?',
    'What models are available via og.TEE_LLM?',
    'How do x402 settlement modes differ?',
  ],
  debug: [
    'Permit2 approval error on startup',
    'Insufficient $OPG balance when calling llm.chat()',
    'chunk.choices[0].delta.content returns None',
    'ZKML inference fails with opset error',
  ],
  plan: [
    'I want to build a DeFi risk analyzer using on-chain ML',
    'Build an AI agent that monitors crypto prices and alerts me',
    'Create a medical documentation assistant with TEE privacy',
    'Build a decentralized AI API with payment per call',
  ],
  snippet: [
    'Show me a minimal LLM chat call with streaming',
    'Code for og.LLM chat with tool calling',
    'Example of deploying an ML workflow',
    'Show me the LangChain adapter setup',
  ],
}

export default function Chat() {
  const [searchParams] = useSearchParams()
  const {
    messages,
    isStreaming,
    currentMode,
    changeMode,
    attestation,
    drawerOpen,
    sendMessage,
    clearHistory,
    openAttestationDrawer,
    closeDrawer,
  } = useChat()

  const messagesEndRef = useRef(null)
  const pendingQuestionRef = useRef(null)

  useEffect(() => {
    const mode = searchParams.get('mode')
    if (mode && ['ask', 'debug', 'plan', 'snippet'].includes(mode)) {
      changeMode(mode)
    }
  }, [searchParams, changeMode])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  useEffect(() => {
    if (pendingQuestionRef.current) {
      const q = pendingQuestionRef.current
      pendingQuestionRef.current = null
      sendMessage(q)
    }
  })

  const handleQuestionClick = useCallback((question) => {
    sendMessage(question)
  }, [sendMessage])

  const suggestions = SUGGESTIONS[currentMode] || SUGGESTIONS.ask

  return (
    <>
      <Layout
        currentMode={currentMode}
        onModeChange={changeMode}
        onQuestionClick={handleQuestionClick}
        onClear={clearHistory}
      >
        <div
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: '24px 24px 8px',
            position: 'relative',
            zIndex: 1,
          }}
        >
          {messages.length === 0 ? (
            <EmptyState
              mode={currentMode}
              suggestions={suggestions}
              onSuggestion={sendMessage}
            />
          ) : (
            <>
              {messages.map((msg) => (
                <ChatMessage
                  key={msg.id}
                  role={msg.role}
                  content={msg.content}
                  sources={msg.sources}
                  paymentHash={msg.paymentHash}
                  isStreaming={msg.isStreaming}
                  onAttestationClick={(hash) =>
                    openAttestationDrawer(hash, 'GEMINI_2_5_FLASH')
                  }
                />
              ))}
              <div ref={messagesEndRef} />
            </>
          )}
        </div>

        <ChatInput
          onSend={sendMessage}
          isStreaming={isStreaming}
          currentMode={currentMode}
        />
      </Layout>

      <AttestationDrawer
        isOpen={drawerOpen}
        onClose={closeDrawer}
        paymentHash={attestation?.paymentHash}
        model={attestation?.model}
      />
    </>
  )
}

function EmptyState({ mode, suggestions, onSuggestion }) {
  const modeDescriptions = {
    ask: 'Ask anything about the OpenGradient SDK, x402 protocol, or developer docs.',
    debug: 'Paste an error or traceback and get a root-cause analysis with fix.',
    plan: 'Describe your app idea and get a structured OG architecture plan.',
    snippet: 'Request a working code snippet grounded in the opengradient==0.9.0 SDK.',
  }

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        minHeight: '400px',
        gap: '24px',
        padding: '40px 0',
      }}
    >
      <div
        style={{
          fontFamily: 'var(--font-ui)',
          fontWeight: 800,
          fontSize: '52px',
          color: 'rgba(255,255,255,0.06)',
          letterSpacing: '-0.04em',
          lineHeight: 1,
          userSelect: 'none',
        }}
      >
        OG AI
      </div>

      <div style={{ textAlign: 'center', maxWidth: '420px' }}>
        <p
          style={{
            fontFamily: 'var(--font-ui)',
            fontSize: '15px',
            color: 'var(--text-secondary)',
            marginBottom: '4px',
          }}
        >
          {modeDescriptions[mode]}
        </p>
        <p
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '10px',
            color: 'var(--text-muted)',
            letterSpacing: '0.08em',
          }}
        >
          CLICK A SUGGESTION OR TYPE BELOW
        </p>
      </div>

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '7px',
          width: '100%',
          maxWidth: '520px',
        }}
      >
        {suggestions.map((suggestion, i) => (
          <button
            key={i}
            onClick={() => onSuggestion(suggestion)}
            className="fade-in"
            style={{
              padding: '10px 14px',
              background: 'var(--bg-card)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '2px',
              cursor: 'pointer',
              fontFamily: 'var(--font-ui)',
              fontSize: '13px',
              color: 'var(--text-secondary)',
              textAlign: 'left',
              transition: 'all 150ms ease',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              animationDelay: `${i * 60}ms`,
              opacity: 0,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'var(--accent-border)'
              e.currentTarget.style.color = 'var(--text-primary)'
              e.currentTarget.style.background = 'var(--bg-elevated)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'var(--border-subtle)'
              e.currentTarget.style.color = 'var(--text-secondary)'
              e.currentTarget.style.background = 'var(--bg-card)'
            }}
          >
            {suggestion}
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ flexShrink: 0, marginLeft: '8px', color: 'var(--text-muted)' }}>
              <path d="M2 6h8M7 3l3 3-3 3" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        ))}
      </div>
    </div>
  )
}
