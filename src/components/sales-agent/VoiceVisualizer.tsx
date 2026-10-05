import React from 'react';
import { motion } from 'motion/react';

interface VoiceVisualizerProps {
  isListening: boolean;
  isSpeaking: boolean;
  muted?: boolean;
}

export const VoiceVisualizer: React.FC<VoiceVisualizerProps> = ({ isListening, isSpeaking, muted }) => {
  const bars = [4, 9, 14, 22, 18, 12, 6, 16, 24, 19, 10, 5];

  if (!isListening && !isSpeaking) {
    return (
      <div className="flex items-center justify-center space-x-1.5 h-10 px-4 py-2 bg-slate-900/60 rounded-full border border-slate-800">
        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
        <span className="text-xs font-medium text-slate-400">Ready to listen</span>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center space-x-1 h-12 px-5 bg-gradient-to-r from-purple-950/60 via-slate-950/80 to-amber-950/60 rounded-full border border-purple-500/30 shadow-inner">
      <span className="text-xs font-semibold uppercase tracking-wider text-purple-300 mr-2">
        {isListening ? 'Listening' : isSpeaking ? (muted ? 'Muted' : 'Speaking') : 'Active'}
      </span>
      {bars.map((baseHeight, idx) => (
        <motion.div
          key={idx}
          className={`w-1 rounded-full ${
            isListening
              ? 'bg-gradient-to-t from-teal-400 to-emerald-300'
              : 'bg-gradient-to-t from-purple-500 via-amber-400 to-teal-300'
          }`}
          animate={{
            height: isListening
              ? [baseHeight * 0.4, baseHeight * 1.5, baseHeight * 0.6]
              : isSpeaking && !muted
              ? [baseHeight * 0.6, baseHeight * 1.8, baseHeight * 0.8]
              : 4,
          }}
          transition={{
            repeat: Infinity,
            repeatType: 'reverse',
            duration: 0.4 + (idx % 4) * 0.15,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
};
