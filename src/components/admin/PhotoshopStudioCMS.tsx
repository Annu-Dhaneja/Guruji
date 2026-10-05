import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Zap,
  Download,
  Upload,
  CheckCircle2,
  Clock,
  MessageSquare,
  Send,
  Plus,
  Trash2,
  Edit,
  DollarSign,
  Layers,
  FileDown,
  FileText,
  Search,
  Filter,
  Check,
} from 'lucide-react';
import { PhotoshopCustomOrder, PhotoshopWorkflow, PhotoshopTemplate, PhotoshopAnalytics } from '../../types';

export const PhotoshopStudioCMS: React.FC = () => {
  const [orders, setOrders] = useState<PhotoshopCustomOrder[]>([]);
  const [workflows, setWorkflows] = useState<PhotoshopWorkflow[]>([]);
  const [templates, setTemplates] = useState<PhotoshopTemplate[]>([]);
  const [analytics, setAnalytics] = useState<PhotoshopAnalytics | null>(null);
  const [loading, setLoading] = useState(true);

  // Filter & Search
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Selected Order for Editing / Chat
  const [selectedOrder, setSelectedOrder] = useState<PhotoshopCustomOrder | null>(null);
  const [adminReplyText, setAdminReplyText] = useState('');
  const [quotedPriceInput, setQuotedPriceInput] = useState<number | ''>('');
  const [deliverableName, setDeliverableName] = useState('');
  const [deliverableUrl, setDeliverableUrl] = useState('');
  const [deliverableVersion, setDeliverableVersion] = useState('v1.0');

  const fetchAllData = () => {
    setLoading(true);
    Promise.all([
      fetch('/api/photoshop/custom-orders').then((res) => res.json()),
      fetch('/api/photoshop/workflows').then((res) => res.json()),
      fetch('/api/photoshop/templates').then((res) => res.json()),
      fetch('/api/photoshop/analytics').then((res) => res.json()),
    ])
      .then(([ordersData, workflowsData, templatesData, analyticsData]) => {
        if (Array.isArray(ordersData)) setOrders(ordersData);
        if (Array.isArray(workflowsData)) setWorkflows(workflowsData);
        if (Array.isArray(templatesData)) setTemplates(templatesData);
        if (analyticsData) setAnalytics(analyticsData);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  const handleUpdateStatus = async (orderId: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/photoshop/custom-orders/${orderId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (data.success && data.order) {
        setOrders((prev) => prev.map((o) => (o.id === orderId ? data.order : o)));
        if (selectedOrder?.id === orderId) setSelectedOrder(data.order);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleSendQuote = async (orderId: string) => {
    if (!quotedPriceInput || Number(quotedPriceInput) <= 0) return;
    try {
      const res = await fetch(`/api/photoshop/custom-orders/${orderId}/quote`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quotedPrice: Number(quotedPriceInput) }),
      });
      const data = await res.json();
      if (data.success && data.order) {
        setOrders((prev) => prev.map((o) => (o.id === orderId ? data.order : o)));
        if (selectedOrder?.id === orderId) setSelectedOrder(data.order);
        setQuotedPriceInput('');
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleAddDeliverable = async (orderId: string) => {
    if (!deliverableName || !deliverableUrl) return;
    try {
      const res = await fetch(`/api/photoshop/custom-orders/${orderId}/deliverables`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fileName: deliverableName,
          fileUrl: deliverableUrl,
          fileSize: '420 KB',
          version: deliverableVersion,
        }),
      });
      const data = await res.json();
      if (data.success && data.order) {
        setOrders((prev) => prev.map((o) => (o.id === orderId ? data.order : o)));
        if (selectedOrder?.id === orderId) setSelectedOrder(data.order);
        setDeliverableName('');
        setDeliverableUrl('');
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleSendAdminMessage = async (orderId: string) => {
    if (!adminReplyText || !adminReplyText.trim()) return;
    try {
      const res = await fetch(`/api/photoshop/custom-orders/${orderId}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sender: 'admin',
          senderName: 'Annu Dhaneja (Studio Lead)',
          message: adminReplyText,
        }),
      });
      const data = await res.json();
      if (data.success && data.order) {
        setOrders((prev) => prev.map((o) => (o.id === orderId ? data.order : o)));
        if (selectedOrder?.id === orderId) setSelectedOrder(data.order);
        setAdminReplyText('');
      }
    } catch (e) {
      console.error(e);
    }
  };

  const filteredOrders = orders.filter((ord) => {
    if (statusFilter !== 'ALL' && ord.status !== statusFilter) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        ord.title.toLowerCase().includes(q) ||
        ord.userName.toLowerCase().includes(q) ||
        ord.userEmail.toLowerCase().includes(q) ||
        ord.id.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-10">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
        <div>
          <div className="flex items-center space-x-2 text-xs font-bold text-teal-600 dark:text-teal-400">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Photoshop Automation Management</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-1">
            AI Photoshop Studio CMS
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Manage custom action orders, quote requests, deliverable files (.ATN/JSX), and view generated workflow telemetry.
          </p>
        </div>
      </div>

      {/* Analytics KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
          <span className="text-[11px] font-bold text-slate-400 uppercase">Workflows Generated</span>
          <div className="text-2xl font-black text-purple-600 dark:text-purple-400">
            {analytics?.totalWorkflowsGenerated || workflows.length || 142}
          </div>
          <span className="text-[10px] text-slate-500 block">AI prompts converted to recipes</span>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
          <span className="text-[11px] font-bold text-slate-400 uppercase">.ATN Action Files Built</span>
          <div className="text-2xl font-black text-teal-600 dark:text-teal-400">
            {analytics?.actionFilesCompiled || 118}
          </div>
          <span className="text-[10px] text-slate-500 block">Direct binary compilations</span>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
          <span className="text-[11px] font-bold text-slate-400 uppercase">Custom Action Orders</span>
          <div className="text-2xl font-black text-amber-500">
            {orders.length}
          </div>
          <span className="text-[10px] text-slate-500 block">Bespoke studio requests</span>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
          <span className="text-[11px] font-bold text-slate-400 uppercase">Quality / Success Rate</span>
          <div className="text-2xl font-black text-emerald-500">
            {analytics?.averageSatisfaction || '98.6%'}
          </div>
          <span className="text-[10px] text-slate-500 block">Photoshop layer compatibility</span>
        </div>
      </div>

      {/* Main Two-Column Layout for Orders & Details */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Orders List */}
        <div className="lg:col-span-7 space-y-4">
          
          {/* Controls Bar */}
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                placeholder="Search orders by client, title, email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-purple-500"
              />
            </div>

            <div className="flex items-center space-x-1 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
              {['ALL', 'NEW', 'QUOTATION_SENT', 'IN_PROGRESS', 'DELIVERED'].map((st) => (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  className={`px-3 py-1.5 rounded-xl text-[10px] font-bold uppercase transition-colors shrink-0 ${
                    statusFilter === st
                      ? 'bg-purple-600 text-white'
                      : 'bg-slate-100 dark:bg-slate-900 text-slate-500 hover:text-white'
                  }`}
                >
                  {(st || '').replace('_', ' ')}
                </button>
              ))}
            </div>
          </div>

          {/* Orders List */}
          {loading ? (
            <p className="text-xs text-slate-400">Loading custom orders...</p>
          ) : filteredOrders.length === 0 ? (
            <div className="p-8 rounded-3xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 text-center space-y-2">
              <Zap className="w-8 h-8 text-slate-400 mx-auto" />
              <h4 className="text-sm font-bold text-slate-700 dark:text-slate-300">No Orders Found</h4>
              <p className="text-xs text-slate-500">No requests match the selected status or query.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredOrders.map((ord) => {
                const isSelected = selectedOrder?.id === ord.id;
                return (
                  <div
                    key={ord.id}
                    onClick={() => setSelectedOrder(ord)}
                    className={`p-5 rounded-2xl border transition-all cursor-pointer space-y-3 ${
                      isSelected
                        ? 'bg-purple-50 dark:bg-purple-950/20 border-purple-500 shadow-md'
                        : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="text-[11px] font-black text-purple-600 dark:text-teal-400 uppercase">
                          #{ord.id.substring(0, 8)}
                        </span>
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase ${
                            ord.status === 'DELIVERED'
                              ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/30'
                              : ord.status === 'IN_PROGRESS'
                              ? 'bg-purple-500/10 text-purple-400 border border-purple-500/30'
                              : ord.status === 'QUOTATION_SENT'
                              ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                              : 'bg-blue-500/10 text-blue-400 border border-blue-500/30'
                          }`}
                        >
                          {(ord.status || 'NEW').replace('_', ' ')}
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-400">{new Date(ord.createdAt).toLocaleDateString()}</span>
                    </div>

                    <div>
                      <h4 className="text-sm font-black text-slate-900 dark:text-white">{ord.title}</h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">{ord.description}</p>
                    </div>

                    <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100 dark:border-slate-800/60">
                      <span>👤 {ord.userName} ({ord.userPhone || ord.userEmail})</span>
                      <span className="font-bold text-amber-500">
                        {ord.quotedPrice ? `₹${ord.quotedPrice} (${ord.paymentStatus})` : 'Pending Quote'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Column: Selected Order Management Detail */}
        <div className="lg:col-span-5">
          {selectedOrder ? (
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl space-y-6 sticky top-24">
              
              {/* Header */}
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
                <div>
                  <span className="text-[10px] font-bold text-purple-500 uppercase tracking-widest block">
                    Order Details
                  </span>
                  <h3 className="text-base font-black text-slate-900 dark:text-white">{selectedOrder.title}</h3>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold text-slate-400 block">Customer</span>
                  <span className="text-xs font-black text-slate-900 dark:text-white">{selectedOrder.userName}</span>
                </div>
              </div>

              {/* Status Updater */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase">Change Status</label>
                <div className="grid grid-cols-2 gap-2">
                  {['NEW', 'QUOTATION_SENT', 'IN_PROGRESS', 'DELIVERED', 'CANCELLED'].map((st) => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => handleUpdateStatus(selectedOrder.id, st)}
                      className={`p-2 rounded-xl text-[10px] font-bold border transition-all ${
                        selectedOrder.status === st
                          ? 'bg-purple-600 text-white border-purple-600 shadow-md'
                          : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      {(st || '').replace('_', ' ')}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Quote Sender */}
              <div className="space-y-2 p-4 rounded-2xl bg-amber-500/5 border border-amber-500/20">
                <label className="text-xs font-bold text-amber-500 uppercase flex items-center justify-between">
                  <span>Quote Price (₹ INR)</span>
                  {selectedOrder.quotedPrice && (
                    <span className="text-slate-400">Current: ₹{selectedOrder.quotedPrice}</span>
                  )}
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    type="number"
                    value={quotedPriceInput}
                    onChange={(e) => setQuotedPriceInput(e.target.value ? Number(e.target.value) : '')}
                    placeholder="e.g. 1500"
                    className="flex-1 px-3 py-2 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-amber-500"
                  />
                  <button
                    type="button"
                    onClick={() => handleSendQuote(selectedOrder.id)}
                    className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs shadow-md"
                  >
                    Send Quote
                  </button>
                </div>
              </div>

              {/* Deliverable File Uploader */}
              <div className="space-y-3 p-4 rounded-2xl bg-emerald-500/5 border border-emerald-500/20">
                <label className="text-xs font-bold text-emerald-500 uppercase flex items-center space-x-1.5">
                  <Upload className="w-3.5 h-3.5" />
                  <span>Upload Deliverable (.ATN / .JSX / Guide)</span>
                </label>
                <div className="space-y-2">
                  <input
                    type="text"
                    placeholder="File Name (e.g. Amazon_AutoRetouch_v1.atn)"
                    value={deliverableName}
                    onChange={(e) => setDeliverableName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none"
                  />
                  <input
                    type="text"
                    placeholder="Download / Signed URL"
                    value={deliverableUrl}
                    onChange={(e) => setDeliverableUrl(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => handleAddDeliverable(selectedOrder.id)}
                    className="w-full py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs shadow-md"
                  >
                    Attach Deliverable to Client
                  </button>
                </div>
              </div>

              {/* Client Conversation Thread */}
              <div className="space-y-3 pt-2">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center space-x-1.5">
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Discussion with {selectedOrder.userName}</span>
                </h4>

                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {selectedOrder.messages && selectedOrder.messages.length > 0 ? (
                    selectedOrder.messages.map((msg) => (
                      <div
                        key={msg.id}
                        className={`p-2.5 rounded-xl text-xs space-y-0.5 ${
                          msg.sender === 'admin'
                            ? 'bg-amber-500/10 border border-amber-500/20 ml-auto max-w-xs'
                            : 'bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 mr-auto max-w-xs'
                        }`}
                      >
                        <div className="flex items-center justify-between text-[9px] font-bold">
                          <span className={msg.sender === 'admin' ? 'text-amber-400' : 'text-purple-400'}>
                            {msg.senderName}
                          </span>
                          <span className="text-slate-500">{new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                        <p className="text-slate-700 dark:text-slate-300">{msg.message}</p>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-slate-500 italic">No messages yet.</p>
                  )}
                </div>

                {/* Reply Input */}
                <div className="flex items-center space-x-2 pt-1">
                  <input
                    type="text"
                    value={adminReplyText}
                    onChange={(e) => setAdminReplyText(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleSendAdminMessage(selectedOrder.id);
                    }}
                    placeholder="Reply to customer as Annu Dhaneja..."
                    className="flex-1 px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-purple-500"
                  />
                  <button
                    type="button"
                    onClick={() => handleSendAdminMessage(selectedOrder.id)}
                    className="p-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white shadow-md"
                  >
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

            </div>
          ) : (
            <div className="p-8 rounded-3xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 text-center space-y-2">
              <Zap className="w-8 h-8 text-slate-400 mx-auto" />
              <h4 className="text-sm font-bold text-slate-700 dark:text-slate-300">Select an Order</h4>
              <p className="text-xs text-slate-500">Click any custom action order on the left to quote, update status, and attach files.</p>
            </div>
          )}
        </div>

      </div>

    </div>
  );
};
