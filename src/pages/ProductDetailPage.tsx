import React, { useState, useEffect, useMemo } from 'react';
import {
  Sparkles,
  ArrowLeft,
  ShoppingBag,
  Zap,
  CheckCircle2,
  ShieldCheck,
  RotateCcw,
  Star,
  Clock,
  Truck,
  Heart,
  Share2,
  MessageCircle,
  FileCheck,
  Layers,
} from 'lucide-react';
import { ProductItem, SHOWCASE_PRODUCTS, getProductBySlug } from '../data/productData';
import { GraphicDesignService, GraphicDesignPackage } from '../data/graphicDesignData';
import { Product360Viewer } from '../components/products/Product360Viewer';
import { useCart } from '../context/CartContext';
import { useTheme } from '../context/ThemeContext';

interface ProductDetailPageProps {
  slug: string;
  onNavigate?: (page: string, slug?: string) => void;
}

export const ProductDetailPage: React.FC<ProductDetailPageProps> = ({
  slug,
  onNavigate,
}) => {
  const { addItem, addToCart, setIsCartOpen } = useCart();
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  // Dynamic extra services from server / CMS
  const [extraServices, setExtraServices] = useState<GraphicDesignService[]>([]);

  useEffect(() => {
    fetch('/api/graphic-design/services')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setExtraServices(data);
        }
      })
      .catch(() => {});
  }, []);

  // Dynamically resolve product
  const product = useMemo(() => {
    return getProductBySlug(slug, extraServices) || SHOWCASE_PRODUCTS[0];
  }, [slug, extraServices]);

  // Selected package if available
  const [selectedPkgIndex, setSelectedPkgIndex] = useState<number>(0);
  const activePackage: GraphicDesignPackage | undefined = useMemo(() => {
    if (product.packages && product.packages.length > 0) {
      return product.packages[selectedPkgIndex] || product.packages[0];
    }
    return undefined;
  }, [product.packages, selectedPkgIndex]);

  const currentPrice = activePackage ? activePackage.price : (product.salePrice || product.price);
  const currentOriginalPrice = activePackage ? activePackage.originalPrice : product.originalPrice;

  const [selectedQuantity, setSelectedQuantity] = useState(1);
  const [isCopied, setIsCopied] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

  // Scroll to top on slug change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setSelectedPkgIndex(0);
  }, [slug]);

  const handleAddToCart = () => {
    if (activePackage) {
      addItem({
        itemId: `${product.id}-${activePackage.id}`,
        itemType: 'service',
        name: `${product.title} (${activePackage.name})`,
        price: activePackage.price,
        quantity: selectedQuantity,
      });
    } else {
      addToCart({
        id: product.id,
        title: product.title,
        price: currentPrice,
        quantity: selectedQuantity,
        image: product.mainImage,
        category: product.category,
      });
    }
    setIsCartOpen(true);
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2500);
    }
  };

  return (
    <div className="min-h-screen py-10 sm:py-16 bg-[#F8FAFB] dark:bg-[#080D10] text-[#102A36] dark:text-white transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Top Navigation & Breadcrumbs */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#E2E8F0] dark:border-[#1E2B30] pb-6">
          <button
            onClick={() => (onNavigate ? onNavigate('graphic-design') : (window.location.hash = '/services'))}
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-[#52636A] dark:text-[#94A3B8] hover:text-[#0799A6] dark:hover:text-[#25B4BD] transition cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Graphic Design Store</span>
          </button>

          <div className="flex items-center gap-2 text-xs font-semibold text-[#52636A] dark:text-[#94A3B8]">
            <span>Products</span>
            <span>/</span>
            <span className="text-[#0799A6] dark:text-[#25B4BD]">{product.category}</span>
            <span>/</span>
            <span className="text-[#102A36] dark:text-white font-bold">{product.title}</span>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* HERO 2-COLUMN PRODUCT SHOWCASE                                            */}
        {/* ========================================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Left Column: 360° Interactive Product Rotation */}
          <div className="lg:col-span-7 space-y-4">
            <Product360Viewer product={product} />

            <div className="flex items-center justify-between text-xs text-[#52636A] dark:text-[#94A3B8] px-2">
              <span className="flex items-center gap-1.5 font-semibold">
                <RotateCcw className="w-3.5 h-3.5 text-cyan-400" />
                <span>360° Rotation Active • Drag to Rotate Around Y-Axis</span>
              </span>
              <span className="font-bold text-[#0799A6] dark:text-[#25B4BD]">100% 3D Studio Physics</span>
            </div>
          </div>

          {/* Right Column: Product Information & Purchase Action */}
          <div className="lg:col-span-5 space-y-6">
            {/* Category & Badge */}
            <div className="flex items-center justify-between">
              <span className="px-3 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-wider bg-[#0799A6]/10 dark:bg-[#25B4BD]/10 text-[#0799A6] dark:text-[#25B4BD] border border-[#0799A6]/20 dark:border-[#25B4BD]/20">
                {product.category}
              </span>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsLiked((prev) => !prev)}
                  className={`p-2 rounded-full border transition cursor-pointer ${
                    isLiked
                      ? 'bg-rose-50 dark:bg-rose-950/40 border-rose-400 text-rose-500'
                      : 'border-slate-200 dark:border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
                </button>
                <button
                  type="button"
                  onClick={handleShare}
                  className="p-2 rounded-full border border-slate-200 dark:border-slate-800 text-slate-400 hover:text-white transition cursor-pointer"
                  title="Share product link"
                >
                  <Share2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Title & Subtitle */}
            <div className="space-y-1.5">
              <h1 className="text-2xl sm:text-3xl font-black text-[#102A36] dark:text-white tracking-tight leading-tight">
                {product.title}
              </h1>
              <p className="text-sm font-semibold text-[#52636A] dark:text-[#94A3B8]">
                {product.subtitle}
              </p>
            </div>

            {/* Ratings Bar */}
            <div className="flex items-center gap-3 text-xs">
              <div className="flex items-center gap-1 text-amber-400 font-black">
                <Star className="w-4 h-4 fill-current" />
                <span>{product.rating}</span>
              </div>
              <span className="text-slate-400">•</span>
              <span className="text-slate-500 dark:text-slate-400 font-medium">
                {product.reviewsCount} verified clients
              </span>
              <span className="text-slate-400">•</span>
              <span className="text-emerald-500 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Ready for Production
              </span>
            </div>

            {/* Tiered Packages Selection (if available) */}
            {product.packages && product.packages.length > 0 && (
              <div className="space-y-2">
                <div className="text-xs font-black uppercase tracking-wider text-[#102A36] dark:text-white flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-[#0799A6]" />
                    <span>Select Package Tier:</span>
                  </span>
                  {activePackage && (
                    <span className="text-emerald-500 font-bold text-[11px]">
                      {activePackage.deliveryTime}
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-3 gap-2">
                  {product.packages.map((pkg, idx) => {
                    const isSelected = selectedPkgIndex === idx;
                    return (
                      <button
                        key={pkg.id || idx}
                        type="button"
                        onClick={() => setSelectedPkgIndex(idx)}
                        className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-[#0799A6]/10 border-[#0799A6] text-[#0799A6] dark:text-[#25B4BD] shadow-2xs'
                            : 'bg-white dark:bg-[#111A1E] border-slate-200 dark:border-slate-800 text-slate-400 hover:border-slate-300'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-black truncate">{pkg.name}</span>
                          {pkg.popular && (
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                          )}
                        </div>
                        <div className="text-sm font-black text-[#102A36] dark:text-white mt-0.5">
                          ₹{pkg.price}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Price Box */}
            <div className="p-4 rounded-2xl bg-white dark:bg-[#111A1E] border border-[#E2E8F0] dark:border-[#1E2B30] flex items-baseline justify-between shadow-xs">
              <div className="space-y-0.5">
                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  {activePackage ? `${activePackage.name} Package Price` : 'Special Starting Price'}
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-black text-[#0799A6] dark:text-[#25B4BD]">
                    ₹{currentPrice}
                  </span>
                  {currentOriginalPrice > currentPrice && (
                    <>
                      <span className="text-base text-slate-400 line-through">
                        ₹{currentOriginalPrice}
                      </span>
                      <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-500 font-bold text-xs">
                        Save {Math.round(((currentOriginalPrice - currentPrice) / currentOriginalPrice) * 100)}%
                      </span>
                    </>
                  )}
                </div>
              </div>

              <div className="text-right text-xs font-semibold text-slate-400">
                <div className="flex items-center gap-1 text-slate-300">
                  <Truck className="w-3.5 h-3.5 text-cyan-400" />
                  <span>{activePackage ? activePackage.deliveryTime : product.deliveryTime}</span>
                </div>
              </div>
            </div>

            {/* Description */}
            <p className="text-xs sm:text-sm text-[#52636A] dark:text-[#B7C6C8] leading-relaxed">
              {product.fullDescription}
            </p>

            {/* Key Features / Package Deliverables */}
            <div className="space-y-2">
              <div className="text-xs font-bold uppercase tracking-wider text-[#102A36] dark:text-white">
                {activePackage ? 'Included in this Tier:' : 'Key Deliverables:'}
              </div>
              <ul className="space-y-1.5">
                {(activePackage ? activePackage.features : product.features).map((feat, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-2 text-xs text-[#52636A] dark:text-[#94A3B8]"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* CTA Buttons */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-3">
                <div className="flex items-center border border-[#E2E8F0] dark:border-[#2A3C40] rounded-xl bg-white dark:bg-[#142127] p-1">
                  <button
                    type="button"
                    onClick={() => setSelectedQuantity((q) => Math.max(1, q - 1))}
                    className="px-3 py-1.5 text-xs font-black text-slate-400 hover:text-white cursor-pointer"
                  >
                    -
                  </button>
                  <span className="px-3 py-1.5 text-xs font-mono font-bold">
                    {selectedQuantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setSelectedQuantity((q) => q + 1)}
                    className="px-3 py-1.5 text-xs font-black text-slate-400 hover:text-white cursor-pointer"
                  >
                    +
                  </button>
                </div>

                <button
                  type="button"
                  onClick={handleAddToCart}
                  className="flex-1 py-3.5 px-6 rounded-xl bg-[#0799A6] hover:bg-[#087581] text-white font-extrabold text-sm shadow-lg hover:shadow-cyan-500/25 active:scale-98 transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Order Now (₹{currentPrice * selectedQuantity})</span>
                </button>
              </div>

              {/* Direct WhatsApp Chat Action */}
              <a
                href={`https://wa.me/918527837527?text=Hello%20Annu%20Dhaneja,%20I%20want%20to%20order%20the%20${encodeURIComponent(product.title)}${activePackage ? `%20(${encodeURIComponent(activePackage.name)})` : ''}`}
                target="_blank"
                rel="noreferrer"
                className="w-full py-3 px-4 rounded-xl bg-[#25D366]/15 hover:bg-[#25D366]/25 border border-[#25D366]/40 text-emerald-600 dark:text-emerald-400 font-bold text-xs flex items-center justify-center gap-2 transition"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Quick WhatsApp Consultation / Custom Brief</span>
              </a>

              {isCopied && (
                <div className="text-center text-xs font-bold text-emerald-400 animate-pulse">
                  ✓ Link copied to clipboard!
                </div>
              )}
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-2 gap-3 pt-4 border-t border-[#E2E8F0] dark:border-[#1E2B30] text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-cyan-400" />
                <span>100% Satisfaction &amp; Unlimited Revisions</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-cyan-400" />
                <span>Fast Express Priority Queue</span>
              </div>
            </div>
          </div>
        </div>

        {/* Specs Table */}
        {product.specs && product.specs.length > 0 && (
          <div className="pt-8 border-t border-[#E2E8F0] dark:border-[#1E2B30] space-y-4">
            <h3 className="text-lg font-black text-[#102A36] dark:text-white">
              Specifications &amp; Deliverables
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
              {product.specs.map((sp, i) => (
                <div
                  key={i}
                  className="p-3 rounded-2xl bg-white dark:bg-[#111A1E] border border-[#E2E8F0] dark:border-[#1E2B30] space-y-1"
                >
                  <div className="text-[10px] uppercase font-bold text-slate-400">{sp.label}</div>
                  <div className="text-xs font-bold text-[#102A36] dark:text-white">{sp.value}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* OTHER 360° PRODUCTS SHOWCASE CAROUSEL                                    */}
        {/* ========================================================================= */}
        <div className="pt-16 border-t border-[#E2E8F0] dark:border-[#1E2B30] space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl sm:text-2xl font-black text-[#102A36] dark:text-white tracking-tight">
                Explore More 360° Luxury Products
              </h3>
              <p className="text-xs text-[#52636A] dark:text-[#94A3B8]">
                Click any product to launch its dedicated 360° rotation view
              </p>
            </div>
          </div>

          {/* Cards Grid: CLEAN, STABLE, MINIMAL CARDS (NO Card tilt/perspective) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {SHOWCASE_PRODUCTS.map((prod) => {
              const isCurrent = prod.slug === product.slug;
              return (
                <div
                  key={prod.id}
                  onClick={() => {
                    if (onNavigate) {
                      onNavigate('product-detail', prod.slug);
                    } else {
                      window.location.hash = `/product/${prod.slug}`;
                    }
                  }}
                  className={`group relative rounded-2xl p-4 border transition-all duration-300 flex flex-col justify-between cursor-pointer ${
                    isCurrent
                      ? 'border-cyan-500 bg-cyan-950/20'
                      : isDark
                      ? 'bg-[#111A1E] border-[#1E2B30] hover:border-cyan-500/50 shadow-md'
                      : 'bg-white border-[#E2E8F0] hover:border-cyan-500/50 shadow-sm'
                  }`}
                >
                  {/* Stable Card UI - Only Product Image has floating animation and scale on hover */}
                  <div>
                    {/* Category & Badge */}
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400">
                        {prod.category}
                      </span>
                      {prod.badge && (
                        <span className="px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase bg-amber-400 text-slate-950">
                          {prod.badge}
                        </span>
                      )}
                    </div>

                    {/* Product Image Container (Clean & Stable Card, Floating Product only) */}
                    <div className="relative h-44 w-full rounded-xl overflow-hidden bg-slate-950/40 mb-3 flex items-center justify-center">
                      <img
                        src={prod.mainImage}
                        alt={prod.title}
                        className="w-full h-full object-contain transition-transform duration-500 ease-out group-hover:scale-108 group-hover:-translate-y-1 drop-shadow-xl"
                      />
                      <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded-md bg-black/70 backdrop-blur-xs text-white text-[9px] font-bold">
                        360° VIEW
                      </div>
                    </div>

                    {/* Title & Price (Stable text) */}
                    <h4 className="text-sm font-bold text-[#102A36] dark:text-white line-clamp-1 group-hover:text-cyan-400 transition-colors">
                      {prod.title}
                    </h4>
                    <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">
                      {prod.subtitle}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-3 mt-3 border-t border-slate-200 dark:border-slate-800">
                    <span className="text-base font-black text-cyan-400">
                      ₹{prod.price}
                    </span>
                    <span className="text-xs font-bold text-[#0799A6] dark:text-cyan-300 group-hover:underline">
                      View 360° →
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
