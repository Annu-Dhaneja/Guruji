import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Search,
  Filter,
  Plus,
  Edit,
  Edit2,
  Trash2,
  CheckCircle2,
  Clock,
  Zap,
  Download,
  ExternalLink,
  MessageSquare,
  RefreshCw,
  Eye,
  Sliders,
  DollarSign,
  Package,
  TrendingUp,
  X,
  FileCheck,
  AlertCircle,
  Phone,
  Mail,
  User,
  ShieldAlert,
  Image as ImageIcon,
  Star,
  Layers,
  Upload,
  Check,
  Flame,
  Rocket,
  Share2,
  Film,
  Briefcase,
  Megaphone,
  ShoppingBag,
  Video,
  Save,
  HelpCircle,
  Award,
} from 'lucide-react';
import {
  GraphicDesignService,
  GraphicDesignPackage,
  DeliverySpeedOption,
  GraphicDesignInquiry,
  GraphicDesignSettings,
  GraphicDesignCategory,
} from '../../../types';
import { GRAPHIC_DESIGN_CATEGORIES, GRAPHIC_DESIGN_MAIN_CATEGORIES } from '../../../data/graphicDesignData';
import { getCMSData, saveCMSSection } from '../../../utils';

export const GraphicDesignCMS: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'categories' | 'services' | 'inquiries' | 'speed-tiers' | 'settings'>('categories');

  // Categories & Marquee Cards State
  const [categories, setCategories] = useState<GraphicDesignCategory[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState<boolean>(true);
  const [selectedCategory, setSelectedCategory] = useState<GraphicDesignCategory | null>(null);
  const [isEditingCategory, setIsEditingCategory] = useState<boolean>(false);
  const [isCreatingCategory, setIsCreatingCategory] = useState<boolean>(false);
  const [categoryForm, setCategoryForm] = useState<Partial<GraphicDesignCategory>>({});

  // Services State
  const [services, setServices] = useState<GraphicDesignService[]>([]);
  const [servicesLoading, setServicesLoading] = useState<boolean>(true);
  const [serviceSearch, setServiceSearch] = useState<string>('');
  const [serviceCategoryFilter, setServiceCategoryFilter] = useState<string>('all');
  const [selectedService, setSelectedService] = useState<GraphicDesignService | null>(null);
  const [isEditingService, setIsEditingService] = useState<boolean>(false);
  const [isCreatingService, setIsCreatingService] = useState<boolean>(false);
  const [serviceForm, setServiceForm] = useState<Partial<GraphicDesignService>>({});

  // Sub-items editor states inside Service Form
  const [newFormatInput, setNewFormatInput] = useState<string>('');
  const [newIncludedInput, setNewIncludedInput] = useState<string>('');
  const [newNotIncludedInput, setNewNotIncludedInput] = useState<string>('');
  const [newFaqQ, setNewFaqQ] = useState<string>('');
  const [newFaqA, setNewFaqA] = useState<string>('');
  const [newReviewName, setNewReviewName] = useState<string>('');
  const [newReviewRating, setNewReviewRating] = useState<number>(5);
  const [newReviewComment, setNewReviewComment] = useState<string>('');

  // Inquiries State
  const [inquiries, setInquiries] = useState<GraphicDesignInquiry[]>([]);
  const [inquiriesLoading, setInquiriesLoading] = useState<boolean>(true);
  const [inquirySearch, setInquirySearch] = useState<string>('');
  const [inquiryStatusFilter, setInquiryStatusFilter] = useState<string>('ALL');
  const [selectedInquiry, setSelectedInquiry] = useState<GraphicDesignInquiry | null>(null);
  const [inquiryStatusUpdate, setInquiryStatusUpdate] = useState<string>('PENDING');
  const [inquiryAdminNotes, setInquiryAdminNotes] = useState<string>('');
  const [inquiryQuotedPrice, setInquiryQuotedPrice] = useState<number | string>('');
  const [inquiryDesigner, setInquiryDesigner] = useState<string>('Annu Dhaneja');

  // Speed Tiers & Settings State
  const [settings, setSettings] = useState<GraphicDesignSettings | null>(null);
  const [settingsLoading, setSettingsLoading] = useState<boolean>(true);
  const [newMarqueeText, setNewMarqueeText] = useState<string>('');
  const [newMarqueeIcon, setNewMarqueeIcon] = useState<string>('Sparkles');
  const [newMarqueeHighlight, setNewMarqueeHighlight] = useState<boolean>(false);

  // Status & Feedback Banner
  const [statusMessage, setStatusMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const [isSaving, setIsSaving] = useState<boolean>(false);

  const showStatus = (text: string, type: 'success' | 'error' = 'success') => {
    setStatusMessage({ text, type });
    setTimeout(() => setStatusMessage(null), 4000);
  };

  // Fetch all initial data
  const fetchData = async () => {
    try {
      setCategoriesLoading(true);
      setServicesLoading(true);
      setInquiriesLoading(true);
      setSettingsLoading(true);

      const cms = await getCMSData();
      if (cms.graphicDesignCategories && cms.graphicDesignCategories.length > 0) {
        setCategories(cms.graphicDesignCategories);
      }
      if (cms.graphicDesignServices && cms.graphicDesignServices.length > 0) {
        setServices(cms.graphicDesignServices);
      }
      if (cms.graphicDesignSettings) {
        setSettings(cms.graphicDesignSettings);
      }

      const [catRes, srvRes, inqRes, setRes] = await Promise.all([
        fetch('/api/graphic-design/categories').catch(() => null),
        fetch('/api/graphic-design/services').catch(() => null),
        fetch('/api/graphic-design/inquiries').catch(() => null),
        fetch('/api/graphic-design/settings').catch(() => null),
      ]);

      if (catRes && catRes.ok && (!cms.graphicDesignCategories || cms.graphicDesignCategories.length === 0)) {
        const catData = await catRes.json();
        setCategories(catData);
      }
      if (srvRes && srvRes.ok && (!cms.graphicDesignServices || cms.graphicDesignServices.length === 0)) {
        const srvData = await srvRes.json();
        setServices(srvData);
      }
      if (inqRes && inqRes.ok) {
        const inqData = await inqRes.json();
        setInquiries(inqData);
      }
      if (setRes && setRes.ok && !cms.graphicDesignSettings) {
        const setData = await setRes.json();
        setSettings(setData);
      }
    } catch (err) {
      console.error('Error loading Graphic Design CMS data:', err);
      showStatus('Failed to load data from server. Please refresh.', 'error');
    } finally {
      setCategoriesLoading(false);
      setServicesLoading(false);
      setInquiriesLoading(false);
      setSettingsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Category Actions
  const handleCreateCategory = () => {
    setCategoryForm({
      id: `cat-${Date.now()}`,
      slug: 'new-category',
      name: '',
      tagline: '',
      description: '',
      icon: 'Sparkles',
      startingPrice: 99,
      fastestDelivery: '10 min',
      servicesCount: 1,
      imageUrl: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&w=800&q=80',
      badge: 'Fast Delivery',
      popular: false,
      row: 1,
      displayOrder: categories.length + 1,
      enabled: true,
    });
    setIsCreatingCategory(true);
    setIsEditingCategory(false);
  };

  const handleEditCategory = (cat: GraphicDesignCategory) => {
    setCategoryForm(JSON.parse(JSON.stringify(cat)));
    setIsEditingCategory(true);
    setIsCreatingCategory(false);
  };

  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!categoryForm.name || !categoryForm.slug) {
      showStatus('Category name and slug are required.', 'error');
      return;
    }

    try {
      setIsSaving(true);
      const isNew = isCreatingCategory;
      let updatedCategories: GraphicDesignCategory[];
      const savedCategory = categoryForm as GraphicDesignCategory;

      if (isNew) {
        updatedCategories = [...categories, savedCategory];
      } else {
        updatedCategories = categories.map((c) => (c.id === savedCategory.id ? savedCategory : c));
      }

      await saveCMSSection('graphicDesignCategories', updatedCategories);
      setCategories(updatedCategories);

      const url = isNew ? '/api/graphic-design/categories' : `/api/graphic-design/categories/${categoryForm.id}`;
      const method = isNew ? 'POST' : 'PUT';

      fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(categoryForm),
      }).catch(() => {});

      showStatus(`Category "${savedCategory.name}" saved permanently to Firestore.`);
      setIsCreatingCategory(false);
      setIsEditingCategory(false);
      setCategoryForm({});
    } catch (err) {
      console.error(err);
      showStatus('Error saving category to Firestore.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteCategory = async (id: string, name: string) => {
    if (!window.confirm(`Are you sure you want to delete category "${name}"?`)) return;
    try {
      const updatedCategories = categories.filter((c) => c.id !== id);
      await saveCMSSection('graphicDesignCategories', updatedCategories);
      setCategories(updatedCategories);

      fetch(`/api/graphic-design/categories/${id}`, { method: 'DELETE' }).catch(() => {});
      showStatus(`Deleted category "${name}" from Firestore.`);
    } catch (err) {
      console.error(err);
      showStatus('Error deleting category.', 'error');
    }
  };

  const handleToggleCategoryEnabled = async (cat: GraphicDesignCategory) => {
    const updated = { ...cat, enabled: !cat.enabled };
    try {
      const updatedCategories = categories.map((c) => (c.id === cat.id ? updated : c));
      await saveCMSSection('graphicDesignCategories', updatedCategories);
      setCategories(updatedCategories);

      fetch(`/api/graphic-design/categories/${cat.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated),
      }).catch(() => {});

      showStatus(`Category "${cat.name}" is now ${updated.enabled ? 'Active' : 'Disabled'}.`);
    } catch (err) {
      console.error(err);
    }
  };

  // Filtered Services
  const filteredServices = services.filter((s) => {
    const matchesCategory = serviceCategoryFilter === 'all' || s.category === serviceCategoryFilter;
    const q = serviceSearch.toLowerCase().trim();
    const matchesSearch =
      !q ||
      s.title.toLowerCase().includes(q) ||
      s.shortDescription.toLowerCase().includes(q) ||
      s.categoryName.toLowerCase().includes(q);
    return matchesCategory && matchesSearch;
  });

  // Filtered Inquiries
  const filteredInquiries = inquiries.filter((inq) => {
    const matchesStatus = inquiryStatusFilter === 'ALL' || inq.status === inquiryStatusFilter;
    const q = inquirySearch.toLowerCase().trim();
    const matchesSearch =
      !q ||
      inq.customerName.toLowerCase().includes(q) ||
      inq.customerPhone.toLowerCase().includes(q) ||
      inq.customerEmail.toLowerCase().includes(q) ||
      inq.id.toLowerCase().includes(q) ||
      inq.serviceTitle.toLowerCase().includes(q);
    return matchesStatus && matchesSearch;
  });

  // =========================================================================
  // SERVICE ACTIONS
  // =========================================================================

  const handleOpenCreateService = () => {
    setServiceForm({
      id: `gd-srv-${Date.now()}`,
      slug: '',
      title: '',
      category: 'social-media',
      categoryName: 'Social Media Design',
      subcategory: '',
      shortDescription: '',
      fullDescription: '',
      startingPrice: 149,
      salePrice: 129,
      originalPrice: 299,
      rating: 4.9,
      reviewsCount: 1,
      completedOrders: 0,
      standardDeliveryTime: '24 Hours',
      fastestDeliveryTime: '10 Mins',
      turnaroundTime: '24 Hours',
      revisions: '3 Revisions',
      fileFormats: ['PNG (4K)', 'JPG', 'Layered PSD / AI', 'Canva Link'],
      dimensions: '1080 x 1080 px',
      imageUrl: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?auto=format&fit=crop&w=1000&q=80',
      rotationImage: '',
      gallery: [
        'https://images.unsplash.com/photo-1626785774573-4b799315345d?auto=format&fit=crop&w=1000&q=80',
        'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1000&q=80',
      ],
      features: ['Vector Precision', 'High-Res 300 DPI Export', 'Commercial Usage License'],
      deliverables: ['Vector AI/EPS', 'Print-Ready PDF', 'Transparent 4K PNG'],
      requirements: ['Brand Logo or Name', 'Dimension specifications', 'Project brief and copy'],
      tags: ['graphic-design', 'vector', 'branding'],
      seoTitle: '',
      seoDescription: '',
      status: 'active',
      popular: false,
      trending: true,
      featured: true,
      expressAvailable: true,
      packages: [
        {
          id: `pkg-starter-${Date.now()}`,
          name: 'Starter Single',
          price: 149,
          originalPrice: 299,
          deliveryTime: '24 Hours',
          revisions: '2 Revisions',
          concepts: 1,
          features: ['1 Custom Design Concept', 'High-Res 4K PNG & JPG', 'Commercial License'],
        },
        {
          id: `pkg-biz-${Date.now()}`,
          name: 'Business Growth Pack',
          price: 499,
          originalPrice: 999,
          deliveryTime: '24 - 48 Hours',
          revisions: 'Unlimited Revisions',
          concepts: 3,
          popular: true,
          features: ['3 Cohesive Concepts', 'Layered PSD / AI Source Files', 'Canva Editable Link', 'Priority Turnaround'],
        },
        {
          id: `pkg-prem-${Date.now()}`,
          name: 'Agency Elite Suite',
          price: 1299,
          originalPrice: 2999,
          deliveryTime: '3 - 5 Days',
          revisions: 'Unlimited Revisions',
          concepts: 5,
          features: ['Full Campaign Asset Suite', 'All Formats (AI, PSD, SVG, PDF, MP4)', 'Emergency Queue Jump', 'Dedicated Senior Art Director'],
        },
      ],
      whatsIncluded: [
        'Custom graphics tailored to brand guidelines & color harmony',
        'Crystal clear 4K exports (PNG, JPG, WebP, PDF)',
        'Free revisions with fast turnaround',
        'Direct WhatsApp support & design consultation',
      ],
      whatsNotIncluded: [
        'Physical print delivery shipment',
        'Legal trademark / copyright registry fees',
      ],
      faqs: [
        {
          question: 'How fast can I get my design files?',
          answer: 'Standard turnaround is 24 hours. If you select 10-Min, 30-Min, or 1-Hour delivery speed, your order is assigned immediately to a live senior designer.',
        },
        {
          question: 'Can I edit the designs myself later?',
          answer: 'Yes! We provide editable Canva links and layered PSD/AI files with our Business and Premium packages.',
        },
      ],
      reviews: [
        {
          name: 'Priya Sharma',
          rating: 5,
          date: 'Yesterday',
          comment: 'Outstanding quality and delivered within 30 minutes. Annu Dhaneja and team are true design masters!',
          verified: true,
        },
      ],
    });
    setIsCreatingService(true);
    setIsEditingService(false);
  };

  const handleEditService = (service: GraphicDesignService) => {
    setServiceForm(JSON.parse(JSON.stringify(service)));
    setIsEditingService(true);
    setIsCreatingService(false);
  };

  const handleSaveService = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!serviceForm.title || !serviceForm.category) {
      showStatus('Please provide a service title and category.', 'error');
      return;
    }

    try {
      setIsSaving(true);
      const isNew = isCreatingService;
      let updatedServices: GraphicDesignService[];
      const savedService = serviceForm as GraphicDesignService;

      if (isNew) {
        updatedServices = [savedService, ...services];
      } else {
        updatedServices = services.map((s) => (s.id === savedService.id ? savedService : s));
      }

      await saveCMSSection('graphicDesignServices', updatedServices);
      setServices(updatedServices);

      const url = isNew ? '/api/graphic-design/services' : `/api/graphic-design/services/${serviceForm.id}`;
      const method = isNew ? 'POST' : 'PUT';

      fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(serviceForm),
      }).catch(() => {});

      showStatus(`Service "${savedService.title}" saved permanently to Firestore.`);
      setIsCreatingService(false);
      setIsEditingService(false);
      setServiceForm({});
    } catch (err) {
      console.error(err);
      showStatus('Error saving graphic design service to Firestore.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteService = async (id: string, title: string) => {
    if (!window.confirm(`Are you sure you want to delete "${title}"? This cannot be undone.`)) {
      return;
    }

    try {
      const updatedServices = services.filter((s) => s.id !== id);
      await saveCMSSection('graphicDesignServices', updatedServices);
      setServices(updatedServices);

      fetch(`/api/graphic-design/services/${id}`, { method: 'DELETE' }).catch(() => {});
      showStatus(`Deleted service "${title}" from Firestore.`);
    } catch (err) {
      console.error(err);
      showStatus('Error deleting service.', 'error');
    }
  };

  const handleToggleBadge = async (service: GraphicDesignService, key: 'popular' | 'trending' | 'expressAvailable') => {
    const updated = { ...service, [key]: !service[key] };
    try {
      const updatedServices = services.map((s) => (s.id === service.id ? updated : s));
      await saveCMSSection('graphicDesignServices', updatedServices);
      setServices(updatedServices);

      fetch(`/api/graphic-design/services/${service.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated),
      }).catch(() => {});

      showStatus(`Updated ${key} status for "${service.title}"`);
    } catch (err) {
      console.error(err);
    }
  };

  // =========================================================================
  // INQUIRY ACTIONS
  // =========================================================================

  const handleOpenInquiryModal = (inquiry: GraphicDesignInquiry) => {
    setSelectedInquiry(inquiry);
    setInquiryStatusUpdate(inquiry.status);
    setInquiryAdminNotes(inquiry.adminNotes || '');
    setInquiryQuotedPrice(inquiry.quotedPrice || '');
    setInquiryDesigner(inquiry.assignedDesigner || 'Annu Dhaneja');
  };

  const handleSaveInquiry = async () => {
    if (!selectedInquiry) return;

    try {
      setIsSaving(true);
      const updatedPayload = {
        status: inquiryStatusUpdate,
        adminNotes: inquiryAdminNotes,
        quotedPrice: Number(inquiryQuotedPrice) || 0,
        assignedDesigner: inquiryDesigner,
      };

      const res = await fetch(`/api/graphic-design/inquiries/${selectedInquiry.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedPayload),
      });

      if (res.ok) {
        const saved = await res.json();
        setInquiries((prev) => prev.map((i) => (i.id === saved.id ? saved : i)));
        setSelectedInquiry(null);
        showStatus(`Inquiry ${saved.id} updated to ${saved.status}`);
      } else {
        showStatus('Failed to update inquiry.', 'error');
      }
    } catch (err) {
      console.error(err);
      showStatus('Network error while updating inquiry.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteInquiry = async (id: string) => {
    if (!window.confirm(`Delete inquiry ${id}?`)) return;
    try {
      const res = await fetch(`/api/graphic-design/inquiries/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setInquiries((prev) => prev.filter((i) => i.id !== id));
        if (selectedInquiry?.id === id) setSelectedInquiry(null);
        showStatus(`Inquiry ${id} deleted.`);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // =========================================================================
  // SPEED TIERS & SETTINGS ACTIONS
  // =========================================================================

  const handleSaveSettings = async () => {
    if (!settings) return;
    try {
      setIsSaving(true);
      await saveCMSSection('graphicDesignSettings', settings);

      fetch('/api/graphic-design/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      }).catch(() => {});

      showStatus('Graphic design settings and delivery speed tiers saved permanently to Firestore!');
    } catch (err) {
      console.error(err);
      showStatus('Error saving settings to Firestore.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleUpdateSpeedTier = (index: number, field: keyof DeliverySpeedOption, value: any) => {
    if (!settings) return;
    const newTiers = [...settings.deliveryTiers];
    newTiers[index] = { ...newTiers[index], [field]: value };
    setSettings({ ...settings, deliveryTiers: newTiers });
  };

  const handleAddMarqueeItem = () => {
    if (!newMarqueeText.trim() || !settings) return;
    const newItems = [
      ...settings.marqueeItems,
      { text: newMarqueeText.trim().toUpperCase(), icon: newMarqueeIcon, highlight: newMarqueeHighlight },
    ];
    setSettings({ ...settings, marqueeItems: newItems });
    setNewMarqueeText('');
    setNewMarqueeHighlight(false);
  };

  const handleRemoveMarqueeItem = (index: number) => {
    if (!settings) return;
    const newItems = settings.marqueeItems.filter((_, i) => i !== index);
    setSettings({ ...settings, marqueeItems: newItems });
  };

  return (
    <div className="space-y-6 text-slate-200">
      {/* Top Banner & Stats */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-purple-950/60 via-slate-900 to-amber-950/40 border border-purple-500/30 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-purple-500/20 text-purple-300 border border-purple-500/30">
              <Sparkles className="w-5 h-5 text-amber-400" />
            </span>
            <h2 className="text-xl font-black text-white">Graphic Design Marketplace CMS</h2>
            <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              Live & Editable
            </span>
          </div>
          <p className="text-xs text-slate-400">
            Control service packages, turnaround delivery tiers, client custom quotes, and promotional banners.
          </p>
        </div>

        {/* Global Quick Action Buttons */}
        <div className="flex items-center gap-3">
          <button
            onClick={fetchData}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-300 flex items-center gap-2 border border-slate-700 transition-all"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${servicesLoading ? 'animate-spin' : ''}`} /> Refresh Data
          </button>
          <button
            onClick={handleOpenCreateService}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-amber-500 text-white hover:opacity-90 text-xs font-bold flex items-center gap-2 shadow-lg shadow-purple-600/30 transition-all"
          >
            <Plus className="w-4 h-4" /> Add New Design Service
          </button>
        </div>
      </div>

      {/* Status Toast Alert */}
      {statusMessage && (
        <div
          className={`p-3.5 rounded-xl border text-xs font-bold flex items-center gap-2.5 transition-all shadow-lg ${
            statusMessage.type === 'success'
              ? 'bg-emerald-950/80 border-emerald-500/40 text-emerald-300'
              : 'bg-rose-950/80 border-rose-500/40 text-rose-300'
          }`}
        >
          {statusMessage.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
          )}
          <span>{statusMessage.text}</span>
        </div>
      )}

      {/* Metrics Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
          <div className="text-[11px] text-slate-400 font-semibold uppercase">Total Catalog Services</div>
          <div className="text-2xl font-black text-white flex items-center gap-2">
            <span>{services.length}</span>
            <span className="text-xs font-bold text-purple-400">Services</span>
          </div>
        </div>
        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
          <div className="text-[11px] text-slate-400 font-semibold uppercase">Pending Client Inquiries</div>
          <div className="text-2xl font-black text-amber-400 flex items-center gap-2">
            <span>{inquiries.filter((i) => i.status === 'PENDING' || i.status === 'IN_REVIEW').length}</span>
            <span className="text-xs font-bold text-slate-400">/ {inquiries.length} Total</span>
          </div>
        </div>
        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
          <div className="text-[11px] text-slate-400 font-semibold uppercase">Ultra-Fast Tier</div>
          <div className="text-2xl font-black text-cyan-400 flex items-center gap-2">
            <span>10 Mins</span>
            <span className="text-xs font-bold text-slate-400">Flash</span>
          </div>
        </div>
        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
          <div className="text-[11px] text-slate-400 font-semibold uppercase">Starting Price</div>
          <div className="text-2xl font-black text-emerald-400 flex items-center gap-2">
            <span>₹149</span>
            <span className="text-xs font-bold text-slate-400">Lowest</span>
          </div>
        </div>
      </div>

      {/* Tabs Header */}
      <div className="flex border-b border-slate-800 gap-2 overflow-x-auto pb-1">
        <button
          onClick={() => {
            setActiveTab('categories');
            setIsCreatingCategory(false);
            setIsEditingCategory(false);
          }}
          className={`pb-3 px-4 text-xs font-bold flex items-center gap-2 border-b-2 transition-all whitespace-nowrap ${
            activeTab === 'categories'
              ? 'border-purple-500 text-purple-400 font-extrabold'
              : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          <Sparkles className="w-4 h-4 text-amber-400" /> Categories & Scrolling Cards ({categories.length})
        </button>

        <button
          onClick={() => {
            setActiveTab('services');
            setIsCreatingService(false);
            setIsEditingService(false);
          }}
          className={`pb-3 px-4 text-xs font-bold flex items-center gap-2 border-b-2 transition-all whitespace-nowrap ${
            activeTab === 'services'
              ? 'border-purple-500 text-purple-400 font-extrabold'
              : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          <Layers className="w-4 h-4" /> 1. Services Catalog ({services.length})
        </button>

        <button
          onClick={() => {
            setActiveTab('inquiries');
            setIsCreatingService(false);
            setIsEditingService(false);
          }}
          className={`pb-3 px-4 text-xs font-bold flex items-center gap-2 border-b-2 transition-all whitespace-nowrap ${
            activeTab === 'inquiries'
              ? 'border-purple-500 text-purple-400 font-extrabold'
              : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          <MessageSquare className="w-4 h-4" /> 2. Client Quotes & Inquiries ({inquiries.length})
          {inquiries.filter((i) => i.status === 'PENDING').length > 0 && (
            <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-amber-500 text-slate-950 font-black">
              {inquiries.filter((i) => i.status === 'PENDING').length}
            </span>
          )}
        </button>

        <button
          onClick={() => {
            setActiveTab('speed-tiers');
            setIsCreatingService(false);
            setIsEditingService(false);
          }}
          className={`pb-3 px-4 text-xs font-bold flex items-center gap-2 border-b-2 transition-all whitespace-nowrap ${
            activeTab === 'speed-tiers'
              ? 'border-purple-500 text-purple-400 font-extrabold'
              : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          <Zap className="w-4 h-4" /> 3. Speed Tiers & Surcharges
        </button>

        <button
          onClick={() => {
            setActiveTab('settings');
            setIsCreatingService(false);
            setIsEditingService(false);
          }}
          className={`pb-3 px-4 text-xs font-bold flex items-center gap-2 border-b-2 transition-all whitespace-nowrap ${
            activeTab === 'settings'
              ? 'border-purple-500 text-purple-400 font-extrabold'
              : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          <Sliders className="w-4 h-4" /> 4. Hero Banner & Marquee Ticker
        </button>
      </div>

      {/* ========================================================================= */}
      {/* TAB 0: CATEGORIES & HOMEPAGE SCROLLING CARDS */}
      {/* ========================================================================= */}
      {activeTab === 'categories' && !isCreatingCategory && !isEditingCategory && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-900/60 p-4 rounded-2xl border border-slate-800">
            <div>
              <h3 className="text-sm font-black text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400" /> Homepage Animated Scrolling Categories ({categories.length})
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Manage the service categories that animate seamlessly across Row 1 (Right→Left) and Row 2 (Left→Right) on the homepage.
              </p>
            </div>
            <button
              onClick={handleCreateCategory}
              className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-purple-900/30 whitespace-nowrap"
            >
              <Plus className="w-4 h-4" /> Add New Category
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {categories.map((cat) => (
              <div
                key={cat.id}
                className={`p-4 rounded-2xl border transition-all flex flex-col justify-between space-y-3 ${
                  cat.enabled !== false
                    ? 'bg-slate-900/80 border-slate-800 hover:border-purple-500/50'
                    : 'bg-slate-950/60 border-slate-800/40 opacity-60'
                }`}
              >
                <div className="space-y-2.5">
                  <div className="relative h-36 rounded-xl overflow-hidden bg-slate-950">
                    <img src={cat.imageUrl} alt={cat.name} className="w-full h-full object-cover" />
                    <div className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-slate-950/85 text-[11px] font-black text-amber-300 border border-white/20 flex items-center gap-1">
                      <span>{cat.suit || '♠'}</span>
                      <span className="text-[10px] text-white">{cat.badge || 'PRO'}</span>
                    </div>
                    <div className="absolute top-2 right-2 px-2 py-0.5 rounded-md bg-slate-950/80 text-[10px] font-bold text-amber-300 border border-amber-500/30 flex items-center gap-1">
                      <Zap className="w-2.5 h-2.5" /> {cat.fastestDelivery}
                    </div>
                    <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded-md bg-slate-950/80 text-[10px] font-extrabold text-teal-300 border border-teal-500/30">
                      {cat.servicesCount}+ Services
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-black text-white truncate">{cat.name}</h4>
                      <span className="text-xs font-black text-amber-400">₹{cat.startingPrice}</span>
                    </div>
                    <p className="text-[11px] text-slate-400 line-clamp-2 mt-1">{cat.tagline}</p>
                    {cat.features && cat.features.length > 0 && (
                      <div className="mt-2 space-y-0.5 text-[10px] text-slate-300 bg-slate-950/50 p-2 rounded-lg border border-slate-800">
                        {cat.features.slice(0, 2).map((f, i) => (
                          <div key={i} className="flex items-center gap-1 truncate text-emerald-400">
                            <span>✔</span> <span className="text-slate-300 truncate">{f}</span>
                          </div>
                        ))}
                      </div>
                    )}
                    <div className="text-[10px] text-purple-400/80 font-mono mt-1">/services/{cat.slug}</div>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-800 flex items-center justify-between gap-2">
                  <button
                    onClick={() => handleToggleCategoryEnabled(cat)}
                    className={`px-2 py-1 rounded text-[10px] font-bold ${
                      cat.enabled !== false
                        ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/30'
                        : 'bg-rose-950 text-rose-400 border border-rose-500/30'
                    }`}
                  >
                    {cat.enabled !== false ? 'Active' : 'Disabled'}
                  </button>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleEditCategory(cat)}
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-purple-600 text-slate-300 hover:text-white transition-colors"
                      title="Edit Category"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeleteCategory(cat.id, cat.name)}
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-600 text-slate-300 hover:text-white transition-colors"
                      title="Delete Category"
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

      {/* CREATE / EDIT CATEGORY FORM */}
      {activeTab === 'categories' && (isCreatingCategory || isEditingCategory) && (
        <form onSubmit={handleSaveCategory} className="space-y-6 bg-slate-900/90 p-6 rounded-2xl border border-purple-900/40">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <h3 className="text-base font-black text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-purple-400" />
              {isCreatingCategory ? 'Create New Category' : `Edit Category: ${categoryForm.name}`}
            </h3>
            <button
              type="button"
              onClick={() => {
                setIsCreatingCategory(false);
                setIsEditingCategory(false);
              }}
              className="p-1 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">Category Title *</label>
              <input
                type="text"
                required
                value={categoryForm.name || ''}
                onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
                placeholder="e.g. Social Media Design"
                className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white focus:border-purple-500 outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">URL Slug *</label>
              <input
                type="text"
                required
                value={categoryForm.slug || ''}
                onChange={(e) => setCategoryForm({ ...categoryForm, slug: e.target.value })}
                placeholder="e.g. social-media-design"
                className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white focus:border-purple-500 outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">Tagline</label>
              <input
                type="text"
                value={categoryForm.tagline || ''}
                onChange={(e) => setCategoryForm({ ...categoryForm, tagline: e.target.value })}
                placeholder="e.g. Posts, Stories & Carousels that make your brand stand out."
                className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white focus:border-purple-500 outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">Starting Price (₹)</label>
              <input
                type="number"
                value={categoryForm.startingPrice || 99}
                onChange={(e) => setCategoryForm({ ...categoryForm, startingPrice: Number(e.target.value) })}
                className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white focus:border-purple-500 outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">Fastest Delivery Speed</label>
              <input
                type="text"
                value={categoryForm.fastestDelivery || '10 min'}
                onChange={(e) => setCategoryForm({ ...categoryForm, fastestDelivery: e.target.value })}
                placeholder="e.g. 10 min or 30 min"
                className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white focus:border-purple-500 outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">Services Count</label>
              <input
                type="number"
                value={categoryForm.servicesCount || 15}
                onChange={(e) => setCategoryForm({ ...categoryForm, servicesCount: Number(e.target.value) })}
                className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white focus:border-purple-500 outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">Marquee Row Assignment</label>
              <select
                value={categoryForm.row || 1}
                onChange={(e) => setCategoryForm({ ...categoryForm, row: Number(e.target.value) as 1 | 2 })}
                className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white focus:border-purple-500 outline-none"
              >
                <option value={1}>Row 1 (Moves Right to Left - 35s)</option>
                <option value={2}>Row 2 (Moves Left to Right - 45s)</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">Icon Name</label>
              <select
                value={categoryForm.icon || 'Sparkles'}
                onChange={(e) => setCategoryForm({ ...categoryForm, icon: e.target.value })}
                className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white focus:border-purple-500 outline-none"
              >
                <option value="Share2">Share2 (Social)</option>
                <option value="Sparkles">Sparkles (Branding)</option>
                <option value="Film">Film (Reels/Video)</option>
                <option value="ShoppingBag">ShoppingBag (E-Commerce)</option>
                <option value="Megaphone">Megaphone (Marketing)</option>
                <option value="Image">Image (Photo Editing)</option>
                <option value="Video">Video (YouTube/Creator)</option>
                <option value="Printer">Printer (Print Design)</option>
                <option value="Briefcase">Briefcase (Business)</option>
                <option value="Zap">Zap (Ultra Fast)</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="text-xs font-bold text-slate-300 block mb-1">Card Preview Image URL</label>
              <input
                type="text"
                value={categoryForm.imageUrl || ''}
                onChange={(e) => setCategoryForm({ ...categoryForm, imageUrl: e.target.value })}
                placeholder="https://images.unsplash.com/..."
                className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white focus:border-purple-500 outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">Playing Card Suit</label>
              <select
                value={categoryForm.suit || '♠'}
                onChange={(e) => setCategoryForm({ ...categoryForm, suit: e.target.value as any })}
                className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white focus:border-purple-500 outline-none"
              >
                <option value="♠">♠ Spades (Black)</option>
                <option value="♥">♥ Hearts (Red)</option>
                <option value="♦">♦ Diamonds (Red)</option>
                <option value="♣">♣ Clubs (Black)</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">Badge Tag</label>
              <input
                type="text"
                value={categoryForm.badge || ''}
                onChange={(e) => setCategoryForm({ ...categoryForm, badge: e.target.value })}
                placeholder="e.g. ⚡ 10-Min Flash, 👑 Luxury Kit"
                className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white focus:border-purple-500 outline-none"
              />
            </div>

            {/* Inclusions & Features Bullet Points List */}
            <div className="md:col-span-2 bg-slate-950/70 p-4 rounded-xl border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-black text-amber-400 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Key Features & Inclusions (Shown on Card)
                </label>
                <button
                  type="button"
                  onClick={() => {
                    const currentFeats = categoryForm.features || [];
                    setCategoryForm({ ...categoryForm, features: [...currentFeats, ''] });
                  }}
                  className="px-3 py-1 bg-purple-600/30 hover:bg-purple-600 border border-purple-500/40 text-purple-200 text-xs font-bold rounded-lg flex items-center gap-1 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Feature Line
                </button>
              </div>

              {(!categoryForm.features || categoryForm.features.length === 0) ? (
                <div className="text-xs text-slate-500 italic p-2">
                  No custom feature bullet points. Click "Add Feature Line" or standard fallback features will be shown.
                </div>
              ) : (
                <div className="space-y-2">
                  {categoryForm.features.map((feat, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <span className="text-emerald-400 text-xs font-bold">✔</span>
                      <input
                        type="text"
                        value={feat}
                        onChange={(e) => {
                          const updated = [...(categoryForm.features || [])];
                          updated[idx] = e.target.value;
                          setCategoryForm({ ...categoryForm, features: updated });
                        }}
                        placeholder={`e.g. Source Files Included (PSD/AI) or 4K Ultra-HD Export`}
                        className="flex-1 p-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white focus:border-purple-500 outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const updated = [...(categoryForm.features || [])];
                          updated.splice(idx, 1);
                          setCategoryForm({ ...categoryForm, features: updated });
                        }}
                        className="p-2 text-rose-400 hover:text-rose-300 hover:bg-rose-950/40 rounded-lg transition-colors"
                        title="Remove Line"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex items-center gap-6 pt-2 md:col-span-2">
              <label className="flex items-center gap-2 text-xs font-bold text-emerald-400 cursor-pointer">
                <input
                  type="checkbox"
                  checked={categoryForm.enabled !== false}
                  onChange={(e) => setCategoryForm({ ...categoryForm, enabled: e.target.checked })}
                />
                Category Enabled on Homepage Marquee
              </label>

              <label className="flex items-center gap-2 text-xs font-bold text-amber-400 cursor-pointer">
                <input
                  type="checkbox"
                  checked={!!categoryForm.popular}
                  onChange={(e) => setCategoryForm({ ...categoryForm, popular: e.target.checked })}
                />
                Mark as Popular
              </label>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={() => {
                setIsCreatingCategory(false);
                setIsEditingCategory(false);
              }}
              className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-amber-500 hover:from-purple-500 hover:to-amber-400 text-slate-950 text-xs font-black flex items-center gap-1.5 shadow-lg shadow-purple-900/30"
            >
              <Save className="w-4 h-4" /> {isSaving ? 'Saving...' : 'Save Category'}
            </button>
          </div>
        </form>
      )}

      {/* ========================================================================= */}
      {/* TAB 1: SERVICES CATALOG */}
      {/* ========================================================================= */}
      {activeTab === 'services' && !isCreatingService && !isEditingService && (
        <div className="space-y-4">
          {/* Controls Bar */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-3 bg-slate-900/60 p-3 rounded-xl border border-slate-800">
            {/* Search Input */}
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search services, keywords, titles..."
                value={serviceSearch}
                onChange={(e) => setServiceSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-xs text-white placeholder-slate-500 focus:border-purple-500 outline-none"
              />
            </div>

            {/* Category Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
              <button
                onClick={() => setServiceCategoryFilter('all')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
                  serviceCategoryFilter === 'all'
                    ? 'bg-purple-600 text-white'
                    : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                All ({services.length})
              </button>
              {GRAPHIC_DESIGN_CATEGORIES.filter((c) => c.id !== 'all').map((cat) => {
                const count = services.filter((s) => s.category === cat.id).length;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setServiceCategoryFilter(cat.id)}
                    className={`px-2.5 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
                      serviceCategoryFilter === cat.id
                        ? 'bg-purple-600 text-white'
                        : 'bg-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    {cat.name} ({count})
                  </button>
                );
              })}
            </div>
          </div>

          {/* Services Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredServices.map((service) => (
              <div
                key={service.id}
                className="rounded-2xl bg-slate-900/90 border border-slate-800 overflow-hidden flex flex-col hover:border-purple-500/40 transition-all group shadow-md"
              >
                {/* Image Header */}
                <div className="relative h-40 overflow-hidden bg-slate-950">
                  <img
                    src={service.imageUrl}
                    alt={service.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-80" />

                  {/* Top Badges */}
                  <div className="absolute top-2.5 left-2.5 flex flex-wrap gap-1.5">
                    <span className="px-2 py-0.5 rounded-md bg-purple-900/90 text-purple-200 border border-purple-500/40 text-[10px] font-bold">
                      {service.categoryName}
                    </span>
                    {service.expressAvailable && (
                      <span className="px-2 py-0.5 rounded-md bg-amber-500/90 text-slate-950 text-[10px] font-black flex items-center gap-1 shadow">
                        <Zap className="w-3 h-3" /> {service.fastestDeliveryTime}
                      </span>
                    )}
                  </div>

                  <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between">
                    <div className="flex items-center gap-1 text-amber-400 text-xs font-bold">
                      <Star className="w-3.5 h-3.5 fill-amber-400" />
                      <span>{service.rating}</span>
                      <span className="text-[10px] text-slate-400">({service.reviewsCount})</span>
                    </div>
                    <div className="text-right">
                      <span className="text-xs text-slate-400 line-through mr-1">₹{service.originalPrice}</span>
                      <span className="text-base font-black text-emerald-400">₹{service.startingPrice}</span>
                    </div>
                  </div>
                </div>

                {/* Body Content */}
                <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                  <div className="space-y-1.5">
                    <h3 className="text-sm font-bold text-white line-clamp-1 group-hover:text-purple-300 transition-colors">
                      {service.title}
                    </h3>
                    <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                      {service.shortDescription}
                    </p>
                  </div>

                  {/* Metadata Chips */}
                  <div className="space-y-2 pt-2 border-t border-slate-800/80">
                    <div className="flex items-center justify-between text-[11px] text-slate-400">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-slate-500" /> Std: {service.standardDeliveryTime}
                      </span>
                      <span>{service.packages?.length || 3} Packages</span>
                    </div>

                    {/* Feature Toggles */}
                    <div className="flex items-center gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => handleToggleBadge(service, 'popular')}
                        className={`px-2 py-1 rounded-md text-[10px] font-bold border transition-all ${
                          service.popular
                            ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                            : 'bg-slate-800 text-slate-500 border-slate-700 hover:text-slate-300'
                        }`}
                      >
                        ★ Popular
                      </button>
                      <button
                        type="button"
                        onClick={() => handleToggleBadge(service, 'trending')}
                        className={`px-2 py-1 rounded-md text-[10px] font-bold border transition-all ${
                          service.trending
                            ? 'bg-purple-500/20 text-purple-300 border-purple-500/40'
                            : 'bg-slate-800 text-slate-500 border-slate-700 hover:text-slate-300'
                        }`}
                      >
                        🔥 Trending
                      </button>
                      <button
                        type="button"
                        onClick={() => handleToggleBadge(service, 'expressAvailable')}
                        className={`px-2 py-1 rounded-md text-[10px] font-bold border transition-all ${
                          service.expressAvailable
                            ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
                            : 'bg-slate-800 text-slate-500 border-slate-700 hover:text-slate-300'
                        }`}
                      >
                        ⚡ Express
                      </button>
                    </div>
                  </div>

                  {/* Actions Row */}
                  <div className="flex items-center gap-2 pt-2 border-t border-slate-800/80">
                    <button
                      onClick={() => handleEditService(service)}
                      className="flex-1 py-2 rounded-xl bg-purple-600/20 hover:bg-purple-600 text-purple-300 hover:text-white border border-purple-500/30 text-xs font-bold flex items-center justify-center gap-1.5 transition-all"
                    >
                      <Edit2 className="w-3.5 h-3.5" /> Edit Details & Packages
                    </button>
                    <button
                      onClick={() => handleDeleteService(service.id, service.title)}
                      className="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 transition-all"
                      title="Delete Service"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredServices.length === 0 && (
            <div className="text-center py-16 bg-slate-900/40 rounded-2xl border border-slate-800 space-y-3">
              <Search className="w-8 h-8 text-slate-500 mx-auto" />
              <div className="text-sm font-bold text-white">No services found matching filters</div>
              <p className="text-xs text-slate-400">Try clearing your search query or add a new service.</p>
              <button
                onClick={handleOpenCreateService}
                className="px-4 py-2 rounded-xl bg-purple-600 text-white font-bold text-xs inline-flex items-center gap-2"
              >
                <Plus className="w-4 h-4" /> Add Graphic Design Service
              </button>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* SERVICE EDIT / CREATE FORM MODAL / VIEW */}
      {/* ========================================================================= */}
      {(isCreatingService || isEditingService) && (
        <form onSubmit={handleSaveService} className="space-y-6 bg-slate-900/90 p-6 rounded-2xl border border-purple-500/40 shadow-2xl">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div className="space-y-0.5">
              <h3 className="text-lg font-black text-white flex items-center gap-2">
                <Edit className="w-5 h-5 text-purple-400" />
                {isCreatingService ? 'Create New Graphic Design Service' : `Edit Service: ${serviceForm.title}`}
              </h3>
              <p className="text-xs text-slate-400">
                Configure prices, package tiers (Starter/Business/Premium), turnaround delivery speeds, and deliverables.
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                setIsCreatingService(false);
                setIsEditingService(false);
              }}
              className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Section 1: Basic Information */}
          <div className="space-y-4">
            <h4 className="text-xs font-black uppercase text-purple-400 tracking-wider">1. Basic Information</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Service Title *</label>
                <input
                  type="text"
                  required
                  value={serviceForm.title || ''}
                  onChange={(e) => setServiceForm({ ...serviceForm, title: e.target.value })}
                  placeholder="e.g. Minimalist Vector Logo & Brand Identity Kit"
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white focus:border-purple-500 outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Category *</label>
                <select
                  value={serviceForm.category || 'social-media'}
                  onChange={(e) => {
                    const catObj = GRAPHIC_DESIGN_CATEGORIES.find((c) => c.id === e.target.value);
                    setServiceForm({
                      ...serviceForm,
                      category: e.target.value as any,
                      categoryName: catObj ? catObj.name : 'Social Media Design',
                    });
                  }}
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white focus:border-purple-500 outline-none"
                >
                  {GRAPHIC_DESIGN_CATEGORIES.filter((c) => c.id !== 'all').map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Subcategory</label>
                <input
                  type="text"
                  value={serviceForm.subcategory || ''}
                  onChange={(e) => setServiceForm({ ...serviceForm, subcategory: e.target.value })}
                  placeholder="e.g. 3D Apparel Mockups, Vector Monogram"
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white focus:border-purple-500 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">Short Description (Cards & Previews) *</label>
              <input
                type="text"
                required
                value={serviceForm.shortDescription || ''}
                onChange={(e) => setServiceForm({ ...serviceForm, shortDescription: e.target.value })}
                placeholder="High-converting visuals crafted for maximum brand authority..."
                className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white focus:border-purple-500 outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">Full Detailed Description</label>
              <textarea
                rows={3}
                value={serviceForm.fullDescription || ''}
                onChange={(e) => setServiceForm({ ...serviceForm, fullDescription: e.target.value })}
                placeholder="Complete breakdown of what the client gets, design workflow, aesthetic approach..."
                className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white focus:border-purple-500 outline-none"
              />
            </div>
          </div>

          {/* Section 2: Pricing, Delivery Speeds & 360° Media */}
          <div className="space-y-4 pt-4 border-t border-slate-800">
            <h4 className="text-xs font-black uppercase text-amber-400 tracking-wider">2. Pricing, Delivery Speeds & 360° Media</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Starting Price (₹) *</label>
                <input
                  type="number"
                  required
                  value={serviceForm.startingPrice || 149}
                  onChange={(e) => setServiceForm({ ...serviceForm, startingPrice: Number(e.target.value) })}
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-emerald-400 font-bold focus:border-purple-500 outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Sale Price (Discounted) (₹)</label>
                <input
                  type="number"
                  value={serviceForm.salePrice || ''}
                  onChange={(e) => setServiceForm({ ...serviceForm, salePrice: Number(e.target.value) })}
                  placeholder="e.g. 129"
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-amber-400 font-bold focus:border-purple-500 outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Original Price (Strike) (₹)</label>
                <input
                  type="number"
                  value={serviceForm.originalPrice || 299}
                  onChange={(e) => setServiceForm({ ...serviceForm, originalPrice: Number(e.target.value) })}
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-slate-400 focus:border-purple-500 outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Turnaround Time</label>
                <input
                  type="text"
                  value={serviceForm.standardDeliveryTime || '24 Hours'}
                  onChange={(e) => setServiceForm({ ...serviceForm, standardDeliveryTime: e.target.value, turnaroundTime: e.target.value })}
                  placeholder="24 Hours"
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white focus:border-purple-500 outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Fastest Express Time</label>
                <input
                  type="text"
                  value={serviceForm.fastestDeliveryTime || '10 Mins'}
                  onChange={(e) => setServiceForm({ ...serviceForm, fastestDeliveryTime: e.target.value })}
                  placeholder="10 Mins"
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-amber-300 font-bold focus:border-purple-500 outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Revision Count</label>
                <input
                  type="text"
                  value={serviceForm.revisions || 'Unlimited Revisions'}
                  onChange={(e) => setServiceForm({ ...serviceForm, revisions: e.target.value })}
                  placeholder="e.g. Unlimited or 3 Revisions"
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white focus:border-purple-500 outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Dimensions / Resolution</label>
                <input
                  type="text"
                  value={serviceForm.dimensions || '1080 x 1080 px'}
                  onChange={(e) => setServiceForm({ ...serviceForm, dimensions: e.target.value })}
                  placeholder="1080 x 1080 px / 300 DPI CMYK"
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white focus:border-purple-500 outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Main Product Image URL *</label>
                <input
                  type="text"
                  value={serviceForm.imageUrl || ''}
                  onChange={(e) => setServiceForm({ ...serviceForm, imageUrl: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white focus:border-purple-500 outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">360° Rotation Product Image URL (Optional)</label>
                <input
                  type="text"
                  value={serviceForm.rotationImage || ''}
                  onChange={(e) => setServiceForm({ ...serviceForm, rotationImage: e.target.value })}
                  placeholder="Leave empty to use main image in 360° physics stage"
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-cyan-300 focus:border-purple-500 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">Gallery Images (Comma separated URLs)</label>
              <input
                type="text"
                value={(serviceForm.gallery || []).join(', ')}
                onChange={(e) => setServiceForm({
                  ...serviceForm,
                  gallery: e.target.value.split(',').map((s) => s.trim()).filter(Boolean),
                })}
                placeholder="https://images.unsplash.com/..., https://images.unsplash.com/..."
                className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-slate-300 focus:border-purple-500 outline-none"
              />
            </div>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-300">
                <input
                  type="checkbox"
                  checked={Boolean(serviceForm.popular)}
                  onChange={(e) => setServiceForm({ ...serviceForm, popular: e.target.checked })}
                  className="rounded text-purple-600"
                />
                Popular Badge
              </label>
              <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-300">
                <input
                  type="checkbox"
                  checked={Boolean(serviceForm.trending)}
                  onChange={(e) => setServiceForm({ ...serviceForm, trending: e.target.checked })}
                  className="rounded text-purple-600"
                />
                Trending Badge
              </label>
              <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-300">
                <input
                  type="checkbox"
                  checked={Boolean(serviceForm.featured)}
                  onChange={(e) => setServiceForm({ ...serviceForm, featured: e.target.checked })}
                  className="rounded text-purple-600"
                />
                Featured Status
              </label>
              <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-300">
                <input
                  type="checkbox"
                  checked={Boolean(serviceForm.expressAvailable)}
                  onChange={(e) => setServiceForm({ ...serviceForm, expressAvailable: e.target.checked })}
                  className="rounded text-purple-600"
                />
                Express Turnaround Available
              </label>
            </div>
          </div>

          {/* Section 3: Packages (Starter / Business / Premium) */}
          <div className="space-y-4 pt-4 border-t border-slate-800">
            <h4 className="text-xs font-black uppercase text-cyan-400 tracking-wider">3. Tiered Packages (Starter / Business / Premium)</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {(serviceForm.packages || []).map((pkg, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-purple-300 uppercase">Package {idx + 1}</span>
                    <label className="flex items-center gap-1.5 text-[10px] text-amber-400 cursor-pointer font-bold">
                      <input
                        type="checkbox"
                        checked={Boolean(pkg.popular)}
                        onChange={(e) => {
                          const newPkgs = [...(serviceForm.packages || [])];
                          newPkgs[idx] = { ...newPkgs[idx], popular: e.target.checked };
                          setServiceForm({ ...serviceForm, packages: newPkgs });
                        }}
                      />
                      Most Popular
                    </label>
                  </div>

                  <div>
                    <label className="text-[10px] text-slate-400 font-semibold block mb-0.5">Package Name</label>
                    <input
                      type="text"
                      value={pkg.name}
                      onChange={(e) => {
                        const newPkgs = [...(serviceForm.packages || [])];
                        newPkgs[idx] = { ...newPkgs[idx], name: e.target.value };
                        setServiceForm({ ...serviceForm, packages: newPkgs });
                      }}
                      className="w-full p-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white focus:border-purple-500 outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[10px] text-slate-400 font-semibold block mb-0.5">Price (₹)</label>
                      <input
                        type="number"
                        value={pkg.price}
                        onChange={(e) => {
                          const newPkgs = [...(serviceForm.packages || [])];
                          newPkgs[idx] = { ...newPkgs[idx], price: Number(e.target.value) };
                          setServiceForm({ ...serviceForm, packages: newPkgs });
                        }}
                        className="w-full p-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-emerald-400 font-bold focus:border-purple-500 outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-400 font-semibold block mb-0.5">Delivery Time</label>
                      <input
                        type="text"
                        value={pkg.deliveryTime}
                        onChange={(e) => {
                          const newPkgs = [...(serviceForm.packages || [])];
                          newPkgs[idx] = { ...newPkgs[idx], deliveryTime: e.target.value };
                          setServiceForm({ ...serviceForm, packages: newPkgs });
                        }}
                        className="w-full p-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white focus:border-purple-500 outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] text-slate-400 font-semibold block mb-0.5">
                      Feature Bullets (Comma separated)
                    </label>
                    <textarea
                      rows={2}
                      value={pkg.features.join(', ')}
                      onChange={(e) => {
                        const newPkgs = [...(serviceForm.packages || [])];
                        newPkgs[idx] = {
                          ...newPkgs[idx],
                          features: e.target.value.split(',').map((f) => f.trim()).filter(Boolean),
                        };
                        setServiceForm({ ...serviceForm, packages: newPkgs });
                      }}
                      className="w-full p-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-slate-300 focus:border-purple-500 outline-none"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 4: What's Included & FAQs */}
          <div className="space-y-4 pt-4 border-t border-slate-800">
            <h4 className="text-xs font-black uppercase text-emerald-400 tracking-wider">4. Deliverables & FAQs</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Included items */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <label className="text-xs font-bold text-emerald-300 block">What's Included in this service</label>
                <div className="space-y-1.5 max-h-40 overflow-y-auto">
                  {(serviceForm.whatsIncluded || []).map((item, i) => (
                    <div key={i} className="flex items-center justify-between p-1.5 rounded-lg bg-slate-900 text-xs">
                      <span className="text-slate-300">✓ {item}</span>
                      <button
                        type="button"
                        onClick={() => {
                          setServiceForm({
                            ...serviceForm,
                            whatsIncluded: (serviceForm.whatsIncluded || []).filter((_, idx) => idx !== i),
                          });
                        }}
                        className="text-rose-400 hover:text-rose-300"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2 pt-1">
                  <input
                    type="text"
                    placeholder="Add included feature..."
                    value={newIncludedInput}
                    onChange={(e) => setNewIncludedInput(e.target.value)}
                    className="flex-1 p-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white focus:border-purple-500 outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (!newIncludedInput.trim()) return;
                      setServiceForm({
                        ...serviceForm,
                        whatsIncluded: [...(serviceForm.whatsIncluded || []), newIncludedInput.trim()],
                      });
                      setNewIncludedInput('');
                    }}
                    className="px-3 py-2 rounded-lg bg-emerald-600 text-white font-bold text-xs"
                  >
                    Add
                  </button>
                </div>
              </div>

              {/* FAQs */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <label className="text-xs font-bold text-purple-300 block">Frequently Asked Questions</label>
                <div className="space-y-1.5 max-h-40 overflow-y-auto">
                  {(serviceForm.faqs || []).map((faq, i) => (
                    <div key={i} className="p-2 rounded-lg bg-slate-900 text-xs space-y-1">
                      <div className="flex items-center justify-between font-bold text-purple-300">
                        <span>Q: {faq.question}</span>
                        <button
                          type="button"
                          onClick={() => {
                            setServiceForm({
                              ...serviceForm,
                              faqs: (serviceForm.faqs || []).filter((_, idx) => idx !== i),
                            });
                          }}
                          className="text-rose-400 hover:text-rose-300"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <p className="text-slate-400 text-[11px]">A: {faq.answer}</p>
                    </div>
                  ))}
                </div>
                <div className="space-y-1.5 pt-1">
                  <input
                    type="text"
                    placeholder="Question..."
                    value={newFaqQ}
                    onChange={(e) => setNewFaqQ(e.target.value)}
                    className="w-full p-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white focus:border-purple-500 outline-none"
                  />
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Answer..."
                      value={newFaqA}
                      onChange={(e) => setNewFaqA(e.target.value)}
                      className="flex-1 p-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white focus:border-purple-500 outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (!newFaqQ.trim() || !newFaqA.trim()) return;
                        setServiceForm({
                          ...serviceForm,
                          faqs: [...(serviceForm.faqs || []), { question: newFaqQ.trim(), answer: newFaqA.trim() }],
                        });
                        setNewFaqQ('');
                        setNewFaqA('');
                      }}
                      className="px-3 py-2 rounded-lg bg-purple-600 text-white font-bold text-xs"
                    >
                      Add
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Section 5: Features, Deliverables, Client Requirements & Tags */}
          <div className="space-y-4 pt-4 border-t border-slate-800">
            <h4 className="text-xs font-black uppercase text-indigo-400 tracking-wider">5. Features, Deliverables, Client Requirements &amp; Tags</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Key Features Bullets (Comma separated)</label>
                <textarea
                  rows={2}
                  value={(serviceForm.features || []).join(', ')}
                  onChange={(e) => setServiceForm({
                    ...serviceForm,
                    features: e.target.value.split(',').map((s) => s.trim()).filter(Boolean),
                  })}
                  placeholder="e.g. 100% Vector Art, Layered AI/PSD, Commercial Usage Rights"
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white focus:border-purple-500 outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Final Deliverables (Comma separated)</label>
                <textarea
                  rows={2}
                  value={(serviceForm.deliverables || []).join(', ')}
                  onChange={(e) => setServiceForm({
                    ...serviceForm,
                    deliverables: e.target.value.split(',').map((s) => s.trim()).filter(Boolean),
                  })}
                  placeholder="e.g. Vector AI/EPS, Print-Ready PDF (300 DPI), Transparent PNG, Layered PSD"
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white focus:border-purple-500 outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Client Requirements Needed (Comma separated)</label>
                <textarea
                  rows={2}
                  value={(serviceForm.requirements || []).join(', ')}
                  onChange={(e) => setServiceForm({
                    ...serviceForm,
                    requirements: e.target.value.split(',').map((s) => s.trim()).filter(Boolean),
                  })}
                  placeholder="e.g. Brand Name, Preferred Color Palette, Reference Examples, Exact Dimensions"
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white focus:border-purple-500 outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Search &amp; Filter Tags (Comma separated)</label>
                <textarea
                  rows={2}
                  value={(serviceForm.tags || []).join(', ')}
                  onChange={(e) => setServiceForm({
                    ...serviceForm,
                    tags: e.target.value.split(',').map((s) => s.trim()).filter(Boolean),
                  })}
                  placeholder="e.g. logo, vector, brand-identity, 3d, luxury"
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white focus:border-purple-500 outline-none"
                />
              </div>
            </div>
          </div>

          {/* Section 6: SEO Metadata & Publishing Status */}
          <div className="space-y-4 pt-4 border-t border-slate-800">
            <h4 className="text-xs font-black uppercase text-rose-400 tracking-wider">6. SEO Metadata &amp; Publishing Status</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">SEO Meta Title</label>
                <input
                  type="text"
                  value={serviceForm.seoTitle || ''}
                  onChange={(e) => setServiceForm({ ...serviceForm, seoTitle: e.target.value })}
                  placeholder="e.g. Premium Logo Design & Brand Identity | Annu Dhaneja"
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white focus:border-purple-500 outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">SEO Meta Description</label>
                <input
                  type="text"
                  value={serviceForm.seoDescription || ''}
                  onChange={(e) => setServiceForm({ ...serviceForm, seoDescription: e.target.value })}
                  placeholder="e.g. Order custom vector logos, monogram designs and luxury brand kits..."
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white focus:border-purple-500 outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Publishing Status *</label>
                <select
                  value={serviceForm.status || 'active'}
                  onChange={(e) => setServiceForm({ ...serviceForm, status: e.target.value as any })}
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-emerald-400 font-bold focus:border-purple-500 outline-none"
                >
                  <option value="active">Active (Visible in Store &amp; 360° Showcase)</option>
                  <option value="draft">Draft (Hidden from Store)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Form Actions Footer */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={() => {
                setIsCreatingService(false);
                setIsEditingService(false);
              }}
              className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-amber-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg hover:opacity-90 disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              {isSaving ? 'Saving to Database...' : isCreatingService ? 'Create & Publish Service' : 'Save Changes'}
            </button>
          </div>
        </form>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: CLIENT INQUIRIES & CUSTOM QUOTES */}
      {/* ========================================================================= */}
      {activeTab === 'inquiries' && (
        <div className="space-y-4">
          {/* Filter Bar */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-3 bg-slate-900/60 p-3 rounded-xl border border-slate-800">
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search by client name, email, phone, brief ID..."
                value={inquirySearch}
                onChange={(e) => setInquirySearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-xs text-white placeholder-slate-500 focus:border-purple-500 outline-none"
              />
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
              {['ALL', 'PENDING', 'IN_REVIEW', 'QUOTED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'].map((st) => (
                <button
                  key={st}
                  onClick={() => setInquiryStatusFilter(st)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
                    inquiryStatusFilter === st
                      ? 'bg-purple-600 text-white'
                      : 'bg-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  {st} ({inquiries.filter((i) => st === 'ALL' || i.status === st).length})
                </button>
              ))}
            </div>
          </div>

          {/* Inquiries Table / Cards */}
          <div className="space-y-3">
            {filteredInquiries.map((inq) => (
              <div
                key={inq.id}
                className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-purple-500/40 transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-md"
              >
                <div className="space-y-1.5 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-xs font-black text-amber-400">{inq.id}</span>
                    <span
                      className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-md border ${
                        inq.status === 'PENDING'
                          ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 animate-pulse'
                          : inq.status === 'IN_REVIEW'
                          ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
                          : inq.status === 'QUOTED'
                          ? 'bg-purple-500/20 text-purple-300 border-purple-500/40'
                          : inq.status === 'COMPLETED'
                          ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                          : 'bg-slate-800 text-slate-400 border-slate-700'
                      }`}
                    >
                      {inq.status}
                    </span>
                    <span className="text-xs font-bold text-white">{inq.serviceTitle}</span>
                  </div>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400">
                    <span className="flex items-center gap-1 font-semibold text-slate-200">
                      <User className="w-3.5 h-3.5 text-purple-400" /> {inq.customerName}
                    </span>
                    <span className="flex items-center gap-1">
                      <Phone className="w-3.5 h-3.5 text-emerald-400" /> {inq.customerPhone || 'N/A'}
                    </span>
                    {inq.customerEmail && (
                      <span className="flex items-center gap-1">
                        <Mail className="w-3.5 h-3.5 text-cyan-400" /> {inq.customerEmail}
                      </span>
                    )}
                    <span className="flex items-center gap-1 font-bold text-amber-300">
                      <Zap className="w-3.5 h-3.5" /> Speed: {inq.deliverySpeed}
                    </span>
                    <span className="flex items-center gap-1 font-bold text-emerald-400">
                      Budget: {inq.budget}
                    </span>
                  </div>

                  <p className="text-xs text-slate-300 bg-slate-950 p-2.5 rounded-xl border border-slate-800/80 line-clamp-2">
                    {inq.description || 'No custom notes provided.'}
                  </p>
                </div>

                {/* Actions & WhatsApp Direct */}
                <div className="flex items-center gap-2 w-full md:w-auto justify-end">
                  {inq.whatsapp && (
                    <a
                      href={`https://wa.me/${inq.whatsapp.replace(/[^0-9]/g, '')}?text=Hi%20${encodeURIComponent(
                        inq.customerName
                      )},%20regarding%20your%20graphic%20design%20inquiry%20(${inq.id})%20at%20GurucraftPro:`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-2 rounded-xl bg-emerald-600/20 hover:bg-emerald-600 text-emerald-300 hover:text-white border border-emerald-500/30 text-xs font-bold flex items-center gap-1.5 transition-all"
                    >
                      <MessageSquare className="w-3.5 h-3.5" /> WhatsApp
                    </a>
                  )}

                  <button
                    onClick={() => handleOpenInquiryModal(inq)}
                    className="px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-md"
                  >
                    <Edit2 className="w-3.5 h-3.5" /> Review & Quote
                  </button>

                  <button
                    onClick={() => handleDeleteInquiry(inq.id)}
                    className="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}

            {filteredInquiries.length === 0 && (
              <div className="text-center py-16 bg-slate-900/40 rounded-2xl border border-slate-800 space-y-2">
                <MessageSquare className="w-8 h-8 text-slate-500 mx-auto" />
                <div className="text-sm font-bold text-white">No inquiries matching filter</div>
                <p className="text-xs text-slate-400">Customer quote submissions and design briefs will appear here.</p>
              </div>
            )}
          </div>

          {/* Inquiry Detail & Status Update Modal */}
          {selectedInquiry && (
            <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
              <div className="w-full max-w-xl bg-slate-900 border border-purple-500/40 rounded-2xl p-6 space-y-5 shadow-2xl">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div>
                    <h3 className="text-base font-black text-white flex items-center gap-2">
                      <FileCheck className="w-5 h-5 text-purple-400" />
                      Review Inquiry: {selectedInquiry.id}
                    </h3>
                    <p className="text-xs text-slate-400">{selectedInquiry.serviceTitle}</p>
                  </div>
                  <button
                    onClick={() => setSelectedInquiry(null)}
                    className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Client Info Grid */}
                <div className="grid grid-cols-2 gap-3 p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs">
                  <div>
                    <span className="text-slate-500 block">Client:</span>
                    <span className="font-bold text-white">{selectedInquiry.customerName}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Phone / WhatsApp:</span>
                    <span className="font-bold text-emerald-400">{selectedInquiry.customerPhone}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Delivery Turnaround:</span>
                    <span className="font-bold text-amber-300">{selectedInquiry.deliverySpeed}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Client Budget:</span>
                    <span className="font-bold text-cyan-300">{selectedInquiry.budget}</span>
                  </div>
                  {selectedInquiry.driveLink && (
                    <div className="col-span-2 pt-1 border-t border-slate-800">
                      <span className="text-slate-500 block">Asset Drive Link:</span>
                      <a
                        href={selectedInquiry.driveLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-purple-400 hover:underline flex items-center gap-1 truncate"
                      >
                        <ExternalLink className="w-3.5 h-3.5 flex-shrink-0" /> {selectedInquiry.driveLink}
                      </a>
                    </div>
                  )}
                </div>

                {/* Client Description */}
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">Customer Brief & Requirements</label>
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 leading-relaxed max-h-32 overflow-y-auto">
                    {selectedInquiry.description}
                  </div>
                </div>

                {/* Update Controls */}
                <div className="space-y-3 pt-3 border-t border-slate-800">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-bold text-slate-300 block mb-1">Status</label>
                      <select
                        value={inquiryStatusUpdate}
                        onChange={(e) => setInquiryStatusUpdate(e.target.value)}
                        className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white focus:border-purple-500 outline-none font-bold"
                      >
                        <option value="PENDING">PENDING</option>
                        <option value="IN_REVIEW">IN_REVIEW</option>
                        <option value="QUOTED">QUOTED</option>
                        <option value="IN_PROGRESS">IN_PROGRESS</option>
                        <option value="COMPLETED">COMPLETED</option>
                        <option value="CANCELLED">CANCELLED</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-300 block mb-1">Quoted Price (₹)</label>
                      <input
                        type="number"
                        value={inquiryQuotedPrice}
                        onChange={(e) => setInquiryQuotedPrice(e.target.value)}
                        placeholder="e.g. 1499"
                        className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-emerald-400 font-bold focus:border-purple-500 outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1">Admin / Designer Private Notes</label>
                    <input
                      type="text"
                      value={inquiryAdminNotes}
                      onChange={(e) => setInquiryAdminNotes(e.target.value)}
                      placeholder="e.g. Sent sample 1 on WhatsApp. Client requested neon accent..."
                      className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white focus:border-purple-500 outline-none"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={() => setSelectedInquiry(null)}
                    className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleSaveInquiry}
                    disabled={isSaving}
                    className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold flex items-center gap-2 shadow-lg disabled:opacity-50"
                  >
                    <Save className="w-4 h-4" />
                    {isSaving ? 'Updating...' : 'Save Inquiry Status'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: DELIVERY SPEED TIERS & SURCHARGES */}
      {/* ========================================================================= */}
      {activeTab === 'speed-tiers' && settings && (
        <div className="space-y-6 bg-slate-900/90 p-6 rounded-2xl border border-slate-800 shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="space-y-0.5">
              <h3 className="text-base font-black text-white flex items-center gap-2">
                <Zap className="w-5 h-5 text-amber-400" />
                Delivery Speed Tiers & Express Turnaround Surcharges
              </h3>
              <p className="text-xs text-slate-400">
                Configure standard vs ultra-fast (10 mins / 30 mins / 1 hour / same day) emergency delivery surcharges.
              </p>
            </div>
            <button
              onClick={handleSaveSettings}
              disabled={isSaving}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-amber-500 text-white text-xs font-bold flex items-center gap-2 shadow-lg hover:opacity-90 disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              {isSaving ? 'Saving...' : 'Save Tiers & Fees'}
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {settings.deliveryTiers.map((tier, idx) => (
              <div key={tier.id} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-purple-300 uppercase font-mono">Tier #{idx + 1} ({tier.id})</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    {tier.badge}
                  </span>
                </div>

                <div>
                  <label className="text-[10px] text-slate-400 font-semibold block mb-0.5">Label</label>
                  <input
                    type="text"
                    value={tier.label}
                    onChange={(e) => handleUpdateSpeedTier(idx, 'label', e.target.value)}
                    className="w-full p-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white focus:border-purple-500 outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] text-slate-400 font-semibold block mb-0.5">Additional Fee (+₹)</label>
                    <input
                      type="number"
                      value={tier.additionalFee}
                      onChange={(e) => handleUpdateSpeedTier(idx, 'additionalFee', Number(e.target.value))}
                      className="w-full p-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-emerald-400 font-bold focus:border-purple-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-400 font-semibold block mb-0.5">Timeframe</label>
                    <input
                      type="text"
                      value={tier.timeframe}
                      onChange={(e) => handleUpdateSpeedTier(idx, 'timeframe', e.target.value)}
                      className="w-full p-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-amber-300 font-bold focus:border-purple-500 outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] text-slate-400 font-semibold block mb-0.5">Badge Text</label>
                  <input
                    type="text"
                    value={tier.badge}
                    onChange={(e) => handleUpdateSpeedTier(idx, 'badge', e.target.value)}
                    className="w-full p-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white focus:border-purple-500 outline-none"
                  />
                </div>

                <div>
                  <label className="text-[10px] text-slate-400 font-semibold block mb-0.5">Description</label>
                  <textarea
                    rows={2}
                    value={tier.description}
                    onChange={(e) => handleUpdateSpeedTier(idx, 'description', e.target.value)}
                    className="w-full p-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-slate-300 focus:border-purple-500 outline-none"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 4: HERO BANNER & MARQUEE TICKER SETTINGS */}
      {/* ========================================================================= */}
      {activeTab === 'settings' && settings && (
        <div className="space-y-6 bg-slate-900/90 p-6 rounded-2xl border border-slate-800 shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="space-y-0.5">
              <h3 className="text-base font-black text-white flex items-center gap-2">
                <Sliders className="w-5 h-5 text-purple-400" />
                Hero Banner, Marquee Ticker & WhatsApp Integration
              </h3>
              <p className="text-xs text-slate-400">
                Update marketing headlines, USP bullet ticker, and WhatsApp inquiry number.
              </p>
            </div>
            <button
              onClick={handleSaveSettings}
              disabled={isSaving}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-amber-500 text-white text-xs font-bold flex items-center gap-2 shadow-lg hover:opacity-90 disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              {isSaving ? 'Saving...' : 'Save Settings'}
            </button>
          </div>

          {/* Hero Form */}
          <div className="space-y-4">
            <h4 className="text-xs font-black uppercase text-purple-400 tracking-wider">Hero Section Content</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Hero Pill Badge</label>
                <input
                  type="text"
                  value={settings.heroBadge}
                  onChange={(e) => setSettings({ ...settings, heroBadge: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white focus:border-purple-500 outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">WhatsApp Business Number (with country code)</label>
                <input
                  type="text"
                  value={settings.whatsappNumber}
                  onChange={(e) => setSettings({ ...settings, whatsappNumber: e.target.value })}
                  placeholder="918527837527"
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-emerald-400 font-mono font-bold focus:border-purple-500 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">Hero Headline</label>
              <input
                type="text"
                value={settings.heroTitle}
                onChange={(e) => setSettings({ ...settings, heroTitle: e.target.value })}
                className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white focus:border-purple-500 outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">Hero Subheadline</label>
              <textarea
                rows={2}
                value={settings.heroSub}
                onChange={(e) => setSettings({ ...settings, heroSub: e.target.value })}
                className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white focus:border-purple-500 outline-none"
              />
            </div>
          </div>

          {/* Marquee Ticker Editor */}
          <div className="space-y-4 pt-4 border-t border-slate-800">
            <h4 className="text-xs font-black uppercase text-amber-400 tracking-wider">
              Scrolling Marquee Ticker Highlights ({settings.marqueeItems.length})
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {settings.marqueeItems.map((item, idx) => (
                <div
                  key={idx}
                  className={`p-3 rounded-xl border flex items-center justify-between gap-2 ${
                    item.highlight
                      ? 'bg-amber-950/40 border-amber-500/40 text-amber-300'
                      : 'bg-slate-950 border-slate-800 text-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    <Sparkles className="w-3.5 h-3.5 flex-shrink-0 text-purple-400" />
                    <span className="text-xs font-bold truncate">{item.text}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveMarqueeItem(idx)}
                    className="p-1 text-rose-400 hover:text-rose-300"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>

            {/* Add Marquee Item */}
            <div className="flex flex-col md:flex-row items-center gap-3 p-3.5 rounded-xl bg-slate-950 border border-slate-800">
              <input
                type="text"
                placeholder="New ticker highlight text (e.g. 10-MIN ULTRA FAST DESIGN DELIVERY)..."
                value={newMarqueeText}
                onChange={(e) => setNewMarqueeText(e.target.value)}
                className="flex-1 p-2.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white focus:border-purple-500 outline-none"
              />
              <label className="flex items-center gap-1.5 text-xs text-amber-400 cursor-pointer font-bold whitespace-nowrap">
                <input
                  type="checkbox"
                  checked={newMarqueeHighlight}
                  onChange={(e) => setNewMarqueeHighlight(e.target.checked)}
                />
                Gold Highlight
              </label>
              <button
                type="button"
                onClick={handleAddMarqueeItem}
                className="px-4 py-2.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold flex items-center gap-1.5 whitespace-nowrap"
              >
                <Plus className="w-3.5 h-3.5" /> Add Ticker Item
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
