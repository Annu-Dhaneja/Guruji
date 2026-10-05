import React, { useState, useEffect } from 'react';
import {
  Layers,
  Download,
  Upload,
  CheckCircle2,
  Clock,
  RotateCcw,
  Sparkles,
  FileText,
  MessageSquare,
  AlertCircle,
  ExternalLink,
  ChevronRight,
  Filter
} from 'lucide-react';
import { OrderRecord, ProjectFileItem } from '../types';

export const DesignerWorkspaceView: React.FC = () => {
  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<OrderRecord | null>(null);
  const [filterTab, setFilterTab] = useState<'all' | 'assigned' | 'in-progress' | 'revisions' | 'completed'>('all');
  const [editedPreviewInput, setEditedPreviewInput] = useState('');
  const [finalDownloadInput, setFinalDownloadInput] = useState('');
  const [designerNote, setDesignerNote] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [message, setMessage] = useState('');

  const fetchOrders = () => {
    fetch('/api/orders')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setOrders(data);
          if (!selectedOrder && data.length > 0) {
            setSelectedOrder(data[0]);
          }
        }
      })
      .catch(console.error);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const filteredOrders = orders.filter((o) => {
    if (filterTab === 'assigned') return o.studioOrderStatus === 'DESIGNER ASSIGNED';
    if (filterTab === 'in-progress') return o.studioOrderStatus === 'IN PROGRESS';
    if (filterTab === 'revisions') return o.studioOrderStatus === 'REVISION REQUESTED';
    if (filterTab === 'completed') return o.studioOrderStatus === 'COMPLETED' || o.studioOrderStatus === 'APPROVED';
    return true;
  });

  const handleStatusChange = async (newStatus: string) => {
    if (!selectedOrder) return;
    setIsUpdating(true);
    try {
      const res = await fetch(`/api/orders/${selectedOrder.id}/studio-status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: newStatus,
          actor: 'Designer (Vikram Joshi)',
          note: designerNote || `Status updated to ${newStatus}`,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setSelectedOrder(data.order);
        fetchOrders();
        setMessage(`Status changed to ${newStatus}`);
        setDesignerNote('');
        setTimeout(() => setMessage(''), 3000);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleUploadProof = async (fileId: string) => {
    if (!selectedOrder) return;
    setIsUpdating(true);
    try {
      const res = await fetch(`/api/orders/${selectedOrder.id}/files/${fileId}/upload-edit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          editedPreviewUrl: editedPreviewInput || '/src/assets/images/hero_product_watch_edit_1790156495540.jpg',
          finalDownloadUrl: finalDownloadInput || '/src/assets/images/hero_product_watch_edit_1790156495540.jpg',
        }),
      });
      const data = await res.json();
      if (data.success) {
        setSelectedOrder(data.order);
        fetchOrders();
        setMessage('Edited proof uploaded and sent for client review!');
        setEditedPreviewInput('');
        setFinalDownloadInput('');
        setTimeout(() => setMessage(''), 3000);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-purple-950 via-slate-900 to-slate-950 border border-purple-500/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
            <h2 className="text-xl font-bold font-heading text-white">
              Photoshop Designer & Retoucher Desk
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1 max-w-xl">
            Welcome Vikram Joshi (Senior Photoshop Lead). View assigned tasks, download raw customer assets, upload finished proofs, and inspect client revision notes.
          </p>
        </div>

        <div className="flex items-center space-x-3 text-xs">
          <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 text-center">
            <span className="text-slate-400 block text-[10px]">Today's Tasks</span>
            <span className="text-lg font-black text-cyan-400">{orders.length}</span>
          </div>
          <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 text-center">
            <span className="text-slate-400 block text-[10px]">Pending QA</span>
            <span className="text-lg font-black text-amber-400">
              {orders.filter((o) => o.studioOrderStatus === 'QUALITY CHECK').length}
            </span>
          </div>
        </div>
      </div>

      {message && (
        <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-semibold flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>{message}</span>
        </div>
      )}

      {/* Tabs Filter */}
      <div className="flex items-center space-x-2 border-b border-slate-800 pb-2 text-xs overflow-x-auto">
        {[
          { id: 'all', label: `All Projects (${orders.length})` },
          { id: 'assigned', label: 'Assigned Today' },
          { id: 'in-progress', label: 'In Progress' },
          { id: 'revisions', label: 'Revision Requests' },
          { id: 'completed', label: 'Completed' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setFilterTab(tab.id as any)}
            className={`px-3 py-1.5 rounded-xl font-semibold transition-colors whitespace-nowrap ${
              filterTab === tab.id
                ? 'bg-purple-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Main Grid: Orders list vs Selected Project Detail */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Project List */}
        <div className="lg:col-span-4 space-y-3 max-h-[750px] overflow-y-auto pr-1">
          {filteredOrders.length === 0 ? (
            <div className="p-8 text-center rounded-2xl bg-slate-950/40 border border-slate-800 text-slate-500 text-xs">
              No projects matching this filter tab.
            </div>
          ) : (
            filteredOrders.map((order) => {
              const isSelected = selectedOrder?.id === order.id;
              return (
                <div
                  key={order.id}
                  onClick={() => setSelectedOrder(order)}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-purple-950/30 border-purple-500 shadow-lg shadow-purple-950/40 ring-1 ring-purple-500'
                      : 'bg-slate-950/70 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between text-[11px] mb-1">
                    <span className="font-mono font-bold text-cyan-400">{order.id}</span>
                    <span className="px-2 py-0.5 rounded-full bg-slate-900 text-slate-400 border border-slate-800 text-[10px]">
                      {order.studioOrderStatus || 'NEW ORDER'}
                    </span>
                  </div>

                  <h4 className="text-sm font-bold text-white truncate">
                    {order.projectBrief?.serviceTitle || order.items[0]?.name || 'E-Com Editing'}
                  </h4>

                  <div className="flex items-center justify-between text-xs text-slate-400 mt-2">
                    <span>Client: {order.customerName}</span>
                    <span className="text-amber-400 font-medium">
                      {order.projectBrief?.deadlinePreference || '24h'}
                    </span>
                  </div>

                  {order.revisionCount !== undefined && order.revisionCount > 0 && (
                    <div className="mt-2 text-[10px] text-amber-300 font-bold flex items-center space-x-1">
                      <RotateCcw className="w-3 h-3" />
                      <span>{order.revisionCount} revision requested</span>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Right Column: Selected Project Brief & Workspace */}
        <div className="lg:col-span-8">
          {selectedOrder ? (
            <div className="p-6 rounded-3xl bg-slate-950 border border-slate-800 space-y-6">
              
              {/* Header */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
                <div>
                  <div className="flex items-center space-x-2">
                    <h3 className="text-lg font-bold font-heading text-white">
                      {selectedOrder.projectBrief?.serviceTitle || 'Project Retouching'}
                    </h3>
                    <span className="font-mono text-xs px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/40">
                      {selectedOrder.id}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Target Marketplace: <strong className="text-white">{selectedOrder.projectBrief?.marketplace || 'Amazon'}</strong> • Category: <strong className="text-white">{selectedOrder.projectBrief?.category || 'General'}</strong>
                  </p>
                </div>

                {/* Designer Status Update Dropdown */}
                <div className="flex items-center space-x-2">
                  <select
                    value={selectedOrder.studioOrderStatus || 'IN PROGRESS'}
                    onChange={(e) => handleStatusChange(e.target.value)}
                    disabled={isUpdating}
                    className="px-3 py-2 rounded-xl bg-slate-900 border border-purple-500/40 text-xs font-bold text-white focus:outline-none focus:border-purple-400"
                  >
                    <option value="DESIGNER ASSIGNED">DESIGNER ASSIGNED</option>
                    <option value="IN PROGRESS">IN PROGRESS</option>
                    <option value="QUALITY CHECK">QUALITY CHECK (Submit for QA)</option>
                    <option value="READY FOR REVIEW">READY FOR REVIEW</option>
                    <option value="FINAL DELIVERY">FINAL DELIVERY</option>
                    <option value="COMPLETED">COMPLETED</option>
                  </select>
                </div>
              </div>

              {/* Project Brief Specifications Box */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-2xl bg-slate-900/60 border border-slate-800 text-xs">
                <div>
                  <span className="text-slate-400 block text-[11px]">Dimensions:</span>
                  <span className="font-semibold text-white">
                    {selectedOrder.projectBrief?.dimensions || '2000 x 2000 px'}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Background:</span>
                  <span className="font-semibold text-white">
                    {selectedOrder.projectBrief?.backgroundReq || 'RGB 255 White'}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Shadow:</span>
                  <span className="font-semibold text-white">
                    {selectedOrder.projectBrief?.shadowReq || 'Soft Natural'}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Turnaround:</span>
                  <span className="font-semibold text-amber-400">
                    {selectedOrder.projectBrief?.deadlinePreference || 'Standard 24h'}
                  </span>
                </div>
              </div>

              {/* Special Instructions */}
              {selectedOrder.projectBrief?.specialInstructions && (
                <div className="p-4 rounded-2xl bg-purple-950/20 border border-purple-500/30 text-xs space-y-1">
                  <span className="font-bold text-purple-300 block">Customer Brief & Instructions:</span>
                  <p className="text-slate-300 leading-relaxed">
                    "{selectedOrder.projectBrief.specialInstructions}"
                  </p>
                </div>
              )}

              {/* Project Assets / Files */}
              <div className="space-y-4">
                <h4 className="text-sm font-bold text-white border-b border-slate-800 pb-2">
                  Project Assets & Upload Proofs
                </h4>

                {(selectedOrder.files && selectedOrder.files.length > 0
                  ? selectedOrder.files
                  : [
                      {
                        id: 'demo-asset-1',
                        name: 'product-raw-camera-angle1.jpg',
                        size: '14.2 MB',
                        format: 'JPG',
                        originalUrl: '/src/assets/images/hero_watch_raw_1790156645806.jpg',
                        editedPreviewUrl: '/src/assets/images/hero_product_watch_edit_1790156495540.jpg',
                        status: 'edited' as const,
                        comments: [],
                      },
                    ]
                ).map((file, idx) => (
                  <div
                    key={file.id}
                    className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3 text-xs"
                  >
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                      <div className="flex items-center space-x-3">
                        <img
                          src={file.originalUrl}
                          alt="Raw preview"
                          className="w-12 h-12 rounded-xl object-cover bg-slate-950 border border-slate-800"
                        />
                        <div>
                          <p className="font-bold text-white">{file.name}</p>
                          <span className="text-slate-400 text-[11px]">
                            {file.format} • {file.size || 'Raw File'}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <a
                          href={file.originalUrl}
                          download={file.name}
                          className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs transition-colors flex items-center space-x-1"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>Download Raw</span>
                        </a>
                      </div>
                    </div>

                    {/* Proof Upload Form for this file */}
                    <div className="pt-2 border-t border-slate-800/80 grid grid-cols-1 sm:grid-cols-12 gap-2 items-center">
                      <div className="sm:col-span-9">
                        <input
                          type="text"
                          value={editedPreviewInput}
                          onChange={(e) => setEditedPreviewInput(e.target.value)}
                          placeholder="Paste edited preview URL or leave blank for demo retouch asset"
                          className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-purple-500"
                        />
                      </div>
                      <div className="sm:col-span-3">
                        <button
                          type="button"
                          disabled={isUpdating}
                          onClick={() => handleUploadProof(file.id)}
                          className="w-full py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs transition-colors flex items-center justify-center space-x-1 disabled:opacity-50"
                        >
                          <Upload className="w-3.5 h-3.5" />
                          <span>Submit Proof</span>
                        </button>
                      </div>
                    </div>

                    {/* File Comments from Client */}
                    {file.comments && file.comments.length > 0 && (
                      <div className="mt-2 p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                        <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider block">
                          Client Feedback Notes:
                        </span>
                        {file.comments.map((c) => (
                          <div key={c.id} className="text-[11px] text-slate-300">
                            <strong>{c.author}:</strong> {c.text}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Activity Log */}
              <div className="space-y-2 pt-2 border-t border-slate-800">
                <span className="text-xs font-bold text-slate-400 block uppercase tracking-wider">
                  Audit Activity Trail
                </span>
                <div className="space-y-1.5 max-h-40 overflow-y-auto text-[11px]">
                  {(selectedOrder.activities || []).map((act) => (
                    <div
                      key={act.id}
                      className="p-2 rounded-xl bg-slate-900 border border-slate-850 flex items-center justify-between text-slate-400"
                    >
                      <span>
                        <strong className="text-slate-200">{act.action}</strong> by {act.actor}: {act.note}
                      </span>
                      <span className="text-[10px] text-slate-500">
                        {new Date(act.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          ) : (
            <div className="p-12 text-center rounded-3xl bg-slate-950 border border-slate-800 text-slate-500 text-xs">
              Select a project from the left to start editing.
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
