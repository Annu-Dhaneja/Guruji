import React, { useState } from 'react';
import {
  X,
  Sparkles,
  Trophy,
  CheckCircle2,
  Calendar,
  Flame,
  Award,
} from 'lucide-react';
import { WardrobeClothingItem } from '../../types';

interface WardrobeChallengeModalProps {
  isOpen: boolean;
  onClose: () => void;
  wardrobe: WardrobeClothingItem[];
}

export const WardrobeChallengeModal: React.FC<WardrobeChallengeModalProps> = ({
  isOpen,
  onClose,
  wardrobe,
}) => {
  const [completedDays, setCompletedDays] = useState<number[]>([1, 2, 3]);

  if (!isOpen) return null;

  const handleToggleDay = (day: number) => {
    if (!completedDays) return;
    if (completedDays.includes(day)) {
      setCompletedDays(completedDays.filter((d) => d !== day));
    } else {
      setCompletedDays([...completedDays, day]);
    }
  };

  const streakCount = (completedDays || []).length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div
        className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden text-slate-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-slate-900/80">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <Trophy className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">30-Day Wardrobe Challenge</h3>
              <p className="text-xs text-slate-400">Build sustainable rewear habits & unlock new styles</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4 text-xs">
          {/* Progress Card */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-950/40 via-slate-950 to-slate-950 border border-amber-500/20 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[10px] uppercase font-bold text-amber-400 flex items-center space-x-1">
                <Flame className="w-3.5 h-3.5 text-amber-400" />
                <span>Active Streak: {streakCount} Days</span>
              </span>
              <h4 className="text-sm font-bold text-white">Zero Unnecessary Shopping Streak</h4>
              <p className="text-[11px] text-slate-400">
                You’ve created {streakCount} intentional outfits from clothes you already own.
              </p>
            </div>
            <div className="text-center pl-3">
              <span className="text-2xl font-black text-amber-400">{Math.round((streakCount / 30) * 100)}%</span>
              <span className="text-[10px] text-slate-400 block">Completed</span>
            </div>
          </div>

          {/* 30-Day Checklist Grid */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="font-semibold text-slate-300">Daily Outfit Log (Tap to check off)</span>
              <span className="text-[11px] text-amber-400">{streakCount}/30 Checked</span>
            </div>

            <div className="grid grid-cols-6 sm:grid-cols-10 gap-1.5 p-3 bg-slate-950 rounded-2xl border border-slate-800">
              {Array.from({ length: 30 }).map((_, i) => {
                const dayNum = i + 1;
                const isDone = completedDays.includes(dayNum);
                return (
                  <button
                    key={dayNum}
                    onClick={() => handleToggleDay(dayNum)}
                    className={`aspect-square rounded-lg flex flex-col items-center justify-center font-bold text-[11px] transition-all border ${
                      isDone
                        ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-sm'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    <span>D{dayNum}</span>
                    {isDone && <CheckCircle2 className="w-2.5 h-2.5 mt-0.5" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Challenge Rules */}
          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5 text-slate-300">
            <strong className="text-white text-xs block flex items-center space-x-1">
              <Award className="w-3.5 h-3.5 text-amber-400" />
              <span>Challenge Guidelines:</span>
            </strong>
            <ul className="space-y-1 text-[11px] text-slate-400 list-disc list-inside">
              <li>Wear only pieces currently in your closet for 30 days.</li>
              <li>Aim for at least 2 re-styled combinations per piece.</li>
              <li>Save ₹10,000+ by curating instead of impulse shopping.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
