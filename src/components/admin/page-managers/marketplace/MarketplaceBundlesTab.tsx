import React, { useState } from 'react';
import {
  Plus,
  Edit3,
  Trash2,
  Package,
  Sparkles,
  Upload,
  Check,
  Save,
  X,
  Layers,
  DollarSign,
  Tag,
} from 'lucide-react';
import { GurujiArtwork } from '../../../../types';

export interface GurujiBundleAdminItem {
  id: string;
  slug: string;
  title: string;
  tagline?: string;
  description: string;
  bannerImageUrl: string;
  totalItemsCount: number;
  originalTotalValue: number;
  bundlePrice: number;
  discountPercentage?: number;
  savingsAmount?: number;
  includedArtworkIds: string[];
  includedItems: { title: string; format: string; value?: string }[];
  features: string[];
  badge?: string;
  isFeatured?: boolean;
  isPopular?: boolean;
  status: 'PUBLISHED' | 'DRAFT';
  downloadsCount?: number;
}

interface MarketplaceBundlesTabProps {
  bundles: GurujiBundleAdminItem[];
  artworks: GurujiArtwork[];
  onSaveBundle: (bundle: Partial<GurujiBundleAdminItem>) => Promise<void>;
  onDeleteBundle: (id: string) => Promise<void>;
}

export const MarketplaceBundlesTab: React.FC<MarketplaceBundlesTabProps> = ({
  bundles,
  artworks,
  onSaveBundle,
  onDeleteBundle,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBundle, setEditingBundle] = useState<GurujiBundleAdminItem | null>(null);

  // Form State
  const [title, setTitle] = useState('');
  const [tagline, setTagline] = useState('');
  const [description, setDescription] = useState('');
  const [bannerImageUrl, setBannerImageUrl] = useState('');
  const [bundlePrice, setBundlePrice] = useState(299);
  const [originalTotalValue, setOriginalTotalValue] = useState(999);
  const [badge, setBadge] = useState('MEGA VALUE BUNDLE');
  const [isFeatured, setIsFeatured] = useState(true);
  const [status, setStatus] = useState<'PUBLISHED' | 'DRAFT'>('PUBLISHED');
  
  // Included items description
  const [includedItems, setIncludedItems] = useState<{ title: string; format: string; value?: string }[]>([
    { title: 'Full 4K Ultra HD Wallpapers', format: 'PNG + JPG', value: '₹299' },
    { title: 'Master PSD Layered Files', format: 'Adobe PSD', value: '₹499' },
    { title: 'Commercial License & Vector Assets', format: 'AI + SVG', value: '₹399' },
  ]);
  const [newItemTitle, setNewItemTitle] = useState('');
  const [newItemFormat, setNewItemFormat] = useState('PSD + 4K PNG');

  // Selected artworks
  const [selectedArtworkIds, setSelectedArtworkIds] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);

  const openCreateModal = () => {
    setEditingBundle(null);
    setTitle('');
    setTagline('Complete Master Collection for Devotees');
    setDescription('Curated bundle containing complete high-resolution 4K spiritual wallpapers and layered print files.');
    setBannerImageUrl('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80');
    setBundlePrice(299);
    setOriginalTotalValue(999);
    setBadge('MEGA VALUE BUNDLE');
    setIsFeatured(true);
    setStatus('PUBLISHED');
    setSelectedArtworkIds([]);
    setIncludedItems([
      { title: 'Full 4K Ultra HD Wallpapers', format: 'PNG + JPG', value: '₹299' },
      { title: 'Master PSD Layered Files', format: 'Adobe PSD', value: '₹499' },
      { title: 'Commercial License & Vector Assets', format: 'AI + SVG', value: '₹399' },
    ]);
    setIsModalOpen(true);
  };

  const openEditModal = (b: GurujiBundleAdminItem) => {
    setEditingBundle(b);
    setTitle(b.title);
    setTagline(b.tagline || '');
    setDescription(b.description);
    setBannerImageUrl(b.bannerImageUrl);
    setBundlePrice(b.bundlePrice);
    setOriginalTotalValue(b.originalTotalValue);
    setBadge(b.badge || 'MEGA VALUE BUNDLE');
    setIsFeatured(Boolean(b.isFeatured));
    setStatus(b.status || 'PUBLISHED');
    setSelectedArtworkIds(b.includedArtworkIds || []);
    setIncludedItems(b.includedItems || []);
    setIsModalOpen(true);
  };

  const handleAddIncludedItem = () => {
    if (newItemTitle.trim()) {
      setIncludedItems([...includedItems, { title: newItemTitle.trim(), format: newItemFormat.trim(), value: '₹199' }]);
      setNewItemTitle('');
    }
  };

  const handleRemoveIncludedItem = (index: number) => {
    setIncludedItems(includedItems.filter((_, i) => i !== index));
  };

  const handleToggleArtworkSelection = (artId: string) => {
    if (selectedArtworkIds.includes(artId)) {
      setSelectedArtworkIds(selectedArtworkIds.filter((id) => id !== artId));
    } else {
      setSelectedArtworkIds([...selectedArtworkIds, artId]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const savings = Math.max(0, originalTotalValue - bundlePrice);
    const discount = originalTotalValue > 0 ? Math.round((savings / originalTotalValue) * 100) : 60;

    const payload: Partial<GurujiBundleAdminItem> = {
      ...(editingBundle ? { id: editingBundle.id } : {}),
      title,
      tagline,
      description,
      bannerImageUrl,
      bundlePrice: Number(bundlePrice),
      originalTotalValue: Number(originalTotalValue),
      savingsAmount: savings,
      discountPercentage: discount,
      badge,
      isFeatured,
      status,
      includedArtworkIds: selectedArtworkIds,
      totalItemsCount: includedItems.length,
      includedItems,
      features: [
        'Instant Cloud Download Access',
        'Commercial & Personal License',
        'Print-Ready 300 DPI Quality',
        'Lifetime Asset Access',
      ],
    };

    try {
      await onSaveBundle(payload);
      setIsModalOpen(false);
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-slate-900 border border-slate-800 rounded-2xl p-5 gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 text-xs font-bold mb-2">
            <Package className="w-3.5 h-3.5" />
            <span>Curated Value Bundles ({bundles.length})</span>
          </div>
          <h3 className="text-xl font-black text-white">Curated Design Packs & Bundles</h3>
          <p className="text-xs text-slate-400">
            Combine multiple artworks, PSD masters, and templates into heavily discounted high-converting packs.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs flex items-center space-x-2 shadow-lg shadow-amber-500/20 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Bundle</span>
        </button>
      </div>

      {/* Bundles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {bundles.map((bundle) => {
          const discount = bundle.originalTotalValue > 0
            ? Math.round(((bundle.originalTotalValue - bundle.bundlePrice) / bundle.originalTotalValue) * 100)
            : 60;

          return (
            <div
              key={bundle.id}
              className="p-5 rounded-3xl bg-slate-900 border border-slate-800 flex flex-col justify-between space-y-4 shadow-xl text-xs"
            >
              <div className="space-y-3">
                
                {/* Bundle Banner */}
                <div className="relative h-44 rounded-2xl overflow-hidden bg-slate-950 border border-slate-800">
                  <img src={bundle.bannerImageUrl} alt={bundle.title} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
                  
                  <span className="absolute top-2.5 left-2.5 px-3 py-1 rounded-full bg-amber-500 text-slate-950 font-black text-[10px] uppercase shadow-md">
                    {bundle.badge || 'MEGA BUNDLE'}
                  </span>

                  <span className="absolute top-2.5 right-2.5 px-2.5 py-1 rounded-full bg-emerald-500 text-slate-950 font-black text-[10px]">
                    SAVE {discount}%
                  </span>

                  <div className="absolute bottom-2.5 left-3 right-3 text-white">
                    <h4 className="text-sm font-black truncate">{bundle.title}</h4>
                    <p className="text-[11px] text-amber-300 font-semibold truncate">{bundle.tagline}</p>
                  </div>
                </div>

                <p className="text-slate-400 text-xs line-clamp-2 leading-relaxed">{bundle.description}</p>

                {/* Price and Items Pill */}
                <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-400 block font-semibold">Special Bundle Price</span>
                    <div className="flex items-baseline space-x-2">
                      <span className="text-base font-black text-amber-400">₹{bundle.bundlePrice}</span>
                      <span className="text-xs text-slate-500 line-through">₹{bundle.originalTotalValue}</span>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] text-emerald-400 font-bold block">
                      Save ₹{bundle.originalTotalValue - bundle.bundlePrice}
                    </span>
                    <span className="text-[11px] text-slate-300 font-bold">
                      {bundle.includedItems?.length || bundle.totalItemsCount || 3} Master Assets
                    </span>
                  </div>
                </div>

              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                <span className="text-[11px] text-slate-500">
                  Status: <strong className="text-emerald-400">{bundle.status || 'PUBLISHED'}</strong>
                </span>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => openEditModal(bundle)}
                    className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onDeleteBundle(bundle.id)}
                    className="p-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

            </div>
          );
        })}
      </div>

      {/* Bundle Create / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="max-w-2xl w-full bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-2xl my-8 text-xs text-slate-200">
            
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-2">
                <Package className="w-5 h-5 text-amber-400" />
                <h3 className="text-base font-black text-white">
                  {editingBundle ? 'Edit Curated Value Bundle' : 'Create New Value Bundle'}
                </h3>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="p-1.5 rounded-xl hover:bg-slate-800 text-slate-400">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 max-h-[75vh] overflow-y-auto pr-1">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Bundle Title *</label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Master Divine Darbar 4K + PSD Super Pack"
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white outline-none focus:border-amber-500 font-bold"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Tagline / Subtitle</label>
                  <input
                    type="text"
                    value={tagline}
                    onChange={(e) => setTagline(e.target.value)}
                    placeholder="e.g. 5 Ultra HD 4K Wallpapers + Complete Layered PSD Masters"
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Banner Image URL *</label>
                <input
                  type="url"
                  required
                  value={bannerImageUrl}
                  onChange={(e) => setBannerImageUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Bundle Description</label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Comprehensive description of everything included in this bundle..."
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white outline-none focus:border-amber-500 resize-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Bundle Price (₹) *</label>
                  <input
                    type="number"
                    required
                    min={0}
                    value={bundlePrice}
                    onChange={(e) => setBundlePrice(Number(e.target.value))}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-amber-400 font-black outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Total Individual Value (₹)</label>
                  <input
                    type="number"
                    min={0}
                    value={originalTotalValue}
                    onChange={(e) => setOriginalTotalValue(Number(e.target.value))}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 font-bold outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Promotional Badge</label>
                  <input
                    type="text"
                    value={badge}
                    onChange={(e) => setBadge(e.target.value)}
                    placeholder="e.g. MEGA VALUE BUNDLE"
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              {/* Included Items Builder */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                <span className="text-slate-300 font-bold block">Included Items List:</span>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newItemTitle}
                    onChange={(e) => setNewItemTitle(e.target.value)}
                    placeholder="e.g. 5x Master PSD Files"
                    className="flex-1 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs"
                  />
                  <input
                    type="text"
                    value={newItemFormat}
                    onChange={(e) => setNewItemFormat(e.target.value)}
                    placeholder="Format: PSD + PNG"
                    className="w-32 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs"
                  />
                  <button
                    type="button"
                    onClick={handleAddIncludedItem}
                    className="px-3 py-1.5 rounded-xl bg-amber-500 text-slate-950 font-bold"
                  >
                    Add
                  </button>
                </div>

                <div className="space-y-1.5">
                  {includedItems.map((item, i) => (
                    <div key={i} className="p-2 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                      <span className="font-bold text-white">{item.title}</span>
                      <div className="flex items-center space-x-2">
                        <span className="text-[10px] text-amber-300 font-mono">{item.format}</span>
                        <button type="button" onClick={() => handleRemoveIncludedItem(i)} className="text-red-400 hover:text-red-300">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black flex items-center space-x-1.5"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{saving ? 'Saving...' : 'Save Bundle'}</span>
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
};
