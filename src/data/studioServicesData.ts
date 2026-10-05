import { StudioServiceItem, HeroStatistics, BrandColorSettings } from '../types';

export const DEFAULT_HERO_STATS: HeroStatistics = {
  projectsCompleted: '14,800+',
  imagesEdited: '240,000+',
  happyClients: '2,400+',
  averageTurnaround: '12 Hours',
};

export const DEFAULT_BRAND_COLORS: BrandColorSettings = {
  primary: '#7C3AED',
  secondary: '#06B6D4',
  accent: '#F59E0B',
  dark: '#070A13',
  surface: '#111827',
  light: '#F8FAFC',
  textDark: '#0F172A',
  textLight: '#F8FAFC',
};

export const STUDIO_SERVICES: StudioServiceItem[] = [
  // =================== 1. PRODUCT IMAGE EDITING ===================
  {
    id: 'srv-bg-removal',
    slug: 'background-removal',
    title: 'Background Removal',
    category: 'product-editing',
    categoryLabel: 'Product Image Editing',
    tagline: 'Clean, pixel-perfect cutout & isolation for marketplace listings',
    description: 'Remove cluttered, uneven backgrounds professionally with hand-drawn pen-tool accuracy. Perfect for Amazon, Flipkart, Myntra, and standalone Shopify stores.',
    features: [
      '100% Hand-Drawn Clipping Path Cutout',
      'Transparent PNG & Pure White RGB 255/255/255 Output',
      'Flawless Edge Smoothing (No jagged or pixelated borders)',
      'Hair, fur, and intricate mesh masking where applicable',
      'Bulk batch discounts available with consistent lighting',
      'High-resolution export in JPG, PNG, and layered PSD'
    ],
    deliveryTime: '12-24 Hours',
    turnaroundHours: 12,
    startingPrice: 39,
    fileFormats: ['PNG (Transparent)', 'JPG (Pure White)', 'PSD (Layered)', 'TIFF', 'WEBP'],
    supportedMarketplaces: ['Amazon India', 'Flipkart', 'Myntra', 'Meesho', 'Shopify', 'Blinkit', 'Nykaa'],
    revisionPolicy: 'Unlimited free revisions until 100% marketplace approval.',
    beforeImageUrl: '/src/assets/images/hero_watch_raw_1790156645806.jpg',
    afterImageUrl: '/src/assets/images/hero_product_watch_edit_1790156495540.jpg',
    faqs: [
      {
        question: 'Will Amazon or Flipkart accept these background cutouts?',
        answer: 'Yes, 100%. Our background cutouts strictly follow Amazon RGB (255, 255, 255) pure white guidelines and Flipkart Seller Hub minimum 85% frame-fill rules.'
      },
      {
        question: 'What file format do you return?',
        answer: 'We deliver transparent background PNGs, high-resolution pure white JPGs (300 DPI, 2000x2000px+), and layered PSDs upon request.'
      },
      {
        question: 'How fast can I get 100 images edited?',
        answer: 'Our dedicated studio team processes up to 500 images per batch within 24 to 36 hours without compromising edge fidelity.'
      }
    ],
    packages: [
      { id: 'pkg-bg-single', name: 'Starter Batch', pricePerImage: 49, minImages: 5, deliveryHours: 24, features: ['Pure White or Transparent PNG', '300 DPI High-Res Export', '2 Revisions'] },
      { id: 'pkg-bg-pro', name: 'Growth Catalog', pricePerImage: 39, minImages: 25, deliveryHours: 18, isPopular: true, features: ['Pure White + Transparent + PSD', 'Natural Soft Shadow Added', 'Express Turnaround', 'Unlimited Revisions'] },
      { id: 'pkg-bg-bulk', name: 'Enterprise Bulk', pricePerImage: 29, minImages: 100, deliveryHours: 12, features: ['Dedicated Retoucher Assigned', 'Custom Naming & SKU Mapping', 'Layered Master PSDs', 'Priority SLA 12h'] },
    ]
  },
  {
    id: 'srv-white-bg',
    slug: 'white-background',
    title: 'White Background Product Editing',
    category: 'product-editing',
    categoryLabel: 'Product Image Editing',
    tagline: 'Standardized RGB 255,255,255 marketplace-compliant hero images',
    description: 'Ensure 100% compliance with marketplace algorithms. We center your product, balance lighting, remove unwanted tints, and guarantee pure white borders.',
    features: [
      'Certified Amazon & Flipkart RGB (255, 255, 255) White',
      'Consistent margins & product centering across your entire catalog',
      'Product occupies 85%+ of the image frame for maximum CTR',
      'Glare, reflection, and lens vignette neutralization',
      'Natural contact drop shadow to prevent floating appearance',
      'Zero color bleed from original studio backdrop'
    ],
    deliveryTime: '12-24 Hours',
    turnaroundHours: 12,
    startingPrice: 49,
    fileFormats: ['JPG (Max Quality)', 'TIFF', 'PNG', 'PSD'],
    supportedMarketplaces: ['Amazon', 'Flipkart', 'Shopify', 'Meesho', 'Ajio', 'Tata CLiQ'],
    revisionPolicy: 'Free revisions until approved on Seller Central.',
    beforeImageUrl: '/src/assets/images/cosmetics_raw_1790156661714.jpg',
    afterImageUrl: '/src/assets/images/product_cosmetics_clean_1790156507953.jpg',
    faqs: [
      {
        question: 'Why do marketplaces reject non-pure white images?',
        answer: 'Marketplace search algorithms index product catalogs strictly. Any off-white grey or warm tint causes listing suppression or lower organic search ranking.'
      },
      {
        question: 'Do you add shadows so the product looks grounded?',
        answer: 'Yes! We craft a subtle, photorealistic drop or cast shadow so your product looks natural and premium rather than artificially pasted.'
      }
    ]
  },
  {
    id: 'srv-retouching',
    slug: 'product-retouching',
    title: 'Product Retouching',
    category: 'product-editing',
    categoryLabel: 'Product Image Editing',
    tagline: 'Flawless surface cleanup, scratch removal & texture preservation',
    description: 'Erase dust specs, manufacturing scratches, packaging creases, smudges, and stray reflections while preserving the genuine tactile texture of your materials.',
    features: [
      'Micro-level dust, speck, and fiber removal at 400% zoom',
      'Scratch, dent, and seam line cleanup on plastics, metal & glass',
      'Apparel wrinkle de-creasing and silhouette streamlining',
      'Metallic chrome reflection smoothing and gradient balancing',
      'Preservation of fabric weaves, leather grain, and matte coatings',
      'Color tone harmonization across camera shots'
    ],
    deliveryTime: '24 Hours',
    turnaroundHours: 24,
    startingPrice: 79,
    fileFormats: ['JPG', 'PNG', 'PSD', 'TIFF'],
    supportedMarketplaces: ['Amazon Luxury', 'Myntra Fashion', 'Shopify Plus', 'Nykaa Beauty', 'Flipkart'],
    revisionPolicy: 'Unlimited revisions until your product looks brand-new and pristine.',
    beforeImageUrl: '/src/assets/images/hero_watch_raw_1790156645806.jpg',
    afterImageUrl: '/src/assets/images/hero_product_watch_edit_1790156495540.jpg',
    faqs: [
      {
        question: 'Can you fix bad lighting or dark shadows on my original photo?',
        answer: 'Yes. Our Photoshop master retouchers re-light dark zones, rebalance highlights, and restore vibrant natural shadows.'
      },
      {
        question: 'Can you retouch apparel without making it look fake?',
        answer: 'Absolutely. We use frequency separation techniques to soften harsh wrinkles while keeping the authentic texture of cotton, silk, and denim intact.'
      }
    ]
  },
  {
    id: 'srv-clipping-path',
    slug: 'clipping-path',
    title: 'Clipping Path & Masking',
    category: 'product-editing',
    categoryLabel: 'Product Image Editing',
    tagline: 'Hand-crafted bezier curves and alpha channel masking',
    description: 'Precision pen-tool vector clipping paths for complex products, jewelry, multi-part items, bicycles, wire goods, and transparent glassware.',
    features: [
      '100% Photoshop Pen Tool Bezier Curves (No automated AI shortcuts)',
      'Multiple paths (Multi-path clipping for color separation)',
      'Alpha channel, color range & layer masking for hair, fur, and tulle',
      'Compound paths with interior cutouts and holes',
      'Embedded paths saved directly inside EPS, TIFF, or PSD files'
    ],
    deliveryTime: '12-24 Hours',
    turnaroundHours: 12,
    startingPrice: 35,
    fileFormats: ['PSD (Embedded Path)', 'TIFF', 'PNG', 'EPS'],
    supportedMarketplaces: ['All Marketplaces & Print Catalogs'],
    revisionPolicy: 'Full path re-tuning at no extra charge.',
    beforeImageUrl: '/src/assets/images/sneaker_raw_1790156678698.jpg',
    afterImageUrl: '/src/assets/images/marketplace_sneaker_lifestyle_1790156519357.jpg',
    faqs: [
      {
        question: 'What is the difference between simple and complex clipping path?',
        answer: 'Simple paths cover straight-edged objects like boxes and books. Complex paths cover jewelry chains, cycles, furniture with intricate railings, and clothing with fringe.'
      }
    ]
  },
  {
    id: 'srv-shadow',
    slug: 'product-shadow',
    title: 'Natural Product Shadow',
    category: 'product-editing',
    categoryLabel: 'Product Image Editing',
    tagline: 'Photorealistic drop, cast, floating & reflection shadows',
    description: 'Give your isolated products realism, depth, and three-dimensional presence on plain white or lifestyle backdrops with custom shadows.',
    features: [
      'Soft natural ground cast shadow matching studio light angle',
      'Subtle floating shadow for shoes, gadgets, and hovering items',
      'Mirror reflection shadow for glossy cosmetics, luxury bottles & electronics',
      'Drop shadow with controllable feathering and opacity',
      'Original shadow retention and blending'
    ],
    deliveryTime: '12-24 Hours',
    turnaroundHours: 12,
    startingPrice: 45,
    fileFormats: ['PNG', 'JPG', 'PSD with Separate Shadow Layer'],
    supportedMarketplaces: ['Amazon', 'Flipkart', 'Shopify', 'Myntra'],
    revisionPolicy: 'Adjust shadow angle and intensity freely.',
    beforeImageUrl: '/src/assets/images/cosmetics_raw_1790156661714.jpg',
    afterImageUrl: '/src/assets/images/product_cosmetics_clean_1790156507953.jpg',
    faqs: [
      {
        question: 'Do you deliver shadow on a separate transparent layer?',
        answer: 'Yes, our layered PSD files provide shadows on dedicated layers so you can independently tweak opacity or reposition backgrounds anytime.'
      }
    ]
  },
  {
    id: 'srv-color-correction',
    slug: 'color-correction',
    title: 'Color Correction & Enhancement',
    category: 'product-editing',
    categoryLabel: 'Product Image Editing',
    tagline: 'True-to-life Pantone matching & multi-variant recoloring',
    description: 'Prevent costly e-commerce customer returns caused by color mismatches. We calibrate white balance, saturation, exposure, and generate all variant shades.',
    features: [
      'Accurate Pantone and physical fabric swatch color matching',
      'Multi-color variant generation from a single base photoshoot',
      'Correction of yellow/blue studio lighting color casts',
      'Metallic gold, silver, and rose-gold luster calibration',
      'Skin tone harmonization for model photography'
    ],
    deliveryTime: '12-24 Hours',
    turnaroundHours: 12,
    startingPrice: 59,
    fileFormats: ['JPG', 'PNG', 'PSD', 'TIFF'],
    supportedMarketplaces: ['Myntra', 'Amazon', 'Nykaa', 'Flipkart', 'Shopify'],
    revisionPolicy: 'Swatch matching guaranteed.',
    beforeImageUrl: '/src/assets/images/sneaker_raw_1790156678698.jpg',
    afterImageUrl: '/src/assets/images/marketplace_sneaker_lifestyle_1790156519357.jpg',
    faqs: [
      {
        question: 'Can I create 10 color variants of a t-shirt or shoe from 1 photo?',
        answer: 'Yes! Send us 1 clean photo along with hex codes or sample swatches, and our retouchers will generate all colorways realistically with natural fabric shadows preserved.'
      }
    ]
  },
  {
    id: 'srv-product-enhancement',
    slug: 'product-enhancement',
    title: 'Product Enhancement',
    category: 'product-editing',
    categoryLabel: 'Product Image Editing',
    tagline: 'Supercharge sharpness, micro-contrast & commercial appeal',
    description: 'Transform mediocre camera shots into high-end commercial catalog photos. We enhance edge definition, bring out fine textures, and boost vibrancy.',
    features: [
      'Selective unsharp masking and clarity boosting without grain',
      'Dynamic range expansion for deep blacks and crisp whites',
      'Glare control on transparent plastics and bottles',
      'Label text crispness sharpening for barcode & font readability',
      'High dynamic range (HDR) exposure fusion'
    ],
    deliveryTime: '12-24 Hours',
    turnaroundHours: 12,
    startingPrice: 69,
    fileFormats: ['JPG', 'PNG', 'PSD', 'TIFF'],
    supportedMarketplaces: ['All E-Commerce Marketplaces'],
    revisionPolicy: 'Unlimited revisions.',
    beforeImageUrl: '/src/assets/images/hero_watch_raw_1790156645806.jpg',
    afterImageUrl: '/src/assets/images/hero_product_watch_edit_1790156495540.jpg',
    faqs: [
      {
        question: 'What resolution should my original image be?',
        answer: 'We accept photos taken on modern smartphones as well as DSLRs. Our enhancement pipeline sharpens resolution and upscales cleanly up to 4K.'
      }
    ]
  },

  // =================== 2. MARKETPLACE DESIGN ===================
  {
    id: 'srv-amazon-images',
    slug: 'amazon-images',
    title: 'Amazon Product Images',
    category: 'marketplace-design',
    categoryLabel: 'Marketplace Design',
    tagline: 'High-converting 7-image listing sets optimized for Amazon A9 algorithm',
    description: 'Dominate your category with a complete Amazon image stack: Pure White Hero image, Infographics, Lifestyle in-context visuals, Dimensions guide, and Trust badges.',
    features: [
      'Image 1: 100% Amazon Guidelines Compliant White BG Hero (2000x2000px, 85%+ fill)',
      'Image 2 & 3: Key Feature Infographics with zoom callouts',
      'Image 4: Exact Dimensions & What’s In The Box Graphic',
      'Image 5: Premium Lifestyle Scene with target demographic',
      'Image 6: Comparison Chart highlighting your competitive edge',
      'Image 7: Trust, Warranty, Certification or Customer Proof Badge'
    ],
    deliveryTime: '24-48 Hours',
    turnaroundHours: 36,
    startingPrice: 1499,
    fileFormats: ['JPG 2000x2000px (Amazon Zoom Ready)', 'Layered PSD'],
    supportedMarketplaces: ['Amazon India (IN)', 'Amazon US', 'Amazon UK/EU', 'Amazon UAE'],
    revisionPolicy: 'Unlimited revisions until published on Amazon Seller Central.',
    beforeImageUrl: '/src/assets/images/cosmetics_raw_1790156661714.jpg',
    afterImageUrl: '/src/assets/images/product_cosmetics_clean_1790156507953.jpg',
    faqs: [
      {
        question: 'Does the 2000x2000px size trigger Amazon’s hover-to-zoom feature?',
        answer: 'Yes! Amazon requires at least 1000px on the longest side to activate zoom, and 2000x2000px provides ultra-crisp zoom clarity that significantly boosts conversions.'
      },
      {
        question: 'Do you help write the text points on the infographics?',
        answer: 'Yes! Provide your product bullet points or manufacturer specs and our e-commerce copywriters will distill them into punchy, high-impact feature callouts.'
      }
    ],
    packages: [
      { id: 'pkg-amz-hero', name: 'Main Hero Image', pricePerImage: 299, minImages: 1, deliveryHours: 12, features: ['Pure White RGB 255', 'Amazon Zoom 2000px', 'Drop Shadow', '100% Compliance'] },
      { id: 'pkg-amz-full', name: 'Complete 7-Image Stack', pricePerImage: 1499, minImages: 1, deliveryHours: 36, isPopular: true, features: ['Hero + 3 Infographics + Lifestyle + Dimensions + Warranty', 'Amazon A9 SEO Keyword Focus', 'High-Res PSD Source Files', 'Unlimited Revisions'] },
      { id: 'pkg-amz-brand', name: 'Brand Dominance Pack', pricePerImage: 2999, minImages: 1, deliveryHours: 48, features: ['7 Listing Images + A+ Basic Module + 3D Product Mockup + Video Thumbnail', 'Dedicated Art Director', 'Priority Delivery'] },
    ]
  },
  {
    id: 'srv-flipkart-images',
    slug: 'flipkart-images',
    title: 'Flipkart Product Images',
    category: 'marketplace-design',
    categoryLabel: 'Marketplace Design',
    tagline: 'High-CTR Flipkart listings crafted for Indian mobile shoppers',
    description: 'Designed specifically for the Flipkart buyer behavior with bold Hindi/English value highlights, zoom-ready clarity, and mobile-first infographics.',
    features: [
      'Flipkart Seller Hub compliant 1:1 and 3:4 aspect ratio hero images',
      'Mobile-optimized typography readable on 5-inch smartphone screens',
      'Highlighting Key Selling Propositions (KSPs), durability, and warranty',
      'Dimension comparison against familiar everyday household objects',
      'Package includes Flipkart Banner formats for Big Billion Days promotions'
    ],
    deliveryTime: '24-48 Hours',
    turnaroundHours: 36,
    startingPrice: 1299,
    fileFormats: ['JPG', 'PNG', 'Layered PSD'],
    supportedMarketplaces: ['Flipkart', 'Shopsy'],
    revisionPolicy: 'Unlimited revisions until listing passes QC.',
    beforeImageUrl: '/src/assets/images/sneaker_raw_1790156678698.jpg',
    afterImageUrl: '/src/assets/images/marketplace_sneaker_lifestyle_1790156519357.jpg',
    faqs: [
      {
        question: 'How do Flipkart image requirements differ from Amazon?',
        answer: 'Flipkart buyers are 90%+ mobile. Infographics need larger headline fonts, high contrast badges, and immediate clarity on package contents and Indian warranty.'
      }
    ]
  },
  {
    id: 'srv-myntra-images',
    slug: 'myntra-images',
    title: 'Myntra Catalog Images',
    category: 'marketplace-design',
    categoryLabel: 'Marketplace Design',
    tagline: 'Editorial fashion & luxury catalog standards matching Myntra studio specs',
    description: 'Pass Myntra’s strict QC on your first upload. Precision ghost mannequin stitching, model skin tone balancing, fabric texture detail, and exact 3:4 aspect ratio framing.',
    features: [
      'Strict Myntra 3:4 aspect ratio (typically 1080x1440px or 1920x2560px)',
      'Hollow ghost mannequin neck joint and inner tag alignment',
      'Wrinkle reduction with authentic textile drape preservation',
      'Subtle editorial grey/white background lighting tone',
      'Close-up fabric weave and embroidery texture shots'
    ],
    deliveryTime: '24-48 Hours',
    turnaroundHours: 36,
    startingPrice: 1499,
    fileFormats: ['JPG', 'TIFF', 'PSD'],
    supportedMarketplaces: ['Myntra', 'Ajio', 'Nykaa Fashion', 'Tata CLiQ Luxury'],
    revisionPolicy: 'Full adherence to Myntra Style Guide guaranteed.',
    beforeImageUrl: '/src/assets/images/hero_watch_raw_1790156645806.jpg',
    afterImageUrl: '/src/assets/images/hero_product_watch_edit_1790156495540.jpg',
    faqs: [
      {
        question: 'Do you guarantee approval against Myntra catalog rejections?',
        answer: 'Yes! We follow the exact guidelines for lighting ratios, neutral backgrounds, margins, and crop heights required by Myntra onboarding teams.'
      }
    ]
  },
  {
    id: 'srv-meesho-images',
    slug: 'meesho-images',
    title: 'Meesho Product Images',
    category: 'marketplace-design',
    categoryLabel: 'Marketplace Design',
    tagline: 'Fast-selling, high-impact catalog imagery for Meesho resellers & tier 2/3 buyers',
    description: 'Boost reseller orders and end-consumer trust with bright, attractive product visuals that showcase quality, fabric, size, and real value.',
    features: [
      'High-contrast, vibrant color enhancement that pops in Meesho feed',
      'Clear multi-pack representation (Pack of 2, 3, 5 clarity)',
      'Bilingual and icon-based feature highlights for broad accessibility',
      'Fabric close-up and real-use perspective graphics',
      'Optimized lightweight file sizes for lightning-fast 4G loading'
    ],
    deliveryTime: '12-24 Hours',
    turnaroundHours: 18,
    startingPrice: 899,
    fileFormats: ['JPG', 'PNG'],
    supportedMarketplaces: ['Meesho', 'GlowRoad', 'Shopsy'],
    revisionPolicy: 'Quick turnaround adjustments included.',
    beforeImageUrl: '/src/assets/images/cosmetics_raw_1790156661714.jpg',
    afterImageUrl: '/src/assets/images/product_cosmetics_clean_1790156507953.jpg',
    faqs: [
      {
        question: 'Can you show combos and packs of multiple products in one image?',
        answer: 'Yes! Combo creatives are among our top specialties for Meesho. We isolate each item and arrange them in an attractive, balanced bundle composition.'
      }
    ]
  },
  {
    id: 'srv-shopify-images',
    slug: 'shopify-images',
    title: 'Shopify Product Images',
    category: 'marketplace-design',
    categoryLabel: 'Marketplace Design',
    tagline: 'Custom branded visual identity for modern D2C storefronts',
    description: 'Break free from plain white boxes. Elevate your D2C brand with bespoke background aesthetics, matching brand hex colors, soft shadows, and responsive banner exports.',
    features: [
      'Custom colored, gradient, or textured backdrops matching brand guidelines',
      'Consistent square (1:1) and portrait (4:5) ratios across all collections',
      'Hover secondary state imagery (e.g. front view + back view on hover)',
      'WebP optimization for high Google PageSpeed scores',
      'Mobile-responsive hero and collection banner layouts'
    ],
    deliveryTime: '24-48 Hours',
    turnaroundHours: 36,
    startingPrice: 1299,
    fileFormats: ['WebP', 'JPG', 'PNG', 'Figma', 'PSD'],
    supportedMarketplaces: ['Shopify', 'WooCommerce', 'Magento', 'Custom Headless'],
    revisionPolicy: 'Full brand theme alignment.',
    beforeImageUrl: '/src/assets/images/sneaker_raw_1790156678698.jpg',
    afterImageUrl: '/src/assets/images/marketplace_sneaker_lifestyle_1790156519357.jpg',
    faqs: [
      {
        question: 'Can you export directly into modern WebP format for fast Shopify loading?',
        answer: 'Yes! We deliver both maximum-resolution master files and ultra-compressed WebP assets to ensure your Shopify store loads in under 1.5 seconds.'
      }
    ]
  },

  // =================== 3. LISTING DESIGN ===================
  {
    id: 'srv-infographics',
    slug: 'infographics',
    title: 'Product Infographics',
    category: 'listing-design',
    categoryLabel: 'Listing Design',
    tagline: 'Visual storytelling that converts skimmers into paying buyers',
    description: 'Transform technical specs and boring manuals into visually captivating infographics with arrows, zoom circles, cutaways, and benefits.',
    features: [
      'Custom vector icons tailored to your product category',
      'Zoom callout circles revealing internal components and build quality',
      'Material callouts (e.g. BPA Free, Surgical Grade Steel, 100% Organic Cotton)',
      'Easy-to-digest bullet badges that address top buyer hesitations',
      'Color-matched to your product and brand identity'
    ],
    deliveryTime: '24 Hours',
    turnaroundHours: 24,
    startingPrice: 499,
    fileFormats: ['JPG', 'PNG', 'PSD Source'],
    supportedMarketplaces: ['Amazon', 'Flipkart', 'Shopify', 'All Platforms'],
    revisionPolicy: 'Copy adjustments and layout tweaks included.',
    beforeImageUrl: '/src/assets/images/cosmetics_raw_1790156661714.jpg',
    afterImageUrl: '/src/assets/images/product_cosmetics_clean_1790156507953.jpg',
    faqs: [
      {
        question: 'Do I need to supply the icons or design layout?',
        answer: 'No! Just give us your bullet points. Our design team creates custom illustrations, icons, and layout hierarchy from scratch.'
      }
    ]
  },
  {
    id: 'srv-feature-highlights',
    slug: 'feature-highlights',
    title: 'Feature Highlights',
    category: 'listing-design',
    categoryLabel: 'Listing Design',
    tagline: 'Highlight unique selling points with high-impact visual callouts',
    description: 'Zoom in on critical details: waterproof seals, ergonomic grips, patented mechanisms, double stitching, or diamond clarity.',
    features: [
      'Close-up macro detail callout boxes',
      'Graphic overlays demonstrating durability, heat resistance, or waterproof rating',
      'Badge styling with sleek typography and subtle glow effects',
      'Clean negative space for effortless reading on mobile screens'
    ],
    deliveryTime: '24 Hours',
    turnaroundHours: 24,
    startingPrice: 399,
    fileFormats: ['JPG', 'PNG', 'PSD'],
    supportedMarketplaces: ['All E-Commerce'],
    revisionPolicy: 'Unlimited revisions.',
    beforeImageUrl: '/src/assets/images/hero_watch_raw_1790156645806.jpg',
    afterImageUrl: '/src/assets/images/hero_product_watch_edit_1790156495540.jpg',
    faqs: [
      {
        question: 'Can you show cutaway or exploded views of components?',
        answer: 'Yes! We can create composite exploded views showcasing layers, internal batteries, filters, or cushioning systems.'
      }
    ]
  },
  {
    id: 'srv-size-charts',
    slug: 'size-charts',
    title: 'Size Charts & Dimension Guides',
    category: 'listing-design',
    categoryLabel: 'Listing Design',
    tagline: 'Eliminate customer return confusion with exact dimensional graphics',
    description: 'Clear dimensional graphics with centimeters, inches, weight ratings, and visual scale comparisons against smartphones, cups, or human silhouettes.',
    features: [
      'Dual metric (Inches & CM) measurement guides',
      'Dimension arrows indicating height, width, depth, and volume',
      'Apparel chest, waist, and length measurement charts',
      'Contextual scale comparisons against familiar items'
    ],
    deliveryTime: '24 Hours',
    turnaroundHours: 24,
    startingPrice: 399,
    fileFormats: ['JPG', 'PNG', 'PSD'],
    supportedMarketplaces: ['Amazon', 'Flipkart', 'Myntra', 'Shopify'],
    revisionPolicy: 'Quick measurement adjustments included.',
    beforeImageUrl: '/src/assets/images/sneaker_raw_1790156678698.jpg',
    afterImageUrl: '/src/assets/images/marketplace_sneaker_lifestyle_1790156519357.jpg',
    faqs: [
      {
        question: 'How much do dimension graphics reduce customer return rates?',
        answer: 'Studies across Amazon and Flipkart indicate that clear dimensional graphics and size charts reduce size-related return rates by up to 34%.'
      }
    ]
  },
  {
    id: 'srv-comparison-charts',
    slug: 'comparison-charts',
    title: 'Comparison Charts',
    category: 'listing-design',
    categoryLabel: 'Listing Design',
    tagline: 'Clearly prove why your product outperforms cheap generic alternatives',
    description: '“Our Product vs. Others” side-by-side comparison tables with checkmarks, cross marks, and visual proof of superior materials and longevity.',
    features: [
      '“Us vs. Them” high-contrast matrix layout',
      'Iconic green checkmarks and red cross indicators',
      'Side-by-side photographic material comparison',
      'Persuasive, compliant copy that respects marketplace advertising rules'
    ],
    deliveryTime: '24 Hours',
    turnaroundHours: 24,
    startingPrice: 499,
    fileFormats: ['JPG', 'PNG', 'PSD'],
    supportedMarketplaces: ['Amazon', 'Flipkart', 'Shopify'],
    revisionPolicy: 'Unlimited revisions.',
    beforeImageUrl: '/src/assets/images/hero_watch_raw_1790156645806.jpg',
    afterImageUrl: '/src/assets/images/hero_product_watch_edit_1790156495540.jpg',
    faqs: [
      {
        question: 'Are “Us vs Others” charts allowed on Amazon?',
        answer: 'Yes, as long as you do not name specific competitors by brand name. We use compliant labels like "Our Brand" vs "Generic / Traditional Models".'
      }
    ]
  },
  {
    id: 'srv-how-to-use',
    slug: 'how-to-use',
    title: 'How-to-use Graphics',
    category: 'listing-design',
    categoryLabel: 'Listing Design',
    tagline: 'Step-by-step 1-2-3 visual instruction guides that build buyer confidence',
    description: 'Reduce negative reviews caused by user error. Clear 3-step or 4-step sequential visual instructions showing unboxing, setup, operation, or care.',
    features: [
      'Numbered sequential workflow (Step 1, Step 2, Step 3)',
      'Directional movement arrows and touch indicators',
      'Dos and Don’ts safety visual panels',
      'Care, washing, or maintenance tips'
    ],
    deliveryTime: '24 Hours',
    turnaroundHours: 24,
    startingPrice: 499,
    fileFormats: ['JPG', 'PNG', 'PSD'],
    supportedMarketplaces: ['Amazon', 'Flipkart', 'Shopify'],
    revisionPolicy: 'Step revisions included.',
    beforeImageUrl: '/src/assets/images/cosmetics_raw_1790156661714.jpg',
    afterImageUrl: '/src/assets/images/product_cosmetics_clean_1790156507953.jpg',
    faqs: [
      {
        question: 'Can you work from a rough text manual or video demonstration?',
        answer: 'Yes! Send us your instruction text or a quick phone video showing how the product works, and we will translate it into clean visual step cards.'
      }
    ]
  },
  {
    id: 'srv-a-plus-content',
    slug: 'a-plus-content',
    title: 'A+ Content (Enhanced Brand Content)',
    category: 'listing-design',
    categoryLabel: 'Listing Design',
    tagline: 'Immersive Amazon Brand Story & A+ modules that multiply conversions by 20%+',
    description: 'Transform your Amazon detail page into a branded mini-website. We design complete standard and premium A+ modules with rich headers, comparison grids, and technical breakdowns.',
    features: [
      'Full Amazon A+ Module Stack (Standard Header, Technical Specs, 4-Image Grid, Comparison Table)',
      'Amazon Brand Story carousel banner set included',
      'Exact Amazon Seller Central pixel dimensions (970x600px, 300x300px, 970x300px)',
      'Copywriting & persuasive headline scripting included',
      'Direct upload-ready JPGs + editable layered PSD files'
    ],
    deliveryTime: '48-72 Hours',
    turnaroundHours: 48,
    startingPrice: 2499,
    fileFormats: ['JPG (Amazon A+ Spec)', 'Layered PSD'],
    supportedMarketplaces: ['Amazon Brand Registry (IN, US, UK, UAE)'],
    revisionPolicy: 'Unlimited revisions until approved by Amazon Brand Registry.',
    beforeImageUrl: '/src/assets/images/marketplace_sneaker_lifestyle_1790156519357.jpg',
    afterImageUrl: '/src/assets/images/marketplace_sneaker_lifestyle_1790156519357.jpg',
    faqs: [
      {
        question: 'Do I need Amazon Brand Registry to use A+ Content?',
        answer: 'Yes, Amazon requires sellers to have active Brand Registry or trademark pending status to unlock A+ Content on their ASINs.'
      },
      {
        question: 'Do you provide the modules in the exact required pixel sizes?',
        answer: 'Yes! Every file is labeled with its exact Amazon module name and pixel dimensions for effortless 2-minute drag-and-drop upload.'
      }
    ]
  },
  {
    id: 'srv-ebc-content',
    slug: 'ebc-content',
    title: 'EBC Content & Premium Catalog Design',
    category: 'listing-design',
    categoryLabel: 'Listing Design',
    tagline: 'Brand narrative designs that establish authority and command premium pricing',
    description: 'Elevate your brand presence across modern marketplaces with high-impact editorial storytelling, product family comparisons, and founder story modules.',
    features: [
      'Hero banner with brand philosophy and mission',
      'Ingredient and sourcing authenticity breakdown',
      'Interactive cross-selling comparison chart linking sister products',
      'Optimized for both desktop wide screens and compact mobile viewports'
    ],
    deliveryTime: '48 Hours',
    turnaroundHours: 48,
    startingPrice: 2199,
    fileFormats: ['JPG', 'PNG', 'PSD', 'PDF'],
    supportedMarketplaces: ['Amazon', 'Flipkart Brand Hub', 'Shopify'],
    revisionPolicy: 'Unlimited revisions.',
    beforeImageUrl: '/src/assets/images/hero_watch_raw_1790156645806.jpg',
    afterImageUrl: '/src/assets/images/hero_product_watch_edit_1790156495540.jpg',
    faqs: [
      {
        question: 'Can you repurpose the A+/EBC designs for our Shopify product pages?',
        answer: 'Yes! We deliver web-ready slices that slot seamlessly into Shopify sections and page builders like PageFly, GemPages, or Shogun.'
      }
    ]
  },
  {
    id: 'srv-product-listing',
    slug: 'product-listing',
    title: 'Complete Product Listing Design',
    category: 'listing-design',
    categoryLabel: 'Listing Design',
    tagline: 'End-to-end turnkey creative package for launching new marketplace ASINs',
    description: 'Get everything needed to launch your product with maximum conversion power: Hero cutout, 5 Infographics, Lifestyle render, Size guide, and Banner ad.',
    features: [
      'Complete 7 to 9 Image Marketplace Listing Suite',
      'Hero pure white cutout with realistic shadow',
      'Lifestyle in-context background integration',
      '3 Core Infographics + 1 Comparison Chart',
      'Package contents & dimensions chart',
      'Social media launch teaser graphic bonus'
    ],
    deliveryTime: '48 Hours',
    turnaroundHours: 48,
    startingPrice: 2999,
    fileFormats: ['JPG', 'PNG', 'Layered PSD', 'ZIP Archive'],
    supportedMarketplaces: ['Amazon', 'Flipkart', 'Shopify', 'All Channels'],
    revisionPolicy: 'Unlimited revisions across all package assets.',
    beforeImageUrl: '/src/assets/images/cosmetics_raw_1790156661714.jpg',
    afterImageUrl: '/src/assets/images/product_cosmetics_clean_1790156507953.jpg',
    faqs: [
      {
        question: 'Is this the best option for launching a brand new product?',
        answer: 'Yes! This turnkey package delivers your entire visual identity and marketplace asset suite in one coordinated project.'
      }
    ]
  },
  {
    id: 'srv-catalog-design',
    slug: 'catalog-design',
    title: 'Catalog Design',
    category: 'listing-design',
    categoryLabel: 'Listing Design',
    tagline: 'Digital & print-ready B2B wholesale lookbooks and consumer catalogs',
    description: 'Professional multi-page catalogs, line sheets, and lookbooks for B2B buyer pitches, trade expos, wholesale distribution, and retail sales reps.',
    features: [
      'Multi-page PDF layout with interactive table of contents and clickable links',
      'Clean grid alignment of product SKUs, wholesale pricing, and MOQ tables',
      'Print-ready CMYK PDF with 3mm bleed + interactive web-optimized digital PDF',
      'Brand style consistency with typography, colors, and cover artwork'
    ],
    deliveryTime: '3-5 Days',
    turnaroundHours: 72,
    startingPrice: 3499,
    fileFormats: ['Print PDF (CMYK 300DPI)', 'Interactive Web PDF', 'InDesign / Figma'],
    supportedMarketplaces: ['B2B Wholesale', 'Trade Fairs', 'Corporate Distribution'],
    revisionPolicy: 'Iterative layout reviews.',
    beforeImageUrl: '/src/assets/images/designer_studio_workplace_1790156530624.jpg',
    afterImageUrl: '/src/assets/images/designer_studio_workplace_1790156530624.jpg',
    faqs: [
      {
        question: 'How many pages can a catalog have?',
        answer: 'We design catalogs ranging from a 4-page quick line sheet up to 60+ page comprehensive master distributor catalogs.'
      }
    ]
  },

  // =================== 4. CREATIVE SERVICES ===================
  {
    id: 'srv-lifestyle-images',
    slug: 'lifestyle-images',
    title: 'Lifestyle Product Visuals',
    category: 'creative-services',
    categoryLabel: 'Creative Services',
    tagline: 'Photorealistic in-context placement without expensive location photoshoots',
    description: 'Place your product into aspirational luxury environments: modern marble kitchens, minimalist living rooms, outdoor gym parks, or executive desks.',
    features: [
      'Realistic perspective matching and ground shadow alignment',
      'Atmospheric color grading and ambient bounce lighting integration',
      'Human interaction elements (hands holding item, wearing accessories)',
      'Extensive library of high-resolution licensed stock and 3D architectural backdrops',
      'Saves tens of thousands of rupees compared to renting locations and hiring models'
    ],
    deliveryTime: '24-48 Hours',
    turnaroundHours: 36,
    startingPrice: 699,
    fileFormats: ['JPG', 'PNG', 'PSD'],
    supportedMarketplaces: ['Shopify', 'Amazon Lifestyle', 'Instagram Ads', 'Flipkart'],
    revisionPolicy: 'Scene adjustment included.',
    beforeImageUrl: '/src/assets/images/sneaker_raw_1790156678698.jpg',
    afterImageUrl: '/src/assets/images/marketplace_sneaker_lifestyle_1790156519357.jpg',
    faqs: [
      {
        question: 'Does the product look like it is truly in the room?',
        answer: 'Yes! Our artists balance light angles, cast realistic contact shadows, add environmental bounce reflections, and match lens focal length.'
      }
    ]
  },
  {
    id: 'srv-ai-product-scenes',
    slug: 'ai-product-scenes',
    title: 'AI Product Scenes & Visuals',
    category: 'creative-services',
    categoryLabel: 'Creative Services',
    tagline: 'Cutting-edge AI-assisted studio backdrops merged with Photoshop retouching',
    description: 'Harness the creative power of modern generative AI combined with human Photoshop perfection. Surreal floating podiums, natural botanical setups, and futuristic studio stages.',
    features: [
      'Infinite creative backdrop variations (Water splash, sand dune, botanical garden, neon cyber)',
      'Photoshop precision masking ensuring your actual product geometry is 100% unaltered',
      'Rapid turnaround (Generate 10 aesthetic options within hours)',
      'Ideal for D2C hero banners, organic social content, and influencer media kits'
    ],
    deliveryTime: '12-24 Hours',
    turnaroundHours: 18,
    startingPrice: 599,
    fileFormats: ['JPG', 'PNG', 'PSD'],
    supportedMarketplaces: ['Shopify Hero', 'Instagram', 'Meta Ads', 'Amazon Brand Store'],
    revisionPolicy: 'Multiple creative variations provided.',
    beforeImageUrl: '/src/assets/images/cosmetics_raw_1790156661714.jpg',
    afterImageUrl: '/src/assets/images/product_cosmetics_clean_1790156507953.jpg',
    faqs: [
      {
        question: 'Does the AI change my product label or shape?',
        answer: 'Never! Your product is isolated by hand in Photoshop and composited onto the generated scene. Your real physical product remains 100% authentic and unaltered.'
      }
    ]
  },
  {
    id: 'srv-product-ads',
    slug: 'product-ads',
    title: 'High-Converting Product Ads',
    category: 'creative-services',
    categoryLabel: 'Creative Services',
    tagline: 'Thumb-stopping Meta, Google & Amazon Sponsored ad banners',
    description: 'Drive profitable ROAS with ad creatives designed to stop the infinite scroll. Tested headline hooks, urgency badges, social proof quotes, and strong CTA buttons.',
    features: [
      'Multi-size export: Square (1:1), Stories/Reels (9:16), Landscape (1.91:1), Amazon Sponsored Display',
      'Attention-grabbing visual hierarchy engineered for low Cost-Per-Click (CPC)',
      'Clear offer framing (Discounts, Buy 1 Get 1, Limited Edition, Free Shipping)',
      'A/B test ready with headline and color variations'
    ],
    deliveryTime: '24 Hours',
    turnaroundHours: 24,
    startingPrice: 799,
    fileFormats: ['JPG', 'PNG', 'Layered PSD / Figma'],
    supportedMarketplaces: ['Meta Ads (FB/IG)', 'Google Display', 'Amazon Ads', 'Pinterest'],
    revisionPolicy: 'Copy and layout adjustments included.',
    beforeImageUrl: '/src/assets/images/marketplace_sneaker_lifestyle_1790156519357.jpg',
    afterImageUrl: '/src/assets/images/marketplace_sneaker_lifestyle_1790156519357.jpg',
    faqs: [
      {
        question: 'Can you deliver both static image ads and carousel cards?',
        answer: 'Yes! We create standalone ad visuals as well as sequential multi-card carousel campaigns.'
      }
    ]
  },
  {
    id: 'srv-social-creatives',
    slug: 'social-creatives',
    title: 'Social Media Product Creatives',
    category: 'creative-services',
    categoryLabel: 'Creative Services',
    tagline: 'Cohesive Instagram, LinkedIn, and Facebook aesthetic feeds for D2C brands',
    description: 'Keep your social feed looking like an elite luxury brand. Curated post designs, carousel tutorials, customer review templates, and festival greeting graphics.',
    features: [
      'Cohesive visual aesthetic matching your brand palette and font guidelines',
      'Multi-slide Instagram carousels that boost save and share engagement metrics',
      'Customer testimonial and 5-star review spotlight graphics',
      'Festival sale promotions (Diwali, Holi, Independence Day, New Year)'
    ],
    deliveryTime: '24-48 Hours',
    turnaroundHours: 36,
    startingPrice: 1199,
    fileFormats: ['PNG', 'JPG', 'Canva Link or Layered PSD'],
    supportedMarketplaces: ['Instagram', 'Facebook', 'LinkedIn', 'Pinterest'],
    revisionPolicy: 'Free revisions on copy and imagery.',
    beforeImageUrl: '/src/assets/images/cosmetics_raw_1790156661714.jpg',
    afterImageUrl: '/src/assets/images/product_cosmetics_clean_1790156507953.jpg',
    faqs: [
      {
        question: 'Can you deliver editable Canva templates?',
        answer: 'Yes! We can provide both Photoshop master files and Canva editable links so your internal marketing team can adjust text on the fly.'
      }
    ]
  },
  {
    id: 'srv-packaging',
    slug: 'packaging',
    title: 'Packaging & Box Design',
    category: 'creative-services',
    categoryLabel: 'Creative Services',
    tagline: 'Dieline-accurate retail boxes, pouches, labels & 3D unboxing mockups',
    description: 'Create unforgettable unboxing experiences. We design dieline-accurate product boxes, stand-up zipper pouches, bottle labels, and photorealistic 3D renders.',
    features: [
      'Precision dieline alignment (Tuck-end boxes, rigid boxes, mailers, pouches, bottles)',
      'Regulatory compliance layout (FSSAI, Net Weight, MRP, Ingredients, Barcodes)',
      'Print-ready CMYK files with foil stamping, embossing, and spot UV layers',
      '3D photorealistic packshot renders for pre-launch marketplace testing'
    ],
    deliveryTime: '3-5 Days',
    turnaroundHours: 72,
    startingPrice: 2999,
    fileFormats: ['Vector AI (Print Dieline)', 'Print PDF (CMYK 300DPI)', '3D Render JPG'],
    supportedMarketplaces: ['Retail Shelves', 'E-Commerce Delivery', 'Amazon'],
    revisionPolicy: 'Iterative dieline and artwork revisions.',
    beforeImageUrl: '/src/assets/images/product_cosmetics_clean_1790156507953.jpg',
    afterImageUrl: '/src/assets/images/product_cosmetics_clean_1790156507953.jpg',
    faqs: [
      {
        question: 'Do you work directly with my box printing vendor?',
        answer: 'Yes! Send us the vendor’s blank dieline template (PDF/AI) and we will engineer the entire layout to match their exact fold and bleed tolerances.'
      }
    ]
  },
  {
    id: 'srv-logo-design',
    slug: 'logo-design',
    title: 'Logo Design',
    category: 'creative-services',
    categoryLabel: 'Creative Services',
    tagline: 'Memorable, trademarkable vector logos engineered for modern digital brands',
    description: 'Establish authority from day one. Custom vector logos crafted by senior identity designers with versatile horizontal, vertical, and icon favicon variations.',
    features: [
      '3 Distinct creative concepts based on your business vision',
      '100% Vector geometry (Infinitely scalable from 16px favicon to giant billboard)',
      'Dark mode, light mode, and single-color monochrome lockups',
      'Full copyright and commercial ownership transfer'
    ],
    deliveryTime: '48 Hours',
    turnaroundHours: 48,
    startingPrice: 1999,
    fileFormats: ['AI (Adobe Illustrator)', 'SVG', 'EPS', 'PNG (Transparent)', 'PDF'],
    supportedMarketplaces: ['Global Digital & Physical Branding'],
    revisionPolicy: '3 rounds of design refinement on selected concept.',
    beforeImageUrl: '/src/assets/images/designer_studio_workplace_1790156530624.jpg',
    afterImageUrl: '/src/assets/images/designer_studio_workplace_1790156530624.jpg',
    faqs: [
      {
        question: 'Do I get full ownership and copyright of the logo?',
        answer: 'Yes, 100%. Upon project completion, all intellectual property rights belong entirely to you with vector source files.'
      }
    ]
  },
  {
    id: 'srv-brand-identity',
    slug: 'brand-identity',
    title: 'Logo & Brand Identity',
    category: 'creative-services',
    categoryLabel: 'Creative Services',
    tagline: 'Complete comprehensive brand book: Typography, colors, patterns & assets',
    description: 'Transform your business into a recognizable, trusted consumer brand. Comprehensive brand guidelines, custom color palettes, typography hierarchy, and business collateral.',
    features: [
      'Complete Brand Style Guide PDF (Logo rules, clear space, minimum sizing)',
      'Primary & secondary color palette with HEX, RGB, CMYK, and Pantone codes',
      'Curated font pairing recommendations for web, mobile, and print',
      'Stationery suite: Business card, letterhead, email signature, envelope',
      'Social media avatar and header banner kit'
    ],
    deliveryTime: '4-6 Days',
    turnaroundHours: 96,
    startingPrice: 4999,
    fileFormats: ['Brand Guide PDF', 'Vector AI', 'SVG', 'PNG', 'PSD'],
    supportedMarketplaces: ['Complete Brand Ecosystem'],
    revisionPolicy: 'Collaborative revision rounds.',
    beforeImageUrl: '/src/assets/images/designer_studio_workplace_1790156530624.jpg',
    afterImageUrl: '/src/assets/images/designer_studio_workplace_1790156530624.jpg',
    faqs: [
      {
        question: 'What is included in the Brand Style Guide PDF?',
        answer: 'The brand guide defines clear space rules, correct logo usage, color hierarchy, font pairings, visual tone of voice, and guidelines for external marketing partners.'
      }
    ]
  },
];

export const SERVICE_CATEGORIES = [
  { id: 'all', label: 'All Services', icon: 'Sparkles' },
  { id: 'product-editing', label: 'Product Image Editing', icon: 'Scissors' },
  { id: 'marketplace-design', label: 'Marketplace Design', icon: 'ShoppingBag' },
  { id: 'listing-design', label: 'Listing Design', icon: 'Layout' },
  { id: 'creative-services', label: 'Creative Services', icon: 'Palette' },
] as const;

export const MARKETPLACE_LOGOS = [
  { name: 'Amazon', badge: 'Amazon India & Global', color: 'from-amber-500 to-orange-600', icon: 'ShoppingBag' },
  { name: 'Flipkart', badge: 'Flipkart Seller Hub', color: 'from-blue-500 to-indigo-600', icon: 'Store' },
  { name: 'Myntra', badge: 'Myntra Fashion Studio', color: 'from-pink-500 to-rose-600', icon: 'Shirt' },
  { name: 'Meesho', badge: 'Meesho Reseller Partner', color: 'from-purple-500 to-pink-600', icon: 'Zap' },
  { name: 'Shopify', badge: 'Shopify D2C Brands', color: 'from-emerald-500 to-teal-600', icon: 'Globe' },
  { name: 'Nykaa', badge: 'Nykaa Beauty Standards', color: 'from-rose-400 to-red-500', icon: 'Sparkles' },
];

export const HOW_IT_WORKS_STEPS = [
  {
    step: '01',
    title: 'Upload Product Images',
    description: 'Drop your raw camera photos, smartphone clicks, or 3D renders. We accept JPG, PNG, WEBP, PSD, and ZIP archives up to 2GB.',
    icon: 'UploadCloud',
    highlight: 'Instant File Drop'
  },
  {
    step: '02',
    title: 'Select Service & Specs',
    description: 'Choose your desired service, specify target marketplace (Amazon, Flipkart, etc.), dimensions, background, and custom notes.',
    icon: 'Sliders',
    highlight: 'Tailored to Marketplaces'
  },
  {
    step: '03',
    title: 'Senior Designers Edit & QA',
    description: 'Certified Photoshop master retouchers hand-craft your visuals. Every single file passes through strict multi-point Quality Assurance.',
    icon: 'Layers',
    highlight: 'Certified Retouchers'
  },
  {
    step: '04',
    title: 'Review, Annotate & Download',
    description: 'Compare side-by-side Before/After in our client portal. Approve with 1 click or drop visual revision pins. Download high-res master files.',
    icon: 'CheckCircle2',
    highlight: 'Unlimited Revisions'
  }
];

export const PORTFOLIO_CATEGORIES = [
  { id: 'all', label: 'All' },
  { id: 'white-background', label: 'White Background' },
  { id: 'background-removal', label: 'Background Removal' },
  { id: 'masking', label: 'Masking' },
  { id: 'natural-shadow', label: 'Natural Shadow' },
  { id: 'retouching', label: 'Retouching' },
  { id: 'jewellery', label: 'Jewellery' },
  { id: 'amazon', label: 'Amazon' },
  { id: 'lifestyle', label: 'Lifestyle' },
  { id: 'infographics', label: 'Infographics' },
  { id: 'bulk-editing', label: 'Bulk Editing' },
];

export interface StudioPortfolioProject {
  id: string;
  title: string;
  category: string;
  categorySlug: string;
  marketplace: string;
  servicesUsed: string[];
  description: string;
  turnaround: string;
  beforeUrl: string;
  afterUrl: string;
  finalMarketplaceUrl?: string;
  results?: string;
  retouchPoints?: string[];
}

export const PORTFOLIO_PROJECTS: StudioPortfolioProject[] = [
  {
    id: 'case-01',
    title: 'White Background Transformation',
    category: 'White Background',
    categorySlug: 'white-background',
    marketplace: 'Amazon India',
    servicesUsed: ['Pure White RGB 255', '85% Frame Fill', 'Edge Anti-Aliasing', 'Drop Shadow'],
    turnaround: '12 Hours',
    beforeUrl: '/src/assets/images/cosmetics_raw_1790156661714.jpg',
    afterUrl: '/src/assets/images/product_cosmetics_clean_1790156507953.jpg',
    description: 'Transform cluttered camera snaps into certified RGB (255, 255, 255) pure white marketplace hero assets with grounded contact shadows.',
    results: '100% first-pass Amazon catalog approval and +32% click-through rate.',
    retouchPoints: ['Pure RGB 255 border', 'Specular highlights preserved', 'Realistic floor contact shadow']
  },
  {
    id: 'case-02',
    title: 'Background Removal & Pen-Tool Cutout',
    category: 'Background Removal',
    categorySlug: 'background-removal',
    marketplace: 'Flipkart & Meesho',
    servicesUsed: ['Hand Clipping Path', 'Transparent PNG', 'Clean Contours'],
    turnaround: '12 Hours',
    beforeUrl: '/src/assets/images/sneaker_raw_1790156678698.jpg',
    afterUrl: '/src/assets/images/marketplace_sneaker_lifestyle_1790156519357.jpg',
    description: 'Crisp bezier curve isolation separating intricate sole grooves and sneaker textures from busy background clutter.',
    results: 'Flawless edge transitions without halo effects or jagged edges.',
    retouchPoints: ['100% hand pen-tool isolation', 'Transparent alpha channel export', 'Lace and mesh edge preservation']
  },
  {
    id: 'case-03',
    title: 'Precision Masking & Fine Detail Extraction',
    category: 'Masking',
    categorySlug: 'masking',
    marketplace: 'Myntra Fashion',
    servicesUsed: ['Channel Masking', 'Hair & Fur Masking', 'Translucent Glass Extraction'],
    turnaround: '18 Hours',
    beforeUrl: '/src/assets/images/cosmetics_raw_1790156661714.jpg',
    afterUrl: '/src/assets/images/product_cosmetics_clean_1790156507953.jpg',
    description: 'Advanced alpha channel masking for transparent bottles, fine mesh fabrics, fuzzy textures, and complex outlines.',
    results: 'Clean separation of amber glass reflections without losing translucency.',
    retouchPoints: ['Color decontaminate on semi-transparent borders', 'Dynamic range recovery', 'Glass opacity layering']
  },
  {
    id: 'case-04',
    title: 'Natural Shadow & Reflection Crafting',
    category: 'Natural Shadow',
    categorySlug: 'natural-shadow',
    marketplace: 'Shopify & D2C',
    servicesUsed: ['Cast Shadow', 'Drop Shadow', 'Mirror Reflection'],
    turnaround: '12 Hours',
    beforeUrl: '/src/assets/images/hero_watch_raw_1790156645806.jpg',
    afterUrl: '/src/assets/images/hero_product_watch_edit_1790156495540.jpg',
    description: 'Realistic multidirectional ground shadows and soft surface bounce reflections that ground products naturally.',
    results: 'Eliminates floating cut-and-paste appearance for a high-end luxury feel.',
    retouchPoints: ['Ambient occlusion shadow at contact point', 'Feathered penumbra falloff', 'Reflective surface mirror sheen']
  },
  {
    id: 'case-05',
    title: 'Product Cleanup & Surface Flaw Retouch',
    category: 'Retouching',
    categorySlug: 'retouching',
    marketplace: 'Amazon & Flipkart',
    servicesUsed: ['Scratch Removal', 'Micro Dust Cleanup', 'Seam Line Smoothing'],
    turnaround: '24 Hours',
    beforeUrl: '/src/assets/images/hero_watch_raw_1790156645806.jpg',
    afterUrl: '/src/assets/images/hero_product_watch_edit_1790156495540.jpg',
    description: '400% zoom digital restoration erasing manufacturing seams, fingerprint oils, lint fibers, and packaging scuffs.',
    results: 'Pristine factory-fresh look that enhances perceived value and customer trust.',
    retouchPoints: ['Frequency separation skin/metal retouching', 'Specular highlight balancing', 'Clean metallic luster']
  },
  {
    id: 'case-06',
    title: 'Jewellery Retouch & Gemstone Facet Brilliance',
    category: 'Jewellery',
    categorySlug: 'jewellery',
    marketplace: 'Tanishq, CaratLane & D2C',
    servicesUsed: ['Diamond Facet Sparkle', 'Gold Polish & Reflection Removal', 'Micro Focus Stacking'],
    turnaround: '24 Hours',
    beforeUrl: '/src/assets/images/jewellery_ring_raw_1790157380054.jpg',
    afterUrl: '/src/assets/images/jewellery_ring_edit_1790157394576.jpg',
    description: 'High-end fine jewellery retouching: Gold reflections smoothed, diamond facets brightened, prong alignment, and flawless sparkle.',
    results: 'Diamond brilliance amplified with zero camera glare or color bleed.',
    retouchPoints: ['Prong alignment and symmetry check', 'Diamond fire & brilliance enhancement', 'Uniform gold alloy coloration']
  },
  {
    id: 'case-07',
    title: 'Amazon Hero Image Compliance',
    category: 'Amazon',
    categorySlug: 'amazon',
    marketplace: 'Amazon India & Global',
    servicesUsed: ['RGB 255 Background', '85%+ Frame Fill', '2000x2000 300DPI'],
    turnaround: '12 Hours',
    beforeUrl: '/src/assets/images/hero_watch_raw_1790156645806.jpg',
    afterUrl: '/src/assets/images/hero_product_watch_edit_1790156495540.jpg',
    description: 'Strict Amazon Seller Central compliance: Center alignment, pure white backdrop, active hover-zoom resolution, no watermarks or borders.',
    results: 'Eliminated listing suppression and unlocked maximum organic search rank.',
    retouchPoints: ['Amazon algorithm optimized', 'Zero border halo artifacts', 'High-res active hover-zoom ready']
  },
  {
    id: 'case-08',
    title: 'Lifestyle Product Visual Placement',
    category: 'Lifestyle',
    categorySlug: 'lifestyle',
    marketplace: 'Shopify & Meta Ads',
    servicesUsed: ['Aspirational Environment', 'Perspective Matching', 'Bounce Lighting'],
    turnaround: '24-36 Hours',
    beforeUrl: '/src/assets/images/sneaker_raw_1790156678698.jpg',
    afterUrl: '/src/assets/images/marketplace_sneaker_lifestyle_1790156519357.jpg',
    description: 'Contextual composite placing the isolated item into an aspirational modern environment matching ambient light temperature.',
    results: '2.4x higher click-through rate on Instagram/Facebook Sponsored Ads.',
    retouchPoints: ['Light perspective convergence', 'Realistic environmental color spill', 'Natural surface contact texture']
  },
  {
    id: 'case-09',
    title: 'Product Infographic & Feature Highlights',
    category: 'Infographics',
    categorySlug: 'infographics',
    marketplace: 'Amazon & Flipkart',
    servicesUsed: ['Feature Badges', 'Dimension Callouts', 'Material Breakdown'],
    turnaround: '24 Hours',
    beforeUrl: '/src/assets/images/cosmetics_raw_1790156661714.jpg',
    afterUrl: '/src/assets/images/product_cosmetics_clean_1790156507953.jpg',
    description: 'Visual storytelling graphics with clean typography, dimension arrows, key benefit callouts, and ingredient highlights.',
    results: 'Significantly reduced pre-purchase questions and return rates.',
    retouchPoints: ['Vector benefit callouts', 'Mobile-first legible typography', 'Brand color matched accents']
  },
  {
    id: 'case-10',
    title: 'Bulk Catalog Transformation (50+ SKUs)',
    category: 'Bulk Editing',
    categorySlug: 'bulk-editing',
    marketplace: 'Marketplace Enterprise Catalogs',
    servicesUsed: ['Batch Photoshop Actions', 'Uniform Scale & Margin', 'Consistent File Naming'],
    turnaround: '24-48 Hours',
    beforeUrl: '/src/assets/images/sneaker_raw_1790156678698.jpg',
    afterUrl: '/src/assets/images/marketplace_sneaker_lifestyle_1790156519357.jpg',
    description: 'Production-line catalog harmonization ensuring all colorways and variations share the exact same scale, angle, and lighting.',
    results: 'Seamless aesthetic across the whole brand storefront.',
    retouchPoints: ['Standardized SKU file naming', 'Uniform crop ratio and margins', 'Strict color temperature calibration']
  }
];

export const PORTFOLIO_SHOWCASE = PORTFOLIO_PROJECTS;

export interface FAQItem {
  id: string;
  category: string;
  question: string;
  answer: string;
}

export const FAQ_ITEMS: FAQItem[] = [
  {
    id: 'faq-1',
    category: 'Marketplace Compliance',
    question: 'How do you guarantee our product images will pass Amazon India & Flipkart QC?',
    answer: 'Every main listing image is created on pure RGB (255, 255, 255) background, cropped to Amazon’s mandatory 85%+ product fill requirement, exported at 2000×2000px at 300 DPI for active zoom, and audited for zero border artifacts before client signoff.'
  },
  {
    id: 'faq-2',
    category: 'Workflow & Revisions',
    question: 'What happens if we need adjustments or color tweaks after receiving our proofs?',
    answer: 'We provide unlimited free revisions until 100% satisfaction. Using our interactive Client Review Portal, you can click on any proof, drop visual pins with exact notes, and our designers update the master files within 4 to 12 hours.'
  },
  {
    id: 'faq-3',
    category: 'Turnaround Time',
    question: 'How fast is your studio turnaround for standard catalog batches?',
    answer: 'Standard projects of 1 to 20 images are delivered in 12 to 24 hours. For urgent same-day marketplace launches, we offer 6-hour Rush Delivery. Bulk catalog batches (50 to 500+ SKUs) are delivered in rolling batches daily.'
  },
  {
    id: 'faq-4',
    category: 'File Deliverables',
    question: 'What file formats and source files do we receive upon final project completion?',
    answer: 'You receive high-resolution JPGs (optimized for web loading without compression artifacts), transparent background PNGs, and fully layered Adobe Photoshop (PSD) master files with organized layer groups and clipping paths.'
  },
  {
    id: 'faq-5',
    category: 'Pricing & Bulk Discounts',
    question: 'Do you offer volume catalog discounts for sellers with hundreds of SKUs?',
    answer: 'Yes! Our dynamic volume calculator automatically scales down per-image rates by up to 40% for bulk batches of 50, 100, or 250+ images. We also offer dedicated monthly retainer plans for high-growth D2C brands.'
  },
  {
    id: 'faq-6',
    category: 'Payment & Invoicing',
    question: 'Can we get a GST invoice with input tax credit for our Indian registered business?',
    answer: 'Yes, 100%. We provide official B2B GST tax invoices for all studio orders placed through our platform. Simply enter your company name and GSTIN number during checkout.'
  }
];

export interface PackageTier {
  id: string;
  name: string;
  tagline: string;
  pricePerImage: number;
  volumeRange: string;
  isPopular?: boolean;
  features: string[];
}

export const PACKAGE_TIERS: PackageTier[] = [
  {
    id: 'pkg-starter',
    name: 'Starter / Micro Batch',
    tagline: 'Ideal for new sellers and single-product launches',
    pricePerImage: 79,
    volumeRange: '1 to 20 Images',
    isPopular: false,
    features: [
      'Pure White RGB (255,255,255) Isolation',
      'Realistic Drop or Reflection Shadow',
      'Basic Dust & Blemish Retouching',
      'Amazon & Flipkart QC Check',
      '24-Hour Standard Turnaround',
      'Unlimited Revisions'
    ]
  },
  {
    id: 'pkg-growth',
    name: 'Growth Catalog Suite',
    tagline: 'Best value for growing D2C brands & Amazon sellers',
    pricePerImage: 49,
    volumeRange: '21 to 100 Images',
    isPopular: true,
    features: [
      'Everything in Starter Tier',
      'Pen-tool Clipping Path + High-end Retouch',
      'Color Matching & Symmetry Correction',
      'Infographic Feature Callouts Included',
      '12-Hour Priority SLA Turnaround',
      'Dedicated Retoucher & WhatsApp Slack Sync'
    ]
  },
  {
    id: 'pkg-enterprise',
    name: 'Enterprise Bulk Volume',
    tagline: 'For seasonal fashion catalogs & marketplace agencies',
    pricePerImage: 39,
    volumeRange: '100+ Images Monthly',
    isPopular: false,
    features: [
      'Deep Bulk Discount (₹39/image)',
      'Layered PSDs & WebP Multi-Size Exports',
      'Complex Model Masking & Mannequin Edit',
      'A+ Content Modular Layout Support',
      'Dedicated Account Creative Lead',
      'B2B Monthly GST Invoicing & Net-30 Terms'
    ]
  }
];


