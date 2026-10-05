import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Search,
  Filter,
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  Clock,
  Zap,
  Download,
  ExternalLink,
  MessageSquare,
  RefreshCw,
  Eye,
  Sliders,
  DollarSign,
  Package,
  TrendingUp,
  X,
  FileCheck,
  AlertCircle,
  Phone,
  Mail,
  User,
  ShieldAlert,
  Image as ImageIcon,
  Star,
  Layers,
  Upload,
  Check,
} from 'lucide-react';
import { QuickDigitalService, QuickFixOrder } from '../../../types';
import { QuickServiceIcon } from '../../quick-services/QuickServiceIcon';

export const QuickDigitalServicesCMS: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'orders' | 'services' | 'analytics'>('orders');
  
  // Orders State
  const [orders, setOrders] = useState<QuickFixOrder[]>([]);
  const [ordersLoading, setOrdersLoading] = useState<boolean>(true);
  const [orderSearch, setOrderSearch] = useState<string>('');
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>('ALL');
  const [selectedOrder, setSelectedOrder] = useState<QuickFixOrder | null>(null);

  // Deliverable update states inside modal
  const [statusUpdate, setStatusUpdate] = useState<string>('Pending');
  const [completedFileUrl, setCompletedFileUrl] = useState<string>('');
  const [completedFileName, setCompletedFileName] = useState<string>('');
  const [completedFileSize, setCompletedFileSize] = useState<string>('');
  const [designerNotes, setDesignerNotes] = useState<string>('');
  const [adminNotes, setAdminNotes] = useState<string>('');
  const [isSavingOrder, setIsSavingOrder] = useState<boolean>(false);

  // Services State
  const [services, setServices] = useState<QuickDigitalService[]>([]);
  const [servicesLoading, setServicesLoading] = useState<boolean>(true);
  const [serviceSearch, setServiceSearch] = useState<string>('');
  const [serviceCategoryFilter, setServiceCategoryFilter] = useState<string>('ALL');
  const [editingService, setEditingService] = useState<QuickDigitalService | null>(null);
  const [isCreateServiceOpen, setIsCreateServiceOpen] = useState<boolean>(false);

  // New Service Form State
  const [newServiceName, setNewServiceName] = useState('');
  const [newServiceCategory, setNewServiceCategory] = useState('Image Fix');
  const [newServiceDesc, setNewServiceDesc] = useState('');
  const [newServicePrice, setNewServicePrice] = useState<number>(49);
  const [newServiceDelivery, setNewServiceDelivery] = useState('Same Day');
  const [newServiceIcon, setNewServiceIcon] = useState('Sparkles');
  const [newServiceImageUrl, setNewServiceImageUrl] = useState('https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80');
  const [newServiceProblems, setNewServiceProblems] = useState<string>('Standard fix 1, Standard fix 2');
  const [newServicePopular, setNewServicePopular] = useState(false);
  const [newServiceRecommended, setNewServiceRecommended] = useState(false);
  const [newServiceFormats, setNewServiceFormats] = useState('JPG, PNG, WEBP, PSD');

  // Problem tag addition state in Edit modal
  const [newProblemInput, setNewProblemInput] = useState<string>('');

  // Analytics State
  const [analytics, setAnalytics] = useState<any>(null);

  // Sample Image Presets for Quick Image Selection
  const imagePresets = [
    { label: 'Shoes / Product', url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80' },
    { label: 'Camera / Tech', url: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=800&q=80' },
    { label: 'E-commerce Model', url: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80' },
    { label: 'Logo / Graphic', url: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?auto=format&fit=crop&w=800&q=80' },
    { label: 'Packaging / Box', url: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&w=800&q=80' },
    { label: 'Portrait / Face', url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80' },
    { label: 'Apparel / Fashion', url: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=800&q=80' },
    { label: 'Document / Scan', url: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=800&q=80' },
  ];

  // Fetch Orders
  const fetchOrders = async () => {
    try {
      setOrdersLoading(true);
      const res = await fetch('/api/quick-fix-orders');
      if (res.ok) {
        const data = await res.json();
        setOrders(data);
      }
    } catch (err) {
      console.error('Error fetching orders:', err);
    } finally {
      setOrdersLoading(false);
    }
  };

  // Fetch Services
  const fetchServices = async () => {
    try {
      setServicesLoading(true);
      const res = await fetch('/api/quick-services');
      if (res.ok) {
        const data = await res.json();
        setServices(data);
      }
    } catch (err) {
      console.error('Error fetching services:', err);
    } finally {
      setServicesLoading(false);
    }
  };

  // Fetch Analytics
  const fetchAnalytics = async () => {
    try {
      const res = await fetch('/api/quick-services/analytics');
      if (res.ok) {
        const data = await res.json();
        setAnalytics(data);
      }
    } catch (err) {
      console.error('Error fetching analytics:', err);
    }
  };

  useEffect(() => {
    fetchOrders();
    fetchServices();
    fetchAnalytics();
  }, []);

  // Filter Orders
  const filteredOrders = orders.filter((o) => {
    const statusMatch = orderStatusFilter === 'ALL' || o.status === orderStatusFilter;
    const q = orderSearch.toLowerCase();
    const searchMatch =
      !q ||
      o.id.toLowerCase().includes(q) ||
      o.serviceName.toLowerCase().includes(q) ||
      o.customerName.toLowerCase().includes(q) ||
      o.customerEmail.toLowerCase().includes(q) ||
      (o.customerPhone && o.customerPhone.toLowerCase().includes(q));

    return statusMatch && searchMatch;
  });

  // Filter Services
  const filteredServices = services.filter((s) => {
    const catMatch = serviceCategoryFilter === 'ALL' || s.category.toLowerCase() === serviceCategoryFilter.toLowerCase();
    const q = serviceSearch.toLowerCase();
    const searchMatch =
      !q ||
      s.name.toLowerCase().includes(q) ||
      s.description.toLowerCase().includes(q) ||
      s.category.toLowerCase().includes(q);

    return catMatch && searchMatch;
  });

  const handleOpenOrderDetail = (order: QuickFixOrder) => {
    setSelectedOrder(order);
    setStatusUpdate(order.status);
    setCompletedFileUrl(order.completedFileUrl || '');
    setCompletedFileName(order.completedFileName || '');
    setCompletedFileSize(order.completedFileSize || '');
    setDesignerNotes(order.designerNotes || '');
    setAdminNotes(order.adminNotes || '');
  };

  const handleSaveOrderUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrder) return;

    setIsSavingOrder(true);
    try {
      if (statusUpdate === 'Delivered' || completedFileUrl.trim()) {
        // Deliver endpoint
        const res = await fetch(`/api/quick-fix-orders/${selectedOrder.id}/deliver`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            completedFileUrl: completedFileUrl || selectedOrder.uploadedFileUrl,
            completedFileName: completedFileName || `${selectedOrder.id}_fixed.png`,
            completedFileSize: completedFileSize || '1.2 MB',
            designerNotes,
            adminNotes,
          }),
        });
        const data = await res.json();
        if (data.success) {
          fetchOrders();
          fetchAnalytics();
          setSelectedOrder(data.order);
          alert('Deliverable file uploaded & status set to Delivered!');
        }
      } else {
        // Status update endpoint
        const res = await fetch(`/api/quick-fix-orders/${selectedOrder.id}/status`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            status: statusUpdate,
            adminNotes,
          }),
        });
        const data = await res.json();
        if (data.success) {
          fetchOrders();
          fetchAnalytics();
          setSelectedOrder(data.order);
          alert(`Order status updated to ${statusUpdate}!`);
        }
      }
    } catch (err: any) {
      alert(err.message || 'Failed to update order');
    } finally {
      setIsSavingOrder(false);
    }
  };

  const handleToggleServiceEnabled = async (service: QuickDigitalService) => {
    try {
      const res = await fetch(`/api/quick-services/${service.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ enabled: !service.enabled }),
      });
      if (res.ok) {
        fetchServices();
      }
    } catch (err) {
      console.error('Failed to toggle service status:', err);
    }
  };

  const handleSaveServiceEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingService) return;

    try {
      const res = await fetch(`/api/quick-services/${editingService.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingService),
      });
      if (res.ok) {
        setEditingService(null);
        fetchServices();
        alert('Service updated successfully!');
      }
    } catch (err) {
      console.error('Failed to update service:', err);
    }
  };

  const handleCreateService = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newServiceName || !newServicePrice) {
      alert('Please fill required fields.');
      return;
    }

    try {
      const payload = {
        name: newServiceName,
        category: newServiceCategory,
        description: newServiceDesc,
        price: Number(newServicePrice),
        deliveryTime: newServiceDelivery,
        iconName: newServiceIcon,
        imageUrl: newServiceImageUrl || 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80',
        thumbnailUrl: newServiceImageUrl || '',
        commonProblems: newServiceProblems.split(',').map((p) => p.trim()).filter(Boolean),
        supportedFileTypes: newServiceFormats.split(',').map((f) => f.trim()).filter(Boolean),
        popular: newServicePopular,
        recommended: newServiceRecommended,
        enabled: true,
      };

      const res = await fetch('/api/quick-services', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setIsCreateServiceOpen(false);
        setNewServiceName('');
        setNewServiceDesc('');
        setNewServiceProblems('Standard fix 1, Standard fix 2');
        setNewServicePopular(false);
        setNewServiceRecommended(false);
        fetchServices();
        alert('New Quick Service created successfully!');
      }
    } catch (err) {
      console.error('Error creating service:', err);
    }
  };

  const handleDeleteService = async (id: string, name: string) => {
    if (!window.confirm(`Are you sure you want to delete "${name}"?`)) return;
    try {
      const res = await fetch(`/api/quick-services/${id}`, { method: 'DELETE' });
      if (res.ok) {
        fetchServices();
      }
    } catch (err) {
      console.error('Failed to delete service:', err);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-purple-600 via-amber-500 to-teal-500 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-black uppercase tracking-wider bg-black/20 backdrop-blur-md px-3 py-1 rounded-full w-fit mb-2">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Digital Repair Counter CMS</span>
          </div>
          <h2 className="text-2xl font-black">Quick Digital Services Manager</h2>
          <p className="text-xs text-white/90 mt-1 max-w-xl">
            Manage incoming repair requests, deliver fixed high-resolution assets to clients, and configure the 40+ micro-service catalog.
          </p>
        </div>

        {/* Quick Stats Pills */}
        <div className="flex items-center gap-3">
          <div className="px-4 py-2.5 rounded-2xl bg-black/20 backdrop-blur-md text-center border border-white/10">
            <span className="text-[10px] uppercase font-bold text-white/70 block">Total Orders</span>
            <span className="text-xl font-black">{analytics?.totalOrders ?? orders.length}</span>
          </div>
          <div className="px-4 py-2.5 rounded-2xl bg-black/20 backdrop-blur-md text-center border border-white/10">
            <span className="text-[10px] uppercase font-bold text-white/70 block">Revenue</span>
            <span className="text-xl font-black">₹{analytics?.totalRevenue ?? 0}</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center space-x-2 border-b border-slate-200 dark:border-slate-800 pb-3">
        <button
          onClick={() => setActiveTab('orders')}
          className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center space-x-2 ${
            activeTab === 'orders'
              ? 'bg-purple-600 text-white shadow-md'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-white'
          }`}
        >
          <Package className="w-4 h-4" />
          <span>Customer Orders ({orders.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('services')}
          className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center space-x-2 ${
            activeTab === 'services'
              ? 'bg-purple-600 text-white shadow-md'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-white'
          }`}
        >
          <Sliders className="w-4 h-4" />
          <span>Catalog Management ({services.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('analytics')}
          className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center space-x-2 ${
            activeTab === 'analytics'
              ? 'bg-purple-600 text-white shadow-md'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-white'
          }`}
        >
          <TrendingUp className="w-4 h-4" />
          <span>Performance & Analytics</span>
        </button>
      </div>

      {/* ======================================================== */}
      {/* TAB 1: CUSTOMER ORDERS MANAGEMENT */}
      {/* ======================================================== */}
      {activeTab === 'orders' && (
        <div className="space-y-4">
          
          {/* Filters Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search orders by ID, customer name, email, phone..."
                value={orderSearch}
                onChange={(e) => setOrderSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-purple-500"
              />
            </div>

            <div className="flex items-center space-x-2 overflow-x-auto">
              {['ALL', 'Pending', 'In Progress', 'Quality Check', 'Delivered'].map((st) => (
                <button
                  key={st}
                  onClick={() => setOrderStatusFilter(st)}
                  className={`px-3 py-1.5 rounded-lg text-[11px] font-bold whitespace-nowrap transition-colors ${
                    orderStatusFilter === st
                      ? 'bg-purple-600 text-white'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-white'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          {/* Orders Table */}
          {ordersLoading ? (
            <div className="py-16 text-center text-xs text-slate-400">Loading orders...</div>
          ) : filteredOrders.length === 0 ? (
            <div className="py-16 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8 space-y-2">
              <Package className="w-10 h-10 text-slate-400 mx-auto" />
              <p className="text-sm font-bold text-slate-900 dark:text-white">No quick fix orders found</p>
              <p className="text-xs text-slate-500">Orders placed by customers will appear here.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-3">
              {filteredOrders.map((ord) => {
                const isDelivered = ord.status === 'Delivered';
                return (
                  <div
                    key={ord.id}
                    className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-purple-500/50 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
                  >
                    <div className="flex items-start space-x-4">
                      {ord.uploadedFileUrl ? (
                        <img
                          src={ord.uploadedFileUrl}
                          alt="Source"
                          className="w-16 h-16 rounded-xl object-cover border border-slate-200 dark:border-slate-700 shrink-0"
                        />
                      ) : (
                        <div className="w-16 h-16 rounded-xl bg-purple-600 text-white flex items-center justify-center font-black">
                          FIX
                        </div>
                      )}

                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <span className="font-black text-sm text-purple-600 dark:text-teal-400">{ord.id}</span>
                          <span
                            className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase ${
                              isDelivered
                                ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/30'
                                : ord.status === 'In Progress'
                                ? 'bg-blue-500/10 text-blue-400 border border-blue-500/30'
                                : 'bg-amber-500/10 text-amber-500 border border-amber-500/30'
                            }`}
                          >
                            {ord.status}
                          </span>
                          {ord.rushDelivery && (
                            <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase bg-red-500/10 text-red-500 border border-red-500/30 flex items-center space-x-1">
                              <Zap className="w-2.5 h-2.5" />
                              <span>Rush 1-Hr</span>
                            </span>
                          )}
                        </div>

                        <h4 className="text-sm font-black text-slate-900 dark:text-white">
                          {ord.serviceName}
                        </h4>

                        <p className="text-xs text-slate-500">
                          👤 <strong>{ord.customerName}</strong> ({ord.customerEmail} {ord.customerPhone ? `• ${ord.customerPhone}` : ''})
                        </p>

                        <p className="text-[11px] text-slate-400">
                          🎯 Requirement: <span className="text-slate-300">{ord.selectedRequirement}</span>
                          {ord.additionalInstructions && ` • Notes: "${ord.additionalInstructions}"`}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-row md:flex-col items-center md:items-end justify-between gap-2 shrink-0 border-t md:border-t-0 pt-3 md:pt-0 border-slate-100 dark:border-slate-800">
                      <div className="text-right">
                        <span className="text-base font-black text-amber-500">₹{ord.totalPrice}</span>
                        <span className="text-[10px] text-slate-400 block">{new Date(ord.createdAt).toLocaleDateString()}</span>
                      </div>

                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleOpenOrderDetail(ord)}
                          className="px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-md transition-all flex items-center space-x-1.5"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                          <span>Manage & Deliver</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 2: SERVICE CATALOG (40 SERVICES) MANAGEMENT */}
      {/* ======================================================== */}
      {activeTab === 'services' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search catalog by name, category, problem..."
                value={serviceSearch}
                onChange={(e) => setServiceSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-purple-500"
              />
            </div>

            <div className="flex items-center space-x-2">
              <select
                value={serviceCategoryFilter}
                onChange={(e) => setServiceCategoryFilter(e.target.value)}
                className="px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white"
              >
                <option value="ALL">All Categories</option>
                <option value="Image Fix">Image Fix</option>
                <option value="Logo Fix">Logo Fix</option>
                <option value="E-commerce Fix">E-commerce Fix</option>
                <option value="Social Media Fix">Social Media Fix</option>
                <option value="File Conversion">File Conversion</option>
                <option value="Print Fix">Print Fix</option>
                <option value="Photo Fix">Photo Fix</option>
              </select>

              <button
                onClick={() => setIsCreateServiceOpen(true)}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition-all flex items-center space-x-1.5 shrink-0"
              >
                <Plus className="w-4 h-4" />
                <span>Add Service</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredServices.map((srv) => (
              <div
                key={srv.id}
                className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col justify-between hover:border-purple-500/50 transition-all shadow-sm"
              >
                <div>
                  {/* Service Card Image Banner */}
                  <div className="relative h-32 w-full bg-slate-100 dark:bg-slate-950 overflow-hidden border-b border-slate-100 dark:border-slate-800">
                    <img
                      src={srv.imageUrl || srv.exampleAfterImage || 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80'}
                      alt={srv.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                      loading="lazy"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80';
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />

                    <div className="absolute top-2 left-2 right-2 flex items-center justify-between pointer-events-none">
                      <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-black/60 backdrop-blur-md text-white border border-white/20">
                        {srv.category}
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleToggleServiceEnabled(srv);
                        }}
                        className={`pointer-events-auto px-2 py-0.5 rounded-full text-[9px] font-black uppercase transition-all ${
                          srv.enabled
                            ? 'bg-emerald-500 text-slate-950 shadow-sm'
                            : 'bg-red-500/80 text-white'
                        }`}
                      >
                        {srv.enabled ? 'Active' : 'Disabled'}
                      </button>
                    </div>

                    <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between">
                      <div className="w-7 h-7 rounded-lg bg-purple-600/90 backdrop-blur-md text-white flex items-center justify-center shadow-md">
                        <QuickServiceIcon name={srv.iconName} className="w-3.5 h-3.5" />
                      </div>
                      <div className="flex items-center space-x-1">
                        {srv.popular && (
                          <span className="px-1.5 py-0.5 rounded text-[8px] font-black uppercase bg-amber-500 text-slate-950 flex items-center space-x-0.5">
                            <Star className="w-2 h-2 fill-current" />
                            <span>Pop</span>
                          </span>
                        )}
                        <span className="px-1.5 py-0.5 rounded text-[9px] font-bold text-white bg-black/60 backdrop-blur-md">
                          {srv.deliveryTime}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 space-y-2">
                    <h4 className="text-sm font-black text-slate-900 dark:text-white leading-snug">
                      {srv.name}
                    </h4>
                    <p className="text-xs text-slate-500 line-clamp-2">{srv.description}</p>
                    
                    {srv.commonProblems && srv.commonProblems.length > 0 && (
                      <div className="pt-2 flex flex-wrap gap-1">
                        {srv.commonProblems.slice(0, 2).map((p, idx) => (
                          <span key={idx} className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-[10px] text-slate-600 dark:text-slate-300 line-clamp-1">
                            • {p}
                          </span>
                        ))}
                        {srv.commonProblems.length > 2 && (
                          <span className="text-[10px] text-purple-600 dark:text-teal-400 font-bold self-center">
                            +{srv.commonProblems.length - 2} more
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                <div className="p-4 pt-0">
                  <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                    <div>
                      <span className="font-black text-amber-500 text-sm">₹{srv.price}</span>
                      <span className="text-[10px] text-slate-400 ml-1">/ fix</span>
                    </div>

                    <div className="flex items-center space-x-1.5">
                      <button
                        onClick={() => {
                          setEditingService(srv);
                          setNewProblemInput('');
                        }}
                        className="px-2.5 py-1.5 rounded-lg bg-purple-50 dark:bg-purple-950/40 hover:bg-purple-600 hover:text-white text-purple-600 dark:text-purple-300 font-bold transition-colors flex items-center space-x-1"
                        title="Edit Service & Images"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                        <span>Edit</span>
                      </button>
                      <button
                        onClick={() => handleDeleteService(srv.id, srv.name)}
                        className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-red-600 hover:text-white text-slate-600 dark:text-slate-300 transition-colors"
                        title="Delete Service"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 3: PERFORMANCE & ANALYTICS */}
      {/* ======================================================== */}
      {activeTab === 'analytics' && analytics && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-400">Total Orders</span>
              <div className="text-2xl font-black text-purple-600 dark:text-teal-400">{analytics.totalOrders}</div>
              <span className="text-[11px] text-emerald-500 font-bold">100% On-Time Delivery</span>
            </div>

            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-400">Total Revenue</span>
              <div className="text-2xl font-black text-amber-500">₹{analytics.totalRevenue}</div>
              <span className="text-[11px] text-slate-400">Average ticket: ₹{Math.round(analytics.totalRevenue / Math.max(1, analytics.totalOrders))}</span>
            </div>

            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-400">Avg Delivery Speed</span>
              <div className="text-2xl font-black text-slate-900 dark:text-white">{analytics.averageDeliverySpeed}</div>
              <span className="text-[11px] text-teal-400 font-bold">Super Fast Turnaround</span>
            </div>

            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-400">Customer Satisfaction</span>
              <div className="text-2xl font-black text-emerald-500">{analytics.satisfactionRate}</div>
              <span className="text-[11px] text-slate-400">Zero unresolved revisions</span>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MANAGE & DELIVER ORDER DRAWER MODAL */}
      {/* ======================================================== */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4">
          <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden my-6">
            
            <div className="px-6 py-4 bg-purple-900/20 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold text-purple-400 uppercase">Order Management</span>
                <h3 className="text-base font-black text-slate-900 dark:text-white">
                  {selectedOrder.id} • {selectedOrder.serviceName}
                </h3>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveOrderUpdate} className="p-6 space-y-5 max-h-[75vh] overflow-y-auto text-xs">
              
              {/* Customer & Source File Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Customer Information</span>
                  <p className="font-bold text-slate-900 dark:text-white">{selectedOrder.customerName}</p>
                  <p className="text-slate-500 flex items-center space-x-1">
                    <Mail className="w-3 h-3" />
                    <span>{selectedOrder.customerEmail}</span>
                  </p>
                  {selectedOrder.customerPhone && (
                    <p className="text-slate-500 flex items-center space-x-1">
                      <Phone className="w-3 h-3 text-emerald-400" />
                      <a
                        href={`https://wa.me/${selectedOrder.customerPhone.replace(/[^0-9]/g, '')}`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-emerald-500 hover:underline font-bold"
                      >
                        {selectedOrder.customerPhone} (WhatsApp)
                      </a>
                    </p>
                  )}
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Uploaded Source Asset</span>
                  <div className="flex items-center space-x-2 pt-1">
                    {selectedOrder.uploadedFileUrl && (
                      <a
                        href={selectedOrder.uploadedFileUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-xl bg-purple-600 text-white font-bold"
                      >
                        <Download className="w-3 h-3" />
                        <span>Download Source File</span>
                      </a>
                    )}
                  </div>
                  <p className="text-[10px] text-slate-400 mt-1">
                    File: {selectedOrder.uploadedFileName} ({selectedOrder.uploadedFileSize})
                  </p>
                </div>
              </div>

              {/* Requirement & Instructions */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Requirement & Notes</span>
                <p className="font-bold text-purple-600 dark:text-teal-400">🎯 {selectedOrder.selectedRequirement}</p>
                {selectedOrder.additionalInstructions && (
                  <p className="text-slate-600 dark:text-slate-300 italic pt-1">
                    "{selectedOrder.additionalInstructions}"
                  </p>
                )}
              </div>

              {/* Status Selector */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-400 uppercase">Update Status:</label>
                <select
                  value={statusUpdate}
                  onChange={(e) => setStatusUpdate(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white"
                >
                  <option value="Pending">Pending (Queue)</option>
                  <option value="In Progress">In Progress (Senior Retoucher Working)</option>
                  <option value="Quality Check">Quality Check (Resolution Verification)</option>
                  <option value="Delivered">Delivered (Completed File Uploaded)</option>
                </select>
              </div>

              {/* Completed Deliverable File Upload / Attachment */}
              <div className="p-4 rounded-2xl bg-purple-50/50 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-800 space-y-3">
                <div className="flex items-center space-x-2">
                  <FileCheck className="w-4 h-4 text-emerald-400" />
                  <span className="font-bold text-slate-900 dark:text-white">Deliver Corrected File</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">
                      Deliverable Image / File URL:
                    </label>
                    <input
                      type="text"
                      placeholder="https://images.unsplash.com/... or cloud link"
                      value={completedFileUrl}
                      onChange={(e) => setCompletedFileUrl(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">
                      Deliverable File Name:
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. shoe_product_transparent_fixed.png"
                      value={completedFileName}
                      onChange={(e) => setCompletedFileName(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">
                    Designer Notes for Customer:
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Handcrafted alpha channel cutout with feather 0.5px and pure white RGB 255 background."
                    value={designerNotes}
                    onChange={(e) => setDesignerNotes(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs"
                  />
                </div>
              </div>

              {/* Internal Admin Notes */}
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">
                  Internal Admin Notes (Private):
                </label>
                <input
                  type="text"
                  placeholder="e.g. Handled by Annu Dhaneja."
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs"
                />
              </div>

              <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setSelectedOrder(null)}
                  className="px-4 py-2 rounded-xl text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSavingOrder}
                  className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-black shadow-md flex items-center space-x-1.5"
                >
                  {isSavingOrder ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
                  <span>Save & Update Order</span>
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* EDIT SERVICE MODAL (IMAGES & FEATURES MANAGEMENT) */}
      {/* ======================================================== */}
      {editingService && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4">
          <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 space-y-5 my-6 max-h-[90vh] overflow-y-auto">
            
            <div className="flex justify-between items-center border-b border-slate-200 dark:border-slate-800 pb-3">
              <div>
                <span className="text-[10px] font-bold text-purple-500 uppercase tracking-wider">Service CMS Editor</span>
                <h3 className="font-black text-base text-slate-900 dark:text-white">
                  Edit Service: {editingService.name}
                </h3>
              </div>
              <button onClick={() => setEditingService(null)} className="text-slate-400 hover:text-white p-1 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveServiceEdit} className="space-y-5 text-xs">
              
              {/* IMAGE MANAGEMENT SECTION WITH LIVE PREVIEW */}
              <div className="p-4 rounded-2xl bg-purple-50/50 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-800 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="font-black text-slate-900 dark:text-white flex items-center space-x-1.5">
                    <ImageIcon className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                    <span>Real Service Image & Visual Showcase</span>
                  </label>
                  <span className="text-[10px] text-slate-400">Live Preview Updated in Real-Time</span>
                </div>

                {/* Live Image Preview Frame */}
                <div className="relative h-40 w-full rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                  <img
                    src={editingService.imageUrl || 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80'}
                    alt="Service Preview"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80';
                    }}
                  />
                  <div className="absolute bottom-2 left-2 px-2 py-1 rounded bg-black/70 backdrop-blur-md text-[10px] text-white font-bold">
                    Current Image Preview
                  </div>
                </div>

                {/* Image URL Input */}
                <div>
                  <label className="font-bold text-slate-400 block mb-1">
                    Image URL (Unsplash or Cloud Storage link):
                  </label>
                  <input
                    type="text"
                    value={editingService.imageUrl || ''}
                    onChange={(e) => setEditingService({ ...editingService, imageUrl: e.target.value })}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-mono"
                  />
                </div>

                {/* Quick Presets Picker */}
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1.5">
                    Quick Sample Image Presets (Click to Apply):
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {imagePresets.map((preset, pIdx) => (
                      <button
                        key={pIdx}
                        type="button"
                        onClick={() => setEditingService({ ...editingService, imageUrl: preset.url })}
                        className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all border ${
                          editingService.imageUrl === preset.url
                            ? 'bg-purple-600 text-white border-purple-500'
                            : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:bg-slate-100'
                        }`}
                      >
                        {preset.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Optional Before & After Image URL */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div>
                    <label className="font-bold text-slate-400 block mb-1">Example Before Image URL (Optional):</label>
                    <input
                      type="text"
                      value={editingService.exampleBeforeImage || ''}
                      onChange={(e) => setEditingService({ ...editingService, exampleBeforeImage: e.target.value })}
                      placeholder="https://..."
                      className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-400 block mb-1">Example After Image URL (Optional):</label>
                    <input
                      type="text"
                      value={editingService.exampleAfterImage || ''}
                      onChange={(e) => setEditingService({ ...editingService, exampleAfterImage: e.target.value })}
                      placeholder="https://..."
                      className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs"
                    />
                  </div>
                </div>
              </div>

              {/* CORE DETAILS */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-400 block mb-1">Service Title *</label>
                  <input
                    type="text"
                    required
                    value={editingService.name}
                    onChange={(e) => setEditingService({ ...editingService, name: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-400 block mb-1">Estimated Price (₹) *</label>
                  <input
                    type="number"
                    required
                    value={editingService.price}
                    onChange={(e) => setEditingService({ ...editingService, price: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 font-bold text-amber-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="font-bold text-slate-400 block mb-1">Category:</label>
                  <select
                    value={editingService.category}
                    onChange={(e) => setEditingService({ ...editingService, category: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800"
                  >
                    <option value="Image Fix">Image Fix</option>
                    <option value="Logo Fix">Logo Fix</option>
                    <option value="E-commerce Fix">E-commerce Fix</option>
                    <option value="Social Media Fix">Social Media Fix</option>
                    <option value="File Conversion">File Conversion</option>
                    <option value="Print Fix">Print Fix</option>
                    <option value="Photo Fix">Photo Fix</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-400 block mb-1">Delivery Speed:</label>
                  <input
                    type="text"
                    value={editingService.deliveryTime}
                    onChange={(e) => setEditingService({ ...editingService, deliveryTime: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-400 block mb-1">Icon Identifier:</label>
                  <input
                    type="text"
                    value={editingService.iconName}
                    onChange={(e) => setEditingService({ ...editingService, iconName: e.target.value })}
                    placeholder="e.g. Sparkles, Crop, Layers, Image"
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-400 block mb-1">Description:</label>
                <textarea
                  rows={2}
                  value={editingService.description}
                  onChange={(e) => setEditingService({ ...editingService, description: e.target.value })}
                  className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800"
                />
              </div>

              {/* COMMON PROBLEMS / FIXES LIST MANAGER */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-2.5">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-slate-900 dark:text-white">
                    Common Problems Solved (Interactive Checklist):
                  </label>
                  <span className="text-[10px] text-slate-400">
                    {editingService.commonProblems?.length || 0} fixes registered
                  </span>
                </div>

                <div className="space-y-1.5">
                  {editingService.commonProblems?.map((prob, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800"
                    >
                      <span className="text-slate-700 dark:text-slate-200 text-xs">
                        ✓ {prob}
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          const updated = editingService.commonProblems.filter((_, i) => i !== idx);
                          setEditingService({ ...editingService, commonProblems: updated });
                        }}
                        className="text-slate-400 hover:text-red-500 p-1"
                        title="Remove Problem"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Add new problem input */}
                <div className="flex items-center space-x-2 pt-1">
                  <input
                    type="text"
                    placeholder="Add another problem fix (e.g. Pixelation correction)..."
                    value={newProblemInput}
                    onChange={(e) => setNewProblemInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        if (newProblemInput.trim()) {
                          const updated = [...(editingService.commonProblems || []), newProblemInput.trim()];
                          setEditingService({ ...editingService, commonProblems: updated });
                          setNewProblemInput('');
                        }
                      }
                    }}
                    className="flex-1 px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (newProblemInput.trim()) {
                        const updated = [...(editingService.commonProblems || []), newProblemInput.trim()];
                        setEditingService({ ...editingService, commonProblems: updated });
                        setNewProblemInput('');
                      }
                    }}
                    className="px-3 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs"
                  >
                    + Add Fix
                  </button>
                </div>
              </div>

              {/* SUPPORTED FILE TYPES & BADGES */}
              <div>
                <label className="font-bold text-slate-400 block mb-1">Supported File Formats (Comma Separated):</label>
                <input
                  type="text"
                  value={Array.isArray(editingService.supportedFileTypes) ? editingService.supportedFileTypes.join(', ') : ''}
                  onChange={(e) =>
                    setEditingService({
                      ...editingService,
                      supportedFileTypes: e.target.value.split(',').map((f) => f.trim()).filter(Boolean),
                    })
                  }
                  placeholder="JPG, PNG, TIFF, PSD, PDF"
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800"
                />
              </div>

              <div className="flex flex-wrap items-center gap-4 pt-1">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingService.popular}
                    onChange={(e) => setEditingService({ ...editingService, popular: e.target.checked })}
                    className="rounded"
                  />
                  <span className="font-bold text-slate-700 dark:text-slate-300">⭐ Popular Badge</span>
                </label>

                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingService.recommended}
                    onChange={(e) => setEditingService({ ...editingService, recommended: e.target.checked })}
                    className="rounded"
                  />
                  <span className="font-bold text-slate-700 dark:text-slate-300">✨ Recommended Tag</span>
                </label>

                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingService.enabled}
                    onChange={(e) => setEditingService({ ...editingService, enabled: e.target.checked })}
                    className="rounded"
                  />
                  <span className="font-bold text-emerald-500">Active & Live in Catalog</span>
                </label>
              </div>

              <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setEditingService(null)}
                  className="px-4 py-2.5 rounded-xl text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-black shadow-md flex items-center space-x-1.5"
                >
                  <Check className="w-4 h-4" />
                  <span>Save Changes</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* CREATE NEW SERVICE MODAL */}
      {/* ======================================================== */}
      {isCreateServiceOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4">
          <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 space-y-5 my-6 max-h-[90vh] overflow-y-auto">
            
            <div className="flex justify-between items-center border-b border-slate-200 dark:border-slate-800 pb-3">
              <div>
                <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-wider">New Digital Solution</span>
                <h3 className="font-black text-base text-slate-900 dark:text-white">
                  Add New Quick Digital Service
                </h3>
              </div>
              <button onClick={() => setIsCreateServiceOpen(false)} className="text-slate-400 hover:text-white p-1 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateService} className="space-y-5 text-xs">
              
              {/* IMAGE SHOWCASE FOR NEW SERVICE */}
              <div className="p-4 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="font-black text-slate-900 dark:text-white flex items-center space-x-1.5">
                    <ImageIcon className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    <span>Real Service Image</span>
                  </label>
                  <span className="text-[10px] text-slate-400">Live Preview</span>
                </div>

                <div className="relative h-36 w-full rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                  <img
                    src={newServiceImageUrl || 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80'}
                    alt="New Service Preview"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80';
                    }}
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-400 block mb-1">Image URL:</label>
                  <input
                    type="text"
                    value={newServiceImageUrl}
                    onChange={(e) => setNewServiceImageUrl(e.target.value)}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-mono"
                  />
                </div>

                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1.5">
                    Or Select Preset Image:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {imagePresets.map((preset, pIdx) => (
                      <button
                        key={pIdx}
                        type="button"
                        onClick={() => setNewServiceImageUrl(preset.url)}
                        className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all border ${
                          newServiceImageUrl === preset.url
                            ? 'bg-emerald-600 text-white border-emerald-500'
                            : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:bg-slate-100'
                        }`}
                      >
                        {preset.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-400 block mb-1">Service Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. High-End Jewelry Reflection Fix"
                    value={newServiceName}
                    onChange={(e) => setNewServiceName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-400 block mb-1">Price (₹) *</label>
                  <input
                    type="number"
                    required
                    value={newServicePrice}
                    onChange={(e) => setNewServicePrice(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 font-bold text-amber-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="font-bold text-slate-400 block mb-1">Category *</label>
                  <select
                    value={newServiceCategory}
                    onChange={(e) => setNewServiceCategory(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800"
                  >
                    <option value="Image Fix">Image Fix</option>
                    <option value="Logo Fix">Logo Fix</option>
                    <option value="E-commerce Fix">E-commerce Fix</option>
                    <option value="Social Media Fix">Social Media Fix</option>
                    <option value="File Conversion">File Conversion</option>
                    <option value="Print Fix">Print Fix</option>
                    <option value="Photo Fix">Photo Fix</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-400 block mb-1">Delivery Speed:</label>
                  <input
                    type="text"
                    value={newServiceDelivery}
                    onChange={(e) => setNewServiceDelivery(e.target.value)}
                    placeholder="e.g. 1-2 Hours or Same Day"
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-400 block mb-1">Icon Identifier:</label>
                  <input
                    type="text"
                    value={newServiceIcon}
                    onChange={(e) => setNewServiceIcon(e.target.value)}
                    placeholder="Sparkles, Crop, Layers..."
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-400 block mb-1">Description:</label>
                <textarea
                  rows={2}
                  placeholder="Describe the quick digital solution..."
                  value={newServiceDesc}
                  onChange={(e) => setNewServiceDesc(e.target.value)}
                  className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800"
                />
              </div>

              <div>
                <label className="font-bold text-slate-400 block mb-1">Common Problems (Comma Separated):</label>
                <input
                  type="text"
                  placeholder="Fix 1, Fix 2, Fix 3"
                  value={newServiceProblems}
                  onChange={(e) => setNewServiceProblems(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800"
                />
              </div>

              <div>
                <label className="font-bold text-slate-400 block mb-1">Supported File Formats (Comma Separated):</label>
                <input
                  type="text"
                  placeholder="JPG, PNG, PSD, PDF"
                  value={newServiceFormats}
                  onChange={(e) => setNewServiceFormats(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800"
                />
              </div>

              <div className="flex items-center space-x-4">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    id="new-popular"
                    checked={newServicePopular}
                    onChange={(e) => setNewServicePopular(e.target.checked)}
                  />
                  <span className="font-bold text-slate-700 dark:text-slate-300">Mark as Most Popular</span>
                </label>

                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    id="new-recommended"
                    checked={newServiceRecommended}
                    onChange={(e) => setNewServiceRecommended(e.target.checked)}
                  />
                  <span className="font-bold text-slate-700 dark:text-slate-300">Mark as Recommended</span>
                </label>
              </div>

              <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsCreateServiceOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black shadow-md flex items-center space-x-1.5"
                >
                  <Plus className="w-4 h-4" />
                  <span>Create Service</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
