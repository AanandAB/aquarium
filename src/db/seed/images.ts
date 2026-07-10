/**
 * Reliable stable placeholder imagery. Uses picsum.photos (stable per `lock`
 * seed, always 200) instead of loremflickr, whose ?lock= endpoint returns 500.
 * These are stand-ins; replace any image from the admin (URL or upload).
 */
export function img(keywords: string, lock: number, w = 900, h = 700): string {
  return `https://picsum.photos/seed/aqua${lock}/${w}/${h}`;
}

export function gallery(keywords: string, base: number, count = 3): string[] {
  return Array.from({ length: count }, (_, i) => img(keywords, base + i));
}
