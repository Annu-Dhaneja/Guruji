import React, { useState } from 'react';
import {
  Sparkles,
  ArrowRight,
  TrendingUp,
  ShieldCheck,
  CheckCircle2,
  Filter
} from 'lucide-react';
import { PORTFOLIO_SHOWCASE } from '../data/studioServicesData';
import { BeforeAfterSlider } from '../components/BeforeAfterSlider';

interface StudioPortfolioPageProps {
  onNavigate: (route: string) => void;
  onOpenOrderWizard: (serviceSlug?: string) => void;
}

export const StudioPortfolioPage: React.FC<StudioPortfolioPageProps> = ({
  onNavigate,
  onOpenOrderWizard,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = [
    { id: 'all', label: 'All Projects' },
    { id: 'Watches & Jewelry', label: 'Watches & Luxury' },
    { id: 'Cosmetics & Skincare', label: 'Cosmetics & Beauty' },
    { id: 'Footwear & Fashion', label: 'Footwear & Sneakers' },
  ];

  const filteredItems = PORTFOLIO_SHOWCASE.filter((item) => {
    if (selectedCategory === 'all') return true;
    return item.category === selectedCategory;
  });

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pt-20 pb-24">
      {/* Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center space-y-4">
        <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300 text-xs font-bold">
          <Sparkles className="w-3.5 h-3.5 text-amber-300" />
          <span>Proven E-Commerce Visual Transformations</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-black font-heading text-white tracking-tight">
          Visuals That Drive Verified Marketplace Sales
        </h1>

        <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
          Explore real client before-and-after transformations. Drag the interactive sliders to inspect pen-tool clipping accuracy, scratch retouching, and true-to-life color calibration.
        </p>
      </div>

      {/* Category Filter */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-10">
        <div className="flex items-center justify-center space-x-2 overflow-x-auto text-xs">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2.5 rounded-2xl font-bold transition-all whitespace-nowrap ${
                selectedCategory === cat.id
                  ? 'bg-purple-600 text-white shadow-lg shadow-purple-900/40 ring-1 ring-purple-400'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Portfolio Showcase Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {filteredItems.map((item, idx) => (
          <div
            key={item.id}
            className={`grid grid-cols-1 lg:grid-cols-12 gap-8 items-center p-6 sm:p-8 rounded-3xl bg-slate-900/60 border border-slate-800/80 shadow-2xl ${
              idx % 2 === 1 ? 'lg:flex-row-reverse' : ''
            }`}
          >
            {/* Visual Slider Column */}
            <div className="lg:col-span-7">
              <BeforeAfterSlider
                beforeImage={item.beforeUrl}
                afterImage={item.afterUrl}
                beforeLabel="Original Camera RAW"
                afterLabel="Gurucraftpro Edited Proof"
                aspectRatio="aspect-[4/3] sm:aspect-[16/10]"
              />
            </div>

            {/* Details & ROI Metrics Column */}
            <div className="lg:col-span-5 space-y-5">
              <div className="flex items-center space-x-2">
                <span className="px-2.5 py-1 rounded-full bg-slate-800 text-cyan-300 font-bold text-[10px] tracking-wider uppercase border border-slate-700/60">
                  {item.category}
                </span>
                <span className="px-2.5 py-1 rounded-full bg-purple-500/10 text-purple-300 font-bold text-[10px] tracking-wider uppercase border border-purple-500/30">
                  {item.marketplace}
                </span>
              </div>

              <h3 className="text-2xl font-bold font-heading text-white">
                {item.title}
              </h3>

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                {item.description}
              </p>

              {/* Conversion ROI Metric Pill */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-950/40 to-slate-900 border border-emerald-500/30 flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider block">
                    Verified Seller Impact
                  </span>
                  <span className="text-sm font-bold text-emerald-300">
                    {item.results}
                  </span>
                </div>
              </div>

              {/* Retouching Checklist */}
              {item.retouchPoints && item.retouchPoints.length > 0 && (
                <div className="space-y-1.5 pt-2 border-t border-slate-800">
                  <span className="text-[11px] font-bold text-slate-400 block uppercase">
                    Photoshop Transformations:
                  </span>
                  {item.retouchPoints.map((point, pIdx) => (
                    <div key={pIdx} className="flex items-center space-x-2 text-xs text-slate-300">
                      <CheckCircle2 className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                      <span>{point}</span>
                    </div>
                  ))}
                </div>
              )}

              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => onOpenOrderWizard()}
                  className="px-6 py-3 rounded-2xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-lg shadow-purple-900/40 transition-transform hover:scale-105 inline-flex items-center space-x-2"
                >
                  <span>Request Similar Transformation</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom CTA */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-20 text-center">
        <div className="p-8 sm:p-12 rounded-3xl bg-slate-900 border border-purple-500/30 space-y-4">
          <h2 className="text-2xl sm:text-3xl font-black font-heading text-white">
            Have high-SKU catalogs that need rapid retouching?
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto">
            Our creative studio edits hundreds of e-commerce photos daily for top brands across Delhi NCR, Mumbai, Bengaluru, and pan-India.
          </p>
          <div className="pt-2">
            <button
              type="button"
              onClick={() => onOpenOrderWizard()}
              className="px-8 py-4 rounded-2xl bg-white hover:bg-slate-100 text-slate-950 font-black text-sm shadow-xl inline-flex items-center space-x-2"
            >
              <span>Start Your Catalog Project</span>
              <ArrowRight className="w-4 h-4 text-purple-600" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
