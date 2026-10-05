import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  ShoppingCart,
  Zap,
  Eye,
  Heart,
  Download,
  Star,
  Sparkles,
  CheckCircle,
  Clock,
  Layers,
  Wand2,
  Share2,
  MessageSquare,
  Package,
} from 'lucide-react';
import { GurujiArtwork } from '../../types';
import { useCart } from '../../context/CartContext';

interface MarketplaceProductCardProps {
  artwork: GurujiArtwork;
  onQuickView: (artwork: GurujiArtwork) => void;
  onCustomize?: (artwork: GurujiArtwork) => void;
  isFavorite?: boolean;
  onToggleFavorite?: (id: string) => void;
  onInquiry?: (artwork: GurujiArtwork) => void;
  onBuyNow?: (artwork: GurujiArtwork) => void;
}

export const MarketplaceProductCard: React.FC<MarketplaceProductCardProps> = ({
  artwork,
  onQuickView,
  onCustomize,
  isFavorite = false,
  onToggleFavorite,
  onInquiry,
  onBuyNow,
}) => {
  const { addItem } = useCart();
  const [isAdded, setIsAdded] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const isPhysical = artwork.isPhysical !== undefined ? artwork.isPhysical : !artwork.isDigital;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addItem({
      itemId: artwork.id,
      id: artwork.id,
      name: artwork.title,
      price: artwork.price,
      quantity: 1,
      image: artwork.imageUrl,
      imageUrl: artwork.imageUrl,
      itemType: 'product',
      category: artwork.categoryName || 'Guruji Sacred Store',
      isDigital: !isPhysical,
      isPhysical: isPhysical,
      sku: artwork.sku || artwork.id,
      originalPrice: artwork.originalPrice,
    });
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2200);
  };

  const handleBuyNow = (e: React.MouseEvent) => {
    e.stopPropagation();
    handleAddToCart(e);
    if (onBuyNow) {
      onBuyNow(artwork);
    } else {
      onQuickView(artwork);
    }
  };

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (navigator.share) {
      navigator.share({
        title: artwork.title,
        text: artwork.description,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(`${window.location.origin}/guruji-artwork?product=${artwork.id}`);
      alert('Product link copied to clipboard!');
    }
  };

  const isCustomizable = artwork.isCustomizable || artwork.productType === 'CUSTOMIZABLE_PRODUCT';
  const isService = artwork.productType === 'SERVICE';
  const rating = artwork.averageRating || 4.9;
  const ratingCount = artwork.ratingCount || artwork.reviews?.length || 24;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.25 }}
      onClick={() => onQuickView(artwork)}
      className="group relative flex flex-col rounded-[20px] bg-[#FFFFFF] dark:bg-[#141D21] border border-[#E3ECEE] dark:border-[#243338] hover:border-[#0799A6] dark:hover:border-[#0799A6] transition-all duration-300 shadow-[0_4px_20px_rgba(16,42,54,0.06)] hover:shadow-[0_12px_32px_rgba(7,153,166,0.14)] overflow-hidden cursor-pointer"
      id={`product-card-${artwork.id}`}
    >
      {/* Image Container */}
      <div className="relative w-full aspect-[4/3] bg-[#F8FAFA] dark:bg-[#0E1518] overflow-hidden">
        {/* Placeholder skeleton */}
        {!imageLoaded && (
          <div className="absolute inset-0 bg-[#E3ECEE] dark:bg-[#1E2B30] animate-pulse" />
        )}
        <img
          src={artwork.thumbnailUrl || artwork.imageUrl}
          alt={artwork.title}
          referrerPolicy="no-referrer"
          loading="lazy"
          onLoad={() => setImageLoaded(true)}
          className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.02] ${
            imageLoaded ? 'opacity-100' : 'opacity-0'
          }`}
        />

        {/* Gradient Overlay on Hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#102A36]/60 via-transparent to-transparent opacity-0 group-hover:opacity-80 transition-opacity" />

        {/* Top Badges */}
        <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between pointer-events-none">
          <div className="flex flex-wrap gap-1.5 pointer-events-auto">
            {isPhysical ? (
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wide bg-[#DDF3F4] text-[#087581] border border-[#0799A6]/30 shadow-xs flex items-center gap-1 backdrop-blur-md">
                <Package className="w-3 h-3 text-[#0799A6]" /> PHYSICAL
              </span>
            ) : (
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wide bg-[#DDF3F4] text-[#087581] border border-[#0799A6]/30 shadow-xs flex items-center gap-1 backdrop-blur-md">
                <Zap className="w-3 h-3 text-[#0799A6]" /> DIGITAL
              </span>
            )}

            {artwork.isFree ? (
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wide bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-200 border border-emerald-300 dark:border-emerald-700 shadow-xs flex items-center gap-1">
                <Download className="w-3 h-3" /> 100% FREE
              </span>
            ) : artwork.discount ? (
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wide bg-[#FDE2DE] text-[#D9777F] border border-[#F5A39A]/60 shadow-xs">
                {artwork.discount}% OFF
              </span>
            ) : null}

            {isCustomizable && (
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold tracking-wide bg-[#FDE2DE] text-[#D9777F] border border-[#F5A39A]/60 shadow-xs flex items-center gap-1">
                <Wand2 className="w-3 h-3 text-[#F5A39A]" /> Customizable
              </span>
            )}

            {isService && (
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold tracking-wide bg-[#F8FAFA] text-[#52636A] border border-[#E3ECEE] shadow-xs flex items-center gap-1">
                <Clock className="w-3 h-3 text-[#0799A6]" /> Service
              </span>
            )}
          </div>

          {/* Action Buttons Top Right */}
          <div className="flex items-center gap-1.5 pointer-events-auto">
            {onToggleFavorite && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleFavorite(artwork.id);
                }}
                className={`p-1.5 rounded-full backdrop-blur-md transition-colors shadow-xs ${
                  isFavorite
                    ? 'bg-[#E99191] text-white'
                    : 'bg-[#FFFFFF]/90 dark:bg-[#141D21]/90 text-[#52636A] hover:text-[#E99191] border border-[#E3ECEE] dark:border-[#243338]'
                }`}
                title={isFavorite ? 'Remove from favorites' : 'Save to favorites'}
                id={`fav-btn-${artwork.id}`}
              >
                <Heart className={`w-3.5 h-3.5 ${isFavorite ? 'fill-current' : ''}`} />
              </button>
            )}
            <button
              type="button"
              onClick={handleShare}
              className="p-1.5 rounded-full bg-[#FFFFFF]/90 dark:bg-[#141D21]/90 text-[#52636A] hover:text-[#0799A6] border border-[#E3ECEE] dark:border-[#243338] backdrop-blur-md transition-colors shadow-xs"
              title="Share Design"
              id={`share-btn-${artwork.id}`}
            >
              <Share2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Hover Quick Actions Bar */}
        <div className="absolute inset-x-2 bottom-2.5 opacity-0 group-hover:opacity-100 transition-all duration-200 transform translate-y-2 group-hover:translate-y-0 flex gap-1.5">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onQuickView(artwork);
            }}
            className="flex-1 py-1.5 px-3 rounded-xl bg-[#FFFFFF] dark:bg-[#141D21] hover:bg-[#F8FAFA] text-[#102A36] dark:text-[#F4F8F8] text-xs font-semibold flex items-center justify-center gap-1.5 border border-[#E3ECEE] dark:border-[#243338] shadow-md transition-colors"
          >
            <Eye className="w-3.5 h-3.5 text-[#0799A6]" /> Quick View
          </button>
          {isCustomizable && onCustomize && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onCustomize(artwork);
              }}
              className="py-1.5 px-3 rounded-xl bg-[#0799A6] hover:bg-[#087581] text-white text-xs font-semibold flex items-center justify-center gap-1 shadow-md transition-colors"
              title="Customize with your details"
            >
              <Wand2 className="w-3.5 h-3.5" /> Customize
            </button>
          )}
        </div>
      </div>

      {/* Content Body */}
      <div className="p-4 flex flex-col flex-grow justify-between gap-3 bg-[#FFFFFF] dark:bg-[#141D21]">
        <div>
          {/* Category & Verified Badge */}
          <div className="flex items-center justify-between text-xs text-[#52636A] dark:text-[#B7C6C8] mb-1.5">
            <span className="font-semibold text-[#0799A6] tracking-wider uppercase text-[10px]">
              {artwork.categoryName || 'Guruji Collection'}
            </span>
            <div className="flex items-center gap-1 text-[#0799A6]">
              <Star className="w-3 h-3 fill-[#0799A6]" />
              <span className="text-xs font-bold text-[#102A36] dark:text-[#F4F8F8]">{rating}</span>
              <span className="text-[10px] text-[#52636A] dark:text-[#819396]">({ratingCount})</span>
            </div>
          </div>

          {/* Title */}
          <h3 className="font-bold text-[#102A36] dark:text-[#F4F8F8] text-sm md:text-base line-clamp-1 group-hover:text-[#0799A6] transition-colors">
            {artwork.title}
          </h3>

          {/* Description snippet */}
          <p className="text-xs text-[#52636A] dark:text-[#B7C6C8] line-clamp-2 mt-1 leading-relaxed">
            {artwork.description}
          </p>

          {/* File Formats Pill row */}
          <div className="flex items-center gap-2 mt-2 text-[11px] text-[#52636A] dark:text-[#819396]">
            {artwork.fileFormats && artwork.fileFormats.length > 0 ? (
              <div className="flex items-center gap-1 text-[#52636A] dark:text-[#B7C6C8]">
                <Layers className="w-3 h-3 text-[#0799A6]" />
                <span>{artwork.fileFormats.slice(0, 3).join(', ')}</span>
              </div>
            ) : (
              <div className="flex items-center gap-1 text-[#52636A] dark:text-[#B7C6C8]">
                <CheckCircle className="w-3 h-3 text-[#0799A6]" />
                <span>300 DPI Ultra HD</span>
              </div>
            )}
            {artwork.turnaroundTime && (
              <div className="flex items-center gap-1 text-[#52636A] dark:text-[#819396]">
                <Clock className="w-3 h-3 text-[#0799A6]" />
                <span>{artwork.turnaroundTime}</span>
              </div>
            )}
          </div>
        </div>

        {/* Footer: Price & Add to Cart */}
        <div className="pt-3 border-t border-[#E3ECEE] dark:border-[#243338] flex items-center justify-between gap-2">
          {/* Price Display */}
          <div>
            {artwork.isFree ? (
              <div className="flex items-baseline gap-1.5">
                <span className="text-base font-extrabold text-emerald-600 dark:text-emerald-400">₹0</span>
                <span className="text-xs text-[#52636A] line-through">₹{artwork.originalPrice || 99}</span>
                <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400">FREE</span>
              </div>
            ) : (
              <div className="flex items-baseline gap-1.5">
                <span className="text-base font-extrabold text-[#102A36] dark:text-[#F4F8F8]">₹{artwork.price}</span>
                {artwork.originalPrice && artwork.originalPrice > artwork.price && (
                  <span className="text-xs text-[#52636A] line-through">₹{artwork.originalPrice}</span>
                )}
              </div>
            )}
          </div>

          {/* Action CTAs */}
          <div className="flex items-center gap-1.5">
            {artwork.isFree ? (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onQuickView(artwork);
                }}
                className="px-3.5 py-1.5 rounded-xl bg-[#0799A6] hover:bg-[#087581] text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all active:scale-95"
                id={`free-download-btn-${artwork.id}`}
              >
                <Download className="w-3.5 h-3.5" /> Download
              </button>
            ) : (
              <>
                {onInquiry && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onInquiry(artwork);
                    }}
                    className="p-2 rounded-xl bg-[#F8FAFA] dark:bg-[#1E2B30] hover:bg-[#DDF3F4] text-[#0799A6] border border-[#E3ECEE] dark:border-[#243338] transition-all active:scale-95"
                    title="Inquiry / Custom Request"
                    id={`inquiry-btn-${artwork.id}`}
                  >
                    <MessageSquare className="w-4 h-4" />
                  </button>
                )}
                <button
                  type="button"
                  onClick={handleAddToCart}
                  className={`p-2 rounded-xl text-xs font-semibold flex items-center justify-center transition-all active:scale-95 ${
                    isAdded
                      ? 'bg-emerald-600 text-white'
                      : 'bg-[#F8FAFA] dark:bg-[#1E2B30] hover:bg-[#DDF3F4] text-[#0799A6] border border-[#E3ECEE] dark:border-[#243338]'
                  }`}
                  title={isAdded ? 'Added to Cart!' : 'Add to Cart'}
                  id={`add-cart-btn-${artwork.id}`}
                >
                  {isAdded ? (
                    <CheckCircle className="w-4 h-4 text-white" />
                  ) : (
                    <ShoppingCart className="w-4 h-4 text-[#0799A6]" />
                  )}
                </button>
                <button
                  type="button"
                  onClick={handleBuyNow}
                  className="px-3.5 py-1.5 rounded-xl bg-[#0799A6] hover:bg-[#087581] text-white text-xs font-bold flex items-center gap-1 shadow-sm hover:shadow-[#0799A6]/20 transition-all active:scale-95"
                  id={`buy-now-btn-${artwork.id}`}
                >
                  <Zap className="w-3.5 h-3.5 fill-current" /> Buy Now
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};
