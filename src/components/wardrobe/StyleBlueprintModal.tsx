import React, { useRef } from 'react';
import {
  X,
  Printer,
  Download,
  Share2,
  Sparkles,
  CheckCircle2,
  Calendar,
  CloudSun,
  FileText,
} from 'lucide-react';
import { DayOutfitPlan, WardrobeClothingItem, QuickStyleProfile } from '../../types';

interface StyleBlueprintModalProps {
  isOpen: boolean;
  onClose: () => void;
  plan: DayOutfitPlan[];
  wardrobe: WardrobeClothingItem[];
  profile: QuickStyleProfile;
}

export const StyleBlueprintModal: React.FC<StyleBlueprintModalProps> = ({
  isOpen,
  onClose,
  plan,
  wardrobe,
  profile,
}) => {
  const printContainerRef = useRef<HTMLDivElement>(null);

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadTxt = () => {
    let content = `7-DAY PERSONAL STYLE BLUEPRINT\n`;
    content += `AI Consultation & Wardrobe Report\n`;
    content += `Styled by Annu Dhaneja • GurucraftPro Smart Wardrobe\n`;
    content += `Client Profile: ${profile.lifestyle} | ${profile.preferredStyle} | ${profile.weatherPreference} Weather\n`;
    content += `Total Wardrobe Pieces Utilized: ${wardrobe.length}\n\n`;
    content += `STYLIST CONSULTATION NOTES:\n`;
    content += `Focusing on sharp ${profile.preferredStyle || 'smart-casual'} layering with high contrast tones. Maximizing utility from ${wardrobe.length} core wardrobe pieces.\n\n`;
    content += `====================================================\n`;

    (plan || []).forEach((day, idx) => {
      content += `Day ${idx + 1} — ${day?.theme || day?.occasion || 'Daily Look'} (${day?.weather || '22°C • Sunny'})\n`;
      content += `Items: ${(day?.items || []).map((i) => `${i?.name || 'Item'} (${i?.color || 'Neutral'})`).join(' + ')}\n`;
      content += `Styling Notes: ${day?.stylingTips || ''}\n\n`;
    });

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Personal_Style_Blueprint_7Days_${Date.now()}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-fadeIn overflow-y-auto print:p-0 print:bg-white print:static">
      {/* Modal Card */}
      <div
        className="w-full max-w-4xl max-h-[92vh] bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden text-slate-100 print:max-h-none print:border-none print:shadow-none print:w-full print:bg-slate-950"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Control Bar (Hidden when printing) */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-slate-900/90 print:hidden">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">7-Day Personal Style Blueprint</h3>
              <p className="text-xs text-slate-400">Printable AI Consultation & Lookbook Report</p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handlePrint}
              className="px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center space-x-1.5 shadow-sm transition-all"
              title="Print or Save as PDF"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save PDF</span>
            </button>

            <button
              onClick={handleDownloadTxt}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
              title="Download text summary"
            >
              <Download className="w-4 h-4" />
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* PDF / Printable Container Content */}
        <div className="overflow-y-auto p-4 sm:p-6 print:p-0 print:overflow-visible">
          <div
            ref={printContainerRef}
            className="pdf-container p-6 sm:p-8 bg-slate-950 text-white max-w-4xl mx-auto rounded-xl border border-slate-800 shadow-xl print:border-none print:shadow-none print:p-4"
          >
            {/* Header Section */}
            <div className="flex justify-between items-center border-b border-slate-800 pb-6 mb-6">
              <div>
                <h1 className="text-2xl font-bold text-amber-400">7-Day Personal Style Blueprint</h1>
                <p className="text-sm text-slate-400">AI Consultation & Wardrobe Report</p>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Curated for {profile.lifestyle} • Style: {profile.preferredStyle} • {wardrobe.length} Wardrobe Items
                </p>
              </div>
              <div className="text-right">
                <span className="bg-amber-400/10 text-amber-400 px-3 py-1 rounded-full text-xs font-semibold border border-amber-400/20">
                  Custom Report
                </span>
                <p className="text-[10px] text-slate-500 mt-1">Annu Dhaneja Studio</p>
              </div>
            </div>

            {/* Styling Consultation Summary */}
            <div className="bg-slate-900 p-4 rounded-lg border border-slate-800 mb-6">
              <h2 className="text-lg font-semibold mb-2 text-white flex items-center space-x-1.5">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>Stylist Consultation Notes</span>
              </h2>
              <p className="text-sm text-slate-300 leading-relaxed">
                Focusing on sharp {profile.preferredStyle || 'smart-casual'} layering with high contrast tones. Maximizing utility from {wardrobe.length || 12} core wardrobe pieces with zero impulse shopping required.
              </p>
            </div>

            {/* 7 Day Lookbook Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {(plan || []).map((day, idx) => {
                const dayItems = day?.items || [];
                const topItem = dayItems.find((i) =>
                  i?.category && ['Shirt', 'T-Shirt', 'Top', 'Kurta', 'Jacket'].includes(i.category)
                ) || dayItems[0];

                const bottomItem = dayItems.find((i) =>
                  i?.category && ['Jeans', 'Trousers', 'Shorts', 'Skirt'].includes(i.category)
                ) || dayItems[1] || dayItems[0];

                const otherItems = dayItems.filter(
                  (i) => i && i.id !== topItem?.id && i.id !== bottomItem?.id
                );

                return (
                  <div key={day?.id || idx} className="border border-slate-800 rounded-lg p-4 bg-slate-900 flex flex-col justify-between space-y-3">
                    <div>
                      <div className="flex justify-between items-center mb-3">
                        <span className="font-bold text-amber-400 text-sm">
                          Day {idx + 1} — {day?.dayName || `Day ${idx + 1}`} • {day?.theme || day?.occasion || 'Daily Look'}
                        </span>
                        <span className="text-xs text-slate-400 flex items-center space-x-1">
                          <CloudSun className="w-3.5 h-3.5 text-amber-400/80" />
                          <span>{day?.weather || '22°C • Sunny'}</span>
                        </span>
                      </div>

                      {/* Outfit Images */}
                      <div className="flex gap-2 mb-3">
                        {topItem && (
                          <div className="w-1/2 relative group">
                            <img
                              src={topItem.imageUrl}
                              alt={topItem.name}
                              className="w-full h-32 object-cover rounded-md bg-slate-950 border border-slate-800"
                              referrerPolicy="no-referrer"
                            />
                            <span className="absolute bottom-1 left-1 bg-slate-950/80 text-white text-[9px] px-1.5 py-0.5 rounded font-medium truncate max-w-[90%]">
                              {topItem.name}
                            </span>
                          </div>
                        )}
                        {bottomItem && (
                          <div className="w-1/2 relative group">
                            <img
                              src={bottomItem.imageUrl}
                              alt={bottomItem.name}
                              className="w-full h-32 object-cover rounded-md bg-slate-950 border border-slate-800"
                              referrerPolicy="no-referrer"
                            />
                            <span className="absolute bottom-1 left-1 bg-slate-950/80 text-white text-[9px] px-1.5 py-0.5 rounded font-medium truncate max-w-[90%]">
                              {bottomItem.name}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Additional Accessories / Footwear tag if present */}
                      {otherItems.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-2">
                          {otherItems.map((item, oIdx) => (
                            <span
                              key={oIdx}
                              className="text-[10px] px-2 py-0.5 rounded bg-slate-950 text-slate-300 border border-slate-800"
                            >
                              + {item.name} ({item.category})
                            </span>
                          ))}
                        </div>
                      )}

                      <p className="text-xs text-slate-300 leading-relaxed">
                        {day.stylingTips || `${topItem?.name || 'Top'} paired with ${bottomItem?.name || 'Bottom'} for effortless daily balance.`}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-500">
                      <span>Occasion: {day.occasion}</span>
                      <span className="text-amber-400/80 font-medium">Capsule Rotation #{idx + 1}</span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Footer */}
            <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-500">
              <span>GurucraftPro AI Smart Wardrobe Engine</span>
              <span>Annu Dhaneja Creative Studio • Rohini, Delhi</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
