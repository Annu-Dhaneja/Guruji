import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Upload,
  X,
  Sparkles,
  Wand2,
  Eye,
  Save,
  FileText,
  AlertTriangle,
  Layers,
  ShieldCheck,
  RefreshCw,
  Plus,
  HelpCircle,
  Palette,
  Check,
  CheckSquare,
} from 'lucide-react';
import {
  BookCoverProjectType,
  BookCoverPackage,
  BookCoverProject,
} from '../../types';

interface BookCoverWizardProps {
  onSuccessSubmit?: (project: BookCoverProject) => void;
  initialType?: BookCoverProjectType;
}

export const BookCoverWizard: React.FC<BookCoverWizardProps> = ({
  onSuccessSubmit,
  initialType = 'new-cover',
}) => {
  // Option Selection
  const [projectType, setProjectType] = useState<BookCoverProjectType>(initialType);

  // Steps
  // Step 1: About Book
  // Step 2: Cover Kind
  // Step 3: Size & Print
  // Step 4: Style & Direction
  // Step 5: Visual Idea
  // Step 6: Existing Cover (Conditioned)
  // Step 7: Back Cover & Author Details
  // Step 8: Package Selection & Review
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [maxSteps, setMaxSteps] = useState<number>(8);

  // Live Brief Modal / Drawer State
  const [isPreviewOpen, setIsPreviewOpen] = useState<boolean>(false);
  const [isAiModalOpen, setIsAiModalOpen] = useState<boolean>(false);
  const [aiPromptInput, setAiPromptInput] = useState<string>('');
  const [isAiGenerating, setIsAiGenerating] = useState<boolean>(false);

  // Draft Save Notification State
  const [draftSavedMsg, setDraftSavedMsg] = useState<string>('');

  // Packages State
  const [packages, setPackages] = useState<BookCoverPackage[]>([]);
  const [selectedPackageId, setSelectedPackageId] = useState<string>('pkg-standard');

  // Form State
  // Step 1
  const [bookTitle, setBookTitle] = useState<string>('');
  const [subtitle, setSubtitle] = useState<string>('');
  const [authorName, setAuthorName] = useState<string>('');
  const [penName, setPenName] = useState<string>('');
  const [language, setLanguage] = useState<string>('English');
  const [customLanguage, setCustomLanguage] = useState<string>('');
  const [bookType, setBookType] = useState<string>('Fiction');
  const [shortDescription, setShortDescription] = useState<string>('');
  const [mainStoryConcept, setMainStoryConcept] = useState<string>('');

  // Customer Contact Details
  const [customerName, setCustomerName] = useState<string>('');
  const [customerEmail, setCustomerEmail] = useState<string>('');
  const [customerPhone, setCustomerPhone] = useState<string>('');

  // Step 2
  const [coverTypes, setCoverTypes] = useState<string[]>([
    'Full Paperback Cover',
    'Amazon KDP Cover',
    'Book Mockup',
  ]);

  // Step 3
  const [bookFormat, setBookFormat] = useState<string>('Paperback');
  const [trimSize, setTrimSize] = useState<string>('6 × 9 inch');
  const [customWidth, setCustomWidth] = useState<string>('');
  const [customHeight, setCustomHeight] = useState<string>('');
  const [customUnit, setCustomUnit] = useState<string>('inch');
  const [pageCount, setPageCount] = useState<number>(250);
  const [paperType, setPaperType] = useState<string>('White');
  const [interiorType, setInteriorType] = useState<string>('Black & White');
  const [publishingPlatform, setPublishingPlatform] = useState<string>('Amazon KDP');

  // Step 4
  const [styleFeels, setStyleFeels] = useState<string[]>(['Cinematic', 'Mysterious']);
  const [primaryColor, setPrimaryColor] = useState<string>('#0f172a');
  const [secondaryColor, setSecondaryColor] = useState<string>('#d97706');
  const [accentColor, setAccentColor] = useState<string>('#38bdf8');
  const [chooseColorsForMe, setChooseColorsForMe] = useState<boolean>(false);
  const [typographyPreference, setTypographyPreference] = useState<string>('Bold');

  // Step 5
  const [visualConceptText, setVisualConceptText] = useState<string>('');
  const [characterDescription, setCharacterDescription] = useState<string>('');
  const [characterAgeGroup, setCharacterAgeGroup] = useState<string>('');
  const [characterGender, setCharacterGender] = useState<string>('');
  const [characterClothing, setCharacterClothing] = useState<string>('');
  const [characterExpression, setCharacterExpression] = useState<string>('');
  const [characterPose, setCharacterPose] = useState<string>('');
  const [characterFeatures, setCharacterFeatures] = useState<string>('');
  const [locationEnvironment, setLocationEnvironment] = useState<string>('');
  const [importantObjects, setImportantObjects] = useState<string[]>(['Book', 'Moon']);
  const [objectInput, setObjectInput] = useState<string>('');
  const [mood, setMood] = useState<string>('Mysterious');
  const [referenceFiles, setReferenceFiles] = useState<string[]>([]);

  // Step 6 (Existing Cover)
  const [existingCoverUrl, setExistingCoverUrl] = useState<string>('');
  const [changesRequested, setChangesRequested] = useState<string[]>(['Overall Style', 'Typography']);
  const [whatYouLikeCurrent, setWhatYouLikeCurrent] = useState<string>('');
  const [whatYouDislikeCurrent, setWhatYouDislikeCurrent] = useState<string>('');
  const [whatShouldRemainUnchanged, setWhatShouldRemainUnchanged] = useState<string>('');

  // Step 7 (Back Cover & Author Info)
  const [backCoverDescription, setBackCoverDescription] = useState<string>('');
  const [authorBio, setAuthorBio] = useState<string>('');
  const [publisherName, setPublisherName] = useState<string>('');
  const [publisherLogoUrl, setPublisherLogoUrl] = useState<string>('');
  const [isbn, setIsbn] = useState<string>('');
  const [barcodeUrl, setBarcodeUrl] = useState<string>('');
  const [websiteSocialLinks, setWebsiteSocialLinks] = useState<string>('');
  const [otherBackCoverText, setOtherBackCoverText] = useState<string>('');
  const [authorPhotoUrl, setAuthorPhotoUrl] = useState<string>('');
  const [useAuthorPhotoOnBack, setUseAuthorPhotoOnBack] = useState<boolean>(false);

  // Surprise Me Designer Freedom
  const [surpriseMe, setSurpriseMe] = useState<boolean>(false);
  const [creativeFreedomLevel, setCreativeFreedomLevel] = useState<'Low' | 'Medium' | 'High'>('Medium');

  // Inspiration
  const [inspirationFiles, setInspirationFiles] = useState<string[]>([]);
  const [likedBookCoversText, setLikedBookCoversText] = useState<string>('');

  // Checklist Validation Warnings
  const [showChecklistWarning, setShowChecklistWarning] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submittedProject, setSubmittedProject] = useState<BookCoverProject | null>(null);

  // Fetch Packages on Mount
  useEffect(() => {
    fetch('/api/book-cover/packages')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setPackages(data);
          const popular = data.find((p: BookCoverPackage) => p.isPopular);
          if (popular) setSelectedPackageId(popular.id);
        }
      })
      .catch(console.error);
  }, []);

  // Update Max Steps based on Project Type
  useEffect(() => {
    if (projectType === 'redesign' || projectType === 'improve') {
      setMaxSteps(8);
    } else {
      setMaxSteps(7);
    }
  }, [projectType]);

  // Estimated Spine Thickness Calculation
  const calculateSpineThickness = (): string => {
    if (!pageCount || pageCount <= 0) return '0.00 inches (0 mm)';
    // Standard KDP estimate: White paper ~0.002252", Cream paper ~0.0025"
    const multiplier = paperType === 'Cream' ? 0.0025 : 0.002252;
    const thicknessInches = pageCount * multiplier;
    const thicknessMm = thicknessInches * 25.4;
    return `${thicknessInches.toFixed(3)} inches (${thicknessMm.toFixed(2)} mm) - Estimate`;
  };

  // Step Validation Check
  const validateCurrentStep = (): boolean => {
    if (currentStep === 1) {
      if (!bookTitle.trim()) {
        alert('Please enter your Book Title.');
        return false;
      }
      if (!authorName.trim()) {
        alert('Please enter the Author Name.');
        return false;
      }
    }
    if (currentStep === 2) {
      if (coverTypes.length === 0) {
        alert('Please select at least one cover type requirement.');
        return false;
      }
    }
    if ((projectType === 'redesign' || projectType === 'improve') && currentStep === 6) {
      if (!existingCoverUrl && referenceFiles.length === 0) {
        alert('Please provide your existing cover image or reference link.');
        return false;
      }
    }
    return true;
  };

  const handleNextStep = () => {
    if (!validateCurrentStep()) return;
    if (currentStep < maxSteps) {
      setCurrentStep((prev) => prev + 1);
      window.scrollTo({ top: 400, behavior: 'smooth' });
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
      window.scrollTo({ top: 400, behavior: 'smooth' });
    }
  };

  // Save Draft Simulation
  const handleSaveDraft = () => {
    const draft = {
      bookTitle,
      authorName,
      projectType,
      coverTypes,
      bookType,
      currentStep,
      timestamp: new Date().toLocaleTimeString(),
    };
    localStorage.setItem('gurucraft_book_cover_draft', JSON.stringify(draft));
    setDraftSavedMsg('Draft saved successfully on your device!');
    setTimeout(() => setDraftSavedMsg(''), 4000);
  };

  // AI Assistant Generator Call
  const handleGenerateAiBrief = async () => {
    if (!aiPromptInput.trim()) return;
    setIsAiGenerating(true);
    try {
      const res = await fetch('/api/ai/generate-book-brief', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userInput: aiPromptInput,
          title: bookTitle,
          genre: bookType,
        }),
      });
      const data = await res.json();
      if (data.brief) {
        if (data.brief.visualConceptText) setVisualConceptText(data.brief.visualConceptText);
        if (data.brief.mood) setMood(data.brief.mood);
        if (data.brief.locationEnvironment) setLocationEnvironment(data.brief.locationEnvironment);
        if (data.brief.styleFeels && Array.isArray(data.brief.styleFeels)) {
          setStyleFeels((prev) => Array.from(new Set([...prev, ...data.brief.styleFeels])));
        }
        if (data.brief.suggestedTypography) setTypographyPreference(data.brief.suggestedTypography);
        setIsAiModalOpen(false);
        setAiPromptInput('');
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsAiGenerating(false);
    }
  };

  // Simulated File Upload Handler
  const handleSimulatedFileUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    targetSetter: React.Dispatch<React.SetStateAction<string[]>>
  ) => {
    if (e.target.files && e.target.files.length > 0) {
      const samplePhotos = [
        'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=800&q=80',
      ];
      targetSetter((prev) => [...prev, ...samplePhotos]);
    }
  };

  // Missing Fields Checklist Check
  const getChecklistItems = () => {
    return [
      { label: 'Book Title', ok: !!bookTitle.trim() },
      { label: 'Author Name', ok: !!authorName.trim() },
      { label: 'Genre / Book Type', ok: !!bookType },
      { label: 'Cover Requirement', ok: coverTypes.length > 0 },
      { label: 'Trim Size & Format', ok: !!trimSize && !!bookFormat },
      { label: 'Page Count', ok: pageCount > 0 },
      { label: 'Visual Concept Description', ok: !!visualConceptText.trim() || surpriseMe },
      { label: 'Style & Color Preference', ok: styleFeels.length > 0 },
      { label: 'Customer Contact Info', ok: !!customerName && !!customerEmail },
    ];
  };

  // Final Form Submission
  const handleSubmitProject = async () => {
    const checklist = getChecklistItems();
    const missing = checklist.filter((item) => !item.ok);

    if (missing.length > 0 && !showChecklistWarning) {
      setShowChecklistWarning(true);
      return;
    }

    setIsSubmitting(true);
    const selectedPkg = packages.find((p) => p.id === selectedPackageId);

    const payload: Partial<BookCoverProject> = {
      customerName: customerName || authorName || 'Valued Author',
      customerEmail: customerEmail || 'author@example.com',
      customerPhone: customerPhone || '9876543210',
      projectType,
      bookTitle,
      subtitle,
      authorName,
      penName,
      language: language === 'Other' ? customLanguage : language,
      bookType,
      shortDescription,
      mainStoryConcept,
      coverTypes,
      bookFormat,
      trimSize: trimSize === 'Custom Size' ? `${customWidth} x ${customHeight} ${customUnit}` : trimSize,
      pageCount,
      paperType,
      interiorType,
      estimatedSpineWidth: calculateSpineThickness(),
      publishingPlatform,
      styleFeels,
      primaryColor,
      secondaryColor,
      accentColor,
      chooseColorsForMe,
      typographyPreference,
      visualConceptText,
      characterDescription,
      characterAgeGroup,
      characterGender,
      characterClothing,
      characterExpression,
      characterPose,
      characterFeatures,
      locationEnvironment,
      importantObjects,
      mood,
      referenceFiles,
      existingCoverUrl,
      changesRequested,
      whatYouLikeCurrent,
      whatYouDislikeCurrent,
      whatShouldRemainUnchanged,
      backCoverDescription,
      authorBio,
      publisherName,
      publisherLogoUrl,
      isbn,
      barcodeUrl,
      websiteSocialLinks,
      otherBackCoverText,
      authorPhotoUrl,
      useAuthorPhotoOnBack,
      surpriseMe,
      creativeFreedomLevel,
      inspirationFiles,
      likedBookCoversText,
      selectedPackageId,
      selectedPackageName: selectedPkg?.name || 'Standard Package',
      price: selectedPkg?.price || 2499,
    };

    try {
      const res = await fetch('/api/book-cover/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.project) {
        setSubmittedProject(data.project);
        if (onSuccessSubmit) onSuccessSubmit(data.project);
      }
    } catch (e) {
      console.error(e);
      alert('Error submitting book cover brief. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // If already submitted, show confirmation view
  if (submittedProject) {
    return (
      <div className="max-w-4xl mx-auto p-8 rounded-3xl bg-slate-900 border border-emerald-500/40 text-white space-y-6 text-center shadow-2xl">
        <div className="w-20 h-20 mx-auto rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/40">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <div className="space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-emerald-400">
            Order #{submittedProject.id} Confirmed
          </span>
          <h2 className="text-3xl font-black">Your Book Cover Brief is Received!</h2>
          <p className="text-sm text-slate-300 max-w-xl mx-auto">
            Annu Dhaneja and the GurucraftPro senior design team have received your details for{' '}
            <strong className="text-amber-300">"{submittedProject.bookTitle}"</strong>. We will review your brief and post your initial design concept.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-slate-950/80 border border-slate-800 text-left space-y-3 max-w-lg mx-auto text-xs text-slate-300">
          <div className="flex justify-between border-b border-slate-800 pb-2">
            <span className="text-slate-400">Selected Package:</span>
            <span className="font-bold text-white">{submittedProject.selectedPackageName}</span>
          </div>
          <div className="flex justify-between border-b border-slate-800 pb-2">
            <span className="text-slate-400">Estimated Spine:</span>
            <span className="font-bold text-cyan-300">{submittedProject.estimatedSpineWidth}</span>
          </div>
          <div className="flex justify-between border-b border-slate-800 pb-2">
            <span className="text-slate-400">Initial Status:</span>
            <span className="font-bold text-amber-400">{submittedProject.status}</span>
          </div>
        </div>

        <div className="flex flex-wrap justify-center gap-4 pt-4">
          <button
            onClick={() => {
              setSubmittedProject(null);
              setCurrentStep(1);
            }}
            className="px-6 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 font-bold text-xs"
          >
            Submit Another Book Cover
          </button>
          <a
            href="https://wa.me/918527837527?text=Hello%20Annu%20Dhaneja,%20I%20just%20submitted%20Book%20Cover%20Brief%20ID%20"
            target="_blank"
            rel="noreferrer"
            className="px-6 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 font-bold text-xs text-white flex items-center space-x-2"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Chat Directly on WhatsApp</span>
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-12">
      {/* 2. THREE MAIN SERVICE OPTIONS */}
      <div className="space-y-4">
        <div className="text-center space-y-1">
          <span className="text-xs font-bold text-purple-400 uppercase tracking-widest">
            Choose Your Project Type
          </span>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white">
            How Can We Help Your Book Cover?
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card A */}
          <div
            onClick={() => {
              setProjectType('new-cover');
              setCurrentStep(1);
            }}
            className={`p-6 rounded-3xl border-2 transition-all cursor-pointer flex flex-col justify-between space-y-4 shadow-xl ${
              projectType === 'new-cover'
                ? 'bg-purple-900/30 border-purple-500 text-white shadow-purple-500/20'
                : 'bg-white dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white hover:border-purple-400'
            }`}
          >
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-purple-500/20 text-purple-400 flex items-center justify-center">
                <BookOpen className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold">A. Create New Cover</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                For authors and publishers who don't have a cover yet and want a custom original artwork created from scratch.
              </p>
            </div>
            <button
              className={`w-full py-2.5 px-4 rounded-xl font-bold text-xs transition-all ${
                projectType === 'new-cover'
                  ? 'bg-purple-600 text-white'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
              }`}
            >
              {projectType === 'new-cover' ? '✓ Selected: Create New Cover' : 'Create New Cover'}
            </button>
          </div>

          {/* Card B */}
          <div
            onClick={() => {
              setProjectType('redesign');
              setCurrentStep(1);
            }}
            className={`p-6 rounded-3xl border-2 transition-all cursor-pointer flex flex-col justify-between space-y-4 shadow-xl ${
              projectType === 'redesign'
                ? 'bg-cyan-900/30 border-cyan-500 text-white shadow-cyan-500/20'
                : 'bg-white dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white hover:border-cyan-400'
            }`}
          >
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
                <RefreshCw className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold">B. Redesign My Existing Cover</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Upload your existing cover, explain what isn't working, and let our designer transform it into a bestseller quality design.
              </p>
            </div>
            <button
              className={`w-full py-2.5 px-4 rounded-xl font-bold text-xs transition-all ${
                projectType === 'redesign'
                  ? 'bg-cyan-600 text-white'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
              }`}
            >
              {projectType === 'redesign' ? '✓ Selected: Redesign Cover' : 'Redesign Existing Cover'}
            </button>
          </div>

          {/* Card C */}
          <div
            onClick={() => {
              setProjectType('improve');
              setCurrentStep(1);
            }}
            className={`p-6 rounded-3xl border-2 transition-all cursor-pointer flex flex-col justify-between space-y-4 shadow-xl ${
              projectType === 'improve'
                ? 'bg-amber-900/30 border-amber-500 text-white shadow-amber-500/20'
                : 'bg-white dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white hover:border-amber-400'
            }`}
          >
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
                <Wand2 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold">C. Customize / Improve My Cover</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                For authors who already like their cover concept but want professional typography tuning, color adjustment, spine & KDP formatting.
              </p>
            </div>
            <button
              className={`w-full py-2.5 px-4 rounded-xl font-bold text-xs transition-all ${
                projectType === 'improve'
                  ? 'bg-amber-600 text-white'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
              }`}
            >
              {projectType === 'improve' ? '✓ Selected: Improve Cover' : 'Improve My Cover'}
            </button>
          </div>
        </div>
      </div>

      {/* 3. MULTI-STEP WIZARD CONTAINER */}
      <div className="rounded-3xl bg-slate-900/90 border border-purple-500/30 p-6 sm:p-10 space-y-8 shadow-2xl backdrop-blur-md text-white">
        
        {/* Wizard Header Bar & Progress Indicator */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-6">
          <div className="space-y-1">
            <span className="text-xs font-bold text-purple-400 uppercase tracking-widest">
              Smart Book Cover Wizard
            </span>
            <h3 className="text-2xl font-black flex items-center space-x-2">
              <span>Step {currentStep} of {maxSteps}</span>
              <span className="text-xs font-semibold px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
                {currentStep === 1 && 'About Your Book'}
                {currentStep === 2 && 'Cover Format & Kind'}
                {currentStep === 3 && 'Book Size & Print Details'}
                {currentStep === 4 && 'Style & Direction'}
                {currentStep === 5 && 'Visual Idea'}
                {currentStep === 6 && (projectType === 'new-cover' ? 'Back Cover & Author' : 'Existing Cover Redesign')}
                {currentStep === 7 && (projectType === 'new-cover' ? 'Packages & Submit' : 'Back Cover & Author')}
                {currentStep === 8 && 'Packages & Submit'}
              </span>
            </h3>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setIsAiModalOpen(true)}
              className="px-3.5 py-2 rounded-xl bg-purple-600/30 hover:bg-purple-600/50 text-purple-300 border border-purple-500/40 text-xs font-bold flex items-center space-x-1.5 transition-all"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>Help Me Explain My Idea</span>
            </button>

            <button
              onClick={handleSaveDraft}
              className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold flex items-center space-x-1 transition-all"
            >
              <Save className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Save Draft</span>
            </button>

            <button
              onClick={() => setIsPreviewOpen(true)}
              className="px-3 py-2 rounded-xl bg-cyan-600/30 hover:bg-cyan-600/50 text-cyan-300 border border-cyan-500/40 text-xs font-bold flex items-center space-x-1 transition-all"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Preview Brief</span>
            </button>
          </div>
        </div>

        {/* Progress Bar Line */}
        <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
          <div
            className="bg-gradient-to-r from-purple-500 via-cyan-400 to-amber-400 h-full transition-all duration-300"
            style={{ width: `${(currentStep / maxSteps) * 100}%` }}
          />
        </div>

        {draftSavedMsg && (
          <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center space-x-2 animate-fade-in">
            <CheckCircle2 className="w-4 h-4" />
            <span>{draftSavedMsg}</span>
          </div>
        )}

        {/* WIZARD STEPS CONTENT */}

        {/* STEP 1 — ABOUT YOUR BOOK */}
        {currentStep === 1 && (
          <div className="space-y-6 animate-fade-in">
            <div className="space-y-1">
              <h4 className="text-xl font-bold">Step 1 — Tell Us About Your Book</h4>
              <p className="text-xs text-slate-400">
                Provide essential book details so our designer can accurately layout the title typography.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-300">
                  Book Title <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  value={bookTitle}
                  onChange={(e) => setBookTitle(e.target.value)}
                  placeholder="e.g. The Secrets of Hastinapur"
                  className="w-full px-4 py-3 rounded-2xl bg-slate-950 border border-slate-800 text-white text-sm focus:border-purple-500 focus:outline-none"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-300">Subtitle (Optional)</label>
                <input
                  type="text"
                  value={subtitle}
                  onChange={(e) => setSubtitle(e.target.value)}
                  placeholder="e.g. An Unfold Mythological Thriller"
                  className="w-full px-4 py-3 rounded-2xl bg-slate-950 border border-slate-800 text-white text-sm focus:border-purple-500 focus:outline-none"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-300">
                  Author Name <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  value={authorName}
                  onChange={(e) => setAuthorName(e.target.value)}
                  placeholder="e.g. Aarav Sharma"
                  className="w-full px-4 py-3 rounded-2xl bg-slate-950 border border-slate-800 text-white text-sm focus:border-purple-500 focus:outline-none"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-300">Pen Name (Optional)</label>
                <input
                  type="text"
                  value={penName}
                  onChange={(e) => setPenName(e.target.value)}
                  placeholder="e.g. A.S. Mystic"
                  className="w-full px-4 py-3 rounded-2xl bg-slate-950 border border-slate-800 text-white text-sm focus:border-purple-500 focus:outline-none"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-300">Book Language</label>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl bg-slate-950 border border-slate-800 text-white text-sm focus:border-purple-500 focus:outline-none"
                >
                  <option value="English">English</option>
                  <option value="Hindi">Hindi (Devnagari Script)</option>
                  <option value="Hinglish">Hinglish</option>
                  <option value="Other">Other Language</option>
                </select>
              </div>

              {language === 'Other' && (
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-300">Specify Custom Language</label>
                  <input
                    type="text"
                    value={customLanguage}
                    onChange={(e) => setCustomLanguage(e.target.value)}
                    placeholder="e.g. Punjabi, Bengali, French"
                    className="w-full px-4 py-3 rounded-2xl bg-slate-950 border border-slate-800 text-white text-sm focus:border-purple-500 focus:outline-none"
                  />
                </div>
              )}

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-300">Book Type / Genre</label>
                <select
                  value={bookType}
                  onChange={(e) => setBookType(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl bg-slate-950 border border-slate-800 text-white text-sm focus:border-purple-500 focus:outline-none"
                >
                  <option value="Fiction">Fiction</option>
                  <option value="Non-Fiction">Non-Fiction</option>
                  <option value="Novel">Novel</option>
                  <option value="Detective / Mystery">Detective / Mystery</option>
                  <option value="Romance">Romance</option>
                  <option value="Thriller">Thriller</option>
                  <option value="Horror">Horror</option>
                  <option value="Fantasy">Fantasy</option>
                  <option value="Spiritual">Spiritual / Religious</option>
                  <option value="Astrology">Astrology</option>
                  <option value="Self-Help">Self-Help</option>
                  <option value="Business">Business</option>
                  <option value="Biography">Biography</option>
                  <option value="Poetry">Poetry</option>
                  <option value="Children's Book">Children's Book</option>
                  <option value="Educational">Educational</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-300">Short Book Description (2–5 sentences)</label>
              <textarea
                rows={3}
                value={shortDescription}
                onChange={(e) => setShortDescription(e.target.value)}
                placeholder="In 2 to 5 sentences, summarize what your book is about..."
                className="w-full px-4 py-3 rounded-2xl bg-slate-950 border border-slate-800 text-white text-sm focus:border-purple-500 focus:outline-none"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-300">Main Story / Concept / Message</label>
              <textarea
                rows={4}
                value={mainStoryConcept}
                onChange={(e) => setMainStoryConcept(e.target.value)}
                placeholder="What is the central idea, main conflict, or primary message of the book?"
                className="w-full px-4 py-3 rounded-2xl bg-slate-950 border border-slate-800 text-white text-sm focus:border-purple-500 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-slate-800">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-300">Your Contact Name</label>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="e.g. Aarav Sharma"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-300">Your Email Address</label>
                <input
                  type="email"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  placeholder="e.g. aarav@example.com"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-300">WhatsApp / Phone Number</label>
                <input
                  type="text"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  placeholder="e.g. 9876543210"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs"
                />
              </div>
            </div>
          </div>
        )}

        {/* STEP 2 — WHAT KIND OF COVER DO YOU NEED? */}
        {currentStep === 2 && (
          <div className="space-y-6 animate-fade-in">
            <div className="space-y-1">
              <h4 className="text-xl font-bold">Step 2 — What Kind of Cover Do You Need?</h4>
              <p className="text-xs text-slate-400">
                Select one or multiple layout options required for your publication.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { name: 'Front Cover Only', desc: 'Ideal for Kindle, E-Books & digital PDF editions.' },
                { name: 'Full Paperback Cover', desc: 'Front + Spine + Back Cover in print-ready layout.' },
                { name: 'Hardcover Cover', desc: 'Full flap wrap dust jacket & hardcover layout.' },
                { name: 'Kindle / eBook Cover', desc: 'High-contrast RGB digital cover optimized for store thumbnails.' },
                { name: 'Amazon KDP Cover', desc: 'Exact KDP template print PDF with barcode & spine.' },
                { name: 'Complete Package', desc: 'Front + Spine + Back + eBook + 3D Marketing Mockups.' },
                { name: 'Book Mockup', desc: 'Promotional 3D book render for social media marketing.' },
              ].map((opt) => {
                const selected = coverTypes.includes(opt.name);
                return (
                  <div
                    key={opt.name}
                    onClick={() => {
                      if (selected) {
                        setCoverTypes((prev) => prev.filter((t) => t !== opt.name));
                      } else {
                        setCoverTypes((prev) => [...prev, opt.name]);
                      }
                    }}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer space-y-2 flex flex-col justify-between ${
                      selected
                        ? 'bg-purple-900/40 border-purple-500 text-white'
                        : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <h5 className="text-sm font-bold">{opt.name}</h5>
                        <div
                          className={`w-5 h-5 rounded-md flex items-center justify-center text-xs font-bold ${
                            selected ? 'bg-purple-500 text-white' : 'bg-slate-800 text-slate-500'
                          }`}
                        >
                          ✓
                        </div>
                      </div>
                      <p className="text-[11px] text-slate-400">{opt.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* STEP 3 — BOOK SIZE & PRINT DETAILS */}
        {currentStep === 3 && (
          <div className="space-y-6 animate-fade-in">
            <div className="space-y-1">
              <h4 className="text-xl font-bold">Step 3 — Book Size & Print Details</h4>
              <p className="text-xs text-slate-400">
                Specify trim dimensions and page count for accurate spine thickness calculation.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-300">Book Format</label>
                <select
                  value={bookFormat}
                  onChange={(e) => setBookFormat(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl bg-slate-950 border border-slate-800 text-white text-sm focus:border-purple-500 focus:outline-none"
                >
                  <option value="Paperback">Paperback</option>
                  <option value="Hardcover">Hardcover</option>
                  <option value="Kindle">Kindle</option>
                  <option value="eBook">eBook</option>
                  <option value="Print + eBook">Print + eBook</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-300">Trim Size</label>
                <select
                  value={trimSize}
                  onChange={(e) => setTrimSize(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl bg-slate-950 border border-slate-800 text-white text-sm focus:border-purple-500 focus:outline-none"
                >
                  <option value="5 × 8 inch">5 × 8 inch</option>
                  <option value="5.25 × 8 inch">5.25 × 8 inch</option>
                  <option value="5.5 × 8.5 inch">5.5 × 8.5 inch</option>
                  <option value="6 × 9 inch">6 × 9 inch (Standard US Novel)</option>
                  <option value="8 × 10 inch">8 × 10 inch</option>
                  <option value="A4">A4 (8.27 × 11.69 inch)</option>
                  <option value="A5">A5 (5.83 × 8.27 inch)</option>
                  <option value="Custom Size">Custom Size...</option>
                </select>
              </div>

              {trimSize === 'Custom Size' && (
                <div className="space-y-2 md:col-span-2 grid grid-cols-3 gap-2">
                  <div>
                    <label className="text-[10px] font-bold text-slate-400">Width</label>
                    <input
                      type="text"
                      value={customWidth}
                      onChange={(e) => setCustomWidth(e.target.value)}
                      placeholder="e.g. 6.5"
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-400">Height</label>
                    <input
                      type="text"
                      value={customHeight}
                      onChange={(e) => setCustomHeight(e.target.value)}
                      placeholder="e.g. 9.5"
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-400">Unit</label>
                    <select
                      value={customUnit}
                      onChange={(e) => setCustomUnit(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs"
                    >
                      <option value="inch">Inches</option>
                      <option value="mm">mm</option>
                      <option value="cm">cm</option>
                    </select>
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-300">Approximate Page Count</label>
                <input
                  type="number"
                  min={10}
                  max={2000}
                  value={pageCount}
                  onChange={(e) => setPageCount(parseInt(e.target.value) || 0)}
                  className="w-full px-4 py-3 rounded-2xl bg-slate-950 border border-slate-800 text-white text-sm focus:border-purple-500 focus:outline-none"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-300">Paper Type</label>
                <select
                  value={paperType}
                  onChange={(e) => setPaperType(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl bg-slate-950 border border-slate-800 text-white text-sm focus:border-purple-500 focus:outline-none"
                >
                  <option value="White">White Paper (Standard)</option>
                  <option value="Cream">Cream / Off-White Paper (Fiction)</option>
                  <option value="Premium">Premium Color Paper</option>
                  <option value="Not Sure">Not Sure / Designer Decision</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-300">Interior Type</label>
                <select
                  value={interiorType}
                  onChange={(e) => setInteriorType(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl bg-slate-950 border border-slate-800 text-white text-sm focus:border-purple-500 focus:outline-none"
                >
                  <option value="Black & White">Black & White Text</option>
                  <option value="Color">Full Color Interior</option>
                  <option value="Mixed">Mixed B&W + Color Plates</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-300">Publisher / Printing Platform</label>
                <select
                  value={publishingPlatform}
                  onChange={(e) => setPublishingPlatform(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl bg-slate-950 border border-slate-800 text-white text-sm focus:border-purple-500 focus:outline-none"
                >
                  <option value="Amazon KDP">Amazon KDP</option>
                  <option value="IngramSpark">IngramSpark</option>
                  <option value="Pothi / Notion Press">Pothi / Notion Press (India)</option>
                  <option value="Local Printer">Local Commercial Offset Printer</option>
                  <option value="Other">Other Platform</option>
                </select>
              </div>
            </div>

            {/* Calculated Spine Banner */}
            <div className="p-4 rounded-2xl bg-cyan-950/40 border border-cyan-500/30 flex items-center justify-between text-xs text-cyan-200">
              <div className="flex items-center space-x-2">
                <Layers className="w-5 h-5 text-cyan-400 shrink-0" />
                <div>
                  <span className="font-bold block text-white">Estimated Spine Thickness Calculation</span>
                  <span className="text-[11px] text-cyan-300">Based on {pageCount} pages ({paperType} Paper)</span>
                </div>
              </div>
              <span className="font-black text-sm text-amber-300 bg-slate-950 px-3 py-1.5 rounded-xl border border-amber-500/30">
                {calculateSpineThickness()}
              </span>
            </div>
          </div>
        )}

        {/* STEP 4 — COVER STYLE & CREATIVE DIRECTION */}
        {currentStep === 4 && (
          <div className="space-y-6 animate-fade-in">
            <div className="space-y-1">
              <h4 className="text-xl font-bold">Step 4 — Cover Style & Creative Direction</h4>
              <p className="text-xs text-slate-400">
                What should your cover feel like? Select all style tags that fit your story vision.
              </p>
            </div>

            {/* Style Feel Tag Multi-select */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-300">Style Aesthetic Tags</label>
              <div className="flex flex-wrap gap-2">
                {[
                  'Minimal',
                  'Luxury',
                  'Cinematic',
                  'Dark',
                  'Mysterious',
                  'Romantic',
                  'Emotional',
                  'Elegant',
                  'Modern',
                  'Vintage',
                  'Classic',
                  'Spiritual',
                  'Futuristic',
                  'Bold',
                  'Colorful',
                  'Professional',
                  'Children\'s',
                  'Hand-drawn',
                  'Photorealistic',
                  'Artistic',
                ].map((tag) => {
                  const sel = styleFeels.includes(tag);
                  return (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => {
                        if (sel) {
                          setStyleFeels((prev) => prev.filter((t) => t !== tag));
                        } else {
                          setStyleFeels((prev) => [...prev, tag]);
                        }
                      }}
                      className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
                        sel
                          ? 'bg-purple-600 text-white shadow-md shadow-purple-500/20'
                          : 'bg-slate-950 text-slate-400 hover:bg-slate-800 border border-slate-800'
                      }`}
                    >
                      {sel ? `✓ ${tag}` : tag}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Color Preference */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-300">Color Palette Preference</label>
                <label className="flex items-center space-x-2 text-xs text-amber-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={chooseColorsForMe}
                    onChange={(e) => setChooseColorsForMe(e.target.checked)}
                    className="rounded text-purple-600 focus:ring-purple-500"
                  />
                  <span>I don't know — choose colors for me</span>
                </label>
              </div>

              {!chooseColorsForMe && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 rounded-2xl bg-slate-950 border border-slate-800">
                  <div className="space-y-1">
                    <span className="text-[11px] text-slate-400 font-bold block">Primary Background Color</span>
                    <div className="flex items-center space-x-2">
                      <input
                        type="color"
                        value={primaryColor}
                        onChange={(e) => setPrimaryColor(e.target.value)}
                        className="w-10 h-10 rounded-xl cursor-pointer bg-transparent border-0"
                      />
                      <span className="text-xs font-mono text-slate-300">{primaryColor}</span>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[11px] text-slate-400 font-bold block">Secondary Accent Color</span>
                    <div className="flex items-center space-x-2">
                      <input
                        type="color"
                        value={secondaryColor}
                        onChange={(e) => setSecondaryColor(e.target.value)}
                        className="w-10 h-10 rounded-xl cursor-pointer bg-transparent border-0"
                      />
                      <span className="text-xs font-mono text-slate-300">{secondaryColor}</span>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[11px] text-slate-400 font-bold block">Highlight Title Color</span>
                    <div className="flex items-center space-x-2">
                      <input
                        type="color"
                        value={accentColor}
                        onChange={(e) => setAccentColor(e.target.value)}
                        className="w-10 h-10 rounded-xl cursor-pointer bg-transparent border-0"
                      />
                      <span className="text-xs font-mono text-slate-300">{accentColor}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Typography Preference */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-300">Typography Style Preference</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  'Bold',
                  'Elegant',
                  'Minimal',
                  'Handwritten',
                  'Classic Serif',
                  'Modern Sans Serif',
                  'Dramatic',
                  "Designer's Choice",
                ].map((typo) => (
                  <button
                    key={typo}
                    type="button"
                    onClick={() => setTypographyPreference(typo)}
                    className={`p-3 rounded-xl text-xs font-bold border text-center transition-all ${
                      typographyPreference === typo
                        ? 'bg-purple-900/40 border-purple-500 text-white'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    {typo}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* STEP 5 — VISUAL IDEA */}
        {currentStep === 5 && (
          <div className="space-y-6 animate-fade-in">
            <div className="space-y-1">
              <h4 className="text-xl font-bold">Step 5 — Help Our Designer Visualize Your Cover</h4>
              <p className="text-xs text-slate-400">
                Describe key elements, main characters, locations, and important objects to feature.
              </p>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-300">
                What should appear on the cover?
              </label>
              <textarea
                rows={3}
                value={visualConceptText}
                onChange={(e) => setVisualConceptText(e.target.value)}
                placeholder="Example: A mysterious woman standing near an ancient mansion under a full moon with glowing blue glyphs..."
                className="w-full px-4 py-3 rounded-2xl bg-slate-950 border border-slate-800 text-white text-sm focus:border-purple-500 focus:outline-none"
              />
            </div>

            {/* Main Character Details */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
              <h5 className="text-xs font-bold text-purple-400 uppercase tracking-wider">
                Main Character / Subject (If Applicable)
              </h5>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <input
                  type="text"
                  value={characterDescription}
                  onChange={(e) => setCharacterDescription(e.target.value)}
                  placeholder="Character Description..."
                  className="px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs"
                />
                <input
                  type="text"
                  value={characterAgeGroup}
                  onChange={(e) => setCharacterAgeGroup(e.target.value)}
                  placeholder="Age Group (e.g. 20s, Elderly)"
                  className="px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs"
                />
                <input
                  type="text"
                  value={characterGender}
                  onChange={(e) => setCharacterGender(e.target.value)}
                  placeholder="Gender"
                  className="px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs"
                />
                <input
                  type="text"
                  value={characterClothing}
                  onChange={(e) => setCharacterClothing(e.target.value)}
                  placeholder="Clothing style"
                  className="px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs"
                />
                <input
                  type="text"
                  value={characterExpression}
                  onChange={(e) => setCharacterExpression(e.target.value)}
                  placeholder="Expression / Mood"
                  className="px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs"
                />
                <input
                  type="text"
                  value={characterPose}
                  onChange={(e) => setCharacterPose(e.target.value)}
                  placeholder="Pose / Facing direction"
                  className="px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs"
                />
              </div>
            </div>

            {/* Location & Important Objects */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-300">Location / Environment</label>
                <input
                  type="text"
                  value={locationEnvironment}
                  onChange={(e) => setLocationEnvironment(e.target.value)}
                  placeholder="e.g. Ancient Temple, Cyberpunk City, Forest, Mansion"
                  className="w-full px-4 py-3 rounded-2xl bg-slate-950 border border-slate-800 text-white text-sm focus:border-purple-500 focus:outline-none"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-300">Important Objects / Symbols</label>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={objectInput}
                    onChange={(e) => setObjectInput(e.target.value)}
                    placeholder="e.g. Knife, Dagger, Rose, Clock, Ring"
                    className="flex-1 px-4 py-3 rounded-2xl bg-slate-950 border border-slate-800 text-white text-sm focus:border-purple-500 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (objectInput.trim()) {
                        setImportantObjects((prev) => [...prev, objectInput.trim()]);
                        setObjectInput('');
                      }
                    }}
                    className="px-4 rounded-2xl bg-purple-600 font-bold text-xs"
                  >
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {importantObjects.map((obj, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 text-xs flex items-center space-x-1"
                    >
                      <span>{obj}</span>
                      <X
                        className="w-3 h-3 cursor-pointer text-slate-400 hover:text-rose-400"
                        onClick={() => setImportantObjects((prev) => prev.filter((_, idx) => idx !== i))}
                      />
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Visual References Drag and Drop Uploader */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-300">Upload Visual References & Sketches</label>
              <div className="p-6 rounded-2xl border-2 border-dashed border-slate-800 bg-slate-950 text-center space-y-3 relative hover:border-purple-500 transition-all">
                <input
                  type="file"
                  multiple
                  onChange={(e) => handleSimulatedFileUpload(e, setReferenceFiles)}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <Upload className="w-8 h-8 mx-auto text-purple-400" />
                <p className="text-xs font-bold text-slate-300">Drag & Drop or Click to Upload References</p>
                <p className="text-[11px] text-slate-500">Sketches, photo inspirations, logo, or existing cover screenshots</p>
              </div>

              {referenceFiles.length > 0 && (
                <div className="flex flex-wrap gap-3 pt-2">
                  {referenceFiles.map((url, i) => (
                    <div key={i} className="relative w-20 h-20 rounded-xl overflow-hidden border border-slate-800">
                      <img src={url} alt="Ref" referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                      <button
                        onClick={() => setReferenceFiles((prev) => prev.filter((_, idx) => idx !== i))}
                        className="absolute top-1 right-1 p-1 bg-black/80 rounded-full text-rose-400"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* STEP 6 — EXISTING COVER REDESIGN (If Redesign or Improve selected) */}
        {(projectType === 'redesign' || projectType === 'improve') && currentStep === 6 && (
          <div className="space-y-6 animate-fade-in">
            <div className="space-y-1">
              <h4 className="text-xl font-bold">Step 6 — Existing Cover Analysis & Redesign Brief</h4>
              <p className="text-xs text-slate-400">
                Help us understand your current cover and what specific improvements you desire.
              </p>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-300">
                Upload Existing Cover Image <span className="text-rose-400">*</span>
              </label>
              <div className="p-6 rounded-2xl border-2 border-dashed border-slate-800 bg-slate-950 text-center space-y-2 relative">
                <input
                  type="file"
                  onChange={(e) => {
                    if (e.target.files && e.target.files.length > 0) {
                      setExistingCoverUrl(
                        'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80'
                      );
                    }
                  }}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
                <Upload className="w-8 h-8 mx-auto text-cyan-400" />
                <span className="text-xs font-bold text-slate-300 block">
                  {existingCoverUrl ? '✓ Existing Cover Uploaded' : 'Click or Drag Existing Cover File'}
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-300">What do you want changed?</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  'Title',
                  'Subtitle',
                  'Author Name',
                  'Typography',
                  'Colors',
                  'Background',
                  'Character',
                  'Images',
                  'Layout',
                  'Spine',
                  'Back Cover',
                  'Overall Style',
                  'Everything',
                ].map((item) => {
                  const sel = changesRequested.includes(item);
                  return (
                    <button
                      key={item}
                      type="button"
                      onClick={() => {
                        if (sel) {
                          setChangesRequested((prev) => prev.filter((i) => i !== item));
                        } else {
                          setChangesRequested((prev) => [...prev, item]);
                        }
                      }}
                      className={`p-2.5 rounded-xl text-xs font-bold border transition-all ${
                        sel
                          ? 'bg-cyan-900/40 border-cyan-500 text-cyan-200'
                          : 'bg-slate-950 border-slate-800 text-slate-400'
                      }`}
                    >
                      {sel ? `✓ ${item}` : item}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-300">What do you LIKE about current cover?</label>
                <textarea
                  rows={3}
                  value={whatYouLikeCurrent}
                  onChange={(e) => setWhatYouLikeCurrent(e.target.value)}
                  placeholder="e.g. I like the main color scheme and author font..."
                  className="w-full px-4 py-3 rounded-2xl bg-slate-950 border border-slate-800 text-white text-xs"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-300">What do you DISLIKE about current cover?</label>
                <textarea
                  rows={3}
                  value={whatYouDislikeCurrent}
                  onChange={(e) => setWhatYouDislikeCurrent(e.target.value)}
                  placeholder="e.g. The character looks outdated and title is hard to read..."
                  className="w-full px-4 py-3 rounded-2xl bg-slate-950 border border-slate-800 text-white text-xs"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-300">What should remain unchanged?</label>
              <textarea
                rows={2}
                value={whatShouldRemainUnchanged}
                onChange={(e) => setWhatShouldRemainUnchanged(e.target.value)}
                placeholder="Specify any logos, fonts, or symbols that MUST remain unchanged..."
                className="w-full px-4 py-3 rounded-2xl bg-slate-950 border border-slate-800 text-white text-xs"
              />
            </div>
          </div>
        )}

        {/* STEP 7 / 8 — BACK COVER & AUTHOR DETAILS & SURPRISE ME */}
        {((projectType === 'new-cover' && currentStep === 6) ||
          ((projectType === 'redesign' || projectType === 'improve') && currentStep === 7)) && (
          <div className="space-y-6 animate-fade-in">
            <div className="space-y-1">
              <h4 className="text-xl font-bold">Back Cover & Author Information</h4>
              <p className="text-xs text-slate-400">
                Provide back cover blurb, author biography, publisher details, and social links.
              </p>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-300">Back Cover Description / Blurb</label>
              <textarea
                rows={4}
                value={backCoverDescription}
                onChange={(e) => setBackCoverDescription(e.target.value)}
                placeholder="Enter the back cover blurb, review quotes, or book hook text..."
                className="w-full px-4 py-3 rounded-2xl bg-slate-950 border border-slate-800 text-white text-sm"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-300">Author Bio</label>
                <textarea
                  rows={3}
                  value={authorBio}
                  onChange={(e) => setAuthorBio(e.target.value)}
                  placeholder="Brief 2-4 sentence author biography..."
                  className="w-full px-4 py-3 rounded-2xl bg-slate-950 border border-slate-800 text-white text-xs"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-300">Website & Social Media Links</label>
                <textarea
                  rows={3}
                  value={websiteSocialLinks}
                  onChange={(e) => setWebsiteSocialLinks(e.target.value)}
                  placeholder="e.g. www.author.com, Instagram @authorhandle"
                  className="w-full px-4 py-3 rounded-2xl bg-slate-950 border border-slate-800 text-white text-xs"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-300">Publisher Name</label>
                <input
                  type="text"
                  value={publisherName}
                  onChange={(e) => setPublisherName(e.target.value)}
                  placeholder="e.g. Gurucraft Publishing"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-300">ISBN Number (Optional)</label>
                <input
                  type="text"
                  value={isbn}
                  onChange={(e) => setIsbn(e.target.value)}
                  placeholder="e.g. 978-3-16-148410-0"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs"
                />
              </div>

              <div className="space-y-1 flex items-end">
                <label className="flex items-center space-x-2 text-xs text-amber-300 cursor-pointer py-3">
                  <input
                    type="checkbox"
                    checked={useAuthorPhotoOnBack}
                    onChange={(e) => setUseAuthorPhotoOnBack(e.target.checked)}
                    className="rounded text-purple-600 focus:ring-purple-500"
                  />
                  <span>Use author photo on back cover</span>
                </label>
              </div>
            </div>

            {/* 9. DESIGNER'S FREEDOM OPTION ("Surprise Me") */}
            <div className="p-5 rounded-2xl bg-purple-950/40 border border-purple-500/40 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Wand2 className="w-5 h-5 text-purple-400" />
                  <div>
                    <h5 className="text-sm font-bold text-white">"Surprise Me" — Designer's Freedom</h5>
                    <p className="text-[11px] text-purple-300">
                      Give the designer creative control to decide or enhance the visual concept based on your story.
                    </p>
                  </div>
                </div>

                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={surpriseMe}
                    onChange={(e) => setSurpriseMe(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                </label>
              </div>

              {surpriseMe && (
                <div className="pt-2 border-t border-purple-900/50 space-y-2">
                  <span className="text-xs font-bold text-slate-300 block">Creative Freedom Level</span>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { level: 'Low', desc: 'Follow my instructions closely' },
                      { level: 'Medium', desc: 'Suggest creative improvements' },
                      { level: 'High', desc: 'Designer decides the visual concept' },
                    ].map((opt) => (
                      <button
                        key={opt.level}
                        type="button"
                        onClick={() => setCreativeFreedomLevel(opt.level as any)}
                        className={`p-3 rounded-xl border text-left transition-all ${
                          creativeFreedomLevel === opt.level
                            ? 'bg-purple-600 text-white border-purple-400'
                            : 'bg-slate-900 border-slate-800 text-slate-400'
                        }`}
                      >
                        <span className="font-bold text-xs block">{opt.level} Freedom</span>
                        <span className="text-[10px] opacity-80 block">{opt.desc}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* 10. INSPIRATION SECTION */}
            <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
              <h5 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                "Show Us What You Like" — Visual Inspiration
              </h5>
              <textarea
                rows={2}
                value={likedBookCoversText}
                onChange={(e) => setLikedBookCoversText(e.target.value)}
                placeholder="Mention famous book covers or styles you admire and what you like about them..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs"
              />
            </div>
          </div>
        )}

        {/* STEP FINAL — SERVICE PACKAGE SELECTION & CHECKLIST REVIEW */}
        {((projectType === 'new-cover' && currentStep === 7) ||
          ((projectType === 'redesign' || projectType === 'improve') && currentStep === 8)) && (
          <div className="space-y-8 animate-fade-in">
            <div className="space-y-1">
              <h4 className="text-xl font-bold">Final Step — Select Service Package & Review Brief</h4>
              <p className="text-xs text-slate-400">
                Choose a design package managed directly by our studio admin and verify your brief checklist.
              </p>
            </div>

            {/* Packages Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {packages.map((pkg) => {
                const selected = pkg.id === selectedPackageId;
                return (
                  <div
                    key={pkg.id}
                    onClick={() => setSelectedPackageId(pkg.id)}
                    className={`p-6 rounded-3xl border-2 transition-all cursor-pointer flex flex-col justify-between space-y-4 relative ${
                      selected
                        ? 'bg-purple-900/40 border-purple-500 shadow-2xl shadow-purple-500/20'
                        : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    {pkg.isPopular && (
                      <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-amber-500 text-slate-950 font-black text-[10px] uppercase tracking-wider shadow-lg">
                        Most Popular Choice
                      </span>
                    )}

                    <div className="space-y-3">
                      <div>
                        <h5 className="text-lg font-bold text-white">{pkg.name}</h5>
                        <p className="text-xs text-slate-400 mt-1">{pkg.description}</p>
                      </div>

                      <div className="flex items-baseline space-x-2">
                        <span className="text-3xl font-black text-amber-300">₹{pkg.price}</span>
                        {pkg.originalPrice && (
                          <span className="text-xs text-slate-500 line-through">₹{pkg.originalPrice}</span>
                        )}
                      </div>

                      <ul className="space-y-1.5 pt-2 border-t border-slate-800">
                        {pkg.features.map((feat, idx) => (
                          <li key={idx} className="text-xs text-slate-300 flex items-center space-x-2">
                            <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                            <span>{feat}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <button
                      className={`w-full py-2.5 px-4 rounded-xl font-bold text-xs transition-all ${
                        selected
                          ? 'bg-purple-600 text-white'
                          : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                      }`}
                    >
                      {selected ? '✓ Selected Package' : 'Select Package'}
                    </button>
                  </div>
                );
              })}
            </div>

            {/* 12. SMART COVER CHECKLIST */}
            <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
              <h5 className="text-sm font-bold text-white flex items-center space-x-2">
                <ShieldCheck className="w-5 h-5 text-cyan-400" />
                <span>Smart Cover Brief Checklist</span>
              </h5>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {getChecklistItems().map((item, idx) => (
                  <div
                    key={idx}
                    className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center space-x-2 ${
                      item.ok
                        ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-300'
                        : 'bg-rose-950/30 border-rose-500/40 text-rose-300'
                    }`}
                  >
                    {item.ok ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    ) : (
                      <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
                    )}
                    <span className="line-clamp-1">{item.label}</span>
                  </div>
                ))}
              </div>

              {showChecklistWarning && (
                <div className="p-4 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-200 text-xs space-y-2">
                  <p className="font-bold">
                    Your brief is almost ready. Adding missing details may help our designer create a higher quality cover.
                  </p>
                  <button
                    onClick={handleSubmitProject}
                    className="px-4 py-2 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs"
                  >
                    Continue & Submit Anyway
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* WIZARD BOTTOM NAVIGATION BAR */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-6 border-t border-slate-800">
          <button
            type="button"
            onClick={handlePrevStep}
            disabled={currentStep === 1}
            className="px-5 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 disabled:opacity-40 font-bold text-xs text-white flex items-center space-x-2 transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </button>

          <div className="flex items-center space-x-3">
            {currentStep < maxSteps ? (
              <button
                type="button"
                onClick={handleNextStep}
                className="px-6 py-3 rounded-2xl bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 font-bold text-xs text-white flex items-center space-x-2 shadow-lg shadow-purple-500/20 transition-all"
              >
                <span>Next Step</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                disabled={isSubmitting}
                onClick={handleSubmitProject}
                className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-purple-600 hover:from-amber-400 hover:to-purple-500 font-black text-xs text-slate-950 flex items-center space-x-2 shadow-xl shadow-amber-500/20 transition-all"
              >
                {isSubmitting ? (
                  <span>Submitting Brief...</span>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4" />
                    <span>Submit & Request Book Cover</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 13. LIVE BRIEF PREVIEW MODAL / DRAWER */}
      {isPreviewOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg h-full max-h-[90vh] rounded-3xl bg-slate-900 border border-purple-500/40 p-6 text-white space-y-6 overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center space-x-2">
                <FileText className="w-5 h-5 text-purple-400" />
                <h4 className="text-lg font-bold">YOUR BOOK COVER BRIEF</h4>
              </div>
              <button onClick={() => setIsPreviewOpen(false)} className="p-1 rounded-full hover:bg-slate-800">
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                <span className="text-[10px] text-purple-400 font-bold uppercase block">Book & Author</span>
                <p><strong className="text-slate-400">Title:</strong> {bookTitle || 'Untitled Book'}</p>
                <p><strong className="text-slate-400">Subtitle:</strong> {subtitle || 'N/A'}</p>
                <p><strong className="text-slate-400">Author:</strong> {authorName || 'N/A'}</p>
                <p><strong className="text-slate-400">Genre:</strong> {bookType}</p>
                <p><strong className="text-slate-400">Language:</strong> {language}</p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                <span className="text-[10px] text-cyan-400 font-bold uppercase block">Format & Size Specs</span>
                <p><strong className="text-slate-400">Format:</strong> {bookFormat}</p>
                <p><strong className="text-slate-400">Trim Size:</strong> {trimSize}</p>
                <p><strong className="text-slate-400">Pages:</strong> {pageCount} ({paperType} paper)</p>
                <p><strong className="text-slate-400">Spine Thickness:</strong> {calculateSpineThickness()}</p>
                <p><strong className="text-slate-400">Platform:</strong> {publishingPlatform}</p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                <span className="text-[10px] text-amber-400 font-bold uppercase block">Style & Direction</span>
                <p><strong className="text-slate-400">Styles:</strong> {styleFeels.join(', ') || 'None selected'}</p>
                <p><strong className="text-slate-400">Typography:</strong> {typographyPreference}</p>
                <p><strong className="text-slate-400">Concept:</strong> {visualConceptText || 'Surprise me / Designer decision'}</p>
                <p><strong className="text-slate-400">Mood:</strong> {mood}</p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                <span className="text-[10px] text-emerald-400 font-bold uppercase block">Contact Info</span>
                <p><strong className="text-slate-400">Name:</strong> {customerName || authorName}</p>
                <p><strong className="text-slate-400">Email:</strong> {customerEmail}</p>
                <p><strong className="text-slate-400">Phone:</strong> {customerPhone}</p>
              </div>
            </div>

            <button
              onClick={() => setIsPreviewOpen(false)}
              className="w-full py-3 rounded-2xl bg-purple-600 hover:bg-purple-500 font-bold text-xs"
            >
              Close Brief Preview
            </button>
          </div>
        </div>
      )}

      {/* 11. AI-ASSISTED CREATIVE BRIEF MODAL */}
      {isAiModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg rounded-3xl bg-slate-900 border border-amber-500/40 p-6 text-white space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-2">
                <Sparkles className="w-5 h-5 text-amber-300" />
                <h4 className="text-base font-bold">Help Me Explain My Idea (AI Brief Assistant)</h4>
              </div>
              <button onClick={() => setIsAiModalOpen(false)} className="p-1 rounded-full hover:bg-slate-800">
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            <p className="text-xs text-slate-300">
              Don't know how to describe your cover? Type a simple phrase (e.g. "dark detective story with a mysterious man in rainy city") and our AI will format a structured creative brief.
            </p>

            <textarea
              rows={4}
              value={aiPromptInput}
              onChange={(e) => setAiPromptInput(e.target.value)}
              placeholder="e.g. I want a dark detective thriller cover set in old Delhi with a mysterious man holding a torch..."
              className="w-full px-4 py-3 rounded-2xl bg-slate-950 border border-slate-800 text-white text-xs focus:border-amber-500 focus:outline-none"
            />

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setIsAiModalOpen(false)}
                className="px-4 py-2.5 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isAiGenerating || !aiPromptInput.trim()}
                onClick={handleGenerateAiBrief}
                className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs flex items-center space-x-2"
              >
                {isAiGenerating ? (
                  <span>Formatting Brief...</span>
                ) : (
                  <>
                    <Wand2 className="w-4 h-4" />
                    <span>Generate Structured Brief</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
