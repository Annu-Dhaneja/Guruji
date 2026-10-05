import React, { useState } from 'react';
import { X, Sparkles, Send, CheckCircle2, Phone, Mail, User, MapPin, Layers } from 'lucide-react';
import { GurujiInquiry, GurujiArtwork } from '../../types';

interface CustomFrameInquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitInquiry: (inquiry: Partial<GurujiInquiry>) => Promise<boolean>;
  artwork?: GurujiArtwork | null;
}

export const CustomFrameInquiryModal: React.FC<CustomFrameInquiryModalProps> = ({
  isOpen,
  onClose,
  onSubmitInquiry,
  artwork,
}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('');
  const [mandirSize, setMandirSize] = useState('24x36 Inches (Standard Mandir)');
  const [frameType, setFrameType] = useState('Gold Acrylic Backlit LED Frame');
  const [budget, setBudget] = useState('₹4,999 - ₹9,999');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  React.useEffect(() => {
    if (artwork) {
      setNotes((prev) => prev || `Inquiry regarding Swaroop: "${artwork.title}" (ID: ${artwork.id})`);
    }
  }, [artwork]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) return;

    setSubmitting(true);
    const success = await onSubmitInquiry({
      name: name.trim(),
      email: email.trim() || 'devotee@gurucraftpro.com',
      phone: phone.trim(),
      city: city.trim() || 'India',
      mandirSize,
      frameType,
      budget,
      notes: notes.trim(),
      status: 'NEW',
    });
    setSubmitting(false);

    if (success) {
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        onClose();
      }, 3000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-3xl bg-slate-900 border border-amber-500/30 p-6 sm:p-8 shadow-2xl space-y-6">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-black text-white">Custom Mandir Frame & Artwork Inquiry</h3>
              <p className="text-[11px] text-slate-400">Tailored 4K Acrylic, Canvas & Backlit LED Sanctuaries</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-slate-800 text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {submitted ? (
          <div className="p-6 text-center space-y-2 rounded-2xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-300">
            <CheckCircle2 className="w-8 h-8 mx-auto text-emerald-400" />
            <h4 className="text-sm font-black">Inquiry Sent to Annu Dhaneja Studio!</h4>
            <p className="text-xs text-slate-300">
              Our sacred design team will reach out via WhatsApp / Phone with mockups and dimensions within 24 hours.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {artwork && (
              <div className="flex items-center gap-3 p-2.5 rounded-2xl bg-amber-500/10 border border-amber-500/20">
                <img
                  src={artwork.imageUrl}
                  alt={artwork.title}
                  className="w-12 h-12 rounded-xl object-cover border border-amber-500/30"
                />
                <div className="flex-1 min-w-0">
                  <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider">Selected Artwork</span>
                  <h4 className="text-xs font-bold text-white truncate">{artwork.title}</h4>
                  <p className="text-[10px] text-slate-400 truncate">{artwork.category} • {artwork.isFree ? 'Free Asset' : `₹${artwork.price}`}</p>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Your Full Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Annu Dhaneja"
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs font-semibold focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">WhatsApp / Phone *</label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="e.g. 9876543210"
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs font-semibold focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">City / Region</label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="e.g. Delhi NCR"
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs font-semibold focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Estimated Budget</label>
                <select
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs font-semibold focus:outline-none focus:border-amber-400"
                >
                  <option value="₹2,499 - ₹4,999">₹2,499 - ₹4,999 (Compact Frame)</option>
                  <option value="₹4,999 - ₹9,999">₹4,999 - ₹9,999 (Standard Mandir)</option>
                  <option value="₹9,999 - ₹19,999">₹9,999 - ₹19,999 (Large Backlit LED)</option>
                  <option value="₹20,000+">₹20,000+ (Full Sanctum Installation)</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Frame Medium</label>
                <select
                  value={frameType}
                  onChange={(e) => setFrameType(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs font-semibold focus:outline-none focus:border-amber-400"
                >
                  <option value="Gold Acrylic Backlit LED Frame">Gold Acrylic Backlit LED</option>
                  <option value="Teak Wood Temple Arch Frame">Teak Wood Temple Arch</option>
                  <option value="4K Floating Glass Canvas">4K Floating Glass Canvas</option>
                  <option value="Velvet Metallic 3D Embossed">Velvet Metallic 3D Embossed</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Dimensions</label>
                <select
                  value={mandirSize}
                  onChange={(e) => setMandirSize(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs font-semibold focus:outline-none focus:border-amber-400"
                >
                  <option value="12x18 Inches (Pooja Thali / Compact)">12x18 Inches (Compact)</option>
                  <option value="18x24 Inches (Medium Wall)">18x24 Inches (Medium Wall)</option>
                  <option value="24x36 Inches (Standard Mandir)">24x36 Inches (Standard Mandir)</option>
                  <option value="36x48 Inches (Grand Hall)">36x48 Inches (Grand Sanctum)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                Custom Requirements / Specific Swaroop Preference
              </label>
              <textarea
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Mention any custom gold lettering, mantra engraving, or delivery deadline..."
                className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs font-medium focus:outline-none focus:border-amber-400"
              />
            </div>

            <div className="flex items-center justify-end space-x-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="px-6 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-black text-xs shadow-lg shadow-amber-500/20 disabled:opacity-50"
              >
                {submitting ? 'Submitting...' : 'Send Custom Inquiry'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
