import React from 'react';
import { X, Sparkles, MessageSquare } from 'lucide-react';
import { WardrobeClothingItem, QuickStyleProfile, DayOutfitPlan } from '../../types';
import { AskWardrobeAiChat } from './AskWardrobeAiChat';

interface AskWardrobeAiDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  wardrobe: WardrobeClothingItem[];
  profile: QuickStyleProfile;
  currentPlan: DayOutfitPlan[];
}

export const AskWardrobeAiDrawer: React.FC<AskWardrobeAiDrawerProps> = ({
  isOpen,
  onClose,
  wardrobe,
  profile,
  currentPlan,
}) => {
  if (!isOpen) return null;

  return (
    <div
      id="ask-wardrobe-ai-drawer"
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-end sm:justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-sm animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="w-full sm:max-w-xl h-[85vh] sm:h-[80vh] rounded-t-3xl sm:rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/80">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">AI Wardrobe Stylist</h3>
              <p className="text-[11px] text-slate-400">Ask anything about styling your closet</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Chat Component */}
        <div className="flex-1 overflow-hidden p-3 bg-slate-900/60">
          <AskWardrobeAiChat
            wardrobe={wardrobe}
            profile={profile}
            currentPlan={currentPlan}
          />
        </div>
      </div>
    </div>
  );
};
