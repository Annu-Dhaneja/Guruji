import React, { useState, useRef, MouseEvent, TouchEvent } from 'react';
import { SlidersHorizontal } from 'lucide-react';

interface BeforeAfterSliderProps {
  beforeImage: string;
  afterImage: string;
  beforeLabel?: string;
  afterLabel?: string;
  title?: string;
  description?: string;
}

export const BeforeAfterSlider: React.FC<BeforeAfterSliderProps> = ({
  beforeImage,
  afterImage,
  beforeLabel = 'Original / Before',
  afterLabel = 'VantageEcom Edited',
  title,
  description,
}) => {
  const [sliderPosition, setSliderPosition] = useState<number>(50);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMove = (clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    let percentage = (x / rect.width) * 100;
    if (percentage < 0) percentage = 0;
    if (percentage > 100) percentage = 100;
    setSliderPosition(percentage);
  };

  const handleMouseDown = (e: MouseEvent) => {
    setIsDragging(true);
    handleMove(e.clientX);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging) return;
    handleMove(e.clientX);
  };

  const handleTouchStart = (e: TouchEvent) => {
    setIsDragging(true);
    if (e.touches[0]) handleMove(e.touches[0].clientX);
  };

  const handleTouchMove = (e: TouchEvent) => {
    if (!isDragging) return;
    if (e.touches[0]) handleMove(e.touches[0].clientX);
  };

  return (
    <div className="space-y-3">
      {(title || description) && (
        <div className="mb-2">
          {title && <h4 className="text-base font-bold text-white">{title}</h4>}
          {description && <p className="text-xs text-slate-400">{description}</p>}
        </div>
      )}

      <div
        ref={containerRef}
        className="relative w-full aspect-[4/3] sm:aspect-[16/10] rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 select-none cursor-ew-resize group shadow-xl"
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onMouseMove={handleMouseMove}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleMouseUp}
        onTouchMove={handleTouchMove}
      >
        {/* AFTER IMAGE (FULL UNDERNEATH) */}
        <img
          src={afterImage}
          alt={afterLabel}
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute top-4 right-4 z-10 px-3 py-1 rounded-full bg-teal-500/90 text-slate-950 text-[11px] font-black uppercase tracking-wider backdrop-blur-md shadow-md">
          {afterLabel}
        </div>

        {/* BEFORE IMAGE (CLIPPED TOP LAYER) */}
        <div
          className="absolute inset-0 overflow-hidden"
          style={{ width: `${sliderPosition}%` }}
        >
          <img
            src={beforeImage}
            alt={beforeLabel}
            className="absolute inset-0 w-full h-full object-cover max-w-none"
            style={{ width: containerRef.current ? `${containerRef.current.offsetWidth}px` : '100%' }}
          />
          <div className="absolute top-4 left-4 z-10 px-3 py-1 rounded-full bg-slate-900/90 text-slate-300 border border-slate-700 text-[11px] font-bold uppercase tracking-wider backdrop-blur-md shadow-md">
            {beforeLabel}
          </div>
        </div>

        {/* SLIDER HANDLE LINE */}
        <div
          className="absolute top-0 bottom-0 z-20 w-1 bg-gradient-to-b from-teal-400 via-white to-purple-500 shadow-[0_0_12px_rgba(20,184,166,0.8)]"
          style={{ left: `calc(${sliderPosition}% - 2px)` }}
        >
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-slate-900 border-2 border-teal-400 flex items-center justify-center text-teal-400 shadow-xl group-hover:scale-110 transition-transform">
            <SlidersHorizontal className="w-4 h-4" />
          </div>
        </div>

        {/* DRAG INSTRUCTION */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-10 px-3 py-1 rounded-full bg-slate-950/80 border border-slate-800 text-[10px] text-slate-400 backdrop-blur-sm pointer-events-none">
          Drag handle left/right to compare
        </div>
      </div>
    </div>
  );
};
