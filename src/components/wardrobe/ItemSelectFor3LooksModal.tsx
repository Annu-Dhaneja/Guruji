import React from 'react';
import { X, Sparkles, Shirt } from 'lucide-react';
import { WardrobeClothingItem } from '../../types';

interface ItemSelectFor3LooksModalProps {
  isOpen: boolean;
  onClose: () => void;
  wardrobe: WardrobeClothingItem[];
  onSelectItem: (item: WardrobeClothingItem) => void;
}

export const ItemSelectFor3LooksModal: React.FC<ItemSelectFor3LooksModalProps> = ({
  isOpen,
  onClose,
  wardrobe,
  onSelectItem,
}) => {
  if (!isOpen) return null;

  return (
    <div
      id="item-select-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl p-5 space-y-4 max-h-[85vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div>
            <h3 className="text-base font-bold text-white flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Select an Item to Style 3 Ways</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Choose any piece from your closet to see 3 distinct outfits.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="overflow-y-auto no-scrollbar grid grid-cols-2 sm:grid-cols-3 gap-3 flex-1">
          {wardrobe.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                onSelectItem(item);
                onClose();
              }}
              className="p-2.5 rounded-xl bg-slate-950 hover:bg-slate-800/80 border border-slate-800/80 hover:border-amber-500/50 text-left transition-all group flex flex-col space-y-2"
            >
              <div className="aspect-square w-full rounded-lg overflow-hidden bg-slate-900">
                <img
                  src={item.imageUrl}
                  alt={item.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div>
                <p className="text-xs font-bold text-white truncate group-hover:text-amber-400">
                  {item.name}
                </p>
                <p className="text-[10px] text-slate-400">
                  {item.color} • {item.category}
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
