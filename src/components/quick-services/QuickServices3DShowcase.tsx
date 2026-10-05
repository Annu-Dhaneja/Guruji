import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  Sparkles,
  Zap,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Star,
  Clock,
  RotateCcw,
  Compass,
} from 'lucide-react';
import { QuickDigitalService } from '../../types';
import { useTheme } from '../../context/ThemeContext';

interface QuickServices3DShowcaseProps {
  services: QuickDigitalService[];
  onOpenOrder: (service: QuickDigitalService) => void;
  onOpenDiagnostic?: () => void;
  onNavigate?: (page: string, slug?: string) => void;
}

export const getProductSlugForService = (service: QuickDigitalService): string => {
  const name = (service.name || '').toLowerCase();
  const cat = (service.category || '').toLowerCase();
  if (name.includes('perfume') || name.includes('scent')) return 'perfume';
  if (name.includes('shoe') || name.includes('sneaker') || name.includes('footwear')) return 'shoes';
  if (name.includes('watch') || name.includes('clock') || name.includes('timepiece')) return 'watch';
  if (name.includes('bag') || name.includes('tote') || name.includes('leather')) return 'bags';
  if (name.includes('cosmetic') || name.includes('skin') || name.includes('serum') || cat.includes('cosmetic')) return 'cosmetics';
  if (name.includes('headphone') || name.includes('audio') || name.includes('electronic') || name.includes('gadget')) return 'electronics';
  if (name.includes('ring') || name.includes('accessory') || name.includes('sunglass')) return 'accessories';
  
  // Rotating showcase products mapping for variety
  const showcaseSlugs = ['perfume', 'shoes', 'watch', 'bags', 'cosmetics', 'electronics', 'accessories'];
  const hash = service.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return showcaseSlugs[hash % showcaseSlugs.length];
};

export const QuickServices3DShowcase: React.FC<QuickServices3DShowcaseProps> = ({
  services,
  onOpenOrder,
  onOpenDiagnostic,
  onNavigate,
}) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollPos, setScrollPos] = useState<number>(0);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [isHovered, setIsHovered] = useState<boolean>(false);

  // Physics refs
  const dragStartRef = useRef<{ x: number; scroll: number; time: number }>({ x: 0, scroll: 0, time: 0 });
  const velocityRef = useRef<number>(0);
  const targetScrollRef = useRef<number>(0);
  const currentScrollRef = useRef<number>(0);
  const animFrameIdRef = useRef<number | null>(null);

  // Card geometry: Clean, stable, flat cards
  const cardWidth = 310;
  const cardGap = 32;
  const totalItemWidth = cardWidth + cardGap;

  const displayServices = useMemo(() => {
    if (!services || services.length === 0) return [];
    const sorted = [...services].sort((a, b) => (b.popular ? 1 : 0) - (a.popular ? 1 : 0));
    return sorted.slice(0, 14);
  }, [services]);

  const totalCount = displayServices.length;

  const repeatedServices = useMemo(() => {
    if (totalCount === 0) return [];
    return [
      ...displayServices,
      ...displayServices,
      ...displayServices,
      ...displayServices,
      ...displayServices,
    ];
  }, [displayServices, totalCount]);

  const loopLength = totalCount * totalItemWidth;

  useEffect(() => {
    if (totalCount > 0) {
      const initial = totalCount * 2 * totalItemWidth;
      currentScrollRef.current = initial;
      targetScrollRef.current = initial;
      setScrollPos(initial);
    }
  }, [totalCount, totalItemWidth]);

  // Non-passive mouse-wheel listener for horizontal carousel without vertical jumping
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleWheel = (e: WheelEvent) => {
      const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
      if (Math.abs(delta) > 1) {
        e.preventDefault();
        targetScrollRef.current += delta * 1.15;
      }
    };

    container.addEventListener('wheel', handleWheel, { passive: false });
    return () => {
      container.removeEventListener('wheel', handleWheel);
    };
  }, []);

  // 60 FPS Physics, inertia & auto-glide loop
  useEffect(() => {
    let lastTime = performance.now();

    const loop = (now: number) => {
      const dt = Math.min((now - lastTime) / 1000, 0.1);
      lastTime = now;

      if (!isDragging) {
        if (!isHovered) {
          targetScrollRef.current += 26 * dt; // 26px per second
        }

        if (Math.abs(velocityRef.current) > 0.5) {
          targetScrollRef.current += velocityRef.current * dt;
          velocityRef.current *= Math.pow(0.92, dt * 60);
        } else {
          velocityRef.current = 0;
        }

        currentScrollRef.current += (targetScrollRef.current - currentScrollRef.current) * 0.14;
      }

      if (totalCount > 0) {
        if (currentScrollRef.current < totalItemWidth * totalCount) {
          currentScrollRef.current += loopLength;
          targetScrollRef.current += loopLength;
        } else if (currentScrollRef.current > loopLength * 3) {
          currentScrollRef.current -= loopLength;
          targetScrollRef.current -= loopLength;
        }
      }

      setScrollPos(currentScrollRef.current);
      animFrameIdRef.current = requestAnimationFrame(loop);
    };

    animFrameIdRef.current = requestAnimationFrame(loop);
    return () => {
      if (animFrameIdRef.current) cancelAnimationFrame(animFrameIdRef.current);
    };
  }, [isDragging, isHovered, loopLength, totalCount, totalItemWidth]);

  const handleDragStart = (clientX: number) => {
    setIsDragging(true);
    dragStartRef.current = {
      x: clientX,
      scroll: currentScrollRef.current,
      time: performance.now(),
    };
    velocityRef.current = 0;
  };

  const handleDragMove = (clientX: number) => {
    if (!isDragging) return;
    const deltaX = clientX - dragStartRef.current.x;
    const now = performance.now();
    const dt = (now - dragStartRef.current.time) / 1000;

    if (dt > 0.005) {
      velocityRef.current = -deltaX / dt * 0.4;
    }

    const nextScroll = dragStartRef.current.scroll - deltaX;
    targetScrollRef.current = nextScroll;
    currentScrollRef.current = nextScroll;
  };

  const handleDragEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);

    // Magnetic snap to the nearest card
    const nearestIndex = Math.round(targetScrollRef.current / totalItemWidth);
    targetScrollRef.current = nearestIndex * totalItemWidth;
    velocityRef.current = 0;
  };

  const handleNext = () => {
    const nextIdx = Math.round(targetScrollRef.current / totalItemWidth) + 1;
    targetScrollRef.current = nextIdx * totalItemWidth;
  };

  const handlePrev = () => {
    const prevIdx = Math.round(targetScrollRef.current / totalItemWidth) - 1;
    targetScrollRef.current = prevIdx * totalItemWidth;
  };

  const handleProductClick = (service: QuickDigitalService) => {
    if (Math.abs(velocityRef.current) > 30) return; // avoid click on fast flick
    const slug = getProductSlugForService(service);
    if (onNavigate) {
      onNavigate('product-detail', slug);
    } else {
      window.location.hash = `/product/${slug}`;
    }
  };

  const containerWidth = containerRef.current?.clientWidth || 1200;
  const viewportCenter = containerWidth / 2;

  if (totalCount === 0) return null;

  return (
    <div className="relative w-full py-6 select-none">
      {/* Showcase Eyebrow & Status */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 px-1">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#0799A6]/10 dark:bg-[#25B4BD]/10 text-[#0799A6] dark:text-[#25B4BD] text-[11px] font-extrabold uppercase tracking-widest border border-[#0799A6]/20 dark:border-[#25B4BD]/20 mb-1">
            <Compass className="w-3.5 h-3.5" />
            <span>3D Product Showcase • Click for 360° View</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-[#102A36] dark:text-white tracking-tight">
            Featured 3D Product Carousel
          </h3>
          <p className="text-xs text-[#52636A] dark:text-[#94A3B8] mt-0.5">
            Cards remain clean &amp; stable • Only the product floats and scales on hover • Click any product to launch 360° rotation
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {onOpenDiagnostic && (
            <button
              onClick={onOpenDiagnostic}
              className="px-3.5 py-2 rounded-xl text-xs font-bold border border-[#DCE7E7] dark:border-[#2A3C40] bg-white dark:bg-[#182429] text-[#102A36] dark:text-white hover:border-[#0799A6] dark:hover:border-[#25B4BD] transition shadow-xs cursor-pointer"
            >
              Smart Fix Assistant
            </button>
          )}

          <div className="flex items-center gap-1.5 ml-2">
            <button
              onClick={handlePrev}
              aria-label="Previous product"
              className="p-2.5 rounded-full border border-[#DCE7E7] dark:border-[#2A3C40] bg-white dark:bg-[#182429] text-[#102A36] dark:text-white hover:text-[#0799A6] dark:hover:text-[#25B4BD] shadow-xs active:scale-95 transition cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={handleNext}
              aria-label="Next product"
              className="p-2.5 rounded-full border border-[#DCE7E7] dark:border-[#2A3C40] bg-white dark:bg-[#182429] text-[#102A36] dark:text-white hover:text-[#0799A6] dark:hover:text-[#25B4BD] shadow-xs active:scale-95 transition cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* HORIZONTAL CAROUSEL STAGE */}
      <div
        ref={containerRef}
        className="relative w-full h-[540px] overflow-hidden cursor-grab active:cursor-grabbing"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => {
          setIsHovered(false);
          handleDragEnd();
        }}
        onMouseDown={(e) => handleDragStart(e.clientX)}
        onMouseMove={(e) => handleDragMove(e.clientX)}
        onMouseUp={handleDragEnd}
        onTouchStart={(e) => handleDragStart(e.touches[0].clientX)}
        onTouchMove={(e) => handleDragMove(e.touches[0].clientX)}
        onTouchEnd={handleDragEnd}
      >
        {/* Left & Right Smooth Vignette Fade */}
        <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-12 sm:w-36 z-30 bg-gradient-to-r from-[#F8FAFB] dark:from-[#0A0F12] via-[#F8FAFB]/80 dark:via-[#0A0F12]/85 to-transparent" />
        <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-12 sm:w-36 z-30 bg-gradient-to-l from-[#F8FAFB] dark:from-[#0A0F12] via-[#F8FAFB]/80 dark:via-[#0A0F12]/85 to-transparent" />

        {/* CARDS TRACK */}
        <div className="absolute top-4 left-0 w-full h-full flex items-start pointer-events-none">
          {repeatedServices.map((service, index) => {
            const cardX = index * totalItemWidth - scrollPos + viewportCenter - cardWidth / 2;
            const distFromCenterPx = cardX + cardWidth / 2 - viewportCenter;
            const distNormalized = distFromCenterPx / totalItemWidth;
            const absDist = Math.abs(distNormalized);

            if (cardX < -cardWidth * 1.5 || cardX > containerWidth + cardWidth * 1.5) {
              return null;
            }

            // Cards remain stable, scale slightly towards center (1.0 vs 0.94), flat horizontal alignment
            const scale = Math.max(0.92, 1.0 - absDist * 0.06);
            const opacity = Math.max(0.65, 1 - absDist * 0.15);
            const zIndex = Math.round(50 - absDist * 5);

            return (
              <div
                key={`stable-prod-${service.id}-${index}`}
                className="absolute top-0 will-change-transform pointer-events-auto"
                style={{
                  width: `${cardWidth}px`,
                  left: `${cardX}px`,
                  transform: `translate3d(0, 0, 0) scale(${scale})`,
                  zIndex,
                  opacity,
                  transition: isDragging ? 'none' : 'transform 0.12s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.12s ease',
                }}
              >
                {/* STABLE, CLEAN, MINIMAL PRODUCT CARD (NO Card Tilt, 3D on Product Only) */}
                <StableProductCardItem
                  service={service}
                  isDarkTheme={isDark}
                  onClick={() => handleProductClick(service)}
                  onOpenOrder={() => onOpenOrder(service)}
                />
              </div>
            );
          })}
        </div>
      </div>

      {/* EMBEDDED CSS FOR FLOATING PRODUCT ONLY (Card UI remains completely stable) */}
      <style>{`
        @keyframes floatProductOnly {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-7px);
          }
        }

        .animate-float-product-subtle {
          animation: floatProductOnly 4.5s ease-in-out infinite;
        }

        @keyframes shadowFloatOnly {
          0%, 100% {
            transform: scale(1);
            opacity: 0.55;
          }
          50% {
            transform: scale(0.88);
            opacity: 0.32;
          }
        }

        .animate-shadow-pulse-subtle {
          animation: shadowFloatOnly 4.5s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

// =========================================================================
// CLEAN, STABLE, MINIMAL PRODUCT CARD (3D Applied ONLY to product object)
// =========================================================================
interface StableProductCardItemProps {
  service: QuickDigitalService;
  isDarkTheme: boolean;
  onClick: () => void;
  onOpenOrder: () => void;
}

const StableProductCardItem: React.FC<StableProductCardItemProps> = ({
  service,
  isDarkTheme,
  onClick,
  onOpenOrder,
}) => {
  const cardSurfaceClass = isDarkTheme
    ? 'bg-[#121B20] text-white border-[#22353E] shadow-lg'
    : 'bg-[#FFFFFF] text-[#102A36] border-[#E2E8F0] shadow-sm';

  const productImage =
    service.imageUrl ||
    service.exampleAfterImage ||
    'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80';

  return (
    <div
      onClick={onClick}
      className={`w-[310px] h-[450px] relative rounded-3xl p-4 border ${cardSurfaceClass} flex flex-col justify-between overflow-hidden cursor-pointer group transition-colors duration-300 hover:border-cyan-500/60`}
    >
      {/* Top Header: Category Tag & Price Badge (STABLE UI) */}
      <div className="relative z-10 flex items-center justify-between px-1">
        <span
          className={`px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider border ${
            isDarkTheme
              ? 'bg-[#18262E] text-[#25B4BD] border-[#2A3F4A]'
              : 'bg-[#F8FAFA] text-[#087581] border-[#E2E8F0]'
          }`}
        >
          {service.category}
        </span>

        <div className="flex items-center space-x-1.5">
          {service.popular && (
            <span className="px-2 py-0.5 rounded-full text-[9px] font-bold uppercase bg-amber-400 text-slate-950 flex items-center gap-1 shadow-xs">
              <Star className="w-2.5 h-2.5 fill-current" />
              <span>Popular</span>
            </span>
          )}
          <span className="px-2.5 py-0.5 rounded-md bg-[#0799A6] text-white text-[11px] font-black shadow-xs">
            ₹{service.price}
          </span>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* PRODUCT STAGE: 3D ANIMATION APPLIED ONLY TO PRODUCT ITSELF                */}
      {/* ========================================================================= */}
      <div className="relative flex-1 my-3 flex flex-col items-center justify-center">
        {/* Soft Radial Contact Shadow directly under product */}
        <div
          className="absolute bottom-2 w-48 h-5 rounded-full pointer-events-none animate-shadow-pulse-subtle"
          style={{
            background: isDarkTheme
              ? 'radial-gradient(ellipse at center, rgba(0,0,0,0.85) 0%, rgba(7,153,166,0.15) 40%, transparent 75%)'
              : 'radial-gradient(ellipse at center, rgba(16,42,54,0.4) 0%, rgba(7,153,166,0.08) 40%, transparent 75%)',
            filter: 'blur(4px)',
          }}
        />

        {/* Floating Product Image (Subtle float & hover scale-up on product ONLY) */}
        <div className="relative w-full h-44 rounded-2xl overflow-hidden flex items-center justify-center">
          <img
            src={productImage}
            alt={service.name}
            loading="lazy"
            referrerPolicy="no-referrer"
            className="w-full h-full object-contain p-2 animate-float-product-subtle transition-transform duration-500 ease-out group-hover:scale-110 group-hover:-translate-y-2 drop-shadow-xl"
            onError={(e) => {
              (e.target as HTMLImageElement).src =
                'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80';
            }}
          />

          {/* 360° Quick Launch Badge */}
          <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded-md bg-black/75 backdrop-blur-xs text-cyan-300 text-[9px] font-black uppercase tracking-wider flex items-center gap-1 border border-white/10 shadow-xs">
            <Compass className="w-2.5 h-2.5 animate-spin-slow" />
            <span>360° VIEW</span>
          </div>

          <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded-md bg-black/75 backdrop-blur-xs text-slate-300 text-[9px] font-semibold flex items-center gap-1 border border-white/10">
            <Clock className="w-2.5 h-2.5 text-cyan-400" />
            <span>{service.deliveryTime}</span>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* CARD BOTTOM: Text, Description & Buttons (STABLE UI)                      */}
      {/* ========================================================================= */}
      <div className="relative z-10 space-y-2.5 px-1 pb-1">
        <div>
          <h4
            className={`text-sm sm:text-[15px] font-black tracking-tight leading-snug line-clamp-1 group-hover:text-cyan-400 transition-colors ${
              isDarkTheme ? 'text-white' : 'text-[#102A36]'
            }`}
          >
            {service.name}
          </h4>
          <p
            className={`text-[11px] line-clamp-1 mt-0.5 ${
              isDarkTheme ? 'text-[#819396]' : 'text-[#52636A]'
            }`}
          >
            {service.description}
          </p>
        </div>

        {/* Action Button: Opens dedicated product page */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onOpenOrder();
            }}
            className="flex-1 py-2 px-3 rounded-xl bg-[#0799A6] hover:bg-[#087581] text-white text-xs font-black transition-all flex items-center justify-center space-x-1.5 shadow-sm active:scale-95 cursor-pointer"
          >
            <Zap className="w-3.5 h-3.5 fill-current" />
            <span>Order (₹{service.price})</span>
          </button>

          <button
            type="button"
            onClick={onClick}
            className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all flex items-center gap-1 ${
              isDarkTheme
                ? 'border-slate-700 bg-slate-800/80 hover:bg-slate-700 text-white'
                : 'border-slate-200 bg-slate-100 hover:bg-slate-200 text-[#102A36]'
            }`}
            title="Open Dedicated 360° Page"
          >
            <span>360°</span>
            <ArrowRight className="w-3 h-3 text-cyan-400" />
          </button>
        </div>
      </div>
    </div>
  );
};
