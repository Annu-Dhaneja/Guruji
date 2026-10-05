import React, { useState, useEffect, useRef } from 'react';
import {
  Sparkles,
  Download,
  Share2,
  Edit3,
  RefreshCw,
  CheckCircle2,
  Upload,
  Image as ImageIcon,
  Palette,
  Type,
  FileText,
  User,
  Phone,
  Heart,
  Crown,
} from 'lucide-react';
import { GurujiArtwork, GurujiPersonalizedCardOrder } from '../../types';

interface BlessingCardStudioProps {
  artworks: GurujiArtwork[];
  initialArtwork?: GurujiArtwork | null;
  onOrderSaved?: (order: GurujiPersonalizedCardOrder) => void;
}

const FRAME_STYLES = [
  { id: 'golden-filigree', name: 'Golden Filigree Arch', border: '#f59e0b', bg: '#1c1917' },
  { id: 'temple-arch', name: 'Bade Mandir Sanctum', border: '#eab308', bg: '#0f172a' },
  { id: 'lotus-glow', name: 'Divine Lotus Glow', border: '#ec4899', bg: '#18181b' },
  { id: 'velvet-royal', name: 'Royal Velvet Aura', border: '#8b5cf6', bg: '#1e1b4b' },
  { id: 'sacred-aura', name: 'Celestial Halo', border: '#06b6d4', bg: '#082f49' },
  { id: 'diya-floral', name: 'Sacred Diya & Marigold', border: '#f97316', bg: '#27272a' },
];

const OCCASIONS = [
  { id: 'Birthday', label: '🎂 Happy Birthday Blessing' },
  { id: 'Anniversary', label: '💍 Marriage Anniversary' },
  { id: 'Griha Pravesh', label: '🏡 Griha Pravesh & New Home' },
  { id: 'New Business', label: '💼 New Business / Shop Inauguration' },
  { id: 'Gratitude', label: '❤️ Shukrana / Gratitude' },
  { id: 'Health & Healing', label: '🌿 Health, Recovery & Long Life' },
  { id: 'Festival', label: '🪔 Guruji Satsang / Special Festival' },
  { id: 'General Blessing', label: '🙏 Divine Grace & Family Harmony' },
];

const MANTRAS = [
  '॥ ॐ नमः शिवाय शुभम कुरु कुरु ॥',
  '॥ शुकराना गुरु जी अनंतम अनंतम ॥',
  '॥ कल्याण किता, सब दुःख दूर किते ॥',
  '॥ गुरु कृपा केवलम् • जय गुरु जी ॥',
  '॥ ॐ गुरुवे नमः • सर्व मंगल मांगल्ये ॥',
];

export const BlessingCardStudio: React.FC<BlessingCardStudioProps> = ({
  artworks,
  initialArtwork,
  onOrderSaved,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Studio State
  const [selectedArtUrl, setSelectedArtUrl] = useState<string>(
    initialArtwork?.imageUrl ||
      artworks[0]?.imageUrl ||
      'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=1200&q=90'
  );
  const [recipientName, setRecipientName] = useState<string>('Annu Dhaneja & Family');
  const [senderName, setSenderName] = useState<string>('With Divine Blessings');
  const [occasion, setOccasion] = useState<string>('Birthday');
  const [customMessage, setCustomMessage] = useState<string>(
    'May Guruji shower infinite blessings of health, joy, unity, and divine peace upon your home.'
  );
  const [selectedMantra, setSelectedMantra] = useState<string>(MANTRAS[0]);
  const [frameStyle, setFrameStyle] = useState<string>('golden-filigree');
  const [auraTheme, setAuraTheme] = useState<'gold' | 'rose' | 'amber' | 'cyan' | 'ruby'>('gold');

  // Customer Contact for backend sync
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerWhatsapp, setCustomerWhatsapp] = useState('');

  // Generation States
  const [isRendering, setIsRendering] = useState(false);
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    if (initialArtwork?.imageUrl) {
      setSelectedArtUrl(initialArtwork.imageUrl);
    }
  }, [initialArtwork]);

  // Update Canvas whenever state changes
  useEffect(() => {
    renderCardToCanvas();
  }, [selectedArtUrl, recipientName, senderName, occasion, customMessage, selectedMantra, frameStyle, auraTheme]);

  const renderCardToCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    setIsRendering(true);

    const width = 800;
    const height = 1000;
    canvas.width = width;
    canvas.height = height;

    // 1. Draw Background
    const bgGradient = ctx.createLinearGradient(0, 0, 0, height);
    if (auraTheme === 'rose') {
      bgGradient.addColorStop(0, '#1c0f18');
      bgGradient.addColorStop(0.5, '#2e1022');
      bgGradient.addColorStop(1, '#0f070c');
    } else if (auraTheme === 'cyan') {
      bgGradient.addColorStop(0, '#061a24');
      bgGradient.addColorStop(0.5, '#0b2b3b');
      bgGradient.addColorStop(1, '#030d12');
    } else if (auraTheme === 'amber') {
      bgGradient.addColorStop(0, '#241407');
      bgGradient.addColorStop(0.5, '#3b220c');
      bgGradient.addColorStop(1, '#120a03');
    } else {
      // Gold default
      bgGradient.addColorStop(0, '#1a1409');
      bgGradient.addColorStop(0.5, '#2c2210');
      bgGradient.addColorStop(1, '#0d0a04');
    }
    ctx.fillStyle = bgGradient;
    ctx.fillRect(0, 0, width, height);

    // 2. Draw Decorative Outer Gold Border
    ctx.strokeStyle = '#eab308';
    ctx.lineWidth = 6;
    ctx.strokeRect(20, 20, width - 40, height - 40);

    ctx.strokeStyle = '#fef08a';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(28, 28, width - 56, height - 56);

    // Corner Ornaments
    const drawCorner = (x: number, y: number) => {
      ctx.fillStyle = '#eab308';
      ctx.beginPath();
      ctx.arc(x, y, 6, 0, Math.PI * 2);
      ctx.fill();
    };
    drawCorner(28, 28);
    drawCorner(width - 28, 28);
    drawCorner(28, height - 28);
    drawCorner(width - 28, height - 28);

    // 3. Header Occasion Banner
    ctx.fillStyle = '#eab308';
    ctx.font = 'bold 24px serif';
    ctx.textAlign = 'center';
    ctx.fillText('॥ जय गुरु जी • शुकराना गुरु जी ॥', width / 2, 70);

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 20px sans-serif';
    ctx.fillText(occasion.toUpperCase(), width / 2, 105);

    // 4. Load & Render Center Sacred Swaroop Image
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = selectedArtUrl;

    img.onload = () => {
      // Image Box
      const imgX = 140;
      const imgY = 130;
      const imgW = 520;
      const imgH = 480;

      // Draw Arch Frame around image
      ctx.save();
      ctx.beginPath();
      // Rounded rect or arch for image
      ctx.roundRect(imgX, imgY, imgW, imgH, [24, 24, 16, 16]);
      ctx.clip();
      ctx.drawImage(img, imgX, imgY, imgW, imgH);
      ctx.restore();

      // Golden Arch Border
      ctx.strokeStyle = '#eab308';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.roundRect(imgX, imgY, imgW, imgH, [24, 24, 16, 16]);
      ctx.stroke();

      // 5. Draw Recipient Name Box
      ctx.fillStyle = '#fef08a';
      ctx.font = 'bold 28px serif';
      ctx.textAlign = 'center';
      ctx.fillText(recipientName || 'Dear Devotee', width / 2, 665);

      // 6. Draw Sacred Mantra
      ctx.fillStyle = '#fbbf24';
      ctx.font = 'italic bold 20px serif';
      ctx.fillText(selectedMantra, width / 2, 710);

      // 7. Draw Custom Blessing Message (Multi-line wrap)
      ctx.fillStyle = '#e2e8f0';
      ctx.font = '17px sans-serif';
      wrapText(ctx, customMessage, width / 2, 755, 620, 26);

      // 8. Draw Sender Sign-off
      ctx.fillStyle = '#94a3b8';
      ctx.font = 'italic 15px sans-serif';
      ctx.fillText(`— ${senderName}`, width / 2, 880);

      // 9. GurucraftPro Studio Watermark & Date
      ctx.fillStyle = '#64748b';
      ctx.font = '12px sans-serif';
      ctx.fillText('GurucraftPro Sacred Studio • Verified Spiritual Art', width / 2, 945);

      try {
        setGeneratedImageUrl(canvas.toDataURL('image/png'));
      } catch (e) {
        // In case of tainted canvas
      }
      setIsRendering(false);
    };

    img.onerror = () => {
      // Fallback text if image CORS blocks
      ctx.fillStyle = '#eab308';
      ctx.font = 'bold 20px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('Sacred Swaroop Frame', width / 2, 350);
      setIsRendering(false);
    };
  };

  // Helper function to wrap text
  function wrapText(
    ctx: CanvasRenderingContext2D,
    text: string,
    x: number,
    y: number,
    maxWidth: number,
    lineHeight: number
  ) {
    const words = text.split(' ');
    let line = '';
    let currentY = y;

    for (let n = 0; n < words.length; n++) {
      const testLine = line + words[n] + ' ';
      const metrics = ctx.measureText(testLine);
      const testWidth = metrics.width;
      if (testWidth > maxWidth && n > 0) {
        ctx.fillText(line, x, currentY);
        line = words[n] + ' ';
        currentY += lineHeight;
      } else {
        line = testLine;
      }
    }
    ctx.fillText(line, x, currentY);
  }

  // Handle Local Upload for Swaroop in Card
  const handleCustomImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        if (ev.target?.result) {
          setSelectedArtUrl(ev.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Download Generated Card
  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement('a');
    link.download = `Guruji-Blessing-Card-${recipientName.replace(/\s+/g, '-')}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  // Share directly on WhatsApp
  const handleShareWhatsApp = async () => {
    const text = `🌸 *GurucraftPro — Personalized Divine Blessing Card* 🌸\n\n✨ Dedicated to: *${recipientName}*\n🙏 Occasion: *${occasion}*\n🕊️ Message: "${customMessage}"\n🕉️ ${selectedMantra}\n\n॥ जय गुरु जी • शुकराना गुरु जी ॥\n\nCreate your own free 4K card at: ${window.location.href}`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
  };

  // Save Card Order to DB for persistence
  const handleSaveToMyCards = async () => {
    const canvas = canvasRef.current;
    const dataUrl = canvas ? canvas.toDataURL('image/png') : selectedArtUrl;

    const newOrder: Partial<GurujiPersonalizedCardOrder> = {
      recipientName,
      occasion,
      preferredLanguage: 'Hindi',
      customMessage,
      customerName: senderName || 'Devotee',
      customerEmail: 'devotee@gurucraftpro.com',
      customerPhone: customerPhone || '9876543210',
      customerWhatsapp: customerWhatsapp || customerPhone || '9876543210',
      selectedTemplateId: 'custom-studio-card',
      selectedTemplateTitle: 'GurucraftPro Custom Blessing Studio Card',
      backgroundTheme: 'Velvet Midnight Gold',
      typographyStyle: 'Devanagari Royal Serif',
      status: 'GENERATED',
      finalCardUrl: dataUrl,
      isFreeTier: true,
      amount: 0,
    };

    try {
      const res = await fetch('/api/guruji/personalized-cards', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newOrder),
      });
      if (res.ok) {
        const saved = await res.json();
        setSavedSuccess(true);
        if (onOrderSaved) onOrderSaved(saved);
        setTimeout(() => setSavedSuccess(false), 5000);
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <section id="card-studio" className="space-y-8 rounded-3xl bg-slate-900/90 border border-amber-500/30 p-6 md:p-10 shadow-2xl">
      {/* Studio Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-amber-500/20 pb-6">
        <div className="space-y-1">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 text-xs font-bold">
            <Edit3 className="w-3.5 h-3.5 text-amber-400" />
            <span>Interactive Sacred Studio</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Create Your Divine Blessing Card
          </h2>
          <p className="text-sm text-slate-400">
            Personalize sacred greeting cards with Guruji's Swaroop, auspicious mantras, and recipient names. Instant 4K HD export for birthdays, anniversaries & celebrations.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <span className="px-3 py-1.5 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-bold">
            ✨ 100% Free & Unlimited
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Controls Column (Left) */}
        <div className="lg:col-span-6 space-y-6">
          {/* 1. Recipient & Sender Info */}
          <div className="p-5 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-4">
            <div className="text-xs font-black tracking-wider uppercase text-amber-400 flex items-center space-x-2">
              <User className="w-4 h-4" />
              <span>1. Devotee & Recipient Names</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Recipient / Family Name *
                </label>
                <input
                  type="text"
                  value={recipientName}
                  onChange={(e) => setRecipientName(e.target.value)}
                  placeholder="e.g. Annu Dhaneja & Family"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs font-semibold focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Sender Sign-off / Family
                </label>
                <input
                  type="text"
                  value={senderName}
                  onChange={(e) => setSenderName(e.target.value)}
                  placeholder="e.g. With Love, Dhaneja Family"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs font-semibold focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>
          </div>

          {/* 2. Occasion & Mantra */}
          <div className="p-5 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-4">
            <div className="text-xs font-black tracking-wider uppercase text-amber-400 flex items-center space-x-2">
              <Crown className="w-4 h-4" />
              <span>2. Occasion & Sacred Mantra</span>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                Select Sacred Occasion
              </label>
              <select
                value={occasion}
                onChange={(e) => setOccasion(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs font-semibold focus:outline-none focus:border-amber-400"
              >
                {OCCASIONS.map((occ) => (
                  <option key={occ.id} value={occ.id}>
                    {occ.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                Sacred Mantra Chant
              </label>
              <select
                value={selectedMantra}
                onChange={(e) => setSelectedMantra(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-amber-300 text-xs font-semibold focus:outline-none focus:border-amber-400"
              >
                {MANTRAS.map((m, idx) => (
                  <option key={idx} value={m}>
                    {m}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                Custom Blessing Message
              </label>
              <textarea
                value={customMessage}
                onChange={(e) => setCustomMessage(e.target.value)}
                rows={3}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs font-medium focus:outline-none focus:border-amber-400"
                placeholder="Write your custom blessing prayer here..."
              />
            </div>
          </div>

          {/* 3. Choose Swaroop Image Preset or Upload */}
          <div className="p-5 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <div className="text-xs font-black tracking-wider uppercase text-amber-400 flex items-center space-x-2">
                <ImageIcon className="w-4 h-4" />
                <span>3. Choose Divine Swaroop</span>
              </div>

              <label className="cursor-pointer text-[11px] font-bold text-amber-400 hover:text-amber-300 flex items-center space-x-1">
                <Upload className="w-3.5 h-3.5" />
                <span>Upload Custom</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleCustomImageUpload}
                  className="hidden"
                />
              </label>
            </div>

            {/* Presets Grid */}
            <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 max-h-36 overflow-y-auto pr-1">
              {artworks.slice(0, 12).map((art) => (
                <button
                  key={art.id}
                  onClick={() => setSelectedArtUrl(art.imageUrl)}
                  className={`relative rounded-xl overflow-hidden aspect-square border-2 transition-all ${
                    selectedArtUrl === art.imageUrl
                      ? 'border-amber-400 ring-2 ring-amber-400/50 scale-105'
                      : 'border-slate-800 hover:border-slate-600 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img
                    src={art.imageUrl}
                    alt={art.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* 4. Aura Theme Selector */}
          <div className="p-5 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-3">
            <div className="text-xs font-black tracking-wider uppercase text-amber-400 flex items-center space-x-2">
              <Palette className="w-4 h-4" />
              <span>4. Aura Glow Palette</span>
            </div>

            <div className="flex items-center space-x-3">
              {[
                { id: 'gold', label: 'Gold Aura', color: 'bg-amber-500' },
                { id: 'rose', label: 'Rose Velvet', color: 'bg-rose-500' },
                { id: 'amber', label: 'Sacred Amber', color: 'bg-orange-500' },
                { id: 'cyan', label: 'Amrit Cyan', color: 'bg-cyan-500' },
              ].map((theme) => (
                <button
                  key={theme.id}
                  onClick={() => setAuraTheme(theme.id as any)}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-xl border text-xs font-bold transition-all ${
                    auraTheme === theme.id
                      ? 'border-amber-400 bg-amber-500/20 text-white'
                      : 'border-slate-800 bg-slate-900 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <span className={`w-3 h-3 rounded-full ${theme.color}`} />
                  <span>{theme.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Live Canvas Preview Column (Right) */}
        <div className="lg:col-span-6 flex flex-col items-center space-y-5">
          <div className="w-full flex items-center justify-between text-xs text-slate-400">
            <span className="font-bold uppercase tracking-wider text-amber-400">
              Live Real-Time 4K Preview
            </span>
            <span>Dimensions: 800 × 1000 px</span>
          </div>

          {/* Canvas Wrapper */}
          <div className="relative w-full max-w-md rounded-3xl overflow-hidden shadow-2xl border-2 border-amber-500/40 bg-slate-950">
            <canvas
              ref={canvasRef}
              className="w-full h-auto block rounded-2xl"
              style={{ maxHeight: '580px', objectFit: 'contain' }}
            />

            {isRendering && (
              <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center space-x-2 text-amber-300 text-xs font-bold">
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Updating card...</span>
              </div>
            )}
          </div>

          {/* Action Buttons Hub */}
          <div className="w-full max-w-md space-y-3">
            <div className="grid grid-cols-2 gap-3">
              {/* Instant Download Button */}
              <button
                onClick={handleDownload}
                className="flex items-center justify-center space-x-2 px-4 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-black text-xs sm:text-sm shadow-xl shadow-amber-500/20 transition-all hover:scale-105"
              >
                <Download className="w-4 h-4" />
                <span>Download PNG</span>
              </button>

              {/* WhatsApp Share Button */}
              <button
                onClick={handleShareWhatsApp}
                className="flex items-center justify-center space-x-2 px-4 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm shadow-lg shadow-emerald-600/20 transition-all hover:scale-105"
              >
                <Share2 className="w-4 h-4" />
                <span>Share WhatsApp</span>
              </button>
            </div>

            {/* Save to My Orders / Gallery */}
            <button
              onClick={handleSaveToMyCards}
              className="w-full flex items-center justify-center space-x-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold border border-slate-700 transition-all"
            >
              <Heart className="w-3.5 h-3.5 text-rose-400" />
              <span>Save to My Sacred Creations</span>
            </button>

            {savedSuccess && (
              <div className="p-3 rounded-xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4" />
                <span>Saved successfully! You can access this card anytime in My Dashboard.</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
