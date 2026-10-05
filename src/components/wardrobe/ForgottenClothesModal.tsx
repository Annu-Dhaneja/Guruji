import React, { useState } from 'react';
import {
  X,
  Sparkles,
  Clock,
  Check,
  Repeat,
} from 'lucide-react';
import { WardrobeClothingItem } from '../../types';
import { getForgottenItems, getItemRewearScore } from '../../data/wardrobeData';

interface ForgottenClothesModalProps {
  isOpen: boolean;
  onClose: () => void;
  wardrobe: WardrobeClothingItem[];
}

export const ForgottenClothesModal: React.FC<ForgottenClothesModalProps> = ({
  isOpen,
  onClose,
  wardrobe,
}) => {
  const forgottenItems = getForgottenItems(wardrobe, 4);
  const [selectedForgottenItem, setSelectedForgottenItem] = useState<WardrobeClothingItem | null>(null);
  const [savedLookIdx, setSavedLookIdx] = useState<number | null>(null);

  if (!isOpen) return null;

  const currentItem = selectedForgottenItem || forgottenItems[0] || wardrobe[0];
  const rewear = currentItem ? getItemRewearScore(currentItem) : { score: 4, looksCount: 5 };

  const revivalLooks = [
    {
      title: 'Smart Office Layering',
      pairingItems: wardrobe.filter((i) => i.id !== currentItem?.id).slice(0, 2),
      tip: `Anchor ${currentItem?.name || 'this piece'} with clean dark trousers and minimalist footwear for effortless professional contrast.`,
    },
    {
      title: 'Relaxed Weekend Off-Duty',
      pairingItems: wardrobe.filter((i) => i.id !== currentItem?.id).slice(2, 4),
      tip: `Unbutton slightly or roll the sleeves for an effortless, casual silhouette.`,
    },
    {
      title: 'Elevated Dinner Styling',
      pairingItems: wardrobe.filter((i) => i.id !== currentItem?.id).slice(4, 6),
      tip: `Add statement watch or structured outer layer to transform daywear into nighttime polish.`,
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div
        className="w-full max-w-xl max-h-[90vh] bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden text-slate-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-slate-900/80">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Forgotten Clothes (Bring Them Back)</h3>
              <p className="text-xs text-slate-400">
                You haven&apos;t worn these {forgottenItems.length} pieces recently
              </p>
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
        <div className="p-5 overflow-y-auto space-y-4 text-xs">
          {/* Banner message */}
          <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 flex items-center space-x-2 font-medium">
            <Sparkles className="w-4 h-4 shrink-0 text-amber-400" />
            <span>
              You haven&apos;t worn these {forgottenItems.length} pieces recently. Click below to create a fresh new look!
            </span>
          </div>

          {/* Selector of Forgotten Items */}
          <div>
            <label className="font-semibold text-slate-300 block mb-2">
              Select Forgotten Item to Revive:
            </label>
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
              {forgottenItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setSelectedForgottenItem(item)}
                  className={`p-1.5 rounded-xl border transition-all text-center group ${
                    currentItem?.id === item.id
                      ? 'border-amber-400 bg-slate-800 ring-1 ring-amber-400'
                      : 'border-slate-800 bg-slate-950 hover:border-slate-700'
                  }`}
                >
                  <div className="w-full aspect-square rounded-lg overflow-hidden bg-slate-900 mb-1">
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <p className="text-[10px] font-bold text-slate-200 truncate">{item.name}</p>
                  <p className="text-[9px] text-amber-400 font-semibold">{item.category}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Selected Item Summary Card */}
          {currentItem && (
            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <img
                  src={currentItem.imageUrl}
                  alt={currentItem.name}
                  className="w-12 h-12 rounded-lg object-cover border border-slate-800"
                  referrerPolicy="no-referrer"
                />
                <div>
                  <h4 className="font-bold text-white text-xs">{currentItem.name}</h4>
                  <p className="text-[10px] text-slate-400">
                    {currentItem.category} • {currentItem.color} • {currentItem.style}
                  </p>
                  <p className="text-[10px] text-purple-300 font-semibold flex items-center space-x-1 mt-0.5">
                    <Repeat className="w-2.5 h-2.5" />
                    <span>Rewear Score: {rewear.score}/5 • Can create {rewear.looksCount} looks</span>
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* 3 New Revival Looks */}
          <div className="space-y-3">
            <h4 className="font-bold text-slate-200 flex items-center space-x-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>3 Fresh Outfits for {currentItem?.name || 'This Item'}:</span>
            </h4>

            {revivalLooks.map((look, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2 hover:border-slate-700 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-amber-400 text-xs">{look.title}</span>
                  <button
                    onClick={() => {
                      setSavedLookIdx(idx);
                      setTimeout(() => setSavedLookIdx(null), 2500);
                    }}
                    className={`px-3 py-1 rounded-lg font-bold text-[11px] flex items-center space-x-1 transition-all ${
                      savedLookIdx === idx
                        ? 'bg-emerald-500 text-slate-950'
                        : 'bg-amber-500 hover:bg-amber-400 text-slate-950'
                    }`}
                  >
                    {savedLookIdx === idx ? (
                      <>
                        <Check className="w-3 h-3" />
                        <span>Ready to Wear</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-3 h-3" />
                        <span>Create New Look</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="flex items-center space-x-2">
                  <div className="flex -space-x-2">
                    <img
                      src={currentItem?.imageUrl}
                      alt={currentItem?.name}
                      className="w-9 h-9 rounded-lg object-cover border-2 border-slate-900"
                      referrerPolicy="no-referrer"
                    />
                    {look.pairingItems.map((pi) => (
                      <img
                        key={pi.id}
                        src={pi.imageUrl}
                        alt={pi.name}
                        className="w-9 h-9 rounded-lg object-cover border-2 border-slate-900"
                        referrerPolicy="no-referrer"
                      />
                    ))}
                  </div>
                  <div className="text-[11px] text-slate-300 pl-1 leading-snug">
                    {currentItem?.name} + {look.pairingItems.map((p) => p.name).join(' + ')}
                  </div>
                </div>

                <p className="text-[10px] text-slate-400 leading-relaxed bg-slate-900 p-2 rounded-lg">
                  💡 {look.tip}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="p-3.5 border-t border-slate-800 bg-slate-900/80 flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
