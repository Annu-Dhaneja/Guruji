import {
  ServiceItem,
  ProductItem,
  AIPromptItem,
  OrderRecord,
  WardrobeSubmission,
  SiteSettings,
  PhotoshopWorkflow,
  PhotoshopCustomOrder,
  PhotoshopTemplate,
  PhotoshopSavedPrompt,
  GraphicDesignService,
  GraphicDesignInquiry,
  GraphicDesignSettings,
  GraphicDesignCategory,
  GurujiArtwork,
  GurujiDailyBlessing,
  GurujiExpert,
  GurujiPredictionRequest,
  GurujiPredictionResult,
  GurujiBlessingWallSubmission,
  GurujiInquiry,
  GurujiPersonalizedCardOrder,
  GurujiCategoryItem,
} from '../src/types';
import { GRAPHIC_DESIGN_SERVICES, DELIVERY_SPEED_TIERS, GRAPHIC_DESIGN_MAIN_CATEGORIES } from '../src/data/graphicDesignData';
import {
  INITIAL_GURUJI_CATEGORIES,
  INITIAL_GURUJI_ARTWORKS,
  INITIAL_GURUJI_BLESSINGS,
  INITIAL_GURUJI_EXPERTS,
  INITIAL_GURUJI_WALL_SUBMISSIONS,
  INITIAL_GURUJI_INQUIRIES,
} from '../src/data/gurujiArtworkData';



// Initial Mock Data Stores
export const servicesData: ServiceItem[] = [
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
    id: 'srv-gd-3',
    title: 'Outdoor Hoardings & Standees',
    category: 'graphic-design',
    categoryName: 'Graphic Design',
    startingPrice: 2499,
    description: 'Large-scale high-resolution print-ready hoarding, flex banner, and rollup standee artwork.',
    imageUrl: 'https://images.unsplash.com/photo-1542744094-3a31b272c490?auto=format&fit=crop&w=1200&q=80',
    features: ['300 DPI CMYK Print File', 'Custom Dimensions', 'Hoarding Mockup'],
  },
  {
    id: 'srv-gd-4',
    title: 'Pitch Decks & Corporate Presentation',
    category: 'graphic-design',
    categoryName: 'Graphic Design',
    startingPrice: 2999,
    description: 'Investor slide decks, company profiles, and corporate pitch materials with sleek modern infographics.',
    imageUrl: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=1200&q=80',
    features: ['15 Custom Slide Layouts', 'Editable PowerPoint & PDF', 'Data Visualization Charts'],
  },
  {
    id: 'srv-gd-5',
    title: 'Luxury Visiting Cards & Business Stationery',
    category: 'graphic-design',
    categoryName: 'Graphic Design',
    startingPrice: 999,
    description: 'Premium embossed, gold foil, matte finish double-sided visiting cards with matching letterhead.',
    imageUrl: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&w=1200&q=80',
    features: ['Double Sided Layout', 'Print-Ready PDF/AI', 'Realistic 3D Mockup Preview'],
  },
  {
    id: 'srv-ws-2',
    title: 'Occasion & Event Styling Package',
    category: 'wardrobe-consultation',
    categoryName: 'Wardrobe Style',
    startingPrice: 1999,
    description: 'Curated outfits for weddings, festival celebrations, corporate summits, or dinner dates with budget recommendations.',
    imageUrl: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1200&q=80',
    features: ['3 Event Complete Lookbooks', 'Jewelry & Bag Suggestions', 'Direct Shopping Links'],
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
    id: 'srv-ve-2',
    title: 'Ghost Mannequin Apparel Editing',
    category: 'vantage-marketplace',
    categoryName: 'Vantage Ecom',
    startingPrice: 799,
    description: 'Seamless hollow 3D ghost mannequin combination for dresses, jackets, shirts, & traditional ethnic wear.',
    imageUrl: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1200&q=80',
    features: ['Neck Joint & Inner Tag Alignment', 'Wrinkle Smoothing', 'Color Saturation Tuning'],
  },
  {
    id: 'srv-ve-3',
    title: 'Custom E-com Size Charts & Infographics',
    category: 'vantage-marketplace',
    categoryName: 'Vantage Ecom',
    startingPrice: 899,
    description: 'Clear dimensional size guide graphics with chest, length, and waist measurements for apparel listings.',
    imageUrl: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&w=1200&q=80',
    features: ['Inches & CM Dual Tables', 'Brand Color Matching', 'High-Res JPG for Seller Central'],
  },
  {
    id: 'srv-ve-4',
    title: 'Jersey & Apparel Fabric Recoloring',
    category: 'vantage-marketplace',
    categoryName: 'Vantage Ecom',
    startingPrice: 699,
    description: 'Change shirt or sports jersey color across dozens of color variants without re-shooting photo sessions.',
    imageUrl: 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&w=1200&q=80',
    features: ['Realistic Fabric Texture Retention', 'Up to 10 Color Swatches', 'Consistent Lighting'],
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
  {
    id: 'srv-bc-2',
    title: 'Hardcover Jacket & Dust Sheet Artwork',
    category: 'book-cover',
    categoryName: 'Book Cover Design',
    startingPrice: 1799,
    description: 'Full flap wrap dust jacket for hardcover novels, poetry books, and spiritual publications with gold foil embossing.',
    imageUrl: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=1200&q=80',
    features: ['Flap Copy Formatting', 'Spine Calculation', 'High Resolution CMYK Output'],
  },
  {
    id: 'srv-web-1',
    title: 'Custom Responsive Website & Portfolio Development',
    category: 'graphic-design',
    categoryName: 'Website & Digital Design',
    startingPrice: 4999,
    description: 'Sleek single-page or multi-page modern website development with mobile optimization, fast loading speed, SEO meta setup, and contact form integration.',
    imageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80',
    features: ['Responsive Mobile & Desktop Layouts', 'SEO Meta Setup', 'Contact Form & WhatsApp Direct Link', 'Fast Speed Optimization', '1 Year Free Technical Support'],
  },
  {
    id: 'srv-web-2',
    title: 'E-Commerce Web Store & Payment Gateway Setup',
    category: 'vantage-marketplace',
    categoryName: 'E-Commerce Website',
    startingPrice: 7999,
    description: 'Full-featured online store setup with Razorpay/UPI payment gateway integration, product catalog listing, cart checkout, and admin order management.',
    imageUrl: 'https://images.unsplash.com/photo-1556742049-0a670f4a4591?auto=format&fit=crop&w=1200&q=80',
    features: ['Up to 50 Product Listings', 'Razorpay & UPI Payment Integration', 'Order Tracking Dashboard', 'SSL Certificate & Domain Setup', 'Mobile App Webview Ready'],
  },
  {
    id: 'srv-web-3',
    title: 'High-Converting Landing Page & Lead Funnel',
    category: 'graphic-design',
    categoryName: 'Website & Digital Design',
    startingPrice: 3499,
    description: 'Custom high-converting lead landing page optimized for marketing campaigns, Google/FB ads, and instant WhatsApp booking leads.',
    imageUrl: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=1200&q=80',
    features: ['A/B Tested CTA Buttons', 'Fast 1-Second Load Speed', 'Lead Capture Form', 'Google Analytics & Meta Pixel Integration'],
  },
  {
    id: 'srv-web-4',
    title: 'Website Maintenance, Speed Optimization & Security Audit',
    category: 'graphic-design',
    categoryName: 'Website & Digital Design',
    startingPrice: 1999,
    description: 'Monthly maintenance, security patches, image compression, page speed boost (90+ Google Lighthouse), and monthly content updates.',
    imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80',
    features: ['90+ Google Speed Guarantee', 'SSL & Firewall Security Audit', 'Weekly Automated Backups', '3 Content Updates Monthly'],
  },
];

export const productsData: ProductItem[] = [
  {
    id: 'prod-1',
    name: 'Sacred Guruji Divine Bracelet',
    category: 'accessories',
    categoryName: 'Accessories & Bracelets',
    price: 499,
    discountPrice: 349,
    description: 'Blessed natural wooden bead bracelet featuring sacred Guruji charm.',
    previewUrl: 'https://images.unsplash.com/photo-1611591475281-229ef58d55fa?auto=format&fit=crop&w=1200&q=80',
    isDigital: false,
    tags: ['Guruji', 'Spiritual', 'Bracelet', 'Blessed'],
  },
  {
    id: 'prod-2',
    name: 'Acrylic Guruji Donation Box (Gullak)',
    category: 'guruji-products',
    categoryName: 'Donation Boxes & Craft',
    price: 999,
    discountPrice: 799,
    description: 'Premium laser-engraved transparent acrylic donation box with lock and key.',
    previewUrl: 'https://images.unsplash.com/photo-1584438784894-089d6a62b8fa?auto=format&fit=crop&w=1200&q=80',
    isDigital: false,
    tags: ['DonationBox', 'Acrylic', 'GurujiCraft'],
  },
  {
    id: 'prod-3',
    name: 'HD Jai Guru Ji Mobile Wallpaper Pack (10 Wallpapers)',
    category: 'digital-products',
    categoryName: 'Digital Wallpapers & Stickers',
    price: 199,
    discountPrice: 99,
    description: '4K Ultra High-Resolution divine Guruji mobile wallpapers and WhatsApp status stickers.',
    previewUrl: 'https://images.unsplash.com/photo-1507692049790-de58290a4334?auto=format&fit=crop&w=1200&q=80',
    downloadUrl: '/downloads/guruji_wallpapers_pack.zip',
    isDigital: true,
    tags: ['Wallpaper', '4K', 'WhatsAppStickers'],
  },
  {
    id: 'prod-4',
    name: 'Guruji Vachan & Blessings Calendar 2026',
    category: 'ebooks',
    categoryName: 'Guides & E-Books',
    price: 299,
    discountPrice: 199,
    description: '365 Days of divine Guruji vachan quotes, calendar alerts, & spiritual meditation guide.',
    previewUrl: 'https://images.unsplash.com/photo-1506784983877-45594efa4cbe?auto=format&fit=crop&w=1200&q=80',
    downloadUrl: '/downloads/vachan_calendar_2026.pdf',
    isDigital: true,
    tags: ['Vachan', 'Calendar', 'EBook'],
  },
  {
    id: 'prod-5',
    name: 'Traditional Brass Divine Oil Diya Lamp',
    category: 'guruji-products',
    categoryName: 'Devotional Brass Craft',
    price: 699,
    discountPrice: 499,
    description: 'Handcrafted solid brass oil diya lamp with warm ambient glow for home altar & pooja space.',
    previewUrl: 'https://images.unsplash.com/photo-1609357605129-26f69add5d6e?auto=format&fit=crop&w=1200&q=80',
    isDigital: false,
    tags: ['BrassDiya', 'Pooja', 'SpiritualGlow'],
  },
  {
    id: 'prod-6',
    name: 'Sacred Gold Framed Spiritual Canvas',
    category: 'guruji-products',
    categoryName: 'Framed Artwork',
    price: 1299,
    discountPrice: 899,
    description: 'High-definition divine artwork print mounted in an elegant gold carved wooden photo frame.',
    previewUrl: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=1200&q=80',
    isDigital: false,
    tags: ['FramedArt', 'DivineArt', 'GoldFrame'],
  },
];

export const promptsData: AIPromptItem[] = [
  {
    id: 'prompt-1',
    title: 'Minimalist Luxury Perfume Studio Photography',
    category: 'product-photo',
    tool: 'Midjourney',
    difficulty: 'Intermediate',
    description: 'Generates sleek, high-end perfume bottle product photography with glass reflections & pastel lighting.',
    fullPrompt: 'Cinematic studio product photograph of a sleek glass perfume bottle resting on smooth wet black obsidian stone, soft volumetric pastel lighting, caustics, floating water drops, shot on Hasselblad 100MP, f/2.8 lens --ar 4:5 --style raw --v 6.0',
    copyCount: 1420,
    tags: ['Midjourney', 'ProductPhotography', 'Ecommerce'],
  },
  {
    id: 'prompt-2',
    title: 'High-Converting Amazon Product Title & Bullet Points',
    category: 'ecom',
    tool: 'ChatGPT',
    difficulty: 'Beginner',
    description: 'ChatGPT copywriting prompt for generating SEO-rich titles, 5 key bullet points, and A+ content.',
    fullPrompt: 'Act as an expert Amazon E-commerce Listing Specialist. Write an SEO-optimized Amazon title under 200 characters, 5 persuasive bullet points with ALL-CAPS benefit hooks, and a 150-word product description for the following item: [INSERT PRODUCT NAME AND FEATURES]. Maintain a confident, benefits-focused tone.',
    copyCount: 980,
    tags: ['ChatGPT', 'AmazonSEO', 'Copywriting'],
  },
  {
    id: 'prompt-3',
    title: 'Minimalist Geometric Monogram Logo Design',
    category: 'logo',
    tool: 'Midjourney',
    difficulty: 'Intermediate',
    description: 'Clean vector logo prompt for luxury fashion brands and creative agencies.',
    fullPrompt: 'Flat minimalist vector logo mark, overlapping geometric monogram letters AD, clean golden ratio lines, dark navy background, luxury modern branding style, high contrast, vector graphics --no realistic photos 3d shadows --ar 1:1',
    copyCount: 2100,
    tags: ['LogoDesign', 'Midjourney', 'Branding'],
  },
];

export const wardrobeSubmissions: WardrobeSubmission[] = [
  {
    clientName: 'Priya Sharma',
    clientEmail: 'priya.sharma@example.com',
    clientPhone: '+91 98112 34567',
    city: 'Rohini, Delhi',
    occasion: 'Corporate Leadership & Daily Office Wear',
    bodyType: 'Hourglass',
    preferredStyle: 'Smart Casual & Western Formal',
    colorPreferences: 'Navy Blue, Pastel Pink, Emerald Green',
    budgetRange: '₹5,000 - ₹10,000',
    notes: 'Need versatile blazer and trousers pairings that transition seamlessly from morning corporate meetings to evening dinners.',
    uploadedImages: [
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=800&q=80'
    ],
    status: 'Consultation Active',
    createdAt: '2026-08-10T10:30:00.000Z'
  },
  {
    clientName: 'Rohan Kapoor',
    clientEmail: 'rohan.k@example.com',
    clientPhone: '+91 98765 43210',
    city: 'Pitampura, Delhi',
    occasion: 'Wedding Celebration & Sangeet Party',
    bodyType: 'Athletic',
    preferredStyle: 'Traditional Indo-Western Fusion',
    colorPreferences: 'Royal Blue, Gold, Beige',
    budgetRange: '₹10,000 - ₹20,000',
    notes: 'Looking for lightweight kurta pyjama and bandhgala jacket recommendations with matching leather juttis.',
    uploadedImages: [
      'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=800&q=80'
    ],
    status: 'Outfits Curated',
    createdAt: '2026-08-09T14:15:00.000Z'
  },
  {
    clientName: 'Ananya Gupta',
    clientEmail: 'ananya.g@example.com',
    clientPhone: '+91 99554 33221',
    city: 'Gurugram',
    occasion: '7-Day Capsule Wardrobe for Beach Vacation',
    bodyType: 'Petite',
    preferredStyle: 'Boho Chic & Resort Wear',
    colorPreferences: 'Coral, Turquoise, White Floral',
    budgetRange: '₹7,000 - ₹12,000',
    notes: 'Need 7 mix-and-match dresses, shorts, and accessory pairings for a 7-day tropical vacation in Goa.',
    uploadedImages: [
      'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=800&q=80'
    ],
    status: 'Completed & Delivered',
    createdAt: '2026-08-08T09:00:00.000Z'
  }
];

export const ordersData: OrderRecord[] = [
  {
    id: 'GCP-STUDIO-901',
    customerName: 'Kunal Kapoor',
    customerEmail: 'kunal.kapoor@velocitawatches.in',
    customerPhone: '+91 98200 45678',
    items: [
      { itemId: 'srv-retouching', itemType: 'service', name: 'Product Retouching & Pure White Isolation', price: 1499, quantity: 1 }
    ],
    totalAmount: 1499,
    status: 'in-progress',
    studioOrderStatus: 'READY FOR REVIEW',
    paymentStatus: 'paid',
    assignedDesignerId: 'des-01',
    assignedDesignerName: 'Vikram Joshi (Senior Photoshop Lead)',
    revisionCount: 1,
    projectBrief: {
      serviceTitle: 'Product Retouching',
      serviceSlug: 'product-retouching',
      category: 'Watches & Luxury Goods',
      marketplace: 'Amazon India & Shopify',
      skusCount: 1,
      imagesCount: 2,
      dimensions: '2000 x 2000 px',
      backgroundReq: 'Pure White (RGB 255,255,255)',
      shadowReq: 'Soft Natural Ground Shadow',
      colorCorrectionReq: 'Enhance rose gold luster, reduce glare on sapphire glass',
      specialInstructions: 'Remove dust specks from bezel, ensure dial markers are ultra sharp.',
      deadlinePreference: 'Express 24 Hours',
      packageName: 'Amazon Growth Catalog',
      packagePrice: 1499,
    },
    files: [
      {
        id: 'file-01',
        name: 'chronograph-front-angle.jpg',
        size: '14.2 MB',
        format: 'JPG',
        originalUrl: '/src/assets/images/hero_watch_raw_1790156645806.jpg',
        editedPreviewUrl: '/src/assets/images/hero_product_watch_edit_1790156495540.jpg',
        finalDownloadUrl: '/src/assets/images/hero_product_watch_edit_1790156495540.jpg',
        status: 'edited',
        comments: [
          {
            id: 'c-1',
            author: 'Kunal Kapoor',
            role: 'customer',
            text: 'Please make the reflection on the lower rim slightly softer.',
            timestamp: '2026-09-22T14:30:00.000Z',
            coordX: 52,
            coordY: 78,
            resolved: true
          },
          {
            id: 'c-2',
            author: 'Vikram Joshi',
            role: 'designer',
            text: 'Reflection feathered and polished to perfection! Uploaded updated draft.',
            timestamp: '2026-09-22T16:15:00.000Z',
            resolved: true
          }
        ]
      },
      {
        id: 'file-02',
        name: 'skincare-serum-bottle.jpg',
        size: '18.6 MB',
        format: 'JPG',
        originalUrl: '/src/assets/images/cosmetics_raw_1790156661714.jpg',
        editedPreviewUrl: '/src/assets/images/product_cosmetics_clean_1790156507953.jpg',
        finalDownloadUrl: '/src/assets/images/product_cosmetics_clean_1790156507953.jpg',
        status: 'approved',
        comments: []
      }
    ],
    activities: [
      { id: 'act-1', timestamp: '2026-09-22T10:00:00.000Z', actor: 'System', action: 'NEW ORDER', note: 'Project created by customer' },
      { id: 'act-2', timestamp: '2026-09-22T10:05:00.000Z', actor: 'Razorpay', action: 'PAYMENT CONFIRMED', note: 'Payment of ₹1,499 received' },
      { id: 'act-3', timestamp: '2026-09-22T10:10:00.000Z', actor: 'System', action: 'FILES RECEIVED', note: '2 High-Res camera assets validated' },
      { id: 'act-4', timestamp: '2026-09-22T11:00:00.000Z', actor: 'Admin (Annu Dhaneja)', action: 'DESIGNER ASSIGNED', note: 'Assigned to Vikram Joshi' },
      { id: 'act-5', timestamp: '2026-09-22T13:45:00.000Z', actor: 'Designer (Vikram Joshi)', action: 'QUALITY CHECK', note: 'Draft submitted for internal QC' },
      { id: 'act-6', timestamp: '2026-09-22T14:10:00.000Z', actor: 'QA Lead', action: 'READY FOR REVIEW', note: 'QC Passed - sent to client for review' },
    ],
    createdAt: '2026-09-22T10:00:00.000Z',
    updatedAt: '2026-09-22T16:15:00.000Z',
    invoiceNumber: 'INV-GCP-901'
  },
  {
    id: 'GCP-STUDIO-902',
    customerName: 'Priya Sharma',
    customerEmail: 'priya.s@stridefootwear.com',
    customerPhone: '+91 99112 33445',
    items: [
      { itemId: 'srv-myntra-images', itemType: 'service', name: 'Myntra Sneaker Catalog Retouching & Clipping', price: 2499, quantity: 1 }
    ],
    totalAmount: 2499,
    status: 'in-progress',
    studioOrderStatus: 'IN PROGRESS',
    paymentStatus: 'paid',
    assignedDesignerId: 'des-02',
    assignedDesignerName: 'Rohit Sharma (Catalog Specialist)',
    revisionCount: 0,
    projectBrief: {
      serviceTitle: 'Myntra Catalog Images',
      serviceSlug: 'myntra-images',
      category: 'Footwear & Fashion',
      marketplace: 'Myntra & Flipkart',
      skusCount: 4,
      imagesCount: 8,
      dimensions: '1080 x 1440 px (3:4 ratio)',
      backgroundReq: 'Clean Editorial Light Grey (#F5F5F7)',
      shadowReq: 'Floating Shadow with Ground Contact',
      colorCorrectionReq: 'Match neon yellow and cyber blue fabric threads accurately',
      specialInstructions: 'Myntra strict QC compliance required.',
      deadlinePreference: 'Standard 36 Hours',
      packageName: 'Full Catalog Pack',
      packagePrice: 2499,
    },
    files: [
      {
        id: 'file-sneaker-01',
        name: 'running-shoe-side.jpg',
        size: '11.5 MB',
        format: 'JPG',
        originalUrl: '/src/assets/images/sneaker_raw_1790156678698.jpg',
        editedPreviewUrl: '/src/assets/images/marketplace_sneaker_lifestyle_1790156519357.jpg',
        finalDownloadUrl: '/src/assets/images/marketplace_sneaker_lifestyle_1790156519357.jpg',
        status: 'edited',
        comments: []
      }
    ],
    activities: [
      { id: 'act-21', timestamp: '2026-09-23T01:00:00.000Z', actor: 'System', action: 'NEW ORDER', note: 'Project created' },
      { id: 'act-22', timestamp: '2026-09-23T01:02:00.000Z', actor: 'Razorpay', action: 'PAYMENT CONFIRMED', note: 'Payment verified' },
      { id: 'act-23', timestamp: '2026-09-23T01:30:00.000Z', actor: 'Admin', action: 'DESIGNER ASSIGNED', note: 'Assigned to Rohit Sharma' },
      { id: 'act-24', timestamp: '2026-09-23T02:15:00.000Z', actor: 'Designer', action: 'IN PROGRESS', note: 'Pen tool clipping path in progress' },
    ],
    createdAt: '2026-09-23T01:00:00.000Z',
    updatedAt: '2026-09-23T02:15:00.000Z',
    invoiceNumber: 'INV-GCP-902'
  },
  {
    id: 'ORD-2026-8801',
    customerName: 'Pooja Verma',
    customerEmail: 'pooja.verma@example.com',
    customerPhone: '+91 98100 11223',
    items: [
      { itemId: 'srv-gd-1', itemType: 'service', name: 'Brand Identity & Vector Logo Package', price: 1999, quantity: 1 }
    ],
    totalAmount: 1999,
    status: 'in-progress',
    paymentStatus: 'paid',
    createdAt: '2026-08-11T08:00:00.000Z'
  },
  {
    id: 'ORD-2026-8802',
    customerName: 'Amit Saxena',
    customerEmail: 'amit.s@example.com',
    customerPhone: '+91 97111 22334',
    items: [
      { itemId: 'srv-web-1', itemType: 'service', name: 'Custom Responsive Website & Portfolio Development', price: 4999, quantity: 1 }
    ],
    totalAmount: 4999,
    status: 'completed',
    paymentStatus: 'paid',
    createdAt: '2026-08-10T16:20:00.000Z'
  },
  {
    id: 'ORD-2026-8803',
    customerName: 'Neha Malhotra',
    customerEmail: 'neha.m@example.com',
    customerPhone: '+91 99988 77665',
    items: [
      { itemId: 'prod-1', itemType: 'product', name: 'Sacred Guruji Divine Bracelet', price: 349, quantity: 1 },
      { itemId: 'prod-3', itemType: 'product', name: 'HD Jai Guru Ji Mobile Wallpaper Pack', price: 99, quantity: 1 }
    ],
    totalAmount: 448,
    status: 'completed',
    paymentStatus: 'paid',
    createdAt: '2026-08-10T11:45:00.000Z'
  }
];

export const siteSettings: SiteSettings = {
  contactName: 'PixelCraft Studio Director',
  contactPhone: '8527837527',
  contactEmail: 'annudhaneja@gmail.com',
  contactLocation: 'New Delhi, India',
  googleMapsEmbedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d13994.498188185933!2d77.1085295!3d28.7180125!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390d013824479f61%3A0xe54d3e421a11db9f!2sRohini%2C%20New%20Delhi%2C%20Delhi!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin',
  aboutText: 'PixelCraft Studio is an independent Indian E-commerce Visual Production Studio. From a single product photograph to a complete marketplace-ready visual set, we transform raw product images into clean, consistent and professional e-commerce assets.',
  missionText: 'To deliver exceptional creative e-commerce visuals that make products ready to sell, command premium brand value, and eliminate catalog rejection.',
  visionText: 'To be the most trusted remote visual production partner for Amazon, Flipkart, Myntra sellers, D2C brands, and creative agencies worldwide.',
  maintenanceMode: false,
  maintenanceTitle: 'PixelCraft Studio Scheduled Maintenance',
  maintenanceDescription: 'We are upgrading our Studio CMS and server infrastructure. We will be back shortly!',
  maintenanceReturnDate: 'Estimated return in 30 minutes',
  brandName: 'PixelCraft Studio',
  tagline: 'Edit. Enhance. Design. Deliver.',
  positioning: 'E-commerce visuals that make products ready to sell.',
  supportingLine: 'From a single product photograph to a complete marketplace-ready visual set, we transform raw product images into clean, consistent and professional e-commerce assets.',
  freeSampleEnabled: true,
  heroHeading: 'Your Product Deserves Better Visuals.',
  heroSubheading: 'Professional product editing, marketplace creatives and e-commerce design — created remotely, consistently and ready for your next sale.',
  ctaPrimaryText: 'Start Your Project',
  ctaSecondaryText: 'Get Free Sample',
  brandColors: {
    primary: '#7C3AED',
    secondary: '#06B6D4',
    accent: '#F59E0B',
    dark: '#050816',
    surface: '#0F172A',
    light: '#F8FAFC',
    textDark: '#0F172A',
    textLight: '#F8FAFC',
  },
  heroStats: {
    projectsCompleted: '14,800+',
    imagesEdited: '240,000+',
    happyClients: '2,400+',
    averageTurnaround: '12 Hours',
  },
};

export const freeSampleRequestsData: any[] = [
  {
    id: 'SMP-2026-101',
    name: 'Vikram Sethi',
    email: 'vikram.sethi@example.com',
    whatsapp: '+91 98200 55443',
    category: 'Jewellery & Watches',
    marketplace: 'Amazon India',
    requirements: 'Pure white RGB 255 background, realistic drop shadow, clean glare on sapphire crystal.',
    imageUrl: '/src/assets/images/hero_watch_raw_1790156645806.jpg',
    imageFileName: 'omega-speedmaster-raw.jpg',
    status: 'COMPLETED',
    resultImageUrl: '/src/assets/images/hero_product_watch_edit_1790156495540.jpg',
    watermarkedResultUrl: '/src/assets/images/hero_product_watch_edit_1790156495540.jpg',
    adminNotes: 'High-end watch, applied pen tool clipping and drop shadow.',
    watermarkEnabled: true,
    createdAt: '2026-09-22T10:00:00.000Z',
    updatedAt: '2026-09-22T14:30:00.000Z',
  },
  {
    id: 'SMP-2026-102',
    name: 'Aanchal Kapoor',
    email: 'aanchal@skinglow.in',
    whatsapp: '+91 99112 33445',
    category: 'Beauty & Cosmetics',
    marketplace: 'Nykaa',
    requirements: 'Need natural reflections and clean background for serum bottle.',
    imageUrl: '/src/assets/images/cosmetics_raw_1790156661714.jpg',
    imageFileName: 'serum-bottle-table.jpg',
    status: 'EDITING',
    resultImageUrl: '/src/assets/images/product_cosmetics_clean_1790156507953.jpg',
    watermarkEnabled: true,
    createdAt: '2026-09-23T01:30:00.000Z',
    updatedAt: '2026-09-23T02:00:00.000Z',
  }
];

// 1. Pages Data
export const pagesData: any[] = [
  {
    id: 'page-home',
    pageName: 'Homepage',
    pageTitle: 'GurucraftPro — Creative Design Studio, Wardrobe Style & Divine Art',
    slug: 'home',
    description: 'Premier Graphic Design, Amazon Vantage Ecom Editing, Book Covers & Divine Guruji Art Studio.',
    featuredImage: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?auto=format&fit=crop&w=1200&q=80',
    seoTitle: 'GurucraftPro | Creative Studio & Design Hub Delhi',
    seoDescription: 'Transform your brand with expert graphic design, 7-day wardrobe styling, book covers, and sacred Guruji products by Annu Dhaneja.',
    seoKeywords: 'graphic design, wardrobe consultation, book cover design, guruji art, delhi designer',
    ogImage: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?auto=format&fit=crop&w=1200&q=80',
    status: 'Published',
    publishDate: new Date().toISOString(),
    sections: [
      { id: 'sec-1', type: 'hero', title: 'Main Hero Banner', content: { headline: 'Elevate Your Vision with GurucraftPro', subtext: 'Premium Graphic Design, Wardrobe Styling & Divine Artwork' } },
      { id: 'sec-2', type: 'featured-services', title: 'Our Core Studio Services', content: {} },
      { id: 'sec-3', type: 'stats', title: 'Studio Impact Metrics', content: { stats: [{ label: 'Projects Completed', value: '1,200+' }, { label: '5-Star Reviews', value: '99.4%' }] } },
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'page-about',
    pageName: 'About Annu Dhaneja',
    pageTitle: 'About Annu Dhaneja & GurucraftPro Studio',
    slug: 'about-us',
    description: 'Learn about Annu Dhaneja, creative director and founder of GurucraftPro.',
    featuredImage: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=1200&q=80',
    seoTitle: 'About Annu Dhaneja | Founder GurucraftPro',
    seoDescription: 'Annu Dhaneja is a creative designer and fashion stylist based in Rohini, Delhi.',
    seoKeywords: 'annu dhaneja, graphic designer delhi, gurucraftpro founder',
    status: 'Published',
    publishDate: new Date().toISOString(),
    sections: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

// 2. Categories Data
export const categoriesData: any[] = [
  { id: 'cat-gd', name: 'Graphic Design', slug: 'graphic-design', group: 'graphic-design', description: 'Logos, branding, hoardings & stationery' },
  { id: 'cat-ws', name: 'Wardrobe Consultation', slug: 'wardrobe-consultation', group: 'wardrobe', description: '7-day capsule plans & occasion styling' },
  { id: 'cat-ve', name: 'Vantage Ecom Editing', slug: 'vantage-marketplace', group: 'vantage-ecom', description: 'Amazon/Flipkart product photo enhancement' },
  { id: 'cat-bc', name: 'Book Cover Design', slug: 'book-cover', group: 'book-cover', description: 'KDP Paperback, Hardcover & Kindle Covers' },
  { id: 'cat-gp', name: 'Guruji Divine Products', slug: 'guruji-products', group: 'guruji-products', description: 'Blessed bracelets, donation boxes & framed art' },
  { id: 'cat-dp', name: 'Digital Wallpapers & Packs', slug: 'digital-products', group: 'digital-products', description: '4K mobile wallpapers & sticker packs' },
];

// 3. Navigation Menus
export const menusData: any = {
  main: [
    { id: 'nav-1', label: 'Services', url: '/services' },
    { id: 'nav-2', label: 'Book Covers', url: '/book-cover' },
    { id: 'nav-3', label: 'Wardrobe Styling', url: '/wardrobe' },
    { id: 'nav-4', label: 'Storefront', url: '/store' },
    { id: 'nav-5', label: 'AI Prompts', url: '/prompts' },
    { id: 'nav-6', label: 'Vantage Ecom', url: '/vantage-ecom' },
    { id: 'nav-7', label: 'Contact', url: '/contact' },
  ],
  footer: [
    { id: 'f-1', label: 'Services Catalog', url: '/services' },
    { id: 'f-2', label: 'Book Cover Design Studio', url: '/book-cover' },
    { id: 'f-3', label: '7-Day Capsule Wardrobe', url: '/wardrobe' },
    { id: 'f-4', label: 'Guruji Divine Store', url: '/store' },
    { id: 'f-5', label: 'Privacy Policy', url: '/privacy' },
    { id: 'f-6', label: 'Terms of Service', url: '/terms' },
  ],
  mobile: [],
  secondary: [],
};

// 4. Social & External Links Manager
export const defaultLinksData: any = {
  instagramUrl: 'https://instagram.com/gurucraftpro',
  facebookUrl: 'https://facebook.com/gurucraftpro',
  youtubeUrl: 'https://youtube.com/@gurucraftpro',
  amazonUrl: 'https://amazon.in/s?k=GurucraftPro',
  flipkartUrl: 'https://flipkart.com/search?q=GurucraftPro',
  etsyUrl: 'https://etsy.com/shop/GurucraftPro',
  whatsappUrl: 'https://wa.me/918527837527',
  contactUrl: 'mailto:annudhaneja@gmail.com',
  portfolioUrl: 'https://gurucraftpro.com',
  linkedinUrl: 'https://linkedin.com/company/gurucraftpro',
  pinterestUrl: 'https://pinterest.com/gurucraftpro',
  twitterUrl: 'https://x.com/gurucraftpro',
  behanceUrl: 'https://behance.net/gurucraftpro',
  googleBusinessUrl: 'https://maps.google.com/?q=GurucraftPro+Rohini+Delhi',
  directPhone: '8527837527',
  directEmail: 'annudhaneja@gmail.com',
};

export const socialLinksData: any[] = [
  { id: 'sl-1', platformName: 'Instagram', iconName: 'Instagram', url: 'https://instagram.com/gurucraftpro', label: 'Follow on Instagram', openInNewTab: true, active: true, category: 'social', location: ['header', 'footer', 'contact'] },
  { id: 'sl-2', platformName: 'WhatsApp', iconName: 'MessageCircle', url: 'https://wa.me/918527837527', label: 'WhatsApp Annu Dhaneja', openInNewTab: true, active: true, category: 'social', location: ['header', 'footer', 'contact', 'product'] },
  { id: 'sl-3', platformName: 'YouTube Channel', iconName: 'Youtube', url: 'https://youtube.com/@gurucraftpro', label: 'Watch Design Tutorials', openInNewTab: true, active: true, category: 'social', location: ['footer', 'contact'] },
  { id: 'sl-4', platformName: 'Amazon Store', iconName: 'ShoppingBag', url: 'https://amazon.in/s?k=GurucraftPro', label: 'Buy on Amazon', openInNewTab: true, active: true, category: 'marketplace', location: ['footer', 'product'] },
  { id: 'sl-5', platformName: 'Flipkart Store', iconName: 'Store', url: 'https://flipkart.com/search?q=GurucraftPro', label: 'Buy on Flipkart', openInNewTab: true, active: true, category: 'marketplace', location: ['footer', 'product'] },
  { id: 'sl-6', platformName: 'Etsy Shop', iconName: 'Store', url: 'https://etsy.com/shop/GurucraftPro', label: 'Global Handmade Craft on Etsy', openInNewTab: true, active: true, category: 'marketplace', location: ['footer'] },
  { id: 'sl-7', platformName: 'Pinterest', iconName: 'Image', url: 'https://pinterest.com/gurucraftpro', label: 'Inspiration & Color Palettes', openInNewTab: true, active: true, category: 'social', location: ['footer'] },
  { id: 'sl-8', platformName: 'LinkedIn', iconName: 'Linkedin', url: 'https://linkedin.com/company/gurucraftpro', label: 'B2B & Creative Studio on LinkedIn', openInNewTab: true, active: true, category: 'social', location: ['footer'] },
];

// 5. SEO Control Center Data
export const seoData: Record<string, any> = {
  homepage: {
    id: 'seo-home',
    entityType: 'homepage',
    entityId: 'homepage',
    seoTitle: 'Gurucraftpro — Creative Graphic Design, Book Covers & Digital Studio in Rohini, Delhi',
    metaDescription: 'Top-rated design studio in Rohini, Delhi by Annu Dhaneja. Logo design, KDP book covers, Amazon product retouching, wardrobe styling & spiritual Guruji artwork.',
    focusKeyword: 'Graphic Designer in Rohini Delhi',
    secondaryKeywords: ['Book Cover Designer Delhi', 'Amazon Product Photo Editing', 'Wardrobe Stylist Delhi', 'Guruji Swaroop Frame'],
    canonicalUrl: 'https://gurucraftpro.com',
    ogTitle: 'Gurucraftpro — Creative Graphic Design & Digital Studio',
    ogDescription: 'Transforming brand visions with custom logos, e-commerce retouching, book covers & sacred spiritual art.',
    ogImage: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?auto=format&fit=crop&w=1200&q=80',
    twitterCard: 'summary_large_image',
    robotsIndex: true,
    robotsFollow: true,
  },
  'quick-services': {
    id: 'seo-quick-services',
    entityType: 'page',
    entityId: 'quick-services',
    seoTitle: '₹49 Quick Digital Fixes & Micro-Services in Minutes | Gurucraftpro',
    metaDescription: 'Instant background removal, image upscaling, PDF conversion, watermarking and vector conversion starting at just ₹49 with rush delivery in Rohini, Delhi.',
    focusKeyword: 'quick photo editing ₹49',
    secondaryKeywords: ['instant background removal', 'pdf converter online', 'photo retouching express'],
    canonicalUrl: 'https://gurucraftpro.com/quick-services',
    ogTitle: '₹49 Quick Digital Fixes & Express Micro-Services | Gurucraftpro',
    ogDescription: 'Get your digital files fixed in minutes for just ₹49. Background removal, resizing, vector traces and document fixes.',
    ogImage: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1200&q=80',
    twitterCard: 'summary_large_image',
    robotsIndex: true,
    robotsFollow: true,
  },
  'graphic-design': {
    id: 'seo-graphic-design',
    entityType: 'service',
    entityId: 'graphic-design',
    seoTitle: 'Graphic Design & Custom Logo Design Services in Delhi | Gurucraftpro',
    metaDescription: 'Professional graphic design in Rohini, Delhi. Custom brand identity, vector logos, visiting cards, brochures, social media creative kits and packaging design.',
    focusKeyword: 'graphic design services in delhi',
    secondaryKeywords: ['logo designer rohini', 'visiting card design delhi', 'brochure designing delhi', 'packaging design studio'],
    canonicalUrl: 'https://gurucraftpro.com/services/graphic-design',
    ogTitle: 'Custom Graphic Design & Corporate Branding | Gurucraftpro Delhi',
    ogDescription: 'Crafting high-impact logos, corporate stationery, marketing brochures and packaging that convert customers.',
    ogImage: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?auto=format&fit=crop&w=1200&q=80',
    twitterCard: 'summary_large_image',
    robotsIndex: true,
    robotsFollow: true,
  },
  'guruji-artwork': {
    id: 'seo-guruji-artwork',
    entityType: 'page',
    entityId: 'guruji-artwork',
    seoTitle: 'Divine Guruji Swaroop Acrylic Frames, Wallpapers & Blessings | Gurucraftpro',
    metaDescription: 'Custom sacred Guruji Swaroop acrylic frames, daily vachan, 4K wallpapers, blessed bracelets, and donation boxes with delivery across Delhi NCR and India.',
    focusKeyword: 'guruji swaroop frame delhi',
    secondaryKeywords: ['jai guru ji wallpaper', 'guruji acrylic photo frame', 'guruji daily vachan', 'spiritual artwork studio'],
    canonicalUrl: 'https://gurucraftpro.com/guruji-artwork',
    ogTitle: 'Divine Guruji Swaroop Acrylic Frames & Sacred Art | Gurucraftpro',
    ogDescription: 'Handcrafted acrylic frames, daily blessings, and high-definition spiritual wallpapers created with deep reverence.',
    ogImage: 'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?auto=format&fit=crop&w=1200&q=80',
    twitterCard: 'summary_large_image',
    robotsIndex: true,
    robotsFollow: true,
  },
  'vantage-ecom': {
    id: 'seo-vantage-ecom',
    entityType: 'service',
    entityId: 'vantage-ecom',
    seoTitle: 'Amazon & Flipkart Product Photo Editing Services in Delhi | Gurucraftpro',
    metaDescription: 'Vantage E-Commerce photo retouching in Rohini, Delhi. 100% pure RGB 255 white background, ghost mannequin, dimension infographics & lifestyle mockups.',
    focusKeyword: 'amazon product photo editing delhi',
    secondaryKeywords: ['flipkart product image retouching', 'white background removal', 'ghost mannequin photo editing'],
    canonicalUrl: 'https://gurucraftpro.com/vantage-ecom',
    ogTitle: 'Vantage E-Commerce Photo Editing for Amazon & Flipkart | Gurucraftpro',
    ogDescription: 'Maximize online marketplace conversions with studio-grade pure white cutouts, shadow generation, and infographics.',
    ogImage: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1200&q=80',
    twitterCard: 'summary_large_image',
    robotsIndex: true,
    robotsFollow: true,
  },
  'photoshop-studio': {
    id: 'seo-photoshop-studio',
    entityType: 'page',
    entityId: 'photoshop-studio',
    seoTitle: 'AI Photoshop Action Studio & Bulk Automation Generator | Gurucraftpro',
    metaDescription: 'Generate ready-to-run Adobe Photoshop .ATN action files and step-by-step automation guides using AI for bulk image retouching and e-commerce workflows.',
    focusKeyword: 'photoshop action automation generator',
    secondaryKeywords: ['download photoshop actions', 'bulk photo editing automation', 'photoshop frequency separation action'],
    canonicalUrl: 'https://gurucraftpro.com/photoshop-studio',
    ogTitle: 'AI Photoshop Action Studio & Workflow Automation | Gurucraftpro',
    ogDescription: 'Turn complex Photoshop edits into 1-click downloadable actions and automated macro scripts.',
    ogImage: 'https://images.unsplash.com/photo-1572044162444-ad60f128bdea?auto=format&fit=crop&w=1200&q=80',
    twitterCard: 'summary_large_image',
    robotsIndex: true,
    robotsFollow: true,
  },
  'book-design': {
    id: 'seo-book-design',
    entityType: 'service',
    entityId: 'book-design',
    seoTitle: 'Bespoke Book Cover Design Services for KDP & Print | Gurucraftpro',
    metaDescription: 'Custom Amazon KDP paperback, hardcover dust jacket, and Kindle eBook cover design in Delhi. 300 DPI CMYK print-ready files, spine calculation & 3D mockups.',
    focusKeyword: 'custom book cover design delhi',
    secondaryKeywords: ['kdp paperback cover designer', 'kindle ebook cover artist', 'hardcover book dust jacket design'],
    canonicalUrl: 'https://gurucraftpro.com/book-cover-design',
    ogTitle: 'Bespoke Book Cover Design & KDP Print Formatting | Gurucraftpro',
    ogDescription: 'Award-winning book covers designed for self-publishers and authors worldwide with 3D promo assets.',
    ogImage: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=1200&q=80',
    twitterCard: 'summary_large_image',
    robotsIndex: true,
    robotsFollow: true,
  },
  'learn-ai-prompts': {
    id: 'seo-learn-ai-prompts',
    entityType: 'page',
    entityId: 'learn-ai-prompts',
    seoTitle: 'Curated AI Prompt Engineering Library for Midjourney & DALL-E 3 | Gurucraftpro',
    metaDescription: 'Explore 500+ commercial-ready AI image prompts for Midjourney v6, ChatGPT DALL-E 3, and Gemini with 1-click copy for photorealistic branding and posters.',
    focusKeyword: 'ai prompt library midjourney',
    secondaryKeywords: ['dall-e 3 graphic prompts', 'ai image prompts copy', 'commercial midjourney prompt templates'],
    canonicalUrl: 'https://gurucraftpro.com/learn-ai-prompts',
    ogTitle: 'Curated AI Prompt Engineering Library | Gurucraftpro',
    ogDescription: 'Production-ready AI prompts crafted by senior visual designers for stunning renders in seconds.',
    ogImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
    twitterCard: 'summary_large_image',
    robotsIndex: true,
    robotsFollow: true,
  },
  about: {
    id: 'seo-about',
    entityType: 'page',
    entityId: 'about',
    seoTitle: 'About Annu Dhaneja & Gurucraftpro Creative Studio Rohini Delhi',
    metaDescription: 'Meet Annu Dhaneja, Founder & Creative Director of Gurucraftpro in Rohini, Delhi. Over 8+ years specializing in brand identity, e-commerce graphics & spiritual art.',
    focusKeyword: 'Annu Dhaneja graphic designer delhi',
    secondaryKeywords: ['about gurucraftpro', 'creative director rohini delhi', 'annu dhaneja portfolio'],
    canonicalUrl: 'https://gurucraftpro.com/about',
    ogTitle: 'About Annu Dhaneja & Gurucraftpro Creative Studio',
    ogDescription: 'Crafting meaningful brand identities, digital artwork, and e-commerce solutions with passion and precision.',
    ogImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1200&q=80',
    twitterCard: 'summary_large_image',
    robotsIndex: true,
    robotsFollow: true,
  },
  contact: {
    id: 'seo-contact',
    entityType: 'page',
    entityId: 'contact',
    seoTitle: 'Contact Annu Dhaneja | Gurucraftpro Studio Rohini, Delhi 110085',
    metaDescription: 'Connect with Annu Dhaneja in Sector 8, Rohini, Delhi for custom graphic design quotes, book cover briefs, e-commerce projects, and WhatsApp consultations.',
    focusKeyword: 'contact graphic designer rohini delhi',
    secondaryKeywords: ['annu dhaneja phone number', 'gurucraftpro address rohini', 'hire graphic designer delhi'],
    canonicalUrl: 'https://gurucraftpro.com/contact',
    ogTitle: 'Contact Annu Dhaneja | Gurucraftpro Studio Delhi',
    ogDescription: 'Get in touch for instant quotes, project discovery calls, or direct WhatsApp support in Rohini, Delhi.',
    ogImage: 'https://images.unsplash.com/photo-1423666639041-f56000c27a9a?auto=format&fit=crop&w=1200&q=80',
    twitterCard: 'summary_large_image',
    robotsIndex: true,
    robotsFollow: true,
  },
};

export const redirectsData: any[] = [
  { id: 'red-1', oldUrl: '/old-services', newUrl: '/services', type: 301, active: true },
  { id: 'red-2', oldUrl: '/graphic-design-delhi', newUrl: '/services/graphic-design', type: 301, active: true },
];

export let robotsTxtContent = `User-agent: *
Allow: /
Disallow: /admin
Disallow: /api/admin
Disallow: /api/payments
Disallow: /dashboard

Sitemap: https://gurucraftpro.com/sitemap.xml
Host: https://gurucraftpro.com`;

export function updateRobotsTxtContent(newContent: string) {
  robotsTxtContent = newContent;
}

// 6. Theme & Appearance Settings
export const themeSettings: any = {
  primaryColor: '#9333ea', // purple-600
  secondaryColor: '#14b8a6', // teal-500
  accentColor: '#f59e0b', // amber-500
  backgroundColor: '#090d16',
  surfaceColor: '#0f172a',
  cardColor: '#1e293b',
  textColor: '#f8fafc',
  mutedTextColor: '#94a3b8',
  borderColor: '#334155',
  mode: 'dark',
  preset: 'Modern',
  containerWidth: 'max-w-7xl',
  sectionSpacing: 'py-12',
  cardRadius: 'rounded-3xl',
  buttonRadius: 'rounded-xl',
  headerHeight: 'h-20',
};

export const headerSettings: any = {
  showLogo: true,
  logoSize: 40,
  showNav: true,
  showCta: true,
  ctaText: 'Get Free Quote',
  ctaUrl: '/contact',
  showSearch: true,
  showThemeToggle: true,
  showCart: true,
  showWhatsApp: true,
};

export const footerSettings: any = {
  showLogo: true,
  description: 'GurucraftPro Studio — Empowering brands, authors, online sellers, and individuals through creative design and style excellence.',
  showQuickLinks: true,
  showServices: true,
  showSocials: true,
  showMarketplaces: true,
  showContact: true,
  showWhatsApp: true,
  copyrightText: '© 2026 GurucraftPro Studio. All Rights Reserved. Led by Annu Dhaneja.',
};

// Payment Gateway Settings (Razorpay)
export const paymentSettingsData: {
  enabled: boolean;
  mode: 'test' | 'live';
  keyId: string;
  keySecret: string;
  webhookSecret: string;
  companyName: string;
  themeColor: string;
  lastTestedAt?: string;
  lastTestStatus?: 'success' | 'failed' | 'untested';
  lastTestMessage?: string;
} = {
  enabled: true,
  mode: (process.env.RAZORPAY_MODE === 'live' || (process.env.RAZORPAY_KEY_ID || '').startsWith('rzp_live')) ? 'live' : 'test',
  keyId: (process.env.RAZORPAY_KEY_ID || '').replace(/^["']|["']$/g, '').trim(),
  keySecret: (process.env.RAZORPAY_KEY_SECRET || '').replace(/^["']|["']$/g, '').trim(),
  webhookSecret: (process.env.RAZORPAY_WEBHOOK_SECRET || '').replace(/^["']|["']$/g, '').trim(),
  companyName: 'GurucraftPro Studio',
  themeColor: '#7c3aed',
  lastTestedAt: undefined,
  lastTestStatus: 'untested',
  lastTestMessage: undefined,
};

// 7. Media Library Data
export const mediaItemsData: any[] = [
  {
    id: 'med-1',
    filename: 'brand-banner-hero.jpg',
    url: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?auto=format&fit=crop&w=1200&q=80',
    sizeKb: 340,
    mimeType: 'image/jpeg',
    category: 'image',
    altText: 'GurucraftPro Graphic Design Branding Workspace',
    title: 'Brand Hero Artwork',
    folder: 'General',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'med-2',
    filename: 'guruji-bracelet-preview.jpg',
    url: 'https://images.unsplash.com/photo-1611591475281-229ef58d55fa?auto=format&fit=crop&w=1200&q=80',
    sizeKb: 210,
    mimeType: 'image/jpeg',
    category: 'image',
    altText: 'Sacred Guruji Divine Bracelet Product Photo',
    title: 'Guruji Bracelet Photo',
    folder: 'Products',
    createdAt: new Date().toISOString(),
  },
];

// 8. Content Versions Data
export const contentVersionsData: any[] = [
  {
    id: 'ver-1',
    entityType: 'page',
    entityId: 'page-home',
    versionNumber: 1,
    title: 'Initial Homepage Publish',
    authorName: 'Annu Dhaneja',
    timestamp: new Date(Date.now() - 86400000 * 3).toISOString(),
    snapshotData: { pageTitle: 'GurucraftPro Studio Home v1' },
  },
];

// 9. RBAC & Security Data
export const adminUsersData: any[] = [
  {
    id: 'adm-super-annu',
    name: 'Annu Dhaneja',
    email: 'annudhaneja@gmail.com',
    role: 'Super Admin',
    isSuperAdmin: true,
    isOwner: true,
    passwordPin: '852783', // Primary Security PIN / Password for Annu Dhaneja
    permissions: [
      'page.create', 'page.edit', 'page.delete',
      'service.create', 'service.edit', 'service.delete',
      'product.create', 'product.edit', 'product.delete',
      'seo.edit', 'theme.edit', 'payment.view', 'payment.refund',
      'users.view', 'admin.manage', 'settings.edit', 'security.manage',
      'photoshop.manage', 'quickservices.manage', 'wardrobe.manage', 'bookcover.manage'
    ],
    twoFactorEnabled: true,
    lastLogin: new Date().toISOString(),
    failedLoginAttempts: 0,
    lockoutUntil: null,
  },
  {
    id: 'adm-staff-content',
    name: 'Content Manager Staff',
    email: 'content@gurucraftpro.com',
    role: 'Content Manager',
    isSuperAdmin: false,
    isOwner: false,
    passwordPin: '1234',
    permissions: ['page.create', 'page.edit', 'service.create', 'service.edit', 'product.create', 'product.edit'],
    twoFactorEnabled: false,
    lastLogin: new Date(Date.now() - 86400000).toISOString(),
    failedLoginAttempts: 0,
    lockoutUntil: null,
  },
];

export const auditLogsData: any[] = [
  {
    id: 'log-101',
    adminId: 'adm-super-annu',
    adminName: 'Annu Dhaneja',
    action: 'LOGIN_SUCCESS',
    resource: 'Admin Auth',
    details: 'Admin authenticated successfully with server-verified credentials & MFA',
    ipAddress: '127.0.0.1 (Rohini, Delhi)',
    timestamp: new Date().toISOString(),
  },
];

export const adminSessionsData: any[] = [
  {
    id: 'sess-init-1',
    token: 'adm_sess_init_annu_852783',
    adminId: 'adm-super-annu',
    adminEmail: 'annudhaneja@gmail.com',
    adminName: 'Annu Dhaneja',
    adminRole: 'Super Admin',
    device: 'Desktop Workstation (Chrome / macOS)',
    ip: '127.0.0.1 (Rohini, Delhi)',
    loginTime: new Date().toISOString(),
    lastActive: new Date().toISOString(),
    expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
  },
];

// MFA Challenges Store (Temporary challenge tokens for 2-step verification)
export const pendingMfaChallenges: Map<string, {
  adminId: string;
  email: string;
  code: string;
  createdAt: number;
  expiresAt: number;
}> = new Map();

// Rate Limiting Map (Tracks failed attempts per IP or Email)
export const loginAttemptsMap: Map<string, {
  attempts: number;
  firstAttempt: number;
  lockedUntil?: number;
}> = new Map();


export const bookCoverPackages: any[] = [
  {
    id: 'pkg-basic',
    name: 'Basic Cover Package',
    code: 'basic',
    description: 'Front cover design ideal for Kindle, Google Books, and eBook publishing.',
    price: 1299,
    originalPrice: 1999,
    features: ['Front Cover Design', '3D Digital Book Mockup', 'High-Res JPG & PNG', '2 Revisions Included'],
    deliveryTime: '2-3 Business Days',
    revisionsCount: 2,
    isPopular: false,
    enabled: true,
  },
  {
    id: 'pkg-standard',
    name: 'Standard KDP Paperback Package',
    code: 'standard',
    description: 'Complete paperback layout with front, spine, back cover, & barcode placement for KDP.',
    price: 2499,
    originalPrice: 3499,
    features: ['Front + Spine + Back Layout', 'Amazon KDP Print-Ready PDF', 'Calculated Spine Thickness', '3D Promo Mockup', '3 Revisions Included'],
    deliveryTime: '3-4 Business Days',
    revisionsCount: 3,
    isPopular: true,
    enabled: true,
  },
  {
    id: 'pkg-premium',
    name: 'Complete Print & Digital Suite',
    code: 'premium',
    description: 'Full Paperback, Hardcover Dust Jacket, Kindle eBook, Social Media Banners & Vector Source Files.',
    price: 3999,
    originalPrice: 5499,
    features: ['Front, Spine, Back & Hardcover', 'Kindle / eBook Optimized Cover', 'Promotional Social Media Mockup Set', 'Editable Source Files (AI/PSD)', 'Unlimited Revisions', 'Fast 48-Hour Delivery'],
    deliveryTime: '2 Business Days',
    revisionsCount: 99,
    isPopular: false,
    enabled: true,
  },
  {
    id: 'pkg-custom',
    name: 'Custom Publisher Quotation',
    code: 'custom',
    description: 'Special requirements for book series boxsets, custom hand illustrations, or bulk titles.',
    price: 0,
    features: ['Custom Trim & Bleed Requirements', 'Multi-book Series Boxset', 'Custom Illustration & Lettering', 'Dedicated Designer Direct Chat'],
    deliveryTime: 'Custom Timeline',
    revisionsCount: 5,
    isPopular: false,
    enabled: true,
  },
];

export const bookCoverProjects: any[] = [
  {
    id: 'BCP-849201',
    customerName: 'Aarav Sharma',
    customerEmail: 'aarav.sharma@example.com',
    customerPhone: '9876543210',
    projectType: 'new-cover',
    bookTitle: 'The Shadows of Hastinapur',
    subtitle: 'An Unfold Mythological Thriller',
    authorName: 'Aarav Sharma',
    language: 'English',
    bookType: 'Detective / Mystery',
    shortDescription: 'A gripping ancient mystery surrounding a forgotten artifact beneath the ruins of Hastinapur.',
    mainStoryConcept: 'Archaeologist Dr. Kabir discovers a hidden chamber in Hastinapur revealing a conspiracy that threatens modern Delhi.',
    coverTypes: ['Full Paperback Cover', 'Amazon KDP Cover', 'Book Mockup'],
    bookFormat: 'Paperback',
    trimSize: '6 × 9 inch',
    pageCount: 320,
    paperType: 'Cream',
    interiorType: 'Black & White',
    estimatedSpineWidth: '0.800 inches (20.32 mm)',
    publishingPlatform: 'Amazon KDP',
    styleFeels: ['Mysterious', 'Cinematic', 'Dark', 'Spiritual'],
    primaryColor: '#0f172a',
    secondaryColor: '#d97706',
    accentColor: '#38bdf8',
    chooseColorsForMe: false,
    typographyPreference: 'Dramatic',
    visualConceptText: 'Dark ancient temple ruins in moonlight with glowing blue inscriptions on stone pillar.',
    locationEnvironment: 'Mansion / Temple ruins',
    importantObjects: ['Ancient Seal', 'Moon', 'Torches'],
    mood: 'Mysterious',
    referenceFiles: ['https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80'],
    selectedPackageId: 'pkg-standard',
    selectedPackageName: 'Standard KDP Paperback Package',
    price: 2499,
    paymentStatus: 'paid',
    status: 'In Design',
    assignedDesignerName: 'Annu Dhaneja',
    previewFiles: ['https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80'],
    finalFiles: [],
    revisions: [],
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export const bookCoverQuestions: any[] = [
  { id: 'q1', label: 'Does your book have an ISBN barcode?', type: 'radio', options: ['Yes - I will upload barcode', 'No - Leave barcode area empty', 'Please generate dummy barcode'], required: true, step: 7 },
  { id: 'q2', label: 'Do you require Devnagari (Hindi) typography on title?', type: 'radio', options: ['English Only', 'Hindi Only', 'Dual English + Hindi Title'], required: false, step: 1 },
];

export const contactMessagesData: any[] = [
  {
    id: 'msg-1',
    name: 'Priya Sharma',
    email: 'priya.sharma@example.com',
    phone: '+91 98765 43210',
    service: 'Graphic Design',
    message: 'Interested in a custom brand identity package for my fashion startup.',
    status: 'Unread',
    createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
  },
  {
    id: 'msg-2',
    name: 'Rohan Gupta',
    email: 'rohan.g@example.com',
    phone: '+91 91234 56789',
    service: 'Wardrobe Consultation',
    message: 'Looking for a 7-day capsule outfit styling consultation for an upcoming wedding season.',
    status: 'Replied',
    createdAt: new Date(Date.now() - 3600000 * 28).toISOString(),
  },
];

export const vantageBeforeAfterData: any[] = [
  {
    id: 'ba-1',
    title: 'Ghost Mannequin Apparel Transformation',
    description: '3D invisible mannequin neck joint combination with crease smoothing for ethnic kurtas.',
    beforeImage: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80',
    afterImage: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=800&q=80',
    category: 'Ghost Mannequin',
    serviceId: 'vantage-srv-2',
    visible: true,
  },
  {
    id: 'ba-2',
    title: 'Amazon Pure White Background & Drop Shadow',
    description: 'Isolation to pure RGB 255,255,255 white with soft directional contact shadow.',
    beforeImage: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80',
    afterImage: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80',
    category: 'Product Image Editing',
    serviceId: 'vantage-srv-1',
    visible: true,
  },
  {
    id: 'ba-3',
    title: 'Jersey Fabric Recoloring & Team Customization',
    description: 'Color swap across 8 team variants while retaining realistic fabric weave and specular highlights.',
    beforeImage: 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&w=800&q=80',
    afterImage: 'https://images.unsplash.com/photo-1581655353564-df123a1eb820?auto=format&fit=crop&w=800&q=80',
    category: 'Apparel & Fashion',
    serviceId: 'vantage-srv-3',
    visible: true,
  },
  {
    id: 'ba-4',
    title: 'Jewelry & Watch Refinement',
    description: 'Dust removal, gemstone specular shine enhancement, and metal polishing.',
    beforeImage: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=800&q=80',
    afterImage: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=800&q=80',
    category: 'Advanced Editing',
    serviceId: 'vantage-srv-5',
    visible: true,
  },
];

export const vantageServicesData: any[] = [
  {
    id: 'vantage-srv-1',
    slug: 'background-removal-pure-white',
    title: 'Amazon & Flipkart Pure White BG Isolation',
    category: 'marketplace-editing',
    categoryName: 'Marketplace Product Editing',
    marketplace: 'amazon',
    shortDescription: 'Pure white RGB 255 background isolation, soft shadow addition, & Amazon main image compliance.',
    fullDescription: 'Transform raw camera or phone product shots into marketplace-compliant images. We perform pixel-accurate pen tool clipping path extraction, background isolation to pure RGB 255,255,255, drop/reflective shadow creation, and color correction to guarantee 100% compliance with Amazon, Flipkart, Etsy, and Shopify listing guidelines.',
    imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1200&q=80',
    ],
    startingPrice: 499,
    salePrice: 399,
    unit: 'per image',
    deliveryTime: '24 Hrs',
    rating: 4.9,
    reviewsCount: 128,
    featured: true,
    visible: true,
    packages: [
      {
        id: 'pkg-bg-1',
        name: 'Basic (1 Image)',
        price: 399,
        originalPrice: 499,
        unit: 'per image',
        deliveryTime: '24 Hrs',
        features: ['1 Pure White RGB 255 Image', 'Drop Shadow Addition', 'Basic Dust & Scratch Touchup', 'High-Res JPG & PNG Output'],
      },
      {
        id: 'pkg-bg-2',
        name: 'Standard (5 Images)',
        price: 1699,
        originalPrice: 1999,
        unit: 'per batch',
        deliveryTime: '24 Hrs',
        popular: true,
        features: ['5 Pure White RGB 255 Images', 'Drop or Natural Shadow', 'Color Balance & Contrast', '2 Revisions Included', 'Source PSD Files'],
      },
      {
        id: 'pkg-bg-3',
        name: 'Premium (15 Images Batch)',
        price: 4499,
        originalPrice: 5999,
        unit: 'per batch',
        deliveryTime: '48 Hrs',
        features: ['15 Marketplace Images', 'Hero Image Infographic Layout', 'Express Priority Turnaround', 'Unlimited Revisions', 'Full Commercial Rights'],
      },
    ],
    features: [
      'Amazon RGB 255,255,255 Pure White Compliance',
      'Pixel-Accurate Hand-Drawn Pen Tool Clipping Paths',
      'Realistic Drop, Contact, or Reflection Shadows',
      'Color Balance, Exposure & Sharpness Tuning',
      'High Resolution 2000x2000px Output Ready for Zoom',
    ],
    whatYouGet: [
      '100% Marketplace Compliant High-Res JPG (RGB White)',
      'Transparent Background PNG File for Marketing Graphics',
      'Editable Layered PSD File (Standard & Premium Packages)',
      'Commercial License Rights for E-Commerce Usage',
    ],
    processSteps: [
      { step: 1, title: 'Upload Raw Photos', description: 'Upload your high-res unedited product photos directly via our secure form.' },
      { step: 2, title: 'Requirement Review', description: 'Our lead photo editor checks lighting, shadows, and target platform specs.' },
      { step: 3, title: 'Hand Pen Clipping & Shadowing', description: 'Manual background isolation, shadow creation, and color calibration.' },
      { step: 4, title: 'Quality Control Check', description: 'Inspection against Amazon/Flipkart zoom standards.' },
      { step: 5, title: 'Final High-Res Delivery', description: 'Download ready-to-list assets directly from your account dashboard.' },
    ],
    specifications: [
      { key: 'Background RGB', value: '255, 255, 255 Pure White' },
      { key: 'Resolution', value: '2000 x 2000 px or Custom' },
      { key: 'Color Profile', value: 'sRGB / Adobe RGB' },
      { key: 'Format', value: 'JPG, PNG, Layered PSD' },
      { key: 'Turnaround', value: '12 - 24 Hours' },
    ],
    faqs: [
      { question: 'Is this guaranteed to pass Amazon Seller Central guidelines?', answer: 'Yes! All white background cuts follow strict Amazon RGB 255 main image rules.' },
      { question: 'Can I request transparent backgrounds?', answer: 'Absolutely. We provide both pure white JPGs and transparent PNGs.' },
    ],
    relatedServiceIds: ['vantage-srv-2', 'vantage-srv-5'],
    seoTitle: 'Amazon & Flipkart Pure White Background Removal | VantageEcom',
    seoDescription: 'Professional e-commerce product image background removal, drop shadow, and Amazon RGB 255 compliance.',
  },
  {
    id: 'vantage-srv-2',
    slug: 'ghost-mannequin-editing',
    title: 'Ghost Mannequin Apparel Editing',
    category: 'apparel-fashion',
    categoryName: 'Apparel & Fashion Editing',
    marketplace: 'all',
    shortDescription: '3D invisible hollow mannequin clothing combination for dresses, jackets, shirts, & traditional ethnic wear.',
    fullDescription: 'Present your apparel line with a sleek 3D hollow effect that allows customers to view inner neck labels, lining textures, and tail shapes without visible mannequins or models. Perfect for fashion brands, Amazon fashion sellers, and apparel catalogs.',
    imageUrl: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1200&q=80',
    ],
    startingPrice: 799,
    salePrice: 699,
    unit: 'per garment',
    deliveryTime: '24-48 Hrs',
    rating: 5.0,
    reviewsCount: 94,
    featured: true,
    visible: true,
    packages: [
      {
        id: 'pkg-gm-1',
        name: 'Basic Garment (1 Garment)',
        price: 699,
        originalPrice: 799,
        unit: 'per garment',
        deliveryTime: '24 Hrs',
        features: ['Inner Neck Joint Combination', 'Basic Wrinkle Smoothing', 'Pure White or Transparent BG'],
      },
      {
        id: 'pkg-gm-2',
        name: 'Standard Fashion (5 Garments)',
        price: 2999,
        originalPrice: 3499,
        unit: 'per batch',
        deliveryTime: '48 Hrs',
        popular: true,
        features: ['5 Garments (Front + Inner Neck)', 'Advanced Wrinkle & Crease Smoothing', 'Symmetry & Shape Correction', '2 Color Swatches'],
      },
      {
        id: 'pkg-gm-3',
        name: 'Premium Suit / Heavy Ethnic (10 Items)',
        price: 5999,
        originalPrice: 6999,
        unit: 'per batch',
        deliveryTime: '48 Hrs',
        features: ['10 Heavy Ethnic / Blazer Garments', 'Complex Lining & Dupatta Ghost Stitches', '3D Volume Enhancements', 'Unlimited Revisions'],
      },
    ],
    features: [
      'Seamless Neck Joint Alignment & Tag Insertion',
      'Wrinkle, Dust, and Static Crease Smoothing',
      'Symmetry Adjustment and Fabric Drape Enhancement',
      'Color Saturation and True Fabric Tone Matching',
    ],
    whatYouGet: [
      'High-Res 300 DPI Ghost Mannequin Images',
      'Transparent PNG & Pure White JPG',
      'Layered Source Files',
    ],
    processSteps: [
      { step: 1, title: 'Upload Front & Back Shot', description: 'Upload garment photo on mannequin + separate inner neck/tag photo.' },
      { step: 2, title: 'Joint Stitching', description: '3D invisible combination of neck joint, cuffs, and hem.' },
      { step: 3, title: 'Wrinkle Removal', description: 'Digital iron out of creases, lint, and static distortions.' },
      { step: 4, title: 'Shape Calibration', description: 'Symmetry alignment for perfect hanger appeal.' },
      { step: 5, title: 'Final Delivery', description: 'Ready for e-commerce publishing.' },
    ],
    specifications: [
      { key: 'Garment Type', value: 'Shirts, Jackets, Kurtas, Dresses, Suits' },
      { key: 'Resolution', value: '300 DPI 2400x2400px' },
      { key: 'Turnaround', value: '24-48 Hours' },
    ],
    faqs: [
      { question: 'Do I need to take a separate photo of the inner neck?', answer: 'Yes, shoot the garment inside out or the inner neck tag separately for seamless joint stitching.' },
    ],
    relatedServiceIds: ['vantage-srv-3', 'vantage-srv-4'],
    seoTitle: 'Ghost Mannequin Apparel Photo Editing Service | VantageEcom',
    seoDescription: 'Professional hollow 3D invisible mannequin apparel editing for shirts, dresses, suits, and ethnic wear listings.',
  },
  {
    id: 'vantage-srv-3',
    slug: 'jersey-editing',
    title: 'Jersey & Sports Apparel Customization',
    category: 'apparel-fashion',
    categoryName: 'Apparel & Fashion Editing',
    marketplace: 'all',
    shortDescription: 'Fabric recoloring, player name & number placement, sponsor logo changes, and multi-team jersey variations.',
    fullDescription: 'Save thousands on photoshoot costs by digitally generating complete team jersey lines, custom colorways, player nameplates, and sponsor logo swaps from a single base photo session.',
    imageUrl: 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&w=1200&q=80',
    startingPrice: 699,
    unit: 'per jersey',
    deliveryTime: '24 Hrs',
    rating: 4.8,
    reviewsCount: 52,
    featured: true,
    visible: true,
    packages: [
      { id: 'pkg-j-1', name: 'Single Jersey Edit', price: 699, unit: 'per design', deliveryTime: '24 Hrs', features: ['1 Jersey Color Swap', 'Player Name & Number Overlay', 'Logo Placement'] },
      { id: 'pkg-j-2', name: 'Team Kit Package (5 Variants)', price: 2799, unit: 'per batch', deliveryTime: '48 Hrs', popular: true, features: ['5 Color Variants', 'Font & Typography Matching', 'Sponsor Logo Swap'] },
    ],
    features: ['Realistic Fabric Texture & Fold Retention', 'Sublimation Graphic Alignment', 'Name & Number Typography Styling', 'Multiple Color Variants'],
    whatYouGet: ['High-Res Ecom Ready Images', 'Transparent PNG for Customizers'],
    processSteps: [
      { step: 1, title: 'Upload Base Jersey Photo', description: 'Upload base jersey photo and design artwork/names.' },
      { step: 2, title: 'Digital Mapping', description: 'Precision mapping onto fabric curves and lighting.' },
      { step: 3, title: 'Delivery', description: 'Download all team color variants.' },
    ],
    specifications: [
      { key: 'Output Format', value: 'JPG, PNG, Vector Source' },
      { key: 'Turnaround', value: '24 Hours' },
    ],
    faqs: [
      { question: 'Can you change the sponsor logo on existing jerseys?', answer: 'Yes, we remove old logos and blend new logos seamlessly onto the fabric.' },
    ],
    relatedServiceIds: ['vantage-srv-2', 'vantage-srv-4'],
  },
  {
    id: 'vantage-srv-4',
    slug: 'magic-layer-color-swatches',
    title: 'Magic Layer Color Swatch Variations',
    category: 'advanced-editing',
    categoryName: 'Advanced Editing',
    marketplace: 'all',
    shortDescription: 'Generate dozens of realistic color and texture variations from one master product photo.',
    fullDescription: 'Stop shooting the same product in 20 different colors. Our Magic Layer technique isolates materials, lighting highlights, and shadows so we can generate unlimited color swatches with exact PANTONE or RGB accuracy.',
    imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1200&q=80',
    startingPrice: 599,
    unit: 'per variation',
    deliveryTime: '24 Hrs',
    rating: 4.9,
    reviewsCount: 67,
    featured: false,
    visible: true,
    packages: [
      { id: 'pkg-ml-1', name: '3 Color Variants', price: 1499, unit: 'per product', deliveryTime: '24 Hrs', features: ['3 Color/Pattern Swatches', 'Shadow & Highlight Preservation'] },
      { id: 'pkg-ml-2', name: '10 Color Variants', price: 3999, unit: 'per product', deliveryTime: '48 Hrs', popular: true, features: ['10 Color Swatches', 'PANTONE Matching', 'PSD Master File'] },
    ],
    features: ['Exact Color Matching to Physical Samples', 'Preserves Reflections & Highlights', 'Fast Scalability for Large Catalogs'],
    whatYouGet: ['Individual Image Files per Color Variant', 'Swatch Palette Sheet'],
    processSteps: [
      { step: 1, title: 'Send Master Photo & Color Codes', description: 'Provide master shot + HEX/PANTONE codes.' },
      { step: 2, title: 'Layer Masking & Shader Tuning', description: 'Separate color channel and apply shader.' },
      { step: 3, title: 'Delivery', description: 'Download all catalog swatches.' },
    ],
    specifications: [
      { key: 'Color Precision', value: 'PANTONE / HEX / RGB' },
    ],
    faqs: [
      { question: 'Does it look artificial?', answer: 'No! We maintain natural material texture, grain, lighting, and shadows.' },
    ],
    relatedServiceIds: ['vantage-srv-1', 'vantage-srv-3'],
  },
  {
    id: 'vantage-srv-5',
    slug: 'custom-size-charts',
    title: 'Custom E-Commerce Size Chart & Infographics',
    category: 'apparel-fashion',
    categoryName: 'Apparel & Fashion',
    marketplace: 'amazon',
    shortDescription: 'Amazon, Flipkart & Shopify compliant size guide graphics with dual-unit measurement tables and brand icons.',
    fullDescription: 'Reduce returns and increase buyer confidence with clear, elegant size chart graphics customized to your brand colors and garment measurements.',
    imageUrl: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&w=1200&q=80',
    startingPrice: 899,
    unit: 'per size chart',
    deliveryTime: '24-48 Hrs',
    rating: 5.0,
    reviewsCount: 88,
    featured: true,
    visible: true,
    packages: [
      { id: 'pkg-sc-1', name: 'Single Size Chart', price: 899, unit: 'per chart', deliveryTime: '24 Hrs', features: ['Dual Inches & CM Table', 'Garment Measurement Diagram', 'Brand Color Styling'] },
      { id: 'pkg-sc-2', name: 'Brand Size Guide Suite (3 Charts)', price: 2199, unit: 'per bundle', deliveryTime: '48 Hrs', popular: true, features: ['3 Size Charts (Tops, Bottoms, Dresses)', 'How to Measure Visual Diagram', 'Editable Source Files'] },
    ],
    features: ['Inches & CM Measurement Tables', 'Brand Color Match', 'Visual Silhouette Line Art Diagram'],
    whatYouGet: ['High-Res JPG for Seller Central', 'Editable Source AI / Vector'],
    processSteps: [
      { step: 1, title: 'Provide Measurement Numbers', description: 'Send measurement table (S, M, L, XL, etc.)' },
      { step: 2, title: 'Layout & Graphic Design', description: 'Design clean visual guide with brand typography.' },
      { step: 3, title: 'Final Delivery', description: 'High-res file ready to upload.' },
    ],
    specifications: [
      { key: 'Compliance', value: 'Amazon / Flipkart / Etsy' },
    ],
    faqs: [
      { question: 'Can you include custom measurement instructions?', answer: 'Yes, we add visual illustrations showing where to measure chest, waist, hips, and length.' },
    ],
    relatedServiceIds: ['vantage-srv-2', 'vantage-srv-1'],
  },
  {
    id: 'vantage-srv-6',
    slug: 'product-video-editing',
    title: 'Short-Form Product Video & Reels Editing',
    category: 'video-editing',
    categoryName: 'Video Editing',
    marketplace: 'all',
    shortDescription: '15s to 60s viral product reels, Amazon video listing clips, and animated feature showcase videos.',
    fullDescription: 'Capture customer attention with fast-paced video editing, motion callout titles, background music, and platform-optimized aspect ratios (9:16 vertical reels, 16:9 Amazon video).',
    imageUrl: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=1200&q=80',
    startingPrice: 1499,
    unit: 'per video',
    deliveryTime: '48 Hrs',
    rating: 4.9,
    reviewsCount: 41,
    featured: true,
    visible: true,
    packages: [
      { id: 'pkg-vid-1', name: 'Basic Reel (15-30s)', price: 1499, unit: 'per video', deliveryTime: '48 Hrs', features: ['15-30 Second Edit', 'Trendy Music & Transitions', 'Motion Feature Callout Text'] },
      { id: 'pkg-vid-2', name: 'Amazon Listing Video (60s)', price: 2999, unit: 'per video', deliveryTime: '48 Hrs', popular: true, features: ['Up to 60 Seconds', '16:9 & 9:16 Dual Formats', 'Voiceover Integration', 'Product Benefit Animations'] },
    ],
    features: ['High-Impact Motion Graphics', 'Royalty-Free Commercial Music', 'Optimized for Insta Reels, Shorts & Amazon Video'],
    whatYouGet: ['1080p / 4K MP4 Video Files', 'Thumbnail Graphic'],
    processSteps: [
      { step: 1, title: 'Upload Raw Clips', description: 'Provide video clips or phone footage.' },
      { step: 2, title: 'Editing & Motion Design', description: 'Trimming, music sync, callout text animations.' },
      { step: 3, title: 'Final Delivery', description: 'Download high-res MP4.' },
    ],
    specifications: [
      { key: 'Resolution', value: '1080p / 4K MP4' },
      { key: 'Aspect Ratios', value: '9:16, 16:9, 1:1' },
    ],
    faqs: [
      { question: 'Do you provide background music?', answer: 'Yes, all videos include royalty-free licensed music safe for commercial ads.' },
    ],
    relatedServiceIds: ['vantage-srv-1', 'vantage-srv-5'],
  },
  {
    id: 'vantage-srv-7',
    slug: 'format-conversion-services',
    title: 'File Format Conversion & Image Compression',
    category: 'file-conversion',
    categoryName: 'Format & File Conversion',
    marketplace: 'all',
    shortDescription: 'High-speed batch converting between JPG, PNG, WEBP, & PDF with lossless compression.',
    fullDescription: 'Convert batch product catalogs into web-optimized WebP, print-ready PDF, or transparent PNG format while preserving crystal clear resolution.',
    imageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
    startingPrice: 299,
    unit: 'per batch (50 files)',
    deliveryTime: '12 Hrs',
    rating: 4.8,
    reviewsCount: 35,
    featured: false,
    visible: true,
    packages: [
      { id: 'pkg-fc-1', name: 'Batch Conversion (50 Files)', price: 299, unit: 'per batch', deliveryTime: '12 Hrs', features: ['Up to 50 Images', 'JPG / PNG / WEBP / PDF Output', '90% Size Reduction without Quality Loss'] },
    ],
    features: ['WebP Conversion for Ultra Fast Site Speed', 'PDF Catalog Creation', 'Bulk Resizing to Amazon Specs'],
    whatYouGet: ['ZIP Archive with Converted Assets'],
    processSteps: [
      { step: 1, title: 'Upload Files', description: 'Select target format and quality.' },
      { step: 2, title: 'Processing', description: 'Batch execution.' },
      { step: 3, title: 'Download', description: 'Download ZIP file.' },
    ],
    specifications: [
      { key: 'Formats Supported', value: 'JPG, PNG, WEBP, PDF, SVG' },
    ],
    faqs: [
      { question: 'Will my image quality drop?', answer: 'No, we use smart compression algorithms that maintain crisp sharpness.' },
    ],
    relatedServiceIds: ['vantage-srv-1'],
  },
  {
    id: 'vantage-srv-8',
    slug: 'ecommerce-merchant-blueprint',
    title: 'E-Commerce Merchant Blueprint 2026',
    category: 'digital-products',
    categoryName: 'Digital Merchant Resources',
    marketplace: 'all',
    shortDescription: '85-page comprehensive e-book guide to product photography, Amazon SEO, listing conversions & seller growth.',
    fullDescription: 'Master the art of e-commerce visual merchandising. Learn lighting setups, Amazon main image rules, conversion copywriting, and A+ content strategies created by industry veterans.',
    imageUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=1200&q=80',
    startingPrice: 999,
    salePrice: 499,
    unit: 'per instant download',
    deliveryTime: 'Instant Download',
    rating: 5.0,
    reviewsCount: 112,
    featured: true,
    visible: true,
    packages: [
      { id: 'pkg-eb-1', name: 'Digital Edition (PDF + Templates)', price: 499, originalPrice: 999, unit: 'download', deliveryTime: 'Instant', features: ['85-Page Master Guide PDF', 'Amazon Main Image Checklist', 'Canva Size Chart Templates', 'Lifetime Updates'] },
    ],
    features: ['85 Detailed Illustrated Pages', 'Amazon & Flipkart Checklist Templates', 'Canva Editable Size Chart Assets'],
    whatYouGet: ['Instant Downloadable PDF + Resource Links'],
    processSteps: [
      { step: 1, title: 'Instant Purchase', description: 'Complete checkout to unlock instant download.' },
      { step: 2, title: 'Download Guide', description: 'Access PDF and Canva template links anytime from your dashboard.' },
    ],
    specifications: [
      { key: 'Format', value: 'Interactive PDF + Canva Templates' },
    ],
    faqs: [
      { question: 'How do I receive the file?', answer: 'You get an instant download link on payment completion and in your email receipt.' },
    ],
    relatedServiceIds: ['vantage-srv-1', 'vantage-srv-5'],
  },
];

export const vantageInquiriesData: any[] = [
  {
    id: 'inq-v1',
    serviceId: 'vantage-srv-2',
    serviceTitle: 'Ghost Mannequin Apparel Editing',
    serviceCategory: 'apparel-fashion',
    customerName: 'Aarav Mehta',
    customerEmail: 'aarav.m@fashionlabel.in',
    customerPhone: '+91 98112 23344',
    quantity: 12,
    platform: 'Amazon Fashion',
    deadline: '2 Days',
    description: 'Need 12 silk kurti sets combined with hollow neck joint effect for Amazon spring catalog.',
    specialRequirements: 'Please keep fabric shine and remove shoulder hanger shadows.',
    status: 'New',
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    customFieldsData: {
      clothingType: 'Kurti Sets',
      frontBack: 'Front + Back',
      backgroundPreference: 'Pure White (RGB 255)',
    },
  },
  {
    id: 'inq-v2',
    serviceId: 'vantage-srv-3',
    serviceTitle: 'Jersey Editing & Team Customization',
    serviceCategory: 'apparel-fashion',
    customerName: 'Karan Malhotra',
    customerEmail: 'karan@sportswear.com',
    customerPhone: '+91 99887 76655',
    quantity: 8,
    platform: 'Shopify Store',
    deadline: '24 Hours',
    description: 'Need 8 color swatches generated for our new dry-fit football jersey.',
    status: 'Quoted',
    quotedPrice: 3800,
    adminNotes: 'Provided discount quote for batch of 8 jersey recolors.',
    createdAt: new Date(Date.now() - 3600000 * 18).toISOString(),
    customFieldsData: {
      jerseyColors: 'Navy, Crimson, Forest Green, Gold, Pitch Black',
      hasNameNumber: 'Yes',
    },
  },
];

export const logsData: any[] = [];

// 10. Page Content CMS Stores (For Home, Wardrobe, Guruji Artwork, VantageEcom, Book Cover, AI Prompt, About Us, Contact Us)
export const pageContentsData: Record<string, any> = {
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
    sevenDaySystem: {
      days: {
        monday: { dayName: 'Monday', title: 'Corporate Power Outfit', top: 'Navy Silk Blouse', bottom: 'Tailored Cream Trousers', footwear: 'Pointed Nude Pumps', accessories: 'Minimalist Gold Hoops', color: 'Navy & Cream', stylingTip: 'Tuck blouse neatly and pair with a structured leather tote.', image: 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?auto=format&fit=crop&w=800&q=80' },
        tuesday: { dayName: 'Tuesday', title: 'Smart Casual Business', top: 'Pastel Blue Linen Shirt', bottom: 'Dark Indigo Chinos', footwear: 'Tan Leather Loafers', accessories: 'Classic Silver Watch', color: 'Blue & Tan', stylingTip: 'Roll sleeves to forearm level for an effortless professional edge.', image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=800&q=80' },
        wednesday: { dayName: 'Wednesday', title: 'Mid-Week Creative Fusion', top: 'Embroidered Kurti / Blazer', bottom: 'Slim Fit Denim', footwear: 'Block Heel Juttis', accessories: 'Statement Ring', color: 'Emerald & Denim', stylingTip: 'Blend traditional embroidery with clean denim lines.', image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80' },
        thursday: { dayName: 'Thursday', title: 'Executive Presentation Day', top: 'Charcoal Structured Jacket', bottom: 'Matching Pencil Skirt / Pants', footwear: 'Black Leather Heels', accessories: 'Pearl Studs', color: 'Charcoal & Black', stylingTip: 'Monochrome dark palette maximizes visual authority.', image: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=800&q=80' },
        friday: { dayName: 'Friday', title: 'Friday Casual to Evening Dinner', top: 'Satin Wrap Top', bottom: 'High-Waisted Trousers', footwear: 'Stiletto Sandals', accessories: 'Delicate Pendant', color: 'Burgundy & Black', stylingTip: 'Layer with a blazer during office hours; remove for evening dinner.', image: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=800&q=80' },
        saturday: { dayName: 'Saturday', title: 'Weekend Brunch & Social', top: 'Floral Print Midi Dress', bottom: 'N/A', footwear: 'White Leather Sneakers', accessories: 'Cat-Eye Sunglasses', color: 'Pastel Pink & Floral', stylingTip: 'Comfortable chic outfit with breathable natural fabrics.', image: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&w=800&q=80' },
        sunday: { dayName: 'Sunday', title: 'Relaxed Athleisure & Family Time', top: 'Soft Cotton Oversized Knit', bottom: 'Relaxed Tapered Joggers', footwear: 'Slip-On Canvas Shoes', accessories: 'Canvas Tote', color: 'Beige & Off-White', stylingTip: 'Soft neutral tones for cozy Sunday relaxation.', image: 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?auto=format&fit=crop&w=800&q=80' },
      },
    },
    styleCategories: [
      { id: 'sc-1', name: 'Office & Executive', description: 'Tailored suits, blazers & formal corporate wear', image: 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?auto=format&fit=crop&w=800&q=80', visible: true, order: 1 },
      { id: 'sc-2', name: 'Smart Casual & Everyday', description: 'Chinos, stylish tees, denim & relaxed jackets', image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=800&q=80', visible: true, order: 2 },
      { id: 'sc-3', name: 'Traditional & Festive Ethnic', description: 'Kurta sets, sarees, sherwanis & festive dupattas', image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80', visible: true, order: 3 },
      { id: 'sc-4', name: 'Wedding & Gala Party', description: 'Glamorous evening gowns & royal sherwanis', image: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=800&q=80', visible: true, order: 4 },
    ],
    questionnaire: [
      { id: 'q-1', fieldKey: 'clientName', label: 'Full Name', type: 'text', options: [], required: true, visible: true, order: 1 },
      { id: 'q-2', fieldKey: 'clientPhone', label: 'Phone / WhatsApp Number', type: 'text', options: [], required: true, visible: true, order: 2 },
      { id: 'q-3', fieldKey: 'clientEmail', label: 'Email Address', type: 'email', options: [], required: true, visible: true, order: 3 },
      { id: 'q-4', fieldKey: 'city', label: 'City & Location', type: 'text', options: [], required: true, visible: true, order: 4 },
      { id: 'q-5', fieldKey: 'occasion', label: 'Primary Occasion / Goal', type: 'dropdown', options: ['7-Day Daily Work & Casual Wardrobe', 'Corporate Executive Power Dressing', 'Wedding & Festival Season Styling', 'College & University Fashion', 'Vacation & Travel Style'], required: true, visible: true, order: 5 },
      { id: 'q-6', fieldKey: 'bodyType', label: 'Body Type', type: 'radio', options: ['Hourglass', 'Pear Shape', 'Athletic / Rectangle', 'Inverted Triangle', 'Apple Shape'], required: true, visible: true, order: 6 },
      { id: 'q-7', fieldKey: 'preferredStyle', label: 'Preferred Style Aesthetic', type: 'radio', options: ['Smart Casual & Western Formal', 'Traditional & Ethnic Fusion', 'Minimalist & Neutral Tones', 'Bold & Contemporary Trends'], required: true, visible: true, order: 7 },
      { id: 'q-8', fieldKey: 'colorPreferences', label: 'Favorite Colors & Colors to Avoid', type: 'text', options: [], required: false, visible: true, order: 8 },
      { id: 'q-9', fieldKey: 'budgetRange', label: 'Shopping Budget Range', type: 'dropdown', options: ['Under ₹5,000', '₹5,000 - ₹10,000', '₹10,000 - ₹20,000', '₹20,000+ Premium'], required: true, visible: true, order: 9 },
    ],
    whatShouldIWear: {
      questions: [
        { id: 'wsw-1', prompt: 'Where are you heading today?', options: ['Corporate Office', 'Casual Lunch / Cafe', 'Evening Dinner / Party', 'Festive Family Event', 'Travel / Workout'] },
        { id: 'wsw-2', prompt: 'What is the weather outside?', options: ['Hot & Sunny', 'Pleasant / Air Conditioned', 'Cool / Chilly', 'Monsoon / Rainy'] },
      ],
      recommendations: [
        { occasion: 'Corporate Office', weather: 'Pleasant / Air Conditioned', suggestion: 'Crisp navy blazer paired with beige chinos or cream trousers and leather loafers.', image: 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?auto=format&fit=crop&w=800&q=80' },
        { occasion: 'Casual Lunch / Cafe', weather: 'Hot & Sunny', suggestion: 'Pastel cotton kurti or breathable linen shirt with slim-fit trousers and tan footwear.', image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=800&q=80' },
      ],
      visible: true,
    },
    digitalWardrobeConfig: {
      categories: ['Tops & Shirts', 'Bottoms & Trousers', 'Dresses & Skirts', 'Ethnic & Sarees', 'Blazers & Outerwear', 'Footwear', 'Accessories & Bags'],
      maxUploads: 10,
      visible: true,
    },
  },
  'guruji-artwork': {
    pageHero: {
      title: 'Sacred Guruji Divine Spiritual Collection',
      description: 'Blessed bracelets, framed artwork, digital mobile wallpapers, stickers & daily vachan graphics.',
      bgImage: 'https://images.unsplash.com/photo-1611591475281-229ef58d55fa?auto=format&fit=crop&w=1200&q=80',
    },
    categoriesList: [
      { id: 'gcat-1', name: 'Bracelets', slug: 'bracelets', count: 12, visible: true },
      { id: 'gcat-2', name: 'Accessories', slug: 'accessories', count: 8, visible: true },
      { id: 'gcat-3', name: 'Donation Box', slug: 'donation-box', count: 4, visible: true },
      { id: 'gcat-4', name: 'Mobile Wallpapers', slug: 'mobile-wallpapers', count: 25, visible: true },
      { id: 'gcat-5', name: 'Digital Stickers', slug: 'digital-stickers', count: 30, visible: true },
      { id: 'gcat-6', name: 'Jai Guru Ji Graphics', slug: 'jai-guru-ji', count: 15, visible: true },
      { id: 'gcat-7', name: 'Daily Quotes', slug: 'daily-quotes', count: 50, visible: true },
      { id: 'gcat-8', name: 'Vachan Calendars', slug: 'vachan-calendars', count: 6, visible: true },
      { id: 'gcat-9', name: 'Digital Bookmarks', slug: 'digital-bookmarks', count: 10, visible: true },
      { id: 'gcat-10', name: 'Status & Story Graphics', slug: 'status-graphics', count: 40, visible: true },
      { id: 'gcat-11', name: 'Posters & Framed Art', slug: 'posters', count: 18, visible: true },
    ],
    downloadPolicy: {
      maxDownloadsPerPurchase: 5,
      linkExpiryDays: 30,
      enableSignedUrls: true,
      secureStoragePath: '/downloads/guruji-art/',
    },
  },
  'vantage-ecom': {
    pageHero: {
      title: 'VantageEcom E-Commerce Photo & Video Editing Studio',
      description: 'High-converting Amazon & Flipkart product editing, background removal, ghost mannequin, and size charts.',
      bgImage: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1200&q=80',
    },
    photoEditingServices: [
      { id: 've-1', name: 'Background Removal', price: 499, description: 'Pure white RGB 255 background isolation', deliveryTime: '24 Hrs', visible: true },
      { id: 've-2', name: 'Background Replacement', price: 699, description: 'Replace with studio environments or custom backdrops', deliveryTime: '24 Hrs', visible: true },
      { id: 've-3', name: 'Color Correction & Retouching', price: 599, description: 'Fix lighting, white balance, & skin/product texture', deliveryTime: '24 Hrs', visible: true },
      { id: 've-4', name: 'Ghost Mannequin Apparel Editing', price: 799, description: 'Hollow 3D mannequin effect for dresses & suits', deliveryTime: '24-48 Hrs', visible: true },
      { id: 've-5', name: 'Custom Size Charts & Infographics', price: 899, description: 'Marketplace compliant size guides with icons', deliveryTime: '48 Hrs', visible: true },
      { id: 've-6', name: 'Format Conversions (JPG/PDF/PNG/WEBP)', price: 299, description: 'High-res image compression & vector format conversion', deliveryTime: '12 Hrs', visible: true },
    ],
    portfolio: [
      { id: 'vep-1', title: 'Luxury Leather Bag Amazon BG Edit', description: 'Amazon RGB 255 pure white background with drop shadow.', image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80', category: 'Amazon Editing', visible: true },
      { id: 'vep-2', title: 'Ethnic Designer Saree Ghost Mannequin', description: 'Invisible mannequin neck joint alignment & crease removal.', image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80', category: 'Ghost Mannequin', visible: true },
    ],
    merchantGuides: [
      { id: 'g-1', title: 'Amazon Image Compliance Blueprint 2026', format: 'PDF Guide', price: 0, visible: true },
      { id: 'g-2', title: 'Flipkart High-Conversion Listing Playbook', format: 'E-Book', price: 0, visible: true },
    ],
  },
  'book-cover': {
    pageHero: {
      title: 'Bestselling Book Cover & KDP Print Layout Studio',
      description: 'Custom Kindle, eBook, paperback, hardcover, and Amazon KDP interior cover designs.',
      bgImage: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=1200&q=80',
    },
    servicesList: [
      { id: 'bcs-1', name: 'Front Cover Design', price: 1299, deliveryTime: '2 Days', visible: true },
      { id: 'bcs-2', name: 'Full Paperback Cover (Front + Spine + Back)', price: 2499, deliveryTime: '3 Days', visible: true },
      { id: 'bcs-3', name: 'Hardcover Dust Jacket Layout', price: 3499, deliveryTime: '4 Days', visible: true },
      { id: 'bcs-4', name: 'Amazon KDP Print-Ready Package', price: 2999, deliveryTime: '3 Days', visible: true },
      { id: 'bcs-5', name: '3D Digital Book Promo Mockups', price: 799, deliveryTime: '24 Hrs', visible: true },
    ],
    packages: bookCoverPackages,
    questions: bookCoverQuestions,
  },
  'ai-prompt': {
    pageHero: {
      title: 'Curated AI Prompt Engineering Library',
      description: 'Masterclass prompts for ChatGPT, Gemini, Midjourney, DALL-E, and Stable Diffusion.',
      bgImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
    },
    categoriesList: [
      { id: 'pcat-1', name: 'AI Image Prompts', platform: 'Midjourney / DALL-E', icon: 'Image', visible: true },
      { id: 'pcat-2', name: 'AI Video Prompts', platform: 'Runway / Luma', icon: 'Video', visible: true },
      { id: 'pcat-3', name: 'Graphic Design & Logo Prompts', platform: 'Midjourney', icon: 'Sparkles', visible: true },
      { id: 'pcat-4', name: 'E-commerce & Product Photography', platform: 'Midjourney / Gemini', icon: 'ShoppingBag', visible: true },
      { id: 'pcat-5', name: 'Writing & ChatGPT Marketing', platform: 'ChatGPT / Gemini', icon: 'FileText', visible: true },
    ],
  },
  'about-us': {
    hero: {
      heading: 'About Annu Dhaneja & GurucraftPro Studio',
      description: 'Empowering brands, authors, online sellers, and individuals through creative graphic design and fashion styling in Rohini, Delhi.',
      image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=1200&q=80',
      ctaText: 'Explore Our Services',
      ctaLink: 'services',
      visible: true,
    },
    companyStory: {
      title: 'Our Story & Creative Mission',
      description: 'Founded by Annu Dhaneja in Rohini, Delhi, GurucraftPro began with a passionate commitment to high-impact vector graphics, bespoke brand identities, and personal fashion styling. Over the years, we have grown into a multi-disciplinary creative studio serving thousands of clients worldwide.',
      image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80',
    },
    mission: {
      heading: 'Our Studio Mission',
      content: 'To deliver exceptional graphic design and style consultations that elevate brands, empower e-commerce merchants, and inspire confidence in every client.',
      image: '',
    },
    vision: {
      heading: 'Our Vision',
      content: 'To be India\'s premier creative studio bridging traditional Indian craftsmanship, modern e-commerce visual standards, and cutting-edge digital innovations.',
      image: '',
    },
    whyUsCards: [
      { id: 'w1', title: '8+ Years Creative Mastery', description: 'Deep expertise across brand design, publishing, and personal styling.', icon: 'Award', visible: true, order: 1 },
      { id: 'w2', title: '100% Tailored Work', description: 'Zero boilerplate templates. Every logo, cover, and wardrobe plan is bespoke.', icon: 'CheckCircle2', visible: true, order: 2 },
      { id: 'w3', title: 'Direct Founder Access', description: 'Work directly with Annu Dhaneja for clear communication and prompt delivery.', icon: 'UserCheck', visible: true, order: 3 },
    ],
    team: [
      {
        id: 'team-1',
        name: 'Annu Dhaneja',
        role: 'Creative Director & Founder',
        photo: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=80',
        description: 'Lead designer, fashion consultant & founder of GurucraftPro in Rohini, Delhi.',
        socialLinks: { instagram: 'https://instagram.com/gurucraftpro', whatsapp: 'https://wa.me/918527837527' },
      },
    ],
    timeline: [
      { id: 'tl-1', year: '2020', title: 'GurucraftPro Studio Inception', description: 'Annu Dhaneja launched GurucraftPro in Rohini, Delhi.', order: 1 },
      { id: 'tl-2', year: '2022', title: 'Expanded to Amazon Ecom & Book Covers', description: 'Crossed 500+ successful e-commerce photo editing and book cover projects.', order: 2 },
      { id: 'tl-3', year: '2024', title: 'Launched 7-Day Capsule Wardrobe Consultation', description: 'Introduced personal fashion style consultations and divine Guruji collection.', order: 3 },
      { id: 'tl-4', year: '2026', title: 'AI Prompt & Digital Product Suite', description: 'Integrated masterclass AI prompts and real-time CMS control center.', order: 4 },
    ],
  },
  'contact-us': {
    contactInfo: {
      businessName: 'GurucraftPro Studio',
      contactPerson: 'Annu Dhaneja',
      phone: '8527837527',
      email: 'annudhaneja@gmail.com',
      address: 'Rohini, Delhi, India',
      businessHours: 'Monday - Saturday: 10:00 AM - 7:00 PM IST',
    },
    contactFormFields: [
      { id: 'cf-1', fieldKey: 'name', label: 'Full Name', placeholder: 'e.g. Priyanshu Mehta', required: true, visible: true, order: 1 },
      { id: 'cf-2', fieldKey: 'email', label: 'Email Address', placeholder: 'you@example.com', required: true, visible: true, order: 2 },
      { id: 'cf-3', fieldKey: 'phone', label: 'Phone / WhatsApp', placeholder: '+91 98765 43210', required: true, visible: true, order: 3 },
      { id: 'cf-4', fieldKey: 'service', label: 'Service Interested In', placeholder: 'Select a Service', required: true, visible: true, order: 4 },
      { id: 'cf-5', fieldKey: 'message', label: 'Project Message / Details', placeholder: 'Describe your project requirements...', required: true, visible: true, order: 5 },
      { id: 'cf-6', fieldKey: 'attachment', label: 'Reference Attachment / File URL', placeholder: 'https://drive.google.com/...', required: false, visible: true, order: 6 },
    ],
    whatsAppConfig: {
      number: '918527837527',
      defaultMessage: 'Hello Annu Dhaneja! I would like to inquire about GurucraftPro creative services.',
      buttonText: 'Chat on WhatsApp',
      position: 'bottom-right',
      enabled: true,
    },
    googleMapsConfig: {
      locationName: 'Rohini, Delhi',
      address: 'Rohini, New Delhi, Delhi 110085',
      embedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d13994.498188185933!2d77.1085295!3d28.7180125!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390d013824479f61%3A0xe54d3e421a11db9f!2sRohini%2C%20New%20Delhi%2C%20Delhi!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin',
      zoom: 14,
      visible: true,
    },
  },
};

// ==================== PHOTOSHOP WORKFLOW STUDIO DATABASE ====================

export const photoshopTemplatesData: PhotoshopTemplate[] = [
  {
    id: 'tpl-1',
    title: 'E-Commerce Pure White Background Isolation',
    category: 'E-commerce',
    prompt: 'Create a Photoshop action that automatically removes the background, improves product brightness, adds contrast, sharpens the product, creates an RGB 255 pure white background and exports a 2000x2000 JPG.',
    description: 'Amazon & Flipkart compliant pure white background extraction with gentle contact shadow and zoom sharpening.',
    tag: 'Popular',
    difficulty: 'Beginner',
    photoshopVersion: 'Photoshop 2024+',
    iconName: 'Sparkles',
  },
  {
    id: 'tpl-2',
    title: 'Jewelry & Metallic Specular Refinement',
    category: 'Product Photography',
    prompt: 'Create a workflow to enhance gemstone sparkle, remove micro dust scratches, increase gold/silver specular shine, and export high resolution PNG with transparent background.',
    description: 'Brings out rich metallic luster and diamond brilliance for luxury watch and jewelry listings.',
    tag: 'Advanced',
    difficulty: 'Intermediate',
    photoshopVersion: 'Photoshop 2023+',
    iconName: 'Layers',
  },
  {
    id: 'tpl-3',
    title: 'Portrait High-End Frequency Separation Retouch',
    category: 'Portrait',
    prompt: 'Generate an action guide for frequency separation skin retouching preserving natural pores, gentle eye brightening, subtle dodge and burn, and soft color grading.',
    description: 'Studio beauty and fashion editorial skin texture retouching workflow without artificial blur.',
    tag: 'Editorial',
    difficulty: 'Advanced',
    photoshopVersion: 'Photoshop 2022+',
    iconName: 'User',
  },
  {
    id: 'tpl-4',
    title: 'Batch Image Resizer & Watermarking',
    category: 'Batch Processing',
    prompt: 'Create a batch Photoshop action that resizes all open images to 1920px width, sharpens edges, embeds a centered subtle watermark logo, and exports compressed WebP files.',
    description: 'Speeds up bulk catalog processing for 100+ product photos in seconds.',
    tag: 'Automation',
    difficulty: 'Beginner',
    photoshopVersion: 'Photoshop 2021+',
    iconName: 'Zap',
  },
  {
    id: 'tpl-5',
    title: 'Apparel Ghost Mannequin 3D Neck Joint',
    category: 'E-commerce',
    prompt: 'Create an automated guide to combine front garment photo with inner neck collar tag shot to build a hollow 3D ghost mannequin effect on pure white background.',
    description: 'Seamless invisible hollow mannequin apparel alignment for shirts, kurtas, and jackets.',
    tag: 'Apparel',
    difficulty: 'Intermediate',
    photoshopVersion: 'Photoshop 2024+',
    iconName: 'Layers',
  },
  {
    id: 'tpl-6',
    title: 'YouTube Thumbnail High-Contrast Pop & Glow',
    category: 'YouTube Thumbnail',
    prompt: 'Create an action that applies high-impact clarity, HDR toning, neon rim lighting glow effect around subject, and 1280x720 300DPI thumbnail export.',
    description: 'Increases click-through rates with bold color contrast and luminous subject outlines.',
    tag: 'Creator',
    difficulty: 'Beginner',
    photoshopVersion: 'Photoshop 2023+',
    iconName: 'Zap',
  },
];

export const photoshopWorkflowsData: PhotoshopWorkflow[] = [
  {
    id: 'wf-101',
    userId: 'user-default',
    userEmail: 'annudhaneja@gmail.com',
    title: 'E-Commerce Pure White Background & Product Pop',
    originalPrompt: 'Create a Photoshop action that automatically removes the background, improves product brightness, adds contrast, sharpens the product, creates a white background and exports a 2000x2000 JPG.',
    category: 'E-commerce',
    objective: 'Transform raw camera product photos into Amazon/Flipkart compliant 2000x2000px pure white RGB (255,255,255) images with calibrated curves, contrast, and unsharp masking.',
    description: 'Fully automated e-commerce product enhancement action pipeline featuring AI subject selection, white canvas backing, tonal curves, and high-clarity output.',
    compatibilityStatus: 'action-ready',
    workflowType: 'Action File',
    photoshopVersion: 'Photoshop 2024+',
    stepCount: 8,
    difficulty: 'Beginner',
    estimatedTime: '4 - 7 seconds per image',
    automationConfidence: 94,
    confidenceReason: 'Standard Photoshop selection, adjustment layers, unsharp mask, and export dimensions are 100% action-recordable.',
    actionPossible: true,
    actionSetName: 'GurucraftPro Ecom Suite',
    actionName: 'Amazon Pure White 2000x2000',
    actionFileName: 'Amazon_Pure_White_2000x2000.atn',
    actionFileSize: '14.8 KB',
    actionLimitations: [
      'Subject selection works best with high-contrast edges against studio backdrops.',
      'Semi-transparent objects (glass/perfume) may benefit from manual mask touch-ups.',
    ],
    steps: [
      {
        id: 'st-1',
        stepNumber: 1,
        title: 'Open Document & Duplicate Base Layer',
        action: 'Layer Duplication',
        menuPath: 'Layer > Duplicate Layer...',
        settings: 'Name: "Product Layer", Mode: Normal, Opacity: 100%',
        recommendedValue: 'Duplicate Layer with Ctrl+J / Cmd+J',
        explanation: 'Preserves the non-destructive original base photograph before applying extractions.',
        expectedResult: 'Unlocked working layer named "Product Layer" above Background.',
        compatibility: 'ACTION SAFE',
        completed: true,
      },
      {
        id: 'st-2',
        stepNumber: 2,
        title: 'Execute AI Select Subject',
        action: 'Select Subject',
        menuPath: 'Select > Subject',
        settings: 'Device (Cloud / Fast Device AI selection)',
        recommendedValue: 'Select > Subject (Device: Cloud for crispest edge detection)',
        explanation: 'Uses Adobe Sensei AI to automatically compute precise bounding selection around the main product.',
        expectedResult: 'Active marching ants selection wrapping the product contours.',
        compatibility: 'ACTION SAFE',
        completed: true,
      },
      {
        id: 'st-3',
        stepNumber: 3,
        title: 'Apply Layer Mask from Selection',
        action: 'Add Layer Mask',
        menuPath: 'Layer > Layer Mask > Reveal Selection',
        settings: 'Density: 100%, Feather: 0.3 px',
        recommendedValue: 'Feather 0.3px to eliminate harsh pixelated cutouts',
        explanation: 'Isolates the product subject from the raw background with soft sub-pixel antialiasing.',
        expectedResult: 'Product isolated on transparent canvas.',
        compatibility: 'ACTION SAFE',
        completed: false,
      },
      {
        id: 'st-4',
        stepNumber: 4,
        title: 'Insert Pure White RGB 255 Solid Fill Background',
        action: 'Solid Color Fill Layer',
        menuPath: 'Layer > New Fill Layer > Solid Color...',
        settings: 'Color: #FFFFFF (R: 255, G: 255, B: 255)',
        recommendedValue: '#FFFFFF (Pure White)',
        explanation: 'Ensures strict compliance with Amazon & Flipkart 100% pure white main listing image regulations.',
        expectedResult: 'A solid clean white layer placed directly beneath the isolated product layer.',
        compatibility: 'ACTION SAFE',
        completed: false,
      },
      {
        id: 'st-5',
        stepNumber: 5,
        title: 'Apply Tonal Brightness & Contrast Adjustment',
        action: 'Brightness/Contrast Adjustment Layer',
        menuPath: 'Layer > New Adjustment Layer > Brightness/Contrast...',
        settings: 'Brightness: +12, Contrast: +8, Use Legacy: False',
        recommendedValue: 'Brightness +12, Contrast +8',
        explanation: 'Eliminates camera sensor underexposure and pops product highlights.',
        expectedResult: 'Vibrant, clear product visibility across all monitors.',
        compatibility: 'ACTION SAFE',
        completed: false,
      },
      {
        id: 'st-6',
        stepNumber: 6,
        title: 'Apply Unsharp Mask Sharpening Filter',
        action: 'Unsharp Mask',
        menuPath: 'Filter > Sharpen > Unsharp Mask...',
        settings: 'Amount: 85%, Radius: 1.2 px, Threshold: 2 levels',
        recommendedValue: 'Amount: 85%, Radius: 1.2px',
        explanation: 'Brings out crisp micro-textures, stitching, and product branding details for marketplace zoom preview.',
        expectedResult: 'Razor-sharp product edges without halo noise.',
        compatibility: 'ACTION SAFE',
        completed: false,
      },
      {
        id: 'st-7',
        stepNumber: 7,
        title: 'Fit Image to 2000x2000 Square Canvas',
        action: 'Square Canvas Resizing',
        menuPath: 'Image > Canvas Size...',
        settings: 'Width: 2000 px, Height: 2000 px, Anchor: Center, Canvas extension color: White',
        recommendedValue: '2000 x 2000 px square, Center Anchor',
        explanation: 'Centers product and scales canvas to ideal high-resolution Amazon zoom-ready proportions.',
        expectedResult: 'Perfect 1:1 aspect ratio square document.',
        compatibility: 'ACTION SAFE',
        completed: false,
      },
      {
        id: 'st-8',
        stepNumber: 8,
        title: 'Export Optimized E-Commerce JPG',
        action: 'Quick Export as JPG',
        menuPath: 'File > Export > Export As... (or Save for Web Legacy)',
        settings: 'Format: JPEG, Quality: 90% (High), Color Space: Convert to sRGB, Embed Color Profile: True',
        recommendedValue: 'Quality 90%, sRGB Color Profile',
        explanation: 'Produces web-compressed JPEG file ready for instant seller portal upload.',
        expectedResult: 'Saved 2000x2000px JPG file under 1.5MB.',
        compatibility: 'ACTION SAFE',
        completed: false,
      },
    ],
    manualSteps: [],
    exportSettings: {
      format: 'JPEG',
      dimensions: '2000 x 2000 px',
      colorProfile: 'sRGB IEC61966-2.1',
      quality: '90% High',
      dpi: 300,
    },
    qualityChecks: [
      'Verify background is true RGB (255, 255, 255) using Info panel Eyedropper.',
      'Check edges for fuzzy fringe or background bleed.',
      'Confirm image dimensions are exactly 2000 x 2000 px at 300 DPI.',
      'Ensure file size is within marketplace upload limits (typically < 10MB).',
    ],
    customOrderRecommended: false,
    version: 1,
    isFavorite: true,
    isSaved: true,
    createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'wf-102',
    userId: 'user-default',
    userEmail: 'annudhaneja@gmail.com',
    title: 'High-End Portrait Skin Retouching & Frequency Separation',
    originalPrompt: 'Create a portrait skin-retouching workflow with frequency separation, natural texture preservation, and gentle eye pop.',
    category: 'Portrait',
    objective: 'Professional portrait beauty retouching that divides image into High Frequency (Texture/Pores) and Low Frequency (Color/Tone) layers for pristine studio finish.',
    description: 'Hybrid studio action and manual guide for magazine-grade skin smoothing without artificial plastic look.',
    compatibilityStatus: 'hybrid',
    workflowType: 'Hybrid Workflow',
    photoshopVersion: 'Photoshop 2023+',
    stepCount: 10,
    difficulty: 'Advanced',
    estimatedTime: '2 - 4 minutes per portrait',
    automationConfidence: 78,
    confidenceReason: 'Layer creation, Gaussian blur, Apply Image calculations are automated; delicate spot healing requires manual brush strokes on High Frequency layer.',
    actionPossible: true,
    actionSetName: 'GurucraftPro Beauty Studio',
    actionName: '16-Bit Frequency Separation 8-Bit',
    actionFileName: 'Frequency_Separation_Beauty.atn',
    actionFileSize: '16.2 KB',
    actionLimitations: [
      'Healing brush and clone stamp operations require manual artist discretion based on model facial geometry.',
      'Dodge and burn intensity should be adapted according to studio key lighting.',
    ],
    steps: [
      {
        id: 'st-p1',
        stepNumber: 1,
        title: 'Create Low Frequency (Color) Layer',
        action: 'Layer Duplicate & Rename',
        menuPath: 'Layer > Duplicate Layer...',
        settings: 'Name: "Low Frequency - Color"',
        recommendedValue: 'Name: Low Frequency - Color',
        explanation: 'Isolates the smooth skin color tones and transition gradients.',
        expectedResult: 'Low Frequency layer created.',
        compatibility: 'ACTION SAFE',
        completed: true,
      },
      {
        id: 'st-p2',
        stepNumber: 2,
        title: 'Apply Gaussian Blur to Color Layer',
        action: 'Gaussian Blur Filter',
        menuPath: 'Filter > Blur > Gaussian Blur...',
        settings: 'Radius: 6.0 px (Adjust until skin texture just disappears)',
        recommendedValue: 'Radius 5.0 - 8.0 px',
        explanation: 'Blurs skin texture while leaving broad tone and shadow gradients intact.',
        expectedResult: 'Softened color-only layer.',
        compatibility: 'ACTION SAFE',
        completed: true,
      },
      {
        id: 'st-p3',
        stepNumber: 3,
        title: 'Create High Frequency (Texture) Layer',
        action: 'Layer Duplicate & Rename',
        menuPath: 'Layer > Duplicate Layer...',
        settings: 'Name: "High Frequency - Texture"',
        recommendedValue: 'Name: High Frequency - Texture',
        explanation: 'Extracts only micro-details such as skin pores, eyelashes, and fine hairs.',
        expectedResult: 'Texture layer created on top.',
        compatibility: 'ACTION SAFE',
        completed: false,
      },
      {
        id: 'st-p4',
        stepNumber: 4,
        title: 'Execute Apply Image Formula (8-Bit Mode)',
        action: 'Apply Image Calculation',
        menuPath: 'Image > Apply Image...',
        settings: 'Layer: "Low Frequency - Color", Blending: Subtract, Scale: 2, Offset: 128',
        recommendedValue: 'Blending: Subtract, Scale: 2, Offset: 128',
        explanation: 'Mathematically subtracts blurred color layer from sharp image, isolating pure 50% gray high-frequency relief.',
        expectedResult: 'Gray texture relief layer.',
        compatibility: 'ACTION SAFE',
        completed: false,
      },
      {
        id: 'st-p5',
        stepNumber: 5,
        title: 'Set High Frequency Layer Blending Mode to Linear Light',
        action: 'Layer Blend Mode',
        menuPath: 'Layers Panel > Blending Mode dropdown',
        settings: 'Blend Mode: Linear Light',
        recommendedValue: 'Linear Light',
        explanation: 'Fuses high and low frequencies back together with 100% mathematical fidelity to original portrait.',
        expectedResult: 'Image appears completely normal and unchanged.',
        compatibility: 'ACTION SAFE',
        completed: false,
      },
      {
        id: 'st-p6',
        stepNumber: 6,
        title: 'Clean Blemishes on High Frequency Texture Layer',
        action: 'Manual Clone Stamp / Spot Healing Brush',
        menuPath: 'Tools > Clone Stamp Tool (S) or Spot Healing Brush (J)',
        settings: 'Sample: Current Layer only, Hardness: 0%, Size: Match blemish',
        recommendedValue: 'Sample: "Current Layer" strictly',
        explanation: 'Allows erasing pimples and blemishes without altering underlying skin tones or creating muddy patches.',
        expectedResult: 'Smooth flawless skin texture with natural pores.',
        compatibility: 'MANUAL',
        completed: false,
      },
      {
        id: 'st-p7',
        stepNumber: 7,
        title: 'Smooth Tone Transitions on Low Frequency Layer',
        action: 'Lasso Selection + Gaussian Blur',
        menuPath: 'Tools > Lasso Tool (Feather: 25px) -> Filter > Gaussian Blur',
        settings: 'Lasso Feather: 20-30 px, Blur Radius: 15-25 px',
        recommendedValue: 'Feather 25px, Blur 20px',
        explanation: 'Evens out blotchy makeup or redness without destroying surface texture.',
        expectedResult: 'Uniform, radiant skin tone.',
        compatibility: 'MANUAL',
        completed: false,
      },
      {
        id: 'st-p8',
        stepNumber: 8,
        title: 'Subtle Eye & Catchlight Dodge',
        action: 'Curves Dodge Layer Mask',
        menuPath: 'Layer > New Adjustment Layer > Curves...',
        settings: 'Lift midtones curve slightly, invert mask (Ctrl+I), paint over irises with soft white brush (Opacity: 25%)',
        recommendedValue: 'Brush Opacity 20-30%',
        explanation: 'Adds sparkle and depth to eyes without looking synthetic.',
        expectedResult: 'Bright, captivating eyes.',
        compatibility: 'MANUAL',
        completed: false,
      },
      {
        id: 'st-p9',
        stepNumber: 9,
        title: 'Global Color Grading Tone Curve',
        action: 'Color Balance & Tonal LUT',
        menuPath: 'Layer > New Adjustment Layer > Color Balance...',
        settings: 'Highlights: +3 Yellow, Midtones: +2 Magenta, Shadows: +2 Cyan/Blue',
        recommendedValue: 'Subtle warm fashion grading',
        explanation: 'Gives the portrait a warm, flattering magazine editorial tone.',
        expectedResult: 'Cinematic color depth.',
        compatibility: 'ACTION SAFE',
        completed: false,
      },
      {
        id: 'st-p10',
        stepNumber: 10,
        title: 'Export High-Resolution Master Portrait',
        action: 'Export As JPEG/TIFF',
        menuPath: 'File > Export > Export As...',
        settings: 'Quality: 100%, sRGB, Bicubic Sharper',
        recommendedValue: 'Quality 100%',
        explanation: 'Outputs pristine portrait ready for print or portfolio display.',
        expectedResult: 'Clean, professional beauty master image.',
        compatibility: 'ACTION SAFE',
        completed: false,
      },
    ],
    manualSteps: [
      'Sample skin texture on High Frequency layer using Clone Stamp (Current Layer).',
      'Smooth tone blotches on Low Frequency layer with feathered Lasso + Gaussian blur.',
      'Paint eye catchlights with soft low-opacity brush on Dodge Curves mask.',
    ],
    exportSettings: {
      format: 'JPEG / TIFF',
      colorProfile: 'Adobe RGB (1998) or sRGB',
      quality: '100% Maximum',
      dpi: 300,
    },
    qualityChecks: [
      'Zoom to 100% and ensure pores are preserved rather than blurred into plastic.',
      'Check eye white tones are realistic and not over-bleached.',
      'Confirm no color banding or halo rings around high-contrast facial edges.',
    ],
    customOrderRecommended: false,
    version: 1,
    isFavorite: false,
    isSaved: true,
    createdAt: new Date(Date.now() - 3600000 * 48).toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export const photoshopCustomOrdersData: PhotoshopCustomOrder[] = [
  {
    id: 'ORD-PS-901',
    userId: 'user-default',
    customerName: 'Rohit Kulkarni',
    customerEmail: 'rohit.k@example.com',
    customerPhone: '+91 98230 45678',
    workflowId: 'wf-101',
    title: 'Automated 500-SKU Jewelry Drop Shadow & Metadata Action Script',
    description: 'We need an enterprise-grade Photoshop Action + ExtendScript JSX batch automation tool that processes 500+ diamond ring photos: transparent extraction, soft directional contact reflection, automated SKU watermark, and multi-resolution web export.',
    category: 'Product Photography',
    photoshopVersion: 'Photoshop CC 2024 / 2025',
    orderType: 'Batch Automation',
    priority: 'Urgent',
    deadline: '2026-08-25',
    quotedPrice: 3499,
    paymentStatus: 'paid',
    orderStatus: 'IN PROGRESS',
    assignedAdmin: 'Annu Dhaneja',
    adminNotes: 'Client uploaded sample PSD. Script requires custom JSX layer positioning for dynamic SKU code overlays.',
    deliveryNotes: 'Ready for initial test batch on 5 jewelry sample files.',
    revisionCount: 0,
    referenceFiles: [
      {
        id: 'rf-1',
        name: 'Diamond_Ring_Sample_Raw.jpg',
        url: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=800&q=80',
        type: 'image/jpeg',
        size: 1420000,
        createdAt: new Date().toISOString(),
      },
    ],
    deliverableFiles: [],
    messages: [
      {
        id: 'm-1',
        sender: 'customer',
        senderName: 'Rohit Kulkarni',
        message: 'Hi Annu! We need this automation to run seamlessly across our team of 4 catalog operators without manual Photoshop intervention.',
        timestamp: new Date(Date.now() - 3600000 * 12).toISOString(),
      },
      {
        id: 'm-2',
        sender: 'admin',
        senderName: 'Annu Dhaneja',
        message: 'Hello Rohit! We have reviewed your jewelry sample photos. We are writing a custom JSX script along with the .ATN file to auto-detect ring metal tones and embed the SKU tags cleanly.',
        timestamp: new Date(Date.now() - 3600000 * 6).toISOString(),
      },
    ],
    createdAt: new Date(Date.now() - 3600000 * 20).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'ORD-PS-902',
    userId: 'user-default',
    customerName: 'Meera Deshmukh',
    customerEmail: 'meera.d@example.com',
    customerPhone: '+91 97654 32109',
    title: 'Fashion Ghost Mannequin 3D Alignment Action Set',
    description: 'Action set to automate neck joint merging for traditional saree and lehenga catalog photos with consistent lighting match.',
    category: 'E-commerce',
    photoshopVersion: 'Photoshop 2024+',
    orderType: 'Advanced Action',
    priority: 'Normal',
    deadline: '2026-08-28',
    quotedPrice: 1999,
    paymentStatus: 'pending',
    orderStatus: 'QUOTATION SENT',
    assignedAdmin: 'Annu Dhaneja',
    adminNotes: 'Sent quotation of ₹1,999 for 3-action workflow set.',
    deliveryNotes: '',
    revisionCount: 0,
    referenceFiles: [],
    deliverableFiles: [],
    messages: [],
    createdAt: new Date(Date.now() - 3600000 * 8).toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export const photoshopSavedPromptsData: PhotoshopSavedPrompt[] = [
  {
    id: 'sp-1',
    userId: 'user-default',
    title: 'Pure White Background Removal',
    prompt: 'Create a Photoshop action that automatically removes the background, improves product brightness, adds contrast, sharpens the product, creates a white background and exports a 2000x2000 JPG.',
    category: 'E-commerce',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'sp-2',
    userId: 'user-default',
    title: 'Portrait Frequency Separation',
    prompt: 'Create a portrait skin-retouching workflow with frequency separation, natural texture preservation, and gentle eye pop.',
    category: 'Portrait',
    createdAt: new Date().toISOString(),
  },
];

export const photoshopDownloadsData: { id: string; userId?: string; workflowId: string; fileType: string; downloadedAt: string }[] = [
  { id: 'dl-1', userId: 'user-default', workflowId: 'wf-101', fileType: 'ATN', downloadedAt: new Date(Date.now() - 3600000 * 2).toISOString() },
  { id: 'dl-2', userId: 'user-default', workflowId: 'wf-102', fileType: 'PDF_GUIDE', downloadedAt: new Date(Date.now() - 3600000 * 5).toISOString() },
];

export const photoshopFavoritesData: { id: string; userId?: string; workflowId: string; createdAt: string }[] = [
  { id: 'fav-1', userId: 'user-default', workflowId: 'wf-101', createdAt: new Date().toISOString() },
];

import { quickServicesInitialData, quickFixOrdersInitialData } from './quickServicesData';
import { QuickDigitalService, QuickFixOrder } from '../src/types';

export const quickServicesData: QuickDigitalService[] = [...quickServicesInitialData];
export const quickFixOrdersData: QuickFixOrder[] = [...quickFixOrdersInitialData];

import { SalesLead, SalesAnalyticsStats } from '../src/types';

export const salesLeadsData: SalesLead[] = [
  {
    id: 'lead-101',
    customerName: 'Aarav Singhania',
    customerPhone: '+91 98112 34567',
    customerEmail: 'aarav@singhaniaexports.com',
    serviceInterested: 'Brand Identity & Vector Logo Package + Luxury Visiting Cards',
    requirementDetails: 'Luxury export brand logo with royal serif typography and gold foil business card mockups.',
    budgetEstimate: '₹2,500 - ₹3,500',
    deadline: 'Within 3 days',
    status: 'New',
    source: 'AI Sales Assistant',
    createdAt: new Date(Date.now() - 3600000 * 4).toISOString(),
    chatTranscript: [
      { sender: 'user', text: 'Mujhe apne naye export business ke liye logo aur visiting card design karwana hai.' },
      { sender: 'agent', text: 'Namaste Aarav ji! GurucraftPro mein aapka swagat hai. Hamare paas Brand Identity & Vector Logo Package (₹1,999) aur Luxury Visiting Cards & Stationery (₹999) ka perfect combination available hai.' },
      { sender: 'user', text: 'Great, kya mujhe source files aur 3D mockup milega?' },
      { sender: 'agent', text: 'Haan bilkul, 3 logo concepts, vector AI/SVG/PNG source files aur realistic 3D mockups sabhi included hain.' },
    ],
  },
  {
    id: 'lead-102',
    customerName: 'Pooja Verma',
    customerPhone: '+91 98711 22334',
    customerEmail: 'pooja.verma@gmail.com',
    serviceInterested: 'Amazon & Flipkart Pure White BG Removal (Batch of 50)',
    requirementDetails: 'White background cutout and drop shadow for handicraft apparel catalog for Amazon launch.',
    budgetEstimate: '₹1,500',
    deadline: 'Tomorrow evening',
    status: 'Contacted',
    source: 'AI Sales Assistant',
    createdAt: new Date(Date.now() - 3600000 * 18).toISOString(),
  },
];

export const salesAnalyticsData: SalesAnalyticsStats = {
  aiOpenedCount: 42,
  voiceSessionsCount: 18,
  conversationsCount: 36,
  recommendationsGiven: 54,
  leadsCaptured: 12,
  checkoutStarts: 8,
  completedOrders: 5,
  topRequestedServices: [
    { serviceName: 'Brand Identity & Logo Design', count: 16 },
    { serviceName: '7-Day Capsule Wardrobe Consultation', count: 11 },
    { serviceName: 'Amazon / Flipkart White BG & E-com', count: 9 },
    { serviceName: 'Kindle & Paperback Book Cover Design', count: 8 },
    { serviceName: 'AI Photoshop Workflow Generator', count: 6 },
    { serviceName: 'Quick 30-Min Image Vector Fix', count: 4 },
  ],
};

// Graphic Design Marketplace Initial Data Stores
export const graphicDesignCategoriesData: GraphicDesignCategory[] = JSON.parse(JSON.stringify(GRAPHIC_DESIGN_MAIN_CATEGORIES));
export const graphicDesignServicesData: GraphicDesignService[] = JSON.parse(JSON.stringify(GRAPHIC_DESIGN_SERVICES));

export const graphicDesignSettingsData: GraphicDesignSettings = {
  heroBadge: 'Affordable Design. Fast Delivery. Professional Quality.',
  heroTitle: 'Professional Designs at Affordable Prices',
  heroSub: 'Get high-quality graphic designs delivered in minutes, hours or same day. Vector logos, viral reels, Instagram carousels, marketing flyers, and e-commerce listings.',
  whatsappNumber: '918527837527',
  marqueeItems: [
    { text: 'INSTAGRAM CAROUSEL & POST DESIGNS', icon: 'Sparkles', highlight: true },
    { text: '10-MIN ULTRA FAST DESIGN DELIVERY', icon: 'Zap', highlight: true },
    { text: 'STARTING AT JUST ₹149', icon: 'BadgePercent', highlight: false },
    { text: 'VIRAL REELS & SHORT VIDEO EDITING', icon: 'Film', highlight: true },
    { text: 'VECTOR LOGOS & CORPORATE BRANDING', icon: 'ShieldCheck', highlight: false },
    { text: 'PRINT-READY HOARDINGS & STANDEES', icon: 'Flame', highlight: false },
    { text: 'AMAZON & FLIPKART A+ E-COM INFOGRAPHICS', icon: 'ShoppingBag', highlight: false },
    { text: 'HIGH-CTR YOUTUBE THUMBNAILS (4K)', icon: 'Play', highlight: true },
    { text: '100% MONEY BACK SATISFACTION GUARANTEE', icon: 'Award', highlight: false },
  ],
  deliveryTiers: JSON.parse(JSON.stringify(DELIVERY_SPEED_TIERS)),
};

export const graphicDesignInquiriesData: GraphicDesignInquiry[] = [
  {
    id: 'INQ-GD-98124',
    serviceId: 'gd-sm-1',
    serviceTitle: 'Instagram Post Design (Single Graphic)',
    customerName: 'Rahul Mehra',
    customerEmail: 'rahul.mehra@fitgear.in',
    customerPhone: '+91 98112 34567',
    whatsapp: '+91 98112 34567',
    quantity: 3,
    deliverySpeed: '30mins',
    budget: '₹450 - ₹1,000',
    description: 'Need 3 promotional Instagram posts for our upcoming Weekend Flash Sale on Gym Supplements. High energy visual with neon yellow and black contrast.',
    brandDetails: 'Brand Name: FitGear Nutrition. Font: Bebas Neue / Montserrat.',
    driveLink: 'https://drive.google.com/drive/folders/sample-fitgear',
    status: 'IN_REVIEW',
    adminNotes: 'Assigned to Senior Designer. Drafts ready for client approval.',
    quotedPrice: 650,
    assignedDesigner: 'Annu Dhaneja',
    createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 2).toISOString(),
  },
  {
    id: 'INQ-GD-98125',
    serviceId: 'gd-br-1',
    serviceTitle: 'Minimalist Vector Logo & Brand Identity Kit',
    customerName: 'Pooja Agarwal',
    customerEmail: 'pooja@zenithstudios.co',
    customerPhone: '+91 99887 66554',
    whatsapp: '+91 99887 66554',
    quantity: 1,
    deliverySpeed: 'sameday',
    budget: '₹1,500 - ₹3,000',
    description: 'Launching a modern architectural design studio called Zenith. Need clean geometric logo monogram, business card, and letterhead.',
    brandDetails: 'Colors: Emerald Green, Warm Champagne, and Matte Black.',
    driveLink: '',
    status: 'QUOTED',
    adminNotes: 'Sent quote of ₹1,999 on WhatsApp. Waiting for advance confirmation.',
    quotedPrice: 1999,
    assignedDesigner: 'Annu Dhaneja',
    createdAt: new Date(Date.now() - 3600000 * 26).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 12).toISOString(),
  },
];

import { MARKETPLACE_CATEGORIES, MARKETPLACE_BUNDLES, INITIAL_CUSTOM_DESIGN_REQUESTS } from '../src/data/marketplaceData';
import { MarketplaceBundle, CustomDesignRequest } from '../src/types';

// Guruji Artwork & Blessings Stores
export const gurujiCategoriesData: GurujiCategoryItem[] = [...MARKETPLACE_CATEGORIES];
export const gurujiArtworksData: GurujiArtwork[] = [...INITIAL_GURUJI_ARTWORKS];
export const gurujiBundlesData: MarketplaceBundle[] = [...MARKETPLACE_BUNDLES];
export const gurujiCustomRequestsData: CustomDesignRequest[] = [...INITIAL_CUSTOM_DESIGN_REQUESTS];
export const gurujiBlessingsData: GurujiDailyBlessing[] = [...INITIAL_GURUJI_BLESSINGS];
export const gurujiExpertsData: GurujiExpert[] = [...INITIAL_GURUJI_EXPERTS];
export const gurujiPredictionRequestsData: GurujiPredictionRequest[] = [];
export const gurujiPredictionResultsData: GurujiPredictionResult[] = [];
export const gurujiWallSubmissionsData: GurujiBlessingWallSubmission[] = [...INITIAL_GURUJI_WALL_SUBMISSIONS];
export const gurujiInquiriesData: GurujiInquiry[] = [...INITIAL_GURUJI_INQUIRIES];
export const gurujiPersonalizedCardsData: GurujiPersonalizedCardOrder[] = [];
export const gurujiFavoritesData: { [userIdOrIp: string]: string[] } = {};

import fs from 'fs';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'gurucraft_database.json');

export interface DatabaseState {
  version: string;
  lastUpdated: string;
  services: typeof servicesData;
  products: typeof productsData;
  prompts: typeof promptsData;
  wardrobeSubmissions: typeof wardrobeSubmissions;
  orders: typeof ordersData;
  siteSettings: typeof siteSettings;
  logs: typeof logsData;
  bookCoverPackages: typeof bookCoverPackages;
  bookCoverProjects: typeof bookCoverProjects;
  bookCoverQuestions: typeof bookCoverQuestions;
  pages: typeof pagesData;
  categories: typeof categoriesData;
  menus: typeof menusData;
  socialLinks: typeof socialLinksData;
  defaultLinks: typeof defaultLinksData;
  seo: typeof seoData;
  redirects: typeof redirectsData;
  theme: typeof themeSettings;
  header: typeof headerSettings;
  footer: typeof footerSettings;
  paymentSettings: typeof paymentSettingsData;
  mediaItems: typeof mediaItemsData;
  contentVersions: typeof contentVersionsData;
  adminUsers: typeof adminUsersData;
  auditLogs: typeof auditLogsData;
  pageContents: typeof pageContentsData;
  contactMessages: typeof contactMessagesData;
  vantageServices: typeof vantageServicesData;
  vantageBeforeAfter: typeof vantageBeforeAfterData;
  vantageInquiries: typeof vantageInquiriesData;
  photoshopWorkflows: typeof photoshopWorkflowsData;
  photoshopCustomOrders: typeof photoshopCustomOrdersData;
  photoshopTemplates: typeof photoshopTemplatesData;
  photoshopSavedPrompts: typeof photoshopSavedPromptsData;
  photoshopDownloads: typeof photoshopDownloadsData;
  photoshopFavorites: typeof photoshopFavoritesData;
  quickServices: typeof quickServicesData;
  quickFixOrders: typeof quickFixOrdersData;
  salesLeads: typeof salesLeadsData;
  salesAnalytics: typeof salesAnalyticsData;
  graphicDesignCategories: typeof graphicDesignCategoriesData;
  graphicDesignServices: typeof graphicDesignServicesData;
  graphicDesignSettings: typeof graphicDesignSettingsData;
  graphicDesignInquiries: typeof graphicDesignInquiriesData;
  gurujiCategories: typeof gurujiCategoriesData;
  gurujiArtworks: typeof gurujiArtworksData;
  gurujiBundles: typeof gurujiBundlesData;
  gurujiCustomRequests: typeof gurujiCustomRequestsData;
  gurujiBlessings: typeof gurujiBlessingsData;
  gurujiExperts: typeof gurujiExpertsData;
  gurujiPredictionRequests: typeof gurujiPredictionRequestsData;
  gurujiPredictionResults: typeof gurujiPredictionResultsData;
  gurujiWallSubmissions: typeof gurujiWallSubmissionsData;
  gurujiInquiries: typeof gurujiInquiriesData;
  gurujiPersonalizedCards: typeof gurujiPersonalizedCardsData;
  gurujiFavorites: typeof gurujiFavoritesData;
  freeSampleRequests: typeof freeSampleRequestsData;
}

export function exportDatabaseState(): DatabaseState {
  return {
    version: '1.0.0',
    lastUpdated: new Date().toISOString(),
    services: servicesData,
    products: productsData,
    prompts: promptsData,
    wardrobeSubmissions,
    orders: ordersData,
    siteSettings,
    logs: logsData,
    bookCoverPackages,
    bookCoverProjects,
    bookCoverQuestions,
    pages: pagesData,
    categories: categoriesData,
    menus: menusData,
    socialLinks: socialLinksData,
    defaultLinks: defaultLinksData,
    seo: seoData,
    redirects: redirectsData,
    theme: themeSettings,
    header: headerSettings,
    footer: footerSettings,
    paymentSettings: paymentSettingsData,
    mediaItems: mediaItemsData,
    contentVersions: contentVersionsData,
    adminUsers: adminUsersData,
    auditLogs: auditLogsData,
    pageContents: pageContentsData,
    contactMessages: contactMessagesData,
    vantageServices: vantageServicesData,
    vantageBeforeAfter: vantageBeforeAfterData,
    vantageInquiries: vantageInquiriesData,
    photoshopWorkflows: photoshopWorkflowsData,
    photoshopCustomOrders: photoshopCustomOrdersData,
    photoshopTemplates: photoshopTemplatesData,
    photoshopSavedPrompts: photoshopSavedPromptsData,
    photoshopDownloads: photoshopDownloadsData,
    photoshopFavorites: photoshopFavoritesData,
    quickServices: quickServicesData,
    quickFixOrders: quickFixOrdersData,
    salesLeads: salesLeadsData,
    salesAnalytics: salesAnalyticsData,
    graphicDesignCategories: graphicDesignCategoriesData,
    graphicDesignServices: graphicDesignServicesData,
    graphicDesignSettings: graphicDesignSettingsData,
    graphicDesignInquiries: graphicDesignInquiriesData,
    gurujiCategories: gurujiCategoriesData,
    gurujiArtworks: gurujiArtworksData,
    gurujiBundles: gurujiBundlesData,
    gurujiCustomRequests: gurujiCustomRequestsData,
    gurujiBlessings: gurujiBlessingsData,
    gurujiExperts: gurujiExpertsData,
    gurujiPredictionRequests: gurujiPredictionRequestsData,
    gurujiPredictionResults: gurujiPredictionResultsData,
    gurujiWallSubmissions: gurujiWallSubmissionsData,
    gurujiInquiries: gurujiInquiriesData,
    gurujiPersonalizedCards: gurujiPersonalizedCardsData,
    gurujiFavorites: gurujiFavoritesData,
    freeSampleRequests: freeSampleRequestsData,
  };
}

export function saveDatabaseToDisk(): boolean {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    const state = exportDatabaseState();
    const tempFile = `${DB_FILE}.tmp.${Date.now()}`;
    fs.writeFileSync(tempFile, JSON.stringify(state, null, 2), 'utf-8');
    fs.renameSync(tempFile, DB_FILE);
    return true;
  } catch (err) {
    console.error('[DB] Failed to persist database to disk:', err);
    return false;
  }
}

export function loadDatabaseFromDisk(): boolean {
  try {
    if (!fs.existsSync(DB_FILE)) {
      console.log('[DB] No existing database file found at', DB_FILE, '- initializing with baseline catalog.');
      saveDatabaseToDisk();
      return true;
    }

    const raw = fs.readFileSync(DB_FILE, 'utf-8');
    const data: Partial<DatabaseState> = JSON.parse(raw);

    if (Array.isArray(data.services) && data.services.length > 0) {
      servicesData.splice(0, servicesData.length, ...data.services);
    }
    if (Array.isArray(data.products)) {
      productsData.splice(0, productsData.length, ...data.products);
    }
    if (Array.isArray(data.prompts)) {
      promptsData.splice(0, promptsData.length, ...data.prompts);
    }
    if (Array.isArray(data.wardrobeSubmissions)) {
      wardrobeSubmissions.splice(0, wardrobeSubmissions.length, ...data.wardrobeSubmissions);
    }
    if (Array.isArray(data.orders)) {
      ordersData.splice(0, ordersData.length, ...data.orders);
    }
    if (data.siteSettings) {
      Object.assign(siteSettings, data.siteSettings);
    }
    if (Array.isArray(data.logs)) {
      logsData.splice(0, logsData.length, ...data.logs);
    }
    if (Array.isArray(data.bookCoverPackages)) {
      bookCoverPackages.splice(0, bookCoverPackages.length, ...data.bookCoverPackages);
    }
    if (Array.isArray(data.bookCoverProjects)) {
      bookCoverProjects.splice(0, bookCoverProjects.length, ...data.bookCoverProjects);
    }
    if (Array.isArray(data.bookCoverQuestions)) {
      bookCoverQuestions.splice(0, bookCoverQuestions.length, ...data.bookCoverQuestions);
    }
    if (Array.isArray(data.pages)) {
      pagesData.splice(0, pagesData.length, ...data.pages);
    }
    if (Array.isArray(data.categories)) {
      categoriesData.splice(0, categoriesData.length, ...data.categories);
    }
    if (Array.isArray(data.menus)) {
      menusData.splice(0, menusData.length, ...data.menus);
    }
    if (Array.isArray(data.socialLinks)) {
      socialLinksData.splice(0, socialLinksData.length, ...data.socialLinks);
    }
    if (data.defaultLinks && typeof data.defaultLinks === 'object' && !Array.isArray(data.defaultLinks)) {
      Object.assign(defaultLinksData, data.defaultLinks);
    }
    if (data.seo) {
      Object.assign(seoData, data.seo);
    }
    if (Array.isArray(data.redirects)) {
      redirectsData.splice(0, redirectsData.length, ...data.redirects);
    }
    if (data.theme) {
      Object.assign(themeSettings, data.theme);
    }
    if (data.header) {
      Object.assign(headerSettings, data.header);
    }
    if (data.footer) {
      Object.assign(footerSettings, data.footer);
    }
    if (data.paymentSettings) {
      Object.assign(paymentSettingsData, data.paymentSettings);
    }
    if (Array.isArray(data.mediaItems)) {
      mediaItemsData.splice(0, mediaItemsData.length, ...data.mediaItems);
    }
    if (Array.isArray(data.contentVersions)) {
      contentVersionsData.splice(0, contentVersionsData.length, ...data.contentVersions);
    }
    if (Array.isArray(data.adminUsers)) {
      adminUsersData.splice(0, adminUsersData.length, ...data.adminUsers);
    }
    if (Array.isArray(data.auditLogs)) {
      auditLogsData.splice(0, auditLogsData.length, ...data.auditLogs);
    }
    if (data.pageContents) {
      Object.assign(pageContentsData, data.pageContents);
    }
    if (Array.isArray(data.contactMessages)) {
      contactMessagesData.splice(0, contactMessagesData.length, ...data.contactMessages);
    }
    if (Array.isArray(data.vantageServices)) {
      vantageServicesData.splice(0, vantageServicesData.length, ...data.vantageServices);
    }
    if (Array.isArray(data.vantageBeforeAfter)) {
      vantageBeforeAfterData.splice(0, vantageBeforeAfterData.length, ...data.vantageBeforeAfter);
    }
    if (Array.isArray(data.vantageInquiries)) {
      vantageInquiriesData.splice(0, vantageInquiriesData.length, ...data.vantageInquiries);
    }
    if (Array.isArray(data.photoshopWorkflows)) {
      photoshopWorkflowsData.splice(0, photoshopWorkflowsData.length, ...data.photoshopWorkflows);
    }
    if (Array.isArray(data.photoshopCustomOrders)) {
      photoshopCustomOrdersData.splice(0, photoshopCustomOrdersData.length, ...data.photoshopCustomOrders);
    }
    if (Array.isArray(data.photoshopTemplates)) {
      photoshopTemplatesData.splice(0, photoshopTemplatesData.length, ...data.photoshopTemplates);
    }
    if (Array.isArray(data.photoshopSavedPrompts)) {
      photoshopSavedPromptsData.splice(0, photoshopSavedPromptsData.length, ...data.photoshopSavedPrompts);
    }
    if (Array.isArray(data.photoshopDownloads)) {
      photoshopDownloadsData.splice(0, photoshopDownloadsData.length, ...data.photoshopDownloads);
    }
    if (Array.isArray(data.photoshopFavorites)) {
      photoshopFavoritesData.splice(0, photoshopFavoritesData.length, ...data.photoshopFavorites);
    }
    if (Array.isArray(data.quickServices)) {
      quickServicesData.splice(0, quickServicesData.length, ...data.quickServices);
    }
    if (Array.isArray(data.quickFixOrders)) {
      quickFixOrdersData.splice(0, quickFixOrdersData.length, ...data.quickFixOrders);
    }
    if (Array.isArray(data.salesLeads)) {
      salesLeadsData.splice(0, salesLeadsData.length, ...data.salesLeads);
    }
    if (data.salesAnalytics) {
      Object.assign(salesAnalyticsData, data.salesAnalytics);
    }
    if (Array.isArray(data.graphicDesignCategories) && data.graphicDesignCategories.length > 0) {
      const existingCatIds = new Set(data.graphicDesignCategories.map((c: any) => c.id || c.slug));
      const mergedCats = [...data.graphicDesignCategories];
      for (const initCat of GRAPHIC_DESIGN_MAIN_CATEGORIES) {
        if (!existingCatIds.has(initCat.id) && !existingCatIds.has(initCat.slug)) {
          mergedCats.push(initCat);
          existingCatIds.add(initCat.id);
        }
      }
      graphicDesignCategoriesData.splice(0, graphicDesignCategoriesData.length, ...mergedCats);
    } else {
      graphicDesignCategoriesData.splice(0, graphicDesignCategoriesData.length, ...JSON.parse(JSON.stringify(GRAPHIC_DESIGN_MAIN_CATEGORIES)));
    }
    if (Array.isArray(data.graphicDesignServices) && data.graphicDesignServices.length > 0) {
      const existingServiceIds = new Set(data.graphicDesignServices.map((s: any) => s.id || s.slug));
      const mergedServices = [...data.graphicDesignServices];
      for (const initService of GRAPHIC_DESIGN_SERVICES) {
        if (!existingServiceIds.has(initService.id) && !existingServiceIds.has(initService.slug)) {
          mergedServices.push(initService);
          existingServiceIds.add(initService.id);
        }
      }
      graphicDesignServicesData.splice(0, graphicDesignServicesData.length, ...mergedServices);
    } else {
      graphicDesignServicesData.splice(0, graphicDesignServicesData.length, ...JSON.parse(JSON.stringify(GRAPHIC_DESIGN_SERVICES)));
    }
    if (data.graphicDesignSettings) {
      Object.assign(graphicDesignSettingsData, data.graphicDesignSettings);
    }
    if (Array.isArray(data.graphicDesignInquiries)) {
      graphicDesignInquiriesData.splice(0, graphicDesignInquiriesData.length, ...data.graphicDesignInquiries);
    }
    if (Array.isArray(data.gurujiCategories) && data.gurujiCategories.length > 0) {
      // Merge disk categories with initial categories ensuring no standard categories are missing
      const existingIds = new Set(data.gurujiCategories.map((c: any) => c.id || c.slug));
      const mergedCategories = [...data.gurujiCategories];
      for (const initCat of INITIAL_GURUJI_CATEGORIES) {
        if (!existingIds.has(initCat.id) && !existingIds.has(initCat.slug)) {
          mergedCategories.push(initCat);
          existingIds.add(initCat.id);
        }
      }
      gurujiCategoriesData.splice(0, gurujiCategoriesData.length, ...mergedCategories);
    }
    if (Array.isArray(data.gurujiArtworks) && data.gurujiArtworks.length > 0) {
      // Merge disk artworks with initial artworks ensuring distinct collections exist for all categories
      const existingArtIds = new Set(data.gurujiArtworks.map((a: any) => a.id));
      const mergedArtworks = [...data.gurujiArtworks];
      for (const initArt of INITIAL_GURUJI_ARTWORKS) {
        if (!existingArtIds.has(initArt.id)) {
          mergedArtworks.push(initArt);
          existingArtIds.add(initArt.id);
        }
      }
      gurujiArtworksData.splice(0, gurujiArtworksData.length, ...mergedArtworks);
    }
    if (Array.isArray(data.gurujiBundles) && data.gurujiBundles.length > 0) {
      const existingBundleIds = new Set(data.gurujiBundles.map((b: any) => b.id));
      const mergedBundles = [...data.gurujiBundles];
      for (const initBundle of MARKETPLACE_BUNDLES) {
        if (!existingBundleIds.has(initBundle.id)) {
          mergedBundles.push(initBundle);
          existingBundleIds.add(initBundle.id);
        }
      }
      gurujiBundlesData.splice(0, gurujiBundlesData.length, ...mergedBundles);
    }
    if (Array.isArray(data.gurujiCustomRequests) && data.gurujiCustomRequests.length > 0) {
      gurujiCustomRequestsData.splice(0, gurujiCustomRequestsData.length, ...data.gurujiCustomRequests);
    }
    if (Array.isArray(data.gurujiBlessings) && data.gurujiBlessings.length > 0) {
      gurujiBlessingsData.splice(0, gurujiBlessingsData.length, ...data.gurujiBlessings);
    }
    if (Array.isArray(data.gurujiExperts) && data.gurujiExperts.length > 0) {
      gurujiExpertsData.splice(0, gurujiExpertsData.length, ...data.gurujiExperts);
    }
    if (Array.isArray(data.gurujiPredictionRequests)) {
      gurujiPredictionRequestsData.splice(0, gurujiPredictionRequestsData.length, ...data.gurujiPredictionRequests);
    }
    if (Array.isArray(data.gurujiPredictionResults)) {
      gurujiPredictionResultsData.splice(0, gurujiPredictionResultsData.length, ...data.gurujiPredictionResults);
    }
    if (Array.isArray(data.gurujiWallSubmissions) && data.gurujiWallSubmissions.length > 0) {
      gurujiWallSubmissionsData.splice(0, gurujiWallSubmissionsData.length, ...data.gurujiWallSubmissions);
    }
    if (Array.isArray(data.gurujiInquiries)) {
      gurujiInquiriesData.splice(0, gurujiInquiriesData.length, ...data.gurujiInquiries);
    }
    if (Array.isArray(data.gurujiPersonalizedCards)) {
      gurujiPersonalizedCardsData.splice(0, gurujiPersonalizedCardsData.length, ...data.gurujiPersonalizedCards);
    }
    if (data.gurujiFavorites && typeof data.gurujiFavorites === 'object') {
      Object.assign(gurujiFavoritesData, data.gurujiFavorites);
    }
    if (Array.isArray(data.freeSampleRequests)) {
      freeSampleRequestsData.splice(0, freeSampleRequestsData.length, ...data.freeSampleRequests);
    }

    console.log(`[DB] Successfully loaded persistent database from ${DB_FILE} (Last updated: ${data.lastUpdated || 'Initial'})`);
    return true;
  } catch (err) {
    console.error('[DB] Failed to load database from disk:', err);
    return false;
  }
}

// Automatically load database upon module initialization
loadDatabaseFromDisk();



