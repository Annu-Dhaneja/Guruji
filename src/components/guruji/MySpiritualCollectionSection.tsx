import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Sparkles,
  Download,
  Heart,
  FileText,
  Clock,
  ShieldCheck,
  Smartphone,
  ExternalLink,
  Package,
  Layers,
  CheckCircle2,
} from 'lucide-react';
import { GurujiArtwork } from '../../types';

interface MySpiritualCollectionSectionProps {
  artworks: GurujiArtwork[];
  favoriteIds: string[];
  onDownload: (art: GurujiArtwork) => void;
  onNavigateToStore: () => void;
}

export const MySpiritualCollectionSection: React.FC<MySpiritualCollectionSectionProps> = ({
  artworks,
  favoriteIds,
  onDownload,
  onNavigateToStore,
}) => {
  const [activeTab, setActiveTab] = useState<'downloads' | 'favorites' | 'orders'>('downloads');

  const favoriteArtworks = artworks.filter((a) => favoriteIds.includes(a.id));
  const downloadedArtworks = artworks.slice(0, 4); // User's library

  return (
    <div className="space-y-8 animate-in fade-in duration-300" id="my-spiritual-collection-section">
      {/* Header Spotlight */}
      <div className="relative rounded-3xl bg-gradient-to-r from-neutral-900 via-neutral-900 to-amber-950/40 border border-amber-500/30 p-6 sm:p-8 overflow-hidden shadow-2xl">
        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-bold">
            <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
            <span>Lifetime Vault • Cloud Access</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            My Sacred Spiritual Collection
          </h2>
          <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
            Access all your purchased 4K master files, saved daily vachans, favorite quotes, printable bookmarks, and donation receipts in one secure private sanctuary.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-3 border-b border-neutral-800 pb-4">
        <button
          type="button"
          onClick={() => setActiveTab('downloads')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
            activeTab === 'downloads'
              ? 'bg-amber-500 text-neutral-950 shadow-md shadow-amber-500/20'
              : 'bg-neutral-900 text-neutral-400 hover:text-white border border-neutral-800'
          }`}
        >
          <Download className="w-3.5 h-3.5" /> My Downloads ({downloadedArtworks.length})
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('favorites')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
            activeTab === 'favorites'
              ? 'bg-amber-500 text-neutral-950 shadow-md shadow-amber-500/20'
              : 'bg-neutral-900 text-neutral-400 hover:text-white border border-neutral-800'
          }`}
        >
          <Heart className="w-3.5 h-3.5" /> Saved Favorites ({favoriteArtworks.length})
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('orders')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
            activeTab === 'orders'
              ? 'bg-amber-500 text-neutral-950 shadow-md shadow-amber-500/20'
              : 'bg-neutral-900 text-neutral-400 hover:text-white border border-neutral-800'
          }`}
        >
          <FileText className="w-3.5 h-3.5" /> Order Receipts & Seva
        </button>
      </div>

      {/* VIEW: DOWNLOADS */}
      {activeTab === 'downloads' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {downloadedArtworks.map((art) => (
              <div
                key={art.id}
                className="p-4 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-3 flex flex-col justify-between"
              >
                <div className="flex gap-3">
                  <img
                    src={art.thumbnailUrl || art.imageUrl}
                    alt={art.title}
                    className="w-20 h-20 rounded-xl object-cover shrink-0 border border-neutral-800"
                  />
                  <div className="space-y-1 min-w-0">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300">
                      Active Cloud License
                    </span>
                    <h4 className="text-xs font-bold text-white truncate">{art.title}</h4>
                    <p className="text-[11px] text-neutral-400">{art.fileFormat || '4K Ultra HD PNG'}</p>
                  </div>
                </div>

                <div className="pt-2 border-t border-neutral-800 flex items-center justify-between">
                  <span className="text-[11px] text-neutral-500">Unlimited Downloads</span>
                  <button
                    type="button"
                    onClick={() => onDownload(art)}
                    className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs flex items-center gap-1"
                  >
                    <Download className="w-3.5 h-3.5" /> Re-Download
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* VIEW: FAVORITES */}
      {activeTab === 'favorites' && (
        <div>
          {favoriteArtworks.length === 0 ? (
            <div className="p-12 text-center rounded-3xl bg-neutral-900 border border-neutral-800 space-y-3">
              <Heart className="w-10 h-10 text-neutral-600 mx-auto" />
              <h4 className="text-base font-bold text-white">No Saved Favorites Yet</h4>
              <p className="text-xs text-neutral-400">
                Click the heart icon on any artwork, quote, or vachan to save it to your private collection.
              </p>
              <button
                type="button"
                onClick={onNavigateToStore}
                className="px-4 py-2 rounded-xl bg-amber-500 text-neutral-950 font-bold text-xs"
              >
                Browse Sacred Store
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {favoriteArtworks.map((art) => (
                <div
                  key={art.id}
                  className="p-4 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-3 flex flex-col justify-between"
                >
                  <div className="flex gap-3">
                    <img
                      src={art.thumbnailUrl || art.imageUrl}
                      alt={art.title}
                      className="w-20 h-20 rounded-xl object-cover shrink-0 border border-neutral-800"
                    />
                    <div className="space-y-1 min-w-0">
                      <h4 className="text-xs font-bold text-white truncate">{art.title}</h4>
                      <p className="text-[11px] text-neutral-400">{art.categoryName}</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => onDownload(art)}
                    className="w-full py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white font-bold text-xs flex items-center justify-center gap-1.5"
                  >
                    <Download className="w-3.5 h-3.5 text-amber-400" /> Download
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* VIEW: ORDERS */}
      {activeTab === 'orders' && (
        <div className="p-6 rounded-3xl bg-neutral-900 border border-neutral-800 space-y-4">
          <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
            <h4 className="text-sm font-bold text-white">Recent Purchases & Seva Contributions</h4>
            <span className="text-xs text-neutral-400">All payments secured by Razorpay</span>
          </div>

          <div className="space-y-3 text-xs">
            <div className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="text-amber-400 font-bold block">Order #ORD-2026-8819</span>
                <span className="text-neutral-300">Mandir Langar Seva Contribution (₹501)</span>
                <span className="text-neutral-500 block text-[11px]">Date: 28 Aug 2026 • Status: Paid</span>
              </div>
              <button
                type="button"
                onClick={() => alert('Downloading official 80G Tax Exemption Donation Receipt...')}
                className="px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-200 font-semibold text-xs flex items-center gap-1.5 self-start sm:self-auto"
              >
                <Download className="w-3 h-3" /> Tax Receipt PDF
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
