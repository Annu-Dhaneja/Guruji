import React, { useState, useEffect } from 'react';
import { ShoppingBag, Plus, Trash2, Edit3, Download, Sparkles, RefreshCw, Check } from 'lucide-react';
import { ProductItem } from '../../types';
import { getCMSData, saveCMSSection } from '../../utils';

export const ProductsCMS: React.FC = () => {
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form
  const [name, setName] = useState('');
  const [category, setCategory] = useState<'guruji-products' | 'digital-products' | 'accessories' | 'ebooks'>('guruji-products');
  const [price, setPrice] = useState(999);
  const [discountPrice, setDiscountPrice] = useState(799);
  const [description, setDescription] = useState('');
  const [previewUrl, setPreviewUrl] = useState('');
  const [downloadUrl, setDownloadUrl] = useState('');
  const [isDigital, setIsDigital] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    setErrorMessage('');
    try {
      const cms = await getCMSData();
      if (cms.products && cms.products.length > 0) {
        setProducts(cms.products);
      } else {
        const res = await fetch('/api/products');
        if (res.ok) {
          const data = await res.json();
          setProducts(data);
        }
      }
    } catch (e: any) {
      console.error(e);
      try {
        const res = await fetch('/api/products');
        if (res.ok) {
          const data = await res.json();
          setProducts(data);
        }
      } catch (err: any) {
        setErrorMessage(`Failed to load products: ${e?.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setErrorMessage('');
    setSuccessMessage('');

    const categoryNames: Record<string, string> = {
      'guruji-products': 'Guruji Divine Store',
      'digital-products': '4K Digital Downloads',
      accessories: 'Accessories',
      ebooks: 'E-Books & Guides',
    };

    const payload: ProductItem = {
      id: editingId || `prod-${Date.now()}`,
      name,
      category,
      categoryName: categoryNames[category] || category,
      price: Number(price),
      discountPrice: discountPrice ? Number(discountPrice) : undefined,
      description,
      previewUrl: previewUrl || 'https://images.unsplash.com/photo-1611591475281-229ef58d55fa?auto=format&fit=crop&w=1200&q=80',
      downloadUrl,
      isDigital,
      tags: [category, isDigital ? 'digital' : 'physical'],
    };

    try {
      const updatedProducts = editingId
        ? products.map((p) => (p.id === editingId ? payload : p))
        : [payload, ...products];

      // 1. Primary write to Firestore
      await saveCMSSection('products', updatedProducts);
      setProducts(updatedProducts);

      // 2. Sync server
      if (editingId) {
        fetch(`/api/products/${editingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        }).catch((e) => console.warn(e));
      } else {
        fetch('/api/products', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        }).catch((e) => console.warn(e));
      }

      setSuccessMessage('Product saved directly to Firestore successfully!');
      closeModal();
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err: any) {
      console.error(err);
      setErrorMessage(`Firestore save failed: ${err?.message || err}`);
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (prod: ProductItem) => {
    setEditingId(prod.id);
    setName(prod.name);
    setCategory(prod.category);
    setPrice(prod.price);
    setDiscountPrice(prod.discountPrice || 0);
    setDescription(prod.description);
    setPreviewUrl(prod.previewUrl);
    setDownloadUrl(prod.downloadUrl || '');
    setIsDigital(prod.isDigital);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    setErrorMessage('');
    try {
      const updatedProducts = products.filter((p) => p.id !== id);
      await saveCMSSection('products', updatedProducts);
      setProducts(updatedProducts);
      fetch(`/api/products/${id}`, { method: 'DELETE' }).catch((e) => console.warn(e));
      setSuccessMessage('Product deleted from Firestore!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err: any) {
      setErrorMessage(`Delete failed in Firestore: ${err?.message}`);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
    setName('');
    setDescription('');
    setPreviewUrl('');
    setDownloadUrl('');
  };

  if (loading) return <div className="text-purple-400 p-8">Loading Store Products CMS...</div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-900/90 border border-slate-800 p-6 rounded-2xl">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-amber-400" /> Digital & Physical Products Catalog
          </h2>
          <p className="text-xs text-slate-400">
            Manage Guruji sacred items, 4K digital wallpapers, e-books, and automated file download links.
          </p>
        </div>
        <button
          onClick={() => {
            closeModal();
            setIsModalOpen(true);
          }}
          className="px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-white font-medium text-xs rounded-xl flex items-center gap-1.5 shadow-lg shadow-amber-900/30 transition-all"
        >
          <Plus className="w-4 h-4" /> Add New Product
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {products.map((p) => (
          <div key={p.id} className="bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden hover:border-slate-700 transition-all flex flex-col justify-between">
            <div>
              <div className="h-40 relative bg-slate-800 overflow-hidden">
                <img src={p.previewUrl} alt={p.name} className="w-full h-full object-cover" />
                <span className="absolute top-3 left-3 bg-slate-900/90 text-amber-300 text-[10px] font-bold px-2.5 py-1 rounded-full border border-amber-500/30">
                  {p.categoryName}
                </span>
                {p.isDigital && (
                  <span className="absolute top-3 right-3 bg-indigo-500/90 text-white text-[9px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                    <Download className="w-3 h-3" /> Digital Download
                  </span>
                )}
              </div>
              <div className="p-4 space-y-2">
                <h3 className="font-bold text-white text-sm">{p.name}</h3>
                <p className="text-xs text-slate-400 line-clamp-2">{p.description}</p>
                <div className="flex items-center gap-2 pt-1">
                  <span className="text-base font-extrabold text-amber-400">
                    ₹{(p.discountPrice || p.price).toLocaleString('en-IN')}
                  </span>
                  {p.discountPrice && (
                    <span className="text-xs text-slate-500 line-through">
                      ₹{p.price.toLocaleString('en-IN')}
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-slate-800/80 flex items-center justify-end gap-2 bg-slate-950/40">
              <button
                onClick={() => handleEdit(p)}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs rounded-lg flex items-center gap-1"
              >
                <Edit3 className="w-3.5 h-3.5" /> Edit
              </button>
              <button
                onClick={() => handleDelete(p.id)}
                className="px-3 py-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs rounded-lg flex items-center gap-1 border border-red-500/20"
              >
                <Trash2 className="w-3.5 h-3.5" /> Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 space-y-4">
            <h3 className="text-lg font-bold text-white">
              {editingId ? 'Edit Product' : 'Add New Product'}
            </h3>
            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Product Title</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg px-3 py-2"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg px-2.5 py-2"
                  >
                    <option value="guruji-products">Guruji Products</option>
                    <option value="digital-products">Digital Wallpapers</option>
                    <option value="accessories">Accessories</option>
                    <option value="ebooks">E-Books & Guides</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Regular Price (₹)</label>
                  <input
                    type="number"
                    required
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Discount Price (₹)</label>
                  <input
                    type="number"
                    value={discountPrice}
                    onChange={(e) => setDiscountPrice(Number(e.target.value))}
                    className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg px-3 py-2"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Preview Image URL</label>
                <input
                  type="text"
                  value={previewUrl}
                  onChange={(e) => setPreviewUrl(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg px-3 py-2"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Digital Download File URL (if applicable)</label>
                <input
                  type="text"
                  value={downloadUrl}
                  onChange={(e) => setDownloadUrl(e.target.value)}
                  placeholder="https://drive.google.com/..."
                  className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg px-3 py-2"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Description</label>
                <textarea
                  rows={3}
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg px-3 py-2"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="digCheck"
                  checked={isDigital}
                  onChange={(e) => setIsDigital(e.target.checked)}
                  className="rounded text-amber-500"
                />
                <label htmlFor="digCheck" className="text-slate-300">Digital Product (auto-send download file upon payment)</label>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-xl font-medium"
                >
                  Save Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
