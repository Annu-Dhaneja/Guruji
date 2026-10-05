import React, { useState } from 'react';
import {
  Sparkles,
  Download,
  Share2,
  Heart,
  Volume2,
  Bell,
  Check,
  Edit3,
  Image as ImageIcon,
  Flame,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import { GurujiArtwork, GurujiDailyBlessing } from '../../types';

interface TodayBlessingSectionProps {
  artwork: GurujiArtwork | null;
  blessing: GurujiDailyBlessing | null;
  dateStr?: string;
  isFavorited?: boolean;
  onToggleFavorite?: (artworkId: string) => void;
  onOpenCardStudio?: (artwork?: GurujiArtwork) => void;
  onOpenPhotoStudio?: (artwork?: GurujiArtwork) => void;
  onDownload?: (art: GurujiArtwork) => void;
}

export const TodayBlessingSection: React.FC<TodayBlessingSectionProps> = ({
  artwork,
  blessing,
  dateStr,
  isFavorited = false,
  onToggleFavorite,
  onOpenCardStudio,
  onOpenPhotoStudio,
  onDownload,
}) => {
  const [copied, setCopied] = useState(false);
  const [jaapCount, setJaapCount] = useState(108);
  const [jaapAnimated, setJaapAnimated] = useState(false);
  const [bellRinging, setBellRinging] = useState(false);

  // Play synthetic sacred bell sound using Web Audio API (safe, no external asset needed)
  const playSacredBell = () => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        const ctx = new AudioCtx();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
        osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.1); // A5
        osc.frequency.exponentialRampToValueAtTime(587.33, ctx.currentTime + 1.2);
        gain.gain.setValueAtTime(0.3, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 1.8);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 2.0);
      }
    } catch (e) {
      // Audio context might be restricted before interaction
    }
    setBellRinging(true);
    setTimeout(() => setBellRinging(false), 1200);
  };

  const handleJaapClick = () => {
    setJaapCount((prev) => prev + 1);
    setJaapAnimated(true);
    playSacredBell();
    setTimeout(() => setJaapAnimated(false), 500);
  };

  const handleWhatsAppShare = () => {
    const title = blessing?.title || artwork?.title || 'Aaj Ka Divine Swaroop & Vachan';
    const hindi = blessing?.hindiText || artwork?.blessingMessage || '';
    const eng = blessing?.blessingText || artwork?.description || '';
    const shareUrl = window.location.href;
    const text = `🌸 *GurucraftPro — Aaj Ka Divine Swaroop & Vachan* 🌸\n\n✨ *${title}*\n\n🙏 *पावन वचन:* "${hindi}"\n\n🕊️ *Sacred Blessing:* "${eng}"\n\n📱 View 4K Darshan & Download Free HD Artwork:\n${shareUrl}\n\n॥ जय गुरु जी • शुकराना गुरु जी ॥`;
    
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
  };

  const formattedDate = dateStr
    ? new Date(dateStr).toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      })
    : new Date().toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      });

  const displayImage =
    artwork?.imageUrl ||
    blessing?.artworkUrl ||
    'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=1200&q=90';

  return (
    <section id="aaj-ka-swaroop" className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-slate-900 via-purple-950/80 to-slate-950 border border-amber-500/30 p-6 md:p-10 shadow-2xl">
      {/* Background Sacred Glow & Rings */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-600/15 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 space-y-8">
        {/* Header Ribbon */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-amber-500/20 pb-5">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 to-yellow-400 p-0.5 flex items-center justify-center shadow-lg shadow-amber-500/20">
              <Sparkles className="w-5 h-5 text-slate-950" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-[10px] font-black tracking-widest uppercase px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  Live Today
                </span>
                <span className="text-xs text-amber-200/70 font-medium">{formattedDate}</span>
              </div>
              <h2 className="text-xl md:text-2xl font-black text-white tracking-tight">
                Aaj Ka Divine Swaroop & Sacred Vachan
              </h2>
            </div>
          </div>

          {/* Interactive Actions: Bell & Shukrana Jaap */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            <button
              onClick={playSacredBell}
              className={`flex items-center space-x-1.5 px-3 py-2 rounded-2xl bg-slate-800/80 hover:bg-slate-800 border border-amber-500/30 text-amber-300 text-xs font-bold transition-all ${
                bellRinging ? 'scale-110 bg-amber-500/30 ring-2 ring-amber-400' : ''
              }`}
              title="Ring Temple Bell"
            >
              <Bell className={`w-4 h-4 ${bellRinging ? 'animate-bounce text-yellow-300' : ''}`} />
              <span className="hidden sm:inline">Mandir Bell</span>
            </button>

            <button
              onClick={handleJaapClick}
              className={`flex items-center space-x-2 px-3.5 py-2 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 text-xs font-black shadow-lg shadow-amber-500/20 transition-all ${
                jaapAnimated ? 'scale-110' : ''
              }`}
              title="Tap to Chant Shukrana Guruji"
            >
              <Flame className="w-4 h-4 fill-slate-950" />
              <span>Shukrana Jaap ({jaapCount})</span>
            </button>
          </div>
        </div>

        {/* Main Content Grid: Image + Sacred Message */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Swaroop Frame */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative group w-full max-w-sm">
              {/* Sacred Golden Arch Frame Wrapper */}
              <div className="relative p-3 rounded-3xl bg-gradient-to-b from-amber-400 via-amber-600 to-amber-900 shadow-2xl shadow-amber-500/25">
                <div className="relative rounded-2xl overflow-hidden aspect-[4/5] bg-slate-950 border border-amber-300/40">
                  <img
                    src={displayImage}
                    alt={artwork?.title || 'Aaj Ka Divine Swaroop'}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  
                  {/* Subtle Aura Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-amber-500/10 pointer-events-none" />

                  {/* Corner Filigree Badges */}
                  <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-slate-950/85 border border-amber-400/40 text-[10px] font-black text-amber-300 backdrop-blur-md">
                    🕉️ 4K Ultra HD Darshan
                  </div>

                  {/* Free Download Badge */}
                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-[11px] text-amber-100/90 font-medium px-3 py-1.5 rounded-xl bg-slate-950/80 backdrop-blur-md border border-amber-500/30">
                    <span>{artwork?.categoryName || 'Bade Mandir Shivalik'}</span>
                    <span className="text-emerald-400 font-bold">100% Free HD</span>
                  </div>
                </div>
              </div>

              {/* Floating Favorite Heart Button */}
              {artwork && (
                <button
                  onClick={() => onToggleFavorite && onToggleFavorite(artwork.id)}
                  className={`absolute -top-2 -right-2 p-3 rounded-full shadow-xl transition-all border ${
                    isFavorited
                      ? 'bg-rose-500 text-white border-rose-300 scale-110'
                      : 'bg-slate-900/90 text-slate-300 hover:text-rose-400 border-amber-500/40 hover:scale-105'
                  }`}
                  title={isFavorited ? 'Remove from favorites' : 'Save to favorites'}
                >
                  <Heart className={`w-4 h-4 ${isFavorited ? 'fill-current' : ''}`} />
                </button>
              )}
            </div>
          </div>

          {/* Sacred Vachan & Blessings Details */}
          <div className="lg:col-span-7 space-y-6">
            {/* Title & Badge */}
            <div className="space-y-2">
              <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 text-xs font-bold">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Today's Live Divine Blessing</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-black text-white leading-tight">
                {blessing?.title || artwork?.title || 'The Power of Contentment & Inner Peace'}
              </h3>
            </div>

            {/* Sacred Hindi Quote Box */}
            <div className="relative p-5 rounded-2xl bg-gradient-to-r from-amber-950/60 via-purple-950/50 to-slate-900/80 border-l-4 border-l-amber-400 border border-amber-500/20 space-y-2">
              <div className="text-[11px] font-bold uppercase tracking-wider text-amber-400/90">
                पावन गुरु वचन (Sacred Message)
              </div>
              <p className="text-base sm:text-lg font-bold text-amber-100 leading-relaxed">
                "{blessing?.hindiText || artwork?.quote || 'कल्याण किता, सब दुःख दूर किते। जिसपे गुरु की मेहर होवे, ओदी हर मुराद पूरी होवे।'}"
              </p>
              {artwork?.mantra && (
                <div className="text-xs font-semibold text-amber-300/80 pt-1">
                  {artwork.mantra}
                </div>
              )}
            </div>

            {/* English Meaning & Affirmation */}
            <div className="space-y-2">
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Inspirational Meaning & Daily Affirmation
              </div>
              <p className="text-sm sm:text-base text-slate-200 leading-relaxed">
                {blessing?.blessingText ||
                  artwork?.blessingMessage ||
                  'True peace does not come from accumulating external things, but from having a heart that whispers "Shukrana" in every circumstance. May divine grace illuminate your path and bring health, unity, and abundance to your family.'}
              </p>
            </div>

            {/* Author Attribution & Verification */}
            <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400 border-t border-slate-800 pt-3">
              <div className="flex items-center space-x-1.5 text-emerald-400 font-semibold">
                <ShieldCheck className="w-4 h-4" />
                <span>Verified Sacred Archive • Original Digital Art by Annu Dhaneja</span>
              </div>
              <div className="text-slate-500 text-[11px]">
                {blessing?.sourceReference || 'Ref: AD-GJ-2026-LIVE'}
              </div>
            </div>

            {/* Action Buttons Hub */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              {/* Free HD Download Button */}
              <button
                onClick={() => {
                  if (artwork && onDownload) {
                    onDownload(artwork);
                  } else {
                    window.open(displayImage, '_blank');
                  }
                }}
                className="flex items-center space-x-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-black text-xs sm:text-sm shadow-xl shadow-amber-500/20 transition-all hover:scale-105"
              >
                <Download className="w-4 h-4" />
                <span>Download Free 4K HD</span>
              </button>

              {/* WhatsApp Share Button */}
              <button
                onClick={handleWhatsAppShare}
                className="flex items-center space-x-2 px-4 py-3 rounded-2xl bg-emerald-600/90 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm shadow-lg shadow-emerald-600/20 transition-all hover:scale-105"
              >
                <Share2 className="w-4 h-4" />
                <span>Share on WhatsApp</span>
              </button>

              {/* Create Card CTA */}
              <button
                onClick={() => onOpenCardStudio && onOpenCardStudio(artwork || undefined)}
                className="flex items-center space-x-2 px-4 py-3 rounded-2xl bg-purple-600/80 hover:bg-purple-500 text-white font-bold text-xs sm:text-sm border border-purple-400/30 transition-all hover:scale-105"
              >
                <Edit3 className="w-4 h-4 text-purple-300" />
                <span>Make Blessing Card</span>
              </button>

              {/* Photo Frame CTA */}
              <button
                onClick={() => onOpenPhotoStudio && onOpenPhotoStudio(artwork || undefined)}
                className="flex items-center space-x-2 px-4 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs sm:text-sm border border-slate-700 transition-all hover:scale-105"
              >
                <ImageIcon className="w-4 h-4 text-amber-400" />
                <span>Customize with Photo</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
