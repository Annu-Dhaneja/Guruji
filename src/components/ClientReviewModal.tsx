import React, { useState } from 'react';
import {
  X,
  CheckCircle2,
  RotateCcw,
  MessageSquare,
  Download,
  Eye,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Send,
  Layers,
  ChevronRight,
  Info
} from 'lucide-react';
import { OrderRecord, ProjectFileItem, StudioOrderStatus } from '../types';
import { BeforeAfterSlider } from './BeforeAfterSlider';

interface ClientReviewModalProps {
  order: OrderRecord;
  isOpen: boolean;
  onClose: () => void;
  onStatusUpdated?: (updatedOrder: OrderRecord) => void;
}

const ALL_STATUSES: StudioOrderStatus[] = [
  'NEW ORDER',
  'PAYMENT CONFIRMED',
  'FILES RECEIVED',
  'DESIGNER ASSIGNED',
  'IN PROGRESS',
  'QUALITY CHECK',
  'READY FOR REVIEW',
  'REVISION REQUESTED',
  'APPROVED',
  'FINAL DELIVERY',
  'COMPLETED',
];

export const ClientReviewModal: React.FC<ClientReviewModalProps> = ({
  order,
  isOpen,
  onClose,
  onStatusUpdated,
}) => {
  const [activeFileIndex, setActiveFileIndex] = useState(0);
  const [commentInput, setCommentInput] = useState('');
  const [revisionNotes, setRevisionNotes] = useState('');
  const [showRevisionDialog, setShowRevisionDialog] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [localOrder, setLocalOrder] = useState<OrderRecord>(order);

  if (!isOpen) return null;

  const currentFiles: ProjectFileItem[] = localOrder.files && localOrder.files.length > 0
    ? localOrder.files
    : [
        {
          id: 'demo-file-1',
          name: 'product-hero-master.jpg',
          size: '14.2 MB',
          format: 'JPG',
          originalUrl: '/src/assets/images/hero_watch_raw_1790156645806.jpg',
          editedPreviewUrl: '/src/assets/images/hero_product_watch_edit_1790156495540.jpg',
          finalDownloadUrl: '/src/assets/images/hero_product_watch_edit_1790156495540.jpg',
          status: 'edited',
          comments: [
            {
              id: 'c-1',
              author: 'Vikram Joshi (Senior Retoucher)',
              role: 'designer',
              text: 'Initial Photoshop composite complete: dust cleaned, dial highlights sharpened, pure white background calibrated.',
              timestamp: 'Just now',
            },
          ],
        },
      ];

  const activeFile = currentFiles[activeFileIndex] || currentFiles[0];
  const currentStatus = localOrder.studioOrderStatus || 'READY FOR REVIEW';

  // Add a comment to active file
  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentInput.trim()) return;

    try {
      const res = await fetch(`/api/orders/${localOrder.id}/files/${activeFile.id}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          author: localOrder.customerName || 'Customer',
          role: 'customer',
          text: commentInput.trim(),
        }),
      });
      const data = await res.json();
      if (data.success) {
        const updatedFiles = [...currentFiles];
        if (!updatedFiles[activeFileIndex].comments) {
          updatedFiles[activeFileIndex].comments = [];
        }
        updatedFiles[activeFileIndex].comments.push(data.comment);
        const updated = { ...localOrder, files: updatedFiles };
        setLocalOrder(updated);
        onStatusUpdated?.(updated);
        setCommentInput('');
      }
    } catch {
      // Local fallback
      const newComment = {
        id: `c-${Date.now()}`,
        author: localOrder.customerName || 'Customer',
        role: 'customer' as const,
        text: commentInput.trim(),
        timestamp: new Date().toLocaleTimeString(),
      };
      const updatedFiles = [...currentFiles];
      if (!updatedFiles[activeFileIndex].comments) updatedFiles[activeFileIndex].comments = [];
      updatedFiles[activeFileIndex].comments.push(newComment);
      const updated = { ...localOrder, files: updatedFiles };
      setLocalOrder(updated);
      setCommentInput('');
    }
  };

  // Approve File / Order
  const handleApprove = async () => {
    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/orders/${localOrder.id}/review`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'approve',
          fileId: activeFile.id,
          notes: 'Approved by customer',
        }),
      });
      const data = await res.json();
      if (data.success) {
        setLocalOrder(data.order);
        onStatusUpdated?.(data.order);
      }
    } catch (e) {
      console.error(e);
      const updated = { ...localOrder, studioOrderStatus: 'APPROVED' as StudioOrderStatus };
      setLocalOrder(updated);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Request Revision
  const handleRequestRevision = async () => {
    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/orders/${localOrder.id}/review`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'revision',
          fileId: activeFile.id,
          notes: revisionNotes || 'Customer requested adjustments.',
        }),
      });
      const data = await res.json();
      if (data.success) {
        setLocalOrder(data.order);
        onStatusUpdated?.(data.order);
        setShowRevisionDialog(false);
        setRevisionNotes('');
      }
    } catch (e) {
      console.error(e);
      const updated = {
        ...localOrder,
        studioOrderStatus: 'REVISION REQUESTED' as StudioOrderStatus,
        revisionCount: (localOrder.revisionCount || 0) + 1,
      };
      setLocalOrder(updated);
      setShowRevisionDialog(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const currentStatusIndex = ALL_STATUSES.indexOf(currentStatus);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/90 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-5xl bg-slate-900 border border-purple-500/30 rounded-3xl shadow-2xl overflow-hidden my-auto text-slate-100 flex flex-col max-h-[94vh]">
        
        {/* Top Header */}
        <div className="px-6 py-4 border-b border-slate-800 bg-slate-950/80 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-purple-600/20 border border-purple-500/40 flex items-center justify-center text-purple-400">
              <Eye className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-base font-bold font-heading text-white">
                  Client Review & Approval Interface
                </h3>
                <span className="font-mono text-xs px-2 py-0.5 rounded-full bg-slate-800 text-cyan-300">
                  {localOrder.id}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                {localOrder.projectBrief?.serviceTitle || 'E-Commerce Visual Retouching'} • Revision #{localOrder.revisionCount || 0}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <span className="hidden sm:inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300 text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>{currentStatus}</span>
            </span>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* 12-Step Visual Timeline Carousel / Bar */}
        <div className="px-6 py-3 border-b border-slate-800/80 bg-slate-950/40 overflow-x-auto">
          <div className="flex items-center space-x-1 min-w-max text-[10px]">
            {ALL_STATUSES.map((status, idx) => {
              const isPast = idx < currentStatusIndex;
              const isCurrent = idx === currentStatusIndex;
              return (
                <div key={status} className="flex items-center space-x-1">
                  <div
                    className={`px-2.5 py-1 rounded-full flex items-center space-x-1 font-semibold transition-all ${
                      isCurrent
                        ? 'bg-purple-600 text-white shadow-md shadow-purple-900/40 ring-1 ring-purple-400'
                        : isPast
                        ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                        : 'bg-slate-950 text-slate-500 border border-slate-800'
                    }`}
                  >
                    {isPast && <CheckCircle2 className="w-3 h-3" />}
                    <span>{status}</span>
                  </div>
                  {idx < ALL_STATUSES.length - 1 && (
                    <ChevronRight className="w-3 h-3 text-slate-700 shrink-0" />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Body Grid: Left = Visual Viewer; Right = Annotations & Actions */}
        <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">

          {/* Left Column: Visual Viewer */}
          <div className="lg:col-span-7 space-y-4">
            
            {/* File Switcher (if multiple files) */}
            {currentFiles.length > 1 && (
              <div className="flex items-center space-x-2 overflow-x-auto pb-1">
                {currentFiles.map((file, idx) => (
                  <button
                    key={file.id}
                    onClick={() => setActiveFileIndex(idx)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                      activeFileIndex === idx
                        ? 'bg-purple-600 text-white shadow-sm'
                        : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-white'
                    }`}
                  >
                    Image {idx + 1}: {file.name}
                  </button>
                ))}
              </div>
            )}

            {/* Before / After Interactive Slider */}
            <BeforeAfterSlider
              beforeImage={activeFile.originalUrl}
              afterImage={activeFile.editedPreviewUrl || activeFile.originalUrl}
              beforeLabel="Original RAW Upload"
              afterLabel="Gurucraftpro Edited Proof"
              aspectRatio="aspect-[4/3]"
            />

            {/* File Metadata Card */}
            <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800 text-xs flex flex-wrap items-center justify-between gap-2">
              <div className="space-y-0.5">
                <p className="font-semibold text-white">{activeFile.name}</p>
                <p className="text-slate-400 text-[11px]">
                  Format: {activeFile.format || 'JPG'} • Size: {activeFile.size || '14.2 MB'}
                </p>
              </div>

              <div className="flex items-center space-x-2">
                <a
                  href={activeFile.finalDownloadUrl || activeFile.editedPreviewUrl || activeFile.originalUrl}
                  download={activeFile.name}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs transition-colors flex items-center space-x-1.5"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download File</span>
                </a>
              </div>
            </div>

          </div>

          {/* Right Column: Review Decisions & File Comments */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-4">
            
            {/* Action Bar */}
            <div className="p-4 rounded-3xl bg-slate-950 border border-purple-500/20 space-y-3">
              <span className="text-xs font-bold text-slate-300 block uppercase tracking-wider">
                Review Decision
              </span>
              <p className="text-xs text-slate-400 leading-relaxed">
                Inspect the edited proof above. Approve to trigger final high-res export, or request a revision with notes.
              </p>

              <div className="grid grid-cols-2 gap-2 pt-1">
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={handleApprove}
                  className="py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-900/30 flex items-center justify-center space-x-1.5 transition-all disabled:opacity-50"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Approve Proof</span>
                </button>

                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={() => setShowRevisionDialog(true)}
                  className="py-3 rounded-2xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 font-bold text-xs flex items-center justify-center space-x-1.5 transition-all disabled:opacity-50"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Request Revision</span>
                </button>
              </div>

              {localOrder.revisionCount !== undefined && localOrder.revisionCount > 0 && (
                <div className="text-[11px] text-amber-400 font-medium flex items-center space-x-1 pt-1">
                  <Info className="w-3.5 h-3.5" />
                  <span>Total revisions requested on this project: {localOrder.revisionCount}</span>
                </div>
              )}
            </div>

            {/* Revision Request Form Modal Dialog */}
            {showRevisionDialog && (
              <div className="p-4 rounded-2xl bg-amber-950/40 border border-amber-500/50 space-y-3 animate-fadeIn">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-amber-300 uppercase tracking-wider">
                    Specify Revision Adjustments
                  </h4>
                  <button
                    onClick={() => setShowRevisionDialog(false)}
                    className="text-slate-400 hover:text-white"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <textarea
                  rows={3}
                  value={revisionNotes}
                  onChange={(e) => setRevisionNotes(e.target.value)}
                  placeholder="e.g. Please soften the drop shadow on the bottom, brighten the product label slightly, and remove the small reflection spot on the left corner."
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-amber-500/30 text-xs text-white focus:outline-none focus:border-amber-400 resize-none"
                />
                <button
                  type="button"
                  disabled={isSubmitting || !revisionNotes.trim()}
                  onClick={handleRequestRevision}
                  className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-colors flex items-center justify-center space-x-1.5 disabled:opacity-50"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Submit Revision Request to Designer</span>
                </button>
              </div>
            )}

            {/* Comments & Annotations Stream */}
            <div className="flex-1 flex flex-col justify-between p-4 rounded-3xl bg-slate-950/60 border border-slate-800 space-y-3 min-h-[220px]">
              <div>
                <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-3">
                  <div className="flex items-center space-x-1.5 text-xs font-bold text-slate-300">
                    <MessageSquare className="w-4 h-4 text-purple-400" />
                    <span>File Discussion & Notes</span>
                  </div>
                  <span className="text-[10px] text-slate-500 font-mono">
                    {activeFile.comments?.length || 0} note(s)
                  </span>
                </div>

                <div className="space-y-2.5 max-h-48 overflow-y-auto pr-1">
                  {(!activeFile.comments || activeFile.comments.length === 0) ? (
                    <p className="text-xs text-slate-500 italic py-4 text-center">
                      No feedback notes added yet. Add a specific note below.
                    </p>
                  ) : (
                    activeFile.comments.map((c) => (
                      <div
                        key={c.id}
                        className={`p-2.5 rounded-xl text-xs space-y-1 ${
                          c.role === 'customer'
                            ? 'bg-purple-950/50 border border-purple-500/30 ml-3'
                            : 'bg-slate-900 border border-slate-800 mr-3'
                        }`}
                      >
                        <div className="flex items-center justify-between text-[10px]">
                          <span className="font-bold text-white">{c.author}</span>
                          <span className="text-slate-500">{c.timestamp}</span>
                        </div>
                        <p className="text-slate-300 text-xs leading-relaxed">{c.text}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Add Comment Input Form */}
              <form onSubmit={handleAddComment} className="pt-2 flex items-center space-x-2">
                <input
                  type="text"
                  value={commentInput}
                  onChange={(e) => setCommentInput(e.target.value)}
                  placeholder="e.g. Please make the shadow slightly softer..."
                  className="flex-1 px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-purple-500"
                />
                <button
                  type="submit"
                  disabled={!commentInput.trim()}
                  className="p-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white disabled:opacity-50 transition-colors"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>

            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
