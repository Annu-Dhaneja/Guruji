import React, { useState } from 'react';
import {
  Plus,
  Edit3,
  Trash2,
  Search,
  Sparkles,
  Layers,
  Download,
  Flame,
  Star,
  CheckCircle2,
  Tag,
  ExternalLink,
} from 'lucide-react';
import { GurujiArtwork, GurujiCategoryItem } from '../../../../types';

interface MarketplaceProductsTabProps {
  artworks: GurujiArtwork[];
  categories: GurujiCategoryItem[];
  onAddProduct: () => void;
  onEditProduct: (art: GurujiArtwork) => void;
  onDeleteProduct: (id: string) => Promise<void>;
  onToggleFeatured: (art: GurujiArtwork) => Promise<void>;
}

export const MarketplaceProductsTab: React.FC<MarketplaceProductsTabProps> = ({
  artworks,
  categories,
  onAddProduct,
  onEditProduct,
  onDeleteProduct,
  onToggleFeatured,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('ALL');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedPriceTier, setSelectedPriceTier] = useState<string>('ALL');

  const filteredProducts = artworks.filter((art) => {
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchTitle = art.title.toLowerCase().includes(q) || art.hindiTitle?.toLowerCase().includes(q);
      const matchCat = art.categoryName?.toLowerCase().includes(q) || art.category.toLowerCase().includes(q);
      if (!matchTitle && !matchCat) return false;
    }

    if (selectedType !== 'ALL') {
      if (selectedType === 'DIGITAL' && art.productType !== 'DIGITAL_PRODUCT' && !art.isDownloadable) return false;
      if (selectedType === 'CUSTOMIZABLE' && art.productType !== 'CUSTOMIZABLE_PRODUCT' && !art.isCustomizable) return false;
      if (selectedType === 'SERVICE' && art.productType !== 'SERVICE') return false;
    }

    if (selectedCategory !== 'ALL' && art.category !== selectedCategory) {
      return false;
    }

    if (selectedPriceTier !== 'ALL') {
      if (selectedPriceTier === 'FREE' && !art.isFree && art.price > 0) return false;
      if (selectedPriceTier === 'PAID' && (art.isFree || art.price === 0)) return false;
      if (selectedPriceTier === 'UNDER_99' && (art.price > 99 || art.price === 0)) return false;
      if (selectedPriceTier === 'PREMIUM' && art.price <= 99) return false;
    }

    return true;
  });

  return (
    <div className="space-y-6">
      
      {/* Top Controls Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-[#FFFFFF] dark:bg-[#141D21] border border-[#E3ECEE] dark:border-[#243338] rounded-2xl p-5 gap-4 shadow-sm">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#DDF3F4] text-[#087581] border border-[#0799A6]/30 text-xs font-bold mb-2">
            <Sparkles className="w-3.5 h-3.5 text-[#0799A6]" />
            <span>Guruji Spiritual &amp; Commercial Catalog ({artworks.length} Total Items)</span>
          </div>
          <h3 className="text-xl font-black text-[#102A36] dark:text-[#F4F8F8]">Guruji Artwork Products &amp; Services</h3>
          <p className="text-xs text-[#52636A] dark:text-[#B7C6C8]">
            Manage bracelets, physical accessories, donation boxes, 4K digital wallpapers, stickers, calendars, and bespoke mandir frames.
          </p>
        </div>

        <button
          onClick={onAddProduct}
          className="px-5 py-2.5 rounded-xl bg-[#0799A6] hover:bg-[#087581] text-white font-bold text-xs flex items-center space-x-2 shadow-sm hover:shadow-[#0799A6]/20 shrink-0 transition-transform active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Product</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="p-4 rounded-2xl bg-[#FFFFFF] dark:bg-[#141D21] border border-[#E3ECEE] dark:border-[#243338] space-y-3 shadow-xs">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          
          {/* Search Input */}
          <div className="relative">
            <Search className="w-4 h-4 text-[#52636A] absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by title, tag, or keyword..."
              className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#F8FAFA] dark:bg-[#0E1518] border border-[#E3ECEE] dark:border-[#243338] text-[#102A36] dark:text-[#F4F8F8] outline-none focus:border-[#0799A6]"
            />
          </div>

          {/* Type Filter */}
          <div>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-[#F8FAFA] dark:bg-[#0E1518] border border-[#E3ECEE] dark:border-[#243338] text-[#102A36] dark:text-[#F4F8F8] outline-none focus:border-[#0799A6]"
            >
              <option value="ALL">All Product Types</option>
              <option value="DIGITAL">📥 Digital Wallpapers &amp; Stickers</option>
              <option value="CUSTOMIZABLE">🎨 Customizable Devotee Products</option>
              <option value="SERVICE">⚡ Design Services &amp; 3D Mandir</option>
            </select>
          </div>

          {/* Category Filter */}
          <div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-[#F8FAFA] dark:bg-[#0E1518] border border-[#E3ECEE] dark:border-[#243338] text-[#102A36] dark:text-[#F4F8F8] outline-none focus:border-[#0799A6]"
            >
              <option value="ALL">All Sacred Collections</option>
              {categories.map((c) => (
                <option key={c.id || c.slug} value={c.slug}>
                  {c.icon || '🪷'} {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Price Tier Filter */}
          <div>
            <select
              value={selectedPriceTier}
              onChange={(e) => setSelectedPriceTier(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-[#F8FAFA] dark:bg-[#0E1518] border border-[#E3ECEE] dark:border-[#243338] text-[#102A36] dark:text-[#F4F8F8] outline-none focus:border-[#0799A6]"
            >
              <option value="ALL">All Price Tiers</option>
              <option value="FREE">Free Vault (₹0)</option>
              <option value="PAID">Paid Catalog (₹1+)</option>
              <option value="UNDER_99">Budget-Friendly (₹1 - ₹99)</option>
              <option value="PREMIUM">Premium Masters (₹100+)</option>
            </select>
          </div>

        </div>

        <div className="flex items-center justify-between text-[11px] text-[#52636A] pt-1">
          <span>Showing {filteredProducts.length} of {artworks.length} items</span>
          {(searchQuery || selectedType !== 'ALL' || selectedCategory !== 'ALL' || selectedPriceTier !== 'ALL') && (
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedType('ALL');
                setSelectedCategory('ALL');
                setSelectedPriceTier('ALL');
              }}
              className="text-[#0799A6] hover:underline font-bold"
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredProducts.map((art) => (
          <div
            key={art.id}
            className="rounded-[20px] bg-[#FFFFFF] dark:bg-[#141D21] border border-[#E3ECEE] dark:border-[#243338] overflow-hidden shadow-sm flex flex-col justify-between group hover:border-[#0799A6] transition-all text-xs"
          >
            <div className="p-4 space-y-3">
              
              {/* Product Image */}
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-[#F8FAFA] dark:bg-[#0E1518] border border-[#E3ECEE] dark:border-[#243338]">
                <img
                  src={art.imageUrl}
                  alt={art.title}
                  className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#102A36]/70 via-transparent to-transparent opacity-80" />

                {/* Badges */}
                <div className="absolute top-2 left-2 flex flex-col gap-1">
                  <span
                    className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider backdrop-blur-md shadow-xs ${
                      art.isFree
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                        : 'bg-[#DDF3F4] text-[#087581] border border-[#0799A6]/30'
                    }`}
                  >
                    {art.isFree ? 'FREE 4K' : `₹${art.price}`}
                  </span>
                  {art.productType && (
                    <span className="px-2 py-0.5 rounded bg-white/90 dark:bg-black/80 border border-[#E3ECEE] dark:border-[#243338] text-[9px] font-bold text-[#52636A] dark:text-[#B7C6C8]">
                      {art.productType === 'DIGITAL_PRODUCT'
                        ? 'Digital Asset'
                        : art.productType === 'CUSTOMIZABLE_PRODUCT'
                        ? 'Customizable'
                        : 'Service'}
                    </span>
                  )}
                </div>

                <div className="absolute top-2 right-2 flex items-center space-x-1">
                  {art.isFeatured && (
                    <span className="p-1 rounded-lg bg-[#0799A6] text-white" title="Featured Product">
                      <Star className="w-3 h-3 fill-white" />
                    </span>
                  )}
                  {art.isTrending && (
                    <span className="p-1 rounded-lg bg-[#E99191] text-white" title="Trending Product">
                      <Flame className="w-3 h-3" />
                    </span>
                  )}
                </div>

                <div className="absolute bottom-2 left-3 right-3 text-white">
                  <span className="text-[10px] text-[#DDF3F4] font-bold block truncate">{art.categoryName}</span>
                  <h4 className="text-xs font-black truncate">{art.title}</h4>
                </div>
              </div>

              {/* Specs and Details */}
              <div className="space-y-1.5 pt-1">
                {art.hindiTitle && (
                  <p className="text-[11px] font-serif text-[#087581] dark:text-[#25B4BD] truncate font-bold">"{art.hindiTitle}"</p>
                )}
                <p className="text-[#52636A] dark:text-[#B7C6C8] text-[11px] line-clamp-2 leading-relaxed">{art.description}</p>
                
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {art.fileFormat && (
                    <span className="px-2 py-0.5 rounded bg-[#F8FAFA] dark:bg-[#0E1518] border border-[#E3ECEE] dark:border-[#243338] text-[10px] text-[#52636A] font-mono">
                      {art.fileFormat}
                    </span>
                  )}
                  {art.deliveryTime && (
                    <span className="px-2 py-0.5 rounded bg-[#F8FAFA] dark:bg-[#0E1518] border border-[#E3ECEE] dark:border-[#243338] text-[10px] text-emerald-600 dark:text-emerald-400">
                      ⚡ {art.deliveryTime}
                    </span>
                  )}
                  {art.variants && art.variants.length > 0 && (
                    <span className="px-2 py-0.5 rounded bg-[#DDF3F4] text-[#087581] border border-[#0799A6]/30 text-[10px] font-bold">
                      {art.variants.length} Variants
                    </span>
                  )}
                </div>
              </div>

            </div>

            {/* Bottom Actions */}
            <div className="p-4 pt-0 flex items-center justify-between border-t border-[#E3ECEE] dark:border-[#243338] gap-2">
              <div className="flex items-center space-x-1.5 text-[11px] text-[#52636A] font-semibold">
                <Download className="w-3 h-3 text-[#0799A6]" />
                <span>{art.downloadsCount || 0} Downloads</span>
              </div>

              <div className="flex items-center space-x-1.5">
                <button
                  onClick={() => onToggleFeatured(art)}
                  className={`p-2 rounded-xl border transition-colors ${
                    art.isFeatured
                      ? 'bg-[#DDF3F4] border-[#0799A6] text-[#087581]'
                      : 'bg-[#F8FAFA] dark:bg-[#1E2B30] border-[#E3ECEE] dark:border-[#243338] text-[#52636A] hover:text-[#0799A6]'
                  }`}
                  title={art.isFeatured ? 'Remove from Featured' : 'Mark as Featured'}
                >
                  <Star className={`w-3.5 h-3.5 ${art.isFeatured ? 'fill-[#0799A6]' : ''}`} />
                </button>

                <button
                  onClick={() => onEditProduct(art)}
                  className="p-2 rounded-xl bg-[#F8FAFA] dark:bg-[#1E2B30] hover:bg-[#DDF3F4] text-[#52636A] hover:text-[#087581] border border-[#E3ECEE] dark:border-[#243338] transition-colors"
                  title="Edit full product details"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={() => onDeleteProduct(art.id)}
                  className="p-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 transition-colors"
                  title="Delete product"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

          </div>
        ))}
      </div>

    </div>
  );
};
