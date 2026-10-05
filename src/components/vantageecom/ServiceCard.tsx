import React from 'react';
import { VantageService } from '../../types';
import { Star, Clock, ShoppingBag, Send, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useCart } from '../../context/CartContext';

interface ServiceCardProps {
  service: VantageService;
  onSelectService?: (service: VantageService) => void;
  onOpenInquiry?: (service: VantageService) => void;
  onAddToCartSuccess?: (message: string) => void;
}

export const ServiceCard: React.FC<ServiceCardProps> = ({
  service,
  onSelectService,
  onOpenInquiry,
  onAddToCartSuccess,
}) => {
  const { addToCart } = useCart();
  const currentPrice = service.salePrice || service.startingPrice;
  const hasDiscount = service.salePrice && service.salePrice < service.startingPrice;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart({
      id: service.id,
      title: service.title,
      price: currentPrice,
      type: 'vantage-service',
      imageUrl: service.imageUrl,
      categoryName: service.categoryName,
    });
    if (onAddToCartSuccess) {
      onAddToCartSuccess(`Added "${service.title}" to cart`);
    }
  };

  const handleInquiryClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onOpenInquiry) {
      onOpenInquiry(service);
    } else if (onSelectService) {
      onSelectService(service);
    }
  };

  return (
    <div
      onClick={() => onSelectService && onSelectService(service)}
      className="group rounded-3xl bg-slate-900/90 hover:bg-slate-900 border border-slate-800 hover:border-teal-500/50 overflow-hidden shadow-xl hover:shadow-2xl hover:shadow-teal-950/20 transition-all duration-300 flex flex-col justify-between cursor-pointer transform hover:-translate-y-1"
    >
      {/* Image & Header Tags */}
      <div className="relative aspect-[16/10] overflow-hidden bg-slate-950">
        <img
          src={service.imageUrl}
          alt={service.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-60" />

        <div className="absolute top-4 left-4 flex flex-col gap-1.5">
          <span className="px-3 py-1 rounded-full bg-slate-950/90 text-teal-300 text-[10px] font-bold uppercase tracking-wider backdrop-blur-md border border-teal-500/30">
            {service.categoryName}
          </span>
        </div>

        <div className="absolute top-4 right-4 flex items-center space-x-1 px-2.5 py-1 rounded-full bg-slate-950/90 text-amber-400 text-[11px] font-bold backdrop-blur-md border border-amber-400/20">
          <Star className="w-3.5 h-3.5 fill-current" />
          <span>{service.rating || 5.0}</span>
        </div>

        <div className="absolute bottom-3 left-4 right-4 flex justify-between items-center text-[11px] text-slate-300 font-medium">
          <span className="flex items-center space-x-1">
            <Clock className="w-3.5 h-3.5 text-teal-400" />
            <span>{service.deliveryTime}</span>
          </span>
          {service.packages && service.packages.length > 0 && (
            <span className="text-[10px] bg-slate-800/80 px-2 py-0.5 rounded text-slate-300 font-semibold">
              {service.packages.length} Tier Packages
            </span>
          )}
        </div>
      </div>

      {/* Body Info */}
      <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
        <div className="space-y-2">
          <h3 className="text-base font-bold text-white group-hover:text-teal-400 transition-colors line-clamp-1">
            {service.title}
          </h3>
          <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
            {service.shortDescription}
          </p>
        </div>

        {/* Features Checklist Preview */}
        {service.features && service.features.length > 0 && (
          <div className="space-y-1.5 pt-2 border-t border-slate-800/60 text-[11px] text-slate-300">
            {service.features.slice(0, 2).map((feat, idx) => (
              <div key={idx} className="flex items-center space-x-2 truncate">
                <CheckCircle2 className="w-3 h-3 text-teal-400 shrink-0" />
                <span className="truncate">{feat}</span>
              </div>
            ))}
          </div>
        )}

        {/* Footer Actions */}
        <div className="pt-4 border-t border-slate-800 space-y-3">
          <div className="flex justify-between items-baseline">
            <div>
              <span className="text-[10px] text-slate-500 font-bold uppercase block">Starting From</span>
              <div className="flex items-baseline space-x-1.5">
                <span className="text-xl font-black text-white">₹{currentPrice.toLocaleString('en-IN')}</span>
                {hasDiscount && (
                  <span className="text-xs text-slate-500 line-through">
                    ₹{service.startingPrice.toLocaleString('en-IN')}
                  </span>
                )}
                <span className="text-[10px] text-slate-400">/ {service.unit || 'job'}</span>
              </div>
            </div>

            <span className="text-xs text-teal-400 font-bold flex items-center space-x-1 group-hover:translate-x-1 transition-transform">
              <span>View Details</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </div>

          {/* Action Buttons: Add to Cart & Inquiry Now */}
          <div className="grid grid-cols-2 gap-2 pt-1">
            <button
              onClick={handleAddToCart}
              className="py-2.5 px-3 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-white font-bold text-xs flex items-center justify-center space-x-1.5 transition-colors active:scale-95"
            >
              <ShoppingBag className="w-3.5 h-3.5 text-teal-400" />
              <span>Add to Cart</span>
            </button>

            <button
              onClick={handleInquiryClick}
              className="py-2.5 px-3 rounded-xl bg-gradient-to-r from-teal-500 to-purple-600 hover:from-teal-400 hover:to-purple-500 text-slate-950 font-black text-xs flex items-center justify-center space-x-1.5 shadow-md shadow-teal-900/30 transition-all active:scale-95"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Inquiry Now</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
