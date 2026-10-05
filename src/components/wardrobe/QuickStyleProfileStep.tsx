import React from 'react';
import { Sparkles, Briefcase, GraduationCap, Home, Building2, Layers, Check, CloudSun, MapPin, IndianRupee } from 'lucide-react';
import { QuickStyleProfile } from '../../types';

interface QuickStyleProfileStepProps {
  profile: QuickStyleProfile;
  onChange: (updated: QuickStyleProfile) => void;
  onNext: () => void;
  onBack: () => void;
}

export const QuickStyleProfileStep: React.FC<QuickStyleProfileStepProps> = ({
  profile,
  onChange,
  onNext,
  onBack,
}) => {
  const lifestyles = [
    { id: 'Office', label: 'Office', desc: 'Corporate / Formal workplace', icon: Briefcase },
    { id: 'College', label: 'College', desc: 'Campus & youth daily', icon: GraduationCap },
    { id: 'Work From Home', label: 'Work From Home', desc: 'Comfortable smart casuals', icon: Home },
    { id: 'Business', label: 'Business', desc: 'Client meetings & leadership', icon: Building2 },
    { id: 'Mixed', label: 'Mixed / Flexible', desc: 'Transitions through varied settings', icon: Layers },
  ];

  const styles = [
    { id: 'Minimal', label: 'Minimal', desc: 'Clean lines, neutral tones, effortless elegance' },
    { id: 'Classic', label: 'Classic', desc: 'Timeless tailoring and heritage silhouettes' },
    { id: 'Smart Casual', label: 'Smart Casual', desc: 'Balanced polish with relaxed comfort' },
    { id: 'Trendy', label: 'Trendy', desc: 'Contemporary cuts and current aesthetic vibes' },
    { id: 'Streetwear', label: 'Streetwear', desc: 'Relaxed fits, sneakers, and modern edges' },
    { id: 'Traditional', label: 'Traditional', desc: 'Kurtas, ethnic motifs, and Indian heritage' },
    { id: 'Mix', label: 'Mix & Match', desc: 'Eclectic fusion of structured and casual' },
  ];

  const outfitNeeds = [
    { id: 'Daily', label: 'Daily Wear', desc: 'Comfortable everyday rotations' },
    { id: 'Office', label: 'Office / Work', desc: 'Professional, crisp presentations' },
    { id: 'Casual', label: 'Casual Outings', desc: 'Weekend brunches & social hangouts' },
    { id: 'Party', label: 'Party / Evening', desc: 'Night outs & celebratory events' },
    { id: 'Travel', label: 'Travel & Vacation', desc: 'Wrinkle-free, versatile layering' },
    { id: 'Mixed', label: 'Mixed Week', desc: 'Workdays + weekend social mix' },
  ];

  const colorPalettes = [
    { id: 'Neutral', label: 'Neutral', desc: 'White, Black, Navy, Beige, Grey', sampleColors: ['#ffffff', '#000000', '#1e3a8a', '#d6d3d1'] },
    { id: 'Bright', label: 'Bright & Vibrant', desc: 'Mustard, Rust, Royal Blue, Emerald', sampleColors: ['#eab308', '#dc2626', '#2563eb', '#10b981'] },
    { id: 'Dark', label: 'Dark & Deep', desc: 'Midnight, Charcoal, Espresso, Deep Wine', sampleColors: ['#0f172a', '#334155', '#451a03', '#831843'] },
    { id: 'Pastel', label: 'Pastel & Soft', desc: 'Powder Blue, Sage, Blush Pink, Lavender', sampleColors: ['#bfdbfe', '#bbf7d0', '#fbcfe8', '#e9d5ff'] },
    { id: 'Mixed', label: 'Mixed Harmony', desc: 'Neutral foundations with rich accent pops', sampleColors: ['#ffffff', '#1e293b', '#f59e0b', '#0d9488'] },
  ];

  const weatherOptions = [
    { id: 'Normal', label: 'Normal / Pleasant (22°-28°C)' },
    { id: 'Hot', label: 'Hot / Sunny (30°C+)' },
    { id: 'Cool', label: 'Cool / Mild (15°-21°C)' },
    { id: 'Cold', label: 'Cold / Winter (<15°C)' },
    { id: 'Rainy', label: 'Rainy / Humid' },
  ];

  const budgetTiers = ['₹500', '₹1,000', '₹2,500', '₹5,000', 'Custom'];

  return (
    <div className="max-w-4xl mx-auto space-y-10">
      
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Step 2: Quick Style Profile</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
          Tell AI Your Everyday Lifestyle & Aesthetic
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-xl mx-auto">
          Just 5 simple preferences to ensure your 7-day outfit plan feels authentically you.
        </p>
      </div>

      {/* Question 1: Lifestyle */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4 shadow-sm">
        <label className="text-sm font-black text-slate-900 dark:text-white flex items-center space-x-2">
          <span className="w-6 h-6 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center text-xs font-black">1</span>
          <span>What is your usual lifestyle?</span>
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {lifestyles.map((l) => {
            const Icon = l.icon;
            const isSelected = profile.lifestyle === l.id;
            return (
              <button
                key={l.id}
                type="button"
                onClick={() => onChange({ ...profile, lifestyle: l.id as any })}
                className={`p-4 rounded-2xl border text-left transition-all flex flex-col justify-between ${
                  isSelected
                    ? 'bg-amber-500/10 border-amber-500 text-slate-900 dark:text-white shadow-md ring-1 ring-amber-500'
                    : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between w-full mb-3">
                  <Icon className={`w-5 h-5 ${isSelected ? 'text-amber-500' : 'text-slate-400'}`} />
                  {isSelected && <Check className="w-4 h-4 text-amber-500" />}
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">{l.label}</h4>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1">{l.desc}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Question 2: Preferred Style */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4 shadow-sm">
        <label className="text-sm font-black text-slate-900 dark:text-white flex items-center space-x-2">
          <span className="w-6 h-6 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center text-xs font-black">2</span>
          <span>What style do you prefer?</span>
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {styles.map((s) => {
            const isSelected = profile.preferredStyle === s.id;
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => onChange({ ...profile, preferredStyle: s.id as any })}
                className={`p-4 rounded-2xl border text-left transition-all ${
                  isSelected
                    ? 'bg-purple-600/10 border-purple-500 text-slate-900 dark:text-white shadow-md ring-1 ring-purple-500'
                    : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">{s.label}</h4>
                  {isSelected && <Check className="w-4 h-4 text-purple-500" />}
                </div>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-tight">{s.desc}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Question 3: Type of Outfits Needed */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4 shadow-sm">
        <label className="text-sm font-black text-slate-900 dark:text-white flex items-center space-x-2">
          <span className="w-6 h-6 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center text-xs font-black">3</span>
          <span>What type of outfits do you need?</span>
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {outfitNeeds.map((o) => {
            const isSelected = profile.outfitType === o.id;
            return (
              <button
                key={o.id}
                type="button"
                onClick={() => onChange({ ...profile, outfitType: o.id as any, targetOccasion: o.id === 'Office' ? 'Office' : o.id === 'Party' ? 'Party' : 'Daily' as any })}
                className={`p-4 rounded-2xl border text-left transition-all ${
                  isSelected
                    ? 'bg-teal-500/10 border-teal-500 text-slate-900 dark:text-white shadow-md ring-1 ring-teal-500'
                    : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">{o.label}</h4>
                  {isSelected && <Check className="w-4 h-4 text-teal-500" />}
                </div>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-tight">{o.desc}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Question 4: Color Palette */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4 shadow-sm">
        <label className="text-sm font-black text-slate-900 dark:text-white flex items-center space-x-2">
          <span className="w-6 h-6 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center text-xs font-black">4</span>
          <span>Preferred colour style:</span>
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {colorPalettes.map((c) => {
            const isSelected = profile.colorStyle === c.id;
            return (
              <button
                key={c.id}
                type="button"
                onClick={() => onChange({ ...profile, colorStyle: c.id as any })}
                className={`p-4 rounded-2xl border text-left transition-all ${
                  isSelected
                    ? 'bg-amber-500/10 border-amber-500 text-slate-900 dark:text-white shadow-md ring-1 ring-amber-500'
                    : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">{c.label}</h4>
                  <div className="flex -space-x-1">
                    {c.sampleColors.map((color, i) => (
                      <span
                        key={i}
                        className="w-3.5 h-3.5 rounded-full border border-slate-300 dark:border-slate-700 shadow-sm"
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </div>
                <p className="text-[10px] text-slate-500 dark:text-slate-400">{c.desc}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Question 5: Optional City, Weather & Budget */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4 shadow-sm">
        <label className="text-sm font-black text-slate-900 dark:text-white flex items-center space-x-2">
          <span className="w-6 h-6 rounded-full bg-slate-300 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center justify-center text-xs font-black">5</span>
          <span>Optional: Weather & Context Mode</span>
        </label>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div>
            <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1.5 flex items-center space-x-1.5">
              <MapPin className="w-3.5 h-3.5 text-amber-500" />
              <span>City / Region</span>
            </label>
            <input
              type="text"
              value={profile.city || ''}
              onChange={(e) => onChange({ ...profile, city: e.target.value })}
              placeholder="e.g. Delhi NCR, Mumbai, Bengaluru"
              className="w-full p-2.5 rounded-xl bg-slate-100 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-white outline-none focus:border-amber-400"
            />
          </div>

          <div>
            <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1.5 flex items-center space-x-1.5">
              <CloudSun className="w-3.5 h-3.5 text-amber-500" />
              <span>Weather Preference</span>
            </label>
            <select
              value={profile.weatherPreference}
              onChange={(e) => onChange({ ...profile, weatherPreference: e.target.value as any })}
              className="w-full p-2.5 rounded-xl bg-slate-100 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-white outline-none focus:border-amber-400"
            >
              {weatherOptions.map((w) => (
                <option key={w.id} value={w.id}>
                  {w.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1.5 flex items-center space-x-1.5">
              <IndianRupee className="w-3.5 h-3.5 text-amber-500" />
              <span>Budget Cap for Gaps</span>
            </label>
            <select
              value={profile.budget || '₹2,500'}
              onChange={(e) => onChange({ ...profile, budget: e.target.value })}
              className="w-full p-2.5 rounded-xl bg-slate-100 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-white outline-none focus:border-amber-400"
            >
              {budgetTiers.map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between pt-4">
        <button
          type="button"
          onClick={onBack}
          className="px-5 py-3 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          ← Back to Wardrobe
        </button>

        <button
          type="button"
          onClick={onNext}
          className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 via-rose-500 to-purple-600 text-slate-950 font-black text-xs sm:text-sm shadow-xl hover:opacity-90 transition-opacity flex items-center space-x-2"
        >
          <Sparkles className="w-4 h-4" />
          <span>Generate 7-Day Style Plan →</span>
        </button>
      </div>

    </div>
  );
};
