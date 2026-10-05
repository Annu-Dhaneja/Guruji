import React, { useState } from 'react';
import {
  X,
  Sparkles,
  Download,
  Share2,
  Heart,
  Edit3,
  Image as ImageIcon,
  ShieldCheck,
  ShoppingBag,
  Eye,
  ZoomIn,
  ZoomOut,
  Check,
  Award,
} from 'lucide-react';
import { GurujiArtwork } from '../../types';

interface HighResPreviewModalProps {
  artwork: GurujiArtwork | null;
  isOpen: boolean;
  isFavorited?: boolean;
  onClose: () => void;
  onToggleFavorite?: (id: string) => void;
  onDownload?: (art: GurujiArtwork) => void;
  onBuy?: (art: GurujiArtwork) => void;
  onOpenCardStudio?: (art: GurujiArtwork) => void;
  onOpenPhotoStudio?: (art: GurujiArtwork) => void;
}

export const HighResPreviewModal: React.FC<HighResPreviewModalProps> = ({
  artwork,
  isOpen,
  isFavorited = false,
  onClose,
  onToggleFavorite,
  onDownload,
  onBuy,
  onOpenCardStudio,
  onOpenPhotoStudio,
}) => {
  const [zoomed, setZoomed] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!isOpen || !artwork) return null;

  const handleShareWhatsApp = () => {
    const text = `🌸 *GurucraftPro — 4K Divine Guruji Artwork* 🌸\n\n✨ *${artwork.title}*\n${artwork.hindiTitle ? `🙏 *${artwork.hindiTitle}*\n` : ''}🕊️ "${artwork.blessingMessage || artwork.description}"\n\n📱 View & Download in 4K Ultra HD:\n${window.location.href}\n\n॥ जय गुरु जी • शुकराना गुरु जी ॥`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/85 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl rounded-3xl bg-slate-900 border border-amber-500/30 shadow-2xl overflow-hidden my-8 max-h-[90vh] flex flex-col">
        {/* Modal Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/50">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-black text-white line-clamp-1">{artwork.title}</h3>
              <p className="text-[10px] text-amber-400/80 font-bold">{artwork.categoryName} • 4K Ultra HD Darshan</p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {onToggleFavorite && (
              <button
                onClick={() => onToggleFavorite(artwork.id)}
                className={`p-2 rounded-full border transition-all ${
                  isFavorited
                    ? 'bg-rose-500 text-white border-rose-400'
                    : 'bg-slate-800 text-slate-300 hover:text-rose-400 border-slate-700'
                }`}
                title={isFavorited ? 'Remove Favorite' : 'Add to Favorites'}
              >
                <Heart className={`w-4 h-4 ${isFavorited ? 'fill-current' : ''}`} />
              </button>
            )}

            <button
              onClick={onClose}
              className="p-2 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white border border-slate-700 transition-all"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="overflow-y-auto p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
            {/* Image Preview Box */}
            <div className="md:col-span-6 flex flex-col items-center">
              <div className="relative w-full rounded-2xl overflow-hidden bg-slate-950 border border-amber-500/30 shadow-2xl">
                <div
                  className={`relative overflow-hidden cursor-zoom-in ${
                    zoomed ? 'cursor-zoom-out' : ''
                  }`}
                  onClick={() => setZoomed(!zoomed)}
                >
                  <img
                    src={artwork.highResUrl || artwork.imageUrl}
                    alt={artwork.title}
                    referrerPolicy="no-referrer"
                    className={`w-full h-auto object-contain transition-transform duration-500 ${
                      zoomed ? 'scale-150' : 'scale-100'
                    }`}
                    style={{ maxHeight: '480px' }}
                  />
                </div>

                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-[11px] text-slate-300 font-medium px-3 py-1.5 rounded-xl bg-slate-950/80 backdrop-blur-md border border-slate-700">
                  <span>Aspect: {artwork.aspectRatio || '9:16'}</span>
                  <span className="flex items-center space-x-1 text-amber-300">
                    <ZoomIn className="w-3.5 h-3.5" />
                    <span>Click to {zoomed ? 'Zoom Out' : 'Zoom In 4K'}</span>
                  </span>
                </div>
              </div>
            </div>

            {/* Artwork Details & Buy / Download Hub */}
            <div className="md:col-span-6 space-y-5">
              <div>
                <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-black uppercase tracking-wider">
                  {artwork.categoryName || 'Sacred Collection'}
                </span>
                <h2 className="text-2xl font-black text-white mt-1.5 leading-tight">
                  {artwork.title}
                </h2>
                {artwork.hindiTitle && (
                  <div className="text-sm font-bold text-amber-400 mt-1">
                    {artwork.hindiTitle}
                  </div>
                )}
              </div>

              {/* Price Block */}
              <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 flex items-center justify-between">
                <div>
                  <div className="text-[11px] font-bold text-slate-400 uppercase">Pricing</div>
                  {artwork.isFree ? (
                    <div className="text-lg font-black text-emerald-400">100% Free HD Download</div>
                  ) : (
                    <div className="flex items-baseline space-x-2">
                      <span className="text-2xl font-black text-amber-400">₹{artwork.price}</span>
                      <span className="text-xs line-through text-slate-500">₹{artwork.originalPrice}</span>
                      <span className="text-xs font-bold text-emerald-400">(Special Devotee Price)</span>
                    </div>
                  )}
                </div>

                <div className="text-right text-xs text-slate-400">
                  <div>📥 {artwork.downloadsCount || 0} Downloads</div>
                  <div>❤️ {artwork.favoritesCount || 0} Devotees Loved</div>
                </div>
              </div>

              {/* Blessing Quote / Mantra */}
              <div className="p-4 rounded-2xl bg-amber-950/30 border border-amber-500/20 space-y-1.5">
                <div className="text-[10px] font-bold uppercase tracking-wider text-amber-400">
                  पावन गुरु वचन व आशीर्वाद
                </div>
                <p className="text-xs sm:text-sm font-medium text-slate-200 leading-relaxed">
                  "{artwork.blessingMessage || artwork.quote || artwork.description}"
                </p>
                {artwork.mantra && (
                  <div className="text-xs font-bold text-amber-300 pt-1">
                    {artwork.mantra}
                  </div>
                )}
              </div>

              {/* Verified Source Attribution */}
              <div className="text-xs text-slate-400 space-y-1 border-t border-slate-800 pt-3">
                <div className="flex items-center space-x-1.5 text-emerald-400 font-semibold">
                  <ShieldCheck className="w-4 h-4" />
                  <span>{artwork.sourceAttribution || 'Original Digital Art by Annu Dhaneja'}</span>
                </div>
                <div className="text-slate-500 text-[11px]">
                  Ref: {artwork.sourceReference || 'AD-GJ-2026-CATALOG'}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3 pt-2">
                {artwork.isFree ? (
                  <button
                    onClick={() => {
                      if (onDownload) onDownload(artwork);
                      else window.open(artwork.highResUrl || artwork.imageUrl, '_blank');
                    }}
                    className="w-full flex items-center justify-center space-x-2 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white font-black text-sm shadow-xl transition-all hover:scale-[1.02]"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download Free 4K HD Wallpaper</span>
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      if (onBuy) onBuy(artwork);
                    }}
                    className="w-full flex items-center justify-center space-x-2 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-black text-sm shadow-xl shadow-amber-500/20 transition-all hover:scale-[1.02]"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span>Instant Pay ₹{artwork.price} via Razorpay</span>
                  </button>
                )}

                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => {
                      onClose();
                      if (onOpenCardStudio) onOpenCardStudio(artwork);
                    }}
                    className="flex items-center justify-center space-x-1.5 py-2.5 rounded-xl bg-purple-600/80 hover:bg-purple-500 text-white text-xs font-bold border border-purple-400/30 transition-all"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Make Card</span>
                  </button>

                  <button
                    onClick={() => {
                      onClose();
                      if (onOpenPhotoStudio) onOpenPhotoStudio(artwork);
                    }}
                    className="flex items-center justify-center space-x-1.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 transition-all"
                  >
                    <ImageIcon className="w-3.5 h-3.5 text-amber-400" />
                    <span>Frame with Photo</span>
                  </button>
                </div>

                <div className="flex items-center space-x-2 pt-1">
                  <button
                    onClick={handleShareWhatsApp}
                    className="flex-1 flex items-center justify-center space-x-1.5 py-2 rounded-xl bg-emerald-950/80 hover:bg-emerald-900/80 border border-emerald-500/30 text-emerald-300 text-xs font-bold transition-all"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                    <span>Share WhatsApp</span>
                  </button>

                  <button
                    onClick={handleCopyLink}
                    className="flex-1 flex items-center justify-center space-x-1.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 text-xs font-bold transition-all"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
                    <span>{copied ? 'Link Copied!' : 'Copy Link'}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
