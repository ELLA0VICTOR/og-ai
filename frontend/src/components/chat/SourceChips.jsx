import { truncate } from '../../lib/utils'

export default function SourceChips({ sources = [] }) {
  if (!sources || sources.length === 0) return null

  return (
    <div className="source-chip-list">
      {sources.map((source) => (
        <button
          key={source.id}
          onClick={() => window.open(source.url, '_blank', 'noopener,noreferrer')}
          title={`${source.section} - ${source.title}\n${source.url}`}
          className="source-chip-button"
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = 'var(--accent-border)'
            e.currentTarget.style.color = 'var(--accent)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = 'var(--border-subtle)'
            e.currentTarget.style.color = 'var(--text-muted)'
          }}
        >
          <svg width="8" height="8" viewBox="0 0 8 8" fill="none" stroke="currentColor" strokeWidth="1.2">
            <path d="M3 1H1v6h6V5M5 1h2v2M7 1L4 4" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          {truncate(`${source.section} - ${source.title}`, 42)}
        </button>
      ))}
    </div>
  )
}
