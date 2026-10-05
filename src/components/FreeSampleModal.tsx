import React, { useState } from 'react';
import {
  X,
  Sparkles,
  Upload,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Clock,
  ShieldCheck,
  Eye,
  FileText,
  Download,
  Phone
} from 'lucide-react';
import { FreeSampleRequest } from '../types';

interface FreeSampleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStartOrder?: () => void;
}

export const FreeSampleModal: React.FC<FreeSampleModalProps> = ({
  isOpen,
  onClose,
  onStartOrder,
}) => {
  const [activeTab, setActiveTab] = useState<'request' | 'track'>('request');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [whatsapp, setWhatsapp] = useState('+91 ');
  const [category, setCategory] = useState('Beauty & Cosmetics');
  const [marketplace, setMarketplace] = useState('Amazon India');
  const [requirements, setRequirements] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedSample, setSubmittedSample] = useState<FreeSampleRequest | null>(null);
  const [errorMessage, setErrorMessage] = useState('');

  // Track tab state
  const [trackQuery, setTrackQuery] = useState('');
  const [trackedSamples, setTrackedSamples] = useState<FreeSampleRequest[] | null>(null);
  const [isTrackLoading, setIsTrackLoading] = useState(false);
  const [trackError, setTrackError] = useState('');

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!name.trim() || !email.trim() || !requirements.trim()) {
      setErrorMessage('Please fill in your name, email, and requirements.');
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate file upload or use preview
      const uploadedImageUrl = previewUrl || '/src/assets/images/hero_watch_raw_1790156645806.jpg';

      const response = await fetch('/api/free-samples', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          whatsapp: whatsapp.trim(),
          category,
          marketplace,
          requirements: requirements.trim(),
          imageUrl: uploadedImageUrl,
          imageFileName: selectedFile ? selectedFile.name : 'product-sample.jpg',
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit free sample request.');
      }

      setSubmittedSample(data.sample);
    } catch (err: any) {
      setErrorMessage(err.message || 'Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTrackSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackQuery.trim()) return;

    setIsTrackLoading(true);
    setTrackError('');
    setTrackedSamples(null);

    try {
      const isEmail = trackQuery.includes('@');
      const param = isEmail ? `email=${encodeURIComponent(trackQuery.trim())}` : `id=${encodeURIComponent(trackQuery.trim())}`;
      const res = await fetch(`/api/free-samples?${param}`);
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to fetch sample.');
      }

      if (Array.isArray(data) && data.length > 0) {
        setTrackedSamples(data);
      } else {
        setTrackError('No free sample found with that Email or Sample ID.');
      }
    } catch (err: any) {
      setTrackError(err.message || 'Error tracking sample.');
    } finally {
      setIsTrackLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-purple-500/30 rounded-3xl shadow-2xl overflow-hidden my-8">
        {/* Header Ribbon */}
        <div className="bg-gradient-to-r from-purple-900/60 via-slate-900 to-indigo-900/60 px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-amber-400/20 border border-amber-400/40 text-amber-300 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Zero-Risk Guarantee</span>
            </span>
            <span className="text-xs text-slate-400 hidden sm:inline">• 12h Turnaround</span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Toggle */}
        <div className="px-6 pt-4 flex border-b border-slate-800">
          <button
            type="button"
            onClick={() => setActiveTab('request')}
            className={`pb-3 px-4 text-xs font-bold border-b-2 transition-colors ${
              activeTab === 'request'
                ? 'border-purple-500 text-white'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Request Free Edit (1 Image)
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('track')}
            className={`pb-3 px-4 text-xs font-bold border-b-2 transition-colors ${
              activeTab === 'track'
                ? 'border-cyan-500 text-cyan-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Check Sample Status / Proof
          </button>
        </div>

        {/* Body Content */}
        <div className="p-6 max-h-[80vh] overflow-y-auto">
          {activeTab === 'request' ? (
            submittedSample ? (
              /* Success View */
              <div className="text-center py-6 space-y-5">
                <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 mx-auto flex items-center justify-center">
                  <CheckCircle2 className="w-8 h-8" />
                </div>

                <div className="space-y-2">
                  <h3 className="text-2xl font-black font-heading text-white">
                    Sample Request Received!
                  </h3>
                  <p className="text-xs text-slate-300 max-w-md mx-auto">
                    Your sample tracking ID is{' '}
                    <span className="font-mono font-bold text-amber-400 bg-slate-950 px-2.5 py-1 rounded border border-slate-800">
                      {submittedSample.id}
                    </span>
                    . We have assigned a senior Photoshop artist to your image.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-left text-xs space-y-2 max-w-md mx-auto">
                  <div className="flex justify-between text-slate-400">
                    <span>Client:</span>
                    <span className="font-bold text-white">{submittedSample.name}</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Marketplace:</span>
                    <span className="font-bold text-cyan-300">{submittedSample.marketplace}</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Turnaround SLA:</span>
                    <span className="font-bold text-emerald-400">12 Hours or Less</span>
                  </div>
                </div>

                <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setSubmittedSample(null);
                      setName('');
                      setRequirements('');
                    }}
                    className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-colors"
                  >
                    Submit Another Sample
                  </button>

                  {onStartOrder && (
                    <button
                      type="button"
                      onClick={() => {
                        onClose();
                        onStartOrder();
                      }}
                      className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold shadow-lg shadow-purple-900/40 inline-flex items-center space-x-1.5 transition-colors"
                    >
                      <span>Start Full Catalog Project</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            ) : (
              /* Request Form */
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1">
                  <h3 className="text-xl font-black font-heading text-white">
                    Send 1 Raw Product Photo for Free Retouching
                  </h3>
                  <p className="text-xs text-slate-400">
                    See the quality of our hand-drawn clipping paths, color balancing, and shadow work with zero commitment.
                  </p>
                </div>

                {errorMessage && (
                  <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs text-rose-300 flex items-center space-x-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="block text-slate-300 font-bold mb-1">Your Full Name *</label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Kunal Kapoor"
                      className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-600 focus:outline-none focus:border-purple-500"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 font-bold mb-1">Work / Brand Email *</label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="seller@brand.com"
                      className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-600 focus:outline-none focus:border-purple-500"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 font-bold mb-1">WhatsApp Number</label>
                    <input
                      type="text"
                      value={whatsapp}
                      onChange={(e) => setWhatsapp(e.target.value)}
                      placeholder="+91 98765 43210"
                      className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-600 focus:outline-none focus:border-purple-500"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 font-bold mb-1">Target Marketplace</label>
                    <select
                      value={marketplace}
                      onChange={(e) => setMarketplace(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-purple-500"
                    >
                      <option value="Amazon India">Amazon India (RGB 255 White, 85% fill)</option>
                      <option value="Flipkart">Flipkart Seller Hub</option>
                      <option value="Myntra">Myntra (3:4 High-fashion)</option>
                      <option value="Meesho">Meesho Catalog</option>
                      <option value="Shopify Store">Shopify / D2C Website</option>
                      <option value="Nykaa">Nykaa Beauty</option>
                      <option value="Blinkit">Blinkit / Quick Commerce</option>
                    </select>
                  </div>
                </div>

                <div className="text-xs">
                  <label className="block text-slate-300 font-bold mb-1">Product Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-purple-500"
                  >
                    <option value="Beauty & Cosmetics">Beauty & Cosmetics (Bottles, Serums, Jars)</option>
                    <option value="Jewellery & Watches">Jewellery & Watches (Macro reflections)</option>
                    <option value="Footwear & Sneakers">Footwear & Sneakers</option>
                    <option value="Apparel & Fashion">Apparel & Fashion (Wrinkle removal)</option>
                    <option value="Electronics & Gadgets">Electronics & Gadgets</option>
                    <option value="Home & Kitchen">Home & Kitchen Accessories</option>
                    <option value="Supplements & Food">Supplements & Packaged Food</option>
                    <option value="Other">Other Category</option>
                  </select>
                </div>

                <div className="text-xs">
                  <label className="block text-slate-300 font-bold mb-1">Editing Requirements & Notes *</label>
                  <textarea
                    required
                    rows={2}
                    value={requirements}
                    onChange={(e) => setRequirements(e.target.value)}
                    placeholder="e.g. Pure white background, remove dust/scratches, add subtle natural drop shadow, align centered."
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-600 focus:outline-none focus:border-purple-500"
                  />
                </div>

                {/* Upload Zone */}
                <div className="text-xs">
                  <label className="block text-slate-300 font-bold mb-1">Upload 1 Product Image (Max 50MB)</label>
                  <div className="p-4 border-2 border-dashed border-slate-700 hover:border-purple-500 rounded-2xl bg-slate-950/60 text-center relative cursor-pointer group transition-colors">
                    <input
                      type="file"
                      accept="image/*,.psd,.raw,.cr2,.nef"
                      onChange={handleFileChange}
                      className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                    />

                    {previewUrl ? (
                      <div className="flex items-center justify-center space-x-3">
                        <img
                          src={previewUrl}
                          alt="Preview"
                          className="w-14 h-14 object-cover rounded-xl border border-slate-700"
                        />
                        <div className="text-left">
                          <p className="font-bold text-white text-xs truncate max-w-[200px]">
                            {selectedFile ? selectedFile.name : 'Selected Image'}
                          </p>
                          <span className="text-[10px] text-emerald-400">Ready for sample edit</span>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-1">
                        <Upload className="w-6 h-6 text-purple-400 mx-auto group-hover:scale-110 transition-transform" />
                        <p className="text-slate-300 font-medium text-xs">
                          Click to browse or drop your camera raw file
                        </p>
                        <p className="text-[10px] text-slate-500">
                          Supports JPG, PNG, WEBP, TIFF, or PSD
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3.5 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500 hover:opacity-95 text-white font-bold text-xs shadow-lg shadow-purple-900/40 flex items-center justify-center space-x-2 transition-all disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <span>Sending to Senior Artist...</span>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4 text-amber-300" />
                        <span>Claim My Free Test Edit Now</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="flex items-center justify-center space-x-4 text-[10px] text-slate-400 pt-1">
                  <span className="flex items-center space-x-1">
                    <Clock className="w-3 h-3 text-cyan-400" />
                    <span>Delivered in 12h</span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <ShieldCheck className="w-3 h-3 text-emerald-400" />
                    <span>No Credit Card Required</span>
                  </span>
                </div>
              </form>
            )
          ) : (
            /* Track Status Tab */
            <div className="space-y-6">
              <form onSubmit={handleTrackSearch} className="space-y-3">
                <div className="space-y-1">
                  <h3 className="text-base font-bold text-white">Track Your Free Sample Status</h3>
                  <p className="text-xs text-slate-400">
                    Enter the email address you used or your Sample ID (e.g., SMP-2026-101) to view retouched proofs.
                  </p>
                </div>

                <div className="flex gap-2">
                  <input
                    type="text"
                    value={trackQuery}
                    onChange={(e) => setTrackQuery(e.target.value)}
                    placeholder="Enter email (e.g. vikram.sethi@example.com) or Sample ID"
                    className="flex-1 px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500"
                  />
                  <button
                    type="submit"
                    disabled={isTrackLoading}
                    className="px-5 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold transition-colors disabled:opacity-50"
                  >
                    {isTrackLoading ? 'Searching...' : 'Search'}
                  </button>
                </div>

                {trackError && (
                  <p className="text-xs text-rose-400 flex items-center space-x-1">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{trackError}</span>
                  </p>
                )}
              </form>

              {/* Display Tracked Samples */}
              {trackedSamples && (
                <div className="space-y-4 pt-2 border-t border-slate-800">
                  {trackedSamples.map((sample) => (
                    <div
                      key={sample.id}
                      className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3 text-xs"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="font-mono font-bold text-white">{sample.id}</span>
                          <span className="text-[10px] text-slate-400 block">{sample.marketplace} • {sample.category}</span>
                        </div>

                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            sample.status === 'COMPLETED'
                              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                              : sample.status === 'EDITING'
                              ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                              : 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                          }`}
                        >
                          {sample.status}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <span className="text-[10px] text-slate-500 block mb-1">Your Raw Upload</span>
                          <img
                            src={sample.imageUrl}
                            alt="Raw Upload"
                            className="w-full aspect-square object-cover rounded-xl border border-slate-800"
                          />
                        </div>

                        <div>
                          <span className="text-[10px] text-slate-500 block mb-1">
                            {sample.status === 'COMPLETED' ? 'Studio Retouched Proof' : 'Artist Working'}
                          </span>
                          {sample.resultImageUrl ? (
                            <div className="relative group">
                              <img
                                src={sample.resultImageUrl}
                                alt="Studio Edit"
                                className="w-full aspect-square object-cover rounded-xl border border-emerald-500/40"
                              />
                              {sample.watermarkEnabled && (
                                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                  <span className="text-white/30 font-black text-xs uppercase tracking-widest rotate-[-30deg]">
                                    PixelCraft Sample
                                  </span>
                                </div>
                              )}
                            </div>
                          ) : (
                            <div className="w-full aspect-square rounded-xl bg-slate-900 border border-dashed border-slate-800 flex flex-col items-center justify-center p-3 text-center text-slate-500 space-y-1">
                              <Clock className="w-5 h-5 text-amber-400 animate-spin" />
                              <span className="text-[11px] font-medium text-slate-300">In Photoshop Queue</span>
                              <span className="text-[9px]">SLA under 12h</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {sample.status === 'COMPLETED' && (
                        <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-[11px] flex items-center justify-between">
                          <span>Happy with this proof? Ready to edit your full catalog!</span>
                          {onStartOrder && (
                            <button
                              type="button"
                              onClick={() => {
                                onClose();
                                onStartOrder();
                              }}
                              className="px-3 py-1 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-[10px] shrink-0"
                            >
                              Order Catalog Batch
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
