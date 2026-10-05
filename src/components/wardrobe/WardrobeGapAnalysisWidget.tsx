import React, { useState } from 'react';
import { Sparkles, ShieldCheck, TrendingUp, ShoppingBag, CheckCircle, Info, ChevronRight, IndianRupee, Layers } from 'lucide-react';
import { WardrobeGapAnalysis } from '../../types';

interface WardrobeGapAnalysisWidgetProps {
  analysis: WardrobeGapAnalysis;
  onBudgetChange?: (budget: string) => void;
}

export const WardrobeGapAnalysisWidget: React.FC<WardrobeGapAnalysisWidgetProps> = ({
  analysis,
}) => {
  const [selectedBudget, setSelectedBudget] = useState<string>('all');

  const budgetOptions = [
    { id: 'all', label: 'All Recommendations' },
    { id: '500', label: 'Under ₹1,000' },
    { id: '2500', label: 'Under ₹2,500' },
    { id: '5000', label: 'Under ₹5,000' },
  ];

  return (
    <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden p-6 sm:p-8 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-6">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-2">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Wardrobe Intelligence & Score</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
            Your Wardrobe Score & Gap Analysis
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-xl">
            {analysis.summary}
          </p>
        </div>

        <div className="flex items-center space-x-2 px-4 py-2 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-500 text-xs font-bold shrink-0">
          <ShieldCheck className="w-4 h-4" />
          <span>Zero Compulsory Purchases</span>
        </div>
      </div>

      {/* Wardrobe Score Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800/80 space-y-2">
          <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 block">
            Wardrobe Variety
          </span>
          <div className="flex items-baseline space-x-1">
            <span className="text-2xl sm:text-3xl font-black text-amber-500">
              {analysis.varietyScore}%
            </span>
          </div>
          <div className="w-full bg-slate-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
            <div
              className="bg-gradient-to-r from-amber-500 to-rose-500 h-full rounded-full transition-all duration-1000"
              style={{ width: `${analysis.varietyScore}%` }}
            />
          </div>
        </div>

        {/* Metric 2 */}
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800/80 space-y-2">
          <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 block">
            Outfit Coverage
          </span>
          <div className="flex items-baseline space-x-1">
            <span className="text-2xl sm:text-3xl font-black text-teal-400">
              {analysis.coverageScore}%
            </span>
          </div>
          <div className="w-full bg-slate-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
            <div
              className="bg-gradient-to-r from-teal-500 to-cyan-400 h-full rounded-full transition-all duration-1000"
              style={{ width: `${analysis.coverageScore}%` }}
            />
          </div>
        </div>

        {/* Metric 3 */}
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800/80 space-y-2">
          <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 block">
            Colour Variety
          </span>
          <div className="flex items-baseline space-x-1">
            <span className="text-2xl sm:text-3xl font-black text-purple-400">
              {analysis.colorVarietyScore}%
            </span>
          </div>
          <div className="w-full bg-slate-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
            <div
              className="bg-gradient-to-r from-purple-500 to-pink-500 h-full rounded-full transition-all duration-1000"
              style={{ width: `${analysis.colorVarietyScore}%` }}
            />
          </div>
        </div>

        {/* Metric 4 */}
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800/80 space-y-2">
          <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 block">
            Footwear Coverage
          </span>
          <div className="flex items-baseline space-x-1">
            <span className="text-2xl sm:text-3xl font-black text-rose-400">
              {analysis.footwearScore}%
            </span>
          </div>
          <div className="w-full bg-slate-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
            <div
              className="bg-gradient-to-r from-rose-500 to-amber-500 h-full rounded-full transition-all duration-1000"
              style={{ width: `${analysis.footwearScore}%` }}
            />
          </div>
        </div>
      </div>

      {/* ONE THING YOU MAY NEED Card */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-amber-500/10 via-rose-500/10 to-purple-600/10 border border-amber-500/30 space-y-3">
        <div className="flex items-center space-x-2">
          <Sparkles className="w-5 h-5 text-amber-500 shrink-0" />
          <h4 className="text-xs font-black uppercase tracking-wider text-amber-500">
            ONE THING YOU MAY NEED
          </h4>
        </div>
        <div className="space-y-1">
          <h5 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
            {analysis.oneThingYouNeed.item}
          </h5>
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            {analysis.oneThingYouNeed.reason}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3 pt-2">
          <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-500 text-[11px] font-black border border-amber-500/40">
            +{analysis.oneThingYouNeed.extraCombinations} New Outfit Possibilities
          </span>
          {analysis.oneThingYouNeed.estimatedPrice && (
            <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400">
              Est. Investment: ₹{analysis.oneThingYouNeed.estimatedPrice.toLocaleString('en-IN')}
            </span>
          )}
        </div>
      </div>

      {/* SMART SHOPPING PRIORITY SECTION */}
      <div className="space-y-4 pt-2">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h4 className="text-sm font-black text-slate-900 dark:text-white flex items-center space-x-2">
              <ShoppingBag className="w-4 h-4 text-purple-400" />
              <span>Smart Shopping Priority (Only If You Wish To Shop)</span>
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Ranked by mathematical utility — items that multiply your existing wardrobe without clutter.
            </p>
          </div>

          {/* Budget Filter */}
          <div className="flex flex-wrap gap-1.5 text-xs">
            {budgetOptions.map((b) => (
              <button
                key={b.id}
                onClick={() => setSelectedBudget(b.id)}
                className={`px-3 py-1 rounded-lg font-bold transition-all ${
                  selectedBudget === b.id
                    ? 'bg-purple-600 text-white shadow-sm'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                }`}
              >
                {b.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
          {/* Priority 1: Buy First */}
          <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-950 border-2 border-amber-500/40 space-y-3 relative overflow-hidden flex flex-col justify-between">
            <div className="space-y-2">
              <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-amber-500 text-slate-950 text-[10px] font-black uppercase">
                <span>1. Buy First</span>
              </div>
              <h5 className="text-xs font-black text-slate-900 dark:text-white">
                {analysis.smartShopping.buyFirst.item}
              </h5>
              <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
                {analysis.smartShopping.buyFirst.reason}
              </p>
            </div>

            <div className="pt-3 border-t border-slate-200 dark:border-slate-800/80 space-y-1.5 text-[10px]">
              <div className="flex items-center justify-between font-bold">
                <span className="text-slate-500">Pairs with:</span>
                <span className="text-amber-500">
                  {analysis.smartShopping.buyFirst.versatilePairings.slice(0, 2).join(', ')}
                </span>
              </div>
              <div className="flex items-center justify-between font-bold">
                <span className="text-slate-500">Approx. Budget:</span>
                <span className="text-slate-900 dark:text-white">
                  ₹{analysis.smartShopping.buyFirst.budgetEst}
                </span>
              </div>
            </div>
          </div>

          {/* Priority 2: Buy Next */}
          <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-3 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-teal-500/20 text-teal-400 text-[10px] font-black uppercase border border-teal-500/30">
                <span>2. Buy Next</span>
              </div>
              <h5 className="text-xs font-black text-slate-900 dark:text-white">
                {analysis.smartShopping.buyNext.item}
              </h5>
              <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
                {analysis.smartShopping.buyNext.reason}
              </p>
            </div>

            <div className="pt-3 border-t border-slate-200 dark:border-slate-800/80 space-y-1.5 text-[10px]">
              <div className="flex items-center justify-between font-bold">
                <span className="text-slate-500">Pairs with:</span>
                <span className="text-teal-400">
                  {analysis.smartShopping.buyNext.versatilePairings.slice(0, 2).join(', ')}
                </span>
              </div>
              <div className="flex items-center justify-between font-bold">
                <span className="text-slate-500">Approx. Budget:</span>
                <span className="text-slate-900 dark:text-white">
                  ₹{analysis.smartShopping.buyNext.budgetEst}
                </span>
              </div>
            </div>
          </div>

          {/* Priority 3: Optional */}
          <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-3 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-400 text-[10px] font-black uppercase border border-purple-500/30">
                <span>3. Optional Accent</span>
              </div>
              <h5 className="text-xs font-black text-slate-900 dark:text-white">
                {analysis.smartShopping.optional.item}
              </h5>
              <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
                {analysis.smartShopping.optional.reason}
              </p>
            </div>

            <div className="pt-3 border-t border-slate-200 dark:border-slate-800/80 space-y-1.5 text-[10px]">
              <div className="flex items-center justify-between font-bold">
                <span className="text-slate-500">Pairs with:</span>
                <span className="text-purple-400">
                  {analysis.smartShopping.optional.versatilePairings.slice(0, 2).join(', ')}
                </span>
              </div>
              <div className="flex items-center justify-between font-bold">
                <span className="text-slate-500">Approx. Budget:</span>
                <span className="text-slate-900 dark:text-white">
                  ₹{analysis.smartShopping.optional.budgetEst}
                </span>
              </div>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
};
