import React, { useEffect } from 'react';
import { CheckCircle2, X, Send, Sparkles } from 'lucide-react';

export interface ToastProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  message: string;
  inquiryId?: string;
  autoCloseDuration?: number;
}

export const SuccessToast: React.FC<ToastProps> = ({
  isOpen,
  onClose,
  title = 'Inquiry Submitted Successfully!',
  message,
  inquiryId,
  autoCloseDuration = 6000,
}) => {
  useEffect(() => {
    if (isOpen && autoCloseDuration > 0) {
      const timer = setTimeout(() => {
        onClose();
      }, autoCloseDuration);
      return () => clearTimeout(timer);
    }
  }, [isOpen, autoCloseDuration, onClose]);

  if (!isOpen) return null;

  return (
    <div
      id="inquiry-success-toast"
      className="fixed bottom-6 right-6 z-50 max-w-md w-full sm:w-[420px] bg-slate-950/95 backdrop-blur-xl border-2 border-teal-400 text-white rounded-3xl p-5 shadow-2xl shadow-teal-950/60 animate-bounce duration-300 pointer-events-auto"
      role="alert"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start space-x-3.5">
          <div className="w-10 h-10 rounded-2xl bg-teal-500 text-slate-950 flex items-center justify-center shrink-0 shadow-lg shadow-teal-500/40 mt-0.5">
            <CheckCircle2 className="w-6 h-6 stroke-[2.5]" />
          </div>
          <div className="space-y-1 pr-2">
            <div className="flex items-center space-x-2">
              <h4 className="text-sm font-black text-white tracking-wide">{title}</h4>
              <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-teal-500/20 text-teal-300 text-[10px] font-bold border border-teal-500/30">
                <Sparkles className="w-2.5 h-2.5 mr-1 text-teal-400" />
                Verified
              </span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed font-normal">{message}</p>
            {inquiryId && (
              <div className="pt-2 flex items-center space-x-2">
                <span className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">Ref ID:</span>
                <span className="text-xs font-mono font-black text-teal-400 bg-teal-950/80 px-2.5 py-1 rounded-lg border border-teal-500/30">
                  {inquiryId}
                </span>
              </div>
            )}
          </div>
        </div>

        <button
          onClick={onClose}
          className="text-slate-400 hover:text-white p-1 rounded-xl hover:bg-slate-800 transition-colors shrink-0"
          aria-label="Close notification"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
        <span className="flex items-center space-x-1 text-teal-300">
          <Send className="w-3 h-3" />
          <span>Our editor will review within 2-4 hours</span>
        </span>
        <span className="text-[10px] text-slate-500">Auto-closing</span>
      </div>
    </div>
  );
};
