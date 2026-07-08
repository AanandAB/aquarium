/**
 * Themed placeholder imagery via LoremFlickr (real, keyword-matched photos).
 * These are stand-ins so the site looks alive on first run — every image is
 * replaceable from the admin Media Library. `lock` keeps a given card stable.
 */
export function img(keywords: string, lock: number, w = 900, h = 700): string {
  const kw = encodeURIComponent(keywords);
  return `https://loremflickr.com/${w}/${h}/${kw}/all?lock=${lock}`;
}

export function gallery(keywords: string, base: number, count = 3): string[] {
  return Array.from({ length: count }, (_, i) => img(keywords, base + i));
}
