import React from 'react';
import {
  X,
  Sparkles,
  Calendar,
  Plane,
  Clock,
  ShoppingBag,
  FlaskConical,
  Trophy,
  Users,
  UserCheck,
  ChevronRight,
  Zap,
  FileText,
} from 'lucide-react';

interface MoreAiToolsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTool: (toolId: string) => void;
}

export const MoreAiToolsDrawer: React.FC<MoreAiToolsDrawerProps> = ({
  isOpen,
  onClose,
  onSelectTool,
}) => {
  if (!isOpen) return null;

  const tools = [
    {
      id: 'style_blueprint',
      title: '7-Day Personal Style Blueprint',
      desc: 'Printable AI Consultation & Wardrobe Lookbook Report (PDF)',
      icon: FileText,
      badge: 'PDF Report',
      color: 'text-amber-400',
      bgColor: 'bg-amber-500/10',
    },
    {
      id: 'plan_7days',
      title: '7-Day Smart Wardrobe Planner',
      desc: 'Complete weekly outfit schedule & capsule rotation generator',
      icon: Calendar,
      badge: 'Capsule Suite',
      color: 'text-amber-400',
      bgColor: 'bg-amber-500/10',
    },
    {
      id: 'travel_mode',
      title: 'Travel & Packing Capsule Mode',
      desc: 'Pack 10 pieces for 5 days of vacation without luggage overload',
      icon: Plane,
      badge: 'Travel AI',
      color: 'text-cyan-400',
      bgColor: 'bg-cyan-500/10',
    },
    {
      id: 'forgotten_clothes',
      title: 'Forgotten Clothes Revival',
      desc: 'Spotlight unworn closet items with 3 modern styling pairings',
      icon: Clock,
      badge: 'Zero Waste',
      color: 'text-emerald-400',
      bgColor: 'bg-emerald-500/10',
    },
    {
      id: 'buy_decision',
      title: 'Buy Or Don’t Buy? Closet Gap Check',
      desc: 'Check if an item in your shopping cart fits before you purchase',
      icon: ShoppingBag,
      badge: 'Smart Cart',
      color: 'text-rose-400',
      bgColor: 'bg-rose-500/10',
    },
    {
      id: 'style_experiment',
      title: 'Style Experiment Mode',
      desc: 'Challenge routine habits with monochrome and proportion experiments',
      icon: FlaskConical,
      badge: 'Creative Lab',
      color: 'text-purple-400',
      bgColor: 'bg-purple-500/10',
    },
    {
      id: 'wardrobe_challenge',
      title: '30-Day Wardrobe Challenge',
      desc: 'Track daily rewear streaks and calculate shopping money saved',
      icon: Trophy,
      badge: 'Streak Game',
      color: 'text-amber-400',
      bgColor: 'bg-amber-500/10',
    },
    {
      id: 'family_mode',
      title: 'Family Multi-Wardrobe Mode',
      desc: 'Switch between personal, partner, and kids closet capsules',
      icon: Users,
      badge: 'Family Sync',
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/10',
    },
    {
      id: 'vip_consultation',
      title: 'VIP 1-on-1 Personal Video Consultation',
      desc: 'Book a 30-min private session with Master Stylist Annu Dhaneja',
      icon: UserCheck,
      badge: 'Human Expert',
      color: 'text-amber-400',
      bgColor: 'bg-amber-500/10',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div
        className="w-full max-w-xl max-h-[85vh] bg-slate-900 border border-slate-800 rounded-t-3xl sm:rounded-2xl shadow-2xl flex flex-col overflow-hidden text-slate-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-slate-900/90">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">More AI Wardrobe Tools</h3>
              <p className="text-xs text-slate-400">Explore all specialized styling and planning modules</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tool List */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-2.5">
          {tools.map((tool) => {
            const Icon = tool.icon;
            return (
              <button
                key={tool.id}
                onClick={() => {
                  onSelectTool(tool.id);
                  onClose();
                }}
                className="w-full p-3 sm:p-3.5 rounded-2xl bg-slate-950 hover:bg-slate-800/80 border border-slate-800 hover:border-amber-500/40 text-left transition-all group flex items-center justify-between"
              >
                <div className="flex items-center space-x-3.5 min-w-0">
                  <div className={`w-10 h-10 rounded-xl ${tool.bgColor} flex items-center justify-center ${tool.color} shrink-0`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center space-x-2">
                      <h4 className="text-xs sm:text-sm font-bold text-white group-hover:text-amber-400 transition-colors truncate">
                        {tool.title}
                      </h4>
                      <span className="text-[9px] px-2 py-0.5 rounded-md bg-slate-900 border border-slate-800 text-slate-400 font-semibold shrink-0">
                        {tool.badge}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-0.5 truncate">{tool.desc}</p>
                  </div>
                </div>

                <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-amber-400 group-hover:translate-x-0.5 transition-all shrink-0 ml-2" />
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
