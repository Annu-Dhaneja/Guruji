import React, { useState } from 'react';
import {
  Search,
  Sparkles,
  HelpCircle,
  ShieldCheck,
  Clock,
  RotateCcw,
  FileCheck,
  CreditCard,
  ArrowRight
} from 'lucide-react';
import { FAQ_ITEMS } from '../data/studioServicesData';

interface StudioFAQPageProps {
  onNavigate: (route: string) => void;
  onOpenOrderWizard: () => void;
}

export const StudioFAQPage: React.FC<StudioFAQPageProps> = ({
  onNavigate,
  onOpenOrderWizard,
}) => {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [expandedIndex, setExpandedIndex] = useState<number | null>(0);

  const categories = [
    { id: 'all', label: 'All Questions' },
    { id: 'compliance', label: 'Marketplace Compliance' },
    { id: 'turnaround', label: 'Turnaround & Rush SLAs' },
    { id: 'quality', label: 'File Formats & Resolution' },
    { id: 'revisions', label: 'Revisions & Satisfaction' },
    { id: 'pricing', label: 'Payments & Invoicing' },
  ];

  const filteredFaqs = FAQ_ITEMS.filter((item) => {
    const matchesCat = activeCategory === 'all' || item.category === activeCategory;
    const matchesSearch =
      item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pt-20 pb-24">
      {/* Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center space-y-4">
        <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300 text-xs font-bold">
          <HelpCircle className="w-3.5 h-3.5 text-amber-300" />
          <span>Seller Knowledge Base & Answers</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-black font-heading text-white tracking-tight">
          Frequently Asked Questions
        </h1>

        <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
          Everything you need to know about our Photoshop editing process, turnarounds, marketplace compliance, and payment security.
        </p>

        {/* Search */}
        <div className="max-w-xl mx-auto pt-4">
          <div className="relative">
            <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search questions (e.g. Amazon QC, turnaround, PSD layers, GST invoice...)"
              className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-slate-900 border border-slate-800 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 shadow-xl"
            />
          </div>
        </div>
      </div>

      {/* Category Pills */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        <div className="flex items-center justify-center space-x-2 overflow-x-auto text-xs pb-2">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-4 py-2.5 rounded-2xl font-bold transition-all whitespace-nowrap ${
                activeCategory === cat.id
                  ? 'bg-purple-600 text-white shadow-lg shadow-purple-900/40 ring-1 ring-purple-400'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* FAQ Accordion List */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
        {filteredFaqs.length === 0 ? (
          <div className="p-12 text-center rounded-3xl bg-slate-900/40 border border-slate-800 text-slate-400 text-xs">
            No questions matched your search query. Try another term.
          </div>
        ) : (
          filteredFaqs.map((faq, idx) => {
            const isExpanded = expandedIndex === idx;
            return (
              <div
                key={faq.id}
                className="rounded-3xl bg-slate-900/70 border border-slate-800 overflow-hidden transition-all"
              >
                <button
                  type="button"
                  onClick={() => setExpandedIndex(isExpanded ? null : idx)}
                  className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4"
                >
                  <span className="text-sm sm:text-base font-bold text-white hover:text-purple-300 transition-colors">
                    {faq.question}
                  </span>
                  <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-slate-300 shrink-0 font-mono text-sm">
                    {isExpanded ? '−' : '+'}
                  </div>
                </button>

                {isExpanded && (
                  <div className="px-5 sm:px-6 pb-6 pt-2 border-t border-slate-800/80 text-xs sm:text-sm text-slate-300 leading-relaxed space-y-2">
                    <p>{faq.answer}</p>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Help Banner */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 text-center">
        <div className="p-8 rounded-3xl bg-slate-900 border border-purple-500/30 space-y-3">
          <h3 className="text-lg font-bold text-white">Still have a specific catalog question?</h3>
          <p className="text-xs text-slate-400">
            Our creative directors in Rohini, Delhi NCR are ready to help via WhatsApp or phone.
          </p>
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => onNavigate('contact')}
              className="px-6 py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs transition-colors"
            >
              Contact Support
            </button>
            <button
              type="button"
              onClick={onOpenOrderWizard}
              className="px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs transition-colors"
            >
              Start New Project
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
