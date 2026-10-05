import JSZip from 'jszip';
import { ProcessedImageItem } from '../types';

export interface ImageProcessingOptions {
  // Mode & Presets
  presetId?: string;
  // Dimensions
  resizeMode: 'none' | 'fit' | 'fill' | 'exact' | 'crop' | 'max';
  unit: 'pixels' | 'percentage';
  targetWidth: number;
  targetHeight: number;
  percentageScale: number;
  lockAspectRatio: boolean;
  allowEnlargement: boolean;
  doNotEnlargeSmaller: boolean;

  // Crop
  cropMode: 'none' | 'free' | 'center' | 'fixed-ratio';
  cropAspectRatio?: string; // e.g. "1:1", "4:5", "16:9"

  // Background
  backgroundType: 'transparent' | 'white' | 'black' | 'custom' | 'gradient';
  customColor: string;
  gradientStart?: string;
  gradientEnd?: string;

  // Format & Quality
  outputFormat: 'jpg' | 'png' | 'webp' | 'avif' | 'original';
  quality: number; // 0 - 100
  compressionLevel: 'lossless' | 'high' | 'balanced' | 'max';

  // Rotation & Flip
  rotation: 0 | 90 | 180 | 270;
  flipHorizontal: boolean;
  flipVertical: boolean;

  // Watermark
  watermarkEnabled: boolean;
  watermarkType: 'text' | 'image';
  watermarkText: string;
  watermarkPosition: 'top-left' | 'top-center' | 'top-right' | 'center' | 'bottom-left' | 'bottom-center' | 'bottom-right';
  watermarkOpacity: number; // 0 - 1
  watermarkColor: string;
  watermarkFontSize: number;
  watermarkImageElement?: HTMLImageElement | null;
  watermarkImageScale?: number; // 0.1 - 1.0

  // Metadata
  stripMetadata: boolean;

  // Filename
  namingRule: 'original' | 'prefix' | 'suffix' | 'sequential';
  prefix: string;
  suffix: string;
  replaceSpaces: 'keep' | 'dash' | 'underscore';
  caseTransform: 'keep' | 'lowercase' | 'uppercase';
}

export const DEFAULT_PROCESSING_OPTIONS: ImageProcessingOptions = {
  resizeMode: 'none',
  unit: 'pixels',
  targetWidth: 1080,
  targetHeight: 1080,
  percentageScale: 100,
  lockAspectRatio: true,
  allowEnlargement: false,
  doNotEnlargeSmaller: true,

  cropMode: 'none',
  cropAspectRatio: '1:1',

  backgroundType: 'white',
  customColor: '#FFFFFF',
  gradientStart: '#102A36',
  gradientEnd: '#0799A6',

  outputFormat: 'webp',
  quality: 85,
  compressionLevel: 'balanced',

  rotation: 0,
  flipHorizontal: false,
  flipVertical: false,

  watermarkEnabled: false,
  watermarkType: 'text',
  watermarkText: 'GurucraftPro',
  watermarkPosition: 'bottom-right',
  watermarkOpacity: 0.6,
  watermarkColor: '#FFFFFF',
  watermarkFontSize: 24,

  stripMetadata: true,

  namingRule: 'original',
  prefix: '',
  suffix: '-optimized',
  replaceSpaces: 'dash',
  caseTransform: 'keep',
};

// Check if browser supports AVIF export in canvas
let isAvifSupportedCached: boolean | null = null;
export function isAvifCanvasSupported(): boolean {
  if (isAvifSupportedCached !== null) return isAvifSupportedCached;
  try {
    const canvas = document.createElement('canvas');
    canvas.width = 1;
    canvas.height = 1;
    const dataUrl = canvas.toDataURL('image/avif');
    isAvifSupportedCached = dataUrl.startsWith('data:image/avif');
  } catch {
    isAvifSupportedCached = false;
  }
  return isAvifSupportedCached;
}

// Check if browser supports WebP export in canvas
let isWebpSupportedCached: boolean | null = null;
export function isWebpCanvasSupported(): boolean {
  if (isWebpSupportedCached !== null) return isWebpSupportedCached;
  try {
    const canvas = document.createElement('canvas');
    canvas.width = 1;
    canvas.height = 1;
    const dataUrl = canvas.toDataURL('image/webp');
    isWebpSupportedCached = dataUrl.startsWith('data:image/webp');
  } catch {
    isWebpSupportedCached = false;
  }
  return isWebpSupportedCached;
}

// Parse image file into Image object with metadata
export function loadImageFromFile(file: File): Promise<{
  img: HTMLImageElement;
  width: number;
  height: number;
  format: string;
  previewUrl: string;
}> {
  return new Promise((resolve, reject) => {
    const previewUrl = URL.createObjectURL(file);
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      let format = file.type ? file.type.replace('image/', '') : '';
      if (!format) {
        const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg';
        format = ext;
      }
      resolve({
        img,
        width: img.naturalWidth || img.width,
        height: img.naturalHeight || img.height,
        format,
        previewUrl,
      });
    };
    img.onerror = (err) => {
      URL.revokeObjectURL(previewUrl);
      reject(new Error(`Failed to load image "${file.name}". File might be corrupted or unreadable.`));
    };
    img.src = previewUrl;
  });
}

// Calculate new dimensions according to options
export function calculateOutputDimensions(
  origW: number,
  origH: number,
  options: ImageProcessingOptions
): { width: number; height: number; cropX: number; cropY: number; cropW: number; cropH: number } {
  let targetW = origW;
  let targetH = origH;
  let cropX = 0;
  let cropY = 0;
  let cropW = origW;
  let cropH = origH;

  // Percentage resize
  if (options.unit === 'percentage' && options.percentageScale > 0) {
    const factor = options.percentageScale / 100;
    targetW = Math.max(1, Math.round(origW * factor));
    targetH = Math.max(1, Math.round(origH * factor));
    return { width: targetW, height: targetH, cropX: 0, cropY: 0, cropW: origW, cropH: origH };
  }

  // Handle Crop Modes if specified
  if (options.cropMode === 'fixed-ratio' && options.cropAspectRatio) {
    const parts = options.cropAspectRatio.split(':').map(Number);
    if (parts.length === 2 && parts[0] > 0 && parts[1] > 0) {
      const ratio = parts[0] / parts[1];
      const currentRatio = origW / origH;
      if (currentRatio > ratio) {
        cropW = Math.round(origH * ratio);
        cropH = origH;
        cropX = Math.round((origW - cropW) / 2);
        cropY = 0;
      } else {
        cropW = origW;
        cropH = Math.round(origW / ratio);
        cropX = 0;
        cropY = Math.round((origH - cropH) / 2);
      }
    }
  }

  if (options.resizeMode === 'none') {
    return { width: cropW, height: cropH, cropX, cropY, cropW, cropH };
  }

  let reqW = Math.max(1, options.targetWidth || origW);
  let reqH = Math.max(1, options.targetHeight || origH);

  // If do not enlarge smaller
  if (options.doNotEnlargeSmaller && !options.allowEnlargement) {
    if (origW <= reqW && origH <= reqH && options.resizeMode !== 'fill') {
      return { width: cropW, height: cropH, cropX, cropY, cropW, cropH };
    }
  }

  switch (options.resizeMode) {
    case 'max': {
      // Scale down proportionally if either exceeds max
      const scaleX = reqW / cropW;
      const scaleY = reqH / cropH;
      const minScale = Math.min(scaleX, scaleY, 1.0);
      targetW = Math.max(1, Math.round(cropW * minScale));
      targetH = Math.max(1, Math.round(cropH * minScale));
      break;
    }
    case 'fit': {
      // Fit within target bounds preserving aspect ratio
      const scaleX = reqW / cropW;
      const scaleY = reqH / cropH;
      const scale = Math.min(scaleX, scaleY);
      targetW = Math.max(1, Math.round(cropW * scale));
      targetH = Math.max(1, Math.round(cropH * scale));
      break;
    }
    case 'fill': {
      // Cover entire box; canvas will be reqW x reqH, image scaled to cover
      targetW = reqW;
      targetH = reqH;
      break;
    }
    case 'exact': {
      // Exact dimensions (may distort if lockAspectRatio is false)
      if (options.lockAspectRatio) {
        const scaleX = reqW / cropW;
        const scaleY = reqH / cropH;
        const scale = Math.min(scaleX, scaleY);
        targetW = Math.max(1, Math.round(cropW * scale));
        targetH = Math.max(1, Math.round(cropH * scale));
      } else {
        targetW = reqW;
        targetH = reqH;
      }
      break;
    }
    case 'crop': {
      // Crop to exact reqW x reqH
      targetW = reqW;
      targetH = reqH;
      break;
    }
    default:
      targetW = cropW;
      targetH = cropH;
  }

  return { width: targetW, height: targetH, cropX, cropY, cropW, cropH };
}

// Generate the formatted output filename
export function formatOutputFilename(
  originalFilename: string,
  index: number,
  outputFormat: string,
  options: ImageProcessingOptions
): string {
  const parts = originalFilename.split('.');
  let baseName = parts.slice(0, -1).join('.') || originalFilename;

  // Space replacement
  if (options.replaceSpaces === 'dash') {
    baseName = baseName.replace(/\s+/g, '-');
  } else if (options.replaceSpaces === 'underscore') {
    baseName = baseName.replace(/\s+/g, '_');
  }

  // Case transform
  if (options.caseTransform === 'lowercase') {
    baseName = baseName.toLowerCase();
  } else if (options.caseTransform === 'uppercase') {
    baseName = baseName.toUpperCase();
  }

  // Naming rule
  let finalBase = baseName;
  if (options.namingRule === 'sequential') {
    const seqNum = String(index + 1).padStart(3, '0');
    finalBase = `${options.prefix ? options.prefix + '_' : ''}${baseName}_${seqNum}`;
  } else if (options.namingRule === 'prefix') {
    finalBase = `${options.prefix}${baseName}`;
  } else if (options.namingRule === 'suffix') {
    finalBase = `${baseName}${options.suffix}`;
  } else {
    // original with optional suffix if present
    if (options.suffix && options.suffix !== '-optimized') {
      finalBase = `${baseName}${options.suffix}`;
    }
  }

  // Determine file extension
  let ext = outputFormat.toLowerCase();
  if (ext === 'original') {
    ext = parts.pop()?.toLowerCase() || 'jpg';
  }
  if (ext === 'jpeg') ext = 'jpg';

  return `${finalBase}.${ext}`;
}

// Core single image processor function using Canvas
export async function processSingleImage(
  item: ProcessedImageItem,
  index: number,
  options: ImageProcessingOptions
): Promise<{
  blob: Blob;
  outputUrl: string;
  outputWidth: number;
  outputHeight: number;
  outputSizeBytes: number;
  outputFormat: string;
  outputFileName: string;
  savedBytes: number;
  savedPercentage: number;
}> {
  // 1. Load image
  const { img, width: origW, height: origH } = await loadImageFromFile(item.file);

  // 2. Calculate dimensions & crop
  const { width: targetW, height: targetH, cropX, cropY, cropW, cropH } = calculateOutputDimensions(
    origW,
    origH,
    options
  );

  // 3. Create canvas
  const canvas = document.createElement('canvas');
  canvas.width = targetW;
  canvas.height = targetH;
  const ctx = canvas.getContext('2d', { willReadFrequently: false });
  if (!ctx) {
    throw new Error('Canvas 2D context could not be created');
  }

  // Enable high-quality image smoothing
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';

  // 4. Draw background if applicable
  if (options.backgroundType !== 'transparent') {
    if (options.backgroundType === 'white') {
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, targetW, targetH);
    } else if (options.backgroundType === 'black') {
      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, targetW, targetH);
    } else if (options.backgroundType === 'custom') {
      ctx.fillStyle = options.customColor || '#FFFFFF';
      ctx.fillRect(0, 0, targetW, targetH);
    } else if (options.backgroundType === 'gradient') {
      const grad = ctx.createLinearGradient(0, 0, targetW, targetH);
      grad.addColorStop(0, options.gradientStart || '#102A36');
      grad.addColorStop(1, options.gradientEnd || '#0799A6');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, targetW, targetH);
    }
  }

  // 5. Draw Image with Rotation & Flip
  ctx.save();

  // Handle fill/cover vs fit inside canvas
  if (options.resizeMode === 'fill') {
    // Cover the canvas
    const scale = Math.max(targetW / cropW, targetH / cropH);
    const drawW = cropW * scale;
    const drawH = cropH * scale;
    const drawX = (targetW - drawW) / 2;
    const drawY = (targetH - drawH) / 2;

    applyTransforms(ctx, targetW, targetH, options);
    ctx.drawImage(img, cropX, cropY, cropW, cropH, drawX, drawY, drawW, drawH);
  } else {
    // Normal centered fit
    const drawX = (targetW - targetW) / 2;
    const drawY = (targetH - targetH) / 2;

    applyTransforms(ctx, targetW, targetH, options);
    ctx.drawImage(img, cropX, cropY, cropW, cropH, 0, 0, targetW, targetH);
  }

  ctx.restore();

  // 6. Draw Watermark if enabled
  if (options.watermarkEnabled) {
    drawWatermark(ctx, targetW, targetH, options);
  }

  // 7. Resolve export format and MIME type
  let mimeType = 'image/jpeg';
  let finalFormat = 'jpg';

  const requestedFormat = options.outputFormat === 'original' ? item.originalFormat.toLowerCase() : options.outputFormat;

  if (requestedFormat === 'png') {
    mimeType = 'image/png';
    finalFormat = 'png';
  } else if (requestedFormat === 'webp') {
    if (isWebpCanvasSupported()) {
      mimeType = 'image/webp';
      finalFormat = 'webp';
    } else {
      mimeType = 'image/jpeg';
      finalFormat = 'jpg';
    }
  } else if (requestedFormat === 'avif') {
    if (isAvifCanvasSupported()) {
      mimeType = 'image/avif';
      finalFormat = 'avif';
    } else {
      // Fallback to webp or jpeg if browser lacks AVIF canvas encoding
      mimeType = isWebpCanvasSupported() ? 'image/webp' : 'image/jpeg';
      finalFormat = isWebpCanvasSupported() ? 'webp' : 'jpg';
    }
  } else {
    mimeType = 'image/jpeg';
    finalFormat = 'jpg';
  }

  // Quality calculation
  let qualityVal = options.quality / 100;
  if (options.compressionLevel === 'lossless') {
    qualityVal = 1.0;
  } else if (options.compressionLevel === 'max') {
    qualityVal = Math.min(qualityVal, 0.65);
  } else if (options.compressionLevel === 'balanced') {
    qualityVal = Math.min(qualityVal, 0.82);
  }

  // 8. Export to Blob
  const blob: Blob = await new Promise((resolve, reject) => {
    canvas.toBlob(
      (b) => {
        if (b) resolve(b);
        else reject(new Error('Failed to generate image blob from canvas'));
      },
      mimeType,
      qualityVal
    );
  });

  const outputUrl = URL.createObjectURL(blob);
  const outputSizeBytes = blob.size;
  const savedBytes = Math.max(0, item.originalSizeBytes - outputSizeBytes);
  const savedPercentage =
    item.originalSizeBytes > 0 ? Math.round((savedBytes / item.originalSizeBytes) * 100) : 0;
  const outputFileName = formatOutputFilename(item.name, index, finalFormat, options);

  return {
    blob,
    outputUrl,
    outputWidth: targetW,
    outputHeight: targetH,
    outputSizeBytes,
    outputFormat: finalFormat,
    outputFileName,
    savedBytes,
    savedPercentage,
  };
}

// Helper: Apply canvas rotation & flip transforms
function applyTransforms(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  options: ImageProcessingOptions
) {
  if (options.rotation === 0 && !options.flipHorizontal && !options.flipVertical) {
    return;
  }
  ctx.translate(width / 2, height / 2);
  if (options.rotation !== 0) {
    ctx.rotate((options.rotation * Math.PI) / 180);
  }
  if (options.flipHorizontal || options.flipVertical) {
    ctx.scale(options.flipHorizontal ? -1 : 1, options.flipVertical ? -1 : 1);
  }
  ctx.translate(-width / 2, -height / 2);
}

// Helper: Draw text or image watermark
function drawWatermark(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  options: ImageProcessingOptions
) {
  ctx.save();
  ctx.globalAlpha = Math.max(0.1, Math.min(1.0, options.watermarkOpacity || 0.6));

  const margin = Math.max(16, Math.round(Math.min(width, height) * 0.03));

  if (options.watermarkType === 'text' && options.watermarkText) {
    const fontSize = Math.max(14, Math.round(options.watermarkFontSize * (Math.min(width, height) / 1000)));
    ctx.font = `600 ${fontSize}px sans-serif`;
    ctx.fillStyle = options.watermarkColor || '#FFFFFF';
    ctx.textBaseline = 'middle';

    const metrics = ctx.measureText(options.watermarkText);
    const textW = metrics.width;
    const textH = fontSize;

    let x = width - textW - margin;
    let y = height - textH / 2 - margin;

    switch (options.watermarkPosition) {
      case 'top-left':
        x = margin;
        y = margin + textH / 2;
        break;
      case 'top-center':
        x = (width - textW) / 2;
        y = margin + textH / 2;
        break;
      case 'top-right':
        x = width - textW - margin;
        y = margin + textH / 2;
        break;
      case 'center':
        x = (width - textW) / 2;
        y = height / 2;
        break;
      case 'bottom-left':
        x = margin;
        y = height - textH / 2 - margin;
        break;
      case 'bottom-center':
        x = (width - textW) / 2;
        y = height - textH / 2 - margin;
        break;
      case 'bottom-right':
      default:
        x = width - textW - margin;
        y = height - textH / 2 - margin;
        break;
    }

    // Soft drop shadow for legibility over light and dark backgrounds
    ctx.shadowColor = 'rgba(0, 0, 0, 0.65)';
    ctx.shadowBlur = 4;
    ctx.shadowOffsetX = 1;
    ctx.shadowOffsetY = 1;

    ctx.fillText(options.watermarkText, x, y);
  }

  ctx.restore();
}

// Batch ZIP generator using JSZip
export async function createZipFromProcessedImages(
  items: ProcessedImageItem[],
  zipFilename = 'GurucraftPro_Bulk_Images.zip',
  onProgress?: (percent: number) => void
): Promise<Blob> {
  const zip = new JSZip();
  const folder = zip.folder('processed_images') || zip;

  const validItems = items.filter((it) => it.status === 'completed' && it.outputBlob);

  for (let i = 0; i < validItems.length; i++) {
    const it = validItems[i];
    if (it.outputBlob) {
      const fileName = it.outputFileName || `image_${i + 1}.${it.outputFormat || 'jpg'}`;
      folder.file(fileName, it.outputBlob);
    }
  }

  const zipBlob = await zip.generateAsync(
    {
      type: 'blob',
      compression: 'DEFLATE',
      compressionOptions: { level: 6 },
    },
    (metadata) => {
      if (onProgress) {
        onProgress(Math.round(metadata.percent));
      }
    }
  );

  return zipBlob;
}

// Download a single blob directly in the browser
export function triggerBrowserDownload(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.style.display = 'none';
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  setTimeout(() => {
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, 100);
}
