export type StudioOrderStatus =
  | 'NEW ORDER'
  | 'PAYMENT CONFIRMED'
  | 'FILES RECEIVED'
  | 'DESIGNER ASSIGNED'
  | 'IN PROGRESS'
  | 'QUALITY CHECK'
  | 'READY FOR REVIEW'
  | 'REVISION REQUESTED'
  | 'APPROVED'
  | 'FINAL DELIVERY'
  | 'COMPLETED';

export interface ProjectFileComment {
  id: string;
  author: string;
  role: 'designer' | 'client' | 'qa' | 'admin' | 'customer';
  text: string;
  timestamp: string;
  resolved?: boolean;
  coordX?: number;
  coordY?: number;
}

export interface ProjectFileItem {
  id: string;
  name: string;
  size: string;
  format: string;
  originalUrl: string;
  editedPreviewUrl?: string;
  finalDownloadUrl?: string;
  status: 'pending' | 'in-progress' | 'edited' | 'approved' | 'revision-requested';
  comments?: ProjectFileComment[];
}

export interface FreeSampleRequest {
  id: string;
  name: string;
  email: string;
  whatsapp?: string;
  category: string;
  marketplace: string;
  requirements: string;
  imageUrl?: string;
  imageFileName?: string;
  status: 'pending' | 'in-progress' | 'completed' | 'delivered';
  beforeImageUrl?: string;
  afterImageUrl?: string;
  downloadUrl?: string;
  assignedArtist?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface HeroStatistics {
  projectsCompleted: string;
  imagesEdited: string;
  happyClients: string;
  averageTurnaround: string;
}

export interface BrandColorSettings {
  primary: string;
  secondary: string;
  accent: string;
  dark: string;
  surface: string;
  light: string;
  textDark: string;
  textLight: string;
}

export interface StudioServiceCategory {
  id: string;
  name: string;
  description?: string;
  icon?: string;
}

export interface StudioServiceItem {
  id: string;
  slug: string;
  title: string;
  category: string;
  categoryLabel: string;
  tagline: string;
  description: string;
  features: string[];
  deliveryTime: string;
  turnaroundHours: number;
  startingPrice: number;
  fileFormats: string[];
  supportedMarketplaces: string[];
  revisionPolicy: string;
  beforeImageUrl?: string;
  afterImageUrl?: string;
  faqs?: { question: string; answer: string }[];
  packages?: any[];
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'user' | 'admin';
}

export interface ServiceItem {
  id: string;
  title: string;
  category: 'graphic-design' | 'website-services' | 'wardrobe-consultation' | 'vantage-marketplace' | 'book-cover';
  categoryName: string;
  startingPrice: number;
  description: string;
  imageUrl: string;
  features: string[];
  slug?: string;
}

export interface VantagePackage {
  id: string;
  name: string; // e.g. 'Basic', 'Standard', 'Premium'
  price: number;
  originalPrice?: number;
  unit: string; // e.g. 'per image', 'per product', 'per design', 'per project'
  deliveryTime: string;
  features: string[];
  popular?: boolean;
}

export interface VantageSpecification {
  key: string;
  value: string;
}

export interface VantageFAQ {
  question: string;
  answer: string;
}

export interface VantageBeforeAfter {
  id: string;
  title: string;
  description: string;
  beforeImage: string;
  afterImage: string;
  category: string;
  serviceId?: string;
  visible: boolean;
}

export interface VantageService {
  id: string;
  slug: string;
  title: string;
  category: 'product-image-editing' | 'marketplace-editing' | 'apparel-fashion' | 'advanced-editing' | 'file-conversion' | 'video-editing' | 'digital-products';
  categoryName: string;
  marketplace?: 'amazon' | 'flipkart' | 'etsy' | 'shopify' | 'meesho' | 'all';
  shortDescription: string;
  fullDescription: string;
  imageUrl: string;
  gallery?: string[];
  startingPrice: number;
  salePrice?: number;
  unit: string;
  deliveryTime: string;
  rating?: number;
  reviewsCount?: number;
  featured?: boolean;
  visible: boolean;
  packages: VantagePackage[];
  features: string[];
  whatYouGet: string[];
  processSteps: { step: number; title: string; description: string }[];
  specifications: VantageSpecification[];
  faqs: VantageFAQ[];
  beforeAfter?: VantageBeforeAfter[];
  relatedServiceIds?: string[];
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface VantageInquiry {
  id: string;
  serviceId: string;
  serviceTitle: string;
  serviceCategory?: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  quantity?: number;
  platform?: string;
  deadline?: string;
  description: string;
  specialRequirements?: string;
  uploadedFiles?: string[];
  customFieldsData?: Record<string, any>;
  status: 'New' | 'Reviewing' | 'Quoted' | 'Approved' | 'Closed';
  adminNotes?: string;
  quotedPrice?: number;
  createdAt: string;
}

export interface ProductItem {
  id: string;
  name: string;
  category: 'guruji-products' | 'digital-products' | 'accessories' | 'ebooks';
  categoryName: string;
  price: number;
  discountPrice?: number;
  description: string;
  previewUrl: string;
  downloadUrl?: string;
  isDigital: boolean;
  tags: string[];
}

export interface AIPromptItem {
  id: string;
  title: string;
  category: string;
  tool: 'Midjourney' | 'ChatGPT' | 'Gemini' | 'DALL-E 3';
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  description: string;
  fullPrompt: string;
  copyCount: number;
  tags: string[];
}

export interface WardrobeSubmission {
  id?: string;
  clientName: string;
  clientPhone: string;
  clientEmail: string;
  city: string;
  occasion: string;
  bodyType: string;
  colorPreferences: string;
  preferredStyle: string;
  budgetRange: string;
  notes?: string;
  uploadedPhotos?: string[];
  uploadedImages?: string[];
  status?: string;
  adminNotes?: string;
  lookbookUrl?: string;
  createdAt?: string;
}

export interface OrderItem {
  itemId: string;
  id?: string;
  itemType: 'service' | 'product';
  name: string;
  price: number;
  quantity: number;
  imageUrl?: string;
  image?: string;
  category?: string;
  serviceType?: string;
  originalPrice?: number;
  customizationData?: Record<string, any>;
  variantName?: string;
  format?: string;
  isDigital?: boolean;
  isPhysical?: boolean;
  sku?: string;
  downloadUrl?: string;
  customSpecs?: Record<string, any>;
  fileFormat?: string;
  variant?: string;
}

export type PaymentStatus = 'pending' | 'processing' | 'paid' | 'failed' | 'cancelled' | 'refunded';

export interface OrderRecord {
  id: string;
  userId?: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  items: OrderItem[];
  subtotal?: number;
  discount?: number;
  couponCode?: string;
  shippingCharges?: number;
  shippingAddress?: {
    address: string;
    city: string;
    state: string;
    pincode: string;
  };
  deliveryStatus?: 'order_placed' | 'packed' | 'shipped' | 'out_for_delivery' | 'delivered';
  trackingNumber?: string;
  hasPhysicalItems?: boolean;
  hasDigitalItems?: boolean;
  tax?: number;
  totalAmount: number;
  currency?: string;
  paymentStatus: PaymentStatus;
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  razorpaySignature?: string;
  paymentMethod?: string;
  status: 'received' | 'in-progress' | 'completed' | 'cancelled';
  studioOrderStatus?: StudioOrderStatus;
  assignedDesignerId?: string;
  assignedDesignerName?: string;
  revisionCount?: number;
  projectBrief?: any;
  files?: ProjectFileItem[];
  activities?: any[];
  refundStatus?: 'none' | 'requested' | 'processing' | 'refunded';
  refundId?: string;
  refundAmount?: number;
  createdAt: string;
  updatedAt?: string;
  invoiceNumber?: string;
}

export interface SiteSettings {
  brandName?: string;
  tagline?: string;
  positioning?: string;
  supportingLine?: string;
  freeSampleEnabled?: boolean;
  heroHeading?: string;
  heroSubheading?: string;
  ctaPrimaryText?: string;
  ctaSecondaryText?: string;
  brandColors?: BrandColorSettings;
  heroStats?: HeroStatistics;
  contactName: string;
  contactPhone: string;
  contactEmail: string;
  contactLocation: string;
  googleMapsEmbedUrl: string;
  aboutText: string;
  missionText: string;
  visionText: string;
  maintenanceMode?: boolean;
  maintenanceTitle?: string;
  maintenanceDescription?: string;
  maintenanceImage?: string;
  maintenanceReturnDate?: string;
}

export interface PaymentGatewaySettings {
  enabled: boolean;
  mode: 'test' | 'live';
  keyId: string;
  keySecret: string; // Stored securely on server, masked in public APIs
  webhookSecret?: string;
  companyName: string;
  themeColor: string;
  lastTestedAt?: string;
  lastTestStatus?: 'success' | 'failed' | 'untested';
  lastTestMessage?: string;
}

export interface PublicPaymentConfig {
  enabled: boolean;
  mode: 'test' | 'live';
  keyId: string;
  companyName: string;
  themeColor: string;
  isConfigured: boolean;
}

// Page Builder Types
export type SectionBlockType =
  | 'hero'
  | 'heading'
  | 'text'
  | 'image'
  | 'video'
  | 'service-grid'
  | 'product-grid'
  | 'category-grid'
  | 'pricing'
  | 'testimonials'
  | 'faq'
  | 'contact-form'
  | 'gallery'
  | 'cta'
  | 'newsletter'
  | 'blog'
  | 'featured-products'
  | 'featured-services'
  | 'social-links'
  | 'custom-html'
  | 'spacer'
  | 'divider'
  | 'logo-cloud'
  | 'stats'
  | 'timeline'
  | 'accordion';

export interface PageSection {
  id: string;
  type: SectionBlockType;
  title?: string;
  hidden?: boolean;
  content: Record<string, any>;
}

export interface PageItem {
  id: string;
  pageName: string;
  pageTitle: string;
  slug: string;
  description: string;
  featuredImage?: string;
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string;
  ogImage?: string;
  status: 'Draft' | 'Published' | 'Scheduled' | 'Hidden';
  publishDate?: string;
  sections: PageSection[];
  createdAt: string;
  updatedAt: string;
}

// Category Item
export interface CategoryItem {
  id: string;
  name: string;
  slug: string;
  group: 'graphic-design' | 'wardrobe' | 'vantage-ecom' | 'book-cover' | 'guruji-products' | 'digital-products' | 'ai-prompts' | 'custom';
  description: string;
  image?: string;
}

// Navigation Builder Types
export interface MenuItem {
  id: string;
  label: string;
  url: string;
  targetPageId?: string;
  isExternal?: boolean;
  hidden?: boolean;
  children?: MenuItem[];
}

export interface NavigationMenus {
  main: MenuItem[];
  footer: MenuItem[];
  mobile: MenuItem[];
  secondary: MenuItem[];
}

// Social & External Links
export interface SocialLinkItem {
  id: string;
  platformName: string;
  iconName: string;
  url: string;
  label: string;
  openInNewTab: boolean;
  active: boolean;
  category: 'social' | 'marketplace' | 'custom';
  location: ('header' | 'footer' | 'contact' | 'product')[];
}

export interface DefaultLinks {
  instagramUrl: string;
  facebookUrl: string;
  youtubeUrl: string;
  amazonUrl: string;
  flipkartUrl: string;
  etsyUrl: string;
  whatsappUrl: string;
  contactUrl: string;
  portfolioUrl: string;
  linkedinUrl?: string;
  pinterestUrl?: string;
  twitterUrl?: string;
  behanceUrl?: string;
  googleBusinessUrl?: string;
  directPhone?: string;
  directEmail?: string;
}

// SEO Types
export interface SEOConfig {
  id: string;
  entityType: 'homepage' | 'page' | 'service' | 'product' | 'category' | 'prompt' | 'book-cover' | 'wardrobe';
  entityId: string;
  seoTitle: string;
  metaDescription: string;
  focusKeyword: string;
  secondaryKeywords: string[];
  canonicalUrl: string;
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
  twitterCard: 'summary' | 'summary_large_image';
  robotsIndex: boolean;
  robotsFollow: boolean;
  customSchemaJson?: string;
}

export interface RedirectItem {
  id: string;
  oldUrl: string;
  newUrl: string;
  type: 301 | 302;
  active: boolean;
}

// Appearance & Theme Settings
export interface ThemeSettings {
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  backgroundColor: string;
  surfaceColor: string;
  cardColor: string;
  textColor: string;
  mutedTextColor: string;
  borderColor: string;
  mode: 'dark' | 'light' | 'system';
  preset: 'Modern' | 'Minimal' | 'Glassmorphism' | 'Premium' | 'Creative';
  containerWidth: string;
  sectionSpacing: string;
  cardRadius: string;
  buttonRadius: string;
  headerHeight: string;
}

export interface HeaderSettings {
  showLogo: boolean;
  logoSize: number;
  showNav: boolean;
  showCta: boolean;
  ctaText: string;
  ctaUrl: string;
  showSearch: boolean;
  showThemeToggle: boolean;
  showCart: boolean;
  showWhatsApp: boolean;
}

export interface FooterSettings {
  showLogo: boolean;
  description: string;
  showQuickLinks: boolean;
  showServices: boolean;
  showSocials: boolean;
  showMarketplaces: boolean;
  showContact: boolean;
  showWhatsApp: boolean;
  copyrightText: string;
}

// Media Library
export interface MediaItem {
  id: string;
  filename: string;
  url: string;
  sizeKb: number;
  mimeType: string;
  category: 'image' | 'video' | 'document' | 'pdf';
  altText: string;
  title: string;
  caption?: string;
  folder?: string;
  createdAt: string;
}

// Content Versioning
export interface ContentVersionItem {
  id: string;
  entityType: 'page' | 'service' | 'product' | 'theme' | 'seo';
  entityId: string;
  versionNumber: number;
  title: string;
  authorName: string;
  timestamp: string;
  snapshotData: Record<string, any>;
}

// Security & RBAC
export type AdminRole =
  | 'Super Admin'
  | 'Website Manager'
  | 'SEO Manager'
  | 'Content Manager'
  | 'Order Manager'
  | 'Designer'
  | 'Support Manager';

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: AdminRole;
  permissions: string[];
  twoFactorEnabled: boolean;
  lastLogin: string;
  activeSessionId?: string;
}

export interface AuditLogItem {
  id: string;
  adminId: string;
  adminName: string;
  action: string;
  resource: string;
  resourceId?: string;
  details: string;
  ipAddress: string;
  timestamp: string;
}

export interface AdminSession {
  id: string;
  adminId: string;
  adminName: string;
  device: string;
  ip: string;
  loginTime: string;
  lastActive: string;
}


export type BookCoverProjectType = 'new-cover' | 'redesign' | 'improve';

export type BookCoverProjectStatus =
  | 'Brief Received'
  | 'Design Research'
  | 'First Concept'
  | 'Revision Requested'
  | 'Final Design'
  | 'Completed';

export interface BookCoverRevision {
  id: string;
  projectId: string;
  requestedChanges: string[]; // e.g. ['Text', 'Color', 'Layout']
  details: string;
  uploadedFiles: string[];
  status: 'Pending' | 'In Review' | 'Approved' | 'Completed';
  createdAt: string;
}

export interface BookCoverPackage {
  id: string;
  name: string;
  code: 'basic' | 'standard' | 'premium' | 'custom';
  description: string;
  price: number;
  originalPrice?: number;
  features: string[];
  deliveryTime: string; // e.g. '3-5 Business Days'
  revisionsCount: number;
  isPopular?: boolean;
  enabled: boolean;
}

export interface BookCoverQuestion {
  id: string;
  label: string;
  type: 'text' | 'dropdown' | 'radio' | 'checkbox' | 'multiselect' | 'textarea' | 'number';
  options?: string[];
  required: boolean;
  step: number;
}

export interface BookCoverProject {
  id: string;
  userId?: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  projectType: BookCoverProjectType;
  
  // Step 1: Book Info
  bookTitle: string;
  subtitle?: string;
  authorName: string;
  penName?: string;
  language: string;
  customLanguage?: string;
  bookType: string; // Genre
  shortDescription: string;
  mainStoryConcept: string;

  // Step 2: Cover Kind
  coverTypes: string[]; // e.g. ['Front Cover Only', 'Full Paperback Cover', 'Kindle / eBook Cover']

  // Step 3: Size & Print
  bookFormat: string;
  trimSize: string;
  customWidth?: string;
  customHeight?: string;
  customUnit?: string;
  pageCount: number;
  paperType: string;
  interiorType: string;
  estimatedSpineWidth?: string;
  publishingPlatform: string;

  // Step 4: Style & Creative Direction
  styleFeels: string[];
  primaryColor?: string;
  secondaryColor?: string;
  accentColor?: string;
  chooseColorsForMe: boolean;
  typographyPreference: string;

  // Step 5: Visual Idea
  visualConceptText: string;
  characterDescription?: string;
  characterAgeGroup?: string;
  characterGender?: string;
  characterClothing?: string;
  characterExpression?: string;
  characterPose?: string;
  characterFeatures?: string;
  locationEnvironment: string;
  importantObjects: string[];
  mood: string;
  referenceFiles: string[];

  // Step 6: Existing Cover (if Redesign/Improve)
  existingCoverUrl?: string;
  changesRequested?: string[];
  whatYouLikeCurrent?: string;
  whatYouDislikeCurrent?: string;
  whatShouldRemainUnchanged?: string;

  // Back Cover Content
  backCoverDescription?: string;
  authorBio?: string;
  publisherName?: string;
  publisherLogoUrl?: string;
  isbn?: string;
  barcodeUrl?: string;
  websiteSocialLinks?: string;
  otherBackCoverText?: string;

  // Author Details
  authorPhotoUrl?: string;
  useAuthorPhotoOnBack: boolean;

  // Designer's Freedom
  surpriseMe: boolean;
  creativeFreedomLevel: 'Low' | 'Medium' | 'High';

  // Inspiration
  inspirationFiles: string[];
  likedBookCoversText?: string;

  // Package & Billing
  selectedPackageId: string;
  selectedPackageName: string;
  price: number;
  paymentStatus: 'pending' | 'paid' | 'failed';

  // Status & Notes
  status: BookCoverProjectStatus;
  assignedDesignerId?: string;
  assignedDesignerName?: string;
  internalNotes?: string;
  customerVisibleNotes?: string;
  previewFiles: string[];
  finalFiles: string[];
  revisions: BookCoverRevision[];

  createdAt: string;
  updatedAt: string;
}

// ==================== PHOTOSHOP WORKFLOW STUDIO TYPES ====================

export type PhotoshopCompatibilityStatus = 'action-ready' | 'hybrid' | 'manual-guide' | 'custom-order';
export type PhotoshopStepCompatibility = 'ACTION SAFE' | 'ACTION LIMITED' | 'MANUAL' | 'CUSTOM SCRIPT';

export interface PhotoshopWorkflowStep {
  id: string;
  stepNumber: number;
  title: string;
  action: string;
  menuPath: string;
  settings: string;
  recommendedValue: string;
  explanation: string;
  expectedResult: string;
  compatibility: PhotoshopStepCompatibility;
  completed?: boolean;
}

export interface PhotoshopWorkflowExportSettings {
  format: string;
  dimensions?: string;
  colorProfile?: string;
  quality?: string;
  dpi?: number;
}

export interface PhotoshopWorkflow {
  id: string;
  userId?: string;
  userEmail?: string;
  title: string;
  originalPrompt: string;
  category: string;
  objective: string;
  description: string;
  compatibilityStatus: PhotoshopCompatibilityStatus;
  workflowType: 'Action File' | 'Hybrid Workflow' | 'Manual Guide' | 'Custom Order';
  photoshopVersion: string;
  stepCount: number;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
  estimatedTime: string;
  automationConfidence: number; // 0-100
  confidenceReason: string;
  actionPossible: boolean;
  actionSetName: string;
  actionName: string;
  actionFileName?: string;
  actionFileSize?: string;
  actionLimitations: string[];
  steps: PhotoshopWorkflowStep[];
  manualSteps: string[];
  exportSettings: PhotoshopWorkflowExportSettings;
  qualityChecks: string[];
  customOrderRecommended: boolean;
  version: number;
  isFavorite?: boolean;
  isSaved?: boolean;
  createdAt: string;
  updatedAt: string;
}

export type PhotoshopOrderStatus =
  | 'NEW'
  | 'UNDER REVIEW'
  | 'NEEDS INFORMATION'
  | 'QUOTATION SENT'
  | 'PAYMENT PENDING'
  | 'IN PROGRESS'
  | 'QUALITY CHECK'
  | 'READY FOR DELIVERY'
  | 'DELIVERED'
  | 'REVISION REQUESTED'
  | 'COMPLETED'
  | 'CANCELLED';

export interface PhotoshopOrderFile {
  id: string;
  name: string;
  url: string;
  type: string;
  size?: number;
  uploadedBy?: 'customer' | 'admin';
  createdAt: string;
}

export interface PhotoshopOrderMessage {
  id: string;
  sender: 'customer' | 'admin';
  senderName: string;
  message: string;
  timestamp: string;
  attachmentUrl?: string;
}

export interface PhotoshopCustomOrder {
  id: string;
  userId?: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  workflowId?: string;
  title: string;
  description: string;
  category: string;
  photoshopVersion: string;
  orderType: 'Simple Action' | 'Advanced Action' | 'Batch Automation' | 'Photoshop Script' | 'UXP Plugin' | 'Custom Workflow';
  priority: 'Normal' | 'Urgent' | 'Rush';
  deadline: string;
  quotedPrice: number;
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  orderStatus: PhotoshopOrderStatus;
  assignedAdmin?: string;
  adminNotes?: string;
  deliveryNotes?: string;
  revisionCount?: number;
  referenceFiles: PhotoshopOrderFile[];
  deliverableFiles: PhotoshopOrderFile[];
  messages: PhotoshopOrderMessage[];
  createdAt: string;
  updatedAt: string;
}

export interface PhotoshopTemplate {
  id: string;
  title: string;
  category: string;
  prompt: string;
  description: string;
  tag: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  photoshopVersion: string;
  iconName?: string;
}

export interface PhotoshopSavedPrompt {
  id: string;
  userId?: string;
  title: string;
  prompt: string;
  category: string;
  createdAt: string;
}

export interface PhotoshopAnalytics {
  totalWorkflows: number;
  actionFilesGenerated: number;
  manualGuidesGenerated: number;
  customOrdersCount: number;
  paidOrdersCount: number;
  totalRevenue: number;
  topCategories: { name: string; count: number }[];
  topPrompts: { prompt: string; count: number }[];
  conversionRate: number;
  failedGenerations: number;
  aiUsageCostEstimate: string;
}

// ==========================================
// QUICK DIGITAL SERVICES
// ==========================================
export type QuickServiceCategory =
  | 'Image Fix'
  | 'Logo Fix'
  | 'E-commerce Fix'
  | 'Social Media Fix'
  | 'File Conversion'
  | 'Print Fix'
  | 'Photo Fix';

export interface QuickDigitalService {
  id: string;
  name: string;
  category: QuickServiceCategory;
  description: string;
  price: number;
  deliveryTime: string;
  iconName: string;
  imageUrl?: string;
  thumbnailUrl?: string;
  popular?: boolean;
  recommended?: boolean;
  enabled: boolean;
  commonProblems: string[];
  supportedFileTypes: string[];
  exampleBeforeImage?: string;
  exampleAfterImage?: string;
}

export type QuickFixOrderStatus = 'Pending' | 'In Progress' | 'Quality Check' | 'Completed' | 'Delivered';

export interface QuickFixOrder {
  id: string;
  serviceId: string;
  serviceName: string;
  serviceCategory: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  uploadedFileName: string;
  uploadedFileUrl: string;
  uploadedFileSize?: string;
  uploadedFileType?: string;
  selectedRequirement: string;
  additionalInstructions?: string;
  quantity: number;
  unitPrice: number;
  rushDelivery?: boolean;
  totalPrice: number;
  status: QuickFixOrderStatus;
  estimatedDelivery: string;
  completedFileUrl?: string;
  completedFileName?: string;
  completedFileSize?: string;
  designerNotes?: string;
  adminNotes?: string;
  paymentStatus: 'Paid' | 'Pending';
  paymentId?: string;
  createdAt: string;
  updatedAt: string;
}

// ==================== AI SALES AGENT TYPES ====================

export interface SalesRecommendation {
  id: string;
  title: string;
  category: string;
  categoryName?: string;
  startingPrice: number;
  description: string;
  imageUrl?: string;
  slug?: string;
  features: string[];
  packages?: {
    name: string;
    price: number;
    deliveryTime?: string;
    features: string[];
    bestFor?: string;
  }[];
  bestFor?: string;
  isBundle?: boolean;
  bundleItems?: string[];
}

export interface SalesChatMessage {
  id: string;
  sender: 'user' | 'agent' | 'system';
  text: string;
  timestamp: string;
  languageDetected?: 'Hindi' | 'Hinglish' | 'English';
  recommendedServices?: SalesRecommendation[];
  leadCapturePrompt?: boolean;
  actionType?: 'add_to_cart' | 'view_service' | 'checkout' | 'inquiry_form' | 'whatsapp';
  actionPayload?: {
    serviceId?: string;
    title?: string;
    price?: number;
    slug?: string;
    category?: string;
  };
  intent?: 'discovery' | 'recommendation' | 'objection_handling' | 'high_intent' | 'lead_captured' | 'checkout';
}

export interface SalesLead {
  id: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  serviceInterested: string;
  requirementDetails: string;
  budgetEstimate?: string;
  deadline?: string;
  status: 'New' | 'Contacted' | 'Converted' | 'Closed';
  source: 'AI Sales Assistant';
  chatTranscript?: { sender: string; text: string }[];
  createdAt: string;
}

export interface SalesAnalyticsStats {
  aiOpenedCount: number;
  voiceSessionsCount: number;
  conversationsCount: number;
  recommendationsGiven: number;
  leadsCaptured: number;
  checkoutStarts: number;
  completedOrders: number;
  topRequestedServices: { serviceName: string; count: number }[];
}

// ==================== 7-DAY SMART WARDROBE PLANNER & CLOTH CONSULTATION TYPES ====================
export type ClothingCategory =
  | 'T-Shirt'
  | 'Shirt'
  | 'Top'
  | 'Jeans'
  | 'Trousers'
  | 'Shorts'
  | 'Skirt'
  | 'Dress'
  | 'Jacket'
  | 'Kurta'
  | 'Saree'
  | 'Ethnic Wear'
  | 'Shoes'
  | 'Bag'
  | 'Watch'
  | 'Accessories'
  | 'Other';

export type ClothingItemStatus = 'Available' | 'Worn Today' | 'Laundry' | 'Favourite';

export type AgeGroup = 'Child' | 'Teen / Gen Z' | 'Young Adult' | 'Adult' | 'Senior' | 'Family';

export interface FamilyProfile {
  id: string;
  name: string;
  relation?: 'Me' | 'Child' | 'Partner' | 'Parent' | 'Senior' | 'Custom';
  relationship?: 'Self' | 'Partner' | 'Child' | 'Parent' | 'Elder' | 'Other';
  ageGroup?: AgeGroup | string;
  gender?: 'Female' | 'Male' | 'Unisex';
  preferredStyle?: string;
  sizeInfo?: string;
  comfortPreference?: 'Normal' | 'Extra Comfortable' | 'Ultra Soft / Loose';
  favoriteColors?: string[];
  commonOccasions?: string[];
  avatarEmoji?: string;
  itemsCount?: number;
  createdAt?: string;
}

export interface WardrobeClothingItem {
  id: string;
  name: string;
  category: ClothingCategory;
  color: string;
  pattern: string; // Solid, Striped, Checked, Floral, Printed, Textured, Knit, etc.
  style: string; // Minimal, Classic, Smart Casual, Trendy, Streetwear, Traditional, Mix
  occasion: string; // Daily, Office, Casual, Party, Travel, Mixed, Wedding, School, College, Home
  season: string; // All Season, Summer, Winter, Monsoon, Spring/Autumn
  fit: string; // Slim, Regular, Relaxed, Oversized, Tailored
  isFavourite: boolean;
  imageUrl: string;
  status?: ClothingItemStatus;
  lastWornDate?: string;
  ownerProfileId?: string;
  rewearCount?: number;
  confidence?: number;
  aiIdentified?: boolean;
  notes?: string;
  addedAt?: string;
}

export interface QuickStyleProfile {
  lifestyle: 'Office' | 'College' | 'Work From Home' | 'Business' | 'Mixed';
  preferredStyle: 'Minimal' | 'Classic' | 'Smart Casual' | 'Trendy' | 'Streetwear' | 'Traditional' | 'Mix';
  outfitType: 'Daily' | 'Office' | 'Casual' | 'Party' | 'Travel' | 'Mixed';
  colorStyle: 'Neutral' | 'Bright' | 'Dark' | 'Pastel' | 'Mixed';
  city?: string;
  weatherPreference: 'Hot' | 'Cool' | 'Rainy' | 'Cold' | 'Normal';
  targetOccasion: 'Office' | 'Meeting' | 'Casual' | 'Date' | 'Party' | 'Wedding' | 'Travel' | 'Daily';
  budget?: string; // '₹500' | '₹1,000' | '₹2,500' | '₹5,000' | 'Custom'
  languagePreference?: 'English' | 'Hindi' | 'Hinglish';
}

export interface DayOutfitPlan {
  dayId: string; // 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday'
  dayName: string; // 'Monday', 'Tuesday', ...
  theme: string; // e.g. 'Power Kickoff / Minimalist Crisp'
  items: WardrobeClothingItem[];
  stylingTips: string;
  occasion: string;
  weather: string;
  isFavourite?: boolean;
  restyled?: boolean;
}

export interface WardrobeGapAnalysis {
  varietyScore: number;
  coverageScore: number;
  colorVarietyScore: number;
  footwearScore: number;
  summary: string;
  oneThingYouNeed: {
    item: string;
    reason: string;
    extraCombinations: number;
    estimatedPrice?: number;
  };
  smartShopping: {
    buyFirst: {
      item: string;
      reason: string;
      priority: string;
      budgetEst: number;
      versatilePairings: string[];
    };
    buyNext: {
      item: string;
      reason: string;
      priority: string;
      budgetEst: number;
      versatilePairings: string[];
    };
    optional: {
      item: string;
      reason: string;
      priority: string;
      budgetEst: number;
      versatilePairings: string[];
    };
  };
}

export interface WardrobeChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
  suggestedItems?: WardrobeClothingItem[];
  outfitTip?: string;
}

// 1. AI Cloth Consultation Inputs & Results
export interface ClothConsultationInput {
  personName?: string;
  relationship?: 'Self' | 'Partner' | 'Child' | 'Elder' | 'Parent' | 'Other';
  gender?: 'Female' | 'Male' | 'Unisex';
  ageGroup?: string;
  occasion?: string;
  vibeWant?: string;
  extraNotes?: string;
  language?: 'Hinglish' | 'Hindi' | 'English';
  targetPerson?: AgeGroup | string;
  desiredVibe?: string[];
  weather?: 'Auto Detect' | 'Hot' | 'Cold' | 'Rainy' | 'Mild' | 'Normal';
  comfortLevel?: 'Normal' | 'Extra Comfortable';
  colorPreference?: 'Any' | 'Light' | 'Dark' | 'Favourite Colors';
  avoidItems?: string;
  languagePreference?: 'English' | 'Hindi' | 'Hinglish';
  profileId?: string;
}

export interface ClothConsultationLook {
  title: string;
  vibe: string;
  items: WardrobeClothingItem[];
  whyItWorks: string;
  stylingTip: string;
  footwearAdvice?: string;
  accessories?: string[];
}

export interface ClothConsultationResult {
  id?: string;
  quickTakeaway?: string;
  bestOutfit?: ClothConsultationLook;
  alternativeOutfit?: ClothConsultationLook;
  title?: string;
  recommendedItems?: WardrobeClothingItem[];
  whyThisWorks?: string;
  occasion?: string;
  weather?: string;
  language?: 'English' | 'Hindi' | 'Hinglish';
  comfortRating?: number;
  isSaved?: boolean;
  makeBetterHistory?: string[];
}

// 2. Saved Outfit Looks
export interface SavedOutfitLook {
  id: string;
  name?: string;
  title?: string;
  personName?: string;
  items: WardrobeClothingItem[];
  whyItWorks?: string;
  stylingTip?: string;
  occasion?: string;
  createdAt: string;
  source?: 'consultation' | 'today-quick' | '7-day' | 'style-item' | 'travel';
}

// 3. 3 Looks From 1 Item
export interface Item3LookItem {
  title: string;
  occasion: string;
  vibe: string;
  matchedItems: WardrobeClothingItem[];
  stylingTip: string;
  colorHarmony: string;
  footwearSuggestion: string;
  accessories?: string[];
  items?: WardrobeClothingItem[];
  explanation?: string;
  shoes?: string;
}

export interface Item3LooksResult {
  heroItem: WardrobeClothingItem;
  heroItemSummary?: string;
  looks?: Item3LookItem[];
  look1Everyday?: {
    title: string;
    items: WardrobeClothingItem[];
    explanation: string;
    shoes?: string;
  };
  look2Smart?: {
    title: string;
    items: WardrobeClothingItem[];
    explanation: string;
    shoes?: string;
  };
  look3Occasion?: {
    title: string;
    items: WardrobeClothingItem[];
    explanation: string;
    shoes?: string;
  };
  stylingSecret?: string;
}

// 4. Travel Outfit Planner
export interface TravelPlannerInput {
  destination: string;
  durationDays?: number;
  daysCount?: number;
  tripPurpose?: string;
  packingConstraint?: string;
  weather?: 'Hot' | 'Cold' | 'Rainy' | 'Mild' | 'Auto Detect';
  occasion?: string;
  language?: 'Hinglish' | 'Hindi' | 'English';
}

export interface TravelPlanDayOutfit {
  dayNumber: number;
  dayTitle: string;
  activity: string;
  stylingTip: string;
  items: WardrobeClothingItem[];
}

export interface TravelPlan {
  destination: string;
  tripSummary: string;
  weatherNotes: string;
  packingList: WardrobeClothingItem[];
  dayOutfits: TravelPlanDayOutfit[];
  packingTips: string[];
}

export interface TravelPackingPlan {
  destination: string;
  daysCount: number;
  dailyOutfits: {
    dayNumber: number;
    title: string;
    items: WardrobeClothingItem[];
    notes: string;
  }[];
  essentialItems: WardrobeClothingItem[];
  optionalAccents: WardrobeClothingItem[];
  packingSummary: string;
}

// 5. Smart Buy Or Don't Buy (Do I Really Need This?)
export interface BuyOrDontBuyAnalysis {
  queryItem: string;
  verdict?: string;
  score?: number;
  reasoning?: string;
  matchingClosetItems?: WardrobeClothingItem[];
  potentialNewOutfits?: number;
  betterAlternative?: string;
  decision?: 'DO_NOT_BUY' | 'WARDROBE_GAP_DETECTED' | 'OPTIONAL_ACCENT';
  verdictTitle?: string;
  detailedReason?: string;
  existingSimilarItems?: WardrobeClothingItem[];
  potentialCombinationsCount?: number;
  smartAlternativeAdvice?: string;
}

// 6. Wardrobe Insights
export interface WardrobeInsightsStats {
  totalItems: number;
  mostUsedCategory: string;
  topColorPalette: string;
  capsuleHealth: string;
  versatilityScore: number;
  suggestedAddition: string;
  mostUsed?: WardrobeClothingItem[];
  leastUsed?: WardrobeClothingItem[];
  neverWorn?: WardrobeClothingItem[];
  favouriteItems?: WardrobeClothingItem[];
  laundryItems?: WardrobeClothingItem[];
  availableCount?: number;
  seasonalDistribution?: { season: string; count: number }[];
  missingBasics?: string[];
}

// 7. Graphic Design Marketplace Types
export interface GraphicDesignPackage {
  id: string;
  name: string;
  price: number;
  originalPrice: number;
  deliveryTime: string;
  revisions: string;
  concepts: number;
  features: string[];
  popular?: boolean;
}

export interface DeliverySpeedOption {
  id: 'normal' | 'sameday' | '1hour' | '30mins' | '10mins';
  label: string;
  timeframe: string;
  badge: string;
  additionalFee: number;
  iconName: string;
  description: string;
}

export interface GraphicDesignService {
  id: string;
  slug: string;
  title: string;
  category: string;
  categoryName: string;
  subcategory?: string;
  shortDescription: string;
  fullDescription: string;
  startingPrice: number;
  salePrice?: number;
  originalPrice: number;
  rating: number;
  reviewsCount: number;
  completedOrders: number;
  standardDeliveryTime: string;
  fastestDeliveryTime: string;
  turnaroundTime?: string;
  revisions: string;
  fileFormats: string[];
  dimensions: string;
  imageUrl: string;
  rotationImage?: string;
  gallery: string[];
  features?: string[];
  deliverables?: string[];
  requirements?: string[];
  tags?: string[];
  seoTitle?: string;
  seoDescription?: string;
  status?: 'active' | 'draft';
  enabled?: boolean;
  popular?: boolean;
  trending?: boolean;
  featured?: boolean;
  expressAvailable?: boolean;
  packages: GraphicDesignPackage[];
  whatsIncluded: string[];
  whatsNotIncluded: string[];
  portfolioExamples?: { title: string; imageUrl: string; client?: string }[];
  beforeAfter?: { before: string; after: string; caption: string };
  faqs: { question: string; answer: string }[];
  reviews: { name: string; rating: number; date: string; comment: string; verified: boolean; avatar?: string }[];
}

export interface GraphicDesignInquiry {
  id: string;
  serviceId?: string;
  serviceTitle: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  whatsapp?: string;
  quantity: number;
  deliverySpeed: string;
  budget: string;
  description: string;
  brandDetails?: string;
  driveLink?: string;
  uploadedFiles?: string[];
  status: 'PENDING' | 'IN_REVIEW' | 'QUOTED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  adminNotes?: string;
  quotedPrice?: number;
  assignedDesigner?: string;
  createdAt: string;
  updatedAt: string;
}

export interface GraphicDesignSettings {
  heroBadge: string;
  heroTitle: string;
  heroSub: string;
  whatsappNumber: string;
  marqueeItems: { text: string; icon: string; highlight: boolean }[];
  deliveryTiers: DeliverySpeedOption[];
}

export interface GraphicDesignCategory {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  description: string;
  icon: string;
  startingPrice: number;
  fastestDelivery: string;
  servicesCount: number;
  imageUrl: string;
  badge?: string;
  popular?: boolean;
  row?: 1 | 2;
  displayOrder: number;
  enabled: boolean;
  features?: string[];
  suit?: '♠' | '♥' | '♦' | '♣';
}

// ==========================================
// GURUJI ARTWORK & BLESSINGS PLATFORM TYPES
// ==========================================

export type GurujiMoodType =
  | 'peace'
  | 'gratitude'
  | 'blessings'
  | 'motivation'
  | 'meditation'
  | 'positivity'
  | 'strength'
  | 'new-beginning';

export interface GurujiCategoryItem {
  id: string;
  slug: string;
  name: string;
  hindiName: string;
  icon: string;
  description: string;
  heroImage?: string;
  enabled: boolean;
  sortOrder: number;
  artworkCount?: number;
  publishedCount?: number;
  freeCount?: number;
  paidCount?: number;
}

export interface CustomizationFieldConfig {
  id: string;
  name: string;
  label: string;
  type: 'text' | 'textarea' | 'number' | 'email' | 'phone' | 'image' | 'file' | 'dropdown' | 'radio' | 'checkbox';
  options?: string[];
  required: boolean;
  placeholder?: string;
  helpText?: string;
  defaultValue?: any;
}

export interface ProductVariantItem {
  id: string;
  name: string; // e.g. 'Instagram Post (1080x1350)', 'Full Source PSD', 'Commercial License'
  label: string;
  price: number;
  originalPrice?: number;
  format?: string;
  isDefault?: boolean;
}

export interface ProductReviewItem {
  id: string;
  userName?: string;
  customerName?: string;
  userCity?: string;
  city?: string;
  title?: string;
  rating: number; // 1 to 5
  reviewText?: string;
  comment?: string;
  verifiedPurchase: boolean;
  date: string;
  createdAt?: string;
}

export interface ProductFaqItem {
  question: string;
  answer: string;
}

export type ProductTypeCategory = 'DIGITAL_PRODUCT' | 'SERVICE' | 'CUSTOMIZABLE_PRODUCT';

export interface GurujiArtwork {
  id: string;
  slug: string;
  title: string;
  hindiTitle?: string;
  englishTitle?: string;
  description: string;
  shortDescription?: string;
  blessingMessage?: string;
  quote?: string;
  mantra?: string;
  category: string;
  categoryName: string;
  subcategory?: string;
  productType?: ProductTypeCategory;
  isPhysical?: boolean;
  isDigital?: boolean;
  stockQuantity?: number;
  sku?: string;
  material?: string;
  beadType?: string;
  colorOptions?: string[];
  sizeOptions?: string[];
  isAdjustable?: boolean;
  isBestSeller?: boolean;
  deviceType?: 'mobile' | 'desktop' | 'tablet' | 'lockscreen' | 'homescreen' | 'all';
  watermarkUrl?: string;
  downloadLimit?: number;
  downloadExpiryDays?: number;
  imageUrl: string;
  thumbnailUrl?: string;
  highResUrl?: string;
  previewUrl?: string;
  galleryImages?: string[];
  beforeImage?: string;
  afterImage?: string;
  demoVideoUrl?: string;
  artistName?: string;
  sourceAttribution: string; // e.g., "Verified Ashram Archives", "Original Digital Art by Annu Dhaneja", "Community artwork / original content"
  sourceReference?: string;
  price: number; // 0 for free, or real price (e.g. 9, 19, 29, 49, 99, 199)
  originalPrice?: number;
  discount?: number;
  salePrice?: number;
  isFree: boolean;
  isDailyArtwork?: boolean;
  dailyDate?: string; // YYYY-MM-DD
  festivalTag?: string;
  moods?: GurujiMoodType[];
  isFeatured?: boolean;
  isTrending?: boolean;
  isNew?: boolean;
  isDownloadable?: boolean;
  isCustomizable?: boolean;
  isDeleted?: boolean; // Soft Delete / Recycle bin
  deletedAt?: string;
  status: 'DRAFT' | 'SCHEDULED' | 'PUBLISHED' | 'ARCHIVED';
  sortOrder?: number;
  publishDate?: string;
  updatedDate?: string;
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string;
  canonicalUrl?: string;
  socialSharingImage?: string;
  aspectRatio?: '1:1' | '9:16' | '16:9' | '4:5';
  tags: string[];
  style?: 'Premium' | 'Minimal' | 'Luxury' | 'Traditional' | 'Modern' | 'Creative';
  occasion?: 'Daily' | 'Festival' | 'Birthday' | 'Wedding' | 'Business' | 'Spiritual' | 'E-Commerce' | 'Social Media';
  fileFormat?: string; // e.g., "PSD + 4K PNG + Print PDF", "Canva Template", "AI Vector + SVG"
  resolution?: string; // e.g., "300 DPI Ultra HD", "4K (3840x2160)"
  dimensions?: string; // e.g., "1080 × 1350 px (4:5)", "A4 (210 × 297 mm)"
  licenseType?: 'Personal Use' | 'Commercial Use' | 'Extended Commercial';
  fileSize?: string; // e.g., "45 MB (PSD + Assets)"
  filesCount?: number;
  downloadMethod?: string;
  deliveryTime?: string; // e.g., "Instant Download" or "2 - 4 Hours Service"
  whatsIncluded?: string[];
  featuresList?: string[];
  customizationFields?: CustomizationFieldConfig[];
  variants?: ProductVariantItem[];
  reviews?: ProductReviewItem[];
  rating?: number;
  averageRating?: number;
  ratingCount?: number;
  reviewsCount?: number;
  faqList?: ProductFaqItem[];
  favoritesCount?: number;
  downloadsCount?: number;
  viewsCount: number;
  sharesCount?: number;
  ordersCount?: number;
  revenueGenerated?: number;
  isVerifiedContent?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface SpiritualDonation {
  id: string;
  amount: number;
  customAmount?: number;
  donorName?: string;
  donorEmail?: string;
  donorPhone?: string;
  isAnonymous: boolean;
  purpose: 'mandir_langar' | 'ashram_seva' | 'gaushala' | 'digital_preservation' | 'general_blessing';
  purposeLabel: string;
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  currency: string;
  blessingMessage?: string;
  createdAt: string;
}

export interface DigitalDownloadToken {
  token: string;
  productId: string;
  productTitle: string;
  orderId: string;
  userId?: string;
  customerEmail: string;
  downloadUrl: string;
  fileFormat: string;
  fileSize: string;
  expiresAt: string;
  downloadCount: number;
  maxDownloads: number;
  isActive: boolean;
  createdAt: string;
}

export interface JaiGuruJiQuoteItem {
  id: string;
  quoteNumber?: number;
  text: string;
  hindiText: string;
  englishText?: string;
  category: 'faith' | 'shukrana' | 'kalyan' | 'sabar' | 'bhakti' | 'daily';
  categoryLabel: string;
  author: string;
  imageUrl?: string;
  graphicUrl?: string;
  likesCount: number;
  sharesCount: number;
  isFavorite?: boolean;
  isFree: boolean;
  price?: number;
  tags: string[];
  createdAt: string;
}

export interface DailyVachanCalendarItem {
  id: string;
  date: string; // YYYY-MM-DD
  vachanHindi: string;
  vachanEnglish: string;
  quote: string;
  spiritualMessage: string;
  imageUrl: string;
  specialOccasion?: string;
  isFeatured?: boolean;
  likesCount: number;
  sharesCount?: number;
  downloadableImage?: string;
  createdAt: string;
}

export interface DigitalBookmarkItem {
  id: string;
  title: string;
  hindiTitle?: string;
  dimensions: string; // e.g. "2 x 6 inches (300 DPI)"
  previewUrl: string;
  printablePdfUrl: string;
  category: string;
  isCustomizable: boolean;
  customName?: string;
  customMessage?: string;
  price: number;
  isFree: boolean;
  tags: string[];
  downloadsCount: number;
  createdAt: string;
}

export interface StoryGraphicItem {
  id: string;
  title: string;
  category: 'festival' | 'daily_vachan' | 'quotes' | 'blessings' | 'mantra';
  categoryLabel: string;
  aspectRatio: '9:16';
  previewUrl: string;
  downloadUrl: string;
  festivalTag?: string;
  price: number;
  isFree: boolean;
  tags: string[];
  downloadsCount: number;
  createdAt: string;
}

export interface FestivalCollectionItem {
  id: string;
  name: string;
  slug: string;
  description: string;
  bannerUrl: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
  featuredProductIds: string[];
  discountText?: string;
}

export interface MarketplaceBundle {
  id: string;
  slug: string;
  title: string;
  tagline?: string;
  description: string;
  imageUrl?: string;
  bannerImageUrl?: string;
  category?: string;
  includedArtworkIds?: string[];
  includedProductIds?: string[];
  includedItems?: Array<{ title: string; format?: string; value?: string }>;
  includedItemsDescription?: string[];
  totalItemsCount?: number;
  originalTotalValue?: number;
  bundlePrice: number;
  discountPercentage?: number;
  savingsAmount?: number;
  features?: string[];
  badge?: string;
  isFeatured?: boolean;
  isPopular?: boolean;
  featured?: boolean;
  enabled?: boolean;
  status?: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED' | string;
  downloadsCount?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface CustomDesignRequest {
  id: string;
  requestNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerWhatsapp?: string;
  serviceType?: string;
  category?: string;
  dimensions?: string;
  deadline: string;
  budget: string;
  designType?: string;
  description?: string;
  briefDescription?: string;
  message?: string;
  referenceImageUrl?: string;
  referenceImageUrls?: string[];
  colorPreferences?: string;
  mandirPlacementNotes?: string;
  status: 'RECEIVED' | 'IN_REVIEW' | 'QUOTED' | 'DESIGNING' | 'READY' | 'COMPLETED';
  quotedPrice?: number;
  assignedArtist?: string;
  adminNotes?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface GurujiDailyBlessing {
  id: string;
  title: string;
  blessingText: string;
  hindiText?: string;
  artworkUrl?: string;
  category: 'daily-vachan' | 'gratitude' | 'peace' | 'health' | 'positivity' | 'family';
  authorSource: string; // Real source e.g. "Community artwork / original content" or "Sacred Teachings Reference"
  sourceReference: string;
  publishDate: string; // YYYY-MM-DD
  expiryDate?: string;
  status: 'DRAFT' | 'PENDING_APPROVAL' | 'PUBLISHED' | 'ARCHIVED';
  sharesCount: number;
  likesCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface GurujiPersonalizedCardOrder {
  id: string;
  orderNumber: string;
  userId?: string;
  recipientName: string;
  occasion: 'Birthday' | 'New Business' | 'Success' | 'Family' | 'Festival' | 'Gratitude' | 'Positive Message' | 'General Blessing';
  preferredLanguage: 'Hindi' | 'English' | 'Punjabi';
  customMessage?: string;
  uploadedPhotoUrl?: string;
  selectedTemplateId: string;
  selectedTemplateTitle: string;
  backgroundTheme: string;
  typographyStyle: string;
  status: 'PENDING' | 'GENERATED' | 'COMPLETED' | 'CANCELLED';
  finalCardUrl?: string;
  isFreeTier: boolean;
  amount: number;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerWhatsapp?: string;
  createdAt: string;
  updatedAt: string;
}

export interface GurujiExpert {
  id: string;
  slug: string;
  name: string;
  profilePhoto: string;
  title: string;
  bio: string;
  expertise: string[]; // e.g. ["Vedic Astrology", "Numerology", "Spiritual Counseling"]
  experienceYears: number;
  languages: string[];
  consultationPrice: number;
  availableDays: string[];
  availableTime: string;
  verificationStatus: 'verified' | 'pending' | 'rejected';
  verifiedAt?: string;
  verifiedBy?: string;
  completedConsultations: number;
  rating: number;
  reviewsCount: number;
  disclaimer: string;
}

export interface GurujiPredictionRequest {
  id: string;
  requestNumber: string;
  userId?: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  serviceType: 'Vedic Kundli & Chart' | 'Numerology Analysis' | 'Spiritual Guidance' | 'Name Vibration & Career' | 'Yearly Forecast';
  dob: string; // YYYY-MM-DD
  birthTime: string; // HH:MM
  birthPlace: string;
  gender?: string;
  specificQuery?: string;
  consultationType: 'automated-calculation' | 'human-expert';
  assignedExpertId?: string;
  assignedExpertName?: string;
  status: 'RECEIVED' | 'IN_CALCULATION' | 'ASSIGNED' | 'REVIEWING' | 'COMPLETED';
  paidAmount: number;
  paymentStatus: 'PAID' | 'PENDING' | 'FREE_PREVIEW';
  resultId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface GurujiPredictionResult {
  id: string;
  requestId: string;
  requestNumber: string;
  customerName: string;
  serviceType: string;
  dob: string;
  birthPlace: string;
  calculationDate: string;
  engineProvider: string; // e.g. "Vedic Astronomical Planetary Ephemeris Engine v4.2" or "Verified Astrologer Consultation"
  expertName?: string;
  sunSign: string;
  moonSign: string;
  ascendantSign: string;
  nakshatra: string;
  planetaryPositions: { planet: string; sign: string; house: number; degree: string; isRetrograde: boolean }[];
  lifeAspectInsights: { aspect: string; scoreOutOf100: number; reading: string; remedies: string[] }[];
  yearlyForecastOverview: string;
  spiritualGuidanceNotes: string;
  disclaimer: string;
  pdfDownloadUrl?: string;
  createdAt: string;
}

export interface GurujiBlessingWallSubmission {
  id: string;
  submissionNumber: string;
  userName: string;
  city?: string;
  message: string;
  uploadedPhotoUrl?: string;
  category: 'Gratitude' | 'Prayer' | 'Festival Greeting' | 'Inspirational';
  status: 'PENDING_MODERATION' | 'APPROVED' | 'REJECTED';
  moderationNotes?: string;
  approvedAt?: string;
  likesCount: number;
  createdAt: string;
}

export interface GurujiInquiry {
  id: string;
  inquiryNumber: string;
  serviceSlug?: string;
  serviceTitle: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerWhatsapp?: string;
  requirement: string;
  preferredDate?: string;
  budget?: string;
  attachmentUrl?: string;
  message: string;
  status: 'NEW' | 'CONTACTED' | 'IN_PROGRESS' | 'COMPLETED' | 'ARCHIVED';
  adminNotes?: string;
  createdAt: string;
}

export interface GurujiPlatformStats {
  totalPublishedArtworks: number;
  totalBlessings: number;
  totalVerifiedExperts: number;
  totalConsultationsCompleted: number;
  totalWallSubmissionsApproved: number;
  totalDownloads: number;
}

// ============================================================
// PV LABS-INSPIRED E-COMMERCE VISUAL PRODUCTION PLATFORM TYPES
// ============================================================

export type EcomProductionCategory =
  | 'hero_white_bg'
  | 'ghost_mannequin'
  | 'lifestyle_staging'
  | 'infographics'
  | 'recoloring'
  | 'packaging_3d'
  | 'full_pack';

export type EcomProjectStatus =
  | 'draft'
  | 'submitted'
  | 'in_production'
  | 'qa_review'
  | 'revision_requested'
  | 'approved'
  | 'delivered'
  | 'archived';

export interface EcomAnnotationPin {
  id: string;
  x: number; // percentage 0-100
  y: number; // percentage 0-100
  comment: string;
  author: string;
  createdAt: string;
  resolved: boolean;
}

export interface EcomProjectAsset {
  id: string;
  fileName: string;
  fileUrl: string;
  fileType: 'raw_input' | 'processed_preview' | 'highres_final' | 'psd_source';
  stage: 'input' | 'wip' | 'qa_pending' | 'delivered';
  fileSizeBytes?: number;
  width?: number;
  height?: number;
  aspectRatio?: string;
  beforeUrl?: string;
  afterUrl?: string;
  annotations?: EcomAnnotationPin[];
}

export interface EcomVisualRevision {
  id: string;
  revisionNumber: number;
  feedbackType: 'color_tweak' | 'shadow_fix' | 'edge_cleanup' | 'align_crop' | 'text_change' | 'other';
  notes: string;
  pins: EcomAnnotationPin[];
  status: 'open' | 'addressed' | 'resolved';
  createdAt: string;
}

export interface EcomDeliverable {
  id: string;
  title: string;
  format: 'JPG' | 'PNG' | 'WEBP' | 'PSD' | 'TIFF';
  resolution: string;
  downloadUrl: string;
  fileSize: string;
  dimensions: string;
  marketplaceOptimized: string;
}

export interface MarketplaceSpec {
  id: string;
  platform: 'amazon' | 'flipkart' | 'shopify' | 'etsy' | 'zepto' | 'blinkit' | 'myntra' | string;
  name: string;
  recommendedDimensions: string;
  aspectRatio: string;
  backgroundColor: string;
  maxFileSize: string;
  allowedFormats: string[];
  productFillPercentage: string;
  rules: string[];
  region?: string;
  minWidth?: number;
  minHeight?: number;
  recommendedWidth?: number;
  recommendedHeight?: number;
  maxFileSizeMb?: number;
}

export interface EcomVisualProject {
  id: string;
  userId?: string;
  brandName: string;
  title: string;
  category: EcomProductionCategory;
  targetMarketplaces: string[];
  skuCount: number;
  totalImagesRequested: number;
  rushDelivery: boolean;
  aspectRatios: string[];
  status: EcomProjectStatus;
  progressPercent: number;
  clientName: string;
  clientEmail: string;
  clientPhone?: string;
  brief: string;
  assignedDesigner?: string;
  assignedQA?: string;
  assets: EcomProjectAsset[];
  revisions: EcomVisualRevision[];
  deliverables: EcomDeliverable[];
  createdAt: string;
  updatedAt: string;
}

// ==========================================
// BULK IMAGE PROCESSING & RESIZER STUDIO TYPES
// ==========================================

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
  quality: number;
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

export interface ProcessedImageItem {
  id: string;
  file: File;
  previewUrl: string;
  name: string;
  originalWidth: number;
  originalHeight: number;
  originalSizeBytes: number;
  originalFormat: string;
  status: 'queued' | 'processing' | 'completed' | 'failed';
  error?: string;
  progressPercent: number;
  outputBlob?: Blob;
  outputUrl?: string;
  outputWidth?: number;
  outputHeight?: number;
  outputSizeBytes?: number;
  outputFormat?: string;
  outputFileName?: string;
  savedBytes?: number;
  savedPercentage?: number;
}

