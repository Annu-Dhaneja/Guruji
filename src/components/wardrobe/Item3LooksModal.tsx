import React, { useState, useEffect } from 'react';
import {
  X,
  Sparkles,
  Layers,
  Heart,
  Bookmark,
  Check,
  Share2,
  RefreshCw,
  Tag,
  Compass,
  Zap,
  Globe,
  Sliders,
} from 'lucide-react';
import { WardrobeClothingItem, Item3LooksResult } from '../../types';
import { generateLocal3Looks } from '../../data/wardrobeData';

interface Item3LooksModalProps {
  isOpen: boolean;
  onClose: () => void;
  heroItem: WardrobeClothingItem | null;
  allItems: WardrobeClothingItem[];
  onSaveLook?: (look: any) => void;
}

export const Item3LooksModal: React.FC<Item3LooksModalProps> = ({
  isOpen,
  onClose,
  heroItem,
  allItems,
  onSaveLook,
}) => {
  const [selectedLanguage, setSelectedLanguage] = useState<'Hinglish' | 'Hindi' | 'English'>('Hinglish');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<Item3LooksResult | null>(null);
  const [savedIndexMap, setSavedIndexMap] = useState<Record<number, boolean>>({});
  const [activeLookTab, setActiveLookTab] = useState<number>(0);

  useEffect(() => {
    if (isOpen && heroItem) {
      load3Looks();
    } else {
      setResult(null);
      setSavedIndexMap({});
    }
  }, [isOpen, heroItem]);

  const load3Looks = async (lang = selectedLanguage) => {
    if (!heroItem) return;
    setIsLoading(true);
    try {
      const res = await fetch('/api/wardrobe/3looks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          heroItem,
          allItems,
          language: lang,
        }),
      });
      const data = await res.json();
      if (data.success && data.looks) {
        const normalized = { ...data.looks };
        if (!normalized.looks || !Array.isArray(normalized.looks) || normalized.looks.length === 0) {
          const l1 = normalized.look1Everyday;
          const l2 = normalized.look2Smart;
          const l3 = normalized.look3Occasion;
          normalized.looks = [
            {
              title: l1?.title || 'Look 1 — Everyday Casual',
              occasion: 'Casual Day Out',
              vibe: 'Relaxed & Effortless',
              matchedItems: (l1?.items || []).filter((i: any) => i.id !== heroItem.id),
              stylingTip: l1?.explanation || 'Comfortable and clean daily fit.',
              colorHarmony: `${heroItem.color} with casual staples.`,
              footwearSuggestion: l1?.shoes || 'Clean Low-top Sneakers',
              accessories: ['Casual Bag'],
            },
            {
              title: l2?.title || 'Look 2 — Smart Work / Social',
              occasion: 'Work & Professional',
              vibe: 'Polished & Smart',
              matchedItems: (l2?.items || []).filter((i: any) => i.id !== heroItem.id),
              stylingTip: l2?.explanation || 'Polished styling balance.',
              colorHarmony: 'Tailored neutral contrast.',
              footwearSuggestion: l2?.shoes || 'Leather Loafers',
              accessories: ['Classic Watch'],
            },
            {
              title: l3?.title || 'Look 3 — Evening & Occasion',
              occasion: 'Evening & Celebration',
              vibe: 'Elevated & Striking',
              matchedItems: (l3?.items || []).filter((i: any) => i.id !== heroItem.id),
              stylingTip: l3?.explanation || 'Sharp contrast and presence.',
              colorHarmony: 'Rich monochrome or accent palette.',
              footwearSuggestion: l3?.shoes || 'Dress Shoes',
              accessories: ['Statement Accents'],
            },
          ];
        }
        setResult(normalized);
      } else {
        const local = generateLocal3Looks(heroItem, allItems, lang);
        setResult(local);
      }
    } catch (e) {
      console.warn('Fallback to local 3 looks engine:', e);
      const local = generateLocal3Looks(heroItem, allItems, lang);
      setResult(local);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLanguageChange = (lang: 'Hinglish' | 'Hindi' | 'English') => {
    setSelectedLanguage(lang);
    load3Looks(lang);
  };

  const handleSaveSingleLook = (look: any, index: number) => {
    setSavedIndexMap((prev) => ({ ...prev, [index]: true }));
    if (onSaveLook) {
      onSaveLook({
        id: `look-3ways-${Date.now()}-${index}`,
        title: look?.title || `Look #${index + 1}`,
        occasion: look?.occasion || 'Casual',
        stylingTip: look?.stylingTip || '',
        items: [heroItem, ...(look?.matchedItems || [])].filter(Boolean),
        createdAt: new Date().toISOString(),
      });
    }
  };

  if (!isOpen || !heroItem) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-4xl max-h-[92vh] bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col my-auto">
        {/* Header */}
        <div className="p-5 sm:p-6 bg-gradient-to-r from-amber-500/10 via-purple-500/10 to-pink-500/10 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-slate-950 shadow-lg shadow-amber-500/20 font-black">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400">
                  Wardrobe Multiplier
                </span>
                <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-bold">
                  3 Looks • 1 Item
                </span>
              </div>
              <h3 className="text-lg sm:text-xl font-black text-white">
                How to Style: <span className="text-amber-400">{heroItem.name}</span>
              </h3>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {/* Language Selector */}
            <div className="flex items-center bg-slate-800/80 p-1 rounded-xl border border-slate-700">
              <Globe className="w-3.5 h-3.5 text-slate-400 ml-1.5 mr-1" />
              {(['Hinglish', 'Hindi', 'English'] as const).map((lang) => (
                <button
                  key={lang}
                  onClick={() => handleLanguageChange(lang)}
                  className={`px-2 py-1 rounded-lg text-[11px] font-bold transition-all ${
                    selectedLanguage === lang
                      ? 'bg-amber-500 text-slate-950 shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {lang}
                </button>
              ))}
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 flex-1">
          {/* Hero Item Compact Showcase */}
          <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 flex flex-col sm:flex-row items-center gap-4">
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden border border-slate-700/80 flex-shrink-0 bg-slate-900">
              <img
                src={heroItem.imageUrl}
                alt={heroItem.name}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="flex-1 text-center sm:text-left">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-1.5">
                <span className="px-2.5 py-0.5 rounded-lg bg-amber-500/20 text-amber-300 text-xs font-bold">
                  {heroItem.category}
                </span>
                <span className="px-2.5 py-0.5 rounded-lg bg-slate-800 text-slate-300 text-xs">
                  {heroItem.color}
                </span>
                <span className="px-2.5 py-0.5 rounded-lg bg-slate-800 text-slate-300 text-xs">
                  {heroItem.style}
                </span>
              </div>
              <h4 className="text-base font-black text-white">{heroItem.name}</h4>
              <p className="text-xs text-slate-400 mt-1">
                {result?.heroItemSummary ||
                  `Styling this versatile ${heroItem.color} piece across Casual, Professional, and Evening moments.`}
              </p>
            </div>

            <button
              onClick={() => load3Looks(selectedLanguage)}
              disabled={isLoading}
              className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-bold flex items-center space-x-1.5 transition-all flex-shrink-0 disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-amber-400' : ''}`} />
              <span>Restyle Looks</span>
            </button>
          </div>

          {isLoading ? (
            <div className="py-16 text-center space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center mx-auto animate-spin">
                <RefreshCw className="w-6 h-6" />
              </div>
              <div>
                <p className="text-white font-bold text-base">Crafting 3 Distinct Outfits...</p>
                <p className="text-xs text-slate-400 mt-1">
                  Scanning your wardrobe for complementary tops, bottoms, and accessories.
                </p>
              </div>
            </div>
          ) : result && result.looks && result.looks.length > 0 ? (
            <div className="space-y-6">
              {/* Look Selector Pills (Mobile Friendly) */}
              <div className="grid grid-cols-3 gap-2 p-1.5 bg-slate-950/80 rounded-2xl border border-slate-800">
                {result.looks.map((look, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveLookTab(idx)}
                    className={`py-2.5 px-2 rounded-xl text-xs font-black transition-all flex flex-col items-center justify-center text-center ${
                      activeLookTab === idx
                        ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 shadow-lg'
                        : 'text-slate-400 hover:text-white hover:bg-slate-900'
                    }`}
                  >
                    <span className="text-[10px] uppercase opacity-80">Look #{idx + 1}</span>
                    <span className="line-clamp-1 font-bold">{look?.occasion || `Look ${idx + 1}`}</span>
                  </button>
                ))}
              </div>

              {/* Active Look Card */}
              {(() => {
                const look = result.looks[activeLookTab] || result.looks[0] || {
                  title: 'Styled Look',
                  occasion: 'Everyday',
                  vibe: 'Effortless & Clean',
                  matchedItems: [],
                  stylingTip: 'Style with confidence.',
                  colorHarmony: 'Balanced colorway.',
                  footwearSuggestion: 'Clean sneakers or loafers.',
                  accessories: ['Minimal watch'],
                };
                const isSaved = !!savedIndexMap[activeLookTab];

                return (
                  <div className="p-5 sm:p-6 rounded-3xl bg-slate-950/90 border border-slate-800 space-y-5">
                    {/* Look Title Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800/80">
                      <div>
                        <div className="flex items-center space-x-2 mb-1">
                          <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[11px] font-bold">
                            Look {activeLookTab + 1}: {look?.occasion || 'Everyday'}
                          </span>
                          <span className="px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 text-[11px] font-bold">
                            {look?.vibe || 'Smart & Balanced'}
                          </span>
                        </div>
                        <h4 className="text-lg sm:text-xl font-black text-white">{look?.title || 'Styled Look'}</h4>
                      </div>

                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleSaveSingleLook(look, activeLookTab)}
                          className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center space-x-1.5 transition-all ${
                            isSaved
                              ? 'bg-emerald-500 text-white'
                              : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
                          }`}
                        >
                          {isSaved ? (
                            <>
                              <Check className="w-4 h-4" />
                              <span>Saved Look</span>
                            </>
                          ) : (
                            <>
                              <Bookmark className="w-4 h-4" />
                              <span>Save This Look</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Matched Wardrobe Items Grid */}
                    <div>
                      <h5 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center space-x-1.5">
                        <Layers className="w-3.5 h-3.5 text-amber-400" />
                        <span>Items from Your Closet In This Outfit</span>
                      </h5>

                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {/* Always include hero item */}
                        <div className="p-3 rounded-2xl bg-amber-500/10 border-2 border-amber-500/50 flex flex-col justify-between">
                          <div className="aspect-square rounded-xl overflow-hidden mb-2 bg-slate-900">
                            <img
                              src={heroItem.imageUrl}
                              alt={heroItem.name}
                              className="w-full h-full object-cover"
                              referrerPolicy="no-referrer"
                            />
                          </div>
                          <div>
                            <span className="text-[9px] font-black uppercase text-amber-400 bg-amber-500/20 px-1.5 py-0.5 rounded">
                              ⭐ Hero Piece
                            </span>
                            <p className="text-xs font-bold text-white mt-1 line-clamp-1">
                              {heroItem.name}
                            </p>
                          </div>
                        </div>

                        {/* Matched companions */}
                        {look?.matchedItems && look.matchedItems.length > 0 ? (
                          look.matchedItems.map((cItem, cIdx) => (
                            <div
                              key={cIdx}
                              className="p-3 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col justify-between"
                            >
                              <div className="aspect-square rounded-xl overflow-hidden mb-2 bg-slate-950">
                                <img
                                  src={cItem.imageUrl}
                                  alt={cItem.name}
                                  className="w-full h-full object-cover"
                                  referrerPolicy="no-referrer"
                                />
                              </div>
                              <div>
                                <span className="text-[9px] font-bold uppercase text-slate-400 bg-slate-800 px-1.5 py-0.5 rounded">
                                  {cItem.category}
                                </span>
                                <p className="text-xs font-bold text-white mt-1 line-clamp-1">
                                  {cItem.name}
                                </p>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="col-span-3 p-4 rounded-2xl bg-slate-900/50 border border-slate-800 text-center flex items-center justify-center text-xs text-slate-400">
                            Style with neutral trousers or sneakers from your wardrobe.
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Styling Tips & Color Harmony Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
                        <div className="flex items-center space-x-2 text-amber-400 text-xs font-black uppercase tracking-wider mb-2">
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>Styling Advice ({selectedLanguage})</span>
                        </div>
                        <p className="text-xs text-slate-300 leading-relaxed">{look?.stylingTip || look?.explanation}</p>
                      </div>

                      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
                        <div className="flex items-center space-x-2 text-cyan-400 text-xs font-black uppercase tracking-wider mb-2">
                          <Compass className="w-3.5 h-3.5" />
                          <span>Color Harmony & Footwear</span>
                        </div>
                        <div className="space-y-1.5 text-xs text-slate-300">
                          <p>
                            <strong className="text-white">Palette:</strong> {look?.colorHarmony || 'Harmonious Tones'}
                          </p>
                          <p>
                            <strong className="text-white">Shoes:</strong> {look?.footwearSuggestion || look?.shoes || 'Clean Low-top Footwear'}
                          </p>
                          {look?.accessories && look.accessories.length > 0 && (
                            <p>
                              <strong className="text-white">Accents:</strong>{' '}
                              {look.accessories.join(', ')}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })()}
            </div>
          ) : null}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <span>💡 3-way styling maximizes closet rewears & eliminates repeat boredom.</span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
