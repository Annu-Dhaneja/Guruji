import React, { useState } from 'react';
import {
  ArrowLeft,
  CheckCircle2,
  Sparkles,
  Clock,
  ShieldCheck,
  ShoppingBag,
  Layers,
  ArrowRight,
  FileCheck,
  Zap,
  HelpCircle,
  Download
} from 'lucide-react';
import { STUDIO_SERVICES } from '../data/studioServicesData';
import { BeforeAfterSlider } from '../components/BeforeAfterSlider';
import { ProjectWizardModal } from '../components/ProjectWizardModal';

interface StudioServiceDetailPageProps {
  slug: string;
  onNavigate: (route: string) => void;
  onOpenOrderWizard: (serviceSlug?: string) => void;
}

export const StudioServiceDetailPage: React.FC<StudioServiceDetailPageProps> = ({
  slug,
  onNavigate,
  onOpenOrderWizard,
}) => {
  const service = STUDIO_SERVICES.find((s) => s.slug === slug) || STUDIO_SERVICES[0];
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  // Fallback before/after image pairs based on service category
  const beforeImg =
    service.beforeImageUrl ||
    (service.category === 'marketplace-design'
      ? '/src/assets/images/sneaker_raw_1790156678698.jpg'
      : service.slug.includes('cosmetic') || service.category === 'listing-design'
      ? '/src/assets/images/cosmetics_raw_1790156661714.jpg'
      : '/src/assets/images/hero_watch_raw_1790156645806.jpg');

  const afterImg =
    service.afterImageUrl ||
    (service.category === 'marketplace-design'
      ? '/src/assets/images/marketplace_sneaker_lifestyle_1790156519357.jpg'
      : service.slug.includes('cosmetic') || service.category === 'listing-design'
      ? '/src/assets/images/product_cosmetics_clean_1790156507953.jpg'
      : '/src/assets/images/hero_product_watch_edit_1790156495540.jpg');

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pt-20 pb-24">
      
      {/* Breadcrumb Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center space-x-2 text-xs text-slate-400">
          <button
            onClick={() => onNavigate('home')}
            className="hover:text-white transition-colors"
          >
            Home
          </button>
          <span>/</span>
          <button
            onClick={() => onNavigate('services')}
            className="hover:text-white transition-colors"
          >
            Services
          </button>
          <span>/</span>
          <span className="text-purple-400 font-medium">{service.title}</span>
        </div>
      </div>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          {/* Left Column: Copy & Specs */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300 text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>{service.categoryLabel}</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-heading text-white tracking-tight leading-tight">
              {service.title}
            </h1>

            <p className="text-base sm:text-lg text-slate-300 font-light leading-relaxed">
              {service.description}
            </p>

            {/* Quick Metrics Badges */}
            <div className="grid grid-cols-3 gap-3 py-2">
              <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800">
                <span className="text-[11px] text-slate-400 block">Starting At</span>
                <span className="text-xl font-black text-amber-400">₹{service.startingPrice}</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800">
                <span className="text-[11px] text-slate-400 block">Turnaround</span>
                <span className="text-xl font-black text-cyan-400">{service.deliveryTime}</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800">
                <span className="text-[11px] text-slate-400 block">Revisions</span>
                <span className="text-xl font-black text-emerald-400">Unlimited</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => onOpenOrderWizard(service.slug)}
                className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 text-white font-bold text-sm shadow-xl shadow-purple-950/60 flex items-center justify-center space-x-2 transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                <span>Order This Service</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => onNavigate('portfolio')}
                className="w-full sm:w-auto px-6 py-4 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 text-sm font-semibold transition-colors text-center"
              >
                View Sample Work
              </button>
            </div>

            {/* Trust Points */}
            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 pt-2 border-t border-slate-800/80">
              <span className="flex items-center space-x-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>100% Marketplace Compliant</span>
              </span>
              <span className="flex items-center space-x-1.5">
                <Clock className="w-4 h-4 text-cyan-400" />
                <span>Express 12-Hour Rush Available</span>
              </span>
              <span className="flex items-center space-x-1.5">
                <Zap className="w-4 h-4 text-amber-400" />
                <span>Handcrafted Photoshop Pen Tool</span>
              </span>
            </div>
          </div>

          {/* Right Column: Interactive Before/After Showcase */}
          <div className="lg:col-span-6">
            <div className="relative p-2 rounded-3xl bg-slate-900/80 border border-purple-500/20 shadow-2xl">
              <div className="p-3 text-xs font-bold text-purple-300 flex items-center justify-between">
                <span>Interactive Photoshop Transformation</span>
                <span className="text-[10px] text-slate-400">Drag center bar</span>
              </div>
              <BeforeAfterSlider
                beforeImage={beforeImg}
                afterImage={afterImg}
                beforeLabel="Raw Camera Capture"
                afterLabel="Gurucraftpro Master Edit"
                aspectRatio="aspect-[4/3]"
              />
            </div>
          </div>

        </div>
      </section>

      {/* Deliverables & What's Included */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-t border-slate-900">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          <div className="lg:col-span-7 space-y-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">
                Service Scope
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold font-heading text-white mt-1">
                What's Included in This Package
              </h2>
              <p className="text-sm text-slate-400 mt-2">
                Every image undergoes a stringent 3-point Photoshop retouching pipeline and QA inspection before delivery.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {service.features.map((feature, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-start space-x-3"
                >
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <span className="text-xs font-medium text-slate-200 leading-relaxed">
                    {feature}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Technical Specifications Card */}
          <div className="lg:col-span-5 p-6 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-5">
            <h3 className="text-base font-bold font-heading text-white flex items-center space-x-2">
              <FileCheck className="w-5 h-5 text-purple-400" />
              <span>Technical Export Specifications</span>
            </h3>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between py-2 border-b border-slate-800/80">
                <span className="text-slate-400">Supported File Formats:</span>
                <span className="font-semibold text-white">
                  {service.fileFormats.join(', ')}
                </span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-800/80">
                <span className="text-slate-400">Color Profile:</span>
                <span className="font-semibold text-white">sRGB IEC61966-2.1 (Web Calibrated)</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-800/80">
                <span className="text-slate-400">Resolution Range:</span>
                <span className="font-semibold text-white">2000 x 2000 up to 4500 x 4500 px (300 DPI)</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-800/80">
                <span className="text-slate-400">Background Standards:</span>
                <span className="font-semibold text-white">Pure White RGB (255, 255, 255) / PNG Alpha</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-800/80">
                <span className="text-slate-400">Amazon Zoom Compatibility:</span>
                <span className="font-semibold text-emerald-400">100% Certified</span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-purple-950/30 border border-purple-500/20 text-xs text-slate-300">
              <p>
                <strong>Need custom layer naming or SKU mapping?</strong> Our enterprise workflow supports automated file naming matching your ERP or catalog spreadsheet.
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* Supported Marketplace Standards */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 border-t border-slate-900">
        <div className="text-center max-w-2xl mx-auto mb-8">
          <span className="text-xs font-bold uppercase tracking-wider text-purple-400">
            Marketplace Compliance
          </span>
          <h2 className="text-2xl font-bold font-heading text-white mt-1">
            Built for High-Converting Indian & Global Marketplaces
          </h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
          {[
            { name: 'Amazon India', spec: '2000px 1:1 Pure White', color: 'from-amber-500/20' },
            { name: 'Flipkart', spec: 'Strict QC Verified', color: 'from-blue-500/20' },
            { name: 'Myntra', spec: '3:4 Ratio 1080x1440', color: 'from-pink-500/20' },
            { name: 'Meesho', spec: 'High-Contrast Mobile Pop', color: 'from-fuchsia-500/20' },
            { name: 'Shopify / D2C', spec: 'Editorial 3D Shadow', color: 'from-emerald-500/20' },
            { name: 'Nykaa', spec: 'Beauty & Skincare Standard', color: 'from-rose-500/20' },
          ].map((mp) => (
            <div
              key={mp.name}
              className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 text-center space-y-1 hover:border-slate-700 transition-colors"
            >
              <h4 className="text-xs font-bold text-white">{mp.name}</h4>
              <p className="text-[10px] text-slate-400">{mp.spec}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ Accordion */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-t border-slate-900">
        <div className="text-center mb-10">
          <h2 className="text-2xl font-bold font-heading text-white">
            Frequently Asked Questions
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Got questions about this service? Here is what you need to know.
          </p>
        </div>

        <div className="space-y-3">
          {[
            {
              q: 'What if my images fail Amazon or Flipkart QC?',
              a: 'We offer an unconditional 100% compliance guarantee. If any image fails marketplace validation, our team corrects it within 4 hours at zero additional cost.',
            },
            {
              q: 'Can I send low-quality mobile phone photos?',
              a: 'Yes! While high-resolution camera photos yield the best results, our retouching team frequently enhances phone photos, removes background clutter, and corrects lighting.',
            },
            {
              q: 'How do you handle revisions?',
              a: 'Every project comes with our interactive Client Review Portal. You can pin notes directly onto the image, request revisions, and our retouchers will polish until you are 100% satisfied.',
            },
            {
              q: 'Do you offer bulk discounts for 100+ images?',
              a: 'Yes, our volume pricing automatically scales down from ₹79 down to ₹39 per image for catalog batches. Contact us for custom enterprise catalog mapping.',
            },
          ].map((item, idx) => (
            <div
              key={idx}
              className="rounded-2xl bg-slate-900/70 border border-slate-800 overflow-hidden"
            >
              <button
                type="button"
                onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                className="w-full p-4 text-left flex items-center justify-between text-xs font-bold text-white hover:text-purple-300 transition-colors"
              >
                <span>{item.q}</span>
                <span className="text-slate-400 text-base font-normal">
                  {activeFaq === idx ? '−' : '+'}
                </span>
              </button>
              {activeFaq === idx && (
                <div className="px-4 pb-4 text-xs text-slate-300 leading-relaxed border-t border-slate-800/60 pt-3">
                  {item.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Bottom CTA Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-purple-950 via-slate-900 to-indigo-950 border border-purple-500/30 text-center space-y-4 shadow-2xl">
          <h2 className="text-2xl sm:text-3xl font-black font-heading text-white">
            Ready to Boost Your Product Click-Through Rate?
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto leading-relaxed">
            Upload your product images now. Receive agency-grade retouched proofs delivered remotely within {service.deliveryTime}.
          </p>
          <div className="pt-2">
            <button
              type="button"
              onClick={() => onOpenOrderWizard(service.slug)}
              className="px-8 py-4 rounded-2xl bg-white hover:bg-slate-100 text-slate-950 font-black text-sm shadow-xl hover:scale-105 transition-all inline-flex items-center space-x-2"
            >
              <span>Start Project with {service.title}</span>
              <ArrowRight className="w-4 h-4 text-purple-600" />
            </button>
          </div>
        </div>
      </section>

    </div>
  );
};
