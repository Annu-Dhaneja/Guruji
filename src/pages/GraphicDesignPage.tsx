import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Sparkles,
  Zap,
  Search,
  CheckCircle2,
  Star,
  Clock,
  ShoppingBag,
  MessageCircle,
  Share2,
  Film,
  Briefcase,
  Megaphone,
  Video,
  Image as ImageIcon,
  Flame,
  ArrowRight,
  Filter,
  FileCheck,
  ShieldCheck,
  Award,
  Layers,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  RotateCcw,
  X,
} from 'lucide-react';
import {
  GRAPHIC_DESIGN_SERVICES,
  GRAPHIC_DESIGN_CATEGORIES,
  GRAPHIC_DESIGN_MAIN_CATEGORIES,
  DELIVERY_SPEED_TIERS,
  GraphicDesignService,
} from '../data/graphicDesignData';
import { GraphicDesignCategory } from '../types';
import { GraphicDesignMarquee } from '../components/graphic-design/GraphicDesignMarquee';
import { GraphicDesignDetailModal } from '../components/graphic-design/GraphicDesignDetailModal';
import { GraphicDesignInquiryModal } from '../components/graphic-design/GraphicDesignInquiryModal';
import { useCart } from '../context/CartContext';

interface GraphicDesignPageProps {
  onNavigate?: (page: string, slug?: string) => void;
  initialCategory?: string;
  initialInquirySlug?: string;
}

export const GraphicDesignPage: React.FC<GraphicDesignPageProps> = ({
  onNavigate,
  initialCategory,
  initialInquirySlug,
}) => {
  const { addItem } = useCart();

  // Dynamic services loaded from server with fallback to initial static set
  const [allServices, setAllServices] = useState<GraphicDesignService[]>(GRAPHIC_DESIGN_SERVICES);

  // Dynamic categories loaded from server with fallback to initial 13 default categories
  const [allCategories, setAllCategories] = useState<GraphicDesignCategory[]>(GRAPHIC_DESIGN_MAIN_CATEGORIES);

  useEffect(() => {
    // 1. Fetch dynamic services
    fetch('/api/graphic-design/services')
      .then((res) => {
        if (res.ok) return res.json();
        throw new Error('Failed to load services');
      })
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setAllServices(data);
        }
      })
      .catch((err) => {
        console.warn('Using local fallback graphic design services:', err);
      });

    // 2. Fetch dynamic categories from Admin Dashboard
    fetch('/api/graphic-design/categories')
      .then((res) => {
        if (res.ok) return res.json();
        throw new Error('Failed to load categories');
      })
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setAllCategories(data);
        }
      })
      .catch((err) => {
        console.warn('Using local fallback graphic design categories:', err);
      });
  }, []);

  // Category slug normalizer
  const normalizeCategory = (slug?: string) => {
    if (!slug) return 'all';
    const s = slug.toLowerCase();
    if (s.includes('social') || s === 'social-media' || s === 'social-media-post-design') return 'social-media-post-design';
    if (s.includes('logo') || s === 'logo-design') return 'logo-design';
    if (s.includes('banner') || s === 'banner-design') return 'banner-design';
    if (s.includes('t-shirt') || s.includes('shirt') || s === 't-shirt-design') return 't-shirt-design';
    if (s.includes('mug') || s === 'mug-design') return 'mug-design';
    if (s.includes('cap') || s === 'cap-design') return 'cap-design';
    if (s.includes('thumb') || s === 'thumbnail-design') return 'thumbnail-design';
    if (s.includes('resume') || s.includes('cv') || s === 'resume-cv-design') return 'resume-cv-design';
    if (s.includes('pres') || s.includes('ppt') || s === 'presentation-ppt-design') return 'presentation-ppt-design';
    if (s.includes('coll') || s === 'photo-collage-design') return 'photo-collage-design';
    if (s.includes('pack') || s === 'package-design') return 'package-design';
    if (s.includes('card') || s === 'business-card-design') return 'business-card-design';
    if (s.includes('letter') || s === 'letterhead-design') return 'letterhead-design';
    return s;
  };

  // State
  const [selectedCategory, setSelectedCategory] = useState<string>(() => normalizeCategory(initialCategory));
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [priceFilter, setPriceFilter] = useState<'all' | 'under100' | 'under500' | 'under1000' | 'express' | 'popular'>('all');
  
  // Modals state (fallback)
  const [selectedServiceForDetail, setSelectedServiceForDetail] = useState<GraphicDesignService | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedServiceForInquiry, setSelectedServiceForInquiry] = useState<GraphicDesignService | null>(null);
  const [inquiryModalMode, setInquiryModalMode] = useState<'inquiry' | 'quote'>('inquiry');
  const [isInquiryModalOpen, setIsInquiryModalOpen] = useState(false);

  // Synchronize initial category or hash
  useEffect(() => {
    if (initialCategory) {
      setSelectedCategory(normalizeCategory(initialCategory));
    }
  }, [initialCategory]);

  // Handle inquiry prefill if inquiry slug is passed
  useEffect(() => {
    if (initialInquirySlug && allServices.length > 0) {
      const cleanSlug = initialInquirySlug.replace(/^inquiry-/, '');
      const found = allServices.find(
        (s) =>
          s.slug === cleanSlug ||
          s.id === cleanSlug ||
          s.category === cleanSlug ||
          s.title.toLowerCase().includes(cleanSlug.toLowerCase())
      );
      if (found) {
        setSelectedServiceForInquiry(found);
      } else {
        // Fallback synthetic service for category inquiry
        const matchedCat = allCategories.find((c) => c.slug === normalizeCategory(cleanSlug) || c.id === cleanSlug);
        if (matchedCat) {
          setSelectedServiceForInquiry({
            id: `cat-inq-${cleanSlug}`,
            slug: cleanSlug,
            title: `${matchedCat.name} Custom Inquiry`,
            category: matchedCat.slug as any,
            categoryName: matchedCat.name,
            shortDescription: matchedCat.tagline || 'Custom graphic design project tailored to your business needs.',
            fullDescription: matchedCat.description || matchedCat.tagline || '',
            startingPrice: matchedCat.startingPrice || 149,
            originalPrice: 299,
            rating: 5,
            reviewsCount: 20,
            completedOrders: 50,
            standardDeliveryTime: '24 Hours',
            fastestDeliveryTime: '10 min',
            revisions: 'Unlimited',
            fileFormats: ['PNG', 'JPG', 'PDF'],
            dimensions: 'Standard Custom Size',
            imageUrl: matchedCat.imageUrl || 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&w=800&q=80',
            gallery: [],
            packages: [],
            whatsIncluded: [],
            whatsNotIncluded: [],
            faqs: [],
            reviews: [],
          });
        }
      }
      setInquiryModalMode('inquiry');
      setIsInquiryModalOpen(true);
    }
  }, [initialInquirySlug, allServices, allCategories]);

  // Navigate to dedicated product page with unique URL
  const handleNavigateToProduct = (service: GraphicDesignService) => {
    if (onNavigate) {
      onNavigate('product-detail', service.slug);
    } else {
      window.location.hash = `/product/${service.slug}`;
    }
  };

  // Accordion for FAQs
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  // Dynamic Categories navigation tabs generated from allCategories (Admin CMS & database)
  const categoryNavItems = useMemo(() => {
    const list = [
      { id: 'all', name: 'All', iconName: 'Sparkles', count: allServices.length },
      ...allCategories.map((c) => ({
        id: c.slug || c.id,
        name: c.name.replace(' Design', '').trim(),
        fullName: c.name,
        iconName: c.icon || 'Sparkles',
        count: allServices.filter(
          (s) =>
            s.category === c.slug ||
            s.category === c.id ||
            s.categoryName === c.name ||
            (c.slug && s.slug.includes(c.slug.replace('-design', '')))
        ).length || 8,
      })),
    ];
    return list;
  }, [allCategories, allServices]);

  // Filtered Services calculation
  const filteredServices = useMemo(() => {
    return allServices.filter((service) => {
      // Category filter matching
      let matchesCategory = selectedCategory === 'all';
      if (!matchesCategory) {
        const cat = selectedCategory.toLowerCase();
        const srvCat = (service.category || '').toLowerCase();
        const srvCatName = (service.categoryName || '').toLowerCase();
        const srvSlug = (service.slug || '').toLowerCase();
        const srvTitle = (service.title || '').toLowerCase();

        matchesCategory =
          srvCat === cat ||
          srvCatName.includes(cat) ||
          (cat.includes('logo') && (srvSlug.includes('logo') || srvTitle.includes('logo'))) ||
          (cat.includes('banner') && (srvSlug.includes('banner') || srvTitle.includes('banner') || srvSlug.includes('standee'))) ||
          (cat.includes('social') && (srvSlug.includes('social') || srvSlug.includes('instagram') || srvCat.includes('social'))) ||
          (cat.includes('t-shirt') && (srvSlug.includes('t-shirt') || srvTitle.includes('t-shirt'))) ||
          (cat.includes('mug') && (srvSlug.includes('mug') || srvTitle.includes('mug'))) ||
          (cat.includes('cap') && (srvSlug.includes('cap') || srvTitle.includes('cap'))) ||
          (cat.includes('thumb') && (srvSlug.includes('thumbnail') || srvTitle.includes('thumbnail'))) ||
          (cat.includes('resume') && (srvSlug.includes('resume') || srvTitle.includes('resume') || srvSlug.includes('cv'))) ||
          (cat.includes('pres') && (srvSlug.includes('presentation') || srvTitle.includes('pitch') || srvSlug.includes('ppt'))) ||
          (cat.includes('coll') && (srvSlug.includes('collage') || srvTitle.includes('collage'))) ||
          (cat.includes('pack') && (srvSlug.includes('pack') || srvTitle.includes('pack'))) ||
          (cat.includes('card') && (srvSlug.includes('card') || srvTitle.includes('visiting') || srvSlug.includes('business'))) ||
          (cat.includes('letter') && (srvSlug.includes('letter') || srvTitle.includes('letter')));
      }

      // Search query filter
      const matchesSearch =
        searchQuery === '' ||
        service.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        service.shortDescription.toLowerCase().includes(searchQuery.toLowerCase()) ||
        service.categoryName.toLowerCase().includes(searchQuery.toLowerCase());

      // Price and special tags filter
      let matchesPrice = true;
      if (priceFilter === 'under100') {
        matchesPrice = service.startingPrice <= 100;
      } else if (priceFilter === 'under500') {
        matchesPrice = service.startingPrice <= 500;
      } else if (priceFilter === 'under1000') {
        matchesPrice = service.startingPrice <= 1000;
      } else if (priceFilter === 'express') {
        matchesPrice = !!service.expressAvailable;
      } else if (priceFilter === 'popular') {
        matchesPrice = !!service.popular;
      }

      return matchesCategory && matchesSearch && matchesPrice;
    });
  }, [allServices, selectedCategory, searchQuery, priceFilter]);

  const handleOpenDetail = (service: GraphicDesignService) => {
    setSelectedServiceForDetail(service);
    setIsDetailModalOpen(true);
  };

  const handleOpenInquiry = (service: GraphicDesignService | null, mode: 'inquiry' | 'quote' = 'inquiry') => {
    setSelectedServiceForInquiry(service);
    setInquiryModalMode(mode);
    setIsInquiryModalOpen(true);
  };

  const handleQuickOrder = (service: GraphicDesignService) => {
    const defaultPackage = service.packages.find((p) => p.popular) || service.packages[0];
    addItem({
      itemId: `${service.id}-${defaultPackage.id}`,
      itemType: 'service',
      name: `${service.title} (${defaultPackage.name})`,
      price: defaultPackage.price,
      quantity: 1,
    });
  };

  // Helper icon lookup
  const getCategoryIcon = (iconName: string) => {
    switch (iconName) {
      case 'Share2':
        return <Share2 className="w-4 h-4" />;
      case 'Film':
        return <Film className="w-4 h-4" />;
      case 'Briefcase':
        return <Briefcase className="w-4 h-4" />;
      case 'Megaphone':
        return <Megaphone className="w-4 h-4" />;
      case 'ShoppingBag':
        return <ShoppingBag className="w-4 h-4" />;
      case 'Video':
        return <Video className="w-4 h-4" />;
      case 'Image':
        return <ImageIcon className="w-4 h-4" />;
      default:
        return <Sparkles className="w-4 h-4" />;
    }
  };

  const generalFaqs = [
    {
      q: 'How fast can I get my design delivered?',
      a: 'We offer ultra-fast delivery options starting from 10 Minutes Instant for templates & photo cutouts, 1-Hour Express for social media posts, and Same-Day delivery for full marketing materials.',
    },
    {
      q: 'Do I get editable source files (AI, PSD, SVG)?',
      a: 'Yes! All our packages deliver high-resolution transparent PNG/JPG outputs along with complete editable Adobe Illustrator (AI), Photoshop (PSD), and SVG source files.',
    },
    {
      q: 'How many revisions can I request?',
      a: 'We offer unlimited revisions on most Pro and Business packages until you are 100% satisfied with your final artwork.',
    },
    {
      q: 'Can I request a custom package or monthly retainer?',
      a: 'Absolutely. Click "Get Custom Quote" or chat directly on WhatsApp to get tailored volume discounts for agencies, creators, and corporate brands.',
    },
    {
      q: 'Can I inquire before making any payment?',
      a: 'Yes! Every service has an "Inquiry Now" option where you can submit your project brief and sample assets. Our team will review and quote your project before you pay.',
    },
  ];

  return (
    <div className="min-h-screen bg-transparent text-[#102A36] dark:text-[#F4F8F8] transition-colors duration-300">
      
      {/* 1. HERO SECTION */}
      <section className="relative pt-12 pb-14 px-4 sm:px-6 lg:px-8 overflow-hidden bg-transparent border-b border-[#DCE7E7]/60 dark:border-[#243338]">
        {/* Ambient Teal & Peach Glow */}
        <div className="absolute top-0 right-1/4 w-[500px] h-[300px] bg-gradient-to-b from-[#DDF3F4]/40 via-[#FDE2DE]/30 to-transparent blur-3xl pointer-events-none" />

        <div className="max-w-6xl mx-auto text-center space-y-6 relative z-10">
          
          {/* USP Pill Badge */}
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-[#DDF3F4] dark:bg-[#173D40] text-[#087581] dark:text-[#25B4BD] border border-[#0799A6]/30 text-xs font-black tracking-wider uppercase shadow-2xs">
            <Sparkles className="w-4 h-4 text-[#0799A6] animate-pulse" />
            <span>Affordable Design • Fast Delivery • Professional Quality</span>
          </div>

          {/* Main Headline strictly matching user prompt */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-[#102A36] dark:text-[#F4F8F8] max-w-4xl mx-auto leading-tight">
            Professional Graphic Design Services
          </h1>

          {/* Subheading strictly matching user prompt */}
          <p className="text-base sm:text-lg text-[#52636A] dark:text-[#B7C6C8] max-w-2xl mx-auto font-medium leading-relaxed">
            Transform your ideas into premium, professional designs.
          </p>

          {/* Buttons strictly matching user prompt: Explore Services & View Packages */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <a
              href="#catalog-section"
              className="px-6 py-3.5 rounded-2xl btn-primary-cta text-white font-bold text-sm flex items-center space-x-2 shadow-md transition-all hover:scale-103 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-[#FDE2DE]" />
              <span>Explore Services</span>
            </a>

            <a
              href="#catalog-section"
              onClick={() => setPriceFilter('popular')}
              className="px-6 py-3.5 rounded-2xl bg-[#FFFFFF] dark:bg-[#182429] border border-[#F5A39A] hover:bg-[#FDE2DE] dark:hover:bg-[#111A1E] text-[#D9777F] dark:text-[#F2A39A] font-bold text-sm flex items-center space-x-2 shadow-xs transition-all hover:scale-103 cursor-pointer"
            >
              <Layers className="w-4 h-4 text-[#F5A39A]" />
              <span>View Packages</span>
            </a>

            <a
              href="https://wa.me/918527837527?text=Hello%20Annu%20Dhaneja,%20I%20want%20to%20inquire%20about%20Graphic%20Design%20services"
              target="_blank"
              rel="noreferrer"
              className="px-5 py-3.5 rounded-2xl bg-[#25D366]/15 hover:bg-[#25D366]/25 border border-[#25D366]/40 text-emerald-700 dark:text-emerald-400 font-bold text-sm flex items-center space-x-2 transition-colors cursor-pointer"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Chat on WhatsApp</span>
            </a>
          </div>

          {/* Professional Search Bar: "Search design services..." */}
          <div className="max-w-xl mx-auto pt-3 relative">
            <Search className="w-4 h-4 text-[#819396] absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search design services..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-10 py-3 rounded-2xl bg-[#FFFFFF] dark:bg-[#182429] border-2 border-[#DCE7E7] dark:border-[#2A3C40] text-xs sm:text-sm text-[#102A36] dark:text-[#F4F8F8] placeholder-[#819396] focus:outline-none focus:border-[#0799A6] shadow-2xs transition-colors font-medium"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white p-1"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Category Navigation Dynamically Generated from Admin Dashboard */}
          <div className="pt-2">
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2.5">
              Browse Categories
            </div>
            <div className="flex flex-wrap items-center justify-center gap-1.5 max-w-4xl mx-auto">
              {categoryNavItems.map((cat) => {
                const isActive = selectedCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => {
                      setSelectedCategory(cat.id);
                      const el = document.getElementById('catalog-section');
                      if (el) el.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all flex items-center space-x-1.5 cursor-pointer ${
                      isActive
                        ? 'bg-[#0799A6] text-white shadow-md shadow-[#0799A6]/25 scale-103'
                        : 'bg-[#FFFFFF] dark:bg-[#182429] text-[#52636A] dark:text-[#B7C6C8] border border-[#DCE7E7] dark:border-[#2A3C40] hover:border-[#0799A6] hover:text-[#0799A6]'
                    }`}
                  >
                    <span>{cat.name}</span>
                    <span
                      className={`px-1.5 py-0.2 rounded-full text-[9px] font-black ${
                        isActive ? 'bg-white/25 text-white' : 'bg-[#F8FAFA] dark:bg-[#111A1E] text-slate-400'
                      }`}
                    >
                      {cat.count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Delivery Speed Highlight Badges */}
          <div className="pt-4 grid grid-cols-2 sm:grid-cols-5 gap-3 max-w-4xl mx-auto">
            {DELIVERY_SPEED_TIERS.map((tier) => (
              <div
                key={tier.id}
                className="p-2.5 rounded-2xl bg-[#FFFFFF] dark:bg-[#182429] border border-[#DCE7E7] dark:border-[#2A3C40] shadow-xs text-center space-y-1"
              >
                <div className="text-[11px] font-black text-[#0799A6] dark:text-[#25B4BD]">{tier.badge}</div>
                <div className="text-[10px] text-[#52636A] dark:text-[#819396] font-semibold">{tier.timeframe}</div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 2. INFINITE SCROLLING MARQUEE ANIMATION */}
      <GraphicDesignMarquee />

      {/* 3. MAIN CATALOG SECTION */}
      <section id="catalog-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
        
        {/* Search & Filter Header */}
        <div className="space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-black text-[#102A36] dark:text-[#F4F8F8] flex items-center space-x-2">
                <span>Explore Design Services</span>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#DDF3F4] text-[#087581] dark:bg-[#173D40] dark:text-[#25B4BD] border border-[#0799A6]/30 font-bold">
                  {filteredServices.length} Services
                </span>
              </h2>
              <p className="text-xs text-[#52636A] dark:text-[#B7C6C8]">
                Click any product to launch its dedicated 360° interactive view, customizable packages, and specifications.
              </p>
            </div>

            {/* In-catalog Quick Search */}
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 text-[#819396] absolute left-3.5 top-3.5" />
              <input
                type="text"
                placeholder="Search design services..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-[#FFFFFF] dark:bg-[#182429] border border-[#DCE7E7] dark:border-[#2A3C40] text-xs text-[#102A36] dark:text-[#F4F8F8] placeholder-[#819396] focus:outline-none focus:border-[#0799A6] shadow-2xs transition-colors"
              />
            </div>
          </div>

          {/* Animated Category Tabs */}
          <div className="flex space-x-2 overflow-x-auto pb-2 scrollbar-none">
            {categoryNavItems.map((cat) => {
              const isActive = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-4 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition-all flex items-center space-x-2 relative cursor-pointer ${
                    isActive
                      ? 'bg-[#0799A6] text-white shadow-md shadow-[#0799A6]/25'
                      : 'bg-[#FFFFFF] dark:bg-[#182429] text-[#52636A] dark:text-[#B7C6C8] border border-[#DCE7E7] dark:border-[#2A3C40] hover:border-[#0799A6] hover:text-[#0799A6]'
                  }`}
                >
                  {getCategoryIcon(cat.iconName)}
                  <span>{cat.name}</span>
                  <span
                    className={`px-1.5 py-0.5 rounded-full text-[10px] font-black ${
                      isActive ? 'bg-white/20 text-white' : 'bg-[#F8FAFA] dark:bg-[#111A1E] text-[#52636A] dark:text-[#819396]'
                    }`}
                  >
                    {cat.count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Price & Quick Filter Chips */}
          <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
            <span className="text-[#52636A] dark:text-[#819396] font-bold text-[11px] flex items-center space-x-1 mr-1">
              <Filter className="w-3.5 h-3.5 text-[#0799A6]" />
              <span>Filter:</span>
            </span>

            {[
              { id: 'all', label: 'All Prices' },
              { id: 'under100', label: '⚡ Under ₹100' },
              { id: 'under500', label: 'Under ₹500' },
              { id: 'under1000', label: 'Under ₹1,000' },
              { id: 'express', label: '🚀 10-Min Fast Delivery' },
              { id: 'popular', label: '🔥 Best Selling' },
            ].map((chip) => (
              <button
                key={chip.id}
                onClick={() => setPriceFilter(chip.id as any)}
                className={`px-3 py-1.5 rounded-xl font-semibold transition-all cursor-pointer ${
                  priceFilter === chip.id
                    ? 'bg-[#DDF3F4] text-[#087581] dark:bg-[#173D40] dark:text-[#25B4BD] border border-[#0799A6]/40 font-bold shadow-2xs'
                    : 'bg-[#FFFFFF] dark:bg-[#182429] text-[#52636A] dark:text-[#B7C6C8] border border-[#DCE7E7] dark:border-[#2A3C40] hover:text-[#102A36] dark:hover:text-[#F4F8F8]'
                }`}
              >
                {chip.label}
              </button>
            ))}
          </div>
        </div>

        {/* Dynamic Services Grid */}
        {filteredServices.length === 0 ? (
          <div className="text-center py-16 bg-[#FFFFFF] dark:bg-[#182429] rounded-3xl border border-[#DCE7E7] dark:border-[#2A3C40] space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-[#DDF3F4] text-[#0799A6] mx-auto flex items-center justify-center">
              <Search className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-[#102A36] dark:text-[#F4F8F8]">No design services matched your filters</h3>
            <p className="text-xs text-[#52636A] dark:text-[#B7C6C8] max-w-sm mx-auto">
              Try adjusting your search keywords or resetting price filters. Or request a custom quote directly!
            </p>
            <button
              onClick={() => {
                setSelectedCategory('all');
                setSearchQuery('');
                setPriceFilter('all');
              }}
              className="px-4 py-2 rounded-xl btn-primary-cta text-white font-bold text-xs cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredServices.map((srv) => (
              <div
                key={srv.id}
                className="group relative rounded-3xl bg-[#FFFFFF] dark:bg-[#182429] border border-[#DCE7E7] dark:border-[#2A3C40] hover:border-[#0799A6] dark:hover:border-[#25B4BD] overflow-hidden shadow-xs hover:shadow-lg transition-colors duration-200 flex flex-col justify-between"
              >
                {/* PRODUCT IMAGE STAGE: Card container remains completely flat & stable; ONLY product floats and elevates on hover */}
                <div
                  onClick={() => handleNavigateToProduct(srv)}
                  className="h-56 relative cursor-pointer bg-[#F8FAFA] dark:bg-[#111A1E] flex items-center justify-center p-6 overflow-hidden"
                >
                  {/* Dynamic Soft Radial Shadow underneath floating product */}
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-32 h-4 rounded-full bg-black/15 dark:bg-black/40 blur-md pointer-events-none transition-all duration-300 group-hover:w-36 group-hover:bg-black/25 dark:group-hover:bg-black/60" />

                  {/* Product Object: subtle floating animation, only product scales & lifts forward on hover */}
                  <div className="relative w-full h-full flex items-center justify-center animate-float-product-subtle">
                    <img
                      src={srv.imageUrl}
                      alt={srv.title}
                      referrerPolicy="no-referrer"
                      className="max-h-full max-w-full object-contain drop-shadow-md transition-transform duration-300 ease-out group-hover:scale-108 group-hover:-translate-y-1.5 group-hover:drop-shadow-2xl"
                    />
                  </div>
                  
                  {/* 360° Interactive Badge */}
                  <div className="absolute top-3 left-3 bg-[#FFFFFF]/90 dark:bg-[#182429]/90 backdrop-blur-md text-[#0799A6] dark:text-[#25B4BD] text-[10px] font-bold px-2.5 py-1 rounded-full border border-[#DCE7E7] dark:border-[#2A3C40] shadow-2xs flex items-center gap-1 pointer-events-none">
                    <RotateCcw className="w-3 h-3 text-[#0799A6] dark:text-[#25B4BD]" />
                    <span>360° Preview</span>
                  </div>

                  {/* Fast Delivery Badge */}
                  {srv.expressAvailable && (
                    <div className="absolute top-3 right-3 bg-[#F5A39A] text-[#102A36] text-[10px] font-black px-2.5 py-1 rounded-full shadow-2xs flex items-center space-x-1 pointer-events-none">
                      <Zap className="w-3 h-3 fill-current" />
                      <span>{srv.fastestDeliveryTime} Delivery</span>
                    </div>
                  )}

                  {/* Rating Overlay */}
                  <div className="absolute bottom-3 left-3 bg-[#FFFFFF]/90 dark:bg-[#182429]/90 backdrop-blur-md text-amber-500 text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center space-x-1 border border-[#DCE7E7]/80 dark:border-[#2A3C40]/80 shadow-2xs pointer-events-none">
                    <Star className="w-3 h-3 fill-current" />
                    <span>{srv.rating}</span>
                    <span className="text-[#52636A] dark:text-[#819396]">({srv.completedOrders || 45}+ done)</span>
                  </div>
                </div>

                {/* Card Content: Stable, minimal, clean typography */}
                <div className="p-5 space-y-4 flex-1 flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="text-[10px] font-extrabold uppercase tracking-wider text-[#0799A6] dark:text-[#25B4BD]">
                      {srv.categoryName}
                    </div>
                    <h3
                      onClick={() => handleNavigateToProduct(srv)}
                      className="text-base font-black text-[#102A36] dark:text-[#F4F8F8] line-clamp-1 hover:text-[#0799A6] dark:hover:text-[#25B4BD] transition-colors cursor-pointer"
                    >
                      {srv.title}
                    </h3>
                    <p className="text-xs text-[#52636A] dark:text-[#B7C6C8] line-clamp-2 leading-relaxed font-medium">
                      {srv.shortDescription}
                    </p>

                    {/* Features Snippet */}
                    <div className="pt-1 space-y-1">
                      {(srv.features || srv.whatsIncluded || []).slice(0, 2).map((item, idx) => (
                        <div key={idx} className="text-[11px] text-[#52636A] dark:text-[#B7C6C8] flex items-center space-x-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#0799A6] dark:text-[#25B4BD] shrink-0" />
                          <span className="line-clamp-1">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Bottom Price & Action Row */}
                  <div className="pt-4 border-t border-[#DCE7E7] dark:border-[#2A3C40] space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-[10px] text-[#52636A] dark:text-[#819396] font-bold uppercase tracking-wider block">
                          Starting Price
                        </span>
                        <div className="flex items-baseline space-x-1.5">
                          <span className="text-xl font-black text-[#0799A6] dark:text-[#25B4BD]">
                            ₹{srv.startingPrice}
                          </span>
                          {srv.originalPrice > srv.startingPrice && (
                            <span className="text-xs text-[#819396] line-through">₹{srv.originalPrice}</span>
                          )}
                        </div>
                      </div>

                      <button
                        onClick={() => handleNavigateToProduct(srv)}
                        className="text-xs font-bold text-[#0799A6] dark:text-[#25B4BD] hover:underline flex items-center space-x-1 cursor-pointer"
                      >
                        <span>View 360° Page</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Action Buttons: Inquiry Now (Peach) + Order / 360 View (Teal) */}
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => handleOpenInquiry(srv, 'inquiry')}
                        className="px-3 py-2 rounded-xl bg-[#FDE2DE] hover:bg-[#F5A39A]/30 text-[#D9777F] dark:bg-[#533735] dark:text-[#F2A39A] border border-[#F5A39A]/30 font-bold text-xs transition-colors cursor-pointer"
                      >
                        Inquiry Now
                      </button>

                      <button
                        onClick={() => handleNavigateToProduct(srv)}
                        className="px-3 py-2 rounded-xl btn-primary-cta font-bold text-xs flex items-center justify-center space-x-1.5 shadow-xs transition-all active:scale-95 cursor-pointer"
                      >
                        <ShoppingBag className="w-3.5 h-3.5" />
                        <span>Explore 360°</span>
                      </button>
                    </div>
                  </div>
                </div>

              </div>
            ))}
          </div>
        )}

      </section>

      {/* 4. HOW IT WORKS (4 SIMPLE STEPS) */}
      <section className="bg-[#F8FAFA] dark:bg-[#111A1E] border-y border-[#DCE7E7] dark:border-[#2A3C40] py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <span className="text-xs font-black uppercase text-[#0799A6] dark:text-[#25B4BD] tracking-wider">Seamless Process</span>
            <h2 className="text-3xl font-black text-[#102A36] dark:text-[#F4F8F8]">How Your Design Gets Created</h2>
            <p className="text-xs text-[#52636A] dark:text-[#B7C6C8]">
              From initial brief to final high-resolution vector handover in minutes or hours.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                step: '01',
                title: 'Choose Service & Speed',
                desc: 'Select from 85+ design services and choose standard, same-day, or 10-minute instant delivery.',
                icon: Layers,
              },
              {
                step: '02',
                title: 'Submit Brief / Files',
                desc: 'Upload reference images, brand logos, colors, and content notes directly or via Google Drive.',
                icon: FileCheck,
              },
              {
                step: '03',
                title: 'Live Proof & Revision',
                desc: 'Our lead designers craft your artwork and share previews via WhatsApp and customer dashboard.',
                icon: Sparkles,
              },
              {
                step: '04',
                title: 'Final 4K Vector Download',
                desc: 'Receive master AI, PSD, SVG, 300 DPI print-ready PDFs, and Canva editable links with commercial rights.',
                icon: ShieldCheck,
              },
            ].map((stepItem, i) => {
              const Icon = stepItem.icon;
              return (
                <div
                  key={i}
                  className="p-6 rounded-3xl bg-[#FFFFFF] dark:bg-[#182429] border border-[#DCE7E7] dark:border-[#2A3C40] space-y-3 relative overflow-hidden shadow-xs hover:border-[#0799A6] transition-colors"
                >
                  <span className="text-3xl font-black text-[#DDF3F4] dark:text-[#173D40] block font-mono">
                    {stepItem.step}
                  </span>
                  <div className="w-10 h-10 rounded-2xl bg-[#DDF3F4] dark:bg-[#173D40] text-[#0799A6] dark:text-[#25B4BD] flex items-center justify-center">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h4 className="text-base font-bold text-[#102A36] dark:text-[#F4F8F8]">{stepItem.title}</h4>
                  <p className="text-xs text-[#52636A] dark:text-[#B7C6C8] leading-relaxed">{stepItem.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 5. FREQUENTLY ASKED QUESTIONS ACCORDION */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-8">
        <div className="text-center space-y-2">
          <span className="text-xs font-bold uppercase text-[#0799A6] dark:text-[#25B4BD] tracking-wider">Got Questions?</span>
          <h2 className="text-3xl font-black text-[#102A36] dark:text-[#F4F8F8]">Frequently Asked Questions</h2>
        </div>

        <div className="space-y-3">
          {generalFaqs.map((faq, idx) => (
            <div
              key={idx}
              className="rounded-2xl bg-[#FFFFFF] dark:bg-[#182429] border border-[#DCE7E7] dark:border-[#2A3C40] overflow-hidden shadow-xs"
            >
              <button
                onClick={() => setOpenFaqIndex(openFaqIndex === idx ? null : idx)}
                className="w-full px-5 py-4 text-left font-bold text-sm text-[#102A36] dark:text-[#F4F8F8] flex items-center justify-between hover:text-[#0799A6] transition-colors"
              >
                <span>{faq.q}</span>
                {openFaqIndex === idx ? (
                  <ChevronUp className="w-4 h-4 text-[#0799A6]" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-[#819396]" />
                )}
              </button>
              {openFaqIndex === idx && (
                <div className="px-5 pb-4 text-xs text-[#52636A] dark:text-[#B7C6C8] leading-relaxed border-t border-[#DCE7E7] dark:border-[#2A3C40] pt-3">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* 6. FINAL BOTTOM CTA BANNER */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="rounded-3xl bg-[#F8FAFA] dark:bg-[#141F23] border border-[#DCE7E7] dark:border-[#2A3C40] p-8 sm:p-12 text-center space-y-6 shadow-sm relative overflow-hidden">
          <div className="space-y-2 max-w-2xl mx-auto relative z-10">
            <h3 className="text-2xl sm:text-3xl font-black text-[#102A36] dark:text-[#F4F8F8]">
              Need a Custom Design Package or Monthly Retainer?
            </h3>
            <p className="text-xs sm:text-sm text-[#52636A] dark:text-[#B7C6C8]">
              Share your custom project requirements and get a tailor-made quotation in under 15 minutes.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 relative z-10">
            <button
              onClick={() => handleOpenInquiry(null, 'quote')}
              className="px-6 py-3.5 rounded-2xl bg-[#FFFFFF] dark:bg-[#182429] text-[#102A36] dark:text-[#F4F8F8] hover:bg-[#FDE2DE] border border-[#F5A39A] font-bold text-xs shadow-xs transition-colors"
            >
              Get Custom Quote
            </button>
            <a
              href="https://wa.me/918527837527?text=Hello%20Annu%20Dhaneja,%20I%20need%20a%20Custom%20Graphic%20Design%20Quote"
              target="_blank"
              rel="noreferrer"
              className="px-6 py-3.5 rounded-2xl bg-[#25D366] hover:bg-[#20ba59] text-white font-bold text-xs flex items-center space-x-2 shadow-xs transition-colors"
            >
              <MessageCircle className="w-4 h-4 fill-white" />
              <span>WhatsApp Direct Quote</span>
            </a>
          </div>
        </div>
      </section>

      {/* SERVICE DETAIL MODAL */}
      <GraphicDesignDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        service={selectedServiceForDetail}
        onOpenInquiry={(srv, mode) => {
          setIsDetailModalOpen(false);
          handleOpenInquiry(srv, mode);
        }}
      />

      {/* INQUIRY & CUSTOM QUOTE MODAL */}
      <GraphicDesignInquiryModal
        isOpen={isInquiryModalOpen}
        onClose={() => setIsInquiryModalOpen(false)}
        service={selectedServiceForInquiry}
        mode={inquiryModalMode}
      />

    </div>
  );
};
