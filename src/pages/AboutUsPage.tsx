import React, { useEffect, useState } from 'react';
import { Sparkles, ShieldCheck, Heart, Target, Eye, Users, ArrowRight } from 'lucide-react';
import { SiteSettings } from '../types';
import { DistinctGreySpotlight } from '../components/ui/DistinctGreySpotlight';
import { LuminousTopEdgeFlare } from '../components/ui/LuminousTopEdgeFlare';

interface AboutUsPageProps {
  onNavigate: (page: string) => void;
}

export const AboutUsPage: React.FC<AboutUsPageProps> = ({ onNavigate }) => {
  const [settings, setSettings] = useState<SiteSettings | null>(null);

  useEffect(() => {
    fetch('/api/settings')
      .then(res => res.json())
      .then(setSettings)
      .catch(console.error);
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12 relative text-[#102A36] dark:text-[#F4F8F8] transition-colors duration-300">
      {/* LUMINOUS TOP EDGE LIGHT FLARE (Dual Theme: Silver-Grey in Dark, Cyan-Teal in Light) */}
      <LuminousTopEdgeFlare />

      {/* DISTINCT OVERHEAD SPOTLIGHT */}
      <DistinctGreySpotlight intensity="normal" />
      
      {/* Header */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-[#DDF3F4]/50 dark:bg-[#182429] border border-[#DCE7E7] dark:border-[#2A3C40] text-[#087581] dark:text-[#25B4BD] text-xs font-bold uppercase tracking-wider shadow-xs">
          <Sparkles className="w-4 h-4 text-[#0799A6] dark:text-[#25B4BD]" />
          <span>About GurucraftPro</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#102A36] dark:text-[#F4F8F8]">
          Creative Designs &amp; Digital Services Tailored For Every Need
        </h1>
        <p className="text-base text-[#52636A] dark:text-[#B7C6C8] leading-relaxed">
          {settings?.aboutText || 'GurucraftPro is a premier creative agency and digital platform led by Annu Dhaneja based in Rohini, Delhi.'}
        </p>
      </div>

      {/* Leadership Spotlight: Annu Dhaneja */}
      <div className="p-8 md:p-12 rounded-3xl bg-[#FFFFFF] dark:bg-[#182429] border border-[#DCE7E7] dark:border-[#2A3C40] grid grid-cols-1 md:grid-cols-3 gap-8 items-center shadow-md">
        <div className="md:col-span-1 text-center md:text-left space-y-3">
          <div className="w-28 h-28 mx-auto md:mx-0 rounded-full bg-[#F8FAFA] dark:bg-[#111A1E] p-1 border-2 border-[#0799A6]/50 dark:border-[#25B4BD]/50 shadow-md overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=80"
              alt="Annu Dhaneja - Founder & Creative Director"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover rounded-full"
            />
          </div>
          <div>
            <h3 className="text-2xl font-black text-[#102A36] dark:text-[#F4F8F8]">{settings?.contactName || 'Annu Dhaneja'}</h3>
            <p className="text-xs text-[#0799A6] dark:text-[#25B4BD] font-bold uppercase tracking-widest">Founder &amp; Creative Director</p>
            <p className="text-xs text-[#52636A] dark:text-[#B7C6C8] mt-1">Rohini, Delhi, India</p>
          </div>
        </div>

        <div className="md:col-span-2 space-y-4 text-xs md:text-sm text-[#52636A] dark:text-[#B7C6C8] leading-relaxed">
          <p>
            "At GurucraftPro, we believe great design is not just visual aesthetic — it is the heartbeat of digital commerce, brand positioning, and daily lifestyle confidence."
          </p>
          <p>
            From high-converting Amazon &amp; Flipkart e-commerce photo editing to sacred spiritual Guruji artwork, custom apparel graphics, and 7-day capsule wardrobe styling, every deliverable reflects attention to detail and creative excellence.
          </p>
        </div>
      </div>

      {/* Mission & Vision */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="p-8 rounded-3xl bg-[#FFFFFF] dark:bg-[#182429] border border-[#DCE7E7] dark:border-[#2A3C40] space-y-3 shadow-xs">
          <div className="p-3 bg-[#F8FAFA] dark:bg-[#111A1E] text-[#0799A6] dark:text-[#25B4BD] border border-[#DCE7E7] dark:border-[#2A3C40] rounded-xl w-fit">
            <Target className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-[#102A36] dark:text-[#F4F8F8]">Our Mission</h3>
          <p className="text-xs text-[#52636A] dark:text-[#B7C6C8] leading-relaxed">
            {settings?.missionText || 'To provide world-class visual design, seamless digital product experiences, and intelligent lifestyle solutions.'}
          </p>
        </div>

        <div className="p-8 rounded-3xl bg-[#FFFFFF] dark:bg-[#182429] border border-[#DCE7E7] dark:border-[#2A3C40] space-y-3 shadow-xs">
          <div className="p-3 bg-[#F8FAFA] dark:bg-[#111A1E] text-[#0799A6] dark:text-[#25B4BD] border border-[#DCE7E7] dark:border-[#2A3C40] rounded-xl w-fit">
            <Eye className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-[#102A36] dark:text-[#F4F8F8]">Our Vision</h3>
          <p className="text-xs text-[#52636A] dark:text-[#B7C6C8] leading-relaxed">
            {settings?.visionText || 'To become the leading digital creative studio empowering businesses, online merchants, and individuals.'}
          </p>
        </div>
      </div>

      {/* CTA */}
      <div className="text-center pt-4">
        <button
          onClick={() => onNavigate('contact')}
          className="px-8 py-3.5 rounded-full btn-primary-cta font-bold text-sm shadow-md transition-all inline-flex items-center space-x-2 active:scale-95"
        >
          <span>Get In Touch With Annu Dhaneja</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

    </div>
  );
};
