import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Heart,
  Share2,
  Download,
  Calendar,
  Send,
  User,
  ShieldCheck,
  Compass,
  Star,
  Search,
  Filter,
  CheckCircle2,
  ArrowRight,
  MessageCircle,
  Eye,
  Lock,
  Flame,
  Image as ImageIcon,
  Clock,
  ChevronRight,
  AlertCircle,
  Award,
  Layers,
  ThumbsUp,
  MapPin,
  FileText,
  CreditCard,
  RefreshCw,
  Zap,
  Bell,
  Volume2,
  Edit3,
  Upload,
  ExternalLink,
  Crown,
  ShoppingBag,
  Sun,
  Package,
  Wand2,
  Gift,
  Grid,
  Check,
} from 'lucide-react';
import {
  GurujiArtwork,
  GurujiDailyBlessing,
  GurujiExpert,
  GurujiPredictionResult,
  GurujiBlessingWallSubmission,
  GurujiPersonalizedCardOrder,
  GurujiCategoryItem,
  MarketplaceBundle,
} from '../types';
import { useCart } from '../context/CartContext';
import { TodayBlessingSection } from '../components/guruji/TodayBlessingSection';
import { MoodSelectorSection } from '../components/guruji/MoodSelectorSection';
import { BlessingCardStudio } from '../components/guruji/BlessingCardStudio';
import { CustomizeWithPhotoStudio } from '../components/guruji/CustomizeWithPhotoStudio';
import { ArtworkGallerySection } from '../components/guruji/ArtworkGallerySection';
import { CuratedCollectionsSection } from '../components/guruji/CuratedCollectionsSection';
import { BlessingWallSection } from '../components/guruji/BlessingWallSection';
import { SpiritualExpertsSection } from '../components/guruji/SpiritualExpertsSection';
import { HighResPreviewModal } from '../components/guruji/HighResPreviewModal';
import { CustomFrameInquiryModal } from '../components/guruji/CustomFrameInquiryModal';

// Marketplace Components
import { MarketplaceProductCard } from '../components/marketplace/MarketplaceProductCard';
import { MarketplaceProductDetailModal } from '../components/marketplace/MarketplaceProductDetailModal';
import { MarketplaceBundlesSection } from '../components/marketplace/MarketplaceBundlesSection';
import { FreeDesignVaultSection } from '../components/marketplace/FreeDesignVaultSection';
import { DesignFinderModal } from '../components/marketplace/DesignFinderModal';
import { CustomDesignRequestModal } from '../components/marketplace/CustomDesignRequestModal';
import { DistinctGreySpotlight } from '../components/ui/DistinctGreySpotlight';
import { LuminousTopEdgeFlare } from '../components/ui/LuminousTopEdgeFlare';

import gurujiRealDarshan from '../assets/images/guruji_real_darshan_1790754721223.jpg';

interface GurujiArtworkPageProps {
  onNavigate?: (page: string, slug?: string) => void;
  initialTab?: string;
  initialParamId?: string;
}

// User-specified visual category navigation
const STORE_NAV_CATEGORIES = [
  { id: 'all', label: 'ALL', slug: 'all' },
  { id: 'bracelets', label: 'BRACELETS', slug: 'guruji-bracelets' },
  { id: 'accessories', label: 'ACCESSORIES', slug: 'guruji-accessories' },
  { id: 'donation-box', label: 'DONATION BOX', slug: 'donation-box' },
  { id: 'wallpapers', label: 'WALLPAPERS', slug: 'mobile-wallpapers' },
  { id: 'stickers', label: 'STICKERS', slug: 'digital-stickers' },
  { id: 'jai-guru-ji', label: 'JAI GURU JI', slug: 'digital-stickers' },
  { id: 'daily-quotes', label: 'DAILY QUOTES', slug: 'daily-quotes-vachan' },
  { id: 'vachan-calendars', label: 'VACHAN CALENDARS', slug: 'vachan-calendars' },
  { id: 'bookmarks', label: 'BOOKMARKS', slug: 'digital-bookmarks' },
  { id: 'status', label: 'STATUS', slug: 'status-story-graphics' },
  { id: 'story', label: 'STORY', slug: 'status-story-graphics' },
  { id: 'digital-artwork', label: 'DIGITAL ARTWORK', slug: 'guruji-digital-artwork' },
  { id: 'other', label: 'OTHER', slug: 'special-collections' },
];

export const GurujiArtworkPage: React.FC<GurujiArtworkPageProps> = ({
  onNavigate,
  initialTab = 'store',
  initialParamId,
}) => {
  const { addItem, openCart } = useCart();

  // Active View Tab: Defaults to 'store'
  const [activeTab, setActiveTab] = useState<
    'store' | 'blessing-wall' | 'daily-blessing' | 'card-studio' | 'photo-studio' | 'experts' | 'all'
  >(() => {
    if (initialTab === 'blessing-wall') return 'blessing-wall';
    if (initialTab === 'daily-blessing') return 'daily-blessing';
    if (initialTab === 'card-studio') return 'card-studio';
    if (initialTab === 'photo-studio') return 'photo-studio';
    if (initialTab === 'experts') return 'experts';
    if (initialTab === 'all') return 'all';
    return 'store';
  });

  // Active Hero Display Image (defaults to the authentic Guruji Swaroop in luxury console interior)
  const [activeHeroImage, setActiveHeroImage] = useState<string>(gurujiRealDarshan);

  // Core Data States
  const [artworks, setArtworks] = useState<GurujiArtwork[]>([]);
  const [bundles, setBundles] = useState<MarketplaceBundle[]>([]);
  const [categories, setCategories] = useState<GurujiCategoryItem[]>([]);
  const [dailyData, setDailyData] = useState<{
    artwork: GurujiArtwork | null;
    blessing: GurujiDailyBlessing | null;
    date: string;
  } | null>(null);
  const [experts, setExperts] = useState<GurujiExpert[]>([]);
  const [wallSubmissions, setWallSubmissions] = useState<GurujiBlessingWallSubmission[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Filters & Search
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedProductType, setSelectedProductType] = useState<string>('all');
  const [selectedPrice, setSelectedPrice] = useState<'all' | 'free' | 'paid' | 'under50'>('all');
  const [selectedMood, setSelectedMood] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('popular');

  // Modals & Active Selections
  const [marketplaceDetailArtwork, setMarketplaceDetailArtwork] = useState<GurujiArtwork | null>(null);
  const [previewArtwork, setPreviewArtwork] = useState<GurujiArtwork | null>(null);
  const [studioTargetArtwork, setStudioTargetArtwork] = useState<GurujiArtwork | null>(null);
  const [isInquiryModalOpen, setIsInquiryModalOpen] = useState(false);
  const [inquiryArtwork, setInquiryArtwork] = useState<GurujiArtwork | null>(null);
  const [isDesignFinderOpen, setIsDesignFinderOpen] = useState(false);
  const [isCustomRequestOpen, setIsCustomRequestOpen] = useState(false);
  const [downloadSuccessModal, setDownloadSuccessModal] = useState<{
    open: boolean;
    title: string;
    source: string;
  } | null>(null);
  const [cartSuccessNotice, setCartSuccessNotice] = useState<string | null>(null);

  // Fetch initial data from server APIs and parse URL search params
  useEffect(() => {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const urlCategory = urlParams.get('category') || urlParams.get('cat');
      const urlTab = urlParams.get('tab');
      const urlMood = urlParams.get('mood');
      const urlPrice = urlParams.get('price');
      const urlSearch = urlParams.get('q') || urlParams.get('search');
      const urlArtId = urlParams.get('art') || urlParams.get('artwork') || urlParams.get('product') || initialParamId;

      if (urlCategory) setSelectedCategory(urlCategory);
      if (urlMood) setSelectedMood(urlMood);
      if (urlPrice === 'free' || urlPrice === 'paid' || urlPrice === 'under50') setSelectedPrice(urlPrice as any);
      if (urlSearch) setSearchQuery(urlSearch);
      if (urlTab && ['store', 'marketplace', 'blessing-wall', 'daily-blessing', 'card-studio', 'photo-studio', 'experts', 'all'].includes(urlTab)) {
        setActiveTab(urlTab === 'marketplace' ? 'store' : (urlTab as any));
      }
    } catch (e) {
      console.warn('URL search params parse error', e);
    }

    fetchInitialData();
  }, []);

  // Synchronize URL parameters with current state without page reload
  useEffect(() => {
    try {
      const url = new URL(window.location.href);
      if (selectedCategory && selectedCategory !== 'all') {
        url.searchParams.set('category', selectedCategory);
      } else {
        url.searchParams.delete('category');
      }

      if (selectedMood && selectedMood !== 'all') {
        url.searchParams.set('mood', selectedMood);
      } else {
        url.searchParams.delete('mood');
      }

      if (selectedPrice && selectedPrice !== 'all') {
        url.searchParams.set('price', selectedPrice);
      } else {
        url.searchParams.delete('price');
      }

      if (activeTab && activeTab !== 'store') {
        url.searchParams.set('tab', activeTab);
      } else {
        url.searchParams.delete('tab');
      }

      if (searchQuery.trim()) {
        url.searchParams.set('q', searchQuery.trim());
      } else {
        url.searchParams.delete('q');
      }

      window.history.replaceState({}, '', url.toString());
    } catch (e) {
      // Ignore if iframe restriction
    }
  }, [selectedCategory, selectedMood, selectedPrice, activeTab, searchQuery]);

  const fetchInitialData = async () => {
    setLoading(true);
    try {
      const [resArts, resCats, resDaily, resExp, resWall, resFavs, resBundles] = await Promise.all([
        fetch('/api/guruji/artworks'),
        fetch('/api/guruji/categories'),
        fetch('/api/guruji/artworks/daily'),
        fetch('/api/guruji/experts'),
        fetch('/api/guruji/blessing-wall'),
        fetch('/api/guruji/favorites'),
        fetch('/api/guruji/bundles'),
      ]);

      if (resArts.ok) {
        const artList = await resArts.json();
        setArtworks(artList);
        if (initialParamId) {
          const found = artList.find((a: GurujiArtwork) => a.id === initialParamId || a.slug === initialParamId);
          if (found) {
            setMarketplaceDetailArtwork(found);
            setPreviewArtwork(found);
          }
        }
      }

      if (resCats.ok) {
        const catList = await resCats.json();
        setCategories(catList);
      }

      if (resBundles.ok) {
        const bList = await resBundles.json();
        setBundles(bList);
      }

      if (resDaily.ok) {
        const dData = await resDaily.json();
        setDailyData(dData);
      }

      if (resExp.ok) {
        setExperts(await resExp.json());
      }

      if (resWall.ok) {
        setWallSubmissions(await resWall.json());
      }

      if (resFavs.ok) {
        const fData = await resFavs.json();
        if (Array.isArray(fData.favorites)) {
          setFavorites(fData.favorites);
        }
      }
    } catch (err) {
      console.error('Failed to load Guruji Store data:', err);
    } finally {
      setLoading(false);
    }
  };

  // Toggle Favorite Handler
  const handleToggleFavorite = async (artworkId: string) => {
    try {
      const res = await fetch(`/api/guruji/artworks/${artworkId}/favorite`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      if (res.ok) {
        const data = await res.json();
        if (data.isFavorited) {
          setFavorites((prev) => [...prev, artworkId]);
        } else {
          setFavorites((prev) => prev.filter((id) => id !== artworkId));
        }

        // Update local artwork count
        setArtworks((prev) =>
          prev.map((art) =>
            art.id === artworkId
              ? { ...art, favoritesCount: data.favoritesCount }
              : art
          )
        );
      }
    } catch (e) {
      console.error('Failed to toggle favorite:', e);
    }
  };

  // Download Handler (Tracks analytics + triggers real browser download)
  const handleDownloadArtwork = async (art: GurujiArtwork) => {
    try {
      const res = await fetch(`/api/guruji/artworks/${art.id}/download`, {
        method: 'POST',
      });
      const data = res.ok ? await res.json() : null;

      const downloadUrl = data?.downloadUrl || art.highResUrl || art.imageUrl;
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = `${art.slug || 'guruji-darshan'}-4k.jpg`;
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setDownloadSuccessModal({
        open: true,
        title: art.title,
        source: art.sourceAttribution || 'Original Digital Art by Annu Dhaneja Creative Studio',
      });

      // Update downloads count in state
      setArtworks((prev) =>
        prev.map((a) => (a.id === art.id ? { ...a, downloadsCount: (a.downloadsCount || 0) + 1 } : a))
      );
    } catch (e) {
      console.error(e);
      window.open(art.highResUrl || art.imageUrl, '_blank');
    }
  };

  // Add to Cart / Buy Artwork Handler
  const handleBuyArtwork = (art: GurujiArtwork) => {
    addItem({
      id: art.id,
      itemId: art.id,
      name: art.title,
      price: art.price || 19,
      quantity: 1,
      image: art.imageUrl,
      imageUrl: art.imageUrl,
      serviceType: 'graphic-design',
      isDigital: art.isDigital !== undefined ? art.isDigital : art.isFree,
      isPhysical: art.isPhysical !== undefined ? art.isPhysical : !art.isFree,
      originalPrice: art.originalPrice,
    });

    setCartSuccessNotice(`Added "${art.title}" to cart! Click Cart to checkout via Razorpay.`);
    setTimeout(() => setCartSuccessNotice(null), 5000);
  };

  // Add Blessing Wall Submission Handler
  const handleAddWallSubmission = async (sub: Partial<GurujiBlessingWallSubmission>): Promise<boolean> => {
    try {
      const res = await fetch('/api/guruji/blessing-wall', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(sub),
      });
      if (res.ok) {
        const created = await res.json();
        setWallSubmissions((prev) => [created, ...prev]);
        return true;
      }
    } catch (e) {
      console.error(e);
    }
    return false;
  };

  // Like Blessing Wall Submission Handler
  const handleLikeWallSubmission = async (id: string) => {
    try {
      await fetch(`/api/guruji/blessing-wall/${id}/like`, { method: 'POST' });
      setWallSubmissions((prev) =>
        prev.map((w) => (w.id === id ? { ...w, likesCount: w.likesCount + 1 } : w))
      );
    } catch (e) {
      console.error(e);
    }
  };

  // Submit Mandir Frame Inquiry
  const handleSubmitInquiry = async (inquiry: any): Promise<boolean> => {
    try {
      const res = await fetch('/api/guruji/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(inquiry),
      });
      return res.ok;
    } catch (e) {
      console.error(e);
      return false;
    }
  };

  // Book Consultation with Expert
  const handleBookConsultation = (expert: GurujiExpert) => {
    addItem({
      id: `expert-${expert.id}`,
      name: `1-on-1 Spiritual Guidance with ${expert.name}`,
      price: expert.consultationPrice || 999,
      quantity: 1,
      image: expert.profilePhoto || 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=400&q=80',
      serviceType: 'graphic-design',
      isDigital: true,
    });

    setCartSuccessNotice(`Consultation with ${expert.name} added! Proceed via Razorpay secure checkout.`);
    setTimeout(() => setCartSuccessNotice(null), 5000);
  };

  // Filter artworks on client-side
  const filteredArtworks = artworks.filter((art) => {
    if (art.isDeleted) return false;

    // Robust Category filter
    if (selectedCategory !== 'all') {
      const normSelected = selectedCategory.toLowerCase().replace(/[^a-z0-9]/g, '');
      const normArtCat = (art.category || '').toLowerCase().replace(/[^a-z0-9]/g, '');
      const normArtCatName = (art.categoryName || '').toLowerCase().replace(/[^a-z0-9]/g, '');

      // Specific Category Mappings
      const matchesBracelet = (selectedCategory === 'bracelets' || selectedCategory === 'guruji-bracelets') &&
        (normArtCat.includes('bracelet') || normArtCatName.includes('bracelet') || art.title.toLowerCase().includes('bracelet') || art.tags?.some(t => t.toLowerCase().includes('bracelet')));

      const matchesAccessory = (selectedCategory === 'accessories' || selectedCategory === 'guruji-accessories') &&
        (normArtCat.includes('accessor') || normArtCatName.includes('accessor') || art.title.toLowerCase().includes('charan') || art.title.toLowerCase().includes('stand') || art.title.toLowerCase().includes('keychain'));

      const matchesDonation = (selectedCategory === 'donation-box') &&
        (normArtCat.includes('donation') || normArtCat.includes('golak') || art.title.toLowerCase().includes('golak') || art.title.toLowerCase().includes('donation') || art.title.toLowerCase().includes('hundi'));

      const matchesWallpaper = (selectedCategory === 'wallpapers' || selectedCategory === 'mobile-wallpapers') &&
        (normArtCat.includes('wallpaper') || normArtCatName.includes('wallpaper') || art.title.toLowerCase().includes('wallpaper') || art.tags?.some(t => t.toLowerCase().includes('wallpaper')));

      const matchesSticker = (selectedCategory === 'stickers' || selectedCategory === 'digital-stickers' || selectedCategory === 'jai-guru-ji') &&
        (normArtCat.includes('sticker') || normArtCatName.includes('sticker') || art.title.toLowerCase().includes('sticker') || art.tags?.some(t => t.toLowerCase().includes('sticker')));

      const matchesQuote = (selectedCategory === 'daily-quotes' || selectedCategory === 'daily-quotes-vachan') &&
        (normArtCat.includes('quote') || normArtCat.includes('vachan') || art.title.toLowerCase().includes('quote') || art.title.toLowerCase().includes('vachan'));

      const matchesCalendar = (selectedCategory === 'vachan-calendars') &&
        (normArtCat.includes('calendar') || normArtCatName.includes('calendar') || art.title.toLowerCase().includes('calendar'));

      const matchesBookmark = (selectedCategory === 'bookmarks' || selectedCategory === 'digital-bookmarks') &&
        (normArtCat.includes('bookmark') || normArtCatName.includes('bookmark') || art.title.toLowerCase().includes('bookmark'));

      const matchesStatus = (selectedCategory === 'status' || selectedCategory === 'story' || selectedCategory === 'status-story-graphics') &&
        (normArtCat.includes('status') || normArtCat.includes('story') || art.dimensions?.includes('9:16') || art.title.toLowerCase().includes('story') || art.title.toLowerCase().includes('status'));

      const matchesDigitalArt = (selectedCategory === 'digital-artwork' || selectedCategory === 'guruji-digital-artwork') &&
        (normArtCat.includes('artwork') || normArtCat.includes('swaroop') || normArtCat.includes('painting') || art.isDigital || art.fileFormat?.includes('PSD'));

      const matchesOther = (selectedCategory === 'other' || selectedCategory === 'special-collections') &&
        (normArtCat.includes('special') || normArtCat.includes('collection') || normArtCat.includes('other'));

      const isGenericMatch =
        normArtCat === normSelected ||
        normArtCatName === normSelected ||
        art.category === selectedCategory ||
        art.categoryName?.toLowerCase() === selectedCategory.toLowerCase();

      if (!isGenericMatch && !matchesBracelet && !matchesAccessory && !matchesDonation && !matchesWallpaper && !matchesSticker && !matchesQuote && !matchesCalendar && !matchesBookmark && !matchesStatus && !matchesDigitalArt && !matchesOther) {
        return false;
      }
    }

    // Product Type filter
    if (selectedProductType !== 'all') {
      if (selectedProductType === 'customizable' && !art.isCustomizable && art.productType !== 'CUSTOMIZABLE_PRODUCT') {
        return false;
      }
      if (selectedProductType === 'service' && art.productType !== 'SERVICE') {
        return false;
      }
      if (selectedProductType === 'digital' && (art.isPhysical || art.productType === 'SERVICE')) {
        return false;
      }
      if (selectedProductType === 'physical' && (!art.isPhysical || art.isDigital)) {
        return false;
      }
    }

    // Price filter
    if (selectedPrice === 'free' && !art.isFree) return false;
    if (selectedPrice === 'paid' && art.isFree) return false;
    if (selectedPrice === 'under50' && (art.isFree || art.price > 50)) return false;

    // Mood filter
    if (selectedMood !== 'all') {
      const target = selectedMood.toLowerCase();
      const hasMood =
        art.moods?.some((m) => m.toLowerCase() === target) ||
        art.tags?.some((t) => t.toLowerCase().includes(target)) ||
        art.title?.toLowerCase().includes(target) ||
        art.description?.toLowerCase().includes(target);
      if (!hasMood) return false;
    }

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const matches =
        art.title?.toLowerCase().includes(q) ||
        art.hindiTitle?.toLowerCase().includes(q) ||
        art.description?.toLowerCase().includes(q) ||
        art.blessingMessage?.toLowerCase().includes(q) ||
        art.quote?.toLowerCase().includes(q) ||
        art.mantra?.toLowerCase().includes(q) ||
        art.tags?.some((t) => t.toLowerCase().includes(q));
      if (!matches) return false;
    }

    return true;
  });

  // Sort filtered list
  const sortedArtworks = [...filteredArtworks].sort((a, b) => {
    if (sortBy === 'downloads') return (b.downloadsCount || 0) - (a.downloadsCount || 0);
    if (sortBy === 'favorites') return (b.favoritesCount || 0) - (a.favoritesCount || 0);
    if (sortBy === 'rating') return (b.averageRating || 0) - (a.averageRating || 0);
    if (sortBy === 'price-asc') return (a.price || 0) - (b.price || 0);
    if (sortBy === 'price-desc') return (b.price || 0) - (a.price || 0);
    if (sortBy === 'newest') return new Date(b.createdAt || '').getTime() - new Date(a.createdAt || '').getTime();
    // Default: views / popular
    return (b.viewsCount || 0) - (a.viewsCount || 0);
  });

  // Free Artworks List
  const freeArtworks = artworks.filter((a) => a.isFree && !a.isDeleted);

  // Quick Open Studio Handlers
  const handleOpenCardStudioWithArtwork = (art?: GurujiArtwork) => {
    if (art) setStudioTargetArtwork(art);
    setActiveTab('card-studio');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenPhotoStudioWithArtwork = (art?: GurujiArtwork) => {
    if (art) setStudioTargetArtwork(art);
    setActiveTab('photo-studio');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const todayArt = dailyData?.artwork || artworks[0] || null;

  const scrollToCollection = () => {
    const el = document.getElementById('collection-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="relative min-h-screen bg-transparent text-[#102A36] dark:text-[#F4F8F8] pb-24 transition-colors duration-300 font-sans">
      {/* LUMINOUS TOP EDGE LIGHT FLARE (Dual Theme: Silver-Grey in Dark, Cyan-Teal in Light) */}
      <LuminousTopEdgeFlare />

      {/* Auspicious Chanting Sacred Ribbon */}
      <div className="bg-white/80 dark:bg-[#0F161A]/85 backdrop-blur-md border-b border-[#DCE7E7]/60 dark:border-[#243338] py-2 px-4 text-center text-xs tracking-wide flex items-center justify-center space-x-2 text-[#52636A] dark:text-slate-300 relative z-20">
        <span className="text-[#0799A6] dark:text-[#25B4BD] font-bold">॥ ॐ नमः शिवाय शुभम कुरु कुरु • जय गुरु जी • शुकराना गुरु जी ॥</span>
        <span className="hidden md:inline text-[#52636A] dark:text-slate-400 font-normal">
          • Guruji Artwork — Premium Spiritual Art &amp; Devotional Collection
        </span>
      </div>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#EDF2F4] via-[#F4F7F8] to-[#FFFFFF] dark:from-[#182228] dark:via-[#0E1518] dark:to-[#080D0F] border-b border-[#DCE7E7]/60 dark:border-[#243338] pt-10 sm:pt-14 pb-12 sm:pb-16 px-4 sm:px-6 lg:px-8 text-[#102A36] dark:text-white transition-colors duration-500">
        {/* LUMINOUS TOP EDGE LIGHT FLARE & OVERHEAD SPOTLIGHT */}
        <LuminousTopEdgeFlare />
        <DistinctGreySpotlight intensity="high" />

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            
            {/* LEFT COLUMN: Hero Copy & Actions */}
            <div className="lg:col-span-6 space-y-6">
              
              {/* Small Eyebrow */}
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#DDF3F4] dark:bg-[#0E282D] text-[#087581] dark:text-[#25B4BD] border border-[#0799A6]/30 dark:border-[#0799A6]/40 text-xs font-bold tracking-wider uppercase shadow-xs">
                <Sparkles className="w-3.5 h-3.5 text-[#0799A6] dark:text-[#25B4BD]" />
                <span>GURUJI ARTWORK • PREMIUM SPIRITUAL COLLECTION</span>
              </div>

              {/* Main Headline */}
              <div className="space-y-2">
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#102A36] dark:text-[#FFFFFF] tracking-tight leading-tight">
                  Guruji Artwork
                </h1>
                <h2 className="text-xl sm:text-2xl font-bold text-[#087581] dark:text-[#25B4BD] tracking-normal">
                  Divine Art. Peaceful Spaces. Timeless Blessings.
                </h2>
              </div>

              {/* Description */}
              <p className="text-sm sm:text-base text-[#52636A] dark:text-[#94A3B8] leading-relaxed max-w-xl">
                A premium collection of Guruji-inspired art, devotional creations &amp; digital products crafted with devotion and artistic excellence for peaceful spaces and sacred sanctuaries. Browse 4K printable art, consecrated accessories, bracelets, donation boxes, and customized devotee frames.
              </p>

              {/* CTAs */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={scrollToCollection}
                  className="px-6 py-3 rounded-xl bg-[#0799A6] hover:bg-[#087581] text-white font-bold text-sm flex items-center gap-2 shadow-md hover:shadow-[#0799A6]/25 transition-all duration-200 active:scale-95"
                  id="hero-buy-collection-btn"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>BUY COLLECTION</span>
                </button>

                <button
                  type="button"
                  onClick={scrollToCollection}
                  className="px-6 py-3 rounded-xl bg-white dark:bg-[#141D21] hover:bg-slate-100 dark:hover:bg-[#1B262B] text-[#102A36] dark:text-[#FFFFFF] font-bold text-sm flex items-center gap-2 border border-[#DCE7E7] dark:border-[#243338] shadow-xs transition-all duration-200 active:scale-95"
                  id="hero-explore-artwork-btn"
                >
                  <span>EXPLORE ARTWORK</span>
                  <ArrowRight className="w-4 h-4 text-[#0799A6] dark:text-[#25B4BD]" />
                </button>

                <button
                  type="button"
                  onClick={() => setIsCustomRequestOpen(true)}
                  className="px-4 py-3 rounded-xl bg-[#FDE2DE] hover:bg-[#F5A39A]/30 text-[#D9777F] font-semibold text-xs flex items-center gap-1.5 border border-[#F5A39A]/50 transition shadow-xs"
                >
                  <Wand2 className="w-3.5 h-3.5 text-[#F5A39A]" />
                  <span>Custom Frame Brief</span>
                </button>
              </div>

              {/* Value Badges */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-[#DCE7E7] dark:border-[#1E2B30] text-xs text-[#52636A] dark:text-[#94A3B8]">
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-[#0799A6] dark:text-[#25B4BD] shrink-0" />
                  <span className="font-semibold text-[11px] text-[#102A36] dark:text-[#E2E8F0]">300 DPI 4K Print-Ready</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Award className="w-4 h-4 text-[#0799A6] dark:text-[#25B4BD] shrink-0" />
                  <span className="font-semibold text-[11px] text-[#102A36] dark:text-[#E2E8F0]">Consecrated Designs</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Zap className="w-4 h-4 text-[#0799A6] dark:text-[#25B4BD] shrink-0" />
                  <span className="font-semibold text-[11px] text-[#102A36] dark:text-[#E2E8F0]">Instant Cloud Download</span>
                </div>
                <div className="flex items-center space-x-2">
                  <ShieldCheck className="w-4 h-4 text-[#0799A6] dark:text-[#25B4BD] shrink-0" />
                  <span className="font-semibold text-[11px] text-[#102A36] dark:text-[#E2E8F0]">100% Shukrana Grace</span>
                </div>
              </div>

            </div>

            {/* RIGHT COLUMN: Realistic Interior Artwork Showcase (Completely seamless without any outline or border + Ambient Grey Light Glow) */}
            <div className="lg:col-span-6 relative">
              {/* Distinct Ambient Grey Light Glow Halo behind the artwork */}
              <div className="absolute -inset-6 bg-gradient-to-tr from-[#0799A6]/25 via-[#25B4BD]/20 to-[#0799A6]/25 dark:from-slate-300/35 dark:via-slate-200/25 dark:to-slate-400/30 rounded-[40px] blur-3xl pointer-events-none opacity-100 transition-all duration-500" />
              <div className="absolute -inset-2 bg-[#0799A6]/10 dark:bg-slate-300/15 rounded-3xl blur-xl pointer-events-none transition-all duration-500" />

              <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden border-0 outline-none ring-0 shadow-[0_0_60px_rgba(148,163,184,0.2),_0_25px_60px_rgba(0,0,0,0.85)] bg-transparent group">
                <img
                  src={activeHeroImage}
                  alt="Guruji Devotional Framed Artwork in elegant console interior"
                  className="w-full h-auto object-cover max-h-[460px] border-0 outline-none ring-0 rounded-2xl sm:rounded-3xl transition-transform duration-700 group-hover:scale-[1.01]"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    if (!target.src.includes('guruji_real_darshan.jpg')) {
                      target.src = '/images/guruji_real_darshan.jpg';
                    }
                  }}
                />
                
                {/* Subtle natural glass info overlay - clean and borderless with grey sheen */}
                <div className="absolute bottom-3 left-3 right-3 p-3.5 rounded-xl bg-[#0E1518]/92 backdrop-blur-md border border-white/10 outline-none ring-0 shadow-[0_10px_30px_rgba(0,0,0,0.6)] flex items-center justify-between">
                  <div className="space-y-0.5">
                    <div className="text-[10px] font-bold text-[#25B4BD] uppercase tracking-wider flex items-center gap-1">
                      <Sun className="w-3 h-3 text-[#25B4BD]" /> DEVOTIONAL LIVING SANCTUARY
                    </div>
                    <div className="text-xs font-bold text-white">
                      Premium Framed Artwork on Teak Console
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      if (todayArt) {
                        setMarketplaceDetailArtwork(todayArt);
                      } else {
                        scrollToCollection();
                      }
                    }}
                    className="px-3.5 py-1.5 rounded-lg bg-[#0799A6] hover:bg-[#087581] text-white font-bold text-[11px] transition shadow-xs border-0 outline-none"
                  >
                    View Details
                  </button>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Secondary Feature Tabs Strip (Store, Wall, Darshan, Studio, Guidance) */}
      <div className="bg-[#FFFFFF] dark:bg-[#111A1E] border-b border-[#E3ECEE] dark:border-[#243338] sticky top-0 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center space-x-2 overflow-x-auto py-2.5 scrollbar-none">
            {[
              { id: 'store', label: '🛍️ Store Collection', badge: artworks.length },
              { id: 'blessing-wall', label: '📜 Shukrana Wall', badge: wallSubmissions.length },
              { id: 'daily-blessing', label: '🌅 Aaj Ka Darshan & Vachan', badge: 'Daily' },
              { id: 'card-studio', label: '🎴 Devotee Card Studio', badge: 'Custom' },
              { id: 'photo-studio', label: '📸 Devotee Photo Frame', badge: 'Personalized' },
              { id: 'experts', label: '🪷 Vedic Guidance', badge: experts.length },
              { id: 'all', label: '✨ View All Suite' },
            ].map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id as any);
                    if (tab.id === 'store') scrollToCollection();
                  }}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-semibold shrink-0 transition-all ${
                    isActive
                      ? 'bg-[#0799A6] text-white font-bold shadow-xs'
                      : 'bg-[#F8FAFA] dark:bg-[#182429] text-[#52636A] dark:text-[#B7C6C8] border border-[#E3ECEE] dark:border-[#243338] hover:bg-[#DDF3F4] hover:text-[#087581]'
                  }`}
                  id={`view-tab-${tab.id}`}
                >
                  <span>{tab.label}</span>
                  {tab.badge && (
                    <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                      isActive ? 'bg-white/20 text-white' : 'bg-[#E3ECEE] dark:bg-[#243338] text-[#52636A] dark:text-[#B7C6C8]'
                    }`}>
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Cart / Toast Notification Banner */}
      {cartSuccessNotice && (
        <div className="fixed top-5 right-5 z-50 p-4 rounded-2xl bg-emerald-950 border-2 border-emerald-400 text-emerald-200 text-xs font-bold shadow-2xl flex items-center space-x-3 animate-in slide-in-from-top duration-300">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>{cartSuccessNotice}</span>
        </div>
      )}

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
        
        {/* ============================================================ */}
        {/* VIEW 1: STORE COLLECTION (PRIMARY STORE EXPERIENCE) */}
        {/* ============================================================ */}
        {activeTab === 'store' && (
          <div className="space-y-8 animate-in fade-in duration-300" id="collection-section">
            
            {/* Store Collection Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-2 border-b border-[#E3ECEE] dark:border-[#243338]">
              <div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-[#102A36] dark:text-[#F4F8F8] tracking-tight">
                  Guruji Collection
                </h2>
                <p className="text-xs sm:text-sm text-[#52636A] dark:text-[#B7C6C8] mt-1">
                  Explore our collection of devotional artwork and spiritual creations.
                </p>
              </div>

              {/* Quick Assistant Actions */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsDesignFinderOpen(true)}
                  className="px-3.5 py-2 rounded-xl bg-[#FFFFFF] dark:bg-[#141D21] hover:bg-[#F8FAFA] text-[#0799A6] border border-[#E3ECEE] dark:border-[#243338] text-xs font-semibold flex items-center gap-1.5 shadow-xs transition"
                >
                  <Compass className="w-3.5 h-3.5 text-[#0799A6]" />
                  <span>Design Finder Wizard</span>
                </button>
                <button
                  type="button"
                  onClick={() => setIsCustomRequestOpen(true)}
                  className="px-3.5 py-2 rounded-xl bg-[#FDE2DE] hover:bg-[#F5A39A]/30 text-[#D9777F] border border-[#F5A39A]/60 text-xs font-semibold flex items-center gap-1.5 shadow-xs transition"
                >
                  <Wand2 className="w-3.5 h-3.5 text-[#F5A39A]" />
                  <span>Custom Inquiry</span>
                </button>
              </div>
            </div>

            {/* Store Navigation Bar (Requested Visual Categories) */}
            <div className="space-y-3">
              <span className="text-[11px] font-bold text-[#52636A] uppercase tracking-wider block">
                Categories &amp; Sacred Formats:
              </span>
              <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
                {STORE_NAV_CATEGORIES.map((cat) => {
                  const isActive =
                    selectedCategory === cat.slug ||
                    (cat.slug === 'all' && selectedCategory === 'all') ||
                    selectedCategory === cat.id;

                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setSelectedCategory(cat.slug)}
                      className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all duration-200 border ${
                        isActive
                          ? 'bg-[#DDF3F4] text-[#087581] border-[#0799A6] shadow-xs'
                          : 'bg-[#FFFFFF] text-[#52636A] border-[#E3ECEE] hover:bg-[#DDF3F4] hover:text-[#087581] dark:bg-[#141D21] dark:text-[#B7C6C8] dark:border-[#243338]'
                      }`}
                      id={`cat-nav-${cat.id}`}
                    >
                      {cat.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Search, Sorter, Type & Price Filters Toolbar */}
            <div className="p-4 sm:p-5 rounded-[20px] bg-[#F8FAFA] dark:bg-[#141D21] border border-[#E3ECEE] dark:border-[#243338] space-y-4">
              <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
                
                {/* Search Bar */}
                <div className="relative w-full sm:max-w-md">
                  <Search className="w-4 h-4 text-[#52636A] absolute left-3.5 top-3" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search artworks, bracelets, wallpapers, vachan quotes, golak..."
                    className="w-full pl-10 pr-12 py-2 rounded-xl bg-[#FFFFFF] dark:bg-[#0E1518] border border-[#E3ECEE] dark:border-[#243338] text-xs text-[#102A36] dark:text-[#F4F8F8] placeholder-[#52636A] focus:outline-none focus:border-[#0799A6]"
                    id="store-search-input"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery('')}
                      className="absolute right-3 top-2.5 text-xs text-[#52636A] hover:text-[#102A36]"
                    >
                      Clear
                    </button>
                  )}
                </div>

                {/* Sorter Selector */}
                <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                  <span className="text-xs text-[#52636A] whitespace-nowrap">Sort by:</span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="px-3 py-2 rounded-xl bg-[#FFFFFF] dark:bg-[#0E1518] border border-[#E3ECEE] dark:border-[#243338] text-xs text-[#102A36] dark:text-[#F4F8F8] focus:outline-none focus:border-[#0799A6]"
                    id="store-sort-select"
                  >
                    <option value="popular">Most Popular</option>
                    <option value="downloads">Top Downloads</option>
                    <option value="rating">Highest Rated</option>
                    <option value="newest">Newest Releases</option>
                    <option value="price-asc">Price: Low to High</option>
                    <option value="price-desc">Price: High to Low</option>
                  </select>
                </div>
              </div>

              {/* Format & Price Filter Chips */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-[#E3ECEE] dark:border-[#243338] text-xs">
                
                {/* Product Type Filter */}
                <div className="flex items-center gap-1.5">
                  <span className="text-[#52636A] font-semibold text-[11px]">Format:</span>
                  {[
                    { id: 'all', label: 'All Items' },
                    { id: 'digital', label: '📥 Digital Goods' },
                    { id: 'physical', label: '📿 Physical Goods' },
                    { id: 'customizable', label: '✨ Customizable' },
                    { id: 'service', label: '🛠️ Design Services' },
                  ].map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setSelectedProductType(t.id)}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-colors ${
                        selectedProductType === t.id
                          ? 'bg-[#DDF3F4] text-[#087581] border border-[#0799A6]/40 font-bold'
                          : 'bg-[#FFFFFF] dark:bg-[#1E2B30] text-[#52636A] dark:text-[#B7C6C8] border border-[#E3ECEE] dark:border-[#243338] hover:text-[#102A36]'
                      }`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>

                {/* Price Filter */}
                <div className="flex items-center gap-1.5">
                  <span className="text-[#52636A] font-semibold text-[11px]">Price:</span>
                  {[
                    { id: 'all', label: 'All' },
                    { id: 'free', label: 'Free 4K' },
                    { id: 'under50', label: 'Under ₹50' },
                    { id: 'paid', label: 'Premium' },
                  ].map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => setSelectedPrice(p.id as any)}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-colors ${
                        selectedPrice === p.id
                          ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-400 font-bold'
                          : 'bg-[#FFFFFF] dark:bg-[#1E2B30] text-[#52636A] dark:text-[#B7C6C8] border border-[#E3ECEE] dark:border-[#243338] hover:text-[#102A36]'
                      }`}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>

              </div>
            </div>

            {/* Results Counter and Active Filter Reset */}
            <div className="flex items-center justify-between text-xs text-[#52636A]">
              <p>
                Showing <span className="font-bold text-[#102A36] dark:text-[#F4F8F8]">{sortedArtworks.length}</span> devotional items
                {selectedCategory !== 'all' && ` in "${selectedCategory}"`}
              </p>
              {(selectedCategory !== 'all' || selectedPrice !== 'all' || selectedProductType !== 'all' || searchQuery) && (
                <button
                  type="button"
                  onClick={() => {
                    setSelectedCategory('all');
                    setSelectedPrice('all');
                    setSelectedProductType('all');
                    setSearchQuery('');
                  }}
                  className="text-[#0799A6] hover:underline font-semibold"
                >
                  Reset all filters
                </button>
              )}
            </div>

            {/* Product Cards Grid with Premium Card Design */}
            {sortedArtworks.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {sortedArtworks.map((art) => (
                  <MarketplaceProductCard
                    key={art.id}
                    artwork={art}
                    isFavorite={favorites.includes(art.id)}
                    onToggleFavorite={handleToggleFavorite}
                    onQuickView={(item) => setMarketplaceDetailArtwork(item)}
                    onCustomize={(item) => setMarketplaceDetailArtwork(item)}
                    onInquiry={(item) => {
                      setInquiryArtwork(item);
                      setIsInquiryModalOpen(true);
                    }}
                    onBuyNow={(item) => {
                      addItem({
                        itemId: item.id,
                        id: item.id,
                        itemType: 'product',
                        name: item.title,
                        price: item.isFree ? 0 : item.price,
                        imageUrl: item.imageUrl,
                        image: item.imageUrl,
                        category: item.categoryName || item.category,
                        format: item.format,
                        isDigital: item.isDigital !== undefined ? item.isDigital : item.isFree,
                        isPhysical: item.isPhysical !== undefined ? item.isPhysical : !item.isFree,
                        downloadUrl: item.highResUrl || item.imageUrl,
                      });
                      openCart();
                    }}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-16 bg-[#F8FAFA] dark:bg-[#141D21] rounded-[22px] border border-[#E3ECEE] dark:border-[#243338] p-8 space-y-3">
                <p className="text-[#52636A] text-sm">No products found matching your active filters.</p>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedCategory('all');
                    setSelectedPrice('all');
                    setSelectedProductType('all');
                    setSearchQuery('');
                  }}
                  className="px-4 py-2 rounded-xl bg-[#0799A6] text-white font-bold text-xs"
                >
                  Clear Filters
                </button>
              </div>
            )}

            {/* Curated Bundles Section */}
            <MarketplaceBundlesSection
              bundles={bundles}
              onSelectBundle={(b) => {
                // Navigate to bundles or add to cart
              }}
            />

            {/* Free 4K Design Vault Section */}
            <FreeDesignVaultSection
              freeArtworks={freeArtworks}
              favorites={favorites}
              onToggleFavorite={handleToggleFavorite}
              onQuickView={(art) => setMarketplaceDetailArtwork(art)}
            />

          </div>
        )}

        {/* ============================================================ */}
        {/* VIEW 2: SHUKRANA BLESSING WALL */}
        {/* ============================================================ */}
        {activeTab === 'blessing-wall' && (
          <div className="animate-in fade-in duration-300">
            <BlessingWallSection
              submissions={wallSubmissions}
              onAddSubmission={handleAddWallSubmission}
              onLikeSubmission={handleLikeWallSubmission}
            />
          </div>
        )}

        {/* ============================================================ */}
        {/* VIEW 3: TODAY'S BLESSING & DARSHAN */}
        {/* ============================================================ */}
        {activeTab === 'daily-blessing' && (
          <div className="space-y-12 animate-in fade-in duration-300">
            <TodayBlessingSection
              artwork={todayArt}
              blessing={dailyData?.blessing || null}
              dateStr={dailyData?.date}
              isFavorited={todayArt ? favorites.includes(todayArt.id) : false}
              onToggleFavorite={handleToggleFavorite}
              onOpenCardStudio={handleOpenCardStudioWithArtwork}
              onOpenPhotoStudio={handleOpenPhotoStudioWithArtwork}
              onDownload={handleDownloadArtwork}
            />

            <CuratedCollectionsSection
              artworks={artworks}
              favorites={favorites}
              onToggleFavorite={handleToggleFavorite}
              onPreviewArtwork={(art) => setPreviewArtwork(art)}
              onDownloadArtwork={handleDownloadArtwork}
              onBuyArtwork={handleBuyArtwork}
            />
          </div>
        )}

        {/* ============================================================ */}
        {/* VIEW 4: DEVOTEE BLESSING CARD STUDIO */}
        {/* ============================================================ */}
        {activeTab === 'card-studio' && (
          <div className="animate-in fade-in duration-300">
            <BlessingCardStudio
              artworks={artworks}
              initialArtwork={studioTargetArtwork}
              onOrderSaved={(order) => {
                setCartSuccessNotice(`Card created for ${order.recipientName}!`);
              }}
            />
          </div>
        )}

        {/* ============================================================ */}
        {/* VIEW 5: DEVOTEE PHOTO FRAME STUDIO */}
        {/* ============================================================ */}
        {activeTab === 'photo-studio' && (
          <div className="animate-in fade-in duration-300">
            <CustomizeWithPhotoStudio
              artworks={artworks}
              initialArtwork={studioTargetArtwork}
            />
          </div>
        )}

        {/* ============================================================ */}
        {/* VIEW 6: VEDIC SPIRITUAL GUIDANCE & EXPERTS */}
        {/* ============================================================ */}
        {activeTab === 'experts' && (
          <div className="animate-in fade-in duration-300">
            <SpiritualExpertsSection
              experts={experts}
              onBookConsultation={handleBookConsultation}
            />
          </div>
        )}

        {/* ============================================================ */}
        {/* VIEW 7: COMPREHENSIVE SUITE (VIEW ALL) */}
        {/* ============================================================ */}
        {activeTab === 'all' && (
          <div className="space-y-16 animate-in fade-in duration-300">
            <TodayBlessingSection
              artwork={todayArt}
              blessing={dailyData?.blessing || null}
              dateStr={dailyData?.date}
              isFavorited={todayArt ? favorites.includes(todayArt.id) : false}
              onToggleFavorite={handleToggleFavorite}
              onOpenCardStudio={handleOpenCardStudioWithArtwork}
              onOpenPhotoStudio={handleOpenPhotoStudioWithArtwork}
              onDownload={handleDownloadArtwork}
            />

            <MarketplaceBundlesSection bundles={bundles} />

            <div className="space-y-6">
              <h3 className="text-2xl font-black text-[#102A36] dark:text-[#F4F8F8]">
                Complete Divine Collection Catalog
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {sortedArtworks.map((art) => (
                  <MarketplaceProductCard
                    key={art.id}
                    artwork={art}
                    isFavorite={favorites.includes(art.id)}
                    onToggleFavorite={handleToggleFavorite}
                    onQuickView={(item) => setMarketplaceDetailArtwork(item)}
                    onCustomize={(item) => setMarketplaceDetailArtwork(item)}
                    onInquiry={(item) => {
                      setInquiryArtwork(item);
                      setIsInquiryModalOpen(true);
                    }}
                    onBuyNow={(item) => {
                      addItem({
                        itemId: item.id,
                        id: item.id,
                        itemType: 'product',
                        name: item.title,
                        price: item.isFree ? 0 : item.price,
                        imageUrl: item.imageUrl,
                        image: item.imageUrl,
                        category: item.categoryName || item.category,
                        format: item.format,
                        isDigital: item.isDigital !== undefined ? item.isDigital : item.isFree,
                        isPhysical: item.isPhysical !== undefined ? item.isPhysical : !item.isFree,
                        downloadUrl: item.highResUrl || item.imageUrl,
                      });
                      openCart();
                    }}
                  />
                ))}
              </div>
            </div>

            <BlessingCardStudio
              artworks={artworks}
              initialArtwork={studioTargetArtwork}
              onOrderSaved={(order) => {
                setCartSuccessNotice(`Card created for ${order.recipientName}!`);
              }}
            />

            <CustomizeWithPhotoStudio
              artworks={artworks}
              initialArtwork={studioTargetArtwork}
            />

            <BlessingWallSection
              submissions={wallSubmissions}
              onAddSubmission={handleAddWallSubmission}
              onLikeSubmission={handleLikeWallSubmission}
            />

            <SpiritualExpertsSection
              experts={experts}
              onBookConsultation={handleBookConsultation}
            />
          </div>
        )}

      </main>

      {/* Marketplace Product Detail Modal */}
      <MarketplaceProductDetailModal
        artwork={marketplaceDetailArtwork}
        isOpen={Boolean(marketplaceDetailArtwork)}
        onClose={() => setMarketplaceDetailArtwork(null)}
        isFavorite={marketplaceDetailArtwork ? favorites.includes(marketplaceDetailArtwork.id) : false}
        onToggleFavorite={handleToggleFavorite}
        onSelectRelated={(art) => setMarketplaceDetailArtwork(art)}
        allArtworks={artworks}
        onInquiry={(art) => {
          setInquiryArtwork(art);
          setIsInquiryModalOpen(true);
        }}
        onBuyNowDirect={(art) => {
          addItem({
            itemId: art.id,
            id: art.id,
            itemType: 'product',
            name: art.title,
            price: art.isFree ? 0 : art.price,
            imageUrl: art.imageUrl,
            image: art.imageUrl,
            category: art.categoryName || art.category,
            format: art.format,
            isDigital: art.isDigital !== undefined ? art.isDigital : art.isFree,
            isPhysical: art.isPhysical !== undefined ? art.isPhysical : !art.isFree,
            downloadUrl: art.highResUrl || art.imageUrl,
          });
          setMarketplaceDetailArtwork(null);
          openCart();
        }}
      />

      {/* High-Res Preview Modal */}
      <HighResPreviewModal
        artwork={previewArtwork}
        isOpen={Boolean(previewArtwork)}
        isFavorited={previewArtwork ? favorites.includes(previewArtwork.id) : false}
        onClose={() => setPreviewArtwork(null)}
        onToggleFavorite={handleToggleFavorite}
        onDownload={handleDownloadArtwork}
        onBuy={handleBuyArtwork}
        onOpenCardStudio={handleOpenCardStudioWithArtwork}
        onOpenPhotoStudio={handleOpenPhotoStudioWithArtwork}
      />

      {/* Design Finder Modal */}
      <DesignFinderModal
        isOpen={isDesignFinderOpen}
        onClose={() => setIsDesignFinderOpen(false)}
        allArtworks={artworks}
        onSelectArtwork={(art) => setMarketplaceDetailArtwork(art)}
      />

      {/* Custom Design Request Brief Modal */}
      <CustomDesignRequestModal
        isOpen={isCustomRequestOpen}
        onClose={() => setIsCustomRequestOpen(false)}
      />

      {/* Custom Frame Inquiry Modal */}
      <CustomFrameInquiryModal
        isOpen={isInquiryModalOpen}
        artwork={inquiryArtwork}
        onClose={() => {
          setIsInquiryModalOpen(false);
          setInquiryArtwork(null);
        }}
        onSubmitInquiry={handleSubmitInquiry}
      />

      {/* Download Success Celebration Toast */}
      {downloadSuccessModal?.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-md rounded-3xl bg-neutral-900 border border-emerald-500/40 p-6 text-center space-y-4 shadow-2xl">
            <div className="w-14 h-14 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center mx-auto text-2xl">
              ✨
            </div>

            <div className="space-y-1">
              <h3 className="text-lg font-black text-white">4K Darshan Download Initiated!</h3>
              <p className="text-xs text-[#0799A6] font-bold">"{downloadSuccessModal.title}"</p>
              <p className="text-xs text-neutral-400 pt-1">
                May Guruji’s divine grace and blessings fill your home with peace, health, and harmony.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-neutral-950 border border-neutral-800 text-[11px] text-neutral-400 text-left space-y-1">
              <span className="font-bold text-emerald-400">Authentic Digital Verification:</span>
              <p>{downloadSuccessModal.source}</p>
            </div>

            <button
              onClick={() => setDownloadSuccessModal(null)}
              className="w-full py-2.5 rounded-xl bg-[#0799A6] hover:bg-[#087581] text-white font-bold text-xs shadow-lg transition-all"
            >
              Shukrana Guruji (Close)
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
