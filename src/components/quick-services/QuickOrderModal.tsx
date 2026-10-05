import React, { useState } from 'react';
import {
  X,
  Upload,
  Check,
  Zap,
  Clock,
  ArrowRight,
  ArrowLeft,
  FileCheck,
  Sparkles,
  ShieldCheck,
  AlertCircle,
  Download,
  Copy,
  Plus,
  Minus,
  CheckCircle2,
  RefreshCw,
  ExternalLink,
} from 'lucide-react';
import { QuickDigitalService, QuickFixOrder } from '../../types';
import { QuickServiceIcon } from './QuickServiceIcon';

interface QuickOrderModalProps {
  service: QuickDigitalService | null;
  isOpen: boolean;
  onClose: () => void;
  onOrderSuccess?: (order: QuickFixOrder) => void;
}

export const QuickOrderModal: React.FC<QuickOrderModalProps> = ({
  service,
  isOpen,
  onClose,
  onOrderSuccess,
}) => {
  if (!isOpen || !service) return null;

  const [step, setStep] = useState<number>(1);
  const [file, setFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [selectedRequirement, setSelectedRequirement] = useState<string>(
    service.commonProblems[0] || 'Standard Fix'
  );
  const [customRequirement, setCustomRequirement] = useState<string>('');
  const [additionalInstructions, setAdditionalInstructions] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);
  const [rushDelivery, setRushDelivery] = useState<boolean>(false);

  // Customer Contact Info
  const [customerName, setCustomerName] = useState<string>('');
  const [customerEmail, setCustomerEmail] = useState<string>('');
  const [customerPhone, setCustomerPhone] = useState<string>('');

  // Processing & Confirmation State
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [confirmedOrder, setConfirmedOrder] = useState<QuickFixOrder | null>(null);
  const [copiedOrderId, setCopiedOrderId] = useState<boolean>(false);

  // Quick suggestion tags for instructions
  const quickTags = [
    'Keep maximum resolution',
    'Pure White #FFFFFF Background',
    'Transparent PNG',
    'Remove all shadows',
    'Under 500KB for website',
    'Exact 1:1 Square',
    'Amazon 255 Compliance',
  ];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      if (selectedFile.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = () => {
          setFilePreview(reader.result as string);
        };
        reader.readAsDataURL(selectedFile);
      } else {
        setFilePreview(null);
      }
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      setFile(droppedFile);
      if (droppedFile.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = () => {
          setFilePreview(reader.result as string);
        };
        reader.readAsDataURL(droppedFile);
      } else {
        setFilePreview(null);
      }
    }
  };

  const basePrice = service.price * quantity;
  const rushFee = rushDelivery ? 49 * quantity : 0;
  const totalPrice = basePrice + rushFee;

  const handleNext = () => {
    if (step === 1 && !file && !filePreview) {
      alert('Please upload a file or photo to proceed.');
      return;
    }
    if (step < 5) {
      setStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep((prev) => prev - 1);
    }
  };

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || !customerEmail.trim()) {
      alert('Please enter your name and email address.');
      return;
    }

    setIsSubmitting(true);
    try {
      const orderPayload = {
        serviceId: service.id,
        serviceName: service.name,
        serviceCategory: service.category,
        customerName,
        customerEmail,
        customerPhone,
        uploadedFileName: file ? file.name : `${service.name.toLowerCase().replace(/\s+/g, '_')}_sample.jpg`,
        uploadedFileUrl:
          filePreview ||
          'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80',
        uploadedFileSize: file ? `${(file.size / (1024 * 1024)).toFixed(1)} MB` : '1.4 MB',
        uploadedFileType: file ? file.type : 'image/jpeg',
        selectedRequirement: customRequirement.trim() || selectedRequirement,
        additionalInstructions,
        quantity,
        unitPrice: service.price,
        rushDelivery,
        totalPrice,
        estimatedDelivery: rushDelivery ? '1-2 Hours Express' : service.deliveryTime,
      };

      const res = await fetch('/api/quick-fix-orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload),
      });

      const data = await res.json();
      if (data.success && data.order) {
        setConfirmedOrder(data.order);
        setStep(5);
        if (onOrderSuccess) onOrderSuccess(data.order);
      } else {
        throw new Error(data.error || 'Failed to create order');
      }
    } catch (err: any) {
      alert(err.message || 'Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const copyOrderId = () => {
    if (confirmedOrder) {
      navigator.clipboard.writeText(confirmedOrder.id);
      setCopiedOrderId(true);
      setTimeout(() => setCopiedOrderId(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
      <div className="relative w-full max-w-2xl bg-[#15171D] rounded-2xl border border-[#222632] shadow-2xl overflow-hidden transition-all my-6 text-white">
        
        {/* Modal Top Bar */}
        <div className="px-6 py-4 bg-[#101217] border-b border-[#222632] flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-[#15171D] text-amber-400 border border-[#222632] flex items-center justify-center shadow-sm">
              <QuickServiceIcon name={service.iconName} className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider bg-[#15171D] text-slate-300 border border-[#222632]">
                  {service.category}
                </span>
                <span className="text-[11px] font-bold text-amber-400 flex items-center space-x-1">
                  <Clock className="w-3 h-3" />
                  <span>{service.deliveryTime}</span>
                </span>
              </div>
              <h3 className="text-base font-bold text-white leading-tight mt-0.5">
                {service.name}
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-[#1C2029] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress Step Bar (Steps 1 - 4) */}
        {step < 5 && (
          <div className="px-6 pt-4 pb-2 bg-[#101217] border-b border-[#222632]">
            <div className="flex items-center justify-between text-xs font-bold text-slate-400 mb-2">
              <span className={step >= 1 ? 'text-amber-400' : ''}>1. Upload</span>
              <span className={step >= 2 ? 'text-amber-400' : ''}>2. Problem</span>
              <span className={step >= 3 ? 'text-amber-400' : ''}>3. Notes</span>
              <span className={step >= 4 ? 'text-amber-400' : ''}>4. Price & Order</span>
            </div>
            <div className="w-full bg-[#222632] h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-amber-500 h-full rounded-full transition-all duration-300"
                style={{ width: `${(step / 4) * 100}%` }}
              />
            </div>
          </div>
        )}

        {/* Modal Body */}
        <div className="p-6 sm:p-8 max-h-[75vh] overflow-y-auto">
          
          {/* STEP 1: UPLOAD FILE */}
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <h4 className="text-lg font-bold text-white">
                  Step 1: Upload Your Image or File
                </h4>
                <p className="text-xs text-slate-400 mt-1">
                  Upload the photo or graphic that needs fixing. We support JPG, PNG, WEBP, PDF, and PSD.
                </p>
              </div>

              {/* Upload Dropzone */}
              <div
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
                className="border-2 border-dashed border-[#222632] hover:border-amber-500/60 rounded-2xl p-6 sm:p-8 text-center transition-all bg-[#101217] cursor-pointer group"
                onClick={() => document.getElementById('quick-fix-file-input')?.click()}
              >
                <input
                  id="quick-fix-file-input"
                  type="file"
                  onChange={handleFileChange}
                  accept="image/*,.pdf,.psd,.ai"
                  className="hidden"
                />

                {filePreview ? (
                  <div className="space-y-4">
                    <div className="relative inline-block mx-auto rounded-xl overflow-hidden shadow-lg border border-[#222632] max-h-48 max-w-xs bg-[#08090D]">
                      <img
                        src={filePreview}
                        alt="Uploaded preview"
                        className="w-full h-auto object-contain max-h-48"
                      />
                      <div className="absolute inset-0 bg-[#08090D]/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-bold">
                        Click to change photo
                      </div>
                    </div>
                    <div className="text-xs text-slate-300 font-bold flex items-center justify-center space-x-2">
                      <FileCheck className="w-4 h-4 text-amber-400" />
                      <span>{file?.name || 'Uploaded File'}</span>
                      <span className="text-slate-400 text-[11px]">
                        ({file ? `${(file.size / 1024).toFixed(0)} KB` : 'Ready'})
                      </span>
                    </div>
                  </div>
                ) : file ? (
                  <div className="space-y-3">
                    <FileCheck className="w-12 h-12 text-amber-400 mx-auto" />
                    <p className="text-sm font-bold text-white">{file.name}</p>
                    <p className="text-xs text-slate-400">{(file.size / 1024).toFixed(0)} KB • Ready for fix</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="w-16 h-16 rounded-2xl bg-[#15171D] text-amber-400 border border-[#222632] flex items-center justify-center mx-auto group-hover:scale-105 transition-transform">
                      <Upload className="w-7 h-7" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-white">
                        Drag & Drop your file here, or <span className="text-amber-400 underline">Browse</span>
                      </p>
                      <p className="text-[11px] text-slate-400 mt-1">
                        High resolution recommended • Up to 25MB
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Sample demo loader if user wants to test quickly */}
              {!filePreview && (
                <div className="text-center">
                  <button
                    type="button"
                    onClick={() => {
                      setFilePreview('https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80');
                    }}
                    className="text-xs text-amber-400 font-bold hover:underline inline-flex items-center space-x-1"
                  >
                    <span>Use sample product photo to test flow</span>
                  </button>
                </div>
              )}
            </div>
          )}

          {/* STEP 2: SELECT REQUIREMENT */}
          {step === 2 && (
            <div className="space-y-6">
              <div>
                <h4 className="text-lg font-bold text-white">
                  Step 2: Select the Exact Problem to Fix
                </h4>
                <p className="text-xs text-slate-400 mt-1">
                  Choose the primary correction you need for <strong>{service.name}</strong>.
                </p>
              </div>

              <div className="space-y-2.5">
                {service.commonProblems.map((prob, idx) => {
                  const isSelected = selectedRequirement === prob && !customRequirement;
                  return (
                    <div
                      key={idx}
                      onClick={() => {
                        setSelectedRequirement(prob);
                        setCustomRequirement('');
                      }}
                      className={`p-4 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                        isSelected
                          ? 'bg-[#1C2029] border-amber-500 shadow-sm text-white'
                          : 'bg-[#101217] border-[#222632] hover:border-amber-500/40 text-slate-300'
                      }`}
                    >
                      <span className="text-xs font-bold">{prob}</span>
                      <div
                        className={`w-5 h-5 rounded-full flex items-center justify-center border transition-all ${
                          isSelected
                            ? 'bg-amber-500 border-amber-500 text-slate-950'
                            : 'border-slate-600'
                        }`}
                      >
                        {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Custom Problem Input */}
              <div className="pt-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                  Or specify your custom requirement:
                </label>
                <input
                  type="text"
                  placeholder="e.g. Remove red reflections and make edges feather 1px"
                  value={customRequirement}
                  onChange={(e) => setCustomRequirement(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#101217] border border-[#222632] text-xs text-white focus:outline-none focus:border-amber-500/60"
                />
              </div>
            </div>
          )}

          {/* STEP 3: ADDITIONAL INSTRUCTIONS */}
          {step === 3 && (
            <div className="space-y-6">
              <div>
                <h4 className="text-lg font-bold text-white">
                  Step 3: Additional Instructions (Optional)
                </h4>
                <p className="text-xs text-slate-400 mt-1">
                  Tell our senior retouchers any specific guidelines, target dimensions, or color preferences.
                </p>
              </div>

              {/* Quick suggestion pills */}
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Quick Requirement Tags:
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {quickTags.map((tag) => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => {
                        setAdditionalInstructions((prev) => (prev ? `${prev}, ${tag}` : tag));
                      }}
                      className="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-[#101217] text-slate-300 border border-[#222632] hover:bg-[#1C2029] hover:text-amber-400 transition-colors"
                    >
                      + {tag}
                    </button>
                  ))}
                </div>
              </div>

              {/* Textarea */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Special Notes for Annu Dhaneja:
                </label>
                <textarea
                  rows={4}
                  placeholder="Tell us what you want us to fix in detail (e.g. Leave the shadow under the shoe, crop to 2000x2000 for Amazon listing, enhance the saturation slightly)..."
                  value={additionalInstructions}
                  onChange={(e) => setAdditionalInstructions(e.target.value)}
                  className="w-full p-4 rounded-xl bg-[#101217] border border-[#222632] text-xs text-white focus:outline-none focus:border-amber-500/60"
                />
              </div>

              {/* Quantity Stepper & Rush Delivery */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-[#222632]">
                <div className="p-3.5 rounded-xl bg-[#101217] border border-[#222632] flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-white block">Quantity</span>
                    <span className="text-[10px] text-slate-400">Number of images to fix</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      type="button"
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      className="w-8 h-8 rounded-lg bg-[#15171D] border border-[#222632] flex items-center justify-center font-bold text-slate-300 hover:text-amber-400 transition-colors"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="font-bold text-sm text-white w-6 text-center">
                      {quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => setQuantity((q) => q + 1)}
                      className="w-8 h-8 rounded-lg bg-[#15171D] border border-[#222632] flex items-center justify-center font-bold text-slate-300 hover:text-amber-400 transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div
                  onClick={() => setRushDelivery(!rushDelivery)}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                    rushDelivery
                      ? 'bg-[#1C2029] border-amber-500 text-amber-400'
                      : 'bg-[#101217] border-[#222632] text-slate-400'
                  }`}
                >
                  <div className="flex items-center space-x-2.5">
                    <Zap className={`w-5 h-5 ${rushDelivery ? 'text-amber-400' : 'text-slate-400'}`} />
                    <div>
                      <span className="text-xs font-bold block text-white">1-Hour Express Fix</span>
                      <span className="text-[10px] text-slate-400">+₹49 / image</span>
                    </div>
                  </div>
                  <div
                    className={`w-5 h-5 rounded-md border flex items-center justify-center ${
                      rushDelivery ? 'bg-amber-500 border-amber-500 text-slate-950' : 'border-slate-600'
                    }`}
                  >
                    {rushDelivery && <Check className="w-3 h-3 stroke-[3]" />}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: PREVIEW, CONTACT INFO & PRICE SUMMARY */}
          {step === 4 && (
            <form onSubmit={handleSubmitOrder} className="space-y-6">
              <div>
                <h4 className="text-lg font-bold text-white">
                  Step 4: Review & Place Quick Fix Order
                </h4>
                <p className="text-xs text-slate-400 mt-1">
                  Confirm your details below. Once placed, your file enters our high-priority designer queue.
                </p>
              </div>

              {/* Order Summary Card */}
              <div className="p-5 rounded-xl bg-[#101217] border border-[#222632] space-y-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center space-x-3">
                    {filePreview ? (
                      <img
                        src={filePreview}
                        alt="Preview"
                        className="w-14 h-14 object-cover rounded-xl border border-[#222632] shadow-sm bg-[#08090D]"
                      />
                    ) : (
                      <div className="w-14 h-14 rounded-xl bg-[#15171D] border border-[#222632] text-amber-400 flex items-center justify-center">
                        <QuickServiceIcon name={service.iconName} className="w-6 h-6" />
                      </div>
                    )}
                    <div>
                      <span className="text-[10px] font-bold uppercase text-amber-400">
                        {service.category}
                      </span>
                      <h5 className="text-sm font-bold text-white">{service.name}</h5>
                      <p className="text-xs text-slate-400 line-clamp-1">
                        🎯 {customRequirement || selectedRequirement}
                      </p>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-xs font-bold text-slate-400 block">Total Price</span>
                    <span className="text-xl font-black text-amber-400">₹{totalPrice}</span>
                  </div>
                </div>

                <div className="text-xs text-slate-400 grid grid-cols-2 gap-2 pt-3 border-t border-[#222632]">
                  <div>
                    <span className="text-slate-400 block text-[10px]">Quantity:</span>
                    <strong className="text-white">{quantity} file(s)</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Delivery Speed:</span>
                    <strong className="text-amber-400 flex items-center space-x-1">
                      <Clock className="w-3 h-3" />
                      <span>{rushDelivery ? '1-2 Hours Express' : service.deliveryTime}</span>
                    </strong>
                  </div>
                </div>

                {additionalInstructions && (
                  <div className="pt-2 text-[11px] text-slate-300 bg-[#15171D] p-2.5 rounded-lg border border-[#222632]">
                    <span className="font-bold text-slate-400 block">Your Notes:</span>
                    <p className="italic">{additionalInstructions}</p>
                  </div>
                )}
              </div>

              {/* Customer Contact Fields */}
              <div className="space-y-3">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                  Delivery Contact Details:
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <input
                      type="text"
                      required
                      placeholder="Your Full Name *"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-[#101217] border border-[#222632] text-xs text-white focus:outline-none focus:border-amber-500/60"
                    />
                  </div>
                  <div>
                    <input
                      type="email"
                      required
                      placeholder="Your Email (For download link) *"
                      value={customerEmail}
                      onChange={(e) => setCustomerEmail(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-[#101217] border border-[#222632] text-xs text-white focus:outline-none focus:border-amber-500/60"
                    />
                  </div>
                </div>
                <div>
                  <input
                    type="tel"
                    placeholder="WhatsApp Phone Number (Optional, for instant notification)"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#101217] border border-[#222632] text-xs text-white focus:outline-none focus:border-amber-500/60"
                  />
                </div>
              </div>

              {/* Quality & Satisfaction Guarantee Note */}
              <div className="flex items-center space-x-2 text-xs text-slate-300 p-3 rounded-xl bg-[#101217] border border-[#222632]">
                <ShieldCheck className="w-5 h-5 text-amber-400 shrink-0" />
                <span>
                  <strong className="text-white">100% Satisfaction Guarantee:</strong> Unlimited revisions until you're completely satisfied, or full refund.
                </span>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm tracking-wide shadow-md transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Processing Your Order...</span>
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4 text-slate-950 fill-slate-950" />
                    <span>Place Quick Fix Order — ₹{totalPrice}</span>
                  </>
                )}
              </button>
            </form>
          )}

          {/* STEP 5: ORDER CONFIRMATION & TRACKING */}
          {step === 5 && confirmedOrder && (
            <div className="text-center space-y-6 py-4">
              <div className="w-16 h-16 rounded-full bg-[#101217] text-amber-400 border border-[#222632] flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div>
                <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#101217] text-amber-400 border border-[#222632]">
                  Order Successfully Placed
                </span>
                <h4 className="text-2xl font-black text-white mt-2">
                  Thank You, {confirmedOrder.customerName}!
                </h4>
                <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
                  Our professional retouching team led by Annu Dhaneja has received your image file and is processing your correction.
                </p>
              </div>

              {/* Order Tracking Card */}
              <div className="p-6 rounded-2xl bg-[#101217] border border-[#222632] text-left space-y-4 max-w-lg mx-auto">
                <div className="flex items-center justify-between pb-3 border-b border-[#222632]">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Order Reference</span>
                    <div className="flex items-center space-x-2">
                      <span className="text-base font-bold text-amber-400">
                        {confirmedOrder.id}
                      </span>
                      <button
                        type="button"
                        onClick={copyOrderId}
                        className="text-xs text-slate-400 hover:text-white p-1 rounded-md bg-[#15171D] border border-[#222632]"
                        title="Copy Order ID"
                      >
                        {copiedOrderId ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      </button>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Status</span>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-[#15171D] text-amber-400 border border-[#222632] block mt-0.5">
                      {confirmedOrder.status}
                    </span>
                  </div>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Service:</span>
                    <span className="font-bold text-white">{confirmedOrder.serviceName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Requirement:</span>
                    <span className="text-slate-300 text-right">{confirmedOrder.selectedRequirement}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Expected Delivery:</span>
                    <span className="font-bold text-amber-400">{confirmedOrder.estimatedDelivery}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Total Paid:</span>
                    <span className="font-bold text-amber-400">₹{confirmedOrder.totalPrice}</span>
                  </div>
                </div>

                <div className="pt-3 border-t border-[#222632] text-[11px] text-slate-400">
                  📧 A confirmation email with the tracking link has been sent to <strong className="text-white">{confirmedOrder.customerEmail}</strong>. You can also view live status in your Customer Dashboard.
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="w-full sm:w-auto px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-all"
                >
                  Done & Close Window
                </button>
                <a
                  href="#/dashboard"
                  onClick={onClose}
                  className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#101217] border border-[#222632] hover:bg-[#1C2029] text-white font-bold text-xs transition-all flex items-center justify-center space-x-1.5"
                >
                  <span>Track in Customer Dashboard</span>
                  <ExternalLink className="w-3.5 h-3.5 text-amber-400" />
                </a>
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer Navigation (Steps 1 - 4) */}
        {step < 5 && (
          <div className="px-6 py-4 bg-[#101217] border-t border-[#222632] flex items-center justify-between">
            {step > 1 ? (
              <button
                type="button"
                onClick={handleBack}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-400 hover:text-white hover:bg-[#1C2029] flex items-center space-x-1.5 transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back</span>
              </button>
            ) : (
              <div />
            )}

            {step < 4 ? (
              <button
                type="button"
                onClick={handleNext}
                className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold flex items-center space-x-1.5 transition-all shadow-sm"
              >
                <span>Continue</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : null}
          </div>
        )}

      </div>
    </div>
  );
};
