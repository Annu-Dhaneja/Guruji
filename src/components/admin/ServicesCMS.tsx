import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Edit3, Check, Save, Sparkles, Image as ImageIcon, RefreshCw } from 'lucide-react';
import { ServiceItem } from '../../types';
import { getCMSData, saveCMSSection } from '../../utils';

export const ServicesCMS: React.FC = () => {
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form State
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<'graphic-design' | 'wardrobe-consultation' | 'vantage-marketplace' | 'book-cover'>('graphic-design');
  const [startingPrice, setStartingPrice] = useState(1499);
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [features, setFeatures] = useState<string>('High Resolution Files, Unlimited Revisions, Vector SVG Export');

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    setLoading(true);
    setErrorMessage('');
    try {
      const cms = await getCMSData();
      if (cms.services && cms.services.length > 0) {
        setServices(cms.services);
      } else {
        const res = await fetch('/api/services');
        if (res.ok) {
          const data = await res.json();
          setServices(data);
        }
      }
    } catch (e: any) {
      console.error(e);
      try {
        const res = await fetch('/api/services');
        if (res.ok) {
          const data = await res.json();
          setServices(data);
        }
      } catch (err: any) {
        setErrorMessage(`Failed to load services: ${e?.message}`);
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

    const featArray = features.split(',').map((f) => f.trim()).filter(Boolean);

    const categoryNames: Record<string, string> = {
      'graphic-design': 'Graphic Design',
      'website-services': 'Website & Software Services',
      'wardrobe-consultation': 'Wardrobe Consultation',
      'vantage-marketplace': 'Vantage Marketplace Ecom',
      'book-cover': 'Book Cover Studio',
    };

    const payload: ServiceItem = {
      id: editingId || `srv-${Date.now()}`,
      title,
      category,
      categoryName: categoryNames[category] || category,
      startingPrice: Number(startingPrice),
      description,
      imageUrl: imageUrl || 'https://images.unsplash.com/photo-1626785774573-4b799315345d?auto=format&fit=crop&w=1200&q=80',
      features: featArray,
    };

    try {
      const updatedServices = editingId
        ? services.map((s) => (s.id === editingId ? payload : s))
        : [payload, ...services];

      // 1. Primary write to Firestore
      await saveCMSSection('services', updatedServices);
      setServices(updatedServices);

      // 2. Sync server
      if (editingId) {
        fetch(`/api/services/${editingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        }).catch((e) => console.warn(e));
      } else {
        fetch('/api/services', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        }).catch((e) => console.warn(e));
      }

      setSuccessMessage('Service saved directly to Firestore successfully!');
      closeModal();
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err: any) {
      console.error(err);
      setErrorMessage(`Firestore write failed: ${err?.message || err}`);
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (service: ServiceItem) => {
    setEditingId(service.id);
    setTitle(service.title);
    setCategory(service.category);
    setStartingPrice(service.startingPrice);
    setDescription(service.description);
    setImageUrl(service.imageUrl);
    setFeatures(service.features.join(', '));
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this service?')) return;
    setErrorMessage('');
    try {
      const updatedServices = services.filter((s) => s.id !== id);
      await saveCMSSection('services', updatedServices);
      setServices(updatedServices);
      fetch(`/api/services/${id}`, { method: 'DELETE' }).catch((e) => console.warn(e));
      setSuccessMessage('Service deleted from Firestore!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err: any) {
      setErrorMessage(`Delete failed in Firestore: ${err?.message}`);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
    setTitle('');
    setDescription('');
    setImageUrl('');
  };

  if (loading) return <div className="text-purple-400 p-8">Loading Services CMS...</div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-900/90 border border-slate-800 p-6 rounded-2xl">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-teal-400" /> Services & Offering Catalog Manager
          </h2>
          <p className="text-xs text-slate-400">
            Control studio services, pricing models, features, and public landing pages in real time.
          </p>
        </div>
        <button
          onClick={() => {
            closeModal();
            setIsModalOpen(true);
          }}
          className="px-4 py-2 bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-400 hover:to-emerald-500 text-white font-medium text-xs rounded-xl flex items-center gap-1.5 shadow-lg shadow-teal-900/30 transition-all"
        >
          <Plus className="w-4 h-4" /> Add Studio Service
        </button>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {services.map((s) => (
          <div key={s.id} className="bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden hover:border-slate-700 transition-all flex flex-col justify-between">
            <div>
              <div className="h-40 relative bg-slate-800 overflow-hidden">
                <img src={s.imageUrl} alt={s.title} className="w-full h-full object-cover" />
                <span className="absolute top-3 left-3 bg-slate-900/90 text-teal-300 text-[10px] font-bold px-2.5 py-1 rounded-full border border-teal-500/30">
                  {s.categoryName}
                </span>
              </div>
              <div className="p-4 space-y-2">
                <h3 className="font-bold text-white text-sm">{s.title}</h3>
                <p className="text-xs text-slate-400 line-clamp-2">{s.description}</p>
                <div className="text-base font-extrabold text-teal-400 pt-1">
                  Starting at ₹{s.startingPrice?.toLocaleString('en-IN')}
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-slate-800/80 flex items-center justify-end gap-2 bg-slate-950/40">
              <button
                onClick={() => handleEdit(s)}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs rounded-lg flex items-center gap-1"
              >
                <Edit3 className="w-3.5 h-3.5" /> Edit
              </button>
              <button
                onClick={() => handleDelete(s.id)}
                className="px-3 py-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs rounded-lg flex items-center gap-1 border border-red-500/20"
              >
                <Trash2 className="w-3.5 h-3.5" /> Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 space-y-4">
            <h3 className="text-lg font-bold text-white">
              {editingId ? 'Edit Service' : 'Add New Service'}
            </h3>
            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Service Title</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg px-3 py-2"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg px-3 py-2"
                  >
                    <option value="graphic-design">Graphic Design</option>
                    <option value="website-services">Website & Software Development</option>
                    <option value="wardrobe-consultation">Wardrobe Consultation</option>
                    <option value="vantage-marketplace">Vantage Marketplace</option>
                    <option value="book-cover">Book Cover Studio</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Starting Price (₹)</label>
                  <input
                    type="number"
                    required
                    value={startingPrice}
                    onChange={(e) => setStartingPrice(Number(e.target.value))}
                    className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg px-3 py-2"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Image URL</label>
                <input
                  type="text"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
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

              <div>
                <label className="block text-slate-400 mb-1">Features (comma separated)</label>
                <input
                  type="text"
                  value={features}
                  onChange={(e) => setFeatures(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg px-3 py-2"
                />
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
                  className="px-5 py-2 bg-teal-600 hover:bg-teal-500 text-white rounded-xl font-medium"
                >
                  Save Service
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
