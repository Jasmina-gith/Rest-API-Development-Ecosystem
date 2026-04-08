export const translateOutput = (raw, contentType = 'text/plain') => {
  try {
    if (contentType.includes('json')) {
      const parsed = JSON.parse(raw)
      return JSON.stringify(parsed, null, 2)
    }
    if (contentType.includes('html') || contentType.includes('xml')) {
      return raw // Syntax highlighter will handle
    }
    if (contentType.includes('text')) {
      return raw
    }
    return raw
  } catch {
    return raw
  }
}

// For syntax highlighter language
export const getLanguage = (contentType) => {
  if (contentType.includes('json')) return 'json'
  if (contentType.includes('html') || contentType.includes('xml')) return 'xml'
  if (contentType.includes('javascript')) return 'javascript'
  if (contentType.includes('css')) return 'css'
  return 'text'
}
