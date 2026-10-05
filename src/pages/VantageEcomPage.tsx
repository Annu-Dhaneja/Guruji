import React, { useEffect, useState, useMemo } from 'react';
import {
  Image as ImageIcon,
  CheckCircle2,
  ShoppingBag,
  Send,
  RefreshCw,
  Search,
  Filter,
  SlidersHorizontal,
  Star,
  Clock,
  Sparkles,
  Zap,
  Layers,
  ArrowRight,
  ShieldCheck,
  Tag,
  Package,
} from 'lucide-react';
import { VantageService, VantageBeforeAfter } from '../types';
import { useCart } from '../context/CartContext';
import { ServiceDetailPage } from './ServiceDetailPage';
import { ServiceCard } from '../components/vantageecom/ServiceCard';
import { BeforeAfterSlider } from '../components/vantageecom/BeforeAfterSlider';
import { FormatConverterTool } from '../components/vantageecom/FormatConverterTool';
import { mockVantageServices } from '../data/servicesData';
import vantageEcomHeroImage from '../assets/images/vantage_ecom_hero_1790672308338.jpg';
import { DistinctGreySpotlight } from '../components/ui/DistinctGreySpotlight';

export const VantageEcomPage: React.FC = () => {
  const { addToCart } = useCart();
  const [services, setServices] = useState<VantageService[]>([]);
  const [beforeAfterItems, setBeforeAfterItems] = useState<VantageBeforeAfter[]>([]);
  const [selectedService, setSelectedService] = useState<VantageService | null>(null);
  const [scrollToInquiry, setScrollToInquiry] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedMarketplace, setSelectedMarketplace] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('popular');
  const [activeBeforeAfterTab, setActiveBeforeAfterTab] = useState<number>(0);

  // Toast notification state
  const [toastMessage, setToastMessage] = useState<string>('');

  // Fetch Services & Before-After items from Backend Database API
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [servicesRes, baRes] = await Promise.all([
          fetch('/api/vantageecom/services'),
          fetch('/api/vantageecom/before-after'),
        ]);

        if (servicesRes.ok) {
          const data = await servicesRes.json();
          setServices(data);
        }

        if (baRes.ok) {
          const baData = await baRes.json();
          setBeforeAfterItems(baData);
        }
      } catch (err) {
        console.error('Error fetching VantageEcom data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const categories = [
    { id: 'all', label: 'All Services', icon: Layers },
    { id: 'marketplace-editing', label: 'Marketplace Compliance', icon: Sparkles },
    { id: 'apparel-fashion', label: 'Apparel & Fashion', icon: Package },
    { id: 'advanced-editing', label: 'Magic Swatches & Retouching', icon: Zap },
    { id: 'video-editing', label: 'Product Reels & Video', icon: ImageIcon },
    { id: 'file-conversion', label: 'File Conversion & Speed', icon: RefreshCw },
    { id: 'digital-products', label: 'Merchant Guides & Blueprints', icon: ShieldCheck },
  ];

  const marketplaces = [
    { id: 'all', label: 'All Platforms' },
    { id: 'amazon', label: 'Amazon Main Image (RGB 255)' },
    { id: 'flipkart', label: 'Flipkart Listing' },
    { id: 'etsy', label: 'Etsy Handmade' },
    { id: 'shopify', label: 'Shopify Store' },
  ];

  // Filtered and Sorted Services
  const filteredServices = useMemo(() => {
    return services
      .filter((srv) => {
        // Category Filter
        if (selectedCategory !== 'all' && srv.category !== selectedCategory) {
          return false;
        }

        // Marketplace Filter
        if (selectedMarketplace !== 'all' && srv.marketplace && srv.marketplace !== 'all' && srv.marketplace !== selectedMarketplace) {
          return false;
        }

        // Search Query Filter
        if (searchQuery.trim() !== '') {
          const q = searchQuery.toLowerCase();
          const matchesTitle = srv.title.toLowerCase().includes(q);
          const matchesDesc = srv.shortDescription.toLowerCase().includes(q);
          const matchesCat = srv.categoryName.toLowerCase().includes(q);
          const matchesFeatures = srv.features?.some((f) => f.toLowerCase().includes(q));
          if (!matchesTitle && !matchesDesc && !matchesCat && !matchesFeatures) {
            return false;
          }
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'price-low') {
          return (a.salePrice || a.startingPrice) - (b.salePrice || b.startingPrice);
        }
        if (sortBy === 'price-high') {
          return (b.salePrice || b.startingPrice) - (a.salePrice || a.startingPrice);
        }
        if (sortBy === 'rating') {
          return (b.rating || 5.0) - (a.rating || 5.0);
        }
        // Default: popular
        return (b.reviewsCount || 0) - (a.reviewsCount || 0);
      });
  }, [services, selectedCategory, selectedMarketplace, searchQuery, sortBy]);

  const handleFastAddToCart = (srvOrEvent: React.MouseEvent | VantageService, maybeSrv?: VantageService) => {
    let srv: VantageService;
    if (maybeSrv) {
      (srvOrEvent as React.MouseEvent).stopPropagation();
      srv = maybeSrv;
    } else {
      srv = srvOrEvent as VantageService;
    }
    const price = srv.salePrice || srv.startingPrice;
    addToCart({
      id: `${srv.id}-base`,
      title: `${srv.title} (Standard)`,
      price,
      type: 'service',
      imageUrl: srv.imageUrl,
    });

    setToastMessage(`Added "${srv.title}" to cart!`);
    setTimeout(() => setToastMessage(''), 3500);
  };

  // If a service detail / inquiry is selected, render the dedicated ServiceDetailPage
  if (selectedService) {
    return (
      <ServiceDetailPage
        initialService={selectedService}
        autoFocusInquiry={scrollToInquiry}
        onBack={() => {
          setSelectedService(null);
          setScrollToInquiry(false);
          window.location.hash = '/vantage-ecom';
        }}
        onNavigateToService={(slugOrId, focusInquiry = false) => {
          const found = services.find((s) => s.slug === slugOrId || s.id === slugOrId);
          if (found) {
            setSelectedService(found);
            setScrollToInquiry(focusInquiry);
            window.location.hash = `/services/${found.slug || found.id}`;
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }
        }}
      />
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16 animate-fadeIn bg-transparent text-[#102A36] dark:text-[#F4F8F8] transition-colors duration-300">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 p-4 rounded-2xl bg-[#0799A6] text-white font-bold text-xs shadow-2xl flex items-center space-x-2 animate-bounce">
          <CheckCircle2 className="w-5 h-5 text-white" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Hero Section */}
      <div className="relative rounded-3xl overflow-hidden bg-[#F8FAFA]/60 dark:bg-[#111A1E]/70 backdrop-blur-sm border border-[#DCE7E7]/60 dark:border-[#243338] p-6 sm:p-10 lg:p-12 shadow-xs">
        {/* DISTINCT OVERHEAD SPOTLIGHT & LUMINOUS TOP EDGE FLARE */}
        <DistinctGreySpotlight intensity="high" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center relative z-10">
          
          {/* Left Column: Copy & Actions */}
          <div className="lg:col-span-7 space-y-6 text-left">
            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-[#DDF3F4] dark:bg-[#173D40] text-[#087581] dark:text-[#25B4BD] border border-[#0799A6]/30 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-4 h-4 text-[#0799A6] dark:text-[#25B4BD]" />
              <span>VantageEcom • E-Commerce Visual Production Studio</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#102A36] dark:text-[#F4F8F8] leading-tight">
              High-Converting Amazon, Flipkart &amp; Shopify Product Photo Editing
            </h1>

            <p className="text-sm sm:text-base text-[#52636A] dark:text-[#B7C6C8] leading-relaxed max-w-xl">
              Pixel-accurate pure white background removal, 3D ghost mannequin apparel stitching, jersey recoloring, custom size charts, and lossless image compression backed by database-driven quality verification.
            </p>

            {/* Feature Pill Highlights */}
            <div className="flex flex-wrap items-center gap-2.5 pt-1">
              <span className="px-3 py-1.5 rounded-full bg-[#FFFFFF] dark:bg-[#182429] border border-[#DCE7E7] dark:border-[#2A3C40] text-xs font-medium text-[#52636A] dark:text-[#B7C6C8] flex items-center space-x-1.5 shadow-2xs">
                <ShieldCheck className="w-4 h-4 text-[#0799A6] dark:text-[#25B4BD]" />
                <span>100% Amazon RGB 255 Compliant</span>
              </span>
              <span className="px-3 py-1.5 rounded-full bg-[#FFFFFF] dark:bg-[#182429] border border-[#DCE7E7] dark:border-[#2A3C40] text-xs font-medium text-[#52636A] dark:text-[#B7C6C8] flex items-center space-x-1.5 shadow-2xs">
                <Clock className="w-4 h-4 text-[#0799A6] dark:text-[#25B4BD]" />
                <span>12-24 Hour Fast Turnaround</span>
              </span>
              <span className="px-3 py-1.5 rounded-full bg-[#FFFFFF] dark:bg-[#182429] border border-[#DCE7E7] dark:border-[#2A3C40] text-xs font-medium text-[#52636A] dark:text-[#B7C6C8] flex items-center space-x-1.5 shadow-2xs">
                <Star className="w-4 h-4 text-[#F5A39A] fill-current" />
                <span>5.0 / 5.0 Quality Rating</span>
              </span>
            </div>

            {/* CTAs */}
            <div className="pt-2 flex flex-wrap items-center gap-3">
              <button
                onClick={() => {
                  setSelectedService(services[0] || mockVantageServices[0]);
                  setScrollToInquiry(true);
                }}
                className="px-6 py-3.5 rounded-2xl btn-primary-cta text-white font-black text-xs shadow-md flex items-center space-x-2 transition-all transform active:scale-98"
              >
                <Send className="w-4 h-4" />
                <span>Submit Custom Project Brief &amp; Inquiry Page</span>
              </button>
            </div>
          </div>

          {/* Right Column: Real E-Commerce Product Image with NO outline */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-2xl md:rounded-3xl overflow-hidden bg-transparent border-0 outline-none shadow-xl group">
              <img
                src={vantageEcomHeroImage}
                alt="Amazon RGB 255 Pure White Background Product Photo Editing"
                className="w-full h-auto object-cover border-0 outline-none rounded-2xl md:rounded-3xl transition-transform duration-700 group-hover:scale-[1.01]"
              />
              {/* Subtle Realism Floating Quality Tag (No outline) */}
              <div className="absolute bottom-3 left-3 right-3 p-3 rounded-xl bg-white/95 dark:bg-[#102A36]/90 backdrop-blur-md border-0 outline-none shadow-lg flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#0799A6] animate-pulse" />
                  <span className="text-[11px] font-bold text-[#102A36] dark:text-white">
                    RGB (255, 255, 255) Pure White BG
                  </span>
                </div>
                <span className="text-[10px] font-extrabold text-[#0799A6] uppercase tracking-wider">
                  Amazon Ready
                </span>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Interactive Before / After Comparison Showcase */}
      {beforeAfterItems.length > 0 && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <span className="text-xs font-bold text-[#0799A6] dark:text-[#25B4BD] uppercase tracking-widest">Quality Proof</span>
              <h2 className="text-2xl font-black text-[#102A36] dark:text-[#F4F8F8]">Before &amp; After Transformation Showcase</h2>
            </div>

            {/* Tab Selector */}
            <div className="flex flex-wrap gap-2">
              {beforeAfterItems.map((item, idx) => (
                <button
                  key={item.id}
                  onClick={() => setActiveBeforeAfterTab(idx)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    activeBeforeAfterTab === idx
                      ? 'bg-[#DDF3F4] dark:bg-[#173D40] text-[#087581] dark:text-[#25B4BD] border border-[#0799A6]/30 shadow-xs'
                      : 'bg-[#FFFFFF] dark:bg-[#182429] border border-[#DCE7E7] dark:border-[#2A3C40] text-[#52636A] dark:text-[#B7C6C8] hover:text-[#102A36] dark:hover:text-[#F4F8F8]'
                  }`}
                >
                  {item.title.split(' ')[0]} Transformation
                </button>
              ))}
            </div>
          </div>

          <div className="max-w-4xl mx-auto">
            <BeforeAfterSlider
              beforeImage={beforeAfterItems[activeBeforeAfterTab].beforeImage}
              afterImage={beforeAfterItems[activeBeforeAfterTab].afterImage}
              title={beforeAfterItems[activeBeforeAfterTab].title}
              description={beforeAfterItems[activeBeforeAfterTab].description}
            />
          </div>
        </div>
      )}

      {/* Live Image Format Converter & Lossless Compressor Sandbox Tool */}
      <FormatConverterTool />

      {/* Search & Filter Controls Bar */}
      <div className="space-y-6">
        <div className="bg-[#FFFFFF] dark:bg-[#182429] border border-[#DCE7E7] dark:border-[#2A3C40] rounded-3xl p-6 space-y-6 shadow-xs">
          {/* Search Bar & Primary Filters */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
            {/* Search Input */}
            <div className="md:col-span-6 relative">
              <Search className="w-4 h-4 text-[#819396] absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search services (e.g. ghost mannequin, white background, size chart, jersey)..."
                className="w-full bg-[#F8FAFA] dark:bg-[#111A1E] border border-[#DCE7E7] dark:border-[#2A3C40] rounded-2xl pl-11 pr-4 py-3 text-xs text-[#102A36] dark:text-[#F4F8F8] placeholder:text-[#819396] focus:border-[#0799A6] dark:focus:border-[#25B4BD] focus:outline-none transition-colors"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="text-[10px] text-[#52636A] hover:text-[#102A36] absolute right-4 top-1/2 -translate-y-1/2 bg-[#FFFFFF] dark:bg-[#182429] px-2 py-0.5 rounded-md border border-[#DCE7E7] dark:border-[#2A3C40]"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Marketplace Filter */}
            <div className="md:col-span-3">
              <select
                value={selectedMarketplace}
                onChange={(e) => setSelectedMarketplace(e.target.value)}
                className="w-full bg-[#F8FAFA] dark:bg-[#111A1E] border border-[#DCE7E7] dark:border-[#2A3C40] rounded-2xl px-4 py-3 text-xs text-[#102A36] dark:text-[#F4F8F8] focus:border-[#0799A6] dark:focus:border-[#25B4BD] focus:outline-none"
              >
                {marketplaces.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort Order */}
            <div className="md:col-span-3">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full bg-[#F8FAFA] dark:bg-[#111A1E] border border-[#DCE7E7] dark:border-[#2A3C40] rounded-2xl px-4 py-3 text-xs text-[#102A36] dark:text-[#F4F8F8] focus:border-[#0799A6] dark:focus:border-[#25B4BD] focus:outline-none"
              >
                <option value="popular">Most Popular</option>
                <option value="rating">Highest Rated (5.0 Stars)</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
            </div>
          </div>

          {/* Category Tabs */}
          <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-none">
            {categories.map((cat) => {
              const Icon = cat.icon;
              const isSelected = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-4 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap flex items-center space-x-2 transition-all shrink-0 ${
                    isSelected
                      ? 'bg-[#0799A6] text-white font-bold shadow-md shadow-[#0799A6]/20'
                      : 'bg-[#F8FAFA] dark:bg-[#111A1E] border border-[#DCE7E7] dark:border-[#2A3C40] text-[#52636A] dark:text-[#B7C6C8] hover:text-[#102A36] dark:hover:text-[#F4F8F8]'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Services Count Banner */}
        <div className="flex justify-between items-center px-2 text-xs text-[#52636A] dark:text-[#B7C6C8]">
          <span>
            Showing <strong className="text-[#102A36] dark:text-[#F4F8F8]">{filteredServices.length}</strong> production services
          </span>
          {(selectedCategory !== 'all' || selectedMarketplace !== 'all' || searchQuery) && (
            <button
              onClick={() => {
                setSelectedCategory('all');
                setSelectedMarketplace('all');
                setSearchQuery('');
              }}
              className="text-[#0799A6] dark:text-[#25B4BD] hover:underline font-bold text-[11px]"
            >
              Reset All Filters
            </button>
          )}
        </div>

        {/* Service Cards Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div key={n} className="h-96 rounded-3xl bg-[#F8FAFA] dark:bg-[#182429] border border-[#DCE7E7] dark:border-[#2A3C40] animate-pulse" />
            ))}
          </div>
        ) : filteredServices.length === 0 ? (
          <div className="bg-[#FFFFFF] dark:bg-[#182429] border border-[#DCE7E7] dark:border-[#2A3C40] rounded-3xl p-12 text-center space-y-4 max-w-lg mx-auto">
            <Package className="w-12 h-12 text-[#819396] mx-auto" />
            <h3 className="text-lg font-bold text-[#102A36] dark:text-[#F4F8F8]">No services found</h3>
            <p className="text-xs text-[#52636A] dark:text-[#B7C6C8]">
              No VantageEcom service matched your filter or search query. Try broadening your keywords.
            </p>
            <button
              onClick={() => {
                setSelectedCategory('all');
                setSelectedMarketplace('all');
                setSearchQuery('');
              }}
              className="px-6 py-2.5 rounded-xl btn-primary-cta text-white font-bold text-xs"
            >
              Show All Services
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredServices.map((srv) => (
              <ServiceCard
                key={srv.id}
                service={srv}
                onSelectService={(selected) => {
                  setSelectedService(selected);
                  setScrollToInquiry(false);
                  window.location.hash = `/services/${selected.slug || selected.id}`;
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                onOpenInquiry={(inquireSrv) => {
                  setSelectedService(inquireSrv);
                  setScrollToInquiry(true);
                  window.location.hash = `/services/${inquireSrv.slug || inquireSrv.id}`;
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                onAddToCartSuccess={(msg) => {
                  setToastMessage(msg);
                  setTimeout(() => setToastMessage(''), 3500);
                }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
