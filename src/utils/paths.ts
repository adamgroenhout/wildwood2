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
 * We use a relative glob to the paths.ts file to ensure keys are consistent.
 * src/utils/paths.ts -> ../assets/images/
 */
const images = import.meta.glob<{ default: ImageMetadata }>('../assets/images/**/*.{jpeg,jpg,png,tiff,webp,gif,svg,avif}', { eager: true });

export const resolveAsset = (path: string) => {
  if (!path) return undefined;
  
  // Clean the path coming from CMS
  // 1. Remove leading slash if it exists
  // 2. Remove "src/" or "/src/" prefix if it exists
  let cleanPath = path.replace(/^\//, '').replace(/^src\//, '');
  
  // Now our path looks like "assets/images/filename.webp"
  // But the glob keys (using ../) look like "../assets/images/filename.webp"
  const globKey = `../${cleanPath}`;
  
  const asset = images[globKey];
  
  if (!asset) {
    // During dev, this warning is helpful. In prod it will be silent but return the string.
    if (import.meta.env.DEV) {
      console.warn(`Asset not found: ${globKey}. Available keys:`, Object.keys(images).slice(0, 5));
    }
    return path; 
  }
  
  return asset.default;
};
