import React, { useEffect, useState } from 'react';
import {
  ShoppingBag,
  Download,
  Calendar,
  User,
  Package,
  Clock,
  CheckCircle2,
  BookOpen,
  RefreshCw,
  Upload,
  X,
  FileText,
  MessageSquare,
  ShieldCheck,
  Eye,
  Sparkles,
  Zap,
  Send,
  AlertCircle,
  FileDown,
  Receipt,
  Layers,
  Crop,
  Sliders,
  Image as ImageIcon,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { OrderRecord, BookCoverProject, PhotoshopWorkflow, PhotoshopCustomOrder, QuickFixOrder } from '../types';
import { InvoiceReceiptModal } from '../components/InvoiceReceiptModal';

export const UserDashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'orders' | 'quick-fixes' | 'book-covers' | 'photoshop' | 'image-studio'>('orders');
  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [selectedOrderForInvoice, setSelectedOrderForInvoice] = useState<OrderRecord | null>(null);
  const [quickFixOrders, setQuickFixOrders] = useState<QuickFixOrder[]>([]);
  const [bookProjects, setBookProjects] = useState<BookCoverProject[]>([]);
  const [psWorkflows, setPsWorkflows] = useState<PhotoshopWorkflow[]>([]);
  const [psOrders, setPsOrders] = useState<PhotoshopCustomOrder[]>([]);
  const [imageStats, setImageStats] = useState<any>(null);
  const [imageJobs, setImageJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Chat message state in custom orders
  const [chatMessage, setChatMessage] = useState<Record<string, string>>({});
  const [isSendingMsg, setIsSendingMsg] = useState(false);

  // Revision Form Modal State
  const [revisionProject, setRevisionProject] = useState<BookCoverProject | null>(null);
  const [revisionChanges, setRevisionChanges] = useState<string[]>(['Text', 'Color']);
  const [revisionDetails, setRevisionDetails] = useState<string>('');
  const [revisionFiles, setRevisionFiles] = useState<string[]>([]);
  const [isSubmittingRevision, setIsSubmittingRevision] = useState<boolean>(false);

  useEffect(() => {
    if (user) {
      setLoading(true);
      Promise.all([
        fetch('/api/user/orders').then((res) => res.json()),
        fetch(`/api/quick-fix-orders?email=${encodeURIComponent(user.email)}`).then((res) => res.json()),
        fetch(`/api/book-cover/projects?email=${encodeURIComponent(user.email)}`).then((res) => res.json()),
        fetch('/api/photoshop/workflows').then((res) => res.json()),
        fetch(`/api/photoshop/custom-orders?email=${encodeURIComponent(user.email)}`).then((res) => res.json()),
        fetch(`/api/image/stats?email=${encodeURIComponent(user.email)}`).then((res) => res.json()),
        fetch(`/api/image/history?email=${encodeURIComponent(user.email)}`).then((res) => res.json()),
      ])
        .then(([ordersData, quickData, bookData, workflowsData, psOrdersData, imgStatsData, imgJobsData]) => {
          if (Array.isArray(ordersData)) setOrders(ordersData);
          if (Array.isArray(quickData)) setQuickFixOrders(quickData);
          if (Array.isArray(bookData)) setBookProjects(bookData);
          if (Array.isArray(workflowsData)) setPsWorkflows(workflowsData);
          if (Array.isArray(psOrdersData)) setPsOrders(psOrdersData);
          if (imgStatsData && imgStatsData.stats) setImageStats(imgStatsData.stats);
          if (imgJobsData && Array.isArray(imgJobsData.history)) setImageJobs(imgJobsData.history);
        })
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [user]);

  const handleSendMessage = async (orderId: string) => {
    const text = chatMessage[orderId];
    if (!text || !text.trim()) return;

    setIsSendingMsg(true);
    try {
      const res = await fetch(`/api/photoshop/custom-orders/${orderId}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sender: 'customer',
          senderName: user?.name || 'Customer',
          message: text,
        }),
      });
      const data = await res.json();
      if (data.success && data.order) {
        setPsOrders((prev) => prev.map((o) => (o.id === orderId ? data.order : o)));
        setChatMessage((prev) => ({ ...prev, [orderId]: '' }));
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsSendingMsg(false);
    }
  };

  const handlePayOrder = async (orderId: string) => {
    try {
      const res = await fetch(`/api/photoshop/custom-orders/${orderId}/pay`, { method: 'POST' });
      const data = await res.json();
      if (data.success && data.order) {
        setPsOrders((prev) => prev.map((o) => (o.id === orderId ? data.order : o)));
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleSubmitRevision = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!revisionProject) return;
    setIsSubmittingRevision(true);

    try {
      const res = await fetch(`/api/book-cover/projects/${revisionProject.id}/revision`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          requestedChanges: revisionChanges,
          details: revisionDetails,
          uploadedFiles: revisionFiles,
        }),
      });
      const data = await res.json();
      if (data.project) {
        setBookProjects((prev) =>
          prev.map((p) => (p.id === data.project.id ? data.project : p))
        );
        setRevisionProject(null);
        setRevisionDetails('');
        setRevisionFiles([]);
        alert('Revision request submitted successfully to designer Annu Dhaneja!');
      }
    } catch (err) {
      console.error(err);
      alert('Failed to submit revision request.');
    } finally {
      setIsSubmittingRevision(false);
    }
  };

  if (!user) {
    return (
      <div className="max-w-md mx-auto py-20 text-center space-y-4">
        <User className="w-12 h-12 text-slate-400 mx-auto" />
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Sign In Required</h2>
        <p className="text-xs text-slate-500">
          Please sign in to access your dashboard, order history, and book cover project tracking.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      
      {/* Profile Welcome Banner */}
      <div className="p-8 rounded-3xl bg-gradient-to-r from-purple-900/60 via-slate-900 to-slate-900 border border-purple-500/30 text-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-purple-500 to-teal-400 p-1 flex items-center justify-center font-black text-xl text-slate-950">
            {user.name.substring(0, 2).toUpperCase()}
          </div>
          <div>
            <h1 className="text-2xl font-black">{user.name}</h1>
            <p className="text-xs text-slate-400">
              {user.email} • Phone: {user.phone}
            </p>
          </div>
        </div>

        {/* Dashboard Tabs Toggle */}
        <div className="flex items-center space-x-2 bg-slate-950/80 p-1.5 rounded-2xl border border-slate-800 overflow-x-auto">
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              activeTab === 'orders'
                ? 'bg-purple-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Orders & Services ({orders.length})
          </button>
          <button
            onClick={() => setActiveTab('quick-fixes')}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center space-x-1.5 ${
              activeTab === 'quick-fixes'
                ? 'bg-gradient-to-r from-purple-600 to-amber-500 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Quick Fixes ({quickFixOrders.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('book-covers')}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              activeTab === 'book-covers'
                ? 'bg-purple-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            My Book Covers ({bookProjects.length})
          </button>
          <button
            onClick={() => setActiveTab('photoshop')}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              activeTab === 'photoshop'
                ? 'bg-gradient-to-r from-amber-500 to-teal-500 text-slate-950 font-black shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Photoshop Studio ({psWorkflows.length + psOrders.length})
          </button>
          <button
            onClick={() => setActiveTab('image-studio')}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center space-x-1.5 ${
              activeTab === 'image-studio'
                ? 'bg-gradient-to-r from-[#0799A6] to-[#087581] text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Layers className="w-3.5 h-3.5 text-[#25B4BD]" />
            <span>Image Studio ({imageJobs.length})</span>
          </button>
        </div>
      </div>

      {/* TAB: QUICK DIGITAL FIX ORDERS */}
      {activeTab === 'quick-fixes' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center space-x-2">
              <Sparkles className="w-6 h-6 text-amber-400" />
              <div>
                <h2 className="text-2xl font-black text-slate-900 dark:text-white">Quick Fix Repair Orders</h2>
                <p className="text-xs text-slate-500">Track and download your micro-design corrections and enhanced assets.</p>
              </div>
            </div>

            <a
              href="/quick-services"
              className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-purple-600 to-amber-500 text-white font-black text-xs shadow-lg hover:shadow-purple-500/25 transition-all"
            >
              <Zap className="w-3.5 h-3.5" />
              <span>Request New Quick Fix</span>
            </a>
          </div>

          {loading ? (
            <p className="text-xs text-slate-400">Loading your quick fix repairs...</p>
          ) : quickFixOrders.length === 0 ? (
            <div className="p-12 rounded-3xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center space-y-3">
              <Sparkles className="w-10 h-10 text-slate-400 mx-auto" />
              <h3 className="text-base font-bold text-slate-700 dark:text-slate-300">No Quick Fix Orders Yet</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Got a blurry photo, bad background, or low-res logo? Our senior designers fix small design problems starting at ₹49.
              </p>
              <div className="pt-2">
                <a
                  href="/quick-services"
                  className="inline-flex items-center space-x-2 px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-md"
                >
                  <span>Explore 40+ Quick Fixes</span>
                </a>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {quickFixOrders.map((ord) => {
                const isDelivered = ord.status === 'Delivered';
                return (
                  <div
                    key={ord.id}
                    className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 shadow-xl space-y-6 hover:border-purple-500/30 transition-all"
                  >
                    {/* Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800/80 pb-4">
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="text-xs font-black text-purple-600 dark:text-teal-400 uppercase tracking-wider">
                            Order #{ord.id}
                          </span>
                          <span
                            className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                              isDelivered
                                ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/30'
                                : ord.status === 'In Progress'
                                ? 'bg-purple-500/10 text-purple-400 border border-purple-500/30'
                                : ord.status === 'Quality Check'
                                ? 'bg-blue-500/10 text-blue-400 border border-blue-500/30'
                                : 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                            }`}
                          >
                            {ord.status}
                          </span>
                          {ord.rushDelivery && (
                            <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase bg-red-500/10 text-red-400 border border-red-500/30 flex items-center space-x-1">
                              <Zap className="w-2.5 h-2.5" />
                              <span>1-Hr Express</span>
                            </span>
                          )}
                        </div>
                        <h3 className="text-lg font-black text-slate-900 dark:text-white mt-1">{ord.serviceName}</h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                          Category: <span className="font-semibold">{ord.serviceCategory}</span> • Target: <span className="text-purple-400 font-bold">{ord.selectedRequirement}</span>
                        </p>
                      </div>

                      <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-1">
                        <span className="text-2xl font-black text-amber-500">₹{ord.totalPrice}</span>
                        <div className="text-[11px] text-slate-400 flex items-center space-x-1">
                          <Clock className="w-3 h-3 text-slate-400" />
                          <span>Delivery: <strong>{ord.estimatedDelivery}</strong></span>
                        </div>
                        <span className="text-[10px] text-slate-500">{new Date(ord.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>

                    {/* Order Details Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                      {/* Left: Source Asset Info */}
                      <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800/80 space-y-2">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Your Uploaded Asset</span>
                        <div className="flex items-center space-x-3">
                          {ord.uploadedFileUrl ? (
                            <img
                              src={ord.uploadedFileUrl}
                              alt="Source"
                              className="w-14 h-14 rounded-xl object-cover border border-slate-200 dark:border-slate-700 shrink-0"
                            />
                          ) : (
                            <div className="w-14 h-14 rounded-xl bg-purple-600/20 text-purple-400 flex items-center justify-center font-black text-xs">
                              IMG
                            </div>
                          )}
                          <div className="overflow-hidden">
                            <p className="font-bold text-slate-900 dark:text-white truncate">{ord.uploadedFileName}</p>
                            <p className="text-[10px] text-slate-400">{ord.uploadedFileSize}</p>
                            {ord.uploadedFileUrl && (
                              <a
                                href={ord.uploadedFileUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="text-[11px] text-purple-600 dark:text-teal-400 hover:underline font-bold mt-1 inline-block"
                              >
                                View Original File ↗
                              </a>
                            )}
                          </div>
                        </div>
                        {ord.additionalInstructions && (
                          <div className="pt-2 border-t border-slate-200 dark:border-slate-800">
                            <span className="text-[10px] text-slate-400 block font-bold">Your Instructions:</span>
                            <p className="text-slate-600 dark:text-slate-300 italic text-[11px]">"{ord.additionalInstructions}"</p>
                          </div>
                        )}
                      </div>

                      {/* Right: Deliverable / Output Area */}
                      <div className={`p-4 rounded-2xl border ${
                        isDelivered
                          ? 'bg-emerald-500/5 dark:bg-emerald-950/20 border-emerald-500/30'
                          : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800/80'
                      } space-y-2`}>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                          {isDelivered ? '✓ Corrected Asset Ready' : '⏳ Repair in Queue'}
                        </span>

                        {isDelivered ? (
                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="font-black text-emerald-500 text-xs flex items-center space-x-1">
                                  <CheckCircle2 className="w-3.5 h-3.5" />
                                  <span>{ord.completedFileName || 'fixed_artwork.png'}</span>
                                </p>
                                <p className="text-[10px] text-slate-400">{ord.completedFileSize || '1.4 MB'} • High Resolution</p>
                              </div>

                              <a
                                href={ord.completedFileUrl || ord.uploadedFileUrl}
                                download={ord.completedFileName || `${ord.id}_fixed.png`}
                                target="_blank"
                                rel="noreferrer"
                                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs flex items-center space-x-1.5 shadow-md transition-all"
                              >
                                <Download className="w-3.5 h-3.5" />
                                <span>Download Fix</span>
                              </a>
                            </div>

                            {ord.designerNotes && (
                              <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 text-[11px] text-slate-300">
                                <span className="font-bold text-amber-400 block text-[10px] uppercase">Designer Note:</span>
                                {ord.designerNotes}
                              </div>
                            )}
                          </div>
                        ) : (
                          <div className="py-3 text-center space-y-1">
                            <p className="text-slate-600 dark:text-slate-400 text-xs">
                              Our senior retouching specialist Annu Dhaneja is perfecting your asset.
                            </p>
                            <span className="text-[10px] text-amber-500 font-bold block">
                              Estimated delivery: {ord.estimatedDelivery}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Footer Actions */}
                    <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                      <span className="text-[10px] text-slate-400">
                        Need another design fix? Orders typically ready in 1-2 hours.
                      </span>
                      <a
                        href={`/quick-services?service=${encodeURIComponent(ord.serviceName)}`}
                        className="px-4 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-purple-600 hover:text-white text-slate-600 dark:text-slate-300 font-bold text-xs transition-colors flex items-center space-x-1"
                      >
                        <RefreshCw className="w-3 h-3" />
                        <span>Reorder Fix</span>
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: PHOTOSHOP STUDIO WORKFLOWS & CUSTOM ORDERS */}
      {activeTab === 'photoshop' && (
        <div className="space-y-12">
          
          {/* Section 1: Generated & Saved Workflows */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Sparkles className="w-5 h-5 text-amber-400" />
                <h2 className="text-2xl font-black text-slate-900 dark:text-white">Your AI Photoshop Workflows</h2>
              </div>
              <span className="text-xs font-bold text-slate-500">{psWorkflows.length} Workflows Generated</span>
            </div>

            {loading ? (
              <p className="text-xs text-slate-400">Loading workflows...</p>
            ) : psWorkflows.length === 0 ? (
              <div className="p-8 rounded-3xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center space-y-2">
                <Sparkles className="w-8 h-8 text-slate-400 mx-auto" />
                <h4 className="text-sm font-bold text-slate-700 dark:text-slate-300">No Workflows Generated Yet</h4>
                <p className="text-xs text-slate-500">Visit the AI Photoshop Studio to generate your first action file.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {psWorkflows.map((wf) => (
                  <div
                    key={wf.id}
                    className="p-6 rounded-3xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 hover:border-purple-500/50 shadow-lg space-y-4 flex flex-col justify-between"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20">
                          {wf.category}
                        </span>
                        <span className="text-[11px] text-slate-400">{new Date(wf.createdAt).toLocaleDateString()}</span>
                      </div>
                      <h3 className="text-base font-black text-slate-900 dark:text-white">{wf.title}</h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">{wf.prompt}</p>
                    </div>

                    <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                      <div className="text-xs text-slate-400 font-medium">
                        {wf.steps?.length || 0} Steps • {wf.totalExecutionSeconds || 8}s
                      </div>
                      <div className="flex items-center space-x-2">
                        {wf.actionDownloadUrl && (
                          <a
                            href={wf.actionDownloadUrl}
                            download={`${(wf.title || 'workflow').toLowerCase().replace(/\s+/g, '_')}.atn`}
                            className="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center space-x-1.5 shadow-md"
                          >
                            <Download className="w-3.5 h-3.5" />
                            <span>.ATN</span>
                          </a>
                        )}
                        {wf.guideDownloadUrl && (
                          <a
                            href={wf.guideDownloadUrl}
                            download={`${(wf.title || 'workflow').toLowerCase().replace(/\s+/g, '_')}_guide.txt`}
                            className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs flex items-center space-x-1.5"
                          >
                            <FileText className="w-3.5 h-3.5" />
                            <span>Guide</span>
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Section 2: Custom Action Orders Tracking */}
          <div className="space-y-6 pt-6 border-t border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Zap className="w-5 h-5 text-teal-400" />
                <h2 className="text-2xl font-black text-slate-900 dark:text-white">Custom Action Orders</h2>
              </div>
              <span className="text-xs font-bold text-slate-500">{psOrders.length} Orders</span>
            </div>

            {loading ? (
              <p className="text-xs text-slate-400">Loading custom orders...</p>
            ) : psOrders.length === 0 ? (
              <div className="p-8 rounded-3xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center space-y-2">
                <Zap className="w-8 h-8 text-slate-400 mx-auto" />
                <h4 className="text-sm font-bold text-slate-700 dark:text-slate-300">No Custom Orders Yet</h4>
                <p className="text-xs text-slate-500">Need a complex Photoshop JSX script or bespoke action set? Request one in the studio.</p>
              </div>
            ) : (
              <div className="space-y-6">
                {psOrders.map((ord) => (
                  <div
                    key={ord.id}
                    className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 shadow-xl space-y-6"
                  >
                    {/* Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800/80 pb-4">
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="text-xs font-black text-purple-600 dark:text-teal-400 uppercase tracking-wider">
                            Order #{ord.id.substring(0, 8)}
                          </span>
                          <span
                            className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
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
                        <h3 className="text-lg font-black text-slate-900 dark:text-white mt-1">{ord.title}</h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{ord.description}</p>
                      </div>

                      {/* Quotation & Payment */}
                      <div className="text-right space-y-2">
                        {ord.quotedPrice ? (
                          <div>
                            <span className="text-[10px] text-slate-400 block font-bold uppercase">Quoted Amount</span>
                            <span className="text-xl font-black text-amber-500">₹{ord.quotedPrice}</span>
                            <div className="mt-1">
                              {ord.paymentStatus === 'PAID' ? (
                                <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-400 text-[10px] font-black">
                                  PAID ✓
                                </span>
                              ) : (
                                <button
                                  type="button"
                                  onClick={() => handlePayOrder(ord.id)}
                                  className="px-4 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs shadow-md"
                                >
                                  Pay ₹{ord.quotedPrice}
                                </button>
                              )}
                            </div>
                          </div>
                        ) : (
                          <div className="text-xs text-slate-400 italic">Quotation Under Review</div>
                        )}
                      </div>
                    </div>

                    {/* Deliverables Section */}
                    {ord.deliverables && ord.deliverables.length > 0 && (
                      <div className="p-4 rounded-2xl bg-emerald-500/5 border border-emerald-500/20 space-y-3">
                        <div className="flex items-center space-x-2 text-xs font-bold text-emerald-500">
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Delivered Files & Actions</span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {ord.deliverables.map((deliv) => (
                            <a
                              key={deliv.id}
                              href={deliv.fileUrl}
                              download
                              className="p-3 rounded-xl bg-slate-900 border border-slate-800 hover:border-emerald-500 flex items-center justify-between text-xs text-white group"
                            >
                              <div className="flex items-center space-x-2">
                                <FileDown className="w-4 h-4 text-emerald-400" />
                                <div>
                                  <div className="font-bold">{deliv.fileName}</div>
                                  <div className="text-[10px] text-slate-400">{deliv.version} • {deliv.fileSize}</div>
                                </div>
                              </div>
                              <Download className="w-4 h-4 text-slate-400 group-hover:text-emerald-400" />
                            </a>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Live Message & Discussion Thread */}
                    <div className="space-y-3 pt-2">
                      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center space-x-1.5">
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>Order Discussion & Updates</span>
                      </h4>

                      <div className="space-y-2 max-h-56 overflow-y-auto pr-2">
                        {ord.messages && ord.messages.length > 0 ? (
                          ord.messages.map((msg) => (
                            <div
                              key={msg.id}
                              className={`p-3 rounded-2xl text-xs space-y-1 ${
                                msg.sender === 'customer'
                                  ? 'bg-purple-500/10 border border-purple-500/20 ml-auto max-w-lg'
                                  : 'bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 mr-auto max-w-lg'
                              }`}
                            >
                              <div className="flex items-center justify-between text-[10px] font-bold">
                                <span className={msg.sender === 'admin' ? 'text-amber-400' : 'text-purple-400'}>
                                  {msg.senderName} ({msg.sender.toUpperCase()})
                                </span>
                                <span className="text-slate-500">{new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                              </div>
                              <p className="text-slate-700 dark:text-slate-300">{msg.message}</p>
                            </div>
                          ))
                        ) : (
                          <p className="text-xs text-slate-500 italic">No messages yet. Send a note below to start the conversation.</p>
                        )}
                      </div>

                      {/* Send Message Input */}
                      <div className="flex items-center space-x-2 pt-2">
                        <input
                          type="text"
                          value={chatMessage[ord.id] || ''}
                          onChange={(e) => setChatMessage({ ...chatMessage, [ord.id]: e.target.value })}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') handleSendMessage(ord.id);
                          }}
                          placeholder="Type a message or question regarding this custom action..."
                          className="flex-1 px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-purple-500"
                        />
                        <button
                          type="button"
                          onClick={() => handleSendMessage(ord.id)}
                          disabled={isSendingMsg}
                          className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center space-x-1 shadow-md"
                        >
                          <Send className="w-3.5 h-3.5" />
                          <span>Send</span>
                        </button>
                      </div>
                    </div>

                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      )}
      {activeTab === 'orders' && (
        <div className="space-y-6">
          <div className="flex items-center space-x-2">
            <Package className="w-5 h-5 text-cyan-400" />
            <h2 className="text-2xl font-black text-slate-900 dark:text-white">Your Orders & Services</h2>
          </div>

          {loading ? (
            <p className="text-xs text-slate-400">Loading your purchase history...</p>
          ) : orders.length === 0 ? (
            <div className="p-12 rounded-3xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center space-y-3">
              <ShoppingBag className="w-10 h-10 text-slate-400 mx-auto" />
              <h3 className="text-base font-bold text-slate-700 dark:text-slate-300">No Orders Found Yet</h3>
              <p className="text-xs text-slate-500">
                Explore our digital marketplace, graphic design packages, or wardrobe consultation services.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <div
                  key={order.id}
                  className="p-6 rounded-3xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 shadow-md space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 dark:border-slate-800 pb-3 text-xs">
                    <div>
                      <span className="text-slate-400 font-bold">Order ID: #{order.id}</span>
                      <span className="text-slate-500 ml-3">{new Date(order.createdAt).toLocaleDateString()}</span>
                    </div>

                    <div className="flex items-center space-x-3">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          order.paymentStatus === 'paid'
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                            : 'bg-amber-500/10 text-amber-400'
                        }`}
                      >
                        Payment: {order.paymentStatus}
                      </span>

                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          order.status === 'completed'
                            ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30'
                            : 'bg-purple-500/10 text-purple-400'
                        }`}
                      >
                        Status: {order.status}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between text-xs py-1">
                        <div className="flex items-center space-x-2">
                          <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                          <span className="font-bold text-slate-800 dark:text-slate-200">{item.name}</span>
                          <span className="text-slate-500">x{item.quantity}</span>
                        </div>
                        <span className="font-bold text-slate-900 dark:text-white">
                          ₹{item.price * item.quantity}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
                    <div className="space-y-0.5">
                      <span className="text-slate-500 block">Payment ID: {order.razorpayPaymentId || 'N/A'}</span>
                      {order.couponCode && (
                        <span className="text-[10px] text-emerald-400 font-bold">
                          Coupon Applied: {order.couponCode} (-₹{order.discount || 0})
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => setSelectedOrderForInvoice(order)}
                        className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-teal-300 hover:text-white border border-slate-700 font-bold text-xs flex items-center gap-1.5 transition-all"
                      >
                        <Receipt className="w-3.5 h-3.5" /> Tax Invoice
                      </button>
                      <div className="text-right">
                        <span className="text-slate-400 mr-2 text-[11px]">Total:</span>
                        <span className="text-lg font-black text-amber-500 dark:text-amber-400">
                          ₹{order.totalAmount}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: MY BOOK COVER PROJECTS */}
      {activeTab === 'book-covers' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <BookOpen className="w-5 h-5 text-purple-400" />
              <h2 className="text-2xl font-black text-slate-900 dark:text-white">My Book Cover Projects</h2>
            </div>
          </div>

          {loading ? (
            <p className="text-xs text-slate-400">Loading book cover projects...</p>
          ) : bookProjects.length === 0 ? (
            <div className="p-12 rounded-3xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center space-y-4">
              <BookOpen className="w-10 h-10 text-purple-400 mx-auto" />
              <h3 className="text-base font-bold text-slate-700 dark:text-slate-300">No Book Cover Projects Found</h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                Start your book cover brief using our multi-step wizard to collaborate directly with our design team.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {bookProjects.map((project) => (
                <div
                  key={project.id}
                  className="p-6 rounded-3xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-purple-900/40 shadow-xl space-y-6"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-4">
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs font-bold text-purple-600 dark:text-purple-400 uppercase tracking-widest">
                          Project #{project.id}
                        </span>
                        <span className="text-slate-400 text-xs">• {new Date(project.createdAt).toLocaleDateString()}</span>
                      </div>
                      <h3 className="text-xl font-black text-slate-900 dark:text-white mt-1">
                        {project.bookTitle}
                      </h3>
                      <p className="text-xs text-slate-500">
                        Author: {project.authorName} ({project.bookType})
                      </p>
                    </div>

                    {/* Status Badge */}
                    <div className="flex items-center space-x-3">
                      <span className="px-3.5 py-1.5 rounded-full bg-purple-500/10 text-purple-300 border border-purple-500/30 text-xs font-bold">
                        {project.status}
                      </span>
                      <button
                        onClick={() => setRevisionProject(project)}
                        className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center space-x-1.5 shadow-md"
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                        <span>Request Revision</span>
                      </button>
                    </div>
                  </div>

                  {/* Details Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-slate-600 dark:text-slate-300">
                    <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-1">
                      <span className="text-[10px] font-bold text-slate-400 uppercase block">Selected Package</span>
                      <span className="font-bold text-slate-900 dark:text-white block">{project.selectedPackageName}</span>
                      <span className="text-amber-500 font-bold">₹{project.price} Paid</span>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-1">
                      <span className="text-[10px] font-bold text-slate-400 uppercase block">Spine & Format</span>
                      <span className="font-bold text-slate-900 dark:text-white block">{project.trimSize} ({project.pageCount} pages)</span>
                      <span className="text-cyan-400 block">{project.estimatedSpineWidth || 'Calculating...'}</span>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-800 space-y-1">
                      <span className="text-[10px] font-bold text-slate-400 uppercase block">Assigned Designer</span>
                      <span className="font-bold text-slate-900 dark:text-white block">
                        {project.assignedDesignerName || 'Annu Dhaneja'}
                      </span>
                      <span className="text-slate-400">Revisions submitted: {project.revisions?.length || 0}</span>
                    </div>
                  </div>

                  {/* Preview / Final Artwork Downloads */}
                  {project.previewFiles && project.previewFiles.length > 0 && (
                    <div className="space-y-2 pt-2">
                      <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Designer Artwork Previews</h4>
                      <div className="flex flex-wrap gap-4">
                        {project.previewFiles.map((url, i) => (
                          <div key={i} className="relative w-32 h-40 rounded-xl overflow-hidden border border-slate-800 group shadow-md">
                            <img src={url} alt="Preview" referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                            <a
                              href={url}
                              target="_blank"
                              rel="noreferrer"
                              className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-bold"
                            >
                              View Full Size
                            </a>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Revision History */}
                  {project.revisions && project.revisions.length > 0 && (
                    <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2 text-xs">
                      <h4 className="font-bold text-amber-400">Revision History</h4>
                      {project.revisions.map((rev) => (
                        <div key={rev.id} className="border-b border-slate-800 pb-2 text-slate-300">
                          <span className="font-bold text-white">Requested: {rev.requestedChanges.join(', ')}</span>
                          <p className="text-[11px] text-slate-400 mt-1">{rev.details}</p>
                          <span className="text-[10px] text-slate-500 block">{new Date(rev.createdAt).toLocaleString()}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* REVISION SUBMISSION MODAL */}
      {revisionProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
          <form
            onSubmit={handleSubmitRevision}
            className="w-full max-w-lg rounded-3xl bg-slate-900 border border-amber-500/40 p-6 text-white space-y-5 shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-2">
                <RefreshCw className="w-5 h-5 text-amber-400" />
                <h4 className="text-base font-bold">Request Book Cover Revision</h4>
              </div>
              <button
                type="button"
                onClick={() => setRevisionProject(null)}
                className="p-1 rounded-full hover:bg-slate-800 text-slate-400"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-300">
              Submitting revision for <strong className="text-amber-300">"{revisionProject.bookTitle}"</strong>
            </p>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-300">What would you like changed?</label>
              <div className="grid grid-cols-3 gap-2">
                {['Text', 'Color', 'Image', 'Layout', 'Typography', 'Background', 'Spine', 'Back Cover', 'Other'].map((item) => {
                  const sel = revisionChanges.includes(item);
                  return (
                    <button
                      key={item}
                      type="button"
                      onClick={() => {
                        if (sel) {
                          setRevisionChanges((prev) => prev.filter((i) => i !== item));
                        } else {
                          setRevisionChanges((prev) => [...prev, item]);
                        }
                      }}
                      className={`p-2 rounded-xl text-xs font-bold border transition-all ${
                        sel ? 'bg-amber-500/30 border-amber-500 text-amber-200' : 'bg-slate-950 border-slate-800 text-slate-400'
                      }`}
                    >
                      {sel ? `✓ ${item}` : item}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-300">Specific Change Instructions</label>
              <textarea
                rows={4}
                required
                value={revisionDetails}
                onChange={(e) => setRevisionDetails(e.target.value)}
                placeholder="Explain what specific edits, font changes, or color adjustments you desire..."
                className="w-full px-4 py-3 rounded-2xl bg-slate-950 border border-slate-800 text-white text-xs focus:border-amber-500 focus:outline-none"
              />
            </div>

            <div className="flex justify-end space-x-3 pt-2">
              <button
                type="button"
                onClick={() => setRevisionProject(null)}
                className="px-4 py-2.5 rounded-xl bg-slate-800 text-slate-300 font-bold text-xs"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmittingRevision}
                className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs shadow-lg"
              >
                {isSubmittingRevision ? 'Submitting...' : 'Submit Revision'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* TAB: IMAGE STUDIO */}
      {activeTab === 'image-studio' && (
        <div className="space-y-8 animate-fadeIn">
          {/* Header & Quick Action Launch */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center space-x-3">
              <span className="p-3 rounded-2xl bg-[#0799A6]/20 border border-[#0799A6]/40 text-[#25B4BD]">
                <Layers className="w-6 h-6" />
              </span>
              <div>
                <h2 className="text-2xl font-black text-slate-900 dark:text-white">Bulk Image Studio Hub</h2>
                <p className="text-xs text-slate-500">
                  Real-time batch metrics, storage conservation analytics, and processing logs.
                </p>
              </div>
            </div>

            <a
              href="#/tools/bulk-image-studio"
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#0799A6] to-[#087581] hover:from-[#087581] hover:to-[#0799A6] text-white font-extrabold text-xs transition shadow-md flex items-center gap-2 self-start sm:self-auto"
            >
              <Zap className="w-4 h-4" />
              <span>Open Bulk Image Studio</span>
            </a>
          </div>

          {/* 5 Metric Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
              <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">Total Images</span>
              <p className="text-2xl font-black text-slate-900 dark:text-white mt-1">
                {imageStats?.totalImagesProcessed || 0}
              </p>
              <span className="text-[10px] text-emerald-500 font-semibold mt-0.5 block">Lifetime Optimized</span>
            </div>

            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
              <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">This Month</span>
              <p className="text-2xl font-black text-[#0799A6] dark:text-[#25B4BD] mt-1">
                {imageStats?.totalImagesProcessed ? Math.min(imageStats.totalImagesProcessed, 420) : 0}
              </p>
              <span className="text-[10px] text-slate-400 mt-0.5 block">Active quota usage</span>
            </div>

            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
              <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">Storage Saved</span>
              <p className="text-2xl font-black text-emerald-500 mt-1">
                {imageStats?.totalSavedMB ? `${imageStats.totalSavedMB} MB` : '0 MB'}
              </p>
              <span className="text-[10px] text-slate-400 mt-0.5 block">
                Avg {imageStats?.overallSavedPercent || 65}% lighter
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
              <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">Successful Jobs</span>
              <p className="text-2xl font-black text-teal-400 mt-1">
                {imageStats?.successfulJobs || 0}
              </p>
              <span className="text-[10px] text-emerald-500 font-semibold mt-0.5 block">100% Success</span>
            </div>

            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm col-span-2 lg:col-span-1">
              <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">Failed Jobs</span>
              <p className="text-2xl font-black text-rose-500 mt-1">
                {imageStats?.failedJobs || 0}
              </p>
              <span className="text-[10px] text-slate-400 mt-0.5 block">Zero errors</span>
            </div>
          </div>

          {/* Quick Actions Panel */}
          <div className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-3">Quick Image Actions</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 text-xs">
              {[
                { label: 'Resize Images', desc: 'Scale dimensions or %', icon: Sliders },
                { label: 'Compress Images', desc: 'Reduce MB to KB', icon: Sparkles },
                { label: 'Convert Images', desc: 'WebP, AVIF, JPG, PNG', icon: RefreshCw },
                { label: 'Crop Images', desc: '1:1, 4:5, 16:9, etc.', icon: Crop },
                { label: 'Watermark Images', desc: 'Custom text / logo', icon: ShieldCheck },
              ].map((act, i) => {
                const Icon = act.icon;
                return (
                  <a
                    key={i}
                    href="#/tools/bulk-image-studio"
                    className="p-3.5 rounded-2xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 hover:border-[#0799A6] transition group flex flex-col justify-between"
                  >
                    <div className="p-2 rounded-xl bg-[#0799A6]/10 text-[#0799A6] dark:text-[#25B4BD] w-fit mb-2 group-hover:scale-105 transition-transform">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-bold text-slate-900 dark:text-white">{act.label}</div>
                      <div className="text-[10px] text-slate-400 mt-0.5">{act.desc}</div>
                    </div>
                  </a>
                );
              })}
            </div>
          </div>

          {/* Recent Processing Jobs Table */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm">
            <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Recent Processing Jobs</h3>
              <a
                href="#/tools/bulk-image-studio"
                className="text-xs text-[#0799A6] dark:text-[#25B4BD] font-bold hover:underline"
              >
                Launch Studio →
              </a>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600 dark:text-slate-300">
                <thead className="bg-slate-50 dark:bg-slate-950 text-slate-400 font-semibold border-b border-slate-200 dark:border-slate-800 uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="p-4">Date & Time</th>
                    <th className="p-4">Job Summary</th>
                    <th className="p-4">Images</th>
                    <th className="p-4">Format</th>
                    <th className="p-4">Savings</th>
                    <th className="p-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {imageJobs.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="p-8 text-center text-slate-500">
                        No processing jobs in your history yet. Open the Studio to optimize your first batch!
                      </td>
                    </tr>
                  ) : (
                    imageJobs.map((job) => (
                      <tr key={job.id} className="hover:bg-slate-50 dark:hover:bg-slate-950/40 transition">
                        <td className="p-4 text-slate-500 font-mono text-[11px]">
                          {new Date(job.createdAt).toLocaleString()}
                        </td>
                        <td className="p-4 font-bold text-slate-900 dark:text-white">
                          {job.settingsSummary || 'Batch Resizing'}
                        </td>
                        <td className="p-4 font-semibold">
                          {job.successfulImages} / {job.totalImages}
                        </td>
                        <td className="p-4 uppercase font-bold text-[#0799A6] dark:text-[#25B4BD]">
                          {job.outputFormat}
                        </td>
                        <td className="p-4 text-emerald-500 font-bold">
                          {(job.savedBytes / (1024 * 1024)).toFixed(1)} MB ({job.savedPercentage}%)
                        </td>
                        <td className="p-4">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                            {job.status}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Invoice Receipt Modal */}
      <InvoiceReceiptModal
        isOpen={!!selectedOrderForInvoice}
        onClose={() => setSelectedOrderForInvoice(null)}
        order={selectedOrderForInvoice}
      />

    </div>
  );
};
