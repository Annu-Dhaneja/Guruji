import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Download,
  Sparkles,
  CheckCircle,
  Eye,
  Heart,
  Share2,
  Gift,
} from 'lucide-react';
import { GurujiArtwork } from '../../types';

interface FreeDesignVaultSectionProps {
  freeArtworks: GurujiArtwork[];
  onQuickView: (artwork: GurujiArtwork) => void;
  onToggleFavorite?: (id: string) => void;
  favorites?: string[];
}

export const FreeDesignVaultSection: React.FC<FreeDesignVaultSectionProps> = ({
  freeArtworks,
  onQuickView,
  onToggleFavorite,
  favorites = [],
}) => {
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  const handleDownload = async (e: React.MouseEvent, art: GurujiArtwork) => {
    e.stopPropagation();
    try {
      setDownloadingId(art.id);
      const res = await fetch(`/api/guruji/artworks/${art.id}/download`, {
        method: 'POST',
      });
      const data = await res.json();
      if (data.downloadUrl) {
        const link = document.createElement('a');
        link.href = data.downloadUrl;
        link.download = `${art.slug || 'free-artwork'}.jpg`;
        link.target = '_blank';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    } catch (err) {
      console.error('Download error:', err);
    } finally {
      setTimeout(() => setDownloadingId(null), 2000);
    }
  };

  if (!freeArtworks || freeArtworks.length === 0) return null;

  return (
    <section className="my-10" id="free-design-vault-section">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 gap-2">
        <div>
          <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs uppercase tracking-wider mb-1">
            <Gift className="w-4 h-4" /> Complimentary Sacred Vault
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            100% Free 4K Devotional Wallpapers & Prints
          </h2>
          <p className="text-xs sm:text-sm text-neutral-400 mt-0.5">
            Instant 1-click downloads with zero fees. Mastered with golden radiant light for smartphones, WhatsApp and home temples.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {freeArtworks.slice(0, 12).map((art) => {
          const isFav = favorites.includes(art.id);
          const isDownloading = downloadingId === art.id;

          return (
            <motion.div
              key={art.id}
              whileHover={{ y: -4 }}
              onClick={() => onQuickView(art)}
              className="group relative rounded-xl bg-neutral-900 border border-neutral-800 hover:border-emerald-500/50 transition-all overflow-hidden flex flex-col cursor-pointer"
            >
              <div className="relative aspect-[9/16] bg-neutral-950 overflow-hidden">
                <img
                  src={art.thumbnailUrl || art.imageUrl}
                  alt={art.title}
                  referrerPolicy="no-referrer"
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />

                <div className="absolute top-2 left-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-emerald-500 text-white shadow-sm">
                    FREE 4K
                  </span>
                </div>

                {onToggleFavorite && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleFavorite(art.id);
                    }}
                    className={`absolute top-2 right-2 p-1 rounded-full backdrop-blur-md transition-colors ${
                      isFav ? 'bg-rose-500 text-white' : 'bg-black/60 text-neutral-400 hover:text-white'
                    }`}
                  >
                    <Heart className={`w-3 h-3 ${isFav ? 'fill-current' : ''}`} />
                  </button>
                )}

                <div className="absolute bottom-2 inset-x-2">
                  <h4 className="text-xs font-bold text-white truncate drop-shadow-sm">
                    {art.title}
                  </h4>
                  <p className="text-[10px] text-amber-400 truncate">
                    {art.categoryName}
                  </p>

                  <button
                    type="button"
                    onClick={(e) => handleDownload(e, art)}
                    disabled={isDownloading}
                    className="w-full mt-2 py-1.5 px-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-bold flex items-center justify-center gap-1 shadow-md transition-colors active:scale-95 disabled:opacity-50"
                  >
                    <Download className="w-3 h-3" />
                    {isDownloading ? 'Saving...' : 'Download'}
                  </button>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
};
