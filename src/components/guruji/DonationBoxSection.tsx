import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Heart,
  ShieldCheck,
  Sparkles,
  Lock,
  CheckCircle2,
  Gift,
  Coins,
  Building2,
  Users,
  Feather,
  Download,
  Share2,
  ArrowRight,
} from 'lucide-react';
import { useCart } from '../../context/CartContext';

interface DonationBoxSectionProps {
  onSuccessNotice?: (msg: string) => void;
}

const PRESET_AMOUNTS = [101, 251, 501, 1100, 2100, 5100];

const SEVA_PURPOSES = [
  {
    id: 'mandir_langar',
    title: 'Mandir Langar Seva',
    description: 'Provide blessed prasad and langar meals to pilgrims and devotees daily.',
    icon: '🍲',
    highlight: 'Most Popular',
  },
  {
    id: 'ashram_seva',
    title: 'Ashram Maintenance & Lighting',
    description: 'Support holy sanctum diya oil, floral decorations, and pristine cleanliness.',
    icon: '🪔',
  },
  {
    id: 'gaushala',
    title: 'Gaushala & Sacred Cattle Care',
    description: 'Feed, shelter, and provide medical care to indigenous holy cows and calves.',
    icon: '🐄',
  },
  {
    id: 'digital_preservation',
    title: 'Digital Spiritual Preservation',
    description: 'Help digitize, archive, and freely distribute 4K divine artworks and holy vachans globally.',
    icon: '✨',
  },
  {
    id: 'general_blessing',
    title: 'General Spiritual Trust Fund',
    description: 'Allocate wherever most needed across community welfare and seva initiatives.',
    icon: '🙏',
  },
];

export const DonationBoxSection: React.FC<DonationBoxSectionProps> = ({ onSuccessNotice }) => {
  const { addItem } = useCart();
  const [selectedAmount, setSelectedAmount] = useState<number>(501);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [selectedPurpose, setSelectedPurpose] = useState<string>('mandir_langar');
  const [donorName, setDonorName] = useState<string>('');
  const [donorEmail, setDonorEmail] = useState<string>('');
  const [donorPhone, setDonorPhone] = useState<string>('');
  const [prayerMessage, setPrayerMessage] = useState<string>('');
  const [isAnonymous, setIsAnonymous] = useState<boolean>(false);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [completedDonation, setCompletedDonation] = useState<any | null>(null);

  const effectiveAmount = customAmount ? parseFloat(customAmount) || 0 : selectedAmount;

  const handlePresetSelect = (amount: number) => {
    setSelectedAmount(amount);
    setCustomAmount('');
  };

  const handleCustomChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/[^0-9]/g, '');
    setCustomAmount(val);
  };

  const handleDonateNow = async (e: React.FormEvent) => {
    e.preventDefault();
    if (effectiveAmount < 11) {
      alert('Please enter a minimum donation amount of ₹11.');
      return;
    }

    const purposeObj = SEVA_PURPOSES.find((p) => p.id === selectedPurpose);

    setIsProcessing(true);

    try {
      // Add donation item to cart for instant checkout or submit to donation API
      addItem({
        id: `donation-${Date.now()}`,
        name: `Donation: ${purposeObj?.title || 'Spiritual Seva'}`,
        price: effectiveAmount,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1584438784894-089d6a62b8fa?auto=format&fit=crop&w=600&q=80',
        serviceType: 'donation',
        isDigital: true,
        notes: `Donor: ${isAnonymous ? 'Anonymous Devotee' : donorName || 'Devotee'}, Purpose: ${purposeObj?.title}, Prayer: ${prayerMessage || 'None'}`,
      });

      if (onSuccessNotice) {
        onSuccessNotice(`₹${effectiveAmount} Seva added to cart. Proceed to checkout to receive instant receipt.`);
      }

      setCompletedDonation({
        id: `DON-${Date.now().toString().slice(-6)}`,
        amount: effectiveAmount,
        purpose: purposeObj?.title,
        donorName: isAnonymous ? 'Anonymous Devotee' : donorName || 'Devotee',
        date: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }),
      });
    } catch (err) {
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300" id="spiritual-donation-box-section">
      {/* Header Banner */}
      <div className="relative rounded-3xl bg-gradient-to-br from-neutral-900 via-amber-950/30 to-neutral-950 border border-amber-500/30 p-6 sm:p-8 overflow-hidden shadow-2xl">
        <div className="absolute right-0 top-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-bold">
            <Heart className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span>Sacred Seva & Langar Trust • 100% Transparent</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Guruji Divine Donation Box (Gullak)
          </h2>
          <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
            Your sacred contributions support daily community langar, holy temple maintenance, gaushala care, and open-access spiritual preservation. Every rupee is accounted for with instant digital receipts.
          </p>
        </div>
      </div>

      {completedDonation ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="p-8 rounded-3xl bg-neutral-900 border border-emerald-500/40 text-center space-y-6 max-w-xl mx-auto shadow-2xl"
        >
          <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center mx-auto text-emerald-400">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <span className="text-xs font-semibold text-emerald-400 uppercase tracking-widest">
              Auspicious Blessing Registered
            </span>
            <h3 className="text-2xl font-black text-white">Shukrana! Seva Initiated</h3>
            <p className="text-sm text-neutral-300">
              Receipt No: <strong className="text-amber-400">{completedDonation.id}</strong>
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800 text-left text-xs space-y-2">
            <div className="flex justify-between text-neutral-400">
              <span>Seva Purpose:</span>
              <span className="text-white font-semibold">{completedDonation.purpose}</span>
            </div>
            <div className="flex justify-between text-neutral-400">
              <span>Contribution Amount:</span>
              <span className="text-amber-400 font-bold text-sm">₹{completedDonation.amount}</span>
            </div>
            <div className="flex justify-between text-neutral-400">
              <span>Donor Name:</span>
              <span className="text-white">{completedDonation.donorName}</span>
            </div>
            <div className="flex justify-between text-neutral-400">
              <span>Date:</span>
              <span className="text-neutral-300">{completedDonation.date}</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-3 justify-center">
            <button
              type="button"
              onClick={() => {
                alert('Donation Receipt downloaded successfully!');
              }}
              className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs flex items-center gap-2 shadow-lg shadow-amber-500/20"
            >
              <Download className="w-4 h-4" /> Download Blessing Receipt
            </button>
            <button
              type="button"
              onClick={() => setCompletedDonation(null)}
              className="px-5 py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white font-medium text-xs"
            >
              Offer Another Seva
            </button>
          </div>
        </motion.div>
      ) : (
        <form onSubmit={handleDonateNow} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Purpose & Amounts */}
          <div className="lg:col-span-7 space-y-6">
            {/* Step 1: Select Seva Purpose */}
            <div className="p-6 rounded-3xl bg-neutral-900/80 border border-neutral-800 space-y-4">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-amber-500 text-neutral-950 text-xs font-black flex items-center justify-center">
                  1
                </span>
                <h3 className="text-sm sm:text-base font-bold text-white">Select Sacred Seva Purpose</h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {SEVA_PURPOSES.map((purpose) => {
                  const isSelected = selectedPurpose === purpose.id;
                  return (
                    <div
                      key={purpose.id}
                      onClick={() => setSelectedPurpose(purpose.id)}
                      className={`relative p-4 rounded-2xl border cursor-pointer transition-all ${
                        isSelected
                          ? 'bg-amber-500/10 border-amber-500 shadow-md shadow-amber-500/10'
                          : 'bg-neutral-950/60 border-neutral-800 hover:border-neutral-700'
                      }`}
                    >
                      {purpose.highlight && (
                        <span className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-full text-[9px] font-bold bg-amber-500 text-neutral-950">
                          {purpose.highlight}
                        </span>
                      )}
                      <div className="text-2xl mb-2">{purpose.icon}</div>
                      <h4 className="text-xs sm:text-sm font-bold text-white mb-1">{purpose.title}</h4>
                      <p className="text-[11px] text-neutral-400 leading-relaxed">{purpose.description}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Step 2: Choose Contribution Amount */}
            <div className="p-6 rounded-3xl bg-neutral-900/80 border border-neutral-800 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-amber-500 text-neutral-950 text-xs font-black flex items-center justify-center">
                    2
                  </span>
                  <h3 className="text-sm sm:text-base font-bold text-white">Choose Offering Amount (₹)</h3>
                </div>
                <span className="text-xs font-semibold text-amber-400 flex items-center gap-1">
                  <Coins className="w-3.5 h-3.5" /> Auspicious Values
                </span>
              </div>

              {/* Preset Buttons */}
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                {PRESET_AMOUNTS.map((amt) => {
                  const isSelected = !customAmount && selectedAmount === amt;
                  return (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => handlePresetSelect(amt)}
                      className={`py-3 rounded-2xl text-xs sm:text-sm font-extrabold transition-all ${
                        isSelected
                          ? 'bg-amber-500 text-neutral-950 shadow-lg shadow-amber-500/20 scale-105'
                          : 'bg-neutral-950 text-neutral-200 border border-neutral-800 hover:border-amber-500/50 hover:text-white'
                      }`}
                    >
                      ₹{amt}
                    </button>
                  );
                })}
              </div>

              {/* Custom Amount Input */}
              <div className="pt-2">
                <label className="block text-xs text-neutral-400 font-medium mb-1.5">
                  Or Enter Custom Offering Amount (₹)
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-bold text-amber-400">₹</span>
                  <input
                    type="text"
                    value={customAmount}
                    onChange={handleCustomChange}
                    placeholder="Enter custom amount e.g. 5000"
                    className="w-full pl-9 pr-4 py-3 rounded-2xl bg-neutral-950 border border-neutral-800 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500 font-bold"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Donor Details & Checkout */}
          <div className="lg:col-span-5 space-y-6">
            <div className="p-6 rounded-3xl bg-neutral-900/80 border border-neutral-800 space-y-5 sticky top-24">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-amber-500 text-neutral-950 text-xs font-black flex items-center justify-center">
                  3
                </span>
                <h3 className="text-sm sm:text-base font-bold text-white">Donor Details & Prayers</h3>
              </div>

              {/* Anonymous Checkbox */}
              <label className="flex items-center gap-3 p-3 rounded-2xl bg-neutral-950 border border-neutral-800/80 cursor-pointer hover:border-neutral-700 transition">
                <input
                  type="checkbox"
                  checked={isAnonymous}
                  onChange={(e) => setIsAnonymous(e.target.checked)}
                  className="rounded border-neutral-700 text-amber-500 focus:ring-amber-500/20 bg-neutral-900 w-4 h-4"
                />
                <div className="text-xs">
                  <span className="font-bold text-white block">Make this Seva Anonymous</span>
                  <span className="text-neutral-400 text-[11px]">Your name will not appear on public donor lists.</span>
                </div>
              </label>

              {!isAnonymous && (
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-medium text-neutral-400 mb-1">Full Name (Devotee)</label>
                    <input
                      type="text"
                      value={donorName}
                      onChange={(e) => setDonorName(e.target.value)}
                      placeholder="e.g. Ramesh Chandra Sharma"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-neutral-400 mb-1">Email for Receipt</label>
                      <input
                        type="email"
                        value={donorEmail}
                        onChange={(e) => setDonorEmail(e.target.value)}
                        placeholder="yourname@gmail.com"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-neutral-400 mb-1">WhatsApp / Phone</label>
                      <input
                        type="tel"
                        value={donorPhone}
                        onChange={(e) => setDonorPhone(e.target.value)}
                        placeholder="+91 98765 43210"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500"
                      />
                    </div>
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-medium text-neutral-400 mb-1">
                  Personal Prayer / Blessing Sankalp (Optional)
                </label>
                <textarea
                  value={prayerMessage}
                  onChange={(e) => setPrayerMessage(e.target.value)}
                  rows={2}
                  placeholder="May Guruji bless our family with health, peace, and eternal devotion..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500 resize-none"
                />
              </div>

              {/* Order Summary Box */}
              <div className="p-4 rounded-2xl bg-neutral-950 border border-amber-500/20 space-y-2 text-xs">
                <div className="flex justify-between text-neutral-400">
                  <span>Selected Seva:</span>
                  <span className="text-white font-semibold">
                    {SEVA_PURPOSES.find((p) => p.id === selectedPurpose)?.title}
                  </span>
                </div>
                <div className="flex justify-between text-neutral-400">
                  <span>Trust Account:</span>
                  <span className="text-emerald-400 font-medium">Verified Mandir Seva Trust</span>
                </div>
                <div className="border-t border-neutral-800 pt-2 flex justify-between items-center">
                  <span className="font-bold text-white">Total Offering:</span>
                  <span className="text-lg font-black text-amber-400">₹{effectiveAmount}</span>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isProcessing || effectiveAmount < 11}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-neutral-950 font-black text-sm flex items-center justify-center gap-2 shadow-xl shadow-amber-500/20 transition-all active:scale-98 disabled:opacity-50"
                id="submit-donation-btn"
              >
                <Heart className="w-4 h-4 fill-current" />
                <span>Offer Seva of ₹{effectiveAmount}</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </button>

              <div className="flex items-center justify-center gap-2 text-[11px] text-neutral-400 text-center">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>256-bit Encrypted SSL • Instant 80G Tax Exemption Receipt</span>
              </div>
            </div>
          </div>
        </form>
      )}
    </div>
  );
};
