import React, { useState } from 'react';
import {
  MessageSquare,
  Phone,
  Mail,
  Calendar,
  Clock,
  CheckCircle2,
  DollarSign,
  Edit3,
  ExternalLink,
  Save,
  X,
  AlertCircle,
  FileText,
  User,
} from 'lucide-react';

export interface CustomDesignRequestItem {
  id: string;
  requestNumber: string;
  customerName: string;
  customerEmail?: string;
  customerPhone?: string;
  customerWhatsapp?: string;
  serviceType: string;
  category?: string;
  dimensions?: string;
  deadline?: string;
  budget?: string;
  referenceImageUrls?: string[];
  briefDescription: string;
  colorPreferences?: string;
  mandirPlacementNotes?: string;
  status: 'RECEIVED' | 'IN_REVIEW' | 'QUOTED' | 'DESIGNING' | 'READY' | 'COMPLETED';
  adminNotes?: string;
  quotedPrice?: number;
  assignedArtist?: string;
  createdAt: string;
  updatedAt?: string;
}

interface CustomDesignRequestsTabProps {
  requests: CustomDesignRequestItem[];
  onUpdateRequest: (id: string, updated: Partial<CustomDesignRequestItem>) => Promise<void>;
}

export const CustomDesignRequestsTab: React.FC<CustomDesignRequestsTabProps> = ({
  requests,
  onUpdateRequest,
}) => {
  const [selectedRequest, setSelectedRequest] = useState<CustomDesignRequestItem | null>(null);
  const [status, setStatus] = useState<CustomDesignRequestItem['status']>('RECEIVED');
  const [quotedPrice, setQuotedPrice] = useState<number>(0);
  const [adminNotes, setAdminNotes] = useState<string>('');
  const [assignedArtist, setAssignedArtist] = useState<string>('Annu Dhaneja Creative Studio');
  const [saving, setSaving] = useState(false);

  const openEditDrawer = (req: CustomDesignRequestItem) => {
    setSelectedRequest(req);
    setStatus(req.status || 'RECEIVED');
    setQuotedPrice(req.quotedPrice || 0);
    setAdminNotes(req.adminNotes || '');
    setAssignedArtist(req.assignedArtist || 'Annu Dhaneja Creative Studio');
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRequest) return;
    setSaving(true);
    try {
      await onUpdateRequest(selectedRequest.id, {
        status,
        quotedPrice: Number(quotedPrice),
        adminNotes,
        assignedArtist,
      });
      setSelectedRequest(null);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const getStatusBadgeClass = (st: string) => {
    switch (st) {
      case 'RECEIVED':
        return 'bg-blue-500/10 text-blue-400 border-blue-500/30';
      case 'IN_REVIEW':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
      case 'QUOTED':
        return 'bg-purple-500/10 text-purple-400 border-purple-500/30';
      case 'DESIGNING':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/50';
      case 'READY':
        return 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30';
      case 'COMPLETED':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
      default:
        return 'bg-slate-800 text-slate-400 border-slate-700';
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-slate-900 border border-slate-800 rounded-2xl p-5 gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 text-xs font-bold mb-2">
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Devotee Custom Commissions ({requests.length})</span>
          </div>
          <h3 className="text-xl font-black text-white">Custom Artwork & Mandir Briefs</h3>
          <p className="text-xs text-slate-400">
            Review devotee custom design requests, manage quotations, review reference photos, and update workflow status.
          </p>
        </div>
      </div>

      {/* Requests Table / Cards */}
      {requests.length === 0 ? (
        <div className="p-12 text-center rounded-3xl bg-slate-900 border border-slate-800 space-y-2">
          <MessageSquare className="w-8 h-8 text-slate-600 mx-auto" />
          <h4 className="text-sm font-bold text-slate-300">No Custom Requests Yet</h4>
          <p className="text-xs text-slate-500">
            Devotee briefs submitted through the "Custom Request" modal on the artwork page will appear here.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {requests.map((req) => (
            <div
              key={req.id}
              className="p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-amber-500/40 transition-all flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-xs shadow-lg"
            >
              <div className="space-y-2 max-w-xl">
                <div className="flex items-center space-x-2.5">
                  <span className="font-mono text-[11px] text-amber-400 font-bold bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                    #{req.requestNumber}
                  </span>
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${getStatusBadgeClass(req.status)}`}>
                    {req.status}
                  </span>
                  <span className="text-slate-500 text-[11px]">
                    {new Date(req.createdAt).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </span>
                </div>

                <div>
                  <h4 className="text-sm font-black text-white flex items-center space-x-2">
                    <span>{req.customerName}</span>
                    <span className="text-slate-400 text-xs font-normal">• {req.serviceType}</span>
                  </h4>
                  <p className="text-slate-300 mt-1 line-clamp-2 leading-relaxed">
                    "{req.briefDescription}"
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-400 pt-1">
                  {req.customerPhone && (
                    <span className="flex items-center space-x-1 text-slate-300">
                      <Phone className="w-3 h-3 text-amber-400" />
                      <span>{req.customerPhone}</span>
                    </span>
                  )}
                  {req.budget && (
                    <span className="flex items-center space-x-1 text-amber-300 font-bold">
                      <span>Budget: {req.budget}</span>
                    </span>
                  )}
                  {req.quotedPrice ? (
                    <span className="text-emerald-400 font-black">Quoted: ₹{req.quotedPrice}</span>
                  ) : null}
                </div>
              </div>

              <div className="flex items-center space-x-2 shrink-0 self-end sm:self-center">
                {req.customerWhatsapp && (
                  <a
                    href={`https://wa.me/${req.customerWhatsapp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                      `Namaste ${req.customerName}, regarding your custom artwork request #${req.requestNumber} on GurucraftPro...`
                    )}`}
                    target="_blank"
                    rel="noreferrer"
                    className="px-3.5 py-2 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 font-bold border border-emerald-500/30 flex items-center space-x-1.5 transition-colors"
                  >
                    <span>💬 WhatsApp</span>
                  </a>
                )}
                <button
                  onClick={() => openEditDrawer(req)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold flex items-center space-x-1.5 border border-slate-700"
                >
                  <Edit3 className="w-3.5 h-3.5 text-amber-400" />
                  <span>Review & Update</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit Drawer / Modal */}
      {selectedRequest && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="max-w-2xl w-full bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-5 shadow-2xl my-8 text-xs text-slate-200">
            
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <div>
                <span className="text-[10px] text-amber-400 font-mono font-bold block">
                  REQUEST #{selectedRequest.requestNumber}
                </span>
                <h3 className="text-base font-black text-white">Review Devotee Brief & Quotation</h3>
              </div>
              <button onClick={() => setSelectedRequest(null)} className="p-1.5 rounded-xl hover:bg-slate-800 text-slate-400">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Devotee Info Card */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="text-sm font-bold text-white">{selectedRequest.customerName}</h4>
                  <p className="text-slate-400 text-[11px]">{selectedRequest.customerEmail} • {selectedRequest.customerPhone}</p>
                </div>
                <span className="text-[10px] text-slate-500">
                  Target: {selectedRequest.deadline || 'Standard'}
                </span>
              </div>

              <div className="pt-2 border-t border-slate-800/80">
                <span className="text-slate-400 font-bold block mb-1">Devotee's Creative Brief:</span>
                <p className="text-slate-200 leading-relaxed italic bg-slate-900 p-3 rounded-xl border border-slate-800">
                  "{selectedRequest.briefDescription}"
                </p>
              </div>

              {selectedRequest.referenceImageUrls && selectedRequest.referenceImageUrls.length > 0 && (
                <div className="pt-2">
                  <span className="text-slate-400 font-bold block mb-1.5">Devotee Reference Image:</span>
                  <div className="flex gap-2">
                    {selectedRequest.referenceImageUrls.map((url, i) => (
                      <a key={i} href={url} target="_blank" rel="noreferrer" className="block relative group">
                        <img src={url} alt="Ref" className="w-20 h-20 rounded-xl object-cover border border-amber-500/40" />
                        <span className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center rounded-xl transition-opacity text-white text-[10px]">
                          Open ↗
                        </span>
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Update Form */}
            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Workflow Status *</label>
                  <select
                    value={status}
                    onChange={(e: any) => setStatus(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-amber-300 font-bold outline-none focus:border-amber-500 text-xs"
                  >
                    <option value="RECEIVED">● RECEIVED (New Submission)</option>
                    <option value="IN_REVIEW">● IN_REVIEW (Art Studio Evaluating)</option>
                    <option value="QUOTED">● QUOTED (Price Proposed to Devotee)</option>
                    <option value="DESIGNING">● DESIGNING (Artwork in Progress)</option>
                    <option value="READY">● READY (Design Preview Shared)</option>
                    <option value="COMPLETED">● COMPLETED (Delivered to Devotee)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Quoted Final Price (₹ INR)</label>
                  <input
                    type="number"
                    min={0}
                    value={quotedPrice}
                    onChange={(e) => setQuotedPrice(Number(e.target.value))}
                    placeholder="e.g. 499, 999, 1499"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-bold outline-none focus:border-amber-500 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Assigned Designer / Studio Lead</label>
                <input
                  type="text"
                  value={assignedArtist}
                  onChange={(e) => setAssignedArtist(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white outline-none focus:border-amber-500 text-xs"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Internal Studio Notes & Devotee Feedback</label>
                <textarea
                  rows={3}
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  placeholder="Record custom revisions, agreed colors, WhatsApp discussions, or delivery tracking notes..."
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white outline-none focus:border-amber-500 resize-none text-xs"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setSelectedRequest(null)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black flex items-center space-x-1.5"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{saving ? 'Saving...' : 'Update Status & Quote'}</span>
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
};
