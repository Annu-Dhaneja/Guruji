import React, { useState, useEffect } from 'react';
import {
  Save,
  Plus,
  Trash2,
  Edit3,
  Eye,
  Sparkles,
  ShoppingBag,
  Download,
  Check,
  RefreshCw,
  Layers,
  ShieldCheck,
  Award,
  Calendar,
  Send,
  Heart,
  Compass,
  Upload,
  Image as ImageIcon,
  CheckCircle2,
  ExternalLink,
  Flame,
  Star,
  Package,
  MessageSquare,
  TrendingUp,
} from 'lucide-react';
import {
  GurujiArtwork,
  GurujiDailyBlessing,
  GurujiExpert,
  GurujiBlessingWallSubmission,
  GurujiInquiry,
  GurujiCategoryItem,
} from '../../../types';
import {
  TEMPLE_CATEGORIES,
  INITIAL_TEMPLE_TEMPLATES,
  TempleTemplate,
  TempleCategory,
} from '../../../data/templeTemplates';
import { getCMSData, saveCMSSection } from '../../../utils';

// Modular Marketplace Tabs
import { MarketplaceProductsTab } from './marketplace/MarketplaceProductsTab';
import { MarketplaceProductEditModal } from './marketplace/MarketplaceProductEditModal';
import { MarketplaceBundlesTab, GurujiBundleAdminItem } from './marketplace/MarketplaceBundlesTab';
import { CustomDesignRequestsTab, CustomDesignRequestItem } from './marketplace/CustomDesignRequestsTab';
import { MarketplaceAnalyticsTab } from './marketplace/MarketplaceAnalyticsTab';

// Curated Real High-Resolution Divine Swaroop Presets for Quick Selection
export const SWAROOP_PRESETS = [
  {
    id: 'preset-1',
    name: 'Divine White Chola Swaroop & Golden Aura',
    url: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=1200&q=90',
    description: 'Serene meditative posture with radiant warm golden illumination.',
  },
  {
    id: 'preset-2',
    name: 'Sacred Mandir Darbar Lotus Swaroop',
    url: 'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?auto=format&fit=crop&w=1200&q=90',
    description: 'Golden halo rays with royal velvet floral throne atmosphere.',
  },
  {
    id: 'preset-3',
    name: 'Amrit Vela Sacred Divine Presence',
    url: 'https://images.unsplash.com/photo-1609342122563-a43ac8917a3a?auto=format&fit=crop&w=1200&q=90',
    description: 'Auspicious morning light with sacred lotus blossom ambience.',
  },
  {
    id: 'preset-4',
    name: 'Bade Mandir Shivalik Golden Radiance',
    url: 'https://images.unsplash.com/photo-1519817650390-64a93db51149?auto=format&fit=crop&w=1200&q=90',
    description: 'Royal evening darshan illumination with warm temple lamps.',
  },
  {
    id: 'preset-5',
    name: 'Sacred Jyot & Rose Petals Darshan',
    url: 'https://images.unsplash.com/photo-1514565131-fce0801e5785?auto=format&fit=crop&w=1200&q=90',
    description: 'Golden flame diya and fragrant roses devotional offering aura.',
  },
  {
    id: 'preset-6',
    name: 'Himalayan Spiritual Peace & Grace',
    url: 'https://images.unsplash.com/photo-1507692049790-de58290a4334?auto=format&fit=crop&w=1200&q=90',
    description: 'Majestic golden sunrise over sacred spiritual peaks.',
  },
];

export const GurujiArtworkCMS: React.FC = () => {
  const [activeTab, setActiveTab] = useState<
    | 'products'
    | 'bundles'
    | 'custom-requests'
    | 'marketplace-analytics'
    | 'daily-blessing-changer'
    | 'categories'
    | 'temple-templates'
    | 'blessings'
    | 'experts'
    | 'wall'
    | 'inquiries'
  >('products');

  // Core Data
  const [artworks, setArtworks] = useState<GurujiArtwork[]>([]);
  const [categories, setCategories] = useState<GurujiCategoryItem[]>([]);
  const [bundles, setBundles] = useState<GurujiBundleAdminItem[]>([]);
  const [customRequests, setCustomRequests] = useState<CustomDesignRequestItem[]>([]);
  const [blessings, setBlessings] = useState<GurujiDailyBlessing[]>([]);
  const [experts, setExperts] = useState<GurujiExpert[]>([]);
  const [wallSubmissions, setWallSubmissions] = useState<GurujiBlessingWallSubmission[]>([]);
  const [inquiries, setInquiries] = useState<GurujiInquiry[]>([]);
  const [templeTemplates, setTempleTemplates] = useState<TempleTemplate[]>(INITIAL_TEMPLE_TEMPLATES);
  const [selectedTemplateCat, setSelectedTemplateCat] = useState<string>('all');
  
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [savingDaily, setSavingDaily] = useState(false);

  // Marketplace Product Modal State
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<GurujiArtwork | null>(null);

  // Category Modal State
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);
  const [catName, setCatName] = useState('');
  const [catHindiName, setCatHindiName] = useState('');
  const [catIcon, setCatIcon] = useState('🌸');
  const [catDescription, setCatDescription] = useState('');
  const [catEnabled, setCatEnabled] = useState(true);
  const [catSortOrder, setCatSortOrder] = useState(1);

  // Daily Blessing Live Changer State
  const [dailyImageUrl, setDailyImageUrl] = useState(
    'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=1200&q=90'
  );
  const [dailyTitle, setDailyTitle] = useState('Today’s Divine Vachan — The Power of Contentment');
  const [dailyHindiText, setDailyHindiText] = useState(
    'कल्याण किता, सब दुःख दूर किते। जिसपे गुरु की मेहर होवे, ओदी हर मुराद पूरी होवे।'
  );
  const [dailyBlessingText, setDailyBlessingText] = useState(
    'True peace does not come from accumulating external things, but from having a heart that whispers "Shukrana" in every circumstance.'
  );
  const [dailyAuthorSource, setDailyAuthorSource] = useState(
    'Original Digital Art & Sacred Archive by Annu Dhaneja Creative Studio'
  );
  const [dailySourceRef, setDailySourceRef] = useState('Studio Catalog Ref #AD-GJ-2026-LIVE');

  // Temple Template Modal State
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);
  const [editingTemplateId, setEditingTemplateId] = useState<string | null>(null);
  const [templateName, setTemplateName] = useState('');
  const [templateHindiName, setTemplateHindiName] = useState('');
  const [templateCategory, setTemplateCategory] = useState('bade-mandir');
  const [templateImageUrl, setTemplateImageUrl] = useState('');
  const [templateFrameStyle, setTemplateFrameStyle] = useState<TempleTemplate['frameStyle']>('temple-arch');
  const [templateMantra, setTemplateMantra] = useState('॥ ॐ नमः शिवाय ॥');
  const [templateHindiVachan, setTemplateHindiVachan] = useState('कल्याण किता, सब दुःख दूर किते।');
  const [templateEnglishBlessing, setTemplateEnglishBlessing] = useState(
    'May Guruji bless your home with eternal grace.'
  );
  const [templateThemeAura, setTemplateThemeAura] = useState('golden-glow');

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    setLoading(true);
    try {
      const [
        artworksRes,
        categoriesRes,
        bundlesRes,
        customRes,
        blessingsRes,
        expertsRes,
        wallRes,
        inqRes,
        dailyRes,
      ] = await Promise.all([
        fetch('/api/guruji/artworks?status=all').catch(() => null),
        fetch('/api/guruji/categories?includeDisabled=true').catch(() => null),
        fetch('/api/guruji/bundles').catch(() => null),
        fetch('/api/guruji/custom-requests').catch(() => null),
        fetch('/api/guruji/blessings').catch(() => null),
        fetch('/api/guruji/experts').catch(() => null),
        fetch('/api/guruji/blessing-wall').catch(() => null),
        fetch('/api/guruji/inquiries').catch(() => null),
        fetch('/api/guruji/daily-blessing').catch(() => null),
      ]);

      if (artworksRes?.ok) {
        const data = await artworksRes.json();
        setArtworks(data);
      }
      if (categoriesRes?.ok) {
        const data = await categoriesRes.json();
        setCategories(data);
      }
      if (bundlesRes?.ok) {
        const data = await bundlesRes.json();
        setBundles(data);
      }
      if (customRes?.ok) {
        const data = await customRes.json();
        setCustomRequests(data);
      }
      if (blessingsRes?.ok) {
        const data = await blessingsRes.json();
        setBlessings(data);
      }
      if (expertsRes?.ok) {
        const data = await expertsRes.json();
        setExperts(data);
      }
      if (wallRes?.ok) {
        const data = await wallRes.json();
        setWallSubmissions(data);
      }
      if (inqRes?.ok) {
        const data = await inqRes.json();
        setInquiries(data);
      }
      if (dailyRes?.ok) {
        const data = await dailyRes.json();
        if (data.artworkUrl) setDailyImageUrl(data.artworkUrl);
        if (data.title) setDailyTitle(data.title);
        if (data.hindiText) setDailyHindiText(data.hindiText);
        if (data.blessingText) setDailyBlessingText(data.blessingText);
        if (data.authorSource) setDailyAuthorSource(data.authorSource);
        if (data.sourceReference) setDailySourceRef(data.sourceReference);
      }
    } catch (error) {
      console.error('Error fetching CMS initial data:', error);
    } finally {
      setLoading(false);
    }
  };

  // ==================== PRODUCT CRUD HANDLERS ====================
  const handleOpenAddProduct = () => {
    setEditingProduct(null);
    setIsProductModalOpen(true);
  };

  const handleOpenEditProduct = (product: GurujiArtwork) => {
    setEditingProduct(product);
    setIsProductModalOpen(true);
  };

  const handleSaveProduct = async (productData: Partial<GurujiArtwork>) => {
    try {
      const tempId = editingProduct ? editingProduct.id : `art-${Date.now()}`;
      const fullProduct = { ...(editingProduct || {}), ...productData, id: tempId } as GurujiArtwork;
      const updatedArtworks = editingProduct
        ? artworks.map((a) => (a.id === editingProduct.id ? fullProduct : a))
        : [fullProduct, ...artworks];

      // Primary write to Firestore cms/main
      await saveCMSSection('gurujiArtworks', updatedArtworks);
      setArtworks(updatedArtworks);

      // Server sync
      const url = editingProduct
        ? `/api/guruji/artworks/${editingProduct.id}`
        : '/api/guruji/artworks';
      const method = editingProduct ? 'PUT' : 'POST';

      fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData),
      }).catch((e) => console.warn(e));

      setMessage(editingProduct ? 'Product updated successfully and saved in Firestore!' : 'New product published and saved in Firestore!');
    } catch (err: any) {
      console.error('Error saving artwork to Firestore:', err);
      setMessage(`Save failed: ${err?.message || 'Could not save to Firestore'}`);
    }
    setTimeout(() => setMessage(''), 4000);
  };

  const handleDeleteProduct = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this product from the marketplace?')) return;
    try {
      const updated = artworks.filter((a) => a.id !== id);
      await saveCMSSection('gurujiArtworks', updated);
      setArtworks(updated);

      fetch(`/api/guruji/artworks/${id}`, { method: 'DELETE' }).catch((e) => console.warn(e));
      setMessage('Product removed successfully from Firestore.');
    } catch (err: any) {
      console.error(err);
      setMessage(`Delete failed: ${err?.message || 'Error deleting product from Firestore'}`);
    }
    setTimeout(() => setMessage(''), 3000);
  };

  const handleToggleFeatured = async (product: GurujiArtwork) => {
    const updatedFeatured = !product.isFeatured;
    try {
      const updated = artworks.map((a) => (a.id === product.id ? { ...a, isFeatured: updatedFeatured } : a));
      await saveCMSSection('gurujiArtworks', updated);
      setArtworks(updated);

      fetch(`/api/guruji/artworks/${product.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...product, isFeatured: updatedFeatured }),
      }).catch((e) => console.warn(e));

      setMessage(updatedFeatured ? 'Added to Featured Showcase in Firestore!' : 'Removed from Featured Showcase in Firestore.');
    } catch (err: any) {
      console.error(err);
      setMessage(`Update failed: ${err?.message || 'Error updating Firestore'}`);
    }
    setTimeout(() => setMessage(''), 3000);
  };

  // ==================== BUNDLES HANDLERS ====================
  const handleSaveBundle = async (bundleData: Partial<GurujiBundleAdminItem>) => {
    try {
      const url = bundleData.id ? `/api/guruji/bundles/${bundleData.id}` : '/api/guruji/bundles';
      const method = bundleData.id ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bundleData),
      });

      if (res.ok) {
        const saved = await res.json();
        if (bundleData.id) {
          setBundles((prev) => prev.map((b) => (b.id === saved.id ? saved : b)));
          setMessage('Curated bundle updated successfully!');
        } else {
          setBundles((prev) => [saved, ...prev]);
          setMessage('New value bundle created successfully!');
        }
      }
    } catch (err) {
      console.error(err);
    }
    setTimeout(() => setMessage(''), 4000);
  };

  const handleDeleteBundle = async (id: string) => {
    if (!window.confirm('Delete this curated bundle?')) return;
    try {
      const res = await fetch(`/api/guruji/bundles/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setBundles((prev) => prev.filter((b) => b.id !== id));
        setMessage('Bundle deleted.');
      }
    } catch (err) {
      console.error(err);
    }
    setTimeout(() => setMessage(''), 3000);
  };

  // ==================== CUSTOM REQUEST HANDLERS ====================
  const handleUpdateCustomRequest = async (id: string, updated: Partial<CustomDesignRequestItem>) => {
    try {
      const res = await fetch(`/api/guruji/custom-requests/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated),
      });
      if (res.ok) {
        const saved = await res.json();
        setCustomRequests((prev) => prev.map((r) => (r.id === saved.id ? saved : r)));
        setMessage('Custom commission status & quotation updated!');
      }
    } catch (err) {
      console.error(err);
    }
    setTimeout(() => setMessage(''), 4000);
  };

  // ==================== DAILY BLESSING LIVE CHANGER ====================
  const handlePublishDailyBlessing = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingDaily(true);
    setMessage('');
    try {
      const blessingPayload: GurujiDailyBlessing = {
        id: `blessing-${Date.now()}`,
        title: dailyTitle,
        hindiText: dailyHindiText,
        blessingText: dailyBlessingText,
        artworkUrl: dailyImageUrl,
        category: 'daily-vachan',
        authorSource: dailyAuthorSource || 'Authentic Studio Archive',
        sourceReference: dailySourceRef || 'Sacred Teachings Reference',
        publishDate: new Date().toISOString().split('T')[0],
        status: 'PUBLISHED',
        sharesCount: 0,
        likesCount: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      // Primary write to Firestore cms/main
      const currentCMS = await getCMSData();
      const existingBlessings = currentCMS.gurujiBlessings || [];
      const updatedBlessings = [blessingPayload, ...existingBlessings.filter((b) => b.publishDate !== blessingPayload.publishDate)];
      await saveCMSSection('gurujiBlessings', updatedBlessings);

      // Server sync
      fetch('/api/guruji/daily-blessing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(blessingPayload),
      }).catch((e) => console.warn(e));

      setMessage('✨ Aaj Ki Live Blessing Image & Vachan updated and permanently saved in Firestore!');
    } catch (err: any) {
      console.error(err);
      setMessage(`Save failed: ${err?.message || 'Error updating daily blessing live image.'}`);
    } finally {
      setSavingDaily(false);
      setTimeout(() => setMessage(''), 5000);
    }
  };

  const handleSelectPresetSwaroop = (preset: (typeof SWAROOP_PRESETS)[0]) => {
    setDailyImageUrl(preset.url);
    setDailySourceRef(`Authentic Studio Archive #${preset.id}`);
    setMessage(`Applied preset: ${preset.name}`);
    setTimeout(() => setMessage(''), 3000);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, setter: (val: string) => void) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        if (ev.target?.result) setter(ev.target.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // ==================== CATEGORIES CRUD ====================
  const handleOpenAddCategory = () => {
    setEditingCategoryId(null);
    setCatName('');
    setCatHindiName('');
    setCatIcon('🪷');
    setCatDescription('');
    setCatEnabled(true);
    setCatSortOrder(categories.length + 1);
    setIsCategoryModalOpen(true);
  };

  const handleOpenEditCategory = (cat: GurujiCategoryItem) => {
    setEditingCategoryId(cat.id || cat.slug);
    setCatName(cat.name);
    setCatHindiName(cat.hindiName || '');
    setCatIcon(cat.icon || '🪷');
    setCatDescription(cat.description || '');
    setCatEnabled(cat.enabled !== false);
    setCatSortOrder(cat.sortOrder || 1);
    setIsCategoryModalOpen(true);
  };

  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload: Partial<GurujiCategoryItem> = {
        name: catName,
        hindiName: catHindiName,
        icon: catIcon,
        description: catDescription,
        enabled: catEnabled,
        sortOrder: Number(catSortOrder),
      };

      const url = editingCategoryId
        ? `/api/guruji/categories/${editingCategoryId}`
        : '/api/guruji/categories';
      const method = editingCategoryId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        const saved = await res.json();
        if (editingCategoryId) {
          setCategories((prev) =>
            prev.map((c) => (c.id === saved.id || c.slug === saved.slug ? saved : c))
          );
          setMessage('Category updated successfully!');
        } else {
          setCategories((prev) => [...prev, saved]);
          setMessage('New sacred category created!');
        }
        setIsCategoryModalOpen(false);
      }
    } catch (err) {
      console.error(err);
    }
    setTimeout(() => setMessage(''), 4000);
  };

  const handleDeleteCategory = async (catId: string) => {
    if (!window.confirm('Are you sure you want to delete this category?')) return;
    try {
      const res = await fetch(`/api/guruji/categories/${catId}`, { method: 'DELETE' });
      if (res.ok) {
        setCategories((prev) => prev.filter((c) => c.id !== catId && c.slug !== catId));
        setMessage('Category removed.');
      }
    } catch (err) {
      console.error(err);
    }
    setTimeout(() => setMessage(''), 3000);
  };

  return (
    <div className="space-y-6">
      
      {/* Toast Message */}
      {message && (
        <div className="p-4 rounded-2xl bg-[#DDF3F4] border border-[#0799A6]/40 text-[#087581] font-bold text-xs flex items-center justify-between shadow-xs animate-fade-in">
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-[#0799A6]" />
            <span>{message}</span>
          </div>
          <button onClick={() => setMessage('')} className="text-[#087581] hover:text-[#102A36] font-bold text-sm">
            ✕
          </button>
        </div>
      )}

      {/* Main CMS Navigation Tabs */}
      <div className="p-2 rounded-2xl bg-[#FFFFFF] dark:bg-[#141D21] border border-[#E3ECEE] dark:border-[#243338] flex items-center space-x-2 overflow-x-auto text-xs font-bold scrollbar-none shadow-xs">
        
        {/* Marketplace Management Group */}
        <div className="flex items-center space-x-1 bg-[#F8FAFA] dark:bg-[#0E1518] p-1 rounded-xl border border-[#E3ECEE] dark:border-[#243338] shrink-0">
          <button
            onClick={() => setActiveTab('products')}
            className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg transition-all ${
              activeTab === 'products'
                ? 'bg-[#0799A6] text-white shadow-xs font-bold'
                : 'text-[#52636A] dark:text-[#B7C6C8] hover:text-[#087581] hover:bg-[#DDF3F4]'
            }`}
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Products ({artworks.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('bundles')}
            className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg transition-all ${
              activeTab === 'bundles'
                ? 'bg-[#0799A6] text-white shadow-xs font-bold'
                : 'text-[#52636A] dark:text-[#B7C6C8] hover:text-[#087581] hover:bg-[#DDF3F4]'
            }`}
          >
            <Package className="w-3.5 h-3.5" />
            <span>Bundles ({bundles.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('custom-requests')}
            className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg transition-all ${
              activeTab === 'custom-requests'
                ? 'bg-[#0799A6] text-white shadow-xs font-bold'
                : 'text-[#52636A] dark:text-[#B7C6C8] hover:text-[#087581] hover:bg-[#DDF3F4]'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Custom Briefs ({customRequests.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('marketplace-analytics')}
            className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg transition-all ${
              activeTab === 'marketplace-analytics'
                ? 'bg-[#0799A6] text-white shadow-xs font-bold'
                : 'text-[#52636A] dark:text-[#B7C6C8] hover:text-[#087581] hover:bg-[#DDF3F4]'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Analytics</span>
          </button>
        </div>

        {/* Sacred Studio Management Group */}
        <div className="flex items-center space-x-1 shrink-0">
          <button
            onClick={() => setActiveTab('daily-blessing-changer')}
            className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl transition-all border ${
              activeTab === 'daily-blessing-changer'
                ? 'bg-[#0799A6] text-white border-[#0799A6] font-bold shadow-xs'
                : 'bg-[#F8FAFA] dark:bg-[#1E2B30] text-[#52636A] dark:text-[#B7C6C8] border-[#E3ECEE] dark:border-[#243338] hover:bg-[#DDF3F4] hover:text-[#087581]'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Aaj Ki Blessing</span>
          </button>

          <button
            onClick={() => setActiveTab('categories')}
            className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl transition-all border ${
              activeTab === 'categories'
                ? 'bg-[#0799A6] text-white border-[#0799A6] font-bold shadow-xs'
                : 'bg-[#F8FAFA] dark:bg-[#1E2B30] text-[#52636A] dark:text-[#B7C6C8] border-[#E3ECEE] dark:border-[#243338] hover:bg-[#DDF3F4] hover:text-[#087581]'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Sacred Categories ({categories.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('temple-templates')}
            className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl transition-all border ${
              activeTab === 'temple-templates'
                ? 'bg-[#0799A6] text-white border-[#0799A6] font-bold shadow-xs'
                : 'bg-[#F8FAFA] dark:bg-[#1E2B30] text-[#52636A] dark:text-[#B7C6C8] border-[#E3ECEE] dark:border-[#243338] hover:bg-[#DDF3F4] hover:text-[#087581]'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span>Temple Mandir ({templeTemplates.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('blessings')}
            className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl transition-all border ${
              activeTab === 'blessings'
                ? 'bg-[#0799A6] text-white border-[#0799A6] font-bold shadow-xs'
                : 'bg-[#F8FAFA] dark:bg-[#1E2B30] text-[#52636A] dark:text-[#B7C6C8] border-[#E3ECEE] dark:border-[#243338] hover:bg-[#DDF3F4] hover:text-[#087581]'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Blessings Archive ({blessings.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('experts')}
            className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl transition-all border ${
              activeTab === 'experts'
                ? 'bg-[#0799A6] text-white border-[#0799A6] font-bold shadow-xs'
                : 'bg-[#F8FAFA] dark:bg-[#1E2B30] text-[#52636A] dark:text-[#B7C6C8] border-[#E3ECEE] dark:border-[#243338] hover:bg-[#DDF3F4] hover:text-[#087581]'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Astrologers ({experts.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('wall')}
            className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl transition-all border ${
              activeTab === 'wall'
                ? 'bg-[#0799A6] text-white border-[#0799A6] font-bold shadow-xs'
                : 'bg-[#F8FAFA] dark:bg-[#1E2B30] text-[#52636A] dark:text-[#B7C6C8] border-[#E3ECEE] dark:border-[#243338] hover:bg-[#DDF3F4] hover:text-[#087581]'
            }`}
          >
            <Heart className="w-3.5 h-3.5" />
            <span>Wall ({wallSubmissions.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('inquiries')}
            className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl transition-all border ${
              activeTab === 'inquiries'
                ? 'bg-[#0799A6] text-white border-[#0799A6] font-bold shadow-xs'
                : 'bg-[#F8FAFA] dark:bg-[#1E2B30] text-[#52636A] dark:text-[#B7C6C8] border-[#E3ECEE] dark:border-[#243338] hover:bg-[#DDF3F4] hover:text-[#087581]'
            }`}
          >
            <Send className="w-3.5 h-3.5" />
            <span>Inquiries ({inquiries.length})</span>
          </button>
        </div>

      </div>

      {/* ==================== TAB 1: PRODUCTS MANAGER ==================== */}
      {activeTab === 'products' && (
        <MarketplaceProductsTab
          artworks={artworks}
          categories={categories}
          onAddProduct={handleOpenAddProduct}
          onEditProduct={handleOpenEditProduct}
          onDeleteProduct={handleDeleteProduct}
          onToggleFeatured={handleToggleFeatured}
        />
      )}

      {/* ==================== TAB 2: BUNDLES MANAGER ==================== */}
      {activeTab === 'bundles' && (
        <MarketplaceBundlesTab
          bundles={bundles}
          artworks={artworks}
          onSaveBundle={handleSaveBundle}
          onDeleteBundle={handleDeleteBundle}
        />
      )}

      {/* ==================== TAB 3: CUSTOM BRIEFS ==================== */}
      {activeTab === 'custom-requests' && (
        <CustomDesignRequestsTab
          requests={customRequests}
          onUpdateRequest={handleUpdateCustomRequest}
        />
      )}

      {/* ==================== TAB 4: MARKETPLACE ANALYTICS ==================== */}
      {activeTab === 'marketplace-analytics' && (
        <MarketplaceAnalyticsTab
          artworks={artworks}
          categories={categories}
          bundles={bundles}
          customRequests={customRequests}
        />
      )}

      {/* ==================== TAB 5: LIVE AAJ KI BLESSING IMAGE CHANGER ==================== */}
      {activeTab === 'daily-blessing-changer' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 text-xs">
          {/* Form */}
          <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-5 shadow-xl">
            <div>
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 text-xs font-bold mb-2">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Live Website Hero Controller</span>
              </div>
              <h3 className="text-lg font-black text-white">Live "Aaj Ki Blessing" Daily Swaroop & Vachan</h3>
              <p className="text-slate-400 text-xs">
                Update the live image, sacred Hindi vachan, English guidance, and artist source displayed on the daily hero darshan section.
              </p>
            </div>

            {/* Quick Sourced Presets */}
            <div className="space-y-2 p-4 rounded-2xl bg-slate-950 border border-slate-800">
              <span className="text-[11px] font-bold text-slate-300 block">
                Quick Select Verified High-Res Swaroop:
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {SWAROOP_PRESETS.map((preset) => (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => handleSelectPresetSwaroop(preset)}
                    className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-amber-500/50 text-left transition-all group"
                  >
                    <img src={preset.url} alt={preset.name} className="w-full h-16 rounded-lg object-cover mb-1.5" />
                    <span className="text-[10px] font-bold text-white group-hover:text-amber-300 block line-clamp-1">
                      {preset.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <form onSubmit={handlePublishDailyBlessing} className="space-y-4">
              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Hero Swaroop Image URL *</label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    required
                    value={dailyImageUrl}
                    onChange={(e) => setDailyImageUrl(e.target.value)}
                    placeholder="https://images.unsplash.com/..."
                    className="flex-1 px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white outline-none focus:border-amber-500 text-xs"
                  />
                  <label className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 cursor-pointer flex items-center space-x-1.5 border border-slate-700 font-bold shrink-0">
                    <Upload className="w-3.5 h-3.5 text-amber-400" />
                    <span>Upload</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleFileUpload(e, setDailyImageUrl)}
                    />
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Daily Title (English Heading) *</label>
                <input
                  type="text"
                  required
                  value={dailyTitle}
                  onChange={(e) => setDailyTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white outline-none focus:border-amber-500 font-bold text-xs"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Sacred Hindi Vachan (पवित्र हिंदी वचन) *</label>
                <textarea
                  rows={2}
                  required
                  value={dailyHindiText}
                  onChange={(e) => setDailyHindiText(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-amber-200 font-serif outline-none focus:border-amber-500 resize-none font-bold text-xs leading-relaxed"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Devotee Spiritual Message & Meaning *</label>
                <textarea
                  rows={3}
                  required
                  value={dailyBlessingText}
                  onChange={(e) => setDailyBlessingText(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white outline-none focus:border-amber-500 resize-none text-xs leading-relaxed"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Artist / Creative Studio Source</label>
                  <input
                    type="text"
                    value={dailyAuthorSource}
                    onChange={(e) => setDailyAuthorSource(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white outline-none focus:border-amber-500 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Catalog Archive Reference</label>
                  <input
                    type="text"
                    value={dailySourceRef}
                    onChange={(e) => setDailySourceRef(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white outline-none focus:border-amber-500 text-xs font-mono"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={savingDaily}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs flex items-center justify-center space-x-2 shadow-lg shadow-amber-500/20 disabled:opacity-50 transition-all"
                >
                  <Save className="w-4 h-4" />
                  <span>{savingDaily ? 'Updating Live Darshan...' : 'Publish Live Aaj Ki Blessing Image'}</span>
                </button>
              </div>
            </form>
          </div>

          {/* Live Preview Card */}
          <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-xl flex flex-col justify-between">
            <div className="space-y-4">
              <span className="text-[10px] text-amber-400 font-bold uppercase tracking-wider block">
                🔴 Real-Time Devotee Preview
              </span>

              <div className="relative aspect-[4/5] rounded-2xl overflow-hidden bg-slate-950 border border-amber-500/30 shadow-2xl">
                <img src={dailyImageUrl} alt="Preview" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
                
                <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-amber-500/90 text-slate-950 text-[10px] font-black uppercase">
                  Aaj Ka Swaroop
                </div>

                <div className="absolute bottom-4 left-4 right-4 text-white space-y-2">
                  <h4 className="text-sm font-black leading-tight text-white">{dailyTitle}</h4>
                  <p className="text-xs text-amber-300 font-serif font-bold italic">"{dailyHindiText}"</p>
                  <p className="text-[11px] text-slate-300 line-clamp-3 leading-relaxed">{dailyBlessingText}</p>
                  <div className="text-[9px] text-slate-400 border-t border-slate-800 pt-1.5 flex justify-between">
                    <span>{dailyAuthorSource}</span>
                    <span className="font-mono text-amber-400">{dailySourceRef}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
              <span>Status: <strong className="text-emerald-400 font-bold">Synchronized Live</strong></span>
              <span className="text-slate-500">Auto-refreshes on user devices</span>
            </div>
          </div>
        </div>
      )}

      {/* ==================== TAB 6: SACRED CATEGORIES CMS ==================== */}
      {activeTab === 'categories' && (
        <div className="space-y-5 text-xs">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-slate-900 border border-slate-800 rounded-2xl p-5 gap-4">
            <div>
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 text-xs font-bold mb-2">
                <Layers className="w-3.5 h-3.5" />
                <span>Taxonomy Architecture</span>
              </div>
              <h3 className="text-xl font-black text-white">Sacred Categories & Bhakti Collections</h3>
              <p className="text-slate-400 text-xs">
                Manage devotional collections, category icons, Hindi names, and display ordering across the marketplace.
              </p>
            </div>
            <button
              onClick={handleOpenAddCategory}
              className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs flex items-center space-x-2 shadow-lg shadow-amber-500/20 shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>Add Category</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories.map((cat) => (
              <div
                key={cat.id || cat.slug}
                className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3 flex flex-col justify-between hover:border-amber-500/40 transition-all shadow-lg"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-2xl">{cat.icon || '🪷'}</span>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        cat.enabled !== false
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          : 'bg-red-500/10 text-red-400 border border-red-500/20'
                      }`}
                    >
                      {cat.enabled !== false ? 'Active' : 'Disabled'}
                    </span>
                  </div>

                  <div>
                    <h4 className="text-sm font-black text-white">{cat.name}</h4>
                    {cat.hindiName && (
                      <span className="text-xs text-amber-300 font-serif font-bold block">{cat.hindiName}</span>
                    )}
                  </div>

                  <p className="text-slate-400 text-xs line-clamp-2 leading-relaxed">{cat.description}</p>
                </div>

                <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                  <span className="text-[11px] text-slate-500 font-mono">Slug: {cat.slug}</span>
                  <div className="flex items-center space-x-1.5">
                    <button
                      onClick={() => handleOpenEditCategory(cat)}
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeleteCategory(cat.id || cat.slug)}
                      className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ==================== TAB 7: TEMPLE MANDIR TEMPLATES ==================== */}
      {activeTab === 'temple-templates' && (
        <div className="space-y-5 text-xs">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-slate-900 border border-slate-800 rounded-2xl p-5 gap-4">
            <div>
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 text-xs font-bold mb-2">
                <Compass className="w-3.5 h-3.5" />
                <span>Temple Darshan Templates ({templeTemplates.length})</span>
              </div>
              <h3 className="text-xl font-black text-white">Temple Mandir Frame Styles & Backgrounds</h3>
              <p className="text-slate-400 text-xs">
                Configure authentic temple arches, golden filigree borders, and sacred lotus mandir themes.
              </p>
            </div>
            <button
              onClick={() => {
                setEditingTemplateId(null);
                setTemplateName('');
                setTemplateHindiName('');
                setTemplateCategory('bade-mandir');
                setTemplateImageUrl('https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=1200&q=90');
                setTemplateFrameStyle('temple-arch');
                setTemplateMantra('॥ ॐ नमः शिवाय ॥');
                setTemplateHindiVachan('कल्याण किता, सब दुःख दूर किते।');
                setTemplateEnglishBlessing('May Guruji bless your home with eternal grace.');
                setTemplateThemeAura('golden-glow');
                setIsTemplateModalOpen(true);
              }}
              className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs flex items-center space-x-2 shadow-lg shadow-amber-500/20 shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>Create Template</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {templeTemplates.map((t) => (
              <div key={t.id} className="p-4 rounded-3xl bg-slate-900 border border-slate-800 space-y-3 flex flex-col justify-between shadow-xl">
                <div className="space-y-3">
                  <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-slate-950 border border-slate-800">
                    <img src={t.imageUrl} alt={t.name} className="w-full h-full object-cover" />
                    <div className="absolute top-2 left-2 px-2.5 py-1 rounded-full bg-amber-500 text-slate-950 font-bold text-[10px]">
                      {t.categoryLabel}
                    </div>
                    <div className="absolute bottom-2 left-2 right-2 p-2 rounded-xl bg-slate-950/80 backdrop-blur-sm text-white">
                      <h4 className="font-bold text-xs truncate">{t.name}</h4>
                      <p className="text-[10px] text-amber-300 font-serif font-bold truncate">{t.hindiName}</p>
                    </div>
                  </div>
                  <div className="text-[11px] text-slate-400">
                    <span>Frame Arch: <strong className="text-white">{t.frameStyle}</strong></span>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
                  <span className="text-[10px] text-slate-500 font-mono">ID: {t.id}</span>
                  <div className="flex space-x-1">
                    <button
                      onClick={() => {
                        setEditingTemplateId(t.id);
                        setTemplateName(t.name);
                        setTemplateHindiName(t.hindiName);
                        setTemplateCategory(t.categoryId);
                        setTemplateImageUrl(t.imageUrl);
                        setTemplateFrameStyle(t.frameStyle);
                        setTemplateMantra(t.mantra || '');
                        setTemplateHindiVachan(t.defaultHindiVachan || '');
                        setTemplateEnglishBlessing(t.defaultEnglishBlessing || '');
                        setTemplateThemeAura(t.themeAura || 'golden-glow');
                        setIsTemplateModalOpen(true);
                      }}
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => {
                        if (window.confirm('Delete template?')) {
                          setTempleTemplates((prev) => prev.filter((item) => item.id !== t.id));
                        }
                      }}
                      className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ==================== TAB 8: BLESSINGS ARCHIVE ==================== */}
      {activeTab === 'blessings' && (
        <div className="space-y-4 text-xs">
          {blessings.map((b) => (
            <div key={b.id} className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center space-x-3">
                  {b.artworkUrl && (
                    <img src={b.artworkUrl} alt={b.title} className="w-12 h-12 rounded-xl object-cover border border-amber-500/30" />
                  )}
                  <div>
                    <h4 className="text-sm font-bold text-white">{b.title}</h4>
                    <span className="text-xs text-amber-400 font-semibold">{b.publishDate}</span>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setDailyTitle(b.title);
                    if (b.hindiText) setDailyHindiText(b.hindiText);
                    if (b.blessingText) setDailyBlessingText(b.blessingText);
                    if (b.artworkUrl) setDailyImageUrl(b.artworkUrl);
                    if (b.authorSource) setDailyAuthorSource(b.authorSource);
                    if (b.sourceReference) setDailySourceRef(b.sourceReference);
                    setActiveTab('daily-blessing-changer');
                  }}
                  className="px-3 py-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 text-xs font-bold"
                >
                  Load in Daily Publisher
                </button>
              </div>
              {b.hindiText && <p className="text-xs text-amber-200 font-serif font-bold">"{b.hindiText}"</p>}
              <p className="text-xs text-slate-400">{b.blessingText}</p>
              <div className="text-[10px] text-slate-500">
                Source: {b.authorSource} • Ref: {b.sourceReference}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ==================== TAB 9: EXPERTS ==================== */}
      {activeTab === 'experts' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          {experts.map((exp) => (
            <div key={exp.id} className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
              <div className="flex items-center space-x-3">
                <img src={exp.profilePhoto} alt={exp.name} className="w-12 h-12 rounded-xl object-cover" />
                <div>
                  <h4 className="text-sm font-bold text-white flex items-center space-x-1.5">
                    <span>{exp.name}</span>
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  </h4>
                  <p className="text-xs text-amber-400">{exp.title}</p>
                </div>
              </div>
              <p className="text-xs text-slate-400">{exp.bio}</p>
              <div className="text-xs text-slate-300">
                Fee: ₹{exp.consultationPrice} • Experience: {exp.experienceYears} Years
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ==================== TAB 10: BLESSING WALL ==================== */}
      {activeTab === 'wall' && (
        <div className="space-y-3 text-xs">
          {wallSubmissions.map((w) => (
            <div key={w.id} className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between">
              <div>
                <h4 className="text-sm font-bold text-white">{w.userName} ({w.city})</h4>
                <p className="text-xs text-slate-400 italic">"{w.message}"</p>
                <span className="text-[10px] text-amber-500">{w.category} • {w.likesCount || 0} Likes</span>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-bold">
                {w.status}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* ==================== TAB 11: INQUIRIES ==================== */}
      {activeTab === 'inquiries' && (
        <div className="space-y-3 text-xs">
          {inquiries.map((inq) => (
            <div key={inq.id} className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-white">{inq.customerName} - {inq.customerPhone}</h4>
                <span className="text-xs text-amber-400 font-bold">{inq.inquiryNumber}</span>
              </div>
              <p className="text-xs text-slate-300 font-semibold">{inq.requirement} (Budget: {inq.budget})</p>
              <p className="text-xs text-slate-400">{inq.message}</p>
              <span className="text-[10px] text-slate-500">Received: {new Date(inq.createdAt).toLocaleString()}</span>
            </div>
          ))}
        </div>
      )}

      {/* ==================== MODALS ==================== */}
      
      {/* Marketplace Product Edit/Create Modal */}
      <MarketplaceProductEditModal
        product={editingProduct}
        categories={categories}
        isOpen={isProductModalOpen}
        onClose={() => setIsProductModalOpen(false)}
        onSave={handleSaveProduct}
      />

      {/* Category Create/Edit Modal */}
      {isCategoryModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-2xl text-xs text-slate-200">
            <h3 className="text-base font-black text-white">
              {editingCategoryId ? 'Edit Sacred Category' : 'Create Sacred Category'}
            </h3>

            <form onSubmit={handleSaveCategory} className="space-y-3">
              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Category Name (English) *</label>
                <input
                  type="text"
                  required
                  value={catName}
                  onChange={(e) => setCatName(e.target.value)}
                  placeholder="e.g. Royal Sinhas & Thrones"
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Hindi Name (हिंदी नाम)</label>
                <input
                  type="text"
                  value={catHindiName}
                  onChange={(e) => setCatHindiName(e.target.value)}
                  placeholder="e.g. शाही सिंहासन"
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white outline-none focus:border-amber-500 font-serif"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Icon / Emoji</label>
                  <input
                    type="text"
                    value={catIcon}
                    onChange={(e) => setCatIcon(e.target.value)}
                    placeholder="👑 or 🪷"
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Sort Order</label>
                  <input
                    type="number"
                    value={catSortOrder}
                    onChange={(e) => setCatSortOrder(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Description</label>
                <textarea
                  rows={2}
                  value={catDescription}
                  onChange={(e) => setCatDescription(e.target.value)}
                  placeholder="Brief description for SEO and catalog filtering..."
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white outline-none focus:border-amber-500 resize-none"
                />
              </div>

              <div className="flex items-center space-x-2 pt-2">
                <input
                  type="checkbox"
                  id="cat-enabled"
                  checked={catEnabled}
                  onChange={(e) => setCatEnabled(e.target.checked)}
                  className="w-4 h-4 rounded text-amber-500 focus:ring-amber-400"
                />
                <label htmlFor="cat-enabled" className="text-slate-300 font-semibold cursor-pointer">
                  Enabled in Marketplace Filter Bar
                </label>
              </div>

              <div className="flex justify-end space-x-2 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsCategoryModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-500 text-slate-950 font-black flex items-center space-x-1"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Save Category</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Temple Template Create/Edit Modal */}
      {isTemplateModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="max-w-xl w-full bg-slate-900 rounded-3xl border border-slate-800 p-6 space-y-4 shadow-2xl text-xs my-8 text-slate-200">
            <h3 className="text-base font-black text-white">
              {editingTemplateId ? 'Edit Temple Mandir Template' : 'Create New Temple Mandir Template'}
            </h3>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                const catObj = TEMPLE_CATEGORIES.find((c) => c.id === templateCategory);
                if (editingTemplateId) {
                  setTempleTemplates((prev) =>
                    prev.map((t) =>
                      t.id === editingTemplateId
                        ? {
                            ...t,
                            name: templateName,
                            hindiName: templateHindiName,
                            categoryId: templateCategory,
                            categoryLabel: catObj?.name || 'Temple Mandir',
                            imageUrl: templateImageUrl,
                            frameStyle: templateFrameStyle,
                            mantra: templateMantra || '॥ ॐ नमः शिवाय ॥',
                            defaultHindiVachan: templateHindiVachan,
                            defaultEnglishBlessing: templateEnglishBlessing,
                            themeAura: templateThemeAura,
                          }
                        : t
                    )
                  );
                  setMessage('Temple template updated successfully!');
                } else {
                  const newTmpl: TempleTemplate = {
                    id: `tmpl-${Date.now()}`,
                    name: templateName,
                    hindiName: templateHindiName || templateName,
                    categoryId: templateCategory,
                    categoryLabel: catObj?.name || 'Temple Mandir',
                    imageUrl:
                      templateImageUrl ||
                      'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=1200&q=90',
                    frameStyle: templateFrameStyle,
                    frameColor: 'border-amber-400',
                    borderWidth: 'border-4',
                    mantra: templateMantra || '॥ ॐ नमः शिवाय ॥',
                    defaultHindiVachan: templateHindiVachan || 'कल्याण किता, सब दुःख दूर किते।',
                    defaultEnglishBlessing: templateEnglishBlessing || 'May Guruji bless your home with eternal grace.',
                    themeAura: templateThemeAura,
                    attribution: 'Guruji Spiritual Studio Collection',
                    aspectRatio: '3:4',
                  };
                  setTempleTemplates((prev) => [newTmpl, ...prev]);
                  setMessage('New temple template created successfully!');
                }
                setIsTemplateModalOpen(false);
                setTimeout(() => setMessage(''), 4000);
              }}
              className="space-y-3"
            >
              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Template Title *</label>
                <input
                  type="text"
                  required
                  value={templateName}
                  onChange={(e) => setTemplateName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white outline-none focus:border-amber-500 font-bold"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Hindi Name</label>
                <input
                  type="text"
                  value={templateHindiName}
                  onChange={(e) => setTemplateHindiName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white outline-none focus:border-amber-500 font-serif"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Mandir Image URL</label>
                <input
                  type="url"
                  required
                  value={templateImageUrl}
                  onChange={(e) => setTemplateImageUrl(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white outline-none focus:border-amber-500"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsTemplateModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-500 text-slate-950 font-black"
                >
                  Save Template
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
