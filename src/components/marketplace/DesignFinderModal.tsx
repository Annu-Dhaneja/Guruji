import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Compass,
  Sparkles,
  ArrowRight,
  RotateCcw,
  CheckCircle,
  Eye,
  ShoppingCart,
  Zap,
  Layers,
  Star,
} from 'lucide-react';
import { GurujiArtwork } from '../../types';
import { useCart } from '../../context/CartContext';

interface DesignFinderModalProps {
  isOpen: boolean;
  onClose: () => void;
  allArtworks: GurujiArtwork[];
  onSelectArtwork: (artwork: GurujiArtwork) => void;
}

export const DesignFinderModal: React.FC<DesignFinderModalProps> = ({
  isOpen,
  onClose,
  allArtworks,
  onSelectArtwork,
}) => {
  const { addItem } = useCart();
  const [step, setStep] = useState<number>(1);
  const [selectedPurpose, setSelectedPurpose] = useState<string>('');
  const [selectedOrientation, setSelectedOrientation] = useState<string>('');
  const [selectedBudget, setSelectedBudget] = useState<string>('all');
  const [results, setResults] = useState<GurujiArtwork[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  if (!isOpen) return null;

  const PURPOSES = [
    { id: 'spiritual-darbar', title: 'Mandir & Darbar Frames', desc: '4K Ultra HD printable wall art for pooja rooms', icon: '🪷' },
    { id: 'social-media', title: 'Social Media & WhatsApp', desc: 'Daily morning blessings & status cards for sharing', icon: '📱' },
    { id: 'festival', title: 'Festivals & Occasions', desc: 'Guru Purnima, Mahashivratri, Diwali & Jayanti designs', icon: '✨' },
    { id: 'branding', title: 'Business & Branding', desc: 'Visiting cards, logos, catalogues & banners', icon: '💼' },
    { id: 'personalized', title: 'Customized Family Blessing', desc: 'Personalized names, photos, & bespoke prayers', icon: '🪄' },
    { id: 'meditation', title: 'Meditation & Calm Aura', desc: 'Cosmic indigo, golden lotus & healing aura wallpapers', icon: '🧘' },
  ];

  const ORIENTATIONS = [
    { id: 'all', title: 'Any Format / All', desc: 'Show all available dimensions' },
    { id: '1:1', title: '1:1 Square (Instagram & Frames)', desc: 'Perfect for DP, Instagram feed & square photo frames' },
    { id: '9:16', title: '9:16 Portrait (Mobile Wallpaper & Reels)', desc: 'Full screen smartphone lockscreens & WhatsApp stories' },
    { id: '16:9', title: '16:9 Landscape (Desktop & Banners)', desc: 'Laptops, TVs, and wide temple backdrop screens' },
  ];

  const BUDGETS = [
    { id: 'all', title: 'All Tiers', desc: 'Free & Premium collections' },
    { id: 'free', title: '100% Free Downloads Only', desc: 'Instant complimentary 4K files' },
    { id: 'under50', title: 'Under ₹50 Value Edition', desc: 'Super budget-friendly single design downloads' },
    { id: 'premium', title: 'Premium Master Suites', desc: 'Complete high-res layered print files' },
  ];

  const handleFindDesigns = () => {
    setIsSearching(true);
    let filtered = [...allArtworks].filter((a) => a.isDeleted !== true && a.status === 'PUBLISHED');

    // Filter by budget
    if (selectedBudget === 'free') {
      filtered = filtered.filter((a) => a.isFree);
    } else if (selectedBudget === 'under50') {
      filtered = filtered.filter((a) => a.price <= 50 && !a.isFree);
    } else if (selectedBudget === 'premium') {
      filtered = filtered.filter((a) => a.price > 50);
    }

    // Filter by orientation
    if (selectedOrientation && selectedOrientation !== 'all') {
      filtered = filtered.filter((a) => a.aspectRatio === selectedOrientation);
    }

    // Filter by purpose
    if (selectedPurpose) {
      if (selectedPurpose === 'spiritual-darbar') {
        filtered = filtered.filter((a) => a.category === 'bade-mandir' || a.category === 'temple-frames' || a.tags?.includes('Printable Frame'));
      } else if (selectedPurpose === 'social-media') {
        filtered = filtered.filter((a) => a.category === 'daily-wallpaper' || a.category === 'social-media' || a.tags?.includes('Daily Wallpaper'));
      } else if (selectedPurpose === 'festival') {
        filtered = filtered.filter((a) => a.category === 'festival' || a.festivalTag);
      } else if (selectedPurpose === 'branding') {
        filtered = filtered.filter((a) => a.category === 'branding' || a.category === 'visiting-card' || a.tags?.includes('Branding'));
      } else if (selectedPurpose === 'personalized') {
        filtered = filtered.filter((a) => a.isCustomizable || a.productType === 'CUSTOMIZABLE_PRODUCT');
      } else if (selectedPurpose === 'meditation') {
        filtered = filtered.filter((a) => a.category === 'meditation' || a.moods?.includes('meditation') || a.moods?.includes('peace'));
      }
    }

    // Fallback if empty
    if (filtered.length === 0) {
      filtered = allArtworks.slice(0, 6);
    }

    setResults(filtered);
    setIsSearching(false);
    setStep(4); // Results step
  };

  const handleReset = () => {
    setStep(1);
    setSelectedPurpose('');
    setSelectedOrientation('');
    setSelectedBudget('all');
    setResults([]);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 overflow-y-auto bg-black/85 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.25 }}
          className="relative w-full max-w-3xl bg-neutral-900 border border-neutral-800 rounded-2xl shadow-2xl overflow-hidden my-auto max-h-[90vh] flex flex-col"
          id="design-finder-modal"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-800 bg-neutral-950/80 sticky top-0 z-10 backdrop-blur-md">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
                <Compass className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white tracking-tight">
                  Design Finder Wizard
                </h3>
                <p className="text-[11px] text-neutral-400">
                  Find the exact design product, wallpaper or frame in 3 simple clicks
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {step > 1 && (
                <button
                  type="button"
                  onClick={handleReset}
                  className="p-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-400 hover:text-white text-xs flex items-center gap-1 transition-colors"
                  title="Reset Wizard"
                >
                  <RotateCcw className="w-3.5 h-3.5" /> Reset
                </button>
              )}
              <button
                type="button"
                onClick={onClose}
                className="p-2 rounded-full bg-neutral-800 hover:bg-neutral-700 text-neutral-400 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Wizard Body */}
          <div className="p-6 overflow-y-auto flex-grow">
            {/* Step Indicators */}
            <div className="flex items-center justify-between max-w-md mx-auto mb-6">
              {[
                { num: 1, label: 'Purpose' },
                { num: 2, label: 'Format' },
                { num: 3, label: 'Budget' },
                { num: 4, label: 'Results' },
              ].map((s) => (
                <div key={s.num} className="flex flex-col items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-colors ${
                      step === s.num
                        ? 'bg-amber-500 text-neutral-950 shadow-md shadow-amber-500/20 ring-2 ring-amber-400/40'
                        : step > s.num
                        ? 'bg-emerald-500 text-white'
                        : 'bg-neutral-800 text-neutral-500'
                    }`}
                  >
                    {step > s.num ? <CheckCircle className="w-4 h-4" /> : s.num}
                  </div>
                  <span className="text-[11px] text-neutral-400 mt-1 font-medium">{s.label}</span>
                </div>
              ))}
            </div>

            {/* Step 1: Purpose */}
            {step === 1 && (
              <div className="space-y-4">
                <div className="text-center mb-4">
                  <h4 className="text-base font-bold text-white">What do you want to create or download?</h4>
                  <p className="text-xs text-neutral-400">Select the intended use for your design</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {PURPOSES.map((p) => {
                    const isSelected = selectedPurpose === p.id;
                    return (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => setSelectedPurpose(p.id)}
                        className={`p-4 rounded-xl border text-left flex items-start gap-3 transition-all ${
                          isSelected
                            ? 'bg-amber-500/10 border-amber-500 text-white shadow-md shadow-amber-500/10'
                            : 'bg-neutral-950 border-neutral-800 text-neutral-300 hover:border-neutral-700'
                        }`}
                      >
                        <span className="text-2xl">{p.icon}</span>
                        <div>
                          <h5 className="text-sm font-bold text-neutral-100">{p.title}</h5>
                          <p className="text-xs text-neutral-400 mt-0.5">{p.desc}</p>
                        </div>
                      </button>
                    );
                  })}
                </div>

                <div className="flex justify-end pt-4">
                  <button
                    type="button"
                    disabled={!selectedPurpose}
                    onClick={() => setStep(2)}
                    className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs flex items-center gap-1.5 disabled:opacity-40 transition-all shadow-md active:scale-98"
                  >
                    Next Step <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* Step 2: Format / Orientation */}
            {step === 2 && (
              <div className="space-y-4">
                <div className="text-center mb-4">
                  <h4 className="text-base font-bold text-white">Select preferred aspect ratio & format</h4>
                  <p className="text-xs text-neutral-400">Choose how and where you plan to display the design</p>
                </div>

                <div className="grid grid-cols-1 gap-3">
                  {ORIENTATIONS.map((o) => {
                    const isSelected = selectedOrientation === o.id;
                    return (
                      <button
                        key={o.id}
                        type="button"
                        onClick={() => setSelectedOrientation(o.id)}
                        className={`p-4 rounded-xl border text-left flex items-center justify-between transition-all ${
                          isSelected
                            ? 'bg-amber-500/10 border-amber-500 text-white shadow-md'
                            : 'bg-neutral-950 border-neutral-800 text-neutral-300 hover:border-neutral-700'
                        }`}
                      >
                        <div>
                          <h5 className="text-sm font-bold text-neutral-100">{o.title}</h5>
                          <p className="text-xs text-neutral-400 mt-0.5">{o.desc}</p>
                        </div>
                        {isSelected && <CheckCircle className="w-5 h-5 text-amber-400 flex-shrink-0" />}
                      </button>
                    );
                  })}
                </div>

                <div className="flex justify-between pt-4">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="px-4 py-2 rounded-xl bg-neutral-800 text-neutral-300 hover:text-white text-xs font-semibold"
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={() => setStep(3)}
                    className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs flex items-center gap-1.5 transition-all shadow-md active:scale-98"
                  >
                    Next Step <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Budget */}
            {step === 3 && (
              <div className="space-y-4">
                <div className="text-center mb-4">
                  <h4 className="text-base font-bold text-white">Select your budget preference</h4>
                  <p className="text-xs text-neutral-400">All downloads include verified 4K high resolution files</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {BUDGETS.map((b) => {
                    const isSelected = selectedBudget === b.id;
                    return (
                      <button
                        key={b.id}
                        type="button"
                        onClick={() => setSelectedBudget(b.id)}
                        className={`p-4 rounded-xl border text-left flex flex-col justify-between transition-all ${
                          isSelected
                            ? 'bg-amber-500/10 border-amber-500 text-white shadow-md'
                            : 'bg-neutral-950 border-neutral-800 text-neutral-300 hover:border-neutral-700'
                        }`}
                      >
                        <h5 className="text-sm font-bold text-neutral-100">{b.title}</h5>
                        <p className="text-xs text-neutral-400 mt-1">{b.desc}</p>
                      </button>
                    );
                  })}
                </div>

                <div className="flex justify-between pt-4">
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="px-4 py-2 rounded-xl bg-neutral-800 text-neutral-300 hover:text-white text-xs font-semibold"
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={handleFindDesigns}
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-neutral-950 font-extrabold text-xs flex items-center gap-1.5 shadow-lg shadow-amber-500/20 active:scale-98 transition-all"
                  >
                    <Sparkles className="w-4 h-4 fill-current" /> Show Matching Designs
                  </button>
                </div>
              </div>
            )}

            {/* Step 4: Results */}
            {step === 4 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-base font-bold text-white">
                      Found {results.length} Matching Designs
                    </h4>
                    <p className="text-xs text-neutral-400">
                      Curated recommendations based on your preferences
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleReset}
                    className="text-xs text-amber-400 hover:underline flex items-center gap-1"
                  >
                    <RotateCcw className="w-3.5 h-3.5" /> Start Over
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 max-h-96 overflow-y-auto pr-1">
                  {results.map((art) => (
                    <div
                      key={art.id}
                      onClick={() => {
                        onClose();
                        onSelectArtwork(art);
                      }}
                      className="group p-2.5 rounded-xl bg-neutral-950 border border-neutral-800 hover:border-amber-500/50 cursor-pointer transition-all flex flex-col justify-between"
                    >
                      <div className="relative aspect-video rounded-lg overflow-hidden bg-neutral-900 mb-2">
                        <img
                          src={art.thumbnailUrl || art.imageUrl}
                          alt={art.title}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                        {art.isFree && (
                          <span className="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-500 text-white">
                            FREE
                          </span>
                        )}
                      </div>

                      <div>
                        <h5 className="font-semibold text-neutral-200 text-xs truncate group-hover:text-amber-400">
                          {art.title}
                        </h5>
                        <p className="text-[10px] text-neutral-400 mt-0.5 truncate">{art.categoryName}</p>
                      </div>

                      <div className="flex items-center justify-between pt-2 mt-2 border-t border-neutral-800/60 text-xs">
                        <span className="font-extrabold text-amber-400">
                          {art.isFree ? 'FREE' : `₹${art.price}`}
                        </span>
                        <button
                          type="button"
                          className="px-2.5 py-1 rounded bg-amber-500 hover:bg-amber-400 text-neutral-950 text-[11px] font-bold"
                        >
                          View
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
