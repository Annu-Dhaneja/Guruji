import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Smartphone,
  Monitor,
  Tablet,
  Download,
  Eye,
  Heart,
  Sparkles,
  Share2,
  Lock,
  CheckCircle2,
  Layers,
  Filter,
} from 'lucide-react';
import { GurujiArtwork } from '../../types';

interface WallpapersSectionProps {
  artworks: GurujiArtwork[];
  onDownload: (artwork: GurujiArtwork) => void;
  onQuickView: (artwork: GurujiArtwork) => void;
  onSuccessNotice?: (msg: string) => void;
}

export const WallpapersSection: React.FC<WallpapersSectionProps> = ({
  artworks,
  onDownload,
  onQuickView,
  onSuccessNotice,
}) => {
  const [deviceFilter, setDeviceFilter] = useState<'all' | 'mobile' | 'desktop' | 'tablet'>('all');
  const [screenType, setScreenType] = useState<'all' | 'lockscreen' | 'homescreen'>('all');
  const [activePreviewArt, setActivePreviewArt] = useState<GurujiArtwork | null>(null);

  // Filter artworks relevant to wallpapers
  const wallpaperArtworks = artworks.filter((art) => {
    if (art.isDeleted) return false;
    const isWallpaperCategory =
      art.category === 'wallpapers' ||
      art.category === 'mobile-wallpapers' ||
      art.tags.some((t) => t.toLowerCase().includes('wallpaper') || t.toLowerCase().includes('lockscreen'));

    if (!isWallpaperCategory && art.aspectRatio !== '9:16' && art.aspectRatio !== '16:9') {
      return false;
    }

    if (deviceFilter === 'mobile' && art.aspectRatio === '16:9') return false;
    if (deviceFilter === 'desktop' && art.aspectRatio === '9:16') return false;

    return true;
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-300" id="spiritual-wallpapers-studio-section">
      {/* Header Banner */}
      <div className="relative rounded-3xl bg-gradient-to-r from-neutral-900 via-neutral-900 to-amber-950/40 border border-amber-500/30 p-6 sm:p-8 overflow-hidden shadow-2xl">
        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-bold">
            <Smartphone className="w-3.5 h-3.5 text-amber-400" />
            <span>Ultra HD 4K Spiritual Displays • Free & Premium</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Sacred Mobile & Desktop Wallpapers
          </h2>
          <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
            Download crystal clear 4K resolutions (1080×1920, 1440×2560, 4K UHD) optimized for AMOLED lockscreens, iPhone/Android wallpapers, and PC desktops.
          </p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="p-4 sm:p-5 rounded-2xl bg-neutral-900/80 border border-neutral-800 flex flex-wrap items-center justify-between gap-4 backdrop-blur-md">
        {/* Device Filter Buttons */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-neutral-400 font-medium">Device:</span>
          <button
            type="button"
            onClick={() => setDeviceFilter('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
              deviceFilter === 'all'
                ? 'bg-amber-500 text-neutral-950 font-bold'
                : 'bg-neutral-950 text-neutral-400 border border-neutral-800 hover:text-white'
            }`}
          >
            All Screens
          </button>
          <button
            type="button"
            onClick={() => setDeviceFilter('mobile')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition ${
              deviceFilter === 'mobile'
                ? 'bg-amber-500 text-neutral-950 font-bold'
                : 'bg-neutral-950 text-neutral-400 border border-neutral-800 hover:text-white'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" /> Mobile (9:16)
          </button>
          <button
            type="button"
            onClick={() => setDeviceFilter('desktop')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition ${
              deviceFilter === 'desktop'
                ? 'bg-amber-500 text-neutral-950 font-bold'
                : 'bg-neutral-950 text-neutral-400 border border-neutral-800 hover:text-white'
            }`}
          >
            <Monitor className="w-3.5 h-3.5" /> Desktop (16:9)
          </button>
        </div>

        <div className="text-xs text-neutral-400">
          Showing {wallpaperArtworks.length} 4K Wallpapers
        </div>
      </div>

      {/* Wallpapers Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
        <AnimatePresence>
          {wallpaperArtworks.map((art) => {
            const isVertical = art.aspectRatio === '9:16' || !art.aspectRatio;
            return (
              <motion.div
                key={art.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="group relative rounded-3xl bg-neutral-900 border border-neutral-800 hover:border-amber-500/50 overflow-hidden shadow-lg transition-all duration-300 flex flex-col justify-between"
              >
                {/* Image Container */}
                <div
                  className={`relative w-full ${isVertical ? 'aspect-[9/16]' : 'aspect-[16/9]'} bg-neutral-950 overflow-hidden cursor-pointer`}
                  onClick={() => onQuickView(art)}
                >
                  <img
                    src={art.thumbnailUrl || art.imageUrl}
                    alt={art.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-transparent to-transparent opacity-80" />

                  {/* Top Badges */}
                  <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between pointer-events-none">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-neutral-950/80 text-amber-300 border border-neutral-800 backdrop-blur-md">
                      {art.resolution || (isVertical ? '1080×1920 4K' : '3840×2160 UHD')}
                    </span>

                    {art.isFree ? (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500 text-white">
                        FREE
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500 text-neutral-950">
                        ₹{art.price}
                      </span>
                    )}
                  </div>

                  {/* Hover Quick Action */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-neutral-950/40 backdrop-blur-xs">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onQuickView(art);
                      }}
                      className="px-3.5 py-2 rounded-xl bg-neutral-900/90 text-white text-xs font-bold border border-amber-500/50 shadow-xl flex items-center gap-1.5"
                    >
                      <Eye className="w-3.5 h-3.5 text-amber-400" /> Preview Lockscreen
                    </button>
                  </div>
                </div>

                {/* Info & Download Footer */}
                <div className="p-3.5 bg-neutral-900/90 space-y-2 border-t border-neutral-800/80">
                  <h4 className="text-xs font-bold text-white line-clamp-1 group-hover:text-amber-400 transition-colors">
                    {art.title}
                  </h4>
                  <div className="flex items-center justify-between text-[11px] text-neutral-400">
                    <span>{art.downloadsCount || 120} downloads</span>
                    <button
                      type="button"
                      onClick={() => onDownload(art)}
                      className="p-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold transition shadow-sm active:scale-95"
                      title="Download Wallpaper"
                    >
                      <Download className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
};
