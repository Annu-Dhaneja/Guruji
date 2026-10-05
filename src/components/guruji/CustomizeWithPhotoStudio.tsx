import React, { useState, useEffect, useRef } from 'react';
import {
  Upload,
  Sparkles,
  Download,
  Share2,
  Image as ImageIcon,
  ZoomIn,
  ZoomOut,
  RotateCw,
  Sliders,
  CheckCircle2,
  User,
  Heart,
} from 'lucide-react';
import { GurujiArtwork } from '../../types';

interface CustomizeWithPhotoStudioProps {
  artworks: GurujiArtwork[];
  initialArtwork?: GurujiArtwork | null;
}

export const CustomizeWithPhotoStudio: React.FC<CustomizeWithPhotoStudioProps> = ({
  artworks,
  initialArtwork,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Photo & Swaroop states
  const [devoteePhoto, setDevoteePhoto] = useState<string | null>(null);
  const [selectedGurujiSwaroop, setSelectedGurujiSwaroop] = useState<string>(
    initialArtwork?.imageUrl ||
      artworks[0]?.imageUrl ||
      'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=1200&q=90'
  );
  const [layoutMode, setLayoutMode] = useState<'side-by-side' | 'mandir-arch' | 'sacred-overlay'>('side-by-side');
  const [devoteeName, setDevoteeName] = useState('Annu Dhaneja & Family');
  const [blessingLine, setBlessingLine] = useState('॥ गुरु कृपा ही केवलम् • शुकराना गुरु जी ॥');
  const [photoZoom, setPhotoZoom] = useState(1);
  const [photoBrightness, setPhotoBrightness] = useState(100);

  // Render to canvas
  useEffect(() => {
    renderPhotoFrame();
  }, [devoteePhoto, selectedGurujiSwaroop, layoutMode, devoteeName, blessingLine, photoZoom, photoBrightness]);

  const renderPhotoFrame = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = 800;
    const height = 900;
    canvas.width = width;
    canvas.height = height;

    // 1. Dark Velvet Background
    const grad = ctx.createLinearGradient(0, 0, 0, height);
    grad.addColorStop(0, '#130c1c');
    grad.addColorStop(0.5, '#221133');
    grad.addColorStop(1, '#0c0712');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);

    // 2. Gold Frame Border
    ctx.strokeStyle = '#eab308';
    ctx.lineWidth = 6;
    ctx.strokeRect(18, 18, width - 36, height - 36);

    ctx.strokeStyle = '#fde047';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(26, 26, width - 52, height - 52);

    // 3. Header
    ctx.fillStyle = '#fde047';
    ctx.font = 'bold 22px serif';
    ctx.textAlign = 'center';
    ctx.fillText('॥ जय गुरु जी • सदा अंग संग ॥', width / 2, 65);

    // 4. Draw Layouts
    const gurujiImg = new Image();
    gurujiImg.crossOrigin = 'anonymous';
    gurujiImg.src = selectedGurujiSwaroop;

    gurujiImg.onload = () => {
      if (layoutMode === 'side-by-side') {
        // Left: Guruji Swaroop
        const gX = 50;
        const gY = 100;
        const gW = 330;
        const gH = 540;

        ctx.save();
        ctx.beginPath();
        ctx.roundRect(gX, gY, gW, gH, 18);
        ctx.clip();
        ctx.drawImage(gurujiImg, gX, gY, gW, gH);
        ctx.restore();

        ctx.strokeStyle = '#eab308';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.roundRect(gX, gY, gW, gH, 18);
        ctx.stroke();

        // Right: Devotee Photo (or placeholder)
        const dX = 420;
        const dY = 100;
        const dW = 330;
        const dH = 540;

        if (devoteePhoto) {
          const devImg = new Image();
          devImg.src = devoteePhoto;
          devImg.onload = () => {
            ctx.save();
            ctx.beginPath();
            ctx.roundRect(dX, dY, dW, dH, 18);
            ctx.clip();

            // Zoom & brightness
            ctx.filter = `brightness(${photoBrightness}%)`;
            const scaledW = dW * photoZoom;
            const scaledH = dH * photoZoom;
            const offsetX = dX - (scaledW - dW) / 2;
            const offsetY = dY - (scaledH - dH) / 2;
            ctx.drawImage(devImg, offsetX, offsetY, scaledW, scaledH);
            ctx.restore();

            ctx.strokeStyle = '#eab308';
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.roundRect(dX, dY, dW, dH, 18);
            ctx.stroke();

            drawBottomText(ctx, width, height);
          };
        } else {
          // Placeholder box for devotee photo
          ctx.fillStyle = '#1e1b4b';
          ctx.beginPath();
          ctx.roundRect(dX, dY, dW, dH, 18);
          ctx.fill();

          ctx.strokeStyle = '#6366f1';
          ctx.lineWidth = 2;
          ctx.stroke();

          ctx.fillStyle = '#c7d2fe';
          ctx.font = 'bold 18px sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText('Upload Your Photo', dX + dW / 2, dY + dH / 2 - 10);
          ctx.font = '13px sans-serif';
          ctx.fillStyle = '#94a3b8';
          ctx.fillText('Family, Self, or Pooja Photo', dX + dW / 2, dY + dH / 2 + 20);

          drawBottomText(ctx, width, height);
        }
      } else {
        // Arch / Center mode
        const cX = 150;
        const cY = 100;
        const cW = 500;
        const cH = 540;

        ctx.save();
        ctx.beginPath();
        ctx.roundRect(cX, cY, cW, cH, 24);
        ctx.clip();
        ctx.drawImage(gurujiImg, cX, cY, cW, cH);
        ctx.restore();

        ctx.strokeStyle = '#eab308';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.roundRect(cX, cY, cW, cH, 24);
        ctx.stroke();

        drawBottomText(ctx, width, height);
      }
    };
  };

  const drawBottomText = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    // Devotee Name
    ctx.fillStyle = '#fef08a';
    ctx.font = 'bold 26px serif';
    ctx.textAlign = 'center';
    ctx.fillText(devoteeName || 'Devotee Family', width / 2, 700);

    // Blessing Line
    ctx.fillStyle = '#fbbf24';
    ctx.font = 'italic bold 19px serif';
    ctx.fillText(blessingLine, width / 2, 745);

    // Affirmation
    ctx.fillStyle = '#cbd5e1';
    ctx.font = '15px sans-serif';
    ctx.fillText('May divine grace, protection & harmony illuminate our path.', width / 2, 785);

    // Studio Mark
    ctx.fillStyle = '#64748b';
    ctx.font = '12px sans-serif';
    ctx.fillText('GurucraftPro Sacred Devotee Studio • Original Digital Art', width / 2, 850);
  };

  const handleDevoteePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        if (ev.target?.result) {
          setDevoteePhoto(ev.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement('a');
    link.download = `Guruji-Custom-Photo-Frame-${devoteeName.replace(/\s+/g, '-')}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  const handleShareWhatsApp = () => {
    const text = `🌸 *GurucraftPro — Customized Family Darshan Frame* 🌸\n\n✨ Devotee Family: *${devoteeName}*\n🙏 *${blessingLine}*\n\n॥ जय गुरु जी • शुकराना गुरु जी ॥\n\nCreate your own free frame at: ${window.location.href}`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <section id="photo-studio" className="space-y-8 rounded-3xl bg-slate-900/90 border border-purple-500/30 p-6 md:p-10 shadow-2xl">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-purple-500/20 pb-6">
        <div className="space-y-1">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Devotee Keepsake Studio</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Customize Guruji Frame With Your Photo
          </h2>
          <p className="text-sm text-slate-400">
            Create an auspicious keepsake by framing your personal or family photograph beside Guruji's divine Swaroop in temple arches.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <span className="px-3 py-1.5 rounded-xl bg-purple-500/20 text-purple-300 border border-purple-500/30 text-xs font-bold">
            🖼️ 100% Free 4K HD Export
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Form Controls */}
        <div className="lg:col-span-6 space-y-6">
          {/* 1. Upload Photo */}
          <div className="p-5 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-3">
            <div className="text-xs font-black tracking-wider uppercase text-amber-400 flex items-center space-x-2">
              <Upload className="w-4 h-4" />
              <span>1. Upload Your Personal / Family Photo</span>
            </div>

            <label className="cursor-pointer flex flex-col items-center justify-center p-6 border-2 border-dashed border-slate-700 hover:border-amber-400 rounded-2xl bg-slate-900/50 hover:bg-slate-900 transition-all">
              <Upload className="w-8 h-8 text-amber-400 mb-2" />
              <span className="text-xs font-bold text-white">Click or drag photo here</span>
              <span className="text-[11px] text-slate-400 mt-1">Supports JPG, PNG, WEBP</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleDevoteePhotoUpload}
                className="hidden"
              />
            </label>

            {devoteePhoto && (
              <div className="flex items-center justify-between text-xs text-emerald-400 pt-1">
                <span className="flex items-center space-x-1">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Photo loaded successfully</span>
                </span>
                <button
                  onClick={() => setDevoteePhoto(null)}
                  className="text-rose-400 hover:text-rose-300 font-bold"
                >
                  Remove
                </button>
              </div>
            )}
          </div>

          {/* 2. Choose Guruji Swaroop */}
          <div className="p-5 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-3">
            <div className="text-xs font-black tracking-wider uppercase text-amber-400 flex items-center space-x-2">
              <ImageIcon className="w-4 h-4" />
              <span>2. Choose Guruji Swaroop</span>
            </div>

            <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 max-h-36 overflow-y-auto pr-1">
              {artworks.slice(0, 12).map((art) => (
                <button
                  key={art.id}
                  onClick={() => setSelectedGurujiSwaroop(art.imageUrl)}
                  className={`relative rounded-xl overflow-hidden aspect-square border-2 transition-all ${
                    selectedGurujiSwaroop === art.imageUrl
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

          {/* 3. Devotee Name & Blessing Line */}
          <div className="p-5 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-4">
            <div className="text-xs font-black tracking-wider uppercase text-amber-400 flex items-center space-x-2">
              <User className="w-4 h-4" />
              <span>3. Devotee Name & Sacred Text</span>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                Devotee / Family Name
              </label>
              <input
                type="text"
                value={devoteeName}
                onChange={(e) => setDevoteeName(e.target.value)}
                placeholder="e.g. Annu Dhaneja & Family"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs font-semibold focus:outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                Sacred Chant / Blessing Line
              </label>
              <input
                type="text"
                value={blessingLine}
                onChange={(e) => setBlessingLine(e.target.value)}
                placeholder="e.g. ॥ गुरु कृपा ही केवलम् • शुकराना गुरु जी ॥"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-amber-300 text-xs font-semibold focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>

          {/* 4. Zoom & Brightness Sliders */}
          {devoteePhoto && (
            <div className="p-5 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-3">
              <div className="text-xs font-black tracking-wider uppercase text-amber-400 flex items-center space-x-2">
                <Sliders className="w-4 h-4" />
                <span>4. Adjust Photo Scale & Light</span>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-slate-300 mb-1">
                    Zoom ({photoZoom.toFixed(1)}x)
                  </label>
                  <input
                    type="range"
                    min="0.8"
                    max="2.0"
                    step="0.1"
                    value={photoZoom}
                    onChange={(e) => setPhotoZoom(parseFloat(e.target.value))}
                    className="w-full accent-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-300 mb-1">
                    Brightness ({photoBrightness}%)
                  </label>
                  <input
                    type="range"
                    min="70"
                    max="140"
                    step="5"
                    value={photoBrightness}
                    onChange={(e) => setPhotoBrightness(parseInt(e.target.value))}
                    className="w-full accent-amber-400"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Live Canvas Preview */}
        <div className="lg:col-span-6 flex flex-col items-center space-y-5">
          <div className="w-full flex items-center justify-between text-xs text-slate-400">
            <span className="font-bold uppercase tracking-wider text-amber-400">
              Live Real-Time Frame Preview
            </span>
            <span>Dimensions: 800 × 900 px</span>
          </div>

          <div className="relative w-full max-w-md rounded-3xl overflow-hidden shadow-2xl border-2 border-purple-500/40 bg-slate-950">
            <canvas
              ref={canvasRef}
              className="w-full h-auto block rounded-2xl"
              style={{ maxHeight: '560px', objectFit: 'contain' }}
            />
          </div>

          <div className="w-full max-w-md grid grid-cols-2 gap-3">
            <button
              onClick={handleDownload}
              className="flex items-center justify-center space-x-2 px-4 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-black text-xs sm:text-sm shadow-xl shadow-amber-500/20 transition-all hover:scale-105"
            >
              <Download className="w-4 h-4" />
              <span>Download 4K PNG</span>
            </button>

            <button
              onClick={handleShareWhatsApp}
              className="flex items-center justify-center space-x-2 px-4 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm shadow-lg shadow-emerald-600/20 transition-all hover:scale-105"
            >
              <Share2 className="w-4 h-4" />
              <span>Share WhatsApp</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
