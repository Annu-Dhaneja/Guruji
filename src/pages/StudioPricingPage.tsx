import React, { useState } from 'react';
import {
  Sparkles,
  CheckCircle2,
  ArrowRight,
  Calculator,
  ShieldCheck,
  Clock,
  Layers,
  Zap,
  HelpCircle
} from 'lucide-react';
import { PACKAGE_TIERS } from '../data/studioServicesData';

interface StudioPricingPageProps {
  onNavigate: (route: string) => void;
  onOpenOrderWizard: (serviceSlug?: string) => void;
}

export const StudioPricingPage: React.FC<StudioPricingPageProps> = ({
  onNavigate,
  onOpenOrderWizard,
}) => {
  const [imageCount, setImageCount] = useState<number>(35);
  const [slaSpeed, setSlaSpeed] = useState<'standard' | 'express'>('standard');

  // Calculate volume pricing based on image count
  const getRatePerImage = (count: number) => {
    if (count <= 10) return 79;
    if (count <= 50) return 59;
    if (count <= 150) return 49;
    return 39;
  };

  const currentRate = getRatePerImage(imageCount);
  const slaMultiplier = slaSpeed === 'express' ? 1.25 : 1.0;
  const subtotal = Math.round(imageCount * currentRate * slaMultiplier);
  const gst = Math.round(subtotal * 0.18);
  const totalCost = subtotal + gst;

  const baselineCost = imageCount * 79;
  const savings = Math.max(0, baselineCost - subtotal);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pt-20 pb-24">
      {/* Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center space-y-4">
        <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300 text-xs font-bold">
          <Sparkles className="w-3.5 h-3.5 text-amber-300" />
          <span>Transparent E-Commerce Studio Rates</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-black font-heading text-white tracking-tight">
          Simple, Predictable Pricing for Indian Sellers
        </h1>

        <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
          No hidden fees or locked contracts. Pay per image or choose high-volume catalog bundles with 100% marketplace compliance guarantee.
        </p>
      </div>

      {/* Interactive Volume Calculator */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        <div className="p-6 sm:p-10 rounded-3xl bg-slate-900 border border-purple-500/30 shadow-2xl space-y-8">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div className="flex items-center space-x-2">
              <Calculator className="w-5 h-5 text-purple-400" />
              <h2 className="text-lg sm:text-xl font-bold font-heading text-white">
                Interactive Catalog Volume Calculator
              </h2>
            </div>
            <span className="text-xs px-2.5 py-1 rounded-full bg-purple-500/20 text-purple-300 font-mono font-bold">
              ₹{currentRate} / image
            </span>
          </div>

          {/* Slider input */}
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs font-semibold">
              <span className="text-slate-400">Total Images to Edit:</span>
              <span className="text-xl font-black text-amber-400 font-mono">{imageCount} Images</span>
            </div>

            <input
              type="range"
              min={1}
              max={300}
              value={imageCount}
              onChange={(e) => setImageCount(Number(e.target.value))}
              className="w-full h-2.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-purple-500"
            />

            <div className="flex justify-between text-[11px] text-slate-500 font-mono">
              <span>1 Image (Starter)</span>
              <span>50 Images (Growth)</span>
              <span>150 Images (Catalog)</span>
              <span>300+ Images (Bulk)</span>
            </div>
          </div>

          {/* SLA Speed Selection */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <button
              type="button"
              onClick={() => setSlaSpeed('standard')}
              className={`p-4 rounded-2xl border text-left transition-all ${
                slaSpeed === 'standard'
                  ? 'bg-purple-950/40 border-purple-500 shadow-md ring-1 ring-purple-500'
                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs font-bold text-white">Standard Delivery</span>
                <span className="text-[10px] text-cyan-400 font-bold">24 to 36 Hours</span>
              </div>
              <p className="text-[11px] text-slate-400">Regular production pipeline, rigorous QA.</p>
            </button>

            <button
              type="button"
              onClick={() => setSlaSpeed('express')}
              className={`p-4 rounded-2xl border text-left transition-all ${
                slaSpeed === 'express'
                  ? 'bg-purple-950/40 border-purple-500 shadow-md ring-1 ring-purple-500'
                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs font-bold text-white">Express Rush SLA (+25%)</span>
                <span className="text-[10px] text-amber-400 font-bold">12 to 18 Hours</span>
              </div>
              <p className="text-[11px] text-slate-400">Priority queue for urgent product launches.</p>
            </button>
          </div>

          {/* Calculation Breakdown Result Box */}
          <div className="p-5 rounded-2xl bg-slate-950 border border-purple-500/20 grid grid-cols-1 sm:grid-cols-3 gap-4 text-center items-center">
            <div>
              <span className="text-[11px] text-slate-400 block">Calculated Rate</span>
              <span className="text-xl font-bold text-white font-mono">₹{currentRate}</span>
              <span className="text-[10px] text-slate-500 block">per edited file</span>
            </div>

            {savings > 0 && (
              <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30">
                <span className="text-[10px] text-emerald-400 block uppercase font-bold">Volume Savings</span>
                <span className="text-base font-black text-emerald-300">Save ₹{savings}</span>
              </div>
            )}

            <div>
              <span className="text-[11px] text-slate-400 block">Total Payable (incl. GST)</span>
              <span className="text-2xl font-black text-amber-400 font-mono">₹{totalCost}</span>
            </div>
          </div>

          <div className="text-center pt-2">
            <button
              type="button"
              onClick={() => onOpenOrderWizard()}
              className="w-full sm:w-auto px-10 py-4 rounded-2xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-sm shadow-xl shadow-purple-900/40 transition-transform hover:scale-105 inline-flex items-center space-x-2"
            >
              <span>Order {imageCount} Images Now</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Package Tiers Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold font-heading text-white">
            Pre-Configured Studio Packages
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Choose the tier matching your monthly catalog volume.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {PACKAGE_TIERS.map((pkg) => (
            <div
              key={pkg.id}
              className={`rounded-3xl border p-8 flex flex-col justify-between transition-all relative ${
                pkg.isPopular
                  ? 'bg-purple-950/30 border-purple-500 shadow-2xl shadow-purple-950/40 ring-1 ring-purple-400'
                  : 'bg-slate-900/70 border-slate-800'
              }`}
            >
              {pkg.isPopular && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-amber-400 to-purple-500 text-slate-950 text-[10px] font-black uppercase tracking-wider shadow-lg">
                  Most Popular for Sellers
                </div>
              )}

              <div>
                <h3 className="text-xl font-bold font-heading text-white">{pkg.name}</h3>
                <p className="text-xs text-slate-400 mt-1">{pkg.tagline}</p>

                <div className="mt-6 mb-6">
                  <span className="text-4xl font-black text-white font-mono">₹{pkg.pricePerImage}</span>
                  <span className="text-xs text-slate-400"> / image</span>
                  <p className="text-[11px] text-purple-400 mt-1 font-medium">{pkg.volumeRange}</p>
                </div>

                <div className="pt-4 border-t border-slate-800 space-y-3">
                  <span className="text-[11px] font-bold text-slate-300 uppercase tracking-wider block">
                    What's Included:
                  </span>
                  {pkg.features.map((feat, idx) => (
                    <div key={idx} className="flex items-center space-x-2 text-xs text-slate-300">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => onOpenOrderWizard()}
                  className={`w-full py-3.5 rounded-2xl font-bold text-xs transition-all ${
                    pkg.isPopular
                      ? 'bg-purple-600 hover:bg-purple-500 text-white shadow-lg shadow-purple-900/40'
                      : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
                  }`}
                >
                  Choose {pkg.name}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Marketplace Bundle Deals */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 rounded-3xl bg-slate-900 border border-slate-800">
          <div className="text-center max-w-2xl mx-auto mb-8">
            <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">
              Complete Listing Kits
            </span>
            <h3 className="text-xl sm:text-2xl font-bold font-heading text-white mt-1">
              All-In-One Marketplace Listing Packs
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
            <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
              <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-bold text-[10px]">
                Amazon India
              </span>
              <h4 className="text-base font-bold text-white">Full 7-Image Listing Pack</h4>
              <p className="text-slate-400">1 Hero Pure White + 3 Feature Infographics + 2 Lifestyle + 1 Size/Spec diagram.</p>
              <div className="text-lg font-black text-amber-400">₹1,999 / SKU</div>
            </div>

            <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
              <span className="px-2 py-0.5 rounded-full bg-pink-500/20 text-pink-300 font-bold text-[10px]">
                Myntra Fashion
              </span>
              <h4 className="text-base font-bold text-white">5-Image Editorial Pack</h4>
              <p className="text-slate-400">Front, back, side angle, fabric zoom detail, and editorial lifestyle in 3:4 aspect.</p>
              <div className="text-lg font-black text-cyan-400">₹1,499 / SKU</div>
            </div>

            <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold text-[10px]">
                Shopify D2C
              </span>
              <h4 className="text-base font-bold text-white">Branded 3D Shadow Pack</h4>
              <p className="text-slate-400">Floating reflection shadow, color variant swatches, transparent PNGs, and social ad crop.</p>
              <div className="text-lg font-black text-emerald-400">₹1,799 / SKU</div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};
