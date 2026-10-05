import React, { useState, useEffect } from 'react';
import {
  X,
  Sparkles,
  Dice5,
  RefreshCw,
  Bookmark,
  Check,
  Zap,
} from 'lucide-react';
import { WardrobeClothingItem } from '../../types';

interface SurpriseMeModalProps {
  isOpen: boolean;
  onClose: () => void;
  wardrobe: WardrobeClothingItem[];
}

export const SurpriseMeModal: React.FC<SurpriseMeModalProps> = ({
  isOpen,
  onClose,
  wardrobe,
}) => {
  const [surpriseLook, setSurpriseLook] = useState<{
    title: string;
    items: WardrobeClothingItem[];
    whyItWorks: string;
    vibeTag: string;
  } | null>(null);
  const [isRolling, setIsRolling] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const generateSurprise = () => {
    if (!wardrobe || wardrobe.length < 2) return;
    setIsRolling(true);
    setIsSaved(false);

    setTimeout(() => {
      const tops = wardrobe.filter((i) => i?.category && ['Shirt', 'T-Shirt', 'Top', 'Kurta', 'Jacket'].includes(i.category));
      const bottoms = wardrobe.filter((i) => i?.category && ['Jeans', 'Trousers', 'Shorts', 'Skirt'].includes(i.category));
      const shoes = wardrobe.filter((i) => i?.category === 'Shoes');
      const accessories = wardrobe.filter((i) => i?.category && ['Watch', 'Bag', 'Accessories'].includes(i.category));

      const randomTop = tops[Math.floor(Math.random() * (tops.length || 1))] || wardrobe[0];
      const randomBottom = bottoms[Math.floor(Math.random() * (bottoms.length || 1))] || wardrobe[1];
      const randomShoe = shoes[Math.floor(Math.random() * (shoes.length || 1))] || wardrobe[2];
      const randomAcc = accessories[Math.floor(Math.random() * (accessories.length || 1))];

      const items = [randomTop, randomBottom, randomShoe, randomAcc].filter(Boolean) as WardrobeClothingItem[];

      const titles = [
        'The Architectural High-Low Contrast',
        'Textured Minimalist Juxtaposition',
        'Effortless Tone-on-Tone Statement',
        'The Smart Off-Duty Re-mix',
      ];
      const vibes = ['Creative Smart', 'Understated Luxe', 'Edgy Minimalist', 'Relaxed Dapper'];

      const topName = randomTop?.name || 'Hero Piece';
      const topColor = randomTop?.color || 'Neutral';
      const bottomName = randomBottom?.name || 'bottoms';
      const bottomColor = randomBottom?.color || 'contrasting tones';

      const whys = [
        `Combining the structure of ${topName} with ${bottomName} creates an unexpected optical balance that feels intentional rather than safe.`,
        `The rich color dialogue between ${topColor} and ${bottomColor} produces clean tonal separation while keeping the silhouette slim.`,
        `Breaks usual outfit habits by anchoring ${topName} with clean footwear for a contemporary fashion-forward energy.`,
      ];

      setSurpriseLook({
        title: titles[Math.floor(Math.random() * titles.length)],
        items,
        whyItWorks: whys[Math.floor(Math.random() * whys.length)],
        vibeTag: vibes[Math.floor(Math.random() * vibes.length)],
      });
      setIsRolling(false);
    }, 400);
  };

  useEffect(() => {
    if (isOpen && !surpriseLook) {
      generateSurprise();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div
        className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden text-slate-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-slate-900/80">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <Dice5 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Surprise Me</h3>
              <p className="text-xs text-slate-400">Creative, out-of-the-box outfit combinations</p>
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
        <div className="p-5 space-y-4 text-xs">
          {surpriseLook ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded-full bg-amber-500/15 text-amber-300 text-[10px] font-bold border border-amber-500/20">
                  ✨ {surpriseLook.vibeTag}
                </span>
                <button
                  onClick={() => setIsSaved(true)}
                  className={`text-[11px] font-semibold px-2.5 py-1 rounded-lg border transition-all flex items-center space-x-1 ${
                    isSaved
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                      : 'bg-slate-800 text-slate-300 border-slate-700 hover:text-white'
                  }`}
                >
                  {isSaved ? <Check className="w-3.5 h-3.5" /> : <Bookmark className="w-3.5 h-3.5" />}
                  <span>{isSaved ? 'Saved to Favorites' : 'Save Look'}</span>
                </button>
              </div>

              <h4 className="text-sm font-bold text-white">{surpriseLook.title}</h4>

              {/* Items display */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {surpriseLook.items.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-2 rounded-xl bg-slate-950 border border-slate-800 flex flex-col items-center text-center space-y-1"
                  >
                    <div className="w-full aspect-square rounded-lg overflow-hidden bg-slate-900">
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <span className="text-[9px] uppercase font-bold text-amber-400 block truncate w-full">
                      {item.category}
                    </span>
                    <p className="text-[10px] text-white font-medium truncate w-full">{item.name}</p>
                  </div>
                ))}
              </div>

              {/* Rationale */}
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <strong className="text-white text-xs block flex items-center space-x-1">
                  <Zap className="w-3.5 h-3.5 text-amber-400" />
                  <span>Why This Unexpected Pairing Works:</span>
                </strong>
                <p className="text-slate-300 text-[11px] leading-relaxed">
                  {surpriseLook.whyItWorks}
                </p>
              </div>
            </div>
          ) : (
            <div className="py-8 text-center text-slate-400">Loading surprise pairing...</div>
          )}

          {/* Roll Again Button */}
          <button
            onClick={generateSurprise}
            disabled={isRolling}
            className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center justify-center space-x-2 shadow-md transition-all disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${isRolling ? 'animate-spin' : ''}`} />
            <span>{isRolling ? 'Mixing Closet Combos...' : 'Roll Another Surprise 🎲'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
