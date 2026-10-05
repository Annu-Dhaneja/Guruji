import React, { useState, useRef } from 'react';
import {
  Shirt,
  Sparkles,
  Upload,
  CheckCircle2,
  Calendar,
  Send,
  Heart,
  Plus,
  RotateCcw,
  RefreshCw,
  ShoppingBag,
  MessageSquare,
  TrendingUp,
  ArrowRight,
  UserCheck,
  Tag,
  Check,
  Bookmark,
  Plane,
  MoreVertical,
  ChevronRight,
  Zap,
  Dice5,
  Star,
  Clock,
  FlaskConical,
  Trophy,
  Users,
} from 'lucide-react';
import {
  WardrobeClothingItem,
  QuickStyleProfile,
  DayOutfitPlan,
  FamilyProfile,
} from '../types';
import {
  sampleWardrobeItems,
  generateLocal7DayPlan,
  analyzeWardrobeGaps,
  computeItemRewears,
  calculatePossibleLooks,
  getForgottenItems,
} from '../data/wardrobeData';
import { WardrobeItemCard } from '../components/wardrobe/WardrobeItemCard';
import { WardrobeItemDetailModal } from '../components/wardrobe/WardrobeItemDetailModal';
import { WardrobeUploadModal } from '../components/wardrobe/WardrobeUploadModal';
import { QuickStyleProfileStep } from '../components/wardrobe/QuickStyleProfileStep';
import { SevenDayOutfitPlanner } from '../components/wardrobe/SevenDayOutfitPlanner';
import { WardrobeGapAnalysisWidget } from '../components/wardrobe/WardrobeGapAnalysisWidget';
import { AskWardrobeAiChat } from '../components/wardrobe/AskWardrobeAiChat';
import { AskWardrobeAiDrawer } from '../components/wardrobe/AskWardrobeAiDrawer';
import { AiClothConsultationModal } from '../components/wardrobe/AiClothConsultationModal';
import { Item3LooksModal } from '../components/wardrobe/Item3LooksModal';
import { ItemSelectFor3LooksModal } from '../components/wardrobe/ItemSelectFor3LooksModal';
import { TodayOutfitWidget } from '../components/wardrobe/TodayOutfitWidget';
import { FamilyProfileSelector } from '../components/wardrobe/FamilyProfileSelector';
import { BuyOrDontBuyModal } from '../components/wardrobe/BuyOrDontBuyModal';
import { TravelPlannerModal } from '../components/wardrobe/TravelPlannerModal';
import { WardrobeInsightsWidget } from '../components/wardrobe/WardrobeInsightsWidget';
import { RateOutfitVibeModal } from '../components/wardrobe/RateOutfitVibeModal';
import { StyleDnaModal } from '../components/wardrobe/StyleDnaModal';
import { SurpriseMeModal } from '../components/wardrobe/SurpriseMeModal';
import { ForgottenClothesModal } from '../components/wardrobe/ForgottenClothesModal';
import { StyleExperimentModal } from '../components/wardrobe/StyleExperimentModal';
import { WardrobeChallengeModal } from '../components/wardrobe/WardrobeChallengeModal';
import { MoreAiToolsDrawer } from '../components/wardrobe/MoreAiToolsDrawer';
import { StyleBlueprintModal } from '../components/wardrobe/StyleBlueprintModal';

export const WardrobePlannerPage: React.FC = () => {
  // Step navigation: 1 = Wardrobe Inventory, 2 = Style Profile, 3 = 7-Day Plan & Stylist
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);

  // Core Wardrobe State
  const [wardrobe, setWardrobe] = useState<WardrobeClothingItem[]>(sampleWardrobeItems);
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [showWardrobeMenu, setShowWardrobeMenu] = useState(false);

  // Detail Modal for tapped clothing item
  const [detailItem, setDetailItem] = useState<WardrobeClothingItem | null>(null);

  // Family Profiles State
  const [familyProfiles, setFamilyProfiles] = useState<FamilyProfile[]>([
    {
      id: 'fam-me',
      name: 'Me',
      relationship: 'Self',
      gender: 'Female',
      avatarEmoji: '✨',
      itemsCount: sampleWardrobeItems.length,
    },
    {
      id: 'fam-partner',
      name: 'Partner',
      relationship: 'Partner',
      gender: 'Male',
      avatarEmoji: '🧑',
      itemsCount: 0,
    },
    {
      id: 'fam-child',
      name: 'Kids',
      relationship: 'Child',
      gender: 'Unisex',
      avatarEmoji: '👧',
      itemsCount: 0,
    },
  ]);
  const [activeFamilyProfileId, setActiveFamilyProfileId] = useState('fam-me');

  // Modal State for Upload / Edit
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<WardrobeClothingItem | null>(null);

  // Feature Modals
  const [isConsultationModalOpen, setIsConsultationModalOpen] = useState(false);
  const [selected3LooksItem, setSelected3LooksItem] = useState<WardrobeClothingItem | null>(null);
  const [isItemPickerFor3LooksOpen, setIsItemPickerFor3LooksOpen] = useState(false);
  const [isBuyModalOpen, setIsBuyModalOpen] = useState(false);
  const [isTravelModalOpen, setIsTravelModalOpen] = useState(false);
  const [isAiChatDrawerOpen, setIsAiChatDrawerOpen] = useState(false);

  // New Specialized Tool Modals
  const [isRateOutfitModalOpen, setIsRateOutfitModalOpen] = useState(false);
  const [isStyleDnaModalOpen, setIsStyleDnaModalOpen] = useState(false);
  const [isSurpriseMeModalOpen, setIsSurpriseMeModalOpen] = useState(false);
  const [isForgottenClothesModalOpen, setIsForgottenClothesModalOpen] = useState(false);
  const [isStyleExperimentModalOpen, setIsStyleExperimentModalOpen] = useState(false);
  const [isWardrobeChallengeModalOpen, setIsWardrobeChallengeModalOpen] = useState(false);
  const [isMoreAiToolsDrawerOpen, setIsMoreAiToolsDrawerOpen] = useState(false);
  const [isStyleBlueprintModalOpen, setIsStyleBlueprintModalOpen] = useState(false);

  // Step 2: Quick Style Profile
  const [profile, setProfile] = useState<QuickStyleProfile>({
    lifestyle: 'Office',
    preferredStyle: 'Smart Casual',
    outfitType: 'Office',
    colorStyle: 'Neutral',
    city: 'Delhi NCR',
    weatherPreference: 'Normal',
    targetOccasion: 'Office',
    budget: '₹2,500',
  });

  // Step 3: Generated 7-Day Plan
  const [plan, setPlan] = useState<DayOutfitPlan[]>([]);
  const [isGeneratingPlan, setIsGeneratingPlan] = useState(false);
  const [isRestyleActive, setIsRestyleActive] = useState(false);

  // VIP Human Consultation Form State
  const [vipClientName, setVipClientName] = useState('');
  const [vipClientPhone, setVipClientPhone] = useState('8527837527');
  const [vipCity, setVipCity] = useState('Delhi');
  const [vipSubmitted, setVipSubmitted] = useState(false);
  const [vipLoading, setVipLoading] = useState(false);
  const [showVipForm, setShowVipForm] = useState(false);

  // Active view tab in Step 3 (Plan vs Gap Analysis vs AI Chat)
  const [step3SubTab, setStep3SubTab] = useState<'plan' | 'gaps' | 'chat'>('plan');

  // Compute Gap Analysis based on current wardrobe
  const gapAnalysis = analyzeWardrobeGaps(wardrobe, profile);
  const rewearMap = computeItemRewears(plan);

  // Section Refs for smooth scrolling
  const todaySectionRef = useRef<HTMLDivElement>(null);
  const wardrobeSectionRef = useRef<HTMLDivElement>(null);

  // Handle Tool selection from More AI Tools Drawer
  const handleSelectMoreTool = (toolId: string) => {
    switch (toolId) {
      case 'style_blueprint':
        if (plan.length === 0) {
          triggerPlanGeneration().then(() => {
            setIsStyleBlueprintModalOpen(true);
          });
        } else {
          setIsStyleBlueprintModalOpen(true);
        }
        break;
      case 'plan_7days':
        handleStepChange(plan.length > 0 ? 3 : 2);
        break;
      case 'travel_mode':
        setIsTravelModalOpen(true);
        break;
      case 'forgotten_clothes':
        setIsForgottenClothesModalOpen(true);
        break;
      case 'buy_decision':
        setIsBuyModalOpen(true);
        break;
      case 'style_experiment':
        setIsStyleExperimentModalOpen(true);
        break;
      case 'wardrobe_challenge':
        setIsWardrobeChallengeModalOpen(true);
        break;
      case 'family_mode':
        wardrobeSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
        break;
      case 'vip_consultation':
        setShowVipForm(true);
        break;
    }
  };

  // Generate 7-day plan
  const triggerPlanGeneration = async (restyle = false) => {
    setIsGeneratingPlan(true);
    setIsRestyleActive(restyle);

    try {
      const res = await fetch('/api/wardrobe/generate-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: wardrobe,
          profile,
          restyleMode: restyle,
        }),
      });

      const data = await res.json();
      if (data.success && Array.isArray(data.plan) && data.plan.length > 0) {
        setPlan(data.plan);
      } else {
        const localPlan = generateLocal7DayPlan(wardrobe, profile, restyle);
        setPlan(localPlan);
      }
    } catch (e) {
      console.warn('Fallback to local rule generation engine:', e);
      const localPlan = generateLocal7DayPlan(wardrobe, profile, restyle);
      setPlan(localPlan);
    } finally {
      setIsGeneratingPlan(false);
    }
  };

  const handleStepChange = (step: 1 | 2 | 3) => {
    if (step === 3 && plan.length === 0) {
      triggerPlanGeneration(false);
    }
    setCurrentStep(step);
    window.scrollTo({ top: 80, behavior: 'smooth' });
  };

  // Wardrobe Management Handlers
  const handleSaveItem = (item: WardrobeClothingItem) => {
    setWardrobe((prev) => {
      const existingIdx = prev.findIndex((i) => i.id === item.id);
      if (existingIdx >= 0) {
        const updated = [...prev];
        updated[existingIdx] = item;
        return updated;
      }
      return [item, ...prev];
    });
  };

  const handleDeleteItem = (id: string) => {
    setWardrobe((prev) => prev.filter((i) => i.id !== id));
  };

  const handleToggleFavourite = (id: string) => {
    setWardrobe((prev) =>
      prev.map((i) => (i.id === id ? { ...i, isFavourite: !i.isFavourite } : i))
    );
  };

  const handleLoadSampleWardrobe = () => {
    setWardrobe(sampleWardrobeItems);
  };

  const handleClearWardrobe = () => {
    setWardrobe([]);
    setShowWardrobeMenu(false);
  };

  // Day outfit action handlers
  const handleRegenerateSingleDay = async (dayName: string, existingDay: DayOutfitPlan) => {
    try {
      const res = await fetch('/api/wardrobe/regenerate-day', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          dayName,
          existingDay,
          items: wardrobe,
          profile,
        }),
      });
      const data = await res.json();
      if (data.success && data.day) {
        setPlan((prev) => prev.map((d) => (d.dayId === existingDay.dayId ? data.day : d)));
      } else {
        const tops = wardrobe.filter((i) => i.category === 'Top' || i.category === 'Dress' || i.category === 'Shirt' || i.category === 'T-Shirt' || i.category === 'Kurta');
        const bottoms = wardrobe.filter((i) => i.category === 'Bottom' || i.category === 'Jeans' || i.category === 'Trousers');
        const shoes = wardrobe.filter((i) => i.category === 'Shoes');
        const randomTop = tops[Math.floor(Math.random() * tops.length)] || existingDay.items[0];
        const randomBottom = bottoms[Math.floor(Math.random() * bottoms.length)] || existingDay.items[1];
        const randomShoe = shoes[Math.floor(Math.random() * shoes.length)] || existingDay.items[2];

        setPlan((prev) =>
          prev.map((d) =>
            d.dayId === existingDay.dayId
              ? {
                  ...d,
                  items: [randomTop, randomBottom, randomShoe].filter(Boolean) as WardrobeClothingItem[],
                  stylingTips: `Fresh restyle with ${randomTop.name} and ${randomBottom?.name || 'bottoms'}.`,
                }
              : d
          )
        );
      }
    } catch (e) {
      console.error('Failed to regenerate single day:', e);
    }
  };

  const handleReplaceItemInDay = (
    dayId: string,
    oldItemId: string,
    newItem: WardrobeClothingItem
  ) => {
    setPlan((prev) =>
      prev.map((day) => {
        if (day.dayId !== dayId) return day;
        const newItems = day.items.map((i) => (i.id === oldItemId ? newItem : i));
        return {
          ...day,
          items: newItems,
          stylingTips: `${day.stylingTips} (Restyled with ${newItem.name} for balance).`,
        };
      })
    );
  };

  const handleToggleDayFavourite = (dayId: string) => {
    setPlan((prev) =>
      prev.map((d) => (d.dayId === dayId ? { ...d, isFavourite: !d.isFavourite } : d))
    );
  };

  const possibleLooks = calculatePossibleLooks(wardrobe);
  const forgottenItems = getForgottenItems(wardrobe, 3);

  // Filter items in inventory
  const filteredWardrobe = wardrobe.filter((item) => {
    if (categoryFilter === 'all') return true;
    if (categoryFilter === 'Shirt') return item.category === 'Shirt';
    if (categoryFilter === 'T-Shirt') return item.category === 'T-Shirt';
    if (categoryFilter === 'Top') return item.category === 'Top';
    if (categoryFilter === 'Jeans') return item.category === 'Jeans';
    if (categoryFilter === 'Trousers') return item.category === 'Trousers' || item.category === 'Shorts' || item.category === 'Skirt';
    if (categoryFilter === 'Kurta') return item.category === 'Kurta' || item.category === 'Ethnic Wear';
    if (categoryFilter === 'Saree') return item.category === 'Saree';
    if (categoryFilter === 'Jacket') return item.category === 'Jacket' || item.category === 'Outerwear';
    if (categoryFilter === 'Shoes') return item.category === 'Shoes' || item.category === 'Footwear';
    if (categoryFilter === 'Accessories') return ['Accessories', 'Bag', 'Watch'].includes(item.category);
    return item.category === categoryFilter;
  });

  const categoriesList = [
    { id: 'all', label: 'All' },
    { id: 'Shirt', label: 'Shirt' },
    { id: 'T-Shirt', label: 'T-Shirt' },
    { id: 'Top', label: 'Top' },
    { id: 'Jeans', label: 'Jeans' },
    { id: 'Trousers', label: 'Trousers' },
    { id: 'Kurta', label: 'Kurta' },
    { id: 'Saree', label: 'Saree' },
    { id: 'Jacket', label: 'Jacket' },
    { id: 'Shoes', label: 'Shoes' },
    { id: 'Accessories', label: 'Accessories' },
  ];

  const getCategoryCount = (catId: string) => {
    if (catId === 'all') return wardrobe.length;
    if (catId === 'Shirt') return wardrobe.filter((i) => i.category === 'Shirt').length;
    if (catId === 'T-Shirt') return wardrobe.filter((i) => i.category === 'T-Shirt').length;
    if (catId === 'Top') return wardrobe.filter((i) => i.category === 'Top').length;
    if (catId === 'Jeans') return wardrobe.filter((i) => i.category === 'Jeans').length;
    if (catId === 'Trousers') return wardrobe.filter((i) => ['Trousers', 'Shorts', 'Skirt'].includes(i.category)).length;
    if (catId === 'Kurta') return wardrobe.filter((i) => ['Kurta', 'Ethnic Wear'].includes(i.category)).length;
    if (catId === 'Saree') return wardrobe.filter((i) => i.category === 'Saree').length;
    if (catId === 'Jacket') return wardrobe.filter((i) => ['Jacket', 'Outerwear'].includes(i.category)).length;
    if (catId === 'Shoes') return wardrobe.filter((i) => ['Shoes', 'Footwear'].includes(i.category)).length;
    if (catId === 'Accessories') return wardrobe.filter((i) => ['Accessories', 'Bag', 'Watch'].includes(i.category)).length;
    return wardrobe.filter((i) => i.category === catId).length;
  };

  // Handle VIP consultation submit
  const handleVipSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setVipLoading(true);
    try {
      await fetch('/api/wardrobe/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clientName: vipClientName,
          clientPhone: vipClientPhone,
          city: vipCity,
          occasion: profile.targetOccasion,
          preferredStyle: profile.preferredStyle,
          budgetRange: profile.budget,
          uploadedPhotos: wardrobe.map((w) => w.imageUrl).slice(0, 5),
        }),
      });
      setVipSubmitted(true);
    } catch (err) {
      console.error(err);
    } finally {
      setVipLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-8">
      {/* ========================================================================= */}
      {/* 1. SIMPLIFIED HERO SECTION */}
      {/* ========================================================================= */}
      <div id="wardrobe-hero-section" className="text-center space-y-4 max-w-3xl mx-auto pt-2">
        <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 text-[11px] font-bold tracking-wide">
          <Sparkles className="w-3.5 h-3.5" />
          <span>AI 7-Day Smart Wardrobe Planner</span>
        </div>

        <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
          Plan 7 Days From Clothes You Already Own
        </h1>

        <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto leading-relaxed">
          Get practical outfit ideas from your existing wardrobe — without unnecessary shopping.
        </p>

        {/* Two Primary Hero Actions */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <button
            id="hero-what-to-wear-btn"
            onClick={() => {
              todaySectionRef.current?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs sm:text-sm shadow-md shadow-amber-500/15 flex items-center space-x-2 transition-all"
          >
            <Sparkles className="w-4 h-4" />
            <span>✨ What Should I Wear?</span>
          </button>

          <button
            id="hero-plan-my-week-btn"
            onClick={() => handleStepChange(plan.length > 0 ? 3 : 2)}
            className="px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 hover:border-slate-600 font-bold text-xs sm:text-sm flex items-center space-x-2 transition-all"
          >
            <Calendar className="w-4 h-4 text-amber-400" />
            <span>📅 Plan My Week</span>
          </button>
        </div>

        {/* Lightweight 3-Step Flow Stepper */}
        <div className="pt-2 max-w-md mx-auto">
          <div className="flex items-center justify-between p-1.5 rounded-xl bg-slate-900/90 border border-slate-800/80 text-xs">
            <button
              id="stepper-tab-1"
              onClick={() => handleStepChange(1)}
              className={`flex-1 py-1.5 px-2 rounded-lg font-semibold transition-all flex items-center justify-center space-x-1.5 ${
                currentStep === 1
                  ? 'bg-amber-500 text-slate-950 font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <span className="text-[10px] opacity-75">1.</span>
              <span>My Wardrobe</span>
            </button>

            <span className="text-slate-600 text-xs">→</span>

            <button
              id="stepper-tab-2"
              onClick={() => handleStepChange(2)}
              className={`flex-1 py-1.5 px-2 rounded-lg font-semibold transition-all flex items-center justify-center space-x-1.5 ${
                currentStep === 2
                  ? 'bg-amber-500 text-slate-950 font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <span className="text-[10px] opacity-75">2.</span>
              <span>Style Profile</span>
            </button>

            <span className="text-slate-600 text-xs">→</span>

            <button
              id="stepper-tab-3"
              onClick={() => handleStepChange(3)}
              className={`flex-1 py-1.5 px-2 rounded-lg font-semibold transition-all flex items-center justify-center space-x-1.5 ${
                currentStep === 3
                  ? 'bg-amber-500 text-slate-950 font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <span className="text-[10px] opacity-75">3.</span>
              <span>7-Day Plan</span>
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* STEP 1: MY WARDROBE (MAIN FOCUS) */}
      {/* ========================================================================= */}
      {currentStep === 1 && (
        <div className="space-y-8 animate-fadeIn" ref={wardrobeSectionRef}>
          {/* Family Profiles Bar - Compact & Clean */}
          <div className="p-3 rounded-2xl bg-slate-900/60 border border-slate-800/80">
            <FamilyProfileSelector
              profiles={familyProfiles}
              activeProfileId={activeFamilyProfileId}
              onSelectProfile={(id) => setActiveFamilyProfileId(id)}
              onAddProfile={(newP) => setFamilyProfiles((prev) => [...prev, newP])}
            />
          </div>

          {/* 2. GROUPED AI WARDROBE TOOLS SECTION */}
          <div id="grouped-ai-assistant-card" className="rounded-2xl bg-slate-900/90 border border-slate-800 p-5 sm:p-6 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-800/80">
              <div>
                <h3 className="text-base sm:text-lg font-bold text-white flex items-center space-x-2">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span>AI Wardrobe Tools</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Instant smart styling & closet intelligence
                </p>
              </div>

              {/* More AI Tools Launcher Button */}
              <button
                id="more-ai-tools-btn"
                onClick={() => setIsMoreAiToolsDrawerOpen(true)}
                className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-750 text-amber-300 hover:text-amber-200 border border-amber-500/20 hover:border-amber-500/40 font-bold text-xs flex items-center space-x-1.5 transition-all self-start sm:self-auto"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>More AI Tools →</span>
              </button>
            </div>

            {/* 5 Primary AI Tools Compact Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5 pt-4">
              {/* Tool 1: What Should I Wear? */}
              <button
                id="ai-tool-what-to-wear"
                onClick={() => {
                  todaySectionRef.current?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="p-3.5 rounded-xl bg-slate-950 hover:bg-slate-800/90 border border-slate-800 hover:border-amber-500/40 text-left transition-all group flex flex-col justify-between space-y-2"
              >
                <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-400 text-base">
                  👔
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-white group-hover:text-amber-400 transition-colors">
                    What Should I Wear?
                  </h4>
                  <p className="text-[10px] text-slate-400 mt-0.5">Today's instant outfit</p>
                </div>
              </button>

              {/* Tool 2: Surprise Me */}
              <button
                id="ai-tool-surprise-me"
                onClick={() => setIsSurpriseMeModalOpen(true)}
                className="p-3.5 rounded-xl bg-slate-950 hover:bg-slate-800/90 border border-slate-800 hover:border-amber-500/40 text-left transition-all group flex flex-col justify-between space-y-2"
              >
                <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-400 text-base">
                  🎲
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-white group-hover:text-amber-400 transition-colors">
                    Surprise Me
                  </h4>
                  <p className="text-[10px] text-slate-400 mt-0.5">Unexpected closet mixes</p>
                </div>
              </button>

              {/* Tool 3: 1 Item → 5 Looks */}
              <button
                id="ai-tool-style-item"
                onClick={() => {
                  if (wardrobe.length > 0) {
                    setIsItemPickerFor3LooksOpen(true);
                  }
                }}
                className="p-3.5 rounded-xl bg-slate-950 hover:bg-slate-800/90 border border-slate-800 hover:border-amber-500/40 text-left transition-all group flex flex-col justify-between space-y-2"
              >
                <div className="w-8 h-8 rounded-lg bg-cyan-500/10 flex items-center justify-center text-cyan-400 text-base">
                  🔄
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-white group-hover:text-cyan-400 transition-colors">
                    1 Item → 5 Looks
                  </h4>
                  <p className="text-[10px] text-slate-400 mt-0.5">Maximize piece utility</p>
                </div>
              </button>

              {/* Tool 4: Rate My Outfit */}
              <button
                id="ai-tool-rate-outfit"
                onClick={() => setIsRateOutfitModalOpen(true)}
                className="p-3.5 rounded-xl bg-slate-950 hover:bg-slate-800/90 border border-slate-800 hover:border-amber-500/40 text-left transition-all group flex flex-col justify-between space-y-2"
              >
                <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center text-purple-400 text-base">
                  ⭐
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-white group-hover:text-purple-400 transition-colors">
                    Rate My Outfit
                  </h4>
                  <p className="text-[10px] text-slate-400 mt-0.5">Vibe check & 10/10 tips</p>
                </div>
              </button>

              {/* Tool 5: My Style DNA */}
              <button
                id="ai-tool-style-dna"
                onClick={() => setIsStyleDnaModalOpen(true)}
                className="p-3.5 rounded-xl bg-slate-950 hover:bg-slate-800/90 border border-slate-800 hover:border-amber-500/40 text-left transition-all group flex flex-col justify-between space-y-2"
              >
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400 text-base">
                  🧬
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-white group-hover:text-emerald-400 transition-colors">
                    My Style DNA
                  </h4>
                  <p className="text-[10px] text-slate-400 mt-0.5">Palette & versatility rating</p>
                </div>
              </button>
            </div>
          </div>

          {/* AI CONSULTATION SUMMARY CARD (Simple & Clear) */}
          <div id="consultation-summary-banner" className="rounded-2xl bg-gradient-to-r from-amber-500/10 via-slate-900 to-purple-500/10 border border-amber-500/30 p-4 sm:p-5 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-start sm:items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center shrink-0">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-amber-400">
                  Stylist Consultation Summary
                </span>
                <p className="text-xs sm:text-sm font-semibold text-slate-200 mt-0.5">
                  <strong className="text-white">Your Style:</strong> Your wardrobe works best with smart-casual, comfortable combinations and easy layering.
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsStyleBlueprintModalOpen(true)}
              className="px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shrink-0 self-start sm:self-center transition-all shadow-sm"
            >
              View Blueprint PDF
            </button>
          </div>

          {/* 3. MY WARDROBE SECTION (THE MAIN FOCUS) */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                  My Wardrobe
                </h2>
                <p className="text-xs font-semibold text-amber-400 mt-0.5">
                  {wardrobe.length} Pieces • {possibleLooks} Possible Looks
                </p>
              </div>

              {/* Right Side Actions */}
              <div className="flex items-center space-x-2">
                <button
                  id="add-clothes-btn"
                  onClick={() => {
                    setEditingItem(null);
                    setIsUploadModalOpen(true);
                  }}
                  className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-sm flex items-center space-x-1.5 transition-all"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>+ Add Clothes</span>
                </button>

                <button
                  id="load-sample-btn"
                  onClick={handleLoadSampleWardrobe}
                  className="px-3 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-slate-300 hover:text-white text-xs font-semibold border border-slate-700 transition-colors"
                >
                  Load Sample
                </button>

                {/* More Options Menu (Clear All etc.) */}
                <div className="relative">
                  <button
                    id="wardrobe-more-menu-btn"
                    onClick={() => setShowWardrobeMenu(!showWardrobeMenu)}
                    className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-700 transition-colors"
                    title="More actions"
                  >
                    <MoreVertical className="w-4 h-4" />
                  </button>

                  {showWardrobeMenu && (
                    <div
                      className="absolute right-0 top-10 z-30 w-44 rounded-xl bg-slate-900 border border-slate-800 shadow-xl py-1 text-xs text-slate-200 animate-fadeIn"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button
                        onClick={handleLoadSampleWardrobe}
                        className="w-full px-3 py-2 text-left hover:bg-slate-800 flex items-center space-x-2"
                      >
                        <RefreshCw className="w-3.5 h-3.5 text-amber-400" />
                        <span>Reset to Sample</span>
                      </button>
                      <button
                        onClick={handleClearWardrobe}
                        className="w-full px-3 py-2 text-left hover:bg-rose-500/10 text-rose-400 flex items-center space-x-2"
                      >
                        <span>Clear All Clothes</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Category Filter Horizontal Scroll */}
            <div className="flex items-center space-x-2 overflow-x-auto pb-1.5 no-scrollbar">
              {categoriesList.map((tab) => {
                const count = getCategoryCount(tab.id);
                return (
                  <button
                    key={tab.id}
                    id={`filter-tab-${tab.id.toLowerCase()}`}
                    onClick={() => setCategoryFilter(tab.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all shrink-0 flex items-center space-x-1.5 ${
                      categoryFilter === tab.id
                        ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                        : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800/80'
                    }`}
                  >
                    <span>{tab.label}</span>
                    <span
                      className={`text-[10px] ${
                        categoryFilter === tab.id ? 'text-slate-950/80 font-bold' : 'text-slate-500'
                      }`}
                    >
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Wardrobe Items Grid: Clean, mobile-friendly 2 cols on mobile, 3-4 on desktop */}
            {filteredWardrobe.length === 0 ? (
              <div className="p-10 rounded-2xl bg-slate-900/60 border border-dashed border-slate-800 text-center space-y-3">
                <Shirt className="w-10 h-10 text-slate-500 mx-auto" />
                <h4 className="text-sm font-bold text-white">No items in this category</h4>
                <p className="text-xs text-slate-400 max-w-xs mx-auto">
                  Add photos of your clothes or load the sample capsule wardrobe.
                </p>
                <div className="pt-2 flex items-center justify-center gap-2">
                  <button
                    onClick={() => setIsUploadModalOpen(true)}
                    className="px-4 py-2 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs"
                  >
                    + Add Item
                  </button>
                  <button
                    onClick={handleLoadSampleWardrobe}
                    className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-bold text-xs"
                  >
                    Load Sample
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-3 sm:gap-4">
                {filteredWardrobe.map((item) => (
                  <WardrobeItemCard
                    key={item.id}
                    item={item}
                    rewearCount={rewearMap[item.id] || 0}
                    onToggleFavourite={handleToggleFavourite}
                    onEdit={(itm) => {
                      setEditingItem(itm);
                      setIsUploadModalOpen(true);
                    }}
                    onDelete={handleDeleteItem}
                    onStyle3Ways={(itm) => setSelected3LooksItem(itm)}
                    onOpenDetail={(itm) => setDetailItem(itm)}
                  />
                ))}
              </div>
            )}
          </div>

          {/* 4. TODAY'S INSTANT OUTFIT WIDGET */}
          <div ref={todaySectionRef}>
            <TodayOutfitWidget
              wardrobe={wardrobe}
              onOpenConsultation={() => setIsConsultationModalOpen(true)}
              onSaveLook={(look) => {
                console.log('Saved look:', look);
              }}
            />
          </div>

          {/* 5. FORGOTTEN CLOTHES SECTION (BRING THEM BACK) */}
          {forgottenItems.length > 0 && (
            <div
              id="forgotten-clothes-section"
              className="rounded-2xl bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 border border-slate-800 p-5 sm:p-6 space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <div className="inline-flex items-center space-x-1.5 text-xs font-bold text-amber-400 mb-1">
                    <Clock className="w-3.5 h-3.5" />
                    <span>Forgotten Clothes (Bring Them Back)</span>
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-white">
                    You haven&apos;t worn these {forgottenItems.length} pieces recently.
                  </h3>
                  <p className="text-xs text-slate-400">
                    Rediscover under-worn clothes and generate fresh new combinations without buying anything new.
                  </p>
                </div>

                <button
                  id="forgotten-create-new-look-btn"
                  onClick={() => setIsForgottenClothesModalOpen(true)}
                  className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center space-x-2 transition-all shadow-md self-start sm:self-auto shrink-0"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Create New Look</span>
                </button>
              </div>

              {/* 3 Forgotten Items Preview Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                {forgottenItems.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => setIsForgottenClothesModalOpen(true)}
                    className="p-3 rounded-xl bg-slate-950/80 border border-slate-800/80 hover:border-amber-500/40 cursor-pointer transition-all flex items-center space-x-3 group"
                  >
                    <div className="w-14 h-14 rounded-lg overflow-hidden bg-slate-900 shrink-0">
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <span className="text-[10px] text-amber-400 font-bold uppercase block">
                        {item.category}
                      </span>
                      <h4 className="text-xs font-bold text-white truncate group-hover:text-amber-400 transition-colors">
                        {item.name}
                      </h4>
                      <p className="text-[10px] text-slate-400 truncate">
                        {item.color} • {item.style}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 5. COMPACT 7-DAY PLAN PREVIEW (Progressive Disclosure) */}
          <div id="compact-7day-plan-preview" className="rounded-2xl bg-slate-900/80 border border-slate-800 p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white flex items-center space-x-2">
                  <Calendar className="w-4 h-4 text-amber-400" />
                  <span>Your 7-Day Plan</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  {plan.length > 0
                    ? '7-Day capsule outfit rotation ready'
                    : 'Personalized rotation generated from your existing closet'}
                </p>
              </div>

              <button
                id="view-full-7day-plan-btn"
                onClick={() => handleStepChange(plan.length > 0 ? 3 : 2)}
                className="text-xs font-bold text-amber-400 hover:text-amber-300 flex items-center space-x-1"
              >
                <span>{plan.length > 0 ? 'View Full 7-Day Plan' : 'Plan My Week'}</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {plan.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {plan.slice(0, 3).map((day, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 space-y-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-amber-400">{day.dayName}</span>
                      <span className="text-[10px] text-slate-400">{day.occasion}</span>
                    </div>
                    <p className="text-xs text-slate-200 font-medium truncate">
                      {day.items.map((i) => i.name).join(' + ') || day.theme}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-3">
                <p className="text-xs text-slate-400">
                  Ready to see a full 7-day capsule rotation from your clothes?
                </p>
                <button
                  onClick={() => handleStepChange(2)}
                  className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-all shrink-0"
                >
                  Generate 7-Day Plan →
                </button>
              </div>
            )}
          </div>

          {/* 6. AI CLOTH CONSULTATION ON-DEMAND BANNER */}
          <div id="ai-cloth-consultation-banner" className="rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-amber-950/40 border border-slate-800 p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <span className="px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 text-[11px] font-bold">
                  ✨ AI Cloth Consultation
                </span>
              </div>
              <h3 className="text-base sm:text-lg font-bold text-white">
                “Tell me where you're going. I'll style what you already own.”
              </h3>
              <p className="text-xs text-slate-400 max-w-lg">
                Going to an office meeting, dinner party, or family event? Get an instant custom outfit pairing from your exact closet.
              </p>
            </div>

            <button
              id="start-consultation-banner-btn"
              onClick={() => setIsConsultationModalOpen(true)}
              className="px-5 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs sm:text-sm shadow-sm transition-all shrink-0"
            >
              Start Consultation
            </button>
          </div>

          {/* 7. WARDROBE INSIGHTS & GAPS */}
          <WardrobeInsightsWidget
            wardrobe={wardrobe}
            profile={profile}
            onOpenGapAssistant={() => setIsBuyModalOpen(true)}
          />

          {/* Optional VIP Consultation Toggle */}
          <div className="pt-2 text-center">
            <button
              onClick={() => setShowVipForm(!showVipForm)}
              className="text-xs text-slate-400 hover:text-amber-400 transition-colors font-medium inline-flex items-center space-x-1"
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span>Optional: Request 1-on-1 Personal Video Consultation with Annu Dhaneja</span>
            </button>

            {showVipForm && (
              <div className="mt-4 p-6 rounded-2xl bg-slate-900 border border-slate-800 max-w-lg mx-auto text-left space-y-3 animate-fadeIn">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <h4 className="text-xs font-bold text-white">VIP 1-on-1 Stylist Call (₹1,499)</h4>
                  <span className="text-[10px] text-amber-400 font-bold">30 Min Private Call</span>
                </div>

                {vipSubmitted ? (
                  <div className="p-4 rounded-xl bg-emerald-500/10 text-emerald-400 text-xs text-center">
                    Request received! Our team will WhatsApp you at +91 {vipClientPhone}.
                  </div>
                ) : (
                  <form onSubmit={handleVipSubmit} className="space-y-3 text-xs">
                    <div>
                      <label className="text-slate-400 block mb-1">Your Name</label>
                      <input
                        type="text"
                        required
                        value={vipClientName}
                        onChange={(e) => setVipClientName(e.target.value)}
                        placeholder="e.g. Priyanshu Sharma"
                        className="w-full p-2 rounded-xl bg-slate-950 border border-slate-800 text-white outline-none focus:border-amber-400 text-xs"
                      />
                    </div>
                    <div>
                      <label className="text-slate-400 block mb-1">WhatsApp Phone</label>
                      <input
                        type="text"
                        required
                        value={vipClientPhone}
                        onChange={(e) => setVipClientPhone(e.target.value)}
                        className="w-full p-2 rounded-xl bg-slate-950 border border-slate-800 text-white outline-none focus:border-amber-400 text-xs"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={vipLoading}
                      className="w-full py-2.5 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs hover:bg-amber-400 transition-colors"
                    >
                      {vipLoading ? 'Sending...' : 'Book 1-on-1 Session'}
                    </button>
                  </form>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* STEP 2: QUICK STYLE PROFILE */}
      {/* ========================================================================= */}
      {currentStep === 2 && (
        <div className="animate-fadeIn">
          <QuickStyleProfileStep
            profile={profile}
            onChange={(updated) => setProfile(updated)}
            onNext={() => handleStepChange(3)}
            onBack={() => handleStepChange(1)}
          />
        </div>
      )}

      {/* ========================================================================= */}
      {/* STEP 3: 7-DAY SMART OUTFIT GENERATOR, RESTYLING, GAPS & AI CHAT */}
      {/* ========================================================================= */}
      {currentStep === 3 && (
        <div className="space-y-6 animate-fadeIn">
          {/* Sub-Navigation Switcher between Planner, Gap Analysis, and AI Stylist Chat */}
          <div className="flex items-center justify-center">
            <div className="p-1 rounded-xl bg-slate-900 border border-slate-800 flex items-center space-x-1">
              <button
                onClick={() => setStep3SubTab('plan')}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center space-x-1.5 ${
                  step3SubTab === 'plan'
                    ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>7-Day Schedule</span>
              </button>

              <button
                onClick={() => setStep3SubTab('gaps')}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center space-x-1.5 ${
                  step3SubTab === 'gaps'
                    ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <TrendingUp className="w-3.5 h-3.5" />
                <span>Wardrobe Score & Gaps</span>
              </button>

              <button
                onClick={() => setStep3SubTab('chat')}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center space-x-1.5 ${
                  step3SubTab === 'chat'
                    ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Ask Wardrobe AI</span>
              </button>
            </div>
          </div>

          {/* Sub-Tab 1: 7-Day Outfit Planner View */}
          {step3SubTab === 'plan' && (
            <SevenDayOutfitPlanner
              plan={plan}
              wardrobe={wardrobe}
              profile={profile}
              isRestyleActive={isRestyleActive}
              onRestyleWardrobe={() => triggerPlanGeneration(true)}
              onRegenerateAll={() => triggerPlanGeneration(false)}
              onRegenerateSingleDay={handleRegenerateSingleDay}
              onReplaceItemInDay={handleReplaceItemInDay}
              onToggleDayFavourite={handleToggleDayFavourite}
              onProfileChange={(updated) => {
                setProfile(updated);
                triggerPlanGeneration(isRestyleActive);
              }}
            />
          )}

          {/* Sub-Tab 2: Wardrobe Gap Analysis View */}
          {step3SubTab === 'gaps' && <WardrobeGapAnalysisWidget analysis={gapAnalysis} />}

          {/* Sub-Tab 3: Ask Wardrobe AI Chat */}
          {step3SubTab === 'chat' && (
            <AskWardrobeAiChat wardrobe={wardrobe} profile={profile} currentPlan={plan} />
          )}

          {/* Back to Wardrobe Link */}
          <div className="text-center pt-2">
            <button
              onClick={() => handleStepChange(1)}
              className="text-xs text-slate-400 hover:text-amber-400 transition-colors"
            >
              ← Back to My Wardrobe
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* FLOATING AI STYLIST PILL (Clean & Unobtrusive) */}
      {/* ========================================================================= */}
      <div className="fixed bottom-5 right-5 z-40">
        <button
          id="floating-ai-stylist-btn"
          onClick={() => setIsAiChatDrawerOpen(true)}
          className="px-4 py-2.5 rounded-full bg-slate-900 hover:bg-slate-800 text-white border border-slate-700/80 shadow-xl flex items-center space-x-2 text-xs font-bold transition-all hover:scale-105 active:scale-95"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>✨ AI Stylist</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* MODALS */}
      {/* ========================================================================= */}

      {/* 1. Item Detail Modal */}
      <WardrobeItemDetailModal
        item={detailItem}
        isOpen={!!detailItem}
        onClose={() => setDetailItem(null)}
        onToggleFavourite={handleToggleFavourite}
        onEdit={(itm) => {
          setDetailItem(null);
          setEditingItem(itm);
          setIsUploadModalOpen(true);
        }}
        onDelete={(id) => {
          setDetailItem(null);
          handleDeleteItem(id);
        }}
        onStyle3Ways={(itm) => {
          setDetailItem(null);
          setSelected3LooksItem(itm);
        }}
        rewearCount={detailItem ? rewearMap[detailItem.id] || 0 : 0}
      />

      {/* 2. Upload / Edit Modal */}
      <WardrobeUploadModal
        isOpen={isUploadModalOpen}
        onClose={() => {
          setIsUploadModalOpen(false);
          setEditingItem(null);
        }}
        onSave={handleSaveItem}
        editingItem={editingItem}
      />

      {/* 3. AI Cloth Consultation Modal */}
      <AiClothConsultationModal
        isOpen={isConsultationModalOpen}
        onClose={() => setIsConsultationModalOpen(false)}
        wardrobe={wardrobe}
        onSaveLook={(look) => {
          console.log('Saved consultation look:', look);
        }}
      />

      {/* 4. 3 Looks From 1 Item Modal */}
      <Item3LooksModal
        isOpen={!!selected3LooksItem}
        onClose={() => setSelected3LooksItem(null)}
        item={selected3LooksItem}
        wardrobe={wardrobe}
        onSaveLook={(look) => {
          console.log('Saved 3-look styling:', look);
        }}
      />

      {/* 5. Item Selector for 3 Looks (Triggered from AI Assistant Card) */}
      <ItemSelectFor3LooksModal
        isOpen={isItemPickerFor3LooksOpen}
        onClose={() => setIsItemPickerFor3LooksOpen(false)}
        wardrobe={wardrobe}
        onSelectItem={(item) => setSelected3LooksItem(item)}
      />

      {/* 6. Buy Or Don't Buy Modal */}
      <BuyOrDontBuyModal
        isOpen={isBuyModalOpen}
        onClose={() => setIsBuyModalOpen(false)}
        wardrobe={wardrobe}
      />

      {/* 7. Travel Capsule Modal */}
      <TravelPlannerModal
        isOpen={isTravelModalOpen}
        onClose={() => setIsTravelModalOpen(false)}
        wardrobe={wardrobe}
      />

      {/* 8. AI Stylist Chat Drawer */}
      <AskWardrobeAiDrawer
        isOpen={isAiChatDrawerOpen}
        onClose={() => setIsAiChatDrawerOpen(false)}
        wardrobe={wardrobe}
        profile={profile}
        currentPlan={plan}
      />

      {/* 9. Rate Outfit / Vibe Check Modal */}
      <RateOutfitVibeModal
        isOpen={isRateOutfitModalOpen}
        onClose={() => setIsRateOutfitModalOpen(false)}
        wardrobe={wardrobe}
      />

      {/* 10. Style DNA Modal */}
      <StyleDnaModal
        isOpen={isStyleDnaModalOpen}
        onClose={() => setIsStyleDnaModalOpen(false)}
        wardrobe={wardrobe}
        profile={profile}
      />

      {/* 11. Surprise Me Modal */}
      <SurpriseMeModal
        isOpen={isSurpriseMeModalOpen}
        onClose={() => setIsSurpriseMeModalOpen(false)}
        wardrobe={wardrobe}
      />

      {/* 12. Forgotten Clothes Revival Modal */}
      <ForgottenClothesModal
        isOpen={isForgottenClothesModalOpen}
        onClose={() => setIsForgottenClothesModalOpen(false)}
        wardrobe={wardrobe}
      />

      {/* 13. Style Experiment Modal */}
      <StyleExperimentModal
        isOpen={isStyleExperimentModalOpen}
        onClose={() => setIsStyleExperimentModalOpen(false)}
        wardrobe={wardrobe}
      />

      {/* 14. 30-Day Wardrobe Challenge Modal */}
      <WardrobeChallengeModal
        isOpen={isWardrobeChallengeModalOpen}
        onClose={() => setIsWardrobeChallengeModalOpen(false)}
        wardrobe={wardrobe}
      />

      {/* 15. More AI Tools Progressive Disclosure Drawer */}
      <MoreAiToolsDrawer
        isOpen={isMoreAiToolsDrawerOpen}
        onClose={() => setIsMoreAiToolsDrawerOpen(false)}
        onSelectTool={handleSelectMoreTool}
      />

      {/* 16. 7-Day Style Blueprint PDF Modal */}
      <StyleBlueprintModal
        isOpen={isStyleBlueprintModalOpen}
        onClose={() => setIsStyleBlueprintModalOpen(false)}
        plan={plan}
        wardrobe={wardrobe}
        profile={profile}
      />
    </div>
  );
};
