export function slugify(text: string): string {
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // remove accents
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60)
}

/** Build a URL-friendly path: /songs/mi-cancion-abc12345 */
export function songPath(song: { id: string; title: string }): string {
  const slug = slugify(song.title)
  const shortId = song.id.replace(/-/g, '').slice(0, 8)
  return `/songs/${slug}-${shortId}`
}

/** Extract UUID from route param. Tries to find it via Supabase query. */
export function extractShortId(param: string): string {
  // If it's a full UUID, return as-is
  if (/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(param)) {
    return param
  }
  // Extract last 8 hex chars (the short ID)
  const match = param.match(/([0-9a-f]{8})$/i)
  return match ? match[1] : param
}
