import React, { useState, useEffect } from 'react';
import { Save, Plus, Trash2, Eye, EyeOff, Layout, Sparkles, Image as ImageIcon, ArrowUp, ArrowDown, Check, RefreshCw } from 'lucide-react';
import { getCMSData, saveCMSSection } from '../../../utils';

export const HomePageCMS: React.FC = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [activeTab, setActiveTab] = useState<'hero' | 'services' | 'products' | 'portfolio' | 'testimonials' | 'faq' | 'cta'>('hero');

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    setLoading(true);
    setErrorMessage('');
    try {
      // 1. Primary Load: Firebase Firestore
      const cms = await getCMSData();
      if (cms.pageContents && cms.pageContents.home) {
        setData(cms.pageContents.home);
        return;
      }
      // Fallback if needed
      const res = await fetch('/api/page-content/home');
      if (res.ok) {
        const json = await res.json();
        setData(json);
      }
    } catch (e: any) {
      console.error('[HomePageCMS] Error loading from Firestore:', e);
      try {
        const res = await fetch('/api/page-content/home');
        if (res.ok) {
          const json = await res.json();
          setData(json);
        } else {
          setErrorMessage(`Failed to load: ${e?.message || 'Firestore error'}`);
        }
      } catch (err: any) {
        setErrorMessage(`Failed to load: ${e?.message || err?.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage('');
    setErrorMessage('');
    try {
      // 1. Primary Write: Firebase Firestore cms/main
      const currentCMS = await getCMSData();
      const updatedPageContents = {
        ...(currentCMS.pageContents || {}),
        home: data,
      };
      await saveCMSSection('pageContents', updatedPageContents);

      // 2. Synchronize server cache
      fetch('/api/page-content/home', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      }).catch((e) => console.warn('Server cache sync warning:', e));

      if (data.hero?.heroImage) {
        localStorage.setItem('gurucraft_hero_image', data.hero.heroImage);
        window.dispatchEvent(new Event('gurucraft_image_updated'));
      }

      setMessage('Home Page content saved and permanently published to Firestore!');
      setTimeout(() => setMessage(''), 4000);
    } catch (e: any) {
      console.error('[HomePageCMS] Firestore save error:', e);
      setErrorMessage(`Firestore Save Failed: ${e?.message || 'Permission denied or network failure'}`);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8 text-center text-slate-400">
        <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-2 text-purple-400" />
        <p>Loading Home Page CMS configuration...</p>
      </div>
    );
  }

  if (!data) return <div className="p-8 text-red-400">Failed to load Home Page content.</div>;

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-slate-900 border border-slate-800 rounded-2xl p-6 gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20 text-xs font-bold mb-2">
            <Layout className="w-3.5 h-3.5" />
            <span>Page Manager</span>
          </div>
          <h2 className="text-2xl font-black text-white">Home Page Management</h2>
          <p className="text-sm text-slate-400">Manage hero, services, featured products, portfolio, testimonials, FAQs and call-to-actions.</p>
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-amber-500 hover:from-purple-500 hover:to-amber-400 text-slate-950 font-bold text-sm shadow-lg shadow-purple-900/30 flex items-center space-x-2 transition-all"
        >
          {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          <span>{saving ? 'Publishing...' : 'Save & Publish Changes'}</span>
        </button>
      </div>

      {message && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-sm font-bold flex items-center space-x-2">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{message}</span>
        </div>
      )}

      {errorMessage && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-sm font-bold flex items-center space-x-2">
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Sub-tabs */}
      <div className="flex flex-wrap gap-2 border-b border-slate-800 pb-3">
        {[
          { id: 'hero', label: 'Hero Section' },
          { id: 'services', label: 'Services Section' },
          { id: 'products', label: 'Featured Products' },
          { id: 'portfolio', label: 'Portfolio Showcase' },
          { id: 'testimonials', label: 'Testimonials' },
          { id: 'faq', label: 'FAQ Accordion' },
          { id: 'cta', label: 'Bottom CTA' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
              activeTab === tab.id
                ? 'bg-purple-600 text-white shadow-md'
                : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* TAB 1: HERO SECTION */}
      {activeTab === 'hero' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
          <div className="flex justify-between items-center border-b border-slate-800 pb-4">
            <h3 className="text-lg font-bold text-white flex items-center space-x-2">
              <Sparkles className="w-5 h-5 text-amber-400" />
              <span>Existing Hero Section Features</span>
            </h3>
            <label className="flex items-center space-x-2 cursor-pointer text-xs font-bold text-slate-300">
              <input
                type="checkbox"
                checked={data.hero?.visible ?? true}
                onChange={(e) => setData({ ...data, hero: { ...data.hero, visible: e.target.checked } })}
                className="rounded bg-slate-800 border-slate-700 text-purple-600"
              />
              <span>Hero Visible on Homepage</span>
            </label>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold text-slate-400 mb-1">Badge Text</label>
              <input
                type="text"
                value={data.hero?.badgeText || ''}
                onChange={(e) => setData({ ...data, hero: { ...data.hero, badgeText: e.target.value } })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:border-purple-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 mb-1">Hero Heading</label>
              <input
                type="text"
                value={data.hero?.heading || ''}
                onChange={(e) => setData({ ...data, hero: { ...data.hero, heading: e.target.value } })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:border-purple-500"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-slate-400 mb-1">Hero Subheading & Description</label>
              <textarea
                rows={3}
                value={data.hero?.description || ''}
                onChange={(e) => setData({ ...data, hero: { ...data.hero, description: e.target.value } })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:border-purple-500"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold text-slate-400">Hero Image URL</label>
                <button
                  type="button"
                  onClick={() => setData({ ...data, hero: { ...data.hero, heroImage: '/images/creative_desk_real.jpg' } })}
                  className="text-[11px] text-teal-400 hover:text-teal-300 font-bold underline"
                >
                  Set to Real Studio Desk Image
                </button>
              </div>
              <input
                type="text"
                value={data.hero?.heroImage || ''}
                onChange={(e) => setData({ ...data, hero: { ...data.hero, heroImage: e.target.value } })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:border-purple-500 font-mono text-xs"
                placeholder="/images/creative_desk_real.jpg or https://..."
              />
              <div className="flex gap-2">
                <label className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-300 cursor-pointer border border-slate-700">
                  <span>Upload Local File</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      const reader = new FileReader();
                      reader.onload = (ev) => {
                        const res = ev.target?.result as string;
                        if (res) setData({ ...data, hero: { ...data.hero, heroImage: res } });
                      };
                      reader.readAsDataURL(file);
                    }}
                  />
                </label>
                <button
                  type="button"
                  onClick={() => setData({ ...data, hero: { ...data.hero, heroImage: '/images/creative_desk_real.jpg' } })}
                  className="px-3 py-1.5 rounded-lg bg-teal-950/60 border border-teal-500/40 text-teal-300 hover:bg-teal-900/60 text-xs font-bold"
                >
                  Real Studio Desk
                </button>
              </div>
              {data.hero?.heroImage && (
                <div className="h-32 rounded-xl overflow-hidden border border-slate-800 bg-slate-950 relative">
                  <img src={data.hero.heroImage} alt="Hero Preview" className="w-full h-full object-cover" />
                </div>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 mb-1">Hero Video URL (Optional)</label>
              <input
                type="text"
                value={data.hero?.heroVideoUrl || ''}
                onChange={(e) => setData({ ...data, hero: { ...data.hero, heroVideoUrl: e.target.value } })}
                placeholder="https://..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:border-purple-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 mb-1">Primary CTA Button Label</label>
              <input
                type="text"
                value={data.hero?.primaryCtaText || ''}
                onChange={(e) => setData({ ...data, hero: { ...data.hero, primaryCtaText: e.target.value } })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:border-purple-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 mb-1">Primary CTA Target Link / Route</label>
              <input
                type="text"
                value={data.hero?.primaryCtaLink || ''}
                onChange={(e) => setData({ ...data, hero: { ...data.hero, primaryCtaLink: e.target.value } })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:border-purple-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 mb-1">Secondary CTA Button Label</label>
              <input
                type="text"
                value={data.hero?.secondaryCtaText || ''}
                onChange={(e) => setData({ ...data, hero: { ...data.hero, secondaryCtaText: e.target.value } })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:border-purple-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 mb-1">Secondary CTA Target Link / Route</label>
              <input
                type="text"
                value={data.hero?.secondaryCtaLink || ''}
                onChange={(e) => setData({ ...data, hero: { ...data.hero, secondaryCtaLink: e.target.value } })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:border-purple-500"
              />
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: SERVICES SECTION */}
      {activeTab === 'services' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
          <div className="flex justify-between items-center border-b border-slate-800 pb-4">
            <div>
              <h3 className="text-lg font-bold text-white">Existing Services Section</h3>
              <p className="text-xs text-slate-400">Edit titles, images, links, order, and visibility for services shown on homepage.</p>
            </div>
            <button
              onClick={() => {
                const newItems = [...(data.services?.items || [])];
                newItems.push({
                  id: 'srv-custom-' + Date.now(),
                  title: 'New Service Card',
                  description: 'Description of the new studio service.',
                  image: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?auto=format&fit=crop&w=800&q=80',
                  link: 'graphic-design',
                  order: newItems.length + 1,
                  visible: true,
                });
                setData({ ...data, services: { ...data.services, items: newItems } });
              }}
              className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold flex items-center space-x-1"
            >
              <Plus className="w-4 h-4" />
              <span>Add Service Card</span>
            </button>
          </div>

          <div className="space-y-4">
            {(data.services?.items || []).map((item: any, idx: number) => (
              <div key={item.id || idx} className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-amber-400">Service Card #{idx + 1}</span>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => {
                        const newItems = [...data.services.items];
                        newItems[idx].visible = !newItems[idx].visible;
                        setData({ ...data, services: { ...data.services, items: newItems } });
                      }}
                      className="text-slate-400 hover:text-white text-xs flex items-center space-x-1"
                    >
                      {item.visible ? <Eye className="w-4 h-4 text-emerald-400" /> : <EyeOff className="w-4 h-4 text-slate-500" />}
                      <span>{item.visible ? 'Visible' : 'Hidden'}</span>
                    </button>
                    <button
                      onClick={() => {
                        const newItems = data.services.items.filter((_: any, i: number) => i !== idx);
                        setData({ ...data, services: { ...data.services, items: newItems } });
                      }}
                      className="text-red-400 hover:text-red-300 p-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-400 mb-1">Title</label>
                    <input
                      type="text"
                      value={item.title || ''}
                      onChange={(e) => {
                        const newItems = [...data.services.items];
                        newItems[idx].title = e.target.value;
                        setData({ ...data, services: { ...data.services, items: newItems } });
                      }}
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-400 mb-1">Target Link / Route</label>
                    <input
                      type="text"
                      value={item.link || ''}
                      onChange={(e) => {
                        const newItems = [...data.services.items];
                        newItems[idx].link = e.target.value;
                        setData({ ...data, services: { ...data.services, items: newItems } });
                      }}
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-400 mb-1">Image URL</label>
                    <input
                      type="text"
                      value={item.image || ''}
                      onChange={(e) => {
                        const newItems = [...data.services.items];
                        newItems[idx].image = e.target.value;
                        setData({ ...data, services: { ...data.services, items: newItems } });
                      }}
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white"
                    />
                  </div>

                  <div className="md:col-span-3">
                    <label className="block text-[11px] font-bold text-slate-400 mb-1">Description</label>
                    <textarea
                      rows={2}
                      value={item.description || ''}
                      onChange={(e) => {
                        const newItems = [...data.services.items];
                        newItems[idx].description = e.target.value;
                        setData({ ...data, services: { ...data.services, items: newItems } });
                      }}
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: FEATURED PRODUCTS */}
      {activeTab === 'products' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
          <h3 className="text-lg font-bold text-white">Existing Featured Products Configuration</h3>
          <p className="text-xs text-slate-400">Manage headline and visibility of featured store items displayed on homepage.</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold text-slate-400 mb-1">Section Title</label>
              <input
                type="text"
                value={data.featuredProducts?.title || ''}
                onChange={(e) => setData({ ...data, featuredProducts: { ...data.featuredProducts, title: e.target.value } })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 mb-1">Section Subtitle</label>
              <input
                type="text"
                value={data.featuredProducts?.subtitle || ''}
                onChange={(e) => setData({ ...data, featuredProducts: { ...data.featuredProducts, subtitle: e.target.value } })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white"
              />
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: PORTFOLIO */}
      {activeTab === 'portfolio' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
          <div className="flex justify-between items-center border-b border-slate-800 pb-4">
            <h3 className="text-lg font-bold text-white">Existing Portfolio Section</h3>
            <button
              onClick={() => {
                const items = [...(data.portfolio?.items || [])];
                items.push({
                  id: 'port-' + Date.now(),
                  title: 'New Project Title',
                  description: 'Project summary and creative details.',
                  image: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?auto=format&fit=crop&w=800&q=80',
                  category: 'Graphic Design',
                  link: 'graphic-design',
                  order: items.length + 1,
                  visible: true,
                });
                setData({ ...data, portfolio: { ...data.portfolio, items } });
              }}
              className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold flex items-center space-x-1"
            >
              <Plus className="w-4 h-4" />
              <span>Add Portfolio Project</span>
            </button>
          </div>

          <div className="space-y-4">
            {(data.portfolio?.items || []).map((item: any, idx: number) => (
              <div key={item.id || idx} className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-cyan-400">Project Item #{idx + 1}</span>
                  <button
                    onClick={() => {
                      const items = data.portfolio.items.filter((_: any, i: number) => i !== idx);
                      setData({ ...data, portfolio: { ...data.portfolio, items } });
                    }}
                    className="text-red-400 hover:text-red-300 p-1"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-400 mb-1">Title</label>
                    <input
                      type="text"
                      value={item.title || ''}
                      onChange={(e) => {
                        const items = [...data.portfolio.items];
                        items[idx].title = e.target.value;
                        setData({ ...data, portfolio: { ...data.portfolio, items } });
                      }}
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-400 mb-1">Category</label>
                    <input
                      type="text"
                      value={item.category || ''}
                      onChange={(e) => {
                        const items = [...data.portfolio.items];
                        items[idx].category = e.target.value;
                        setData({ ...data, portfolio: { ...data.portfolio, items } });
                      }}
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-400 mb-1">Image URL</label>
                    <input
                      type="text"
                      value={item.image || ''}
                      onChange={(e) => {
                        const items = [...data.portfolio.items];
                        items[idx].image = e.target.value;
                        setData({ ...data, portfolio: { ...data.portfolio, items } });
                      }}
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white"
                    />
                  </div>

                  <div className="md:col-span-3">
                    <label className="block text-[11px] font-bold text-slate-400 mb-1">Description</label>
                    <textarea
                      rows={2}
                      value={item.description || ''}
                      onChange={(e) => {
                        const items = [...data.portfolio.items];
                        items[idx].description = e.target.value;
                        setData({ ...data, portfolio: { ...data.portfolio, items } });
                      }}
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: TESTIMONIALS */}
      {activeTab === 'testimonials' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
          <div className="flex justify-between items-center border-b border-slate-800 pb-4">
            <h3 className="text-lg font-bold text-white">Existing Client Testimonials</h3>
            <button
              onClick={() => {
                const items = [...(data.testimonials?.items || [])];
                items.push({
                  id: 'test-' + Date.now(),
                  customerName: 'New Client Name',
                  role: 'Verified Client',
                  quote: 'Wonderful creative work and fast response!',
                  image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
                  rating: 5,
                  visible: true,
                });
                setData({ ...data, testimonials: { ...data.testimonials, items } });
              }}
              className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold flex items-center space-x-1"
            >
              <Plus className="w-4 h-4" />
              <span>Add Testimonial</span>
            </button>
          </div>

          <div className="space-y-4">
            {(data.testimonials?.items || []).map((item: any, idx: number) => (
              <div key={item.id || idx} className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-amber-400">Testimonial #{idx + 1}</span>
                  <button
                    onClick={() => {
                      const items = data.testimonials.items.filter((_: any, i: number) => i !== idx);
                      setData({ ...data, testimonials: { ...data.testimonials, items } });
                    }}
                    className="text-red-400 hover:text-red-300 p-1"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-400 mb-1">Customer Name</label>
                    <input
                      type="text"
                      value={item.customerName || ''}
                      onChange={(e) => {
                        const items = [...data.testimonials.items];
                        items[idx].customerName = e.target.value;
                        setData({ ...data, testimonials: { ...data.testimonials, items } });
                      }}
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-400 mb-1">Role / Designation</label>
                    <input
                      type="text"
                      value={item.role || ''}
                      onChange={(e) => {
                        const items = [...data.testimonials.items];
                        items[idx].role = e.target.value;
                        setData({ ...data, testimonials: { ...data.testimonials, items } });
                      }}
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-400 mb-1">Rating (1 to 5)</label>
                    <input
                      type="number"
                      min={1}
                      max={5}
                      value={item.rating || 5}
                      onChange={(e) => {
                        const items = [...data.testimonials.items];
                        items[idx].rating = Number(e.target.value);
                        setData({ ...data, testimonials: { ...data.testimonials, items } });
                      }}
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white"
                    />
                  </div>

                  <div className="md:col-span-3">
                    <label className="block text-[11px] font-bold text-slate-400 mb-1">Quote / Review Text</label>
                    <textarea
                      rows={2}
                      value={item.quote || ''}
                      onChange={(e) => {
                        const items = [...data.testimonials.items];
                        items[idx].quote = e.target.value;
                        setData({ ...data, testimonials: { ...data.testimonials, items } });
                      }}
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 6: FAQ */}
      {activeTab === 'faq' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
          <div className="flex justify-between items-center border-b border-slate-800 pb-4">
            <h3 className="text-lg font-bold text-white">Existing Home FAQ Accordion</h3>
            <button
              onClick={() => {
                const items = [...(data.faq?.items || [])];
                items.push({
                  id: 'faq-' + Date.now(),
                  question: 'New Question?',
                  answer: 'Answer to the question.',
                  order: items.length + 1,
                  visible: true,
                });
                setData({ ...data, faq: { ...data.faq, items } });
              }}
              className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold flex items-center space-x-1"
            >
              <Plus className="w-4 h-4" />
              <span>Add FAQ</span>
            </button>
          </div>

          <div className="space-y-4">
            {(data.faq?.items || []).map((item: any, idx: number) => (
              <div key={item.id || idx} className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-purple-400">FAQ Item #{idx + 1}</span>
                  <button
                    onClick={() => {
                      const items = data.faq.items.filter((_: any, i: number) => i !== idx);
                      setData({ ...data, faq: { ...data.faq, items } });
                    }}
                    className="text-red-400 hover:text-red-300 p-1"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-400 mb-1">Question</label>
                  <input
                    type="text"
                    value={item.question || ''}
                    onChange={(e) => {
                      const items = [...data.faq.items];
                      items[idx].question = e.target.value;
                      setData({ ...data, faq: { ...data.faq, items } });
                    }}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-400 mb-1">Answer</label>
                  <textarea
                    rows={2}
                    value={item.answer || ''}
                    onChange={(e) => {
                      const items = [...data.faq.items];
                      items[idx].answer = e.target.value;
                      setData({ ...data, faq: { ...data.faq, items } });
                    }}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 7: CTA */}
      {activeTab === 'cta' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
          <h3 className="text-lg font-bold text-white">Existing Bottom Home CTA Banner</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold text-slate-400 mb-1">CTA Heading</label>
              <input
                type="text"
                value={data.cta?.heading || ''}
                onChange={(e) => setData({ ...data, cta: { ...data.cta, heading: e.target.value } })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 mb-1">Button Text</label>
              <input
                type="text"
                value={data.cta?.buttonText || ''}
                onChange={(e) => setData({ ...data, cta: { ...data.cta, buttonText: e.target.value } })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 mb-1">Button Link URL</label>
              <input
                type="text"
                value={data.cta?.buttonLink || ''}
                onChange={(e) => setData({ ...data, cta: { ...data.cta, buttonLink: e.target.value } })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 mb-1">Background Image URL</label>
              <input
                type="text"
                value={data.cta?.bgImage || ''}
                onChange={(e) => setData({ ...data, cta: { ...data.cta, bgImage: e.target.value } })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-slate-400 mb-1">CTA Description</label>
              <textarea
                rows={3}
                value={data.cta?.description || ''}
                onChange={(e) => setData({ ...data, cta: { ...data.cta, description: e.target.value } })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
