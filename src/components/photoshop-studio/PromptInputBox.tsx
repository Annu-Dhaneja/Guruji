import React, { useState } from 'react';
import {
  Wand2,
  Sparkles,
  Zap,
  Sliders,
  ChevronDown,
  ChevronUp,
  RotateCcw,
  Layers,
  ArrowRight,
  ShieldCheck,
  Cpu,
  Palette,
  FileImage,
  Maximize2,
  CheckCircle,
} from 'lucide-react';

export interface PromptBuilderValues {
  category: string;
  desiredResult: string;
  inputType: string;
  outputFormat: string;
  dimensions: string;
  quality: string;
  photoshopVersion: string;
  automationLevel: string;
}

interface PromptInputBoxProps {
  prompt: string;
  onPromptChange: (value: string) => void;
  onGenerate: (builderValues?: PromptBuilderValues) => void;
  isGenerating: boolean;
  onEnhancePrompt: () => void;
  isEnhancing: boolean;
}

export const PromptInputBox: React.FC<PromptInputBoxProps> = ({
  prompt,
  onPromptChange,
  onGenerate,
  isGenerating,
  onEnhancePrompt,
  isEnhancing,
}) => {
  const [showBuilder, setShowBuilder] = useState(false);
  const [builderValues, setBuilderValues] = useState<PromptBuilderValues>({
    category: 'E-commerce',
    desiredResult: 'Automate pure white background, brightness curve, sharpness, and 2000x2000 export',
    inputType: 'Product Photo',
    outputFormat: 'JPG',
    dimensions: '2000x2000',
    quality: 'High (90%)',
    photoshopVersion: 'Photoshop 2024+',
    automationLevel: 'Full Action (when possible)',
  });

  const examplePrompts = [
    {
      label: 'Amazon Pure White BG (2000×2000)',
      category: 'E-commerce',
      text: 'Create a Photoshop action that automatically removes the background, improves product brightness, adds contrast, sharpens the product, creates an RGB 255 pure white background and exports a 2000x2000 JPG.',
    },
    {
      label: 'Frequency Separation Skin Retouch',
      category: 'Portrait',
      text: 'Create a portrait skin-retouching workflow with frequency separation, natural texture preservation, gentle eye pop, and subtle editorial color grading.',
    },
    {
      label: 'Batch Image Resizer (1920px WebP)',
      category: 'Batch Processing',
      text: 'Create a batch Photoshop action that resizes all open images to 1920px width, sharpens edges, embeds a subtle watermark logo, and exports compressed WebP files.',
    },
    {
      label: 'Jewelry Specular Shine & Metal Pop',
      category: 'Product Photography',
      text: 'Create a workflow to enhance diamond sparkle, remove micro dust scratches, increase gold/silver specular shine, and export high resolution PNG with transparent background.',
    },
    {
      label: 'Apparel 3D Ghost Mannequin',
      category: 'E-commerce',
      text: 'Create an automated guide to combine front garment photo with inner neck collar tag shot to build a hollow 3D ghost mannequin effect on pure white background.',
    },
    {
      label: 'YouTube Thumbnail Pop & Neon Rim',
      category: 'YouTube Thumbnail',
      text: 'Create an action that applies high-impact clarity, HDR toning, neon rim lighting glow effect around subject, and 1280x720 300DPI thumbnail export.',
    },
  ];

  const handleApplyExample = (item: (typeof examplePrompts)[0]) => {
    onPromptChange(item.text);
    setBuilderValues((prev) => ({ ...prev, category: item.category }));
  };

  const handleBuilderChange = (key: keyof PromptBuilderValues, val: string) => {
    setBuilderValues((prev) => ({ ...prev, [key]: val }));
  };

  return (
    <div className="w-full bg-white dark:bg-slate-900/90 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-purple-900/40 shadow-2xl backdrop-blur-xl relative overflow-hidden transition-all duration-300">
      
      {/* Decorative ambient gradient backdrop */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl pointer-events-none -ml-20 -mb-20"></div>

      <div className="relative z-10 space-y-6">
        
        {/* Header Title with AI Status Pill */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-600 via-amber-500 to-teal-400 p-0.5 shadow-md flex items-center justify-center">
              <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-amber-400 animate-pulse" />
              </div>
            </div>
            <div>
              <h3 className="text-lg font-black text-slate-900 dark:text-white tracking-tight flex items-center space-x-2">
                <span>Prompt Your Photoshop Workflow</span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                Describe any editing task in plain English. The AI generates action files & step-by-step guides.
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2 self-start sm:self-auto">
            <button
              type="button"
              onClick={() => setShowBuilder(!showBuilder)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center space-x-1.5 transition-all border ${
                showBuilder
                  ? 'bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 border-purple-400 dark:border-purple-600'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700 hover:border-purple-400'
              }`}
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>Smart Prompt Builder</span>
              {showBuilder ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {/* Example Prompt Quick Chips */}
        <div>
          <div className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2 flex items-center space-x-1.5">
            <Zap className="w-3 h-3 text-amber-500" />
            <span>Popular Presets & Inspiration:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {examplePrompts.map((item, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleApplyExample(item)}
                className="px-3 py-1.5 rounded-xl bg-[#FFFFFF] dark:bg-[#182429] hover:bg-[#DDF3F4]/50 dark:hover:bg-[#1E2B30] text-[#52636A] dark:text-[#B7C6C8] hover:text-[#0799A6] dark:hover:text-[#25B4BD] border border-[#DCE7E7] dark:border-[#2A3C40] hover:border-[#0799A6]/40 text-xs font-semibold transition-all duration-200 text-left flex items-center space-x-1.5 shadow-2xs"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[#0799A6]"></span>
                <span>{item.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Main Textarea Prompt Box */}
        <div className="relative rounded-2xl border-2 border-[#DCE7E7] dark:border-[#2A3C40] bg-[#FFFFFF] dark:bg-[#182429] focus-within:border-[#0799A6] dark:focus-within:border-[#25B4BD] focus-within:ring-4 focus-within:ring-[#0799A6]/10 transition-all shadow-xs">
          <textarea
            id="photoshop-prompt-input"
            rows={4}
            value={prompt}
            onChange={(e) => onPromptChange(e.target.value)}
            placeholder="Describe what you want Photoshop to automate (e.g. Create a Photoshop action that automatically removes the background, improves product brightness, adds contrast, sharpens the product, creates an RGB 255 white background and exports a 2000x2000 JPG)..."
            className="w-full bg-transparent px-4 py-3.5 text-sm sm:text-base text-[#102A36] dark:text-[#F4F8F8] placeholder-[#819396] focus:outline-none resize-none font-medium leading-relaxed"
          ></textarea>

          {/* Bottom Bar inside Prompt Box */}
          <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-2.5 border-t border-[#DCE7E7] dark:border-[#2A3C40] bg-[#F8FAFA]/80 dark:bg-[#111A1E]/80 rounded-b-2xl">
            
            <div className="flex items-center space-x-3 text-xs text-slate-500 dark:text-slate-400">
              <span>
                <strong>{prompt.length}</strong> characters
              </span>
              <span>•</span>
              <span className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center space-x-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Action Safe AI Engine</span>
              </span>
            </div>

            <div className="flex items-center space-x-2">
              {prompt.length > 0 && (
                <button
                  type="button"
                  onClick={() => onPromptChange('')}
                  className="px-2.5 py-1 text-xs font-semibold text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white transition-colors"
                  title="Clear input"
                >
                  Clear
                </button>
              )}

              {/* Enhance Prompt Button */}
              <button
                type="button"
                onClick={onEnhancePrompt}
                disabled={isEnhancing || prompt.length < 5}
                className="px-3 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-500/30 text-xs font-bold flex items-center space-x-1.5 transition-all disabled:opacity-50"
                title="Improve prompt with resolution, exact curves, and export parameters"
              >
                <Wand2 className={`w-3.5 h-3.5 ${isEnhancing ? 'animate-spin' : ''}`} />
                <span>{isEnhancing ? 'Enhancing...' : 'Improve My Prompt'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Collapsible Smart Prompt Builder */}
        {showBuilder && (
          <div className="p-5 rounded-2xl bg-slate-100/90 dark:bg-slate-950/70 border border-purple-500/20 space-y-4 animate-in fade-in duration-300">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-black uppercase tracking-wider text-purple-700 dark:text-purple-300 flex items-center space-x-1.5">
                <Sliders className="w-3.5 h-3.5" />
                <span>Fine-Tune Automation Parameters</span>
              </h4>
              <span className="text-[11px] text-slate-500">Optional precision filters</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              
              {/* Category */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Category</label>
                <select
                  value={builderValues.category}
                  onChange={(e) => handleBuilderChange('category', e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:border-purple-500"
                >
                  <option value="E-commerce">E-commerce Product</option>
                  <option value="Portrait">Portrait & Beauty</option>
                  <option value="Product Photography">Product Photography</option>
                  <option value="Batch Processing">Batch Processing</option>
                  <option value="YouTube Thumbnail">YouTube Thumbnail</option>
                  <option value="Social Media">Social Media Post</option>
                  <option value="Print & CMYK">Print & CMYK Artwork</option>
                  <option value="Graphic Design">Graphic Design</option>
                </select>
              </div>

              {/* Input Image Type */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Input Image Type</label>
                <select
                  value={builderValues.inputType}
                  onChange={(e) => handleBuilderChange('inputType', e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:border-purple-500"
                >
                  <option value="Product Photo">Product Photo</option>
                  <option value="Portrait / Face">Portrait / Face</option>
                  <option value="Apparel & Fashion">Apparel & Fashion</option>
                  <option value="Jewelry & Metallic">Jewelry & Metallic</option>
                  <option value="Flat Lay">Flat Lay / Still Life</option>
                  <option value="Raw Camera CR2/NEF">Raw Camera CR2/NEF</option>
                </select>
              </div>

              {/* Output Format */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Output Format</label>
                <select
                  value={builderValues.outputFormat}
                  onChange={(e) => handleBuilderChange('outputFormat', e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:border-purple-500"
                >
                  <option value="JPG">JPEG (.jpg)</option>
                  <option value="PNG">PNG 24-bit Transparent (.png)</option>
                  <option value="WebP">WebP (.webp)</option>
                  <option value="PSD">Photoshop PSD Layered (.psd)</option>
                  <option value="TIFF">TIFF 16-Bit Print (.tif)</option>
                </select>
              </div>

              {/* Dimensions */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Dimensions</label>
                <select
                  value={builderValues.dimensions}
                  onChange={(e) => handleBuilderChange('dimensions', e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:border-purple-500"
                >
                  <option value="2000x2000">2000 x 2000 px (Amazon/Flipkart)</option>
                  <option value="1920x1080">1920 x 1080 px (FHD 16:9)</option>
                  <option value="1080x1080">1080 x 1080 px (Instagram Square)</option>
                  <option value="1280x720">1280 x 720 px (YouTube Thumbnail)</option>
                  <option value="Original">Keep Original Dimensions</option>
                </select>
              </div>

              {/* Quality */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Export Quality</label>
                <select
                  value={builderValues.quality}
                  onChange={(e) => handleBuilderChange('quality', e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:border-purple-500"
                >
                  <option value="High (90%)">High (90% - Recommended for Web)</option>
                  <option value="Maximum (100%)">Maximum (100% - Archival / Print)</option>
                  <option value="Medium (80%)">Medium (80% - Fast Loading)</option>
                </select>
              </div>

              {/* Photoshop Version */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Target Photoshop Version</label>
                <select
                  value={builderValues.photoshopVersion}
                  onChange={(e) => handleBuilderChange('photoshopVersion', e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:border-purple-500"
                >
                  <option value="Photoshop 2024+">Photoshop 2024+ (Cloud AI Select)</option>
                  <option value="Photoshop 2023">Photoshop 2023</option>
                  <option value="Photoshop CC (All)">Photoshop CC (All Versions)</option>
                  <option value="Legacy CS6">Legacy CS6 / CS5</option>
                </select>
              </div>

              {/* Automation Level */}
              <div className="space-y-1.5 sm:col-span-2">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Automation Preference</label>
                <select
                  value={builderValues.automationLevel}
                  onChange={(e) => handleBuilderChange('automationLevel', e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:border-purple-500"
                >
                  <option value="Full Action (when possible)">Full Action (.ATN) when possible, fallback to Hybrid</option>
                  <option value="Interactive Step Guide">Detailed Interactive Step-by-Step Tutorial</option>
                  <option value="Custom Order Assessment">Prepare for GurucraftPro Custom Automation Order</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Generate Workflow Main Action Button */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
          <div className="flex items-center space-x-2 text-xs text-slate-500 dark:text-slate-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>Real-time .ATN binary compilation & interactive step verification</span>
          </div>

          <button
            type="button"
            id="btn-generate-photoshop-workflow"
            onClick={() => onGenerate(showBuilder ? builderValues : undefined)}
            disabled={isGenerating || prompt.trim().length < 3}
            className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-[#0799A6] via-[#087581] to-[#F5A39A] hover:opacity-95 text-white font-black text-sm tracking-wide shadow-lg shadow-[#0799A6]/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center space-x-2 disabled:opacity-50 disabled:pointer-events-none"
          >
            {isGenerating ? (
              <>
                <Cpu className="w-5 h-5 animate-spin text-amber-300" />
                <span>Synthesizing Workflow Pipeline...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5 text-amber-300" />
                <span>Generate Workflow</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
};
