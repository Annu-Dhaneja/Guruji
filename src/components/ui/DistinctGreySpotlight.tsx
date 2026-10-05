import React from 'react';
import { useTheme } from '../../context/ThemeContext';

interface DistinctGreySpotlightProps {
  className?: string;
  intensity?: 'normal' | 'high' | 'subtle';
}

/**
 * Distinct Overhead Grey Spotlight & Luminous Top Edge Flare
 * Generates an authentic, atmospheric studio cone spotlight radiating down from overhead.
 * Theme-Aware:
 * - In Dark Mode: Luminous Silver-Grey / Moonlight Slate beams with brilliant silver-white top edge laser flare.
 * - In Light Mode: Vibrant Electric Cyan-Teal / Radiant Aqua beams with striking cyan top edge laser flare.
 */
export const DistinctGreySpotlight: React.FC<DistinctGreySpotlightProps> = ({
  className = '',
  intensity = 'high',
}) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const opacityMultiplier = intensity === 'high' ? 1 : intensity === 'subtle' ? 0.6 : 0.85;

  return (
    <div
      className={`absolute inset-0 pointer-events-none select-none ${className}`}
      aria-hidden="true"
      style={{ opacity: opacityMultiplier }}
    >
      {/* ========================================================================= */}
      {/* 1. LUMINOUS TOP EDGE LIGHT FLARE (z-30 to stay crisp above page headers) */}
      {/* ========================================================================= */}
      <div className="absolute top-0 left-0 right-0 z-30 pointer-events-none overflow-visible flex flex-col items-center">
        {/* Continuous horizontal edge laser flare line */}
        <div
          className={`w-full max-w-7xl h-[2.5px] transition-all duration-500 ${
            isDark
              ? 'bg-gradient-to-r from-transparent via-white via-slate-100 to-transparent shadow-[0_0_35px_rgba(255,255,255,0.95)]'
              : 'bg-gradient-to-r from-transparent via-[#0799A6] via-[#25B4BD] to-transparent shadow-[0_0_35px_rgba(7,153,166,0.95)]'
          }`}
        />

        {/* Secondary softer corona streak */}
        <div
          className={`w-4/5 h-[4px] -mt-[2px] blur-xs transition-all duration-500 ${
            isDark
              ? 'bg-gradient-to-r from-transparent via-slate-200 to-transparent shadow-[0_0_20px_rgba(255,255,255,0.8)]'
              : 'bg-gradient-to-r from-transparent via-[#25B4BD] to-transparent shadow-[0_0_20px_rgba(37,180,189,0.8)]'
          }`}
        />

        {/* Core incandescent filament apex flare */}
        <div
          className={`w-36 sm:w-56 h-2 -mt-1 rounded-full blur-[1px] transition-all duration-500 ${
            isDark
              ? 'bg-white shadow-[0_0_30px_10px_rgba(255,255,255,0.95)]'
              : 'bg-[#0799A6] shadow-[0_0_30px_10px_rgba(7,153,166,0.95)]'
          }`}
        />

        {/* Soft downward light halo wash */}
        <div
          className={`w-3/5 sm:w-[600px] h-20 -mt-6 rounded-full blur-2xl transition-all duration-500 ${
            isDark
              ? 'bg-gradient-to-b from-white/45 via-slate-200/25 to-transparent'
              : 'bg-gradient-to-b from-[#0799A6]/45 via-[#25B4BD]/20 to-transparent'
          }`}
        />
      </div>

      {/* ========================================================================= */}
      {/* 2. DISTINCT GEOMETRIC OVERHEAD CONE SPOTLIGHT BEAM (z-0 behind content)   */}
      {/* ========================================================================= */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[850px] sm:w-[1150px] lg:w-[1350px] h-[680px] sm:h-[800px] z-0 overflow-hidden">
        {/* Primary dense light shaft */}
        <div
          className="w-full h-full transition-all duration-500"
          style={{
            background: isDark
              ? 'radial-gradient(ellipse 55% 75% at 50% 0%, rgba(241, 245, 249, 0.48) 0%, rgba(203, 213, 225, 0.30) 35%, rgba(148, 163, 184, 0.12) 65%, transparent 100%)'
              : 'radial-gradient(ellipse 55% 75% at 50% 0%, rgba(7, 153, 166, 0.40) 0%, rgba(37, 180, 189, 0.25) 35%, rgba(148, 163, 184, 0.10) 65%, transparent 100%)',
            clipPath: 'polygon(44% 0%, 56% 0%, 95% 100%, 5% 100%)',
            filter: 'blur(32px)',
          }}
        />

        {/* Secondary inner bright spotlight core */}
        <div
          className="absolute inset-0 w-full h-full transition-all duration-500"
          style={{
            background: isDark
              ? 'radial-gradient(ellipse 40% 65% at 50% 0%, rgba(255, 255, 255, 0.55) 0%, rgba(226, 232, 240, 0.32) 30%, rgba(148, 163, 184, 0.08) 60%, transparent 95%)'
              : 'radial-gradient(ellipse 40% 65% at 50% 0%, rgba(255, 255, 255, 0.85) 0%, rgba(37, 180, 189, 0.35) 30%, rgba(7, 153, 166, 0.08) 60%, transparent 95%)',
            clipPath: 'polygon(46% 0%, 54% 0%, 82% 100%, 18% 100%)',
            filter: 'blur(20px)',
          }}
        />
      </div>

      {/* ========================================================================= */}
      {/* 3. DIFFUSED VOLUMETRIC SVG HAZE                                           */}
      {/* ========================================================================= */}
      <svg
        className="absolute -top-16 left-1/2 -translate-x-1/2 w-[1400px] h-[850px] opacity-75 transition-all duration-500 z-0"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1400 850"
        fill="none"
      >
        <g filter="url(#spotlightFilter)">
          <ellipse
            cx="700"
            cy="150"
            rx="520"
            ry="240"
            fill={isDark ? '#E2E8F0' : '#0799A6'}
            fillOpacity={isDark ? '0.22' : '0.25'}
          />
          <ellipse
            cx="700"
            cy="280"
            rx="420"
            ry="280"
            fill={isDark ? '#94A3B8' : '#25B4BD'}
            fillOpacity={isDark ? '0.14' : '0.15'}
          />
        </g>
        <defs>
          <filter
            id="spotlightFilter"
            x="-200"
            y="-200"
            width="1800"
            height="1250"
            filterUnits="userSpaceOnUse"
            colorInterpolationFilters="sRGB"
          >
            <feGaussianBlur stdDeviation="95" result="blurEffect" />
          </filter>
        </defs>
      </svg>

      {/* ========================================================================= */}
      {/* 4. GROUND / SUBJECT AMBIENT POOL OF LIGHT                                 */}
      {/* ========================================================================= */}
      <div
        className="absolute top-[180px] sm:top-[220px] left-1/2 -translate-x-1/2 w-[650px] sm:w-[950px] h-[450px] transition-all duration-500 z-0"
        style={{
          background: isDark
            ? 'radial-gradient(ellipse 65% 55% at 50% 50%, rgba(203, 213, 225, 0.20) 0%, rgba(148, 163, 184, 0.08) 45%, transparent 75%)'
            : 'radial-gradient(ellipse 65% 55% at 50% 50%, rgba(7, 153, 166, 0.22) 0%, rgba(37, 180, 189, 0.08) 45%, transparent 75%)',
          filter: 'blur(50px)',
        }}
      />
    </div>
  );
};
