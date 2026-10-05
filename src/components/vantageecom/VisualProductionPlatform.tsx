import React, { useState, useEffect, useRef } from 'react';
import {
  Layers,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Sliders,
  Eye,
  MessageSquare,
  Download,
  Share2,
  Plus,
  Play,
  RotateCcw,
  Zap,
  ShoppingBag,
  Info,
  Maximize2,
  Palette,
  Camera,
  Check,
  X,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  FileCheck2,
  Flame,
  ArrowRight
} from 'lucide-react';
import { MARKETPLACE_SPECS, MarketplaceSpec } from '../../data/marketplaceSpecsData';

export interface VisualAsset {
  id: string;
  name: string;
  type: 'raw' | 'retouched' | 'rendered' | 'final';
  shotAngle: string;
  url: string;
  rawUrl?: string;
  dimensions: { width: number; height: number };
  resolutionDpi: number;
  backgroundColor: string;
  fileSizeBytes: number;
  format: 'JPEG' | 'PNG' | 'WEBP' | 'TIFF';
  status: 'pending' | 'in_review' | 'changes_requested' | 'approved';
  annotations: {
    id: string;
    x: number; // percentage
    y: number; // percentage
    comment: string;
    author: string;
    timestamp: string;
    resolved: boolean;
  }[];
  marketplaceCompliance: {
    marketplaceId: string;
    passed: boolean;
    issues: string[];
  }[];
}

export interface ShotListPlanItem {
  id: string;
  title: string;
  angle: string;
  lightingType: string;
  backgroundStyle: string;
  aspectRatio: string;
  recommendedResolution: string;
  marketplaces: string[];
  promptGuide?: string;
  sampleImg?: string;
}

export interface VisualProductionProject {
  id: string;
  title: string;
  clientName: string;
  skuCount: number;
  category: 'Fashion & Apparel' | 'Footwear & Bags' | 'Jewelry & Watches' | 'Home & Living' | 'Electronics & Gadgets' | 'Beauty & Skincare';
  status: 'moodboard' | 'production' | 'review' | 'qc_passed' | 'delivered';
  targetMarketplaces: string[];
  primarySkuImage: string;
  shotList: ShotListPlanItem[];
  assets: VisualAsset[];
  createdAt: string;
  updatedAt: string;
}

const DEFAULT_PROJECTS: VisualProductionProject[] = [
  {
    id: 'proj-festive-saree-2025',
    title: 'Heritage Banarasi Silk Saree - Autumn Catalog',
    clientName: 'Aura Silk Loom & Co.',
    skuCount: 14,
    category: 'Fashion & Apparel',
    status: 'review',
    targetMarketplaces: ['amazon-in', 'myntra', 'nykaa-fashion', 'meesho'],
    primarySkuImage: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1000&q=80',
    createdAt: '2025-09-18T10:00:00Z',
    updatedAt: '2025-09-22T14:30:00Z',
    shotList: [
      {
        id: 'shot-1',
        title: 'Full Front Model Drape Shot',
        angle: 'Front Full-Body 0°',
        lightingType: 'Diffused Softbox + Rim Light',
        backgroundStyle: 'Pure Studio White #FFFFFF with subtle drop shadow',
        aspectRatio: '3:4 Portrait',
        recommendedResolution: '2000 x 2666 px (300 DPI)',
        marketplaces: ['myntra', 'amazon-in', 'nykaa-fashion'],
        promptGuide: 'Hyper-realistic Indian woman draped in royal crimson gold zari Banarasi silk saree, soft high-fashion studio lighting, pristine editorial pose, true-to-life silk sheen.',
        sampleImg: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=600&q=80'
      },
      {
        id: 'shot-2',
        title: 'Pallu & Zari Micro-Detail Macro',
        angle: '45° Close-Up Zoom (100% crop)',
        lightingType: 'Directional Specular 4000K',
        backgroundStyle: 'Seamless Warm Cream Neutral',
        aspectRatio: '1:1 Square',
        recommendedResolution: '2400 x 2400 px (300 DPI)',
        marketplaces: ['amazon-in', 'shopify'],
        promptGuide: 'Macro texture photograph revealing genuine 24-karat gold dipped zari thread weaving, warp and weft weave definition, high dynamic range.',
        sampleImg: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=600&q=80'
      },
      {
        id: 'shot-3',
        title: 'Back Blouse Cut & Tassels',
        angle: 'Rear 180° Arch Cut',
        lightingType: 'Dual Contour Soft Strip lights',
        backgroundStyle: 'Clean White #FAFAFA',
        aspectRatio: '3:4 Portrait',
        recommendedResolution: '2000 x 2666 px',
        marketplaces: ['myntra', 'ajio'],
        promptGuide: 'Rear catalog fashion view displaying intricate back neckline dori tassels and handcrafted latkan details.',
        sampleImg: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=600&q=80'
      },
      {
        id: 'shot-4',
        title: 'Festive Courtyard Lifestyle Render',
        angle: 'Architectural Heritage Perspective',
        lightingType: 'Golden Hour Dusk Ray tracing',
        backgroundStyle: 'Jodhpur Sandstone Haveli archway with brass diyas',
        aspectRatio: '1:1 Square & 16:9 Banner',
        recommendedResolution: '3000 x 3000 px',
        marketplaces: ['shopify', 'amazon-in'],
        promptGuide: 'Cinematic lifestyle render in Rajasthani royal palace arch, deep bokeh background, warm festive marigold ambiance.',
        sampleImg: 'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&w=600&q=80'
      }
    ],
    assets: [
      {
        id: 'asset-saree-01',
        name: 'SKU-BAN-01_HeroFront_3x4.jpg',
        type: 'final',
        shotAngle: 'Front Hero 0°',
        url: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1200&q=85',
        rawUrl: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=1200&q=70',
        dimensions: { width: 2160, height: 2880 },
        resolutionDpi: 300,
        backgroundColor: '#FFFFFF',
        fileSizeBytes: 2450000,
        format: 'JPEG',
        status: 'approved',
        annotations: [
          {
            id: 'ann-1',
            x: 52,
            y: 38,
            comment: 'Border reflection balanced cleanly. Gold tone calibrated to PANTONE 14-0848 Metallic.',
            author: 'Ananya S. (Lead QC)',
            timestamp: '2 hours ago',
            resolved: true
          }
        ],
        marketplaceCompliance: [
          { marketplaceId: 'myntra', passed: true, issues: [] },
          { marketplaceId: 'amazon-in', passed: true, issues: [] },
          { marketplaceId: 'nykaa-fashion', passed: true, issues: [] }
        ]
      },
      {
        id: 'asset-saree-02',
        name: 'SKU-BAN-01_DetailMacro_1x1.jpg',
        type: 'retouched',
        shotAngle: 'Zari Weave Detail',
        url: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=1200&q=85',
        rawUrl: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=1200&q=70',
        dimensions: { width: 2000, height: 2000 },
        resolutionDpi: 300,
        backgroundColor: '#F7F6F2',
        fileSizeBytes: 1820000,
        format: 'JPEG',
        status: 'in_review',
        annotations: [
          {
            id: 'ann-2',
            x: 64,
            y: 42,
            comment: 'Can we enhance shadow contrast around the thread weaves slightly by +8%?',
            author: 'Aura Silk Merchandiser',
            timestamp: '35 mins ago',
            resolved: false
          }
        ],
        marketplaceCompliance: [
          { marketplaceId: 'amazon-in', passed: false, issues: ['Amazon main hero requires #FFFFFF pure white background, this shot qualifies for secondary slot 2'] },
          { marketplaceId: 'shopify', passed: true, issues: [] }
        ]
      },
      {
        id: 'asset-saree-03',
        name: 'SKU-BAN-01_LifestyleContext_1x1.jpg',
        type: 'rendered',
        shotAngle: 'AI Environmental Lifestyle',
        url: 'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&w=1200&q=85',
        rawUrl: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1200&q=70',
        dimensions: { width: 2400, height: 2400 },
        resolutionDpi: 300,
        backgroundColor: 'Contextual Heritage Haveli',
        fileSizeBytes: 3100000,
        format: 'WEBP',
        status: 'in_review',
        annotations: [
          {
            id: 'ann-3',
            x: 45,
            y: 70,
            comment: 'Floor reflection matches ambient lantern warmth realistically.',
            author: 'PV Creative Director',
            timestamp: '1 hour ago',
            resolved: true
          }
        ],
        marketplaceCompliance: [
          { marketplaceId: 'amazon-in', passed: true, issues: ['Suitable for secondary lifestyle slot (A+ Content / Brand Story)'] },
          { marketplaceId: 'shopify', passed: true, issues: [] }
        ]
      }
    ]
  },
  {
    id: 'proj-minimal-sneakers-2025',
    title: 'Veloce Kinetic Runner Sneaker Line',
    clientName: 'Strider Performance Goods',
    skuCount: 8,
    category: 'Footwear & Bags',
    status: 'production',
    targetMarketplaces: ['amazon-in', 'flipkart', 'myntra', 'shopify'],
    primarySkuImage: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1000&q=80',
    createdAt: '2025-09-20T12:00:00Z',
    updatedAt: '2025-09-23T01:10:00Z',
    shotList: [
      {
        id: 'shot-snk-1',
        title: '3/4 Lateral Hero Hover',
        angle: 'Lateral 45° Floating Angle',
        lightingType: 'Clean High-Key 5500K Studio',
        backgroundStyle: '#FFFFFF Pure White with realistic contact shadow',
        aspectRatio: '1:1 Square',
        recommendedResolution: '2500 x 2500 px',
        marketplaces: ['amazon-in', 'flipkart', 'myntra'],
        sampleImg: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=600&q=80'
      }
    ],
    assets: [
      {
        id: 'asset-snk-01',
        name: 'SKU-STR-01_Hero34.jpg',
        type: 'final',
        shotAngle: '3/4 Dynamic Lateral',
        url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1200&q=85',
        rawUrl: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=1200&q=70',
        dimensions: { width: 2500, height: 2500 },
        resolutionDpi: 300,
        backgroundColor: '#FFFFFF',
        fileSizeBytes: 2150000,
        format: 'JPEG',
        status: 'approved',
        annotations: [],
        marketplaceCompliance: [
          { marketplaceId: 'amazon-in', passed: true, issues: [] },
          { marketplaceId: 'flipkart', passed: true, issues: [] },
          { marketplaceId: 'myntra', passed: true, issues: [] }
        ]
      }
    ]
  }
];

export const VisualProductionPlatform: React.FC = () => {
  const [projects, setProjects] = useState<VisualProductionProject[]>(DEFAULT_PROJECTS);
  const [selectedProjectId, setSelectedProjectId] = useState<string>(DEFAULT_PROJECTS[0].id);
  const [activeTab, setActiveTab] = useState<'shotlist' | 'qc_compare' | 'compliance' | 'batch_actions' | 'client_proof'>('qc_compare');
  const [selectedAssetId, setSelectedAssetId] = useState<string>(DEFAULT_PROJECTS[0].assets[0]?.id || '');
  
  // Interactive QC Split Slider state (0-100%)
  const [sliderPosition, setSliderPosition] = useState<number>(50);
  const [isDraggingSlider, setIsDraggingSlider] = useState<boolean>(false);
  const compareContainerRef = useRef<HTMLDivElement>(null);

  // Pin Annotation state
  const [isAnnotatingMode, setIsAnnotatingMode] = useState<boolean>(false);
  const [newPinCoords, setNewPinCoords] = useState<{ x: number; y: number } | null>(null);
  const [pinComment, setPinComment] = useState<string>('');
  const [reviewerName, setReviewerName] = useState<string>('Quality Assurance Lead');

  // Automation / Batch actions running simulation state
  const [batchActionRunning, setBatchActionRunning] = useState<string | null>(null);
  const [batchActionProgress, setBatchActionProgress] = useState<number>(0);
  const [batchActionResult, setBatchActionResult] = useState<string | null>(null);

  // Selected marketplace for compliance inspection
  const [selectedMarketplaceId, setSelectedMarketplaceId] = useState<string>('amazon-in');

  // Client proofing share modal
  const [showShareModal, setShowShareModal] = useState<boolean>(false);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);

  // New Project Modal
  const [showNewProjectModal, setShowNewProjectModal] = useState<boolean>(false);
  const [newProjectForm, setNewProjectForm] = useState({
    title: '',
    clientName: '',
    category: 'Fashion & Apparel' as VisualProductionProject['category'],
    skuCount: 10,
    targetMarketplaces: ['amazon-in', 'myntra', 'shopify']
  });

  const activeProject = projects.find(p => p.id === selectedProjectId) || projects[0];
  const activeAsset = activeProject?.assets.find(a => a.id === selectedAssetId) || activeProject?.assets[0];
  const activeMarketplace = MARKETPLACE_SPECS.find(m => m.id === selectedMarketplaceId) || MARKETPLACE_SPECS[0];

  // Handle split slider drag
  const handleSliderMove = (clientX: number) => {
    if (!compareContainerRef.current) return;
    const rect = compareContainerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    const percent = Math.round((x / rect.width) * 100);
    setSliderPosition(percent);
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    setIsDraggingSlider(true);
    handleSliderMove(e.clientX);
  };

  useEffect(() => {
    const handlePointerUp = () => setIsDraggingSlider(false);
    const handlePointerMove = (e: PointerEvent) => {
      if (isDraggingSlider) {
        handleSliderMove(e.clientX);
      }
    };

    if (isDraggingSlider) {
      window.addEventListener('pointermove', handlePointerMove);
      window.addEventListener('pointerup', handlePointerUp);
    }
    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
    };
  }, [isDraggingSlider]);

  // Handle canvas click to place pin
  const handleCanvasClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isAnnotatingMode || !compareContainerRef.current) return;
    const rect = compareContainerRef.current.getBoundingClientRect();
    const x = Math.round(((e.clientX - rect.left) / rect.width) * 100);
    const y = Math.round(((e.clientY - rect.top) / rect.height) * 100);
    setNewPinCoords({ x, y });
  };

  const submitAnnotation = () => {
    if (!newPinCoords || !pinComment.trim() || !activeAsset) return;
    const newAnn = {
      id: `ann-${Date.now()}`,
      x: newPinCoords.x,
      y: newPinCoords.y,
      comment: pinComment.trim(),
      author: reviewerName,
      timestamp: 'Just now',
      resolved: false
    };

    setProjects(prev =>
      prev.map(proj => {
        if (proj.id !== activeProject.id) return proj;
        return {
          ...proj,
          assets: proj.assets.map(asset => {
            if (asset.id !== activeAsset.id) return asset;
            return {
              ...asset,
              status: 'in_review',
              annotations: [...asset.annotations, newAnn]
            };
          })
        };
      })
    );

    setNewPinCoords(null);
    setPinComment('');
    setIsAnnotatingMode(false);
  };

  const toggleAnnotationResolve = (annId: string) => {
    if (!activeAsset) return;
    setProjects(prev =>
      prev.map(proj => {
        if (proj.id !== activeProject.id) return proj;
        return {
          ...proj,
          assets: proj.assets.map(asset => {
            if (asset.id !== activeAsset.id) return asset;
            return {
              ...asset,
              annotations: asset.annotations.map(ann => {
                if (ann.id !== annId) return ann;
                return { ...ann, resolved: !ann.resolved };
              })
            };
          })
        };
      })
    );
  };

  const updateAssetStatus = (newStatus: VisualAsset['status']) => {
    if (!activeAsset) return;
    setProjects(prev =>
      prev.map(proj => {
        if (proj.id !== activeProject.id) return proj;
        return {
          ...proj,
          assets: proj.assets.map(asset => {
            if (asset.id !== activeAsset.id) return asset;
            return { ...asset, status: newStatus };
          })
        };
      })
    );
  };

  const triggerBatchAction = (actionName: string) => {
    setBatchActionRunning(actionName);
    setBatchActionProgress(10);
    setBatchActionResult(null);

    const interval = setInterval(() => {
      setBatchActionProgress(p => {
        if (p >= 95) {
          clearInterval(interval);
          setTimeout(() => {
            setBatchActionRunning(null);
            setBatchActionResult(`Successfully executed "${actionName}" on ${activeProject.assets.length} project deliverables. Color profiles aligned, ICC sRGB embedded.`);
          }, 400);
          return 100;
        }
        return p + 25;
      });
    }, 300);
  };

  const createNewProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProjectForm.title.trim()) return;

    const newProj: VisualProductionProject = {
      id: `proj-${Date.now()}`,
      title: newProjectForm.title,
      clientName: newProjectForm.clientName || 'Partner Brand',
      skuCount: Number(newProjectForm.skuCount) || 1,
      category: newProjectForm.category,
      status: 'production',
      targetMarketplaces: newProjectForm.targetMarketplaces,
      primarySkuImage: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1000&q=80',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      shotList: [
        {
          id: `shot-${Date.now()}-1`,
          title: 'Hero Front Angle',
          angle: 'Front 0° High-Key Studio',
          lightingType: 'Dual Diffused Softbox',
          backgroundStyle: 'Pure White #FFFFFF',
          aspectRatio: '1:1 Square',
          recommendedResolution: '2000 x 2000 px',
          marketplaces: newProjectForm.targetMarketplaces
        }
      ],
      assets: [
        {
          id: `asset-${Date.now()}-1`,
          name: `${newProjectForm.title.replace(/\s+/g, '_')}_Hero.jpg`,
          type: 'final',
          shotAngle: 'Hero 0° Studio',
          url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1200&q=85',
          rawUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1200&q=70',
          dimensions: { width: 2400, height: 2400 },
          resolutionDpi: 300,
          backgroundColor: '#FFFFFF',
          fileSizeBytes: 2100000,
          format: 'JPEG',
          status: 'in_review',
          annotations: [],
          marketplaceCompliance: [
            { marketplaceId: 'amazon-in', passed: true, issues: [] },
            { marketplaceId: 'shopify', passed: true, issues: [] }
          ]
        }
      ]
    };

    setProjects(prev => [newProj, ...prev]);
    setSelectedProjectId(newProj.id);
    setSelectedAssetId(newProj.assets[0].id);
    setShowNewProjectModal(false);
  };

  const copyShareLink = () => {
    const url = `${window.location.origin}/vantageecom?project=${activeProject.id}&view=proof`;
    navigator.clipboard.writeText(url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  return (
    <div className="bg-slate-950 text-slate-100 rounded-3xl border border-slate-800 shadow-2xl overflow-hidden my-8">
      {/* Top Banner / Hero Intro */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border-b border-slate-800 p-6 md:p-8">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-semibold tracking-wide uppercase">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              PV Labs Enterprise Visual Production Suite
            </div>
            <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white">
              End-to-End E-Commerce Content Orchestration
            </h2>
            <p className="text-sm md:text-base text-slate-400 max-w-2xl">
              From creative moodboards and AI camera shot lists to pixel-level interactive QC proofing and multi-marketplace compliance audits across Amazon, Flipkart, Myntra, and Shopify.
            </p>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setShowShareModal(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 border border-slate-700 text-sm font-medium text-slate-200 transition-colors shadow-sm"
            >
              <Share2 className="w-4 h-4 text-indigo-400" />
              Client Proofing Link
            </button>
            <button
              onClick={() => setShowNewProjectModal(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white font-semibold text-sm transition-all shadow-lg shadow-indigo-600/30"
            >
              <Plus className="w-4 h-4" />
              New Production Shoot
            </button>
          </div>
        </div>

        {/* Project Selector Bar */}
        <div className="mt-6 pt-6 border-t border-slate-800/60 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-none">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 whitespace-nowrap">
              Active Productions:
            </span>
            {projects.map(proj => {
              const isSelected = proj.id === activeProject.id;
              return (
                <button
                  key={proj.id}
                  onClick={() => {
                    setSelectedProjectId(proj.id);
                    setSelectedAssetId(proj.assets[0]?.id || '');
                  }}
                  className={`flex items-center gap-2.5 px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all whitespace-nowrap ${
                    isSelected
                      ? 'bg-indigo-600 text-white font-semibold shadow-md shadow-indigo-600/30'
                      : 'bg-slate-900/90 text-slate-300 hover:bg-slate-800 border border-slate-800'
                  }`}
                >
                  <span className={`w-2 h-2 rounded-full ${
                    proj.status === 'review' ? 'bg-amber-400 animate-pulse' :
                    proj.status === 'qc_passed' ? 'bg-emerald-400' : 'bg-blue-400'
                  }`} />
                  <span>{proj.title}</span>
                  <span className="opacity-70 text-[10px] px-1.5 py-0.5 rounded bg-black/30">
                    {proj.skuCount} SKUs
                  </span>
                </button>
              );
            })}
          </div>

          {/* Project Meta Badges */}
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span className="bg-slate-900 px-2.5 py-1 rounded-lg border border-slate-800">
              Brand: <strong className="text-slate-200">{activeProject.clientName}</strong>
            </span>
            <span className="bg-slate-900 px-2.5 py-1 rounded-lg border border-slate-800">
              Category: <strong className="text-slate-200">{activeProject.category}</strong>
            </span>
            <span className={`px-2.5 py-1 rounded-lg font-semibold uppercase text-[10px] tracking-wider border ${
              activeProject.status === 'review' ? 'bg-amber-500/10 text-amber-300 border-amber-500/30' :
              activeProject.status === 'qc_passed' ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30' :
              'bg-indigo-500/10 text-indigo-300 border-indigo-500/30'
            }`}>
              {activeProject.status.replace('_', ' ')}
            </span>
          </div>
        </div>
      </div>

      {/* Main Workspace Navigation Tabs */}
      <div className="border-b border-slate-800 bg-slate-900/60 px-6 flex items-center justify-between overflow-x-auto">
        <div className="flex items-center gap-1 py-2">
          <button
            onClick={() => setActiveTab('qc_compare')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs md:text-sm font-semibold transition-all ${
              activeTab === 'qc_compare'
                ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Sliders className="w-4 h-4 text-indigo-400" />
            Interactive QC & Split Compare
            {activeAsset?.annotations.length ? (
              <span className="ml-1 px-1.5 py-0.2 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-bold border border-amber-500/30">
                {activeAsset.annotations.length} pins
              </span>
            ) : null}
          </button>

          <button
            onClick={() => setActiveTab('shotlist')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs md:text-sm font-semibold transition-all ${
              activeTab === 'shotlist'
                ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Camera className="w-4 h-4 text-indigo-400" />
            Moodboard & Shot-List ({activeProject.shotList.length})
          </button>

          <button
            onClick={() => setActiveTab('compliance')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs md:text-sm font-semibold transition-all ${
              activeTab === 'compliance'
                ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            Marketplace Specs & Audit
          </button>

          <button
            onClick={() => setActiveTab('batch_actions')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs md:text-sm font-semibold transition-all ${
              activeTab === 'batch_actions'
                ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Zap className="w-4 h-4 text-amber-400" />
            Batch Automation Pipelines
          </button>

          <button
            onClick={() => setActiveTab('client_proof')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs md:text-sm font-semibold transition-all ${
              activeTab === 'client_proof'
                ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <FileCheck2 className="w-4 h-4 text-indigo-400" />
            Client Sign-Off Proofing
          </button>
        </div>

        {/* Deliverables Count & Download */}
        <div className="hidden lg:flex items-center gap-3">
          <span className="text-xs text-slate-400">
            Assets Ready: <strong className="text-slate-200">{activeProject.assets.length}</strong> / {activeProject.shotList.length}
          </span>
          <button
            onClick={() => {
              const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(activeProject, null, 2));
              const downloadAnchor = document.createElement('a');
              downloadAnchor.setAttribute("href", dataStr);
              downloadAnchor.setAttribute("download", `${activeProject.title.replace(/\s+/g, '_')}_MarketplaceBundle.json`);
              document.body.appendChild(downloadAnchor);
              downloadAnchor.click();
              downloadAnchor.remove();
            }}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 border border-slate-700"
          >
            <Download className="w-3.5 h-3.5" />
            Export Spec Package
          </button>
        </div>
      </div>

      {/* Tab Content Views */}
      <div className="p-6 md:p-8">
        {/* ========================================================= */}
        {/* TAB 1: INTERACTIVE QC & SPLIT COMPARISON */}
        {/* ========================================================= */}
        {activeTab === 'qc_compare' && activeAsset && (
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
            {/* Left 8 Cols: Interactive Split Canvas & Pin Review */}
            <div className="xl:col-span-8 space-y-4">
              {/* Asset Selector Strip */}
              <div className="flex items-center justify-between bg-slate-900/90 p-3 rounded-2xl border border-slate-800">
                <div className="flex items-center gap-2 overflow-x-auto pb-1 max-w-xl">
                  {activeProject.assets.map(asset => (
                    <button
                      key={asset.id}
                      onClick={() => setSelectedAssetId(asset.id)}
                      className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                        asset.id === activeAsset.id
                          ? 'bg-indigo-600 text-white font-semibold'
                          : 'bg-slate-800/80 text-slate-400 hover:text-slate-200 hover:bg-slate-700'
                      }`}
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                      <span className="truncate max-w-[140px]">{asset.shotAngle}</span>
                    </button>
                  ))}
                </div>

                {/* Annotation Mode Toggle */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setIsAnnotatingMode(!isAnnotatingMode);
                      setNewPinCoords(null);
                    }}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      isAnnotatingMode
                        ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/30'
                        : 'bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700'
                    }`}
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    {isAnnotatingMode ? 'Click Canvas to Pin' : 'Add QC Pin'}
                  </button>
                </div>
              </div>

              {/* The Interactive Before/After Split Viewer with Canvas Pins */}
              <div className="relative rounded-2xl overflow-hidden border border-slate-800 bg-black shadow-2xl select-none group">
                <div
                  ref={compareContainerRef}
                  onClick={handleCanvasClick}
                  className={`relative w-full h-[520px] md:h-[600px] cursor-${isAnnotatingMode ? 'crosshair' : 'default'} overflow-hidden flex items-center justify-center bg-slate-950`}
                >
                  {/* Before (Raw Studio Base) */}
                  <img
                    src={activeAsset.rawUrl || activeAsset.url}
                    alt="Raw Studio Capture"
                    className="absolute inset-0 w-full h-full object-contain pointer-events-none"
                  />
                  <div className="absolute top-4 left-4 z-10 px-2.5 py-1 rounded-md bg-black/75 backdrop-blur text-[11px] font-mono font-bold text-amber-300 border border-amber-400/30">
                    RAW STUDIO CAPTURE
                  </div>

                  {/* After (Retouched / AI Rendered Marketplace Ready) clipped by slider */}
                  <div
                    className="absolute inset-0 overflow-hidden pointer-events-none"
                    style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
                  >
                    <img
                      src={activeAsset.url}
                      alt="Final Retouched"
                      className="absolute inset-0 w-full h-full object-contain"
                    />
                    <div className="absolute top-4 right-4 z-10 px-2.5 py-1 rounded-md bg-indigo-950/85 backdrop-blur text-[11px] font-mono font-bold text-indigo-300 border border-indigo-400/30">
                      FINAL MARKETPLACE READY
                    </div>
                  </div>

                  {/* Divider Line & Handle */}
                  <div
                    onPointerDown={handlePointerDown}
                    style={{ left: `${sliderPosition}%` }}
                    className="absolute top-0 bottom-0 w-1 bg-white/90 shadow-[0_0_12px_rgba(255,255,255,0.8)] cursor-ew-resize z-20"
                  >
                    <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-9 h-9 rounded-full bg-slate-900 border-2 border-white flex items-center justify-center text-white shadow-xl hover:scale-110 active:scale-95 transition-transform">
                      <Sliders className="w-4 h-4 text-indigo-300" />
                    </div>
                  </div>

                  {/* Existing Review Pins */}
                  {activeAsset.annotations.map((ann, idx) => (
                    <div
                      key={ann.id}
                      style={{ left: `${ann.x}%`, top: `${ann.y}%` }}
                      className="absolute -translate-x-1/2 -translate-y-1/2 z-30 group/pin"
                    >
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleAnnotationResolve(ann.id);
                        }}
                        className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black shadow-lg transition-transform hover:scale-125 border-2 ${
                          ann.resolved
                            ? 'bg-emerald-500 text-white border-white'
                            : 'bg-amber-500 text-slate-950 border-white animate-bounce'
                        }`}
                        title={ann.comment}
                      >
                        {idx + 1}
                      </button>

                      {/* Tooltip on hover */}
                      <div className="absolute bottom-9 left-1/2 -translate-x-1/2 hidden group-hover/pin:block w-64 p-3 rounded-xl bg-slate-900/95 backdrop-blur border border-slate-700 text-xs shadow-2xl z-40 pointer-events-auto">
                        <div className="flex items-center justify-between mb-1 pb-1 border-b border-slate-800">
                          <span className="font-bold text-indigo-300">{ann.author}</span>
                          <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${
                            ann.resolved ? 'bg-emerald-500/20 text-emerald-300' : 'bg-amber-500/20 text-amber-300'
                          }`}>
                            {ann.resolved ? 'Resolved' : 'Pending'}
                          </span>
                        </div>
                        <p className="text-slate-300 leading-snug">{ann.comment}</p>
                        <div className="mt-2 text-[10px] text-slate-400 text-right">
                          Click pin to mark {ann.resolved ? 'pending' : 'resolved'}
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* Pending New Pin Placement */}
                  {newPinCoords && (
                    <div
                      style={{ left: `${newPinCoords.x}%`, top: `${newPinCoords.y}%` }}
                      className="absolute -translate-x-1/2 -translate-y-1/2 z-35"
                    >
                      <div className="w-8 h-8 rounded-full bg-rose-500 text-white font-bold flex items-center justify-center animate-pulse border-2 border-white shadow-xl">
                        +
                      </div>
                    </div>
                  )}
                </div>

                {/* Split Slider Bottom Guide */}
                <div className="p-3 bg-slate-900/90 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
                  <div className="flex items-center gap-2">
                    <Sliders className="w-4 h-4 text-indigo-400" />
                    <span>Drag handle horizontally to inspect retouching & shadow accuracy ({sliderPosition}% split)</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-slate-300">{activeAsset.dimensions.width} x {activeAsset.dimensions.height} px</span>
                    <span className="px-2 py-0.5 rounded bg-slate-800 font-mono text-[11px] text-slate-300">{activeAsset.resolutionDpi} DPI</span>
                    <span className="px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-semibold">{activeAsset.format}</span>
                  </div>
                </div>
              </div>

              {/* Pin Comment Creation Box */}
              {newPinCoords && (
                <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 space-y-3 animate-in fade-in">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-amber-300 text-sm font-bold">
                      <MessageSquare className="w-4 h-4" />
                      Add Feedback Pin at ({newPinCoords.x}%, {newPinCoords.y}%)
                    </div>
                    <button
                      onClick={() => setNewPinCoords(null)}
                      className="text-slate-400 hover:text-white"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <input
                      type="text"
                      value={reviewerName}
                      onChange={(e) => setReviewerName(e.target.value)}
                      placeholder="Your Name / Role"
                      className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-amber-400"
                    />
                    <input
                      type="text"
                      value={pinComment}
                      onChange={(e) => setPinComment(e.target.value)}
                      placeholder="e.g. Tone down specular highlight on saree border by 10%..."
                      className="md:col-span-2 px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => setNewPinCoords(null)}
                      className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-400 hover:text-white"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={submitAnnotation}
                      className="px-4 py-1.5 rounded-lg bg-amber-500 text-slate-950 font-bold text-xs hover:bg-amber-400 shadow-md"
                    >
                      Save Review Pin
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Right 4 Cols: QC Inspector, Pin Log & Approval Controls */}
            <div className="xl:col-span-4 space-y-5">
              {/* Asset Status & Approval Card */}
              <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-slate-200">Asset QC Status</h3>
                  <span className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                    activeAsset.status === 'approved' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
                    activeAsset.status === 'changes_requested' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' :
                    'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                  }`}>
                    {activeAsset.status.replace('_', ' ')}
                  </span>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex justify-between py-1 border-b border-slate-800/80">
                    <span className="text-slate-400">File Identifier:</span>
                    <span className="font-mono text-slate-200 truncate max-w-[180px]">{activeAsset.name}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-800/80">
                    <span className="text-slate-400">Background Tone:</span>
                    <span className="font-mono text-slate-200 flex items-center gap-1.5">
                      <span className="w-3 h-3 rounded-full border border-slate-600" style={{ backgroundColor: activeAsset.backgroundColor }} />
                      {activeAsset.backgroundColor}
                    </span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-800/80">
                    <span className="text-slate-400">File Weight:</span>
                    <span className="font-mono text-slate-200">{(activeAsset.fileSizeBytes / (1024 * 1024)).toFixed(2)} MB</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-slate-400">Compliance Pass Rate:</span>
                    <span className="font-bold text-emerald-400">
                      {activeAsset.marketplaceCompliance.filter(m => m.passed).length} / {activeAsset.marketplaceCompliance.length} Channels
                    </span>
                  </div>
                </div>

                {/* Sign-off Quick Actions */}
                <div className="grid grid-cols-2 gap-2 pt-2">
                  <button
                    onClick={() => updateAssetStatus('approved')}
                    className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-colors shadow-md shadow-emerald-600/20"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    Approve Asset
                  </button>
                  <button
                    onClick={() => updateAssetStatus('changes_requested')}
                    className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-rose-950 hover:text-rose-200 text-slate-300 font-semibold text-xs transition-colors border border-slate-700"
                  >
                    <AlertTriangle className="w-4 h-4" />
                    Request Edits
                  </button>
                </div>
              </div>

              {/* Pin Annotations List */}
              <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-indigo-400" />
                    Review Feedback Pins ({activeAsset.annotations.length})
                  </h3>
                  <span className="text-[11px] text-slate-400">Click to toggle</span>
                </div>

                {activeAsset.annotations.length === 0 ? (
                  <div className="text-center py-6 text-slate-500 text-xs">
                    No active feedback pins. Enable "Add QC Pin" to point out precise areas for adjustment.
                  </div>
                ) : (
                  <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
                    {activeAsset.annotations.map((ann, idx) => (
                      <div
                        key={ann.id}
                        onClick={() => toggleAnnotationResolve(ann.id)}
                        className={`p-3 rounded-xl border text-xs cursor-pointer transition-all ${
                          ann.resolved
                            ? 'bg-slate-900/40 border-slate-800 text-slate-400 opacity-60'
                            : 'bg-indigo-950/30 border-indigo-500/30 text-slate-200 hover:border-indigo-400'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center gap-1.5 font-bold">
                            <span className="w-4 h-4 rounded-full bg-amber-500 text-slate-950 text-[10px] flex items-center justify-center">
                              {idx + 1}
                            </span>
                            <span>{ann.author}</span>
                          </div>
                          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                            ann.resolved ? 'bg-emerald-500/20 text-emerald-300' : 'bg-amber-500/20 text-amber-300'
                          }`}>
                            {ann.resolved ? 'Resolved' : 'Needs Fix'}
                          </span>
                        </div>
                        <p className="mt-1 leading-snug">{ann.comment}</p>
                        <div className="mt-1.5 text-[10px] text-slate-500 text-right">
                          {ann.timestamp}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Quick Marketplace Compliance Widget */}
              <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
                <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  Target Channel Audit
                </h3>

                <div className="space-y-2">
                  {activeAsset.marketplaceCompliance.map(comp => {
                    const spec = MARKETPLACE_SPECS.find(m => m.id === comp.marketplaceId);
                    return (
                      <div
                        key={comp.marketplaceId}
                        className={`p-2.5 rounded-xl border flex items-center justify-between text-xs ${
                          comp.passed
                            ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-300'
                            : 'bg-amber-950/20 border-amber-500/30 text-amber-300'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          {comp.passed ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                          ) : (
                            <AlertTriangle className="w-4 h-4 text-amber-400" />
                          )}
                          <span className="font-semibold text-slate-200">{spec?.name || comp.marketplaceId}</span>
                        </div>
                        <span className="text-[10px] font-bold uppercase">
                          {comp.passed ? 'Compliant' : 'Warning'}
                        </span>
                      </div>
                    );
                  })}
                </div>

                <button
                  onClick={() => setActiveTab('compliance')}
                  className="w-full mt-2 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 flex items-center justify-center gap-1.5 transition-colors"
                >
                  Inspect Full Compliance Matrix <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 2: MOODBOARD & SHOT-LIST BUILDER */}
        {/* ========================================================= */}
        {activeTab === 'shotlist' && (
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <Camera className="w-5 h-5 text-indigo-400" />
                  Visual Moodboard & Camera Shot-List Plan
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Preset shooting angles, recommended resolutions, studio lighting recipes, and AI prompt guides for consistent e-commerce catalog output.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400 bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-800">
                  Total Planned Shots: <strong className="text-white">{activeProject.shotList.length}</strong>
                </span>
              </div>
            </div>

            {/* Shot List Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {activeProject.shotList.map((shot, idx) => (
                <div
                  key={shot.id}
                  className="bg-slate-900/90 rounded-2xl border border-slate-800 hover:border-indigo-500/40 transition-all overflow-hidden flex flex-col group shadow-lg"
                >
                  {/* Sample Visual Thumbnail */}
                  <div className="relative h-56 bg-slate-950 overflow-hidden">
                    {shot.sampleImg ? (
                      <img
                        src={shot.sampleImg}
                        alt={shot.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-600">
                        <Camera className="w-12 h-12 stroke-[1.2]" />
                      </div>
                    )}
                    <div className="absolute top-3 left-3 px-2 py-0.5 rounded-md bg-black/80 backdrop-blur text-[11px] font-bold text-indigo-300 border border-indigo-400/30">
                      Shot #{idx + 1}
                    </div>
                    <div className="absolute top-3 right-3 px-2 py-0.5 rounded-md bg-black/80 backdrop-blur text-[11px] font-mono text-slate-300">
                      {shot.aspectRatio}
                    </div>
                    <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent p-3 pt-8">
                      <span className="text-xs font-semibold text-indigo-300 uppercase tracking-wider">
                        {shot.angle}
                      </span>
                      <h4 className="text-sm font-bold text-white leading-tight">
                        {shot.title}
                      </h4>
                    </div>
                  </div>

                  {/* Shot Specs Body */}
                  <div className="p-4 space-y-3 flex-1 flex flex-col justify-between text-xs">
                    <div className="space-y-2">
                      <div className="flex items-start justify-between gap-2 py-1 border-b border-slate-800">
                        <span className="text-slate-400">Lighting Setup:</span>
                        <span className="text-right text-slate-200 font-medium">{shot.lightingType}</span>
                      </div>
                      <div className="flex items-start justify-between gap-2 py-1 border-b border-slate-800">
                        <span className="text-slate-400">Backdrop:</span>
                        <span className="text-right text-slate-200 font-medium truncate max-w-[160px]">{shot.backgroundStyle}</span>
                      </div>
                      <div className="flex items-start justify-between gap-2 py-1 border-b border-slate-800">
                        <span className="text-slate-400">Target Spec:</span>
                        <span className="text-right font-mono text-slate-200">{shot.recommendedResolution}</span>
                      </div>

                      {shot.promptGuide && (
                        <div className="mt-2 p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-[11px] text-slate-300 space-y-1">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400 flex items-center gap-1">
                            <Sparkles className="w-3 h-3" /> Creative Prompt Reference:
                          </span>
                          <p className="italic text-slate-400 line-clamp-3">"{shot.promptGuide}"</p>
                        </div>
                      )}
                    </div>

                    {/* Channels mapped */}
                    <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        {shot.marketplaces.map(mId => (
                          <span key={mId} className="px-2 py-0.5 rounded bg-slate-800 text-[10px] text-slate-300 uppercase">
                            {mId.split('-')[0]}
                          </span>
                        ))}
                      </div>
                      <button
                        onClick={() => {
                          setActiveTab('qc_compare');
                        }}
                        className="text-xs font-bold text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
                      >
                        Inspect Deliverable <ChevronRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 3: MARKETPLACE SPECS & AUDIT */}
        {/* ========================================================= */}
        {activeTab === 'compliance' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                Channel Specification Matrix & Compliance Engine
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Zero-rejection validation engine across major Indian and global e-commerce portals. Every asset is audited against strict hero background, zoom ratio, and padding guidelines.
              </p>
            </div>

            {/* Marketplace Selector Tabs */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-800">
              {MARKETPLACE_SPECS.map(spec => {
                const isSelected = spec.id === selectedMarketplaceId;
                return (
                  <button
                    key={spec.id}
                    onClick={() => setSelectedMarketplaceId(spec.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                      isSelected
                        ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                        : 'bg-slate-900 text-slate-400 hover:text-slate-200 hover:bg-slate-800 border border-slate-800'
                    }`}
                  >
                    <span>{spec.name}</span>
                    <span className="text-[10px] opacity-75 font-normal">({spec.region})</span>
                  </button>
                );
              })}
            </div>

            {/* Selected Marketplace Spec Details */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Core Requirements Card */}
              <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-white text-base">{activeMarketplace.name} Guidelines</h4>
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-semibold border border-emerald-500/30">
                    Active Preset
                  </span>
                </div>

                <div className="space-y-3 text-xs">
                  <div className="flex justify-between py-1.5 border-b border-slate-800">
                    <span className="text-slate-400">Aspect Ratio:</span>
                    <strong className="text-slate-200">{activeMarketplace.aspectRatio}</strong>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-slate-800">
                    <span className="text-slate-400">Min / Recommended Res:</span>
                    <strong className="text-slate-200 font-mono">
                      {activeMarketplace.minWidth}x{activeMarketplace.minHeight} / {activeMarketplace.recommendedWidth}x{activeMarketplace.recommendedHeight} px
                    </strong>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-slate-800">
                    <span className="text-slate-400">Hero Background:</span>
                    <strong className="text-slate-200 font-mono">{activeMarketplace.backgroundColor}</strong>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-slate-800">
                    <span className="text-slate-400">Product Fill / Margin:</span>
                    <strong className="text-slate-200">{activeMarketplace.productFillPercentage}</strong>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-slate-800">
                    <span className="text-slate-400">Accepted Formats:</span>
                    <strong className="text-slate-200">{activeMarketplace.allowedFormats.join(', ')}</strong>
                  </div>
                  <div className="flex justify-between py-1.5">
                    <span className="text-slate-400">Max File Size:</span>
                    <strong className="text-slate-200 font-mono">{activeMarketplace.maxFileSizeMb} MB</strong>
                  </div>
                </div>
              </div>

              {/* Strict Validator Checklist */}
              <div className="lg:col-span-2 p-6 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4">
                <h4 className="font-bold text-white text-base flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  Automated Pre-Flight Checklist for {activeMarketplace.name}
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {activeMarketplace.rules.map((rule, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800/80 flex items-start gap-3"
                    >
                      <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                        <Check className="w-3.5 h-3.5" />
                      </div>
                      <p className="text-xs text-slate-300 leading-snug">{rule}</p>
                    </div>
                  ))}
                </div>

                {/* Audit Run for Current Project SKUs */}
                <div className="mt-4 pt-4 border-t border-slate-800 flex items-center justify-between">
                  <div className="text-xs text-slate-400">
                    Audit Status: <span className="text-emerald-400 font-bold">100% Passed</span> for Hero Front Assets
                  </div>
                  <button
                    onClick={() => triggerBatchAction(`Validate against ${activeMarketplace.name} strict specs`)}
                    className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 border border-slate-700 flex items-center gap-2"
                  >
                    <FileCheck2 className="w-4 h-4 text-emerald-400" />
                    Re-Audit All Project Deliverables
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 4: BATCH AUTOMATION PIPELINES */}
        {/* ========================================================= */}
        {activeTab === 'batch_actions' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <Zap className="w-5 h-5 text-amber-400" />
                Enterprise Batch Automation & Photoshop Action Pipelines
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Execute cloud-compiled Photoshop droplets and AI post-production pipelines directly across your entire SKU catalog in seconds.
              </p>
            </div>

            {/* Running Status Notification */}
            {batchActionRunning && (
              <div className="p-4 rounded-2xl bg-indigo-950/60 border border-indigo-500/40 space-y-2 animate-in fade-in">
                <div className="flex items-center justify-between text-xs font-bold text-indigo-300">
                  <span className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-indigo-400 animate-spin" />
                    Executing: {batchActionRunning}
                  </span>
                  <span>{batchActionProgress}%</span>
                </div>
                <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-indigo-500 h-full rounded-full transition-all duration-300"
                    style={{ width: `${batchActionProgress}%` }}
                  />
                </div>
              </div>
            )}

            {batchActionResult && (
              <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 flex items-center justify-between text-xs text-emerald-300">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>{batchActionResult}</span>
                </div>
                <button
                  onClick={() => setBatchActionResult(null)}
                  className="text-slate-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Pipeline Action Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  title: 'Pure White Background Cutout',
                  desc: 'Alpha matte segmentation, zero edge fringing, calibrated pure #FFFFFF background replacement for Amazon Hero specs.',
                  badge: 'Photoshop AI Engine',
                  icon: Layers
                },
                {
                  title: 'True-to-Life Ground Shadow Injection',
                  desc: 'Contact and directional drop shadows calculated from product geometry to prevent floating-artifact looks.',
                  badge: 'Shadow Synthesis',
                  icon: Sliders
                },
                {
                  title: 'Garment Steaming & Crease Removal',
                  desc: 'Removes transit wrinkles, folds, and fabric puckering while preserving fabric weave texture and drape contour.',
                  badge: 'Fabric Retouch',
                  icon: Sparkles
                },
                {
                  title: 'Marketplace Multi-Ratio Cropper',
                  desc: 'Instantly renders 1:1 (Amazon/Flipkart), 3:4 (Myntra/Ajio), and 16:9 banners with smart product centering.',
                  badge: 'Batch Geometry',
                  icon: Maximize2
                },
                {
                  title: 'ICC Profile & Color Space Alignment',
                  desc: 'Converts Adobe RGB to standard sRGB IEC61966-2.1 with embedded ICC profiles for consistent mobile screen display.',
                  badge: 'Color Fidelity',
                  icon: Palette
                },
                {
                  title: 'Lossless WebP & JPEG Optimizer',
                  desc: 'Quantization compression under 2MB with crisp 100% detail retention for lightning fast storefront load times.',
                  badge: 'Performance',
                  icon: Download
                }
              ].map((action, i) => {
                const IconComponent = action.icon;
                return (
                  <div
                    key={i}
                    className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-slate-700 flex flex-col justify-between space-y-4"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                          {action.badge}
                        </span>
                        <IconComponent className="w-4 h-4 text-slate-400" />
                      </div>
                      <h4 className="font-bold text-white text-sm">{action.title}</h4>
                      <p className="text-xs text-slate-400 leading-relaxed">{action.desc}</p>
                    </div>

                    <button
                      onClick={() => triggerBatchAction(action.title)}
                      disabled={!!batchActionRunning}
                      className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-indigo-600 disabled:opacity-50 text-white font-semibold text-xs transition-colors flex items-center justify-center gap-2"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                      Run Pipeline on {activeProject.skuCount} SKUs
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 5: CLIENT SIGN-OFF PROOFING */}
        {/* ========================================================= */}
        {activeTab === 'client_proof' && (
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <FileCheck2 className="w-5 h-5 text-indigo-400" />
                  Client Sign-Off & Review Portal
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Brand stakeholders can approve deliverables, download print/web ready assets, and sign off on completed catalog batches.
                </p>
              </div>

              <button
                onClick={() => setShowShareModal(true)}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition-all shadow-md shadow-indigo-600/30"
              >
                <Share2 className="w-4 h-4" />
                Copy Stakeholder Review Link
              </button>
            </div>

            {/* Deliverables Gallery Table */}
            <div className="bg-slate-900/90 rounded-2xl border border-slate-800 overflow-hidden">
              <div className="p-4 border-b border-slate-800 flex items-center justify-between">
                <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Deliverables for "{activeProject.title}"
                </span>
                <span className="text-xs text-emerald-400 font-semibold">
                  {activeProject.assets.filter(a => a.status === 'approved').length} of {activeProject.assets.length} Approved
                </span>
              </div>

              <div className="divide-y divide-slate-800">
                {activeProject.assets.map(asset => (
                  <div key={asset.id} className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-slate-850/50 transition-colors">
                    <div className="flex items-center gap-4">
                      <img
                        src={asset.url}
                        alt={asset.name}
                        className="w-16 h-16 rounded-xl object-cover bg-black border border-slate-700 shrink-0"
                      />
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h5 className="font-bold text-white text-sm">{asset.shotAngle}</h5>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            asset.status === 'approved' ? 'bg-emerald-500/20 text-emerald-300' :
                            asset.status === 'changes_requested' ? 'bg-rose-500/20 text-rose-300' :
                            'bg-amber-500/20 text-amber-300'
                          }`}>
                            {asset.status.replace('_', ' ')}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 font-mono">{asset.name}</p>
                        <p className="text-[11px] text-slate-500">
                          {asset.dimensions.width} x {asset.dimensions.height} px • {asset.format} • {asset.annotations.length} feedback notes
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => {
                          setSelectedAssetId(asset.id);
                          setActiveTab('qc_compare');
                        }}
                        className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 border border-slate-700 flex items-center gap-1.5"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        Inspect Split
                      </button>

                      <a
                        href={asset.url}
                        target="_blank"
                        rel="noreferrer"
                        className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs font-bold text-white shadow-md shadow-indigo-600/20 flex items-center gap-1.5"
                      >
                        <Download className="w-3.5 h-3.5" />
                        Download
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Share / Proofing Link Modal */}
      {showShareModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-md w-full space-y-4 shadow-2xl">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-white text-base flex items-center gap-2">
                <Share2 className="w-4 h-4 text-indigo-400" />
                Client Proofing Portal
              </h4>
              <button
                onClick={() => setShowShareModal(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              Share this dedicated, zero-friction proofing link with brand managers and clients. They can inspect high-res split comparisons, pin visual comments, and approve final deliverables without logging into internal tooling.
            </p>

            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs font-mono text-slate-300 break-all select-all">
              {window.location.origin}/vantageecom?project={activeProject.id}&mode=client_proof
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setShowShareModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white"
              >
                Close
              </button>
              <button
                onClick={copyShareLink}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md shadow-indigo-600/30 flex items-center gap-1.5"
              >
                {copiedLink ? <Check className="w-4 h-4" /> : <Share2 className="w-4 h-4" />}
                {copiedLink ? 'Copied to Clipboard!' : 'Copy Link'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* New Production Shoot Modal */}
      {showNewProjectModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <form
            onSubmit={createNewProject}
            className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-lg w-full space-y-4 shadow-2xl"
          >
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-white text-base flex items-center gap-2">
                <Plus className="w-4 h-4 text-indigo-400" />
                Initialize New Visual Production Shoot
              </h4>
              <button
                type="button"
                onClick={() => setShowNewProjectModal(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Shoot / Collection Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Summer Linen Resort Wear 2025"
                  value={newProjectForm.title}
                  onChange={e => setNewProjectForm({ ...newProjectForm, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Brand / Client Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Solace Studios"
                    value={newProjectForm.clientName}
                    onChange={e => setNewProjectForm({ ...newProjectForm, clientName: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Expected SKU Count</label>
                  <input
                    type="number"
                    min="1"
                    value={newProjectForm.skuCount}
                    onChange={e => setNewProjectForm({ ...newProjectForm, skuCount: parseInt(e.target.value) || 1 })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Product Category</label>
                <select
                  value={newProjectForm.category}
                  onChange={e => setNewProjectForm({ ...newProjectForm, category: e.target.value as any })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:outline-none focus:border-indigo-500"
                >
                  <option value="Fashion & Apparel">Fashion & Apparel</option>
                  <option value="Footwear & Bags">Footwear & Bags</option>
                  <option value="Jewelry & Watches">Jewelry & Watches</option>
                  <option value="Home & Living">Home & Living</option>
                  <option value="Electronics & Gadgets">Electronics & Gadgets</option>
                  <option value="Beauty & Skincare">Beauty & Skincare</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3">
              <button
                type="button"
                onClick={() => setShowNewProjectModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md shadow-indigo-600/30"
              >
                Initialize Shoot Plan
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
