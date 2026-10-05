import React, { useMemo } from 'react';
import {
  X,
  Sparkles,
  PieChart,
  Palette,
  Zap,
  CheckCircle2,
  TrendingUp,
  Shirt,
  Award,
} from 'lucide-react';
import { WardrobeClothingItem, QuickStyleProfile } from '../../types';

interface StyleDnaModalProps {
  isOpen: boolean;
  onClose: () => void;
  wardrobe: WardrobeClothingItem[];
  profile?: QuickStyleProfile;
}

export const StyleDnaModal: React.FC<StyleDnaModalProps> = ({
  isOpen,
  onClose,
  wardrobe,
  profile,
}) => {
  if (!isOpen) return null;

  // Compute Color Distribution
  const colorBreakdown = useMemo(() => {
    const counts: Record<string, number> = {};
    wardrobe.forEach((item) => {
      const color = item.color || 'Neutral';
      counts[color] = (counts[color] || 0) + 1;
    });

    const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);
    const total = wardrobe.length || 1;
    return sorted.map(([name, count]) => ({
      name,
      count,
      percentage: Math.round((count / total) * 100),
    }));
  }, [wardrobe]);

  // Compute Versatility Index (ratio of mix-and-match pieces)
  const versatilityScore = useMemo(() => {
    if (!wardrobe || wardrobe.length === 0) return 60;
    const tops = wardrobe.filter((i) => i?.category && ['Shirt', 'T-Shirt', 'Top', 'Kurta', 'Jacket'].includes(i.category)).length;
    const bottoms = wardrobe.filter((i) => i?.category && ['Jeans', 'Trousers', 'Shorts', 'Skirt'].includes(i.category)).length;
    const neutralCount = wardrobe.filter((i) =>
      ['Black', 'White', 'Navy', 'Grey', 'Beige', 'Cream', 'Olive'].some((c) =>
        (i?.color || '').toLowerCase().includes(c.toLowerCase())
      )
    ).length;

    const balanceRatio = Math.min(tops, bottoms) / (Math.max(tops, bottoms) || 1);
    const neutralRatio = neutralCount / (wardrobe.length || 1);
    const score = Math.round(70 + balanceRatio * 15 + neutralRatio * 15);
    return Math.min(98, Math.max(65, score));
  }, [wardrobe]);

  // Dominant Aesthetics
  const dominantStyles = useMemo(() => {
    const styleCounts: Record<string, number> = {
      'Smart Casual': 0,
      'Minimalist Modern': 0,
      'Classic Professional': 0,
      'Relaxed Weekend': 0,
    };

    (wardrobe || []).forEach((item) => {
      const vibe = item?.styleVibe || item?.style || 'Casual';
      if ((vibe || '').includes('Smart') || item?.category === 'Shirt') styleCounts['Smart Casual'] += 1;
      else if ((vibe || '').includes('Formal') || item?.category === 'Trousers') styleCounts['Classic Professional'] += 1;
      else if ((vibe || '').includes('Minimal') || item?.color === 'Black' || item?.color === 'White') styleCounts['Minimalist Modern'] += 1;
      else styleCounts['Relaxed Weekend'] += 1;
    });

    const total = Object.values(styleCounts).reduce((a, b) => a + b, 0) || 1;
    return Object.entries(styleCounts)
      .map(([name, count]) => ({
        name,
        percentage: Math.round((count / total) * 100) || 25,
      }))
      .sort((a, b) => b.percentage - a.percentage);
  }, [wardrobe]);

  // Hero Pieces (most versatile)
  const heroPieces = useMemo(() => {
    return wardrobe.slice(0, 3);
  }, [wardrobe]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div
        className="w-full max-w-xl max-h-[90vh] bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden text-slate-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-slate-900/80">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">My Style DNA</h3>
              <p className="text-xs text-slate-400">Deep aesthetic breakdown & capsule versatility profile</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto space-y-5 text-xs">
          {/* Top Score Banner */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-950/40 via-slate-950 to-amber-950/30 border border-purple-500/20 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[10px] uppercase font-black text-purple-400 tracking-wider flex items-center space-x-1">
                <Award className="w-3.5 h-3.5" />
                <span>Closet Versatility Index</span>
              </span>
              <h4 className="text-base font-black text-white">
                {versatilityScore >= 85 ? 'Highly Inter-Rotational Capsule' : 'Well-Balanced Foundation'}
              </h4>
              <p className="text-[11px] text-slate-300">
                You can create over <strong className="text-amber-400">{wardrobe.length * 3}+ unique outfits</strong> without repeating identical looks.
              </p>
            </div>
            <div className="text-right pl-4">
              <span className="text-3xl font-black text-amber-400">{versatilityScore}%</span>
              <span className="text-[10px] text-slate-400 block">Mix & Match Rating</span>
            </div>
          </div>

          {/* Style Archetype Breakdown */}
          <div className="space-y-2">
            <h4 className="font-bold text-white text-xs flex items-center space-x-1.5">
              <PieChart className="w-3.5 h-3.5 text-amber-400" />
              <span>Primary Aesthetic Archetypes</span>
            </h4>
            <div className="grid grid-cols-2 gap-2">
              {dominantStyles.map((style) => (
                <div
                  key={style.name}
                  className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5"
                >
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span className="text-slate-200">{style.name}</span>
                    <span className="text-amber-400 font-bold">{style.percentage}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-amber-500 rounded-full"
                      style={{ width: `${style.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Color Palette DNA */}
          <div className="space-y-2">
            <h4 className="font-bold text-white text-xs flex items-center space-x-1.5">
              <Palette className="w-3.5 h-3.5 text-purple-400" />
              <span>Your Dominant Color Palette</span>
            </h4>
            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
              <div className="flex items-center space-x-1 h-3 rounded-full overflow-hidden bg-slate-800">
                {colorBreakdown.slice(0, 5).map((color, idx) => {
                  const bgColors = ['bg-slate-200', 'bg-amber-600', 'bg-blue-600', 'bg-emerald-600', 'bg-purple-600'];
                  return (
                    <div
                      key={color.name}
                      className={`h-full ${bgColors[idx % bgColors.length]}`}
                      style={{ width: `${color.percentage}%` }}
                      title={`${color.name}: ${color.percentage}%`}
                    />
                  );
                })}
              </div>

              <div className="flex flex-wrap gap-2 pt-1">
                {colorBreakdown.slice(0, 6).map((color) => (
                  <span
                    key={color.name}
                    className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-[11px] text-slate-300 flex items-center space-x-1.5"
                  >
                    <span className="w-2 h-2 rounded-full bg-amber-400" />
                    <span>{color.name}</span>
                    <span className="text-slate-500 font-semibold">{color.count} pcs ({color.percentage}%)</span>
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Core Foundation Hero Pieces */}
          <div className="space-y-2">
            <h4 className="font-bold text-white text-xs flex items-center space-x-1.5">
              <Shirt className="w-3.5 h-3.5 text-emerald-400" />
              <span>Wardrobe Anchor Pieces (Most Adaptable)</span>
            </h4>
            <div className="grid grid-cols-3 gap-2">
              {heroPieces.map((item) => (
                <div
                  key={item.id}
                  className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 flex flex-col items-center text-center space-y-1.5"
                >
                  <div className="w-12 h-12 rounded-lg overflow-hidden bg-slate-900">
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <span className="text-[10px] font-bold text-white truncate w-full">{item.name}</span>
                  <span className="text-[9px] text-emerald-400 font-semibold">Capsule Core</span>
                </div>
              ))}
            </div>
          </div>

          {/* AI Stylist Conclusion */}
          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 space-y-1">
            <strong className="text-white text-xs block flex items-center space-x-1">
              <Zap className="w-3 h-3 text-amber-400" />
              <span>AI Stylist Prescription:</span>
            </strong>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Your wardrobe has an exceptionally high rotation capability for smart casual and minimal modern aesthetics. Adding one statement textural piece (like a textured knit or suede loafer) will elevate your daily outfits without diluting mix-and-match versatility.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
