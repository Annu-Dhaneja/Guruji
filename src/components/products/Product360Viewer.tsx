import React, { useState, useEffect, useRef } from 'react';
import {
  RotateCcw,
  Play,
  Pause,
  Compass,
  Maximize2,
  Minimize2,
  Sparkles,
  Sun,
  Moon,
  Layers,
} from 'lucide-react';
import { ProductItem } from '../../data/productData';
import { useTheme } from '../../context/ThemeContext';

interface Product360ViewerProps {
  product: ProductItem;
  className?: string;
}

export const Product360Viewer: React.FC<Product360ViewerProps> = ({
  product,
  className = '',
}) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const containerRef = useRef<HTMLDivElement>(null);
  const [rotationAngle, setRotationAngle] = useState<number>(0);
  const [isAutoRotating, setIsAutoRotating] = useState<boolean>(true);
  const [isInteracting, setIsInteracting] = useState<boolean>(false);
  const [studioLighting, setStudioLighting] = useState<'clean' | 'moody' | 'amber'>('clean');
  const [zoomLevel, setZoomLevel] = useState<number>(1);

  // Drag physics tracking refs
  const dragStartRef = useRef<{ x: number; angle: number; time: number }>({ x: 0, angle: 0, time: 0 });
  const velocityRef = useRef<number>(0);
  const targetAngleRef = useRef<number>(0);
  const currentAngleRef = useRef<number>(0);
  const animFrameIdRef = useRef<number | null>(null);

  // Main 60 FPS rotation physics loop
  useEffect(() => {
    let lastTime = performance.now();

    const loop = (now: number) => {
      const dt = Math.min((now - lastTime) / 1000, 0.1);
      lastTime = now;

      if (!isInteracting) {
        // Continuous auto-rotation around vertical Y-axis (32 degrees/second)
        if (isAutoRotating) {
          targetAngleRef.current = (targetAngleRef.current + 28 * dt) % 360;
        }

        // Apply inertia when released
        if (Math.abs(velocityRef.current) > 0.2) {
          targetAngleRef.current = (targetAngleRef.current + velocityRef.current * dt) % 360;
          velocityRef.current *= Math.pow(0.92, dt * 60); // friction damping
        } else {
          velocityRef.current = 0;
        }

        // Smooth spring interpolation
        let diff = targetAngleRef.current - currentAngleRef.current;
        // Normalize wrap-around difference
        while (diff < -180) diff += 360;
        while (diff > 180) diff -= 360;

        currentAngleRef.current = (currentAngleRef.current + diff * 0.16) % 360;
        if (currentAngleRef.current < 0) currentAngleRef.current += 360;
      }

      setRotationAngle(currentAngleRef.current);
      animFrameIdRef.current = requestAnimationFrame(loop);
    };

    animFrameIdRef.current = requestAnimationFrame(loop);
    return () => {
      if (animFrameIdRef.current) cancelAnimationFrame(animFrameIdRef.current);
    };
  }, [isAutoRotating, isInteracting]);

  // Pointer drag event handlers
  const handleDragStart = (clientX: number) => {
    setIsInteracting(true);
    dragStartRef.current = {
      x: clientX,
      angle: currentAngleRef.current,
      time: performance.now(),
    };
    velocityRef.current = 0;
  };

  const handleDragMove = (clientX: number) => {
    if (!isInteracting) return;
    const deltaX = clientX - dragStartRef.current.x;
    const now = performance.now();
    const dt = (now - dragStartRef.current.time) / 1000;

    // 1 pixel drag = 0.65 degrees rotation
    const sensitivity = 0.65;
    const nextAngle = (dragStartRef.current.angle + deltaX * sensitivity) % 360;

    if (dt > 0.005) {
      velocityRef.current = (deltaX * sensitivity) / dt * 0.45;
    }

    const normalized = nextAngle < 0 ? nextAngle + 360 : nextAngle;
    targetAngleRef.current = normalized;
    currentAngleRef.current = normalized;
  };

  const handleDragEnd = () => {
    if (!isInteracting) return;
    setIsInteracting(false);
    // Limit max flick velocity
    velocityRef.current = Math.max(-450, Math.min(450, velocityRef.current));
  };

  const handleSetPresetAngle = (angle: number) => {
    targetAngleRef.current = angle;
    velocityRef.current = 0;
  };

  const roundedAngle = Math.round(rotationAngle);

  // Dynamic light sheen calculation based on rotation angle (creates realistic metallic/glass specular pass)
  const specularPos = Math.sin((rotationAngle * Math.PI) / 180) * 50 + 50;
  const shadowStretch = Math.cos((rotationAngle * Math.PI) / 180) * 15;

  return (
    <div
      className={`relative w-full rounded-3xl overflow-hidden select-none border transition-all duration-300 ${
        isDark
          ? 'bg-[#0B1114] border-[#1E2B30] shadow-[0_25px_60px_rgba(0,0,0,0.8)]'
          : 'bg-[#F8FAFB] border-[#E2E8F0] shadow-[0_20px_50px_rgba(16,42,54,0.08)]'
      } ${className}`}
    >
      {/* Top 360° Studio Bar */}
      <div className="absolute top-4 left-4 right-4 z-20 flex items-center justify-between pointer-events-none">
        <div className="flex items-center gap-2 pointer-events-auto">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/60 dark:bg-black/70 backdrop-blur-md border border-white/10 text-white text-xs font-bold shadow-lg">
            <Compass className="w-3.5 h-3.5 text-cyan-400 animate-spin-slow" />
            <span>360° INTERACTIVE VIEW</span>
            <span className="text-[10px] text-cyan-300 font-mono pl-1 border-l border-white/20">
              {roundedAngle}°
            </span>
          </div>

          <button
            type="button"
            onClick={() => setIsAutoRotating((prev) => !prev)}
            className="p-1.5 rounded-full bg-black/60 dark:bg-black/70 backdrop-blur-md border border-white/10 text-white hover:text-cyan-400 transition"
            title={isAutoRotating ? 'Pause 360° Auto Rotation' : 'Start 360° Auto Rotation'}
          >
            {isAutoRotating ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
          </button>
        </div>

        {/* Studio Lighting Toggle */}
        <div className="flex items-center gap-1 p-1 rounded-full bg-black/60 dark:bg-black/70 backdrop-blur-md border border-white/10 pointer-events-auto">
          <button
            type="button"
            onClick={() => setStudioLighting('clean')}
            className={`px-2 py-0.5 rounded-full text-[10px] font-bold transition ${
              studioLighting === 'clean' ? 'bg-cyan-500 text-black' : 'text-slate-300 hover:text-white'
            }`}
          >
            Clean
          </button>
          <button
            type="button"
            onClick={() => setStudioLighting('moody')}
            className={`px-2 py-0.5 rounded-full text-[10px] font-bold transition ${
              studioLighting === 'moody' ? 'bg-purple-500 text-white' : 'text-slate-300 hover:text-white'
            }`}
          >
            Moody
          </button>
          <button
            type="button"
            onClick={() => setStudioLighting('amber')}
            className={`px-2 py-0.5 rounded-full text-[10px] font-bold transition ${
              studioLighting === 'amber' ? 'bg-amber-400 text-black' : 'text-slate-300 hover:text-white'
            }`}
          >
            Warm
          </button>
        </div>
      </div>

      {/* 360° ROTATION STAGE CANVAS */}
      <div
        ref={containerRef}
        onMouseDown={(e) => handleDragStart(e.clientX)}
        onMouseMove={(e) => handleDragMove(e.clientX)}
        onMouseUp={handleDragEnd}
        onMouseLeave={handleDragEnd}
        onTouchStart={(e) => handleDragStart(e.touches[0].clientX)}
        onTouchMove={(e) => handleDragMove(e.touches[0].clientX)}
        onTouchEnd={handleDragEnd}
        className="relative w-full h-[460px] sm:h-[560px] flex items-center justify-center cursor-ew-resize overflow-hidden perspective-1000"
      >
        {/* Dynamic Studio Background Glow based on lighting preset */}
        <div
          className="absolute inset-0 pointer-events-none transition-all duration-700"
          style={{
            background:
              studioLighting === 'moody'
                ? isDark
                  ? 'radial-gradient(circle at 50% 45%, rgba(139,92,246,0.18) 0%, rgba(11,17,20,0.95) 75%)'
                  : 'radial-gradient(circle at 50% 45%, rgba(139,92,246,0.12) 0%, rgba(248,250,251,0.95) 75%)'
                : studioLighting === 'amber'
                ? isDark
                  ? 'radial-gradient(circle at 50% 45%, rgba(245,158,11,0.18) 0%, rgba(11,17,20,0.95) 75%)'
                  : 'radial-gradient(circle at 50% 45%, rgba(245,158,11,0.12) 0%, rgba(248,250,251,0.95) 75%)'
                : isDark
                ? 'radial-gradient(circle at 50% 45%, rgba(7,153,166,0.18) 0%, rgba(11,17,20,0.95) 75%)'
                : 'radial-gradient(circle at 50% 45%, rgba(7,153,166,0.12) 0%, rgba(248,250,251,0.95) 75%)',
          }}
        />

        {/* Ambient Pedestal Horizon */}
        <div className="absolute bottom-[90px] left-8 right-8 h-px bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent pointer-events-none" />

        {/* 360 ROTATING PRODUCT OBJECT */}
        <div
          className="relative will-change-transform transition-transform ease-out"
          style={{
            transform: `scale(${zoomLevel})`,
          }}
        >
          {/* Realistic Floor Shadow that shifts with Y-rotation angle */}
          <div
            className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-72 sm:w-88 h-10 rounded-full pointer-events-none transition-all duration-100"
            style={{
              transform: `translateX(-50%) skewX(${shadowStretch}deg)`,
              background: isDark
                ? 'radial-gradient(ellipse at center, rgba(0,0,0,0.88) 0%, rgba(7,153,166,0.2) 40%, transparent 75%)'
                : 'radial-gradient(ellipse at center, rgba(16,42,54,0.45) 0%, rgba(7,153,166,0.1) 40%, transparent 75%)',
              filter: 'blur(7px)',
            }}
          />

          {/* MAIN 3D PRODUCT ELEMENT */}
          <div
            className="relative w-72 sm:w-96 h-72 sm:h-96 rounded-3xl overflow-hidden transform-style-3d will-change-transform"
            style={{
              transform: `rotateY(${rotationAngle}deg)`,
              transition: isInteracting ? 'none' : 'transform 0.08s ease-out',
            }}
          >
            <img
              src={product.mainImage}
              alt={product.title}
              className="w-full h-full object-contain pointer-events-none drop-shadow-2xl"
              draggable={false}
            />

            {/* Specular Light Sweep overlay that dynamically travels across the product as it rotates */}
            <div
              className="absolute inset-0 pointer-events-none mix-blend-overlay transition-opacity duration-300"
              style={{
                background: `linear-gradient(${
                  105 + shadowStretch
                }deg, transparent ${Math.max(0, specularPos - 25)}%, rgba(255,255,255,0.45) ${specularPos}%, transparent ${Math.min(100, specularPos + 25)}%)`,
                opacity: 0.85,
              }}
            />
          </div>

          {/* REALISTIC MIRROR REFLECTION UNDERNEATH */}
          <div
            className="absolute top-full left-0 right-0 h-44 overflow-hidden pointer-events-none select-none"
            style={{
              transform: `scaleY(-1) rotateY(${rotationAngle}deg)`,
              transformOrigin: 'top center',
              marginTop: '10px',
              opacity: isDark ? 0.35 : 0.22,
              filter: 'blur(2.5px) brightness(0.7)',
              maskImage: 'linear-gradient(to bottom, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.15) 40%, transparent 80%)',
              WebkitMaskImage: 'linear-gradient(to bottom, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.15) 40%, transparent 80%)',
            }}
          >
            <img
              src={product.mainImage}
              alt={`${product.title} reflection`}
              className="w-full h-72 sm:h-96 object-contain"
              draggable={false}
            />
          </div>
        </div>

        {/* Drag Hint overlay on first render */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 pointer-events-none flex items-center gap-2 px-4 py-1.5 rounded-full bg-black/60 dark:bg-black/70 backdrop-blur-md border border-white/10 text-white text-xs font-semibold shadow-lg">
          <RotateCcw className="w-3.5 h-3.5 text-cyan-400 animate-spin-slow" />
          <span>Drag left/right to rotate 360°</span>
        </div>
      </div>

      {/* Bottom Preset Angles & Zoom Controls */}
      <div className="p-4 border-t border-[#E2E8F0] dark:border-[#1E2B30] flex flex-wrap items-center justify-between gap-3 bg-white/50 dark:bg-[#0B1114]/50 backdrop-blur-sm">
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-bold text-slate-400">View Angles:</span>
          {[
            { label: 'Front 0°', angle: 0 },
            { label: 'Side 90°', angle: 90 },
            { label: 'Back 180°', angle: 180 },
            { label: 'Profile 270°', angle: 270 },
          ].map((preset) => (
            <button
              key={preset.label}
              type="button"
              onClick={() => handleSetPresetAngle(preset.angle)}
              className="px-2.5 py-1 rounded-lg text-xs font-semibold border border-slate-300 dark:border-slate-700 hover:border-cyan-500 text-slate-700 dark:text-slate-300 hover:text-cyan-400 transition"
            >
              {preset.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setZoomLevel((prev) => Math.max(0.85, prev - 0.15))}
            className="p-1.5 rounded-lg border border-slate-300 dark:border-slate-700 hover:text-cyan-400 text-xs font-bold"
            title="Zoom Out"
          >
            -
          </button>
          <span className="text-xs font-mono font-bold text-slate-400">
            {Math.round(zoomLevel * 100)}%
          </span>
          <button
            type="button"
            onClick={() => setZoomLevel((prev) => Math.min(1.4, prev + 0.15))}
            className="p-1.5 rounded-lg border border-slate-300 dark:border-slate-700 hover:text-cyan-400 text-xs font-bold"
            title="Zoom In"
          >
            +
          </button>
          <button
            type="button"
            onClick={() => {
              setZoomLevel(1);
              handleSetPresetAngle(0);
            }}
            className="p-1.5 rounded-lg border border-slate-300 dark:border-slate-700 hover:text-cyan-400 text-xs font-bold ml-1"
            title="Reset to 0°"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
