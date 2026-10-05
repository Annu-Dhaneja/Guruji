import React, { useState } from 'react';
import { X, Check, Tag } from 'lucide-react';
import { WardrobeClothingItem } from '../../types';

interface ItemReplaceModalProps {
  isOpen: boolean;
  onClose: () => void;
  dayName: string;
  itemToReplace: WardrobeClothingItem | null;
  availableWardrobe: WardrobeClothingItem[];
  onSelectReplacement: (newItem: WardrobeClothingItem) => void;
}

export const ItemReplaceModal: React.FC<ItemReplaceModalProps> = ({
  isOpen,
  onClose,
  dayName,
  itemToReplace,
  availableWardrobe,
  onSelectReplacement,
}) => {
  const [filterCategory, setFilterCategory] = useState<string>('all');

  if (!isOpen || !itemToReplace) return null;

  // Filter candidates: preferably same category or compatible category
  const candidates = availableWardrobe.filter((item) => {
    if (item.id === itemToReplace.id) return false;
    if (filterCategory === 'all') return true;
    return item.category === filterCategory;
  });

  const categories = Array.from(new Set(availableWardrobe.map((i) => i.category)));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden my-8">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h3 className="text-base font-black text-slate-900 dark:text-white">
              Replace Item for {dayName}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Replacing: <span className="font-bold text-amber-500">{itemToReplace.name}</span> ({itemToReplace.category})
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter Pills */}
        <div className="px-6 py-3 border-b border-slate-100 dark:border-slate-800 flex flex-wrap gap-1.5 bg-slate-50 dark:bg-slate-950/50">
          <button
            onClick={() => setFilterCategory('all')}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
              filterCategory === 'all'
                ? 'bg-amber-500 text-slate-950 shadow-sm'
                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
            }`}
          >
            All Items ({availableWardrobe.length})
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                filterCategory === cat
                  ? 'bg-amber-500 text-slate-950 shadow-sm'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Item Selection Grid */}
        <div className="p-6 max-h-[60vh] overflow-y-auto grid grid-cols-2 sm:grid-cols-3 gap-3">
          {candidates.map((item) => (
            <div
              key={item.id}
              onClick={() => {
                onSelectReplacement(item);
                onClose();
              }}
              className="group cursor-pointer rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 hover:border-amber-500 hover:ring-1 hover:ring-amber-500 p-2.5 transition-all flex flex-col justify-between"
            >
              <div className="relative aspect-square rounded-xl overflow-hidden bg-slate-200 dark:bg-slate-800 mb-2">
                <img
                  src={item.imageUrl}
                  alt={item.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  referrerPolicy="no-referrer"
                />
                <span className="absolute bottom-1.5 left-1.5 px-2 py-0.5 rounded-md bg-slate-950/80 text-white text-[10px] font-bold">
                  {item.category}
                </span>
              </div>

              <div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white line-clamp-1">
                  {item.name}
                </h4>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
                  {item.color} • {item.style}
                </p>
              </div>

              <button
                type="button"
                className="mt-2 w-full py-1.5 rounded-lg bg-amber-500/10 text-amber-500 font-bold text-[11px] group-hover:bg-amber-500 group-hover:text-slate-950 transition-colors flex items-center justify-center space-x-1"
              >
                <Check className="w-3 h-3" />
                <span>Select</span>
              </button>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};
