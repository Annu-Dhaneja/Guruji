import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Search,
  Zap,
  Clock,
  CheckCircle2,
  HelpCircle,
  ArrowRight,
  ShieldCheck,
  Download,
  Star,
  ChevronDown,
  ChevronUp,
  SlidersHorizontal,
  Package,
  RotateCcw,
} from 'lucide-react';
import { QuickDigitalService } from '../types';
import { QuickServiceIcon } from '../components/quick-services/QuickServiceIcon';
import { QuickOrderModal } from '../components/quick-services/QuickOrderModal';
import { QuickDiagnosticModal } from '../components/quick-services/QuickDiagnosticModal';
import { QuickServices3DShowcase, getProductSlugForService } from '../components/quick-services/QuickServices3DShowcase';
import { DistinctGreySpotlight } from '../components/ui/DistinctGreySpotlight';
import { LuminousTopEdgeFlare } from '../components/ui/LuminousTopEdgeFlare';

interface QuickServicesPageProps {
  onNavigate?: (page: string, slug?: string) => void;
}

export const QuickServicesPage: React.FC<QuickServicesPageProps> = ({ onNavigate }) => {
  const [services, setServices] = useState<QuickDigitalService[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [filterMode, setFilterMode] = useState<string>('all'); // 'all' | 'popular' | 'fast' | 'under50'
  const [viewMode, setViewMode] = useState<'3d-showcase' | 'grid'>('3d-showcase');

  // Modal States
  const [selectedServiceForOrder, setSelectedServiceForOrder] = useState<QuickDigitalService | null>(null);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState<boolean>(false);
  const [isDiagnosticModalOpen, setIsDiagnosticModalOpen] = useState<boolean>(false);

  // FAQ Toggle State
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  // Fetch Services from API
  useEffect(() => {
    const fetchServices = async () => {
      try {
        setIsLoading(true);
        const res = await fetch('/api/quick-services?enabledOnly=true');
        if (res.ok) {
          const data = await res.json();
          setServices(data);
        }
      } catch (err) {
        console.error('Failed to load quick services:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchServices();
  }, []);

  const categories = [
    'ALL',
    'Image Fix',
    'Logo Fix',
    'E-commerce Fix',
    'Social Media Fix',
    'File Conversion',
    'Print Fix',
    'Photo Fix',
  ];

  // Filtering Logic
  const filteredServices = services.filter((service) => {
    const categoryMatch =
      selectedCategory === 'ALL' || service.category.toLowerCase() === selectedCategory.toLowerCase();

    const q = searchQuery.toLowerCase().trim();
    const searchMatch =
      !q ||
      service.name.toLowerCase().includes(q) ||
      service.description.toLowerCase().includes(q) ||
      service.category.toLowerCase().includes(q) ||
      service.commonProblems.some((p) => p.toLowerCase().includes(q));

    let modeMatch = true;
    if (filterMode === 'popular') modeMatch = !!service.popular;
    if (filterMode === 'fast') modeMatch = service.deliveryTime.includes('1-2 Hours');
    if (filterMode === 'under50') modeMatch = service.price <= 50;

    return categoryMatch && searchMatch && modeMatch;
  });

  const handleOpenOrder = (service: QuickDigitalService) => {
    setSelectedServiceForOrder(service);
    setIsOrderModalOpen(true);
  };

  const faqs = [
    {
      q: 'How does the Quick Digital Services workflow work?',
      a: 'It functions like an instant digital repair counter: Select your problem or service, upload your source file, enter any special notes, and place your order. Our senior design team manually fixes the issue and delivers your high-resolution download link in 1-2 hours or same day.',
    },
    {
      q: 'What file formats can I upload and receive?',
      a: 'You can upload JPG, PNG, WEBP, HEIC, PDF, PSD, and AI files up to 25MB. We deliver in print-ready and web-optimized transparent PNG, JPG, PDF, or SVG as requested.',
    },
    {
      q: 'What if I am not happy with the result or need a revision?',
      a: 'We offer a 100% Satisfaction Guarantee with unlimited free adjustments and revisions until your image or document is 100% perfect.',
    },
    {
      q: 'Is there a rush delivery option for urgent deadlines?',
      a: 'Yes! You can toggle the 1-Hour Express Fix option (+₹49) during checkout to place your file at the front of the senior designer queue.',
    },
    {
      q: 'Can I submit bulk images for catalog or e-commerce listings?',
      a: 'Yes! You can easily select your quantity (e.g. 5, 10, 20 images) inside the order modal, and all images will be retouched with consistent lighting and margins.',
    },
  ];

  return (
    <div className="relative min-h-screen bg-transparent text-[#102A36] dark:text-[#F4F8F8] transition-colors duration-300">
      {/* LUMINOUS TOP EDGE LIGHT FLARE (Dual Theme: Silver-Grey in Dark, Cyan-Teal in Light) */}
      <LuminousTopEdgeFlare />
      
      {/* ======================================================== */}
      {/* 1. HERO SECTION & REPAIR COUNTER ETHOS */}
      {/* ======================================================== */}
      <section className="relative overflow-hidden pt-12 pb-16 lg:pt-16 lg:pb-20 border-b border-[#DCE7E7]/60 dark:border-[#243338] bg-transparent transition-colors duration-300">
        {/* DISTINCT OVERHEAD SPOTLIGHT & LUMINOUS TOP EDGE FLARE */}
        <DistinctGreySpotlight intensity="high" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          
          {/* Badge */}
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-[#FFFFFF] dark:bg-[#182429] border border-[#DCE7E7] dark:border-[#2A3C40] text-[#087581] dark:text-[#25B4BD] text-xs font-bold uppercase tracking-wider mb-6 shadow-xs">
            <Sparkles className="w-4 h-4 text-[#0799A6] dark:text-[#25B4BD]" />
            <span>Digital Repair Counter for Images &amp; Design</span>
          </div>

          {/* Main Title & Subtitle */}
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-[#102A36] dark:text-[#F4F8F8] max-w-4xl mx-auto leading-tight">
            Quick Digital Services
          </h1>
          <p className="mt-3 text-lg sm:text-xl font-bold text-[#0799A6] dark:text-[#25B4BD]">
            “Small Design Problems. Quick Professional Solutions.”
          </p>
          <p className="mt-4 text-sm sm:text-base text-[#52636A] dark:text-[#B7C6C8] max-w-2xl mx-auto leading-relaxed">
            Something wrong with your image? Upload it. Tell us the problem. Our professional team by Annu Dhaneja fixes it with pixel precision starting at just <span className="font-bold text-[#087581] dark:text-[#25B4BD]">₹39</span>.
          </p>

          {/* Quick Action CTAs */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3 sm:gap-4">
            <a
              href="#quick-services-catalog"
              className="px-6 py-3.5 rounded-full btn-primary-cta font-bold text-xs sm:text-sm shadow-md transition-all flex items-center space-x-2 active:scale-98"
            >
              <span>Explore 40+ Quick Fixes</span>
              <ArrowRight className="w-4 h-4" />
            </a>

            <button
              onClick={() => setIsDiagnosticModalOpen(true)}
              className="px-6 py-3.5 rounded-full btn-secondary-cta font-bold text-xs sm:text-sm shadow-xs transition-all flex items-center space-x-2"
            >
              <HelpCircle className="w-4 h-4 text-[#0799A6] dark:text-[#25B4BD]" />
              <span>Not Sure What You Need? (Guided Assistant)</span>
            </button>

            {onNavigate && (
              <button
                onClick={() => onNavigate('dashboard')}
                className="px-5 py-3.5 rounded-full bg-[#FFFFFF] dark:bg-[#182429] border border-[#DCE7E7] dark:border-[#2A3C40] hover:bg-[#F8FAFA] dark:hover:bg-[#111A1E] text-[#52636A] dark:text-[#B7C6C8] font-bold text-xs sm:text-sm transition-all flex items-center space-x-1.5 shadow-xs"
              >
                <Package className="w-4 h-4 text-[#0799A6] dark:text-[#25B4BD]" />
                <span>My Quick Fix Orders</span>
              </button>
            )}
          </div>

          {/* 6-Step Visual Workflow Bar */}
          <div className="mt-14 max-w-5xl mx-auto p-4 sm:p-6 rounded-2xl bg-[#FFFFFF] dark:bg-[#182429] border border-[#DCE7E7] dark:border-[#2A3C40] shadow-md">
            <div className="text-[11px] font-bold uppercase tracking-wider text-[#52636A] dark:text-[#B7C6C8] mb-4">
              How It Works — Simple 2-Minute Solution Flow
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-left">
              {[
                { step: '01', title: 'Upload File', desc: 'Any image or scan' },
                { step: '02', title: 'Select Problem', desc: 'Pick issue from list' },
                { step: '03', title: 'Transparent Price', desc: '₹39 to ₹149 instant' },
                { step: '04', title: 'Order in 1-Click', desc: 'Secure checkout' },
                { step: '05', title: 'Designer Fix', desc: 'Expert retouching' },
                { step: '06', title: 'Download HD', desc: 'Ready in 1-2 hours' },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl bg-[#F8FAFA] dark:bg-[#111A1E] border border-[#DCE7E7] dark:border-[#2A3C40] transition-colors"
                >
                  <div className="text-[10px] font-bold text-[#0799A6] dark:text-[#25B4BD]">{item.step}</div>
                  <div className="text-xs font-bold text-[#102A36] dark:text-[#F4F8F8] mt-0.5">{item.title}</div>
                  <div className="text-[10px] text-[#52636A] dark:text-[#B7C6C8]">{item.desc}</div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* ======================================================== */}
      {/* 2. CATALOG CONTROLS, SEARCH & CATEGORY FILTER */}
      {/* ======================================================== */}
      <section id="quick-services-catalog" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        
        {/* INTERACTIVE 3D PRODUCT SHOWCASE CAROUSEL (Floating 3D Objects with Mirror Reflection) */}
        {viewMode === '3d-showcase' && !isLoading && (
          <div className="mb-12">
            <QuickServices3DShowcase
              services={filteredServices.length > 0 ? filteredServices : services}
              onOpenOrder={handleOpenOrder}
              onOpenDiagnostic={() => setIsDiagnosticModalOpen(true)}
              onNavigate={onNavigate}
            />
          </div>
        )}

        {/* Search & Filter Toolbar */}
        <div className="space-y-4 mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            
            {/* Search Input */}
            <div className="relative flex-1 max-w-xl">
              <Search className="w-5 h-5 text-[#52636A] dark:text-[#B7C6C8] absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search 40+ quick fixes (e.g. background, amazon, blurry, logo, crop, signature)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-10 py-3.5 rounded-xl bg-[#FFFFFF] dark:bg-[#182429] border border-[#DCE7E7] dark:border-[#2A3C40] text-xs sm:text-sm text-[#102A36] dark:text-[#F4F8F8] placeholder-[#52636A]/60 focus:outline-none focus:border-[#0799A6] dark:focus:border-[#25B4BD] shadow-xs"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-[#52636A] hover:text-[#102A36] dark:hover:text-[#F4F8F8]"
                >
                  Clear
                </button>
              )}
            </div>

            {/* View Mode Switcher + Filter Pills */}
            <div className="flex flex-wrap items-center gap-2.5">
              {/* 3D Showcase vs Grid Switcher */}
              <div className="flex items-center p-1 rounded-xl bg-[#FFFFFF] dark:bg-[#182429] border border-[#DCE7E7] dark:border-[#2A3C40] shadow-xs">
                <button
                  type="button"
                  onClick={() => setViewMode('3d-showcase')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    viewMode === '3d-showcase'
                      ? 'bg-[#0799A6] dark:bg-[#25B4BD] text-white dark:text-[#0B1114] shadow-xs'
                      : 'text-[#52636A] dark:text-[#B7C6C8] hover:text-[#102A36] dark:hover:text-white'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>3D Showcase</span>
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('grid')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    viewMode === 'grid'
                      ? 'bg-[#0799A6] dark:bg-[#25B4BD] text-white dark:text-[#0B1114] shadow-xs'
                      : 'text-[#52636A] dark:text-[#B7C6C8] hover:text-[#102A36] dark:hover:text-white'
                  }`}
                >
                  <Package className="w-3.5 h-3.5" />
                  <span>Catalog Grid</span>
                </button>
              </div>

              <span className="text-xs font-bold text-[#52636A] dark:text-[#B7C6C8] flex items-center space-x-1 mr-0.5">
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span>Filter:</span>
              </span>

              {[
                { id: 'all', label: 'All Fixes' },
                { id: 'popular', label: '⭐ Most Popular' },
                { id: 'fast', label: '⚡ 1-2 Hours Delivery' },
                { id: 'under50', label: '🏷️ Under ₹50' },
              ].map((pill) => (
                <button
                  key={pill.id}
                  onClick={() => setFilterMode(pill.id)}
                  className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                    filterMode === pill.id
                      ? 'bg-[#0799A6] dark:bg-[#25B4BD] text-white dark:text-[#0B1114] shadow-xs'
                      : 'bg-[#FFFFFF] dark:bg-[#182429] text-[#52636A] dark:text-[#B7C6C8] border border-[#DCE7E7] dark:border-[#2A3C40] hover:bg-[#F8FAFA] dark:hover:bg-[#111A1E]'
                  }`}
                >
                  {pill.label}
                </button>
              ))}
            </div>

          </div>

          {/* Category Tabs */}
          <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                  selectedCategory === cat
                    ? 'bg-[#0799A6] dark:bg-[#25B4BD] text-white dark:text-[#0B1114] shadow-xs'
                    : 'bg-[#FFFFFF] dark:bg-[#182429] text-[#52636A] dark:text-[#B7C6C8] border border-[#DCE7E7] dark:border-[#2A3C40] hover:text-[#102A36] dark:hover:text-[#F4F8F8] hover:bg-[#F8FAFA] dark:hover:bg-[#111A1E]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Results Summary Bar */}
          <div className="flex items-center justify-between text-xs text-[#52636A] dark:text-[#B7C6C8] pt-2 px-1">
            <span>
              Showing <strong className="text-[#102A36] dark:text-[#F4F8F8]">{filteredServices.length}</strong> of {services.length} quick digital services
            </span>
            {(searchQuery || selectedCategory !== 'ALL' || filterMode !== 'all') && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('ALL');
                  setFilterMode('all');
                }}
                className="text-[#0799A6] dark:text-[#25B4BD] font-bold hover:underline"
              >
                Reset all filters
              </button>
            )}
          </div>
        </div>

        {/* ======================================================== */}
        {/* 3. 40 SERVICES CARD GRID */}
        {/* ======================================================== */}
        {isLoading ? (
          <div className="py-24 text-center space-y-3">
            <div className="w-10 h-10 border-4 border-[#0799A6] dark:border-[#25B4BD] border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-xs font-bold text-[#52636A] dark:text-[#B7C6C8]">Loading Quick Digital Services...</p>
          </div>
        ) : filteredServices.length === 0 ? (
          <div className="py-20 text-center bg-[#FFFFFF] dark:bg-[#182429] rounded-2xl border border-[#DCE7E7] dark:border-[#2A3C40] p-8 space-y-4 max-w-lg mx-auto shadow-md">
            <HelpCircle className="w-12 h-12 text-[#819396] mx-auto" />
            <h4 className="text-base font-bold text-[#102A36] dark:text-[#F4F8F8]">
              No matching quick fixes found
            </h4>
            <p className="text-xs text-[#52636A] dark:text-[#B7C6C8]">
              Try searching with different keywords like 'background', 'crop', 'amazon', or use our Guided Assistant.
            </p>
            <div className="flex justify-center gap-3 pt-2">
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('ALL');
                  setFilterMode('all');
                }}
                className="px-4 py-2 rounded-xl bg-[#F8FAFA] dark:bg-[#141F23] border border-[#DCE7E7] dark:border-[#2A3C40] text-[#102A36] dark:text-[#F4F8F8] text-xs font-bold"
              >
                Clear Search
              </button>
              <button
                onClick={() => setIsDiagnosticModalOpen(true)}
                className="px-4 py-2 rounded-xl bg-[#0799A6] dark:bg-[#25B4BD] text-white dark:text-[#0B1114] text-xs font-bold"
              >
                Open Smart Assistant
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredServices.map((srv) => {
              const productSlug = getProductSlugForService(srv);
              const handleCardClick = () => {
                if (onNavigate) {
                  onNavigate('product-detail', productSlug);
                } else {
                  window.location.hash = `/product/${productSlug}`;
                }
              };

              return (
                <div
                  key={srv.id}
                  onClick={handleCardClick}
                  className="group relative rounded-2xl bg-[#FFFFFF] dark:bg-[#182429] border border-[#DCE7E7] dark:border-[#2A3C40] hover:border-[#0799A6] dark:hover:border-[#25B4BD] shadow-xs hover:shadow-md transition-colors duration-300 overflow-hidden flex flex-col justify-between cursor-pointer"
                >
                  <div>
                    {/* Card Visual Header Image - Only product inside floats and scales on hover */}
                    <div className="relative h-48 w-full bg-[#F8FAFA] dark:bg-[#111A1E] overflow-hidden border-b border-[#DCE7E7] dark:border-[#2A3C40] flex items-center justify-center p-4">
                      {/* Dynamic Soft Radial Shadow underneath floating product */}
                      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 w-28 h-3.5 rounded-full bg-black/15 dark:bg-black/40 blur-md pointer-events-none transition-all duration-300 group-hover:w-34 group-hover:bg-black/25 dark:group-hover:bg-black/60" />

                      {/* Product Object: subtle floating animation, only product scales & lifts forward on hover */}
                      <div className="relative w-full h-full flex items-center justify-center animate-float-product-subtle">
                        <img
                          src={srv.imageUrl || srv.exampleAfterImage || 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80'}
                          alt={srv.name}
                          referrerPolicy="no-referrer"
                          className="max-h-full max-w-full object-contain drop-shadow-md transition-transform duration-500 ease-out group-hover:scale-110 group-hover:-translate-y-1.5 group-hover:drop-shadow-2xl"
                          loading="lazy"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80';
                          }}
                        />
                      </div>

                      {/* Category & Badges Overlay (STABLE UI) */}
                      <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#FFFFFF]/90 dark:bg-[#0B1114]/90 text-[#102A36] dark:text-[#F4F8F8] border border-[#DCE7E7] dark:border-[#2A3C40] shadow-xs">
                          {srv.category}
                        </span>

                        <div className="flex items-center space-x-1">
                          {srv.popular && (
                            <span className="px-2 py-0.5 rounded-full text-[9px] font-bold uppercase bg-[#F5A39A] dark:bg-[#F2A39A] text-[#102A36] dark:text-[#0B1114] flex items-center space-x-1 shadow-xs">
                              <Star className="w-2.5 h-2.5 fill-current" />
                              <span>Popular</span>
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Delivery & 360 View Badge Overlay (STABLE UI) */}
                      <div className="absolute bottom-2 left-3 right-3 flex items-end justify-between pointer-events-none">
                        <span className="px-2 py-0.5 rounded-md text-[9px] font-bold text-white bg-black/75 backdrop-blur-xs border border-white/10 flex items-center gap-1 shadow-xs">
                          <RotateCcw className="w-2.5 h-2.5 text-cyan-400" />
                          <span>360° PAGE</span>
                        </span>

                        <span className="px-2 py-0.5 rounded-md text-[10px] font-bold text-[#102A36] dark:text-[#F4F8F8] bg-[#FFFFFF]/90 dark:bg-[#0B1114]/90 border border-[#DCE7E7] dark:border-[#2A3C40] flex items-center space-x-1 shadow-xs">
                          <Clock className="w-3 h-3 text-[#0799A6] dark:text-[#25B4BD]" />
                          <span>{srv.deliveryTime}</span>
                        </span>
                      </div>
                    </div>

                    {/* Card Content Details (STABLE UI) */}
                    <div className="p-5">
                      {/* Service Title */}
                      <h3 className="text-base font-bold text-[#102A36] dark:text-[#F4F8F8] group-hover:text-[#0799A6] dark:group-hover:text-[#25B4BD] transition-colors leading-snug">
                        {srv.name}
                      </h3>

                      {/* Description */}
                      <p className="text-xs text-[#52636A] dark:text-[#B7C6C8] mt-2 line-clamp-2 leading-relaxed">
                        {srv.description}
                      </p>

                      {/* Common Problems Preview */}
                      {srv.commonProblems && srv.commonProblems.length > 0 && (
                        <div className="mt-3.5 pt-3 border-t border-[#DCE7E7] dark:border-[#2A3C40] space-y-1.5">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-[#819396] block mb-1">
                            Common Fixes:
                          </span>
                          {srv.commonProblems.slice(0, 2).map((prob, pIdx) => (
                            <div
                              key={pIdx}
                              className="text-[11px] text-[#52636A] dark:text-[#B7C6C8] flex items-start space-x-1.5"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5 text-[#0799A6] dark:text-[#25B4BD] shrink-0 mt-0.5" />
                              <span className="line-clamp-1">{prob}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Card Bottom CTA & Price (STABLE UI) */}
                  <div className="p-5 pt-0">
                    <div className="pt-3 border-t border-[#DCE7E7] dark:border-[#2A3C40] flex items-center justify-between">
                      <div>
                        <span className="text-[10px] font-bold text-[#819396] uppercase block">Price</span>
                        <div className="flex items-baseline space-x-1">
                          <span className="text-lg font-black text-[#0799A6] dark:text-[#25B4BD]">₹{srv.price}</span>
                          <span className="text-[10px] text-[#819396]">/ item</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-bold text-[#0799A6] dark:text-[#25B4BD] group-hover:underline flex items-center gap-0.5 mr-1">
                          <span>360° View</span>
                          <ArrowRight className="w-3 h-3" />
                        </span>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOpenOrder(srv);
                          }}
                          className="px-3 py-1.5 rounded-xl btn-primary-cta font-bold text-xs shadow-xs transition-all flex items-center space-x-1 active:scale-95"
                        >
                          <Zap className="w-3.5 h-3.5" />
                          <span>Order</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </section>

      {/* ======================================================== */}
      {/* 4. TRUST & DIGITAL REPAIR COUNTER GUARANTEE SECTION */}
      {/* ======================================================== */}
      <section className="bg-[#F8FAFA] dark:bg-[#111A1E] py-16 border-t border-[#DCE7E7] dark:border-[#2A3C40] transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#FFFFFF] dark:bg-[#182429] text-[#087581] dark:text-[#25B4BD] border border-[#DCE7E7] dark:border-[#2A3C40] shadow-xs">
              The GurucraftPro Quality Standard
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#102A36] dark:text-[#F4F8F8] mt-3 tracking-tight">
              Why Customers Rely on Our Quick Repair Counter
            </h2>
            <p className="text-xs sm:text-sm text-[#52636A] dark:text-[#B7C6C8] mt-2 leading-relaxed">
              Unlike automated filters or random freelancers, every fix is personally checked and handcrafted by Annu Dhaneja and our senior Photoshop specialists.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-[#FFFFFF] dark:bg-[#182429] border border-[#DCE7E7] dark:border-[#2A3C40] shadow-xs card-hover-3d space-y-3">
              <div className="w-12 h-12 rounded-xl bg-[#F8FAFA] dark:bg-[#141F23] text-[#0799A6] dark:text-[#25B4BD] border border-[#DCE7E7] dark:border-[#2A3C40] flex items-center justify-center">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-[#102A36] dark:text-[#F4F8F8]">
                Ultra-Fast 1-2 Hour Turnaround
              </h3>
              <p className="text-xs text-[#52636A] dark:text-[#B7C6C8] leading-relaxed">
                Need your product uploaded to Amazon today or an urgent ID photo formatted? Our streamlined repair queue guarantees same-day completion.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#FFFFFF] dark:bg-[#182429] border border-[#DCE7E7] dark:border-[#2A3C40] shadow-xs card-hover-3d space-y-3">
              <div className="w-12 h-12 rounded-xl bg-[#F8FAFA] dark:bg-[#141F23] text-[#0799A6] dark:text-[#25B4BD] border border-[#DCE7E7] dark:border-[#2A3C40] flex items-center justify-center">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-[#102A36] dark:text-[#F4F8F8]">
                100% Satisfaction Guarantee
              </h3>
              <p className="text-xs text-[#52636A] dark:text-[#B7C6C8] leading-relaxed">
                Every order comes with unlimited tweaks. If the edges, lighting, or dimensions aren't 100% exact to your liking, we re-touch it free.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#FFFFFF] dark:bg-[#182429] border border-[#DCE7E7] dark:border-[#2A3C40] shadow-xs card-hover-3d space-y-3">
              <div className="w-12 h-12 rounded-xl bg-[#F8FAFA] dark:bg-[#141F23] text-[#0799A6] dark:text-[#25B4BD] border border-[#DCE7E7] dark:border-[#2A3C40] flex items-center justify-center">
                <Download className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-[#102A36] dark:text-[#F4F8F8]">
                Lossless High-Resolution Deliverables
              </h3>
              <p className="text-xs text-[#52636A] dark:text-[#B7C6C8] leading-relaxed">
                We preserve 100% of your source pixel fidelity, color profiles (sRGB/AdobeRGB/CMYK), and alpha transparency channels.
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* ======================================================== */}
      {/* 5. FREQUENTLY ASKED QUESTIONS ACCORDION */}
      {/* ======================================================== */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-10">
          <h2 className="text-2xl font-extrabold text-[#102A36] dark:text-[#F4F8F8] tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="text-xs text-[#52636A] dark:text-[#B7C6C8] mt-1">
            Everything you need to know about placing a Quick Fix order.
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openFaqIndex === idx;
            return (
              <div
                key={idx}
                className="rounded-xl bg-[#FFFFFF] dark:bg-[#182429] border border-[#DCE7E7] dark:border-[#2A3C40] overflow-hidden shadow-xs transition-colors"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                  className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 font-bold text-xs sm:text-sm text-[#102A36] dark:text-[#F4F8F8] hover:text-[#0799A6] dark:hover:text-[#25B4BD] transition-colors"
                >
                  <span>{faq.q}</span>
                  {isOpen ? (
                    <ChevronUp className="w-4 h-4 text-[#0799A6] dark:text-[#25B4BD] shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-[#819396] shrink-0" />
                  )}
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 text-xs text-[#52636A] dark:text-[#B7C6C8] leading-relaxed border-t border-[#DCE7E7] dark:border-[#2A3C40] pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* ======================================================== */}
      {/* 6. MODALS */}
      {/* ======================================================== */}
      <QuickOrderModal
        service={selectedServiceForOrder}
        isOpen={isOrderModalOpen}
        onClose={() => {
          setIsOrderModalOpen(false);
          setSelectedServiceForOrder(null);
        }}
        onOrderSuccess={() => {}}
      />

      <QuickDiagnosticModal
        isOpen={isDiagnosticModalOpen}
        onClose={() => setIsDiagnosticModalOpen(false)}
        onSelectService={(service) => {
          setIsDiagnosticModalOpen(false);
          handleOpenOrder(service);
        }}
      />

    </div>
  );
};
