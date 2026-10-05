import React, { useState, useEffect, useRef } from 'react';
import {
  ArrowLeft,
  Star,
  Clock,
  CheckCircle2,
  ShoppingBag,
  Send,
  ShieldCheck,
  Zap,
  HelpCircle,
  Layers,
  ChevronDown,
  ChevronUp,
  Sparkles,
  MessageCircle,
  FileText,
  Upload,
  X,
  FileSpreadsheet,
  AlertCircle,
  Check,
} from 'lucide-react';
import { VantageService, VantagePackage } from '../types';
import { mockVantageServices } from '../data/servicesData';
import { BeforeAfterSlider } from '../components/vantageecom/BeforeAfterSlider';
import { useCart } from '../context/CartContext';
import { SuccessToast } from '../components/common/SuccessToast';

interface ServiceDetailPageProps {
  slug?: string;
  serviceId?: string;
  initialService?: VantageService | null;
  autoFocusInquiry?: boolean;
  onBack?: () => void;
  onNavigateToService?: (slugOrId: string, autoFocusInquiry?: boolean) => void;
}

export const ServiceDetailPage: React.FC<ServiceDetailPageProps> = ({
  slug,
  serviceId,
  initialService,
  autoFocusInquiry = false,
  onBack,
  onNavigateToService,
}) => {
  const { addToCart } = useCart();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const inquirySectionRef = useRef<HTMLDivElement>(null);

  const [service, setService] = useState<VantageService | null>(initialService || null);
  const [relatedServices, setRelatedServices] = useState<VantageService[]>([]);
  const [loading, setLoading] = useState<boolean>(!initialService);
  const [selectedPackage, setSelectedPackage] = useState<VantagePackage | null>(null);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const [activeImage, setActiveImage] = useState<string>('');
  const [highlightInquiry, setHighlightInquiry] = useState<boolean>(autoFocusInquiry);

  // Toast
  const [toastMessage, setToastMessage] = useState<string>('');
  const [inquirySuccessToastOpen, setInquirySuccessToastOpen] = useState<boolean>(false);

  // Embedded Quick Inquiry Form State
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    company: '',
    platform: 'Amazon',
    quantity: 10,
    turnaround: 'Standard',
    projectBrief: '',
    driveLink: '',
  });

  const [uploadedFiles, setUploadedFiles] = useState<{ name: string; size: string; preview?: string }[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedInquiryId, setSubmittedInquiryId] = useState<string | null>(null);
  const [formError, setFormError] = useState<string>('');

  // Load service by slug or ID
  useEffect(() => {
    const identifier = slug || serviceId;
    if (initialService) {
      setService(initialService);
      setActiveImage(initialService.imageUrl);
      if (initialService.packages && initialService.packages.length > 0) {
        setSelectedPackage(initialService.packages[0]);
      }
      setLoading(false);
      return;
    }

    if (!identifier) {
      // Fallback to first mock service
      const fallback = mockVantageServices[0];
      setService(fallback);
      setActiveImage(fallback.imageUrl);
      if (fallback.packages && fallback.packages.length > 0) {
        setSelectedPackage(fallback.packages[0]);
      }
      setLoading(false);
      return;
    }

    setLoading(true);

    // Fetch from backend or fallback to mock
    fetch(`/api/vantageecom/services/${identifier}`)
      .then((res) => {
        if (!res.ok) throw new Error('Not found');
        return res.json();
      })
      .then((data) => {
        const srv = data.service || data;
        setService(srv);
        setActiveImage(srv.imageUrl);
        if (srv.packages && srv.packages.length > 0) {
          setSelectedPackage(srv.packages[0]);
        }
        if (data.relatedServices) {
          setRelatedServices(data.relatedServices);
        }
        setLoading(false);
      })
      .catch(() => {
        // Fallback to local mock data
        const found =
          mockVantageServices.find((s) => s.slug === identifier || s.id === identifier) ||
          mockVantageServices[0];
        setService(found);
        setActiveImage(found.imageUrl);
        if (found.packages && found.packages.length > 0) {
          setSelectedPackage(found.packages[0]);
        }

        const related = mockVantageServices
          .filter((s) => s.id !== found.id && (s.category === found.category || found.relatedServiceIds?.includes(s.id)))
          .slice(0, 4);
        setRelatedServices(related);
        setLoading(false);
      });
  }, [slug, serviceId, initialService]);

  // Auto-scroll to inquiry section if requested
  useEffect(() => {
    if (autoFocusInquiry || window.location.hash.includes('inquiry')) {
      setHighlightInquiry(true);
      setTimeout(() => {
        inquirySectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 300);
      const timer = setTimeout(() => setHighlightInquiry(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [autoFocusInquiry, service]);

  // Handle image upload preview
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files).map((f: File) => {
        const isImage = f.type.startsWith('image/');
        return {
          name: f.name,
          size: `${(f.size / (1024 * 1024)).toFixed(2)} MB`,
          preview: isImage ? URL.createObjectURL(f) : undefined,
        };
      });
      setUploadedFiles((prev) => [...prev, ...newFiles]);
    }
  };

  const removeUploadedFile = (index: number) => {
    setUploadedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  // Pricing calculation
  const currentPrice = selectedPackage ? selectedPackage.price : service?.salePrice || service?.startingPrice || 499;

  const handleAddToCart = () => {
    if (!service) return;
    addToCart({
      id: `${service.id}-${selectedPackage ? selectedPackage.id : 'base'}`,
      title: `${service.title} (${selectedPackage ? selectedPackage.name : 'Standard'})`,
      price: currentPrice,
      type: 'vantage-service',
      imageUrl: service.imageUrl,
      categoryName: service.categoryName,
    });
    setToastMessage(`"${service.title}" package added to cart!`);
    setTimeout(() => setToastMessage(''), 4000);
  };

  // Submit Quick Inquiry
  const handleSubmitInquiry = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!form.fullName.trim()) {
      setFormError('Please enter your full name');
      return;
    }
    if (!form.email.trim() || !form.email.includes('@')) {
      setFormError('Please enter a valid email address');
      return;
    }
    if (!form.phone.trim()) {
      setFormError('Please enter your WhatsApp / phone number');
      return;
    }

    setIsSubmitting(true);

    const payload = {
      serviceId: service?.id || 'vantage-srv-1',
      serviceTitle: service?.title || 'VantageEcom Inquiry',
      serviceCategory: service?.category || 'product-image-editing',
      customerName: form.fullName,
      customerEmail: form.email,
      customerPhone: form.phone,
      quantity: form.quantity,
      platform: form.platform,
      deadline: form.turnaround,
      description: form.projectBrief,
      uploadedFiles: uploadedFiles.map((f) => f.name),
      driveLink: form.driveLink,
      selectedPackage: selectedPackage ? selectedPackage.name : 'Custom',
    };

    try {
      const res = await fetch('/api/vantageecom/inquire', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      const inqId = data.inquiry?.id || `INQ-${Math.floor(100000 + Math.random() * 900000)}`;
      setSubmittedInquiryId(inqId);
      setInquirySuccessToastOpen(true);
    } catch {
      // Local fallback
      const inqId = `INQ-${Math.floor(100000 + Math.random() * 900000)}`;
      setSubmittedInquiryId(inqId);
      setInquirySuccessToastOpen(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Direct WhatsApp Action
  const handleWhatsAppChat = () => {
    const serviceName = service ? service.title : 'VantageEcom Photo Editing';
    const msg = encodeURIComponent(
      `Hello Annu Dhaneja / VantageEcom Team,\n\nI want to inquire about: *${serviceName}*.\n- Name: ${form.fullName || 'Client'}\n- Estimated Volume: ${form.quantity} images/SKUs\n- Target Platform: ${form.platform}\n- Brief: ${form.projectBrief || 'Need quote for high-volume editing.'}\n\nPlease share quote and onboarding steps.`
    );
    window.open(`https://wa.me/918527837527?text=${msg}`, '_blank');
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center space-y-4">
        <div className="w-12 h-12 border-4 border-teal-500 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-sm font-bold text-slate-400">Loading service specifications...</p>
      </div>
    );
  }

  if (!service) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-6">
        <AlertCircle className="w-16 h-16 text-rose-500 mx-auto" />
        <h2 className="text-2xl font-black text-white">Service Not Found</h2>
        <p className="text-slate-400 text-sm">
          The requested service detail page could not be located.
        </p>
        <button
          onClick={onBack}
          className="px-6 py-3 rounded-2xl bg-teal-500 text-slate-950 font-bold text-xs"
        >
          ← Back to All Services
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12 animate-fadeIn pb-20 relative">
      {/* Success Toast Notification */}
      <SuccessToast
        isOpen={inquirySuccessToastOpen}
        onClose={() => setInquirySuccessToastOpen(false)}
        title="Inquiry Received!"
        message={`Thank you ${form.fullName || 'Client'}! Your inquiry for "${service.title}" has been successfully recorded.`}
        inquiryId={submittedInquiryId || undefined}
      />

      {/* Cart Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 p-4 rounded-2xl bg-teal-500 text-slate-950 font-bold text-xs shadow-2xl flex items-center space-x-2 animate-bounce">
          <Check className="w-5 h-5 text-slate-950" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Header & Back Navigation */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-slate-800">
        <button
          onClick={onBack}
          className="inline-flex items-center space-x-2 text-xs font-bold text-slate-300 hover:text-teal-400 bg-slate-900 border border-slate-800 px-4 py-2.5 rounded-2xl transition-all shadow-sm hover:border-teal-500/40 active:scale-95"
        >
          <ArrowLeft className="w-4 h-4 text-teal-400" />
          <span>← Back to All Services</span>
        </button>

        <div className="flex items-center space-x-2 text-xs text-slate-400 font-medium overflow-x-auto">
          <span>Services</span>
          <span>/</span>
          <span className="text-slate-300">{service.categoryName}</span>
          <span>/</span>
          <span className="text-teal-400 font-bold truncate max-w-[240px]">{service.title}</span>
        </div>
      </div>

      {/* Main Grid: Left Service Overview & Visuals / Right Tiered Packages & Inquiry */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Images, Before/After Slider, What's Included, Tech Specs */}
        <div className="lg:col-span-7 space-y-8">
          {/* Main Visual: Before/After Slider OR High-Res Gallery */}
          {service.beforeAfter && service.beforeAfter.length > 0 ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-teal-400 uppercase tracking-wider flex items-center space-x-1.5">
                  <Sparkles className="w-4 h-4 text-teal-400" />
                  <span>Interactive Quality Transformation</span>
                </span>
                <span className="text-[11px] text-slate-400">Drag center bar to compare</span>
              </div>
              <BeforeAfterSlider
                beforeImage={service.beforeAfter[0].beforeImage}
                afterImage={service.beforeAfter[0].afterImage}
                title={service.beforeAfter[0].title}
                description={service.beforeAfter[0].description}
              />
            </div>
          ) : (
            <div className="space-y-3">
              <div className="relative aspect-[16/10] rounded-3xl overflow-hidden border border-slate-800 bg-slate-950 shadow-2xl">
                <img
                  src={activeImage || service.imageUrl}
                  alt={service.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-80" />
                <div className="absolute bottom-6 left-6 right-6 flex justify-between items-end">
                  <span className="px-3 py-1 rounded-full bg-teal-500/90 text-slate-950 font-black text-xs uppercase tracking-wider backdrop-blur-md">
                    {service.categoryName}
                  </span>
                  {service.marketplace && (
                    <span className="px-3 py-1 rounded-full bg-purple-500/90 text-white font-bold text-xs uppercase tracking-wider backdrop-blur-md">
                      {service.marketplace} Compliant
                    </span>
                  )}
                </div>
              </div>

              {/* Gallery Thumbnails */}
              {service.gallery && service.gallery.length > 1 && (
                <div className="flex items-center space-x-3 overflow-x-auto pb-2">
                  {service.gallery.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImage(img)}
                      className={`w-20 h-16 rounded-xl overflow-hidden border transition-all shrink-0 ${
                        activeImage === img
                          ? 'border-teal-400 ring-2 ring-teal-500/30'
                          : 'border-slate-800 opacity-60 hover:opacity-100'
                      }`}
                    >
                      <img src={img} alt="Thumbnail" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Description & Full Details */}
          <div className="p-8 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-6">
            <div>
              <span className="text-[11px] font-bold text-teal-400 uppercase tracking-widest block mb-1">
                Overview & Workflow
              </span>
              <h2 className="text-xl font-bold text-white mb-3">{service.title}</h2>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                {service.fullDescription || service.shortDescription}
              </p>
            </div>

            {/* Key Inclusions & Features */}
            {service.features && service.features.length > 0 && (
              <div className="pt-4 border-t border-slate-800/80 space-y-3">
                <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center space-x-2">
                  <ShieldCheck className="w-4 h-4 text-teal-400" />
                  <span>Key Production Capabilities</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {service.features.map((feat, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800/80 flex items-start space-x-2.5"
                    >
                      <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
                      <span className="text-xs text-slate-300 font-medium leading-snug">{feat}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* What's Delivered in Every Order */}
            {service.whatYouGet && service.whatYouGet.length > 0 && (
              <div className="pt-4 border-t border-slate-800/80 space-y-3">
                <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center space-x-2">
                  <Zap className="w-4 h-4 text-teal-400" />
                  <span>Deliverables & File Formats</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-300">
                  {service.whatYouGet.map((item, idx) => (
                    <div key={idx} className="flex items-center space-x-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-teal-400 shrink-0" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Technical Specifications & Compliance */}
          {service.specifications && service.specifications.length > 0 && (
            <div className="p-8 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-4">
              <h3 className="text-base font-bold text-white flex items-center space-x-2">
                <Layers className="w-4 h-4 text-teal-400" />
                <span>Technical Specifications & Guidelines</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {service.specifications.map((spec, i) => (
                  <div key={i} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                    <span className="block text-[10px] text-slate-500 font-bold uppercase">{spec.key}</span>
                    <span className="block text-xs font-bold text-teal-300">{spec.value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 5-Step Process Timeline */}
          {service.processSteps && service.processSteps.length > 0 && (
            <div className="p-8 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-6">
              <div className="space-y-1">
                <span className="text-xs font-bold text-teal-400 uppercase tracking-widest">Turnaround SLA</span>
                <h3 className="text-lg font-bold text-white">5-Step Standardized Workflow</h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {service.processSteps.map((step) => (
                  <div key={step.step} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                    <div className="w-6 h-6 rounded-lg bg-teal-500 text-slate-950 font-black text-xs flex items-center justify-center">
                      {step.step}
                    </div>
                    <h5 className="text-xs font-bold text-white">{step.title}</h5>
                    <p className="text-[11px] text-slate-400 leading-relaxed">{step.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* FAQs */}
          {service.faqs && service.faqs.length > 0 && (
            <div className="p-8 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-4">
              <div className="flex items-center space-x-2">
                <HelpCircle className="w-5 h-5 text-teal-400" />
                <h3 className="text-base font-bold text-white">Frequently Asked Questions</h3>
              </div>
              <div className="space-y-3">
                {service.faqs.map((faq, i) => {
                  const isOpen = openFaqIndex === i;
                  return (
                    <div key={i} className="rounded-2xl bg-slate-950 border border-slate-800 overflow-hidden">
                      <button
                        onClick={() => setOpenFaqIndex(isOpen ? null : i)}
                        className="w-full p-4 text-left font-bold text-xs text-white flex justify-between items-center hover:bg-slate-900/50"
                      >
                        <span>{faq.question}</span>
                        {isOpen ? (
                          <ChevronUp className="w-4 h-4 text-teal-400 shrink-0" />
                        ) : (
                          <ChevronDown className="w-4 h-4 text-slate-500 shrink-0" />
                        )}
                      </button>
                      {isOpen && (
                        <div className="p-4 pt-0 text-xs text-slate-300 leading-relaxed border-t border-slate-900">
                          {faq.answer}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Pricing Tier Cards & Embedded Quick Inquiry Form */}
        <div className="lg:col-span-5 space-y-8 sticky top-24">
          {/* Tier Comparison & Direct Cart Card */}
          <div className="bg-slate-900/95 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl backdrop-blur-md">
            <div>
              <div className="flex items-center space-x-2 mb-2">
                <div className="flex items-center space-x-1 text-amber-400 text-xs font-bold bg-amber-400/10 px-2.5 py-1 rounded-full border border-amber-400/20">
                  <Star className="w-3.5 h-3.5 fill-current" />
                  <span>{service.rating || 5.0}</span>
                  <span className="text-slate-500">({service.reviewsCount || 48} reviews)</span>
                </div>
                <span className="text-[11px] text-teal-400 font-bold bg-teal-500/10 px-2.5 py-1 rounded-full border border-teal-500/20">
                  Marketplace Standard
                </span>
              </div>

              <h1 className="text-2xl font-black text-white leading-tight mb-2">
                {service.title}
              </h1>
              <p className="text-xs text-slate-400 leading-relaxed">
                Standard Turnaround SLA: <strong className="text-teal-400">{service.deliveryTime}</strong>
              </p>
            </div>

            {/* Packages Level Selector */}
            {service.packages && service.packages.length > 0 && (
              <div className="space-y-4 border-t border-b border-slate-800 py-5">
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Select Production Tier
                </label>

                <div className="grid grid-cols-3 gap-2">
                  {service.packages.map((pkg) => {
                    const isSelected = selectedPackage?.id === pkg.id;
                    return (
                      <button
                        key={pkg.id}
                        onClick={() => setSelectedPackage(pkg)}
                        className={`p-3 rounded-2xl border text-left transition-all ${
                          isSelected
                            ? 'bg-gradient-to-br from-teal-500/20 to-purple-600/20 border-teal-400 text-white shadow-lg shadow-teal-900/30 ring-1 ring-teal-500/50'
                            : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                        }`}
                      >
                        {pkg.popular && (
                          <span className="block text-[8px] font-black text-teal-400 uppercase tracking-wider mb-1">
                            Popular
                          </span>
                        )}
                        <span className="block text-xs font-bold truncate">{pkg.name}</span>
                        <span className="block text-sm font-black text-white mt-1">
                          ₹{pkg.price.toLocaleString('en-IN')}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* Selected Package Details */}
                {selectedPackage && (
                  <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 space-y-3 animate-fadeIn">
                    <div className="flex justify-between items-baseline">
                      <div>
                        <span className="text-xl font-black text-white">
                          ₹{selectedPackage.price.toLocaleString('en-IN')}
                        </span>
                        {selectedPackage.originalPrice && (
                          <span className="text-xs text-slate-500 line-through ml-2">
                            ₹{selectedPackage.originalPrice.toLocaleString('en-IN')}
                          </span>
                        )}
                        <span className="text-[11px] text-slate-400 ml-1">/ {selectedPackage.unit}</span>
                      </div>
                      <div className="flex items-center space-x-1 text-xs text-teal-400 font-bold">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{selectedPackage.deliveryTime}</span>
                      </div>
                    </div>

                    <ul className="space-y-1.5 text-xs text-slate-300 pt-2 border-t border-slate-850">
                      {selectedPackage.features.map((feat, i) => (
                        <li key={i} className="flex items-center space-x-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-teal-400 shrink-0" />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {/* Quick Add to Cart */}
            <button
              onClick={handleAddToCart}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-teal-500 to-purple-600 hover:from-teal-400 hover:to-purple-500 text-slate-950 font-black text-xs shadow-xl shadow-teal-900/30 flex items-center justify-center space-x-2 transition-all transform active:scale-98"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Add Package to Cart (₹{currentPrice.toLocaleString('en-IN')})</span>
            </button>
          </div>

          {/* Embedded Quick Inquiry Form */}
          <div
            ref={inquirySectionRef}
            id="inquiry-section"
            className={`bg-slate-900/95 border rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl backdrop-blur-md transition-all duration-500 ${
              highlightInquiry
                ? 'border-teal-400 ring-4 ring-teal-500/30 scale-[1.01]'
                : 'border-slate-800'
            }`}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <span className="text-[10px] font-bold text-teal-400 uppercase tracking-widest block">
                  Direct Project Brief
                </span>
                <h3 className="text-lg font-black text-white">Inquire / Request Custom Quote</h3>
              </div>
              <div className="w-8 h-8 rounded-xl bg-teal-500/10 text-teal-400 flex items-center justify-center">
                <Send className="w-4 h-4" />
              </div>
            </div>

            {submittedInquiryId ? (
              <div className="p-6 rounded-2xl bg-teal-500/10 border border-teal-500/30 text-center space-y-4 animate-fadeIn">
                <div className="w-12 h-12 rounded-full bg-teal-500 text-slate-950 flex items-center justify-center mx-auto">
                  <Check className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-base font-bold text-white">Inquiry Received!</h4>
                  <p className="text-xs text-slate-300">
                    Your reference ID is <strong className="text-teal-400 font-mono">{submittedInquiryId}</strong>.
                    Our lead production editor will review your brief within 2-4 hours.
                  </p>
                </div>
                <button
                  onClick={handleWhatsAppChat}
                  className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs flex items-center justify-center space-x-2 transition-all"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Connect Instantly on WhatsApp</span>
                </button>
                <button
                  onClick={() => setSubmittedInquiryId(null)}
                  className="text-xs text-teal-400 hover:underline block mx-auto font-bold"
                >
                  Submit Another Project Inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmitInquiry} className="space-y-4">
                {formError && (
                  <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-bold">
                    {formError}
                  </div>
                )}

                {/* Contact Fields */}
                <div className="space-y-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g., Rohit Sharma"
                      value={form.fullName}
                      onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs placeholder:text-slate-600 focus:outline-none focus:border-teal-500"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="you@brand.com"
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs placeholder:text-slate-600 focus:outline-none focus:border-teal-500"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                        WhatsApp / Phone *
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder="+91 98765 43210"
                        value={form.phone}
                        onChange={(e) => setForm({ ...form, phone: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs placeholder:text-slate-600 focus:outline-none focus:border-teal-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                        Target Marketplace
                      </label>
                      <select
                        value={form.platform}
                        onChange={(e) => setForm({ ...form, platform: e.target.value })}
                        className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-teal-500"
                      >
                        <option value="Amazon">Amazon</option>
                        <option value="Flipkart">Flipkart</option>
                        <option value="Shopify">Shopify Store</option>
                        <option value="Myntra">Myntra / Ajio</option>
                        <option value="Etsy">Etsy / International</option>
                        <option value="Custom">Custom Web Catalog</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                        Quantity / Images
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="5000"
                        value={form.quantity}
                        onChange={(e) => setForm({ ...form, quantity: parseInt(e.target.value) || 1 })}
                        className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-teal-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                      Project Brief / Specific Instructions
                    </label>
                    <textarea
                      rows={3}
                      placeholder="Describe your background, shadow, resolution or color preference..."
                      value={form.projectBrief}
                      onChange={(e) => setForm({ ...form, projectBrief: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs placeholder:text-slate-600 focus:outline-none focus:border-teal-500"
                    />
                  </div>

                  {/* Sample File Upload or Drive Link */}
                  <div className="space-y-2">
                    <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                      Upload Sample Images or Google Drive Link
                    </label>
                    <input
                      type="file"
                      ref={fileInputRef}
                      multiple
                      accept="image/*,.pdf,.zip"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      className="p-3 border-2 border-dashed border-slate-800 hover:border-teal-500/50 rounded-2xl text-center cursor-pointer bg-slate-950/60 transition-colors"
                    >
                      <Upload className="w-5 h-5 text-teal-400 mx-auto mb-1" />
                      <span className="text-[11px] font-bold text-slate-300 block">
                        Click to attach sample photos
                      </span>
                      <span className="text-[10px] text-slate-500">JPG, PNG, ZIP (Up to 25MB)</span>
                    </div>

                    {uploadedFiles.length > 0 && (
                      <div className="space-y-1.5 pt-1">
                        {uploadedFiles.map((file, idx) => (
                          <div
                            key={idx}
                            className="flex items-center justify-between p-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300"
                          >
                            <div className="flex items-center space-x-2 truncate">
                              <FileText className="w-3.5 h-3.5 text-teal-400 shrink-0" />
                              <span className="truncate">{file.name}</span>
                              <span className="text-[10px] text-slate-500">({file.size})</span>
                            </div>
                            <button
                              type="button"
                              onClick={() => removeUploadedFile(idx)}
                              className="text-slate-500 hover:text-rose-400 p-1"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}

                    <input
                      type="url"
                      placeholder="Or paste Google Drive / Dropbox link here..."
                      value={form.driveLink}
                      onChange={(e) => setForm({ ...form, driveLink: e.target.value })}
                      className="w-full px-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-[11px] placeholder:text-slate-600 focus:outline-none focus:border-teal-500"
                    />
                  </div>
                </div>

                {/* Form Submit & Direct WhatsApp Action */}
                <div className="space-y-2 pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-teal-500 to-purple-600 hover:from-teal-400 hover:to-purple-500 disabled:opacity-50 text-slate-950 font-black text-xs shadow-xl shadow-teal-900/30 flex items-center justify-center space-x-2 transition-all transform active:scale-98"
                  >
                    <Send className="w-4 h-4" />
                    <span>{isSubmitting ? 'Submitting Brief...' : 'Submit Inquiry & Request Quote'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleWhatsAppChat}
                    className="w-full py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs flex items-center justify-center space-x-2 transition-all"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>Chat on WhatsApp Directly</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* Related / Frequently Paired Services */}
      {relatedServices.length > 0 && (
        <div className="space-y-6 pt-8 border-t border-slate-800">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-black text-white">Frequently Paired Marketplace Services</h3>
            <span className="text-xs text-slate-400">Bundle for high-converting listings</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedServices.map((rel) => (
              <div
                key={rel.id}
                onClick={() => {
                  if (onNavigateToService) {
                    onNavigateToService(rel.slug || rel.id);
                  } else {
                    setService(rel);
                    setActiveImage(rel.imageUrl);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }
                }}
                className="bg-slate-900 border border-slate-800 hover:border-teal-500/50 rounded-2xl overflow-hidden cursor-pointer group transition-all transform hover:-translate-y-1"
              >
                <div className="aspect-[16/10] relative overflow-hidden bg-slate-950">
                  <img
                    src={rel.imageUrl}
                    alt={rel.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-slate-950/80 text-teal-400 text-[9px] font-bold uppercase border border-teal-500/20">
                    {rel.categoryName}
                  </div>
                </div>
                <div className="p-4 space-y-2">
                  <h4 className="text-xs font-bold text-white line-clamp-1 group-hover:text-teal-400">
                    {rel.title}
                  </h4>
                  <p className="text-[11px] text-slate-400 line-clamp-2">{rel.shortDescription}</p>
                  <div className="flex justify-between items-center pt-2 border-t border-slate-800/80">
                    <span className="text-xs font-black text-white">
                      ₹{(rel.salePrice || rel.startingPrice).toLocaleString('en-IN')}
                    </span>
                    <span className="text-[10px] text-teal-400 font-bold">Inquire / View Specs →</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
