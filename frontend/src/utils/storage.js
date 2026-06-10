const SAVED_KEY = 'versefinder_saved'

export function getSaved() {
  try {
    return JSON.parse(localStorage.getItem(SAVED_KEY) || '[]')
  } catch { return [] }
}

export function saveItem(item) {
  const items = getSaved()
  const newItem = { ...item, id: Date.now(), savedAt: new Date().toISOString() }
  localStorage.setItem(SAVED_KEY, JSON.stringify([newItem, ...items]))
  return newItem
}

export function deleteItem(id) {
  const items = getSaved().filter(i => i.id !== id)
  localStorage.setItem(SAVED_KEY, JSON.stringify(items))
}

export function isAlreadySaved(reference) {
  return getSaved().some(i => i.reference === reference || i.type === 'prayer' && i.reference === reference)
}
