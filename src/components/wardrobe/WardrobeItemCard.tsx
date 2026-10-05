import React, { useState } from 'react';
import { Heart, MoreVertical, Sparkles, Edit3, Trash2, Repeat } from 'lucide-react';
import { WardrobeClothingItem } from '../../types';
import { getItemRewearScore } from '../../data/wardrobeData';

interface WardrobeItemCardProps {
  item: WardrobeClothingItem;
  rewearCount?: number;
  onToggleFavourite: (id: string) => void;
  onEdit: (item: WardrobeClothingItem) => void;
  onDelete: (id: string) => void;
  onStyle3Ways?: (item: WardrobeClothingItem) => void;
  onOpenDetail?: (item: WardrobeClothingItem) => void;
  compact?: boolean;
}

export const WardrobeItemCard: React.FC<WardrobeItemCardProps> = ({
  item,
  rewearCount = 0,
  onToggleFavourite,
  onEdit,
  onDelete,
  onStyle3Ways,
  onOpenDetail,
  compact = false,
}) => {
  const [showMenu, setShowMenu] = useState(false);

  const handleCardClick = () => {
    if (onOpenDetail) {
      onOpenDetail(item);
    }
  };

  // Build clean 2-3 tags
  const tags = [item.color, item.style, item.category].filter(Boolean).slice(0, 3);
  const rewear = getItemRewearScore(item);

  return (
    <div
      id={`wardrobe-item-card-${item.id}`}
      onClick={handleCardClick}
      className="group relative cursor-pointer rounded-2xl bg-slate-900/90 hover:bg-slate-900 border border-slate-800/80 hover:border-slate-700 shadow-sm hover:shadow-lg transition-all duration-200 overflow-hidden flex flex-col justify-between"
    >
      {/* Image & Overlay Controls */}
      <div className="relative aspect-[4/3] w-full bg-slate-950 overflow-hidden">
        <img
          src={item.imageUrl}
          alt={item.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          referrerPolicy="no-referrer"
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).src =
              'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=600&q=80';
          }}
        />

        {/* Favorite Heart Button */}
        <button
          id={`fav-btn-${item.id}`}
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavourite(item.id);
          }}
          className={`absolute top-2 left-2 p-1.5 rounded-full backdrop-blur-md transition-all shadow-sm ${
            item.isFavourite
              ? 'bg-rose-500 text-white'
              : 'bg-black/40 text-slate-300 hover:text-white hover:bg-black/70'
          }`}
          title={item.isFavourite ? 'Unfavourite' : 'Favourite'}
        >
          <Heart className={`w-3.5 h-3.5 ${item.isFavourite ? 'fill-current' : ''}`} />
        </button>

        {/* Category Pill */}
        <div className="absolute top-2 left-10 px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-md text-amber-400 text-[10px] font-bold">
          {item.category}
        </div>

        {/* More Menu (⋮) */}
        <div className="absolute top-2 right-2">
          <button
            id={`menu-btn-${item.id}`}
            onClick={(e) => {
              e.stopPropagation();
              setShowMenu(!showMenu);
            }}
            className="p-1.5 rounded-full bg-black/40 hover:bg-black/70 backdrop-blur-md text-slate-300 hover:text-white transition-all shadow-sm"
            title="More options"
          >
            <MoreVertical className="w-3.5 h-3.5" />
          </button>

          {showMenu && (
            <div
              className="absolute right-0 top-8 z-30 w-36 rounded-xl bg-slate-900 border border-slate-800 shadow-xl py-1 text-xs text-slate-200 animate-fadeIn"
              onClick={(e) => e.stopPropagation()}
            >
              {onStyle3Ways && (
                <button
                  onClick={() => {
                    setShowMenu(false);
                    onStyle3Ways(item);
                  }}
                  className="w-full px-3 py-2 text-left hover:bg-slate-800 flex items-center space-x-2 text-amber-400 font-semibold"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Style 3 Ways</span>
                </button>
              )}
              <button
                onClick={() => {
                  setShowMenu(false);
                  onEdit(item);
                }}
                className="w-full px-3 py-2 text-left hover:bg-slate-800 flex items-center space-x-2 text-slate-300"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Edit Item</span>
              </button>
              <button
                onClick={() => {
                  setShowMenu(false);
                  onDelete(item.id);
                }}
                className="w-full px-3 py-2 text-left hover:bg-rose-500/10 flex items-center space-x-2 text-rose-400"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete</span>
              </button>
            </div>
          )}
        </div>

        {/* Rewear Score (Clean on Image Bottom) */}
        <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded-md bg-slate-950/85 backdrop-blur-md border border-slate-800 text-purple-300 text-[10px] font-bold flex items-center space-x-1">
          <Repeat className="w-2.5 h-2.5 text-purple-400" />
          <span>Rewear Score: {rewear.score}/5</span>
        </div>
      </div>

      {/* Item Info: Clean Title & 2-3 Small Tags & Rewear Description */}
      <div className="p-3 space-y-1.5">
        <h4 className="text-xs sm:text-sm font-bold text-white leading-tight line-clamp-1 group-hover:text-amber-400 transition-colors">
          {item.name}
        </h4>

        <div className="flex items-center justify-between text-[11px] text-slate-400 font-medium">
          <span className="truncate">{tags.join(' • ')}</span>
        </div>

        {/* Simple Rewear Description */}
        <p className="text-[10px] text-slate-400 pt-0.5 truncate border-t border-slate-800/60">
          Can create <strong className="text-slate-200">{rewear.looksCount} looks</strong>
        </p>
      </div>
    </div>
  );
};
