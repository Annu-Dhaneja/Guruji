import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Sparkles,
  Heart,
  Share2,
  Copy,
  Download,
  Check,
  Search,
  Filter,
  Volume2,
  Bookmark,
  Sun,
  Flame,
} from 'lucide-react';
import { JaiGuruJiQuoteItem } from '../../types';

interface QuotesGallerySectionProps {
  onQuoteDownload?: (quote: JaiGuruJiQuoteItem) => void;
  onSuccessNotice?: (msg: string) => void;
}

export const INITIAL_GURUJI_QUOTES: JaiGuruJiQuoteItem[] = [
  {
    id: 'quote-1',
    quoteNumber: 1,
    text: 'चिंता ना कर, सब ठीक हो जाएगा। मेरे पे भरोसा रख।',
    hindiText: 'चिंता ना कर, सब ठीक हो जाएगा। मेरे पे भरोसा रख।',
    englishText: 'Do not worry, everything will be fine. Keep your complete faith in me.',
    category: 'faith',
    categoryLabel: 'Faith & Trust (विश्वास)',
    author: 'Guruji Sacred Words',
    imageUrl: 'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?auto=format&fit=crop&w=800&q=80',
    likesCount: 1420,
    sharesCount: 520,
    isFree: true,
    tags: ['Faith', 'Worry Free', 'Surrender', 'Blessings'],
    createdAt: '2026-08-20',
  },
  {
    id: 'quote-2',
    quoteNumber: 2,
    text: 'शुकराना कर, जितना शुकराना करेगा उतना ही कल्याण होगा।',
    hindiText: 'शुकराना कर, जितना शुकराना करेगा उतना ही कल्याण होगा।',
    englishText: 'Express gratitude constantly; the more you thank the divine, the more your welfare blooms.',
    category: 'shukrana',
    categoryLabel: 'Shukrana & Gratitude (शुकराना)',
    author: 'Guruji Sacred Words',
    imageUrl: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=800&q=80',
    likesCount: 2310,
    sharesCount: 940,
    isFree: true,
    tags: ['Shukrana', 'Gratitude', 'Kalyan', 'Peace'],
    createdAt: '2026-08-21',
  },
  {
    id: 'quote-3',
    quoteNumber: 3,
    text: 'कल्याण किता, तेरे सब दुःख दूर किते।',
    hindiText: 'कल्याण किता, तेरे सब दुःख दूर किते।',
    englishText: 'You are blessed and protected; all your sorrows have been relieved.',
    category: 'kalyan',
    categoryLabel: 'Kalyan & Protection (कल्याण)',
    author: 'Guruji Sacred Words',
    imageUrl: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80',
    likesCount: 3100,
    sharesCount: 1250,
    isFree: true,
    tags: ['Kalyan', 'Protection', 'Darshan', 'Maha Vachan'],
    createdAt: '2026-08-22',
  },
  {
    id: 'quote-4',
    quoteNumber: 4,
    text: 'सब्र रख, जो तेरा है वो तुझसे कोई नहीं छीन सकता।',
    hindiText: 'सब्र रख, जो तेरा है वो तुझसे कोई नहीं छीन सकता।',
    englishText: 'Have patience. What is destined for you can never be taken away by anyone.',
    category: 'sabar',
    categoryLabel: 'Patience & Peace (सब्र)',
    author: 'Guruji Sacred Words',
    imageUrl: 'https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?auto=format&fit=crop&w=800&q=80',
    likesCount: 1890,
    sharesCount: 670,
    isFree: true,
    tags: ['Patience', 'Sabar', 'Destiny', 'Peace'],
    createdAt: '2026-08-23',
  },
  {
    id: 'quote-5',
    quoteNumber: 5,
    text: 'सच्चे दिल से याद करो, मैं हर पल तुम्हारे अंग-संग हूँ।',
    hindiText: 'सच्चे दिल से याद करो, मैं हर पल तुम्हारे अंग-संग हूँ।',
    englishText: 'Remember me with a pure heart, and you will feel my divine presence with you at every breath.',
    category: 'bhakti',
    categoryLabel: 'Bhakti & Devotion (भक्ति)',
    author: 'Guruji Sacred Words',
    imageUrl: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=800&q=80',
    likesCount: 2540,
    sharesCount: 880,
    isFree: true,
    tags: ['Bhakti', 'Omnipresence', 'Divine Love', 'Sacred'],
    createdAt: '2026-08-24',
  },
  {
    id: 'quote-6',
    quoteNumber: 6,
    text: 'सवेरे उठ के सिमरन करो, दिन भर तुम्हारा मन शांत और प्रसन्न रहेगा।',
    hindiText: 'सवेरे उठ के सिमरन करो, दिन भर तुम्हारा मन शांत और प्रसन्न रहेगा।',
    englishText: 'Start your morning with holy remembrance (Simran), and your soul will stay serene throughout the day.',
    category: 'daily',
    categoryLabel: 'Daily Life & Positivity (दैनिक विचार)',
    author: 'Guruji Sacred Words',
    imageUrl: 'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?auto=format&fit=crop&w=800&q=80',
    likesCount: 1670,
    sharesCount: 430,
    isFree: true,
    tags: ['Daily', 'Amrit Vela', 'Simran', 'Positivity'],
    createdAt: '2026-08-25',
  },
];

const QUOTE_CATEGORIES = [
  { id: 'all', label: 'All Sacred Quotes' },
  { id: 'shukrana', label: '🙏 Shukrana' },
  { id: 'faith', label: '✨ Faith' },
  { id: 'kalyan', label: '🕉️ Kalyan' },
  { id: 'sabar', label: '🌿 Sabar' },
  { id: 'bhakti', label: '🪷 Bhakti' },
  { id: 'daily', label: '☀️ Daily Positivity' },
];

export const QuotesGallerySection: React.FC<QuotesGallerySectionProps> = ({
  onQuoteDownload,
  onSuccessNotice,
}) => {
  const [quotesList, setQuotesList] = useState<JaiGuruJiQuoteItem[]>(INITIAL_GURUJI_QUOTES);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);

  const handleCopy = (quote: JaiGuruJiQuoteItem) => {
    const textToCopy = `"${quote.hindiText}"\n\n${quote.englishText ? `"${quote.englishText}"\n\n` : ''}— Jai Guru Ji Maharaj 🙏✨`;
    navigator.clipboard.writeText(textToCopy);
    setCopiedId(quote.id);
    if (onSuccessNotice) {
      onSuccessNotice('Sacred quote copied to clipboard!');
    }
    setTimeout(() => setCopiedId(null), 2500);
  };

  const handleShare = (quote: JaiGuruJiQuoteItem) => {
    const textToShare = `"${quote.hindiText}"\n\n— Jai Guru Ji 🙏✨\nDownload sacred quotes & darshan at GurucraftPro`;
    if (navigator.share) {
      navigator.share({
        title: 'Jai Guru Ji Sacred Quote',
        text: textToShare,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(textToShare);
      alert('Quote copied for sharing on WhatsApp / Socials!');
    }
  };

  const handleToggleFavorite = (id: string) => {
    setFavoriteIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
    setQuotesList((prev) =>
      prev.map((q) => (q.id === id ? { ...q, likesCount: q.likesCount + (favoriteIds.includes(id) ? -1 : 1) } : q))
    );
  };

  const handleDownload = (quote: JaiGuruJiQuoteItem) => {
    if (onQuoteDownload) {
      onQuoteDownload(quote);
    } else {
      // Direct high-res download
      const link = document.createElement('a');
      link.href = quote.imageUrl || 'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?auto=format&fit=crop&w=1600&q=90';
      link.download = `guruji-quote-${quote.quoteNumber || quote.id}.jpg`;
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      if (onSuccessNotice) {
        onSuccessNotice(`Downloaded quote #${quote.quoteNumber}!`);
      }
    }
  };

  const filteredQuotes = quotesList.filter((q) => {
    if (selectedCategory !== 'all' && q.category !== selectedCategory) {
      return false;
    }
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      const match =
        q.text.toLowerCase().includes(query) ||
        q.hindiText.toLowerCase().includes(query) ||
        q.englishText?.toLowerCase().includes(query) ||
        q.tags.some((t) => t.toLowerCase().includes(query));
      if (!match) return false;
    }
    return true;
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-300" id="jai-guruji-quotes-section">
      {/* Spotlight Header */}
      <div className="relative rounded-3xl bg-gradient-to-r from-neutral-900 via-neutral-900 to-amber-950/40 border border-amber-500/30 p-6 sm:p-8 overflow-hidden shadow-2xl">
        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Divine Words of Wisdom • Free HD Quotes</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Jai Guru Ji Sacred Quotes & Vachan Gallery
          </h2>
          <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
            Read, copy, and download high-resolution spiritual quotes designed for morning WhatsApp status, Instagram stories, and daily meditative reflection.
          </p>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="p-4 sm:p-5 rounded-2xl bg-neutral-900/80 border border-neutral-800 space-y-3 backdrop-blur-md">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:max-w-md">
            <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search quotes by words (e.g. चिंता, शुकराना, सब्र, कल्याण)..."
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500"
            />
          </div>

          <div className="flex items-center gap-2 text-xs text-neutral-400">
            <span>Showing {filteredQuotes.length} Sacred Quotes</span>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {QUOTE_CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  isSelected
                    ? 'bg-amber-500 text-neutral-950 font-bold shadow-md shadow-amber-500/20'
                    : 'bg-neutral-950 text-neutral-400 border border-neutral-800 hover:text-white'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Quotes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence>
          {filteredQuotes.map((quote) => {
            const isFavorite = favoriteIds.includes(quote.id);
            const isCopied = copiedId === quote.id;

            return (
              <motion.div
                key={quote.id}
                layout
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="relative rounded-3xl bg-neutral-900/90 border border-neutral-800 hover:border-amber-500/40 p-6 flex flex-col justify-between transition-all duration-300 shadow-lg hover:shadow-amber-500/10 group overflow-hidden"
              >
                {/* Background ambient gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 via-transparent to-neutral-950 pointer-events-none" />

                {/* Top Badge & Actions */}
                <div className="relative z-10 flex items-center justify-between mb-4">
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-500/15 border border-amber-500/30 text-amber-300">
                    {quote.categoryLabel.split(' ')[0]} {quote.categoryLabel.split(' ')[1]}
                  </span>

                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => handleToggleFavorite(quote.id)}
                      className={`p-2 rounded-xl transition ${
                        isFavorite
                          ? 'bg-red-500/20 text-red-400'
                          : 'bg-neutral-950/80 text-neutral-400 hover:text-red-400'
                      }`}
                      title="Save to Favorites"
                    >
                      <Heart className={`w-3.5 h-3.5 ${isFavorite ? 'fill-current' : ''}`} />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleShare(quote)}
                      className="p-2 rounded-xl bg-neutral-950/80 text-neutral-400 hover:text-white transition"
                      title="Share Quote"
                    >
                      <Share2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Sacred Text Body */}
                <div className="relative z-10 my-3 space-y-3">
                  <div className="text-amber-400/60 font-serif text-3xl leading-none">“</div>
                  <p className="text-base sm:text-lg font-bold text-white leading-relaxed font-serif">
                    {quote.hindiText}
                  </p>
                  {quote.englishText && (
                    <p className="text-xs text-neutral-400 italic leading-relaxed">
                      {quote.englishText}
                    </p>
                  )}
                </div>

                {/* Bottom Bar: Tags & Copy/Download */}
                <div className="relative z-10 pt-4 border-t border-neutral-800/80 mt-4 flex items-center justify-between gap-2">
                  <span className="text-[11px] text-amber-400/80 font-bold">
                    ॥ जय गुरु जी ॥
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleCopy(quote)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition ${
                        isCopied
                          ? 'bg-emerald-500 text-neutral-950 font-bold'
                          : 'bg-neutral-950 hover:bg-neutral-800 text-neutral-300 border border-neutral-800'
                      }`}
                    >
                      {isCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{isCopied ? 'Copied' : 'Copy'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDownload(quote)}
                      className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs flex items-center gap-1.5 shadow-sm active:scale-95 transition"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>HD Card</span>
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
};
