/**
 * Formats a URL with the base path from Astro's config.
 * Handles external links and already-formatted links gracefully.
 */
export const formatUrl = (url: string, base: string = '/') => {
  if (!url || url.startsWith('#') || url.startsWith('http') || url.startsWith('mailto:') || url.startsWith('tel:')) return url;

  // Ensure base ends with a single slash
  const normalizedBase = base.endsWith('/') ? base : `${base}/`;

  // If url already starts with the base, return it
  if (url.startsWith(normalizedBase)) return url;

  // Also check if url starts with base without trailing slash (e.g. /wildwood)
  const baseNoTrailing = normalizedBase.slice(0, -1);
  if (url.startsWith(baseNoTrailing) && (url[baseNoTrailing.length] === '/' || url[baseNoTrailing.length] === undefined)) {
    return url;
  }

  const normalizedUrl = url.startsWith('/') ? url.slice(1) : url;
  return `${normalizedBase}${normalizedUrl}`;
};
