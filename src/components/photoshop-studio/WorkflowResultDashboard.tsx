import React, { useState } from 'react';
import {
  Sparkles,
  Download,
  FileText,
  Copy,
  Printer,
  Heart,
  Bookmark,
  CheckCircle2,
  AlertTriangle,
  Info,
  Clock,
  Zap,
  Sliders,
  Layers,
  ChevronRight,
  ShieldCheck,
  Send,
  HelpCircle,
  RefreshCw,
  ExternalLink,
  Upload,
  Check,
  Share2,
  Code,
  FileDown,
  MonitorCheck,
  Sparkle,
} from 'lucide-react';
import { PhotoshopWorkflow, PhotoshopCustomOrder } from '../../types';
import { VisualActionTimeline } from './VisualActionTimeline';

interface WorkflowResultDashboardProps {
  workflow: PhotoshopWorkflow;
  onSaveWorkflow: (workflowId: string) => void;
  onFavoriteWorkflow: (workflowId: string) => void;
  onToggleStep: (stepId: string) => void;
  onOrderCustomAction: (orderData: Partial<PhotoshopCustomOrder>) => void;
  onRegenerate: () => void;
}

export const WorkflowResultDashboard: React.FC<WorkflowResultDashboardProps> = ({
  workflow,
  onSaveWorkflow,
  onFavoriteWorkflow,
  onToggleStep,
  onOrderCustomAction,
  onRegenerate,
}) => {
  const [activeTab, setActiveTab] = useState<'action' | 'guide' | 'custom-order'>('action');
  const [activeStepIndex, setActiveStepIndex] = useState<number>(0);
  const [copiedNotification, setCopiedNotification] = useState(false);
  const [howToInstallOpen, setHowToInstallOpen] = useState(false);

  // Custom Order Form State
  const [orderForm, setOrderForm] = useState({
    customerName: '',
    customerEmail: workflow.userEmail || '',
    customerPhone: '',
    title: `Custom Action: ${workflow.title}`,
    description: `I need a professional Photoshop action & script based on workflow "${workflow.title}". Requirements:\n${workflow.description}`,
    category: workflow.category || 'E-commerce',
    photoshopVersion: workflow.photoshopVersion || 'Photoshop 2024+',
    orderType: 'Advanced Action' as PhotoshopCustomOrder['orderType'],
    priority: 'Normal' as PhotoshopCustomOrder['priority'],
    deadline: '3-5 business days',
  });
  const [orderFiles, setOrderFiles] = useState<{ name: string; url: string; size: number }[]>([]);
  const [isSubmittingOrder, setIsSubmittingOrder] = useState(false);
  const [orderSubmittedSuccess, setOrderSubmittedSuccess] = useState(false);

  const getStatusBadge = () => {
    switch (workflow.compatibilityStatus) {
      case 'action-ready':
        return (
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 text-xs font-black shadow-sm">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>🟢 Action Ready (.ATN Compatible)</span>
          </div>
        );
      case 'hybrid':
        return (
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/30 text-xs font-black shadow-sm">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse"></span>
            <span>🟡 Hybrid Workflow (Action + Manual Touch-Up)</span>
          </div>
        );
      case 'manual-guide':
        return (
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/30 text-xs font-black shadow-sm">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-400"></span>
            <span>🔵 Manual Step Guide</span>
          </div>
        );
      case 'custom-order':
        return (
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/30 text-xs font-black shadow-sm">
            <span className="w-2.5 h-2.5 rounded-full bg-purple-400 animate-pulse"></span>
            <span>🟣 Custom Order Recommended</span>
          </div>
        );
    }
  };

  const handleCopyInstructions = () => {
    let guide = `${workflow.title.toUpperCase()}\n`;
    guide += `Target: ${workflow.photoshopVersion} | Confidence: ${workflow.automationConfidence}%\n\n`;
    guide += `OBJECTIVE:\n${workflow.objective}\n\n`;
    guide += `STEPS:\n`;
    workflow.steps.forEach((s, idx) => {
      guide += `Step ${idx + 1}: ${s.title}\n`;
      guide += `  Menu: ${s.menuPath}\n`;
      guide += `  Settings: ${s.settings}\n`;
      guide += `  Recommended: ${s.recommendedValue}\n`;
      guide += `  Result: ${s.expectedResult}\n\n`;
    });
    navigator.clipboard.writeText(guide);
    setCopiedNotification(true);
    setTimeout(() => setCopiedNotification(false), 3000);
  };

  const handlePrintGuide = () => {
    window.print();
  };

  const handleDownloadAtn = () => {
    window.open(`/api/photoshop/workflows/${workflow.id}/download-atn`, '_blank');
  };

  const handleDownloadGuide = () => {
    window.open(`/api/photoshop/workflows/${workflow.id}/download-guide`, '_blank');
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const fakeUrl = URL.createObjectURL(file);
      setOrderFiles((prev) => [...prev, { name: file.name, url: fakeUrl, size: file.size }]);
    }
  };

  const handleSubmitCustomOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingOrder(true);
    try {
      await onOrderCustomAction({
        ...orderForm,
        workflowId: workflow.id,
        referenceFiles: orderFiles.map((f, idx) => ({
          id: 'rf-' + Date.now() + '-' + idx,
          name: f.name,
          url: f.url,
          type: 'sample/image',
          size: f.size,
          createdAt: new Date().toISOString(),
        })),
      });
      setOrderSubmittedSuccess(true);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmittingOrder(false);
    }
  };

  const completedStepsCount = workflow.steps.filter((s) => s.completed).length;

  return (
    <div className="w-full space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Top Banner Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-purple-900/40 shadow-2xl backdrop-blur-xl relative overflow-hidden">
        
        {/* Glow Accents */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-purple-600/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 space-y-6">
          
          {/* Header Row: Title & Action Status */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2.5">
                {getStatusBadge()}
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                  {workflow.category}
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 border border-purple-300 dark:border-purple-700">
                  {workflow.photoshopVersion}
                </span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                {workflow.title}
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-300 max-w-3xl leading-relaxed">
                {workflow.objective || workflow.description}
              </p>
            </div>

            {/* Quick Actions (Favorite, Save, Re-generate) */}
            <div className="flex items-center space-x-2 self-start lg:self-center">
              <button
                type="button"
                onClick={() => onFavoriteWorkflow(workflow.id)}
                className={`p-3 rounded-2xl border transition-all ${
                  workflow.isFavorite
                    ? 'bg-rose-500/10 text-rose-500 border-rose-500/40'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-300 dark:border-slate-700 hover:text-rose-500'
                }`}
                title={workflow.isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
              >
                <Heart className={`w-4 h-4 ${workflow.isFavorite ? 'fill-rose-500' : ''}`} />
              </button>

              <button
                type="button"
                onClick={() => onSaveWorkflow(workflow.id)}
                className={`p-3 rounded-2xl border transition-all ${
                  workflow.isSaved
                    ? 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/40'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-300 dark:border-slate-700 hover:text-purple-500'
                }`}
                title={workflow.isSaved ? 'Saved in My Library' : 'Save to Library'}
              >
                <Bookmark className={`w-4 h-4 ${workflow.isSaved ? 'fill-purple-500' : ''}`} />
              </button>

              <button
                type="button"
                onClick={onRegenerate}
                className="px-4 py-3 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-700 text-xs font-bold flex items-center space-x-1.5 transition-colors shadow-sm"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Re-generate</span>
              </button>
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
            
            {/* Automation Confidence Metric */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800/80 flex items-center space-x-3">
              <div className="relative w-12 h-12 flex-shrink-0 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                  <path
                    className="text-slate-200 dark:text-slate-800"
                    strokeWidth="3.5"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <path
                    className="text-teal-400 transition-all duration-1000 ease-out"
                    strokeDasharray={`${workflow.automationConfidence}, 100`}
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>
                <span className="absolute text-xs font-black text-slate-900 dark:text-white">
                  {workflow.automationConfidence}%
                </span>
              </div>
              <div>
                <p className="text-[11px] text-slate-500 font-medium">Automation Score</p>
                <p className="text-xs font-bold text-slate-900 dark:text-slate-200">High Fidelity</p>
              </div>
            </div>

            {/* Total Steps */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800/80 flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center flex-shrink-0">
                <Layers className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[11px] text-slate-500 font-medium">Workflow Steps</p>
                <p className="text-sm font-bold text-slate-900 dark:text-white">{workflow.stepCount} Verified Steps</p>
              </div>
            </div>

            {/* Estimated Time */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800/80 flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center flex-shrink-0">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[11px] text-slate-500 font-medium">Execution Speed</p>
                <p className="text-sm font-bold text-slate-900 dark:text-white">{workflow.estimatedTime}</p>
              </div>
            </div>

            {/* Difficulty */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800/80 flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-teal-500/10 text-teal-600 dark:text-teal-400 flex items-center justify-center flex-shrink-0">
                <Zap className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[11px] text-slate-500 font-medium">Difficulty Level</p>
                <p className="text-sm font-bold text-slate-900 dark:text-white">{workflow.difficulty}</p>
              </div>
            </div>

          </div>

          {/* Action Limitations Notice if Hybrid or Limited */}
          {workflow.actionLimitations && workflow.actionLimitations.length > 0 && (
            <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-800 dark:text-amber-200 text-xs flex items-start space-x-3">
              <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
              <div>
                <strong className="font-bold">Workflow Guidance & Tips:</strong>
                <ul className="list-disc list-inside mt-1 space-y-0.5 text-[11px]">
                  {workflow.actionLimitations.map((lim, i) => (
                    <li key={i}>{lim}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}

        </div>
      </div>

      {/* Visual Action Timeline */}
      <VisualActionTimeline
        steps={workflow.steps}
        activeStepIndex={activeStepIndex}
        onSelectStep={(idx) => {
          setActiveStepIndex(idx);
          setActiveTab('guide');
        }}
        onToggleStepCompletion={onToggleStep}
      />

      {/* 3 Main Result Tabs */}
      <div className="space-y-6">
        
        {/* Navigation Tab Buttons */}
        <div className="flex flex-wrap items-center gap-2 p-1.5 rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 w-full sm:w-auto self-start">
          
          <button
            type="button"
            onClick={() => setActiveTab('action')}
            className={`px-5 py-3 rounded-xl text-xs font-bold flex items-center space-x-2 transition-all ${
              activeTab === 'action'
                ? 'bg-purple-600 text-white shadow-md'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Zap className="w-4 h-4" />
            <span>Action File (.ATN)</span>
            {workflow.actionPossible && (
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('guide')}
            className={`px-5 py-3 rounded-xl text-xs font-bold flex items-center space-x-2 transition-all ${
              activeTab === 'guide'
                ? 'bg-purple-600 text-white shadow-md'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Step-by-Step Guide</span>
            <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-slate-200 dark:bg-slate-800 font-black">
              {completedStepsCount}/{workflow.stepCount}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('custom-order')}
            className={`px-5 py-3 rounded-xl text-xs font-bold flex items-center space-x-2 transition-all ${
              activeTab === 'custom-order'
                ? 'bg-gradient-to-r from-amber-500 to-teal-500 text-slate-950 font-black shadow-md'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>Order Custom Action</span>
            <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-amber-500/20 text-amber-700 dark:text-amber-300 font-black">
              Pro
            </span>
          </button>

        </div>

        {/* TAB 1: ACTION FILE (.ATN) */}
        {activeTab === 'action' && (
          <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-purple-900/40 shadow-xl space-y-6">
            
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-200 dark:border-slate-800">
              <div className="space-y-1">
                <div className="flex items-center space-x-2 text-xs font-bold text-purple-600 dark:text-purple-400">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Adobe Photoshop Action Binary Specification</span>
                </div>
                <h3 className="text-xl font-black text-slate-900 dark:text-white">
                  {workflow.actionName || workflow.title}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Action Set: <code className="text-purple-600 dark:text-cyan-300 font-bold">"{workflow.actionSetName}"</code> • Target Version: {workflow.photoshopVersion} • Size: {workflow.actionFileSize || '15.4 KB'}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  id="btn-download-atn-file"
                  onClick={handleDownloadAtn}
                  className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-purple-600 to-teal-400 hover:opacity-90 text-white font-black text-xs sm:text-sm flex items-center space-x-2 shadow-lg shadow-purple-900/20 hover:scale-[1.02] transition-transform"
                >
                  <Download className="w-4 h-4" />
                  <span>Download .ATN Action File</span>
                </button>

                <button
                  type="button"
                  onClick={() => setHowToInstallOpen(!howToInstallOpen)}
                  className="px-4 py-3.5 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-700 text-xs font-bold flex items-center space-x-1.5 transition-colors"
                >
                  <HelpCircle className="w-4 h-4 text-purple-500" />
                  <span>How to Load Action</span>
                </button>
              </div>
            </div>

            {/* How to Install Collapsible Guide */}
            {howToInstallOpen && (
              <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-950/80 border border-purple-500/20 space-y-3 animate-in fade-in duration-300">
                <h4 className="text-xs font-black uppercase text-purple-700 dark:text-purple-300 flex items-center space-x-2">
                  <MonitorCheck className="w-4 h-4" />
                  <span>3-Step Installation in Adobe Photoshop:</span>
                </h4>
                <ol className="list-decimal list-inside text-xs text-slate-700 dark:text-slate-300 space-y-2 leading-relaxed">
                  <li>
                    <strong>Download & Locate:</strong> Download the <code className="text-purple-600 dark:text-purple-400 font-bold">{workflow.actionFileName || 'Action.atn'}</code> file to your computer.
                  </li>
                  <li>
                    <strong>Open Photoshop Actions Panel:</strong> In Adobe Photoshop, open <code className="bg-slate-200 dark:bg-slate-800 px-1.5 py-0.5 rounded text-purple-600 dark:text-cyan-300 font-mono">Window &gt; Actions</code> (or press <kbd className="bg-slate-200 dark:bg-slate-800 px-1.5 py-0.5 rounded font-mono">Alt + F9</kbd> / <kbd className="bg-slate-200 dark:bg-slate-800 px-1.5 py-0.5 rounded font-mono">Opt + F9</kbd>).
                  </li>
                  <li>
                    <strong>Load Action:</strong> Click the flyout menu icon (top right of Actions panel) and select <code className="bg-slate-200 dark:bg-slate-800 px-1.5 py-0.5 rounded text-purple-600 dark:text-cyan-300 font-mono">Load Actions...</code>, choose your downloaded file, and press the <strong>Play</strong> button to execute!
                  </li>
                </ol>
              </div>
            )}

            {/* Steps Preview in Action Mode */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Recorded Action Commands ({workflow.steps.length})
              </h4>
              <div className="space-y-2">
                {workflow.steps.map((step, idx) => (
                  <div
                    key={step.id || idx}
                    className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800/80 flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center space-x-3">
                      <span className="w-6 h-6 rounded-md bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 font-mono font-bold flex items-center justify-center text-[10px]">
                        {idx + 1}
                      </span>
                      <div>
                        <p className="font-bold text-slate-900 dark:text-white">{step.title}</p>
                        <p className="text-[11px] text-slate-500 font-mono">{step.menuPath}</p>
                      </div>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                      {step.compatibility}
                    </span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* TAB 2: STEP-BY-STEP INTERACTIVE GUIDE */}
        {activeTab === 'guide' && (
          <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-purple-900/40 shadow-xl space-y-6">
            
            {/* Guide Toolbar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
              <div>
                <h3 className="text-xl font-black text-slate-900 dark:text-white">
                  Interactive Step-by-Step Tutorial
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Follow along inside Photoshop. Mark each step completed as you progress.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={handleCopyInstructions}
                  className="px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-700 text-xs font-bold flex items-center space-x-1.5 transition-colors"
                >
                  {copiedNotification ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedNotification ? 'Copied to Clipboard!' : 'Copy Instructions'}</span>
                </button>

                <button
                  type="button"
                  onClick={handlePrintGuide}
                  className="px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-700 text-xs font-bold flex items-center space-x-1.5 transition-colors"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print</span>
                </button>

                <button
                  type="button"
                  onClick={handleDownloadGuide}
                  className="px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold flex items-center space-x-1.5 transition-colors shadow-md"
                >
                  <FileDown className="w-3.5 h-3.5" />
                  <span>Download Guide (.txt)</span>
                </button>
              </div>
            </div>

            {/* Step Cards List */}
            <div className="space-y-4">
              {workflow.steps.map((step, idx) => {
                const isSelected = idx === activeStepIndex;
                const isDone = step.completed;

                return (
                  <div
                    key={step.id || idx}
                    onClick={() => setActiveStepIndex(idx)}
                    className={`p-5 rounded-2xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-purple-50/50 dark:bg-purple-950/30 border-purple-500 ring-2 ring-purple-500/20'
                        : isDone
                        ? 'bg-slate-50/50 dark:bg-slate-900/40 border-emerald-500/30'
                        : 'bg-white dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 hover:border-purple-400'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      
                      <div className="flex items-start space-x-3.5">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onToggleStep(step.id);
                          }}
                          className={`mt-0.5 p-1 rounded-lg transition-colors ${
                            isDone
                              ? 'bg-emerald-500 text-slate-950'
                              : 'bg-slate-200 dark:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
                          }`}
                          title={isDone ? 'Mark Incomplete' : 'Mark Done'}
                        >
                          <CheckCircle2 className="w-5 h-5" />
                        </button>

                        <div className="space-y-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="text-xs font-black text-purple-700 dark:text-purple-300">
                              STEP {String(idx + 1).padStart(2, '0')}
                            </span>
                            <span className="text-slate-400">•</span>
                            <span className="text-xs font-bold text-slate-900 dark:text-white">
                              {step.title}
                            </span>
                          </div>

                          {/* Menu Path Pill */}
                          <div className="inline-block font-mono text-[11px] px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-950 text-purple-600 dark:text-cyan-300 border border-slate-200 dark:border-slate-800">
                            {step.menuPath}
                          </div>
                        </div>
                      </div>

                      <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 flex-shrink-0">
                        {step.compatibility}
                      </span>
                    </div>

                    {/* Step Details Drawer */}
                    <div className="mt-4 pt-3 border-t border-slate-200/60 dark:border-slate-800/60 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                      <div className="space-y-1">
                        <span className="text-slate-500 font-medium">Exact Settings / Values:</span>
                        <p className="font-semibold text-slate-800 dark:text-slate-200 bg-white dark:bg-slate-950/60 p-2 rounded-xl border border-slate-200 dark:border-slate-800">
                          {step.settings}
                        </p>
                      </div>

                      <div className="space-y-1">
                        <span className="text-slate-500 font-medium">Expected Result:</span>
                        <p className="font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-500/5 p-2 rounded-xl border border-emerald-500/20">
                          {step.expectedResult}
                        </p>
                      </div>

                      {step.explanation && (
                        <div className="md:col-span-2 text-[11px] text-slate-500 dark:text-slate-400 italic">
                          💡 Note: {step.explanation}
                        </div>
                      )}
                    </div>

                  </div>
                );
              })}
            </div>

            {/* Quality Validation Checklist */}
            {workflow.qualityChecks && workflow.qualityChecks.length > 0 && (
              <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-950/70 border border-purple-500/20 space-y-3">
                <h4 className="text-xs font-black uppercase text-purple-700 dark:text-purple-300 flex items-center space-x-2">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Quality Assurance & Verification Checklist</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-700 dark:text-slate-300">
                  {workflow.qualityChecks.map((qc, i) => (
                    <label key={i} className="flex items-center space-x-2 p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                      <input type="checkbox" className="rounded text-purple-600 focus:ring-purple-500" />
                      <span>{qc}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}

          </div>
        )}

        {/* TAB 3: CUSTOM ACTION ORDER */}
        {activeTab === 'custom-order' && (
          <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-purple-900/40 shadow-xl space-y-6">
            
            <div className="space-y-2 pb-6 border-b border-slate-200 dark:border-slate-800">
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-300 border border-amber-500/30 text-xs font-bold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>GurucraftPro Studio Custom Automation</span>
              </div>
              <h3 className="text-2xl font-black text-slate-900 dark:text-white">
                Order Professionally Engineered Photoshop Action / Script
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed max-w-3xl">
                Have senior designer Annu Dhaneja and the GurucraftPro engineering team build a custom .ATN action set, JSX script, or UXP plugin tailored to your exact catalog batch requirements.
              </p>
            </div>

            {orderSubmittedSuccess ? (
              <div className="p-8 rounded-3xl bg-emerald-500/10 border border-emerald-500/30 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-500 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h4 className="text-xl font-black text-slate-900 dark:text-white">
                  Order Submitted Successfully!
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-300 max-w-md mx-auto">
                  We have received your custom action request. Our team will review your specifications and update your dashboard within a few hours.
                </p>
                <button
                  type="button"
                  onClick={() => setOrderSubmittedSuccess(false)}
                  className="px-6 py-2.5 rounded-xl bg-purple-600 text-white text-xs font-bold shadow-md hover:bg-purple-500"
                >
                  Submit Another Request
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmitCustomOrder} className="space-y-6">
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Your Full Name *</label>
                    <input
                      type="text"
                      required
                      value={orderForm.customerName}
                      onChange={(e) => setOrderForm({ ...orderForm, customerName: e.target.value })}
                      placeholder="e.g. Priyanshu Sharma"
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:border-purple-500"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Email Address *</label>
                    <input
                      type="email"
                      required
                      value={orderForm.customerEmail}
                      onChange={(e) => setOrderForm({ ...orderForm, customerEmail: e.target.value })}
                      placeholder="you@example.com"
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:border-purple-500"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Phone / WhatsApp *</label>
                    <input
                      type="tel"
                      required
                      value={orderForm.customerPhone}
                      onChange={(e) => setOrderForm({ ...orderForm, customerPhone: e.target.value })}
                      placeholder="+91 98765 43210"
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:border-purple-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Automation Deliverable Type</label>
                    <select
                      value={orderForm.orderType}
                      onChange={(e) => setOrderForm({ ...orderForm, orderType: e.target.value as any })}
                      className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:border-purple-500"
                    >
                      <option value="Simple Action">Simple Photoshop Action (.ATN)</option>
                      <option value="Advanced Action">Advanced Multi-Step Action Set (.ATN)</option>
                      <option value="Batch Automation">Batch Catalog Automation Script</option>
                      <option value="Photoshop Script">ExtendScript JSX Script</option>
                      <option value="UXP Plugin">Modern UXP Plugin</option>
                      <option value="Custom Workflow">End-to-End Hybrid Studio Workflow</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Priority & Turnaround</label>
                    <select
                      value={orderForm.priority}
                      onChange={(e) => setOrderForm({ ...orderForm, priority: e.target.value as any })}
                      className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:border-purple-500"
                    >
                      <option value="Normal">Normal (3-5 Days) - ₹1,499</option>
                      <option value="Urgent">Urgent (24-48 Hours) - ₹2,499</option>
                      <option value="Rush">Rush Same Day Delivery - ₹2,999</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Target Photoshop Version</label>
                    <input
                      type="text"
                      value={orderForm.photoshopVersion}
                      onChange={(e) => setOrderForm({ ...orderForm, photoshopVersion: e.target.value })}
                      placeholder="e.g. Photoshop 2024 / CC"
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:border-purple-500"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Custom Automation Specifications *</label>
                  <textarea
                    rows={4}
                    required
                    value={orderForm.description}
                    onChange={(e) => setOrderForm({ ...orderForm, description: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:border-purple-500 resize-none"
                  ></textarea>
                </div>

                {/* File Upload Box */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Upload Sample Raw Images or Reference Files (.PSD, .JPG, .PNG)
                  </label>
                  <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-purple-500 rounded-2xl p-6 text-center bg-slate-50/50 dark:bg-slate-950/40 cursor-pointer transition-colors relative">
                    <input
                      type="file"
                      multiple
                      onChange={handleFileUpload}
                      className="absolute inset-0 opacity-0 cursor-pointer"
                    />
                    <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                    <p className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      Drag and drop sample files here or click to browse
                    </p>
                    <p className="text-[10px] text-slate-500 mt-1">Supports PSD, JPG, PNG, TIFF, ZIP up to 50MB</p>
                  </div>

                  {orderFiles.length > 0 && (
                    <div className="flex flex-wrap gap-2 pt-2">
                      {orderFiles.map((file, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1.5 rounded-xl bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800 text-xs font-semibold flex items-center space-x-1.5"
                        >
                          <span>{file.name}</span>
                          <span className="text-[10px] text-slate-400">({Math.round(file.size / 1024)} KB)</span>
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-800">
                  <div className="text-xs text-slate-500 dark:text-slate-400">
                    Estimated Quote: <strong className="text-purple-600 dark:text-teal-400 font-black text-sm">
                      {orderForm.priority === 'Rush' ? '₹2,999' : orderForm.priority === 'Urgent' ? '₹2,499' : '₹1,499'}
                    </strong>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmittingOrder}
                    className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-purple-600 to-teal-400 hover:opacity-90 text-white font-black text-xs sm:text-sm flex items-center space-x-2 shadow-lg shadow-purple-900/20 disabled:opacity-50"
                  >
                    <Send className="w-4 h-4" />
                    <span>{isSubmittingOrder ? 'Submitting Order...' : 'Submit Custom Action Order'}</span>
                  </button>
                </div>

              </form>
            )}

          </div>
        )}

      </div>

    </div>
  );
};
