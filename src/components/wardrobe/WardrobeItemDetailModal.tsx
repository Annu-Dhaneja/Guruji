import React from 'react';
import {
  X,
  Heart,
  Sparkles,
  Edit3,
  Trash2,
  Tag,
  Calendar,
  Layers,
  CheckCircle2,
  RefreshCw,
  Droplet,
} from 'lucide-react';
import { WardrobeClothingItem } from '../../types';

interface WardrobeItemDetailModalProps {
  item: WardrobeClothingItem | null;
  isOpen: boolean;
  onClose: () => void;
  onToggleFavourite: (id: string) => void;
  onEdit: (item: WardrobeClothingItem) => void;
  onDelete: (id: string) => void;
  onStyle3Ways: (item: WardrobeClothingItem) => void;
  rewearCount?: number;
}

export const WardrobeItemDetailModal: React.FC<WardrobeItemDetailModalProps> = ({
  item,
  isOpen,
  onClose,
  onToggleFavourite,
  onEdit,
  onDelete,
  onStyle3Ways,
  rewearCount = 0,
}) => {
  if (!isOpen || !item) return null;

  return (
    <div
      id="wardrobe-item-detail-modal"
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-sm animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg rounded-t-3xl sm:rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold">
              {item.category}
            </span>
            {item.isFavourite && (
              <span className="px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 text-[11px] font-semibold flex items-center space-x-1">
                <Heart className="w-3 h-3 fill-current" />
                <span>Favourite</span>
              </span>
            )}
          </div>

          <div className="flex items-center space-x-1">
            <button
              id="item-detail-fav-btn"
              onClick={() => onToggleFavourite(item.id)}
              className={`p-2 rounded-xl border transition-all ${
                item.isFavourite
                  ? 'bg-rose-500/20 text-rose-400 border-rose-500/30'
                  : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-white'
              }`}
              title="Toggle Favourite"
            >
              <Heart className={`w-4 h-4 ${item.isFavourite ? 'fill-current' : ''}`} />
            </button>
            <button
              id="item-detail-close-btn"
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white border border-slate-700 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5 no-scrollbar">
          {/* Main Image */}
          <div className="relative aspect-[4/3] w-full rounded-2xl overflow-hidden bg-slate-950 border border-slate-800">
            <img
              src={item.imageUrl}
              alt={item.name}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src =
                  'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=600&q=80';
              }}
            />
            {rewearCount > 0 && (
              <div className="absolute bottom-3 left-3 px-3 py-1 rounded-xl bg-purple-600/90 backdrop-blur-md text-white text-xs font-bold flex items-center space-x-1.5 shadow-md">
                <RefreshCw className="w-3.5 h-3.5 text-cyan-300" />
                <span>Worn in {rewearCount} looks this week</span>
              </div>
            )}
          </div>

          {/* Title & Notes */}
          <div>
            <h3 className="text-xl font-black text-white">{item.name}</h3>
            {item.notes && (
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">{item.notes}</p>
            )}
          </div>

          {/* Attributes Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs">
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/80">
              <span className="text-[10px] uppercase font-bold text-slate-500 block">Color</span>
              <span className="font-semibold text-slate-200 mt-0.5 block">{item.color}</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/80">
              <span className="text-[10px] uppercase font-bold text-slate-500 block">Style</span>
              <span className="font-semibold text-slate-200 mt-0.5 block">{item.style}</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/80">
              <span className="text-[10px] uppercase font-bold text-slate-500 block">Fit</span>
              <span className="font-semibold text-slate-200 mt-0.5 block">{item.fit || 'Regular'}</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/80">
              <span className="text-[10px] uppercase font-bold text-slate-500 block">Season</span>
              <span className="font-semibold text-slate-200 mt-0.5 block">
                {item.season || 'All Season'}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/80">
              <span className="text-[10px] uppercase font-bold text-slate-500 block">Status</span>
              <span
                className={`font-semibold mt-0.5 block ${
                  item.status === 'Laundry' ? 'text-amber-400' : 'text-emerald-400'
                }`}
              >
                {item.status || 'Ready in Closet'}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/80">
              <span className="text-[10px] uppercase font-bold text-slate-500 block">Category</span>
              <span className="font-semibold text-slate-200 mt-0.5 block">{item.category}</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="p-4 sm:p-5 border-t border-slate-800 bg-slate-950/80 flex flex-col sm:flex-row gap-2.5">
          <button
            id="item-detail-style-btn"
            onClick={() => {
              onClose();
              onStyle3Ways(item);
            }}
            className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-500 hover:to-amber-700 text-slate-950 font-black text-xs sm:text-sm flex items-center justify-center space-x-2 shadow-lg shadow-amber-500/20 transition-all"
          >
            <Sparkles className="w-4 h-4" />
            <span>✨ Style Me (3 Ways)</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              id="item-detail-edit-btn"
              onClick={() => {
                onClose();
                onEdit(item);
              }}
              className="flex-1 sm:flex-none py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs flex items-center justify-center space-x-1.5 border border-slate-700 transition-colors"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Edit</span>
            </button>

            <button
              id="item-detail-delete-btn"
              onClick={() => {
                onClose();
                onDelete(item.id);
              }}
              className="py-3 px-4 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 font-bold text-xs flex items-center justify-center space-x-1.5 border border-rose-500/30 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Delete</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
