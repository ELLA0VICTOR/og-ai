/**
 * Truncate a string to maxLen characters, appending ellipsis if needed.
 */
export function truncate(str, maxLen = 40) {
  if (!str) return ''
  return str.length > maxLen ? str.slice(0, maxLen - 1) + '…' : str
}

/**
 * Truncate an Ethereum address/hash for display.
 * e.g. 0x4f2a...b91c
 */
export function truncateHash(hash, start = 6, end = 4) {
  if (!hash) return ''
  if (hash.length <= start + end + 3) return hash
  return `${hash.slice(0, start)}...${hash.slice(-end)}`
}

/**
 * Parse a raw text string and split it into segments of plain text and code blocks.
 * Returns array of { type: 'text'|'code', content, language? }
 */
export function parseContent(text) {
  if (!text) return []
  const segments = []
  const codeBlockRegex = /```(\w+)?\n?([\s\S]*?)```/g
  let lastIndex = 0
  let match

  while ((match = codeBlockRegex.exec(text)) !== null) {
    // Text before code block
    if (match.index > lastIndex) {
      segments.push({ type: 'text', content: text.slice(lastIndex, match.index) })
    }
    // Code block
    segments.push({
      type: 'code',
      language: match[1] || 'text',
      content: match[2].trim(),
    })
    lastIndex = match.index + match[0].length
  }

  // Remaining text after last code block
  if (lastIndex < text.length) {
    segments.push({ type: 'text', content: text.slice(lastIndex) })
  }

  return segments.length > 0 ? segments : [{ type: 'text', content: text }]
}

/**
 * Parse inline code (`...`) within a text string.
 * Returns array of { type: 'plain'|'inline_code', content }
 */
export function parseInlineCode(text) {
  if (!text) return []
  const parts = []
  const regex = /`([^`]+)`/g
  let lastIndex = 0
  let match

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push({ type: 'plain', content: text.slice(lastIndex, match.index) })
    }
    parts.push({ type: 'inline_code', content: match[1] })
    lastIndex = match.index + match[0].length
  }

  if (lastIndex < text.length) {
    parts.push({ type: 'plain', content: text.slice(lastIndex) })
  }

  return parts.length > 0 ? parts : [{ type: 'plain', content: text }]
}

/**
 * Format a mode key to a display label.
 */
export function modeLabel(mode) {
  const labels = {
    ask: 'ASK DOCS',
    debug: 'DEBUG',
    plan: 'BUILD PLAN',
    snippet: 'SNIPPET',
  }
  return labels[mode] || mode.toUpperCase()
}

export function modeName(mode) {
  const names = {
    ask: 'Ask Docs',
    debug: 'Debug Error',
    plan: 'Build Planner',
    snippet: 'Snippet Mode',
  }
  return names[mode] || mode
}
