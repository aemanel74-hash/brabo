/**
 * Helper utility to optimize and compress image URLs for Lite Mode (Hemat Kuota)
 * Supports dynamic URL param tuning for Unsplash and external CDNs,
 * and handles smart downsampling for rural slow-connection environments.
 */

export interface ImageOptimizationOptions {
  width?: number;
  height?: number;
  quality?: number;
  isLiteMode?: boolean;
  format?: 'webp' | 'jpg' | 'auto';
}

/**
 * Optimizes an image URL for the requested quality/mode.
 * In Lite Mode, automatically reduces image resolution and compression quality to minimize payload.
 */
export function getOptimizedImageUrl(
  url: string | undefined | null,
  options: ImageOptimizationOptions = {}
): string {
  if (!url) return '';

  const {
    width,
    height,
    quality,
    isLiteMode = false,
    format = 'auto',
  } = options;

  // If already a base64 data url, return directly (can't rewrite query params)
  if (url.startsWith('data:')) {
    return url;
  }

  try {
    // 1. Unsplash Optimization (Heavily used in modern web apps)
    if (url.includes('images.unsplash.com')) {
      const parsedUrl = new URL(url);
      
      if (isLiteMode) {
        // Lite Mode: very lightweight WebP thumbnail
        const liteWidth = width ? Math.min(width, 360) : 360;
        parsedUrl.searchParams.set('w', liteWidth.toString());
        if (height) {
          const liteHeight = Math.min(height, 240);
          parsedUrl.searchParams.set('h', liteHeight.toString());
        }
        parsedUrl.searchParams.set('q', (quality ?? 35).toString());
        parsedUrl.searchParams.set('auto', 'format');
        parsedUrl.searchParams.set('fit', 'crop');
      } else {
        // Standard Mode
        if (width) parsedUrl.searchParams.set('w', width.toString());
        if (height) parsedUrl.searchParams.set('h', height.toString());
        parsedUrl.searchParams.set('q', (quality ?? 75).toString());
        parsedUrl.searchParams.set('auto', 'format');
      }

      return parsedUrl.toString();
    }

    // 2. Generic CDN query params if supported
    if (url.includes('cloudinary.com') || url.includes('imgix.net')) {
      const parsedUrl = new URL(url);
      if (isLiteMode) {
        parsedUrl.searchParams.set('w', (width ? Math.min(width, 360) : 360).toString());
        parsedUrl.searchParams.set('q', '35');
      }
      return parsedUrl.toString();
    }

    return url;
  } catch {
    return url;
  }
}

/**
 * Format bytes into human readable KB / MB
 */
export function formatBytes(bytes: number, decimals: number = 1): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}
