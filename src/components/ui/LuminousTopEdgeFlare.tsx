import React from 'react';
import { useTheme } from '../../context/ThemeContext';

interface LuminousTopEdgeFlareProps {
  className?: string;
  showAmbientWash?: boolean;
}

/**
 * Luminous Top Edge Light Flare & Grey Light Effect
 * - Dark Theme: Authentic Luminous Silver-Grey / Moonlight Platinum Flare & Grey Atmospheric Light
 * - Light Theme: Vibrant Electric Cyan-Teal / Radiant Aqua Flare & Ambient Light
 */
export const LuminousTopEdgeFlare: React.FC<LuminousTopEdgeFlareProps> = ({
  className = '',
  showAmbientWash = true,
}) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <div
      className={`absolute top-0 left-0 right-0 pointer-events-none select-none overflow-hidden z-30 ${className}`}
      aria-hidden="true"
    >
      {/* 1. RAZOR-SHARP CONTINUOUS HORIZONTAL TOP EDGE LASER LINE */}
      <div
        className={`absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[2.5px] transition-all duration-500 z-30 ${
          isDark
            ? 'bg-gradient-to-r from-transparent via-white via-slate-100 to-transparent shadow-[0_0_35px_rgba(255,255,255,0.95)]'
            : 'bg-gradient-to-r from-transparent via-[#0799A6] via-[#25B4BD] to-transparent shadow-[0_0_35px_rgba(7,153,166,0.95)]'
        }`}
      />

      {/* 2. SECONDARY SOFT CORONA STREAK */}
      <div
        className={`absolute top-0 left-1/2 -translate-x-1/2 w-4/5 h-[4px] blur-xs transition-all duration-500 z-30 ${
          isDark
            ? 'bg-gradient-to-r from-transparent via-slate-200 to-transparent shadow-[0_0_20px_rgba(255,255,255,0.85)]'
            : 'bg-gradient-to-r from-transparent via-[#25B4BD] to-transparent shadow-[0_0_20px_rgba(37,180,189,0.85)]'
        }`}
      />

      {/* 3. CORE INCANDESCENT APEX FLARE */}
      <div
        className={`absolute top-0 left-1/2 -translate-x-1/2 w-36 sm:w-56 h-2 -mt-1 rounded-full blur-[1px] transition-all duration-500 z-30 ${
          isDark
            ? 'bg-white shadow-[0_0_32px_10px_rgba(255,255,255,0.95)]'
            : 'bg-[#0799A6] shadow-[0_0_32px_10px_rgba(7,153,166,0.95)]'
        }`}
      />

      {/* 4. DOWNWARD AMBIENT LIGHT FLARE OVERLAY WASH */}
      <div
        className={`absolute top-0 left-1/2 -translate-x-1/2 w-3/5 h-20 transition-all duration-500 blur-xl z-20 ${
          isDark
            ? 'bg-gradient-to-b from-slate-200/40 via-slate-300/18 to-transparent'
            : 'bg-gradient-to-b from-[#0799A6]/35 via-[#25B4BD]/18 to-transparent'
        }`}
      />

      {/* 5. ATMOSPHERIC GREY EFFECT LIGHT POOL (CONICAL DIFFUSED GLOW) */}
      {showAmbientWash && (
        <div
          className={`absolute top-0 left-1/2 -translate-x-1/2 w-[950px] h-[480px] pointer-events-none blur-3xl transition-all duration-500 z-10 ${
            isDark
              ? 'bg-[radial-gradient(ellipse_60%_50%_at_50%_0%,rgba(226,232,240,0.32),rgba(148,163,184,0.12),transparent_75%)]'
              : 'bg-[radial-gradient(ellipse_60%_50%_at_50%_0%,rgba(7,153,166,0.28),rgba(37,180,189,0.10),transparent_75%)]'
          }`}
        />
      )}
    </div>
  );
};
