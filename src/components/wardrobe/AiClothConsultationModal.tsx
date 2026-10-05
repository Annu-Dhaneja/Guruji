import React, { useState } from 'react';
import {
  X,
  Sparkles,
  User,
  Users,
  Briefcase,
  Coffee,
  PartyPopper,
  Plane,
  Heart,
  Calendar,
  Compass,
  Check,
  RotateCcw,
  Sliders,
  ChevronRight,
  ArrowLeft,
  Globe,
  Bookmark,
  Zap,
  Tag,
  Layers,
  Flame,
  Shield,
  Smile,
  Sun,
  CloudRain,
  Share2,
} from 'lucide-react';
import {
  WardrobeClothingItem,
  ClothConsultationInput,
  ClothConsultationResult,
  ClothConsultationLook,
} from '../../types';
import { generateLocalClothConsultation } from '../../data/wardrobeData';

interface AiClothConsultationModalProps {
  isOpen: boolean;
  onClose: () => void;
  wardrobe: WardrobeClothingItem[];
  onSaveLook?: (look: any) => void;
}

export const AiClothConsultationModal: React.FC<AiClothConsultationModalProps> = ({
  isOpen,
  onClose,
  wardrobe,
  onSaveLook,
}) => {
  // Wizard steps: 1 = Who, 2 = What For, 3 = What Want, 4 = Extra & Generate, 5 = Result
  const [step, setStep] = useState<1 | 2 | 3 | 4 | 5>(1);

  // Form input state
  const [consultationInput, setConsultationInput] = useState<ClothConsultationInput>({
    personName: 'Me',
    relationship: 'Self',
    gender: 'Female',
    ageGroup: 'Adult (25-45)',
    occasion: 'Office / Work',
    vibeWant: 'Smart & Comfortable',
    extraNotes: '',
    language: 'Hinglish',
  });

  // Result state
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<ClothConsultationResult | null>(null);
  const [selectedPlanTab, setSelectedPlanTab] = useState<'primary' | 'alternative'>('primary');
  const [isSaved, setIsSaved] = useState(false);
  const [refineFeedback, setRefineFeedback] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleGenerate = async (refinementOverride?: string) => {
    setIsLoading(true);
    setStep(5);
    setIsSaved(false);

    const payloadInput: ClothConsultationInput = {
      ...consultationInput,
      extraNotes: refinementOverride
        ? `${consultationInput.extraNotes || ''} [Refinement: ${refinementOverride}]`.trim()
        : consultationInput.extraNotes,
    };

    try {
      const res = await fetch('/api/wardrobe/consultation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: wardrobe,
          input: payloadInput,
        }),
      });

      const data = await res.json();
      if (data.success && data.consultation) {
        const norm = { ...data.consultation };
        if (!norm.bestOutfit) {
          norm.bestOutfit = {
            title: norm.title || `${consultationInput.occasion || 'Smart'} Outfit`,
            vibe: consultationInput.vibeWant || 'Smart & Balanced',
            items: norm.recommendedItems || wardrobe.slice(0, 3),
            whyItWorks: norm.whyThisWorks || 'Clean styling proportion matching your occasion.',
            stylingTip: 'Maintain balanced visual proportion and carry with confidence.',
            footwearAdvice: 'Low-top clean footwear or loafers.',
            accessories: ['Minimal watch or subtle jewellery'],
          };
        }
        setResult(norm);
      } else {
        const local = generateLocalClothConsultation(wardrobe, payloadInput);
        setResult(local);
      }
    } catch (e) {
      console.warn('Fallback to local consultation engine:', e);
      const local = generateLocalClothConsultation(wardrobe, payloadInput);
      setResult(local);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLanguageSwitch = async (lang: 'Hinglish' | 'Hindi' | 'English') => {
    setConsultationInput((prev) => ({ ...prev, language: lang }));
    if (result) {
      // Re-run with new language
      setIsLoading(true);
      try {
        const res = await fetch('/api/wardrobe/consultation', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            items: wardrobe,
            input: { ...consultationInput, language: lang },
          }),
        });
        const data = await res.json();
        if (data.success && data.consultation) {
          const norm = { ...data.consultation };
          if (!norm.bestOutfit) {
            norm.bestOutfit = {
              title: norm.title || `${consultationInput.occasion || 'Smart'} Outfit`,
              vibe: consultationInput.vibeWant || 'Smart & Balanced',
              items: norm.recommendedItems || wardrobe.slice(0, 3),
              whyItWorks: norm.whyThisWorks || 'Clean styling proportion matching your occasion.',
              stylingTip: 'Maintain balanced visual proportion and carry with confidence.',
              footwearAdvice: 'Low-top clean footwear or loafers.',
              accessories: ['Minimal watch or subtle jewellery'],
            };
          }
          setResult(norm);
        } else {
          setResult(generateLocalClothConsultation(wardrobe, { ...consultationInput, language: lang }));
        }
      } catch (e) {
        setResult(generateLocalClothConsultation(wardrobe, { ...consultationInput, language: lang }));
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleRefine = (instruction: string) => {
    setRefineFeedback(instruction);
    handleGenerate(instruction);
  };

  const handleSaveCurrentLook = () => {
    if (!result) return;
    const currentLook =
      (selectedPlanTab === 'primary' ? result.bestOutfit : result.alternativeOutfit) ||
      result.bestOutfit || {
        title: result.title || `${consultationInput.occasion || 'Custom'} Look`,
        items: result.recommendedItems || [],
        stylingTip: 'Wear with confidence.',
        whyItWorks: result.whyThisWorks || '',
      };
    setIsSaved(true);
    if (onSaveLook) {
      onSaveLook({
        id: `consult-look-${Date.now()}`,
        title: currentLook.title,
        personName: consultationInput.personName,
        occasion: consultationInput.occasion,
        stylingTip: currentLook.stylingTip,
        whyItWorks: currentLook.whyItWorks,
        items: currentLook.items,
        createdAt: new Date().toISOString(),
      });
    }
  };

  const handleReset = () => {
    setStep(1);
    setResult(null);
    setIsSaved(false);
    setRefineFeedback(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-4xl max-h-[92vh] bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col my-auto">
        {/* Header */}
        <div className="p-5 sm:p-6 bg-gradient-to-r from-amber-500/15 via-rose-500/10 to-purple-500/15 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-slate-950 shadow-lg shadow-amber-500/20 font-black">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400">
                  Personal Stylist AI
                </span>
                <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-bold">
                  Cloth Consultation
                </span>
              </div>
              <h3 className="text-lg sm:text-xl font-black text-white">
                “Tell me where you're going, and I'll style what you own.”
              </h3>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {/* Language Selector */}
            <div className="flex items-center bg-slate-800/90 p-1 rounded-xl border border-slate-700">
              <Globe className="w-3.5 h-3.5 text-slate-400 ml-1.5 mr-1" />
              {(['Hinglish', 'Hindi', 'English'] as const).map((lang) => (
                <button
                  key={lang}
                  onClick={() => handleLanguageSwitch(lang)}
                  className={`px-2 py-0.5 rounded-lg text-[11px] font-bold transition-all ${
                    consultationInput.language === lang
                      ? 'bg-amber-500 text-slate-950 shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {lang}
                </button>
              ))}
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Stepper Progress Bar (Only during steps 1-4) */}
        {step < 5 && (
          <div className="px-6 pt-4 pb-2 bg-slate-900/60 border-b border-slate-800/60">
            <div className="flex items-center justify-between max-w-xl mx-auto">
              {[
                { s: 1, label: '1. Who' },
                { s: 2, label: '2. What For' },
                { s: 3, label: '3. What Want' },
                { s: 4, label: '4. Preferences' },
              ].map((item) => (
                <button
                  key={item.s}
                  onClick={() => setStep(item.s as any)}
                  className={`flex items-center space-x-1 text-xs font-bold transition-all ${
                    step === item.s
                      ? 'text-amber-400 scale-105'
                      : step > item.s
                      ? 'text-slate-300'
                      : 'text-slate-600'
                  }`}
                >
                  <span
                    className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${
                      step === item.s
                        ? 'bg-amber-500 text-slate-950'
                        : step > item.s
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : 'bg-slate-800 text-slate-500'
                    }`}
                  >
                    {step > item.s ? '✓' : item.s}
                  </span>
                  <span className="hidden sm:inline">{item.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Modal Body */}
        <div className="p-5 sm:p-7 overflow-y-auto flex-1 space-y-6">
          {/* STEP 1: WHO IS DRESSING */}
          {step === 1 && (
            <div className="space-y-6 max-w-2xl mx-auto">
              <div>
                <h4 className="text-base font-black text-white">Step 1: Who is this outfit for?</h4>
                <p className="text-xs text-slate-400 mt-1">
                  Select yourself or any family member you are styling today.
                </p>
              </div>

              {/* Quick Relationship Chips */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { name: 'Me', rel: 'Self', icon: User, desc: 'Your personal wardrobe' },
                  { name: 'Husband / Partner', rel: 'Partner', icon: Users, desc: 'Partner styling' },
                  { name: 'Child / Kids', rel: 'Child', icon: Smile, desc: 'Kids comfort & smarts' },
                  { name: 'Parents / Elder', rel: 'Elder', icon: Shield, desc: 'Classic comfort' },
                ].map((item) => (
                  <button
                    key={item.name}
                    onClick={() =>
                      setConsultationInput((prev) => ({
                        ...prev,
                        personName: item.name,
                        relationship: item.rel as any,
                      }))
                    }
                    className={`p-3.5 rounded-2xl border text-left flex flex-col justify-between transition-all ${
                      consultationInput.personName === item.name
                        ? 'bg-amber-500/15 border-amber-500 text-white shadow-lg shadow-amber-500/10'
                        : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-800/40'
                    }`}
                  >
                    <item.icon
                      className={`w-5 h-5 mb-2 ${
                        consultationInput.personName === item.name ? 'text-amber-400' : 'text-slate-500'
                      }`}
                    />
                    <div>
                      <p className="text-xs font-black">{item.name}</p>
                      <p className="text-[10px] text-slate-400">{item.desc}</p>
                    </div>
                  </button>
                ))}
              </div>

              {/* Age Group & Gender Selector */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                    Age Group
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {['Child (3-12)', 'Teen (13-19)', 'Adult (20-45)', 'Senior (45+)'].map((age) => (
                      <button
                        key={age}
                        onClick={() => setConsultationInput((prev) => ({ ...prev, ageGroup: age }))}
                        className={`p-2.5 rounded-xl border text-xs font-bold transition-all text-center ${
                          consultationInput.ageGroup === age
                            ? 'bg-amber-500 text-slate-950 border-amber-500'
                            : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700'
                        }`}
                      >
                        {age}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                    Gender Expression
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {['Female', 'Male', 'Unisex'].map((gen) => (
                      <button
                        key={gen}
                        onClick={() => setConsultationInput((prev) => ({ ...prev, gender: gen as any }))}
                        className={`p-2.5 rounded-xl border text-xs font-bold transition-all text-center ${
                          consultationInput.gender === gen
                            ? 'bg-amber-500 text-slate-950 border-amber-500'
                            : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700'
                        }`}
                      >
                        {gen}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-4 flex justify-end">
                <button
                  onClick={() => setStep(2)}
                  className="px-6 py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-black text-sm flex items-center space-x-2 shadow-lg shadow-amber-500/20 hover:brightness-110 transition-all"
                >
                  <span>Continue: What For?</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: WHAT FOR (OCCASION / DESTINATION) */}
          {step === 2 && (
            <div className="space-y-6 max-w-2xl mx-auto">
              <div>
                <h4 className="text-base font-black text-white">Step 2: Where are you going? (Occasion)</h4>
                <p className="text-xs text-slate-400 mt-1">
                  Styling context ensures appropriate formality, footwear comfort, and color tone.
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {[
                  { name: 'Office / Corporate Work', icon: Briefcase, color: 'text-blue-400' },
                  { name: 'Casual Outing / Cafe', icon: Coffee, color: 'text-amber-400' },
                  { name: 'Party / Evening Club', icon: PartyPopper, color: 'text-pink-400' },
                  { name: 'Date Night / Romantic', icon: Heart, color: 'text-rose-400' },
                  { name: 'Travel / Airport & Roadtrip', icon: Plane, color: 'text-cyan-400' },
                  { name: 'Wedding / Festive Celebration', icon: Sparkles, color: 'text-purple-400' },
                  { name: 'Family Get-Together / Puja', icon: Sun, color: 'text-orange-400' },
                  { name: 'Important Client Meeting', icon: Shield, color: 'text-emerald-400' },
                  { name: 'Relaxed Weekend At Home', icon: Smile, color: 'text-indigo-400' },
                ].map((item) => (
                  <button
                    key={item.name}
                    onClick={() => setConsultationInput((prev) => ({ ...prev, occasion: item.name }))}
                    className={`p-3.5 rounded-2xl border text-left flex items-start space-x-3 transition-all ${
                      consultationInput.occasion === item.name
                        ? 'bg-amber-500/15 border-amber-500 text-white shadow-lg shadow-amber-500/10'
                        : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-800/40'
                    }`}
                  >
                    <item.icon className={`w-5 h-5 flex-shrink-0 mt-0.5 ${item.color}`} />
                    <div>
                      <p className="text-xs font-bold leading-tight">{item.name}</p>
                    </div>
                  </button>
                ))}
              </div>

              <div className="pt-4 flex items-center justify-between">
                <button
                  onClick={() => setStep(1)}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 text-slate-300 font-bold text-xs flex items-center space-x-1.5 hover:bg-slate-700"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back</span>
                </button>

                <button
                  onClick={() => setStep(3)}
                  className="px-6 py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-black text-sm flex items-center space-x-2 shadow-lg shadow-amber-500/20 hover:brightness-110 transition-all"
                >
                  <span>Continue: What Want?</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: WHAT WANT (VIBE, COMFORT, WEATHER) */}
          {step === 3 && (
            <div className="space-y-6 max-w-2xl mx-auto">
              <div>
                <h4 className="text-base font-black text-white">Step 3: What feel or vibe do you want?</h4>
                <p className="text-xs text-slate-400 mt-1">
                  How should you feel wearing this outfit?
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {[
                  { name: 'Ultra Comfortable & Relaxed', desc: 'Breathable, stretchy, all-day ease' },
                  { name: 'High Fashion & Super Stylish', desc: 'Standout, modern statement look' },
                  { name: 'Simple & Clean Minimalist', desc: 'Effortless neutrals, timeless' },
                  { name: 'Royal / Traditional Elegance', desc: 'Ethnic rich flair & accessories' },
                  { name: 'Cool & Breathable (Hot Weather)', desc: 'Light cottons, airy fabrics' },
                  { name: 'Warm & Layered (AC/Winter)', desc: 'Cozy blazer, jacket, or scarf' },
                ].map((item) => (
                  <button
                    key={item.name}
                    onClick={() => setConsultationInput((prev) => ({ ...prev, vibeWant: item.name }))}
                    className={`p-3.5 rounded-2xl border text-left flex flex-col justify-between transition-all ${
                      consultationInput.vibeWant === item.name
                        ? 'bg-amber-500/15 border-amber-500 text-white shadow-lg shadow-amber-500/10'
                        : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-800/40'
                    }`}
                  >
                    <p className="text-xs font-black">{item.name}</p>
                    <p className="text-[10px] text-slate-400 mt-1">{item.desc}</p>
                  </button>
                ))}
              </div>

              <div className="pt-4 flex items-center justify-between">
                <button
                  onClick={() => setStep(2)}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 text-slate-300 font-bold text-xs flex items-center space-x-1.5 hover:bg-slate-700"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back</span>
                </button>

                <button
                  onClick={() => setStep(4)}
                  className="px-6 py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-black text-sm flex items-center space-x-2 shadow-lg shadow-amber-500/20 hover:brightness-110 transition-all"
                >
                  <span>Continue: Extra Preferences</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: EXTRA PREFERENCES & GENERATE */}
          {step === 4 && (
            <div className="space-y-6 max-w-2xl mx-auto">
              <div>
                <h4 className="text-base font-black text-white">Step 4: Any specific preferences or constraints?</h4>
                <p className="text-xs text-slate-400 mt-1">
                  Mention specific shoes, fabrics, colors, or things to avoid (in Hindi, Hinglish, or English).
                </p>
              </div>

              {/* Quick Preset Tags */}
              <div className="flex flex-wrap gap-2">
                {[
                  'Wear white sneakers',
                  'Cotton fabrics only',
                  'No heavy saree / western preferred',
                  'Black and white palette',
                  'Modest coverage',
                  'Pair with heels',
                  'AC room friendly jacket',
                ].map((tag) => (
                  <button
                    key={tag}
                    onClick={() =>
                      setConsultationInput((prev) => ({
                        ...prev,
                        extraNotes: prev.extraNotes ? `${prev.extraNotes}, ${tag}` : tag,
                      }))
                    }
                    className="px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 border border-slate-700 text-slate-300 text-xs font-semibold transition-colors"
                  >
                    + {tag}
                  </button>
                ))}
              </div>

              {/* Freeform Notes Box */}
              <div>
                <textarea
                  rows={3}
                  value={consultationInput.extraNotes || ''}
                  onChange={(e) =>
                    setConsultationInput((prev) => ({ ...prev, extraNotes: e.target.value }))
                  }
                  placeholder="e.g., I want to wear my blue linen shirt, or aaj barish ho sakti hai so no light colored trousers..."
                  className="w-full p-3.5 rounded-2xl bg-slate-950 border border-slate-800 text-white text-xs placeholder-slate-500 focus:outline-none focus:border-amber-500 resize-none"
                />
              </div>

              {/* Summary of Consultation Input */}
              <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800/80 flex flex-wrap items-center gap-3 text-xs">
                <span className="text-slate-400 font-bold">Consultation Summary:</span>
                <span className="px-2.5 py-0.5 rounded-lg bg-amber-500/20 text-amber-300 font-bold">
                  {consultationInput.personName} ({consultationInput.gender})
                </span>
                <span className="px-2.5 py-0.5 rounded-lg bg-blue-500/20 text-blue-300 font-bold">
                  {consultationInput.occasion}
                </span>
                <span className="px-2.5 py-0.5 rounded-lg bg-purple-500/20 text-purple-300 font-bold">
                  {consultationInput.vibeWant}
                </span>
              </div>

              <div className="pt-4 flex items-center justify-between">
                <button
                  onClick={() => setStep(3)}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 text-slate-300 font-bold text-xs flex items-center space-x-1.5 hover:bg-slate-700"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back</span>
                </button>

                <button
                  onClick={() => handleGenerate()}
                  className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 text-slate-950 font-black text-sm flex items-center space-x-2 shadow-xl shadow-amber-500/30 hover:brightness-110 transition-all"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Generate My Outfit (Style What I Own)</span>
                </button>
              </div>
            </div>
          )}

          {/* STEP 5: RESULT VIEW */}
          {step === 5 && (
            <div className="space-y-6">
              {isLoading ? (
                <div className="py-20 text-center space-y-4">
                  <div className="w-14 h-14 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center mx-auto animate-spin">
                    <Sparkles className="w-7 h-7" />
                  </div>
                  <div>
                    <h4 className="text-lg font-black text-white">
                      Curating Your Bespoke Outfit for {consultationInput.personName}...
                    </h4>
                    <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
                      Matching colors, silhouettes, comfort levels, and occasion dress codes across your {wardrobe.length} closet items.
                    </p>
                  </div>
                </div>
              ) : result ? (
                <div className="space-y-6">
                  {/* Top Bar: Summary & Language & Reset */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-slate-950/80 border border-slate-800">
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold">
                          ✓ Consultation Complete
                        </span>
                        <span className="text-xs text-slate-400">
                          Styled for <strong className="text-white">{consultationInput.personName}</strong> • {consultationInput.occasion}
                        </span>
                      </div>
                      <p className="text-xs font-semibold text-amber-400 mt-0.5">
                        {result.quickTakeaway}
                      </p>
                    </div>

                    <div className="flex items-center space-x-2">
                      <button
                        onClick={handleReset}
                        className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold flex items-center space-x-1"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>New Consult</span>
                      </button>
                      <button
                        onClick={handleSaveCurrentLook}
                        className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center space-x-1.5 transition-all ${
                          isSaved
                            ? 'bg-emerald-500 text-white'
                            : 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950'
                        }`}
                      >
                        {isSaved ? (
                          <>
                            <Check className="w-3.5 h-3.5" />
                            <span>Saved to Looks</span>
                          </>
                        ) : (
                          <>
                            <Bookmark className="w-3.5 h-3.5" />
                            <span>Save Look</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Look Tab Selector (Primary Look vs Plan B Alternative) */}
                  <div className="grid grid-cols-2 gap-2 p-1 bg-slate-950 rounded-2xl border border-slate-800">
                    <button
                      onClick={() => setSelectedPlanTab('primary')}
                      className={`py-2.5 px-3 rounded-xl text-xs font-black transition-all flex items-center justify-center space-x-2 ${
                        selectedPlanTab === 'primary'
                          ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 shadow-md'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>✨ Best Recommended Look</span>
                    </button>

                    <button
                      onClick={() => setSelectedPlanTab('alternative')}
                      className={`py-2.5 px-3 rounded-xl text-xs font-black transition-all flex items-center justify-center space-x-2 ${
                        selectedPlanTab === 'alternative'
                          ? 'bg-gradient-to-r from-purple-500 to-indigo-600 text-white shadow-md'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      <Layers className="w-3.5 h-3.5" />
                      <span>🔄 Plan B Alternative Look</span>
                    </button>
                  </div>

                  {/* Active Look Card */}
                  {(() => {
                    const look: ClothConsultationLook =
                      (selectedPlanTab === 'primary' ? result.bestOutfit : result.alternativeOutfit) ||
                      result.bestOutfit || {
                        title: `${consultationInput.occasion || 'Smart'} Styled Outfit`,
                        vibe: consultationInput.vibeWant || 'Smart & Balanced',
                        items: result.recommendedItems || wardrobe.slice(0, 2),
                        whyItWorks: result.whyThisWorks || 'Thoughtfully styled outfit matching your occasion.',
                        stylingTip: 'Carry with clean posture and effortless styling.',
                        footwearAdvice: 'Clean matching footwear.',
                        accessories: ['Minimal watch or subtle jewellery'],
                      };

                    return (
                      <div className="p-5 sm:p-6 rounded-3xl bg-slate-950/90 border border-slate-800 space-y-5">
                        {/* Title & Vibe */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-800/80">
                          <div>
                            <div className="flex items-center space-x-2 mb-1">
                              <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[11px] font-bold">
                                {look?.vibe || 'Smart & Balanced'}
                              </span>
                              <span className="px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 text-[11px]">
                                {consultationInput.occasion}
                              </span>
                            </div>
                            <h4 className="text-xl font-black text-white">{look?.title || 'Styled Look'}</h4>
                          </div>
                        </div>

                        {/* Outfit Items from Closet */}
                        <div>
                          <h5 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center space-x-1.5">
                            <Layers className="w-3.5 h-3.5 text-amber-400" />
                            <span>Pieces to Wear from Your Closet</span>
                          </h5>

                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                            {look.items && look.items.length > 0 ? (
                              look.items.map((item, idx) => (
                                <div
                                  key={idx}
                                  className="p-3 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col justify-between"
                                >
                                  <div className="aspect-square rounded-xl overflow-hidden mb-2 bg-slate-950">
                                    <img
                                      src={item.imageUrl}
                                      alt={item.name}
                                      className="w-full h-full object-cover"
                                      referrerPolicy="no-referrer"
                                    />
                                  </div>
                                  <div>
                                    <span className="text-[9px] font-bold uppercase text-slate-400 bg-slate-800 px-1.5 py-0.5 rounded">
                                      {item.category}
                                    </span>
                                    <p className="text-xs font-bold text-white mt-1 line-clamp-1">
                                      {item.name}
                                    </p>
                                    <p className="text-[10px] text-slate-400">
                                      {item.color} • {item.style}
                                    </p>
                                  </div>
                                </div>
                              ))
                            ) : (
                              <div className="col-span-4 p-4 rounded-2xl bg-slate-900/50 border border-slate-800 text-center text-xs text-slate-400">
                                Select wardrobe items above to populate visual cards.
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Why It Works & Styling Advice */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
                            <div className="flex items-center space-x-2 text-amber-400 text-xs font-black uppercase tracking-wider mb-2">
                              <Sparkles className="w-3.5 h-3.5" />
                              <span>Why This Outfit Works</span>
                            </div>
                            <p className="text-xs text-slate-300 leading-relaxed">
                              {look.whyItWorks}
                            </p>
                          </div>

                          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
                            <div className="flex items-center space-x-2 text-cyan-400 text-xs font-black uppercase tracking-wider mb-2">
                              <Compass className="w-3.5 h-3.5" />
                              <span>Styling & Footwear Advice ({consultationInput.language})</span>
                            </div>
                            <p className="text-xs text-slate-300 leading-relaxed">
                              {look.stylingTip}
                            </p>
                            <div className="mt-3 pt-3 border-t border-slate-800/80 text-xs space-y-1">
                              <p>
                                <strong className="text-white">Footwear:</strong>{' '}
                                {look.footwearAdvice}
                              </p>
                              {look.accessories && look.accessories.length > 0 && (
                                <p>
                                  <strong className="text-white">Accents:</strong>{' '}
                                  {look.accessories.join(', ')}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })()}

                  {/* "Make It Better" Instant AI Refinement Section */}
                  <div className="p-5 rounded-3xl bg-gradient-to-r from-amber-500/10 via-purple-500/10 to-pink-500/10 border border-slate-800 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Zap className="w-4 h-4 text-amber-400" />
                        <h5 className="text-xs font-black uppercase tracking-wider text-white">
                          “Make It Better” Instant AI Refinement
                        </h5>
                      </div>
                      <span className="text-[10px] text-slate-400">One-tap tweaks</span>
                    </div>

                    <p className="text-xs text-slate-400">
                      Want to tweak this recommendation? Tap any refinement button to instantly adapt your closet pieces:
                    </p>

                    <div className="flex flex-wrap gap-2 pt-1">
                      {[
                        { label: '⚡ More Stylish & Trendy', prompt: 'Make it more stylish and fashionable with modern pairing' },
                        { label: '🛋️ More Comfortable & Relaxed', prompt: 'Prioritize relaxed comfort and ease of movement' },
                        { label: '☀️ Cooler & Breathable', prompt: 'Make it lighter, airy, and heat-friendly' },
                        { label: '🧥 Add Layer / Warmer', prompt: 'Add a smart outer layer, jacket, or cozy layer' },
                        { label: '💼 More Formal / Professional', prompt: 'Elevate formality for corporate or client setting' },
                        { label: '🥻 More Traditional / Ethnic', prompt: 'Infuse traditional festive or ethnic elegance' },
                      ].map((chip) => (
                        <button
                          key={chip.label}
                          onClick={() => handleRefine(chip.prompt)}
                          disabled={isLoading}
                          className="px-3.5 py-2 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700/80 text-slate-200 text-xs font-bold flex items-center space-x-1.5 transition-all shadow-sm hover:border-amber-500/50 disabled:opacity-50"
                        >
                          <span>{chip.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              ) : null}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <span>💡 AI styles solely from items in your wardrobe inventory.</span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
