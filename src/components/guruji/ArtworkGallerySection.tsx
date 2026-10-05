import React, { useState } from 'react';
import {
  Search,
  Filter,
  Sparkles,
  Heart,
  Download,
  Share2,
  Eye,
  Edit3,
  Image as ImageIcon,
  CheckCircle2,
  RefreshCw,
  SlidersHorizontal,
  Flame,
  ArrowRight,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  ShoppingBag,
  Maximize2,
  X,
  Compass,
  Layers,
  Crown,
} from 'lucide-react';
import { GurujiArtwork, GurujiCategoryItem } from '../../types';

interface ArtworkGallerySectionProps {
  artworks: GurujiArtwork[];
  categories: GurujiCategoryItem[];
  selectedCategory: string;
  onSelectCategory: (catSlug: string) => void;
  selectedPrice: 'all' | 'free' | 'paid';
  onSelectPrice: (price: 'all' | 'free' | 'paid') => void;
  selectedMood: string;
  onSelectMood: (mood: string) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  sortBy: string;
  onSortByChange: (sort: string) => void;
  loading: boolean;
  favorites: string[];
  onToggleFavorite: (id: string) => void;
  onPreviewArtwork: (art: GurujiArtwork) => void;
  onDownloadArtwork: (art: GurujiArtwork) => void;
  onBuyArtwork: (art: GurujiArtwork) => void;
  onOpenCardStudio: (art: GurujiArtwork) => void;
  onOpenPhotoStudio: (art: GurujiArtwork) => void;
  onResetFilters: () => void;
  onOpenInquiry: () => void;
}

export const ArtworkGallerySection: React.FC<ArtworkGallerySectionProps> = ({
  artworks,
  categories,
  selectedCategory,
  onSelectCategory,
  selectedPrice,
  onSelectPrice,
  selectedMood,
  onSelectMood,
  searchQuery,
  onSearchChange,
  sortBy,
  onSortByChange,
  loading,
  favorites,
  onToggleFavorite,
  onPreviewArtwork,
  onDownloadArtwork,
  onBuyArtwork,
  onOpenCardStudio,
  onOpenPhotoStudio,
  onResetFilters,
  onOpenInquiry,
}) => {
  // State for "Explore One at a Time" (Sequential Darshan Viewer Modal)
  const [sequentialViewerIndex, setSequentialViewerIndex] = useState<number | null>(null);

  // Find active category item
  const currentCategoryItem = categories.find((c) => c.slug === selectedCategory);

  // Compute daily spotlight category for "Divine Collection of the Day"
  const spotlightCategory =
    categories.find((c) => c.slug === 'golden-lotus') ||
    categories.find((c) => c.slug === 'bade-mandir') ||
    categories[1];

  // Helper for sequential viewer
  const handleOpenSequentialViewer = () => {
    if (artworks.length > 0) {
      setSequentialViewerIndex(0);
    }
  };

  const handleNextSequential = () => {
    if (sequentialViewerIndex !== null && artworks.length > 0) {
      setSequentialViewerIndex((prev) => ((prev ?? 0) + 1) % artworks.length);
    }
  };

  const handlePrevSequential = () => {
    if (sequentialViewerIndex !== null && artworks.length > 0) {
      setSequentialViewerIndex((prev) => ((prev ?? 0) - 1 + artworks.length) % artworks.length);
    }
  };

  const activeSequentialArt =
    sequentialViewerIndex !== null && artworks[sequentialViewerIndex]
      ? artworks[sequentialViewerIndex]
      : null;

  return (
    <section id="gallery-section" className="space-y-6">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-1.5">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Sacred Collection Catalog</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Explore Divine Guruji Artworks & Darshan
          </h2>
          <p className="text-sm text-slate-400 max-w-2xl">
            Browse through verified 4K ultra-high-definition Guruji Swaroops, Bade Mandir sanctums, celestial lotus auras, and sacred daily vachan art.
          </p>
        </div>

        <div className="flex items-center space-x-3 text-xs">
          <div className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300">
            <span className="font-bold text-amber-400">{artworks.length}</span>
            <span className="text-slate-400 ml-1.5">Artworks Shown</span>
          </div>

          {artworks.length > 0 && (
            <button
              onClick={handleOpenSequentialViewer}
              className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold shadow-md shadow-purple-900/30 transition-all hover:scale-105"
            >
              <Compass className="w-3.5 h-3.5" />
              <span>Explore One at a Time</span>
            </button>
          )}
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="p-4 sm:p-5 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-4">
        {/* Top Controls: Search + Price + Sort */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
          {/* Search Input */}
          <div className="sm:col-span-6 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search by title, mantra, quote, or category (e.g. Bade Mandir, Golden Lotus, Peace)..."
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-950 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 transition-colors"
            />
          </div>

          {/* Price Selector Chips */}
          <div className="sm:col-span-3 flex items-center bg-slate-950 p-1 rounded-2xl border border-slate-800">
            {[
              { id: 'all', label: 'All Art' },
              { id: 'free', label: '100% Free' },
              { id: 'paid', label: 'Premium' },
            ].map((p) => (
              <button
                key={p.id}
                onClick={() => onSelectPrice(p.id as any)}
                className={`flex-1 py-1.5 px-2 rounded-xl text-xs font-bold transition-all ${
                  selectedPrice === p.id
                    ? 'bg-amber-500 text-slate-950 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>

          {/* Sort By Dropdown */}
          <div className="sm:col-span-3">
            <select
              value={sortBy}
              onChange={(e) => onSortByChange(e.target.value)}
              className="w-full py-2.5 px-3 rounded-2xl bg-slate-950 border border-slate-700 text-xs text-slate-300 font-semibold focus:outline-none focus:border-amber-400"
            >
              <option value="popular">🔥 Most Loved & Viewed</option>
              <option value="downloads">📥 Most Downloaded</option>
              <option value="favorites">❤️ Most Favorited</option>
              <option value="newest">✨ Fresh Creations</option>
              <option value="price-asc">₹ Price: Low to High</option>
              <option value="price-desc">₹ Price: High to Low</option>
            </select>
          </div>
        </div>

        {/* Dynamic Horizontal Scrollable Category Chips Bar */}
        <div className="relative">
          <div className="flex items-center space-x-2 overflow-x-auto pb-2 pt-1 scrollbar-thin scrollbar-thumb-slate-800">
            <button
              onClick={() => onSelectCategory('all')}
              className={`px-4 py-2 rounded-2xl text-xs font-bold shrink-0 transition-all flex items-center space-x-2 ${
                selectedCategory === 'all'
                  ? 'bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 shadow-lg shadow-amber-500/20 ring-2 ring-amber-400/50'
                  : 'bg-slate-950 text-slate-300 border border-slate-800 hover:border-slate-700 hover:text-white'
              }`}
            >
              <span>✨</span>
              <span>All Collections</span>
            </button>

            {categories
              .filter((c) => c.slug !== 'all')
              .map((cat) => {
                const isSelected = selectedCategory === cat.slug;
                const count = cat.publishedCount ?? cat.artworkCount;

                return (
                  <button
                    key={cat.id || cat.slug}
                    onClick={() => onSelectCategory(cat.slug)}
                    className={`px-3.5 py-2 rounded-2xl text-xs font-bold shrink-0 transition-all flex items-center space-x-2 ${
                      isSelected
                        ? 'bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 shadow-lg shadow-amber-500/20 ring-2 ring-amber-400/50'
                        : 'bg-slate-950 text-slate-300 border border-slate-800 hover:border-slate-700 hover:text-white'
                    }`}
                  >
                    <span>{cat.icon || '🌸'}</span>
                    <span>{cat.name}</span>
                    {count !== undefined && count > 0 && (
                      <span
                        className={`text-[10px] px-1.5 py-0.5 rounded-full font-black ${
                          isSelected
                            ? 'bg-slate-950/20 text-slate-950'
                            : 'bg-slate-800 text-amber-400'
                        }`}
                      >
                        {count}
                      </span>
                    )}
                  </button>
                );
              })}
          </div>
        </div>
      </div>

      {/* Dynamic Category Introduction Card (Shows when a specific category is active) */}
      {selectedCategory !== 'all' && currentCategoryItem && (
        <div className="p-5 md:p-6 rounded-3xl bg-gradient-to-r from-slate-900 via-slate-900/95 to-slate-950 border border-amber-500/30 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-start space-x-4">
            <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-3xl shadow-inner shrink-0">
              {currentCategoryItem.icon || '✨'}
            </div>

            <div className="space-y-1">
              <div className="flex items-center space-x-2 flex-wrap">
                <h3 className="text-xl font-black text-white tracking-tight">
                  {currentCategoryItem.name}
                </h3>
                {currentCategoryItem.hindiName && (
                  <span className="text-xs font-bold text-amber-400 px-2 py-0.5 rounded-md bg-amber-500/10 border border-amber-500/20">
                    {currentCategoryItem.hindiName}
                  </span>
                )}
                <span className="text-xs text-slate-400">
                  ({artworks.length} {artworks.length === 1 ? 'artwork' : 'artworks'} in collection)
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
                {currentCategoryItem.description ||
                  'Explore handpicked authentic Guruji spiritual artworks created with deep devotion and sacred blessing resonance.'}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2 self-end md:self-center shrink-0">
            {artworks.length > 0 && (
              <button
                onClick={handleOpenSequentialViewer}
                className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold shadow-lg shadow-purple-600/20 transition-all hover:scale-105"
              >
                <Compass className="w-3.5 h-3.5" />
                <span>View One by One</span>
              </button>
            )}

            <button
              onClick={() => onSelectCategory('all')}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 hover:text-white text-xs font-bold transition-all"
            >
              Reset to All
            </button>
          </div>
        </div>
      )}

      {/* Divine Collection of the Day Spotlight (When in 'all' view) */}
      {selectedCategory === 'all' && spotlightCategory && (
        <div className="p-4 sm:p-5 rounded-3xl bg-gradient-to-r from-amber-500/10 via-slate-900 to-slate-950 border border-amber-500/30 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-lg">
          <div className="flex items-center space-x-3.5">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-2xl shadow-md">
              <Crown className="w-6 h-6 text-amber-400" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-[10px] font-black uppercase tracking-wider text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
                  Divine Collection of the Day
                </span>
                <span className="text-xs text-slate-400">• Featured</span>
              </div>
              <h4 className="text-base font-black text-white">
                {spotlightCategory.icon} {spotlightCategory.name} ({spotlightCategory.hindiName})
              </h4>
              <p className="text-xs text-slate-400 line-clamp-1">
                {spotlightCategory.description}
              </p>
            </div>
          </div>

          <button
            onClick={() => onSelectCategory(spotlightCategory.slug)}
            className="w-full sm:w-auto px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 text-xs font-black shadow-md transition-all hover:scale-105 flex items-center justify-center space-x-1.5 shrink-0"
          >
            <span>Explore {spotlightCategory.name}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Main Artworks Grid */}
      {loading ? (
        <div className="p-16 text-center text-slate-400">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-3 text-amber-500" />
          <p className="text-sm font-semibold">Loading verified sacred artworks from database...</p>
        </div>
      ) : artworks.length === 0 ? (
        /* Empty State for Selected Category/Filters */
        <div className="p-10 md:p-14 text-center rounded-3xl bg-gradient-to-b from-slate-900 to-slate-950 border border-amber-500/30 space-y-6 shadow-2xl">
          <div className="w-16 h-16 rounded-3xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mx-auto text-3xl shadow-inner">
            🕉️
          </div>

          <div className="space-y-2 max-w-lg mx-auto">
            <h3 className="text-xl font-black text-white">
              GurucraftPro Divine Artwork Discovery
            </h3>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              No artworks matched your current combination of category, mood, and price filters. You can clear filters to browse our complete 4K gallery, explore popular moods, or create a personalized blessing card instantly!
            </p>
          </div>

          {/* Quick Mood Discovery Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-2 max-w-xl mx-auto pt-2">
            {[
              { id: 'peace', label: '🌿 Peace & Serenity' },
              { id: 'gratitude', label: '❤️ Shukrana' },
              { id: 'blessings', label: '🙏 Divine Grace' },
              { id: 'meditation', label: '🧘 Amrit Vela' },
            ].map((m) => (
              <button
                key={m.id}
                onClick={() => onSelectMood(m.id)}
                className="px-3 py-1.5 rounded-full bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-bold text-slate-300 hover:text-white transition-all"
              >
                {m.label}
              </button>
            ))}
          </div>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={onResetFilters}
              className="px-5 py-2.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs shadow-lg shadow-amber-500/20 transition-all hover:scale-105"
            >
              Reset All Filters
            </button>

            <button
              onClick={() => onOpenCardStudio(artworks[0] || ({} as any))}
              className="px-5 py-2.5 rounded-2xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-lg shadow-purple-600/20 transition-all hover:scale-105"
            >
              Create Blessing Card
            </button>

            <button
              onClick={onOpenInquiry}
              className="px-5 py-2.5 rounded-2xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 font-bold text-xs transition-all"
            >
              Request Custom Artwork
            </button>
          </div>
        </div>
      ) : (
        /* Responsive Grid of Artworks */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {artworks.map((art) => {
            const isFav = favorites.includes(art.id);

            return (
              <div
                key={art.id}
                className="rounded-3xl bg-slate-900/90 border border-slate-800 overflow-hidden shadow-lg hover:shadow-2xl hover:border-amber-500/40 transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  {/* Image Container with Golden Arch Framing */}
                  <div
                    className="relative aspect-[4/5] overflow-hidden bg-slate-950 cursor-pointer"
                    onClick={() => onPreviewArtwork(art)}
                  >
                    <img
                      src={art.imageUrl}
                      alt={art.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-slate-950/30 pointer-events-none" />

                    {/* Price / Free Badge */}
                    <div className="absolute top-3 left-3">
                      {art.isFree ? (
                        <span className="px-2.5 py-1 rounded-full bg-emerald-500/90 text-white text-[10px] font-black uppercase tracking-wider shadow-md backdrop-blur-sm">
                          Free 4K HD
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 rounded-full bg-amber-500 text-slate-950 text-[11px] font-black shadow-md">
                          ₹{art.price}{' '}
                          {art.originalPrice && (
                            <span className="line-through text-slate-800 text-[9px]">
                              ₹{art.originalPrice}
                            </span>
                          )}
                        </span>
                      )}
                    </div>

                    {/* Favorite Heart Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleFavorite(art.id);
                      }}
                      className={`absolute top-3 right-3 p-2.5 rounded-full shadow-lg transition-all ${
                        isFav
                          ? 'bg-rose-500 text-white scale-110'
                          : 'bg-slate-950/70 text-slate-300 hover:text-rose-400 backdrop-blur-md hover:scale-105'
                      }`}
                      title={isFav ? 'Remove Favorite' : 'Add to Favorites'}
                    >
                      <Heart className={`w-3.5 h-3.5 ${isFav ? 'fill-current' : ''}`} />
                    </button>

                    {/* Quick Preview Hover Trigger */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-slate-950/40 backdrop-blur-[2px]">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onPreviewArtwork(art);
                        }}
                        className="px-4 py-2 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs shadow-xl flex items-center space-x-1.5 transform translate-y-2 group-hover:translate-y-0 transition-all"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Quick Darshan</span>
                      </button>
                    </div>

                    {/* Category & Verified Badge at Bottom of Image */}
                    <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-[11px] text-slate-300 font-medium">
                      <span className="px-2.5 py-0.5 rounded-full bg-slate-950/80 backdrop-blur-md border border-slate-700 text-amber-300 text-[10px] font-bold">
                        {art.categoryName || 'Sacred Darshan'}
                      </span>
                      <span className="flex items-center space-x-1 text-slate-400 text-[10px]">
                        <Eye className="w-3 h-3" />
                        <span>{art.viewsCount || 1}</span>
                      </span>
                    </div>
                  </div>

                  {/* Artwork Text & Details */}
                  <div className="p-4 space-y-2">
                    <h3 className="text-sm font-black text-white tracking-tight line-clamp-1 group-hover:text-amber-400 transition-colors">
                      {art.title}
                    </h3>

                    {art.hindiTitle && (
                      <div className="text-[11px] font-bold text-amber-400/90 truncate">
                        {art.hindiTitle}
                      </div>
                    )}

                    <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                      {art.blessingMessage ||
                        art.description ||
                        'Sacred Swaroop blessed for home temple and daily darshan.'}
                    </p>

                    {/* Mood Badges */}
                    {art.moods && art.moods.length > 0 && (
                      <div className="flex flex-wrap gap-1 pt-1">
                        {art.moods.slice(0, 2).map((m) => (
                          <span
                            key={m}
                            className="px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 text-[10px] font-semibold"
                          >
                            #{m}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Card Action Hub */}
                <div className="p-4 pt-0 border-t border-slate-800/80 mt-2 space-y-2">
                  <div className="grid grid-cols-2 gap-2 pt-2">
                    {/* Primary Download or Buy Button */}
                    {art.isFree ? (
                      <button
                        onClick={() => onDownloadArtwork(art)}
                        className="w-full flex items-center justify-center space-x-1.5 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white font-bold text-xs shadow-md transition-all hover:scale-[1.02]"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Free HD</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => onBuyArtwork(art)}
                        className="w-full flex items-center justify-center space-x-1.5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-black text-xs shadow-md transition-all hover:scale-[1.02]"
                      >
                        <ShoppingBag className="w-3.5 h-3.5" />
                        <span>Buy ₹{art.price}</span>
                      </button>
                    )}

                    {/* Make Card Button */}
                    <button
                      onClick={() => onOpenCardStudio(art)}
                      className="w-full flex items-center justify-center space-x-1.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-bold text-xs border border-slate-700 transition-all"
                      title="Make Greeting Card with this Swaroop"
                    >
                      <Edit3 className="w-3.5 h-3.5 text-purple-400" />
                      <span>Card</span>
                    </button>
                  </div>

                  {/* Secondary Customize with Photo Shortcut */}
                  <button
                    onClick={() => onOpenPhotoStudio(art)}
                    className="w-full flex items-center justify-center space-x-1.5 py-1.5 rounded-lg bg-slate-950/60 hover:bg-slate-950 text-slate-400 hover:text-amber-300 text-[11px] font-medium transition-colors"
                  >
                    <ImageIcon className="w-3 h-3" />
                    <span>Frame with My Photo</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Sequential Darshan Modal: "Explore One at a Time" */}
      {activeSequentialArt && sequentialViewerIndex !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/90 backdrop-blur-md p-4 sm:p-6 animate-in fade-in">
          <div className="relative w-full max-w-4xl bg-slate-900 border border-amber-500/40 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
              <div className="flex items-center space-x-3">
                <div className="px-2.5 py-1 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-black">
                  {sequentialViewerIndex + 1} / {artworks.length}
                </div>
                <div>
                  <h3 className="text-base font-black text-white">
                    {activeSequentialArt.title}
                  </h3>
                  <p className="text-xs text-amber-400 font-semibold">
                    {activeSequentialArt.categoryName} Collection
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => onPreviewArtwork(activeSequentialArt)}
                  className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-all"
                  title="Full Screen Preview"
                >
                  <Maximize2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setSequentialViewerIndex(null)}
                  className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-all"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Modal Body: Sequential Image View */}
            <div className="relative flex-1 overflow-y-auto p-4 sm:p-6 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
              {/* Image with navigation arrows */}
              <div className="md:col-span-7 relative flex items-center justify-center bg-slate-950 rounded-2xl p-2 min-h-[320px]">
                <img
                  src={activeSequentialArt.imageUrl}
                  alt={activeSequentialArt.title}
                  referrerPolicy="no-referrer"
                  className="max-h-[60vh] w-auto max-w-full object-contain rounded-xl shadow-2xl"
                />

                {/* Left Navigation Arrow */}
                <button
                  onClick={handlePrevSequential}
                  className="absolute left-3 top-1/2 -translate-y-1/2 p-3 rounded-full bg-slate-950/80 hover:bg-amber-500 hover:text-slate-950 text-white border border-slate-700 shadow-xl transition-all"
                  title="Previous Artwork"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>

                {/* Right Navigation Arrow */}
                <button
                  onClick={handleNextSequential}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-3 rounded-full bg-slate-950/80 hover:bg-amber-500 hover:text-slate-950 text-white border border-slate-700 shadow-xl transition-all"
                  title="Next Artwork"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>

              {/* Artwork Sacred Details */}
              <div className="md:col-span-5 space-y-4">
                <div className="space-y-1">
                  {activeSequentialArt.hindiTitle && (
                    <h4 className="text-sm font-bold text-amber-400">
                      {activeSequentialArt.hindiTitle}
                    </h4>
                  )}
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {activeSequentialArt.blessingMessage || activeSequentialArt.description}
                  </p>
                </div>

                {activeSequentialArt.quote && (
                  <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs font-semibold text-amber-300 italic">
                    "{activeSequentialArt.quote}"
                  </div>
                )}

                {activeSequentialArt.mantra && (
                  <div className="text-xs text-slate-400 font-mono">
                    {activeSequentialArt.mantra}
                  </div>
                )}

                {/* Action Buttons */}
                <div className="space-y-2 pt-2">
                  {activeSequentialArt.isFree ? (
                    <button
                      onClick={() => onDownloadArtwork(activeSequentialArt)}
                      className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white font-black text-xs shadow-lg flex items-center justify-center space-x-2 transition-all hover:scale-105"
                    >
                      <Download className="w-4 h-4" />
                      <span>Download Free 4K HD Master</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => onBuyArtwork(activeSequentialArt)}
                      className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-black text-xs shadow-lg flex items-center justify-center space-x-2 transition-all hover:scale-105"
                    >
                      <ShoppingBag className="w-4 h-4" />
                      <span>Unlock Artwork (₹{activeSequentialArt.price})</span>
                    </button>
                  )}

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => {
                        setSequentialViewerIndex(null);
                        onOpenCardStudio(activeSequentialArt);
                      }}
                      className="py-2 px-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center justify-center space-x-1.5 transition-all"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Create Card</span>
                    </button>

                    <button
                      onClick={() => onToggleFavorite(activeSequentialArt.id)}
                      className={`py-2 px-3 rounded-xl font-bold text-xs flex items-center justify-center space-x-1.5 border transition-all ${
                        favorites.includes(activeSequentialArt.id)
                          ? 'bg-rose-500/20 text-rose-400 border-rose-500/30'
                          : 'bg-slate-800 text-slate-300 border-slate-700 hover:text-white'
                      }`}
                    >
                      <Heart
                        className={`w-3.5 h-3.5 ${
                          favorites.includes(activeSequentialArt.id) ? 'fill-current' : ''
                        }`}
                      />
                      <span>Favorite</span>
                    </button>
                  </div>
                </div>

                {/* Keyboard tip */}
                <p className="text-[11px] text-slate-500 text-center">
                  Tip: Use Left and Right arrows to browse the {activeSequentialArt.categoryName} collection
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
