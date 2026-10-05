import React from 'react';
import {
  Sparkles,
  Zap,
  Layers,
  ArrowRight,
  Download,
  CheckCircle,
  Eye,
  Star,
} from 'lucide-react';
import { PhotoshopTemplate } from '../../types';

interface PhotoshopTemplatesGridProps {
  templates: PhotoshopTemplate[];
  onSelectTemplate: (template: PhotoshopTemplate) => void;
}

export const PhotoshopTemplatesGrid: React.FC<PhotoshopTemplatesGridProps> = ({
  templates,
  onSelectTemplate,
}) => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center space-x-2 text-xs font-bold text-teal-600 dark:text-teal-400">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Ready-to-Deploy Blueprints</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            Popular Studio Workflow Templates
          </h3>
        </div>
        <p className="text-xs text-slate-500 max-w-sm">
          Select any verified workflow to instantly load, customize, or download the pre-compiled action file.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {templates.map((tpl) => (
          <div
            key={tpl.id}
            onClick={() => onSelectTemplate(tpl)}
            className="group p-6 rounded-3xl bg-[#FFFFFF] dark:bg-[#182429] hover:bg-[#F8FAFA] dark:hover:bg-[#111A1E] border border-[#DCE7E7] dark:border-[#2A3C40] hover:border-[#0799A6]/50 shadow-xs hover:shadow-md transition-all cursor-pointer relative overflow-hidden flex flex-col justify-between"
          >
            {/* Top Tag & Category */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-[#DDF3F4] dark:bg-[#173D40] text-[#087581] dark:text-[#25B4BD] border border-[#0799A6]/20">
                  {tpl.category}
                </span>

                <div className="flex items-center space-x-1 text-amber-500 text-xs font-bold">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span>{tpl.rating || 4.9}</span>
                </div>
              </div>

              {/* Title & Description */}
              <h4 className="text-base font-black text-[#102A36] dark:text-[#F4F8F8] group-hover:text-[#0799A6] dark:group-hover:text-[#25B4BD] transition-colors">
                {tpl.title}
              </h4>
              <p className="text-xs text-[#52636A] dark:text-[#B7C6C8] line-clamp-2 leading-relaxed">
                {tpl.description}
              </p>
            </div>

            {/* Bottom Meta & Action */}
            <div className="pt-6 border-t border-[#DCE7E7] dark:border-[#2A3C40] mt-4 flex items-center justify-between">
              <div className="flex items-center space-x-2 text-[11px] text-[#52636A] dark:text-[#819396] font-medium">
                <Layers className="w-3.5 h-3.5 text-[#819396]" />
                <span>{tpl.stepCount} Steps</span>
                <span>•</span>
                <span>{tpl.photoshopVersion}</span>
              </div>

              <div className="flex items-center space-x-1 text-xs font-bold text-[#0799A6] dark:text-[#25B4BD] group-hover:translate-x-1 transition-transform">
                <span>Load Workflow</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
