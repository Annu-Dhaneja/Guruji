import React, { useState, useEffect } from 'react';
import { Palette, Check, Save, Layout, Sun, Moon, Sparkles, Sliders, RefreshCw } from 'lucide-react';
import { ThemeSettings, HeaderSettings, FooterSettings } from '../../types';
import { getCMSData, saveCMSData } from '../../utils';

export const AppearanceCMS: React.FC = () => {
  const [theme, setTheme] = useState<ThemeSettings | null>(null);
  const [header, setHeader] = useState<HeaderSettings | null>(null);
  const [footer, setFooter] = useState<FooterSettings | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saving, setSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    loadAppearanceData();
  }, []);

  const loadAppearanceData = async () => {
    try {
      const cms = await getCMSData().catch(() => null);
      if (cms) {
        if (cms.theme) setTheme(cms.theme);
        if (cms.header) setHeader(cms.header);
        if (cms.footer) setFooter(cms.footer);
      } else {
        fetch('/api/theme').then((res) => res.json()).then((data) => setTheme(data)).catch(() => {});
        fetch('/api/header-settings').then((res) => res.json()).then((data) => setHeader(data)).catch(() => {});
        fetch('/api/footer-settings').then((res) => res.json()).then((data) => setFooter(data)).catch(() => {});
      }
    } catch (e: any) {
      console.error('Failed to load appearance data:', e);
    }
  };

  const handleSaveAll = async () => {
    setSaving(true);
    setErrorMessage('');
    setSaveSuccess(false);
    try {
      // 1. Save directly to Firestore cms/main
      await saveCMSData({
        ...(theme ? { theme } : {}),
        ...(header ? { header } : {}),
        ...(footer ? { footer } : {}),
      });

      // 2. Sync server
      if (theme) {
        fetch('/api/theme', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(theme),
        }).catch(() => {});
      }

      if (header) {
        fetch('/api/header-settings', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(header),
        }).catch(() => {});
      }

      if (footer) {
        fetch('/api/footer-settings', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(footer),
        }).catch(() => {});
      }

      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err: any) {
      console.error(err);
      setErrorMessage(`Failed to save appearance to Firestore: ${err?.message || err}`);
    } finally {
      setSaving(false);
    }
  };

  const applyPreset = (presetName: ThemeSettings['preset']) => {
    if (!theme) return;
    if (presetName === 'Modern') {
      setTheme({
        ...theme,
        preset: 'Modern',
        primaryColor: '#9333ea',
        secondaryColor: '#14b8a6',
        accentColor: '#f59e0b',
        backgroundColor: '#090d16',
        cardRadius: 'rounded-2xl',
      });
    } else if (presetName === 'Glassmorphism') {
      setTheme({
        ...theme,
        preset: 'Glassmorphism',
        primaryColor: '#8b5cf6',
        secondaryColor: '#06b6d4',
        accentColor: '#ec4899',
        backgroundColor: '#030712',
        cardRadius: 'rounded-3xl',
      });
    } else if (presetName === 'Premium') {
      setTheme({
        ...theme,
        preset: 'Premium',
        primaryColor: '#d97706',
        secondaryColor: '#10b981',
        accentColor: '#6366f1',
        backgroundColor: '#0f172a',
        cardRadius: 'rounded-xl',
      });
    }
  };

  if (!theme || !header || !footer) {
    return <div className="text-purple-400 p-8">Loading Theme Builder...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-900/90 border border-slate-800 p-6 rounded-2xl">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Palette className="w-5 h-5 text-purple-400" /> Dynamic Theme Builder & Appearance Engine
          </h2>
          <p className="text-xs text-slate-400">
            Control brand color variables, preset styles, dark/light modes, and header/footer elements.
          </p>
        </div>

        <button
          onClick={handleSaveAll}
          className="px-5 py-2.5 bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs rounded-xl flex items-center gap-2 transition-all shadow-lg shadow-purple-900/40"
        >
          {saveSuccess ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
          {saveSuccess ? 'Appearance Saved!' : 'Save & Publish Theme'}
        </button>
      </div>

      {/* Preset Selectors */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-4">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-400" /> One-Click Theme Presets
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div
            onClick={() => applyPreset('Modern')}
            className={`p-4 rounded-xl border cursor-pointer transition-all ${
              theme.preset === 'Modern' ? 'bg-purple-900/40 border-purple-500 text-white' : 'bg-slate-800/50 border-slate-700 text-slate-300'
            }`}
          >
            <div className="font-bold text-xs mb-1">Modern Neon Purple & Teal</div>
            <p className="text-[11px] text-slate-400">Deep obsidian background with vibrant purple and teal highlights.</p>
          </div>

          <div
            onClick={() => applyPreset('Glassmorphism')}
            className={`p-4 rounded-xl border cursor-pointer transition-all ${
              theme.preset === 'Glassmorphism' ? 'bg-purple-900/40 border-purple-500 text-white' : 'bg-slate-800/50 border-slate-700 text-slate-300'
            }`}
          >
            <div className="font-bold text-xs mb-1">Glassmorphism Cyber Studio</div>
            <p className="text-[11px] text-slate-400">Translucent frosted panels with cyan and violet accents.</p>
          </div>

          <div
            onClick={() => applyPreset('Premium')}
            className={`p-4 rounded-xl border cursor-pointer transition-all ${
              theme.preset === 'Premium' ? 'bg-purple-900/40 border-purple-500 text-white' : 'bg-slate-800/50 border-slate-700 text-slate-300'
            }`}
          >
            <div className="font-bold text-xs mb-1">Premium Gold & Emerald</div>
            <p className="text-[11px] text-slate-400">Luxury dark slate background with regal gold and emerald buttons.</p>
          </div>
        </div>
      </div>

      {/* Color Variables Picker */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-4">
          <h3 className="text-sm font-bold text-white">Brand Palette Pickers</h3>
          <div className="grid grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-slate-400 mb-1">Primary Color</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={theme.primaryColor}
                  onChange={(e) => setTheme({ ...theme, primaryColor: e.target.value })}
                  className="w-8 h-8 rounded border border-slate-700 bg-transparent cursor-pointer"
                />
                <input
                  type="text"
                  value={theme.primaryColor}
                  onChange={(e) => setTheme({ ...theme, primaryColor: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg px-2.5 py-1.5 font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-400 mb-1">Secondary Color</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={theme.secondaryColor}
                  onChange={(e) => setTheme({ ...theme, secondaryColor: e.target.value })}
                  className="w-8 h-8 rounded border border-slate-700 bg-transparent cursor-pointer"
                />
                <input
                  type="text"
                  value={theme.secondaryColor}
                  onChange={(e) => setTheme({ ...theme, secondaryColor: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg px-2.5 py-1.5 font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-400 mb-1">Accent Highlight</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={theme.accentColor}
                  onChange={(e) => setTheme({ ...theme, accentColor: e.target.value })}
                  className="w-8 h-8 rounded border border-slate-700 bg-transparent cursor-pointer"
                />
                <input
                  type="text"
                  value={theme.accentColor}
                  onChange={(e) => setTheme({ ...theme, accentColor: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg px-2.5 py-1.5 font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-400 mb-1">Card Radius</label>
              <select
                value={theme.cardRadius}
                onChange={(e) => setTheme({ ...theme, cardRadius: e.target.value })}
                className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg px-2.5 py-2"
              >
                <option value="rounded-xl">Standard (12px)</option>
                <option value="rounded-2xl">Modern (16px)</option>
                <option value="rounded-3xl">Pill Smooth (24px)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Header & Footer Layout Controls */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-4 text-xs">
          <h3 className="text-sm font-bold text-white">Header & Footer Visibility Toggles</h3>

          <div className="space-y-3">
            <div className="flex items-center justify-between p-2.5 bg-slate-800/50 rounded-xl">
              <span className="text-slate-200">Show Header Search Bar</span>
              <input
                type="checkbox"
                checked={header.showSearch}
                onChange={(e) => setHeader({ ...header, showSearch: e.target.checked })}
                className="rounded text-purple-500"
              />
            </div>

            <div className="flex items-center justify-between p-2.5 bg-slate-800/50 rounded-xl">
              <span className="text-slate-200">Show Dark / Light Mode Toggle Switch</span>
              <input
                type="checkbox"
                checked={header.showThemeToggle}
                onChange={(e) => setHeader({ ...header, showThemeToggle: e.target.checked })}
                className="rounded text-purple-500"
              />
            </div>

            <div className="flex items-center justify-between p-2.5 bg-slate-800/50 rounded-xl">
              <span className="text-slate-200">Show Direct WhatsApp Floating Button</span>
              <input
                type="checkbox"
                checked={header.showWhatsApp}
                onChange={(e) => setHeader({ ...header, showWhatsApp: e.target.checked })}
                className="rounded text-purple-500"
              />
            </div>

            <div className="flex items-center justify-between p-2.5 bg-slate-800/50 rounded-xl">
              <span className="text-slate-200">Show Footer Marketplace Links (Amazon, Flipkart)</span>
              <input
                type="checkbox"
                checked={footer.showMarketplaces}
                onChange={(e) => setFooter({ ...footer, showMarketplaces: e.target.checked })}
                className="rounded text-purple-500"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
