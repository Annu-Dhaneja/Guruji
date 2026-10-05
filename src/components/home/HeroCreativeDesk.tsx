import React, { useState, useRef, useEffect } from 'react';
import { Layers, Eye, Heart, Sparkles, Check, Bookmark } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import creativeDeskReal from '../../assets/images/creative_desk_real_1790758056086.jpg';

interface HeroCreativeDeskProps {
  onNavigate: (page: string) => void;
  imageSrc?: string;
}

export const HeroCreativeDesk: React.FC<HeroCreativeDeskProps> = ({ onNavigate, imageSrc }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const containerRef = useRef<HTMLDivElement>(null);
  const [rotate, setRotate] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  // Dynamic Image Source: prioritized from prop -> localStorage admin override -> real asset
  const [activeImage, setActiveImage] = useState<string>(() => {
    return imageSrc || localStorage.getItem('gurucraft_hero_image') || creativeDeskReal || '/images/creative_desk_real.jpg';
  });

  useEffect(() => {
    if (imageSrc) {
      setActiveImage(imageSrc);
    }
  }, [imageSrc]);

  // Listen to Admin Dashboard real-time image updates
  useEffect(() => {
    const handleStorageUpdate = () => {
      const stored = localStorage.getItem('gurucraft_hero_image');
      if (stored) {
        setActiveImage(stored);
      }
    };
    window.addEventListener('gurucraft_image_updated', handleStorageUpdate);
    return () => window.removeEventListener('gurucraft_image_updated', handleStorageUpdate);
  }, []);

  // Subtle 3D perspective mouse movement (5-10px maximum as requested)
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const normalizedX = (x / rect.width) - 0.5;
    const normalizedY = (y / rect.height) - 0.5;

    // Subtly tilt within 4 to 6 degrees max
    setRotate({
      x: -normalizedY * 6,
      y: normalizedX * 8,
    });
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setRotate({ x: 0, y: 0 });
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      className="relative w-full max-w-[620px] mx-auto py-2 select-none perspective-1000"
      style={{ perspective: '1200px' }}
    >
      {/* Soft Ambient Grey Light Effect Glow */}
      <div className="absolute inset-0 -top-6 -bottom-6 bg-gradient-to-tr from-slate-400/25 via-slate-300/15 to-slate-500/20 rounded-3xl blur-3xl pointer-events-none" />

      {/* 3D Main Transform Stage */}
      <div
        className="relative transition-transform duration-300 ease-out preserve-3d"
        style={{
          transform: `rotateX(${rotate.x}deg) rotateY(${rotate.y}deg)`,
          transformStyle: 'preserve-3d',
        }}
      >
        {/* BASE WORKSPACE DESK IMAGE CARD (Zero outer outline, high realism) */}
        <div className="relative rounded-3xl bg-transparent border-0 outline-none ring-0 p-2 sm:p-3 shadow-2xl transition-all duration-300 overflow-hidden">
          
          <div className="relative rounded-2xl overflow-hidden aspect-[16/10] bg-[#111A1E] border-0 outline-none ring-0 group">
            <img
              src={activeImage}
              alt="GurucraftPro Creative Design Studio & Workspace"
              className="w-full h-full object-cover border-0 outline-none ring-0 group-hover:scale-102 transition-transform duration-700"
              referrerPolicy="no-referrer"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                if (!target.src.includes('creative_desk_real.jpg')) {
                  target.src = '/images/creative_desk_real.jpg';
                }
              }}
            />

            {/* Subtle Gradient Overlay for Realistic Integration */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#102A36]/60 dark:from-[#0B1114]/80 via-transparent to-transparent opacity-70 pointer-events-none" />

            {/* Integrated Featured Offering Card (Border-free clean glass) */}
            <div className="absolute bottom-3 left-3 right-3 p-3 rounded-xl bg-[#0E1518]/90 backdrop-blur-md border-0 outline-none ring-0 text-white shadow-lg flex items-center justify-between gap-3">
              <div>
                <span className="text-[9px] font-bold text-[#25B4BD] uppercase tracking-wider block">
                  Creative Production Studio
                </span>
                <h3 className="text-xs sm:text-sm font-bold text-white line-clamp-1">
                  Good Design Builds Better Brands
                </h3>
              </div>
              <button
                onClick={() => onNavigate('graphic-design')}
                className="shrink-0 px-3 py-1.5 rounded-lg bg-[#0799A6] hover:bg-[#087581] text-white text-xs font-bold transition-all shadow-xs active:scale-95 border-0 outline-none"
              >
                Explore Studio
              </button>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* REFINED CLEAN STUDIO BADGES & CONTROLS (Tidy & Elegant Layout)           */}
        {/* ========================================================================= */}

        {/* 1. Floating Photoshop 'Ps' App Badge (Top Left Corner of Desk) */}
        <div
          className="absolute -top-3 left-4 p-2 px-3 rounded-xl bg-[#FFFFFF] dark:bg-[#182429] border border-[#DCE7E7] dark:border-[#2A3C40] shadow-md flex items-center gap-2 hidden sm:flex transition-transform duration-300"
          style={{
            transform: `translateZ(30px) translateY(${isHovered ? '-3px' : '0px'})`,
          }}
          title="Adobe Photoshop Studio Workflows"
        >
          <div className="w-6 h-6 rounded-md bg-[#001E36] border border-[#0094FF]/40 flex items-center justify-center">
            <span className="text-xs font-black text-[#31A8FF] font-sans">Ps</span>
          </div>
          <span className="text-[11px] font-extrabold text-[#102A36] dark:text-[#F4F8F8]">AI Studio</span>
        </div>

        {/* 2. Color Swatches Strip (Top Right Corner of Desk) */}
        <div
          className="absolute -top-3 right-4 p-2 rounded-xl bg-[#FFFFFF] dark:bg-[#182429] border border-[#DCE7E7] dark:border-[#2A3C40] shadow-md flex items-center space-x-1.5 hidden sm:flex transition-transform duration-300"
          style={{
            transform: `translateZ(30px) translateY(${isHovered ? '-3px' : '0px'})`,
          }}
          title="Brand Color System"
        >
          <div className="w-4 h-5 rounded-xs bg-[#F5A39A] shadow-xs" title="Peach (#F5A39A)" />
          <div className="w-4 h-5 rounded-xs bg-[#FDE2DE] shadow-xs" title="Soft Peach (#FDE2DE)" />
          <div className="w-4 h-5 rounded-xs bg-[#DDF3F4] shadow-xs" title="Soft Teal (#DDF3F4)" />
          <div className="w-4 h-5 rounded-xs bg-[#0799A6] shadow-xs" title="Accent Teal (#0799A6)" />
          <div className="w-4 h-5 rounded-xs bg-[#087581] shadow-xs" title="Teal Dark (#087581)" />
        </div>

        {/* 3. Floating Layers Mini-Tag (Neatly Pinned to Top Center) */}
        <div
          className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1.5 rounded-full bg-[#FFFFFF] dark:bg-[#182429] border border-[#DCE7E7] dark:border-[#2A3C40] shadow-md hidden md:flex items-center space-x-2 text-[10px] font-bold text-[#102A36] dark:text-[#F4F8F8]"
          style={{
            transform: `translateZ(25px)`,
          }}
        >
          <Layers className="w-3 h-3 text-[#0799A6] dark:text-[#25B4BD]" />
          <span>Non-Destructive Layers</span>
          <span className="w-1.5 h-1.5 rounded-full bg-[#0799A6] dark:bg-[#25B4BD]" />
        </div>

      </div>
    </div>
  );
};
