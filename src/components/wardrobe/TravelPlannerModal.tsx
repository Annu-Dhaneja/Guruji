import React, { useState } from 'react';
import {
  X,
  Plane,
  Sparkles,
  Luggage,
  Calendar,
  Sun,
  CloudRain,
  MapPin,
  Check,
  Layers,
  Globe,
  RefreshCw,
  Bookmark,
  Share2,
} from 'lucide-react';
import { WardrobeClothingItem, TravelPlannerInput, TravelPlan } from '../../types';
import { generateLocalTravelPlan } from '../../data/wardrobeData';

interface TravelPlannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  wardrobe: WardrobeClothingItem[];
}

export const TravelPlannerModal: React.FC<TravelPlannerModalProps> = ({
  isOpen,
  onClose,
  wardrobe,
}) => {
  const [input, setInput] = useState<TravelPlannerInput>({
    destination: 'Goa / Coastal Getaway',
    durationDays: 4,
    tripPurpose: 'Vacation & Beach',
    packingConstraint: 'Carry-On Only (Under 10 pieces)',
    language: 'Hinglish',
  });

  const [isLoading, setIsLoading] = useState(false);
  const [travelPlan, setTravelPlan] = useState<TravelPlan | null>(null);
  const [activeTab, setActiveTab] = useState<'packingList' | 'dayOutfits'>('packingList');

  if (!isOpen) return null;

  const handleGeneratePlan = async (lang = input.language || 'Hinglish') => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/wardrobe/travel-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          input: { ...input, language: lang },
          items: wardrobe,
        }),
      });

      const data = await res.json();
      if (data.success && data.travelPlan) {
        setTravelPlan(data.travelPlan);
      } else {
        const local = generateLocalTravelPlan(input, wardrobe);
        setTravelPlan(local);
      }
    } catch (e) {
      console.warn('Fallback to local travel planner:', e);
      const local = generateLocalTravelPlan(input, wardrobe);
      setTravelPlan(local);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLanguageChange = (lang: 'Hinglish' | 'Hindi' | 'English') => {
    setInput((prev) => ({ ...prev, language: lang }));
    if (travelPlan) {
      handleGeneratePlan(lang);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-4xl max-h-[92vh] bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col my-auto">
        {/* Header */}
        <div className="p-5 sm:p-6 bg-gradient-to-r from-teal-500/15 via-emerald-500/10 to-blue-500/15 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-teal-400 to-emerald-600 flex items-center justify-center text-slate-950 shadow-lg shadow-teal-500/20 font-black">
              <Plane className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-teal-400">
                  Smart Capsule Travel
                </span>
                <span className="px-2 py-0.5 rounded-full bg-teal-500/20 text-teal-300 text-[10px] font-bold">
                  Pack Light • Mix & Match
                </span>
              </div>
              <h3 className="text-lg sm:text-xl font-black text-white">
                Travel Outfit & Packing Planner
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
                    input.language === lang
                      ? 'bg-teal-500 text-slate-950 shadow-sm'
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
        <div className="p-5 sm:p-7 overflow-y-auto space-y-6 flex-1">
          {/* Destination & Parameters Input Bar */}
          <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1">
                  Destination / Climate
                </label>
                <div className="relative">
                  <MapPin className="w-3.5 h-3.5 text-teal-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    value={input.destination}
                    onChange={(e) => setInput((prev) => ({ ...prev, destination: e.target.value }))}
                    placeholder="e.g. Goa, Manali, London, Dubai..."
                    className="w-full pl-8 pr-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs focus:outline-none focus:border-teal-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1">
                  Duration (Days)
                </label>
                <div className="grid grid-cols-4 gap-1">
                  {[3, 4, 5, 7].map((d) => (
                    <button
                      key={d}
                      onClick={() => setInput((prev) => ({ ...prev, durationDays: d }))}
                      className={`py-2 rounded-xl text-xs font-bold transition-all ${
                        input.durationDays === d
                          ? 'bg-teal-500 text-slate-950 font-black'
                          : 'bg-slate-900 text-slate-300 hover:bg-slate-800'
                      }`}
                    >
                      {d} Days
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1">Trip Purpose</label>
                <select
                  value={input.tripPurpose}
                  onChange={(e) => setInput((prev) => ({ ...prev, tripPurpose: e.target.value }))}
                  className="w-full py-2 px-3 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs focus:outline-none focus:border-teal-500"
                >
                  <option value="Vacation & Beach">Vacation & Beach</option>
                  <option value="Work Conference / Corporate">Work Conference</option>
                  <option value="Sightseeing & Walking Tour">Sightseeing & Walking</option>
                  <option value="Wedding / Family Event">Wedding / Family Event</option>
                  <option value="Cold Weather / Hill Station">Cold Weather / Mountains</option>
                </select>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-2 border-t border-slate-900">
              <span className="text-xs text-slate-400">
                AI selects the highest-versatility capsule pieces from your existing closet.
              </span>

              <button
                onClick={() => handleGeneratePlan()}
                disabled={isLoading}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-teal-400 to-emerald-500 text-slate-950 font-black text-xs flex items-center space-x-1.5 shadow-lg shadow-teal-500/20 hover:brightness-110 transition-all flex-shrink-0 disabled:opacity-50"
              >
                <Sparkles className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
                <span>{travelPlan ? 'Regenerate Capsule' : 'Generate Packing Capsule'}</span>
              </button>
            </div>
          </div>

          {/* Loading state */}
          {isLoading && (
            <div className="py-16 text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-teal-500/20 text-teal-400 flex items-center justify-center mx-auto animate-spin">
                <Plane className="w-6 h-6" />
              </div>
              <p className="text-white font-bold text-sm">
                Optimizing minimal {input.durationDays}-day capsule for {input.destination}...
              </p>
              <p className="text-xs text-slate-400">
                Minimizing luggage weight while multiplying daily outfit combinations.
              </p>
            </div>
          )}

          {/* Travel Plan Result */}
          {!isLoading && travelPlan && (
            <div className="space-y-6">
              {/* Summary Card */}
              <div className="p-4 rounded-2xl bg-teal-950/30 border border-teal-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="px-2 py-0.5 rounded-full bg-teal-500/20 text-teal-300 text-[10px] font-bold">
                      Capsule Strategy
                    </span>
                    <h4 className="text-sm font-black text-white">{travelPlan.tripSummary}</h4>
                  </div>
                  <p className="text-xs text-teal-400/90 font-medium mt-1">
                    {travelPlan.weatherNotes}
                  </p>
                </div>

                {/* Sub Tab Switcher */}
                <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800 flex-shrink-0">
                  <button
                    onClick={() => setActiveTab('packingList')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      activeTab === 'packingList'
                        ? 'bg-teal-500 text-slate-950 font-black'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    🎒 Packing List ({travelPlan.packingList?.length || 0})
                  </button>
                  <button
                    onClick={() => setActiveTab('dayOutfits')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      activeTab === 'dayOutfits'
                        ? 'bg-teal-500 text-slate-950 font-black'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    🗓️ Day-by-Day Looks
                  </button>
                </div>
              </div>

              {/* View 1: Packing List */}
              {activeTab === 'packingList' && (
                <div className="space-y-4">
                  <h5 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center space-x-1.5">
                    <Luggage className="w-3.5 h-3.5 text-teal-400" />
                    <span>Exact Closet Pieces to Pack in Your Bag</span>
                  </h5>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {travelPlan.packingList?.map((item, idx) => (
                      <div
                        key={idx}
                        className="p-3 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col justify-between"
                      >
                        <div className="aspect-square rounded-xl overflow-hidden mb-2 bg-slate-900">
                          <img
                            src={item.imageUrl}
                            alt={item.name}
                            className="w-full h-full object-cover"
                            referrerPolicy="no-referrer"
                          />
                        </div>
                        <div>
                          <span className="text-[9px] font-bold uppercase text-teal-400 bg-teal-500/10 px-1.5 py-0.5 rounded">
                            {item.category}
                          </span>
                          <p className="text-xs font-bold text-white mt-1 line-clamp-1">
                            {item.name}
                          </p>
                          <p className="text-[10px] text-slate-400 truncate">{item.color}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Travel Packing Tips */}
                  {travelPlan.packingTips && travelPlan.packingTips.length > 0 && (
                    <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
                      <h6 className="text-xs font-black uppercase tracking-wider text-teal-400 mb-2">
                        Luggage Optimization Tips ({input.language})
                      </h6>
                      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-300">
                        {travelPlan.packingTips.map((tip, i) => (
                          <li key={i} className="flex items-start space-x-1.5">
                            <span className="text-teal-400 font-bold">•</span>
                            <span>{tip}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}

              {/* View 2: Day-by-Day Looks */}
              {activeTab === 'dayOutfits' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {travelPlan.dayOutfits?.map((dOutfit, idx) => (
                      <div
                        key={idx}
                        className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3 flex flex-col justify-between"
                      >
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs font-black text-teal-400 uppercase">
                              Day {dOutfit.dayNumber}: {dOutfit.dayTitle}
                            </span>
                            <span className="text-[10px] text-slate-400 bg-slate-900 px-2 py-0.5 rounded">
                              {dOutfit.activity}
                            </span>
                          </div>
                          <p className="text-xs text-slate-300 italic">{dOutfit.stylingTip}</p>
                        </div>

                        {/* Items in this look */}
                        <div className="flex items-center space-x-2 overflow-x-auto pt-2 border-t border-slate-900">
                          {dOutfit.items?.map((it, iIdx) => (
                            <div
                              key={iIdx}
                              className="w-12 h-12 rounded-xl overflow-hidden bg-slate-900 flex-shrink-0 border border-slate-800"
                              title={it.name}
                            >
                              <img
                                src={it.imageUrl}
                                alt={it.name}
                                className="w-full h-full object-cover"
                                referrerPolicy="no-referrer"
                              />
                            </div>
                          ))}
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
          <span>💡 Packing capsules reduce baggage fees & eliminate morning decision fatigue.</span>
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
