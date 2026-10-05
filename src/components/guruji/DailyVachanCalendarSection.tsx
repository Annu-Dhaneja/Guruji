import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Calendar as CalendarIcon,
  Sparkles,
  Heart,
  Share2,
  Download,
  ChevronLeft,
  ChevronRight,
  Sun,
  Volume2,
  Check,
  Copy,
  Clock,
} from 'lucide-react';
import { DailyVachanCalendarItem } from '../../types';

interface DailyVachanCalendarSectionProps {
  onSuccessNotice?: (msg: string) => void;
}

export const SEED_DAILY_VACHANS: DailyVachanCalendarItem[] = [
  {
    id: 'vachan-2026-08-28',
    date: '2026-08-28',
    vachanHindi: 'सवेरे अमृत वेला में जो मन से शुकराना करता है, उसके घर में कभी सुख और शांति की कमी नहीं होती।',
    vachanEnglish: 'One who expresses gratitude with a pure soul during Amrit Vela will never experience a lack of peace and divine abundance.',
    quote: 'शुकराना कर, कल्याण होवेगा।',
    spiritualMessage: 'Today is a blessed day to forgive past grievances, chant ॐ नमः शिवाय, and perform a selfless act of seva.',
    imageUrl: 'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?auto=format&fit=crop&w=1200&q=80',
    specialOccasion: 'Auspicious Friday Amrit Vela Darshan',
    isFeatured: true,
    likesCount: 1840,
    sharesCount: 720,
    createdAt: '2026-08-28T05:00:00.000Z',
  },
  {
    id: 'vachan-2026-08-27',
    date: '2026-08-27',
    vachanHindi: 'अपनी चिंताएं मुझे सौंप दो, और अपना कर्म निष्काम भाव से करो। फल की चिंता छोड़ दो।',
    vachanEnglish: 'Surrender your anxieties to me and perform your righteous duties selflessly. Leave the fruits to the divine.',
    quote: 'तेरा सब दुःख दूर किता।',
    spiritualMessage: 'Practice mindfulness today. When negative thoughts arise, repeat Guruji mantra 11 times.',
    imageUrl: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1200&q=80',
    specialOccasion: 'Thursday Satsang Vachan',
    isFeatured: false,
    likesCount: 1490,
    sharesCount: 510,
    createdAt: '2026-08-27T05:00:00.000Z',
  },
  {
    id: 'vachan-2026-08-26',
    date: '2026-08-26',
    vachanHindi: 'सेवा ही सबसे बड़ा धर्म है। भूखे को अन्न और प्यासे को जल देना ही सच्ची भक्ति है।',
    vachanEnglish: 'Selfless service is the highest religion. Feeding the hungry and offering water is the truest devotion.',
    quote: 'सेवा करो, कल्याण पाओ।',
    spiritualMessage: 'Dedicate a portion of your meals or resources today towards langar seva or feeding birds.',
    imageUrl: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=1200&q=80',
    specialOccasion: 'Sacred Seva Day',
    isFeatured: false,
    likesCount: 1620,
    sharesCount: 680,
    createdAt: '2026-08-26T05:00:00.000Z',
  },
  {
    id: 'vachan-2026-08-25',
    date: '2026-08-25',
    vachanHindi: 'सत्य के मार्ग पर चलने वाले को कठिनाइयाँ आ सकती हैं, पर उसकी विजय निश्चित होती है।',
    vachanEnglish: 'Those who walk the path of truth may face hurdles, but their ultimate spiritual triumph is guaranteed.',
    quote: 'सत्य ही परमात्मा है।',
    spiritualMessage: 'Maintain honesty in your speech and business dealings today. Integrity attracts divine grace.',
    imageUrl: 'https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?auto=format&fit=crop&w=1200&q=80',
    specialOccasion: 'Purity & Truth Vachan',
    isFeatured: false,
    likesCount: 1380,
    sharesCount: 440,
    createdAt: '2026-08-25T05:00:00.000Z',
  },
];

export const DailyVachanCalendarSection: React.FC<DailyVachanCalendarSectionProps> = ({
  onSuccessNotice,
}) => {
  const [selectedDate, setSelectedDate] = useState<string>(SEED_DAILY_VACHANS[0].date);
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);
  const [copied, setCopied] = useState<boolean>(false);

  const activeVachan =
    SEED_DAILY_VACHANS.find((v) => v.date === selectedDate) || SEED_DAILY_VACHANS[0];

  const handleToggleFavorite = (id: string) => {
    setFavoriteIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleCopyVachan = () => {
    const text = `☀️ आज का पावन वचन (${activeVachan.date})\n\n"${activeVachan.vachanHindi}"\n\n"${activeVachan.vachanEnglish}"\n\n॥ जय गुरु जी • शुकराना गुरु जी ॥`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    if (onSuccessNotice) {
      onSuccessNotice("Today's Vachan copied to clipboard!");
    }
    setTimeout(() => setCopied(false), 2500);
  };

  const handleShare = () => {
    const text = `☀️ आज का पावन वचन (${activeVachan.date})\n\n"${activeVachan.vachanHindi}"\n\n॥ जय गुरु जी ॥\nRead daily spiritual vachans at GurucraftPro`;
    if (navigator.share) {
      navigator.share({
        title: `Guruji Daily Vachan - ${activeVachan.date}`,
        text,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(text);
      alert('Vachan text copied for WhatsApp status!');
    }
  };

  const handleDownloadImage = () => {
    const link = document.createElement('a');
    link.href = activeVachan.imageUrl;
    link.download = `daily-vachan-${activeVachan.date}.jpg`;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    if (onSuccessNotice) {
      onSuccessNotice(`Downloaded Daily Vachan card for ${activeVachan.date}!`);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300" id="daily-vachan-calendar-section">
      {/* Header Spotlight */}
      <div className="relative rounded-3xl bg-gradient-to-r from-neutral-900 via-neutral-900 to-amber-950/40 border border-amber-500/30 p-6 sm:p-8 overflow-hidden shadow-2xl">
        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-bold">
            <Sun className="w-3.5 h-3.5 text-amber-400" />
            <span>Amrit Vela Divine Blessings • Updated Daily</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Daily Vachan Calendar & Holy Darshan
          </h2>
          <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
            Begin every morning with holy guidance, uplifting vachans, and sacred blessings. Browse past calendar dates or download today’s printable darshan card.
          </p>
        </div>
      </div>

      {/* Main Interactive Daily Vachan Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left 7 Columns: Active Selected Vachan Card */}
        <div className="lg:col-span-7">
          <div className="relative rounded-3xl bg-neutral-900 border border-amber-500/30 p-6 sm:p-8 space-y-6 shadow-2xl overflow-hidden">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-neutral-800 pb-4">
              <div className="flex items-center gap-2">
                <CalendarIcon className="w-4 h-4 text-amber-400" />
                <span className="text-sm font-bold text-white">
                  {new Date(activeVachan.date).toLocaleDateString('en-IN', {
                    weekday: 'long',
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })}
                </span>
              </div>

              {activeVachan.specialOccasion && (
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  {activeVachan.specialOccasion}
                </span>
              )}
            </div>

            {/* Sacred Image Preview */}
            <div className="relative w-full h-64 sm:h-80 rounded-2xl overflow-hidden bg-neutral-950 border border-neutral-800">
              <img
                src={activeVachan.imageUrl}
                alt="Daily Sacred Darshan"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/20 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 text-white">
                <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400 block mb-1">
                  Amrit Vela Darshan
                </span>
                <p className="text-sm sm:text-base font-serif font-bold italic">
                  "{activeVachan.quote}"
                </p>
              </div>
            </div>

            {/* Hindi & English Vachan */}
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800/80 space-y-2">
                <span className="text-[11px] font-bold uppercase text-amber-400">पावन वचन (Hindi)</span>
                <p className="text-base sm:text-lg font-bold text-white leading-relaxed font-serif">
                  {activeVachan.vachanHindi}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-neutral-950/60 border border-neutral-800/60 space-y-2">
                <span className="text-[11px] font-bold uppercase text-neutral-400">Translation & Meaning</span>
                <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
                  {activeVachan.vachanEnglish}
                </p>
              </div>

              {activeVachan.spiritualMessage && (
                <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-200">
                  <strong className="text-amber-300 block mb-0.5">☀️ Daily Spiritual Focus:</strong>
                  {activeVachan.spiritualMessage}
                </div>
              )}
            </div>

            {/* Actions Bottom Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-neutral-800">
              <button
                type="button"
                onClick={() => handleToggleFavorite(activeVachan.id)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold transition ${
                  favoriteIds.includes(activeVachan.id)
                    ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                    : 'bg-neutral-950 text-neutral-300 border border-neutral-800 hover:text-white'
                }`}
              >
                <Heart
                  className={`w-3.5 h-3.5 ${favoriteIds.includes(activeVachan.id) ? 'fill-current' : ''}`}
                />
                <span>Favorite</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleCopyVachan}
                  className="px-4 py-2 rounded-xl bg-neutral-950 hover:bg-neutral-800 border border-neutral-800 text-neutral-200 text-xs font-semibold flex items-center gap-1.5 transition"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>

                <button
                  type="button"
                  onClick={handleShare}
                  className="px-4 py-2 rounded-xl bg-neutral-950 hover:bg-neutral-800 border border-neutral-800 text-neutral-200 text-xs font-semibold flex items-center gap-1.5 transition"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>Share</span>
                </button>

                <button
                  type="button"
                  onClick={handleDownloadImage}
                  className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs flex items-center gap-1.5 shadow-md shadow-amber-500/20 active:scale-95 transition"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Card</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right 5 Columns: Calendar Date Picker & Archive */}
        <div className="lg:col-span-5 space-y-6">
          <div className="p-6 rounded-3xl bg-neutral-900/80 border border-neutral-800 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-400" /> Recent Daily Vachans
              </h3>
              <span className="text-xs text-neutral-400">Select Date</span>
            </div>

            <div className="space-y-3">
              {SEED_DAILY_VACHANS.map((vachan) => {
                const isSelected = selectedDate === vachan.date;
                return (
                  <div
                    key={vachan.id}
                    onClick={() => setSelectedDate(vachan.date)}
                    className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex items-center gap-3.5 ${
                      isSelected
                        ? 'bg-amber-500/15 border-amber-500 shadow-md shadow-amber-500/10'
                        : 'bg-neutral-950/60 border-neutral-800/80 hover:border-neutral-700'
                    }`}
                  >
                    <img
                      src={vachan.imageUrl}
                      alt={vachan.date}
                      className="w-14 h-14 rounded-xl object-cover shrink-0 border border-neutral-800"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className={`font-bold ${isSelected ? 'text-amber-400' : 'text-white'}`}>
                          {new Date(vachan.date).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                          })}
                        </span>
                        {vachan.specialOccasion && (
                          <span className="text-[10px] text-amber-300 font-medium truncate max-w-[120px]">
                            {vachan.specialOccasion}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-neutral-400 truncate leading-relaxed">
                        {vachan.vachanHindi}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
