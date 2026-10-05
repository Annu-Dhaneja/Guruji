import React, { useState } from 'react';
import {
  X,
  ShoppingBag,
  Sparkles,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Layers,
  ArrowRight,
  Globe,
  Tag,
  RefreshCw,
  Plus,
} from 'lucide-react';
import { WardrobeClothingItem, BuyOrDontBuyAnalysis } from '../../types';
import { generateLocalBuyDecision } from '../../data/wardrobeData';

interface BuyOrDontBuyModalProps {
  isOpen: boolean;
  onClose: () => void;
  wardrobe: WardrobeClothingItem[];
}

export const BuyOrDontBuyModal: React.FC<BuyOrDontBuyModalProps> = ({
  isOpen,
  onClose,
  wardrobe,
}) => {
  const [queryItem, setQueryItem] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState<'Hinglish' | 'Hindi' | 'English'>('Hinglish');
  const [isLoading, setIsLoading] = useState(false);
  const [analysis, setAnalysis] = useState<BuyOrDontBuyAnalysis | null>(null);

  if (!isOpen) return null;

  const handleAnalyze = async (itemQuery = queryItem, lang = selectedLanguage) => {
    if (!itemQuery.trim()) return;
    setIsLoading(true);
    try {
      const res = await fetch('/api/wardrobe/buy-decision', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          queryItem: itemQuery.trim(),
          items: wardrobe,
          language: lang,
        }),
      });

      const data = await res.json();
      if (data.success && data.analysis) {
        setAnalysis(data.analysis);
      } else {
        const local = generateLocalBuyDecision(itemQuery.trim(), wardrobe, lang);
        setAnalysis(local);
      }
    } catch (e) {
      console.warn('Fallback to local buy decision:', e);
      const local = generateLocalBuyDecision(itemQuery.trim(), wardrobe, lang);
      setAnalysis(local);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLanguageChange = (lang: 'Hinglish' | 'Hindi' | 'English') => {
    setSelectedLanguage(lang);
    if (analysis && queryItem) {
      handleAnalyze(queryItem, lang);
    }
  };

  const getVerdictBadge = (verdict: string) => {
    if (verdict.includes('BUY') && !verdict.includes("DON'T") && !verdict.includes('THINK')) {
      return {
        bg: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
        icon: CheckCircle,
        label: 'BUY RECOMMENDED',
      };
    }
    if (verdict.includes('THINK') || verdict.includes('CAUTION')) {
      return {
        bg: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
        icon: AlertTriangle,
        label: 'THINK TWICE',
      };
    }
    return {
      bg: 'bg-rose-500/20 text-rose-400 border-rose-500/30',
      icon: XCircle,
      label: "DON'T BUY (REDUNDANT)",
    };
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-3xl max-h-[92vh] bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col my-auto">
        {/* Header */}
        <div className="p-5 sm:p-6 bg-gradient-to-r from-cyan-500/15 via-blue-500/10 to-indigo-500/15 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center text-slate-950 shadow-lg shadow-cyan-500/20 font-black">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-cyan-400">
                  Smart Shopping Guard
                </span>
                <span className="px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 text-[10px] font-bold">
                  Buy Or Don't Buy?
                </span>
              </div>
              <h3 className="text-lg sm:text-xl font-black text-white">
                Closet Gap & Shopping Validator
              </h3>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {/* Language Selector */}
            <div className="flex items-center bg-slate-800/90 p-1 rounded-xl border border-slate-700">
              <Globe className="w-3.5 h-3.5 text-slate-400 ml-1.5 mr-1" />
              {(['Hinglish', 'Hindi', 'English'] as const).map((lang) => (
                <button
                  key={lang}
                  onClick={() => handleLanguageChange(lang)}
                  className={`px-2 py-0.5 rounded-lg text-[11px] font-bold transition-all ${
                    selectedLanguage === lang
                      ? 'bg-cyan-500 text-slate-950 shadow-sm'
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

        {/* Modal Content */}
        <div className="p-5 sm:p-7 overflow-y-auto space-y-6 flex-1">
          {/* Query Input Section */}
          <div className="space-y-3">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">
              What are you thinking of buying?
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={queryItem}
                onChange={(e) => setQueryItem(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAnalyze()}
                placeholder="e.g. Navy Blue Blazer, Chunky White Sneakers, Floral Midi Dress, Black Linen Pants..."
                className="flex-1 p-3.5 rounded-2xl bg-slate-950 border border-slate-800 text-white text-xs placeholder-slate-500 focus:outline-none focus:border-cyan-500"
              />
              <button
                onClick={() => handleAnalyze()}
                disabled={isLoading || !queryItem.trim()}
                className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-500 hover:to-blue-600 text-slate-950 font-black text-xs flex items-center space-x-1.5 shadow-lg shadow-cyan-500/20 transition-all disabled:opacity-50 flex-shrink-0"
              >
                <Sparkles className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                <span>Evaluate Closet Fit</span>
              </button>
            </div>

            {/* Quick Inspiration Chips */}
            <div className="flex flex-wrap items-center gap-1.5 pt-1">
              <span className="text-[11px] text-slate-500">Quick tests:</span>
              {[
                'Beige Linen Blazer',
                'White Leather Sneakers',
                'Pleated Midi Skirt',
                'Brown Chelsea Boots',
                'Black Oversized Tee',
              ].map((item) => (
                <button
                  key={item}
                  onClick={() => {
                    setQueryItem(item);
                    handleAnalyze(item);
                  }}
                  className="px-2.5 py-1 rounded-lg bg-slate-800/60 hover:bg-slate-800 text-slate-300 text-[11px] transition-colors"
                >
                  + {item}
                </button>
              ))}
            </div>
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="py-12 text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center mx-auto animate-spin">
                <RefreshCw className="w-6 h-6" />
              </div>
              <p className="text-white font-bold text-sm">
                Cross-checking “{queryItem}” against your {wardrobe.length} wardrobe pieces...
              </p>
              <p className="text-xs text-slate-400">
                Checking redundancy, color harmony, and versatile combinations.
              </p>
            </div>
          )}

          {/* Analysis Result */}
          {!isLoading && analysis && (
            <div className="space-y-5">
              {/* Verdict Banner */}
              {(() => {
                const badge = getVerdictBadge(analysis.verdict);
                const IconComponent = badge.icon;
                return (
                  <div className={`p-5 rounded-3xl border ${badge.bg} space-y-2`}>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-center space-x-2">
                        <IconComponent className="w-6 h-6" />
                        <div>
                          <span className="text-[10px] font-black uppercase tracking-wider opacity-80">
                            AI Verdict
                          </span>
                          <h4 className="text-lg font-black">{analysis.verdict}</h4>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs font-bold">Utility Score:</span>
                        <span className="px-3 py-1 rounded-xl bg-slate-950/80 text-white font-black text-sm border border-slate-700">
                          {analysis.score}/100
                        </span>
                      </div>
                    </div>
                    <p className="text-xs font-medium leading-relaxed opacity-95">
                      {analysis.reasoning}
                    </p>
                  </div>
                );
              })()}

              {/* Versatility & Existing Pairings Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                  <div className="flex items-center space-x-2 text-cyan-400 text-xs font-bold uppercase tracking-wider">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Outfits Unlocked</span>
                  </div>
                  <p className="text-xl font-black text-white">
                    +{analysis.potentialNewOutfits || 4} New Combinations
                  </p>
                  <p className="text-xs text-slate-400">
                    This item pairs directly with{' '}
                    <strong className="text-white">
                      {analysis.matchingClosetItems?.length || 3} items
                    </strong>{' '}
                    already in your closet.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                  <div className="flex items-center space-x-2 text-amber-400 text-xs font-bold uppercase tracking-wider">
                    <Tag className="w-3.5 h-3.5" />
                    <span>Smart Stylist Tip ({selectedLanguage})</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {analysis.betterAlternative ||
                      'If buying, select a high-quality breathable fabric (linen/cotton blend) so it endures across multiple seasons.'}
                  </p>
                </div>
              </div>

              {/* Matching Closest Items */}
              {analysis.matchingClosetItems && analysis.matchingClosetItems.length > 0 && (
                <div>
                  <h5 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center space-x-1.5">
                    <Layers className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Closet Items That Will Pair With This</span>
                  </h5>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {analysis.matchingClosetItems.map((item, idx) => (
                      <div
                        key={idx}
                        className="p-2.5 rounded-2xl bg-slate-950 border border-slate-800 flex items-center space-x-2.5"
                      >
                        <div className="w-10 h-10 rounded-xl overflow-hidden bg-slate-900 flex-shrink-0">
                          <img
                            src={item.imageUrl}
                            alt={item.name}
                            className="w-full h-full object-cover"
                            referrerPolicy="no-referrer"
                          />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-bold text-white truncate">{item.name}</p>
                          <p className="text-[10px] text-slate-400">{item.category}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <span>💡 Prevents duplicate purchases & encourages intentional styling.</span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
