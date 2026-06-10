const BASE = import.meta.env.VITE_API_URL || ''

export async function seekGuidance(problem) {
  const res = await fetch(`${BASE}/api/seek`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ problem }),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.error || 'Something went wrong.')
  return data
}

export async function fetchDevotional() {
  const res = await fetch(`${BASE}/api/devotional`)
  if (!res.ok) throw new Error('Could not load devotional.')
  return res.json()
}

export async function searchTopic(topic) {
  const res = await fetch(`${BASE}/api/search`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ topic }),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.error || 'Search failed.')
  return data
}
