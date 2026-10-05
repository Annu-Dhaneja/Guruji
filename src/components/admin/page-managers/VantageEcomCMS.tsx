import React, { useState, useEffect } from 'react';
import {
  Save,
  Plus,
  Trash2,
  Eye,
  EyeOff,
  ShoppingBag,
  Check,
  RefreshCw,
  Layers,
  FileText,
  Image as ImageIcon,
  Send,
  MessageSquare,
  Clock,
  ShieldCheck,
  Star,
  Edit2,
  ExternalLink,
  Phone,
  Mail,
  User,
  Building,
  Tag,
  CheckCircle2,
  SlidersHorizontal,
  FolderOpen,
} from 'lucide-react';
import { VantageService, VantagePackage, VantageBeforeAfter } from '../../../types';

export const VantageEcomCMS: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'services' | 'inquiries' | 'before-after' | 'general'>('services');

  // Services State
  const [services, setServices] = useState<VantageService[]>([]);
  const [selectedService, setSelectedService] = useState<VantageService | null>(null);
  const [isEditingService, setIsEditingService] = useState(false);
  const [serviceForm, setServiceForm] = useState<Partial<VantageService>>({});
  const [newFeatureText, setNewFeatureText] = useState('');
  const [newTagText, setNewTagText] = useState('');

  // Inquiries State
  const [inquiries, setInquiries] = useState<any[]>([]);
  const [selectedInquiry, setSelectedInquiry] = useState<any | null>(null);
  const [inquiryStatusFilter, setInquiryStatusFilter] = useState<string>('all');
  const [adminNotesInput, setAdminNotesInput] = useState('');
  const [adminQuoteInput, setAdminQuoteInput] = useState<number | string>('');

  // Before/After Showcase State
  const [beforeAfterList, setBeforeAfterList] = useState<VantageBeforeAfter[]>([]);
  const [editingBa, setEditingBa] = useState<Partial<VantageBeforeAfter> | null>(null);

  // General Page Content State
  const [pageContent, setPageContent] = useState<any>(null);

  // Loading & Message States
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  // Initial Fetch
  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    setLoading(true);
    try {
      const [srvRes, inqRes, baRes, contentRes] = await Promise.all([
        fetch('/api/vantageecom/services'),
        fetch('/api/vantageecom/inquiries'),
        fetch('/api/vantageecom/before-after'),
        fetch('/api/page-content/vantage-ecom'),
      ]);

      if (srvRes.ok) setServices(await srvRes.json());
      if (inqRes.ok) setInquiries(await inqRes.json());
      if (baRes.ok) setBeforeAfterList(await baRes.json());
      if (contentRes.ok) setPageContent(await contentRes.json());
    } catch (e) {
      console.error('Error loading VantageEcom CMS data:', e);
      showNotice('Failed to load some VantageEcom data.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const showNotice = (text: string, type: 'success' | 'error' = 'success') => {
    setStatusMessage({ text, type });
    setTimeout(() => setStatusMessage(null), 4000);
  };

  // ================= SERVICES CRUD =================
  const handleOpenNewService = () => {
    setServiceForm({
      title: '',
      category: 'photo-editing',
      categoryName: 'Photo Editing',
      shortDescription: '',
      fullDescription: '',
      startingPrice: 499,
      salePrice: 399,
      deliveryTime: '24 Hours',
      popular: false,
      visible: true,
      imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80',
      marketplaceTags: ['Amazon', 'Flipkart', 'Shopify'],
      features: [
        'Pure White RGB 255 Background',
        'Hand-drawn manual clipping path',
        'Natural soft drop shadow',
        'High-Res JPG + PNG deliverable',
      ],
      packages: [
        {
          id: 'basic-' + Date.now(),
          name: 'Basic Retouch',
          price: 299,
          deliveryTime: '24 Hours',
          revisions: '1 Revision',
          unit: 'image',
          features: ['Pure White Background', 'Basic Dust Removal', 'Web JPG Output'],
        },
        {
          id: 'std-' + Date.now(),
          name: 'Standard Pro (Recommended)',
          price: 499,
          deliveryTime: '12-24 Hours',
          revisions: '3 Revisions',
          popular: true,
          unit: 'image',
          features: ['Pure White + Transparent PNG', '3D Shadow & Reflection', 'Amazon Zoom 2000px', 'Source Layered PSD'],
        },
        {
          id: 'prem-' + Date.now(),
          name: 'Premium Full Suite',
          price: 799,
          deliveryTime: '6-12 Hours Express',
          revisions: 'Unlimited Revisions',
          unit: 'image',
          features: ['360 Multi-angle Alignment', 'Ghost Mannequin 3D Neck Joint', 'Custom Infographic Badges', 'Commercial Print TIFF'],
        },
      ],
      whatYouGet: ['Web-Ready Compressed JPG', 'Lossless Transparent PNG', 'Print Resolution Master'],
      processSteps: [
        { stepNumber: 1, title: 'Asset Upload', description: 'Client submits raw camera files.' },
        { stepNumber: 2, title: 'Clipping & Retouch', description: 'Manual path isolation and color balancing.' },
        { stepNumber: 3, title: 'Quality Verification', description: 'Amazon guideline check & deliverable export.' },
      ],
      faqs: [
        { question: 'What is the turnaround time for bulk orders?', answer: 'We deliver batches of 50-100 images within 24-48 hours.' },
      ],
    });
    setIsEditingService(true);
  };

  const handleEditService = (srv: VantageService) => {
    setServiceForm({ ...srv });
    setIsEditingService(true);
  };

  const handleSaveService = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const isExisting = Boolean(serviceForm.id);
      const url = isExisting
        ? `/api/vantageecom/services/${serviceForm.id}`
        : '/api/vantageecom/services';
      const method = isExisting ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(serviceForm),
      });

      if (res.ok) {
        const saved = await res.json();
        if (isExisting) {
          setServices((prev) => prev.map((s) => (s.id === saved.id ? saved : s)));
          showNotice(`Service "${saved.title}" updated successfully!`);
        } else {
          setServices((prev) => [saved, ...prev]);
          showNotice(`Service "${saved.title}" created successfully!`);
        }
        setIsEditingService(false);
        setServiceForm({});
      } else {
        showNotice('Failed to save service.', 'error');
      }
    } catch (e) {
      console.error(e);
      showNotice('Network error saving service.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteService = async (id: string, title: string) => {
    if (!window.confirm(`Are you sure you want to delete service "${title}"?`)) return;

    try {
      const res = await fetch(`/api/vantageecom/services/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setServices((prev) => prev.filter((s) => s.id !== id));
        showNotice(`Service "${title}" deleted.`);
      }
    } catch (e) {
      console.error(e);
      showNotice('Failed to delete service.', 'error');
    }
  };

  // Helper to add/remove feature in editing form
  const handleAddFeature = () => {
    if (!newFeatureText.trim()) return;
    const current = serviceForm.features || [];
    setServiceForm({ ...serviceForm, features: [...current, newFeatureText.trim()] });
    setNewFeatureText('');
  };

  const handleRemoveFeature = (index: number) => {
    const current = serviceForm.features || [];
    setServiceForm({ ...serviceForm, features: current.filter((_, i) => i !== index) });
  };

  // Helper to add/remove marketplace tag
  const handleAddTag = () => {
    if (!newTagText.trim()) return;
    const current = serviceForm.marketplaceTags || [];
    setServiceForm({ ...serviceForm, marketplaceTags: [...current, newTagText.trim()] });
    setNewTagText('');
  };

  const handleRemoveTag = (index: number) => {
    const current = serviceForm.marketplaceTags || [];
    setServiceForm({ ...serviceForm, marketplaceTags: current.filter((_, i) => i !== index) });
  };

  // ================= INQUIRIES CRUD & MANAGEMENT =================
  const handleOpenInquiryDetails = (inq: any) => {
    setSelectedInquiry(inq);
    setAdminNotesInput(inq.adminNotes || '');
    setAdminQuoteInput(inq.adminQuote || inq.estimatedTotal || '');
  };

  const handleUpdateInquiryStatus = async (inqId: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/vantageecom/inquiries/${inqId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: newStatus,
          adminNotes: adminNotesInput,
          adminQuote: Number(adminQuoteInput) || undefined,
        }),
      });

      if (res.ok) {
        const updated = await res.json();
        setInquiries((prev) => prev.map((item) => (item.id === inqId ? updated : item)));
        if (selectedInquiry && selectedInquiry.id === inqId) {
          setSelectedInquiry(updated);
        }
        showNotice(`Inquiry status updated to "${newStatus}"!`);
      }
    } catch (e) {
      console.error(e);
      showNotice('Failed to update inquiry.', 'error');
    }
  };

  const handleDeleteInquiry = async (inqId: string) => {
    if (!window.confirm('Are you sure you want to delete this inquiry record?')) return;
    try {
      const res = await fetch(`/api/vantageecom/inquiries/${inqId}`, { method: 'DELETE' });
      if (res.ok) {
        setInquiries((prev) => prev.filter((i) => i.id !== inqId));
        if (selectedInquiry?.id === inqId) setSelectedInquiry(null);
        showNotice('Inquiry removed.');
      }
    } catch (e) {
      console.error(e);
      showNotice('Failed to delete inquiry.', 'error');
    }
  };

  // ================= BEFORE/AFTER CRUD =================
  const handleSaveBeforeAfter = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBa) return;

    setSaving(true);
    try {
      const isExisting = Boolean(editingBa.id);
      const url = isExisting
        ? `/api/vantageecom/before-after/${editingBa.id}`
        : '/api/vantageecom/before-after';
      const method = isExisting ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingBa),
      });

      if (res.ok) {
        const saved = await res.json();
        if (isExisting) {
          setBeforeAfterList((prev) => prev.map((item) => (item.id === saved.id ? saved : item)));
          showNotice('Comparison card updated!');
        } else {
          setBeforeAfterList((prev) => [saved, ...prev]);
          showNotice('New comparison card created!');
        }
        setEditingBa(null);
      }
    } catch (e) {
      console.error(e);
      showNotice('Error saving before/after item.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteBeforeAfter = async (id: string) => {
    if (!window.confirm('Delete this before/after card?')) return;
    try {
      const res = await fetch(`/api/vantageecom/before-after/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setBeforeAfterList((prev) => prev.filter((item) => item.id !== id));
        showNotice('Comparison card deleted.');
      }
    } catch (e) {
      console.error(e);
      showNotice('Failed to delete comparison card.', 'error');
    }
  };

  // Filtered inquiries
  const filteredInquiries = inquiries.filter((inq) => {
    if (inquiryStatusFilter === 'all') return true;
    return (inq.status || 'New').toLowerCase() === inquiryStatusFilter.toLowerCase();
  });

  if (loading) {
    return (
      <div className="p-12 text-center text-slate-400">
        <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-3 text-teal-400" />
        <p className="text-sm font-bold">Loading VantageEcom Production Database...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Banner Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 gap-4 shadow-xl">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-teal-500/10 text-teal-400 border border-teal-500/20 text-xs font-bold mb-2">
            <ShoppingBag className="w-3.5 h-3.5 text-teal-400" />
            <span>VantageEcom • Control Center & Feature Manager</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white">VantageEcom Services & Inquiries CMS</h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Manage services, packages, feature bullet points, customer inquiry project briefs, quotes, and before/after showcases.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={handleOpenNewService}
            className="px-5 py-3 rounded-2xl bg-gradient-to-r from-teal-500 to-purple-600 hover:from-teal-400 hover:to-purple-500 text-slate-950 font-black text-xs shadow-lg shadow-teal-900/30 flex items-center space-x-2 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Service</span>
          </button>
        </div>
      </div>

      {statusMessage && (
        <div
          className={`p-4 rounded-2xl text-xs font-bold flex items-center space-x-2 ${
            statusMessage.type === 'success'
              ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-300'
              : 'bg-red-500/10 border border-red-500/30 text-red-300'
          }`}
        >
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{statusMessage.text}</span>
        </div>
      )}

      {/* Main Tabs Navigation */}
      <div className="flex flex-wrap gap-2 border-b border-slate-800 pb-3">
        {[
          { id: 'services', label: `Service Catalog & Features (${services.length})` },
          { id: 'inquiries', label: `Customer Inquiries & Briefs (${inquiries.length})` },
          { id: 'before-after', label: `Before/After Showcase (${beforeAfterList.length})` },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-5 py-2.5 rounded-2xl text-xs font-bold transition-all ${
              activeTab === tab.id
                ? 'bg-teal-500 text-slate-950 font-black shadow-lg shadow-teal-900/30'
                : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* TAB 1: SERVICES CATALOG & FEATURE EDITOR */}
      {activeTab === 'services' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-bold text-white">Live Services ({services.length})</h3>
              <p className="text-xs text-slate-400">Click edit on any service to customize its features, packages, prices, and specifications.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {services.map((srv) => (
              <div
                key={srv.id}
                className="bg-slate-900 border border-slate-800 rounded-3xl p-5 space-y-4 hover:border-slate-700 transition-all flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="relative h-40 rounded-2xl overflow-hidden bg-slate-950 border border-slate-800">
                    <img src={srv.imageUrl} alt={srv.title} className="w-full h-full object-cover" />
                    <span className="absolute top-2.5 left-2.5 px-2.5 py-1 rounded-lg bg-slate-950/80 backdrop-blur-md text-[10px] font-bold text-teal-300 border border-teal-500/20">
                      {srv.categoryName}
                    </span>
                    {srv.popular && (
                      <span className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-md bg-teal-500 text-slate-950 text-[9px] font-black uppercase">
                        Popular
                      </span>
                    )}
                  </div>

                  <div>
                    <h4 className="text-sm font-bold text-white line-clamp-1">{srv.title}</h4>
                    <p className="text-xs text-slate-400 line-clamp-2 mt-1">{srv.shortDescription}</p>
                  </div>

                  <div className="flex items-baseline space-x-2">
                    <span className="text-base font-black text-teal-300">
                      ₹{(srv.salePrice || srv.startingPrice).toLocaleString('en-IN')}
                    </span>
                    {srv.salePrice && (
                      <span className="text-xs text-slate-500 line-through">
                        ₹{srv.startingPrice.toLocaleString('en-IN')}
                      </span>
                    )}
                    <span className="text-[11px] text-slate-500 ml-auto flex items-center space-x-1">
                      <Clock className="w-3 h-3 text-teal-400" />
                      <span>{srv.deliveryTime}</span>
                    </span>
                  </div>

                  {/* Features Pill List */}
                  {srv.features && srv.features.length > 0 && (
                    <div className="space-y-1.5 pt-2 border-t border-slate-800">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                        Features ({srv.features.length}):
                      </span>
                      <ul className="space-y-1">
                        {srv.features.slice(0, 3).map((feat, i) => (
                          <li key={i} className="text-[11px] text-slate-300 flex items-center space-x-1.5 truncate">
                            <CheckCircle2 className="w-3 h-3 text-teal-400 shrink-0" />
                            <span className="truncate">{feat}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                <div className="flex items-center space-x-2 pt-3 border-t border-slate-800">
                  <button
                    onClick={() => handleEditService(srv)}
                    className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-teal-300 hover:text-white font-bold text-xs flex items-center justify-center space-x-1.5 transition-colors"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    <span>Edit Service & Features</span>
                  </button>

                  <button
                    onClick={() => handleDeleteService(srv.id, srv.title)}
                    className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-500 hover:text-red-400 hover:border-red-500/30 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: INQUIRIES & PROJECT BRIEFS MANAGEMENT */}
      {activeTab === 'inquiries' && (
        <div className="space-y-6">
          {/* Header & Status Filter */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h3 className="text-lg font-bold text-white">Client Inquiries & Project Briefs ({filteredInquiries.length})</h3>
              <p className="text-xs text-slate-400">All submissions from the VantageEcom Inquiry Now page with uploaded assets.</p>
            </div>

            <div className="flex items-center space-x-2 bg-slate-900 border border-slate-800 rounded-2xl p-1 text-xs">
              {['all', 'New', 'Reviewing', 'Quoted', 'Approved', 'Closed'].map((st) => (
                <button
                  key={st}
                  onClick={() => setInquiryStatusFilter(st)}
                  className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                    inquiryStatusFilter === st
                      ? 'bg-teal-500 text-slate-950 font-black'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {st === 'all' ? 'All Inquiries' : st}
                </button>
              ))}
            </div>
          </div>

          {filteredInquiries.length === 0 ? (
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-12 text-center text-slate-400 space-y-3">
              <MessageSquare className="w-10 h-10 mx-auto text-slate-600" />
              <h4 className="text-base font-bold text-white">No inquiries found in this category</h4>
              <p className="text-xs">Client submissions from the Inquiry Now page will automatically appear here.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredInquiries.map((inq) => {
                const isNew = inq.status === 'New' || !inq.status;
                const prefilledWA = `Hello ${inq.customerName}, this is Annu Dhaneja / GurucraftPro regarding your VantageEcom Inquiry (Ref: ${inq.id}) for ${inq.serviceTitle}. We have reviewed your files and requirements...`;

                return (
                  <div
                    key={inq.id}
                    className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 hover:border-slate-700 transition-all"
                  >
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-slate-800 pb-3">
                      <div className="flex items-center space-x-3">
                        <span className="font-mono text-xs font-black text-teal-300 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800">
                          {inq.id}
                        </span>
                        <h4 className="text-sm font-bold text-white">{inq.serviceTitle}</h4>
                        <span className="text-xs px-2.5 py-0.5 rounded-md bg-purple-500/10 text-purple-300 border border-purple-500/30">
                          {inq.packageName || 'Standard Package'}
                        </span>
                      </div>

                      <div className="flex items-center space-x-2">
                        <select
                          value={inq.status || 'New'}
                          onChange={(e) => handleUpdateInquiryStatus(inq.id, e.target.value)}
                          className="bg-slate-950 border border-slate-800 text-xs font-bold text-teal-300 rounded-xl px-3 py-1.5 outline-none"
                        >
                          <option value="New">🟢 New Inquiry</option>
                          <option value="Reviewing">🟡 In Review</option>
                          <option value="Quoted">🔵 Quote Sent</option>
                          <option value="Approved">🟣 Approved & Active</option>
                          <option value="Converted">✨ Converted to Order</option>
                          <option value="Closed">⚪ Closed</option>
                        </select>

                        <button
                          onClick={() => handleDeleteInquiry(inq.id)}
                          className="p-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-500 hover:text-red-400"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Client & Specs Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                      <div>
                        <span className="text-slate-500 block">Client Contact</span>
                        <strong className="text-white block">{inq.customerName}</strong>
                        <span className="text-slate-400 block font-mono text-[11px]">{inq.customerPhone}</span>
                        <span className="text-slate-400 block text-[11px]">{inq.customerEmail}</span>
                      </div>

                      <div>
                        <span className="text-slate-500 block">Order Scope & SLA</span>
                        <strong className="text-white block">{inq.quantity || 1} SKUs / Images</strong>
                        <span className="text-amber-300 block">{inq.platform || 'Amazon'}</span>
                        <span className="text-slate-400 block">{inq.deadline || 'Standard'}</span>
                      </div>

                      <div>
                        <span className="text-slate-500 block">Estimated / Quote Price</span>
                        <strong className="text-emerald-400 text-sm font-black block">
                          ₹{(inq.adminQuote || inq.estimatedTotal || 0).toLocaleString('en-IN')}
                        </strong>
                        <span className="text-slate-500 text-[10px]">
                          Submitted {new Date(inq.createdAt || Date.now()).toLocaleDateString()}
                        </span>
                      </div>

                      <div className="flex flex-col justify-center space-y-2">
                        <a
                          href={`https://wa.me/${(inq.customerPhone || '').replace(/[^0-9]/g, '')}?text=${encodeURIComponent(prefilledWA)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center space-x-1.5 shadow-md"
                        >
                          <MessageSquare className="w-3.5 h-3.5" />
                          <span>WhatsApp Client</span>
                        </a>

                        <button
                          onClick={() => handleOpenInquiryDetails(inq)}
                          className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-teal-300 font-bold text-xs flex items-center justify-center space-x-1.5"
                        >
                          <FolderOpen className="w-3.5 h-3.5" />
                          <span>View Full Brief & Files</span>
                        </button>
                      </div>
                    </div>

                    {/* Files & Details Bar */}
                    {(inq.uploadedFiles?.length > 0 || inq.referenceLinks) && (
                      <div className="pt-2 border-t border-slate-850 flex flex-wrap items-center gap-2 text-xs">
                        {inq.uploadedFiles?.map((f: string, i: number) => (
                          <span key={i} className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 text-slate-300 font-mono text-[10px]">
                            📎 {f}
                          </span>
                        ))}
                        {inq.referenceLinks && (
                          <a
                            href={inq.referenceLinks}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-2.5 py-1 rounded-lg bg-teal-500/10 border border-teal-500/30 text-teal-300 text-[10px] flex items-center space-x-1 hover:underline"
                          >
                            <span>Drive Folder</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: BEFORE / AFTER SHOWCASE MANAGER */}
      {activeTab === 'before-after' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-bold text-white">Before / After Comparison Showcase ({beforeAfterList.length})</h3>
              <p className="text-xs text-slate-400">Interactive transformation slider cards displayed on the VantageEcom page.</p>
            </div>

            <button
              onClick={() =>
                setEditingBa({
                  title: 'Pure White Background Isolation',
                  category: 'Photo Editing',
                  description: '100% Amazon RGB 255 pure white isolation with natural ground shadow.',
                  beforeImage: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80',
                  afterImage: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80',
                  visible: true,
                })
              }
              className="px-4 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs flex items-center space-x-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Add Transformation Card</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {beforeAfterList.map((item) => (
              <div key={item.id} className="bg-slate-900 border border-slate-800 rounded-3xl p-5 space-y-4">
                <div className="grid grid-cols-2 gap-2 h-36">
                  <div className="rounded-xl overflow-hidden bg-slate-950 border border-slate-800 relative">
                    <img src={item.beforeImage} alt="Before" className="w-full h-full object-cover" />
                    <span className="absolute bottom-1.5 left-1.5 px-2 py-0.5 rounded bg-black/80 text-[9px] font-bold text-slate-300">
                      Before
                    </span>
                  </div>
                  <div className="rounded-xl overflow-hidden bg-slate-950 border border-slate-800 relative">
                    <img src={item.afterImage} alt="After" className="w-full h-full object-cover" />
                    <span className="absolute bottom-1.5 left-1.5 px-2 py-0.5 rounded bg-teal-500 text-[9px] font-black text-slate-950">
                      After
                    </span>
                  </div>
                </div>

                <div>
                  <span className="text-[10px] font-bold text-teal-400 uppercase">{item.category}</span>
                  <h4 className="text-sm font-bold text-white line-clamp-1">{item.title}</h4>
                  <p className="text-xs text-slate-400 line-clamp-2 mt-1">{item.description}</p>
                </div>

                <div className="flex items-center space-x-2 pt-2 border-t border-slate-800">
                  <button
                    onClick={() => setEditingBa(item)}
                    className="flex-1 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-teal-300 font-bold text-xs flex items-center justify-center space-x-1"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    <span>Edit</span>
                  </button>
                  <button
                    onClick={() => handleDeleteBeforeAfter(item.id)}
                    className="p-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-500 hover:text-red-400"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ================= EDIT SERVICE MODAL ================= */}
      {isEditingService && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 overflow-y-auto">
          <div className="w-full max-w-4xl my-8 bg-slate-900 border border-teal-500/40 rounded-3xl p-6 sm:p-8 space-y-6 text-white max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex justify-between items-center border-b border-slate-800 pb-4">
              <div>
                <h3 className="text-lg font-bold text-white">
                  {serviceForm.id ? `Edit Service: ${serviceForm.title}` : 'Add New VantageEcom Service'}
                </h3>
                <p className="text-xs text-slate-400">Configure catalog details, pricing tiers, and feature bullet points.</p>
              </div>
              <button
                onClick={() => setIsEditingService(false)}
                className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveService} className="space-y-6 text-xs">
              {/* Core Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-400 mb-1 font-bold">Service Title *</label>
                  <input
                    type="text"
                    required
                    value={serviceForm.title || ''}
                    onChange={(e) => setServiceForm({ ...serviceForm, title: e.target.value })}
                    placeholder="e.g. Ghost Mannequin 3D Neck Joint"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white outline-none focus:border-teal-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1 font-bold">Category Name *</label>
                  <input
                    type="text"
                    required
                    value={serviceForm.categoryName || ''}
                    onChange={(e) => setServiceForm({ ...serviceForm, categoryName: e.target.value })}
                    placeholder="e.g. Ghost Mannequin / Apparel Retouching"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white outline-none focus:border-teal-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1 font-bold">Category Key</label>
                  <select
                    value={serviceForm.category || 'photo-editing'}
                    onChange={(e) => setServiceForm({ ...serviceForm, category: e.target.value as any })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white outline-none focus:border-teal-500"
                  >
                    <option value="photo-editing">photo-editing</option>
                    <option value="ghost-mannequin">ghost-mannequin</option>
                    <option value="jersey-editing">jersey-editing</option>
                    <option value="size-chart">size-chart</option>
                    <option value="magic-layer">magic-layer</option>
                    <option value="video-editing">video-editing</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 mb-1 font-bold">Delivery SLA</label>
                  <input
                    type="text"
                    value={serviceForm.deliveryTime || '24 Hours'}
                    onChange={(e) => setServiceForm({ ...serviceForm, deliveryTime: e.target.value })}
                    placeholder="e.g. 12-24 Hours"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white outline-none focus:border-teal-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1 font-bold">Starting Price (₹) *</label>
                  <input
                    type="number"
                    required
                    value={serviceForm.startingPrice || 499}
                    onChange={(e) => setServiceForm({ ...serviceForm, startingPrice: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white outline-none focus:border-teal-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1 font-bold">Sale Price (Optional ₹)</label>
                  <input
                    type="number"
                    value={serviceForm.salePrice || ''}
                    onChange={(e) => setServiceForm({ ...serviceForm, salePrice: e.target.value ? Number(e.target.value) : undefined })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white outline-none focus:border-teal-500"
                  />
                </div>
              </div>

              {/* Descriptions & Image */}
              <div className="space-y-3">
                <div>
                  <label className="block text-slate-400 mb-1 font-bold">Image URL *</label>
                  <input
                    type="text"
                    required
                    value={serviceForm.imageUrl || ''}
                    onChange={(e) => setServiceForm({ ...serviceForm, imageUrl: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white outline-none focus:border-teal-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1 font-bold">Short Description *</label>
                  <input
                    type="text"
                    required
                    value={serviceForm.shortDescription || ''}
                    onChange={(e) => setServiceForm({ ...serviceForm, shortDescription: e.target.value })}
                    placeholder="Brief 1-sentence summary"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white outline-none focus:border-teal-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1 font-bold">Full Detailed Description</label>
                  <textarea
                    rows={3}
                    value={serviceForm.fullDescription || ''}
                    onChange={(e) => setServiceForm({ ...serviceForm, fullDescription: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white outline-none focus:border-teal-500"
                  />
                </div>
              </div>

              {/* FEATURES LIST EDITOR */}
              <div className="space-y-3 bg-slate-950 border border-slate-800 rounded-2xl p-4">
                <div className="flex justify-between items-center">
                  <label className="font-bold text-teal-400 uppercase tracking-wider text-xs">
                    Features Checklist Bullet Points
                  </label>
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={newFeatureText}
                    onChange={(e) => setNewFeatureText(e.target.value)}
                    placeholder="e.g. Amazon RGB 255 compliant pure white isolation"
                    className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                  />
                  <button
                    type="button"
                    onClick={handleAddFeature}
                    className="px-4 py-2 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs"
                  >
                    Add Feature
                  </button>
                </div>

                <div className="space-y-1.5 pt-2">
                  {(serviceForm.features || []).map((feat, idx) => (
                    <div key={idx} className="flex items-center justify-between bg-slate-900 border border-slate-850 rounded-xl px-3 py-2 text-xs">
                      <span className="text-slate-200">✓ {feat}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveFeature(idx)}
                        className="text-slate-500 hover:text-red-400 p-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* MARKETPLACE TAGS */}
              <div className="space-y-3 bg-slate-950 border border-slate-800 rounded-2xl p-4">
                <label className="font-bold text-purple-400 uppercase tracking-wider text-xs block">
                  Marketplace Platform Tags
                </label>

                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={newTagText}
                    onChange={(e) => setNewTagText(e.target.value)}
                    placeholder="e.g. Amazon, Flipkart, Shopify, Etsy"
                    className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                  />
                  <button
                    type="button"
                    onClick={handleAddTag}
                    className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs"
                  >
                    Add Tag
                  </button>
                </div>

                <div className="flex flex-wrap gap-1.5 pt-2">
                  {(serviceForm.marketplaceTags || []).map((tag, idx) => (
                    <span key={idx} className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 text-xs flex items-center space-x-1.5">
                      <span>{tag}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(idx)}
                        className="text-slate-500 hover:text-red-400"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsEditingService(false)}
                  className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-teal-500 to-purple-600 hover:from-teal-400 hover:to-purple-500 text-slate-950 font-black flex items-center space-x-2"
                >
                  {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  <span>Save Service & Publish to Catalog</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= FULL INQUIRY DETAIL MODAL ================= */}
      {selectedInquiry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 overflow-y-auto">
          <div className="w-full max-w-3xl my-8 bg-slate-900 border border-teal-500/40 rounded-3xl p-6 sm:p-8 space-y-6 text-white max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex justify-between items-center border-b border-slate-800 pb-4">
              <div>
                <span className="text-[10px] font-mono text-teal-300 bg-slate-950 px-2.5 py-1 rounded-md border border-slate-800">
                  {selectedInquiry.id}
                </span>
                <h3 className="text-lg font-bold text-white mt-1">
                  Project Brief: {selectedInquiry.serviceTitle}
                </h3>
              </div>
              <button
                onClick={() => setSelectedInquiry(null)}
                className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="space-y-5 text-xs">
              {/* Customer Info Grid */}
              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 grid grid-cols-2 sm:grid-cols-3 gap-4">
                <div>
                  <span className="text-slate-500 block">Customer Name</span>
                  <strong className="text-white">{selectedInquiry.customerName}</strong>
                </div>
                <div>
                  <span className="text-slate-500 block">Email</span>
                  <strong className="text-white">{selectedInquiry.customerEmail}</strong>
                </div>
                <div>
                  <span className="text-slate-500 block">WhatsApp / Phone</span>
                  <strong className="text-teal-300">{selectedInquiry.customerPhone}</strong>
                </div>
                <div>
                  <span className="text-slate-500 block">Company / Brand</span>
                  <strong className="text-white">{selectedInquiry.brandName || 'N/A'}</strong>
                </div>
                <div>
                  <span className="text-slate-500 block">Quantity / Scope</span>
                  <strong className="text-white">{selectedInquiry.quantity || 1} Units</strong>
                </div>
                <div>
                  <span className="text-slate-500 block">Marketplace</span>
                  <strong className="text-amber-300">{selectedInquiry.platform}</strong>
                </div>
              </div>

              {/* Custom Technical Answers */}
              {selectedInquiry.customFieldsData && Object.keys(selectedInquiry.customFieldsData).length > 0 && (
                <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 space-y-2">
                  <h4 className="text-xs font-bold text-teal-400 uppercase tracking-wider">
                    Service-Specific Technical Specifications
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    {Object.entries(selectedInquiry.customFieldsData).map(([key, val]) => (
                      <div key={key} className="bg-slate-900 border border-slate-850 rounded-xl p-3">
                        <span className="text-slate-500 capitalize block text-[11px]">{(key || '').replace(/([A-Z])/g, ' $1')}</span>
                        <strong className="text-white text-xs block mt-0.5">{String(val)}</strong>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Special Instructions */}
              {selectedInquiry.specialInstructions && (
                <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 space-y-1">
                  <span className="text-slate-500 block font-bold">Special Instructions / Guidelines:</span>
                  <p className="text-slate-300 leading-relaxed">{selectedInquiry.specialInstructions}</p>
                </div>
              )}

              {/* Reference Links & Uploaded Assets */}
              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 space-y-3">
                <span className="text-slate-500 block font-bold">Assets & Reference Files:</span>
                {selectedInquiry.referenceLinks && (
                  <div className="flex items-center space-x-2">
                    <span className="text-slate-400">Drive Folder:</span>
                    <a
                      href={selectedInquiry.referenceLinks}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-teal-400 hover:underline flex items-center space-x-1"
                    >
                      <span>{selectedInquiry.referenceLinks}</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                )}

                {selectedInquiry.uploadedFiles?.length > 0 && (
                  <div className="flex flex-wrap gap-2 pt-1">
                    {selectedInquiry.uploadedFiles.map((fname: string, i: number) => (
                      <span key={i} className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 font-mono text-[11px]">
                        📎 {fname}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Admin Quote & Notes Update */}
              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 space-y-3">
                <h4 className="text-xs font-bold text-purple-300 uppercase tracking-wider">
                  Admin Response & Quote Configuration
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-400 mb-1">Official Quote Amount (₹)</label>
                    <input
                      type="number"
                      value={adminQuoteInput}
                      onChange={(e) => setAdminQuoteInput(e.target.value)}
                      placeholder="e.g. 2499"
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-400 mb-1">Current Production Status</label>
                    <select
                      value={selectedInquiry.status || 'New'}
                      onChange={(e) => handleUpdateInquiryStatus(selectedInquiry.id, e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-teal-300 font-bold"
                    >
                      <option value="New">🟢 New Inquiry</option>
                      <option value="Reviewing">🟡 In Review</option>
                      <option value="Quoted">🔵 Quote Sent</option>
                      <option value="Approved">🟣 Approved & Active</option>
                      <option value="Converted">✨ Converted to Order</option>
                      <option value="Closed">⚪ Closed</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">Internal Notes & Production Instructions</label>
                  <textarea
                    rows={2}
                    value={adminNotesInput}
                    onChange={(e) => setAdminNotesInput(e.target.value)}
                    placeholder="e.g. Assigned to senior retoucher for neck joint alignment..."
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-white"
                  />
                </div>
              </div>

              {/* Modal Actions */}
              <div className="flex justify-between items-center pt-3 border-t border-slate-800">
                <a
                  href={`https://wa.me/${(selectedInquiry.customerPhone || '').replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Hello ${selectedInquiry.customerName}, regarding your VantageEcom Inquiry (Ref: ${selectedInquiry.id}) for ${selectedInquiry.serviceTitle}...`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold flex items-center space-x-2"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Send WhatsApp Message</span>
                </a>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setSelectedInquiry(null)}
                    className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold"
                  >
                    Close
                  </button>
                  <button
                    onClick={() => handleUpdateInquiryStatus(selectedInquiry.id, selectedInquiry.status || 'New')}
                    className="px-5 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-black"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= EDIT BEFORE/AFTER MODAL ================= */}
      {editingBa && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
          <div className="w-full max-w-xl bg-slate-900 border border-teal-500/40 rounded-3xl p-6 space-y-4 text-white text-xs">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold">
                {editingBa.id ? 'Edit Comparison Showcase' : 'Add New Before/After Item'}
              </h3>
              <button onClick={() => setEditingBa(null)} className="p-1 text-slate-400 hover:text-white">
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveBeforeAfter} className="space-y-3">
              <div>
                <label className="block text-slate-400 mb-1 font-bold">Card Title *</label>
                <input
                  type="text"
                  required
                  value={editingBa.title || ''}
                  onChange={(e) => setEditingBa({ ...editingBa, title: e.target.value })}
                  placeholder="e.g. 3D Ghost Mannequin Hollow Neck"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-bold">Category Tag</label>
                <input
                  type="text"
                  value={editingBa.category || ''}
                  onChange={(e) => setEditingBa({ ...editingBa, category: e.target.value })}
                  placeholder="e.g. Ghost Mannequin"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-bold">Before Image URL *</label>
                <input
                  type="text"
                  required
                  value={editingBa.beforeImage || ''}
                  onChange={(e) => setEditingBa({ ...editingBa, beforeImage: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-bold">After Image URL *</label>
                <input
                  type="text"
                  required
                  value={editingBa.afterImage || ''}
                  onChange={(e) => setEditingBa({ ...editingBa, afterImage: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-bold">Description</label>
                <textarea
                  rows={2}
                  value={editingBa.description || ''}
                  onChange={(e) => setEditingBa({ ...editingBa, description: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setEditingBa(null)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 bg-teal-500 hover:bg-teal-400 text-slate-950 font-black rounded-xl"
                >
                  Save Comparison
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
