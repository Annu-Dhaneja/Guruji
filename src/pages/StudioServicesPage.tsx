import React, { useState } from 'react';
import {
  Search,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Layers,
  Filter
} from 'lucide-react';
import { STUDIO_SERVICES, SERVICE_CATEGORIES } from '../data/studioServicesData';
import { StudioServiceCategory } from '../types';

interface StudioServicesPageProps {
  onNavigate: (route: string) => void;
  onOpenOrderWizard: (serviceSlug?: string) => void;
}

export const StudioServicesPage: React.FC<StudioServicesPageProps> = ({
  onNavigate,
  onOpenOrderWizard,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredServices = STUDIO_SERVICES.filter((srv) => {
    const matchesCategory =
      selectedCategory === 'all' || srv.category === selectedCategory;
    const matchesSearch =
      srv.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      srv.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      srv.features.some((f) => f.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pt-20 pb-24">
      {/* Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center space-y-4">
        <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300 text-xs font-bold">
          <Sparkles className="w-3.5 h-3.5 text-amber-300" />
          <span>Complete Catalog of 26 E-Commerce Visual Solutions</span>
        </div>
        
        <h1 className="text-3xl sm:text-5xl font-black font-heading text-white tracking-tight">
          Services Engineered to Make Products Sell
        </h1>
        
        <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
          From pixel-perfect clipping paths and Amazon RGB 255 pure white backgrounds to high-converting lifestyle infographics and 3D shadows.
        </p>

        {/* Search & Filter Bar */}
        <div className="max-w-xl mx-auto pt-4">
          <div className="relative">
            <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search services (e.g. background removal, shadow, A+ content, Myntra...)"
              className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-slate-900 border border-slate-800 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 shadow-xl"
            />
          </div>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        <div className="flex items-center justify-center space-x-2 overflow-x-auto pb-2 text-xs">
          {SERVICE_CATEGORIES.map((cat) => {
            const count = cat.id === 'all'
              ? STUDIO_SERVICES.length
              : STUDIO_SERVICES.filter((s) => s.category === cat.id).length;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2.5 rounded-2xl font-bold transition-all whitespace-nowrap ${
                  selectedCategory === cat.id
                    ? 'bg-purple-600 text-white shadow-lg shadow-purple-900/40 ring-1 ring-purple-400'
                    : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                {cat.label} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* Services Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {filteredServices.length === 0 ? (
          <div className="p-16 text-center rounded-3xl bg-slate-900/40 border border-slate-800 space-y-3">
            <Layers className="w-10 h-10 text-slate-500 mx-auto" />
            <h3 className="text-base font-bold text-white">No services found</h3>
            <p className="text-xs text-slate-400">
              Try adjusting your search keywords or clear the category filter.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredServices.map((service) => (
              <div
                key={service.id}
                className="rounded-3xl bg-slate-900/70 border border-slate-800/80 hover:border-purple-500/40 p-6 flex flex-col justify-between transition-all hover:shadow-2xl hover:shadow-purple-950/20 group"
              >
                <div>
                  <div className="flex items-center justify-between text-xs mb-3">
                    <span className="px-2.5 py-1 rounded-full bg-slate-800 text-cyan-300 font-bold text-[10px] tracking-wider uppercase border border-slate-700/60">
                      {service.categoryLabel}
                    </span>
                    <span className="text-[11px] font-semibold text-amber-400 flex items-center space-x-1">
                      <Clock className="w-3 h-3" />
                      <span>{service.deliveryTime}</span>
                    </span>
                  </div>

                  <h3 className="text-lg font-bold font-heading text-white group-hover:text-purple-300 transition-colors">
                    {service.title}
                  </h3>

                  <p className="text-xs text-slate-400 line-clamp-2 mt-2 leading-relaxed">
                    {service.description}
                  </p>

                  {/* Bullet Highlights */}
                  <div className="mt-4 pt-4 border-t border-slate-800/80 space-y-1.5">
                    {service.features.slice(0, 3).map((feat, idx) => (
                      <div key={idx} className="flex items-center space-x-2 text-xs text-slate-300">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span className="truncate">{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-500 block uppercase">Starting From</span>
                    <span className="text-lg font-black text-white">₹{service.startingPrice}</span>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      type="button"
                      onClick={() => onNavigate(`service-${service.slug}`)}
                      className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors"
                    >
                      Details
                    </button>
                    <button
                      type="button"
                      onClick={() => onOpenOrderWizard(service.slug)}
                      className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold shadow-md shadow-purple-900/30 transition-all flex items-center space-x-1"
                    >
                      <span>Order</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Free Sample Callout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
        <div className="p-8 rounded-3xl bg-gradient-to-r from-purple-950 via-slate-900 to-cyan-950 border border-purple-500/30 flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl">
          <div className="space-y-1 text-center md:text-left">
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400">
              Zero Commitment Guarantee
            </span>
            <h3 className="text-xl sm:text-2xl font-black text-white">
              Want to see our quality first? Test us with 1 free sample photo!
            </h3>
            <p className="text-xs text-slate-300 max-w-lg">
              Send us any raw product shot. We will edit it to Amazon/Flipkart standard and deliver it in 12 hours for free.
            </p>
          </div>

          <button
            type="button"
            onClick={() => onNavigate('contact')}
            className="px-6 py-3.5 rounded-2xl bg-white hover:bg-slate-100 text-slate-950 font-black text-xs shadow-xl shrink-0 transition-transform hover:scale-105"
          >
            Claim Free Sample Edit
          </button>
        </div>
      </div>
    </div>
  );
};
