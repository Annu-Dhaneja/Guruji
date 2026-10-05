import { GRAPHIC_DESIGN_SERVICES, GraphicDesignService, GraphicDesignPackage } from './graphicDesignData';

export interface ProductItem {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  category: 'Perfume' | 'Shoes' | 'Watches' | 'Bags' | 'Accessories' | 'Cosmetics' | 'Electronics' | 'Digital Services' | string;
  price: number;
  salePrice?: number;
  originalPrice: number;
  rating: number;
  reviewsCount: number;
  deliveryTime: string;
  shortDescription: string;
  fullDescription: string;
  features: string[];
  specs: { label: string; value: string }[];
  mainImage: string;
  rotationImages?: string[]; // multi-angle frames or procedural 3D model
  badge?: string;
  inStock: boolean;
  packages?: GraphicDesignPackage[];
  deliverables?: string[];
  requirements?: string[];
  revisions?: string;
  turnaroundTime?: string;
  faqs?: { question: string; answer: string }[];
  reviews?: { name: string; rating: number; date: string; comment: string; verified: boolean; avatar?: string }[];
  tags?: string[];
}

export const SHOWCASE_PRODUCTS: ProductItem[] = [
  {
    id: 'prod-perfume',
    slug: 'perfume',
    title: 'Velvet Oud & Amber Extrait de Parfum',
    subtitle: 'Niche Luxury Fragrance • 100ml Edition',
    category: 'Perfume',
    price: 3499,
    originalPrice: 4999,
    rating: 4.9,
    reviewsCount: 384,
    deliveryTime: '24-48 Hours Express',
    shortDescription: 'Captivating sensual blend of smoky Cambodian oud, Bulgarian rose petals, and warm golden amber in heavy lead crystal.',
    fullDescription: 'Crafted in collaboration with master perfumers in Grasse, Velvet Oud represents the pinnacle of olfactory luxury. Housed in a hand-polished obsidian glass flacon topped with a gold-plated magnetic cap.',
    features: [
      'Extrait de Parfum (30% pure oil concentration)',
      '12+ hours enduring sillage on fabric and skin',
      'Heavy bespoke crystalline flacon with magnetic closure',
      'Sustainably sourced Cambodian wild oud & damask rose',
    ],
    specs: [
      { label: 'Volume', value: '100ml / 3.4 FL OZ' },
      { label: 'Fragrance Family', value: 'Oriental Woody Floral' },
      { label: 'Top Notes', value: 'Bergamot, Saffron, Pink Pepper' },
      { label: 'Heart Notes', value: 'Bulgarian Rose, Smoked Leather' },
      { label: 'Base Notes', value: 'Cambodian Oud, Amber, Vanilla' },
    ],
    mainImage: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=1000&q=85',
    badge: 'LUXURY SELECTION',
    inStock: true,
  },
  {
    id: 'prod-shoes',
    slug: 'shoes',
    title: 'Apex Aero-Flow Minimalist Sneakers',
    subtitle: 'High-Performance Studio Footwear • Edition V',
    category: 'Shoes',
    price: 4999,
    originalPrice: 6999,
    rating: 4.8,
    reviewsCount: 512,
    deliveryTime: 'Same Day Dispatch',
    shortDescription: 'Ultra-lightweight aerodynamic mesh runner featuring nitrogen-infused kinetic cushioning and sculpted rubber outsole.',
    fullDescription: 'Designed for city creatives and runners who demand effortless posture and striking silhouettes. The seamless 3D knit upper contours to your foot, while the dual-density nitrogen foam provides unmatched energy return.',
    features: [
      'Zero-seam breathable 3D knit engineered upper',
      'Kinetic foam midsole with 72% energy return',
      'Non-slip wet-grip sculpted rubber tread',
      'Ergonomic memory-foam arch support insole',
    ],
    specs: [
      { label: 'Upper', value: 'Recycled Poly-Knit' },
      { label: 'Midsole', value: 'Infused Kinetic Foam' },
      { label: 'Weight', value: '245g (Size 9)' },
      { label: 'Drop', value: '8mm Heel-to-Toe' },
      { label: 'Origin', value: 'Italian Design Lab' },
    ],
    mainImage: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1000&q=85',
    badge: 'BESTSELLER',
    inStock: true,
  },
  {
    id: 'prod-watch',
    slug: 'watch',
    title: 'Obsidian Chronograph Automatic',
    subtitle: 'Swiss Movement • Sapphire Crystal Exhibition Case',
    category: 'Watches',
    price: 14999,
    originalPrice: 19999,
    rating: 5.0,
    reviewsCount: 219,
    deliveryTime: 'Next Day Insured Courier',
    shortDescription: 'Precision 28,800 vph automatic caliber with matte black dial, ceramic tachymeter bezel, and interchangeable milanese mesh strap.',
    fullDescription: 'A statement of industrial elegance. Machined from aerospace-grade 316L surgical stainless steel with a diamond-hard DLC coating. The exhibition back reveals the gilded rotor oscillating with micro-rotor precision.',
    features: [
      'Automatic 28-jewel mechanical chronograph movement',
      'Anti-reflective dual-domed scratchproof sapphire crystal',
      '100M / 10 ATM Water Resistance with screw-down crown',
      'Super-LumiNova BGW9 luminous indices & sword hands',
    ],
    specs: [
      { label: 'Case Diameter', value: '41mm' },
      { label: 'Case Thickness', value: '11.8mm' },
      { label: 'Material', value: '316L Steel DLC Coated' },
      { label: 'Power Reserve', value: '48 Hours' },
      { label: 'Warranty', value: '5 Years International' },
    ],
    mainImage: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1000&q=85',
    badge: 'HERITAGE CRAFT',
    inStock: true,
  },
  {
    id: 'prod-bags',
    slug: 'bags',
    title: 'Saffiano Executive Structured Tote',
    subtitle: 'Full-Grain Italian Leather • 16-Inch Laptop Compartment',
    category: 'Bags',
    price: 6499,
    originalPrice: 8999,
    rating: 4.9,
    reviewsCount: 178,
    deliveryTime: '24-48 Hours Express',
    shortDescription: 'Scratch-resistant cross-grain leather tote with reinforced brass hardware, velvet-lined tech sleeve, and detachable shoulder strap.',
    fullDescription: 'Engineered for founders and executives on the move. Stood on five protective metal feet, this structured tote keeps its architectural shape whether sitting under an aircraft seat or in a boardroom.',
    features: [
      'Certified Tuscan full-grain Saffiano leather',
      'Padded sleeve fits up to 16-inch MacBook Pro',
      'Brushed champagne-gold brass zippers & clips',
      'RFID-blocking quick-access passport pocket',
    ],
    specs: [
      { label: 'Dimensions', value: '42 x 30 x 14 cm' },
      { label: 'Weight', value: '1.15 kg' },
      { label: 'Handle Drop', value: '24 cm' },
      { label: 'Lining', value: 'Waterproof Micro-Suede' },
    ],
    mainImage: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=1000&q=85',
    badge: 'TIMELESS LUXURY',
    inStock: true,
  },
  {
    id: 'prod-cosmetics',
    slug: 'cosmetics',
    title: 'Cellular Peptide Radiance Elixir',
    subtitle: 'Tri-Phase Botanical Face Oil & Serum • 50ml',
    category: 'Cosmetics',
    price: 1899,
    originalPrice: 2699,
    rating: 4.8,
    reviewsCount: 420,
    deliveryTime: 'Same Day Dispatch',
    shortDescription: 'Cold-pressed squalane, marula oil, and bio-fermented peptides that restore the lipid barrier with a radiant glass-skin glow.',
    fullDescription: 'Formulated in Korea using low-temperature micro-emulsion technology. Delivers multi-molecular hydration deep within the epidermis without leaving oily residue. Housed in UV-protective frosted amber glass.',
    features: [
      '100% Vegan & cruelty-free cold-pressed botanical oils',
      'High-potency multi-peptide complex for elasticity',
      'Fast-absorbing zero-grease dry oil texture',
      'Dermatologically tested for hyper-sensitive skin',
    ],
    specs: [
      { label: 'Volume', value: '50ml / 1.7 FL OZ' },
      { label: 'Key Actives', value: 'Copper Tripeptide-1, Squalane' },
      { label: 'Skin Type', value: 'All Skin Types / Dehydrated' },
      { label: 'Packaging', value: 'Frosted Glass Dropper' },
    ],
    mainImage: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=1000&q=85',
    badge: 'CLEAN BEAUTY',
    inStock: true,
  },
  {
    id: 'prod-electronics',
    slug: 'electronics',
    title: 'AeroPulse Spatial Studio Headphones',
    subtitle: 'Adaptive Active Noise Cancellation • Lossless Audio',
    category: 'Electronics',
    price: 9999,
    originalPrice: 13999,
    rating: 4.9,
    reviewsCount: 630,
    deliveryTime: 'Express Courier 24H',
    shortDescription: 'Custom 45mm beryllium drivers, spatial audio tracking, memory-foam protein leather cups, and 40-hour battery endurance.',
    fullDescription: 'The pinnacle of acoustic precision for audio engineers and discerning music lovers. Featuring custom tuned planar magnetic transducers that reproduce sub-bass frequencies and crystalline highs with distortion under 0.05%.',
    features: [
      'Hybrid ANC with 6 beamforming noise-isolating mics',
      'High-Resolution Lossless Audio LDAC & aptX HD codecs',
      '40-hour playback with 10-minute fast charging',
      'Precision machined anodized aluminum gimbal & hinges',
    ],
    specs: [
      { label: 'Driver Size', value: '45mm Beryllium Coated' },
      { label: 'Frequency Response', value: '5Hz - 45,000Hz' },
      { label: 'Battery Life', value: '40 Hours (ANC On)' },
      { label: 'Connectivity', value: 'Bluetooth 5.3 + 3.5mm Jack' },
    ],
    mainImage: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1000&q=85',
    badge: 'HI-RES AUDIO',
    inStock: true,
  },
  {
    id: 'prod-accessories',
    slug: 'accessories',
    title: 'Aerospace Titanium Smart Ring',
    subtitle: 'Biometric Wellness & Sleep Tracker • Matte Obsidian',
    category: 'Accessories',
    price: 7999,
    originalPrice: 10999,
    rating: 4.8,
    reviewsCount: 295,
    deliveryTime: 'Next Day Air',
    shortDescription: 'Featherlight grade-5 titanium smart ring with medical-grade heart rate, HRV, blood oxygen, and sleep stage tracking.',
    fullDescription: 'Subtle, screenless wellness tracking that seamlessly blends into your everyday wardrobe. Waterproof up to 100 meters, with a battery life of up to 7 full days on a single magnetic inductive charge.',
    features: [
      'Grade 5 titanium outer shell with PVD scratch shield',
      'Medical-grade PPG optical biometric sensors',
      'Continuous skin temperature and HRV monitoring',
      '7 days battery life with wireless magnetic dock',
    ],
    specs: [
      { label: 'Weight', value: '4 grams' },
      { label: 'Thickness', value: '2.5 mm' },
      { label: 'Water Rating', value: '10 ATM (100m)' },
      { label: 'Compatibility', value: 'iOS & Android' },
    ],
    mainImage: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=1000&q=85',
    badge: 'SMART LUXURY',
    inStock: true,
  },
];

export const convertGraphicServiceToProduct = (srv: GraphicDesignService): ProductItem => ({
  id: srv.id,
  slug: srv.slug,
  title: srv.title,
  subtitle: `${srv.categoryName} • ${srv.standardDeliveryTime || 'Fast Delivery'}`,
  category: srv.categoryName || 'Graphic Design',
  price: srv.startingPrice,
  salePrice: (srv as any).salePrice,
  originalPrice: srv.originalPrice || Math.round(srv.startingPrice * 1.5),
  rating: srv.rating || 4.9,
  reviewsCount: srv.reviewsCount || 120,
  deliveryTime: srv.fastestDeliveryTime ? `${srv.fastestDeliveryTime} Express Delivery` : srv.standardDeliveryTime || '24 Hours',
  shortDescription: srv.shortDescription,
  fullDescription: srv.fullDescription,
  features: (srv as any).features && (srv as any).features.length > 0 ? (srv as any).features : srv.whatsIncluded || [],
  deliverables: (srv as any).deliverables && (srv as any).deliverables.length > 0 ? (srv as any).deliverables : srv.fileFormats || ['Vector AI/EPS', 'Print-Ready PDF', 'High-Res PNG'],
  revisions: srv.revisions || 'Unlimited Revisions',
  turnaroundTime: (srv as any).turnaroundTime || srv.standardDeliveryTime || '24 Hours',
  specs: [
    { label: 'Turnaround Time', value: (srv as any).turnaroundTime || srv.standardDeliveryTime || '24 Hours' },
    { label: 'Fastest Delivery', value: srv.fastestDeliveryTime || '10-30 Mins Flash' },
    { label: 'Revisions', value: srv.revisions || 'Unlimited Revisions' },
    { label: 'Export Formats', value: (srv.fileFormats || ['AI', 'PSD', 'PDF', 'PNG']).join(', ') },
    { label: 'Dimensions', value: srv.dimensions || '300 DPI Vector / HD' },
  ],
  mainImage: srv.imageUrl,
  rotationImages: (srv as any).rotationImage ? [(srv as any).rotationImage] : undefined,
  badge: srv.popular ? 'MOST POPULAR' : srv.trending ? 'TRENDING' : 'PREMIUM DESIGN',
  inStock: true,
  packages: srv.packages,
  faqs: srv.faqs,
  reviews: srv.reviews,
  tags: (srv as any).tags,
});

export const getProductBySlug = (slug: string, extraServices?: GraphicDesignService[]): ProductItem | undefined => {
  if (!slug) return undefined;
  const cleanSlug = slug.toLowerCase().replace(/^(product\/|products\/)/, '');

  // 1. Direct match in showcase luxury physical products (perfume, shoes, watch, etc.)
  const physical = SHOWCASE_PRODUCTS.find(
    (p) => p.slug.toLowerCase() === cleanSlug || p.id.toLowerCase() === cleanSlug
  );
  if (physical) return physical;

  // 2. Extra dynamic services passed from server or local state
  if (extraServices && extraServices.length > 0) {
    const matchedExtra = extraServices.find(
      (s) =>
        s.slug.toLowerCase() === cleanSlug ||
        s.id.toLowerCase() === cleanSlug ||
        s.category.toLowerCase() === cleanSlug ||
        s.title.toLowerCase().replace(/\s+/g, '-').includes(cleanSlug)
    );
    if (matchedExtra) return convertGraphicServiceToProduct(matchedExtra);
  }

  // 3. Fallback match in all default graphic design services
  const matchedService = GRAPHIC_DESIGN_SERVICES.find(
    (s) =>
      s.slug.toLowerCase() === cleanSlug ||
      s.id.toLowerCase() === cleanSlug ||
      s.category.toLowerCase() === cleanSlug ||
      s.title.toLowerCase().replace(/\s+/g, '-').includes(cleanSlug) ||
      cleanSlug.includes(s.slug.toLowerCase())
  );
  if (matchedService) return convertGraphicServiceToProduct(matchedService);

  // 4. Category-level match (e.g. /product/logo-design, /product/t-shirt-design, etc.)
  const categoryKeywords: Record<string, string> = {
    'logo-design': 'custom-vector-logo-design',
    'logo': 'custom-vector-logo-design',
    'banner-design': 'standee-flex-banner-hoarding',
    'banner': 'standee-flex-banner-hoarding',
    'social-media-post-design': 'instagram-post-design',
    'social-media': 'instagram-post-design',
    't-shirt-design': 'streetwear-typography-t-shirt-design',
    't-shirt': 'streetwear-typography-t-shirt-design',
    'shirt': 'streetwear-typography-t-shirt-design',
    'mug-design': 'sublimation-ceramic-mug-design',
    'mug': 'sublimation-ceramic-mug-design',
    'cap-design': 'embroidered-snapback-cap-design',
    'cap': 'embroidered-snapback-cap-design',
    'thumbnail-design': 'youtube-4k-viral-thumbnail-design',
    'thumbnail': 'youtube-4k-viral-thumbnail-design',
    'resume-cv-design': 'ats-friendly-professional-resume-cv-design',
    'resume': 'ats-friendly-professional-resume-cv-design',
    'cv': 'ats-friendly-professional-resume-cv-design',
    'presentation-ppt-design': 'investor-pitch-deck-presentation-ppt-design',
    'presentation': 'investor-pitch-deck-presentation-ppt-design',
    'ppt': 'investor-pitch-deck-presentation-ppt-design',
    'photo-collage-design': 'anniversary-birthday-photo-collage-design',
    'collage': 'anniversary-birthday-photo-collage-design',
    'package-design': 'retail-box-packaging-diecut-design',
    'packaging': 'retail-box-packaging-diecut-design',
    'business-card-design': 'luxury-gold-foil-nfc-business-card-design',
    'business-card': 'luxury-gold-foil-nfc-business-card-design',
    'letterhead-design': 'corporate-letterhead-invoice-template-design',
    'letterhead': 'corporate-letterhead-invoice-template-design',
  };

  const targetSlug = categoryKeywords[cleanSlug];
  if (targetSlug) {
    const srv = GRAPHIC_DESIGN_SERVICES.find((s) => s.slug === targetSlug);
    if (srv) return convertGraphicServiceToProduct(srv);
  }

  return undefined;
};
