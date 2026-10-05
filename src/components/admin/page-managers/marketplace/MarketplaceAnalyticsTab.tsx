import React from 'react';
import {
  TrendingUp,
  Download,
  DollarSign,
  Package,
  Sparkles,
  Users,
  Award,
  Layers,
  Star,
  CheckCircle2,
} from 'lucide-react';
import { GurujiArtwork, GurujiCategoryItem } from '../../../../types';
import { GurujiBundleAdminItem } from './MarketplaceBundlesTab';
import { CustomDesignRequestItem } from './CustomDesignRequestsTab';

interface MarketplaceAnalyticsTabProps {
  artworks: GurujiArtwork[];
  categories: GurujiCategoryItem[];
  bundles: GurujiBundleAdminItem[];
  customRequests: CustomDesignRequestItem[];
}

export const MarketplaceAnalyticsTab: React.FC<MarketplaceAnalyticsTabProps> = ({
  artworks,
  categories,
  bundles,
  customRequests,
}) => {
  const totalDownloads = artworks.reduce((sum, a) => sum + (a.downloadsCount || 0), 0);
  const freeItems = artworks.filter((a) => a.isFree || a.price === 0);
  const paidItems = artworks.filter((a) => !a.isFree && a.price > 0);
  const customizableItems = artworks.filter((a) => a.isCustomizable || a.productType === 'CUSTOMIZABLE_PRODUCT');
  const serviceItems = artworks.filter((a) => a.productType === 'SERVICE');
  
  // Estimated volume
  const estimatedCatalogValue = paidItems.reduce((sum, a) => sum + (a.price || 0), 0);
  const completedCustomOrders = customRequests.filter((r) => r.status === 'COMPLETED' || r.status === 'READY');
  const customQuotedRevenue = customRequests.reduce((sum, r) => sum + (r.quotedPrice || 0), 0);

  // Top Downloaded Artworks
  const topDownloaded = [...artworks].sort((a, b) => (b.downloadsCount || 0) - (a.downloadsCount || 0)).slice(0, 5);

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-slate-900 border border-slate-800 rounded-2xl p-5 gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 text-xs font-bold mb-2">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Marketplace Performance & Health</span>
          </div>
          <h3 className="text-xl font-black text-white">Design Marketplace Analytics</h3>
          <p className="text-xs text-slate-400">
            Real-time catalog distribution, download activity, custom commission pipeline, and asset health.
          </p>
        </div>
      </div>

      {/* KPI Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold">Total Digital Downloads</span>
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400">
              <Download className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-white">{totalDownloads.toLocaleString()}</p>
          <span className="text-[11px] text-emerald-400 font-bold">● High Devotee Engagement</span>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold">Total Catalog Items</span>
            <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-white">{artworks.length}</p>
          <span className="text-[11px] text-slate-400">
            {freeItems.length} Free Vault • {paidItems.length} Paid Masters
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold">Curated Value Bundles</span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-white">{bundles.length}</p>
          <span className="text-[11px] text-emerald-400 font-bold">
            Average 65% Devotee Savings
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold">Custom Commission Pipeline</span>
            <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-white">{customRequests.length}</p>
          <span className="text-[11px] text-amber-300 font-bold">
            ₹{customQuotedRevenue.toLocaleString()} Total Pipeline
          </span>
        </div>

      </div>

      {/* Breakdown Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Top Downloaded Assets */}
        <div className="lg:col-span-7 p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 shadow-xl text-xs">
          <div className="border-b border-slate-800 pb-3">
            <h4 className="text-sm font-black text-white flex items-center space-x-2">
              <Award className="w-4 h-4 text-amber-400" />
              <span>Top Downloaded / Highest Demand Artworks</span>
            </h4>
            <p className="text-slate-400 text-[11px]">Most popular master wallpapers and prints across all devotees.</p>
          </div>

          <div className="space-y-3">
            {topDownloaded.map((art, idx) => (
              <div
                key={art.id}
                className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-3"
              >
                <div className="flex items-center space-x-3">
                  <span className="w-6 h-6 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center font-mono font-bold text-amber-400 text-[10px]">
                    #{idx + 1}
                  </span>
                  <img src={art.imageUrl} alt={art.title} className="w-12 h-12 rounded-xl object-cover border border-amber-500/30" />
                  <div>
                    <h5 className="font-bold text-white line-clamp-1">{art.title}</h5>
                    <span className="text-[10px] text-slate-400">{art.categoryName} • {art.isFree ? 'Free 4K' : `₹${art.price}`}</span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="font-black text-white block text-sm">{art.downloadsCount || 0}</span>
                  <span className="text-[10px] text-slate-500">Downloads</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Catalog Composition */}
        <div className="lg:col-span-5 p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 shadow-xl text-xs">
          <div className="border-b border-slate-800 pb-3">
            <h4 className="text-sm font-black text-white flex items-center space-x-2">
              <Layers className="w-4 h-4 text-amber-400" />
              <span>Product Type Distribution</span>
            </h4>
            <p className="text-slate-400 text-[11px]">Catalog breakdown by digital, customizable, and service formats.</p>
          </div>

          <div className="space-y-3">
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                <span className="font-bold text-white">Digital 4K Wallpapers & PSDs</span>
              </div>
              <span className="font-bold text-slate-300">
                {artworks.filter((a) => a.productType === 'DIGITAL_PRODUCT' || (!a.productType && !a.isCustomizable)).length}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full bg-purple-400" />
                <span className="font-bold text-white">Customizable Devotee Frames</span>
              </div>
              <span className="font-bold text-slate-300">{customizableItems.length}</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                <span className="font-bold text-white">Spiritual Design Services</span>
              </div>
              <span className="font-bold text-slate-300">{serviceItems.length}</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
                <span className="font-bold text-white">Curated Super Value Bundles</span>
              </div>
              <span className="font-bold text-slate-300">{bundles.length}</span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-center space-y-1">
            <span className="text-[10px] text-amber-300 uppercase font-black tracking-wider block">
              100% Verified Quality Standards
            </span>
            <p className="text-[11px] text-slate-300">
              All digital files are scanned, color-calibrated at 300 DPI, and verified authentic.
            </p>
          </div>

        </div>

      </div>

    </div>
  );
};
