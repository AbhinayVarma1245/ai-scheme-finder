// All API calls go through this helper.
// In development: Vite proxies /api → localhost:3001 (no env var needed)
// In production:  Set VITE_API_URL=https://your-backend.onrender.com in your host's dashboard

const BASE = import.meta.env.VITE_API_URL ?? ''

export async function apiFetch(path, options = {}) {
  const res = await fetch(`${BASE}${path}`, options)
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }))
    throw new Error(err.error || 'Request failed')
  }
  return res.json()
}
