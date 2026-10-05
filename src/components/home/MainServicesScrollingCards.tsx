import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  Sparkles,
  Zap,
  ArrowRight,
  MessageCircle,
  Check,
  RotateCw,
  Eye,
  ChevronLeft,
  ChevronRight,
  MoveHorizontal,
} from 'lucide-react';
import { GraphicDesignCategory } from '../../types';
import { GRAPHIC_DESIGN_MAIN_CATEGORIES } from '../../data/graphicDesignData';
import { useTheme } from '../../context/ThemeContext';

interface MainServicesScrollingCardsProps {
  onNavigate?: (page: string, slug?: string) => void;
  onOpenInquiry?: (categoryOrServiceTitle: string) => void;
}

export const MainServicesScrollingCards: React.FC<MainServicesScrollingCardsProps> = ({
  onNavigate,
  onOpenInquiry,
}) => {
  const [categories, setCategories] = useState<GraphicDesignCategory[]>(GRAPHIC_DESIGN_MAIN_CATEGORIES);
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  // Carousel physics & animation states
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollPos, setScrollPos] = useState<number>(0);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [activeFlippedCardId, setActiveFlippedCardId] = useState<string | null>(null);
  const [scrollDirection, setScrollDirection] = useState<'ltr' | 'rtl'>('ltr');

  // Drag physics tracking refs
  const dragStartRef = useRef<{ x: number; scroll: number; time: number }>({ x: 0, scroll: 0, time: 0 });
  const velocityRef = useRef<number>(0);
  const targetScrollRef = useRef<number>(0);
  const currentScrollRef = useRef<number>(0);
  const animFrameIdRef = useRef<number | null>(null);

  // Card dimensions
  const cardWidth = 290;
  const cardGap = 32;
  const totalItemWidth = cardWidth + cardGap;

  // Fetch dynamic categories from server
  useEffect(() => {
    fetch('/api/graphic-design/categories')
      .then((res) => {
        if (res.ok) return res.json();
        throw new Error('Failed to fetch categories');
      })
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          const enabledOnly = data.filter((c) => c.enabled !== false);
          if (enabledOnly.length > 0) {
            setCategories(enabledOnly);
          }
        }
      })
      .catch((err) => {
        console.warn('Using default graphic design categories:', err);
      });
  }, []);

  const totalCards = categories.length;
  // Multiplied array for seamless circular looping (5 repeats for seamless infinite scrolling)
  const repeatedCards = useMemo(() => {
    return [...categories, ...categories, ...categories, ...categories, ...categories];
  }, [categories]);

  const loopLength = totalCards * totalItemWidth;

  // Center initial scroll offset in the middle iteration
  useEffect(() => {
    if (totalCards > 0) {
      const initial = totalCards * 2 * totalItemWidth;
      currentScrollRef.current = initial;
      targetScrollRef.current = initial;
      setScrollPos(initial);
    }
  }, [totalCards, totalItemWidth]);

  // NON-PASSIVE MOUSE-WHEEL LISTENER: Enables horizontal trackpad/mouse-wheel scrolling without vertical page jump
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleWheel = (e: WheelEvent) => {
      // Determine if horizontal or vertical wheel
      const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
      if (Math.abs(delta) > 1) {
        // Prevent default browser vertical scroll to eliminate jumping
        e.preventDefault();
        // Smoothly add to target offset
        targetScrollRef.current += delta * 1.15;
      }
    };

    container.addEventListener('wheel', handleWheel, { passive: false });
    return () => {
      container.removeEventListener('wheel', handleWheel);
    };
  }, []);

  // Main 60 FPS physics & auto-scroll animation loop
  useEffect(() => {
    let lastTimestamp = performance.now();

    const loop = (now: number) => {
      const dt = Math.min((now - lastTimestamp) / 1000, 0.1);
      lastTimestamp = now;

      if (!isDragging) {
        // Continuous auto-scroll when idle (slow, elegant 30px/sec glide)
        if (!isHovered) {
          const dirMultiplier = scrollDirection === 'ltr' ? 1 : -1;
          targetScrollRef.current += 30 * dirMultiplier * dt;
        }

        // Apply friction inertia when released with velocity
        if (Math.abs(velocityRef.current) > 0.5) {
          targetScrollRef.current += velocityRef.current * dt;
          velocityRef.current *= Math.pow(0.92, dt * 60); // friction damping
        } else {
          velocityRef.current = 0;
        }

        // Smooth spring interpolation toward target
        currentScrollRef.current += (targetScrollRef.current - currentScrollRef.current) * 0.14;
      }

      // Infinite seamless looping wrapping
      if (currentScrollRef.current < totalItemWidth * totalCards) {
        currentScrollRef.current += loopLength;
        targetScrollRef.current += loopLength;
      } else if (currentScrollRef.current > loopLength * 3) {
        currentScrollRef.current -= loopLength;
        targetScrollRef.current -= loopLength;
      }

      setScrollPos(currentScrollRef.current);
      animFrameIdRef.current = requestAnimationFrame(loop);
    };

    animFrameIdRef.current = requestAnimationFrame(loop);
    return () => {
      if (animFrameIdRef.current) cancelAnimationFrame(animFrameIdRef.current);
    };
  }, [isDragging, isHovered, loopLength, scrollDirection, totalCards, totalItemWidth]);

  // MOUSE & TOUCH DRAGGING HANDLERS
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
    velocityRef.current = Math.max(-1400, Math.min(1400, velocityRef.current));
  };

  // Click Navigation
  const handleCardClick = (category: GraphicDesignCategory) => {
    if (Math.abs(velocityRef.current) > 50) return; // avoid click on fast flick
    if (onNavigate) {
      onNavigate('graphic-design', category.slug);
    } else {
      window.location.hash = `/services/${category.slug}`;
    }
  };

  const handleInquiryClick = (e: React.MouseEvent, category: GraphicDesignCategory) => {
    e.stopPropagation();
    if (onOpenInquiry) {
      onOpenInquiry(category.name);
    } else if (onNavigate) {
      onNavigate('graphic-design', `inquiry-${category.slug}`);
    } else {
      window.location.hash = `/inquiry?service=${category.slug}`;
    }
  };

  const handleNext = () => {
    targetScrollRef.current += totalItemWidth;
  };

  const handlePrev = () => {
    targetScrollRef.current -= totalItemWidth;
  };

  const toggleDirection = () => {
    setScrollDirection((prev) => (prev === 'ltr' ? 'rtl' : 'ltr'));
  };

  // Viewport center reference for 3D perspective calculation
  const containerWidth = containerRef.current?.clientWidth || 1200;
  const viewportCenter = containerWidth / 2;

  return (
    <section
      id="main-services-marquee"
      className="relative py-16 sm:py-24 overflow-hidden select-none transition-colors duration-500 bg-[#F8FAFB] dark:bg-[#0A0F12] border-y border-[#E2E8F0] dark:border-[#1E2B30]"
      aria-label="Main Graphic Design Services - 3D Swipe Carousel with Mirror Reflection"
    >
      {/* SECTION HEADER */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4 relative z-20 mb-8 sm:mb-12">
        {/* Luminous Royal Deck Badge */}
        <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full border border-[#DCE7E7] dark:border-[#22353E] bg-[#FFFFFF] dark:bg-[#121B20] text-[#087581] dark:text-[#25B4BD] text-xs font-bold uppercase tracking-widest shadow-xs">
          <Sparkles className="w-3.5 h-3.5 text-[#087581] dark:text-[#25B4BD]" />
          <span>3D PRODUCT SHOWCASE • HORIZONTAL INFINITE CAROUSEL</span>
        </div>

        {/* Heading */}
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight text-[#102A36] dark:text-[#FFFFFF]">
          Design Services,{' '}
          <span className="text-[#0799A6] dark:text-[#25B4BD]">
            Delivered Fast
          </span>
        </h2>

        {/* Subheading */}
        <p className="text-sm sm:text-base lg:text-lg max-w-2xl mx-auto font-normal leading-relaxed text-[#52636A] dark:text-[#94A3B8]">
          Smooth 3D parallax scroll with realistic mirror reflections. Drag, swipe, or use your mouse-wheel to explore all specialized creative disciplines.
        </p>
      </div>

      {/* 3D CAROUSEL CONTAINER (Target Element for CSS Selector 1) */}
      <div
        ref={containerRef}
        className="relative w-full h-[620px] sm:h-[660px] overflow-hidden cursor-grab active:cursor-grabbing perspective-container"
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
        {/* Left & Right Smooth Edge Fade Vignettes */}
        <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-16 sm:w-44 z-30 bg-gradient-to-r from-[#F8FAFB] dark:from-[#0A0F12] via-[#F8FAFB]/80 dark:via-[#0A0F12]/85 to-transparent" />
        <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-16 sm:w-44 z-30 bg-gradient-to-l from-[#F8FAFB] dark:from-[#0A0F12] via-[#F8FAFB]/80 dark:via-[#0A0F12]/85 to-transparent" />

        {/* Ambient Floor Reflector Plane (Creates the glossy floor surface look) */}
        <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-48 z-10 bg-gradient-to-t from-[#E2E8F0]/40 dark:from-[#0799A6]/10 via-[#F8FAFB]/30 dark:via-[#0A0F12]/40 to-transparent" />
        <div className="pointer-events-none absolute bottom-[180px] left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#CBD5E1]/40 dark:via-[#25B4BD]/20 to-transparent z-15" />

        {/* Floating Arrow Controls (Next / Prev) */}
        <button
          type="button"
          onClick={handlePrev}
          aria-label="Previous service card"
          className="absolute left-4 sm:left-10 top-[200px] z-40 p-3 rounded-full bg-[#FFFFFF]/90 dark:bg-[#142127]/90 text-[#102A36] dark:text-[#FFFFFF] border border-[#DCE7E7] dark:border-[#2A3C40] shadow-xl hover:scale-110 active:scale-95 transition-all backdrop-blur-md hidden sm:flex items-center justify-center cursor-pointer"
        >
          <ChevronLeft className="w-5 h-5 text-[#0799A6] dark:text-[#25B4BD]" />
        </button>

        <button
          type="button"
          onClick={handleNext}
          aria-label="Next service card"
          className="absolute right-4 sm:right-10 top-[200px] z-40 p-3 rounded-full bg-[#FFFFFF]/90 dark:bg-[#142127]/90 text-[#102A36] dark:text-[#FFFFFF] border border-[#DCE7E7] dark:border-[#2A3C40] shadow-xl hover:scale-110 active:scale-95 transition-all backdrop-blur-md hidden sm:flex items-center justify-center cursor-pointer"
        >
          <ChevronRight className="w-5 h-5 text-[#0799A6] dark:text-[#25B4BD]" />
        </button>

        {/* 3D CARDS TRACK */}
        <div className="absolute top-8 left-0 w-full h-full flex items-start pointer-events-none">
          {repeatedCards.map((category, index) => {
            // Absolute X position of this card relative to scroll
            const cardX = index * totalItemWidth - scrollPos + viewportCenter - cardWidth / 2;

            // Distance from viewport center (normalized in card units)
            const distFromCenterPx = cardX + cardWidth / 2 - viewportCenter;
            const distNormalized = distFromCenterPx / totalItemWidth;
            const absDist = Math.abs(distNormalized);

            // Culling optimization: don't render cards that are far off screen
            if (cardX < -cardWidth * 1.5 || cardX > containerWidth + cardWidth * 1.5) {
              return null;
            }

            // 3D Transform calculations:
            // Center card scales to 1.08 and comes forward in Z-space (+80px)
            // Side cards smoothly scale down, move backward, and rotate inward
            const scale = Math.max(0.76, 1.08 - absDist * 0.14);
            const translateZ = Math.max(-50, 80 - absDist * 70);
            const rotateY = Math.max(-30, Math.min(30, -distNormalized * 18));
            const opacity = Math.max(0.5, 1 - absDist * 0.22);
            const zIndex = Math.round(50 - absDist * 5);

            // Card Rank in traditional deck sequence (A, K, Q, J, 10...)
            const ranks = ['A', 'K', 'Q', 'J', '10', 'A', 'K', 'Q'];
            const cardRank = ranks[index % ranks.length];

            const isFlipped = activeFlippedCardId === `${category.id}-${index}`;

            return (
              <div
                key={`3d-card-${category.id}-${index}`}
                className="absolute top-0 will-change-transform pointer-events-auto"
                style={{
                  width: `${cardWidth}px`,
                  left: `${cardX}px`,
                  transform: `translate3d(0, 0, ${translateZ}px) rotateY(${rotateY}deg) scale(${scale})`,
                  transformOrigin: 'center bottom',
                  transformStyle: 'preserve-3d',
                  zIndex,
                  opacity,
                  transition: isDragging ? 'none' : 'transform 0.1s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.1s ease',
                }}
              >
                {/* PHYSICAL CARD CONTAINER */}
                <div className="relative group/card select-none">
                  {/* MAIN CARD (Front & Back 3D Flipped with Parallax Artwork) */}
                  <CardRenderItem
                    category={category}
                    cardRank={cardRank}
                    isDarkTheme={isDark}
                    isFlipped={isFlipped}
                    distNormalized={distNormalized}
                    onToggleFlip={() => {
                      setActiveFlippedCardId(isFlipped ? null : `${category.id}-${index}`);
                    }}
                    onCardClick={() => handleCardClick(category)}
                    onInquiryClick={(e) => handleInquiryClick(e, category)}
                  />

                  {/* REALISTIC MIRROR REFLECTION UNDERNEATH (Key Visual Feature) */}
                  <div
                    className="mirror-reflection-container pointer-events-none select-none"
                    style={{
                      position: 'absolute',
                      top: '100%',
                      left: 0,
                      width: '100%',
                      height: '240px',
                      marginTop: '8px',
                      overflow: 'hidden',
                      transform: 'scaleY(-1)',
                      transformOrigin: 'top center',
                      opacity: isDark ? 0.44 : 0.28,
                      filter: isDark ? 'blur(1.6px) brightness(0.68) contrast(1.05)' : 'blur(1.6px) brightness(0.95)',
                      maskImage: 'linear-gradient(to bottom, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.3) 35%, transparent 70%)',
                      WebkitMaskImage: 'linear-gradient(to bottom, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.3) 35%, transparent 70%)',
                    }}
                  >
                    {/* Synchronized Twin Card Content for Flawless Mirror Effect */}
                    <CardRenderItem
                      category={category}
                      cardRank={cardRank}
                      isDarkTheme={isDark}
                      isFlipped={isFlipped}
                      distNormalized={distNormalized}
                      isMirrorMode
                    />

                    {/* Dark/Light Color Tint Overlay for Mirror Reflection */}
                    <div
                      className={`absolute inset-0 pointer-events-none ${
                        isDark
                          ? 'bg-gradient-to-t from-transparent via-[#0799A6]/20 to-[#0A0F12]/60'
                          : 'bg-gradient-to-t from-transparent via-[#087581]/15 to-[#F8FAFB]/50'
                      }`}
                    />
                  </div>

                  {/* Subtle Base Contact Shadow between card and floor */}
                  <div
                    className="absolute -bottom-2 left-4 right-4 h-4 rounded-full pointer-events-none"
                    style={{
                      background: isDark
                        ? 'radial-gradient(ellipse at center, rgba(0,0,0,0.85) 0%, rgba(7,153,166,0.2) 40%, transparent 75%)'
                        : 'radial-gradient(ellipse at center, rgba(16,42,54,0.4) 0%, rgba(7,153,166,0.1) 40%, transparent 75%)',
                      filter: 'blur(3px)',
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* BOTTOM CONTROLS & CTA BAR */}
      <div className="mt-8 text-center relative z-20 px-4 space-y-4">
        {/* Interaction hints and direction control */}
        <div className="flex flex-wrap items-center justify-center gap-3 text-xs font-semibold text-[#52636A] dark:text-[#819396]">
          <span className="flex items-center gap-1.5">
            <RotateCw className="w-3.5 h-3.5 text-[#0799A6] dark:text-[#25B4BD] animate-spin-slow" />
            <span>Mouse-wheel or drag to scroll smoothly</span>
          </span>
          <span className="hidden sm:inline">•</span>
          <button
            type="button"
            onClick={toggleDirection}
            className="inline-flex items-center gap-1 px-3 py-1 rounded-full border border-[#DCE7E7] dark:border-[#22353E] bg-[#FFFFFF] dark:bg-[#142127] text-[#0799A6] dark:text-[#25B4BD] hover:opacity-80 transition cursor-pointer"
          >
            <MoveHorizontal className="w-3 h-3" />
            <span>Reverse Direction ({scrollDirection.toUpperCase()})</span>
          </button>
        </div>

        <div>
          <button
            onClick={() => (onNavigate ? onNavigate('graphic-design') : (window.location.hash = '/graphic-design'))}
            className="inline-flex items-center space-x-3 px-8 py-3.5 rounded-full border border-[#DCE7E7] dark:border-[#22353E] bg-[#FFFFFF] dark:bg-[#142127] hover:bg-[#F8FAFA] dark:hover:bg-[#1A2B33] font-bold text-sm text-[#102A36] dark:text-[#FFFFFF] hover:text-[#0799A6] dark:hover:text-[#25B4BD] transition-all shadow-md group active:scale-95 cursor-pointer"
            id="btn-view-all-services-marquee"
          >
            <Sparkles className="w-4 h-4 text-[#0799A6] dark:text-[#25B4BD] group-hover:rotate-12 transition-transform" />
            <span>Explore All Graphic Design Categories</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform text-[#0799A6] dark:text-[#25B4BD]" />
          </button>
        </div>
      </div>

      {/* EMBEDDED CSS FOR 3D PERSPECTIVE */}
      <style>{`
        .perspective-container {
          perspective: 1200px;
          perspective-origin: 50% 45%;
        }

        .transform-style-3d {
          transform-style: preserve-3d;
        }

        .backface-hidden {
          backface-visibility: hidden;
          -webkit-backface-visibility: hidden;
        }

        .rotate-y-180 {
          transform: rotateY(180deg);
        }

        @keyframes spin-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        .animate-spin-slow {
          animation: spin-slow 8s linear infinite;
        }
      `}</style>
    </section>
  );
};

// =========================================================================
// REFINED PHYSICAL 3D CARD ITEM (Front + Flipped Back Face)
// =========================================================================
interface CardRenderItemProps {
  category: GraphicDesignCategory;
  cardRank: string;
  isDarkTheme: boolean;
  isFlipped?: boolean;
  isMirrorMode?: boolean;
  distNormalized?: number;
  onToggleFlip?: () => void;
  onCardClick?: () => void;
  onInquiryClick?: (e: React.MouseEvent) => void;
}

const CardRenderItem: React.FC<CardRenderItemProps> = ({
  category,
  cardRank,
  isDarkTheme,
  isFlipped = false,
  isMirrorMode = false,
  distNormalized = 0,
  onToggleFlip,
  onCardClick,
  onInquiryClick,
}) => {
  // Suit selection: ♠ Spades, ♥ Hearts, ♦ Diamonds, ♣ Clubs
  const suit = category.suit || '♠';
  const isRedSuit = suit === '♥' || suit === '♦';

  // THEME COLOR PALETTES (As explicitly specified in prompt)
  // Dark Theme: Deep graphite / navy surface, teal/cyan/violet accents, white text
  // Light Theme: Clean white surface, teal/royal-blue/muted coral accents, dark charcoal text
  const cardSurfaceClass = isDarkTheme
    ? 'bg-[#121B20] text-[#FFFFFF] border-[#203038] shadow-[0_20px_50px_rgba(0,0,0,0.55)]'
    : 'bg-[#FFFFFF] text-[#102A36] border-[#E2E8F0] shadow-[0_15px_35px_rgba(16,42,54,0.08)]';

  const innerBorderClass = isDarkTheme ? 'border-[#263C46]/80' : 'border-[#F1F5F9]';
  const suitColor = isRedSuit
    ? isDarkTheme ? 'text-[#F87171]' : 'text-[#E11D48]'
    : isDarkTheme ? 'text-[#25B4BD]' : 'text-[#087581]';

  const features = category.features && category.features.length > 0
    ? category.features
    : [
        '300 DPI Print-Ready Formats',
        'Source Files Included (PSD/AI)',
        'Fast Turnaround Guaranteed',
        'Commercial Use Rights',
      ];

  // Subtle interior image parallax shift based on position
  const parallaxX = distNormalized * -10;

  return (
    <div
      className={`w-[290px] h-[410px] relative rounded-[26px] transform-style-3d transition-transform duration-700 ease-in-out ${
        isFlipped ? 'rotate-y-180' : ''
      }`}
    >
      {/* ========================================================================= */}
      {/* 1. FRONT FACE OF THE CARD                                                 */}
      {/* ========================================================================= */}
      <div
        className={`absolute inset-0 w-full h-full rounded-[26px] p-3.5 border ${cardSurfaceClass} flex flex-col justify-between overflow-hidden backface-hidden ${
          !isMirrorMode ? 'hover:border-[#0799A6]/60 dark:hover:border-[#25B4BD]/60' : ''
        }`}
      >
        {/* Subtle Top Rim Highlight for physical floating realism */}
        <div
          className={`absolute top-0 left-6 right-6 h-[1.5px] rounded-full pointer-events-none ${
            isDarkTheme ? 'bg-gradient-to-r from-transparent via-white/25 to-transparent' : 'bg-gradient-to-r from-transparent via-white/80 to-transparent'
          }`}
        />

        {/* Inner Card Border Framing */}
        <div className={`absolute inset-2 rounded-[20px] border ${innerBorderClass} pointer-events-none`} />

        {/* Top-Left Corner Index: Rank + Suit */}
        <div className="flex items-center justify-between relative z-10 px-1 pt-1">
          <div className="flex flex-col items-center leading-none select-none">
            <span className={`text-xl font-black tracking-tight ${suitColor}`}>
              {cardRank}
            </span>
            <span className={`text-lg font-black ${suitColor} -mt-0.5`}>
              {suit}
            </span>
          </div>

          {/* Top Right Pro Badge */}
          <div
            className={`flex items-center gap-1 px-2.5 py-0.5 rounded-full border text-[10px] font-bold uppercase tracking-wider ${
              isDarkTheme
                ? 'bg-[#18262E] border-[#2A3F4A] text-[#25B4BD]'
                : 'bg-[#F8FAFA] border-[#E2E8F0] text-[#087581]'
            }`}
          >
            <span className={`text-xs ${suitColor}`}>{suit}</span>
            <span>{category.badge || 'PRO'}</span>
          </div>
        </div>

        {/* Realistic Showcase Artwork Photo Box with 3D Parallax */}
        <div className="relative flex-1 my-2 rounded-[16px] overflow-hidden bg-slate-900 border border-slate-700/50 group/photo">
          <div
            className="w-full h-full will-change-transform"
            style={{
              transform: `translateX(${parallaxX}px) scale(1.08)`,
              transition: 'transform 0.1s ease-out',
            }}
          >
            <img
              src={category.imageUrl}
              alt={category.name}
              loading="lazy"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover group-hover/photo:scale-105 transition-transform duration-500"
            />
          </div>

          {/* Subtle Contrast Gradient on Photo */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent pointer-events-none" />

          {/* Center Suit Watermark */}
          <div
            className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-7xl font-black opacity-10 pointer-events-none ${suitColor}`}
          >
            {suit}
          </div>

          {/* Delivery Speed Badge */}
          <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded-md bg-black/80 backdrop-blur-xs border border-white/10 text-white text-[10px] font-bold flex items-center gap-1 shadow-xs">
            <Zap className="w-2.5 h-2.5 fill-current text-cyan-400" />
            <span>{category.fastestDelivery}</span>
          </div>

          {/* Price Badge */}
          <div className="absolute bottom-2 right-2 px-2.5 py-0.5 rounded-md bg-[#0799A6] text-white text-[11px] font-extrabold shadow-md">
            ₹{category.startingPrice}
          </div>
        </div>

        {/* Card Bottom: Service Name + Flip Indicator */}
        <div className="relative z-10 px-1 pb-1 flex items-end justify-between">
          <div className="pr-2 min-w-0 flex-1">
            <h3
              className={`text-sm sm:text-[15px] font-extrabold tracking-tight leading-snug line-clamp-1 ${
                isDarkTheme ? 'text-[#FFFFFF]' : 'text-[#102A36]'
              }`}
            >
              {category.name}
            </h3>

            {!isMirrorMode && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleFlip?.();
                }}
                className={`text-[10px] font-bold flex items-center gap-1 mt-0.5 hover:underline cursor-pointer ${
                  isDarkTheme ? 'text-[#819396] hover:text-[#25B4BD]' : 'text-[#52636A] hover:text-[#087581]'
                }`}
              >
                <RotateCw className="w-2.5 h-2.5 text-[#0799A6] dark:text-[#25B4BD]" />
                <span>Tap to Flip Inclusions</span>
              </button>
            )}
          </div>

          {/* Inverted Corner Suit Index */}
          <div className="flex flex-col items-center leading-none select-none rotate-180 shrink-0">
            <span className={`text-xl font-black tracking-tight ${suitColor}`}>
              {cardRank}
            </span>
            <span className={`text-lg font-black ${suitColor} -mt-0.5`}>
              {suit}
            </span>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. BACK FACE OF THE CARD (Flipped State)                                  */}
      {/* ========================================================================= */}
      <div
        className={`absolute inset-0 w-full h-full rounded-[26px] p-4 border ${cardSurfaceClass} flex flex-col justify-between overflow-hidden rotate-y-180 backface-hidden`}
      >
        <div className={`absolute inset-2 rounded-[20px] border ${innerBorderClass} pointer-events-none`} />

        {/* Back Header */}
        <div className="flex items-center justify-between relative z-10">
          <div className="flex items-center space-x-1.5">
            <span className={`text-2xl font-black leading-none ${suitColor}`}>
              {suit}
            </span>
            <span
              className={`text-xs font-bold tracking-wider line-clamp-1 ${
                isDarkTheme ? 'text-[#FFFFFF]' : 'text-[#102A36]'
              }`}
            >
              {category.name}
            </span>
          </div>
          <span
            className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
              isDarkTheme
                ? 'bg-[#18262E] border-[#2A3F4A] text-[#25B4BD]'
                : 'bg-[#F8FAFA] border-[#E2E8F0] text-[#087581]'
            }`}
          >
            {category.fastestDelivery}
          </span>
        </div>

        {/* Inclusions & Features Box */}
        <div
          className={`relative z-10 my-2 rounded-xl p-3 border space-y-2 ${
            isDarkTheme
              ? 'bg-[#18262E]/70 border-[#263C46]'
              : 'bg-[#F8FAFC] border-[#E2E8F0]'
          }`}
        >
          <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider pb-1 border-b border-inherit text-[#0799A6] dark:text-[#25B4BD]">
            <span>Package Inclusions:</span>
            <span className={`font-bold ${isDarkTheme ? 'text-white' : 'text-[#102A36]'}`}>
              ₹{category.startingPrice}
            </span>
          </div>

          <ul className="space-y-1.5">
            {features.slice(0, 4).map((feat, fIdx) => (
              <li
                key={fIdx}
                className={`flex items-start space-x-2 text-[11px] leading-tight font-medium ${
                  isDarkTheme ? 'text-[#B7C6C8]' : 'text-[#52636A]'
                }`}
              >
                <Check className={`w-3.5 h-3.5 flex-shrink-0 mt-0.5 stroke-[3] ${suitColor}`} />
                <span className="line-clamp-1">{feat}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Interactive Action Buttons */}
        {!isMirrorMode ? (
          <div className="space-y-2 relative z-10">
            <button
              type="button"
              onClick={onCardClick}
              className={`w-full py-2.5 px-3 rounded-xl border text-xs font-bold transition-all flex items-center justify-center space-x-1.5 shadow-xs cursor-pointer ${
                isDarkTheme
                  ? 'border-[#263C46] bg-[#18262E] hover:bg-[#20323C] text-white hover:text-cyan-400'
                  : 'border-[#E2E8F0] bg-white hover:bg-slate-50 text-[#102A36] hover:text-[#0799A6]'
              }`}
            >
              <Eye className="w-3.5 h-3.5 text-[#0799A6] dark:text-[#25B4BD]" />
              <span>Explore Category</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#0799A6] dark:text-[#25B4BD]" />
            </button>

            <button
              type="button"
              onClick={onInquiryClick}
              className="w-full py-2.5 px-3 rounded-xl bg-[#0799A6] hover:bg-[#087581] text-white text-xs font-bold transition-all flex items-center justify-center space-x-1.5 shadow-md active:scale-95 cursor-pointer"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>Inquiry Now (Instant)</span>
            </button>

            <div className="text-center pt-1">
              <button
                type="button"
                onClick={onToggleFlip}
                className="text-[10px] font-bold text-slate-400 hover:text-cyan-400 cursor-pointer"
              >
                ← Back to Card Face
              </button>
            </div>
          </div>
        ) : (
          <div className="h-14" />
        )}
      </div>
    </div>
  );
};
