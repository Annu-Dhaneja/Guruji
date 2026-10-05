import React from 'react';
import {
  Upload,
  Sliders,
  Sparkles,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Clock,
  Layers,
  FileCheck
} from 'lucide-react';

interface HowItWorksPageProps {
  onNavigate: (route: string) => void;
  onOpenOrderWizard: () => void;
}

export const HowItWorksPage: React.FC<HowItWorksPageProps> = ({
  onNavigate,
  onOpenOrderWizard,
}) => {
  const steps = [
    {
      number: '01',
      title: 'Upload Raw Product Photos',
      description:
        'Upload your camera shots or phone clicks. Send individual JPGs, PNGs, or a single master ZIP file. No need for professional lighting—our retouchers handle exposure, shadows, and reflections.',
      icon: Upload,
      color: 'from-purple-500 to-indigo-600',
    },
    {
      number: '02',
      title: 'Specify Marketplace Requirements',
      description:
        'Select your target channels—Amazon India, Flipkart, Myntra, Meesho, or Shopify. Choose dimensions (e.g. 2000x2000px, 1080x1440px 3:4), shadow styles, and custom instructions.',
      icon: Sliders,
      color: 'from-indigo-600 to-cyan-500',
    },
    {
      number: '03',
      title: 'Photoshop Retouching & 3-Tier QC',
      description:
        'Our senior Photoshop specialists hand-clip each product using pen tool paths, eliminate dust and scratches, balance true-to-life colors, and pass every asset through strict marketplace QC.',
      icon: Sparkles,
      color: 'from-cyan-500 to-emerald-500',
    },
    {
      number: '04',
      title: 'Client Review, Revisions & High-Res Delivery',
      description:
        'Inspect your edited proof in our interactive Before/After viewer. Leave pinned comments for adjustments or click Approve to download full-resolution web and print-ready files.',
      icon: CheckCircle2,
      color: 'from-emerald-500 to-amber-500',
    },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pt-20 pb-24">
      {/* Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center space-y-4">
        <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300 text-xs font-bold">
          <Clock className="w-3.5 h-3.5 text-amber-300" />
          <span>Seamless Remote Creative Workflow</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-black font-heading text-white tracking-tight">
          How Gurucraftpro Works
        </h1>

        <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
          From raw camera shots to high-converting marketplace creatives in four simple, transparent steps.
        </p>
      </div>

      {/* 4 Steps Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <div
                key={step.number}
                className="relative rounded-3xl bg-slate-900 border border-slate-800 p-6 flex flex-col justify-between hover:border-purple-500/40 transition-all hover:shadow-2xl hover:shadow-purple-950/20 group"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-3xl font-black text-slate-700 font-mono group-hover:text-purple-400 transition-colors">
                      {step.number}
                    </span>
                    <div
                      className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center text-white shadow-lg`}
                    >
                      <Icon className="w-6 h-6" />
                    </div>
                  </div>

                  <h3 className="text-base font-bold font-heading text-white mb-2">
                    {step.title}
                  </h3>

                  <p className="text-xs text-slate-400 leading-relaxed">
                    {step.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-800/80 text-[11px] text-cyan-400 font-medium">
                  Guaranteed Turnaround: 12-24h
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Marketplace Standards Matrix */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-20">
        <div className="p-8 sm:p-12 rounded-3xl bg-slate-900 border border-slate-800 space-y-8">
          <div className="text-center max-w-2xl mx-auto">
            <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">
              Indian E-Commerce Compliance
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold font-heading text-white mt-1">
              Marketplace Visual Guidelines We Enforce
            </h2>
            <p className="text-xs text-slate-400 mt-2">
              Never get rejected by marketplace QC algorithms again. We verify every specification before export.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
            <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
              <h4 className="text-base font-bold text-amber-400">Amazon India Guidelines</h4>
              <ul className="space-y-2 text-slate-300">
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Main image must be pure white (RGB 255, 255, 255)</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Product must occupy 85% or more of image area</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>2000 x 2000 px recommended for seamless zoom</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>No watermarks, promotional text, or borders on main image</span>
                </li>
              </ul>
            </div>

            <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
              <h4 className="text-base font-bold text-pink-400">Myntra Fashion Guidelines</h4>
              <ul className="space-y-2 text-slate-300">
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Strict 3:4 aspect ratio (1080 x 1440 px minimum)</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Editorial light grey or clean contextual studio background</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Multi-angle requirements: Front, back, side, fabric texture</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Skin-tone consistency and true fabric dye calibration</span>
                </li>
              </ul>
            </div>

            <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
              <h4 className="text-base font-bold text-cyan-400">Flipkart Guidelines</h4>
              <ul className="space-y-2 text-slate-300">
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>High-contrast foreground clarity for mobile browsing</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Standard 1:1 or 3:4 portrait resolution format</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Natural ground shadow to prevent flat sticker look</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Fast automated QC pass assurance</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 text-center">
        <button
          type="button"
          onClick={onOpenOrderWizard}
          className="px-8 py-4 rounded-2xl bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 text-white font-black text-sm shadow-xl shadow-purple-900/40 inline-flex items-center space-x-2 transition-transform hover:scale-105"
        >
          <span>Start Your First Project Today</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
