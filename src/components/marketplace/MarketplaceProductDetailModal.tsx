import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  ShoppingCart,
  Zap,
  Download,
  Heart,
  Share2,
  CheckCircle,
  Star,
  Layers,
  Sparkles,
  ShieldCheck,
  Clock,
  Wand2,
  FileCheck,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Upload,
  Send,
  MessageSquare,
  Truck,
  Plus,
  Minus,
  Package,
} from 'lucide-react';
import { GurujiArtwork, CustomizationFieldConfig, ProductVariantItem, ProductReviewItem } from '../../types';
import { useCart } from '../../context/CartContext';

interface MarketplaceProductDetailModalProps {
  artwork: GurujiArtwork | null;
  isOpen: boolean;
  onClose: () => void;
  isFavorite?: boolean;
  onToggleFavorite?: (id: string) => void;
  onSelectRelated?: (artwork: GurujiArtwork) => void;
  allArtworks?: GurujiArtwork[];
  onInquiry?: (artwork: GurujiArtwork) => void;
  onBuyNowDirect?: (artwork: GurujiArtwork, variant?: ProductVariantItem | null, quantity?: number) => void;
}

export const MarketplaceProductDetailModal: React.FC<MarketplaceProductDetailModalProps> = ({
  artwork,
  isOpen,
  onClose,
  isFavorite = false,
  onToggleFavorite,
  onSelectRelated,
  allArtworks = [],
  onInquiry,
  onBuyNowDirect,
}) => {
  const { addItem } = useCart();
  const [selectedVariant, setSelectedVariant] = useState<ProductVariantItem | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [customizationValues, setCustomizationValues] = useState<Record<string, any>>({});
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [activeTab, setActiveTab] = useState<'details' | 'customization' | 'reviews' | 'faqs'>('details');
  const [isAddedToCart, setIsAddedToCart] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  // Review Form State
  const [reviewName, setReviewName] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const [reviewSuccessMessage, setReviewSuccessMessage] = useState('');

  // FAQs Accordion State
  const [expandedFaqIndex, setExpandedFaqIndex] = useState<number | null>(0);

  if (!isOpen || !artwork) return null;

  // Initialize or calculate price based on selected variant
  const currentPrice = selectedVariant ? selectedVariant.price : artwork.price;
  const currentOriginalPrice = selectedVariant && selectedVariant.originalPrice
    ? selectedVariant.originalPrice
    : artwork.originalPrice || (currentPrice > 0 ? currentPrice + 100 : 99);

  const isCustomizable = artwork.isCustomizable || artwork.productType === 'CUSTOMIZABLE_PRODUCT' || (artwork.customizationFields && artwork.customizationFields.length > 0);

  // Handle Customization Field Changes
  const handleCustomFieldChange = (fieldId: string, value: any) => {
    setCustomizationValues((prev) => ({
      ...prev,
      [fieldId]: value,
    }));
    // Clear validation error on change
    if (validationErrors[fieldId]) {
      setValidationErrors((prev) => {
        const next = { ...prev };
        delete next[fieldId];
        return next;
      });
    }
  };

  // Validate Required Customization Fields
  const validateCustomFields = (): boolean => {
    if (!artwork.customizationFields || artwork.customizationFields.length === 0) return true;
    const errors: Record<string, string> = {};

    for (const field of artwork.customizationFields) {
      if (field.required && !customizationValues[field.id]?.toString().trim()) {
        errors[field.id] = `${field.label} is required to customize this product.`;
      }
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const isPhysical = artwork.isPhysical !== undefined ? artwork.isPhysical : !artwork.isDigital;

  // Add to Cart
  const handleAddToCart = () => {
    if (isCustomizable && !validateCustomFields()) {
      setActiveTab('customization');
      return;
    }

    const uniqueId = isCustomizable && Object.keys(customizationValues).length > 0
      ? `${artwork.id}_custom_${Date.now()}`
      : selectedVariant
      ? `${artwork.id}_${selectedVariant.name}`
      : artwork.id;

    addItem({
      itemId: uniqueId,
      id: uniqueId,
      name: selectedVariant ? `${artwork.title} (${selectedVariant.label || selectedVariant.name})` : artwork.title,
      price: currentPrice,
      quantity: quantity > 0 ? quantity : 1,
      image: artwork.imageUrl,
      imageUrl: artwork.imageUrl,
      itemType: 'product',
      category: artwork.categoryName || 'Guruji Sacred Store',
      isDigital: !isPhysical,
      isPhysical: isPhysical,
      sku: artwork.sku || artwork.id,
      originalPrice: currentOriginalPrice,
      variantName: selectedVariant?.label || selectedVariant?.name,
      customizationData: Object.keys(customizationValues).length > 0 ? customizationValues : undefined,
    });

    setIsAddedToCart(true);
    setTimeout(() => setIsAddedToCart(false), 2500);
  };

  const handleBuyNow = () => {
    if (isCustomizable && !validateCustomFields()) {
      setActiveTab('customization');
      return;
    }

    handleAddToCart();

    if (onBuyNowDirect) {
      onBuyNowDirect(artwork, selectedVariant, quantity);
    }
  };

  const handleInquiry = () => {
    if (onInquiry) {
      onInquiry(artwork);
    }
  };

  // Direct Free Download
  const handleFreeDownload = async () => {
    try {
      setIsDownloading(true);
      const res = await fetch(`/api/guruji/artworks/${artwork.id}/download`, {
        method: 'POST',
      });
      const data = await res.json();
      if (data.downloadUrl) {
        // Trigger browser download
        const link = document.createElement('a');
        link.href = data.downloadUrl;
        link.download = `${artwork.slug || 'gurucraft-artwork'}.jpg`;
        link.target = '_blank';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        setDownloadSuccess(true);
        setTimeout(() => setDownloadSuccess(false), 4000);
      }
    } catch (err) {
      console.error('Download error:', err);
    } finally {
      setIsDownloading(false);
    }
  };

  // Submit Customer Review
  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewName.trim() || !reviewComment.trim()) return;

    try {
      setReviewSubmitting(true);
      const res = await fetch(`/api/guruji/artworks/${artwork.id}/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName: reviewName,
          rating: reviewRating,
          comment: reviewComment,
          verifiedPurchase: true,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setReviewSuccessMessage('Shukrana! Your review has been verified and posted.');
        setReviewName('');
        setReviewComment('');
        if (!artwork.reviews) artwork.reviews = [];
        artwork.reviews.unshift(data.review);
        artwork.averageRating = data.averageRating;
        artwork.ratingCount = data.ratingCount;
      }
    } catch (err) {
      console.error('Review submit error:', err);
    } finally {
      setReviewSubmitting(false);
    }
  };

  // Related artworks
  const relatedItems = allArtworks
    .filter((a) => a.id !== artwork.id && (a.category === artwork.category || a.categoryName === artwork.categoryName))
    .slice(0, 4);

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 overflow-y-auto bg-black/85 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.25 }}
          className="relative w-full max-w-5xl bg-neutral-900 border border-neutral-800 rounded-2xl shadow-2xl overflow-hidden my-auto max-h-[90vh] flex flex-col"
          id={`modal-detail-${artwork.id}`}
        >
          {/* Header Bar */}
          <div className="flex items-center justify-between px-5 py-3.5 border-b border-neutral-800 bg-neutral-950/80 sticky top-0 z-20 backdrop-blur-md">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/30 uppercase tracking-wider">
                {artwork.categoryName || 'Design'}
              </span>
              {artwork.isFree ? (
                <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                  <Download className="w-3 h-3" /> 100% Free
                </span>
              ) : null}
            </div>

            <div className="flex items-center gap-2">
              {onToggleFavorite && (
                <button
                  type="button"
                  onClick={() => onToggleFavorite(artwork.id)}
                  className={`p-2 rounded-full border transition-colors ${
                    isFavorite
                      ? 'bg-rose-500/20 border-rose-500 text-rose-400'
                      : 'bg-neutral-800 border-neutral-700 text-neutral-400 hover:text-white'
                  }`}
                  title="Favorite"
                >
                  <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
                </button>
              )}
              <button
                type="button"
                onClick={onClose}
                className="p-2 rounded-full bg-neutral-800 hover:bg-neutral-700 text-neutral-400 hover:text-white transition-colors"
                id="close-modal-btn"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Main Modal Body */}
          <div className="overflow-y-auto p-5 sm:p-6 md:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Column: Image Preview & File Meta */}
            <div className="lg:col-span-5 flex flex-col gap-4">
              <div className="relative w-full aspect-square rounded-xl overflow-hidden bg-neutral-950 border border-neutral-800 group shadow-inner">
                <img
                  src={artwork.highResUrl || artwork.imageUrl}
                  alt={artwork.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-contain p-2"
                />
                <div className="absolute top-3 left-3 bg-black/70 backdrop-blur-md px-2.5 py-1 rounded-lg text-xs font-medium text-neutral-300 border border-neutral-700 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>4K Studio Master</span>
                </div>
              </div>

              {/* Specifications Card */}
              <div className="p-4 rounded-xl bg-neutral-950/70 border border-neutral-800 flex flex-col gap-2.5 text-xs text-neutral-300">
                <h4 className="font-semibold text-neutral-200 uppercase tracking-wider text-[11px] text-amber-400/90 flex items-center gap-1.5">
                  <FileCheck className="w-3.5 h-3.5" />
                  {isPhysical ? 'Product Specifications & Holy Consecration' : 'Technical Specifications'}
                </h4>
                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div>
                    <span className="text-neutral-500 block">Product Type:</span>
                    <span className="font-medium text-amber-300">
                      {isPhysical ? 'Physical Consecrated Item' : 'Digital 4K Download'}
                    </span>
                  </div>
                  <div>
                    <span className="text-neutral-500 block">{isPhysical ? 'SKU Code:' : 'File Formats:'}</span>
                    <span className="font-medium text-neutral-200">
                      {isPhysical ? (artwork.sku || artwork.id) : (artwork.fileFormats?.join(', ') || 'PSD, PNG, JPG, PDF')}
                    </span>
                  </div>
                  <div>
                    <span className="text-neutral-500 block">{isPhysical ? 'Dimensions / Size:' : 'Dimensions:'}</span>
                    <span className="font-medium text-neutral-200">
                      {artwork.dimensions || (isPhysical ? 'Universal Sacred Size' : '3840 x 2160 px')}
                    </span>
                  </div>
                  <div>
                    <span className="text-neutral-500 block">{isPhysical ? 'Delivery & Dispatch:' : 'Resolution:'}</span>
                    <span className="font-medium text-emerald-400">
                      {isPhysical ? (artwork.turnaroundTime || 'Dispatch in 24 Hrs (3-5 Days)') : (artwork.resolution || '300 DPI Ultra HD')}
                    </span>
                  </div>
                </div>

                {isPhysical && (
                  <div className="pt-2 mt-1 border-t border-neutral-900 flex items-center gap-2 text-[10px] text-slate-400">
                    <Truck className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span>Free Sacred Temple Packaging • Free Delivery on orders ₹499+</span>
                  </div>
                )}
              </div>
            </div>

            {/* Right Column: Title, Pricing, Customization & Actions */}
            <div className="lg:col-span-7 flex flex-col justify-between gap-6">
              <div>
                {/* Title and Rating */}
                <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                  {artwork.title}
                </h2>
                {artwork.hindiTitle && (
                  <p className="text-amber-400/90 font-medium text-sm mt-0.5 font-serif">
                    {artwork.hindiTitle}
                  </p>
                )}

                {/* Rating & Social Proof */}
                <div className="flex items-center gap-4 mt-2.5 text-xs text-neutral-400">
                  <div className="flex items-center gap-1.5 text-amber-400">
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star key={s} className="w-3.5 h-3.5 fill-amber-400" />
                      ))}
                    </div>
                    <span className="font-bold text-neutral-200">{artwork.averageRating || 4.9}</span>
                    <span>({artwork.ratingCount || artwork.reviews?.length || 28} reviews)</span>
                  </div>
                  <div className="flex items-center gap-1 text-neutral-400">
                    <Download className="w-3.5 h-3.5 text-neutral-500" />
                    <span>{artwork.downloadsCount || 120}+ Downloads</span>
                  </div>
                </div>

                {/* Pricing Block */}
                <div className="mt-4 p-4 rounded-xl bg-neutral-950 border border-neutral-800/80 flex items-center justify-between">
                  <div>
                    <span className="text-xs text-neutral-400 block">Price</span>
                    {artwork.isFree ? (
                      <div className="flex items-baseline gap-2">
                        <span className="text-2xl font-extrabold text-emerald-400">₹0</span>
                        <span className="text-sm text-neutral-500 line-through">₹{currentOriginalPrice}</span>
                        <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-500/20 text-emerald-400">
                          100% Free Forever
                        </span>
                      </div>
                    ) : (
                      <div className="flex items-baseline gap-2">
                        <span className="text-2xl font-extrabold text-white">₹{currentPrice}</span>
                        {currentOriginalPrice > currentPrice && (
                          <span className="text-sm text-neutral-500 line-through">₹{currentOriginalPrice}</span>
                        )}
                        {artwork.discount && (
                          <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-amber-500 text-neutral-950">
                            Save {artwork.discount}%
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="text-right text-xs text-neutral-400">
                    <span className="text-emerald-400 flex items-center justify-end gap-1 font-medium">
                      <ShieldCheck className="w-4 h-4" /> Commercial License Included
                    </span>
                    <span className="text-[11px] text-neutral-500">Instant Download & WhatsApp Delivery</span>
                  </div>
                </div>

                {/* Variants Selector (if exists) */}
                {artwork.variants && artwork.variants.length > 0 && (
                  <div className="mt-4">
                    <label className="text-xs font-semibold text-neutral-300 block mb-2">
                      Select Format / License Option:
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {artwork.variants.map((v) => {
                        const isSelected = selectedVariant?.id === v.id || (!selectedVariant && v.isDefault);
                        return (
                          <button
                            key={v.id}
                            type="button"
                            onClick={() => setSelectedVariant(v)}
                            className={`p-2.5 rounded-lg border text-left flex items-center justify-between text-xs transition-all ${
                              isSelected
                                ? 'bg-amber-500/10 border-amber-500 text-neutral-100'
                                : 'bg-neutral-950 border-neutral-800 text-neutral-400 hover:border-neutral-700'
                            }`}
                          >
                            <div>
                              <span className="font-semibold block">{v.label || v.name}</span>
                              {v.description && <span className="text-[10px] text-neutral-500">{v.description}</span>}
                            </div>
                            <span className="font-bold text-amber-400 ml-2">₹{v.price}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Tab Navigation */}
                <div className="flex border-b border-neutral-800 mt-6 text-xs font-semibold">
                  <button
                    type="button"
                    onClick={() => setActiveTab('details')}
                    className={`pb-2.5 px-3 transition-colors border-b-2 ${
                      activeTab === 'details'
                        ? 'border-amber-500 text-amber-400'
                        : 'border-transparent text-neutral-400 hover:text-neutral-200'
                    }`}
                  >
                    What's Included
                  </button>

                  {isCustomizable && (
                    <button
                      type="button"
                      onClick={() => setActiveTab('customization')}
                      className={`pb-2.5 px-3 transition-colors border-b-2 flex items-center gap-1.5 ${
                        activeTab === 'customization'
                          ? 'border-purple-500 text-purple-400'
                          : 'border-transparent text-neutral-400 hover:text-neutral-200'
                      }`}
                    >
                      <Wand2 className="w-3.5 h-3.5" /> Customize Details
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => setActiveTab('reviews')}
                    className={`pb-2.5 px-3 transition-colors border-b-2 ${
                      activeTab === 'reviews'
                        ? 'border-amber-500 text-amber-400'
                        : 'border-transparent text-neutral-400 hover:text-neutral-200'
                    }`}
                  >
                    Reviews ({artwork.reviews?.length || 0})
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveTab('faqs')}
                    className={`pb-2.5 px-3 transition-colors border-b-2 ${
                      activeTab === 'faqs'
                        ? 'border-amber-500 text-amber-400'
                        : 'border-transparent text-neutral-400 hover:text-neutral-200'
                    }`}
                  >
                    FAQs
                  </button>
                </div>

                {/* Tab Content */}
                <div className="py-4">
                  {/* Details Tab */}
                  {activeTab === 'details' && (
                    <div className="space-y-4 text-xs text-neutral-300">
                      <p className="leading-relaxed text-neutral-300">
                        {artwork.description}
                      </p>

                      {artwork.blessingMessage && (
                        <div className="p-3 rounded-lg bg-amber-500/5 border border-amber-500/20 text-amber-300 italic font-serif">
                          "{artwork.blessingMessage}"
                        </div>
                      )}

                      <div>
                        <h4 className="font-semibold text-neutral-200 mb-2">Features & Included Assets:</h4>
                        <ul className="space-y-1.5">
                          {(artwork.whatsIncluded && artwork.whatsIncluded.length > 0
                            ? artwork.whatsIncluded
                            : [
                                'Master High-Resolution Printable 4K PNG/JPG Artwork',
                                'Layered Source Template (PSD / Canva Compatible)',
                                'Print-Ready PDF with CMYK Color Profiles for framing',
                                'Social Media Ready 1:1 and 9:16 Story formats',
                                'Lifetime Access & Re-download Guarantee',
                              ]
                          ).map((item, idx) => (
                            <li key={idx} className="flex items-start gap-2 text-neutral-300">
                              <CheckCircle className="w-3.5 h-3.5 text-emerald-400 mt-0.5 flex-shrink-0" />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}

                  {/* Customization Tab */}
                  {activeTab === 'customization' && isCustomizable && (
                    <div className="space-y-3">
                      <div className="p-3 rounded-lg bg-purple-500/10 border border-purple-500/30 text-purple-300 text-xs">
                        <p className="font-semibold">Personalize your design:</p>
                        <p className="text-[11px] text-purple-200/80 mt-0.5">
                          Enter your personalized details below. Our studio team will integrate your text, logo, or photo and deliver your finished proof within 24 hours.
                        </p>
                      </div>

                      {artwork.customizationFields && artwork.customizationFields.length > 0 ? (
                        artwork.customizationFields.map((field) => (
                          <div key={field.id} className="space-y-1">
                            <label className="text-xs font-medium text-neutral-200 flex items-center justify-between">
                              <span>
                                {field.label} {field.required && <span className="text-rose-400">*</span>}
                              </span>
                              {field.helperText && (
                                <span className="text-[10px] text-neutral-500">{field.helperText}</span>
                              )}
                            </label>

                            {field.type === 'textarea' ? (
                              <textarea
                                value={customizationValues[field.id] || ''}
                                onChange={(e) => handleCustomFieldChange(field.id, e.target.value)}
                                placeholder={field.placeholder || 'Enter details...'}
                                rows={3}
                                className={`w-full px-3 py-2 rounded-lg bg-neutral-950 border text-xs text-neutral-200 focus:outline-none focus:ring-1 ${
                                  validationErrors[field.id]
                                    ? 'border-rose-500 focus:ring-rose-500'
                                    : 'border-neutral-800 focus:ring-purple-500'
                                }`}
                              />
                            ) : field.type === 'select' ? (
                              <select
                                value={customizationValues[field.id] || ''}
                                onChange={(e) => handleCustomFieldChange(field.id, e.target.value)}
                                className="w-full px-3 py-2 rounded-lg bg-neutral-950 border border-neutral-800 text-xs text-neutral-200 focus:outline-none focus:ring-1 focus:ring-purple-500"
                              >
                                <option value="">Select option...</option>
                                {field.options?.map((opt) => (
                                  <option key={opt} value={opt}>
                                    {opt}
                                  </option>
                                ))}
                              </select>
                            ) : (
                              <input
                                type={field.type === 'phone' ? 'tel' : field.type === 'email' ? 'email' : 'text'}
                                value={customizationValues[field.id] || ''}
                                onChange={(e) => handleCustomFieldChange(field.id, e.target.value)}
                                placeholder={field.placeholder || 'Type here...'}
                                className={`w-full px-3 py-2 rounded-lg bg-neutral-950 border text-xs text-neutral-200 focus:outline-none focus:ring-1 ${
                                  validationErrors[field.id]
                                    ? 'border-rose-500 focus:ring-rose-500'
                                    : 'border-neutral-800 focus:ring-purple-500'
                                }`}
                              />
                            )}

                            {validationErrors[field.id] && (
                              <p className="text-[11px] text-rose-400">{validationErrors[field.id]}</p>
                            )}
                          </div>
                        ))
                      ) : (
                        // Default Fallback Customization Form
                        <div className="space-y-2.5">
                          <div>
                            <label className="text-xs font-medium text-neutral-300 block mb-1">
                              Your Name / Devotee Name <span className="text-rose-400">*</span>
                            </label>
                            <input
                              type="text"
                              value={customizationValues.devoteeName || ''}
                              onChange={(e) => handleCustomFieldChange('devoteeName', e.target.value)}
                              placeholder="e.g. Ramesh & Family"
                              className="w-full px-3 py-2 rounded-lg bg-neutral-950 border border-neutral-800 text-xs text-neutral-200"
                            />
                          </div>
                          <div>
                            <label className="text-xs font-medium text-neutral-300 block mb-1">
                              WhatsApp Phone Number <span className="text-rose-400">*</span>
                            </label>
                            <input
                              type="tel"
                              value={customizationValues.phone || ''}
                              onChange={(e) => handleCustomFieldChange('phone', e.target.value)}
                              placeholder="+91 98000 00000"
                              className="w-full px-3 py-2 rounded-lg bg-neutral-950 border border-neutral-800 text-xs text-neutral-200"
                            />
                          </div>
                          <div>
                            <label className="text-xs font-medium text-neutral-300 block mb-1">
                              Custom Blessing Mantra or Personal Text
                            </label>
                            <textarea
                              value={customizationValues.customText || ''}
                              onChange={(e) => handleCustomFieldChange('customText', e.target.value)}
                              placeholder="Write your custom text or blessing prayer..."
                              rows={2}
                              className="w-full px-3 py-2 rounded-lg bg-neutral-950 border border-neutral-800 text-xs text-neutral-200"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Reviews Tab */}
                  {activeTab === 'reviews' && (
                    <div className="space-y-4">
                      {/* Write Review Form */}
                      <form onSubmit={handleSubmitReview} className="p-3.5 rounded-xl bg-neutral-950 border border-neutral-800 space-y-2.5">
                        <h4 className="text-xs font-bold text-neutral-200">Share Your Experience</h4>
                        {reviewSuccessMessage && (
                          <div className="p-2 rounded bg-emerald-500/20 text-emerald-400 text-xs">
                            {reviewSuccessMessage}
                          </div>
                        )}
                        <div className="grid grid-cols-2 gap-2">
                          <input
                            type="text"
                            placeholder="Your Name"
                            value={reviewName}
                            onChange={(e) => setReviewName(e.target.value)}
                            required
                            className="px-3 py-1.5 rounded-lg bg-neutral-900 border border-neutral-700 text-xs text-white"
                          />
                          <div className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-neutral-900 border border-neutral-700">
                            <span className="text-xs text-neutral-400">Rating:</span>
                            {[1, 2, 3, 4, 5].map((star) => (
                              <button
                                key={star}
                                type="button"
                                onClick={() => setReviewRating(star)}
                                className="p-0.5 focus:outline-none"
                              >
                                <Star
                                  className={`w-3.5 h-3.5 ${
                                    star <= reviewRating ? 'fill-amber-400 text-amber-400' : 'text-neutral-600'
                                  }`}
                                />
                              </button>
                            ))}
                          </div>
                        </div>
                        <textarea
                          placeholder="Write your review or blessing feedback..."
                          value={reviewComment}
                          onChange={(e) => setReviewComment(e.target.value)}
                          required
                          rows={2}
                          className="w-full px-3 py-1.5 rounded-lg bg-neutral-900 border border-neutral-700 text-xs text-white"
                        />
                        <button
                          type="submit"
                          disabled={reviewSubmitting}
                          className="px-4 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-neutral-950 text-xs font-bold flex items-center gap-1.5 transition-colors disabled:opacity-50"
                        >
                          <Send className="w-3.5 h-3.5" /> Submit Review
                        </button>
                      </form>

                      {/* Reviews List */}
                      <div className="space-y-3 max-h-56 overflow-y-auto">
                        {artwork.reviews && artwork.reviews.length > 0 ? (
                          artwork.reviews.map((rev) => (
                            <div key={rev.id} className="p-3 rounded-lg bg-neutral-950/60 border border-neutral-800/80 text-xs">
                              <div className="flex items-center justify-between mb-1">
                                <div className="flex items-center gap-1.5">
                                  <span className="font-semibold text-neutral-200">{rev.customerName}</span>
                                  {rev.verifiedPurchase && (
                                    <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">
                                      Verified Devotee
                                    </span>
                                  )}
                                </div>
                                <span className="text-[10px] text-neutral-500">{rev.date || 'Recent'}</span>
                              </div>
                              <div className="flex text-amber-400 mb-1">
                                {Array.from({ length: rev.rating }).map((_, i) => (
                                  <Star key={i} className="w-3 h-3 fill-amber-400" />
                                ))}
                              </div>
                              <p className="text-neutral-300 leading-relaxed">{rev.comment}</p>
                            </div>
                          ))
                        ) : (
                          <p className="text-neutral-500 text-xs italic">
                            No reviews submitted yet. Be the first to share your experience!
                          </p>
                        )}
                      </div>
                    </div>
                  )}

                  {/* FAQs Tab */}
                  {activeTab === 'faqs' && (
                    <div className="space-y-2 text-xs">
                      {(artwork.faqs && artwork.faqs.length > 0
                        ? artwork.faqs
                        : [
                            {
                              question: 'How will I receive the digital design file after checkout?',
                              answer:
                                'Immediately after payment confirmation, you receive a direct 4K high-resolution download link in your browser and your registered email. You can also re-download it anytime from your GurucraftPro User Dashboard.',
                            },
                            {
                              question: 'Can I print this artwork on canvas or photo paper for my Mandir?',
                              answer:
                                'Yes! All digital artworks are mastered in 300 DPI CMYK ultra-sharp resolution, suitable for printing in A4, A3, A2, and large 24x36 inch canvas frames without pixelation.',
                            },
                            {
                              question: 'How do customized designs work?',
                              answer:
                                'Once you enter your personalization details and complete your order, Annu Dhaneja and our design studio craft your proof and send it via WhatsApp/Email within 24 hours for your approval before final dispatch.',
                            },
                          ]
                      ).map((faq, idx) => (
                        <div key={idx} className="rounded-lg bg-neutral-950 border border-neutral-800 overflow-hidden">
                          <button
                            type="button"
                            onClick={() => setExpandedFaqIndex(expandedFaqIndex === idx ? null : idx)}
                            className="w-full p-3 text-left font-medium text-neutral-200 flex items-center justify-between hover:bg-neutral-800/40 transition-colors"
                          >
                            <span>{faq.question}</span>
                            {expandedFaqIndex === idx ? (
                              <ChevronUp className="w-4 h-4 text-amber-400" />
                            ) : (
                              <ChevronDown className="w-4 h-4 text-neutral-500" />
                            )}
                          </button>
                          {expandedFaqIndex === idx && (
                            <div className="px-3 pb-3 text-neutral-400 leading-relaxed border-t border-neutral-800/60 pt-2">
                              {faq.answer}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons Footer */}
              <div className="pt-4 border-t border-neutral-800 space-y-3">
                {artwork.isFree ? (
                  <button
                    type="button"
                    onClick={handleFreeDownload}
                    disabled={isDownloading}
                    className="w-full py-3 px-6 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 transition-all active:scale-98 disabled:opacity-50"
                    id="free-download-main-btn"
                  >
                    <Download className="w-4 h-4" />
                    {isDownloading ? 'Preparing 4K Download...' : downloadSuccess ? 'Download Started!' : 'Download 4K Free Now'}
                  </button>
                ) : (
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
                    {/* Quantity Stepper */}
                    <div className="flex items-center justify-center bg-neutral-900 border border-neutral-700 rounded-xl p-1 shrink-0">
                      <button
                        type="button"
                        onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
                        title="Decrease quantity"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="w-8 text-center text-xs font-black text-white">{quantity}</span>
                      <button
                        type="button"
                        onClick={() => setQuantity((q) => q + 1)}
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
                        title="Increase quantity"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Add to Cart */}
                    <button
                      type="button"
                      onClick={handleAddToCart}
                      className={`flex-1 py-3 px-3.5 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5 border transition-all active:scale-98 ${
                        isAddedToCart
                          ? 'bg-emerald-600 border-emerald-500 text-white'
                          : 'bg-neutral-800 hover:bg-neutral-700 border-neutral-700 text-white'
                      }`}
                      id="modal-add-to-cart-btn"
                    >
                      {isAddedToCart ? (
                        <>
                          <CheckCircle className="w-4 h-4 text-white" /> Added ({quantity})!
                        </>
                      ) : (
                        <>
                          <ShoppingCart className="w-4 h-4 text-amber-400" />
                          <span>Add to Cart (₹{currentPrice * quantity})</span>
                        </>
                      )}
                    </button>

                    {/* Buy Now Direct */}
                    <button
                      type="button"
                      onClick={handleBuyNow}
                      className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-neutral-950 font-black text-xs sm:text-sm flex items-center justify-center gap-1.5 shadow-lg shadow-amber-500/20 transition-all active:scale-98"
                      id="modal-buy-now-btn"
                    >
                      <Zap className="w-4 h-4 fill-current" />
                      <span>Buy Now</span>
                    </button>

                    {/* Inquiry Now Button */}
                    <button
                      type="button"
                      onClick={handleInquiry}
                      className="py-3 px-3.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-amber-400 hover:text-amber-300 border border-amber-500/30 font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm transition-all active:scale-98 shrink-0"
                      title="Direct Studio Inquiry / Custom Order"
                      id="modal-inquire-btn"
                    >
                      <MessageSquare className="w-4 h-4" />
                      <span>Inquiry Now</span>
                    </button>
                  </div>
                )}

                <div className="flex items-center justify-between text-[10px] text-neutral-500 px-1 pt-1">
                  <span>🔒 256-Bit SSL Razorpay Encrypted</span>
                  <span>{isPhysical ? '📦 Consecrated Temple Dispatch' : '⚡ Instant Digital Access'}</span>
                  <span>✨ 100% Satisfaction Assured</span>
                </div>
              </div>
            </div>
          </div>

          {/* Related Items Row (if exists) */}
          {relatedItems.length > 0 && onSelectRelated && (
            <div className="border-t border-neutral-800 bg-neutral-950/60 p-5">
              <h4 className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-3">
                Related Designs from {artwork.categoryName}
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {relatedItems.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => onSelectRelated(item)}
                    className="group flex items-center gap-2.5 p-2 rounded-xl bg-neutral-900 border border-neutral-800 hover:border-amber-500/40 cursor-pointer transition-all"
                  >
                    <img
                      src={item.thumbnailUrl || item.imageUrl}
                      alt={item.title}
                      referrerPolicy="no-referrer"
                      className="w-12 h-12 rounded-lg object-cover bg-neutral-950"
                    />
                    <div className="min-w-0">
                      <p className="text-xs font-medium text-neutral-200 group-hover:text-amber-400 truncate">
                        {item.title}
                      </p>
                      <p className="text-[11px] font-bold text-amber-400">
                        {item.isFree ? 'FREE' : `₹${item.price}`}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
