import React, { useState } from 'react';
import {
  ArrowLeft,
  Star,
  Clock,
  CheckCircle,
  ShoppingBag,
  Send,
  ShieldCheck,
  Zap,
  HelpCircle,
  Layers,
  ChevronDown,
  ChevronUp,
  Tag,
  Sparkles,
} from 'lucide-react';
import { VantageService, VantagePackage } from '../../types';
import { BeforeAfterSlider } from './BeforeAfterSlider';
import { ServiceInquiryModal } from './ServiceInquiryModal';
import { useCart } from '../../context/CartContext';

interface ServiceDetailViewProps {
  service: VantageService;
  relatedServices?: VantageService[];
  onBack: () => void;
  onSelectService?: (service: VantageService) => void;
  onOpenInquiry?: (service: VantageService) => void;
}

export const ServiceDetailView: React.FC<ServiceDetailViewProps> = ({
  service,
  relatedServices = [],
  onBack,
  onSelectService,
  onOpenInquiry,
}) => {
  const { addToCart } = useCart();
  const [selectedPackage, setSelectedPackage] = useState<VantagePackage | null>(
    service.packages && service.packages.length > 0 ? service.packages[0] : null
  );
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const [inquiryModalOpen, setInquiryModalOpen] = useState(false);
  const [cartSuccessMessage, setCartSuccessMessage] = useState('');

  const currentPrice = selectedPackage
    ? selectedPackage.price
    : service.salePrice || service.startingPrice;

  const handleAddToCart = () => {
    addToCart({
      id: `${service.id}-${selectedPackage ? selectedPackage.id : 'base'}`,
      title: `${service.title} (${selectedPackage ? selectedPackage.name : 'Standard'})`,
      price: currentPrice,
      type: 'service',
      imageUrl: service.imageUrl,
    });

    setCartSuccessMessage('Service package added to your cart!');
    setTimeout(() => setCartSuccessMessage(''), 4000);
  };

  return (
    <div className="space-y-12 animate-fadeIn pb-16">
      {/* Back Button & Breadcrumbs */}
      <div className="flex justify-between items-center">
        <button
          onClick={onBack}
          className="inline-flex items-center space-x-2 text-xs font-bold text-slate-400 hover:text-teal-400 bg-slate-900 border border-slate-800 px-4 py-2 rounded-xl transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to VantageEcom Services</span>
        </button>

        <div className="hidden sm:flex items-center space-x-2 text-xs text-slate-500 font-medium">
          <span>VantageEcom</span>
          <span>/</span>
          <span className="text-slate-300">{service.categoryName}</span>
          <span>/</span>
          <span className="text-teal-400 font-bold truncate max-w-[200px]">{service.title}</span>
        </div>
      </div>

      {cartSuccessMessage && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-sm font-bold flex items-center justify-between shadow-lg">
          <div className="flex items-center space-x-3">
            <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />
            <span>{cartSuccessMessage}</span>
          </div>
          <button
            onClick={() => setCartSuccessMessage('')}
            className="text-xs text-emerald-400 hover:underline font-bold"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Hero Service Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Image & Before/After Showcase */}
        <div className="lg:col-span-7 space-y-6">
          {service.beforeAfter && service.beforeAfter.length > 0 ? (
            <BeforeAfterSlider
              beforeImage={service.beforeAfter[0].beforeImage}
              afterImage={service.beforeAfter[0].afterImage}
              title={service.beforeAfter[0].title}
              description={service.beforeAfter[0].description}
            />
          ) : (
            <div className="relative aspect-[16/10] rounded-3xl overflow-hidden border border-slate-800 bg-slate-950 shadow-2xl">
              <img
                src={service.imageUrl}
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
          )}

          {/* Deliverables Checklist */}
          {service.whatYouGet && service.whatYouGet.length > 0 && (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-3">
              <h4 className="text-xs font-bold text-teal-400 uppercase tracking-wider flex items-center space-x-2">
                <ShieldCheck className="w-4 h-4 text-teal-400" />
                <span>What You Get in Every Package</span>
              </h4>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-300">
                {service.whatYouGet.map((item, idx) => (
                  <li key={idx} className="flex items-center space-x-2">
                    <CheckCircle className="w-3.5 h-3.5 text-teal-400 shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Right Info & Package Selection Card */}
        <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
          <div>
            <div className="flex items-center space-x-2 mb-2">
              <div className="flex items-center space-x-1 text-amber-400 text-xs font-bold bg-amber-400/10 px-2.5 py-1 rounded-full border border-amber-400/20">
                <Star className="w-3.5 h-3.5 fill-current" />
                <span>{service.rating || 5.0}</span>
                <span className="text-slate-500">({service.reviewsCount || 48} reviews)</span>
              </div>
              <span className="text-[11px] text-teal-400 font-bold bg-teal-500/10 px-2.5 py-1 rounded-full border border-teal-500/20">
                Verified Production Service
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-white leading-tight mb-3">
              {service.title}
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {service.shortDescription}
            </p>
          </div>

          {/* Dynamic Packages Tab System */}
          {service.packages && service.packages.length > 0 && (
            <div className="space-y-4 border-t border-b border-slate-800 py-6">
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">
                Select Package Level
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
                          ? 'bg-gradient-to-br from-teal-500/20 to-purple-600/20 border-teal-400 text-white shadow-lg shadow-teal-900/30'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      {pkg.popular && (
                        <span className="block text-[9px] font-black text-teal-400 uppercase tracking-wider mb-1">
                          Popular
                        </span>
                      )}
                      <span className="block text-xs font-bold truncate">{pkg.name}</span>
                      <span className="block text-sm font-black text-white mt-1">₹{pkg.price.toLocaleString('en-IN')}</span>
                    </button>
                  );
                })}
              </div>

              {/* Package Details Box */}
              {selectedPackage && (
                <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 space-y-3 animate-fadeIn">
                  <div className="flex justify-between items-baseline">
                    <div>
                      <span className="text-xl font-black text-white">₹{selectedPackage.price.toLocaleString('en-IN')}</span>
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
                        <CheckCircle className="w-3.5 h-3.5 text-teal-400 shrink-0" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* Action Buttons */}
          <div className="space-y-3">
            <button
              onClick={handleAddToCart}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-teal-500 to-purple-600 hover:from-teal-400 hover:to-purple-500 text-slate-950 font-black text-sm shadow-xl shadow-teal-900/30 flex items-center justify-center space-x-2 transition-all transform active:scale-98"
            >
              <ShoppingBag className="w-5 h-5" />
              <span>Add Package to Cart (₹{currentPrice.toLocaleString('en-IN')})</span>
            </button>

            <button
              onClick={() => {
                if (onOpenInquiry) {
                  onOpenInquiry(service);
                } else {
                  setInquiryModalOpen(true);
                }
              }}
              className="w-full py-3.5 rounded-2xl bg-slate-950 border border-slate-800 hover:border-teal-500/50 text-white font-bold text-xs flex items-center justify-center space-x-2 transition-all"
            >
              <Send className="w-4 h-4 text-teal-400" />
              <span>Submit Custom Requirements & Get Custom Quote</span>
            </button>
          </div>

          <div className="pt-2 text-[10px] text-slate-500 text-center space-y-1 border-t border-slate-800">
            <p>🔒 Verified Secure Payment • 100% Marketplace Guideline Pass Guarantee</p>
            <p>⚡ Express Turnaround Available for Urgent Product Launches</p>
          </div>
        </div>
      </div>

      {/* Full Description & Features Grid */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 space-y-8">
        <div>
          <h3 className="text-xl font-bold text-white mb-3">Service Deep-Dive & Quality Standards</h3>
          <p className="text-sm text-slate-300 leading-relaxed max-w-4xl">
            {service.fullDescription}
          </p>
        </div>

        {service.features && service.features.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {service.features.map((feat, idx) => (
              <div key={idx} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-start space-x-3">
                <div className="w-7 h-7 rounded-xl bg-teal-500/10 text-teal-400 flex items-center justify-center shrink-0 mt-0.5">
                  <Zap className="w-4 h-4" />
                </div>
                <span className="text-xs font-bold text-slate-200 leading-snug">{feat}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Process Steps Timeline */}
      {service.processSteps && service.processSteps.length > 0 && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 space-y-6">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <span className="text-xs font-bold text-teal-400 uppercase tracking-widest">How It Works</span>
            <h3 className="text-2xl font-black text-white">5-Step Seamless Delivery Process</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {service.processSteps.map((step) => (
              <div key={step.step} className="bg-slate-950 border border-slate-800 rounded-2xl p-5 space-y-3 relative group">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-r from-teal-500 to-purple-600 text-slate-950 font-black text-xs flex items-center justify-center shadow-md">
                  {step.step}
                </div>
                <h4 className="text-sm font-bold text-white">{step.title}</h4>
                <p className="text-xs text-slate-400 leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Specifications Table */}
      {service.specifications && service.specifications.length > 0 && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 space-y-4">
          <h3 className="text-lg font-bold text-white flex items-center space-x-2">
            <Layers className="w-5 h-5 text-teal-400" />
            <span>Technical Specifications</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {service.specifications.map((spec, i) => (
              <div key={i} className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <span className="block text-[10px] text-slate-500 font-bold uppercase">{spec.key}</span>
                <span className="block text-xs font-bold text-teal-300">{spec.value}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* FAQs Section */}
      {service.faqs && service.faqs.length > 0 && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 space-y-6">
          <div className="flex items-center space-x-3">
            <HelpCircle className="w-6 h-6 text-teal-400" />
            <h3 className="text-xl font-bold text-white">Frequently Asked Questions</h3>
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
                    {isOpen ? <ChevronUp className="w-4 h-4 text-teal-400" /> : <ChevronDown className="w-4 h-4 text-slate-500" />}
                  </button>
                  {isOpen && (
                    <div className="p-4 pt-0 text-xs text-slate-400 leading-relaxed border-t border-slate-900">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Related Services Carousel/Grid */}
      {relatedServices.length > 0 && (
        <div className="space-y-6">
          <h3 className="text-xl font-black text-white">Frequently Paired Marketplace Services</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedServices.map((rel) => (
              <div
                key={rel.id}
                onClick={() => onSelectService && onSelectService(rel)}
                className="bg-slate-900 border border-slate-800 hover:border-teal-500/50 rounded-2xl overflow-hidden cursor-pointer group transition-all"
              >
                <div className="aspect-[16/10] relative overflow-hidden bg-slate-950">
                  <img
                    src={rel.imageUrl}
                    alt={rel.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-4 space-y-2">
                  <span className="text-[10px] font-bold text-teal-400 uppercase">{rel.categoryName}</span>
                  <h4 className="text-xs font-bold text-white line-clamp-1 group-hover:text-teal-400">{rel.title}</h4>
                  <div className="flex justify-between items-center pt-2">
                    <span className="text-xs font-black text-white">₹{(rel.salePrice || rel.startingPrice).toLocaleString('en-IN')}</span>
                    <span className="text-[10px] text-teal-400 font-bold">View Specs →</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Inquiry Modal */}
      <ServiceInquiryModal
        service={service}
        isOpen={inquiryModalOpen}
        onClose={() => setInquiryModalOpen(false)}
      />
    </div>
  );
};
