import React, { useState } from 'react';
import { ShoppingBag, ArrowRight, Check, Sparkles, MessageCircle, ChevronDown, ChevronUp, Layers } from 'lucide-react';
import { SalesRecommendation } from '../../types';
import { useCart } from '../../context/CartContext';

interface SalesRecommendationCardProps {
  recommendation: SalesRecommendation;
  onNavigate?: (page: string, slug?: string) => void;
  onInstantCheckout?: (recommendation: SalesRecommendation, selectedPackage?: any) => void;
}

export const SalesRecommendationCard: React.FC<SalesRecommendationCardProps> = ({
  recommendation,
  onNavigate,
  onInstantCheckout,
}) => {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);
  const [showPackages, setShowPackages] = useState(false);
  const [selectedPkgIndex, setSelectedPkgIndex] = useState(0);

  const activePackage = recommendation.packages && recommendation.packages[selectedPkgIndex];
  const displayPrice = activePackage ? activePackage.price : recommendation.startingPrice;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addItem({
      itemId: recommendation.id + (activePackage ? `-${activePackage.name}` : ''),
      itemType: 'service',
      name: `${recommendation.title}${activePackage ? ` (${activePackage.name} Package)` : ''}`,
      price: displayPrice,
      quantity: 1,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleInstantBuy = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onInstantCheckout) {
      onInstantCheckout(recommendation, activePackage);
    } else {
      handleAddToCart(e);
    }
  };

  const handleViewDetails = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onNavigate) {
      if (recommendation.slug) {
        onNavigate('service-detail', recommendation.slug);
      } else if (recommendation.category === 'graphic-design') {
        onNavigate('graphic-design');
      } else if (recommendation.category === 'wardrobe-consultation') {
        onNavigate('quick-services');
      } else if (recommendation.category === 'vantage-marketplace') {
        onNavigate('vantage-ecom');
      } else if (recommendation.category === 'book-cover') {
        onNavigate('book-design');
      } else if (recommendation.category === 'quick-services') {
        onNavigate('quick-services');
      } else {
        onNavigate('home');
      }
    }
  };

  const whatsappMessage = encodeURIComponent(
    `Hello Annu Dhaneja / GurucraftPro Team, I am interested in "${recommendation.title}" (₹${displayPrice}). Please share more details.`
  );

  return (
    <div className="bg-[#FFFFFF] dark:bg-[#182429] border border-[#DCE7E7] dark:border-[#2A3C40] hover:border-[#0799A6] dark:hover:border-[#25B4BD] rounded-2xl p-4 shadow-sm transition-all duration-200 mt-3 text-[#102A36] dark:text-[#F4F8F8]">
      {/* Header Info */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span className="text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-full bg-[#DDF3F4] dark:bg-[#111A1E] text-[#087581] dark:text-[#25B4BD] border border-[#0799A6]/30 dark:border-[#25B4BD]/30">
              {recommendation.categoryName || 'Recommended Service'}
            </span>
            {recommendation.bestFor && (
              <span className="text-[10px] text-[#0799A6] dark:text-[#25B4BD] flex items-center gap-1 font-medium">
                <Sparkles className="w-3 h-3 text-[#0799A6] dark:text-[#25B4BD]" />
                {recommendation.bestFor}
              </span>
            )}
          </div>
          <h4 className="font-bold text-sm text-[#102A36] dark:text-[#F4F8F8] leading-snug hover:text-[#0799A6] dark:hover:text-[#25B4BD] cursor-pointer" onClick={handleViewDetails}>
            {recommendation.title}
          </h4>
        </div>
        <div className="text-right shrink-0">
          <div className="text-xs text-[#52636A] dark:text-[#B7C6C8]">Starting from</div>
          <div className="text-base font-extrabold text-[#0799A6] dark:text-[#25B4BD]">
            ₹{displayPrice.toLocaleString('en-IN')}
          </div>
        </div>
      </div>

      {/* Description */}
      <p className="text-xs text-[#52636A] dark:text-[#B7C6C8] mt-2 line-clamp-2 leading-relaxed">
        {recommendation.description}
      </p>

      {/* Feature Bullet Points */}
      {recommendation.features && recommendation.features.length > 0 && (
        <div className="mt-2.5 space-y-1">
          {recommendation.features.slice(0, 3).map((feat, i) => (
            <div key={i} className="flex items-center text-[11px] text-[#52636A] dark:text-[#B7C6C8]">
              <Check className="w-3.5 h-3.5 text-[#0799A6] dark:text-[#25B4BD] mr-1.5 shrink-0" />
              <span>{feat}</span>
            </div>
          ))}
        </div>
      )}

      {/* Packages Selector (if available) */}
      {recommendation.packages && recommendation.packages.length > 0 && (
        <div className="mt-3 pt-2.5 border-t border-[#DCE7E7] dark:border-[#2A3C40]">
          <button
            type="button"
            onClick={() => setShowPackages(!showPackages)}
            className="w-full flex items-center justify-between text-xs font-semibold text-[#0799A6] dark:text-[#25B4BD] hover:underline py-1"
          >
            <span className="flex items-center gap-1">
              <Layers className="w-3.5 h-3.5" />
              Compare Available Packages ({recommendation.packages.length})
            </span>
            {showPackages ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>

          {showPackages && (
            <div className="grid grid-cols-3 gap-1.5 mt-2">
              {recommendation.packages.map((pkg, pIdx) => (
                <button
                  key={pIdx}
                  type="button"
                  onClick={() => setSelectedPkgIndex(pIdx)}
                  className={`p-2 rounded-xl text-left border text-xs transition-all ${
                    selectedPkgIndex === pIdx
                      ? 'bg-[#DDF3F4] dark:bg-[#111A1E] border-[#0799A6] dark:border-[#25B4BD] text-[#087581] dark:text-[#25B4BD] shadow-xs'
                      : 'bg-[#F8FAFA] dark:bg-[#111A1E] border-[#DCE7E7] dark:border-[#2A3C40] text-[#52636A] dark:text-[#B7C6C8] hover:border-[#0799A6]'
                  }`}
                >
                  <div className="font-bold text-[11px] truncate text-[#102A36] dark:text-[#F4F8F8]">{pkg.name}</div>
                  <div className="text-[#0799A6] dark:text-[#25B4BD] font-extrabold text-xs mt-0.5">₹{pkg.price}</div>
                  {pkg.deliveryTime && (
                    <div className="text-[9px] text-[#52636A] dark:text-[#B7C6C8] truncate mt-0.5">{pkg.deliveryTime}</div>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Direct Action Buttons */}
      <div className="mt-3.5 pt-2.5 border-t border-[#DCE7E7] dark:border-[#2A3C40] flex items-center gap-2 flex-wrap">
        <button
          type="button"
          onClick={handleAddToCart}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-bold transition-all ${
            added
              ? 'bg-emerald-600 text-white'
              : 'btn-secondary-cta'
          }`}
        >
          <ShoppingBag className="w-3.5 h-3.5" />
          {added ? 'Added to Cart ✓' : 'Add to Cart'}
        </button>

        <button
          type="button"
          onClick={handleInstantBuy}
          className="flex items-center justify-center gap-1 py-2 px-3 rounded-xl text-xs font-bold btn-primary-cta transition-all shadow-xs"
          title="Instant Checkout"
        >
          <span>Order Now</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>

        <a
          href={`https://wa.me/918527837527?text=${whatsappMessage}`}
          target="_blank"
          rel="noopener noreferrer"
          className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/20 transition-colors"
          title="Chat on WhatsApp with Annu Dhaneja"
        >
          <MessageCircle className="w-4 h-4" />
        </a>
      </div>
    </div>
  );
};
