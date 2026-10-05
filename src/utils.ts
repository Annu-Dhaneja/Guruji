import { doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore';
import { db } from './firebase';
import { getAdminToken } from './utils/adminApi';
import {
  ServiceItem,
  ProductItem,
  AIPromptItem,
  DefaultLinks,
  ThemeSettings,
  HeaderSettings,
  FooterSettings,
  SiteSettings,
  GraphicDesignCategory,
  GraphicDesignService,
  GraphicDesignSettings,
  GurujiCategoryItem,
  GurujiArtwork,
  MarketplaceBundle,
  GurujiDailyBlessing,
  GurujiExpert,
  VantageService,
  PhotoshopWorkflow,
  PhotoshopTemplate,
  PhotoshopSavedPrompt,
  QuickDigitalService,
} from './types';
import {
  GRAPHIC_DESIGN_SERVICES,
  GRAPHIC_DESIGN_MAIN_CATEGORIES,
} from './data/graphicDesignData';

const DEFAULT_GRAPHIC_DESIGN_SETTINGS: GraphicDesignSettings = {
  heroBadge: 'Delhi NCR Premier Digital Studio',
  heroTitle: 'Express Graphic Design & Creative Branding',
  heroSub: 'High-converting graphics delivered in as fast as 10 minutes by Annu Dhaneja.',
  whatsappNumber: '+918527837527',
  marqueeItems: [
    { text: '10-Min Fast Delivery', icon: 'Zap', highlight: true },
    { text: 'Vector Source Files Included', icon: 'Sparkles', highlight: false },
    { text: '100% Satisfaction Guarantee', icon: 'CheckCircle2', highlight: true },
  ],
  deliveryTiers: [],
};
import {
  INITIAL_GURUJI_CATEGORIES,
  INITIAL_GURUJI_ARTWORKS,
  INITIAL_GURUJI_BLESSINGS,
  INITIAL_GURUJI_EXPERTS,
} from './data/gurujiArtworkData';
import { MARKETPLACE_BUNDLES } from './data/marketplaceData';
import { mockVantageServices } from './data/servicesData';

export interface CMSData {
  pageContents: Record<string, any>;
  services: ServiceItem[];
  products: ProductItem[];
  graphicDesignCategories: GraphicDesignCategory[];
  graphicDesignServices: GraphicDesignService[];
  graphicDesignSettings: GraphicDesignSettings;
  gurujiCategories: GurujiCategoryItem[];
  gurujiArtworks: GurujiArtwork[];
  gurujiBundles: MarketplaceBundle[];
  gurujiBlessings: GurujiDailyBlessing[];
  gurujiExperts: GurujiExpert[];
  categories: any[];
  menus: {
    header: Array<{ id: string; label: string; url: string; order?: number }>;
    footer: Array<{ id: string; label: string; url: string; order?: number }>;
    mobile: Array<{ id: string; label: string; url: string; order?: number }>;
    secondary: Array<{ id: string; label: string; url: string; order?: number }>;
  };
  socialLinks: any[];
  defaultLinks: DefaultLinks;
  seo: Record<string, any>;
  theme: ThemeSettings;
  header: HeaderSettings;
  footer: FooterSettings;
  siteSettings: SiteSettings;
  paymentSettings: Record<string, any>;
  vantageServices: VantageService[];
  vantageBeforeAfter: any[];
  photoshopWorkflows: PhotoshopWorkflow[];
  photoshopTemplates: PhotoshopTemplate[];
  photoshopSavedPrompts: PhotoshopSavedPrompt[];
  quickServices: QuickDigitalService[];
  prompts: AIPromptItem[];
  bookCoverPackages: any[];
  bookCoverQuestions: any[];
  lastUpdated?: string;
  updatedBy?: string;
}

export const DEFAULT_CMS_DATA: CMSData = {
  pageContents: {
    home: {
      hero: {
        heading: 'Elevate Your Vision with GurucraftPro',
        subheading: 'Annu Dhaneja\'s Creative Studio • Rohini, Delhi',
        description: 'From high-converting Amazon e-commerce photo editing and custom graphic design to personalized 7-day capsule wardrobe styling, sacred Guruji spiritual artwork, and AI prompt engineering.',
        heroImage: 'https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?auto=format&fit=crop&w=1200&q=80',
        heroVideoUrl: '',
        primaryCtaText: 'Start 7-Day Wardrobe Consultation',
        primaryCtaLink: 'wardrobe-planner',
        secondaryCtaText: 'Explore Design Services',
        secondaryCtaLink: 'graphic-design',
        badgeText: 'Annu Dhaneja\'s Creative Studio • Rohini, Delhi',
        animation: 'fade-up',
        visible: true,
      },
      services: {
        title: 'Our Premium Creative Services',
        subtitle: 'Tailored graphic design, fashion styling, and e-commerce visual engineering.',
        visible: true,
        items: [
          { id: 'srv-gd-1', title: 'Brand Identity & Vector Logo Package', description: 'Custom vector logo design, brand typography, color palette, and business card assets.', image: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?auto=format&fit=crop&w=800&q=80', link: 'graphic-design', order: 1, visible: true },
          { id: 'srv-ws-1', title: '7-Day Capsule Wardrobe Consultation', description: 'Upload your clothes & receive a 7-day capsule outfit plan with shoes & accessory pairings.', image: 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?auto=format&fit=crop&w=800&q=80', link: 'wardrobe-planner', order: 2, visible: true },
          { id: 'srv-ve-1', title: 'Amazon & Flipkart Pure White BG Removal', description: 'Bulk product photo editing compliant with Amazon RGB 255 white BG standards.', image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80', link: 'vantage-ecom', order: 3, visible: true },
          { id: 'srv-bc-1', title: 'Bestselling Book Cover & KDP Layout', description: 'Custom Kindle, paperback, hardcover, and print-ready book cover designs.', image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80', link: 'book-cover', order: 4, visible: true },
        ],
      },
      featuredProducts: {
        title: 'Featured Store & Divine Collections',
        subtitle: 'Handcrafted bracelets, digital sticker packs & 4K wallpapers.',
        visible: true,
        productIds: ['prod-1', 'prod-2', 'prod-3', 'prod-4'],
      },
      whyChoose: {
        title: 'Why Clients Choose GurucraftPro',
        subtitle: 'Uncompromising creative craftsmanship led by Annu Dhaneja.',
        visible: true,
        cards: [
          { id: 'wc-1', title: 'Creative Expertise', description: 'Over 8 years of specialized experience in graphic design and personal styling.', icon: 'Sparkles', order: 1, visible: true },
          { id: 'wc-2', title: 'Professional Quality', description: 'Pixel-perfect vector source files, CMYK print files, and 300 DPI outputs.', icon: 'CheckCircle2', order: 2, visible: true },
          { id: 'wc-3', title: 'Fast Delivery', description: 'Rapid 24-48 hour turnarounds on Amazon e-commerce photo edits and graphics.', icon: 'Zap', order: 3, visible: true },
          { id: 'wc-4', title: 'Custom Solutions', description: '1-on-1 personalized wardrobe lookbooks and tailored book cover artwork.', icon: 'Shirt', order: 4, visible: true },
          { id: 'wc-5', title: 'Digital Services', description: 'Direct PDF downloads, vector files, and Canva editable links.', icon: 'FileText', order: 5, visible: true },
          { id: 'wc-6', title: 'Secure & Reliable', description: 'Encrypted Razorpay checkout, direct WhatsApp consultation, and clear revisions.', icon: 'ShieldCheck', order: 6, visible: true },
        ],
      },
      portfolio: {
        title: 'Featured Client Portfolio',
        subtitle: 'A glimpse of our recent branding, book cover, and e-commerce projects.',
        visible: true,
        items: [
          { id: 'port-1', title: 'Royal Heritage Jewelry Branding', description: 'Vector logo, gold foil luxury visiting cards & packaging.', image: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?auto=format&fit=crop&w=800&q=80', category: 'Graphic Design', link: 'graphic-design', order: 1, visible: true },
          { id: 'port-2', title: 'The Shadows of Hastinapur Book Cover', description: 'Bestselling Amazon KDP paperback layout with calculated spine.', image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80', category: 'Book Cover', link: 'book-cover', order: 2, visible: true },
          { id: 'port-3', title: 'Amazon Luxury Watch Photo Editing', description: 'Pure white RGB 255 background removal with soft shadow.', image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80', category: 'Vantage Ecom', link: 'vantage-ecom', order: 3, visible: true },
        ],
      },
      testimonials: {
        title: 'What Our Clients Say',
        visible: true,
        items: [
          { id: 'test-1', customerName: 'Rohan Mehta', role: 'Amazon Seller', quote: 'Annu Dhaneja transformed our product listings! The background removal and white BG edits boosted our click-through rate by 35%.', image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80', rating: 5, order: 1, visible: true },
          { id: 'test-2', customerName: 'Dr. Sunita Kapoor', role: 'Author', quote: 'The book cover design for my KDP paperback was stunning. Annu understood my story concept instantly and delivered in 2 days.', image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80', rating: 5, order: 2, visible: true },
          { id: 'test-3', customerName: 'Meenakshi Sundaram', role: 'Executive Client', quote: 'The 7-day capsule wardrobe consultation saved me so much time every morning! Her outfit combinations with shoes and jewelry were spot on.', image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80', rating: 5, order: 3, visible: true },
        ],
      },
      faq: {
        title: 'Frequently Asked Questions',
        visible: true,
        items: [
          { id: 'faq-1', question: 'How do I get started with a design project or wardrobe consultation?', answer: 'Simply select your desired service or wardrobe package, fill out the brief form, and pay securely via Razorpay or WhatsApp Annu Dhaneja directly at +91 85278 37527.', order: 1, visible: true },
          { id: 'faq-2', question: 'Where is GurucraftPro Studio located?', answer: 'Our physical studio is located in Rohini, Delhi, India. We serve clients across Delhi NCR and globally online.', order: 2, visible: true },
          { id: 'faq-3', question: 'What file formats do I receive for graphic design and book covers?', answer: 'You receive high-resolution print-ready PDFs (300 DPI CMYK), vector AI/SVG source files, transparent PNGs, and digital 3D mockups.', order: 3, visible: true },
        ],
      },
      cta: {
        heading: 'Ready to Transform Your Visual Brand or Wardrobe?',
        description: 'Connect directly with Annu Dhaneja for personalized quotes, quick turnarounds, and creative excellence.',
        buttonText: 'Contact Studio on WhatsApp',
        buttonLink: 'https://wa.me/918527837527',
        bgImage: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?auto=format&fit=crop&w=1200&q=80',
        visible: true,
      },
    },
    wardrobe: {
      serviceSettings: {
        title: '7-Day Capsule Wardrobe & Style Consultation',
        description: 'Upload your clothes and receive a custom 7-day outfit plan with shoe & jewelry pairings by Annu Dhaneja.',
        image: 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?auto=format&fit=crop&w=1200&q=80',
        price: 1499,
        discount: 25,
        duration: '48-72 Hours',
        availability: 'Available Daily',
        status: 'Active',
        visible: true,
      },
    },
  },
  services: [
    {
      id: 'srv-gd-1',
      title: 'Brand Identity & Vector Logo Package',
      category: 'graphic-design',
      categoryName: 'Graphic Design',
      startingPrice: 1999,
      description: 'Custom vector logo design, brand typography, color palette, business card layout, and social media profile assets.',
      imageUrl: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?auto=format&fit=crop&w=1200&q=80',
      features: ['3 Logo Concepts', 'Vector Source Files (AI/SVG/PNG)', 'Business Card Mockup', '3 Revisions Included'],
    },
    {
      id: 'srv-gd-2',
      title: 'Instagram & Social Media Banner Bundle',
      category: 'graphic-design',
      categoryName: 'Graphic Design',
      startingPrice: 1499,
      description: '10 High-converting Instagram post graphics, carousel templates, story banners, and YouTube thumbnails.',
      imageUrl: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&w=1200&q=80',
      features: ['10 Custom Graphics', 'Canva Editable Links', 'High-Res PNG Output', '24-48 hr Delivery'],
    },
    {
      id: 'srv-ws-1',
      title: '7-Day Capsule Wardrobe Consultation',
      category: 'wardrobe-consultation',
      categoryName: 'Wardrobe Style',
      startingPrice: 1499,
      description: 'Upload your clothes and receive a personalized 7-day capsule outfit plan with shoes & accessory pairings by Annu Dhaneja.',
      imageUrl: 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?auto=format&fit=crop&w=1200&q=80',
      features: ['7 Complete Daily Outfits', 'Color Harmony Matrix', 'Shoe & Jewelry Pairing', 'PDF Style Guide Download'],
    },
    {
      id: 'srv-ve-1',
      title: 'Amazon & Flipkart Pure White BG Removal',
      category: 'vantage-marketplace',
      categoryName: 'Vantage Ecom',
      startingPrice: 499,
      description: 'Bulk product photo editing compliant with Amazon RGB 255,255,255 standards, soft shadow addition, & cropping.',
      imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1200&q=80',
      features: ['Amazon RGB 255 White BG', 'Drop/Reflective Shadow', 'Bulk Batch Discount', 'Fast Turnaround'],
    },
    {
      id: 'srv-bc-1',
      title: 'Amazon KDP Paperback & Kindle Cover',
      category: 'book-cover',
      categoryName: 'Book Cover Design',
      startingPrice: 1299,
      description: 'Front, back, spine, Paperback, Hardcover, Kindle thumbnail, and 3D photorealistic mockups.',
      imageUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=1200&q=80',
      features: ['KDP Print-Ready PDF', '3D Promo Mockup', 'Barcode Placeholder', 'Hindi & English Fonts'],
    },
  ],
  products: [
    {
      id: 'prod-1',
      name: 'Jai Guruji Divine Lotus Blessings Swaroop Frame',
      category: 'guruji-products',
      categoryName: 'Sacred Acrylic Frames',
      price: 1299,
      discountPrice: 1899,
      previewUrl: 'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?auto=format&fit=crop&w=1200&q=80',
      description: 'High-gloss acrylic sacred Swaroop frame with laser-cut golden borders and protective UV-coated acrylic shield.',
      isDigital: false,
      tags: ['Bestseller', 'Acrylic', 'Guruji Frame'],
    },
    {
      id: 'prod-2',
      name: 'Sacred Guruji Blessing Band / Karah Combo',
      category: 'accessories',
      categoryName: 'Blessed Accessories',
      price: 499,
      discountPrice: 799,
      previewUrl: 'https://images.unsplash.com/photo-1611591475102-46887c6be78c?auto=format&fit=crop&w=1200&q=80',
      description: 'Consecrated stainless steel blessed bracelet engraved with sacred Om and Jai Guru Ji inscription.',
      isDigital: false,
      tags: ['Popular', 'Blessed Band', 'Karah'],
    },
  ],
  graphicDesignCategories: GRAPHIC_DESIGN_MAIN_CATEGORIES,
  graphicDesignServices: GRAPHIC_DESIGN_SERVICES,
  graphicDesignSettings: DEFAULT_GRAPHIC_DESIGN_SETTINGS,
  gurujiCategories: INITIAL_GURUJI_CATEGORIES,
  gurujiArtworks: INITIAL_GURUJI_ARTWORKS,
  gurujiBundles: MARKETPLACE_BUNDLES,
  gurujiBlessings: INITIAL_GURUJI_BLESSINGS,
  gurujiExperts: INITIAL_GURUJI_EXPERTS,
  categories: [
    { id: 'cat-1', name: 'Graphic Design', slug: 'graphic-design', group: 'graphic-design', description: 'Logo, branding, and print media', image: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?auto=format&fit=crop&w=800&q=80' },
    { id: 'cat-2', name: 'Wardrobe Style', slug: 'wardrobe-consultation', group: 'wardrobe-consultation', description: '7-day capsule and lookbooks', image: 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?auto=format&fit=crop&w=800&q=80' },
    { id: 'cat-3', name: 'Vantage Ecom', slug: 'vantage-marketplace', group: 'vantage-marketplace', description: 'Amazon white BG cutouts', image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80' },
    { id: 'cat-4', name: 'Book Cover', slug: 'book-cover', group: 'book-cover', description: 'KDP paperback & Kindle covers', image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80' },
  ],
  menus: {
    header: [
      { id: 'm-1', label: 'Home', url: '/' },
      { id: 'm-2', label: 'Graphic Design', url: '/graphic-design' },
      { id: 'm-3', label: 'Wardrobe Stylist', url: '/wardrobe' },
      { id: 'm-4', label: 'Vantage E-Com', url: '/vantage-ecom' },
      { id: 'm-5', label: 'Book Covers', url: '/book-cover' },
      { id: 'm-6', label: 'Guruji Store', url: '/guruji-artwork' },
      { id: 'm-7', label: 'AI Prompts', url: '/learn-ai-prompts' },
      { id: 'm-8', label: 'About Us', url: '/about' },
      { id: 'm-9', label: 'Contact', url: '/contact' },
    ],
    footer: [
      { id: 'f-1', label: 'Services Catalog', url: '/services' },
      { id: 'f-2', label: 'Book Cover Design Studio', url: '/book-cover' },
      { id: 'f-3', label: '7-Day Capsule Wardrobe', url: '/wardrobe' },
      { id: 'f-4', label: 'Guruji Divine Store', url: '/guruji-artwork' },
      { id: 'f-5', label: 'Privacy Policy', url: '/privacy' },
      { id: 'f-6', label: 'Terms of Service', url: '/terms' },
    ],
    mobile: [],
    secondary: [],
  },
  socialLinks: [
    { id: 'sl-1', platformName: 'Instagram', iconName: 'Instagram', url: 'https://instagram.com/gurucraftpro', label: 'Follow on Instagram', openInNewTab: true, active: true, category: 'social', location: ['header', 'footer', 'contact'] },
    { id: 'sl-2', platformName: 'WhatsApp', iconName: 'MessageCircle', url: 'https://wa.me/918527837527', label: 'WhatsApp Annu Dhaneja', openInNewTab: true, active: true, category: 'social', location: ['header', 'footer', 'contact', 'product'] },
    { id: 'sl-3', platformName: 'YouTube Channel', iconName: 'Youtube', url: 'https://youtube.com/@gurucraftpro', label: 'Watch Design Tutorials', openInNewTab: true, active: true, category: 'social', location: ['footer', 'contact'] },
    { id: 'sl-4', platformName: 'Amazon Store', iconName: 'ShoppingBag', url: 'https://amazon.in/s?k=GurucraftPro', label: 'Buy on Amazon', openInNewTab: true, active: true, category: 'marketplace', location: ['footer', 'product'] },
  ],
  defaultLinks: {
    instagramUrl: 'https://instagram.com/gurucraftpro',
    facebookUrl: 'https://facebook.com/gurucraftpro',
    youtubeUrl: 'https://youtube.com/@gurucraftpro',
    amazonUrl: 'https://amazon.in/s?k=GurucraftPro',
    flipkartUrl: 'https://flipkart.com/search?q=GurucraftPro',
    etsyUrl: 'https://etsy.com/shop/GurucraftPro',
    whatsappUrl: 'https://wa.me/918527837527',
    contactUrl: 'mailto:annudhaneja@gmail.com',
    portfolioUrl: 'https://gurucraftpro.com',
    directPhone: '8527837527',
    directEmail: 'annudhaneja@gmail.com',
  },
  seo: {
    homepage: {
      id: 'seo-home',
      seoTitle: 'Gurucraftpro — Creative Graphic Design, Book Covers & Digital Studio in Rohini, Delhi',
      metaDescription: 'Top-rated design studio in Rohini, Delhi by Annu Dhaneja. Logo design, KDP book covers, Amazon product retouching, wardrobe styling & spiritual Guruji artwork.',
      canonicalUrl: 'https://gurucraftpro.com',
      robotsIndex: true,
      robotsFollow: true,
    },
  },
  theme: {
    preset: 'Modern',
    primaryColor: '#9333ea',
    secondaryColor: '#14b8a6',
    accentColor: '#f59e0b',
    backgroundColor: '#090d16',
    surfaceColor: '#111827',
    cardColor: '#1e293b',
    textColor: '#f8fafc',
    mutedTextColor: '#94a3b8',
    borderColor: '#334155',
    mode: 'dark',
    containerWidth: 'max-w-7xl',
    sectionSpacing: 'py-20',
    cardRadius: 'rounded-2xl',
    buttonRadius: 'rounded-xl',
    headerHeight: 'h-20',
  },
  header: {
    showLogo: true,
    logoSize: 40,
    showNav: true,
    showCta: true,
    ctaText: 'Book Consultation',
    ctaUrl: '/wardrobe',
    showSearch: true,
    showThemeToggle: true,
    showCart: true,
    showWhatsApp: true,
  },
  footer: {
    showLogo: true,
    description: 'Crafting High-Converting Visuals & Styled Wardrobes from Rohini, Delhi to the World.',
    showQuickLinks: true,
    showServices: true,
    showSocials: true,
    showMarketplaces: true,
    showContact: true,
    showWhatsApp: true,
    copyrightText: '© 2026 GurucraftPro by Annu Dhaneja. All Rights Reserved.',
  },
  siteSettings: {
    contactName: 'Annu Dhaneja',
    contactPhone: '+91 85278 37527',
    contactEmail: 'annudhaneja@gmail.com',
    contactLocation: 'Sector 8, Rohini, Delhi 110085, India',
    googleMapsEmbedUrl: 'https://maps.google.com/?q=GurucraftPro+Rohini+Delhi',
    aboutText: 'GurucraftPro is Annu Dhaneja\'s dedicated creative studio offering branding, styling, and e-commerce visuals.',
    missionText: 'Deliver pixel-perfect, high-converting creative solutions with speed and personalized care.',
    visionText: 'Empower businesses and individuals worldwide with standout visual identities and wardrobes.',
    maintenanceMode: false,
  },
  paymentSettings: {
    enabled: true,
    gateway: 'razorpay',
    merchantName: 'GurucraftPro Studio',
    currency: 'INR',
    testMode: false,
  },
  vantageServices: mockVantageServices,
  vantageBeforeAfter: [
    {
      id: 'ba-1',
      title: 'Luxury Chronograph Watch Retouching',
      category: 'watches-jewelry',
      beforeImage: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=600&q=80',
      afterImage: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80',
      description: 'Dust scratch removal, bezel contrast tuning, and pure RGB 255 white background.',
      clientName: 'Timepiece Emporium',
      completionTime: '4 Hours',
      featured: true,
    },
  ],
  photoshopWorkflows: [],
  photoshopTemplates: [],
  photoshopSavedPrompts: [],
  quickServices: [],
  prompts: [],
  bookCoverPackages: [],
  bookCoverQuestions: [],
  lastUpdated: new Date().toISOString(),
  updatedBy: 'system-init',
};

/**
 * Loads the complete CMS dataset directly from Firestore (collection: 'cms', document: 'main').
 * If cms/main does not exist, it bootstraps it ONCE with DEFAULT_CMS_DATA.
 * Throws on failure to ensure NO silent fallback to localStorage.
 */
export async function getCMSData(): Promise<CMSData> {
  try {
    const docRef = doc(db, 'cms', 'main');
    const snap = await getDoc(docRef);

    if (!snap.exists()) {
      console.log('[Firestore CMS] Initializing cms/main with baseline CMS data...');
      const initialPayload: CMSData = {
        ...DEFAULT_CMS_DATA,
        lastUpdated: new Date().toISOString(),
        updatedBy: 'system-bootstrap',
      };
      await setDoc(docRef, initialPayload);
      return initialPayload;
    }

    const data = snap.data() as CMSData;
    return {
      ...DEFAULT_CMS_DATA,
      ...data,
    };
  } catch (err: any) {
    console.error('[Firestore CMS] Error loading cms/main from Firestore:', err);
    throw new Error(`Failed to load CMS data from Firestore: ${err?.message || err}`);
  }
}

/**
 * Saves updated CMS dataset directly to Firestore (collection: 'cms', document: 'main').
 * Confirms asynchronously after Firestore successfully confirms the write.
 * Throws on error to allow the calling UI to display accurate error states.
 */
export async function saveCMSData(updatedData: Partial<CMSData>): Promise<void> {
  const adminToken = getAdminToken();
  if (!adminToken) {
    throw new Error('Unauthorized: Active administrator authentication is required to write to Firestore CMS.');
  }

  try {
    const docRef = doc(db, 'cms', 'main');
    const cleanPayload = {
      ...updatedData,
      lastUpdated: new Date().toISOString(),
      updatedBy: 'admin-dashboard',
    };
    await setDoc(docRef, cleanPayload, { merge: true });
    console.log('[Firestore CMS] Successfully saved updated CMS data to Firestore (cms/main).');
  } catch (err: any) {
    console.error('[Firestore CMS] Save failed in Firestore:', err);
    throw new Error(`Failed to save CMS data to Firestore: ${err?.message || err}`);
  }
}

/**
 * Updates a specific key/section in Firestore cms/main.
 */
export async function saveCMSSection<K extends keyof CMSData>(
  sectionKey: K,
  sectionValue: CMSData[K]
): Promise<void> {
  const adminToken = getAdminToken();
  if (!adminToken) {
    throw new Error('Unauthorized: Active administrator authentication is required to write to Firestore CMS.');
  }

  try {
    const docRef = doc(db, 'cms', 'main');
    await setDoc(
      docRef,
      {
        [sectionKey]: sectionValue,
        lastUpdated: new Date().toISOString(),
        updatedBy: 'admin-section-save',
      },
      { merge: true }
    );
  } catch (err: any) {
    console.error(`[Firestore CMS] Failed to save section "${String(sectionKey)}":`, err);
    throw new Error(`Failed to save section "${String(sectionKey)}" to Firestore: ${err?.message || err}`);
  }
}

/**
 * Real-time listener for CMS changes in Firestore (cms/main).
 */
export function subscribeCMSData(
  onUpdate: (data: CMSData) => void,
  onError?: (err: Error) => void
): () => void {
  const docRef = doc(db, 'cms', 'main');
  return onSnapshot(
    docRef,
    (snap) => {
      if (snap.exists()) {
        const data = snap.data() as CMSData;
        onUpdate({
          ...DEFAULT_CMS_DATA,
          ...data,
        });
      } else {
        // Bootstrap if document does not exist yet
        setDoc(docRef, { ...DEFAULT_CMS_DATA, lastUpdated: new Date().toISOString() })
          .then(() => onUpdate(DEFAULT_CMS_DATA))
          .catch((err) => {
            if (onError) onError(new Error(err?.message || err));
          });
      }
    },
    (err) => {
      console.error('[Firestore CMS] Subscription error:', err);
      if (onError) onError(new Error(`Firestore listener error: ${err.message}`));
    }
  );
}
