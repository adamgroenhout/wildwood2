/**
 * Formats a URL with the base path from Astro's config.
 * Handles external links and already-formatted links gracefully.
 */
export const formatUrl = (url: string, base: string = import.meta.env.BASE_URL) => {
  if (!url || url === '#' || url.startsWith('http')) return url;
  
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

/**
 * Image asset resolver for dynamic CMS paths.
 * Uses Vite's import.meta.glob to find and return optimized image assets.
 */
const images = import.meta.glob<{ default: ImageMetadata }>('/src/assets/images/**/*.{jpeg,jpg,png,tiff,webp,gif,svg,avif}', { eager: true });

export const resolveAsset = (path: string) => {
  if (!path) return undefined;
  
  // Normalize path: Decap might save as "src/assets/images/img.jpg" or "/src/assets/images/img.jpg"
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  
  const asset = images[normalizedPath];
  if (!asset) {
    console.warn(`Asset not found: ${normalizedPath}`);
    return path; // Fallback to raw string if not found in glob
  }
  
  return asset.default;
};
