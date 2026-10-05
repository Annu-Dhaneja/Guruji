import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Upload,
  Layers,
  Sparkles,
  Sliders,
  Crop,
  Maximize2,
  Minimize2,
  Download,
  Trash2,
  RotateCw,
  FlipHorizontal,
  FlipVertical,
  CheckCircle2,
  AlertCircle,
  Clock,
  Play,
  Pause,
  XCircle,
  FileArchive,
  Eye,
  RefreshCw,
  FolderUp,
  Image as ImageIcon,
  Check,
  ChevronRight,
  ShieldCheck,
  Zap,
  Tag,
  Palette,
  Type,
  FileText,
  Info,
  SlidersHorizontal,
  ArrowRight,
  Lock,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import {
  ProcessedImageItem,
  ImagePreset,
  ImageProcessingSettings,
  ImagePlan,
  ImageProcessingJobRecord,
} from '../types';
import {
  ImageProcessingOptions,
  DEFAULT_PROCESSING_OPTIONS,
  loadImageFromFile,
  processSingleImage,
  createZipFromProcessedImages,
  triggerBrowserDownload,
  isAvifCanvasSupported,
  isWebpCanvasSupported,
} from '../utils/imageProcessor';

interface BulkImageStudioPageProps {
  onNavigate?: (page: string) => void;
}

export const BulkImageStudioPage: React.FC<BulkImageStudioPageProps> = ({ onNavigate }) => {
  const { user } = useAuth();

  // Workflow steps
  type StudioStep = 'upload' | 'configure' | 'preview' | 'process' | 'download' | 'history';
  const [currentStep, setCurrentStep] = useState<StudioStep>('upload');

  // File items queue
  const [items, setItems] = useState<ProcessedImageItem[]>([]);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);

  // Configuration options
  const [options, setOptions] = useState<ImageProcessingOptions>(DEFAULT_PROCESSING_OPTIONS);

  // Remote data from API
  const [settings, setSettings] = useState<ImageProcessingSettings | null>(null);
  const [presets, setPresets] = useState<ImagePreset[]>([]);
  const [plans, setPlans] = useState<ImagePlan[]>([]);
  const [historyJobs, setHistoryJobs] = useState<ImageProcessingJobRecord[]>([]);

  // Processing state
  const [isProcessing, setIsProcessing] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const isPausedRef = useRef(false);
  const isCancelledRef = useRef(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [overallProgress, setOverallProgress] = useState(0);

  // Drag & drop state
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const folderInputRef = useRef<HTMLInputElement>(null);

  // Split comparison preview modal
  const [previewItem, setPreviewItem] = useState<ProcessedImageItem | null>(null);
  const [splitSliderPos, setSplitSliderPos] = useState(50); // percentage
  const [previewZoom, setPreviewZoom] = useState(1);

  // Upgrade Plan modal
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);
  const [selectedPlanForCheckout, setSelectedPlanForCheckout] = useState<ImagePlan | null>(null);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [checkoutMessage, setCheckoutMessage] = useState('');

  // Status message
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Fetch initial API settings, presets, plans
  useEffect(() => {
    fetch('/api/image/settings')
      .then((r) => r.json())
      .then((d) => {
        if (d.settings) setSettings(d.settings);
      })
      .catch(console.error);

    fetch('/api/image/presets')
      .then((r) => r.json())
      .then((d) => {
        if (Array.isArray(d.presets)) setPresets(d.presets);
      })
      .catch(console.error);

    fetch('/api/image/plans')
      .then((r) => r.json())
      .then((d) => {
        if (Array.isArray(d.plans)) setPlans(d.plans);
      })
      .catch(console.error);
  }, []);

  // Fetch history when user changes or step is history
  const fetchHistory = useCallback(() => {
    const url = user?.email
      ? `/api/image/history?email=${encodeURIComponent(user.email)}`
      : '/api/image/history';
    fetch(url)
      .then((r) => r.json())
      .then((d) => {
        if (Array.isArray(d.history)) setHistoryJobs(d.history);
      })
      .catch(console.error);
  }, [user]);

  useEffect(() => {
    if (currentStep === 'history') {
      fetchHistory();
    }
  }, [currentStep, fetchHistory]);

  // Handle Clipboard Paste (Ctrl+V / Cmd+V)
  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      const clipboardItems = e.clipboardData?.items;
      if (!clipboardItems) return;

      const pastedFiles: File[] = [];
      for (let i = 0; i < clipboardItems.length; i++) {
        const item = clipboardItems[i];
        if (item.type.indexOf('image') !== -1) {
          const file = item.getAsFile();
          if (file) pastedFiles.push(file);
        }
      }
      if (pastedFiles.length > 0) {
        addFilesToQueue(pastedFiles);
        showToast(`Pasted ${pastedFiles.length} image(s) from clipboard`);
      }
    };

    window.addEventListener('paste', handlePaste);
    return () => window.removeEventListener('paste', handlePaste);
  }, []);

  // Helper to add files to processing queue
  const addFilesToQueue = async (files: FileList | File[]) => {
    const fileArray = Array.from(files);
    const validImageFiles = fileArray.filter((f) => {
      const type = f.type.toLowerCase();
      const ext = f.name.split('.').pop()?.toLowerCase() || '';
      return (
        type.startsWith('image/') ||
        ['jpg', 'jpeg', 'png', 'webp', 'gif', 'bmp', 'svg', 'tiff', 'heic'].includes(ext)
      );
    });

    if (validImageFiles.length === 0) {
      showToast('No supported image files found.');
      return;
    }

    const maxFilesLimit = user
      ? settings?.limits.userMaxFilesPerJob || 150
      : settings?.limits.guestMaxFilesPerJob || 30;

    if (items.length + validImageFiles.length > maxFilesLimit) {
      setIsUpgradeModalOpen(true);
      showToast(`Batch limit reached (${maxFilesLimit} files). Upgrade to process more.`);
      return;
    }

    const newItems: ProcessedImageItem[] = [];

    for (const file of validImageFiles) {
      const id = `img-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;
      try {
        const { width, height, format, previewUrl } = await loadImageFromFile(file);
        newItems.push({
          id,
          file,
          previewUrl,
          name: file.name,
          originalWidth: width,
          originalHeight: height,
          originalSizeBytes: file.size,
          originalFormat: format,
          status: 'queued',
          progressPercent: 0,
        });
      } catch (err: any) {
        console.warn(`Failed to inspect file ${file.name}:`, err);
      }
    }

    setItems((prev) => [...prev, ...newItems]);
    if (!selectedItemId && newItems.length > 0) {
      setSelectedItemId(newItems[0].id);
    }
  };

  // Drag and Drop handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      addFilesToQueue(e.dataTransfer.files);
    }
  };

  // Queue item controls
  const handleRemoveItem = (id: string) => {
    setItems((prev) => {
      const filtered = prev.filter((i) => i.id !== id);
      if (selectedItemId === id) {
        setSelectedItemId(filtered[0]?.id || null);
      }
      return filtered;
    });
  };

  const handleClearAll = () => {
    if (items.length > 0 && window.confirm('Remove all images from studio?')) {
      items.forEach((i) => {
        if (i.previewUrl) URL.revokeObjectURL(i.previewUrl);
        if (i.outputUrl) URL.revokeObjectURL(i.outputUrl);
      });
      setItems([]);
      setSelectedItemId(null);
      setCurrentStep('upload');
    }
  };

  // Preset Selection
  const applyPreset = (preset: ImagePreset) => {
    setOptions((prev) => ({
      ...prev,
      presetId: preset.id,
      targetWidth: preset.width,
      targetHeight: preset.height,
      resizeMode: preset.resizeMode,
      cropAspectRatio: preset.aspectRatio,
      outputFormat: preset.outputFormat,
      quality: preset.quality,
      compressionLevel: preset.compressionLevel,
      customColor: preset.backgroundColor || '#FFFFFF',
    }));
    showToast(`Preset "${preset.name}" applied`);
  };

  // Core Processing Loop
  const startBatchProcessing = async () => {
    if (items.length === 0) {
      showToast('Please add images before starting processing.');
      return;
    }

    setIsProcessing(true);
    setIsPaused(false);
    isPausedRef.current = false;
    isCancelledRef.current = false;
    setCurrentStep('process');

    const updated = [...items];
    let completedCount = 0;
    let failedCount = 0;

    for (let i = 0; i < updated.length; i++) {
      if (isCancelledRef.current) break;

      // Handle pause loop
      while (isPausedRef.current) {
        await new Promise((r) => setTimeout(r, 200));
        if (isCancelledRef.current) break;
      }

      setCurrentIndex(i);
      updated[i].status = 'processing';
      updated[i].progressPercent = 30;
      setItems([...updated]);

      try {
        const result = await processSingleImage(updated[i], i, options);
        updated[i].status = 'completed';
        updated[i].progressPercent = 100;
        updated[i].outputBlob = result.blob;
        updated[i].outputUrl = result.outputUrl;
        updated[i].outputWidth = result.outputWidth;
        updated[i].outputHeight = result.outputHeight;
        updated[i].outputSizeBytes = result.outputSizeBytes;
        updated[i].outputFormat = result.outputFormat;
        updated[i].outputFileName = result.outputFileName;
        updated[i].savedBytes = result.savedBytes;
        updated[i].savedPercentage = result.savedPercentage;
        completedCount++;
      } catch (err: any) {
        console.error(`Error processing ${updated[i].name}:`, err);
        updated[i].status = 'failed';
        updated[i].error = err.message || 'Processing error';
        failedCount++;
      }

      const progress = Math.round(((i + 1) / updated.length) * 100);
      setOverallProgress(progress);
      setItems([...updated]);

      // Small yield to let browser repaint UI smoothly
      await new Promise((r) => setTimeout(r, 20));
    }

    setIsProcessing(false);

    // Calculate aggregated job stats
    const totalOrigSize = updated.reduce((acc, it) => acc + it.originalSizeBytes, 0);
    const totalProcSize = updated.reduce((acc, it) => acc + (it.outputSizeBytes || 0), 0);
    const savedBytes = Math.max(0, totalOrigSize - totalProcSize);
    const savedPercentage = totalOrigSize > 0 ? Math.round((savedBytes / totalOrigSize) * 100) : 0;

    // Send history record to server
    try {
      await fetch('/api/image/history', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user?.id,
          userEmail: user?.email,
          isGuest: !user,
          totalImages: updated.length,
          successfulImages: completedCount,
          failedImages: failedCount,
          originalTotalSizeBytes: totalOrigSize,
          processedTotalSizeBytes: totalProcSize,
          savedBytes,
          savedPercentage,
          outputFormat: options.outputFormat,
          settingsSummary: `${options.resizeMode} ${options.targetWidth}x${options.targetHeight} (${options.outputFormat.toUpperCase()})`,
          fileNames: updated.map((i) => i.outputFileName || i.name),
          status: failedCount === updated.length ? 'failed' : 'completed',
        }),
      });
    } catch (e) {
      console.error('Failed to log job history:', e);
    }

    if (!isCancelledRef.current) {
      setCurrentStep('download');
      showToast(`Batch completed: ${completedCount} images optimized!`);
    }
  };

  const handlePauseResume = () => {
    const nextState = !isPaused;
    setIsPaused(nextState);
    isPausedRef.current = nextState;
  };

  const handleCancelProcessing = () => {
    isCancelledRef.current = true;
    setIsProcessing(false);
    showToast('Batch processing cancelled.');
  };

  const handleRetryFailed = () => {
    setItems((prev) =>
      prev.map((it) => (it.status === 'failed' ? { ...it, status: 'queued', error: undefined } : it))
    );
    startBatchProcessing();
  };

  // Download All as ZIP
  const [isZipping, setIsZipping] = useState(false);
  const [zipProgress, setZipProgress] = useState(0);

  const handleDownloadAllZip = async () => {
    const completedItems = items.filter((i) => i.status === 'completed' && i.outputBlob);
    if (completedItems.length === 0) {
      showToast('No completed images available to download.');
      return;
    }

    setIsZipping(true);
    setZipProgress(0);
    try {
      const zipBlob = await createZipFromProcessedImages(
        completedItems,
        `GurucraftPro_Images_${Date.now()}.zip`,
        (pct) => setZipProgress(pct)
      );
      triggerBrowserDownload(zipBlob, `GurucraftPro_Batch_${completedItems.length}_Images.zip`);
      showToast('ZIP file generated and downloaded successfully!');
    } catch (err: any) {
      showToast(`ZIP generation failed: ${err.message}`);
    } finally {
      setIsZipping(false);
    }
  };

  // Download single image
  const handleDownloadSingle = (item: ProcessedImageItem) => {
    if (item.outputBlob) {
      triggerBrowserDownload(item.outputBlob, item.outputFileName || item.name);
    }
  };

  // Plan Checkout Integration
  const handleInitiatePlanCheckout = async (plan: ImagePlan) => {
    setSelectedPlanForCheckout(plan);
    setCheckoutLoading(true);
    setCheckoutMessage('');

    try {
      const res = await fetch('/api/image/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          planId: plan.id,
          customerName: user?.name || 'Gurucraft Guest',
          customerEmail: user?.email || 'customer@gurucraftpro.com',
          customerPhone: '',
        }),
      });
      const data = await res.json();

      if (data.isFree) {
        showToast('Starter Free Plan active!');
        setIsUpgradeModalOpen(false);
        return;
      }

      if (data.razorpayOrderId) {
        // Open Razorpay Standard Checkout
        const optionsRzp = {
          key: data.keyId,
          amount: data.amountPaise,
          currency: 'INR',
          name: 'GurucraftPro',
          description: `Bulk Image Studio - ${plan.name}`,
          order_id: data.razorpayOrderId,
          handler: async function (response: any) {
            try {
              const verifyRes = await fetch('/api/image/verify-payment', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  orderId: data.orderId,
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_signature: response.razorpay_signature,
                  planId: plan.id,
                  userEmail: user?.email,
                }),
              });
              const verifyData = await verifyRes.json();
              if (verifyData.success) {
                showToast(`Payment successful! ${plan.name} credits activated.`);
                setIsUpgradeModalOpen(false);
              } else {
                setCheckoutMessage(verifyData.error || 'Payment verification failed.');
              }
            } catch (err: any) {
              setCheckoutMessage(err.message || 'Payment verification error.');
            }
          },
          prefill: {
            name: user?.name || 'Customer',
            email: user?.email || 'customer@gurucraftpro.com',
          },
          theme: {
            color: '#0799A6',
          },
        };

        if ((window as any).Razorpay) {
          const rzp = new (window as any).Razorpay(optionsRzp);
          rzp.open();
        } else {
          // If script not loaded, inject it
          const script = document.createElement('script');
          script.src = 'https://checkout.razorpay.com/v1/checkout.js';
          script.onload = () => {
            const rzp = new (window as any).Razorpay(optionsRzp);
            rzp.open();
          };
          document.body.appendChild(script);
        }
      }
    } catch (err: any) {
      setCheckoutMessage(err.message || 'Failed to start payment checkout');
    } finally {
      setCheckoutLoading(false);
    }
  };

  // Stats calculation
  const totalOriginalMB = (items.reduce((s, i) => s + i.originalSizeBytes, 0) / (1024 * 1024)).toFixed(2);
  const completedItems = items.filter((i) => i.status === 'completed');
  const totalOptimizedMB = (completedItems.reduce((s, i) => s + (i.outputSizeBytes || 0), 0) / (1024 * 1024)).toFixed(2);
  const totalSavedMB = (Number(totalOriginalMB) - Number(totalOptimizedMB)).toFixed(2);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fadeIn">
      {/* Toast alert */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#102A36] text-white border border-[#0799A6] shadow-xl px-4 py-3 rounded-2xl flex items-center gap-2 text-xs animate-bounce font-medium">
          <Sparkles className="w-4 h-4 text-[#25B4BD]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Hero Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-[#DCE7E7] dark:border-[#2A3C40]">
        <div>
          <div className="flex items-center space-x-2 text-xs font-semibold text-[#0799A6] dark:text-[#25B4BD] mb-1">
            <Layers className="w-4 h-4" />
            <span className="uppercase tracking-wider">GurucraftPro Studio Suite</span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#0799A6]/20 border border-[#0799A6]/30">
              HIGH PRECISION CANVAS
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#102A36] dark:text-white">
            Bulk Image Processing & Resizer Studio
          </h1>
          <p className="text-xs sm:text-sm text-[#52636A] dark:text-[#A0B0B3] mt-1 max-w-2xl leading-relaxed">
            Batch resize, crop, compress, convert formats, watermark, and clean EXIF metadata for hundreds of photos
            simultaneously. Runs 100% privately in your browser with zero image uploads.
          </p>
        </div>

        {/* Action badges */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => setIsUpgradeModalOpen(true)}
            className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-amber-500/20 to-orange-500/20 hover:from-amber-500/30 hover:to-orange-500/30 border border-amber-500/30 text-amber-500 dark:text-amber-300 text-xs font-bold transition flex items-center gap-1.5 shadow-xs"
          >
            <Zap className="w-3.5 h-3.5" />
            <span>Credit Plans (From ₹29)</span>
          </button>
          <button
            onClick={() => setCurrentStep('history')}
            className={`px-3.5 py-2 rounded-xl border text-xs font-semibold transition flex items-center gap-1.5 ${
              currentStep === 'history'
                ? 'bg-[#0799A6] text-white border-[#0799A6]'
                : 'bg-white dark:bg-[#111A1E] border-[#DCE7E7] dark:border-[#2A3C40] text-[#52636A] dark:text-slate-300 hover:text-white'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>History</span>
          </button>
        </div>
      </div>

      {/* Workflow Navigation Bar */}
      <div className="flex items-center justify-between p-2 rounded-2xl bg-slate-100 dark:bg-[#111A1E] border border-[#DCE7E7] dark:border-[#2A3C40] overflow-x-auto text-xs font-semibold">
        {[
          { id: 'upload', label: '1. Upload Files', icon: Upload, count: items.length },
          { id: 'configure', label: '2. Configure Sizing', icon: Sliders },
          { id: 'preview', label: '3. Inspect & Split View', icon: Eye },
          { id: 'process', label: '4. Batch Queue', icon: Play },
          { id: 'download', label: '5. Export & ZIP', icon: Download, count: completedItems.length },
        ].map((tab, idx) => {
          const Icon = tab.icon;
          const isActive = currentStep === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setCurrentStep(tab.id as StudioStep)}
              className={`px-3.5 py-2 rounded-xl transition flex items-center space-x-2 shrink-0 ${
                isActive
                  ? 'bg-[#0799A6] text-white shadow-xs'
                  : 'text-[#52636A] dark:text-slate-400 hover:text-[#102A36] dark:hover:text-white'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
              {typeof tab.count === 'number' && tab.count > 0 && (
                <span
                  className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                    isActive ? 'bg-white/20 text-white' : 'bg-slate-200 dark:bg-slate-800 text-slate-300'
                  }`}
                >
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Main Studio Viewport */}
      {currentStep !== 'history' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* ========================================================================= */}
          {/* LEFT 7 COLS: UPLOADER & QUEUE TABLE */}
          {/* ========================================================================= */}
          <div className="lg:col-span-7 space-y-6">
            {/* Professional Drag & Drop Upload Zone */}
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`relative cursor-pointer rounded-3xl border-2 border-dashed p-8 text-center transition-all duration-200 flex flex-col items-center justify-center min-h-[220px] ${
                isDragging
                  ? 'border-[#0799A6] bg-[#0799A6]/10 scale-[1.01]'
                  : 'border-[#DCE7E7] dark:border-[#2A3C40] hover:border-[#0799A6] bg-white dark:bg-[#111A1E]/80 hover:bg-slate-50 dark:hover:bg-[#152126]'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*,.heic,.heif,.tiff,.bmp,.svg"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files) addFilesToQueue(e.target.files);
                }}
              />
              <input
                ref={folderInputRef}
                type="file"
                // @ts-ignore
                webkitdirectory="true"
                // @ts-ignore
                directory="true"
                multiple
                className="hidden"
                onChange={(e) => {
                  if (e.target.files) addFilesToQueue(e.target.files);
                }}
              />

              <div className="w-14 h-14 rounded-2xl bg-[#0799A6]/10 dark:bg-[#25B4BD]/10 border border-[#0799A6]/30 flex items-center justify-center text-[#0799A6] dark:text-[#25B4BD] mb-3 group-hover:scale-110 transition-transform">
                <Upload className="w-6 h-6" />
              </div>

              <h3 className="text-base font-bold text-[#102A36] dark:text-white">
                Drag & Drop images here, or browse
              </h3>
              <p className="text-xs text-[#52636A] dark:text-[#819396] mt-1 max-w-sm">
                Supports JPG, PNG, WebP, GIF, BMP, TIFF, SVG, and HEIC. You can also paste from clipboard (Ctrl+V).
              </p>

              <div className="flex items-center gap-2 mt-4" onClick={(e) => e.stopPropagation()}>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-4 py-2 rounded-xl bg-[#0799A6] hover:bg-[#087581] text-white text-xs font-bold transition shadow-xs flex items-center gap-1.5"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Select Files</span>
                </button>
                <button
                  type="button"
                  onClick={() => folderInputRef.current?.click()}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-[#102A36] dark:text-slate-200 text-xs font-semibold transition flex items-center gap-1.5"
                >
                  <FolderUp className="w-3.5 h-3.5" />
                  <span>Select Folder</span>
                </button>
              </div>
            </div>

            {/* Queue Summary & Control Bar */}
            {items.length > 0 && (
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-white dark:bg-[#111A1E] border border-[#DCE7E7] dark:border-[#2A3C40] text-xs">
                <div className="flex items-center space-x-4">
                  <div>
                    <span className="text-[#52636A] dark:text-slate-400">Total Images:</span>
                    <strong className="text-[#102A36] dark:text-white ml-1.5">{items.length}</strong>
                  </div>
                  <div>
                    <span className="text-[#52636A] dark:text-slate-400">Total Size:</span>
                    <strong className="text-[#102A36] dark:text-white ml-1.5">{totalOriginalMB} MB</strong>
                  </div>
                  {completedItems.length > 0 && (
                    <div>
                      <span className="text-emerald-500 font-semibold">Saved:</span>
                      <strong className="text-emerald-400 ml-1.5">{totalSavedMB} MB</strong>
                    </div>
                  )}
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={handleClearAll}
                    className="p-1.5 text-rose-500 hover:text-rose-600 dark:text-rose-400 transition text-xs flex items-center gap-1"
                    title="Clear All"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Clear All</span>
                  </button>
                  <button
                    onClick={startBatchProcessing}
                    disabled={isProcessing}
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold transition flex items-center gap-1.5 shadow-xs"
                  >
                    <Play className="w-3.5 h-3.5" />
                    <span>Start Processing ({items.length})</span>
                  </button>
                </div>
              </div>
            )}

            {/* Files List / Grid Cards */}
            {items.length > 0 && (
              <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
                {items.map((item, idx) => {
                  const isSelected = selectedItemId === item.id;
                  return (
                    <div
                      key={item.id}
                      onClick={() => setSelectedItemId(item.id)}
                      className={`p-3 rounded-2xl border transition flex items-center justify-between gap-3 cursor-pointer ${
                        isSelected
                          ? 'border-[#0799A6] bg-[#0799A6]/5 dark:bg-[#0799A6]/10'
                          : 'border-[#DCE7E7] dark:border-[#2A3C40] bg-white dark:bg-[#111A1E] hover:border-slate-400'
                      }`}
                    >
                      <div className="flex items-center space-x-3 min-w-0">
                        {/* Thumbnail */}
                        <div className="w-12 h-12 rounded-xl overflow-hidden bg-slate-900 border border-slate-700 shrink-0 flex items-center justify-center relative">
                          <img
                            src={item.outputUrl || item.previewUrl}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        </div>

                        {/* File Details */}
                        <div className="min-w-0">
                          <div className="text-xs font-bold text-[#102A36] dark:text-white truncate">
                            {idx + 1}. {item.outputFileName || item.name}
                          </div>
                          <div className="text-[11px] text-[#52636A] dark:text-slate-400 flex items-center space-x-2 mt-0.5">
                            <span>
                              {item.originalWidth} × {item.originalHeight} px
                            </span>
                            <span>•</span>
                            <span>{(item.originalSizeBytes / (1024 * 1024)).toFixed(2)} MB</span>
                            <span>•</span>
                            <span className="uppercase font-semibold">{item.originalFormat}</span>
                          </div>
                        </div>
                      </div>

                      {/* Right Status & Actions */}
                      <div className="flex items-center space-x-3 shrink-0">
                        {/* Status Badges */}
                        {item.status === 'queued' && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-200 dark:bg-slate-800 text-slate-500">
                            Queued
                          </span>
                        )}
                        {item.status === 'processing' && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#0799A6]/20 text-[#0799A6] dark:text-[#25B4BD] animate-pulse">
                            Processing...
                          </span>
                        )}
                        {item.status === 'completed' && (
                          <div className="text-right">
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                              ✓ Saved {item.savedPercentage}%
                            </span>
                            <div className="text-[10px] text-slate-400 mt-0.5">
                              {( (item.outputSizeBytes || 0) / (1024 * 1024) ).toFixed(2)} MB
                            </div>
                          </div>
                        )}
                        {item.status === 'failed' && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/10 text-rose-400 border border-rose-500/20">
                            Failed
                          </span>
                        )}

                        {/* Single Actions */}
                        {item.status === 'completed' && item.outputBlob && (
                          <>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setPreviewItem(item);
                              }}
                              className="p-1.5 rounded-lg border border-slate-700 text-slate-300 hover:text-white"
                              title="Compare Before & After"
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDownloadSingle(item);
                              }}
                              className="p-1.5 rounded-lg bg-[#0799A6] text-white hover:bg-[#087581]"
                              title="Download Image"
                            >
                              <Download className="w-3.5 h-3.5" />
                            </button>
                          </>
                        )}

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemoveItem(item.id);
                          }}
                          className="p-1.5 text-slate-400 hover:text-rose-500 transition"
                          title="Remove file"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* ========================================================================= */}
          {/* RIGHT 5 COLS: COMPREHENSIVE CONFIGURATION PANEL */}
          {/* ========================================================================= */}
          <div className="lg:col-span-5 space-y-6 bg-white dark:bg-[#111A1E] border border-[#DCE7E7] dark:border-[#2A3C40] rounded-3xl p-6 shadow-sm">
            <div className="flex items-center justify-between pb-3 border-b border-[#DCE7E7] dark:border-[#2A3C40]">
              <h3 className="text-sm font-bold text-[#102A36] dark:text-white flex items-center gap-2">
                <Sliders className="w-4 h-4 text-[#0799A6] dark:text-[#25B4BD]" />
                <span>Studio Configuration</span>
              </h3>
              <span className="text-[11px] text-[#52636A] dark:text-slate-400">
                Applies to all {items.length} images
              </span>
            </div>

            {/* Sizing Presets Slider */}
            <div>
              <label className="block text-xs font-semibold text-[#102A36] dark:text-slate-300 mb-2">
                Standard Presets (Instagram, E-Com, Web)
              </label>
              <div className="grid grid-cols-2 gap-2 max-h-36 overflow-y-auto pr-1">
                {presets.map((p) => {
                  const isSelected = options.presetId === p.id;
                  return (
                    <button
                      key={p.id}
                      onClick={() => applyPreset(p)}
                      className={`p-2 rounded-xl text-left border transition text-xs ${
                        isSelected
                          ? 'border-[#0799A6] bg-[#0799A6]/10 text-[#0799A6] dark:text-[#25B4BD] font-bold'
                          : 'border-[#DCE7E7] dark:border-[#2A3C40] bg-slate-50 dark:bg-slate-900/60 text-[#52636A] dark:text-slate-300 hover:border-slate-400'
                      }`}
                    >
                      <div className="truncate font-semibold">{p.name}</div>
                      <div className="text-[10px] text-slate-400 mt-0.5">
                        {p.width} × {p.height} ({p.aspectRatio})
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Custom Sizing Inputs */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/80 border border-[#DCE7E7] dark:border-slate-800 space-y-3 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-[#102A36] dark:text-white">Custom Dimensions</span>
                <div className="flex items-center space-x-1">
                  <button
                    onClick={() => setOptions({ ...options, unit: 'pixels' })}
                    className={`px-2 py-0.5 rounded-lg text-[10px] font-bold ${
                      options.unit === 'pixels'
                        ? 'bg-[#0799A6] text-white'
                        : 'bg-slate-200 dark:bg-slate-800 text-slate-400'
                    }`}
                  >
                    Pixels
                  </button>
                  <button
                    onClick={() => setOptions({ ...options, unit: 'percentage' })}
                    className={`px-2 py-0.5 rounded-lg text-[10px] font-bold ${
                      options.unit === 'percentage'
                        ? 'bg-[#0799A6] text-white'
                        : 'bg-slate-200 dark:bg-slate-800 text-slate-400'
                    }`}
                  >
                    Percentage %
                  </button>
                </div>
              </div>

              {options.unit === 'pixels' ? (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] text-slate-500 dark:text-slate-400 mb-1">Target Width</label>
                    <input
                      type="number"
                      value={options.targetWidth}
                      onChange={(e) => setOptions({ ...options, targetWidth: Number(e.target.value) })}
                      className="w-full px-3 py-1.5 rounded-xl bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-[#102A36] dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-500 dark:text-slate-400 mb-1">Target Height</label>
                    <input
                      type="number"
                      value={options.targetHeight}
                      onChange={(e) => setOptions({ ...options, targetHeight: Number(e.target.value) })}
                      className="w-full px-3 py-1.5 rounded-xl bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-[#102A36] dark:text-white"
                    />
                  </div>
                </div>
              ) : (
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-[11px] text-slate-400">Scale Factor</label>
                    <span className="font-bold text-[#0799A6] dark:text-[#25B4BD]">{options.percentageScale}%</span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="200"
                    value={options.percentageScale}
                    onChange={(e) => setOptions({ ...options, percentageScale: Number(e.target.value) })}
                    className="w-full accent-[#0799A6]"
                  />
                </div>
              )}

              {/* Resize Mode & Fit Options */}
              <div className="grid grid-cols-2 gap-3 pt-1">
                <div>
                  <label className="block text-[11px] text-slate-500 dark:text-slate-400 mb-1">Resize Fit</label>
                  <select
                    value={options.resizeMode}
                    onChange={(e) => setOptions({ ...options, resizeMode: e.target.value as any })}
                    className="w-full px-2 py-1.5 rounded-xl bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-[#102A36] dark:text-white text-xs"
                  >
                    <option value="none">Original Scale</option>
                    <option value="fit">Fit (Contain)</option>
                    <option value="fill">Fill (Cover)</option>
                    <option value="exact">Exact (Stretch)</option>
                    <option value="max">Max Bounds</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] text-slate-500 dark:text-slate-400 mb-1">Crop Ratio</label>
                  <select
                    value={options.cropAspectRatio}
                    onChange={(e) =>
                      setOptions({
                        ...options,
                        cropMode: e.target.value === 'none' ? 'none' : 'fixed-ratio',
                        cropAspectRatio: e.target.value,
                      })
                    }
                    className="w-full px-2 py-1.5 rounded-xl bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-[#102A36] dark:text-white text-xs"
                  >
                    <option value="none">No Crop</option>
                    <option value="1:1">1:1 Square</option>
                    <option value="4:5">4:5 Vertical Post</option>
                    <option value="9:16">9:16 Reel / Story</option>
                    <option value="16:9">16:9 Landscape / YT</option>
                    <option value="3:2">3:2 Classic Photo</option>
                    <option value="4:3">4:3 Standard</option>
                  </select>
                </div>
              </div>

              {/* Background Color Picker */}
              <div>
                <label className="block text-[11px] text-slate-500 dark:text-slate-400 mb-1">Canvas Background</label>
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { id: 'white', label: 'White', color: '#FFFFFF' },
                    { id: 'black', label: 'Black', color: '#000000' },
                    { id: 'transparent', label: 'Alpha', color: 'transparent' },
                    { id: 'custom', label: 'Custom', color: options.customColor },
                  ].map((bg) => (
                    <button
                      key={bg.id}
                      onClick={() => setOptions({ ...options, backgroundType: bg.id as any })}
                      className={`py-1 rounded-xl text-center border text-[11px] font-semibold transition ${
                        options.backgroundType === bg.id
                          ? 'border-[#0799A6] text-[#0799A6] dark:text-[#25B4BD] bg-[#0799A6]/10'
                          : 'border-slate-300 dark:border-slate-700 text-slate-400'
                      }`}
                    >
                      {bg.label}
                    </button>
                  ))}
                </div>
                {options.backgroundType === 'custom' && (
                  <div className="flex items-center gap-2 mt-2">
                    <input
                      type="color"
                      value={options.customColor}
                      onChange={(e) => setOptions({ ...options, customColor: e.target.value })}
                      className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border-0"
                    />
                    <input
                      type="text"
                      value={options.customColor}
                      onChange={(e) => setOptions({ ...options, customColor: e.target.value })}
                      className="px-2 py-1 rounded-lg bg-white dark:bg-slate-950 border border-slate-700 text-xs text-white uppercase font-mono w-24"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Quality & Format Conversion */}
            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-[#102A36] dark:text-white">Format & Quality</span>
                <span className="text-[11px] text-[#0799A6] dark:text-[#25B4BD] font-bold">
                  Target: {options.outputFormat.toUpperCase()} ({options.quality}%)
                </span>
              </div>

              <div className="grid grid-cols-4 gap-2">
                {['webp', 'jpg', 'png', 'avif'].map((fmt) => (
                  <button
                    key={fmt}
                    onClick={() => setOptions({ ...options, outputFormat: fmt as any })}
                    className={`py-2 rounded-xl text-center border text-xs font-bold uppercase transition ${
                      options.outputFormat === fmt
                        ? 'border-[#0799A6] bg-[#0799A6] text-white'
                        : 'border-[#DCE7E7] dark:border-[#2A3C40] text-slate-400 hover:text-white'
                    }`}
                  >
                    {fmt}
                  </button>
                ))}
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-[11px] text-slate-500 dark:text-slate-400">Quality Compression Level</label>
                  <span className="font-bold text-[#102A36] dark:text-white">{options.quality}%</span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="100"
                  value={options.quality}
                  onChange={(e) => setOptions({ ...options, quality: Number(e.target.value) })}
                  className="w-full accent-[#0799A6]"
                />
                <div className="flex items-center justify-between text-[10px] text-slate-400 mt-0.5">
                  <span>Small File (65%)</span>
                  <span>Balanced (85%)</span>
                  <span>Lossless (100%)</span>
                </div>
              </div>
            </div>

            {/* Transform: Rotate & Flip */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-[#DCE7E7] dark:border-slate-800 text-xs">
              <label className="block font-bold text-[#102A36] dark:text-white mb-2">Transform & Orientation</label>
              <div className="flex items-center justify-between gap-2">
                <button
                  onClick={() =>
                    setOptions({
                      ...options,
                      rotation: ((options.rotation + 90) % 360) as any,
                    })
                  }
                  className="flex-1 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-300 hover:text-white flex items-center justify-center gap-1.5"
                >
                  <RotateCw className="w-3.5 h-3.5" />
                  <span>Rotate {options.rotation ? `${options.rotation}°` : '90°'}</span>
                </button>
                <button
                  onClick={() => setOptions({ ...options, flipHorizontal: !options.flipHorizontal })}
                  className={`flex-1 py-1.5 rounded-xl border transition flex items-center justify-center gap-1.5 ${
                    options.flipHorizontal
                      ? 'border-[#0799A6] text-[#0799A6] dark:text-[#25B4BD] bg-[#0799A6]/10'
                      : 'border-slate-300 dark:border-slate-700 text-slate-400'
                  }`}
                >
                  <FlipHorizontal className="w-3.5 h-3.5" />
                  <span>Flip H</span>
                </button>
                <button
                  onClick={() => setOptions({ ...options, flipVertical: !options.flipVertical })}
                  className={`flex-1 py-1.5 rounded-xl border transition flex items-center justify-center gap-1.5 ${
                    options.flipVertical
                      ? 'border-[#0799A6] text-[#0799A6] dark:text-[#25B4BD] bg-[#0799A6]/10'
                      : 'border-slate-300 dark:border-slate-700 text-slate-400'
                  }`}
                >
                  <FlipVertical className="w-3.5 h-3.5" />
                  <span>Flip V</span>
                </button>
              </div>
            </div>

            {/* Watermark Section */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-[#DCE7E7] dark:border-slate-800 text-xs space-y-3">
              <div className="flex items-center justify-between">
                <label className="font-bold text-[#102A36] dark:text-white flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-[#0799A6] dark:text-[#25B4BD]" />
                  <span>Watermark Stamp</span>
                </label>
                <input
                  type="checkbox"
                  checked={options.watermarkEnabled}
                  onChange={(e) => setOptions({ ...options, watermarkEnabled: e.target.checked })}
                  className="rounded border-slate-700 text-[#0799A6] focus:ring-[#0799A6]"
                />
              </div>

              {options.watermarkEnabled && (
                <div className="space-y-2 pt-2 border-t border-slate-800">
                  <input
                    type="text"
                    value={options.watermarkText}
                    onChange={(e) => setOptions({ ...options, watermarkText: e.target.value })}
                    placeholder="Enter watermark text"
                    className="w-full px-3 py-1.5 rounded-xl bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-[#102A36] dark:text-white"
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <select
                      value={options.watermarkPosition}
                      onChange={(e) => setOptions({ ...options, watermarkPosition: e.target.value as any })}
                      className="px-2 py-1.5 rounded-xl bg-white dark:bg-slate-950 border border-slate-700 text-slate-300"
                    >
                      <option value="bottom-right">Bottom Right</option>
                      <option value="bottom-left">Bottom Left</option>
                      <option value="center">Center</option>
                      <option value="top-right">Top Right</option>
                      <option value="top-left">Top Left</option>
                    </select>
                    <input
                      type="color"
                      value={options.watermarkColor}
                      onChange={(e) => setOptions({ ...options, watermarkColor: e.target.value })}
                      className="w-full h-8 rounded-xl cursor-pointer bg-transparent border border-slate-700"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Filename Management Rules */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-[#DCE7E7] dark:border-slate-800 text-xs space-y-3">
              <label className="font-bold text-[#102A36] dark:text-white block">Filename Rules</label>
              <div className="grid grid-cols-2 gap-2">
                <select
                  value={options.namingRule}
                  onChange={(e) => setOptions({ ...options, namingRule: e.target.value as any })}
                  className="px-2 py-1.5 rounded-xl bg-white dark:bg-slate-950 border border-slate-700 text-slate-300"
                >
                  <option value="original">Original</option>
                  <option value="prefix">Prefix</option>
                  <option value="suffix">Suffix</option>
                  <option value="sequential">Sequential (_001)</option>
                </select>
                <select
                  value={options.replaceSpaces}
                  onChange={(e) => setOptions({ ...options, replaceSpaces: e.target.value as any })}
                  className="px-2 py-1.5 rounded-xl bg-white dark:bg-slate-950 border border-slate-700 text-slate-300"
                >
                  <option value="dash">Clean Space (-)</option>
                  <option value="underscore">Clean Space (_)</option>
                  <option value="keep">Keep Space</option>
                </select>
              </div>
            </div>

            {/* Action CTA */}
            <button
              onClick={startBatchProcessing}
              disabled={isProcessing || items.length === 0}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#0799A6] to-[#087581] hover:from-[#087581] hover:to-[#0799A6] text-white font-extrabold text-sm transition shadow-lg flex items-center justify-center space-x-2"
            >
              <Zap className="w-4 h-4" />
              <span>Process All {items.length} Images</span>
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* STEP 4 / 5: PROCESSING QUEUE MONITOR & DOWNLOAD CENTER */}
      {/* ========================================================================= */}
      {currentStep === 'process' && (
        <div className="bg-white dark:bg-[#111A1E] border border-[#DCE7E7] dark:border-[#2A3C40] rounded-3xl p-8 text-center space-y-6 max-w-2xl mx-auto shadow-sm">
          <div className="w-16 h-16 rounded-full bg-[#0799A6]/20 border border-[#0799A6]/40 flex items-center justify-center text-[#25B4BD] mx-auto animate-pulse">
            <RefreshCw className={`w-8 h-8 ${isProcessing && !isPaused ? 'animate-spin' : ''}`} />
          </div>

          <div>
            <h3 className="text-xl font-bold text-[#102A36] dark:text-white">
              {isProcessing
                ? isPaused
                  ? 'Batch Paused'
                  : `Processing ${currentIndex + 1} of ${items.length} images...`
                : 'Batch Optimization Complete!'}
            </h3>
            <p className="text-xs text-[#52636A] dark:text-slate-400 mt-1">
              Applying resizing, format transformation, EXIF stripping, and high-performance WebP compression.
            </p>
          </div>

          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-slate-400">
              <span>Overall Progress</span>
              <span>{overallProgress}%</span>
            </div>
            <div className="w-full h-3 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#0799A6] to-emerald-400 transition-all duration-300 rounded-full"
                style={{ width: `${overallProgress}%` }}
              />
            </div>
          </div>

          {/* Pause / Cancel / Finish Controls */}
          <div className="flex items-center justify-center gap-3 pt-2">
            {isProcessing && (
              <>
                <button
                  onClick={handlePauseResume}
                  className="px-4 py-2 rounded-xl bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 text-xs font-semibold text-[#102A36] dark:text-white flex items-center gap-1.5"
                >
                  {isPaused ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
                  <span>{isPaused ? 'Resume' : 'Pause'}</span>
                </button>
                <button
                  onClick={handleCancelProcessing}
                  className="px-4 py-2 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-500 dark:text-rose-400 text-xs font-semibold hover:bg-rose-500/20 flex items-center gap-1.5"
                >
                  <XCircle className="w-3.5 h-3.5" />
                  <span>Cancel Batch</span>
                </button>
              </>
            )}
            {!isProcessing && (
              <button
                onClick={() => setCurrentStep('download')}
                className="px-6 py-2.5 rounded-xl bg-[#0799A6] hover:bg-[#087581] text-white font-bold text-xs shadow-xs flex items-center gap-2"
              >
                <span>Proceed to Download Center</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* STEP 5: DOWNLOAD CENTER */}
      {/* ========================================================================= */}
      {currentStep === 'download' && (
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-[#0799A6]/10 border border-emerald-500/30 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-500">
                <CheckCircle2 className="w-4 h-4" />
                <span>BATCH PROCESSED SUCCESSFULLY</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-[#102A36] dark:text-white mt-1">
                Your Images Are Ready to Download!
              </h2>
              <p className="text-xs text-[#52636A] dark:text-slate-300 mt-1 max-w-xl">
                Processed {completedItems.length} images. Total bandwidth saved:{' '}
                <strong className="text-emerald-400">{totalSavedMB} MB</strong>. You can download all files as a single
                high-compression ZIP bundle or download individual files.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handleDownloadAllZip}
                disabled={isZipping || completedItems.length === 0}
                className="px-6 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm transition shadow-lg flex items-center gap-2 shrink-0"
              >
                <FileArchive className="w-5 h-5" />
                <span>{isZipping ? `Generating ZIP (${zipProgress}%)...` : 'DOWNLOAD ALL AS ZIP'}</span>
              </button>
            </div>
          </div>

          {/* Download Items Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {completedItems.map((item, idx) => (
              <div
                key={item.id}
                className="p-4 rounded-2xl bg-white dark:bg-[#111A1E] border border-[#DCE7E7] dark:border-[#2A3C40] flex items-center justify-between gap-3 shadow-xs"
              >
                <div className="flex items-center space-x-3 min-w-0">
                  <div className="w-12 h-12 rounded-xl overflow-hidden bg-slate-900 border border-slate-700 shrink-0">
                    <img src={item.outputUrl} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-bold text-[#102A36] dark:text-white truncate">
                      {item.outputFileName}
                    </div>
                    <div className="text-[10px] text-emerald-400 font-semibold mt-0.5">
                      {( (item.outputSizeBytes || 0) / (1024 * 1024) ).toFixed(2)} MB • Saved {item.savedPercentage}%
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-1.5 shrink-0">
                  <button
                    onClick={() => setPreviewItem(item)}
                    className="p-2 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-400 hover:text-white hover:bg-slate-800"
                    title="Compare Before & After"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDownloadSingle(item)}
                    className="p-2 rounded-xl bg-[#0799A6] hover:bg-[#087581] text-white"
                    title="Download Image"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-between items-center pt-4">
            <button
              onClick={() => setCurrentStep('upload')}
              className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-semibold text-[#52636A] dark:text-slate-300 hover:text-white"
            >
              ← Back to File Queue
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* PROCESSING HISTORY TAB */}
      {/* ========================================================================= */}
      {currentStep === 'history' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-[#102A36] dark:text-white">Batch Processing History</h2>
              <p className="text-xs text-[#52636A] dark:text-slate-400">
                Log of past batch jobs executed on your account or guest session.
              </p>
            </div>
            <button
              onClick={() => setCurrentStep('upload')}
              className="px-4 py-2 rounded-xl bg-[#0799A6] text-white text-xs font-bold"
            >
              + New Batch
            </button>
          </div>

          <div className="bg-white dark:bg-[#111A1E] border border-[#DCE7E7] dark:border-[#2A3C40] rounded-3xl overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-[#102A36] dark:text-slate-300">
                <thead className="bg-slate-50 dark:bg-slate-950 text-slate-500 font-semibold border-b border-[#DCE7E7] dark:border-[#2A3C40] uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="p-4">Date</th>
                    <th className="p-4">Job Summary</th>
                    <th className="p-4">Images</th>
                    <th className="p-4">Format</th>
                    <th className="p-4">Saved Size</th>
                    <th className="p-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#DCE7E7] dark:divide-slate-800">
                  {historyJobs.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="p-8 text-center text-slate-500">
                        No processing jobs recorded yet.
                      </td>
                    </tr>
                  ) : (
                    historyJobs.map((j) => (
                      <tr key={j.id} className="hover:bg-slate-50 dark:hover:bg-slate-950/40 transition">
                        <td className="p-4 text-slate-400">{new Date(j.createdAt).toLocaleDateString()}</td>
                        <td className="p-4 font-semibold text-white">{j.settingsSummary || 'Batch Resizing'}</td>
                        <td className="p-4">
                          <strong>{j.successfulImages}</strong> / {j.totalImages}
                        </td>
                        <td className="p-4 uppercase">{j.outputFormat}</td>
                        <td className="p-4 text-emerald-400 font-bold">
                          {(j.savedBytes / (1024 * 1024)).toFixed(1)} MB ({j.savedPercentage}%)
                        </td>
                        <td className="p-4">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                            {j.status}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* BEFORE / AFTER SPLIT COMPARISON MODAL */}
      {/* ========================================================================= */}
      {previewItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="bg-[#111A1E] border border-slate-800 rounded-3xl p-6 w-full max-w-4xl space-y-4 max-h-[90vh] overflow-hidden flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <span>Before & After Comparison</span>
                  <span className="text-xs text-emerald-400 font-mono">
                    (-{previewItem.savedPercentage}% Size)
                  </span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">{previewItem.name}</p>
              </div>
              <button
                onClick={() => setPreviewItem(null)}
                className="text-slate-400 hover:text-white text-base"
              >
                ✕
              </button>
            </div>

            {/* Split Comparison Canvas Area */}
            <div className="relative w-full h-[400px] bg-slate-950 rounded-2xl overflow-hidden flex items-center justify-center select-none">
              {/* After Image (Full background) */}
              <img
                src={previewItem.outputUrl}
                alt="After"
                className="absolute inset-0 w-full h-full object-contain pointer-events-none"
              />

              {/* Before Image (Clipped by slider position) */}
              <div
                className="absolute inset-0 overflow-hidden pointer-events-none border-r-2 border-white shadow-xl"
                style={{ width: `${splitSliderPos}%` }}
              >
                <img
                  src={previewItem.previewUrl}
                  alt="Before"
                  className="absolute inset-0 w-full h-full object-contain"
                  style={{ width: '100%', height: '100%' }}
                />
              </div>

              {/* Range Slider Overlay */}
              <input
                type="range"
                min="0"
                max="100"
                value={splitSliderPos}
                onChange={(e) => setSplitSliderPos(Number(e.target.value))}
                className="absolute inset-0 opacity-0 cursor-ew-resize w-full h-full z-10"
              />

              {/* Labels */}
              <span className="absolute top-3 left-3 px-2 py-1 rounded-lg bg-black/60 backdrop-blur-sm text-white text-[10px] font-bold">
                BEFORE: {(previewItem.originalSizeBytes / (1024 * 1024)).toFixed(2)} MB
              </span>
              <span className="absolute top-3 right-3 px-2 py-1 rounded-lg bg-[#0799A6]/80 backdrop-blur-sm text-white text-[10px] font-bold">
                AFTER: {((previewItem.outputSizeBytes || 0) / (1024 * 1024)).toFixed(2)} MB
              </span>
            </div>

            {/* Comparison Metrics Footer */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs pt-2">
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-slate-500">Original Resolution</span>
                <p className="font-bold text-white mt-0.5">
                  {previewItem.originalWidth} × {previewItem.originalHeight} px
                </p>
              </div>
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-slate-500">Output Resolution</span>
                <p className="font-bold text-[#25B4BD] mt-0.5">
                  {previewItem.outputWidth} × {previewItem.outputHeight} px
                </p>
              </div>
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-slate-500">Format & Quality</span>
                <p className="font-bold text-white mt-0.5">
                  {previewItem.originalFormat?.toUpperCase()} → {previewItem.outputFormat?.toUpperCase()}
                </p>
              </div>
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-slate-500">Bandwidth Saved</span>
                <p className="font-bold text-emerald-400 mt-0.5">{previewItem.savedPercentage}% Saved</p>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setPreviewItem(null)}
                className="px-4 py-2 rounded-xl bg-[#0799A6] text-white text-xs font-bold"
              >
                Close Comparison
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* PLAN UPGRADE & SUBSCRIPTION MODAL */}
      {/* ========================================================================= */}
      {isUpgradeModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="bg-[#111A1E] border border-slate-800 rounded-3xl p-6 w-full max-w-4xl space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <Zap className="w-5 h-5 text-amber-400" />
                  <span>Upgrade Image Studio Quotas</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Expand your batch processing concurrency, remove watermark paid gates, and unlock high-res AVIF.
                </p>
              </div>
              <button
                onClick={() => setIsUpgradeModalOpen(false)}
                className="text-slate-400 hover:text-white text-lg"
              >
                ✕
              </button>
            </div>

            {checkoutMessage && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
                {checkoutMessage}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {plans.map((plan) => (
                <div
                  key={plan.id}
                  className={`p-5 rounded-2xl border transition relative flex flex-col justify-between ${
                    plan.popular
                      ? 'border-[#0799A6] bg-[#0799A6]/10'
                      : 'border-slate-800 bg-slate-900/60'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-bold text-white">{plan.name}</h4>
                      {plan.badge && (
                        <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-[#0799A6]/20 text-[#25B4BD] border border-[#0799A6]/30">
                          {plan.badge}
                        </span>
                      )}
                    </div>

                    <div className="my-3">
                      <span className="text-2xl font-black text-white">
                        {plan.priceINR === 0 ? 'Free' : `₹${plan.priceINR}`}
                      </span>
                      <span className="text-xs text-slate-400 ml-1">
                        {plan.billingPeriod === 'monthly' ? '/mo' : ' one-time'}
                      </span>
                    </div>

                    <ul className="space-y-1.5 my-3 text-[11px] text-slate-300">
                      {plan.features.map((f, i) => (
                        <li key={i} className="flex items-center gap-1.5">
                          <Check className="w-3.5 h-3.5 text-[#25B4BD] shrink-0" />
                          <span>{f}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <button
                    onClick={() => handleInitiatePlanCheckout(plan)}
                    disabled={checkoutLoading}
                    className={`w-full py-2.5 rounded-xl font-bold text-xs transition mt-4 shadow-xs ${
                      plan.popular
                        ? 'bg-[#0799A6] hover:bg-[#087581] text-white'
                        : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
                    }`}
                  >
                    {plan.priceINR === 0 ? 'Current Plan' : `Get ${plan.name}`}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
