/**
 * Formats a URL with the base path from Astro's config.
 * Handles external links and already-formatted links gracefully.
 */
export const formatUrl = (url: string, base: string = import.meta.env.BASE_URL) => {
  if (!url || url === '#' || url.startsWith('http')) return url;
  if (url.startsWith(base)) return url;
  
  const normalizedUrl = url.startsWith('/') ? url.slice(1) : url;
  return `${base}${normalizedUrl}`;
};
