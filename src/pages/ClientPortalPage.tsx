import React, { useState, useEffect } from 'react';
import {
  Layers,
  Sparkles,
  CheckCircle2,
  Clock,
  RotateCcw,
  ArrowRight,
  Eye,
  Download,
  Plus,
  Search,
  ExternalLink
} from 'lucide-react';
import { OrderRecord } from '../types';
import { ClientReviewModal } from '../components/ClientReviewModal';

interface ClientPortalPageProps {
  onNavigate: (route: string) => void;
  onOpenOrderWizard: () => void;
}

export const ClientPortalPage: React.FC<ClientPortalPageProps> = ({
  onNavigate,
  onOpenOrderWizard,
}) => {
  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [selectedOrderForReview, setSelectedOrderForReview] = useState<OrderRecord | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const fetchOrders = () => {
    fetch('/api/orders')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setOrders(data);
        }
      })
      .catch(console.error);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const filteredOrders = orders.filter((o) => {
    const matchesSearch =
      o.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (o.projectBrief?.serviceTitle || '').toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === 'all' || o.studioOrderStatus === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pt-20 pb-24">
      {/* Header Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="p-6 sm:p-10 rounded-3xl bg-gradient-to-r from-purple-950 via-slate-900 to-slate-950 border border-purple-500/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-2xl">
          <div>
            <div className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">
                Client Project & Review Dashboard
              </span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold font-heading text-white mt-1">
              Your Studio Projects & Proofs
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
              Track real-time editing status, review Photoshop proofs, annotate feedback with our interactive comparison tool, and download final high-res files.
            </p>
          </div>

          <button
            type="button"
            onClick={onOpenOrderWizard}
            className="px-6 py-3.5 rounded-2xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-xl shadow-purple-900/40 flex items-center space-x-2 transition-transform hover:scale-105 shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Start New Project</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by order ID, brand, service..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-purple-500"
            />
          </div>

          <div className="flex items-center space-x-2 overflow-x-auto text-xs w-full sm:w-auto">
            {['all', 'READY FOR REVIEW', 'IN PROGRESS', 'REVISION REQUESTED', 'APPROVED', 'COMPLETED'].map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1.5 rounded-xl font-semibold transition-all whitespace-nowrap ${
                  statusFilter === st
                    ? 'bg-purple-600 text-white shadow-sm'
                    : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                {st === 'all' ? 'All Orders' : st}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Projects List */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
        {filteredOrders.length === 0 ? (
          <div className="p-16 text-center rounded-3xl bg-slate-900/50 border border-slate-800 space-y-4">
            <Layers className="w-12 h-12 text-slate-600 mx-auto" />
            <h3 className="text-base font-bold text-white">No projects found</h3>
            <p className="text-xs text-slate-400">
              Start your first project using our multi-step wizard to see it appear here.
            </p>
            <button
              onClick={onOpenOrderWizard}
              className="px-6 py-2.5 rounded-xl bg-purple-600 text-white font-bold text-xs"
            >
              Launch Project Wizard
            </button>
          </div>
        ) : (
          filteredOrders.map((order) => {
            const hasReviewReady =
              order.studioOrderStatus === 'READY FOR REVIEW' ||
              order.studioOrderStatus === 'IN PROGRESS' ||
              order.studioOrderStatus === 'APPROVED' ||
              order.files?.some((f) => f.editedPreviewUrl);

            return (
              <div
                key={order.id}
                className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 hover:border-purple-500/40 transition-all flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6"
              >
                {/* Project Overview */}
                <div className="space-y-2 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-xs font-bold text-cyan-400 bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-800">
                      {order.id}
                    </span>
                    <span
                      className={`px-3 py-1 rounded-full text-[11px] font-bold ${
                        order.studioOrderStatus === 'READY FOR REVIEW'
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 animate-pulse'
                          : order.studioOrderStatus === 'APPROVED' || order.studioOrderStatus === 'COMPLETED'
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                          : 'bg-purple-500/20 text-purple-300 border border-purple-500/40'
                      }`}
                    >
                      {order.studioOrderStatus || order.status}
                    </span>

                    {order.revisionCount !== undefined && order.revisionCount > 0 && (
                      <span className="text-[11px] text-amber-400 font-semibold flex items-center space-x-1">
                        <RotateCcw className="w-3 h-3" />
                        <span>Revision #{order.revisionCount}</span>
                      </span>
                    )}
                  </div>

                  <h3 className="text-lg font-bold font-heading text-white">
                    {order.projectBrief?.serviceTitle || order.items[0]?.name || 'E-Commerce Visual Retouching'}
                  </h3>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400">
                    <span>
                      Target: <strong className="text-white">{order.projectBrief?.marketplace || 'Amazon'}</strong>
                    </span>
                    <span>
                      Turnaround: <strong className="text-amber-400">{order.projectBrief?.deadlinePreference || '24h'}</strong>
                    </span>
                    <span>
                      Total Assets: <strong className="text-white">{order.files?.length || order.items.length} files</strong>
                    </span>
                    <span>
                      Amount: <strong className="text-emerald-400">₹{order.totalAmount}</strong> ({order.paymentStatus})
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center space-x-3 shrink-0 w-full lg:w-auto justify-end">
                  <button
                    type="button"
                    onClick={() => setSelectedOrderForReview(order)}
                    className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-lg shadow-purple-900/30 flex items-center space-x-1.5 transition-colors"
                  >
                    <Eye className="w-4 h-4" />
                    <span>Review Proofs & Annotate</span>
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Review Modal */}
      {selectedOrderForReview && (
        <ClientReviewModal
          order={selectedOrderForReview}
          isOpen={!!selectedOrderForReview}
          onClose={() => {
            setSelectedOrderForReview(null);
            fetchOrders();
          }}
          onStatusUpdated={() => {
            fetchOrders();
          }}
        />
      )}
    </div>
  );
};
