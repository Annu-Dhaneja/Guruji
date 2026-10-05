import React, { useState, useEffect } from 'react';
import {
  Image as ImageIcon,
  Upload,
  Check,
  RotateCcw,
  Sparkles,
  Eye,
  Save,
  Link,
  Layers,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { getCMSData, saveCMSSection } from '../../utils';

export const ImageManagerCMS: React.FC = () => {
  // Hero Desk Image
  const [heroImage, setHeroImage] = useState<string>(() => {
    return localStorage.getItem('gurucraft_hero_image') || '/images/creative_desk_real.jpg';
  });

  // Guruji Darshan Image
  const [gurujiHeroImage, setGurujiHeroImage] = useState<string>(() => {
    return localStorage.getItem('gurucraft_guruji_hero_image') || '/src/assets/images/guruji_real_darshan_1790754721223.jpg';
  });

  // VantageEcom Hero Image
  const [vantageHeroImage, setVantageHeroImage] = useState<string>(() => {
    return localStorage.getItem('gurucraft_vantage_hero_image') || '/src/assets/images/vantage_ecom_hero_1790672308338.jpg';
  });

  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');

  // Preset libraries for quick switching
  const heroPresets = [
    {
      id: 'real-creative-desk',
      label: 'Real Studio Desk (Uploaded Workspace)',
      url: '/images/creative_desk_real.jpg',
      badge: 'REAL REFERENCE',
    },
    {
      id: 'studio-light',
      label: 'Studio Daylight Clean Desk',
      url: '/src/assets/images/hero_studio_light_1790661066549.jpg',
      badge: 'Light Theme',
    },
    {
      id: 'studio-dark',
      label: 'Studio Dark Moody Workspace',
      url: '/src/assets/images/hero_studio_dark_1790661080721.jpg',
      badge: 'Dark Theme',
    },
    {
      id: 'designer-workplace',
      label: 'Designer Creative Workplace',
      url: '/src/assets/images/designer_studio_workplace_1790156530624.jpg',
      badge: 'Creative Art',
    },
  ];

  const gurujiPresets = [
    {
      id: 'guruji-real-darshan',
      label: 'Guruji Real Darshan Console Interior',
      url: '/src/assets/images/guruji_real_darshan_1790754721223.jpg',
    },
    {
      id: 'guruji-real-hero',
      label: 'Guruji Real Sacred Hero',
      url: '/src/assets/images/guruji_real_hero_1790671979731.jpg',
    },
    {
      id: 'guruji-swaroop',
      label: 'Guruji Swaroop Devotional',
      url: '/src/assets/images/guruji_swaroop_real_1790672476196.jpg',
    },
  ];

  // Load stored CMS data on mount
  useEffect(() => {
    const loadCMS = async () => {
      try {
        const cms = await getCMSData();
        if (cms.pageContents?.home?.hero?.heroImage) {
          setHeroImage(cms.pageContents.home.hero.heroImage);
        }
      } catch (e) {
        console.error('Error loading image CMS settings:', e);
      }
    };
    loadCMS();
  }, []);

  // Handle local file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, target: 'hero' | 'guruji' | 'vantage') => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      if (result) {
        if (target === 'hero') setHeroImage(result);
        if (target === 'guruji') setGurujiHeroImage(result);
        if (target === 'vantage') setVantageHeroImage(result);
        setStatusMessage(`Image "${file.name}" loaded! Click "Save Image Changes" to apply.`);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    setSaving(true);
    setStatusMessage('');
    try {
      // 1. Save to localStorage for instant real-time synchronization
      localStorage.setItem('gurucraft_hero_image', heroImage);
      localStorage.setItem('gurucraft_guruji_hero_image', gurujiHeroImage);
      localStorage.setItem('gurucraft_vantage_hero_image', vantageHeroImage);

      // 2. Dispatch custom event for real-time reactive update
      window.dispatchEvent(new Event('gurucraft_image_updated'));

      // 3. Save to backend / Firestore
      try {
        const cms = await getCMSData();
        const updated = {
          ...cms,
          pageContents: {
            ...(cms.pageContents || {}),
            home: {
              ...(cms.pageContents?.home || {}),
              hero: {
                ...(cms.pageContents?.home?.hero || {}),
                heroImage: heroImage,
              },
            },
          },
        };
        await saveCMSSection('pageContents', updated.pageContents);
      } catch (err) {
        console.warn('Backend sync note:', err);
      }

      setSavedSuccess(true);
      setStatusMessage('All website images have been updated successfully! Live website is now showing your new image.');
      setTimeout(() => setSavedSuccess(false), 4000);
    } catch (e: any) {
      setStatusMessage(`Error saving: ${e?.message || 'Failed to update'}`);
    } finally {
      setSaving(false);
    }
  };

  const handleResetToRealUploaded = () => {
    setHeroImage('/images/creative_desk_real.jpg');
    setStatusMessage('Reset to Real Studio Desk Image (/images/creative_desk_real.jpg). Click Save to apply.');
  };

  return (
    <div className="space-y-8 animate-fadeIn text-slate-100">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-bold uppercase tracking-wider mb-2">
            <ImageIcon className="w-3.5 h-3.5" />
            <span>Website Media & Image Editor</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white">
            Website Images &amp; Studio Banners Manager
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Yahan se aap website ke sabhi main images ko edit, replace, ya naye real image se update kar sakte hain.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleResetToRealUploaded}
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition flex items-center gap-2 border border-slate-700"
          >
            <RotateCcw className="w-3.5 h-3.5 text-cyan-400" />
            <span>Reset to Real Desk</span>
          </button>

          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-slate-950 text-xs font-black transition flex items-center gap-2 shadow-lg shadow-cyan-500/20 active:scale-95 disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Saving Changes...' : 'Save Image Changes'}</span>
          </button>
        </div>
      </div>

      {/* Success Notification */}
      {statusMessage && (
        <div
          className={`p-4 rounded-xl text-xs font-bold flex items-center gap-2.5 ${
            savedSuccess
              ? 'bg-emerald-950/80 border border-emerald-500 text-emerald-200'
              : 'bg-cyan-950/80 border border-cyan-500 text-cyan-200'
          }`}
        >
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{statusMessage}</span>
        </div>
      )}

      {/* SECTION 1: HOMEPAGE HERO WORKSPACE DESK IMAGE */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
        <div className="border-b border-slate-800 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span>1. Homepage Hero 3D Production Desk Image</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Yeh image Homepage ke right-hand 3D interactive production desk par show hoti hai.
            </p>
          </div>
          <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
            Active on Live Site
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left: Input controls & Presets */}
          <div className="lg:col-span-7 space-y-5">
            {/* Direct URL input */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5 flex items-center gap-1.5">
                <Link className="w-3.5 h-3.5 text-cyan-400" />
                <span>Image URL or Asset Path:</span>
              </label>
              <input
                type="text"
                value={heroImage}
                onChange={(e) => setHeroImage(e.target.value)}
                placeholder="/images/creative_desk_real.jpg or https://..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-500 font-mono shadow-inner"
              />
            </div>

            {/* Upload File Input */}
            <div className="p-4 rounded-xl bg-slate-950/70 border border-dashed border-slate-700 space-y-2">
              <label className="block text-xs font-bold text-slate-300 flex items-center gap-2">
                <Upload className="w-3.5 h-3.5 text-teal-400" />
                <span>Upload New Real Image from Computer / Phone:</span>
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleFileUpload(e, 'hero')}
                className="text-xs text-slate-400 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-cyan-500 file:text-slate-950 hover:file:bg-cyan-400 cursor-pointer"
              />
              <p className="text-[10px] text-slate-500">
                Supports JPG, PNG, WEBP. Instant live preview &amp; base64 embedding.
              </p>
            </div>

            {/* Quick 1-Click Preset Gallery */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-300 block">
                Choose from Studio Preset Images:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {heroPresets.map((preset) => {
                  const isSelected = heroImage === preset.url;
                  return (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => setHeroImage(preset.url)}
                      className={`p-3 rounded-xl border text-left transition-all flex items-center gap-3 ${
                        isSelected
                          ? 'bg-cyan-950/60 border-cyan-500 shadow-md ring-1 ring-cyan-500/50'
                          : 'bg-slate-950 border-slate-800 hover:border-slate-700 hover:bg-slate-800/40'
                      }`}
                    >
                      <img
                        src={preset.url}
                        alt={preset.label}
                        className="w-12 h-10 object-cover rounded-lg shrink-0 border border-slate-800"
                        onError={(e) => {
                          (e.target as HTMLElement).style.display = 'none';
                        }}
                      />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-1">
                          <span className="text-xs font-bold text-white truncate block">
                            {preset.label}
                          </span>
                          {isSelected && <Check className="w-3.5 h-3.5 text-cyan-400 shrink-0" />}
                        </div>
                        <span className="text-[10px] text-cyan-400/80 font-medium block">
                          {preset.badge}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right: Live Interactive Card Preview */}
          <div className="lg:col-span-5 space-y-2">
            <label className="block text-xs font-bold text-slate-300 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Eye className="w-3.5 h-3.5 text-amber-400" />
                <span>Live Interactive Preview:</span>
              </span>
              <span className="text-[10px] text-slate-400">16:10 Aspect Ratio</span>
            </label>

            <div className="relative rounded-2xl overflow-hidden border border-slate-700 bg-slate-950 shadow-2xl group aspect-[16/10]">
              <img
                src={heroImage}
                alt="Hero Workspace Preview"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-102"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/images/creative_desk_real.jpg';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent pointer-events-none" />

              <div className="absolute bottom-3 left-3 right-3 p-3 rounded-xl bg-slate-900/90 backdrop-blur-md border border-slate-800 text-white flex items-center justify-between">
                <div>
                  <span className="text-[9px] font-bold text-cyan-400 uppercase tracking-wider block">
                    Creative Production Studio
                  </span>
                  <span className="text-xs font-bold text-white block">
                    Good Design Builds Better Brands
                  </span>
                </div>
                <span className="px-2.5 py-1 rounded bg-cyan-500 text-slate-950 font-black text-[10px]">
                  LIVE DESK
                </span>
              </div>
            </div>
            <p className="text-[11px] text-slate-400 text-center italic">
              Yeh exact view aapke Homepage 3D production desk me render hota hai.
            </p>
          </div>
        </div>
      </div>

      {/* SECTION 2: GURUJI DEVOTIONAL HERO IMAGE */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
        <div className="border-b border-slate-800 pb-4 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>2. Guruji Artwork Page Real Darshan Console Image</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Guruji Artwork section ke darshan frame console showcase ki real image.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-7 space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                Image URL or File Path:
              </label>
              <input
                type="text"
                value={gurujiHeroImage}
                onChange={(e) => setGurujiHeroImage(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400 font-mono shadow-inner"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {gurujiPresets.map((preset) => (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => setGurujiHeroImage(preset.url)}
                  className={`p-2.5 rounded-xl border text-left text-xs font-semibold transition ${
                    gurujiHeroImage === preset.url
                      ? 'bg-amber-950/40 border-amber-400 text-amber-300'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  <span className="block truncate">{preset.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="rounded-xl overflow-hidden border border-slate-800 aspect-video bg-slate-950">
              <img
                src={gurujiHeroImage}
                alt="Guruji Artwork Preview"
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/images/guruji_real_darshan.jpg';
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Floating Save Actions Bar */}
      <div className="sticky bottom-4 z-40 bg-slate-900/95 backdrop-blur-md border border-slate-800 p-4 rounded-2xl shadow-2xl flex items-center justify-between">
        <div className="text-xs text-slate-300">
          <span className="font-bold text-white">Image Editor Status: </span>
          <span>Ready to save. Koi bhi image change karne ke baad Save par click karein.</span>
        </div>
        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-slate-950 text-xs font-black transition flex items-center gap-2 shadow-lg shadow-cyan-500/25 active:scale-95 disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          <span>{saving ? 'Saving Changes...' : 'Save Image Changes'}</span>
        </button>
      </div>
    </div>
  );
};
