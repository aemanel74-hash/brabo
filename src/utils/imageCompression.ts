/**
 * Image Compression Utility for Browser
 * Compresses images before saving or uploading to keep database and local storage lightweight.
 */

export interface CompressionOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number; // 0.1 to 1.0
  format?: 'image/webp' | 'image/jpeg' | 'image/png';
}

export interface CompressionResult {
  dataUrl: string;
  originalSize: number; // in bytes
  compressedSize: number; // in bytes
  originalWidth: number;
  originalHeight: number;
  compressedWidth: number;
  compressedHeight: number;
  compressionRatio: number; // percentage saved, e.g. 85.5
  format: string;
}

export const compressImage = (
  file: File,
  options: CompressionOptions = {}
): Promise<CompressionResult> => {
  const {
    maxWidth = 1200,
    maxHeight = 1200,
    quality = 0.78,
    format = 'image/webp',
  } = options;

  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      const img = new Image();

      img.onload = () => {
        let width = img.width;
        let height = img.height;
        const originalWidth = width;
        const originalHeight = height;

        // Calculate new dimensions while preserving aspect ratio
        if (width > maxWidth || height > maxHeight) {
          if (width / height > maxWidth / maxHeight) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          } else {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        // Draw onto HTML5 Canvas
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Canvas 2D context not available'));
          return;
        }

        // Use high quality image smoothing
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';

        // Draw image onto canvas
        ctx.drawImage(img, 0, 0, width, height);

        // Convert canvas to Data URL with chosen format and quality
        let outputFormat = format;
        let dataUrl = '';
        
        try {
          dataUrl = canvas.toDataURL(outputFormat, quality);
          // If browser does not support webp canvas export, fallback to jpeg
          if (outputFormat === 'image/webp' && !dataUrl.startsWith('data:image/webp')) {
            outputFormat = 'image/jpeg';
            dataUrl = canvas.toDataURL(outputFormat, quality);
          }
        } catch {
          outputFormat = 'image/jpeg';
          dataUrl = canvas.toDataURL(outputFormat, quality);
        }

        // Calculate approximate size in bytes from base64 string
        const base64Length = dataUrl.length - (dataUrl.indexOf(',') + 1);
        const compressedSize = Math.round((base64Length * 3) / 4);
        const originalSize = file.size;
        const savedPercent = Math.max(0, Math.round(((originalSize - compressedSize) / originalSize) * 100));

        resolve({
          dataUrl,
          originalSize,
          compressedSize,
          originalWidth,
          originalHeight,
          compressedWidth: width,
          compressedHeight: height,
          compressionRatio: savedPercent,
          format: outputFormat.split('/')[1]?.toUpperCase() || 'WEBP',
        });
      };

      img.onerror = () => {
        reject(new Error('Failed to load image for compression'));
      };

      img.src = e.target?.result as string;
    };

    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };

    reader.readAsDataURL(file);
  });
};

/**
 * Format bytes to readable string (e.g. 1.2 MB or 240 KB)
 */
export const formatBytes = (bytes: number, decimals = 1): string => {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
};
