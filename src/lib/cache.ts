const CACHE_PREFIX = 'mychords_'

interface CacheEntry<T> {
  data: T
  timestamp: number
}

export function getCached<T>(key: string): CacheEntry<T> | null {
  try {
    const raw = localStorage.getItem(CACHE_PREFIX + key)
    if (!raw) return null
    return JSON.parse(raw) as CacheEntry<T>
  } catch {
    return null
  }
}

export function setCache<T>(key: string, data: T): void {
  try {
    const entry: CacheEntry<T> = { data, timestamp: Date.now() }
    localStorage.setItem(CACHE_PREFIX + key, JSON.stringify(entry))
  } catch {
    // localStorage full — clear old caches (except saved songs) and retry once
    clearVolatileCaches()
    try {
      const entry: CacheEntry<T> = { data, timestamp: Date.now() }
      localStorage.setItem(CACHE_PREFIX + key, JSON.stringify(entry))
    } catch {
      // still full, silently fail
    }
  }
}

export function removeCache(key: string): void {
  localStorage.removeItem(CACHE_PREFIX + key)
}

/** Clear only volatile caches (not saved songs) */
function clearVolatileCaches(): void {
  const keys = Object.keys(localStorage).filter(
    k => k.startsWith(CACHE_PREFIX) && !k.includes('saved_songs')
  )
  keys.forEach(k => localStorage.removeItem(k))
}
