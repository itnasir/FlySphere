export function scrollToSectionId(id) {
  const cleanId = id.replace(/^#/, '')
  const el = document.getElementById(cleanId)
  if (el) {
    const headerOffset = 84
    const y = el.getBoundingClientRect().top + window.scrollY - headerOffset
    window.scrollTo({ top: Math.max(0, y), behavior: 'smooth' })
    return true
  }
  return false
}
