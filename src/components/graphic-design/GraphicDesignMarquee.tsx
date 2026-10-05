import React from 'react';
import { Sparkles, Zap, ShieldCheck, Clock, Award, Star, CheckCircle, Flame, Layers } from 'lucide-react';

export const GraphicDesignMarquee: React.FC = () => {
  const tickerItems = [
    { text: 'Affordable Design. Fast Delivery. Professional Quality.', icon: Sparkles, highlight: true },
    { text: '⚡ 10-Minute & 1-Hour Ultra-Fast Delivery Available', icon: Zap, highlight: false },
    { text: '🎨 100% Vector AI, EPS, Layered PSD & 4K PNG Source Files', icon: Layers, highlight: false },
    { text: '⭐ 4.9/5 Rating from 2,400+ Creators & Businesses', icon: Star, highlight: true },
    { text: '🔄 Unlimited Revisions & 100% Satisfaction Guarantee', icon: ShieldCheck, highlight: false },
    { text: '🚀 High-Converting Amazon & Instagram Creatives', icon: Flame, highlight: true },
    { text: '💼 5,000+ Completed Projects by Annu Dhaneja & Team', icon: Award, highlight: false },
    { text: '💬 Instant WhatsApp & Live Project Inquiry Support', icon: CheckCircle, highlight: true },
  ];

  return (
    <div className="w-full overflow-hidden bg-[#F8FAFA] dark:bg-[#111A1E] border-y border-[#DCE7E7] dark:border-[#2A3C40] py-3 relative select-none">
      {/* Background glow lines */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#DDF3F4]/30 via-transparent to-[#FDE2DE]/30 pointer-events-none" />
      
      {/* CSS infinite marquee container */}
      <div className="flex w-max animate-marquee space-x-8 items-center">
        {/* Render twice for seamless infinite loop */}
        {[...tickerItems, ...tickerItems, ...tickerItems].map((item, idx) => {
          const Icon = item.icon;
          return (
            <div
              key={idx}
              className={`flex items-center space-x-2.5 px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide whitespace-nowrap transition-colors shadow-2xs ${
                item.highlight
                  ? 'bg-[#DDF3F4] dark:bg-[#173D40] border border-[#0799A6]/30 text-[#087581] dark:text-[#25B4BD]'
                  : 'bg-[#FFFFFF] dark:bg-[#182429] border border-[#DCE7E7] dark:border-[#2A3C40] text-[#102A36] dark:text-[#F4F8F8]'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${item.highlight ? 'text-[#0799A6] dark:text-[#25B4BD]' : 'text-[#F5A39A] dark:text-[#F2A39A]'}`} />
              <span>{item.text}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
