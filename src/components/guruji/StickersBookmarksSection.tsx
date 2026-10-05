import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Bookmark,
  Sparkles,
  Download,
  Check,
  Edit3,
  Share2,
  FileText,
  Printer,
  Wand2,
  Package,
} from 'lucide-react';
import { DigitalBookmarkItem } from '../../types';

interface StickersBookmarksSectionProps {
  onSuccessNotice?: (msg: string) => void;
}

const SEED_STICKERS = [
  {
    id: 'stk-1',
    title: 'Sacred Pranam 🙏 Sticker',
    category: 'emojis',
    imageUrl: 'https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?auto=format&fit=crop&w=400&q=80',
    format: 'Transparent PNG',
    isFree: true,
  },
  {
    id: 'stk-2',
    title: 'Golden Lotus 🪷 Badge',
    category: 'symbols',
    imageUrl: 'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?auto=format&fit=crop&w=400&q=80',
    format: 'Transparent PNG',
    isFree: true,
  },
  {
    id: 'stk-3',
    title: 'Jai Guru Ji Calligraphy Text',
    category: 'typography',
    imageUrl: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=400&q=80',
    format: 'Transparent PNG',
    isFree: true,
  },
  {
    id: 'stk-4',
    title: 'Shukrana Guruji Glow Badge',
    category: 'gratitude',
    imageUrl: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=400&q=80',
    format: 'Transparent PNG',
    isFree: true,
  },
];

const SEED_BOOKMARKS: DigitalBookmarkItem[] = [
  {
    id: 'bm-1',
    title: 'Sacred Maha Mantra Gold Bookmark',
    hindiTitle: 'महामंत्र स्वर्ण बुकमार्क',
    dimensions: '2 × 6 inches (300 DPI CMYK)',
    previewUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80',
    printablePdfUrl: '/downloads/bookmark_mantra_gold_print.pdf',
    category: 'mantra',
    isCustomizable: true,
    price: 0,
    isFree: true,
    tags: ['Printable', 'Bookmark', 'Mantra', 'Gold'],
    downloadsCount: 940,
    createdAt: '2026-08-20',
  },
  {
    id: 'bm-2',
    title: 'Amrit Vela Morning Blessing Bookmark',
    hindiTitle: 'अमृत वेला आशीर्वाद बुकमार्क',
    dimensions: '2 × 6 inches (300 DPI CMYK)',
    previewUrl: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=600&q=80',
    printablePdfUrl: '/downloads/bookmark_amrit_vela_print.pdf',
    category: 'blessing',
    isCustomizable: true,
    price: 0,
    isFree: true,
    tags: ['Printable', 'Bookmark', 'Amrit Vela'],
    downloadsCount: 780,
    createdAt: '2026-08-22',
  },
  {
    id: 'bm-3',
    title: 'Shukrana & Sabar Devotee Reading Bookmark',
    hindiTitle: 'शुकराना एवं सब्र बुकमार्क',
    dimensions: '2 × 6 inches (300 DPI CMYK)',
    previewUrl: 'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?auto=format&fit=crop&w=600&q=80',
    printablePdfUrl: '/downloads/bookmark_shukrana_print.pdf',
    category: 'gratitude',
    isCustomizable: true,
    price: 0,
    isFree: true,
    tags: ['Printable', 'Shukrana', 'Devotee'],
    downloadsCount: 1120,
    createdAt: '2026-08-24',
  },
];

export const StickersBookmarksSection: React.FC<StickersBookmarksSectionProps> = ({
  onSuccessNotice,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'stickers' | 'bookmarks'>('stickers');
  const [customName, setCustomName] = useState<string>('');
  const [selectedBookmark, setSelectedBookmark] = useState<DigitalBookmarkItem>(SEED_BOOKMARKS[0]);

  const handleDownloadStickerPack = () => {
    alert('Downloading Jai Guru Ji WhatsApp Stickers Pack (ZIP)...');
    if (onSuccessNotice) {
      onSuccessNotice('Downloaded 12 Transparent WhatsApp Stickers!');
    }
  };

  const handleDownloadBookmarkPdf = (bm: DigitalBookmarkItem) => {
    alert(`Generating print-ready 300 DPI PDF for "${bm.title}"${customName ? ` with name "${customName}"` : ''}...`);
    if (onSuccessNotice) {
      onSuccessNotice(`Printable bookmark PDF downloaded successfully!`);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300" id="stickers-bookmarks-section">
      {/* Header Spotlight */}
      <div className="relative rounded-3xl bg-gradient-to-r from-neutral-900 via-neutral-900 to-amber-950/40 border border-amber-500/30 p-6 sm:p-8 overflow-hidden shadow-2xl">
        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-bold">
            <Package className="w-3.5 h-3.5 text-amber-400" />
            <span>WhatsApp Stickers & Printable Bookmarks • 100% Free Downloads</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Digital Stickers & Sacred Bookmarks
          </h2>
          <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
            Enhance your WhatsApp satsang chats with transparent PNG stickers, or print personalized double-sided spiritual bookmarks for your holy granths and reading books.
          </p>
        </div>
      </div>

      {/* Sub Tab Switcher */}
      <div className="flex items-center gap-3 border-b border-neutral-800 pb-4">
        <button
          type="button"
          onClick={() => setActiveSubTab('stickers')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
            activeSubTab === 'stickers'
              ? 'bg-amber-500 text-neutral-950 shadow-md shadow-amber-500/20'
              : 'bg-neutral-900 text-neutral-400 hover:text-white border border-neutral-800'
          }`}
        >
          💬 WhatsApp Stickers ({SEED_STICKERS.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveSubTab('bookmarks')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
            activeSubTab === 'bookmarks'
              ? 'bg-amber-500 text-neutral-950 shadow-md shadow-amber-500/20'
              : 'bg-neutral-900 text-neutral-400 hover:text-white border border-neutral-800'
          }`}
        >
          🔖 Printable Bookmarks ({SEED_BOOKMARKS.length})
        </button>
      </div>

      {/* VIEW: STICKERS */}
      {activeSubTab === 'stickers' && (
        <div className="space-y-6">
          <div className="p-4 rounded-2xl bg-neutral-900/80 border border-neutral-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-xs space-y-1">
              <span className="font-bold text-white block">Full WhatsApp Pack (12 Stickers)</span>
              <span className="text-neutral-400">Includes Transparent PNGs with gold borders for WhatsApp, iMessage, and Telegram.</span>
            </div>
            <button
              type="button"
              onClick={handleDownloadStickerPack}
              className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs flex items-center gap-2 shadow-lg shadow-amber-500/20 active:scale-95 transition"
            >
              <Download className="w-4 h-4" /> Download Complete Pack (ZIP)
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {SEED_STICKERS.map((stk) => (
              <div
                key={stk.id}
                className="p-4 rounded-2xl bg-neutral-900 border border-neutral-800 hover:border-amber-500/50 flex flex-col items-center justify-between text-center space-y-3 transition group"
              >
                <div className="w-24 h-24 rounded-2xl bg-neutral-950 flex items-center justify-center p-2 border border-neutral-800/80 group-hover:scale-105 transition-transform">
                  <img
                    src={stk.imageUrl}
                    alt={stk.title}
                    className="max-h-full max-w-full object-contain"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">{stk.title}</h4>
                  <span className="text-[10px] text-emerald-400 font-semibold">{stk.format}</span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    alert(`Downloaded "${stk.title}" PNG sticker!`);
                  }}
                  className="w-full py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-[11px] font-semibold flex items-center justify-center gap-1"
                >
                  <Download className="w-3 h-3" /> Save PNG
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* VIEW: BOOKMARKS */}
      {activeSubTab === 'bookmarks' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Bookmark Customizer on Left */}
          <div className="lg:col-span-5 space-y-4">
            <div className="p-6 rounded-3xl bg-neutral-900 border border-neutral-800 space-y-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Wand2 className="w-4 h-4 text-amber-400" /> Customize Bookmark
              </h3>
              <div>
                <label className="block text-xs font-medium text-neutral-400 mb-1">
                  Add Devotee Family Name (Optional)
                </label>
                <input
                  type="text"
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  placeholder="e.g. Dedicated by Sharma Family"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="space-y-2 pt-2">
                <span className="text-xs text-neutral-400 font-medium block">Select Design:</span>
                {SEED_BOOKMARKS.map((bm) => (
                  <div
                    key={bm.id}
                    onClick={() => setSelectedBookmark(bm)}
                    className={`p-3 rounded-xl border cursor-pointer text-xs font-bold transition flex items-center justify-between ${
                      selectedBookmark.id === bm.id
                        ? 'bg-amber-500/15 border-amber-500 text-amber-400'
                        : 'bg-neutral-950 border-neutral-800 text-neutral-300 hover:border-neutral-700'
                    }`}
                  >
                    <span>{bm.title}</span>
                    <span className="text-[10px] text-neutral-500 font-normal">{bm.dimensions}</span>
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={() => handleDownloadBookmarkPdf(selectedBookmark)}
                className="w-full py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 active:scale-95 transition"
              >
                <Printer className="w-4 h-4" /> Download 300 DPI Printable PDF
              </button>
            </div>
          </div>

          {/* Bookmark Preview on Right */}
          <div className="lg:col-span-7 flex flex-col items-center justify-center p-8 rounded-3xl bg-neutral-900 border border-neutral-800">
            <div className="relative w-48 h-96 rounded-2xl overflow-hidden shadow-2xl border-2 border-amber-500/50 bg-neutral-950 flex flex-col justify-between p-4 text-center">
              <div className="space-y-1">
                <span className="text-[9px] uppercase tracking-widest text-amber-400 font-bold">॥ ॐ नमः शिवाय ॥</span>
                <h4 className="text-xs font-extrabold text-white font-serif">{selectedBookmark.hindiTitle}</h4>
              </div>

              <img
                src={selectedBookmark.previewUrl}
                alt={selectedBookmark.title}
                className="w-28 h-28 mx-auto rounded-full object-cover border-2 border-amber-500/60 shadow-lg"
                referrerPolicy="no-referrer"
              />

              <div className="space-y-1">
                {customName ? (
                  <p className="text-[11px] font-bold text-amber-300 italic">{customName}</p>
                ) : (
                  <p className="text-[10px] text-neutral-400">॥ जय गुरु जी सदा सहाय ॥</p>
                )}
                <span className="text-[8px] text-neutral-500 block">300 DPI CMYK Print Calibrated</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
