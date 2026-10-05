import React, { useState, useEffect, useRef } from 'react';
import {
  Share2,
  Plus,
  Trash2,
  ExternalLink,
  Save,
  Check,
  ShoppingBag,
  Globe,
  MessageCircle,
  Instagram,
  Youtube,
  Facebook,
  Linkedin,
  Sparkles,
  CheckCircle2,
  Clock,
  MapPin,
  Phone,
  Mail,
  ShieldCheck,
  Eye,
  Sliders,
  RefreshCw,
} from 'lucide-react';
import { SocialLinkItem, DefaultLinks } from '../../types';
import { getCMSData, saveCMSSection } from '../../utils';

export const SocialLinksCMS: React.FC = () => {
  const [links, setLinks] = useState<SocialLinkItem[]>([]);
  const [defaultLinks, setDefaultLinks] = useState<DefaultLinks>({
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
  });
  const [loading, setLoading] = useState(true);

  // Autosave Status: 'idle' | 'saving' | 'saved'
  const [autosaveStatus, setAutosaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');
  const [lastSavedTime, setLastSavedTime] = useState<string>('Just now');
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const isFirstRender = useRef(true);

  // New Profile Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLinkId, setEditingLinkId] = useState<string | null>(null);
  const [platformName, setPlatformName] = useState('');
  const [url, setUrl] = useState('');
  const [label, setLabel] = useState('');
  const [iconName, setIconName] = useState('Globe');
  const [category, setCategory] = useState<'social' | 'marketplace' | 'custom'>('social');
  const [locations, setLocations] = useState<string[]>(['footer', 'contact']);
  const [openInNewTab, setOpenInNewTab] = useState(true);
  const [activeStatus, setActiveStatus] = useState(true);

  // Filter Category State
  const [activeFilter, setActiveFilter] = useState<'all' | 'social' | 'marketplace' | 'custom'>('all');

  useEffect(() => {
    fetchLinks();
  }, []);

  const fetchLinks = async () => {
    setLoading(true);
    try {
      const cms = await getCMSData().catch(() => null);
      if (cms && cms.socialLinks && cms.socialLinks.length > 0) {
        setLinks(cms.socialLinks);
      } else {
        const linksRes = await fetch('/api/social-links').then((res) => res.json()).catch(() => []);
        if (Array.isArray(linksRes)) setLinks(linksRes);
      }

      if (cms && cms.defaultLinks) {
        setDefaultLinks((prev) => ({ ...prev, ...cms.defaultLinks }));
      } else {
        const defaultsRes = await fetch('/api/default-links').then((res) => res.json()).catch(() => null);
        if (defaultsRes && typeof defaultsRes === 'object') {
          setDefaultLinks((prev) => ({ ...prev, ...defaultsRes }));
        }
      }
    } catch (err) {
      console.error('Failed to load social links CMS data:', err);
    } finally {
      setLoading(false);
    }
  };

  // Debounced Autosave for Default Handles to Firestore
  const triggerAutosave = (updatedDefaults: DefaultLinks) => {
    setDefaultLinks(updatedDefaults);
    setAutosaveStatus('saving');

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = setTimeout(async () => {
      try {
        await saveCMSSection('defaultLinks', updatedDefaults);
        setAutosaveStatus('saved');
        const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
        setLastSavedTime(time);
        setTimeout(() => {
          setAutosaveStatus('idle');
        }, 2500);

        fetch('/api/default-links', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updatedDefaults),
        }).catch(() => {});
      } catch (err) {
        console.error('Autosave failed in Firestore:', err);
        setAutosaveStatus('idle');
      }
    }, 600);
  };

  const handleManualSaveDefaults = async () => {
    setAutosaveStatus('saving');
    try {
      await saveCMSSection('defaultLinks', defaultLinks);
      setAutosaveStatus('saved');
      const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      setLastSavedTime(time);
      setTimeout(() => setAutosaveStatus('idle'), 2500);

      fetch('/api/default-links', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(defaultLinks),
      }).catch(() => {});
    } catch (err) {
      console.error('Manual save failed in Firestore:', err);
      setAutosaveStatus('idle');
    }
  };

  const handleSaveLinkItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!platformName || !url) return;

    const payload: SocialLinkItem = {
      id: editingLinkId || `sl-${Date.now()}`,
      platformName,
      url,
      label: label || platformName,
      iconName,
      category,
      location: locations,
      openInNewTab,
      active: activeStatus,
    };

    try {
      const updatedLinks = editingLinkId
        ? links.map((l) => (l.id === editingLinkId ? payload : l))
        : [...links, payload];

      await saveCMSSection('socialLinks', updatedLinks);
      setLinks(updatedLinks);

      if (editingLinkId) {
        fetch(`/api/social-links/${editingLinkId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        }).catch(() => {});
      } else {
        fetch('/api/social-links', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        }).catch(() => {});
      }
      closeModal();
    } catch (err) {
      console.error('Failed to save social link to Firestore:', err);
    }
  };

  const handleToggleLinkActive = async (link: SocialLinkItem) => {
    const updated = { ...link, active: !link.active };
    const updatedLinks = links.map((l) => (l.id === link.id ? updated : l));
    setLinks(updatedLinks);
    try {
      await saveCMSSection('socialLinks', updatedLinks);
      fetch(`/api/social-links/${link.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated),
      }).catch(() => {});
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteLink = async (id: string) => {
    if (!window.confirm('Are you sure you want to remove this link profile?')) return;
    const updatedLinks = links.filter((l) => l.id !== id);
    setLinks(updatedLinks);
    try {
      await saveCMSSection('socialLinks', updatedLinks);
      fetch(`/api/social-links/${id}`, { method: 'DELETE' }).catch(() => {});
    } catch (err) {
      console.error(err);
    }
  };

  const openAddModal = () => {
    setEditingLinkId(null);
    setPlatformName('');
    setUrl('');
    setLabel('');
    setIconName('Globe');
    setCategory('social');
    setLocations(['footer', 'contact']);
    setOpenInNewTab(true);
    setActiveStatus(true);
    setIsModalOpen(true);
  };

  const openEditModal = (link: SocialLinkItem) => {
    setEditingLinkId(link.id);
    setPlatformName(link.platformName);
    setUrl(link.url);
    setLabel(link.label || link.platformName);
    setIconName(link.iconName || 'Globe');
    setCategory(link.category as any);
    setLocations(link.location || ['footer']);
    setOpenInNewTab(link.openInNewTab ?? true);
    setActiveStatus(link.active ?? true);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingLinkId(null);
  };

  const toggleLocation = (loc: string) => {
    if (locations.includes(loc)) {
      setLocations(locations.filter((l) => l !== loc));
    } else {
      setLocations([...locations, loc]);
    }
  };

  const filteredLinks = links.filter((l) => {
    if (activeFilter === 'all') return true;
    return l.category === activeFilter;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center p-16 space-x-3 text-purple-400">
        <RefreshCw className="w-5 h-5 animate-spin" />
        <span className="text-sm font-medium">Loading Live Social & Marketplace Link Hub...</span>
      </div>
    );
  }

  return (
    <div className="space-y-8" id="social-cms-container">
      {/* Top Banner & Autosave Status */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-slate-900/95 border border-purple-500/20 p-6 rounded-3xl shadow-xl relative overflow-hidden">
        <div className="space-y-1 z-10">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-teal-500/10 text-teal-400 text-[11px] font-bold uppercase tracking-wider">
            <Share2 className="w-3.5 h-3.5" />
            <span>Centralized Social & Marketplace Engine</span>
          </div>
          <h2 className="text-2xl font-black text-white">Social Media & Marketplace Channels</h2>
          <p className="text-xs text-slate-400 max-w-2xl">
            Manage your official WhatsApp, Instagram, YouTube, Amazon, Flipkart, Etsy, and custom social profiles. Changes autosave instantly to disk and reflect dynamically on the website header and footer.
          </p>
        </div>

        <div className="flex items-center gap-3 z-10">
          {/* Autosave Status Pill */}
          <div className="flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-slate-800/90 border border-slate-700 text-xs">
            {autosaveStatus === 'saving' ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 text-amber-400 animate-spin" />
                <span className="text-amber-300 font-medium">Autosaving...</span>
              </>
            ) : autosaveStatus === 'saved' ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-300 font-semibold">Autosaved to Database</span>
              </>
            ) : (
              <>
                <Clock className="w-3.5 h-3.5 text-teal-400" />
                <span className="text-slate-300 text-[11px]">Synced ({lastSavedTime})</span>
              </>
            )}
          </div>

          <button
            onClick={handleManualSaveDefaults}
            className="px-4 py-2 bg-gradient-to-r from-purple-600 to-teal-500 hover:from-purple-500 hover:to-teal-400 text-white font-bold text-xs rounded-xl flex items-center space-x-1.5 shadow-lg shadow-purple-900/30 transition-all active:scale-95"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save All</span>
          </button>

          <button
            onClick={openAddModal}
            className="px-4 py-2 bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs rounded-xl flex items-center space-x-1.5 shadow-lg shadow-teal-900/30 transition-all active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Add Custom Profile</span>
          </button>
        </div>
      </div>

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        
        {/* Left Column: Official Handles (Autosaved) */}
        <div className="xl:col-span-7 space-y-6">
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <h3 className="text-base font-bold text-white flex items-center space-x-2">
                  <Sliders className="w-4 h-4 text-teal-400" />
                  <span>Site-Wide Official Handles (Autosave Active ⚡)</span>
                </h3>
                <p className="text-xs text-slate-400">
                  Type any URL or handle below; inputs save automatically with a 600ms debounce.
                </p>
              </div>
              <span className="px-2.5 py-1 rounded-md bg-purple-900/40 text-purple-300 text-[10px] font-mono font-bold border border-purple-700/50">
                10 Core Handles
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              
              {/* WhatsApp */}
              <div className="space-y-1.5">
                <label className="text-slate-300 font-semibold flex items-center space-x-1.5">
                  <MessageCircle className="w-4 h-4 text-emerald-400" />
                  <span>WhatsApp Direct Chat Link</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={defaultLinks.whatsappUrl}
                    onChange={(e) => triggerAutosave({ ...defaultLinks, whatsappUrl: e.target.value })}
                    placeholder="https://wa.me/918527837527"
                    className="w-full bg-slate-950 border border-slate-700/80 focus:border-teal-400 text-white rounded-xl px-3.5 py-2.5 font-mono text-xs outline-none transition-colors"
                  />
                  {defaultLinks.whatsappUrl && (
                    <a
                      href={defaultLinks.whatsappUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="absolute right-2.5 top-2.5 p-1 text-slate-400 hover:text-emerald-400"
                      title="Test Link"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
              </div>

              {/* Instagram */}
              <div className="space-y-1.5">
                <label className="text-slate-300 font-semibold flex items-center space-x-1.5">
                  <Instagram className="w-4 h-4 text-pink-400" />
                  <span>Instagram Official Page</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={defaultLinks.instagramUrl}
                    onChange={(e) => triggerAutosave({ ...defaultLinks, instagramUrl: e.target.value })}
                    placeholder="https://instagram.com/gurucraftpro"
                    className="w-full bg-slate-950 border border-slate-700/80 focus:border-teal-400 text-white rounded-xl px-3.5 py-2.5 font-mono text-xs outline-none transition-colors"
                  />
                  {defaultLinks.instagramUrl && (
                    <a
                      href={defaultLinks.instagramUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="absolute right-2.5 top-2.5 p-1 text-slate-400 hover:text-pink-400"
                      title="Test Link"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
              </div>

              {/* YouTube */}
              <div className="space-y-1.5">
                <label className="text-slate-300 font-semibold flex items-center space-x-1.5">
                  <Youtube className="w-4 h-4 text-red-400" />
                  <span>YouTube Channel (Design Tutorials)</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={defaultLinks.youtubeUrl}
                    onChange={(e) => triggerAutosave({ ...defaultLinks, youtubeUrl: e.target.value })}
                    placeholder="https://youtube.com/@gurucraftpro"
                    className="w-full bg-slate-950 border border-slate-700/80 focus:border-teal-400 text-white rounded-xl px-3.5 py-2.5 font-mono text-xs outline-none transition-colors"
                  />
                  {defaultLinks.youtubeUrl && (
                    <a
                      href={defaultLinks.youtubeUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="absolute right-2.5 top-2.5 p-1 text-slate-400 hover:text-red-400"
                      title="Test Link"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
              </div>

              {/* Facebook */}
              <div className="space-y-1.5">
                <label className="text-slate-300 font-semibold flex items-center space-x-1.5">
                  <Facebook className="w-4 h-4 text-blue-400" />
                  <span>Facebook Business Page</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={defaultLinks.facebookUrl}
                    onChange={(e) => triggerAutosave({ ...defaultLinks, facebookUrl: e.target.value })}
                    placeholder="https://facebook.com/gurucraftpro"
                    className="w-full bg-slate-950 border border-slate-700/80 focus:border-teal-400 text-white rounded-xl px-3.5 py-2.5 font-mono text-xs outline-none transition-colors"
                  />
                  {defaultLinks.facebookUrl && (
                    <a
                      href={defaultLinks.facebookUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="absolute right-2.5 top-2.5 p-1 text-slate-400 hover:text-blue-400"
                      title="Test Link"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
              </div>

              {/* Amazon Storefront */}
              <div className="space-y-1.5">
                <label className="text-slate-300 font-semibold flex items-center space-x-1.5">
                  <ShoppingBag className="w-4 h-4 text-amber-400" />
                  <span>Amazon India Storefront URL</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={defaultLinks.amazonUrl}
                    onChange={(e) => triggerAutosave({ ...defaultLinks, amazonUrl: e.target.value })}
                    placeholder="https://amazon.in/s?k=GurucraftPro"
                    className="w-full bg-slate-950 border border-slate-700/80 focus:border-teal-400 text-white rounded-xl px-3.5 py-2.5 font-mono text-xs outline-none transition-colors"
                  />
                  {defaultLinks.amazonUrl && (
                    <a
                      href={defaultLinks.amazonUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="absolute right-2.5 top-2.5 p-1 text-slate-400 hover:text-amber-400"
                      title="Test Link"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
              </div>

              {/* Flipkart Store */}
              <div className="space-y-1.5">
                <label className="text-slate-300 font-semibold flex items-center space-x-1.5">
                  <ShoppingBag className="w-4 h-4 text-blue-400" />
                  <span>Flipkart Seller Store URL</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={defaultLinks.flipkartUrl}
                    onChange={(e) => triggerAutosave({ ...defaultLinks, flipkartUrl: e.target.value })}
                    placeholder="https://flipkart.com/search?q=GurucraftPro"
                    className="w-full bg-slate-950 border border-slate-700/80 focus:border-teal-400 text-white rounded-xl px-3.5 py-2.5 font-mono text-xs outline-none transition-colors"
                  />
                  {defaultLinks.flipkartUrl && (
                    <a
                      href={defaultLinks.flipkartUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="absolute right-2.5 top-2.5 p-1 text-slate-400 hover:text-blue-400"
                      title="Test Link"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
              </div>

              {/* Etsy Global */}
              <div className="space-y-1.5">
                <label className="text-slate-300 font-semibold flex items-center space-x-1.5">
                  <Globe className="w-4 h-4 text-orange-400" />
                  <span>Etsy International Shop</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={defaultLinks.etsyUrl}
                    onChange={(e) => triggerAutosave({ ...defaultLinks, etsyUrl: e.target.value })}
                    placeholder="https://etsy.com/shop/GurucraftPro"
                    className="w-full bg-slate-950 border border-slate-700/80 focus:border-teal-400 text-white rounded-xl px-3.5 py-2.5 font-mono text-xs outline-none transition-colors"
                  />
                  {defaultLinks.etsyUrl && (
                    <a
                      href={defaultLinks.etsyUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="absolute right-2.5 top-2.5 p-1 text-slate-400 hover:text-orange-400"
                      title="Test Link"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
              </div>

              {/* LinkedIn */}
              <div className="space-y-1.5">
                <label className="text-slate-300 font-semibold flex items-center space-x-1.5">
                  <Linkedin className="w-4 h-4 text-cyan-400" />
                  <span>LinkedIn B2B Company Profile</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={defaultLinks.linkedinUrl || ''}
                    onChange={(e) => triggerAutosave({ ...defaultLinks, linkedinUrl: e.target.value })}
                    placeholder="https://linkedin.com/company/gurucraftpro"
                    className="w-full bg-slate-950 border border-slate-700/80 focus:border-teal-400 text-white rounded-xl px-3.5 py-2.5 font-mono text-xs outline-none transition-colors"
                  />
                  {defaultLinks.linkedinUrl && (
                    <a
                      href={defaultLinks.linkedinUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="absolute right-2.5 top-2.5 p-1 text-slate-400 hover:text-cyan-400"
                      title="Test Link"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
              </div>

              {/* Google Business Profile / Maps */}
              <div className="space-y-1.5">
                <label className="text-slate-300 font-semibold flex items-center space-x-1.5">
                  <MapPin className="w-4 h-4 text-red-400" />
                  <span>Google Business Profile (Local Rohini)</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={defaultLinks.googleBusinessUrl || ''}
                    onChange={(e) => triggerAutosave({ ...defaultLinks, googleBusinessUrl: e.target.value })}
                    placeholder="https://maps.google.com/?q=GurucraftPro+Rohini+Delhi"
                    className="w-full bg-slate-950 border border-slate-700/80 focus:border-teal-400 text-white rounded-xl px-3.5 py-2.5 font-mono text-xs outline-none transition-colors"
                  />
                  {defaultLinks.googleBusinessUrl && (
                    <a
                      href={defaultLinks.googleBusinessUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="absolute right-2.5 top-2.5 p-1 text-slate-400 hover:text-red-400"
                      title="Test Link"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
              </div>

              {/* Behance Portfolio */}
              <div className="space-y-1.5">
                <label className="text-slate-300 font-semibold flex items-center space-x-1.5">
                  <Globe className="w-4 h-4 text-blue-400" />
                  <span>Behance / Dribbble Portfolio</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={defaultLinks.behanceUrl || ''}
                    onChange={(e) => triggerAutosave({ ...defaultLinks, behanceUrl: e.target.value })}
                    placeholder="https://behance.net/gurucraftpro"
                    className="w-full bg-slate-950 border border-slate-700/80 focus:border-teal-400 text-white rounded-xl px-3.5 py-2.5 font-mono text-xs outline-none transition-colors"
                  />
                  {defaultLinks.behanceUrl && (
                    <a
                      href={defaultLinks.behanceUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="absolute right-2.5 top-2.5 p-1 text-slate-400 hover:text-blue-400"
                      title="Test Link"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
              </div>

            </div>
          </div>

          {/* Custom Social / Marketplace Profiles */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
              <div>
                <h3 className="text-base font-bold text-white flex items-center space-x-2">
                  <Globe className="w-4 h-4 text-purple-400" />
                  <span>Active Link Profiles & Custom Channels ({filteredLinks.length})</span>
                </h3>
                <p className="text-xs text-slate-400">
                  Categorized profiles with placement controls (Header, Footer, Contact, Product Page).
                </p>
              </div>

              {/* Filter Pills */}
              <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-[11px]">
                <button
                  onClick={() => setActiveFilter('all')}
                  className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                    activeFilter === 'all' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  All ({links.length})
                </button>
                <button
                  onClick={() => setActiveFilter('social')}
                  className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                    activeFilter === 'social' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Social
                </button>
                <button
                  onClick={() => setActiveFilter('marketplace')}
                  className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                    activeFilter === 'marketplace' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Marketplace
                </button>
              </div>
            </div>

            <div className="space-y-3">
              {filteredLinks.length === 0 ? (
                <div className="p-8 text-center bg-slate-950/60 border border-slate-800/80 rounded-2xl text-slate-400 text-xs">
                  No profiles found in this category. Click &quot;Add Custom Profile&quot; to create one.
                </div>
              ) : (
                filteredLinks.map((link) => (
                  <div
                    key={link.id}
                    className="p-4 bg-slate-950/80 border border-slate-800 hover:border-purple-500/40 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs transition-all group"
                  >
                    <div className="space-y-1.5">
                      <div className="flex items-center space-x-2">
                        {link.category === 'marketplace' ? (
                          <ShoppingBag className="w-4 h-4 text-amber-400" />
                        ) : (
                          <Globe className="w-4 h-4 text-teal-400" />
                        )}
                        <span className="font-bold text-white text-sm">{link.platformName}</span>
                        <span className="px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-mono text-[9px] uppercase">
                          {link.category}
                        </span>
                        <button
                          onClick={() => handleToggleLinkActive(link)}
                          className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase transition-colors ${
                            link.active
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                              : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                          }`}
                        >
                          {link.active ? 'Active' : 'Disabled'}
                        </button>
                      </div>

                      <div className="font-mono text-slate-400 text-[11px] truncate max-w-md">
                        {link.url}
                      </div>

                      {/* Locations */}
                      <div className="flex flex-wrap gap-1 pt-1">
                        {link.location?.map((loc) => (
                          <span
                            key={loc}
                            className="px-1.5 py-0.5 rounded bg-purple-950/50 text-purple-300 text-[9px] font-medium border border-purple-800/40"
                          >
                            📍 {loc}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 shrink-0">
                      <a
                        href={link.url}
                        target="_blank"
                        rel="noreferrer"
                        className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl transition-colors"
                        title="Open External URL"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                      <button
                        onClick={() => openEditModal(link)}
                        className="px-3 py-1.5 bg-slate-800 hover:bg-purple-900/40 hover:text-purple-300 text-slate-300 rounded-xl transition-colors font-medium"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteLink(link.id)}
                        className="p-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 rounded-xl transition-colors"
                        title="Delete Profile"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Live Frontend Preview Simulator */}
        <div className="xl:col-span-5 space-y-6">
          <div className="sticky top-28 space-y-6">
            
            {/* Live Frontend Mockup Card */}
            <div className="bg-slate-900/90 border border-purple-500/30 rounded-3xl p-6 space-y-5 shadow-2xl">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center space-x-2">
                  <Eye className="w-4 h-4 text-cyan-400" />
                  <span className="text-sm font-bold text-white">Live Website Footer Preview</span>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold">
                  Dynamic Sync Active
                </span>
              </div>

              <p className="text-xs text-slate-400">
                This is how your social channels and marketplaces render on the live customer-facing website footer:
              </p>

              {/* Simulated Footer Block */}
              <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
                <div className="flex items-center space-x-2">
                  <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-purple-600 to-amber-500 flex items-center justify-center p-0.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                  </div>
                  <div>
                    <div className="text-xs font-black text-white">Gurucraftpro Studio</div>
                    <div className="text-[10px] text-slate-400">Rohini, Delhi 110085</div>
                  </div>
                </div>

                {/* Social Icons Bar */}
                <div className="space-y-2 pt-2 border-t border-slate-900">
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Official Social Channels
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {defaultLinks.whatsappUrl && (
                      <a
                        href={defaultLinks.whatsappUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20 transition-colors"
                        title="WhatsApp"
                      >
                        <MessageCircle className="w-4 h-4" />
                      </a>
                    )}
                    {defaultLinks.instagramUrl && (
                      <a
                        href={defaultLinks.instagramUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="p-2 rounded-xl bg-pink-500/10 border border-pink-500/30 text-pink-400 hover:bg-pink-500/20 transition-colors"
                        title="Instagram"
                      >
                        <Instagram className="w-4 h-4" />
                      </a>
                    )}
                    {defaultLinks.youtubeUrl && (
                      <a
                        href={defaultLinks.youtubeUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="p-2 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20 transition-colors"
                        title="YouTube"
                      >
                        <Youtube className="w-4 h-4" />
                      </a>
                    )}
                    {defaultLinks.facebookUrl && (
                      <a
                        href={defaultLinks.facebookUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="p-2 rounded-xl bg-blue-500/10 border border-blue-500/30 text-blue-400 hover:bg-blue-500/20 transition-colors"
                        title="Facebook"
                      >
                        <Facebook className="w-4 h-4" />
                      </a>
                    )}
                    {defaultLinks.linkedinUrl && (
                      <a
                        href={defaultLinks.linkedinUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/20 transition-colors"
                        title="LinkedIn"
                      >
                        <Linkedin className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                </div>

                {/* Marketplace Badges */}
                <div className="space-y-2 pt-2 border-t border-slate-900">
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Online Marketplace Storefronts
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-[11px]">
                    {defaultLinks.amazonUrl && (
                      <a
                        href={defaultLinks.amazonUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="p-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-amber-500/50 flex items-center space-x-2 text-slate-200"
                      >
                        <ShoppingBag className="w-3.5 h-3.5 text-amber-400" />
                        <span className="truncate">Amazon Store</span>
                      </a>
                    )}
                    {defaultLinks.flipkartUrl && (
                      <a
                        href={defaultLinks.flipkartUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="p-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-blue-500/50 flex items-center space-x-2 text-slate-200"
                      >
                        <ShoppingBag className="w-3.5 h-3.5 text-blue-400" />
                        <span className="truncate">Flipkart Store</span>
                      </a>
                    )}
                    {defaultLinks.etsyUrl && (
                      <a
                        href={defaultLinks.etsyUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="p-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-orange-500/50 flex items-center space-x-2 text-slate-200"
                      >
                        <Globe className="w-3.5 h-3.5 text-orange-400" />
                        <span className="truncate">Etsy Global</span>
                      </a>
                    )}
                  </div>
                </div>

              </div>
            </div>

            {/* Quick Testing Matrix */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 space-y-4">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center space-x-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Link Health & Direct Verification</span>
              </h4>
              <p className="text-[11px] text-slate-400">
                Click below to verify that all social URLs and WhatsApp deep-links are live and functioning:
              </p>
              <div className="flex flex-wrap gap-2 text-xs">
                <a
                  href={defaultLinks.whatsappUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-emerald-900/30 text-emerald-300 flex items-center space-x-1"
                >
                  <span>Test WhatsApp</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
                <a
                  href={defaultLinks.instagramUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-pink-900/30 text-pink-300 flex items-center space-x-1"
                >
                  <span>Test Instagram</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
                <a
                  href={defaultLinks.amazonUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-amber-900/30 text-amber-300 flex items-center space-x-1"
                >
                  <span>Test Amazon</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>

          </div>
        </div>

      </div>

      {/* Add / Edit Profile Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700/80 rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-lg font-bold text-white">
                {editingLinkId ? 'Edit Link Profile' : 'Add Custom Link Profile'}
              </h3>
              <button onClick={closeModal} className="text-slate-400 hover:text-white text-lg">
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveLinkItem} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Platform Name (e.g. Behance, Pinterest, Google Business, Medium)
                </label>
                <input
                  type="text"
                  required
                  value={platformName}
                  onChange={(e) => setPlatformName(e.target.value)}
                  placeholder="e.g. Pinterest Inspiration"
                  className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl px-3.5 py-2.5 outline-none focus:border-teal-400"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Profile / Store URL</label>
                <input
                  type="text"
                  required
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://..."
                  className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl px-3.5 py-2.5 font-mono outline-none focus:border-teal-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl px-3.5 py-2.5 outline-none focus:border-teal-400"
                  >
                    <option value="social">Social Media Handle</option>
                    <option value="marketplace">E-Commerce Marketplace</option>
                    <option value="custom">External Portfolio / Profile</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Display Label</label>
                  <input
                    type="text"
                    value={label}
                    onChange={(e) => setLabel(e.target.value)}
                    placeholder="e.g. Follow on Behance"
                    className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl px-3.5 py-2.5 outline-none focus:border-teal-400"
                  />
                </div>
              </div>

              {/* Placements */}
              <div>
                <label className="block text-slate-300 font-semibold mb-2">Display Placements on Website</label>
                <div className="flex flex-wrap gap-2">
                  {['header', 'footer', 'contact', 'product'].map((loc) => (
                    <button
                      type="button"
                      key={loc}
                      onClick={() => toggleLocation(loc)}
                      className={`px-3 py-1.5 rounded-xl border text-xs font-semibold capitalize transition-all ${
                        locations.includes(loc)
                          ? 'bg-purple-600 text-white border-purple-500 shadow-md'
                          : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                      }`}
                    >
                      {locations.includes(loc) ? '✓ ' : '+ '}
                      {loc}
                    </button>
                  ))}
                </div>
              </div>

              {/* Active Toggle */}
              <div className="flex items-center space-x-2 pt-2">
                <input
                  type="checkbox"
                  id="active-toggle"
                  checked={activeStatus}
                  onChange={(e) => setActiveStatus(e.target.checked)}
                  className="rounded bg-slate-950 border-slate-700 text-purple-600 focus:ring-0"
                />
                <label htmlFor="active-toggle" className="text-slate-300 font-medium">
                  Show link publicly on website (Active)
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-gradient-to-r from-purple-600 to-teal-500 text-white font-bold rounded-xl shadow-lg shadow-purple-900/30"
                >
                  {editingLinkId ? 'Save Changes' : 'Create Profile'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
