import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Zap,
  Sliders,
  Layers,
  Download,
  FileText,
  ShieldCheck,
  Cpu,
  CheckCircle2,
  HelpCircle,
  Clock,
  ArrowRight,
  MonitorCheck,
  ChevronDown,
  ChevronUp,
  Flame,
  FileCheck,
  Sparkle,
  Copy,
  Check,
  Heart,
  Search,
  Wand2,
  Send,
} from 'lucide-react';
import { PromptInputBox, PromptBuilderValues } from '../components/photoshop-studio/PromptInputBox';
import { WorkflowResultDashboard } from '../components/photoshop-studio/WorkflowResultDashboard';
import { PhotoshopTemplatesGrid } from '../components/photoshop-studio/PhotoshopTemplatesGrid';
import { PhotoshopWorkflow, PhotoshopTemplate, PhotoshopCustomOrder, AIPromptItem } from '../types';

interface PhotoshopWorkflowStudioPageProps {
  onNavigate?: (page: string) => void;
  initialTab?: 'all' | 'photoshop' | 'prompts';
}

export const PhotoshopWorkflowStudioPage: React.FC<PhotoshopWorkflowStudioPageProps> = ({
  onNavigate,
  initialTab = 'all',
}) => {
  const [activeTab, setActiveTab] = useState<'all' | 'photoshop' | 'prompts'>(initialTab);
  const [prompt, setPrompt] = useState<string>(
    'Create a Photoshop action that automatically removes the background, improves product brightness, adds contrast, sharpens the product, creates an RGB 255 pure white background and exports a 2000x2000 JPG.'
  );
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [isEnhancing, setIsEnhancing] = useState<boolean>(false);
  const [currentWorkflow, setCurrentWorkflow] = useState<PhotoshopWorkflow | null>(null);
  const [templates, setTemplates] = useState<PhotoshopTemplate[]>([]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // AI Prompts Library State
  const [prompts, setPrompts] = useState<AIPromptItem[]>([]);
  const [activePromptCategory, setActivePromptCategory] = useState<string>('all');
  const [promptSearchQuery, setPromptSearchQuery] = useState<string>('');
  const [copiedPromptId, setCopiedPromptId] = useState<string | null>(null);
  const [promptFavorites, setPromptFavorites] = useState<string[]>([]);

  // AI Prompt Generator Sandbox State
  const [genTopic, setGenTopic] = useState<string>('Luxury Perfume Bottle');
  const [genTool, setGenTool] = useState<string>('Midjourney');
  const [genStyle, setGenStyle] = useState<string>('Cyberpunk Neon Studio');
  const [genOutput, setGenOutput] = useState<string>('');
  const [isGeneratingPrompt, setIsGeneratingPrompt] = useState<boolean>(false);

  // FAQ Accordion
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);

  useEffect(() => {
    // Fetch pre-built templates
    fetch('/api/photoshop/templates')
      .then((res) => res.json())
      .then((data) => setTemplates(data))
      .catch(console.error);

    // Fetch AI Prompts Library
    fetch('/api/prompts')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setPrompts(data);
      })
      .catch(console.error);

    // Load initial standard workflow if available
    fetch('/api/photoshop/workflows')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setCurrentWorkflow(data[0]);
        }
      })
      .catch(console.error);
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleGenerate = async (builderValues?: PromptBuilderValues) => {
    if (!prompt || prompt.trim().length < 3) return;

    setIsGenerating(true);
    try {
      const payload = {
        prompt,
        ...(builderValues || {}),
        userEmail: 'annudhaneja@gmail.com',
      };

      const res = await fetch('/api/photoshop/workflows/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success && data.workflow) {
        setCurrentWorkflow(data.workflow);
        showToast('🎉 Workflow and .ATN action file generated successfully!');

        // Smooth scroll to result
        const el = document.getElementById('workflow-result-section');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }
    } catch (err) {
      console.error('Error generating workflow:', err);
      showToast('❌ Failed to generate workflow. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleEnhancePrompt = async () => {
    if (!prompt) return;
    setIsEnhancing(true);
    try {
      const res = await fetch('/api/photoshop/workflows/enhance-prompt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });
      const data = await res.json();
      if (data.success && data.enhancedPrompt) {
        setPrompt(data.enhancedPrompt);
        showToast('✨ Prompt enhanced with professional parameters!');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsEnhancing(false);
    }
  };

  const handleSaveWorkflow = async (workflowId: string) => {
    try {
      const res = await fetch(`/api/photoshop/workflows/${workflowId}/save`, { method: 'POST' });
      const data = await res.json();
      if (data.success && currentWorkflow) {
        setCurrentWorkflow({ ...currentWorkflow, isSaved: data.isSaved });
        showToast(data.isSaved ? 'Saved to your Studio Library' : 'Removed from Library');
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleFavoriteWorkflow = async (workflowId: string) => {
    try {
      const res = await fetch(`/api/photoshop/workflows/${workflowId}/favorite`, { method: 'POST' });
      const data = await res.json();
      if (data.success && currentWorkflow) {
        setCurrentWorkflow({ ...currentWorkflow, isFavorite: data.isFavorite });
        showToast(data.isFavorite ? 'Added to Favorites ❤️' : 'Removed from Favorites');
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleToggleStep = async (stepId: string) => {
    if (!currentWorkflow) return;
    try {
      const res = await fetch(`/api/photoshop/workflows/${currentWorkflow.id}/steps/${stepId}/toggle`, {
        method: 'POST',
      });
      const data = await res.json();
      if (data.success && data.workflow) {
        setCurrentWorkflow(data.workflow);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleOrderCustomAction = async (orderData: Partial<PhotoshopCustomOrder>) => {
    try {
      const res = await fetch('/api/photoshop/custom-orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData),
      });
      const data = await res.json();
      if (data.success) {
        showToast('✅ Custom order submitted! We will contact you shortly.');
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleSelectTemplate = (template: PhotoshopTemplate) => {
    setPrompt(template.prompt);
    handleGenerate({
      category: template.category,
      desiredResult: template.description,
      inputType: 'Product Photo',
      outputFormat: 'JPG',
      dimensions: '2000x2000',
      quality: 'High (90%)',
      photoshopVersion: template.photoshopVersion,
      automationLevel: 'Full Action (when possible)',
    });
  };

  const handleCopyPrompt = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedPromptId(id);
    fetch(`/api/prompts/${id}/copy`, { method: 'POST' }).catch(console.error);
    showToast('📋 Prompt copied to clipboard!');
    setTimeout(() => setCopiedPromptId(null), 2000);
  };

  const togglePromptFav = (id: string) => {
    setPromptFavorites((prev) =>
      prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]
    );
  };

  const handleGenerateCustomPrompt = async () => {
    setIsGeneratingPrompt(true);
    setGenOutput('');
    try {
      const res = await fetch('/api/ai/generate-prompt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic: genTopic, aiTool: genTool, style: genStyle }),
      });
      const data = await res.json();
      setIsGeneratingPrompt(false);
      if (data.generatedPrompt) {
        setGenOutput(data.generatedPrompt);
        showToast('✨ Custom prompt generated successfully!');
      }
    } catch (e) {
      setIsGeneratingPrompt(false);
      showToast('❌ Prompt generation failed. Please try again.');
    }
  };

  const handleUsePromptInPhotoshop = (promptText: string) => {
    setPrompt(
      `Create a Photoshop action tailored for this visual asset: ${promptText}. Include automatic color grading, contrast adjustment, sharpening, and high-res export.`
    );
    setActiveTab('photoshop');
    showToast('🪄 Prompt loaded into Photoshop Action Studio!');
    setTimeout(() => {
      const el = document.getElementById('prompt-section');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }, 150);
  };

  const promptCategories = [
    { id: 'all', label: 'All Prompts' },
    { id: 'product-photo', label: 'Product Photo' },
    { id: 'logo', label: 'Logo & Branding' },
    { id: 'ecom', label: 'E-commerce Copy' },
    { id: 'graphic-design', label: 'Fashion & Graphics' },
    { id: 'social-media', label: 'Social Media' },
  ];

  const filteredPrompts = (prompts || []).filter((p) => {
    const matchesCat = activePromptCategory === 'all' || p?.category === activePromptCategory;
    const q = (promptSearchQuery || '').toLowerCase();
    const matchesSearch =
      (p?.title || '').toLowerCase().includes(q) ||
      (p?.fullPrompt || '').toLowerCase().includes(q);
    return matchesCat && matchesSearch;
  });

  const faqs = [
    {
      q: 'What is an Adobe Photoshop Action (.ATN file)?',
      a: 'A Photoshop Action is a series of recorded commands and menu operations that you play back on a single image or an entire batch folder. It automates repetitive tasks like background clipping, brightness curves, resizing, and sharpening in seconds.',
    },
    {
      q: 'How does the AI determine if my request is Action-Safe?',
      a: 'Photoshop Actions can record menu commands, adjustment layers, filters, canvas resizes, and export routines. However, actions cannot guess where to paint with a healing brush on unpredictable acne or manual blemish spots. If your prompt includes manual brush strokes, GurucraftPro automatically tags those steps as "Manual Guide" and provides an exact step-by-step checklist.',
    },
    {
      q: 'Can I use the generated .ATN files for Batch Processing?',
      a: 'Yes! In Adobe Photoshop, go to File > Automate > Batch..., select your loaded GurucraftPro action set, choose your input folder of hundreds of raw photos, and Photoshop will automatically process and export every single photo at lightning speed.',
    },
    {
      q: 'What if I need custom JSX scripts or advanced conditional actions?',
      a: 'For complex multi-file logic, API connections, watermark auto-placements based on orientation, or UXP plugins, you can click "Order Custom Action". Annu Dhaneja and the GurucraftPro engineering team will build and test a custom deliverable for you.',
    },
  ];

  return (
    <div className="space-y-16 pb-20 bg-transparent text-[#102A36] dark:text-[#F4F8F8] transition-colors duration-300">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 px-5 py-3 rounded-2xl bg-[#102A36] dark:bg-[#182429] text-white border border-[#0799A6]/50 shadow-2xl flex items-center space-x-2 text-xs font-bold animate-in fade-in slide-in-from-bottom-2 duration-300">
          <Sparkle className="w-4 h-4 text-[#F5A39A]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-transparent text-[#102A36] dark:text-[#F4F8F8] pt-12 pb-16 border-b border-[#DCE7E7]/60 dark:border-[#243338]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(7,153,166,0.12),transparent_50%)] pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(245,163,154,0.15),transparent_50%)] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-8 text-center">
          
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-[#DDF3F4] dark:bg-[#173D40] text-[#087581] dark:text-[#25B4BD] border border-[#0799A6]/30 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-4 h-4 text-[#0799A6] dark:text-[#25B4BD]" />
            <span>AI Studio &amp; Generative Prompts Hub • GurucraftPro</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.1] max-w-4xl mx-auto text-[#102A36] dark:text-[#F4F8F8]">
            Automated Photoshop Actions &amp; <br />
            <span className="text-[#0799A6] dark:text-[#25B4BD]">
              Generative AI Prompts Library
            </span>
          </h1>

          <p className="text-base sm:text-lg text-[#52636A] dark:text-[#B7C6C8] leading-relaxed font-normal max-w-2xl mx-auto">
            Transform plain English editing goals into downloadable Photoshop .ATN files, or discover high-converting Midjourney, ChatGPT, Gemini, and DALL-E prompts.
          </p>

          {/* Quick Metrics Bar */}
          <div className="flex flex-wrap items-center justify-center gap-6 pt-2 text-xs font-semibold text-[#52636A] dark:text-[#B7C6C8]">
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-[#0799A6] dark:text-[#25B4BD]" />
              <span>Direct .ATN Action Download</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-[#F5A39A] dark:text-[#F2A39A]" />
              <span>Midjourney &amp; ChatGPT Prompts</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-[#0799A6] dark:text-[#25B4BD]" />
              <span>Custom Action Orders by Annu Dhaneja</span>
            </div>
          </div>

          {/* Unified Studio Navigation Tabs (Peach Pink & Teal Blue Style) */}
          <div className="flex items-center justify-center pt-4">
            <div className="inline-flex p-1.5 rounded-full bg-[#FFFFFF] dark:bg-[#182429] border border-[#DCE7E7] dark:border-[#2A3C40] shadow-xs flex-wrap gap-1">
              <button
                type="button"
                onClick={() => setActiveTab('all')}
                className={`px-4 sm:px-6 py-2 rounded-full text-xs font-bold transition-all flex items-center space-x-2 ${
                  activeTab === 'all'
                    ? 'bg-[#0799A6] text-white shadow-xs'
                    : 'text-[#52636A] dark:text-[#B7C6C8] hover:text-[#0799A6] dark:hover:text-[#25B4BD]'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>All Features &amp; Services</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('photoshop')}
                className={`px-4 sm:px-6 py-2 rounded-full text-xs font-bold transition-all flex items-center space-x-2 ${
                  activeTab === 'photoshop'
                    ? 'bg-[#0799A6] text-white shadow-xs'
                    : 'text-[#52636A] dark:text-[#B7C6C8] hover:text-[#0799A6] dark:hover:text-[#25B4BD]'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Photoshop Action Studio</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('prompts')}
                className={`px-4 sm:px-6 py-2 rounded-full text-xs font-bold transition-all flex items-center space-x-2 ${
                  activeTab === 'prompts'
                    ? 'bg-[#0799A6] text-white shadow-xs'
                    : 'text-[#52636A] dark:text-[#B7C6C8] hover:text-[#0799A6] dark:hover:text-[#25B4BD]'
                }`}
              >
                <Zap className="w-3.5 h-3.5" />
                <span>AI Prompts &amp; Generator</span>
              </button>
            </div>
          </div>

        </div>
      </section>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20">
        
        {/* 1. PHOTOSHOP AI WORKFLOW STUDIO SECTION */}
        {(activeTab === 'all' || activeTab === 'photoshop') && (
          <div className="space-y-16">
            {activeTab === 'all' && (
              <div className="flex items-center space-x-3 border-b border-[#DCE7E7] dark:border-[#2A3C40] pb-4">
                <div className="p-2 rounded-xl bg-[#DDF3F4] dark:bg-[#173D40] text-[#087581] dark:text-[#25B4BD]">
                  <Layers className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-xl sm:text-2xl font-black text-[#102A36] dark:text-[#F4F8F8]">
                    Photoshop AI Workflow Studio
                  </h2>
                  <p className="text-xs text-[#52636A] dark:text-[#819396]">
                    Generate .ATN action files, step-by-step walkthroughs, and custom batch workflows.
                  </p>
                </div>
              </div>
            )}

            {/* Prompt Input Box */}
            <section id="prompt-section">
              <PromptInputBox
                prompt={prompt}
                onPromptChange={setPrompt}
                onGenerate={handleGenerate}
                isGenerating={isGenerating}
                onEnhancePrompt={handleEnhancePrompt}
                isEnhancing={isEnhancing}
              />
            </section>

            {/* Workflow Result Section */}
            {currentWorkflow && (
              <section id="workflow-result-section">
                <WorkflowResultDashboard
                  workflow={currentWorkflow}
                  onSaveWorkflow={handleSaveWorkflow}
                  onFavoriteWorkflow={handleFavoriteWorkflow}
                  onToggleStep={handleToggleStep}
                  onOrderCustomAction={handleOrderCustomAction}
                  onRegenerate={() => handleGenerate()}
                />
              </section>
            )}

            {/* Popular Templates Library */}
            {templates.length > 0 && (
              <section>
                <PhotoshopTemplatesGrid
                  templates={templates}
                  onSelectTemplate={handleSelectTemplate}
                />
              </section>
            )}

            {/* Compatibility Matrix: Action Safe vs Manual vs Script */}
            <section className="p-8 rounded-3xl bg-[#FFFFFF] dark:bg-[#182429] border border-[#DCE7E7] dark:border-[#2A3C40] space-y-6 shadow-xs">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#0799A6] dark:text-[#25B4BD]">
                  Photoshop Engine Capabilities
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-[#102A36] dark:text-[#F4F8F8] mt-1">
                  What Can Photoshop Actions Automate?
                </h3>
                <p className="text-xs text-[#52636A] dark:text-[#819396] mt-1">
                  Understand the difference between 100% recordable actions, artist manual steps, and custom scripts.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* Column 1: Action Safe */}
                <div className="p-5 rounded-2xl bg-[#DDF3F4]/50 dark:bg-[#111A1E] border border-[#0799A6]/30 space-y-3">
                  <div className="flex items-center space-x-2 text-[#087581] dark:text-[#25B4BD] font-bold text-sm">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#0799A6]"></span>
                    <span>🟢 100% Action-Safe (.ATN)</span>
                  </div>
                  <p className="text-xs text-[#52636A] dark:text-[#B7C6C8]">
                    Operations that run automatically with zero user intervention:
                  </p>
                  <ul className="text-xs text-[#52636A] dark:text-[#B7C6C8] space-y-1.5 list-disc list-inside">
                    <li>Cloud AI Subject Selection</li>
                    <li>Layer Duplication &amp; Smart Object Conversion</li>
                    <li>Curves, Levels, Brightness, Vibrance</li>
                    <li>Gaussian Blur, Unsharp Mask, High Pass</li>
                    <li>Canvas Resize, Cropping &amp; Center Fitting</li>
                    <li>Solid Color Fill Backgrounds (RGB 255)</li>
                    <li>Multi-Format Export (JPG, PNG, WebP)</li>
                  </ul>
                </div>

                {/* Column 2: Manual Guide */}
                <div className="p-5 rounded-2xl bg-[#FDE2DE]/50 dark:bg-[#1E2B30] border border-[#F5A39A]/40 space-y-3">
                  <div className="flex items-center space-x-2 text-[#D9777F] dark:text-[#F2A39A] font-bold text-sm">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#F5A39A]"></span>
                    <span>🟠 Manual Guide Steps</span>
                  </div>
                  <p className="text-xs text-[#52636A] dark:text-[#B7C6C8]">
                    Tasks requiring artist visual discretion and brush precision:
                  </p>
                  <ul className="text-xs text-[#52636A] dark:text-[#B7C6C8] space-y-1.5 list-disc list-inside">
                    <li>Spot Healing Brush on random acne &amp; scars</li>
                    <li>Clone Stamp on complex fabric wrinkles</li>
                    <li>Delicate hair flyaway extraction</li>
                    <li>Custom dodge &amp; burn contour brushing</li>
                    <li>Artistic paint stroke placement</li>
                  </ul>
                </div>

                {/* Column 3: Custom Scripts */}
                <div className="p-5 rounded-2xl bg-[#F8FAFA] dark:bg-[#111A1E] border border-[#DCE7E7] dark:border-[#2A3C40] space-y-3">
                  <div className="flex items-center space-x-2 text-[#0799A6] dark:text-[#25B4BD] font-bold text-sm">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#0799A6]"></span>
                    <span>🔵 Custom Scripts / Plugins</span>
                  </div>
                  <p className="text-xs text-[#52636A] dark:text-[#B7C6C8]">
                    Complex logic requiring GurucraftPro engineering:
                  </p>
                  <ul className="text-xs text-[#52636A] dark:text-[#B7C6C8] space-y-1.5 list-disc list-inside">
                    <li>Conditional IF/ELSE logic (portrait vs landscape)</li>
                    <li>Multi-folder dynamic batch naming</li>
                    <li>CSV spreadsheet metadata injection</li>
                    <li>Custom UXP GUI panels and toolbars</li>
                  </ul>
                </div>

              </div>
            </section>
          </div>
        )}

        {/* 2. AI PROMPTS & GENERATIVE LIBRARY SECTION */}
        {(activeTab === 'all' || activeTab === 'prompts') && (
          <div className="space-y-12">
            {/* Section Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#DCE7E7] dark:border-[#2A3C40] pb-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-xl bg-[#DDF3F4] dark:bg-[#173D40] text-[#087581] dark:text-[#25B4BD]">
                  <Zap className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-xl sm:text-2xl font-black text-[#102A36] dark:text-[#F4F8F8]">
                    AI Prompt Library &amp; Custom Generator
                  </h2>
                  <p className="text-xs text-[#52636A] dark:text-[#819396]">
                    Curated prompts for Midjourney, ChatGPT, Gemini &amp; DALL-E with 1-click export to Photoshop.
                  </p>
                </div>
              </div>

              {activeTab === 'all' && (
                <button
                  type="button"
                  onClick={() => setActiveTab('prompts')}
                  className="text-xs font-bold text-[#0799A6] dark:text-[#25B4BD] hover:underline flex items-center space-x-1"
                >
                  <span>Focus on Prompts View</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Interactive AI Prompt Generator Sandbox */}
            <div className="p-6 sm:p-8 rounded-3xl bg-[#F8FAFA] dark:bg-[#111A1E] border border-[#DCE7E7] dark:border-[#2A3C40] text-[#102A36] dark:text-[#F4F8F8] space-y-6 shadow-xs max-w-4xl mx-auto">
              <div className="flex items-center space-x-3 border-b border-[#DCE7E7] dark:border-[#2A3C40] pb-4">
                <Sparkles className="w-6 h-6 text-[#0799A6] dark:text-[#25B4BD] animate-pulse" />
                <div>
                  <h3 className="text-base sm:text-lg font-black text-[#102A36] dark:text-[#F4F8F8]">
                    Interactive Gemini AI Prompt Creator
                  </h3>
                  <p className="text-xs text-[#52636A] dark:text-[#819396]">
                    Craft customized, high-converting prompts tailored for Midjourney, ChatGPT, and Photoshop.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                <div>
                  <label className="font-bold text-[#52636A] dark:text-[#B7C6C8] block mb-1">Topic / Subject</label>
                  <input
                    type="text"
                    value={genTopic}
                    onChange={(e) => setGenTopic(e.target.value)}
                    placeholder="e.g. Handmade Leather Bag"
                    className="w-full p-3 rounded-xl bg-[#FFFFFF] dark:bg-[#182429] border border-[#DCE7E7] dark:border-[#2A3C40] text-[#102A36] dark:text-[#F4F8F8] outline-none focus:border-[#0799A6] dark:focus:border-[#25B4BD]"
                  />
                </div>

                <div>
                  <label className="font-bold text-[#52636A] dark:text-[#B7C6C8] block mb-1">Target AI Tool</label>
                  <select
                    value={genTool}
                    onChange={(e) => setGenTool(e.target.value)}
                    className="w-full p-3 rounded-xl bg-[#FFFFFF] dark:bg-[#182429] border border-[#DCE7E7] dark:border-[#2A3C40] text-[#102A36] dark:text-[#F4F8F8] outline-none focus:border-[#0799A6] dark:focus:border-[#25B4BD]"
                  >
                    <option value="Midjourney">Midjourney v6</option>
                    <option value="ChatGPT">ChatGPT Copywriting</option>
                    <option value="Gemini">Gemini Strategy</option>
                    <option value="DALL-E 3">DALL-E 3</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-[#52636A] dark:text-[#B7C6C8] block mb-1">Aesthetic Style</label>
                  <input
                    type="text"
                    value={genStyle}
                    onChange={(e) => setGenStyle(e.target.value)}
                    placeholder="e.g. Minimalist Studio Glass"
                    className="w-full p-3 rounded-xl bg-[#FFFFFF] dark:bg-[#182429] border border-[#DCE7E7] dark:border-[#2A3C40] text-[#102A36] dark:text-[#F4F8F8] outline-none focus:border-[#0799A6] dark:focus:border-[#25B4BD]"
                  />
                </div>
              </div>

              <button
                type="button"
                onClick={handleGenerateCustomPrompt}
                disabled={isGeneratingPrompt}
                className="w-full py-3.5 rounded-xl btn-primary-cta text-white font-black text-xs shadow-md hover:opacity-95 transition-opacity"
              >
                {isGeneratingPrompt ? 'AI Crafting Prompt...' : 'Generate High-Converting Prompt'}
              </button>

              {genOutput && (
                <div className="p-4 rounded-xl bg-[#FFFFFF] dark:bg-[#182429] border border-[#0799A6]/40 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-[#0799A6] dark:text-[#25B4BD] uppercase">
                      Generated AI Prompt
                    </span>
                    <div className="flex items-center space-x-2">
                      <button
                        type="button"
                        onClick={() => handleUsePromptInPhotoshop(genOutput)}
                        className="text-[11px] text-[#087581] dark:text-[#25B4BD] hover:underline flex items-center space-x-1 font-bold"
                      >
                        <Wand2 className="w-3.5 h-3.5" />
                        <span>Send to Photoshop Action</span>
                      </button>
                      <span>•</span>
                      <button
                        type="button"
                        onClick={() => handleCopyPrompt('gen-output', genOutput)}
                        className="text-[11px] text-[#52636A] dark:text-[#B7C6C8] hover:text-[#0799A6] flex items-center space-x-1 font-bold"
                      >
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy Output</span>
                      </button>
                    </div>
                  </div>
                  <p className="text-xs text-[#102A36] dark:text-[#F4F8F8] font-mono leading-relaxed select-all">
                    {genOutput}
                  </p>
                </div>
              )}
            </div>

            {/* Filter and Search Bar */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-4 rounded-3xl bg-[#FFFFFF] dark:bg-[#182429] border border-[#DCE7E7] dark:border-[#2A3C40] shadow-xs">
              <div className="flex items-center space-x-1 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
                {promptCategories.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setActivePromptCategory(cat.id)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                      activePromptCategory === cat.id
                        ? 'bg-[#0799A6] text-white shadow-xs'
                        : 'text-[#52636A] dark:text-[#B7C6C8] hover:text-[#0799A6] dark:hover:text-[#25B4BD]'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>

              <div className="relative w-full md:w-64">
                <Search className="w-4 h-4 text-[#819396] absolute left-3 top-3" />
                <input
                  type="text"
                  value={promptSearchQuery}
                  onChange={(e) => setPromptSearchQuery(e.target.value)}
                  placeholder="Search prompt library..."
                  className="w-full pl-9 pr-4 py-2 rounded-xl bg-[#F8FAFA] dark:bg-[#111A1E] border border-[#DCE7E7] dark:border-[#2A3C40] text-xs text-[#102A36] dark:text-[#F4F8F8] outline-none focus:border-[#0799A6] dark:focus:border-[#25B4BD]"
                />
              </div>
            </div>

            {/* Prompts Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredPrompts.map((p) => {
                const isFav = promptFavorites.includes(p.id);
                return (
                  <div
                    key={p.id}
                    className="p-6 rounded-3xl bg-[#FFFFFF] dark:bg-[#182429] border border-[#DCE7E7] dark:border-[#2A3C40] shadow-xs space-y-4 flex flex-col justify-between hover:border-[#0799A6]/40 transition-colors"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-[#DDF3F4] dark:bg-[#173D40] text-[#087581] dark:text-[#25B4BD] border border-[#0799A6]/30">
                          {p.tool} • {p.difficulty}
                        </span>
                        <button
                          type="button"
                          onClick={() => togglePromptFav(p.id)}
                          className={`p-1.5 rounded-lg ${isFav ? 'text-[#F5A39A] fill-[#F5A39A]' : 'text-[#819396] hover:text-[#F5A39A]'}`}
                        >
                          <Heart className={`w-4 h-4 ${isFav ? 'fill-[#F5A39A]' : ''}`} />
                        </button>
                      </div>

                      <h3 className="text-base font-bold text-[#102A36] dark:text-[#F4F8F8] line-clamp-1">{p.title}</h3>
                      <p className="text-xs text-[#52636A] dark:text-[#B7C6C8]">{p.description}</p>

                      {/* Prompt Code Block */}
                      <div className="p-3.5 rounded-2xl bg-[#F8FAFA] dark:bg-[#111A1E] border border-[#DCE7E7] dark:border-[#2A3C40] text-xs font-mono text-[#102A36] dark:text-[#F4F8F8] leading-relaxed select-all">
                        {p.fullPrompt}
                      </div>
                    </div>

                    {/* Actions Row */}
                    <div className="pt-3 border-t border-[#DCE7E7] dark:border-[#2A3C40] flex items-center justify-between text-xs gap-2">
                      <span className="text-[#819396] font-semibold text-[11px]">{p.copyCount} Copies</span>

                      <div className="flex items-center space-x-2">
                        <button
                          type="button"
                          onClick={() => handleUsePromptInPhotoshop(p.fullPrompt)}
                          className="px-3 py-1.5 rounded-xl border border-[#0799A6]/40 hover:bg-[#DDF3F4]/50 dark:hover:bg-[#173D40]/50 text-[#087581] dark:text-[#25B4BD] font-bold text-[11px] flex items-center space-x-1 transition-colors"
                        >
                          <Wand2 className="w-3 h-3" />
                          <span>Action Studio</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleCopyPrompt(p.id, p.fullPrompt)}
                          className="px-3.5 py-1.5 rounded-xl bg-[#0799A6] hover:bg-[#087581] text-white font-bold flex items-center space-x-1.5 shadow-xs transition-colors"
                        >
                          {copiedPromptId === p.id ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-emerald-300" />
                              <span>Copied!</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5" />
                              <span>Copy</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* FAQ Accordion Section */}
        <section className="space-y-6 pt-6">
          <div className="text-center space-y-2">
            <h3 className="text-2xl sm:text-3xl font-black text-[#102A36] dark:text-[#F4F8F8]">
              Frequently Asked Questions
            </h3>
            <p className="text-xs sm:text-sm text-[#52636A] dark:text-[#B7C6C8] max-w-xl mx-auto">
              Everything you need to know about Photoshop actions, guides, prompts, and custom automation.
            </p>
          </div>

          <div className="max-w-3xl mx-auto space-y-3">
            {faqs.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={idx}
                  className="rounded-2xl border border-[#DCE7E7] dark:border-[#2A3C40] bg-[#FFFFFF] dark:bg-[#182429] overflow-hidden shadow-xs"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full p-4 sm:p-5 text-left flex items-center justify-between text-sm font-bold text-[#102A36] dark:text-[#F4F8F8] hover:text-[#0799A6] dark:hover:text-[#25B4BD] transition-colors"
                  >
                    <span>{faq.q}</span>
                    {isOpen ? <ChevronUp className="w-4 h-4 text-[#0799A6]" /> : <ChevronDown className="w-4 h-4 text-[#52636A] dark:text-[#819396]" />}
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-5 text-xs text-[#52636A] dark:text-[#B7C6C8] leading-relaxed border-t border-[#DCE7E7] dark:border-[#2A3C40] pt-3">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

      </div>
    </div>
  );
};
