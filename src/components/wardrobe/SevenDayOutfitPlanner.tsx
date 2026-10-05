import React, { useState } from 'react';
import {
  Sparkles,
  RefreshCw,
  Download,
  Share2,
  Bookmark,
  Heart,
  Calendar,
  CloudSun,
  Briefcase,
  Layers,
  Check,
  RotateCcw,
  ArrowRightLeft,
  ChevronDown,
  Info,
  CheckCircle2,
} from 'lucide-react';
import { DayOutfitPlan, WardrobeClothingItem, QuickStyleProfile } from '../../types';
import { computeItemRewears } from '../../data/wardrobeData';
import { ItemReplaceModal } from './ItemReplaceModal';
import { StyleBlueprintModal } from './StyleBlueprintModal';
import { FileText } from 'lucide-react';

interface SevenDayOutfitPlannerProps {
  plan: DayOutfitPlan[];
  wardrobe: WardrobeClothingItem[];
  profile: QuickStyleProfile;
  isRestyleActive: boolean;
  onRestyleWardrobe: () => void;
  onRegenerateAll: () => void;
  onRegenerateSingleDay: (dayName: string, existingDay: DayOutfitPlan) => void;
  onReplaceItemInDay: (dayId: string, oldItemId: string, newItem: WardrobeClothingItem) => void;
  onToggleDayFavourite: (dayId: string) => void;
  onProfileChange: (profile: QuickStyleProfile) => void;
}

export const SevenDayOutfitPlanner: React.FC<SevenDayOutfitPlannerProps> = ({
  plan,
  wardrobe,
  profile,
  isRestyleActive,
  onRestyleWardrobe,
  onRegenerateAll,
  onRegenerateSingleDay,
  onReplaceItemInDay,
  onToggleDayFavourite,
  onProfileChange,
}) => {
  const [selectedDayTab, setSelectedDayTab] = useState<string>('all');
  const [replacingContext, setReplacingContext] = useState<{
    dayId: string;
    dayName: string;
    item: WardrobeClothingItem;
  } | null>(null);
  const [copiedNotification, setCopiedNotification] = useState(false);
  const [savedNotification, setSavedNotification] = useState(false);
  const [isBlueprintModalOpen, setIsBlueprintModalOpen] = useState(false);

  const rewearMap = computeItemRewears(plan);

  const handleDownloadPlan = () => {
    let content = `====================================================\n`;
    content += `GURUCRAFTPRO - 7-DAY CAPSULE WARDROBE STYLE PLAN\n`;
    content += `Styled by Annu Dhaneja • Rohini, Delhi\n`;
    content += `Client Profile: ${profile.lifestyle} | ${profile.preferredStyle} | ${profile.weatherPreference} Weather\n`;
    content += `====================================================\n\n`;

    plan.forEach((day, idx) => {
      content += `[DAY ${idx + 1}: ${day.dayName.toUpperCase()}] - ${day.theme}\n`;
      content += `Occasion: ${day.occasion} | Weather: ${day.weather}\n`;
      content += `Selected Items:\n`;
      day.items.forEach((item) => {
        const rewears = rewearMap[item.id] || 1;
        content += `  • ${item.name} (${item.category}, ${item.color}) - Worn ${rewears}/7 days\n`;
      });
      content += `Styling Rationale: ${day.stylingTips}\n\n`;
    });

    content += `====================================================\n`;
    content += `Powered by GurucraftPro AI Smart Wardrobe Engine\n`;
    content += `Annu Dhaneja Creative Studio & Wardrobe Planner\n`;

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `GurucraftPro_7Day_Wardrobe_Plan_${Date.now()}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleSharePlan = () => {
    const summaryText = `Check out my GurucraftPro 7-Day Capsule Wardrobe styled by Annu Dhaneja!\n${plan.length} days of smart outfits created purely from existing clothes without purchasing new items.`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(summaryText);
      setCopiedNotification(true);
      setTimeout(() => setCopiedNotification(false), 3000);
    }
  };

  const handleSavePlan = async () => {
    try {
      await fetch('/api/wardrobe/save-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          plan,
          profile,
          itemsCount: wardrobe.length,
        }),
      });
      setSavedNotification(true);
      setTimeout(() => setSavedNotification(false), 3000);
    } catch (e) {
      console.error(e);
    }
  };

  const weatherOptions = ['Normal', 'Hot', 'Cool', 'Cold', 'Rainy'];
  const occasionOptions = ['Office', 'Meeting', 'Casual', 'Date', 'Party', 'Wedding', 'Travel', 'Daily'];

  return (
    <div className="space-y-8">
      
      {/* Top Banner & Quick Controls Bar */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 text-white shadow-2xl space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-400 text-xs font-bold uppercase tracking-wider border border-amber-500/30 flex items-center space-x-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>AI 7-Day Capsule Plan</span>
              </span>
              {isRestyleActive && (
                <span className="px-3 py-1 rounded-full bg-purple-600/30 text-purple-300 text-xs font-bold uppercase tracking-wider border border-purple-500/40">
                  Restyle Mode Active
                </span>
              )}
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white">
              7-Day Smart Outfit Schedule
            </h2>
            <p className="text-xs text-slate-400">
              Personalized capsule combinations crafted from your {wardrobe.length} wardrobe pieces.
            </p>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* UNIQUE RESTYLE BUTTON */}
            <button
              onClick={onRestyleWardrobe}
              className="px-5 py-3 rounded-2xl bg-gradient-to-r from-amber-500 via-rose-500 to-purple-600 text-slate-950 font-black text-xs sm:text-sm shadow-xl hover:opacity-90 transition-all flex items-center space-x-2 animate-pulse"
              title="Maximize combinations from existing clothes without shopping"
            >
              <RotateCcw className="w-4 h-4" />
              <span>DON'T BUY — RESTYLE MY WARDROBE</span>
            </button>

            <button
              onClick={() => setIsBlueprintModalOpen(true)}
              className="p-3 rounded-2xl bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 hover:text-amber-200 text-xs font-bold transition-all flex items-center space-x-1.5 border border-amber-500/30 shadow-sm"
              title="View & Print 7-Day Style Blueprint PDF Report"
            >
              <FileText className="w-4 h-4 text-amber-400" />
              <span>Style Blueprint (PDF)</span>
            </button>

            <button
              onClick={onRegenerateAll}
              className="p-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-bold transition-colors flex items-center space-x-1.5 border border-slate-700"
              title="Regenerate Full Week"
            >
              <RefreshCw className="w-4 h-4" />
              <span className="hidden sm:inline">Regenerate All</span>
            </button>

            <button
              onClick={handleDownloadPlan}
              className="p-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-bold transition-colors flex items-center space-x-1.5 border border-slate-700"
              title="Download Plan"
            >
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">Download</span>
            </button>

            <button
              onClick={handleSharePlan}
              className="p-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-bold transition-colors flex items-center space-x-1.5 border border-slate-700"
              title="Share Plan"
            >
              <Share2 className="w-4 h-4" />
              <span className="hidden sm:inline">Share</span>
            </button>

            <button
              onClick={handleSavePlan}
              className="p-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-bold transition-colors flex items-center space-x-1.5 border border-slate-700"
              title="Save Plan"
            >
              <Bookmark className="w-4 h-4" />
              <span className="hidden sm:inline">Save</span>
            </button>
          </div>
        </div>

        {/* Notifications */}
        {copiedNotification && (
          <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>Wardrobe plan summary copied to clipboard!</span>
          </div>
        )}
        {savedNotification && (
          <div className="p-3 rounded-xl bg-teal-500/20 border border-teal-500/40 text-teal-300 text-xs font-bold flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>7-Day style plan saved to your account!</span>
          </div>
        )}

        {/* Quick Weather & Occasion Filter Switcher */}
        <div className="pt-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-4 text-xs">
          <div className="flex items-center space-x-3">
            <span className="text-slate-400 font-bold flex items-center space-x-1">
              <CloudSun className="w-4 h-4 text-amber-400" />
              <span>Weather Mode:</span>
            </span>
            <div className="flex flex-wrap gap-1.5">
              {weatherOptions.map((w) => (
                <button
                  key={w}
                  onClick={() => onProfileChange({ ...profile, weatherPreference: w as any })}
                  className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                    profile.weatherPreference === w
                      ? 'bg-amber-500 text-slate-950 shadow-sm'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  {w}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <span className="text-slate-400 font-bold flex items-center space-x-1">
              <Briefcase className="w-4 h-4 text-teal-400" />
              <span>Target Occasion:</span>
            </span>
            <select
              value={profile.targetOccasion}
              onChange={(e) => onProfileChange({ ...profile, targetOccasion: e.target.value as any })}
              className="p-1.5 rounded-lg bg-slate-800 border border-slate-700 text-white outline-none focus:border-amber-400 font-bold text-xs"
            >
              {occasionOptions.map((o) => (
                <option key={o} value={o}>
                  {o}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Day Filter Pills */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-2 no-scrollbar">
        <button
          onClick={() => setSelectedDayTab('all')}
          className={`px-4 py-2 rounded-xl text-xs font-black shrink-0 transition-all ${
            selectedDayTab === 'all'
              ? 'bg-amber-500 text-slate-950 shadow-md'
              : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          All 7 Days View
        </button>
        {plan.map((day) => (
          <button
            key={day.dayId}
            onClick={() => setSelectedDayTab(day.dayId)}
            className={`px-4 py-2 rounded-xl text-xs font-bold shrink-0 transition-all ${
              selectedDayTab === day.dayId
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            {day.dayName}
          </button>
        ))}
      </div>

      {/* Daily Cards Layout */}
      <div className="space-y-6">
        {plan
          .filter((day) => selectedDayTab === 'all' || selectedDayTab === day.dayId)
          .map((day, dayIndex) => (
            <div
              key={day.dayId}
              className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden transition-all duration-300 hover:border-slate-300 dark:hover:border-slate-700"
            >
              {/* Day Header */}
              <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-500 border border-amber-500/30 flex items-center justify-center font-black text-sm">
                    {day.dayName.substring(0, 3)}
                  </div>
                  <div>
                    <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center space-x-2">
                      <span>{day.theme}</span>
                    </h3>
                    <div className="flex items-center space-x-2 mt-0.5 text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                      <span>Occasion: {day.occasion}</span>
                      <span>•</span>
                      <span>Weather: {day.weather}</span>
                    </div>
                  </div>
                </div>

                {/* Day Action Buttons */}
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => onRegenerateSingleDay(day.dayName, day)}
                    className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-amber-500 hover:text-slate-950 text-slate-700 dark:text-slate-300 text-xs font-bold transition-colors flex items-center space-x-1.5 shadow-sm"
                    title={`Regenerate ${day.dayName} Only`}
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Regenerate {day.dayName}</span>
                  </button>

                  <button
                    onClick={() => onToggleDayFavourite(day.dayId)}
                    className={`p-2 rounded-xl border transition-all ${
                      day.isFavourite
                        ? 'bg-rose-500/10 border-rose-500/30 text-rose-500'
                        : 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-400 hover:text-rose-500'
                    }`}
                    title="Favourite This Daily Look"
                  >
                    <Heart className={`w-4 h-4 ${day.isFavourite ? 'fill-current' : ''}`} />
                  </button>
                </div>
              </div>

              {/* Items Grid for this day */}
              <div className="p-6 space-y-6">
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                  {day.items.map((item) => {
                    const timesWorn = rewearMap[item.id] || 1;
                    return (
                      <div
                        key={item.id}
                        className="group relative rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-3 space-y-2.5 flex flex-col justify-between"
                      >
                        {/* Thumbnail */}
                        <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-slate-200 dark:bg-slate-800">
                          <img
                            src={item.imageUrl}
                            alt={item.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            referrerPolicy="no-referrer"
                          />
                          <span className="absolute top-1.5 left-1.5 px-2 py-0.5 rounded-md bg-slate-950/80 text-white text-[10px] font-bold">
                            {item.category}
                          </span>

                          {/* Rewear Badge */}
                          <div className="absolute bottom-1.5 left-1.5 right-1.5 px-2 py-0.5 rounded-md bg-purple-600/90 text-white text-[9px] font-bold text-center backdrop-blur-sm">
                            Rewearing smartly — {timesWorn}/7 days
                          </div>
                        </div>

                        {/* Title & Attributes */}
                        <div>
                          <h4 className="text-xs font-bold text-slate-900 dark:text-white line-clamp-1">
                            {item.name}
                          </h4>
                          <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
                            {item.color} • {item.style}
                          </p>
                        </div>

                        {/* Replace Single Item Action */}
                        <button
                          type="button"
                          onClick={() =>
                            setReplacingContext({
                              dayId: day.dayId,
                              dayName: day.dayName,
                              item,
                            })
                          }
                          className="w-full py-1.5 rounded-lg bg-slate-200 dark:bg-slate-800 hover:bg-amber-500 hover:text-slate-950 text-slate-700 dark:text-slate-300 text-[10px] font-bold transition-colors flex items-center justify-center space-x-1"
                        >
                          <ArrowRightLeft className="w-3 h-3" />
                          <span>Replace Piece</span>
                        </button>
                      </div>
                    );
                  })}
                </div>

                {/* Styling Rationale Box */}
                <div className="p-4 rounded-2xl bg-amber-500/5 dark:bg-amber-500/10 border border-amber-500/20 flex items-start space-x-3">
                  <Sparkles className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <span className="text-[11px] font-black uppercase tracking-wider text-amber-500 block">
                      Why This Outfit Works
                    </span>
                    <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-normal">
                      {day.stylingTips}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
      </div>

      {/* Item Replacement Modal */}
      {replacingContext && (
        <ItemReplaceModal
          isOpen={Boolean(replacingContext)}
          onClose={() => setReplacingContext(null)}
          dayName={replacingContext.dayName}
          itemToReplace={replacingContext.item}
          availableWardrobe={wardrobe}
          onSelectReplacement={(newItem) => {
            onReplaceItemInDay(replacingContext.dayId, replacingContext.item.id, newItem);
          }}
        />
      )}

      {/* 7-Day Style Blueprint PDF / Report Modal */}
      <StyleBlueprintModal
        isOpen={isBlueprintModalOpen}
        onClose={() => setIsBlueprintModalOpen(false)}
        plan={plan}
        wardrobe={wardrobe}
        profile={profile}
      />

    </div>
  );
};
