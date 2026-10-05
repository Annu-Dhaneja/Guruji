import React, { useState } from 'react';
import {
  X,
  Sparkles,
  HelpCircle,
  ArrowRight,
  CheckCircle2,
  Zap,
  Clock,
  ShieldCheck,
  Search,
  Upload,
  RefreshCw,
} from 'lucide-react';
import { QuickDigitalService } from '../../types';
import { QuickServiceIcon } from './QuickServiceIcon';

interface QuickDiagnosticModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectService: (service: QuickDigitalService) => void;
}

export const QuickDiagnosticModal: React.FC<QuickDiagnosticModalProps> = ({
  isOpen,
  onClose,
  onSelectService,
}) => {
  if (!isOpen) return null;

  const [selectedProblemType, setSelectedProblemType] = useState<string>('');
  const [userDescription, setUserDescription] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [recommendation, setRecommendation] = useState<{
    service: QuickDigitalService;
    reason: string;
    confidence: string;
  } | null>(null);

  const symptomOptions = [
    {
      id: 'background',
      title: 'Background is messy or wrong',
      desc: 'Need transparent background or pure white studio backdrop',
      icon: 'Eraser',
    },
    {
      id: 'blurry',
      title: 'Photo is blurry / low quality',
      desc: 'Need to sharpen details, faces, text or reconstruct resolution',
      icon: 'Eye',
    },
    {
      id: 'size',
      title: 'Image size / ratio is wrong',
      desc: 'Need to fit Instagram, banner, or specific pixel dimensions',
      icon: 'Maximize2',
    },
    {
      id: 'product',
      title: 'Product photo needs cleanup',
      desc: 'Dust, scratches, glare or shadow needed for commercial store',
      icon: 'ShoppingBag',
    },
    {
      id: 'amazon',
      title: 'Amazon / Marketplace listing rejected',
      desc: 'Requires 100% pure white RGB 255 background and 85% fill',
      icon: 'CheckCircle',
    },
    {
      id: 'logo',
      title: 'Logo is pixelated or has white box',
      desc: 'Need crisp scalable vector (SVG/PNG) without background',
      icon: 'PenTool',
    },
    {
      id: 'signature',
      title: 'Paper signature / stamp needs cleaning',
      desc: 'Convert smartphone photo of signature into clean transparent PNG',
      icon: 'Feather',
    },
    {
      id: 'document',
      title: 'Document / certificate photo is dark',
      desc: 'Shadows, desk background, or crooked paper needs flat scan look',
      icon: 'FileCheck',
    },
    {
      id: 'passport',
      title: 'Passport / Visa ID photo spec',
      desc: 'Crop to 2x2 inch / 35x45mm with plain white or blue background',
      icon: 'UserCheck',
    },
    {
      id: 'text',
      title: 'Need to remove/fix text in image',
      desc: 'Watermark, typo, phone number or date stamp removal',
      icon: 'Type',
    },
    {
      id: 'print',
      title: 'File is not print-ready (CMYK / DPI)',
      desc: 'Printer rejected file due to low DPI, missing bleed, or RGB color',
      icon: 'Printer',
    },
    {
      id: 'social',
      title: 'Need multiple social media sizes',
      desc: 'Convert 1 image into Instagram post, story, and Facebook cover',
      icon: 'Share2',
    },
  ];

  const handleDiagnose = async (problemId?: string) => {
    const targetType = problemId || selectedProblemType;
    if (!targetType && !userDescription.trim()) {
      alert('Please select a problem symptom or write what is wrong.');
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch('/api/quick-services/recommend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          problemType: targetType,
          userDescription,
        }),
      });

      const data = await res.json();
      if (data.success && data.recommendation) {
        setRecommendation(data.recommendation);
      }
    } catch (err) {
      console.error('Diagnosis error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
      <div className="relative w-full max-w-2xl bg-[#15171D] rounded-2xl border border-[#222632] shadow-2xl overflow-hidden transition-all my-6 text-white">
        
        {/* Header */}
        <div className="px-6 py-5 bg-[#101217] border-b border-[#222632] flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-[#15171D] text-amber-400 border border-[#222632] flex items-center justify-center shadow-sm">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white flex items-center space-x-2">
                <span>Guided Diagnostic Assistant</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#15171D] border border-[#222632] text-amber-400 font-bold">
                  Smart Match
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Not sure which service you need? Tell us the symptom and we’ll diagnose the exact fix.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-[#1C2029] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 sm:p-8 max-h-[75vh] overflow-y-auto space-y-6">
          {!recommendation ? (
            <>
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-3">
                  What seems to be the problem with your image or file?
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {symptomOptions.map((opt) => {
                    const isSelected = selectedProblemType === opt.id;
                    return (
                      <div
                        key={opt.id}
                        onClick={() => {
                          setSelectedProblemType(opt.id);
                          handleDiagnose(opt.id);
                        }}
                        className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-start space-x-3 group ${
                          isSelected
                            ? 'bg-[#1C2029] border-amber-500 shadow-sm text-white'
                            : 'bg-[#101217] border-[#222632] hover:border-amber-500/40 text-slate-300'
                        }`}
                      >
                        <div className="p-2 rounded-lg bg-[#15171D] border border-[#222632] text-amber-400 shrink-0">
                          <QuickServiceIcon name={opt.icon} className="w-4 h-4" />
                        </div>
                        <div>
                          <h5 className="text-xs font-bold text-white group-hover:text-amber-400 transition-colors">
                            {opt.title}
                          </h5>
                          <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-2 leading-tight">
                            {opt.desc}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Freeform text input fallback */}
              <div className="pt-2 border-t border-[#222632] space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                  Or describe your issue in plain words:
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="e.g. My photo is very dark and has a distracting person in the corner"
                    value={userDescription}
                    onChange={(e) => setUserDescription(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleDiagnose();
                    }}
                    className="flex-1 px-4 py-2.5 rounded-xl bg-[#101217] border border-[#222632] text-xs text-white focus:outline-none focus:border-amber-500/60"
                  />
                  <button
                    type="button"
                    disabled={isLoading}
                    onClick={() => handleDiagnose()}
                    className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-sm transition-all flex items-center space-x-1.5 shrink-0 disabled:opacity-50"
                  >
                    {isLoading ? (
                      <RefreshCw className="w-4 h-4 animate-spin" />
                    ) : (
                      <>
                        <span>Find Fix</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            </>
          ) : (
            /* DIAGNOSIS RESULT CARD */
            <div className="space-y-6 py-2">
              <div className="p-6 rounded-2xl bg-[#101217] border border-[#222632] space-y-5">
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#15171D] text-amber-400 border border-[#222632] flex items-center space-x-1">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>Exact Solution Matched ({recommendation.confidence} Match)</span>
                  </span>
                  <button
                    onClick={() => setRecommendation(null)}
                    className="text-xs text-slate-400 hover:text-white underline font-bold"
                  >
                    Try Another Symptom
                  </button>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-14 h-14 rounded-xl bg-[#15171D] text-amber-400 border border-[#222632] flex items-center justify-center shrink-0 shadow-sm">
                    <QuickServiceIcon name={recommendation.service.iconName} className="w-7 h-7" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase text-amber-400">
                      Recommended Fix:
                    </span>
                    <h4 className="text-xl font-bold text-white">
                      {recommendation.service.name}
                    </h4>
                    <p className="text-xs text-slate-300 mt-1">
                      {recommendation.reason}
                    </p>
                  </div>
                </div>

                {/* Price & Delivery Badge */}
                <div className="flex items-center justify-between p-3.5 rounded-xl bg-[#15171D] border border-[#222632]">
                  <div className="flex items-center space-x-4 text-xs">
                    <div>
                      <span className="text-slate-400 block text-[10px]">Price:</span>
                      <strong className="text-amber-400 font-bold text-sm">₹{recommendation.service.price}</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">Delivery:</span>
                      <strong className="text-amber-400 font-bold flex items-center space-x-1">
                        <Clock className="w-3 h-3" />
                        <span>{recommendation.service.deliveryTime}</span>
                      </strong>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onSelectService(recommendation.service);
                    }}
                    className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold shadow-sm transition-all flex items-center space-x-1.5"
                  >
                    <span>Fix This With {recommendation.service.name}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-400 px-2">
                <span>Includes free preview check & resolution enhancement.</span>
                <button
                  type="button"
                  onClick={() => setRecommendation(null)}
                  className="hover:text-amber-400 underline"
                >
                  Diagnose another problem
                </button>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
