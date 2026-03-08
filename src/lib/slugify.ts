export function slugify(text: string): string {
  const slug = text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // remove accents
    .replace(/[\u{1F000}-\u{1FFFF}]/gu, '') // remove emojis
    .replace(/[\u{2600}-\u{27BF}]/gu, '') // remove misc symbols
    .replace(/[\u{FE00}-\u{FEFF}]/gu, '') // remove variation selectors
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60)
  return slug || 'song'
}

/** Build a URL-friendly path: /songs/mi-cancion-e6a8b252-1234-5678-9abc-def012345678 */
export function songPath(song: { id: string; title: string }): string {
  const slug = slugify(song.title)
  return `/songs/${slug}-${song.id}`
}

/** Extract full UUID from route param */
export function extractId(param: string): string {
  // Try to find a full UUID anywhere in the string
  const match = param.match(/([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})/i)
  if (match) return match[1]
  // Fallback: treat entire param as ID
  return param
}
