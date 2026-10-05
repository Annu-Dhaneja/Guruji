import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Eye, MoveHorizontal, Sparkles, Image as ImageIcon } from 'lucide-react';

interface BeforeAfterSliderProps {
  beforeImage: string;
  afterImage: string;
  beforeLabel?: string;
  afterLabel?: string;
  aspectRatio?: string;
  className?: string;
  defaultPosition?: number;
}

export const BeforeAfterSlider: React.FC<BeforeAfterSliderProps> = ({
  beforeImage,
  afterImage,
  beforeLabel = 'Original RAW Photo',
  afterLabel = 'Gurucraftpro Edited',
  aspectRatio = 'aspect-[4/3] md:aspect-[16/10]',
  className = '',
  defaultPosition = 50,
}) => {
  const [sliderPosition, setSliderPosition] = useState<number>(defaultPosition);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<'slider' | 'side-by-side'>('slider');
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMove = useCallback(
    (clientX: number) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const x = clientX - rect.left;
      const position = Math.max(0, Math.min(100, (x / rect.width) * 100));
      setSliderPosition(position);
    },
    []
  );

  const handleTouchMove = useCallback(
    (e: TouchEvent) => {
      if (!isDragging) return;
      handleMove(e.touches[0].clientX);
    },
    [isDragging, handleMove]
  );

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDragging) return;
      handleMove(e.clientX);
    },
    [isDragging, handleMove]
  );

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      window.addEventListener('touchmove', handleTouchMove);
      window.addEventListener('touchend', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleMouseUp);
    };
  }, [isDragging, handleMouseMove, handleMouseUp, handleTouchMove]);

  return (
    <div className={`space-y-3 ${className}`}>
      {/* View Mode Switcher */}
      <div className="flex items-center justify-between px-1 text-xs">
        <div className="flex items-center space-x-2 text-slate-400">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span className="font-semibold text-slate-300">Interactive Photoshop Comparison</span>
        </div>
        <div className="flex items-center bg-slate-900/90 border border-slate-800 rounded-lg p-0.5">
          <button
            type="button"
            onClick={() => setViewMode('slider')}
            className={`px-2.5 py-1 rounded text-[11px] font-medium transition-all ${
              viewMode === 'slider'
                ? 'bg-purple-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Split Slider
          </button>
          <button
            type="button"
            onClick={() => setViewMode('side-by-side')}
            className={`px-2.5 py-1 rounded text-[11px] font-medium transition-all ${
              viewMode === 'side-by-side'
                ? 'bg-purple-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Side by Side
          </button>
        </div>
      </div>

      {viewMode === 'side-by-side' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 shadow-xl group">
            <div className="absolute top-3 left-3 z-10 px-2.5 py-1 rounded-full bg-slate-950/80 backdrop-blur-md text-[11px] font-bold text-slate-300 border border-slate-700/60">
              {beforeLabel}
            </div>
            <img
              src={beforeImage}
              alt="Before"
              className="w-full h-72 md:h-96 object-contain bg-slate-900/50 p-2"
              loading="lazy"
            />
          </div>
          <div className="relative rounded-2xl overflow-hidden border border-purple-500/30 bg-slate-950 shadow-xl group">
            <div className="absolute top-3 right-3 z-10 px-2.5 py-1 rounded-full bg-purple-600/90 backdrop-blur-md text-[11px] font-bold text-white border border-purple-400/50 flex items-center space-x-1">
              <Sparkles className="w-3 h-3 text-amber-300" />
              <span>{afterLabel}</span>
            </div>
            <img
              src={afterImage}
              alt="After"
              className="w-full h-72 md:h-96 object-contain bg-white p-2"
              loading="lazy"
            />
          </div>
        </div>
      ) : (
        <div
          ref={containerRef}
          className={`relative select-none overflow-hidden rounded-2xl md:rounded-3xl border border-purple-500/20 bg-slate-950 shadow-2xl ${aspectRatio} cursor-ew-resize group`}
          onMouseDown={(e) => {
            setIsDragging(true);
            handleMove(e.clientX);
          }}
          onTouchStart={(e) => {
            setIsDragging(true);
            handleMove(e.touches[0].clientX);
          }}
        >
          {/* After Image (Background layer - clean edited image) */}
          <img
            src={afterImage}
            alt="After - Gurucraftpro Edited"
            className="absolute inset-0 w-full h-full object-contain bg-white select-none pointer-events-none p-3"
            draggable={false}
          />

          {/* After Tag */}
          <div className="absolute top-4 right-4 z-20 pointer-events-none px-3 py-1.5 rounded-full bg-purple-600/90 backdrop-blur-md text-[11px] font-bold text-white border border-purple-400/50 shadow-lg flex items-center space-x-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
            <span>{afterLabel}</span>
          </div>

          {/* Before Image (Clipped layer - raw photo) */}
          <div
            className="absolute inset-0 overflow-hidden select-none pointer-events-none"
            style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
          >
            <img
              src={beforeImage}
              alt="Before - Original RAW"
              className="absolute inset-0 w-full h-full object-contain bg-slate-900 select-none pointer-events-none p-3"
              draggable={false}
            />

            {/* Before Tag */}
            <div className="absolute top-4 left-4 z-20 pointer-events-none px-3 py-1.5 rounded-full bg-slate-950/85 backdrop-blur-md text-[11px] font-bold text-slate-300 border border-slate-700/60 shadow-lg">
              {beforeLabel}
            </div>
          </div>

          {/* Vertical Divider Line */}
          <div
            className="absolute top-0 bottom-0 z-30 pointer-events-none"
            style={{ left: `${sliderPosition}%` }}
          >
            <div className="absolute inset-y-0 -left-[1px] w-[2px] bg-gradient-to-b from-purple-400 via-white to-cyan-400 shadow-[0_0_15px_rgba(255,255,255,0.7)]" />

            {/* Handle Thumb */}
            <div className="absolute top-1/2 -left-4 -translate-y-1/2 w-8 h-8 rounded-full bg-slate-950 border-2 border-white shadow-2xl flex items-center justify-center pointer-events-auto cursor-grab active:cursor-grabbing hover:scale-110 transition-transform">
              <MoveHorizontal className="w-4 h-4 text-purple-400" />
            </div>
          </div>

          {/* Bottom Hint */}
          <div className="absolute bottom-3 inset-x-0 flex justify-center pointer-events-none z-20">
            <span className="px-3 py-1 rounded-full bg-slate-950/70 backdrop-blur-md text-[10px] text-slate-300 border border-slate-800">
              Drag slider left or right to compare
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
