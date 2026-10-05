import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  Send,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Star,
  Upload,
  FileText,
  Trash2,
  MessageSquare,
  AlertCircle,
  HelpCircle,
  Zap,
  ShoppingBag,
  ExternalLink,
  ChevronRight,
  Layers,
  Sparkles,
  Phone,
  Mail,
  User,
  Building,
  Tag,
} from 'lucide-react';
import { VantageService, VantagePackage } from '../types';

interface VantageInquiryPageProps {
  initialService?: VantageService | null;
  onBack: () => void;
  onNavigateToCatalog?: () => void;
}

export const VantageInquiryPage: React.FC<VantageInquiryPageProps> = ({
  initialService,
  onBack,
  onNavigateToCatalog,
}) => {
  const [allServices, setAllServices] = useState<VantageService[]>([]);
  const [selectedService, setSelectedService] = useState<VantageService | null>(initialService || null);
  const [selectedPackage, setSelectedPackage] = useState<VantagePackage | null>(
    initialService?.packages && initialService.packages.length > 0 ? initialService.packages[0] : null
  );

  // Form State
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [brandName, setBrandName] = useState('');
  const [platform, setPlatform] = useState('Amazon');
  const [quantity, setQuantity] = useState<number>(5);
  const [deadline, setDeadline] = useState('Standard (24 Hours)');
  const [description, setDescription] = useState('');
  const [referenceLinks, setReferenceLinks] = useState('');
  const [specialInstructions, setSpecialInstructions] = useState('');

  // Dynamic service-specific fields state
  const [customFields, setCustomFields] = useState<Record<string, string>>({
    garmentType: 'T-Shirt / Tops',
    viewRequirement: 'Front & Back with 3D Neck Joint',
    backgroundType: 'Pure White (RGB 255,255,255 Amazon Compliant)',
    shadowType: 'Natural Soft Drop Shadow',
    resolutionRequirement: '2000 x 2000 px (300 DPI High-Res)',
    outputFormat: 'High-Res JPG + Transparent PNG + Layered PSD',
    colorwayCount: '3 Color Swatches',
    measurementUnit: 'Both Inches (in) and Centimeters (cm)',
    videoDuration: '30 Seconds Vertical Reel (9:16)',
  });

  // Files State
  const [uploadedFiles, setUploadedFiles] = useState<{ name: string; size: number; previewUrl?: string }[]>([]);
  const [uploadError, setUploadError] = useState('');

  // Submission Status
  const [submitting, setSubmitting] = useState(false);
  const [submittedInquiry, setSubmittedInquiry] = useState<any>(null);
  const [formError, setFormError] = useState('');

  // Fetch all services if not already populated
  useEffect(() => {
    fetch('/api/vantageecom/services')
      .then((res) => (res.ok ? res.json() : []))
      .then((data: VantageService[]) => {
        setAllServices(data);
        if (!selectedService && data.length > 0) {
          const defaultService = initialService || data[0];
          setSelectedService(defaultService);
          if (defaultService.packages && defaultService.packages.length > 0) {
            setSelectedPackage(defaultService.packages[0]);
          }
        }
      })
      .catch(console.error);
  }, []);

  // Update selected package when service changes
  const handleServiceChange = (serviceId: string) => {
    const srv = allServices.find((s) => s.id === serviceId);
    if (srv) {
      setSelectedService(srv);
      if (srv.packages && srv.packages.length > 0) {
        setSelectedPackage(srv.packages[0]);
      } else {
        setSelectedPackage(null);
      }
    }
  };

  const handleCustomFieldChange = (key: string, value: string) => {
    setCustomFields((prev) => ({ ...prev, [key]: value }));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const files: File[] = Array.from(e.target.files);
    setUploadError('');

    const newFiles: { name: string; size: number; previewUrl?: string }[] = [];

    for (const file of files) {
      if (file.size > 25 * 1024 * 1024) {
        setUploadError(`File "${file.name}" exceeds 25MB limit.`);
        return;
      }

      const isImage = file.type.startsWith('image/');
      const previewUrl = isImage ? URL.createObjectURL(file) : undefined;
      newFiles.push({
        name: file.name,
        size: file.size,
        previewUrl,
      });
    }

    setUploadedFiles((prev) => [...prev, ...newFiles]);
  };

  const handleRemoveFile = (index: number) => {
    setUploadedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  // Price Calculation
  const unitPrice = selectedPackage
    ? selectedPackage.price
    : selectedService?.salePrice || selectedService?.startingPrice || 499;
  const estimatedSubtotal = unitPrice * Math.max(1, quantity);
  const isExpress = deadline.includes('Urgent');
  const expressSurcharge = isExpress ? Math.round(estimatedSubtotal * 0.25) : 0;
  const estimatedTotal = estimatedSubtotal + expressSurcharge;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!customerName.trim() || !customerEmail.trim() || !customerPhone.trim()) {
      setFormError('Please fill in your Name, Email, and Phone number.');
      return;
    }

    if (!selectedService) {
      setFormError('Please select a VantageEcom service.');
      return;
    }

    setSubmitting(true);

    try {
      const payload = {
        serviceId: selectedService.id,
        serviceTitle: selectedService.title,
        customerName: customerName.trim(),
        customerEmail: customerEmail.trim(),
        customerPhone: customerPhone.trim(),
        brandName: brandName.trim(),
        platform,
        quantity,
        deadline,
        packageId: selectedPackage?.id || 'standard',
        packageName: selectedPackage?.name || 'Standard Production',
        packagePrice: unitPrice,
        estimatedTotal,
        description: description.trim(),
        referenceLinks: referenceLinks.trim(),
        specialInstructions: specialInstructions.trim(),
        customFieldsData: customFields,
        uploadedFiles: uploadedFiles.map((f) => f.name),
      };

      const res = await fetch('/api/vantageecom/inquire', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        const data = await res.json();
        setSubmittedInquiry({
          ...payload,
          id: data.inquiry?.id || `INQ-${Math.floor(100000 + Math.random() * 900000)}`,
          createdAt: new Date().toLocaleDateString('en-IN', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          }),
        });
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        const err = await res.json();
        setFormError(err.error || 'Failed to submit inquiry. Please try again.');
      }
    } catch (err) {
      console.error('Inquiry submission error:', err);
      setFormError('Network connection error. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  // SUCCESS CONFIRMATION VIEW
  if (submittedInquiry) {
    const prefilledWhatsApp = `Hello Annu Dhaneja / GurucraftPro Team,%0A%0AI have submitted an official VantageEcom Project Inquiry!%0A%0A*Inquiry ID:* ${submittedInquiry.id}%0A*Client Name:* ${submittedInquiry.customerName}%0A*Service:* ${submittedInquiry.serviceTitle}%0A*Package:* ${submittedInquiry.packageName}%0A*Quantity:* ${submittedInquiry.quantity} items%0A*Platform:* ${submittedInquiry.platform}%0A*Estimated Total:* ₹${submittedInquiry.estimatedTotal?.toLocaleString('en-IN')}%0A%0APlease review my project files and confirm execution schedule.`;

    return (
      <div className="max-w-4xl mx-auto px-4 py-12 space-y-8 animate-fadeIn">
        <div className="bg-slate-900 border border-teal-500/40 rounded-3xl p-8 sm:p-12 text-center space-y-6 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-teal-500 to-purple-600 text-slate-950 flex items-center justify-center mx-auto shadow-xl shadow-teal-900/40 animate-bounce">
            <CheckCircle2 className="w-9 h-9" />
          </div>

          <div className="space-y-2">
            <span className="px-3.5 py-1 rounded-full bg-teal-500/10 text-teal-400 text-xs font-black uppercase tracking-wider border border-teal-500/30">
              Project Brief Received & Logged in Database
            </span>
            <h1 className="text-2xl sm:text-4xl font-black text-white">
              Inquiry Successfully Submitted!
            </h1>
            <p className="text-sm text-slate-300 max-w-xl mx-auto">
              Your detailed service specifications have been recorded in our production system. Our lead retoucher will review your requirements and respond within 2-4 hours.
            </p>
          </div>

          {/* Reference ID Pill */}
          <div className="inline-flex items-center space-x-3 bg-slate-950 border border-slate-800 rounded-2xl px-6 py-3">
            <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Inquiry Reference ID:</span>
            <span className="text-base font-black text-teal-300 font-mono">{submittedInquiry.id}</span>
          </div>

          {/* Summary Details Grid */}
          <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-6 text-left space-y-4">
            <h3 className="text-xs font-bold text-teal-400 uppercase tracking-wider border-b border-slate-800 pb-2">
              Submission Summary
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs">
              <div>
                <span className="text-slate-500 block">Client Name</span>
                <strong className="text-white">{submittedInquiry.customerName}</strong>
              </div>
              <div>
                <span className="text-slate-500 block">Email Address</span>
                <strong className="text-white">{submittedInquiry.customerEmail}</strong>
              </div>
              <div>
                <span className="text-slate-500 block">Phone Number</span>
                <strong className="text-white">{submittedInquiry.customerPhone}</strong>
              </div>
              <div>
                <span className="text-slate-500 block">Target Service</span>
                <strong className="text-teal-300">{submittedInquiry.serviceTitle}</strong>
              </div>
              <div>
                <span className="text-slate-500 block">Selected Package</span>
                <strong className="text-purple-300">{submittedInquiry.packageName}</strong>
              </div>
              <div>
                <span className="text-slate-500 block">Quantity / SKUs</span>
                <strong className="text-white">{submittedInquiry.quantity} Units</strong>
              </div>
              <div>
                <span className="text-slate-500 block">Target Marketplace</span>
                <strong className="text-amber-300">{submittedInquiry.platform}</strong>
              </div>
              <div>
                <span className="text-slate-500 block">Turnaround SLA</span>
                <strong className="text-white">{submittedInquiry.deadline}</strong>
              </div>
              <div>
                <span className="text-slate-500 block">Estimated Quote</span>
                <strong className="text-emerald-400 font-black text-sm">
                  ₹{submittedInquiry.estimatedTotal?.toLocaleString('en-IN')}
                </strong>
              </div>
            </div>

            {submittedInquiry.uploadedFiles?.length > 0 && (
              <div className="pt-2 border-t border-slate-850">
                <span className="text-slate-500 block text-[11px] mb-1">Attached Project Assets ({submittedInquiry.uploadedFiles.length}):</span>
                <div className="flex flex-wrap gap-1.5">
                  {submittedInquiry.uploadedFiles.map((fname: string, i: number) => (
                    <span key={i} className="px-2.5 py-1 bg-slate-900 border border-slate-800 rounded-lg text-[10px] text-slate-300 font-mono">
                      📎 {fname}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 pt-4">
            <a
              href={`https://wa.me/918527837527?text=${prefilledWhatsApp}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-sm shadow-xl shadow-emerald-950/40 flex items-center justify-center space-x-2 transition-all transform hover:-translate-y-0.5"
            >
              <MessageSquare className="w-5 h-5" />
              <span>Instant WhatsApp Confirmation with Stylist</span>
            </a>

            <button
              onClick={() => {
                setSubmittedInquiry(null);
                if (onNavigateToCatalog) onNavigateToCatalog();
                else onBack();
              }}
              className="w-full sm:w-auto px-6 py-4 rounded-2xl bg-slate-950 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white font-bold text-xs flex items-center justify-center space-x-2 transition-all"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Explore More VantageEcom Services</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10 animate-fadeIn">
      {/* Top Header & Breadcrumb */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-800 pb-6">
        <div>
          <button
            onClick={onBack}
            className="inline-flex items-center space-x-2 text-xs font-bold text-slate-400 hover:text-teal-400 bg-slate-900 border border-slate-800 px-4 py-2 rounded-xl transition-all mb-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Services Catalog</span>
          </button>
          <h1 className="text-2xl sm:text-3xl font-black text-white">
            Official VantageEcom Service Inquiry & Project Brief
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Submit your product editing, ghost mannequin, white background, or size chart brief with custom questions and file uploads.
          </p>
        </div>

        <div className="flex items-center space-x-2 bg-teal-500/10 border border-teal-500/20 px-3.5 py-1.5 rounded-full text-xs font-bold text-teal-400">
          <ShieldCheck className="w-4 h-4" />
          <span>Zero External API • 100% Secure Local Submission</span>
        </div>
      </div>

      {formError && (
        <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs font-bold flex items-center space-x-3">
          <AlertCircle className="w-5 h-5 shrink-0 text-red-400" />
          <span>{formError}</span>
        </div>
      )}

      {/* Main Form Grid */}
      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Multi-Section Detailed Form */}
        <div className="lg:col-span-8 space-y-8">
          {/* Section 1: Service & Package Selection */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-xl bg-teal-500/10 text-teal-400 font-black text-xs flex items-center justify-center border border-teal-500/20">
                1
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Select Service & Production Tier</h3>
                <p className="text-xs text-slate-400">Choose the exact visual service required for your catalog</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  Target VantageEcom Service <span className="text-red-400">*</span>
                </label>
                <select
                  value={selectedService?.id || ''}
                  onChange={(e) => handleServiceChange(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-4 py-3 text-xs text-white focus:border-teal-500 focus:outline-none"
                >
                  {allServices.map((srv) => (
                    <option key={srv.id} value={srv.id}>
                      {srv.title} ({srv.categoryName})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  Target Marketplace / Platform <span className="text-red-400">*</span>
                </label>
                <select
                  value={platform}
                  onChange={(e) => setPlatform(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-4 py-3 text-xs text-white focus:border-teal-500 focus:outline-none"
                >
                  <option value="Amazon Main & Secondary (RGB 255)">Amazon Main & Secondary (RGB 255)</option>
                  <option value="Flipkart Product Listing">Flipkart Product Listing</option>
                  <option value="Shopify Direct Store">Shopify Direct Store</option>
                  <option value="Etsy Handmade & Craft">Etsy Handmade & Craft</option>
                  <option value="Blinkit / Zepto / Swiggy Instamart">Blinkit / Zepto / Swiggy Instamart</option>
                  <option value="Instagram / Social Commerce">Instagram / Social Commerce</option>
                </select>
              </div>
            </div>

            {/* Service Snapshot Card with Full Details */}
            {selectedService && (
              <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                  <img
                    src={selectedService.imageUrl}
                    alt={selectedService.title}
                    className="w-24 h-24 object-cover rounded-2xl border border-slate-800 shrink-0 bg-slate-900"
                  />
                  <div className="space-y-1.5 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-full bg-teal-500/10 text-teal-400 text-[10px] font-black uppercase tracking-wider border border-teal-500/30">
                        {selectedService.categoryName}
                      </span>
                      <span className="flex items-center space-x-1 px-2 py-0.5 rounded-full bg-amber-400/10 text-amber-300 text-[10px] font-bold border border-amber-400/20">
                        <Star className="w-3 h-3 fill-current" />
                        <span>{selectedService.rating || 5.0} Rating</span>
                      </span>
                      <span className="flex items-center space-x-1 text-[11px] text-slate-400 font-medium">
                        <Clock className="w-3.5 h-3.5 text-teal-400" />
                        <span>Standard SLA: {selectedService.deliveryTime}</span>
                      </span>
                    </div>
                    <h4 className="text-base font-black text-white">{selectedService.title}</h4>
                    <p className="text-xs text-slate-300 leading-relaxed">{selectedService.shortDescription}</p>
                  </div>
                </div>

                {/* Key Inclusions & Features of Selected Service */}
                {selectedService.features && selectedService.features.length > 0 && (
                  <div className="pt-3 border-t border-slate-850">
                    <span className="text-[11px] font-bold text-teal-400 uppercase tracking-wider block mb-2">
                      Included Specifications in this Service:
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-300">
                      {selectedService.features.map((feat, idx) => (
                        <div key={idx} className="flex items-center space-x-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-teal-400 shrink-0" />
                          <span>{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Package Level Cards */}
            {selectedService?.packages && selectedService.packages.length > 0 && (
              <div className="space-y-3 pt-2">
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Select Production Package Level
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {selectedService.packages.map((pkg) => {
                    const isSelected = selectedPackage?.id === pkg.id;
                    return (
                      <div
                        key={pkg.id}
                        onClick={() => setSelectedPackage(pkg)}
                        className={`p-4 rounded-2xl border cursor-pointer transition-all space-y-2 ${
                          isSelected
                            ? 'bg-gradient-to-br from-teal-500/15 to-purple-600/15 border-teal-400 text-white shadow-lg shadow-teal-900/20'
                            : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                        }`}
                      >
                        <div className="flex justify-between items-start">
                          <span className="text-xs font-bold text-white truncate">{pkg.name}</span>
                          {pkg.popular && (
                            <span className="px-2 py-0.5 rounded bg-teal-500 text-slate-950 text-[9px] font-black uppercase">
                              Popular
                            </span>
                          )}
                        </div>
                        <div className="text-base font-black text-teal-300">₹{pkg.price.toLocaleString('en-IN')}</div>
                        <div className="flex items-center space-x-1 text-[11px] text-slate-400">
                          <Clock className="w-3 h-3 text-teal-400" />
                          <span>{pkg.deliveryTime}</span>
                        </div>
                        <ul className="text-[10px] text-slate-400 space-y-1 pt-2 border-t border-slate-850">
                          {pkg.features.slice(0, 3).map((feat, i) => (
                            <li key={i} className="flex items-center space-x-1.5 truncate">
                              <CheckCircle2 className="w-3 h-3 text-teal-400 shrink-0" />
                              <span className="truncate">{feat}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Section 2: Client Contact Information */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-xl bg-purple-500/10 text-purple-400 font-black text-xs flex items-center justify-center border border-purple-500/20">
                2
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Client & Business Details</h3>
                <p className="text-xs text-slate-400">Where our project manager will send proofs and updates</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  Full Name / Contact Person <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="e.g. Ramesh Sharma"
                    className="w-full bg-slate-950 border border-slate-800 rounded-2xl pl-10 pr-4 py-3 text-xs text-white placeholder:text-slate-600 focus:border-teal-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  Email Address <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    placeholder="name@company.com"
                    className="w-full bg-slate-950 border border-slate-800 rounded-2xl pl-10 pr-4 py-3 text-xs text-white placeholder:text-slate-600 focus:border-teal-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  WhatsApp / Phone Number <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    required
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full bg-slate-950 border border-slate-800 rounded-2xl pl-10 pr-4 py-3 text-xs text-white placeholder:text-slate-600 focus:border-teal-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  Brand / Store / Company Name (Optional)
                </label>
                <div className="relative">
                  <Building className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={brandName}
                    onChange={(e) => setBrandName(e.target.value)}
                    placeholder="e.g. Aura Lifestyle Essentials"
                    className="w-full bg-slate-950 border border-slate-800 rounded-2xl pl-10 pr-4 py-3 text-xs text-white placeholder:text-slate-600 focus:border-teal-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Service-Specific Dynamic Questions */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-400 font-black text-xs flex items-center justify-center border border-amber-500/20">
                3
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Service Specifications & Technical Questions</h3>
                <p className="text-xs text-slate-400">Detailed parameters customized for this service</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Question: Apparel / Garment Type */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">Garment / Product Type</label>
                <select
                  value={customFields.garmentType}
                  onChange={(e) => handleCustomFieldChange('garmentType', e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-4 py-3 text-xs text-white focus:border-teal-500 focus:outline-none"
                >
                  <option value="T-Shirt / Tops / Polo">T-Shirt / Tops / Polo</option>
                  <option value="Shirt / Formal Collared Shirt">Shirt / Formal Collared Shirt</option>
                  <option value="Jacket / Hoodie / Blazer">Jacket / Hoodie / Blazer</option>
                  <option value="Dress / Gown / Kurti">Dress / Gown / Kurti</option>
                  <option value="Footwear / Shoes / Sandals">Footwear / Shoes / Sandals</option>
                  <option value="Jewelry / Watch / Metallic Accessory">Jewelry / Watch / Metallic Accessory</option>
                  <option value="Electronics / Gadgets">Electronics / Gadgets</option>
                  <option value="Packaged FMCG / Cosmetics">Packaged FMCG / Cosmetics</option>
                </select>
              </div>

              {/* Question: View / Ghost Mannequin Angle */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">Angle & 3D Stitch Requirement</label>
                <select
                  value={customFields.viewRequirement}
                  onChange={(e) => handleCustomFieldChange('viewRequirement', e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-4 py-3 text-xs text-white focus:border-teal-500 focus:outline-none"
                >
                  <option value="Front View + 3D Hollow Neck Joint">Front View + 3D Hollow Neck Joint</option>
                  <option value="Front & Back (Dual Angle Stitch)">Front & Back (Dual Angle Stitch)</option>
                  <option value="Full 360 Spin / 4-Angle Set">Full 360 Spin / 4-Angle Set</option>
                  <option value="Flat Lay with Wrinkle Removal">Flat Lay with Wrinkle Removal</option>
                </select>
              </div>

              {/* Question: Background Isolation Standard */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">Background Requirement</label>
                <select
                  value={customFields.backgroundType}
                  onChange={(e) => handleCustomFieldChange('backgroundType', e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-4 py-3 text-xs text-white focus:border-teal-500 focus:outline-none"
                >
                  <option value="Pure White (RGB 255,255,255 Amazon Compliant)">Pure White (RGB 255,255,255 Amazon Compliant)</option>
                  <option value="Transparent Alpha PNG (Isolated Clipping Path)">Transparent Alpha PNG (Isolated Clipping Path)</option>
                  <option value="Custom Neutral Grey / Lifestyle Backdrop">Custom Neutral Grey / Lifestyle Backdrop</option>
                  <option value="Original Background Retouched & Cleaned">Original Background Retouched & Cleaned</option>
                </select>
              </div>

              {/* Question: Shadow / Reflection */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">Shadow & Reflection Rendering</label>
                <select
                  value={customFields.shadowType}
                  onChange={(e) => handleCustomFieldChange('shadowType', e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-4 py-3 text-xs text-white focus:border-teal-500 focus:outline-none"
                >
                  <option value="Natural Soft Drop Shadow">Natural Soft Drop Shadow</option>
                  <option value="Realistic Mirror Surface Reflection">Realistic Mirror Surface Reflection</option>
                  <option value="Floating Clean (No Shadow)">Floating Clean (No Shadow)</option>
                  <option value="Cast Shadow from Studio Light Angle">Cast Shadow from Studio Light Angle</option>
                </select>
              </div>

              {/* Question: Output Format */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">Required Deliverable Formats</label>
                <select
                  value={customFields.outputFormat}
                  onChange={(e) => handleCustomFieldChange('outputFormat', e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-4 py-3 text-xs text-white focus:border-teal-500 focus:outline-none"
                >
                  <option value="High-Res JPG + Transparent PNG + Layered PSD">High-Res JPG + Transparent PNG + Layered PSD</option>
                  <option value="Optimized WebP for Shopify/WooCommerce">Optimized WebP for Shopify/WooCommerce</option>
                  <option value="Full Resolution 300 DPI Print TIFF">Full Resolution 300 DPI Print TIFF</option>
                  <option value="High-Resolution Vector PDF">High-Resolution Vector PDF</option>
                </select>
              </div>

              {/* Question: Resolution Dimension */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">Canvas Sizing & Resolution</label>
                <select
                  value={customFields.resolutionRequirement}
                  onChange={(e) => handleCustomFieldChange('resolutionRequirement', e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-4 py-3 text-xs text-white focus:border-teal-500 focus:outline-none"
                >
                  <option value="2000 x 2000 px (300 DPI Amazon Zoom standard)">2000 x 2000 px (300 DPI Amazon Zoom standard)</option>
                  <option value="1600 x 1600 px (High-density Mobile standard)">1600 x 1600 px (High-density Mobile standard)</option>
                  <option value="3000 x 3000 px (Ultra 4K Master)">3000 x 3000 px (Ultra 4K Master)</option>
                  <option value="Custom Aspect Ratio (Specify in notes)">Custom Aspect Ratio (Specify in notes)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section 4: Instructions, Requirements & File Upload */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-xl bg-cyan-500/10 text-cyan-400 font-black text-xs flex items-center justify-center border border-cyan-500/20">
                4
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Project Instructions & Image Upload</h3>
                <p className="text-xs text-slate-400">Attach sample photos, style references, or bulk cloud drive folders</p>
              </div>
            </div>

            {/* Special Instructions */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                Special Retouching Instructions / Seller Guidelines
              </label>
              <textarea
                rows={3}
                value={specialInstructions}
                onChange={(e) => setSpecialInstructions(e.target.value)}
                placeholder="e.g. Please preserve the metallic golden sheen on the zipper, ensure zero color shift on the crimson red fabric, and remove all mannequin pins..."
                className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 text-xs text-white placeholder:text-slate-600 focus:border-teal-500 focus:outline-none leading-relaxed"
              />
            </div>

            {/* Cloud Drive / Dropbox Link */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                Google Drive / Dropbox / WeTransfer Link (For bulk image batches)
              </label>
              <input
                type="url"
                value={referenceLinks}
                onChange={(e) => setReferenceLinks(e.target.value)}
                placeholder="https://drive.google.com/drive/folders/..."
                className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-4 py-3 text-xs text-white placeholder:text-slate-600 focus:border-teal-500 focus:outline-none"
              />
            </div>

            {/* Direct Multi-file Upload Box */}
            <div className="space-y-3">
              <label className="block text-xs font-bold text-slate-300">
                Direct File Upload (JPG, PNG, WEBP, PSD, RAW - Max 25MB each)
              </label>

              <div className="border-2 border-dashed border-slate-800 hover:border-teal-500/50 rounded-2xl p-6 text-center bg-slate-950/60 transition-colors">
                <input
                  type="file"
                  multiple
                  id="vantage-file-upload"
                  onChange={handleFileUpload}
                  className="hidden"
                  accept="image/*,.psd,.pdf,.zip"
                />
                <label htmlFor="vantage-file-upload" className="cursor-pointer space-y-2 block">
                  <Upload className="w-8 h-8 text-teal-400 mx-auto animate-pulse" />
                  <div className="text-xs font-bold text-white">
                    Click to select files or drag & drop here
                  </div>
                  <div className="text-[11px] text-slate-500">
                    Supports RAW photos, camera exports, and reference guides
                  </div>
                </label>
              </div>

              {uploadError && (
                <p className="text-xs text-red-400 font-bold">{uploadError}</p>
              )}

              {/* Uploaded Files List */}
              {uploadedFiles.length > 0 && (
                <div className="space-y-2 pt-2">
                  <span className="text-[11px] font-bold text-slate-400">
                    Selected Files ({uploadedFiles.length}):
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {uploadedFiles.map((file, idx) => (
                      <div
                        key={idx}
                        className="bg-slate-950 border border-slate-800 rounded-xl p-2.5 flex items-center justify-between space-x-2"
                      >
                        <div className="flex items-center space-x-2 truncate">
                          {file.previewUrl ? (
                            <img src={file.previewUrl} alt="Thumb" className="w-8 h-8 object-cover rounded-lg shrink-0" />
                          ) : (
                            <FileText className="w-5 h-5 text-teal-400 shrink-0" />
                          )}
                          <div className="truncate">
                            <span className="text-xs font-bold text-white block truncate">{file.name}</span>
                            <span className="text-[10px] text-slate-500">{(file.size / 1024 / 1024).toFixed(2)} MB</span>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleRemoveFile(idx)}
                          className="p-1 rounded-lg text-slate-500 hover:text-red-400 hover:bg-slate-900"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Sticky Live Estimation & Summary Card */}
        <div className="lg:col-span-4 space-y-6 sticky top-24">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-7 space-y-6 shadow-2xl">
            {/* Service Snapshot */}
            {selectedService && (
              <div className="space-y-3 border-b border-slate-800 pb-5">
                <div className="flex items-center space-x-3">
                  <img
                    src={selectedService.imageUrl}
                    alt={selectedService.title}
                    className="w-14 h-14 object-cover rounded-2xl border border-slate-800 bg-slate-950"
                  />
                  <div className="space-y-0.5">
                    <span className="text-[10px] font-bold text-teal-400 uppercase tracking-wider block">
                      {selectedService.categoryName}
                    </span>
                    <h4 className="text-sm font-bold text-white line-clamp-1">{selectedService.title}</h4>
                    <span className="text-xs text-slate-400 block">
                      Base: ₹{unitPrice.toLocaleString('en-IN')} / {selectedPackage ? selectedPackage.unit : 'unit'}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Quantity Counter */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-300">
                Number of Images / SKUs:
              </label>
              <div className="flex items-center space-x-3">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="w-10 h-10 rounded-xl bg-slate-950 border border-slate-800 text-white font-bold hover:bg-slate-800 flex items-center justify-center text-base"
                >
                  -
                </button>
                <input
                  type="number"
                  min="1"
                  max="500"
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 text-center text-sm font-bold text-white focus:border-teal-500 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setQuantity((q) => q + 1)}
                  className="w-10 h-10 rounded-xl bg-slate-950 border border-slate-800 text-white font-bold hover:bg-slate-800 flex items-center justify-center text-base"
                >
                  +
                </button>
              </div>
            </div>

            {/* Turnaround Priority */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-300">
                Turnaround Schedule:
              </label>
              <select
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white focus:border-teal-500 focus:outline-none"
              >
                <option value="Standard (24 Hours)">Standard (24 Hours SLA)</option>
                <option value="Urgent Express (6-12 Hours)">Urgent Express (6-12 Hours +25%)</option>
                <option value="Relaxed Bulk (48 Hours)">Relaxed Bulk (48 Hours)</option>
              </select>
            </div>

            {/* Price Breakdown */}
            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 space-y-2.5 text-xs">
              <div className="flex justify-between text-slate-400">
                <span>Base ({selectedPackage ? selectedPackage.name : 'Standard'} × {quantity})</span>
                <span className="text-white font-medium">₹{estimatedSubtotal.toLocaleString('en-IN')}</span>
              </div>

              {isExpress && (
                <div className="flex justify-between text-amber-400">
                  <span>Urgent Rush SLA (+25%)</span>
                  <span>+₹{expressSurcharge.toLocaleString('en-IN')}</span>
                </div>
              )}

              <div className="flex justify-between text-slate-400">
                <span>Amazon Compliance Review</span>
                <span className="text-teal-400 font-bold">FREE</span>
              </div>

              <div className="flex justify-between text-slate-400">
                <span>Revisions Included</span>
                <span className="text-purple-300 font-bold">{selectedPackage?.revisions || 'Unlimited Quality Checks'}</span>
              </div>

              <div className="pt-2 border-t border-slate-800 flex justify-between items-baseline">
                <span className="text-sm font-bold text-white">Estimated Quote:</span>
                <span className="text-xl font-black text-teal-300">
                  ₹{estimatedTotal.toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={submitting}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-teal-500 to-purple-600 hover:from-teal-400 hover:to-purple-500 text-slate-950 font-black text-sm shadow-xl shadow-teal-900/30 flex items-center justify-center space-x-2 transition-all transform active:scale-98 disabled:opacity-50"
            >
              {submitting ? (
                <span className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                  <span>Logging Project Brief...</span>
                </span>
              ) : (
                <span className="flex items-center space-x-2">
                  <Send className="w-4 h-4" />
                  <span>Submit Inquiry & Request Quote</span>
                </span>
              )}
            </button>

            {/* Guarantees Box */}
            <div className="space-y-2 text-[11px] text-slate-400 pt-2 border-t border-slate-800">
              <div className="flex items-center space-x-2 text-teal-400 font-bold">
                <ShieldCheck className="w-4 h-4 shrink-0" />
                <span>100% Amazon/Flipkart Guideline Guarantee</span>
              </div>
              <div className="flex items-center space-x-2 text-slate-400">
                <Clock className="w-4 h-4 text-purple-400 shrink-0" />
                <span>2-4 Hour Initial Stylist Feedback</span>
              </div>
              <div className="flex items-center space-x-2 text-slate-400">
                <Star className="w-4 h-4 text-amber-400 fill-current shrink-0" />
                <span>Manual Quality Inspection on Every Image</span>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};
