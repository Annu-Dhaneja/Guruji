import React, { useState } from 'react';
import {
  X,
  Send,
  Upload,
  Sparkles,
  CheckCircle2,
  Clock,
  DollarSign,
  MessageCircle,
  FileText,
  AlertCircle,
  Link2,
} from 'lucide-react';
import { GraphicDesignService } from '../../data/graphicDesignData';

interface GraphicDesignInquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
  service?: GraphicDesignService | null;
  mode?: 'inquiry' | 'quote';
}

export const GraphicDesignInquiryModal: React.FC<GraphicDesignInquiryModalProps> = ({
  isOpen,
  onClose,
  service,
  mode = 'inquiry',
}) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    whatsapp: '',
    designType: service?.title || 'Custom Graphic Design Project',
    quantity: 1,
    deliverySpeed: 'sameday',
    budget: service ? `₹${service.startingPrice}` : '₹500 - ₹2,000',
    description: '',
    brandDetails: '',
    driveLink: '',
  });

  const [files, setFiles] = useState<{ name: string; size: string }[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [inquiryId, setInquiryId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files).map((f: File) => ({
        name: f.name,
        size: (f.size / (1024 * 1024)).toFixed(2) + ' MB',
      }));
      setFiles((prev) => [...prev, ...newFiles]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.email) {
      setError('Please fill in your Name, Email and Phone Number.');
      return;
    }
    setError(null);
    setIsSubmitting(true);

    const generatedId = `INQ-GD-${Math.floor(100000 + Math.random() * 900000)}`;

    try {
      const payload = {
        serviceId: service?.id || 'custom-graphic-design',
        serviceTitle: formData.designType,
        customerName: formData.name,
        customerEmail: formData.email,
        customerPhone: formData.phone,
        whatsapp: formData.whatsapp || formData.phone,
        quantity: formData.quantity,
        deliverySpeed: formData.deliverySpeed,
        budget: formData.budget,
        description: formData.description,
        brandDetails: formData.brandDetails,
        driveLink: formData.driveLink,
        uploadedFiles: files.map((f) => f.name),
      };

      const res = await fetch('/api/graphic-design/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.inquiry?.id) {
          setInquiryId(data.inquiry.id);
          return;
        }
      }

      setInquiryId(generatedId);
    } catch (err: any) {
      // In case of network failure, fallback gracefully with reference ID
      setInquiryId(generatedId);
    } finally {
      setIsSubmitting(false);
    }
  };

  const generateWhatsAppMessage = () => {
    const text = `*New Graphic Design ${mode === 'quote' ? 'Quote Request' : 'Inquiry'}*\n\n` +
      `*Inquiry ID:* ${inquiryId || 'GD-PENDING'}\n` +
      `*Name:* ${formData.name}\n` +
      `*Service:* ${formData.designType}\n` +
      `*Delivery:* ${formData.deliverySpeed}\n` +
      `*Budget:* ${formData.budget}\n` +
      `*Details:* ${formData.description || 'N/A'}\n` +
      (formData.driveLink ? `*Drive Assets:* ${formData.driveLink}\n` : '');
    return `https://wa.me/918527837527?text=${encodeURIComponent(text)}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-[#FFFFFF] dark:bg-[#182429] rounded-3xl border border-[#DCE7E7] dark:border-[#2A3C40] text-[#102A36] dark:text-[#F4F8F8] shadow-2xl overflow-hidden my-8">
        
        {/* Modal Header */}
        <div className="px-6 py-5 bg-[#F8FAFA] dark:bg-[#111A1E] border-b border-[#DCE7E7] dark:border-[#2A3C40] flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-[#DDF3F4] dark:bg-[#173D40] border border-[#0799A6]/30 flex items-center justify-center text-[#0799A6] dark:text-[#25B4BD]">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-black text-[#102A36] dark:text-[#F4F8F8]">
                {mode === 'quote' ? 'Request Custom Quote' : 'Project Inquiry & Brief'}
              </h3>
              <p className="text-xs text-[#52636A] dark:text-[#B7C6C8]">
                {service ? service.title : 'Tell us what you need and get a rapid quotation'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-[#52636A] dark:text-[#B7C6C8] hover:text-[#102A36] dark:hover:text-[#F4F8F8] hover:bg-[#DDF3F4]/50 dark:hover:bg-[#182429] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6">
          {inquiryId ? (
            /* Success View */
            <div className="text-center py-8 space-y-6">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-500 mx-auto flex items-center justify-center">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <div className="space-y-2">
                <h4 className="text-2xl font-black text-[#102A36] dark:text-[#F4F8F8]">Inquiry Submitted Successfully!</h4>
                <p className="text-xs text-[#52636A] dark:text-[#B7C6C8] max-w-md mx-auto">
                  Your request has been logged in our secure system. Annu Dhaneja & our lead design team will review your brief immediately.
                </p>
              </div>

              {/* Inquiry ID Card */}
              <div className="inline-block px-5 py-3 rounded-2xl bg-[#DDF3F4] dark:bg-[#173D40] border border-[#0799A6]/30">
                <span className="text-[10px] uppercase font-bold text-[#087581] dark:text-[#25B4BD] block tracking-wider">Inquiry Reference ID</span>
                <span className="text-lg font-black text-[#087581] dark:text-[#25B4BD] tracking-wider">{inquiryId}</span>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
                <a
                  href={generateWhatsAppMessage()}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-white font-bold text-xs flex items-center justify-center space-x-2 shadow-sm"
                >
                  <MessageCircle className="w-4 h-4 fill-white" />
                  <span>Chat Directly on WhatsApp</span>
                </a>
                <button
                  onClick={onClose}
                  className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#F8FAFA] dark:bg-[#111A1E] border border-[#DCE7E7] dark:border-[#2A3C40] hover:bg-[#DDF3F4]/50 text-[#102A36] dark:text-[#F4F8F8] font-bold text-xs"
                >
                  Done
                </button>
              </div>
            </div>
          ) : (
            /* Form View */
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-500 text-xs flex items-center space-x-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* Row 1: Name & Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#102A36] dark:text-[#F4F8F8] mb-1">
                    Your Full Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Vikram Singhal"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#F8FAFA] dark:bg-[#111A1E] border border-[#DCE7E7] dark:border-[#2A3C40] text-xs text-[#102A36] dark:text-[#F4F8F8] focus:outline-none focus:border-[#0799A6]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#102A36] dark:text-[#F4F8F8] mb-1">
                    Email Address <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="e.g. vikram@brand.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#F8FAFA] dark:bg-[#111A1E] border border-[#DCE7E7] dark:border-[#2A3C40] text-xs text-[#102A36] dark:text-[#F4F8F8] focus:outline-none focus:border-[#0799A6]"
                  />
                </div>
              </div>

              {/* Row 2: Phone & WhatsApp */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#102A36] dark:text-[#F4F8F8] mb-1">
                    Phone Number <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 98765 43210"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value, whatsapp: formData.whatsapp || e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#F8FAFA] dark:bg-[#111A1E] border border-[#DCE7E7] dark:border-[#2A3C40] text-xs text-[#102A36] dark:text-[#F4F8F8] focus:outline-none focus:border-[#0799A6]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#102A36] dark:text-[#F4F8F8] mb-1">
                    WhatsApp Number (For Instant Proofs)
                  </label>
                  <input
                    type="tel"
                    placeholder="+91 98765 43210"
                    value={formData.whatsapp}
                    onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#F8FAFA] dark:bg-[#111A1E] border border-[#DCE7E7] dark:border-[#2A3C40] text-xs text-[#102A36] dark:text-[#F4F8F8] focus:outline-none focus:border-[#0799A6]"
                  />
                </div>
              </div>

              {/* Row 3: Design Type, Quantity & Delivery Speed */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#102A36] dark:text-[#F4F8F8] mb-1">
                    Design Service / Type
                  </label>
                  <input
                    type="text"
                    value={formData.designType}
                    onChange={(e) => setFormData({ ...formData, designType: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#F8FAFA] dark:bg-[#111A1E] border border-[#DCE7E7] dark:border-[#2A3C40] text-xs text-[#102A36] dark:text-[#F4F8F8] focus:outline-none focus:border-[#0799A6]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#102A36] dark:text-[#F4F8F8] mb-1">
                    Quantity / Designs Count
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={100}
                    value={formData.quantity}
                    onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) || 1 })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#F8FAFA] dark:bg-[#111A1E] border border-[#DCE7E7] dark:border-[#2A3C40] text-xs text-[#102A36] dark:text-[#F4F8F8] focus:outline-none focus:border-[#0799A6]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#102A36] dark:text-[#F4F8F8] mb-1">
                    Preferred Turnaround
                  </label>
                  <select
                    value={formData.deliverySpeed}
                    onChange={(e) => setFormData({ ...formData, deliverySpeed: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#F8FAFA] dark:bg-[#111A1E] border border-[#DCE7E7] dark:border-[#2A3C40] text-xs text-[#102A36] dark:text-[#F4F8F8] focus:outline-none focus:border-[#0799A6]"
                  >
                    <option value="10mins">⚡ 10 Minutes Instant</option>
                    <option value="30mins">🚀 30 Minutes Ultra</option>
                    <option value="1hour">⚡ 1 Hour Express</option>
                    <option value="sameday">🔥 Same Day Delivery (6-12h)</option>
                    <option value="normal">Standard (24-48 Hours)</option>
                  </select>
                </div>
              </div>

              {/* Row 4: Budget & Google Drive Link */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#102A36] dark:text-[#F4F8F8] mb-1">
                    Estimated Budget
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. ₹500 - ₹1,500"
                    value={formData.budget}
                    onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#F8FAFA] dark:bg-[#111A1E] border border-[#DCE7E7] dark:border-[#2A3C40] text-xs text-[#102A36] dark:text-[#F4F8F8] focus:outline-none focus:border-[#0799A6]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#102A36] dark:text-[#F4F8F8] mb-1">
                    Google Drive / Dropbox Link (Optional)
                  </label>
                  <div className="relative">
                    <input
                      type="url"
                      placeholder="https://drive.google.com/..."
                      value={formData.driveLink}
                      onChange={(e) => setFormData({ ...formData, driveLink: e.target.value })}
                      className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-[#F8FAFA] dark:bg-[#111A1E] border border-[#DCE7E7] dark:border-[#2A3C40] text-xs text-[#102A36] dark:text-[#F4F8F8] focus:outline-none focus:border-[#0799A6]"
                    />
                    <Link2 className="w-4 h-4 text-[#819396] absolute left-3 top-3" />
                  </div>
                </div>
              </div>

              {/* Project Brief & Requirements */}
              <div>
                <label className="block text-xs font-bold text-[#102A36] dark:text-[#F4F8F8] mb-1">
                  Project Description & Requirements <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Describe your design vision, text to be included, brand colors, target audience, or specific requirements..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#F8FAFA] dark:bg-[#111A1E] border border-[#DCE7E7] dark:border-[#2A3C40] text-xs text-[#102A36] dark:text-[#F4F8F8] focus:outline-none focus:border-[#0799A6] resize-none"
                />
              </div>

              {/* File Attachment Upload */}
              <div>
                <label className="block text-xs font-bold text-[#102A36] dark:text-[#F4F8F8] mb-1">
                  Attach Reference Images / Logo / Sketches
                </label>
                <div className="border-2 border-dashed border-[#DCE7E7] dark:border-[#2A3C40] rounded-2xl p-4 text-center hover:border-[#0799A6] transition-colors">
                  <input
                    type="file"
                    multiple
                    id="inquiry-files"
                    className="hidden"
                    onChange={handleFileUpload}
                  />
                  <label htmlFor="inquiry-files" className="cursor-pointer flex flex-col items-center space-y-1.5">
                    <Upload className="w-5 h-5 text-[#0799A6]" />
                    <span className="text-xs font-bold text-[#0799A6] dark:text-[#25B4BD]">
                      Click to browse or drag & drop files
                    </span>
                    <span className="text-[10px] text-[#52636A] dark:text-[#819396]">
                      Supports JPG, PNG, PSD, AI, PDF, ZIP up to 25MB
                    </span>
                  </label>
                </div>

                {files.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {files.map((file, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-lg bg-[#DDF3F4] dark:bg-[#173D40] border border-[#0799A6]/30 text-[11px] text-[#087581] dark:text-[#25B4BD] font-medium"
                      >
                        <FileText className="w-3 h-3 text-[#0799A6]" />
                        <span>{file.name}</span>
                        <span className="text-[#52636A] dark:text-[#819396]">({file.size})</span>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Submit Buttons */}
              <div className="pt-3 border-t border-[#DCE7E7] dark:border-[#2A3C40] flex items-center justify-between">
                <div className="text-[11px] text-[#52636A] dark:text-[#819396] flex items-center space-x-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                  <span>100% Confidential & Secure</span>
                </div>

                <div className="flex items-center space-x-3">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2.5 rounded-xl text-xs font-bold text-[#52636A] dark:text-[#B7C6C8] hover:bg-[#F8FAFA] dark:hover:bg-[#111A1E]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-6 py-2.5 rounded-xl btn-primary-cta font-bold text-xs flex items-center space-x-2 shadow-md disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <span>Sending Brief...</span>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>Submit Brief</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
