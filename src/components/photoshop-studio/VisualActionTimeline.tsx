import React from 'react';
import {
  Sparkles,
  Layers,
  CheckCircle2,
  Clock,
  Zap,
  Sliders,
  ChevronRight,
  Info,
  Wand2,
  Lock,
} from 'lucide-react';
import { PhotoshopWorkflowStep, PhotoshopStepCompatibility } from '../../types';

interface VisualActionTimelineProps {
  steps: PhotoshopWorkflowStep[];
  activeStepIndex: number;
  onSelectStep: (index: number) => void;
  onToggleStepCompletion: (stepId: string) => void;
}

export const VisualActionTimeline: React.FC<VisualActionTimelineProps> = ({
  steps,
  activeStepIndex,
  onSelectStep,
  onToggleStepCompletion,
}) => {
  const getCompatibilityBadge = (compat: PhotoshopStepCompatibility) => {
    switch (compat) {
      case 'ACTION SAFE':
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 flex items-center space-x-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
            <span>Action Safe</span>
          </span>
        );
      case 'ACTION LIMITED':
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/30 flex items-center space-x-1">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
            <span>Action Limited</span>
          </span>
        );
      case 'MANUAL':
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/30 flex items-center space-x-1">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400"></span>
            <span>Manual Guide</span>
          </span>
        );
      case 'CUSTOM SCRIPT':
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/30 flex items-center space-x-1">
            <span className="w-1.5 h-1.5 rounded-full bg-purple-400"></span>
            <span>Custom Script</span>
          </span>
        );
    }
  };

  const completedCount = steps.filter((s) => s.completed).length;
  const progressPercent = steps.length > 0 ? Math.round((completedCount / steps.length) * 100) : 0;

  return (
    <div className="space-y-4">
      {/* Progress Header */}
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center space-x-2">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-purple-600 to-teal-400 p-0.5 flex items-center justify-center">
            <div className="w-full h-full bg-slate-900 rounded-[6px] flex items-center justify-center">
              <Layers className="w-3.5 h-3.5 text-teal-300" />
            </div>
          </div>
          <h4 className="text-sm font-bold text-slate-900 dark:text-white">Workflow Timeline & Execution Flow</h4>
        </div>

        <div className="flex items-center space-x-3 text-xs">
          <span className="text-slate-500 dark:text-slate-400 font-medium">
            <strong className="text-purple-600 dark:text-purple-400 font-bold">{completedCount}</strong> of {steps.length} Steps Completed
          </span>
          <div className="w-24 h-2 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-purple-500 to-teal-400 transition-all duration-300 rounded-full"
              style={{ width: `${progressPercent}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Horizontal Scrollable Step Nodes */}
      <div className="flex items-stretch space-x-3 overflow-x-auto pb-3 pt-1 scrollbar-thin scrollbar-thumb-purple-500/20">
        {steps.map((step, idx) => {
          const isActive = idx === activeStepIndex;
          const isDone = step.completed;

          return (
            <div
              key={step.id || idx}
              onClick={() => onSelectStep(idx)}
              className={`flex-shrink-0 w-64 p-3.5 rounded-2xl border transition-all cursor-pointer relative group ${
                isActive
                  ? 'bg-purple-600/10 dark:bg-purple-950/40 border-purple-500 ring-2 ring-purple-500/20 shadow-lg shadow-purple-900/10'
                  : isDone
                  ? 'bg-slate-100/80 dark:bg-slate-900/60 border-emerald-500/40 hover:border-emerald-500'
                  : 'bg-white dark:bg-slate-900/40 border-slate-200 dark:border-slate-800 hover:border-purple-500/40 hover:bg-slate-50 dark:hover:bg-slate-850'
              }`}
            >
              {/* Step Number & Checkbox */}
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <span
                    className={`w-6 h-6 rounded-lg font-black text-[11px] flex items-center justify-center ${
                      isActive
                        ? 'bg-purple-600 text-white'
                        : isDone
                        ? 'bg-emerald-500 text-slate-950 font-black'
                        : 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    {String(step.stepNumber).padStart(2, '0')}
                  </span>
                  <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 truncate max-w-[90px]">
                    {step.action}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleStepCompletion(step.id);
                  }}
                  className={`p-1 rounded-md transition-colors ${
                    isDone
                      ? 'text-emerald-500 hover:text-emerald-600'
                      : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
                  }`}
                  title={isDone ? 'Mark Incomplete' : 'Mark Completed'}
                >
                  <CheckCircle2 className={`w-4 h-4 ${isDone ? 'fill-emerald-500/20' : ''}`} />
                </button>
              </div>

              {/* Step Title */}
              <h5 className="text-xs font-bold text-slate-900 dark:text-white line-clamp-2 mb-2 leading-snug">
                {step.title}
              </h5>

              {/* Menu Path */}
              <div className="text-[10px] text-slate-500 dark:text-slate-400 font-mono bg-slate-100 dark:bg-slate-950/80 px-2 py-1 rounded-lg truncate mb-2.5 border border-slate-200 dark:border-slate-800">
                {step.menuPath}
              </div>

              {/* Compatibility Badge */}
              <div className="flex items-center justify-between pt-1">
                {getCompatibilityBadge(step.compatibility)}
                <ChevronRight
                  className={`w-3.5 h-3.5 transition-transform ${
                    isActive ? 'text-purple-500 translate-x-0.5' : 'text-slate-400 group-hover:translate-x-0.5'
                  }`}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
