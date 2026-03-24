import { formatUrl as baseFormatUrl } from './url.ts';

/**
 * Formats a URL with the base path from Astro's config.
 * Handles external links and already-formatted links gracefully.
 */
export const formatUrl = (url: string, base: string = import.meta.env?.BASE_URL || '/') => {
  return baseFormatUrl(url, base);
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
    if (import.meta.env?.DEV) {
      console.warn(`Asset not found: ${globKey}. Available keys:`, Object.keys(images).slice(0, 5));
    }
    return path; 
  }
  
  return asset.default;
};
