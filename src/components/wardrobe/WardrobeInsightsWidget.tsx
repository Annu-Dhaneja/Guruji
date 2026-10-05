import React from 'react';
import {
  TrendingUp,
  PieChart,
  Layers,
  Sparkles,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
  Tag,
  Zap,
} from 'lucide-react';
import { WardrobeClothingItem, QuickStyleProfile } from '../../types';
import { computeWardrobeInsightsStats } from '../../data/wardrobeData';

interface WardrobeInsightsWidgetProps {
  wardrobe: WardrobeClothingItem[];
  profile: QuickStyleProfile;
  onOpenGapAssistant?: () => void;
}

export const WardrobeInsightsWidget: React.FC<WardrobeInsightsWidgetProps> = ({
  wardrobe,
  profile,
  onOpenGapAssistant,
}) => {
  const stats = computeWardrobeInsightsStats(wardrobe, profile);

  return (
    <div className="rounded-3xl bg-slate-900 border border-slate-800 p-5 sm:p-6 shadow-xl space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-800/80">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center font-bold">
            <TrendingUp className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-sm font-black text-white">Wardrobe Intelligence & Health</h4>
            <p className="text-[11px] text-slate-400">
              Capsule efficiency metrics across your {stats.totalItems} pieces.
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-xs font-bold text-slate-400">Versatility Score:</span>
          <span className="px-3 py-1 rounded-xl bg-purple-500/20 text-purple-300 border border-purple-500/30 text-xs font-black">
            {stats.versatilityScore}/100
          </span>
        </div>
      </div>

      {/* 4 Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800">
          <span className="text-[10px] font-bold uppercase text-slate-400">Total Items</span>
          <p className="text-xl font-black text-white mt-0.5">{stats.totalItems}</p>
          <span className="text-[10px] text-emerald-400">Active closet inventory</span>
        </div>

        <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800">
          <span className="text-[10px] font-bold uppercase text-slate-400">Most Versatile</span>
          <p className="text-sm font-black text-amber-400 mt-0.5 truncate">{stats.mostUsedCategory}</p>
          <span className="text-[10px] text-slate-400">Core anchor piece</span>
        </div>

        <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800">
          <span className="text-[10px] font-bold uppercase text-slate-400">Top Colorway</span>
          <p className="text-sm font-black text-cyan-400 mt-0.5 truncate">{stats.topColorPalette}</p>
          <span className="text-[10px] text-slate-400">Dominant base shade</span>
        </div>

        <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800">
          <span className="text-[10px] font-bold uppercase text-slate-400">Closet Health</span>
          <p className="text-sm font-black text-emerald-400 mt-0.5">{stats.capsuleHealth}</p>
          <span className="text-[10px] text-slate-400">Optimal mix-match ratio</span>
        </div>
      </div>

      {/* Suggested Gap / Upgrade Recommendation */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/10 via-purple-500/10 to-transparent border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-start space-x-2.5">
          <Sparkles className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
          <div>
            <span className="font-black text-white">Recommended Capsule Addition: </span>
            <span className="text-slate-300">
              Adding a {stats.suggestedAddition} will multiply your outfit combinations by 3x.
            </span>
          </div>
        </div>

        {onOpenGapAssistant && (
          <button
            onClick={onOpenGapAssistant}
            className="px-3 py-1.5 rounded-xl bg-amber-500 text-slate-950 font-black text-xs hover:bg-amber-400 transition-colors flex-shrink-0"
          >
            Test Item Fit
          </button>
        )}
      </div>
    </div>
  );
};
