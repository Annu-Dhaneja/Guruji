import React from 'react';
import { Flame, Star, Sparkles, Heart, Download, Eye, ArrowRight, TrendingUp, Award } from 'lucide-react';
import { GurujiArtwork } from '../../types';

interface CuratedCollectionsSectionProps {
  artworks: GurujiArtwork[];
  favorites: string[];
  onToggleFavorite: (id: string) => void;
  onPreviewArtwork: (art: GurujiArtwork) => void;
  onDownloadArtwork: (art: GurujiArtwork) => void;
  onBuyArtwork: (art: GurujiArtwork) => void;
}

export const CuratedCollectionsSection: React.FC<CuratedCollectionsSectionProps> = ({
  artworks,
  favorites,
  onToggleFavorite,
  onPreviewArtwork,
  onDownloadArtwork,
  onBuyArtwork,
}) => {
  // Compute Curated Lists from real database metrics
  const trendingArtworks = [...artworks]
    .sort((a, b) => (b.downloadsCount || 0) - (a.downloadsCount || 0))
    .slice(0, 4);

  const mostLovedArtworks = [...artworks]
    .sort((a, b) => (b.favoritesCount || 0) + (b.viewsCount || 0) - ((a.favoritesCount || 0) + (a.viewsCount || 0)))
    .slice(0, 4);

  return (
    <section className="space-y-12">
      {/* 1. Trending Today Collection */}
      {trendingArtworks.length > 0 && (
        <div className="space-y-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-xl bg-orange-500/20 text-orange-400 border border-orange-500/30 flex items-center justify-center">
                <Flame className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-xl font-black text-white tracking-tight">
                  Trending Today Among Devotees
                </h3>
                <p className="text-xs text-slate-400">
                  Most downloaded 4K Darshan artworks in the last 24 hours.
                </p>
              </div>
            </div>

            <div className="hidden sm:flex items-center space-x-1 text-xs text-amber-400 font-bold">
              <span>Verified High Demand</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {trendingArtworks.map((art, idx) => {
              const isFav = favorites.includes(art.id);

              return (
                <div
                  key={art.id}
                  onClick={() => onPreviewArtwork(art)}
                  className="relative rounded-3xl overflow-hidden bg-slate-900 border border-slate-800 hover:border-amber-500/40 p-3 group cursor-pointer transition-all duration-300 hover:shadow-2xl flex flex-col justify-between"
                >
                  <div>
                    {/* Rank Badge */}
                    <div className="absolute top-5 left-5 z-10 w-7 h-7 rounded-full bg-slate-950/80 border border-amber-400 text-amber-300 text-xs font-black flex items-center justify-center backdrop-blur-md shadow-md">
                      #{idx + 1}
                    </div>

                    <div className="relative aspect-[4/5] rounded-2xl overflow-hidden bg-slate-950 mb-3">
                      <img
                        src={art.imageUrl}
                        alt={art.title}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent pointer-events-none" />

                      <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between text-[10px] text-amber-300 font-bold px-2 py-1 rounded-lg bg-slate-950/80 backdrop-blur-sm">
                        <span>{art.categoryName}</span>
                        <span className="text-emerald-400 font-black">{art.downloadsCount || 0} Downloads</span>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <h4 className="text-xs font-black text-white line-clamp-1 group-hover:text-amber-400 transition-colors">
                        {art.title}
                      </h4>
                      <p className="text-[11px] text-slate-400 line-clamp-1">
                        {art.blessingMessage || art.description}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-slate-800/80 mt-2">
                    <span className="text-xs font-black text-amber-400">
                      {art.isFree ? 'Free HD' : `₹${art.price}`}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (art.isFree) onDownloadArtwork(art);
                        else onBuyArtwork(art);
                      }}
                      className="px-3 py-1 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-[11px] font-black transition-all"
                    >
                      {art.isFree ? 'Download' : 'Buy'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 2. Most Loved by Community Collection */}
      {mostLovedArtworks.length > 0 && (
        <div className="space-y-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-xl bg-rose-500/20 text-rose-400 border border-rose-500/30 flex items-center justify-center">
                <Heart className="w-4 h-4 fill-current" />
              </div>
              <div>
                <h3 className="text-xl font-black text-white tracking-tight">
                  Most Loved by the Sangat
                </h3>
                <p className="text-xs text-slate-400">
                  Highest rated & favorited sacred Swaroops by global devotees.
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {mostLovedArtworks.map((art) => {
              const isFav = favorites.includes(art.id);

              return (
                <div
                  key={art.id}
                  onClick={() => onPreviewArtwork(art)}
                  className="relative rounded-3xl overflow-hidden bg-slate-900 border border-slate-800 hover:border-rose-500/40 p-3 group cursor-pointer transition-all duration-300 hover:shadow-2xl flex flex-col justify-between"
                >
                  <div>
                    <div className="relative aspect-[4/5] rounded-2xl overflow-hidden bg-slate-950 mb-3">
                      <img
                        src={art.imageUrl}
                        alt={art.title}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent pointer-events-none" />

                      <div className="absolute top-2 right-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onToggleFavorite(art.id);
                          }}
                          className={`p-2 rounded-full shadow-md ${
                            isFav ? 'bg-rose-500 text-white' : 'bg-slate-950/80 text-slate-300 hover:text-rose-400'
                          }`}
                        >
                          <Heart className={`w-3.5 h-3.5 ${isFav ? 'fill-current' : ''}`} />
                        </button>
                      </div>

                      <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between text-[10px] text-amber-300 font-bold px-2 py-1 rounded-lg bg-slate-950/80 backdrop-blur-sm">
                        <span>{art.categoryName}</span>
                        <span className="text-rose-400 font-black">{art.favoritesCount || 0} Devotee Loves</span>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <h4 className="text-xs font-black text-white line-clamp-1 group-hover:text-amber-400 transition-colors">
                        {art.title}
                      </h4>
                      <p className="text-[11px] text-slate-400 line-clamp-1">
                        {art.blessingMessage || art.description}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-slate-800/80 mt-2">
                    <span className="text-xs font-black text-amber-400">
                      {art.isFree ? 'Free HD' : `₹${art.price}`}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (art.isFree) onDownloadArtwork(art);
                        else onBuyArtwork(art);
                      }}
                      className="px-3 py-1 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 text-[11px] font-black transition-all"
                    >
                      {art.isFree ? 'Download' : 'Buy'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </section>
  );
};
