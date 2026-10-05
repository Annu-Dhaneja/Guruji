import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Zap,
  Check,
  Bookmark,
  ArrowRight,
  Sun,
  Cloud,
  CloudRain,
  Snowflake,
  Heart,
  CheckCircle2,
  HelpCircle,
  Lightbulb,
  Layers,
  RotateCcw,
} from 'lucide-react';
import { WardrobeClothingItem } from '../../types';
import { getItemRewearScore, getOnePieceFixSuggestion } from '../../data/wardrobeData';

interface TodayOutfitWidgetProps {
  wardrobe: WardrobeClothingItem[];
  onOpenConsultation: () => void;
  onSaveLook?: (look: any) => void;
  onWearToday?: (items: WardrobeClothingItem[]) => void;
}

export const TodayOutfitWidget: React.FC<TodayOutfitWidgetProps> = ({
  wardrobe,
  onOpenConsultation,
  onSaveLook,
  onWearToday,
}) => {
  // Comfort Mode selector: Comfortable, Smart, Trendy, Traditional
  const [comfortMode, setComfortMode] = useState<'Comfortable' | 'Smart' | 'Trendy' | 'Traditional'>('Smart');
  // Weather selector: Warm, Mild, Cold, Rain
  const [weatherMode, setWeatherMode] = useState<'Warm' | 'Mild' | 'Cold' | 'Rain'>('Warm');

  const [todayLook, setTodayLook] = useState<{
    formulaTitle: string;
    items: WardrobeClothingItem[];
    tip: string;
    weatherBadge: string;
    occasionBadge: string;
    comfortBadge: string;
  } | null>(null);

  const [isGenerating, setIsGenerating] = useState(false);
  const [hasWornToday, setHasWornToday] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const todayDateString = new Date().toLocaleDateString('en-IN', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
  });

  const handleGenerateTodayLook = (mode = comfortMode, weather = weatherMode) => {
    if (!wardrobe || wardrobe.length === 0) return;
    setIsGenerating(true);
    setHasWornToday(false);
    setIsSaved(false);

    setTimeout(() => {
      // Filter based on comfort & weather
      let tops = wardrobe.filter(
        (i) => i.category === 'Top' || i.category === 'Shirt' || i.category === 'T-Shirt' || i.category === 'Kurta' || i.category === 'Dress' || i.category === 'Saree'
      );
      let bottoms = wardrobe.filter(
        (i) => i.category === 'Bottom' || i.category === 'Jeans' || i.category === 'Trousers' || i.category === 'Shorts' || i.category === 'Skirt'
      );
      let shoes = wardrobe.filter((i) => i.category === 'Shoes');
      let layers = wardrobe.filter((i) => i.category === 'Jacket' || i.category === 'Ethnic Wear');
      let accessories = wardrobe.filter((i) => i.category === 'Watch' || i.category === 'Bag' || i.category === 'Accessories');

      let chosenTop: WardrobeClothingItem | undefined;
      let chosenBottom: WardrobeClothingItem | undefined;
      let chosenShoe: WardrobeClothingItem | undefined;
      let chosenLayer: WardrobeClothingItem | undefined;
      let chosenAcc: WardrobeClothingItem | undefined;

      if (mode === 'Traditional') {
        const kurtas = wardrobe.filter((i) => i.category === 'Kurta' || i.category === 'Saree' || i.style === 'Traditional');
        chosenTop = kurtas[0] || tops[0] || wardrobe[0];
        chosenBottom = bottoms.find((b) => b.category === 'Trousers' || b.color === 'White' || b.color === 'Beige') || bottoms[0];
      } else if (mode === 'Comfortable') {
        const softTops = tops.filter((t) => t.category === 'T-Shirt' || t.fit === 'Relaxed' || t.fit === 'Regular');
        chosenTop = softTops[0] || tops[0] || wardrobe[0];
        const softBottoms = bottoms.filter((b) => b.fit === 'Relaxed' || b.category === 'Jeans' || b.category === 'Shorts');
        chosenBottom = softBottoms[0] || bottoms[0] || wardrobe[1];
      } else if (mode === 'Trendy') {
        const trendyTops = tops.filter((t) => t.style === 'Trendy' || t.style === 'Minimal' || t.category === 'T-Shirt');
        chosenTop = trendyTops[0] || tops[0] || wardrobe[0];
        const trendyBottoms = bottoms.filter((b) => b.category === 'Jeans' || b.style === 'Smart Casual');
        chosenBottom = trendyBottoms[0] || bottoms[0] || wardrobe[1];
      } else {
        // Smart
        const smartTops = tops.filter((t) => t.category === 'Shirt' || t.style === 'Classic' || t.style === 'Smart Casual');
        chosenTop = smartTops[0] || tops[0] || wardrobe[0];
        const smartBottoms = bottoms.filter((b) => b.category === 'Trousers' || b.style === 'Minimal');
        chosenBottom = smartBottoms[0] || bottoms[0] || wardrobe[1];
      }

      // Weather-specific adjustments
      if (weather === 'Cold') {
        chosenLayer = layers[0];
        chosenShoe = shoes.find((s) => s.category === 'Shoes') || shoes[0];
      } else if (weather === 'Rain') {
        chosenBottom = bottoms.find((b) => b.color === 'Black' || b.color === 'Navy Blue') || chosenBottom;
        chosenShoe = shoes[0];
      } else {
        chosenShoe = shoes[0] || wardrobe[2];
      }

      chosenAcc = accessories[0];

      const selectedItems = [chosenTop, chosenBottom, chosenLayer, chosenShoe, chosenAcc].filter(Boolean) as WardrobeClothingItem[];

      // Build readable formula title: "White Shirt + Navy Trouser + White Sneakers"
      const mainPieces = [chosenTop?.name, chosenBottom?.name, chosenLayer ? chosenLayer.name : null, chosenShoe?.name]
        .filter(Boolean)
        .slice(0, 3);
      const formulaTitle = mainPieces.join(' + ');

      // Contextual styling tip based on mode & weather
      let tip = `Tuck the ${chosenTop?.name || 'top'} cleanly with rolled cuffs for proportional balance.`;
      let occasionBadge = '💼 Office Ready';
      let comfortBadge = '❤️ High Comfort';
      let weatherBadge = '☀️ Warm Weather';

      if (mode === 'Comfortable') {
        tip = `Pair with breathable natural cotton and cushioned footwear for easy all-day movement.`;
        occasionBadge = '☕ Casual & Daily';
        comfortBadge = '❤️ Maximum Comfort';
      } else if (mode === 'Trendy') {
        tip = `Wear untucked with relaxed drape and clean minimalist sneakers for modern style.`;
        occasionBadge = '✨ Weekend & Social';
        comfortBadge = '⚖️ Relaxed Fit';
      } else if (mode === 'Traditional') {
        tip = `Pair with clean neutral bottoms and classic slip-on footwear for graceful Indian aesthetic.`;
        occasionBadge = '🪷 Cultural & Festive';
        comfortBadge = '❤️ Ultra Breathable';
      } else {
        // Smart
        tip = `Sharp collar styling paired with structured trousers for confident, polished presence.`;
        occasionBadge = '💼 Office & Meeting';
        comfortBadge = '🌟 Structured Polish';
      }

      if (weather === 'Cold') weatherBadge = '❄️ Layered Cold';
      else if (weather === 'Rain') weatherBadge = '🌦️ Rain Practical';
      else if (weather === 'Mild') weatherBadge = '⛅ Mild Casual';

      setTodayLook({
        formulaTitle,
        items: selectedItems,
        tip,
        weatherBadge,
        occasionBadge,
        comfortBadge,
      });
      setIsGenerating(false);
    }, 200);
  };

  // Generate on initial load
  useEffect(() => {
    if (wardrobe.length > 0 && !todayLook) {
      handleGenerateTodayLook('Smart', 'Warm');
    }
  }, [wardrobe]);

  // Compute One-Piece Fix for the current look
  const onePieceFix = todayLook ? getOnePieceFixSuggestion(todayLook.items, wardrobe) : null;

  const handleWearThisToday = () => {
    setHasWornToday(true);
    if (onWearToday && todayLook) {
      onWearToday(todayLook.items);
    }
  };

  return (
    <div id="today-outfit-widget" className="rounded-3xl bg-slate-900 border border-amber-500/30 p-5 sm:p-6 shadow-xl relative overflow-hidden">
      {/* Subtle background glow */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Header Row: Title & Date */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center space-x-2">
            <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-400 text-xs font-black uppercase tracking-wider">
              <Zap className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
              <span>TODAY'S LOOK</span>
            </span>
            <span className="text-xs text-slate-400 font-medium">{todayDateString}</span>
          </div>
          <p className="text-xs text-slate-300 mt-1">
            Tailored combination made 100% from your existing clothes. Wear again, wear better.
          </p>
        </div>

        {/* Shuffle / Roll Button */}
        <div className="flex items-center space-x-2">
          <button
            id="roll-today-look-btn"
            onClick={() => handleGenerateTodayLook(comfortMode, weatherMode)}
            disabled={isGenerating || wardrobe.length === 0}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white font-bold text-xs flex items-center space-x-1.5 transition-all border border-slate-700"
            title="Generate another combination"
          >
            <RotateCcw className={`w-3.5 h-3.5 text-amber-400 ${isGenerating ? 'animate-spin' : ''}`} />
            <span>Roll Another Look</span>
          </button>
        </div>
      </div>

      {/* Interactive Selectors: Comfort Mode & Weather Look */}
      <div className="py-3.5 grid grid-cols-1 md:grid-cols-2 gap-3 border-b border-slate-800 text-xs">
        {/* Comfort Mode (What matters today?) */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-2">
          <span className="font-bold text-slate-400 shrink-0 flex items-center space-x-1">
            <Heart className="w-3.5 h-3.5 text-rose-400" />
            <span>Comfort Mode:</span>
          </span>
          <div className="flex flex-wrap gap-1.5">
            {(['Comfortable', 'Smart', 'Trendy', 'Traditional'] as const).map((mode) => (
              <button
                key={mode}
                id={`comfort-mode-${mode.toLowerCase()}`}
                onClick={() => {
                  setComfortMode(mode);
                  handleGenerateTodayLook(mode, weatherMode);
                }}
                className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                  comfortMode === mode
                    ? 'bg-amber-500 text-slate-950 shadow-md'
                    : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                {mode === 'Comfortable' && '❤️ '}
                {mode === 'Smart' && '💼 '}
                {mode === 'Trendy' && '✨ '}
                {mode === 'Traditional' && '🪷 '}
                {mode}
              </button>
            ))}
          </div>
        </div>

        {/* Weather Look */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 md:justify-end">
          <span className="font-bold text-slate-400 shrink-0 flex items-center space-x-1">
            <Sun className="w-3.5 h-3.5 text-amber-400" />
            <span>Weather Look:</span>
          </span>
          <div className="flex flex-wrap gap-1.5">
            {(
              [
                { id: 'Warm', label: '☀️ Warm' },
                { id: 'Mild', label: '⛅ Mild' },
                { id: 'Cold', label: '❄️ Cold' },
                { id: 'Rain', label: '🌦️ Rain' },
              ] as const
            ).map((w) => (
              <button
                key={w.id}
                id={`weather-mode-${w.id.toLowerCase()}`}
                onClick={() => {
                  setWeatherMode(w.id);
                  handleGenerateTodayLook(comfortMode, w.id);
                }}
                className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                  weatherMode === w.id
                    ? 'bg-cyan-500 text-slate-950 shadow-md'
                    : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                {w.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Today's Look Display */}
      {todayLook ? (
        <div className="pt-4 space-y-4">
          {/* Formula Heading & Badges */}
          <div className="space-y-2">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <h3 className="text-sm sm:text-base font-black text-white flex items-center space-x-2">
                <span className="text-amber-400 font-bold">Outfit:</span>
                <span className="text-slate-100">{todayLook.formulaTitle}</span>
              </h3>

              {/* Action Buttons */}
              <div className="flex items-center space-x-2 shrink-0">
                {/* Wear This Today Button */}
                <button
                  id="wear-this-today-btn"
                  onClick={handleWearThisToday}
                  className={`px-3.5 py-1.5 rounded-xl font-bold text-xs flex items-center space-x-1.5 transition-all shadow-md ${
                    hasWornToday
                      ? 'bg-emerald-500 text-slate-950 font-black'
                      : 'bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-slate-950'
                  }`}
                >
                  {hasWornToday ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-slate-950" />
                      <span>Wearing This Today! ✓</span>
                    </>
                  ) : (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Wear This Today</span>
                    </>
                  )}
                </button>

                {/* Save Look Button */}
                <button
                  id="save-today-look-btn"
                  onClick={() => {
                    setIsSaved(true);
                    if (onSaveLook) {
                      onSaveLook({
                        id: `today-look-${Date.now()}`,
                        title: todayLook.formulaTitle,
                        stylingTip: todayLook.tip,
                        items: todayLook.items,
                        createdAt: new Date().toISOString(),
                      });
                    }
                  }}
                  className={`p-2 rounded-xl text-xs border transition-all ${
                    isSaved
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                      : 'bg-slate-800 text-slate-300 border-slate-700 hover:text-white'
                  }`}
                  title="Save look to favorites"
                >
                  {isSaved ? <Check className="w-3.5 h-3.5" /> : <Bookmark className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            {/* 3 Key Badges: Weather, Occasion, Comfort */}
            <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
              <span className="px-2.5 py-0.5 rounded-md bg-slate-950 text-slate-300 border border-slate-800 font-semibold">
                {todayLook.weatherBadge}
              </span>
              <span className="px-2.5 py-0.5 rounded-md bg-slate-950 text-slate-300 border border-slate-800 font-semibold">
                {todayLook.occasionBadge}
              </span>
              <span className="px-2.5 py-0.5 rounded-md bg-slate-950 text-amber-400/90 border border-amber-500/30 font-semibold">
                {todayLook.comfortBadge}
              </span>
            </div>

            {/* 1-Line Styling Tip */}
            <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800/90 text-xs text-slate-300 flex items-start space-x-2">
              <Lightbulb className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <span>
                <strong className="text-amber-400 font-bold">Styling Tip: </strong>
                {todayLook.tip}
              </span>
            </div>
          </div>

          {/* Outfit Items Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {todayLook.items.map((item, idx) => {
              const rewear = getItemRewearScore(item, wardrobe);
              return (
                <div
                  key={idx}
                  className="p-2.5 rounded-2xl bg-slate-950 border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-slate-900">
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                      <span className="absolute top-1.5 left-1.5 px-2 py-0.5 rounded-md bg-slate-950/85 text-amber-400 text-[9px] font-black uppercase tracking-wider">
                        {item.category}
                      </span>
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white truncate">{item.name}</h4>
                      <p className="text-[10px] text-slate-400 truncate">
                        {item.color} • {item.style}
                      </p>
                    </div>
                  </div>

                  {/* Rewear Score Badge on Item */}
                  <div className="mt-2 pt-2 border-t border-slate-900 flex items-center justify-between text-[10px]">
                    <span className="text-purple-400 font-bold">Rewear: {rewear.score}/5</span>
                    <span className="text-slate-500">{rewear.looksCount} looks</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* One-Piece Fix Highlight Box */}
          {onePieceFix && (
            <div className="p-3.5 rounded-2xl bg-gradient-to-r from-amber-500/10 via-slate-900 to-slate-950 border border-amber-500/25 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 text-xs">
              <div className="flex items-start space-x-2.5">
                <div className="w-7 h-7 rounded-lg bg-amber-500/20 border border-amber-500/40 text-amber-400 flex items-center justify-center shrink-0 mt-0.5">
                  <Sparkles className="w-3.5 h-3.5" />
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-black text-amber-400 uppercase tracking-wider text-[10px]">
                      ONE-PIECE FIX
                    </span>
                    <span className="text-[10px] text-emerald-400 font-bold">
                      {onePieceFix.percentage}% Complete
                    </span>
                  </div>
                  <p className="text-slate-300 text-xs mt-0.5">{onePieceFix.suggestionText}</p>
                </div>
              </div>

              <div className="shrink-0 flex items-center space-x-2">
                <span className="px-3 py-1 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold">
                  Missing Piece: {onePieceFix.missingPiece}
                </span>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-400">
          <p>
            Tap <strong className="text-amber-400">“Roll Another Look”</strong> to get a quick outfit matching your day.
          </p>
          <button
            id="try-cloth-consult-link"
            onClick={onOpenConsultation}
            className="text-amber-400 hover:text-amber-300 font-semibold flex items-center space-x-1"
          >
            <span>Going somewhere specific? Try Full Consultation</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      )}
    </div>
  );
};

