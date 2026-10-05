import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Wand2,
  Sparkles,
  Send,
  CheckCircle,
  Upload,
  Clock,
  ShieldCheck,
  Phone,
  Mail,
  User,
  MessageSquare,
} from 'lucide-react';

interface CustomDesignRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CustomDesignRequestModal: React.FC<CustomDesignRequestModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [serviceType, setServiceType] = useState('Bespoke Spiritual Artwork & Frame');
  const [dimensions, setDimensions] = useState('A3 Frame (12x18 in)');
  const [deadline, setDeadline] = useState('Standard (24 - 48 Hours)');
  const [budget, setBudget] = useState('₹499 - ₹1,499');
  const [briefDescription, setBriefDescription] = useState('');
  const [referenceImageUrl, setReferenceImageUrl] = useState('');
  const [colorPreferences, setColorPreferences] = useState('Golden Amber & Deep Sacred Indigo');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedRequest, setSubmittedRequest] = useState<any | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || !customerPhone.trim()) return;

    try {
      setIsSubmitting(true);
      const res = await fetch('/api/guruji/custom-requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName,
          customerPhone,
          customerWhatsapp: customerPhone,
          customerEmail,
          serviceType,
          dimensions,
          deadline,
          budget,
          briefDescription,
          referenceImageUrl,
          colorPreferences,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setSubmittedRequest(data.request);
      }
    } catch (err) {
      console.error('Custom request error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetAndClose = () => {
    setSubmittedRequest(null);
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 overflow-y-auto bg-black/85 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.25 }}
          className="relative w-full max-w-2xl bg-neutral-900 border border-neutral-800 rounded-2xl shadow-2xl overflow-hidden my-auto max-h-[90vh] flex flex-col"
          id="custom-design-request-modal"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-800 bg-neutral-950/80 sticky top-0 z-10 backdrop-blur-md">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
                <Wand2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white tracking-tight">
                  Request Bespoke Custom Design
                </h3>
                <p className="text-[11px] text-neutral-400">
                  Commission Annu Dhaneja & GurucraftPro Studio for dedicated custom artwork
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleResetAndClose}
              className="p-2 rounded-full bg-neutral-800 hover:bg-neutral-700 text-neutral-400 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Body */}
          <div className="p-6 overflow-y-auto">
            {submittedRequest ? (
              <div className="text-center py-6 space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto">
                  <CheckCircle className="w-8 h-8" />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-white">Custom Brief Received!</h4>
                  <p className="text-xs text-amber-400 font-mono mt-1 font-semibold">
                    Request ID: #{submittedRequest.requestNumber}
                  </p>
                  <p className="text-xs text-neutral-300 mt-2 max-w-md mx-auto leading-relaxed">
                    Shukrana {submittedRequest.customerName}! Our design studio team will review your requirements and share an initial proof/quotation on your WhatsApp ({submittedRequest.customerPhone}) shortly.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800 text-left max-w-md mx-auto text-xs space-y-2 text-neutral-300">
                  <div className="flex justify-between">
                    <span className="text-neutral-500">Service:</span>
                    <span className="font-semibold text-white">{submittedRequest.serviceType}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-500">Timeline:</span>
                    <span className="font-semibold text-emerald-400">{submittedRequest.deadline}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-500">Status:</span>
                    <span className="px-2 py-0.5 rounded bg-purple-500/20 text-purple-400 text-[10px] font-bold">
                      IN QUEUE
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleResetAndClose}
                  className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs shadow-md transition-colors"
                >
                  Done & Back to Marketplace
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-neutral-300 block mb-1">
                      Your Full Name <span className="text-rose-400">*</span>
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-neutral-500 absolute left-3 top-2.5" />
                      <input
                        type="text"
                        required
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        placeholder="e.g. Annu / Devotee"
                        className="w-full pl-9 pr-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-xs text-white focus:outline-none focus:border-amber-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-neutral-300 block mb-1">
                      WhatsApp Phone Number <span className="text-rose-400">*</span>
                    </label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-neutral-500 absolute left-3 top-2.5" />
                      <input
                        type="tel"
                        required
                        value={customerPhone}
                        onChange={(e) => setCustomerPhone(e.target.value)}
                        placeholder="+91 98000 00000"
                        className="w-full pl-9 pr-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-xs text-white focus:outline-none focus:border-amber-500"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-neutral-300 block mb-1">
                      Design Category / Purpose
                    </label>
                    <select
                      value={serviceType}
                      onChange={(e) => setServiceType(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-xs text-white focus:outline-none focus:border-amber-500"
                    >
                      <option value="Bespoke Spiritual Artwork & Frame">Bespoke Spiritual Artwork & Frame</option>
                      <option value="Personalized Family Devotional Portrait">Personalized Family Devotional Portrait</option>
                      <option value="Visiting Card & Business Identity">Visiting Card & Business Identity</option>
                      <option value="Instagram Post & WhatsApp Story Suite">Instagram Post & WhatsApp Story Suite</option>
                      <option value="Custom Festival Greeting & Banner">Custom Festival Greeting & Banner</option>
                      <option value="Book Cover & Print Publication">Book Cover & Print Publication</option>
                      <option value="Photo Restoration & Retouching">Photo Restoration & Retouching</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-neutral-300 block mb-1">
                      Target Dimensions / Frame Size
                    </label>
                    <select
                      value={dimensions}
                      onChange={(e) => setDimensions(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-xs text-white focus:outline-none focus:border-amber-500"
                    >
                      <option value="A3 Frame (12x18 in)">A3 Frame (12x18 in)</option>
                      <option value="A4 Portrait (8.3x11.7 in)">A4 Portrait (8.3x11.7 in)</option>
                      <option value="Large 24x36 in Canvas Wall Master">Large 24x36 in Canvas Wall Master</option>
                      <option value="1:1 Square (1080x1080 px Social)">1:1 Square (1080x1080 px Social)</option>
                      <option value="9:16 Mobile Wallpaper & Story (1080x1920)">9:16 Mobile Wallpaper & Story (1080x1920)</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-neutral-300 block mb-1">
                      Delivery Timeline Speed
                    </label>
                    <select
                      value={deadline}
                      onChange={(e) => setDeadline(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-xs text-white focus:outline-none focus:border-amber-500"
                    >
                      <option value="Super Express (Within 6 Hours)">Super Express (Within 6 Hours)</option>
                      <option value="Standard (24 - 48 Hours)">Standard (24 - 48 Hours)</option>
                      <option value="Relaxed (3 - 5 Days)">Relaxed (3 - 5 Days)</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-neutral-300 block mb-1">
                      Expected Budget Range
                    </label>
                    <select
                      value={budget}
                      onChange={(e) => setBudget(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-xs text-white focus:outline-none focus:border-amber-500"
                    >
                      <option value="₹299 - ₹499 (Standard Single Design)">₹299 - ₹499 (Standard Single Design)</option>
                      <option value="₹499 - ₹1,499 (Master 4K Suite with Layered PSD)">₹499 - ₹1,499 (Master 4K Suite with Layered PSD)</option>
                      <option value="₹1,500+ (Full Campaign & Multi-Size Suite)">₹1,500+ (Full Campaign & Multi-Size Suite)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-neutral-300 block mb-1">
                    Reference Image or Google Drive Link (Optional)
                  </label>
                  <input
                    type="url"
                    value={referenceImageUrl}
                    onChange={(e) => setReferenceImageUrl(e.target.value)}
                    placeholder="https://drive.google.com/... or image URL"
                    className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-neutral-300 block mb-1">
                    Describe your design concept & text details <span className="text-rose-400">*</span>
                  </label>
                  <textarea
                    required
                    value={briefDescription}
                    onChange={(e) => setBriefDescription(e.target.value)}
                    placeholder="Please specify specific titles, Sanskrit mantras, family names, sacred dates, or custom color requirements..."
                    rows={3}
                    className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div className="pt-3 border-t border-neutral-800 flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs text-emerald-400">
                    <ShieldCheck className="w-4 h-4" />
                    <span>Free WhatsApp Consultation & Preview Proofs</span>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-neutral-950 font-extrabold text-xs flex items-center gap-2 shadow-lg shadow-amber-500/20 active:scale-98 transition-all disabled:opacity-50"
                  >
                    <Send className="w-4 h-4" />
                    {isSubmitting ? 'Sending Request...' : 'Submit Design Request'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
