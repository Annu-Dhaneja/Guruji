import React, { useState } from 'react';
import { X, Upload, CheckCircle2, AlertCircle, Send, FileText, Lock, Sparkles, Layers, Image as ImageIcon } from 'lucide-react';
import { VantageService } from '../../types';

interface ServiceInquiryModalProps {
  service: VantageService | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ServiceInquiryModal: React.FC<ServiceInquiryModalProps> = ({ service, isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    quantity: 5,
    platform: 'Amazon',
    deadline: '24 Hours',
    description: '',
    specialRequirements: '',
  });

  const [customFields, setCustomFields] = useState<Record<string, string>>({
    clothingType: 'Dresses / Kurtis',
    backgroundPreference: 'Pure White (RGB 255)',
    shadowType: 'Natural Drop Shadow',
  });

  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [uploadedFileUrls, setUploadedFileUrls] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen || !service) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const files: File[] = Array.from(e.target.files);
    
    // File security validation
    const validFiles: File[] = [];
    const validUrls: string[] = [];

    files.forEach((file: File) => {
      // Limit size: 15MB
      if (file.size > 15 * 1024 * 1024) {
        setError(`File ${file.name} exceeds 15MB size limit.`);
        return;
      }
      // Check allowed image/pdf formats
      const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/tiff', 'application/pdf', 'application/zip'];
      if (!allowedTypes.includes(file.type)) {
        setError(`File ${file.name} is not an allowed format (JPG, PNG, WEBP, PDF, ZIP).`);
        return;
      }

      validFiles.push(file);
      validUrls.push(URL.createObjectURL(file));
    });

    setUploadedFiles((prev) => [...prev, ...validFiles]);
    setUploadedFileUrls((prev) => [...prev, ...validUrls]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.customerName || !formData.customerEmail || !formData.customerPhone) {
      setError('Please provide your name, email, and mobile phone number.');
      return;
    }

    setSubmitting(true);

    try {
      const payload = {
        serviceId: service.id,
        serviceTitle: service.title,
        serviceCategory: service.category,
        customerName: formData.customerName,
        customerEmail: formData.customerEmail,
        customerPhone: formData.customerPhone,
        quantity: formData.quantity,
        platform: formData.platform,
        deadline: formData.deadline,
        description: formData.description,
        specialRequirements: formData.specialRequirements,
        uploadedFiles: uploadedFiles.map((f) => f.name),
        customFieldsData: customFields,
      };

      const res = await fetch('/api/vantageecom/inquire', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setSuccess(true);
      } else {
        const data = await res.json();
        setError(data.error || 'Failed to submit inquiry. Please try again.');
      }
    } catch (err: any) {
      setError('Connection error. Please check network.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden my-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 p-6 border-b border-slate-800 flex justify-between items-start">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-teal-400 uppercase tracking-widest">{service.categoryName}</span>
              <h3 className="text-lg font-black text-white">{service.title}</h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        {success ? (
          <div className="p-8 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h4 className="text-xl font-black text-white">Inquiry Received!</h4>
            <p className="text-sm text-slate-300 max-w-md mx-auto">
              Thank you, <span className="font-bold text-white">{formData.customerName}</span>. Our VantageEcom lead editor is reviewing your specifications and uploaded samples. You will receive a custom quote within 1-2 hours.
            </p>
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-slate-400 text-left space-y-1">
              <p><span className="text-slate-200 font-bold">Service:</span> {service.title}</p>
              <p><span className="text-slate-200 font-bold">Estimated Turnaround:</span> {formData.deadline}</p>
              <p><span className="text-slate-200 font-bold">Files Uploaded:</span> {uploadedFiles.length} item(s)</p>
            </div>
            <button
              onClick={onClose}
              className="mt-4 px-6 py-3 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-sm"
            >
              Close & Return to Catalog
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {error && (
              <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Contact Details */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-teal-400 uppercase tracking-wider flex items-center space-x-1">
                <span>1. Contact & Business Information</span>
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 mb-1">Your Full Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.customerName}
                    onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:border-teal-500 focus:outline-none"
                    placeholder="e.g. Rahul Sharma"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={formData.customerEmail}
                    onChange={(e) => setFormData({ ...formData, customerEmail: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:border-teal-500 focus:outline-none"
                    placeholder="rahul@brand.com"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 mb-1">Mobile / WhatsApp *</label>
                  <input
                    type="tel"
                    required
                    value={formData.customerPhone}
                    onChange={(e) => setFormData({ ...formData, customerPhone: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:border-teal-500 focus:outline-none"
                    placeholder="+91 98765 43210"
                  />
                </div>
              </div>
            </div>

            {/* Service Options */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-teal-400 uppercase tracking-wider">
                2. Project Parameters
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 mb-1">Quantity (Items / Photos)</label>
                  <input
                    type="number"
                    min="1"
                    value={formData.quantity}
                    onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) || 1 })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:border-teal-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 mb-1">Target Platform</label>
                  <select
                    value={formData.platform}
                    onChange={(e) => setFormData({ ...formData, platform: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:border-teal-500 focus:outline-none"
                  >
                    <option value="Amazon">Amazon India / Global</option>
                    <option value="Flipkart">Flipkart</option>
                    <option value="Etsy">Etsy Handmade</option>
                    <option value="Shopify / Custom Website">Shopify / Website</option>
                    <option value="Myntra / AJIO">Myntra / AJIO</option>
                    <option value="Social Media Ads">Social Media Ads</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 mb-1">Required Turnaround</label>
                  <select
                    value={formData.deadline}
                    onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:border-teal-500 focus:outline-none"
                  >
                    <option value="12 Hours (Express Priority)">12 Hours (Express)</option>
                    <option value="24 Hours (Standard)">24 Hours (Standard)</option>
                    <option value="48 Hours">48 Hours</option>
                    <option value="3-5 Days (Flexible)">3-5 Days</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Dynamic Custom Fields Based on Service */}
            {service.slug === 'ghost-mannequin-editing' && (
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                <span className="text-[11px] font-bold text-purple-400 uppercase">Ghost Mannequin Specifications</span>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] text-slate-400 mb-1">Garment Type</label>
                    <input
                      type="text"
                      value={customFields.clothingType || ''}
                      onChange={(e) => setCustomFields({ ...customFields, clothingType: e.target.value })}
                      placeholder="e.g. Kurtas, Blazers, Shirts"
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-slate-400 mb-1">Background Choice</label>
                    <select
                      value={customFields.backgroundPreference || ''}
                      onChange={(e) => setCustomFields({ ...customFields, backgroundPreference: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white"
                    >
                      <option value="Pure White (RGB 255)">Pure White (RGB 255)</option>
                      <option value="Transparent PNG">Transparent PNG</option>
                      <option value="Light Gray Studio (RGB 245)">Light Gray Studio (RGB 245)</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* File Upload Section */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-teal-400 uppercase tracking-wider">
                3. Sample Photo Uploads (Optional)
              </label>
              <div className="border-2 border-dashed border-slate-800 hover:border-teal-500/50 rounded-2xl p-4 text-center bg-slate-950/50 transition-colors">
                <input
                  type="file"
                  multiple
                  accept="image/jpeg,image/png,image/webp,application/pdf,application/zip"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="vantage-file-upload"
                />
                <label htmlFor="vantage-file-upload" className="cursor-pointer space-y-1 block">
                  <Upload className="w-6 h-6 text-teal-400 mx-auto" />
                  <p className="text-xs font-bold text-white">Click or drag photos to attach</p>
                  <p className="text-[10px] text-slate-500">JPG, PNG, WEBP, PDF, ZIP (Max 15MB per file)</p>
                </label>
              </div>

              {uploadedFiles.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-2">
                  {uploadedFiles.map((f, idx) => (
                    <div key={idx} className="px-3 py-1.5 rounded-xl bg-slate-800 border border-slate-700 text-[11px] text-slate-200 flex items-center space-x-2">
                      <ImageIcon className="w-3.5 h-3.5 text-teal-400" />
                      <span className="truncate max-w-[150px]">{f.name}</span>
                      <span className="text-[9px] text-slate-400">({(f.size / 1024).toFixed(0)} KB)</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Instructions */}
            <div>
              <label className="block text-xs font-bold text-slate-400 mb-1">Additional Project Brief & Instructions</label>
              <textarea
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Mention specific instructions like brand guidelines, shadows, color codes..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white focus:border-teal-500 focus:outline-none"
              />
            </div>

            {/* Footer / Submit */}
            <div className="pt-2 flex flex-col sm:flex-row justify-between items-center gap-4 border-t border-slate-800">
              <div className="flex items-center space-x-2 text-[10px] text-slate-400">
                <Lock className="w-3.5 h-3.5 text-emerald-400" />
                <span>Encrypted file transfer & strict NDA protection.</span>
              </div>

              <div className="flex space-x-3 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 sm:flex-none px-6 py-2.5 rounded-xl bg-gradient-to-r from-teal-500 to-purple-600 hover:from-teal-400 hover:to-purple-500 text-slate-950 font-black text-xs shadow-lg shadow-teal-900/30 flex items-center justify-center space-x-2"
                >
                  <Send className="w-4 h-4" />
                  <span>{submitting ? 'Submitting Brief...' : 'Submit Inquiry & Get Quote'}</span>
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
