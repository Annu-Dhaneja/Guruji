import React, { useState } from 'react';
import {
  Save,
  X,
  Upload,
  Plus,
  Trash2,
  Sparkles,
  Package,
  Layers,
  FileText,
  DollarSign,
  Tag,
  Clock,
  HardDrive,
  ShieldCheck,
} from 'lucide-react';
import { GurujiArtwork, CustomizationFieldConfig, ProductVariantItem, ProductTypeCategory, GurujiCategoryItem } from '../../../../types';

interface MarketplaceProductEditModalProps {
  product: GurujiArtwork | null;
  categories: GurujiCategoryItem[];
  isOpen: boolean;
  onClose: () => void;
  onSave: (productData: Partial<GurujiArtwork>) => Promise<void>;
}

export const MarketplaceProductEditModal: React.FC<MarketplaceProductEditModalProps> = ({
  product,
  categories,
  isOpen,
  onClose,
  onSave,
}) => {
  const [activeTab, setActiveTab] = useState<'basic' | 'media' | 'pricing' | 'variants' | 'customization' | 'features'>('basic');
  const [saving, setSaving] = useState(false);

  // Form State
  const [title, setTitle] = useState(product?.title || '');
  const [hindiTitle, setHindiTitle] = useState(product?.hindiTitle || '');
  const [category, setCategory] = useState(product?.category || 'bade-mandir');
  const [productType, setProductType] = useState<ProductTypeCategory>(product?.productType || 'DIGITAL_PRODUCT');
  const [description, setDescription] = useState(product?.description || '');
  const [shortDescription, setShortDescription] = useState(product?.shortDescription || '');
  const [blessingMessage, setBlessingMessage] = useState(product?.blessingMessage || '');
  const [sourceAttribution, setSourceAttribution] = useState(product?.sourceAttribution || 'Original Digital Art by Annu Dhaneja Creative Studio');

  // Media
  const [imageUrl, setImageUrl] = useState(product?.imageUrl || '');
  const [highResUrl, setHighResUrl] = useState(product?.highResUrl || '');
  const [previewUrl, setPreviewUrl] = useState(product?.previewUrl || '');

  // Pricing & Specs
  const [price, setPrice] = useState(product?.price || 0);
  const [originalPrice, setOriginalPrice] = useState(product?.originalPrice || 0);
  const [isFree, setIsFree] = useState(product?.isFree ?? false);
  const [fileFormat, setFileFormat] = useState(product?.fileFormat || 'PSD + 4K PNG + Print PDF');
  const [resolution, setResolution] = useState(product?.resolution || '300 DPI Ultra HD');
  const [dimensions, setDimensions] = useState(product?.dimensions || '1080 × 1350 px (4:5)');
  const [fileSize, setFileSize] = useState(product?.fileSize || '45 MB (PSD + Assets)');
  const [licenseType, setLicenseType] = useState<'Personal Use' | 'Commercial Use' | 'Extended Commercial'>(
    product?.licenseType || 'Commercial Use'
  );
  const [deliveryTime, setDeliveryTime] = useState(product?.deliveryTime || 'Instant Download');

  // Flags
  const [status, setStatus] = useState<'PUBLISHED' | 'DRAFT' | 'ARCHIVED'>(product?.status || 'PUBLISHED');
  const [isFeatured, setIsFeatured] = useState(product?.isFeatured || false);
  const [isTrending, setIsTrending] = useState(product?.isTrending || false);
  const [isNew, setIsNew] = useState(product?.isNew || false);

  // Features list
  const [featuresList, setFeaturesList] = useState<string[]>(
    product?.featuresList && product.featuresList.length > 0
      ? product.featuresList
      : [
          'High-Resolution 4K Ultra HD Source Files',
          'Organized Named PSD Layers & Smart Objects',
          'Print-Ready 300 DPI Color Calibrated',
          'Free Lifetime Download Access',
        ]
  );
  const [newFeatureText, setNewFeatureText] = useState('');

  // Variants
  const [variants, setVariants] = useState<ProductVariantItem[]>(
    product?.variants || [
      { id: 'var-1', name: 'Standard 4K PNG', label: 'Single Digital Wallpaper (4K)', price: price || 0, format: 'PNG' },
      { id: 'var-2', name: 'Layered PSD + PNG', label: 'Full Source Files (PSD + PNG)', price: (price || 0) + 100, format: 'PSD+PNG' },
      { id: 'var-3', name: 'Full Commercial License', label: 'Commercial Print & Resale License', price: (price || 0) + 300, format: 'ALL' },
    ]
  );

  // Customization Fields
  const [customizationFields, setCustomizationFields] = useState<CustomizationFieldConfig[]>(
    product?.customizationFields || []
  );

  if (!isOpen) return null;

  const handleAddFeature = () => {
    if (newFeatureText.trim()) {
      setFeaturesList([...featuresList, newFeatureText.trim()]);
      setNewFeatureText('');
    }
  };

  const handleRemoveFeature = (index: number) => {
    setFeaturesList(featuresList.filter((_, i) => i !== index));
  };

  const handleAddVariant = () => {
    const newVariant: ProductVariantItem = {
      id: `var-${Date.now()}`,
      name: 'Custom Format Option',
      label: 'e.g. A3 Print Ready PDF',
      price: price || 99,
      format: 'PDF',
    };
    setVariants([...variants, newVariant]);
  };

  const handleUpdateVariant = (index: number, updated: Partial<ProductVariantItem>) => {
    const next = [...variants];
    next[index] = { ...next[index], ...updated };
    setVariants(next);
  };

  const handleRemoveVariant = (index: number) => {
    setVariants(variants.filter((_, i) => i !== index));
  };

  const handleAddCustomField = () => {
    const newField: CustomizationFieldConfig = {
      id: `field-${Date.now()}`,
      name: `custom_field_${customizationFields.length + 1}`,
      label: 'Devotee / Family Name',
      type: 'text',
      required: true,
      placeholder: 'Enter name to be printed...',
      helpText: 'This will be custom-crafted onto the final design.',
    };
    setCustomizationFields([...customizationFields, newField]);
  };

  const handleUpdateCustomField = (index: number, updated: Partial<CustomizationFieldConfig>) => {
    const next = [...customizationFields];
    next[index] = { ...next[index], ...updated };
    setCustomizationFields(next);
  };

  const handleRemoveCustomField = (index: number) => {
    setCustomizationFields(customizationFields.filter((_, i) => i !== index));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, setter: (val: string) => void) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        if (ev.target?.result) setter(ev.target.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const matchedCategory = categories.find(
      (c) => c.slug === category || c.id === category || c.name.toLowerCase() === category.toLowerCase()
    );

    const payload: Partial<GurujiArtwork> = {
      title,
      hindiTitle,
      category,
      categoryName: matchedCategory ? matchedCategory.name : category,
      productType,
      description,
      shortDescription,
      blessingMessage,
      sourceAttribution,
      imageUrl,
      highResUrl: highResUrl || imageUrl,
      previewUrl: previewUrl || imageUrl,
      price: isFree ? 0 : Number(price),
      originalPrice: Number(originalPrice) || Number(price) * 2,
      isFree: Boolean(isFree),
      fileFormat,
      resolution,
      dimensions,
      fileSize,
      licenseType,
      deliveryTime,
      status,
      isFeatured,
      isTrending,
      isNew,
      isCustomizable: productType === 'CUSTOMIZABLE_PRODUCT' || customizationFields.length > 0,
      isDownloadable: productType === 'DIGITAL_PRODUCT' || isFree,
      featuresList,
      variants,
      customizationFields,
    };

    try {
      await onSave(payload);
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#102A36]/60 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="max-w-4xl w-full bg-[#FFFFFF] dark:bg-[#141D21] border border-[#E3ECEE] dark:border-[#243338] rounded-3xl p-6 space-y-5 shadow-2xl my-8 max-h-[92vh] flex flex-col text-xs text-[#102A36] dark:text-[#F4F8F8]">
        
        {/* Modal Header */}
        <div className="flex justify-between items-center border-b border-[#E3ECEE] dark:border-[#243338] pb-4 shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-[#DDF3F4] border border-[#0799A6]/30 flex items-center justify-center text-[#0799A6]">
              <Package className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-[#102A36] dark:text-[#F4F8F8]">
                {product?.id ? 'Edit Guruji Artwork & Product' : 'Create New Guruji Spiritual Product / Service'}
              </h3>
              <p className="text-[11px] text-[#52636A] dark:text-[#B7C6C8]">
                Configure commercial details, download assets, dynamic customization fields, and licensing tiers.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-[#F8FAFA] dark:bg-[#1E2B30] hover:bg-[#DDF3F4] text-[#52636A] hover:text-[#087581] border border-[#E3ECEE] dark:border-[#243338] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Sub-Tabs */}
        <div className="flex items-center space-x-1 overflow-x-auto border-b border-[#E3ECEE] dark:border-[#243338] pb-2 shrink-0">
          {[
            { id: 'basic', label: '1. Basic Info & Category', icon: FileText },
            { id: 'media', label: '2. Media & Files', icon: Layers },
            { id: 'pricing', label: '3. Pricing & Specs', icon: DollarSign },
            { id: 'variants', label: `4. Variants (${variants.length})`, icon: Tag },
            { id: 'customization', label: `5. Custom Fields (${customizationFields.length})`, icon: Sparkles },
            { id: 'features', label: `6. Features (${featuresList.length})`, icon: ShieldCheck },
          ].map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-xl font-bold whitespace-nowrap transition-all ${
                  active
                    ? 'bg-[#0799A6] text-white shadow-xs'
                    : 'bg-[#F8FAFA] dark:bg-[#1E2B30] text-[#52636A] dark:text-[#B7C6C8] border border-[#E3ECEE] dark:border-[#243338] hover:bg-[#DDF3F4] hover:text-[#087581]'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Modal Form Body */}
        <form id="marketplace-product-form" onSubmit={handleSubmit} className="flex-1 overflow-y-auto space-y-4 pr-1">
          
          {/* TAB 1: BASIC INFO */}
          {activeTab === 'basic' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Product Title *</label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Royal Bade Mandir Golden Chola 4K Wallpaper"
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white outline-none focus:border-amber-500 font-bold"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Hindi Title (हिंदी शीर्षक)</label>
                  <input
                    type="text"
                    value={hindiTitle}
                    onChange={(e) => setHindiTitle(e.target.value)}
                    placeholder="e.g. बड़े मंदिर पावन दरबार स्वरूप"
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white outline-none focus:border-amber-500 font-serif"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Product Type Category *</label>
                  <select
                    value={productType}
                    onChange={(e) => setProductType(e.target.value as ProductTypeCategory)}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-amber-300 font-bold outline-none focus:border-amber-500"
                  >
                    <option value="DIGITAL_PRODUCT">📥 Digital Product (Instant HD/4K/PSD Download)</option>
                    <option value="CUSTOMIZABLE_PRODUCT">🎨 Customizable Product (Personalized Name/Blessing/Frame)</option>
                    <option value="SERVICE">⚡ Design Service (Custom Art Studio / Mandir 3D Rendering)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Sacred Collection / Category *</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white outline-none focus:border-amber-500"
                  >
                    {categories.map((c) => (
                      <option key={c.id || c.slug} value={c.slug}>
                        {c.icon || '🪷'} {c.name} ({c.hindiName})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Short Summary / Tagline</label>
                <input
                  type="text"
                  value={shortDescription}
                  onChange={(e) => setShortDescription(e.target.value)}
                  placeholder="e.g. Masterpiece 4K divine wallpaper with PSD layered files & commercial license."
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Detailed Product Description</label>
                <textarea
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe the divine artwork, historical authenticity, layer structure, color palette, and devotee benefits..."
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white outline-none focus:border-amber-500 resize-none leading-relaxed"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Blessing Vachan / Sacred Quote</label>
                  <input
                    type="text"
                    value={blessingMessage}
                    onChange={(e) => setBlessingMessage(e.target.value)}
                    placeholder="e.g. कल्याण किता, सब दुःख दूर किते • शुकराना गुरुजी"
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-amber-200 font-serif outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Artist / Source Attribution</label>
                  <input
                    type="text"
                    value={sourceAttribution}
                    onChange={(e) => setSourceAttribution(e.target.value)}
                    placeholder="e.g. Original Digital Art by Annu Dhaneja Creative Studio"
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              {/* Status and Flags */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                <span className="text-slate-300 font-bold block">Visibility & Badges:</span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isFeatured}
                      onChange={(e) => setIsFeatured(e.target.checked)}
                      className="w-4 h-4 rounded text-amber-500 focus:ring-amber-400 bg-slate-900 border-slate-700"
                    />
                    <span className="text-slate-300 font-semibold">⭐ Featured</span>
                  </label>
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isTrending}
                      onChange={(e) => setIsTrending(e.target.checked)}
                      className="w-4 h-4 rounded text-amber-500 focus:ring-amber-400 bg-slate-900 border-slate-700"
                    />
                    <span className="text-slate-300 font-semibold">🔥 Trending</span>
                  </label>
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isNew}
                      onChange={(e) => setIsNew(e.target.checked)}
                      className="w-4 h-4 rounded text-amber-500 focus:ring-amber-400 bg-slate-900 border-slate-700"
                    />
                    <span className="text-slate-300 font-semibold">✨ New Launch</span>
                  </label>
                  <div>
                    <select
                      value={status}
                      onChange={(e: any) => setStatus(e.target.value)}
                      className="px-3 py-1 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs"
                    >
                      <option value="PUBLISHED">● PUBLISHED</option>
                      <option value="DRAFT">○ DRAFT</option>
                      <option value="ARCHIVED">✕ ARCHIVED</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: MEDIA & FILES */}
          {activeTab === 'media' && (
            <div className="space-y-4">
              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Main Showcase Display Image *</label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    required
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    placeholder="https://images.unsplash.com/..."
                    className="flex-1 px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white outline-none focus:border-amber-500"
                  />
                  <label className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 cursor-pointer flex items-center space-x-1.5 border border-slate-700 font-bold shrink-0">
                    <Upload className="w-3.5 h-3.5 text-amber-400" />
                    <span>Upload Image</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleFileUpload(e, setImageUrl)}
                    />
                  </label>
                </div>
              </div>

              {imageUrl && (
                <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 flex items-center space-x-4">
                  <img src={imageUrl} alt="Main Preview" className="w-20 h-20 rounded-xl object-cover border border-amber-500/40" />
                  <div>
                    <span className="text-[10px] text-amber-400 font-bold uppercase">Main Preview Banner</span>
                    <p className="text-xs font-bold text-white line-clamp-1">{title || 'Sample Artwork'}</p>
                    <p className="text-[11px] text-slate-400">Aspect Ratio: {dimensions}</p>
                  </div>
                </div>
              )}

              <div>
                <label className="block text-slate-400 mb-1 font-semibold">High-Res / Secure Download Asset URL (Provided after purchase)</label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={highResUrl}
                    onChange={(e) => setHighResUrl(e.target.value)}
                    placeholder="https://drive.google.com/... or https://res.cloudinary.com/..."
                    className="flex-1 px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white outline-none focus:border-amber-500"
                  />
                  <label className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 cursor-pointer flex items-center space-x-1.5 border border-slate-700 font-bold shrink-0">
                    <Upload className="w-3.5 h-3.5 text-amber-400" />
                    <span>Upload Master</span>
                    <input
                      type="file"
                      accept="image/*,.zip,.psd,.pdf"
                      className="hidden"
                      onChange={(e) => handleFileUpload(e, setHighResUrl)}
                    />
                  </label>
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  When a customer completes purchase or downloads a free asset, this is the exact master link generated securely for them.
                </p>
              </div>
            </div>
          )}

          {/* TAB 3: PRICING & SPECS */}
          {activeTab === 'pricing' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-black text-amber-300">Free Design Vault Collection</h4>
                  <p className="text-[11px] text-slate-300">Mark this product as free for all devotees (0 INR Instant Download).</p>
                </div>
                <label className="flex items-center space-x-2 cursor-pointer bg-slate-950 px-3 py-1.5 rounded-xl border border-amber-500/40">
                  <input
                    type="checkbox"
                    checked={isFree}
                    onChange={(e) => {
                      setIsFree(e.target.checked);
                      if (e.target.checked) setPrice(0);
                    }}
                    className="w-4 h-4 rounded text-amber-500 focus:ring-amber-400"
                  />
                  <span className="text-xs font-bold text-amber-300">Is 100% Free</span>
                </label>
              </div>

              {!isFree && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-400 mb-1 font-semibold">Store Price (₹ INR) *</label>
                    <input
                      type="number"
                      required
                      min={0}
                      value={price}
                      onChange={(e) => setPrice(Number(e.target.value))}
                      placeholder="e.g. 49, 99, 199, 499"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-amber-400 font-black text-sm outline-none focus:border-amber-500"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 mb-1 font-semibold">Original / MRP Price (₹ INR)</label>
                    <input
                      type="number"
                      min={0}
                      value={originalPrice}
                      onChange={(e) => setOriginalPrice(Number(e.target.value))}
                      placeholder="e.g. 199, 499, 999"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 font-bold outline-none focus:border-amber-500"
                    />
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">License Type</label>
                  <select
                    value={licenseType}
                    onChange={(e: any) => setLicenseType(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white outline-none focus:border-amber-500"
                  >
                    <option value="Personal Use">Personal Use (Home / Wallpaper)</option>
                    <option value="Commercial Use">Commercial Use (Print & Resale)</option>
                    <option value="Extended Commercial">Extended Commercial (Unlimited Client Use)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Delivery Time</label>
                  <input
                    type="text"
                    value={deliveryTime}
                    onChange={(e) => setDeliveryTime(e.target.value)}
                    placeholder="e.g. Instant Download or 2-4 Hours"
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">File Format</label>
                  <input
                    type="text"
                    value={fileFormat}
                    onChange={(e) => setFileFormat(e.target.value)}
                    placeholder="e.g. PSD + 4K PNG + Print PDF"
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Dimensions</label>
                  <input
                    type="text"
                    value={dimensions}
                    onChange={(e) => setDimensions(e.target.value)}
                    placeholder="e.g. 1080 × 1350 px (4:5)"
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Resolution</label>
                  <input
                    type="text"
                    value={resolution}
                    onChange={(e) => setResolution(e.target.value)}
                    placeholder="e.g. 300 DPI Ultra HD"
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">File Download Size</label>
                  <input
                    type="text"
                    value={fileSize}
                    onChange={(e) => setFileSize(e.target.value)}
                    placeholder="e.g. 45 MB (PSD + Assets)"
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white outline-none focus:border-amber-500"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: VARIANTS */}
          {activeTab === 'variants' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="text-xs font-bold text-white">Product Format & Licensing Tiers</h4>
                  <p className="text-[11px] text-slate-400">Add different file resolutions, source formats, or licensing levels for checkout.</p>
                </div>
                <button
                  type="button"
                  onClick={handleAddVariant}
                  className="px-3 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 font-bold flex items-center space-x-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Variant</span>
                </button>
              </div>

              <div className="space-y-2.5">
                {variants.map((v, i) => (
                  <div key={v.id || i} className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 grid grid-cols-12 gap-3 items-center">
                    <div className="col-span-4">
                      <label className="text-[10px] text-slate-400 font-semibold block mb-0.5">Variant Name</label>
                      <input
                        type="text"
                        value={v.name}
                        onChange={(e) => handleUpdateVariant(i, { name: e.target.value })}
                        className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs font-bold"
                      />
                    </div>
                    <div className="col-span-4">
                      <label className="text-[10px] text-slate-400 font-semibold block mb-0.5">Label / Subtitle</label>
                      <input
                        type="text"
                        value={v.label}
                        onChange={(e) => handleUpdateVariant(i, { label: e.target.value })}
                        className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-slate-300 text-xs"
                      />
                    </div>
                    <div className="col-span-3">
                      <label className="text-[10px] text-slate-400 font-semibold block mb-0.5">Price (₹)</label>
                      <input
                        type="number"
                        min={0}
                        value={v.price}
                        onChange={(e) => handleUpdateVariant(i, { price: Number(e.target.value) })}
                        className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-amber-400 font-black text-xs"
                      />
                    </div>
                    <div className="col-span-1 text-right pt-4">
                      <button
                        type="button"
                        onClick={() => handleRemoveVariant(i)}
                        className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400"
                        title="Delete variant"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: CUSTOMIZATION BUILDER */}
          {activeTab === 'customization' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="text-xs font-bold text-white">Dynamic Devotee Customization Fields</h4>
                  <p className="text-[11px] text-slate-400">Configure text inputs, image uploads, or blessing selections required before purchase.</p>
                </div>
                <button
                  type="button"
                  onClick={handleAddCustomField}
                  className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold flex items-center space-x-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Input Field</span>
                </button>
              </div>

              {customizationFields.length === 0 ? (
                <div className="p-8 rounded-2xl bg-slate-950 border border-dashed border-slate-800 text-center space-y-2">
                  <Sparkles className="w-6 h-6 text-slate-600 mx-auto" />
                  <p className="text-xs text-slate-400">No customization fields yet. Click "Add Input Field" above if this design is personalized.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {customizationFields.map((f, i) => (
                    <div key={f.id || i} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div>
                          <label className="text-[10px] text-slate-400 font-semibold block mb-0.5">Field Label *</label>
                          <input
                            type="text"
                            value={f.label}
                            onChange={(e) => handleUpdateCustomField(i, { label: e.target.value })}
                            className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs font-bold"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] text-slate-400 font-semibold block mb-0.5">Field Type *</label>
                          <select
                            value={f.type}
                            onChange={(e: any) => handleUpdateCustomField(i, { type: e.target.value })}
                            className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs"
                          >
                            <option value="text">Single Line Text</option>
                            <option value="textarea">Multi-line Text / Blessing</option>
                            <option value="image">Devotee Photo Upload</option>
                            <option value="phone">Phone / WhatsApp Number</option>
                            <option value="dropdown">Dropdown Options</option>
                          </select>
                        </div>
                        <div className="flex items-center justify-between pt-4">
                          <label className="flex items-center space-x-2 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={f.required}
                              onChange={(e) => handleUpdateCustomField(i, { required: e.target.checked })}
                              className="w-4 h-4 rounded text-amber-500 focus:ring-amber-400"
                            />
                            <span className="text-xs font-bold text-slate-300">Mandatory</span>
                          </label>
                          <button
                            type="button"
                            onClick={() => handleRemoveCustomField(i)}
                            className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      <div>
                        <label className="text-[10px] text-slate-400 font-semibold block mb-0.5">Placeholder / Helper Note</label>
                        <input
                          type="text"
                          value={f.placeholder || ''}
                          onChange={(e) => handleUpdateCustomField(i, { placeholder: e.target.value })}
                          placeholder="e.g. Enter name to be custom printed on the frame..."
                          className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-slate-300 text-xs"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 6: FEATURES */}
          {activeTab === 'features' && (
            <div className="space-y-4">
              <div>
                <h4 className="text-xs font-bold text-white mb-1">What's Included & Value Highlights</h4>
                <p className="text-[11px] text-slate-400">These bullet points appear on the marketplace card and detailed modal.</p>
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={newFeatureText}
                  onChange={(e) => setNewFeatureText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddFeature();
                    }
                  }}
                  placeholder="e.g. Lifetime Cloud Access with 4K UHD download link"
                  className="flex-1 px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white outline-none focus:border-amber-500"
                />
                <button
                  type="button"
                  onClick={handleAddFeature}
                  className="px-4 py-2 rounded-xl bg-amber-500 text-slate-950 font-bold flex items-center space-x-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add</span>
                </button>
              </div>

              <div className="space-y-2">
                {featuresList.map((feat, i) => (
                  <div key={i} className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                    <span className="text-slate-300">✓ {feat}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveFeature(i)}
                      className="p-1 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

        </form>

        {/* Modal Footer */}
        <div className="border-t border-[#E3ECEE] dark:border-[#243338] pt-4 flex items-center justify-between shrink-0">
          <span className="text-[11px] text-[#52636A]">All changes instantly sync with live catalog &amp; Razorpay pricing</span>
          <div className="flex space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-[#F8FAFA] dark:bg-[#1E2B30] hover:bg-[#DDF3F4] text-[#52636A] hover:text-[#087581] border border-[#E3ECEE] dark:border-[#243338] font-bold"
            >
              Cancel
            </button>
            <button
              type="submit"
              form="marketplace-product-form"
              disabled={saving}
              className="px-6 py-2.5 rounded-xl bg-[#0799A6] hover:bg-[#087581] text-white font-bold flex items-center space-x-2 shadow-sm hover:shadow-[#0799A6]/20 disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{saving ? 'Saving...' : product?.id ? 'Update Product' : 'Create Product'}</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
