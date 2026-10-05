import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Package,
  Layers,
  Sparkles,
  CheckCircle,
  ShoppingCart,
  Zap,
  ArrowRight,
  ShieldCheck,
  Download,
} from 'lucide-react';
import { MarketplaceBundle } from '../../types';
import { useCart } from '../../context/CartContext';

interface MarketplaceBundlesSectionProps {
  bundles: MarketplaceBundle[];
  onSelectBundle?: (bundle: MarketplaceBundle) => void;
}

export const MarketplaceBundlesSection: React.FC<MarketplaceBundlesSectionProps> = ({
  bundles,
  onSelectBundle,
}) => {
  const { addItem } = useCart();
  const [addedBundleId, setAddedBundleId] = useState<string | null>(null);

  const handleAddBundleToCart = (bundle: MarketplaceBundle) => {
    addItem({
      id: bundle.id,
      name: bundle.title,
      price: bundle.bundlePrice,
      quantity: 1,
      image: bundle.bannerImageUrl,
      serviceType: 'graphic-design',
      isDigital: true,
      originalPrice: bundle.originalTotalValue,
    });
    setAddedBundleId(bundle.id);
    setTimeout(() => setAddedBundleId(null), 2500);
  };

  if (!bundles || bundles.length === 0) return null;

  return (
    <section className="my-10" id="marketplace-bundles-section">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 gap-2">
        <div>
          <div className="flex items-center gap-2 text-amber-400 font-bold text-xs uppercase tracking-wider mb-1">
            <Package className="w-4 h-4" /> Curated Master Bundles
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Complete Design Suites & Value Packs
          </h2>
          <p className="text-xs sm:text-sm text-neutral-400 mt-0.5">
            Save up to 75% on bulk high-resolution assets, festive kits, and printable frame collections.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {bundles.map((bundle) => {
          const isAdded = addedBundleId === bundle.id;

          return (
            <motion.div
              key={bundle.id}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              whileHover={{ y: -4 }}
              className="relative flex flex-col justify-between rounded-2xl bg-neutral-900/90 border border-neutral-800 hover:border-amber-500/40 transition-all duration-300 shadow-xl overflow-hidden backdrop-blur-sm group"
              id={`bundle-card-${bundle.id}`}
            >
              {/* Banner Image */}
              <div className="relative h-44 w-full overflow-hidden bg-neutral-950">
                <img
                  src={bundle.bannerImageUrl}
                  alt={bundle.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-neutral-900 via-neutral-900/30 to-transparent" />

                {/* Top Badges */}
                <div className="absolute top-3 left-3 flex gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-extrabold bg-gradient-to-r from-amber-500 to-amber-600 text-neutral-950 shadow-md">
                    {bundle.badge || 'MEGA BUNDLE'}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-purple-600/90 text-white backdrop-blur-md">
                    {bundle.totalItemsCount} Designs Included
                  </span>
                </div>

                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                  <span className="text-[11px] font-medium text-emerald-400 bg-black/60 px-2 py-0.5 rounded backdrop-blur-md">
                    Instant 4K Cloud Download
                  </span>
                  <span className="text-xs font-bold text-amber-400 bg-black/60 px-2 py-0.5 rounded backdrop-blur-md">
                    Save ₹{bundle.savingsAmount || (bundle.originalTotalValue - bundle.bundlePrice)}
                  </span>
                </div>
              </div>

              {/* Bundle Content */}
              <div className="p-5 flex flex-col flex-grow justify-between gap-4">
                <div>
                  <h3 className="font-bold text-white text-base sm:text-lg group-hover:text-amber-400 transition-colors">
                    {bundle.title}
                  </h3>
                  {bundle.tagline && (
                    <p className="text-xs text-amber-400/90 font-medium mt-0.5">
                      {bundle.tagline}
                    </p>
                  )}
                  <p className="text-xs text-neutral-400 line-clamp-2 mt-2 leading-relaxed">
                    {bundle.description}
                  </p>

                  {/* Included Items Checklist */}
                  <div className="mt-3.5 space-y-1.5 bg-neutral-950/60 p-3 rounded-xl border border-neutral-800/80">
                    <span className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider block mb-1">
                      Included in this Suite:
                    </span>
                    {bundle.includedItems?.map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between text-xs text-neutral-300">
                        <div className="flex items-center gap-1.5 truncate">
                          <CheckCircle className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                          <span className="truncate">{item.title}</span>
                        </div>
                        <span className="text-[10px] text-neutral-500 ml-2 font-mono flex-shrink-0">
                          {item.format}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Pricing & CTAs */}
                <div className="pt-3 border-t border-neutral-800 flex items-center justify-between gap-3">
                  <div>
                    <span className="text-[10px] text-neutral-500 uppercase tracking-wider block">Bundle Price</span>
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-xl font-extrabold text-white">₹{bundle.bundlePrice}</span>
                      <span className="text-xs text-neutral-500 line-through">₹{bundle.originalTotalValue}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleAddBundleToCart(bundle)}
                      className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all active:scale-95 ${
                        isAdded
                          ? 'bg-emerald-600 text-white'
                          : 'bg-neutral-800 hover:bg-neutral-700 text-neutral-200 border border-neutral-700'
                      }`}
                      id={`add-bundle-cart-${bundle.id}`}
                    >
                      {isAdded ? (
                        <>
                          <CheckCircle className="w-3.5 h-3.5 text-white" /> Added
                        </>
                      ) : (
                        <>
                          <ShoppingCart className="w-3.5 h-3.5 text-amber-400" /> Add Bundle
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() => handleAddBundleToCart(bundle)}
                      className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-neutral-950 text-xs font-extrabold flex items-center gap-1 shadow-md hover:shadow-amber-500/20 transition-all active:scale-95"
                      id={`buy-bundle-btn-${bundle.id}`}
                    >
                      <Zap className="w-3.5 h-3.5 fill-current" /> Buy Now
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
};
