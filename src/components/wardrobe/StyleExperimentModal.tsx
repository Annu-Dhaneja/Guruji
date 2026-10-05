import React, { useState } from 'react';
import {
  X,
  Sparkles,
  FlaskConical,
  CheckCircle2,
  RefreshCw,
  ArrowRight,
  Zap,
} from 'lucide-react';
import { WardrobeClothingItem } from '../../types';

interface StyleExperimentModalProps {
  isOpen: boolean;
  onClose: () => void;
  wardrobe: WardrobeClothingItem[];
}

export const StyleExperimentModal: React.FC<StyleExperimentModalProps> = ({
  isOpen,
  onClose,
  wardrobe,
}) => {
  const [selectedExperiment, setSelectedExperiment] = useState<'monochrome' | 'high_contrast' | 'odd_pairing' | 'layering'>('monochrome');

  if (!isOpen) return null;

  const experiments = [
    {
      id: 'monochrome',
      title: 'Tonal Monochrome Challenge',
      desc: 'Style head-to-toe in subtle gradient shades of a single color family (e.g. Navy on Black, All-Earthy Tones).',
      formula: 'Layer dark neutral top + matching tone trousers + minimalist monochrome shoes.',
    },
    {
      id: 'high_contrast',
      title: 'High-Contrast Proportions',
      desc: 'Pair an ultra-relaxed oversize top with tapered tailored bottoms, or structured blazer with relaxed pants.',
      formula: '1 Fitted Piece + 1 Relaxed Piece for modern optical dynamism.',
    },
    {
      id: 'odd_pairing',
      title: 'The "Wrong Shoe" Theory',
      desc: 'Wear formal trousers with clean sneakers, or sharp loafers with casual denim for an intentional fashion-editor look.',
      formula: 'Smart Tailoring + Casual Sneaker / Loafer.',
    },
    {
      id: 'layering',
      title: 'The 3-Piece Rule',
      desc: 'Never leave the outfit at just top + bottom. Add an open overshirt, accessory, or structured layer for visual depth.',
      formula: 'Base Top + Bottom + Overlayer / Accent.',
    },
  ];

  const activeExp = experiments.find((e) => e.id === selectedExperiment) || experiments[0];
  const previewItems = wardrobe.slice(0, 3);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div
        className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden text-slate-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-slate-900/80">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <FlaskConical className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Style Experiment Mode</h3>
              <p className="text-xs text-slate-400">Step outside routine styling rules with AI prompts</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4 text-xs">
          {/* Experiment Tabs */}
          <div className="grid grid-cols-2 gap-1.5">
            {experiments.map((exp) => (
              <button
                key={exp.id}
                onClick={() => setSelectedExperiment(exp.id as any)}
                className={`p-2.5 rounded-xl border text-left transition-all ${
                  selectedExperiment === exp.id
                    ? 'bg-amber-500 text-slate-950 font-bold border-amber-400 shadow-sm'
                    : 'bg-slate-950 border-slate-800 text-slate-300 hover:bg-slate-800/80'
                }`}
              >
                <div className="truncate font-semibold">{exp.title}</div>
              </button>
            ))}
          </div>

          {/* Active Experiment Detail */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
            <div>
              <span className="text-[10px] uppercase font-bold text-amber-400">Style Theory</span>
              <h4 className="text-sm font-bold text-white mt-0.5">{activeExp.title}</h4>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">{activeExp.desc}</p>
            </div>

            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-slate-200">
              <strong className="text-amber-400 text-[11px] block">📐 Rule to Execute:</strong>
              <p className="text-[11px] mt-0.5 text-slate-300">{activeExp.formula}</p>
            </div>

            {/* Suggested Pieces from Closet */}
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1.5">
                Suggested Pieces From Your Wardrobe:
              </span>
              <div className="grid grid-cols-3 gap-2">
                {previewItems.map((item) => (
                  <div
                    key={item.id}
                    className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-center space-y-1"
                  >
                    <div className="aspect-square rounded-lg overflow-hidden bg-slate-950 mb-1">
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <p className="text-[10px] text-slate-200 font-medium truncate">{item.name}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
