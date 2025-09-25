// src/services/unsplash.service.js
import env from '../config/env.js'
import { AppError } from '../utils/error.js'

const BASE = 'https://api.unsplash.com/search/photos'

export async function searchImages(query, page = 1, perPage = 12, opts = {}) {
  const key = env.UNSPLASH_KEY 
  if (!key) {
    // Si no hay key, responde un demo controlado (útil en dev/test)
    return {
      total: 1,
      results: [{
        id: 'demo-1',
        description: `Demo image for '${query}'`,
        urls: { small: 'https://images.unsplash.com/photo-1527443154391-507e9dc6c5cc?w=400' },
        user: { name: 'Unsplash Demo' }
      }]
    }
  }

  // Normaliza parámetros
  const safePage = Math.max(1, Number(page) || 1)
  const safePerPage = Math.min(30, Math.max(1, Number(perPage) || 12))

  const qs = new URLSearchParams({
    query: String(query ?? ''),
    page: String(safePage),
    per_page: String(safePerPage),
  })

  // Opcionales
  if (opts.orientation) qs.set('orientation', opts.orientation)      // landscape|portrait|squarish
  if (opts.color) qs.set('color', opts.color)                        // black_and_white|white|black|...
  if (opts.contentFilter) qs.set('content_filter', opts.contentFilter) // low|high

  // Timeout opcional
  const ac = new AbortController()
  const t = setTimeout(() => ac.abort(), 8000)

  try {
    const res = await fetch(`${BASE}?${qs.toString()}`, {
      headers: {
        Authorization: `Client-ID ${key}`,
        'Accept-Version': 'v1'
      },
      signal: ac.signal
    })
    if (!res.ok) {
      const text = await res.text().catch(() => '')
      throw new AppError('Unsplash upstream error', 502, { status: res.status, body: text.slice(0, 300) })
    }
    return await res.json()
  } catch (e) {
    if (e.name === 'AbortError') throw new AppError('Unsplash timeout', 504)
    throw e
  } finally {
    clearTimeout(t)
  }
}
