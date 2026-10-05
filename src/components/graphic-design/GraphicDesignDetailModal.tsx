import React, { useState } from 'react';
import {
  X,
  Star,
  Clock,
  Zap,
  CheckCircle2,
  XCircle,
  HelpCircle,
  MessageCircle,
  ShoppingBag,
  Sparkles,
  Layers,
  FileCheck,
  ChevronDown,
  ChevronUp,
  Share2,
  ShieldCheck,
  Flame,
  Rocket,
} from 'lucide-react';
import {
  GraphicDesignService,
  GraphicDesignPackage,
  DELIVERY_SPEED_TIERS,
  DeliverySpeedOption,
} from '../../data/graphicDesignData';
import { useCart } from '../../context/CartContext';

interface GraphicDesignDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  service: GraphicDesignService | null;
  onOpenInquiry: (service: GraphicDesignService, mode: 'inquiry' | 'quote') => void;
}

export const GraphicDesignDetailModal: React.FC<GraphicDesignDetailModalProps> = ({
  isOpen,
  onClose,
  service,
  onOpenInquiry,
}) => {
  const { addItem } = useCart();
  const [selectedPackage, setSelectedPackage] = useState<GraphicDesignPackage | null>(
    service?.packages[0] || null
  );
  const [selectedDelivery, setSelectedDelivery] = useState<DeliverySpeedOption>(
    DELIVERY_SPEED_TIERS[0]
  );
  const [activeImage, setActiveImage] = useState<string>(service?.imageUrl || '');
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [activeTab, setActiveTab] = useState<'overview' | 'packages' | 'faqs' | 'reviews'>('overview');

  // Sync service changes
  React.useEffect(() => {
    if (service) {
      setSelectedPackage(service.packages.find((p) => p.popular) || service.packages[0] || null);
      setActiveImage(service.imageUrl);
      setSelectedDelivery(DELIVERY_SPEED_TIERS[0]);
    }
  }, [service]);

  if (!isOpen || !service) return null;

  const currentPackage = selectedPackage || service.packages[0];
  const totalPrice = (currentPackage ? currentPackage.price : service.startingPrice) + selectedDelivery.additionalFee;

  const handleOrderNow = () => {
    addItem({
      itemId: `${service.id}-${currentPackage.id}-${selectedDelivery.id}`,
      itemType: 'service',
      name: `${service.title} (${currentPackage.name}) [${selectedDelivery.label}]`,
      price: totalPrice,
      quantity: 1,
    });
    onClose();
  };

  const getSpeedIcon = (iconName: string) => {
    switch (iconName) {
      case 'Rocket':
        return <Rocket className="w-3.5 h-3.5 text-rose-400" />;
      case 'Flame':
        return <Flame className="w-3.5 h-3.5 text-amber-400" />;
      case 'Sparkles':
        return <Sparkles className="w-3.5 h-3.5 text-cyan-400" />;
      case 'Zap':
        return <Zap className="w-3.5 h-3.5 text-yellow-400" />;
      default:
        return <Clock className="w-3.5 h-3.5 text-slate-400" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-[#FFFFFF] dark:bg-[#182429] rounded-3xl border border-[#DCE7E7] dark:border-[#2A3C40] text-[#102A36] dark:text-[#F4F8F8] shadow-2xl overflow-hidden my-4 max-h-[92vh] flex flex-col">
        
        {/* Top Sticky Header */}
        <div className="px-6 py-4 bg-[#F8FAFA] dark:bg-[#111A1E] border-b border-[#DCE7E7] dark:border-[#2A3C40] flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-3">
            <span className="px-3 py-1 rounded-full bg-[#DDF3F4] text-[#087581] dark:bg-[#173D40] dark:text-[#25B4BD] text-[11px] font-bold border border-[#0799A6]/30">
              {service.categoryName}
            </span>
            <div className="flex items-center space-x-1 text-amber-500 text-xs font-bold">
              <Star className="w-3.5 h-3.5 fill-current" />
              <span>{service.rating}</span>
              <span className="text-[#52636A] dark:text-[#819396]">({service.reviewsCount} reviews)</span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-[#52636A] dark:text-[#B7C6C8] hover:text-[#102A36] dark:hover:text-[#F4F8F8] hover:bg-[#DDF3F4]/50 dark:hover:bg-[#111A1E] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content Container */}
        <div className="overflow-y-auto flex-1 p-6 space-y-8">
          
          {/* Top Section: Media & Quick Details */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Left: Image Preview & Gallery (5 cols) */}
            <div className="lg:col-span-5 space-y-3">
              <div className="h-64 sm:h-72 rounded-2xl overflow-hidden relative border border-[#DCE7E7] dark:border-[#2A3C40] bg-[#F8FAFA] dark:bg-[#111A1E] shadow-inner">
                <img
                  src={activeImage || service.imageUrl}
                  alt={service.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
                {service.trending && (
                  <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-[#F5A39A] text-[#102A36] text-[10px] font-black flex items-center space-x-1 shadow-xs">
                    <Flame className="w-3 h-3 fill-current" />
                    <span>TRENDING</span>
                  </div>
                )}
              </div>

              {/* Gallery Thumbnails */}
              {service.gallery && service.gallery.length > 1 && (
                <div className="flex space-x-2 overflow-x-auto pb-1">
                  {service.gallery.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveImage(img)}
                      className={`w-16 h-16 rounded-xl overflow-hidden border-2 shrink-0 transition-all ${
                        activeImage === img ? 'border-[#0799A6] scale-105' : 'border-transparent opacity-60 hover:opacity-100'
                      }`}
                    >
                      <img src={img} alt="Thumbnail" referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}

              {/* Key Highlights Card */}
              <div className="p-3.5 rounded-2xl bg-[#F8FAFA] dark:bg-[#111A1E] border border-[#DCE7E7] dark:border-[#2A3C40] space-y-2 text-xs">
                <div className="flex items-center justify-between text-[#52636A] dark:text-[#B7C6C8]">
                  <span className="text-[#819396]">Dimensions:</span>
                  <span className="font-semibold text-[#102A36] dark:text-[#F4F8F8]">{service.dimensions}</span>
                </div>
                <div className="flex items-center justify-between text-[#52636A] dark:text-[#B7C6C8]">
                  <span className="text-[#819396]">Revisions:</span>
                  <span className="font-semibold text-[#0799A6] dark:text-[#25B4BD]">{service.revisions}</span>
                </div>
                <div className="flex items-center justify-between text-[#52636A] dark:text-[#B7C6C8]">
                  <span className="text-[#819396]">Completed:</span>
                  <span className="font-semibold text-[#F5A39A] dark:text-[#F2A39A]">{service.completedOrders}+ Orders</span>
                </div>
              </div>
            </div>

            {/* Right: Title, Description, Package Selector (7 cols) */}
            <div className="lg:col-span-7 space-y-5">
              <div>
                <h2 className="text-2xl font-black text-[#102A36] dark:text-[#F4F8F8] leading-tight">
                  {service.title}
                </h2>
                <p className="text-xs text-[#52636A] dark:text-[#B7C6C8] mt-2 leading-relaxed">
                  {service.fullDescription}
                </p>
              </div>

              {/* Package Tier Options */}
              <div className="space-y-2.5">
                <label className="block text-xs font-bold text-[#102A36] dark:text-[#F4F8F8] uppercase tracking-wider">
                  Select Package Tier:
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  {service.packages.map((pkg) => {
                    const isSelected = currentPackage?.id === pkg.id;
                    return (
                      <button
                        key={pkg.id}
                        onClick={() => setSelectedPackage(pkg)}
                        className={`p-3 rounded-2xl text-left border transition-all relative flex flex-col justify-between ${
                          isSelected
                            ? 'bg-[#DDF3F4] dark:bg-[#173D40] border-[#0799A6] ring-2 ring-[#0799A6]/30'
                            : 'bg-[#F8FAFA] dark:bg-[#111A1E] border-[#DCE7E7] dark:border-[#2A3C40] hover:border-[#0799A6]'
                        }`}
                      >
                        {pkg.popular && (
                          <span className="absolute -top-2.5 right-2 px-2 py-0.5 rounded-full bg-[#F5A39A] text-[#102A36] text-[9px] font-bold shadow-2xs">
                            BEST VALUE
                          </span>
                        )}
                        <div>
                          <div className="text-xs font-bold text-[#102A36] dark:text-[#F4F8F8]">{pkg.name}</div>
                          <div className="text-[10px] text-[#52636A] dark:text-[#819396] mt-0.5">{pkg.revisions}</div>
                        </div>
                        <div className="mt-2 pt-2 border-t border-[#DCE7E7] dark:border-[#2A3C40] flex items-baseline space-x-1.5">
                          <span className="text-sm font-black text-[#0799A6] dark:text-[#25B4BD]">₹{pkg.price}</span>
                          {pkg.originalPrice > pkg.price && (
                            <span className="text-[10px] text-[#819396] line-through">₹{pkg.originalPrice}</span>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Delivery Speed Selector */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-[#102A36] dark:text-[#F4F8F8] uppercase tracking-wider">
                    Choose Delivery Speed:
                  </label>
                  <span className="text-[11px] text-[#0799A6] dark:text-[#25B4BD] font-bold">
                    {selectedDelivery.timeframe}
                  </span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {DELIVERY_SPEED_TIERS.map((tier) => {
                    const isSelected = selectedDelivery.id === tier.id;
                    return (
                      <button
                        key={tier.id}
                        onClick={() => setSelectedDelivery(tier)}
                        className={`p-2.5 rounded-xl text-left border transition-all flex items-center justify-between ${
                          isSelected
                            ? 'bg-[#DDF3F4] dark:bg-[#173D40] border-[#0799A6] ring-1 ring-[#0799A6]'
                            : 'bg-[#F8FAFA] dark:bg-[#111A1E] border-[#DCE7E7] dark:border-[#2A3C40]'
                        }`}
                      >
                        <div className="flex items-center space-x-2">
                          {getSpeedIcon(tier.iconName)}
                          <div>
                            <span className="text-[11px] font-bold text-[#102A36] dark:text-[#F4F8F8] block">
                              {tier.badge}
                            </span>
                            <span className="text-[9px] text-[#52636A] dark:text-[#819396]">
                              {tier.additionalFee === 0 ? 'Free' : `+₹${tier.additionalFee}`}
                            </span>
                          </div>
                        </div>
                        {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-[#0799A6] dark:text-[#25B4BD] shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Included in this Package */}
              <div className="p-4 rounded-2xl bg-[#DDF3F4]/50 dark:bg-[#173D40]/30 border border-[#0799A6]/30 space-y-2">
                <span className="text-[10px] uppercase font-bold text-[#087581] dark:text-[#25B4BD] tracking-wider block">
                  Package Deliverables:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                  {currentPackage.features.map((feat, i) => (
                    <div key={i} className="text-xs text-[#102A36] dark:text-[#F4F8F8] flex items-center space-x-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#0799A6] dark:text-[#25B4BD] shrink-0" />
                      <span className="line-clamp-1">{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>

          {/* Tabbed In-Depth Sections (Overview / Whats Included / FAQ / Reviews) */}
          <div className="border-t border-[#DCE7E7] dark:border-[#2A3C40] pt-6 space-y-6">
            <div className="flex border-b border-[#DCE7E7] dark:border-[#2A3C40] space-x-6 text-xs font-bold">
              <button
                onClick={() => setActiveTab('overview')}
                className={`pb-3 transition-colors ${
                  activeTab === 'overview'
                    ? 'border-b-2 border-[#0799A6] text-[#0799A6] dark:text-[#25B4BD]'
                    : 'text-[#52636A] dark:text-[#819396] hover:text-[#102A36]'
                }`}
              >
                Included &amp; Excluded
              </button>
              <button
                onClick={() => setActiveTab('faqs')}
                className={`pb-3 transition-colors ${
                  activeTab === 'faqs'
                    ? 'border-b-2 border-[#0799A6] text-[#0799A6] dark:text-[#25B4BD]'
                    : 'text-[#52636A] dark:text-[#819396] hover:text-[#102A36]'
                }`}
              >
                Frequently Asked ({service.faqs.length})
              </button>
              <button
                onClick={() => setActiveTab('reviews')}
                className={`pb-3 transition-colors ${
                  activeTab === 'reviews'
                    ? 'border-b-2 border-[#0799A6] text-[#0799A6] dark:text-[#25B4BD]'
                    : 'text-[#52636A] dark:text-[#819396] hover:text-[#102A36]'
                }`}
              >
                Customer Reviews ({service.reviews.length})
              </button>
            </div>

            {/* Tab 1: Whats Included & Excluded */}
            {activeTab === 'overview' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-4 rounded-2xl bg-[#DDF3F4]/40 border border-[#0799A6]/20 space-y-3">
                  <h4 className="text-xs font-bold text-[#087581] dark:text-[#25B4BD] flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-[#0799A6]" />
                    <span>What’s Always Included:</span>
                  </h4>
                  <ul className="space-y-2">
                    {service.whatsIncluded.map((item, idx) => (
                      <li key={idx} className="text-xs text-[#52636A] dark:text-[#B7C6C8] flex items-start space-x-2">
                        <span className="text-[#0799A6] font-bold">✓</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-4 rounded-2xl bg-[#FDE2DE]/40 border border-[#F5A39A]/30 space-y-3">
                  <h4 className="text-xs font-bold text-[#D9777F] dark:text-[#F2A39A] flex items-center space-x-2">
                    <XCircle className="w-4 h-4 text-[#F5A39A]" />
                    <span>What’s Not Included:</span>
                  </h4>
                  <ul className="space-y-2">
                    {service.whatsNotIncluded.map((item, idx) => (
                      <li key={idx} className="text-xs text-[#52636A] dark:text-[#819396] flex items-start space-x-2">
                        <span className="text-[#F5A39A] font-bold">✕</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {/* Tab 2: FAQs */}
            {activeTab === 'faqs' && (
              <div className="space-y-3">
                {service.faqs.map((faq, i) => (
                  <div
                    key={i}
                    className="rounded-2xl bg-[#F8FAFA] dark:bg-[#111A1E] border border-[#DCE7E7] dark:border-[#2A3C40] overflow-hidden"
                  >
                    <button
                      onClick={() => setOpenFaq(openFaq === i ? null : i)}
                      className="w-full px-4 py-3 text-left font-bold text-xs text-[#102A36] dark:text-[#F4F8F8] flex items-center justify-between"
                    >
                      <span>{faq.question}</span>
                      {openFaq === i ? <ChevronUp className="w-4 h-4 text-[#0799A6]" /> : <ChevronDown className="w-4 h-4 text-[#819396]" />}
                    </button>
                    {openFaq === i && (
                      <div className="px-4 pb-3 text-xs text-[#52636A] dark:text-[#B7C6C8] leading-relaxed border-t border-[#DCE7E7] dark:border-[#2A3C40] pt-2">
                        {faq.answer}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Tab 3: Customer Reviews */}
            {activeTab === 'reviews' && (
              <div className="space-y-4">
                {service.reviews.map((rev, i) => (
                  <div
                    key={i}
                    className="p-4 rounded-2xl bg-[#F8FAFA] dark:bg-[#111A1E] border border-[#DCE7E7] dark:border-[#2A3C40] space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="w-7 h-7 rounded-full bg-[#0799A6] text-white font-bold text-xs flex items-center justify-center">
                          {rev.name.charAt(0)}
                        </div>
                        <span className="text-xs font-bold text-[#102A36] dark:text-[#F4F8F8]">{rev.name}</span>
                        {rev.verified && (
                          <span className="px-2 py-0.5 rounded-full bg-[#DDF3F4] text-[#087581] dark:bg-[#173D40] dark:text-[#25B4BD] text-[10px] font-bold">
                            Verified Buyer
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-[#819396]">{rev.date}</span>
                    </div>
                    <div className="flex text-amber-400">
                      {[...Array(rev.rating)].map((_, idx) => (
                        <Star key={idx} className="w-3 h-3 fill-current" />
                      ))}
                    </div>
                    <p className="text-xs text-[#52636A] dark:text-[#B7C6C8]">{rev.comment}</p>
                  </div>
                ))}
              </div>
            )}

          </div>
        </div>

        {/* Bottom Fixed Action Bar */}
        <div className="px-6 py-4 bg-[#F8FAFA] dark:bg-[#111A1E] border-t border-[#DCE7E7] dark:border-[#2A3C40] flex flex-col sm:flex-row items-center justify-between gap-4 shrink-0">
          <div>
            <div className="text-[10px] uppercase font-bold text-[#819396]">Total Calculated Price</div>
            <div className="flex items-baseline space-x-2">
              <span className="text-2xl font-black text-[#0799A6] dark:text-[#25B4BD]">₹{totalPrice}</span>
              {selectedDelivery.additionalFee > 0 && (
                <span className="text-[11px] text-[#52636A] dark:text-[#819396]">
                  (Includes {selectedDelivery.label} +₹{selectedDelivery.additionalFee})
                </span>
              )}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto justify-end">
            <button
              onClick={() => onOpenInquiry(service, 'inquiry')}
              className="px-4 py-2.5 rounded-xl bg-[#FDE2DE] hover:bg-[#F5A39A]/30 text-[#D9777F] dark:bg-[#533735] dark:text-[#F2A39A] border border-[#F5A39A]/30 font-bold text-xs"
            >
              Inquiry Now
            </button>

            <button
              onClick={() => onOpenInquiry(service, 'quote')}
              className="px-4 py-2.5 rounded-xl border border-[#0799A6]/40 text-[#0799A6] dark:text-[#25B4BD] hover:bg-[#DDF3F4]/50 font-bold text-xs"
            >
              Get Custom Quote
            </button>

            <a
              href={`https://wa.me/918527837527?text=Hello%20Annu%20Dhaneja,%20I%20want%20to%20order%20Graphic%20Design%3A%20${encodeURIComponent(service.title)}%20(${currentPackage.name})%20with%20${encodeURIComponent(selectedDelivery.label)}`}
              target="_blank"
              rel="noreferrer"
              className="p-2.5 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-white transition-colors"
              title="Chat on WhatsApp"
            >
              <MessageCircle className="w-4 h-4 fill-white" />
            </a>

            <button
              onClick={handleOrderNow}
              className="px-6 py-2.5 rounded-xl btn-primary-cta font-bold text-xs flex items-center space-x-2 shadow-sm transition-all active:scale-95"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Order Now</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
