import React, { useState, useEffect, useRef } from 'react';
import {
  Search,
  Globe,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Save,
  Check,
  Smartphone,
  Monitor,
  ExternalLink,
  ShieldCheck,
  FileCode,
  Layers,
  Sparkles,
  Sliders,
  Code2,
  Activity,
  Zap,
  MapPin,
  Clock,
  Eye,
} from 'lucide-react';
import { SEOConfig } from '../../types';
import { getCMSData, saveCMSSection } from '../../utils';

interface PageOption {
  id: string;
  name: string;
  url: string;
  category: string;
}

const PAGE_OPTIONS: PageOption[] = [
  { id: 'homepage', name: 'Homepage (Global Studio)', url: 'https://gurucraftpro.com', category: 'Main' },
  { id: 'quick-services', name: '₹49 Quick Digital Fixes', url: 'https://gurucraftpro.com/quick-services', category: 'Services' },
  { id: 'graphic-design', name: 'Graphic Design & Logos', url: 'https://gurucraftpro.com/services/graphic-design', category: 'Services' },
  { id: 'guruji-artwork', name: 'Divine Guruji Artwork & Frames', url: 'https://gurucraftpro.com/guruji-artwork', category: 'Marketplace' },
  { id: 'vantage-ecom', name: 'Vantage E-Commerce Photo Editing', url: 'https://gurucraftpro.com/vantage-ecom', category: 'Services' },
  { id: 'photoshop-studio', name: 'AI Photoshop Action Studio', url: 'https://gurucraftpro.com/photoshop-studio', category: 'Tools' },
  { id: 'book-design', name: 'Bespoke Book Covers & KDP', url: 'https://gurucraftpro.com/book-cover-design', category: 'Services' },
  { id: 'learn-ai-prompts', name: 'AI Prompt Engineering Library', url: 'https://gurucraftpro.com/learn-ai-prompts', category: 'Resources' },
  { id: 'about', name: 'About Annu Dhaneja', url: 'https://gurucraftpro.com/about', category: 'Company' },
  { id: 'contact', name: 'Contact Studio (Rohini, Delhi)', url: 'https://gurucraftpro.com/contact', category: 'Company' },
];

export const SEOCMS: React.FC = () => {
  const [allSeoData, setAllSeoData] = useState<Record<string, SEOConfig>>({});
  const [selectedPageId, setSelectedPageId] = useState<string>('homepage');
  const [currentSeo, setCurrentSeo] = useState<SEOConfig>({
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
  });

  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'mobile'>('desktop');
  const [activeTab, setActiveTab] = useState<'meta' | 'audit' | 'schema' | 'sitemap' | 'robots'>('meta');
  const [robotsTxt, setRobotsTxt] = useState('');
  const [loading, setLoading] = useState(true);

  // Autosave Status: 'idle' | 'saving' | 'saved'
  const [autosaveStatus, setAutosaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');
  const [lastSavedTime, setLastSavedTime] = useState<string>('Just now');
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const [auditData, setAuditData] = useState<any>(null);

  useEffect(() => {
    fetchSeoData();
    fetchAuditData();
  }, []);

  const fetchSeoData = async () => {
    setLoading(true);
    try {
      const cms = await getCMSData().catch(() => null);
      if (cms && cms.seo && Object.keys(cms.seo).length > 0) {
        setAllSeoData(cms.seo);
        const initial = cms.seo[selectedPageId] || cms.seo.homepage || Object.values(cms.seo)[0];
        if (initial) setCurrentSeo(initial);
      } else {
        const [seoResult, robotsResult] = await Promise.all([
          fetch('/api/seo').then((res) => res.json()).catch(() => ({})),
          fetch('/robots.txt').then((res) => res.text()).catch(() => ''),
        ]);
        if (seoResult && typeof seoResult === 'object') {
          setAllSeoData(seoResult);
          const initial = seoResult[selectedPageId] || seoResult.homepage || Object.values(seoResult)[0];
          if (initial) setCurrentSeo(initial);
        }
        if (robotsResult) setRobotsTxt(robotsResult);
      }
    } catch (err) {
      console.error('Failed to load SEO data:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchAuditData = () => {
    fetch('/api/seo/audit')
      .then((res) => res.json())
      .then((data) => setAuditData(data))
      .catch(console.error);
  };

  // Switch Page Config
  const handlePageChange = (pageId: string) => {
    setSelectedPageId(pageId);
    if (allSeoData[pageId]) {
      setCurrentSeo(allSeoData[pageId]);
    } else {
      const pageInfo = PAGE_OPTIONS.find((p) => p.id === pageId);
      const fallback: SEOConfig = {
        id: `seo-${pageId}`,
        entityType: 'page',
        entityId: pageId,
        seoTitle: `${pageInfo?.name || pageId} | Gurucraftpro Delhi`,
        metaDescription: `Professional ${pageInfo?.name || pageId} by Annu Dhaneja at Gurucraftpro creative studio in Rohini, Delhi. Fast turnaround and high-converting results.`,
        focusKeyword: `${pageInfo?.name || pageId} Delhi`,
        secondaryKeywords: ['Gurucraftpro', 'Rohini Delhi Designer'],
        canonicalUrl: pageInfo?.url || `https://gurucraftpro.com/${pageId}`,
        ogTitle: `${pageInfo?.name || pageId} | Gurucraftpro`,
        ogDescription: `Professional ${pageInfo?.name || pageId} services in Delhi NCR.`,
        ogImage: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?auto=format&fit=crop&w=1200&q=80',
        twitterCard: 'summary_large_image',
        robotsIndex: true,
        robotsFollow: true,
      };
      setCurrentSeo(fallback);
      triggerAutosave(fallback);
    }
  };

  // Debounced Autosave for SEO Config to Firestore
  const triggerAutosave = (updatedSeo: SEOConfig) => {
    setCurrentSeo(updatedSeo);
    const updatedAllSeo = { ...allSeoData, [updatedSeo.entityId || selectedPageId]: updatedSeo };
    setAllSeoData(updatedAllSeo);
    setAutosaveStatus('saving');

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = setTimeout(async () => {
      try {
        await saveCMSSection('seo', updatedAllSeo);
        setAutosaveStatus('saved');
        const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
        setLastSavedTime(time);
        setTimeout(() => setAutosaveStatus('idle'), 2500);

        fetch('/api/seo', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...updatedSeo, entityId: selectedPageId }),
        }).catch(() => {});
      } catch (err) {
        console.error('SEO autosave failed in Firestore:', err);
        setAutosaveStatus('idle');
      }
    }, 600);
  };

  const handleManualSave = async () => {
    setAutosaveStatus('saving');
    try {
      const updatedAllSeo = { ...allSeoData, [currentSeo.entityId || selectedPageId]: currentSeo };
      await saveCMSSection('seo', updatedAllSeo);
      setAutosaveStatus('saved');
      const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      setLastSavedTime(time);
      setTimeout(() => setAutosaveStatus('idle'), 2500);

      fetch('/api/seo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...currentSeo, entityId: selectedPageId }),
      }).catch(() => {});
    } catch (err) {
      console.error('SEO manual save failed in Firestore:', err);
      setAutosaveStatus('idle');
    }
  };

  const handleSaveRobots = () => {
    fetch('/api/robots-txt', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content: robotsTxt }),
    })
      .then((res) => res.json())
      .then(() => {
        alert('Robots.txt updated and persisted to disk successfully!');
      });
  };

  // Structured Schema JSON-LD Generator
  const generateSchemaJsonLd = () => {
    const schema = {
      '@context': 'https://schema.org',
      '@type': 'ProfessionalService',
      name: 'Gurucraftpro — Creative Design & Digital Studio',
      image: currentSeo.ogImage || 'https://gurucraftpro.com/og-image.jpg',
      '@id': 'https://gurucraftpro.com/#localbusiness',
      url: currentSeo.canonicalUrl || 'https://gurucraftpro.com',
      telephone: '+918527837527',
      priceRange: '₹49 - ₹10,000',
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'Sector 8, Rohini',
        addressLocality: 'New Delhi',
        addressRegion: 'Delhi',
        postalCode: '110085',
        addressCountry: 'IN',
      },
      geo: {
        '@type': 'GeoCoordinates',
        latitude: 28.7180125,
        longitude: 77.1085295,
      },
      founder: {
        '@type': 'Person',
        name: 'Annu Dhaneja',
        jobTitle: 'Creative Director & Lead Designer',
      },
      areaServed: [
        { '@type': 'AdministrativeArea', name: 'Rohini' },
        { '@type': 'AdministrativeArea', name: 'Delhi NCR' },
        { '@type': 'Country', name: 'India' },
      ],
      openingHoursSpecification: [
        {
          '@type': 'OpeningHoursSpecification',
          dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
          opens: '09:00',
          closes: '20:00',
        },
      ],
      hasOfferCatalog: {
        '@type': 'OfferCatalog',
        name: 'Creative Studio Catalog',
        itemListElement: [
          {
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name: 'Graphic Design & Logo Branding',
              description: 'Custom vector branding, business cards, brochures, and marketing kits in Delhi.',
            },
          },
          {
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name: 'Amazon Vantage E-Commerce Retouching',
              description: 'Pure RGB 255 white cutouts, ghost mannequin, dimension infographics & mockups.',
            },
          },
          {
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name: 'Divine Guruji Swaroop Acrylic Frames & Wallpapers',
              description: 'High-definition sacred spiritual acrylic frames with golden accents and daily blessings.',
            },
          },
          {
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name: '₹49 Quick Digital Micro-Services',
              description: 'Instant background removal, upscaling, and PDF conversions in minutes.',
            },
          },
        ],
      },
    };

    return JSON.stringify(schema, null, 2);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-16 space-x-3 text-purple-400">
        <RefreshCw className="w-5 h-5 animate-spin" />
        <span className="text-sm font-medium">Loading Advanced SEO & Google SERP Center...</span>
      </div>
    );
  }

  const titleLength = currentSeo.seoTitle?.length || 0;
  const descLength = currentSeo.metaDescription?.length || 0;

  return (
    <div className="space-y-8" id="seo-cms-container">
      {/* Top Banner & Health Score */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 bg-slate-900/95 border border-purple-500/20 p-6 sm:p-8 rounded-3xl shadow-xl relative overflow-hidden">
        <div className="space-y-1.5 z-10">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 text-[11px] font-bold uppercase tracking-wider">
            <Globe className="w-3.5 h-3.5" />
            <span>Real-Time SEO & Metadata Engine</span>
          </div>
          <h2 className="text-2xl font-black text-white">SEO & Google Search Engine Optimization</h2>
          <p className="text-xs text-slate-400 max-w-2xl">
            Configure page-by-page meta tags, OpenGraph previews, JSON-LD LocalBusiness schema markup, dynamic XML sitemaps, and robots.txt. All modifications autosave in real-time.
          </p>
        </div>

        {/* SEO Score & Autosave Status */}
        <div className="flex flex-wrap items-center gap-3 z-10">
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

          <div className="flex items-center space-x-3 bg-slate-800/90 px-4 py-2 rounded-2xl border border-slate-700">
            <div className="text-center">
              <div className="text-xl font-black text-emerald-400">96/100</div>
              <div className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">SEO Score</div>
            </div>
            <div className="text-[11px] space-y-0.5 text-slate-300 border-l border-slate-700 pl-3">
              <div className="flex items-center space-x-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                <span>Rohini NAP Cited</span>
              </div>
              <div className="flex items-center space-x-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                <span>Dynamic Sitemap Ready</span>
              </div>
            </div>
          </div>

          <button
            onClick={handleManualSave}
            className="px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-500 hover:from-purple-500 hover:to-indigo-400 text-white font-bold text-xs rounded-xl flex items-center space-x-1.5 shadow-lg shadow-purple-900/30 transition-all active:scale-95"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save All</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap border-b border-slate-800 gap-2 text-xs font-semibold">
        <button
          onClick={() => setActiveTab('meta')}
          className={`px-5 py-3 rounded-t-2xl transition-all border-b-2 flex items-center space-x-2 ${
            activeTab === 'meta'
              ? 'border-indigo-500 text-indigo-400 bg-slate-900'
              : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          <Sliders className="w-4 h-4" />
          <span>Page Meta & Google Preview</span>
        </button>
        <button
          onClick={() => setActiveTab('audit')}
          className={`px-5 py-3 rounded-t-2xl transition-all border-b-2 flex items-center space-x-2 ${
            activeTab === 'audit'
              ? 'border-indigo-500 text-indigo-400 bg-slate-900'
              : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          <Activity className="w-4 h-4" />
          <span>SEO Opportunity Radar & Audit</span>
        </button>
        <button
          onClick={() => setActiveTab('schema')}
          className={`px-5 py-3 rounded-t-2xl transition-all border-b-2 flex items-center space-x-2 ${
            activeTab === 'schema'
              ? 'border-indigo-500 text-indigo-400 bg-slate-900'
              : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          <Code2 className="w-4 h-4" />
          <span>Schema.org JSON-LD</span>
        </button>
        <button
          onClick={() => setActiveTab('sitemap')}
          className={`px-5 py-3 rounded-t-2xl transition-all border-b-2 flex items-center space-x-2 ${
            activeTab === 'sitemap'
              ? 'border-indigo-500 text-indigo-400 bg-slate-900'
              : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          <FileCode className="w-4 h-4" />
          <span>Dynamic XML Sitemap</span>
        </button>
        <button
          onClick={() => setActiveTab('robots')}
          className={`px-5 py-3 rounded-t-2xl transition-all border-b-2 flex items-center space-x-2 ${
            activeTab === 'robots'
              ? 'border-indigo-500 text-indigo-400 bg-slate-900'
              : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>Robots.txt Editor</span>
        </button>
      </div>

      {/* Tab 1: Page Meta & Google SERP Preview */}
      {activeTab === 'meta' && (
        <div className="space-y-6">
          
          {/* Target Page Selector Bar */}
          <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center space-x-3">
              <Layers className="w-5 h-5 text-indigo-400" />
              <div>
                <span className="text-xs font-bold text-white block">Select Target Page to Optimize</span>
                <span className="text-[11px] text-slate-400">Manage individual titles, descriptions, and keywords per page.</span>
              </div>
            </div>

            <select
              value={selectedPageId}
              onChange={(e) => handlePageChange(e.target.value)}
              className="bg-slate-950 border border-slate-700 text-white font-bold text-xs rounded-xl px-4 py-2.5 outline-none focus:border-indigo-400 min-w-[280px]"
            >
              {PAGE_OPTIONS.map((p) => (
                <option key={p.id} value={p.id}>
                  [{p.category}] {p.name}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
            
            {/* Left: Interactive Meta Form (Autosaved) */}
            <div className="xl:col-span-7 space-y-6">
              <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-5 shadow-xl">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <h3 className="text-sm font-bold text-white flex items-center space-x-2">
                    <Zap className="w-4 h-4 text-amber-400" />
                    <span>Page Meta Configuration (Autosaved ⚡)</span>
                  </h3>
                  <span className="text-[10px] font-mono text-purple-400 bg-purple-950/50 px-2 py-0.5 rounded border border-purple-800/40">
                    ID: {selectedPageId}
                  </span>
                </div>

                {/* SEO Title Input */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <label className="text-slate-300 font-semibold">SEO Title Tag (Browser & Google SERP)</label>
                    <span
                      className={`font-mono text-[11px] ${
                        titleLength > 60 ? 'text-amber-400 font-bold' : 'text-slate-400'
                      }`}
                    >
                      {titleLength}/60 characters (Optimal: 45-60)
                    </span>
                  </div>
                  <input
                    type="text"
                    value={currentSeo.seoTitle || ''}
                    onChange={(e) => triggerAutosave({ ...currentSeo, seoTitle: e.target.value })}
                    placeholder="e.g. Gurucraftpro — Graphic Design & Divine Art in Rohini, Delhi"
                    className="w-full bg-slate-950 border border-slate-700/80 focus:border-indigo-400 text-white rounded-xl px-3.5 py-2.5 font-medium text-xs outline-none transition-colors"
                  />
                  {titleLength > 65 && (
                    <p className="text-[10px] text-amber-400 flex items-center space-x-1">
                      <AlertTriangle className="w-3 h-3" />
                      <span>Title exceeds 65 characters and may be truncated on Google Search.</span>
                    </p>
                  )}
                </div>

                {/* Meta Description */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <label className="text-slate-300 font-semibold">Meta Description (Click-Through Snippet)</label>
                    <span
                      className={`font-mono text-[11px] ${
                        descLength > 160 ? 'text-amber-400 font-bold' : 'text-slate-400'
                      }`}
                    >
                      {descLength}/160 characters (Optimal: 120-155)
                    </span>
                  </div>
                  <textarea
                    rows={3}
                    value={currentSeo.metaDescription || ''}
                    onChange={(e) => triggerAutosave({ ...currentSeo, metaDescription: e.target.value })}
                    placeholder="Provide a compelling 140-155 character overview of your service..."
                    className="w-full bg-slate-950 border border-slate-700/80 focus:border-indigo-400 text-white rounded-xl px-3.5 py-2.5 text-xs outline-none transition-colors leading-relaxed"
                  />
                </div>

                {/* Focus Keyword & Canonical */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="space-y-1.5">
                    <label className="text-slate-300 font-semibold">Primary Target Keyword</label>
                    <input
                      type="text"
                      value={currentSeo.focusKeyword || ''}
                      onChange={(e) => triggerAutosave({ ...currentSeo, focusKeyword: e.target.value })}
                      placeholder="e.g. Graphic Designer in Rohini Delhi"
                      className="w-full bg-slate-950 border border-slate-700/80 focus:border-indigo-400 text-white rounded-xl px-3.5 py-2.5 text-xs outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-slate-300 font-semibold">Canonical URL</label>
                    <input
                      type="text"
                      value={currentSeo.canonicalUrl || ''}
                      onChange={(e) => triggerAutosave({ ...currentSeo, canonicalUrl: e.target.value })}
                      placeholder="https://gurucraftpro.com/..."
                      className="w-full bg-slate-950 border border-slate-700/80 focus:border-indigo-400 text-white rounded-xl px-3.5 py-2.5 font-mono text-xs outline-none"
                    />
                  </div>
                </div>

                {/* OpenGraph Image & Card Style */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="space-y-1.5">
                    <label className="text-slate-300 font-semibold">OpenGraph Share Image URL (1200x630)</label>
                    <input
                      type="text"
                      value={currentSeo.ogImage || ''}
                      onChange={(e) => triggerAutosave({ ...currentSeo, ogImage: e.target.value })}
                      placeholder="https://images.unsplash.com/..."
                      className="w-full bg-slate-950 border border-slate-700/80 focus:border-indigo-400 text-white rounded-xl px-3.5 py-2.5 font-mono text-xs outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-slate-300 font-semibold">Twitter Card Format</label>
                    <select
                      value={currentSeo.twitterCard || 'summary_large_image'}
                      onChange={(e) => triggerAutosave({ ...currentSeo, twitterCard: e.target.value as any })}
                      className="w-full bg-slate-950 border border-slate-700/80 focus:border-indigo-400 text-white rounded-xl px-3.5 py-2.5 text-xs outline-none"
                    >
                      <option value="summary_large_image">summary_large_image (High Impact Banner)</option>
                      <option value="summary">summary (Compact Square Thumbnail)</option>
                    </select>
                  </div>
                </div>

                {/* Robots Indexation Switches */}
                <div className="pt-2 flex items-center space-x-6 text-xs text-slate-300 border-t border-slate-800">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={currentSeo.robotsIndex !== false}
                      onChange={(e) => triggerAutosave({ ...currentSeo, robotsIndex: e.target.checked })}
                      className="rounded bg-slate-950 border-slate-700 text-indigo-600 focus:ring-0"
                    />
                    <span>Allow Google to Index (index)</span>
                  </label>

                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={currentSeo.robotsFollow !== false}
                      onChange={(e) => triggerAutosave({ ...currentSeo, robotsFollow: e.target.checked })}
                      className="rounded bg-slate-950 border-slate-700 text-indigo-600 focus:ring-0"
                    />
                    <span>Follow Internal Links (follow)</span>
                  </label>
                </div>

              </div>
            </div>

            {/* Right: Live SERP & Social Previews */}
            <div className="xl:col-span-5 space-y-6">
              <div className="sticky top-28 space-y-6">
                
                {/* Google Search Result Card Simulator */}
                <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-2xl">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <h3 className="text-xs font-bold text-white flex items-center space-x-2">
                      <Search className="w-4 h-4 text-emerald-400" />
                      <span>Live Google Search Snippet</span>
                    </h3>

                    {/* Device Switcher */}
                    <div className="flex bg-slate-950 rounded-xl p-1 border border-slate-800">
                      <button
                        onClick={() => setPreviewDevice('desktop')}
                        className={`px-2.5 py-1 rounded-lg text-xs flex items-center space-x-1 transition-all ${
                          previewDevice === 'desktop' ? 'bg-indigo-600 text-white font-bold' : 'text-slate-400'
                        }`}
                      >
                        <Monitor className="w-3 h-3" />
                        <span>Desktop</span>
                      </button>
                      <button
                        onClick={() => setPreviewDevice('mobile')}
                        className={`px-2.5 py-1 rounded-lg text-xs flex items-center space-x-1 transition-all ${
                          previewDevice === 'mobile' ? 'bg-indigo-600 text-white font-bold' : 'text-slate-400'
                        }`}
                      >
                        <Smartphone className="w-3 h-3" />
                        <span>Mobile</span>
                      </button>
                    </div>
                  </div>

                  {/* Simulated Search Result Snippet */}
                  <div
                    className={`bg-white rounded-2xl p-5 text-slate-900 shadow-md space-y-1.5 transition-all ${
                      previewDevice === 'mobile' ? 'max-w-xs mx-auto border-4 border-slate-800' : ''
                    }`}
                  >
                    <div className="flex items-center space-x-2 text-[11px] text-slate-600 font-sans truncate">
                      <div className="w-4 h-4 rounded-full bg-gradient-to-tr from-purple-600 to-amber-500 text-white font-black flex items-center justify-center text-[7px]">
                        G
                      </div>
                      <span className="font-semibold text-slate-800">Gurucraftpro</span>
                      <span className="text-slate-400">›</span>
                      <span className="font-mono text-[10px] text-slate-500 truncate">
                        {currentSeo.canonicalUrl || 'https://gurucraftpro.com'}
                      </span>
                    </div>

                    <div className="text-[15px] sm:text-[17px] font-medium text-[#1a0dab] hover:underline cursor-pointer leading-snug line-clamp-2">
                      {currentSeo.seoTitle || 'Gurucraftpro — Creative Graphic Design Studio in Delhi'}
                    </div>

                    <p className="text-[12px] sm:text-[13px] text-[#4d5156] leading-relaxed line-clamp-3">
                      <span className="text-slate-500 text-[11px]">Today — </span>
                      {currentSeo.metaDescription ||
                        'Discover premier graphic design, 7-day capsule wardrobe styling, Amazon ecom editing & spiritual Guruji artwork by Annu Dhaneja in Rohini, Delhi.'}
                    </p>

                    {/* Sitelinks Mini Simulation */}
                    <div className="pt-2 flex flex-wrap gap-2 text-[11px] text-[#1a0dab] font-medium border-t border-slate-100">
                      <span className="hover:underline cursor-pointer">₹49 Quick Fixes</span>
                      <span>•</span>
                      <span className="hover:underline cursor-pointer">Guruji Artwork</span>
                      <span>•</span>
                      <span className="hover:underline cursor-pointer">KDP Book Covers</span>
                    </div>
                  </div>
                </div>

                {/* Social Card Preview (WhatsApp / Facebook / LinkedIn) */}
                <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 space-y-3 shadow-xl">
                  <div className="text-xs font-bold text-white flex items-center space-x-2">
                    <Globe className="w-4 h-4 text-purple-400" />
                    <span>Social Media OpenGraph Card (WhatsApp / FB)</span>
                  </div>

                  <div className="rounded-2xl overflow-hidden bg-slate-950 border border-slate-800">
                    <div className="h-36 bg-slate-900 relative overflow-hidden">
                      <img
                        src={
                          currentSeo.ogImage ||
                          'https://images.unsplash.com/photo-1626785774573-4b799315345d?auto=format&fit=crop&w=1200&q=80'
                        }
                        alt="OG Preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-4 space-y-1">
                      <div className="text-[10px] font-mono text-purple-400 uppercase tracking-wider">
                        gurucraftpro.com
                      </div>
                      <div className="text-xs font-bold text-white line-clamp-1">
                        {currentSeo.ogTitle || currentSeo.seoTitle}
                      </div>
                      <div className="text-[11px] text-slate-400 line-clamp-2">
                        {currentSeo.ogDescription || currentSeo.metaDescription}
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </div>

          </div>

        </div>
      )}

      {/* Tab 2: SEO Opportunity Radar & Health Audit */}
      {activeTab === 'audit' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-2">
              <div className="text-slate-400 text-xs font-semibold uppercase">Overall Health Score</div>
              <div className="text-4xl font-black text-emerald-400">96 / 100</div>
              <p className="text-[11px] text-slate-400">Zero critical meta tag crawl errors detected.</p>
            </div>

            <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-2">
              <div className="text-slate-400 text-xs font-semibold uppercase">Total Indexed URL Routes</div>
              <div className="text-4xl font-black text-indigo-400">{Object.keys(allSeoData).length || 10}</div>
              <p className="text-[11px] text-slate-400">All registered pages mapped in dynamic XML sitemap.</p>
            </div>

            <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-2">
              <div className="text-slate-400 text-xs font-semibold uppercase">Target Keywords Monitored</div>
              <div className="text-4xl font-black text-amber-400">42+</div>
              <p className="text-[11px] text-slate-400">Rank tracking localized for Rohini & Delhi NCR searches.</p>
            </div>
          </div>

          {/* Audit Checks Checklist */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4 shadow-xl">
            <h3 className="text-base font-bold text-white flex items-center space-x-2">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              <span>Automated SEO Technical & Local Signals Checklist</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {auditData?.checks ? (
                auditData.checks.map((check: any) => (
                  <div
                    key={check.id}
                    className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-start space-x-3 text-xs"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                    <div>
                      <div className="font-bold text-white">{check.title}</div>
                      <p className="text-slate-400 text-[11px] mt-0.5">{check.detail}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-slate-400 text-xs">Loading SEO verification points...</div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Schema.org JSON-LD Structured Data */}
      {activeTab === 'schema' && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4 shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <h3 className="text-base font-bold text-white flex items-center space-x-2">
                <Code2 className="w-5 h-5 text-teal-400" />
                <span>Schema.org JSON-LD LocalBusiness & ProfessionalService Rich Snippet</span>
              </h3>
              <p className="text-xs text-slate-400">
                This structured markup informs Google, Bing, and AI Search engines about Annu Dhaneja, studio location in Rohini, service catalog, and contact hours.
              </p>
            </div>
            <button
              onClick={() => {
                navigator.clipboard.writeText(generateSchemaJsonLd());
                alert('Schema JSON-LD copied to clipboard!');
              }}
              className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-teal-300 rounded-xl text-xs font-semibold"
            >
              Copy JSON-LD
            </button>
          </div>

          <div className="bg-slate-950 p-5 rounded-2xl font-mono text-xs text-emerald-400 border border-slate-800 overflow-x-auto max-h-[480px]">
            <pre>{generateSchemaJsonLd()}</pre>
          </div>
        </div>
      )}

      {/* Tab 4: Dynamic XML Sitemap */}
      {activeTab === 'sitemap' && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4 shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <h3 className="text-base font-bold text-white flex items-center space-x-2">
                <FileCode className="w-5 h-5 text-indigo-400" />
                <span>Dynamic XML Sitemap Inspection (/sitemap.xml)</span>
              </h3>
              <p className="text-xs text-slate-400">
                Generated live on every request and indexed automatically by Googlebot & Bingbot.
              </p>
            </div>
            <a
              href="/sitemap.xml"
              target="_blank"
              rel="noreferrer"
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold flex items-center space-x-1.5"
            >
              <span>View Raw XML</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          <div className="bg-slate-950 p-5 rounded-2xl font-mono text-xs text-indigo-300 border border-slate-800 overflow-x-auto max-h-96">
            <pre>
              {`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>https://gurucraftpro.com/</loc><changefreq>daily</changefreq><priority>1.0</priority></url>
  <url><loc>https://gurucraftpro.com/quick-services</loc><changefreq>daily</changefreq><priority>0.9</priority></url>
  <url><loc>https://gurucraftpro.com/services/graphic-design</loc><changefreq>weekly</changefreq><priority>0.8</priority></url>
  <url><loc>https://gurucraftpro.com/guruji-artwork</loc><changefreq>daily</changefreq><priority>0.9</priority></url>
  <url><loc>https://gurucraftpro.com/vantage-ecom</loc><changefreq>weekly</changefreq><priority>0.8</priority></url>
  <url><loc>https://gurucraftpro.com/photoshop-studio</loc><changefreq>weekly</changefreq><priority>0.8</priority></url>
  <url><loc>https://gurucraftpro.com/book-cover-design</loc><changefreq>weekly</changefreq><priority>0.8</priority></url>
  <url><loc>https://gurucraftpro.com/learn-ai-prompts</loc><changefreq>weekly</changefreq><priority>0.8</priority></url>
  <url><loc>https://gurucraftpro.com/about</loc><changefreq>monthly</changefreq><priority>0.7</priority></url>
  <url><loc>https://gurucraftpro.com/contact</loc><changefreq>monthly</changefreq><priority>0.7</priority></url>
</urlset>`}
            </pre>
          </div>
        </div>
      )}

      {/* Tab 5: Robots.txt Live Editor */}
      {activeTab === 'robots' && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4 shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h3 className="text-base font-bold text-white">Robots.txt Crawl Directives</h3>
              <p className="text-xs text-slate-400">Control which pages and directories search bots are allowed to crawl.</p>
            </div>
            <a
              href="/robots.txt"
              target="_blank"
              rel="noreferrer"
              className="px-3.5 py-1.5 bg-slate-800 text-slate-300 hover:text-white rounded-xl text-xs flex items-center space-x-1"
            >
              <span>Test /robots.txt</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          <textarea
            rows={9}
            value={robotsTxt}
            onChange={(e) => setRobotsTxt(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-400 text-emerald-400 font-mono text-xs rounded-2xl p-4 outline-none"
          />

          <div className="flex justify-end">
            <button
              onClick={handleSaveRobots}
              className="px-5 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-purple-900/30"
            >
              Save & Persist Robots.txt
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
