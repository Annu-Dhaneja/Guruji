import fs from 'fs';
import path from 'path';

// Types for Bulk Image Processing Studio
export interface ImagePreset {
  id: string;
  name: string;
  category: 'social' | 'ecommerce' | 'web' | 'print' | 'custom';
  description: string;
  width: number;
  height: number;
  aspectRatio: string;
  resizeMode: 'fit' | 'fill' | 'exact' | 'crop';
  cropMode?: 'center' | 'free' | 'smart';
  outputFormat: 'jpg' | 'png' | 'webp' | 'avif' | 'original';
  quality: number; // 0-100
  compressionLevel: 'lossless' | 'high' | 'balanced' | 'max';
  backgroundColor: string;
  enabled: boolean;
  order: number;
  badge?: string;
}

export interface ImageProcessingSettings {
  enabledFeatures: {
    bulkResize: boolean;
    compression: boolean;
    formatConversion: boolean;
    crop: boolean;
    watermark: boolean;
    metadataRemoval: boolean;
    heicSupport: boolean;
    avifSupport: boolean;
    zipDownload: boolean;
    guestProcessing: boolean;
    processingHistory: boolean;
    serverProcessingFallback: boolean;
  };
  supportedInputFormats: string[];
  supportedOutputFormats: string[];
  defaultOutputFormat: string;
  defaultQuality: {
    jpg: number;
    webp: number;
    avif: number;
  };
  compressionPresets: {
    lossless: number;
    high: number;
    balanced: number;
    max: number;
  };
  limits: {
    guestMaxFilesPerJob: number;
    guestMaxFileSizeMB: number;
    guestDailyJobsLimit: number;
    guestMaxDimensionPx: number;
    userMaxFilesPerJob: number;
    userMaxFileSizeMB: number;
    userMaxDimensionPx: number;
  };
  watermarkDefaults: {
    enabledByDefault: boolean;
    defaultText: string;
    defaultPosition: 'top-left' | 'top-right' | 'center' | 'bottom-left' | 'bottom-right';
    defaultOpacity: number;
    defaultColor: string;
    isPaidFeature: boolean;
  };
  filenameDefaults: {
    defaultNamingRule: 'original' | 'prefix' | 'suffix' | 'sequential';
    defaultPrefix: string;
    defaultSuffix: string;
    replaceSpacesWith: 'dash' | 'underscore' | 'keep';
    caseTransform: 'keep' | 'lowercase' | 'uppercase';
  };
  privacySettings: {
    stripExifByDefault: boolean;
    stripGpsByDefault: boolean;
    tempFileRetentionMinutes: number;
  };
  seo: {
    pageTitle: string;
    metaDescription: string;
    keywords: string;
    canonicalUrl: string;
  };
}

export interface ImagePlan {
  id: string;
  name: string;
  badge?: string;
  priceINR: number;
  billingPeriod: 'one_time' | 'monthly' | 'yearly';
  imageLimitPerDay: number;
  imageLimitPerMonth: number;
  maxFilesPerBatch: number;
  maxFileSizeMB: number;
  features: string[];
  popular?: boolean;
  active: boolean;
}

export interface ImageProcessingJobRecord {
  id: string;
  userId?: string;
  userEmail?: string;
  isGuest: boolean;
  createdAt: string;
  completedAt?: string;
  totalImages: number;
  successfulImages: number;
  failedImages: number;
  originalTotalSizeBytes: number;
  processedTotalSizeBytes: number;
  savedBytes: number;
  savedPercentage: number;
  outputFormat: string;
  settingsSummary: string;
  status: 'queued' | 'processing' | 'completed' | 'failed' | 'cancelled';
  fileNames: string[];
}

export interface ImageStudioAuditLog {
  id: string;
  adminEmail: string;
  action: string;
  oldValue: string;
  newValue: string;
  timestamp: string;
  ip?: string;
}

// Initial Standard Presets
export const INITIAL_IMAGE_PRESETS: ImagePreset[] = [
  {
    id: 'preset-ig-post',
    name: 'Instagram Portrait Post',
    category: 'social',
    description: 'Optimal 4:5 vertical feed post for maximum screen presence',
    width: 1080,
    height: 1350,
    aspectRatio: '4:5',
    resizeMode: 'fill',
    outputFormat: 'jpg',
    quality: 90,
    compressionLevel: 'high',
    backgroundColor: '#FFFFFF',
    enabled: true,
    order: 1,
    badge: 'Popular',
  },
  {
    id: 'preset-ig-sq',
    name: 'Instagram Square',
    category: 'social',
    description: '1:1 square post for carousel and classic grid',
    width: 1080,
    height: 1080,
    aspectRatio: '1:1',
    resizeMode: 'fit',
    outputFormat: 'jpg',
    quality: 88,
    compressionLevel: 'high',
    backgroundColor: '#FFFFFF',
    enabled: true,
    order: 2,
  },
  {
    id: 'preset-ig-story',
    name: 'Instagram Story & Reel',
    category: 'social',
    description: '9:16 vertical full screen for stories and reels',
    width: 1080,
    height: 1920,
    aspectRatio: '9:16',
    resizeMode: 'fill',
    outputFormat: 'jpg',
    quality: 90,
    compressionLevel: 'high',
    backgroundColor: '#000000',
    enabled: true,
    order: 3,
  },
  {
    id: 'preset-yt-thumb',
    name: 'YouTube 4K Thumbnail',
    category: 'social',
    description: '16:9 high-CTR thumbnail for YouTube video uploads',
    width: 1280,
    height: 720,
    aspectRatio: '16:9',
    resizeMode: 'fill',
    outputFormat: 'jpg',
    quality: 92,
    compressionLevel: 'high',
    backgroundColor: '#000000',
    enabled: true,
    order: 4,
    badge: 'High CTR',
  },
  {
    id: 'preset-amz-prod',
    name: 'Amazon Product Showcase',
    category: 'ecommerce',
    description: 'High-resolution square with pure white background',
    width: 2000,
    height: 2000,
    aspectRatio: '1:1',
    resizeMode: 'fit',
    outputFormat: 'jpg',
    quality: 95,
    compressionLevel: 'balanced',
    backgroundColor: '#FFFFFF',
    enabled: true,
    order: 5,
    badge: 'Ecom',
  },
  {
    id: 'preset-flip-prod',
    name: 'Flipkart Product Image',
    category: 'ecommerce',
    description: 'Clean product catalog image with zoom compatibility',
    width: 1500,
    height: 1500,
    aspectRatio: '1:1',
    resizeMode: 'fit',
    outputFormat: 'jpg',
    quality: 92,
    compressionLevel: 'balanced',
    backgroundColor: '#FFFFFF',
    enabled: true,
    order: 6,
  },
  {
    id: 'preset-web-banner',
    name: 'Website Hero Banner',
    category: 'web',
    description: 'Ultra-wide modern responsive website header banner',
    width: 1920,
    height: 600,
    aspectRatio: '16:5',
    resizeMode: 'fill',
    outputFormat: 'webp',
    quality: 85,
    compressionLevel: 'max',
    backgroundColor: '#111A1E',
    enabled: true,
    order: 7,
  },
  {
    id: 'preset-passport',
    name: 'Passport Size Photo (India)',
    category: 'print',
    description: 'Official 3.5cm x 4.5cm (413 x 531 px at 300 DPI) document photo',
    width: 413,
    height: 531,
    aspectRatio: '7:9',
    resizeMode: 'fit',
    outputFormat: 'jpg',
    quality: 98,
    compressionLevel: 'lossless',
    backgroundColor: '#FFFFFF',
    enabled: true,
    order: 8,
    badge: 'Official',
  },
  {
    id: 'preset-prod-card',
    name: 'E-commerce Card / Thumbnail',
    category: 'ecommerce',
    description: 'Lightweight web catalog product card image',
    width: 800,
    height: 800,
    aspectRatio: '1:1',
    resizeMode: 'fit',
    outputFormat: 'webp',
    quality: 85,
    compressionLevel: 'max',
    backgroundColor: '#F8FAFA',
    enabled: true,
    order: 9,
  },
];

// Initial Settings
export const INITIAL_IMAGE_SETTINGS: ImageProcessingSettings = {
  enabledFeatures: {
    bulkResize: true,
    compression: true,
    formatConversion: true,
    crop: true,
    watermark: true,
    metadataRemoval: true,
    heicSupport: true,
    avifSupport: true,
    zipDownload: true,
    guestProcessing: true,
    processingHistory: true,
    serverProcessingFallback: true,
  },
  supportedInputFormats: ['jpg', 'jpeg', 'png', 'webp', 'gif', 'bmp', 'svg', 'tiff'],
  supportedOutputFormats: ['jpg', 'png', 'webp', 'avif'],
  defaultOutputFormat: 'webp',
  defaultQuality: {
    jpg: 88,
    webp: 85,
    avif: 80,
  },
  compressionPresets: {
    lossless: 100,
    high: 90,
    balanced: 80,
    max: 65,
  },
  limits: {
    guestMaxFilesPerJob: 30,
    guestMaxFileSizeMB: 20,
    guestDailyJobsLimit: 5,
    guestMaxDimensionPx: 4000,
    userMaxFilesPerJob: 150,
    userMaxFileSizeMB: 50,
    userMaxDimensionPx: 8000,
  },
  watermarkDefaults: {
    enabledByDefault: false,
    defaultText: 'GurucraftPro',
    defaultPosition: 'bottom-right',
    defaultOpacity: 0.5,
    defaultColor: '#FFFFFF',
    isPaidFeature: false,
  },
  filenameDefaults: {
    defaultNamingRule: 'original',
    defaultPrefix: '',
    defaultSuffix: '-optimized',
    replaceSpacesWith: 'dash',
    caseTransform: 'keep',
  },
  privacySettings: {
    stripExifByDefault: true,
    stripGpsByDefault: true,
    tempFileRetentionMinutes: 15,
  },
  seo: {
    pageTitle: 'Bulk Image Processing & Resizer Studio | GurucraftPro',
    metaDescription: 'Batch resize, compress, crop, and convert hundreds of images instantly. Zero loss, client-side privacy, WebP/AVIF output, and ZIP download.',
    keywords: 'bulk image resizer, batch image compressor, convert image to webp, bulk image cropper, online image studio',
    canonicalUrl: 'https://gurucraftpro.com/tools/bulk-image-resizer',
  },
};

// Initial Subscription & Credit Plans (Dynamic INR pricing)
export const INITIAL_IMAGE_PLANS: ImagePlan[] = [
  {
    id: 'plan-free',
    name: 'Free Starter',
    badge: 'Forever Free',
    priceINR: 0,
    billingPeriod: 'monthly',
    imageLimitPerDay: 20,
    imageLimitPerMonth: 600,
    maxFilesPerBatch: 25,
    maxFileSizeMB: 15,
    features: [
      '20 Images per day',
      'Batch resize, crop & compress',
      'JPG, PNG & WEBP formats',
      'ZIP batch download',
      'Client-side privacy preservation',
    ],
    popular: false,
    active: true,
  },
  {
    id: 'plan-basic-pack',
    name: 'Batch Credit Pack (100 Images)',
    badge: 'Popular Pack',
    priceINR: 29,
    billingPeriod: 'one_time',
    imageLimitPerDay: 100,
    imageLimitPerMonth: 100,
    maxFilesPerBatch: 100,
    maxFileSizeMB: 35,
    features: [
      '100 High-Res image credits',
      'Custom text & logo watermarking',
      'AVIF ultra compression',
      'No daily quota restrictions',
      'Instant ZIP export',
    ],
    popular: true,
    active: true,
  },
  {
    id: 'plan-pro-monthly',
    name: 'Pro Image Studio',
    badge: 'Best Value',
    priceINR: 199,
    billingPeriod: 'monthly',
    imageLimitPerDay: 500,
    imageLimitPerMonth: 5000,
    maxFilesPerBatch: 300,
    maxFileSizeMB: 50,
    features: [
      '5,000 Images / month',
      'Up to 300 images per batch',
      'Sequential filename automation',
      'Priority queue processing',
      'Cloud processing history archive',
      'Commercial usage license',
    ],
    popular: false,
    active: true,
  },
  {
    id: 'plan-enterprise',
    name: 'Enterprise Agency',
    badge: 'Unlimited',
    priceINR: 799,
    billingPeriod: 'monthly',
    imageLimitPerDay: 5000,
    imageLimitPerMonth: 50000,
    maxFilesPerBatch: 1000,
    maxFileSizeMB: 100,
    features: [
      '50,000 Images / month',
      '1,000 Images in single batch',
      'Custom API access',
      'Dedicated worker concurrency',
      'Team multi-seat access',
      '24/7 Priority support',
    ],
    popular: false,
    active: true,
  },
];

// Persistent state container
interface ImageStudioStorage {
  presets: ImagePreset[];
  settings: ImageProcessingSettings;
  plans: ImagePlan[];
  jobs: ImageProcessingJobRecord[];
  auditLogs: ImageStudioAuditLog[];
}

const STORAGE_FILE = path.join(process.cwd(), 'server', 'imageStudioData.json');

// Memory cache
export const imagePresetsData: ImagePreset[] = [...INITIAL_IMAGE_PRESETS];
export const imageSettingsData: ImageProcessingSettings = JSON.parse(JSON.stringify(INITIAL_IMAGE_SETTINGS));
export const imagePlansData: ImagePlan[] = [...INITIAL_IMAGE_PLANS];
export const imageJobsHistoryData: ImageProcessingJobRecord[] = [];
export const imageAuditLogsData: ImageStudioAuditLog[] = [
  {
    id: 'log-init-1',
    adminEmail: 'annudhaneja@gmail.com',
    action: 'Module Initialized',
    oldValue: 'None',
    newValue: 'Bulk Image Studio Online with 9 presets and active plans',
    timestamp: new Date().toISOString(),
  },
];

// Disk Save
export function saveImageStudioToDisk() {
  try {
    const payload: ImageStudioStorage = {
      presets: imagePresetsData,
      settings: imageSettingsData,
      plans: imagePlansData,
      jobs: imageJobsHistoryData.slice(0, 500), // Keep latest 500 jobs
      auditLogs: imageAuditLogsData.slice(0, 200),
    };
    fs.writeFileSync(STORAGE_FILE, JSON.stringify(payload, null, 2), 'utf-8');
  } catch (err) {
    console.error('[ImageStudio] Error writing data to disk:', err);
  }
}

// Disk Load
export function loadImageStudioFromDisk() {
  try {
    if (!fs.existsSync(STORAGE_FILE)) {
      saveImageStudioToDisk();
      return;
    }
    const raw = fs.readFileSync(STORAGE_FILE, 'utf-8');
    const parsed: Partial<ImageStudioStorage> = JSON.parse(raw);

    if (Array.isArray(parsed.presets) && parsed.presets.length > 0) {
      imagePresetsData.splice(0, imagePresetsData.length, ...parsed.presets);
    }
    if (parsed.settings) {
      Object.assign(imageSettingsData, parsed.settings);
    }
    if (Array.isArray(parsed.plans) && parsed.plans.length > 0) {
      imagePlansData.splice(0, imagePlansData.length, ...parsed.plans);
    }
    if (Array.isArray(parsed.jobs)) {
      imageJobsHistoryData.splice(0, imageJobsHistoryData.length, ...parsed.jobs);
    }
    if (Array.isArray(parsed.auditLogs)) {
      imageAuditLogsData.splice(0, imageAuditLogsData.length, ...parsed.auditLogs);
    }
  } catch (err) {
    console.error('[ImageStudio] Error reading data from disk:', err);
  }
}

// Log audit changes
export function logImageAudit(adminEmail: string, action: string, oldValue: any, newValue: any, ip?: string) {
  const log: ImageStudioAuditLog = {
    id: 'img-audit-' + Date.now() + '-' + Math.floor(Math.random() * 1000),
    adminEmail,
    action,
    oldValue: typeof oldValue === 'string' ? oldValue : JSON.stringify(oldValue),
    newValue: typeof newValue === 'string' ? newValue : JSON.stringify(newValue),
    timestamp: new Date().toISOString(),
    ip: ip || '127.0.0.1',
  };
  imageAuditLogsData.unshift(log);
  if (imageAuditLogsData.length > 200) {
    imageAuditLogsData.pop();
  }
  saveImageStudioToDisk();
}

// Initialize on import
loadImageStudioFromDisk();
